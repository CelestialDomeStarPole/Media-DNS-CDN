// src/lib/onedrive.js
// OneDrive 共享链接 → 稳定媒体源
//
// 两条链路：
//  A. 旧格式（1drv.ms/u/s! / 1drv.ms/f/s! / onedrive.live.com/redir?resid=...&authkey=...）
//     走微软官方 api.onedrive.com shares API（匿名，无需登录）。
//  B. 新格式（1drv.ms/u|f|v/c/{cid}/{token} 等 /c/ 链接）
//     走 OneDrive 网页版内部 API：
//       - 跟随 1drv.ms 302 → onedrive.live.com（响应 Set-Cookie: BadgerAuth，匿名会话 JWT，约 7 天）
//       - 用 Authorization: badger <BadgerAuth> 访问 my.microsoftpersonalcontent.com
//         /_api/v2.0/shares/u!{base64url(完整1drv链接)}/driveitem 获取共享项
//         /_api/v2.0/drives/{driveId}/items/{itemId}/children 列出子项
//       - 稳定媒体源: /_api/v2.0/drives/{driveId}/items/{itemId}/content
//         （每次请求带 BadgerAuth，实时返回最新直链；BadgerAuth 过期后用原始共享链接重新获取）

const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

// 批量导入总文件数上限
const MAX_CHILDREN = 200;
// 子文件夹递归深度上限
const MAX_DEPTH = 6;
// 单次解析超时(ms)
const RESOLVE_TIMEOUT_MS = 10000;

// 微软 OneDrive 文件分发 CDN 域集合(302 重定向放行, 含子域)
const ONE_DRIVE_CDN_HOSTS = [
  "files.1drv.com",
  "sharepoint.com",
  "sharepoint.cn",
  "svc.ms",
  "onedrive.com",
];

// OneDrive 网页版内部 API 域（新格式 /c/ 用）
const MY_CONTENT_HOST = "my.microsoftpersonalcontent.com";
// BadgerAuth 匿名 token 签发端点（备用，独立获取的 token 权限不足，仅作探测）
const BADGER_TOKEN_URL = "https://api-badgerp.svc.ms/v1.0/token";
const BADGER_APP_ID = "00000000-0000-0000-0000-00000481710a4";
const BADGER_SCHEME = "badger";
const OD_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

// UTF-8 -> URL-safe base64(无 = 填充)
function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64_CHARS[b0 >> 2];
    out += B64_CHARS[((b0 & 3) << 4) | (b1 >> 4)];
    if (i + 1 < bytes.length) out += B64_CHARS[((b1 & 15) << 2) | (b2 >> 6)];
    if (i + 2 < bytes.length) out += B64_CHARS[b2 & 63];
  }
  return out;
}

// 识别 OneDrive 共享链接(1drv.ms / onedrive.live.com / SharePoint 域)
export function isOneDriveShareUrl(raw) {
  if (typeof raw !== "string") return false;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return false;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const host = u.hostname.toLowerCase();
  return (
    host === "1drv.ms" ||
    host === "onedrive.live.com" ||
    host === "sharepoint.com" ||
    host.endsWith(".sharepoint.com") ||
    host === "sharepoint.cn" ||
    host.endsWith(".sharepoint.cn")
  );
}

// 识别新格式 /c/ 共享链接（需要走 my.microsoftpersonalcontent.com + BadgerAuth 链路）
// 匹配:
//   https://1drv.ms/{u|f|v}/c/{cid}/{token}
//   https://onedrive.live.com/embed?cid=...&id=...&resid=...&redeem=...
//   https://onedrive.live.com/?redeem=...&id=...&cid=...（含 redeem 参数）
export function isNewFormatShareUrl(raw) {
  if (typeof raw !== "string") return false;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return false;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const host = u.hostname.toLowerCase();
  if (host === "1drv.ms" || host === "1dro.ms") {
    if (/^\/(?:u|f|v|c)\/c\//.test(u.pathname)) return true;
    return false;
  }
  if (host === "onedrive.live.com") {
    if (u.pathname === "/embed") return true;
    // 新格式跳转 URL 带 redeem 参数；旧格式 redir?resid=...&authkey=... 不带
    if (u.searchParams.has("redeem")) return true;
  }
  return false;
}

// ---- 旧格式链路（api.onedrive.com） ----

// 共享链接 -> 元数据 API 地址(/shares/u!{enc}/root)
export function buildShareApiUrl(shareUrl) {
  return `https://api.onedrive.com/v1.0/shares/u!${base64UrlEncode(shareUrl.trim())}/root`;
}

// 共享链接 -> 稳定媒体源 content 地址。
// relPath 为空 = 单文件; 否则为文件夹内文件相对路径(含子文件夹, 段间以 / 分隔)。
export function buildContentUrl(shareUrl, relPath) {
  const base = buildShareApiUrl(shareUrl);
  if (!relPath) return `${base}/content`;
  const encoded = relPath.split("/").map(encodeURIComponent).join("/");
  return `${base}:/${encoded}:/content`;
}

async function fetchJson(url, timeoutMs, headers) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs || RESOLVE_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      signal: ctrl.signal,
      headers: Object.assign({ Accept: "application/json" }, headers || {}),
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
  return res;
}

// 解析共享链接元数据(旧格式)。
// 成功: { isFolder, name, size, childCount }
// 失败: { error: "password_required" | "unauthenticated" | "invalid" | "network" }
export async function resolveShareItem(shareUrl, timeoutMs) {
  const res = await fetchJson(buildShareApiUrl(shareUrl), timeoutMs);
  if (!res) return { error: "network" };
  if (res.status === 403) return { error: "password_required" };
  if (res.status === 401) return { error: "unauthenticated" };
  if (!res.ok) return { error: "invalid" };
  let data;
  try {
    data = await res.json();
  } catch {
    return { error: "invalid" };
  }
  if (!data || typeof data !== "object" || !data.name) return { error: "invalid" };
  const isFolder = Boolean(data.folder);
  return {
    isFolder,
    name: String(data.name || ""),
    size: Number(data.size) || 0,
    childCount: isFolder ? Number((data.folder && data.folder.childCount) || 0) : 0,
  };
}

// 递归遍历共享文件夹下全部文件(旧格式)。
// 返回 [{ name, size, relPath }], 受 MAX_CHILDREN / MAX_DEPTH 限制。
export async function listShareChildren(shareUrl, opts) {
  opts = opts || {};
  const max = opts.max || MAX_CHILDREN;
  const depth = opts.depth || MAX_DEPTH;
  const items = [];
  const root = buildShareApiUrl(shareUrl);

  const childrenUrl = (relPath) => {
    if (!relPath) return `${root}/children`;
    const encoded = relPath.split("/").map(encodeURIComponent).join("/");
    return `${root}:/${encoded}:/children`;
  };

  async function walk(relPath, level) {
    if (items.length >= max || level > depth) return;
    let next = childrenUrl(relPath);
    while (next && items.length < max) {
      const res = await fetchJson(next);
      if (!res || !res.ok) break;
      let data;
      try {
        data = await res.json();
      } catch {
        break;
      }
      const list = Array.isArray(data.value) ? data.value : [];
      for (const item of list) {
        if (items.length >= max) break;
        if (!item || typeof item !== "object") continue;
        const name = typeof item.name === "string" ? item.name : "";
        if (!name) continue;
        const childRel = relPath ? `${relPath}/${name}` : name;
        if (item.folder) {
          if (level < depth) await walk(childRel, level + 1);
        } else {
          items.push({ name, size: Number(item.size) || 0, relPath: childRel });
        }
      }
      next = typeof data["@odata.nextLink"] === "string" ? data["@odata.nextLink"] : null;
    }
  }

  await walk("", 0);
  return items;
}

// ---- 新格式 /c/ 链路（my.microsoftpersonalcontent.com + BadgerAuth） ----

// 跟随 1drv.ms 跳转链，从 onedrive.live.com 响应中收集 BadgerAuth（匿名会话 token）
// 返回 { token } 或 { error: "network" | "no-auth" }
export async function fetchBadgerAuth(shareUrl, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs || RESOLVE_TIMEOUT_MS);
  try {
    // 简易 cookie jar：Workers fetch 不会自动保存/回传 Cookie。
    // photos 模式跳转链 1drv.ms(301) -> photos.onedrive.com(302, 种 photosredir=1)
    // -> onedrive.live.com(200) 中，onedrive.live.com 依赖上一步种下的会话 cookie
    // 才会返回携带 BadgerAuth 的完整响应，因此必须把中间 Set-Cookie 手动回传。
    // BadgerAuth 单独按 Authorization: badger <token> 使用，不放入 jar。
    const jar = new Map();
    const pickCookie = (res) => {
      try {
        const raw =
          typeof res.headers.getSetCookie === "function"
            ? res.headers.getSetCookie()
            : res.headers.get("Set-Cookie")
              ? [res.headers.get("Set-Cookie")]
              : [];
        for (const c of raw) {
          const m = String(c).match(/^([^=;\s]+)=([^;]*)/);
          if (m && m[1] && m[1].toLowerCase() !== "badgerauth") {
            jar.set(m[1], m[2]); // 保留原始编码值，与浏览器回传行为一致
          }
        }
      } catch {
        /* 忽略 */
      }
    };
    const buildHeaders = () => {
      const h = { "User-Agent": OD_UA, Accept: "text/html" };
      if (jar.size) {
        h.Cookie = Array.from(jar.entries())
          .map(([k, v]) => `${k}=${v}`)
          .join("; ");
      }
      return h;
    };
    const fetchHop = (u) =>
      fetch(u, { redirect: "manual", signal: ctrl.signal, headers: buildHeaders() });

    let url = shareUrl.trim();
    let res = await fetchHop(url);
    pickCookie(res);
    let badger = extractBadgerCookie(res.headers);
    if (badger) return { token: badger, finalUrl: url };

    // 跟随有限跳转（最多 5 跳）。
    // 注意：BadgerAuth 往往由最后一跳的 onedrive.live.com 200 HTML 响应携带，
    // 而非中间 3xx 跳转响应。故循环结束后必须再检查最终响应的 Set-Cookie，
    // 否则像 1drv.ms(301) -> photos.onedrive.com(302) -> onedrive.live.com(200)
    // 这类"最后落在 200"的三跳链会错过 BadgerAuth，误落到低权限兜底 token。
    let hops = 0;
    while (res.status >= 300 && res.status < 400 && hops < 5) {
      const loc = res.headers.get("Location");
      if (!loc) break;
      url = new URL(loc, url).toString();
      res = await fetchHop(url);
      pickCookie(res);
      badger = extractBadgerCookie(res.headers);
      if (badger) return { token: badger, finalUrl: url };
      hops++;
    }

    // 兜底：最终响应（可能为 200 页面）仍可能携带 BadgerAuth
    badger = extractBadgerCookie(res.headers);
    if (badger) return { token: badger, finalUrl: url };

    // photos 模式特殊处理：1drv.ms/v/c 链接可能跳转到 onedrive.live.com/?v=photos，
    // 该页面本身不种 BadgerAuth（只有 /embed 页种），故从跳转 URL 提取 cid/id
    // 构造等价 /embed 页请求以获取 BadgerAuth。
    try {
      const finalUrlObj = new URL(url);
      // photos 模式判定：不同出口/UA 下 302 Location 可能带 v=photos 也可能不带，
      // 以 photosData / qt=allmyphotos 参数为准更可靠。
      const vParam = finalUrlObj.searchParams.get("v");
      const isPhotos =
        vParam === "photos" ||
        finalUrlObj.searchParams.has("photosData") ||
        (finalUrlObj.searchParams.get("qt") || "").toLowerCase() === "allmyphotos";
      if (isPhotos) {
        const embedUrl = photosUrlToEmbedUrl(url, base64UrlEncode(shareUrl.trim()));
        if (embedUrl) {
          url = embedUrl;
          hops = 0;
          do {
            res = await fetchHop(url);
            pickCookie(res);
            badger = extractBadgerCookie(res.headers);
            if (badger) return { token: badger, finalUrl: url };
            const loc = res.status >= 300 && res.status < 400 ? res.headers.get("Location") : null;
            if (!loc) break;
            url = new URL(loc, url).toString();
            hops++;
          } while (hops < 5);
          badger = extractBadgerCookie(res.headers);
          if (badger) return { token: badger, finalUrl: url };
        }
      }
    } catch {
      /* 忽略 */
    }

    // 兜底：尝试独立签发端点（此 token 权限通常不足，仅作为最后手段探测）
    try {
      const tr = await fetch(BADGER_TOKEN_URL, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ appid: BADGER_APP_ID }),
      });
      if (tr.ok) {
        const tj = await tr.json();
        if (tj && tj.token) return { token: tj.token, lowPrivilege: true };
      }
    } catch {
      /* 忽略 */
    }

    return { error: "no-auth" };
  } catch {
    return { error: "network" };
  } finally {
    clearTimeout(timer);
  }
}

// photos 模式跳转 URL（https://onedrive.live.com/?qt=allmyphotos&photosData=...&cid=...&id=...&v=photos）
// -> 等价的 /embed URL（/embed 页面才会种 BadgerAuth）。
// 必须原样透传 redeem 参数（=base64url(原始共享链接)），embed 页依赖它签发
// 绑定该共享的完整权限 BadgerAuth；缺失 redeem 时签发的 BadgerAuth 权限不足，
// 后续 shares/drives API 会返回 403（误报"需要密码"）。失败返回 null。
function photosUrlToEmbedUrl(raw, fallbackRedeem) {
  try {
    const u = new URL(raw);
    const cid = u.searchParams.get("cid");
    const id = u.searchParams.get("id") || u.searchParams.get("resid");
    if (!cid || !id) return null;
    const photosData = u.searchParams.get("photosData") || "";
    // redeem 参数若缺失，用原始共享链接的 base64url 兜底
    let redeem = u.searchParams.get("redeem");
    if (!redeem && fallbackRedeem) redeem = fallbackRedeem;
    let ithint = "video,mp4";
    const m = photosData.match(/[?&]ithint=([^&]+)/i);
    if (m && m[1]) ithint = decodeURIComponent(m[1]);
    const eid = encodeURIComponent(id);
    let url = `https://onedrive.live.com/embed?cid=${encodeURIComponent(cid)}&id=${eid}&resid=${eid}&ithint=${encodeURIComponent(ithint)}&embed=1&migratedtospo=true`;
    if (redeem) url += `&redeem=${encodeURIComponent(redeem)}`;
    return url;
  } catch {
    return null;
  }
}

function extractBadgerCookie(headers) {
  try {
    // 有的实现用 getSetCookie，CF Workers 支持 headers.getSetCookie()
    const raw =
      typeof headers.getSetCookie === "function"
        ? headers.getSetCookie()
        : headers.get("Set-Cookie")
          ? [headers.get("Set-Cookie")]
          : [];
    for (const c of raw) {
      const m = String(c).match(/BadgerAuth=([^;]+)/i);
      if (m && m[1]) return decodeURIComponent(m[1]);
    }
  } catch {
    /* 忽略 */
  }
  return "";
}

// 新格式：解析共享项元数据
// 成功: { isFolder, name, size, childCount, driveId, itemId, shareEnc }
// 失败: { error: "password_required" | "unauthenticated" | "invalid" | "network" | "no-auth" }
export async function resolveShareItemV2(shareUrl, badgerAuth, timeoutMs) {
  const enc = base64UrlEncode(shareUrl.trim());
  const url = `https://${MY_CONTENT_HOST}/_api/v2.0/shares/u!${enc}/driveitem?%24select=id%2CparentReference%2Cfolder%2Cbundle%2CremoteItem%2Cname%2Csize`;
  const res = await fetchJson(url, timeoutMs, {
    Authorization: `${BADGER_SCHEME} ${badgerAuth}`,
  });
  if (!res) return { error: "network" };
  if (res.status === 401) return { error: "unauthenticated" };
  if (res.status === 403) return { error: "password_required" };
  if (!res.ok) return { error: "invalid" };
  let data;
  try {
    data = await res.json();
  } catch {
    return { error: "invalid" };
  }
  if (!data || typeof data !== "object" || !data.id) return { error: "invalid" };
  const isFolder = Boolean(data.folder);
  const driveId =
    data.parentReference && typeof data.parentReference.driveId === "string"
      ? data.parentReference.driveId
      : "";
  if (!driveId) return { error: "invalid" };
  return {
    isFolder,
    name: String(data.name || ""),
    size: Number(data.size) || 0,
    childCount: isFolder ? Number((data.folder && data.folder.childCount) || 0) : 0,
    driveId,
    itemId: String(data.id),
    shareEnc: enc,
  };
}

// 从 OneDrive 跳转 URL（/embed、photos、redir 等）提取 cid 与 itemId（格式 {cid}!{shareToken}）
export function parseShareLinkIds(raw) {
  try {
    const u = new URL(raw);
    const cid = (u.searchParams.get("cid") || "").trim();
    const id = (u.searchParams.get("id") || u.searchParams.get("resid") || "").trim();
    if (!cid || !id) return null;
    return { cid, itemId: id };
  } catch {
    return null;
  }
}

// 新格式（photos 模式回退）：直接用 cid + {cid}!{shareToken} 调 v2.1 drives/items 解析共享项。
// 页面本身即用此端点。返回结构与 resolveShareItemV2 一致（driveId/itemId 为真实存储标识），
// 后续 content/tempauth 可直接复用 v2.0 的 buildContentUrlV2 / resolveTempAuthUrl。
// 成功: { isFolder, name, size, childCount, driveId, itemId, shareEnc }
// 失败: { error: "password_required" | "unauthenticated" | "invalid" | "network" }
export async function resolveShareItemV21(cid, itemId, badgerAuth, timeoutMs) {
  const url = `https://${MY_CONTENT_HOST}/_api/v2.1/drives/${encodeURIComponent(cid)}/items/${encodeURIComponent(itemId)}?%24select=id%2CparentReference%2Cfolder%2Cname%2Csize%2Cfile`;
  const res = await fetchJson(url, timeoutMs, {
    Authorization: `${BADGER_SCHEME} ${badgerAuth}`,
  });
  if (!res) return { error: "network" };
  if (res.status === 401) return { error: "unauthenticated" };
  if (res.status === 403) return { error: "password_required" };
  if (!res.ok) return { error: "invalid" };
  let data;
  try {
    data = await res.json();
  } catch {
    return { error: "invalid" };
  }
  if (!data || typeof data !== "object" || !data.id) return { error: "invalid" };
  const isFolder = Boolean(data.folder);
  const driveId =
    data.parentReference && typeof data.parentReference.driveId === "string"
      ? data.parentReference.driveId
      : "";
  if (!driveId) return { error: "invalid" };
  return {
    isFolder,
    name: String(data.name || ""),
    size: Number(data.size) || 0,
    childCount: isFolder ? Number((data.folder && data.folder.childCount) || 0) : 0,
    driveId,
    itemId: String(data.id),
    shareEnc: "",
  };
}

// 新格式：递归遍历共享文件夹下全部文件。
// 返回 [{ name, size, itemId, relPath }]，受 MAX_CHILDREN / MAX_DEPTH 限制。
export async function listShareChildrenV2(driveId, rootItemId, badgerAuth, opts) {
  opts = opts || {};
  const max = opts.max || MAX_CHILDREN;
  const depth = opts.depth || MAX_DEPTH;
  const items = [];
  const authHeader = { Authorization: `${BADGER_SCHEME} ${badgerAuth}` };

  const childrenUrl = (itemId) =>
    `https://${MY_CONTENT_HOST}/_api/v2.0/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/children?%24top=100&%24select=id%2Cname%2Csize%2Cfolder%2Cfile&ump=1`;

  async function walk(itemId, relPath, level) {
    if (items.length >= max || level > depth) return;
    let next = childrenUrl(itemId);
    while (next && items.length < max) {
      const res = await fetchJson(next, undefined, authHeader);
      if (!res || !res.ok) break;
      let data;
      try {
        data = await res.json();
      } catch {
        break;
      }
      const list = Array.isArray(data.value) ? data.value : [];
      for (const item of list) {
        if (items.length >= max) break;
        if (!item || typeof item !== "object") continue;
        const name = typeof item.name === "string" ? item.name : "";
        if (!name) continue;
        const childRel = relPath ? `${relPath}/${name}` : name;
        if (item.folder) {
          if (level < depth && item.id) await walk(String(item.id), childRel, level + 1);
        } else if (item.id) {
          items.push({ name, size: Number(item.size) || 0, itemId: String(item.id), relPath: childRel });
        }
      }
      next = typeof data["@odata.nextLink"] === "string" ? data["@odata.nextLink"] : null;
    }
  }

  await walk(rootItemId, "", 0);
  return items;
}

// 新格式：稳定媒体源 content 地址（每次请求带 BadgerAuth 实时返回最新直链）
export function buildContentUrlV2(driveId, itemId) {
  return `https://${MY_CONTENT_HOST}/_api/v2.0/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/content`;
}

// 新格式：用 BadgerAuth 请求 content 端点，获取 302 到 download.aspx?tempauth= 的匿名直链。
// 该 tempauth URL 无需任何认证即可访问（有效期约 1 小时），可作为媒体源。
// 成功: { url } | 失败: { error: "network" | "unauthenticated" | "no-tempauth" }
export async function resolveTempAuthUrl(driveId, itemId, badgerAuth, timeoutMs) {
  const url = buildContentUrlV2(driveId, itemId);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs || RESOLVE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: ctrl.signal,
      headers: {
        Accept: "*/*",
        "User-Agent": OD_UA,
        Authorization: `${BADGER_SCHEME} ${badgerAuth}`,
      },
    });
    if (res.status === 401 || res.status === 403) return { error: "unauthenticated" };
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("Location");
      if (loc) return { url: new URL(loc, url).toString() };
    }
    return { error: "no-tempauth" };
  } catch {
    return { error: "network" };
  } finally {
    clearTimeout(timer);
  }
}

// 识别 download.aspx?tempauth= 匿名直链（OneDrive 新格式媒体源）
function isTempAuthUrl(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.hostname.toLowerCase() !== MY_CONTENT_HOST) return false;
  if (u.pathname.indexOf("/_layouts/15/download.aspx") === -1) return false;
  return u.searchParams.has("tempauth");
}

// 判断是否为受信的 OneDrive 稳定媒体源地址。
// 兼容旧格式 api.onedrive.com shares content 与新格式 my.microsoftpersonalcontent.com items content。
export function isOneDriveTrustedUrl(raw) {
  if (typeof raw !== "string") return false;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  if (host === MY_CONTENT_HOST) {
    // 新格式 /c/：items content 端点 或 download.aspx?tempauth= 匿名直链
    return isOneDriveV2ContentPath(u) || isTempAuthUrl(raw);
  }
  if (host !== "api.onedrive.com") return false;
  if (u.search || u.hash) return false;
  return isOneDriveV1ContentPath(u);
}

function isOneDriveV1ContentPath(u) {
  const p = u.pathname;
  if (!p.startsWith("/v1.0/shares/u!")) return false;
  const rest = p.slice("/v1.0/shares/u!".length);
  const rootIdx = rest.indexOf("/root");
  if (rootIdx < 0) return false;
  const head = rest.slice(0, rootIdx);
  if (!/^[A-Za-z0-9_-]+$/.test(head)) return false;
  const seg = rest.slice(rootIdx);
  if (!seg.endsWith("/content")) return false;
  const inner = seg.slice(0, -"/content".length);
  if (inner === "/root") return true;
  if (!inner.startsWith("/root:")) return false;
  if (inner[inner.length - 1] !== ":") return false;
  const pathPart = inner.slice("/root:".length, -1).replace(/^\/+/, "");
  if (!pathPart) return false;
  const parts = pathPart.split("/");
  for (const piece of parts) {
    if (!piece) return false;
    if (piece === "." || piece === "..") return false;
    if (/%2f|%5c/i.test(piece)) return false;
    if (/[?#\u0000-\u001f]/.test(piece)) return false;
  }
  return true;
}

// 新格式 path 校验: /_api/v2.0/drives/{driveId}/items/{itemId}/content
function isOneDriveV2ContentPath(u) {
  if (u.search || u.hash) return false;
  const m = u.pathname.match(/^\/_api\/v2\.0\/drives\/[^/]+\/items\/[^/]+\/content$/);
  return !!m;
}

// 判断 URL 是否落在微软 OneDrive 文件分发域集合内(含子域)
export function isOneDriveCdnHost(raw) {
  if (typeof raw !== "string") return false;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return false;
  }
  const host = u.hostname.toLowerCase();
  return ONE_DRIVE_CDN_HOSTS.some((d) => host === d || host.endsWith("." + d));
}

export {
  MAX_CHILDREN,
  MAX_DEPTH,
  MY_CONTENT_HOST,
  BADGER_TOKEN_URL,
  BADGER_APP_ID,
  BADGER_SCHEME,
  ONE_DRIVE_CDN_HOSTS,
};
