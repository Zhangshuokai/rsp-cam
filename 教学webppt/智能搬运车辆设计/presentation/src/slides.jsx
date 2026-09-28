import React from "react";
import {
  Compass,
  Layers,
  Target,
  ShieldCheck,
  Cpu,
  Cog,
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
  Move,
  Hand,
  Repeat,
  Gauge,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre, Figure } from "./components.jsx";

import chassisImg from "./assets/chassis-290.jpg";
import gripperImg from "./assets/gripper-j60.jpg";
import turntableImg from "./assets/turntable.jpg";
import turntableSolveImg from "./assets/turntable-solve.jpg";
import flowImg from "./assets/flow.jpg";
import fieldLiveImg from "./assets/field-live.jpg";
import show2025Img from "./assets/show-2025.jpg";
import fieldGdImg from "./assets/field-gd.jpg";

/* ------------------------------------------------------------ Cover */
const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
      <div>
        <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
          培训讲义 · 2026-09-28 · v1.2
        </span>
        <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
          智能搬运车辆设计
          <br />
          <span className="text-brand-600">抓取 + 载运的整车方案</span>
        </h1>
        <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
          面向 2027 年第十届工创赛「智能+工程创新赛道 · 智能搬运」：在「无整机限重、出发 ≤300×300×400mm、必须抓取并载运、全自主」的规则下，
          把「读码 → 抓取 → 上盘 → 放环 → 码垛 → 回位」做成一台能稳定得分的小车。
        </p>
      </div>
      <Figure
        src={show2025Img}
        alt="2025 国赛初赛满环车实录"
        caption="公开对标：2025 国赛初赛 3 分钟满环车（动态跟踪抓取，全开源）"
      />
    </div>
  </div>
);

/* ------------------------------------------------------- TL;DR */
const Tldr = () => (
  <Frame kicker="概览" floor="01" title="结论先行：搬运是另一条赛道" lead="别把救援的结论套过来——两条赛道的硬约束正好相反。">
    <Grid cols={3}>
      <Card title="无重量限制，重在抓与载" icon={Compass} tone="brand">
        出发尺寸 ≤300×300×400mm（含软线，机械臂可折叠、展开不限）；必须抓取 + 载运，一次只抓一个。救援则 ≤1.5kg、禁抓取。
      </Card>
      <Card title="走被验证的事实标准" icon={Layers} tone="good">
        四轮麦轮 + 42 步进×4（同步带减速）+ 立柱横梁臂（滚珠丝杆 Z）+ 舵机平行爪 + 随车转盘 + 双摄。
      </Card>
      <Card title="三条战术" icon={Target} tone="warn">
        动态跟踪抓取（满环关键）｜简单可靠优先（复杂结构更难适应决赛）｜合规优先（爪曾因不合规决赛扣 50%）。
      </Card>
    </Grid>
    <div className="mt-7">
      <Quote>
        工程细节定生死：轨道平行度、防松结构、传感器兼容、线缆管理、赛场光线与物料色差——这是课程画出的「新手失败因果图」。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 赛项 */
const Event = () => (
  <Frame kicker="概览" floor="02" title="这是什么比赛" wide>
    <DataTable
      head={["项", "内容"]}
      widths={["16%", "84%"]}
      rows={[
        ["赛项", "中国大学生工程实践与创新能力大赛（工创赛）· 智能+工程创新赛道 · 智能搬运（原智能物流搬运）"],
        ["赛制", "三级：校级初赛 → 省级复赛 → 全国总决赛；省赛须在 2027-05-10 前收口"],
        ["节奏", "校赛 2026 年秋 → 省赛 2027 年春 → 国赛 2027 年 7–8 月"],
        ["构成", "初赛总成绩 P = 任务命题文档 A×20% + 作品创意设计 B×10% + 现场初赛 C×70%；决赛 F = D×30% + E×70%"],
        ["环节", "初赛 = 文档 + 创意设计 + 现场初赛；决赛 = 创新实践 + 现场决赛（初赛成绩不带入决赛）"],
        ["轮次", "每队两轮，每轮 3 分钟调试 + 3 分钟运行，取最好成绩"],
        ["场地", "2400×2400 mm 工业场景：灰色十字车道（宽 400 mm），越出车道即本轮结束"],
      ]}
    />
  </Frame>
);

/* ------------------------------------------------------- 硬约束 */
const Limits = () => (
  <Frame kicker="概览" floor="03" title="硬约束：先记住这几条" wide>
    <DataTable
      head={["项目", "要求"]}
      widths={["20%", "80%"]}
      rows={[
        ["设计与制作", "须自主设计制造；除标准件外非标零件自研，禁成品套件拼装"],
        ["运行", "完全自主；允许与笔记本通讯（运行中不得触碰）；禁任何遥控"],
        ["尺寸", "出发时铅垂投影 ≤300×300 mm、高 ≤400 mm，含所有软质线路；机械臂可折叠，展开后不限"],
        ["重量", "发布稿未设整机重量限制（以现场检录为准）"],
        ["电源", "仅一块内置电源，全程（含调试）不可更换；比赛中不得更换任何零部件"],
        ["显示", "上部醒目位置任务码显示：亮光、不被遮挡、字高 ≥12 mm"],
        ["补光", "仅允许垂直向下补光；禁止对场地遮挡"],
        ["启动", "「一键式」启动，唯一按钮、明确标识；每轮只有一次启动机会"],
      ]}
    />
  </Frame>
);

/* ------------------------------------------------------- 场地 */
const Field = () => (
  <Frame kicker="概览" floor="04" title="场地与布局：只能走灰色车道" wide>
    <div className="grid items-start gap-4 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
      <Grid cols={2}>
        <Card title="场地与车道" icon={Boxes} tone="brand">
          2400×2400 mm；灰色十字行车道宽 400 mm；四个淡黄色区 450×450，其余亚光白。
        </Card>
        <Card title="启停区与障碍" icon={Crosshair} tone="good">
          启停区 ×2（蓝色 300×300，抽签定出发位）；黑色模拟障碍 φ50×100 mm，数量与位置随机抽签。
        </Card>
        <Card title="原料区电动转盘" icon={Repeat} tone="warn">
          顶面 φ300 mm、总高 80–100 mm、6–10 秒/圈；一次放 3 个物料（呈 120°），两批物料颜色一致。
        </Card>
        <Card title="粗加工 / 暂存区" icon={Layers} tone="brand">
          各 580×150 mm，表面有圆环 1–6 环与数字标识（线宽 1.5 mm），放置位置每轮抽签；二维码板 A4 横放、码面 80×80 mm。
        </Card>
      </Grid>
      <Figure src={fieldLiveImg} alt="904 直播场地图与机械臂方案墙" caption="2027 课程直播：场地尺寸标注与机械臂方案墙" />
    </div>
  </Frame>
);

/* ------------------------------------------------------- 任务码与流程 */
const Task = () => (
  <Frame kicker="概览" floor="05" title="任务码与十步流程" wide>
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <Card title="任务码 = 4 组三位数（以「+」连接）" icon={ClipboardCheck} tone="brand">
        <ul className="space-y-1.5">
          <li>· 第 1 组：第一批 3 个物料的<b>颜色与顺序</b>。</li>
          <li>· 第 2 组：第一批在粗加工区 + 暂存区的放置位置。</li>
          <li>· 第 3 组：第二批 3 个物料的颜色与顺序。</li>
          <li>· 第 4 组：第二批在粗加工区的放置位置。</li>
        </ul>
        <p className="mt-2 text-[0.85rem] text-muted">例：<code>156+123+516+231</code>。</p>
      </Card>
      <Card title="读码 → 显示 → 抓取" icon={Target} tone="good">
        <ul className="space-y-1.5">
          <li>· 显示装置必须显示任务码，字高 ≥12 mm，无法清晰辨认不得分。</li>
          <li>· 原料区<b>逐个抓取</b>：抓 1 个、放上机器人，才能抓下一个。</li>
          <li>· 粗加工区按序放入对应圆环（<b>底面触地即放置完毕</b>）。</li>
          <li>· 第二批在暂存区<b>码垛</b>：颜色一致 + 第一批正确 + 不掉落才得分。</li>
        </ul>
      </Card>
    </div>
    <div className="mt-4">
      <Steps title="展开：十步完整流程">
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>检录：测尺寸、查显示装置；抽签场地号与出发位。</li>
          <li>调试 3 分钟（不得换件）；剩 1 分钟抽签任务（第二轮重抽）；剩 30 秒停放启停区、转盘上料、插二维码板。</li>
          <li>统一发令 → 一键启动（一次机会，不启动即本轮结束）。</li>
          <li>到二维码板读码 → 显示任务码。</li>
          <li>原料区按任务码顺序逐个抓取：抓 1 个、放上机器人，才能抓下一个。</li>
          <li>携物料沿车道至粗加工区，按序放入对应圆环。</li>
          <li>把粗加工区物料再装车 → 运至暂存区按序放入（第一批平面放置）。</li>
          <li>返回原料区 → 第二批 3 个物料重复流程。</li>
          <li>第二批在暂存区码垛：放在第一批之上。</li>
          <li>回启停区，显示装置显示抓取/放置正确数量。</li>
        </ol>
      </Steps>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 圆环 */
const Ring = () => (
  <Frame kicker="概览" floor="06" title="圆环尺寸与放置判定" wide>
    <DataTable
      head={["项", "1 环", "2 环", "3 环", "4 环", "5 环", "6 环", "6 环外 / 倾倒"]}
      widths={["22%", "11%", "11%", "11%", "11%", "11%", "11%", "12%"]}
      rows={[
        ["外径（φ = 物料最大直径）", "φ+3", "φ1+5", "φ2+7", "φ3+10", "φ4+10", "φ5+10", "—"],
        ["分数", "15", "10", "7", "5", "3", "1", "0"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Card title="判定方法" icon={Target} tone="brand">
        垂直方向能看到某环外圈，即判在该环内；环号从内向外 1–6。
      </Card>
      <Card title="触地定分" icon={Layers} tone="good">
        物料底面与地面接触即视为放置完毕，并按此位置定分。
      </Card>
      <Card title="红线" icon={Ban} tone="bad">
        触地后再移动该物料、或把物料在场地推行移动 → 本轮结束。
      </Card>
    </div>
    <div className="mt-4">
      <Quote>圆环线宽 1.5 mm；1–6 环分差很大——放环是「精度换分」的核心，值得为最后一级精度投入视觉。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 计分 */
const Scoring = () => (
  <Frame kicker="概览" floor="07" title="计分：圆环与码垛是分仓" wide>
    <DataTable
      head={["分项", "分值"]}
      widths={["62%", "38%"]}
      rows={[
        ["正确读码并在显示装置显示任务码", "1"],
        ["每正确抓取 1 个物料（抓到 + 放上机器人）", "2 / 个"],
        ["圆环放置（非线性）：1 / 2 / 3 / 4 / 5 / 6 环", "15 / 10 / 7 / 5 / 3 / 1"],
        ["环外或倾倒", "0"],
        ["暂存区码垛（第二批，色一致 + 平稳）", "同第一批分档"],
        ["按时回启停区", "2"],
        ["显示抓取数、放置数", "各 2"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
      <Card title="现场初赛 C" icon={Percent} tone="brand">
        C = 100 ×（本队得分 ÷ 最高得分）；官方运行时间每轮 3 分钟。
      </Card>
      <Card title="文档分：别踩 0 分雷区" icon={Ban} tone="bad">
        A 命题文档：内容 75 + 排版 25，雷同 / 含校名地名姓名 = 0；B 创意设计：创新 40 + 美观 30 + 合理 30，同校外型雷同 = 0。
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 红线 */
const Redline = () => (
  <Frame kicker="概览" floor="08" title="红线：这些动作直接结束本轮" wide>
    <DataTable
      head={["规则点", "后果"]}
      widths={["64%", "36%"]}
      rows={[
        ["发令后接触机器人（含笔记本）或物料", "本轮结束"],
        ["出发后越出灰色车道（机械臂除外）", "本轮结束"],
        ["停止运行 15 秒（等待转盘增 8 秒）", "本轮结束"],
        ["物料触地后再移动该物料 / 自行取出掉落物料", "本轮结束"],
        ["原地高速打滑", "裁判可终止比赛，按打滑前成绩计"],
        ["结构 / 尺寸 / 参数不符，损坏场地", "不得参赛 / 成绩无效 / 取消资格"],
      ]}
    />
    <div className="mt-4">
      <Quote>物料触地即定分——放置动作要一次到位；掉落物料不得自行取出，取出即结束。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 文档分 */
const Docs = () => (
  <Frame kicker="概览" floor="09" title="文档分 30%：别把可准备的分丢了" wide>
    <Grid cols={2}>
      <Card title="任务命题文档 A（20%）" icon={ClipboardCheck} tone="brand">
        <ul className="space-y-1.5">
          <li>· 按模板设计<b>决赛命题</b>：场景 + 场地（放料区域 / 位置 / 放置方式）。</li>
          <li>· 给出物料形状、尺寸与零件图（工程图 + 三维图）。</li>
          <li>· 评分：内容质量 75 + 排版规范 25。</li>
          <li>· 雷同 / 含地名、单位名、姓名、电话、无关符号 = <b>0 分</b>。</li>
        </ul>
      </Card>
      <Card title="作品创意设计 B（10%）" icon={Target} tone="good">
        <ul className="space-y-1.5">
          <li>· 创新性 40：外形与内部结构有新意。</li>
          <li>· 美观性 30：整体美观、布局合理。</li>
          <li>· 合理性 30：结构合理、制造精细、拆卸方便、实用。</li>
          <li>· <b>同校外型雷同全部 0 分</b>。</li>
        </ul>
      </Card>
    </Grid>
    <div className="mt-4">
      <Quote>这两项都在现场之外完成——提前准备，是性价比最高的 30 分。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 决赛 */
const Finals = () => (
  <Frame kicker="概览" floor="10" title="决赛：创新实践与 A/B/C 等级" wide>
    <DataTable
      head={["环节", "权重", "要点"]}
      widths={["18%", "12%", "70%"]}
      rows={[
        ["创新实践 D", "30%", "D = D1 工程效益 + D2 技术能力 + D3 综合素质 − 扣分（安全 / 诚信 / 纪律）"],
        ["现场决赛 E", "70%", "参照初赛流程，两轮取最好；区域 / 物料 / 参数现场公布"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Card title="A 等级" icon={TrendingUp} tone="good">
        用现场设备 / 材料 / 软件平台完成任务，并在后续任务中应用。
      </Card>
      <Card title="B 等级" icon={Layers} tone="warn">
        按要求完成了任务，但未在后续任务中应用。
      </Card>
      <Card title="C 等级" icon={Ban} tone="bad">
        没用现场平台完成任务 → 取消后续决赛资格。
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 推荐基线 */
const Baseline = () => (
  <Frame kicker="方案" floor="11" title="推荐基线：照着开源底板做最小改动" wide>
    <Quote>
      四轮麦轮底盘 + 42 步进×4（同步带减速）+ 立柱横梁臂（滚珠丝杆 Z 轴）+ 舵机平行爪 + 随车转盘 + 双摄视觉 + 树莓派 5 / RDK X5 + 下位机主控；软件按状态机实现。
    </Quote>
    <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
      <Card title="机械与底盘（1–5）" icon={Wrench} tone="brand">
        <ul className="space-y-1.5">
          <li>· 轮系选麦轮，不做差速（对标全部获奖车）。</li>
          <li>· 步进电机：开环精确步进 + 集成驱动，成本低。</li>
          <li>· <b>同步带必须减速</b>，不要轻易尝试电机直驱。</li>
          <li>· Z 轴用滚珠丝杆（精度 + 自锁性）。</li>
          <li>· 爪用成品舵机平行爪，先稳定后优化。</li>
        </ul>
      </Card>
      <Card title="系统与流程（6–10）" icon={Cog} tone="good">
        <ul className="space-y-1.5">
          <li>· 车自带转盘：载运合规 + 流程顺畅。</li>
          <li>· 双摄分工，不贪多。</li>
          <li>· 补光灯必装（赛场光线不可控）。</li>
          <li>· 屏幕必装（任务码显示 = 容错）。</li>
          <li>· 结构求简（决赛适应性）。</li>
        </ul>
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 硬件选型表 */
const Bom = () => (
  <Frame kicker="方案" floor="12" title="硬件选型表（课程开源 BOM 提取）" wide>
    <DataTable
      head={["分组", "部件", "规格要点", "数量"]}
      widths={["12%", "22%", "54%", "12%"]}
      rows={[
        ["场地", "地图 / 物料 / 电动转台", "2027 训练场（约 2.6×2.4 m）；2027 款物料；电动转台（带支架款）", "各 1"],
        ["底盘", "麦轮", "5 mm 孔径黑色麦轮（4 个一组）", "4"],
        ["底盘", "步进电机", "42 mm 步进（长 40 mm，带支架，四只一组）", "4"],
        ["底盘", "悬挂 / 板件", "底盘上下板、悬挂上下板（4 mm 加工件）；共轴连接器；φ6 法兰 / 轴承", "全套"],
        ["传动", "同步带减速组", "3M 圆弧齿同步带 + 铝合金同步轮（约 1:3）；D 型轴", "1 套"],
        ["Z 轴", "升降模组", "Z 升降 150 mm 行程（滚珠丝杆 + 双导轨）", "1"],
        ["末端", "机械爪", "J60-Z27（侧装 / 立装，舵机款，20kg·cm 180° 舵机）", "1"],
        ["转盘", "物料转盘", "物料检测转盘（升级款全套）+ 回转轴承 75×16", "1"],
        ["视觉", "摄像头 ×2", "1080P（大广角，识别物料颜色）+ 720P（识别二维码）+ 补光灯", "2 + 1"],
        ["感知", "陀螺仪", "HWT101CT-TTL（兼容 ROS）；十字激光器（调试用）", "1 + 1"],
        ["电控", "主控 / 上位机", "无极 S2（下位机，多串口）；树莓派 5 / RDK X5（视觉 / 调度）", "各 1"],
        ["电源", "电池", "2S 航模锂电池（3500 mAh 级，单电池内置）", "1"],
        ["交互", "屏幕", "触摸屏（尺寸合规、显示任务码 / 进度）", "1"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：采购备注与替代（完整 33 行见 04-硬件选型表.md）">
        <Pre>{`主渠道    课程原表淘宝链接（网盘包内 Excel 第二列）；同款见「一点创绘」店铺
备选      往年开源车 BOM（满环车 GitHub / 国特 CSDN 文章）交叉比价
可打印    机械爪安装件、屏幕支架、部分轮毂件 3D 打印即可
全局定位  J75 课程时点未上架，可用「陀螺仪 + 视觉 + 编码器融合」替代
训练件    地图 + 物料 + 电动转台建议早买（训练周期最长），注意色差
防松      M3×6 / M3×25 螺丝、销钉、螺柱；弹垫 / 螺纹胶（失败因果图重点）`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 底盘 */
const Chassis = () => (
  <Frame kicker="方案" floor="13" title="底盘与传动：麦轮 + 同步带减速" wide>
    <Focus
      no="01"
      title="四轮麦轮 + 板式车架"
      tag="事实标准"
      tagTone="brand"
      points={[
        "四轮麦轮、正方形轮距；尺寸尽量做大，接近但不超出 300×300 极限。",
        "板式车架：底盘上/下板 + 悬挂上/下板（4 mm，CNC / 钣金 / 碳纤）。",
        "悬挂摆臂保证四轮牢固接地；底盘 290×290 mm 级。",
        "驱动：42 步进 ×4 → 3M 圆弧齿同步带 + 铝合金同步轮 → D 型轴 → 麦轮。",
        "含涨紧与防松设计；轮子与底盘 4 个面齐。",
      ]}
      aside={
        <Figure src={chassisImg} alt="底盘布局 290 尺寸标注" caption="课程 CAD：底盘布局与 290×290 尺寸标注" />
      }
    />
  </Frame>
);

/* ------------------------------------------------------- 机械臂与夹爪 */
const Arm = () => (
  <Frame kicker="方案" floor="14" title="机械臂与夹爪：立柱横梁 + 平行爪" wide>
    <Focus
      no="02"
      title="立柱横梁臂（滚珠丝杆 Z 轴）"
      tag="转动与伸缩耦合"
      tagTone="good"
      points={[
        "Z 轴 = 滚珠丝杆 + 双导轨（150 mm 行程升降模组）。",
        "水平伸缩 + 旋转耦合；回零机构（动/静侧撞块限位 + 限位开关）。",
        "臂展须覆盖场地转盘工作面（CAD 画圆覆盖检查）。",
        "末端：舵机平行爪（一次一个物料）；成品 J60-Z27 可侧装 / 立装、可换爪片。",
        "合规自查：避免「爪不合规决赛扣 50%」重演。",
      ]}
      aside={
        <Figure src={gripperImg} alt="J60-Z27 舵机平行机械爪（侧装 / 立装）" caption="成品舵机平行爪 J60-Z27：侧装 / 立装两版" />
      }
    />
  </Frame>
);

/* ------------------------------------------------------- 随车转盘 */
const Turntable = () => (
  <Frame kicker="方案" floor="15" title="随车转盘：载运合规的关键" wide>
    <div className="grid items-start gap-5 md:gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
      <div>
        <ul className="space-y-2.5">
          <li className="flex gap-2.5 text-[0.95rem] leading-relaxed text-slateink">
            <span className="mt-[0.5rem] h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
            <span>车自带电机驱动旋转盘，用于收集 / 中转物料（抓取后放在车上运，符合载运规则）。</span>
          </li>
          <li className="flex gap-2.5 text-[0.95rem] leading-relaxed text-slateink">
            <span className="mt-[0.5rem] h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
            <span>回转轴承（最大直径 75 mm、高 16 mm，无间隙）——精度关键，别省。</span>
          </li>
          <li className="flex gap-2.5 text-[0.95rem] leading-relaxed text-slateink">
            <span className="mt-[0.5rem] h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
            <span>物料随机位姿解法：<b>机械定心定高</b>（平台高度位置一定）+ <b>旋转对齐</b>。</span>
          </li>
          <li className="flex gap-2.5 text-[0.95rem] leading-relaxed text-slateink">
            <span className="mt-[0.5rem] h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
            <span>配合「抓取 → 放盘 → 再取 → 再放环」流程，减少空跑。</span>
          </li>
        </ul>
      </div>
      <div className="space-y-3 md:space-y-4">
        <Figure src={turntableImg} alt="随车转盘方案" caption="课程 CAD：随车旋转物料盘方案" />
        <Figure src={turntableSolveImg} alt="转盘随机位置解法" caption="转盘随机位置解法：定高定心 + 旋转对齐" />
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 视觉 */
const Vision = () => (
  <Frame kicker="方案" floor="16" title="视觉：双摄分工 + 模式机状态机" wide>
    <Grid cols={4}>
      <Card title="① 双摄采集" icon={Eye} tone="brand">
        1080P（大广角）认物料颜色；720P 认二维码；均配补光灯。
      </Card>
      <Card title="② 模式机" icon={ScanLine} tone="good">
        状态机含 TURNTABLE / QR / BINARY / SWATCH_ALL，输出检测置信度列表。
      </Card>
      <Card title="③ 稳与滤" icon={Gauge} tone="warn">
        置信度过滤 + 多帧稳定性（如位置连续 N 帧、颜色置信度阈值）。
      </Card>
      <Card title="④ 下发" icon={Radio} tone="slate">
        串口把坐标 / 类别下发给下位机，由下位机执行运动。
      </Card>
    </Grid>
    <div className="mt-4 grid items-start gap-4 md:grid-cols-[1fr_auto]">
      <ul className="space-y-1.5 text-[0.9rem] leading-relaxed text-slateink">
        <li>· <b>抗赛场光线</b>：做二值化鲁棒处理；补光灯只允许垂直向下。</li>
        <li>· <b>色差与决赛变数</b>：现成件与自打印件有色差，决赛物料形状/颜色现场公布，须留适配余量。</li>
        <li>· <b>运行帧率</b>：课程创源实现约 16–18 FPS，可直接作为起点。</li>
      </ul>
      <div className="w-full max-w-[20rem]">
        <Figure src={flowImg} alt="搬运流程" caption="核心任务全流程：读码 → 取料 → 放环 → 码垛 → 回位" />
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 视觉参数基线 */
const VisionParams = () => (
  <Frame kicker="方案" floor="17" title="视觉参数基线（可直接起步）" wide>
    <DataTable
      head={["任务", "方法", "关键参数"]}
      widths={["20%", "26%", "54%"]}
      rows={[
        ["二维码", "灰度 + pyzbar", "连续 3 帧一致才认"],
        ["物块（转盘）", "HoughCircles + HSV 面积投票", "minDist 30、param1 50、param2 30、r 25–45；红双阈 H[0,10]/[160,180]，S/V ≥50；绿 H[30,89]；蓝 H[90,140]；面积占比 ≥5%"],
        ["稳定判据", "多帧", "位置连续约 30 帧、位置稳定 <10 px、颜色置信度 ≥0.5–0.7"],
        ["色环粗定标", "640×480", "r 35–38，限制在画面中部合法区"],
        ["色环精定标", "1920×1080", "半分辨率粗检 + 全分辨率局部精修"],
        ["码垛 / 物料区", "640×480", "r 20–27"],
        ["失败回码", "—", "000000004（约 8 s 超时）"],
      ]}
    />
    <div className="mt-4">
      <Quote>参数取自 2026 广东实车视觉程序；换场地 / 光线后必须重标 HSV 与半径。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 通信协议 */
const Protocol = () => (
  <Frame kicker="方案" floor="18" title="通信协议基线：上位机 ↔ 下位机" wide>
    <Grid cols={2}>
      <Card title="物理层" icon={Radio} tone="brand">
        串口 9600 8N1；下摄 /dev/video0 扫码，上摄 /dev/video2 定标；依赖 opencv / numpy / pyserial / pyzbar。
      </Card>
      <Card title="帧格式" icon={ScanLine} tone="good">
        0xFF + 9 字节 ASCII + 0xFE，不足补 0x00；就绪 / 确认回 987654321，失败回 000000004。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：单字节命令表">
        <Pre>{`1  扫码（pyzbar，连续 3 帧一致）
2 / a  定首个物块（第一 / 第二圈）
3 / 4  转盘排序（第一 / 第二圈）
5 / 6 / b / c  抓取位确认
7  色环粗定标（640×480）
8  色环精定标（1920×1080）
9 / 0  码垛圆环定标
d–i  决赛成品区 Code128 / 固定物料区
r  重启视觉程序；end 结束本轮`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 算力与器件 */
const Compute = () => (
  <Frame kicker="方案" floor="19" title="算力与器件规格（联网核对）" wide>
    <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
      <Card title="上位机 RDK X5（官方规格）" icon={Cpu} tone="brand">
        <ul className="space-y-1.5">
          <li>· 8×A55@1.5 GHz，BPU 10 TOPS，GPU 32 Gflops。</li>
          <li>· 4 / 8 GB LPDDR4；2×4-lane MIPI CSI；4×USB3.0。</li>
          <li>· 1×CAN FD、Wi-Fi6 + BT5.4、Ubuntu 22.04；85×56 mm、5V/5A。</li>
        </ul>
      </Card>
      <Card title="闭环步进（ZDT X42S / X57）" icon={Cog} tone="good">
        <ul className="space-y-1.5">
          <li>· TTL / RS485、115200，多机地址 1–255。</li>
          <li>· 速度 0–6000 RPM；16 细分下 3200 脉冲 = 1 圈。</li>
          <li>· 回零 4 模式；堵转检测与保护；可读位置 / 速度 / 电流 / 温度。</li>
        </ul>
      </Card>
    </div>
    <div className="mt-4">
      <Quote>选型取舍：RDK X5 / 树莓派 5 / K230 / MaixCAM / Jetson 皆可，权衡在「算力 vs 惯量 vs 上手」。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 定位与控制 */
const Localize = () => (
  <Frame kicker="设计" floor="20" title="定位与控制：动态抓取是满环关键" wide>
    <Grid cols={2}>
      <Card title="融合定位" icon={Compass} tone="brand">
        编码器里程计 + 光流融合；陀螺仪（HWT101 类）角度融合；手眼标定、机器人重定位。
      </Card>
      <Card title="运动解算与 PID" icon={Move} tone="good">
        麦轮全向运动解算 + 精准校准；正弦加减速过渡 + 边转边直走（省冠实证）；分层 PID，参数分区独立整定；断电保护与急停逻辑。
      </Card>
      <Card title="逆运动学" icon={Crosshair} tone="warn">
        臂的逆运动学解算 + 动态参数；手眼转换把像素坐标映射到车体 / 机械臂坐标。
      </Card>
      <Card title="动态跟踪抓取" icon={TrendingUp} tone="brand">
        转盘不停机直接抓——满环关键；加入后「原料区转盘转得越慢越有优势」。
      </Card>
    </Grid>
    <div className="mt-4">
      <Quote>技术清单：麦轮解算校准 / 编码器与光流融合 / IMU 角度融合 / 分层 PID / 手眼标定 / 逆运动学 / 重定位。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 软件架构 */
const Software = () => (
  <Frame kicker="设计" floor="21" title="上下位机架构：感知与执行解耦" wide>
    <Grid cols={2}>
      <Card title="上位机（RDK X5 / 树莓派 / K230）" icon={Cpu} tone="brand">
        <ul className="space-y-1.5">
          <li>· 视觉状态机 + 任务调度状态机。</li>
          <li>· 只发「目标类别 / 相对位姿 / 动作」，不做底层控制。</li>
          <li>· 参考（2026 广东）：RDK X5，双 1080P，OpenCV + pyzbar。</li>
        </ul>
      </Card>
      <Card title="下位机（主控板 / STM32）" icon={Radio} tone="good">
        <ul className="space-y-1.5">
          <li>· 麦轮运动解算、分层 PID、舵机 / 转盘 / 升降控制。</li>
          <li>· 安全 / 限位 / 急停兜底。</li>
          <li>· 参考（2026 广东）：STM32F407ZGT6，CAN 驱动 6 路步进，USART1 定长帧、14 条指令。</li>
        </ul>
      </Card>
    </Grid>
    <div className="mt-4">
      <Quote>底盘指令与动作指令必须解耦：上位机负责「看懂」，下位机负责「走准、抓稳」。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 电控对标 */
const EcCtrl = () => (
  <Frame kicker="设计" floor="22" title="电控对标：三种可抄整机" wide>
    <DataTable
      head={["项", "2026 广东（cheese）", "2025–26 广东（Wuyanzu）", "2025 国银（liaojingwu）"]}
      widths={["14%", "30%", "30%", "26%"]}
      rows={[
        ["主控", "STM32F407ZGT6", "STM32F407VGT6（168 MHz）", "STM32F103ZET6"],
        ["视觉", "RDK X5（双 1080P）", "K230（串口从机，只回偏差）", "树莓派（OpenCV + ArUco）"],
        ["底盘电机", "4×42 步进 + CAN", "4×42 步进 + USART3 115200", "4×Emm_V5 闭环 + USART1 115200"],
        ["定位", "WHT101 IMU", "HWT101（UART4 230400）", "编码轮 + 陀螺仪（±2 mm / ±0.5°）"],
        ["扫码", "视觉下摄（pyzbar）", "GM65 类模块（USART6 9600）", "扫码模块（UART5 9600）"],
        ["架构", "9 阶段流程 + 定时状态", "分层顶层状态机（10 ms 调度）", "四层闭环校正 + 逆运动学"],
      ]}
    />
    <div className="mt-4">
      <Quote>省赛主流：F407 + 串口步进 + K230 / RDK；闭环步进换精度与堵转保护，代价是成本与调试量。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 任务状态机 */
const Fsm = () => (
  <Frame kicker="设计" floor="23" title="任务状态机：一条主链，禁止颠倒" wide>
    <Grid cols={3}>
      <Card title="① 读码" icon={ScanLine} tone="brand">一键启动 → 到二维码板读码 → 显示任务码。</Card>
      <Card title="② 抓取" icon={Hand} tone="good">原料区按任务码顺序逐色抓取，一次一个放上转盘。</Card>
      <Card title="③ 放环" icon={Crosshair} tone="warn">沿车道至粗加工区，按序放入对应圆环。</Card>
      <Card title="④ 转运" icon={Move} tone="brand">取回物料，运至暂存区按序平面放置。</Card>
      <Card title="⑤ 码垛" icon={Layers} tone="good">第二批重复，在暂存区码垛（色一致 + 平稳）。</Card>
      <Card title="⑥ 回位" icon={Target} tone="warn">回启停区，显示抓取 / 放置正确数量。</Card>
    </Grid>
    <div className="mt-4">
      <Quote>顺序不可颠倒；一次只抓一个，放到车上后才能抓下一个。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 广东实证 */
const Evidence = () => (
  <Frame kicker="设计" floor="24" title="2026 广东实车实证（可抄的整机）" wide>
    <div className="grid items-start gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
      <DataTable
        head={["维度", "做法"]}
        widths={["20%", "80%"]}
        rows={[
          ["构型", "三自由度圆柱坐标 RPP（旋转云台 + 升降 + 水平推送）+ 麦轮全向底盘"],
          ["分层", "底盘行走 → 电控供电 → 机械臂 → 视觉感知，分层独立拆装调试"],
          ["控制", "STM32F407ZGT6 + RDK X5；CAN 菊花链驱动 6 路 ZDT_X57 步进；14 条串口指令严格时序"],
          ["视觉", "双 1080P；色环两级定标：640×480 粗定标（×1.18，±5 mm）→ 1920×1080 精定标（×0.29，±2 mm）"],
          ["流程", "扫码 → 转盘三工位取料 → 穿越通道 → 色环粗精对位放置 → 取回 → 第二轮 → 码垛 → 归位"],
        ]}
      />
      <Figure src={fieldGdImg} alt="2026 广东省赛现场地图与流程" caption="2026 广东省赛现场：新版布局场地与流程" />
    </div>
    <div className="mt-4">
      <Quote>来源：GitHub `cheese-shredded-ice/gongchuangsai_MBH`，基于 2025 国金第六二次开发；结构/电控/视觉完整工程见 07 系列文档。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 补件3：攻略与省冠 */
const Supplement3 = () => (
  <Frame kicker="设计" floor="25" title="补件3：浙工大攻略 + 2025 河北省冠" wide>
    <Grid cols={2}>
      <Card title="浙工大非官方攻略（Tuzfucius）" icon={BookOpen} tone="brand">
        <ul className="space-y-1.5">
          <li>· 视觉三章齐全：设备选型（OpenMV vs K230）、15 条基础算法 + YOLO、数据集 → 训练 → 部署全流程。</li>
          <li>· 运动学：麦轮原理与逆运动学模型；机械结构与运动学控制为占位待补。</li>
          <li>· 外设章基于「2025 失败代码」，只学思路、别照抄参数。</li>
        </ul>
      </Card>
      <Card title="河北冠技术报告（zpclyn/GongXun2025）" icon={ShieldCheck} tone="good">
        <ul className="space-y-1.5">
          <li>· 2025 河北省冠，自述 2:34 全一环；STM32F4 裸机 + 定时器 / DMA 驱动全部外设。</li>
          <li>· 运动学：麦轮逆解 + 正弦加减速 + 漂移（边转边直走）。</li>
          <li>· 教训：陀螺仪磁干扰失利、高速舵机必须单独供电。</li>
        </ul>
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：可迁移的两段运动学技巧">
        <Pre>{`正弦加减速（防速度突变打滑）
v_i = v1 + (v2 - v1) * [1/2 - 1/2*cos(pi*i/K)]

漂移 / 边转边直走（期望系 -> 车体系，theta 取陀螺仪偏角）
vx' =  vx*cos(theta) + vy*sin(theta)
vy' = -vx*sin(theta) + vy*cos(theta)`}</Pre>
      </Steps>
    </div>
    <div className="mt-4">
      <Quote>细节与代码地图见 <code>培训/工创赛智能搬运-调研包/09-补件3-攻略与省冠技术报告.md</code>。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 三阶段路线 */
const Roadmap = () => (
  <Frame kicker="落地" floor="26" title="三阶段路线：先闭环，再稳定，后提速" wide>
    <DataTable
      head={["阶段", "目标", "配置要点"]}
      widths={["24%", "30%", "46%"]}
      rows={[
        ["一 · 跑通闭环", "底盘校准、定位、单点取放", "麦轮 + 42 步进 ×4（同步带）+ 板式车架；臂 + 爪单点抓放"],
        ["二 · 稳定得分", "读码 → 抓取 → 放环 → 码垛全流程", "随车转盘、双摄 + 补光灯、状态机、码垛"],
        ["三 · 提速竞争", "动态抓取、路径优化、抗扰动", "动态跟踪抓取、分层 PID 整定、光线 / 色差鲁棒、速度调参"],
      ]}
    />
    <div className="mt-4">
      <Quote>不要一开始就整机联调——分层调试：底盘 → 臂 → 视觉 → 流程，逐层验收。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 训练与自测 */
const Test = () => (
  <Frame kicker="落地" floor="27" title="训练与自测清单" wide>
    <Grid cols={2}>
      <Card title="运动与抓取" icon={Move} tone="brand">
        <ul className="space-y-1.5">
          <li>· 麦轮直行 / 横移 / 旋转偏差可接受；待机与运行中复测定位漂移。</li>
          <li>· 一次一个、抓稳不掉；放上转盘后再抓下一个。</li>
          <li>· 夹爪合规自查。</li>
        </ul>
      </Card>
      <Card title="视觉与流程" icon={Eye} tone="good">
        <ul className="space-y-1.5">
          <li>· 六色物料白天 / 赛场光线下识别稳定；二维码多角度多距离可读。</li>
          <li>· 色环两级定标准确；码垛颜色一致、平稳、不掉落。</li>
          <li>· 全流程回归不越灰线、不超 15 秒停顿；两轮连打、单电源全程。</li>
        </ul>
      </Card>
    </Grid>
  </Frame>
);

/* ------------------------------------------------------- 现场工程坑 */
const Pitfalls = () => (
  <Frame kicker="落地" floor="28" title="现场工程坑：失败因果图" wide>
    <Grid cols={2}>
      <Card title="一开始就整机联调" icon={AlertTriangle} tone="warn">
        先分层调试、逐层验收；否则「无法区分系统误差」，一上线就现场翻车。
      </Card>
      <Card title="轨道平行度 / 不防松" icon={Wrench} tone="bad">
        装配后必做平行度测量；全车防松（螺纹胶 / 弹垫）。这是因果图重点。
      </Card>
      <Card title="传感器不兼容 / 追高配" icon={Cpu} tone="warn">
        选件先小批量验证总线 / 协议，再做系统集成；采用社区验证过的配置，别选冷门配件。
      </Card>
      <Card title="布线混乱" icon={GitBranch} tone="brand">
        供电与信号分离、沿框架边缘走、运动关节留活动余量。
      </Card>
      <Card title="赛场光线与色差" icon={Eye} tone="warn">
        补光灯必装，视觉做二值化鲁棒处理；自打印件与现成件有色差。
      </Card>
      <Card title="转盘现场差异 / 防滑垫" icon={Repeat} tone="brand">
        转盘速度 / 高度现场可能不一致，留调参接口；防滑垫赛题未明确，部分赛区不让贴。
      </Card>
    </Grid>
  </Frame>
);

/* ------------------------------------------------------- 合规检查表 */
const Checklist = () => (
  <Frame kicker="落地" floor="29" title="赛前合规与可靠性自查" wide>
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      <Card title="合规（逐条对照规则）" icon={ShieldCheck} tone="good">
        <ul className="space-y-1.5">
          <li>· 出发尺寸 ≤300×300×400 mm（含软线），机械臂折叠合规。</li>
          <li>· 任务码显示字高 ≥12 mm、亮光、不被遮挡。</li>
          <li>· 仅一块内置电源，全程不可更换。</li>
          <li>· 末端夹爪与机构合规（避免 2023 式扣分）；补光仅垂直向下。</li>
        </ul>
      </Card>
      <Card title="可靠性" icon={Scale} tone="brand">
        <ul className="space-y-1.5">
          <li>· 一键启动可靠、每轮一次机会。</li>
          <li>· 断电 / 重启后能恢复运行态；带备用启动方案。</li>
          <li>· 限位 / 急停与断电保护可触发。</li>
          <li>· 走线、固定、防松经振动与多次拆装验证。</li>
        </ul>
      </Card>
    </div>
    <div className="mt-4">
      <Quote>物料触地即定分、掉落不得自取——动作与合规边界赛前逐条演练到肌肉记忆。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 行动清单 */
const Actions = () => (
  <Frame kicker="收尾" floor="30" title="行动清单" wide>
    <DataTable
      head={["优先", "动作", "要点"]}
      widths={["10%", "28%", "62%"]}
      rows={[
        ["1", "吃透规则", "以 官方原件/（发布稿 2-1/2-2、51 页命题解析）为准；口径与参数已核对进 08-联网补充与规格核对.md"],
        ["2", "先做两份文档", "任务命题文档 A 20%（要出决赛场地与物料工程图 / 三维图）+ 创意设计 B 10%；均有 0 分红线"],
        ["3", "拿开源底板", "2027 全套开源（网盘）+ 2025 满环车 / 国特第六 / 2026 广东（GitHub），按 06 的三梯队优先级取用"],
        ["4", "早买训练件", "地图 + 物料 + 电动转台训练周期最长；场地服务商见 05-配套资料索引.md"],
        ["5", "按三阶段推进", "跑通闭环 → 稳定得分 → 提速竞争；每阶段自测后再联调"],
      ]}
    />
  </Frame>
);

/* ------------------------------------------------------- Closing */
const Closing = () => (
  <Frame kicker="收尾" floor="31" title="下载与延伸阅读">
    <div className="space-y-5">
      <Quote>
        本 deck 由本仓库「工创赛智能搬运-调研包 v1.2（2026-09-28）」整理而成；规则口径按官方发布稿原文核对，器件规格联网核对（RDK X5 官方页、ZDT 闭环步进手册），二手项已标注。
      </Quote>
      <Grid cols={3}>
        <Card title="调研包（本仓库）" icon={BookOpen} tone="brand">
          完整报告与官方原件：<br />
          <code className="break-all">培训/工创赛智能搬运-调研包/</code><br />
          先读 <code>README-交付说明.md</code>，主件 <code>00-调研报告（主件）.md</code>，补充见 <code>08-联网补充与规格核对.md</code> 与补件3 <code>09-补件3-攻略与省冠技术报告.md</code>。
        </Card>
        <Card title="官方依据" icon={ShieldCheck} tone="good">
          发布稿《附件2-1 命题与运行》《附件2-2 评分与规则》、51 页命题解析、服务商通知、2025 获奖名单——均在调研包的 <code>官方原件/</code>。
        </Card>
        <Card title="公开对标" icon={GitBranch} tone="slate">
          Thirtynine3939/2025GongChuang_AGV（满环车）｜yuanxiexie531-glitch/gcs-gold-medal（国金第六）｜cheese-shredded-ice/gongchuangsai_MBH（2026 广东）｜Wuyanzu-wuhu/gc-stm32F4-（2025–26 广东）；全量见 <code>GitHub-55仓库总表.csv</code>。
        </Card>
      </Grid>
      <p className="text-[0.86rem] text-muted">
        路径：<code>教学webppt/智能搬运车辆设计/</code>（成品单文件，离线可播）｜文字版：<code>docs/智能搬运车辆设计.md</code>
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Tldr /> },
  { nav: "赛项与赛程", group: "概览", el: <Event /> },
  { nav: "硬约束", group: "概览", el: <Limits /> },
  { nav: "场地与布局", group: "概览", el: <Field /> },
  { nav: "任务码与流程", group: "概览", el: <Task /> },
  { nav: "圆环尺寸与判定", group: "概览", el: <Ring /> },
  { nav: "计分", group: "概览", el: <Scoring /> },
  { nav: "红线", group: "概览", el: <Redline /> },
  { nav: "文档与创意设计", group: "概览", el: <Docs /> },
  { nav: "决赛与等级", group: "概览", el: <Finals /> },
  { nav: "推荐基线", group: "方案", el: <Baseline /> },
  { nav: "硬件选型表", group: "方案", el: <Bom /> },
  { nav: "底盘与传动", group: "方案", el: <Chassis /> },
  { nav: "机械臂与夹爪", group: "方案", el: <Arm /> },
  { nav: "随车转盘", group: "方案", el: <Turntable /> },
  { nav: "视觉流水线", group: "方案", el: <Vision /> },
  { nav: "视觉参数基线", group: "方案", el: <VisionParams /> },
  { nav: "通信协议基线", group: "方案", el: <Protocol /> },
  { nav: "算力与器件规格", group: "方案", el: <Compute /> },
  { nav: "定位与控制", group: "设计", el: <Localize /> },
  { nav: "主控与架构", group: "设计", el: <Software /> },
  { nav: "电控对标", group: "设计", el: <EcCtrl /> },
  { nav: "任务状态机", group: "设计", el: <Fsm /> },
  { nav: "2026 广东实证", group: "设计", el: <Evidence /> },
  { nav: "补件3：攻略与省冠", group: "设计", el: <Supplement3 /> },
  { nav: "三阶段路线", group: "落地", el: <Roadmap /> },
  { nav: "训练与自测", group: "落地", el: <Test /> },
  { nav: "现场工程坑", group: "落地", el: <Pitfalls /> },
  { nav: "合规检查表", group: "落地", el: <Checklist /> },
  { nav: "行动清单", group: "收尾", el: <Actions /> },
  { nav: "下载与延伸阅读", group: "收尾", el: <Closing /> },
];
