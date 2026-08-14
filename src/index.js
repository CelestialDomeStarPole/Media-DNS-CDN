import {
  getSettings,
  saveSettings,
  getImage,
  putImage,
  deleteImage,
  listImages,
  defaultSettings,
  splitList,
  numList,
  getFolders,
  saveFolders,
  getOrder,
  saveOrder,
  getOrderedIds,
} from "./lib/store.js";
import {
  json,
  auth,
  timingSafeEqual,
  checkRateLimit,
  checkGeoIp,
  checkReferer,
  verifySignature,
  signLink,
} from "./lib/security.js";
import {
  isAllowedUrl,
  fetchOrigin,
  validateMedia,
  buildCachedResponse,
  classifyType,
  guessType,
  guessTypeFromName,
} from "./lib/proxy.js";
import {
  isOneDriveShareUrl,
  isNewFormatShareUrl,
  buildContentUrl,
  buildContentUrlV2,
  resolveShareItem,
  resolveShareItemV2,
  resolveShareItemV21,
  parseShareLinkIds,
  listShareChildren,
  listShareChildrenV2,
  listShareChildrenFlat,
  listShareChildrenV2Flat,
  fetchBadgerAuth,
  resolveTempAuthUrl,
  isOneDriveTrustedUrl,
  MAX_CHILDREN,
  MY_CONTENT_HOST,
  BADGER_SCHEME,
} from "./lib/onedrive.js";
import { renderUI } from "./lib/ui.js";

const IMAGE_PATH = /^\/i\/([A-Za-z0-9_-]+)\/?$/;
const IMAGE_ID_RE = /^[A-Za-z0-9_-]+$/;

async function hashBody(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-1", data);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex;
}

function generateId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sanitizeField(v, max) {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);
}

// 从 OneDrive 稳定媒体源 content URL 解析真实文件名（/root:/{path}/name:/content 的 path 末段）
function oneDriveRelName(rawUrl) {
  try {
    const p = new URL(rawUrl).pathname;
    const i = p.indexOf("/root:");
    if (i === -1) return "";
    const j = p.lastIndexOf(":/content");
    if (j <= i) return "";
    const inner = p.slice(i + "/root:".length, j);
    const seg = inner.split("/").pop() || "";
    return seg ? decodeURIComponent(seg) : "";
  } catch {
    return "";
  }
}

// 上游文件名（URL 末段，含扩展名），解码还原可读字符，失败返回空串
function upstreamFileName(rawUrl) {
  try {
    if (isOneDriveTrustedUrl(rawUrl)) {
      const n = oneDriveRelName(rawUrl);
      if (n) return n;
    }
    const seg = new URL(rawUrl).pathname.split("/").pop() || "";
    return seg ? decodeURIComponent(seg) : "";
  } catch {
    return "";
  }
}

// 上游扩展名（小写、不含点）；无扩展名或名称为纯扩展名时返回空串
function upstreamExt(rawUrl) {
  const name = upstreamFileName(rawUrl);
  const i = name.lastIndexOf(".");
  if (i <= 0 || i === name.length - 1) return "";
  return name.slice(i + 1).toLowerCase();
}

// 从文件名提取扩展名（小写、不含点）；无扩展名或纯扩展名时返回空串
// 用于 OneDrive content URL（末段为 content，无法从 URL 推导扩展名）等场景
function extFromName(name) {
  const n = String(name || "");
  const i = n.lastIndexOf(".");
  if (i <= 0 || i === n.length - 1) return "";
  return n.slice(i + 1).toLowerCase();
}

// 非 ASCII 兜底名：filename 参数仅允许 ASCII，其余字符替换为下划线
function asciiFallback(name) {
  return name.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
}

// 构造 Content-Disposition：filename 兜底 + filename* UTF-8 编码（非 ASCII 安全）
function buildContentDisposition(filename) {
  const ascii = asciiFallback(filename);
  const ext = `filename*=UTF-8''${encodeURIComponent(filename)}`;
  return ascii ? `inline; filename="${ascii}"; ${ext}` : `inline; ${ext}`;
}

function requireAuth(request, env, handler) {
  if (!auth(request, env)) return json({ error: "未授权，请检查 PASSWORD" }, 401);
  return handler();
}

function baseUrl(request) {
  return new URL(request.url).origin;
}

async function makeLink(request, env, settings, id) {
  let link = `${baseUrl(request)}/i/${id}`;
  if (settings.requireSignature) {
    const { exp, sig } = await signLink(id, settings.signatureTtl, env.SIGNING_SECRET);
    link += `?e=${exp}&s=${sig}`;
  }
  return link;
}

async function purgeTag(ctx, tag) {
  try {
    await ctx.cache.purge({ tags: [tag] });
  } catch {}
}

// 从 Content-Type 提取文件扩展名（小写、不含点）；识别不出返回 ""
// image/jpeg→jpg, image/svg+xml→svg, video/x-msvideo→avi, application/vnd.apple.mpegurl→m3u8 等
function extFromContentType(contentType) {
  if (!contentType) return "";
  const ct = String(contentType).toLowerCase().split(";")[0].trim();
  if (!ct.includes("/")) return "";
  const special = {
    "image/jpeg": "jpg",
    "image/x-icon": "ico",
    "video/x-msvideo": "avi",
    "video/x-matroska": "mkv",
    "audio/x-wav": "wav",
    "audio/x-m4a": "m4a",
    "audio/x-flac": "flac",
    "application/x-mpegurl": "m3u8",
    "application/vnd.apple.mpegurl": "m3u8",
    "application/dash+xml": "mpd",
    "application/mp4": "mp4",
    "application/ogg": "ogg",
    "text/plain": "txt",
    "application/octet-stream": "",
  };
  if (Object.prototype.hasOwnProperty.call(special, ct)) return special[ct];
  let sub = ct.split("/")[1] || "";
  if (sub.startsWith("x-")) sub = sub.slice(2);
  const plus = sub.lastIndexOf("+");
  if (plus > 0) sub = sub.slice(plus + 1);
  if (!/^[a-z0-9]+$/.test(sub)) return "";
  return sub;
}

// 多级探测媒体类型（图片/音频/视频）与文件扩展名：
// L1 HEAD 嗅探 Content-Type → L2 GET+Range(0-0)（仅读响应头后即断开，对 HEAD 不友好/重定向源可靠）
// → L3 按 URL 扩展名兜底 → 仍失败返回 "unknown"。
// 返回 { type, ext }：type 为 image/audio/video/unknown，ext 为具体扩展名（jpg/mp4/ogg 等，识别不出为 ""）。
// 这样 picsum.photos/seed/1 这类"URL 无扩展名的中转链接"也能显示真实文件类型。
// timeoutMs 供调用方控制：添加场景较宽松（5000ms），详情接口场景用短超时（2500ms）。
// odAuth 可选：OneDrive 新格式 /c/ 媒体源需要 Authorization: badger 头。
async function probeMediaInfo(targetUrl, settings, timeoutMs = 5000, odAuth = null) {
  const sniff = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let response;
    try {
      const opts = { method, signal: ctrl.signal };
      // L2 只取响应头不下载文件体：Range 0-0 让源站返回头信息（206/200），读到 Content-Type 后即 cancel 断开
      if (method === "GET") opts.headers = [["Range", "bytes=0-0"]];
      if (odAuth) {
        if (opts.headers) opts.headers = [...opts.headers, ["Authorization", `${BADGER_SCHEME} ${odAuth}`]];
        else opts.headers = [["Authorization", `${BADGER_SCHEME} ${odAuth}`]];
      }
      const res = await fetchOrigin(settings, targetUrl, opts);
      response = res.response;
      if (response && response.status < 400) {
        const ct = response.headers.get("Content-Type") || "";
        const t = classifyType(ct);
        if (t) return { type: t, ext: extFromContentType(ct) };
      }
    } catch {
    } finally {
      clearTimeout(timer);
      try {
        await response?.body?.cancel();
      } catch {}
    }
    return null;
  };
  const fromHead = await sniff("HEAD");
  if (fromHead) return fromHead;
  const fromRange = await sniff("GET");
  if (fromRange) return fromRange;
  const gt = guessType(targetUrl);
  let ext = "";
  if (gt) {
    const seg = String(targetUrl).split(/[?#]/)[0].split("/").pop() || "";
    ext = extFromName(seg);
  }
  return { type: gt || "unknown", ext };
}

// 兼容旧调用：仅返回类型
async function probeType(targetUrl, settings, timeoutMs = 5000, odAuth = null) {
  const info = await probeMediaInfo(targetUrl, settings, timeoutMs, odAuth);
  return info.type;
}

async function handleLogin(request, env) {
  const body = await request.json().catch(() => null);
  const token = body && typeof body.token === "string" ? body.token.trim() : "";
  if (token && env.PASSWORD && timingSafeEqual(token, env.PASSWORD)) {
    return json({ ok: true });
  }
  return json({ ok: false, error: "密码错误" }, 401);
}

// 公共添加逻辑：入库 + order 首位 + 文件夹补录，返回新 id（单文件转换与 OneDrive 导入共用）
// extra 可携带 OneDrive 新格式所需的认证字段（odAuth=BadgerAuth, odShare=原始共享链接）
async function addMediaRecord(env, { url, mode, name, folder, type, extra }) {
  const id = generateId();
  const extras = extra || {};
  await putImage(env, id, {
    url,
    mode,
    enabled: true,
    name,
    folder,
    type,
    createdAt: Date.now(),
    // 链接分类：OneDrive 导入标记 onedrive，普通链接标记 normal
    sourceType: typeof extras.odShare === "string" && extras.odShare ? "onedrive" : "normal",
    ...extras,
  });
  // 新条目排在列表最前（与默认"新在前"一致）
  const order = (await getOrder(env)) || [];
  order.unshift(id);
  await saveOrder(env, order);
  if (folder) {
    const folders = await getFolders(env);
    if (!folders.includes(folder)) {
      folders.push(folder);
      await saveFolders(env, folders);
    }
  }
  return id;
}

async function handleConvert(request, env) {
  const body = await request.json().catch(() => null);
  const raw = body && typeof body.url === "string" ? body.url.trim() : "";
  if (!raw) return json({ error: "请填写媒体链接" }, 400);
  const settings = await getSettings(env);
  if (!isAllowedUrl(raw, settings)) {
    return json({ error: "该域名不在允许列表（SSRF 白名单）中，请先在设置中添加" }, 400);
  }
  const mode =
    body.mode === "proxy"
      ? "proxy"
      : body.mode === "redirect"
        ? "redirect"
        : settings.defaultMode;
  const name = sanitizeField(body.name, 60);
  const folder = sanitizeField(body.folder, 30);
  const info = await probeMediaInfo(raw, settings);
  const type = info.type;
  const id = await addMediaRecord(env, {
    url: raw,
    mode,
    name,
    folder,
    type,
    // 具体文件类型（jpg/mp4/ogg 等），供详情页"文件类型"行显示；中转链接从 Content-Type 嗅探
    extra: info.ext ? { fileExt: info.ext } : undefined,
  });
  const link = await makeLink(request, env, settings, id);
  return json({ id, mode, url: link });
}

// 批量添加普通媒体链接：一次请求处理多条。
// 与 OneDrive 批量导入同构——不逐个网络探测（探测请求数=条数，50 条会轻易超时），
// 按 URL 扩展名兜底类型，unknown 交给详情页懒纠正回写。
// KV 写入从 2N 合并为 N+2（N 条 img + 1 次 order + 至多 1 次 folders），保护免费版每日写配额。
const MAX_BATCH = 50;

async function handleConvertBatch(request, env) {
  const body = await request.json().catch(() => null);
  const raw = body && Array.isArray(body.urls) ? body.urls : [];
  if (!raw.length) return json({ error: "请粘贴媒体链接" }, 400);
  if (raw.length > MAX_BATCH) return json({ error: `单次最多 ${MAX_BATCH} 个` }, 400);
  const settings = await getSettings(env);
  const mode =
    body.mode === "proxy"
      ? "proxy"
      : body.mode === "redirect"
        ? "redirect"
        : settings.defaultMode;
  const folder = sanitizeField(body.folder, 30);
  // 归一化 + 批次内去重；单条超长计入失败明细，不中断其他项
  const seen = new Set();
  const urls = [];
  const out = [];
  let added = 0;
  let failed = 0;
  for (const x of raw) {
    const s = typeof x === "string" ? x.trim() : "";
    if (!s || seen.has(s)) continue;
    seen.add(s);
    if (s.length > 2048) {
      failed++;
      out.push({ url: s, ok: false, error: "链接过长（超过 2048 字符）" });
      continue;
    }
    urls.push(s);
  }
  if (!urls.length) return json({ error: "请粘贴媒体链接" }, 400);
  // 预读 order/folders，循环内仅内存累积，最后合并写，减少 KV 写入次数
  const order = (await getOrder(env)) || [];
  const folders = await getFolders(env);
  const folderNeed = Boolean(folder) && !folders.includes(folder);
  for (const url of urls) {
    try {
      if (!isAllowedUrl(url, settings)) throw new Error("域名不在允许列表（SSRF 白名单）");
      // 名称取文件名去扩展名（遵守「自定义名请勿带后缀」规则）
      const seg = url.split(/[?#]/)[0].split("/").pop() || "";
      const type = guessType(url) || "unknown";
      const ext = extFromName(seg);
      let name = upstreamFileName(url);
      const di = name.lastIndexOf(".");
      if (di > 0 && di < name.length - 1) name = name.slice(0, di);
      name = sanitizeField(name, 60);
      const id = generateId();
      await putImage(env, id, {
        url,
        mode,
        enabled: true,
        name,
        folder,
        type,
        createdAt: Date.now(),
        sourceType: "normal",
        ...(ext ? { fileExt: ext } : {}),
      });
      order.unshift(id);
      added++;
      out.push({ url, ok: true, id });
    } catch (e) {
      failed++;
      out.push({ url, ok: false, error: e && e.message ? e.message : "添加失败" });
    }
  }
  await saveOrder(env, order);
  if (folderNeed) {
    folders.push(folder);
    await saveFolders(env, folders);
  }
  return json({ ok: true, added, failed, items: out });
}

// OneDrive 错误统一映射：兼容 v1(旧格式) 与 v2(新格式 /c/) 的解析结果
// 注意: 非公开共享不能用 401 返回——前端 api() 对 401 统一按"登录失效"处理并弹出登录框，
// 故复用 403，仅 error 字符串区分，供前端 odErrorToast 识别。
function odErrorResponse(info) {
  if (!info || info.error === "network") {
    return json({ error: "无法访问 OneDrive，请稍后重试" }, 502);
  }
  if (info.error === "no-auth") {
    return json({ error: "无法获取 OneDrive 匿名会话，请检查 Worker 网络可达 onedrive.live.com" }, 502);
  }
  if (info.error === "password_required") {
    return json({ error: "password_required" }, 403);
  }
  if (info.error === "unauthenticated") {
    return json({ error: "unauthenticated" }, 403);
  }
  if (info.error === "invalid") {
    return json({ error: "无效的 OneDrive 共享链接，或链接已失效" }, 400);
  }
  return null;
}

// 统一解析入口：自动识别新格式(/c/)与旧格式，返回 v2 额外携带 odAuth/odShare
async function resolveOneDriveInfo(raw) {
  if (isNewFormatShareUrl(raw)) {
    const auth = await fetchBadgerAuth(raw);
    if (!auth || auth.error) return { error: auth ? auth.error : "network" };
    let info = await resolveShareItemV2(raw, auth.token);
    // photos 模式回退：1drv.ms/v/c 部分 token 会跳转到 onedrive.live.com/?v=photos，
    // v2.0 shares API 对这类原始链接可能 403（误报"需要密码"）。
    // 页面本身走 v2.1 drives/items（cid + {cid}!{shareToken}），这里兜底复用同款端点。
    if ((!info || info.error) && auth.finalUrl) {
      const ids = parseShareLinkIds(auth.finalUrl);
      if (ids) {
        const info21 = await resolveShareItemV21(ids.cid, ids.itemId, auth.token);
        if (info21 && !info21.error) info = info21;
      }
    }
    if (info && !info.error) {
      info.odAuth = auth.token;
      info.odShare = raw.trim();
    }
    return info;
  }
  return resolveShareItem(raw);
}

// OneDrive 共享链接解析预览：
// 返回 { isFolder, name, size, childCount }；文件夹额外返回 items（第一层子项，供勾选部分导入）
async function handleOneDriveResolve(request, env) {
  const body = await request.json().catch(() => null);
  const raw = body && typeof body.url === "string" ? body.url.trim() : "";
  if (!raw || !isOneDriveShareUrl(raw)) {
    return json({ error: "无效的 OneDrive 共享链接" }, 400);
  }
  const info = await resolveOneDriveInfo(raw);
  const err = odErrorResponse(info);
  if (err) return err;
  const out = {
    ok: true,
    isFolder: info.isFolder,
    name: info.name,
    size: info.size,
    childCount: info.childCount,
  };
  // 文件夹：拉取第一层子项列表（文件+子文件夹），供前端勾选部分导入
  if (info.isFolder) {
    const newFormat = isNewFormatShareUrl(raw);
    try {
      if (newFormat && info.driveId && info.itemId && info.odAuth) {
        out.items = await listShareChildrenV2Flat(info.driveId, info.itemId, info.odAuth);
      } else if (!newFormat) {
        out.items = await listShareChildrenFlat(raw);
      }
    } catch {
      // 列表获取失败不影响基本信息展示（前端仍可全部导入）
    }
  }
  return json(out);
}

// OneDrive 导入：单文件直接添加；文件夹递归遍历全部文件批量添加（串行，上限 MAX_CHILDREN）
// 成功返回 { id, mode, type, url }（单文件）或 { added, failed, items:[{name,ok,id}] }（文件夹）
async function handleOneDriveImport(request, env) {
  const body = await request.json().catch(() => null);
  const raw = body && typeof body.url === "string" ? body.url.trim() : "";
  if (!raw || !isOneDriveShareUrl(raw)) {
    return json({ error: "无效的 OneDrive 共享链接" }, 400);
  }
  const settings = await getSettings(env);
  // OneDrive 默认缓存代理+DNS（直链时效性由 Worker 实时跟随 302 规避），可传 redirect 切仅DNS
  const mode = body.mode === "redirect" ? "redirect" : "proxy";
  const folder = sanitizeField(body.folder, 30);
  const newFormat = isNewFormatShareUrl(raw);

  const info = await resolveOneDriveInfo(raw);
  const err = odErrorResponse(info);
  if (err) return err;

  // 新格式媒体源：优先获取 download.aspx?tempauth= 匿名直链（无需认证即可访问，约 1 小时有效）。
  // 获取失败（如低权限 token）时回退 content URL + odAuth 代理方式。
  // 旧格式直接用 content URL（api.onedrive.com，Worker 实时跟随 302）。
  const buildV2Media = async (itemId) => {
    const contentUrl = buildContentUrlV2(info.driveId, itemId);
    if (newFormat && info.odAuth) {
      const t = await resolveTempAuthUrl(info.driveId, itemId, info.odAuth);
      if (t && t.url) return { url: t.url, anonymous: true };
      return { url: contentUrl, anonymous: false };
    }
    return { url: contentUrl, anonymous: false };
  };

  // 单文件：探测类型后入库
  if (!info.isFolder) {
    const media = newFormat
      ? await buildV2Media(info.itemId)
      : { url: buildContentUrl(raw, ""), anonymous: false };
    let type = await probeType(media.url, settings, 5000, media.anonymous ? null : (newFormat ? info.odAuth : null));
    // OneDrive 直链返回 octet-stream 导致探测失败时，用文件名扩展名兜底
    if (type === "unknown" && info.name) {
      type = guessTypeFromName(info.name) || type;
    }
    const name = sanitizeField(body.name, 60) || info.name;
    const id = await addMediaRecord(env, {
      url: media.url,
      mode,
      name,
      folder,
      type,
      extra: newFormat
        ? {
            odAuth: info.odAuth,
            odShare: info.odShare,
            odDriveId: info.driveId,
            odItemId: info.itemId,
            // OneDrive 原始完整文件名（含扩展名），供下载名 custom/upstream 逻辑使用
            odSrcName: info.name,
          }
        : undefined,
    });
    const link = await makeLink(request, env, settings, id);
    return json({ ok: true, id, mode, type, url: link });
  }

  // 文件夹：收集待导入文件列表
  //  - body.items（勾选列表）提供时：只导入勾选项——文件直导、子文件夹递归；
  //  - 否则：递归整个根（"全部导入"）。
  const selected = Array.isArray(body.items) && body.items.length ? body.items : null;
  const collectItems = async () => {
    if (newFormat) {
      if (selected) {
        const all = [];
        for (const sel of selected) {
          if (!sel || typeof sel !== "object") continue;
          if (sel.isFolder && sel.itemId) {
            const sub = await listShareChildrenV2(info.driveId, String(sel.itemId), info.odAuth);
            all.push(...sub);
          } else if (sel.itemId) {
            all.push({
              name: String(sel.name || ""),
              size: Number(sel.size) || 0,
              itemId: String(sel.itemId),
              relPath: "",
            });
          }
        }
        return all;
      }
      return listShareChildrenV2(info.driveId, info.itemId, info.odAuth);
    }
    if (selected) {
      const all = [];
      for (const sel of selected) {
        if (!sel || typeof sel !== "object") continue;
        if (sel.isFolder && sel.relPath) {
          const sub = await listShareChildren(raw, { startRelPath: String(sel.relPath) });
          all.push(...sub);
        } else if (sel.relPath) {
          all.push({
            name: String(sel.name || ""),
            size: Number(sel.size) || 0,
            relPath: String(sel.relPath),
          });
        }
      }
      return all;
    }
    return listShareChildren(raw);
  };
  const items = await collectItems();
  const out = [];
  let added = 0;
  let failed = 0;
  for (const it of items) {
    try {
      // 批量导入不逐个 probeType（探测请求数=文件数，易超时）：
      // 用文件名扩展名兜底，未知类型交给详情懒纠正回写
      const type = guessTypeFromName(it.name) || "unknown";
      const media = newFormat
        ? await buildV2Media(it.itemId)
        : { url: buildContentUrl(raw, it.relPath), anonymous: false };
      // 与单文件添加一致：媒体名去除扩展名，遵守「自定义名请勿带后缀」规则；
      // 完整文件名已存入 odSrcName，下载名 custom/upstream 模式会自动补回扩展名
      const rawName = it.name;
      let importName = rawName;
      if (newFormat) {
        const s = String(rawName || "");
        const di = s.lastIndexOf(".");
        if (di > 0 && di < s.length - 1) importName = s.slice(0, di);
      }
      const id = await addMediaRecord(env, {
        url: media.url,
        mode,
        name: importName,
        folder,
        type,
        extra: newFormat
          ? {
              odAuth: info.odAuth,
              odShare: info.odShare,
              odDriveId: info.driveId,
              odItemId: it.itemId,
              // OneDrive 原始完整文件名（含扩展名），供下载名 custom/upstream 逻辑使用
              odSrcName: rawName,
            }
          : undefined,
      });
      added++;
      out.push({ name: importName, ok: true, id });
    } catch {
      failed++;
      out.push({ name: it.name, ok: false });
    }
  }
  return json({ ok: true, isFolder: true, added, failed, items: out, limit: MAX_CHILDREN });
}

// 类型 → 大小限制设置键（与 proxy.js 的 validateMedia 保持一致）
const TYPE_SIZE_KEY = { image: "maxImageSize", audio: "maxAudioSize", video: "maxVideoSize" };

// KV 中记录 OneDrive 上次自动刷新时间戳的键（毫秒）
const OD_LAST_REFRESH_KEY = "od:lastRefreshTs";

// 剔除不应暴露给前端的敏感字段（OneDrive BadgerAuth 凭证、内部锚点）。
// 保留 odShare（OneDrive 原始共享链接，前端详情页需要展示）与 sourceType（链接分类）。
function sanitizeImage(img) {
  const { odAuth, odDriveId, odItemId, ...safe } = img;
  return safe;
}

// 定时任务：按设置的刷新间隔刷新所有 OneDrive 媒体条目。
// tempauth 直链约 1 小时过期，这里在到期前统一重新解析：
//   - 用存储的原始共享链接 odShare 重新获取 BadgerAuth
//   - 用 odDriveId/odItemId 重新解析 content -> 新的 download.aspx?tempauth= 直链
//   - 回写 KV（url + 新 token），保证媒体链接长期可用
// 返回 { ok, refreshed, failed }（仅作观测，不阻塞用户请求）
async function refreshOneDriveMedia(env) {
  let images;
  try {
    images = await listImages(env);
  } catch {
    return { ok: false, refreshed: 0, failed: 0 };
  }
  let refreshed = 0;
  let failed = 0;
  // 串行处理，避免瞬时大量出站请求；媒体量通常不大（≤ 几百）
  for (const img of images) {
    if (typeof img.odShare !== "string" || !img.odShare) continue;
    // 仅当持有可刷新的锚点（odDriveId + odItemId）时才刷新直链
    if (typeof img.odDriveId !== "string" || typeof img.odItemId !== "string") continue;
    try {
      const auth = await fetchBadgerAuth(img.odShare);
      if (!auth || auth.error || !auth.token) {
        failed++;
        continue;
      }
      const t = await resolveTempAuthUrl(img.odDriveId, img.odItemId, auth.token);
      if (t && t.url && t.url !== img.url) {
        await putImage(env, img.id, { ...img, url: t.url, odAuth: auth.token });
        refreshed++;
      } else if (t && t.url) {
        // 直链未变化，仅更新 token
        await putImage(env, img.id, { ...img, odAuth: auth.token });
        refreshed++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }
  return { ok: true, refreshed, failed };
}

async function handleList(request, env) {
  const settings = await getSettings(env);
  const images = await listImages(env);
  const out = [];
  for (const img of images) {
    out.push({ ...sanitizeImage(img), shortUrl: await makeLink(request, env, settings, img.id) });
  }
  return json({ images: out, folders: await getFolders(env) });
}

// 轻量：仅返回有序 id 列表，供前端预渲染占位卡并锁定顺序，响应极小、速度快
async function handleListIds(env) {
  const [ids, folders] = await Promise.all([getOrderedIds(env), getFolders(env)]);
  return json({ ids, folders });
}

// 单条：按 id 返回单张媒体的完整元数据（含 shortUrl），供前端逐卡独立异步加载
async function handleImageDetail(request, env) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id || !IMAGE_ID_RE.test(id)) return json({ error: "ID 无效" }, 400);
  const img = await getImage(env, id);
  if (!img) return json({ error: "图片不存在" }, 404);
  const settings = await getSettings(env);
  // 懒纠正：type 为 unknown，或缺失具体文件类型（fileExt）时，
  // 短超时探测真实类型/扩展名并回写 KV，让卡片类型徽章与详情页"文件类型"行即时显示
  // （仅触发一次，纠正后不再探测）
  if (
    (img.type === "unknown" || (!img.fileExt && !img.odSrcName)) &&
    (isAllowedUrl(img.url, settings) || isOneDriveTrustedUrl(img.url))
  ) {
    // OneDrive 新格式探测需带 BadgerAuth
    const odAuth =
      typeof img.odAuth === "string" && img.odAuth && isOneDriveTrustedUrl(img.url)
        ? img.odAuth
        : null;
    const got = await probeMediaInfo(img.url, settings, 2500, odAuth);
    if (got.type && got.type !== "unknown") {
      img.type = got.type;
      // 顺带回写具体文件类型（jpg/mp4 等），让详情页"文件类型"行也能显示
      if (got.ext && !img.fileExt) img.fileExt = got.ext;
      await putImage(env, id, img).catch(() => {});
    }
  }
  return json({ ...sanitizeImage(img), shortUrl: await makeLink(request, env, settings, id) });
}

async function handleUpdateImage(request, env) {
  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === "string" ? body.id : "";
  if (!id || !IMAGE_ID_RE.test(id)) return json({ error: "ID 无效" }, 400);
  const img = await getImage(env, id);
  if (!img) return json({ error: "图片不存在" }, 404);
  if (body.name !== undefined) img.name = sanitizeField(body.name, 60);
  if (body.folder !== undefined) img.folder = sanitizeField(body.folder, 30);
  await putImage(env, id, img);
  // 返回更新后的完整单卡数据（含 shortUrl），前端可直接就地刷新，无需全量重拉
  const settings = await getSettings(env);
  return json({
    ok: true,
    image: { ...sanitizeImage(img), id, shortUrl: await makeLink(request, env, settings, id) },
  });
}

async function handleCreateFolder(request, env) {
  const body = await request.json().catch(() => null);
  const name = sanitizeField(body && body.name, 30);
  if (!name) return json({ error: "文件夹名称无效" }, 400);
  const list = await getFolders(env);
  if (!list.includes(name)) {
    list.push(name);
    await saveFolders(env, list);
  }
  return json({ ok: true });
}

async function handleRenameFolder(request, env) {
  const body = await request.json().catch(() => null);
  const from = body && typeof body.from === "string" ? body.from.trim() : "";
  const to = body && typeof body.to === "string" ? sanitizeField(body.to, 30) : "";
  if (!from) return json({ error: "文件夹无效" }, 400);
  const list = await getFolders(env);
  if (!list.includes(from)) return json({ error: "文件夹不存在" }, 404);
  const next = list.filter((x) => x !== from);
  if (to && !next.includes(to)) next.push(to);
  await saveFolders(env, next);
  const images = await listImages(env);
  for (const img of images) {
    if (img.folder === from) {
      img.folder = to;
      await putImage(env, img.id, img);
    }
  }
  return json({ ok: true });
}

async function handleDeleteFolder(request, env) {
  const body = await request.json().catch(() => null);
  const name = body && typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return json({ error: "文件夹无效" }, 400);
  const list = await getFolders(env);
  await saveFolders(env, list.filter((x) => x !== name));
  const images = await listImages(env);
  for (const img of images) {
    if (img.folder === name) {
      img.folder = "";
      await putImage(env, img.id, img);
    }
  }
  return json({ ok: true });
}

async function handleDelete(request, env, ctx) {
  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === "string" ? body.id : "";
  if (!id || !IMAGE_ID_RE.test(id)) return json({ error: "ID 无效" }, 400);
  await deleteImage(env, id);
  const order = (await getOrder(env)) || [];
  if (order.includes(id)) await saveOrder(env, order.filter((x) => x !== id));
  await purgeTag(ctx, `img-${id}`);
  return json({ ok: true });
}

async function handleReorder(request, env) {
  const body = await request.json().catch(() => null);
  const ids = body && Array.isArray(body.ids) ? body.ids : null;
  if (!ids) return json({ error: "参数无效" }, 400);
  const clean = [];
  const seen = new Set();
  for (const id of ids) {
    if (typeof id === "string" && IMAGE_ID_RE.test(id) && !seen.has(id)) {
      seen.add(id);
      clean.push(id);
      if (clean.length >= 5000) break;
    }
  }
  await saveOrder(env, clean);
  return json({ ok: true });
}

async function handleToggle(request, env, ctx) {
  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === "string" ? body.id : "";
  if (!id || !IMAGE_ID_RE.test(id)) return json({ error: "ID 无效" }, 400);
  const img = await getImage(env, id);
  if (!img) return json({ error: "图片不存在" }, 404);
  img.enabled = body.enabled === true;
  await putImage(env, id, img);
  await purgeTag(ctx, `img-${id}`);
  return json({ ok: true });
}

async function handleGetSettings(request, env) {
  const settings = await getSettings(env);
  return json({
    settings,
    meta: {
      rateLimitIp: {
        limit: Number(env.RATE_LIMIT_IP_LIMIT) || 100,
        period: Number(env.RATE_LIMIT_IP_PERIOD) || 60,
      },
      rateLimitImg: {
        limit: Number(env.RATE_LIMIT_IMG_LIMIT) || 40,
        period: Number(env.RATE_LIMIT_IMG_PERIOD) || 10,
      },
      rateLimitAv: {
        limit: Number(env.RATE_LIMIT_AV_LIMIT) || 300,
        period: Number(env.RATE_LIMIT_AV_PERIOD) || 10,
      },
    },
  });
}

function normalizeSettings(raw, env) {
  const base = defaultSettings(env);
  const num = (v, def, min, max) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return def;
    return Math.min(Math.max(n, min), max);
  };
  // OneDrive 自动刷新间隔：最小 1 小时，最大为缓存时长对应小时数（至少 1）
  const odMaxHours = Math.max(
    1,
    Math.floor(num(raw.cacheTtl ?? base.cacheTtl, base.cacheTtl, 0, 31536000) / 3600)
  );
  return {
    allowedOrigins: splitList(raw.allowedOrigins ?? base.allowedOrigins),
    allowedCountries: splitList(raw.allowedCountries ?? base.allowedCountries),
    blockedCountries: splitList(raw.blockedCountries ?? base.blockedCountries),
    allowedIps: splitList(raw.allowedIps ?? base.allowedIps),
    blockedIps: splitList(raw.blockedIps ?? base.blockedIps),
    allowedAsn: numList(raw.allowedAsn ?? base.allowedAsn),
    blockedAsn: numList(raw.blockedAsn ?? base.blockedAsn),
    allowedReferers: splitList(raw.allowedReferers ?? base.allowedReferers),
    requireSignature: Boolean(raw.requireSignature),
    signatureTtl: num(raw.signatureTtl, base.signatureTtl, 60, 31536000),
    cacheTtl: num(raw.cacheTtl, base.cacheTtl, 0, 31536000),
    onedriveRefreshHours: Math.max(
      1,
      Math.min(num(raw.onedriveRefreshHours, base.onedriveRefreshHours, 1, 31536000), odMaxHours)
    ),
    maxImageSize: num(raw.maxImageSize, base.maxImageSize, 1024, 512 * 1024 * 1024),
    maxAudioSize: num(raw.maxAudioSize, base.maxAudioSize, 1024, 512 * 1024 * 1024),
    maxVideoSize: num(raw.maxVideoSize, base.maxVideoSize, 1024, 512 * 1024 * 1024),
    defaultMode: raw.defaultMode === "proxy" ? "proxy" : "redirect",
    downloadNameSource:
      raw.downloadNameSource === "custom" ? "custom" : "upstream",
    thumbSource: raw.thumbSource === "site" ? "site" : "upstream",
    previewSource: raw.previewSource === "site" ? "site" : "upstream",
    originReferer: String(raw.originReferer ?? base.originReferer).trim(),
    originUserAgent: String(raw.originUserAgent ?? base.originUserAgent).trim(),
  };
}

async function handlePutSettings(request, env, ctx) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "参数无效" }, 400);
  const settings = normalizeSettings(body, env);
  await saveSettings(env, settings);
  // 设置变更后清除全部图片缓存，确保新限制即时生效
  await purgeTag(ctx, "img");
  return json({ ok: true });
}

async function handleImage(request, env, id, ctx) {
  const settings = await getSettings(env);
  const url = new URL(request.url);

  const image = await getImage(env, id);
  if (!image || image.enabled === false) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const mediaType = image.type || guessType(image.url) || "unknown";

  const rl = await checkRateLimit(request, env, id, mediaType);
  if (!rl.ok) {
    return new Response("请求过于频繁", {
      status: 429,
      headers: { "Retry-After": "10", "Cache-Control": "no-store" },
    });
  }

  const geo = checkGeoIp(request, settings);
  if (!geo.ok) {
    return new Response(geo.reason || "Forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const ref = checkReferer(request, settings);
  if (!ref.ok) {
    return new Response(ref.reason || "Forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (settings.requireSignature) {
    const exp = url.searchParams.get("e");
    const sig = url.searchParams.get("s");
    const ok = await verifySignature(id, exp, sig, env.SIGNING_SECRET);
    if (!ok) {
      return new Response("签名无效或已过期", {
        status: 403,
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  const mode = image.mode || settings.defaultMode;

  // 判断是否为 OneDrive 新格式(/c/)媒体源。
  //  - 匿名直链形态(download.aspx?tempauth=)：无需任何认证头，可直接代理，适合仅DNS
  //  - content 端点形态(/items/{id}/content)：需要 Authorization: badger 头，
  //    且不适合"仅DNS"(302) 模式——浏览器跳转后不会带该头。
  let isODV2 = false;
  let isODV2Anon = false;
  try {
    const odHost = new URL(image.url).hostname.toLowerCase() === MY_CONTENT_HOST;
    isODV2 = odHost && isOneDriveTrustedUrl(image.url);
    isODV2Anon = odHost && image.url.indexOf("_layouts/15/download.aspx") !== -1;
  } catch {
    isODV2 = false;
    isODV2Anon = false;
  }

  // 仅DNS：校验通过后 302 直跳原图，不缓存，每次请求都过校验
  // OneDrive 新格式 content 端点强制走代理（浏览器跳转不带 badger 头）；匿名直链可 302。
  if (mode === "redirect" && !isODV2) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: image.url,
        "Cache-Control": "no-store",
      },
    });
  }

  // 缓存代理+DNS
  // OneDrive 稳定媒体源（api.onedrive.com shares content / my.microsoftpersonalcontent.com items content / download.aspx?tempauth=）定向放行
  if (!isAllowedUrl(image.url, settings) && !isOneDriveTrustedUrl(image.url)) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // 透传 Range/If-Range，支持浏览器音视频拖进度条
  const extraHeaders = new Headers();
  const range = request.headers.get("Range");
  if (range) extraHeaders.set("Range", range);
  const ifRange = request.headers.get("If-Range");
  if (ifRange) extraHeaders.set("If-Range", ifRange);
  // OneDrive 新格式 content 端点需要带 BadgerAuth（匿名直链不需要）
  if (isODV2 && !isODV2Anon && typeof image.odAuth === "string" && image.odAuth) {
    extraHeaders.set("Authorization", `${BADGER_SCHEME} ${image.odAuth}`);
  }

  let { response, error } = await fetchOrigin(settings, image.url, { headers: extraHeaders });

  // OneDrive 新格式：tempauth 过期(401) 或 BadgerAuth 失效时，用存储的原始共享链接刷新并重试一次。
  // 匿名直链过期 -> 重新 resolve 获取新 tempauth URL；content 端点 401 -> 刷新 BadgerAuth。
  if (
    isODV2 &&
    !error &&
    response &&
    response.status === 401 &&
    typeof image.odShare === "string" &&
    image.odShare &&
    typeof image.odAuth === "string" &&
    image.odAuth
  ) {
    try {
      await response.body?.cancel();
    } catch {}
    const refreshed = await fetchBadgerAuth(image.odShare);
    if (refreshed && refreshed.token) {
      let retryUrl = image.url;
      if (isODV2Anon && typeof image.odDriveId === "string" && typeof image.odItemId === "string") {
        // 匿名直链：用新 token 重新解析 content -> tempauth
        const t = await resolveTempAuthUrl(image.odDriveId, image.odItemId, refreshed.token);
        if (t && t.url) retryUrl = t.url;
      }
      const newHeaders = new Headers(extraHeaders);
      newHeaders.set("Authorization", `${BADGER_SCHEME} ${refreshed.token}`);
      const retry = await fetchOrigin(settings, retryUrl, { headers: newHeaders });
      if (retry.response && retry.response.status < 400) {
        // 异步回写新 token 与新直链，避免每次请求都走刷新链
        ctx.waitUntil(
          putImage(env, id, { ...image, odAuth: refreshed.token, url: retryUrl }).catch(() => {})
        );
        ({ response, error } = retry);
      }
    }
  }

  if (error || !response) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }
  if (response.status >= 400) {
    return new Response("Upstream error", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // OneDrive 新格式直链（download.aspx?tempauth= 或 /content 端点）：
  // 源站返回 octet-stream 或无 Content-Type，无法从响应头识别类型；
  // 类型以导入时已确定的 image.type（按文件名扩展名推断）为准，跳过 Content-Type 校验。
  let v;
  if (isODV2) {
    const trustType =
      typeof image.type === "string" && image.type !== "unknown"
        ? image.type
        : guessTypeFromName(image.name) || "unknown";
    // 206 分片需 Content-Range 校验；200 全量响应直接按已定类型放行（大小限制仍生效）
    if (response.status === 206) {
      if (!response.headers.get("Content-Range")) v = { ok: false, reason: "非法分片响应" };
      else v = { ok: true, partial: true, type: trustType };
    } else {
      const len = Number(response.headers.get("Content-Length") || 0);
      const limit = settings[TYPE_SIZE_KEY[trustType]] || 0;
      if (len && limit && len > limit) v = { ok: false, reason: "文件超过大小限制" };
      else v = { ok: true, type: trustType };
    }
  } else {
    v = validateMedia(response, settings, mediaType, null);
  }
  if (!v.ok) {
    try {
      await response.body?.cancel();
    } catch {}
    return new Response(v.reason || "Bad Gateway", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // 懒纠正：此前 type 为 unknown 的条目，代理成功识别到真实类型后异步回写 KV，不阻塞媒体响应
  if (mediaType === "unknown" && v.type && v.type !== "unknown") {
    ctx.waitUntil(putImage(env, id, { ...image, type: v.type }).catch(() => {}));
  }

  const cached = buildCachedResponse(response, settings, id, v.partial);
  // 保存文件名统一遵循 downloadNameSource：
  //  - upstream：上游文件名。普通媒体 = URL 末段；OneDrive content URL 末段是 content
  //    无法推导，改用导入时记录的 odSrcName（OneDrive 原始完整文件名，含扩展名）。
  //  - custom：网站自定义名 + 上游扩展名。OneDrive 的扩展名取自 odSrcName，
  //    自动补回并去重，避免「名字.后缀.后缀」。
  const odSrcName =
    isODV2 && typeof image.odSrcName === "string" ? image.odSrcName.trim() : "";
  const upstream = isODV2
    ? odSrcName || (typeof image.name === "string" ? image.name.trim() : "")
    : upstreamFileName(image.url);
  if (settings.downloadNameSource === "custom") {
    const customName = typeof image.name === "string" ? image.name.trim() : "";
    let saveName;
    if (customName) {
      const ext = isODV2 ? extFromName(odSrcName || customName) : upstreamExt(image.url);
      // 自定义名已含扩展名且与上游扩展名一致时不再追加，避免双后缀
      const nameExt = customName.includes(".")
        ? customName.slice(customName.lastIndexOf(".") + 1).toLowerCase()
        : "";
      saveName = ext && nameExt !== ext ? `${customName}.${ext}` : customName;
    } else {
      // 自定义名为空时回退上游文件名（含原扩展名，避免双后缀）
      saveName = upstream;
    }
    if (saveName) cached.headers.set("Content-Disposition", buildContentDisposition(saveName));
  } else if (isODV2 && upstream) {
    // upstream 模式：OneDrive content URL 无法从 URL 得到文件名，必须显式设置
    cached.headers.set("Content-Disposition", buildContentDisposition(upstream));
  }
  return cached;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/") {
      const body = renderUI();
      const etag = `"${await hashBody(body)}"`;
      const ifNoneMatch = request.headers.get("If-None-Match");
      if (ifNoneMatch && ifNoneMatch === etag) {
        return new Response(null, { status: 304 });
      }
      return new Response(body, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          "ETag": etag,
        },
      });
    }
    if (pathname === "/api/login") return handleLogin(request, env);
    if (pathname === "/api/convert") return requireAuth(request, env, () => handleConvert(request, env));
    if (pathname === "/api/convert/batch") return requireAuth(request, env, () => handleConvertBatch(request, env));
    if (pathname === "/api/onedrive/resolve")
      return requireAuth(request, env, () => handleOneDriveResolve(request, env));
    if (pathname === "/api/onedrive/import")
      return requireAuth(request, env, () => handleOneDriveImport(request, env));
    if (pathname === "/api/images") return requireAuth(request, env, () => handleList(request, env));
    if (pathname === "/api/images/ids") return requireAuth(request, env, () => handleListIds(env));
    if (pathname === "/api/image/detail") return requireAuth(request, env, () => handleImageDetail(request, env));
    if (pathname === "/api/image/delete") return requireAuth(request, env, () => handleDelete(request, env, ctx));
    if (pathname === "/api/image/toggle") return requireAuth(request, env, () => handleToggle(request, env, ctx));
    if (pathname === "/api/image/update") return requireAuth(request, env, () => handleUpdateImage(request, env));
    if (pathname === "/api/images/order") return requireAuth(request, env, () => handleReorder(request, env));
    if (pathname === "/api/folder/create") return requireAuth(request, env, () => handleCreateFolder(request, env));
    if (pathname === "/api/folder/rename") return requireAuth(request, env, () => handleRenameFolder(request, env));
    if (pathname === "/api/folder/delete") return requireAuth(request, env, () => handleDeleteFolder(request, env));
    if (pathname === "/api/settings") {
      if (request.method === "GET") return requireAuth(request, env, () => handleGetSettings(request, env));
      if (request.method === "PUT") return requireAuth(request, env, () => handlePutSettings(request, env, ctx));
    }

    const m = pathname.match(IMAGE_PATH);
    if (m && (request.method === "GET" || request.method === "HEAD")) {
      return handleImage(request, env, m[1], ctx);
    }

    return new Response("Not Found", { status: 404 });
  },

  // Cron Trigger（wrangler.jsonc triggers.crons 为每 5 分钟触发）：
  // 由运行时按用户设置 onedriveRefreshHours 决定实际刷新间隔——
  // 网站缓存了 OneDrive 解析结果，仅用网站外链时解析链过期不影响外链，
  // 调大间隔可节约 OneDrive 请求；距上次刷新剩余时间 ≤ 310 秒
  // （5 分钟检查周期 + 10 秒缓冲）即触发刷新并更新时间，无需再单独提前量。
  async scheduled(_event, env, ctx) {
    const settings = await getSettings(env);
    const cacheTtl = Number(settings.cacheTtl) || 0;
    const maxHours = Math.max(1, Math.floor(cacheTtl / 3600));
    const hours = Math.min(Math.max(Number(settings.onedriveRefreshHours) || 1, 1), maxHours);
    const intervalMs = hours * 3600 * 1000; // 设置的刷新间隔
    let last = 0;
    try {
      const v = await env.MAPPINGS.get(OD_LAST_REFRESH_KEY);
      if (v) last = Number(v) || 0;
    } catch {}
    const now = Date.now();
    if (intervalMs - (now - last) > 310 * 1000) return; // 剩余时间 > 310 秒（5 分钟周期 + 10 秒缓冲），未到触发窗口，跳过
    try {
      await env.MAPPINGS.put(OD_LAST_REFRESH_KEY, String(now)); // 先记录本次时间，失败也不反复重试
    } catch {}
    ctx.waitUntil(refreshOneDriveMedia(env));
  },
};
