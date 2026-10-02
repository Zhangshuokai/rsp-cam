import React from "react";
import {
  Rocket,
  Target,
  Layers,
  Cpu,
  Eye,
  GitBranch,
  Wrench,
  ClipboardCheck,
  AlertTriangle,
  Ban,
  Boxes,
  BookOpen,
  Package,
  Crosshair,
  TrendingUp,
  Percent,
  Radio,
  Scale,
  ScanLine,
  Repeat,
  Gauge,
  Workflow,
  ShieldCheck,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre, Stat, Figure } from "./components.jsx";

import montageImg from "./assets/montage.png";
import frameSceneImg from "./assets/frame-scene.png";
import frameCarryImg from "./assets/frame-carry.png";
import framePlaceImg from "./assets/frame-place.png";

/* ------------------------------------------------------------ Cover */
const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      <div>
        <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
          培训讲义 · 2026-09-29 · v1.0
        </span>
        <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
          机器人入门复现路线
          <br />
          <span className="text-brand-600">从「抓方块」到 VLA 的阶梯</span>
        </h1>
        <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
          只选一个入门项目选哪个？这条路线先用 Robotics Toolbox 做 FK/IK 与末端轨迹，再用 Swift 可视化，
          之后迁移 MuJoCo / ROS 2，最终接模仿学习与 VLA——本 deck 的 L1 / L2 已在整理者本机跑通。
        </p>
      </div>
      <Figure
        src={montageImg}
        alt="Swift 实测：抓取方块 → 搬运 → 落位四帧拼图"
        caption="实测证据：Swift 里跑通的「抓取方块 → 搬运 → 放到目标垫」四帧拼图"
      />
    </div>
  </div>
);

/* ------------------------------------------------------- TL;DR */
const Tldr = () => (
  <Frame kicker="概览" floor="01" title="结论先行：值得，A-，是最优的单一入门路线" lead="不靠读文档对比——L1 与 L2 已在本机全流程跑通，坑也踩完了。">
    <Grid cols={4}>
      <Stat value="A-" label="总评：可推荐给学生，照做即可复现" />
      <Stat value="2" unit="条 pip 命令" label="零硬件起步：roboticstoolbox-python + swift-sim" />
      <Stat value="50/50" unit="轨迹点" label="逐点 IK 成功率，平均末端误差 0.236 mm" />
      <Stat value="1e-8" label="Panda 模型 IK 收敛残差（16 次迭代）" />
    </Grid>
    <div className="mt-4 grid gap-3 md:mt-5 md:grid-cols-2 md:gap-4">
      <Card title="为什么值得" icon={TrendingUp} tone="good">
        台阶连续：IK → 轨迹 → 可视化 → 物理 → 真机 / VLA，每步都踩在前一步上；每 1–2 天就有一个「能给别人看」的产出（数字 → 图 → 动画 → 物理 → AI）；终点可接 SmolVLA（4090 单卡可微调），不是玩具路线。
      </Card>
      <Card title="核心减分项（也是教学分界线）" icon={AlertTriangle} tone="warn">
        Swift 没有物理引擎——「抓取」是位姿贴合而非真实接触。这不是缺陷：它恰好把学生<strong>逼</strong>进 MuJoCo，迁移动机天然成立。
      </Card>
    </div>
  </Frame>
);

/* --------------------------------------------------- 四层阶梯 */
const Ladder = () => (
  <Frame kicker="概览" floor="02" title="四层阶梯：每层都能独立交付" wide>
    <DataTable
      head={["层", "做什么", "工具", "本机实测"]}
      widths={["10%", "", "24%", "22%"]}
      rows={[
        ["L1", "FK / IK 与末端轨迹（纯计算）", "Robotics Toolbox（Python）", "全过：50/50 IK，0.236 mm"],
        ["L2", "可视化与动作演示", "Swift 2.0", "全过：40 循环抓取-放置动画"],
        ["L3", "真实物理接触与传感器", "MuJoCo（Menagerie 模型）", "路径就绪；本机受虚拟化限制"],
        ["L4", "模仿学习 / VLA 输出动作", "LeRobot + SmolVLA（约 450M）", "生态成熟，单卡 4090 可微调"],
      ]}
    />
    <div className="mt-4">
      <Quote>
        这条阶梯的独特卖点：概念（DH/POE、数值 IK、轨迹）→ 视觉（动画）→ 物理（接触）→ 智能（模仿 / VLA），层层递进且<strong>每层独立可交付</strong>。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- L1 */
const L1 = () => (
  <Frame kicker="实测" floor="03" title="L1 · Toolbox FK/IK：数字先跑通" wide>
    <Grid cols={2}>
      <div className="space-y-3 md:space-y-4">
        <DataTable
          head={["包", "版本"]}
          widths={["62%"]}
          rows={[
            ["roboticstoolbox-python", "1.4.4"],
            ["swift-sim", "2.0.1"],
            ["spatialmath-python", "1.1.18"],
            ["numpy", "2.5.3"],
          ]}
        />
        <Card title="实测结果" icon={Crosshair} tone="brand">
          Panda 模型 FK/IK + 末端圆轨迹：IK 收敛 <strong>16 次迭代</strong>、关节残差 <strong>1e-8</strong>；50 点笛卡尔圆轨迹逐点 IK <strong>50/50 成功</strong>，平均末端误差 <strong>0.236 mm</strong>。
        </Card>
      </div>
      <Steps title="展开：L1 环境与运行命令（完整步骤）">
        <Pre>{`# 环境（python 3.12 venv + 清华源）
uv venv rtb-venv --python 3.12
uv pip install --python rtb-venv/bin/python \\
    roboticstoolbox-python swift-sim spatialmath-python \\
    -i https://pypi.tuna.tsinghua.edu.cn/simple

# L1：FK/IK + 轨迹（纯计算，秒出结果）
rtb-venv/bin/python smoke/rtb_smoke.py`}</Pre>
      </Steps>
    </Grid>
  </Frame>
);

/* ------------------------------------------------------- L2 */
const L2 = () => (
  <Frame kicker="实测" floor="04" title="L2 · Swift 可视化：完整抓取-放置动画" wide>
    <div className="space-y-3 md:space-y-4">
      <Grid cols={3}>
        <Card title="服务结构" icon={Radio} tone="slate">
          HTTP <strong>52000</strong> / WebSocket <strong>53000</strong>；浏览器端 3D 渲染正常，时钟随仿真推进。
        </Card>
        <Card title="6 个关键位姿" icon={Repeat} tone="good">
          方块上方悬停 → 抓取位 → 抬起 → 目标垫上方 → 落位 → 撤离，<strong>IK 全部 success</strong>；40 个循环持续演示。
        </Card>
        <Card title="录制证据" icon={Eye} tone="brand">
          70 帧 CDP 连拍 → 合成 <strong>7 秒动画</strong>（1280×606）；四帧拼图与关键帧见下。
        </Card>
      </Grid>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Figure src={frameSceneImg} alt="场景连通证据帧" caption="场景连通" />
        <Figure src={frameCarryImg} alt="持块运输帧" caption="持块运输" />
        <Figure src={framePlaceImg} alt="落位目标垫帧" caption="落位目标垫" />
        <Figure src={montageImg} alt="四帧拼图" caption="四帧拼图" />
      </div>
      <Quote>节奏说明：步进随浏览器帧同步浮动（约 0.03–0.3 s/步），做长演示时按需调参即可。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- L3 */
const L3 = () => (
  <Frame kicker="实测" floor="05" title="L3 · MuJoCo：路径就绪，本机栽在虚拟化" wide>
    <Grid cols={2}>
      <Card title="现象" icon={AlertTriangle} tone="bad">
        MuJoCo <strong>3.14.0 / 3.2.6 / 3.0.1</strong> 三个版本在本机均 <strong>SIGILL</strong>（非法指令，核心转储）。
      </Card>
      <Card title="根因（已查明）" icon={Cpu} tone="warn">
        本机是 <strong>QEMU 虚拟机</strong>，CPU 为 <code>QEMU Virtual CPU version 2.5+</code>，未透传 AVX / AVX2 / FMA / BMI2 / AVX-512（<code>/proc/cpuinfo</code> 全为 NO）；新版 MuJoCo 官方 wheel 按 x86-64-v3 基线构建，无 AVX2 直接崩。
      </Card>
    </Grid>
    <div className="mt-4 space-y-3 md:space-y-4">
      <Card title="结论：不是路线问题，是环境限制" icon={ShieldCheck} tone="good">
        物理机（2013 年后主流 CPU 均带 AVX2）正常；低配虚机需 CPU 直通 / 换基线构建 / 指定旧版 wheel。生态核实：MuJoCo Menagerie 含 Panda 与与 SmolVLA 对齐的 SO-101 场景。
      </Card>
      <Card title="迁移要点（教学方法论）" icon={Workflow} tone="slate">
        Toolbox 学的 IK / 轨迹概念原样保留；MuJoCo 增加的是<strong>物理接触</strong>（抓取要保持、接触力、摩擦）与传感器仿真；接口就是 <code>mj_step</code>，模型可直接取 Menagerie 的 panda XML。
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- L4 */
const L4 = () => (
  <Frame kicker="实测" floor="06" title="L4 · VLA：生态比预想成熟，单卡可行" wide>
    <Grid cols={2}>
      <div className="space-y-3 md:space-y-4">
        <Card title="目标形态：动作块（action chunk）" icon={Target} tone="brand">
          VLA 的输出通常是<strong>末端位姿增量 / 关节目标序列</strong>，正好接在阶梯上一级的控制器上——「让 VLA 输出目标位姿或动作」的定位成立。
        </Card>
        <Card title="建议顺序" icon={Layers} tone="good">
          先小规模模仿学习（ACT / Diffusion Policy）建立「数据 → 训练 → 闭环」直觉，再上 SmolVLA；仿真侧可用 LIBERO / robosuite 做 benchmark。
        </Card>
      </div>
      <div className="space-y-3 md:space-y-4">
        <DataTable
          head={["组件", "结论"]}
          widths={["42%"]}
          rows={[
            ["LeRobot + SmolVLA（约 450M）", "官方教程确认单卡 4090 可微调"],
            ["SO-101 机型", "Menagerie 有对齐模型，仿真可复现"],
            ["LIBERO / robosuite", "benchmark 与数据管线现成"],
            ["Robotics Toolbox / Swift / RVC3", "仓库持续维护，学习路线锚点稳定"],
          ]}
        />
      </div>
    </Grid>
  </Frame>
);

/* --------------------------------------------------- 横向对比 */
const Compare = () => (
  <Frame kicker="评估" floor="07" title="为什么优于其它入门选择" wide>
    <DataTable
      head={["备选路线", "相对劣势"]}
      widths={["30%"]}
      rows={[
        ["pybullet 起步", "更偏「调物理参数」，工具链直觉弱于 Toolbox 的教科书体系。"],
        ["panda-gym / robosuite / LIBERO", "面向 RL / benchmark，入门者要先补 RL 概念，门槛前置。"],
        ["直接上 MoveIt2 / ROS 2", "环境重、概念多（中间件 / 坐标系 / 控制器），最容易劝退。"],
        ["直接买真机机械臂", "成本 + 硬件故障噪声淹没概念学习。"],
      ]}
    />
    <div className="mt-4">
      <Quote>
        本路线用「教科书体系 + 每层可见产出」换掉「一上来就补 RL / ROS 概念」的门槛；L1 / L2 的坑本报告已排完，学生照做即可复现。
      </Quote>
    </div>
  </Frame>
);

/* --------------------------------------------------- 里程碑预算 */
const Milestones = () => (
  <Frame kicker="评估" floor="08" title="里程碑与时间预算（学生口径）" wide>
    <DataTable
      head={["里程碑", "内容", "预算"]}
      widths={["12%", "", "18%"]}
      rows={[
        ["M0", "环境（venv + 两个包）", "约 1 小时"],
        ["M1", "FK / IK（跟 RVC3 章节）", "1–2 天"],
        ["M2", "末端轨迹 + Swift 动画（本 deck 已示范至此）", "1 天"],
        ["M3", "MuJoCo 真实抓取（接触保持）", "1–2 周"],
        ["M4", "ROS 2 / MoveIt2", "1–2 周"],
        ["M5", "模仿学习 / VLA（4090 单卡）", "2–4 周"],
      ]}
    />
    <div className="mt-4">
      <Card title="排期建议" icon={Gauge} tone="brand">
        到 M2 约一周即可有一次完整演示（数字 → 动画）；M3 起进入「物理 + 真机」阶段，按实验室机位排期。
      </Card>
    </div>
  </Frame>
);

/* --------------------------------------------------- 坑清单 */
const Pitfalls = () => (
  <Frame kicker="落地" floor="09" title="坑清单：Swift 2.0 四个坑（讲义可直接抄）" wide>
    <Grid cols={2}>
      <Card title="① headless 的语义" icon={Ban} tone="bad">
        <code>headless=True</code> 完全不启动前端（纯仿真）；想可视化必须不带 headless。第一次踩会以为「服务起来了但页面空白」。
      </Card>
      <Card title="② 约 10 秒「握手窗口」" icon={AlertTriangle} tone="warn">
        <code>launch()</code> 后浏览器必须在约 10 秒内连上，否则迟到的握手消息会串进 <code>step()</code> 的事件处理，主线程以 <code>KeyError: 'event'</code> 崩溃（服务器线程变僵尸：端口还在、连接全断）。
      </Card>
      <Card title="③ 单客户端纪律" icon={Radio} tone="warn">
        同一场景同一时间只允许<strong>一个</strong>浏览器标签页连接；第二个客户端（含残留旧标签）的握手会把场景搞崩——重启场景前先关旧标签。
      </Card>
      <Card title="④ 无头截图正确姿势" icon={Eye} tone="slate">
        一次性 <code>chrome --screenshot</code>（虚拟时间）会拍空（显示 Disconnected / 空白）；要用 <strong>CDP 常驻浏览器</strong>方案。另：升级 swift-sim 后前端有 <code>js_version</code> 校验，需硬刷新页面。
      </Card>
    </Grid>
  </Frame>
);

/* --------------------------------------------------- 复现指引 */
const Replay = () => (
  <Frame kicker="落地" floor="10" title="复现快捷指引（本机实测命令）" wide>
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
      <Steps title="展开：从环境到动画的完整命令（顺序不可换）">
        <Pre>{`# 1) 环境
uv venv rtb-venv --python 3.12
uv pip install --python rtb-venv/bin/python \\
    roboticstoolbox-python swift-sim spatialmath-python \\
    -i https://pypi.tuna.tsinghua.edu.cn/simple

# 2) L1：FK/IK + 轨迹（纯计算，秒出结果）
rtb-venv/bin/python smoke/rtb_smoke.py

# 3) L2：一键起场景（demo 先起，1 秒后 chrome 接入）
bash smoke/run_scene4.sh        # 内含 40 循环抓取-放置动画
rtb-venv/bin/python smoke/shot_cdp.py out.png 2 9225      # 单帧
rtb-venv/bin/python smoke/capture_frames.py 70 0.75       # 连拍
ffmpeg -y -framerate 10 -i swift_frames/f_%03d.png -vf "scale=1280:-2" \\
    -c:v libx264 -crf 27 -pix_fmt yuv420p anim.mp4        # 合成动画`}</Pre>
      </Steps>
      <div className="space-y-3 md:space-y-4">
        <Card title="脚本目录" icon={Boxes} tone="brand">
          整理者本机：<code>~/projects/robot-entry-recon/smoke/</code>（<code>rtb_smoke.py</code> / <code>swift_demo4.py</code> / <code>run_scene4.sh</code> / <code>shot_cdp.py</code> / <code>capture_frames.py</code>）。<strong>脚本未随包分发</strong>，照抄前按自己环境改路径。
        </Card>
        <Card title="环境要点" icon={Wrench} tone="slate">
          本机 <code>uv</code> 在 <code>~/.hermes/bin/uv</code>；pip 走清华源；<code>python 3.12</code>。
        </Card>
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------- Closing */
const Closing = () => (
  <Frame kicker="收尾" floor="11" title="下载与延伸阅读">
    <div className="space-y-5">
      <Quote>
        本 deck 由本仓库「<code>培训/机器人入门-复现路线评估/</code>（2026-09-29）」整理而成；L1 / L2 为整理者本机实测，L3 的 MuJoCo 结论受其虚机环境限制（非路线问题）。
      </Quote>
      <Grid cols={2}>
        <Card title="评估报告 + 证据（zip）" icon={BookOpen} tone="brand">
          完整评估报告（Markdown）与证据图 / 动画：L1–L4 实测记录、横向对比、里程碑预算、坑清单、复现命令。
          <br />
          <a
            href="./files/机器人入门路线评估-20260929.zip"
            className="break-all font-semibold text-brand-700 underline"
          >
            下载：机器人入门路线评估-20260929.zip
          </a>
        </Card>
        <Card title="评估报告（Markdown，可直接读）" icon={Package} tone="brand">
          报告正文，便于检索与复制；另有实测动画 <a href="./files/swift_grab_anim.mp4" className="font-semibold text-brand-700 underline">swift_grab_anim.mp4</a>（7 秒，1280×606）。
          <br />
          <a
            href="./files/机器人入门复现路线评估-20260929.md"
            className="break-all font-semibold text-brand-700 underline"
          >
            下载：机器人入门复现路线评估-20260929.md
          </a>
        </Card>
        <Card title="工具与教材锚点" icon={GitBranch} tone="slate">
          <a className="font-semibold text-brand-700 underline" href="https://github.com/petercorke/robotics-toolbox-python">Robotics Toolbox</a>｜
          <a className="font-semibold text-brand-700 underline" href="https://github.com/petercorke/robotics-toolbox-python">Swift</a>｜
          <a className="font-semibold text-brand-700 underline" href="https://github.com/petercorke/rvc3python">RVC3 教材代码</a>；
          <a className="font-semibold text-brand-700 underline" href="https://github.com/google-deepmind/mujoco_menagerie">MuJoCo Menagerie</a>；
          <a className="font-semibold text-brand-700 underline" href="https://github.com/huggingface/lerobot">LeRobot / SmolVLA</a>。
        </Card>
        <Card title="仓库内延伸" icon={ClipboardCheck} tone="good">
          训练与自测清单、坑清单同样落在 <code>培训/机器人入门-复现路线评估/机器人入门复现路线评估-20260929.md</code>；L3 之后可接本仓库的 ROS 2 选型与树莓派部署 deck。
        </Card>
      </Grid>
      <p className="text-[0.86rem] text-muted">
        路径：<code>教学webppt/机器人入门复现路线/</code>（成品单文件 + <code>files/</code> 附件，离线可播）
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Tldr /> },
  { nav: "四层阶梯", group: "概览", el: <Ladder /> },
  { nav: "L1 Toolbox", group: "实测", el: <L1 /> },
  { nav: "L2 Swift 动画", group: "实测", el: <L2 /> },
  { nav: "L3 MuJoCo", group: "实测", el: <L3 /> },
  { nav: "L4 VLA", group: "实测", el: <L4 /> },
  { nav: "横向对比", group: "评估", el: <Compare /> },
  { nav: "里程碑预算", group: "评估", el: <Milestones /> },
  { nav: "坑清单", group: "落地", el: <Pitfalls /> },
  { nav: "复现指引", group: "落地", el: <Replay /> },
  { nav: "下载与延伸阅读", group: "收尾", el: <Closing /> },
];
