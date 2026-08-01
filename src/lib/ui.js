export function renderUI() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MediaDNS · 图床管理</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f3f4f6;--card:#fff;--line:#e5e7eb;--text:#111827;--muted:#6b7280;--accent:#2563eb;--accent-dark:#1d4ed8;--green:#16a34a;--red:#dc2626;--radius:10px;--shadow:0 1px 2px rgba(0,0,0,.05),0 4px 16px rgba(0,0,0,.04)}
html,body{height:100%}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--text);font-size:14px;line-height:1.5}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input{font-family:inherit;font-size:14px}
.hidden{display:none!important}

/* 登录 */
.login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e3a8a,#0f172a);padding:16px}
.login-card{width:320px;background:#fff;border-radius:14px;padding:32px;box-shadow:0 20px 60px rgba(0,0,0,.25);text-align:center}
.login-card .logo{font-size:26px;font-weight:800;color:#111827;letter-spacing:.5px}
.login-card .sub{color:var(--muted);margin:6px 0 22px;font-size:13px}
.login-card input{width:100%;padding:11px 14px;border:1px solid var(--line);border-radius:8px;margin-bottom:14px;outline:none}
.login-card input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.12)}
.login-card .primary{width:100%}
.login-card .hint{margin-top:14px;font-size:12px;color:var(--muted)}

/* 布局 */
.app{display:flex;min-height:100vh}
.sidebar{width:210px;background:#0f172a;color:#cbd5e1;display:flex;flex-direction:column;padding:18px 12px;position:sticky;top:0;height:100vh}
.sidebar .brand{font-size:19px;font-weight:800;color:#fff;padding:4px 10px 18px}
.sidebar nav{display:flex;flex-direction:column;gap:4px;flex:1}
.nav-btn{text-align:left;padding:10px 12px;border-radius:8px;color:#cbd5e1;font-size:14px}
.nav-btn:hover{background:rgba(255,255,255,.06)}
.nav-btn.active{background:rgba(37,99,235,.28);color:#fff}
.logout{margin-top:8px;padding:9px 12px;border-radius:8px;color:#94a3b8;font-size:13px;text-align:left}
.logout:hover{background:rgba(255,255,255,.06);color:#fff}
.main{flex:1;padding:26px 30px;max-width:1280px}
.view{display:none}
.view.active{display:block}

/* 卡片 */
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
.add-card{padding:20px;margin-bottom:24px}
.add-card h2{font-size:16px;margin-bottom:14px}
.add-row{display:flex;gap:10px}
.add-row input{flex:1;padding:11px 14px;border:1px solid var(--line);border-radius:8px;outline:none}
.add-row input:focus{border-color:var(--accent)}
.mode-row{display:flex;gap:22px;margin-top:14px;flex-wrap:wrap}
.mode-option{display:flex;align-items:center;gap:7px;font-size:14px;cursor:pointer}
.mode-option em{font-style:normal;color:var(--muted);font-size:12px}
.preview{margin-top:16px;display:flex;gap:14px;align-items:center;border:1px dashed var(--line);border-radius:8px;padding:10px}
.preview img{max-width:120px;max-height:90px;border-radius:6px;object-fit:contain;background:#fafafa}
.preview .muted{font-size:12px;word-break:break-all}

.toolbar{display:flex;align-items:center;justify-content:space-between;margin:4px 0 14px}
.toolbar h2{font-size:16px}
.count{color:var(--muted);font-size:13px;font-weight:400;margin-left:6px}
.toolbar input{width:230px;padding:8px 12px;border:1px solid var(--line);border-radius:8px;outline:none;background:#fff}
.empty{color:var(--muted);text-align:center;padding:50px 0;font-size:14px}

/* 图片网格 */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.img-card{overflow:hidden;display:flex;flex-direction:column;transition:transform .12s ease,box-shadow .12s ease}
.img-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.08)}
.img-card.disabled{opacity:.55}
.thumb{position:relative;background:#f1f2f4;aspect-ratio:16/10}
.thumb img{width:100%;height:100%;object-fit:contain;display:block}
.thumb .zoom{position:absolute;right:8px;bottom:8px;background:rgba(15,23,42,.72);color:#fff;font-size:12px;padding:5px 10px;border-radius:6px}
.thumb .zoom:hover{background:rgba(15,23,42,.9)}
.card-body{padding:12px;display:flex;flex-direction:column;gap:7px}
.card-top{display:flex;align-items:center;justify-content:space-between}
.badge{font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600}
.badge-proxy{background:#e0edff;color:#1d4ed8}
.badge-dns{background:#eef0f3;color:#4b5563}
.img-id{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;font-weight:600}
.img-url{font-size:11px;color:var(--muted);word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.actions{display:flex;align-items:center;gap:8px;margin-top:2px}
.mini{font-size:12px;padding:5px 11px;border-radius:6px;border:1px solid var(--line);background:#fff}
.mini:hover{background:#f6f7f8}
.mini.danger{color:var(--red);border-color:#f3c1c1}
.mini.danger:hover{background:#fef2f2}
.switch{position:relative;display:inline-flex;width:34px;height:20px;margin-right:auto}
.switch input{opacity:0;width:0;height:0}
.switch span{position:absolute;inset:0;background:#d1d5db;border-radius:999px;transition:.2s}
.switch span:before{content:"";position:absolute;width:16px;height:16px;left:2px;top:2px;background:#fff;border-radius:50%;transition:.2s}
.switch input:checked + span{background:var(--green)}
.switch input:checked + span:before{transform:translateX(14px)}

/* 设置 */
.page-title{font-size:18px;margin-bottom:18px}
.settings-form{display:flex;flex-direction:column;gap:18px;max-width:720px}
.group{padding:20px 22px}
.group h3{font-size:15px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.group label{display:block;font-size:13px;color:#374151;margin-bottom:14px}
.group label small{color:var(--muted);display:block;margin-top:2px;font-size:12px}
.group input[type=text],.group input[type=number],.group input[type=url]{display:block;width:100%;margin-top:6px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;outline:none}
.group input:focus{border-color:var(--accent)}
.checkline{display:flex;align-items:center;gap:8px;margin-bottom:14px;font-size:14px;cursor:pointer}
.checkline input{width:16px;height:16px}
.readonly-box{background:#f6f7f8;border:1px solid var(--line);border-radius:8px;padding:10px 12px;font-size:13px;color:#374151;margin-top:6px}
.mode-radio-row{display:flex;gap:22px;margin-top:6px;flex-wrap:wrap}
.mode-radio-row label{display:flex;align-items:center;gap:7px;font-size:14px;cursor:pointer}
.save-row{margin-top:4px}

/* 按钮 */
.primary{background:var(--accent);color:#fff;border:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:600}
.primary:hover{background:var(--accent-dark)}
.primary:disabled{opacity:.55;cursor:default}

/* toast */
.toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(80px);background:#111827;color:#fff;padding:11px 20px;border-radius:9px;font-size:14px;opacity:0;transition:.25s;z-index:1000;box-shadow:0 8px 30px rgba(0,0,0,.25);pointer-events:none;max-width:80vw}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast.error{background:var(--red)}
.toast.success{background:var(--green)}

/* 灯箱预览 */
.lightbox{position:fixed;inset:0;background:rgba(9,12,18,.88);display:flex;align-items:center;justify-content:center;z-index:2000;padding:24px}
.lightbox img{max-width:94vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 60px rgba(0,0,0,.5)}
.lightbox .close{position:absolute;top:18px;right:26px;color:#fff;font-size:38px;line-height:1;cursor:pointer}

@media (max-width:720px){
  .sidebar{width:64px;padding:18px 8px}
  .sidebar .brand{font-size:0}
  .sidebar .brand:after{content:"MD";font-size:18px}
  .nav-btn{font-size:0;text-align:center;padding:10px}
  .nav-btn.active:after{content:"\\2022"}
  .main{padding:18px 14px}
  .toolbar input{width:150px}
  .add-row{flex-direction:column}
}
</style>
</head>
<body>

<div id="login" class="login-screen hidden">
  <form id="login-form" class="login-card">
    <div class="logo">MediaDNS</div>
    <p class="sub">图片外链转接 · 缓存 · 防盗链</p>
    <input id="login-token" type="password" placeholder="请输入管理密码（PASSWORD）" autocomplete="current-password" required />
    <button type="submit" class="primary">登录</button>
    <p class="hint">密码仅保存在当前浏览器</p>
  </form>
</div>

<div id="app" class="app hidden">
  <aside class="sidebar">
    <div class="brand">MediaDNS</div>
    <nav>
      <button class="nav-btn active" data-view="images">图片管理</button>
      <button class="nav-btn" data-view="settings">设置</button>
    </nav>
    <button id="logout" class="logout">退出登录</button>
  </aside>
  <main class="main">
    <section id="view-images" class="view active">
      <div class="card add-card">
        <h2>添加图片</h2>
        <div class="add-row">
          <input id="add-url" type="url" placeholder="粘贴图片直链地址，如 https://img.example.com/a/b.jpg" />
          <button id="add-btn" class="primary">添加</button>
        </div>
        <div class="mode-row">
          <label class="mode-option"><input type="radio" name="mode" value="redirect" checked /> 仅DNS <em>302直跳原图，不占用带宽</em></label>
          <label class="mode-option"><input type="radio" name="mode" value="proxy" /> 缓存代理+DNS <em>Worker 缓存转发</em></label>
        </div>
        <div id="add-preview" class="preview hidden">
          <img id="preview-img" alt="预览" />
          <div id="preview-info" class="muted"></div>
        </div>
      </div>

      <div class="toolbar">
        <h2>图片列表 <span id="img-count" class="count"></span></h2>
        <input id="search" type="search" placeholder="搜索 ID 或地址…" />
      </div>
      <div id="empty" class="empty hidden">还没有图片，粘贴一个链接开始吧。</div>
      <div id="grid" class="grid"></div>
    </section>

    <section id="view-settings" class="view">
      <h2 class="page-title">设置</h2>
      <div class="settings-form">
        <div class="card group">
          <h3>访问控制</h3>
          <label>允许的地区（国家代码，逗号分隔，留空 = 全部允许）<input id="allowedCountries" type="text" placeholder="如 CN, US, JP" /><small>例如 CN 表示仅中国大陆可访问；此限制同样作用于缓存命中。</small></label>
          <label>封禁的地区（国家代码，逗号分隔，留空 = 不封禁）<input id="blockedCountries" type="text" placeholder="如 XX" /></label>
          <label>允许的 IP（逗号分隔，留空 = 全部允许）<input id="allowedIps" type="text" placeholder="如 1.2.3.4, 203.0.113.0/24" /><small>IPv6 与 IPv4 均可。</small></label>
          <label>封禁的 IP（逗号分隔，留空 = 不封禁）<input id="blockedIps" type="text" placeholder="如 1.2.3.4" /></label>
          <label>允许的 ASN（逗号分隔，留空 = 全部允许）<input id="allowedAsn" type="text" placeholder="如 13335, 15169" /><small>13335 = Cloudflare，15169 = Google，可用来精确放行/拦截某个运营商。</small></label>
          <label>封禁的 ASN（逗号分隔，留空 = 不封禁）<input id="blockedAsn" type="text" placeholder="如 4134" /></label>
        </div>

        <div class="card group">
          <h3>防盗链</h3>
          <label>允许引用的域名（Referer 白名单，逗号分隔，留空 = 不限制）<input id="allowedReferers" type="text" placeholder="如 myblog.com, blog.com" /><small>仅当请求携带 Referer 时校验；浏览器不总是发送 Referer，此为尽力而为。</small></label>
          <label class="checkline"><input id="requireSignature" type="checkbox" /> 启用 HMAC 签名链接<small style="display:inline">（生成的链接带过期签名，不可伪造，最强防外链）</small></label>
          <label>签名有效期（秒）<input id="signatureTtl" type="number" min="60" max="31536000" /></label>
        </div>

        <div class="card group">
          <h3>缓存与限制</h3>
          <label>缓存 TTL（秒，0 = 不缓存）<input id="cacheTtl" type="number" min="0" max="31536000" /><small>仅"缓存代理+DNS"模式的图片走缓存；缓存命中时由边缘直接返回。</small></label>
          <label>单张图片大小上限（字节）<input id="maxImageSize" type="number" min="1024" /></label>
          <label>默认链接类型
            <span class="mode-radio-row">
              <label><input type="radio" name="defaultMode" id="defaultModeRedirect" value="redirect" /> 仅DNS（302直跳）</label>
              <label><input type="radio" name="defaultMode" id="defaultModeProxy" value="proxy" /> 缓存代理+DNS</label>
            </span>
          </label>
        </div>

        <div class="card group">
          <h3>上游（图床）</h3>
          <label>允许代理的域名（SSRF 白名单，逗号分隔）<input id="allowedOrigins" type="text" placeholder="如 img.example.com, img2.example.com" /><small>只允许 fetch 这些域名，防止把 Worker 当跳板访问任意地址。必须配置，否则无法添加链接。</small></label>
          <label>上游 Referer（转发给图床，应对图床防盗链）<input id="originReferer" type="url" placeholder="如 https://img.example.com/" /></label>
          <label>上游 User-Agent（转发给图床，留空用默认）<input id="originUserAgent" type="text" placeholder="留空即可" /></label>
        </div>

        <div class="card group">
          <h3>限流（只读）</h3>
          <label>每 IP 限流<div id="rateLimitIp" class="readonly-box">-</div></label>
          <label>每图限流<div id="rateLimitImg" class="readonly-box">-</div></label>
          <label>说明<div class="readonly-box">限流由 Cloudflare Rate Limit Binding 在边缘执行，数值需在 wrangler.jsonc 中修改后重新部署，此处仅展示当前配置。</div></label>
        </div>

        <div class="save-row">
          <button id="save-settings" class="primary">保存设置</button>
        </div>
      </div>
    </section>
  </main>
</div>

<div id="toast" class="toast"></div>
<div id="lightbox" class="lightbox hidden"><img id="lightbox-img" alt="" /><span class="close">&times;</span></div>

<script>
(function () {
  var TOKEN_KEY = "media_dns_password";
  var token = localStorage.getItem(TOKEN_KEY) || "";

  function $(id) { return document.getElementById(id); }

  function api(path, opts) {
    opts = opts || {};
    var headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    if (opts.headers) {
      for (var k in opts.headers) headers[k] = opts.headers[k];
    }
    return fetch(path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body
    }).then(function (res) {
      if (res.status === 401) { showLogin(); throw new Error("未登录或登录已失效"); }
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
        return data;
      });
    });
  }

  var toastTimer = null;
  function toast(msg, type) {
    var el = $("toast");
    el.textContent = msg;
    el.className = "toast show" + (type ? " " + type : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = "toast"; }, 2600);
  }

  function showLogin() {
    $("app").classList.add("hidden");
    $("login").classList.remove("hidden");
    $("login-token").focus();
  }
  function hideLogin() {
    $("login").classList.add("hidden");
    $("app").classList.remove("hidden");
  }
  function logout() {
    token = "";
    localStorage.removeItem(TOKEN_KEY);
    showLogin();
  }

  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = $("login-token").value.trim();
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: t })
    }).then(function (res) {
      if (res.ok) {
        token = t;
        localStorage.setItem(TOKEN_KEY, t);
        hideLogin();
        loadImages();
        loadSettings();
      } else {
        toast("登录失败：PASSWORD 错误", "error");
      }
    }).catch(function () { toast("网络错误", "error"); });
  });

  $("logout").addEventListener("click", logout);

  var navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      navBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
      $("view-" + btn.getAttribute("data-view")).classList.add("active");
    });
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function modeBadge(mode) {
    if (mode === "proxy") return '<span class="badge badge-proxy">缓存代理</span>';
    return '<span class="badge badge-dns">仅DNS</span>';
  }
  function fmtTime(ts) {
    if (!ts) return "-";
    var d = new Date(ts);
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function renderGrid(images) {
    var grid = $("grid");
    grid.innerHTML = "";
    $("img-count").textContent = images.length + " 张";
    if (!images.length) { $("empty").classList.remove("hidden"); return; }
    $("empty").classList.add("hidden");
    images.forEach(function (img) {
      var card = document.createElement("div");
      card.className = "card img-card" + (img.enabled ? "" : " disabled");
      card.innerHTML =
        '<div class="thumb"><img src="' + esc(img.url) + '" loading="lazy" alt="" />' +
        '<button class="zoom" data-url="' + esc(img.url) + '">预览</button></div>' +
        '<div class="card-body">' +
        '<div class="card-top">' + modeBadge(img.mode) + '<span class="muted">' + fmtTime(img.createdAt) + "</span></div>" +
        '<div class="img-id" title="' + esc(img.id) + '">' + esc(img.id) + "</div>" +
        '<div class="img-url" title="' + esc(img.url) + '">' + esc(img.url) + "</div>" +
        '<div class="actions">' +
        '<label class="switch" title="启用/停用"><input type="checkbox" class="tgl" data-id="' + esc(img.id) + '"' + (img.enabled ? " checked" : "") + ' /><span></span></label>' +
        '<button class="mini copy" data-url="' + esc(img.url) + '">复制</button>' +
        '<button class="mini danger del" data-id="' + esc(img.id) + '">删除</button>' +
        "</div></div>";
      grid.appendChild(card);
    });
  }

  function loadImages() {
    api("/api/images").then(function (data) {
      renderGrid(data.images || []);
    }).catch(function (err) {
      if (err.message && err.message.indexOf("未登录") === -1) toast(err.message, "error");
    });
  }

  var addPreviewTimer = null;
  $("add-url").addEventListener("input", function () {
    var v = this.value.trim();
    clearTimeout(addPreviewTimer);
    if (!v) { $("add-preview").classList.add("hidden"); return; }
    addPreviewTimer = setTimeout(function () {
      $("preview-img").src = v;
      var host = "";
      try { host = new URL(v).hostname; } catch (e) { host = "无效地址"; }
      $("preview-info").textContent = "来源: " + host;
      $("add-preview").classList.remove("hidden");
    }, 350);
  });

  $("add-btn").addEventListener("click", function () {
    var url = $("add-url").value.trim();
    var modeEl = document.querySelector('input[name="mode"]:checked');
    var mode = modeEl ? modeEl.value : "redirect";
    if (!url) { toast("请粘贴图片链接", "error"); return; }
    var btn = this;
    btn.disabled = true;
    api("/api/convert", { method: "POST", body: JSON.stringify({ url: url, mode: mode }) })
      .then(function (data) {
        toast("已添加，链接已复制到剪贴板", "success");
        $("add-url").value = "";
        $("add-preview").classList.add("hidden");
        try { navigator.clipboard.writeText(data.url); } catch (e) {}
        loadImages();
      })
      .catch(function (err) { toast(err.message || "添加失败", "error"); })
      .finally(function () { btn.disabled = false; });
  });

  $("grid").addEventListener("click", function (e) {
    var t = e.target;
    if (t.classList.contains("copy")) {
      var url = t.getAttribute("data-url");
      function done() { toast("链接已复制", "success"); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url); done(); });
      } else { fallbackCopy(url); done(); }
    } else if (t.classList.contains("del")) {
      var id = t.getAttribute("data-id");
      if (!window.confirm("确定删除该图片？删除后链接将立即失效。")) return;
      api("/api/image/delete", { method: "POST", body: JSON.stringify({ id: id }) })
        .then(function () { toast("已删除"); loadImages(); })
        .catch(function (err) { toast(err.message || "删除失败", "error"); });
    } else if (t.classList.contains("zoom")) {
      openLightbox(t.getAttribute("data-url"));
    }
  });

  $("grid").addEventListener("change", function (e) {
    if (e.target.classList.contains("tgl")) {
      var id = e.target.getAttribute("data-id");
      var enabled = e.target.checked;
      api("/api/image/toggle", { method: "POST", body: JSON.stringify({ id: id, enabled: enabled }) })
        .then(function () { toast(enabled ? "已启用" : "已停用"); })
        .catch(function (err) { toast(err.message || "操作失败", "error"); });
    }
  });

  $("search").addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    var cards = document.querySelectorAll("#grid .img-card");
    cards.forEach(function (c) {
      c.style.display = c.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function openLightbox(url) {
    $("lightbox-img").src = url;
    $("lightbox").classList.remove("hidden");
  }
  $("lightbox").addEventListener("click", function (e) {
    if (e.target === $("lightbox") || e.target.classList.contains("close")) {
      $("lightbox").classList.add("hidden");
      $("lightbox-img").src = "";
    }
  });

  var LIST_KEYS = ["allowedOrigins", "allowedCountries", "blockedCountries", "allowedIps", "blockedIps", "allowedAsn", "blockedAsn", "allowedReferers"];
  var NUM_KEYS = ["signatureTtl", "cacheTtl", "maxImageSize"];

  function loadSettings() {
    api("/api/settings").then(function (data) {
      var s = data.settings || {};
      LIST_KEYS.forEach(function (k) {
        var el = $(k);
        if (el) el.value = (s[k] || []).join(", ");
      });
      NUM_KEYS.forEach(function (k) {
        var el = $(k);
        if (el) el.value = s[k];
      });
      $("requireSignature").checked = !!s.requireSignature;
      if (s.defaultMode === "proxy") { $("defaultModeProxy").checked = true; }
      else { $("defaultModeRedirect").checked = true; }
      $("originReferer").value = s.originReferer || "";
      $("originUserAgent").value = s.originUserAgent || "";
      if (data.meta) {
        $("rateLimitIp").textContent = data.meta.rateLimitIp || "-";
        $("rateLimitImg").textContent = data.meta.rateLimitImg || "-";
      }
    }).catch(function (err) {
      if (err.message && err.message.indexOf("未登录") === -1) toast(err.message, "error");
    });
  }

  $("save-settings").addEventListener("click", function () {
    var body = {};
    LIST_KEYS.forEach(function (k) {
      var el = $(k);
      body[k] = el ? el.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [];
    });
    NUM_KEYS.forEach(function (k) {
      var el = $(k);
      body[k] = el ? Number(el.value) : 0;
    });
    body.requireSignature = $("requireSignature").checked;
    body.defaultMode = $("defaultModeProxy").checked ? "proxy" : "redirect";
    body.originReferer = $("originReferer").value.trim();
    body.originUserAgent = $("originUserAgent").value.trim();
    var btn = this;
    btn.disabled = true;
    api("/api/settings", { method: "PUT", body: JSON.stringify(body) })
      .then(function () { toast("设置已保存，缓存已刷新", "success"); })
      .catch(function (err) { toast(err.message || "保存失败", "error"); })
      .finally(function () { btn.disabled = false; });
  });

  if (token) {
    api("/api/images").then(function () {
      hideLogin();
      loadImages();
      loadSettings();
    }).catch(function () { showLogin(); });
  } else {
    showLogin();
  }
})();
</script>
</body>
</html>`;
}
