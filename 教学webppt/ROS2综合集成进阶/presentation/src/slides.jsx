import React from "react";
import {
  AlertTriangle,
  BookOpen,
  Bot,
  Boxes,
  Bug,
  Compass,
  Download,
  Eye,
  FileText,
  FolderTree,
  Gauge,
  GitBranch,
  Layers,
  ListChecks,
  MapPin,
  Package,
  Puzzle,
  Radio,
  Rocket,
  Scale,
  ShieldCheck,
  Target,
  Timer,
  Trophy,
  Volume2,
  Workflow,
} from "lucide-react";
import { Frame, Card, DataTable, Figure, Grid, Quote, Steps, Pre } from "./components.jsx";

import f01 from "./assets/f01.jpg";
import f03 from "./assets/f03.jpg";
import f04 from "./assets/f04.jpg";
import f05 from "./assets/f05.jpg";
import f10 from "./assets/f10.jpg";
import f11 from "./assets/f11.jpg";
import f12 from "./assets/f12.jpg";
import f13 from "./assets/f13.jpg";
import f17 from "./assets/f17.jpg";
import f18 from "./assets/f18.jpg";
import f20 from "./assets/f20.jpg";
import f22 from "./assets/f22.jpg";

/* 单机流水线：内联 SVG（离线单文件，不用 ASCII / 线框图） */
const Pipeline = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 158"
      role="img"
      aria-label="单个机器人的流水线：导航到1号桌拿苹果，到2号桌拿大象，到3号桌按颜色放盒，最后回起点语音播报"
      className="h-auto w-full"
    >
      <defs>
        <marker id="pipe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0ea5a3" />
        </marker>
      </defs>
      <text x="8" y="16" fill="#0f766e" fontSize="12" fontWeight="700">
        单机流水线：导航 → 抓取 → 放置 → 回起点
      </text>

      <rect x="8" y="30" width="150" height="76" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="83" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">1号桌</text>
      <text x="83" y="78" textAnchor="middle" fill="#475569" fontSize="10">拿苹果（一只手）</text>
      <text x="83" y="94" textAnchor="middle" fill="#475569" fontSize="10">拍照 → 检测 → 点云</text>

      <rect x="177" y="30" width="150" height="76" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="252" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">2号桌</text>
      <text x="252" y="78" textAnchor="middle" fill="#475569" fontSize="10">拿大象（另一只手）</text>
      <text x="252" y="94" textAnchor="middle" fill="#475569" fontSize="10">同法取点云抓取</text>

      <rect x="346" y="30" width="150" height="76" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="421" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">3号桌</text>
      <text x="421" y="78" textAnchor="middle" fill="#475569" fontSize="10">按颜色放盒</text>
      <text x="421" y="94" textAnchor="middle" fill="#475569" fontSize="10">色检 → 2D 转 3D</text>

      <rect x="515" y="30" width="157" height="76" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="593" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">起点</text>
      <text x="593" y="78" textAnchor="middle" fill="#475569" fontSize="10">语音播报</text>
      <text x="593" y="94" textAnchor="middle" fill="#475569" fontSize="10">「我已完成任务」</text>

      <line x1="158" y1="68" x2="173" y2="68" stroke="#0ea5a3" strokeWidth="2" markerEnd="url(#pipe-arrow)" />
      <line x1="327" y1="68" x2="342" y2="68" stroke="#0ea5a3" strokeWidth="2" markerEnd="url(#pipe-arrow)" />
      <line x1="496" y1="68" x2="511" y2="68" stroke="#0ea5a3" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

      <rect x="8" y="120" width="664" height="30" rx="8" fill="#f1f5f9" stroke="#cbd5e1" />
      <text x="20" y="139" fill="#475569" fontSize="10">
        每一步之间：导航到达 / 抓取完成 / 放置完成各发一次 finish，主节点收到才推进状态机
      </text>
    </svg>
  </div>
);

/* 通信关系总览：消息序列（内联 SVG） */
const MessageFlow = () => (
  <div className="surface overflow-x-auto p-3 md:p-4">
    <svg
      viewBox="0 0 680 384"
      role="img"
      aria-label="主节点与导航、视觉、机械臂三个节点之间的消息序列：nav、finish、locate、grab、deploy"
      className="h-auto w-full min-w-[34rem]"
    >
      <defs>
        <marker id="seq-right" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1f72d6" />
        </marker>
        <marker id="seq-left" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0ea5a3" />
        </marker>
      </defs>

      <rect x="24" y="8" width="120" height="30" rx="8" fill="#e0edfd" stroke="#93cdfb" />
      <text x="84" y="28" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">主节点</text>
      <rect x="240" y="8" width="120" height="30" rx="8" fill="#ffffff" stroke="#cbd5e1" />
      <text x="300" y="28" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">导航节点</text>
      <rect x="408" y="8" width="120" height="30" rx="8" fill="#ffffff" stroke="#cbd5e1" />
      <text x="468" y="28" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">视觉节点</text>
      <rect x="556" y="8" width="112" height="30" rx="8" fill="#ffffff" stroke="#cbd5e1" />
      <text x="612" y="28" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">机械臂节点</text>

      <line x1="84" y1="44" x2="84" y2="374" stroke="#cbd5e1" strokeDasharray="4 4" />
      <line x1="300" y1="44" x2="300" y2="374" stroke="#cbd5e1" strokeDasharray="4 4" />
      <line x1="468" y1="44" x2="468" y2="374" stroke="#cbd5e1" strokeDasharray="4 4" />
      <line x1="612" y1="44" x2="612" y2="374" stroke="#cbd5e1" strokeDasharray="4 4" />

      <text x="192" y="66" textAnchor="middle" fill="#1a5cae" fontSize="10" fontWeight="700">nav「1号桌」</text>
      <line x1="84" y1="72" x2="296" y2="72" stroke="#1f72d6" strokeWidth="1.6" markerEnd="url(#seq-right)" />

      <text x="192" y="90" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">finish</text>
      <line x1="296" y1="96" x2="88" y2="96" stroke="#0ea5a3" strokeWidth="1.6" markerEnd="url(#seq-left)" />

      <text x="276" y="118" textAnchor="middle" fill="#1a5cae" fontSize="10" fontWeight="700">locate（物体, 苹果）</text>
      <line x1="84" y1="124" x2="464" y2="124" stroke="#1f72d6" strokeWidth="1.6" markerEnd="url(#seq-right)" />

      <text x="276" y="142" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">响应 point_cloud</text>
      <line x1="464" y1="148" x2="88" y2="148" stroke="#0ea5a3" strokeWidth="1.6" markerEnd="url(#seq-left)" />

      <text x="348" y="170" textAnchor="middle" fill="#1a5cae" fontSize="10" fontWeight="700">grab（一只手 + 点云）</text>
      <line x1="84" y1="176" x2="608" y2="176" stroke="#1f72d6" strokeWidth="1.6" markerEnd="url(#seq-right)" />

      <text x="348" y="194" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">finish（抓取完成）</text>
      <line x1="608" y1="200" x2="88" y2="200" stroke="#0ea5a3" strokeWidth="1.6" markerEnd="url(#seq-left)" />

      <text x="276" y="222" textAnchor="middle" fill="#1a5cae" fontSize="10" fontWeight="700">locate（颜色, 蓝 / 绿）</text>
      <line x1="84" y1="228" x2="464" y2="228" stroke="#1f72d6" strokeWidth="1.6" markerEnd="url(#seq-right)" />

      <text x="276" y="246" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">响应 pose</text>
      <line x1="464" y1="252" x2="88" y2="252" stroke="#0ea5a3" strokeWidth="1.6" markerEnd="url(#seq-left)" />

      <text x="348" y="274" textAnchor="middle" fill="#1a5cae" fontSize="10" fontWeight="700">deploy（手 + 位姿）</text>
      <line x1="84" y1="280" x2="608" y2="280" stroke="#1f72d6" strokeWidth="1.6" markerEnd="url(#seq-right)" />

      <text x="348" y="298" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">finish（放置完成）</text>
      <line x1="608" y1="304" x2="88" y2="304" stroke="#0ea5a3" strokeWidth="1.6" markerEnd="url(#seq-left)" />

      <text x="192" y="326" textAnchor="middle" fill="#1a5cae" fontSize="10" fontWeight="700">nav「起点」</text>
      <line x1="84" y1="332" x2="296" y2="332" stroke="#1f72d6" strokeWidth="1.6" markerEnd="url(#seq-right)" />

      <text x="192" y="350" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">finish → 播报并清零</text>
      <line x1="296" y1="356" x2="88" y2="356" stroke="#0ea5a3" strokeWidth="1.6" markerEnd="url(#seq-left)" />

      <text x="8" y="378" fill="#94a3b8" fontSize="10">
        蓝色＝主节点发出（nav / grab / deploy / locate 请求）；绿色＝各节点回执（finish / 服务响应）。2号桌、3号桌重复同一模式。
      </text>
    </svg>
  </div>
);

/* 对比决策：两种起手式的判定路径（内联 SVG） */
const Decision = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 236"
      role="img"
      aria-label="两种起手式对比：直接进系统搭节点，与先画通信图再上机"
      className="h-auto w-full"
    >
      <defs>
        <marker id="dec-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b91c1c" />
        </marker>
        <marker id="dec-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="250" y="8" width="180" height="46" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="340" y="28" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">拿到题目</text>
      <text x="340" y="45" textAnchor="middle" fill="#475569" fontSize="10">两台机器人 + 一段口令</text>

      <line x1="320" y1="54" x2="152" y2="90" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#dec-red)" />
      <line x1="360" y1="54" x2="528" y2="90" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dec-teal)" />

      <rect x="16" y="92" width="260" height="112" rx="10" fill="#fef2f2" stroke="#fecaca" />
      <text x="32" y="116" fill="#0f172a" fontSize="12" fontWeight="700">方案 A · 直接进系统搭</text>
      <text x="32" y="138" fill="#475569" fontSize="10">点开界面边搭边想，指令能拖就拖</text>
      <text x="32" y="156" fill="#475569" fontSize="10">接口对不齐时整块推倒重来</text>
      <text x="32" y="182" fill="#9a3412" fontSize="10" fontWeight="700">结果：出错不知错在哪，返工多</text>

      <rect x="404" y="92" width="260" height="112" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="420" y="116" fill="#0f172a" fontSize="12" fontWeight="700">方案 B · 先画通信图</text>
      <text x="420" y="138" fill="#475569" fontSize="10">画清谁发布 / 谁订阅 / 谁请求 / 谁响应</text>
      <text x="420" y="156" fill="#475569" fontSize="10">接口字段与话题约定逐一对齐</text>
      <text x="420" y="182" fill="#0f766e" fontSize="10" fontWeight="700">结果：照图搭节点，错在哪一眼可见</text>

      <text x="16" y="228" fill="#94a3b8" fontSize="10">
        判定关键：是否需要把结构讲给别人 / 与队友协作——需要就先画图；只验证单个内置指令行为时可直接试。
      </text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      进阶课 · 2026-09-22 培训录屏整理
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      ROS2综合集成进阶
      <br />
      <span className="text-brand-600">从画通信图到四节点调通</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      以《功能模块改造与集成》图文详解版为教材，一页一个知识点，把「先设计通信、再落节点」的方法论练成肌肉记忆。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整函数与步骤，深度材料见收尾下载。
    </p>
  </div>
);

const Overview = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="先画通信图，再进系统搭——本课就练这一件事"
    lead="这是赛前唯一开放练习的实验；正式比赛任务更复杂，但「先设计通信、再落节点」的方法论一致。"
  >
    <Grid cols={3}>
      <Card title="本课干什么" icon={Workflow}>
        每台机器人四个节点（Node）：主节点调度、导航、视觉、机械臂。你要创建 1 个服务（Service）＋ 4 个话题（Topic），把状态机推进到底。
      </Card>
      <Card title="先备什么" icon={ListChecks}>
        ROS 2 通信基础（话题 / 服务 / 回调（Callback））与坐标系变换；实验里语音解析、目标检测、导航、抓取模型都已内置。
      </Card>
      <Card title="学完能达到什么" icon={Target} tone="good">
        能独立把「苹果 → 大象 → 按色放置 → 回起点」整条链路搭通、跑通仿真，遇到报错知道去哪个节点看。
      </Card>
    </Grid>
    <div className="mt-5">
      <Quote>
        培训原话：「很多同学一上来直接在界面里创建函数，思路不会像画图这么清晰，调试到最后连哪里错都不知道。」
      </Quote>
    </div>
  </Frame>
);

const Mission = () => (
  <Frame
    kicker="任务与拆解"
    floor="02"
    title="两台机器人各跑一遍，彼此不通信"
    lead="虚拟工程师（语音下达指令的上位角色）先指挥 R1 完成任务，再指挥 G1 做同样的事；两机都待在待命（STANDBY）态，听到唤醒词才动。"
  >
    <Grid cols={2}>
      <Card title="口令长什么样" icon={Volume2}>
        「你好小新，去 1 号桌拿一个苹果，去 2 号桌拿一个大象，把苹果放到蓝色盒子里，把大象放到绿色盒子里，然后回到起点。」
      </Card>
      <Card title="唤醒词可自定义" icon={Radio}>
        R1 的唤醒词是「你好小新」，可在「设置唤醒词」指令里改；听到唤醒词后，这句话被语音解析成关键词，任务信息现成可用。
      </Card>
    </Grid>
    <div className="mt-4">
      <Card title="别为「两机协同」建话题" icon={AlertTriangle} tone="bad">
        两机之间没有通信——不要去设计跨机器人话题。把同一套逻辑在 R1、G1 各跑一遍即可。
      </Card>
    </div>
  </Frame>
);

const Breakdown = () => (
  <Frame
    kicker="任务与拆解"
    floor="03"
    title="一句话拆出八个关键数据，再排成一条流水线"
    lead="语音解析后要提取 4 个目的地 ＋ 2 个抓取物 ＋ 2 个放置色，正好落进任务字典的 8 个键。"
    wide
  >
    <div className="space-y-4">
      <Pipeline />
      <Grid cols={3}>
        <Card title="4 个目的地" icon={MapPin}>
          1 号桌、2 号桌、3 号桌、起点；对应字典 key <code>target1-1</code>、<code>target2-1</code>、<code>target3-1</code>、<code>target4</code>。
        </Card>
        <Card title="2 个抓取物" icon={Package}>
          苹果、大象；对应 <code>target1-2</code>、<code>target2-2</code>。两次抓取必须一左一右。
        </Card>
        <Card title="2 个放置色" icon={Boxes}>
          蓝色、绿色收纳盒；对应 <code>target3-2</code>、<code>target3-3</code>，靠颜色检测定位盒子上方。
        </Card>
      </Grid>
    </div>
  </Frame>
);

const Nodes = () => (
  <Frame
    kicker="通信设计"
    floor="04"
    title="四个节点各管一摊，主节点只做调度"
    lead="每台机器人内部有四个节点，所有功能都要在这四个节点里实现；主节点不亲自干活，只收完成信号、发下一道指令。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["节点", "职责", "参考函数数"]}
        rows={[
          ["主节点", "业务调度器：听完成信号、请求视觉、下达导航 / 机械臂指令、推进状态机", "7 个"],
          ["导航节点", "接收导航目的地 → 执行「导航到航点」→ 到达后发 finish", "3 个"],
          ["视觉节点", "实时刷新相机图像；提供 locate 服务（物体 → 点云 / 颜色 → 位姿）", "4 个"],
          ["机械臂节点", "收 grab / deploy → 位姿估计 + TF + 移动 + 夹爪动作 → 发 finish", "5 个"],
        ]}
      />
      <Grid cols={2}>
        <Figure
          src={f01}
          alt="四节点全函数设计图（参考图·总览）"
          caption="▲ 图1｜四节点全函数设计图（参考图·总览）——对照后文逐节点看（会议5 回看 1:34:10）"
        />
        <Figure
          src={f03}
          alt="四节点通信关系图（概念版）"
          caption="▲ 图3｜四节点通信关系图（概念版）：每台机器人各需编辑四个节点（会议5 回看 58:20）"
        />
      </Grid>
    </div>
  </Frame>
);

const Assets = () => (
  <Frame
    kicker="通信设计"
    floor="05"
    title="要创建的通信资产：1 个服务 ＋ 4 个话题"
    lead="主节点订阅 finish，发布 nav、grab、deploy，并向 locate 服务发起请求；接口字段要和话题约定逐一对齐。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["资产", "类型", "字段", "谁用"]}
        rows={[
          ["locate", "服务", "请求 detect_type ＋ detect_name；响应 point_cloud 或 pose", "主节点请求 / 视觉节点响应"],
          ["finish", "话题", "布尔 is_finish", "导航、机械臂发布 / 主节点订阅"],
          ["nav", "话题", "字符串（航点名，如「1号桌」）", "主节点发布 / 导航节点订阅"],
          ["grab", "话题", "布尔 hand ＋ 目标点云", "主节点发布 / 机械臂节点订阅"],
          ["deploy", "话题", "布尔 hand ＋ 放置位姿", "主节点发布 / 机械臂节点订阅"],
        ]}
      />
      <MessageFlow />
      <Steps title="展开：系统内置的六类指令（拿来即用，不用自己写代码）">
        <DataTable
          head={["类别", "指令"]}
          rows={[
            ["通用", "变量赋值、条件判断、发布静态 TF、TF 坐标变换"],
            ["通信", "创建发布者、创建订阅者、创建服务端、发布话题、客户端请求、服务端响应"],
            ["语音", "设置唤醒词、提取任务信息、文字转语音"],
            ["导航", "初始化航点、导航点、加载走路模型"],
            ["视觉", "目标检测、颜色检测、深度图转点云、二维点转三维点、抓取姿态估计"],
            ["机械臂", "初始化规划组、机械臂移动、张开夹爪、闭合夹爪"],
          ]}
        />
      </Steps>
    </div>
  </Frame>
);

const DecisionBlock = () => (
  <Frame
    kicker="通信设计"
    floor="06"
    title="先画通信图再上机，比直接进系统搭更省时间"
    lead="同一道题两种起手式：先把「谁发布、谁订阅、谁请求、谁响应」画清楚，还是点开界面边搭边想。"
    wide
  >
    <div className="space-y-4">
      <Decision />
      <DataTable
        head={["维度", "方案 A：直接进系统搭", "方案 B：先画通信图再上机"]}
        rows={[
          ["起步速度", "立刻能拖指令，第一眼见效快", "先花 20–30 分钟把图画完"],
          ["排错难度", "出错时不知道错在哪，越调越乱", "结构在图上一目了然，错在哪个环节看得见"],
          ["返工风险", "接口对不齐，常整块推倒重来", "接口先定好，搭节点照图抄"],
          ["多人协作", "各自理解不同，联调时互相甩锅", "一张图对齐所有人，沟通成本低"],
        ]}
      />
      <Grid cols={2}>
        <Figure
          src={f04}
          alt="参考图放大讲解（含红圈标注）"
          caption="▲ 图4｜参考图放大讲解（含红圈标注）——讲「先画图、再动手」的方法论（会议5 回看 1:30:40）"
        />
        <div className="flex flex-col justify-center">
          <Quote>
            辩证一问：「什么情况下直接试反而更快？」——当你已经熟记这套骨架、只是验证某个内置指令的行为时，直接点一遍更直接；
            但一旦要多人协作或结构变复杂，先把图画出来。
          </Quote>
        </div>
      </Grid>
    </div>
  </Frame>
);

const MainNode = () => (
  <Frame
    kicker="四节点实现"
    floor="07"
    title="主节点 7 个函数：一个 init、一个状态机、四张视觉回执"
    lead="init 建好 3 个发布者 ＋ 1 个订阅者并把状态置 1；唤醒词回调启动第一脚；状态机 8 分支推进全流程。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["函数", "用途"]}
        rows={[
          ["init", "设置唤醒词 ＋ 创建 nav / grab / deploy 发布者 ＋ 订阅 finish ＋ 变量赋值 work_states = 1"],
          ["set_wake_up_keywords_callback", "提取任务信息进 task_dictionary；发布静态 TF；发布第一条 nav（target1-1）"],
          ["nav_arm_finish_callback", "状态机主分支，8 个条件分支"],
          ["vision_detect_response_callback1", "改 work_states = 3；发 grab（一只手 ＋ 苹果点云）"],
          ["vision_detect_response_callback2", "改 work_states = 6；发 grab（另一只手 ＋ 大象点云）"],
          ["vision_detect_response_callback3", "改 work_states = 9；发 deploy（手 1 ＋ 盒 1 位姿）"],
          ["vision_detect_response_callback4", "改 work_states = 11；发 deploy（手 2 ＋ 盒 2 位姿）"],
        ]}
      />
      <Figure
        src={f05}
        alt="全函数设计图（函数清单清晰版）"
        caption="▲ 图5｜全函数设计图（函数清单清晰版）——每个节点的函数与回调关系（会议5 回看 1:33:00）"
      />
      <Steps title="展开：init 的建法（依次拖入指令）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>设置唤醒词：填「你好小新」，回调选 <code>set_wake_up_keywords_callback</code>。</li>
          <li>创建发布者 ×3：nav（字符串 <code>navigation_address</code>）、grab（<code>hand</code> ＋ <code>target_point_cloud</code>）、deploy（<code>hand</code> ＋ <code>deploy_pose</code>）。</li>
          <li>创建订阅者 ×1：订阅 finish（布尔），回调选 <code>nav_arm_finish_callback</code>。</li>
          <li>变量赋值：<code>work_states = 1</code>（把状态机置到初始值）。</li>
        </ol>
        <p className="text-muted">接口格式要和话题约定逐一对齐，这就是「有编程思想」的体现。</p>
      </Steps>
    </div>
  </Frame>
);

const StateMachine = () => (
  <Frame
    kicker="四节点实现"
    floor="08"
    title="状态机 8 分支：触发值 1 / 3 / 4 / 6 / 7 / 9 / 11 / 12"
    lead="条件判断全部读 work_states，8 个分支从左往右依次摆好；动作口诀是「先改状态、再干活」。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["分支", "触发（work_states ==）", "动作（先改状态值，再干活）"]}
        rows={[
          ["1", "1（到达 1 号桌）", "改 2 → 客户端请求 locate（物体, target1-2）→ 回调 callback1"],
          ["2", "3（抓取 1 完成）", "改 4 → 发布 nav（target2-1 = 2号桌）"],
          ["3", "4（到达 2 号桌）", "改 5 → 客户端请求 locate（物体, target2-2）→ 回调 callback2"],
          ["4", "6（抓取 2 完成）", "改 7 → 发布 nav（target3-1 = 3号桌）"],
          ["5", "7（到达 3 号桌）", "改 8 → 客户端请求 locate（颜色, target3-2）→ 回调 callback3"],
          ["6", "9（放置 1 完成）", "改 10 → 客户端请求 locate（颜色, target3-3）→ 回调 callback4"],
          ["7", "11（放置 2 完成）", "改 12 → 发布 nav（target4 = 起点）"],
          ["8", "12（到达起点）", "文字转语音「我已完成任务」→ work_states = 0（清零）"],
        ]}
      />
      <Figure
        src={f10}
        alt="状态机全画布：条件判断＋8 个分支的放射结构"
        caption="▲ 图10｜状态机全画布：条件判断 ＋ 8 个分支的放射结构（会议5 回看 1:46:50）"
      />
    </div>
  </Frame>
);

const TwoRules = () => (
  <Frame
    kicker="四节点实现"
    floor="09"
    title="两条纪律：进分支先改值，摆好后别拖"
    lead="这是整个实验最容易被扣分的两个点，务必当成硬规则。"
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="进分支先改状态值" icon={ShieldCheck} tone="good">
          finish 可能因多次完成信号重复触发；不先改值，同一环节会执行两遍（重复导航 / 重复请求）。
        </Card>
        <Card title="分支顺序＝画布左右顺序" icon={GitBranch} tone="warn">
          「分支几」按节点左右位置编号；拖拽改位会让分支号与内容错位。
        </Card>
      </Grid>
      <Grid cols={2}>
        <Figure
          src={f11}
          alt="条件判断分支配置弹窗：分支列表与条件"
          caption="▲ 图11｜条件判断分支配置弹窗：分支列表与条件（work_states == 1 等）（会议5 回看 1:47:40）"
        />
        <Figure
          src={f12}
          alt="分支内部指令链：先改变量再客户端请求"
          caption="▲ 图12｜分支内部指令链：先改变量 → 再客户端请求（会议5 回看 1:48:20）"
        />
      </Grid>
    </div>
  </Frame>
);

const Callbacks = () => (
  <Frame
    kicker="四节点实现"
    floor="10"
    title="四个视觉回执：统一套路是「改一个值 ＋ 发一个话题」"
    lead="locate 响应回来后，主节点把状态改到下一个奇数位，同时把 grab / deploy 指令发出去。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["回调", "改值", "发话题"]}
        rows={[
          ["vision_detect_response_callback1", "work_states = 3", "grab（一只手 ＋ 苹果点云）"],
          ["vision_detect_response_callback2", "work_states = 6", "grab（另一只手 ＋ 大象点云）"],
          ["vision_detect_response_callback3", "work_states = 9", "deploy（手 1 ＋ 盒 1 位姿）"],
          ["vision_detect_response_callback4", "work_states = 11", "deploy（手 2 ＋ 盒 2 位姿）"],
        ]}
      />
      <Quote>
        两次抓取必须一左一右；两次放置与持物手对应——先开的夹爪先放。回调编号要和分支一一对上（回调 1↔物体 1、回调 2↔物体 2、回调 3↔盒 1、回调 4↔盒 2）。
      </Quote>
      <Figure
        src={f13}
        alt="客户端请求 locate 的参数弹窗"
        caption="▲ 图13｜客户端请求 locate 的参数弹窗：detect_type / detect_name ＋ 回调选择（会议5 回看 1:50:00）"
      />
    </div>
  </Frame>
);

const StaticTf = () => (
  <Frame
    kicker="四节点实现"
    floor="11"
    title="静态 TF 是命门：不发布或填错，后面坐标全错"
    lead="相机坐标系（camera_link）默认不在 TF 树里；先发布静态 TF（Static Transform，静态坐标变换），后面才能按相机坐标系做变换。"
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="为什么必须发布" icon={Layers}>
          相机坐标系默认没进 TF 树——别的指令选不到相机坐标系，也就没法做点云与位姿的变换。
        </Card>
        <Card title="要填什么" icon={Compass}>
          机器人头部相机相对基座（base_link → camera_link）的位置与角度。
        </Card>
      </Grid>
      <Card title="从哪抄、怎么错" icon={AlertTriangle} tone="bad">
        数值抄外部配置里的手眼标定文件（R1 与 G1 各一份，两机数值不同）；填错 → 相机坐标系就是歪的 → 后面所有 TF 变换全出错（点云位置、抓取位姿、放置位姿全部偏）。
      </Card>
      <Quote>在唤醒词回调里发布一次静态 TF，是整条视觉链路的前置条件。</Quote>
    </div>
  </Frame>
);

const NavNode = () => (
  <Frame
    kicker="四节点实现"
    floor="12"
    title="导航节点：给耗时动作加一把锁"
    lead="导航是耗时动作；进行中再来新目的地会让行为错乱，所以用 navigation_states 做防冲突开关。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["函数（3 个）", "做什么"]}
        rows={[
          ["init", "初始化航点（漏掉按名字导航会找不到目标）＋ 创建发布者 finish ＋ 订阅 nav（回调 set_nav_goal_callback）"],
          ["set_nav_goal_callback", "存目的地名 → 判断锁（navigation_states == false 才继续）→ 上锁 → 导航到航点（结束回调 nav_finish_callback）"],
          ["nav_finish_callback", "解锁（navigation_states = false）→ 发布 finish"],
        ]}
      />
      <Quote>
        为什么要锁：「导航正在进行时又来一个新目的地，机器人行为会错乱。」这是参考实现里少见的防御性设计，比赛复杂度上来后这类设计只会更重要。
      </Quote>
    </div>
  </Frame>
);

const VisionNode = () => (
  <Frame
    kicker="四节点实现"
    floor="13"
    title="视觉节点：一个服务覆盖「物体」与「颜色」两类需求"
    lead="locate 服务按 detect_type 分两路：物体返回点云，颜色返回收纳盒正上方位姿；两个相机回调只管实时刷新图像。"
    wide
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="分支一 · 物体" icon={Package}>
          目标检测（系统内置 YOLO）→ 结果矩形框存 vision_box → 深度图转点云（框附加到深度图）→ 存 vision_point_cloud → 服务端响应点云。
        </Card>
        <Card title="分支二 · 颜色" icon={Eye}>
          颜色检测按 detect_name 取色块中心点 → 存 vision_point → 二维点转三维点 → TF 坐标变换（依赖静态 TF）→ 服务端响应 pose。
        </Card>
      </Grid>
      <Figure
        src={f17}
        alt="服务端响应内容：点云/位姿的返回字段"
        caption="▲ 图17｜服务端响应内容：点云 / 位姿的返回字段（会议5 回看 2:00:20）"
      />
      <Steps title="展开：视觉节点 init 与两个相机回调">
        <ol className="list-decimal space-y-2 pl-5">
          <li>订阅 <code>color_image_raw</code>，回调 <code>get_camera_rgb_callback</code>。</li>
          <li>订阅 <code>depth_image_raw</code>，回调 <code>get_camera_depth_callback</code>。</li>
          <li>创建服务端 locate（请求 detect_type ＋ detect_name；响应 pose ＋ point_cloud），回调 <code>locate_service_callback</code>。</li>
          <li>两个相机回调里只做一件事：变量赋值，把最新图像存进图像变量（每帧覆盖）。</li>
        </ol>
      </Steps>
    </div>
  </Frame>
);

const ArmNode = () => (
  <Frame
    kicker="四节点实现"
    floor="14"
    title="机械臂节点：抓取与放置镜像同构"
    lead="grab_callback 与 deploy_callback 结构一样，只是目标不同；闭爪 / 张爪必须与移动时用的手臂配套。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["函数（5 个）", "做什么"]}
        rows={[
          ["init", "初始化规划组（名字要与系统配置一致）＋ 发布者 finish ＋ 订阅 grab / deploy"],
          ["grab_callback", "按 is_right_hand 分左右手 → 抓取位置估计得位姿 → TF 坐标变换 → 机械臂移动（完成回调 grab_finish_callback）"],
          ["grab_finish_callback", "闭合夹爪（选与移动手臂配套的执行器）→ 发布 finish"],
          ["deploy_callback", "按 is_right_hand 分支 → 选规划组 → 机械臂移动到 deploy_pose（完成回调 deploy_finish_callback）"],
          ["deploy_finish_callback", "张开夹爪（物品落入收纳盒）→ 发布 finish"],
        ]}
      />
      <Figure
        src={f18}
        alt="抓取位置估计配置：点云 → 抓取位姿"
        caption="▲ 图18｜抓取位置估计配置：点云 → 抓取位姿（模型选择）（会议5 回看 2:02:00）"
      />
    </div>
  </Frame>
);

const Simulation = () => (
  <Frame
    kicker="调试与验证"
    floor="15"
    title="跑仿真：左下看机器人视角，右下看进度"
    lead="虚拟工程师先说话（「你好小新……」）触发唤醒词，机器人开始动；跑起来后盯住画面和进度。"
  >
    <div className="space-y-4">
      <Grid cols={3}>
        <Card title="触发" icon={Radio}>
          语音触发唤醒词 → 回调启动 → 发布第一条 nav，机器人开动。
        </Card>
        <Card title="左下角 · 机器人视角" icon={Eye}>
          默认俯视图，可切正面视图、正面跟踪视图——核对抓放动作的最佳视角。
        </Card>
        <Card title="右下角 · 仿真进度" icon={Timer}>
          显示仿真进度，可暂停；暂停后再进 Debug。
        </Card>
      </Grid>
      <Figure
        src={f20}
        alt="仿真运行：房间场景＋机器人实时视角＋进度"
        caption="▲ 图20｜仿真运行：房间场景 ＋ 机器人实时视角（左下）＋ 进度（右下）（会议5 回看 2:03:10）"
      />
    </div>
  </Frame>
);

const Debug = () => (
  <Frame
    kicker="调试与验证"
    floor="16"
    title="卡住就看 Debug 三件套"
    lead="暂停仿真后逐个点：执行记录、变量当前值、在场景中显示——这是排卡点的主力工具。"
  >
    <div className="space-y-4">
      <Grid cols={3}>
        <Card title="执行记录" icon={ListChecks}>
          显示哪个节点的哪个函数被执行、函数里哪些指令被执行了；卡住时看「最后一个成功执行的函数」。
        </Card>
        <Card title="变量当前值" icon={Gauge}>
          看任意变量的实时值（如 grasp_pose 抓取位姿的数值），判断数据对不对。
        </Card>
        <Card title="在场景中显示" icon={Eye}>
          把变量代表的位置 / 点云画进 3D 场景，直接肉眼核对位姿。
        </Card>
      </Grid>
      <Figure
        src={f22}
        alt="暂停＋Debug：过程 Debug 面板"
        caption="▲ 图22｜暂停 ＋ Debug：过程 Debug 面板（函数 / 指令执行记录与变量）（会议5 回看 2:04:00）"
      />
    </div>
  </Frame>
);

const Migrate = () => (
  <Frame
    kicker="调试与验证"
    floor="17"
    title="R1 调通再整体复制到 G1，只差一个走路模型"
    lead="别两台一起调：先把 R1 全部调完并跑通仿真，再用「复制内容」把函数与指令整体复制到 G1 对应节点。"
  >
    <Grid cols={2}>
      <Card title="复制内容，不用重建" icon={FolderTree} tone="good">
        用「复制内容」把 R1 的函数与指令整体复制到 G1 对应节点，无需逐个重搭。
      </Card>
      <Card title="G1 唯一差异：加载走路模型" icon={Bot} tone="warn">
        G1 双足由强化学习（Reinforcement Learning，RL）控制走路，要额外加载走路模型；R1 轮式底盘直接用「导航到航点」运动。
      </Card>
    </Grid>
    <div className="mt-5">
      <Quote>两机各自完整跑一遍：先虚拟工程师指挥 R1，再指挥 G1——互相独立、无通信。</Quote>
    </div>
  </Frame>
);

const Competition = () => (
  <Frame
    kicker="比赛衔接"
    floor="18"
    title="赛前只练本任务；正式比赛是「跳舞」联动"
    lead="培训后只需针对「功能模块改造」训练，不用管 ROS 2 基本通信实验；正式比赛任务会更复杂。"
  >
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="赛前只练本任务" icon={Target} tone="good">
          大多数指令你在这个实验里都会见到；比赛会新增指令、现有指令也可能修改，核心思想不变——理解每个指令的作用，尝试搭建流程。
        </Card>
        <Card title="比赛任务＝三机跳舞联动" icon={Trophy}>
          三台机器人互相通信、联动（不是各干各的）；且强化学习、视觉感知、建图导航、机械臂抓取全部从零做起（本实验里这些是现成的）。
        </Card>
      </Grid>
      <Steps title="展开：电脑配置要求">
        <Pre>{`系统    Win10 / 11 + 最新 Chrome / Edge
CPU     i7 / 2.5GHz 及以上
内存    32G（16G 能跑但卡）
显卡    NVIDIA GTX 1050Ti 及以上，显存 4G+`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Teamwork = () => (
  <Frame
    kicker="比赛衔接"
    floor="19"
    title="三人分工：一人专管通信，联调前各自模块必须正常"
    lead="每组 3 人；拿到题先画通信流程图再上机，另两人分头攻其余模块。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["角色", "负责", "关键纪律"]}
        rows={[
          ["通信负责人", "ROS 通信与流程联调", "自带草稿纸，拿到题先画通信流程图再上机"],
          ["模块负责人 A", "强化学习训练 / 视觉感知（含数据标注）", "联调前保证自己模块正常"],
          ["模块负责人 B", "建图导航 / 机械臂抓取", "联调前保证自己模块正常"],
        ]}
      />
      <Card title="采分策略：过程分 ＋ 结果分" icon={Scale} tone="warn">
        过程分隐含在所有决策里，结果分看仿真效果。卡壳别死磕——某个环节过不去就调整 ROS 流程走后续环节去拿分，不要卡在一处导致大量丢分。
      </Card>
    </div>
  </Frame>
);

const ActionList = () => (
  <Frame
    kicker="收尾"
    floor="20"
    title="先画图，再照单搭节点"
    wide
  >
    <div className="space-y-4">
      <Quote>本课一句话：先画通信图，再进系统搭；进分支先改状态值，分支摆好别拖。</Quote>
      <Grid cols={3}>
        <Card title="画图" icon={Workflow}>
          画清「谁发布、谁订阅、谁请求、谁响应」，接口字段与话题约定逐一对齐。
        </Card>
        <Card title="搭节点" icon={Puzzle}>
          主节点 7 函数 → 导航 3 → 视觉 4 → 机械臂 5；静态 TF 先发，分支摆好别拖。
        </Card>
        <Card title="验证" icon={Bug} tone="good">
          暂停看 Debug 三件套；R1 调通再整体复制到 G1；卡壳就走后续环节拿分。
        </Card>
      </Grid>
      <Steps title="展开：函数打勾表（19 个，建函数对照用）">
        <DataTable
          head={["节点", "函数", "用途"]}
          rows={[
            ["主节点", "init", "唤醒词 ＋ 3 发布者 ＋ 1 订阅者 ＋ 状态置 1"],
            ["主节点", "set_wake_up_keywords_callback", "提取任务信息 → 字典；发布静态 TF；发第一条 nav"],
            ["主节点", "nav_arm_finish_callback", "状态机 8 分支"],
            ["主节点", "vision_detect_response_callback1", "改 3 ＋ grab 点云 1"],
            ["主节点", "vision_detect_response_callback2", "改 6 ＋ grab 点云 2"],
            ["主节点", "vision_detect_response_callback3", "改 9 ＋ deploy 盒 1"],
            ["主节点", "vision_detect_response_callback4", "改 11 ＋ deploy 盒 2"],
            ["导航节点", "init", "初始化航点 ＋ 发布者 ＋ 订阅者"],
            ["导航节点", "set_nav_goal_callback", "收目的地 → 判断锁 → 导航"],
            ["导航节点", "nav_finish_callback", "解锁 ＋ 发 finish"],
            ["视觉节点", "init", "双相机订阅 ＋ locate 服务端"],
            ["视觉节点", "get_camera_rgb_callback", "色彩图变量刷新"],
            ["视觉节点", "get_camera_depth_callback", "深度图变量刷新"],
            ["视觉节点", "locate_service_callback", "物体 / 颜色两分支检测"],
            ["机械臂节点", "init", "规划组 ＋ 发布者 ＋ 双订阅者"],
            ["机械臂节点", "grab_callback", "左右手分支 ＋ 位姿估计 ＋ TF ＋ 移动"],
            ["机械臂节点", "grab_finish_callback", "闭爪 ＋ finish"],
            ["机械臂节点", "deploy_callback", "左右手分支 ＋ 移动到位姿"],
            ["机械臂节点", "deploy_finish_callback", "张爪 ＋ finish"],
          ]}
        />
        <p className="text-muted">共 19 个函数（主 7 / 导航 3 / 视觉 4 / 机械臂 5），R1 调完整体复制到 G1。</p>
      </Steps>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame
    kicker="收尾"
    floor="21"
    title="指南 PDF 与 Markdown 随 deck 下载"
    wide
  >
    <Grid cols={2}>
      <Card title="随 deck 分发的材料" icon={Download}>
        <p>
          <a className="font-semibold text-brand-700 underline" href="./files/功能模块改造与集成-参考答案与实操指南.pdf">
            files/功能模块改造与集成-参考答案与实操指南.pdf
          </a>
        </p>
        <p className="mt-2">
          <a className="font-semibold text-brand-700 underline" href="./files/功能模块改造与集成-参考答案与实操指南.md">
            files/功能模块改造与集成-参考答案与实操指南.md
          </a>
        </p>
        <p className="mt-2 text-muted">PDF 便于打印 / 对照录屏；Markdown 便于检索与二次编辑。</p>
      </Card>
      <Card title="材料里有什么" icon={FileText}>
        十章 ＋ 附录：任务全景、通信设计、四节点实操、迁移 G1、仿真调试、比赛衔接、易错点清单、19 函数打勾表；每条知识点带录屏回看时间戳。
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        相邻主题：<code>ROS 2 与 micro-ROS 选型</code>（通信中间件）、<code>ESP32 与 ROS 2 开发基础</code>（课程包）、
        <code>智能救援车辆设计</code> / <code>智能搬运车辆设计</code>（整车集成）。
      </Card>
      <Card title="下一课怎么走" icon={Rocket}>
        把本册骨架套到比赛任务：三机联动＝在本实验的四节点上再加跨机话题与调度，其余模块从零自研。
      </Card>
    </Grid>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Overview /> },
  { nav: "任务全景", group: "任务与拆解", el: <Mission /> },
  { nav: "拆解八数据", group: "任务与拆解", el: <Breakdown /> },
  { nav: "四节点分工", group: "通信设计", el: <Nodes /> },
  { nav: "通信资产", group: "通信设计", el: <Assets /> },
  { nav: "对比决策", group: "通信设计", el: <DecisionBlock /> },
  { nav: "主节点", group: "四节点实现", el: <MainNode /> },
  { nav: "状态机", group: "四节点实现", el: <StateMachine /> },
  { nav: "两条纪律", group: "四节点实现", el: <TwoRules /> },
  { nav: "视觉回调", group: "四节点实现", el: <Callbacks /> },
  { nav: "静态 TF", group: "四节点实现", el: <StaticTf /> },
  { nav: "导航锁", group: "四节点实现", el: <NavNode /> },
  { nav: "视觉服务", group: "四节点实现", el: <VisionNode /> },
  { nav: "机械臂节点", group: "四节点实现", el: <ArmNode /> },
  { nav: "仿真运行", group: "调试与验证", el: <Simulation /> },
  { nav: "Debug 三件套", group: "调试与验证", el: <Debug /> },
  { nav: "迁移 G1", group: "调试与验证", el: <Migrate /> },
  { nav: "训练范围", group: "比赛衔接", el: <Competition /> },
  { nav: "分工与采分", group: "比赛衔接", el: <Teamwork /> },
  { nav: "行动清单", group: "收尾", el: <ActionList /> },
  { nav: "下载材料", group: "收尾", el: <Downloads /> },
];

export default slides;
