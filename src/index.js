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
} from "./lib/proxy.js";
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

// 上游文件名（URL 末段，含扩展名），解码还原可读字符，失败返回空串
function upstreamFileName(rawUrl) {
  try {
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

async function sniffType(targetUrl, settings) {
  // 添加时用 HEAD 嗅探媒体类型（图片/音频/视频），失败则按扩展名推断
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const { response } = await fetchOrigin(settings, targetUrl, { method: "HEAD", signal: ctrl.signal });
    if (response && response.status < 400) {
      const t = classifyType(response.headers.get("Content-Type") || "");
      if (t) return t;
    }
  } catch {
  } finally {
    clearTimeout(timer);
  }
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
  const id = generateId();
  const name = sanitizeField(body.name, 60);
  const folder = sanitizeField(body.folder, 30);
  const type = await sniffType(raw, settings);
  await putImage(env, id, { url: raw, mode, enabled: true, name, folder, type, createdAt: Date.now() });
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
  const link = await makeLink(request, env, settings, id);
  return json({ id, mode, url: link });
}

async function handleList(request, env) {
  const settings = await getSettings(env);
  const images = await listImages(env);
  const out = [];
  for (const img of images) {
    out.push({ ...img, shortUrl: await makeLink(request, env, settings, img.id) });
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
  return json({ ...img, shortUrl: await makeLink(request, env, settings, id) });
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
  return json({ ok: true, image: { ...img, id, shortUrl: await makeLink(request, env, settings, id) } });
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

async function handleImage(request, env, id) {
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

  // 仅DNS：校验通过后 302 直跳原图，不缓存，每次请求都过校验
  if (mode === "redirect") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: image.url,
        "Cache-Control": "no-store",
      },
    });
  }

  // 缓存代理+DNS
  if (!isAllowedUrl(image.url, settings)) {
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

  const { response, error } = await fetchOrigin(settings, image.url, { headers: extraHeaders });
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

  const v = validateMedia(response, settings, mediaType);
  if (!v.ok) {
    try {
      await response.body?.cancel();
    } catch {}
    return new Response(v.reason || "Bad Gateway", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const cached = buildCachedResponse(response, settings, id, v.partial);
  // 保存文件名来源：custom 时用「网站自定义名 + 上游扩展名」覆盖上游文件名
  if (settings.downloadNameSource === "custom") {
    const customName = typeof image.name === "string" ? image.name.trim() : "";
    let saveName;
    if (customName) {
      const ext = upstreamExt(image.url);
      saveName = ext ? `${customName}.${ext}` : customName;
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
      return handleImage(request, env, m[1]);
    }

    return new Response("Not Found", { status: 404 });
  },
};
