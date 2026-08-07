const SETTINGS_KEY = "settings:global";
const IMG_PREFIX = "img:";
const FOLDER_KEY = "folders:list";
const ORDER_KEY = "images:order";

// isolate 内存微缓存 settings，避免每个请求都读 KV（免费版 KV 有读额度）
const SETTINGS_CACHE_MS = 15000;
let settingsCache = { data: null, at: 0 };

export function splitList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  }
  return String(raw)
    .split(/[,，\s]+/)
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export function numList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim()).filter(Boolean);
  }
  return String(raw)
    .split(/[,，\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function defaultSettings(env) {
  return {
    allowedOrigins: splitList(env.ALLOWED_ORIGINS),
    allowedCountries: splitList(env.ALLOWED_COUNTRIES),
    blockedCountries: splitList(env.BLOCKED_COUNTRIES),
    allowedIps: splitList(env.ALLOWED_IPS),
    blockedIps: splitList(env.BLOCKED_IPS),
    allowedAsn: numList(env.ALLOWED_ASN),
    blockedAsn: numList(env.BLOCKED_ASN),
    allowedReferers: splitList(env.ALLOWED_REFERERS),
    requireSignature:
      env.REQUIRE_SIGNATURE === true || env.REQUIRE_SIGNATURE === "true",
    signatureTtl: Number(env.SIGNATURE_TTL || 3600),
    cacheTtl: Number(env.CACHE_TTL || 2592000),
    maxImageSize: Number(env.MAX_IMAGE_SIZE || 52428800),
    maxAudioSize: Number(env.MAX_AUDIO_SIZE || 104857600),
    maxVideoSize: Number(env.MAX_VIDEO_SIZE || 524288000),
    defaultMode: env.DEFAULT_MODE === "proxy" ? "proxy" : "redirect",
    downloadNameSource:
      env.DOWNLOAD_NAME_SOURCE === "custom" ? "custom" : "upstream",
    thumbSource: env.THUMB_SOURCE === "site" ? "site" : "upstream",
    previewSource: env.PREVIEW_SOURCE === "site" ? "site" : "upstream",
    originReferer: env.ORIGIN_REFERER || "",
    originUserAgent: env.ORIGIN_USER_AGENT || "",
  };
}

export async function getSettings(env) {
  const now = Date.now();
  if (settingsCache.data && now - settingsCache.at < SETTINGS_CACHE_MS) {
    return settingsCache.data;
  }
  let data;
  const raw = await env.MAPPINGS.get(SETTINGS_KEY);
  if (raw) {
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch {}
    data = { ...defaultSettings(env), ...parsed };
  } else {
    data = defaultSettings(env);
    try {
      await env.MAPPINGS.put(SETTINGS_KEY, JSON.stringify(data));
    } catch {}
  }
  settingsCache = { data, at: now };
  return data;
}

export async function saveSettings(env, settings) {
  await env.MAPPINGS.put(SETTINGS_KEY, JSON.stringify(settings));
  settingsCache = { data: settings, at: Date.now() };
}

export async function getImage(env, id) {
  const raw = await env.MAPPINGS.get(IMG_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function putImage(env, id, data) {
  await env.MAPPINGS.put(IMG_PREFIX + id, JSON.stringify(data));
}

export async function deleteImage(env, id) {
  await env.MAPPINGS.delete(IMG_PREFIX + id);
}

export async function getOrder(env) {
  const raw = await env.MAPPINGS.get(ORDER_KEY);
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((x) => typeof x === "string" && x);
  } catch {}
  return null;
}

export async function saveOrder(env, ids) {
  await env.MAPPINGS.put(ORDER_KEY, JSON.stringify(ids));
}

export async function listImages(env) {
  const result = await env.MAPPINGS.list({ prefix: IMG_PREFIX });
  const images = [];
  for (const item of result.keys) {
    const raw = await env.MAPPINGS.get(item.name);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      data.id = item.name.slice(IMG_PREFIX.length);
      images.push(data);
    } catch {}
  }
  // 有拖拽排序记录时按记录排序，否则按创建时间倒序（新在前）
  const order = await getOrder(env);
  if (order && order.length) {
    const idx = new Map(order.map((id, i) => [id, i]));
    images.sort((a, b) => {
      const ia = idx.get(a.id);
      const ib = idx.get(b.id);
      if (ia !== undefined && ib !== undefined) return ia - ib;
      if (ia !== undefined) return -1;
      if (ib !== undefined) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  } else {
    images.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  return images;
}

// 仅返回有序 id 列表（轻量，供前端预渲染占位卡）。
// 有显式排序记录时只需一次 KV 读；无记录时回退到 listImages 取 id（仅发生在从未有过排序记录的存量数据）。
export async function getOrderedIds(env) {
  const order = await getOrder(env);
  if (order && order.length) return order;
  const images = await listImages(env);
  return images.map((x) => x.id);
}

export async function getFolders(env) {
  const raw = await env.MAPPINGS.get(FOLDER_KEY);
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.filter((x) => typeof x === "string" && x);
    } catch {}
  }
  return [];
}

export async function saveFolders(env, list) {
  await env.MAPPINGS.put(FOLDER_KEY, JSON.stringify(list));
}
