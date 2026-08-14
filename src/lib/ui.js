export function renderUI() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MediaDNS-CDN · 图床管理</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236366f1'/%3E%3Cstop offset='.5' stop-color='%23a855f7'/%3E%3Cstop offset='1' stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Cg fill='none' stroke='%23fff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='7' y='8' width='18' height='16' rx='2.5'/%3E%3Cpath d='M9.5 20.5l4.2-5 3.3 3.8 2.7-3 2.8 4.2'/%3E%3C/g%3E%3Ccircle cx='20.5' cy='12' r='1.6' fill='%23fff'/%3E%3C/svg%3E" />
<script>
(function () {
  var P = [
    ["#6366f1", "#a855f7", "#ec4899"],
    ["#4f46e5", "#8b5cf6", "#d946ef"],
    ["#0ea5e9", "#6366f1", "#a855f7"],
    ["#06b6d4", "#3b82f6", "#8b5cf6"],
    ["#f59e0b", "#f97316", "#ec4899"],
    ["#10b981", "#0ea5e9", "#6366f1"],
    ["#f43f5e", "#f97316", "#f59e0b"],
    ["#14b8a6", "#22d3ee", "#818cf8"],
    ["#a855f7", "#ec4899", "#fb7185"],
    ["#3b82f6", "#06b6d4", "#22d3ee"]
  ];
  var p = P[Math.floor(Math.random() * P.length)];
  (function () {
    var KEY = "mdn_theme";
    var idx = Array.apply(null, new Array(P.length)).map(function (_, i) { return i; });
    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    try {
      var st = JSON.parse(localStorage.getItem(KEY) || "null");
      var deck = st && Array.isArray(st.deck) && st.deck.length === P.length ? st.deck : shuffle(idx.slice());
      var pos = (st && typeof st.i === "number") ? st.i : 0;
      if (pos >= deck.length) { deck = shuffle(idx.slice()); pos = 0; }
      p = P[deck[pos]];
      pos++;
      if (pos >= deck.length) { deck = shuffle(idx.slice()); pos = 0; }
      localStorage.setItem(KEY, JSON.stringify({ deck: deck, i: pos }));
    } catch (e) { /* 隐私模式等：保持初始真随机 */ }
  })();
  var s = document.documentElement.style;
  s.setProperty("--c1", p[0]);
  s.setProperty("--c2", p[1]);
  s.setProperty("--c3", p[2]);
  s.setProperty("--accent", p[1]);
  s.setProperty("--accent2", p[2]);
  var icon = document.querySelector("link[rel='icon']");
  if (icon) {
    var enc = function (c) { return "%23" + c.slice(1); };
    icon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='" + enc(p[0]) + "'/%3E%3Cstop offset='.5' stop-color='" + enc(p[1]) + "'/%3E%3Cstop offset='1' stop-color='" + enc(p[2]) + "'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Cg fill='none' stroke='%23fff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='7' y='8' width='18' height='16' rx='2.5'/%3E%3Cpath d='M9.5 20.5l4.2-5 3.3 3.8 2.7-3 2.8 4.2'/%3E%3C/g%3E%3Ccircle cx='20.5' cy='12' r='1.6' fill='%23fff'/%3E%3C/svg%3E";
  }
})();
</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --c1:#6366f1;--c2:#a855f7;--c3:#ec4899;
  --accent:#8b5cf6;--accent2:#ec4899;
  --text:#1f2937;--muted:#6b7280;
  --glass:rgba(255,255,255,.68);
  --glass-line:rgba(255,255,255,.65);
  --radius:12px;
  --shadow:0 1px 2px rgba(31,41,55,.05),0 10px 30px rgba(31,41,55,.10);
  --grad:linear-gradient(135deg,var(--c1),var(--c2),var(--c3));
}
html,body{height:100%}
html{background-color:#f4f2fb}
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;
  color:var(--text);font-size:14px;line-height:1.5;overflow-x:hidden;
  background:transparent
}
/* 页面渐变背景改为固定层：位置:fixed 且尺寸恰好等于视口，
   260% 的渐变图在任何滚动位置、任何浏览器（含 Safari 等按视口
   解析 canvas 背景尺寸的实现）下都必然完整盖住视口，
   从根上消除"渐变带边缘 + 底色交界"的移动分割线 */
body::before{
  content:"";position:fixed;top:0;left:0;width:100%;height:100%;
  z-index:-3;pointer-events:none;
  background-image:linear-gradient(160deg,color-mix(in srgb,var(--c1) 20%,#fff),color-mix(in srgb,var(--c2) 20%,#fff),color-mix(in srgb,var(--c3) 20%,#fff));
  background-size:260% 260%;animation:bgFlow 40s ease-in-out infinite
}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input,select{font-family:inherit;font-size:14px}
a{color:var(--accent)}
.hidden{display:none!important}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* 动态背景光斑 */
.bg-blob{position:fixed;border-radius:50%;filter:blur(80px);opacity:.55;z-index:-2;pointer-events:none}
.b1{width:44vmax;height:44vmax;top:-14vmax;left:-10vmax;background:radial-gradient(circle,var(--c1),transparent 66%);animation:float1 22s ease-in-out infinite}
.b2{width:40vmax;height:40vmax;top:16%;right:-12vmax;background:radial-gradient(circle,var(--c2),transparent 66%);animation:float2 28s ease-in-out infinite}
.b3{width:46vmax;height:46vmax;bottom:-16vmax;left:28%;background:radial-gradient(circle,var(--c3),transparent 66%);animation:float3 24s ease-in-out infinite}
@keyframes float1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(9vmax,6vmax) scale(1.18)}}
@keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-8vmax,5vmax) scale(1.12)}}
@keyframes float3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6vmax,-7vmax) scale(1.15)}}
@keyframes shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes bgFlow{0%,100%{background-position:0% 50%}25%{background-position:100% 50%}50%{background-position:100% 100%}75%{background-position:0% 100%}}
#particles{position:fixed;inset:0;z-index:-1;pointer-events:none}

/* 点击星火 */
#clickfx{position:fixed;inset:0;z-index:2300;pointer-events:none}
.cfx-spark{position:absolute;width:var(--size);height:var(--size);opacity:0;transform:translate(0,0) scale(.35);filter:drop-shadow(0 0 6px var(--color));animation:cfxFly .7s cubic-bezier(.2,0,1,1) forwards,cfxFade .7s ease-out forwards}
.cfx-spark::before{content:"";position:absolute;inset:0;background:var(--color);transform:rotate(var(--rot,0deg))}
.cfx-star::before{border-radius:50%;background:conic-gradient(var(--color) 0 13deg,transparent 13deg 77deg,var(--color) 77deg 103deg,transparent 103deg 167deg,var(--color) 167deg 193deg,transparent 193deg 257deg,var(--color) 257deg 283deg,transparent 283deg 347deg,var(--color) 347deg 360deg)}
.cfx-diamond::before{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.cfx-cross::before{clip-path:polygon(35% 0,65% 0,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0 65%,0 35%,35% 35%)}
@keyframes cfxFly{0%{transform:translate(0,0) scale(.35)}40%{transform:translate(calc(var(--dx)*.22),calc(var(--dy)*.22)) scale(.7)}100%{transform:translate(var(--dx),var(--dy)) scale(.12)}}
@keyframes cfxFade{0%{opacity:1}55%{opacity:.95}100%{opacity:0}}

/* 语言切换按钮：中 / EN 双显胶囊 */
.lang-toggle{
  position:fixed;top:16px;right:16px;z-index:1500;display:flex;align-items:center;gap:8px;
  padding:5px 8px 5px 7px;border-radius:999px;
  background:var(--grad);background-size:200% 200%;
  box-shadow:0 6px 18px rgba(0,0,0,.2);transition:transform .15s ease,box-shadow .15s ease;
  animation:gradShift 8s ease-in-out infinite
}
.lang-toggle:hover{transform:translateY(-1px) scale(1.05);box-shadow:0 10px 26px rgba(0,0,0,.3)}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.lang-toggle .lt-globe{width:22px;height:22px;perspective:120px;color:#fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,.25))}
.lang-toggle svg{display:block;width:22px;height:22px;animation:globeSpin 7s linear infinite}
.lang-toggle:hover svg{animation-duration:2s}
.lang-toggle .sparkle{animation:twinkle 1.5s ease-in-out infinite;transform-origin:center}
@keyframes globeSpin{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
@keyframes twinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.25)}}
/* 中/EN 双段 */
.lt-seg{display:flex;align-items:center;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:2px;gap:2px}
.lt-seg-opt{position:relative;display:flex;align-items:center;justify-content:center;min-width:34px;height:22px;padding:0 9px;border-radius:999px;color:rgba(255,255,255,.55);transition:color .2s ease,background .25s ease}
.lt-seg-opt b{font-size:12px;font-weight:800;letter-spacing:.5px;line-height:1}
.lt-seg-opt.is-zh b{font-size:13px}
.lt-seg-opt.is-en b{font-size:10.5px;font-weight:800}
.lt-seg-opt.active{background:#fff;color:var(--accent);box-shadow:0 2px 8px rgba(0,0,0,.18);animation:segPop .4s cubic-bezier(.34,1.56,.64,1)}
.lt-seg-opt.active::after{content:"✦";position:absolute;top:-9px;right:-4px;font-size:10px;color:#fff;animation:twinkle 1.2s ease-in-out infinite;text-shadow:0 1px 3px rgba(0,0,0,.35)}
.lt-seg-opt.inactive{color:rgba(255,255,255,.55);cursor:pointer}
.lt-seg-opt.inactive:hover{color:#fff}
@keyframes segPop{0%{transform:scale(.8)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
.lang-toggle.flip{animation:langFlip .5s ease}
@keyframes langFlip{0%{transform:rotateY(0) scale(1)}50%{transform:rotateY(180deg) scale(1.14)}100%{transform:rotateY(360deg) scale(1)}}
@keyframes langPop{from{opacity:.3;transform:translateY(8px)}to{opacity:1;transform:none}}
.langPop{animation:langPop .35s ease}

/* 登录 */
.login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px}
.login-card{
  width:340px;max-width:100%;background:rgba(255,255,255,.75);
  -webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);
  border:1px solid var(--glass-line);border-radius:18px;padding:36px 32px;text-align:center;
  box-shadow:0 24px 70px rgba(31,41,55,.18);animation:cardIn .5s cubic-bezier(.2,.9,.3,1.15) both
}
.logo{
  font-size:28px;font-weight:800;letter-spacing:.5px;
  background:var(--grad);background-size:220% 220%;
  -webkit-background-clip:text;background-clip:text;color:transparent;
  animation:shift 9s ease-in-out infinite
}
.login-card .sub{color:var(--muted);margin:6px 0 22px;font-size:13px}
.login-card input{width:100%;padding:11px 14px;border:1px solid rgba(0,0,0,.12);border-radius:9px;margin-bottom:14px;outline:none;background:rgba(255,255,255,.8)}
.login-card input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 16%,transparent)}
.login-card .primary{width:100%;display:flex;align-items:center;justify-content:center;gap:8px}
.login-card .hint{margin-top:14px;font-size:12px;color:var(--muted)}

/* 布局 */
.app{display:flex;min-height:100vh}
.sidebar{
  width:220px;padding:18px 12px;display:flex;flex-direction:column;
  background:linear-gradient(165deg,var(--c1),var(--c2),var(--c3));
  background-size:300% 300%;animation:shift 20s ease-in-out infinite;
  color:rgba(255,255,255,.9);position:sticky;top:0;height:100vh;
  box-shadow:4px 0 30px color-mix(in srgb,var(--c2) 35%,transparent)
}
.sidebar .brand{font-size:19px;font-weight:800;color:#fff;padding:4px 10px 18px;text-shadow:0 1px 8px rgba(0,0,0,.2)}
.sidebar nav{display:flex;flex-direction:column;gap:4px;flex:1}
.nav-btn{text-align:left;padding:10px 12px;border-radius:9px;color:rgba(255,255,255,.88);font-size:14px;transition:background .15s}
.nav-btn:hover{background:rgba(255,255,255,.14)}
.nav-btn.active{background:rgba(255,255,255,.24);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
.logout{margin-top:8px;padding:9px 12px;border-radius:9px;color:rgba(255,255,255,.78);font-size:13px;text-align:left;transition:background .15s}
.logout:hover{background:rgba(255,255,255,.16);color:#fff}
.group-nav{display:flex;flex-direction:column;gap:3px;margin-top:14px;max-height:34vh;overflow-y:auto;padding:2px}
.group-nav .g-title{font-size:11px;color:rgba(255,255,255,.6);padding:2px 8px 4px;text-transform:uppercase;letter-spacing:.4px}
.group-nav .g-btn{padding:5px 12px;border-radius:8px;color:rgba(255,255,255,.75);font-size:12px;text-align:left;transition:background .15s,color .15s}
.group-nav .g-btn:hover{background:rgba(255,255,255,.14);color:#fff}
.group-nav .g-btn.active{background:rgba(255,255,255,.26);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}
.group-nav:empty{display:none}
.logout-in-settings{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 22px;border-radius:10px;font-size:14px;color:#fff;background:linear-gradient(160deg,#f43f5e,#ef4444);box-shadow:0 6px 18px rgba(239,68,68,.3);transition:transform .1s,box-shadow .15s,opacity .15s}
.logout-in-settings:hover{box-shadow:0 8px 24px rgba(239,68,68,.4)}
.logout-in-settings:active{transform:scale(.97)}
.main{flex:1;padding:28px 34px;width:100%;min-width:0}
.view{display:none}
.view.active{display:block;animation:viewFadeIn .28s ease both}
@keyframes viewFadeIn{from{opacity:0}to{opacity:1}}
/* viewIn 带 transform，仅用于自身为 fixed 的灯箱/弹层；视图切换用纯淡入，避免 transform 包含块破坏内部 fixed 子元素 */
@keyframes viewIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* 卡片 */
.card{
  background:var(--glass);
  -webkit-backdrop-filter:blur(16px) saturate(1.35);backdrop-filter:blur(16px) saturate(1.35);
  border:1px solid var(--glass-line);border-radius:var(--radius);box-shadow:var(--shadow)
}
.add-card{padding:20px;margin-bottom:20px}
.add-card h2{font-size:16px;margin-bottom:14px}
.add-row{display:flex;gap:10px}
.add-row2{display:flex;gap:10px;margin-top:10px}
.add-row input,.add-row2 input,.add-row2 select{
  padding:11px 14px;border:1px solid rgba(0,0,0,.12);border-radius:9px;outline:none;background:rgba(255,255,255,.85)
}
.add-row input{flex:1}
.add-row2 input{flex:1;min-width:0}
.add-row2 select{max-width:46%;cursor:pointer}
.add-row input:focus,.add-row2 input:focus,.add-row2 select:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.mode-row{display:flex;gap:22px;margin-top:14px;flex-wrap:wrap}
.mode-option{display:flex;align-items:center;gap:7px;font-size:14px;cursor:pointer}
.mode-option em{font-style:normal;color:var(--muted);font-size:12px}
/* 添加栏模式切换（普通链接 / OneDrive 链接） */
.add-mode-toggle{display:flex;gap:8px;margin-bottom:16px}
.at-seg{flex:1;padding:10px 14px;border-radius:10px;font-size:14px;font-weight:600;color:var(--muted);background:rgba(255,255,255,.55);border:1px solid rgba(0,0,0,.1);cursor:pointer;transition:all .18s ease}
.at-seg:hover{border-color:var(--accent);color:var(--text)}
.at-seg.active{background:var(--grad);background-size:220% 220%;color:#fff;border-color:transparent;box-shadow:0 6px 16px color-mix(in srgb,var(--accent) 38%,transparent)}
/* OneDrive 解析结果信息条 */
.od-info{display:flex;align-items:center;gap:10px;margin-top:12px;padding:10px 14px;border:1px dashed rgba(0,0,0,.16);border-radius:9px;background:rgba(255,255,255,.5)}
.od-icon{width:10px;height:10px;border-radius:3px;background:var(--grad);flex-shrink:0}
.od-name{font-weight:600;color:var(--text);word-break:break-all;min-width:0;flex:1}
.od-badge{flex-shrink:0;font-size:12px;padding:3px 10px;border-radius:999px;background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);white-space:nowrap}
.od-actions{display:flex;gap:10px;margin-top:14px}
.od-hint{color:var(--muted);font-size:12px;margin-top:10px;line-height:1.5}
/* 文件夹第一层子项选择列表 */
.od-items{margin-top:12px;border:1px dashed rgba(0,0,0,.16);border-radius:9px;background:rgba(255,255,255,.5);max-height:240px;overflow:auto}
.od-items-head{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;font-size:12px;color:var(--muted);border-bottom:1px dashed rgba(0,0,0,.1);background:rgba(255,255,255,.92);backdrop-filter:blur(4px)}
.od-items-head label{display:flex;align-items:center;gap:6px;cursor:pointer;color:var(--text);font-weight:600;white-space:nowrap}
.od-items-head .od-items-count{flex-shrink:0}
.od-items-list{padding:4px 0}
.od-items-list label{display:flex;align-items:center;gap:8px;padding:6px 12px;font-size:13px;cursor:pointer;color:var(--text)}
.od-items-list label:hover{background:rgba(0,0,0,.04)}
.od-items-list input[type="checkbox"]{flex-shrink:0;accent-color:var(--accent)}
.od-item-name{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.od-item-icon{flex-shrink:0;font-size:12px;opacity:.75}
.od-item-badge{flex-shrink:0;font-size:11px;color:var(--muted);white-space:nowrap}
.add-row2 input:disabled{opacity:.55;cursor:not-allowed}
/* 普通链接批量添加开关 */
.batch-toggle{display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer;white-space:nowrap;color:var(--muted);flex-shrink:0}
.add-row .batch-toggle{align-self:center;margin-right:2px}
.batch-toggle input{accent-color:var(--accent);cursor:pointer;margin:0}
.add-row.batch-on{align-items:flex-start}
.add-row.batch-on .batch-toggle{align-self:flex-start;margin-top:12px}
.add-row #add-btn{flex-shrink:0;white-space:nowrap}
.add-row textarea{flex:1;min-width:0;resize:vertical;min-height:88px;padding:11px 14px;border:1px solid rgba(0,0,0,.12);border-radius:9px;outline:none;background:rgba(255,255,255,.85);font-family:inherit;font-size:14px;line-height:1.6;color:inherit}
.add-row textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.add-row2.batch-name-hidden #add-name{display:none}
.add-row2.batch-name-hidden #add-folder{max-width:none;flex:1}
/* 批量添加结果（成功汇总 + 失败明细） */
.batch-result{margin-top:12px;border:1px dashed rgba(0,0,0,.16);border-radius:9px;background:rgba(255,255,255,.5);padding:10px 14px;font-size:13px}
.batch-result .br-summary{display:flex;align-items:center;gap:8px;font-weight:600}
.batch-result .br-fail{list-style:none;margin:8px 0 0;padding:0;max-height:200px;overflow:auto}
.batch-result .br-fail li{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-top:1px dashed rgba(0,0,0,.1)}
.batch-result .br-url{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.batch-result .br-err{flex-shrink:0;font-size:12px;color:#d33}
.batch-result .br-retry{flex-shrink:0;font-size:12px;padding:2px 10px;border-radius:999px;border:1px solid rgba(0,0,0,.15);cursor:pointer;background:#fff;color:var(--text)}
.batch-result .br-retry:hover{border-color:var(--accent);color:var(--accent)}
/* 次级按钮 */
.secondary{padding:11px 18px;border-radius:10px;font-size:14px;font-weight:600;background:rgba(255,255,255,.75);border:1px solid rgba(0,0,0,.14);color:var(--text);cursor:pointer;transition:all .15s ease;white-space:nowrap}
.secondary:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-1px)}
.secondary:disabled{opacity:.6;cursor:default;transform:none}
.preview{margin-top:16px;display:flex;gap:14px;align-items:center;border:1px dashed rgba(0,0,0,.18);border-radius:9px;padding:10px}
.preview img{max-width:120px;max-height:90px;border-radius:6px;object-fit:contain;background:rgba(255,255,255,.7)}
.preview video{max-width:260px;max-height:140px;border-radius:6px;background:rgba(0,0,0,.05)}
.preview audio{width:260px}
.preview .muted{font-size:12px;word-break:break-all}

/* 文件夹栏 */
.folder-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 14px}
.fchip{padding:6px 14px;border-radius:999px;font-size:13px;background:rgba(255,255,255,.72);border:1px solid rgba(0,0,0,.1);color:#374151;transition:all .15s}
.fchip:hover{transform:translateY(-1px);border-color:var(--accent)}
.fchip.active{background:var(--grad);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.fchip.add{background:rgba(255,255,255,.5);border-style:dashed;font-weight:700}
.fchip-wrap{position:relative;display:inline-flex;align-items:center;gap:3px}
.fchip-menu{width:24px;height:30px;border-radius:8px;background:rgba(255,255,255,.6);border:1px solid rgba(0,0,0,.08);color:#6b7280;font-size:12px}
.fchip-menu:hover{background:#fff;color:var(--text)}
.chip-pop{
  position:fixed;z-index:1600;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);
  padding:6px;min-width:130px;display:flex;flex-direction:column;gap:2px
}
.chip-pop button{text-align:left;padding:7px 10px;border-radius:7px;font-size:13px;color:#374151}
.chip-pop button:hover{background:#f3f4f6}
.chip-pop button.danger{color:#dc2626}
.chip-pop button.danger:hover{background:#fef2f2}

.toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:4px 0 14px;flex-wrap:wrap}
.toolbar h2{font-size:16px}
.count{color:var(--muted);font-size:13px;font-weight:400;margin-left:6px}
.sort-hint{color:var(--muted);font-size:12px;font-weight:400;margin-left:10px}
.search-wrap{position:relative}
.toolbar input{width:250px;padding:8px 12px;border:1px solid rgba(0,0,0,.12);border-radius:9px;outline:none;background:rgba(255,255,255,.85)}
.toolbar input:focus{border-color:var(--accent)}
.search-clear{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;color:var(--muted);font-size:14px;line-height:1}
.search-clear:hover{background:rgba(0,0,0,.08);color:var(--text)}
.empty{color:var(--muted);text-align:center;padding:50px 0;font-size:14px}

/* 图片网格 */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;align-items:stretch}
.img-card{overflow:hidden;display:flex;flex-direction:column;transition:transform .14s ease,box-shadow .14s ease;animation:cardIn .4s ease;cursor:grab}
.img-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px color-mix(in srgb,var(--accent) 28%,rgba(31,41,55,.10))}
.img-card:active{cursor:grabbing}
.img-card.drag-pickup{transition:transform .18s ease,opacity .18s ease,box-shadow .18s ease}
.img-card.dragging{opacity:.65;z-index:40;pointer-events:none;will-change:transform;box-shadow:0 16px 38px color-mix(in srgb,var(--accent) 24%,rgba(15,23,42,.20));border-radius:14px}
.drop-placeholder{position:relative;display:flex;align-items:center;justify-content:center;border:2px dashed color-mix(in srgb,var(--accent) 62%,transparent);border-radius:14px;background:color-mix(in srgb,var(--accent) 10%,transparent);pointer-events:none;color:color-mix(in srgb,var(--accent) 80%,#fff);font-size:13px;font-weight:600;animation:phPulse 1.3s ease-in-out infinite;transition:transform .28s cubic-bezier(.2,.8,.2,1)}
@keyframes phPulse{0%,100%{box-shadow:inset 0 0 0 0 color-mix(in srgb,var(--accent) 30%,transparent)}50%{box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--accent) 35%,transparent)}}
@keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.thumb{position:relative;background:linear-gradient(160deg,color-mix(in srgb,var(--c1) 12%,#fff),color-mix(in srgb,var(--c3) 12%,#fff));aspect-ratio:1/0.96;min-height:0}
.thumb img,.thumb video{-webkit-user-drag:none;user-select:none}
.thumb img{width:100%;height:100%;object-fit:contain;display:block;transition:opacity .25s ease}
.thumb img.thumb-pending{opacity:0;position:absolute;inset:0;pointer-events:none}
.grid-sentinel{height:1px}
.thumb video{width:100%;height:100%;object-fit:contain;display:block;background:rgba(255,255,255,.7)}
.thumb .zoom{position:absolute;right:8px;bottom:8px;background:rgba(15,23,42,.72);color:#fff;font-size:12px;padding:5px 10px;border-radius:6px;transition:background .15s}
.thumb .zoom:hover{background:rgba(15,23,42,.92)}
.thumb-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px;text-align:center;color:var(--muted)}
.thumb-fallback .tf-icon{font-size:22px}
.thumb-fallback .tf-id{font-size:11px;word-break:break-all;max-width:92%}
.card-body{padding:12px;display:flex;flex-direction:column;gap:7px;flex:1}
.card-top{display:flex;align-items:center;justify-content:space-between;min-height:22px;line-height:22px}
.badge{font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600}
.badge-proxy{background:color-mix(in srgb,var(--c1) 16%,#fff);color:var(--c1)}
.badge-dns{background:rgba(255,255,255,.72);color:#4b5563;border:1px solid rgba(0,0,0,.08)}
.badge-type{background:rgba(255,255,255,.72);color:#4b5563;border:1px solid rgba(0,0,0,.1)}
.badge-type-image{background:color-mix(in srgb,#3b82f6 14%,#fff);color:#2563eb;border-color:transparent}
.badge-type-audio{background:color-mix(in srgb,#10b981 14%,#fff);color:#059669;border-color:transparent}
.badge-type-video{background:color-mix(in srgb,#f59e0b 14%,#fff);color:#d97706;border-color:transparent}
.img-name{font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;line-height:20px;min-height:20px}
.img-name .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.img-name .pen{flex:none;font-size:11px;color:var(--muted);opacity:0;transition:opacity .15s}
.img-name:hover .pen{opacity:1}
.name-edit{width:100%;padding:5px 8px;font-size:14px;font-weight:600;border:1px solid var(--accent);border-radius:7px;outline:none}
.img-id{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:#4b5563;line-height:16px;min-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.img-url{font-size:11px;color:var(--muted);line-height:15px;min-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fsel{width:100%;padding:5px 8px;font-size:12px;border:1px solid rgba(0,0,0,.12);border-radius:7px;background:rgba(255,255,255,.85);color:#374151;cursor:pointer}
.fsel:focus{border-color:var(--accent)}
.actions{display:flex;align-items:center;gap:8px;margin-top:2px}
.mini{font-size:12px;padding:5px 11px;border-radius:7px;border:1px solid rgba(0,0,0,.12);background:rgba(255,255,255,.85);transition:background .15s,transform .1s}
.mini:hover{background:#fff;transform:translateY(-1px)}
.mini:active{transform:none}
.mini.danger{color:#dc2626;border-color:#f3c1c1}
.mini.danger:hover{background:#fef2f2}
.mini.copied{background:#16a34a;color:#fff;border-color:transparent}
.switch{position:relative;display:inline-flex;width:34px;height:20px;margin-right:auto;flex:none}
.switch input{opacity:0;width:0;height:0}
.switch span{position:absolute;inset:0;background:#d1d5db;border-radius:999px;transition:.2s}
.switch span:before{content:"";position:absolute;width:16px;height:16px;left:2px;top:2px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.switch input:checked + span{background:linear-gradient(135deg,#22c55e,#10b981)}
.switch input:checked + span:before{transform:translateX(14px)}

/* 骨架屏 */
.skeleton{height:300px;border-radius:var(--radius);background:linear-gradient(100deg,rgba(255,255,255,.45) 20%,rgba(255,255,255,.85) 45%,rgba(255,255,255,.45) 70%);background-size:200% 100%;animation:shimmer 1.3s infinite;border:1px solid var(--glass-line)}
@keyframes shimmer{to{background-position:-200% 0}}

/* 占位卡：基本信息未就绪时的骨架 */
.img-card .thumb-loading{display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,color-mix(in srgb,var(--c1) 10%,#fff),color-mix(in srgb,var(--c3) 10%,#fff))}
.thumb-loading .thumb-spin{width:26px;height:26px;border-radius:50%;border:3px solid color-mix(in srgb,var(--accent) 18%,transparent);border-top-color:var(--accent);animation:spin .8s linear infinite;opacity:.7}
@keyframes spin{to{transform:rotate(360deg)}}
.body-skeleton{display:flex;flex-direction:column;gap:9px}
.sk-line{height:10px;border-radius:6px;background:linear-gradient(100deg,rgba(255,255,255,.4) 20%,rgba(255,255,255,.8) 45%,rgba(255,255,255,.4) 70%);background-size:200% 100%;animation:shimmer 1.3s infinite}
.sk-line.ht{height:14px}
.img-card.fill-done .thumb img{animation:cardFade .35s ease both}
@keyframes cardFade{from{opacity:0}to{opacity:1}}

/* 设置 */
.page-title{font-size:18px;margin-bottom:18px}
.settings-form{display:flex;flex-direction:column;gap:18px;max-width:900px;margin:0 auto}
.group{padding:20px 22px}
.group h3{font-size:15px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(0,0,0,.08)}
.group label{display:block;font-size:13px;color:#374151;margin-bottom:14px}
.group label small{color:var(--muted);display:block;margin-top:2px;font-size:12px}
.group input[type=text],.group input[type=number],.group input[type=url]{display:block;width:100%;margin-top:6px;padding:9px 12px;border:1px solid rgba(0,0,0,.12);border-radius:8px;outline:none;background:rgba(255,255,255,.85)}
.group input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.checkline{display:flex;align-items:center;gap:8px;margin-bottom:14px;font-size:14px;cursor:pointer}
.checkline input{width:16px;height:16px;accent-color:var(--accent)}
.readonly-box{background:rgba(255,255,255,.6);border:1px solid rgba(0,0,0,.08);border-radius:8px;padding:10px 12px;font-size:13px;color:#374151;margin-top:6px}
.mode-radio-row{display:flex;gap:22px;margin-top:6px;flex-wrap:wrap}
.mode-radio-row label{display:flex;align-items:center;gap:7px;font-size:14px;cursor:pointer}
.mode-radio-row input{accent-color:var(--accent)}
.save-row{display:flex;justify-content:center;gap:12px;margin-top:4px;padding-bottom:10px}
.save-fixed{position:fixed;right:34px;bottom:28px;z-index:1000;box-shadow:0 10px 26px rgba(0,0,0,.28)}

/* 按钮 */
.primary{
  background:var(--grad);background-size:220% 220%;color:#fff;border:none;padding:11px 22px;
  border-radius:10px;font-size:14px;font-weight:700;letter-spacing:.3px;
  box-shadow:0 6px 18px color-mix(in srgb,var(--accent) 42%,transparent);
  transition:transform .12s ease,box-shadow .15s ease,background-position .5s ease
}
.primary:hover{background-position:100% 50%;transform:translateY(-1px);box-shadow:0 10px 26px color-mix(in srgb,var(--accent) 52%,transparent)}
.primary:active{transform:translateY(0)}
.primary:disabled{opacity:.6;cursor:default;box-shadow:none;transform:none}

/* toast */
.toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(90px);color:#fff;padding:11px 20px;border-radius:10px;font-size:14px;opacity:0;transition:.25s;z-index:2400;box-shadow:0 10px 34px rgba(0,0,0,.28);pointer-events:none;max-width:80vw}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast.success{background:linear-gradient(135deg,#10b981,#0ea5e9)}
.toast.error{background:linear-gradient(135deg,#f43f5e,#ef4444)}
.toast.info{background:linear-gradient(135deg,#6366f1,#a855f7)}

/* 灯箱预览 */
.lightbox{position:fixed;inset:0;background:rgba(10,14,22,.86);display:flex;align-items:center;justify-content:center;z-index:2100;padding:24px;animation:viewIn .18s ease both}
.lightbox img,.lightbox video{max-width:94vw;max-height:86vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 60px rgba(0,0,0,.5)}
.lightbox audio{width:min(560px,92vw)}
.lightbox .close{position:absolute;top:16px;right:24px;color:#fff;font-size:36px;line-height:1;cursor:pointer;opacity:.85;transition:opacity .15s}
.lightbox .close:hover{opacity:1}
.lightbox .lightbox-actions{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:90vw}
.lightbox .openlink{color:#fff;text-decoration:none;background:rgba(255,255,255,.16);padding:8px 16px;border-radius:8px;font-size:13px;transition:background .15s;display:flex;align-items:center;gap:6px;white-space:nowrap}
.lightbox .openlink:hover{background:rgba(255,255,255,.3)}

/* 删除确认弹窗 */
.modal{position:fixed;inset:0;z-index:2200;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.45);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:20px}
.modal-box{width:360px;max-width:100%;background:#fff;border-radius:14px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.28);animation:popIn .16s ease-out both}
@keyframes popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
.modal-box h3{font-size:15px;margin-bottom:10px}
.modal-box p{font-size:13px;color:#374151;line-height:1.6;word-break:break-all}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}

/* 媒体详情弹窗 */
.detail-modal{position:fixed;inset:0;z-index:2250;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.45);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:18px}
.detail-box{width:1026px;max-width:100%;max-height:92vh;overflow:auto;background:#fff;border-radius:22px;box-shadow:0 27px 81px rgba(0,0,0,.28);animation:popIn .16s ease-out both}
.detail-head{display:flex;align-items:center;justify-content:space-between;padding:19px 24px 0}
.detail-head h3{font-size:20px;font-weight:600;color:var(--text)}
.detail-close{font-size:35px;line-height:1;color:#9ca3af;cursor:pointer;transition:color .15s,transform .15s;background:none;border:none;padding:0 2px}
.detail-close:hover{color:#dc2626;transform:rotate(90deg)}
.detail-body{display:flex;gap:24px;padding:19px 24px 24px}
.detail-left{width:405px;flex:none;display:flex;flex-direction:column;gap:13px}
.detail-info{display:flex;flex-direction:column;gap:5px;color:var(--text)}
.detail-name{font-size:19px;font-weight:600;cursor:pointer;line-height:1.35;word-break:break-all;display:flex;align-items:center;gap:8px;color:var(--text);max-width:100%}
.detail-name:hover .pen{opacity:1}
.detail-name .pen{opacity:.6}
.detail-name input{width:100%;font-size:17px;padding:5px 11px;border-radius:6px;border:1px solid var(--accent);outline:none;color:#1f2937}
.detail-folder{font-size:16px;color:var(--muted);display:flex;align-items:center;gap:8px;max-width:100%;word-break:break-all}
.detail-folder select{width:100%;font-size:16px;padding:5px 11px;border-radius:8px;border:1px solid rgba(0,0,0,.15);background:#fff;color:#1f2937;outline:none;cursor:pointer}
.detail-folder select:focus{border-color:var(--accent)}
.detail-media{width:100%;border-radius:12px;overflow:hidden;background:none;min-height:405px;display:flex;align-items:center;justify-content:center}
.detail-thumb{width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:0}
.detail-thumb img,.detail-thumb video{display:block;max-width:100%;max-height:459px;object-fit:contain;border-radius:8px}
.detail-thumb .thumb-fallback{position:static;inset:auto;font-size:46px;color:color-mix(in srgb,var(--accent) 70%,#444);display:flex;flex-direction:row;align-items:center;gap:11px}
.detail-audio-wrap{width:100%;max-width:340px;display:flex;flex-direction:column;align-items:center;gap:14px}
.detail-audio-wrap audio{width:100%}
.detail-right{flex:1;min-width:0;display:flex;flex-direction:column;gap:22px}
.detail-meta{display:grid;grid-template-columns:1fr 1fr;gap:9px 22px}
.detail-meta .meta-row{font-size:14px;color:var(--muted);display:flex;gap:7px;align-items:baseline;min-width:0}
.detail-meta .meta-row span{flex:none;white-space:nowrap}
.detail-meta .meta-row b{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-weight:600;color:var(--text);font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.detail-meta .meta-row b.id-copy{cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.detail-meta .meta-row b.id-copy:hover{color:var(--accent)}
.detail-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:14px}
.dt-sec-title{font-size:16px;font-weight:600;color:var(--muted);margin:3px 0 0}
.detail-chips{display:flex;flex-wrap:wrap;gap:11px}
.dchip{padding:8px 19px;border-radius:999px;font-size:17px;background:rgba(255,255,255,.72);border:1px solid rgba(0,0,0,.1);color:#374151;transition:all .15s;font-weight:500}
.dchip:hover{transform:translateY(-1px);border-color:var(--accent)}
.dchip.active{background:var(--grad);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.detail-preview{margin-top:3px}
.detail-preview textarea{width:100%;min-height:97px;resize:vertical;padding:14px 16px;border-radius:10px;border:1px solid rgba(0,0,0,.12);background:#fafafa;color:#374151;font-size:17px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;line-height:1.6;word-break:break-all}
.detail-preview textarea:focus{border-color:var(--accent);outline:none}
.detail-copy-btn{align-self:flex-start;margin-top:3px}

@media (max-width:720px){
  .sidebar{width:64px;padding:18px 8px}
  .sidebar .brand{font-size:0}
  .sidebar .brand:after{content:"MD";font-size:18px}
  .nav-btn{font-size:0;text-align:center;padding:10px}
  .nav-btn.active:after{content:"\\2022"}
  .main{padding:18px 14px}
  .save-fixed{right:14px;bottom:14px}
  .toolbar input{width:160px}
  .add-row,.add-row2{flex-direction:column}
  .add-row2 select{max-width:100%}
  .group-nav{display:none}
  .detail-body{flex-direction:column}
  .detail-left{width:100%}
  .detail-media{min-height:270px}
  .detail-thumb img,.detail-thumb video{max-height:324px}
}
@media (prefers-reduced-motion: reduce){
  *,*:before,*:after{animation:none!important;transition:none!important}
  .bg-blob{animation:none}
  .sidebar,.logo,.primary,.lang-toggle,.lang-toggle svg,.lt-seg-opt,.lt-seg-opt::after{animation:none}
}
</style>
</head>
<body>

<button id="lang-toggle" class="lang-toggle" data-i18n-aria="lang.aria" aria-label="切换语言">
  <span class="lt-globe" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
      <circle cx="12" cy="12" r="9"/>
      <ellipse cx="12" cy="12" rx="9" ry="3.6"/>
      <ellipse cx="12" cy="12" rx="4.2" ry="9"/>
      <ellipse cx="12" cy="12" rx="4.2" ry="9" transform="rotate(60 12 12)"/>
      <path class="sparkle" d="M18.6 3.4l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z"/>
    </svg>
  </span>
  <span class="lt-seg" aria-hidden="true">
    <span class="lt-seg-opt is-zh"><b>中</b></span>
    <span class="lt-seg-opt is-en"><b>EN</b></span>
  </span>
</button>

<div class="bg-blob b1"></div>
<div class="bg-blob b2"></div>
<div class="bg-blob b3"></div>
<canvas id="particles" aria-hidden="true"></canvas>
<div id="clickfx" aria-hidden="true"></div>

<div id="login" class="login-screen hidden">
  <form id="login-form" class="login-card">
    <div class="logo">MediaDNS-CDN</div>
    <p class="sub" data-i18n="login.sub"></p>
    <input id="login-token" type="password" data-i18n-ph="login.ph" autocomplete="current-password" required />
    <button type="submit" class="primary" id="login-btn" data-i18n="login.btn"></button>
    <p class="hint" data-i18n="login.hint"></p>
  </form>
</div>

<div id="app" class="app hidden">
  <aside class="sidebar">
    <div class="brand">MediaDNS-CDN</div>
    <nav>
      <button class="nav-btn active" data-view="images" data-i18n="nav.images"></button>
      <button class="nav-btn" data-view="settings" data-i18n="nav.settings"></button>
    </nav>
    <div id="group-nav" class="group-nav"></div>
  </aside>
  <main class="main">
    <section id="view-images" class="view active">
      <div class="card add-card">
        <h2 data-i18n="add.title"></h2>
        <div class="add-mode-toggle">
          <button type="button" id="add-mode-normal" class="at-seg active" data-i18n="add.mode.normal"></button>
          <button type="button" id="add-mode-onedrive" class="at-seg" data-i18n="add.mode.onedrive"></button>
        </div>
        <div id="add-form-normal">
          <div class="add-row">
            <label class="batch-toggle" data-i18n-title="add.batch.toggleTitle" title="批量添加模式"><input type="checkbox" id="add-batch-toggle" /><span data-i18n="add.batch.toggle"></span></label>
            <input id="add-url" type="url" data-i18n-ph="add.url.ph" />
            <textarea id="add-batch-area" class="hidden" rows="4" spellcheck="false" data-i18n-ph="add.batch.url.ph"></textarea>
            <button id="add-btn" class="primary" data-i18n="add.btn"></button>
          </div>
          <div class="add-row2" id="add-name-row">
            <input id="add-name" type="text" data-i18n-ph="add.name.ph" />
            <select id="add-folder" aria-label="Folder"></select>
          </div>
          <div class="mode-row">
            <label class="mode-option"><input type="radio" name="mode" value="redirect" /><span data-i18n="mode.redirect"></span><em data-i18n="mode.redirect.em"></em></label>
            <label class="mode-option"><input type="radio" name="mode" value="proxy" checked /><span data-i18n="mode.proxy"></span><em data-i18n="mode.proxy.em"></em></label>
          </div>
          <div id="add-preview" class="preview hidden">
            <div id="preview-media"></div>
            <div id="preview-info" class="muted"></div>
          </div>
          <div id="add-batch-result" class="batch-result hidden"></div>
        </div>
        <div id="add-form-onedrive" class="hidden">
          <div class="add-row">
            <input id="od-url" type="url" data-i18n-ph="add.od.url.ph" />
            <button id="od-resolve-btn" class="secondary" data-i18n="add.od.resolve"></button>
          </div>
          <div class="add-row2">
            <input id="od-name" type="text" data-i18n-ph="add.name.ph" />
            <select id="od-folder" aria-label="Folder"></select>
          </div>
          <div class="mode-row">
            <label class="mode-option"><input type="radio" name="od-mode" value="redirect" /><span data-i18n="mode.redirect"></span><em data-i18n="mode.redirect.em"></em></label>
            <label class="mode-option"><input type="radio" name="od-mode" value="proxy" checked /><span data-i18n="mode.proxy"></span><em data-i18n="mode.proxy.em"></em></label>
          </div>
          <div id="od-info" class="od-info hidden"></div>
          <div id="od-items" class="od-items hidden"></div>
          <div class="od-actions">
            <button id="od-add-btn" class="primary hidden" data-i18n="add.btn"></button>
            <button id="od-import-btn" class="primary hidden" data-i18n="add.od.import"></button>
          </div>
          <p class="od-hint" data-i18n="add.od.hint"></p>
        </div>
      </div>

      <div id="folder-bar" class="folder-bar"></div>

      <div class="toolbar">
        <h2><span data-i18n="list.title"></span> <span id="img-count" class="count"></span><small class="sort-hint" data-i18n="list.sortHint"></small></h2>
        <div class="search-wrap">
          <input id="search" type="search" data-i18n-ph="search.ph" />
          <button id="search-clear" class="search-clear hidden" data-i18n-aria="search.clear" aria-label="清空搜索">&times;</button>
        </div>
      </div>
      <div id="empty" class="empty hidden"></div>
      <div id="grid" class="grid"></div>
    </section>

    <section id="view-settings" class="view">
      <h2 class="page-title" data-i18n="set.title"></h2>
      <div class="settings-form">
        <div class="card group">
          <h3 data-i18n="set.group.access"></h3>
          <label><span data-i18n="set.allowedCountries"></span><input id="allowedCountries" type="text" data-i18n-ph="set.allowedCountries.ph" /><small data-i18n="set.allowedCountries.hint"></small></label>
          <label><span data-i18n="set.blockedCountries"></span><input id="blockedCountries" type="text" data-i18n-ph="set.blockedCountries.ph" /></label>
          <label><span data-i18n="set.allowedIps"></span><input id="allowedIps" type="text" data-i18n-ph="set.allowedIps.ph" /><small data-i18n="set.allowedIps.hint"></small></label>
          <label><span data-i18n="set.blockedIps"></span><input id="blockedIps" type="text" data-i18n-ph="set.blockedIps.ph" /></label>
          <label><span data-i18n="set.allowedAsn"></span><input id="allowedAsn" type="text" data-i18n-ph="set.allowedAsn.ph" /><small data-i18n="set.allowedAsn.hint"></small></label>
          <label><span data-i18n="set.blockedAsn"></span><input id="blockedAsn" type="text" data-i18n-ph="set.blockedAsn.ph" /></label>
        </div>

        <div class="card group">
          <h3 data-i18n="set.group.hotlink"></h3>
          <label><span data-i18n="set.allowedReferers"></span><input id="allowedReferers" type="text" data-i18n-ph="set.allowedReferers.ph" /><small data-i18n="set.allowedReferers.hint"></small></label>
          <label class="checkline"><input id="requireSignature" type="checkbox" /><span data-i18n="set.requireSignature"></span><small style="display:inline" data-i18n="set.requireSignature.hint"></small></label>
          <label><span data-i18n="set.signatureTtl"></span><input id="signatureTtl" type="number" min="60" max="31536000" /></label>
        </div>

        <div class="card group">
          <h3 data-i18n="set.group.cache"></h3>
          <label><span data-i18n="set.cacheTtl"></span><input id="cacheTtl" type="number" min="0" max="31536000" /><small data-i18n="set.cacheTtl.hint"></small></label>
          <label><span data-i18n="set.odRefreshHours"></span><input id="onedriveRefreshHours" type="number" min="1" step="0.5" /><small id="odRefreshHoursHint"></small></label>
          <label><span data-i18n="set.maxImageSize"></span><input id="maxImageSize" type="number" min="1024" /></label>
          <label><span data-i18n="set.maxAudioSize"></span><input id="maxAudioSize" type="number" min="1024" /></label>
          <label><span data-i18n="set.maxVideoSize"></span><input id="maxVideoSize" type="number" min="1024" /><small data-i18n="set.maxVideoSize.hint"></small></label>
          <label><span data-i18n="set.defaultMode"></span><small data-i18n="set.defaultMode.hint"></small>
            <span class="mode-radio-row">
              <label><input type="radio" name="defaultMode" id="defaultModeRedirect" value="redirect" /><span data-i18n="mode.redirect.short"></span></label>
              <label><input type="radio" name="defaultMode" id="defaultModeProxy" value="proxy" /><span data-i18n="mode.proxy.short"></span></label>
            </span>
          </label>
          <label><span data-i18n="set.downloadNameSource"></span><small data-i18n="set.downloadNameSource.hint"></small>
            <span class="mode-radio-row">
              <label><input type="radio" name="downloadNameSource" id="downloadNameSourceUpstream" value="upstream" /><span data-i18n="set.downloadNameSource.upstream"></span></label>
              <label><input type="radio" name="downloadNameSource" id="downloadNameSourceCustom" value="custom" /><span data-i18n="set.downloadNameSource.custom"></span></label>
            </span>
          </label>
          <label><span data-i18n="set.thumbSource"></span><small data-i18n="set.thumbSource.hint"></small>
            <span class="mode-radio-row">
              <label><input type="radio" name="thumbSource" id="thumbSourceUpstream" value="upstream" /><span data-i18n="set.thumbSource.upstream"></span></label>
              <label><input type="radio" name="thumbSource" id="thumbSourceSite" value="site" /><span data-i18n="set.thumbSource.site"></span></label>
            </span>
          </label>
          <label><span data-i18n="set.previewSource"></span><small data-i18n="set.previewSource.hint"></small>
            <span class="mode-radio-row">
              <label><input type="radio" name="previewSource" id="previewSourceUpstream" value="upstream" /><span data-i18n="set.previewSource.upstream"></span></label>
              <label><input type="radio" name="previewSource" id="previewSourceSite" value="site" /><span data-i18n="set.previewSource.site"></span></label>
            </span>
          </label>
        </div>

        <div class="card group">
          <h3 data-i18n="set.group.origin"></h3>
          <label><span data-i18n="set.allowedOrigins"></span><input id="allowedOrigins" type="text" data-i18n-ph="set.allowedOrigins.ph" /><small data-i18n="set.allowedOrigins.hint"></small></label>
          <label><span data-i18n="set.originReferer"></span><input id="originReferer" type="url" data-i18n-ph="set.originReferer.ph" /></label>
          <label><span data-i18n="set.originUserAgent"></span><input id="originUserAgent" type="text" data-i18n-ph="set.originUserAgent.ph" /></label>
        </div>

        <div class="card group">
          <h3 data-i18n="set.group.rate"></h3>
          <label><span data-i18n="set.rateIp"></span><div id="rateLimitIp" class="readonly-box">-</div></label>
          <label><span data-i18n="set.rateImg"></span><div id="rateLimitImg" class="readonly-box">-</div></label>
          <label><span data-i18n="set.rateAv"></span><div id="rateLimitAv" class="readonly-box">-</div></label>
          <label><span data-i18n="set.rateNote"></span><div class="readonly-box" data-i18n="set.rateNoteText"></div></label>
        </div>

        <div class="card group">
          <h3 data-i18n="set.group.ui"></h3>
          <label><span data-i18n="set.thumbCache"></span><input id="thumbCache" type="number" min="8" max="1000" step="4" data-i18n-ph="set.thumbCache.ph" /><small data-i18n="set.thumbCache.hint"></small></label>
        </div>

        <div class="save-row">
          <button id="logout-in-settings" class="logout-in-settings" data-i18n="nav.logout"></button>
        </div>
        <!-- 保存设置按钮固定在窗口右下角；视图动画为纯淡入（无 transform），fixed 不会被包含块干扰 -->
        <button id="save-settings" class="primary save-fixed" data-i18n="set.save"></button>
      </div>
    </section>
  </main>
</div>

<div id="toast" class="toast"></div>
<div id="lightbox" class="lightbox hidden">
  <div id="lightbox-media"></div>
  <div class="lightbox-actions">
    <a id="lightbox-open" class="openlink" href="#" target="_blank" rel="noopener" data-i18n="lightbox.open"></a>
    <a id="lightbox-open-site" class="openlink" href="#" target="_blank" rel="noopener" data-i18n="lightbox.openSite"></a>
  </div>
  <span class="close" data-i18n-aria="lightbox.close" aria-label="关闭">&times;</span>
</div>
<div id="confirm-modal" class="modal hidden">
  <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <h3 id="confirm-title" data-i18n="confirm.title"></h3>
    <p id="confirm-text"></p>
    <div class="modal-actions">
      <button id="confirm-cancel" class="mini" data-i18n="confirm.cancel"></button>
      <button id="confirm-ok" class="mini danger" data-i18n="confirm.ok"></button>
    </div>
  </div>
</div>
<div id="chip-pop" class="chip-pop hidden">
  <button data-act="rename" data-i18n="folder.rename"></button>
  <button data-act="delete" class="danger" data-i18n="folder.delete"></button>
</div>
<div id="detail-modal" class="detail-modal hidden">
  <div class="detail-box" role="dialog" aria-modal="true" aria-labelledby="detail-title">
    <div class="detail-head">
      <h3 id="detail-title" data-i18n="detail.title"></h3>
      <button class="detail-close" data-i18n-aria="detail.close" aria-label="关闭">&times;</button>
    </div>
    <div class="detail-body">
      <div class="detail-left">
        <div class="detail-info">
          <div id="detail-name" class="detail-name" data-id="" data-name=""><span class="t"></span><span class="pen">✎</span></div>
          <div id="detail-folder" class="detail-folder"></div>
        </div>
        <div class="detail-media">
          <div id="detail-thumb" class="detail-thumb"></div>
        </div>
      </div>
      <div class="detail-right">
        <div class="detail-meta">
          <div class="meta-row"><span data-i18n="detail.size"></span><b id="detail-size">-</b></div>
          <div class="meta-row"><span data-i18n="detail.fileType"></span><b id="detail-filetype">-</b></div>
          <div class="meta-row"><span data-i18n="detail.type"></span><b id="detail-type">-</b></div>
          <div class="meta-row"><span data-i18n="detail.id"></span><b id="detail-id" class="id-copy" data-i18n-title="detail.copyId">-</b></div>
          <div class="meta-row"><span data-i18n="detail.time"></span><b id="detail-time">-</b></div>
          <div class="meta-row"><span data-i18n="detail.dimension"></span><b id="detail-dim">-</b></div>
        </div>
        <div class="detail-copy">
        <p class="dt-sec-title" data-i18n="detail.source"></p>
        <div class="detail-chips" id="detail-source">
          <button type="button" class="dchip active" data-src="site" data-i18n="detail.sourceSite"></button>
          <button type="button" class="dchip" data-src="upstream" data-i18n="detail.sourceUpstream"></button>
          <button type="button" class="dchip" data-src="raw" data-i18n="detail.sourceRaw"></button>
        </div>
        <p class="dt-sec-title" data-i18n="detail.format"></p>
        <div class="detail-chips" id="detail-format">
          <button type="button" class="dchip active" data-fmt="url" data-i18n="detail.formatUrl"></button>
          <button type="button" class="dchip" data-fmt="html" data-i18n="detail.formatHtml"></button>
          <button type="button" class="dchip" data-fmt="markdown" data-i18n="detail.formatMarkdown"></button>
          <button type="button" class="dchip" data-fmt="bbcode" data-i18n="detail.formatBBcode"></button>
        </div>
        <div class="detail-preview">
          <textarea id="detail-preview" readonly spellcheck="false"></textarea>
        </div>
        <button id="detail-copy-btn" class="primary detail-copy-btn" data-i18n="detail.copy"></button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
(function () {
  var TOKEN_KEY = "media_dns_password";
  var LANG_KEY = "media_dns_lang";
  var token = localStorage.getItem(TOKEN_KEY) || "";
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LANG = localStorage.getItem(LANG_KEY) ||
    (navigator.language && navigator.language.toLowerCase().indexOf("zh") === 0 ? "zh" : "en");
  var lastImages = null;
  var lastFolders = [];
  var currentFolder = "";
  var searchQuery = "";
  var addPendingFolder = "";
  var lastPreviewHost = "";
  var rateMeta = null;
  var appSettings = {}; // 全局设置缓存（含 thumbSource/previewSource），缩略图与灯箱渲染时读取
  var detailModalImg = null; // 详情弹窗当前媒体对象
  var detailSrc = "site"; // 详情弹窗复制源：site=网站链接 / upstream=上游链接
  var detailFmt = "url"; // 详情弹窗复制格式：url / html / markdown / bbcode
  var THUMB_CACHE_KEY = "media_dns_thumb_cache";
  var thumbCacheMax = parseInt(localStorage.getItem(THUMB_CACHE_KEY), 10);
  if (!thumbCacheMax || thumbCacheMax < 8) { thumbCacheMax = 50; localStorage.setItem(THUMB_CACHE_KEY, "50"); }
  var gridState = { cols: 1, rowH: 320, groupSize: 20, rendered: 0, vis: null };
  var gridSentinel = null;
  var gridObserver = null;
  var renderDoneCb = null; // 渲染队列处理完成后回调（分组跳转等需等待高度就位再滚动）
  var pendingJump = null; // 待执行的分组跳转目标（多次快速点击只保留最后一次）
  var thumbObserver2 = null;
  var thumbObsTargets = [];
  var thumbLoaded = 0;

  /* 卡片本体分批渲染：每帧插入一小批，配合递增动画延迟逐个浮现（与缩略图加载一致的体感） */
  var CARD_BATCH = 5;
  var cardQueue = [];
  var cardQueueTimer = null;
  var thumbManageTimer = null;

  /* 基本信息增量加载：有界并发逐卡拉取 /api/image/detail，就绪即填充占位卡 */
  var INFO_CONCURRENCY = 6;
  var infoQueue = [];
  var infoInFlight = 0;
  var infoRunning = false;
  var infoActive = {}; // id -> true（已入队或在途，防止重复入队）
  var infoFailed = {}; // id -> true（本轮多次加载失败后放弃；下次 loadImages 重置）
  var infoRetry = {}; // id -> 失败已重试次数
  var INFO_MAX_RETRY = 2; // 详情请求失败额外重试次数
  var loadGen = 0;

  var I18N = {
    zh: {
      "app.title": "MediaDNS-CDN · 媒体管理",
      "lang.aria": "切换语言",
      "login.sub": "媒体外链转接 · 缓存 · 防盗链",
      "login.ph": "请输入管理密码（PASSWORD）",
      "login.btn": "登录",
      "login.hint": "密码仅保存在当前浏览器",
      "login.busy": "登录中…",
      "login.err": "登录失败：PASSWORD 错误",
      "net.err": "网络错误",
      "net.retry": "网络异常，请过一会再试",
      "auth.invalid": "未登录或登录已失效",
      "nav.images": "媒体管理",
      "nav.settings": "设置",
      "nav.logout": "退出登录",
      "add.title": "添加媒体",
      "add.url.ph": "粘贴图片/音视频直链地址，如 https://img.example.com/a/b.mp4（回车也可添加）",
      "add.name.ph": "名称（选填，默认用文件名）",
      "add.folder.new": "新建文件夹…",
      "add.folder.newPh": "输入新文件夹名称",
      "add.btn": "添加",
      "add.busy": "添加中…",
      "add.err.empty": "请粘贴媒体链接",
      "add.err": "添加失败",
      "add.ok": "已添加，链接已复制到剪贴板",
      "add.src": "来源",
      "add.mode.normal": "普通链接",
      "add.mode.onedrive": "OneDrive 链接",
      "add.od.url.ph": "粘贴 OneDrive 共享链接，如 https://1drv.ms/u/s!xxx?e=yyy",
      "add.od.resolve": "解析",
      "add.od.resolving": "解析中…",
      "add.od.ready": "已解析，可添加",
      "add.od.folder": "{n} 个文件",
      "add.od.folderReady": "文件夹共 {n} 个文件",
      "add.od.import": "批量导入",
      "add.od.importSelected": "导入所选（{n}）",
      "add.od.importEmpty": "请先勾选要导入的文件",
      "add.od.selectAll": "全选",
      "add.od.importing": "正在导入 {n} 个文件…",
      "add.od.importDoneOk": "已导入 {n} 个文件",
      "add.od.importDoneFail": "已导入 {n} 个文件，{m} 个失败",
      "add.od.pass": "该共享链接需要密码，本期暂不支持，请更换为无密码链接",
      "add.od.unauth": "该共享为非公开（需登录/仅限指定用户），无法匿名转链，请更换为「任何人可访问」的共享链接",
      "add.od.fail": "OneDrive 解析失败",
      "add.od.hint": "OneDrive 模式默认「缓存代理+DNS」，可手动切换；支持旧格式（1drv.ms/u/s!…）与新格式（1drv.ms/f/c/…）的「任何人可访问」共享链接。",
      "add.batch.toggle": "批量",
      "add.batch.toggleTitle": "勾选后按行粘贴多个链接，一次批量添加",
      "add.batch.url.ph": "每行粘贴一个媒体直链地址",
      "add.batch.btn": "批量添加（{n}）",
      "add.batch.btnEmpty": "批量添加",
      "add.batch.adding": "正在添加 {n} 条…",
      "add.batch.doneOk": "已添加 {n} 条",
      "add.batch.doneFail": "成功 {n} 条，失败 {m} 条",
      "add.batch.failTitle": "以下链接添加失败：",
      "add.batch.retry": "重试",
      "add.batch.retrying": "重试中…",
      "add.batch.retryDone": "已重试添加",
      "type.image": "图片",
      "type.audio": "音频",
      "type.video": "视频",
      "mode.redirect": "仅DNS",
      "mode.proxy": "缓存代理+DNS",
      "mode.redirect.em": "302直跳原图，不占用带宽",
      "mode.proxy.em": "Worker 缓存转发",
      "mode.redirect.short": "仅DNS（302直跳）",
      "mode.proxy.short": "缓存代理+DNS",
      "list.title": "媒体列表",
      "list.count": "{n} 条",
      "list.sortHint": "按住卡片空白处拖动可排序",
      "search.ph": "搜索名称 / ID / 地址…",
      "search.clear": "清空搜索",
      "empty": "还没有媒体，粘贴一个链接开始吧。",
      "empty.filtered": "没有匹配的媒体。",
      "all": "全部",
      "folder.uncat": "未分类",
      "folder.new": "新建文件夹",
      "folder.newPh": "输入新文件夹名称",
      "folder.rename": "重命名",
      "folder.delete": "删除",
      "folder.renamePrompt": "输入文件夹新名称",
      "folder.deleteConfirm": "删除文件夹「{name}」？其中的图片会移入未分类。",
      "folder.createOk": "文件夹已创建",
      "folder.renameOk": "已重命名",
      "folder.deleted": "文件夹已删除",
      "card.preview": "预览原图",
      "card.preview.short": "预览",
      "card.copy": "复制",
      "card.copy.ok": "已复制",
      "card.copy.aria": "复制短链接",
      "card.del": "删除",
      "card.toggle": "启用/停用",
      "card.folderAria": "移动文件夹",
      "card.renameTitle": "点击重命名",
      "card.detail": "详情",
      "detail.title": "媒体详情",
      "detail.close": "关闭",
      "detail.source": "复制源",
      "detail.sourceSite": "网站链接",
      "detail.sourceUpstream": "上游链接",
      "detail.sourceRaw": "原始链接",
      "detail.type": "类型",
      "detail.typeOnedrive": "OneDrive 链接",
      "detail.typeNormal": "普通链接",
      "detail.format": "复制格式",
      "detail.formatUrl": "URL",
      "detail.formatHtml": "HTML",
      "detail.formatMarkdown": "Markdown",
      "detail.formatBBcode": "BBcode",
      "detail.copy": "复制",
      "detail.copyId": "点击复制 ID",
      "detail.size": "大小",
      "detail.fileType": "文件类型",
      "detail.id": "ID",
      "detail.time": "上传时间",
      "detail.dimension": "尺寸",
      "confirm.title": "删除媒体",
      "confirm.text": "确定删除媒体「{name}」吗？删除后链接将立即失效。",
      "confirm.cancel": "取消",
      "confirm.ok": "删除",
      "op.toggleOn": "已启用",
      "op.toggleOff": "已停用",
      "op.del": "已删除",
      "op.delFail": "删除失败",
      "op.fail": "操作失败",
      "op.saveOk": "设置已保存，缓存已刷新。请等待 5~30 秒，待 KV 更新生效",
      "op.saveFail": "保存失败",
      "op.copyOk": "链接已复制",
      "op.saved": "已保存",
      "op.moved": "已移动",
      "op.sorted": "已更新排序",
      "op.updated": "已更新",
      "lightbox.open": "在新标签打开原图",
      "lightbox.openSite": "在新标签打开网站外链",
      "lightbox.close": "关闭",
      "set.title": "设置",
      "set.save": "保存设置",
      "set.busy": "保存中…",
      "set.group.access": "访问控制",
      "set.allowedCountries": "允许的地区（国家代码，逗号分隔，留空 = 全部允许）",
      "set.allowedCountries.ph": "如 CN, US, JP",
      "set.allowedCountries.hint": "例如 CN 表示仅中国大陆可访问；此限制同样作用于缓存命中。",
      "set.blockedCountries": "封禁的地区（国家代码，逗号分隔，留空 = 不封禁）",
      "set.blockedCountries.ph": "如 XX",
      "set.allowedIps": "允许的 IP（逗号分隔，留空 = 全部允许）",
      "set.allowedIps.ph": "如 1.2.3.4, 203.0.113.0/24",
      "set.allowedIps.hint": "IPv6 与 IPv4 均可。",
      "set.blockedIps": "封禁的 IP（逗号分隔，留空 = 不封禁）",
      "set.blockedIps.ph": "如 1.2.3.4",
      "set.allowedAsn": "允许的 ASN（逗号分隔，留空 = 全部允许）",
      "set.allowedAsn.ph": "如 13335, 15169",
      "set.allowedAsn.hint": "13335 = Cloudflare，15169 = Google，可用来精确放行/拦截某个运营商。",
      "set.blockedAsn": "封禁的 ASN（逗号分隔，留空 = 不封禁）",
      "set.blockedAsn.ph": "如 4134",
      "set.group.hotlink": "防盗链",
      "set.allowedReferers": "允许引用的域名（Referer 白名单，逗号分隔，留空 = 不限制）",
      "set.allowedReferers.ph": "如 myblog.com, blog.com",
      "set.allowedReferers.hint": "配置后，只有请求的 Referer 域名匹配此列表（含子域名）才放行；不携带 Referer（如浏览器直链访问、直接输入网址）或域名不匹配的请求一律返回 403。请把需要引用外链的网页域名加入列表；留空 = 不限制。",
      "set.requireSignature": "启用 HMAC 签名链接",
      "set.requireSignature.hint": "开启后生成的链接自动附带「过期时间+签名」，任何请求都必须携带有效签名，无法伪造或篡改，即使 Referer 缺失也能防护（最强防外链）。注意：开启后旧链接、手工拼接或已过期的链接将全部失效，需重新复制新链接。",
      "set.signatureTtl": "签名有效期（秒）",
      "set.group.cache": "缓存与限制",
      "set.cacheTtl": "缓存 TTL（秒，0 = 不缓存）",
      "set.cacheTtl.hint": "仅「缓存代理+DNS」模式的媒体走缓存；缓存命中时由边缘直接返回。",
      "set.odRefreshHours": "OneDrive 自动刷新间隔（小时）",
      "set.odRefreshHours.hint": "网站缓存了 OneDrive 的解析结果：仅使用网站外链时，即使 OneDrive 解析链已过期，外链仍可正常访问，可调大此值以减少对 OneDrive 的请求。三个参考时间——最短 1 小时（保持解析链不过期）；不使用解析链（仅用网站外链）时推荐设为最长缓存时间 {maxHours} 小时，几乎不再产生 OneDrive 请求；最长为 {maxHours} 小时（= 网站最长缓存时间）。Worker 每 5 分钟检查一次，距上次刷新剩余时间 ≤ 310 秒（5 分钟周期 + 10 秒缓冲）时触发自动解析并更新时间。",
      "set.maxImageSize": "单张图片大小上限（字节）",
      "set.maxAudioSize": "单个音频大小上限（字节）",
      "set.maxVideoSize": "单个视频大小上限（字节）",
      "set.maxVideoSize.hint": "Cloudflare 免费版单个缓存对象上限 512MB，超过此值的视频不会被缓存。",
      "set.defaultMode": "默认链接类型",
      "set.defaultMode.hint": "兜底设置：仅在媒体未指定链接类型时生效（如通过 API 直接添加的媒体、或早期版本添加的无该字段的旧媒体），不影响已有媒体。",
      "set.downloadNameSource": "保存文件名来源",
      "set.downloadNameSource.hint": "另存/下载媒体时文件名取自上游文件名，或取自网站自定义名（自动补上游扩展名）。自定义名请勿带后缀，否则会变成「名字.你写的后缀.上游后缀」。仅「缓存代理+DNS」模式生效（仅DNS为302直跳上游，无法控制保存名）。",
      "set.downloadNameSource.upstream": "上游文件名",
      "set.downloadNameSource.custom": "网站自定义名",
      "set.thumbSource": "缩略图媒体源",
      "set.thumbSource.hint": "管理面板中媒体卡片的缩略图/封面取自上游媒体源，或本网站代理后的网站媒体源；媒体详情页缩略图同样由此控制。仅「缓存代理+DNS」模式的媒体支持网站源（「仅DNS」为302直跳，始终用上游）。视频封面因跨域截帧限制，缓存代理模式下始终走网站代理链接。",
      "set.thumbSource.upstream": "上游媒体源",
      "set.thumbSource.site": "网站媒体源",
      "set.previewSource": "预览媒体源",
      "set.previewSource.hint": "点击预览按钮后，灯箱中播放/显示的媒体取自上游媒体源，或本网站代理后的网站媒体源。仅「缓存代理+DNS」模式的媒体支持网站源（「仅DNS」为302直跳，始终用上游）。",
      "set.previewSource.upstream": "上游媒体源",
      "set.previewSource.site": "网站媒体源",
      "set.group.origin": "上游（图床）",
      "set.allowedOrigins": "允许代理的域名（SSRF 白名单，逗号分隔）",
      "set.allowedOrigins.ph": "如 img.example.com, img2.example.com",
      "set.allowedOrigins.hint": "只允许 fetch 这些域名，防止把 Worker 当跳板访问任意地址。必须配置，否则无法添加链接。",
      "set.originReferer": "上游 Referer（转发给图床，应对图床防盗链）",
      "set.originReferer.ph": "如 https://img.example.com/",
      "set.originUserAgent": "上游 User-Agent（转发给图床，留空用默认）",
      "set.originUserAgent.ph": "留空即可",
      "set.group.rate": "限流（只读）",
      "set.rateIp": "每 IP 限流",
      "set.rateImg": "每图限流",
      "set.rateAv": "每媒体限流（音视频）",
      "set.rateNote": "说明",
      "set.rateIpVal": "每 IP {limit} 次 / {period} 秒",
      "set.rateImgVal": "每图 {limit} 次 / {period} 秒",
      "set.rateAvVal": "每媒体 {limit} 次 / {period} 秒",
      "set.rateNoteText": "限流由 Cloudflare Rate Limit Binding 在边缘执行，数值需在 wrangler.jsonc 中修改后重新部署，此处仅展示当前配置。",
      "set.group.ui": "界面",
      "set.thumbCache": "缩略图缓存上限（个）",
      "set.thumbCache.ph": "如 50",
      "set.thumbCache.hint": "超过上限时自动释放距离当前位置最远、且超过最小释放距离的缩略图，滑到附近时重新加载。仅存在本浏览器。",
      "nav.groups": "分组",
      "nav.group.go": "跳到第 {n} 组"
    },
    en: {
      "app.title": "MediaDNS-CDN · Media Manager",
      "lang.aria": "Switch language",
      "login.sub": "Media hotlink proxy · Cache · Anti-leech",
      "login.ph": "Enter admin password (PASSWORD)",
      "login.btn": "Log in",
      "login.hint": "Password is stored only in this browser",
      "login.busy": "Logging in…",
      "login.err": "Login failed: wrong PASSWORD",
      "net.err": "Network error",
      "net.retry": "Network error, please try again later",
      "auth.invalid": "Not logged in or session expired",
      "nav.images": "Media",
      "nav.settings": "Settings",
      "nav.logout": "Log out",
      "add.title": "Add media",
      "add.url.ph": "Paste image/audio/video direct link, e.g. https://img.example.com/a/b.mp4 (Enter to add)",
      "add.name.ph": "Name (optional, defaults to filename)",
      "add.folder.new": "New folder…",
      "add.folder.newPh": "Enter new folder name",
      "add.btn": "Add",
      "add.busy": "Adding…",
      "add.err.empty": "Please paste a media link",
      "add.err": "Add failed",
      "add.ok": "Added, link copied to clipboard",
      "add.src": "Source",
      "add.mode.normal": "Normal link",
      "add.mode.onedrive": "OneDrive link",
      "add.od.url.ph": "Paste a OneDrive share link, e.g. https://1drv.ms/u/s!xxx?e=yyy",
      "add.od.resolve": "Resolve",
      "add.od.resolving": "Resolving…",
      "add.od.ready": "Resolved, ready to add",
      "add.od.folder": "{n} files",
      "add.od.folderReady": "Folder contains {n} files",
      "add.od.import": "Import all",
      "add.od.importSelected": "Import selected ({n})",
      "add.od.importEmpty": "Select at least one item to import",
      "add.od.selectAll": "Select all",
      "add.od.importing": "Importing {n} files…",
      "add.od.importDoneOk": "Imported {n} files",
      "add.od.importDoneFail": "Imported {n} files, {m} failed",
      "add.od.pass": "This share link is password protected (not supported yet). Please use a password-free link.",
      "add.od.unauth": "This share is not public (requires sign-in / limited to specific people) and can't be converted anonymously. Please use an “Anyone with the link” share.",
      "add.od.fail": "Failed to resolve OneDrive link",
      "add.od.hint": "OneDrive mode defaults to “Cache proxy + DNS”, switchable to DNS-only; supports both legacy (1drv.ms/u/s!…) and new-format (1drv.ms/f/c/…) “Anyone with the link” shares.",
      "add.batch.toggle": "Batch",
      "add.batch.toggleTitle": "Check to paste multiple links (one per line) and add them in batch",
      "add.batch.url.ph": "Paste one media direct link per line",
      "add.batch.btn": "Batch add ({n})",
      "add.batch.btnEmpty": "Batch add",
      "add.batch.adding": "Adding {n}…",
      "add.batch.doneOk": "Added {n}",
      "add.batch.doneFail": "Added {n}, failed {m}",
      "add.batch.failTitle": "Failed to add these links:",
      "add.batch.retry": "Retry",
      "add.batch.retrying": "Retrying…",
      "add.batch.retryDone": "Retry added",
      "type.image": "Image",
      "type.audio": "Audio",
      "type.video": "Video",
      "mode.redirect": "DNS only",
      "mode.proxy": "Cache proxy + DNS",
      "mode.redirect.em": "302 direct, no bandwidth cost",
      "mode.proxy.em": "Worker cache & forward",
      "mode.redirect.short": "DNS only (302)",
      "mode.proxy.short": "Cache proxy + DNS",
      "list.title": "Media",
      "list.count": "{n} items",
      "list.sortHint": "Drag a card's empty area to reorder",
      "search.ph": "Search name / ID / URL…",
      "search.clear": "Clear search",
      "empty": "No media yet. Paste a link to start.",
      "empty.filtered": "No matching media.",
      "all": "All",
      "folder.uncat": "Uncategorized",
      "folder.new": "New folder",
      "folder.newPh": "Enter new folder name",
      "folder.rename": "Rename",
      "folder.delete": "Delete",
      "folder.renamePrompt": "Enter new folder name",
      "folder.deleteConfirm": "Delete folder ‘{name}’? Its images will move to Uncategorized.",
      "folder.createOk": "Folder created",
      "folder.renameOk": "Renamed",
      "folder.deleted": "Folder deleted",
      "card.preview": "Preview original",
      "card.preview.short": "Preview",
      "card.copy": "Copy",
      "card.copy.ok": "Copied",
      "card.copy.aria": "Copy short link",
      "card.del": "Delete",
      "card.toggle": "Enable/Disable",
      "card.folderAria": "Move to folder",
      "card.renameTitle": "Click to rename",
      "card.detail": "Details",
      "detail.title": "Media details",
      "detail.close": "Close",
      "detail.source": "Source",
      "detail.sourceSite": "Site link",
      "detail.sourceUpstream": "Upstream link",
      "detail.sourceRaw": "Raw link",
      "detail.type": "Type",
      "detail.typeOnedrive": "OneDrive link",
      "detail.typeNormal": "Normal link",
      "detail.format": "Format",
      "detail.formatUrl": "URL",
      "detail.formatHtml": "HTML",
      "detail.formatMarkdown": "Markdown",
      "detail.formatBBcode": "BBcode",
      "detail.copy": "Copy",
      "detail.copyId": "Click to copy ID",
      "detail.size": "Size",
      "detail.fileType": "File type",
      "detail.id": "ID",
      "detail.time": "Uploaded",
      "detail.dimension": "Dimensions",
      "confirm.title": "Delete media",
      "confirm.text": "Delete media ‘{name}’? The link will stop working immediately.",
      "confirm.cancel": "Cancel",
      "confirm.ok": "Delete",
      "op.toggleOn": "Enabled",
      "op.toggleOff": "Disabled",
      "op.del": "Deleted",
      "op.delFail": "Delete failed",
      "op.fail": "Operation failed",
      "op.saveOk": "Settings saved, cache refreshed. Please wait 5–30s for KV updates to take effect",
      "op.saveFail": "Save failed",
      "op.copyOk": "Link copied",
      "op.saved": "Saved",
      "op.moved": "Moved",
      "op.sorted": "Order updated",
      "op.updated": "Updated",
      "lightbox.open": "Open original in new tab",
      "lightbox.openSite": "Open site link in new tab",
      "lightbox.close": "Close",
      "set.title": "Settings",
      "set.save": "Save settings",
      "set.busy": "Saving…",
      "set.group.access": "Access control",
      "set.allowedCountries": "Allowed countries (ISO codes, comma separated; empty = allow all)",
      "set.allowedCountries.ph": "e.g. CN, US, JP",
      "set.allowedCountries.hint": "e.g. CN = only mainland China; also applies to cache hits.",
      "set.blockedCountries": "Blocked countries (comma separated; empty = none)",
      "set.blockedCountries.ph": "e.g. XX",
      "set.allowedIps": "Allowed IPs (comma separated; empty = all)",
      "set.allowedIps.ph": "e.g. 1.2.3.4, 203.0.113.0/24",
      "set.allowedIps.hint": "IPv6 and IPv4 supported.",
      "set.blockedIps": "Blocked IPs (comma separated; empty = none)",
      "set.blockedIps.ph": "e.g. 1.2.3.4",
      "set.allowedAsn": "Allowed ASNs (comma separated; empty = all)",
      "set.allowedAsn.ph": "e.g. 13335, 15169",
      "set.allowedAsn.hint": "13335 = Cloudflare, 15169 = Google; fine-grained allow/block by ISP.",
      "set.blockedAsn": "Blocked ASNs (comma separated; empty = none)",
      "set.blockedAsn.ph": "e.g. 4134",
      "set.group.hotlink": "Hotlink protection",
      "set.allowedReferers": "Allowed referer domains (comma separated; empty = unrestricted)",
      "set.allowedReferers.ph": "e.g. myblog.com, blog.com",
      "set.allowedReferers.hint": "When set, only requests whose Referer host matches this list (including subdomains) are allowed; requests with no Referer (direct <img>/<video> loads, typing the URL) or a non-matching Referer get 403. Add the domains of pages that embed your media; empty = no Referer check.",
      "set.requireSignature": "Enable HMAC signed links",
      "set.requireSignature.hint": "When enabled, generated links carry an expiring signature; every request must include a valid one, which can't be forged or tampered with and protects even without a Referer (strongest). Note: old, hand-built, or expired links stop working — re-copy new links.",
      "set.signatureTtl": "Signature TTL (seconds)",
      "set.group.cache": "Cache & limits",
      "set.cacheTtl": "Cache TTL (seconds, 0 = off)",
      "set.cacheTtl.hint": "Only media in “Cache proxy + DNS” mode are cached; hits return from the edge.",
      "set.odRefreshHours": "OneDrive auto-refresh interval (hours)",
      "set.odRefreshHours.hint": "The site caches OneDrive resolve results: when using site links only, the links keep working even after the OneDrive resolve chain expires, so increasing this reduces OneDrive requests. Three reference values — minimum 1 hour (keeps the resolve chain alive); if you don't use the resolve chain (site links only), recommended is the max cache time {maxHours} hours, producing almost no OneDrive requests; maximum is {maxHours} hours (= the site's max cache time). The Worker checks every 5 minutes and triggers auto-resolve (updating the timestamp) once the remaining time since the last refresh is ≤ 310s (5-minute cycle + 10s buffer).",
      "set.maxImageSize": "Max image size (bytes)",
      "set.maxAudioSize": "Max audio size (bytes)",
      "set.maxVideoSize": "Max video size (bytes)",
      "set.maxVideoSize.hint": "Cloudflare free plan caches objects up to 512MB; larger videos won't be cached.",
      "set.defaultMode": "Default link type",
      "set.defaultMode.hint": "Fallback only: applies only when a media has no explicit link type (e.g. added via API, or legacy media without this field); existing media are unaffected.",
      "set.downloadNameSource": "Saved file name source",
      "set.downloadNameSource.hint": "When saving/downloading media, use the upstream file name, or the name set on this site (upstream extension appended automatically). Do NOT include an extension in the custom name, or the file becomes “name.your_ext.upstream_ext”. Only applies in “Cache proxy + DNS” mode (DNS-only is a 302 redirect and can't control the saved name).",
      "set.downloadNameSource.upstream": "Upstream file name",
      "set.downloadNameSource.custom": "Name set on this site",
      "set.thumbSource": "Thumbnail media source",
      "set.thumbSource.hint": "Thumbnails/covers on the media grid and in the media detail view load from the upstream source, or from this site's proxied link. Only applies in “Cache proxy + DNS” mode (DNS-only is a 302 redirect and always uses upstream). Video covers always use the proxied link in cache-proxy mode because cross-origin frame capture requires CORS.",
      "set.thumbSource.upstream": "Upstream source",
      "set.thumbSource.site": "Site source",
      "set.previewSource": "Preview media source",
      "set.previewSource.hint": "Media played/shown in the lightbox loads from the upstream source, or from this site's proxied link. Only applies in “Cache proxy + DNS” mode (DNS-only is a 302 redirect and always uses upstream).",
      "set.previewSource.upstream": "Upstream source",
      "set.previewSource.site": "Site source",
      "set.group.origin": "Upstream (image host)",
      "set.allowedOrigins": "Allowed proxy domains (SSRF whitelist, comma separated)",
      "set.allowedOrigins.ph": "e.g. img.example.com, img2.example.com",
      "set.allowedOrigins.hint": "Only these domains may be fetched, preventing the Worker from being a proxy. Required; otherwise you can't add links.",
      "set.originReferer": "Upstream Referer (forwarded to origin)",
      "set.originReferer.ph": "e.g. https://img.example.com/",
      "set.originUserAgent": "Upstream User-Agent (default if empty)",
      "set.originUserAgent.ph": "leave empty",
      "set.group.rate": "Rate limit (read-only)",
      "set.rateIp": "Per-IP limit",
      "set.rateImg": "Per-image limit",
      "set.rateAv": "Per-media limit (audio/video)",
      "set.rateNote": "Note",
      "set.rateIpVal": "{limit} requests per IP / {period}s",
      "set.rateImgVal": "{limit} requests per image / {period}s",
      "set.rateAvVal": "{limit} requests per media / {period}s",
      "set.rateNoteText": "Rate limiting runs at the edge via Cloudflare Rate Limit Binding; change values in wrangler.jsonc and re-deploy. This is read-only.",
      "set.group.ui": "Interface",
      "set.thumbCache": "Thumbnail cache cap",
      "set.thumbCache.ph": "e.g. 50",
      "set.thumbCache.hint": "When the cap is exceeded, thumbnails farthest from the viewport (beyond a minimum eviction distance) are released and reload when scrolled back. Stored in this browser only.",
      "nav.groups": "Groups",
      "nav.group.go": "Jump to group {n}"
    }
  };

  function t(key, vars) {
    var s = (I18N[LANG] && I18N[LANG][key]) || I18N.zh[key] || key;
    if (vars) {
      for (var k in vars) s = s.split("{" + k + "}").join(String(vars[k]));
    }
    return s;
  }

  function $(id) { return document.getElementById(id); }
  function debounce(fn, ms) {
    var timer = null;
    return function () { var a = arguments, c = this; clearTimeout(timer); timer = setTimeout(function () { fn.apply(c, a); }, ms); };
  }

  var API_TIMEOUT = 15000; // 请求超时（ms），超时按失败处理并触发上层重试
  function api(path, opts) {
    opts = opts || {};
    var headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    if (opts.headers) {
      for (var k in opts.headers) headers[k] = opts.headers[k];
    }
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, API_TIMEOUT) : null;
    return fetch(path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (res.status === 401) { showLogin(); throw new Error(t("auth.invalid")); }
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
        return data;
      });
    }).catch(function (err) {
      // 网络中断 / 请求被中止（15s 超时、Cloudflare 偶发断连等）统一提示稍后重试，
      // 避免直接把 "signal is aborted without reason" 这类原始异常展示给用户
      var msg = err && err.message ? String(err.message) : "";
      if (
        (err && err.name === "AbortError") ||
        /signal is aborted|The operation was aborted|Failed to fetch|networkerror|aborted/i.test(msg)
      ) {
        throw new Error(t("net.retry"));
      }
      throw err;
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  var toastTimer = null;
  function toast(msg, type) {
    var el = $("toast");
    el.textContent = msg;
    el.className = "toast show" + (type ? " " + type : " info");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = "toast"; }, 2600);
  }

  function setBusy(btn, busy, text) {
    if (busy) { btn.dataset.orig = btn.textContent; btn.disabled = true; btn.textContent = text; }
    else { btn.disabled = false; if (btn.dataset.orig) btn.textContent = btn.dataset.orig; }
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
    var btn = $("login-btn");
    var tval = $("login-token").value.trim();
    setBusy(btn, true, t("login.busy"));
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tval })
    }).then(function (res) {
      if (res.ok) {
        token = tval;
        localStorage.setItem(TOKEN_KEY, tval);
        hideLogin();
        loadImages();
        loadSettings();
      } else {
        toast(t("login.err"), "error");
      }
    }).catch(function () { toast(t("net.err"), "error"); })
      .finally(function () { setBusy(btn, false); });
  });

  $("logout-in-settings").addEventListener("click", logout);

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
    if (mode === "proxy") return '<span class="badge badge-proxy">' + esc(t("mode.proxy")) + "</span>";
    return '<span class="badge badge-dns">' + esc(t("mode.redirect")) + "</span>";
  }
  function fmtTime(ts) {
    if (!ts) return "-";
    var d = new Date(ts);
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function fileNameFromUrl(u) {
    try {
      var seg = new URL(u).pathname.split("/");
      return decodeURIComponent(seg[seg.length - 1]) || "";
    } catch (e) { return ""; }
  }
  function displayName(img) {
    if (img.name) return img.name;
    var f = fileNameFromUrl(img.url);
    return f || img.id;
  }
  function guessTypeClient(u) {
    try {
      var path = new URL(u).pathname.toLowerCase();
      var ext = path.split(".").pop() || "";
      if (["jpg", "jpeg", "png", "gif", "webp", "avif", "jxl", "bmp", "svg", "ico", "tiff", "tif"].indexOf(ext) !== -1) return "image";
      if (["mp3", "wav", "ogg", "oga", "aac", "flac", "m4a", "opus", "wma", "amr", "weba"].indexOf(ext) !== -1) return "audio";
      if (["mp4", "webm", "mov", "avi", "mkv", "m4v", "ts", "3gp", "mpg", "mpeg", "wmv", "flv", "ogv", "m3u8", "mpd"].indexOf(ext) !== -1) return "video";
    } catch (e) {}
    return "";
  }
  function typeBadge(tp) {
    if (tp === "video") return '<span class="badge badge-type badge-type-video">' + esc(t("type.video")) + "</span>";
    if (tp === "audio") return '<span class="badge badge-type badge-type-audio">' + esc(t("type.audio")) + "</span>";
    if (tp === "image") return '<span class="badge badge-type badge-type-image">' + esc(t("type.image")) + "</span>";
    return "";
  }
  // 媒体源选择：site 仅对「缓存代理+DNS」模式且有网站外链的媒体生效，否则回退上游
  function mediaSrc(img, source) {
    return source === "site" && img.mode === "proxy" && img.shortUrl ? img.shortUrl : img.url;
  }
  // 视频缩略图：缓存代理模式恒走网站外链（跨域截帧必需 CORS），仅DNS按设置选择
  function videoThumbSrc(img, source) {
    return img.mode === "proxy" ? img.shortUrl || img.url : mediaSrc(img, source);
  }
  function thumbHtml(img) {
    var tp = img.type || guessTypeClient(img.url);
    if (tp === "video") {
      // 用代理链接（带 CORS）加载视频，进入视口后截帧生成封面缩略图
      var src = videoThumbSrc(img, appSettings.thumbSource);
      return '<video class="tv-thumb" data-src="' + esc(src) + '" data-alt="' + esc(img.id) + '" muted playsinline crossorigin="anonymous" preload="metadata"></video>';
    }
    if (tp === "audio")
      return '<div class="thumb-fallback"><span class="tf-icon">♪</span><span class="tf-id">' + esc(t("type.audio")) + "</span></div>";
    return '<img data-src="' + esc(mediaSrc(img, appSettings.thumbSource)) + '" class="thumb-img thumb-pending" draggable="false" alt="' + esc(img.id) + '" />';
  }
  var thumbObserver = null;
  function observeVideoThumb(v) {
    if (v.dataset.visible === "1") { startVideoThumb(v); return; }
    if ("IntersectionObserver" in window) {
      if (!thumbObserver) {
        thumbObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              startVideoThumb(en.target);
              thumbObserver.unobserve(en.target);
            }
          });
        }, { rootMargin: "400px" });
      }
      thumbObserver.observe(v);
    } else {
      startVideoThumb(v);
    }
  }
  function startVideoThumb(v) {
    v.dataset.visible = "1";
    var src = v.getAttribute("data-src");
    if (src && !v.getAttribute("src")) v.setAttribute("src", src);
  }
  function videoFallback(v) {
    if (!v.parentNode) return;
    var fb = document.createElement("div");
    fb.className = "thumb-fallback";
    fb.innerHTML = '<span class="tf-icon">▶</span><span class="tf-id">' + esc(t("type.video")) + "</span>";
    v.parentNode.replaceChild(fb, v);
    try { v.removeAttribute("src"); v.load(); } catch (e) {}
  }
  function captureVideoFrame(v) {
    if (!v.videoWidth || !v.videoHeight) { videoFallback(v); return; }
    try {
      var canvas = document.createElement("canvas");
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      canvas.getContext("2d").drawImage(v, 0, 0, canvas.width, canvas.height);
      var img = document.createElement("img");
      img.src = canvas.toDataURL("image/jpeg", 0.72);
      img.alt = v.getAttribute("data-alt") || "";
      img.loading = "lazy";
      img.draggable = false;
      v.parentNode.replaceChild(img, v);
      try { v.removeAttribute("src"); v.load(); } catch (e) {}
    } catch (e) { videoFallback(v); }
  }
  function wireVideoThumb(v) {
    var failTimer = setTimeout(function () { videoFallback(v); }, 12000);
    v.addEventListener("loadedmetadata", function () {
      var dur = v.duration;
      if (!isFinite(dur) || dur <= 0) { clearTimeout(failTimer); videoFallback(v); return; }
      // 跳到片头偏后的位置，避免首帧黑屏
      v.currentTime = Math.min(1 + dur * 0.1, 5);
    });
    v.addEventListener("seeked", function () {
      clearTimeout(failTimer);
      captureVideoFrame(v);
    });
    v.addEventListener("error", function () {
      clearTimeout(failTimer);
      videoFallback(v);
    });
    observeVideoThumb(v);
  }
  function setupVideoThumbs() {
    var vids = $("grid").querySelectorAll("video.tv-thumb");
    for (var i = 0; i < vids.length; i++) {
      if (!vids[i].dataset.hooked) { vids[i].dataset.hooked = "1"; wireVideoThumb(vids[i]); }
    }
  }

  /* 缩略图缓存：统一 IntersectionObserver 近视口才加载；
     按文件顺序排队 + 限并发加载，加载完成一个淡入显示一个（槽位固定，顺序不受网络完成先后影响） */
  var THUMB_CONCURRENCY = 5;
  var thumbQueue = [];
  var thumbInFlight = 0;
  function enqueueThumb(img) {
    if (img.dataset.loading || img.dataset.loaded) return;
    img.dataset.loading = "1";
    thumbQueue.push(img);
    pumpThumbs();
  }
  function pumpThumbs() {
    while (thumbInFlight < THUMB_CONCURRENCY && thumbQueue.length) {
      var img = thumbQueue.shift();
      thumbInFlight++;
      startThumbLoad(img);
    }
  }
  var THUMB_MAX_RETRY = 2;      // 缩略图加载失败额外重试次数
  var THUMB_RETRY_DELAY = 700;  // 重试间隔基数（ms），按次数递增
  function replaceThumbWithFallback(img) {
    var fb = document.createElement("div");
    fb.className = "thumb-fallback";
    fb.innerHTML = '<span class="tf-icon">✕</span><span class="tf-id">' + esc(t("net.err")) + "</span>";
    try { img.parentNode.replaceChild(fb, img); } catch (e) {}
  }
  function startThumbLoad(img) {
    var src = img.getAttribute("data-src");
    function done() {
      delete img.dataset.loading;
      thumbInFlight--;
      pumpThumbs();
    }
    if (!src) { done(); return; }
    var tries = parseInt(img.dataset.tries || "0", 10);
    if (tries > THUMB_MAX_RETRY) {
      // 多次失败不再重试：移除 pending 并显示失败占位，避免空白/破图常驻
      img.removeAttribute("src");
      img.classList.remove("thumb-pending");
      img.dataset.loaded = "1";
      replaceThumbWithFallback(img);
      done();
      return;
    }
    img.setAttribute("src", src);
    img.dataset.loaded = "1";
    thumbLoaded++;
    thumbObsUnobserve(img);
    scheduleCacheManage();
    var finished = false;
    function reveal() {
      if (finished) return;
      finished = true;
      img.dataset.tries = "0"; // 成功后重置失败计数
      img.classList.remove("thumb-pending");
      done();
    }
    function retryOrFail() {
      if (finished) return;
      finished = true;
      var n = tries + 1;
      if (n > THUMB_MAX_RETRY) {
        img.classList.remove("thumb-pending");
        img.removeAttribute("src");
        img.dataset.loaded = "1";
        replaceThumbWithFallback(img);
        done();
        return;
      }
      img.dataset.tries = String(n);
      img.removeAttribute("src");
      img.classList.add("thumb-pending");
      delete img.dataset.loaded;
      thumbLoaded--;
      done();
      setTimeout(function () {
        if (img.isConnected) loadThumbImg(img);
      }, THUMB_RETRY_DELAY * n);
    }
    if (img.complete) {
      // complete 时事件可能已错过：用 naturalWidth 区分成功/失败，避免把失败误判为已加载
      if (img.naturalWidth > 0) reveal();
      else retryOrFail();
      return;
    }
    img.addEventListener("load", reveal, { once: true });
    img.addEventListener("error", retryOrFail, { once: true });
  }
  function loadThumbImg(img) {
    enqueueThumb(img);
  }
  function thumbObsUnobserve(el) {
    var idx = thumbObsTargets.indexOf(el);
    if (idx !== -1) {
      thumbObsTargets.splice(idx, 1);
      if (thumbObserver2) { try { thumbObserver2.unobserve(el); } catch (e) {} }
    }
  }
  function observeThumbs() {
    if (!("IntersectionObserver" in window)) {
      var imgs = $("grid").querySelectorAll("img.thumb-img");
      for (var i = 0; i < imgs.length; i++) enqueueThumb(imgs[i]);
      return;
    }
    if (!thumbObserver2) {
      thumbObserver2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.target.tagName === "IMG") loadThumbImg(en.target);
        });
        scheduleCacheManage();
      }, { rootMargin: "600px 0px" });
    }
    var nodes = $("grid").querySelectorAll("img.thumb-img");
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i].dataset.loaded && thumbObsTargets.indexOf(nodes[i]) === -1) {
        thumbObsTargets.push(nodes[i]);
        thumbObserver2.observe(nodes[i]);
      }
    }
  }
  function scheduleCacheManage() {
    if (thumbCacheMax <= 0) return;
    if (thumbManageTimer) return;
    thumbManageTimer = setTimeout(function () { thumbManageTimer = null; manageThumbCache(); }, 300);
  }
  function manageThumbCache() {
    if (thumbLoaded <= thumbCacheMax) return;
    var vh = window.innerHeight;
    var sy = window.pageYOffset || document.documentElement.scrollTop;
    var vc = sy + vh / 2;
    var minDist = Math.max(vh * 2, 1400);
    var imgs = $("grid").querySelectorAll("img.thumb-img[data-loaded]");
    var cand = [];
    for (var i = 0; i < imgs.length; i++) {
      var r = imgs[i].getBoundingClientRect();
      var center = r.top + r.height / 2 + sy;
      var d = Math.abs(center - vc);
      if (d > minDist) cand.push({ img: imgs[i], d: d });
    }
    if (!cand.length) return;
    cand.sort(function (a, b) { return b.d - a.d; });
    for (var i = 0; i < cand.length && thumbLoaded > thumbCacheMax; i++) {
      cand[i].img.removeAttribute("src");
      cand[i].img.classList.add("thumb-pending");
      delete cand[i].img.dataset.loaded;
      delete cand[i].img.dataset.loading;
      thumbLoaded--;
      if (thumbObserver2) {
        try { thumbObserver2.observe(cand[i].img); } catch (e) {}
        thumbObsTargets.push(cand[i].img);
      }
    }
  }

  /* 拖拽排序：仅从卡片的非交互区域发起；拖拽时卡片缩小淡化跟随鼠标，实时让位 + 虚线占位预览，放下时飞回槽位 */
  var dnd = null;
  var flipTimer = null;
  function dragBlocked(el) {
    return !!el.closest("button, a, input, select, textarea, label, .zoom, .copy, .del, .detail, .tgl, .switch, .fsel, .img-name, .pen");
  }
  function gridVisibleIds() {
    var cards = $("grid").querySelectorAll(".img-card");
    var out = [];
    for (var i = 0; i < cards.length; i++) out.push(cards[i].dataset.id);
    return out;
  }
  function applyOrderToFull(fullIds, dragId, newVisible) {
    var k = newVisible.indexOf(dragId);
    var after = k >= 0 && k + 1 < newVisible.length ? newVisible[k + 1] : null;
    var rest = fullIds.filter(function (id) { return id !== dragId; });
    if (after === null) {
      // 末尾落点：把拖拽卡片放到"最后一张已渲染卡片"之后（其后尚未渲染的全序卡片保持在后），避免误插到全序末端
      var lastRendered = newVisible[newVisible.length - 1];
      var li = rest.indexOf(lastRendered);
      var target = li >= 0 && li + 1 < rest.length ? rest[li + 1] : null;
      if (target === null) return rest.concat([dragId]);
      return rest.slice(0, li + 1).concat([dragId], rest.slice(li + 1));
    }
    var ai = rest.indexOf(after);
    return rest.slice(0, ai).concat([dragId], rest.slice(ai));
  }
  function reorderImageList(images, ids) {
    var map = {};
    images.forEach(function (im) { map[im.id] = im; });
    return ids.map(function (id) { return map[id]; }).filter(Boolean);
  }
  function gridImageNodes() {
    return $("grid").querySelectorAll(".img-card");
  }
  function forceReflow() { void $("grid").offsetHeight; }
  function dropIndexAt(x, y) {
    var el = document.elementFromPoint(x, y);
    var target = el && el.closest ? el.closest(".img-card") : null;
    var nodes = gridImageNodes();
    if (!target) {
      var best = null, bestD = Infinity;
      for (var i = 0; i < nodes.length; i++) {
        var r0 = nodes[i].getBoundingClientRect();
        var dd = Math.abs(x - (r0.left + r0.width / 2)) + 1.5 * Math.abs(y - (r0.top + r0.height / 2));
        if (dd < bestD) { bestD = dd; best = nodes[i]; }
      }
      if (!best) return null;
      target = best;
    }
    var rect = target.getBoundingClientRect();
    var dx = x - (rect.left + rect.width / 2);
    var dy = y - (rect.top + rect.height / 2);
    var before = Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0;
    var idx = -1;
    for (var i = 0; i < nodes.length; i++) { if (nodes[i] === target) { idx = i; break; } }
    return before ? idx : idx + 1;
  }
  function runFlip(from) {
    var changed = [];
    from.forEach(function (r0, c) {
      var r1 = c.getBoundingClientRect();
      if (Math.round(r0.left) !== Math.round(r1.left) || Math.round(r0.top) !== Math.round(r1.top)) {
        c.style.transition = "none";
        c.style.transform = "translate(" + (r0.left - r1.left) + "px," + (r0.top - r1.top) + "px)";
        changed.push(c);
      }
    });
    if (!changed.length) return;
    forceReflow();
    for (var i = 0; i < changed.length; i++) {
      changed[i].style.transition = "transform .28s cubic-bezier(.2,.8,.2,1)";
      changed[i].style.transform = "";
    }
    if (flipTimer) window.clearTimeout(flipTimer);
    flipTimer = window.setTimeout(function () {
      for (var i = 0; i < changed.length; i++) changed[i].style.transition = "";
    }, 320);
  }
  function movePlaceholderTo(d, p) {
    var grid = $("grid");
    var nodes = gridImageNodes();
    var from = new Map();
    for (var i = 0; i < nodes.length; i++) from.set(nodes[i], nodes[i].getBoundingClientRect());
    from.set(d.ph, d.ph.getBoundingClientRect());
    var node = p < nodes.length ? nodes[p] : null;
    if (node) grid.insertBefore(d.ph, node); else grid.appendChild(d.ph);
    runFlip(from);
    d.lastIndex = p;
  }
  function finishDrag(d, commit) {
    var grid = $("grid");
    var ghost = d.card.getBoundingClientRect();
    var p = d.lastIndex;
    var nodes = gridImageNodes();
    grid.insertBefore(d.card, p < nodes.length ? nodes[p] : null);
    grid.removeChild(d.ph);
    d.card.style.position = "";
    d.card.style.left = "";
    d.card.style.top = "";
    d.card.style.width = "";
    d.card.style.height = "";
    d.card.style.margin = "";
    var slot = d.card.getBoundingClientRect();
    d.card.style.transition = "none";
    d.card.style.transform = "translate(" + (ghost.left - slot.left) + "px," + (ghost.top - slot.top) + "px) scale(.92)";
    forceReflow();
    d.card.style.transition = "transform .32s cubic-bezier(.2,.8,.2,1),opacity .32s ease,box-shadow .32s ease";
    d.card.style.transform = "";
    d.card.classList.remove("dragging");
    d.card.classList.remove("drag-pickup");
    window.setTimeout(function () { d.card.style.transition = ""; }, 350);
    if (!commit) return;
    var newVisible = gridVisibleIds();
    if (newVisible.join(",") === d.visibleBefore.join(",")) return;
    var newFull = applyOrderToFull(d.fullBefore, d.id, newVisible);
    lastImages = reorderImageList(lastImages, newFull);
    // 拖拽期间该卡信息可能已异步填充（fillCardInfo 找到 body 上的 ghost）：
    // 1) 回到网格后重新接管缩略图/视频帧懒加载观察；
    // 2) 按当前筛选补齐隐藏（拖拽中为防 ghost 消失而跳过了隐藏）
    if (d.card && d.card.querySelector("img.thumb-img, video.tv-thumb")) {
      setupVideoThumbs();
      observeThumbs();
    }
    if (!d.card.dataset.loading) {
      for (var fi = 0; fi < lastImages.length; fi++) {
        if (lastImages[fi].id === d.id) {
          if (!cardMatchesFilter(lastImages[fi])) d.card.style.display = "none";
          break;
        }
      }
    }
    api("/api/images/order", { method: "POST", body: JSON.stringify({ ids: newFull }) })
      .then(function () { /* 拖拽本身已即时反馈，成功静默，避免打扰 */ })
      .catch(function (err) {
        toast(err.message || t("op.fail"), "error");
        // 失败回滚为拖拽前顺序（本地重排 + 就地重建，不再全量重拉网络）
        lastImages = reorderImageList(lastImages, d.fullBefore);
        renderGrid(lastImages, { anchor: true });
      });
  }
  $("grid").addEventListener("pointerdown", function (e) {
    if (dnd) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    var card = e.target.closest ? e.target.closest(".img-card") : null;
    if (!card || !card.dataset.id || dragBlocked(e.target)) return;
    dnd = {
      card: card,
      id: card.dataset.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      active: false,
      ph: null,
      lastIndex: -1,
      origIndex: -1,
      visibleBefore: gridVisibleIds(),
      fullBefore: lastImages.map(function (im) { return im.id; }),
    };
  });
  window.addEventListener("pointermove", function (e) {
    if (!dnd || e.pointerId !== dnd.pointerId) return;
    dnd.lastX = e.clientX;
    dnd.lastY = e.clientY;
    if (!dnd.active) {
      if (Math.abs(e.clientX - dnd.startX) + Math.abs(e.clientY - dnd.startY) < 7) return;
      dnd.active = true;
      try { dnd.card.setPointerCapture(e.pointerId); } catch (err) {}
      var grid = $("grid");
      var imgs = gridImageNodes();
      var idx0 = -1;
      for (var i = 0; i < imgs.length; i++) { if (imgs[i] === dnd.card) { idx0 = i; break; } }
      var rect = dnd.card.getBoundingClientRect();
      dnd.card.classList.add("drag-pickup");
      dnd.card.classList.add("dragging");
      dnd.card.style.animation = "none";
      grid.removeChild(dnd.card);
      document.body.appendChild(dnd.card);
      dnd.card.style.position = "fixed";
      dnd.card.style.left = rect.left + "px";
      dnd.card.style.top = rect.top + "px";
      dnd.card.style.width = rect.width + "px";
      dnd.card.style.height = rect.height + "px";
      dnd.card.style.margin = "0";
      dnd.card.style.transform = "translate(0px,0px) scale(.92)";
      dnd.card.style.touchAction = "none";
      var ph = document.createElement("div");
      ph.className = "drop-placeholder";
      ph.style.height = rect.height + "px";
      dnd.ph = ph;
      var nodes2 = gridImageNodes();
      if (idx0 < nodes2.length) grid.insertBefore(ph, nodes2[idx0]); else grid.appendChild(ph);
      dnd.lastIndex = idx0;
      dnd.origIndex = idx0;
    } else {
      dnd.card.classList.remove("drag-pickup");
      dnd.card.style.transition = "none";
    }
    e.preventDefault();
    dnd.card.style.transform = "translate(" + (e.clientX - dnd.startX) + "px," + (e.clientY - dnd.startY) + "px) scale(.92)";
    var p = dropIndexAt(e.clientX, e.clientY);
    if (p !== null && p !== dnd.lastIndex) movePlaceholderTo(dnd, p);
  }, { passive: false });
  function endCardDrag(e) {
    if (!dnd) return;
    var d = dnd;
    dnd = null;
    if (!d.active) return;
    var x = e && e.clientX != null ? e.clientX : d.lastX;
    var y = e && e.clientY != null ? e.clientY : d.lastY;
    d.card.classList.remove("drag-pickup");
    d.card.style.touchAction = "";
    try { d.card.releasePointerCapture(d.pointerId); } catch (err) {}
    var p = dropIndexAt(x, y);
    if (p !== null && p !== d.lastIndex) movePlaceholderTo(d, p);
    finishDrag(d, p !== null && p !== d.origIndex);
  }
  window.addEventListener("pointerup", endCardDrag);
  window.addEventListener("pointercancel", endCardDrag);

  function filterImages(images) {
    var q = searchQuery.toLowerCase();
    return images.filter(function (img) {
      // 占位卡信息未就绪，暂不过滤，先以占位显示
      if (img && img._loading) return true;
      if (currentFolder === "__uncat__") { if (img.folder) return false; }
      else if (currentFolder && img.folder !== currentFolder) return false;
      if (q) {
        var hay = ((img.name || "") + " " + img.id + " " + (img.url || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }
  // 单卡过滤判断，用于增量加载后即时隐藏不匹配当前筛选的卡片
  function cardMatchesFilter(img) {
    if (img && img._loading) return true;
    if (currentFolder === "__uncat__") { if (img.folder) return false; }
    else if (currentFolder && img.folder !== currentFolder) return false;
    if (searchQuery) {
      var hay = ((img.name || "") + " " + img.id + " " + (img.url || "")).toLowerCase();
      if (hay.indexOf(searchQuery.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function folderOptions(selected) {
    var names = lastFolders.slice();
    if (addPendingFolder && names.indexOf(addPendingFolder) === -1) names.push(addPendingFolder);
    var h = '<option value="">' + esc(t("folder.uncat")) + "</option>";
    names.forEach(function (f) {
      h += '<option value="' + esc(f) + '"' + (f === selected ? " selected" : "") + ">" + esc(f) + "</option>";
    });
    h += '<option value="__new__">' + esc(t("add.folder.new")) + "</option>";
    return h;
  }

  function renderSkeleton() {
    var grid = $("grid");
    var html = "";
    for (var i = 0; i < 6; i++) html += '<div class="skeleton"></div>';
    grid.innerHTML = html;
    resetSentinel();
    thumbLoaded = 0;
    thumbObsTargets = [];
    renderGroupNav([]);
  }

  function computeGridMetrics() {
    var grid = $("grid");
    var w = grid.clientWidth || Math.max(1, document.documentElement.clientWidth - 300);
    var cols = Math.max(1, Math.round((w + 16) / (240 + 16)));
    var cardW = (w - 16 * (cols - 1)) / cols;
    gridState.cols = cols;
    gridState.rowH = cardW * 0.96 + 152;
    var rows = Math.max(2, Math.round(window.innerHeight / gridState.rowH));
    gridState.groupSize = cols * rows;
    return cols;
  }
  function thumbWrapHtml(img) {
    return '<div class="thumb">' + thumbHtml(img) +
      '<button class="zoom" data-url="' + esc(img.url) + '" data-short="' + esc(img.shortUrl || img.url) + '" data-mode="' + esc(img.mode || "") + '" data-type="' + esc(img.type || "") + '" aria-label="' + esc(t("card.preview")) + '">' + esc(t("card.preview.short")) + "</button></div>";
  }
  function cardBodyHtml(img) {
    return '<div class="card-body">' +
      '<div class="card-top">' + modeBadge(img.mode) + typeBadge(img.type || guessTypeClient(img.url)) + '<span class="muted">' + fmtTime(img.createdAt) + "</span></div>" +
      '<div class="img-name" data-id="' + esc(img.id) + '" data-name="' + esc(img.name || "") + '" title="' + esc(t("card.renameTitle")) + '"><span class="t">' + esc(displayName(img)) + '</span><span class="pen">✎</span></div>' +
      '<div class="img-id" title="' + esc(img.id) + '">' + esc(img.id) + "</div>" +
      '<div class="img-url" title="' + esc(img.shortUrl || img.url) + '">' + esc(img.shortUrl || img.url) + "</div>" +
      '<select class="fsel" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.folderAria")) + '">' + folderOptions(img.folder || "") + "</select>" +
      '<div class="actions">' +
      '<label class="switch" title="' + esc(t("card.toggle")) + '"><input type="checkbox" class="tgl" data-id="' + esc(img.id) + '"' + (img.enabled ? " checked" : "") + ' /><span></span></label>' +
      '<button class="mini detail" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.detail")) + '">' + esc(t("card.detail")) + "</button>" +
      '<button class="mini copy" data-url="' + esc(img.shortUrl || img.url) + '" aria-label="' + esc(t("card.copy.aria")) + '">' + esc(t("card.copy")) + "</button>" +
      '<button class="mini danger del" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.del")) + '">' + esc(t("card.del")) + "</button>" +
      "</div></div>";
  }
  function buildCard(img, i) {
    var card = document.createElement("div");
    card.className = "card img-card" + (img.enabled ? "" : " disabled");
    card.dataset.id = img.id;
    card.dataset.idx = i;
    card.style.animationDelay = Math.min(i * 45, 360) + "ms";
    if (img._loading) {
      // 占位卡：基本信息未就绪，保持固定尺寸与顺序，待信息到达后再填充
      card.dataset.loading = "1";
      card.innerHTML =
        '<div class="thumb thumb-loading"><span class="thumb-spin"></span></div>' +
        '<div class="card-body body-skeleton">' +
        '<div class="sk-line ht" style="width:55%"></div>' +
        '<div class="sk-line" style="width:35%"></div>' +
        '<div class="sk-line" style="width:85%"></div>' +
        '<div class="sk-line" style="width:60%"></div>' +
        '<div class="sk-line" style="width:70%"></div>' +
        "</div>";
      return card;
    }
    card.innerHTML = thumbWrapHtml(img) + cardBodyHtml(img);
    return card;
  }
  function resetSentinel() {
    if (gridSentinel) {
      if (gridObserver) { try { gridObserver.unobserve(gridSentinel); } catch (e) {} }
      if (gridSentinel.parentNode) gridSentinel.parentNode.removeChild(gridSentinel);
      gridSentinel = null;
    }
  }
  function resetGridNodes() {
    var grid = $("grid");
    var nodes = grid.querySelectorAll(".thumb-img, video.tv-thumb");
    for (var i = 0; i < nodes.length; i++) thumbObsUnobserve(nodes[i]);
    if (cardQueueTimer) { clearTimeout(cardQueueTimer); cardQueueTimer = null; }
    cardQueue = [];
    grid.innerHTML = "";
    resetSentinel();
    thumbLoaded = 0;
    thumbQueue = [];
    thumbInFlight = 0;
  }
  function enqueueCardRange(start, end, before) {
    var vis = gridState.vis;
    if (!vis || start >= end) { if (!cardQueue.length) finishCardQueue(); return; }
    for (var i = start; i < end; i++) {
      cardQueue.push({ card: buildCard(vis[i], i), before: before });
    }
    if (!cardQueueTimer) cardQueueTimer = setTimeout(pumpCardQueue, 16);
  }
  function pumpCardQueue() {
    cardQueueTimer = null;
    var grid = $("grid");
    var done = 0;
    while (cardQueue.length && done < CARD_BATCH) {
      var item = cardQueue.shift();
      if (item.before && gridSentinel) grid.insertBefore(item.card, gridSentinel);
      else grid.appendChild(item.card);
      gridState.rendered++;
      done++;
    }
    if (cardQueue.length) {
      cardQueueTimer = setTimeout(pumpCardQueue, 16);
      return;
    }
    finishCardQueue();
  }
  function finishCardQueue() {
    if (gridState.vis && gridState.rendered >= gridState.vis.length) resetSentinel();
    else { ensureSentinel(); updateSentinelHeight(); }
    setupVideoThumbs();
    observeThumbs();
    var cb = renderDoneCb;
    renderDoneCb = null;
    if (cb) cb();
  }
  // 哨兵占位撑高：把剩余未渲染卡片的高度折算为 sentinel 高度，使虚拟滚动总高度恒定，
  // 保证任意虚拟位置（分组跳转、锚点定位）都能平滑滚动到真实坐标
  function updateSentinelHeight() {
    if (!gridSentinel || !gridState.vis) return;
    var remaining = gridState.vis.length - gridState.rendered;
    if (remaining <= 0) { resetSentinel(); return; }
    gridSentinel.style.height = Math.max(0, Math.ceil(remaining / gridState.cols) * gridState.rowH) + "px";
  }
  function ensureSentinel() {
    if (gridSentinel) return;
    if (!gridState.vis || gridState.rendered >= gridState.vis.length) return;
    var grid = $("grid");
    gridSentinel = document.createElement("div");
    gridSentinel.className = "grid-sentinel";
    grid.appendChild(gridSentinel);
    updateSentinelHeight();
    if (!gridObserver) {
      gridObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) appendMore();
        });
      }, { rootMargin: "800px 0px" });
    }
    gridObserver.observe(gridSentinel);
  }
  function appendMore() {
    var vis = gridState.vis;
    if (!vis || gridState.rendered >= vis.length) { resetSentinel(); return; }
    var start = gridState.rendered + cardQueue.length;
    var end = Math.min(vis.length, start + gridState.groupSize);
    if (start >= end) { resetSentinel(); return; }
    enqueueCardRange(start, end, true);
  }
  function renderWindow(vis, start, onDone) {
    resetGridNodes();
    gridState.vis = vis;
    renderDoneCb = onDone || null;
    pendingJump = null; // 全量重建后丢弃过期的分组跳转目标
    var s0 = Math.max(0, start - 2 * gridState.cols);
    var end = Math.min(vis.length, start + gridState.groupSize + 2 * gridState.cols);
    gridState.rendered = s0;
    enqueueCardRange(s0, end, false);
  }
  // 增量渲染：确保 [0, end) 区间已渲染。不清空网格，只补渲染缺失区间（插到哨兵前），
  // 已渲染卡片全部保留、页面总高度不变（哨兵撑高），避免分组跳转时"前组卡片消失"与"先跳顶再滑动"
  function ensureRangeRendered(end) {
    var vis = gridState.vis;
    if (!vis || !vis.length) return;
    end = Math.max(0, Math.min(vis.length, end));
    if (gridState.rendered + cardQueue.length >= end) {
      flushPendingJump(); // 目标区间已渲染或已在排队中，立即跳转
      return;
    }
    if (!renderDoneCb) renderDoneCb = flushPendingJump; // 队列处理完成后执行最新跳转
    enqueueCardRange(gridState.rendered + cardQueue.length, end, true);
  }
  // 执行最新一次分组跳转的平滑滚动（多次快速点击只保留最后一次目标）
  function flushPendingJump() {
    if (!pendingJump) return;
    var j = pendingJump;
    pendingJump = null;
    smoothScrollTo(groupScrollTargetY(j.start), undefined, function () {
      updateCurrentGroup();
    });
  }
  function renderGrid(images, opts) {
    opts = opts || {};
    var vis = filterImages(images);
    $("img-count").textContent = t("list.count", { n: vis.length });
    if (!vis.length) {
      $("empty").classList.remove("hidden");
      $("empty").textContent = images.length ? t("empty.filtered") : t("empty");
      resetGridNodes();
      gridState.vis = null;
      renderGroupNav([]);
      return;
    }
    $("empty").classList.add("hidden");
    computeGridMetrics();
    var start = 0;
    if (opts.anchor) {
      var sy = window.pageYOffset || document.documentElement.scrollTop;
      if (gridState.rowH > 0) start = Math.floor(sy / gridState.rowH) * gridState.cols;
    }
    renderWindow(vis, start);
    renderGroupNav(vis);
    // 重建网格后续载未就绪的基本信息（删除/搜索/重命名/切语言等场景）
    ensureInfoLoads();
  }

  function gridDocTop() {
    var grid = $("grid");
    var r = grid.getBoundingClientRect();
    return r.top + (window.pageYOffset || document.documentElement.scrollTop);
  }
  // 自实现 RAF 缓动滚动：不依赖浏览器原生 smooth（内容高度突变时会被打断成直接跳转），
  // 速度随距离自适应，兼顾"快速"与"优雅"；onDone 在滚动结束后回调（用于同步高亮）
  var scrollAnimToken = 0;
  function smoothScrollTo(targetY, duration, onDone) {
    scrollAnimToken++; // 取消上一次未完成的滚动动画（快速连点分组时避免两个动画互相覆盖）
    var myToken = scrollAnimToken;
    var doc = document.documentElement;
    var maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
    targetY = Math.max(0, Math.min(targetY, maxY));
    var startY = window.pageYOffset || doc.scrollTop;
    var delta = targetY - startY;
    if (Math.abs(delta) < 2) {
      window.scrollTo(0, targetY);
      if (onDone) onDone();
      return;
    }
    var dur = duration || Math.min(850, Math.max(320, Math.abs(delta) * 0.45));
    var t0 = null;
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function step(ts) {
      if (myToken !== scrollAnimToken) return; // 已被更新的滚动请求取消
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      window.scrollTo(0, startY + delta * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else {
        window.scrollTo(0, targetY);
        if (onDone) onDone();
      }
    }
    requestAnimationFrame(step);
  }
  function updateGroupHighlight(g) {
    var box = $("group-nav");
    if (!box) return;
    var btns = box.querySelectorAll(".g-btn");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("active", i === g);
  }
  // 基于真实 DOM 卡片位置计算当前所在分组：取视口内第一张可见卡，
  // 用其数据源实时索引（indexOf）算出分组，避免理论 rowH 估算与实际高度的偏差
  function updateCurrentGroup() {
    if (!gridState.vis || !gridState.groupSize) return;
    var cards = $("grid").querySelectorAll(".img-card");
    var foundIdx = -1;
    var viewH = window.innerHeight;
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var r = c.getBoundingClientRect();
      if (r.bottom > 0 && r.top < viewH) { // 视口内第一张可见卡（display:none 的 rect 为 0 自动跳过）
        var im = findInLast(c.dataset.id);
        var idx = im ? gridState.vis.indexOf(im) : -1;
        if (idx < 0) idx = parseInt(c.dataset.idx, 10) || 0;
        if (idx >= 0) { foundIdx = idx; break; }
      }
    }
    var g;
    if (foundIdx >= 0) {
      g = Math.floor(foundIdx / gridState.groupSize);
    } else {
      var top = window.pageYOffset || document.documentElement.scrollTop;
      var delta = top - gridDocTop();
      g = Math.floor(delta / (gridState.rowH * (gridState.groupSize / gridState.cols)));
    }
    if (g < 0) g = 0;
    var last = Math.ceil(gridState.vis.length / gridState.groupSize) - 1;
    if (g > last) g = last;
    updateGroupHighlight(g);
  }
  function renderGroupNav(vis) {
    var box = $("group-nav");
    if (!box) return;
    if (!vis || !gridState.groupSize) { box.innerHTML = ""; return; }
    var n = Math.max(1, Math.ceil(vis.length / gridState.groupSize));
    var h = '<span class="g-title">' + esc(t("nav.groups")) + "</span>";
    for (var g = 0; g < n; g++) {
      h += '<button class="g-btn" data-g="' + g + '" aria-label="' + esc(t("nav.group.go", { n: g + 1 })) + '">' + (g + 1) + "</button>";
    }
    box.innerHTML = h;
    updateCurrentGroup(); // 重建导航按钮后恢复当前分组高亮
  }
  // 计算分组起点卡的真实文档坐标；目标卡未渲染或被隐藏时回退理论位置
  function groupScrollTargetY(idx) {
    var card = $("grid").querySelector('.img-card[data-idx="' + idx + '"]');
    if (card && card.style.display !== "none") {
      var r = card.getBoundingClientRect();
      return r.top + (window.pageYOffset || document.documentElement.scrollTop);
    }
    return gridDocTop() + (idx / gridState.cols) * gridState.rowH;
  }
  $("group-nav").addEventListener("click", function (e) {
    var b = e.target.closest(".g-btn");
    if (!b) return;
    var g = parseInt(b.getAttribute("data-g"), 10);
    var vis = gridState.vis || [];
    if (!vis.length) return;
    var start = Math.min(g * gridState.groupSize, Math.max(0, vis.length - 1));
    pendingJump = { start: start }; // 记录最新跳转目标
    updateGroupHighlight(g); // 立即切换高亮，不等滚动完成
    var end = Math.min(vis.length, start + gridState.groupSize + 2 * gridState.cols);
    // 不清空网格：增量补渲染缺失区间（已渲染卡保留、总高度恒定），渲染就位后平滑滚动到目标卡
    ensureRangeRendered(end);
  });
  window.addEventListener("scroll", function () { requestAnimationFrame(updateCurrentGroup); }, { passive: true });
  window.addEventListener("resize", debounce(function () {
    if (lastImages === null) return;
    var oldCols = gridState.cols;
    var oldSize = gridState.groupSize;
    computeGridMetrics();
    // 列数或分组大小任一变化（含仅窗口高度变化导致的 groupSize 变化）都就地刷新分组体系，
    // 无需刷新页面：重建分组导航、重算哨兵撑高、补齐当前视口缺失区间并同步高亮
    if (gridState.cols === oldCols && gridState.groupSize === oldSize) return;
    if (gridState.vis && gridState.vis.length) {
      var doc = document.documentElement;
      var maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
      var top = window.pageYOffset || doc.scrollTop;
      if (top > maxY) { top = maxY; window.scrollTo(0, maxY); }
      // groupSize 变化后当前视口覆盖的数据区间可能超出已渲染卡片，
      // 沿用分组跳转的增量补渲染方式（不清空网格，已渲染卡保留、总高度由哨兵维持）
      var start = Math.floor(top / gridState.rowH) * gridState.cols;
      var end = Math.min(gridState.vis.length, start + gridState.groupSize + 2 * gridState.cols);
      if (gridState.rendered + cardQueue.length < end) {
        enqueueCardRange(gridState.rendered + cardQueue.length, end, true);
      }
      updateSentinelHeight();
      renderGroupNav(gridState.vis); // 按新 groupSize 重建分组按钮并恢复当前分组高亮
    }
  }, 250));

  function renderFolders() {
    var bar = $("folder-bar");
    var h = '<button class="fchip' + (currentFolder === "" ? " active" : "") + '" data-f="">' + esc(t("all")) + "</button>";
    h += '<button class="fchip' + (currentFolder === "__uncat__" ? " active" : "") + '" data-f="__uncat__">' + esc(t("folder.uncat")) + "</button>";
    lastFolders.forEach(function (f) {
      h += '<span class="fchip-wrap"><button class="fchip' + (currentFolder === f ? " active" : "") + '" data-f="' + esc(f) + '">' + esc(f) + "</button>" +
        '<button class="fchip-menu" data-folder="' + esc(f) + '" aria-label="' + esc(t("folder.rename")) + '">▾</button></span>';
    });
    h += '<button id="folder-add" class="fchip add" aria-label="' + esc(t("folder.new")) + '">+</button>';
    bar.innerHTML = h;
    var sel = $("add-folder");
    if (sel) sel.innerHTML = folderOptions(addPendingFolder);
    var sel2 = $("od-folder");
    if (sel2) sel2.innerHTML = folderOptions(addPendingFolder);
  }

  function loadImages(opts) {
    var gen = ++loadGen;
    // 取消上一轮未完成的增量加载，避免过期数据回填
    infoQueue = [];
    infoActive = {};
    infoFailed = {};
    infoRetry = {};
    infoRunning = false;
    if (lastImages === null) renderSkeleton();
    api("/api/images/ids").then(function (data) {
      if (gen !== loadGen) return;
      var ids = data.ids || [];
      lastFolders = data.folders || [];
      // 先按序用占位对象建卡，锁定顺序；详情后续逐卡异步填充（renderGrid 内自动续载）
      lastImages = ids.map(function (id) { return { id: id, _loading: true }; });
      renderFolders();
      renderGrid(lastImages, opts || {});
    }).catch(function (err) {
      if (gen !== loadGen) return;
      if (lastImages === null) $("grid").innerHTML = "";
      if (err.message && err.message.indexOf("未登录") === -1) toast(err.message, "error");
    });
  }

  /* 基本信息增量加载：有界并发逐卡请求，就绪即填充对应占位卡。
     renderGrid 每次重建网格后都会调用 ensureInfoLoads，保证删除/搜索/重命名等
     操作重建占位卡后，尚未加载的卡能继续异步续载。 */
  function ensureInfoLoads() {
    if (!lastImages || !lastImages.length) return;
    var need = false;
    for (var i = 0; i < lastImages.length; i++) {
      var im = lastImages[i];
      if (im && im._loading && !infoActive[im.id] && !infoFailed[im.id]) {
        infoActive[im.id] = true;
        infoQueue.push(im.id);
        need = true;
      }
    }
    if (need && !infoRunning) {
      infoRunning = true;
      pumpInfo(loadGen);
    }
  }
  function pumpInfo(gen) {
    while (infoInFlight < INFO_CONCURRENCY && infoQueue.length) {
      if (gen !== loadGen) { infoRunning = false; return; }
      var id = infoQueue.shift();
      infoInFlight++;
      loadCardInfo(gen, id);
    }
    // 队列耗尽且无在途请求时复位，避免 infoRunning 永久占用
    if (!infoInFlight && !infoQueue.length) infoRunning = false;
  }
  function loadCardInfo(gen, id) {
    api("/api/image/detail?id=" + encodeURIComponent(id)).then(function (data) {
      if (gen === loadGen) fillCardInfo(id, data);
    }).catch(function () {
      if (gen !== loadGen) return;
      // 失败不立即放弃：错峰延迟重试，避免瞬时故障（冷启动/限流/网络抖动）导致卡片永远停在占位
      infoRetry[id] = (infoRetry[id] || 0) + 1;
      if (infoRetry[id] <= INFO_MAX_RETRY) {
        setTimeout(function () {
          if (gen !== loadGen || infoFailed[id]) return;
          delete infoActive[id];
          infoQueue.push(id);
          infoActive[id] = true;
          pumpInfo(gen);
        }, 600 * infoRetry[id]);
      } else {
        infoFailed[id] = true; // 多次失败才放弃，保留占位；下次 loadImages 重置
      }
    }).then(function () {
      delete infoActive[id];
      infoInFlight--;
      if (gen === loadGen) pumpInfo(gen);
      else infoRunning = false;
    });
  }
  // 仅填充卡片 DOM 内容（不含缩略图接管/计数），供 fillCardInfo 与拖拽结束复用。
  // skipHide=true 用于拖拽中的 ghost：此时隐藏会让卡片从鼠标下消失、拖拽中断，改由 finishDrag 收尾时隐藏
  function fillCardDom(card, img, skipHide) {
    delete card.dataset.loading;
    card.classList.add("fill-done");
    card.classList.toggle("disabled", img.enabled === false);
    var thumb = card.querySelector(".thumb");
    if (thumb) thumb.outerHTML = thumbWrapHtml(img);
    var body = card.querySelector(".card-body");
    if (body) body.outerHTML = cardBodyHtml(img);
    // 不匹配当前筛选则隐藏（占位时无法过滤，加载后再按需隐藏）
    if (!skipHide && !cardMatchesFilter(img)) card.style.display = "none";
  }
  function fillCardInfo(id, img) {
    var full = { ...img, id: id };
    // 原地更新 lastImages：占位对象替换为完整对象
    if (lastImages) {
      for (var i = 0; i < lastImages.length; i++) {
        if (lastImages[i] && lastImages[i].id === id) { lastImages[i] = full; break; }
      }
    }
    // 同步更新虚拟列表快照，避免滚动重建时仍用旧占位对象生成骨架卡
    if (gridState.vis) {
      for (var j = 0; j < gridState.vis.length; j++) {
        if (gridState.vis[j] && gridState.vis[j].id === id) { gridState.vis[j] = full; break; }
      }
    }
    // 用 document 范围查找：拖拽中的卡挂在 body 上（ghost），grid 内查不到
    var card = document.querySelector('.img-card[data-id="' + id + '"]');
    if (!card || !card.dataset.loading) return; // 不在当前渲染窗口或已填充
    // 拖拽中的卡不在此刻按筛选隐藏，避免 ghost 突然消失导致拖拽中断，由 finishDrag 收尾补齐
    fillCardDom(card, full, !!(dnd && dnd.card === card));
    setupVideoThumbs();
    observeThumbs();
    updateImgCount();
  }

  /* ===== 就地更新辅助层：写操作乐观更新 + 局部 DOM 刷新 + 失败回滚 =====
     目标：避免每次写操作后全量 loadImages/renderGrid 重建网格（缩略图/滚动位置丢失），
     改为只在受影响单卡上做 DOM 更新，并同步 lastImages / lastFolders / gridState.vis。 */

  // 查找 lastImages 中的对象（就地引用更新，避免替换导致渲染层丢失）
  function findInLast(id) {
    if (!lastImages) return null;
    for (var i = 0; i < lastImages.length; i++) {
      if (lastImages[i] && lastImages[i].id === id) return lastImages[i];
    }
    return null;
  }
  function findInVis(id) {
    if (gridState.vis) {
      for (var i = 0; i < gridState.vis.length; i++) {
        if (gridState.vis[i] && gridState.vis[i].id === id) return gridState.vis[i];
      }
    }
    return null;
  }
  // 按当前筛选决定某卡是否应可见；forceHidden 用于显式强制隐藏（如文件夹删除把卡移出）
  function cardShouldShow(img) {
    if (!img || img._loading) return true;
    return cardMatchesFilter(img);
  }
  // 就地重建单个卡 DOM（数据已变更后调用）。跳过缩略图接管，由调用方决定是否重建。
  function updateCardDom(id, opts) {
    opts = opts || {};
    var img = findInLast(id);
    var card = document.querySelector('.img-card[data-id="' + id + '"]');
    if (!img || !card) return;
    // 保持数据与快照一致
    var visObj = findInVis(id);
    var src = img;
    // 重建 .thumb 与 .card-body（如仍是占位则走占位骨架）
    if (img._loading) {
      card.dataset.loading = "1";
      card.classList.remove("fill-done");
      var phThumb = document.querySelector('.img-card[data-id="' + id + '"] .thumb');
      var phBody = document.querySelector('.img-card[data-id="' + id + '"] .card-body');
      if (phThumb) phThumb.outerHTML = '<div class="thumb thumb-loading"><span class="thumb-spin"></span></div>';
      if (phBody) phBody.outerHTML = '<div class="card-body body-skeleton">' +
        '<div class="sk-line ht" style="width:55%"></div>' +
        '<div class="sk-line" style="width:35%"></div>' +
        '<div class="sk-line" style="width:85%"></div>' +
        '<div class="sk-line" style="width:60%"></div>' +
        '<div class="sk-line" style="width:70%"></div>' +
        "</div>";
      card.classList.toggle("disabled", img.enabled === false);
    } else {
      delete card.dataset.loading;
      card.classList.add("fill-done");
      card.classList.toggle("disabled", img.enabled === false);
      var th = document.querySelector('.img-card[data-id="' + id + '"] .thumb');
      var bd = document.querySelector('.img-card[data-id="' + id + '"] .card-body');
      if (th) th.outerHTML = thumbWrapHtml(img);
      if (bd) bd.outerHTML = cardBodyHtml(img);
    }
    // 按筛选显隐（拖拽中的 ghost 延迟隐藏）
    if (dnd && dnd.card === card) {
      // 拖拽中不立即隐藏，由 finishDrag 收尾
    } else {
      var shouldShow = opts.forceHidden ? false : cardShouldShow(img);
      card.style.display = shouldShow ? "" : "none";
    }
    // 缩略图/视频帧接管与计数
    if (!img._loading) { setupVideoThumbs(); observeThumbs(); }
    updateImgCount();
  }

  // 就地移除一张卡（乐观删除/回滚添加失败），从数据源 + DOM 中移除并刷新计数
  function removeCardLocal(id) {
    lastImages = (lastImages || []).filter(function (x) { return x && x.id !== id; });
    if (gridState.vis) gridState.vis = gridState.vis.filter(function (x) { return x && x.id !== id; });
    var card = document.querySelector('.img-card[data-id="' + id + '"]');
    if (card && card.parentNode) card.parentNode.removeChild(card);
    if (!lastImages.length) {
      renderGrid(lastImages); // 空列表时回到空态（会同步 gridState.vis 与 empty 提示）
    } else {
      updateImgCount();
      renderGroupNav(gridState.vis); // 分组数可能变化，就地刷新导航
    }
  }

  // 把一张卡插入 lastImages 首位并就地渲染（乐观添加）
  function insertCardFirstLocal(im) {
    lastImages = lastImages || [];
    lastImages.unshift(im);
    // 更新当前可见快照：若命中当前筛选则前插，否则仅入数据源
    var matches = cardShouldShow(im);
    if (gridState.vis) {
      if (matches) gridState.vis.unshift(im);
      // 不匹配当前筛选时不进 vis（避免出现本不该显示的卡）
    }
    var grid = $("grid");
    if (matches) {
      // 已有已渲染卡的整体后移一位索引，保持分组导航真实坐标定位与新顺序一致
      var oldCards = grid.querySelectorAll(".img-card");
      for (var k = 0; k < oldCards.length; k++) {
        var oi = parseInt(oldCards[k].dataset.idx, 10);
        if (!isNaN(oi)) oldCards[k].dataset.idx = oi + 1;
      }
      var card = buildCard(im, 0);
      // 始终插入网格最前（顶部可见处）。不能插到 gridSentinel 前——
      // 虚拟滚动未渲染完时 sentinel 在已渲染区末尾（视口下方），新卡会掉出视口
      grid.insertBefore(card, grid.firstChild);
      gridState.rendered++;
      var emptyEl = $("empty");
      if (emptyEl) emptyEl.classList.add("hidden"); // 空态首次添加时收起空态提示
      if (!im._loading) { setupVideoThumbs(); observeThumbs(); }
      updateImgCount();
      // 新卡未进入视口时平滑滚动到网格顶部，确保用户立即看到添加结果
      var r = card.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.bottom < 0 || r.top > vh) {
        smoothScrollTo(gridDocTop(), undefined, updateCurrentGroup);
      }
    } else {
      updateImgCount();
    }
    if (!gridState.vis) gridState.vis = filterImages(lastImages); // 空态首次添加时补建 vis 快照
    renderGroupNav(gridState.vis); // 新增媒体后分组数可能变化，就地刷新导航
  }

  // 乐观添加：convert 返回真实 id 后，把临时占位卡替换为真实 id 的占位对象，
  // 并同步数据源与 DOM 卡的 data-id，随后由 ensureInfoLoads 拉取完整信息填充
  function replacePendingCard(tempId, newIm) {
    if (lastImages) {
      for (var i = 0; i < lastImages.length; i++) {
        if (lastImages[i] && lastImages[i].id === tempId) { lastImages[i] = newIm; break; }
      }
    }
    if (gridState.vis) {
      for (var j = 0; j < gridState.vis.length; j++) {
        if (gridState.vis[j] && gridState.vis[j].id === tempId) { gridState.vis[j] = newIm; break; }
      }
    }
    var card = document.querySelector('.img-card[data-id="' + tempId + '"]');
    if (card) card.dataset.id = newIm.id;
    // 真实 folder 与当前筛选不匹配时，等 fillCardInfo 填充时再隐藏
  }

  // 把保存的（浅拷贝）对象字段回写到 lastImages 对应 id，用于失败回滚
  function restoreImagesFrom(saved) {
    if (!saved) return;
    var map = {};
    saved.forEach(function (s) { if (s && s.id) map[s.id] = s; });
    lastImages.forEach(function (im) {
      if (im && map[im.id]) {
        im.folder = map[im.id].folder;
        im.name = map[im.id].name;
        im.enabled = map[im.id].enabled;
      }
    });
  }

  // 就地重建所有已渲染卡的 .card-body（保留 .thumb），用于文件夹增删改名后刷新 fsel 选项
  function refreshCardBodies() {
    var cards = $("grid").querySelectorAll(".img-card");
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var im = findInLast(c.dataset.id);
      if (!im || im._loading) continue;
      var bd = c.querySelector(".card-body");
      if (bd) bd.outerHTML = cardBodyHtml(im);
    }
    setupVideoThumbs();
    observeThumbs();
  }

  // 按当前媒体源设置重建所有已渲染卡的缩略图（含预览按钮），并重置懒加载计数后重新接管
  function refreshThumbs() {
    var cards = $("grid").querySelectorAll(".img-card");
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var im = findInLast(c.dataset.id);
      if (!im || im._loading) continue;
      var thumb = c.querySelector(".thumb");
      if (thumb) thumb.outerHTML = thumbWrapHtml(im);
    }
    thumbLoaded = 0;
    thumbQueue = [];
    thumbInFlight = 0;
    setupVideoThumbs();
    observeThumbs();
    scheduleCacheManage();
  }

  // 就地同步当前过滤（文件夹/搜索）到已渲染卡：显隐 + 更新 vis 快照 + 计数 + 空态。
  // 已渲染可见卡数量不足 vis（例如切到更大的文件夹）时重建网格补齐（本地，无网络）。
  function syncFilterInPlace() {
    var vis = filterImages(lastImages);
    gridState.vis = vis;
    var cards = $("grid").querySelectorAll(".img-card");
    var visibleCount = 0;
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var im = findInLast(c.dataset.id);
      if (!im) { c.style.display = "none"; continue; }
      if (im._loading) { c.style.display = ""; visibleCount++; continue; } // 占位保持显示
      var show = cardShouldShow(im);
      c.style.display = show ? "" : "none";
      if (show) visibleCount++;
    }
    if (!vis.length) {
      $("empty").classList.remove("hidden");
      $("empty").textContent = lastImages.length ? t("empty.filtered") : t("empty");
    } else {
      $("empty").classList.add("hidden");
    }
    $("img-count").textContent = t("list.count", { n: vis.length });
    if (visibleCount < vis.length) {
      renderGrid(lastImages); // 需展示更多卡，重建补齐（本地、快速）
      return;
    }
    ensureInfoLoads();
    renderGroupNav(gridState.vis); // 筛选变化后分组数可能变化，就地刷新导航
  }

  function updateImgCount() {
    if (!lastImages) return;
    var n = 0;
    for (var i = 0; i < lastImages.length; i++) {
      if (!lastImages[i]) continue;
      // 占位卡先计入总数（与 renderGrid 的 vis.length 口径一致），已加载卡按筛选匹配计数
      if (lastImages[i]._loading || cardMatchesFilter(lastImages[i])) n++;
    }
    $("img-count").textContent = t("list.count", { n: n });
  }

  var addPreviewTimer = null;
  // 停止并清空添加预览中的媒体：删除链接后立即停止播放（修复音视频持续播放的 bug）
  function stopPreviewMedia() {
    var box = $("preview-media");
    var nodes = box.querySelectorAll("video,audio");
    for (var i = 0; i < nodes.length; i++) { try { nodes[i].pause(); } catch (e) {} }
    box.innerHTML = "";
  }
  function setPreviewMedia(url) {
    stopPreviewMedia();
    var box = $("preview-media");
    var tp = guessTypeClient(url);
    var el;
    if (tp === "video") { el = document.createElement("video"); el.controls = true; el.muted = true; el.preload = "metadata"; }
    else if (tp === "audio") { el = document.createElement("audio"); el.controls = true; el.preload = "metadata"; }
    else { el = document.createElement("img"); el.alt = "预览"; }
    el.src = url;
    box.appendChild(el);
  }
  $("add-url").addEventListener("input", function () {
    var v = this.value.trim();
    clearTimeout(addPreviewTimer);
    if (!v) { stopPreviewMedia(); $("add-preview").classList.add("hidden"); return; }
    addPreviewTimer = setTimeout(function () {
      setPreviewMedia(v);
      var host = "";
      try { host = new URL(v).hostname; } catch (e) { host = t("add.err"); }
      lastPreviewHost = host;
      $("preview-info").textContent = t("add.src") + ": " + host;
      $("add-preview").classList.remove("hidden");
    }, 350);
  });
  function refreshPreview() {
    var pv = $("add-preview");
    if (pv.classList.contains("hidden") || !lastPreviewHost) return;
    $("preview-info").textContent = t("add.src") + ": " + lastPreviewHost;
  }

  function apiCreateFolder(name) {
    return api("/api/folder/create", { method: "POST", body: JSON.stringify({ name: name }) });
  }

  // 文件夹下拉「新建文件夹…」：两个表单（普通/OneDrive）共用
  function onFolderSelectChange(sel) {
    if (sel.value === "__new__") {
      var name = (window.prompt(t("add.folder.newPh")) || "").trim();
      if (!name) { sel.value = addPendingFolder; return; }
      apiCreateFolder(name).then(function () {
        addPendingFolder = name;
        sel.value = name;
        toast(t("folder.createOk"), "success");
      }).catch(function (err) { toast(err.message, "error"); });
    }
  }
  $("add-folder").addEventListener("change", function () { onFolderSelectChange(this); });
  $("od-folder").addEventListener("change", function () { onFolderSelectChange(this); });

  // ===== OneDrive 添加模式 =====
  var addMode = "normal"; // "normal" | "onedrive"
  var odState = null; // 当前 OneDrive 解析结果 { isFolder, name, size, childCount }

  function switchAddMode(mode) {
    if (mode !== "normal" && mode !== "onedrive") return;
    addMode = mode;
    $("add-mode-normal").classList.toggle("active", mode === "normal");
    $("add-mode-onedrive").classList.toggle("active", mode === "onedrive");
    $("add-form-normal").classList.toggle("hidden", mode !== "normal");
    $("add-form-onedrive").classList.toggle("hidden", mode !== "onedrive");
    if (mode === "onedrive") {
      // 进入 OneDrive 模式默认选中「缓存代理+DNS」（直链时效问题由 Worker 实时跟随 302 规避）
      var proxy = document.querySelector('input[name="od-mode"][value="proxy"]');
      if (proxy) proxy.checked = true;
      setTimeout(function () { $("od-url").focus(); }, 60);
    }
  }
  $("add-mode-normal").addEventListener("click", function () { switchAddMode("normal"); });
  $("add-mode-onedrive").addEventListener("click", function () { switchAddMode("onedrive"); });

  function odSelectedMode() {
    var el = document.querySelector('input[name="od-mode"]:checked');
    return el ? el.value : "proxy";
  }

  function renderOdInfo(data) {
    var box = $("od-info");
    box.innerHTML = "";
    var icon = document.createElement("span");
    icon.className = "od-icon";
    var nameEl = document.createElement("span");
    nameEl.className = "od-name";
    nameEl.textContent = data.name || "-";
    nameEl.title = data.name || "";
    var badge = document.createElement("span");
    badge.className = "od-badge";
    badge.textContent = data.isFolder ? t("add.od.folder", { n: data.childCount }) : fmtSize(data.size);
    box.appendChild(icon);
    box.appendChild(nameEl);
    box.appendChild(badge);
    box.classList.remove("hidden");
  }

  // 渲染文件夹第一层子项勾选列表（后端 resolve 返回 items 时可用）
  function renderOdItems(data) {
    var box = $("od-items");
    box.innerHTML = "";
    if (!data || !data.isFolder || !Array.isArray(data.items) || !data.items.length) {
      box.classList.add("hidden");
      return;
    }
    var head = document.createElement("div");
    head.className = "od-items-head";
    var allLabel = document.createElement("label");
    var allCheck = document.createElement("input");
    allCheck.type = "checkbox";
    allCheck.checked = true;
    allCheck.className = "od-items-all";
    var allText = document.createElement("span");
    allText.textContent = t("add.od.selectAll");
    allLabel.appendChild(allCheck);
    allLabel.appendChild(allText);
    var count = document.createElement("span");
    count.className = "od-items-count";
    head.appendChild(allLabel);
    head.appendChild(count);
    box.appendChild(head);

    var list = document.createElement("div");
    list.className = "od-items-list";
    var items = data.items;
    for (var i = 0; i < items.length; i++) {
      (function (idx) {
        var it = items[idx];
        var label = document.createElement("label");
        var ck = document.createElement("input");
        ck.type = "checkbox";
        ck.checked = true;
        ck.dataset.odItem = "1";
        ck.dataset.idx = String(idx);
        var icon = document.createElement("span");
        icon.className = "od-item-icon";
        icon.textContent = it.isFolder ? "📁" : "📄";
        var nameEl = document.createElement("span");
        nameEl.className = "od-item-name";
        nameEl.textContent = it.name || "-";
        nameEl.title = it.name || "";
        var badge = document.createElement("span");
        badge.className = "od-item-badge";
        badge.textContent = it.isFolder
          ? t("add.od.folder", { n: it.childCount })
          : fmtSize(it.size);
        label.appendChild(ck);
        label.appendChild(icon);
        label.appendChild(nameEl);
        label.appendChild(badge);
        ck.addEventListener("change", updateOdItemsUi);
        list.appendChild(label);
      })(i);
    }
    box.appendChild(list);
    box.classList.remove("hidden");

    // 计数 / 全选 / 按钮文案联动
    var refresh = function () {
      var cks = box.querySelectorAll("input[data-od-item]");
      var checked = box.querySelectorAll("input[data-od-item]:checked");
      count.textContent = checked.length + " / " + cks.length;
      allCheck.checked = checked.length === cks.length && cks.length > 0;
      var btn = $("od-import-btn");
      if (!cks.length || !checked.length) {
        btn.disabled = true;
        btn.textContent = t("add.od.importEmpty");
      } else if (checked.length === cks.length) {
        btn.disabled = false;
        btn.textContent = t("add.od.import");
      } else {
        btn.disabled = false;
        btn.textContent = t("add.od.importSelected", { n: checked.length });
      }
    };
    allCheck.addEventListener("change", function () {
      var cks = box.querySelectorAll("input[data-od-item]");
      for (var k = 0; k < cks.length; k++) cks[k].checked = allCheck.checked;
      refresh();
    });
    refresh();
  }

  // 子项勾选变化时刷新列表头计数与按钮文案
  function updateOdItemsUi() {
    var box = $("od-items");
    if (!box || box.classList.contains("hidden")) return;
    var cks = box.querySelectorAll("input[data-od-item]");
    var checked = box.querySelectorAll("input[data-od-item]:checked");
    var allCheck = box.querySelector(".od-items-all");
    if (allCheck) allCheck.checked = checked.length === cks.length && cks.length > 0;
    var count = box.querySelector(".od-items-count");
    if (count) count.textContent = checked.length + " / " + cks.length;
    var btn = $("od-import-btn");
    if (!cks.length || !checked.length) {
      btn.disabled = true;
      btn.textContent = t("add.od.importEmpty");
    } else if (checked.length === cks.length) {
      btn.disabled = false;
      btn.textContent = t("add.od.import");
    } else {
      btn.disabled = false;
      btn.textContent = t("add.od.importSelected", { n: checked.length });
    }
  }

  function odResetForm(clearUrl) {
    odState = null;
    $("od-info").classList.add("hidden");
    $("od-info").innerHTML = "";
    $("od-items").classList.add("hidden");
    $("od-items").innerHTML = "";
    $("od-import-btn").disabled = false;
    $("od-add-btn").classList.add("hidden");
    $("od-import-btn").classList.add("hidden");
    $("od-name").disabled = false;
    if (clearUrl) {
      $("od-url").value = "";
      $("od-name").value = "";
      $("od-url").focus();
    }
  }
  // OneDrive 错误提示：密码保护 / 非公开共享 / 其他
  function odErrorToast(err) {
    if (err.message === "password_required") toast(t("add.od.pass"), "error");
    else if (err.message === "unauthenticated") toast(t("add.od.unauth"), "error");
    else toast(err.message || t("add.od.fail"), "error");
  }

  function odResolve() {
    var raw = $("od-url").value.trim();
    if (!raw) { toast(t("add.err.empty"), "error"); $("od-url").focus(); return; }
    var btn = $("od-resolve-btn");
    setBusy(btn, true, t("add.od.resolving"));
    api("/api/onedrive/resolve", { method: "POST", body: JSON.stringify({ url: raw }) })
      .then(function (data) {
        odState = data;
        renderOdInfo(data);
        if (data.isFolder) {
          $("od-name").disabled = true;
          $("od-name").value = "";
          $("od-add-btn").classList.add("hidden");
          $("od-import-btn").classList.remove("hidden");
          renderOdItems(data);
          toast(t("add.od.folderReady", { n: data.childCount }), "info");
        } else {
          $("od-name").disabled = false;
          // 默认名去掉扩展名，遵守「自定义名请勿带后缀」规则；
          // 下载时 custom 模式会自动补回 OneDrive 原始扩展名（后端存有 odSrcName）
          var baseName = data.name || "";
          var di = baseName.lastIndexOf(".");
          $("od-name").value =
            di > 0 && di < baseName.length - 1 ? baseName.slice(0, di) : baseName;
          $("od-import-btn").classList.add("hidden");
          $("od-add-btn").classList.remove("hidden");
          toast(t("add.od.ready"), "success");
        }
      })
      .catch(function (err) {
        odResetForm(false);
        odErrorToast(err);
      })
      .finally(function () { setBusy(btn, false); });
  }
  $("od-resolve-btn").addEventListener("click", odResolve);
  $("od-url").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); odResolve(); }
  });

  // 单文件 OneDrive 添加
  function odAdd() {
    if (!odState || odState.isFolder) return;
    var raw = $("od-url").value.trim();
    var mode = odSelectedMode();
    var name = $("od-name").value.trim();
    var folder = $("od-folder").value;
    if (folder === "__new__") folder = addPendingFolder;
    var btn = $("od-add-btn");
    setBusy(btn, true, t("add.busy"));
    var tempId = "pending-od-" + Date.now();
    insertCardFirstLocal({ id: tempId, _loading: true, _pendingAdd: true });
    api("/api/onedrive/import", { method: "POST", body: JSON.stringify({ url: raw, mode: mode, name: name, folder: folder }) })
      .then(function (data) {
        if (folder && lastFolders.indexOf(folder) === -1) { lastFolders.push(folder); renderFolders(); }
        replacePendingCard(tempId, { id: data.id, _loading: true });
        ensureInfoLoads();
        toast(t("add.ok"), "success");
        try { navigator.clipboard.writeText(data.url); } catch (e) {}
        odResetForm(true);
      })
      .catch(function (err) {
        removeCardLocal(tempId);
        odErrorToast(err);
      })
      .finally(function () { setBusy(btn, false); });
  }
  $("od-add-btn").addEventListener("click", odAdd);

  // 文件夹批量导入（支持只导入勾选的子项）
  function odImport() {
    if (!odState || !odState.isFolder) return;
    var raw = $("od-url").value.trim();
    var mode = odSelectedMode();
    var folder = $("od-folder").value;
    if (folder === "__new__") folder = addPendingFolder;
    var btn = $("od-import-btn");
    // 收集勾选的子项：仅当有选择列表且未全选时传给后端做部分导入；
    // 全选时走"全部导入"（后端完整递归，覆盖可能超出列表上限的深层文件）
    var selItems = null;
    var box = $("od-items");
    var hasSelList = box && !box.classList.contains("hidden") && Array.isArray(odState.items) && odState.items.length;
    if (hasSelList) {
      var cks = box.querySelectorAll("input[data-od-item]");
      var checked = box.querySelectorAll("input[data-od-item]:checked");
      if (checked.length < cks.length) {
        selItems = [];
        for (var i = 0; i < checked.length; i++) {
          var it = odState.items[+checked[i].dataset.idx];
          if (it) selItems.push({ name: it.name, itemId: it.itemId, relPath: it.relPath, isFolder: it.isFolder });
        }
        if (!selItems.length) { toast(t("add.od.importEmpty"), "error"); return; }
      }
    }
    var total = selItems ? selItems.length : (odState.childCount || 0);
    setBusy(btn, true, t("add.od.importing", { n: total }));
    var body = { url: raw, mode: mode, folder: folder };
    if (selItems) body.items = selItems;
    api("/api/onedrive/import", { method: "POST", body: JSON.stringify(body) })
      .then(function (data) {
        if (folder && lastFolders.indexOf(folder) === -1) { lastFolders.push(folder); renderFolders(); }
        var items = data.items || [];
        var okCount = 0;
        var failNames = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].ok) okCount++;
          else failNames.push(items[i].name);
        }
        // 后端按遍历顺序逐个 unshift 到 order 首位，前端按返回顺序逆序前插到 lastImages，
        // 保证列表顺序与后端一致（最后一个导入项显示在最前）
        lastImages = lastImages || [];
        for (var j = items.length - 1; j >= 0; j--) {
          if (items[j].ok) lastImages.unshift({ id: items[j].id, _loading: true });
        }
        renderGrid(lastImages, { anchor: true });
        ensureInfoLoads();
        if (failNames.length) toast(t("add.od.importDoneFail", { n: okCount, m: failNames.length }), "error");
        else toast(t("add.od.importDoneOk", { n: okCount }), "success");
        odResetForm(true);
      })
      .catch(function (err) {
        odErrorToast(err);
      })
      .finally(function () { setBusy(btn, false); });
  }
  $("od-import-btn").addEventListener("click", odImport);

  // ===== 普通链接批量添加（集成在普通链接 Tab 内） =====
  var addBatchMode = false; // 批量开关状态：false=单条添加，true=批量添加

  // 从批量输入框读取有效链接列表（按行拆分、trim、过滤空行）
  function batchUrlList() {
    var v = $("add-batch-area").value || "";
    var out = [];
    var lines = v.split(/\\r?\\n/);
    for (var i = 0; i < lines.length; i++) {
      var s = lines[i].trim();
      if (s) out.push(s);
    }
    return out;
  }

  // 添加按钮文字：单条固定「添加」，批量模式实时显示「批量添加（N）」
  function updateAddBtnLabel() {
    var btn = $("add-btn");
    if (addBatchMode) {
      var n = batchUrlList().length;
      btn.textContent = n ? t("add.batch.btn", { n: n }) : t("add.batch.btnEmpty");
    } else {
      btn.textContent = t("add.btn");
    }
  }

  // 切换批量模式：输入框变 textarea、隐藏名称框与预览区（保留文件夹与模式选择）
  function setBatchMode(on) {
    addBatchMode = on;
    $("add-batch-toggle").checked = on;
    $("add-url").classList.toggle("hidden", on);
    $("add-batch-area").classList.toggle("hidden", !on);
    $("add-url").parentNode.classList.toggle("batch-on", on);
    $("add-name-row").classList.toggle("batch-name-hidden", on);
    if (on) {
      stopPreviewMedia();
      $("add-preview").classList.add("hidden");
    }
    updateAddBtnLabel();
    if (on) $("add-batch-area").focus();
  }
  $("add-batch-toggle").addEventListener("change", function () {
    setBatchMode(this.checked);
  });
  $("add-batch-area").addEventListener("input", updateAddBtnLabel);

  // 渲染失败明细（URL + 原因 + 单条重试按钮）
  function renderBatchFail(failList) {
    var box = $("add-batch-result");
    var h = '<div class="br-summary">' + esc(t("add.batch.failTitle")) + '</div><ul class="br-fail">';
    for (var i = 0; i < failList.length; i++) {
      var it = failList[i];
      h += '<li data-url="' + esc(it.url) + '">' +
        '<span class="br-url" title="' + esc(it.url) + '">' + esc(it.url) + "</span>" +
        '<span class="br-err">' + esc(it.error || "") + "</span>" +
        '<button type="button" class="br-retry">' + esc(t("add.batch.retry")) + "</button></li>";
    }
    h += "</ul>";
    box.innerHTML = h;
    box.classList.remove("hidden");
    var btns = box.querySelectorAll(".br-retry");
    for (var k = 0; k < btns.length; k++) {
      btns[k].addEventListener("click", function () { retryBatchUrl(this); });
    }
  }
  function hideBatchFail() {
    var box = $("add-batch-result");
    box.classList.add("hidden");
    box.innerHTML = "";
  }

  // 失败项单条重试：复用现有 /api/convert，成功后插入卡片并从失败列表移除
  function retryBatchUrl(btn) {
    var li = btn.closest("li");
    if (!li) return;
    var url = li.getAttribute("data-url") || "";
    if (!url) return;
    var modeEl = document.querySelector('input[name="mode"]:checked');
    var mode = modeEl ? modeEl.value : "proxy";
    var folder = $("add-folder").value;
    if (folder === "__new__") folder = addPendingFolder;
    setBusy(btn, true, t("add.batch.retrying"));
    api("/api/convert", { method: "POST", body: JSON.stringify({ url: url, name: "", mode: mode, folder: folder }) })
      .then(function (data) {
        if (folder && lastFolders.indexOf(folder) === -1) { lastFolders.push(folder); renderFolders(); }
        lastImages = lastImages || [];
        lastImages.unshift({ id: data.id, _loading: true });
        renderGrid(lastImages, { anchor: true });
        ensureInfoLoads();
        li.parentNode.removeChild(li);
        if (!$("add-batch-result").querySelectorAll("li").length) hideBatchFail();
        toast(t("add.batch.retryDone"), "success");
      })
      .catch(function (err) { toast(err.message || t("add.err"), "error"); })
      .finally(function () { setBusy(btn, false); });
  }

  // 批量添加：POST /api/convert/batch，成功项逆序前插 lastImages，失败项展开明细
  function batchAdd() {
    var urls = batchUrlList();
    if (!urls.length) { toast(t("add.err.empty"), "error"); $("add-batch-area").focus(); return; }
    var modeEl = document.querySelector('input[name="mode"]:checked');
    var mode = modeEl ? modeEl.value : "proxy";
    var folder = $("add-folder").value;
    if (folder === "__new__") folder = addPendingFolder;
    var btn = $("add-btn");
    setBusy(btn, true, t("add.batch.adding", { n: urls.length }));
    api("/api/convert/batch", { method: "POST", body: JSON.stringify({ urls: urls, mode: mode, folder: folder }) })
      .then(function (data) {
        if (folder && lastFolders.indexOf(folder) === -1) { lastFolders.push(folder); renderFolders(); }
        var items = data.items || [];
        var okCount = 0;
        var failList = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].ok) okCount++;
          else failList.push({ url: items[i].url, error: items[i].error || "" });
        }
        // 后端按遍历顺序逐个 unshift 到 order 首位，前端逆序前插 lastImages，
        // 保证列表顺序与后端一致（最后一个成功项显示在最前）
        lastImages = lastImages || [];
        for (var j = items.length - 1; j >= 0; j--) {
          if (items[j].ok) lastImages.unshift({ id: items[j].id, _loading: true });
        }
        renderGrid(lastImages, { anchor: true });
        ensureInfoLoads();
        if (failList.length) {
          toast(t("add.batch.doneFail", { n: okCount, m: failList.length }), "error");
          renderBatchFail(failList);
        } else {
          toast(t("add.batch.doneOk", { n: okCount }), "success");
          hideBatchFail();
        }
        // 清空输入，保持批量开关状态
        $("add-batch-area").value = "";
        updateAddBtnLabel();
      })
      .catch(function (err) {
        toast(err.message || t("add.err"), "error");
      })
      .finally(function () {
        setBusy(btn, false);
        updateAddBtnLabel();
      });
  }

  function addImage() {
    var url = $("add-url").value.trim();
    var modeEl = document.querySelector('input[name="mode"]:checked');
    var mode = modeEl ? modeEl.value : "proxy";
    if (!url) { toast(t("add.err.empty"), "error"); $("add-url").focus(); return; }
    var name = $("add-name").value.trim();
    var folder = $("add-folder").value;
    if (folder === "__new__") folder = addPendingFolder;
    var btn = $("add-btn");
    setBusy(btn, true, t("add.busy"));
    // 乐观：先插入一个临时占位卡到列表首位，立即反映"正在添加"，
    // 无需等待 convert 返回；请求成功后替换为真实卡，失败则移除
    var tempId = "pending-" + Date.now();
    insertCardFirstLocal({ id: tempId, _loading: true, _pendingAdd: true });
    api("/api/convert", { method: "POST", body: JSON.stringify({ url: url, mode: mode, name: name, folder: folder }) })
      .then(function (data) {
        var realId = data.id;
        // 若本次添加到的新文件夹不在本地文件夹栏中，补入
        if (folder && lastFolders.indexOf(folder) === -1) {
          lastFolders.push(folder);
          renderFolders();
        }
        // 临时占位卡替换为真实 id 占位，随后 ensureInfoLoads 拉取完整信息填充
        replacePendingCard(tempId, { id: realId, _loading: true });
        ensureInfoLoads();
        toast(t("add.ok"), "success");
        clearTimeout(addPreviewTimer);
        $("add-url").value = "";
        $("add-name").value = "";
        stopPreviewMedia();
        $("add-preview").classList.add("hidden");
        try { navigator.clipboard.writeText(data.url); } catch (e) {}
        $("add-url").focus();
      })
      .catch(function (err) {
        // 失败：移除临时占位卡并回滚
        removeCardLocal(tempId);
        toast(err.message || t("add.err"), "error");
      })
      .finally(function () {
        setBusy(btn, false);
        updateAddBtnLabel(); // 请求期间可能切换了批量开关，恢复后按当前模式刷新按钮文字
      });
  }
  function onAddClick() {
    if (addBatchMode) batchAdd();
    else addImage();
  }
  $("add-btn").addEventListener("click", onAddClick);
  $("add-url").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); addImage(); }
  });

  function currentImgFolder(id) {
    var im = (lastImages || []).filter(function (x) { return x.id === id; })[0];
    return im ? (im.folder || "") : "";
  }
  // 把后端返回的完整单卡数据合并进本地数据源（lastImages + gridState.vis），就地刷新，不做全量重拉
  function mergeServerImage(data, id) {
    var d = data && data.image;
    if (!d || !id) return;
    var o = findInLast(id);
    if (o) { for (var k in d) { if (k !== "id") o[k] = d[k]; } }
    var v = findInVis(id);
    if (v) { for (var k2 in d) { if (k2 !== "id") v[k2] = d[k2]; } }
  }

  function setFolder(id, folder, onDone) {
    var im = findInLast(id);
    var prevFolder = im ? (im.folder || "") : "";
    // 乐观：立即更新数据与单卡 DOM（fsel 选项 + 当前文件夹过滤显隐），无需等待请求
    if (im) im.folder = folder;
    var v0 = findInVis(id);
    if (v0) v0.folder = folder;
    updateCardDom(id);
    api("/api/image/update", { method: "POST", body: JSON.stringify({ id: id, folder: folder }) })
      .then(function (data) {
        mergeServerImage(data, id);
        toast(t("op.moved"), "success");
        if (onDone) onDone(true);
      })
      .catch(function (err) {
        // 失败回滚 folder
        if (im) im.folder = prevFolder;
        var v1 = findInVis(id);
        if (v1) v1.folder = prevFolder;
        updateCardDom(id);
        toast(err.message || t("op.fail"), "error");
        if (onDone) onDone(false);
      });
  }

  function enterNameEdit(span, onSaved) {
    if (span.querySelector("input")) return;
    var id = span.getAttribute("data-id");
    var prev = span.getAttribute("data-name") || "";
    var input = document.createElement("input");
    input.className = "name-edit";
    input.value = prev;
    span.textContent = "";
    span.appendChild(input);
    input.focus();
    input.select();
    var finished = false;
    function finish(save) {
      if (finished) return;
      finished = true;
      var v = input.value.trim();
      if (save && v !== prev) {
        var im = findInLast(id);
        var prevName = im ? (im.name || "") : "";
        // 乐观：立即更新数据与单卡 DOM（编辑已结束，就地重建安全）
        if (im) im.name = v;
        var v0 = findInVis(id);
        if (v0) v0.name = v;
        updateCardDom(id);
        api("/api/image/update", { method: "POST", body: JSON.stringify({ id: id, name: v }) })
          .then(function (data) {
            mergeServerImage(data, id);
            if (onSaved) onSaved(id);
            toast(t("op.saved"), "success");
          })
          .catch(function (err) {
            // 失败回滚 name
            if (im) im.name = prevName;
            var v1 = findInVis(id);
            if (v1) v1.name = prevName;
            updateCardDom(id);
            toast(err.message || t("op.fail"), "error");
          });
      } else {
        // 取消编辑：就地重建该卡，恢复为数据源当前值（不触发全量重拉）
        updateCardDom(id);
        if (onSaved) onSaved(id);
      }
    }
    input.addEventListener("keydown", function (e) {
      e.stopPropagation();
      if (e.key === "Enter") finish(true);
      else if (e.key === "Escape") finish(false);
    });
    input.addEventListener("blur", function () { finish(true); });
  }

  $("grid").addEventListener("click", function (e) {
    var el = e.target;
    if (el.classList.contains("detail")) {
      var did = el.getAttribute("data-id");
      var dimg = (lastImages || []).filter(function (x) { return x.id === did; })[0];
      if (dimg) openDetailModal(dimg);
    } else if (el.classList.contains("copy")) {
      var url = el.getAttribute("data-url");
      function done() {
        el.textContent = t("card.copy.ok");
        el.classList.add("copied");
        setTimeout(function () { el.textContent = t("card.copy"); el.classList.remove("copied"); }, 1300);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url); done(); });
      } else { fallbackCopy(url); done(); }
    } else if (el.classList.contains("del")) {
      var id = el.getAttribute("data-id");
      var im = (lastImages || []).filter(function (x) { return x.id === id; })[0];
      var nm = im ? displayName(im) : id;
      pendingDelete = id;
      $("confirm-text").textContent = t("confirm.text", { name: nm });
      $("confirm-modal").classList.remove("hidden");
      $("confirm-ok").focus();
    } else if (el.classList.contains("zoom")) {
      openLightbox({
        url: el.getAttribute("data-url"),
        shortUrl: el.getAttribute("data-short"),
        mode: el.getAttribute("data-mode"),
        type: el.getAttribute("data-type")
      });
    } else if (el.closest(".img-name")) {
      enterNameEdit(el.closest(".img-name"));
    }
  });

  $("grid").addEventListener("error", function (e) {
    var el = e.target;
    if (el.tagName === "IMG" && el.closest(".thumb")) {
      var fb = document.createElement("div");
      fb.className = "thumb-fallback";
      fb.innerHTML = '<span class="tf-icon">⚠</span><span class="tf-id">' + esc(el.getAttribute("alt") || "…") + "</span>";
      if (el.parentNode) el.parentNode.replaceChild(fb, el);
    }
  }, true);

  $("grid").addEventListener("change", function (e) {
    var el = e.target;
    if (el.classList.contains("tgl")) {
      var id = el.getAttribute("data-id");
      var enabled = el.checked;
      // checkbox 变化本身已即时反映；同步数据源，失败时回滚
      var im = findInLast(id);
      var prev = im ? im.enabled !== false : true;
      if (im) im.enabled = enabled;
      var v0 = findInVis(id);
      if (v0) v0.enabled = enabled;
      var card0 = document.querySelector('.img-card[data-id="' + id + '"]');
      if (card0) card0.classList.toggle("disabled", !enabled);
      api("/api/image/toggle", { method: "POST", body: JSON.stringify({ id: id, enabled: enabled }) })
        .then(function () { toast(enabled ? t("op.toggleOn") : t("op.toggleOff")); })
        .catch(function (err) {
          // 失败回滚
          if (im) im.enabled = prev;
          var v1 = findInVis(id);
          if (v1) v1.enabled = prev;
          var card1 = document.querySelector('.img-card[data-id="' + id + '"]');
          var tgl = card1 ? card1.querySelector(".tgl") : null;
          if (tgl) tgl.checked = prev;
          if (card1) card1.classList.toggle("disabled", !prev);
          toast(err.message || t("op.fail"), "error");
        });
    } else if (el.classList.contains("fsel")) {
      var id2 = el.getAttribute("data-id");
      var val = el.value;
      if (val === "__new__") {
        var name = (window.prompt(t("add.folder.newPh")) || "").trim();
        if (!name) { el.value = currentImgFolder(id2); return; }
        apiCreateFolder(name).then(function () { setFolder(id2, name); })
          .catch(function (err) { toast(err.message, "error"); });
      } else {
        setFolder(id2, val);
      }
    }
  });

  $("search").addEventListener("input", function () {
    searchQuery = this.value.trim();
    $("search-clear").classList.toggle("hidden", !searchQuery);
    if (lastImages !== null) { window.scrollTo(0, 0); renderGrid(lastImages); }
  });
  $("search-clear").addEventListener("click", function () {
    searchQuery = "";
    $("search").value = "";
    this.classList.add("hidden");
    if (lastImages !== null) { window.scrollTo(0, 0); renderGrid(lastImages); }
    $("search").focus();
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

  var pendingDelete = null;
  $("confirm-cancel").addEventListener("click", function () { closeConfirm(); });
  $("confirm-ok").addEventListener("click", function () {
    var id = pendingDelete;
    closeConfirm();
    if (!id) return;
    // 乐观删除：确认后立即从本地数据源与 DOM 移除，无需等待请求；KV 最终一致由后端保证
    removeCardLocal(id);
    toast(t("op.del"));
    api("/api/image/delete", { method: "POST", body: JSON.stringify({ id: id }) })
      .catch(function (err) {
        // 删除失败（极少）：全量重拉恢复真实状态，保证数据一致性
        toast(err.message || t("op.delFail"), "error");
        loadImages({ anchor: true });
      });
  });
  $("confirm-modal").addEventListener("click", function (e) { if (e.target === this) closeConfirm(); });
  function closeConfirm() { pendingDelete = null; $("confirm-modal").classList.add("hidden"); }

  function openLightbox(info) {
    var url = info.url;
    var siteUrl = info.shortUrl || url;
    var box = $("lightbox-media");
    box.innerHTML = "";
    var el;
    if (info.type === "video") { el = document.createElement("video"); el.controls = true; }
    else if (info.type === "audio") { el = document.createElement("audio"); el.controls = true; }
    else { el = document.createElement("img"); el.alt = ""; }
    // 预览媒体源：site 仅对缓存代理模式生效，否则回退上游
    el.src = mediaSrc(info, appSettings.previewSource);
    box.appendChild(el);
    $("lightbox-open").href = url; // 「在新标签打开原图」始终指向上游原始链接
    $("lightbox-open-site").href = siteUrl; // 「在新标签打开网站外链」
    $("lightbox").classList.remove("hidden");
  }
  function closeLightbox() {
    $("lightbox").classList.add("hidden");
    $("lightbox-media").innerHTML = "";
  }
  $("lightbox").addEventListener("click", function (e) {
    if (e.target === $("lightbox") || e.target.classList.contains("close")) closeLightbox();
  });
  function closeDetailModal() {
    $("detail-modal").classList.add("hidden");
    $("detail-thumb").innerHTML = "";
    detailModalImg = null;
  }
  $("detail-modal").addEventListener("click", function (e) {
    if (e.target === $("detail-modal") || e.target.classList.contains("detail-close")) closeDetailModal();
  });

  // ---- 详情弹窗：左栏（大缩略图 + 信息 overlay + 元数据探测）----
  function fmtSize(n) {
    if (!n || n < 0) return "-";
    if (n < 1024) return n + " B";
    if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
    if (n < 1073741824) return (n / 1048576).toFixed(1) + " MB";
    return (n / 1073741824).toFixed(2) + " GB";
  }
  function setDetailDim(w, h) {
    if (w && h) $("detail-dim").textContent = w + "×" + h;
  }
  function renderDetailName() {
    var el = $("detail-name");
    if (!detailModalImg) return;
    var nm = displayName(detailModalImg);
    el.setAttribute("data-id", detailModalImg.id);
    el.setAttribute("data-name", detailModalImg.name || "");
    el.innerHTML = '<span class="t"></span><span class="pen">✎</span>';
    el.querySelector(".t").textContent = nm;
    el.title = nm;
  }
  function renderDetailFolder() {
    var el = $("detail-folder");
    if (!detailModalImg) return;
    el.textContent = "";
    var sel = document.createElement("select");
    sel.innerHTML = folderOptions(detailModalImg.folder || "");
    sel.addEventListener("change", function () {
      var val = sel.value;
      if (val === "__new__") {
        var nm = (window.prompt(t("add.folder.newPh")) || "").trim();
        if (!nm) { renderDetailFolder(); return; }
        apiCreateFolder(nm)
          .then(function () { detailSetFolder(detailModalImg.id, nm); })
          .catch(function (err) { toast(err.message, "error"); renderDetailFolder(); });
      } else {
        detailSetFolder(detailModalImg.id, val);
      }
    });
    el.appendChild(sel);
  }
  function detailSetFolder(id, folder) {
    setFolder(id, folder, function () { renderDetailFolder(); });
  }
  function fillDetailMedia(img) {
    var box = $("detail-thumb");
    box.innerHTML = "";
    var tp = img.type || guessTypeClient(img.url);
    if (tp === "audio") {
      // 音频详情：♪ 占位符（横排）+ 可播放的音频控件，媒体源跟随「缩略图媒体源」设置
      box.innerHTML =
        '<div class="detail-audio-wrap"><div class="thumb-fallback"><span class="tf-icon">♪</span><span class="tf-id">' + esc(t("type.audio")) + "</span></div>" +
        '<audio controls preload="metadata" src="' + esc(mediaSrc(img, appSettings.thumbSource)) + '"></audio></div>';
      return;
    }
    var el = tp === "video" ? document.createElement("video") : document.createElement("img");
    if (tp === "video") {
      el.muted = true;
      el.playsInline = true;
      el.preload = "metadata";
      el.crossOrigin = "anonymous";
      el.src = videoThumbSrc(img, appSettings.thumbSource);
      el.addEventListener("loadedmetadata", function () { setDetailDim(el.videoWidth, el.videoHeight); });
    } else {
      el.alt = img.id;
      el.onload = function () { setDetailDim(el.naturalWidth, el.naturalHeight); };
      el.src = mediaSrc(img, appSettings.thumbSource);
    }
    box.appendChild(el);
  }
  function probeDetailSize(img) {
    var url = img.shortUrl || img.url;
    if (!url) return;
    try {
      fetch(url, { method: "HEAD", cache: "no-store" })
        .then(function (r) {
          var len = r.headers.get("content-length");
          if (len) $("detail-size").textContent = fmtSize(Number(len));
        })
        .catch(function () {});
    } catch (e) {}
  }
  function isOneDriveImg(img) {
    return !!(img && (img.sourceType === "onedrive" || (img.odShare && img.odShare)));
  }
  // 从文件名提取扩展名（小写、不含点）；无扩展名或纯扩展名时返回空串
  function extOfName(n) {
    var s = String(n || "");
    var i = s.lastIndexOf(".");
    if (i <= 0 || i === s.length - 1) return "";
    return s.slice(i + 1).toLowerCase();
  }
  // 媒体文件类型（ogg / mp4 等）：
  //   OneDrive → odSrcName（原始完整文件名含扩展名，name 已去后缀）；
  //   普通媒体 → fileExt（后端 Content-Type 嗅探，中转链接也可靠）→ URL 末段 → name 兜底
  function fileTypeOf(img) {
    if (!img) return "";
    var t = extOfName(img.odSrcName);
    if (!t && img.fileExt) t = String(img.fileExt).toLowerCase();
    if (!t) t = extOfName(img.name);
    if (!t && img.url) {
      var seg = String(img.url).split(/[?#]/)[0].split("/").pop() || "";
      t = extOfName(seg);
    }
    return t;
  }
  function openDetailModal(img) {
    if (!img) return;
    detailModalImg = img;
    detailSrc = "site";
    detailFmt = "url";
    fillDetailMedia(img);
    renderDetailName();
    renderDetailFolder();
    $("detail-id").textContent = img.id;
    $("detail-time").textContent = fmtTime(img.createdAt);
    $("detail-size").textContent = "-";
    $("detail-dim").textContent = "-";
    // 文件类型：ogg / mp4 等
    var ft = fileTypeOf(img);
    $("detail-filetype").textContent = ft ? ft : "-";
    // 类型：OneDrive 链接 / 普通链接
    $("detail-type").textContent = isOneDriveImg(img) ? t("detail.typeOnedrive") : t("detail.typeNormal");
    probeDetailSize(img);
    fillDetailCopy(img);
    $("detail-modal").classList.remove("hidden");
  }
  // 详情弹窗：点击名字改名、点击 ID 值复制
  $("detail-name").addEventListener("click", function () {
    if (!detailModalImg) return;
    enterNameEdit(this, function () { renderDetailName(); });
  });
  $("detail-id").addEventListener("click", function () {
    if (!detailModalImg) return;
    var text = detailModalImg.id;
    function done() {
      toast(t("op.copyOk"), "success");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  });

  // ---- 详情弹窗：右栏（复制源 / 格式 / 预览 / 复制）----
  function buildCopyText(img, source, format) {
    if (!img) return "";
    // source: site=网站链接 / upstream=上游链接 / raw=OneDrive 原始共享链接
    var link;
    if (source === "raw") link = img.odShare || "";
    else if (source === "upstream") link = img.url;
    else link = img.shortUrl || img.url;
    if (!link) return "";
    var name = displayName(img);
    var isImg = (img.type || guessTypeClient(img.url)) === "image";
    if (format === "html") {
      return isImg
        ? '<img src="' + esc(link) + '" alt="' + esc(name) + '">'
        : '<a href="' + esc(link) + '">' + esc(name) + "</a>";
    }
    if (format === "markdown") {
      return isImg ? "![" + name + "](" + link + ")" : "[" + name + "](" + link + ")";
    }
    if (format === "bbcode") {
      return isImg ? "[img]" + link + "[/img]" : "[url=" + link + "]" + name + "[/url]";
    }
    return link; // url
  }
  function fillDetailCopy(img) {
    var srcs = $("detail-source").querySelectorAll(".dchip");
    for (var i = 0; i < srcs.length; i++) {
      var s = srcs[i].getAttribute("data-src");
      // 原始链接 chip 仅 OneDrive 媒体显示
      if (s === "raw") srcs[i].classList.toggle("hidden", !isOneDriveImg(img));
      if (detailSrc === "raw" && !isOneDriveImg(img)) detailSrc = "site";
      srcs[i].classList.toggle("active", s === detailSrc);
    }
    var fmts = $("detail-format").querySelectorAll(".dchip");
    for (var j = 0; j < fmts.length; j++) fmts[j].classList.toggle("active", fmts[j].getAttribute("data-fmt") === detailFmt);
    $("detail-preview").value = buildCopyText(img, detailSrc, detailFmt);
  }
  $("detail-source").addEventListener("click", function (e) {
    var btn = e.target.closest(".dchip");
    if (!btn || !detailModalImg) return;
    detailSrc = btn.getAttribute("data-src");
    var srcs = this.querySelectorAll(".dchip");
    for (var i = 0; i < srcs.length; i++) srcs[i].classList.toggle("active", srcs[i] === btn);
    $("detail-preview").value = buildCopyText(detailModalImg, detailSrc, detailFmt);
  });
  $("detail-format").addEventListener("click", function (e) {
    var btn = e.target.closest(".dchip");
    if (!btn || !detailModalImg) return;
    detailFmt = btn.getAttribute("data-fmt");
    var fmts = this.querySelectorAll(".dchip");
    for (var j = 0; j < fmts.length; j++) fmts[j].classList.toggle("active", fmts[j] === btn);
    $("detail-preview").value = buildCopyText(detailModalImg, detailSrc, detailFmt);
  });
  $("detail-copy-btn").addEventListener("click", function () {
    var text = $("detail-preview").value;
    if (!text) return;
    function done() {
      toast(t("op.copyOk"), "success");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!$("confirm-modal").classList.contains("hidden")) closeConfirm();
      else if (!$("detail-modal").classList.contains("hidden")) closeDetailModal();
      else if (!$("lightbox").classList.contains("hidden")) closeLightbox();
      else if (!$("chip-pop").classList.contains("hidden")) $("chip-pop").classList.add("hidden");
    }
  });

  var chipMenuFolder = null;
  $("folder-bar").addEventListener("click", function (e) {
    var el = e.target;
    if (el.classList.contains("fchip-menu")) {
      e.stopPropagation();
      var wrap = el.closest(".fchip-wrap");
      var r = wrap.getBoundingClientRect();
      chipMenuFolder = el.getAttribute("data-folder");
      var pop = $("chip-pop");
      pop.style.top = Math.round(r.bottom + 4) + "px";
      pop.style.left = Math.round(r.left) + "px";
      pop.classList.remove("hidden");
    } else if (el.classList.contains("fchip") && el.id !== "folder-add") {
      currentFolder = el.getAttribute("data-f");
      if (lastImages !== null) {
        // 就地显隐（保留缩略图与滚动），切换文件夹无需全量重建网格
        renderFolders();
        syncFilterInPlace();
        window.scrollTo(0, 0);
      } else {
        loadImages();
      }
    } else if (el.id === "folder-add") {
      var name = (window.prompt(t("folder.newPh")) || "").trim();
      if (!name) return;
      apiCreateFolder(name).then(function () {
        // 就地更新：无需全量重拉，仅补文件夹栏 + 切换到新文件夹
        if (lastFolders.indexOf(name) === -1) lastFolders.push(name);
        currentFolder = name;
        renderFolders();
        toast(t("folder.createOk"), "success");
        if (lastImages !== null) syncFilterInPlace();
      }).catch(function (err) { toast(err.message, "error"); });
    }
  });
  document.addEventListener("click", function (e) {
    var pop = $("chip-pop");
    if (pop.classList.contains("hidden")) return;
    if (e.target.closest(".chip-pop") || e.target.closest(".fchip-menu")) return;
    pop.classList.add("hidden");
  });
  $("chip-pop").addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn || !chipMenuFolder) return;
    var act = btn.getAttribute("data-act");
    this.classList.add("hidden");
    if (act === "rename") {
      var name = (window.prompt(t("folder.renamePrompt"), chipMenuFolder) || "").trim();
      if (!name || name === chipMenuFolder) return;
      var from = chipMenuFolder;
      var savedImgs = (lastImages || []).map(function (x) { return x ? { ...x } : null; });
      var savedFolders = lastFolders.slice();
      // 乐观：就地重命名文件夹及其下所有卡
      lastImages.forEach(function (im) { if (im && im.folder === from) im.folder = name; });
      lastFolders = lastFolders.filter(function (f) { return f !== from; });
      if (lastFolders.indexOf(name) === -1) lastFolders.push(name);
      if (currentFolder === from) currentFolder = name;
      renderFolders();
      refreshCardBodies();
      syncFilterInPlace();
      api("/api/folder/rename", { method: "POST", body: JSON.stringify({ from: from, to: name }) })
        .then(function () { toast(t("folder.renameOk"), "success"); })
        .catch(function (err) {
          restoreImagesFrom(savedImgs);
          lastFolders = savedFolders;
          if (currentFolder === name) currentFolder = from;
          renderFolders();
          refreshCardBodies();
          syncFilterInPlace();
          toast(err.message, "error");
        });
    } else if (act === "delete") {
      if (!window.confirm(t("folder.deleteConfirm", { name: chipMenuFolder }))) return;
      var delName = chipMenuFolder;
      var savedImgs2 = (lastImages || []).map(function (x) { return x ? { ...x } : null; });
      var savedFolders2 = lastFolders.slice();
      // 乐观：就地删除文件夹，其下卡移入未分类
      lastImages.forEach(function (im) { if (im && im.folder === delName) im.folder = ""; });
      lastFolders = lastFolders.filter(function (f) { return f !== delName; });
      if (currentFolder === delName) currentFolder = "";
      renderFolders();
      refreshCardBodies();
      syncFilterInPlace();
      api("/api/folder/delete", { method: "POST", body: JSON.stringify({ name: delName }) })
        .then(function () { toast(t("folder.deleted"), "success"); })
        .catch(function (err) {
          restoreImagesFrom(savedImgs2);
          lastFolders = savedFolders2;
          if (currentFolder === "" && savedFolders2.indexOf(delName) !== -1) currentFolder = delName;
          renderFolders();
          refreshCardBodies();
          syncFilterInPlace();
          toast(err.message, "error");
        });
    }
  });

  var LIST_KEYS = ["allowedOrigins", "allowedCountries", "blockedCountries", "allowedIps", "blockedIps", "allowedAsn", "blockedAsn", "allowedReferers"];
  var NUM_KEYS = ["signatureTtl", "cacheTtl", "maxImageSize", "maxAudioSize", "maxVideoSize", "onedriveRefreshHours"];

  function loadSettings() {
    api("/api/settings").then(function (data) {
      var s = data.settings || {};
      appSettings = s; // 全局设置缓存，缩略图/灯箱渲染读取 thumbSource/previewSource
      LIST_KEYS.forEach(function (k) {
        var el = $(k);
        if (el) el.value = (s[k] || []).join(", ");
      });
      NUM_KEYS.forEach(function (k) {
        var el = $(k);
        // 旧 KV 可能缺少新增字段（如 onedriveRefreshHours），显示为空而非 "undefined"
        if (el) el.value = s[k] == null ? "" : s[k];
      });
      $("requireSignature").checked = !!s.requireSignature;
      if (s.defaultMode === "proxy") { $("defaultModeProxy").checked = true; }
      else { $("defaultModeRedirect").checked = true; }
      if (s.downloadNameSource === "custom") { $("downloadNameSourceCustom").checked = true; }
      else { $("downloadNameSourceUpstream").checked = true; }
      if (s.thumbSource === "site") { $("thumbSourceSite").checked = true; }
      else { $("thumbSourceUpstream").checked = true; }
      if (s.previewSource === "site") { $("previewSourceSite").checked = true; }
      else { $("previewSourceUpstream").checked = true; }
      $("originReferer").value = s.originReferer || "";
      $("originUserAgent").value = s.originUserAgent || "";
      if ($("thumbCache")) $("thumbCache").value = thumbCacheMax;
      if (data.meta) {
        rateMeta = data.meta;
        renderRateLimits();
      }
      updateOdRefreshHint();
    }).catch(function (err) {
      if (err.message && err.message.indexOf("未登录") === -1) toast(err.message, "error");
    });
  }

  // OneDrive 刷新间隔的提示随"缓存 TTL"动态显示最大可设小时数
  // （与后端 scheduled 的 maxHours 计算保持一致：Math.max(1, Math.floor(cacheTtl / 3600))）
  function updateOdRefreshHint() {
    var el = $("odRefreshHoursHint");
    if (!el) return;
    var cacheTtlEl = $("cacheTtl");
    var cttl = cacheTtlEl ? Number(cacheTtlEl.value) || 0 : 0;
    var maxHours = Math.max(1, Math.floor(cttl / 3600));
    el.textContent = t("set.odRefreshHours.hint", { maxHours: maxHours });
  }
  var cacheTtlInput = $("cacheTtl");
  if (cacheTtlInput) cacheTtlInput.addEventListener("input", updateOdRefreshHint);

  function renderRateLimits() {
    if (!rateMeta) return;
    var ip = rateMeta.rateLimitIp;
    var img = rateMeta.rateLimitImg;
    var av = rateMeta.rateLimitAv;
    var ipEl = $("rateLimitIp");
    var imgEl = $("rateLimitImg");
    var avEl = $("rateLimitAv");
    if (ipEl) ipEl.textContent = t("set.rateIpVal", { limit: ip && ip.limit, period: ip && ip.period });
    if (imgEl) imgEl.textContent = t("set.rateImgVal", { limit: img && img.limit, period: img && img.period });
    if (avEl) avEl.textContent = t("set.rateAvVal", { limit: av && av.limit, period: av && av.period });
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
    body.downloadNameSource = $("downloadNameSourceCustom").checked ? "custom" : "upstream";
    body.thumbSource = $("thumbSourceSite").checked ? "site" : "upstream";
    body.previewSource = $("previewSourceSite").checked ? "site" : "upstream";
    body.originReferer = $("originReferer").value.trim();
    body.originUserAgent = $("originUserAgent").value.trim();
    var tc = parseInt($("thumbCache") ? $("thumbCache").value : "", 10);
    thumbCacheMax = tc >= 0 ? tc : 0;
    localStorage.setItem(THUMB_CACHE_KEY, String(thumbCacheMax));
    scheduleCacheManage();
    var btn = this;
    setBusy(btn, true, t("set.busy"));
    api("/api/settings", { method: "PUT", body: JSON.stringify(body) })
      .then(function () {
        // 同步全局设置缓存并按新媒体源刷新已渲染缩略图，无需整页重建
        appSettings.thumbSource = body.thumbSource;
        appSettings.previewSource = body.previewSource;
        refreshThumbs();
        toast(t("op.saveOk"), "success");
      })
      .catch(function (err) { toast(err.message || t("op.saveFail"), "error"); })
      .finally(function () { setBusy(btn, false); });
  });

  function applyLang() {
    document.documentElement.lang = LANG === "zh" ? "zh-CN" : "en";
    document.title = t("app.title");
    var q = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < q.length; i++) q[i].textContent = t(q[i].getAttribute("data-i18n"));
    q = document.querySelectorAll("[data-i18n-ph]");
    for (i = 0; i < q.length; i++) q[i].placeholder = t(q[i].getAttribute("data-i18n-ph"));
    q = document.querySelectorAll("[data-i18n-title]");
    for (i = 0; i < q.length; i++) q[i].title = t(q[i].getAttribute("data-i18n-title"));
    q = document.querySelectorAll("[data-i18n-aria]");
    for (i = 0; i < q.length; i++) q[i].setAttribute("aria-label", t(q[i].getAttribute("data-i18n-aria")));
    var seg = document.querySelectorAll(".lt-seg-opt");
    for (var s = 0; s < seg.length; s++) {
      seg[s].classList.toggle("active", seg[s].classList.contains(LANG === "zh" ? "is-zh" : "is-en"));
      seg[s].classList.toggle("inactive", !seg[s].classList.contains(LANG === "zh" ? "is-zh" : "is-en"));
    }
    renderFolders();
    if (lastImages !== null) renderGrid(lastImages, { anchor: true });
    refreshPreview();
    updateAddBtnLabel(); // 批量模式下按钮文字含计数，需在语言切换后刷新
    renderRateLimits();
    updateOdRefreshHint();
  }
  function setLang(lang) {
    LANG = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyLang();
  }
  document.querySelectorAll(".lt-seg-opt").forEach(function (opt) {
    opt.addEventListener("click", function (e) {
      e.stopPropagation();
      var target = this.classList.contains("is-en") ? "en" : "zh";
      if (target === LANG) return;
      var btn = $("lang-toggle");
      btn.classList.remove("flip");
      void btn.offsetWidth;
      btn.classList.add("flip");
      setLang(target);
    });
  });
  $("lang-toggle").addEventListener("click", function () {
    var next = LANG === "zh" ? "en" : "zh";
    var btn = this;
    btn.classList.remove("flip");
    void btn.offsetWidth;
    btn.classList.add("flip");
    setLang(next);
    var target = $("app").classList.contains("hidden") ? $("login") : $("app");
    target.classList.remove("langPop");
    void target.offsetWidth;
    target.classList.add("langPop");
    setTimeout(function () { target.classList.remove("langPop"); }, 450);
  });

  if (!REDUCED) startParticles();

  var CFX_COLORS = null;
  function cfxColors() {
    if (CFX_COLORS) return CFX_COLORS;
    var s = getComputedStyle(document.documentElement);
    var pick = function (v) { return s.getPropertyValue(v).trim() || "#a855f7"; };
    CFX_COLORS = [pick("--c1"), pick("--c2"), pick("--c3"), pick("--accent")];
    return CFX_COLORS;
  }
  function spawnClickFx(x, y) {
    var box = $("clickfx");
    if (!box) return;
    var colors = cfxColors();
    var shapes = ["cfx-star", "cfx-diamond", "cfx-cross"];
    var n = 18 + Math.floor(Math.random() * 9);
    for (var i = 0; i < n; i++) {
      var el = document.createElement("span");
      el.className = "cfx-spark " + shapes[Math.floor(Math.random() * shapes.length)];
      var a = Math.random() * 6.2832;
      var d = 45 + Math.random() * 70;
      var size = (9 + Math.random() * 7.2).toFixed(1);
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.setProperty("--dx", (Math.cos(a) * d).toFixed(1) + "px");
      el.style.setProperty("--dy", (Math.sin(a) * d).toFixed(1) + "px");
      el.style.setProperty("--size", size + "px");
      el.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
      el.style.setProperty("--rot", (Math.floor(Math.random() * 90)) + "deg");
      el.addEventListener("animationend", function () { var p = this.parentNode; if (p) p.removeChild(this); });
      (function (node) {
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 1000);
      })(el);
      box.appendChild(el);
    }
  }
  document.addEventListener("click", function (e) {
    if (REDUCED) return;
    var t = e.target;
    if (!t || t === document) return;
    if (t.closest("button,a,input,select,textarea,label,[data-act],.fchip,.fchip-menu,.fchip-wrap,.lt-seg-opt,.tgl,.fsel,.img-name,.copy,.del,.detail,.zoom,.close,.primary,.mini,.nav-btn,.logout,.lang-toggle,.chip-pop,.lightbox,.modal,.detail-modal,.search-clear,.openlink,.dchip,.detail-name,.detail-folder,.detail-preview,.id-copy")) return;
    spawnClickFx(e.clientX, e.clientY);
  });

  function startParticles() {
    var cv = $("particles");
    var ctx = cv.getContext("2d");
    var W = 0, H = 0, pts = [], streaks = [], raf = null, running = true;
    var last = 0, nextStreak = 1800;
    var sprites = {};

    function makeSprite(hue) {
      var s = document.createElement("canvas");
      s.width = 64; s.height = 64;
      var c = s.getContext("2d");
      var g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "hsla(" + hue + ",92%,72%,0.95)");
      g.addColorStop(0.3, "hsla(" + hue + ",88%,66%,0.45)");
      g.addColorStop(1, "hsla(" + hue + ",85%,60%,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, 64, 64);
      return s;
    }
    function spriteFor(h) {
      var b = Math.floor(h / 30) * 30;
      if (!sprites[b]) sprites[b] = makeSprite(b);
      return sprites[b];
    }

    function newParticle() {
      var t = Math.random();
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 3 + 1.5,
        h: Math.floor(Math.random() * 360),
        phase: Math.random() * 6.2832,
        speed: Math.random() * 0.02 + 0.008,
        type: t < 0.55 ? "orb" : t < 0.82 ? "spark" : "ring",
        o: Math.random() * 0.5 + 0.35
      };
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(24, Math.min(72, Math.round((W * H) / 32098)));
      pts = [];
      for (var i = 0; i < n; i++) pts.push(newParticle());
      streaks = [];
    }

    function sparkPath(x, y, r, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var rad = i % 2 === 0 ? r : r * 0.32;
        var a = (i / 8) * 6.2832;
        var px = Math.cos(a) * rad;
        var py = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function tick(now) {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var i, j;

      if (now - last > nextStreak) {
        last = now;
        nextStreak = 2600 + Math.random() * 3800;
        if (streaks.length < 2) {
          streaks.push({
            x: Math.random() * W,
            y: Math.random() * H * 0.55,
            a: Math.PI * (Math.random() * 0.5 + 0.25),
            v: Math.random() * 4 + 3,
            life: 1
          });
        }
      }
      for (i = streaks.length - 1; i >= 0; i--) {
        var st = streaks[i];
        st.x += Math.cos(st.a) * st.v;
        st.y += Math.sin(st.a) * st.v;
        st.life -= 0.012;
        if (st.life <= 0 || st.y > H + 60 || st.x < -60 || st.x > W + 60) {
          streaks.splice(i, 1);
          continue;
        }
        var tail = 10 + st.v * 2;
        var lg = ctx.createLinearGradient(st.x, st.y, st.x - Math.cos(st.a) * tail, st.y - Math.sin(st.a) * tail);
        lg.addColorStop(0, "hsla(200,92%,80%,0.85)");
        lg.addColorStop(1, "hsla(200,92%,80%,0)");
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x - Math.cos(st.a) * tail, st.y - Math.sin(st.a) * tail);
        ctx.stroke();
      }

      for (i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -24) p.x = W + 24; else if (p.x > W + 24) p.x = -24;
        if (p.y < -24) p.y = H + 24; else if (p.y > H + 24) p.y = -24;
      }

      var LINK = 110, LINK2 = LINK * LINK;
      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        var a = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < LINK2) {
            ctx.strokeStyle = "hsla(" + Math.floor((a.h + b.h) / 2) + ",80%,62%," + ((1 - d / LINK2) * 0.13) + ")";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (i = 0; i < pts.length; i++) {
        var q = pts[i];
        var tw = 0.7 + 0.3 * Math.sin(now * q.speed + q.phase);
        ctx.globalAlpha = q.o * tw;
        if (q.type === "orb") {
          var spr = spriteFor(q.h);
          var size = q.r * 6;
          ctx.drawImage(spr, q.x - size / 2, q.y - size / 2, size, size);
        } else if (q.type === "spark") {
          ctx.fillStyle = "hsla(" + q.h + ",92%,74%,1)";
          sparkPath(q.x, q.y, q.r * 2.2, now * 0.0009 + q.phase);
        } else {
          ctx.strokeStyle = "hsla(" + q.h + ",86%,72%," + tw + ")";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r * 1.7, 0, 6.2832);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", debounce(resize, 200));
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else {
        running = true;
        last = performance.now();
        tick(last);
      }
    });
    resize();
    last = performance.now();
    tick(last);
  }

  applyLang();
  if (token) {
    hideLogin();
    loadImages();
    loadSettings();
  } else {
    showLogin();
  }
})();
</script>
</body>
</html>`;
}
