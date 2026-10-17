import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CircuitBoard,
  Wrench,
  Terminal,
  Download,
  AlertTriangle,
  Rocket,
  Boxes,
  Wifi,
  Gauge,
  Gamepad2,
  Smartphone,
  Cloud,
  Zap,
  Battery,
  Usb,
  Radio,
  Network,
  ArrowLeftRight,
  Cpu,
  Server,
  Cable,
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Stat, Pill, Steps, Pre, Figure } from "./components.jsx";

import boardFront from "./assets/board-front.jpg";
import wiringPower from "./assets/wiring-power.jpg";
import wiringEncoder from "./assets/wiring-encoder.jpg";
import flashTool from "./assets/flash-tool.jpg";
import arduinoAddzip from "./assets/arduino-addzip.jpg";
import arduinoBoard from "./assets/arduino-board.png";
import mixlyInstall from "./assets/mixly-install.png";
import remoteBle from "./assets/remote-ble.jpg";
import remoteRc from "./assets/remote-rc.jpg";
import iotMqtt from "./assets/iot-mqtt.jpg";

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
   纯前端：React state + setTimeout + CSS transition，无任何外链资源。
   默认全亮＝静态兜底（停帧 / 无 JS / 打印都完整可读）；播放时逐点 idle → active → done。
   颜色编码全册统一：蓝＝电源 / 硬件，橙＝信号 / PWM，绿＝验证通过。
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
  power: {
    on: "border-brand-400 bg-brand-50 text-brand-700",
    active: "border-brand-600 bg-brand-600 text-white",
  },
  signal: {
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
const PING_BG = { power: "bg-brand-400/50", signal: "bg-amber-400/50", good: "bg-emerald-400/50" };
const SEG_TONE = { power: "bg-brand-500", signal: "bg-warn2", good: "bg-good" };
const segClass = (side, st) =>
  st === "done" ? "bg-good" : st === "idle" ? "bg-line" : SEG_TONE[side] || "bg-warn2";
const nodeTone = (side, st) =>
  st === "done" ? DONE_TONE : st === "idle" ? IDLE_TONE : (SEQ_TONE[side] || SEQ_TONE.signal)[st];
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
      蓝＝电源 / 硬件
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-warn2" />
      橙＝信号 / PWM
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝验证通过
    </span>
  </div>
);

/* ---- 点式动画 ① 供电与信号链路（横向）：电池 → 稳压 → 驱动板 → 电机 → 编码器回读 ---- */
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
                    <span className={`absolute inset-0 animate-ping rounded-full ${PING_BG[s.side] || "bg-amber-400/50"}`} />
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

/* ---- 点式动画 ② 供电方案对比（逐方案点亮：单电源直驱 vs 稳压分路） ---- */
function PointCompare({ options, hint }) {
  const { statuses, play, reset, jump } = useSequence(options.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className={`grid gap-3 md:gap-4 ${options.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
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
              : s.side === "power"
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
      <p className="text-[1rem] font-extrabold leading-snug text-ink">先量电压、再看使能、最后才给 PWM</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        调试顺序不能反：先确认电源轨正常，再确认驱动输出已初始化（<code>begin(90)</code>），最后才发 PWM。
        顺序反了就会「串口正常、轮子不转」，白折腾半天。
      </p>
    </div>
    <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-warn2">生活化类比</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">驱动器＝电机的「变速箱 + 油门」</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        H 桥驱动就是给电机配的变速箱与油门：ESP32-S3 只负责「踩多深」（PWM 占空比 0–100），驱动级负责把电池的
        大电流喂给电机。油门踩太浅（占空比 &lt; 60）车就动不了——不是坏了，是没踩够。
      </p>
    </div>
    <div className="surface border-t-4 border-t-good p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-good">颜色编码</div>
      <div className="space-y-1.5 text-[0.9rem] font-semibold text-ink">
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-brand-600" />
          蓝＝电源 / 硬件
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-warn2" />
          橙＝信号 / PWM
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-good" />
          绿＝验证通过
        </p>
      </div>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        全册一致：看颜色就知道这一步在走电源与硬件、信号与 PWM，还是验证通过。
      </p>
    </div>
  </div>
);

/* 整体结构：Pi 算 + MCU 控（内联 SVG 结构关系图） */
const OverviewStructure = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 300"
      role="img"
      aria-label="Pi 算加 MCU 控的整体结构：树莓派 5 跑 ROS 2 做视觉与规划，经 Wi-Fi 上的 micro-ROS 与 ESP32-S3 电机驱动板双向通信；ESP32-S3 做硬实时底层，经四路 H 桥驱动电机与舵机，并回读编码器与 IMU；Pi 下发 cmd_vel 指令，板子上报心跳与状态"
      className="h-auto w-full"
    >
      <defs>
        <marker id="ov-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="ov-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>
      <text x="16" y="24" fill="#0f172a" fontSize="12" fontWeight="700">
        整体结构：Pi 算 + MCU 控，两端用 Wi-Fi 上的 micro-ROS 打通
      </text>

      <rect x="16" y="44" width="356" height="180" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="34" y="70" fill="#1a5cae" fontSize="12" fontWeight="700">① 树莓派 5 · 算（Linux）</text>
      <text x="34" y="94" fill="#0f172a" fontSize="11" fontWeight="700">ROS 2 Jazzy（Docker）</text>
      <text x="34" y="116" fill="#475569" fontSize="10">视觉采集 / 目标识别 / 路径规划</text>
      <text x="34" y="138" fill="#475569" fontSize="10">决策与多节点编排</text>
      <text x="34" y="166" fill="#0f172a" fontSize="10">输出：/cmd_vel 控制指令</text>
      <text x="34" y="186" fill="#475569" fontSize="10">订阅：/esp32/heartbeat 状态</text>
      <text x="34" y="210" fill="#94a3b8" fontSize="9">不直接驱动电机——交给 MCU</text>

      <rect x="528" y="44" width="356" height="180" rx="14" fill="#fffbeb" stroke="#fbbf24" />
      <text x="546" y="70" fill="#b4690e" fontSize="12" fontWeight="700">② ESP32-S3 电机驱动板 · 控（硬实时）</text>
      <text x="546" y="94" fill="#0f172a" fontSize="11" fontWeight="700">FreeRTOS 实时底层</text>
      <text x="546" y="116" fill="#475569" fontSize="10">四路 H 桥驱动电机 M1–M4（履带）</text>
      <text x="546" y="138" fill="#475569" fontSize="10">舵机 PWM ×4 · 编码器 ×4 · IMU</text>
      <text x="546" y="166" fill="#0f172a" fontSize="10">输入：/cmd_vel → 映射左右轮速</text>
      <text x="546" y="186" fill="#475569" fontSize="10">输出：PWM 60–100 · /esp32/heartbeat</text>
      <text x="546" y="210" fill="#94a3b8" fontSize="9">7×24 硬实时闭环，Linux 抖动不可接受</text>

      <line x1="376" y1="110" x2="524" y2="110" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#ov-blue)" />
      <text x="450" y="102" textAnchor="middle" fill="#1a5cae" fontSize="9">/cmd_vel 下行</text>
      <line x1="524" y1="160" x2="380" y2="160" stroke="#b4690e" strokeWidth="2" markerEnd="url(#ov-amber)" />
      <text x="450" y="178" textAnchor="middle" fill="#b4690e" fontSize="9">心跳 / 状态上行</text>
      <text x="450" y="126" textAnchor="middle" fill="#0f766e" fontSize="9">Wi-Fi · micro-ROS</text>

      <rect x="16" y="240" width="868" height="46" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="32" y="268" fill="#0f766e" fontSize="10">
        分工一句话：Pi 负责「想」，MCU 负责「做」——算力与内存留给 Pi，硬实时与底层 I/O 留给 S3。
      </text>
    </svg>
  </div>
);

/* 板载资源与接口分布：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） */
const BoardResources = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 460"
      role="img"
      aria-label="奇果派 S3 机器人控制板板载资源分布：左上为 ESP32-S3-WROOM-1-N8R8 模组，左下为四路电机驱动 M1 到 M4；中列为编码器接口四路与两个 I2C；右列为舵机 PWM 四路（引脚 5、6、7、15）与 OLED、IMU、电压检测接口；底部说明 Type-C 供电下载口与 6 到 24 伏电源输入"
      className="h-auto w-full"
    >
      <text x="16" y="24" fill="#0f172a" fontSize="12" fontWeight="700">
        板载资源与接口一览（算 · 驱 · 感 · 接口各就各位）
      </text>
      <rect x="16" y="40" width="868" height="352" rx="16" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="32" y="62" fill="#94a3b8" fontSize="9">
        控制板电源输入 6–24 V（按版本）· Type-C 供电 / 下载 · 额外 4 路 PWM
      </text>

      <rect x="36" y="74" width="250" height="118" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="52" y="98" fill="#1a5cae" fontSize="12" fontWeight="700">ESP32-S3 模组</text>
      <text x="52" y="120" fill="#0f172a" fontSize="10">ESP32-S3-WROOM-1-N8R8</text>
      <text x="52" y="140" fill="#475569" fontSize="10">LX7 双核 240 MHz</text>
      <text x="52" y="160" fill="#475569" fontSize="10">8 MB Flash · Wi-Fi + BLE</text>
      <text x="52" y="180" fill="#475569" fontSize="10">硬实时底层：控电机 / 舵机</text>

      <rect x="36" y="204" width="250" height="168" rx="12" fill="#fffbeb" stroke="#fbbf24" />
      <text x="52" y="228" fill="#b4690e" fontSize="12" fontWeight="700">四路电机驱动 M1–M4</text>
      <text x="52" y="250" fill="#0f172a" fontSize="10">12V 版：2.2 A/路（峰值 3.6 A）</text>
      <text x="52" y="270" fill="#0f172a" fontSize="10">24V 版：BTN8982，10 A/路</text>
      <text x="52" y="292" fill="#475569" fontSize="10">4 路直流，或 2 路步进（12V 版）</text>
      <text x="52" y="314" fill="#475569" fontSize="10">直流电机不分正负极，插反只倒转</text>
      <text x="52" y="338" fill="#b4690e" fontSize="10" fontWeight="700">占空比 60–100 才转得动（实测）</text>
      <text x="52" y="358" fill="#475569" fontSize="10">无编码器也要先 begin(90)</text>

      <rect x="306" y="74" width="250" height="118" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="322" y="98" fill="#0f766e" fontSize="12" fontWeight="700">编码器接口 ×4</text>
      <text x="322" y="120" fill="#0f172a" fontSize="10">M1–M4 各一路：VCC / GND / 信号</text>
      <text x="322" y="140" fill="#475569" fontSize="10">每个编码器占 2 个引脚</text>
      <text x="322" y="160" fill="#475569" fontSize="10">用满 4 路占正面 8 个引脚</text>
      <text x="322" y="180" fill="#b4690e" fontSize="10" fontWeight="700">板背有标识，VCC/GND 反接会烧</text>

      <rect x="306" y="204" width="250" height="118" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="322" y="228" fill="#0f766e" fontSize="12" fontWeight="700">I2C ×2</text>
      <text x="322" y="250" fill="#0f172a" fontSize="10">OLED 显示屏接一路</text>
      <text x="322" y="270" fill="#0f172a" fontSize="10">IMU 陀螺仪接一路</text>
      <text x="322" y="292" fill="#475569" fontSize="10">均不占用其它 I2C 设备</text>
      <text x="322" y="312" fill="#475569" fontSize="10">另带电压检测模块</text>

      <rect x="576" y="74" width="292" height="118" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="592" y="98" fill="#1a5cae" fontSize="12" fontWeight="700">舵机 / PWM ×4</text>
      <text x="592" y="120" fill="#0f172a" fontSize="10">官方示例引脚 5 · 6 · 7 · 15</text>
      <text x="592" y="140" fill="#475569" fontSize="10">每排三列：IO / 5 V / GND</text>
      <text x="592" y="160" fill="#475569" fontSize="10">官方示例支持 4 个舵机</text>
      <text x="592" y="180" fill="#b4690e" fontSize="10" fontWeight="700">三色线插反则舵机不动</text>

      <rect x="576" y="204" width="292" height="168" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="592" y="228" fill="#0f172a" fontSize="12" fontWeight="700">显示 / 姿态 / 电压检测</text>
      <text x="592" y="250" fill="#475569" fontSize="10">OLED 显示屏接口</text>
      <text x="592" y="270" fill="#475569" fontSize="10">IMU 陀螺仪（惯性测量单元）接口</text>
      <text x="592" y="290" fill="#475569" fontSize="10">电压检测模块</text>
      <text x="592" y="314" fill="#0f172a" fontSize="10">Type-C 供电 / 下载</text>
      <text x="592" y="334" fill="#475569" fontSize="10">固件控制台在 UART0 / 115200</text>
      <text x="592" y="358" fill="#b4690e" fontSize="10" fontWeight="700">USB 只够逻辑，带不动电机</text>

      <text x="32" y="416" fill="#475569" fontSize="10">
        算：ESP32-S3 跑实时底层；驱：四路 H 桥带 M1–M4；感：编码器 / IMU / 电压；接口：I2C ×2、舵机 PWM ×4、OLED。
      </text>
      <text x="32" y="438" fill="#b4690e" fontSize="10">
        供电：电机必须接 6–24 V 动力电池，逻辑由板载稳压单独取电——两条链路见下一页。
      </text>
    </svg>
  </div>
);

/* 供电与控制链路：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） */
const PowerChain = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 440"
      role="img"
      aria-label="供电与控制两条链路：动力电池 6 到 24 伏直接喂四路 H 桥驱动，并经板载稳压 5 伏 3.3 伏给 ESP32-S3 核心；ESP32-S3 用 PWM 与方向信号控制驱动级，驱动级输出到电机 M1 到 M4；编码器与 IMU 反馈回 ESP32-S3；ESP32-S3 经 Wi-Fi 与 micro-ROS 上行树莓派 5 的 ROS 2，Pi 下发 cmd_vel 指令"
      className="h-auto w-full"
    >
      <defs>
        <marker id="pc-amp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
        <marker id="pc-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="pc-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <text x="16" y="24" fill="#0f172a" fontSize="12" fontWeight="700">
        供电与控制两条链路：电池 → 驱动 → 电机；ESP32-S3 → PWM → 驱动，Wi-Fi 上行 Pi
      </text>

      <rect x="16" y="40" width="262" height="300" rx="14" fill="#fffbeb" stroke="#fbbf24" />
      <text x="32" y="64" fill="#b4690e" fontSize="12" fontWeight="700">① 电源域</text>
      <text x="32" y="88" fill="#0f172a" fontSize="11" fontWeight="700">动力电池 6–24 V</text>
      <text x="32" y="106" fill="#475569" fontSize="10">电压按电机与版本匹配</text>
      <text x="32" y="130" fill="#0f172a" fontSize="11" fontWeight="700">板载稳压 → 5 V / 3.3 V</text>
      <text x="32" y="148" fill="#475569" fontSize="10">只给逻辑与传感器取电</text>
      <text x="32" y="172" fill="#0f172a" fontSize="11" fontWeight="700">Type-C：供电 / 下载</text>
      <text x="32" y="190" fill="#b4690e" fontSize="10" fontWeight="700">USB 供电带不动电机</text>
      <text x="32" y="214" fill="#0f172a" fontSize="11" fontWeight="700">推荐动力型电池</text>
      <text x="32" y="232" fill="#475569" fontSize="10">大放电电流，换向瞬间扛得住</text>
      <text x="32" y="262" fill="#475569" fontSize="10">12V 版：6–12 V，最大 3 A</text>
      <text x="32" y="282" fill="#475569" fontSize="10">24V 版：6–24 V，最大 10 A</text>
      <text x="32" y="312" fill="#475569" fontSize="10">供电不足 → 系统工作不稳</text>

      <rect x="316" y="40" width="232" height="300" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="332" y="64" fill="#1a5cae" fontSize="12" fontWeight="700">② 驱动与执行</text>
      <text x="332" y="88" fill="#0f172a" fontSize="11" fontWeight="700">四路 H 桥驱动</text>
      <text x="332" y="106" fill="#475569" fontSize="10">12V 版高性能芯片</text>
      <text x="332" y="124" fill="#475569" fontSize="10">24V 版 BTN8982</text>
      <text x="332" y="148" fill="#0f172a" fontSize="11" fontWeight="700">输出 M1–M4</text>
      <text x="332" y="166" fill="#475569" fontSize="10">4 路直流或 2 路步进</text>
      <text x="332" y="190" fill="#0f172a" fontSize="11" fontWeight="700">驱动信号</text>
      <text x="332" y="208" fill="#475569" fontSize="10">PWM 调速 + 方向</text>
      <text x="332" y="226" fill="#475569" fontSize="10">run / spin / brake</text>
      <text x="332" y="250" fill="#b4690e" fontSize="10" fontWeight="700">占空比 60–100 才转</text>
      <text x="332" y="270" fill="#475569" fontSize="10">40–50 低于静摩擦阈值不动</text>
      <text x="332" y="294" fill="#475569" fontSize="10">及时 spin(0) 做安全保护</text>

      <rect x="606" y="40" width="278" height="300" rx="14" fill="#f0fdfa" stroke="#5eead4" />
      <text x="622" y="64" fill="#0f766e" fontSize="12" fontWeight="700">③ 控制与上级</text>
      <text x="622" y="88" fill="#0f172a" fontSize="11" fontWeight="700">ESP32-S3 核心</text>
      <text x="622" y="106" fill="#475569" fontSize="10">生成 PWM、读传感器</text>
      <text x="622" y="130" fill="#0f172a" fontSize="11" fontWeight="700">传感器回读</text>
      <text x="622" y="148" fill="#475569" fontSize="10">编码器 ×4 · IMU · 电压</text>
      <text x="622" y="172" fill="#0f172a" fontSize="11" fontWeight="700">上行通路</text>
      <text x="622" y="190" fill="#475569" fontSize="10">Wi-Fi → micro-ROS → Pi 5</text>
      <text x="622" y="208" fill="#475569" fontSize="10">节点名 esp32_car</text>
      <text x="622" y="232" fill="#0f172a" fontSize="11" fontWeight="700">指令通路</text>
      <text x="622" y="250" fill="#475569" fontSize="10">Pi 发 /cmd_vel → 板子控车</text>
      <text x="622" y="274" fill="#0f172a" fontSize="11" fontWeight="700">调试通路</text>
      <text x="622" y="292" fill="#475569" fontSize="10">USB-C → UART0 / 115200</text>
      <text x="622" y="316" fill="#475569" fontSize="10">库调用只在核心 1</text>

      <line x1="278" y1="100" x2="312" y2="100" stroke="#b4690e" strokeWidth="2" markerEnd="url(#pc-amp)" />
      <text x="297" y="92" textAnchor="middle" fill="#b4690e" fontSize="9">电机功率</text>
      <line x1="548" y1="150" x2="602" y2="150" stroke="#0d9488" strokeWidth="2" markerEnd="url(#pc-teal)" />
      <text x="575" y="142" textAnchor="middle" fill="#0f766e" fontSize="9">编码器 / IMU</text>
      <line x1="606" y1="196" x2="552" y2="196" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#pc-blue)" />
      <text x="579" y="188" textAnchor="middle" fill="#1a5cae" fontSize="9">PWM / 方向</text>

      <rect x="16" y="360" width="868" height="66" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="32" y="384" fill="#0f172a" fontSize="10">供电原则：电池直接喂驱动级（大电流），逻辑由板载稳压单独取电；USB 供电只能跑逻辑、不能带电机。</text>
      <text x="32" y="404" fill="#475569" fontSize="10">
        安全提醒：加「N ms 无指令就 spin(0)」保护；长时间跑用动力型电池，避免换向压降把逻辑拖复位。
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
      ESP32-S3 电机驱动板
      <br />
      <span className="text-brand-600">奇果派 S3 机器人控制板</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      结论先行：这块板就是「<b>Pi 算 + MCU 控</b>」里的执行层——树莓派 5 跑 ROS 2 做视觉与规划，
      ESP32-S3（乐鑫微控制器，Microcontroller Unit）做硬实时底层，直接驱动电机、舵机、编码器与 IMU。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整步骤与命令，完整资料见 <code>docs/ESP32-S3电机驱动板资料.md</code>。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="Pi 算 + MCU 控：这块板是实时执行层，不是主控"
    lead="定位先说清：ESP32-S3 负责硬实时与底层 I/O，树莓派 5 负责视觉与规划；板子经 micro-ROS 接入 ROS 2 图，成为一等节点。"
  >
    <Grid cols={2}>
      <Card title="它是什么" icon={CircuitBoard}>
        ESP32-S3-WROOM-1-N8R8 模组 + 四路电机驱动 + 编码器 / I2C / 舵机等接口的集成板，官方定位「智能小车解决方案」。
      </Card>
      <Card title="为什么让 MCU 控" icon={Zap}>
        电机闭环、舵机时序要硬实时；Linux 调度有毫秒抖动，放 MCU 上最稳。
      </Card>
      <Card title="怎么接进 ROS 2" icon={Network}>
        板子走 micro-ROS 进 ROS 2 图：Pi 发 <code>/cmd_vel</code>，板子发 <code>/esp32/heartbeat</code>。
      </Card>
      <Card title="不要搞反边" icon={AlertTriangle} tone="warn">
        别指望它跑视觉或规划——8 MB Flash、无操作系统，算力与内存都不够；视觉留给 Pi。
      </Card>
    </Grid>
    <div className="mt-5">
      <OverviewStructure />
    </div>
    <div className="mt-6">
      <Quote>本项目结构 = 树莓派 5（算）+ ESP32-S3 电机驱动板（控），两端用 Wi-Fi 上的 micro-ROS 打通。</Quote>
    </div>
  </Frame>
);

const BoardMap = () => (
  <Frame
    kicker="硬件"
    floor="02"
    title="板载资源一次看全：算、驱、感、接口各就各位"
    lead="先把资源认全：算在 ESP32-S3 模组，驱在四路 H 桥，感在编码器与 IMU，接口给 I2C、舵机 PWM 与 OLED。"
    wide
  >
    <div className="space-y-4">
      <BoardResources />
      <Quote>引脚与资源明细见下方折叠（与 docs 同源）：舵机 5 · 6 · 7 · 15，编码器每路占 2 个引脚。</Quote>
      <Steps title="展开：板载资源与接口明细（引脚 / 电流 / 供电）">
        <DataTable
          head={["资源", "规格", "备注"]}
          rows={[
            ["主控模组", "ESP32-S3-WROOM-1-N8R8：LX7 双核 240 MHz，8 MB Flash", "集成 Wi-Fi + 蓝牙（BLE）"],
            ["电机驱动", "4 路直流；12V 版 2.2 A/路（峰值 3.6 A），24V 版 BTN8982 10 A/路", "12V 版 2 路可改步进"],
            ["编码器接口", "4 路，M1–M4 各一路 VCC / GND / 信号", "每个编码器占 2 个引脚；用满 4 路占正面 8 个引脚"],
            ["舵机 / PWM", "额外 4 路 PWM，官方示例引脚 5 · 6 · 7 · 15", "每排三列 IO / 5 V / GND；插反则舵机不动"],
            ["I2C", "2 路，接 OLED 显示屏与 IMU 陀螺仪", "不占用其它 I2C 设备"],
            ["其它", "电压检测模块、Type-C 供电 / 下载", "控制台在 UART0 / 115200"],
            ["供电", "12V 版 6–12 V 最大 3 A；24V 版 6–24 V 最大 10 A", "务必用动力型电池"],
          ]}
        />
        <Pre>{`# 引脚速记（官方示例口径）
舵机 S1–S4   ->  5 / 6 / 7 / 15（每排 IO、5V、GND）
编码器 M1–M4 ->  电源线插蓝色接口，编码器数据线插白色接口
通道号       ->  M1=0 M2=1 M3=2 M4=3（EMotionPI.h）；getMotor(4) 越界

# 电压量程
12V 版 EMO_Lite  4.5–13.5 V（推荐输入 6–12 V / 3 A）
24V 版 EM_MAX    6–24 V（推荐输入匹配电机 / 10 A），芯片最高 30 A 但长期发热大、不建议`}</Pre>
        <p className="text-[0.84rem] text-muted">
          完整参数与原理图见 <code>docs/ESP32-S3电机驱动板资料.md</code> 第一节；原理图 PDF 随 deck 分发。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Versions = () => (
  <Frame
    kicker="硬件"
    floor="03"
    title="先按电机电压选版本：12V 版通用，24V 版为大电流"
    lead="两版模组相同，差别在驱动芯片与电流能力；版本跟着电机电压走，别先看价格。"
    wide
  >
    <DataTable
      head={["项", "12V 版（EMO_Lite）", "24V 版（EM_MAX）"]}
      rows={[
        ["模组", "ESP32-S3-WROOM-1-N8R8，8 MB Flash", "同左"],
        ["驱动芯片", "高性能驱动芯片", "BTN8982"],
        ["电机", "4 路直流 或 2 路步进", "4 路直流"],
        [
          "单路电流",
          "2.2 A（峰值 3.6 A）",
          <strong className="font-bold text-ink">10 A（芯片最高 30 A，长期发热大、不建议）</strong>,
        ],
        ["电机电压", "4.5–13.5 V", "6–24 V"],
        ["推荐输入", "6–12 V，最大 3 A", "6–24 V（匹配电机），最大 10 A"],
      ]}
    />
    <div className="mt-5">
      <Quote>
        原理图已存本地：<A href="./files/SCH_EMO_Lite.pdf">EMO_Lite.pdf</A> /{" "}
        <A href="./files/SCH_EMO_MAX_3-V1.0_USE.pdf">EM_MAX.pdf</A>（随 deck 分发）。
      </Quote>
    </div>
  </Frame>
);

/* 供电与信号链路（点式动画 ① 的数据）：电池 → 稳压 → 驱动板 → 电机 → 编码器回读 */
const SUPPLY_CHAIN = [
  { no: "1", title: "动力电池 6–24 V", sub: "务必动力型，按版本匹配", side: "power" },
  { no: "2", title: "板载稳压 5 V / 3.3 V", sub: "只给逻辑与传感器取电", side: "power" },
  { no: "3", title: "四路 H 桥驱动板", sub: "12V 版高性能芯片 / 24V 版 BTN8982", side: "power" },
  { no: "4", title: "电机 M1–M4（PWM）", sub: "占空比 60–100 才转得动", side: "signal" },
  { no: "5", title: "编码器 / IMU 回读", sub: "反馈回 ESP32-S3 闭算", side: "signal" },
];

const SupplySignalFlow = () => (
  <Frame
    kicker="硬件"
    floor="04"
    title="供电与信号一条链走完：电池 → 稳压 → 驱动板 → 电机 → 编码器回读"
    lead="先记住这条链的顺序（蓝＝电源 / 硬件、橙＝信号 / PWM）；走通一遍全转绿。接线与排障都顺着这条链找。"
    wide
  >
    <div className="space-y-4">
      <PointFlow
        steps={SUPPLY_CHAIN}
        hint="逐点点亮：灯走到哪，链路记到哪；点节点可手动跳到该步。"
      />
      <div className="mt-1">
        <Grid cols={3}>
          <Stat value="6–24" unit="V" label="动力电池供电范围（按版本匹配电机电压）" />
          <Stat value="4" unit="路" label="H 桥输出 M1–M4，4 路直流或 2 路步进" tone="brand" />
          <Stat value="60" unit="起" label="占空比阈值：低于 60 因静摩擦不转（实测）" tone="good" />
        </Grid>
      </div>
      <Quote>记忆锚（先记顺序）：口诀「先量电压、再看使能、最后才给 PWM」——链路顺序与排障顺序同源。</Quote>
    </div>
  </Frame>
);

const PowerChainPage = () => (
  <Frame
    kicker="硬件"
    floor="05"
    title="供电与控制分两条：电机走电池，逻辑走稳压"
    lead="认清两条链路再接线：电池功率直接进驱动级，逻辑由板载稳压单独取电；控制信号从 ESP32-S3 下到驱动级。"
    wide
  >
    <div className="space-y-4">
      <PowerChain />
      <Grid cols={3}>
        <Stat value="6–24" unit="V" label="动力电池供电范围（按版本匹配电机电压）" />
        <Stat value="4" unit="路" label="H 桥输出 M1–M4，4 路直流或 2 路步进" tone="brand" />
        <Stat value="60" unit="起" label="占空比阈值：低于 60 因静摩擦不转（实测）" tone="good" />
      </Grid>
    </div>
  </Frame>
);

/* 供电方案对比（点式动画 ② 的数据）：单电源直驱 vs 稳压分路 */
const POWER_OPTIONS = [
  {
    name: "电池直驱（单电源）",
    sub: "一条动力电池进板，逻辑由板载稳压取电；接线最简，适合台架快速验证。",
    metrics: [
      { label: "接线复杂度", value: "最低·一条电池线", pct: 15, tone: "good" },
      { label: "抗扰与稳定性", value: "换向压降会窜到逻辑侧", pct: 45, tone: "warn" },
      { label: "长时间跑适用面", value: "较窄·易被电机拖崩", pct: 30, tone: "warn" },
    ],
  },
  {
    name: "稳压分路（电机 / 逻辑分开）",
    sub: "电机电源独立，逻辑走单独稳压；两路输入，抗换向压降与噪声更稳。",
    metrics: [
      { label: "接线复杂度", value: "较高·需分线或加稳压", pct: 70, tone: "warn" },
      { label: "抗扰与稳定性", value: "逻辑独立、复位更稳", pct: 90, tone: "good" },
      { label: "长时间跑适用面", value: "更广·多舵机 / 大电流", pct: 88, tone: "good" },
    ],
  },
];

const PowerDecision = () => (
  <Frame
    kicker="硬件"
    floor="06"
    title="供电方案怎么选：单电池直驱省事，稳压分路更稳"
    lead="对比对象：一条动力电池进板、逻辑由板载稳压取电（单电源直驱），还是电机与逻辑分开供电（稳压分路）。"
    wide
  >
    <div className="space-y-4">
      <PointCompare
        options={POWER_OPTIONS}
        hint="逐方案点亮：先看接线，再看抗扰，最后看适用面；点方案可手动跳到该列。"
      />
      <DataTable
        head={["维度", "电池直驱（单电源）", "稳压分路（电机 / 逻辑分开）"]}
        rows={[
          ["接线复杂度", "一条电池线进板，最简", "两路输入，需分线或额外稳压模块"],
          ["电流能力", "电机电源直连驱动级，不受稳压器限流", "电机独立取电，逻辑不被电机压降拖垮"],
          ["干扰与稳定性", "换向噪声与压降会窜到逻辑侧", "逻辑独立稳压，抗扰与复位更稳"],
          [
            "电压匹配",
            "电池电压须落在板与电机量程内",
            "可分别匹配逻辑 5 V / 3.3 V 与电机电压",
          ],
          ["适用场景", "教学、台架快速验证", "长时间跑、多舵机或大电流电机"],
        ]}
      />
      <Quote>
        辩证一问：什么情况下反而该选另一边？——只接一两个直流电机、只做台架验证，单电源直驱最省事；
        一旦要长时间跑、带舵机或大电流电机，就该怀疑逻辑被电机拖崩，改为稳压分路。
      </Quote>
      <Steps title="展开：供电方案的判断依据与官方口径">
        <Pre>{`# 官方明确：供电不足会使系统工作不稳定，推荐【动力型】电池（大放电电流）
# 12V 版  推荐输入 6–12 V，最大 3 A
# 24V 版  推荐输入 6–24 V（匹配电机），最大 10 A
# 台架实测：USB 供电能跑逻辑、能烧录，但带电机不可靠——电机功率必须走 6–24 V 动力电池

# 单电源直驱：电池 -> 板载稳压 -> 5V/3.3V 逻辑；电池 -> 驱动级
# 稳压分路：电机电源独立，逻辑经单独稳压模块；抗换向压降与噪声
# 判断：长时间跑 / 多舵机 / 大电流 -> 分路；快速验证 -> 直驱`}</Pre>
        <p className="text-[0.84rem] text-muted">
          对比表与完整口径已同步 <code>docs/ESP32-S3电机驱动板资料.md</code> 第二节。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Wiring = () => (
  <Frame
    kicker="硬件"
    floor="07"
    title="接线认准接口：电机不分正负，编码器反接会烧"
    lead="四类接线各自记住一条：直流电机只看转向、编码器看标识、舵机看颜色顺序、供电看电池。"
  >
    <Grid cols={2}>
      <Card title="普通有刷直流电机" icon={Wrench}>
        电源线插蓝色电机接口，不分正负极；测试发现转向反了，就对调电机正负极。
      </Card>
      <Card title="编码器电机" icon={Gauge}>
        电源线插蓝色接口，编码器数据线插对应的白色接口。
      </Card>
      <Card title="第三方编码器" icon={AlertTriangle} tone="warn">
        板背有引脚标识，VCC / GND 接反会短路烧件；每个编码器占 2 引脚，用满 4 路占正面 8 个引脚。
      </Card>
      <Card title="舵机" icon={Radio}>
        官方示例对应引脚 5 / 6 / 7 / 15，每排 IO / 5 V / GND；三色线插反则舵机不动。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>供电不足会使系统工作不稳定——官方推荐使用动力型（大放电电流）电池。</Quote>
    </div>
    <div className="mt-4">
      <Grid cols={2}>
        <Figure src={wiringPower} alt="供电接线" caption="供电接线：DC 5.5-2.1 接口或电池接口（6–12 V）" />
        <Figure src={wiringEncoder} alt="编码器接口引脚" caption="编码器接口：M1–M4 的 VCC / GND / 信号" />
      </Grid>
    </div>
  </Frame>
);

const DevPaths = () => (
  <Frame
    kicker="开发"
    floor="08"
    title="四条开发路径：只想看效果就先烧录，不写代码"
    lead="同一块板四条路，按上手难度排序；入门与进阶源码可以并存，不冲突。"
    wide
  >
    <DataTable
      head={["路径", "适合", "备注"]}
      rows={[
        ["程序烧录工具", "不写代码（仅 Windows）", "刷官方示例；集成板选 ESP32-S3 板型"],
        ["Arduino IDE", "C++ 入门", "导入 QGP_EVMotor 库 + 官方示例"],
        ["Mixly 米思奇", "图形化编程", "已配插件环境，适合教学"],
        ["VSCode + PlatformIO", "进阶", "出厂 / 进阶源码，需找客服索取"],
      ]}
    />
    <div className="mt-5">
      <Quote>路径只影响「怎么写代码」，不影响接线与供电——前两页的硬件结论与选哪条路无关。</Quote>
    </div>
    <div className="mt-4">
      <Figure
        src={flashTool}
        alt="奇果派程序烧录工具"
        caption="程序烧录工具：选 ESP32-S3 板型、自动检测端口、一键烧录（图源：奇果派工坊）"
      />
    </div>
  </Frame>
);

/* Arduino IDE 五步流程：内联 SVG 流程图（离线单文件，不用 ASCII 字符画 / 线框图） */
const ArduinoSteps = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 178"
      role="img"
      aria-label="Arduino IDE 跑通示例的五步流程：装好 Arduino IDE 与 esp32 支持，导入 QGP_EVMotor 库压缩包，打开官方示例并另存，选择 ESP32S3 Dev Module 与 USB 端口，最后上传即跑通"
      className="h-auto w-full"
    >
      <defs>
        <marker id="ar-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1f72d6" />
        </marker>
      </defs>
      <text x="16" y="22" fill="#0f172a" fontSize="12" fontWeight="700">
        Arduino IDE 五步：装环境 → 导入库 → 开示例 → 选板选口 → 上传
      </text>

      {[
        { x: 16, no: "1", t: "装 Arduino IDE", s: "开发板管理装 esp32 支持" },
        { x: 194, no: "2", t: "导入库", s: "项目 → 导入库 → 添加 .ZIP" },
        { x: 372, no: "3", t: "打开示例", s: "文件 → 示例 → QGP_EVMotor" },
        { x: 550, no: "4", t: "选板选口", s: "ESP32S3 Dev Module + 端口" },
        { x: 728, no: "5", t: "点上传", s: "Type-C 连板即烧录" },
      ].map((n) => (
        <g key={n.no}>
          <rect x={n.x} y="52" width="156" height="86" rx="12" fill="#eff8ff" stroke="#93cdfb" />
          <circle cx={n.x + 26} cy="80" r="13" fill="#1f72d6" />
          <text x={n.x + 26} y="85" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
            {n.no}
          </text>
          <text x={n.x + 46} y="85" fill="#0f172a" fontSize="11" fontWeight="700">
            {n.t}
          </text>
          <text x={n.x + 14} y="112" fill="#475569" fontSize="9.5">
            {n.s}
          </text>
        </g>
      ))}
      {[172, 350, 528, 706].map((x) => (
        <line key={x} x1={x} y1="95" x2={x + 22} y2="95" stroke="#1f72d6" strokeWidth="2" markerEnd="url(#ar-arrow)" />
      ))}
      <rect x="16" y="150" width="868" height="22" rx="8" fill="#f0fdfa" stroke="#5eead4" />
      <text x="32" y="166" fill="#0f766e" fontSize="9.5">
        先点 Build 确认能编译，再点 Upload 烧录；上传时别同时开串口监视器。
      </text>
    </svg>
  </div>
);

const ArduinoFlow = () => (
  <Frame
    kicker="开发"
    floor="09"
    title="Arduino IDE 五步能跑起示例：装库 → 开发板 → 上传"
    lead="官方提供 ESP32 示例，覆盖蓝牙手柄、PS2 手柄与直流电机、舵机、编码器、电压、陀螺仪、OLED 的用法。"
    wide
  >
    <div className="mb-4">
      <ArduinoSteps />
    </div>
    <Focus
      no="05"
      title="从装环境到上传"
      tag="Arduino IDE"
      goal="五步走完就能跑通官方示例；示例先另存再改，避免改动污染库目录。"
      points={[
        "装好 Arduino IDE（新手可看官网《安装三板斧》）。",
        "下载库 QGP_EVMotor.zip，用「项目 → 导入库 → 添加 .ZIP 库」导入。",
        "打开「文件 → 示例 → QGP_EVMotor」，先另存再改。",
        "工具 → 开发板 → esp32 → ESP32S3 Dev Module，选对 USB 端口。",
        "Type-C 连板，点上传即可。",
      ]}
      aside={
        <Code>
          库更新：先删旧目录再重导
          <br />
          Documents\Arduino\libraries\QGP_EVMotor
          <br />
          <br />
          #include "StickCB.h"
          <br />
          BLEControlStick _joy;
          <br />
          _joy.setStickCallback(new StickCB());
          <br />
          _joy.begin(); _joy.update();
        </Code>
      }
    />
    <div className="mt-4">
      <Steps title="展开：Arduino IDE 从装库到烧录（完整步骤）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>装 Arduino IDE，并在开发板管理器安装 esp32 支持。</li>
          <li>下载 <A href="./files/QGP_EVMotor.zip">QGP_EVMotor.zip</A>，用「项目 → 导入库 → 添加 .ZIP 库」导入。</li>
          <li>更新库时先删 <code>Documents\Arduino\libraries\QGP_EVMotor</code> 再重导。</li>
          <li>打开「文件 → 示例 → QGP_EVMotor」，先另存为再改。</li>
          <li>工具 → 开发板 → esp32 → <code>ESP32S3 Dev Module</code>，选对端口后上传。</li>
        </ol>
        <Pre>{`#include "StickCB.h"
#include "EMotionPI.h"

BLEControlStick _joy;
EMotionPI emo;

void setup() {
  _joy.setStickCallback(new StickCB());
  _joy.begin();
}

void loop() {
  _joy.update();          // 刷新手柄状态
  if (_joy.Button(BTN_DPAD_UP)) { /* 前进 */ }
}`}</Pre>
      </Steps>
    </div>
    <div className="mt-4">
      <Grid cols={2}>
        <Figure src={arduinoAddzip} alt="Arduino 导入 ZIP 库" caption="项目 → 导入库 → 添加 .ZIP 库" />
        <Figure src={arduinoBoard} alt="选择开发板" caption="工具 → 开发板 → ESP32S3 Dev Module" />
      </Grid>
    </div>
  </Frame>
);

const ArduinoApi = () => (
  <Frame
    kicker="开发"
    floor="10"
    title="常用 API 就这几组，但无编码器电机也要先 begin(90)"
    lead="直流电机、舵机、编码器电机各有几个方法；真机实测最关键的初始化不能省——它同时负责打开电机驱动输出。"
    wide
  >
    <Code>
      EMotionPI emo;
      <br />
      EMO_DCMotor *m1 = emo.getMotor(M1);
      <br />
      m1-&gt;run(FORWARD); m1-&gt;setSpeed(100);
      <br />
      EMO_Servo *s1 = emo.getServo(S1);
      <br />
      EMO_EncoderMotor *e1 = emo.getEncoderMotor(M1);
      <br />
      e1-&gt;begin(90); &nbsp;&nbsp;// 齿数比 1:90
    </Code>
    <div className="mt-5">
      <DataTable
        head={["对象", "方法", "作用"]}
        rows={[
          ["直流电机", "run(FORWARD / BACKWARD)", "前进 / 后退"],
          ["直流电机", "setSpeed(0–100)", "转速；过低可能转不动"],
          ["直流电机", "brake(0–100)", "主动刹车"],
          ["舵机", "write(角度) / read()", "设定 / 读取角度"],
          ["编码器电机", "begin(减速比)", "初始化，如 1:90 填 90"],
          ["编码器电机", "getRPM() / getEncoderPos()", "转速 / 位置（48 触点一圈）"],
        ]}
      />
    </div>
    <div className="mt-4">
      <Steps title="展开：实测配方（无编码器直流有刷，履带 M1/M2）">
        <Pre>{`# 必须的初始化（电机没有编码器也要调 begin！否则不出 PWM）
emo.begin();
emo.getEncoderMotor(M1)->begin(90);   // M1=0 M2=1 M3=2 M4=3；getMotor(4) 越界
emo.getEncoderMotor(M2)->begin(90);

# 开环驱动：pwm 取 -100~100（负值反转、0 停）
emo.getMotor(M1)->spin(±pwm);

# 四个坑（官方示例 A9/A10 直接照抄在本板无效）
# 1) 漏 begin(90)：串口/网络正常但 spin/run+setSpeed/updateDuty 全都不出 PWM
# 2) 占空比 40~50 低于静摩擦阈值完全不动，60 起能走、100 满速（映射 60~100）
# 3) 不要用 updateVelocity()/spinRPM()：无编码器反馈恒 0 → PID 饱和满 PWM
#    （零速指令下轮子自己转）；编码器未 begin 时读 PCNT 会 abort() 重启
# 4) 电机库只在核心 1（Arduino loop()）调用；核心 0 的 micro-ROS 任务里 spin() 无效

# 安全：加「N ms 无指令就 spin(0)」保护
# 差速映射：左 = x - z，右 = x + z（z>0 左转，本车实测方向正确）`}</Pre>
        <p className="text-[0.84rem] text-muted">
          真机台架实测（2026-09）结论；完整表格见 <code>docs/ESP32-S3电机驱动板资料.md</code> 第三节第 5 小节，可烧录工程见{" "}
          <code>教学demo/ESP32-S3-microROS/</code>。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Mixly = () => (
  <Frame
    kicker="开发"
    floor="11"
    title="Mixly 图形化适合教学，记住导入与配对两个坑"
    lead="插件压缩包不用解压、直接本地导入；蓝牙手柄要按对按键组合才能配对。"
    wide
  >
    <Grid cols={2}>
      <Card title="已配插件环境" icon={Download}>
        Windows 下载官方配好插件的 Mixly 3.0；Mac 去 Mixly 官网装最新版。
      </Card>
      <Card title="插件导入" icon={Terminal}>
        插件压缩包<strong>无需解压</strong>，Mixly 里「本地导入」选压缩包，界面刷新出板卡。
      </Card>
      <Card title="首次编译慢" icon={Gauge} tone="warn">
        蓝牙库较大，第一次编译要耐心等待。
      </Card>
      <Card title="蓝牙手柄配对" icon={Gamepad2}>
        首次按住 X + Home 开机；4 号灯常亮=已连接，闪烁=扫描中，灯号不对就关机重试。
      </Card>
    </Grid>
    <div className="mt-5">
      <Code>
        报错：找不到 bits/c++config.h
        <br />
        把 ...\xtensa-esp32s3-elf\include\c++\8.4.0\xtensa-esp32s3-elf\bits\ 下的文件
        <br />
        拷贝到 ...\include\c++\8.4.0\bits\ 后，再上传。
      </Code>
    </div>
    <div className="mt-4">
      <Steps title="展开：Mixly 图形化完整步骤">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Windows 用已配插件的 Mixly 3.0；Mac 去 Mixly 官网装最新版。</li>
          <li>下载奇果派 S3 插件压缩包，<b>无需解压</b>，Mixly 里「本地导入」选压缩包。</li>
          <li>打开示例先另存为再改，插板选串口上传；首次编译因蓝牙库较大较慢。</li>
          <li>蓝牙手柄首次按住 <b>X 键 + Home 键</b>开机，4 号灯常亮即连上。</li>
          <li>报错找不到 <code>bits/c++config.h</code>：把 xtensa 目录下 bits 内容拷到上一级 bits 后重传。</li>
        </ol>
      </Steps>
    </div>
    <div className="mt-4">
      <Figure
        src={mixlyInstall}
        alt="Mixly 导入板卡插件"
        caption="Mixly「本地导入」插件：选「以板卡方式安装」，无需解压（图源：奇果派工坊）"
      />
    </div>
  </Frame>
);

const Controllers = () => (
  <Frame
    kicker="遥控联网"
    floor="12"
    title="两种手柄都能控车，按要不要 LCD 与调速习惯选"
    lead="蓝牙手柄功能键多、有麦轮模式；单手 RC 有 LCD，能直接看信号与板电压。"
    wide
  >
    <DataTable
      head={["", "蓝牙遥控器", "单手 RC 遥控器"]}
      rows={[
        ["控制", "方向键 / 左摇杆控车；SELECT 切麦轮/普通模式（默认麦轮）", "摇杆控车；按钮 5 切换前后/转弯与横移"],
        ["显示", "4 号灯表示连接状态；多灯闪=亏电", "LCD 显示信号强度与板电压"],
        ["调速", "右食指 B/T 加最大/起步速度，左食指 B/T 减，各 ±5%", "按钮 3/4 加/减最大速度 ±5%"],
        ["预留", "功能键二开预留", "按钮 6 拉高 45 号引脚，可外接 LED/继电器"],
      ]}
    />
    <div className="mt-5">
      <Quote>两种手柄的入门版源码都在官网/米思奇开源，进阶版找客服。</Quote>
    </div>
    <div className="mt-4">
      <Grid cols={2}>
        <Figure src={remoteBle} alt="蓝牙遥控器" caption="蓝牙遥控器：按键与充电口对照（图源：奇果派工坊）" />
        <Figure src={remoteRc} alt="单手 RC 遥控器" caption="单手 RC 遥控器：摇杆、按钮与 LCD" />
      </Grid>
    </div>
  </Frame>
);

const Iot = () => (
  <Frame
    kicker="遥控联网"
    floor="13"
    title="远程控制：局域网用 Socket，跨网用 MQTT"
    lead="先判定控制端和板子是否在同一局域网，再挑协议；两者都靠一个「唯一通讯标识」配对。"
  >
    <Grid cols={2}>
      <Card title="协议" icon={Cloud}>
        局域网内用 <b>Socket</b>，跨网用 <b>MQTT</b>。
      </Card>
      <Card title="控制端" icon={Smartphone}>
        网页 rc.7gp.cn 或安卓 App，填入与板子一致的「通讯标识」即可控。
      </Card>
      <Card title="带 4G 模块" icon={Radio}>
        开机后连 KiKuPi 热点（密码 1234567890），插流量卡后即可跨网遥控。
      </Card>
      <Card title="不带 4G 模块" icon={Wifi}>
        长按 boot 待 LED 变红，连 RobotS3 热点，浏览器开 192.168.123.1 配网。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>有自建服务器时，改 Mixly 里的服务器信息 + 网页端开源代码配对即可。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：物联网远程控制完整步骤">
        <ol className="list-decimal space-y-2 pl-5">
          <li>局域网用 Socket，跨网用 MQTT；Mixly 打开「物联网控制」示例。</li>
          <li>改一个<b>唯一通讯标识</b>后上传。</li>
          <li>控制端用网页 rc.7gp.cn 或安卓 App，填相同标识即可控。</li>
          <li>带 4G 模块：连 <code>KiKuPi</code> 热点（密码 1234567890），插流量卡跨网遥控。</li>
          <li>不带 4G：长按 boot 待 LED 变红，连 <code>RobotS3</code> 热点，浏览器开 192.168.123.1 配网。</li>
        </ol>
      </Steps>
    </div>
    <div className="mt-4">
      <Figure
        src={iotMqtt}
        alt="Mixly 物联网配置"
        caption="Mixly 里填 Wi-Fi 与唯一通讯标识，上传后即可远程控制（图源：奇果派工坊）"
      />
    </div>
  </Frame>
);

/* 10 字节数据包结构：内联 SVG 结构关系图（离线单文件，不用 ASCII 字符画 / 线框图） */
const PacketLayout = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 210"
      role="img"
      aria-label="遥控器到板子的 10 字节数据包结构：第 0 字节是类型（1 数据、2 心跳），第 1 字节辅助位自定义，第 2 与第 3 字节是左摇杆 Y 与 X，第 4 与第 5 字节是右摇杆，第 6 到第 9 字节是 4 字节按钮位图，最多表达 32 个按钮"
      className="h-auto w-full"
    >
      <text x="16" y="24" fill="#0f172a" fontSize="12" fontWeight="700">
        10 字节数据包结构（遥控器 → 板子的二进制包，不是串口文本）
      </text>
      {[
        { x: 16, w: 128, t: "类型", s: "1=数据 2=心跳", f: "#e0f2fe", b: "#7dd3fc", tc: "#0369a1" },
        { x: 150, w: 116, t: "辅助", s: "自定义", f: "#e0f2fe", b: "#7dd3fc", tc: "#0369a1" },
        { x: 272, w: 128, t: "左摇杆 Y", s: "127 居中 0–255", f: "#fef3c7", b: "#fbbf24", tc: "#b4690e" },
        { x: 406, w: 116, t: "左摇杆 X", s: "上/左到 0", f: "#fef3c7", b: "#fbbf24", tc: "#b4690e" },
        { x: 528, w: 150, t: "右摇杆", s: "2 字节（4、5）", f: "#fef3c7", b: "#fbbf24", tc: "#b4690e" },
        { x: 684, w: 200, t: "按钮位图", s: "4 字节 = 32 位", f: "#dcfce7", b: "#86efac", tc: "#0f8a5f" },
      ].map((c) => (
        <g key={c.x}>
          <rect x={c.x} y="48" width={c.w} height="86" rx="10" fill={c.f} stroke={c.b} />
          <text x={c.x + 12} y="74" fill={c.tc} fontSize="11" fontWeight="700">
            {c.t}
          </text>
          <text x={c.x + 12} y="96" fill="#475569" fontSize="9.5">
            {c.s}
          </text>
          <text x={c.x + 12} y="120" fill="#94a3b8" fontSize="9">
            字节 {c.x === 16 ? "0" : c.x === 150 ? "1" : c.x === 272 ? "2" : c.x === 406 ? "3" : c.x === 528 ? "4–5" : "6–9"}
          </text>
        </g>
      ))}
      <line x1="16" y1="146" x2="884" y2="146" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="16" y="170" fill="#b4690e" fontSize="10" fontWeight="700">
        按钮位图：A 按下为 0x01，A+B 同时按下为 0x03 —— 一个 bit 一个按钮。
      </text>
      <text x="16" y="192" fill="#475569" fontSize="10">
        别混：这是遥控器与板子之间的二进制包；串口那行 10 个数值是控制台的文本遥测（见「串口调试」页）。
      </text>
    </svg>
  </div>
);

const Packet = () => (
  <Frame
    kicker="遥控联网"
    floor="14"
    title="10 字节数据包，官方公开了格式，自己也能写控制端"
    lead="这个长度固定的包是遥控器到板子的二进制数据，不是串口打印的文本行——两者别混。"
    wide
  >
    <div className="mb-4">
      <PacketLayout />
    </div>
    <Focus
      no="10"
      title="数据包结构"
      tag="字节"
      goal="官方公开了 MQTT 协议的数据包格式，开发者可据此自己编写其它控制端。"
      points={[
        "共 10 字节：类型 | 辅助 | 左摇杆 Y | 左摇杆 X | 右摇杆 2 字节 | 按钮 4 字节。",
        "类型：1 = 数据包，2 = 心跳包，其它可自定义。",
        "摇杆默认 127；向上/左最小到 0，向下/右最大到 255。",
        "按钮 4 字节位图，最多表达 32 个按钮：A 按下为 0x01，A+B 同时按下为 0x03。",
      ]}
      aside={
        <Code>
          [0] 类型 &nbsp;&nbsp;1=数据 2=心跳
          <br />
          [1] 辅助 &nbsp;&nbsp;自定义
          <br />
          [2] 左摇杆 Y &nbsp;&nbsp;127 居中
          <br />
          [3] 左摇杆 X
          <br />
          [4][5] 右摇杆
          <br />
          [6..9] 按钮位图（4 字节 = 32 位）
        </Code>
      }
    />
  </Frame>
);

const Ros2 = () => (
  <Frame
    kicker="对接调试"
    floor="15"
    title="micro-ROS 让板子成为 ROS 2 里的普通节点"
    lead="官方示例做了双向通讯：Pi 键盘发控制量控车，板子定时发心跳给 Pi 打印——通道是 Agent 的 UDP 8888。"
    wide
  >
    <Focus
      no="12"
      title="官方示例做了什么"
      tag="micro-ROS"
      goal="Pi 键盘发控制量控车；ESP32 定时发心跳、Pi 打印频率——以此实现双向通讯，可继续完善电机控制。"
      points={[
        "环境：ESP32 侧 VSCode + PlatformIO；Pi 5 装 ROS 2 Jazzy。",
        "Pi → ESP32：teleop_twist_keyboard 发 /cmd_vel（Twist：x 前后、y 横移、z 转向）。",
        "ESP32 → Pi：定时发 /esp32/heartbeat，Pi 的监听节点订阅打印。",
        "通道：micro-ROS Agent 的 UDP4:8888。",
        "调试：ros2 topic list / echo / pub 手动验证。",
      ]}
      aside={
        <Code>
          # Pi：构建并启动 Agent
          <br />
          colcon build
          <br />
          ros2 run micro_ros_agent \
          <br />
          &nbsp;&nbsp;micro_ros_agent udp4 --port 8888
          <br />
          <br />
          # 键盘控制
          <br />
          ros2 run teleop_twist_keyboard \
          <br />
          &nbsp;&nbsp;teleop_twist_keyboard
          <br />
          <br />
          ros2 topic echo /esp32/heartbeat
        </Code>
      }
    />
    <div className="mt-4">
      <Steps title="展开：官方示例完整命令（Pi 侧）">
        <Pre>{`# 1) 建 micro-ROS Agent 工作区（jazzy 分支）
mkdir -p ~/microros_ws/src && cd ~/microros_ws
git clone https://github.com/micro-ROS/micro-ROS-Agent.git -b jazzy src/micro-ROS-Agent
git clone https://github.com/micro-ROS/micro_ros_msgs.git -b jazzy src/micro_ros_msgs
colcon build
source install/setup.bash

# 2) 启动 Agent（UDP4:8888）
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888

# 3) 键盘控车（另开终端）
sudo apt install ros-jazzy-teleop-twist-keyboard
ros2 run teleop_twist_keyboard teleop_twist_keyboard

# 4) 看 ESP32 心跳
python3 heartbeat_listener.py
ros2 topic echo /esp32/heartbeat`}</Pre>
        <p className="text-[0.84rem] text-muted">本项目的 Pi 是 Docker 版 ROS 2，复用要点见下一页与 docs 第六节。</p>
      </Steps>
    </div>
  </Frame>
);

const Integration = () => (
  <Frame
    kicker="对接调试"
    floor="16"
    title="本项目落地：Agent 进容器，客户端别设 ROS_DOMAIN_ID"
    lead="仓库的 Pi 是 Docker 版 ROS 2，不是示例里的 Ubuntu 原生安装；两处口径必须按本项目改。"
    wide
  >
    <Grid cols={2}>
      <Card title="本项目 ROS 2 是 Docker 版" icon={Boxes}>
        仓库的 Pi 是 Debian 13 + Docker <code>ros:jazzy-ros-base</code>，不是 Ubuntu 原生安装。
      </Card>
      <Card title="Agent 跑在容器里" icon={Terminal}>
        在 ROS 2 容器内安装并运行 micro-ROS Agent，复用已建好的 <code>~/microros_ws</code>。
      </Card>
      <Card title="网络要打通" icon={Network}>
        容器用 <code>--network host</code>，让 Agent 的 UDP 8888 直接落在宿主网络，板子才找得到它。
      </Card>
      <Card title="域口径的坑" icon={AlertTriangle} tone="warn">
        Agent 固定跑在默认 DDS 域 0，不认 <code>ROS_DOMAIN_ID</code>；Pi 侧客户端设成 42 就连心跳都看不到。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>
        是否引入 micro-ROS 的决策条件见 <code>docs/ROS2与micro-ROS选型.md</code> 第六节；板子固件与 Agent 通路见{" "}
        <code>教学demo/ESP32-S3-microROS/</code> 与 deck「ESP32-S3接入micro-ROS」。
      </Quote>
    </div>
  </Frame>
);

const SerialDebug = () => (
  <Frame
    kicker="对接调试"
    floor="18"
    title="串口认准 USB-C 口：另一个 USB 口看不到任何输出"
    lead="板上两个 USB 口不一样：USB-C 走 CH343 转串口、是烧录与控制台口；原生 USB 口固件不打印，接它只会让板子复位一次。"
    wide
  >
    <DataTable
      head={["USB 口", "系统识别", "能不能看到输出"]}
      rows={[
        [
          <strong className="font-bold text-ink">USB-C（CH343 转串口）</strong>,
          "USB-Enhanced-SERIAL CH343 (COMx)",
          <strong className="font-bold text-ink">能：控制台在 UART0 / 115200，也是烧录口</strong>,
        ],
        [
          "原生 USB（USB-Serial/JTAG）",
          "VID:PID = 303A:1001",
          "不能：固件不往 USB CDC 打印，接它看不到数据",
        ],
      ]}
    />
    <div className="mt-5">
      <Grid cols={2}>
        <Card title="实测遥测：每 ~500 ms 一行 10 个数值" icon={Terminal}>
          <code>992,992,1376,992,992,192,192,992,1126,924</code>
          <br />
          数值是原始计数（非 µs）：摇杆中立约 992，开关两档 192 / 992。全 0 或整行恒定 = 没接电机 / 没动遥控器，不是故障。
        </Card>
        <Card title="通道对应（当前遥控器）" icon={Usb}>
          c0–c3 = ch1–ch4；c4–c7 = swa-5 … swd-8；c8 / c9 = vra / vrb。换遥控器需重新确认，软件默认命名见工具 README。
        </Card>
      </Grid>
    </div>
    <div className="mt-5">
      <Steps title="展开：用 tools/serial_monitor 看实时波形">
        <Pre>{`# 1) 确认端口（板子 USB-C 口 → CH343，本机实测为 COM9）
python tools/serial_monitor/serial_monitor.py --list

# 2) 打开并自动开始采集
python tools/serial_monitor/serial_monitor.py --port COM9 --baud 115200 --autostart

# 3) 没有硬件也能先看界面
python tools/serial_monitor/serial_monitor.py --demo`}</Pre>
        <p className="text-[0.84rem] text-muted">
          依赖 pyserial（<code>python -m pip install pyserial</code>），tkinter 随 Python 自带；打开串口会让板子复位一次并打印 ROM 启动日志，属正常现象。
        </p>
      </Steps>
    </div>
  </Frame>
);

/* 上电自检顺序（点式动画 ③ 的数据）：先查电源轨 → 再看使能 → 再发 PWM → 验证通过 */
const SELFTEST_STEPS = [
  {
    t: "① 先量电压（电源轨）",
    s: "电池接 6–24 V 动力型、按版本匹配；逻辑 5 V / 3.3 V 正常。不稳先查供电，别怀疑代码。",
    side: "power",
  },
  {
    t: "② 再看使能（初始化驱动输出）",
    s: "emo.begin() 后必须对要用的通道调 getEncoderMotor(Mn)->begin(90)；电机没编码器也要调，它负责打开驱动输出。",
    side: "signal",
  },
  {
    t: "③ 最后才给 PWM",
    s: "getMotor(Mn)->spin(±pwm)；占空比取 60–100 才转得动，40–50 低于静摩擦阈值不动。只在核心 1 调。",
    side: "signal",
  },
  {
    t: "④ 验证通过",
    s: "轮子按指令转、无指令 N ms 后 spin(0) 停；串口与网络都正常，全链贯通。",
    side: "good",
  },
];

const SelfTest = () => (
  <Frame
    kicker="对接调试"
    floor="17"
    title="电机不动别乱改：先量电压、再看使能、最后才给 PWM"
    lead="上电自检有固定顺序，一步只查一件事（蓝＝电源、橙＝信号 / PWM、绿＝验证通过）；顺序反了就会「串口正常、轮子不转」。"
    wide
  >
    <div className="space-y-4">
      <PointSteps
        steps={SELFTEST_STEPS}
        hint="点每一步可手动跳转；默认全亮＝静态兜底（关动画 / 打印照样完整）。"
      />
      <Grid cols={2}>
        <Card title="漏了 begin(90) 的典型症状" icon={AlertTriangle} tone="warn">
          串口 / 网络一切正常，但 <code>spin()</code>、<code>run()+setSpeed()</code>、<code>updateDuty()</code>{" "}
          全都静默不出 PWM——不是坏，是驱动输出没初始化。
        </Card>
        <Card title="占空比太小也不动" icon={Gauge} tone="warn">
          <code>spin(40~50)</code> 低于静摩擦阈值完全不动；60 起能走、100 满速，非零指令映射到 60–100。
        </Card>
        <Card title="零速时轮子自己转" icon={Rocket} tone="warn">
          用了 <code>updateVelocity()</code> / <code>spinRPM()</code>（目标 RPM + PID）：无编码器反馈恒 0，PID 饱和到满 PWM。
        </Card>
        <Card title="只在核心 1 调库" icon={Cpu}>
          电机库调用只在核心 1（Arduino <code>loop()</code>）做；从核心 0 的 micro-ROS 任务里调 <code>spin()</code> 不出 PWM。
        </Card>
      </Grid>
      <Quote>记忆锚（顺序不能反）：口诀「先量电压、再看使能、最后才给 PWM」——先怀疑供电，再怀疑初始化，最后才怀疑指令。</Quote>
    </div>
  </Frame>
);

const MemoryAnchor = () => (
  <Frame
    kicker="收尾"
    floor="19"
    title="记忆锚：三句话记住整册硬件与调试"
    lead="把「死记」换成「钩子」——口诀定顺序、类比定角色、颜色定链路；三种锚在正文与图示里重复出现。"
    wide
  >
    <div className="space-y-4">
      <AnchorCards />
      <Quote>
        考场先想起钩子，再顺出知识：先量电压、再看使能、最后才给 PWM；驱动器是电机的变速箱 + 油门，PWM 是油门深度；
        蓝＝电源 / 硬件、橙＝信号 / PWM、绿＝验证通过。
      </Quote>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame kicker="收尾" floor="20" title="下载入口：原理图与库随 deck 分发，离线可取" wide>
    <DataTable
      head={["资源", "入口"]}
      rows={[
        ["12V 原理图 EMO_Lite", <A href="./files/SCH_EMO_Lite.pdf">SCH_EMO_Lite.pdf（本地）</A>],
        ["24V 原理图 EM_MAX", <A href="./files/SCH_EMO_MAX_3-V1.0_USE.pdf">SCH_EMO_MAX_3-V1.0_USE.pdf（本地）</A>],
        ["Arduino 库 QGP_EVMotor.zip", <A href="./files/QGP_EVMotor.zip">QGP_EVMotor.zip（本地）</A>],
        [
          "串口波形监控工具（本仓库自写代码）",
          <span>
            <A href="./files/serial_monitor.zip">serial_monitor.zip（本地）</A>
            <br />
            <code className="text-[0.8rem] text-muted">tools/serial_monitor/</code>
          </span>,
        ],
        ["Windows 程序烧录工具", <code className="text-[0.84rem]">doc.7gp.cn/download/FlashingTool.zip</code>],
        ["物联网网页控制端", <code className="text-[0.84rem]">rc.7gp.cn</code>],
        ["完整资料整理", "docs/ESP32-S3电机驱动板资料.md"],
      ]}
    />
    <div className="mt-5">
      <Quote>
        原理图、Arduino 库与本仓库自写工具已放本地 <code>files/</code>，随 deck 一起分发即可离线打开；源文件改动后同步刷新该副本。
      </Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：全部下载入口与来源链接">
        <Pre>{`# 本地（随 deck 分发，离线可用）
files/SCH_EMO_Lite.pdf              12V 版原理图
files/SCH_EMO_MAX_3-V1.0_USE.pdf    24V 版原理图
files/QGP_EVMotor.zip               Arduino 库
files/serial_monitor.zip            串口波形监控工具（本仓库自写）

# 网盘（需登录百度账号）
QGP_EVMotor 库        https://pan.baidu.com/s/1Ics52oTadGGIVccjC52InA?pwd=1314
Mixly 3.0 已配插件    https://pan.baidu.com/s/1cP_Ca2-YIF1ggjxb3lBMuw?pwd=2jih
Mixly 奇果派 S3 插件  https://pan.baidu.com/s/12dWAfmevUxAKlHdhSA3Abg?pwd=1314
ROS 2 示例源码        https://pan.baidu.com/s/1L9PQhWvsiyluuN4WXUIEoA?pwd=5bg8
安卓 App 物联网遥控   https://pan.baidu.com/s/1uJ_lGoXwTgDLesGdStcYuQ?pwd=ate5
安卓 App 视频车       https://pan.baidu.com/s/1Lu2Tys0gsobUnCzFyeGd8g?pwd=1314

# 官网 / 网页
Windows 烧录工具  https://doc.7gp.cn/download/FlashingTool.zip（当前 404，未本地化）
物联网控制端      http://rc.7gp.cn/
Mixly 官网        https://mixly.cn/fredqian/mixly3

# 来源（奇果派 S3 专题）
专题      https://www.7gp.cn/archives/special/esp32-s3
硬件      https://www.7gp.cn/archives/1391   Arduino https://www.7gp.cn/archives/1409
Mixly     https://www.7gp.cn/archives/1410   物联网  https://www.7gp.cn/archives/1536
视频车App https://www.7gp.cn/archives/1495   烧录工具 https://www.7gp.cn/archives/1516
遥控器    https://www.7gp.cn/archives/1714   ROS 2   https://www.7gp.cn/archives/1747`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Action = () => (
  <Frame
    kicker="收尾"
    floor="21"
    title="照清单做：先接动力电池，再烧录，最后接 ROS 2"
    lead="顺序不能反：先把供电与接线做对，再让示例跑起来，最后才谈 ROS 2 对接。"
    wide
  >
    <div className="space-y-5">
      <Grid cols={3}>
        <Card title="第一步：供电与接线" icon={Battery} tone="warn">
          电机接 6–24 V 动力电池（按版本）；编码器看标识，VCC/GND 别接反。
        </Card>
        <Card title="第二步：烧录跑通" icon={Rocket} tone="good">
          用烧录工具或 Arduino IDE 刷官方示例，先确认电机能被遥控器带动。
        </Card>
        <Card title="第三步：接 ROS 2" icon={ArrowLeftRight}>
          板子走 micro-ROS，Pi 侧 Agent 进容器、网络用 host，域口径保持默认。
        </Card>
      </Grid>
      <Quote>判断顺序：电机不动先查供电与 <code>begin(90)</code>，别一上来就怀疑 ROS 2。</Quote>
      <Steps title="展开：上机清单（2026-09 实测）">
        <Pre>{`# 1) 供电（12V 版 6–12V / 3A，24V 版 6–24V / 10A），必须动力型电池
# 2) 接线：电机插蓝色接口（不分正负）；编码器插白色接口、VCC/GND 看板背标识
# 3) 烧录：烧录工具选 ESP32-S3 板型，或 Arduino IDE 选 ESP32S3 Dev Module 上传
# 4) 驱动库初始化（无编码器也必须）：
#    emo.begin(); emo.getEncoderMotor(M1)->begin(90);
#    再用 emo.getMotor(M1)->spin(±pwm)，pwm 取 60~100 才转得动
# 5) 串口：USB-C 口（CH343）看 UART0 / 115200 输出；原生 USB 口无输出
# 6) ROS 2：容器内跑 micro-ROS Agent udp4 --port 8888（--network host）
#    Pi 侧客户端不要 export ROS_DOMAIN_ID=42（Agent 固定域 0）`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Download}>
        下载：
        <A href="./files/QGP_EVMotor.zip">QGP_EVMotor.zip</A> 与{" "}
        <A href="./files/serial_monitor.zip">serial_monitor.zip</A>（同样可离线取{" "}
        <A href="./files/SCH_EMO_Lite.pdf">原理图 PDF</A>）；文字版见 <code>docs/ESP32-S3电机驱动板资料.md</code>，固件与通路见{" "}
        <code>教学demo/ESP32-S3-microROS/</code>。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "板载资源分布", group: "硬件", el: <BoardMap /> },
  { nav: "12V / 24V 版本", group: "硬件", el: <Versions /> },
  { nav: "供电信号链路", group: "硬件", el: <SupplySignalFlow /> },
  { nav: "供电与控制链路", group: "硬件", el: <PowerChainPage /> },
  { nav: "对比决策：供电方案", group: "硬件", el: <PowerDecision /> },
  { nav: "接线要点", group: "硬件", el: <Wiring /> },
  { nav: "四条开发路径", group: "开发", el: <DevPaths /> },
  { nav: "Arduino 烧录", group: "开发", el: <ArduinoFlow /> },
  { nav: "Arduino 常用 API", group: "开发", el: <ArduinoApi /> },
  { nav: "Mixly 与避坑", group: "开发", el: <Mixly /> },
  { nav: "两种手柄", group: "遥控联网", el: <Controllers /> },
  { nav: "物联网远程控制", group: "遥控联网", el: <Iot /> },
  { nav: "数据包格式", group: "遥控联网", el: <Packet /> },
  { nav: "micro-ROS 通讯", group: "对接调试", el: <Ros2 /> },
  { nav: "本项目落地", group: "对接调试", el: <Integration /> },
  { nav: "上电自检顺序", group: "对接调试", el: <SelfTest /> },
  { nav: "串口调试与波形监控", group: "对接调试", el: <SerialDebug /> },
  { nav: "记忆锚", group: "收尾", el: <MemoryAnchor /> },
  { nav: "下载与文档", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
