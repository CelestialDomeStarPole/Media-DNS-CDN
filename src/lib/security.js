const enc = new TextEncoder();

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function auth(request, env) {
  const header = request.headers.get("Authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token || !env.PASSWORD) return false;
  return timingSafeEqual(token, env.PASSWORD);
}

function includesList(list, value) {
  if (!value) return false;
  const v = String(value).toLowerCase();
  return list.some((item) => String(item).toLowerCase() === v);
}

export function checkGeoIp(request, settings) {
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const cf = request.cf || {};
  const country = cf.country || "";
  const asn = cf.asn ? String(cf.asn) : "";

  if (settings.blockedIps.length && includesList(settings.blockedIps, ip))
    return { ok: false, reason: "IP 已被封禁" };
  if (settings.allowedIps.length && !includesList(settings.allowedIps, ip))
    return { ok: false, reason: "IP 不在白名单" };
  if (settings.blockedCountries.length && includesList(settings.blockedCountries, country))
    return { ok: false, reason: "所在地区已被封禁" };
  if (settings.allowedCountries.length && !includesList(settings.allowedCountries, country))
    return { ok: false, reason: "所在地区不在白名单" };
  if (settings.blockedAsn.length && includesList(settings.blockedAsn, asn))
    return { ok: false, reason: "ASN 已被封禁" };
  if (settings.allowedAsn.length && !includesList(settings.allowedAsn, asn))
    return { ok: false, reason: "ASN 不在白名单" };
  return { ok: true };
}

export function checkReferer(request, settings) {
  const allowed = settings.allowedReferers;
  if (!allowed.length) return { ok: true };
  const referer = request.headers.get("Referer");
  if (!referer) return { ok: false, reason: "缺少 Referer" };
  let host;
  try {
    host = new URL(referer).hostname;
  } catch {
    return { ok: false, reason: "Referer 无效" };
  }
  const ok = allowed.some((d) => host === d || host.endsWith("." + d));
  return ok ? { ok: true } : { ok: false, reason: "Referer 不在白名单" };
}

async function hmacHex(keyStr, msg) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(keyStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signLink(id, ttl, secret) {
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const sig = await hmacHex(secret, `${id}.${exp}`);
  return { exp, sig };
}

export async function verifySignature(id, exp, sig, secret) {
  if (!exp || !sig) return false;
  if (Date.now() / 1000 > Number(exp)) return false;
  const expected = await hmacHex(secret, `${id}.${exp}`);
  return timingSafeEqual(sig.toLowerCase(), expected);
}

export async function checkRateLimit(request, env, imageId) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipRes = await env.RATE_LIMITER_IP.limit({ key: ip });
  if (!ipRes.success) return { ok: false, key: "ip" };
  const imgRes = await env.RATE_LIMITER_IMG.limit({ key: imageId });
  if (!imgRes.success) return { ok: false, key: "image" };
  return { ok: true };
}
