import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  FolderTree,
  GitBranch,
  GraduationCap,
  Layers,
  ListChecks,
  Megaphone,
  MessageSquare,
  Phone,
  Play,
  Radio,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Target,
  Terminal,
  Timer,
  Truck,
  Undo2,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Steps, Pre } from "./components.jsx";

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
   蓝＝数据 / 硬件；橙＝请求 / 逻辑；绿＝完成 / 结果。 */
const NODE_TONE = {
  blue: {
    idle: "border-line bg-paper text-muted",
    on: "border-brand-300 bg-brand-50 text-brand-700",
    active: "border-brand-600 bg-brand-600 text-white",
    done: "border-brand-300 bg-brand-50 text-brand-700",
  },
  orange: {
    idle: "border-line bg-paper text-muted",
    on: "border-amber-300 bg-amber-50 text-warn2",
    active: "border-warn2 bg-warn2 text-white",
    done: "border-amber-300 bg-amber-50 text-warn2",
  },
  green: {
    idle: "border-line bg-paper text-muted",
    on: "border-emerald-300 bg-emerald-50 text-good",
    active: "border-good bg-good text-white",
    done: "border-emerald-300 bg-emerald-50 text-good",
  },
  red: {
    idle: "border-line bg-paper text-muted",
    on: "border-red-300 bg-red-50 text-bad",
    active: "border-bad bg-bad text-white",
    done: "border-red-300 bg-red-50 text-bad",
  },
};

const segClass = (tone, st) => {
  if (st === "idle") return "bg-line";
  if (tone === "green") return "bg-good";
  if (tone === "orange") return "bg-warn2";
  if (tone === "red") return "bg-bad";
  return "bg-brand-500";
};

const PingTone = (tone) => {
  if (tone === "orange") return "bg-amber-400/50";
  if (tone === "green") return "bg-emerald-400/50";
  if (tone === "red") return "bg-red-400/50";
  return "bg-brand-400/50";
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
      蓝＝数据 / 硬件
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-warn2" />
      橙＝请求 / 逻辑
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝完成 / 结果
    </span>
  </div>
);

function SeqNode({ status, tone, no, title, sub, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`跳到第 ${no} 步`}
      className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors duration-500 md:flex-col md:gap-1.5 md:py-3 md:text-center ${NODE_TONE[tone][status]} ${className}`}
    >
      <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-current text-[0.9rem] font-bold md:h-10 md:w-10">
        {status === "active" && (
          <span className={`absolute inset-0 animate-ping rounded-full ${PingTone(tone)}`} />
        )}
        <span className="relative">{no}</span>
      </span>
      <span className="min-w-0">
        <span className="block text-[0.9rem] font-bold leading-tight md:text-[0.95rem]">{title}</span>
        <span className="block text-[0.76rem] leading-tight opacity-80 md:text-[0.8rem]">{sub}</span>
      </span>
    </button>
  );
}

function Connector({ tone, status }) {
  return (
    <span
      className={`h-5 w-0.5 flex-none self-center rounded-full transition-colors duration-500 md:h-0.5 md:w-6 ${segClass(
        tone,
        status
      )}`}
    />
  );
}

/* 点式动画 ① · 话题广播：发布者 → 话题 → 两个订阅者 */
const TOPIC_STEPS = [
  { no: "1", tone: "blue", title: "发布者", sub: "Publisher：把消息丢上去" },
  { no: "2", tone: "blue", title: "话题", sub: "Topic：/camera/image_raw" },
  { no: "3", tone: "blue", title: "订阅者 A", sub: "Subscriber：图像显示" },
  { no: "4", tone: "blue", title: "订阅者 B", sub: "Subscriber：目标检测" },
];

function TopicBroadcast() {
  const { statuses, play, reset, jump } = useSequence(TOPIC_STEPS.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        <SeqNode
          status={statuses[0]}
          tone="blue"
          no="1"
          title="发布者"
          sub="Publisher：把消息丢上去"
          onClick={() => jump(0)}
          className="md:flex-1"
        />
        <Connector tone="blue" status={statuses[0]} />
        <SeqNode
          status={statuses[1]}
          tone="blue"
          no="2"
          title="话题"
          sub="Topic：/camera/image_raw"
          onClick={() => jump(1)}
          className="md:flex-1"
        />
        <Connector tone="blue" status={statuses[1]} />
        <div className="flex flex-col gap-2 md:flex-1">
          <SeqNode
            status={statuses[2]}
            tone="blue"
            no="3"
            title="订阅者 A"
            sub="图像显示"
            onClick={() => jump(2)}
          />
          <SeqNode
            status={statuses[3]}
            tone="blue"
            no="4"
            title="订阅者 B"
            sub="目标检测"
            onClick={() => jump(3)}
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PlayBtn onClick={play}>播放广播</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="text-[0.78rem] text-muted">点节点可手动跳到该步；默认全亮＝静态兜底。</span>
      </div>
      <p className="mt-2.5 border-t border-line pt-2.5 text-[0.86rem] font-bold text-ink">
        发布者发完就走；可以有 0 个、1 个或多个订阅者，它都不管。
      </p>
      <div className="mt-2">
        <ToneLegend />
      </div>
    </div>
  );
}

/* 点式动画 ② · 动作三段式：目标 → 反馈 → 结果 */
const ACTION_STEPS = [
  { no: "1", tone: "orange", title: "目标 goal", sub: "下单：导航到 A 点" },
  { no: "2", tone: "blue", title: "反馈 feedback", sub: "进度：已走 60%" },
  { no: "3", tone: "green", title: "结果 result", sub: "送达：到达 / 失败" },
];

function ActionStages() {
  const { statuses, play, reset, jump } = useSequence(ACTION_STEPS.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {ACTION_STEPS.map((s, i) => (
          <React.Fragment key={s.no}>
            <SeqNode
              status={statuses[i]}
              tone={s.tone}
              no={s.no}
              title={s.title}
              sub={s.sub}
              onClick={() => jump(i)}
              className="md:flex-1"
            />
            {i < ACTION_STEPS.length - 1 && <Connector tone={s.tone} status={statuses[i]} />}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PlayBtn onClick={play}>播放三段式</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[0.74rem] font-semibold text-bad">
          <Undo2 size={12} />
          中途可取消
        </span>
        <span className="text-[0.78rem] text-muted">默认全亮＝静态兜底。</span>
      </div>
      <p className="mt-2.5 border-t border-line pt-2.5 text-[0.86rem] font-bold text-ink">
        动作不是一次问答，而是一段有进度、可撤销的长任务。
      </p>
    </div>
  );
}

/* 点式动画 ③ · 判断流程：久不久 → 要不要答案 → 是不是通知数据 */
const DECISION_STEPS = [
  {
    q: "会持续很久吗？",
    yes: "动作（长活）",
    tone: "green",
    detail: "导航、抓取、长时间巡航",
  },
  {
    q: "需要明确答案吗？",
    yes: "服务（问答）",
    tone: "orange",
    detail: "查状态、校准、开关一次",
  },
  {
    q: "只是持续通知数据？",
    yes: "话题（广播）",
    tone: "blue",
    detail: "图像、激光、速度指令",
  },
];

function DecisionFlow() {
  const { statuses, play, reset, jump } = useSequence(DECISION_STEPS.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="space-y-2">
        {DECISION_STEPS.map((s, i) => (
          <React.Fragment key={s.q}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <SeqNode
                status={statuses[i]}
                tone={s.tone}
                no={String(i + 1)}
                title={s.q}
                sub={i < 2 ? "不是，就继续问下一行" : "是，就用话题"}
                onClick={() => jump(i)}
                className="md:flex-1"
              />
              <span className="inline-flex items-center justify-center gap-1 text-[0.76rem] font-bold text-warn2">
                是
                <ArrowRight size={15} className="rotate-90 md:rotate-0" />
              </span>
              <div
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-colors duration-500 ${NODE_TONE[s.tone][statuses[i]]}`}
              >
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full border-2 border-current text-[0.78rem] font-bold">
                  {s.tone === "green" ? <Truck size={15} /> : s.tone === "orange" ? <Phone size={15} /> : <Megaphone size={15} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-bold leading-tight">{s.yes}</span>
                  <span className="block text-[0.76rem] leading-tight opacity-80">{s.detail}</span>
                </span>
              </div>
            </div>
            {i < DECISION_STEPS.length - 1 && (
              <p className="pl-4 text-[0.78rem] font-semibold text-muted md:pl-[8.5rem]">
                否，继续问下一行 ↓
              </p>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PlayBtn onClick={play}>播放判断流程</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="text-[0.78rem] text-muted">按顺序问，命中即停；默认全亮＝静态兜底。</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 图示 */
const WhySvg = () => (
  <div className="surface p-3 md:p-4">
    <svg
      viewBox="0 0 860 230"
      role="img"
      aria-label="感知节点通过 sensor_msgs/Image 把图像送给决策节点，决策节点通过 geometry_msgs/Twist 把速度指令送给执行节点"
      className="h-auto w-full"
    >
      <defs>
        <marker id="why-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
        </marker>
      </defs>
      <text x="20" y="26" fontSize="14" fontWeight="700" fill="#0f172a">
        节点 = 只干一件事的小程序，靠消息协作
      </text>
      <text x="20" y="46" fontSize="11" fill="#64748b">
        它们可以在同一台电脑，也可以分布在树莓派、ESP32 与上位机上
      </text>
      <rect x="20" y="82" width="190" height="86" rx="14" fill="#eff8ff" stroke="#60b0f7" strokeWidth="2" />
      <text x="115" y="116" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1a5cae">感知节点</text>
      <text x="115" y="140" textAnchor="middle" fontSize="10.5" fill="#475569">摄像头、激光雷达</text>
      <rect x="335" y="82" width="190" height="86" rx="14" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
      <text x="430" y="116" textAnchor="middle" fontSize="14" fontWeight="800" fill="#b45309">决策节点</text>
      <text x="430" y="140" textAnchor="middle" fontSize="10.5" fill="#475569">规划、判断、选路</text>
      <rect x="650" y="82" width="190" height="86" rx="14" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
      <text x="745" y="116" textAnchor="middle" fontSize="14" fontWeight="800" fill="#047857">执行节点</text>
      <text x="745" y="140" textAnchor="middle" fontSize="10.5" fill="#475569">电机、舵机、灯</text>
      <line x1="214" y1="125" x2="328" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#why-arrow)" />
      <line x1="529" y1="125" x2="643" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#why-arrow)" />
      <text x="271" y="114" textAnchor="middle" fontSize="9.5" fill="#1a5cae">sensor_msgs/Image</text>
      <text x="586" y="114" textAnchor="middle" fontSize="9.5" fill="#b45309">geometry_msgs/Twist</text>
      <text x="430" y="210" textAnchor="middle" fontSize="11" fill="#64748b">
        节点之间不直接读对方内存；消息是唯一接口，所以格式必须约定好
      </text>
    </svg>
  </div>
);

const MessageSvg = () => (
  <div className="surface p-3 md:p-4">
    <svg
      viewBox="0 0 860 270"
      role="img"
      aria-label="消息像一张有格式的表格：geometry_msgs/Twist 含 linear 与 angular；发布者和订阅者类型一致才能通信，String 与 Twist 对不上就听不懂"
      className="h-auto w-full"
    >
      <defs>
        <marker id="msg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0f8a5f" />
        </marker>
      </defs>
      <text x="20" y="24" fontSize="14" fontWeight="700" fill="#0f172a">消息 = 有格式的表格：字段名 ＋ 类型</text>
      <rect x="20" y="42" width="410" height="196" rx="12" fill="#ffffff" stroke="#93cdfb" strokeWidth="2" />
      <rect x="20" y="42" width="410" height="42" rx="12" fill="#eff8ff" stroke="#93cdfb" strokeWidth="2" />
      <text x="225" y="69" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#1a5cae">geometry_msgs/Twist</text>
      <line x1="20" y1="108" x2="430" y2="108" stroke="#dde5ef" strokeWidth="1.5" />
      <line x1="20" y1="145" x2="430" y2="145" stroke="#dde5ef" strokeWidth="1.5" />
      <line x1="20" y1="182" x2="430" y2="182" stroke="#dde5ef" strokeWidth="1.5" />
      <text x="42" y="131" fontSize="11.5" fontWeight="700" fill="#334155">linear</text>
      <text x="250" y="131" fontSize="11.5" fill="#64748b">Vector3</text>
      <text x="42" y="168" fontSize="11.5" fontWeight="700" fill="#334155">angular</text>
      <text x="250" y="168" fontSize="11.5" fill="#64748b">Vector3</text>
      <text x="42" y="205" fontSize="11.5" fontWeight="700" fill="#334155">x / y / z</text>
      <text x="250" y="205" fontSize="11.5" fill="#64748b">float64</text>
      <rect x="480" y="42" width="150" height="56" rx="10" fill="#eff8ff" stroke="#60b0f7" strokeWidth="1.5" />
      <text x="555" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a5cae">发布者</text>
      <text x="555" y="84" textAnchor="middle" fontSize="9.5" fill="#475569">Twist</text>
      <rect x="690" y="42" width="150" height="56" rx="10" fill="#eff8ff" stroke="#60b0f7" strokeWidth="1.5" />
      <text x="765" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a5cae">订阅者</text>
      <text x="765" y="84" textAnchor="middle" fontSize="9.5" fill="#475569">Twist</text>
      <line x1="634" y1="70" x2="685" y2="70" stroke="#0f8a5f" strokeWidth="2" markerEnd="url(#msg-arrow)" />
      <text x="660" y="60" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0f8a5f">✓</text>
      <rect x="480" y="132" width="360" height="82" rx="10" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="660" y="158" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#b91c1c">类型对不上：String ≠ Twist</text>
      <text x="660" y="181" textAnchor="middle" fontSize="10" fill="#7f1d1d">订阅者“听不懂”，消息解析失败</text>
      <text x="660" y="201" textAnchor="middle" fontSize="9.5" fill="#7f1d1d">不是网络问题，是格式问题</text>
      <text x="430" y="258" textAnchor="middle" fontSize="10.5" fill="#64748b">
        类型名写法：包名 / 类型名，例如 geometry_msgs/Twist
      </text>
    </svg>
  </div>
);

const ServiceSvg = () => (
  <div className="surface p-3 md:p-4">
    <svg
      viewBox="0 0 860 270"
      role="img"
      aria-label="服务时序：客户端发出请求，服务端处理，再把应答返回客户端；调用后要等结果"
      className="h-auto w-full"
    >
      <defs>
        <marker id="srv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
        <marker id="srv-arrow-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0f8a5f" />
        </marker>
        <marker id="srv-arrow-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0f8a5f" />
        </marker>
      </defs>
      <text x="20" y="24" fontSize="14" fontWeight="700" fill="#0f172a">服务 = 打电话：请求 → 处理 → 应答</text>
      <rect x="70" y="44" width="190" height="54" rx="12" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
      <text x="165" y="68" textAnchor="middle" fontSize="12" fontWeight="800" fill="#b45309">客户端 Client</text>
      <text x="165" y="86" textAnchor="middle" fontSize="9.5" fill="#475569">发起调用的人</text>
      <rect x="600" y="44" width="190" height="54" rx="12" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
      <text x="695" y="68" textAnchor="middle" fontSize="12" fontWeight="800" fill="#b45309">服务端 Server</text>
      <text x="695" y="86" textAnchor="middle" fontSize="9.5" fill="#475569">处理请求的人</text>
      <line x1="165" y1="100" x2="165" y2="238" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="695" y1="100" x2="695" y2="238" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="178" y1="125" x2="680" y2="125" stroke="#b4690e" strokeWidth="2" markerEnd="url(#srv-arrow)" />
      <text x="430" y="116" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#b45309">请求 request</text>
      <rect x="555" y="145" width="280" height="46" rx="10" fill="#fff7ed" stroke="#fdba74" strokeWidth="1.5" />
      <text x="695" y="172" textAnchor="middle" fontSize="10.5" fill="#b45309">服务端处理（可能耗时）</text>
      <line x1="682" y1="215" x2="180" y2="215" stroke="#0f8a5f" strokeWidth="2" markerEnd="url(#srv-arrow-g)" />
      <text x="430" y="206" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0f8a5f">应答 response</text>
      <text x="430" y="258" textAnchor="middle" fontSize="10.5" fill="#64748b">
        调用后要等；服务端没起或超时，客户端要处理失败
      </text>
    </svg>
  </div>
);

const MessageFileSvg = () => (
  <div className="surface p-3 md:p-4">
    <svg
      viewBox="0 0 860 300"
      role="img"
      aria-label="msg 文件经 ros2 interface show 查看结构，两端定义一致才能通信；发布者和订阅者字段版本不一致时会解析失败"
      className="h-auto w-full"
    >
      <defs>
        <marker id="mf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
        </marker>
      </defs>
      <text x="20" y="24" fontSize="14" fontWeight="700" fill="#0f172a">.msg 文件 = 消息的“表格模板”</text>
      <rect x="20" y="42" width="190" height="58" rx="10" fill="#eff8ff" stroke="#60b0f7" strokeWidth="1.5" />
      <text x="115" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a5cae">.msg 文件</text>
      <text x="115" y="84" textAnchor="middle" fontSize="9.5" fill="#475569">一行一个字段</text>
      <rect x="270" y="42" width="230" height="58" rx="10" fill="#ffffff" stroke="#93cdfb" strokeWidth="1.5" />
      <text x="385" y="66" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1a5cae">ros2 interface show</text>
      <text x="385" y="84" textAnchor="middle" fontSize="9.5" fill="#475569">一条命令看结构</text>
      <rect x="560" y="42" width="170" height="58" rx="10" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
      <text x="645" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">两端一致</text>
      <text x="645" y="84" textAnchor="middle" fontSize="9.5" fill="#475569">才能通信</text>
      <line x1="214" y1="71" x2="264" y2="71" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#mf-arrow)" />
      <line x1="504" y1="71" x2="554" y2="71" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#mf-arrow)" />
      <text x="20" y="145" fontSize="12" fontWeight="700" fill="#0f172a">字段改了、版本没同步：两边就对不上</text>
      <rect x="20" y="160" width="330" height="92" rx="10" fill="#eff8ff" stroke="#60b0f7" strokeWidth="1.5" />
      <text x="185" y="184" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a5cae">发布者：Twist v1</text>
      <text x="185" y="207" textAnchor="middle" fontSize="10" fill="#475569">linear / angular</text>
      <text x="185" y="228" textAnchor="middle" fontSize="9.5" fill="#64748b">只有两个字段</text>
      <rect x="510" y="160" width="330" height="92" rx="10" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="675" y="184" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b91c1c">订阅者：Twist v2</text>
      <text x="675" y="207" textAnchor="middle" fontSize="10" fill="#7f1d1d">linear / angular / temp</text>
      <text x="675" y="228" textAnchor="middle" fontSize="9.5" fill="#7f1d1d">多了一个字段</text>
      <line x1="354" y1="206" x2="506" y2="206" stroke="#d23f3f" strokeWidth="2" strokeDasharray="6 5" />
      <text x="430" y="196" textAnchor="middle" fontSize="16" fontWeight="800" fill="#d23f3f">✗</text>
      <text x="430" y="280" textAnchor="middle" fontSize="10" fill="#64748b">
        类型名相同还不够：字段名、字段类型、顺序都要一致
      </text>
    </svg>
  </div>
);

const MemorySvg = () => (
  <div className="surface p-3 md:p-4">
    <svg
      viewBox="0 0 860 240"
      role="img"
      aria-label="记忆条：蓝色话题是广播，橙色服务是打电话，绿色动作是点外卖；三行分别对应数据流、问答与长任务"
      className="h-auto w-full"
    >
      <text x="20" y="22" fontSize="13" fontWeight="700" fill="#0f172a">三条记忆条：颜色、类比、用法一一对应</text>
      <rect x="20" y="40" width="190" height="48" rx="10" fill="#eff8ff" stroke="#60b0f7" strokeWidth="1.8" />
      <text x="115" y="69" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1a5cae">蓝 · 话题</text>
      <text x="245" y="65" fontSize="12" fontWeight="700" fill="#334155">广播：一个喊，谁想听谁订阅</text>
      <text x="245" y="83" fontSize="10" fill="#64748b">图像、激光、速度指令；发完不管</text>
      <rect x="20" y="104" width="190" height="48" rx="10" fill="#fff7ed" stroke="#fdba74" strokeWidth="1.8" />
      <text x="115" y="133" textAnchor="middle" fontSize="12" fontWeight="800" fill="#b45309">橙 · 服务</text>
      <text x="245" y="129" fontSize="12" fontWeight="700" fill="#334155">打电话：问一句，等一句</text>
      <text x="245" y="147" fontSize="10" fill="#64748b">查状态、校准、开关；必须等结果</text>
      <rect x="20" y="168" width="190" height="48" rx="10" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.8" />
      <text x="115" y="197" textAnchor="middle" fontSize="12" fontWeight="800" fill="#047857">绿 · 动作</text>
      <text x="245" y="193" fontSize="12" fontWeight="700" fill="#334155">点外卖：下单、看进度、送达</text>
      <text x="245" y="211" fontSize="10" fill="#64748b">导航、抓取；可取消</text>
      <text x="700" y="65" textAnchor="middle" fontSize="10" fill="#1a5cae">蓝＝数据 / 硬件</text>
      <text x="700" y="129" textAnchor="middle" fontSize="10" fill="#b45309">橙＝请求 / 逻辑</text>
      <text x="700" y="193" textAnchor="middle" fontSize="10" fill="#047857">绿＝完成 / 结果</text>
    </svg>
  </div>
);

const RoadmapSvg = () => (
  <div className="surface p-3 md:p-4">
    <svg
      viewBox="0 0 860 160"
      role="img"
      aria-label="学习路线：本册先分清三种说话方式，下一册用 ESP32 与 ROS 2 上板跑通，最后进入综合集成与整车"
      className="h-auto w-full"
    >
      <defs>
        <marker id="road-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
        </marker>
      </defs>
      <rect x="20" y="40" width="220" height="72" rx="12" fill="#eff8ff" stroke="#60b0f7" strokeWidth="2" />
      <text x="130" y="68" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1a5cae">本册 · 第 0.2 册</text>
      <text x="130" y="90" textAnchor="middle" fontSize="10" fill="#475569">先分清三种说话方式</text>
      <rect x="320" y="40" width="250" height="72" rx="12" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
      <text x="445" y="68" textAnchor="middle" fontSize="12" fontWeight="800" fill="#b45309">下一册 · ESP32 与 ROS 2</text>
      <text x="445" y="90" textAnchor="middle" fontSize="10" fill="#475569">上板跑通话题、服务、动作</text>
      <rect x="650" y="40" width="190" height="72" rx="12" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
      <text x="745" y="68" textAnchor="middle" fontSize="12" fontWeight="800" fill="#047857">综合集成 / 整车</text>
      <text x="745" y="90" textAnchor="middle" fontSize="10" fill="#475569">把通信接进系统</text>
      <line x1="244" y1="76" x2="314" y2="76" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#road-arrow)" />
      <line x1="574" y1="76" x2="644" y2="76" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#road-arrow)" />
      <text x="430" y="140" textAnchor="middle" fontSize="10.5" fill="#64748b">
        先有边界感，再上板子；顺序不反，概念才不会混
      </text>
    </svg>
  </div>
);

/* ------------------------------------------------------------ 封面 */
const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      先修课 · 第 0.2 册 · 零基础
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      机器人里只有三种说话方式：
      <br />
      <span className="text-brand-600">喊话 · 问答 · 长活</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      话题（Topic）、服务（Service）、动作（Action）不是三套新技术，而是同一个消息系统的三种“说话方式”。
      本册用广播、打电话、点外卖三个生活场景，把它们一次分清。
    </p>
    <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
      {[
        { t: "话题 · 广播", cls: "border-brand-200 bg-brand-50 text-brand-700" },
        { t: "服务 · 打电话", cls: "border-amber-300 bg-amber-50 text-warn2" },
        { t: "动作 · 点外卖", cls: "border-emerald-300 bg-emerald-50 text-good" },
      ].map((x) => (
        <span
          key={x.t}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.82rem] font-bold ${x.cls}`}
        >
          {x.t}
        </span>
      ))}
    </div>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      建议接在《编程零基础起步：从函数到回调》之后学，可与《ESP32 与 ROS 2 开发基础》并行。
    </p>
  </div>
);

/* ------------------------------------------------------------ 结论先行 */
const Tldr = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="结论先行：所有 ROS 通信，都落在这三种里"
    lead="先记三个生活场景，再记三个技术名。后面每讲一个细节，都回到这三张卡。"
    wide
  >
    <div className="grid gap-3 md:grid-cols-3 md:gap-4">
      <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Megaphone size={18} />
          </span>
          <div>
            <p className="text-[1.02rem] font-extrabold text-ink">话题</p>
            <p className="text-[0.76rem] font-semibold text-brand-700">Topic · 喊话</p>
          </div>
        </div>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-slateink">
          一个喊、谁想听谁订阅；发完不管回复。适合连续的数据流。
        </p>
      </div>
      <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-warn2">
            <Phone size={18} />
          </span>
          <div>
            <p className="text-[1.02rem] font-extrabold text-ink">服务</p>
            <p className="text-[0.76rem] font-semibold text-warn2">Service · 打电话</p>
          </div>
        </div>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-slateink">
          请求 → 处理 → 应答；调用后必须等结果。适合一问一答地办事。
        </p>
      </div>
      <div className="surface border-t-4 border-t-good p-4 md:p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-good">
            <Truck size={18} />
          </span>
          <div>
            <p className="text-[1.02rem] font-extrabold text-ink">动作</p>
            <p className="text-[0.76rem] font-semibold text-good">Action · 点外卖</p>
          </div>
        </div>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-slateink">
          下单 → 配送进度 → 送达；可以取消。适合导航、抓取这类长任务。
        </p>
      </div>
    </div>
    <div className="mt-4 rounded-xl border border-line bg-paper p-4 text-center md:mt-5">
      <p className="text-[0.98rem] font-extrabold text-ink md:text-[1.06rem]">
        话题“发完不管”，服务“问完就等”，动作“派活能催能撤”。
      </p>
    </div>
    <div className="mt-3">
      <ToneLegend />
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 为什么需要通信 */
const Why = () => (
  <Frame
    kicker="概览"
    floor="02"
    title="节点＝分工的工人，靠“说话”协作"
    lead="机器人不是一个程序包打天下，而是拆成很多节点（Node）：有人看、有人想、有人动。"
    wide
  >
    <div className="space-y-4">
      <WhySvg />
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Card title="各干各的" icon={Layers} tone="brand">
          感知只看、决策只想、执行只动；每个节点只干一件事，坏了也好排查。
        </Card>
        <Card title="不共享内存" icon={ShieldCheck} tone="warn">
          节点之间不直接读对方的变量；它们只通过消息交换数据。
        </Card>
        <Card title="可以分机" icon={GitBranch} tone="good">
          节点能跑在同一台电脑，也能分布在树莓派、ESP32 和上位机上。
        </Card>
      </div>
      <Quote>
        通信不是“附加功能”，而是机器人的骨架；先想清楚谁对谁说话，再写代码。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 消息 */
const Message = () => (
  <Frame
    kicker="概览"
    floor="03"
    title="消息＝有格式的信封，字段名＋类型"
    lead="发之前先约定：这张“表格”有哪些栏、每栏放什么类型。双方类型必须对上，否则等于听不懂。"
    wide
  >
    <div className="space-y-4">
      <MessageSvg />
      <Grid cols={3}>
        <Card title="std_msgs/String" icon={MessageSquare} tone="brand">
          最简单的消息：只有一个字段 <code>string data</code>；适合发一句话。
        </Card>
        <Card title="sensor_msgs/Image" icon={Radio} tone="brand">
          图像：<code>height</code>、<code>width</code>、<code>encoding</code>、<code>data</code> 等字段。
        </Card>
        <Card title="geometry_msgs/Twist" icon={Target} tone="warn">
          速度指令：<code>linear</code> 与 <code>angular</code>，各含 <code>x / y / z</code>。
        </Card>
      </Grid>
      <Quote>
        记法：<code>包名/类型名</code>。例如 <code>geometry_msgs/Twist</code>＝<code>geometry_msgs</code> 包里的 <code>Twist</code> 类型。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 话题 */
const Topic = () => (
  <Frame
    kicker="三件套"
    floor="04"
    title="话题＝广播：一个喊，谁想听谁订阅"
    lead="发布者（Publisher）把消息丢到话题上就走，不关心谁来听；订阅者（Subscriber）自己订阅。异步、多对多。"
    wide
  >
    <div className="space-y-4">
      <TopicBroadcast />
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Card title="发完不管回复" icon={Megaphone} tone="brand">
          发布者不等订阅者；没有订阅者也照发，消息直接丢掉，不报错。
        </Card>
        <Card title="多对多" icon={Radio} tone="brand">
          一个话题可以有多个发布者、多个订阅者；各订阅者互不影响。
        </Card>
        <Card title="典型数据流" icon={Radio} tone="good">
          <code className="break-all">/camera/image_raw</code>、<code className="break-all">/scan</code>、<code className="break-all">/odom</code>、<code className="break-all">/cmd_vel</code>。
        </Card>
      </div>
      <Quote>
        生活类比：校园广播站。主播对着话筒说完就走，谁在听、听了多少，广播站不负责。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 服务 */
const Service = () => (
  <Frame
    kicker="三件套"
    floor="05"
    title="服务＝打电话：请求→处理→应答，必须等结果"
    lead="客户端（Client）发请求，服务端（Server）处理后回一个响应。同步：调用后要等对方答复；一对一。"
    wide
  >
    <div className="space-y-4">
      <ServiceSvg />
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Card title="一问一答" icon={Phone} tone="warn">
          请求里带参数，响应里带结果；一次调用只对应一次处理。
        </Card>
        <Card title="必须等" icon={Clock} tone="warn">
          调用后客户端要等答复；服务端没起或处理超时，要按失败处理。
        </Card>
        <Card title="别传连续数据" icon={Ban} tone="bad">
          图像、激光这种高频数据流不要用服务；服务适合“办一件事”。
        </Card>
      </div>
      <Quote>
        生活类比：打电话问“现在电量多少？”对方查一下再告诉你；问完要等，不能不等人说完就挂。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 动作 */
const Action = () => (
  <Frame
    kicker="三件套"
    floor="06"
    title="动作＝点外卖：下单→配送进度→送达，可取消"
    lead="客户端发目标（goal），服务端持续反馈（feedback），最后给结果（result）；过程长、要进度、可取消。"
    wide
  >
    <div className="space-y-4">
      <ActionStages />
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Card title="目标 goal" icon={Send} tone="warn">
          下单：说清楚“去哪里、抓什么”；服务端先回答接不接这单。
        </Card>
        <Card title="反馈 feedback" icon={Radio} tone="brand">
          配送进度：走了多少、到哪了；过程中持续更新，不是只给最后结果。
        </Card>
        <Card title="结果 result" icon={CheckCircle2} tone="good">
          送达或失败：任务结束时给一个明确结论；中途还可以取消。
        </Card>
      </div>
      <Quote>
        生活类比：点外卖。下单后有骑手位置，送到有结果，等太久还能取消；这就是“动作”的三段式。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 对比表 */
const CompareTable = () => (
  <Frame
    kicker="三件套"
    floor="07"
    title="三件套对比：看方向、等不等、长不长、能不能取消"
    lead="同一张表，把最容易混的四个问题一次对齐；判断时先看“等不等”和“长不长”。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["维度", "话题 Topic", "服务 Service", "动作 Action"]}
        widths={["16%", "28%", "28%", "28%"]}
        rows={[
          ["数据方向", "单向广播", "请求＋应答（双向）", "目标＋反馈＋结果（多段）"],
          ["是否等结果", "不等：发完就走", "等：同步调用", "不等最终结果，但可持续收反馈"],
          ["典型时长", "毫秒级连续数据流", "秒级以内的一次处理", "秒到分钟，甚至更长"],
          ["能否取消", "没有“取消”这个概念", "一般不能中途取消", "可以取消"],
          ["参与者", "多对多", "一对一", "一对一线程式任务"],
          ["典型场景", "图像、激光、速度指令", "查状态、校准、开关", "导航到点、机械臂抓取"],
        ]}
      />
      <div className="rounded-xl border border-brand-300 bg-brand-50 p-4 text-center">
        <p className="text-[0.98rem] font-extrabold text-ink md:text-[1.08rem]">
          话题“发完不管”，服务“问完就等”，动作“派活能催能撤”。
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Card title="先看方向" icon={Compass} tone="brand">
          只往外发、不等回复 → 话题；要一来一回 → 服务。
        </Card>
        <Card title="再看时长" icon={Timer} tone="warn">
          秒级以内办完 → 服务；要跑很久、还要看进度 → 动作。
        </Card>
        <Card title="最后看取消" icon={Undo2} tone="good">
          中途要能撤 → 动作；不能撤、只求一次结果 → 服务。
        </Card>
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 判断流程 */
const Decision = () => (
  <Frame
    kicker="三件套"
    floor="08"
    title="何时用哪个：先问“久不久”，再问“要不要答案”"
    lead="按顺序问三句，命中就停；不要一上来就背定义。"
    wide
  >
    <div className="space-y-4">
      <DecisionFlow />
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Card title="先问久不久" icon={Timer} tone="good">
          导航、抓取、长时间巡航 → 动作；这是唯一需要“进度条”的。
        </Card>
        <Card title="再问要不要答案" icon={Phone} tone="warn">
          查状态、校准、开关一次 → 服务；问完必须等答复。
        </Card>
        <Card title="最后问是不是通知" icon={Megaphone} tone="brand">
          图像、激光、速度指令 → 话题；持续发，谁想听谁订阅。
        </Card>
      </div>
      <Quote>
        机器人里大量传感器数据走话题；真正“办事”的接口走服务；耗时任务走动作。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 消息细节 */
const MessageDetail = () => (
  <Frame
    kicker="消息与代码"
    floor="09"
    title=".msg 文件＝消息的“表格模板”，改字段要双方一起改"
    lead="消息类型不是凭空来的，它由 .msg 文件定义：一行一个字段，写法是“类型 名字”。"
    wide
  >
    <div className="space-y-4">
      <MessageFileSvg />
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <div className="space-y-3">
          <Pre>{`# geometry_msgs/msg/Twist.msg
Vector3 linear
Vector3 angular

# Vector3.msg
float64 x
float64 y
float64 z`}</Pre>
          <p className="text-[0.84rem] leading-relaxed text-muted">
            一行一个字段：先写类型，再写名字。字段可以嵌套另一个消息类型。
          </p>
        </div>
        <div className="space-y-3">
          <Steps title="展开：用一条命令看消息结构">
            <Pre>{`ros2 interface show geometry_msgs/msg/Twist

# 输出（节选）
geometry_msgs/Vector3 linear
geometry_msgs/Vector3 angular`}</Pre>
            <p>
              先用 <code>ros2 interface list</code> 找类型，再用 <code>ros2 interface show</code> 看字段；不要靠猜。
            </p>
          </Steps>
          <Card title="为什么不能随便改" icon={AlertTriangle} tone="bad">
            字段名、类型、顺序一改，消息就变了；发布者和订阅者必须用同一版定义，否则解析错位或收不到。
          </Card>
        </div>
      </div>
      <Quote>
        记法：先看 <code>.msg</code>，再看 <code>ros2 interface show</code>，最后确认两端版本一致。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 代码里长什么样 */
function CodeBox({ children }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-canvas p-3 font-mono text-[0.68rem] leading-relaxed text-ink md:text-[0.72rem]">
      {children}
    </pre>
  );
}

const CodeLook = () => (
  <Frame
    kicker="消息与代码"
    floor="10"
    title="代码里认得出这三段就够了"
    lead="不要求会写，只要求看到 create_publisher / create_service / ActionClient 时，知道它属于哪一种“说话方式”。"
    wide
  >
    <div className="space-y-3 md:space-y-4">
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <Card title="话题：发布者" icon={Megaphone} tone="brand">
          <CodeBox>{`from std_msgs.msg import String

pub = self.create_publisher(
    String, '/hello', 10)
pub.publish(String(data='hi'))`}</CodeBox>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">
            关键词：<code>create_publisher</code>、<code>publish</code>；发完不等。
          </p>
        </Card>
        <Card title="服务：服务端 / 客户端" icon={Phone} tone="warn">
          <CodeBox>{`from example_interfaces.srv import (
    AddTwoInts)

server = self.create_service(
    AddTwoInts, '/add', cb)
future = self.cli.call_async(
    AddTwoInts.Request(a=1, b=2))`}</CodeBox>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">
            关键词：<code>create_service</code>、<code>call_async</code>；一问一答。
          </p>
        </Card>
        <Card title="动作：客户端" icon={Truck} tone="good" className="md:col-span-2">
          <CodeBox>{`from nav2_msgs.action import (
    NavigateToPose)

self.cli = ActionClient(
    self, NavigateToPose, '/navigate_to_pose')
self.cli.send_goal_async(goal)`}</CodeBox>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">
            关键词：<code>ActionClient</code>、<code>send_goal_async</code>；长活。
          </p>
        </Card>
      </div>
      <div className="rounded-xl border border-line bg-paper p-4">
        <p className="text-[0.92rem] font-bold text-ink">
          三个词一眼分辨：<span className="text-brand-700">publish</span> 是广播，
          <span className="text-warn2">call</span> 是打电话，<span className="text-good">goal</span> 是下单。
        </p>
      </div>
      <Quote>本页只建立“认得出”的眼力；完整写法、参数与回调，下一册上板时再练。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 常见坑 */
const Pitfalls = () => (
  <Frame
    kicker="消息与代码"
    floor="11"
    title="四个常见坑：不报错，不等于通了"
    lead="这三种通信都有自己的“沉默失败”；先看清单，再去调。"
    wide
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="① 话题没有订阅者也照发" icon={Megaphone} tone="brand">
          <code>publish()</code> 不会报错，消息直接丢掉。先 <code>ros2 topic info &lt;话题&gt;</code> 看订阅者数量。
        </Card>
        <Card title="② 服务调用超时 / 对方没起" icon={Phone} tone="warn">
          客户端会一直等或超时。先 <code>ros2 service list</code> 确认服务端在，再看服务名是否写对。
        </Card>
        <Card title="③ 动作忘了等结果" icon={Truck} tone="good">
          <code>send_goal_async</code> 是异步的；要等 goal 被接受，再等 result，否则下一步会在任务还没开始时执行。
        </Card>
        <Card title="④ QoS 一句话" icon={ShieldCheck} tone="slate">
          可靠（reliable）保证送到，尽力（best effort）可能丢；传感器常用 best effort，控制指令常用 reliable。
        </Card>
      </Grid>
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-[0.92rem] font-bold text-bad">
          排查顺序：先列出来（<code>list</code>）→ 再看一眼（<code>echo</code> / <code>info</code>）→ 最后才怀疑代码。
        </p>
      </div>
      <Quote>“没报错”只说明程序跑到了这一行，不说明对方收到了。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 记忆锚 */
const MemoryPage = () => (
  <Frame
    kicker="记忆与决策"
    floor="12"
    title="记忆锚：传感器用话题，办事用服务，长活用动作"
    lead="先想起钩子，再顺出定义；三张卡对应三个生活场景，颜色全册统一。"
    wide
  >
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
          <p className="text-[0.74rem] font-bold tracking-wider text-brand-700">蓝 · 数据 / 硬件</p>
          <p className="mt-1 text-[1.12rem] font-extrabold text-ink">话题 = 广播</p>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-slateink">
            一个喊，谁想听谁订阅；发完不管。传感器数据流走这里。
          </p>
          <p className="mt-2 text-[0.8rem] font-semibold text-brand-700">关键词：publish · subscribe</p>
        </div>
        <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
          <p className="text-[0.74rem] font-bold tracking-wider text-warn2">橙 · 请求 / 逻辑</p>
          <p className="mt-1 text-[1.12rem] font-extrabold text-ink">服务 = 打电话</p>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-slateink">
            问一句，等一句；必须等结果。查状态、校准、开关走这里。
          </p>
          <p className="mt-2 text-[0.8rem] font-semibold text-warn2">关键词：request · response</p>
        </div>
        <div className="surface border-t-4 border-t-good p-4 md:p-5">
          <p className="text-[0.74rem] font-bold tracking-wider text-good">绿 · 完成 / 结果</p>
          <p className="mt-1 text-[1.12rem] font-extrabold text-ink">动作 = 点外卖</p>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-slateink">
            下单、看进度、送达；可取消。导航、抓取这类长活走这里。
          </p>
          <p className="mt-2 text-[0.8rem] font-semibold text-good">关键词：goal · feedback · result</p>
        </div>
      </div>
      <MemorySvg />
      <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 text-center md:p-5">
        <p className="text-[1.05rem] font-extrabold text-ink md:text-[1.2rem]">
          传感器用话题、办事用服务、长活用动作。
        </p>
        <p className="mt-1 text-[0.86rem] text-muted">蓝广播、橙电话、绿外卖。</p>
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 对比决策 */
const DecisionPage = () => (
  <Frame
    kicker="记忆与决策"
    floor="13"
    title="对比决策：先学三种，还是先把话题跑通？"
    lead="两种学法各有取舍；本课程立场：先用话题跑通一条数据流，再补服务与动作。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["维度", "先学三种", "先跑通话题"]}
        widths={["16%", "42%", "42%"]}
        rows={[
          ["起步速度", "慢：三种同时上手，命令和概念一起压过来", "快：一条 ros2 topic echo 当天就能看到数据"],
          ["概念负担", "容易混：三套接口、三种回调一起记", "单一：先把发布/订阅的直觉建立起来"],
          ["调试手段", "三种都要会：echo、call、action 各一套", "话题工具最直观：list / echo / info 就能排障"],
          ["适合人群", "要系统梳理、准备考试或做接口设计", "零基础、项目驱动、先要看到现象"],
          ["主要风险", "边界没建立就先背接口，越学越乱", "容易把服务/动作也硬套成话题，需要后续补边界"],
        ]}
      />
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
          <p className="text-[1rem] font-extrabold text-ink">路径 A：先学三种</p>
          <p className="mt-1 text-[0.82rem] font-semibold text-brand-700">适合“系统梳理 + 接口设计”</p>
          <ul className="mt-2.5 space-y-1.5 text-[0.88rem] leading-relaxed text-slateink">
            <li>先把三种通信的定义、接口和典型场景一起过一遍。</li>
            <li>再分别写最小示例，最后做综合练习。</li>
            <li>好处是体系完整；风险是零基础容易被三套接口压住。</li>
          </ul>
        </div>
        <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
          <p className="text-[1rem] font-extrabold text-ink">路径 B：先跑通话题</p>
          <p className="mt-1 text-[0.82rem] font-semibold text-warn2">本课程立场：先跑通，再补边界</p>
          <ul className="mt-2.5 space-y-1.5 text-[0.88rem] leading-relaxed text-slateink">
            <li>先用 <code>ros2 topic list</code> 和 <code>echo</code> 看到真实数据在流动。</li>
            <li>再补服务：把“问一句、等一句”跑通。</li>
            <li>最后补动作：把“长活、进度、取消”跑通。</li>
          </ul>
        </div>
      </div>
      <div className="surface flex items-start gap-3 border-brand-300 bg-brand-50 p-4">
        <Search size={18} className="mt-0.5 flex-none text-brand-700" />
        <div>
          <p className="text-[0.95rem] font-bold text-ink">引导问题：你今天是先要看到数据在流动，还是要一次把三种背清楚？</p>
          <p className="mt-1 text-[0.88rem] leading-relaxed text-slateink">
            要看到现象 → 先跑话题；要设计接口 → 再系统补三种。本课程选前者：先有数据流，再补边界。
          </p>
        </div>
      </div>
      <Quote>先跑通一条话题，再回来补服务与动作；边界是在对比中学会的，不是在定义里背会的。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 行动清单 */
const ActionsPage = () => (
  <Frame
    kicker="收尾"
    floor="14"
    title="今天就能做的 3 件事：列出来、看一眼、认出来"
    lead="不用写代码。开一个 ROS 2 终端，三条命令各试一次，把输出记一句。"
    wide
  >
    <div className="space-y-4">
      <Grid cols={3}>
        <Card title="① 列出话题" icon={Megaphone} tone="brand">
          先看系统里有哪些话题；再挑一个用 <code>echo</code> 看一眼消息长什么样。
        </Card>
        <Card title="② 列出服务" icon={Phone} tone="warn">
          看有哪些“问答”接口；记住服务名，知道它要等结果。
        </Card>
        <Card title="③ 列出动作" icon={Truck} tone="good">
          看有哪些“长活”；如果列表为空，说明当前没有动作服务器，不是命令错。
        </Card>
      </Grid>
      <Pre>{`ros2 topic list
ros2 topic echo /rosout --once
ros2 service list
ros2 action list`}</Pre>
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <Card title="每条命令记一句" icon={ListChecks} tone="brand">
          <ul className="space-y-1.5">
            <li>· 话题：看到了哪些名字？挑一个 echo 出了什么字段？</li>
            <li>· 服务：有几个？名字里有没有 get / set / calibrate？</li>
            <li>· 动作：有几个？名字里有没有 navigate / grab / follow？</li>
          </ul>
        </Card>
        <Card title="如果命令不熟" icon={Terminal} tone="slate">
          先 <code>ros2 --help</code>，再 <code>ros2 topic --help</code>；子命令的帮助比背文档快。
        </Card>
      </div>
      <Quote>三条命令跑完，你对“话题 / 服务 / 动作”的感觉就从名词变成了屏幕上的真实输出。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------------ 收尾 */
const Closing = () => (
  <Frame
    kicker="收尾"
    floor="15"
    title="下一步：把三种“说话方式”带到真实的板子上"
    lead="本册只建立边界感；下一册用真实硬件把话题、服务、动作跑起来。"
    wide
  >
    <div className="space-y-5">
      <Quote>传感器用话题、办事用服务、长活用动作——蓝广播、橙电话、绿外卖。</Quote>
      <RoadmapSvg />
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <Card title="下一册：ESP32 与 ROS 2 开发基础" icon={GraduationCap} tone="brand">
          48 学时职业本科课程：三块 ESP32-S3 / 掌机经 WiFi 接入 ROS 2，把话题、服务、动作放进真实的点灯、通信与订阅里。
          <br />
          <a
            href="../ESP32与ROS2开发基础/index.html"
            className="break-all font-semibold text-brand-700 underline"
          >
            打开：ESP32 与 ROS 2 开发基础
          </a>
        </Card>
        <Card title="本册文字版教程" icon={Download} tone="good">
          <p>
            下载：{" "}
            <a
              className="break-all font-semibold text-brand-700 underline"
              href="./files/ROS2通信三件套-文字版教程.md"
            >
              files/ROS2通信三件套-文字版教程.md
            </a>
          </p>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
            与 deck 同源，含完整解释、mermaid 图、代码对照与行动清单；离线可读。
          </p>
        </Card>
        <Card title="仓库里的位置" icon={FolderTree}>
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            <li>成品：<code className="break-all">教学webppt/ROS2通信三件套/index.html</code></li>
            <li>源码：<code className="break-all">教学webppt/ROS2通信三件套/presentation/</code></li>
            <li>图文要点：<code className="break-all">docs/ROS2通信三件套.md</code></li>
            <li>文字版：<code className="break-all">教学webppt/ROS2通信三件套/files/</code></li>
          </ul>
        </Card>
        <Card title="五分钟自测" icon={ListChecks} tone="warn">
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            <li>话题：发布者要不要等订阅者回复？</li>
            <li>服务：调用后能不能不等结果就继续？</li>
            <li>动作：中间进度叫什么？能不能取消？</li>
            <li>消息：两边类型对不上会发生什么？</li>
            <li>判断：导航到某点，用哪一种？</li>
          </ul>
        </Card>
      </div>
      <p className="text-[0.86rem] text-muted">
        路径：<code>教学webppt/ROS2通信三件套/</code>（成品单文件 + <code>files/</code> 附件，离线可播）
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Tldr /> },
  { nav: "为什么通信", group: "概览", el: <Why /> },
  { nav: "消息", group: "概览", el: <Message /> },
  { nav: "话题", group: "三件套", el: <Topic /> },
  { nav: "服务", group: "三件套", el: <Service /> },
  { nav: "动作", group: "三件套", el: <Action /> },
  { nav: "对比决策表", group: "三件套", el: <CompareTable /> },
  { nav: "何时用哪个", group: "三件套", el: <Decision /> },
  { nav: "消息细节", group: "消息与代码", el: <MessageDetail /> },
  { nav: "代码认读", group: "消息与代码", el: <CodeLook /> },
  { nav: "常见坑", group: "消息与代码", el: <Pitfalls /> },
  { nav: "记忆锚", group: "记忆与决策", el: <MemoryPage /> },
  { nav: "对比决策", group: "记忆与决策", el: <DecisionPage /> },
  { nav: "行动清单", group: "收尾", el: <ActionsPage /> },
  { nav: "下载与延伸", group: "收尾", el: <Closing /> },
];
