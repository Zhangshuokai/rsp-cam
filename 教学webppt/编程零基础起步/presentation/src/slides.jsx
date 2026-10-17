import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  Bell,
  BookOpen,
  Box,
  CheckCircle2,
  ClipboardList,
  Code2,
  Cpu,
  Download,
  Flag,
  FolderTree,
  Gauge,
  GitBranch,
  GraduationCap,
  Hand,
  Layers,
  Lightbulb,
  ListChecks,
  Monitor,
  MousePointerClick,
  Palette,
  Play,
  Repeat,
  RotateCcw,
  Route,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  Timer,
  Trophy,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Steps, Pre, Pill } from "./components.jsx";

/* ============================================================
   守则第七节 · 点式动画（全册 3 处）
   纯前端：React state + setTimeout + CSS transition，无外链资源。
   默认全亮（静态兜底，停帧 / 打印都完整可读）；播放时逐点 idle → active → done。
   ============================================================ */
function useSequence(count, initial = "on", { step = 1000, hold = 900 } = {}) {
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

/* 颜色编码（全册统一）：
   蓝＝框架 / 板子侧；橙＝你写的代码 / 电脑侧；黄＝事件；绿＝验证通过。 */
const NODE_TONE = {
  event: {
    idle: "border-line bg-paper text-muted",
    on: "border-amber-400 bg-amber-50 text-amber-700",
    active: "border-warn2 bg-warn2 text-white",
    done: "border-amber-300 bg-amber-50 text-amber-700",
  },
  framework: {
    idle: "border-line bg-paper text-muted",
    on: "border-brand-400 bg-brand-50 text-brand-700",
    active: "border-brand-600 bg-brand-600 text-white",
    done: "border-brand-300 bg-brand-50 text-brand-700",
  },
  user: {
    idle: "border-line bg-paper text-muted",
    on: "border-orange-400 bg-orange-50 text-orange-700",
    active: "border-warn2 bg-warn2 text-white",
    done: "border-orange-300 bg-orange-50 text-orange-700",
  },
  verify: {
    idle: "border-line bg-paper text-muted",
    on: "border-emerald-400 bg-emerald-50 text-good",
    active: "border-good bg-good text-white",
    done: "border-good bg-good text-white",
  },
  bad: {
    idle: "border-line bg-paper text-muted",
    on: "border-red-300 bg-red-50 text-bad",
    active: "border-bad bg-bad text-white",
    done: "border-red-200 bg-red-50 text-bad",
  },
};

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

const ToneLegend = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.76rem] text-muted">
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-brand-600" />
      蓝＝框架 / 板子侧
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-warn2" />
      橙＝你写的代码 / 电脑侧
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-amber-400" />
      黄＝事件
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝验证通过
    </span>
  </div>
);

const segClass = (side, st) => {
  if (st === "idle") return "bg-line";
  if (side === "bad") return st === "done" ? "bg-red-300" : "bg-bad";
  if (st === "done") return "bg-good";
  return side === "event" || side === "user" ? "bg-warn2" : "bg-brand-500";
};

/* 点式动画 ① · 回调时序：事件 → 框架 → 你的函数 → 返回 */
const CALLBACK_STEPS = [
  { no: "1", side: "event", title: "事件发生", sub: "按键、串口来数据、定时到点" },
  { no: "2", side: "framework", title: "框架收到", sub: "Arduino / ROS 2 内部先知道" },
  { no: "3", side: "framework", title: "框架调用", sub: "它找到你先前登记的函数" },
  { no: "4", side: "user", title: "你的函数干活", sub: "读值、置标志、发指令" },
  { no: "5", side: "framework", title: "返回继续等", sub: "框架接着等下一个事件" },
];

function CallbackTimeline() {
  const { statuses, play, reset, jump } = useSequence(CALLBACK_STEPS.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {CALLBACK_STEPS.map((s, i) => {
          const st = statuses[i];
          return (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => jump(i)}
                title={`跳到第 ${i + 1} 步`}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors duration-500 md:flex-col md:gap-2 md:py-3.5 md:text-center ${NODE_TONE[s.side][st]}`}
              >
                <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-current text-[0.9rem] font-bold md:h-10 md:w-10">
                  {st === "active" && (
                    <span
                      className={`absolute inset-0 animate-ping rounded-full ${
                        s.side === "event" || s.side === "user"
                          ? "bg-amber-400/50"
                          : "bg-brand-400/50"
                      }`}
                    />
                  )}
                  <span className="relative">{s.no}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-bold leading-tight md:text-[0.95rem]">
                    {s.title}
                  </span>
                  <span className="block text-[0.76rem] leading-tight opacity-80 md:text-[0.8rem]">
                    {s.sub}
                  </span>
                </span>
              </button>
              {i < CALLBACK_STEPS.length - 1 && (
                <span
                  className={`ml-[1.15rem] h-3 w-0.5 flex-none self-start rounded-full transition-colors duration-500 md:ml-1 md:mr-1 md:h-0.5 md:w-5 md:self-center ${segClass(
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
        <PlayBtn onClick={play}>播放回调时序</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="text-[0.78rem] text-muted">点节点可手动跳到该步；默认全亮＝静态兜底。</span>
      </div>
      <p className="mt-2.5 border-t border-line pt-2.5 text-[0.86rem] font-bold text-ink">
        口诀：函数我来调，回调他来调——事件一到，框架叫你。
      </p>
      <div className="mt-2">
        <ToneLegend />
      </div>
    </div>
  );
}

/* 点式动画 ② · 轮询 vs 回调：一个一直问，一个等通知 */
const POLL_STEPS = [
  { lane: "轮询", tone: "user", t: "问「到了吗？」", s: "程序主动问一次：没有数据。" },
  { lane: "轮询", tone: "user", t: "再问一次", s: "还是没有；CPU 一直在白转。" },
  { lane: "回调", tone: "framework", t: "先去干别的", s: "不用守着，框架替你等。" },
  { lane: "回调", tone: "event", t: "事件到了", s: "数据 / 按键 / 定时器触发。" },
  { lane: "回调", tone: "framework", t: "框架叫你", s: "调用你登记的函数，只干这一下。" },
];

function PollCallbackAnim() {
  const { statuses, play, reset, jump } = useSequence(POLL_STEPS.length, "on", {
    step: 950,
    hold: 850,
  });
  return (
    <div className="surface p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Pill tone="warn">轮询：一直问</Pill>
        <Pill tone="brand">回调：到了叫我</Pill>
      </div>
      <div className="space-y-2.5">
        {POLL_STEPS.map((s, i) => {
          const st = statuses[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => jump(i)}
              className={`flex w-full items-start gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left transition-colors duration-500 ${
                st === "done"
                  ? "border-good bg-emerald-50"
                  : st === "active"
                  ? s.tone === "event"
                    ? "border-warn2 bg-amber-50"
                    : "border-brand-600 bg-brand-50"
                  : "border-line bg-paper"
              }`}
            >
              <span
                className={`relative mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full text-[0.78rem] font-bold transition-colors duration-500 ${
                  st === "done"
                    ? "bg-good text-white"
                    : st === "active"
                    ? s.tone === "event"
                      ? "bg-warn2 text-white"
                      : "bg-brand-600 text-white"
                    : s.tone === "event"
                    ? "bg-amber-100 text-amber-700"
                    : s.tone === "framework"
                    ? "bg-brand-50 text-brand-700"
                    : "bg-orange-50 text-orange-700"
                }`}
              >
                {st === "active" && (
                  <span
                    className={`absolute inset-0 animate-ping rounded-full ${
                      s.tone === "event" ? "bg-amber-400/50" : "bg-brand-400/50"
                    }`}
                  />
                )}
                <span className="relative">{i + 1}</span>
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.68rem] font-bold ${
                      s.lane === "轮询"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-brand-50 text-brand-700"
                    }`}
                  >
                    {s.lane}
                  </span>
                  <span className="text-[0.9rem] font-bold text-ink">{s.t}</span>
                </span>
                <span className="mt-0.5 block text-[0.8rem] leading-relaxed text-muted">{s.s}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PlayBtn onClick={play}>播放对比</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="text-[0.78rem] text-muted">默认全亮＝静态兜底。</span>
      </div>
    </div>
  );
}

/* 点式动画 ③ · 回调里死等：一个人堵住整条队 */
const BLOCK_STEPS = [
  { no: "1", title: "事件 A 到达", sub: "框架调用回调" },
  { no: "2", title: "回调里 delay(1000)", sub: "整个框架跟着等" },
  { no: "3", title: "事件 B 到达", sub: "没人接，只能排队或丢失" },
  { no: "4", title: "回调终于返回", sub: "响应已经晚了" },
];

function BlockingTimeline() {
  const { statuses, play, reset, jump } = useSequence(BLOCK_STEPS.length);
  return (
    <div className="surface border-red-200 p-4 md:p-5">
      <div className="mb-2 flex items-center gap-2">
        <Pill tone="bad">错误示范 · 回调里死等</Pill>
      </div>
      <div className="flex flex-col md:flex-row md:items-stretch">
        {BLOCK_STEPS.map((s, i) => {
          const st = statuses[i];
          return (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => jump(i)}
                title={`跳到第 ${i + 1} 步`}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors duration-500 md:flex-col md:gap-2 md:py-3.5 md:text-center ${NODE_TONE.bad[st]}`}
              >
                <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-current text-[0.9rem] font-bold md:h-10 md:w-10">
                  {st === "active" && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-red-400/50" />
                  )}
                  <span className="relative">{s.no}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-bold leading-tight md:text-[0.95rem]">
                    {s.title}
                  </span>
                  <span className="block text-[0.76rem] leading-tight opacity-80 md:text-[0.8rem]">
                    {s.sub}
                  </span>
                </span>
              </button>
              {i < BLOCK_STEPS.length - 1 && (
                <span className="ml-[1.15rem] h-3 w-0.5 flex-none self-start rounded-full bg-red-300 md:ml-1 md:mr-1 md:h-0.5 md:w-5 md:self-center" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PlayBtn onClick={play}>播放堵塞过程</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="text-[0.78rem] text-muted">默认全亮＝静态兜底；红色只代表「错误示范」。</span>
      </div>
      <p className="mt-2.5 border-t border-line pt-2.5 text-[0.84rem] font-bold text-ink">
        正确做法：回调只置标志 → 马上返回 → 主循环慢慢处理。
      </p>
    </div>
  );
}

/* 静态流程图：横向步骤条 */
function FlowStrip({ items, note }) {
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {items.map((s, i) => (
          <React.Fragment key={i}>
            <div
              className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-3 py-2.5 md:flex-col md:gap-1.5 md:text-center ${
                s.side === "verify"
                  ? "border-emerald-300 bg-emerald-50"
                  : s.side === "board"
                  ? "border-brand-300 bg-brand-50"
                  : "border-amber-300 bg-amber-50"
              }`}
            >
              <span
                className={`grid h-8 w-8 flex-none place-items-center rounded-full text-[0.82rem] font-bold text-white ${
                  s.side === "verify" ? "bg-good" : s.side === "board" ? "bg-brand-600" : "bg-warn2"
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.88rem] font-bold leading-tight text-ink">{s.t}</span>
                <span className="block text-[0.75rem] leading-tight text-muted">{s.s}</span>
              </span>
            </div>
            {i < items.length - 1 && (
              <span className="ml-[1rem] h-3 w-0.5 flex-none self-start rounded-full bg-line md:ml-1 md:mr-1 md:h-0.5 md:w-5 md:self-center" />
            )}
          </React.Fragment>
        ))}
      </div>
      {note && <p className="mt-2.5 border-t border-line pt-2.5 text-[0.8rem] text-muted">{note}</p>}
    </div>
  );
}

/* 概念地图：5 个最小概念 */
function ConceptMap() {
  const nodes = [
    { t: "变量", fill: "#eff8ff", stroke: "#93cdfb", color: "#1a5cae" },
    { t: "条件", fill: "#eff8ff", stroke: "#93cdfb", color: "#1a5cae" },
    { t: "循环", fill: "#eff8ff", stroke: "#93cdfb", color: "#1a5cae" },
    { t: "函数", fill: "#eff8ff", stroke: "#93cdfb", color: "#1a5cae" },
    { t: "回调", fill: "#fff7ed", stroke: "#fdba74", color: "#b45309" },
  ];
  return (
    <div className="surface p-3 md:p-4">
      <svg
        viewBox="0 0 900 140"
        role="img"
        aria-label="五个最小概念：变量、条件、循环、函数、回调。前四个是积木，回调是让积木在正确时机自动启动的开关。"
        className="h-auto w-full"
      >
        <defs>
          <marker id="cm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
        {nodes.map((n, i) => {
          const x = 10 + i * 180;
          return (
            <g key={n.t}>
              <rect x={x} y="24" width="160" height="82" rx="16" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
              <text x={x + 80} y="60" textAnchor="middle" fill={n.color} fontSize="16" fontWeight="700">
                {`0${i + 1}`}
              </text>
              <text x={x + 80} y="88" textAnchor="middle" fill="#0f172a" fontSize="26" fontWeight="800">
                {n.t}
              </text>
              {i < nodes.length - 1 && (
                <line x1={x + 164} y1="65" x2={x + 174} y2="65" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#cm-arrow)" />
              )}
            </g>
          );
        })}
        <text x="450" y="132" textAnchor="middle" fill="#64748b" fontSize="15">
          前四个是积木，回调是让积木在正确时机自动启动的开关
        </text>
      </svg>
    </div>
  );
}

/* 变量：贴了名字的盒子 */
function VariableDiagram() {
  return (
    <div className="surface p-3 md:p-4">
      <svg
        viewBox="0 0 900 220"
        role="img"
        aria-label="变量 speed 是一个盒子，里面放着 200；调用 setMotorSpeed(speed) 时，三处都读同一个盒子，改 speed 一次就三处一起变。"
        className="h-auto w-full"
      >
        <rect x="18" y="38" width="272" height="140" rx="16" fill="#eff8ff" stroke="#60b0f7" strokeWidth="2" />
        <text x="154" y="72" textAnchor="middle" fill="#1a5cae" fontSize="18" fontWeight="700">
          盒子名：speed
        </text>
        <text x="154" y="138" textAnchor="middle" fill="#0f172a" fontSize="48" fontWeight="800">
          200
        </text>
        <line x1="290" y1="108" x2="344" y2="108" stroke="#0ea5a3" strokeWidth="3" markerEnd="url(#vd-arrow)" />
        <defs>
          <marker id="vd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0ea5a3" />
          </marker>
        </defs>
        <rect x="354" y="38" width="528" height="140" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <text x="380" y="72" fill="#334155" fontSize="18" fontWeight="700">
          用到它的地方
        </text>
        <text x="380" y="104" fill="#0f172a" fontSize="20" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          setMotorSpeed(speed)
        </text>
        <text x="380" y="132" fill="#0f172a" fontSize="20" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          setMotorSpeed(speed)
        </text>
        <text x="380" y="160" fill="#0f172a" fontSize="20" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          setMotorSpeed(speed)
        </text>
        <text x="450" y="206" textAnchor="middle" fill="#0f8a5f" fontSize="17" fontWeight="700">
          改 speed 一次，三处一起变
        </text>
      </svg>
    </div>
  );
}

/* 条件：红绿灯式二选一 */
function ConditionDiagram() {
  return (
    <div className="surface p-3 md:p-4">
      <svg
        viewBox="0 0 900 240"
        role="img"
        aria-label="条件判断：前方有障碍？是就走上方「停」，否就走下方「前进」。"
        className="h-auto w-full"
      >
        <defs>
          <marker id="cd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
        <rect x="24" y="76" width="270" height="88" rx="16" fill="#eff8ff" stroke="#60b0f7" strokeWidth="2" />
        <text x="159" y="112" textAnchor="middle" fill="#1a5cae" fontSize="20" fontWeight="700">
          前方有障碍？
        </text>
        <text x="159" y="140" textAnchor="middle" fill="#64748b" fontSize="15">
          答案只有：真 / 假
        </text>
        <line x1="294" y1="96" x2="600" y2="60" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#cd-arrow)" />
        <text x="420" y="66" textAnchor="middle" fill="#b4690e" fontSize="17" fontWeight="700">
          是
        </text>
        <line x1="294" y1="144" x2="600" y2="180" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#cd-arrow)" />
        <text x="420" y="178" textAnchor="middle" fill="#0f8a5f" fontSize="17" fontWeight="700">
          否
        </text>
        <rect x="612" y="24" width="260" height="72" rx="16" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="742" y="58" textAnchor="middle" fill="#b91c1c" fontSize="20" fontWeight="800">
          停
        </text>
        <text x="742" y="80" textAnchor="middle" fill="#7f1d1d" fontSize="14">
          stop()
        </text>
        <rect x="612" y="144" width="260" height="72" rx="16" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
        <text x="742" y="178" textAnchor="middle" fill="#047857" fontSize="20" fontWeight="800">
          前进
        </text>
        <text x="742" y="200" textAnchor="middle" fill="#065f46" fontSize="14">
          forward()
        </text>
      </svg>
    </div>
  );
}

/* 循环：读 → 判断 → 动作 → 回到开头 */
function LoopDiagram() {
  return (
    <div className="surface p-3 md:p-4">
      <svg
        viewBox="0 0 900 250"
        role="img"
        aria-label="循环：读传感器、判断、动作，然后回到开头继续下一轮。"
        className="h-auto w-full"
      >
        <defs>
          <marker id="ld-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#1f72d6" />
          </marker>
        </defs>
        {[
          { x: 30, t: "读传感器", s: "distance = read()" },
          { x: 340, t: "做判断", s: "if distance < 30" },
          { x: 650, t: "做动作", s: "stop() / forward()" },
        ].map((b, i) => (
          <g key={b.t}>
            <rect x={b.x} y="44" width="220" height="88" rx="16" fill="#eff8ff" stroke="#93cdfb" strokeWidth="2" />
            <text x={b.x + 110} y="80" textAnchor="middle" fill="#1a5cae" fontSize="21" fontWeight="700">
              {b.t}
            </text>
            <text x={b.x + 110} y="108" textAnchor="middle" fill="#475569" fontSize="14" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
              {b.s}
            </text>
            {i < 2 && (
              <line x1={b.x + 224} y1="88" x2={b.x + 302} y2="88" stroke="#1f72d6" strokeWidth="2.5" markerEnd="url(#ld-arrow)" />
            )}
          </g>
        ))}
        <path
          d="M 760 136 L 760 208 L 140 208 L 140 140"
          fill="none"
          stroke="#1f72d6"
          strokeWidth="2.5"
          strokeDasharray="8 7"
          markerEnd="url(#ld-arrow)"
        />
        <text x="450" y="232" textAnchor="middle" fill="#1a5cae" fontSize="15" fontWeight="700">
          回到开头，继续下一轮
        </text>
      </svg>
    </div>
  );
}

/* 函数：输入 → 处理 → 输出 */
function FunctionDiagram() {
  return (
    <div className="surface p-3 md:p-4">
      <svg
        viewBox="0 0 900 220"
        role="img"
        aria-label="函数像配方：输入参数 speed=200，函数 setMotorSpeed 处理后，输出左右轮各 200。"
        className="h-auto w-full"
      >
        <defs>
          <marker id="fd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
        <rect x="20" y="58" width="220" height="96" rx="16" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
        <text x="130" y="90" textAnchor="middle" fill="#b45309" fontSize="16" fontWeight="700">
          输入 · 原料
        </text>
        <text x="130" y="124" textAnchor="middle" fill="#0f172a" fontSize="18" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          speed = 200
        </text>
        <line x1="244" y1="106" x2="320" y2="106" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#fd-arrow)" />
        <rect x="332" y="44" width="236" height="124" rx="16" fill="#eff8ff" stroke="#60b0f7" strokeWidth="2" />
        <text x="450" y="80" textAnchor="middle" fill="#1a5cae" fontSize="16" fontWeight="700">
          处理 · 函数
        </text>
        <text x="450" y="112" textAnchor="middle" fill="#0f172a" fontSize="17" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          setMotorSpeed()
        </text>
        <text x="450" y="142" textAnchor="middle" fill="#64748b" fontSize="14">
          按配方一步步做
        </text>
        <line x1="572" y1="106" x2="648" y2="106" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#fd-arrow)" />
        <rect x="660" y="58" width="220" height="96" rx="16" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
        <text x="770" y="90" textAnchor="middle" fill="#047857" fontSize="16" fontWeight="700">
          输出 · 结果
        </text>
        <text x="770" y="124" textAnchor="middle" fill="#0f172a" fontSize="17">
          左右轮各 200
        </text>
        <text x="450" y="204" textAnchor="middle" fill="#64748b" fontSize="15">
          输入 → 处理 → 输出：函数把一段动作打包，起个名字
        </text>
      </svg>
    </div>
  );
}

/* 回调骨架：注册 → 事件 → 框架调用 → 你的函数 */
function SkeletonDiagram() {
  const nodes = [
    { t: "注册函数", s: "把函数交给框架", fill: "#eff8ff", stroke: "#93cdfb", color: "#1a5cae" },
    { t: "事件发生", s: "按键 / 消息 / 定时", fill: "#fff7ed", stroke: "#fdba74", color: "#b45309" },
    { t: "框架调用", s: "框架替你叫函数", fill: "#eff8ff", stroke: "#93cdfb", color: "#1a5cae" },
    { t: "你的函数", s: "收下事件、马上返回", fill: "#fff7ed", stroke: "#fdba74", color: "#b45309" },
  ];
  return (
    <div className="surface p-3 md:p-4">
      <svg
        viewBox="0 0 900 150"
        role="img"
        aria-label="回调的共同骨架：先注册函数，事件发生时框架调用你的函数，你的函数处理完马上返回。"
        className="h-auto w-full"
      >
        <defs>
          <marker id="sd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
        {nodes.map((n, i) => {
          const x = 16 + i * 224;
          return (
            <g key={n.t}>
              <rect x={x} y="30" width="190" height="88" rx="16" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
              <text x={x + 95} y="64" textAnchor="middle" fill={n.color} fontSize="20" fontWeight="800">
                {n.t}
              </text>
              <text x={x + 95} y="94" textAnchor="middle" fill="#475569" fontSize="13">
                {n.s}
              </text>
              {i < nodes.length - 1 && (
                <line x1={x + 194} y1="74" x2={x + 216} y2="74" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#sd-arrow)" />
              )}
            </g>
          );
        })}
        <text x="450" y="142" textAnchor="middle" fill="#64748b" fontSize="14">
          板子侧叫「中断回调」，电脑侧叫「订阅回调」——骨架完全一样
        </text>
      </svg>
    </div>
  );
}

/* 记忆锚：两行对照 */
function MemoryDiagram() {
  const toneCls = (tone) =>
    tone === "user"
      ? "border-orange-300 bg-orange-50 text-orange-700"
      : tone === "framework"
      ? "border-brand-300 bg-brand-50 text-brand-700"
      : "border-amber-300 bg-amber-50 text-amber-700";
  const Row = ({ label, items }) => (
    <div className="surface p-3 md:p-4">
      <p className="mb-2 text-[0.78rem] font-bold tracking-wide text-muted">{label}</p>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {items.map((it, i) => (
          <React.Fragment key={it.t}>
            <div className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-center text-[0.9rem] font-bold ${toneCls(it.tone)}`}>
              {it.t}
              {it.s && <span className="mt-0.5 block text-[0.72rem] font-medium opacity-80">{it.s}</span>}
            </div>
            {i < items.length - 1 && (
              <ArrowRight size={18} className="mx-auto flex-none rotate-90 text-muted md:rotate-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  return (
    <div className="space-y-3">
      <Row
        label="① 我来调：函数是我主动叫的"
        items={[
          { t: "我", s: "写代码的人", tone: "user" },
          { t: "调用函数", s: "setMotorSpeed(200)", tone: "user" },
          { t: "函数执行", s: "按配方干活", tone: "user" },
        ]}
      />
      <Row
        label="② 他来调：事件发生，框架叫我的函数"
        items={[
          { t: "事件", s: "按键 / 消息 / 定时", tone: "event" },
          { t: "框架", s: "Arduino / ROS 2", tone: "framework" },
          { t: "回调函数", s: "我写，框架调", tone: "user" },
        ]}
      />
    </div>
  );
}

/* 收尾路线：本册 → 下一册 → 整车 */
const ROADMAP = [
  { side: "tool", t: "本册 · 第 0 册", s: "5 个最小概念" },
  { side: "board", t: "ESP32 与 ROS 2 开发基础", s: "板子 + 通信 + 系统" },
  { side: "verify", t: "智能救援 / 搬运", s: "整车与竞赛" },
];

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      先修课 · 第 0 册 · 零基础
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      编程不可怕：
      <br />
      <span className="text-brand-600">会照着改，就先成功一半</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      本册只讲 5 个最小概念：变量、条件、循环、函数、回调。先会读、会改、会看现象，
      再回头补原理；不要求你从零写完整程序。
    </p>
    <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
      {["变量", "条件", "循环", "函数", "回调"].map((t, i) => (
        <span
          key={t}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.82rem] font-bold ${
            i === 4 ? "border-amber-300 bg-amber-50 text-amber-700" : "border-brand-200 bg-brand-50 text-brand-700"
          }`}
        >
          <span className="tnum text-[0.7rem] opacity-70">{`0${i + 1}`}</span>
          {t}
        </span>
      ))}
    </div>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      建议在《ESP32 与 ROS 2 开发基础》之前学；每页默认只留要点，完整解释见文字版教程。
    </p>
  </div>
);

const Tldr = () => (
  <Frame
    kicker="概览"
    floor="02"
    title="先抓 5 个概念：其余用到再查"
    lead="机器人程序再复杂，也是这 5 样拼起来的；先认出它们、会改参数，再补语法细节。"
  >
    <div className="space-y-4">
      <ConceptMap />
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { n: "01", t: "变量", s: "存一个值，起个名字", tone: "brand" },
          { n: "02", t: "条件", s: "真 / 假，二选一", tone: "brand" },
          { n: "03", t: "循环", s: "同一段反复做", tone: "brand" },
          { n: "04", t: "函数", s: "把动作打包，给参数", tone: "brand" },
          { n: "05", t: "回调", s: "事件来了，框架叫你", tone: "warn" },
        ].map((c) => (
          <div
            key={c.n}
            className={`surface p-3.5 md:p-4 ${c.tone === "warn" ? "border-amber-300 bg-amber-50/60" : ""}`}
          >
            <p className={`tnum text-[0.72rem] font-bold ${c.tone === "warn" ? "text-amber-700" : "text-brand-600"}`}>
              {c.n}
            </p>
            <p className="mt-1 text-[1rem] font-extrabold text-ink">{c.t}</p>
            <p className="mt-0.5 text-[0.82rem] leading-relaxed text-muted">{c.s}</p>
          </div>
        ))}
      </div>
      <Quote>先会读、会改，再补原理；本册不要求你从零写完整程序。</Quote>
    </div>
  </Frame>
);

const VariablePage = () => (
  <Frame
    kicker="基础概念"
    floor="03"
    title="变量＝贴了名字的盒子：改一处，处处跟着变"
    lead="speed = 200 把 200 放进名为 speed 的盒子；以后要用速度，就写 speed，不再到处抄 200。"
  >
    <div className="space-y-4">
      <VariableDiagram />
      <Grid cols={2}>
        <Card title="为什么名字比数字好改" icon={Box}>
          程序里出现 20 次 <code>200</code>，改速度要改 20 处；写成 <code>speed</code>，只改盒子里的值一次，所有用到它的地方一起变。
        </Card>
        <Card title="两个符号别混" icon={AlertTriangle} tone="warn">
          <code>=</code> 是「放进去」（赋值）；<code>==</code> 是「问相不相等」（比较）。初学者最常见的错，就是把判断里的 <code>==</code> 写成了 <code>=</code>。
        </Card>
      </Grid>
      <Pre>{`speed = 200          # 把 200 放进 speed 这个盒子
setMotorSpeed(speed) # 用盒子里的值，而不是再写一遍 200`}</Pre>
      <Steps title="展开：变量命名的三个小习惯">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>名字写「它是什么」：<code>speed</code>、<code>distance</code>、<code>threshold</code>、<code>stop_flag</code>。</li>
          <li>同一个名字只放一类值：速度别一会儿放 200，一会儿放「前方有障碍」。</li>
          <li>先赋值再使用：盒子还没放东西就读，程序会报错或读到奇怪的值。</li>
        </ul>
      </Steps>
      <Quote>变量不是数学里的 x，它是你给机器留的一个可改的旋钮。</Quote>
    </div>
  </Frame>
);

const ConditionPage = () => (
  <Frame
    kicker="基础概念"
    floor="04"
    title="条件＝红绿灯：如果…就…否则…"
    lead="条件只回答一个问题：真，还是假。真就走一条路，假就走另一条路。"
  >
    <div className="space-y-4">
      <ConditionDiagram />
      <Pre>{`if distance < 30:
    stop()
else:
    forward()`}</Pre>
      <Grid cols={2}>
        <Card title="读法：如果…就…否则…" icon={GitBranch}>
          「如果 距离小于 30，就 停；否则 前进。」把代码读成一句人话，比逐字背语法有用。
        </Card>
        <Card title="缩进就是范围" icon={ListChecks} tone="warn">
          缩进的行属于 <code>if</code>；没缩进的行已经出了判断。新手常犯的错，是把「不管怎样都要做」的动作缩进了 <code>if</code> 里面。
        </Card>
      </Grid>
      <div className="flex flex-wrap items-center gap-2 text-[0.82rem] text-muted">
        <Pill tone="brand">{"< 小于"}</Pill>
        <Pill tone="brand">{"> 大于"}</Pill>
        <Pill tone="brand">{"== 等于"}</Pill>
        <Pill tone="brand">{"!= 不等于"}</Pill>
        <span>先比较，再决定走哪条路。</span>
      </div>
      <Quote>条件不是「让机器思考」，而是你提前替它把两条路都写好。</Quote>
    </div>
  </Frame>
);

const LoopPage = () => (
  <Frame
    kicker="基础概念"
    floor="05"
    title="循环＝重复做：机器人程序几乎都住在循环里"
    lead="传感器每时每刻都在变，程序不能跑一遍就结束；读 → 判断 → 动作，一轮接一轮。"
  >
    <div className="space-y-4">
      <LoopDiagram />
      <Pre>{`while True:
    distance = read_distance()
    if distance < 30:
        stop()
    else:
        forward()`}</Pre>
      <Grid cols={3}>
        <Card title="为什么必须循环" icon={Repeat}>
          机器人要一直值班：这次没障碍，不代表下一秒也没有。
        </Card>
        <Card title="一轮只做一轮的事" icon={Workflow}>
          读一次、判断一次、动作一次；下一轮重新读，不要拿旧数据做新决定。
        </Card>
        <Card title="循环里别死等" icon={Timer} tone="warn">
          长 <code>delay()</code> 或长循环会让机器人「看不见」这段时间；要等，也用状态机而不是堵住。
        </Card>
      </Grid>
      <Quote>机器人不是做完一次就下班，它要一直值班。</Quote>
    </div>
  </Frame>
);

const FunctionPage = () => (
  <Frame
    kicker="基础概念"
    floor="06"
    title="函数＝配方：给原料，按步骤做，交出结果"
    lead="把一段常用动作打包，起个名字；以后给不同的原料，就能重复用。现在只要会调用、会改参数。"
  >
    <div className="space-y-4">
      <FunctionDiagram />
      <Pre>{`def setMotorSpeed(speed):
    left_motor.run(speed)
    right_motor.run(speed)

setMotorSpeed(200)   # 调用：把 200 作为原料交给函数`}</Pre>
      <Grid cols={2}>
        <Card title="三个词就够" icon={FunctionIcon}>
          函数名（做什么）、参数（给什么）、返回值（交出什么）。本册先盯前两个。
        </Card>
        <Card title="现在只要求两件事" icon={CheckCircle2} tone="good">
          会调用（写对名字和括号）、会改参数（把 200 改成 100）；函数体先照抄，不要求你独立写。
        </Card>
      </Grid>
      <Quote>函数我来调——这是全册口诀的前半句。</Quote>
    </div>
  </Frame>
);

/* lucide 没有稳定的函数图标时，用 Code2 代替，避免版本差异 */
function FunctionIcon(props) {
  return <Code2 {...props} />;
}

const Callback1 = () => (
  <Frame
    kicker="回调"
    floor="07"
    title="回调：不是你调它，是事件来叫它"
    lead="门铃响 → 你起身 → 开门。代码里：事件发生 → 框架调用你写好的函数。你只负责写函数，不负责盯着。"
    wide
  >
    <div className="space-y-4">
      <CallbackTimeline />
      <Grid cols={2}>
        <Card title="门铃类比" icon={Bell} tone="warn">
          门铃＝事件；你起身＝框架调用；开门＝你的函数。你不是一直站在门口问「有人吗」——那是轮询。
        </Card>
        <Card title="代码里的三个角色" icon={MousePointerClick}>
          <Pre>{`def on_button():      # 你写的函数
    pressed = True

register(on_button)   # 交给框架登记
# 事件来了，框架替你调 on_button()`}</Pre>
        </Card>
      </Grid>
      <Quote>函数我来调，回调他来调——事件一到，框架叫你。</Quote>
    </div>
  </Frame>
);

const Callback2 = () => (
  <Frame
    kicker="回调"
    floor="08"
    title="回调 vs 轮询：一个等通知，一个一直问"
    lead="两种方式都能拿到数据，区别在「谁掌握节奏」：你一直问，还是事件到了叫你。"
    wide
  >
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <PollCallbackAnim />
        <DataTable
          head={["维度", "轮询", "回调"]}
          widths={["18%", "41%", "41%"]}
          rows={[
            ["响应速度", "看问的间隔；间隔长就慢", "事件一到就叫，通常更快"],
            ["CPU 占用", "一直问，没事也白转", "没事时不占，事件来了才跑"],
            ["写法难度", "直白：一个循环问到底", "要多想一步：函数谁来调"],
            ["适用场景", "简单脚本、状态变化慢、教学演示", "按键、串口、传感器中断、ROS 2 订阅"],
          ]}
        />
      </div>
      <Quote>轮询不是错，只是要看场合；按键、串口、ROS 2 订阅更适合回调。</Quote>
      <div className="flex flex-wrap items-center gap-2 text-[0.84rem] text-muted">
        <Pill tone="warn">轮询：一直问到了吗</Pill>
        <ArrowRight size={16} />
        <Pill tone="brand">回调：到了会通知你</Pill>
      </div>
    </div>
  </Frame>
);

const Callback3 = () => (
  <Frame
    kicker="回调"
    floor="09"
    title="同一个回调，两种现场：板子侧中断 / 电脑侧订阅"
    lead="名字不同，骨架一样：先注册函数，事件发生时框架调用它。蓝色是板子侧，橙色是电脑侧。"
    wide
  >
    <div className="space-y-4">
      <SkeletonDiagram />
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="板子侧 · Arduino 中断" icon={Cpu} tone="brand">
          <p className="mb-2">
            引脚电平一变就触发中断；<code>onButton</code> 是你写的回调，中断控制器替你调用。
          </p>
          <Pre>{`attachInterrupt(
  digitalPinToInterrupt(2),
  onButton,
  FALLING);

void onButton() {
  pressed = true;   // 只置标志，马上返回
}`}</Pre>
        </Card>
        <Card title="电脑侧 · ROS 2 订阅" icon={Monitor} tone="warn">
          <p className="mb-2">
            话题来消息就触发订阅回调；执行器（executor）替你调用 <code>on_cmd</code>。定时器回调也是同一骨架。
          </p>
          <Pre>{`self.create_subscription(
  String, 'cmd', self.on_cmd, 10)

def on_cmd(self, msg):
    self.last = msg.data

self.create_timer(0.5, self.on_timer)`}</Pre>
        </Card>
      </div>
      <div className="surface flex flex-col gap-2 p-3.5 text-[0.86rem] md:flex-row md:items-center md:justify-between md:p-4">
        <span className="font-bold text-ink">同一骨架：注册 → 事件 → 框架调用 → 你的函数</span>
        <ToneLegend />
      </div>
      <Quote>板子侧叫「中断回调」，电脑侧叫「订阅回调」；换的是现场，不换的是「框架替你叫函数」。</Quote>
    </div>
  </Frame>
);

const PitfallPage = () => (
  <Frame
    kicker="回调"
    floor="10"
    title="回调的坑：别在里面死等"
    lead="回调不是「你的私人函数」，它运行在框架的线程 / 循环里；你一堵，别人也走不动。"
    wide
  >
    <div className="space-y-4">
      <BlockingTimeline />
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="错误写法：回调里 delay" icon={Ban} tone="bad">
          <Pre>{`void onButton() {
  delay(1000);       // 框架被卡住 1 秒
  motor.stop();
}`}</Pre>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
            这 1 秒里，别的按键、串口数据、定时器都可能被耽误；事件越多，堵得越明显。
          </p>
        </Card>
        <Card title="正确写法：只置标志" icon={CheckCircle2} tone="good">
          <Pre>{`volatile bool stopFlag = false;

void onButton() {
  stopFlag = true;   // 只记一笔，马上返回
}

void loop() {
  if (stopFlag) {
    motor.stop();
    stopFlag = false;
  }
}`}</Pre>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
            重活交给主循环；ROS 2 里同理：回调只存消息 / 置标志，处理放到定时器或主循环。
          </p>
        </Card>
      </div>
      <Grid cols={2}>
        <Card title="三条红线" icon={AlertTriangle} tone="warn">
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            <li>不 <code>delay()</code> / <code>sleep()</code>；</li>
            <li>不写长时间 <code>for</code> / <code>while</code>；</li>
            <li>不在回调里做慢速网络请求或大段打印。</li>
          </ul>
        </Card>
        <Card title="一句话记法" icon={Zap} tone="brand">
          回调只做三件事：<b>收下、记下、马上返回</b>。剩下的交给主循环或状态机。
        </Card>
      </Grid>
      <Quote>回调里死等，堵住的不是你自己，是整个框架。</Quote>
    </div>
  </Frame>
);

const MemoryPage = () => (
  <Frame
    kicker="收尾"
    floor="11"
    title="记住一句话：函数我来调，回调他来调"
    lead="把抽象概念压成三个钩子：一句口诀、一个门铃、四种颜色；考场先想起钩子，再顺出知识。"
  >
    <div className="space-y-4">
      <MemoryDiagram />
      <Grid cols={3}>
        <Card title="口诀" icon={BookOpen} tone="brand">
          <p className="text-[1.02rem] font-extrabold text-ink">函数我来调，回调他来调。</p>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">
            我主动写名字调用的是函数；事件来了由框架调用的是回调。
          </p>
        </Card>
        <Card title="生活化类比" icon={Bell} tone="warn">
          <p className="text-[1.02rem] font-extrabold text-ink">门铃响，你起身，开门。</p>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">
            门铃＝事件，起身＝框架调用，开门＝你的回调函数。不是一直站门口问「有人吗」。
          </p>
        </Card>
        <Card title="颜色编码" icon={Palette} tone="good">
          <div className="space-y-1.5 text-[0.86rem]">
            <p><span className="mr-2 inline-block h-3 w-3 rounded bg-brand-600 align-middle" />蓝＝框架 / 板子侧</p>
            <p><span className="mr-2 inline-block h-3 w-3 rounded bg-warn2 align-middle" />橙＝你写的代码 / 电脑侧</p>
            <p><span className="mr-2 inline-block h-3 w-3 rounded bg-amber-400 align-middle" />黄＝事件</p>
            <p><span className="mr-2 inline-block h-3 w-3 rounded bg-good align-middle" />绿＝验证通过</p>
          </div>
        </Card>
      </Grid>
      <div className="surface border-amber-300 bg-amber-50/70 p-4 text-center md:p-5">
        <p className="text-[1.05rem] font-extrabold text-ink md:text-[1.2rem]">
          函数我来调，回调他来调；门铃一响，框架叫你。
        </p>
      </div>
      <Quote>先想起钩子，再说出定义——这比逐字背概念更稳。</Quote>
    </div>
  </Frame>
);

const DecisionPage = () => (
  <Frame
    kicker="对比决策"
    floor="12"
    title="先背语法，还是先跑通再回头补？"
    lead="零基础最容易卡在「想先把语法学完再动手」。先看清两条路的取舍，再决定今天怎么学。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["维度", "先背语法", "先跑通再回头补"]}
        widths={["16%", "42%", "42%"]}
        rows={[
          ["起步速度", "慢：要背完才敢动", "快：当天就能看到现象"],
          ["记忆效果", "脱离场景，容易忘", "挂在现象上，记得住"],
          ["遇到新问题", "容易卡在「这个没学过」", "会查、会改、会验证"],
          ["适合人群", "有考试大纲、时间充裕、要系统打底", "零基础、项目驱动、先建立信心"],
          ["主要风险", "背完不会用，挫败感高", "基础不牢，需要安排回头补"],
        ]}
      />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
          <p className="text-[1rem] font-extrabold text-ink">路径 A：先背语法</p>
          <p className="mt-1 text-[0.82rem] font-semibold text-brand-700">适合「考试默写 + 长期系统学习」</p>
          <ul className="mt-2.5 space-y-1.5 text-[0.88rem] leading-relaxed text-slateink">
            <li>先把变量、条件、循环、函数的定义和写法背熟。</li>
            <li>再做小练习，最后才拼完整程序。</li>
            <li>好处是体系完整；风险是零基础容易在起步阶段掉队。</li>
          </ul>
        </div>
        <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
          <p className="text-[1rem] font-extrabold text-ink">路径 B：先跑通再回头补</p>
          <p className="mt-1 text-[0.82rem] font-semibold text-warn2">本课程立场：先跑通、边做边补</p>
          <ul className="mt-2.5 space-y-1.5 text-[0.88rem] leading-relaxed text-slateink">
            <li>先抄一段能跑的代码，改一个数，看现象变化。</li>
            <li>每跑通一次，回头补一个概念；概念挂在现象上。</li>
            <li>好处是信心和手感先建立；风险是别停在「能跑就行」。</li>
          </ul>
        </div>
      </div>
      <div className="surface flex items-start gap-3 border-brand-300 bg-brand-50 p-4">
        <Search size={18} className="mt-0.5 flex-none text-brand-700" />
        <div>
          <p className="text-[0.95rem] font-bold text-ink">引导问题：你今天的硬目标是哪一种？</p>
          <p className="mt-1 text-[0.88rem] leading-relaxed text-slateink">
            要考试默写 → 先背语法；要让轮子转起来、让消息通 → 先跑通最小闭环，再回头补。
            本课程选后者：先有现象，再有概念。
          </p>
        </div>
      </div>
      <Quote>先跑通、边做边补；每跑通一次，回头补一个概念。</Quote>
    </div>
  </Frame>
);

const ActionsPage = () => (
  <Frame
    kicker="收尾"
    floor="13"
    title="今天就能做的 3 件事：抄一段、改一个数、看它变"
    lead="不需要先学完语法。今天只做三个动作，把「看懂了」变成「我改了，它真的变了」。"
    wide
  >
    <div className="space-y-4">
      <FlowStrip
        items={[
          { side: "tool", t: "抄一段", s: "照着抄，不要求默写" },
          { side: "tool", t: "改一个数", s: "一次只改一个地方" },
          { side: "verify", t: "看它变", s: "记录改前 / 改后" },
        ]}
        note="顺序固定：先有能跑的，再改，再看现象；不要一上来就重写。"
      />
      <Grid cols={3}>
        <Card title="① 抄一段" icon={ClipboardList} tone="brand">
          把下面的伪代码抄进编辑器，先让它不报错；抄的时候把每一行读成一句人话。
        </Card>
        <Card title="② 改一个数" icon={Wrench} tone="warn">
          把 <code>speed = 200</code> 改成 100 或 300，把 <code>distance &lt; 30</code> 改成 50；一次只改一个。
        </Card>
        <Card title="③ 看它变" icon={CheckCircle2} tone="good">
          记录「改前 / 改后」各一句：哪一行改了、现象怎么变、为什么。能说出来才算跑通。
        </Card>
      </Grid>
      <Pre>{`speed = 200
stop_flag = False

def on_button():        # 回调：事件来了框架叫你
    stop_flag = True

register(on_button)     # 先登记，等事件

while True:             # 循环：一直值班
    distance = read_distance()
    if stop_flag or distance < 30:   # 条件：真 / 假
        stop()
    else:
        setMotorSpeed(speed)         # 函数：给参数`}</Pre>
      <p className="text-[0.84rem] leading-relaxed text-muted">
        上面是伪代码，能读懂每一行就够；下一册会把它变成真实的板子程序与 ROS 2 节点。
      </p>
      <Quote>把「看懂了」变成「我改了，它真的变了」——这一步跨过去，编程就入门了。</Quote>
    </div>
  </Frame>
);

const Closing = () => (
  <Frame
    kicker="收尾"
    floor="14"
    title="下一步：把这 5 个概念带进真实的板子与 ROS 2"
    lead="本册只建立最小概念；下一册用真实硬件把它们跑起来：点灯、联网、发消息、接 ROS 2。"
    wide
  >
    <div className="space-y-5">
      <Quote>函数我来调，回调他来调——门铃一响，框架叫你。</Quote>
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <Card title="下一册：ESP32 与 ROS 2 开发基础" icon={GraduationCap} tone="brand">
          48 学时职业本科课程：三块 ESP32-S3 / 掌机经 WiFi 接入 ROS 2，把变量、条件、循环、函数、回调
          放进真实的点灯、通信与订阅里。
        </Card>
        <Card title="本册文字版教程" icon={Download} tone="good">
          <p>
            下载：{" "}
            <a
              className="font-semibold text-brand-700 underline break-all"
              href="./files/编程零基础起步-文字版教程.md"
            >
              files/编程零基础起步-文字版教程.md
            </a>
          </p>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
            与 deck 同源，含完整解释、mermaid 图、代码对照与行动清单；离线可读。
          </p>
        </Card>
        <Card title="仓库里的位置" icon={FolderTree}>
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            <li>成品：<code>教学webppt/编程零基础起步/index.html</code></li>
            <li>源码：<code>教学webppt/编程零基础起步/presentation/</code></li>
            <li>图文要点：<code>docs/编程零基础起步.md</code></li>
            <li>文字版：<code>教学webppt/编程零基础起步/files/</code></li>
          </ul>
        </Card>
        <Card title="五分钟自测" icon={ListChecks} tone="warn">
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            <li>变量：<code>speed = 200</code> 的盒子名和值各是什么？</li>
            <li>条件：<code>if distance &lt; 30</code> 为真时走哪条路？</li>
            <li>循环：机器人为什么不能跑一遍就结束？</li>
            <li>函数：<code>setMotorSpeed(200)</code> 的原料是什么？</li>
            <li>回调：谁调用你写的回调函数？</li>
          </ul>
        </Card>
      </div>
      <FlowStrip items={ROADMAP} note="先有概念，再上板子；先跑通，再补原理。" />
      <p className="text-[0.86rem] text-muted">
        路径：<code>教学webppt/编程零基础起步/</code>（成品单文件 + <code>files/</code> 附件，离线可播）
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "五个概念", group: "概览", el: <Tldr /> },
  { nav: "变量", group: "基础概念", el: <VariablePage /> },
  { nav: "条件", group: "基础概念", el: <ConditionPage /> },
  { nav: "循环", group: "基础概念", el: <LoopPage /> },
  { nav: "函数", group: "基础概念", el: <FunctionPage /> },
  { nav: "回调时序", group: "回调", el: <Callback1 /> },
  { nav: "回调 vs 轮询", group: "回调", el: <Callback2 /> },
  { nav: "两种现场", group: "回调", el: <Callback3 /> },
  { nav: "回调的坑", group: "回调", el: <PitfallPage /> },
  { nav: "记忆锚", group: "收尾", el: <MemoryPage /> },
  { nav: "对比决策", group: "收尾", el: <DecisionPage /> },
  { nav: "行动清单", group: "收尾", el: <ActionsPage /> },
  { nav: "下载与延伸", group: "收尾", el: <Closing /> },
];

export default slides;
