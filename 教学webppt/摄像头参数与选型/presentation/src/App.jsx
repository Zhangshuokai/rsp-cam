import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  LayoutGrid,
  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { slides } from "./slides.jsx";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

export default function App() {
  const total = slides.length;
  const [index, setIndex] = useState(() => {
    const m = window.location.hash.match(/#\/(\d+)/);
    return m ? clamp(parseInt(m[1], 10) - 1, 0, total - 1) : 0;
  });
  const [overview, setOverview] = useState(false);
  const [sidebar, setSidebar] = useState(isDesktop);
  const [immersive, setImmersive] = useState(false);
  const [nativeFs, setNativeFs] = useState(false);
  const touchStart = useRef(null);
  const mainRef = useRef(null);

  const goto = useCallback(
    (n) => setIndex((cur) => clamp(typeof n === "function" ? n(cur) : n, 0, total - 1)),
    [total]
  );
  const next = useCallback(() => goto((i) => i + 1), [goto]);
  const prev = useCallback(() => goto((i) => i - 1), [goto]);

  /* 翻页后把内容滚回顶部，避免沿用上一页的滚动位置 */
  useEffect(() => {
    mainRef.current?.scrollTo?.({ top: 0 });
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [index]);

  /* 断点变化时同步目录：桌面默认展开，手机默认收起 */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setSidebar(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  /* 手机端点击目录后自动收起 */
  const selectSlide = useCallback(
    (i) => {
      goto(i);
      if (!isDesktop()) setSidebar(false);
    },
    [goto]
  );

  /* hash sync */
  useEffect(() => {
    const want = `#/${index + 1}`;
    if (window.location.hash !== want) window.history.replaceState(null, "", want);
  }, [index]);

  useEffect(() => {
    const onHash = () => {
      const m = window.location.hash.match(/#\/(\d+)/);
      if (m) setIndex(clamp(parseInt(m[1], 10) - 1, 0, total - 1));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [total]);

  /* fullscreen + immersive fallback */
  useEffect(() => {
    const onFs = () => {
      const on = Boolean(document.fullscreenElement);
      setNativeFs(on);
      // 进入原生全屏时同时开启沉浸模式；退出时不强制复位，
      // 避免浏览器在切换过程中发出瞬时的 fullscreenchange（element 为 null）把状态冲掉。
      if (on) setImmersive(true);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const enterImmersive = useCallback(() => {
    setImmersive(true);
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) {
      try {
        const r = req.call(el);
        if (r && typeof r.catch === "function") r.catch(() => {});
      } catch (e) {
        /* 嵌入环境可能禁止原生全屏，使用沉浸模式作为兜底 */
      }
    }
  }, []);

  const exitImmersive = useCallback(() => {
    setImmersive(false);
    if (document.fullscreenElement) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exit) {
        try {
          const r = exit.call(document);
          if (r && typeof r.catch === "function") r.catch(() => {});
        } catch (e) {
          /* ignore */
        }
      }
    }
  }, []);

  const toggleImmersive = useCallback(() => {
    if (immersive || document.fullscreenElement) exitImmersive();
    else enterImmersive();
  }, [immersive, enterImmersive, exitImmersive]);

  /* keyboard —— 只注册一次，通过 ref 读取最新处理函数，避免重复监听导致跳多页 */
  const keyRef = useRef({});
  keyRef.current = { next, prev, goto, total, toggleImmersive, exitImmersive, overview };
  useEffect(() => {
    const onKey = (e) => {
      const H = keyRef.current;
      if (!H) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.repeat) return; // 长按不连续跳页
      const t = e.target;
      const formEl =
        t &&
        (t.tagName === "BUTTON" ||
          t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable);
      // 避免在按钮/输入框上按空格或回车时，既触发控件又翻页
      if (formEl && (e.key === " " || e.key === "Enter")) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
        case "Enter":
          e.preventDefault();
          if (H.overview) setOverview(false);
          else H.next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          H.prev();
          break;
        case "Home":
          H.goto(0);
          break;
        case "End":
          H.goto(H.total - 1);
          break;
        case "f":
        case "F":
          H.toggleImmersive();
          break;
        case "o":
        case "O":
          setOverview((v) => !v);
          break;
        case "[":
          setSidebar((v) => !v);
          break;
        case "Escape":
          setOverview(false);
          H.exitImmersive();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* 触摸滑动翻页：仅当横向位移明显大于纵向时才翻页，避免和纵向滚动冲突 */
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s || overview) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      (dx < 0 ? next : prev)();
    }
  };

  /* section list for sidebar */
  const groups = useMemo(() => {
    const out = [];
    slides.forEach((s, i) => {
      const last = out[out.length - 1];
      if (last && last.name === s.group) last.items.push({ i, nav: s.nav });
      else out.push({ name: s.group, items: [{ i, nav: s.nav }] });
    });
    return out;
  }, []);

  const progress = ((index + 1) / total) * 100;
  const active = slides[index];

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden">
      {/* Sidebar：桌面内联，手机为抽屉 --------------------------------- */}
      {!immersive && sidebar && (
        <div
          className="no-print fixed inset-0 z-30 bg-ink/30 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}
      {!immersive && (
        <aside
          aria-hidden={!sidebar || undefined}
          className={`no-print fixed inset-y-0 left-0 z-40 flex w-[16rem] flex-none flex-col border-r border-line bg-paper transition-transform duration-300 md:static md:z-auto md:translate-x-0 md:bg-paper/80 md:backdrop-blur ${
            sidebar ? "translate-x-0" : "pointer-events-none -translate-x-full md:hidden"
          }`}
        >
          <div className="flex items-center gap-2.5 px-5 py-5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-teal2 text-white">
              <span className="text-[0.95rem] font-extrabold">选</span>
            </div>
            <div className="leading-tight">
              <p className="text-[0.9rem] font-bold text-ink">摄像头参数与选型</p>
              <p className="text-[0.72rem] text-muted">硬件 · 协议 · 选型</p>
            </div>
            <button
              onClick={() => setSidebar(false)}
              title="收起目录 ["
              className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
            >
              <PanelLeftClose size={17} />
            </button>
          </div>
          <nav className="thin-scroll flex-1 overflow-y-auto px-3 pb-4">
            {groups.map((g) => (
              <div key={g.name} className="mb-3">
                <p className="px-3 pb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted/80">
                  {g.name}
                </p>
                <ul>
                  {g.items.map((it) => {
                    const on = it.i === index;
                    return (
                      <li key={it.i}>
                        <button
                          onClick={() => selectSlide(it.i)}
                          className={`mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[0.86rem] transition ${
                            on
                              ? "bg-brand-50 font-bold text-brand-800"
                              : "text-slateink hover:bg-canvas"
                          }`}
                        >
                          <span className={`tnum w-5 text-[0.72rem] ${on ? "text-brand-600" : "text-muted/70"}`}>
                            {String(it.i + 1).padStart(2, "0")}
                          </span>
                          {it.nav}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Main ---------------------------------------------------------- */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* progress */}
        {!immersive && (
          <div className="no-print absolute inset-x-0 top-0 z-20 h-1 bg-line/60">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-teal2 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* top bar */}
        {!immersive && (
        <header className="no-print flex items-center gap-2 px-4 pb-2 pt-3 md:gap-3 md:px-8 md:pt-4">
          <button
            onClick={() => setSidebar(true)}
            title="目录"
            className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-line bg-paper text-muted hover:text-ink md:hidden"
          >
            <Menu size={17} />
          </button>
          {!sidebar && (
            <button
              onClick={() => setSidebar(true)}
              title="展开目录 ["
              className="hidden h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-muted hover:text-ink md:grid"
            >
              <PanelLeftOpen size={17} />
            </button>
          )}
          <span className="hidden text-[0.8rem] font-semibold text-muted md:inline">
            {active.group} · {active.nav}
          </span>
          <span className="min-w-0 truncate text-[0.78rem] font-semibold text-muted md:hidden">
            {active.nav}
          </span>
          <div className="ml-auto flex flex-none items-center gap-2">
            <button
              onClick={() => setOverview(true)}
              title="总览 [O]"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-muted hover:text-ink"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              onClick={toggleImmersive}
              title="全屏 [F]"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-muted hover:text-ink"
            >
              {nativeFs || immersive ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
          </div>
        </header>
        )}

        {/* slide area */}
        <main
          ref={mainRef}
          className={`thin-scroll relative flex-1 overflow-y-auto ${
            immersive
              ? "px-4 pb-10 pt-6 md:px-16 md:pb-12 md:pt-10"
              : "px-4 pb-20 pt-2 md:px-10 md:pb-24"
          }`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div key={index} className="animate-slide-in flex min-h-full flex-col">
            {active.el}
          </div>
        </main>

        {/* bottom controls */}
        {!immersive && (
          <div className="no-print absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-line/70 bg-paper/85 px-4 py-2.5 backdrop-blur md:gap-4 md:px-8 md:py-3">
            <div className="tnum flex-none text-[0.8rem] font-semibold tracking-wider text-muted md:text-[0.82rem]">
              {String(index + 1).padStart(2, "0")}
              <span className="text-muted/50"> / {String(total).padStart(2, "0")}</span>
            </div>
            <div className="hidden items-center gap-2 text-[0.76rem] text-muted sm:flex">
              <kbd className="rounded border border-line bg-canvas px-1.5 py-0.5">←</kbd>
              <kbd className="rounded border border-line bg-canvas px-1.5 py-0.5">→</kbd>
              翻页
              <kbd className="ml-2 rounded border border-line bg-canvas px-1.5 py-0.5">O</kbd>
              总览
              <kbd className="ml-2 rounded border border-line bg-canvas px-1.5 py-0.5">F</kbd>
              全屏
            </div>
            <div className="truncate text-[0.72rem] text-muted sm:hidden">左右滑动翻页</div>
            <div className="ml-auto flex flex-none items-center gap-2">
              <button
                onClick={prev}
                disabled={index === 0}
                title="上一页 [←]"
                className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-paper text-ink transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-40 md:h-10 md:w-10"
              >
                <ChevronLeft size={19} />
              </button>
              <button
                onClick={next}
                disabled={index === total - 1}
                title="下一页 [→]"
                className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-paper text-ink transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-40 md:h-10 md:w-10"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        )}

        {/* immersive controls */}
        {immersive && (
          <div className="no-print absolute right-4 top-4 z-30 flex items-center gap-2 opacity-40 transition-opacity duration-200 hover:opacity-100">
            <span className="tnum rounded-lg border border-line bg-paper/85 px-3 py-1.5 text-[0.78rem] font-semibold text-muted backdrop-blur">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              onClick={() => setOverview(true)}
              title="总览 [O]"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper/85 text-muted backdrop-blur hover:text-ink"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              onClick={exitImmersive}
              title="退出全屏 [F]"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper/85 text-muted backdrop-blur hover:text-ink"
            >
              <Minimize2 size={17} />
            </button>
          </div>
        )}

        {/* overview overlay */}
        {overview && (
          <div className="no-print absolute inset-0 z-30 flex flex-col bg-canvas/95 backdrop-blur-sm">
            <div className="flex items-center px-6 py-4">
              <h3 className="text-[1.05rem] font-extrabold text-ink">全部页面</h3>
              <button
                onClick={() => setOverview(false)}
                className="ml-auto grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-muted hover:text-ink"
              >
                <X size={17} />
              </button>
            </div>
            <div className="thin-scroll grid flex-1 grid-cols-2 gap-3 overflow-y-auto px-6 pb-8 md:grid-cols-4 xl:grid-cols-5">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    goto(i);
                    setOverview(false);
                  }}
                  className={`surface flex h-24 flex-col items-start justify-between p-3 text-left transition hover:border-brand-400 hover:shadow-lift ${
                    i === index ? "border-brand-400 ring-2 ring-brand-200" : ""
                  }`}
                >
                  <span className="tnum text-[0.7rem] font-bold text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.88rem] font-semibold leading-snug text-ink">{s.nav}</span>
                  <span className="text-[0.68rem] text-muted">{s.group}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* screen reader announcement */}
      <p className="sr-only" aria-live="polite">
        第 {index + 1} 页，共 {total} 页：{active.nav}
      </p>
    </div>
  );
}
