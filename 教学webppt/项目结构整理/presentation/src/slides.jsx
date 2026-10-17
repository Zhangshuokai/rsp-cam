import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Database,
  Download,
  FileCode2,
  FileText,
  FolderPlus,
  FolderTree,
  GitBranch,
  Layers,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Play,
  Presentation,
  Rocket,
  RotateCcw,
  Route,
  ShieldCheck,
  Target,
  Terminal,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre } from "./components.jsx";

/* ============================================================
   守则第七节 · 点式动画（全册 ≤3 处）
   纯前端实现：React state + setTimeout + CSS transition，无任何外链资源。
   默认全亮（静态兜底：停帧 / 关动画 / 打印都完整可读）；播放时逐点 idle → active → done。
   颜色编码全册统一：蓝＝代码、橙＝数据 / 资源、青＝文档 / 说明、绿＝验证通过。
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

/* 颜色编码：同一含义固定同一颜色（全册一致） */
const SEQ_TONE = {
  code: { on: "border-brand-300 bg-brand-50 text-brand-700", active: "border-brand-600 bg-brand-600 text-white" },
  data: { on: "border-amber-400 bg-amber-50 text-warn2", active: "border-warn2 bg-warn2 text-white" },
  doc: { on: "border-teal-300 bg-teal-50 text-teal2", active: "border-teal2 bg-teal2 text-white" },
};
const IDLE_TONE = "border-line bg-paper text-muted";
const DONE_TONE = "border-good bg-good text-white";
const PING_BG = { code: "bg-brand-400/50", data: "bg-amber-400/50", doc: "bg-teal-400/50" };
const SEG_TONE = { code: "bg-brand-500", data: "bg-warn2", doc: "bg-teal2" };
const segClass = (side, st) =>
  st === "done" ? "bg-good" : st === "idle" ? "bg-line" : SEG_TONE[side] || "bg-brand-500";
const nodeTone = (side, st) =>
  st === "done" ? DONE_TONE : st === "idle" ? IDLE_TONE : (SEQ_TONE[side] || SEQ_TONE.code)[st];

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
      蓝＝代码（脚本 / 算法 / 工具）
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-warn2" />
      橙＝数据 / 资源
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-teal2" />
      青＝文档 / 说明
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝验证通过
    </span>
  </div>
);

/* ---- 点式动画 ① 最小工作区生成（横向）：建目录 → 放代码 / 数据 → 写说明 → 跑通 ---- */
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

/* ---- 点式动画 ③ 纵向点式分步（上手 / 排错顺序共用） ---- */
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
              : s.side === "doc"
              ? "bg-teal2 text-white"
              : s.side === "data"
              ? "bg-warn2 text-white"
              : "bg-brand-600 text-white";
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

/* ---- 记忆锚三卡（口诀 / 生活化类比 / 颜色编码），并在图里重复出现 ---- */
const AnchorCards = () => (
  <div className="grid gap-3 md:grid-cols-3">
    <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-brand-700">口 诀</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">一个目录、三类文件、一份说明</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        代码 + 数据 + 文档齐备，才算一个能交付的项目单元；缺一样就不算「一个项目」。
      </p>
    </div>
    <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-warn2">生活化类比</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">工作区＝书桌</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        常用的放手边（<code>tools/</code>、在跑的脚本），杂物理进抽屉（<code>docs/</code>、<code>培训/</code> 归档），桌上只留正在写的那一份——根目录就是这张「暂存桌面」。
      </p>
    </div>
    <div className="surface border-t-4 border-t-good p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-good">颜色编码</div>
      <div className="space-y-1.5 text-[0.9rem] font-semibold text-ink">
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-brand-600" />
          蓝＝代码
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-warn2" />
          橙＝数据 / 资源
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-teal2" />
          青＝文档 / 说明
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-good" />
          绿＝验证通过
        </p>
      </div>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        全册一致：看颜色就知道这是代码、数据还是说明。
      </p>
    </div>
  </div>
);

/* ---- 最小工作区生成（点式动画 ①）---- */
const WORKSPACE = [
  { no: "1", side: "doc", title: "建目录", sub: "先给项目一个名字：demo/" },
  { no: "2", side: "code", title: "放代码", sub: "main.py（可运行脚本）" },
  { no: "3", side: "data", title: "放数据", sub: "data/（输入与资源）" },
  { no: "4", side: "doc", title: "写说明", sub: "README.md（怎么用）" },
  { no: "5", side: "good", title: "跑通脚本", sub: "能运行 = 验证通过" },
];

const MinimalWorkspace = () => (
  <Frame
    kicker="概览"
    floor="06"
    title="最小工作区：一个目录、三类文件、一份说明"
    lead="能独立跑通、别人拿到就能用，才算一个项目单元；下面这条就是它的生成顺序。"
    wide
  >
    <div className="space-y-4">
      <PointFlow steps={WORKSPACE} />
      <Grid cols={3}>
        <Card title="代码（蓝）" icon={FileCode2}>
          能运行的脚本或算法；<code>main.py</code> 是入口，别人一眼知道从哪跑。
        </Card>
        <Card title="数据 / 资源（橙）" icon={Database}>
          输入、样例与权重放 <code>data/</code>；内容和来源在说明里写清。
        </Card>
        <Card title="文档 / 说明（青）" icon={FileText}>
          <code>README.md</code> 写用途、运行方法、依赖；缺说明就不算交付物。
        </Card>
      </Grid>
      <Quote>
        口诀：<strong>一个目录、三类文件、一份说明</strong>——三样齐备、脚本能跑通（全绿），这个项目才算立住。
      </Quote>
    </div>
  </Frame>
);

/* ---- 目录结构图：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） ---- */
const DIRS = [
  ["docs/", "技术文档：设计原理、硬件参数、选型、部署与协作记录", "doc"],
  ["培训/", "培训资料与赛项规则解读", "doc"],
  ["教学demo/", "可直接运行的最小示例（一个 demo 一个子目录）", "code"],
  ["教学webppt/", "线下教学 web 幻灯片（一个主题一个子目录，成品单文件）", "doc"],
  ["算法/", "视觉 / 控制算法实现", "code"],
  ["模型/", "模型权重与序列化产物", "data"],
  ["训练/", "训练脚本与配置", "code"],
  ["数据/", "数据集（raw / interim / processed / external，内容不入库）", "data"],
  ["tools/", "工程脚本工具（树莓派连接、串口监控等）", "code"],
];

const DIR_COLOR = {
  code: { dot: "#1f72d6", fill: "#eff8ff", stroke: "#93cdfb" },
  data: { dot: "#b4690e", fill: "#fef3c7", stroke: "#fbbf24" },
  doc: { dot: "#0ea5a3", fill: "#f0fdfa", stroke: "#5eead4" },
};

const DirTree = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 820 486"
      role="img"
      aria-label="rsp-cam 根目录下按用途划分的九个分类目录结构，按代码、数据、文档三类着色"
      className="h-auto w-full"
    >
      <rect x="16" y="194" width="176" height="72" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="104" y="226" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="700">rsp-cam/</text>
      <text x="104" y="248" textAnchor="middle" fill="#475569" fontSize="10.5">仓库根 · 只作暂存区</text>

      <text x="231" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">按用途</text>
      <line x1="192" y1="230" x2="286" y2="230" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="286" y1="38" x2="286" y2="422" stroke="#cbd5e1" strokeWidth="1.5" />

      {DIRS.map(([name, desc, side], i) => {
        const y = 18 + i * 48;
        const cy = y + 20;
        const c = DIR_COLOR[side];
        return (
          <g key={name}>
            <line x1="286" y1={cy} x2="320" y2={cy} stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="320" y={y} width="484" height="40" rx="8" fill={c.fill} stroke={c.stroke} />
            <circle cx="336" cy={y + 20} r="4.5" fill={c.dot} />
            <text x="350" y={y + 17} fill="#0f172a" fontSize="12.5" fontWeight="700">{name}</text>
            <text x="350" y={y + 32} fill="#475569" fontSize="10.5">{desc}</text>
          </g>
        );
      })}

      <text x="16" y="474" fill="#94a3b8" fontSize="10.5">
        根级另有两个文件：README.md（项目总览与目录约定）、AGENTS.md（协作与环境备忘）。
      </text>
    </svg>
    <div className="mt-3 border-t border-line pt-3">
      <ColorLegend />
    </div>
  </div>
);

/* ---- 提交流转：四步固定（点式动画 ②，归档 → 同步 md → 提交 → 出 deck） ---- */
const COMMIT_FLOW = [
  { no: "1", side: "code", title: "归档分类", sub: "git mv 进对应目录，保留历史" },
  { no: "2", side: "doc", title: "同步 md", sub: "更新目标目录 README" },
  { no: "3", side: "code", title: "提交", sub: "中文信息 · 不主动 push" },
  { no: "4", side: "doc", title: "出 webppt", sub: "生成 / 更新 deck · 构建成品" },
];

/* ---- 对比决策：先写后整 vs 入库即归类（内联 SVG） ---- */
const Decision = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 250"
      role="img"
      aria-label="对比决策：先把文件堆在根目录事后整理，还是提交前就归档到分类目录"
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

      <rect x="240" y="8" width="200" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="340" y="30" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">在根目录新建了一个文件</text>
      <text x="340" y="47" textAnchor="middle" fill="#475569" fontSize="10">还不知道该放哪 / 懒得想</text>

      <line x1="320" y1="58" x2="152" y2="98" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#dec-arrow-red)" />
      <line x1="360" y1="58" x2="528" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dec-arrow-teal)" />

      <rect x="16" y="100" width="260" height="118" rx="10" fill="#fef2f2" stroke="#fecaca" />
      <text x="32" y="126" fill="#0f172a" fontSize="12" fontWeight="700">方案 A · 先写后整</text>
      <text x="32" y="150" fill="#475569" fontSize="10">先堆在根目录，事后再统一整理</text>
      <text x="32" y="170" fill="#475569" fontSize="10">根目录越堆越乱，整理成批返工</text>
      <text x="32" y="194" fill="#9a3412" fontSize="10" fontWeight="700">结果：找不到入口，易误删 / 丢历史</text>

      <rect x="404" y="100" width="260" height="118" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="420" y="126" fill="#0f172a" fontSize="12" fontWeight="700">方案 B · 入库即归类</text>
      <text x="420" y="150" fill="#475569" fontSize="10">提交前就 git mv 进分类目录</text>
      <text x="420" y="170" fill="#475569" fontSize="10">目录始终可预测，改动局部化</text>
      <text x="420" y="194" fill="#0f766e" fontSize="10" fontWeight="700">结果：入口清晰，历史可查</text>

      <text x="16" y="240" fill="#94a3b8" fontSize="10">
        判定关键：文件是否只是探索期的临时产物——是则暂放，一旦定型就立即归档。
      </text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      项目结构整理
      <br />
      <span className="text-brand-600">分类目录与协作约定</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      根目录只是暂存区：新文件在提交前必须归档到对应目录，并同步相关文档与教学 deck。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整目录结构与命令。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="根目录只是暂存区，文件按用途归档"
    lead="仓库按用途分目录，每个目录一份 README；新文件在提交前必须归类，归档后再同步文档与教学 deck。"
  >
    <Grid cols={3}>
      <Card title="按用途分目录" icon={FolderTree}>
        docs / 培训 / 教学demo / 教学webppt / 算法 / 模型 / 训练 / 数据 / tools，一类一个目录。
      </Card>
      <Card title="每个目录一份 README" icon={BookOpen}>
        写清用途与命名规则；新增内容先看对应 README，再决定放哪。
      </Card>
      <Card title="根目录不放长期文件" icon={ShieldCheck} tone="good">
        根目录的新文件都是暂存，提交前用 <code>git mv</code> 移进分类目录并保留历史。
      </Card>
    </Grid>
  </Frame>
);

const Problem = () => (
  <Frame
    kicker="概览"
    floor="02"
    title="随手堆在根目录，新人找不到、自己也放不对"
    lead="整理前的三个典型问题，都源于根目录没有职责边界。"
  >
    <Grid cols={3}>
      <Card title="入口不清" icon={FolderTree} tone="warn">
        文档、脚本与竞赛资料同时堆在根目录，新成员不知道从哪看起。
      </Card>
      <Card title="职责混杂" icon={Layers} tone="warn">
        可运行代码与技术文档、培训材料混在一起，改动容易互相影响。
      </Card>
      <Card title="难以复用" icon={FileText} tone="warn">
        没有目录约定，示例、算法、模型、数据都没有固定位置。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>目标：任何文件都能一眼判断「该放哪、去哪找」。</Quote>
    </div>
  </Frame>
);

const Principles = () => (
  <Frame
    kicker="概览"
    floor="03"
    title="四条原则定下目录的边界"
  >
    <Grid cols={2}>
      <Card title="按用途分类" icon={FolderTree}>
        文档 / 培训 / 演示 / 算法 / 模型 / 训练 / 数据 / 工具各自成目录，互不混放。
      </Card>
      <Card title="对齐通用标准" icon={Layers}>
        参考数据科学项目模板（Cookiecutter Data Science）的 data / models / docs 分层。
      </Card>
      <Card title="每目录一个 README" icon={BookOpen}>
        说明用途与命名规则；新增内容先看对应 README，再登记到根 README。
      </Card>
      <Card title="大文件不入库" icon={ShieldCheck} tone="good">
        模型权重、数据集内容、密钥不提交，只保留说明与占位。
      </Card>
    </Grid>
  </Frame>
);

const Anchors = () => (
  <Frame
    kicker="概览"
    floor="04"
    title="先记住三把钩子：口诀、类比、颜色"
    lead="概念背不动没关系——先想起钩子，再顺出知识；这三个锚会在后面每张图里重复出现。"
    wide
  >
    <div className="space-y-4">
      <AnchorCards />
      <Quote>
        备考也照这个记：先复述口诀「一个目录、三类文件、一份说明」，再想书桌的比喻，最后确认颜色编码对不对。
      </Quote>
    </div>
  </Frame>
);

const TreePage = () => (
  <Frame
    kicker="结构"
    floor="07"
    title="九类目录各司其职，一眼看懂文件放哪"
    lead="顶层按用途分九个目录，并按下图颜色归入「代码 / 数据 / 文档」三类；每个目录对应通用分层里的一类资产。"
    wide
  >
    <div className="space-y-4">
      <DirTree />
      <DataTable
        head={["目录", "放什么", "对应通用分层"]}
        rows={[
          ["docs/", "技术文档：设计原理、硬件参数、选型、部署与协作记录", "docs / references"],
          ["培训/", "培训资料与赛项规则解读", "tutorials"],
          ["教学demo/", "可直接运行的最小示例（一个 demo 一个子目录）", "examples / demos"],
          ["教学webppt/", "线下教学 web 幻灯片（一个主题一个子目录，成品单文件）", "slides"],
          ["算法/", "视觉 / 控制算法实现", "src（算法部分）"],
          ["模型/", "模型权重与序列化产物", "models"],
          ["训练/", "训练脚本与配置", "modeling"],
          ["数据/", "数据集（raw / interim / processed / external，内容不入库）", "data"],
          ["tools/", "工程脚本工具（树莓派连接、串口监控等）", "scripts"],
        ]}
      />
      <Steps title="展开：根级文件与关键二级结构">
        <ul className="list-disc space-y-1.5 pl-5">
          <li><code>README.md</code> —— 项目总览与目录约定；<code>AGENTS.md</code> —— 给会话的环境与踩坑备忘。</li>
          <li><code>教学demo/&lt;demo&gt;/</code> —— 每个可运行示例一个子目录。</li>
          <li><code>教学webppt/&lt;主题&gt;/</code> —— <code>presentation/</code>（源码）、<code>index.html</code>（成品）、<code>files/</code>（附件）。</li>
          <li><code>数据/</code> —— <code>raw / interim / processed / external</code> 四级，内容不入库，只留 <code>.gitkeep</code>。</li>
        </ul>
      </Steps>
    </div>
  </Frame>
);

const Filing = () => (
  <Frame
    kicker="结构"
    floor="08"
    title="根目录的每个文件都有固定去处"
    lead="先判断「属于哪类」，再放进对应目录；移动已跟踪文件一律用 git mv。"
  >
    <Grid cols={2}>
      <Card title="资料与示例" icon={BookOpen}>
        培训资料 / 规则解读 → 培训/；可运行最小示例 → 教学demo/ 下同名子目录。
      </Card>
      <Card title="技术与产物" icon={Layers}>
        技术文档 → docs/；算法 → 算法/；权重产物 → 模型/；训练脚本 → 训练/。
      </Card>
      <Card title="数据与工具" icon={Terminal}>
        数据集 → 数据/（内容不入库）；脚本工具 → tools/。
      </Card>
      <Card title="教学讲义" icon={Presentation}>
        线下教学 webppt → 教学webppt/ 下以主题命名的子目录。
      </Card>
    </Grid>
    <div className="mt-4 space-y-3">
      <Steps title="展开：归档去向速查（完整）">
        <Pre>{`培训资料 / 规则解读   → 培训/
可运行最小示例        → 教学demo/<名称>/
技术文档              → docs/
算法实现              → 算法/
权重与产物            → 模型/
训练脚本              → 训练/
数据集                → 数据/（内容不入库）
脚本工具              → tools/
线下教学 webppt       → 教学webppt/<主题>/
新增 / 归档后         → 同步目标目录 README，并生成或更新对应 webppt 成品`}</Pre>
      </Steps>
      <Steps title="展开：本次整理的实际动作">
        <Pre>{`git mv 赛项.md → 培训/                          （保留历史）
git mv cam_server.py / cam_view.py → 教学demo/摄像头远程显示/
git mv pi.py → tools/
git rm __pycache__/*.pyc                        （构建产物不再入库）
新增   各分类 README + 根 README
更新   .gitignore（数据内容不入库）`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* ---- 新人上手 / 找不到东西时的排错顺序（点式动画 ③）---- */
const ONBOARD = [
  { side: "doc", t: "先看根 README.md", s: "搞清仓库分几类、每类放什么——这是总目录。" },
  { side: "doc", t: "再看目标目录的 README.md", s: "确定「这类东西放哪、怎么命名」。" },
  { side: "doc", t: "要细节翻 docs/", s: "原理、参数、部署与踩坑都在这；找不到就把这条路径当索引。" },
  { side: "code", t: "要跑起来进 教学demo/", s: "挑最小示例直接运行，用输出验证环境是否正常。" },
  { side: "good", t: "提交前回到归档流程", s: "归档 → 同步 md → 提交 → 出 deck：走一遍就算复位。" },
];

const Onboarding = () => (
  <Frame
    kicker="结构"
    floor="09"
    title="新人上手：按这个顺序找，不迷路"
    lead="面对一个不熟悉的仓库，别乱翻——照下面的顺序逐层推进，每一步都能定位到答案。"
    wide
  >
    <div className="space-y-4">
      <PointSteps steps={ONBOARD} hint="逐条点亮：上一层没看明白，就别急着跳到下一层。" />
      <Quote>
        口诀复用「先说明、后代码」：书桌上先看标签（README / docs），再动手翻抽屉（教学demo / tools）。
      </Quote>
    </div>
  </Frame>
);

const Workflow = () => (
  <Frame
    kicker="流程"
    floor="10"
    title="归档 → 同步 md → 提交 → 出 deck，四步固定"
    lead="根目录只是暂存区；新增或改动内容后，从「归档分类」重新走一遍。"
    wide
  >
    <div className="space-y-4">
      <PointFlow
        steps={COMMIT_FLOW}
        legend={false}
        hint="点节点可手动跳到该步；默认全亮＝静态兜底（关动画 / 打印照样完整）。"
      />
      <Focus
        no="1"
        title="归档前先自查三件事"
        tag="必做"
        goal="用户常在根目录新建 / 更新文档，提交前必须把它挪到正确的分类目录。"
        points={[
          "移动已跟踪文件用 git mv，保留历史。",
          "路径含中文，命令里要加引号。",
          "同步更新相关 md：目标目录 README，必要时根 README。",
        ]}
        aside={
          <Card title="检查清单" icon={ListChecks}>
            <ul className="space-y-1.5">
              <li>· 根目录是否还有未分类文件？</li>
              <li>· 目标目录 README 是否更新？</li>
              <li>· 根 README 目录树 / 映射表是否同步？</li>
            </ul>
          </Card>
        }
      />
      <Steps title="展开：归档操作完整命令">
        <Pre>{`# 1) 移动已跟踪文件（保留历史），路径含中文要加引号
git mv "根目录文档.md" "docs/根目录文档.md"
git mv "cam_server.py" "教学demo/摄像头远程显示/cam_server.py"

# 2) 新增目录先写该目录 README.md（用途 + 命名规则）
#    并在根 README.md 登记
git add "docs/README.md" "docs/根目录文档.md" README.md
git commit -m "docs: 归档 <主题> 到 docs/"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const AfterCommit = () => (
  <Frame
    kicker="流程"
    floor="11"
    title="归档后自动出 deck，提交信息沿用历史风格"
    lead="新增 / 归档内容后，同步生成或更新对应主题 deck 并构建成品，不再逐次询问。"
    wide
  >
    <Grid cols={2}>
      <Card title="主动出 deck" icon={Presentation} tone="good">
        用 <code>web-slide-deck</code> 技能生成或更新对应主题，产物放 <code>教学webppt/&lt;主题&gt;/</code>。
      </Card>
      <Card title="提交信息风格" icon={MessageSquare}>
        <code>docs(...)</code> / <code>feat(...)</code> / <code>fix(...)</code> + 中文描述；<strong>不主动 push</strong>。
      </Card>
      <Card title="主题即目录" icon={FolderPlus}>
        主题名 = 目录名 = 卡片标题 = 提交主题；新主题按全局顺序插位。
      </Card>
      <Card title="单文件交付" icon={BookOpen}>
        成品 CSS / JS 全内联，双击即播、可离线、可拷给别人。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：新增主题 deck 与提交的完整流程">
        <Pre>{`# 1) 复制一个已有 deck 的 presentation/（保证 components.jsx 一致）
#    不要用技能模板 assets/deck-template/（已落后，缺共用 Steps/Pre）

# 2) 只改 src/slides.jsx（内容）与标题 / 品牌
#    并改 package.json 的 name / description

# 3) 构建并把成品放到主题目录根
cd "教学webppt/<主题>/presentation"
npm install
npm run build
cp dist/index.html "../index.html"

# 4) 同步 教学webppt/index.html 卡片与 README.md「已有主题」栏
#    新增主题按全局顺序插位（工程与协作 → 环境与设备 → 感知 → 通信 → 执行）

# 5) 校验：1366×860 与 390×844 逐页 overflowX === 0 且首行可见
#    折叠块默认全部收起
git add "教学webppt/<主题>" 教学webppt/index.html 教学webppt/README.md
git commit -m "docs(webppt): 新增 <主题> deck"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const DecisionBlock = () => (
  <Frame
    kicker="流程"
    floor="12"
    title="先写后整 vs 入库即归类，选入库即归类"
    wide
  >
    <div className="space-y-4">
      <Decision />
      <Grid cols={2}>
        <Card title="方案 A · 先写后整" icon={AlertTriangle} tone="warn">
          新建文件时不去想放哪，先堆在根目录，等有空再统一整理。
        </Card>
        <Card title="方案 B · 入库即归类" icon={ShieldCheck} tone="good">
          提交前就 <code>git mv</code> 进分类目录并同步 md，让目录始终可预测。
        </Card>
      </Grid>
      <DataTable
        head={["维度", "方案 A：先写后整", "方案 B：入库即归类"]}
        rows={[
          ["当下成本", "几乎为零（不用想放哪）", "每次多花一分钟决定归类"],
          ["长期维护", "根目录越堆越乱，整理成批返工", "目录始终可预测，改动局部化"],
          ["新人上手", "找不到入口，只能猜目录", "看目录 README 就知道放哪"],
          ["出错风险", "清理时误删、git 历史丢失", "git mv 保留历史，有据可查"],
        ]}
      />
      <Quote>
        辩证一问：「什么情况下方案 A 反而更合理？」——探索期一次产生大量临时文件、结构尚未定型时，先在根目录或草稿区快速迭代，等产物稳定再统一归档，比反复搬动更省事；但一旦文件要提交，就应立刻归位。
      </Quote>
    </div>
  </Frame>
);

const Hygiene = () => (
  <Frame
    kicker="流程"
    floor="13"
    title="大文件与密钥不入库，换行用 .gitattributes 锁死"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["路径", "原因"]}
        rows={[
          [<code>__pycache__/</code>, "Python 构建产物"],
          [<><code>数据/*/</code> 内容（只留 <code>.gitkeep</code>）</>, "数据集体积大"],
          [<><code>node_modules/</code>、<code>**/presentation/dist/</code></>, "前端依赖与构建中间产物"],
          [<code>.vscode/</code>, "Live Server 写入的端口等本机状态"],
          [<code>.pio/</code>, "PlatformIO 构建产物与预编译 libmicroros（约 60 MB）"],
          [<code>教学demo/ESP32-S3-microROS/include/secrets.h</code>, "含 Wi-Fi 明文密码（模板 secrets.example.h 入库）"],
          [<code>.kilo/worktrees/</code>, "Kilo Agent Manager 的状态目录，不要手改"],
        ]}
      />
      <Quote>
        仓库另有 <code>.gitattributes</code>：<code>*.sh text eol=lf</code>；否则 clone 到 Windows 会把 WSL 脚本变成 CRLF，报 <code>$'\r': command not found</code>。
      </Quote>
      <Steps title="展开：.gitignore 关键条目与约定">
        <Pre>{`# Python 构建产物
__pycache__/
*.pyc

# 数据集体积大：只留占位
数据/*/
!数据/*/.gitkeep

# 前端依赖与构建中间产物
node_modules/
**/presentation/dist/

# 本机状态与产物
.vscode/
.pio/

# 含明文凭据，模板 .example 入库
教学demo/ESP32-S3-microROS/include/secrets.h`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame
    kicker="收尾"
    floor="14"
    title="协作约定全文与相关入口，随 deck 下载"
    wide
  >
    <Grid cols={2}>
      <Card title="随 deck 分发的文档" icon={Download}>
        <p>
          <a className="font-semibold text-brand-700 underline" href="./files/工作区结构与协作约定.md">
            files/工作区结构与协作约定.md
          </a>
        </p>
        <p className="mt-2 text-muted">
          含完整目录职责表、归档去向、最小工作区与记忆锚、不上库清单、webppt 构建约定与下载地址约定。
        </p>
      </Card>
      <Card title="工作区内的位置" icon={FolderTree}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>文字版：<code>docs/工作区结构与协作约定.md</code></li>
          <li>总览与目录树：<code>README.md</code></li>
          <li>环境与踩坑备忘：<code>AGENTS.md</code></li>
        </ul>
      </Card>
      <Card title="下载地址约定" icon={Target}>
        离线首选 <code>./files/…</code>（随 deck 分发）；在线地址见 <code>origin/main</code>，未推送的链接是 404，只给仓库内路径或 <code>files/</code> 副本。
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        相邻主题：<code>树莓派连接与部署</code>（环境与设备）、<code>摄像头参数与选型</code>（感知），均按本 deck 的目录约定归档。
      </Card>
    </Grid>
  </Frame>
);

const Action = () => (
  <Frame
    kicker="收尾"
    floor="15"
    title="照这份清单做，新文件先归档再提交"
    wide
  >
    <div className="space-y-5">
      <Quote>
        根目录只作暂存区：任何文档在提交前必须归档，并同步更新对应 md；归档 / 新增内容后自动生成或更新教学 deck。
      </Quote>
      <Grid cols={3}>
        <Card title="先判类" icon={FolderTree} tone="good">
          看到文件就想「属于哪类」，放进 docs / 培训 / 教学demo / 算法 / 模型 / 训练 / 数据 / tools / 教学webppt。
        </Card>
        <Card title="再同步" icon={GitBranch}>
          归档 → 同步目标目录 README → 提交 → 生成 / 更新对应 deck 并构建成品。
        </Card>
        <Card title="可持续" icon={Rocket}>
          目录约定写进 <code>AGENTS.md</code>，新会话可直接遵循。
        </Card>
      </Grid>
      <div className="surface flex flex-wrap items-center gap-x-5 gap-y-2 p-4">
        <span className="inline-flex items-center gap-2 text-[0.9rem] font-bold text-ink">
          <CheckCircle2 size={17} className="text-good" />
          记住三样，项目就立住
        </span>
        <ColorLegend />
      </div>
      <Steps title="展开：一次性整理步骤（完整命令）">
        <Pre>{`# 归档
git mv "<文件>" "<分类目录>/<文件>"
# 同步文档
#   改目标目录 README；必要时改根 README 目录树 / 映射表
# 提交（不 push）
git add "<分类目录>" README.md
git commit -m "docs: 归档 <主题>"
# 出 deck（如涉及内容）
cd "教学webppt/<主题>/presentation" && npm run build
cp dist/index.html "../index.html"`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Download}>
        下载：
        <a className="font-semibold text-brand-700 underline" href="./files/工作区结构与协作约定.md">
          工作区结构与协作约定.md
        </a>
        ；文字版见 <code>docs/工作区结构与协作约定.md</code>。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "整理前的问题", group: "概览", el: <Problem /> },
  { nav: "四条原则", group: "概览", el: <Principles /> },
  { nav: "记忆锚", group: "概览", el: <Anchors /> },
  { nav: "最小工作区", group: "概览", el: <MinimalWorkspace /> },
  { nav: "目录结构", group: "结构", el: <TreePage /> },
  { nav: "归档去向", group: "结构", el: <Filing /> },
  { nav: "新人上手顺序", group: "结构", el: <Onboarding /> },
  { nav: "协作流程", group: "流程", el: <Workflow /> },
  { nav: "提交与出 deck", group: "流程", el: <AfterCommit /> },
  { nav: "对比决策", group: "流程", el: <DecisionBlock /> },
  { nav: "不入库与换行", group: "流程", el: <Hygiene /> },
  { nav: "下载与延伸", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
