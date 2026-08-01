export function renderUI() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MediaDNS-CDN · 图床管理</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236366f1'/%3E%3Cstop offset='.5' stop-color='%23a855f7'/%3E%3Cstop offset='1' stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='7' fill='url(%23g)'/%3E%3Ctext x='16' y='22' font-family='Arial,sans-serif' font-size='16' font-weight='700' fill='%23fff' text-anchor='middle'%3EMD%3C/text%3E%3C/svg%3E" />
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
  var s = document.documentElement.style;
  s.setProperty("--c1", p[0]);
  s.setProperty("--c2", p[1]);
  s.setProperty("--c3", p[2]);
  s.setProperty("--accent", p[1]);
  s.setProperty("--accent2", p[2]);
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
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;
  color:var(--text);font-size:14px;line-height:1.5;overflow-x:hidden;
  background-color:#f4f2fb;
  background-image:linear-gradient(160deg,color-mix(in srgb,var(--c1) 14%,#fff),color-mix(in srgb,var(--c2) 14%,#fff),color-mix(in srgb,var(--c3) 14%,#fff));
}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input,select{font-family:inherit;font-size:14px}
a{color:var(--accent)}
.hidden{display:none!important}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* 动态背景光斑 */
.bg-blob{position:fixed;border-radius:50%;filter:blur(80px);opacity:.55;z-index:-2;pointer-events:none}
.b1{width:44vmax;height:44vmax;top:-14vmax;left:-10vmax;background:radial-gradient(circle,var(--c1),transparent 66%);animation:float1 26s ease-in-out infinite}
.b2{width:40vmax;height:40vmax;top:16%;right:-12vmax;background:radial-gradient(circle,var(--c2),transparent 66%);animation:float2 34s ease-in-out infinite}
.b3{width:46vmax;height:46vmax;bottom:-16vmax;left:28%;background:radial-gradient(circle,var(--c3),transparent 66%);animation:float3 30s ease-in-out infinite}
@keyframes float1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6vmax,4vmax) scale(1.14)}}
@keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-5vmax,3vmax) scale(1.08)}}
@keyframes float3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(4vmax,-5vmax) scale(1.1)}}
@keyframes shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
#particles{position:fixed;inset:0;z-index:-1;pointer-events:none}

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
.main{flex:1;padding:28px 34px;width:100%;min-width:0}
.view{display:none}
.view.active{display:block;animation:viewIn .28s ease both}
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
.preview{margin-top:16px;display:flex;gap:14px;align-items:center;border:1px dashed rgba(0,0,0,.18);border-radius:9px;padding:10px}
.preview img{max-width:120px;max-height:90px;border-radius:6px;object-fit:contain;background:rgba(255,255,255,.7)}
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
.search-wrap{position:relative}
.toolbar input{width:250px;padding:8px 12px;border:1px solid rgba(0,0,0,.12);border-radius:9px;outline:none;background:rgba(255,255,255,.85)}
.toolbar input:focus{border-color:var(--accent)}
.search-clear{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;color:var(--muted);font-size:14px;line-height:1}
.search-clear:hover{background:rgba(0,0,0,.08);color:var(--text)}
.empty{color:var(--muted);text-align:center;padding:50px 0;font-size:14px}

/* 图片网格 */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.img-card{overflow:hidden;display:flex;flex-direction:column;transition:transform .14s ease,box-shadow .14s ease;animation:cardIn .4s ease both}
.img-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px color-mix(in srgb,var(--accent) 28%,rgba(31,41,55,.10))}
.img-card.disabled{opacity:.55}
@keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.thumb{position:relative;background:linear-gradient(160deg,color-mix(in srgb,var(--c1) 12%,#fff),color-mix(in srgb,var(--c3) 12%,#fff));aspect-ratio:16/10}
.thumb img{width:100%;height:100%;object-fit:contain;display:block}
.thumb .zoom{position:absolute;right:8px;bottom:8px;background:rgba(15,23,42,.72);color:#fff;font-size:12px;padding:5px 10px;border-radius:6px;transition:background .15s}
.thumb .zoom:hover{background:rgba(15,23,42,.92)}
.thumb-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px;text-align:center;color:var(--muted)}
.thumb-fallback .tf-icon{font-size:22px}
.thumb-fallback .tf-id{font-size:11px;word-break:break-all;max-width:92%}
.card-body{padding:12px;display:flex;flex-direction:column;gap:7px}
.card-top{display:flex;align-items:center;justify-content:space-between}
.badge{font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600}
.badge-proxy{background:color-mix(in srgb,var(--c1) 16%,#fff);color:var(--c1)}
.badge-dns{background:rgba(255,255,255,.72);color:#4b5563;border:1px solid rgba(0,0,0,.08)}
.img-name{font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;word-break:break-all}
.img-name .pen{font-size:11px;color:var(--muted);opacity:0;transition:opacity .15s}
.img-name:hover .pen{opacity:1}
.name-edit{width:100%;padding:5px 8px;font-size:14px;font-weight:600;border:1px solid var(--accent);border-radius:7px;outline:none}
.img-id{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:#4b5563;word-break:break-all}
.img-url{font-size:11px;color:var(--muted);word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
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
.skeleton{height:210px;border-radius:var(--radius);background:linear-gradient(100deg,rgba(255,255,255,.45) 20%,rgba(255,255,255,.85) 45%,rgba(255,255,255,.45) 70%);background-size:200% 100%;animation:shimmer 1.3s infinite;border:1px solid var(--glass-line)}
@keyframes shimmer{to{background-position:-200% 0}}

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
.save-row{margin-top:4px}

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
.toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(90px);color:#fff;padding:11px 20px;border-radius:10px;font-size:14px;opacity:0;transition:.25s;z-index:2000;box-shadow:0 10px 34px rgba(0,0,0,.28);pointer-events:none;max-width:80vw}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast.success{background:linear-gradient(135deg,#10b981,#0ea5e9)}
.toast.error{background:linear-gradient(135deg,#f43f5e,#ef4444)}
.toast.info{background:linear-gradient(135deg,#6366f1,#a855f7)}

/* 灯箱预览 */
.lightbox{position:fixed;inset:0;background:rgba(10,14,22,.86);display:flex;align-items:center;justify-content:center;z-index:2100;padding:24px;animation:viewIn .18s ease both}
.lightbox img{max-width:94vw;max-height:86vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 60px rgba(0,0,0,.5)}
.lightbox .close{position:absolute;top:16px;right:24px;color:#fff;font-size:36px;line-height:1;cursor:pointer;opacity:.85;transition:opacity .15s}
.lightbox .close:hover{opacity:1}
.lightbox .openlink{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);color:#fff;text-decoration:none;background:rgba(255,255,255,.16);padding:8px 16px;border-radius:8px;font-size:13px;transition:background .15s;display:flex;align-items:center;gap:6px}
.lightbox .openlink:hover{background:rgba(255,255,255,.3)}

/* 删除确认弹窗 */
.modal{position:fixed;inset:0;z-index:2200;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.45);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:20px}
.modal-box{width:360px;max-width:100%;background:#fff;border-radius:14px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.28);animation:popIn .16s ease-out both}
@keyframes popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
.modal-box h3{font-size:15px;margin-bottom:10px}
.modal-box p{font-size:13px;color:#374151;line-height:1.6;word-break:break-all}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}

@media (max-width:720px){
  .sidebar{width:64px;padding:18px 8px}
  .sidebar .brand{font-size:0}
  .sidebar .brand:after{content:"MD";font-size:18px}
  .nav-btn{font-size:0;text-align:center;padding:10px}
  .nav-btn.active:after{content:"\\2022"}
  .main{padding:18px 14px}
  .toolbar input{width:160px}
  .add-row,.add-row2{flex-direction:column}
  .add-row2 select{max-width:100%}
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
    <button id="logout" class="logout" data-i18n="nav.logout"></button>
  </aside>
  <main class="main">
    <section id="view-images" class="view active">
      <div class="card add-card">
        <h2 data-i18n="add.title"></h2>
        <div class="add-row">
          <input id="add-url" type="url" data-i18n-ph="add.url.ph" />
          <button id="add-btn" class="primary" data-i18n="add.btn"></button>
        </div>
        <div class="add-row2">
          <input id="add-name" type="text" data-i18n-ph="add.name.ph" />
          <select id="add-folder" aria-label="Folder"></select>
        </div>
        <div class="mode-row">
          <label class="mode-option"><input type="radio" name="mode" value="redirect" checked /><span data-i18n="mode.redirect"></span><em data-i18n="mode.redirect.em"></em></label>
          <label class="mode-option"><input type="radio" name="mode" value="proxy" /><span data-i18n="mode.proxy"></span><em data-i18n="mode.proxy.em"></em></label>
        </div>
        <div id="add-preview" class="preview hidden">
          <img id="preview-img" alt="预览" />
          <div id="preview-info" class="muted"></div>
        </div>
      </div>

      <div id="folder-bar" class="folder-bar"></div>

      <div class="toolbar">
        <h2><span data-i18n="list.title"></span> <span id="img-count" class="count"></span></h2>
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
          <label><span data-i18n="set.maxImageSize"></span><input id="maxImageSize" type="number" min="1024" /></label>
          <label><span data-i18n="set.defaultMode"></span>
            <span class="mode-radio-row">
              <label><input type="radio" name="defaultMode" id="defaultModeRedirect" value="redirect" /><span data-i18n="mode.redirect.short"></span></label>
              <label><input type="radio" name="defaultMode" id="defaultModeProxy" value="proxy" /><span data-i18n="mode.proxy.short"></span></label>
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
          <label><span data-i18n="set.rateNote"></span><div class="readonly-box" data-i18n="set.rateNoteText"></div></label>
        </div>

        <div class="save-row">
          <button id="save-settings" class="primary" data-i18n="set.save"></button>
        </div>
      </div>
    </section>
  </main>
</div>

<div id="toast" class="toast"></div>
<div id="lightbox" class="lightbox hidden">
  <img id="lightbox-img" alt="" />
  <a id="lightbox-open" class="openlink" href="#" target="_blank" rel="noopener" data-i18n="lightbox.open"></a>
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

  var I18N = {
    zh: {
      "app.title": "MediaDNS-CDN · 图床管理",
      "lang.aria": "切换语言",
      "login.sub": "图片外链转接 · 缓存 · 防盗链",
      "login.ph": "请输入管理密码（PASSWORD）",
      "login.btn": "登录",
      "login.hint": "密码仅保存在当前浏览器",
      "login.busy": "登录中…",
      "login.err": "登录失败：PASSWORD 错误",
      "net.err": "网络错误",
      "auth.invalid": "未登录或登录已失效",
      "nav.images": "图片管理",
      "nav.settings": "设置",
      "nav.logout": "退出登录",
      "add.title": "添加图片",
      "add.url.ph": "粘贴图片直链地址，如 https://img.example.com/a/b.jpg（回车也可添加）",
      "add.name.ph": "名称（选填，默认用文件名）",
      "add.folder.new": "新建文件夹…",
      "add.folder.newPh": "输入新文件夹名称",
      "add.btn": "添加",
      "add.busy": "添加中…",
      "add.err.empty": "请粘贴图片链接",
      "add.err": "添加失败",
      "add.ok": "已添加，链接已复制到剪贴板",
      "add.src": "来源",
      "mode.redirect": "仅DNS",
      "mode.proxy": "缓存代理+DNS",
      "mode.redirect.em": "302直跳原图，不占用带宽",
      "mode.proxy.em": "Worker 缓存转发",
      "mode.redirect.short": "仅DNS（302直跳）",
      "mode.proxy.short": "缓存代理+DNS",
      "list.title": "图片列表",
      "list.count": "{n} 张",
      "search.ph": "搜索名称 / ID / 地址…",
      "search.clear": "清空搜索",
      "empty": "还没有图片，粘贴一个链接开始吧。",
      "empty.filtered": "没有匹配的图片。",
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
      "confirm.title": "删除图片",
      "confirm.text": "确定删除图片「{name}」吗？删除后链接将立即失效。",
      "confirm.cancel": "取消",
      "confirm.ok": "删除",
      "op.toggleOn": "已启用",
      "op.toggleOff": "已停用",
      "op.del": "已删除",
      "op.delFail": "删除失败",
      "op.fail": "操作失败",
      "op.saveOk": "设置已保存，缓存已刷新",
      "op.saveFail": "保存失败",
      "op.copyOk": "链接已复制",
      "op.saved": "已保存",
      "op.moved": "已移动",
      "op.updated": "已更新",
      "lightbox.open": "在新标签打开原图",
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
      "set.allowedReferers.hint": "仅当请求携带 Referer 时校验；浏览器不总是发送 Referer，此为尽力而为。",
      "set.requireSignature": "启用 HMAC 签名链接",
      "set.requireSignature.hint": "（生成的链接带过期签名，不可伪造，最强防外链）",
      "set.signatureTtl": "签名有效期（秒）",
      "set.group.cache": "缓存与限制",
      "set.cacheTtl": "缓存 TTL（秒，0 = 不缓存）",
      "set.cacheTtl.hint": "仅「缓存代理+DNS」模式的图片走缓存；缓存命中时由边缘直接返回。",
      "set.maxImageSize": "单张图片大小上限（字节）",
      "set.defaultMode": "默认链接类型",
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
      "set.rateNote": "说明",
      "set.rateNoteText": "限流由 Cloudflare Rate Limit Binding 在边缘执行，数值需在 wrangler.jsonc 中修改后重新部署，此处仅展示当前配置。"
    },
    en: {
      "app.title": "MediaDNS-CDN · Image Manager",
      "lang.aria": "Switch language",
      "login.sub": "Image hotlink proxy · Cache · Anti-leech",
      "login.ph": "Enter admin password (PASSWORD)",
      "login.btn": "Log in",
      "login.hint": "Password is stored only in this browser",
      "login.busy": "Logging in…",
      "login.err": "Login failed: wrong PASSWORD",
      "net.err": "Network error",
      "auth.invalid": "Not logged in or session expired",
      "nav.images": "Images",
      "nav.settings": "Settings",
      "nav.logout": "Log out",
      "add.title": "Add image",
      "add.url.ph": "Paste image direct link, e.g. https://img.example.com/a/b.jpg (Enter to add)",
      "add.name.ph": "Name (optional, defaults to filename)",
      "add.folder.new": "New folder…",
      "add.folder.newPh": "Enter new folder name",
      "add.btn": "Add",
      "add.busy": "Adding…",
      "add.err.empty": "Please paste an image link",
      "add.err": "Add failed",
      "add.ok": "Added, link copied to clipboard",
      "add.src": "Source",
      "mode.redirect": "DNS only",
      "mode.proxy": "Cache proxy + DNS",
      "mode.redirect.em": "302 direct, no bandwidth cost",
      "mode.proxy.em": "Worker cache & forward",
      "mode.redirect.short": "DNS only (302)",
      "mode.proxy.short": "Cache proxy + DNS",
      "list.title": "Images",
      "list.count": "{n} items",
      "search.ph": "Search name / ID / URL…",
      "search.clear": "Clear search",
      "empty": "No images yet. Paste a link to start.",
      "empty.filtered": "No matching images.",
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
      "confirm.title": "Delete image",
      "confirm.text": "Delete image ‘{name}’? The link will stop working immediately.",
      "confirm.cancel": "Cancel",
      "confirm.ok": "Delete",
      "op.toggleOn": "Enabled",
      "op.toggleOff": "Disabled",
      "op.del": "Deleted",
      "op.delFail": "Delete failed",
      "op.fail": "Operation failed",
      "op.saveOk": "Settings saved, cache refreshed",
      "op.saveFail": "Save failed",
      "op.copyOk": "Link copied",
      "op.saved": "Saved",
      "op.moved": "Moved",
      "op.updated": "Updated",
      "lightbox.open": "Open original in new tab",
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
      "set.allowedReferers.hint": "Checked only when Referer is present; browsers don't always send it, so best-effort.",
      "set.requireSignature": "Enable HMAC signed links",
      "set.requireSignature.hint": "(links get expiring signatures, unforgeable, strongest protection)",
      "set.signatureTtl": "Signature TTL (seconds)",
      "set.group.cache": "Cache & limits",
      "set.cacheTtl": "Cache TTL (seconds, 0 = off)",
      "set.cacheTtl.hint": "Only images in “Cache proxy + DNS” mode are cached; hits return from the edge.",
      "set.maxImageSize": "Max image size (bytes)",
      "set.defaultMode": "Default link type",
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
      "set.rateNote": "Note",
      "set.rateNoteText": "Rate limiting runs at the edge via Cloudflare Rate Limit Binding; change values in wrangler.jsonc and re-deploy. This is read-only."
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
      if (res.status === 401) { showLogin(); throw new Error(t("auth.invalid")); }
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

  function filterImages(images) {
    var q = searchQuery.toLowerCase();
    return images.filter(function (img) {
      if (currentFolder === "__uncat__") { if (img.folder) return false; }
      else if (currentFolder && img.folder !== currentFolder) return false;
      if (q) {
        var hay = ((img.name || "") + " " + img.id + " " + (img.url || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
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
  }

  function renderGrid(images) {
    var grid = $("grid");
    var vis = filterImages(images);
    grid.innerHTML = "";
    $("img-count").textContent = t("list.count", { n: vis.length });
    if (!vis.length) {
      $("empty").classList.remove("hidden");
      $("empty").textContent = images.length ? t("empty.filtered") : t("empty");
      return;
    }
    $("empty").classList.add("hidden");
    vis.forEach(function (img, i) {
      var card = document.createElement("div");
      card.className = "card img-card" + (img.enabled ? "" : " disabled");
      card.style.animationDelay = Math.min(i * 45, 360) + "ms";
      card.innerHTML =
        '<div class="thumb"><img src="' + esc(img.url) + '" loading="lazy" alt="' + esc(img.id) + '" />' +
        '<button class="zoom" data-url="' + esc(img.url) + '" aria-label="' + esc(t("card.preview")) + '">' + esc(t("card.preview.short")) + "</button></div>" +
        '<div class="card-body">' +
        '<div class="card-top">' + modeBadge(img.mode) + '<span class="muted">' + fmtTime(img.createdAt) + "</span></div>" +
        '<div class="img-name" data-id="' + esc(img.id) + '" data-name="' + esc(img.name || "") + '" title="' + esc(t("card.renameTitle")) + '">' + esc(displayName(img)) + '<span class="pen">✎</span></div>' +
        '<div class="img-id" title="' + esc(img.id) + '">' + esc(img.id) + "</div>" +
        '<div class="img-url" title="' + esc(img.shortUrl || img.url) + '">' + esc(img.shortUrl || img.url) + "</div>" +
        '<select class="fsel" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.folderAria")) + '">' + folderOptions(img.folder || "") + "</select>" +
        '<div class="actions">' +
        '<label class="switch" title="' + esc(t("card.toggle")) + '"><input type="checkbox" class="tgl" data-id="' + esc(img.id) + '"' + (img.enabled ? " checked" : "") + ' /><span></span></label>' +
        '<button class="mini copy" data-url="' + esc(img.shortUrl || img.url) + '" aria-label="' + esc(t("card.copy.aria")) + '">' + esc(t("card.copy")) + "</button>" +
        '<button class="mini danger del" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.del")) + '">' + esc(t("card.del")) + "</button>" +
        "</div></div>";
      grid.appendChild(card);
    });
  }

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
  }

  function loadImages() {
    if (lastImages === null) renderSkeleton();
    api("/api/images").then(function (data) {
      lastImages = data.images || [];
      lastFolders = data.folders || [];
      renderFolders();
      renderGrid(lastImages);
    }).catch(function (err) {
      if (lastImages === null) $("grid").innerHTML = "";
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

  $("add-folder").addEventListener("change", function () {
    var sel = this;
    if (sel.value === "__new__") {
      var name = (window.prompt(t("add.folder.newPh")) || "").trim();
      if (!name) { sel.value = addPendingFolder; return; }
      apiCreateFolder(name).then(function () {
        addPendingFolder = name;
        sel.value = name;
        toast(t("folder.createOk"), "success");
      }).catch(function (err) { toast(err.message, "error"); });
    }
  });

  function addImage() {
    var url = $("add-url").value.trim();
    var modeEl = document.querySelector('input[name="mode"]:checked');
    var mode = modeEl ? modeEl.value : "redirect";
    if (!url) { toast(t("add.err.empty"), "error"); $("add-url").focus(); return; }
    var name = $("add-name").value.trim();
    var folder = $("add-folder").value;
    if (folder === "__new__") folder = addPendingFolder;
    var btn = $("add-btn");
    setBusy(btn, true, t("add.busy"));
    api("/api/convert", { method: "POST", body: JSON.stringify({ url: url, mode: mode, name: name, folder: folder }) })
      .then(function (data) {
        toast(t("add.ok"), "success");
        clearTimeout(addPreviewTimer);
        $("add-url").value = "";
        $("add-name").value = "";
        $("add-preview").classList.add("hidden");
        try { navigator.clipboard.writeText(data.url); } catch (e) {}
        loadImages();
        $("add-url").focus();
      })
      .catch(function (err) { toast(err.message || t("add.err"), "error"); })
      .finally(function () { setBusy(btn, false); });
  }
  $("add-btn").addEventListener("click", addImage);
  $("add-url").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); addImage(); }
  });

  function currentImgFolder(id) {
    var im = (lastImages || []).filter(function (x) { return x.id === id; })[0];
    return im ? (im.folder || "") : "";
  }
  function setFolder(id, folder) {
    api("/api/image/update", { method: "POST", body: JSON.stringify({ id: id, folder: folder }) })
      .then(function () { toast(t("op.moved"), "success"); loadImages(); })
      .catch(function (err) { toast(err.message, "error"); });
  }
  function enterNameEdit(span) {
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
        api("/api/image/update", { method: "POST", body: JSON.stringify({ id: id, name: v }) })
          .then(function () { toast(t("op.saved"), "success"); loadImages(); })
          .catch(function (err) { toast(err.message, "error"); });
      } else {
        loadImages();
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
    if (el.classList.contains("copy")) {
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
      openLightbox(el.getAttribute("data-url"));
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
      api("/api/image/toggle", { method: "POST", body: JSON.stringify({ id: id, enabled: enabled }) })
        .then(function () { toast(enabled ? t("op.toggleOn") : t("op.toggleOff")); })
        .catch(function (err) { toast(err.message || t("op.fail"), "error"); });
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
    if (lastImages !== null) renderGrid(lastImages);
  });
  $("search-clear").addEventListener("click", function () {
    searchQuery = "";
    $("search").value = "";
    this.classList.add("hidden");
    if (lastImages !== null) renderGrid(lastImages);
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
    api("/api/image/delete", { method: "POST", body: JSON.stringify({ id: id }) })
      .then(function () { toast(t("op.del")); loadImages(); })
      .catch(function (err) { toast(err.message || t("op.delFail"), "error"); });
  });
  $("confirm-modal").addEventListener("click", function (e) { if (e.target === this) closeConfirm(); });
  function closeConfirm() { pendingDelete = null; $("confirm-modal").classList.add("hidden"); }

  function openLightbox(url) {
    $("lightbox-img").src = url;
    $("lightbox-open").href = url;
    $("lightbox").classList.remove("hidden");
  }
  function closeLightbox() {
    $("lightbox").classList.add("hidden");
    $("lightbox-img").src = "";
  }
  $("lightbox").addEventListener("click", function (e) {
    if (e.target === $("lightbox") || e.target.classList.contains("close")) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!$("confirm-modal").classList.contains("hidden")) closeConfirm();
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
      loadImages();
    } else if (el.id === "folder-add") {
      var name = (window.prompt(t("folder.newPh")) || "").trim();
      if (!name) return;
      apiCreateFolder(name).then(function () {
        currentFolder = name;
        toast(t("folder.createOk"), "success");
        loadImages();
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
      api("/api/folder/rename", { method: "POST", body: JSON.stringify({ from: chipMenuFolder, to: name }) })
        .then(function () {
          if (currentFolder === chipMenuFolder) currentFolder = name;
          toast(t("folder.renameOk"), "success");
          loadImages();
        }).catch(function (err) { toast(err.message, "error"); });
    } else if (act === "delete") {
      if (!window.confirm(t("folder.deleteConfirm", { name: chipMenuFolder }))) return;
      api("/api/folder/delete", { method: "POST", body: JSON.stringify({ name: chipMenuFolder }) })
        .then(function () {
          if (currentFolder === chipMenuFolder) currentFolder = "";
          toast(t("folder.deleted"), "success");
          loadImages();
        }).catch(function (err) { toast(err.message, "error"); });
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
    setBusy(btn, true, t("set.busy"));
    api("/api/settings", { method: "PUT", body: JSON.stringify(body) })
      .then(function () { toast(t("op.saveOk"), "success"); })
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
    if (lastImages !== null) renderGrid(lastImages);
    refreshPreview();
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
      var n = Math.max(27, Math.min(81, Math.round((W * H) / 28888)));
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
