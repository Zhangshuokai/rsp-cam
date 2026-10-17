import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Camera,
  CheckCircle2,
  Compass,
  Cpu,
  Download,
  Eye,
  Focus,
  FolderTree,
  Gauge,
  Layers,
  Lightbulb,
  ListChecks,
  Network,
  Play,
  RotateCcw,
  Route,
  ShieldCheck,
  Target,
  Usb,
  Wrench,
  Zap,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Steps, Pre } from "./components.jsx";

/* ============================================================
   守则第七节 · 点式动画（全册 ≤3 处）
   纯前端实现：React state + setTimeout + CSS transition，无任何外链资源。
   默认全亮（静态兜底：停帧 / 无 JS / 打印时完整可读）；播放时逐点 idle → active → done。
   颜色编码全册统一：蓝＝设备 / 硬件，橙＝软件 / 参数，绿＝验证通过。
   ============================================================ */
function useSequence(count, initial = "on", { step = 950, hold = 850 } = {}) {
  const [statuses, setStatuses] = useState(() => Array(count).fill(initial));
  const timers = useRef([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);
  const reset = useCallback(() => {
    clearTimers();
    setStatuses(Array(count).fill(initial));
  }, [clearTimers, count, initial]);
  const play = useCallback(() => {
    clearTimers();
    setStatuses(Array(count).fill("idle"));
    for (let i = 0; i < count; i += 1) {
      timers.current.push(
        setTimeout(() => {
          setStatuses((prev) => {
            const next = [...prev];
            if (i > 0) next[i - 1] = "done";
            next[i] = "active";
            return next;
          });
        }, i * step)
      );
    }
    timers.current.push(
      setTimeout(() => setStatuses(Array(count).fill("done")), count * step + hold)
    );
  }, [clearTimers, count, step, hold]);
  const jump = useCallback(
    (idx) => {
      clearTimers();
      setStatuses(
        Array.from({ length: count }, (_, j) => (j < idx ? "done" : j === idx ? "active" : "idle"))
      );
    },
    [clearTimers, count]
  );
  return { statuses, play, reset, jump };
}

const NODE_TONE = {
  need: {
    idle: "border-line bg-paper text-muted",
    on: "border-slate-400 bg-slate-100 text-slateink",
    active: "border-slate-600 bg-slate-600 text-white",
    done: "border-good bg-good text-white",
  },
  param: {
    idle: "border-line bg-paper text-muted",
    on: "border-amber-400 bg-amber-50 text-warn2",
    active: "border-warn2 bg-warn2 text-white",
    done: "border-good bg-good text-white",
  },
  board: {
    idle: "border-line bg-paper text-muted",
    on: "border-brand-400 bg-brand-50 text-brand-700",
    active: "border-brand-600 bg-brand-600 text-white",
    done: "border-good bg-good text-white",
  },
};

const SEG_TONE = { need: "bg-slate-400", param: "bg-warn2", board: "bg-brand-500" };
const segClass = (side, st) =>
  st === "done" ? "bg-good" : st === "idle" ? "bg-line" : SEG_TONE[side] || "bg-brand-500";

const PlayBtn = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-[0.82rem] font-semibold text-white transition hover:bg-brand-700"
  >
    <Play size={13} />
    {children}
  </button>
);

const ResetBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-300 bg-paper px-3.5 py-1.5 text-[0.82rem] font-semibold text-brand-700 transition hover:bg-brand-50"
  >
    <RotateCcw size={13} />
    重置
  </button>
);

/* 颜色编码图例（记忆锚之一，在多张图示里重复出现） */
const ColorLegend = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.78rem] text-muted">
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-brand-600" />
      蓝＝设备 / 硬件
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-warn2" />
      橙＝软件 / 参数
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝验证通过
    </span>
  </div>
);

/* ---- 点式动画 ① 选型决策流程（横向）：需求 → 焦距/分辨率/帧率/接口 → 选定型号 ---- */
const DECISION = [
  { no: "1", side: "need", title: "场景需求", sub: "距离 · 运动 · 光照 · 预算" },
  { no: "2", side: "param", title: "焦距", sub: "近大远小 · 长短广窄" },
  { no: "3", side: "param", title: "分辨率", sub: "像素数 · 单像素尺寸" },
  { no: "4", side: "param", title: "帧率 / 延迟", sub: "看画面 25fps 够" },
  { no: "5", side: "board", title: "接口带宽", sub: "USB2 / USB3 / CSI" },
  { no: "6", side: "board", title: "选定型号", sub: "对号入座 · 验证通过" },
];

function DecisionFlow() {
  const { statuses, play, reset, jump } = useSequence(DECISION.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {DECISION.map((s, i) => {
          const st = statuses[i];
          return (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => jump(i)}
                title={`跳到第 ${i + 1} 步`}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors duration-500 md:flex-col md:gap-2 md:py-3.5 md:text-center ${
                  NODE_TONE[s.side][st]
                }`}
              >
                <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-current text-[0.9rem] font-bold md:h-10 md:w-10">
                  {st === "active" && (
                    <span
                      className={`absolute inset-0 animate-ping rounded-full ${
                        s.side === "param" ? "bg-amber-400/50" : s.side === "need" ? "bg-slate-400/50" : "bg-brand-400/50"
                      }`}
                    />
                  )}
                  <span className="relative">{s.no}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-bold leading-tight md:text-[0.95rem]">{s.title}</span>
                  <span className="block text-[0.76rem] leading-tight opacity-80 md:text-[0.8rem]">{s.sub}</span>
                </span>
              </button>
              {i < DECISION.length - 1 && (
                <span
                  className={`ml-[1.15rem] h-3 w-0.5 flex-none self-start rounded-full transition-colors duration-500 md:ml-1 md:mr-1 md:h-0.5 md:w-6 md:self-center ${segClass(
                    s.side,
                    st
                  )}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PlayBtn onClick={play}>播放点式动画</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="text-[0.78rem] text-muted">点节点可手动跳到该步；默认全亮＝静态兜底。</span>
      </div>
      <div className="mt-2.5 border-t border-line pt-2.5">
        <ColorLegend />
      </div>
    </div>
  );
}

/* ---- 点式动画 ② / ③ 纵向点式分步（参数-效果、换机核对共用） ---- */
function PointSteps({ steps, hint }) {
  const { statuses, play, reset, jump } = useSequence(steps.length, "on", { step: 1050, hold: 900 });
  return (
    <div className="surface p-4 md:p-5">
      <div className="space-y-2.5">
        {steps.map((s, i) => {
          const st = statuses[i];
          const badge =
            st === "done"
              ? "bg-good text-white"
              : st === "active"
              ? "bg-warn2 text-white"
              : st === "idle"
              ? "bg-slate-200 text-muted"
              : s.side === "board"
              ? "bg-brand-600 text-white"
              : s.side === "param"
              ? "bg-warn2 text-white"
              : s.side === "good"
              ? "bg-good text-white"
              : "bg-slate-600 text-white";
          return (
            <button
              key={i}
              type="button"
              onClick={() => jump(i)}
              className={`flex w-full items-start gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-colors duration-500 ${
                st === "done"
                  ? "border-good bg-emerald-50"
                  : st === "active"
                  ? "border-warn2 bg-amber-50"
                  : "border-line bg-paper"
              }`}
            >
              <span
                className={`relative mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full text-[0.8rem] font-bold transition-colors duration-500 ${badge}`}
              >
                {st === "active" && <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/50" />}
                <span className="relative">{i + 1}</span>
              </span>
              <span className="min-w-0">
                <span className="block text-[0.92rem] font-bold text-ink">{s.t}</span>
                <span className="block text-[0.82rem] leading-relaxed text-muted">{s.s}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlayBtn onClick={play}>逐步推进</PlayBtn>
        <ResetBtn onClick={reset} />
        {hint && <span className="text-[0.78rem] text-muted">{hint}</span>}
      </div>
    </div>
  );
}

/* ---- 理解型图示：焦距-视野关系（内联 SVG 静态图；可配合本机 ManimGX 动画《同一距离：焦距决定视野》） ---- */
const FocalFov = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 284"
      role="img"
      aria-label="同一距离下焦距决定视野：短焦距广角看到整间屋子，长焦距长焦只看到一扇窗并被放大"
      className="h-auto w-full"
    >
      <text x="8" y="18" fill="#0f172a" fontSize="12.5" fontWeight="700">
        同一距离：焦距决定视野（近大远小、长短广窄）
      </text>

      {/* 短焦距 · 广角 */}
      <text x="8" y="46" fill="#b4690e" fontSize="12" fontWeight="700">短焦距 · 广角镜头</text>
      <rect x="10" y="58" width="52" height="34" rx="9" fill="#fef3c7" stroke="#fbbf24" />
      <circle cx="42" cy="75" r="7" fill="#b4690e" />
      <polygon points="66,75 400,52 400,98" fill="#fef3c7" opacity="0.55" />
      <line x1="66" y1="75" x2="400" y2="52" stroke="#b4690e" strokeWidth="1.6" />
      <line x1="66" y1="75" x2="400" y2="98" stroke="#b4690e" strokeWidth="1.6" />
      <line x1="400" y1="46" x2="400" y2="104" stroke="#94a3b8" strokeWidth="2" />
      <text x="412" y="68" fill="#475569" fontSize="11">看到整间屋子</text>
      <text x="412" y="86" fill="#b4690e" fontSize="11" fontWeight="700">视野大 · 物体小</text>

      {/* 长焦距 · 长焦 */}
      <text x="8" y="164" fill="#1a5cae" fontSize="12" fontWeight="700">长焦距 · 长焦镜头</text>
      <rect x="10" y="176" width="52" height="34" rx="9" fill="#eff8ff" stroke="#93cdfb" />
      <circle cx="42" cy="193" r="7" fill="#1f72d6" />
      <polygon points="66,193 400,182 400,204" fill="#dbeefe" opacity="0.7" />
      <line x1="66" y1="193" x2="400" y2="182" stroke="#1a5cae" strokeWidth="1.6" />
      <line x1="66" y1="193" x2="400" y2="204" stroke="#1a5cae" strokeWidth="1.6" />
      <line x1="400" y1="176" x2="400" y2="210" stroke="#94a3b8" strokeWidth="2" />
      <text x="412" y="186" fill="#475569" fontSize="11">只看到一扇窗</text>
      <text x="412" y="204" fill="#1a5cae" fontSize="11" fontWeight="700">视野小 · 物体大（放大）</text>

      {/* 底部：记忆锚 + 颜色编码 */}
      <rect x="8" y="232" width="664" height="44" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray="4 4" />
      <text x="24" y="252" fill="#0f172a" fontSize="11.5" fontWeight="700">口诀：近大远小、长短广窄</text>
      <text x="24" y="269" fill="#475569" fontSize="10.5">
        类比：广角＝站在门口拍全屋；长焦＝用望远镜看一扇窗。焦距短 → 视野广；焦距长 → 视野窄。
      </text>
    </svg>
  </div>
);

/* ---- 收尾理解型图示：行动决策树（内联 SVG 静态图） ---- */
const ActionTree = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 220"
      role="img"
      aria-label="行动决策树：看不清或拖影时先判断能否软件补偿，能则补光固定距离调参，不能再判断硬约束，防拖影换全局快门、近距对焦换可对焦镜头，最后验证"
      className="h-auto w-full"
    >
      <defs>
        <marker id="at-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
        </marker>
      </defs>

      <rect x="250" y="10" width="180" height="42" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="340" y="36" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">看不清 / 拖影</text>

      <line x1="280" y1="52" x2="180" y2="86" stroke="#64748b" strokeWidth="2" markerEnd="url(#at-arrow)" />
      <line x1="400" y1="52" x2="500" y2="86" stroke="#64748b" strokeWidth="2" markerEnd="url(#at-arrow)" />
      <text x="196" y="76" fill="#b4690e" fontSize="10" fontWeight="700">能补偿</text>
      <text x="470" y="76" fill="#1a5cae" fontSize="10" fontWeight="700">不能补偿</text>

      <rect x="24" y="88" width="290" height="52" rx="10" fill="#fef3c7" stroke="#fbbf24" />
      <text x="40" y="112" fill="#0f172a" fontSize="11.5" fontWeight="700">先榨干现有（软件 / 参数）</text>
      <text x="40" y="130" fill="#475569" fontSize="10.5">补光 + 固定工作距离 + 调参 —— 零成本先见效</text>

      <rect x="366" y="88" width="290" height="52" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="382" y="112" fill="#0f172a" fontSize="11.5" fontWeight="700">按硬约束换硬件（设备）</text>
      <text x="382" y="130" fill="#475569" fontSize="10.5">防拖影→全局快门；近距对焦→可对焦 / 可换镜头</text>

      <line x1="169" y1="140" x2="280" y2="172" stroke="#64748b" strokeWidth="2" markerEnd="url(#at-arrow)" />
      <line x1="511" y1="140" x2="400" y2="172" stroke="#64748b" strokeWidth="2" markerEnd="url(#at-arrow)" />

      <rect x="230" y="172" width="220" height="40" rx="10" fill="#d1fae5" stroke="#6ee7b7" />
      <text x="340" y="197" textAnchor="middle" fill="#0f8a5f" fontSize="12" fontWeight="700">验证通过：分辨率 / 帧率达标</text>
    </svg>
  </div>
);

/* ---- 参数速查卡：把六个维度写成可背的短句 ---- */
const ParamCards = () => (
  <div className="grid gap-3 md:grid-cols-3">
    {[
      { k: "焦距", v: "短 = 广角（近大）；长 = 长焦（远小）", tone: "text-warn2 bg-amber-50" },
      { k: "分辨率", v: "看像素数，也看单像素大小（低照度）", tone: "text-warn2 bg-amber-50" },
      { k: "帧率", v: "看画面 25fps 够；闭环要低延迟", tone: "text-warn2 bg-amber-50" },
      { k: "接口", v: "USB2 只能 MJPG；USB3 / CSI 可未压缩", tone: "text-brand-700 bg-brand-50" },
      { k: "快门", v: "卷帘有果冻效应；高速运动用全局快门", tone: "text-brand-700 bg-brand-50" },
      { k: "对焦", v: "定焦 / 手动（M12·C 口）/ 自动对焦", tone: "text-brand-700 bg-brand-50" },
    ].map((c) => (
      <div key={c.k} className="surface p-3.5 md:p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className={`grid h-6 w-6 place-items-center rounded-md text-[0.7rem] font-extrabold ${c.tone}`}>
            {c.k.slice(0, 1)}
          </span>
          <span className="text-[0.96rem] font-bold text-ink">{c.k}</span>
        </div>
        <p className="text-[0.86rem] leading-relaxed text-slateink">{c.v}</p>
      </div>
    ))}
  </div>
);

/* ---- 记忆锚三卡（口诀 / 生活化类比 / 颜色编码） ---- */
const AnchorCards = () => (
  <div className="grid gap-3 md:grid-cols-3">
    <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-brand-700">口 诀</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">近大远小、长短广窄</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        焦距短 → 视野广；焦距长 → 视野窄。选镜头先背这一句。
      </p>
    </div>
    <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-warn2">生活化类比</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">广角＝站在门口拍全屋</p>
      <p className="mt-1.5 text-[1rem] font-extrabold leading-snug text-ink">长焦＝用望远镜看一扇窗</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        同一位置，广角装得下全屋但东西小；长焦只看一扇窗却放得很大。
      </p>
    </div>
    <div className="surface border-t-4 border-t-good p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-good">颜色编码</div>
      <div className="space-y-1.5 text-[0.9rem] font-semibold text-ink">
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-brand-600" />
          蓝＝设备 / 硬件
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-warn2" />
          橙＝软件 / 参数
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-good" />
          绿＝验证通过
        </p>
      </div>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        全册一致：看到颜色就知道这一步在动硬件还是调参数。
      </p>
    </div>
  </div>
);

/* 瓶颈分解：内联 SVG（离线单文件，不用 ASCII / 线框图） */
const Bottleneck = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 150"
      role="img"
      aria-label="决定画质与帧率的四个因素是传感器、镜头对焦、快门类型与接口带宽，UVC 协议不是瓶颈"
      className="h-auto w-full"
    >
      <text x="8" y="18" fill="#475569" fontSize="12" fontWeight="700">真正决定画质与帧率的四个因素</text>

      <rect x="8" y="30" width="155" height="70" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="86" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">传感器</text>
      <text x="86" y="78" textAnchor="middle" fill="#475569" fontSize="10">分辨率 · 单像素尺寸</text>

      <rect x="177" y="30" width="155" height="70" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="254" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">镜头</text>
      <text x="254" y="78" textAnchor="middle" fill="#475569" fontSize="10">定焦 / 手动 / 自动对焦</text>

      <rect x="346" y="30" width="155" height="70" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="424" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">快门类型</text>
      <text x="424" y="78" textAnchor="middle" fill="#475569" fontSize="10">卷帘 / 全局</text>

      <rect x="515" y="30" width="155" height="70" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="592" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">接口带宽</text>
      <text x="592" y="78" textAnchor="middle" fill="#475569" fontSize="10">USB2 / USB3 / CSI</text>

      <rect x="8" y="114" width="662" height="28" rx="8" fill="#f1f5f9" stroke="#cbd5e1" />
      <text x="20" y="133" fill="#94a3b8" fontSize="11">
        UVC 只是协议标准（所有 USB 摄像头都用）——不是瓶颈，换协议本身没有提升
      </text>
    </svg>
  </div>
);

/* 两条采集链路：内联 SVG */
const LinkPaths = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 292"
      role="img"
      aria-label="USB UVC 与 CSI 两条采集链路对比"
      className="h-auto w-full"
    >
      <defs>
        <marker id="cam-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="csi-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
      </defs>

      <text x="8" y="16" fill="#0f766e" fontSize="12" fontWeight="700">UVC · USB 免驱，即插即用</text>
      <rect x="8" y="26" width="140" height="52" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="78" y="48" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">USB 摄像头</text>
      <text x="78" y="65" textAnchor="middle" fill="#475569" fontSize="10">HD camera 349c:2317</text>
      <rect x="188" y="26" width="120" height="52" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="248" y="48" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">USB 2.0</text>
      <text x="248" y="65" textAnchor="middle" fill="#475569" fontSize="10">480 Mbps · 需 MJPG</text>
      <rect x="348" y="26" width="140" height="52" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="418" y="48" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">/dev/video0</text>
      <text x="418" y="65" textAnchor="middle" fill="#475569" fontSize="10">uvcvideo 驱动</text>
      <rect x="528" y="26" width="144" height="52" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="600" y="48" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">OpenCV</text>
      <text x="600" y="65" textAnchor="middle" fill="#475569" fontSize="10">CAP_V4L2</text>
      <line x1="148" y1="52" x2="184" y2="52" stroke="#0d9488" strokeWidth="2" markerEnd="url(#cam-arrow)" />
      <line x1="308" y1="52" x2="344" y2="52" stroke="#0d9488" strokeWidth="2" markerEnd="url(#cam-arrow)" />
      <line x1="488" y1="52" x2="524" y2="52" stroke="#0d9488" strokeWidth="2" markerEnd="url(#cam-arrow)" />

      <text x="8" y="120" fill="#1a5cae" fontSize="12" fontWeight="700">CSI · MIPI 排线，硬件 ISP 低延迟</text>
      <rect x="8" y="130" width="140" height="52" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="78" y="152" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">CSI 摄像头模组</text>
      <text x="78" y="169" textAnchor="middle" fill="#475569" fontSize="10">IMX708 等官方模组</text>
      <rect x="188" y="130" width="120" height="52" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="248" y="152" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">MIPI 排线</text>
      <text x="248" y="169" textAnchor="middle" fill="#475569" fontSize="10">非 /dev/video0</text>
      <rect x="348" y="130" width="140" height="52" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="418" y="152" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">libcamera + ISP</text>
      <text x="418" y="169" textAnchor="middle" fill="#475569" fontSize="10">硬件图像处理</text>
      <rect x="528" y="130" width="144" height="52" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="600" y="152" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">picamera2</text>
      <text x="600" y="169" textAnchor="middle" fill="#475569" fontSize="10">再转 OpenCV</text>
      <line x1="148" y1="156" x2="184" y2="156" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#csi-arrow)" />
      <line x1="308" y1="156" x2="344" y2="156" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#csi-arrow)" />
      <line x1="488" y1="156" x2="524" y2="156" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#csi-arrow)" />

      <rect x="8" y="218" width="664" height="56" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray="4 4" />
      <text x="24" y="242" fill="#0f172a" fontSize="12" fontWeight="700">GMSL / 工业接口（同轴）</text>
      <text x="24" y="261" fill="#475569" fontSize="10">
        专用驱动 + 采集卡：长线抗干扰、多路同步；贵，竞赛场景过剩
      </text>
    </svg>
  </div>
);

/* 对比决策：方案 A / B 的判定路径（内联 SVG） */
const Decision = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 250"
      role="img"
      aria-label="方案 A 与方案 B 的对比：遇到问题直接换摄像头，还是先固定距离补光调参再按硬需求升级"
      className="h-auto w-full"
    >
      <defs>
        <marker id="dec-arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b91c1c" />
        </marker>
        <marker id="dec-arrow-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="250" y="8" width="180" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="340" y="30" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">症状：看不清 / 拖影</text>
      <text x="340" y="47" textAnchor="middle" fill="#475569" fontSize="10">/ 帧率不够</text>

      <line x1="320" y1="58" x2="152" y2="98" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#dec-arrow-red)" />
      <line x1="360" y1="58" x2="528" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dec-arrow-teal)" />

      <rect x="16" y="100" width="260" height="118" rx="10" fill="#fef2f2" stroke="#fecaca" />
      <text x="32" y="126" fill="#0f172a" fontSize="12" fontWeight="700">方案 A · 直觉做法</text>
      <text x="32" y="150" fill="#475569" fontSize="10">一遇「看不清 / 拖影」就换摄像头</text>
      <text x="32" y="170" fill="#475569" fontSize="10">常买错方向（传感器 / 镜头不对）</text>
      <text x="32" y="194" fill="#9a3412" fontSize="10" fontWeight="700">结果：钱花了，仍看不清</text>

      <rect x="404" y="100" width="260" height="118" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="420" y="126" fill="#0f172a" fontSize="12" fontWeight="700">方案 B · 推荐做法</text>
      <text x="420" y="150" fill="#475569" fontSize="10">先固定距离 + 补光 + 调参</text>
      <text x="420" y="170" fill="#475569" fontSize="10">确需升级时按硬需求二选一</text>
      <text x="420" y="194" fill="#0f766e" fontSize="10" fontWeight="700">结果：零成本先见效，升级不盲目</text>

      <text x="16" y="240" fill="#94a3b8" fontSize="10">
        判定关键：能否用软件（补光 / 距离 / 参数）补偿——能则先调参，不能才轮到换硬件。
      </text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      硬件讲解 · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      摄像头参数与选型
      <br />
      <span className="text-brand-600">从 UVC 协议到具体型号</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      先把当前摄像头的真实能力查清，再判断「换 UVC 摄像头」到底有没有必要。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整命令与全量参数表。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="别为「协议」换摄像头：瓶颈在传感器、镜头与带宽"
    lead="当前这颗已经是标准 UVC 摄像头（UVC，USB Video Class）。真正决定清晰度与帧率的是传感器、镜头、快门与接口带宽，UVC 只是所有 USB 摄像头都用的协议标准。"
  >
    <Grid cols={2}>
      <Card title="当前就是标准 UVC" icon={ShieldCheck} tone="good">
        驱动 <code>uvcvideo</code>；<code>dmesg</code> 输出 Found UVC 1.00 device HD camera（349c:2317），挂在 USB 2.0 总线上。
      </Card>
      <Card title="UVC 是协议标准，不是画质档次" icon={Layers}>
        普通 USB 摄像头都走 UVC；「换个 UVC 摄像头」不会带来提升，要换的是传感器 / 镜头 / 接口。
      </Card>
    </Grid>
    <div className="mt-4">
      <Bottleneck />
    </div>
  </Frame>
);

const Device = () => (
  <Frame
    kicker="现状"
    floor="02"
    title="当前就是一颗标准 UVC 摄像头（349c:2317）"
    lead="这是 USB 摄像头（非 CSI，Camera Serial Interface）；rpicam / libcamera 看不到，只能用 V4L2（Video4Linux2）访问。"
    wide
  >
    <DataTable
      head={["项", "值"]}
      rows={[
        ["名称", "HD camera（Generic）· 设备 usb-xhci-hcd.0-1"],
        ["USB ID", "349c:2317"],
        ["协议", "UVC 1.00（uvcvideo 驱动，非 CSI）"],
        ["总线", "USB 2.0（480 Mbps）"],
        ["采集节点", "/dev/video0（另有 /dev/video1、/dev/media3）"],
        ["采集方式", "V4L2 · OpenCV CAP_V4L2（MJPG）"],
        ["分辨率上限", "1280×960 MJPG；YUYV 仅 640×480"],
        ["帧率上限", "25 fps"],
        ["对焦", "定焦（无 focus_* 控件，无法软件对焦）"],
        ["快门", "卷帘（普通 webcam）"],
        ["权限", "video 组（账号 nanzhida 已加入）"],
        ["已知日志", "Failed to resubmit video URB (-1)（偶发流中断可能与此有关）"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：用 v4l2-ctl 自己查参数（完整命令）">
        <Pre>{`# 装工具（首次）
sudo apt-get install -y v4l-utils

# 列出设备与驱动
v4l2-ctl --list-devices
dmesg | grep -i uvc          # 例：Found UVC 1.00 device HD camera

# 支持的分辨率 / 帧率
v4l2-ctl -d /dev/video0 --list-formats-ext

# 当前格式
v4l2-ctl -d /dev/video0 --get-fmt-video

# 所有可调控件及范围
v4l2-ctl -d /dev/video0 --list-ctrls`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Formats = () => (
  <Frame
    kicker="现状"
    floor="03"
    title="只有 25 fps 一档，MJPG 才撑得起高分辨率"
    lead="硬件把帧率固定为 25 / 5 两档；高分辨率必须用压缩的 MJPG，未压缩的 YUYV 只能到 640×480。"
    wide
  >
    <DataTable
      head={["格式", "最高分辨率", "帧率档位", "说明"]}
      rows={[
        ["MJPG（Motion JPEG，压缩）", "1280×960", "25 / 5", "高分辨率必需；单帧约 193–215 KB"],
        ["YUYV（未压缩）", "640×480", "25 / 5", "仅低分辨率；带宽吃满"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：全部支持的分辨率（MJPG 9 种 / YUYV 4 种）">
        <DataTable
          head={["MJPG 分辨率", "帧率档位"]}
          rows={[
            ["1280×960", "25 / 5"],
            ["1280×720", "25 / 5"],
            ["1280×640", "25 / 5"],
            ["1280×480", "25 / 5"],
            ["1024×576", "25 / 5"],
            ["640×480", "25 / 5"],
            ["640×360", "25 / 5"],
            ["320×480", "25 / 5"],
            ["320×240", "25 / 5"],
          ]}
        />
        <DataTable
          head={["YUYV 分辨率", "帧率档位"]}
          rows={[
            ["640×480", "25 / 5"],
            ["352×288", "25 / 5"],
            ["320×240", "25 / 5"],
            ["176×144", "25 / 5"],
          ]}
        />
      </Steps>
    </div>
  </Frame>
);

const Controls = () => (
  <Frame
    kicker="现状"
    floor="04"
    title="控件是驱动持久状态，改一次会一直保留"
    wide
  >
    <DataTable
      head={["控件", "范围", "默认", "说明"]}
      rows={[
        ["brightness 亮度", "0–255", "138", ""],
        ["contrast 对比度", "0–255", "128", ""],
        ["saturation 饱和度", "0–255", "80", ""],
        ["hue 色调", "0–255", "128", ""],
        ["gamma 伽马", "0–255", "0", ""],
        ["gain 增益", "0–255", "136", ""],
        ["sharpness 锐度", "0–63", "63", "默认已最大"],
        ["backlight_compensation 背光补偿", "0–255", "136", ""],
        ["white_balance_automatic 自动白平衡", "0/1", "1", ""],
        ["white_balance_temperature 白平衡色温", "0–255", "64", "自动时 inactive"],
        ["power_line_frequency 工频抗闪烁", "0–2", "0", "Disabled"],
      ]}
    />
    <div className="mt-4 space-y-3">
      <Quote>这些控件是驱动持久状态：改一次会一直保留（除非重启 / 重新设置），不是脚本默认值。</Quote>
      <Steps title="展开：查看与设置控件的完整命令">
        <Pre>{`# 设置亮度 / 对比度 / 饱和度
v4l2-ctl -d /dev/video0 -c brightness=160 -c contrast=140

# 设分辨率与像素格式（MJPG）
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1280,height=960,pixelformat=MJPG

# 抓一帧存盘
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=1 --stream-to=frame.jpg

# OpenCV 里同样可设（cap.set）
# cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
# cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 960)`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Protocols = () => (
  <Frame
    kicker="选型"
    floor="06"
    title="免驱通用选 UVC；要低延迟就上 CSI 或 USB3"
    lead="三条路线各有取舍：UVC 走 USB 免驱，CSI 走排线拿硬件 ISP，工业接口长线但贵。"
    wide
  >
    <div className="space-y-4">
      <LinkPaths />
      <DataTable
        head={["协议", "走线", "在 Pi 上的访问", "优点", "缺点"]}
        rows={[
          [
            "UVC（USB Video Class）",
            "USB",
            "/dev/video0 + OpenCV CAP_V4L2（免驱）",
            "即插即用、跨平台、控制项标准、可换任意 USB 摄像头",
            "受 USB 带宽限制（USB2 需 MJPG，有延迟）；镜头 / 传感器参差",
          ],
          [
            "CSI + libcamera（MIPI）",
            "排线",
            "picamera2 / libcamera（非 /dev/video0）",
            "硬件图像信号处理器（ISP）、低延迟、官方传感器质量稳定",
            "OpenCV 需经 picamera2 转换或 GStreamer libcamerasrc；只有官方 / 兼容模组",
          ],
          [
            "GMSL / 工业接口",
            "同轴",
            "专用驱动 + 采集卡",
            "长线、抗干扰、多路同步",
            "贵、需采集卡，竞赛场景过剩",
          ],
        ]}
      />
      <Quote>
        注：厂商常说的「UVC 3.0」不是官方标准版本号，通常指 USB 3.0 的 UVC 摄像头；UVC 官方版本为 1.0 / 1.1 / 1.5。
      </Quote>
    </div>
  </Frame>
);

const Dimensions = () => (
  <Frame
    kicker="选型"
    floor="07"
    title="六个维度速查：先定场景硬需求，再对号入座挑型号"
  >
    <ParamCards />
    <div className="mt-6">
      <Quote>先把场景能接受的边界写下来——工作距离、运动速度、光照、预算，再逐条对到型号。</Quote>
    </div>
  </Frame>
);

const DecisionBlock = () => (
  <Frame
    kicker="选型"
    floor="10"
    title="先榨干现有这颗，确需升级再按硬需求换"
    wide
  >
    <div className="space-y-4">
      <Decision />
      <Grid cols={2}>
        <Card title="方案 A · 直觉做法" icon={AlertTriangle} tone="warn">
          一遇「看不清 / 拖影」就换摄像头——常见是「换个更好的 UVC」或直接买更贵的型号。
        </Card>
        <Card title="方案 B · 推荐做法" icon={ShieldCheck} tone="good">
          先固定工作距离 + 补光 + 调参；确需升级时按硬需求二选一：防拖影→全局快门，近距对焦→可对焦 / 可换镜头。
        </Card>
      </Grid>
      <DataTable
        head={["维度", "方案 A：一遇问题就换摄像头", "方案 B：先榨干现有，再按硬需求换"]}
        rows={[
          ["成本", "一次性百元级起，可能多次试错", "几乎为零（补光 / 固定距离）"],
          ["见效耗时", "采购 + 等货 + 重新适配", "当场可调，分钟级"],
          ["维护难度", "换型即改驱动 / 分辨率适配", "不改链路，只调参数"],
          ["主要风险", "买错方向（传感器 / 镜头不对）仍看不清", "硬件确为瓶颈时仍需升级（不误判即可）"],
        ]}
      />
      <Quote>
        辩证一问：「什么情况下方案 A 反而更好？」——当运动模糊或近距对焦是无法软件补偿的硬约束（现有传感器分辨率确实不够、工作距离必须变化），且预算与时间允许时，直接换对的硬件比反复调参更省事。
      </Quote>
    </div>
  </Frame>
);

const Models = () => (
  <Frame
    kicker="选型"
    floor="11"
    title="确需升级：防拖影选全局快门，拍清小字选可对焦"
    wide
  >
    <DataTable
      head={["方向", "型号 / 传感器", "备注"]}
      rows={[
        ["全局快门", "IMX296 B0499 · AR0234 B0495 · OV9281 B0332 · OV9782 B0385", "防运动拖影，工业常用"],
        ["自动对焦（AF）", "5MP B0441 · IMX179 B0447 · IMX219 B0292 · IMX298 B0290", "近距 / 变距拍摄"],
        ["低照度", "IMX462 B0496 · IMX291 B0200 · IMX708 B0305", "弱光环境"],
        ["高分辨率 / 可换镜头", "IMX477 B0459 · IMX519 B0471 · IMX708 B0474", "可换镜头 / 电动对焦"],
        ["官方 CSI（非 UVC）", "Camera Module 3（IMX708 12MP AF）· GS Camera（IMX296）", "用 picamera2"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：Arducam USB UVC 全量型号（含 SKU）">
        <DataTable
          head={["SKU", "传感器", "分辨率", "镜头 / 对焦", "备注"]}
          rows={[
            ["B0499", "IMX296", "1.58MP", "CS 口 / 手动", "彩色全局快门，工业常用"],
            ["B0495", "AR0234", "2.3MP", "M12 / 手动", "彩色全局快门"],
            ["B0332", "OV9281", "1MP", "M12 / 手动", "黑白，120fps"],
            ["B0322", "OV2311", "2MP", "M12 / 手动", "黑白，50fps"],
            ["B0385", "OV9782", "1MP", "M12 / 手动", "彩色，120fps"],
          ]}
        />
        <DataTable
          head={["SKU", "传感器", "分辨率", "备注"]}
          rows={[
            ["B0441", "—", "5MP", "小型 AF，带麦"],
            ["B0447", "IMX179", "8MP", "AF"],
            ["B0292", "IMX219", "8MP", "AF"],
            ["B0290", "IMX298", "16MP", "高分辨率 AF"],
            ["B0485", "IMX258", "13MP", "OIS + 电动对焦（USB3）"],
          ]}
        />
        <DataTable
          head={["SKU", "传感器", "分辨率", "备注"]}
          rows={[
            ["B0200 / B0202", "IMX291", "2MP", "低照度 WDR；B0202 为 160° 鱼眼"],
            ["B0468", "IMX323", "2MP", "低照度、低畸变"],
            ["B0496", "IMX462", "2MP", "星光级低照度，M12"],
            ["B0305", "IMX708", "12MP", "低照度广角定焦"],
          ]}
        />
        <DataTable
          head={["SKU", "传感器", "分辨率", "镜头 / 对焦"]}
          rows={[
            ["B0459", "IMX477", "12MP", "M12 / 手动"],
            ["B0288", "IMX477", "12MP", "C 口变焦 2.8–12mm 套装"],
            ["B0497", "IMX678", "8.3MP", "M12 / 手动"],
            ["B0498", "IMX585", "8.3MP", "C 口 / 手动"],
            ["B0477", "IMX283", "20MP", "C 口 / 手动"],
            ["B0471 / B0514", "IMX519", "16MP", "电动对焦（USB3）"],
            ["B0474", "IMX708", "12MP", "电动对焦（USB3）"],
            ["B0478", "IMX586", "48MP", "电动对焦（USB3）"],
            ["B0494", "—", "108MP", "电动对焦（USB3）"],
          ]}
        />
        <DataTable
          head={["模组", "传感器", "分辨率", "特点"]}
          rows={[
            ["Camera Module 3", "IMX708", "12MP", "自动对焦、HDR、低照度好；滚动快门"],
            ["Global Shutter Camera", "IMX296", "1.6MP", "全局快门，适合运动"],
          ]}
        />
      </Steps>
    </div>
  </Frame>
);

const Scenarios = () => (
  <Frame
    kicker="选型"
    floor="12"
    title="按赛项场景对号入座，别买错方向"
  >
    <Grid cols={2}>
      <Card title="智能分拣 / 读码" icon={Lightbulb}>
        工作距离固定 → 定焦即可，优先分辨率 + 光源；拍清小字选可换镜头（M12/C 口）或 AF。
      </Card>
      <Card title="智能搬运 / 移动" icon={Route}>
        有相对运动 → 优先全局快门（IMX296 / OV9782），避免拖影。
      </Card>
      <Card title="智能救援 / 弱光" icon={Zap}>
        优先大像素低照度传感器（IMX462 / IMX291 / IMX708）。
      </Card>
      <Card title="低延迟闭环" icon={Gauge}>
        USB3 的 UVC（YUY2 无压缩）或官方 CSI + picamera2。
      </Card>
      <Card title="预算优先且要免驱" icon={ShieldCheck} tone="good">
        任意标准 UVC（现在这颗就是），把精力放在光照 + 固定对焦距离，往往比换硬件提升更明显。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：给当前项目的具体建议（4 条）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>协议不变（继续 UVC/V4L2 + OpenCV），不需要为「协议」换摄像头。</li>
          <li>继续用现在这颗：锁定固定工作距离 + 补光，能解决大部分「看不清」。</li>
          <li>
            若要升级，按需求二选一：防运动模糊 → 全局快门 UVC（IMX296 / OV9281 / AR0234）；
            拍清小字 / 近距对焦 → 电动对焦或 M12 可换镜头（IMX477 / IMX519 / IMX708）。
          </li>
          <li>USB3 摄像头可让 Pi 5 走 USB3 口 + 未压缩格式，延迟更低（现在 USB2 只能 MJPG）。</li>
        </ol>
        <p className="text-muted">
          以上为 Arducam 官方页面示例；购买前请以商品页的接口（USB2/3）、UVC 版本、供电与线材长度为准。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Performance = () => (
  <Frame
    kicker="落地"
    floor="13"
    title="1280×960 掉到约 20 fps，带宽根本不是瓶颈"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["分辨率", "单帧大小", "实测帧率"]}
        rows={[
          ["640×480", "~64 KB", "25–27"],
          ["1280×960", "~193–215 KB", "19–24"],
        ]}
      />
      <Grid cols={2}>
        <Card title="JPEG 质量已到上限" icon={Activity}>
          上限 100；90→100 肉眼提升很小、体积翻倍，1280×960 下会掉帧（约 25→20）。
        </Card>
        <Card title="定焦镜头是硬伤" icon={Focus} tone="warn">
          近距离小字发虚无法软件解决，需拉开到对焦距离，或换自动对焦 / 更高分辨率摄像头。
        </Card>
      </Grid>
      <Quote>带宽不是瓶颈：1280×960 × 质量 100 ≈ 5 MB/s，远低于 1 Gbps。</Quote>
      <Steps title="展开：软件默认参数与能力上限（实测）">
        <DataTable
          head={["cam_server.py（Pi 端）", "默认", "备注"]}
          rows={[
            ["--device", "0", "/dev/video0"],
            ["--width / --height", "640 / 480", "最高可到 1280×960"],
            ["--fps", "30", "硬件实际封顶 25"],
            ["--quality", "100", "JPEG 质量，已到上限"],
            ["--port", "5000", ""],
            ["--bind", "172.26.188.116", "新 Pi eth0 静态地址"],
          ]}
        />
        <DataTable
          head={["cam_view.py（本机）", "默认"]}
          rows={[
            ["--host", "172.26.188.116"],
            ["--port", "5000"],
            ["--frames", "0（不停止）"],
            ["--check", "关闭"],
          ]}
        />
        <Pre>{`分辨率上限 1280×960（MJPG）；YUYV 最高只有 640×480
帧率上限   25 fps（所有分辨率，硬件固定档位 25/5）
JPEG 质量  上限 100；90→100 肉眼提升很小、体积翻倍，1280×960 下会掉帧（约 25→20）
带宽       不是瓶颈：1280×960×质量100 ≈ 5 MB/s，远低于 1 Gbps
定焦镜头   近距离小字发虚无法软件解决，需拉开到对焦距离或换自动对焦/高分辨率
控件状态   属驱动持久状态，改一次会保留（除非重启/重新设置），不是脚本默认值`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* ---- 现状 · 参数-效果对应（点式动画 ②） ---- */
const ParamEffect = () => (
  <Frame
    kicker="现状"
    floor="05"
    title="动一个参数，画面就变一个样"
    lead="分辨率和质量是「甜蜜的负担」：调高更清楚，但体积与掉帧跟着来；补光和距离才是定焦镜头的解药。"
    wide
  >
    <PointSteps
      hint="点节点可跳到该步；默认全亮＝静态兜底。"
      steps={[
        { side: "param", t: "分辨率 1280×960", s: "细节更清楚，但单帧从约 64 KB 涨到约 200 KB，帧率由 25 掉到约 20。" },
        { side: "param", t: "JPEG 质量 100", s: "已到上限：90→100 肉眼提升很小、体积翻倍，还会继续掉帧。" },
        { side: "param", t: "补光 + 固定工作距离", s: "定焦镜头也能对上焦，弱光噪点变少——零成本先见效。" },
        { side: "board", t: "换硬件（最后一步）", s: "只有软件补偿不了时：防拖影→全局快门；近距对焦→可对焦 / 可换镜头。" },
        { side: "good", t: "验证通过", s: "抓一帧看清晰度、实测帧率达标，才算真的解决。" },
      ]}
    />
  </Frame>
);

/* ---- 选型 · 选型决策流程（点式动画 ①） ---- */
const DecisionFlowPage = () => (
  <Frame
    kicker="选型"
    floor="08"
    title="选型是一条流水线：需求 → 焦距/分辨率/帧率/接口 → 选定型号"
    lead="按顺序点亮，一步只看一件事：先写清场景需求，再逐项对参数，最后才落到型号。"
    wide
  >
    <div className="space-y-4">
      <DecisionFlow />
      <Quote>顺序不能跳：先写清场景硬需求（距离、运动、光照、预算），再逐项对焦距、分辨率、帧率与接口，最后才落到具体型号。</Quote>
    </div>
  </Frame>
);

/* ---- 选型 · 焦距-视野理解图 + 记忆锚（口诀 / 类比 / 颜色编码） ---- */
const FocalPage = () => (
  <Frame
    kicker="选型"
    floor="09"
    title="先懂焦距：近大远小、长短广窄"
    wide
  >
    <div className="space-y-4">
      <FocalFov />
      <AnchorCards />
      <p className="text-[0.82rem] leading-relaxed text-muted">
        配套动画：本机 ManimGX《同一距离：焦距决定视野》在同一距离上改变焦距，画面广度随之变化；上面这张内联 SVG 是它的静态版，离线也能看。
      </p>
    </div>
  </Frame>
);

/* ---- 落地 · 换机核对流程（点式动画 ③） ---- */
const CHECK = [
  { side: "board", t: "确认采集节点", s: "v4l2-ctl --list-devices，采集节点应为 /dev/video0。" },
  { side: "board", t: "确认协议与速度", s: "dmesg | grep -i uvc，看 UVC 版本与 USB 速度（USB2 / USB3）。" },
  { side: "board", t: "核对分辨率 / 帧率", s: "v4l2-ctl -d /dev/video0 --list-formats-ext 是否符合需求。" },
  { side: "param", t: "判断定焦还是自动对焦", s: "--list-ctrls 看有没有 focus_*。" },
  { side: "param", t: "抓一帧看清晰度", s: "--stream-mmap --stream-count=1 --stream-to=frame.jpg。" },
  { side: "good", t: "起脚本实测", s: "cam_server.py --width 1280 --height 960；本机 cam_view.py --check --frames 30。" },
  { side: "good", t: "确认权限", s: "groups 输出应含 video。" },
];

const Checklist = () => (
  <Frame
    kicker="落地"
    floor="14"
    title="换机 / 到货后，按这个顺序逐项核对"
    wide
  >
    <div className="space-y-4">
      <PointSteps hint="默认全亮＝静态兜底；播放时逐项点亮，灯走到哪核到哪。" steps={CHECK} />
      <Quote>验收点：分辨率 / 帧率达标，且对焦能满足实际工作距离。</Quote>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame
    kicker="收尾"
    floor="15"
    title="参数表与选型参考，随 deck 下载"
    wide
  >
    <Grid cols={2}>
      <Card title="随 deck 分发的文档" icon={Download}>
        <p>
          <a className="font-semibold text-brand-700 underline" href="./files/摄像头参数.md">
            files/摄像头参数.md
          </a>
          {" ｜ "}
          <a className="font-semibold text-brand-700 underline" href="./files/摄像头选型.md">
            files/摄像头选型.md
          </a>
        </p>
        <p className="mt-2 text-muted">
          含可调控件默认值、软件默认参数、实测性能、能力上限与全量型号（含 SKU）。
        </p>
      </Card>
      <Card title="工作区内的位置" icon={FolderTree}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>文字版：<code>docs/摄像头参数.md</code>、<code>docs/摄像头选型.md</code></li>
          <li>采集脚本：<code>教学demo/摄像头远程显示/</code></li>
          <li>原理与硬件：<code>docs/设计原理流程图.md</code>、<code>docs/摄像头参数.md</code></li>
        </ul>
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        本 deck 可直接双击播放；相邻主题：<code>摄像头远程显示</code>（采集 / 传输 / 显示解耦）、
        <code>树莓派连接与部署</code>（部署前提）。
      </Card>
      <Card title="下一批同类主题" icon={Cpu}>
        选型落地后，把精力放在光照 + 固定对焦距离；需要运动/闭环时再按本 deck 的对比决策换硬件。
      </Card>
    </Grid>
  </Frame>
);

const Action = () => (
  <Frame
    kicker="收尾"
    floor="16"
    title="照这份清单做，先别急着换"
    wide
  >
    <div className="space-y-5">
      <Quote>别为「协议」换摄像头：先用固定工作距离 + 补光榨干现有这颗。</Quote>
      <ActionTree />
      <Grid cols={3}>
        <Card title="现有榨干" icon={Wrench} tone="good">
          锁死距离、加光源、对好参数，解决大部分「看不清」。
        </Card>
        <Card title="要防拖影" icon={Zap}>
          换全局快门 UVC（IMX296 / OV9281 / AR0234）。
        </Card>
        <Card title="要拍清小字" icon={Eye}>
          换可对焦 / 可换镜头的高分辨率型号（IMX477 / IMX519 / IMX708）。
        </Card>
      </Grid>
      <Steps title="展开：能力上限与取舍（实测）">
        <Pre>{`分辨率上限 1280×960（MJPG）；YUYV 最高只有 640×480
帧率上限   25 fps（所有分辨率，硬件固定档位 25/5）
JPEG 质量  上限 100；90→100 肉眼提升很小、体积翻倍，1280×960 下会掉帧（约 25→20）
带宽       不是瓶颈：1280×960×质量100 ≈ 5 MB/s，远低于 1 Gbps
定焦镜头   近距离小字发虚无法软件解决，需拉开到对焦距离或换自动对焦/高分辨率
控件状态   属驱动持久状态，改一次会保留（除非重启/重新设置），不是脚本默认值

完整参数表随 deck 下载「摄像头参数.md」（含可调控件默认值、软件默认参数与实测性能）。`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Target}>
        下载：
        <a className="font-semibold text-brand-700 underline" href="./files/摄像头参数.md">
          摄像头参数.md
        </a>
        {" ｜ "}
        <a className="font-semibold text-brand-700 underline" href="./files/摄像头选型.md">
          摄像头选型.md
        </a>
        ；文字版见 <code>docs/摄像头参数.md</code>、<code>docs/摄像头选型.md</code>。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "当前摄像头", group: "现状", el: <Device /> },
  { nav: "分辨率与帧率", group: "现状", el: <Formats /> },
  { nav: "可调控件", group: "现状", el: <Controls /> },
  { nav: "参数-效果", group: "现状", el: <ParamEffect /> },
  { nav: "协议对比", group: "选型", el: <Protocols /> },
  { nav: "选型六维度", group: "选型", el: <Dimensions /> },
  { nav: "焦距与视野", group: "选型", el: <FocalPage /> },
  { nav: "选型流程", group: "选型", el: <DecisionFlowPage /> },
  { nav: "对比决策", group: "选型", el: <DecisionBlock /> },
  { nav: "型号参考", group: "选型", el: <Models /> },
  { nav: "场景建议", group: "选型", el: <Scenarios /> },
  { nav: "实测与取舍", group: "落地", el: <Performance /> },
  { nav: "核对清单", group: "落地", el: <Checklist /> },
  { nav: "下载与材料", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
