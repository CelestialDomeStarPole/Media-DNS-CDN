<div align="center">

# MediaDNS-CDN

Image / Audio / Video hotlink relay · Cache · Anti-leech Cloudflare Worker

[中文](README.md)

</div>

> A media hotlink relay + cache + anti-leech service deployed on Cloudflare Workers. Generate protected short links for any image / audio / video direct URL: supports both 302 redirect (DNS-only) and cached proxy (Worker cache + DNS) modes, with built-in country / IP / ASN / Referer allow & block lists, HMAC signed links, multi-level rate limiting, and automatic video thumbnail frame capture.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [OneDrive Share Link Support](#onedrive-share-link-support)
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
- **Configurable media source**: thumbnails / previews can load from the upstream origin or this site's proxied link (cache proxy mode only)
- **Per-type size limits**: image 50MB / audio 100MB / video 500MB (adjustable in the admin panel)
- **Anti-leech**: Referer allow list; optional HMAC signed links (expiring, unforgeable)
- **Customizable download names**: downloaded file names come from the upstream or from the custom name set in the admin panel
- **Access control**: country / IP / ASN allow & block lists, all validated at the edge
- **Multi-level rate limiting**: separate limits per IP, per image and per audio/video (Rate Limit Binding, enforced at the edge)
- **SSRF protection**: proxied targets must be on the allowed-origin whitelist
- **OneDrive embed-link support**: `1drv.ms/v/c/{cid}/{token}` embed links (and the corresponding `embed` URL) resolve into usable media sources; the `tempauth` anonymous link (~1 hour expiry) is auto-refreshed, so media links keep working long-term

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A [Cloudflare](https://dash.cloudflare.com) account
- Install wrangler (the project lists it as a dev dependency — pick one):

  ```bash
  # Option 1: project-local install (recommended, version locked with the project)
  npm install
  # then use it via npx wrangler (e.g. npx wrangler login)

  # Option 2: global install (the wrangler command is available anywhere)
  npm install -g wrangler
  ```

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
| `DOWNLOAD_NAME_SOURCE` | `upstream` | Download name source: `upstream` (upstream file name) / `custom` (name set on this site) |
| `THUMB_SOURCE` | `upstream` | Thumbnail media source: `upstream` / `site` (proxied link, cache proxy mode only) |
| `PREVIEW_SOURCE` | `upstream` | Preview media source: `upstream` / `site` (proxied link, cache proxy mode only) |
| `ORIGIN_REFERER` / `ORIGIN_USER_AGENT` | empty | Upstream headers forwarded to the origin (to pass origin anti-leech checks) |

### Rate limits (Rate Limit Binding — edit wrangler.jsonc and re-deploy)

| Binding | Default | Description |
| --- | --- | --- |
| `RATE_LIMITER_IP` | 100 / 60s | Per-IP limit |
| `RATE_LIMITER_IMG` | 40 / 10s | Per-image limit |
| `RATE_LIMITER_AV` | 300 / 10s | Per audio/video limit (playback produces many partial-range requests) |

## OneDrive Share Link Support

The "Add media" card has a toggle between **Normal link** and **OneDrive link**. In OneDrive mode you paste an embed share link; after resolving, the file name is filled in automatically and you click "Add" to convert it into a site media link.

> This section explains **how it works**. For how to obtain a share link from OneDrive and paste it here, see your notes at the end of this section.

### Supported link formats

In practice, **only OneDrive embed links** (the `/v/c/` single-file form) resolve successfully, e.g.:

```
https://1drv.ms/v/c/d1c8a5e4bddc4ef4/IQQBQyjnUzI4SaB6B4YC6d8AAVBzhIDzcl6Ec95IL9xCZD4
```

| Type | Example | Notes |
| --- | --- | --- |
| Embed | `https://1drv.ms/v/c/{cid}/{token}` | ✅ verified working (single-file share: video / file) |
| Embed | `https://onedrive.live.com/embed?cid=...&id=...&redeem=...` | Full embed redirect of the same |
| Other | `1drv.ms/u/s!`, `1drv.ms/f/s!`, `1drv.ms/f/c/...` etc. | ⚠️ implemented in code but not verified |

> Only "Anyone with the link" password-free shares are supported. Password-protected (403 `password_required`) or non-public (401 `unauthenticated`) shares show a corresponding hint.

### How it works

OneDrive share links are not directly hotlinkable. The path verified to work is the **embed-link resolution** (`/v/c/` single-file share):

```
【Embed link】1drv.ms/v/c/{cid}/{token} (or onedrive.live.com/embed?...)
   └─> follow the 302 chain, extracting the anonymous session token BadgerAuth
   └─> Authorization: badger <BadgerAuth>
   └─> my.microsoftpersonalcontent.com/_api/v2.0/shares/u!{encoded}/driveitem  → metadata (name/size)
   └─> media source: /_api/v2.0/drives/{driveId}/items/{itemId}/content
        → 302 → download.aspx?UniqueId=...&tempauth=...      (anonymous, valid ~1 hour)
```

**Key design decisions**:

- **Why not store `@content.downloadUrl`?** Microsoft's downloadUrl expires in about 1 hour and can't be stored long-term. This site stores a **stable addressing URL** (the content endpoint); every media request follows the 302 to the freshest direct link, avoiding expiry issues.
- **`tempauth` anonymous link**: the `download.aspx?tempauth=...` returned by the content endpoint needs no auth header and supports Range seeking. The Worker caches it as the media source and **automatically re-resolves when it expires (~1 hour)**.
- **Hourly scheduled auto-refresh**: the Worker has a Cron Trigger (every hour on the hour, `scheduled` event) that walks every media item carrying OneDrive anchors (original share link + driveId/itemId), re-fetches BadgerAuth, resolves the freshest `tempauth` link and writes it back to KV — renewing the token before it expires, with no user action needed.
- **On-demand fallback refresh**: even if a scheduled run is missed, a media request that hits 401 triggers an immediate re-resolve + single retry, keeping the link usable.
- **Type detection**: OneDrive direct links return `application/octet-stream`, so the type can't be read from the response header. The site trusts the **type inferred from the file-name extension at add time**.
- **Targeted SSRF bypass**: OneDrive domains (`my.microsoftpersonalcontent.com`, Microsoft CDN domains) are whitelisted internally; all other domains still obey the SSRF whitelist.

> The legacy formats (`1drv.ms/u/s!`, `/f/s!`) via `api.onedrive.com` shares API are also implemented in code but **not verified** — they may or may not work.

### How to obtain a OneDrive link

<!-- TODO: add your step-by-step guide on generating a share link from the OneDrive web UI and pasting it here -->
<!-- Example (replace with your own text):
1. Open OneDrive on the web, right-click a file → "Share" → "Get a link"
2. Set permission to "Anyone with the link" (do NOT set a password)
3. Copy an embed link like https://1drv.ms/v/c/{cid}/{token} and paste it into this site's "OneDrive link" mode
-->

## Usage

1. Log in to the admin panel → paste a media direct link → choose a mode → add (a live audio/video preview appears while typing)
2. **Add OneDrive links**: click the "OneDrive link" toggle at the top of the add card → paste an embed link `https://1drv.ms/v/c/{cid}/{token}` → click "Resolve" → confirm the file name/size and click "Add"
3. Click the card's "Preview" button to view the full image / play media in the lightbox, then open the original or the site link in a new tab
4. Copy the generated short link `https://your-domain/i/<id>` (with `?e=expiry&s=signature` when signing is enabled)
5. Use it in `<img>` / `<video>` / `<audio>` or any download scenario
6. In **Settings → Cache & Limits**, adjust the "Thumbnail media source" and "Preview media source" (upstream / site source); they take effect immediately after saving

Every request passes a 4-layer validation in both modes: **rate limit → country/IP/ASN allow & block lists → Referer allow list → signature check**, and only then is it redirected or proxied.

## API

All endpoints return JSON; admin endpoints require `Authorization: Bearer <PASSWORD>`.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/login` | Validate login `{ token }` |
| POST | `/api/convert` | Add media `{ url, mode, name?, folder? }`, auto-detects type |
| POST | `/api/onedrive/resolve` | Resolve an OneDrive share link `{ url }` → `{ isFolder, name, size, childCount }` |
| POST | `/api/onedrive/import` | Import an OneDrive file or bulk folder `{ url, mode, name?, folder? }` |
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
│       ├── onedrive.js   # OneDrive legacy & new formats: base64url / redirect chain / BadgerAuth / recursive walk
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
- **Video thumbnails require CORS**: cache proxy mode works out of the box (the Worker returns `Access-Control-Allow-Origin: *`); DNS-only mode depends on the origin's CORS, falling back to an icon placeholder otherwise; video covers always use the proxied link in cache proxy mode because cross-origin frame capture requires CORS
- **Media source settings only apply in cache proxy mode**: choosing the site source affects only "Cache proxy + DNS" media; DNS-only is a 302 redirect and always uses the upstream
- **Referer checks are best effort**: browsers don't always send a Referer header
- **OneDrive embed links need overseas network**: resolving `1drv.ms/v/c/...` embed links needs `onedrive.live.com` (anonymous credential) and `my.microsoftpersonalcontent.com` (data API). Cloudflare Workers on overseas edges can reach them; local `wrangler dev` may time out behind restrictive networks
- **Only "Anyone with the link" shares are resolvable**: password-protected (403) and non-public / people-only (401) shares show a hint and can't be converted
- **OneDrive media sources are proxy-only**: the media source resolved from an embed link relies on Worker proxying, so it is forced to "Cache proxy + DNS" and can't switch to "DNS-only"

## License

[MIT](LICENSE) © 2026 CelestialDomeStarPole
