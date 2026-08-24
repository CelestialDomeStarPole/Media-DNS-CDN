<div align="center">

# MediaDNS-CDN

Image / Audio / Video hotlink relay · Cache · Anti-leech Cloudflare Worker

[中文](README.md)

</div>

> A media hotlink relay + cache + anti-leech service deployed on Cloudflare Workers. Generate protected short links for any image / audio / video direct URL: supports both 302 redirect (DNS-only) and cached proxy (Worker cache + DNS) modes, with built-in country / IP / ASN / Referer allow & block lists, HMAC signed links, and multi-level rate limiting. [Live Demo](https://media.cdsp.us.ci)

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [OneDrive Share Link Support](#onedrive-share-link-support)
- [Usage](#usage)
- [API](#api)
- [How OneDrive direct links are resolved](#how-onedrive-direct-links-are-resolved)
- [Notes & Limits](#notes--limits)
- [License](#license)

## Features

- **Two link modes**:
  - **DNS-only**: 302 redirect to the origin; no Worker bandwidth cost; every request passes validation
  - **Cache proxy + DNS**: the Worker fetches the origin and writes into Cloudflare edge cache; hits are served from the edge directly
- **Video playback friendly**: forwards `Range` / `If-Range` headers for seeking; full 200 responses are cached and subsequent range requests are sliced by the edge from the cached object; 206 partial responses pass through uncached
- **Anti-leech**: Referer allow list; optional HMAC signed links (expiring, unforgeable)
- **Customizable download names**: downloaded file names come from the upstream or from the custom name set in the admin panel
- **Access control**: country / IP / ASN allow & block lists, all validated at the edge
- **SSRF protection**: proxied targets must be on the allowed-origin whitelist
- **OneDrive share-link support**: supports OneDrive links,can convert a OneDrive link into a direct link.

## Screenshots

<p align="center">
  <img src="https://media.starpole.cc.cd/i/be016a2756cd34b5" alt="MediaDNS-CDN screenshot 1" width="49%" />
  <img src="https://media.starpole.cc.cd/i/a106c82feaf4caa1" alt="MediaDNS-CDN screenshot 2" width="49%" />
</p>

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A [Cloudflare](https://dash.cloudflare.com) account
- Clone this repository to your local machine:

  > Click the **Code** button at the top-right → **Download ZIP**
  > Or run it in a folder:

  ```bash
  git clone https://github.com/starpole/MediaDNS-CDN.git
  ```

- Install wrangler (the project lists it as a dev dependency — pick one):

  > Option 1: project-local install (recommended, version locked with the project)
  > Run in the project root:

  ```bash
  npm install
  ```

  > Option 2: global install (the wrangler command is available anywhere)

  ```
  npm install -g wrangler
  ```

### Authenticate with Cloudflare (pick one)

**Option 1: OAuth browser authorization (recommended)**

> Authorize in the browser; credentials are stored locally

```bash
npx wrangler login
```

**Option 2: API Token (for CI / servers / environments without a browser)**

1. Open the Cloudflare dashboard → account management (bottom-left) → **API Tokens** → **Create Token**
2. In **Permission policies**, pick the **Edit Cloudflare Workers** template (or customize, including the permissions below):

   | Permission                          | Scope                                          |
   | ----------------------------------- | ---------------------------------------------- |
   | Account → Workers Scripts → Edit    | required                                       |
   | Account → Workers KV Storage → Edit | required (create / read / write KV namespaces) |
   | Account → Account Settings → Read   | recommended                                    |
   | Zone → Workers Routes → Edit        | optional (custom domain routes)                |

3. After creating the token, copy it and run the commands below:

   > If using Windows PowerShell:

   ```powershell
   $env:CLOUDFLARE_API_TOKEN = "your-token"
   ```

   > If using macOS / Linux:

   ```bash
   export CLOUDFLARE_API_TOKEN="your-token"
   ```

   > If you already installed wrangler globally and don't want to use the global account, create a file named **.env** in the project root and write:

   ```.env file content
   CLOUDFLARE_API_TOKEN=paste-your-token
   CLOUDFLARE_ACCOUNT_ID=paste-the-account-id-for-that-account
   ```

   wrangler prefers variables from the `.env` file. Remember not to commit `.env` to your repository.

4. Verify:

   ```bash
   npx wrangler whoami
   ```

   > Should print your account info (Account ID, etc.)

> Keep the token secret (with permissions it equals account credentials). Scope it to the account, restrict permissions, set an expiry, and never commit it to a repository.

### Deploy

```bash
# 1. Install dependencies
npm install

# 2. Authenticate with Cloudflare (see "Authenticate with Cloudflare" above: OAuth or API Token)

# 3. (Optional) Create a custom-domain route: uncomment the `routes` section in
#    wrangler.jsonc and fill in your domain (requires Zone -> Workers Routes -> Edit permission)

# 4. Create the KV namespace (mappings & settings storage)
npx wrangler kv namespace create MAPPINGS
# If it asks "Would you like Wrangler to add it on your behalf? [Y/N]", Y is recommended
# If it asks "What binding name would you like to use?", just press Enter
# If it asks "For local dev, do you want to connect to the remote resource instead of a local resource? [Y/N]", N is recommended. Choosing Yes makes your local `wrangler dev` operate on the real KV / R2 / D1 data in your Cloudflare account over the network; dev code may contain bugs, and one wrong move (e.g. a delete) removes real data.
# Wrangler fills the returned id into kv_namespaces[0].id automatically.
# If it doesn't, run `npx wrangler kv namespace list` to look it up and fill it in manually.

# 5. Configure secrets (admin password / signing key)
npx wrangler secret put PASSWORD        # admin panel login password
# Type your admin password
# It may then ask: There doesn't seem to be a Worker called "media-dns-cdn". Do you want to create a new Worker with that name and add secrets to it? [Y/N]  Choose Y
npx wrangler secret put SIGNING_SECRET  # HMAC link signing key (required when signed links are enabled)
# Type your signing key

# You may also deploy first and then run the two commands above — no prompts then, but remember to add them, otherwise the service won't work.
# PASSWORD and SIGNING_SECRET can also be added after deployment in the dashboard: Workers -> Settings -> Variables and Secrets (encrypted Secrets are recommended; plain Variables also work)

# 6. (Optional) Make sure rate-limit namespace_ids are unique
# The ratelimits namespace_ids in wrangler.jsonc (1001/1002/1003) are custom positive integers;
# just keep them unique within your account, change them if they collide.

# 7. Deploy
npm run deploy
```

After deployment, open `https://<worker-name>.<subdomain>.workers.dev`, log in with PASSWORD, then fill in the allowed-origin whitelist in **Settings** (SSRF whitelist — required, otherwise you can't add links).

### Local Development

Create a `.dev.vars` file manually in the project root and fill in the two secrets (recommended to match production):

```bash
PASSWORD=your_admin_password
SIGNING_SECRET=your_signing_secret
```

Then start local development:

```bash
npm run dev
# Visit http://127.0.0.1:8787
```

> `.dev.vars` is a local secrets file — don't commit it to the repository. `wrangler dev` reads it automatically (shown as `(hidden)` in the terminal). `PASSWORD` is for logging into the admin panel; `SIGNING_SECRET` is used for HMAC signing when signed links are enabled.

## Configuration

### Secrets

| Name             | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `PASSWORD`       | Admin panel login password (Bearer Token auth)                     |
| `SIGNING_SECRET` | HMAC link signing key, required when `requireSignature` is enabled |

### Rate limits (Rate Limit Binding — edit wrangler.jsonc and re-deploy)

| Binding            | Default   | Description                                                           |
| ------------------ | --------- | --------------------------------------------------------------------- |
| `RATE_LIMITER_IP`  | 100 / 60s | Per-IP limit                                                          |
| `RATE_LIMITER_IMG` | 40 / 10s  | Per-image limit                                                       |
| `RATE_LIMITER_AV`  | 300 / 10s | Per audio/video limit (playback produces many partial-range requests) |

## OneDrive Share Link Support

The "Add media" card has a toggle between **Normal link** and **OneDrive link**. In OneDrive mode you paste a share link; after resolving, the file name is filled in automatically and you click "Add" to convert it into a site media link.

### How to obtain a OneDrive link

#### Share links

Open the OneDrive web app, right-click the target file or folder → **Share** (you may set an expiry date and whether others can edit, but it must be accessible by anyone and must NOT be password-protected) → **Copy link**

#### Embed links

Open the OneDrive web app, right-click the target file → **Embed** → **Generate** → copy the link inside the quotes of `src="https://1drv.ms/..."`.

### Supported link formats

Both OneDrive **embed links and ordinary share links** resolve successfully, for example:

| Type                | Example                                                | Notes                                                 |
| ------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| Embed link          | `https://1drv.ms/v/c/{cid}/{token}`                    | ✅ verified working (single-file share: video / file) |
| Ordinary share link | `1drv.ms/u/s!`, `1drv.ms/f/s!`, `1drv.ms/f/c/...` etc. | ✅ verified working (single-file / folder share)      |

> Two `/v/c/` links for the same file may land on **different redirect shapes**: one goes straight to the `/embed` page, the other hops through `photos.onedrive.com` to `onedrive.live.com/?qt=allmyphotos&v=photos` (photos mode). Both are supported — the photos mode is automatically converted to an equivalent `/embed` address for resolution, with a `v2.1 drives/items` fallback if needed, so you don't have to tell them apart.

> Only "Anyone with the link" password-free shares are supported. Password-protected (403 `password_required`) or non-public (401 `unauthenticated`) shares show a corresponding hint.

## Usage

1. Log in to the admin panel → **Settings** → fill in the allowed-origin whitelist → **Media management** → paste a media direct link → choose a mode → add
2. **Add OneDrive links**: click the "OneDrive link" toggle at the top of the add card → paste an OneDrive link → click "Resolve" → confirm the file name/size and click "Add" (folder shares can be bulk-imported)
3. Click **Details** to copy links in various forms
4. Copy the generated short link `https://your-domain/i/<id>` (with `?e=expiry&s=signature` when signing is enabled)
5. Use it in `<img>` / `<video>` / `<audio>` or any download scenario

Every request passes a 4-layer validation in both modes: **rate limit → country/IP/ASN allow & block lists → Referer allow list → signature check**, and only then is it redirected or proxied.

## API

All endpoints return JSON; admin endpoints require `Authorization: Bearer <PASSWORD>`.

| Method     | Path                    | Description                                                                       |
| ---------- | ----------------------- | --------------------------------------------------------------------------------- |
| POST       | `/api/login`            | Validate login `{ token }`                                                        |
| POST       | `/api/convert`          | Add media `{ url, mode, name?, folder? }`, auto-detects type                      |
| POST       | `/api/onedrive/resolve` | Resolve an OneDrive share link `{ url }` → `{ isFolder, name, size, childCount }` |
| POST       | `/api/onedrive/import`  | Import an OneDrive file or bulk folder `{ url, mode, name?, folder? }`            |
| GET        | `/api/images`           | Media list + folder list                                                          |
| POST       | `/api/image/delete`     | Delete `{ id }`                                                                   |
| POST       | `/api/image/toggle`     | Enable / disable `{ id, enabled }`                                                |
| POST       | `/api/image/update`     | Rename / move `{ id, name?, folder? }`                                            |
| POST       | `/api/folder/create`    | Create folder `{ name }`                                                          |
| POST       | `/api/folder/rename`    | Rename folder `{ from, to }`                                                      |
| POST       | `/api/folder/delete`    | Delete folder `{ name }`                                                          |
| GET / PUT  | `/api/settings`         | Read / save settings                                                              |
| GET / HEAD | `/i/<id>`               | Media entry (302 or cached proxy)                                                 |

## How OneDrive direct links are resolved

OneDrive share links are not directly hotlinkable. **Embed-link resolution** (`/v/c/` single-file share, where the same file may take either of two redirect shapes) and **ordinary share links** (`u/s!`, `f/s!` etc., resolved via the `api.onedrive.com` shares API) are handled as follows:

```
【Shape A: embed direct】1drv.ms/v/c/{cid}/{token} → 301/302 → onedrive.live.com/embed?...
   └─> the embed page sets a full-privilege BadgerAuth cookie directly

【Shape B: photos mode】1drv.ms/v/c/{cid}/{token} → 301 → photos.onedrive.com/share/... (sets photosredir)
   └─> 302 → onedrive.live.com/?qt=allmyphotos&photosData=...&v=photos   (this page sets no BadgerAuth)
   └─> automatically extracts cid/id from the redirect URL and builds an equivalent /embed URL
        (forwarding redeem=base64url(original link))
   └─> the /embed page uses redeem to issue a full-privilege BadgerAuth bound to that share

【Common path】Authorization: badger <BadgerAuth>
   └─> my.microsoftpersonalcontent.com/_api/v2.0/shares/u!{encoded}/driveitem → metadata (name/size)
        └─> if the token still gets 403 on v2.0 shares, fall back to v2.1 drives/items (cid + {cid}!{shareToken})
   └─> media source: /_api/v2.0/drives/{driveId}/items/{itemId}/content
        → 302 → download.aspx?UniqueId=...&tempauth=...      (anonymous, valid ~1 hour)
```

> Only the `/embed` page sets a BadgerAuth cookie in its response (and it issues a full-privilege token only when the `redeem` parameter is present); the `?v=photos` page doesn't. Using a low-privilege fallback token against the data API returns 403 (mistaken for "password required"). This site therefore auto-converts the photos redirect to an equivalent `/embed` request to obtain the full-privilege credential.

**Key design decisions**:

- **Don't use `@content.downloadUrl` directly**: Microsoft's downloadUrl expires in about 1 hour and can't be stored long-term. This site stores a **stable addressing URL** (the content endpoint); every media request follows the 302 to the freshest direct link, avoiding expiry issues.
- **`tempauth` anonymous link**: the `download.aspx?tempauth=...` returned by the content endpoint needs no auth header and supports Range seeking. The Worker caches it as the media source and **automatically re-resolves when it expires (~1 hour)**, writing back the new link so media links keep working long-term.
- **Configurable-interval scheduled auto-refresh**: the Worker has a Cron Trigger (every 5 minutes, `scheduled` event) that only actually refreshes according to the "OneDrive auto-refresh interval" setting, re-fetching BadgerAuth and resolving the freshest `tempauth` link back into KV. Because the site caches resolve results, links keep working even after the resolve chain expires when you only use site links, so you can raise the interval to reduce OneDrive requests. The settings page shows the site's max cache time (derived from the "Cache TTL" you set) for reference: **minimum 1 hour** (keeps the resolve chain alive) and **maximum = the site's max cache time**. Auto-resolve triggers (and updates the timestamp) once the remaining time since the last refresh is ≤ 310s (5-minute check cycle + 10s buffer) to cover network latency.
- **On-demand fallback refresh**: even if a scheduled run is missed, a media request that hits 401 triggers an immediate re-resolve + single retry, keeping the link usable.
- **Type detection**: OneDrive direct links return `application/octet-stream`, so the type can't be read from the response header. The site trusts the **type inferred from the file-name extension at add time**.
- **Targeted SSRF bypass**: OneDrive domains (`my.microsoftpersonalcontent.com`, Microsoft CDN domains) are whitelisted internally; all other domains still obey the SSRF whitelist.

> Ordinary share links (`1drv.ms/u/s!`, `1drv.ms/f/s!` etc.) go through the `api.onedrive.com` shares API.

## Notes & Limits

- **512MB cache limit**: Cloudflare free plan caches objects up to 512MB; larger videos are not cached in cache proxy mode — use DNS-only mode for them
- **KV eventual consistency**: changes propagate globally within ~60s (the admin panel applies changes locally at once, so they take effect immediately)
- **Partial responses are not cached**: 206 responses pass through; once the full 200 object is cached, subsequent range requests are sliced by the edge from the cached object
- **HLS/DASH**: proxied as whole files only, no segment URL rewriting; most HLS origins reject non-standard requests — extend it yourself if you need full streaming support
- **Video thumbnails require CORS**: cache proxy mode works out of the box (the Worker returns `Access-Control-Allow-Origin: *`); DNS-only mode depends on the origin's CORS, falling back to an icon placeholder otherwise
- **OneDrive links need overseas network**: resolving OneDrive embed/share links needs `onedrive.live.com` (anonymous credential) and Microsoft data APIs. Cloudflare Workers on overseas edges can reach them; local `wrangler dev` may time out behind restrictive networks
- **Occasional upstream timeouts**: Microsoft occasionally returns `signal is aborted without reason` (dropped connection). The site then shows "Network error, please try again later" — just retry after a moment; already-added media is unaffected
- **OneDrive media sources are proxy-only**: the media source resolved from a OneDrive link relies on Worker proxying, so it is forced to "Cache proxy + DNS" and can't switch to "DNS-only"
- **AI-built**: this project is ~99% vibe coding, with lots of dead code, quirky logic, and a crude UI

## License

[MIT](LICENSE) © 2026 CelestialDomeStarPole
