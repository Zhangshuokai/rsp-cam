import React from "react";
import {
  AlertTriangle,
  BookOpen,
  Download,
  FileText,
  FolderPlus,
  FolderTree,
  GitBranch,
  Layers,
  ListChecks,
  MessageSquare,
  Presentation,
  Rocket,
  ShieldCheck,
  Target,
  Terminal,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre } from "./components.jsx";

/* 目录结构图：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） */
const DIRS = [
  ["docs/", "技术文档：设计原理、硬件参数、选型、部署与协作记录"],
  ["培训/", "培训资料与赛项规则解读"],
  ["教学demo/", "可直接运行的最小示例（一个 demo 一个子目录）"],
  ["教学webppt/", "线下教学 web 幻灯片（一个主题一个子目录，成品单文件）"],
  ["算法/", "视觉 / 控制算法实现"],
  ["模型/", "模型权重与序列化产物"],
  ["训练/", "训练脚本与配置"],
  ["数据/", "数据集（raw / interim / processed / external，内容不入库）"],
  ["tools/", "工程脚本工具（树莓派连接、串口监控等）"],
];

const DirTree = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 820 486"
      role="img"
      aria-label="rsp-cam 根目录下按用途划分的九个分类目录结构"
      className="h-auto w-full"
    >
      <rect x="16" y="194" width="176" height="72" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="104" y="226" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="700">rsp-cam/</text>
      <text x="104" y="248" textAnchor="middle" fill="#475569" fontSize="10.5">仓库根 · 只作暂存区</text>

      <text x="231" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">按用途</text>
      <line x1="192" y1="230" x2="286" y2="230" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="286" y1="38" x2="286" y2="422" stroke="#cbd5e1" strokeWidth="1.5" />

      {DIRS.map(([name, desc], i) => {
        const y = 18 + i * 48;
        const cy = y + 20;
        return (
          <g key={name}>
            <line x1="286" y1={cy} x2="320" y2={cy} stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="320" y={y} width="484" height="40" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="336" y={y + 17} fill="#0f172a" fontSize="12.5" fontWeight="700">{name}</text>
            <text x="336" y={y + 32} fill="#475569" fontSize="10.5">{desc}</text>
          </g>
        );
      })}

      <text x="16" y="474" fill="#94a3b8" fontSize="10.5">
        根级另有两个文件：README.md（项目总览与目录约定）、AGENTS.md（协作与环境备忘）。
      </text>
    </svg>
  </div>
);

/* 协作流程图：内联 SVG */
const Flow = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 224"
      role="img"
      aria-label="从根目录暂存文件到归档分类、同步 md、提交、生成 webppt 的四步固定流程"
      className="h-auto w-full"
    >
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="8" y="66" width="132" height="88" rx="10" fill="#fffbeb" stroke="#fbbf24" />
      <text x="74" y="102" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">根目录</text>
      <text x="74" y="122" textAnchor="middle" fill="#475569" fontSize="10">新建 / 更新的文件</text>

      <line x1="140" y1="110" x2="164" y2="110" stroke="#0d9488" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <line x1="332" y1="110" x2="356" y2="110" stroke="#0d9488" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <line x1="524" y1="110" x2="548" y2="110" stroke="#0d9488" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <line x1="716" y1="110" x2="740" y2="110" stroke="#0d9488" strokeWidth="2" markerEnd="url(#flow-arrow)" />

      <rect x="168" y="56" width="164" height="108" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="184" y="88" fill="#0f766e" fontSize="12.5" fontWeight="700">① 归档分类</text>
      <text x="184" y="112" fill="#475569" fontSize="10.5">按用途放进对应目录</text>
      <text x="184" y="130" fill="#475569" fontSize="10.5">git mv 保留历史</text>

      <rect x="360" y="56" width="164" height="108" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="376" y="88" fill="#0f766e" fontSize="12.5" fontWeight="700">② 同步 md</text>
      <text x="376" y="112" fill="#475569" fontSize="10.5">更新目标目录 README</text>
      <text x="376" y="130" fill="#475569" fontSize="10.5">必要时同步根 README</text>

      <rect x="552" y="56" width="164" height="108" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="568" y="88" fill="#0f766e" fontSize="12.5" fontWeight="700">③ 提交</text>
      <text x="568" y="112" fill="#475569" fontSize="10.5">历史风格信息 + 中文描述</text>
      <text x="568" y="130" fill="#475569" fontSize="10.5">不主动 push</text>

      <rect x="744" y="56" width="148" height="108" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="760" y="88" fill="#0f766e" fontSize="12.5" fontWeight="700">④ 出 webppt</text>
      <text x="760" y="112" fill="#475569" fontSize="10.5">生成 / 更新主题 deck</text>
      <text x="760" y="130" fill="#475569" fontSize="10.5">构建成品</text>

      <text x="8" y="204" fill="#94a3b8" fontSize="10.5">
        根目录只是暂存区：新增或改动内容后，从「归档分类」重新走一遍。
      </text>
    </svg>
  </div>
);

/* 对比决策：先写后整 vs 入库即归类（内联 SVG） */
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
    kicker="背景"
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
    kicker="原则"
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

const TreePage = () => (
  <Frame
    kicker="结构"
    floor="04"
    title="九类目录各司其职，一眼看懂文件放哪"
    lead="顶层按用途分九个目录；每个目录对应通用分层里的一类资产。"
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
    floor="05"
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

const Workflow = () => (
  <Frame
    kicker="流程"
    floor="06"
    title="归档 → 同步 md → 提交 → 出 deck，四步固定"
    lead="根目录只是暂存区；新增或改动内容后，从「归档分类」重新走一遍。"
    wide
  >
    <div className="space-y-4">
      <Flow />
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
    floor="07"
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
    floor="08"
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
    floor="09"
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
    floor="10"
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
          含完整目录职责表、归档去向、不入库清单、webppt 构建约定与下载地址约定。
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
    floor="11"
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
  { nav: "目录结构", group: "结构", el: <TreePage /> },
  { nav: "归档去向", group: "结构", el: <Filing /> },
  { nav: "协作流程", group: "流程", el: <Workflow /> },
  { nav: "提交与出 deck", group: "流程", el: <AfterCommit /> },
  { nav: "对比决策", group: "流程", el: <DecisionBlock /> },
  { nav: "不入库与换行", group: "流程", el: <Hygiene /> },
  { nav: "下载与延伸", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
