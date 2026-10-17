import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Cpu,
  Server,
  Network,
  Terminal,
  Cable,
  Wifi,
  Rocket,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Gauge,
  Send,
  Download,
  Play,
  Boxes,
  BookOpen,
  CircuitBoard,
  Wrench,
  Activity,
  RotateCcw,
  RefreshCw,
  Target,
  ShieldCheck,
  Zap,
  ArrowLeftRight,
  ArrowRight,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre, Figure } from "./components.jsx";

import rosListener from "./assets/ros-listener.jpg";
import rosMonitor from "./assets/ros-monitor.jpg";

/* 代码块：短命令用等宽样式；多行/完整脚本用共用的 Pre（保留换行缩进） */
const Code = ({ children }) => (
  <div className="surface overflow-x-auto p-4 font-mono text-[0.78rem] leading-relaxed text-ink md:text-[0.82rem]">
    {children}
  </div>
);

const A = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="break-words font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2"
  >
    {children}
  </a>
);

/* ============================================================
   守则第七节 · 点式动画（全册 ≤3 处）
   纯前端实现：React state + setTimeout + CSS transition，无外链资源。
   默认全亮（静态兜底，停帧/打印都完整可读）；播放时逐点 idle → active → done。
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

/* 颜色编码（全册统一）：蓝＝板子侧、橙＝电脑侧、绿＝验证通过 */
const NODE_TONE = {
  board: {
    idle: "border-line bg-paper text-muted",
    on: "border-brand-400 bg-brand-50 text-brand-700",
    active: "border-brand-600 bg-brand-600 text-white",
    done: "border-good bg-good text-white",
  },
  host: {
    idle: "border-line bg-paper text-muted",
    on: "border-amber-400 bg-amber-50 text-warn2",
    active: "border-warn2 bg-warn2 text-white",
    done: "border-good bg-good text-white",
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

/* 招式一 · 横向连接链点式动画：S3 → 传输 → Agent → ROS 2 网络 → 上位程序 */
const CHAIN = [
  { no: "1", side: "board", title: "S3 固件", sub: "micro-ROS 客户端" },
  { no: "2", side: "board", title: "传输通道", sub: "Wi-Fi UDP :8888" },
  { no: "3", side: "host", title: "Agent", sub: "总机 · 翻译官" },
  { no: "4", side: "host", title: "ROS 2 网络", sub: "话题 / 服务" },
  { no: "5", side: "host", title: "上位程序", sub: "echo / 浏览器" },
];

const segClass = (side, st) =>
  st === "done" ? "bg-good" : st === "idle" ? "bg-line" : side === "board" ? "bg-brand-500" : "bg-warn2";

function ConnFlow() {
  const { statuses, play, reset, jump } = useSequence(CHAIN.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {CHAIN.map((s, i) => {
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
                        s.side === "board" ? "bg-brand-400/50" : "bg-amber-400/50"
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
              {i < CHAIN.length - 1 && (
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
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-2.5 text-[0.78rem] text-muted">
        <span className="font-bold text-ink">口诀：板等 Agent，Agent 等端口，端口等网络</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-brand-600" />
          蓝＝板子侧
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-warn2" />
          橙＝电脑侧
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-good" />
          绿＝验证通过
        </span>
      </div>
    </div>
  );
}

/* 招式二 · 纵向点式分步（验证流程 / 故障排查流共用同一点式动画） */
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
              : s.tone === "board"
              ? "bg-brand-600 text-white"
              : s.tone === "host"
              ? "bg-warn2 text-white"
              : "bg-good text-white";
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

/* 部署组理解型图示：传输方式对比图（结构化卡片，非表格、非 ASCII） */
const TransportCompare = () => (
  <div className="grid gap-3 md:grid-cols-2">
    <div className="surface border-t-4 border-t-slate-300 p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-slate-100 text-slateink">
          <Cable size={17} />
        </span>
        <span>
          <span className="block text-[0.98rem] font-bold text-ink">串口 serial</span>
          <span className="block text-[0.76rem] text-muted">有线直连 · 台架调试、固定安装</span>
        </span>
      </div>
      <ul className="space-y-1.5 text-[0.86rem] leading-relaxed text-slateink">
        <li>优势：有线直连，稳定，不受路由器与信道干扰。</li>
        <li>代价：拖一根线，车不能自由跑。</li>
        <li>注意：别和 serial monitor 抢同一个串口。</li>
      </ul>
    </div>
    <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-brand-50 text-brand-700">
          <Wifi size={17} />
        </span>
        <span>
          <span className="block text-[0.98rem] font-bold text-ink">Wi-Fi wifi / UDP4</span>
          <span className="block text-[0.76rem] font-semibold text-brand-700">本课默认 · 遥控、跑车、整机验证</span>
        </span>
      </div>
      <ul className="space-y-1.5 text-[0.86rem] leading-relaxed text-slateink">
        <li>优势：无线机动，S3 不用插着 Pi，车能自由跑。</li>
        <li>代价：依赖 2.4 GHz 与同网段，受路由器与干扰影响。</li>
        <li>注意：S3 只连 2.4 GHz；Agent IP 不能写 127.0.0.1。</li>
      </ul>
    </div>
  </div>
);

/* 通路验证链路：Pi 端 Agent 把 S3 接进 ROS 2 图（内联 SVG，禁用 ASCII 字符画） */
const AgentPathway = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 430"
      role="img"
      aria-label="ESP32-S3 到树莓派 micro-ROS Agent 再到 ROS 2 图的通路验证链路：S3 固件跑 micro-ROS 客户端，节点名 esp32_car，经 Wi-Fi UDP4 连到 Pi 上 Docker 容器里的 micro-ROS Agent，UDP 端口 8888；Agent 把受限设备会话翻译成普通 ROS 2 节点，接进 ROS 2 图。两段链路均为双向箭头：S3 与 Agent 之间走 UDP4 :8888 双向；Agent 与 ROS 2 图之间，/esp32/heartbeat 上行、/cmd_vel 下行。teleop_twist_keyboard 发 cmd_vel，heartbeat_listener 收 esp32 heartbeat；底部给出 ros2 node list、ros2 topic hz、ros2 topic echo 的验证命令与默认域 0 的注意事项"
      className="h-auto w-full"
    >
      <defs>
        <marker id="ap-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="ap-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
      </defs>

      <text x="16" y="24" fill="#0f172a" fontSize="12" fontWeight="700">
        通路验证链路：S3 →（UDP4 :8888）→ micro-ROS Agent → ROS 2 图
      </text>

      <rect x="16" y="40" width="256" height="266" rx="14" fill="#f0fdfa" stroke="#5eead4" />
      <text x="32" y="64" fill="#0f766e" fontSize="12" fontWeight="700">① ESP32-S3 固件</text>
      <text x="32" y="90" fill="#0f172a" fontSize="11" fontWeight="700">micro-ROS 客户端（rcl + rclc）</text>
      <text x="32" y="108" fill="#475569" fontSize="10">内存占用几十 KB 级别</text>
      <text x="32" y="134" fill="#0f172a" fontSize="11" fontWeight="700">节点名 esp32_car</text>
      <text x="32" y="152" fill="#475569" fontSize="10">与 Pi 同一 2.4 GHz 网段</text>
      <text x="32" y="178" fill="#0f172a" fontSize="11" fontWeight="700">发布 /esp32/heartbeat</text>
      <text x="32" y="196" fill="#475569" fontSize="10">std_msgs/Int32，约 1 Hz</text>
      <text x="32" y="222" fill="#0f172a" fontSize="11" fontWeight="700">订阅 /cmd_vel</text>
      <text x="32" y="240" fill="#475569" fontSize="10">geometry_msgs/Twist</text>
      <text x="32" y="272" fill="#b4690e" fontSize="10" fontWeight="700">断连即停，自动重连（不重启）</text>
      <text x="32" y="290" fill="#475569" fontSize="10">Wi-Fi 只支持 2.4 GHz</text>

      <rect x="326" y="40" width="248" height="266" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="342" y="64" fill="#1a5cae" fontSize="12" fontWeight="700">② 树莓派 micro-ROS Agent</text>
      <text x="342" y="90" fill="#0f172a" fontSize="11" fontWeight="700">Docker 容器 ros:jazzy-ros-base</text>
      <text x="342" y="108" fill="#475569" fontSize="10">--network host，UDP 落在宿主网络</text>
      <text x="342" y="134" fill="#0f172a" fontSize="11" fontWeight="700">udp4 --port 8888</text>
      <text x="342" y="152" fill="#475569" fontSize="10">与固件里的端口一致</text>
      <text x="342" y="178" fill="#0f172a" fontSize="11" fontWeight="700">micro-ROS Agent（代理）</text>
      <text x="342" y="196" fill="#475569" fontSize="10">本身就是 ROS 2 图里的一个节点</text>
      <text x="342" y="222" fill="#0f172a" fontSize="11" fontWeight="700">Micro XRCE-DDS</text>
      <text x="342" y="240" fill="#475569" fontSize="10">把受限设备会话翻译成普通节点</text>
      <text x="342" y="272" fill="#b4690e" fontSize="10" fontWeight="700">先起 Agent，再给 S3 上电</text>
      <text x="342" y="290" fill="#475569" fontSize="10">固定默认 DDS 域 0</text>

      <rect x="628" y="40" width="256" height="266" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="644" y="64" fill="#0f172a" fontSize="12" fontWeight="700">③ ROS 2 图（Pi 5）</text>
      <text x="644" y="90" fill="#0f172a" fontSize="11" fontWeight="700">teleop_twist_keyboard</text>
      <text x="644" y="108" fill="#475569" fontSize="10">键盘发布 /cmd_vel</text>
      <text x="644" y="134" fill="#0f172a" fontSize="11" fontWeight="700">heartbeat_listener</text>
      <text x="644" y="152" fill="#475569" fontSize="10">订阅 /esp32/heartbeat，按频率打印</text>
      <text x="644" y="178" fill="#0f172a" fontSize="11" fontWeight="700">节点与话题</text>
      <text x="644" y="196" fill="#475569" fontSize="10">node list → /esp32_car</text>
      <text x="644" y="214" fill="#475569" fontSize="10">topic list → /esp32/heartbeat</text>
      <text x="644" y="246" fill="#0f172a" fontSize="11" fontWeight="700">验证节点用 Python rclpy 编写</text>
      <text x="644" y="264" fill="#475569" fontSize="10">随官方示例工程附带</text>
      <text x="644" y="290" fill="#b4690e" fontSize="10" fontWeight="700">客户端别设 ROS_DOMAIN_ID</text>

      <line x1="272" y1="146" x2="322" y2="146" stroke="#0d9488" strokeWidth="2" markerEnd="url(#ap-teal)" />
      <line x1="322" y1="162" x2="272" y2="162" stroke="#0d9488" strokeWidth="2" markerEnd="url(#ap-teal)" />
      <text x="297" y="138" textAnchor="middle" fill="#0f766e" fontSize="9">UDP4 :8888 双向</text>
      <line x1="574" y1="146" x2="624" y2="146" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#ap-blue)" />
      <line x1="624" y1="162" x2="574" y2="162" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#ap-blue)" />
      <text x="599" y="138" textAnchor="middle" fill="#1a5cae" fontSize="9">heartbeat ↑</text>
      <text x="599" y="178" textAnchor="middle" fill="#1a5cae" fontSize="9">/cmd_vel ↓</text>

      <rect x="16" y="322" width="868" height="92" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="32" y="346" fill="#0f172a" fontSize="11" fontWeight="700">验证链路（在 Pi 的 ROS 2 容器里执行，先 source setup.bash）</text>
      <text x="32" y="368" fill="#475569" fontSize="10">
        ros2 node list → /esp32_car　｜　ros2 topic hz /esp32/heartbeat → 约 1 Hz　｜　ros2 topic echo /cmd_vel → 按键后出现 Twist
      </text>
      <text x="32" y="392" fill="#b4690e" fontSize="10" fontWeight="700">
        注意：micro-ROS Agent 固定跑在默认 DDS 域 0，客户端若 export ROS_DOMAIN_ID=42，连 /esp32/heartbeat 都看不到（实测）。
      </text>
    </svg>
  </div>
);

/* 固件侧任务结构：核心 1 初始化 + 核心 0 通信任务 + 核心 1 驱动下发（内联 SVG） */
const FirmwareTasks = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 470"
      role="img"
      aria-label="ESP32-S3 micro-ROS 固件的任务结构：setup 在核心 1 做串口、电机初始化并创建 microros_task 到核心 0；microros_task 在核心 0 先连 WiFi、设置传输，再循环 ping Agent 探测、建实体、spin 收发、断线销毁实体重连、每秒发心跳；loop 在核心 1 做一秒无指令停车并调用电机库 spin 下发占空比；底部三条铁律：库调用只在核心 1、回调只写目标值、断连即停且 ping 重连不用重启"
      className="h-auto w-full"
    >
      <defs>
        <marker id="ft-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="ft-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      <text x="16" y="24" fill="#0f172a" fontSize="12" fontWeight="700">
        固件侧任务结构：核心 1 初始化 → 核心 0 保活收发 → 核心 1 下发驱动
      </text>

      <rect x="16" y="40" width="868" height="74" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="32" y="64" fill="#1a5cae" fontSize="12" fontWeight="700">setup()（核心 1，Arduino setup / loop 都在核心 1）</text>
      <text x="32" y="86" fill="#0f172a" fontSize="10.5">
        Serial.begin(115200) → emo.begin() + getEncoderMotor(M1/M2)-&gt;begin(90) → xTaskCreatePinnedToCore(microros_task, 核心 0)
      </text>
      <text x="32" y="104" fill="#475569" fontSize="10">电机库要先初始化，否则后续所有 spin() 静默不出 PWM（本板实测）</text>

      <rect x="16" y="130" width="556" height="240" rx="14" fill="#f0fdfa" stroke="#5eead4" />
      <text x="32" y="154" fill="#0f766e" fontSize="12" fontWeight="700">microros_task（核心 0，FreeRTOS 后台任务）</text>
      <text x="32" y="180" fill="#0f172a" fontSize="10.5">① wait_for_wifi(30 s)：只连 2.4 GHz；超时则 ESP.restart()</text>
      <text x="32" y="202" fill="#0f172a" fontSize="10.5">② set_microros_wifi_transports(SSID, PASS, AgentIP, 8888)</text>
      <text x="32" y="228" fill="#0f172a" fontSize="11" fontWeight="700">③ while (true) 主循环：</text>
      <text x="48" y="250" fill="#475569" fontSize="10.5">• 未连接 → rmw_uros_ping_agent(100, 1) 探 Agent → create_entities()</text>
      <text x="48" y="272" fill="#475569" fontSize="10.5">• 已连接 → rclc_executor_spin_some(100 ms) 收发话题</text>
      <text x="48" y="294" fill="#475569" fontSize="10.5">• ping 失败或返回非 OK → destroy_entities() → 断连即停 → 重连</text>
      <text x="48" y="316" fill="#475569" fontSize="10.5">• 每 1 s rcl_publish /esp32/heartbeat（计数器递增）</text>
      <text x="48" y="344" fill="#0f766e" fontSize="10">重连不需要重启板子：Agent 起晚了，固件会自己等回来（官方示例结构）</text>

      <rect x="592" y="130" width="292" height="240" rx="14" fill="#fffbeb" stroke="#fbbf24" />
      <text x="608" y="154" fill="#b4690e" fontSize="12" fontWeight="700">loop()（核心 1，驱动下发）</text>
      <text x="608" y="180" fill="#0f172a" fontSize="10.5">1 s 没收到 /cmd_vel → target_l / target_r = 0</text>
      <text x="608" y="202" fill="#475569" fontSize="10">丢包 / 断连保护，松手即停</text>
      <text x="608" y="228" fill="#0f172a" fontSize="10.5">drive_motor()：motor-&gt;spin(target) 下发</text>
      <text x="608" y="250" fill="#475569" fontSize="10">参数范围 -100 ~ 100（开环占空比）</text>
      <text x="608" y="276" fill="#0f172a" fontSize="10.5">回调（核心 0）只写目标值</text>
      <text x="608" y="298" fill="#475569" fontSize="10">不碰电机库，避免跨核调用</text>
      <text x="608" y="324" fill="#b4690e" fontSize="10" fontWeight="700">库调用只在核心 1 才出 PWM</text>
      <text x="608" y="346" fill="#475569" fontSize="10">占空比 60 起才转、100 满速（实测）</text>

      <line x1="200" y1="114" x2="200" y2="130" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#ft-blue)" />
      <line x1="740" y1="114" x2="740" y2="130" stroke="#b4690e" strokeWidth="2" markerEnd="url(#ft-amber)" />

      <rect x="16" y="386" width="868" height="66" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="32" y="410" fill="#0f172a" fontSize="11" fontWeight="700">三条铁律：</text>
      <text x="32" y="432" fill="#475569" fontSize="10">
        ① 电机库只在核心 1 调；② 订阅回调只写目标值、不碰电机库；③ 断连即停，ping 重连不用重启板子。
      </text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-26
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      ESP32-S3 接入 micro-ROS
      <br />
      <span className="text-brand-600">把控制板变成 ROS 2 节点</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      在 ESP32-S3 上写 micro-ROS 固件，经树莓派上的 <b>micro-ROS Agent（代理）</b>接入 ROS 2 图：
      收 <code>/cmd_vel</code> 控车，发 <code>/esp32/heartbeat</code> 报活。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整步骤与全量固件，完整资料见{" "}
      <code>docs/ESP32-S3电机驱动板资料.md</code> 第六节与 <code>docs/ROS2与micro-ROS选型.md</code> 第六节。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="一收一发都跑通，才算把控制板接进 ROS 2"
    lead="目标先说清：S3 侧写固件，Pi 侧跑 Agent，两端都到位才有一条 ROS 2 通路；通路通了，再谈真正控车。"
  >
    <Grid cols={2}>
      <Card title="ESP32-S3 侧" icon={Cpu}>
        用 PlatformIO 写 micro-ROS 固件：连 Wi-Fi、连 Agent、发心跳、订阅 <code>/cmd_vel</code> 驱动履带底盘（左右两路电机）。
      </Card>
      <Card title="树莓派侧" icon={Server}>
        在 ROS 2 容器里跑 micro-ROS Agent（UDP4 :8888），把 S3 接进 ROS 2 图。
      </Card>
      <Card title="两条链路" icon={ArrowLeftRight}>
        Pi → S3：<code>/cmd_vel</code>（<code>geometry_msgs/Twist</code>）；S3 → Pi：<code>/esp32/heartbeat</code>。
      </Card>
      <Card title="验收标准" icon={CheckCircle2} tone="good">
        <code>ros2 topic echo</code> 能看到心跳；按键控车时车轮跟着动、松手 1 s 后停。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>先跑通通路，再把回调里的转向量换成真正的电机控制；顺序不能反。</Quote>
    </div>
  </Frame>
);

const ChainAnchor = () => (
  <Frame
    kicker="概览"
    floor="02"
    title="连接链一步步点亮：蓝是板、橙是脑、绿是通"
    lead="五个角色连成一条链，顺序就是口诀。先按顺序点亮（蓝板、橙脑），再走通一遍（全绿）——记住「灯走到哪」，流程就记到哪。"
    wide
  >
    <div className="space-y-4">
      <ConnFlow />
      <Grid cols={3}>
        <Card title="口诀" icon={BookOpen} tone="brand">
          「板等 Agent，Agent 等端口，端口等网络」——先开后连、顺序不反，顺序题一眼定音。
        </Card>
        <Card title="生活化类比" icon={Cable} tone="warn">
          串口／网线＝电话线，一头插板、一头插电脑；Agent＝总机，把「电话」接进 ROS 2 这张「城市电话网」。
        </Card>
        <Card title="颜色编码" icon={Layers} tone="good">
          <span className="mb-1 flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded bg-brand-600" />
            蓝＝板子侧动作（S3）
          </span>
          <span className="mb-1 flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded bg-warn2" />
            橙＝电脑侧动作（Agent / ROS 2）
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded bg-good" />
            绿＝验证通过（全链贯通）
          </span>
        </Card>
      </Grid>
    </div>
  </Frame>
);

const Pathway = () => (
  <Frame
    kicker="概览"
    floor="03"
    title="S3 不直说 DDS：经 Agent 翻译成普通 ROS 2 节点"
    lead="三个角色各司其职：S3 只和 Agent 建一条会话，Agent 再把它翻译成 ROS 2 图里的节点——micro-ROS 不能替代 ROS 2。"
    wide
  >
    <div className="space-y-4">
      <AgentPathway />
      <Grid cols={3}>
        <Card title="S3 说 Micro XRCE-DDS" icon={Cpu}>
          受限设备用 Micro XRCE-DDS（面向资源受限设备的 DDS 实现）：只和 Agent 建一条会话，开销压到几十 KB。
        </Card>
        <Card title="Agent 是 ROS 2 节点" icon={Server}>
          它跑在 Pi 的 ROS 2 里，本身就是一个节点；依附在完整 ROS 2 上，不能脱离 ROS 2 单独存在。
        </Card>
        <Card title="传输两选一" icon={Cable}>
          Wi-Fi 下用 UDP4（本课默认）；有线的固定安装可用串口（serial）。
        </Card>
      </Grid>
      <Steps title="展开：三角色的职责与传输口径（完整）">
        <Pre>{`ESP32-S3（micro-ROS 客户端）
  · 固件里用 rcl + rclc（ROS 2 客户端库的 C 子集）
  · 节点名 esp32_car；发布 /esp32/heartbeat、订阅 /cmd_vel
  · 内存占用几十 KB 量级

树莓派 micro-ROS Agent（代理）
  · 跑在 ROS 2 容器里（ros:jazzy-ros-base，--network host）
  · udp4 --port 8888，与固件端口一致
  · 用 Micro XRCE-DDS 把会话翻译成普通 ROS 2 节点

ROS 2 图（Pi 5）
  · teleop_twist_keyboard 发 /cmd_vel
  · heartbeat_listener 订阅 /esp32/heartbeat
  · ros2 node list → /esp32_car

口径：Agent 固定默认 DDS 域 0；客户端不要 export ROS_DOMAIN_ID。`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const FirmwareTaskPage = () => (
  <Frame
    kicker="固件"
    floor="04"
    title="固件一条后台任务包办：连 Wi-Fi、保活重连、收发话题"
    lead="结构照官方示例：setup 里起 FreeRTOS（一种实时操作系统）后台任务，通信全在核心 0 的任务里，电机库只在核心 1 调。"
    wide
  >
    <div className="space-y-4">
      <FirmwareTasks />
      <Grid cols={3}>
        <Card title="通信归核心 0" icon={RefreshCw}>
          连 Wi-Fi、ping Agent、建实体、收发话题、发心跳，全在 <code>microros_task</code> 里循环做。
        </Card>
        <Card title="驱动归核心 1" icon={Wrench}>
          <code>loop()</code> 里做 1 s 无指令停车与 <code>spin()</code> 下发；从核心 0 调电机库不出 PWM（实测）。
        </Card>
        <Card title="重连不用重启" icon={ShieldCheck} tone="good">
          Agent 起晚了也不用重启板子：<code>rmw_uros_ping_agent</code> 探测失败就销毁实体、等回来再建。
        </Card>
      </Grid>
      <Steps title="展开：microros_task 的重连与心跳（官方示例结构）">
        <Pre>{`// 核心 0：通信任务（官方示例结构）
void microros_task(void *param) {
  if (!wait_for_wifi(30000)) ESP.restart();      // 只连 2.4 GHz
  set_microros_wifi_transports(SSID, PASS, agent_ip, 8888);

  while (true) {
    if (!micro_ros_connected) {
      // 探测 Agent：通了才建实体，否则每秒重试
      if (rmw_uros_ping_agent(100, 1) == RMW_RET_OK) {
        if (create_entities()) micro_ros_connected = true;
      } else { delay(1000); continue; }
    }
    if (micro_ros_connected) {
      rcl_ret_t ret = rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100));
      // 连接丢失：销毁实体后重连，并断连即停
      if (ret != RCL_RET_OK || rmw_uros_ping_agent(100, 3) != RMW_RET_OK) {
        destroy_entities();
        target_l = target_r = 0;  moving = false;
        continue;
      }
      if (millis() - last_heartbeat_time > 1000) {   // 每秒一次心跳
        pub_msg.data = heartbeat_count++;
        rcl_publish(&heartbeat_publisher, &pub_msg, NULL);
        last_heartbeat_time = millis();
      }
    }
  }
}`}</Pre>
        <p className="text-[0.84rem] text-muted">
          完整固件见 <code>教学demo/ESP32-S3-microROS/src/main.cpp</code>；随 deck 下载{" "}
          <A href="./files/ESP32-S3-microROS.zip">files/ESP32-S3-microROS.zip</A>。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Skeleton = () => (
  <Frame
    kicker="固件"
    floor="05"
    title="初始化顺序是固定的：接传输 → 建节点 → 挂执行器"
    lead="micro-ROS 固件的骨架就五步，顺序不能换；换的只是回调里做什么。"
    wide
  >
    <div className="space-y-4">
      <Focus
        no="5"
        title="rclc 五步"
        tag="rclc"
        goal="「接传输 → 建 allocator/support → 建节点 → 建收发 → 交给 executor」，每一步的返回值都要检查。"
        points={[
          "连接：set_microros_wifi_transports(SSID, PASS, IPAddress(…), 8888)。",
          "内存与上下文：rcl_get_default_allocator + rclc_support_init。",
          "节点：rclc_node_init_default(&node, \"esp32_car\", \"\", &support)。",
          "收发：publisher / subscription / timer 都挂到 executor。",
          "loop()：rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100))。",
        ]}
        aside={
          <Code>{`set_microros_wifi_transports(
  "SSID", "PASS", IPAddress(192, 168, 31, 29), 8888);

allocator = rcl_get_default_allocator();
rclc_support_init(&support, 0, NULL, &allocator);
rclc_node_init_default(
  &node, "esp32_car", "", &support);`}</Code>
        }
      />
      <Steps title="展开：最小可编译固件 main.cpp（完整）">
        <Pre>{`#include <micro_ros_platformio.h>

#include <rcl/rcl.h>
#include <rclc/rclc.h>
#include <rclc/executor.h>

rcl_allocator_t allocator;
rclc_support_t  support;
rcl_node_t      node;

void setup() {
  // ① 接传输：Wi-Fi 名 / 密码 / Agent 的 IP / 端口
  set_microros_wifi_transports(
    "SSID", "PASS", IPAddress(192, 168, 31, 29), 8888);

  // ② 内存与上下文
  allocator = rcl_get_default_allocator();
  rclc_support_init(&support, 0, NULL, &allocator);

  // ③ 建节点（名字就是 ros2 node list 里看到的名字）
  rclc_node_init_default(&node, "esp32_car", "", &support);
}

void loop() {
  delay(100);   // ④⑤ 的收发在后面的页里挂上来
}`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Heartbeat = () => (
  <Frame
    kicker="固件"
    floor="06"
    title="发心跳：发布者 + 定时器，让 Pi 知道你在线"
    lead="S3 → Pi 的链路靠心跳证明：一个 publisher 加一个每秒触发的 timer，参数只有话题名、周期、作用三件事。"
    wide
  >
    <div className="space-y-4">
      <Code>{`rclc_publisher_init_default(&pub, &node,
  ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
  "esp32/heartbeat");

rclc_timer_init_default(
  &timer, &support, RCL_MS_TO_NS(1000), timer_cb);

rclc_executor_init(&executor, &support.context, 2, &allocator);
rclc_executor_add_timer(&executor, &timer);

void timer_cb(rcl_timer_t *t, int64_t last_call) {
  static int n = 0;
  msg.data = ++n;
  rcl_publish(&pub, &msg, NULL);   // 每秒一次
}`}</Code>
      <Grid cols={3}>
        <Card title="话题" icon={Send}>
          /esp32/heartbeat，示例用 std_msgs/Int32。
        </Card>
        <Card title="周期" icon={Gauge}>
          1000 ms；RCL_MS_TO_NS 把毫秒换成纳秒。
        </Card>
        <Card title="作用" icon={Activity}>
          证明 S3 在线，Pi 端可统计收包频率。
        </Card>
      </Grid>
      <Steps title="展开：加上发布者与定时器（完整固件）">
        <Pre>{`rcl_publisher_t pub;
std_msgs__msg__Int32 msg;
rcl_timer_t      timer;
rclc_executor_t  executor;

void timer_cb(rcl_timer_t *t, int64_t last_call) {
  msg.data++;
  rcl_publish(&pub, &msg, NULL);   // 每秒发一次
}

void setup() {
  /* …前面骨架的 ①②③ 三步… */

  // ④ 发布者 + 定时器
  rclc_publisher_init_default(&pub, &node,
    ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
    "esp32/heartbeat");
  rclc_timer_init_default(&timer, &support,
    RCL_MS_TO_NS(1000), timer_cb);

  // ⑤ 挂到 executor（句柄数 ≥ 实际实体数）
  rclc_executor_init(&executor, &support.context, 2, &allocator);
  rclc_executor_add_timer(&executor, &timer);
}

void loop() {
  rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100));
}`}</Pre>
        <p className="text-[0.84rem] text-muted">
          本课定稿的固件（合并了官方示例）不用定时器：心跳在后台任务里用{" "}
          <code>millis()</code> 计时发出；<code>rclc_timer</code> 是最小教学形式，两者等价。
        </p>
      </Steps>
    </div>
  </Frame>
);

const CmdVel = () => (
  <Frame
    kicker="固件"
    floor="07"
    title="收指令：订阅 /cmd_vel，回调里算、loop 里发"
    lead="Pi → S3 的链路收敛成一个回调：从 Twist 算出左右目标占空比，真正驱动放到核心 1。"
    wide
  >
    <div className="space-y-4">
      <Code>{`geometry_msgs__msg__Twist msg;
rclc_subscription_init_default(&sub, &node,
  ROSIDL_GET_MSG_TYPE_SUPPORT(geometry_msgs, msg, Twist),
  "/cmd_vel");
rclc_executor_add_subscription(
  &executor, &sub, &msg, cmd_cb, ON_NEW_DATA);

void cmd_cb(const void *msgin) {
  const geometry_msgs__msg__Twist *m =
      (const geometry_msgs__msg__Twist *)msgin;
  // 只算左右目标占空比；真正的库调用放到 loop()（核心 1）里做
  target_l = scale_duty(clampf(m->linear.x / MAX_LINEAR
                               - m->angular.z / MAX_ANGULAR, 1.0f));
  target_r = scale_duty(clampf(m->linear.x / MAX_LINEAR
                               + m->angular.z / MAX_ANGULAR, 1.0f));
  last_cmd_ms = millis();                // 用于断连停车
}`}</Code>
      <DataTable
        head={["字段", "含义", "接到板上（履带/两轮差速，M1 左、M2 右）"]}
        rows={[
          ["linear.x", "前后 m/s", "左右同向：左 = +x，右 = +x"],
          ["angular.z", "转向 rad/s", "z>0：左减右加 → 车头左转"],
          ["linear.y", "横移 m/s", "两轮车用不到，忽略"],
        ]}
      />
      <Steps title="展开：接官方电机库（lib/QGP_EVMotor + 链接参数）">
        <p className="text-[0.84rem] text-muted">
          官方 Arduino 库 <code>QGP_EVMotor</code>（奇果派提供）里电机是 <code>EMO_DCMotor</code>，
          <code>spin(-100~100)</code> 直接给开环占空比。工程内置的是它的
          <b>精简子集</b>（只留 <code>EMotionPI.h</code> + <code>ESP32Encoder.h</code> +{" "}
          <code>esp32s3/libqgpmotor.a</code>，0.86 MB；蓝牙手柄/PS2/MQTT/NimBLE 约 4.5 MB 已裁掉）。
        </p>
        <Pre>{`# platformio.ini：预编译库的归档名是 libqgpmotor.a，与库名 QGP_EVMotor 不一致，
# PIO 只加 LIBPATH，不会自动 -l，必须补这一行，否则链接报 undefined reference
build_flags =
  -Llib/QGP_EVMotor/src/esp32s3
  -lqgpmotor`}</Pre>
        <Pre>{`// src/main.cpp：本板实测配方（履带车、电机无编码器）
EMotionPI emo;
EMO_DCMotor *motor_l = nullptr, *motor_r = nullptr;
volatile float target_l = 0, target_r = 0;

void setup() {
  emo.begin();
  // 关键①：先 begin(减速比=90)。本板少了这句，所有 spin()/run() 都静默不出 PWM
  emo.getEncoderMotor(M1)->begin(90);
  emo.getEncoderMotor(M2)->begin(90);
  motor_l = emo.getMotor(M1);      // M1=0、M2=1（头文件里的通道宏）
  motor_r = emo.getMotor(M2);
  motor_l->spin(0); motor_r->spin(0);
  xTaskCreatePinnedToCore(microros_task, "microros_task", 10240, NULL, 1, NULL, 0);
}

void loop() {
  // 关键②：库调用只在核心 1 做（从 micro-ROS 任务里调 spin() 不出 PWM）
  if (moving && (millis() - last_cmd_ms) > 1000) {   // 1 s 没指令就停
    target_l = target_r = 0;
    moving = false;
  }
  motor_l->spin((int)target_l);    // 关键③：占空比映射到 60~100，
  motor_r->spin((int)target_r);    //        40~50 低于静摩擦阈值，轮子不动
}`}</Pre>
        <p className="text-[0.84rem] text-muted">
          官方示例里 <code>twist_callback</code> 只打印 <code>Received Twist message</code>；
          其余（WiFi 自检、<code>rmw_uros_ping_agent</code> 探测、断线 <code>destroy_entities()</code> 重连、
          任务内 <code>millis()</code> 发心跳）都照官方。
        </p>
        <p className="text-[0.84rem] text-muted">
          实测（2026-09，架空台架）：零速 <code>L=0 R=0</code>；前进 x=0.2 → <code>L=76 R=76</code>；
          后退 → <code>±76</code> 反向；z=+1.0 → <code>L=-80 R=80</code>（左退右进，车头左转）；
          z=-1.0 相反；停发 1 s 自动归零。<b>方向与停车全部正确</b>。
        </p>
        <p className="text-[0.84rem] text-muted">
          不要用 <code>BaseChassis::updateVelocity()</code> / <code>spinRPM()</code>：它们是
          「目标 RPM + PID」，无编码器时反馈恒为 0，PID 饱和到满 PWM——零速指令下轮子会自己转（实测踩过）。
          完整包（含手柄 / 示例）随 deck 下载{" "}
          <A href="./files/QGP_EVMotor.zip">files/QGP_EVMotor.zip</A>。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Params = () => (
  <Frame
    kicker="固件"
    floor="08"
    title="连接参数要填对：错一个，Agent 日志里就没有 S3"
    lead="四个参数对齐才有通路：Wi-Fi 双频段、Agent IP、端口、域号，每条都有踩过的坑。"
  >
    <Grid cols={2}>
      <Card title="Wi-Fi SSID / 密码" icon={Wifi} tone="warn">
        ESP32-S3 只支持 2.4 GHz。同名双频（2.4G/5G 一个名字）没问题——板子会自己连{" "}
        2.4 GHz 那条 BSS。
      </Card>
      <Card title="Agent IP" icon={Network}>
        填 Pi 在同一网段的地址（如 Wi-Fi 的 192.168.31.29），不是 127.0.0.1。
      </Card>
      <Card title="端口 8888" icon={Cable}>
        与 Agent 启动参数 <code>udp4 --port 8888</code> 一致。
      </Card>
      <Card title="不要设 ROS_DOMAIN_ID" icon={AlertTriangle} tone="warn">
        micro-ROS Agent 固定跑在默认域 0，客户端设成 42 就看不到话题（实测）。
      </Card>
    </Grid>
    <div className="mt-6 space-y-3">
      <p className="text-[0.88rem] leading-relaxed text-muted md:text-[0.95rem]">
        密码这类私密值别写进仓库：放到 <code>include/secrets.h</code>（已在{" "}
        <code>.gitignore</code> 里，模板 <code>secrets.example.h</code>），主固件里用{" "}
        <code>#ifndef</code> 兜底占位值。
      </p>
      <Quote>这些参数错一个，Agent 日志里就看不到 S3 连上来。</Quote>
    </div>
  </Frame>
);

const Transport = () => (
  <Frame
    kicker="部署"
    floor="09"
    title="传输方式怎么选：台架用串口，跑车用 Wi-Fi"
    lead="对比对象：串口（serial，有线直连）与 Wi-Fi（wifi，走 UDP4）。按稳定性 / 接线 / 移动性 / 适用阶段四个维度选。"
    wide
  >
    <div className="space-y-4">
      <TransportCompare />
      <Quote>
        辩证一问：什么情况下反而该选另一边？——只在台架上调固件、又不想被 Wi-Fi 环境干扰，串口最直接；
        一旦整车要跑起来，就别再让一根线拖住车，改用 Wi-Fi。
      </Quote>
      <Steps title="展开：传输方式逐项对比（表格）">
        <DataTable
          head={["维度", "串口（serial）", "Wi-Fi（wifi / UDP4）"]}
          rows={[
            [
              "稳定性",
              "有线直连，不受路由器与信道干扰；但长线或接触不良会掉",
              "依赖 2.4 GHz 信号与同网段，受路由器与干扰影响",
            ],
            [
              "接线",
              "USB / GPIO 串口线接到 Pi，容器要 --device 映射",
              <strong className="font-bold text-ink">无线，无需接线，S3 不用插着 Pi</strong>,
            ],
            [
              "移动性",
              "拖着一根线，车不能自由跑",
              "车可自由移动（本课默认）",
            ],
            [
              "适用阶段",
              "台架调试、固定安装",
              "遥控、跑车、整机验证",
            ],
            [
              "注意",
              "别和 serial monitor 抢同一个串口",
              "S3 只连 2.4 GHz 且与 Pi 同网段；Agent IP 不能写 127.0.0.1",
            ],
          ]}
        />
      </Steps>
      <Steps title="展开：串口传输的完整步骤（备选）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <code>platformio.ini</code> 里把 <code>board_microros_transport</code> 改成{" "}
            <code>serial</code>，固件里改用 <code>set_microros_transports()</code>。
          </li>
          <li>把板子用 USB 接到 Pi，确认串口设备：<code>ls -l /dev/ttyUSB* /dev/ttyACM*</code>。</li>
          <li>
            启动 Agent 时加上串口设备（容器要映射）：<code>--dev /dev/ttyUSB0</code>。
          </li>
        </ol>
        <Pre>{`# 容器内（映射串口后）
ros2 run micro_ros_agent micro_ros_agent serial --dev /dev/ttyUSB0 -b 115200

# 宿主机起容器时映射串口
docker run -it --rm --network host \\
  --device /dev/ttyUSB0 \\
  -v ~/microros_ws:/microros_ws ros:jazzy-ros-base bash`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Esp32Env = () => (
  <Frame
    kicker="部署"
    floor="10"
    title="ESP32 侧：PlatformIO 一键装依赖、编译、烧录"
    lead="官方示例就是 VSCode + PlatformIO；固件依赖 micro_ros_platformio，版本与传输都要对齐。"
    wide
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="为什么用 PlatformIO" icon={Wrench}>
          官方示例即 VSCode + PlatformIO；装依赖、编译、烧录一条龙。
        </Card>
        <Card title="micro-ROS 是依赖" icon={Download}>
          在 platformio.ini 里引用 micro_ros_platformio，固件头文件用 <code>micro_ros_platformio.h</code>。
        </Card>
        <Card title="板型与传输" icon={CircuitBoard}>
          板型选 ESP32-S3；传输选 <code>wifi</code>（或 <code>serial</code>）。
        </Card>
        <Card title="版本要对齐" icon={Layers}>
          固件 <code>board_microros_distro = jazzy</code>，与 Pi 上 ROS 2 版本一致。
        </Card>
      </Grid>
      <Code>{`[env:esp32-s3-devkitc-1]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
board_microros_distro = jazzy
board_microros_transport = wifi
lib_deps =
  https://github.com/micro-ROS/micro_ros_platformio.git`}</Code>
      <Steps title="展开：从零建工程（完整步骤）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            安装 VSCode，再装扩展 <b>PlatformIO IDE</b>；首次打开会自动安装 PlatformIO Core。
          </li>
          <li>
            PlatformIO Home → <b>New Project</b>：名称自定，Board 选{" "}
            <code>ESP32-S3-DevKitC-1</code>，Framework 选 <code>Arduino</code>。
          </li>
          <li>
            把生成的 <code>platformio.ini</code> 替换为上面的配置（板型、传输、micro-ROS 依赖）。
          </li>
          <li>
            保存后 PlatformIO 自动下载 espressif32 平台与 <code>micro_ros_platformio</code>；
            首次较慢，需能访问 GitHub（国内走本机 Clash 代理）。
          </li>
          <li>
            在 <code>src/main.cpp</code> 里 <code>#include &lt;micro_ros_platformio.h&gt;</code>，转到「固件骨架」页继续。
          </li>
        </ol>
        <p className="text-[0.84rem] text-muted">
          提示：关键是把 <code>board_microros_transport</code> 设为 <code>wifi</code> 或{" "}
          <code>serial</code>；SSID、密码与 Agent IP 在固件里设置（见「连接参数」页）。
        </p>
      </Steps>
      <Steps title="展开：Windows 上一次性编出 libmicroros（必看）">
        <p className="text-[0.84rem] text-muted">
          上游 <code>micro_ros_platformio</code> 首次构建会用 POSIX shell + <code>colcon</code>
          从源码编 micro-ROS 静态库，Windows 的 <code>cmd</code> 跑不了，报{" "}
          <code>{`'.' is not recognized`}</code>——这是上游限制，不是配置错。先在 WSL2
          （Ubuntu + ROS 2 Jazzy + colcon）里编一次，把 <code>libmicroros/</code> 拷回工程，
          之后 Windows 上 <code>pio run</code> 会打印 <code>micro-ROS already built</code> 直接链接。
        </p>
        <Pre>{`# 在 WSL 里执行（本仓库自带脚本）
bash /mnt/c/vibecoding/rsp/tools/microros_lib_wsl.sh

# 脚本做的事：装 PlatformIO → 同步工程 → pio run（编库+固件）→ 把 libmicroros 拷回工程
# 回到 Windows 工程：pio run 直接链接

# 改了 distro / transport 后要清库重编
pio run -t clean_microros   # 或删掉 .pio 库目录里的 libmicroros/，再跑上面的脚本`}</Pre>
        <p className="text-[0.84rem] text-muted">
          预编译的 <code>libmicroros.a</code> 约 60 MB，放在 <code>.pio/</code> 里，不入库。
        </p>
      </Steps>
    </div>
  </Frame>
);

const AgentSetup = () => (
  <Frame
    kicker="部署"
    floor="11"
    title="Pi 侧：在 ROS 2 容器里常驻一个 Agent"
    lead="Agent 要常驻、要 host 网络、要挂在容器外的工作区；顺序上先起 Agent，再给 S3 上电。"
    wide
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="构建来源" icon={Boxes}>
          官方源码 micro-ROS-Agent + micro_ros_msgs（jazzy 分支），用 colcon build。
        </Card>
        <Card title="构建产物要持久化" icon={Layers} tone="warn">
          <code>~/ros2.sh</code> 是 <code>--rm</code> 一次性容器；用 <code>-v</code> 把工作区挂进容器。
        </Card>
        <Card title="网络必须 host" icon={Network}>
          <code>--network host</code> 时 Agent 的 UDP 8888 才落在 Pi 的宿主网络上。
        </Card>
        <Card title="先起 Agent 再上电" icon={Play}>
          S3 上电后主动连 Agent；Agent 要先在监听，否则固件一直重连。
        </Card>
      </Grid>
      <Code>{`docker run -it --rm --network host \\
  -v ~/microros_ws:/microros_ws \\
  ros:jazzy-ros-base bash

# 容器内（首次先构建）
source /opt/ros/jazzy/setup.bash
cd /microros_ws && colcon build
source install/setup.bash
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888`}</Code>
      <Steps title="展开：Pi 上完整部署步骤（含拉源码）">
        <Pre>{`# --- 宿主机（Pi）上执行 ---
mkdir -p ~/microros_ws/src

docker run -it --rm --network host \\
  -v ~/microros_ws:/microros_ws \\
  --name microros \\
  ros:jazzy-ros-base bash

# --- 以下都在容器内执行 ---
source /opt/ros/jazzy/setup.bash
cd /microros_ws

# 首次：拉取官方 Agent 与消息包（jazzy 分支）
git clone -b jazzy \\
  https://github.com/micro-ROS/micro-ROS-Agent.git src/micro-ROS-Agent
git clone -b jazzy \\
  https://github.com/micro-ROS/micro_ros_msgs.git src/micro_ros_msgs

# 首次若缺依赖（可选）
apt-get update && apt-get install -y python3-rosdep
rosdep update
rosdep install --from-paths src --ignore-src -y

# 首次：编译 Agent
colcon build --symlink-install
source install/setup.bash

# 之后每次启动 Agent
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888`}</Pre>
        <p className="text-[0.84rem] text-muted">
          工作区挂载在宿主机 <code>~/microros_ws</code>，容器 <code>--rm</code> 退出也不丢；
          下次重进只需 <code>source /microros_ws/install/setup.bash</code>。
        </p>
      </Steps>
    </div>
  </Frame>
);

const BuildFlash = () => (
  <Frame
    kicker="部署"
    floor="12"
    title="编译与烧录：先 build，再 upload，别抢串口"
    lead="PlatformIO 三条命令走天下；首次编译慢、上传时别同时开串口监视器。"
    wide
  >
    <div className="space-y-4">
      <Code>{`# 在固件工程目录
pio run             # 编译
pio run -t upload   # 烧录
pio device monitor  # 查看串口日志`}</Code>
      <Grid cols={2}>
        <Card title="板型与端口" icon={CircuitBoard}>
          板子选 ESP32-S3；Type-C 连板，选对 USB 端口。
        </Card>
        <Card title="首次编译慢" icon={Gauge} tone="warn">
          会拉取 micro-ROS 源码并打补丁，需能访问 GitHub，第一次耐心等。
        </Card>
      </Grid>
      <Steps title="展开：从编译到烧录的完整流程">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Type-C 线连板；设备管理器里出现串口（缺驱动装 CP210x / CH34x）。</li>
          <li>PlatformIO 点 <b>Build</b>（等价 <code>pio run</code>）确认能编译通过。</li>
          <li>点 <b>Upload</b>（等价 <code>pio run -t upload</code>）；上传时别同时开串口监视器。</li>
          <li>看日志：<code>pio device monitor -b 115200</code>，<code>Ctrl+C</code> 退出。</li>
          <li>若卡在连接：按住 <b>BOOT</b> 再点 <b>RST</b> 进入下载模式后重试。</li>
        </ol>
        <Pre>{`pio run                        # 只编译
pio run -t upload              # 编译并烧录
pio device monitor -b 115200   # 看串口输出`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Startup = () => (
  <Frame
    kicker="验证"
    floor="13"
    title="启动顺序：先 Agent，再 S3；顺序反了也不用重启"
    lead="先把 Pi 侧全部就绪，再给 S3 上电；即使上电早了，固件也会按 ping 机制自动重连。"
    wide
  >
    <div className="space-y-4">
      <PointSteps
        hint="默认全绿＝静态兜底；点「逐步推进」走一遍（服务起 → 握手 → 话题通 → 收指令），也可点某一步跳过去。"
        steps={[
          { t: "烧固件", s: "把 micro-ROS 固件写进 S3（pio run -t upload），一次就好", tone: "board" },
          { t: "起 Agent（服务起）", s: "Pi 容器里先跑 udp4 --port 8888，占好端口等着板子来电", tone: "host" },
          { t: "S3 上电握手", s: "板子主动连 Agent，日志出现 session created —— 出现即通", tone: "host" },
          { t: "看话题（话题通）", s: "ros2 topic list 出现 /esp32/heartbeat、node list 出现 /esp32_car，全链贯通", tone: "ok" },
          { t: "按键收指令", s: "teleop 发 /cmd_vel，车轮跟着动、松手 1 s 停 —— 一收一发都通了", tone: "ok" },
        ]}
      />
      <Steps title="展开：三终端完整启动步骤">
        <Pre>{`# 每个终端先进入同一个容器
docker exec -it microros_agent bash
source /opt/ros/jazzy/setup.bash

# --- 终端 A：Agent（必须最先起）---
source /microros_ws/install/setup.bash
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888

# --- 终端 B：看心跳 ---
# 注意：不要 export ROS_DOMAIN_ID=42
# micro-ROS Agent 固定在默认域 0，客户端设成 42 就看不到任何话题（实测）
ros2 topic echo /esp32/heartbeat

# --- 终端 C：键盘控车 ---
# ros-base 不含 teleop，首次安装：
apt-get update && apt-get install -y ros-jazzy-teleop-twist-keyboard
ros2 run teleop_twist_keyboard teleop_twist_keyboard

# 三个终端都就绪后，最后给 ESP32-S3 上电`}</Pre>
        <p className="text-[0.84rem] text-muted">
          三个终端都在默认域 0 就好（<b>别设</b> <code>ROS_DOMAIN_ID</code>）；跨机时还要保证 DDS 发现可达。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Verify = () => (
  <Frame
    kicker="验证"
    floor="14"
    title="验证按顺序来：节点 → 话题 → 频率 → 指令"
    lead="一条通路从接入到可控，四级都能查到；Agent 日志是两端有没有牵手的证据。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["检查", "命令", "期望"]}
        rows={[
          ["节点接入", "ros2 node list", "出现 esp32_car"],
          ["话题存在", "ros2 topic list | grep esp32", "/esp32/heartbeat"],
          ["心跳频率", "ros2 topic hz /esp32/heartbeat", "约 1 Hz"],
          ["指令下发", "ros2 topic echo /cmd_vel", "按键后出现 Twist，车随之动/停"],
          ["Agent 日志", "session created", "S3 已连上"],
        ]}
      />
      <Steps title="展开：逐条验证命令与期望输出">
        <Pre>{`source /opt/ros/jazzy/setup.bash    # 不要设 ROS_DOMAIN_ID（Agent 在默认域 0）

ros2 node list                     # 期望：/esp32_car
ros2 topic list | grep heartbeat   # 期望：/esp32/heartbeat
ros2 topic hz /esp32/heartbeat     # 期望：average rate ≈ 1
ros2 topic echo /esp32/heartbeat   # 期望：data 递增
ros2 topic info /cmd_vel           # 期望：Publisher count ≥ 1

# 先跑 teleop 按键，确认指令真的到了 S3
ros2 topic echo /cmd_vel`}</Pre>
        <p className="text-[0.84rem] text-muted">
          节点名以固件里 <code>rclc_node_init_default</code> 的第一个参数为准（本课为{" "}
          <code>esp32_car</code>）。
        </p>
      </Steps>
      <Grid cols={2}>
        <Figure
          src={rosMonitor}
          alt="ESP32-S3 串口日志"
          caption="S3 串口：定时发 Heartbeat，收到 Twist 指令（图源：奇果派工坊）"
        />
        <Figure
          src={rosListener}
          alt="树莓派端心跳监听"
          caption="Pi 端 heartbeat_listener：按频率打印心跳"
        />
      </Grid>
    </div>
  </Frame>
);

const Pitfalls = () => (
  <Frame
    kicker="验证"
    floor="15"
    title="连不上别乱改：八成是网络、端口或初始化"
    lead="十一个高频坑按类别归好；先查 Agent 是否在监听、网段频段对不对，再怀疑固件。"
    wide
  >
    <div className="space-y-4">
      <p className="text-[0.86rem] leading-relaxed text-muted">
        排查先分路：<b className="text-brand-700">Wi-Fi 路</b>（UDP4，查 Agent 监听 / 同网段 2.4 GHz / 容器 host 网络）与{" "}
        <b className="text-brand-700">串口路</b>（查串口设备 / 容器 <code>--device</code> 映射 / 波特率与串口占用），
        两路都通后再查固件初始化。
      </p>
      <PointSteps
        hint="默认全亮＝静态兜底；连不上先分清走哪条路，再按顺序查，别一上来就乱改固件。"
        steps={[
          { t: "第 0 步：先分清走哪条路", s: "看 platformio.ini 的 board_microros_transport——wifi 走 UDP4、serial 走串口，两路排查点不同", tone: "host" },
          { t: "Wi-Fi 路①：Agent 在监听 8888 吗", s: "ss -lunp | grep 8888 没输出，就先起 Agent（udp4 --port 8888）", tone: "host" },
          { t: "Wi-Fi 路②：同网段 + 2.4 GHz 吗", s: "对一下填进固件的 Agent IP；S3 只连 2.4 GHz；容器要 --network host", tone: "host" },
          { t: "串口路：设备 / 波特率 / 别抢串口", s: "ls /dev/ttyUSB*；容器加 --device 映射；Agent 用 serial --dev … -b 115200，先关 serial monitor", tone: "host" },
          { t: "两路都通后：固件初始化 / 占空比对吗", s: "少了 begin(90) 就静默不出 PWM；spin 要到 60~100 才转", tone: "board" },
        ]}
      />
      <Grid cols={2}>
        <Card title="Agent 没起 / 端口被占" icon={AlertTriangle} tone="warn">
          8888 无监听，S3 一直重连。
        </Card>
        <Card title="IP 或网段错" icon={Network} tone="warn">
          S3 连的不是 Pi；确认与 Pi 在同一 Wi-Fi 网段。
        </Card>
        <Card title="只开了 5 GHz" icon={Wifi} tone="warn">
          ESP32-S3 连不上，改用 2.4 GHz 频段。
        </Card>
        <Card title="容器没加 host 网络" icon={Boxes} tone="warn">
          UDP 8888 只活在容器内，S3 到不了。
        </Card>
        <Card title="设了 ROS_DOMAIN_ID 就看不见" icon={Layers} tone="warn">
          Agent 固定在域 0；客户端设成 42 时 <code>ros2 topic list</code> 里连 <code>/esp32/heartbeat</code> 都没有。
        </Card>
        <Card title="串口被监视器占用" icon={Terminal} tone="warn">
          用 serial 传输时先关掉 serial monitor，再让 Agent 开门。
        </Card>
        <Card title="Windows 编库失败" icon={AlertTriangle} tone="warn">
          <code>'.' is not recognized</code>：Windows 编不了 libmicroros，先在 WSL 编一次（见「ESP32 侧环境」页）。
        </Card>
        <Card title="链接报 EMotionPI 未定义" icon={Wrench} tone="warn">
          缺 <code>-lqgpmotor</code>：PIO 只加 LIBPATH、不加 <code>-l</code>（见「收 /cmd_vel」页）。
        </Card>
        <Card title="发 /cmd_vel 完全不动" icon={RotateCcw} tone="warn">
          少了 <code>getEncoderMotor(M1/M2)-&gt;begin(90)</code>：驱动输出没初始化，<code>spin()</code> 静默不出 PWM。
        </Card>
        <Card title="占空比太小也不动" icon={Gauge} tone="warn">
          <code>spin(40~50)</code> 低于静摩擦阈值，轮子纹丝不动；60 起才走，100 满速。
        </Card>
        <Card title="零速时轮子自己转" icon={AlertTriangle} tone="warn">
          用了 <code>updateVelocity()</code> / <code>spinRPM()</code>（PID）：无编码器反馈恒 0，PID 饱和到满 PWM。
        </Card>
      </Grid>
      <Steps title="展开：连不上时的排查命令（分串口 / Wi-Fi 两路）">
        <Pre>{`# 第 0 步：先确认本课走哪条路
grep board_microros_transport platformio.ini      # wifi 或 serial

# --- 走 Wi-Fi（wifi / UDP4）时 ---
ss -lunp | grep 8888                              # 1) Agent 是否在监听 8888
ip -4 addr show wlan0                             # 2) Pi 的 IP（填进固件的那个）
docker inspect -f '{{.HostConfig.NetworkMode}}' microros   # 3) 期望 host
# 4) 网段与频段：S3 与 Pi 同网段可达且用 2.4 GHz；Agent IP 写成 127.0.0.1 永远连不上

# --- 走串口（serial）时 ---
ls -l /dev/ttyUSB* /dev/ttyACM*                   # 1) 串口设备是否认到
docker inspect -f '{{.HostConfig.Devices}}' microros        # 2) 容器是否映射了串口
# 3) Agent 用 serial --dev /dev/ttyUSB0 -b 115200；先关掉 serial monitor 再开门

# --- 两路通用 ---
# Agent 日志出现 session established / create session 即已连上
# 固件侧：补 getEncoderMotor(M1/M2)->begin(90)；占空比用 60~100`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame
    kicker="收尾"
    floor="16"
    title="下载入口：固件工程与官方示例随 deck 分发"
    lead="两件随 deck 离线可取：固件工程（含电机库精简子集）与官方 micro-ROS 示例源码。"
    wide
  >
    <DataTable
      head={["资源", "入口"]}
      rows={[
        [
          "固件工程（platformio.ini / src/main.cpp / README / lib/QGP_EVMotor）",
          <A href="./files/ESP32-S3-microROS.zip">files/ESP32-S3-microROS.zip（本地）</A>,
        ],
        [
          "官方 micro-ROS 示例源码（已并入本课固件结构）",
          <A href="./files/micro-ROS-official-src.zip">files/micro-ROS-official-src.zip（本地）</A>,
        ],
        [
          "官方电机库 QGP_EVMotor（含手柄 / 示例）",
          <A href="./files/QGP_EVMotor.zip">files/QGP_EVMotor.zip（本地）</A>,
        ],
        ["Pi 侧监听节点", <code className="text-[0.84rem]">教学demo/ESP32-S3-microROS/pi/heartbeat_listener.py</code>],
        ["文字版（完整口径）", <span>docs/ESP32-S3电机驱动板资料.md 第六节 ｜ docs/ROS2与micro-ROS选型.md 第六节</span>],
        ["官方示例网盘原链（提取码 5bg8）", <A href="https://pan.baidu.com/s/1L9PQhWvsiyluuN4WXUIEoA?pwd=5bg8">百度网盘</A>],
      ]}
    />
    <div className="mt-5">
      <Quote>
        zip 与源码随 deck 一起分发即可离线打开；源文件改动后同步刷新 <code>files/</code> 副本，别留两版。
      </Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：全部下载入口一览">
        <Pre>{`# 本地（随 deck 分发，离线可用）
files/ESP32-S3-microROS.zip          固件工程（platformio.ini、src/main.cpp、README、lib/QGP_EVMotor 精简子集）
files/micro-ROS-official-src.zip     官方 micro-ROS 示例源码
files/QGP_EVMotor.zip                官方电机库（含手柄 / 示例）

# 仓库内路径
教学demo/ESP32-S3-microROS/          固件工程与 Pi 侧 heartbeat_listener.py
docs/ESP32-S3电机驱动板资料.md        第六节：板级资料与 micro-ROS 对接
docs/ROS2与micro-ROS选型.md           第六节：何时引入 micro-ROS、本项目落地
docs/工具链与踩坑.md                  PlatformIO 镜像加速、WSL 编 libmicroros、QGP_EVMotor 链接参数

# 网盘（需登录百度账号）
官方 ROS 2 示例源码  https://pan.baidu.com/s/1L9PQhWvsiyluuN4WXUIEoA?pwd=5bg8`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Action = () => (
  <Frame
    kicker="收尾"
    floor="17"
    title="照清单做：先起 Agent，再上电，最后按键控车"
    lead="顺序与判据都固定：通路四级验完，才算把 S3 真正接进了 ROS 2。"
    wide
  >
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        <Card title="第一步：Pi 侧就绪" icon={Server}>
          容器加 <code>--network host</code>，先起 Agent（udp4 8888），再开监听与 teleop 两个终端。
        </Card>
        <div className="hidden items-center justify-center md:flex">
          <ArrowRight size={22} className="text-brand-400" />
        </div>
        <Card title="第二步：S3 上电" icon={Cpu} tone="good">
          固件连 2.4 GHz Wi-Fi、探到 Agent 就建实体；起晚了会自动重连，不用重启板子。
        </Card>
        <div className="hidden items-center justify-center md:flex">
          <ArrowRight size={22} className="text-brand-400" />
        </div>
        <Card title="第三步：按键控车" icon={Rocket}>
          teleop 发 <code>/cmd_vel</code>，车轮跟随；松开 1 s 自动停车。
        </Card>
      </div>
      <p className="text-[0.88rem] font-semibold text-ink">
        口诀：板等 Agent，Agent 等端口，端口等网络 —— 先起 Agent，再上电。
      </p>
      <Quote>
        验收判据：<code>ros2 node list</code> 有 <code>/esp32_car</code>、心跳约 1 Hz、按键后履带方向正确、松手即停。
      </Quote>
      <Steps title="展开：上机清单与下一步（2026-09 实测）">
        <Pre>{`# 1) Pi：容器 --network host；先起 Agent
docker run -d --name microros_agent --network host \\
  -v ~/microros_ws:/microros_ws ros:jazzy-ros-base bash -lc \\
  'source /opt/ros/jazzy/setup.bash; source /microros_ws/install/setup.bash; \\
   exec ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888'

# 2) Pi：监听 + 控车（不要 export ROS_DOMAIN_ID）
ros2 topic echo /esp32/heartbeat
ros2 run teleop_twist_keyboard teleop_twist_keyboard

# 3) S3：上电，观察 Agent 日志出现 session created

# 4) 验收：node list → /esp32_car；topic hz → ≈1 Hz；按键后车轮动、松手 1 s 内停

# 下一步：读编码器 / IMU，用 getOdometry() 往 ROS 2 发 /odom 等反馈话题`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Download}>
        下载：<A href="./files/ESP32-S3-microROS.zip">ESP32-S3-microROS.zip</A> 与{" "}
        <A href="./files/micro-ROS-official-src.zip">micro-ROS-official-src.zip</A>
        （另可离线取 <A href="./files/QGP_EVMotor.zip">QGP_EVMotor.zip</A>）；文字版见{" "}
        <code>docs/ESP32-S3电机驱动板资料.md</code> 第六节与 <code>docs/ROS2与micro-ROS选型.md</code> 第六节；
        背景与选型见 <code>ROS2与micro-ROS选型</code> deck，硬件与遥控见 <code>ESP32-S3电机驱动板</code> deck。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "连接链与记忆锚", group: "概览", el: <ChainAnchor /> },
  { nav: "通路与角色", group: "概览", el: <Pathway /> },
  { nav: "固件任务结构", group: "固件", el: <FirmwareTaskPage /> },
  { nav: "固件骨架", group: "固件", el: <Skeleton /> },
  { nav: "发心跳", group: "固件", el: <Heartbeat /> },
  { nav: "收 /cmd_vel", group: "固件", el: <CmdVel /> },
  { nav: "连接参数", group: "固件", el: <Params /> },
  { nav: "对比决策：传输方式", group: "部署", el: <Transport /> },
  { nav: "ESP32 侧环境", group: "部署", el: <Esp32Env /> },
  { nav: "Pi 侧 Agent", group: "部署", el: <AgentSetup /> },
  { nav: "编译与烧录", group: "部署", el: <BuildFlash /> },
  { nav: "启动顺序", group: "验证", el: <Startup /> },
  { nav: "验证清单", group: "验证", el: <Verify /> },
  { nav: "常见坑", group: "验证", el: <Pitfalls /> },
  { nav: "下载入口", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
