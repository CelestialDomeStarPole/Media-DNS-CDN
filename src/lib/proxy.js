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

export async function fetchOrigin(settings, targetUrl) {
  const headers = new Headers();
  headers.set("Accept", "image/*,*/*;q=0.8");
  if (settings.originUserAgent) headers.set("User-Agent", settings.originUserAgent);
  if (settings.originReferer) headers.set("Referer", settings.originReferer);

  let resp = await fetch(targetUrl, { headers, redirect: "manual" });
  let hops = 0;
  while (resp.status >= 300 && resp.status < 400 && hops < 5) {
    const loc = resp.headers.get("Location");
    if (!loc) break;
    const next = new URL(loc, targetUrl).toString();
    if (!isAllowedUrl(next, settings)) {
      try {
        await resp.body?.cancel();
      } catch {}
      return { error: "redirect-not-allowed" };
    }
    resp = await fetch(next, { headers, redirect: "manual" });
    hops++;
  }
  return { response: resp };
}

export function validateImage(resp, settings) {
  const ct = resp.headers.get("Content-Type") || "";
  if (!ct.startsWith("image/")) return { ok: false, reason: "非图片内容" };
  const len = Number(resp.headers.get("Content-Length") || 0);
  if (len && len > settings.maxImageSize)
    return { ok: false, reason: "图片超过大小限制" };
  return { ok: true };
}

export function buildCachedResponse(resp, settings, id) {
  const out = new Response(resp.body, resp);
  out.headers.set("Cache-Control", `public, max-age=${settings.cacheTtl}`);
  out.headers.delete("Set-Cookie");
  out.headers.set("Cache-Tag", `img,img-${id}`);
  return out;
}
