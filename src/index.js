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
  listShareChildren,
  listShareChildrenV2,
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

// 多级探测媒体类型（图片/音频/视频）：
// L1 HEAD 嗅探 Content-Type → L2 GET+Range(0-0)（仅读响应头后即断开，对 HEAD 不友好/重定向源可靠）
// → L3 按 URL 扩展名兜底 → 仍失败返回 "unknown"。
// timeoutMs 供调用方控制：添加场景较宽松（5000ms），详情接口场景用短超时（2500ms）。
// odAuth 可选：OneDrive 新格式 /c/ 媒体源需要 Authorization: badger 头。
async function probeType(targetUrl, settings, timeoutMs = 5000, odAuth = null) {
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
        const t = classifyType(response.headers.get("Content-Type") || "");
        if (t) return t;
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
  return guessType(targetUrl) || "unknown";
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
  await putImage(env, id, {
    url,
    mode,
    enabled: true,
    name,
    folder,
    type,
    createdAt: Date.now(),
    ...(extra || {}),
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
  const type = await probeType(raw, settings);
  const id = await addMediaRecord(env, { url: raw, mode, name, folder, type });
  const link = await makeLink(request, env, settings, id);
  return json({ id, mode, url: link });
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
    const info = await resolveShareItemV2(raw, auth.token);
    if (info && !info.error) {
      info.odAuth = auth.token;
      info.odShare = raw.trim();
    }
    return info;
  }
  return resolveShareItem(raw);
}

// OneDrive 共享链接解析预览：返回 { isFolder, name, size, childCount }
async function handleOneDriveResolve(request, env) {
  const body = await request.json().catch(() => null);
  const raw = body && typeof body.url === "string" ? body.url.trim() : "";
  if (!raw || !isOneDriveShareUrl(raw)) {
    return json({ error: "无效的 OneDrive 共享链接" }, 400);
  }
  const info = await resolveOneDriveInfo(raw);
  const err = odErrorResponse(info);
  if (err) return err;
  return json({
    ok: true,
    isFolder: info.isFolder,
    name: info.name,
    size: info.size,
    childCount: info.childCount,
  });
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
        ? { odAuth: info.odAuth, odShare: info.odShare, odDriveId: info.driveId, odItemId: info.itemId }
        : undefined,
    });
    const link = await makeLink(request, env, settings, id);
    return json({ ok: true, id, mode, type, url: link });
  }

  // 文件夹：递归遍历全部文件，串行入库；单个失败不中断，汇总返回
  const items = newFormat
    ? await listShareChildrenV2(info.driveId, info.itemId, info.odAuth)
    : await listShareChildren(raw);
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
      const id = await addMediaRecord(env, {
        url: media.url,
        mode,
        name: it.name,
        folder,
        type,
        extra: newFormat
          ? { odAuth: info.odAuth, odShare: info.odShare, odDriveId: info.driveId, odItemId: it.itemId }
          : undefined,
      });
      added++;
      out.push({ name: it.name, ok: true, id });
    } catch {
      failed++;
      out.push({ name: it.name, ok: false });
    }
  }
  return json({ ok: true, isFolder: true, added, failed, items: out, limit: MAX_CHILDREN });
}

// 类型 → 大小限制设置键（与 proxy.js 的 validateMedia 保持一致）
const TYPE_SIZE_KEY = { image: "maxImageSize", audio: "maxAudioSize", video: "maxVideoSize" };

// 剔除不应暴露给前端的敏感字段（OneDrive BadgerAuth 凭证等）
function sanitizeImage(img) {
  const { odAuth, odShare, ...safe } = img;
  return safe;
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
  // 懒纠正：type 为 unknown 且通过白名单校验（或 OneDrive 可信源）时，
  // 短超时探测真实类型并回写 KV，让管理面板卡片即时显示类型徽章（仅触发一次，纠正后不再探测）
  if (img.type === "unknown" && (isAllowedUrl(img.url, settings) || isOneDriveTrustedUrl(img.url))) {
    // OneDrive 新格式探测需带 BadgerAuth
    const odAuth =
      typeof img.odAuth === "string" && img.odAuth && isOneDriveTrustedUrl(img.url)
        ? img.odAuth
        : null;
    const got = await probeType(img.url, settings, 2500, odAuth);
    if (got && got !== "unknown") {
      img.type = got;
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
  // OneDrive 新格式：name 即完整文件名（含扩展名），无论下载名来源都直接用它
  // （v2 content URL 末段是 content，无法从 URL 推导真实文件名）
  if (isODV2 && typeof image.name === "string" && image.name.trim()) {
    cached.headers.set("Content-Disposition", buildContentDisposition(image.name.trim()));
  } else if (settings.downloadNameSource === "custom") {
    // 保存文件名来源：custom 时用「网站自定义名 + 上游扩展名」覆盖上游文件名
    const customName = typeof image.name === "string" ? image.name.trim() : "";
    let saveName;
    if (customName) {
      const ext = upstreamExt(image.url);
      // 自定义名已含扩展名且与上游扩展名一致时不再追加，避免双后缀
      // （如 OneDrive 导入自动填入的完整文件名 photo.jpg + 上游扩展名 jpg）
      const nameExt = customName.includes(".")
        ? customName.slice(customName.lastIndexOf(".") + 1).toLowerCase()
        : "";
      saveName = ext && nameExt !== ext ? `${customName}.${ext}` : customName;
    } else {
      // 自定义名为空时回退上游文件名（含原扩展名，避免双后缀）
      saveName = upstreamFileName(image.url);
    }
    if (saveName) cached.headers.set("Content-Disposition", buildContentDisposition(saveName));
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
};
