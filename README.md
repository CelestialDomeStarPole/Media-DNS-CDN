<div align="center">

# MediaDNS-CDN

图片 / 音频 / 视频外链转接 · 缓存 · 防盗链 Cloudflare Worker

[English](README.en.md)

</div>

> 一个部署在 Cloudflare Workers 上的媒体外链转接 + 缓存 + 防盗链服务。给任意图片 / 音频 / 视频直链生成带防护的短链接：支持 302 直跳（仅 DNS）与缓存代理（Worker 缓存 + DNS）两种模式，内置地区 / IP / ASN / Referer 黑白名单、HMAC 签名链接、多级限流与视频缩略图自动截帧。

---

## 目录

- [功能特色](#功能特色)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [使用方式](#使用方式)
- [API](#api)
- [项目结构](#项目结构)
- [注意事项与限制](#注意事项与限制)
- [许可证](#许可证)

## 功能特色

- **多媒体支持**：图片（jpg/png/webp/gif 等）、音频（mp3/m4a/flac 等）、视频（mp4/webm/mov 等）均可转接
- **两种链接模式**：
  - **仅DNS**：302 直跳原站，不占用 Worker 带宽，每次请求都过校验
  - **缓存代理+DNS**：Worker 拉取原站并写入 Cloudflare 边缘缓存，命中后由边缘直接返回
- **视频播放友好**：透传 `Range`/`If-Range`，支持拖动进度条；全量 200 响应入缓存后由边缘切片响应后续 Range 请求；206 分片透传不缓存
- **视频缩略图**：管理页自动截取视频帧作为封面预览（无需后端处理，浏览器 canvas 截帧）
- **按类型大小限制**：图片 50MB / 音频 100MB / 视频 500MB（可后台调整）
- **防盗链**：Referer 白名单；可选 HMAC 签名链接（带过期时间，不可伪造）
- **访问控制**：国家（地区） / IP / ASN 黑白名单，四层校验全部在边缘生效
- **多级限流**：每 IP、每图片、每音视频独立限流（Rate Limit Binding，边缘执行）
- **SSRF 防护**：代理目标必须位于允许域名白名单内
- **中英双语管理页**：媒体增删改、文件夹分组、搜索、链接一键复制、灯箱预览，内置中 / EN 切换与动态主题

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+ 与 npm
- 一个 [Cloudflare](https://dash.cloudflare.com) 账号
- 已安装 wrangler：`npm install`

### 登录 Cloudflare（二选一）

**方式一：OAuth 浏览器授权（推荐）**

```bash
npx wrangler login
# 浏览器中完成授权，凭据保存在本地
```

**方式二：API Token（适合 CI / 服务器 / 无法开浏览器等场景）**

1. 打开 Cloudflare 控制台 → 右上角头像 → **My Profile** → **API Tokens** → **Create Token**
2. 选择模板 **Edit Cloudflare Workers**（或自定义，需包含以下权限）：

   | 权限 | 范围 |
   | --- | --- |
   | Account → Workers Scripts → Edit | 必须 |
   | Account → Workers KV Storage → Edit | 必须（创建/读写 KV 命名空间） |
   | Account → Account Settings → Read | 建议 |
   | Account → Workers Routes → Edit | 可选（如需绑定自定义域名路由） |

3. 创建后复制 Token，写入环境变量（wrangler 会自动读取，无需 `wrangler login`）：

   ```powershell
   # Windows PowerShell
   $env:CLOUDFLARE_API_TOKEN = "你的Token"
   ```
   ```bash
   # macOS / Linux
   export CLOUDFLARE_API_TOKEN="你的Token"
   ```

4. 验证登录：

   ```bash
   npx wrangler whoami
   # 应显示你的账号信息（Account ID 等）
   ```

> Token 请妥善保管（有权限时等同账户凭证），建议限定账户/权限范围、设置过期时间，并避免提交到仓库。

### 部署步骤

```bash
# 1. 安装依赖
npm install

# 2. 登录 Cloudflare（见上方"登录 Cloudflare"：OAuth 或 API Token 二选一）

# 3. 创建 KV 命名空间（映射与设置存储）
npx wrangler kv namespace create MAPPINGS
# 把返回的 id 填入 wrangler.jsonc 的 kv_namespaces[0].id

# 4. 配置机密（管理密码 / 签名密钥）
npx wrangler secret put PASSWORD        # 管理页登录密码
npx wrangler secret put SIGNING_SECRET  # HMAC 链接签名密钥（启用签名链接时必填）
# PASSWORD 也可以在控制台 Workers -> 设置 -> 变量和机密 中追加

# 5.（可选）确认限流 namespace_id 唯一
# wrangler.jsonc 中 ratelimits 的 namespace_id（1001/1002/1003）为自定义正整数，
# 只需保证账户内唯一，冲突时改成其他数字即可

# 6. 部署
npm run deploy
```
部署完成后访问 `https://<worker名>.<子域>.workers.dev`，用 PASSWORD 登录管理页，在「设置」中填写允许代理的域名白名单（SSRF 白名单，必须配置，否则无法添加链接）。

### 本地调试

```bash
# 复制示例并填写与线上一致的密钥
Copy-Item .dev.vars.example .dev.vars   # Windows
cp .dev.vars.example .dev.vars          # macOS / Linux

npm run dev
# 访问 http://127.0.0.1:8787
```

> `.dev.vars` 已被 git 忽略，不会提交。

## 配置说明

### 机密（secrets）

| 名称 | 说明 |
| --- | --- |
| `PASSWORD` | 管理页登录密码（Bearer Token 鉴权） |
| `SIGNING_SECRET` | HMAC 链接签名密钥，启用 `requireSignature` 时必填 |

### 环境变量（vars，均为部署默认值，之后可在管理页运行时修改并即时生效）

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `ALLOWED_ORIGINS` | 空 | SSRF 白名单：允许代理的域名，逗号分隔，**必填** |
| `ALLOWED_COUNTRIES` / `BLOCKED_COUNTRIES` | 空 | 地区白/黑名单（ISO 国家代码） |
| `ALLOWED_IPS` / `BLOCKED_IPS` | 空 | IP 白/黑名单 |
| `ALLOWED_ASN` / `BLOCKED_ASN` | 空 | ASN 白/黑名单 |
| `ALLOWED_REFERERS` | 空 | Referer 白名单（尽力而为，可伪造） |
| `REQUIRE_SIGNATURE` | `false` | 生成带过期 HMAC 签名的链接（最强防外链） |
| `SIGNATURE_TTL` | `3600` | 签名有效期（秒） |
| `CACHE_TTL` | `2592000` | 缓存 TTL（秒），仅缓存代理模式生效 |
| `MAX_IMAGE_SIZE` | `52428800` | 单张图片大小上限（字节，50MB） |
| `MAX_AUDIO_SIZE` | `104857600` | 单个音频大小上限（字节，100MB） |
| `MAX_VIDEO_SIZE` | `524288000` | 单个视频大小上限（字节，500MB） |
| `DEFAULT_MODE` | `redirect` | 默认链接类型：`redirect` / `proxy` |
| `ORIGIN_REFERER` / `ORIGIN_USER_AGENT` | 空 | 转发给原站的上游请求头（应对原站防盗链） |

### 限流（Rate Limit Binding，需改 wrangler.jsonc 后重新部署）

| 绑定 | 默认值 | 说明 |
| --- | --- | --- |
| `RATE_LIMITER_IP` | 100 次 / 60 秒 | 每 IP 限流 |
| `RATE_LIMITER_IMG` | 40 次 / 10 秒 | 每图片限流 |
| `RATE_LIMITER_AV` | 300 次 / 10 秒 | 每音视频限流（播放会产生大量分片请求） |

## 使用方式

1. 登录管理页 → 粘贴媒体直链 → 选择模式 → 添加
2. 复制生成的短链接 `https://你的域名/i/<id>`（开启签名时带 `?e=过期时间&s=签名`）
3. 将该链接用于 `<img>` / `<video>` / `<audio>` / 任意下载场景

链接在两种模式下都经过四层校验：**限流 → 地区/IP/ASN 黑白名单 → Referer 白名单 → 签名校验**，校验通过后才直跳或代理。

## API

所有接口返回 JSON，管理接口需携带 `Authorization: Bearer <PASSWORD>`。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/login` | 登录校验 `{ token }` |
| POST | `/api/convert` | 添加媒体 `{ url, mode, name?, folder? }`，自动嗅探类型 |
| GET | `/api/images` | 媒体列表 + 文件夹列表 |
| POST | `/api/image/delete` | 删除 `{ id }` |
| POST | `/api/image/toggle` | 启用/停用 `{ id, enabled }` |
| POST | `/api/image/update` | 重命名/移动 `{ id, name?, folder? }` |
| POST | `/api/folder/create` | 创建文件夹 `{ name }` |
| POST | `/api/folder/rename` | 重命名文件夹 `{ from, to }` |
| POST | `/api/folder/delete` | 删除文件夹 `{ name }` |
| GET / PUT | `/api/settings` | 读取 / 保存设置 |
| GET / HEAD | `/i/<id>` | 媒体访问入口（302 或缓存代理） |

## 项目结构

```
├── src/
│   ├── index.js          # Worker 入口：路由 / 校验流程 / 类型嗅探
│   └── lib/
│       ├── proxy.js      # 代理转发 / Range 透传 / 按类型校验 / 缓存响应
│       ├── store.js      # KV 存储 / 设置读写（含 15s 内存微缓存）
│       ├── security.js   # 鉴权 / 签名 / 限流 / 黑白名单
│       └── ui.js         # 中英双语管理页（模板字符串）
├── wrangler.jsonc        # Worker 配置：KV / 限流 / 环境变量
├── .dev.vars.example     # 本地调试密钥示例
└── package.json          # npm 脚本：dev / deploy / check
```

## 注意事项与限制

- **512MB 缓存上限**：Cloudflare 免费版单缓存对象上限 512MB，超过此值的视频在缓存代理模式下不会被缓存，建议使用仅DNS模式
- **KV 最终一致性**：删除后最长约 60 秒全局生效（管理页已做本地乐观移除，删除即时消失）
- **Range 分片不缓存**：206 分片响应直接透传；全量 200 入缓存后，后续 Range 请求由边缘从缓存对象切片返回
- **HLS/DASH**：仅作为整体文件代理，不做分片 URL 重写；多数 HLS 源站会拒绝非标准请求，如需完整流媒体适配请自行扩展
- **视频缩略图依赖 CORS**：缓存代理模式自动支持（Worker 返回 `Access-Control-Allow-Origin: *`）；仅DNS模式依赖原站 CORS，不支持时自动回退为图标占位
- **Referer 校验为尽力而为**：浏览器并不总是发送 Referer

## 许可证

[MIT](LICENSE) © 2026 CelestialDomeStarPole
