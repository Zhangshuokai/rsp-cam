import React from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Boxes,
  CalendarDays,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Download,
  FolderTree,
  Gauge,
  GraduationCap,
  Layers,
  Lightbulb,
  ListChecks,
  MonitorSmartphone,
  Network,
  Palette,
  Puzzle,
  Rocket,
  RotateCcw,
  Send,
  Server,
  ShieldCheck,
  Target,
  Terminal,
  Trophy,
  Users,
  Wifi,
  Wrench,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Steps, Pre, Pill } from "./components.jsx";

/* 架构示意图：内联 SVG（离线单文件，不用 ASCII / 线框图） */
const ArchFlow = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 660 300"
      role="img"
      aria-label="三块板经 Windows 转发器接入 WSL 中 ROS 2 的数据链路"
      className="h-auto w-full"
    >
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      {/* 板端 */}
      <rect x="8" y="34" width="150" height="52" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="83" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">green · ESP32-S3</text>
      <text x="83" y="73" textAnchor="middle" fill="#475569" fontSize="11">WS2812 @ GPIO48</text>

      <rect x="8" y="122" width="150" height="52" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="83" y="143" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">blue · ESP32-S3</text>
      <text x="83" y="161" textAnchor="middle" fill="#475569" fontSize="11">WS2812 @ GPIO48</text>

      <rect x="8" y="210" width="150" height="60" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="83" y="231" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">xrs · 学而思掌机</text>
      <text x="83" y="248" textAnchor="middle" fill="#475569" fontSize="11">ST7735S 虚拟 LED</text>
      <text x="83" y="263" textAnchor="middle" fill="#64748b" fontSize="10">（GD32 桥部署）</text>

      {/* 板 → 转发器 */}
      <line x1="158" y1="60" x2="224" y2="130" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="158" y1="148" x2="224" y2="148" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="158" y1="238" x2="224" y2="166" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <text x="191" y="141" textAnchor="middle" fill="#0f766e" fontSize="11">WiFi / TCP</text>

      {/* 转发器 */}
      <rect x="228" y="100" width="136" height="96" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="296" y="126" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">Windows</text>
      <text x="296" y="146" textAnchor="middle" fill="#475569" fontSize="11">tcp_forwarder.py</text>
      <text x="296" y="163" textAnchor="middle" fill="#475569" fontSize="11">LAN :6000</text>
      <text x="296" y="180" textAnchor="middle" fill="#475569" fontSize="11">→ WSL :6001</text>

      {/* 转发器 → WSL */}
      <line x1="364" y1="148" x2="428" y2="148" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />

      {/* WSL ROS 2 */}
      <rect x="432" y="34" width="150" height="236" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <text x="507" y="60" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">WSL2 · ROS 2</text>
      <text x="507" y="77" textAnchor="middle" fill="#475569" fontSize="11">Jazzy · board_bridge</text>
      <rect x="444" y="92" width="126" height="44" rx="8" fill="#ffffff" stroke="#bfe1fd" />
      <text x="507" y="110" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">wifi_server</text>
      <text x="507" y="127" textAnchor="middle" fill="#64748b" fontSize="10">行 ↔ 话题</text>
      <rect x="444" y="146" width="126" height="44" rx="8" fill="#ffffff" stroke="#bfe1fd" />
      <text x="507" y="164" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">relay</text>
      <text x="507" y="181" textAnchor="middle" fill="#64748b" fontSize="10">DATA→FROM · KEY→EVENT</text>
      <rect x="444" y="200" width="126" height="44" rx="8" fill="#ffffff" stroke="#bfe1fd" />
      <text x="507" y="218" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">led_ui</text>
      <text x="507" y="235" textAnchor="middle" fill="#64748b" fontSize="10">Web 控制台 :8080</text>
      <text x="507" y="258" textAnchor="middle" fill="#1a5cae" fontSize="10">/board/板名/rx · /tx</text>

      {/* ROS → 浏览器 */}
      <line x1="582" y1="222" x2="622" y2="222" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <rect x="560" y="250" width="92" height="40" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="606" y="275" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">浏览器</text>
      <text x="604" y="214" textAnchor="middle" fill="#0f766e" fontSize="10">HTTP</text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      课程包 · 2026-10-07
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      ESP32 与 ROS 2 开发基础
      <br />
      <span className="text-brand-600">从点亮一颗灯，到接入 ROS 2</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      职业本科 48 学时软硬件入门课程：三块板（绿/蓝 ESP32-S3 + 学而思掌机）经 WiFi/TCP
      接入 WSL 里的 ROS 2，用 Web 控制台管理灯效——设备层 → 通信层 → 系统层一条主线走通。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开完整步骤」可看该步的全量命令与更多细节。
    </p>
  </div>
);

const Position = () => (
  <Frame kicker="概览" floor="01" title="一句话：16 周做出一条真实的软硬件链路">
    <Grid cols={3}>
      <Card title="给谁" icon={GraduationCap}>
        职业本科一年级：电子信息、物联网、机器人、智能制造、计算机等专业；先修计算机应用基础。
      </Card>
      <Card title="体量" icon={CalendarDays}>
        3 学分 / 48 学时（16 周 × 3 学时）；每周建议 45 分钟讲解演示 + 90 分钟动手实践。
      </Card>
      <Card title="主线项目" icon={Lightbulb}>
        LED 协同控制系统：三块板 + ROS 2 桥接 + Web 控制台，所有知识点都围绕它推进。
      </Card>
      <Card title="三个层次" icon={Layers}>
        设备层（GPIO / WS2812 / 串口）→ 通信层（TCP / 行协议 / 心跳重连）→
        系统层（ROS 2 节点 / 话题 / 桥接 / 人机界面）。
      </Card>
      <Card title="学习目标" icon={Target}>
        会装、会写、会连、会调、会做；不追求芯片底层与算法理论的深度。
      </Card>
      <Card title="产出" icon={CheckCircle2} tone="good">
        小组作品（板端样式 + ROS 2 话题 + 控制台），现场演示 + 答辩，可作竞赛原型。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>现象先行、任务驱动：每次课先看到"灯亮了 / 消息通了 / 页面动起来了"，再讲原理。</Quote>
    </div>
  </Frame>
);

const Roadmap = () => (
  <Frame kicker="概览" floor="02" title="16 周路线：四个阶段，一条链" wide>
    <Grid cols={2}>
      <Card title="基础（1–5 周）" icon={Wrench}>
        <div className="mb-2"><Pill tone="brand">环境与固件 → 点灯 → 工程化 → 串口</Pill></div>
        固件烧录与 REPL；WS2812 点灯；<code>common/</code> 公共模块 + <code>deploy.py</code> 一键部署；
        串口行协议与 <code>DATA</code> 心跳。
      </Card>
      <Card title="网络（6–7 周）" icon={Wifi}>
        <div className="mb-2"><Pill tone="brand">WiFi / TCP / 排障</Pill></div>
        STA 联网、TCP 客户端、<code>HELLO</code> 注册；用 Windows 转发器打通 LAN → WSL，
        按"物理 → 网络 → 端口 → 应用"分层排障。
      </Card>
      <Card title="ROS 2（8–14 周）" icon={Server}>
        <div className="mb-2"><Pill tone="brand">节点 / 话题 / 桥接 / 界面</Pill></div>
        节点、话题、消息、<code>colcon</code> 入门；桥接节点开发；样式 CRUD、轮播与并行混合；
        Web 控制台联调。
      </Card>
      <Card title="项目（15–16 周）" icon={Rocket}>
        <div className="mb-2"><Pill tone="brand">方案 → 实现 → 验收 → 答辩</Pill></div>
        选题（双板协同交通灯 / 阈值报警灯 / 呼叫值班灯 / 舞台灯光秀 / 自拟）；2–3 人一组，
        每人至少负责一个模块。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>11 个实验嵌入各周，全部当堂验收（功能演示 + 1–2 个原理问答）。</Quote>
    </div>
  </Frame>
);

const Hardware = () => (
  <Frame kicker="概览" floor="03" title="三块板 + 一块驱动桥：角色分工" wide>
    <DataTable
      head={["板", "硬件", "固件 / 烧录", "角色"]}
      rows={[
        [
          <b key="g">green / blue</b>,
          "ESP32-S3 N16R8（16 MB Flash / 8 MB PSRAM），板载 WS2812 接 GPIO48",
          "MicroPython 完整镜像烧 0x0（CH343 串口，115200）",
          "主教学板：默认绿 / 蓝闪烁，样式与指令的实操对象",
        ],
        [
          <b key="x">xrs 掌机</b>,
          "ESP32-WROVER-B + ST7735S 128×160 屏，无 WS2812",
          "MicroPython 烧 0x1000（经典 ESP32 偏移）",
          "屏上显示“虚拟 LED”；6 个按键（上/下/左/右/A/B）可本地或网络操作",
        ],
        [
          <b key="d">GD32 桥（1 drvboard）</b>,
          "USB 串口桥，VID 28E9（设备名“USB 串行设备”）",
          "无固件可烧，只作通道",
          "掌机的部署与调试通道；deploy.py 自动识别并改走友好 REPL",
        ],
      ]}
    />
    <div className="mt-4">
      <Quote>S3 板烧 0x0、掌机烧 0x1000——这是课程第 1 周的第一个坑，烧错偏移板子不启动。</Quote>
    </div>
  </Frame>
);

const Architecture = () => (
  <Frame
    kicker="概览"
    floor="04"
    title="数据链路：板主动连出，浏览器收口"
    lead="板子是 TCP 客户端，主动连出（天然穿 NAT）；ROS 2 跑在 WSL 里，用 Windows 转发器解决入站限制。"
    wide
  >
    <div className="space-y-4">
      <div className="mx-auto w-full max-w-[52rem]">
        <ArchFlow />
      </div>
      <div className="grid gap-x-8 gap-y-2.5 md:grid-cols-2">
        {[
          ["板 → Windows", "WiFi/TCP :6000，连接即 HELLO 注册，DATA 心跳每 4 秒一次。"],
          ["Windows → WSL", "tcp_forwarder 把 :6000 转到 WSL :6001，绕开 Hyper-V 的入站拦截。"],
          ["WSL ROS 2", "wifi_server 把行转成话题；relay 做板间转发；led_ui 提供页面。"],
          ["浏览器 → led_ui :8080", "HTTP 页面下发指令，并用心跳显示每块板的在线状态。"],
        ].map(([t, d], i) => (
          <div key={i} className="flex gap-3 text-[0.9rem] leading-relaxed text-slateink md:text-[0.95rem]">
            <span className="mt-[0.15rem] grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-50 text-[0.72rem] font-bold text-brand-700">
              {i + 1}
            </span>
            <span>
              <b className="text-ink">{t}</b>：{d}
            </span>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

const ThreeLayers = () => (
  <Frame kicker="课程内容" floor="05" title="教学主线：设备层 → 通信层 → 系统层">
    <Grid cols={3}>
      <Card title="设备层（1–4 周）" icon={Cpu}>
        微控制器怎么跑程序、控硬件：GPIO 数字输出、WS2812 可寻址 RGB、MicroPython
        （固件 / REPL / <code>boot.py</code> / <code>main.py</code>）与一键部署脚本。
      </Card>
      <Card title="通信层（5–7 周）" icon={Network}>
        设备怎么组网换数据：串口作为调试通道、行协议设计、心跳与断线重连、
        TCP 客户端—服务器模型、分层排障方法。
      </Card>
      <Card title="系统层（8–14 周）" icon={Boxes}>
        怎么融入机器人软件框架：ROS 2 节点 / 话题 / 消息、<code>colcon</code> 工作空间、
        桥接节点、样式算法（轮播 / 混合）与 Web 人机界面。
      </Card>
    </Grid>
    <div className="mt-6 space-y-3">
      <Quote>"一颗灯能否同时播放多种样式？"——从物理限制到时间复用，学生走一遍完整的工程思维链。</Quote>
      <p className="text-[0.88rem] leading-relaxed text-muted md:text-[0.95rem]">
        每层都落到可验收的小任务；每个实验设"基础验收 + 拓展任务"，快慢学生各有目标。
      </p>
    </div>
  </Frame>
);

const Protocol = () => (
  <Frame kicker="课程内容" floor="06" title="协议：一行一条消息，全是人话" wide>
    <div className="space-y-4">
      <DataTable
        head={["方向", "示例", "说明"]}
        rows={[
          ["板 → 服务器", <code key="h">HELLO GREEN</code>, "连接即注册；板名就是身份（green / blue / xrs）"],
          ["板 → 服务器", <code key="d">DATA GREEN 42</code>, "每 4 秒心跳，序号递增；页面按超时 10 秒判在线"],
          ["服务器 → 板", <code key="s">STYLE SET red 255 0 0 120 blink</code>, "保存样式（不改当前闪烁）"],
          ["服务器 → 板", <code key="p">PLAY red blue</code> / <code key="m">MIX red blue</code>, "顺序轮播 / 并行混合"],
          ["服务器 → 板", <code key="c">COLOR 255 0 0</code> / <code key="r">RESET</code>, "快捷改色 / 恢复默认闪烁"],
        ]}
      />
      <Grid cols={2}>
        <Card title="为什么用行文本" icon={Terminal}>
          串口可读、可手工测试、板书友好；一行一条、以 <code>\n</code> 结束、空格分字段——
          教学阶段比二进制协议更容易建立直觉。
        </Card>
        <Card title="断线自愈是标配" icon={RotateCcw}>
          发送/接收出错就丢弃连接，每 4 秒重连一次；服务器重启后板子约 12 秒内自动恢复，
          不需要人工复位。
        </Card>
      </Grid>
    </div>
  </Frame>
);

const StyleAndMix = () => (
  <Frame kicker="课程内容" floor="07" title="两个设计问题，就是两节算法课" wide>
    <Grid cols={2}>
      <Card title="保存与应用分离" icon={Palette}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li><code>STYLE SET</code> 只保存，<code>STYLE USE</code> 才切换；</li>
          <li><code>default</code> 不可删除、不可覆盖——原始闪烁永不丢；</li>
          <li>来源：真实用户反馈"加样式后原来的闪烁没了"（其实是保存即切换）。</li>
        </ul>
      </Card>
      <Card title="单灯怎么同时播放多样式" icon={Gauge}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>物理上做不到：WS2812 任一时刻只显示一种颜色；</li>
          <li>把样式看作时间函数 <code>f(t)</code>，以 <b>20 ms</b> 为最小间隔采样合成；</li>
          <li>亮灭取 OR、颜色通道相加截断——红蓝重叠的时段显紫。</li>
        </ul>
      </Card>
    </Grid>
    <div className="mt-4 space-y-3">
      <Pre>{`lit   = (t // period) % 2 == 0        # 每条样式的瞬时状态
mix   = min(255, Σ 亮着的样式 RGB)   # 合成：OR 取亮灭，RGB 相加截断`}</Pre>
      <Quote>从物理限制 → 数学建模 → 近似实现 → 代价评估（20 ms 采样 CPU / 内存可忽略），一步不缺。</Quote>
    </div>
  </Frame>
);

const RosBridge = () => (
  <Frame kicker="课程内容" floor="08" title="ROS 2 侧：三个节点各司其职" wide>
    <div className="space-y-4">
      <Grid cols={3}>
        <Card title="wifi_server" icon={Server}>
          监听 WSL <code>:6001</code>，等 <code>HELLO</code> 注册；每行数据发布到{" "}
          <code>/board/板名/rx</code>，订阅 <code>/board/板名/tx</code> 后写回板子。
        </Card>
        <Card title="relay" icon={Send}>
          把 <code>DATA</code> 心跳改写成 <code>FROM 板名 seq</code>、掌机按键改写成{" "}
          <code>EVENT</code> 转发给其他板——两板串口上互相可见。
        </Card>
        <Card title="led_ui" icon={MonitorSmartphone}>
          Web 控制台 <code>:8080</code>：样式编辑、轮播、混合、在线状态与 RX 日志；
          默认只绑本机地址。
        </Card>
      </Grid>
      <Pre>{`ros2 topic list                        # /board/green/rx、/board/green/tx、/board/blue/…、/board/xrs/…
ros2 topic pub --once /board/green/tx std_msgs/String "{data: 'COLOR 255 0 0'}"
ros2 topic echo /board/green/rx        # 心跳 DATA GREEN … 与 STYLE-OK / STYLE-ERR 应答`}</Pre>
      <Steps title="展开：led_ui 页面操作清单（完整）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>看两块板的在线状态徽标；拔掉一块板 10 秒后应显示"离线"。</li>
          <li>新建样式（名字 + RGB + 周期 + solid/blink）→ 点"保存样式"→ 确认当前闪烁未变。</li>
          <li>点该样式的"应用"→ 灯切换；点"恢复默认"→ 回到原始绿/蓝闪烁。</li>
          <li>勾选 2–3 条样式 →"轮播所选"→"停止轮播"。</li>
          <li>勾选 2 条 →"混合所选"→"停止混合"，观察合成颜色。</li>
          <li>开发者工具 Network 面板可见响应头 <code>Cache-Control: no-store</code>（缓存坑的修复）。</li>
        </ol>
      </Steps>
    </div>
  </Frame>
);

const Method = () => (
  <Frame kicker="课程内容" floor="09" title="怎么教：现象先行 + 故障驱动">
    <Grid cols={2}>
      <Card title="现象先行" icon={Lightbulb}>
        每节课的第一次演示一定是"能看 / 能玩"的结果，原理放在现象之后；单次连续讲授不超过 15 分钟。
      </Card>
      <Card title="结对编程" icon={Users}>
        两人一组，每 20–30 分钟轮换"操作者 / 记录者"；每个实验设基础验收与拓展任务。
      </Card>
      <Card title="故障驱动" icon={AlertTriangle} tone="warn">
        有意制造安全的小故障（拔网线、杀服务器、写错端口），让学生按分层法定位；报错就是教学素材。
      </Card>
      <Card title="真实案例库" icon={BookOpen}>
        9 个来自开发日志的案例：板子"没有 Python"、<code>mpremote</code> 首次必失败、
        服务器重启板子掉线、页面"每刷新一次多一条样式"、保存覆盖闪烁……
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>巡场技巧：先看灯、再看日志、最后问代码——80% 的问题，日志里已经写明了原因。</Quote>
    </div>
  </Frame>
);

const Labs = () => (
  <Frame kicker="课程内容" floor="10" title="11 个实验，全部当堂验收" wide>
    <DataTable
      head={["实验", "周次", "核心能力"]}
      widths={["44%", "14%", "42%"]}
      rows={[
        ["一 · 环境搭建与固件烧录", "1–2", "工具链、串口识别、烧录与 REPL"],
        ["二 · 点亮板载 RGB 与串口标识", "2–3", "GPIO / WS2812、程序部署"],
        ["三 · MicroPython 编程与自定义闪烁", "3", "变量 / 循环 / 函数 / 时间控制"],
        ["四 · 工程化组织与一键部署", "4", "模块化、脚本部署、git 初步"],
        ["五 · 串口心跳与协议初识", "5", "串口监视、心跳、行协议"],
        ["六 · WiFi 联网与 TCP 通信", "6", "联网、socket、HELLO 注册"],
        ["七 · 网络链路排障与转发器", "7", "分层排障、转发链路"],
        ["八 · ROS 2 工作空间与话题", "8–9", "colcon 构建、话题收发"],
        ["九 · 桥接节点解析与 LED 控制", "10–11", "桥接走读、指令、扩展开发（PING/PONG）"],
        ["十 · 样式管理、轮播与并行混合", "12–13", "样式 CRUD、时间合成"],
        ["十一 · Web 控制台与人机交互", "14", "HTTP / REST、联调与体验设计"],
      ]}
    />
  </Frame>
);

const TeacherPrep = () => (
  <Frame kicker="实施" floor="11" title="开课前：清单化准备">
    <Grid cols={2}>
      <Card title="环境镜像（提前一周）" icon={Wrench}>
        Windows 10/11 + Python 3.10+（<code>esptool</code> / <code>mpremote</code>）、
        WSL2 Ubuntu 24.04 + ROS 2 Jazzy；教师机先验证 <code>colcon build</code> 可离线通过。
      </Card>
      <Card title="硬件与网络" icon={Wifi}>
        每组 2 块 S3 板 + 2 根数据线 + 独立热点 / 小路由器（2.4 GHz，关 AP 隔离）；
        另备 1–2 块备用板与备用线。
      </Card>
      <Card title="每节课前 5 分钟" icon={ListChecks}>
        端口识别（CH343）；板子不在 REPL；转发器与 <code>ros2 launch</code> 在跑；
        教师机 IP 未变——变了就更新 <code>SERVER_IP</code> 并重新部署。
      </Card>
      <Card title="安全红线" icon={ShieldCheck} tone="warn">
        3.3V 逻辑，严禁外接 5V 信号直连 GPIO；防静电；练习亮度 ≤ 100；
        WiFi 密码不投屏、不截图、不提交；控制页面默认只绑本机。
      </Card>
    </Grid>
  </Frame>
);

const FirstLab = () => (
  <Frame kicker="实施" floor="12" title="实验一：从探测到 REPL，一条命令都不能错" wide>
    <div className="space-y-4">
      <Pre>{`python -m pip install esptool mpremote            # 每台电脑一次

python -m esptool --port COM13 --baud 460800 flash-id        # 探测：应显示 ESP32-S3、16MB
python -m esptool --port COM13 --baud 460800 erase-flash
python -m esptool --port COM13 --baud 460800 write-flash -z 0x0 \\
  "教学demo/ESP32-ROS2-LED协同系统/firmware/GENERIC_S3-20220618-v1.19.1.bin"

python -m mpremote connect COM13                  # 进入 REPL：print("hello esp32")`}</Pre>
      <Steps title="展开：实验一完整步骤与常见问题">
        <ol className="list-decimal space-y-2 pl-5">
          <li>装工具：<code>python -m pip install esptool mpremote</code>，<code>python -m esptool version</code> 验证。</li>
          <li>插板，设备管理器找 "CH343" 对应端口（或用 <code>python -m mpremote devs</code>）。</li>
          <li><code>flash-id</code> 读芯片：应看到 ESP32-S3、16MB Flash、MAC。</li>
          <li>观察出厂固件：串口 115200 每 1.5 秒一行 <code>example: log -&gt; UART</code>，Ctrl-C 无 REPL。</li>
          <li>烧录三步：擦除 → <code>write-flash -z 0x0 &lt;厂商完整镜像&gt;</code> → 复位进 REPL。</li>
          <li>REPL 里执行 <code>print("hello esp32")</code> 与 <code>import sys; print(sys.implementation)</code>。</li>
        </ol>
        <DataTable
          head={["现象", "原因", "处理"]}
          rows={[
            [<code key="1">could not open port</code>, "端口被占用 / 号写错", "关闭 Thonny、串口助手后重试"],
            ["could not enter raw repl", "mpremote 首次连接偶发", "等 2 秒重试一次，不是硬件故障"],
            ["烧录后无输出", "未复位", <code key="2">python -m mpremote connect COMx reset</code>],
            ["写固件报地址错误", "用错偏移", "完整镜像必须烧 0x0，不是 0x1000"],
          ]}
        />
      </Steps>
      <p className="text-[0.88rem] leading-relaxed text-muted md:text-[0.95rem]">
        验收点：提交 <code>flash-id</code> 输出截图 + REPL 打印出 MicroPython 版本号。
        固件随课程包分发（<code>教学demo/…/firmware/</code>），无需再找厂商压缩包。
      </p>
    </div>
  </Frame>
);

const Assessment = () => (
  <Frame kicker="实施" floor="13" title="考核：能力本位，不设期末闭卷" wide>
    <div className="space-y-4">
      <DataTable
        head={["考核项目", "比例", "说明"]}
        rows={[
          ["平时表现", "20%", "考勤 5% + 课堂任务（⭐ 验收点累计）10% + 团队协作 5%"],
          ["实验考核", "40%", "11 次实验当堂验收 + 实验记录；每次功能 2.5 分 + 记录问答 1.5 分，可加分"],
          ["综合项目", "40%", "方案 10% + 功能演示 20%（教师 70% + 组间互评 30%）+ 答辩与报告 10%"],
        ]}
      />
      <Grid cols={2}>
        <Card title="项目选题（参考）" icon={ListChecks}>
          A 双板协同交通灯 / B 阈值报警灯 / C 呼叫值班灯 / D 舞台灯光秀 / E 自拟（须教师审核）；
          必须包含板端样式 + ROS 2 话题通信，并至少一个自己扩展的功能点。
        </Card>
        <Card title="学术诚信" icon={ShieldCheck} tone="warn">
          允许查官方文档、开源代码与讨论，但必须能解释自己提交的每一行代码；
          抄袭且无法解释、记录编造数据、报告虚构分工——当次记 0 分。
        </Card>
      </Grid>
      <Quote>总评 ≥90 优秀 / 80–89 良好 / 70–79 中等 / 60–69 及格；补做封顶 3 分。</Quote>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame kicker="收尾" floor="14" title="材料下载与位置" wide>
    <Grid cols={2}>
      <Card title="一键下载：课程包 + 代码 + 固件" icon={Download}>
        <p>
          随本 deck 附{" "}
          <a className="underline break-all" href="./files/ESP32与ROS2课程包与代码.zip">
            files/ESP32与ROS2课程包与代码.zip
          </a>
        </p>
        <p className="mt-2 text-muted">
          含课程标准 / 16 周单元设计 / 11 个实验指导 / 考核方案 / 教师手册；
          <code>common</code>、<code>green</code>、<code>blue</code>、<code>xrs</code>、
          <code>tools</code>、<code>ros2_ws</code> 与两块板的 MicroPython 固件。
        </p>
      </Card>
      <Card title="工作区内的位置" icon={FolderTree}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>课程包：<code>培训/ESP32与ROS2开发基础课程包/</code></li>
          <li>工程代码：<code>教学demo/ESP32-ROS2-LED协同系统/</code></li>
          <li>文字版（架构 / 协议 / 排障）：<code>docs/ESP32与ROS2开发基础.md</code></li>
        </ul>
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        本 deck 可直接双击播放；相邻主题：<code>ESP32-S3电机驱动板</code>、
        <code>ESP32-S3接入micro-ROS</code>（机器人控车路线）、
        <code>ROS2与micro-ROS选型</code>（WSL 跨机验证）。
      </Card>
      <Card title="安全提示：密钥不随包" icon={ShieldCheck} tone="warn">
        <code>wifi_config.py</code> 含真实 WiFi 密码，不随包分发；下载包里用{" "}
        <code>common/wifi_config.example.py</code> 模板复制后填写。
      </Card>
    </Grid>
  </Frame>
);

const Wrap = () => (
  <Frame kicker="收尾" floor="15" title="记住这三层，然后往哪走">
    <div className="space-y-5">
      <Quote>板子会编程、消息会跑通、系统会搭起来——这门课把"嵌入式设备接入机器人框架"完整走了一遍。</Quote>
      <Grid cols={3}>
        <Card title="三个层次" icon={Layers}>
          设备层 → 通信层 → 系统层；走到系统层，才真正理解嵌入式与 ROS 2 的关系。
        </Card>
        <Card title="课程落地" icon={Rocket}>
          48 学时 / 16 周 / 11 实验 / 1 个小组作品；材料齐全，按实验指导可完整复现。
        </Card>
        <Card title="延续一：传感器" icon={Activity}>
          DHT11 / 超声波 / 光敏 → 把物理量映射为颜色或频率（I2C / ADC 入门）。
        </Card>
        <Card title="延续二：ROS 2 深入" icon={Server}>
          自定义消息、服务 / 动作、<code>rqt</code> 可视化、Nav2 入门。
        </Card>
        <Card title="延续三：竞赛" icon={Trophy}>
          嵌入式设计竞赛、机器人大赛、物联网创新赛——本课作品可直接作为参赛原型。
        </Card>
        <Card title="继续练" icon={Puzzle}>
          把 <code>MIX</code> 的合成规则改成"平均"或"取最大"；给 <code>led_ui</code> 加"一键灯效"按钮。
        </Card>
      </Grid>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "课程定位", group: "概览", el: <Position /> },
  { nav: "课程主线", group: "概览", el: <Roadmap /> },
  { nav: "硬件与角色", group: "概览", el: <Hardware /> },
  { nav: "系统架构", group: "概览", el: <Architecture /> },
  { nav: "三层教学", group: "课程内容", el: <ThreeLayers /> },
  { nav: "通信协议", group: "课程内容", el: <Protocol /> },
  { nav: "样式与混合", group: "课程内容", el: <StyleAndMix /> },
  { nav: "ROS 2 桥接", group: "课程内容", el: <RosBridge /> },
  { nav: "教学方法", group: "课程内容", el: <Method /> },
  { nav: "实验一览", group: "课程内容", el: <Labs /> },
  { nav: "教师准备", group: "实施", el: <TeacherPrep /> },
  { nav: "第一次上机", group: "实施", el: <FirstLab /> },
  { nav: "考核方案", group: "实施", el: <Assessment /> },
  { nav: "下载与材料", group: "收尾", el: <Downloads /> },
  { nav: "小结与下一步", group: "收尾", el: <Wrap /> },
];

export default slides;
