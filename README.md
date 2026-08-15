<div align="center">

# MediaDNS-CDN

图片 / 音频 / 视频外链转接 · 缓存 · 防盗链 Cloudflare Worker

[English](README.en.md)

</div>

> 一个部署在 Cloudflare Workers 上的媒体外链转接 + 缓存 + 限流服务。给任意图片 / 音频 / 视频直链生成带防护的短链接：支持 302 直跳（仅 DNS）与缓存代理（Worker 缓存 + DNS）两种模式，内置地区 / IP / ASN / Referer 黑白名单、HMAC 签名链接、多级限流。

---

## 目录

- [功能特色](#功能特色)
- [截图](#截图)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [OneDrive 共享链接支持](#onedrive-共享链接支持)
- [使用方式](#使用方式)
- [API](#api)
- [OneDrive直链转化工作原理](#onedrive直链转化工作原理)
- [注意事项与限制](#注意事项与限制)
- [许可证](#许可证)

## 功能特色

- **两种链接模式**：
  - **仅DNS**：302 直跳原站，不占用 Worker 带宽，每次请求都过校验
  - **缓存代理+DNS**：Worker 拉取原站并写入 Cloudflare 边缘缓存，命中后由边缘直接返回
- **视频播放友好**：透传 `Range`/`If-Range`，支持拖动进度条；全量 200 响应入缓存后由边缘切片响应后续 Range 请求；206 分片透传不缓存
- **防盗链**：Referer 白名单；可选 HMAC 签名链接（带过期时间，不可伪造）
- **下载文件名可定制**：下载时文件名可取自上游文件名，或使用管理页设置的自定义名
- **访问控制**：国家（地区） / IP / ASN 黑白名单，四层校验全部在边缘生效
- **SSRF 防护**：代理目标必须位于允许域名白名单内
- **OneDrive 共享链接适配**：支持 OneDrive链接，能将OneDrive链接转换为本站直链

## 截图

<p align="center">
  <img src="https://media.starpole.cc.cd/i/be016a2756cd34b5" alt="MediaDNS-CDN 截图 1" width="49%" />
  <img src="https://media.starpole.cc.cd/i/a106c82feaf4caa1" alt="MediaDNS-CDN 截图 2" width="49%" />
</p>

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+ 与 npm
- 一个 [Cloudflare](https://dash.cloudflare.com) 账号
- 安装 wrangler（项目已将其列为开发依赖，二选一）：

  ```bash
  # 方式一：项目本地安装（推荐，版本随项目锁定）
  # 在项目根目录下
  npm install

  # 方式二：全局安装（任意目录可直接使用 wrangler 命令）
  npm install -g wrangler
  ```

### 登录 Cloudflare（二选一）

**方式一：OAuth 浏览器授权（推荐）**

```bash
npx wrangler login
# 浏览器中完成授权，凭据保存在本地
```

**方式二：API Token（适合 CI / 服务器 / 无法开浏览器等场景）**

1. 打开 Cloudflare 控制台 → 左下角管理账户 → **账户API令牌** → **创建令牌**
2. **权限策略** 选择模板 **Edit Cloudflare Workers**（或自定义，需包含以下权限）：

   | 权限                                            | 范围                           |
   | ----------------------------------------------- | ------------------------------ |
   | Account（整个账户） → Workers Scripts → Edit    | 必须                           |
   | Account（整个账户） → Workers KV Storage → Edit | 必须（创建/读写 KV 命名空间）  |
   | Account（整个账户）→ Account Settings → Read    | 建议                           |
   | Zone（指定域名） → Workers Routes → Edit        | 可选（如需绑定自定义域名路由） |

3. 创建后复制 Token，写入环境变量（wrangler 会自动读取，无需 `wrangler login`）：

   ```powershell
   # Windows PowerShell
   $env:CLOUDFLARE_API_TOKEN = "你的Token"
   ```

   ```bash
   # macOS / Linux
   export CLOUDFLARE_API_TOKEN="你的Token"
   ```

   如果已经全局安装wrangler，不想使用全局账号，在根目录下创建文件 **.env**在其中写入

   ```.env 文件内容
   CLOUDFLARE_API_TOKEN=粘贴你的Token
   CLOUDFLARE_ACCOUNT_ID=粘贴该账号对应的账户ID
   ```

   wrangler会优先读取.env文件中的变量，记得不要把.env文件提交到仓库中

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

# 3.（可选） 创建自定义域名路由，删除wrangler.jsonc中routes的注释，填入你的域名（需要Workers Routes 的Edit权限  ）

# 4. 创建 KV 命名空间（映射与设置存储）
npx wrangler kv namespace create MAPPINGS
# 如果提示 Would you like Wrangler to add it on your behalf? [Y/N]，推荐输入 Y
# 如果提示 What binding name would you like to use? 直接回车
# 如果提示 For local dev, do you want to connect to the remote resource instead of a local resource? [Y/N]，推荐输入 N 这个指令Yes会使你的本地 wrangler dev 直接通过网络操作你 Cloudflare 账号下真实的 KV / R2 / D1 数据，dev 环境的代码可能包含bug，一旦写错（如 delete 操作），真实数据会被删除。
# 系统会自动把id填入kv_namespaces[0].id ，如果没有，可以通过 npx wrangler kv namespace list 查看并手动填入

# 5. 配置机密（管理密码 / 签名密钥）
npx wrangler secret put PASSWORD        # 管理页登录密码
# 输入你的管理密码
# 之后会弹出提示There doesn't seem to be a Worker called "media-dns-cdn". Do you want to create a new Worker with that name and add secrets to it? [Y/N] 选择Y
npx wrangler secret put SIGNING_SECRET  # HMAC 链接签名密钥（启用签名链接时必填）
# 输入你的签名密钥

# 也可以先部署再运行上面两个指令，这样就没有提示，但要记得添加，否则无法正常使用
# PASSWORD和SIGNING_SECRET 也可以在部署后在网页控制台 Workers -> 设置 -> 变量和机密 中追加（建议类型选"加密"即 Secret；普通 Variable 也可读取）

# 6.（可选）确认限流 namespace_id 唯一
# wrangler.jsonc 中 ratelimits 的 namespace_id（1001/1002/1003）为自定义正整数，
# 只需保证账户内唯一，冲突时改成其他数字即可

# 7. 部署
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

## 配置说明

### 机密（secrets）

| 名称             | 说明                                              |
| ---------------- | ------------------------------------------------- |
| `PASSWORD`       | 管理页登录密码（Bearer Token 鉴权）               |
| `SIGNING_SECRET` | HMAC 链接签名密钥，启用 `requireSignature` 时必填 |

### 环境变量（vars，均为部署默认值，之后可在管理页运行时修改并即时生效）

| 名称                                      | 默认值      | 说明                                                                   |
| ----------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `ALLOWED_ORIGINS`                         | 空          | SSRF 白名单：允许代理的域名，逗号分隔，**必填**                        |
| `ALLOWED_COUNTRIES` / `BLOCKED_COUNTRIES` | 空          | 地区白/黑名单（ISO 国家代码）                                          |
| `ALLOWED_IPS` / `BLOCKED_IPS`             | 空          | IP 白/黑名单                                                           |
| `ALLOWED_ASN` / `BLOCKED_ASN`             | 空          | ASN 白/黑名单                                                          |
| `ALLOWED_REFERERS`                        | 空          | Referer 白名单（尽力而为，可伪造）                                     |
| `REQUIRE_SIGNATURE`                       | `false`     | 生成带过期 HMAC 签名的链接（最强防外链）                               |
| `SIGNATURE_TTL`                           | `3600`      | 签名有效期（秒）                                                       |
| `CACHE_TTL`                               | `2592000`   | 缓存 TTL（秒），仅缓存代理模式生效                                     |
| `MAX_IMAGE_SIZE`                          | `52428800`  | 单张图片大小上限（字节，50MB）                                         |
| `MAX_AUDIO_SIZE`                          | `104857600` | 单个音频大小上限（字节，100MB）                                        |
| `MAX_VIDEO_SIZE`                          | `524288000` | 单个视频大小上限（字节，500MB）                                        |
| `DEFAULT_MODE`                            | `redirect`  | 默认链接类型：`redirect` / `proxy`                                     |
| `DOWNLOAD_NAME_SOURCE`                    | `upstream`  | 下载文件名来源：`upstream`（上游文件名）/ `custom`（网站自定义名）     |
| `THUMB_SOURCE`                            | `upstream`  | 缩略图媒体源：`upstream`（上游）/ `site`（网站代理源，仅缓存代理模式） |
| `PREVIEW_SOURCE`                          | `upstream`  | 预览媒体源：`upstream`（上游）/ `site`（网站代理源，仅缓存代理模式）   |
| `ORIGIN_REFERER` / `ORIGIN_USER_AGENT`    | 空          | 转发给原站的上游请求头（应对原站防盗链）                               |

### 限流（Rate Limit Binding，需改 wrangler.jsonc 后重新部署）

| 绑定               | 默认值         | 说明                                   |
| ------------------ | -------------- | -------------------------------------- |
| `RATE_LIMITER_IP`  | 100 次 / 60 秒 | 每 IP 限流                             |
| `RATE_LIMITER_IMG` | 40 次 / 10 秒  | 每图片限流                             |
| `RATE_LIMITER_AV`  | 300 次 / 10 秒 | 每音视频限流（播放会产生较多分片请求） |

## OneDrive 共享链接支持

在「添加媒体」卡片中有一个模式切换按钮，可在 **普通链接** 与 **OneDrive 链接** 之间切换。OneDrive 模式下粘贴共享链接，解析成功后自动填入文件名，点击「添加」即可转为本站媒体外链。

### 如何使用 OneDrive 获取链接

#### 共享链接

打开 OneDrive 网页版，右键目标文件或者文件夹 → 「共享」（可以设置到期时间和是否可编辑，但必须是任何人都有访问权限，并且不能设置密码）→ 「复制链接」

#### 嵌入链接

打开 OneDrive 网页版，右键目标文件 → 「嵌入」 → 「生成」 → 复制`src="https://1drv.ms/"..."`引号中的链接

### 支持的链接格式

OneDrive **嵌入链接与普通共享链接**均可正常解析转换，例如：

| 类型         | 示例                                                 | 说明                               |
| ------------ | ---------------------------------------------------- | ---------------------------------- |
| 嵌入链接     | `https://1drv.ms/v/c/{cid}/{token}`                  | ✅ 实测生效（文件单文件共享）      |
| 普通共享链接 | `1drv.ms/u/s!`、`1drv.ms/f/s!`、`1drv.ms/f/c/...` 等 | ✅ 实测生效（单文件 / 文件夹共享） |

> 同一文件的两个 `/v/c/` 链接可能对应**不同的跳转形态**：一个直达 `/embed` 页，另一个经 `photos.onedrive.com` 转到 `onedrive.live.com/?qt=allmyphotos&v=photos`（photos 模式）。两者均已支持，photos 模式会自动转换为等价 `/embed` 地址解析，解析失败时再走 `v2.1 drives/items` 兜底，无需用户区分。

> 仅支持「任何人可访问」的无密码共享；需要密码（403 `password_required`）或非公开（401 `unauthenticated`）的共享会给出对应提示。

## 使用方式

1. 登录管理页 → 设置 → 填写允许代理的域名白名单 → 媒体管理 → 粘贴媒体直链 → 选择模式 → 添加
2. **添加 OneDrive 链接**：点击添加卡片顶部的「OneDrive 链接」切换按钮 → 粘贴 OneDrive 链接 → 点「解析」→ 显示文件名和大小后点「添加」（文件夹共享可批量导入）
3. 点击「详情」，可复制各形式的链接
4. 复制生成的短链接 `https://你的域名/i/<id>`（开启签名时带 `?e=过期时间&s=签名`）
5. 将该链接用于 `<img>` / `<video>` / `<audio>` / 任意下载场景

链接在两种模式下都经过四层校验：**限流 → 地区/IP/ASN 黑白名单 → Referer 白名单 → 签名校验**，校验通过后才直跳或代理。

## API

所有接口返回 JSON，管理接口需携带 `Authorization: Bearer <PASSWORD>`。

| 方法       | 路径                    | 说明                                                                      |
| ---------- | ----------------------- | ------------------------------------------------------------------------- |
| POST       | `/api/login`            | 登录校验 `{ token }`                                                      |
| POST       | `/api/convert`          | 添加媒体 `{ url, mode, name?, folder? }`，自动嗅探类型                    |
| POST       | `/api/onedrive/resolve` | 解析 OneDrive 共享链接 `{ url }` → `{ isFolder, name, size, childCount }` |
| POST       | `/api/onedrive/import`  | 导入 OneDrive 单文件或文件夹批量 `{ url, mode, name?, folder? }`          |
| GET        | `/api/images`           | 媒体列表 + 文件夹列表                                                     |
| POST       | `/api/image/delete`     | 删除 `{ id }`                                                             |
| POST       | `/api/image/toggle`     | 启用/停用 `{ id, enabled }`                                               |
| POST       | `/api/image/update`     | 重命名/移动 `{ id, name?, folder? }`                                      |
| POST       | `/api/folder/create`    | 创建文件夹 `{ name }`                                                     |
| POST       | `/api/folder/rename`    | 重命名文件夹 `{ from, to }`                                               |
| POST       | `/api/folder/delete`    | 删除文件夹 `{ name }`                                                     |
| GET / PUT  | `/api/settings`         | 读取 / 保存设置                                                           |
| GET / HEAD | `/i/<id>`               | 媒体访问入口（302 或缓存代理）                                            |

## OneDrive直链转化工作原理

OneDrive 共享链接并非可直接外链的直链。**嵌入链接解析链路**（`/v/c/` 单文件共享，同一文件可能落入两种跳转形态），**普通共享链接**（`u/s!`、`f/s!` 等）则经 `api.onedrive.com` shares API 解析，处理方式如下：

```
【形态 A：embed 直达】1drv.ms/v/c/{cid}/{token} → 301/302 → onedrive.live.com/embed?...
   └─> embed 页面 Set-Cookie 直接携带完整权限 BadgerAuth

【形态 B：photos 模式】1drv.ms/v/c/{cid}/{token} → 301 → photos.onedrive.com/share/...（种 photosredir）
   └─> 302 → onedrive.live.com/?qt=allmyphotos&photosData=...&v=photos   （此页不种 BadgerAuth）
   └─> 自动从跳转 URL 提取 cid/id，构造等价 /embed 地址（透传 redeem=base64url(原始链接)）
   └─> /embed 页面依赖 redeem 签发「绑定该共享」的完整权限 BadgerAuth

【统一后续】Authorization: badger <BadgerAuth>
   └─> my.microsoftpersonalcontent.com/_api/v2.0/shares/u!{编码}/driveitem → 元数据（文件名/大小）
        └─> 若该 token 形态对 v2.0 shares 仍返回 403，自动回退 v2.1 drives/items（cid + {cid}!{shareToken}）
   └─> 媒体源: /_api/v2.0/drives/{driveId}/items/{itemId}/content
        → 302 → download.aspx?UniqueId=...&tempauth=...      （匿名可访问，约 1 小时有效）
```

> 只有 `/embed` 页面会在响应中种下 BadgerAuth（且需带 `redeem` 参数才会签发绑定该共享的完整权限 token）；`?v=photos` 页面不种。若直接用低权限兜底 token 访问数据 API，会返回 403（表现为"需要密码"的误报）。因此本站会自动把 photos 跳转转换为等价 `/embed` 请求来换取完整权限凭证。

**关键设计**：

- **不直接用 `@content.downloadUrl`** 微软返回的 downloadUrl 约 1 小时过期，不可长期保存。本站存储的是**稳定寻址地址**（content 端点），每次媒体请求由 Worker **实时跟随 302 到最新直链**，天然规避时效问题。
- **`tempauth` 匿名直链**：content 端点返回的 `download.aspx?tempauth=...` 无需任何认证头即可访问（支持 Range 分片，音视频拖动正常）。Worker 把它作为媒体源缓存，**约 1 小时后过期时自动重新解析**并回写新直链，因此媒体链接长期有效。
- **可配置间隔定时自动刷新**：Worker 配置了 Cron Trigger（每 5 分钟触发 `scheduled` 事件），按设置中的「OneDrive 自动刷新间隔」决定实际刷新周期，重新获取 BadgerAuth 并解析最新 `tempauth` 直链回写 KV。由于网站缓存了解析结果，仅使用网站外链时即使解析链过期外链仍可用，可将间隔调大以减少 OneDrive 请求。设置页会结合你设置的「缓存 TTL」动态显示最长缓存时间，供参考时间：**最短 1 小时**（保持解析链不过期）、**最长为网站最长缓存时间**。距上次刷新剩余时间 ≤ 310 秒（5 分钟检查周期 + 10 秒缓冲）时触发自动解析并更新时间，规避网络延迟造成的空档。
- **访问时兜底刷新**：即使定时任务恰好错过（如 Worker 休眠），媒体请求遇到 401 时也会**立即重新解析并重试一次**，最大限度保证链接可用。
- **类型识别**：OneDrive 直链返回 `application/octet-stream`，无法从响应头识别媒体类型；本站以**文件名扩展名推断的类型**（添加时已确定）为准，因此直链也能正确显示图片/音频/视频。
- **SSRF 定向放行**：OneDrive 相关域名（`my.microsoftpersonalcontent.com`、微软 CDN 域）由内部白名单定向放行，无需加入全局 SSRF 白名单，其他域名仍受白名单约束。

> 普通共享链接（`1drv.ms/u/s!`、`1drv.ms/f/s!` 等）走 `api.onedrive.com` shares API 解析链路

## 注意事项与限制

- **512MB 缓存上限**：Cloudflare 免费版单缓存对象上限 512MB，超过此值的视频在缓存代理模式下不会被缓存，建议使用仅DNS模式
- **KV 最终一致性**：更改后最长约 60 秒全局生效（管理页已做本地乐观更改，更改即时变化）
- **Range 分片不缓存**：206 分片响应直接透传；全量 200 入缓存后，后续 Range 请求由边缘从缓存对象切片返回
- **HLS/DASH**：仅作为整体文件代理，不做分片 URL 重写；多数 HLS 源站会拒绝非标准请求，如需完整流媒体适配请自行扩展
- **视频缩略图依赖 CORS**：缓存代理模式自动支持（Worker 返回 `Access-Control-Allow-Origin: *`）；仅DNS模式依赖原站 CORS，不支持时自动回退为图标占位
- **OneDrive 链接需要海外网络**：解析 OneDrive 嵌入/共享链接需访问 `onedrive.live.com`（获取匿名凭证）与微软数据 API。Cloudflare Worker 海外节点默认可达；本地调试（`wrangler dev`）在国内网络下可能超时
- **微软接口偶发超时**：上游偶发返回 `signal is aborted without reason`（连接被中断）。此时网站会提示「网络异常，请过一会再试」，稍候重试即可，不影响已添加的媒体
- **OneDrive 媒体源强制缓存代理模式**：嵌入链接解析出的媒体源需依赖 Worker 代理跟随，强制走「缓存代理+DNS」，不可切换「仅DNS」（普通共享链接同理）

## 许可证

[MIT](LICENSE) © 2026 CelestialDomeStarPole
