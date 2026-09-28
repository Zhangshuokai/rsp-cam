import React from "react";
import {
  Scale,
  Ruler,
  ShieldCheck,
  Cpu,
  Battery,
  Cog,
  Eye,
  GitBranch,
  Wrench,
  ClipboardCheck,
  AlertTriangle,
  Compass,
  Layers,
  Rocket,
  Target,
  Zap,
  Radio,
  Repeat,
  Ban,
  Boxes,
  BookOpen,
  Truck,
  Package,
  Workflow,
  Crosshair,
  TrendingUp,
  Percent,
  Siren,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre, Stat, Figure } from "./components.jsx";

import realBucea from "./assets/real-bucea.jpg";
import fieldImg from "./assets/field.png";
import targetsImg from "./assets/targets.png";
import safetyImg from "./assets/safety.png";
import liveWeight from "./assets/live-weight.jpg";
import liveChassis from "./assets/live-chassis.jpg";
import liveTransport from "./assets/live-transport.jpg";
import realJiangxi from "./assets/real-jiangxi.jpg";
import realTianzhi from "./assets/real-tianzhi.jpg";
import realTracks from "./assets/real-tracks.jpg";
import realCad from "./assets/real-cad.jpg";
import qrProvince from "./assets/qr-province.png";

/* ------------------------------------------------------------ Cover */
const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
      <div>
        <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
          培训讲义 · 2026-09-28 · v1.0
        </span>
        <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
          智能救援车辆设计
          <br />
          <span className="text-brand-600">1.5kg 限重下的整车方案</span>
        </h1>
        <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
          面向 2027 年第十届工创赛「智能+工程创新赛道 · 智能救援」：在 ≤1.5kg、≤300×300×200mm、单电源不可换、全自主的硬约束下，
          把「移动 + 感知 + 越障 + 推拨转运 + 对抗防护」做成一台能稳定得分的小车。
        </p>
      </div>
      <Figure
        src={realBucea}
        alt="公开获奖救援机器人实物（北京建筑大学，2025）"
        caption="公开获奖实机：3D 打印车体 + 框式拨具 + 双目相机（BUCEA-EPIC，2025）"
      />
    </div>
  </div>
);

/* ------------------------------------------------------- TL;DR */
const Tldr = () => (
  <Frame kicker="概览" floor="01" title="结论先行：设计就是做减法" lead="三条铁律决定成败，其余都是细节。">
    <Grid cols={3}>
      <Card title="合规优先" icon={ShieldCheck} tone="good">
        一切动作只做「推、拨、导流」；不抓取、不载运、不滞留。边界设计赛前书面报裁判确认。
      </Card>
      <Card title="重量先行" icon={Scale} tone="brand">
        先定电池 → 电机 → 算力 → 结构，机械件最后做；全程逐件称重，全局预留 15–20% 裕量。
      </Card>
      <Card title="先成车，再升级" icon={Rocket} tone="warn">
        差速 + 推铲最快成车；确认「过减速带 + 推目标入区」得分闭环后，再按预算升级算力与机构。
      </Card>
    </Grid>
    <div className="mt-7">
      <Quote>
        任何故障 = 0 分。3 分钟全自主、一键启动、无人干预——冗余与降级设计比极限性能更重要。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 赛项 */
const Event = () => (
  <Frame kicker="背景" floor="02" title="这是什么比赛" wide>
    <DataTable
      head={["项", "内容"]}
      widths={["16%", "84%"]}
      rows={[
        ["赛项", "中国大学生工程实践与创新能力大赛（工创赛）· 智能+工程创新赛道 · 智能救援"],
        ["赛制", "三级：校级初赛 → 省级复赛 → 全国总决赛；省赛须在 2027-05-10 前收口"],
        ["节奏", "校赛 2026 年秋 → 省赛 2027 年春 → 国赛 2027 年 7–8 月"],
        ["形式", "两队各 1 台同场对抗，各 3 分钟 + 3 分钟调试；抽签打 2–3 场取平均"],
        ["任务", "把救援目标推/拨进本队安全区得分；可干扰、禁止主动进攻；必须全自主"],
        ["构成", "总分 = 任务命题文档 A×20% + 作品创意设计 B×10% + 现场初赛 C×70%"],
      ]}
    />
    <div className="mt-4">
      <Quote>
        本届启动及培训会已在江西九江召开。江西校赛窗口约在 2026 年 10–11 月，省赛通知截至调研日尚未发布。
      </Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 红线 */
const Limits = () => (
  <Frame kicker="背景" floor="03" title="硬约束：先记住这几条" wide>
    <DataTable
      head={["项目", "要求"]}
      widths={["22%", "78%"]}
      rows={[
        ["重量", "整机 ≤1.5 kg（硬线，检录称重不过不能参赛）"],
        ["尺寸", "出发时铅垂投影 ≤300×300 mm，高度 ≤200 mm，含所有软质线路"],
        ["电源", "仅一块随车电源；比赛全程（含调试）不能更换"],
        ["零件", "比赛过程中不能更换任何电子元器件与零部件"],
        ["运行", "必须全自主；不得以任何方式遥控（含无线遥控装置）"],
        ["动作", "禁止抓取救援目标、禁止把目标放在机器人上；禁止主动进攻"],
        ["设计与制作", "须自主设计制造；除标准件外非标零件自主设计，不允许购买成品套件拼装"],
        ["外观", "禁止误导图案；禁止与救援目标同色的装饰"],
      ]}
    />
  </Frame>
);

/* ------------------------------------------------------- 计分 */
const Scoring = () => (
  <Frame kicker="背景" floor="04" title="计分与红线：怎么拿分、怎么出局" wide>
    <Grid cols={3}>
      <Stat value="5" unit="分/个" label="普通物资：绿色 40mm 正方体" />
      <Stat value="10" unit="分/个" label="核心物资：黑色 40mm 正四面体" tone="warn" />
      <Stat value="15" unit="分/个" label="伤员：橘色 80×40×40mm，须单独转运" tone="good" />
    </Grid>
    <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <div>
      <DataTable
        head={["规则点", "后果"]}
        widths={["62%", "38%"]}
        rows={[
          ["必须先单独转运 1 个普通物资，之后才可转运核心/伤员", "违反本轮结束"],
          ["单次转运物资 ≤3 个；伤员必须单独转、一次 1 个", "超出本轮结束"],
          ["危险目标（浅蓝）移入安全区或移出场地", "本轮结束"],
          ["机器人进对方安全区（含压围栏）", "−5 分/次"],
          ["物资 / 伤员放错半区（含围栏、隔板）", "−10 分/个并放回中心"],
          ["停走 15 秒、失控、一键启动后再次触碰作品", "本轮结束"],
        ]}
      />
      </div>
      <Figure
        src={targetsImg}
        alt="四类救援目标（官方命题解析）"
        caption="初赛四类目标：绿正方体 / 黑正四面体 / 橘色伤员 / 浅蓝危险目标（官方命题解析）"
      />
    </div>
  </Frame>
);

/* ------------------------------------------------------- 场地 */
const Field = () => (
  <Frame kicker="背景" floor="05" title="场地与目标：几何决定机构" wide>
    <div className="grid items-start gap-5 md:gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
      <div className="space-y-4">
        <Figure
          src={fieldImg}
          alt="2027 智能救援场地图（官方命题解析）"
          caption="官方命题解析：场地全貌，约 3000×3000mm，四周加固围栏"
        />
        <Figure
          src={safetyImg}
          alt="安全区与减速带（官方命题解析）"
          caption="安全区围栏截面为直角三角、内含物资/伤员两区；出发区前 3 根减速带"
        />
      </div>
      <div className="space-y-3">
        <Card title="关键尺寸" icon={Ruler} tone="brand">
          <ul className="space-y-1.5">
            <li>· 场地约 3000×3000 mm；出发区 1–4 号，抽签定。</li>
            <li>· 出发区前 3 根减速带，图解 300×60×10 mm、间隔 50 mm。</li>
            <li>· 安全区外包 660×360 mm、内净 600×300 mm，围栏截面为直角三角。</li>
            <li>· 内部 20 mm 隔板分「物资放置区 / 伤员放置区」各半。</li>
          </ul>
        </Card>
        <Card title="四类目标（初赛 20 个）" icon={Package} tone="warn">
          绿 40mm 正方体 ×8（普通）、黑 40mm 正四面体 ×4（核心）、橘 80×40×40mm ×4（伤员）、浅蓝 40mm 正方体 ×4（危险）。
          决赛参数现场公布，预留再训练余量。
        </Card>
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 变化 */
const Changes = () => (
  <Frame kicker="背景" floor="06" title="2027 三大变化：老方案会失效" wide>
    <DataTable
      head={["项", "2025 第九届", "2027 第十届（现版）"]}
      widths={["16%", "38%", "46%"]}
      rows={[
        ["运行模式", "自主 或 自主+遥控", "强制全自主（可连笔记本但禁遥控）"],
        ["越障", "未列", "明确新增「越障」+ 多种路面"],
        ["识别要求", "搜集与转运", "搜索与转运 + 对象识别与信息获取（二维码/文字/颜色等）"],
        ["尺寸口径", "300mm 正方形、高 200", "300×300 含所有软线；禁同色装饰"],
        ["电源", "未细化", "单电源、全程不换"],
        ["场地", "2400 级、纯推球", "3000×3000，目标/围栏/减速带全套新物"],
      ]}
    />
    <div className="mt-4">
      <Quote>往届视频只可用于「构型参考」——三项变化会让照搬老方案失效。以官方发布稿与省赛补充通知为准。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 三档 */
const Tiers = () => (
  <Frame kicker="方案" floor="07" title="三档配置：推荐「均衡型」" wide>
    <DataTable
      head={["档位", "底盘", "算力", "机构", "全机预估", "取舍"]}
      widths={["12%", "20%", "22%", "22%", "12%", "12%"]}
      rows={[
        ["轻快型", "差速 JGB37 系", "STM32 + K230 / MaixCAM", "推铲 + 简化框具", "0.7–1.1kg", "余量足、机动快；算法余量小"],
        ["均衡型 ★", "差速（65mm 轮 + 辅助轮）", "STM32 + 端侧 NPU", "框式拨具（可抬起）", "1.2–1.4kg", "推荐主线，省一/国一有实证"],
        ["重装型", "四麦轮 / 履带", "RK3588 / Jetson", "通道式 / 复杂机构", "1.4–1.5kg", "麦轮有超重淘汰先例，慎选"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <Card title="为什么推荐均衡型" icon={Target} tone="good">
        只比轻快型多花约 200–300g，就把「能把目标挑进正确半区」这件得分必需的事做出来了。
      </Card>
      <Card title="为什么慎选重装型" icon={AlertTriangle} tone="bad">
        重算力与麦轮同时吃预算与机动性；1.5kg 是硬线，逼近上限等于把风险留到检录台。
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 重量预算 */
const Budget = () => (
  <Frame kicker="方案" floor="08" title="重量预算：先记账，再减重" wide>
    <Grid cols={3}>
      <Card title="预算制" icon={ClipboardCheck} tone="brand">
        任何零件进方案前先写进预算表；每加 10g，都要回答「从哪减 10g」。
      </Card>
      <Card title="二八法则" icon={Percent} tone="warn">
        减重大头永远在结构件、轮系、电池；传感器/小板卡再抠也只有几十克。
      </Card>
      <Card title="称重纪律" icon={Scale} tone="good">
        规格书重量 ≠ 实物；采购后逐一上秤回填，打印件按切片预估 ×1.05。
      </Card>
    </Grid>
    <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
      <Steps title="展开：经验分账与预算校核（完整）">
        <p>起步分账（估算）：动力 25–35% ｜ 电池 8–12% ｜ 主控+感知 5–15% ｜ 结构 15–25% ｜ 执行机构 5–10% ｜ 线材+紧固件+杂项 8–15%。</p>
        <DataTable
          head={["配置", "全机预估", "1.5kg 余量"]}
          widths={["40%", "30%", "30%"]}
          rows={[
            ["轻快型（N20 4WD）", "≈682 g", "≈818 g"],
            ["均衡型（4×25mm 减速 + K230）", "≈1404 g", "≈96 g"],
            ["重装型（4×25mm + RK3588 + OAK-D + LD19）", "≈1491 g", "≈9 g（顶满，不推荐）"],
          ]}
        />
        <Pre>{`校核门槛：各分系统合计 ≤ 1500 g
胶水 / 双面胶 / 扎带 / 标签   预留 20–30 g
线材                         按总重 4–8% 预留（≈60–120 g）
任何增项：先从「结构」和「紧固件」里找空间`}</Pre>
      </Steps>
      <Figure
        src={liveWeight}
        alt="2027 专题直播：1.5kg 重量预算页"
        caption="2027 专题直播的 1.5kg 重量预算页（厂商口径，克重未实物核验，正式 BOM 前自测）"
      />
    </div>
  </Frame>
);

/* ------------------------------------------------------- 底盘 */
const Chassis = () => (
  <Frame kicker="方案" floor="09" title="底盘：首推四轮差速" wide>
    <DataTable
      head={["方案", "重量", "优势", "风险 / 实证"]}
      widths={["16%", "18%", "34%", "32%"]}
      rows={[
        ["四轮差速", "最轻（JGB37 系 ~210g）", "结构简单、最快成车；实车验证能过减速带、推动物块", "对位靠螺旋逼近，不如麦轮快"],
        ["四麦克纳姆轮", "重（M2006×4 + C610 ~428g）", "可 vy+ω 双向平移，投放精度高", "★ 有队伍因整车超重被淘汰的先例，慎选"],
        ["履带", "整套 ≥650g", "全地形、越障强", "吃掉约 43% 预算，1.5kg 内基本不可行"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <Card title="关键证据（高可信）" icon={ShieldCheck} tone="good">
        公开归档：差速版整车完成实车验证，能越过减速带、推动所有物块；第一版麦轮方案因整车超重被淘汰。
      </Card>
      <Card title="轮径与通过性" icon={Cog} tone="brand">
        差速用 Φ65mm 橡胶轮（35–40g/个）+ 后辅助轮 + 万向球；减速带区降速、直线段加速。
      </Card>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
      <Figure src={liveChassis} alt="2027 专题直播：底盘选型页" caption="2027 直播底盘选型页：差速 vs 四麦轮" />
      <Figure src={realJiangxi} alt="江西省赛实机" caption="江西省赛实车：双车同场，推目标入安全区" />
      <Figure src={realTianzhi} alt="天职师大实机" caption="天职师大 2025 省赛夺冠：车稳、动作净" />
    </div>
  </Frame>
);

/* ------------------------------------------------------- 算力 */
const Compute = () => (
  <Frame kicker="方案" floor="10" title="算力：端侧 NPU 是最大减重杠杆" wide>
    <DataTable
      head={["级别", "型号", "算力", "重量", "功耗", "参考价"]}
      widths={["14%", "26%", "16%", "14%", "12%", "18%"]}
      rows={[
        ["MCU", "STM32F407 / ESP32-S3", "—", "10–18g", "<1W", "¥25–60"],
        ["轻量 NPU", "K230 CanMV / RK3566", "0.5–1T", "10–35g", "<3W", "¥80–250"],
        ["中 NPU ★", "RK3588S / Rock 5B", "6 TOPS", "55–75g", "5–10W", "¥350–650"],
        ["GPU", "Jetson Orin Nano", "40–100T", "≈100g", "7–15W", "¥1800+"],
        ["轻视觉栈", "树莓派 5 + Hailo-8L", "—", "≈80–110g", "—", "—"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <Card title="首选 MaixCAM Pro / K230" icon={Cpu} tone="good">
        省一等奖实测：YOLOv8-INT8 量化后 mAP50 96%、链路 29.98 FPS，350→900 张图即可训出；决赛换形状仍稳定识别。
      </Card>
      <Card title="注意反向证据" icon={AlertTriangle} tone="warn">
        重算力（RK3588 / Jetson）也有获奖先例——它不是错误，只是重量预算更紧。取舍在「惯量对机动性的惩罚 vs 算法余量」。
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 机构 */
const Mechanism = () => (
  <Frame kicker="方案" floor="11" title="转运机构：可抬起的「框式拨具」" wide>
    <Grid cols={3}>
      <Card title="纯固定推板" icon={Boxes} tone="slate">
        最轻、0 执行器；但无法「抬起」，难以应对安全区 20mm 隔板与不规则几何体。
      </Card>
      <Card title="框式拨具（可抬起）★" icon={Wrench} tone="good">
        2 个 9g 金属齿舵机 + 3D 打印框，完成张开 / 闭合 / 抬起 / 放下；能把目标挑进正确半区。
      </Card>
      <Card title="贯穿式通道（进阶）" icon={Workflow} tone="brand">
        前段导向铲 / 中段波纹壁自适应 / 后段可控闸门；目标贴地滑行、靠壁约束，约 115g。
      </Card>
    </Grid>
    <div className="mt-4">
      <Quote>
        合规边界：规则禁止抓取、禁止把目标放在机器人上。涉及「抬离地面 / 暂存」的边界设计，赛前书面报裁判确认，主推推、拨、导流三类无滞留动作。
      </Quote>
    </div>
    <p className="mt-3 text-[0.84rem] text-muted">
      机械臂（2025 明文除外、2027 明文禁止抓取）与本赛项不相容；旋转扫臂可控性差，不推荐。
    </p>
    <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
      <Figure src={liveTransport} alt="2027 专题直播：转运机构页" caption="2027 直播转运机构页：贯穿式自适应通道 / 框式拨具" />
      <Figure src={realTracks} alt="履带+推铲实机" caption="公开实机：履带底盘 + 前置大弧面推铲（推 / 铲流派）" />
    </div>
  </Frame>
);

/* ------------------------------------------------------- 感知与电源 */
const Sense = () => (
  <Frame kicker="方案" floor="12" title="感知与电源：做减法" wide>
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      <Card title="感知：够用即可" icon={Eye} tone="brand">
        <ul className="space-y-1.5">
          <li>· 单目相机：五类目标 + 安全区识别（端侧 NPU 推理）。</li>
          <li>· 单轴陀螺仪 HWT101：锁定出发点绝对 0° 与安全区方位，无需六轴/九轴。</li>
          <li>· ToF / 雷达属辅助：国一队明确「靠近并不需要测距，视觉就够了」。</li>
          <li>· 深相机 D435i（≈72–90g）与激光雷达（≈47g+）只在确需绝对定位时加。</li>
        </ul>
      </Card>
      <Card title="电源：一次做对" icon={Battery} tone="warn">
        <ul className="space-y-1.5">
          <li>· 单电源、随车、赛中（含调试）不可换 → 容量一次配足。</li>
          <li>· 按「单场 3 分钟 × 平均功耗」+50% 余量估算。</li>
          <li>· 2S 850mAh ≈48–57g（6.3Wh）；3S 1300mAh ≈99–123g（14.4Wh）。</li>
          <li>· 主控 / 传感器独立 DCDC 或 LDO，避免电机堵转把主控拉复位。</li>
        </ul>
      </Card>
    </div>
    <div className="mt-4">
      <Quote>感知验收口径：危险目标误判 = 0；绿色识别召回 &gt;95%。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 机械布局 */
const Layout = () => (
  <Frame kicker="设计" floor="13" title="机械布局：低重心、能越障、可维修" wide>
    <Focus
      no="01"
      title="一张底板上的取舍"
      tag="结构"
      goal="整机 ≤300×300×200mm（含软线），把电池、电机、算力、机构的重量与位置一次排清，重心落在轮系支撑多边形内。"
      points={[
        "低重心：电池下沉到两轮轴之间 / 底盘最低处，改善越障抗翻与对抗稳定性。",
        "越障：Φ65mm 橡胶轮 + 前摆臂或斜面导板，机构/底盘预留通过性余量。",
        "抗撞：框架 + 缓冲角 + TPU 泡棉（10–20g）优先，而不是加厚整壳或配重。",
        "维修：推板 / 铲板、拨具可拆换；方便拆装也是官方明文要求。",
        "走线：线束全收纳在轮廓内——软线计入尺寸检查，也计入重量。",
      ]}
      aside={
        <Card title="常见失误" icon={AlertTriangle} tone="bad">
          相机架高立柱会带来杠杆与额外结构件；线束、相机支架、铜柱三者合计可吃掉几百克隐性预算。
        </Card>
      }
    />
    <div className="mt-4">
      <Figure
        src={realCad}
        alt="公开机械方案 CAD（2026）"
        caption="公开实机机械方案 CAD：低重心、楔形推铲与紧凑布局（仅供构型参考）"
      />
    </div>
  </Frame>
);

/* ------------------------------------------------------- 拨具设计 */
const Gripper = () => (
  <Frame kicker="设计" floor="14" title="框式拨具：两个舵机做四件事" wide>
    <div className="grid items-start gap-5 md:gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="张开 / 闭合" icon={Boxes} tone="brand">
          两个舵机对称驱动框体，张开让目标进入、闭合成框约束目标。
        </Card>
        <Card title="抬起 / 放下" icon={TrendingUp} tone="good">
          「可抬起」把目标挑过 20mm 隔板，放进物资区或伤员区——这是分区投放的关键。
        </Card>
        <Card title="动作与运动解耦" icon={GitBranch} tone="slate">
          底盘指令与机构动作分开封装，用最简执行器完成最少的必要动作。
        </Card>
        <Card title="选件" icon={Cog} tone="warn">
          9g 级金属齿舵机（≈13g/个）+ 3D 打印框；已获获奖机实物验证，不必上标准尺寸舵机。
        </Card>
      </div>
      <div className="surface p-4">
        <p className="mb-3 text-[0.88rem] font-bold text-ink">分区投放动作序列</p>
        <Steps title="展开：一次完整投放（示意）">
          <Pre>{`1. 视觉确认目标类别与安全区半区
2. 靠近目标，框口对准、降低铲口
3. 框住目标（不夹紧、不载运）
4. 推向本队安全区斜坡
5. 到物资区 / 伤员区上方，抬起框体
6. 继续前推，目标越过 20mm 隔板落入正确半区
7. 张开、后退，进入下一次转运

验收：物资进物资区、伤员进伤员区（错区 −10 分/个）`}</Pre>
        </Steps>
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 电气 */
const Electric = () => (
  <Frame kicker="设计" floor="15" title="电气与安全：故障即 0 分" wide>
    <Grid cols={3}>
      <Card title="供电树" icon={Zap} tone="brand">
        单电池 → 分路：电机（大电流）、舵机、主控与传感器各自稳压；避免堵转拉低母线电压。
      </Card>
      <Card title="急停与失控保护" icon={Siren} tone="bad">
        一键启动只有一次机会；程序需含停走 15 秒保护、失控停车、通信超时停车。
      </Card>
      <Card title="防缠绕与限位" icon={ShieldCheck} tone="good">
        线束收纳于轮廓内；机构设行程限位；所有方向与速度指令有上限。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：上电自检与测试纪律（完整）">
        <Pre>{`上电前：架空车轮
自检项：急停 / 通信超时 / 机构限位 / 方向 / 速度上限
测试顺序：
  1) 单电机正反转与编码器读数
  2) 底盘直行、原地转、斜行（若麦轮）
  3) 舵机张开 / 闭合 / 抬起 / 放下的行程
  4) 断电重启 → 能否自动进入运行态
  5) 一键启动全流程，记录耗时与异常`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 软件架构 SVG */
const ArchSvg = () => (
  <svg viewBox="0 0 420 220" className="h-auto w-full" role="img" aria-label="上下位机软件架构">
    <rect x="20" y="16" width="380" height="46" rx="8" fill="#eff8ff" stroke="#60b0f7" strokeWidth="1.5" />
    <text x="34" y="36" fontSize="11" fontWeight="700" fill="#1a5cae">感知层</text>
    <text x="34" y="52" fontSize="10.5" fill="#334155">单目相机 → 目标检测 ｜ 单轴陀螺仪 → 绝对方位 ｜（可选）ToF 测距</text>

    <rect x="20" y="76" width="380" height="60" rx="8" fill="#eefaf8" stroke="#0ea5a3" strokeWidth="1.5" />
    <text x="34" y="96" fontSize="11" fontWeight="700" fill="#0f766e">决策层（端侧 NPU / 上位机）</text>
    <text x="34" y="113" fontSize="10.5" fill="#334155">YOLO 识别 → 目标筛选 → 视觉状态机 → 任务状态机</text>
    <text x="34" y="129" fontSize="10.5" fill="#64748b">输出：目标类别 / 相对位姿 / 目标动作（去哪个半区）</text>

    <rect x="20" y="150" width="380" height="54" rx="8" fill="#f3f6fb" stroke="#93cdfb" strokeWidth="1.5" />
    <text x="34" y="170" fontSize="11" fontWeight="700" fill="#1f72d6">执行层（STM32）</text>
    <text x="34" y="187" fontSize="10.5" fill="#334155">底盘运动解算（PID） + 舵机动作 + 安全保护</text>

    <line x1="210" y1="62" x2="210" y2="76" stroke="#94a3b8" strokeWidth="1.6" />
    <line x1="210" y1="136" x2="210" y2="150" stroke="#94a3b8" strokeWidth="1.6" />
    <text x="222" y="74" fontSize="9" fill="#64748b">UART（含 CRC 校验）</text>
    <text x="222" y="148" fontSize="9" fill="#64748b">指令 / 遥测</text>
  </svg>
);

const Software = () => (
  <Frame kicker="设计" floor="16" title="软件架构：分层、解耦、可降级" wide>
    <div className="grid items-start gap-5 md:gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
      <div className="surface p-3 md:p-4">
        <ArchSvg />
      </div>
      <div className="space-y-3">
        <Card title="两条路线" icon={GitBranch} tone="brand">
          <ul className="space-y-1.5">
            <li>· 裸机协作式调度（STM32 + 定频任务）：上手快，适合 3 分钟定流程。</li>
            <li>· ROS 2 节点化（上位机）：传感器多、迭代快时更稳，但增加 Linux 依赖与启动风险。</li>
            <li>· 无论哪条，底盘指令与动作指令必须解耦。</li>
          </ul>
        </Card>
        <Card title="通信" icon={Radio} tone="warn">
          自定义 UART 协议 + CRC 校验；上位机只发「目标类别 / 相对位姿 / 动作」，下位机负责运动解算与安全兜底。
        </Card>
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 视觉 */
const Vision = () => (
  <Frame kicker="设计" floor="17" title="视觉流水线：350 张图就能起步" wide>
    <div className="grid gap-3 md:grid-cols-4">
      <Card title="采集与标注" icon={Eye} tone="slate">
        采集并标注约 350 张；按 300/50 划分训练 / 验证。
      </Card>
      <Card title="增强" icon={Layers} tone="brand">
        Albumentations 把 300 张训练图增强到 900 张，覆盖光照与角度。
      </Card>
      <Card title="训练与量化" icon={Cpu} tone="good">
        YOLOv8 训练 → INT8 量化 → 转 MaixCAM 可用格式。
      </Card>
      <Card title="端侧部署" icon={Rocket} tone="warn">
        部署到 MaixCAM Pro，调用板载 NPU；MaixVision 可直接运行。
      </Card>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Stat value="96" unit="% mAP50" label="INT8 量化模型在数据集上的精度（训练阶段 99%）" tone="good" />
      <Stat value="29.98" unit="FPS" label="实际运行链路平均帧率（纯视觉流水线 39.85 FPS）" />
      <Stat value="900" unit="张" label="增强后训练图数量；决赛换形状后仍稳定识别" tone="warn" />
    </div>
    <p className="mt-3 text-[0.84rem] text-muted">类别建议：普通物资 / 核心物资 / 伤员 / 危险目标 / 安全区；危险目标误判必须为 0。</p>
  </Frame>
);

/* ------------------------------------------------------- 状态机 SVG */
const FsmSvg = () => (
  <svg viewBox="0 0 460 210" className="h-auto w-full" role="img" aria-label="任务状态机">
    {[
      { x: 10, label: "一键启动", sub: "离开出发区" },
      { x: 100, label: "搜索目标", sub: "视觉识别" },
      { x: 190, label: "首转 1 普通", sub: "先单个" },
      { x: 280, label: "批量 ≤3", sub: "普通/核心" },
      { x: 370, label: "伤员 1 个", sub: "单独转运" },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="40" width={80} height="44" rx="8" fill="#eff8ff" stroke="#60b0f7" strokeWidth="1.5" />
        <text x={s.x + 40} y="60" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1a5cae">{s.label}</text>
        <text x={s.x + 40} y="75" textAnchor="middle" fontSize="9.5" fill="#64748b">{s.sub}</text>
        {i < 4 && <line x1={s.x + 80} y1="62" x2={s.x + 90} y2="62" stroke="#94a3b8" strokeWidth="1.8" />}
      </g>
    ))}
    <rect x="150" y="130" width="160" height="42" rx="8" fill="#fdeceb" stroke="#d23f3f" strokeWidth="1.5" />
    <text x="230" y="149" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#b3261e">遇危险目标 → 绕行</text>
    <text x="230" y="164" textAnchor="middle" fontSize="9.5" fill="#64748b">不降铲、不接触、本轮不结束</text>
    <line x1="140" y1="84" x2="200" y2="130" stroke="#d23f3f" strokeWidth="1.4" strokeDasharray="5 4" />
    <text x="10" y="100" fontSize="9.5" fill="#64748b">顺序不可颠倒；任一红线触发即本轮结束</text>
  </svg>
);

const Fsm = () => (
  <Frame kicker="设计" floor="18" title="任务状态机：顺序不能错" wide>
    <div className="surface p-3 md:p-4">
      <FsmSvg />
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Card title="首转规则" icon={Target} tone="warn">
        必须先单独转运 1 个普通物资，之后才可转运核心 / 伤员。
      </Card>
      <Card title="数量限制" icon={Repeat} tone="brand">
        单次物资 ≤3 个；伤员必须单独转、一次 1 个。
      </Card>
      <Card title="避让危险" icon={Ban} tone="bad">
        危险目标不降铲、直接绕行；移入安全区或移出场地都判本轮结束。
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 定位 */
const Localize = () => (
  <Frame kicker="设计" floor="19" title="定位与对位：精度与重量的三角" wide>
    <DataTable
      head={["方案", "精度", "重量", "成本", "适用"]}
      widths={["30%", "16%", "16%", "18%", "20%"]}
      rows={[
        ["雷达 + 陀螺 + 反光柱 / 单目", "<10mm", "≈188g", "≈¥800", "最高精度，但增重明显"],
        ["D435i + 单目广角", "<20mm", "≈90g", "≈¥2500", "需要深度时"],
        ["端侧视觉（K230 / MaixCAM）+ 单轴陀螺仪", "<30mm", "≈50g", "≈¥200", "起步首选"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <Card title="先视觉 + 陀螺仪" icon={Compass} tone="good">
        单轴陀螺仪记录出发点绝对 0°、锁定安全区方位即可；视觉负责目标与对位。
      </Card>
      <Card title="对位策略" icon={Crosshair} tone="brand">
        差速用螺旋逼近；需要效率时再评估全向。投放前用安全区斜坡与隔板做几何约束，降低对定位精度的依赖。
      </Card>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 三阶段 */
const Roadmap = () => (
  <Frame kicker="落地" floor="20" title="三阶段路线：每阶段都能独立上场" wide>
    <DataTable
      head={["阶段", "目标", "配置要点", "预估重量"]}
      widths={["16%", "22%", "48%", "14%"]}
      rows={[
        [
          "一 · 基础得分",
          "过减速带、把普通物资推入安全区",
          "四轮差速 + Φ65mm 轮 + 前推铲 + STM32 + K230/MaixCAM（五类识别）+ 极简状态机（首转 1 → 批量 ≤3）",
          "0.9–1.1kg",
        ],
        [
          "二 · 稳定得分",
          "得分动作稳定 + 红线不碰 + 分区分投",
          "加框式拨具（可抬起，双 9g 舵机）；单轴陀螺仪定 0°；安全区斜坡推入与分区投放；程序保护（15s 停走 / 失控）",
          "1.1–1.3kg",
        ],
        [
          "三 · 高分竞争",
          "速率 / 精度 / 对抗",
          "底盘精调或评估全向（麦轮谨慎）；端侧 NPU 提频或 RK3588 按预算评估；通道式导流；IBVS 对位；目标调度优化",
          "1.3–1.4kg",
        ],
      ]}
    />
    <div className="mt-4">
      <Quote>先成车、再升级：差速 + 推铲最快闭环；确认得分动作稳定后，再按剩余重量预算升级。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 自测 */
const Test = () => (
  <Frame kicker="落地" floor="21" title="训练与自测清单：按红线逐项回归" wide>
    <Grid cols={2}>
      <Card title="通行" icon={Truck} tone="brand">
        减速带 ×3 连续通过率 ≥95%；不同路面的直行与转向偏差在容忍范围内。
      </Card>
      <Card title="识别" icon={Eye} tone="good">
        五类目标混淆矩阵：危险目标误判 = 0；绿色召回 &gt;95%。
      </Card>
      <Card title="流程" icon={Repeat} tone="warn">
        首转单个普通 → 批量 ≤3 → 伤员单独 1 个 → 全程不碰危险目标。
      </Card>
      <Card title="投放与对抗" icon={ShieldCheck} tone="bad">
        物资进物资区、伤员进伤员区；被推挤后能恢复；不越界对方安全区（−5 分/次）。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：完整自测与耐久（完整）">
        <Pre>{`场地：联系服务商或省组委会拿标准训练场
      （含四类目标 / 围栏 / 减速带），或按 3000×3000 + 660×360 三角围栏自建 1:1

流程回归：一键启动 → 断电恢复 → 2–3 场连打（单电源全程）
称重回归：赛前整机上秤，留 100–200g 应对批次差异与维修件
异常回归：通信超时 / 机构卡死 / 电池掉压 → 均能安全停车`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 现场坑 */
const Pitfalls = () => (
  <Frame kicker="落地" floor="22" title="现场工程坑：都是失分点" wide>
    <Grid cols={2}>
      <Card title="开机自启准备不足" icon={AlertTriangle} tone="bad">
        现场曾因自启文件不完整，小车无法自动进入运行态。提前验证，赛前多次断电重启；带键鼠与备用启动方案。
      </Card>
      <Card title="释放 / 投放对位要求高" icon={Crosshair} tone="warn">
        车身姿态偏差会让目标漏出或进错半区。既要提高定位精度，也要用导向结构与平稳动作留容错。
      </Card>
      <Card title="串口与调参纪律" icon={Radio} tone="brand">
        串口独占：上位机 GUI 占着口，其它程序打开会报错。调试流程固定，避免现场抢串口。
      </Card>
      <Card title="称重与备件" icon={Scale} tone="good">
        规格书重量不等于实物（批次差 ±5–10%）；备件若随车也要计入重量。
      </Card>
    </Grid>
    <div className="mt-4">
      <Quote>比赛现场不仅是代码问题——机械结构、启动流程、环境与调试条件都要提前完整演练，而不是只验证单个模块。</Quote>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 检查表 */
const Checklist = () => (
  <Frame kicker="落地" floor="23" title="出图前检查表" wide>
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      <Card title="重量与尺寸" icon={Scale} tone="brand">
        <ul className="space-y-1.5">
          <li>· 每个系统行都有数字，合计 ≤1500g（含 20–30g 杂项余量）。</li>
          <li>· 所有「估（低）」项已上秤核实或留安全余量。</li>
          <li>· 打印件在切片软件里按分区填充导出重量。</li>
          <li>· 线材长度实测后剪短，端子数量最少化。</li>
        </ul>
      </Card>
      <Card title="合规与可靠" icon={ShieldCheck} tone="good">
        <ul className="space-y-1.5">
          <li>· 高速旋转件全为非金属，且无锋利外露。</li>
          <li>· 电池容量满足不可更换的全程 +50% 余量。</li>
          <li>· 四角有缓冲，推板 / 铲板可拆换。</li>
          <li>· 重心落在轮系支撑多边形内（越障前移 / 后翻余量）。</li>
        </ul>
      </Card>
    </div>
    <div className="mt-4">
      <Steps title="展开：反面清单（切勿上车）">
        <Pre>{`152mm 麦轮单只          2850 g    不可用
6.5″ 轮毂电机单只       2950–3000 g  不可用
不锈钢双层履带底盘       650 g     吃掉 43% 预算
Jetson Orin Nano 套件    175 g     仅对比，非必要不上车
JGB37-520 ×4            576–800 g  顶格方案要慎重
碳纤维等「常规轻量化」   本批资料零证据  不可当结论`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* ------------------------------------------------------- 行动 */
const Actions = () => (
  <Frame kicker="收尾" floor="24" title="行动清单：先打三个电话" wide>
    <DataTable
      head={["优先", "动作", "找谁 / 要点"]}
      widths={["10%", "30%", "60%"]}
      rows={[
        ["1", "问省赛时间与指标", "江西省赛联系人 冯老师 18679450508（主任 张树国 / 南昌航空大学）"],
        ["2", "申领训练场地与器材", "北京启创远景 秦志宏 18601200820（国赛 + 省赛各 2 套）；西安工创汇 尉海阳 13279293986（国赛）"],
        ["3", "确认报名链路", "报名平台 http://8.141.91.231:6078/ 仅队长注册；省赛无需自主报名，凭晋级短信提交"],
        ["4", "写好命题文档（20%）", "官方「智能救援」模板：决赛目标设计思路 + 过程说明 + 场地布置图；注意蓝字删除、禁校名人名"],
        ["5", "确认参赛资格口径", "预通知原文「普通高等教育本科院校全日制在校本科生」——职业本科是否适用，先问省赛再问秘书处"],
      ]}
    />
    <div className="mt-4 grid items-start gap-4 md:grid-cols-[1fr_auto]">
      <Quote>进入省级复赛后不能更换任何参赛人员；每名学生仅限一个赛项、一支队。名单一次报准。</Quote>
      <div className="w-full max-w-[15rem]">
        <Figure src={qrProvince} alt="各省赛联系人查询系统二维码（官方）" caption="官方省赛联系人查询二维码" />
      </div>
    </div>
  </Frame>
);

/* ------------------------------------------------------- Closing */
const Closing = () => (
  <Frame kicker="收尾" floor="25" title="下载与延伸阅读">
    <div className="space-y-5">
      <Quote>
        本 deck 由本仓库「工创赛智能救援-限重方案调研包 v1.0（2026-09-28）」整理而成；克重与直播数据为二手参考，正式 BOM 前请自测。
      </Quote>
      <Grid cols={3}>
        <Card title="调研包（本仓库）" icon={BookOpen} tone="brand">
          完整报告与官方原件：<br />
          <code className="break-all">培训/工创赛智能救援-限重方案调研/</code><br />
          先读其中的 <code>README-交付说明.md</code>，主件 <code>00-调研报告（主件）.md</code>。
        </Card>
        <Card title="官方依据" icon={ShieldCheck} tone="good">
          命题与运行、评分与规则（发布稿）、命题解析 51 页、两批服务商通知——均在调研包的 <code>官方原件/</code>。
        </Card>
        <Card title="公开对标" icon={GitBranch} tone="slate">
          BUCEA-EPIC/intelligent-rescue-2025（Jetson+STM32）｜Pinle-Yu/2025-intelligent-rescue-vision（MaixCAM 省一）｜Nsea261168/gongchuang-car-archive（差速实证）｜starpicke/Intelligent-Rescue（ROS2）。
        </Card>
      </Grid>
      <p className="text-[0.86rem] text-muted">
        路径：<code>教学webppt/智能救援车辆设计/</code>（成品单文件，离线可播）｜文字版：<code>docs/智能救援车辆设计.md</code>
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Tldr /> },
  { nav: "赛项与赛程", group: "概览", el: <Event /> },
  { nav: "硬约束", group: "概览", el: <Limits /> },
  { nav: "计分与红线", group: "概览", el: <Scoring /> },
  { nav: "场地与目标", group: "概览", el: <Field /> },
  { nav: "2027 三大变化", group: "概览", el: <Changes /> },
  { nav: "三档配置", group: "方案", el: <Tiers /> },
  { nav: "重量预算", group: "方案", el: <Budget /> },
  { nav: "底盘选型", group: "方案", el: <Chassis /> },
  { nav: "算力选型", group: "方案", el: <Compute /> },
  { nav: "转运机构", group: "方案", el: <Mechanism /> },
  { nav: "感知与电源", group: "方案", el: <Sense /> },
  { nav: "机械布局", group: "设计", el: <Layout /> },
  { nav: "框式拨具", group: "设计", el: <Gripper /> },
  { nav: "电气与安全", group: "设计", el: <Electric /> },
  { nav: "软件架构", group: "设计", el: <Software /> },
  { nav: "视觉流水线", group: "设计", el: <Vision /> },
  { nav: "任务状态机", group: "设计", el: <Fsm /> },
  { nav: "定位与对位", group: "设计", el: <Localize /> },
  { nav: "三阶段路线", group: "落地", el: <Roadmap /> },
  { nav: "训练与自测", group: "落地", el: <Test /> },
  { nav: "现场工程坑", group: "落地", el: <Pitfalls /> },
  { nav: "出图前检查表", group: "落地", el: <Checklist /> },
  { nav: "行动清单", group: "收尾", el: <Actions /> },
  { nav: "下载与延伸阅读", group: "收尾", el: <Closing /> },
];
