import {
  isOneDriveTrustedUrl,
  isOneDriveCdnHost,
  MY_CONTENT_HOST,
} from "./onedrive.js";

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "avif", "jxl", "bmp", "svg", "ico", "tiff", "tif"];
const AUDIO_EXT = ["mp3", "wav", "ogg", "oga", "aac", "flac", "m4a", "opus", "wma", "amr", "weba"];
const VIDEO_EXT = ["mp4", "webm", "mov", "avi", "mkv", "m4v", "ts", "3gp", "mpg", "mpeg", "wmv", "flv", "ogv", "m3u8", "mpd"];
const TYPE_SIZE_KEY = { image: "maxImageSize", audio: "maxAudioSize", video: "maxVideoSize" };

// 按文件名扩展名判断媒体类型（供 OneDrive content URL 等无法从 URL 末段取扩展名的场景兜底）
export function guessTypeFromName(name) {
  const n = String(name || "").toLowerCase();
  const i = n.lastIndexOf(".");
  if (i <= 0 || i === n.length - 1) return null;
  const ext = n.slice(i + 1);
  if (IMAGE_EXT.indexOf(ext) !== -1) return "image";
  if (AUDIO_EXT.indexOf(ext) !== -1) return "audio";
  if (VIDEO_EXT.indexOf(ext) !== -1) return "video";
  return null;
}

export function isAllowedUrl(raw, settings) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  return settings.allowedOrigins.some(
    (d) => host === d || host.endsWith("." + d)
  );
}

export function classifyType(contentType) {
  if (!contentType) return null;
  const ct = contentType.toLowerCase();
  if (ct.startsWith("image/")) return "image";
  if (ct.startsWith("audio/")) return "audio";
  if (ct.startsWith("video/")) return "video";
  // HLS / DASH / mp4 容器的常见非标准 Content-Type，按视频处理
  if (
    ct === "application/vnd.apple.mpegurl" ||
    ct === "application/x-mpegurl" ||
    ct === "application/dash+xml" ||
    ct === "application/mp4"
  ) {
    return "video";
  }
  return null;
}

export function guessType(rawUrl) {
  let path;
  try {
    path = new URL(rawUrl).pathname.toLowerCase();
  } catch {
    return null;
  }
  const ext = path.split(".").pop() || "";
  if (IMAGE_EXT.indexOf(ext) !== -1) return "image";
  if (AUDIO_EXT.indexOf(ext) !== -1) return "audio";
  if (VIDEO_EXT.indexOf(ext) !== -1) return "video";
  return null;
}

// 重定向目标校验：
// - OneDrive 可信媒体源（api.onedrive.com shares content / my.microsoftpersonalcontent.com items content）：
//   302 放行微软 CDN 域集合（files.1drv.com / sharepoint.com / svc.ms 等，含子域）
// - 其他源：保持原 SSRF 白名单校验，不放行任意域名
export function isAllowedRedirect(targetUrl, next, settings) {
  if (isOneDriveTrustedUrl(targetUrl)) {
    return (
      isOneDriveTrustedUrl(next) ||
      isOneDriveCdnHost(next) ||
      isMyContentHost(next)
    );
  }
  return isAllowedUrl(next, settings);
}

// my.microsoftpersonalcontent.com 域内的 v2 重定向（如带 tempauth 的分发链接）
function isMyContentHost(raw) {
  try {
    return new URL(raw).hostname.toLowerCase() === MY_CONTENT_HOST;
  } catch {
    return false;
  }
}

export async function fetchOrigin(settings, targetUrl, opts) {
  opts = opts || {};
  const headers = new Headers();
  headers.set("Accept", "image/*,audio/*,video/*,*/*;q=0.8");
  if (settings.originUserAgent) headers.set("User-Agent", settings.originUserAgent);
  if (settings.originReferer) headers.set("Referer", settings.originReferer);
  if (opts.headers) {
    for (const [k, v] of opts.headers) {
      if (v) headers.set(k, v);
    }
  }
  const method = opts.method || "GET";
  const fetchOpts = { method, headers, redirect: "manual" };
  if (opts.signal) fetchOpts.signal = opts.signal;

  let resp = await fetch(targetUrl, fetchOpts);
  let hops = 0;
  while (resp.status >= 300 && resp.status < 400 && hops < 5) {
    const loc = resp.headers.get("Location");
    if (!loc) break;
    const next = new URL(loc, targetUrl).toString();
    if (!isAllowedRedirect(targetUrl, next, settings)) {
      try {
        await resp.body?.cancel();
      } catch {}
      return { error: "redirect-not-allowed" };
    }
    resp = await fetch(next, fetchOpts);
    hops++;
  }
  return { response: resp };
}

// hintType: 可选的兜底类型（如 OneDrive 直链 name 扩展名推断的 media type），
// 用于 SharePoint download.aspx 直链返回 application/octet-stream 等无法从 Content-Type 识别的情形。
export function validateMedia(resp, settings, type, hintType) {
  // 206 分片响应：不缓存、不按整文件校验，仅要求合法 Content-Range
  if (resp.status === 206) {
    if (!resp.headers.get("Content-Range")) return { ok: false, reason: "非法分片响应" };
    return { ok: true, partial: true };
  }
  const ct = resp.headers.get("Content-Type") || "";
  let got = classifyType(ct);
  // octet-stream（SharePoint 下载直链默认类型）且已有扩展名推断类型时按 hintType 放行
  if (!got && hintType) {
    const isOctet = ct.toLowerCase().includes("octet-stream") || !ct;
    if (isOctet) got = hintType;
  }
  if (!got) return { ok: false, reason: "非媒体内容" };
  if (type && type !== "unknown" && got !== type)
    return { ok: false, reason: "内容类型与添加时不一致" };
  const len = Number(resp.headers.get("Content-Length") || 0);
  const limit = settings[TYPE_SIZE_KEY[got]] || 0;
  if (len && limit && len > limit) return { ok: false, reason: "文件超过大小限制" };
  return { ok: true, type: got };
}

export function buildCachedResponse(resp, settings, id, partial) {
  const out = new Response(resp.body, resp);
  out.headers.set("Access-Control-Allow-Origin", "*");
  if (partial) {
    // 分片内容不缓存，避免把 206 部分数据缓存成完整对象
    out.headers.set("Cache-Control", "private, no-store");
    out.headers.delete("Set-Cookie");
    return out;
  }
  out.headers.set("Cache-Control", `public, max-age=${settings.cacheTtl}`);
  out.headers.delete("Set-Cookie");
  out.headers.set("Cache-Tag", `img,img-${id}`);
  return out;
}
