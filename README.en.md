# MediaDNS-CDN

Image / Audio / Video hotlink relay · Cache · Anti-leech Cloudflare Worker

[中文](README.md)

> A media hotlink relay + cache + anti-leech service deployed on Cloudflare Workers. Generate protected short links for any image / audio / video direct URL: supports both 302 redirect (DNS-only) and cached proxy (Worker cache + DNS) modes, with built-in country / IP / ASN / Referer allow & block lists, HMAC signed links, multi-level rate limiting, and automatic video thumbnail frame capture.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage](#usage)
- [API](#api)
- [Project Structure](#project-structure)
- [Notes & Limits](#notes--limits)
- [License](#license)

## Features

- **Multi-media support**: images (jpg/png/webp/gif…), audio (mp3/m4a/flac…) and video (mp4/webm/mov…)
- **Two link modes**:
  - **DNS-only**: 302 redirect to the origin; no Worker bandwidth cost; every request passes validation
  - **Cache proxy + DNS**: the Worker fetches the origin and writes into Cloudflare edge cache; hits are served from the edge directly
- **Video playback friendly**: forwards `Range` / `If-Range` headers for seeking; full 200 responses are cached and subsequent range requests are sliced by the edge from the cached object; 206 partial responses pass through uncached
- **Video thumbnails**: the admin panel auto-captures a video frame as the card preview (client-side canvas capture, no backend processing)
- **Per-type size limits**: image 50MB / audio 100MB / video 500MB (adjustable in the admin panel)
- **Anti-leech**: Referer allow list; optional HMAC signed links (expiring, unforgeable)
- **Access control**: country / IP / ASN allow & block lists, all validated at the edge
- **Multi-level rate limiting**: separate limits per IP, per image and per audio/video (Rate Limit Binding, enforced at the edge)
- **SSRF protection**: proxied targets must be on the allowed-origin whitelist
- **Bilingual admin panel**: media CRUD, folders, search, one-click copy, lightbox preview, zh / EN toggle and dynamic themes

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A [Cloudflare](https://dash.cloudflare.com) account
- wrangler installed: `npm install`

### Authenticate with Cloudflare (pick one)

**Option 1: OAuth browser authorization (recommended)**

```bash
npx wrangler login
# Authorize in the browser; credentials are stored locally
```

**Option 2: API Token (for CI / servers / environments without a browser)**

1. Open the Cloudflare dashboard → avatar (top-right) → **My Profile** → **API Tokens** → **Create Token**
2. Pick the **Edit Cloudflare Workers** template (or a custom token covering):

   | Permission | Scope |
   | --- | --- |
   | Account → Workers Scripts → Edit | required |
   | Account → Workers KV Storage → Edit | required (create / read / write KV namespaces) |
   | Account → Account Settings → Read | recommended |
   | Account → Workers Routes → Edit | optional (custom domain routes) |

3. After creating the token, export it as an environment variable (wrangler reads it automatically — no `wrangler login` needed):

   ```powershell
   # Windows PowerShell
   $env:CLOUDFLARE_API_TOKEN = "your-token"
   ```
   ```bash
   # macOS / Linux
   export CLOUDFLARE_API_TOKEN="your-token"
   ```

4. Verify:

   ```bash
   npx wrangler whoami
   # Should print your account info (Account ID, etc.)
   ```

> Keep the token secret (with permissions it equals account credentials). Scope it to the account, restrict permissions, set an expiry, and never commit it to a repository.

### Deploy

```bash
# 1. Install dependencies
npm install

# 2. Authenticate with Cloudflare (see "Authenticate with Cloudflare" above: OAuth or API Token)

# 3. Create the KV namespace (mappings & settings storage)
npx wrangler kv namespace create MAPPINGS
# Put the returned id into wrangler.jsonc -> kv_namespaces[0].id

# 4. Configure secrets (admin password / signing key)
npx wrangler secret put PASSWORD        # admin panel login password
npx wrangler secret put SIGNING_SECRET  # HMAC link signing key (required when signed links are enabled)
# PASSWORD can also be added in the dashboard: Workers -> Settings -> Variables and Secrets

# 5. (Optional) Make sure rate-limit namespace_ids are unique
# The ratelimits namespace_ids in wrangler.jsonc (1001/1002/1003) are custom positive
# integers; just keep them unique within your account, change them if they collide.

# 6. Deploy
npm run deploy
```

After deployment, open `https://<worker-name>.<subdomain>.workers.dev`, log in with PASSWORD, then fill in the allowed-origin whitelist in **Settings** (SSRF whitelist — required, otherwise you can't add links).

### Local Development

```bash
# Copy the example and fill in the same secrets as production
Copy-Item .dev.vars.example .dev.vars   # Windows
cp .dev.vars.example .dev.vars          # macOS / Linux

npm run dev
# Visit http://127.0.0.1:8787
```

> `.dev.vars` is git-ignored.

## Configuration

### Secrets

| Name | Description |
| --- | --- |
| `PASSWORD` | Admin panel login password (Bearer Token auth) |
| `SIGNING_SECRET` | HMAC link signing key, required when `requireSignature` is enabled |

### Environment variables (deploy-time defaults; after deployment they can be changed at runtime in the admin panel and take effect immediately)

| Name | Default | Description |
| --- | --- | --- |
| `ALLOWED_ORIGINS` | empty | SSRF whitelist: domains allowed to be proxied, comma separated, **required** |
| `ALLOWED_COUNTRIES` / `BLOCKED_COUNTRIES` | empty | Country allow / block lists (ISO codes) |
| `ALLOWED_IPS` / `BLOCKED_IPS` | empty | IP allow / block lists |
| `ALLOWED_ASN` / `BLOCKED_ASN` | empty | ASN allow / block lists |
| `ALLOWED_REFERERS` | empty | Referer allow list (best effort; spoofable) |
| `REQUIRE_SIGNATURE` | `false` | Generate links with expiring HMAC signatures (strongest hotlink protection) |
| `SIGNATURE_TTL` | `3600` | Signature validity (seconds) |
| `CACHE_TTL` | `2592000` | Cache TTL (seconds), only applies to cache proxy mode |
| `MAX_IMAGE_SIZE` | `52428800` | Max image size (bytes, 50MB) |
| `MAX_AUDIO_SIZE` | `104857600` | Max audio size (bytes, 100MB) |
| `MAX_VIDEO_SIZE` | `524288000` | Max video size (bytes, 500MB) |
| `DEFAULT_MODE` | `redirect` | Default link type: `redirect` / `proxy` |
| `ORIGIN_REFERER` / `ORIGIN_USER_AGENT` | empty | Upstream headers forwarded to the origin (to pass origin anti-leech checks) |

### Rate limits (Rate Limit Binding — edit wrangler.jsonc and re-deploy)

| Binding | Default | Description |
| --- | --- | --- |
| `RATE_LIMITER_IP` | 100 / 60s | Per-IP limit |
| `RATE_LIMITER_IMG` | 40 / 10s | Per-image limit |
| `RATE_LIMITER_AV` | 300 / 10s | Per audio/video limit (playback produces many partial-range requests) |

## Usage

1. Log in to the admin panel → paste a media direct link → choose a mode → add
2. Copy the generated short link `https://your-domain/i/<id>` (with `?e=expiry&s=signature` when signing is enabled)
3. Use it in `<img>` / `<video>` / `<audio>` or any download scenario

Every request passes a 4-layer validation in both modes: **rate limit → country/IP/ASN allow & block lists → Referer allow list → signature check**, and only then is it redirected or proxied.

## API

All endpoints return JSON; admin endpoints require `Authorization: Bearer <PASSWORD>`.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/login` | Validate login `{ token }` |
| POST | `/api/convert` | Add media `{ url, mode, name?, folder? }`, auto-detects type |
| GET | `/api/images` | Media list + folder list |
| POST | `/api/image/delete` | Delete `{ id }` |
| POST | `/api/image/toggle` | Enable / disable `{ id, enabled }` |
| POST | `/api/image/update` | Rename / move `{ id, name?, folder? }` |
| POST | `/api/folder/create` | Create folder `{ name }` |
| POST | `/api/folder/rename` | Rename folder `{ from, to }` |
| POST | `/api/folder/delete` | Delete folder `{ name }` |
| GET / PUT | `/api/settings` | Read / save settings |
| GET / HEAD | `/i/<id>` | Media entry (302 or cached proxy) |

## Project Structure

```
├── src/
│   ├── index.js          # Worker entry: routing / validation flow / type sniffing
│   └── lib/
│       ├── proxy.js      # Origin fetch / Range forwarding / per-type validation / cache response
│       ├── store.js      # KV storage / settings (with 15s in-memory micro cache)
│       ├── security.js   # Auth / signing / rate limiting / allow & block lists
│       └── ui.js         # Bilingual admin panel (template string)
├── wrangler.jsonc        # Worker config: KV / rate limits / environment variables
├── .dev.vars.example     # Local dev secrets example
└── package.json          # npm scripts: dev / deploy / check
```

## Notes & Limits

- **512MB cache limit**: Cloudflare free plan caches objects up to 512MB; larger videos are not cached in cache proxy mode — use DNS-only mode for them
- **KV eventual consistency**: deletes propagate globally within ~60s (the admin panel removes items locally at once, so they disappear immediately)
- **Partial responses are not cached**: 206 responses pass through; once the full 200 object is cached, subsequent range requests are sliced by the edge from the cached object
- **HLS/DASH**: proxied as whole files only, no segment URL rewriting; most HLS origins reject non-standard requests — extend it yourself if you need full streaming support
- **Video thumbnails require CORS**: cache proxy mode works out of the box (the Worker returns `Access-Control-Allow-Origin: *`); DNS-only mode depends on the origin's CORS, falling back to an icon placeholder otherwise
- **Referer checks are best effort**: browsers don't always send a Referer header

## License

[MIT](LICENSE) © 2026 CelestialDomeStarPole
