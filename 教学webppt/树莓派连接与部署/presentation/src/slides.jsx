import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Cable,
  Cpu,
  Download,
  FolderTree,
  KeyRound,
  ListChecks,
  Network,
  Play,
  RotateCcw,
  Search,
  Server,
  ShieldCheck,
  Target,
  Terminal,
  Upload,
  Wifi,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre } from "./components.jsx";

/* 连接拓扑：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） */
const Topology = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 362"
      role="img"
      aria-label="笔记本与两台树莓派经同一根直连网线联通，Windows 与 Pi 的无线同属 192.168.31.0/24 作带外通道"
      className="h-auto w-full"
    >
      <defs>
        <marker id="topo-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="topo-warn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      <rect x="24" y="40" width="216" height="104" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="132" y="70" textAnchor="middle" fill="#0f172a" fontSize="13.5" fontWeight="700">笔记本（Windows）</text>
      <text x="132" y="92" textAnchor="middle" fill="#475569" fontSize="10.5">以太网 172.26.188.100/24</text>
      <text x="132" y="110" textAnchor="middle" fill="#475569" fontSize="10.5">DHCP 关闭 · 无网关</text>

      <rect x="356" y="20" width="224" height="104" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="468" y="50" textAnchor="middle" fill="#0f172a" fontSize="13.5" fontWeight="700">新 Pi zhangsk（在用）</text>
      <text x="468" y="72" textAnchor="middle" fill="#475569" fontSize="10.5">eth0 172.26.188.116/24</text>
      <text x="468" y="90" textAnchor="middle" fill="#475569" fontSize="10.5">静态 · 无网关</text>

      <rect x="356" y="196" width="224" height="104" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="468" y="226" textAnchor="middle" fill="#0f172a" fontSize="13.5" fontWeight="700">旧 Pi NCZYDX（保留）</text>
      <text x="468" y="248" textAnchor="middle" fill="#475569" fontSize="10.5">eth0 172.26.188.115/24</text>
      <text x="468" y="266" textAnchor="middle" fill="#475569" fontSize="10.5">静态 · 无网关</text>

      <rect x="676" y="40" width="200" height="104" rx="12" fill="#fffbeb" stroke="#fbbf24" />
      <text x="776" y="70" textAnchor="middle" fill="#0f172a" fontSize="13.5" fontWeight="700">Wi-Fi 路由器</text>
      <text x="776" y="92" textAnchor="middle" fill="#475569" fontSize="10.5">192.168.31.0/24</text>
      <text x="776" y="110" textAnchor="middle" fill="#475569" fontSize="10.5">带外通道</text>

      <line x1="240" y1="72" x2="352" y2="72" stroke="#0d9488" strokeWidth="2" markerEnd="url(#topo-teal)" />
      <text x="296" y="62" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">直连网线</text>

      <path d="M132,144 L132,248 L352,248" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#topo-teal)" />
      <text x="242" y="240" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700">同一根网线（换接）</text>

      <line x1="580" y1="72" x2="672" y2="72" stroke="#b4690e" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#topo-warn)" />
      <text x="626" y="62" textAnchor="middle" fill="#b4690e" fontSize="10" fontWeight="700">wlan0 .29</text>

      <path d="M60,144 L60,334 L776,334 L776,148" fill="none" stroke="#b4690e" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#topo-warn)" />
      <text x="418" y="348" textAnchor="middle" fill="#b4690e" fontSize="10" fontWeight="700">本机 WLAN 192.168.31.57（与 Pi 同网段，仅作带外）</text>
    </svg>
  </div>
);

/* 部署流程：内联 SVG */
const DeployFlow = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 200"
      role="img"
      aria-label="部署常驻服务的五步流程：本机写脚本、上传执行、Pi 后台运行、查端口日志、本机端到端验证"
      className="h-auto w-full"
    >
      <defs>
        <marker id="dep-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="8" y="50" width="156" height="96" rx="12" fill="#fffbeb" stroke="#fbbf24" />
      <text x="24" y="78" fill="#0f766e" fontSize="11.5" fontWeight="700">① 本机写脚本</text>
      <text x="24" y="100" fill="#475569" fontSize="10">纯 ASCII 的 .sh</text>
      <text x="24" y="116" fill="#475569" fontSize="10">避免三层引号</text>

      <rect x="190" y="50" width="156" height="96" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="206" y="78" fill="#0f766e" fontSize="11.5" fontWeight="700">② 上传执行</text>
      <text x="206" y="100" fill="#475569" fontSize="10">pi.py --file deploy.sh</text>
      <text x="206" y="116" fill="#475569" fontSize="10">自动放 /tmp/kilo-run.sh</text>

      <rect x="372" y="50" width="156" height="96" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="388" y="78" fill="#0f766e" fontSize="11.5" fontWeight="700">③ Pi 后台运行</text>
      <text x="388" y="100" fill="#475569" fontSize="10">nohup … &gt; /tmp/x.log 2&gt;&amp;1 &amp;</text>
      <text x="388" y="116" fill="#475569" fontSize="10">SSH 断开也不被杀</text>

      <rect x="554" y="50" width="156" height="96" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="570" y="78" fill="#0f766e" fontSize="11.5" fontWeight="700">④ 查端口与日志</text>
      <text x="570" y="100" fill="#475569" fontSize="10">ss -ltn · pgrep -af</text>
      <text x="570" y="116" fill="#475569" fontSize="10">tail -n 50 /tmp/x.log</text>

      <rect x="736" y="50" width="156" height="96" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="752" y="78" fill="#0f766e" fontSize="11.5" fontWeight="700">⑤ 端到端验证</text>
      <text x="752" y="100" fill="#475569" fontSize="10">本机 ping / --check</text>
      <text x="752" y="116" fill="#475569" fontSize="10">确认服务真的可用</text>

      <line x1="164" y1="98" x2="186" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dep-arrow)" />
      <line x1="346" y1="98" x2="368" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dep-arrow)" />
      <line x1="528" y1="98" x2="550" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dep-arrow)" />
      <line x1="710" y1="98" x2="732" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dep-arrow)" />

      <text x="8" y="180" fill="#94a3b8" fontSize="10.5">
        nohup 让进程脱离 SSH 会话；Pi 重启后 /home/nanzhida/ 下的脚本与进程都会丢，需重新上传启动。
      </text>
    </svg>
  </div>
);

/* 对比决策：手敲 ssh / scp vs 脚本化 pi.py（内联 SVG） */
const Decision = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 250"
      role="img"
      aria-label="对比决策：逐条手敲 ssh / scp 命令流，还是把操作固化成 tools/pi.py 与脚本"
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

      <rect x="230" y="8" width="220" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="340" y="30" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">要在一台 Pi 上执行命令 / 部署</text>
      <text x="340" y="47" textAnchor="middle" fill="#475569" fontSize="10">敲久了就想找个省事的办法</text>

      <line x1="320" y1="58" x2="152" y2="98" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#dec-arrow-red)" />
      <line x1="360" y1="58" x2="528" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dec-arrow-teal)" />

      <rect x="16" y="100" width="260" height="118" rx="10" fill="#fef2f2" stroke="#fecaca" />
      <text x="32" y="126" fill="#0f172a" fontSize="12" fontWeight="700">方案 A · 手敲 ssh / scp</text>
      <text x="32" y="150" fill="#475569" fontSize="10">逐条敲登录、传文件、起进程</text>
      <text x="32" y="170" fill="#475569" fontSize="10">密码要交互输入，引号反复被破坏</text>
      <text x="32" y="194" fill="#9a3412" fontSize="10" fontWeight="700">结果：出错率高，命令散在终端历史里</text>

      <rect x="404" y="100" width="260" height="118" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="420" y="126" fill="#0f172a" fontSize="12" fontWeight="700">方案 B · 脚本化 pi.py</text>
      <text x="420" y="150" fill="#475569" fontSize="10">操作固化成 pi.py + 纯 ASCII .sh</text>
      <text x="420" y="170" fill="#475569" fontSize="10">一条命令执行 / 传文件 / 提权</text>
      <text x="420" y="194" fill="#0f766e" fontSize="10" fontWeight="700">结果：可复现，命令写进脚本与 docs</text>

      <text x="16" y="240" fill="#94a3b8" fontSize="10">
        判定关键：重复 ≥2 次或要写进文档的命令就该脚本化；一次性的临时查看用手敲反而更快。
      </text>
    </svg>
  </div>
);

/* ============================================================
   守则第七节 · 点式动画（全册 ≤3 处）
   纯前端实现：React state + setTimeout + CSS transition，无任何外链资源。
   默认全亮（静态兜底：停帧 / 无 JS / 打印时完整可读）；播放时逐点 idle → active → done。
   颜色编码全册统一：蓝＝设备 / 硬件，橙＝配置 / 命令，绿＝验证通过。
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
      橙＝配置 / 命令
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝验证通过
    </span>
  </div>
);

/* ---- 点式动画 ① 部署链路（横向）：通电 → 联网 → 同步 → 装依赖 → 跑通 ---- */
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

/* ---- 点式动画 ② / ③ 纵向点式分步 ---- */
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
      <p className="text-[1rem] font-extrabold leading-snug text-ink">先通电、再联网、后装环境</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        顺序颠倒必翻车：设备没上电、网没通，后面的同步与安装都无从谈起。
      </p>
    </div>
    <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-warn2">生活化类比</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">树莓派＝家里的电脑</p>
      <p className="mt-1.5 text-[1rem] font-extrabold leading-snug text-ink">SSH＝远程遥控器</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        <code>tools/pi.py</code> 就像一把万能遥控器：你人坐在本机前，却像坐到了那台 Pi 面前敲键盘。
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
          橙＝配置 / 命令
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-good" />
          绿＝验证通过
        </p>
      </div>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        全册一致：看颜色就知道这一步在动硬件、敲命令，还是验证通过。
      </p>
    </div>
  </div>
);

/* ---- 概览 · 部署链路（点式动画 ①）---- */
const DEPLOY_CHAIN = [
  { no: "1", side: "device", title: "开机上电", sub: "接网线 · 供电与下载口分清" },
  { no: "2", side: "cmd", title: "联网", sub: "eth0 静态 172.26.188.116/24" },
  { no: "3", side: "cmd", title: "同步代码", sub: "tools/pi.py --put / --file 上传" },
  { no: "4", side: "cmd", title: "装依赖", sub: "apt / docker 拉环境（仅首次）" },
  { no: "5", side: "good", title: "跑通验证", sub: "ping / --check 端到端确认" },
];

const DeployChain = () => (
  <Frame
    kicker="概览"
    floor="03"
    title="部署链路：先通电、再联网、后装环境"
    lead="从板子到手到服务跑通，是五步一条链；顺序颠倒必翻车——设备没上电、网没通，后面的同步与安装都无从谈起。"
    wide
  >
    <div className="space-y-4">
      <PointFlow steps={DEPLOY_CHAIN} />
      <Quote>
        口诀：<strong>先通电、再联网、后装环境</strong>——灯走到哪，流程就记到哪。
      </Quote>
    </div>
  </Frame>
);

/* ---- 工具 · 文件同步与执行（点式动画 ②）---- */
const SYNC_FLOW = [
  { side: "cmd", t: "本机写脚本", s: "含引号 / 括号 / 管道一律写成纯 ASCII 的 .sh，避开三层引号。" },
  { side: "cmd", t: "pi.py 上传", s: "python tools/pi.py --file run.sh；文件走 --put 只上传不执行。" },
  { side: "cmd", t: "落到 /tmp/kilo-run.sh", s: "脚本自动放到 Pi 的临时路径，SFTP 不做 ~ 展开，远端写绝对路径。" },
  { side: "cmd", t: "Pi 上执行", s: "paramiko 带密码非交互登录，在 Pi 上跑脚本并回显 stdout / stderr。" },
  { side: "good", t: "核对输出", s: "看退出码与输出；远端中文 / BOM 已按 UTF-8（errors=replace）回显。" },
];

const SyncFlow = () => (
  <Frame
    kicker="工具"
    floor="09"
    title="一次远程调用：本机写、脚本传、Pi 上跑、回显核对"
    lead="pi.py 把「登录 → 传文件 → 执行 → 回显」收成一条链；复杂命令一律走后半段（--file / --put），不手敲 ssh。"
    wide
  >
    <div className="space-y-4">
      <PointSteps
        hint="默认全亮＝静态兜底；播放时逐项点亮，灯走到哪核到哪。"
        steps={SYNC_FLOW}
      />
      <Quote>
        类比：SSH 像远程遥控器——你人坐在本机前，却像坐到了那台 Pi 面前敲键盘。
      </Quote>
    </div>
  </Frame>
);

/* ---- 排障 · 连不上先按顺序查（点式动画 ③）---- */
const TROUBLE_ORDER = [
  { side: "device", t: "① 看链路", s: "本机 Get-NetAdapter 看 Status / LinkSpeed；0 bps / 收发长期为 0 = 物理层无信号，直接换线 / 重插。" },
  { side: "cmd", t: "② 看地址", s: "Pi 端 ip -4 addr、本机 Get-NetAdapter，确认都在 172.26.188.0/24。" },
  { side: "cmd", t: "③ 看是否卡 DHCP", s: "卡在 connecting (getting IP configuration)：eth0 是 DHCP 但直连线没有服务器，改成静态。" },
  { side: "device", t: "④ IPv6 链路本地兜底", s: "IPv4 不通时用 fe80::2ecf:67ff:fece:9bce%<ifIndex> 直连（仅经网线可达）。" },
  { side: "good", t: "⑤ 定位并处理", s: "对照故障表：Destination host unreachable = 网段不对；.114 是热点临时租约，别再用。" },
];

const TroubleOrder = () => (
  <Frame
    kicker="排障"
    floor="13"
    title="连不上先别慌：从物理层查到地址"
    lead="按「物理层 → 地址 → DHCP → IPv6 兜底」的顺序走，多数连接问题一眼定位；0 bps 是物理层，别从软件找。"
    wide
  >
    <div className="space-y-4">
      <PointSteps
        hint="点节点可跳到该步；默认全亮＝静态兜底。"
        steps={TROUBLE_ORDER}
      />
      <div className="border-t border-line pt-3">
        <ColorLegend />
      </div>
      <Quote>顺序不能跳：先看链路是不是 0 bps，再看地址是不是同网段，最后才用 IPv6 链路本地兜底。</Quote>
    </div>
  </Frame>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      树莓派连接与部署
      <br />
      <span className="text-brand-600">直连网线 · SSH 工具 · 排障</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      两台树莓派走同一条直连网线；本机用 tools/pi.py 免交互执行命令与部署脚本。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整命令与排障步骤。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="两台 Pi 走同一条网线，日常操作只用 tools/pi.py"
    lead="两台树莓派（Raspberry Pi，下文简称 Pi）都经同一根直连网线接入本机；两侧各配静态地址，日常命令一律走脚本工具，不要手敲 ssh。"
  >
    <Grid cols={2}>
      <Card title="直连网线" icon={Cable}>
        笔记本 ↔ 单根网线 ↔ Pi；接哪台就控制哪台，两端都不要指望 DHCP。
      </Card>
      <Card title="静态地址" icon={Network}>
        本机有线网卡 172.26.188.100/24；新 Pi eth0 172.26.188.116/24，旧 Pi 172.26.188.115/24。
      </Card>
      <Card title="脚本化工具" icon={Terminal}>
        tools/pi.py 底层 paramiko（Python SSH 库），带 --sudo / --file / --put，一条命令完成执行与部署。
      </Card>
      <Card title="不要手敲 ssh" icon={AlertTriangle} tone="warn">
        不要直接调 ssh：Windows 自带 OpenSSH 没有 sshpass，密码无法非交互传入。
      </Card>
    </Grid>
  </Frame>
);

const PiDevices = () => (
  <Frame
    kicker="概览"
    floor="02"
    title="两台 Pi：新机在用、旧机保留"
    lead="tools/pi.py 默认指向新 Pi；连旧 Pi 必须显式覆盖 --host / --user / --pass。"
    wide
  >
    <DataTable
      head={["项", "新 Pi（在用）", "旧 Pi（保留）"]}
      rows={[
        ["主机名", "zhangsk", "NCZYDX"],
        ["硬件 / 系统", "Raspberry Pi 5（aarch64, 2712）· Debian 13 trixie · 2 GB", "早期 Pi（保留备用）"],
        ["eth0 IPv4", "172.26.188.116/24（静态 /24，无网关、never-default yes）", "172.26.188.115/24（同上）"],
        ["IPv6 链路本地", "fe80::2ecf:67ff:fece:9bce%<本机以太网 ifIndex>", "fe80::2ecf:67ff:fece:a998%<ifIndex>"],
        ["账号 / 密码", "nanzhida / nanzhida（在 sudo 组，无 NOPASSWD，必须 --sudo）", "nczydx / 123456789（sudo 同密码）"],
        ["eth0 MAC", "2c:cf:67:ce:9b:ce", "2c:cf:67:ce:a9:98"],
        ["无线（带外通道）", "wlan0 192.168.31.29/24（与本机 WLAN 同网段）", "—"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：两台 Pi 完整参数与核对命令">
        <Pre>{`# 新 Pi zhangsk：Raspberry Pi 5（aarch64, 2712），Debian 13 (trixie)
#   kernel 6.18.50+rpt-rpi-2712，2 GB RAM
#   eth0 172.26.188.116/24（静态、无网关、never-default yes）
#   账号 nanzhida / nanzhida（在 sudo 组，无 NOPASSWD）
#   eth0 MAC 2c:cf:67:ce:9b:ce；wlan0 192.168.31.29/24（带外通道）
#   IPv6 链路本地 fe80::2ecf:67ff:fece:9bce%<本机以太网 ifIndex>

# 旧 Pi NCZYDX：eth0 172.26.188.115/24，MAC 2c:cf:67:ce:a9:98
#   账号 nczydx / 123456789（sudo 同密码）
#   连接时加：--host 172.26.188.115 --user nczydx --pass 123456789

# 现场核对
python tools/pi.py "hostname; uname -a; ip -4 addr show eth0"
python tools/pi.py "nmcli -g GENERAL.STATE,IP4.ADDRESS con show netplan-eth0"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const LocalSide = () => (
  <Frame
    kicker="网络"
    floor="04"
    title="本机侧静态 .100，ifIndex 每次开机都要现查"
    lead="本机有线网卡叫「以太网」，改配置需管理员；脚本里一律用 ifIndex 现查，不要写死数字、也不要直接用中文网卡名。"
  >
    <Grid cols={2}>
      <Card title="静态地址" icon={Network}>
        Realtek 2.5GbE 静态 172.26.188.100/24，另有 192.168.199.100/24；DHCP 已关闭、不设网关。
      </Card>
      <Card title="ifIndex 会变" icon={Search}>
        每次开机都可能变（见过 20 / 22 / 23），用 Get-NetAdapter 现查，别背数字。
      </Card>
      <Card title="需要管理员" icon={ShieldCheck}>
        改网卡配置走 Start-Process -Verb RunAs（会弹 UAC）；也可以用管理员 PowerShell。
      </Card>
      <Card title="别用中文网卡名" icon={AlertTriangle} tone="warn">
        不要把「以太网」写进参数，改用 Get-NetAdapter | Where-Object {"{ $_.ifIndex -eq 22 }"} 管道传对象。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：本机网卡排查与设置（完整命令）">
        <Pre>{`# 查网卡、ifIndex 与链路状态（ifIndex 每次开机可能变，现查）
Get-NetAdapter
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Select-Object Name, Status, LinkSpeed

# 统计收发字节（排查「链路 Up 但零报文」）
Get-NetAdapterStatistics | Where-Object { $_.Name -like "*以太网*" }

# 制造一次链路抖动（会短暂断网）
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Disable-NetAdapter
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Enable-NetAdapter

# 改静态地址需管理员（Start-Process -Verb RunAs，会弹 UAC）
New-NetIPAddress -InterfaceIndex 22 -IPAddress 172.26.188.100 -PrefixLength 24
Set-NetIPInterface -InterfaceIndex 22 -Dhcp Disabled

# 注意：Restart / Disable / Enable-NetAdapter 都不接受 -InterfaceIndex，必须管道传对象`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const TopologyPage = () => (
  <Frame
    kicker="网络"
    floor="05"
    title="一根网线直连两台 Pi，Wi-Fi 只作带外通道"
    lead="接哪台就控制哪台；网线两端都是静态地址、无网关，Windows 与 Pi 的无线同属 192.168.31.0/24，仅在改网络时当备用通道。"
    wide
  >
    <div className="space-y-4">
      <Topology />
      <Quote>这条网线是直连（笔记本 ↔ Pi）：两端任何一侧指望 DHCP 都不会成功。</Quote>
    </div>
  </Frame>
);

const DirectLink = () => (
  <Frame
    kicker="网络"
    floor="06"
    title="直连线上没有 DHCP，Pi 侧 eth0 必须配静态地址"
    lead="eth0 用 ipv4.method manual 固定地址、不设网关、never-default yes；万一 IPv4 不通，还有 IPv6 链路本地可以救急。"
  >
    <Grid cols={2}>
      <Card title="没有 DHCP 服务器" icon={AlertTriangle} tone="warn">
        直连线上别指望自动分配；Pi 的 eth0 出厂是 DHCP，会一直卡在 connecting (getting IP configuration)。
      </Card>
      <Card title="eth0 静态 + never-default" icon={Network}>
        ipv4.method manual、地址 /24、网关留空、never-default yes、ipv6 自动。
      </Card>
      <Card title="IPv6 链路本地备用" icon={Activity}>
        仅经网线可达，形如 fe80::...%&lt;ifIndex&gt;；Windows getaddrinfo 认得 %20。
      </Card>
      <Card title="改 eth0 会断 SSH" icon={Wifi}>
        优先走 Wi-Fi（新 Pi wlan0 192.168.31.29），或用 nohup 延迟执行再轮询验证。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：eth0 静态配置与改回 DHCP（完整命令）">
        <Pre>{`# 在 Pi 上改 eth0（新 Pi 172.26.188.116，旧 Pi 172.26.188.115）
sudo nmcli con mod netplan-eth0 \\
  ipv4.method manual ipv4.addresses 172.26.188.116/24 \\
  ipv4.gateway "" ipv4.never-default yes ipv6.method auto

# 改 eth0 会掐断走网线的 SSH：放后台延迟执行，再轮询验证
sudo nohup bash -c 'sleep 3; nmcli con up netplan-eth0' >/tmp/nm.log 2>&1 &

# 验证
ip -4 addr show eth0
ip -6 addr show eth0 scope link

# 改回 DHCP
python tools/pi.py --sudo "nmcli con mod netplan-eth0 ipv4.method auto ipv4.addresses '' && nmcli con up netplan-eth0"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Tool = () => (
  <Frame
    kicker="工具"
    floor="07"
    title="tools/pi.py 一条命令替代交互式 SSH"
    lead="它用 paramiko 带密码非交互登录，把「登录 → 执行 → 回显」收成一条命令：复杂脚本走 --file，纯文件传输走 --put。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["选项", "作用", "说明"]}
        rows={[
          ["--sudo", "以 root 执行", "账号不在 NOPASSWD，必须显式加"],
          ["--host", "目标地址", "默认新 Pi 172.26.188.116；可传 fe80::...%20 这类带 scope 的链路本地地址"],
          ["--user / --pass", "账号密码", "默认 nanzhida / nanzhida；连旧 Pi 必须覆盖"],
          ["--file", "上传脚本并执行", "传到 /tmp/kilo-run.sh；复杂命令一律走这里"],
          ["--put", "只上传文件，不执行", "SFTP；不做 ~ 展开，远端要写绝对路径"],
        ]}
      />
      <Quote>Windows 自带 OpenSSH 没有 sshpass，不要直接调 ssh——密码无法非交互传入。</Quote>
      <Steps title="展开：完整用法、等价命令与被换掉的手敲动作">
        <Pre>{`# 用法
python tools/pi.py [--sudo] [--host <IP>] [--user <u>] [--pass <p>] [--file <本地脚本>] '<命令>'
python tools/pi.py --put <本地文件> <Pi 上的绝对路径>     # 只上传，不执行（SFTP，不做 ~ 展开）

# 基本
python tools/pi.py "hostname"
python tools/pi.py "ip -4 addr show eth0"

# 需要 root（账号不在 NOPASSWD，必须显式加 --sudo）
python tools/pi.py --sudo "apt-get install -y python3-opencv"
python tools/pi.py --sudo "systemctl status docker --no-pager"

# 连旧 Pi
python tools/pi.py --host 172.26.188.115 --user nczydx --pass 123456789 "hostname"

# 带 scope 的链路本地地址
python tools/pi.py --host fe80::2ecf:67ff:fece:9bce%20 "hostname"

# 上传并执行脚本（自动放到 /tmp/kilo-run.sh）
python tools/pi.py --file C:\\Users\\z\\AppData\\Local\\Temp\\kilo\\run.sh

# 只上传文件、不执行（SFTP；不做 ~ 展开，远端写绝对路径）
python tools/pi.py --put heartbeat_listener.py /home/nanzhida/microros_ws/src/heartbeat_listener.py

# 它替代的手敲动作：
#   ssh nanzhida@172.26.188.116 '...'                ← 无 sshpass，密码无法非交互传入
#   scp <本地文件> nanzhida@172.26.188.116:<远端>     ← 由 --put 代替

# 要点：
#   底层 paramiko 装在用户级 Python 3.14，务必用 PATH 上同一个 python（3.14.6）运行
#   pi.py 已把 stdout/stderr 设成 UTF-8（errors=replace），改脚本别删这两行
#   否则远端中文 / BOM 会让 Windows 控制台 GBK 直接 UnicodeEncodeError 崩掉`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Usages = () => (
  <Frame
    kicker="工具"
    floor="08"
    title="四类常见调用：执行、提权、传脚本、连旧机"
    lead="把要重复的动作直接对号入座；含引号、括号、管道的命令一律先写成纯 ASCII 的 .sh。"
  >
    <Grid cols={2}>
      <Card title="执行命令" icon={Terminal}>
        <code>python tools/pi.py "hostname"</code>
      </Card>
      <Card title="需要 root" icon={KeyRound}>
        <code>python tools/pi.py --sudo "apt-get install -y python3-opencv"</code>
      </Card>
      <Card title="上传并运行脚本" icon={Upload}>
        <code>python tools/pi.py --file start_cam.sh</code>
      </Card>
      <Card title="连旧 Pi" icon={Server}>
        加 <code>--host 172.26.188.115 --user nczydx --pass 123456789</code>
      </Card>
    </Grid>
    <div className="mt-4">
      <Quote>复杂命令 / 含引号括号管道 → 写成纯 ASCII 的 .sh，再用 --file 执行。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：常用调用示例">
        <Pre>{`python tools/pi.py "hostname"
python tools/pi.py "ip -4 addr show eth0"
python tools/pi.py --sudo "systemctl status docker --no-pager"
python tools/pi.py --host fe80::2ecf:67ff:fece:9bce%20 "hostname"
python tools/pi.py --file deploy_cam.sh`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const DecisionBlock = () => (
  <Frame
    kicker="工具"
    floor="10"
    title="手敲 ssh 易错，脚本化 pi.py 可复现"
    wide
  >
    <div className="space-y-4">
      <Decision />
      <Grid cols={2}>
        <Card title="方案 A · 手敲 ssh / scp" icon={AlertTriangle} tone="warn">
          逐条敲登录、传文件、起进程；密码交互输入，引号在 PowerShell 里反复被破坏。
        </Card>
        <Card title="方案 B · 脚本化 pi.py" icon={ShieldCheck} tone="good">
          操作固化成 <code>tools/pi.py</code> + 纯 ASCII 的 <code>.sh</code>，参数写进脚本与 docs。
        </Card>
      </Grid>
      <DataTable
        head={["维度", "方案 A：手敲 ssh / scp", "方案 B：脚本化 pi.py"]}
        rows={[
          ["出错率", "高：引号、密码、路径三层都易错，失败要重敲", "低：命令与参数固化在脚本里，可回看可复用"],
          ["速度", "首次快（一条命令），重复操作每次都要重打", "首次要写脚本，之后每条命令一次调用"],
          ["可复现性", "差：只留在终端历史与个人记忆里", "强：脚本 + docs 同步，别人可照抄"],
          ["适用场景", "临时查看、只做一次", "反复执行、要写进文档、要交给别人"],
        ]}
      />
      <Quote>
        辩证一问：「什么情况下手敲 ssh 反而更合适？」——一次性的临时探察，或在 Pi 上交互式反复试参数时，直接登录上手最快；但只要命令要重复、要交给别人、或要写进文档，就应立刻收进 pi.py 与脚本。
      </Quote>
    </div>
  </Frame>
);

const Deploy = () => (
  <Frame
    kicker="部署"
    floor="11"
    title="服务靠 nohup 常驻，Pi 重启后要重新上传启动"
    lead="把脚本写成纯 ASCII 的 .sh 上传执行，用 nohup 让服务脱离 SSH 会话常驻，再查端口与日志确认。"
    wide
  >
    <div className="space-y-4">
      <DeployFlow />
      <Focus
        no="1"
        title="上传 → 启动 → 验证"
        tag="流程"
        goal="把要跑的东西送上 Pi，并让它脱离 SSH 会话持续运行。"
        points={[
          "脚本包成 .sh 上传，避免 PowerShell → paramiko → bash 三层引号。",
          "nohup … > /tmp/xxx.log 2>&1 & 后台运行，SSH 断开也不被杀。",
          "ss -ltn 查端口是否监听，tail 看日志确认运行状态。",
          "本机用 ping / --check 做端到端验证。",
        ]}
        aside={
          <Card title="示例：摄像头服务" icon={Terminal}>
            python3 cam_server.py --bind 172.26.188.116
            <br />
            日志：/tmp/cam_server.log
          </Card>
        }
      />
      <Steps title="展开：部署常驻服务（完整命令）">
        <Pre>{`# 1) 本机写好纯 ASCII 脚本并上传执行
python tools/pi.py --file start_service.sh

# start_service.sh 示例（在 Pi 上运行）
# nohup python3 cam_server.py --bind 172.26.188.116 \\
#   > /tmp/cam_server.log 2>&1 &

# 2) 在 Pi 上确认端口与进程
python tools/pi.py "ss -ltn | grep 5000"
python tools/pi.py "pgrep -af cam_server"

# 3) 看日志
python tools/pi.py "tail -n 50 /tmp/cam_server.log"

# 4) 常驻容器（例：micro-ROS Agent，见 ROS2 与 micro-ROS 选型 deck）
docker run -d --name microros_agent --network host \\
  -v ~/microros_ws:/microros_ws ros:jazzy-ros-base bash -lc \\
  'source /opt/ros/jazzy/setup.bash; source /microros_ws/install/setup.bash; \\
   exec ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888'
python tools/pi.py "docker logs --tail 30 microros_agent"`}</Pre>
        <p className="text-[0.84rem] text-muted">
          Pi 重启后 <code>/home/nanzhida/</code> 下的脚本与后台进程都会丢，需重新上传并启动；
          Agent 目前未设开机自启，手动起，并且要<b>先起 Agent、再给 ESP32 上电</b>（起晚了固件也会自动重连）。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Troubleshoot = () => (
  <Frame
    kicker="排障"
    floor="12"
    title="先看链路再看地址：0 bps 是物理层，不是软件问题"
    lead="按「物理层 → 地址 → 网关以外的临时租约」的顺序排查，多数连接问题一眼能定位。"
    wide
  >
    <DataTable
      head={["现象", "原因", "处理"]}
      rows={[
        ["LinkSpeed 0 bps / Disconnected，收发字节长期为 0", "物理层无信号（网线 / 接口）", "属物理层，换线 / 重插；强制 1G / 100M、关节能、复位网卡都无效"],
        ["卡在 connecting (getting IP configuration)", "eth0 是 DHCP，直连线无服务器", "改静态 IP，或直接用 IPv6 链路本地"],
        ["IPv4 与 IPv6 同时不通", "NM 因反复 DHCP 失败失活该设备（链路仍 1 Gbps Up 但零入站报文）", "本机网卡 disable/enable 制造链路抖动，或重插线 / 重启 Pi"],
        ["只有 IPv6 能通", "Pi 没有 IPv4", "用 fe80::2ecf:67ff:fece:9bce%<ifIndex> 直连"],
        ["Destination host unreachable", "ARP 无应答，网段不对", "确认 Pi 是否在该网段、链路是否 Up"],
        ["记成 172.26.188.114 连不上", "那是旧 Pi wlan0 从手机热点 DHCP 拿到的临时租约", "不要再用 .114；IPv4 用上表地址"],
        ["串口 Access is denied", "COM 口被独占（GUI 占着口）", "先停占用程序（或就用 GUI 自己读）"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：排障命令合集">
        <Pre>{`# 本机（Windows）看链路与地址
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 }
Get-NetAdapterStatistics | Where-Object { $_.Name -like "*以太网*" }

# 制造一次链路抖动（会短暂断网）
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Disable-NetAdapter
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Enable-NetAdapter

# Pi 侧
ip -4 addr show eth0
ip -6 addr show eth0 scope link
cat /etc/netplan/*.yaml

# 从 Pi 看能否到本机（诊断入站是否被拦）
ping -c 3 172.26.188.100

# LinkSpeed 0 bps = 物理层无信号，换线 / 重插即可，
# 强制 1G/100M、关节能、复位网卡都无效

# 网络可达性：7gp.cn 与 GitHub（已推送文件）可直连；
# 只有 Docker Hub 需要本机 Clash 代理

# 备份通道：改 eth0 前优先走 Wi-Fi（Pi wlan0 192.168.31.29）
python tools/pi.py --host 192.168.31.29 "ip -4 addr show eth0"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Gotchas = () => (
  <Frame
    kicker="排障"
    floor="14"
    title="PowerShell 5.1 没有 &&，三层引号必须走 .sh"
  >
    <Grid cols={2}>
      <Card title="不支持 &&" icon={AlertTriangle} tone="warn">
        不要写 &&：Windows PowerShell 5.1 没有它，用 <code>;</code> 分隔，或用 <code>if ($?) {"{ ... }"}</code>。
      </Card>
      <Card title="别用中文网卡名" icon={Network}>
        用 Get-NetAdapter | Where-Object {"{ $_.ifIndex -eq 22 }"} 管道传对象，别把网卡名当参数。
      </Card>
      <Card title="三层引号易碎" icon={Terminal}>
        PowerShell → paramiko → bash；含引号 / 括号 / 管道一律写成纯 ASCII 的 .sh。
      </Card>
      <Card title="临时脚本目录" icon={Upload}>
        临时脚本放 <code>C:\Users\z\AppData\Local\Temp\kilo\</code>。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>
        不要把中文路径写进 .ps1：UTF-8 无 BOM 会被按 ANSI 读，生成乱码目录；需要时用 bash 内联命令或带 BOM 的脚本。
      </Quote>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame
    kicker="收尾"
    floor="15"
    title="工具与文字版全文，随 deck 下载"
    wide
  >
    <Grid cols={2}>
      <Card title="随 deck 分发的工具" icon={Download}>
        <p>
          <a className="font-semibold text-brand-700 underline" href="./files/pi工具与WSL编库脚本.zip">
            files/pi工具与WSL编库脚本.zip
          </a>
        </p>
        <p className="mt-2 text-muted">pi.py + microros_lib_wsl.sh + README。</p>
      </Card>
      <Card title="工作区内的位置" icon={FolderTree}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>文字版：<code>docs/树莓派连接与部署.md</code></li>
          <li>连接工具：<code>tools/pi.py</code></li>
          <li>环境与踩坑备忘：<code>AGENTS.md</code></li>
        </ul>
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        相邻主题：<code>项目结构整理</code>（环境与协作前提）、<code>摄像头远程显示</code>、
        <code>ROS 2 与 micro-ROS 选型</code>（都用本 deck 的部署方式上机）。
      </Card>
      <Card title="下载地址约定" icon={Target}>
        离线首选 <code>./files/…</code>（随 deck 分发）；在线地址以 <code>origin/main</code> 已推送为准，未推送的链接是 404。
      </Card>
    </Grid>
  </Frame>
);

const Action = () => (
  <Frame
    kicker="收尾"
    floor="16"
    title="照这份清单做：先连上、再部署、改动前想清楚会不会断网"
    wide
  >
    <div className="space-y-5">
      <Quote>先把直连链路与静态地址确认到位，再谈部署；改网卡 / 网络前先想清楚会不会断掉当前 SSH。</Quote>
      <Grid cols={3}>
        <Card title="先看链路" icon={Activity} tone="good">
          网卡 Status / LinkSpeed、收发字节是否为 0；0 bps 直接换线、重插。
        </Card>
        <Card title="再查地址" icon={Search}>
          Pi 端 <code>ip -4 addr</code>，本机 <code>Get-NetAdapter</code>，确认在 172.26.188.0/24。
        </Card>
        <Card title="复用工具" icon={ListChecks}>
          一律走 <code>tools/pi.py</code>，不手敲 ssh；复杂命令写成 .sh 用 --file。
        </Card>
      </Grid>
      <div className="border-t border-line pt-4">
        <p className="mb-3 text-[0.82rem] font-bold tracking-wide text-muted">记忆锚：把这条链压成一句话</p>
        <AnchorCards />
      </div>
      <Steps title="展开：从连上到部署上机的完整步骤">
        <Pre>{`# 1) 确认链路与地址
Get-NetAdapter                                       # 本机看 ifIndex / Status / LinkSpeed
python tools/pi.py "ip -4 addr show eth0"            # Pi 侧确认静态地址

# 2) 必要时改 Pi eth0（改成静态，会短暂断 SSH）
python tools/pi.py --sudo --file set_eth0_static.sh  # 脚本内用 nohup 延迟执行

# 3) 部署常驻服务（纯 ASCII 的 .sh）
python tools/pi.py --file start_service.sh
python tools/pi.py "ss -ltn | grep 5000"
python tools/pi.py "tail -n 50 /tmp/cam_server.log"

# 4) 端到端验证（本机）
python "教学demo/摄像头远程显示/cam_view.py" --check --frames 30

# 5) 记进文档：用到的命令与参数同步到 docs/树莓派连接与部署.md`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Cpu}>
        下载：
        <a className="font-semibold text-brand-700 underline" href="./files/pi工具与WSL编库脚本.zip">
          pi工具与WSL编库脚本.zip
        </a>
        ；文字版见 <code>docs/树莓派连接与部署.md</code>。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "两台树莓派", group: "概览", el: <PiDevices /> },
  { nav: "部署链路", group: "概览", el: <DeployChain /> },
  { nav: "本机侧网络", group: "网络", el: <LocalSide /> },
  { nav: "连接拓扑", group: "网络", el: <TopologyPage /> },
  { nav: "直连要点", group: "网络", el: <DirectLink /> },
  { nav: "pi.py 用法", group: "工具", el: <Tool /> },
  { nav: "典型用法", group: "工具", el: <Usages /> },
  { nav: "文件同步与执行", group: "工具", el: <SyncFlow /> },
  { nav: "对比决策", group: "工具", el: <DecisionBlock /> },
  { nav: "部署常驻服务", group: "部署", el: <Deploy /> },
  { nav: "故障与处理", group: "排障", el: <Troubleshoot /> },
  { nav: "排查顺序", group: "排障", el: <TroubleOrder /> },
  { nav: "引号与 PowerShell 坑", group: "排障", el: <Gotchas /> },
  { nav: "下载与延伸", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
