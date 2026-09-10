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
  // 预置壁纸：三色逐张手动填写（占位色可自行调整）；详情页「设为壁纸」会追加到本地壁纸池
  var WP_PRESET = [
    { url: "https://media.starpole.cc.cd/i/4988b4b501cf762d", name: "未花高马尾自拍.jpg", colors: ["#c3a9d6", "#f6d5e0", "#d9f1f8"] },
    { url: "https://media.starpole.cc.cd/i/b9934b9eb480c38b", name: "星野中秋秋星曜野 桂月垂光.jpg", colors: ["#0d47a1", "#f48fb1", "#ffca28"] },
    { url: "https://media.starpole.cc.cd/i/c52da7c8e34e85fd", name: "アズールレーン三周年記念.jpg", colors: ["#a2d2ff", "#c79cc7", "#fff6e0"] },
    { url: "https://media.starpole.cc.cd/i/f08f02803ac3b6c8", name: "一緒に日焼け止めを塗りましょう！.jpg", colors: ["#73b2e2", "#b48bd3", "#f8dabe"] },
    { url: "https://media.starpole.cc.cd/i/a1698bb8abab7647", name: "满穗海洋馆.jpg", colors: ["#4db1ff", "#a89cc8", "#2b364d"] },
    { url: "https://media.starpole.cc.cd/i/ea695337b23042a3", name: "橘望橘光蔚蓝档案三周年其一.jpg", colors: ["#49b9fa", "#58dabb", "#293b74"] },
    { url: "https://media.starpole.cc.cd/i/0dc3c7fb2276af47", name: "橘望橘光蔚蓝档案三周年其二.jpg", colors: ["#1d2f5c", "#7de2b8", "#d3f53f"] }
  ];
  // 纯 CSS 背景预置（url 用 "css:" 伪地址区分；css 为 .bg 的 background 值；scrim 为预定义亮度遮罩，跳过测光）
  var CSS_PRESET = [
    { url: "css:sky", i18n: "wp.bg.sky", name: "Sky", colors: ["#5eb2ef", "#8fd0f5", "#6fa8e8"], scrim: 100,
      css: "linear-gradient(180deg,#d8eeff,#b9dff9)" },
    { url: "css:pink", i18n: "wp.bg.pink", name: "Sakura", colors: ["#f08cb8", "#f5b0cd", "#e87aad"], scrim: 100,
      css: "linear-gradient(180deg,#ffe4ee,#ffcfe0)" },
    { url: "css:dawn", i18n: "wp.bg.dawn", name: "Daybreak", colors: ["#f5b878", "#f08ca8", "#6fa8e8"], scrim: 100,
      css: "radial-gradient(60% 50% at 18% 12%,#ffe9c9,transparent 70%),radial-gradient(50% 45% at 85% 18%,#ffd9e8,transparent 70%),radial-gradient(70% 60% at 50% 96%,#cfe8ff,transparent 75%),linear-gradient(180deg,#fff7ef,#fdf0f4)" },
    { url: "css:aurora", i18n: "wp.bg.aurora", name: "Aurora", colors: ["#48b8e8", "#9a86e8", "#4ed0a4"], scrim: 100,
      css: "radial-gradient(55% 45% at 15% 25%,#c9f0ff,transparent 70%),radial-gradient(50% 50% at 85% 28%,#d9ccff,transparent 70%),radial-gradient(65% 55% at 50% 92%,#c2f0db,transparent 75%),linear-gradient(180deg,#f3fbff,#f5f2ff)" },
    { url: "css:dusk", i18n: "wp.bg.dusk", name: "Dusk", colors: ["#e885ae", "#f0b485", "#85aee0"], scrim: 100,
      css: "radial-gradient(80% 60% at 82% 0%,rgba(255,255,255,.92),transparent 60%),linear-gradient(135deg,#ffe0ec 0%,#fff3e0 45%,#dfeaff 100%)" }
  ];
  var K_MODE = "mdn_wp_mode", K_FIXED = "mdn_wp_fixed", K_DECK = "mdn_wp_deck", K_CUSTOM = "mdn_wp_custom", K_POOL_ORDER = "mdn_wp_pool_order";
  function wls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function wlsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  var p = WP_PRESET[0].colors;
  (function () {
    // 壁纸池 = 预置 + 本地自定义；随机模式沿用「洗牌 + 游标」，固定模式按 URL 匹配
    var custom = [];
    try { custom = JSON.parse(wls(K_CUSTOM) || "[]") || []; } catch (e) { custom = []; }
    if (!Array.isArray(custom)) custom = [];
    var pool = WP_PRESET.concat(CSS_PRESET).concat(custom);
    // 随机集合：随机模式只从被框选的壁纸中轮换（空集回退全池）
    var randSet = [];
    try { randSet = JSON.parse(wls("mdn_wp_rand") || "[]") || []; } catch (e) { randSet = []; }
    if (!Array.isArray(randSet)) randSet = [];
    var sample = pool.filter(function (it) { return randSet.indexOf(it.url) !== -1; });
    if (!sample.length) sample = pool;
    var idx = sample.map(function (_, i) { return i; });
    var mode = wls(K_MODE) || "random";
    var wp = pool[0];
    if (mode === "fixed") {
      var fu = wls(K_FIXED) || "";
      for (var i = 0; i < pool.length; i++) { if (pool[i].url === fu) { wp = pool[i]; break; } }
    } else {
      var st = null;
      try { st = JSON.parse(wls(K_DECK) || "null"); } catch (e) { st = null; }
      var deck = st && Array.isArray(st.deck) && st.deck.length === sample.length ? st.deck : shuffle(idx.slice());
      var pos = st && typeof st.i === "number" ? st.i : 0;
      if (pos >= deck.length) { deck = shuffle(idx.slice()); pos = 0; }
      wp = sample[deck[pos]] || pool[0];
      pos++;
      if (pos >= deck.length) { deck = shuffle(idx.slice()); pos = 0; }
      wlsSet(K_DECK, JSON.stringify({ deck: deck, i: pos }));
    }
    p = wp.colors;
    // 交给主脚本：壁纸 img 淡入、设置页壁纸列表、点击特效换色都读这里
    window.__WP__ = { url: wp.url, name: wp.name, colors: wp.colors, mode: mode, pool: pool, randSet: randSet };
  })();
  var s = document.documentElement.style;
  s.setProperty("--c1", p[0]);
  s.setProperty("--grad-angle", "135deg");
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
  /* 文字色令牌：--text=「文字颜色」设置色（黑/白）；--muted=由 --text 派生（跟随设置）；
     --on-grad=主题渐变底按钮内文字（跟随设置）；--opposite=互斥组未选中对立色；--text-fixed=固定浅底控件文字（恒深色） */
  --text:#111827;--muted:color-mix(in srgb,var(--text) 62%,transparent);
  --on-grad:var(--text);--opposite:#ffffff;--text-fixed:#1f2937;
  /* 玻璃材质：白覆盖越低越通透，靠 saturate 提色而非白膜提亮（数值均可调） */
  --glass-chip:rgba(255,255,255,.55);   /* 小控件：轻微通透 */
  --glass-line:rgba(255,255,255,.65);
  /* 液态玻璃 token（浅色适配，借鉴 we-pkg-web）：--lg-refract 由 GlassController 按元素注入 */
  --lg-blur:24px;
  --lg-sat:175%;
  --lg-bright:1.05;
  --lg-scrim:.18;                          /* 背景亮度白遮罩（提亮侧），由外观面板的亮度滑条/自动测光覆写 */
  --lg-shade:0;                            /* 背景亮度黑遮罩（压暗侧） */
  --lg-tint-top:rgba(255,255,255,.04);
  --lg-tint-bottom:rgba(31,41,55,.03);
  --card-body-alpha:0.08;
  --lg-hairline:rgba(255,255,255,.55);
  --lg-inner-top:rgba(255,255,255,.75);
  --lg-inner-bottom:rgba(255,255,255,.25);
  --lg-shadow:0 18px 44px -16px rgba(31,41,55,.28),0 2px 10px rgba(31,41,55,.12);
  --lg-glow:rgba(124,196,255,.55);
  --lg-refract:;
  --radius:12px;
  --shadow:0 1px 2px rgba(31,41,55,.05),0 10px 30px rgba(31,41,55,.10);
  --grad:linear-gradient(var(--grad-angle,135deg),var(--c1),var(--c2),var(--c3));
}
/* 降级：系统「减弱透明度」或浏览器不支持背景滤镜时回退到实底玻璃（blur 0 + 高白 tint），避免糊字 */
@media (prefers-reduced-transparency:reduce){
  :root{--lg-blur:0px;--lg-tint-top:rgba(255,255,255,.94);--lg-tint-bottom:rgba(255,255,255,.94);--glass-chip:rgba(255,255,255,.92)}
}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  :root{--lg-blur:0px;--lg-tint-top:rgba(255,255,255,.94);--lg-tint-bottom:rgba(255,255,255,.94);--glass-chip:rgba(255,255,255,.92)}
}

/* ===== 液态玻璃四层结构（tint 渐变 + 噪点 + 高光 + 边缘光），作用于全站玻璃元素 ===== */
.glass,.card,.login-card,.modal-box,.origin-box,.detail-box{
  position:relative;
  border:1px solid var(--lg-hairline);
  background:
    linear-gradient(180deg,var(--lg-tint-top),var(--lg-tint-bottom)),
    radial-gradient(130% 90% at 50% -30%,rgba(255,255,255,.16),transparent 62%);
  box-shadow:
    inset 0 1px 0 var(--lg-inner-top),
    inset 0 -1px 0 var(--lg-inner-bottom),
    inset 0 0 0 1px rgba(255,255,255,.04),
    var(--lg-shadow);
  /* 声明顺序照抄参考站：标准属性（带 url 折射）在前，-webkit-（不带 url）在后。
     反过来写会让 Chromium 最终采用带 url() 的整条声明并丢弃它，磨砂与折射一起失效 */
  backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright)) var(--lg-refract,);
  -webkit-backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright));
  isolation:isolate;
}
/* 噪点：feTurbulence data-URI 平铺，消除大面积渐变色带，给玻璃实体感 */
.glass::before,.card::before,.login-card::before,.modal-box::before,.origin-box::before,.detail-box::before{
  content:"";position:absolute;inset:0;z-index:0;border-radius:inherit;pointer-events:none;
  opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
.glass>*,.card>*,.login-card>*,.modal-box>*,.origin-box>*,.detail-box>*{position:relative;z-index:1}
/* 文字颜色设置：html[data-text] 切换主文字色与对立色（--muted/--on-grad 派生自 --text，自动跟随） */
html[data-text="black"]{--text:#111827;--opposite:#ffffff}
html[data-text="white"]{--text:#ffffff;--opposite:#111827}
html,body{height:100%}
/* 背景层：.bg(壁纸) + .bg-scrim(白系遮罩)，对齐参考站的两层负 z 结构。
   ⚠ 内容层（.app / .login-screen）不要加 z-index：会创建 stacking context 把 backdrop 采样范围
     限制在容器内部，磨砂与折射会全部失效 */
.bg,.bg-scrim{position:fixed;inset:0;z-index:-2;pointer-events:none}
.bg img{width:100%;height:100%;object-fit:cover;object-position:center;opacity:0;transform:scale(1.02);transition:opacity .35s ease}
.bg img.show{opacity:1}
/* 亮度遮罩：白色系（本站浅色主题 + 深色正文），强度由「外观」面板的亮度滑条/自动测光写入 */
/* 亮度遮罩：>100% 用白遮罩提亮、<100% 用黑遮罩压暗（两层互斥，同时只会有一层不透明） */
.bg-scrim{z-index:-1;background:
  linear-gradient(180deg,rgba(0,0,0,calc(var(--lg-shade)*1.18)) 0%,rgba(0,0,0,var(--lg-shade)) 40%,rgba(0,0,0,calc(var(--lg-shade)*.9)) 100%),
  linear-gradient(180deg,rgba(255,255,255,calc(var(--lg-scrim)*.9)) 0%,rgba(255,255,255,var(--lg-scrim)) 40%,rgba(255,255,255,calc(var(--lg-scrim)*1.18)) 100%)}
/* 兜底：壁纸/CSS 背景加载前的纯色底（渐变兜底已移除，由图片池的 CSS 背景预置承担） */
html{background-color:#f4f2fb;scrollbar-gutter:stable}

/* ===== 滚动条美化（纯 CSS，滚动行为完全保留原生）=====
   ⚠ 1) 全局别写 scrollbar-width/color，Chrome 会丢弃下面的 webkit 渐变样式
      2) 条宽恒定 12px（hover 改宽会让容器内容抖动）；8→12px 靠 thumb 内缩边框实现
      3) 主页面槽位色来自根背景，不是 track；侧边栏槽位见下 */
/* 层级：scrollbar(槽位) > track(轨道) > thumb(滑块)，前两层都透明才算隐形 */
::-webkit-scrollbar{width:12px;height:12px;background:transparent}
::-webkit-scrollbar-track{background:rgba(255,255,255,0)} /* 0=隐形，想要槽位感调到 .3~.5 */
::-webkit-scrollbar-thumb{
  background:var(--grad);         /* 随随机主题自动变化 */
  background-size:100% 260%;
  border-radius:999px;
  border:2px solid transparent;   /* 可见宽度 8px，hover 时去掉边框展开到 12px */
  background-clip:padding-box;
  transition:border-width .15s ease;
}
::-webkit-scrollbar-corner{background:transparent} /* 交汇处不留白块 */
/* 鼠标移到滚动条或任一可滚动容器上 → 展开到 12px */
::-webkit-scrollbar-thumb:hover,
.sidebar:hover::-webkit-scrollbar-thumb,
.detail-box:hover::-webkit-scrollbar-thumb,
.od-items:hover::-webkit-scrollbar-thumb,
.br-fail:hover::-webkit-scrollbar-thumb,
textarea.auto-grow:hover::-webkit-scrollbar-thumb{border-width:0}
/* 侧边栏深色底上单独给个浅槽（数值可调） */
/* Firefox 只支持纯色，用 var(--accent) 同样跟随主题 */
@supports not selector(::-webkit-scrollbar){
  html{scrollbar-width:thin;scrollbar-color:var(--accent) transparent}
}
@media (prefers-reduced-motion:reduce){
  ::-webkit-scrollbar-thumb{transition:none}
}
/* 移动端：保留壁纸但削弱毛玻璃强度，平衡观感与流畅 */
@media (max-width:768px){
  :root{--lg-blur:10px;--lg-sat:150%}
  .img-card:not(.view-list) .card-body{background:rgba(255,255,255,.25)}
}
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;
  color:var(--text);font-size:14px;line-height:1.5;overflow-x:hidden;
  background:transparent
}

button{font-family:inherit;cursor:pointer;border:none;background:none}
input,select{font-family:inherit;font-size:14px}
a{color:var(--accent)}
.hidden{display:none!important}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* 主题渐变填充统一：禁止重复平铺。
   background-size 放大渐变（200%/220%）时默认 repeat 会平铺出"第二轮渐变"，
   在元素两侧露出 1~2px 异色（用户观察完全正确）。骨架屏 shimmer 依赖 repeat 做无缝滚动，故排除。 */
.fchip.active,.wp-mode-btn.active,.vt-opt.active,.dchip.active,.at-seg.active,.pg-num.active,
.nav-btn.active,.primary,#od-resolve-btn,.detail-wp-btn,.origin-dot,.lang-toggle{background-repeat:no-repeat}

/* 渐变流动动画已全部移除（logo / 侧边栏 / 语言控件 / 骨架屏均改为静态渐变） */

/* 无限动画层隔离：把每帧重绘限制在独立合成层内，避免连带祖先玻璃（登录卡/侧边栏/dock）
   的 backdrop 每帧重算 → GPU 常驻。动画本身全部保留 */
.logo{contain:paint} /* background-position 动画不可合成，contain 限制重绘不外溢（logo 无溢出内容） */
.lang-toggle{contain:layout paint} /* 伪元素渐变层靠 overflow 裁剪，contain 进一步限制布局影响 */
.lang-toggle svg{will-change:transform} /* rotateY 可合成：进独立合成层 */
.lang-toggle .sparkle{will-change:opacity,transform}
.lt-seg-opt.active::after{will-change:opacity,transform}
.skeleton,.sk-line{contain:paint} /* 骨架屏闪耀同理由 */

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
  /* 静态主题渐变（填充铺满、不重复）：渐变流动动画已全部移除 */
  background:var(--grad) var(--c1);background-size:100% 100%;background-repeat:no-repeat;
  box-shadow:0 6px 18px rgba(0,0,0,.2);transition:transform .15s ease,box-shadow .15s ease
}
.lang-toggle:hover{transform:translateY(-1px) scale(1.05);box-shadow:0 10px 26px rgba(0,0,0,.3)}
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
/* 星标位置收敛到控件内：父级 overflow:hidden（伪元素渐变层需要裁剪）会裁掉溢出的装饰 */
.lt-seg-opt.active::after{content:"✦";position:absolute;top:-3px;right:1px;font-size:9px;color:#fff;animation:twinkle 1.2s ease-in-out infinite;text-shadow:0 1px 3px rgba(0,0,0,.35)}
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
  width:340px;max-width:100%;border-radius:18px;padding:36px 32px;text-align:center;
  animation:cardIn .5s cubic-bezier(.2,.9,.3,1.15) /* 无 fill：玻璃元素动画结束后必须释放合成层，否则 backdrop 采样失效 */
}
.logo{
  font-size:28px;font-weight:800;letter-spacing:.5px;
  background:var(--grad);background-size:100% 100%;background-repeat:no-repeat;
  -webkit-background-clip:text;background-clip:text;color:transparent
  /* 流动动画已移除（静态渐变） */
}
.login-card .sub{color:var(--muted);margin:6px 0 22px;font-size:13px}
.login-card input{width:100%;padding:11px 14px;border:1px solid rgba(0,0,0,.12);border-radius:9px;margin-bottom:14px;outline:none;background:rgba(255,255,255,.8)}
.login-card input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 16%,transparent)}
.login-card .primary{width:100%;display:flex;align-items:center;justify-content:center;gap:8px}
.login-card .hint{margin-top:14px;font-size:12px;color:var(--muted)}

/* 布局 */
.app{display:flex;min-height:100vh} /* 无 z-index：见 .bg 注释 */
/* 侧边栏：玻璃材质（渐变填充与 shift 流动动画已剔除）。
   ⚠ 不可再加无限动画：侧边栏静止，动画会让它每帧重算 backdrop，GPU 常驻。
   烘焙策略：纳入 GlassController 静态组，仅初始化/切壁纸/改设置时烘焙一次。 */
.sidebar{
  width:220px;padding:18px 12px;display:flex;flex-direction:column;
  /* 内缩悬浮面板：上下各留 15px、左侧留 7px（sticky + calc 高度，不用 100vh 满高贴边） */
  position:sticky;top:15px;height:calc(100vh - 30px);margin-left:7px;border-radius:16px;
  border:1px solid var(--lg-hairline);
  background:
    linear-gradient(180deg,var(--lg-tint-top),var(--lg-tint-bottom)),
    radial-gradient(130% 90% at 50% -30%,rgba(255,255,255,.16),transparent 62%);
  box-shadow:
    inset 0 1px 0 var(--lg-inner-top),
    inset 0 -1px 0 var(--lg-inner-bottom),
    inset 0 0 0 1px rgba(255,255,255,.04),
    4px 0 30px -12px rgba(31,41,55,.22);
  backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright)) var(--lg-refract,);
  -webkit-backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright));
  isolation:isolate;
  color:var(--text)
}
.sidebar>*{position:relative;z-index:1}
.sidebar .brand{font-size:19px;font-weight:800;color:var(--text);padding:4px 10px 18px}
.sidebar nav{display:flex;flex-direction:column;gap:4px;flex:1}
.nav-btn{text-align:left;padding:10px 12px;border-radius:9px;color:var(--text);font-size:14px;transition:background .15s,color .15s}
.nav-btn:hover{background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}
/* active 用主题渐变胶囊（渐变下垫同色实底，避免圆角边缘透底） */
.nav-btn.active{background:var(--grad) var(--c1);color:var(--on-grad);box-shadow:0 4px 14px color-mix(in srgb,var(--accent) 35%,transparent)}
.logout{margin-top:8px;padding:9px 12px;border-radius:9px;color:var(--muted);font-size:13px;text-align:left;transition:background .15s,color .15s}
.logout:hover{background:color-mix(in srgb,#ef4444 12%,transparent);color:#dc2626}
/* 分页器 */
.pager{display:flex;align-items:center;justify-content:center;gap:6px;margin:18px 0 6px;flex-wrap:wrap}
.pager.hidden{display:none}
.pg-btn,.pg-num{min-width:34px;height:34px;padding:0 8px;border-radius:9px;border:1px solid rgba(0,0,0,.12);background:var(--glass-chip);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
.pg-btn:hover:not(:disabled),.pg-num:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-1px)}
.pg-btn:disabled{opacity:.4;cursor:default}
.pg-num.active{background:var(--grad) var(--c1);color:var(--on-grad);border:none;cursor:text}
.pg-num.active:hover{color:var(--on-grad);transform:none}
.pg-gap{color:var(--muted);padding:0 2px}
.pg-info{font-size:12px;color:var(--muted);margin-left:8px}
.pg-jump{width:52px;height:34px;border:1px solid var(--accent);border-radius:9px;outline:none;font-size:13px;font-weight:600;text-align:center;background:#fff;color:var(--text-fixed)}
.logout-in-settings{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 22px;border-radius:10px;font-size:14px;color:#fff;background:linear-gradient(160deg,#f43f5e,#ef4444);box-shadow:0 6px 18px rgba(239,68,68,.3);transition:transform .1s,box-shadow .15s,opacity .15s}
.logout-in-settings:hover{box-shadow:0 8px 24px rgba(239,68,68,.4)}
.logout-in-settings:active{transform:scale(.97)}
.main{flex:1;padding:28px 34px;width:100%;min-width:0}
.view{display:none}
/* 切视图不做整页淡入：.view 必须始终 opacity:1（祖先 opacity<1 会创建 backdrop root，
   动画期间内部玻璃采样不到壁纸）；此前用伪元素遮罩淡出，但关闭动效时 animation:none
   会让遮罩永远停在 opacity:1 → 整页白遮罩。视觉过渡交给卡片自带的 cardIn 入场动画 */
.view.active{display:block}
/* viewIn 带 transform，仅用于自身为 fixed 的灯箱/弹层；视图切换用纯淡入，避免 transform 包含块破坏内部 fixed 子元素 */
@keyframes viewIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* 卡片（玻璃本体样式由上方液态玻璃组提供，此处仅保留圆角） */
.card{
  border-radius:var(--radius)
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
.at-seg{flex:1;padding:10px 14px;border-radius:10px;font-size:14px;font-weight:600;color:var(--opposite);background:rgba(255,255,255,.55);border:1px solid rgba(0,0,0,.1);cursor:pointer;transition:all .18s ease}
.at-seg:hover{border-color:var(--accent);color:var(--text)}
/* 激活态用水平三色渐变：宽扁长条上 135deg 对角渐变会让第三色挤在角落，
   且 background-size 放大超过 100% 会把色标推出元素外 */
/* 激活态统一 var(--grad)：跟随设置的渐变方向；垫同色实底避免圆角边缘透底；去透明边框补偿 1px padding */
.at-seg.active{background:var(--grad) var(--c1);color:var(--on-grad);border:none;padding:11px 15px;box-shadow:0 6px 16px color-mix(in srgb,var(--accent) 38%,transparent)}
/* OneDrive 解析结果信息条 */
.od-info{display:flex;align-items:center;gap:10px;margin-top:12px;padding:10px 14px;border:1px dashed rgba(0,0,0,.16);border-radius:9px;background:rgba(255,255,255,.5)}
.od-icon{width:10px;height:10px;border-radius:3px;background:var(--grad);flex-shrink:0}
.od-name{font-weight:600;color:var(--text);word-break:break-all;min-width:0;flex:1}
.od-badge{flex-shrink:0;font-size:12px;padding:3px 10px;border-radius:999px;background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);white-space:nowrap}
.od-actions{display:flex;gap:10px;margin-top:14px}
.od-hint{color:var(--muted);font-size:12px;margin-top:10px;line-height:1.5}
/* 文件夹第一层子项选择列表 */
.od-items{margin-top:12px;border:1px dashed rgba(0,0,0,.16);border-radius:9px;background:var(--glass-chip);-webkit-backdrop-filter:blur(10px) saturate(1.7);backdrop-filter:blur(10px) saturate(1.7);max-height:240px;overflow:auto}
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
.batch-result{margin-top:12px;border:1px dashed rgba(0,0,0,.16);border-radius:9px;background:var(--glass-chip);-webkit-backdrop-filter:blur(10px) saturate(1.7);backdrop-filter:blur(10px) saturate(1.7);padding:10px 14px;font-size:13px}
.batch-result .br-summary{display:flex;align-items:center;gap:8px;font-weight:600}
.batch-result .br-fail{list-style:none;margin:8px 0 0;padding:0;max-height:200px;overflow:auto}
.batch-result .br-fail li{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-top:1px dashed rgba(0,0,0,.1)}
.batch-result .br-url{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.batch-result .br-err{flex-shrink:0;font-size:12px;color:#d33}
.batch-result .br-retry{flex-shrink:0;font-size:12px;padding:2px 10px;border-radius:999px;border:1px solid rgba(0,0,0,.15);cursor:pointer;background:#fff;color:var(--text-fixed)}
.batch-result .br-retry:hover{border-color:var(--accent);color:var(--accent)}
/* 次级按钮 */
.secondary{padding:11px 18px;border-radius:10px;font-size:14px;font-weight:600;background:var(--glass-chip);-webkit-backdrop-filter:blur(10px) saturate(1.7);backdrop-filter:blur(10px) saturate(1.7);border:1px solid rgba(0,0,0,.14);color:var(--text);cursor:pointer;transition:all .15s ease;white-space:nowrap}
.secondary:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-1px)}
.secondary:disabled{opacity:.6;cursor:default;transform:none}
.preview{margin-top:16px;display:flex;gap:14px;align-items:center;border:1px dashed rgba(0,0,0,.18);border-radius:9px;padding:10px}
.preview img{max-width:120px;max-height:90px;border-radius:6px;object-fit:contain;background:rgba(255,255,255,.7)}
.preview video{max-width:260px;max-height:140px;border-radius:6px;background:rgba(0,0,0,.05)}
.preview audio{width:260px}
.preview .muted{font-size:12px;word-break:break-all}

/* 文件夹栏 */
.folder-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 14px}
.fchip{padding:6px 14px;border-radius:999px;font-size:13px;background:var(--glass-chip);border:1px solid rgba(0,0,0,.1);color:var(--text);transition:all .15s}
.fchip:hover{transform:translateY(-1px);border-color:var(--accent)}
/* 渐变 active 态统一规范（对齐 .primary）：去掉透明边框（补偿 1px padding）+ 渐变下垫同色实底。
   垫底是为了让圆角边缘的半像素抗锯齿透出主题色而非父背景——这正是此前"两侧 1px 没被渐变覆盖"的成因
   （图片壁纸上尤其明显，纯 CSS 浅色背景时因色差小而不易察觉） */
.fchip.active{background:var(--grad) var(--c1);color:var(--on-grad);border:none;padding:7px 15px;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.fchip.add{background:rgba(255,255,255,.5);border-style:dashed;font-weight:700}
.fchip-wrap{position:relative;display:inline-flex;align-items:center;gap:3px;cursor:grab}
.fchip-wrap.dragging{opacity:.45}
.fchip-wrap.dragging:active{cursor:grabbing}
.fchip-ph{display:inline-flex;align-items:center;justify-content:center;min-width:40px;padding:6px 14px;margin:0 2px;border:2px dashed color-mix(in srgb,var(--accent) 62%,transparent);border-radius:999px;background:color-mix(in srgb,var(--accent) 12%,transparent);font-size:13px;line-height:1.4;color:color-mix(in srgb,var(--accent) 78%,#444);white-space:nowrap;vertical-align:middle;pointer-events:none;animation:phPulse 1.3s ease-in-out infinite}
.fchip-menu{width:24px;height:30px;border-radius:8px;background:rgba(255,255,255,.6);border:1px solid rgba(0,0,0,.08);color:var(--text-fixed);font-size:12px}
.fchip-menu:hover{background:#fff;color:var(--text-fixed)}
.chip-pop{
  position:fixed;z-index:1600;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);
  padding:6px;min-width:130px;display:flex;flex-direction:column;gap:2px
}
.chip-pop button{text-align:left;padding:7px 10px;border-radius:7px;font-size:13px;color:var(--text-fixed)}
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
/* 展示样式切换控件 */
.toolbar-right{display:flex;align-items:center;gap:10px}
.view-toggle{display:flex;align-items:center;background:var(--glass-chip);-webkit-backdrop-filter:blur(10px) saturate(1.7);backdrop-filter:blur(10px) saturate(1.7);border:1px solid rgba(0,0,0,.1);border-radius:999px;padding:3px;gap:3px}
.view-toggle.flip{animation:langFlip .45s ease}
.vt-opt{display:flex;align-items:center;justify-content:center;width:30px;height:26px;border-radius:999px;color:var(--opposite);transition:color .2s ease,background .25s ease,box-shadow .2s ease}
.vt-opt svg{width:16px;height:16px;display:block}
.vt-opt:hover{color:var(--accent2)}
.vt-opt.active{background:var(--grad) var(--c1);background-size:100% 100%;color:var(--on-grad);box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 35%,transparent);animation:segPop .4s cubic-bezier(.34,1.56,.64,1)}
.vt-opt.active svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.2))}

/* 图片网格 */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;align-items:stretch}
.img-card{overflow:hidden;display:flex;flex-direction:column;transition:transform .14s ease,box-shadow .14s ease;animation:cardIn .4s ease;cursor:grab}
.img-card.no-anim{animation:none}
/* hover：玻璃上浮时高光更亮（边缘光提亮 + 投影加深），模拟光掠过曲面 */
.img-card.hovered{transform:translateY(-3px);box-shadow:inset 0 1px 0 rgba(255,255,255,.92),inset 0 -1px 0 rgba(255,255,255,.2),0 14px 34px color-mix(in srgb,var(--accent) 28%,rgba(31,41,55,.10))}
.img-card:active{cursor:grabbing}
.img-card.drag-pickup{transition:transform .18s ease,opacity .18s ease,box-shadow .18s ease}
.img-card.dragging{opacity:.65;z-index:40;pointer-events:none;will-change:transform;box-shadow:0 16px 38px color-mix(in srgb,var(--accent) 24%,rgba(15,23,42,.20));border-radius:14px;user-select:none;-webkit-user-select:none}
.img-card.dragging *{pointer-events:none} /* 强制整个子树不可命中：子元素（select/button/img 等）默认 pointer-events:auto 会重新参与指针命中，必须用 CSS 锁死，否则 elementFromPoint 仍会命中 ghost 内部元素 */
body.no-select{user-select:none;-webkit-user-select:none}
.drop-placeholder{position:relative;display:flex;align-items:center;justify-content:center;border:2px dashed color-mix(in srgb,var(--accent) 62%,transparent);border-radius:14px;background:color-mix(in srgb,var(--accent) 10%,transparent);pointer-events:none;color:color-mix(in srgb,var(--accent) 80%,#fff);font-size:13px;font-weight:600;animation:phPulse 1.3s ease-in-out infinite;transition:transform .28s cubic-bezier(.2,.8,.2,1)}
@keyframes phPulse{0%,100%{box-shadow:inset 0 0 0 0 color-mix(in srgb,var(--accent) 30%,transparent)}50%{box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--accent) 35%,transparent)}}
@keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
/* 缩略图区保持实体感：不随卡片一起通透，避免图片与背景光斑混淆（白底可调） */
.thumb{position:relative;background:linear-gradient(160deg,color-mix(in srgb,var(--c1) 8%,#fff),color-mix(in srgb,var(--c3) 8%,#fff)),rgba(255,255,255,.55);aspect-ratio:1/0.96;min-height:0}
.thumb img,.thumb video{-webkit-user-drag:none;user-select:none}
.thumb img{width:100%;height:100%;object-fit:contain;display:block;transition:opacity .25s ease}
.thumb img.thumb-pending{opacity:0;position:absolute;inset:0;pointer-events:none}
.thumb video{width:100%;height:100%;object-fit:contain;display:block;background:rgba(255,255,255,.7)}
.thumb .zoom{position:absolute;right:8px;bottom:8px;background:rgba(15,23,42,.72);color:#fff;font-size:12px;padding:5px 10px;border-radius:6px;transition:background .15s}
.thumb .zoom:hover{background:rgba(15,23,42,.92)}
.thumb-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px;text-align:center;color:var(--muted)}
.thumb-fallback .tf-icon{font-size:22px}
.thumb-fallback .tf-id{font-size:11px;word-break:break-all;max-width:92%}
.card-body{padding:12px;display:flex;flex-direction:column;gap:7px;flex:1}
/* ===== 壁纸模式：信息区白色玻璃衬底 + 深色文字（通透但可读，纯色底零滤镜开销）===== */
.img-card:not(.view-list) .card-body{background:rgba(255,255,255,var(--card-body-alpha,.08))} /* 信息区底色，外观面板可调 */
.img-card .img-name,.img-card .img-name .t{color:var(--text)}
.img-card .img-name .pen{color:var(--muted)}
.img-card .img-id,.img-card .img-id .t{color:var(--muted)}
.img-card .img-url{color:var(--muted)}
.img-card .muted{color:var(--muted)}
.img-card .lst-time,.img-card .lst-size{color:var(--muted)}
.img-card .img-id .zoom-inline{background:rgba(255,255,255,.85);border-color:rgba(0,0,0,.12);color:var(--accent)}
/* 列表行整行白衬底 */
.img-card.view-list{background-color:rgba(255,255,255,var(--card-body-alpha,.08))}
.img-card.view-list .lst-name-hit .t{color:var(--text)}
/* 名称编辑框 */
.img-card .name-edit{background:#fff;color:var(--text-fixed)}
.card-top{display:flex;align-items:center;justify-content:space-between;min-height:22px;line-height:22px}
.badge{font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600}
.badge-proxy{background:color-mix(in srgb,var(--c1) 16%,#fff);color:var(--c1)}
/* 卡片内徽章数量多（每卡 1-2 个），只降白覆盖、不加 backdrop-filter，避免几十个滤镜拖垮滚动 */
.badge-dns{background:var(--glass-chip);color:var(--text);border:1px solid rgba(0,0,0,.08)}
.badge-type{background:var(--glass-chip);color:var(--text);border:1px solid rgba(0,0,0,.1)}
.badge-type-image{background:color-mix(in srgb,#3b82f6 14%,#fff);color:#2563eb;border-color:transparent}
.badge-type-audio{background:color-mix(in srgb,#10b981 14%,#fff);color:#059669;border-color:transparent}
.badge-type-video{background:color-mix(in srgb,#f59e0b 14%,#fff);color:#d97706;border-color:transparent}
.img-name{font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;line-height:20px;min-height:20px}
.img-name .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.img-name .pen{flex:none;font-size:11px;color:var(--muted);opacity:0;transition:opacity .15s}
.img-name:hover .pen{opacity:1}
.name-edit{width:100%;padding:5px 8px;font-size:14px;font-weight:600;border:1px solid var(--accent);border-radius:7px;outline:none}
.img-id{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--muted);line-height:16px;min-height:16px;display:flex;align-items:center;gap:6px}
.img-id .t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.img-id .zoom-inline{flex:none;background:rgba(255,255,255,.85);border:1px solid rgba(0,0,0,.12);color:var(--accent);font-size:11px;line-height:18px;padding:0 8px;border-radius:6px;transition:background .15s,color .15s,border-color .15s}
.img-id .zoom-inline:hover{background:#fff;color:var(--accent2);border-color:var(--accent)}
/* 列表展示：横条一行 */
/* 列表行仅 48px 高：高光带改用 px 收窄，避免按比例铺满整行盖住文字 */
.img-card.view-list{grid-column:1/-1;height:48px;justify-content:center;cursor:grab;background-image:linear-gradient(180deg,var(--glass-hi),rgba(255,255,255,.06) 12px,transparent 24px)}
.img-card.view-list .lst-body{display:flex;align-items:center;justify-content:center;padding:0;flex:1;min-width:0}
.img-card.view-list .lst-row{display:flex;align-items:center;gap:10px;width:100%;height:100%;padding:0 12px;min-width:0}
.img-card.view-list .lst-name{flex:1 1 240px;min-width:0;display:flex;align-items:center} /* 列宽自由伸缩（吸收剩余空间，不留白） */
.img-card.view-list .lst-name-hit{flex:1 1 560px;max-width:560px;min-width:0;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;line-height:1;cursor:pointer} /* 点击改名热区：从列最左起最大 560px（列窄则占满整列） */
.img-card.view-list .lst-name-hit .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.img-card.view-list .lst-name-hit .pen{flex:none;font-size:11px;color:var(--muted);opacity:0;transition:opacity .15s}
.img-card.view-list .lst-name-hit:hover .pen{opacity:1}
.img-card.view-list .badge{flex:none;white-space:nowrap;line-height:1}
.img-card.view-list .lst-id{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--muted);flex:0 1 120px;min-width:76px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1}
.img-card.view-list .fsel{flex:0 1 130px;width:auto;min-width:90px;padding:3px 6px;font-size:12px}
.img-card.view-list .lst-time{flex:0 1 100px;min-width:78px;color:var(--muted);font-size:12px;line-height:1}
.img-card.view-list .lst-size{flex:0 0 72px;color:var(--muted);font-size:12px;text-align:right;line-height:1}
.img-card.view-list .zoom-inline{flex:none;background:rgba(255,255,255,.85);border:1px solid rgba(0,0,0,.12);color:var(--accent);font-size:11px;line-height:18px;padding:0 8px;border-radius:6px;transition:background .15s,color .15s,border-color .15s}
.img-card.view-list .zoom-inline:hover{background:#fff;color:var(--accent2);border-color:var(--accent)}
.img-card.view-list .mini{padding:3px 9px;font-size:11px;line-height:1.4}
.img-card.view-list .switch{margin-right:0}
.img-card.view-list .lst-skel .sk-line{margin:0 auto}
/* 中等宽度：隐藏文件大小列 */
@media (max-width:1000px){
  .img-card.view-list .lst-size{display:none}
}
/* 窄屏：隐藏次要列（时间/大小/类型），保留核心列避免横向溢出 */
@media (max-width:720px){
  .img-card.view-list .lst-time,
  .img-card.view-list .lst-size,
  .img-card.view-list .badge-type{display:none}
  .img-card.view-list .fsel{min-width:80px}
}
.img-url{font-size:11px;color:var(--muted);line-height:15px;min-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fsel{width:100%;padding:5px 8px;font-size:12px;border:1px solid rgba(0,0,0,.12);border-radius:7px;background:rgba(255,255,255,.85);color:var(--text-fixed);cursor:pointer}
.fsel:focus{border-color:var(--accent)}
.actions{display:flex;align-items:center;gap:8px;margin-top:2px}
.mini{font-size:12px;padding:5px 11px;border-radius:7px;border:1px solid rgba(0,0,0,.12);background:rgba(255,255,255,.85);transition:background .15s,transform .1s}
.mini:hover{background:#fff;transform:translateY(-1px)}
.mini:active{transform:none}
.mini.danger{color:#dc2626;border-color:#f3c1c1}
.mini.danger:hover{background:#fef2f2}
.mini.copied{background:#16a34a;color:var(--on-grad);border-color:transparent}
.switch{position:relative;display:inline-flex;width:34px;height:20px;margin-right:auto;flex:none}
.switch input{opacity:0;width:0;height:0}
.switch span{position:absolute;inset:0;background:#d1d5db;border-radius:999px;transition:.2s}
.switch span:before{content:"";position:absolute;width:16px;height:16px;left:2px;top:2px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.switch input:checked + span{background:linear-gradient(135deg,#22c55e,#10b981)}
.switch input:checked + span:before{transform:translateX(14px)}

/* 骨架屏 */
/* 骨架屏：白灰微光流动（与主题三色渐变无关，保留） */
.skeleton{height:300px;border-radius:var(--radius);background:linear-gradient(100deg,rgba(255,255,255,.3) 20%,rgba(255,255,255,.62) 45%,rgba(255,255,255,.3) 70%);background-size:200% 100%;animation:shimmer 1.3s infinite;border:1px solid var(--glass-line)}
@keyframes shimmer{to{background-position:-200% 0}}

/* 占位卡：基本信息未就绪时的骨架 */
.img-card .thumb-loading{display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,color-mix(in srgb,var(--c1) 8%,#fff),color-mix(in srgb,var(--c3) 8%,#fff)),rgba(255,255,255,.55)}
.thumb-loading .thumb-spin{width:26px;height:26px;border-radius:50%;border:3px solid color-mix(in srgb,var(--accent) 18%,transparent);border-top-color:var(--accent);animation:spin .8s linear infinite;opacity:.7}
@keyframes spin{to{transform:rotate(360deg)}}
.body-skeleton{display:flex;flex-direction:column;gap:9px}
.sk-line{height:10px;border-radius:6px;background:linear-gradient(100deg,rgba(255,255,255,.28) 20%,rgba(255,255,255,.6) 45%,rgba(255,255,255,.28) 70%);background-size:200% 100%;animation:shimmer 1.3s infinite}
.sk-line.ht{height:14px}
.img-card.fill-done .thumb img{animation:cardFade .35s ease}
@keyframes cardFade{from{opacity:0}to{opacity:1}}

/* 设置 */
.page-title{font-size:18px;margin-bottom:18px}
.settings-form{display:flex;flex-direction:column;gap:18px;max-width:900px;margin:0 auto}
.group{padding:20px 22px}

.group h3{font-size:15px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(0,0,0,.08)}
.group label{display:block;font-size:13px;color:var(--text);margin-bottom:14px}
.group label small{color:var(--muted);display:block;margin-top:2px;font-size:12px}
/* 多值设置项（如白名单）用 textarea：随内容自动增高，满一行即伸展，长列表不再挤成一行 */
textarea.auto-grow{display:block;width:100%;min-height:38px;max-height:220px;resize:none;overflow-y:auto;padding:11px 14px;border:1px solid rgba(0,0,0,.12);border-radius:9px;outline:none;background:rgba(255,255,255,.85);font-family:inherit;font-size:14px;line-height:1.6;color:inherit;transition:border-color .15s,box-shadow .15s}
textarea.auto-grow:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.group input[type=text],.group input[type=number],.group input[type=url]{display:block;width:100%;margin-top:6px;padding:9px 12px;border:1px solid rgba(0,0,0,.12);border-radius:8px;outline:none;background:rgba(255,255,255,.85)}
.group input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.checkline{display:flex;align-items:center;gap:8px;margin-bottom:14px;font-size:14px;cursor:pointer}
.checkline input{width:16px;height:16px;accent-color:var(--accent)}
.readonly-box{background:rgba(255,255,255,.6);border:1px solid rgba(0,0,0,.08);border-radius:8px;padding:10px 12px;font-size:13px;color:var(--text-fixed);margin-top:6px}
.mode-radio-row{display:flex;gap:22px;margin-top:6px;flex-wrap:wrap}
.mode-radio-row label{display:flex;align-items:center;gap:7px;font-size:14px;cursor:pointer}
.mode-radio-row input{accent-color:var(--accent)}
.save-row{display:flex;justify-content:center;gap:12px;margin-top:4px;padding-bottom:10px}
.save-fixed{position:fixed;right:34px;bottom:28px;z-index:1000;box-shadow:0 10px 26px rgba(0,0,0,.28)}

/* 按钮 */
.primary{
  background:var(--grad) var(--c1);background-size:100% 100%;background-repeat:no-repeat;color:var(--on-grad);
  border:none;padding:11px 22px;
  border-radius:10px;font-size:14px;font-weight:700;letter-spacing:.3px;
  box-shadow:0 6px 18px color-mix(in srgb,var(--accent) 42%,transparent);
  transition:transform .12s ease,box-shadow .15s ease /* 渐变位移流动已移除 */
}
.primary:hover{transform:translateY(-1px);box-shadow:0 10px 26px color-mix(in srgb,var(--accent) 52%,transparent)}
.primary:active{transform:translateY(0)}
.primary:disabled{opacity:.6;cursor:default;box-shadow:none;transform:none}

/* toast */
.toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(90px);color:#fff;padding:11px 20px;border-radius:10px;font-size:14px;opacity:0;transition:.25s;z-index:2400;box-shadow:0 10px 34px rgba(0,0,0,.28);pointer-events:none;max-width:80vw}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast.success{background:var(--grad)}
.toast.error{background:linear-gradient(135deg,#f43f5e,#ef4444)}
.toast.info{background:linear-gradient(135deg,#f59e0b,#f97316)}
.toast.accent{background:var(--grad)}

/* 灯箱预览 */
.lightbox{position:fixed;inset:0;background:rgba(10,14,22,.86);display:flex;align-items:center;justify-content:center;z-index:2100;padding:24px;animation:viewIn .18s ease both}
.lightbox img,.lightbox video{max-width:94vw;max-height:86vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 60px rgba(0,0,0,.5)}
.lightbox audio{width:min(560px,92vw)}
.lightbox .close{position:absolute;top:16px;right:24px;color:#fff;font-size:36px;line-height:1;cursor:pointer;opacity:.85;transition:opacity .15s}
.lightbox .close:hover{opacity:1}
.lightbox .lightbox-actions{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:90vw}
.lightbox .openlink{color:#fff;text-decoration:none;background:rgba(255,255,255,.16);padding:8px 16px;border-radius:8px;font-size:13px;transition:background .15s;display:flex;align-items:center;gap:6px;white-space:nowrap}
.lightbox .openlink:hover{background:rgba(255,255,255,.3)}

/* 删除确认弹窗。⚠ 遮罩层禁止加 backdrop-filter：会成为祖先 backdrop root，
   导致内部玻璃盒（modal-box/detail-box）采样不到壁纸，磨砂/提亮全部失效。
   遮罩暗度控制在 .25：过暗会让弹窗玻璃的提亮（brightness）不可感知 */
.modal{position:fixed;inset:0;z-index:2300;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.25);padding:20px}
.modal-box{width:360px;max-width:100%;border-radius:14px;padding:22px;animation:popIn .16s ease-out}
/* popIn 只做纯淡入（无 scale）：transform 动画会让弹窗在中间帧被按缩小尺寸烘焙玻璃滤镜，
   动画结束后覆盖不全、需二次重建；纯淡入使打开瞬间即为最终尺寸，滤镜一次到位 */
@keyframes popIn{from{opacity:0}to{opacity:1}}
.modal-box h3{font-size:15px;margin-bottom:10px}
.modal-box p{font-size:13px;color:var(--text);line-height:1.6;word-break:break-all}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}

/* SSRF 白名单快捷添加弹窗：层级高于删除确认（2300）、低于 toast（2400）。遮罩不加 backdrop-filter（同 .modal 注释） */
.origin-modal{position:fixed;inset:0;z-index:2350;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.25);padding:20px}
.origin-box{width:420px;max-width:100%;border-radius:14px;padding:22px;animation:popIn .16s ease-out}
.origin-title{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;margin-bottom:10px}
.origin-dot{width:9px;height:9px;border-radius:50%;background:var(--grad);background-size:200% 200%;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 16%,transparent);flex-shrink:0}
.origin-desc{font-size:13px;color:var(--text);line-height:1.6;margin-bottom:14px;word-break:break-all}
.origin-host{display:inline-block;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;padding:2px 8px;border-radius:7px;background:color-mix(in srgb,var(--accent) 12%,transparent);border:1px solid color-mix(in srgb,var(--accent) 32%,transparent);color:var(--accent);word-break:break-all}
.origin-field label{display:block;font-size:12px;font-weight:600;color:var(--text);margin-bottom:6px}
.origin-field input{width:100%;padding:11px 14px;border:1px solid rgba(0,0,0,.12);border-radius:9px;outline:none;background:rgba(255,255,255,.85);font-size:13.5px;transition:border-color .15s,box-shadow .15s}
.origin-field input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.origin-hints{margin-top:12px;display:flex;flex-direction:column;gap:6px}
.origin-hint{font-size:12px;color:var(--muted);line-height:1.55}
.origin-hint.warn{color:#b45309}
.origin-err{display:none;font-size:12px;color:#ef4444;margin-top:10px;line-height:1.5}
.origin-err.show{display:block}
/* 主按钮沿用 .mini 尺寸（与删除确认弹窗按钮组一致）+ 水平三色渐变。
   hover 必须重申渐变背景：.mini:hover 有 background:#fff，同特异性下会覆盖渐变导致白底白字 */
.origin-ok{background:linear-gradient(90deg,var(--c1),var(--c2),var(--c3));color:var(--on-grad);border:none;box-shadow:0 6px 16px color-mix(in srgb,var(--accent) 32%,transparent);transition:filter .15s,box-shadow .15s,transform .1s,opacity .15s}
.origin-ok:hover{background:linear-gradient(90deg,var(--c1),var(--c2),var(--c3));filter:brightness(1.1);box-shadow:0 9px 22px color-mix(in srgb,var(--accent) 44%,transparent);transform:translateY(-1px)}
.origin-ok:active{transform:translateY(0);filter:brightness(.95);box-shadow:0 4px 12px color-mix(in srgb,var(--accent) 30%,transparent)}
.origin-ok:disabled{opacity:.6;filter:none;transform:none;box-shadow:none;cursor:default}

/* 壁纸取色弹窗：层级高于 origin-modal（2350）、低于 toast（2400） */
.wp-modal{z-index:2360}
.wp-desc{font-size:13px;color:var(--text);line-height:1.6;margin-bottom:12px}
.wp-colors{display:flex;gap:12px;margin-bottom:12px}
.wp-colors label{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:var(--text)}
.wp-colors input[type="color"]{width:52px;height:36px;border:1px solid rgba(0,0,0,.12);border-radius:8px;padding:2px;background:#fff;cursor:pointer}
.wp-preview{height:14px;border-radius:999px;margin:4px 0 2px;background:linear-gradient(90deg,#6366f1,#a855f7,#ec4899);transition:background .15s}
.wp-preset-label{margin:12px 0 4px;font-size:12px;font-weight:600;color:var(--muted)}
.wp-presets{display:flex;flex-direction:column;gap:8px}
.wp-presets .ap-slider input[type=range]{width:100%;accent-color:var(--accent)}

/* ===== 壁纸缩略图悬浮预设编辑器（即改即存，ESC 恢复打开前状态） ===== */
.wp-hover{
  position:absolute;z-index:2400;width:248px;padding:12px 14px;border-radius:14px;
  background:rgba(255,255,255,.82);border:1px solid rgba(255,255,255,.65);
  -webkit-backdrop-filter:blur(18px) saturate(1.6);backdrop-filter:blur(18px) saturate(1.6);
  box-shadow:var(--lg-shadow);color:var(--text);cursor:default;
  /* 隐藏必须用 display:none：absolute + opacity:0 依旧会把页面 scrollHeight 撑大，
     出现"滚动到底多出一块只有壁纸的空白区" */
  display:none;pointer-events:none;
}
.wp-hover.show{display:block;pointer-events:auto;animation:wpHoverIn .15s ease}
@keyframes wpHoverIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.wp-hover .wh-title{margin:0 0 6px;font-size:12px;font-weight:600;color:var(--muted)}
.wp-hover .wh-name{margin:0 0 8px;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wp-hover .wh-hint{margin:8px 0 0;font-size:11px;color:var(--muted)}
/*  wh-remove 是 id 不是 class：选择器必须用 #wh-remove */
#wh-remove{
  display:block;width:100%;margin-top:10px;padding:7px 0;border-radius:9px;font:inherit;font-size:12px;font-weight:600;
  color:#dc2626;background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.35);cursor:pointer;transition:background .15s
}
#wh-remove:hover{background:rgba(220,38,38,.14)}
/* 设置页壁纸分组 */
.wp-mode-row{display:flex;gap:8px;flex-wrap:wrap}
.wp-mode-btn{padding:7px 16px;border-radius:999px;font-size:13px;font-weight:600;background:var(--glass-chip);border:1px solid rgba(0,0,0,.12);color:var(--opposite);cursor:pointer;transition:all .15s}
.wp-mode-btn.active{background:var(--grad) var(--c1);color:var(--on-grad);border:none;padding:8px 17px}
/* 悬浮编辑器内的文字颜色按钮组（比设置页更紧凑） */
.wh-text-row{display:flex;align-items:center;gap:8px;margin-top:8px}
.wh-text-row .wh-text-label{font-size:12px;color:var(--muted);margin-right:auto}
.wh-text-row .wp-mode-btn{padding:5px 12px;font-size:12px}
.wh-text-row .wp-mode-btn.active{padding:5px 12px}

/* ===== 外观面板（折叠式；控件布局参照 we-pkg-web 的 dock，配色沿用本站浅色玻璃） ===== */
/* 外观 dock：常驻左下角的独立玻璃面板（脱离设置页），默认折叠 */
.ap-dock{
  position:fixed;left:4px;bottom:20px;z-index:1200;width:300px;
  border-radius:16px;overflow:hidden;
  background:
    linear-gradient(180deg,var(--lg-tint-top),var(--lg-tint-bottom)),
    radial-gradient(130% 90% at 50% -30%,rgba(255,255,255,.16),transparent 62%);
  border:1px solid var(--lg-hairline);
  box-shadow:
    inset 0 1px 0 var(--lg-inner-top),
    inset 0 -1px 0 var(--lg-inner-bottom),
    0 18px 44px -16px rgba(31,41,55,.35);
  -webkit-backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright));
  backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(var(--lg-bright));
  isolation:isolate;
}
.ap-dock .ap-body{max-height:min(72vh,620px);overflow-y:auto}
.ap-toggle{display:flex;align-items:center;gap:9px;width:100%;padding:15px 22px;font:inherit;font-size:15px;font-weight:600;color:var(--text);text-align:left}
.ap-dot{width:12px;height:12px;border-radius:50%;background:linear-gradient(180deg,#d7ecff,#58a7ee);box-shadow:0 0 10px var(--lg-glow);flex:none}
.ap-caret{margin-left:auto;width:8px;height:8px;border-right:2px solid var(--muted);border-bottom:2px solid var(--muted);transform:rotate(45deg);transition:transform .2s}
.ap-dock.open .ap-caret{transform:rotate(-135deg)}
.ap-body{padding:2px 22px 20px;display:flex;flex-direction:column;gap:14px}
/* 折叠靠 hidden 属性：display:flex 会覆盖 [hidden] 的 UA display:none，必须显式声明 */
.ap-body[hidden]{display:none}
.ap-label{margin:0;font-size:12px;font-weight:600;color:var(--muted)}
.ap-block{display:flex;flex-direction:column;gap:10px}
.ap-bg-nav{display:flex;align-items:stretch;gap:8px}
.ap-bg-list{flex:1;display:grid;grid-template-columns:repeat(auto-fill,44px);grid-auto-rows:44px;justify-content:space-evenly;gap:11px 7px;max-height:196px;overflow-y:auto;scrollbar-gutter:stable;padding:4px} /* 列宽行高双锁死：滚动条出现/条目增多都不改变格子尺寸 */
.ap-bg-list button{position:relative;width:44px;height:44px;padding:0;cursor:pointer;overflow:hidden;border-radius:11px;border:1px solid rgba(0,0,0,.12);background:rgba(255,255,255,.35)}
.ap-bg-list img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;transition:opacity .18s ease} /* 事件穿透到按钮：img 原生拖拽会劫持 pointer 手势 */
.ap-bg-list img.wp-thumb-off{opacity:0} /* 待加载/已卸载：隐藏，避免无 src 时闪现浏览器破图占位 */
/* 壁纸池拖拽占位：方形虚线框 + phPulse 脉冲（对照 fchip-ph） */
.ap-bg-ph{width:44px;height:44px;border:2px dashed color-mix(in srgb,var(--accent) 62%,transparent);border-radius:11px;background:color-mix(in srgb,var(--accent) 12%,transparent);animation:phPulse 1.3s ease-in-out infinite;pointer-events:none}
.ap-bg-css{width:100%;height:100%} /* 纯 CSS 背景预览色块（background 由 JS 写入） */
/* 随机集合框选标记：主题色描边 + 右上角渐变圆点 */
.ap-bg-list button.rand-in{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 55%,transparent)}
.ap-bg-list button.rand-in::after{content:"";position:absolute;top:3px;right:3px;width:8px;height:8px;border-radius:50%;background:var(--grad);box-shadow:0 0 0 2px rgba(255,255,255,.85)}
.ap-bg-list button[aria-pressed="true"]{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent),0 6px 16px -6px rgba(31,41,55,.45)}
.ap-field{display:flex;flex-direction:column;gap:6px;margin-bottom:0}
.ap-field input[type=url]{padding:7px 10px;border-radius:9px;border:1px solid rgba(0,0,0,.14);background:rgba(255,255,255,.5);color:var(--text)}
.ap-slider{display:flex;flex-direction:column;gap:5px;margin-bottom:0}
.ap-slider-top{display:flex;align-items:center;gap:8px}
.ap-slider-top small{margin-left:auto;color:var(--muted);font-size:12px}
.ap-slider input[type=range]{width:100%;accent-color:var(--accent)}
/* 拖滑条圆点时防止 label 文本被选中，触发浏览器"松开以搜索"浮条 */
.ap-slider,.ap-slider-top,.wp-hover,.wp-colors,.ap-switches{user-select:none;-webkit-user-select:none}
.ap-slider input,.wp-colors input{user-select:text;-webkit-user-select:text}
.ap-switches{display:flex;gap:20px;flex-wrap:wrap}
.ap-switch{display:flex;align-items:center;gap:8px;margin-bottom:0;cursor:pointer}
.ap-switch .switch{margin-right:0}
.ap-note{margin:0;font-size:12px;color:var(--muted);line-height:1.5}
.ap-note:empty{display:none}
/* 动效开关：外观面板关闭动效后全站过渡与动画归零。
   ⚠ 必须用 animation:none（而非缩短 duration）：duration .001s 会把全站 11 处 infinite
     循环动画（地球自转/星闪/渐变位移/骨架屏闪耀/转圈等）压成每秒千帧循环 = 抽搐 */
body.motion-off *,body.motion-off *::before,body.motion-off *::after{transition:none!important;animation:none!important}
/* 解析按钮与「设为壁纸」按钮用主题渐变（.secondary 的玻璃底 + 渐变覆盖，保留 hover/禁用态） */
#od-resolve-btn,.detail-wp-btn{background:var(--grad) var(--c1);background-size:100% 100%;background-repeat:no-repeat;color:var(--on-grad);border:none;font-weight:600;transition:transform .12s ease,box-shadow .15s ease}
#od-resolve-btn:hover,.detail-wp-btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px color-mix(in srgb,var(--accent) 40%,transparent)}
#od-resolve-btn:disabled,.detail-wp-btn:disabled{opacity:.6;background:var(--glass-chip);color:var(--text);box-shadow:none}
.detail-wp-btn{flex:none}

/* 媒体详情弹窗 */
.detail-modal{position:fixed;inset:0;z-index:2250;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.25);padding:18px}
/* ⚠ 此遮罩禁止加 backdrop-filter：它会使 detail-box 采样不到壁纸，玻璃提亮/磨砂全部失效 */
.detail-box{width:1026px;max-width:100%;max-height:92vh;overflow:auto;border-radius:22px;animation:popIn .16s ease-out}
.detail-head{display:flex;align-items:center;justify-content:space-between;padding:19px 24px 0}
.detail-head h3{font-size:20px;font-weight:600;color:var(--text)}
.detail-close{font-size:35px;line-height:1;color:var(--muted);cursor:pointer;transition:color .15s,transform .15s;background:none;border:none;padding:0 2px}
.detail-close:hover{color:#dc2626;transform:rotate(90deg)}
.detail-body{display:flex;gap:24px;padding:19px 24px 24px}
.detail-left{width:405px;flex:none;display:flex;flex-direction:column;gap:13px}
.detail-info{display:flex;flex-direction:column;gap:5px;color:var(--text)}
.detail-name{font-size:19px;font-weight:600;cursor:pointer;line-height:1.35;word-break:break-all;display:flex;align-items:center;gap:8px;color:var(--text);max-width:100%}
.detail-name:hover .pen{opacity:1}
.detail-name .pen{opacity:.6}
.detail-name input{width:100%;font-size:17px;padding:5px 11px;border-radius:6px;border:1px solid var(--accent);outline:none;color:var(--text-fixed)}
.detail-folder{font-size:16px;color:var(--muted);display:flex;align-items:center;gap:8px;max-width:100%;word-break:break-all}
.detail-folder select{width:100%;font-size:16px;padding:5px 11px;border-radius:8px;border:1px solid rgba(0,0,0,.15);background:#fff;color:var(--text-fixed);outline:none;cursor:pointer}
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
.dchip{padding:8px 19px;border-radius:999px;font-size:17px;background:var(--glass-chip);-webkit-backdrop-filter:blur(10px) saturate(1.7);backdrop-filter:blur(10px) saturate(1.7);border:1px solid rgba(0,0,0,.1);color:var(--opposite);transition:all .15s;font-weight:500}
.dchip:hover{transform:translateY(-1px);border-color:var(--accent)}
.dchip.active{background:var(--grad) var(--c1);color:var(--on-grad);border:none;padding:9px 20px;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.detail-preview{margin-top:3px}
.detail-preview textarea{width:100%;min-height:97px;resize:vertical;padding:14px 16px;border-radius:10px;border:1px solid rgba(0,0,0,.12);background:#fafafa;color:var(--text-fixed);font-size:17px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;line-height:1.6;word-break:break-all}
.detail-preview textarea:focus{border-color:var(--accent);outline:none}
.detail-copy-btn{align-self:flex-start;margin-top:3px}
.detail-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}
.detail-del-btn{flex:none;padding:11px 22px;font-size:14px;font-weight:700;border-radius:10px;border:none;background:#dc2626;color:#fff;transition:background .15s}
.detail-del-btn:hover{background:#b91c1c}

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
  .detail-body{flex-direction:column}
  .detail-left{width:100%}
  .detail-media{min-height:270px}
  .detail-thumb img,.detail-thumb video{max-height:324px}
}
@media (prefers-reduced-motion: reduce){
  *,*:before,*:after{animation:none!important;transition:none!important}
  .sidebar,.logo,.primary,.lang-toggle,.lang-toggle svg,.lt-seg-opt,.lt-seg-opt::after{animation:none}
}
/* ===== 文字颜色体系收尾：固定浅底控件恒用深色文字 =====
   这些控件底色为不透明/高不透明度的白，若跟随「文字颜色 = 白色」会变成白底白字不可读。
   注意：集中规则放在样式表末尾，用于兜住未显式声明 color 的同类控件 */
.login-card input,.add-row input,.add-row2 input,.add-row2 select,.add-row textarea,.toolbar input,
textarea.auto-grow,.group input[type=text],.group input[type=number],.group input[type=url],.origin-field input,
.mini,.pg-jump,.batch-result .br-retry,.name-edit,.fsel,.readonly-box,.fchip-menu,.ap-field input[type=url],
.detail-name input,.detail-folder select,.detail-preview textarea{color:var(--text-fixed)}
/* 悬浮壁纸编辑器：白玻璃底(0.82)，整块恒用深色文字（含内部 --muted 派生，避免半透明白字压在白底上） */
.wp-hover{color:var(--text-fixed);--muted:color-mix(in srgb,var(--text-fixed) 62%,transparent)}
/* ===== 拖拽跨页热区：左右各约 5% 视口宽、50% 高（垂直居中），光标停留 1.5s 翻页 =====
   宽高由 JS 按视口计算写入；首/末页由 JS 置 display:none 控制不展示对应侧 */
.page-zone{
  position:fixed;top:25%;z-index:2380;display:flex;align-items:center;justify-content:center;
  border:2px dashed color-mix(in srgb,var(--accent) 55%,transparent);border-radius:16px;
  background:color-mix(in srgb,var(--accent) 9%,transparent);pointer-events:none;
  opacity:.72;transition:opacity .18s ease,background .18s ease,border-color .18s ease
}
.page-zone-left{left:8px}
/* 亮度滑条：百分比数值靠右（亮度项多一个数值节点） */
.ap-slider-top #ap-bright-val{margin-left:auto}
.page-zone-right{right:8px}
.page-zone span{
  writing-mode:vertical-rl;text-orientation:upright;font-size:12px;font-weight:600;line-height:1.25;
  color:var(--text);text-align:center;padding:0 2px;user-select:none
}
.page-zone.hot{
  opacity:1;border-color:var(--accent);background:color-mix(in srgb,var(--accent) 22%,transparent);
  animation:zoneFill 1.5s linear forwards
}
@keyframes zoneFill{
  from{box-shadow:inset 0 0 0 0 color-mix(in srgb,var(--accent) 40%,transparent)}
  to{box-shadow:inset 0 0 0 14px transparent}
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

<div class="bg"><img id="wallpaper" alt="" decoding="async" /></div>
<div class="bg-scrim"></div>
<svg id="lg-defs" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><defs></defs></svg>
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
        <div class="toolbar-right">
          <div class="view-toggle" id="view-toggle" role="group" data-i18n-aria="view.toggle" aria-label="展示样式">
            <button type="button" class="vt-opt" data-view="thumb" data-i18n-aria="view.thumb" aria-label="图片展示" title="图片展示">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/></svg>
            </button>
            <button type="button" class="vt-opt" data-view="list" data-i18n-aria="view.list" aria-label="列表展示" title="列表展示">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5h6"/><path d="M15 12h6"/><path d="M3 19h18"/><path d="m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12"/><path d="M3.92 10h6.16"/></svg>
            </button>
          </div>
          <div class="search-wrap">
            <input id="search" type="search" data-i18n-ph="search.ph" />
            <button id="search-clear" class="search-clear hidden" data-i18n-aria="search.clear" aria-label="清空搜索">&times;</button>
          </div>
        </div>
      </div>
      <div id="empty" class="empty hidden"></div>
      <div id="grid" class="grid"></div>
      <div id="pager" class="pager hidden"></div>
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
          <label><span data-i18n="set.displaySource"></span><small data-i18n="set.displaySource.hint"></small>
            <span class="mode-radio-row">
              <label><input type="radio" name="displaySource" id="displaySourceUpstream" value="upstream" /><span data-i18n="set.displaySource.upstream"></span></label>
              <label><input type="radio" name="displaySource" id="displaySourceSite" value="site" /><span data-i18n="set.displaySource.site"></span></label>
            </span>
          </label>
        </div>

        <div class="card group">
          <h3 data-i18n="set.group.origin"></h3>
          <label><span data-i18n="set.allowedOrigins"></span><textarea id="allowedOrigins" class="auto-grow" rows="1" spellcheck="false" data-i18n-ph="set.allowedOrigins.ph"></textarea><small data-i18n="set.allowedOrigins.hint"></small></label>
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
          <label><span data-i18n="set.thumbCache"></span><input id="thumbCache" type="number" min="1" max="20" step="1" data-i18n-ph="set.thumbCache.ph" /><small data-i18n="set.thumbCache.hint"></small></label>
          <label><span data-i18n="set.wpThumbKeep"></span><input id="wpThumbKeep" type="number" min="0" max="30" step="1" data-i18n-ph="set.wpThumbKeep.ph" /><small data-i18n="set.wpThumbKeep.hint"></small></label>
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

<!-- 外观 dock：常驻左下角，默认折叠，脱离设置页（z 低于弹窗 2300 与 toast 2400） -->
<div id="ap-dock" class="ap-dock hidden">
  <button type="button" class="ap-toggle" id="ap-toggle" aria-expanded="false" aria-controls="ap-body">
    <span class="ap-dot" aria-hidden="true"></span>
    <span data-i18n="set.group.appearance"></span>
    <span class="ap-caret" aria-hidden="true"></span>
  </button>
  <div class="ap-body" id="ap-body" hidden>
    <div class="ap-block">
      <p class="ap-label" data-i18n="set.wp.pool"></p>
      <div class="ap-bg-nav">
        <div id="ap-bg-list" class="ap-bg-list" role="group" aria-label="wallpaper pool"></div>
      </div>
      <label class="ap-field"><span data-i18n="set.wp.mode"></span>
        <span class="wp-mode-row" id="wp-mode">
          <button type="button" class="wp-mode-btn" data-mode="random" data-i18n="set.wp.random"></button>
          <button type="button" class="wp-mode-btn" data-mode="fixed" data-i18n="set.wp.fixed"></button>
        </span>
      </label>
      <p class="ap-label" data-i18n="set.wp.cssRow"></p>
      <div id="ap-css-row" class="ap-bg-list ap-css-row" role="group" aria-label="solid backgrounds"></div>
      <label class="ap-field"><span data-i18n="set.wp.custom"></span>
        <input type="url" id="ap-custom" placeholder="https://…" />
      </label>
    </div>

    <label class="ap-field"><span data-i18n="set.ap.textColor"></span>
      <span class="wp-mode-row" id="ap-text-color">
        <button type="button" class="wp-mode-btn" data-text-color="black" data-i18n="set.ap.textBlack"></button>
        <button type="button" class="wp-mode-btn" data-text-color="white" data-i18n="set.ap.textWhite"></button>
      </span>
    </label>

    <label class="ap-slider">
      <span class="ap-slider-top"><span data-i18n="set.ap.bright"></span><small id="ap-bright-val"></small></span>
      <input type="range" id="ap-bright" min="0" max="200" step="1" />
    </label>
    <label class="ap-slider">
      <span class="ap-slider-top"><span data-i18n="set.ap.blur"></span><small id="ap-blur-val">24</small></span>
      <input type="range" id="ap-blur" min="0" max="40" step="1" />
    </label>
    <label class="ap-slider">
      <span class="ap-slider-top"><span data-i18n="set.ap.sat"></span><small id="ap-sat-val">175%</small></span>
      <input type="range" id="ap-sat" min="100" max="260" step="5" />
    </label>
    <label class="ap-slider">
      <span class="ap-slider-top"><span data-i18n="set.ap.lum"></span><small id="ap-lum-val">105%</small></span>
      <input type="range" id="ap-lum" min="80" max="140" step="1" />
    </label>
    <label class="ap-slider">
      <span class="ap-slider-top"><span data-i18n="set.ap.cardBody"></span><small id="ap-body-val">8%</small></span>
      <input type="range" id="ap-body-alpha" min="0" max="100" step="1" />
    </label>

    <div class="ap-switches">
      <label class="ap-switch"><span data-i18n="set.ap.refract"></span>
        <span class="switch"><input type="checkbox" id="ap-refract" /><span></span></span>
      </label>
      <label class="ap-switch"><span data-i18n="set.ap.motion"></span>
        <span class="switch"><input type="checkbox" id="ap-motion" checked /><span></span></span>
      </label>
    </div>
    <p class="ap-note" id="ap-note"></p>
  </div>
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
<div id="origin-modal" class="origin-modal hidden">
  <div class="origin-box" role="dialog" aria-modal="true" aria-labelledby="origin-title">
    <h3 id="origin-title" class="origin-title"><span class="origin-dot"></span><span data-i18n="origin.title"></span></h3>
    <p class="origin-desc" id="origin-desc"></p>
    <div class="origin-field">
      <label for="origin-domain" data-i18n="origin.domain"></label>
      <input id="origin-domain" type="text" spellcheck="false" autocomplete="off" data-i18n-ph="origin.domain.ph" />
    </div>
    <div class="origin-hints">
      <div class="origin-hint" data-i18n="origin.hint.sub"></div>
      <div class="origin-hint warn" data-i18n="origin.hint.warn"></div>
    </div>
    <div class="origin-err" id="origin-err"></div>
    <div class="modal-actions">
      <button id="origin-cancel" class="mini" data-i18n="origin.cancel"></button>
      <button id="origin-ok" class="mini origin-ok" data-i18n="origin.ok"></button>
    </div>
  </div>
</div>
<div id="wp-modal" class="modal wp-modal hidden">
  <div class="modal-box" role="dialog" aria-modal="true">
    <h3 id="wp-modal-title" data-i18n="wp.title"></h3>
    <p class="wp-desc" id="wp-modal-desc" data-i18n="wp.desc"></p>
    <div class="wp-colors">
      <label><input type="color" id="wp-c1" /><span data-i18n="wp.color1"></span></label>
      <label><input type="color" id="wp-c2" /><span data-i18n="wp.color2"></span></label>
      <label><input type="color" id="wp-c3" /><span data-i18n="wp.color3"></span></label>
    </div>
    <div class="wp-preview" id="wp-preview"></div>
    <p class="wp-preset-label" data-i18n="wp.preset.label"></p>
    <div class="wp-presets">
      <label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.bright"></span><small id="wp-scrim-val"></small></span>
        <input type="range" id="wp-scrim" min="0" max="200" step="1" /></label>
      <label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.blur"></span><small id="wp-blur-val"></small></span>
        <input type="range" id="wp-blur" min="0" max="40" step="1" /></label>
      <label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.sat"></span><small id="wp-sat-val"></small></span>
        <input type="range" id="wp-sat" min="100" max="260" step="5" /></label>
      <label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.lum"></span><small id="wp-lum-val"></small></span>
        <input type="range" id="wp-lum" min="80" max="140" step="1" /></label>
      <label class="ap-slider"><span class="ap-slider-top"><span data-i18n="wp.gradAngle"></span><small id="wp-grad-val"></small></span>
        <input type="range" id="wp-grad" min="0" max="360" step="5" /></label>
    </div>
    <p class="ap-note" data-i18n="wp.preset.hint"></p>
    <div class="modal-actions">
      <button id="wp-cancel" class="mini" data-i18n="confirm.cancel"></button>
      <button id="wp-ok" class="mini origin-ok" data-i18n="wp.ok"></button>
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
        <div class="detail-actions">
          <button id="detail-copy-btn" class="primary detail-copy-btn" data-i18n="detail.copy"></button>
          <button id="detail-wp-btn" class="secondary detail-wp-btn" data-i18n="detail.wp"></button>
          <button id="detail-del-btn" class="detail-del-btn" data-i18n="card.del"></button>
        </div>
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
  var selectedFolders = []; // 多选文件夹筛选；空数组 = 全部
  var searchQuery = "";
  var addPendingFolder = "";
  var lastPreviewHost = "";
  var rateMeta = null;
  var appSettings = {}; // 全局设置缓存（含 displaySource 统一网页展示图源），缩略图与灯箱渲染时读取
  var detailModalImg = null; // 详情弹窗当前媒体对象
  var detailSrc = "site"; // 详情弹窗复制源：site=网站链接 / upstream=上游链接
  var detailFmt = "url"; // 详情弹窗复制格式：url / html / markdown / bbcode
  var THUMB_PAGES_KEY = "media_dns_thumb_pages"; // 缩略图缓存页数（旧张数键 media_dns_thumb_cache 已弃用，不再读写）
  var WP_THUMB_KEEP_KEY = "mdn_wp_thumb_keep"; // 壁纸池长效保留阈值
  function clampThumbPages(v) { return v >= 1 && v <= 20 ? v : 4; } // 不在 1-20 一律兜底 4 页（默认值）
  function clampWpKeep(v) { return v >= 0 && v <= 30 ? v : 12; } // 不在 0-30 一律兜底 12；0 = 每次关闭都重新加载
  var thumbCachePages = clampThumbPages(parseInt(localStorage.getItem(THUMB_PAGES_KEY), 10));
  var wpThumbKeep = clampWpKeep(parseInt(localStorage.getItem(WP_THUMB_KEEP_KEY), 10));
  var VIEW_MODE_KEY = "mdn_view_mode";
  var viewMode = localStorage.getItem(VIEW_MODE_KEY) === "list" ? "list" : "thumb"; // thumb=图片展示 / list=列表展示
  var sizeCache = {}; // 列表模式文件大小缓存（id → 格式化字符串）
  var gridState = { cols: 1, vis: null };
  var pager = { page: 1 }; // 当前页码（每页张数见 perPageCount）
  var renderDoneCb = null; // 渲染队列处理完成后回调（切样式动画等需等待渲染就位）
  var thumbObserver2 = null;
  var thumbObsTargets = [];
  // ===== 图源池：url → Image 强引用。卡片缩略图 / 详情页 / 灯箱大图（含列表样式预加载）共用同一份
  // 下载与解码数据；cachePages 按「样式 × 页」记账 url，跨样式合计不超「缓存页数 × 每页张数」。
  // 同一 url 可同时存在于多个页记录中（如在另一样式/另一页也被缓存）：只有当所有引用它的页都被淘汰后，
  // 该 url 才彻底出池；这样共有图会跟随最后一个引用页一起淘汰，不会被永久豁免 =====
  var imgPool = new Map(); // url → { img: HTMLImageElement, ready: bool, lastUse: number }
  var cachePages = { thumb: [], list: [] }; // 样式 → [{ page: 页码, urls: [url...], lastUse: 时间戳 }]
  // autoLoad：预加载场景（列表预加载/详情/灯箱）传 true 立即加载；卡片路径传 false 只占位记账，
  // 待 DOM 缩略图加载成功后再由 reveal 补录加载（此时浏览器缓存已命中，零网络，且不绕过并发队列）
  function poolGet(url, autoLoad) {
    var e = imgPool.get(url);
    if (e) {
      e.lastUse = Date.now();
      if (autoLoad && !e.img.getAttribute("src")) e.img.src = url;
      return e;
    }
    var im = new Image();
    im.decoding = "async";
    if (autoLoad) im.src = url;
    e = { img: im, ready: false, lastUse: Date.now() };
    im.onload = function () { e.ready = true; };
    im.onerror = function () { imgPool.delete(url); }; // 加载失败出池，不占用缓存记账名额
    imgPool.set(url, e);
    return e;
  }
  function currentViewGroup() { return viewMode === "list" ? "list" : "thumb"; }
  // 取（或建）某样式下指定页的记账记录
  function cachePageRec(group, page, create) {
    var arr = cachePages[group] || (cachePages[group] = []);
    for (var i = 0; i < arr.length; i++) if (arr[i].page === page) return arr[i];
    if (!create) return null;
    var rec = { page: page, urls: [], lastUse: Date.now() };
    arr.push(rec);
    return rec;
  }
  function cacheGroupAdd(url) { // 记入「当前样式 + 当前页」（同 url 可同时存在于多个页记录）
    var rec = cachePageRec(currentViewGroup(), pager.page, true);
    rec.lastUse = Date.now();
    if (rec.urls.indexOf(url) === -1) rec.urls.push(url);
  }
  function cachePageTouch() { // 标记当前样式当前页最近被访问（翻页/渲染时调用，保证 LRU 准确）
    var rec = cachePageRec(currentViewGroup(), pager.page, false);
    if (rec) rec.lastUse = Date.now();
  }
  function urlInAnyPage(url) {
    var g, i, j;
    for (g in cachePages) {
      var arr = cachePages[g];
      for (i = 0; i < arr.length; i++) if (arr[i].urls.indexOf(url) !== -1) return true;
    }
    return false;
  }
  function dropUrlFromPages(url) { // 从所有页记录中解除该 url 引用，并清掉空页
    var g, i, k;
    for (g in cachePages) {
      var arr = cachePages[g];
      for (i = arr.length - 1; i >= 0; i--) {
        k = arr[i].urls.indexOf(url);
        if (k !== -1) arr[i].urls.splice(k, 1);
        if (!arr[i].urls.length) arr.splice(i, 1);
      }
    }
  }
  function cacheGroupRemove(url) { // 解除所有页引用；若无任何页再引用则出池
    dropUrlFromPages(url);
    if (!urlInAnyPage(url)) imgPool.delete(url);
  }
  function poolClearAll() { imgPool.clear(); cachePages = { thumb: [], list: [] }; }
  // 缓存诊断（控制台执行 __mediaCache() 查看实况）：不参与正常逻辑，仅观测
  var evictLog = { runs: 0, removed: 0 };
  window.__mediaCache = function () {
    function pagesOf(g) {
      return (cachePages[g] || []).map(function (r) { return { page: r.page, n: r.urls.length }; });
    }
    return {
      pages: thumbCachePages,                       // 页数上限（图片/列表两样式页组合计）
      groupCount: poolPageCount(),                  // 当前已缓存页组总数
      perPage: perPageCount(),                      // 当前样式每页张数
      pool: imgPool.size,                           // 池内实际条目数（去重后）
      grouped: { thumb: pagesOf("thumb"), list: pagesOf("list") }, // 按样式×页分组的各组张数
      evictions: { runs: evictLog.runs, removed: evictLog.removed }
    };
  };

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
      "drag.escCancel": "按下 ESC 取消拖拽",
      "drag.pageHint": "将光标拖至此处翻页",
      "search.ph": "搜索名称 / ID / 地址…",
      "search.clear": "清空搜索",
      "view.toggle": "展示样式",
      "view.thumb": "图片展示",
      "view.list": "列表展示",
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
      "op.sortOk": "排序保存成功，KV同步需要一会",
      "op.sortCancelled": "已取消排序",
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
      "set.displaySource": "网页展示图源",
      "set.displaySource.hint": "媒体卡片缩略图、详情页、预览页的图片/封面统一取自上游媒体源，或本网站代理后的网站媒体源；三处共用同一份图片缓存。仅「缓存代理+DNS」模式的媒体支持网站源（「仅DNS」为302直跳，始终用上游）。视频封面因跨域截帧限制，缓存代理模式下始终走网站代理链接。",
      "set.displaySource.upstream": "上游媒体源",
      "set.displaySource.site": "网站媒体源",
      "set.group.origin": "上游（图床）",
      "set.allowedOrigins": "允许代理的域名（SSRF 白名单，逗号加空格分隔）",
      "set.allowedOrigins.ph": "如 img.example.com, img2.example.com",
      "set.allowedOrigins.hint": "只允许 fetch 这些域名，防止把 Worker 当跳板访问任意地址。必须配置，否则无法添加链接。",
      "set.originReferer": "上游 Referer（转发给图床，应对图床防盗链）",
      "set.originReferer.ph": "如 https://img.example.com/",
      "set.originUserAgent": "上游 User-Agent（转发给图床，留空用默认）",
      "set.originUserAgent.ph": "留空即可",
      "origin.title": "域名未加入 SSRF 白名单",
      "origin.desc": "该链接的域名 {host} 不在允许代理的白名单中，加入后才能添加此媒体。",
      "origin.domain": "要加入白名单的域名",
      "origin.domain.ph": "如 img.example.com",
      "origin.hint.sub": "规则：加入 example.com 会自动放行 img.example.com 等所有子域。",
      "origin.hint.warn": "注意：加入后该域名下的任意路径都会被 Worker 代理，请仅添加你信任的域名。",
      "origin.cancel": "取消",
      "origin.ok": "加入白名单并重试",
      "origin.saving": "保存中…",
      "origin.err.empty": "请填写要加入的域名",
      "origin.err.invalid": "域名格式无效，请只填写域名部分",
      "origin.exists": "该域名已在白名单中，无需重复添加",
      "origin.saveOk": "已加入白名单，正在重新添加…",
      "origin.retryLater": "白名单已保存，请稍候片刻再试",
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
      "set.group.appearance": "外观",
      "set.wp.mode": "壁纸模式",
      "set.wp.random": "随机",
      "set.wp.fixed": "固定",
      "set.wp.pool": "壁纸池",
      "set.wp.cssRow": "纯色背景",
      "set.wp.custom": "自定义壁纸 URL（留空则只用壁纸池）",
      "set.ap.bright": "背景亮度",
      "set.ap.blur": "磨砂强度",
      "set.ap.sat": "饱和度",
      "set.ap.lum": "玻璃提亮",
      "set.ap.refract": "边缘折射",
      "set.ap.motion": "动效",
      "set.ap.noRefract": "当前浏览器不支持边缘折射，已使用纯 CSS 玻璃。",
      "set.ap.badUrl": "自定义地址需要是完整的 http(s) 图片链接。",
      "set.ap.cardBody": "信息区底色",
      "set.ap.textColor": "文字颜色",
      "set.ap.textBlack": "黑色文字",
      "set.ap.textWhite": "白色文字",
      "wp.bg.white": "纯白", "wp.bg.sky": "天蓝", "wp.bg.pink": "樱粉",
      "wp.bg.dawn": "晨光", "wp.bg.aurora": "极光", "wp.bg.dusk": "暮色",
      "wp.gradAngle": "渐变方向",
      "wp.remove": "从壁纸池中去除",
      "wp.removed": "已从壁纸池去除",
      "wp.escHint": "悬浮编辑中：改动即改即存，按 ESC 可恢复打开前的效果",
      "wp.escHintLine": "ESC 恢复本次修改",
      "wp.restored": "已恢复打开前的壁纸效果",
      "wp.randAdded": "已加入随机轮换",
      "wp.randRemoved": "已移出随机轮换",
      "detail.wp": "设为壁纸",
      "wp.title": "将此图片设为壁纸",
      "wp.desc": "调整主题三色（已按图片自动取色，可手动微调），确定后加入壁纸池并立即生效。",
      "wp.color1": "颜色 1",
      "wp.color2": "颜色 2",
      "wp.color3": "颜色 3",
      "wp.ok": "确定",
      "wp.editTitle": "编辑壁纸预设",
      "wp.preset.label": "绑定预设",
      "wp.preset.hint": "预设随壁纸保存；之后在外观面板调滑条为临时调整，切换壁纸时仍会按预设生效。",
      "wp.applied": "已设为壁纸",
      "wp.err": "该媒体缺少可用链接",
      "set.thumbCache": "缩略图缓存页数（页）",
      "set.thumbCache.ph": "如 4",
      "set.thumbCache.hint": "可设置 1–20 页（超出则指向默认值'4'）。图源池上限按页数计：图片样式与列表样式已缓存的页组合计不超过该值（网格 24 张/页、列表 20 张/页），可控制网页自身持有并保活的图片内存（标签页内存中网页可控的那部分）。缓存按页组记，超出时以整页为单位释放：先释放另一样式的页，再释放当前样式的非当前页；某张图若仍被其它未释放的页引用则保留，直到引用它的页全部被释放才彻底释放。注意：该设置只约束网页可控的图源池，实际的加载速度与内存占用还受浏览器自身的 HTTP 缓存与图片解码缓存影响（那部分由浏览器管理，网页无法控制）。仅存在本浏览器。",
      "set.wpThumbKeep": "壁纸池长效保留（张）",
      "set.wpThumbKeep.ph": "如 12",
      "set.wpThumbKeep.hint": "可设置 0–30 张（超出则指向默认值'12'）。壁纸池图片数不超过该值时，缩略图加载后长效保留；超过则关闭面板即卸载，下次展开重新加载。0 表示每次关闭都重新加载。注意：该设置只约束网页可控的壁纸池内存，实际加载速度与内存占用还受浏览器自身缓存影响（那部分由浏览器管理）。仅存在本浏览器。",
      "pager.info": "第 {page} / {total} 页",
      "pager.invalid": "请输入 1 ~ {max} 的页码"
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
      "drag.escCancel": "Press ESC to cancel",
      "drag.pageHint": "Drop the cursor here to turn the page",
      "search.ph": "Search name / ID / URL…",
      "search.clear": "Clear search",
      "view.toggle": "Display style",
      "view.thumb": "Image view",
      "view.list": "List view",
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
      "op.sortOk": "Order saved, KV sync may take a moment",
      "op.sortCancelled": "Sorting cancelled",
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
      "set.displaySource": "Display media source",
      "set.displaySource.hint": "Grid thumbnails, detail view and lightbox all load images/covers from the upstream source, or this site's proxied link; all three share one image cache. Only applies in “Cache proxy + DNS” mode (DNS-only is a 302 redirect and always uses upstream). Video covers always use the proxied link in cache-proxy mode because cross-origin frame capture requires CORS.",
      "set.displaySource.upstream": "Upstream source",
      "set.displaySource.site": "Site source",
      "set.group.origin": "Upstream (image host)",
      "set.allowedOrigins": "Allowed proxy domains (SSRF whitelist, Separated by commas and spaces)",
      "set.allowedOrigins.ph": "e.g. img.example.com, img2.example.com",
      "set.allowedOrigins.hint": "Only these domains may be fetched, preventing the Worker from being a proxy. Required; otherwise you can't add links.",
      "set.originReferer": "Upstream Referer (forwarded to origin)",
      "set.originReferer.ph": "e.g. https://img.example.com/",
      "set.originUserAgent": "Upstream User-Agent (default if empty)",
      "set.originUserAgent.ph": "leave empty",
      "origin.title": "Domain not in the SSRF whitelist",
      "origin.desc": "The domain {host} of this link is not allowed yet. Add it before adding the media.",
      "origin.domain": "Domain to whitelist",
      "origin.domain.ph": "e.g. img.example.com",
      "origin.hint.sub": "Rule: adding example.com also allows all its subdomains, e.g. img.example.com.",
      "origin.hint.warn": "Note: once added, any path under this domain can be proxied by the Worker. Only add domains you trust.",
      "origin.cancel": "Cancel",
      "origin.ok": "Whitelist & retry",
      "origin.saving": "Saving…",
      "origin.err.empty": "Please enter a domain",
      "origin.err.invalid": "Invalid domain, enter the domain part only",
      "origin.exists": "This domain is already whitelisted",
      "origin.saveOk": "Whitelisted, retrying…",
      "origin.retryLater": "Whitelist saved, please retry shortly",
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
      "set.group.appearance": "Appearance",
      "set.wp.mode": "Wallpaper mode",
      "set.wp.random": "Random",
      "set.wp.fixed": "Fixed",
      "set.wp.pool": "Wallpaper pool",
      "set.wp.cssRow": "Solid backgrounds",
      "set.wp.custom": "Custom wallpaper URL (leave empty to use the wallpaper pool only)",
      "set.ap.bright": "Background brightness",
      "set.ap.blur": "Frost strength",
      "set.ap.sat": "Saturation",
      "set.ap.lum": "Glass brightness",
      "set.ap.refract": "Edge refraction",
      "set.ap.motion": "Motion",
      "set.ap.noRefract": "This browser does not support edge refraction; using pure CSS glass.",
      "set.ap.badUrl": "A custom wallpaper needs a full http(s) image URL.",
      "set.ap.cardBody": "Info area tint",
      "set.ap.textColor": "Text color",
      "set.ap.textBlack": "Black text",
      "set.ap.textWhite": "White text",
      "wp.bg.white": "White", "wp.bg.sky": "Sky", "wp.bg.pink": "Sakura",
      "wp.bg.dawn": "Daybreak", "wp.bg.aurora": "Aurora", "wp.bg.dusk": "Dusk",
      "wp.gradAngle": "Gradient angle",
      "wp.remove": "Remove from pool",
      "wp.removed": "Removed from wallpaper pool",
      "wp.escHint": "Hover editing: changes save instantly, press ESC to restore the previous look",
      "wp.escHintLine": "ESC restores the previous look",
      "wp.restored": "Wallpaper restored",
      "wp.randAdded": "Added to random rotation",
      "wp.randRemoved": "Removed from random rotation",
      "detail.wp": "Set as wallpaper",
      "wp.title": "Set this image as wallpaper",
      "wp.desc": "Tune the theme trio (auto-picked from the image, editable), then add it to the wallpaper pool and apply immediately.",
      "wp.color1": "Color 1",
      "wp.color2": "Color 2",
      "wp.color3": "Color 3",
      "wp.ok": "Confirm",
      "wp.editTitle": "Edit wallpaper preset",
      "wp.preset.label": "Bound preset",
      "wp.preset.hint": "The preset is saved with this wallpaper. Slider tweaks afterwards are temporary; switching wallpapers re-applies the preset.",
      "wp.applied": "Wallpaper set",
      "wp.err": "No usable link on this media",
      "set.thumbCache": "Thumbnail cache pages",
      "set.thumbCache.ph": "e.g. 4",
      "set.thumbCache.hint": "Range 1–20 pages (out-of-range values fall back to the default '4'). The image pool cap is counted in pages: cached page groups of both the grid and list styles combined stay within this value (grid 24/page, list 20/page), bounding the images held alive by this page (the part of tab memory the page can control). Cache is tracked as page groups; when exceeded, eviction releases whole pages: the other style's pages first, then the current style's non-current pages; an image still referenced by any un-released page is kept, and is only fully dropped after every page referencing it has been released. Note: this only bounds the page-controlled image pool; actual loading speed and memory use also depend on the browser's own HTTP cache and image decode cache, which the page cannot control. Stored in this browser only.",
      "set.wpThumbKeep": "Wallpaper pool keep (count)",
      "set.wpThumbKeep.ph": "e.g. 12",
      "set.wpThumbKeep.hint": "Range 0–30 (out-of-range values fall back to the default '12'). When the wallpaper pool has no more images than this, loaded thumbnails stay in memory; otherwise they unload on close and reload on next open. 0 means always reload on close. Note: this only bounds the page-controlled wallpaper pool memory; actual loading speed and memory use are also affected by the browser's own cache, which the page cannot control. Stored in this browser only.",
      "pager.info": "Page {page} / {total}",
      "pager.invalid": "Enter a page number between 1 and {max}"
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
    // 单请求可覆盖默认超时（如批量添加按设置使用更长超时）
    var timeoutMs = opts.timeout || API_TIMEOUT;
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, timeoutMs) : null;
    return fetch(path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (res.status === 401) { showLogin(); throw new Error(t("auth.invalid")); }
      return res.json().then(function (data) {
        if (!res.ok) {
          // 非 2xx：保留原有 message 兜底，同时透传后端结构化字段（code/host），
          // 供调用方按错误码程序化识别（如 origin_not_allowed → 引导快捷添加白名单）
          var e = new Error(data && data.error ? data.error : "HTTP " + res.status);
          if (data) { e.code = data.code || ""; e.host = data.host || ""; }
          e.status = res.status;
          throw e;
        }
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
  function hideToast() {
    clearTimeout(toastTimer);
    var el = $("toast");
    el.className = "toast";
  }

  function setBusy(btn, busy, text) {
    if (busy) { btn.dataset.orig = btn.textContent; btn.disabled = true; btn.textContent = text; }
    else { btn.disabled = false; if (btn.dataset.orig) btn.textContent = btn.dataset.orig; }
  }

  function showLogin() {
    $("app").classList.add("hidden");
    $("login").classList.remove("hidden");
    var dock = $("ap-dock");
    if (dock) dock.classList.add("hidden"); // 登录页不显示外观 dock，避免遮挡登录卡
    $("login-token").focus();
  }
  function hideLogin() {
    $("login").classList.add("hidden");
    $("app").classList.remove("hidden");
    var dock = $("ap-dock");
    if (dock) dock.classList.remove("hidden");
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
      autoGrowAll(); // 视图由隐藏变可见后重算（隐藏态 scrollHeight 为 0，需重新量高）
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
      var src = videoThumbSrc(img, appSettings.displaySource);
      return '<video class="tv-thumb" data-src="' + esc(src) + '" data-alt="' + esc(img.id) + '" muted playsinline crossorigin="anonymous" preload="metadata"></video>';
    }
    if (tp === "audio")
      return '<div class="thumb-fallback"><span class="tf-icon">♪</span><span class="tf-id">' + esc(t("type.audio")) + "</span></div>";
    return '<img data-src="' + esc(mediaSrc(img, appSettings.displaySource)) + '" class="thumb-img thumb-pending" decoding="async" draggable="false" alt="' + esc(img.id) + '" />';
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
      cacheGroupRemove(src); // 失败的 url 不占用缓存记账
      replaceThumbWithFallback(img);
      done();
      return;
    }
    img.setAttribute("src", src);
    img.dataset.loaded = "1";
    poolGet(src, false); // 占位记账（不发起加载，避免绕过并发队列）；DOM 加载成功后由 reveal 补录
    cacheGroupAdd(src); // 记入当前样式组（跨样式合计上限的记账单位）
    thumbObsUnobserve(img);
    scheduleCacheManage();
    var finished = false;
    function reveal() {
      if (finished) return;
      finished = true;
      img.dataset.tries = "0"; // 成功后重置失败计数
      img.classList.remove("thumb-pending");
      poolGet(src, true); // 补录：池 Image 从浏览器缓存加载（零网络），此后详情/灯箱/另一样式直接复用
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
        cacheGroupRemove(src);
        replaceThumbWithFallback(img);
        done();
        return;
      }
      img.dataset.tries = String(n);
      img.removeAttribute("src");
      img.classList.add("thumb-pending");
      delete img.dataset.loaded;
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
    if (thumbManageTimer) return;
    thumbManageTimer = setTimeout(function () { thumbManageTimer = null; manageThumbCache(); }, 300);
  }
  // 淘汰：图片/列表两组记账合计（跨样式去重）不超「缓存页数 × 每页张数」。
  // 顺序：先丢非当前样式组（无 DOM 元素，仅池与记账），再丢当前样式组（同步清理 DOM 缩略图）；
  // 两样式都存在的 url 跳过不丢；组内按 lastUse 最久未用优先。
  function poolPageCount() { // 图片/列表两样式已缓存的页组总数（池上限的判断标准）
    var n = 0, g;
    for (g in cachePages) n += (cachePages[g] || []).length;
    return n;
  }
  function manageThumbCache() {
    if (poolPageCount() <= thumbCachePages) return;
    evictLog.runs++;
    var cur = currentViewGroup(), other = cur === "thumb" ? "list" : "thumb";
    evictPagesOf(other, false); // ① 先释放非当前样式的页
    if (poolPageCount() > thumbCachePages) evictPagesOf(cur, true); // ② 再释放当前样式的非当前页（跳过当前页）
  }
  function evictDomThumb(u) { // 同步清理 DOM 中对应缩略图，交由 IO 重新接管
    var domImgs = $("grid").querySelectorAll("img.thumb-img[data-loaded]");
    for (var j = 0; j < domImgs.length; j++) {
      if (domImgs[j].getAttribute("data-src") === u) {
        domImgs[j].removeAttribute("src");
        domImgs[j].classList.add("thumb-pending");
        delete domImgs[j].dataset.loaded;
        delete domImgs[j].dataset.loading;
        if (thumbObserver2) { try { thumbObserver2.observe(domImgs[j]); } catch (e) {} }
      }
    }
  }
  // 页级释放（释放粒度为「页」，按页最近使用时间由旧到新；淘汰到页组总数 ≤ 设置页数）。
  // 对页内每张图：只解除「本页」的引用；若仍被其它未释放的页引用则保留在池中，
  // 直到所有引用它的页都被释放才彻底出池（共有图不会被永久豁免）。
  function evictPagesOf(group, skipCurrentPage) {
    var arr = cachePages[group];
    if (!arr || !arr.length) return;
    var pages = arr.slice().sort(function (a, b) { return a.lastUse - b.lastUse; });
    for (var i = 0; i < pages.length && poolPageCount() > thumbCachePages; i++) {
      var rec = pages[i];
      if (skipCurrentPage && rec.page === pager.page) continue;
      var urls = rec.urls.slice();
      for (var j = 0; j < urls.length; j++) {
        var u = urls[j];
        var k = rec.urls.indexOf(u);
        if (k !== -1) rec.urls.splice(k, 1); // 只解除本页引用
        if (!urlInAnyPage(u)) { // 无任何页再引用：彻底出池
          imgPool.delete(u);
          evictLog.removed++;
          evictDomThumb(u);
        }
      }
      var idx = arr.indexOf(rec);
      if (idx !== -1) arr.splice(idx, 1);
    }
  }

  /* 拖拽排序：仅从卡片的非交互区域发起；拖拽时卡片缩小淡化跟随鼠标，实时让位 + 虚线占位预览，放下时飞回槽位 */
  var dnd = null;
  var flipTimer = null;
  // ===== 拖拽跨页热区：左右各约 5% 视口宽、50% 高（垂直居中），光标停留 1.5s 翻页 =====
  var ZONE_W_RATIO = 0.05, ZONE_H_RATIO = 0.5, ZONE_HOLD_MS = 1500;
  var zoneL = null, zoneR = null, zoneTimer = null, zoneSide = "";
  function dragTotalPages() { return Math.max(1, Math.ceil((gridState.vis || []).length / perPageCount())); }
  function createPageZones() {
    if (zoneL) return;
    var hint = t("drag.pageHint");
    var mk = function (side) {
      var el = document.createElement("div");
      el.className = "page-zone page-zone-" + side;
      var sp = document.createElement("span");
      sp.textContent = hint;
      el.appendChild(sp);
      el.style.width = Math.round(window.innerWidth * ZONE_W_RATIO) + "px";
      el.style.height = Math.round(window.innerHeight * ZONE_H_RATIO) + "px";
      document.body.appendChild(el);
      return el;
    };
    zoneL = mk("left"); zoneR = mk("right");
    zoneSide = ""; clearZoneTimer(); updateZoneUI();
  }
  function zoneAvailable(side) {
    if (side === "left") return pager.page > 1;
    if (side === "right") return pager.page < dragTotalPages();
    return false;
  }
  function zoneAt(x, y) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var w = Math.max(48, vw * ZONE_W_RATIO);
    var pad = vh * (1 - ZONE_H_RATIO) / 2;
    if (y < pad || y > vh - pad) return "";
    if (x <= w) return "left";
    if (x >= vw - w) return "right";
    return "";
  }
  function clearZoneTimer() { if (zoneTimer) { clearTimeout(zoneTimer); zoneTimer = null; } }
  function updateZoneUI() {
    if (!zoneL || !zoneR) return;
    zoneL.style.display = zoneAvailable("left") ? "" : "none";  // 首页不展示左框
    zoneR.style.display = zoneAvailable("right") ? "" : "none"; // 末页不展示右框
    zoneL.classList.toggle("hot", zoneSide === "left");
    zoneR.classList.toggle("hot", zoneSide === "right");
  }
  // 拖拽移动时调用：命中热区起 1.5s 计时，离开/翻页即重置；翻页后仍在框内会再次计时（支持连续翻页）
  function updatePageZone(x, y) {
    if (!dnd || !dnd.active) return;
    var side = zoneAt(x, y);
    if (side && !zoneAvailable(side)) side = "";
    if (side !== zoneSide) { clearZoneTimer(); zoneSide = side; updateZoneUI(); }
    if (side && !zoneTimer) {
      zoneTimer = setTimeout(function () { zoneTimer = null; flipPageForDrag(zoneSide); }, ZONE_HOLD_MS);
    }
  }
  function flipPageForDrag(side) {
    if (!dnd || !dnd.active || !side || !zoneAvailable(side)) return;
    var next = pager.page + (side === "right" ? 1 : -1);
    if (next < 1 || next > dragTotalPages()) { updateZoneUI(); return; }
    pager.page = next;
    // renderGrid 会清空网格（占位随之销毁）。onDone 时卡片已就位，再重插占位到页首/页末并刷新槽位缓存；
    // 同时立即补插占位作为兜底，避免渲染异步窗口内 movePlaceholderTo 因 ph 不在 DOM 而抛错
    renderGrid(lastImages, { onDone: function () { rebuildDragAfterFlip(side); } });
    if (!dnd.ph.parentNode) $("grid").appendChild(dnd.ph);
    dnd.lastIndex = -1;
    dnd.origIndex = -1; // 跨页后原位索引失效：取消走「回源页重建」路径
    dnd.flipped = true;
    window.scrollTo(0, 0);
    updateZoneUI();
  }
  // 翻页渲染完成后：把占位重插到新页页首（右翻）/页末（左翻），刷新槽位缓存与热区可用性
  function rebuildDragAfterFlip(side) {
    if (!dnd || !dnd.active) return;
    var grid = $("grid");
    if (dnd.ph.parentNode) grid.removeChild(dnd.ph);
    var nodes = gridImageNodes();
    if (side === "left" && nodes.length) grid.appendChild(dnd.ph);
    else if (nodes.length) grid.insertBefore(dnd.ph, nodes[0]);
    else grid.appendChild(dnd.ph);
    refreshSlotLayout(); // 必须在卡片渲染完成后刷新：否则判定基于过期布局导致落点漂移
    dnd.lastIndex = -1;
    updateZoneUI();
  }
  function destroyPageZones() {
    clearZoneTimer();
    zoneSide = "";
    if (zoneL && zoneL.parentNode) zoneL.parentNode.removeChild(zoneL);
    if (zoneR && zoneR.parentNode) zoneR.parentNode.removeChild(zoneR);
    zoneL = zoneR = null;
  }
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
      // 末尾落点：锚点取「可见序列中最后一张非拖拽卡」——
      // 松手时拖拽卡已插回 grid 成为可见序列末项，若拿它当锚会退化成"插入全序末端"（跨页尤其错）
      var lastRendered = null;
      for (var vi = newVisible.length - 1; vi >= 0; vi--) {
        if (newVisible[vi] !== dragId) { lastRendered = newVisible[vi]; break; }
      }
      if (lastRendered === null) return rest.concat([dragId]);
      var li = rest.indexOf(lastRendered);
      if (li < 0) return rest.concat([dragId]);
      var target = li + 1 < rest.length ? rest[li + 1] : null;
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
  // ===== 拖拽占位（槽位序列架构）=====
  // 核心概念：槽位元素 = grid 中按 DOM 顺序的 .img-card + 占位 ph（ph 视作一张卡占一个槽位）。
  // slotLayout 缓存所有槽位元素的"布局位置"，只在无 transform 的干净状态读取，
  // 拖拽期间所有占位判定全部基于该缓存 —— 与 FLIP 动画完全隔离，杜绝"读到动画中间位置"的漂移。
  var slotLayout = [];
  function readSlotLayout() {
    var grid = $("grid");
    var ph = dnd && dnd.ph ? dnd.ph : null;
    var out = [];
    var children = grid.children;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      var isPh = el === ph;
      if (!isPh && !(el.classList && el.classList.contains("img-card"))) continue;
      var r = el.getBoundingClientRect();
      // 保险：若有 FLIP 残留 transform，减去平移量得到布局位置
      var tx = 0, ty = 0;
      var ts = el.style.transform;
      if (ts && ts.indexOf("translate") >= 0) {
        var m = /translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px\s*\)/.exec(ts);
        if (m) { tx = parseFloat(m[1]) || 0; ty = parseFloat(m[2]) || 0; }
      }
      out.push({
        el: el,
        isPh: isPh,
        left: r.left - tx,
        right: r.right - tx,
        top: r.top - ty,
        bottom: r.bottom - ty,
      });
    }
    return out;
  }
  function refreshSlotLayout() { slotLayout = readSlotLayout(); }
  // 占位判定：返回 ph 应占据的槽位号（slots 序列中的索引）。
  //  0) 鼠标落在占位自身槽位内 → 保持当前槽位不动（当前落点锁定）。
  //     若无此规则：ph 移到目标卡槽位后该卡让位前移，鼠标物理位置不变却悬停在 ph 上，
  //     判定会跳过 ph 走 gap 又选回该卡新槽位，占位在两个槽位间无限抖动。
  //  1) 鼠标落在某张卡片矩形内 → 该卡槽位
  //  2) 鼠标落在卡片外（gap/空白区）→ 最近卡片边界所属的槽位
  function dropIndexAt(x, y) {
    var slots = slotLayout;
    if (!slots.length) return null;
    var i, r;
    // 0) 鼠标在占位自身槽位内 → 保持当前槽位不动（当前落点锁定）
    for (i = 0; i < slots.length; i++) {
      if (!slots[i].isPh) continue;
      r = slots[i];
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i;
    }
    // 1) 鼠标在某张卡片"内部"（收缩矩形：卡片边缘 HYST 迟滞带内不算命中）→ 该卡槽位。
    //    迟滞带降低卡片交接处的灵敏度：必须越过卡片边缘进入内部才切换占位，
    //    避免"边缘微移 → ph 让位 → 布局重排 → 判定来回选相邻槽位"的抽搐。
    var HYST = 6;
    for (i = 0; i < slots.length; i++) {
      if (slots[i].isPh) continue;
      r = slots[i];
      if (x >= r.left + HYST && x <= r.right - HYST && y >= r.top + HYST && y <= r.bottom - HYST) return i;
    }
    // 2) 鼠标落在卡片边缘迟滞带 / gap / 空白区 → 保持当前占位不动，
    //    不自动切到相邻槽位，彻底消除交接处的来回切换
    return typeof dnd.lastIndex === "number" ? dnd.lastIndex : null;
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
  function movePlaceholderTo(d, s) {
    var slots = slotLayout;
    if (s == null || s < 0 || s >= slots.length) return;
    if (slots[s].isPh) { d.lastIndex = s; return; } // 已在该槽位
    var grid = $("grid");
    // FLIP 起点用缓存的干净位置（不受动画 transform 影响）
    var from = new Map();
    for (var i = 0; i < slots.length; i++) from.set(slots[i].el, slots[i]);
    // 移动 ph 到槽位 s：先从 grid 移除，再按槽位号插入（ph 成为第 s 个槽位元素，占据该物理槽位）
    if (d.ph.parentNode === grid) grid.removeChild(d.ph);
    var cards = gridImageNodes();
    var anchor = s < cards.length ? cards[s] : null;
    if (anchor) grid.insertBefore(d.ph, anchor); else grid.appendChild(d.ph);
    // 清 FLIP 残留 transform 后读取干净布局缓存，后续判定不再受动画影响
    var all = grid.querySelectorAll(".img-card");
    for (var k = 0; k < all.length; k++) {
      all[k].style.transition = "none";
      all[k].style.transform = "";
    }
    refreshSlotLayout();
    runFlip(from);
    d.lastIndex = s;
  }
  function finishDrag(d, commit) {
    var grid = $("grid");
    var ghost = d.card.getBoundingClientRect();
    // 落位：卡片直接插到 ph 前面（成为该槽位元素）后移除 ph —— 占位在哪卡片就落哪，严格一致
    if (d.ph.parentNode === grid) { grid.insertBefore(d.card, d.ph); grid.removeChild(d.ph); }
    else grid.appendChild(d.card);
    d.card.style.position = "";
    d.card.style.left = "";
    d.card.style.top = "";
    d.card.style.width = "";
    d.card.style.height = "";
    d.card.style.margin = "";
    d.card.style.transform = ""; // 清除跟随鼠标的 transform，读取干净的槽位位置
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
      .then(function () { toast(t("op.sortOk"), "success"); })
      .catch(function (err) {
        toast(err.message || t("op.fail"), "error");
        // 失败回滚为拖拽前顺序（本地重排 + 就地重建，不再全量重拉网络）
        lastImages = reorderImageList(lastImages, d.fullBefore);
        renderGrid(lastImages, { anchor: true });
      });
  }
  // 卡片 hover 提起：底部扩展判定区（上方不扩展），避免"上移→鼠标离开→落下→再上移"抖动
  var HOVER_LIFT = 3; // 与 CSS .hovered 的 translateY 一致
  var HOVER_PAD = 4;  // 卡片底部额外判定缓冲（网格 gap 16px；4px 覆盖 3px 上移量并留 1px 容差，尽量贴近卡片边界手感）
  var hoverCard = null;
  function hoverHitZone(card, x, y) {
    var r = card.getBoundingClientRect();
    // 卡片提起后 rect 整体上移 LIFT，故原始底部 = r.bottom + LIFT；
    // 判定区 = [原始顶部（随卡片上移）, 原始底部 + PAD（固定）]
    return x >= r.left && x <= r.right &&
           y >= r.top + HOVER_LIFT && y <= r.bottom + HOVER_LIFT + HOVER_PAD;
  }
  function setHovered(card, on) {
    if (!card) return;
    card.classList.toggle("hovered", on);
    if (on) hoverCard = card;
    else if (hoverCard === card) hoverCard = null;
  }
  $("grid").addEventListener("pointerover", function (e) {
    if (e.pointerType === "touch") return;
    var card = e.target && e.target.closest ? e.target.closest(".img-card") : null;
    if (card) setHovered(card, true);
  });
  $("grid").addEventListener("pointerout", function (e) {
    if (e.pointerType === "touch") return;
    var card = e.target && e.target.closest ? e.target.closest(".img-card") : null;
    if (!card) return;
    var to = e.relatedTarget;
    if (to && to.closest && to.closest(".img-card") === card) return; // 仍在卡片内部移动
    if (hoverHitZone(card, e.clientX, e.clientY)) return; // 底部扩展区内：保持提起
    setHovered(card, false);
  });
  $("grid").addEventListener("pointermove", function (e) {
    if (!hoverCard) return;
    if (!hoverCard.isConnected) { hoverCard = null; return; }
    if (!hoverHitZone(hoverCard, e.clientX, e.clientY)) setHovered(hoverCard, false);
  });
  $("grid").addEventListener("pointerleave", function () {
    if (hoverCard) setHovered(hoverCard, false);
  });
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
      toast(t("drag.escCancel"), "accent"); // 拖拽开始：底部主题渐变提示按 ESC 取消
      try { dnd.card.setPointerCapture(e.pointerId); } catch (err) {}
      var grid = $("grid");
      var imgs = gridImageNodes();
      var idx0 = -1;
      for (var i = 0; i < imgs.length; i++) { if (imgs[i] === dnd.card) { idx0 = i; break; } }
      var rect = dnd.card.getBoundingClientRect();
      setHovered(dnd.card, false);
      document.body.classList.add("no-select"); // 拖拽期间禁止文本选中，避免列表模式下鼠标拖动产生蓝选
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
      // 列表模式下卡片占满整行（grid-column:1/-1），占位虚线框同样要跨整行，而不是只占首列宽度
      if (viewMode === "list") ph.style.gridColumn = "1 / -1";
      dnd.ph = ph;
      var nodes2 = gridImageNodes();
      if (idx0 < nodes2.length) grid.insertBefore(ph, nodes2[idx0]); else grid.appendChild(ph);
      dnd.lastIndex = idx0;
      dnd.origIndex = idx0;
      dnd.origPage = pager.page; // 拖拽起始页：跨页取消时回到该页
      dnd.flipped = false;
      createPageZones();
      // 初始化槽位布局缓存（ph 已入列，此刻无 FLIP transform，读到的是干净布局位置）
      refreshSlotLayout();
    } else {
      dnd.card.classList.remove("drag-pickup");
      dnd.card.style.transition = "none";
    }
    e.preventDefault();
    dnd.card.style.transform = "translate(" + (e.clientX - dnd.startX) + "px," + (e.clientY - dnd.startY) + "px) scale(.92)";
    var p = dropIndexAt(e.clientX, e.clientY);
    if (p !== null && p !== dnd.lastIndex) movePlaceholderTo(dnd, p);
    updatePageZone(e.clientX, e.clientY); // 左右边缘热区：停留 1.5s 翻页（跨页排序）
  }, { passive: false });
  function endCardDrag(e) {
    if (!dnd) return;
    var d = dnd;
    dnd = null;
    if (!d.active) return;
    document.body.classList.remove("no-select"); // 拖拽结束恢复文本选择
    hideToast();
    d.card.classList.remove("drag-pickup");
    d.card.style.touchAction = "";
    try { d.card.releasePointerCapture(d.pointerId); } catch (err) {}
    // 松开落位：直接用占位当前槽位（ph 的 DOM 位置）落位，不再用 pointerup 坐标重新计算占位。
    // 快速松手/甩动时 pointerup 坐标可能已离开占位，重新计算会导致"占位显示位置与落位不一致"。
    // 先清掉 FLIP 残留 transform，避免其他卡片动画影响最终布局观感。
    var gridEl = $("grid");
    var gridCards = gridEl.querySelectorAll(".img-card");
    for (var gi = 0; gi < gridCards.length; gi++) {
      gridCards[gi].style.transition = "none";
      gridCards[gi].style.transform = "";
    }
    var p = d.lastIndex;
    // 顺序变化判定：槽位变化，或期间发生过翻页（跨页落位必然改变全序）
    var moved = (p !== null && p !== d.origIndex) || pager.page !== d.origPage;
    destroyPageZones();
    finishDrag(d, moved);
  }
  window.addEventListener("pointerup", endCardDrag);
  window.addEventListener("pointercancel", endCardDrag);
  // ESC 取消拖拽后 no-select 保持到松开左键：用户常先按 ESC 再松键，期间鼠标仍在移动，
  // 若立即恢复文本选择会从按下处一路选中到松开处。此窗口结束后立即释放，不影响正常文本选择。
  var noSelectHold = false;
  function releaseNoSelectHold() {
    if (!noSelectHold) return;
    noSelectHold = false;
    document.body.classList.remove("no-select");
  }
  window.addEventListener("pointerup", releaseNoSelectHold);
  window.addEventListener("pointercancel", releaseNoSelectHold);
  // Esc 取消拖拽：占位归位、卡片放回原位，不提交顺序
  function cancelCardDrag(e) {
    if (!dnd) return;
    var d = dnd;
    dnd = null;
    hideToast(); // 取消拖拽，隐藏 ESC 提示
    d.card.classList.remove("drag-pickup");
    d.card.style.touchAction = "";
    try { d.card.releasePointerCapture(d.pointerId); } catch (err) {}
    if (!d.active) { document.body.classList.remove("no-select"); return; } // 未激活：卡片仍在 grid，无占位，恢复即可
    // 激活中取消：no-select 保持到松开左键（防 ESC 后拖动选字），并提示已取消
    noSelectHold = true;
    destroyPageZones();
    if (pager.page !== d.origPage) {
      // 跨页取消：顺序未提交，丢掉 ghost/占位回到源页重建即恢复原序
      if (d.ph && d.ph.parentNode) d.ph.parentNode.removeChild(d.ph);
      if (d.card.parentNode) d.card.parentNode.removeChild(d.card);
      d.card.classList.remove("dragging", "drag-pickup");
      d.card.style.cssText = "";
      pager.page = d.origPage;
      dnd = null; // 重建前先清空：否则源卡会被当作拖拽中而被跳过
      renderGrid(lastImages);
      toast(t("op.sortCancelled"), "accent");
      return;
    }
    toast(t("op.sortCancelled"), "accent");
    // 占位先移回原位槽位，再让卡片落回（commit=false，不提交排序）
    movePlaceholderTo(d, d.origIndex);
    finishDrag(d, false);
  }
  window.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (fDnd) {
      // 取消文件夹拖拽：源 chip 放回原位
      var d = fDnd;
      fDnd = null;
      if (d.active) noSelectHold = true; // 激活中取消：no-select 保持到松开左键（未激活时本就未加该类）
      if (d.wrap) d.wrap.classList.remove("dragging");
      if (d.ph && d.ph.parentNode) d.ph.parentNode.removeChild(d.ph);
      if (d.active) {
        restoreSourceWrap(d);
        toast(t("op.sortCancelled"), "accent");
      }
      return;
    }
    if (wpDnd) {
      // 取消壁纸池拖拽：源按钮已从网格移除，重建即恢复原序
      var w = wpDnd;
      wpDnd = null;
      releaseWpDragActive();
      if (w.ph && w.ph.parentNode) w.ph.parentNode.removeChild(w.ph);
      if (w.active) {
        noSelectHold = true; // no-select 保持到松开左键
        buildBgList();
        toast(t("op.sortCancelled"), "accent");
      }
      return;
    }
    cancelCardDrag(e);
  });

  // 文件夹多选匹配：空数组 = 全选（显示所有）；否则图片 folder 命中任一选中项即通过
  function folderMatchesSelection(img) {
    if (!selectedFolders.length) return true;
    for (var i = 0; i < selectedFolders.length; i++) {
      var f = selectedFolders[i];
      if (f === "__uncat__") { if (!img.folder) return true; }
      else if (img.folder === f) return true;
    }
    return false;
  }
  // 全部按钮高亮条件：没有任何筛选（点击了全部）或已手动选中所有文件夹（含未分类）
  function isAllSelected() {
    if (!selectedFolders.length) return true;
    var total = lastFolders.length + 1; // +1 为未分类
    if (selectedFolders.length < total) return false;
    if (selectedFolders.indexOf("__uncat__") === -1) return false;
    for (var i = 0; i < lastFolders.length; i++) {
      if (selectedFolders.indexOf(lastFolders[i]) === -1) return false;
    }
    return true;
  }

  function filterImages(images) {
    var q = searchQuery.toLowerCase();
    return images.filter(function (img) {
      // 占位卡信息未就绪，暂不过滤，先以占位显示
      if (img && img._loading) return true;
      if (!folderMatchesSelection(img)) return false;
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
    if (!folderMatchesSelection(img)) return false;
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
    thumbObsTargets = [];
    // 不清图源池：刷新后 url 大多不变，池内已加载的图可直接复用（淘汰规则自动控制总量）
  }

  function computeGridMetrics() {
    var grid = $("grid");
    var w = grid.clientWidth || Math.max(1, document.documentElement.clientWidth - 300);
    var cols = Math.max(1, Math.round((w + 16) / (240 + 16)));
    gridState.cols = viewMode === "list" ? 1 : cols;
    return cols;
  }
  function thumbWrapHtml(img) {
    return '<div class="thumb">' + thumbHtml(img) +
      '<button class="zoom" data-url="' + esc(img.url) + '" data-short="' + esc(img.shortUrl || img.url) + '" data-mode="' + esc(img.mode || "") + '" data-type="' + esc(img.type || "") + '" aria-label="' + esc(t("card.preview")) + '">' + esc(t("card.preview.short")) + "</button></div>";
  }
  function cardBodyHtml(img) {
    if (viewMode === "list") {
      // 列表展示：横条一行（无缩略图 / URL / 删除 / 详情按钮，删除移入详情弹窗，整行点击开详情）
      return '<div class="card-body lst-body">' +
        '<div class="lst-row">' +
        '<label class="switch" title="' + esc(t("card.toggle")) + '"><input type="checkbox" class="tgl" data-id="' + esc(img.id) + '"' + (img.enabled ? " checked" : "") + ' /><span></span></label>' +
        '<span class="lst-name"><span class="lst-name-hit img-name" data-id="' + esc(img.id) + '" data-name="' + esc(img.name || "") + '" title="' + esc(t("card.renameTitle")) + '"><span class="t">' + esc(displayName(img)) + '</span><span class="pen">✎</span></span></span>' +
        modeBadge(img.mode) + typeBadge(img.type || guessTypeClient(img.url)) +
        '<span class="lst-id" title="' + esc(img.id) + '">' + esc(img.id) + "</span>" +
        '<select class="fsel" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.folderAria")) + '">' + folderOptions(img.folder || "") + "</select>" +
        '<span class="lst-time">' + fmtTime(img.createdAt) + "</span>" +
        '<span class="lst-size" data-id="' + esc(img.id) + '">' + (typeof img.size === "number" && img.size > 0 ? fmtSize(img.size) : (sizeCache[img.id] || "-")) + "</span>" +
        '<button class="zoom zoom-inline" data-url="' + esc(img.url) + '" data-short="' + esc(img.shortUrl || img.url) + '" data-mode="' + esc(img.mode || "") + '" data-type="' + esc(img.type || "") + '" aria-label="' + esc(t("card.preview")) + '">' + esc(t("card.preview.short")) + "</button>" +
        '<button class="mini copy" data-url="' + esc(img.shortUrl || img.url) + '" aria-label="' + esc(t("card.copy.aria")) + '">' + esc(t("card.copy")) + "</button>" +
        "</div></div>";
    }
    // 缩略图卡片（thumb 模式）：一级界面不显示删除按钮（删除移入详情弹窗）
    return '<div class="card-body">' +
      '<div class="card-top">' + modeBadge(img.mode) + typeBadge(img.type || guessTypeClient(img.url)) + '<span class="muted">' + fmtTime(img.createdAt) + "</span></div>" +
      '<div class="img-name" data-id="' + esc(img.id) + '" data-name="' + esc(img.name || "") + '" title="' + esc(t("card.renameTitle")) + '"><span class="t">' + esc(displayName(img)) + '</span><span class="pen">✎</span></div>' +
      '<div class="img-id" title="' + esc(img.id) + '"><span class="t">' + esc(img.id) + "</span></div>" +
      '<div class="img-url" title="' + esc(img.shortUrl || img.url) + '">' + esc(img.shortUrl || img.url) + "</div>" +
      '<select class="fsel" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.folderAria")) + '">' + folderOptions(img.folder || "") + "</select>" +
      '<div class="actions">' +
      '<label class="switch" title="' + esc(t("card.toggle")) + '"><input type="checkbox" class="tgl" data-id="' + esc(img.id) + '"' + (img.enabled ? " checked" : "") + ' /><span></span></label>' +
      '<button class="mini detail" data-id="' + esc(img.id) + '" aria-label="' + esc(t("card.detail")) + '">' + esc(t("card.detail")) + "</button>" +
      '<button class="mini copy" data-url="' + esc(img.shortUrl || img.url) + '" aria-label="' + esc(t("card.copy.aria")) + '">' + esc(t("card.copy")) + "</button>" +
      "</div></div>";
  }
  function buildCard(img, i, noAnim) {
    var card = document.createElement("div");
    card.className = "card img-card" + (img.enabled ? "" : " disabled") + (viewMode === "list" ? " view-list" : "");
    card.dataset.id = img.id;
    card.dataset.idx = i;
    if (noAnim) card.classList.add("no-anim");
    else card.style.animationDelay = Math.min(i * 45, 360) + "ms";
    if (img._loading) {
      // 占位卡：基本信息未就绪，保持固定尺寸与顺序，待信息到达后再填充
      card.dataset.loading = "1";
      card.innerHTML = viewMode === "list"
        ? '<div class="card-body body-skeleton lst-skel"><div class="sk-line" style="width:70%"></div></div>'
        : '<div class="thumb thumb-loading"><span class="thumb-spin"></span></div>' +
          '<div class="card-body body-skeleton">' +
          '<div class="sk-line ht" style="width:55%"></div>' +
          '<div class="sk-line" style="width:35%"></div>' +
          '<div class="sk-line" style="width:85%"></div>' +
          '<div class="sk-line" style="width:60%"></div>' +
          '<div class="sk-line" style="width:70%"></div>' +
          "</div>";
      return card;
    }
    card.innerHTML = (viewMode === "list" ? "" : thumbWrapHtml(img)) + cardBodyHtml(img);
    return card;
  }

  function resetGridNodes() {
    var grid = $("grid");
    var nodes = grid.querySelectorAll(".thumb-img, video.tv-thumb");
    for (var i = 0; i < nodes.length; i++) thumbObsUnobserve(nodes[i]);
    if (cardQueueTimer) { clearTimeout(cardQueueTimer); cardQueueTimer = null; }
    cardQueue = [];
    grid.innerHTML = "";
    thumbQueue = [];
    thumbInFlight = 0;
    // 不清图源池：翻页/切样式/筛选只是重新过滤与渲染，url 本身仍有效，
    // 池与分组记账继续由「缓存页数 × 每页张数」的淘汰规则管理（跨页/跨样式复用的基础）
  }
  function enqueueCardRange(start, end, noAnim) {
    var vis = gridState.vis;
    if (!vis || start >= end) { if (!cardQueue.length) finishCardQueue(); return; }
    for (var i = start; i < end; i++) {
      // 跨页拖拽期间：源卡是 body 上的 fixed ghost，网格内跳过它的影子卡（占位替代其槽位）
      if (dnd && dnd.active && vis[i].id === dnd.id) continue;
      cardQueue.push({ card: buildCard(vis[i], i, noAnim) });
    }
    if (!cardQueueTimer) cardQueueTimer = setTimeout(pumpCardQueue, 16);
  }
  function pumpCardQueue() {
    cardQueueTimer = null;
    var grid = $("grid");
    var done = 0;
    while (cardQueue.length && done < CARD_BATCH) {
      var item = cardQueue.shift();
      grid.appendChild(item.card);
      done++;
    }
    if (cardQueue.length) {
      if (glassCtl) glassCtl.observe($("grid")); // 每批渲染完立即纳入折射管理，不等全队列结束
      cardQueueTimer = setTimeout(pumpCardQueue, 16);
      return;
    }
    finishCardQueue();
  }
  function finishCardQueue() {
    if (glassCtl) glassCtl.observe($("grid")); // 新渲染的卡片纳入折射管理
    setupVideoThumbs();
    observeThumbs();
    probeListSizes(); // 列表模式：惰性探测文件大小
    var cb = renderDoneCb;
    renderDoneCb = null;
    if (cb) cb();
  }
  function renderGrid(images, opts) {
    opts = opts || {};
    if (opts.resetPage) pager.page = 1;
    var vis = filterImages(images);
    $("img-count").textContent = t("list.count", { n: vis.length });
    gridState.vis = vis;
    var per = perPageCount();
    var total = Math.max(1, Math.ceil(vis.length / per));
    if (pager.page > total) pager.page = total;
    if (!vis.length) {
      $("empty").classList.remove("hidden");
      $("empty").textContent = images.length ? t("empty.filtered") : t("empty");
      resetGridNodes();
      renderPager(0);
      return;
    }
    $("empty").classList.add("hidden");
    computeGridMetrics();
    var start = (pager.page - 1) * per;
    var end = Math.min(vis.length, start + per);
    resetGridNodes();
    renderDoneCb = opts.onDone || null;
    enqueueCardRange(start, end, opts.noAnim);
    renderPager(vis.length);
    ensureInfoLoads();
    cachePageTouch(); // 标记当前样式当前页最近被访问，保证页级 LRU 准确
    preloadListPage();
  }
  // 列表模式预加载：列表卡片无缩略图，但把当前页图片提前拉入图源池，为详情页/预览页做准备（共用一份内存）
  function preloadListPage() {
    if (viewMode !== "list") return;
    var vis = gridState.vis || [];
    var start = (pager.page - 1) * perPageCount();
    var end = Math.min(vis.length, start + perPageCount());
    for (var i = start; i < end; i++) {
      var it = vis[i];
      if ((it.type || guessTypeClient(it.url)) !== "image") continue; // 视频/音频实际播放独立缓存，封面由卡片/详情路径处理
      var u = mediaSrc(it, appSettings.displaySource);
      poolGet(u, true); // 预加载：立即拉入图源池
      cacheGroupAdd(u);
    }
    scheduleCacheManage();
  }

  // ===== 展示样式切换 =====
  // 按当前 viewMode 同步控件 active 状态（HTML 静态渲染，初始态由 JS 校正）
  function syncViewToggle() {
    var opts = document.querySelectorAll(".vt-opt");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle("active", opts[i].getAttribute("data-view") === viewMode);
    }
  }
  // 切 list：停止进行中的缩略图加载（list 模式无需缩略图）。
  // 注意：不清图源池与分组记账——图片样式下的缓存暂存，供列表样式复用与切回时秒显
  function clearThumbLoads() {
    thumbQueue = [];
    thumbInFlight = 0;
  }
  // ===== 切样式「堆叠摊开」动画：列表↔图片时卡片先堆叠到行首/首行，再逐张推平 =====
  function playDeckAnimation() {
    var cards = $("grid").querySelectorAll(".img-card");
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var visible = [];
    if (viewMode === "list") {
      // 列表样式：视口内（含缓冲）卡片优先，不足 32 个时再向下补充，保证视口内必有动画且用户下滚仍可见
      var collected = {};
      for (var j = 0; j < cards.length; j++) {
        var rj = cards[j].getBoundingClientRect();
        if (rj.bottom < -40 || rj.top > vh + 40) continue;
        visible.push({ el: cards[j], left: rj.left, top: rj.top });
        collected[j] = true;
      }
      if (visible.length < 32) {
        for (var k = 0; k < cards.length && visible.length < 32; k++) {
          if (collected[k]) continue;
          var rk = cards[k].getBoundingClientRect();
          if (rk.top < vh + 40) continue; // 只补视口下方（上方已滚出的不取）
          visible.push({ el: cards[k], left: rk.left, top: rk.top });
        }
      }
    } else {
      // 图片样式：视口内 + 下方扩展至约 4 行
      var rowH = gridState.rowH || 380;
      for (var j2 = 0; j2 < cards.length; j2++) {
        var r2 = cards[j2].getBoundingClientRect();
        if (r2.bottom < -rowH || r2.top > vh + 2 * rowH) continue; // 上方一行缓冲 + 视口 + 下方约 2 行
        visible.push({ el: cards[j2], left: r2.left, top: r2.top });
      }
    }
    if (!visible.length) { viewSwitching = false; return; }
    // 按 top 聚类成行（同一行的卡片 top 相近）
    var rows = [];
    for (var j3 = 0; j3 < visible.length; j3++) {
      var v = visible[j3];
      var placed = false;
      for (var k2 = 0; k2 < rows.length; k2++) {
        if (Math.abs(rows[k2].top - v.top) < 14) { rows[k2].items.push(v); placed = true; break; }
      }
      if (!placed) rows.push({ top: v.top, items: [v] });
    }
    rows.sort(function (a, b) { return a.top - b.top; });
    var anims = [];
    var z = 100;
    if (viewMode === "thumb") {
      // 列表→图片：每行堆叠到行首，向右推平（行内按列错峰，加大偏移让层叠清晰）
      for (var r1 = 0; r1 < rows.length; r1++) {
        var it1 = rows[r1].items;
        it1.sort(function (a, b) { return a.left - b.left; });
        var anchorX = it1[0].left;
        var anchorY = it1[0].top;
        for (var c = 0; c < it1.length; c++) {
          var itm = it1[c];
          anims.push({ el: itm.el, dx: (anchorX + 6 + c * 9) - itm.left, dy: (anchorY + 3 + c * 4) - itm.top, delay: c * 55, z: z++ });
        }
      }
    } else {
      // 图片→列表：全部堆叠到第一行（最上面），向下推平（交错错开 + 基础偏移，错峰 delay）
      var topRow = rows.length ? rows[0].items : null;
      var ax = topRow && topRow.length ? topRow[0].left : 0;
      var ay = topRow && topRow.length ? topRow[0].top : 0;
      var idx = 0;
      for (var r2 = 0; r2 < rows.length; r2++) {
        for (var c2 = 0; c2 < rows[r2].items.length; c2++) {
          var it2 = rows[r2].items[c2];
          anims.push({ el: it2.el, dx: (ax + 4 + (idx % 2) * 14) - it2.left, dy: (ay + 2 + Math.floor(idx / 2) * 4) - it2.top, delay: idx * 28, z: z++ });
          idx++;
        }
      }
    }
    applyDeck(anims);
  }
  function applyDeck(anims) {
    if (!anims.length) { viewSwitching = false; return; }
    // 第一阶段：堆叠位置 + 半透明（避免"先排好再动"且消除实心白叠加）+ z-index 递增
    for (var i = 0; i < anims.length; i++) {
      var a = anims[i];
      a.el.style.transition = "none";
      a.el.style.zIndex = String(a.z);
      a.el.style.opacity = "0.4"; // 半透明：掩盖最终位置先渲染、避免堆叠叠加成实心白
      a.el.style.transform = "translate(" + a.dx + "px," + a.dy + "px)";
    }
    void $("grid").offsetWidth; // 确保堆叠位移先应用
    // 双 rAF：先让浏览器把"堆叠 + grid 隐藏"状态确认下来，再取消 grid 隐藏并启动推平 + 淡入
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var total = 0;
        for (var k = 0; k < anims.length; k++) {
          var b = anims[k];
          b.el.style.transition = "transform .55s cubic-bezier(.34,.1,.28,1), opacity .35s ease";
          b.el.style.transitionDelay = b.delay + "ms";
          b.el.style.transform = "translate(0px,0px)";
          b.el.style.opacity = "1";
          if (b.delay + 550 > total) total = b.delay + 550;
        }
        // 与推平同时取消 grid 隐藏，用户看到的第一帧就是"堆叠+半透明"
        $("grid").style.visibility = "";
        setTimeout(function () {
          for (var n = 0; n < anims.length; n++) {
            anims[n].el.style.transition = "";
            anims[n].el.style.transitionDelay = "";
            anims[n].el.style.transform = "";
            anims[n].el.style.opacity = "";
            anims[n].el.style.zIndex = "";
          }
          viewSwitching = false;
          // 摊开到位后立即烘焙玻璃（折射滤镜有 sessionStorage 缓存，直接复用，无重烘开销）
          window.dispatchEvent(new CustomEvent("lg-refresh"));
        }, total + 80);
      });
    });
  }
  var viewSwitching = false;
  // 主切换流程：更新控件 → 锁定高度并隐藏 grid → 重建（noAnim）→ 堆叠摊开动画（仅视口内卡片参与）
  function switchViewMode(next) {
    if (viewSwitching || next === viewMode) return;
    viewSwitching = true;
    viewMode = next;
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
    syncViewToggle();
    var tg = $("view-toggle");
    tg.classList.remove("flip");
    void tg.offsetWidth;
    tg.classList.add("flip");
    if (lastImages === null) { viewSwitching = false; return; } // 数据未加载：仅切换控件
    if (viewMode === "list") clearThumbLoads();
    pager.page = 1; // 两种模式每页张数不同，切样式回第 1 页
    var gridEl = $("grid");
    if (!REDUCED) {
      // 锁定切换前高度 + 隐藏 grid：避免重建瞬间文档高度骤减导致滚动条"占满又恢复"的抽搐；
      // visibility:hidden 保留布局占位但不清空高度，min-height 让重建期间高度恒定
      gridEl.style.minHeight = gridEl.offsetHeight + "px";
      gridEl.style.visibility = "hidden";
    }
    renderGrid(lastImages, {
      anchor: true, noAnim: true,
      onDone: REDUCED ? null : function () {
        // 重建完成：立即释放高度锁定，让 grid 高度 = 新模式应有高度
        gridEl.style.minHeight = "";
        playDeckAnimation();
      }
    });
    if (REDUCED) viewSwitching = false; // 无动画：重建即完成
    // 兜底：空态/无卡片等动画未执行时确保解锁 + 清理 grid 隐藏与高度锁定
    setTimeout(function () {
      gridEl.style.minHeight = "";
      gridEl.style.visibility = "";
      if (viewSwitching) viewSwitching = false;
    }, 1300);
  }
  // 列表模式：优先用 KV 读到的内存 size；缺失才 HEAD 惰性探测（错峰并发），成功后顺手回写 KV
  var sizeQueue = [];
  var sizeInFlight = 0;
  var SIZE_CONCURRENCY = 4;
  function probeListSizes() {
    if (viewMode !== "list") return;
    var rows = $("grid").querySelectorAll(".lst-size");
    for (var i = 0; i < rows.length; i++) {
      var id = rows[i].getAttribute("data-id");
      if (!id || sizeCache[id]) continue;
      var img = findInLast(id);
      if (!img) continue;
      // 优先使用 KV 读取后缓存在内存的 size，无需再向上游发请求
      if (typeof img.size === "number" && img.size > 0) {
        sizeCache[id] = fmtSize(img.size);
        rows[i].textContent = sizeCache[id];
        continue;
      }
      var url = img.shortUrl || img.url;
      if (url) sizeQueue.push({ id: id, url: url, img: img });
    }
    pumpSizeQueue();
  }
  function pumpSizeQueue() {
    while (sizeInFlight < SIZE_CONCURRENCY && sizeQueue.length) {
      var item = sizeQueue.shift();
      sizeInFlight++;
      probeHeadLen(item.url).then(function (len) {
        if (len) {
          sizeCache[item.id] = fmtSize(len);
          var el = document.querySelector('.lst-size[data-id="' + item.id + '"]');
          if (el) el.textContent = sizeCache[item.id];
          // 顺手回写 KV：更新内存对象 + 调接口落库（仅当 KV 无有效 size 时后端才写入）
          if (item.img && item.img.size !== len) {
            item.img.size = len;
            api("/api/image/update", {
              method: "POST",
              body: JSON.stringify({ id: item.id, size: len }),
            }).catch(function () {});
          }
        }
      }).then(function () {
        sizeInFlight--;
        pumpSizeQueue();
      });
    }
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
  window.addEventListener("resize", debounce(function () {
    if (lastImages === null) return;
    var oldCols = gridState.cols;
    computeGridMetrics();
    if (gridState.cols === oldCols) return;
    renderGrid(lastImages, { noAnim: true }); // 列数变化：当前页重排（页码不变）
  }, 250));

  function renderFolders() {
    var bar = $("folder-bar");
    var h = '<button class="fchip' + (isAllSelected() ? " active" : "") + '" data-f="">' + esc(t("all")) + "</button>";
    h += '<button class="fchip' + (selectedFolders.indexOf("__uncat__") !== -1 ? " active" : "") + '" data-f="__uncat__">' + esc(t("folder.uncat")) + "</button>";
    lastFolders.forEach(function (f) {
      h += '<span class="fchip-wrap" data-folder="' + esc(f) + '"><button class="fchip' + (selectedFolders.indexOf(f) !== -1 ? " active" : "") + '" data-f="' + esc(f) + '">' + esc(f) + "</button>" +
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
    // 卡片详情填充完成：立即触发 size 探测（有内存 size 直接显示，无则入队 HEAD 补齐），
    // 避免"其他信息已加载、size 却等滚动/重建才出现"的延迟
    probeListSizes();
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
      return;
    }
    // 当前页删空则回退一页，再重渲染当前页
    var totalPages = Math.max(1, Math.ceil(gridState.vis.length / perPageCount()));
    if (pager.page > totalPages) pager.page = totalPages;
    renderGrid(lastImages);
    updateImgCount();
  }

  // 把一张卡插入 lastImages 首位并就地渲染（乐观添加）
  function insertCardFirstLocal(im) {
    lastImages = lastImages || [];
    lastImages.unshift(im);
    // 更新当前可见快照：若命中当前筛选则前插，否则仅入数据源
    var matches = cardShouldShow(im);
    if (gridState.vis && matches) gridState.vis.unshift(im);
    if (!matches) { updateImgCount(); return; }
    // 不在第 1 页：跳回第 1 页重渲染，让用户立即看到新添加的媒体
    if (pager.page !== 1) { pager.page = 1; renderGrid(lastImages); updateImgCount(); return; }
    var grid = $("grid");
    var card = buildCard(im, 0);
    grid.insertBefore(card, grid.firstChild);
    var emptyEl = $("empty");
    if (emptyEl) emptyEl.classList.add("hidden"); // 空态首次添加时收起空态提示
    if (!im._loading) { setupVideoThumbs(); observeThumbs(); }
    updateImgCount();
    window.scrollTo(0, 0); // 回顶部确保用户立即看到添加结果
    renderPager(gridState.vis.length);
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
    poolClearAll(); // 图源已切换：旧源 url 全部失效，清池后按新源重新加载
    thumbQueue = [];
    thumbQueue = [];
    thumbInFlight = 0;
    setupVideoThumbs();
    observeThumbs();
    scheduleCacheManage();
  }

  // 就地同步当前过滤（文件夹/搜索）到已渲染卡：显隐 + 更新 vis 快照 + 计数 + 空态。
  // 已渲染可见卡数量不足 vis（例如切到更大的文件夹）时重建网格补齐（本地，无网络）。
  function syncFilterInPlace() {
    pager.page = 1; // 筛选/搜索/换文件夹后回第 1 页
    renderGrid(lastImages);
  }

  // ===== 分页器 =====
  function perPageCount() { return viewMode === "list" ? 20 : 24; }
  function renderPager(totalCount) {
    var box = $("pager");
    if (!box) return;
    var per = perPageCount();
    var total = Math.max(1, Math.ceil(totalCount / per));
    if (pager.page > total) pager.page = total;
    box.setAttribute("data-total", String(total));
    if (totalCount <= 0) { box.innerHTML = ""; box.classList.add("hidden"); return; }
    box.classList.remove("hidden");
    var page = pager.page;
    var pgBtn = function (act, label, enabled) {
      return '<button type="button" class="pg-btn"' + (enabled ? "" : " disabled") + ' data-act="' + act + '">' + label + "</button>";
    };
    var h = pgBtn("first", "«", page > 1) + pgBtn("prev", "‹", page > 1);
    var marks = [];
    for (var i = 1; i <= total; i++) if (i === 1 || i === total || Math.abs(i - page) <= 2) marks.push(i);
    var last = 0;
    for (var n = 0; n < marks.length; n++) {
      var num = marks[n];
      if (num - last > 1) h += '<span class="pg-gap">…</span>';
      h += '<button type="button" class="pg-num' + (num === page ? " active" : "") + '" data-page="' + num + '">' + num + "</button>";
      last = num;
    }
    h += pgBtn("next", "›", page < total) + pgBtn("last", "»", page < total);
    h += '<span class="pg-info">' + esc(t("pager.info", { page: page, total: total })) + "</span>";
    box.innerHTML = h;
  }
  function gotoPage(p) {
    var total = Math.max(1, Math.ceil((gridState.vis || []).length / perPageCount()));
    if (isNaN(p) || p < 1 || p > total) {
      toast(t("pager.invalid", { max: total }), "error");
      renderPager(gridState.vis.length);
      return;
    }
    if (p === pager.page) { renderPager(gridState.vis.length); return; }
    pager.page = p;
    renderGrid(lastImages);
    window.scrollTo(0, 0);
  }
  // 当前页数字点击 → 变输入框直接跳页；非法输入错误提示且不跳转
  function startPgJump(btn) {
    var total = parseInt($("pager").getAttribute("data-total"), 10) || 1;
    var input = document.createElement("input");
    input.type = "text";
    input.className = "pg-jump";
    input.setAttribute("inputmode", "numeric");
    input.value = String(pager.page);
    btn.replaceWith(input);
    input.focus(); input.select();
    var done = false;
    var commit = function () {
      if (done) return; done = true;
      var v = parseInt(input.value, 10);
      if (isNaN(v) || v < 1 || v > total) {
        toast(t("pager.invalid", { max: total }), "error");
        renderPager(gridState.vis.length);
        return;
      }
      gotoPage(v);
    };
    input.addEventListener("keydown", function (e) {
      e.stopPropagation();
      if (e.key === "Enter") commit();
      else if (e.key === "Escape") { done = true; renderPager(gridState.vis.length); }
    });
    input.addEventListener("blur", commit);
  }
  $("pager").addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn || btn.disabled) return;
    var act = btn.getAttribute("data-act");
    var total = parseInt(this.getAttribute("data-total"), 10) || 1;
    if (btn.classList.contains("pg-num")) {
      if (btn.classList.contains("active")) { startPgJump(btn); return; }
      gotoPage(parseInt(btn.getAttribute("data-page"), 10));
      return;
    }
    if (act === "first") gotoPage(1);
    else if (act === "prev") gotoPage(pager.page - 1);
    else if (act === "next") gotoPage(pager.page + 1);
    else if (act === "last") gotoPage(total);
  });

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
    // 批量添加一次最多 50 条、需串行写多条记录，用更长超时（30s，覆盖通用 15s；
    // Cloudflare 单次请求墙钟上限即 30s）
    api("/api/convert/batch", {
      method: "POST",
      body: JSON.stringify({ urls: urls, mode: mode, folder: folder }),
      timeout: 30000,
    })
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
        // 域名未加入白名单 → 引导快捷添加（自动重试期间再次失败只提示，避免弹窗死循环）
        if (err && err.code === "origin_not_allowed" && err.host && !originRetrying) {
          openOriginModal(err.host);
        } else if (originRetrying) {
          // 白名单已保存，但后端设置缓存（约 15s）尚未生效
          toast(t("origin.retryLater"), "error");
        } else {
          toast(err.message || t("add.err"), "error");
        }
      })
      .finally(function () {
        setBusy(btn, false);
        updateAddBtnLabel(); // 请求期间可能切换了批量开关，恢复后按当前模式刷新按钮文字
        originRetrying = false; // 复位自动重试标记（已在 catch 分支消费，晚于其执行）
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
    } else if (el.closest(".img-card.view-list") && !dragBlocked(el)) {
      // 列表横条：点击行内非交互区域打开详情
      var lid = el.closest(".img-card.view-list").getAttribute("data-id");
      var limg = (lastImages || []).filter(function (x) { return x.id === lid; })[0];
      if (limg) openDetailModal(limg);
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
  // 展示样式切换（图片/列表）
  syncViewToggle(); // 初始同步：HTML 静态渲染，active 由 localStorage 校正
  $("view-toggle").addEventListener("click", function (e) {
    var btn = e.target.closest(".vt-opt");
    if (!btn) return;
    switchViewMode(btn.getAttribute("data-view"));
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
    toast(t("op.del"), "error");
    api("/api/image/delete", { method: "POST", body: JSON.stringify({ id: id }) })
      .catch(function (err) {
        // 删除失败（极少）：全量重拉恢复真实状态，保证数据一致性
        toast(err.message || t("op.delFail"), "error");
        loadImages({ anchor: true });
      });
    // 从详情弹窗删除时同步关闭
    if (detailModalImg && detailModalImg.id === id) closeDetailModal();
  });
  $("confirm-modal").addEventListener("click", function (e) { if (e.target === this) closeConfirm(); });
  function closeConfirm() { pendingDelete = null; $("confirm-modal").classList.add("hidden"); }

  // ===== SSRF 白名单快捷添加（域名未加白名单时的引导弹窗，z-index 2350）=====
  var originRetrying = false; // 保存白名单后的自动重试中：再次失败只提示，避免弹窗死循环
  var originHost = ""; // 当前弹窗展示的被拒域名（切换语言时据此重建说明文案）
  // 域名归一化：剥除协议/路径/查询串/端口并小写化，与后端 isAllowedUrl 的 hostname 语义对齐。
  // 非法输入（空、无法解析、不含点、含非法字符）返回 ""
  function normalizeDomainInput(raw) {
    var s = String(raw == null ? "" : raw).trim().toLowerCase();
    if (!s) return "";
    if (s.indexOf("://") === -1) s = "https://" + s; // 补全协议，便于用 URL 解析剥除路径与端口
    var host;
    try { host = new URL(s).hostname.toLowerCase(); } catch (e) { return ""; }
    if (!/^[a-z0-9.-]+$/.test(host) || host.indexOf(".") === -1) return "";
    return host;
  }
  function showOriginErr(msg) {
    var el = $("origin-err");
    el.textContent = msg || "";
    el.classList.toggle("show", !!msg);
  }
  // 说明段落含域名高亮 chip（HTML 由此处拼装，i18n 文案只留 {host} 占位，
  // 避免在模板字符串里嵌套转义引号）；host 来自后端响应，esc 转义后再插入
  function renderOriginDesc() {
    var chip = '<span class="origin-host">' + esc(originHost) + "</span>";
    $("origin-desc").innerHTML = t("origin.desc", { host: chip });
  }
  function openOriginModal(host) {
    originHost = host || "";
    renderOriginDesc();
    $("origin-domain").value = host || "";
    showOriginErr("");
    $("origin-modal").classList.remove("hidden");
    var input = $("origin-domain");
    input.focus();
    input.select();
  }
  function closeOriginModal() { $("origin-modal").classList.add("hidden"); }
  // 提交：以服务端完整快照为底追加域名后全量 PUT（PUT 缺字段会回落默认值），成功后自动重试添加
  function submitOriginDomain() {
    var raw = $("origin-domain").value;
    var domain = normalizeDomainInput(raw);
    if (!String(raw == null ? "" : raw).trim()) { showOriginErr(t("origin.err.empty")); $("origin-domain").focus(); return; }
    if (!domain) { showOriginErr(t("origin.err.invalid")); $("origin-domain").focus(); return; }
    var btn = $("origin-ok");
    setBusy(btn, true, t("origin.saving"));
    // PUT /api/settings 是全量替换（缺字段回落默认值）：先取服务端最新完整快照，
    // 只改 allowedOrigins 后整体回写，绝不只提交白名单字段
    api("/api/settings")
      .then(function (data) {
        var cur = (data && data.settings) || {};
        var list = (cur.allowedOrigins || []).map(function (d) { return String(d).trim().toLowerCase(); }).filter(Boolean);
        if (list.indexOf(domain) !== -1) { showOriginErr(t("origin.exists")); return null; }
        list.push(domain);
        cur.allowedOrigins = list;
        return api("/api/settings", { method: "PUT", body: JSON.stringify(cur) }).then(function () { return list; });
      })
      .then(function (list) {
        if (!list) return; // 已存在（行内提示），弹窗保持打开
        appSettings.allowedOrigins = list; // 同步本地快照，避免后续请求仍携带旧白名单
        var el = $("allowedOrigins");
        // 设置页输入框若已渲染则同步，避免显示过期值；textarea 按行展示（与"一行一个"的输入习惯一致）
        // 注意：本文件整体是模板字符串，"\\n" 才会输出 JS 里的换行转义
        if (el) { el.value = el.tagName === "TEXTAREA" ? list.join("\\n") : list.join(", "); autoGrow(el); }
        closeOriginModal();
        toast(t("origin.saveOk"), "success");
        originRetrying = true; // 标记自动重试，重试再失败只提示不弹窗
        addImage();
      })
      .catch(function (err) { toast(err.message || t("op.saveFail"), "error"); })
      .finally(function () { setBusy(btn, false); });
  }
  $("origin-cancel").addEventListener("click", closeOriginModal);
  $("origin-ok").addEventListener("click", submitOriginDomain);
  $("origin-modal").addEventListener("click", function (e) { if (e.target === this) closeOriginModal(); });
  $("origin-domain").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); submitOriginDomain(); }
  });

  // ===== 视频/音频播放独立缓存：打开播放界面（灯箱/详情页）才加载实际媒体；开始播放下一个
  // 即释放上一个；关闭播放界面后短时保留（60s），期间重开同一媒体秒开。图片走图源池不走此机制 =====
  var playingMedia = null;
  var playbackReleaseTimer = null;
  function releasePlayingMedia() {
    if (playbackReleaseTimer) { clearTimeout(playbackReleaseTimer); playbackReleaseTimer = null; }
    if (!playingMedia) return;
    try { playingMedia.el.pause(); playingMedia.el.removeAttribute("src"); playingMedia.el.load(); } catch (e) {}
    playingMedia = null;
  }
  function holdPlayingMedia(el) {
    releasePlayingMedia(); // 开始播放下一个即释放上一个
    playingMedia = { el: el };
  }
  function schedulePlaybackRelease() {
    if (!playingMedia) return;
    if (playbackReleaseTimer) clearTimeout(playbackReleaseTimer);
    playbackReleaseTimer = setTimeout(function () { playbackReleaseTimer = null; releasePlayingMedia(); }, 60000);
  }
  function openLightbox(info) {
    var url = info.url;
    var siteUrl = info.shortUrl || url;
    var box = $("lightbox-media");
    box.innerHTML = "";
    var el;
    if (info.type === "video") { el = document.createElement("video"); el.controls = true; }
    else if (info.type === "audio") { el = document.createElement("audio"); el.controls = true; }
    else { el = document.createElement("img"); el.alt = ""; }
    // 网页展示图源：site 仅对缓存代理模式生效，否则回退上游
    el.src = mediaSrc(info, appSettings.displaySource);
    if (info.type === "video" || info.type === "audio") holdPlayingMedia(el); // 播放独立缓存：切换即释放上一个
    else poolGet(el.src, true); // 灯箱大图进图源池，与卡片/详情共用一份内存
    box.appendChild(el);
    $("lightbox-open").href = url; // 「在新标签打开原图」始终指向上游原始链接
    $("lightbox-open-site").href = siteUrl; // 「在新标签打开网站外链」
    $("lightbox").classList.remove("hidden");
  }
  function closeLightbox() {
    $("lightbox").classList.add("hidden");
    $("lightbox-media").innerHTML = "";
    schedulePlaybackRelease(); // 关闭后短时保留（60s），期间重开同一媒体秒开
  }
  $("lightbox").addEventListener("click", function (e) {
    if (e.target === $("lightbox") || e.target.classList.contains("close")) closeLightbox();
  });
  function closeDetailModal() {
    $("detail-modal").classList.add("hidden");
    $("detail-thumb").innerHTML = "";
    schedulePlaybackRelease(); // 关闭后短时保留（60s），期间重开同一媒体秒开
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
  // 详情页媒体源回退：仅在走上游链接（如 OneDrive tempauth 直链超过 1 小时过期）且加载失败时自动切换到网站链接
  function attachDetailSrcFallback(el, img, src) {
    if (src !== img.url) return;
    var fallback = img.shortUrl;
    if (!fallback) return;
    var done = false;
    el.addEventListener("error", function () {
      if (done) return;
      done = true;
      el.src = fallback;
    });
  }
  function fillDetailMedia(img) {
    var box = $("detail-thumb");
    box.innerHTML = "";
    var tp = img.type || guessTypeClient(img.url);
    if (tp === "audio") {
      // 音频详情：♪ 占位符（横排）+ 可播放的音频控件，媒体源跟随「网页展示图源」设置
      var a = document.createElement("audio");
      a.controls = true;
      a.preload = "metadata";
      a.src = mediaSrc(img, appSettings.displaySource);
      holdPlayingMedia(a); // 播放独立缓存：切换即释放上一个
      attachDetailSrcFallback(a, img, a.src);
      var wrap = document.createElement("div");
      wrap.className = "detail-audio-wrap";
      wrap.innerHTML = '<div class="thumb-fallback"><span class="tf-icon">♪</span><span class="tf-id">' + esc(t("type.audio")) + "</span></div>";
      wrap.appendChild(a);
      box.appendChild(wrap);
      return;
    }
    var el = tp === "video" ? document.createElement("video") : document.createElement("img");
    if (tp === "video") {
      // 详情页视频：可播放（带控件），媒体源跟随「网页展示图源」设置
      el.controls = true;
      el.playsInline = true;
      el.preload = "metadata";
      el.src = videoThumbSrc(img, appSettings.displaySource);
      holdPlayingMedia(el); // 播放独立缓存：切换即释放上一个
      el.addEventListener("loadedmetadata", function () { setDetailDim(el.videoWidth, el.videoHeight); });
    } else {
      el.alt = img.id;
      el.onload = function () { setDetailDim(el.naturalWidth, el.naturalHeight); };
      el.src = mediaSrc(img, appSettings.displaySource);
      poolGet(el.src, true); // 详情页大图进图源池，与卡片/灯箱共用一份内存
    }
    attachDetailSrcFallback(el, img, el.src);
    box.appendChild(el);
  }
  // 公共 HEAD 探测：读取 content-length（字节数），失败或缺失返回 null（详情弹窗与列表大小探测共用）
  function probeHeadLen(url) {
    if (!url) return Promise.resolve(null);
    try {
      return fetch(url, { method: "HEAD", cache: "no-store" })
        .then(function (r) {
          var len = r.headers.get("content-length");
          return len ? Number(len) : null;
        })
        .catch(function () { return null; });
    } catch (e) { return Promise.resolve(null); }
  }
  function probeDetailSize(img) {
    // 优先用 KV 读到的内存 size；缺失才 HEAD 探测，成功后顺手回写 KV
    if (img && typeof img.size === "number" && img.size > 0) {
      $("detail-size").textContent = fmtSize(img.size);
      return;
    }
    probeHeadLen(img.shortUrl || img.url).then(function (len) {
      if (len) {
        $("detail-size").textContent = fmtSize(len);
        if (img && img.size !== len) {
          img.size = len;
          api("/api/image/update", {
            method: "POST",
            body: JSON.stringify({ id: img.id, size: len }),
          }).catch(function () {});
        }
      }
    });
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
    // 弹窗尺寸从 0 展开 + 内容异步填充：通知 GlassController 立即重算（含折射滤镜重建），
    // 避免"玻璃覆盖不全 / 需滚动一下才补上效果"
    window.dispatchEvent(new CustomEvent("lg-refresh"));
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
    // 设壁纸按钮：仅普通链接的图片媒体可用（OneDrive 直链会过期、视频不适合做静态壁纸）
    var wpBtn = $("detail-wp-btn");
    if (wpBtn) wpBtn.classList.toggle("hidden", isOneDriveImg(img) || img.type === "video");
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
  // 详情弹窗：删除媒体（复用 confirm 确认 + 乐观删除流程）
  $("detail-del-btn").addEventListener("click", function () {
    if (!detailModalImg) return;
    pendingDelete = detailModalImg.id;
    $("confirm-text").textContent = t("confirm.text", { name: displayName(detailModalImg) });
    $("confirm-modal").classList.remove("hidden");
    $("confirm-ok").focus();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!$("wp-modal").classList.contains("hidden")) $("wp-modal").classList.add("hidden");
      else if (!$("origin-modal").classList.contains("hidden")) closeOriginModal();
      else if (!$("confirm-modal").classList.contains("hidden")) closeConfirm();
      else if (!$("detail-modal").classList.contains("hidden")) closeDetailModal();
      else if (!$("lightbox").classList.contains("hidden")) closeLightbox();
      else if (!$("chip-pop").classList.contains("hidden")) $("chip-pop").classList.add("hidden");
    }
  });

  // ===== 文件夹拖拽排序（pointer 事件，与媒体卡片同模式）=====
  var fDnd = null; // 文件夹拖拽状态
  var folderDragActive = false; // 抑制拖拽结束后误触筛选 click
  $("folder-bar").addEventListener("pointerdown", function (e) {
    if (fDnd) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    var wrap = e.target.closest ? e.target.closest(".fchip-wrap") : null;
    if (!wrap || (e.target.closest && e.target.closest(".fchip-menu"))) return; // 下拉菜单不发起拖拽
    var btn = wrap.querySelector(".fchip");
    if (!btn || !btn.dataset.f) return;
    folderDragActive = false;
    fDnd = {
      name: btn.dataset.f,
      wrap: wrap,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      active: false,
      ph: null,
    };
  });
  window.addEventListener("pointermove", function (e) {
    if (!fDnd || e.pointerId !== fDnd.pointerId) return;
    if (!fDnd.active) {
      if (Math.abs(e.clientX - fDnd.startX) + Math.abs(e.clientY - fDnd.startY) < 7) return;
      fDnd.active = true;
      folderDragActive = true;
      toast(t("drag.escCancel"), "accent"); // 拖拽开始：提示按 ESC 取消
      // 从栏中移除被拖拽的源 chip，让其它文件夹立即补位（不留半透明占位）
      var fbar = $("folder-bar");
      var srcIdx = -1, pos2 = 0;
      for (var i = 0; i < fbar.children.length; i++) {
        if (fbar.children[i] === fDnd.wrap) { srcIdx = pos2; break; }
        if (fbar.children[i].classList && fbar.children[i].classList.contains("fchip-wrap")) pos2++;
      }
      fDnd.origIdx = srcIdx === -1 ? 0 : srcIdx;
      fbar.removeChild(fDnd.wrap);
      document.body.classList.add("no-select");
    }
    e.preventDefault();
    updateFolderPh(e.clientX, e.clientY);
  }, { passive: false });
  // 计算鼠标应插入的 chip 位置，实时移动占位虚线块（源 chip 已从栏中移除，其余文件夹补位）
  function updateFolderPh(x, y) {
    var bar = $("folder-bar");
    var wraps = bar.querySelectorAll(".fchip-wrap");
    var best = null, bestD = Infinity;
    for (var i = 0; i < wraps.length; i++) {
      var r = wraps[i].getBoundingClientRect();
      var c = (r.left + r.right) / 2;
      var d = Math.abs(x - c) + 0.6 * Math.abs(y - (r.top + r.bottom) / 2);
      if (d < bestD) { bestD = d; best = { el: wraps[i], before: x < c }; }
    }
    if (!best) { removeFolderPh(); return; }
    if (!fDnd.ph) {
      fDnd.ph = document.createElement("span");
      fDnd.ph.className = "fchip-ph";
      fDnd.ph.textContent = fDnd.name; // 占位显示被拖拽的文件夹名，便于分辨落点
    }
    if (best.before) bar.insertBefore(fDnd.ph, best.el);
    else {
      var nx = best.el.nextElementSibling;
      if (nx) bar.insertBefore(fDnd.ph, nx); else bar.appendChild(fDnd.ph);
    }
  }
  function removeFolderPh(ph) {
    var p = ph || (fDnd && fDnd.ph);
    if (p && p.parentNode) p.parentNode.removeChild(p);
  }
  // 源 chip 已从栏中移除；落位/取消时需放回（原位或按占位确定的新位）
  function restoreSourceWrap(d) {
    var bar = $("folder-bar");
    var wraps = bar.querySelectorAll(".fchip-wrap");
    var anchor = d.origIdx < wraps.length ? wraps[d.origIdx] : null;
    if (anchor) bar.insertBefore(d.wrap, anchor); else bar.appendChild(d.wrap);
  }
  function endFolderDrag() {
    if (!fDnd) return;
    var d = fDnd;
    fDnd = null;
    document.body.classList.remove("no-select");
    if (d.wrap) d.wrap.classList.remove("dragging");
    if (!d.active) return; // 未激活（未超过阈值）：源 chip 从未移除，无需处理
    // 落位：占位在 bar 中的位置 → 剩余文件夹序列中的插入点（源已不在 bar）
    var bar = $("folder-bar");
    var phIdx = -1, pos = 0;
    if (d.ph && d.ph.parentNode === bar) {
      var children = bar.children;
      for (var i = 0; i < children.length; i++) {
        if (children[i] === d.ph) { phIdx = pos; break; }
        if (children[i].classList && children[i].classList.contains("fchip-wrap")) pos++;
      }
    }
    removeFolderPh(d.ph);
    if (phIdx === -1) { restoreSourceWrap(d); return; } // 占位未显示（拖到空白处）：源放回原位，顺序无变化
    var arr = lastFolders.slice();
    var fi = arr.indexOf(d.name);
    if (fi === -1) { restoreSourceWrap(d); return; }
    arr.splice(fi, 1);
    var insertAt = Math.min(phIdx, arr.length);
    arr.splice(insertAt, 0, d.name);
    if (arr.join("\u0000") === lastFolders.join("\u0000")) { restoreSourceWrap(d); return; } // 顺序未变：源插回原位
    var oldOrder = lastFolders;
    lastFolders = arr;
    renderFolders(); // 重建栏，源 chip 回到新位置
    api("/api/folder/reorder", { method: "POST", body: JSON.stringify({ names: arr }) })
      .then(function () { toast(t("op.sortOk"), "success"); })
      .catch(function (err) {
        lastFolders = oldOrder;
        renderFolders();
        toast(err.message || t("op.fail"), "error");
      });
  }
  window.addEventListener("pointerup", endFolderDrag);
  window.addEventListener("pointercancel", endFolderDrag);

  var chipMenuFolder = null;
  $("folder-bar").addEventListener("click", function (e) {
    var el = e.target;
    if (folderDragActive) { folderDragActive = false; return; } // 拖拽结束，抑制误触筛选
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
      var f = el.getAttribute("data-f");
      if (f === "") {
        // 点击全部：清空筛选 = 全部文件夹都被选择
        selectedFolders = [];
      } else {
        var idx = selectedFolders.indexOf(f);
        if (idx === -1) selectedFolders.push(f); // 未选则加入
        else selectedFolders.splice(idx, 1);     // 已选则取消
      }
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
        selectedFolders = [name];
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
      var savedSel = selectedFolders.slice();
      // 乐观：就地重命名文件夹及其下所有卡
      lastImages.forEach(function (im) { if (im && im.folder === from) im.folder = name; });
      lastFolders = lastFolders.filter(function (f) { return f !== from; });
      if (lastFolders.indexOf(name) === -1) lastFolders.push(name);
      for (var si = 0; si < selectedFolders.length; si++) {
        if (selectedFolders[si] === from) selectedFolders[si] = name;
      }
      renderFolders();
      refreshCardBodies();
      syncFilterInPlace();
      api("/api/folder/rename", { method: "POST", body: JSON.stringify({ from: from, to: name }) })
        .then(function () { toast(t("folder.renameOk"), "success"); })
        .catch(function (err) {
          restoreImagesFrom(savedImgs);
          lastFolders = savedFolders;
          selectedFolders = savedSel;
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
      var savedSel2 = selectedFolders.slice();
      // 乐观：就地删除文件夹，其下卡移入未分类
      lastImages.forEach(function (im) { if (im && im.folder === delName) im.folder = ""; });
      lastFolders = lastFolders.filter(function (f) { return f !== delName; });
      var di = selectedFolders.indexOf(delName);
      if (di !== -1) selectedFolders.splice(di, 1);
      renderFolders();
      refreshCardBodies();
      syncFilterInPlace();
      api("/api/folder/delete", { method: "POST", body: JSON.stringify({ name: delName }) })
        .then(function () { toast(t("folder.deleted"), "error"); })
        .catch(function (err) {
          restoreImagesFrom(savedImgs2);
          lastFolders = savedFolders2;
          selectedFolders = savedSel2;
          renderFolders();
          refreshCardBodies();
          syncFilterInPlace();
          toast(err.message, "error");
        });
    }
  });

  var LIST_KEYS = ["allowedOrigins", "allowedCountries", "blockedCountries", "allowedIps", "blockedIps", "allowedAsn", "blockedAsn", "allowedReferers"];
  var NUM_KEYS = ["signatureTtl", "cacheTtl", "maxImageSize", "maxAudioSize", "maxVideoSize", "onedriveRefreshHours"];

  // 多值设置项 textarea 随内容自动增高：满一行即伸展，长列表不再挤成一行。
  // 隐藏视图下 scrollHeight 为 0，此时清空内联高度回落到 CSS min-height，切回可见时重算
  function autoGrow(el) {
    if (!el) return;
    el.style.height = "auto";
    var h = el.scrollHeight || 0;
    el.style.height = h ? h + "px" : "";
  }
  function autoGrowAll() {
    var tas = document.querySelectorAll("textarea.auto-grow");
    for (var i = 0; i < tas.length; i++) autoGrow(tas[i]);
  }
  var growTas = document.querySelectorAll("textarea.auto-grow");
  for (var gi = 0; gi < growTas.length; gi++) {
    growTas[gi].addEventListener("input", function () { autoGrow(this); });
  }

  function loadSettings() {
    api("/api/settings").then(function (data) {
      var s = data.settings || {};
      appSettings = s; // 全局设置缓存，缩略图/灯箱渲染读取 thumbSource/previewSource
      LIST_KEYS.forEach(function (k) {
        var el = $(k);
        if (el) el.value = (s[k] || []).join(", ");
      });
      autoGrowAll(); // 载入已配置域名后按内容调整高度（视图隐藏时会在切回设置页重算）
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
      // 统一「网页展示图源」：后端仍存 thumbSource/previewSource 两字段（同值），读取取其一
      var ds = s.thumbSource === "site" || s.previewSource === "site" ? "site" : "upstream";
      if (ds === "site") { $("displaySourceSite").checked = true; }
      else { $("displaySourceUpstream").checked = true; }
      $("originReferer").value = s.originReferer || "";
      $("originUserAgent").value = s.originUserAgent || "";
      if ($("thumbCache")) $("thumbCache").value = thumbCachePages;
      if ($("wpThumbKeep")) $("wpThumbKeep").value = wpThumbKeep;
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
      // 按逗号/空格/换行切分（与后端 splitList 一致）：白名单是 textarea，允许一行一个域名。
      // 正则里的 \s 需双写，否则会被外层模板字符串吞掉反斜杠
      body[k] = el ? el.value.split(/[,，\\s]+/).map(function (s) { return s.trim(); }).filter(Boolean) : [];
    });
    NUM_KEYS.forEach(function (k) {
      var el = $(k);
      body[k] = el ? Number(el.value) : 0;
    });
    body.requireSignature = $("requireSignature").checked;
    body.defaultMode = $("defaultModeProxy").checked ? "proxy" : "redirect";
    body.downloadNameSource = $("downloadNameSourceCustom").checked ? "custom" : "upstream";
    body.thumbSource = body.previewSource = $("displaySourceSite").checked ? "site" : "upstream"; // 统一「网页展示图源」，后端两字段同值兼容
    body.originReferer = $("originReferer").value.trim();
    body.originUserAgent = $("originUserAgent").value.trim();
    var tc = parseInt($("thumbCache") ? $("thumbCache").value : "", 10);
    thumbCachePages = clampThumbPages(tc);
    localStorage.setItem(THUMB_PAGES_KEY, String(thumbCachePages));
    var wk = parseInt($("wpThumbKeep") ? $("wpThumbKeep").value : "", 10);
    wpThumbKeep = clampWpKeep(wk);
    localStorage.setItem(WP_THUMB_KEEP_KEY, String(wpThumbKeep));
    scheduleCacheManage();
    var btn = this;
    setBusy(btn, true, t("set.busy"));
    api("/api/settings", { method: "PUT", body: JSON.stringify(body) })
      .then(function () {
        // 同步全局设置缓存并按新媒体源刷新已渲染缩略图，无需整页重建
        appSettings.displaySource = body.thumbSource; // 与 body.previewSource 同值
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
    // 白名单弹窗的说明段落是运行时生成的（含域名 chip），切语言时需按当前域名重建
    if (!$("origin-modal").classList.contains("hidden")) renderOriginDesc();
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


  // ===== 液态玻璃折射控制器（上限 30 层、卡片加权优先）=====
  var LG_MAP_EDGE_CAP = 256, LG_QUANTUM = 8, LG_MAX_LAYERS = 30, LG_LRU_MAX = 40, LG_DISPLACE_PX = 18;
  function lgDetect(defs) {
    if (!(window.CSS && CSS.supports && CSS.supports("backdrop-filter", "blur(2px) url(#x)"))) return false;
    // 必须引用真实存在的 filter：url() 解析不到目标时整条 backdrop-filter 会被丢弃
    var probeId = "lg-probe";
    var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", probeId);
    filter.innerHTML = '<feColorMatrix type="saturate" values="1"/>';
    defs.appendChild(filter);
    var probe = document.createElement("div");
    probe.style.cssText = "position:fixed;left:-9999px;top:0;width:8px;height:8px;backdrop-filter:blur(2px) url(#" + probeId + ")";
    document.body.appendChild(probe);
    var kept = (getComputedStyle(probe).backdropFilter || "").indexOf("url(") !== -1;
    if (probe.parentNode) probe.parentNode.removeChild(probe);
    if (filter.parentNode) filter.parentNode.removeChild(filter);
    return kept;
  }
  function lgQuantize(v) { return Math.max(LG_QUANTUM, Math.round(v / LG_QUANTUM) * LG_QUANTUM); }
  function lgEdgeBand(w, h) { return Math.min(Math.max(Math.min(w, h) * 0.16, 6), 24); }
  // 圆角矩形边缘透镜位移图：SDF 给出到边框的距离与外法线，边缘带内位移最强、向内衰减。
  // 通道编码 R=dx、G=dy，128 为零点（feDisplacementMap 的约定）
  function lgBakeMap(w, h, radius) {
    var cw = Math.min(Math.max(Math.round(w), 4), LG_MAP_EDGE_CAP);
    var ch = Math.min(Math.max(Math.round(h), 4), LG_MAP_EDGE_CAP);
    var r = Math.min(radius, w / 2, h / 2);
    var band = lgEdgeBand(w, h);
    var canvas = document.createElement("canvas");
    canvas.width = cw; canvas.height = ch;
    var ctx = canvas.getContext("2d");
    if (!ctx) return "";
    var image = ctx.createImageData(cw, ch);
    var data = image.data;
    var sx = w / cw, sy = h / ch;
    var halfW = w / 2, halfH = h / 2;
    var flatW = Math.max(halfW - r, 0), flatH = Math.max(halfH - r, 0);
    function sdf(x, y) {
      var qx = Math.abs(x - halfW) - flatW;
      var qy = Math.abs(y - halfH) - flatH;
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
    }
    var eps = 0.7;
    for (var py = 0; py < ch; py++) {
      var y = (py + 0.5) * sy;
      for (var px = 0; px < cw; px++) {
        var x = (px + 0.5) * sx;
        var d = sdf(x, y);
        var t = Math.min(Math.max(-d / band, 0), 1);
        var strength = (1 - t * t * (3 - 2 * t)) * (d <= 0 ? 1 : 0);
        var gx = (sdf(x + eps, y) - sdf(x - eps, y)) / (2 * eps);
        var gy = (sdf(x, y + eps) - sdf(x, y - eps)) / (2 * eps);
        var len = Math.hypot(gx, gy) || 1;
        var i = (py * cw + px) * 4;
        data[i] = 128 + Math.round((gx / len) * strength * 127);
        data[i + 1] = 128 + Math.round((gy / len) * strength * 127);
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
  }
  function lgCreateFilter(defs, w, h, radius) {
    var id = "lg-" + lgQuantize(w) + "x" + lgQuantize(h) + "x" + Math.round(radius);
    var bw = lgQuantize(w), bh = lgQuantize(h);
    var band = lgEdgeBand(bw, bh);
    // backdrop-filter 的滤镜区域不会自适应元素尺寸，必须显式给出 px 区域
    var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", id);
    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("primitiveUnits", "userSpaceOnUse");
    filter.setAttribute("x", String(-band));
    filter.setAttribute("y", String(-band));
    filter.setAttribute("width", String(bw + band * 2));
    filter.setAttribute("height", String(bh + band * 2));
    filter.setAttribute("color-interpolation-filters", "sRGB");
    var feImage = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
    // 位移图烘焙结果按参数指纹缓存（sessionStorage）：刷新/切视图后同尺寸组合直接复用，
    // 跳过 256² 像素循环 + toDataURL（这是玻璃"加载几秒"的主要耗时之一）
    var bakeKey = "mdn_lgbake:v1:" + bw + "x" + bh + "x" + Math.round(radius);
    var href = null;
    try { href = sessionStorage.getItem(bakeKey); } catch (e) {}
    if (!href) {
      href = lgBakeMap(bw, bh, radius);
      if (href) {
        try {
          sessionStorage.setItem(bakeKey, href);
          var nBake = 0, firstKey = null;
          for (var si = 0; si < sessionStorage.length; si++) {
            var sk = sessionStorage.key(si);
            if (sk && sk.indexOf("mdn_lgbake:v1:") === 0) { nBake++; if (firstKey === null) firstKey = sk; }
          }
          if (nBake > 36 && firstKey) sessionStorage.removeItem(firstKey); // 体积护栏
        } catch (e2) {}
      }
    }
    feImage.setAttribute("href", href);
    feImage.setAttribute("x", "0"); feImage.setAttribute("y", "0");
    feImage.setAttribute("width", String(bw)); feImage.setAttribute("height", String(bh));
    feImage.setAttribute("preserveAspectRatio", "none");
    feImage.setAttribute("result", "map");
    var disp = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
    disp.setAttribute("in", "SourceGraphic");
    disp.setAttribute("in2", "map");
    disp.setAttribute("scale", String(LG_DISPLACE_PX));
    disp.setAttribute("xChannelSelector", "R");
    disp.setAttribute("yChannelSelector", "G");
    disp.setAttribute("result", "warped");
    var sat = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
    sat.setAttribute("in", "warped");
    sat.setAttribute("type", "saturate");
    sat.setAttribute("values", "1.42");
    filter.appendChild(feImage); filter.appendChild(disp); filter.appendChild(sat);
    defs.appendChild(filter);
    return id;
  }
  function createGlassController(defs, glassSelector) {
    var supported = lgDetect(defs);
    var wanted = [];
    var filterIds = {};
    var order = [];
    var enabled = supported;
    var resizeTimer = null;
    function filterFor(el) {
      var rect = el.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 24) return null;
      var radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      var key = lgQuantize(rect.width) + "x" + lgQuantize(rect.height) + "x" + Math.round(radius);
      el.__lgKey = key; // 供 ResizeObserver 比对尺寸变化
      var id = filterIds[key];
      if (!id) {
        id = lgCreateFilter(defs, rect.width, rect.height, radius);
        filterIds[key] = id;
        order.push(key);
        while (order.length > LG_LRU_MAX) {
          var dead = order.shift();
          var deadEl = defs.querySelector("#" + dead);
          if (deadEl && deadEl.parentNode) deadEl.parentNode.removeChild(deadEl);
          delete filterIds[dead];
        }
      }
      return id;
    }
    function overlapRatio(el) {
      var r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return 0;
      var iw = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
      var ih = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (iw <= 0 || ih <= 0) return 0;
      return (iw * ih) / (r.width * r.height);
    }
    function apply(el, on) {
      if (!on) {
        // 短路：本就无折射的元素（视口外大多数）零开销，滚动时可静默跳过
        if (el.style.getPropertyValue("--lg-refract")) {
          el.style.removeProperty("--lg-refract");
          refreshGlassPaintOne(el);
        }
        return;
      }
      if (el.style.getPropertyValue("--lg-refract")) return;
      var id = filterFor(el);
      if (id) {
        el.style.setProperty("--lg-refract", "url(#" + id + ")");
        refreshGlassPaintOne(el); // 折射变化必须同步重建 inline 声明，否则不重绘
      }
    }
    var staticEls = [];
    function isStatic(el) { return !!(el.matches && el.matches(STATIC_GLASS_SEL)); }
    var lastAllowedSig = "";
    function reconcile() {
      // ⚠ setEnabled(true)/refresh() 前必须置空 lastAllowedSig：
      //    元素集合未变时签名相同会被下面的短路跳过，被移除的折射将永远无法恢复
      // 关闭时不清除任何状态：重新开启无需等一次滚动才恢复
      if (!enabled) {
        for (var i = 0; i < wanted.length; i++) apply(wanted[i], false);
        return;
      }
      // 静态玻璃（侧边栏/dock）：不随滚动重算，仅在需要时烘焙一次（apply 内部已注入则短路，零开销）
      for (var s = 0; s < staticEls.length; s++) apply(staticEls[s], true);
      // 就地按视口求交集排序（不依赖 IO 回调时机）；卡片与添加栏加权优先
      var ranked = [];
      for (var i = 0; i < wanted.length; i++) {
        if (staticEls.indexOf(wanted[i]) !== -1) continue; // 静态组不参与滚动排序
        var r = overlapRatio(wanted[i]);
        if (wanted[i].classList.contains("card")) r *= 1.5;
        if (r > 0.02) ranked.push([wanted[i], r]);
      }
      ranked.sort(function (a, b) { return b[1] - a[1]; });
      var allowed = [];
      for (var j = 0; j < ranked.length && j < LG_MAX_LAYERS; j++) allowed.push(ranked[j][0]);
      // 静止/微滚时允许集合通常不变：签名相同直接跳过，零计算零重绘
      var sig = "";
      for (var k = 0; k < wanted.length; k++) sig += staticEls.indexOf(wanted[k]) !== -1 ? "s" : (allowed.indexOf(wanted[k]) !== -1 ? "1" : "0");
      if (sig === lastAllowedSig) return;
      lastAllowedSig = sig;
      for (var m = 0; m < wanted.length; m++) {
        if (staticEls.indexOf(wanted[m]) !== -1) continue;
        apply(wanted[m], allowed.indexOf(wanted[m]) !== -1);
      }
    }
    var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function () { reconcile(); }, { threshold: [0, 0.03, 0.25, 0.6] }) : null;
    // 尺寸变化修复：面板展开/弹窗增高等无滚动的尺寸变化不会触发 backdrop 重算，
    // 且折射滤镜区域按旧尺寸烘焙。RO 捕获后按新 key 重算滤镜并强制重写 inline 声明。
    function forceRepaint(el) {
      var v = el.style.backdropFilter;
      if (!v) return;
      el.style.removeProperty("backdrop-filter");
      void el.offsetWidth; // 强制 reflow，确保移除-写回两阶段都被解析
      el.style.backdropFilter = v;
    }
    var ro = ("ResizeObserver" in window) ? new ResizeObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var el = entries[i].target;
        if (!enabled || wanted.indexOf(el) === -1) continue;
        var rect = el.getBoundingClientRect();
        if (rect.width < 24 || rect.height < 24) continue;
        var key = lgQuantize(rect.width) + "x" + lgQuantize(rect.height) + "x" + Math.round(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0);
        if (key !== (el.__lgKey || "")) {
          // 量化 key 变了：换新尺寸的折射滤镜并重建 inline 声明
          el.__lgKey = key;
          if (el.style.getPropertyValue("--lg-refract")) el.style.removeProperty("--lg-refract");
          apply(el, true);
        } else {
          forceRepaint(el); // key 未变也强制重算（合成层缓存缺陷兜底）
        }
      }
    }) : null;
    window.addEventListener("scroll", function () { requestAnimationFrame(reconcile); }, { passive: true });
    function collect(root, on) {
      var nodes = [];
      if (root instanceof HTMLElement && root.matches(glassSelector)) nodes.push(root);
      if (root.querySelectorAll) {
        var list = root.querySelectorAll(glassSelector);
        for (var i = 0; i < list.length; i++) nodes.push(list[i]);
      }
      for (var j = 0; j < nodes.length; j++) {
        if (on) {
          if (wanted.indexOf(nodes[j]) !== -1) continue;
          wanted.push(nodes[j]);
          if (isStatic(nodes[j])) staticEls.push(nodes[j]);
          if (io) io.observe(nodes[j]);
          if (ro) ro.observe(nodes[j]);
        } else {
          var ix = wanted.indexOf(nodes[j]);
          if (ix !== -1) wanted.splice(ix, 1);
          var sx = staticEls.indexOf(nodes[j]);
          if (sx !== -1) staticEls.splice(sx, 1);
          if (io) io.unobserve(nodes[j]);
          if (ro) ro.unobserve(nodes[j]);
          apply(nodes[j], false);
        }
      }
    }
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () { controller.refresh(); }, 160);
    });
    var controller = {
      supported: supported,
      observe: function (root) { collect(root, true); reconcile(); requestAnimationFrame(reconcile); },
      release: function (root) { collect(root, false); },
      setEnabled: function (on) { enabled = on && supported; lastAllowedSig = ""; reconcile(); },
      refresh: function () {
        if (!enabled) return;
        lastAllowedSig = ""; // 置空签名，防止下面的重注入被"集合未变"短路跳过
        for (var i = 0; i < wanted.length; i++) wanted[i].style.removeProperty("--lg-refract");
        reconcile();
        requestAnimationFrame(reconcile);
      },
      activeCount: function () { var n = 0; for (var i = 0; i < wanted.length; i++) if (wanted[i].style.getPropertyValue("--lg-refract")) n++; return n; }
    };
    return controller;
  }
  var CFX_COLORS = null;
  function applyWpColors(url, colors, item) {
    var s = document.documentElement.style;
    s.setProperty("--c1", colors[0]);
    s.setProperty("--c2", colors[1]);
    s.setProperty("--c3", colors[2]);
    s.setProperty("--accent", colors[1]);
    s.setProperty("--accent2", colors[2]);
    CFX_COLORS = null; // 主题色已变，点击特效缓存必须重置
    var img = $("wallpaper");
    if (!img) return;
    if (item && item.css) {
      // 纯 CSS 背景：写入 .bg 层，隐藏壁纸 img
      var bg = img.parentNode;
      if (bg) bg.style.background = item.css;
      img.classList.remove("show");
      img.removeAttribute("src");
      return;
    }
    var bg2 = img.parentNode;
    if (bg2) bg2.style.removeProperty("background");
    img.classList.remove("show");
    img.src = url;
    var done = function () { img.classList.add("show"); };
    if (img.decode) img.decode().then(done, done); else img.onload = done;
  }
  // 壁纸应用：读取 head 脚本选好的壁纸，解码完成后即刻淡入
  function applyWallpaper() {
    var wp = window.__WP__;
    if (!wp || !wp.url) return;
    var item = null, pool = wp.pool || [];
    for (var i = 0; i < pool.length; i++) if (pool[i].url === wp.url) { item = pool[i]; break; }
    applyWpColors(wp.url, wp.colors, item);
  }
  function wpPoolData() { return (window.__WP__ && window.__WP__.pool) || []; }

  // ===== 外观面板：控件布局参照 we-pkg-web 的 dock，适配本站图片池与浅色主题 =====
  var UI_KEY = "mdn_ui_v1", WP_SS_KEY = "mdn_wp_session_v1";
  var UI_DEF = { blur: 24, scrim: 120, sat: 175, bright: 105, refract: true, motion: true, customUrl: "", cardBodyAlpha: 8, textColor: "black" };
  var ui = (function () {
    var base = {}, raw = null, o = null;
    try { raw = localStorage.getItem(UI_KEY); } catch (e) {}
    try { o = raw ? JSON.parse(raw) : null; } catch (e2) { o = null; }
    if (o) { for (var k in UI_DEF) if (o[k] !== undefined) base[k] = o[k]; }
    for (var k2 in UI_DEF) if (base[k2] === undefined) base[k2] = UI_DEF[k2];
    // 亮度刻度迁移（旧：0–88 白遮罩 → 新：0–200，100 = 无遮罩原图）：仅折算一次，写回后由 lumaVer 标记跳过
    if (o && o.lumaVer !== 2 && typeof o.scrim === "number") base.scrim = legacyScrimToLuma(o.scrim);
    base.lumaVer = 2;
    return base;
  })();
  function saveUi() { try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (e) {} }
  function apNote(msg) { var n = $("ap-note"); if (n) n.textContent = msg || ""; }

  // 亮度自动：本站是浅色主题 + 深色正文 #1f2937，故用「白遮罩提亮」而不是参考站的黑遮罩压暗
  var SCRIM_MAX = 88, SHADE_MAX = 0.72; // 白遮罩/黑遮罩强度上限（亮度刻度换算用）
  // 亮度刻度：0–200，100 = 不加遮罩的原图；>100 叠加白遮罩提亮，<100 叠加黑遮罩压暗
  function lumaToMask(luma) {
    var v = Math.max(0, Math.min(200, typeof luma === "number" ? luma : 100));
    if (v >= 100) return { scrim: (v - 100) / 100 * (SCRIM_MAX / 100), shade: 0 };
    return { scrim: 0, shade: (100 - v) / 100 * SHADE_MAX };
  }
  // 旧刻度（0–88 白遮罩）→ 新刻度：一次性迁移用（18 → 120、88 → 200、0 → 100）
  function legacyScrimToLuma(v) {
    var s = Math.max(0, Math.min(SCRIM_MAX, typeof v === "number" ? v : 0));
    return Math.round(100 + s / SCRIM_MAX * 100);
  }
  // 说明：壁纸亮度改为纯手动 —— 自动测光只能约束「壁纸本底」亮度，而文字实际位于卡片/玻璃/信息区
  // 等叠加层之上，难以稳定给出可读结果，故移除自动按钮与测光逻辑（亮度仅由用户滑条控制）
  // Chromium 对 backdrop-filter 引用的 var() 变量更新不做合成层失效（表现为拖滑条无效果，
  // 开关其它设置触发全站重算才生效）。根治：不依赖变量更新 backdrop-filter，而是把完整
  // 声明直接写进各玻璃元素的 inline style——inline 属性变化必然触发重新解析与 backdrop 重算。
  var GLASS_SEL = ".glass,.card,.login-card,.modal-box,.origin-box,.detail-box,.sidebar,#ap-dock";
  // 静态玻璃：位置固定不变（侧边栏/外观 dock），不参与滚动 reconcile，仅在初始化/切壁纸/改设置时烘焙一次
  var STATIC_GLASS_SEL = ".sidebar,#ap-dock";
  function glassFilterValue(el) {
    var r = el.style.getPropertyValue("--lg-refract");
    return "blur(" + ui.blur + "px) saturate(" + (ui.sat / 100).toFixed(2) + ") brightness(" + (ui.bright / 100).toFixed(2) + ")" + (r ? " " + r.trim() : "");
  }
  function refreshGlassPaintOne(el) {
    // 降级路径（不支持 backdrop-filter / 系统要求减弱透明度）交给 CSS :root 规则接管
    var reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-transparency: reduce)").matches; } catch (e) {}
    var supported = false;
    try { supported = window.CSS && (CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)")); } catch (e2) {}
    if (!supported || reduce) { el.style.removeProperty("backdrop-filter"); return; }
    el.style.backdropFilter = glassFilterValue(el);
  }
  function refreshGlassPaint() {
    var els = document.querySelectorAll(GLASS_SEL);
    for (var i = 0; i < els.length; i++) refreshGlassPaintOne(els[i]);
  }
  var paintQueued = false;
  function queueGlassPaint() {
    if (paintQueued) return;
    paintQueued = true;
    requestAnimationFrame(function () { paintQueued = false; refreshGlassPaint(); });
  }
  // 渐变方向（壁纸绑定维度）：写入 --grad-angle，主题渐变与所有 var(--grad) 消费者即时联动
  function applyGradAngle(deg) {
    document.documentElement.style.setProperty("--grad-angle", Math.max(0, Math.min(360, +deg || 135)) + "deg");
  }
  function applyUi() {
    // 变量仍要写：新动态插入的卡片与降级路径靠 CSS 规则 + var() 兜底；
    // 已在视口内的玻璃元素则由 refreshGlassPaint 写 inline 声明（绕开 Chromium 变量缓存缺陷）
    var s = document.documentElement.style;
    s.setProperty("--lg-blur", ui.blur + "px");
    s.setProperty("--lg-sat", ui.sat + "%");
    s.setProperty("--lg-bright", (ui.bright / 100).toFixed(2));
    var mask = lumaToMask(ui.scrim); // 100 为中点：>100 白遮罩提亮、<100 黑遮罩压暗
    s.setProperty("--lg-scrim", mask.scrim.toFixed(3));
    s.setProperty("--lg-shade", mask.shade.toFixed(3));
    s.setProperty("--card-body-alpha", (ui.cardBodyAlpha / 100).toFixed(2));
    // 文字颜色：非法值一律兜底 black（旧数据无该字段时 UI_DEF 已兜底）
    var tc = ui.textColor === "white" ? "white" : "black";
    ui.textColor = tc;
    document.documentElement.setAttribute("data-text", tc);
    document.body.classList.toggle("motion-off", !ui.motion);
    queueGlassPaint();
  }
  function wpOptions() {
    var pool = wpPoolData();
    var cssItems = [], imgItems = [], i;
    for (i = 0; i < pool.length; i++) (pool[i].css ? cssItems : imgItems).push(pool[i]);
    imgItems = applyPoolOrder(imgItems); // 图片壁纸按用户拖拽顺序排列；新条目自动追加尾部
    var all = cssItems.concat(imgItems); // CSS 背景条目固定渲染在最前（ap-css-row），不参与拖拽
    if (ui.customUrl) all.push({ url: ui.customUrl, name: ui.customUrl, colors: null }); // 自定义 URL 临时条目固定最后，不参与拖拽
    return all;
  }
  // 壁纸池图片条目顺序：mdn_wp_pool_order 存 url 数组；失效 url 忽略、新条目追加尾部
  function loadPoolOrder() {
    try { var a = JSON.parse(wls(K_POOL_ORDER) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function applyPoolOrder(imgs) {
    var order = loadPoolOrder();
    if (!order.length) return imgs;
    var byUrl = {}, i;
    for (i = 0; i < imgs.length; i++) byUrl[imgs[i].url] = imgs[i];
    var out = [];
    for (i = 0; i < order.length; i++) { var it = byUrl[order[i]]; if (it) { out.push(it); delete byUrl[order[i]]; } }
    for (var k in byUrl) if (Object.prototype.hasOwnProperty.call(byUrl, k)) out.push(byUrl[k]);
    return out;
  }
  // 拖拽落位：持久化新顺序。预置池 → K_POOL_ORDER；自定义条目同步回 mdn_wp_custom 数组顺序；
  // window.__WP__.pool 同步重排，保证 pickWpItem 选择与壁纸池渲染和新网格顺序一致
  function savePoolOrder(urlArr) {
    wlsSet(K_POOL_ORDER, JSON.stringify(urlArr));
    var pos = {}, i;
    for (i = 0; i < urlArr.length; i++) pos[urlArr[i]] = i;
    function rank(a, b) { var pa = pos[a.url] != null ? pos[a.url] : 1e9, pb = pos[b.url] != null ? pos[b.url] : 1e9; return pa - pb; }
    try {
      var custom = JSON.parse(wls(K_CUSTOM) || "[]");
      if (Array.isArray(custom) && custom.length > 1) {
        custom.sort(rank);
        wlsSet(K_CUSTOM, JSON.stringify(custom));
      }
    } catch (e) {}
    if (window.__WP__ && Array.isArray(window.__WP__.pool) && window.__WP__.pool.length > 1) window.__WP__.pool.sort(rank);
  }
  function markActiveWp() {
    var cur = (window.__WP__ && window.__WP__.url) || "";
    var btns = document.querySelectorAll("#ap-bg-list button,#ap-css-row button");
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute("aria-pressed", String(btns[i].getAttribute("data-url") === cur));
  }
  // 壁纸池独立缓存：面板未展开时不构建不加载（首次打开才懒加载）；图片数 ≤ wpThumbKeep 长效保存，> x 关闭即卸载
  var wpPoolBuilt = false, wpPoolDirty = false;
  var wpBgIO = null; // 壁纸池缩略图懒加载观察器（root = 网格，覆盖内部滚动）
  var wpLoaded = {}; // 已加载缩略图 url 记号：拖拽落位重建时直接复用，避免全部重新加载闪烁
  function wpDockOpen() { var d = $("ap-dock"); return !!(d && d.classList.contains("open")); }
  function wpImgCount() {
    var all = wpOptions(), n = 0;
    for (var i = 0; i < all.length; i++) if (!all[i].css) n++;
    return n;
  }
  function buildBgList() {
    var box = $("ap-bg-list"), cssBox = $("ap-css-row");
    if (!box || !cssBox) return;
    if (!wpDockOpen()) { wpPoolDirty = true; return; } // 面板未展开：不构建不加载，仅标脏（首次展开才懒加载）
    wpPoolBuilt = true; wpPoolDirty = false;
    box.innerHTML = ""; cssBox.innerHTML = "";
    var mode = (window.__WP__ && window.__WP__.mode) || "random";
    var rand = loadRandSet();
    var all = wpOptions();
    for (var i = 0; i < all.length; i++) {
      (function (it) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("data-url", it.url);
        b.title = it.i18n ? t(it.i18n) : (it.name || it.url);
        if (it.css) {
          // 纯 CSS 背景：渲染色块预览
          var d = document.createElement("div");
          d.className = "ap-bg-css";
          d.style.background = it.css;
          b.appendChild(d);
        } else {
          var im = document.createElement("img");
          im.alt = ""; im.decoding = "async"; im.draggable = false; // 禁用原生图片拖拽，手势由按钮接管
          im.className = "wp-thumb-off"; // 待加载隐藏：加载完成淡入，避免闪现破图占位
          im.setAttribute("data-src", it.url); // 懒加载：进入网格视口才真正加载
          im.addEventListener("load", function () { this.classList.remove("wp-thumb-off"); });
          im.addEventListener("error", function () { b.style.opacity = ".3"; });
          b.appendChild(im);
        }
        // 随机集合框选标记（仅随机模式显示）
        if (mode === "random" && rand.indexOf(it.url) !== -1) b.classList.add("rand-in");
        b.addEventListener("click", function () { if (wpDragActive) { wpDragActive = false; return; } pickWpItem(it, true); }); // 拖拽结束的首次 click 抑制（对照 folderDragActive）
        b.addEventListener("mouseenter", function () { if (wpDnd && wpDnd.active) return; openHoverEditor(it, b); });
        b.addEventListener("mouseleave", scheduleHideHover);
        (it.css ? cssBox : box).appendChild(b);
      })(all[i]);
    }
    markActiveWp();
    observeWpThumbs();
  }
  function observeWpThumbs() {
    var box = $("ap-bg-list");
    if (!box) return;
    var nodes = box.querySelectorAll("img[data-src]");
    var useIO = "IntersectionObserver" in window;
    if (useIO && !wpBgIO) {
      wpBgIO = new IntersectionObserver(function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (entries[k].isIntersecting) loadWpThumb(entries[k].target);
        }
      }, { root: box, rootMargin: "80px 0px" });
    }
    for (var j = 0; j < nodes.length; j++) {
      // 拖拽落位会整表重建：已加载过的缩略图直接复用 src（命中浏览器缓存），避免全网格重新加载闪烁
      if (wpLoaded[nodes[j].getAttribute("data-src")] || !useIO) loadWpThumb(nodes[j]); // 无 IO 时降级为立即加载
      else wpBgIO.observe(nodes[j]);
    }
  }
  function loadWpThumb(im) {
    var u = im.getAttribute("data-src");
    if (!u || im.getAttribute("src")) return;
    im.setAttribute("src", u);
    wpLoaded[u] = 1; // 记号：拖拽重建时可直接复用
    if (wpBgIO) wpBgIO.unobserve(im);
  }
  // 面板关闭卸载：只清 src 不重建 DOM（保住拖拽顺序与 aria-pressed 选中态），重新观察等待下次展开
  function unloadWpThumbs() {
    if (!wpBgIO || !wpPoolBuilt) return;
    wpLoaded = {}; // 卸载后下次展开需重新加载，记号同步失效
    var imgs = $("ap-bg-list").querySelectorAll("img[src]");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.add("wp-thumb-off"); // 先隐藏再清 src：避免中间态闪现浏览器破图占位
      imgs[i].removeAttribute("src");
      wpBgIO.observe(imgs[i]);
    }
  }

  // ===== 壁纸池拖拽排序（pointer 事件，模式对照文件夹拖拽；仅图片壁纸，CSS 条目在独立行不参与）=====
  var wpDnd = null; // 壁纸池拖拽状态
  var wpDragActive = false; // 抑制拖拽结束后误触点击选择
  // 该标志只需被紧随 pointerup 的 click 消费一次；若松手时落在网格空白（或 ESC 后鼠标已移开）则
  // click 不会派发到按钮上，标志会一直为真并吞掉下一次正常点击 → 下一轮事件循环兜底清除
  function releaseWpDragActive() { setTimeout(function () { wpDragActive = false; }, 0); }
  $("ap-bg-list").addEventListener("pointerdown", function (e) {
    if (wpDnd) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    var b = e.target.closest ? e.target.closest("button[data-url]") : null;
    if (!b) return;
    wpDragActive = false;
    wpDnd = { url: b.getAttribute("data-url"), el: b, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, active: false, ph: null };
  });
  window.addEventListener("pointermove", function (e) {
    if (!wpDnd || e.pointerId !== wpDnd.pointerId) return;
    if (!wpDnd.active) {
      if (Math.abs(e.clientX - wpDnd.startX) + Math.abs(e.clientY - wpDnd.startY) < 7) return;
      wpDnd.active = true;
      wpDragActive = true;
      toast(t("drag.escCancel"), "accent"); // 拖拽开始：提示按 ESC 取消
      var box = $("ap-bg-list");
      var srcIdx = -1;
      for (var i = 0; i < box.children.length; i++) if (box.children[i] === wpDnd.el) { srcIdx = i; break; }
      wpDnd.origIdx = srcIdx === -1 ? 0 : srcIdx;
      box.removeChild(wpDnd.el); // 源按钮移出网格，其余自动补位（对照文件夹源 chip 移除）
      hideHoverEditor(); // 拖拽开始即收起悬浮编辑器：源按钮已移除，编辑器悬在网格上会指向失效节点
      document.body.classList.add("no-select");
    }
    e.preventDefault();
    updateWpPh(e.clientX, e.clientY);
  }, { passive: false });
  // 占位判定（照抄媒体卡片 dropIndexAt 的三规则，防多行抖动）：
  //  0) 光标在占位自身矩形内 → 保持不动（锁定当前落点；否则"ph 让位→重排→判定回选"无限抖动）
  //  1) 光标在某按钮内部（收缩矩形，HYST 迟滞带）→ 按行内左右半区插到该按钮前/后
  //  2) 光标在边缘迟滞带/gap/空白 → 保持当前占位不动（消除交接处来回切换）
  function updateWpPh(x, y) {
    var box = $("ap-bg-list");
    var btns = box.querySelectorAll("button[data-url]");
    var ph = wpDnd.ph;
    if (!ph) { ph = wpDnd.ph = document.createElement("div"); ph.className = "ap-bg-ph"; }
    // 0) 占位槽位锁定
    if (ph.parentNode === box) {
      var pr = ph.getBoundingClientRect();
      if (x >= pr.left && x <= pr.right && y >= pr.top && y <= pr.bottom) return;
    }
    // 1) 按钮内部命中（收缩矩形）
    var HYST = 5;
    for (var i = 0; i < btns.length; i++) {
      var r = btns[i].getBoundingClientRect();
      if (x >= r.left + HYST && x <= r.right - HYST && y >= r.top + HYST && y <= r.bottom - HYST) {
        if (x > (r.left + r.right) / 2) box.insertBefore(ph, btns[i].nextSibling);
        else box.insertBefore(ph, btns[i]);
        return;
      }
    }
    // 2) 边缘/gap/空白：保持不动；仅占位尚未入 DOM 时（首次激活）取最近按钮落初始位
    if (ph.parentNode !== box) {
      var best = null, bestD = Infinity;
      for (var j = 0; j < btns.length; j++) {
        var r2 = btns[j].getBoundingClientRect();
        var d = Math.abs(x - (r2.left + r2.right) / 2) + Math.abs(y - (r2.top + r2.bottom) / 2);
        if (d < bestD) { bestD = d; best = btns[j]; }
      }
      if (!best) { box.appendChild(ph); return; }
      var r3 = best.getBoundingClientRect();
      if (x < (r3.left + r3.right) / 2) box.insertBefore(ph, best); else box.insertBefore(ph, best.nextSibling);
    }
  }
  function endWpDrag() {
    if (!wpDnd) return;
    var d = wpDnd;
    wpDnd = null;
    releaseWpDragActive(); // 兜底：本次抑制优先由紧随的 click 消费，未消费则下一帧清除
    document.body.classList.remove("no-select");
    if (!d.active) return; // 未激活（未超过阈值）：源按钮从未移除，无需处理
    // 落位：占位在网格 children 中的索引 → 图片条目 url 新序（源按钮已被移除，其余按现序）
    var box = $("ap-bg-list");
    var phIdx = -1, i;
    if (d.ph && d.ph.parentNode === box) {
      for (i = 0; i < box.children.length; i++) if (box.children[i] === d.ph) { phIdx = i; break; }
    }
    if (d.ph && d.ph.parentNode) d.ph.parentNode.removeChild(d.ph);
    var cur = [];
    for (i = 0; i < box.children.length; i++) {
      var u = box.children[i].getAttribute && box.children[i].getAttribute("data-url");
      if (u) cur.push(u);
    }
    if (phIdx === -1) { buildBgList(); return; } // 占位未显示（拖到面板外）：顺序无变化，重建恢复
    var urls = cur.slice();
    urls.splice(Math.min(phIdx, urls.length), 0, d.url);
    // 顺序未变判定：占位索引与源原索引等价（phIdx===origIdx 即原位；phIdx===origIdx+1 即紧邻右位，等价原位）
    if (phIdx === d.origIdx || phIdx === d.origIdx + 1) { buildBgList(); return; }
    savePoolOrder(urls);
    buildBgList();
    toast(t("op.sortOk"), "success");
  }
  window.addEventListener("pointerup", endWpDrag);
  window.addEventListener("pointercancel", endWpDrag);

  // 亮度滑条 UI 同步（滑条位置 + 百分比数值）
  function syncLumaUI() {
    var b = $("ap-bright");
    if (b) b.value = String(ui.scrim);
    var v = $("ap-bright-val");
    if (v) v.textContent = ui.scrim + "%";
  }
  // 换壁纸时的亮度处理：仅 CSS 预置背景带固定亮度值（直接采用）；图片壁纸保持用户手动设置的亮度
  function applyWpLuma(item) {
    if (item && item.css && typeof item.scrim === "number") {
      ui.scrim = Math.max(0, Math.min(200, item.scrim));
      syncLumaUI();
      applyUi(); saveUi();
    }
  }
  // ===== 随机集合：随机模式下点击壁纸 = 加入/移出随机轮换（固定模式点击仍立即切换） =====
  function loadRandSet() {
    var a = [];
    try { a = JSON.parse(localStorage.getItem("mdn_wp_rand") || "[]") || []; } catch (e) { a = []; }
    return Array.isArray(a) ? a : [];
  }
  function saveRandSet(a) { try { localStorage.setItem("mdn_wp_rand", JSON.stringify(a)); } catch (e) {} }
  function toggleRandItem(url) {
    var a = loadRandSet();
    var ix = a.indexOf(url);
    if (ix === -1) a.push(url); else a.splice(ix, 1);
    saveRandSet(a);
    if (window.__WP__) window.__WP__.randSet = a;
    toast(ix === -1 ? t("wp.randAdded") : t("wp.randRemoved"));
  }

  function pickWpItem(it, fromUser) {
    var mode = (window.__WP__ && window.__WP__.mode) || "random";
    if (fromUser && mode === "random") {
      toggleRandItem(it.url);
      buildBgList(); // 刷新框选标记
      return;
    }
    var go = function (cols) {
      try { localStorage.setItem("mdn_wp_mode", "fixed"); localStorage.setItem("mdn_wp_fixed", it.url); } catch (e) {}
      if (window.__WP__) { window.__WP__.mode = "fixed"; window.__WP__.url = it.url; }
      applyWpColors(it.url, cols, it);
      var p = getPresetFor(it);
      if (p) {
        // 壁纸绑定预设：同步覆盖全局四项并立即生效
        Object.assign(ui, p);
        applyGradAngle(p.gradAngle);
        syncSlidersFromUi(); applyUi(); saveUi();
      } else {
        applyWpLuma(it); // 无绑定预设：仅 CSS 背景采用其预置亮度，图片壁纸保持当前手动亮度
      }
      if (fromUser) { try { sessionStorage.setItem(WP_SS_KEY, it.url); } catch (e) {} }
      renderWpMode(); markActiveWp();
    };
    if (it.colors) go(it.colors);
    else suggestColors(it.url).then(function (cols) { go(cols || ["#34b5ec", "#8cc5ee", "#f16b84"]); });
  }

  // ===== 壁纸缩略图悬浮预设编辑器（单例；即改即存；ESC 恢复打开前状态） =====
  var hoverEl = null, hoverItem = null, hoverSnap = null, hoverHideTimer = null;
  function isCustomWp(it) {
    var custom = [];
    try { custom = JSON.parse(localStorage.getItem("mdn_wp_custom") || "[]") || []; } catch (e) { custom = []; }
    for (var i = 0; i < custom.length; i++) if (custom[i].url === it.url) return true;
    return false;
  }
  // 完整保存条目（颜色 + 预设）：自定义条目写 mdn_wp_custom，预置条目写 mdn_wp_preset 映射
  function saveWpItem(it) {
    if (!it || !it.url || (it.url || "").indexOf("css:") === 0) return;
    var isCustom = false, custom = [];
    try { custom = JSON.parse(localStorage.getItem("mdn_wp_custom") || "[]") || []; } catch (e) { custom = []; }
    if (!Array.isArray(custom)) custom = [];
    for (var i = 0; i < custom.length; i++) {
      if (custom[i].url === it.url) { custom[i].colors = it.colors; custom[i].preset = it.preset || custom[i].preset; isCustom = true; break; }
    }
    if (isCustom) { try { localStorage.setItem("mdn_wp_custom", JSON.stringify(custom)); } catch (e) {} }
    else {
      var m = loadPresetMap();
      m[it.url] = { colors: it.colors, preset: it.preset || null };
      try { localStorage.setItem(K_WP_PRESET, JSON.stringify(m)); } catch (e2) {}
    }
    if (window.__WP__) {
      for (var j = 0; j < window.__WP__.pool.length; j++) {
        if (window.__WP__.pool[j].url === it.url) { window.__WP__.pool[j].colors = it.colors; window.__WP__.pool[j].preset = it.preset; }
      }
    }
  }
  function ensureApplied(it) {
    var wp = window.__WP__;
    if (!wp || wp.url === it.url) return;
    // 仅切换展示的壁纸做实时预览，不改写模式：随机模式保持随机（下次刷新仍按 deck 轮换）
    wp.url = it.url;
    applyWpColors(it.url, it.colors, it);
  }
  function commitHoverChange() {
    // 即改即存：保存条目 → 若编辑的不是当前壁纸则切换过去预览 → 参数同步全站
    saveWpItem(hoverItem);
    ensureApplied(hoverItem);
    var p = hoverItem.preset;
    Object.assign(ui, { scrim: p.scrim, blur: p.blur, sat: p.sat, bright: p.bright, textColor: p.textColor === "white" ? "white" : "black" });
    applyGradAngle(p.gradAngle);
    syncSlidersFromUi(); applyUi(); saveUi();
    markActiveWp(); syncTextColorUI();
  }
  function fillHoverValues() {
    var p = hoverPreset();
    $("wh-c1").value = hoverItem.colors[0]; $("wh-c2").value = hoverItem.colors[1]; $("wh-c3").value = hoverItem.colors[2];
    $("wh-scrim").value = p.scrim; $("wh-blur").value = p.blur; $("wh-sat").value = p.sat; $("wh-lum").value = p.bright; $("wh-grad").value = p.gradAngle;
    $("wh-scrim-v").textContent = p.scrim + "%"; $("wh-blur-v").textContent = p.blur;
    $("wh-sat-v").textContent = p.sat + "%"; $("wh-lum-v").textContent = p.bright + "%"; $("wh-grad-v").textContent = p.gradAngle + "°";
    $("wh-name").textContent = hoverItem.i18n ? t(hoverItem.i18n) : (hoverItem.name || hoverItem.url);
    $("wh-remove").style.display = isCustomWp(hoverItem) ? "" : "none";
    setTextColorButtons("#wh-text-color", p.textColor === "white" ? "white" : "black");
    setTextColorButtons("#ap-text-color", ui.textColor === "white" ? "white" : "black");
  }
  // 文字颜色按钮组 active 同步（外观面板用全局值，悬浮编辑器用当前预设值）
  function setTextColorButtons(sel, val) {
    var btns = document.querySelectorAll(sel + " [data-text-color]");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].getAttribute("data-text-color") === val);
  }
  function syncTextColorUI() {
    setTextColorButtons("#ap-text-color", ui.textColor === "white" ? "white" : "black");
    if (hoverItem) setTextColorButtons("#wh-text-color", hoverPreset().textColor === "white" ? "white" : "black");
  }
  function hoverPreset() {
    if (!hoverItem.preset || typeof hoverItem.preset !== "object") {
      hoverItem.preset = { scrim: ui.scrim, blur: ui.blur, sat: ui.sat, bright: ui.bright, gradAngle: ui.gradAngle != null ? ui.gradAngle : 135, textColor: ui.textColor === "white" ? "white" : "black", lumaVer: 2 };
    }
    return migratePreset(hoverItem.preset); // 打开旧预设时顺带完成亮度折算
  }
  function openHoverEditor(it, btn) {
    if (it.css) return; // CSS 背景预设固定，无编辑器
    var wp = window.__WP__;
    var curItem = null;
    if (wp) { var pool = wp.pool || []; for (var i = 0; i < pool.length; i++) if (pool[i].url === wp.url) { curItem = pool[i]; break; } }
    hoverItem = it;
    // 快照打开前状态（ESC 恢复）：被编辑条目的颜色/预设 + 当前壁纸 + 全局四值 + 渐变角度
    hoverSnap = {
      itemColors: (it.colors || []).slice(),
      itemPreset: getPresetFor(it) ? JSON.parse(JSON.stringify(getPresetFor(it))) : null,
      wpUrl: wp ? wp.url : "",
      curColors: curItem ? curItem.colors.slice() : null,
      ui4: { scrim: ui.scrim, blur: ui.blur, sat: ui.sat, bright: ui.bright, textColor: ui.textColor },
      grad: getComputedStyle(document.documentElement).getPropertyValue("--grad-angle").trim() || "135deg"
    };
    fillHoverValues();
    fillHoverI18n(); // 语言切换后重开浮窗时刷新文案
    hoverEl.classList.add("show"); // 先 display:block 才能读到真实尺寸
    positionHover(btn);
    if (hoverHideTimer) { clearTimeout(hoverHideTimer); hoverHideTimer = null; }
    var hinted = false;
    try { hinted = !!localStorage.getItem("mdn_wp_escHint"); } catch (e) {}
    if (!hinted) { try { localStorage.setItem("mdn_wp_escHint", "1"); } catch (e2) {} toast(t("wp.escHint")); }
  }
  function positionHover(btn) {
    var r = btn.getBoundingClientRect();
    var w = 248, h = hoverEl.offsetHeight || 340;
    var top = r.top + window.scrollY - h - 8;
    if (r.top - h - 8 < 8) top = r.bottom + window.scrollY + 8; // 上方放不下翻到下方
    var left = Math.min(Math.max(r.left + window.scrollX, 8), window.scrollX + window.innerWidth - w - 8);
    hoverEl.style.top = top + "px";
    hoverEl.style.left = left + "px";
  }
  function scheduleHideHover() {
    if (hoverHideTimer) clearTimeout(hoverHideTimer);
    hoverHideTimer = setTimeout(function () { hideHoverEditor(); }, 260);
  }
  function hideHoverEditor() {
    if (!hoverEl) return;
    hoverEl.classList.remove("show");
    hoverItem = null;
  }
  function restoreHoverSnap() {
    var it = hoverItem, snap = hoverSnap;
    hideHoverEditor();
    if (!it || !snap) return;
    it.colors = snap.itemColors;
    if (snap.itemPreset) it.preset = snap.itemPreset; else delete it.preset;
    saveWpItem(it);
    var wp = window.__WP__;
    if (wp && snap.wpUrl && wp.url !== snap.wpUrl) {
      var pool = wp.pool || [], cur = null;
      for (var i = 0; i < pool.length; i++) if (pool[i].url === snap.wpUrl) { cur = pool[i]; break; }
      if (cur) {
        wp.url = snap.wpUrl; // 同样不改写模式，保持打开前的随机/固定状态
        applyWpColors(snap.wpUrl, cur.colors, cur);
      }
    }
    Object.assign(ui, snap.ui4);
    document.documentElement.style.setProperty("--grad-angle", snap.grad);
    syncSlidersFromUi(); applyUi(); saveUi();
    renderWpMode(); markActiveWp(); syncTextColorUI();
    toast(t("wp.restored"));
  }
  function removeHoverWp() {
    var it = hoverItem;
    if (!it || !isCustomWp(it)) return;
    var custom = [];
    try { custom = JSON.parse(localStorage.getItem("mdn_wp_custom") || "[]") || []; } catch (e) { custom = []; }
    var next = [];
    for (var i = 0; i < custom.length; i++) if (custom[i].url !== it.url) next.push(custom[i]);
    try { localStorage.setItem("mdn_wp_custom", JSON.stringify(next)); } catch (e) {}
    var wp = window.__WP__;
    var wasCurrent = wp && wp.url === it.url;
    if (wp) {
      var pool = [];
      for (var j = 0; j < wp.pool.length; j++) if (wp.pool[j].url !== it.url) pool.push(wp.pool[j]);
      wp.pool = pool;
      saveRandSet(loadRandSet().filter(function (u) { return u !== it.url; }));
    }
    hideHoverEditor();
    if (wasCurrent && wp && wp.pool.length) {
      var target = null;
      for (var k = 0; k < wp.pool.length; k++) if ((wp.pool[k].url || "").indexOf("css:") !== 0) { target = wp.pool[k]; break; }
      if (!target) target = wp.pool[0];
      pickWpItem(target, false);
    }
    buildBgList();
    toast(t("wp.removed"), "error"); // 删除类操作用红色警示渐变（原未传 type 落到紫色 info）
  }
  // 悬浮窗为运行时创建的 DOM，不经过启动时的 applyLang：创建后与每次打开时手动填充文案
  function fillHoverI18n() {
    if (!hoverEl) return;
    var els = hoverEl.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) els[i].textContent = t(els[i].getAttribute("data-i18n"));
  }
  function ensureHoverDom() {
    if (hoverEl) return hoverEl;
    hoverEl = document.createElement("div");
    hoverEl.className = "wp-hover";
    hoverEl.innerHTML =
      '<p class="wh-title" id="wh-title" data-i18n="wp.editTitle"></p>' +
      '<p class="wh-name" id="wh-name"></p>' +
      '<div class="wp-colors">' +
      '<label><input type="color" id="wh-c1" /><span data-i18n="wp.color1"></span></label>' +
      '<label><input type="color" id="wh-c2" /><span data-i18n="wp.color2"></span></label>' +
      '<label><input type="color" id="wh-c3" /><span data-i18n="wp.color3"></span></label>' +
      "</div>" +
      '<label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.bright"></span><small id="wh-scrim-v"></small></span><input type="range" id="wh-scrim" min="0" max="200" step="1" /></label>' +
      '<label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.blur"></span><small id="wh-blur-v"></small></span><input type="range" id="wh-blur" min="0" max="40" step="1" /></label>' +
      '<label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.sat"></span><small id="wh-sat-v"></small></span><input type="range" id="wh-sat" min="100" max="260" step="5" /></label>' +
      '<label class="ap-slider"><span class="ap-slider-top"><span data-i18n="set.ap.lum"></span><small id="wh-lum-v"></small></span><input type="range" id="wh-lum" min="80" max="140" step="1" /></label>' +
      '<label class="ap-slider"><span class="ap-slider-top"><span data-i18n="wp.gradAngle"></span><small id="wh-grad-v"></small></span><input type="range" id="wh-grad" min="0" max="360" step="5" /></label>' +
      '<div class="wh-text-row" id="wh-text-color">' +
      '<span class="wh-text-label" data-i18n="set.ap.textColor"></span>' +
      '<button type="button" class="wp-mode-btn" data-text-color="black" data-i18n="set.ap.textBlack"></button>' +
      '<button type="button" class="wp-mode-btn" data-text-color="white" data-i18n="set.ap.textWhite"></button>' +
      "</div>" +
      '<button type="button" id="wh-remove" data-i18n="wp.remove"></button>' +
      '<p class="wh-hint" data-i18n="wp.escHintLine"></p>';
    document.body.appendChild(hoverEl);
    fillHoverI18n();
    hoverEl.addEventListener("mouseenter", function () { if (hoverHideTimer) { clearTimeout(hoverHideTimer); hoverHideTimer = null; } });
    hoverEl.addEventListener("mouseleave", scheduleHideHover);
    ["wh-c1", "wh-c2", "wh-c3"].forEach(function (id, idx) {
      $(id).addEventListener("input", function () {
        if (!hoverItem) return;
        hoverItem.colors[idx] = this.value;
        commitHoverChange();
      });
    });
    [["wh-scrim", "scrim", "wh-scrim-v", function (v) { return v + "%"; }],
     ["wh-blur", "blur", "wh-blur-v", function (v) { return v; }],
     ["wh-sat", "sat", "wh-sat-v", function (v) { return v + "%"; }],
     ["wh-lum", "bright", "wh-lum-v", function (v) { return v + "%"; }],
     ["wh-grad", "gradAngle", "wh-grad-v", function (v) { return v + "°"; }]].forEach(function (cfg) {
      $(cfg[0]).addEventListener("input", function () {
        if (!hoverItem) return;
        $(cfg[2]).textContent = cfg[3](this.value);
        hoverPreset()[cfg[1]] = +this.value || 0;
        commitHoverChange();
      });
    });
    $("wh-text-color").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-text-color]") : null;
      if (!b || !hoverItem) return;
      hoverPreset().textColor = b.getAttribute("data-text-color") === "white" ? "white" : "black";
      commitHoverChange();
    });
    $("wh-remove").addEventListener("click", removeHoverWp);
    return hoverEl;
  }
  // 壁纸池 ‹/› 切换功能已移除：壁纸仅通过点击网格条目选择
  function renderWpMode() {
    var row = $("wp-mode");
    if (!row) return;
    var mode = (window.__WP__ && window.__WP__.mode) || "random";
    var btns = row.querySelectorAll(".wp-mode-btn");
    for (var j = 0; j < btns.length; j++) btns[j].classList.toggle("active", btns[j].getAttribute("data-mode") === mode);
  }
  function commitCustom() {
    var v = ($("ap-custom").value || "").trim();
    if (!v) {
      if (ui.customUrl) { ui.customUrl = ""; saveUi(); buildBgList(); }
      return;
    }
    var ok = false;
    try { var u = new URL(v); ok = (u.protocol === "http:" || u.protocol === "https:"); } catch (e) { ok = false; }
    if (!ok) { apNote(t("set.ap.badUrl")); return; }
    ui.customUrl = v; saveUi(); buildBgList();
    pickWpItem({ url: v, name: v, colors: null }, true);
  }
  // 详情页「设为壁纸」写入自定义池后同步重建网格
  function syncWpPanel() { buildBgList(); renderWpMode(); }

  // 外观面板全部控件绑定（交互照抄 we-pkg-web 的 dock）
  function initAppearance(ctl) {
    var panel = $("ap-dock"), toggle = $("ap-toggle"), body = $("ap-body");
    var bright = $("ap-bright");
    var blur = $("ap-blur"), blurVal = $("ap-blur-val");
    var sat = $("ap-sat"), satVal = $("ap-sat-val");
    var lum = $("ap-lum"), lumVal = $("ap-lum-val");
    var bodyA = $("ap-body-alpha"), bodyAv = $("ap-body-val");
    var refract = $("ap-refract"), motion = $("ap-motion"), custom = $("ap-custom");

    syncLumaUI();
    blur.value = String(ui.blur); blurVal.textContent = String(ui.blur);
    sat.value = String(ui.sat); satVal.textContent = ui.sat + "%";
    lum.value = String(ui.bright); lumVal.textContent = ui.bright + "%";
    bodyA.value = String(ui.cardBodyAlpha); bodyAv.textContent = ui.cardBodyAlpha + "%";
    motion.checked = !!ui.motion;
    var tcRow = $("ap-text-color");
    if (tcRow) {
      tcRow.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("[data-text-color]") : null;
        if (!b) return;
        ui.textColor = b.getAttribute("data-text-color") === "white" ? "white" : "black";
        saveUi(); applyUi(); syncTextColorUI();
      });
    }
    syncTextColorUI();
    custom.value = ui.customUrl || "";

    bright.addEventListener("input", function () {
      var v = parseInt(this.value, 10);
      if (isNaN(v)) v = 100;                    // ⚠ 不可写成 "|| 100" 形式：0% 是合法值，会被 falsy 兜底吞成 100%
      ui.scrim = Math.max(0, Math.min(200, v)); // 0–200：100 = 无遮罩原图
      syncLumaUI();
      applyUi(); saveUi();
    });
    blur.addEventListener("input", function () {
      ui.blur = Math.max(0, Math.min(40, parseInt(this.value, 10) || 0));
      blurVal.textContent = String(ui.blur);
      applyUi();
    });
    blur.addEventListener("change", function () { saveUi(); if (ctl) ctl.refresh(); }); // 松手才重建折射滤镜
    sat.addEventListener("input", function () {
      ui.sat = Math.max(100, Math.min(260, parseInt(this.value, 10) || 175));
      satVal.textContent = ui.sat + "%";
      applyUi(); saveUi();
    });
    lum.addEventListener("input", function () {
      ui.bright = Math.max(80, Math.min(140, parseInt(this.value, 10) || 105));
      lumVal.textContent = ui.bright + "%";
      applyUi(); saveUi();
    });
    bodyA.addEventListener("input", function () {
      ui.cardBodyAlpha = Math.max(0, Math.min(100, parseInt(this.value, 10) || 0));
      bodyAv.textContent = ui.cardBodyAlpha + "%";
      applyUi(); saveUi();
    });
    refract.addEventListener("change", function () {
      ui.refract = this.checked;
      if (ctl) ctl.setEnabled(ui.refract); // 内部已同步重建 inline 声明
      saveUi();
    });
    motion.addEventListener("change", function () {
      ui.motion = this.checked;
      applyUi(); saveUi();
    });
    custom.addEventListener("change", commitCustom);
    custom.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); commitCustom(); } });
    $("wp-mode").addEventListener("click", function (e) {
      var b = e.target.closest(".wp-mode-btn");
      if (!b) return;
      var mode = b.getAttribute("data-mode");
      try { localStorage.setItem("mdn_wp_mode", mode); } catch (err) {}
      if (window.__WP__) window.__WP__.mode = mode;
      renderWpMode();
      buildBgList(); // 重渲染框选标记（仅随机模式显示）
    });
    toggle.addEventListener("click", function () {
      var open = body.hidden;
      body.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("open", open);
      if (open) {
        if (!wpPoolBuilt || wpPoolDirty) buildBgList(); // 首次展开才构建并懒加载；期间数据有变则重建
      } else if (wpThumbKeep === 0 || wpImgCount() > wpThumbKeep) {
        unloadWpThumbs(); // 超过长效阈值（或阈值 0）：关闭即卸载，下次展开重新加载
      }
      if (open && ctl) ctl.refresh(); // 展开后新露出的玻璃元素立即补上折射
    });

    renderWpMode();
    ensureHoverDom();
    // 渲染完成 / 弹窗打开等时机 dispatch 的 "lg-refresh"：立即全量重算玻璃（绕过 reconcile 签名跳过）
    window.addEventListener("lg-refresh", function () { if (ctl) ctl.refresh(); });
    // 玻璃元素的入场动画（popIn 带 scale）进行中时 getBoundingClientRect 是中间帧尺寸，
    // 按它烘焙的滤镜区域偏小 → 动画结束后玻璃覆盖不全。仅在尺寸确实变化时重建：
    // cardIn 等位移/淡入动画不改宽高，直接跳过（否则切样式重建每张卡都会触发全站重算）
    document.addEventListener("animationend", function (e) {
      var el = e.target;
      if (!el || !el.matches || !el.matches(GLASS_SEL) || !ctl) return;
      var r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 24) return;
      var key = lgQuantize(r.width) + "x" + lgQuantize(r.height) + "x" + Math.round(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0);
      if (key === (el.__lgKey || "")) return;
      el.__lgKey = "";
      ctl.refresh();
    });
    // 悬浮编辑器的 ESC 恢复（capture 优先于其它 Escape 逻辑，仅编辑器打开时处理）
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !hoverItem) return;
      e.preventDefault();
      e.stopPropagation();
      restoreHoverSnap();
    }, true);
    if (ctl) ctl.setEnabled(ui.refract);
    refract.checked = !!ui.refract && !!(ctl && ctl.supported);
    if (!ctl || !ctl.supported) {
      refract.disabled = true;
      refract.checked = false;
      apNote(t("set.ap.noRefract"));
    }
    var wp0 = window.__WP__;
    if (wp0 && wp0.url) {
      var it0 = null, pool0 = wp0.pool || [];
      for (var pi = 0; pi < pool0.length; pi++) if (pool0[pi].url === wp0.url) { it0 = pool0[pi]; break; }
      applyWpLuma(it0); // 首屏壁纸：CSS 背景采用预定义亮度，图片壁纸保持用户设置
    }
  }
  // ===== 详情页「设为壁纸」：canvas 自动取色建议 + 手动三色确认 =====
  var wpTarget = null;
  function wpFileName(img) {
    var base = (img.name || "").trim() || ((img.url || "").split("/").pop().split("?")[0]) || "wallpaper";
    var ext = "";
    var m = base.match(/\\.(\\w{2,5})$/);
    if (m) { base = base.slice(0, base.length - m[0].length); ext = m[1]; }
    else if (img.fileExt) ext = img.fileExt;
    else ext = img.type === "video" ? "mp4" : img.type === "audio" ? "mp3" : "jpg";
    return base + "." + ext;
  }
  function suggestColors(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        try {
          var cv = document.createElement("canvas");
          var w = 140, h = Math.max(1, Math.round(140 * img.naturalHeight / img.naturalWidth));
          cv.width = w; cv.height = h;
          var ctx = cv.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          var data = ctx.getImageData(0, 0, w, h).data;
          var bins = Array.apply(null, new Array(24)).map(function () { return { n: 0, r: 0, g: 0, b: 0 }; });
          for (var i = 0; i < data.length; i += 4) {
            var r = data[i], g = data[i + 1], b = data[i + 2];
            var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
            var l = (mx + mn) / 510, d = mx - mn, sat = d > 0 ? (l > 0.5 ? d / (510 - mx - mn) : d / (mx + mn)) : 0;
            if (l < 0.12 || l > 0.95 || sat < 0.10) continue;
            var hue = 0;
            if (d > 0) {
              if (mx === r) hue = ((g - b) / d + (g < b ? 6 : 0));
              else if (mx === g) hue = (b - r) / d + 2;
              else hue = (r - g) / d + 4;
              hue = hue / 6 * 360;
            }
            var wgt = 0.3 + sat;
            var bi = Math.min(23, Math.floor(hue / 15));
            bins[bi].n += wgt; bins[bi].r += r * wgt; bins[bi].g += g * wgt; bins[bi].b += b * wgt;
          }
          var sorted = bins.map(function (v, i) { return { i: i, v: v }; }).filter(function (o) { return o.v.n > 0; })
            .sort(function (a, b) { return b.v.n - a.v.n; });
          var far = function (p, o, min) { var d = Math.abs(p.i - o.i); return Math.min(d, 24 - d) >= min; };
          var picked = [];
          [3, 2, 1].forEach(function (minGap) {
            sorted.forEach(function (o) {
              if (picked.length >= 3) return;
              if (picked.indexOf(o) >= 0) return;
              if (picked.every(function (p) { return far(p, o, minGap); })) picked.push(o);
            });
          });
          if (!picked.length) { resolve(null); return; }
          var cols = picked.map(function (o) {
            var r = o.v.r / o.v.n, g = o.v.g / o.v.n, b = o.v.b / o.v.n;
            var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
            var l = (mx + mn) / 510, d = mx - mn, s2 = d > 0 ? (l > 0.5 ? d / (510 - mx - mn) : d / (mx + mn)) : 0, h = 0;
            if (d > 0) {
              if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
              else if (mx === g) h = (b - r) / d + 2;
              else h = (r - g) / d + 4;
              h = h / 6 * 360;
            }
            var sat2 = Math.min(0.72, Math.max(0.42, s2 * 1.4));
            var l2 = Math.min(0.66, Math.max(0.42, l));
            h = ((h % 360) + 360) % 360 / 360;
            var rr, gg, bb;
            if (sat2 === 0) { rr = gg = bb = Math.round(l2 * 255); }
            else {
              var q = l2 < 0.5 ? l2 * (1 + sat2) : l2 + sat2 - l2 * sat2, p2 = 2 * l2 - q;
              var f = function (t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p2 + (q - p2) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p2 + (q - p2) * (2 / 3 - t) * 6; return p2; };
              rr = Math.round(f(h + 1 / 3) * 255); gg = Math.round(f(h) * 255); bb = Math.round(f(h - 1 / 3) * 255);
            }
            return "#" + [rr, gg, bb].map(function (v) { return Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"); }).join("");
          });
          while (cols.length < 3) cols.push(cols[cols.length - 1] || "#8b5cf6");
          resolve(cols);
        } catch (e) { resolve(null); }
      };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }
  function updateWpPreview() {
    $("wp-preview").style.background = "linear-gradient(90deg," + $("wp-c1").value + "," + $("wp-c2").value + "," + $("wp-c3").value + ")";
  }
  // 壁纸绑定预设：自定义条目带 preset 字段持久化在 mdn_wp_custom；预置条目只读，preset 存映射表
  var K_WP_PRESET = "mdn_wp_preset";
  function loadPresetMap() {
    var m = null;
    try { m = JSON.parse(localStorage.getItem(K_WP_PRESET) || "{}"); } catch (e) { m = null; }
    return m && typeof m === "object" ? m : {};
  }
  // 旧预设亮度折算（旧：0–88 白遮罩 → 新：0–200）：lumaVer 标记后不再重复折算
  function migratePreset(p) {
    if (!p) return p;
    if (p.lumaVer !== 2 && typeof p.scrim === "number") p.scrim = legacyScrimToLuma(p.scrim);
    p.lumaVer = 2;
    return p;
  }
  function getPresetFor(it) {
    if (!it) return null;
    if (it.preset && typeof it.preset === "object") return migratePreset(it.preset);
    return migratePreset(loadPresetMap()[it.url] || null);
  }
  function savePresetFor(it, preset) {
    if (!it || !it.url) return;
    if ((it.url || "").indexOf("css:") === 0) return; // CSS 预置背景预设固定，不持久化
    if (preset) preset.lumaVer = 2; // 标记为已折算的新刻度
    var isCustom = false;
    var custom = [];
    try { custom = JSON.parse(localStorage.getItem("mdn_wp_custom") || "[]") || []; } catch (e) { custom = []; }
    if (!Array.isArray(custom)) custom = [];
    for (var i = 0; i < custom.length; i++) {
      if (custom[i].url === it.url) { custom[i].preset = preset; isCustom = true; break; }
    }
    if (isCustom) { try { localStorage.setItem("mdn_wp_custom", JSON.stringify(custom)); } catch (e) {} }
    else { var m = loadPresetMap(); m[it.url] = preset; try { localStorage.setItem(K_WP_PRESET, JSON.stringify(m)); } catch (e2) {} }
    if (window.__WP__) {
      for (var j = 0; j < window.__WP__.pool.length; j++) if (window.__WP__.pool[j].url === it.url) window.__WP__.pool[j].preset = preset;
    }
  }
  // 把外观面板滑条 UI 同步到当前 ui 值（预设应用后调用）
  function syncSlidersFromUi() {
    syncLumaUI();
    var bl = $("ap-blur"); if (bl) { bl.value = String(ui.blur); var bv = $("ap-blur-val"); if (bv) bv.textContent = String(ui.blur); }
    var sa = $("ap-sat"); if (sa) { sa.value = String(ui.sat); var sv = $("ap-sat-val"); if (sv) sv.textContent = ui.sat + "%"; }
    var lu = $("ap-lum"); if (lu) { lu.value = String(ui.bright); var lv = $("ap-lum-val"); if (lv) lv.textContent = ui.bright + "%"; }
    var ba = $("ap-body-alpha"); if (ba) { ba.value = String(ui.cardBodyAlpha); var bav = $("ap-body-val"); if (bav) bav.textContent = ui.cardBodyAlpha + "%"; }
  }
  function syncWpSliderLabels() {
    $("wp-scrim-val").textContent = $("wp-scrim").value + "%";
    $("wp-blur-val").textContent = $("wp-blur").value;
    $("wp-sat-val").textContent = $("wp-sat").value + "%";
    $("wp-lum-val").textContent = $("wp-lum").value + "%";
    $("wp-grad-val").textContent = $("wp-grad").value + "°";
  }
  // 打开弹窗：editing=false 详情页「设为壁纸」（新增条目）；editing=true 再次点击已选壁纸（编辑预设）
  function openWpModal(info) {
    wpTarget = info;
    var c1 = $("wp-c1"), c2 = $("wp-c2"), c3 = $("wp-c3");
    c1.value = info.colors ? info.colors[0] : "#34b5ec";
    c2.value = info.colors ? info.colors[1] : "#8cc5ee";
    c3.value = info.colors ? info.colors[2] : "#f16b84";
    var p = getPresetFor(info.itemRef) || {};
    $("wp-scrim").value = String(p.scrim != null ? p.scrim : ui.scrim);
    $("wp-blur").value = String(p.blur != null ? p.blur : ui.blur);
    $("wp-sat").value = String(p.sat != null ? p.sat : ui.sat);
    $("wp-lum").value = String(p.bright != null ? p.bright : ui.bright);
    $("wp-grad").value = String(p.gradAngle != null ? p.gradAngle : (ui.gradAngle != null ? ui.gradAngle : 135));
    syncWpSliderLabels();
    var title = $("wp-modal-title"), desc = $("wp-modal-desc"), ok = $("wp-ok");
    var tKey = ["wp.title", "wp.desc", "wp.ok"]; // editing 入口已删（改悬浮编辑器），弹窗仅剩新增条目
    title.setAttribute("data-i18n", tKey[0]); title.textContent = t(tKey[0]);
    desc.setAttribute("data-i18n", tKey[1]); desc.textContent = t(tKey[1]);
    ok.setAttribute("data-i18n", tKey[2]); ok.textContent = t(tKey[2]);
    updateWpPreview();
    $("wp-modal").classList.remove("hidden");
    if (!info.colors) {
      suggestColors(info.url).then(function (cols) {
        if (!cols || $("wp-modal").classList.contains("hidden")) return; // 弹窗已关则不覆盖
        c1.value = cols[0]; c2.value = cols[1]; c3.value = cols[2];
        updateWpPreview();
      });
    }
  }
  $("detail-wp-btn").addEventListener("click", function () {
    if (!detailModalImg) return;
    var info = { url: detailModalImg.url || "", name: wpFileName(detailModalImg) };
    if (!info.url) { toast(t("wp.err"), "error"); return; }
    openWpModal(info);
  });
  ["wp-c1", "wp-c2", "wp-c3"].forEach(function (id) { $(id).addEventListener("input", updateWpPreview); });
  ["wp-scrim", "wp-blur", "wp-sat", "wp-lum", "wp-grad"].forEach(function (id) {
    $(id).addEventListener("input", syncWpSliderLabels);
  });
  $("wp-cancel").addEventListener("click", function () { $("wp-modal").classList.add("hidden"); });
  $("wp-ok").addEventListener("click", function () {
    $("wp-modal").classList.add("hidden");
    if (!wpTarget) return;
    var colors = [$("wp-c1").value, $("wp-c2").value, $("wp-c3").value];
    var wpScrimInit = parseInt($("wp-scrim").value, 10);
    if (isNaN(wpScrimInit)) wpScrimInit = 100; // ⚠ 不可写成 "|| 100" 形式：0% 是合法值
    var preset = { scrim: Math.max(0, Math.min(200, wpScrimInit)), blur: Math.max(0, Math.min(40, +$("wp-blur").value || 0)), sat: Math.max(100, Math.min(260, +$("wp-sat").value || 175)), bright: Math.max(80, Math.min(140, +$("wp-lum").value || 105)), gradAngle: Math.max(0, Math.min(360, +$("wp-grad").value || 135)), textColor: ui.textColor === "white" ? "white" : "black", lumaVer: 2 };
    var custom = [];
    try { custom = JSON.parse(localStorage.getItem("mdn_wp_custom") || "[]") || []; } catch (e) { custom = []; }
    if (!Array.isArray(custom)) custom = [];
    var entry = { url: wpTarget.url, name: wpTarget.name, colors: colors, preset: preset };
    custom.push(entry);
    try { localStorage.setItem("mdn_wp_custom", JSON.stringify(custom)); } catch (e) {}
    if (window.__WP__) window.__WP__.pool.push(entry);
    var mode = (window.__WP__ && window.__WP__.mode) || "random";
    if (mode === "fixed") { try { localStorage.setItem("mdn_wp_fixed", wpTarget.url); } catch (e) {} }
    applyWpColors(wpTarget.url, colors, entry);
    Object.assign(ui, preset);
    applyGradAngle(preset.gradAngle);
    syncSlidersFromUi(); applyUi(); saveUi();
    toast(t("wp.applied"), "success");
    syncWpPanel();
    wpTarget = null;
  });
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

  applyLang();
  applyWallpaper();
  applyUi();
  // 液态玻璃控制器：折射能力探测失败（Safari/Firefox）自动降级纯 CSS 玻璃
  var glassCtl = null;
  var lgDefs = document.querySelector("#lg-defs defs") || document.getElementById("lg-defs");
  if (lgDefs) {
    glassCtl = createGlassController(lgDefs, ".glass,.card,.login-card,.modal-box,.origin-box,.detail-box");
    glassCtl.observe(document.body);
  }
  initAppearance(glassCtl);
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
