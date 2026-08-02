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
  validateImage,
  buildCachedResponse,
} from "./lib/proxy.js";
import { renderUI } from "./lib/ui.js";

const IMAGE_PATH = /^\/i\/([A-Za-z0-9_-]+)\/?$/;
const IMAGE_ID_RE = /^[A-Za-z0-9_-]+$/;

function generateId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sanitizeField(v, max) {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);
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
  if (!raw) return json({ error: "请填写图片链接" }, 400);
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
  await putImage(env, id, { url: raw, mode, enabled: true, name, folder, createdAt: Date.now() });
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

async function handleUpdateImage(request, env) {
  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === "string" ? body.id : "";
  if (!id || !IMAGE_ID_RE.test(id)) return json({ error: "ID 无效" }, 400);
  const img = await getImage(env, id);
  if (!img) return json({ error: "图片不存在" }, 404);
  if (body.name !== undefined) img.name = sanitizeField(body.name, 60);
  if (body.folder !== undefined) img.folder = sanitizeField(body.folder, 30);
  await putImage(env, id, img);
  return json({ ok: true });
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
  await purgeTag(ctx, `img-${id}`);
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
    defaultMode: raw.defaultMode === "proxy" ? "proxy" : "redirect",
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

  const rl = await checkRateLimit(request, env, id);
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

  const image = await getImage(env, id);
  if (!image || image.enabled === false) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
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

  const { response, error } = await fetchOrigin(settings, image.url);
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

  const v = validateImage(response, settings);
  if (!v.ok) {
    try {
      await response.body?.cancel();
    } catch {}
    return new Response(v.reason || "Bad Gateway", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return buildCachedResponse(response, settings, id);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/") {
      return new Response(renderUI(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    if (pathname === "/api/login") return handleLogin(request, env);
    if (pathname === "/api/convert") return requireAuth(request, env, () => handleConvert(request, env));
    if (pathname === "/api/images") return requireAuth(request, env, () => handleList(request, env));
    if (pathname === "/api/image/delete") return requireAuth(request, env, () => handleDelete(request, env, ctx));
    if (pathname === "/api/image/toggle") return requireAuth(request, env, () => handleToggle(request, env, ctx));
    if (pathname === "/api/image/update") return requireAuth(request, env, () => handleUpdateImage(request, env));
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
