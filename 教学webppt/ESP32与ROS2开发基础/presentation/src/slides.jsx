import React from "react";
import {
  Activity,
  AlertTriangle,
  Ban,
  BookOpen,
  Bot,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
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
  Rocket,
  RotateCcw,
  Scale,
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

/* 链路全景：开发环境 ↔ 开发板 ↔ ROS 2 系统（内联 SVG，标注工具链与数据流，不用 ASCII / 线框图） */
const LinkPanorama = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 1120 440"
      role="img"
      aria-label="开发环境与三层链路全景：顶部开发机工具链经 USB 串口烧录部署板子；板子作 TCP 客户端经 WiFi 连出，tcp_forwarder 把 :6000 转到 WSL :6001，wifi_server 把行转成话题，relay 做板间转发，led_ui 提供 Web 控制台，浏览器经 HTTP :8080 下发指令；底部三层主线：设备层 → 通信层 → 系统层"
      className="h-auto w-full"
    >
      <defs>
        <marker id="lp-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="lp-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="lp-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      {/* 顶部：开发环境（工具链） */}
      <rect x="10" y="34" width="1100" height="66" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="26" y="56" fill="#0f172a" fontSize="12.5" fontWeight="700">开发环境 · Windows（工具链）</text>
      <text x="26" y="76" fill="#475569" fontSize="10.5">
        esptool / mpremote（烧录固件 · 进 REPL）· tools/deploy.py（一键部署：公共模块 + 板级 main.py）· 代码编辑器
      </text>
      <text x="26" y="92" fill="#64748b" fontSize="10">
        python -m esptool … write-flash -z 0x0 · python -m mpremote connect COMx — 工具作用于板子，不参与运行时数据流
      </text>
      <line x1="150" y1="100" x2="150" y2="124" stroke="#b4690e" strokeWidth="2" markerEnd="url(#lp-amber)" />
      <text x="160" y="118" fill="#b4690e" fontSize="9.5">USB 串口 115200</text>

      {/* ① 板端 */}
      <rect x="10" y="126" width="270" height="216" rx="14" fill="#f0fdfa" stroke="#5eead4" />
      <text x="26" y="148" fill="#0f766e" fontSize="12.5" fontWeight="700">开发板 · MicroPython（设备层）</text>
      <rect x="22" y="160" width="246" height="50" rx="8" fill="#ffffff" stroke="#99f6e4" />
      <text x="36" y="181" fill="#0f172a" fontSize="11" fontWeight="700">green · ESP32-S3</text>
      <text x="36" y="197" fill="#475569" fontSize="10">WS2812 @ GPIO48（可寻址 RGB）</text>
      <rect x="22" y="216" width="246" height="50" rx="8" fill="#ffffff" stroke="#99f6e4" />
      <text x="36" y="237" fill="#0f172a" fontSize="11" fontWeight="700">blue · ESP32-S3</text>
      <text x="36" y="253" fill="#475569" fontSize="10">WS2812 @ GPIO48（可寻址 RGB）</text>
      <rect x="22" y="272" width="246" height="58" rx="8" fill="#ffffff" stroke="#99f6e4" />
      <text x="36" y="293" fill="#0f172a" fontSize="11" fontWeight="700">xrs · 学而思掌机</text>
      <text x="36" y="309" fill="#475569" fontSize="10">ST7735S 128×160 虚拟 LED</text>
      <text x="36" y="324" fill="#64748b" fontSize="9.5">（GD32 桥部署）</text>

      {/* ② 开发机 · Windows 转发 */}
      <rect x="320" y="126" width="240" height="216" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="336" y="148" fill="#0f172a" fontSize="12.5" fontWeight="700">开发机 · Windows（转发）</text>
      <rect x="332" y="160" width="216" height="92" rx="8" fill="#ffffff" stroke="#e2e8f0" />
      <text x="346" y="182" fill="#0f172a" fontSize="11" fontWeight="700">tcp_forwarder.py</text>
      <text x="346" y="200" fill="#475569" fontSize="10">监听 0.0.0.0:6000</text>
      <text x="346" y="216" fill="#475569" fontSize="10">转发到 WSL 127.0.0.1:6001</text>
      <text x="346" y="236" fill="#64748b" fontSize="9.5">WSL 镜像网络拦 LAN 入站，靠它打通</text>
      <text x="336" y="276" fill="#64748b" fontSize="10">SERVER_IP = 本机局域网 IP（不是 WSL）</text>
      <text x="336" y="296" fill="#64748b" fontSize="10">板子主动连出，天然绕开 NAT</text>
      <text x="336" y="322" fill="#1a5cae" fontSize="10" fontWeight="700">先起转发器，再插板</text>

      {/* ③ ROS 2 系统 */}
      <rect x="600" y="126" width="260" height="216" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="616" y="148" fill="#1a5cae" fontSize="12.5" fontWeight="700">ROS 2 系统 · WSL2 Jazzy</text>
      <text x="616" y="164" fill="#64748b" fontSize="9.5">colcon 构建 · ros2 launch board_bridge</text>
      <rect x="612" y="172" width="236" height="48" rx="8" fill="#ffffff" stroke="#bfe1fd" />
      <text x="626" y="192" fill="#0f172a" fontSize="11" fontWeight="700">wifi_server</text>
      <text x="626" y="208" fill="#64748b" fontSize="9.5">TCP 行 ↔ 话题 /board/&lt;板名&gt;/rx · /tx</text>
      <rect x="612" y="226" width="236" height="48" rx="8" fill="#ffffff" stroke="#bfe1fd" />
      <text x="626" y="246" fill="#0f172a" fontSize="11" fontWeight="700">relay</text>
      <text x="626" y="262" fill="#64748b" fontSize="9.5">DATA→FROM · KEY→EVENT（板间转发）</text>
      <rect x="612" y="280" width="236" height="48" rx="8" fill="#ffffff" stroke="#bfe1fd" />
      <text x="626" y="300" fill="#0f172a" fontSize="11" fontWeight="700">led_ui</text>
      <text x="626" y="316" fill="#64748b" fontSize="9.5">Web 控制台 :8080（样式 · 轮播 · 混合）</text>

      {/* ④ 浏览器 */}
      <rect x="900" y="180" width="210" height="70" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="916" y="204" fill="#0f172a" fontSize="12" fontWeight="700">浏览器（人机界面）</text>
      <text x="916" y="222" fill="#475569" fontSize="10">下发指令 · 显示每块板在线状态</text>
      <text x="916" y="240" fill="#64748b" fontSize="9.5">超时 10 s 判离线</text>

      {/* 数据流箭头 */}
      <line x1="280" y1="206" x2="318" y2="206" stroke="#0d9488" strokeWidth="2" markerEnd="url(#lp-teal)" />
      <text x="299" y="188" textAnchor="middle" fill="#0f766e" fontSize="8.5">WiFi/TCP</text>
      <text x="299" y="198" textAnchor="middle" fill="#0f766e" fontSize="8.5">:6000 行协议</text>
      <line x1="560" y1="206" x2="598" y2="206" stroke="#0d9488" strokeWidth="2" markerEnd="url(#lp-teal)" />
      <text x="579" y="188" textAnchor="middle" fill="#0f766e" fontSize="8.5">WSL</text>
      <text x="579" y="198" textAnchor="middle" fill="#0f766e" fontSize="8.5">:6001</text>
      <line x1="860" y1="206" x2="898" y2="206" stroke="#0d9488" strokeWidth="2" markerEnd="url(#lp-teal)" />
      <text x="879" y="188" textAnchor="middle" fill="#0f766e" fontSize="8.5">HTTP</text>
      <text x="879" y="198" textAnchor="middle" fill="#0f766e" fontSize="8.5">:8080</text>

      {/* 底部：三层主线 */}
      <rect x="10" y="356" width="1100" height="72" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="26" y="380" fill="#0f172a" fontSize="11.5" fontWeight="700">三层链路（全课主线）</text>
      <text x="26" y="402" fill="#475569" fontSize="10.5">
        设备层（GPIO / WS2812 · MicroPython）→ 通信层（WiFi / TCP / 行协议 / 心跳）→ 系统层（ROS 2 节点 / 话题 / 桥接 / 页面）
      </text>
      <text x="26" y="418" fill="#64748b" fontSize="10">教学顺序 = 数据流方向：板子先会跑、消息再会通、最后接进系统。</text>
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
      职业本科 48 学时软硬件入门课程：三块板（绿 / 蓝 ESP32-S3 + 学而思掌机）经 WiFi/TCP
      接入 WSL 里的 ROS 2，用 Web 控制台管理灯效——设备层 → 通信层 → 系统层一条主线走通；
      另备短平快版：1 天集中教学 + 3–4 天自学（约 30 学时），随附学生学习手册与 AI 辅助开发方法。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」看完整命令与全量清单，深度材料见收尾下载。
    </p>
  </div>
);

const Tldr = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="结论先行：一门课把「点灯 → 联网 → 接入 ROS 2」走成一条链"
    lead="这门课不是讲原理，是带你从头搭出一条能演示的真实链路；知识点全部挂在这条链上。"
  >
    <Grid cols={3}>
      <Card title="为什么值得" icon={Target} tone="good">
        三个层次一次打通：设备层会编程、通信层会联网、系统层会接入 ROS 2——嵌入式与机器人框架的关系亲手走一遍。
      </Card>
      <Card title="怎么学" icon={Wrench}>
        现象先行、任务驱动：每次课先看到「灯亮了 / 消息通了 / 页面动起来了」，再讲背后的原理。
      </Card>
      <Card title="两套上法" icon={Scale}>
        系统学期版（16 周 / 48 学时）与短平快版（1 天 + 3–4 天自学，约 30 学时）——按人群与学时选，见「对比决策」。
      </Card>
    </Grid>
    <div className="mt-4">
      <Grid cols={3}>
        <Card title="课程尺码" icon={CalendarDays}>
          3 学分 / 48 学时 / 16 周 / 11 个实验 / 1 个小组作品。
        </Card>
        <Card title="主线项目" icon={Lightbulb}>
          LED 协同控制系统：三块板 + ROS 2 桥接 + Web 控制台，所有知识点围绕它推进。
        </Card>
        <Card title="链路三层" icon={Layers}>
          设备层 → 通信层 → 系统层，一层一个可验收的能力。
        </Card>
      </Grid>
    </div>
    <div className="mt-6">
      <Quote>终点很清楚：你能独立走通 ROS 2 应用流程，并在教师监督下用 AI 工具完成一次真实的算法改造。</Quote>
    </div>
  </Frame>
);

const Position = () => (
  <Frame kicker="概览" floor="02" title="课程定位：面向大一新手，重动手、不追底层理论">
    <Grid cols={3}>
      <Card title="给谁" icon={GraduationCap}>
        职业本科一年级：电子信息、物联网、机器人、智能制造、计算机等专业；先修计算机应用基础。
      </Card>
      <Card title="体量" icon={CalendarDays}>
        3 学分 / 48 学时（16 周 × 3 学时）；每周建议 45 分钟讲解演示 + 90 分钟动手实践。
      </Card>
      <Card title="学习目标" icon={Target}>
        会装、会写、会连、会调、会做；五个动词一个个当堂验收。
      </Card>
      <Card title="产出" icon={CheckCircle2} tone="good">
        小组作品（板端样式 + ROS 2 话题 + 控制台），现场演示 + 答辩，可直接作竞赛原型。
      </Card>
      <Card title="门槛" icon={Wrench}>
        有基础 Python（能读代码、改参数）即可；不需要 C 语言或电路基础。
      </Card>
      <Card title="不做什么" icon={Ban} tone="warn">
        不追求芯片底层与算法理论的深度——把「能跑通一条完整链路」放在第一位。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>定位一句话：不培养芯片专家，培养能把设备接进机器人系统、并让它稳定跑起来的人。</Quote>
    </div>
  </Frame>
);

const Roadmap = () => (
  <Frame kicker="概览" floor="03" title="16 周只做一件事：把一条链从底层搭到系统层" wide>
    <Grid cols={2}>
      <Card title="基础（1–5 周）" icon={Wrench}>
        <div className="mb-2"><Pill tone="brand">环境与固件 → 点灯 → 工程化 → 串口</Pill></div>
        固件烧录与 REPL；WS2812 点灯；<code>common/</code> 公共模块 + <code>deploy.py</code> 一键部署；
        串口行协议与 <code>DATA</code> 心跳。
      </Card>
      <Card title="网络（6–7 周）" icon={Wifi}>
        <div className="mb-2"><Pill tone="brand">WiFi / TCP / 排障</Pill></div>
        STA 联网、TCP 客户端、<code>HELLO</code> 注册；用 Windows 转发器打通 LAN → WSL，
        按「物理 → 网络 → 端口 → 应用」分层排障。
      </Card>
      <Card title="ROS 2（8–14 周）" icon={Server}>
        <div className="mb-2"><Pill tone="brand">节点 / 话题 / 桥接 / 界面</Pill></div>
        节点、话题、消息与 <code>colcon</code> 工作空间入门；桥接节点开发；样式 CRUD、轮播与并行混合；
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
  <Frame kicker="概览" floor="04" title="三块板 + 一块驱动桥：硬件与角色各不相同" wide>
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
          "屏上显示「虚拟 LED」；6 个按键（上 / 下 / 左 / 右 / A / B）可本地或网络操作",
        ],
        [
          <b key="d">GD32 桥（1 drvboard）</b>,
          "USB 串口桥，VID 28E9（设备名「USB 串行设备」）",
          "无固件可烧，只作通道",
          "掌机的部署与调试通道；deploy.py 自动识别并改走友好 REPL",
        ],
      ]}
    />
    <div className="mt-4">
      <Quote>第 1 周的第一个坑：S3 板烧 0x0、掌机烧 0x1000，烧错偏移板子不启动。</Quote>
    </div>
  </Frame>
);

const Architecture = () => (
  <Frame
    kicker="概览"
    floor="05"
    title="链路全景：开发环境 ↔ 开发板 ↔ ROS 2 系统，板子主动连出"
    lead="两层关系要看区分开：工具链经 USB 串口作用于板子（开发期），板子经 WiFi/TCP 主动连出接进 ROS 2（运行期）。"
    wide
  >
    <div className="space-y-4">
      <div className="mx-auto w-full max-w-[62rem]">
        <LinkPanorama />
      </div>
      <div className="grid gap-x-8 gap-y-2.5 md:grid-cols-2">
        {[
          ["开发期：工具链烧录", "esptool 写固件、mpremote 进 REPL、deploy.py 上传公共模块与板级 main.py，再复位。"],
          ["板 → Windows", "板子是 TCP 客户端，主动连 WiFi/TCP :6000；连接即 HELLO 注册，DATA 心跳每 4 秒一次。"],
          ["Windows → WSL", "tcp_forwarder 把 :6000 转到 WSL :6001，绕开 Hyper-V 的入站拦截。"],
          ["WSL ROS 2 → 浏览器", "wifi_server 把行转成话题、relay 做板间转发、led_ui 提供页面；浏览器经 HTTP 下发指令并看在线状态。"],
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
      <Steps title="展开：四段链路的完整工具与参数">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            烧录与部署（USB 串口）：<code>esptool</code> 写固件（S3 烧 <code>0x0</code>、掌机烧{" "}
            <code>0x1000</code>），<code>deploy.py</code> 上传公共模块 + WiFi 配置 + 板级{" "}
            <code>main.py</code>，再单独复位。
          </li>
          <li>
            联网与注册（WiFi / TCP）：板子作 TCP 客户端主动连 <code>SERVER_IP:6000</code>；连接即发{" "}
            <code>HELLO</code> 注册，每 4 s 发 <code>DATA</code> 心跳（序号递增）。
          </li>
          <li>
            转发与桥接（WSL）：<code>tcp_forwarder</code> 把 <code>:6000</code> 转到 WSL{" "}
            <code>:6001</code>；<code>wifi_server</code> 把行转成话题{" "}
            <code>/board/&lt;板名&gt;/rx</code> 与 <code>/tx</code>，<code>relay</code> 做板间转发。
          </li>
          <li>
            系统与人机界面（HTTP）：<code>led_ui</code> 提供 Web 控制台 <code>:8080</code>，
            下发指令并按心跳显示在线状态（超时 10 s 判离线）。
          </li>
        </ol>
      </Steps>
    </div>
  </Frame>
);

const ThreeLayers = () => (
  <Frame kicker="教学主线" floor="06" title="教学主线：设备层 → 通信层 → 系统层，一层一个能力">
    <Grid cols={3}>
      <Card title="设备层（1–4 周）" icon={Cpu}>
        微控制器（MCU）怎么跑程序、控硬件：通用输入输出（GPIO）数字输出、
        可寻址 RGB 灯带（WS2812）、MicroPython（固件 / REPL / <code>boot.py</code> / <code>main.py</code>）
        与一键部署脚本。
      </Card>
      <Card title="通信层（5–7 周）" icon={Network}>
        设备怎么组网换数据：串口作为调试通道、行协议设计、心跳与断线重连、
        TCP 客户端—服务器模型、分层排障方法。
      </Card>
      <Card title="系统层（8–14 周）" icon={Boxes}>
        怎么融入机器人软件框架：ROS 2 节点（node）/ 话题（topic）/ 消息、
        <code>colcon</code> 工作空间（workspace）、桥接节点（bridge node）、样式算法（轮播 / 混合）与 Web 人机界面。
      </Card>
    </Grid>
    <div className="mt-6 space-y-3">
      <Quote>「一颗灯能否同时播放多种样式？」——从物理限制到时间复用，学生走一遍完整的工程思维链。</Quote>
      <p className="text-[0.88rem] leading-relaxed text-muted md:text-[0.95rem]">
        每层都落到可验收的小任务；每个实验设「基础验收 + 拓展任务」，快慢学生各有目标。
      </p>
    </div>
  </Frame>
);

const Protocol = () => (
  <Frame kicker="教学主线" floor="07" title="行协议（line protocol）：一行一条消息，全是人话" wide>
    <div className="space-y-4">
      <DataTable
        head={["方向", "示例", "说明"]}
        rows={[
          ["板 → 服务器", <code key="h">HELLO GREEN</code>, "连接即注册；板名就是身份（green / blue / xrs）"],
          ["板 → 服务器", <code key="d">DATA GREEN 42</code>, "每 4 秒心跳（heartbeat），序号递增；页面按超时 10 秒判在线"],
          ["服务器 → 板", <code key="s">STYLE SET red 255 0 0 120 blink</code>, "只保存样式，不改当前闪烁"],
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
          发送 / 接收出错就丢弃连接，每 4 秒重连一次；服务器重启后板子约 12 秒内自动恢复，
          不需要人工复位。
        </Card>
      </Grid>
      <Steps title="展开：完整指令集与语义">
        <DataTable
          head={["指令", "语义"]}
          widths={["46%", "54%"]}
          rows={[
            [
              <code key="a">STYLE SET &lt;name&gt; &lt;R&gt; &lt;G&gt; &lt;B&gt; &lt;PERIOD_MS&gt; [solid|blink]</code>,
              "只保存不改当前；default 受保护，不可覆盖 / 删除",
            ],
            [
              <code key="b">STYLE USE / DEL / LIST &lt;name&gt;</code>,
              "应用 / 删除 / 查询——查询回包以 STYLE-END &lt;n&gt; 结束",
            ],
            [<code key="c">PLAY &lt;name&gt; … / PLAY STOP</code>, "顺序轮播，每样式 4 个周期"],
            [
              <code key="d">MIX &lt;name&gt; … / MIX STOP</code>,
              "并行混合：20 ms 采样，亮灭取 OR、颜色通道相加截断",
            ],
            [<code key="e">LED / COLOR / PERIOD / PATTERN …</code>, "快捷编辑当前样式（不新建）"],
            [<code key="f">RESET</code>, "回本板默认闪烁，保留自定义样式"],
          ]}
        />
        <p>样式存 RAM，重启清空；default 永远健在，所以原始绿 / 蓝闪烁不会丢。</p>
      </Steps>
    </div>
  </Frame>
);

const StyleAndMix = () => (
  <Frame kicker="教学主线" floor="08" title="两个设计问题，就是两节算法课" wide>
    <Grid cols={2}>
      <Card title="保存与应用分离" icon={Palette}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li><code>STYLE SET</code> 只保存，<code>STYLE USE</code> 才切换；</li>
          <li><code>default</code> 不可删除、不可覆盖——原始闪烁永不丢；</li>
          <li>来源：真实用户反馈「加样式后原来的闪烁没了」（其实是保存即切换）。</li>
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
  <Frame kicker="教学主线" floor="09" title="ROS 2 侧：三个节点（node）各司其职" wide>
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
          <li>看两块板的在线状态徽标；拔掉一块板 10 秒后应显示「离线」。</li>
          <li>新建样式（名字 + RGB + 周期 + solid/blink）→ 点「保存样式」→ 确认当前闪烁未变。</li>
          <li>点该样式的「应用」→ 灯切换；点「恢复默认」→ 回到原始绿 / 蓝闪烁。</li>
          <li>勾选 2–3 条样式 →「轮播所选」→「停止轮播」。</li>
          <li>勾选 2 条 →「混合所选」→「停止混合」，观察合成颜色。</li>
          <li>开发者工具 Network 面板可见响应头 <code>Cache-Control: no-store</code>（缓存坑的修复）。</li>
        </ol>
      </Steps>
    </div>
  </Frame>
);

const Method = () => (
  <Frame kicker="教学方法" floor="10" title="怎么教：现象先行 + 故障驱动">
    <Grid cols={2}>
      <Card title="现象先行" icon={Lightbulb}>
        每节课的第一次演示一定是「能看 / 能玩」的结果，原理放在现象之后；单次连续讲授不超过 15 分钟。
      </Card>
      <Card title="结对编程" icon={Users}>
        两人一组，每 20–30 分钟轮换「操作者 / 记录者」；每个实验设基础验收与拓展任务。
      </Card>
      <Card title="故障驱动" icon={AlertTriangle} tone="warn">
        有意制造安全的小故障（拔网线、杀服务器、写错端口），让学生按分层法定位；报错就是教学素材。
      </Card>
      <Card title="真实案例库" icon={BookOpen}>
        9 个来自开发日志的案例：板子「没有 Python」、<code>mpremote</code> 首次必失败、
        服务器重启板子掉线、页面「每刷新一次多一条样式」、保存覆盖闪烁……
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>巡场技巧：先看灯、再看日志、最后问代码——80% 的问题，日志里已经写明了原因。</Quote>
    </div>
  </Frame>
);

const Labs = () => (
  <Frame kicker="教学方法" floor="11" title="11 个实验，全部当堂验收" wide>
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
  <Frame kicker="开课准备" floor="12" title="开课前：清单化准备，一项都不能漏">
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
  <Frame kicker="开课准备" floor="13" title="实验一：从探测到 REPL，一条命令都不能错" wide>
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
          <li>插板，设备管理器找「CH343」对应端口（或用 <code>python -m mpremote devs</code>）。</li>
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
  <Frame kicker="开课准备" floor="14" title="考核：能力本位，不设期末闭卷" wide>
    <div className="space-y-4">
      <DataTable
        head={["考核项目", "比例", "说明"]}
        rows={[
          ["平时表现", "20%", "考勤 5% + 课堂任务（验收点累计）10% + 团队协作 5%"],
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

const Decision = () => (
  <Frame
    kicker="对比决策"
    floor="15"
    title="两套上法怎么选：系统学期版 vs 短平快版"
    lead="同一门课有两种上法：16 周系统课打底，或 1 天集中 + 3–4 天自学速通。先看清取舍，再定上法。"
    wide
  >
    <div className="space-y-4">
      <DataTable
        head={["维度", "系统学期版（16 周 / 48 学时）", "短平快版（1 天 + 3–4 天 / 约 30 学时）"]}
        widths={["14%", "43%", "43%"]}
        rows={[
          ["适合人群", "职业本科一年级正课、有完整学期排课；要体系、要带班", "小学期、实训周、竞赛集训前快速入门；有基础 Python 即可"],
          ["内容纵深", "设备 → 通信 → 系统逐层展开，含 git 与固件内部结构", "保链路、减纵深：点灯编程压为「读懂 + 改参数」，删 git 与固件内部"],
          ["核心目标", "会装 / 会写 / 会连 / 会调 / 会做，覆盖全部知识点", "走通最小闭环 + 在教师监督下用 AI 做一次算法改造"],
          ["考核方式", "平时 20% + 实验 40% + 综合项目 40%", "验收清单 + 结课演示 + AI 使用记录核查"],
          ["主要产出", "11 个实验记录 + 1 个小组作品（现场演示 + 答辩）", "五个学习单元证据包 + 三个算法任务（至少完成一、二）"],
          ["主要风险", "周期长，需整学期排课与实验室机位", "学时不宽裕、删减多，自学自律要求高"],
        ]}
      />
      <Grid cols={2}>
        <Card title="什么时候选系统版" icon={Compass} tone="brand">
          要体系、要带班、要覆盖全部知识点，且有整学期排课与机位——选 48 学时正课，别压缩。
        </Card>
        <Card title="什么时候选短平快版" icon={Ban} tone="warn">
          只有几天、基础 Python 已会、目标就是走通闭环并改一次算法——选短平快版，别硬排 16 周。
        </Card>
      </Grid>
      <Quote>
        引导问题：你的场景是「整学期系统培养」，还是「几天内把闭环跑通并改一次算法」？先回答它，再决定上哪一套。
      </Quote>
    </div>
  </Frame>
);

const Intensive = () => (
  <Frame
    kicker="短课模式"
    floor="16"
    title="短平快版：1 天集中教学 + 3–4 天自学，约 30 学时"
    lead="把 48 学时改造成「最小闭环走通 + AI 监督下改算法」：教师用 06-短平快课程方案，学生用 07-学生学习手册（标记图例、知识讲解、验收清单与记录表都在手册里）。"
    wide
  >
    <Grid cols={3}>
      <Card title="给谁 / 场景" icon={GraduationCap}>
        职业本科的小学期、实训周、竞赛集训前的快速入门；有基础 Python（能读代码、改参数）即可。
      </Card>
      <Card title="两条硬目标" icon={Target}>
        ① 理解 ROS 2 应用流程：构建 → 启动 → 话题 → 桥接 → 界面，能脱稿复现全链路；
        ② 在教师监督下用 AI 工具完成本项目算法开发：能解释、能验证、有记录。
      </Card>
      <Card title="怎么砍：保链路、减纵深" icon={Wrench}>
        保留最小闭环（烧录 → 部署 → 联网 → 话题 → 页面）；点灯编程压缩为「读懂 + 改参数」；
        删除 git 与固件内部结构；样式体系升级为算法开发。
      </Card>
    </Grid>
    <div className="mt-6 space-y-3">
      <Quote>现象先行不变；新增 AI 全程带教——读 → 讲 → 改 → 验，AI 可以帮你写，解释和验证必须自己来。</Quote>
    </div>
  </Frame>
);

const DayOne = () => (
  <Frame kicker="短课模式" floor="17" title="第 1 天：8 学时把全链路集中走一遍" wide>
    <DataTable
      head={["时段（示例）", "环节", "内容", "验收点"]}
      widths={["15%", "17%", "42%", "26%"]}
      rows={[
        ["08:30–09:10", "环节一 · 开场与全景", "演示完整系统、画链路大图、讲清课程目标与安全保密要求", "能复述链路五环节与课程目标"],
        [
          "09:10–10:30",
          "环节二 · 烧录与部署",
          <span key="s2">
            <code>flash-id</code> → 擦写固件 → 进 REPL → <code>deploy.py</code> 双板部署；命令卡片贴桌
          </span>,
          "两块板按绿 / 蓝闪烁 + 串口板名标识",
        ],
        [
          "10:45–12:00",
          "环节三 · 联网与全链路",
          "填网络配置 → 转发器 → 构建 + 启动 → 两块板注册上线；故障注入看约 12 秒自动重连",
          "link up + registered + 亲眼看一次重连",
        ],
        [
          "13:30–14:45",
          "环节四 · ROS 2 应用流程",
          "命令行改色与复位；网页控制台六项操作；讲清「构建 → 启动 → 话题 → 桥接 → 界面」流程",
          "命令行改色成功；页面操作全过；说清 tx / rx 方向",
        ],
        ["15:00–16:05", "环节五 · AI 上手与代码走读", "用提示词模板让 AI 画调用链，对照源码核对并记录 AI 不准确处", "提交 1 条 AI 回答核对记录"],
        [
          "16:05–16:40",
          "环节六 · 任务发布与示范",
          <span key="s6">
            教师现场小改造（轮播「每样式 4 个周期」改 2 个）；发布三个任务与自学安排
          </span>,
          "能说出四步工作法与三条红线",
        ],
      ]}
    />
    <div className="mt-4">
      <Quote>节奏要诀：工具预装、命令卡片、卡壳超 10 分钟直接换备用板——课堂时间只花在链路上。</Quote>
    </div>
  </Frame>
);

const SelfStudy = () => (
  <Frame kicker="短课模式" floor="18" title="自学 3–4 天：每天一个任务，抽查证据" wide>
    <DataTable
      head={["时间", "主题", "学生完成", "教师抽查"]}
      widths={["14%", "24%", "42%", "20%"]}
      rows={[
        [
          "自学第 1 天",
          "独立复现与流程固化",
          "不看课堂记录，按手册单元一、二重做全链路并逐步留证据；改端口验证重建；断线重连观察；手绘数据流图",
          "证据包完整 + 抽查问答",
        ],
        [
          "自学第 2 天",
          "任务一：改造混合灯效算法",
          "读懂 composite()；「加权平均」或「逐通道取最大」二选一改造；先预测、后实测、做回归检查",
          "改动范围 + 预测解释 + AI 日志",
        ],
        [
          "自学第 3 天",
          "任务二：新增呼吸灯样式",
          "协议扩展 solid / blink / breathe；三角波亮度 + 显示分支；验收断言逐条过",
          "断言全过 + 解释亮度公式",
        ],
        [
          "弹性加练日（可选）",
          "任务三：双板交通灯协同",
          "板端按心跳切换，或 ROS 2 侧写调度节点；随后结课验收（演示 + 答辩 + AI 记录核查）",
          "连续 60 秒演示 + 终验评分",
        ],
      ]}
    />
    <div className="mt-4">
      <Quote>3 天制：取消弹性加练日、任务三转选做、结课验收并入自学第 3 天下午；进度快的完成任务一后直接进任务二。</Quote>
    </div>
  </Frame>
);

const AiWorkflow = () => (
  <Frame kicker="短课模式" floor="19" title="AI 监督开发：读 → 讲 → 改 → 验，红线不能碰" wide>
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="读 → 讲 → 改 → 验" icon={Bot}>
          <ol className="mt-1 list-decimal space-y-1.5 pl-5">
            <li>
              <b>读</b>：让 AI 给「文件:函数」调用链，人对照源码核对；
            </li>
            <li>
              <b>讲</b>：只让它出修改点清单（先不改代码），人审查选型；
            </li>
            <li>
              <b>改</b>：最小 diff，一次只动一个点，改动前留底；
            </li>
            <li>
              <b>验</b>：部署 / 构建 / 运行，按验收断言逐条打勾。
            </li>
          </ol>
        </Card>
        <Card title="三条强化提示词" icon={Terminal}>
          「先不要改代码，只列修改点清单」「只修改 XX 函数内部，不要重构」「每条给出依据：引用文件与函数，不确定的明确标注」——写进每次对话。
        </Card>
        <Card title="红线（对应项记 0 分）" icon={ShieldCheck} tone="warn">
          密钥进 AI 对话 / 截图 / 提交物；无法解释自己提交的代码（含 AI 生成）；实验记录与 AI 日志编造。
        </Card>
        <Card title="留痕要求" icon={ClipboardList}>
          AI 使用日志（提示词要点 / 建议摘要 / 采纳与否 / 验证证据）+ 至少 1 条「被推翻的 AI 建议」——这是加分项。
        </Card>
      </Grid>
      <Quote>监督 = 限定范围 + 强行验证 + 留痕；十个提示词模板与 AI 使用记录表见 07-学生学习手册.md 第三节。</Quote>
    </div>
  </Frame>
);

const TaskCards = () => (
  <Frame kicker="短课模式" floor="20" title="四个算法任务：难度递进，改的是真算法" wide>
    <DataTable
      head={["任务", "难度", "内容", "验收（摘要）"]}
      widths={["24%", "10%", "38%", "28%"]}
      rows={[
        [
          "任务一 · 改造混合灯效算法",
          "入门",
          <span key="a">
            <code>composite()</code>：相加截断 → 加权平均 / 逐通道取最大；先预测观感再实测对照
          </span>,
          "观感对照完成；不除零；回归 MIX STOP 与报错",
        ],
        [
          "任务二 · 新增呼吸灯样式",
          "进阶",
          <span key="b">
            协议扩展 solid / blink / <code>breathe</code> + 三角波亮度 + 显示分支；定义混合中的语义
          </span>,
          "约 1.2 秒呼吸可见；模式列表显示 breathe；60 秒在线不闪断",
        ],
        ["任务三 · 双板交通灯协同", "挑战", "板端按 FROM 心跳切换，或 ROS 2 侧写调度节点（推荐：练应用流程）", "连续 60 秒交替无错乱；拔板行为有定义；能画数据流图"],
        ["任务四 · 自拟（教师审核）", "自选", "在线时长显示 / 混合相位参数 / 轮播按时间切换……", "目标 + 3 条可判定验收 + AI 使用计划"],
      ]}
    />
    <div className="mt-4">
      <Quote>难度递进：任务一入门 → 任务二进阶 → 任务三挑战；至少完成任务一、任务二，任务三按进度选做。</Quote>
    </div>
  </Frame>
);

const Actions = () => (
  <Frame kicker="收尾" floor="21" title="行动清单：按周推进，一步步验收" wide>
    <DataTable
      head={["优先", "动作", "入口 / 预算"]}
      widths={["10%", "48%", "42%"]}
      rows={[
        ["1", "装环境：Windows + Python 3.10+（esptool / mpremote）、WSL2 + ROS 2 Jazzy", "提前一周（教师机先跑通 colcon build）"],
        ["2", "按 16 周路线逐周推进，每周完成对应实验并当堂验收", "11 个实验，见「实验一览」"],
        ["3", "第 8 周前确认 colcon build 与 ros2 launch 在本机可跑", "第 8 周门槛"],
        ["4", "第 15–16 周选题与作品开发，现场演示 + 答辩", "综合项目 40%"],
        ["5", "短平快场景：1 天集中 + 3–4 天自学 + 结课验收", "约 30 学时"],
      ]}
    />
    <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
      <Card title="三条纪律" icon={ListChecks} tone="brand">
        <ul className="space-y-1.5">
          <li>· 现象先行：每次演示先给能看 / 能玩的结果，再讲原理。</li>
          <li>· 逐层推进：设备层没通不跳通信层，通信层没通不接系统层。</li>
          <li>· 一次一坑：故障驱动教学，报错当素材，当场定位。</li>
        </ul>
      </Card>
      <Card title="验收口径" icon={ShieldCheck} tone="good">
        每层都有可验收的小任务；每个实验设基础验收 + 拓展任务；综合项目必须含板端样式 + ROS 2 话题并有一个自扩展点。
      </Card>
    </div>
  </Frame>
);

const Closing = () => (
  <Frame kicker="收尾" floor="22" title="下载与延伸：材料齐全，按实验指导即可复现" wide>
    <div className="space-y-5">
      <Quote>
        板子会编程、消息会跑通、系统会搭起来——这门课把「嵌入式设备接入机器人框架」完整走了一遍。
      </Quote>
      <Grid cols={2}>
        <Card title="一键下载：课程包 + 代码 + 固件" icon={Download}>
          <p>
            随本 deck 附{" "}
            <a className="underline break-all font-semibold text-brand-700" href="./files/ESP32与ROS2课程包与代码.zip">
              files/ESP32与ROS2课程包与代码.zip
            </a>
          </p>
          <p className="mt-2 text-muted">
            含课程标准 / 16 周单元设计 / 11 个实验指导 / 考核方案 / 教师手册 /
            短平快课程方案（<code>06</code>）/ 学生学习手册（<code>07</code>）；
            <code>common</code>、<code>green</code>、<code>blue</code>、<code>xrs</code>、
            <code>tools</code>、<code>ros2_ws</code> 与两块板的 MicroPython 固件。
          </p>
        </Card>
        <Card title="工作区内的位置" icon={FolderTree}>
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            <li>课程包：<code>培训/ESP32与ROS2开发基础课程包/</code></li>
            <li>短平快版：同目录 <code>06-短平快课程方案.md</code>、<code>07-学生学习手册.md</code></li>
            <li>工程代码：<code>教学demo/ESP32-ROS2-LED协同系统/</code></li>
            <li>文字版（架构 / 协议 / 排障）：<code>docs/ESP32与ROS2开发基础.md</code></li>
          </ul>
        </Card>
        <Card title="延伸一：传感器与 ROS 2 深入" icon={Activity}>
          加传感器（DHT11 / 超声波 / 光敏），把物理量映射为颜色或频率；系统侧再学自定义消息、
          服务 / 动作、<code>rqt</code> 可视化与 Nav2 入门。
        </Card>
        <Card title="延伸二：竞赛与继续练" icon={Trophy}>
          嵌入式设计竞赛、机器人大赛、物联网创新赛——本课作品可直接作参赛原型；
          继续练：把 <code>MIX</code> 合成规则改成「平均」或「取最大」，给 <code>led_ui</code> 加「一键灯效」按钮。
        </Card>
        <Card title="相关讲义" icon={BookOpen}>
          相邻主题：<code>ESP32-S3电机驱动板</code>、<code>ESP32-S3接入micro-ROS</code>（机器人控车路线）、
          <code>ROS2与micro-ROS选型</code>（WSL 跨机验证）。
        </Card>
        <Card title="安全提示：密钥不随包" icon={ShieldCheck} tone="warn">
          <code>wifi_config.py</code> 含真实 WiFi 密码，不随包分发；下载包里用{" "}
          <code>common/wifi_config.example.py</code> 模板复制后填写。
        </Card>
      </Grid>
      <p className="text-[0.86rem] text-muted">
        路径：<code>教学webppt/ESP32与ROS2开发基础/</code>（成品单文件 + <code>files/</code> 附件，离线可播）
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Tldr /> },
  { nav: "课程定位", group: "概览", el: <Position /> },
  { nav: "课程主线", group: "概览", el: <Roadmap /> },
  { nav: "硬件与角色", group: "概览", el: <Hardware /> },
  { nav: "链路全景", group: "概览", el: <Architecture /> },
  { nav: "三层教学", group: "教学主线", el: <ThreeLayers /> },
  { nav: "通信协议", group: "教学主线", el: <Protocol /> },
  { nav: "样式与混合", group: "教学主线", el: <StyleAndMix /> },
  { nav: "ROS 2 桥接", group: "教学主线", el: <RosBridge /> },
  { nav: "教学方法", group: "教学方法", el: <Method /> },
  { nav: "实验一览", group: "教学方法", el: <Labs /> },
  { nav: "教师准备", group: "开课准备", el: <TeacherPrep /> },
  { nav: "第一次上机", group: "开课准备", el: <FirstLab /> },
  { nav: "考核方案", group: "开课准备", el: <Assessment /> },
  { nav: "对比决策", group: "对比决策", el: <Decision /> },
  { nav: "短课总览", group: "短课模式", el: <Intensive /> },
  { nav: "第 1 天日程", group: "短课模式", el: <DayOne /> },
  { nav: "自学 3–4 天", group: "短课模式", el: <SelfStudy /> },
  { nav: "AI 四步工作法", group: "短课模式", el: <AiWorkflow /> },
  { nav: "算法任务", group: "短课模式", el: <TaskCards /> },
  { nav: "行动清单", group: "收尾", el: <Actions /> },
  { nav: "下载与延伸", group: "收尾", el: <Closing /> },
];

export default slides;
