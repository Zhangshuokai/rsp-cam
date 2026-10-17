import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Cpu as Micro,
  Server,
  Network,
  Terminal,
  Download,
  AlertTriangle,
  ShieldCheck,
  ListChecks,
  Rocket,
  Boxes,
  Layers,
  Gauge,
  Wifi,
  CheckCircle2,
  BookOpen,
  Cable,
  FolderTree,
  Target,
  CircuitBoard,
  ArrowLeftRight,
  Play,
  RotateCcw,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Stat, Steps, Pre } from "./components.jsx";

const Code = ({ children }) => (
  <div className="surface overflow-x-auto p-4 font-mono text-[0.78rem] leading-relaxed text-ink md:text-[0.82rem]">
    {children}
  </div>
);

/* ============================================================
   守则第七节 · 点式动画（全册 ≤3 处）
   纯前端：React state + setTimeout + CSS transition，无任何外链资源。
   默认全亮＝静态兜底（停帧 / 无 JS / 打印都完整可读）；播放时逐点 idle → active → done。
   颜色编码全册统一：蓝＝MCU / 硬件，橙＝传输 / 中间件，绿＝验证通过。
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

/* 颜色编码：同一含义固定同一颜色（全册一致） */
const SEQ_TONE = {
  device: {
    on: "border-brand-400 bg-brand-50 text-brand-700",
    active: "border-brand-600 bg-brand-600 text-white",
  },
  cmd: {
    on: "border-amber-400 bg-amber-50 text-warn2",
    active: "border-warn2 bg-warn2 text-white",
  },
  good: {
    on: "border-good bg-emerald-50 text-good",
    active: "border-good bg-good text-white",
  },
};
const IDLE_TONE = "border-line bg-paper text-muted";
const DONE_TONE = "border-good bg-good text-white";
const PING_BG = { device: "bg-brand-400/50", cmd: "bg-amber-400/50", good: "bg-emerald-400/50" };
const SEG_TONE = { device: "bg-brand-500", cmd: "bg-warn2", good: "bg-good" };
const segClass = (side, st) =>
  st === "done" ? "bg-good" : st === "idle" ? "bg-line" : SEG_TONE[side] || "bg-warn2";
const nodeTone = (side, st) =>
  st === "done" ? DONE_TONE : st === "idle" ? IDLE_TONE : (SEQ_TONE[side] || SEQ_TONE.cmd)[st];
const BAR_TONE = { brand: "bg-brand-500", warn: "bg-warn2", good: "bg-good" };

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
      蓝＝MCU / 硬件
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-warn2" />
      橙＝传输 / 中间件
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝验证通过
    </span>
  </div>
);

/* ---- 点式动画 ① 通信路径（横向）：MCU → 传输层 → Agent → ROS 2 图 ---- */
function PointFlow({ steps, legend = true, hint }) {
  const { statuses, play, reset, jump } = useSequence(steps.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {steps.map((s, i) => {
          const st = statuses[i];
          return (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => jump(i)}
                title={`跳到第 ${i + 1} 步`}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors duration-500 md:flex-col md:gap-2 md:py-3.5 md:text-center ${nodeTone(
                  s.side,
                  st
                )}`}
              >
                <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-current text-[0.9rem] font-bold md:h-10 md:w-10">
                  {st === "active" && (
                    <span className={`absolute inset-0 animate-ping rounded-full ${PING_BG[s.side] || "bg-brand-400/50"}`} />
                  )}
                  <span className="relative">{s.no}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-bold leading-tight md:text-[0.95rem]">{s.title}</span>
                  <span className="block text-[0.76rem] leading-tight opacity-80 md:text-[0.8rem]">{s.sub}</span>
                </span>
              </button>
              {i < steps.length - 1 && (
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
        <span className="text-[0.78rem] text-muted">
          {hint || "点节点可手动跳到该步；默认全亮＝静态兜底（关动画 / 打印照样完整）。"}
        </span>
      </div>
      {legend && (
        <div className="mt-2.5 border-t border-line pt-2.5">
          <ColorLegend />
        </div>
      )}
    </div>
  );
}

/* ---- 点式动画 ② 选型对比（横向三方案，逐方案点亮） ---- */
function PointCompare({ options, hint }) {
  const { statuses, play, reset, jump } = useSequence(options.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {options.map((o, i) => {
          const st = statuses[i];
          const on = st !== "idle";
          return (
            <button
              key={i}
              type="button"
              onClick={() => jump(i)}
              className={`rounded-xl border-2 p-4 text-left transition-colors duration-500 ${
                st === "active"
                  ? "border-warn2 bg-amber-50"
                  : st === "done"
                  ? "border-good bg-emerald-50"
                  : "border-line bg-paper"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[0.78rem] font-bold text-white transition-colors duration-500 ${
                    st === "active" ? "bg-warn2" : st === "done" ? "bg-good" : "bg-brand-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[0.92rem] font-bold leading-tight text-ink">{o.name}</span>
              </div>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{o.sub}</p>
              <div className="mt-3 space-y-2.5">
                {o.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-[0.74rem] text-muted">
                      <span>{m.label}</span>
                      <span className="font-semibold text-slateink">{m.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          st === "idle" ? "bg-line" : BAR_TONE[m.tone] || "bg-brand-500"
                        }`}
                        style={{ width: on ? `${m.pct}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlayBtn onClick={play}>播放点式动画</PlayBtn>
        <ResetBtn onClick={reset} />
        {hint && <span className="text-[0.78rem] text-muted">{hint}</span>}
      </div>
    </div>
  );
}

/* ---- 点式动画 ③ 纵向点式分步（当前步脉冲高亮、完成转绿） ---- */
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
              : s.side === "device"
              ? "bg-brand-600 text-white"
              : s.side === "good"
              ? "bg-good text-white"
              : "bg-warn2 text-white";
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
              <span className={`relative mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full text-[0.8rem] font-bold transition-colors duration-500 ${badge}`}>
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

/* ---- 记忆锚三卡（口诀 / 生活化类比 / 颜色编码），并在图示里重复出现 ---- */
const AnchorCards = () => (
  <div className="grid gap-3 md:grid-cols-3">
    <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-brand-700">口 诀</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">小车上 micro-ROS，大车上原生 ROS 2</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        按算力与内存选型：内存只有几十 KB 的单片机才上 micro-ROS；有 Linux 与数百 MB 内存的主机就直跑原生 ROS 2。两者不是二选一，是「本体 + 受限设备接入端」。
      </p>
    </div>
    <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-warn2">生活化类比</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">micro-ROS＝给单片机配个翻译官</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        MCU 只会说「方言」（rcl + rclc、静态内存）；Agent 就是常驻树莓派的「翻译官工作站」，把方言翻成 ROS 2 的「普通话」（DDS 话题）。单片机自己听不懂大城市的话，全靠翻译官转达。
      </p>
    </div>
    <div className="surface border-t-4 border-t-good p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-good">颜色编码</div>
      <div className="space-y-1.5 text-[0.9rem] font-semibold text-ink">
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-brand-600" />
          蓝＝MCU / 硬件
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-warn2" />
          橙＝传输 / 中间件
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-good" />
          绿＝验证通过
        </p>
      </div>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        全册一致：看颜色就知道这一步在动单片机 / 硬件、走传输与中间件，还是验证通过。
      </p>
    </div>
  </div>
);

/* 选型决策树：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） */
const SelectionDecision = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 340"
      role="img"
      aria-label="选型决策树：先看系统里有没有微控制器做实时底层——没有就只装 ROS 2；有就两边都装，树莓派装 ROS 2 加 micro-ROS Agent、MCU 装 micro-ROS client；只有树莓派且仅做取图或算法验证时，ROS 2 可用可不用"
      className="h-auto w-full"
    >
      <defs>
        <marker id="dd-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="dd-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="dd-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      <rect x="300" y="8" width="300" height="56" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="450" y="33" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">
        先问：系统里有 MCU 做实时底层吗？
      </text>
      <text x="450" y="52" textAnchor="middle" fill="#475569" fontSize="10">
        MCU = 微控制器（Microcontroller Unit）
      </text>

      <line x1="410" y1="64" x2="176" y2="146" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#dd-blue)" />
      <line x1="450" y1="64" x2="450" y2="146" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dd-teal)" />
      <line x1="490" y1="64" x2="724" y2="146" stroke="#b4690e" strokeWidth="2" markerEnd="url(#dd-amber)" />

      <rect x="16" y="150" width="272" height="150" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="32" y="176" fill="#0f172a" fontSize="12" fontWeight="700">没有 MCU，Pi 做视觉 / 主控</text>
      <text x="32" y="202" fill="#1a5cae" fontSize="11" fontWeight="700">→ 只装 ROS 2（本课方案）</text>
      <text x="32" y="226" fill="#475569" fontSize="10">Docker + ros:jazzy-ros-base</text>
      <text x="32" y="247" fill="#475569" fontSize="10">视觉、规划、决策都在 Pi</text>
      <text x="32" y="268" fill="#475569" fontSize="10">无需任何 MCU 侧组件</text>

      <rect x="314" y="150" width="272" height="150" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="330" y="176" fill="#0f172a" fontSize="12" fontWeight="700">有 MCU 做实时底层</text>
      <text x="330" y="202" fill="#0f766e" fontSize="11" fontWeight="700">→ 两边都要</text>
      <text x="330" y="226" fill="#475569" fontSize="10">Pi 装 ROS 2 + micro-ROS Agent</text>
      <text x="330" y="247" fill="#475569" fontSize="10">MCU（Pico / STM32 / ESP32）</text>
      <text x="330" y="268" fill="#475569" fontSize="10">装 micro-ROS client</text>

      <rect x="612" y="150" width="272" height="150" rx="12" fill="#fffbeb" stroke="#fbbf24" />
      <text x="628" y="176" fill="#0f172a" fontSize="12" fontWeight="700">只有 Pi，只做取图 / 算法验证</text>
      <text x="628" y="202" fill="#b4690e" fontSize="11" fontWeight="700">→ ROS 2 可用可不用</text>
      <text x="628" y="226" fill="#475569" fontSize="10">直接 Python / OpenCV 更省事</text>
      <text x="628" y="247" fill="#475569" fontSize="10">真要多节点通信时再上 ROS 2</text>
      <text x="628" y="268" fill="#475569" fontSize="10">不必为验证引入中间件</text>

      <text x="16" y="330" fill="#94a3b8" fontSize="10">
        判定关键：micro-ROS 只在有 MCU 时才出现；树莓派这一侧永远是 ROS 2。
      </text>
    </svg>
  </div>
);

/* 跨机验证拓扑：板端 micro-ROS ↔ Agent ↔ 主机 ROS 2（内联 SVG） */
const CrossTopology = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 372"
      role="img"
      aria-label="跨机验证拓扑：板端 ESP32-S3 跑 micro-ROS client，经 UDP 连到树莓派容器里的 micro-ROS Agent，Agent 再把设备接进主机 ROS 2 图；上行发心跳与状态，下行发 cmd_vel 指令"
      className="h-auto w-full"
    >
      <defs>
        <marker id="tp-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="tp-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
      </defs>

      <text x="16" y="22" fill="#0f172a" fontSize="12" fontWeight="700">
        跨机通路三层：板端 micro-ROS ↔ Agent ↔ 主机 ROS 2（MCU 在 ROS 2 里就是普通节点）
      </text>

      <rect x="16" y="36" width="240" height="230" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="32" y="62" fill="#1a5cae" fontSize="12" fontWeight="700">① 板端 · 微控制器</text>
      <text x="32" y="80" fill="#475569" fontSize="10">ESP32-S3（奇果派 S3）</text>
      <text x="32" y="108" fill="#0f172a" fontSize="10">micro-ROS client</text>
      <text x="32" y="125" fill="#475569" fontSize="10">rcl + rclc（C，静态内存）</text>
      <text x="32" y="150" fill="#0f172a" fontSize="10">节点名 esp32_car</text>
      <text x="32" y="167" fill="#475569" fontSize="10">发 /esp32/heartbeat ≈ 1 Hz</text>
      <text x="32" y="184" fill="#475569" fontSize="10">订阅 /cmd_vel 控履带</text>
      <text x="32" y="209" fill="#0f172a" fontSize="10">运行环境</text>
      <text x="32" y="226" fill="#475569" fontSize="10">FreeRTOS，无 Linux</text>
      <text x="32" y="251" fill="#475569" fontSize="10">硬实时、就地驱动 PWM</text>

      <rect x="330" y="36" width="240" height="230" rx="14" fill="#f0fdfa" stroke="#5eead4" />
      <text x="346" y="62" fill="#0f766e" fontSize="12" fontWeight="700">② 桥接 · micro-ROS Agent</text>
      <text x="346" y="80" fill="#475569" fontSize="10">Pi 上 ros:jazzy 容器</text>
      <text x="346" y="108" fill="#0f172a" fontSize="10">micro_ros_agent udp4</text>
      <text x="346" y="125" fill="#475569" fontSize="10">--port 8888，收 XRCE 设备</text>
      <text x="346" y="150" fill="#0f172a" fontSize="10">本身就是标准 ROS 2 节点</text>
      <text x="346" y="167" fill="#475569" fontSize="10">把 MCU 接进 DDS 图</text>
      <text x="346" y="192" fill="#b4690e" fontSize="10" fontWeight="700">固定跑在默认 DDS 域 0</text>
      <text x="346" y="209" fill="#475569" fontSize="10">不认 ROS_DOMAIN_ID</text>
      <text x="346" y="234" fill="#475569" fontSize="10">随 Pi 的 ROS 2 一起常驻</text>

      <rect x="644" y="36" width="240" height="230" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="660" y="62" fill="#0f172a" fontSize="12" fontWeight="700">③ 主机 · ROS 2 图</text>
      <text x="660" y="80" fill="#475569" fontSize="10">Pi 5 视觉 / 规划 / 决策</text>
      <text x="660" y="108" fill="#0f172a" fontSize="10">视觉、规划、决策节点</text>
      <text x="660" y="125" fill="#475569" fontSize="10">订阅 heartbeat、发 cmd_vel</text>
      <text x="660" y="150" fill="#0f172a" fontSize="10">第二节点（跨机验证）</text>
      <text x="660" y="167" fill="#475569" fontSize="10">WSL2 侧同版本 ROS 2</text>
      <text x="660" y="192" fill="#475569" fontSize="10">与 Pi 同一 ROS_DOMAIN_ID</text>
      <text x="660" y="209" fill="#475569" fontSize="10">+ ROS_STATIC_PEERS 指对端</text>
      <text x="660" y="234" fill="#475569" fontSize="10">ping-pong 就在这里跑</text>

      <line x1="262" y1="112" x2="324" y2="112" stroke="#0d9488" strokeWidth="2" markerEnd="url(#tp-teal)" />
      <text x="293" y="104" textAnchor="middle" fill="#0f766e" fontSize="9">状态 / 心跳</text>
      <line x1="324" y1="200" x2="262" y2="200" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#tp-blue)" />
      <text x="293" y="220" textAnchor="middle" fill="#1a5cae" fontSize="9">指令 cmd_vel</text>

      <line x1="576" y1="112" x2="638" y2="112" stroke="#0d9488" strokeWidth="2" markerEnd="url(#tp-teal)" />
      <text x="607" y="104" textAnchor="middle" fill="#0f766e" fontSize="9">状态 / 心跳</text>
      <line x1="638" y1="200" x2="576" y2="200" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#tp-blue)" />
      <text x="607" y="220" textAnchor="middle" fill="#1a5cae" fontSize="9">指令 cmd_vel</text>

      <rect x="16" y="282" width="868" height="78" rx="12" fill="#fffbeb" stroke="#fbbf24" />
      <text x="32" y="306" fill="#b4690e" fontSize="11" fontWeight="700">两条实测口径，别混用</text>
      <text x="32" y="326" fill="#475569" fontSize="10">
        · Agent 固定跑在默认 DDS 域 0：Pi 侧客户端若设置 ROS_DOMAIN_ID=42，连 /esp32/heartbeat 都看不到。
      </text>
      <text x="32" y="346" fill="#475569" fontSize="10">
        · 跨机 ping-pong 是另一套栈（两端统一域 42 + ROS_STATIC_PEERS），与 Agent 的域无关，5/5 往返、RTT 1–2 ms。
      </text>
    </svg>
  </div>
);

/* 部署层级：宿主 → Docker → 容器 → ROS 2 图 → 硬件（内联 SVG 结构关系图） */
const DeployLayers = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 330"
      role="img"
      aria-label="树莓派 ROS 2 部署层级：宿主 Debian 13 上不装 ROS 2 本身，靠 Docker 引擎 26.1.5 跑官方 arm64 镜像 ros:jazzy-ros-base，容器内 source 环境得到 ROS 2 图；硬件（摄像头 / 串口 / GPIO）默认不进容器，必须用 --device 显式映射"
      className="h-auto w-full"
    >
      <defs>
        <marker id="dl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
        </marker>
      </defs>
      <text x="16" y="20" fill="#0f172a" fontSize="12" fontWeight="700">
        部署层级：宿主不装 ROS 2，全靠容器；硬件要显式映射
      </text>

      <rect x="190" y="30" width="694" height="40" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="208" y="55" fill="#0f172a" fontSize="12" fontWeight="700">① 宿主 · 树莓派 5（Debian 13）</text>
      <text x="868" y="55" textAnchor="end" fill="#475569" fontSize="10">系统层：不装 ROS 2 本身</text>

      <rect x="190" y="90" width="694" height="40" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="208" y="115" fill="#1a5cae" fontSize="12" fontWeight="700">② Docker 引擎 26.1.5</text>
      <text x="868" y="115" textAnchor="end" fill="#475569" fontSize="10">Debian 源 docker.io，开机自启</text>

      <rect x="190" y="150" width="694" height="40" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="208" y="175" fill="#1a5cae" fontSize="12" fontWeight="700">③ 容器 · ros:jazzy-ros-base</text>
      <text x="868" y="175" textAnchor="end" fill="#475569" fontSize="10">官方 arm64 二进制，随删随建</text>

      <rect x="190" y="210" width="694" height="40" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="208" y="235" fill="#0f766e" fontSize="12" fontWeight="700">④ ROS 2 图 · Jazzy</text>
      <text x="868" y="235" textAnchor="end" fill="#475569" fontSize="10">视觉 / 规划 / 决策节点</text>

      <rect x="190" y="270" width="694" height="40" rx="10" fill="#fffbeb" stroke="#fbbf24" />
      <text x="208" y="295" fill="#b4690e" fontSize="12" fontWeight="700">⑤ 硬件 · 摄像头 / 串口 / GPIO</text>
      <text x="868" y="295" textAnchor="end" fill="#475569" fontSize="10">默认不进容器，必须 --device</text>

      <line x1="537" y1="70" x2="537" y2="88" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dl-arrow)" />
      <text x="548" y="84" fill="#475569" fontSize="10">docker.io 安装</text>
      <line x1="537" y1="130" x2="537" y2="148" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dl-arrow)" />
      <text x="548" y="144" fill="#475569" fontSize="10">docker run</text>
      <line x1="537" y1="190" x2="537" y2="208" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dl-arrow)" />
      <text x="548" y="204" fill="#475569" fontSize="10">source setup.bash</text>
      <line x1="537" y1="250" x2="537" y2="268" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dl-arrow)" />
      <text x="548" y="264" fill="#b4690e" fontSize="10" fontWeight="700">--device 显式映射</text>
    </svg>
  </div>
);

/* 日常启动：宿主终端 → ros2.sh 启动容器 → 三种常用映射（内联 SVG 流程图） */
const LaunchMap = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 214"
      role="img"
      aria-label="日常启动路径：宿主终端跑 ~/ros2.sh，内部用 docker run --network host --name ros2 起容器并自动 source setup.bash 进入 ROS 2 环境；再加 --device 参数即可按需挂摄像头 /dev/video0、GPIO 与 I2C、串口 /dev/ttyAMA0"
      className="h-auto w-full"
    >
      <defs>
        <marker id="lm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="lm-arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>
      <text x="16" y="20" fill="#0f172a" fontSize="12" fontWeight="700">
        日常一条命令进环境：ros2.sh 启动容器，硬件按需 --device 挂进来
      </text>

      <rect x="16" y="40" width="196" height="58" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="114" y="66" textAnchor="middle" fill="#1a5cae" fontSize="12" fontWeight="700">① 宿主终端</text>
      <text x="114" y="84" textAnchor="middle" fill="#475569" fontSize="10">cd 任意目录，执行</text>

      <rect x="252" y="40" width="268" height="58" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="386" y="66" textAnchor="middle" fill="#1a5cae" fontSize="12" fontWeight="700">② ~/ros2.sh</text>
      <text x="386" y="84" textAnchor="middle" fill="#475569" fontSize="10">docker run --network host --name ros2</text>

      <rect x="560" y="40" width="324" height="58" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="722" y="66" textAnchor="middle" fill="#0f766e" fontSize="12" fontWeight="700">③ 容器内 ROS 2 环境</text>
      <text x="722" y="84" textAnchor="middle" fill="#475569" fontSize="10">自动 source /opt/ros/jazzy/setup.bash</text>

      <line x1="214" y1="69" x2="250" y2="69" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#lm-arrow)" />
      <line x1="522" y1="69" x2="558" y2="69" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#lm-arrow)" />

      <rect x="16" y="146" width="218" height="52" rx="10" fill="#fffbeb" stroke="#fbbf24" />
      <text x="125" y="168" textAnchor="middle" fill="#b4690e" fontSize="11" fontWeight="700">摄像头</text>
      <text x="125" y="185" textAnchor="middle" fill="#475569" fontSize="10">--device /dev/video0</text>

      <rect x="250" y="146" width="256" height="52" rx="10" fill="#fffbeb" stroke="#fbbf24" />
      <text x="378" y="168" textAnchor="middle" fill="#b4690e" fontSize="11" fontWeight="700">GPIO / I2C</text>
      <text x="378" y="185" textAnchor="middle" fill="#475569" fontSize="10">--device /dev/i2c-1 --device /dev/gpiomem</text>

      <rect x="522" y="146" width="362" height="52" rx="10" fill="#fffbeb" stroke="#fbbf24" />
      <text x="703" y="168" textAnchor="middle" fill="#b4690e" fontSize="11" fontWeight="700">串口（后续接 Agent）</text>
      <text x="703" y="185" textAnchor="middle" fill="#475569" fontSize="10">--device /dev/ttyAMA0</text>

      <line x1="386" y1="100" x2="386" y2="144" stroke="#b4690e" strokeWidth="2" markerEnd="url(#lm-arrow2)" />
      <text x="396" y="126" fill="#b4690e" fontSize="10" fontWeight="700">--device 显式映射（默认不进容器）</text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      ROS 2 与 micro-ROS 选型
      <br />
      <span className="text-brand-600">树莓派装 ROS 2，micro-ROS 只上微控制器</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      结论先行：树莓派（Raspberry Pi，下文简称 Pi）装 ROS 2（Robot Operating System 2，机器人操作系统），
      用 Docker（容器引擎）+ <code>ros:jazzy-ros-base</code>；micro-ROS 是给微控制器（MCU）用的 ROS 2，
      只在系统里存在 MCU 做实时底层时才引入。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整命令与全量步骤。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="树莓派装 ROS 2，micro-ROS 只跑在微控制器上"
    lead="ROS 2 是运行在 Linux 主机与单板计算机（SBC，Single-Board Computer）上的完整中间件；micro-ROS 把同一套节点模型压到 MCU 上，经 Agent 接进 ROS 2 图——两者是本体与接入端，不是二选一。"
  >
    <Grid cols={2}>
      <Card title="Pi 这一侧：ROS 2" icon={Server}>
        Pi 5 跑 Linux，视觉、规划、决策都该放在这里；本课方案是 Docker + <code>ros:jazzy-ros-base</code>。
      </Card>
      <Card title="MCU 这一侧：micro-ROS" icon={Micro}>
        电机闭环、IMU（惯性测量单元）采集、GPIO（通用输入输出）这类硬实时任务放 MCU，再用 micro-ROS 接入。
      </Card>
      <Card title="中间靠 Agent 桥接" icon={Cable}>
        micro-ROS Agent（代理）本身是标准 ROS 2 节点；MCU 在 ROS 2 里就是普通节点，话题照常收发。
      </Card>
      <Card title="不要搞反边" icon={AlertTriangle} tone="warn">
        在树莓派 Linux 上装 micro-ROS 没有意义；官方 MCU 列表里只有 Pico（RP2040），没有任何 Pi 4/5。
      </Card>
    </Grid>
  </Frame>
);

/* 通信路径四段（点式动画 ① 的数据） */
const COMM_CHAIN = [
  { no: "1", title: "MCU 板端", sub: "micro-ROS client（rcl + rclc）", side: "device" },
  { no: "2", title: "传输层", sub: "串口（serial）/ Wi-Fi（UDP4）", side: "cmd" },
  { no: "3", title: "micro-ROS Agent", sub: "树莓派容器：把「方言」翻成「普通话」", side: "cmd" },
  { no: "4", title: "ROS 2 图", sub: "MCU 成了普通节点，话题照收发", side: "cmd" },
  { no: "5", title: "验证通过", sub: "node list 出现 /esp32_car", side: "good" },
];

const CommunicationPath = () => (
  <Frame
    kicker="概览"
    floor="02"
    title="通信路径：MCU → 传输层 → Agent → ROS 2 图"
    lead="micro-ROS 的链路是一条直线：MCU 跑 client，经串口或 UDP 送到 Agent，Agent 把它翻译成标准 ROS 2 节点，最后在 ROS 2 图里用话题收发。"
    wide
  >
    <div className="space-y-4">
      <PointFlow
        steps={COMM_CHAIN}
        hint="逐点点亮：灯走到哪，链路记到哪；点节点可手动跳到该步。"
      />
      <Quote>记住终点：MCU 在 ROS 2 里就是普通节点——换 MCU 或换主机，Agent 两侧都不用改。</Quote>
    </div>
  </Frame>
);

const Positioning = () => (
  <Frame
    kicker="选型"
    floor="03"
    title="两者不是二选一：一个是本体，一个是 MCU 接入端"
    lead="定位先分清：ROS 2 是运行在 Linux 上的本体，micro-ROS 是它的受限设备接入端；接口、中间件与资源需求都不同。"
    wide
  >
    <DataTable
      head={["维度", "ROS 2", "micro-ROS"]}
      rows={[
        ["目标平台", "Linux / Windows / macOS 主机、SBC（树莓派、Jetson 等）", "微控制器（MCU）、RTOS"],
        ["运行环境", "完整 Linux 用户态", "FreeRTOS / Zephyr / NuttX（或裸机）"],
        ["资源需求", "数百 MB 内存起", "几十 KB RAM"],
        ["中间件", "DDS（Data Distribution Service，数据分发服务）", "Micro XRCE-DDS（为受限设备优化）"],
        ["客户端 API", "rclcpp / rclpy 等完整版", "rcl + rclc（C，静态内存，无运行时动态分配）"],
        ["与 ROS 2 的关系", "本体", "经 micro-ROS Agent 接入 ROS 2 图，节点是普通节点"],
        ["官方支持 Pi（Linux）", "支持（arm64，Ubuntu 为 Tier 1）", "不支持；MCU 列表里只有 Pi Pico（RP2040）"],
      ]}
    />
    <div className="mt-5">
      <Quote>micro-ROS 的架构是「MCU 客户端 → Agent → ROS 2 图」，Agent 本身仍是 ROS 2 节点——所以 micro-ROS 替代不了 ROS 2。</Quote>
    </div>
  </Frame>
);

const DecisionTree = () => (
  <Frame
    kicker="选型"
    floor="04"
    title="先问三件事，再决定装什么"
    lead="判定只看系统里有没有 MCU 做实时底层：没有就只装 ROS 2；有就两边都装，中间起 Agent。"
    wide
  >
    <div className="space-y-4">
      <SelectionDecision />
      <Quote>只有一块 Pi、又只是取图或算法验证时，直接 Python / OpenCV 往往比引入中间件更省事。</Quote>
    </div>
  </Frame>
);

const WhenMicro = () => (
  <Frame
    kicker="选型"
    floor="05"
    title="有硬实时与底层 I/O 需求，才把 MCU 拉进来"
    wide
  >
    <Focus
      no="MCU"
      title="引入 micro-ROS 的触发条件"
      tag="MCU 侧"
      goal="把硬实时与底层 I/O 从 Linux 挪到单片机，再用 micro-ROS 接进树莓派的 ROS 2 图。"
      points={[
        "需要硬实时闭环（电机 PID、舵机时序），Linux 抖动不可接受。",
        "需要直接驱动大量 GPIO / ADC / PWM / CAN 等底层外设。",
        "采集频率高、主控 CPU 不想被底层 I/O 占用（IMU、编码器）。",
        "以上任一成立，才在 MCU 上引入 micro-ROS；否则不要多养一套固件。",
      ]}
      aside={
        <Card title="官方支持的 MCU" icon={CircuitBoard}>
          ESP32、Arduino Portenta H7、树莓派 Pico（RP2040）、Teensy 4.x、STM32 系列、Renesas RA6M5 等。
        </Card>
      }
    />
  </Frame>
);

const NotWhen = () => (
  <Frame
    kicker="选型"
    floor="06"
    title="什么时候「不用」micro-ROS：判据卡"
    lead="micro-ROS 不是默认件。任何一条「不该用」成立，就别多养一套固件与 Agent。"
    wide
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="只有 Linux 主机、没有 MCU" icon={Server} tone="warn">
          系统里没有做实时底层的单片机，就只装 ROS 2；在 Pi 的 Linux 上装 micro-ROS 没有意义（官方 MCU 列表只有 Pico）。
        </Card>
        <Card title="没有硬实时与底层 I/O 需求" icon={Gauge} tone="warn">
          电机闭环、IMU、PWM / CAN 都不在系统边界上时，多一套 RTOS 固件只是负担。
        </Card>
        <Card title="只是取图 / 算法验证" icon={Micro} tone="warn">
          单块 Pi 上跑 OpenCV 验证算法，直接用 Python 更省事，不必为验证引入中间件。
        </Card>
        <Card title="算力足够、还要全量 API" icon={Layers} tone="warn">
          需要导航 / 感知全量生态或几百 MB 内存的多节点编排时，主体只能是原生 ROS 2。
        </Card>
      </Grid>
      <Quote>
        判据一句话：micro-ROS 只在「有 MCU 做实时底层」时出现——它是接入端，替代不了 ROS 2。
      </Quote>
    </div>
  </Frame>
);

const COMPARE_OPTIONS = [
  {
    name: "原生 ROS 2（Linux 直跑）",
    sub: "树莓派 / 主机上直接跑完整 ROS 2：视觉、规划、决策、多节点编排。",
    metrics: [
      { label: "算力 / 内存", value: "数百 MB 起，多核", pct: 100, tone: "brand" },
      { label: "实时性（延迟）", value: "Linux 非硬实时，毫秒级抖动", pct: 40, tone: "warn" },
      { label: "维护成本", value: "一套系统，最省", pct: 25, tone: "good" },
    ],
  },
  {
    name: "micro-ROS（MCU 上）",
    sub: "电机闭环、IMU 采集、PWM / CAN 就地驱动，硬实时留在单片机侧。",
    metrics: [
      { label: "算力 / 内存", value: "几十 KB RAM，单核", pct: 20, tone: "brand" },
      { label: "实时性（延迟）", value: "RTOS 硬实时，微秒级", pct: 95, tone: "good" },
      { label: "维护成本", value: "多一套固件 + 跨平台工具链", pct: 80, tone: "warn" },
    ],
  },
  {
    name: "桥接：micro-ROS Agent",
    sub: "把 MCU 接进 ROS 2 图的那一段；Agent 本身是标准 ROS 2 节点。",
    metrics: [
      { label: "算力 / 内存", value: "跟主机，可忽略", pct: 30, tone: "brand" },
      { label: "实时性（延迟）", value: "取决于传输链路（串口 / UDP）", pct: 60, tone: "warn" },
      { label: "维护成本", value: "随 Pi 常驻，换设备零改动", pct: 45, tone: "good" },
    ],
  },
];

const Comparison = () => (
  <Frame
    kicker="选型"
    floor="07"
    title="算力、实时性、生态、维护：四个维度看两边怎么选"
    lead="对比对象：在 Linux 主机上直接跑原生 ROS 2，还是把控制与采集下沉到 MCU、用 micro-ROS 接入。"
    wide
  >
    <div className="space-y-4">
      <PointCompare
        options={COMPARE_OPTIONS}
        hint="逐方案点亮：先看资源，再看延迟，最后看维护成本；点方案可手动跳到该列。"
      />
      <DataTable
        head={["维度", "原生 ROS 2 直跑（Linux）", "micro-ROS 上微控制器"]}
        rows={[
          ["算力", "数百 MB 内存、多核；视觉 / 规划 / 多节点无压力", "几十 KB RAM、单核；只够跑控制与采集"],
          ["实时性", "Linux 非硬实时，调度抖动在毫秒级", "RTOS（实时操作系统）硬实时，周期稳定在微秒级"],
          ["生态", "rclcpp / rclpy 全量 API，导航 / 感知生态完整", "只有 rcl + rclc（C，静态内存），生态小得多"],
          ["维护", "一套系统，apt / Docker 升级即可", "多一套固件与 Agent，跨平台工具链更麻烦"],
          ["适用", "视觉、规划、决策、多节点编排", "电机闭环、IMU、PWM / CAN 就地驱动"],
        ]}
      />
      <Quote>
        辩证一问：「什么情况下反而该选另一边？」——只有 MCU、没有 Linux 主机，又要做多节点通信时，
        才轮到在一块强一点的 MCU 上直接跑 micro-ROS；反过来，系统里根本没有硬实时任务时，
        就不该为它多养一套固件与 Agent。
      </Quote>
    </div>
  </Frame>
);

const Options = () => (
  <Frame
    kicker="部署"
    floor="08"
    title="树莓派上装 ROS 2：Docker 最省事，源码编译不建议"
    lead="关键约束：ROS 2 的 apt 二进制包只支持 Ubuntu；按 REP-2000（ROS 2 支持层级规范），arm64 的 Tier 1 是 Ubuntu，Raspberry Pi OS / Debian 属 Tier 3，需要源码编译。官方给的路只有 Docker 或 Ubuntu。"
    wide
  >
    <div className="space-y-4">
      <DeployLayers />
      <DataTable
        head={["方案", "做法", "结论"]}
        rows={[
          ["Docker（本项目采用）", "64 位 Debian / Pi OS + 跑官方 arm64 镜像", "✅ 推荐：不污染宿主、升级只换 tag"],
          ["Ubuntu 24.04 for Pi", "重刷系统 + 标准 apt 装 Jazzy", "破坏现有环境与已配好的网络，谨慎"],
          ["源码编译", "在 Debian 上自建 ROS 2 工作区", "❌ 耗时长、依赖坑多、难维护"],
          ["conda / RoboStack（pixi）", "用 pixi 装 conda-forge 的 ROS 2", "备选：宿主原生、免 Docker"],
        ]}
      />
      <Quote>发行版选 Jazzy Jalisco（LTS，长期支持到 2029-05，对应 Ubuntu 24.04）；ROS 1 Noetic 已停止维护，不要再用。</Quote>
    </div>
  </Frame>
);

const ChosenDocker = () => (
  <Frame
    kicker="部署"
    floor="09"
    title="选 Docker + Jazzy LTS：官方 arm64 二进制、不污染宿主"
  >
    <Grid cols={2}>
      <Card title="官方 arm64 二进制" icon={Download}>
        <code>ros:jazzy-ros-base</code> 由官方构建，Pi 上无需编译，直接跑。
      </Card>
      <Card title="不污染宿主系统" icon={Boxes}>
        依赖都封在镜像里；换版本只换 tag，卸载只删镜像。
      </Card>
      <Card title="访问硬件要显式映射" icon={Cable}>
        摄像头 / 串口 / GPIO 默认不进容器，必须用 <code>--device</code> 显式映射。
      </Card>
      <Card title="发行版选 LTS" icon={ShieldCheck} tone="good">
        Jazzy（2024-05 发布，维护到 2029-05）；ROS 1 Noetic 已停维。
      </Card>
    </Grid>
    <div className="mt-6">
      <Grid cols={3}>
        <Stat value="26.1.5" unit="Docker" label="Debian 源 docker.io，已设开机自启" />
        <Stat value="Jazzy" unit="LTS" label="对应 Ubuntu 24.04，维护到 2029-05" tone="good" />
        <Stat value="896" unit="MB" label="ros:jazzy-ros-base 镜像体积" tone="brand" />
      </Grid>
    </div>
  </Frame>
);

const ProxySetup = () => (
  <Frame
    kicker="部署"
    floor="10"
    title="镜像拉不动是网络问题，走本机 Clash 代理"
    wide
  >
    <div className="space-y-5">
      <Grid cols={2}>
        <Card title="Docker Hub 直连超时" icon={AlertTriangle} tone="warn">
          registry-1.docker.io 在树莓派上不可达。
        </Card>
        <Card title="国内镜像站拉大 layer 会卡" icon={Gauge} tone="warn">
          小镜像能拉，但 ros:jazzy-ros-base 的大 layer 反复「Download complete 后不推进」。
        </Card>
        <Card title="本机 Clash 代理稳定" icon={Wifi} tone="good">
          Clash Verge 开 allow-lan、mixed-port 7897；Pi 走 192.168.31.57:7897。
        </Card>
        <Card title="给 dockerd 配代理" icon={Network}>
          写在 systemd drop-in，不是 daemon.json；同时把 registry-mirrors 清空。
        </Card>
      </Grid>
      <Quote>拉镜像前确认本机 Clash 在运行且开了 allow-lan；已拉好的镜像与运行中的容器不受影响。</Quote>
      <Steps title="展开：Clash 代理与 dockerd 配置（完整命令）">
        <Pre>{`# 本机 Clash Verge：allow-lan: true，mixed-port: 7897

# Pi 上先验证代理连通（期望 401）
curl -sS -o /dev/null -w '%{http_code}\\n' --max-time 12 \\
  -x http://192.168.31.57:7897 https://registry-1.docker.io/v2/

# 给 dockerd 配代理（systemd drop-in，不是 daemon.json）
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf >/dev/null <<'EOF'
[Service]
Environment="HTTP_PROXY=http://192.168.31.57:7897"
Environment="HTTPS_PROXY=http://192.168.31.57:7897"
Environment="NO_PROXY=localhost,127.0.0.1,::1,172.26.188.116,192.168.31.29"
EOF

# 清空 registry-mirrors，避免请求先绕到镜像站反而更慢
echo '{}' | sudo tee /etc/docker/daemon.json

sudo systemctl daemon-reload
sudo systemctl restart docker
systemctl show docker --property=Environment`}</Pre>
        <p className="text-[0.84rem] text-muted">
          直连网线不可用时，把代理地址换成 <code>172.26.188.100:7897</code>。
          <br />
          安全提示：allow-lan 会让 Clash 对全网卡无鉴权开放；共享网络下建议把 bind-address 限定到直连地址，或临时开启、用完关闭。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Install = () => (
  <Frame
    kicker="部署"
    floor="11"
    title="装 Docker、拉两个镜像，这一步就能跑起来"
    wide
  >
    <div className="space-y-5">
      <Code>
        sudo apt-get install -y docker.io &nbsp;&nbsp;# Debian 13 自带 26.1.5
        <br />
        sudo systemctl enable --now docker
        <br />
        sudo usermod -aG docker nanzhida &nbsp;&nbsp;# 之后免 sudo
        <br />
        <br />
        docker pull ros:jazzy-ros-core &nbsp;&nbsp;# 511 MB（最小集）
        <br />
        docker pull ros:jazzy-ros-base &nbsp;&nbsp;# 896 MB（推荐）
      </Code>
      <DataTable
        head={["镜像", "Image ID", "大小"]}
        rows={[
          ["ros:jazzy-ros-base", "2ff2feced2a6", "896 MB（含 rclcpp / rclpy）"],
          ["ros:jazzy-ros-core", "c9df25bdf5d9", "511 MB（最小可运行集）"],
        ]}
      />
      <Quote>本次实测：Docker 26.1.5+dfsg1，驱动 overlay2，架构 aarch64。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：Docker 安装与拉取（完整命令）">
        <Pre>{`# 装 Docker（Debian 13 自带 26.1.5）
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker nanzhida      # 之后免 sudo，需重新登录

# 拉镜像（依赖本机 Clash 代理已就绪）
docker pull ros:jazzy-ros-core        # 511 MB
docker pull ros:jazzy-ros-base        # 896 MB（推荐）

# 确认
docker images | grep ros
docker version`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Verify = () => (
  <Frame kicker="验证" floor="12" title="跑起来才算装上：容器内发布订阅回环通过" wide>
    <Grid cols={2}>
      <div className="space-y-4">
        <Card title="容器内 ROS 2 可用" icon={CheckCircle2} tone="good">
          ROS_DISTRO = jazzy；<code>ros2 pkg list</code> 共 194 个包；rclpy 可导入。
        </Card>
        <Card title="发布 / 订阅回环通过" icon={Rocket} tone="good">
          <code>ros2 topic pub</code> 发字符串，<code>ros2 topic echo</code> 收到 hello_from_pi。
        </Card>
        <Card title="启动器已就位" icon={Terminal}>
          Pi 上 <code>~/ros2.sh</code> 一条命令进入容器并自动 source 环境。
        </Card>
      </div>
      <Code>
        docker run --rm --network host ros:jazzy-ros-base \
        <br />
        &nbsp;&nbsp;bash -lc 'source /opt/ros/jazzy/setup.bash; ...'
        <br />
        <br />
        ROS_DISTRO=jazzy
        <br />
        pkg_count=194
        <br />
        rclpy: rclpy
        <br />
        <br />
        --- pub/sub test ---
        <br />
        data: hello_from_pi
      </Code>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：自测复现命令（容器内发布 / 订阅回环）">
        <Pre>{`docker run --rm --network host ros:jazzy-ros-base bash -lc '
  source /opt/ros/jazzy/setup.bash
  echo "ROS_DISTRO=$(printenv ROS_DISTRO)"; echo "pkg_count=$(ros2 pkg list | wc -l)"
  ros2 topic pub -r 5 /kilo_test std_msgs/msg/String "{data: hello_from_pi}" >/tmp/pub.log 2>&1 &
  sleep 3; timeout 5 ros2 topic echo --once /kilo_test; kill %1'

# 期望输出
# ROS_DISTRO=jazzy
# pkg_count=194
# rclpy: rclpy
# data: hello_from_pi`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* Agent 启动顺序（点式动画 ③ 的数据） */
const AGENT_STEPS = [
  {
    t: "① 烧固件（板子侧）",
    s: "把 micro-ROS 程序写进 MCU：board_microros_distro=jazzy，节点名 esp32_car。",
    side: "device",
  },
  {
    t: "② 起 Agent（电脑侧）",
    s: "容器内 ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888，占住端口等接入。",
    side: "cmd",
  },
  {
    t: "③ 板子上电连入",
    s: "Agent 日志出现 session created —— 出现即通；顺序反了也不用重启板子（ping 自动重连）。",
    side: "cmd",
  },
  {
    t: "④ 看话题（验证通过）",
    s: "ros2 topic list 出现 /esp32/heartbeat，node list 出现 /esp32_car，全链贯通。",
    side: "good",
  },
];

const AgentStartup = () => (
  <Frame
    kicker="验证"
    floor="13"
    title="启动顺序：先烧固件、再起 Agent，最后看话题"
    lead="纵向点式替学生把流程走一遍：当前步脉冲高亮、已完成转绿。顺序反了也不用重启板子。"
    wide
  >
    <div className="space-y-4">
      <PointSteps steps={AGENT_STEPS} hint="点每一步可手动跳转；默认全亮＝静态兜底。" />
      <Quote>记忆锚（先记顺序）：口诀「板等 Agent，Agent 等端口，端口等网络」——先开后连，顺序不反。</Quote>
    </div>
  </Frame>
);

const Topology = () => (
  <Frame
    kicker="验证"
    floor="14"
    title="跨机通路三层：板端 micro-ROS → Agent → 主机 ROS 2"
    lead="MCU 上跑 micro-ROS client，Pi 的 ROS 2 容器里跑 micro-ROS Agent，Agent 把设备接进主机 ROS 2 图；上行发状态、下行发指令，MCU 在 ROS 2 里就是普通节点。"
    wide
  >
    <div className="space-y-4">
      <CrossTopology />
      <Quote>边界在 Agent：它一头收 MCU 的 XRCE 报文、一头接 DDS 图；换 MCU 或换主机，Agent 都不必改。</Quote>
    </div>
  </Frame>
);

const Wsl2Ros = () => (
  <Frame kicker="验证" floor="15" title="主机侧再装一份 ROS 2，做跨机验证的第二节点" wide>
    <Grid cols={2}>
      <Card title="Ubuntu 24.04 + Jazzy" icon={Server}>
        WSL2（Windows Subsystem for Linux 2）里 apt 装 ros-jazzy-ros-base，与树莓派同版本，作为独立的第二节点。
      </Card>
      <Card title="apt 走清华 TUNA 镜像" icon={Download}>
        http://mirrors.tuna.tsinghua.edu.cn/ros2/ubuntu，比官方源快很多。
      </Card>
      <Card title="镜像网络模式" icon={Network}>
        .wslconfig 设 networkingMode=Mirrored，WSL 直接持有宿主 IP 172.26.188.100。
      </Card>
      <Card title="配置即用" icon={CheckCircle2} tone="good">
        ~/.bashrc 已 source setup.bash；ros2 直接可用，与 Pi 直连同网段。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：WSL2 装 ROS 2（完整步骤）">
        <Pre>{`# WSL2（Ubuntu 24.04）内执行
sudo apt install -y curl gnupg lsb-release
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key \\
  -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \\
http://mirrors.tuna.tsinghua.edu.cn/ros2/ubuntu noble main" \\
  | sudo tee /etc/apt/sources.list.d/ros2.list
sudo apt update
sudo apt install -y ros-jazzy-ros-base

# 每个新 shell 都要 source（写进 ~/.bashrc 即自动）
echo 'source /opt/ros/jazzy/setup.bash' >> ~/.bashrc

# .wslconfig（Windows 用户目录）：镜像网络，WSL 直接持有宿主 IP
# [wsl2]
# networkingMode=Mirrored
# hostAddressLoopback=true`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const CrossDds = () => (
  <Frame kicker="验证" floor="16" title="跨机 DDS 通则：同一域 + 静态对端 + 放行入站 UDP" wide>
    <div className="space-y-5">
      <Grid cols={2}>
        <Card title="同一 ROS_DOMAIN_ID" icon={Layers}>
          两端都设 42，与默认域隔离，避免和别的节点串在一起。
        </Card>
        <Card title="ROS_STATIC_PEERS 指对端" icon={ArrowLeftRight}>
          WSL → 172.26.188.116，Pi → 172.26.188.100，绕开多网卡 / 组播发现的坑。
        </Card>
        <Card title="入站 UDP 默认被拦" icon={AlertTriangle} tone="warn">
          WSL Hyper-V 防火墙入站 Block + Windows 防火墙网卡 Public；Pi → WSL 连 ping 都 100% 丢。
        </Card>
        <Card title="定向放行（需管理员）" icon={ShieldCheck} tone="good">
          只放行 172.26.188.116 的 UDP（用户数据报协议）入站：Hyper-V 规则 + Windows 规则各一条。
        </Card>
      </Grid>
      <Quote>判据：从 Pi ping 172.26.188.100 若 100% 丢包，就是本机入站被拦，不是路由问题。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：跨机 DDS 配置与放行（完整）">
        <Pre>{`# 两端都用同一个域，并指定对端直连 IP
export ROS_DOMAIN_ID=42
export ROS_STATIC_PEERS=172.26.188.116   # WSL 侧指向 Pi
export ROS_STATIC_PEERS=172.26.188.100   # Pi 侧指向 WSL

# 本机入站 UDP 默认被拦，需管理员加定向放行：
#   WSL Hyper-V 防火墙 + Windows 防火墙各一条
#   只放行 172.26.188.116 的 UDP 入站
# 判据：从 Pi ping 172.26.188.100，若 100% 丢包即入站被拦

# WSL 侧测连通
ping -c 2 172.26.188.116`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const PingPong = () => (
  <Frame kicker="验证" floor="17" title="ping-pong 5/5、RTT 1–2 ms，跨机通路确认可用" wide>
    <Grid cols={2}>
      <div className="space-y-4">
        <Card title="分工" icon={Terminal}>
          ping.py 跑 WSL2；pong.py 跑树莓派容器（<code>--network host --hostname pi-zhangsk</code>）。
        </Card>
        <Card title="话题" icon={Network}>
          /kilo_ping（WSL → Pi）与 /kilo_pong（Pi → WSL），均为 std_msgs/String。
        </Card>
        <Card title="结果 5/5" icon={CheckCircle2} tone="good">
          RTT（Round-Trip Time，往返时延）1–2 ms，平均 1.3 ms；回包带 @pi-zhangsk，证明经过树莓派 ROS 2 图。
        </Card>
        <Card title="复现" icon={BookOpen}>
          脚本与防火墙规则见{" "}
          <a className="font-semibold text-brand-700 underline" href="./files/ROS2消息通路验证.zip">
            ROS2消息通路验证.zip
          </a>
          。
        </Card>
      </div>
      <Code>
        ROS_DOMAIN_ID=42 ROS_STATIC_PEERS=172.26.188.116 \
        <br />
        &nbsp;&nbsp;python3 ping.py 5 3
        <br />
        <br />
        peer found, starting ping-pong
        <br />
        5/5 rounds answered
        <br />
        min=1.0 ms&nbsp;&nbsp;max=2.0 ms&nbsp;&nbsp;avg=1.3 ms
        <br />
        pong='...|pong#1@pi-zhangsk'
      </Code>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：ping-pong 复现命令">
        <Pre>{`# WSL2：发 ping
cd 教学demo/ROS2消息通路验证
ROS_DOMAIN_ID=42 ROS_STATIC_PEERS=172.26.188.116 python3 ping.py 5 3

# 树莓派容器内：跑 pong
docker run -it --rm --network host --hostname pi-zhangsk \\
  -e ROS_DOMAIN_ID=42 -e ROS_STATIC_PEERS=172.26.188.100 \\
  ros:jazzy-ros-base bash
# 容器内
source /opt/ros/jazzy/setup.bash
python3 pong.py

# 期望：5/5 rounds answered，RTT 1–2 ms，回包带 @pi-zhangsk`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Daily = () => (
  <Frame kicker="使用" floor="18" title="日常一条命令进环境，硬件要显式映射" wide>
    <div className="space-y-5">
      <Grid cols={3}>
        <Card title="进入环境" icon={Terminal}>
          ~/ros2.sh
        </Card>
        <Card title="挂摄像头" icon={Cable}>
          ~/ros2.sh --device /dev/video0
        </Card>
        <Card title="挂 GPIO / I2C" icon={Layers}>
          ~/ros2.sh --device /dev/i2c-1 --device /dev/gpiomem
        </Card>
      </Grid>
      <LaunchMap />
      <DataTable
        head={["要点", "说明"]}
        rows={[
          ["--network host", "单机多容器 ROS 2 通信最省心，避免 DDS 跨容器发现配置"],
          ["硬件访问", "摄像头 / 串口 / GPIO 默认不进容器，必须显式 --device"],
          ["示例包", "ros-base 不含 demo_nodes；需要时容器内 apt install ros-jazzy-demo-nodes-cpp"],
          ["环境变量", "新 shell 要 source setup.bash（ros2.sh 已自动处理），多容器用同一 ROS_DOMAIN_ID"],
        ]}
      />
    </div>
    <div className="mt-4">
      <Steps title="展开：ros2.sh 启动器与常用映射（完整）">
        <Pre>{`# /home/nanzhida/ros2.sh
#!/bin/bash
exec docker run -it --rm --network host --name ros2 "$@" \\
  ros:jazzy-ros-base bash -lc 'source /opt/ros/jazzy/setup.bash; echo "ROS 2 ready."; exec bash'

# 用法
~/ros2.sh                                    # 进入 ROS 2
~/ros2.sh --device /dev/video0               # 挂摄像头
~/ros2.sh --device /dev/i2c-1 --device /dev/gpiomem   # 挂 GPIO / I2C
~/ros2.sh --device /dev/ttyAMA0              # 挂串口（后续接 Agent）

# 多容器互通：都加 --network host，并用同一 ROS_DOMAIN_ID`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const MemoryAnchor = () => (
  <Frame
    kicker="收尾"
    floor="19"
    title="记忆锚：三句话记住整册选型"
    lead="把「死记」换成「钩子」——口诀定选型、类比定角色、颜色定通断；三种锚在正文与图示里重复出现。"
    wide
  >
    <div className="space-y-4">
      <AnchorCards />
      <Quote>
        考场先想起钩子，再顺出知识：小车上 micro-ROS、大车上原生 ROS 2；micro-ROS 是给单片机配的翻译官，
        Agent 是翻译官工作站；蓝＝MCU / 硬件、橙＝传输 / 中间件、绿＝验证通过。
      </Quote>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame kicker="收尾" floor="20" title="脚本与文字版全文，随 deck 下载" wide>
    <Grid cols={2}>
      <Card title="随 deck 分发的脚本" icon={Download}>
        <p>
          <a className="font-semibold text-brand-700 underline" href="./files/ROS2消息通路验证.zip">
            ROS2消息通路验证.zip
          </a>
        </p>
        <p className="mt-2 text-muted">ping.py + pong.py + README，跨机 DDS 验证脚本。</p>
      </Card>
      <Card title="工作区内的位置" icon={FolderTree}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>验证脚本：<code>教学demo/ROS2消息通路验证/</code></li>
          <li>文字版：<code>docs/ROS2与micro-ROS选型.md</code></li>
          <li>MCU 侧落地：<code>教学demo/ESP32-S3-microROS/</code></li>
        </ul>
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        相邻主题：<code>ESP32-S3接入micro-ROS</code>（S3 固件与 Agent 通路）、<code>ESP32-S3电机驱动板</code>（硬件与接线）。
      </Card>
      <Card title="下载地址约定" icon={Target}>
        离线首选 <code>./files/…</code>（随 deck 分发）；在线地址以 <code>origin/main</code> 已推送为准，未推送的链接是 404。
      </Card>
    </Grid>
  </Frame>
);

const Action = () => (
  <Frame kicker="收尾" floor="21" title="照清单做：先装 Docker 跑通回环，再按需接 MCU" wide>
    <div className="space-y-5">
      <Quote>树莓派装 ROS 2；micro-ROS 只在有 MCU 做实时底层时才出现在 MCU 上。</Quote>
      <Grid cols={3}>
        <Card title="已在 Pi 上就绪" icon={CheckCircle2} tone="good">
          Docker 26.1.5、ros:jazzy-ros-base（896 MB）、~/ros2.sh。
        </Card>
        <Card title="拉镜像的前提" icon={Wifi} tone="warn">
          本机 Clash 在运行且开 allow-lan；关掉则 docker pull 失败。
        </Card>
        <Card title="下一步" icon={ListChecks}>
          在容器里跑视觉节点；若要接 MCU，再起 micro-ROS Agent。
        </Card>
      </Grid>
      <Steps title="展开：上机清单与 micro-ROS 落地（2026-09 实测）">
        <Pre>{`# 1) 上机四步
sudo apt-get install -y docker.io && sudo usermod -aG docker nanzhida
docker pull ros:jazzy-ros-base          # 依赖本机 Clash 代理
~/ros2.sh                               # 进入 ROS 2 容器
# 容器内跑发布 / 订阅回环，确认 ROS_DISTRO=jazzy、pkg_count=194

# 2) Pi 侧 micro-ROS Agent：zhangsk 的 ~/microros_ws
#    （micro-ROS-Agent + micro_ros_msgs，均取 jazzy 分支、--depth 1）
#    colcon build --symlink-install 成功（约 2 分半）
docker run -d --name microros_agent --network host \\
  -v ~/microros_ws:/microros_ws ros:jazzy-ros-base bash -lc \\
  'source /opt/ros/jazzy/setup.bash; source /microros_ws/install/setup.bash; \\
   exec ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888'
# 看日志 / 停止：docker logs -f microros_agent ｜ docker rm -f microros_agent

# 3) ESP32-S3 侧：教学demo/ESP32-S3-microROS/
#    micro_ros_platformio，board_microros_distro = jazzy +
#    board_microros_transport = wifi，节点名 esp32_car，
#    接 /cmd_vel、发 /esp32/heartbeat
#    首次要编 libmicroros，Windows 原生编不了 →
#    用 tools/microros_lib_wsl.sh 在 WSL 里编一次、拷回工程 .pio

# 4) 踩坑：Agent 不认 ROS_DOMAIN_ID，固定跑在默认 DDS 域 0
#    Pi 侧客户端若 export ROS_DOMAIN_ID=42，连 /esp32/heartbeat 都看不到

# 5) 结果：ros2 node list → /esp32_car；/esp32/heartbeat ≈ 1 Hz；
#    teleop 发 /cmd_vel 后左右履带前进/后退/左转/右转/停车方向全对

# 来源：micro-ROS 官站 https://micro.vulcanexus.org/
#       硬件列表 https://micro.vulcanexus.org/docs/overview/hardware/
#       Pi 安装指引 https://docs.ros.org/en/jazzy/How-To-Guides/Installing-on-Raspberry-Pi.html
#       REP-2000 https://reps.openrobotics.org/rep-2000/
#       官方镜像 https://hub.docker.com/_/ros`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Download}>
        下载：
        <a className="font-semibold text-brand-700 underline" href="./files/ROS2消息通路验证.zip">
          ROS2消息通路验证.zip
        </a>
        ；文字版见 <code>docs/ROS2与micro-ROS选型.md</code>，MCU 侧见 <code>教学demo/ESP32-S3-microROS/</code>。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "通信路径", group: "概览", el: <CommunicationPath /> },
  { nav: "定位对照", group: "选型", el: <Positioning /> },
  { nav: "选型决策树", group: "选型", el: <DecisionTree /> },
  { nav: "何时用 micro-ROS", group: "选型", el: <WhenMicro /> },
  { nav: "何时不用 micro-ROS", group: "选型", el: <NotWhen /> },
  { nav: "对比决策", group: "选型", el: <Comparison /> },
  { nav: "部署方案对比", group: "部署", el: <Options /> },
  { nav: "Docker + Jazzy", group: "部署", el: <ChosenDocker /> },
  { nav: "Clash 代理", group: "部署", el: <ProxySetup /> },
  { nav: "安装与拉取", group: "部署", el: <Install /> },
  { nav: "容器自测", group: "验证", el: <Verify /> },
  { nav: "启动顺序", group: "验证", el: <AgentStartup /> },
  { nav: "跨机拓扑", group: "验证", el: <Topology /> },
  { nav: "WSL2 侧 ROS 2", group: "验证", el: <Wsl2Ros /> },
  { nav: "跨机 DDS 前置", group: "验证", el: <CrossDds /> },
  { nav: "ping-pong 实测", group: "验证", el: <PingPong /> },
  { nav: "日常使用", group: "使用", el: <Daily /> },
  { nav: "记忆锚", group: "收尾", el: <MemoryAnchor /> },
  { nav: "下载与延伸", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
