import React from "react";
import {
  FolderTree,
  Layers,
  FileText,
  BookOpen,
  ShieldCheck,
  Terminal,
  Presentation,
  ListChecks,
  MessageSquare,
  FolderPlus,
  GitBranch,
  Rocket,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre } from "./components.jsx";

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
      把根目录散落的文档、代码与资料按用途归档，建立「提交前分类、提交后出教程」的固定流程。
    </p>
  </div>
);

const Problem = () => (
  <Frame kicker="背景" floor="01" title="整理前的问题">
    <Grid cols={3}>
      <Card title="入口不清" icon={FolderTree}>
        根目录同时堆着文档、脚本与竞赛资料，新成员不知道从哪看起。
      </Card>
      <Card title="职责混杂" icon={Layers}>
        可运行代码与技术文档、培训材料混在一起，改动容易互相影响。
      </Card>
      <Card title="难以复用" icon={FileText}>
        没有目录约定，示例、算法、模型、数据都没有固定位置。
      </Card>
    </Grid>
    <div className="mt-7">
      <Quote>目标：任何文件都能一眼判断「该放哪、去哪找」。</Quote>
    </div>
  </Frame>
);

const Principles = () => (
  <Frame kicker="原则" floor="02" title="四条整理原则">
    <Grid cols={2}>
      <Card title="按用途分类" icon={FolderTree}>
        文档 / 培训 / 演示 / 算法 / 模型 / 训练 / 数据 / 工具各自成目录。
      </Card>
      <Card title="对齐通用标准" icon={Layers}>
        参考 Cookiecutter Data Science 的 data / models / docs 分层。
      </Card>
      <Card title="每目录一个 README" icon={BookOpen}>
        说明用途与命名规则，新增内容先看对应 README。
      </Card>
      <Card title="大文件不入库" icon={ShieldCheck}>
        模型权重、数据集内容不提交，只保留说明与占位。
      </Card>
    </Grid>
  </Frame>
);

const Tree = () => (
  <Frame kicker="结构" floor="03" title="目录总览" wide>
    <DataTable
      head={["目录", "用途"]}
      rows={[
        ["docs/", "技术文档：设计原理、硬件参数、选型"],
        ["培训/", "培训资料与赛项规则解读"],
        ["教学demo/", "可直接运行的教学演示"],
        ["教学webppt/", "线下教学 web 幻灯片（每个提交主题一个子目录）"],
        ["算法/", "视觉 / 控制算法实现"],
        ["模型/", "模型权重与产物"],
        ["训练/", "模型训练脚本与配置"],
        ["数据/", "数据集（raw / interim / processed / external）"],
        ["tools/", "工程工具（树莓派连接脚本）"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：完整目录结构（含二级）">
        <ul className="space-y-1.5 font-mono text-[0.8rem] leading-relaxed">
          <li><span className="font-bold text-ink">AGENTS.md</span><span className="text-muted"> — 协作 / 环境备忘（树莓派连接与操作）</span></li>
          <li><span className="font-bold text-ink">README.md</span><span className="text-muted"> — 项目总览与目录约定</span></li>
          <li><span className="font-bold text-ink">docs/</span><span className="text-muted"> — 技术文档：设计原理、硬件参数、选型</span></li>
          <li><span className="font-bold text-ink">培训/</span><span className="text-muted"> — 培训资料与赛项规则解读</span></li>
          <li><span className="font-bold text-ink">教学demo/</span><span className="text-muted"> — 可直接运行的教学演示（每个 demo 一子目录）</span></li>
          <li><span className="font-bold text-ink">教学webppt/</span><span className="text-muted"> — 线下教学 web 幻灯片（每个主题一子目录）</span></li>
          <li><span className="font-bold text-ink">算法/</span><span className="text-muted"> — 视觉 / 控制算法实现</span></li>
          <li><span className="font-bold text-ink">模型/</span><span className="text-muted"> — 模型权重与产物</span></li>
          <li><span className="font-bold text-ink">训练/</span><span className="text-muted"> — 模型训练脚本、配置与数据说明</span></li>
          <li><span className="font-bold text-ink">数据/</span><span className="text-muted"> — 数据集（raw / interim / processed / external）</span></li>
          <li><span className="font-bold text-ink">tools/</span><span className="text-muted"> — 工程工具（树莓派连接脚本）</span></li>
        </ul>
      </Steps>
    </div>
  </Frame>
);

const Mapping = () => (
  <Frame kicker="结构" floor="04" title="与通用标准的对应" wide>
    <DataTable
      head={["本仓库", "通用对应", "说明"]}
      rows={[
        ["docs/", "docs / references", "设计、硬件、选型等参考文档"],
        ["培训/", "tutorials", "培训讲义、赛项解读"],
        ["教学demo/", "examples / demos", "最小可运行示例"],
        ["教学webppt/", "slides", "线下教学 web 幻灯片"],
        ["算法/", "src（算法部分）", "识别 / 定位 / 控制算法"],
        ["模型/", "models", "权重与序列化产物"],
        ["训练/", "modeling（train.py）", "训练脚本与配置"],
        ["数据/", "data", "数据集，内容不入库"],
        ["tools/", "scripts", "工程脚本"],
      ]}
    />
  </Frame>
);

const Filing = () => (
  <Frame kicker="结构" floor="05" title="归档去向：根目录文档放哪">
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
    <div className="mt-4">
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
新增 / 归档内容后     → 同步生成或更新对应 webppt 并构建成品`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Workflow = () => (
  <Frame kicker="流程" floor="06" title="工作流约定" wide>
    <Focus
      no="1"
      title="提交前：分类归档"
      tag="必做"
      goal="用户常在根目录新建 / 更新文档，提交前必须归档到正确分类目录。"
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
    <div className="mt-4">
      <Steps title="展开：归档操作完整命令">
        <Pre>{`# 1) 移动已跟踪文件（保留历史），路径含中文要加引号
git mv "赛项.md" "培训/赛项.md"
git mv "cam_server.py" "教学demo/摄像头远程显示/cam_server.py"

# 2) 新增目录先建 README，说明用途与命名
#    并在目标 README 与根 README 里登记

# 3) 只暂存本次相关文件
git add "培训/README.md" "培训/赛项.md" README.md

# 4) 提交信息沿用历史风格（不主动 push）
git commit -m "docs: 归档赛项资料到 培训/"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const AfterCommit = () => (
  <Frame kicker="流程" floor="07" title="提交后：出教程 webppt">
    <Grid cols={2}>
      <Card title="主动询问" icon={MessageSquare}>
        每次提交后询问是否需要生成对应的教程 webppt，不擅自跳过。
      </Card>
      <Card title="技能生成" icon={Presentation}>
        确认后调用 web-slide-deck 技能，产出单文件 HTML。
      </Card>
      <Card title="固定目录" icon={FolderPlus}>
        产物放 教学webppt/ 下以主题命名的目录，主题与提交 / 目录同名。
      </Card>
      <Card title="线下可用" icon={BookOpen}>
        单文件可双击打开，支持键盘 / 滑动翻页与手机适配。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：新增主题 deck 的完整流程">
        <Pre>{`# 1) 复制技能模板（或已有 deck）到新主题目录
#    教学webppt/<主题>/presentation/

# 2) 只改 src/slides.jsx（内容）与标题 / 品牌
#    components.jsx 各 deck 保持完全一致

# 3) 构建并把成品放到主题目录根
cd "教学webppt/<主题>/presentation"
npm install
npm run build
cp dist/index.html "../index.html"

# 4) 同步目录首页与 README
#    教学webppt/index.html 加卡片；README.md「已有主题」加条目

# 5) 校验：1366×860 与 390×844 逐页 overflowX === 0 且首行可见`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const ThisTime = () => (
  <Frame kicker="流程" floor="08" title="本次实际动作" wide>
    <DataTable
      head={["动作", "对象", "结果"]}
      rows={[
        ["git mv", "赛项.md → 培训/", "保留历史"],
        ["git mv", "cam_server.py / cam_view.py → 教学demo/摄像头远程显示/", "保留历史"],
        ["git mv", "pi.py → tools/", "保留历史"],
        ["git rm", "__pycache__/*.pyc", "构建产物不再入库"],
        ["新增", "各分类 README + 根 README", "目录约定可查"],
        ["更新", ".gitignore", "数据内容不入库"],
      ]}
    />
  </Frame>
);

const Closing = () => (
  <Frame kicker="收尾" floor="09" title="一句话约定">
    <div className="space-y-5">
      <Quote>
        根目录只作暂存区：任何文档在提交前必须归档，并同步更新对应 md；每次提交后确认是否生成教学 webppt。
      </Quote>
      <Grid cols={3}>
        <Card title="分类明确" icon={FolderTree}>
          看到文件就知道去哪找。
        </Card>
        <Card title="流程固定" icon={GitBranch}>
          归档 → 更新 md → 提交 → 出 webppt。
        </Card>
        <Card title="可持续" icon={Rocket}>
          目录约定写进 AGENTS.md，新会话可直接遵循。
        </Card>
      </Grid>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "整理前的问题", group: "概览", el: <Problem /> },
  { nav: "整理原则", group: "概览", el: <Principles /> },
  { nav: "目录总览", group: "结构", el: <Tree /> },
  { nav: "标准映射", group: "结构", el: <Mapping /> },
  { nav: "归档去向", group: "结构", el: <Filing /> },
  { nav: "工作流约定", group: "流程", el: <Workflow /> },
  { nav: "提交后动作", group: "流程", el: <AfterCommit /> },
  { nav: "本次动作", group: "流程", el: <ThisTime /> },
  { nav: "小结", group: "收尾", el: <Closing /> },
];
