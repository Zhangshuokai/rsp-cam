import React from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Camera,
  Cpu,
  Download,
  Eye,
  FolderTree,
  Gauge,
  Layers,
  ListChecks,
  Monitor,
  Network,
  RefreshCw,
  Server,
  ShieldCheck,
  Target,
  Terminal,
  Timer,
  Usb,
  Zap,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Stat, Focus, Steps, Pre } from "./components.jsx";

/* 端到端链路架构：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） */
const LinkArchitecture = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 312"
      role="img"
      aria-label="端到端链路：树莓派 USB 摄像头经 OpenCV 采集、JPEG 编码与 4 字节长度封装，由 TCP 服务端推流；本机 TCP 客户端收帧校验、JPEG 解码后窗口显示，两端靠直连以太网传输"
      className="h-auto w-full"
    >
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="arch-net" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
      </defs>

      <rect x="16" y="14" width="868" height="112" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="32" y="36" fill="#1a5cae" fontSize="12" fontWeight="700">树莓派 zhangsk · cam_server.py（只采集与推流）</text>

      <rect x="32" y="52" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="126" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">USB UVC 摄像头</text>
      <text x="126" y="97" textAnchor="middle" fill="#475569" fontSize="10">/dev/video0 · MJPG 640×480</text>

      <rect x="252" y="52" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="346" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">OpenCV 采集</text>
      <text x="346" y="97" textAnchor="middle" fill="#475569" fontSize="10">CAP_V4L2 · 上限 25 fps</text>

      <rect x="472" y="52" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="566" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">JPEG 编码</text>
      <text x="566" y="97" textAnchor="middle" fill="#475569" fontSize="10">imencode · 质量 100</text>

      <rect x="692" y="52" width="176" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="780" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">帧封装 + TCP 服务</text>
      <text x="780" y="97" textAnchor="middle" fill="#475569" fontSize="10">4B 长度 · listen(1)</text>

      <line x1="220" y1="83" x2="248" y2="83" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="440" y1="83" x2="468" y2="83" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="660" y1="83" x2="688" y2="83" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />

      <line x1="450" y1="126" x2="450" y2="144" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#arch-net)" />
      <rect x="280" y="146" width="340" height="24" rx="8" fill="#fffbeb" stroke="#fbbf24" />
      <text x="450" y="162" textAnchor="middle" fill="#b4690e" fontSize="10.5" fontWeight="700">直连以太网 TCP · 172.26.188.116:5000 · TCP_NODELAY</text>
      <line x1="450" y1="170" x2="450" y2="188" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#arch-net)" />

      <rect x="16" y="190" width="868" height="112" rx="14" fill="#f0fdfa" stroke="#5eead4" />
      <text x="32" y="212" fill="#0f766e" fontSize="12" fontWeight="700">本机 Windows · cam_view.py（只接收与显示）</text>

      <rect x="32" y="226" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="126" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">TCP 客户端</text>
      <text x="126" y="271" textAnchor="middle" fill="#475569" fontSize="10">create_connection · 断线重连</text>

      <rect x="252" y="226" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="346" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">收帧 + 校验</text>
      <text x="346" y="271" textAnchor="middle" fill="#475569" fontSize="10">4B 长度 · ≤ 8 MiB · 10 s</text>

      <rect x="472" y="226" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="566" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">JPEG 解码</text>
      <text x="566" y="271" textAnchor="middle" fill="#475569" fontSize="10">imdecode</text>

      <rect x="692" y="226" width="176" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="780" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">窗口显示</text>
      <text x="780" y="271" textAnchor="middle" fill="#475569" fontSize="10">imshow · 叠加 FPS</text>

      <line x1="220" y1="257" x2="248" y2="257" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="440" y1="257" x2="468" y2="257" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="660" y1="257" x2="688" y2="257" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
    </svg>
  </div>
);

/* 对比决策：直连 USB 采集 vs 网络串流（内联 SVG） */
const Decision = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 250"
      role="img"
      aria-label="对比决策：摄像头能否插在跑算法的机器上——能就直连 USB 采集，不能就网络串流"
      className="h-auto w-full"
    >
      <defs>
        <marker id="dec-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="dec-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="200" y="8" width="280" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="340" y="30" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">摄像头能插在跑算法的机器上吗？</text>
      <text x="340" y="47" textAnchor="middle" fill="#475569" fontSize="10">这一步决定采集走 USB 还是网络</text>

      <line x1="320" y1="58" x2="152" y2="98" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#dec-blue)" />
      <line x1="360" y1="58" x2="528" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dec-teal)" />

      <rect x="16" y="100" width="260" height="118" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="32" y="126" fill="#0f172a" fontSize="12" fontWeight="700">能 → 直连 USB 采集</text>
      <text x="32" y="150" fill="#475569" fontSize="10">OpenCV 直接读 /dev/video0</text>
      <text x="32" y="170" fill="#475569" fontSize="10">延迟最低，不占网络带宽</text>
      <text x="32" y="194" fill="#1a5cae" fontSize="10" fontWeight="700">适合：单机低延迟闭环</text>

      <rect x="404" y="100" width="260" height="118" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="420" y="126" fill="#0f172a" fontSize="12" fontWeight="700">不能 → 网络串流</text>
      <text x="420" y="150" fill="#475569" fontSize="10">摄像头固定在车上 / 远端</text>
      <text x="420" y="170" fill="#475569" fontSize="10">MJPEG / RTSP / 裸 TCP</text>
      <text x="420" y="194" fill="#0f766e" fontSize="10" fontWeight="700">适合：远程、多端、跨平台</text>

      <text x="16" y="240" fill="#94a3b8" fontSize="10">
        判定关键：跨不过那根 USB 线，就只能把画面搬上网；摄像头能插在本机就别绕网络。
      </text>
    </svg>
  </div>
);

/* 延迟与画质取舍：内联 SVG */
const Tradeoff = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 300"
      role="img"
      aria-label="延迟与画质取舍：分辨率与画质提高会让单帧体积变大、帧率下降，640×480 质量100 约 64 KB 25–27 fps，1280×960 约 200 KB 19–24 fps"
      className="h-auto w-full"
    >
      <defs>
        <marker id="tr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      <line x1="80" y1="250" x2="652" y2="250" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="80" y1="250" x2="80" y2="44" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="652" y="266" textAnchor="end" fill="#64748b" fontSize="10">单帧体积（KB）→</text>
      <text x="86" y="36" textAnchor="middle" fill="#64748b" fontSize="10">帧率（fps）↑</text>

      <line x1="74" y1="250" x2="80" y2="250" stroke="#cbd5e1" />
      <text x="68" y="253" textAnchor="end" fill="#94a3b8" fontSize="9">0</text>
      <line x1="74" y1="183" x2="652" y2="183" stroke="#eef2f7" />
      <text x="68" y="186" textAnchor="end" fill="#94a3b8" fontSize="9">10</text>
      <line x1="74" y1="117" x2="652" y2="117" stroke="#eef2f7" />
      <text x="68" y="120" textAnchor="end" fill="#94a3b8" fontSize="9">20</text>
      <line x1="74" y1="50" x2="652" y2="50" stroke="#eef2f7" />
      <text x="68" y="53" textAnchor="end" fill="#94a3b8" fontSize="9">30</text>

      <text x="80" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">0</text>
      <text x="220" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">60</text>
      <text x="360" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">120</text>
      <text x="500" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">180</text>
      <text x="640" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">240</text>

      <line x1="229" y1="78" x2="229" y2="250" stroke="#93cdfb" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="547" y1="110" x2="547" y2="250" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="4 4" />

      <line x1="237" y1="74" x2="539" y2="106" stroke="#b4690e" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#tr-arrow)" />
      <text x="388" y="76" textAnchor="middle" fill="#b4690e" fontSize="10" fontWeight="700">分辨率 / 画质提高</text>

      <circle cx="229" cy="78" r="5" fill="#1a5cae" />
      <text x="229" y="52" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">640×480</text>
      <text x="229" y="65" textAnchor="middle" fill="#475569" fontSize="10">64 KB · 26 fps</text>

      <circle cx="547" cy="110" r="5" fill="#0d9488" />
      <text x="547" y="84" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">1280×960</text>
      <text x="547" y="97" textAnchor="middle" fill="#475569" fontSize="10">约 200 KB · 21 fps</text>

      <text x="80" y="290" fill="#94a3b8" fontSize="10">
        带宽不是瓶颈（≈5 MB/s ≪ 1 Gbps）：真正的取舍是清晰度换帧率，以及单帧变大带来的端到端延迟。
      </text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      教学demo · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      摄像头远程显示
      <br />
      <span className="text-brand-600">采集 · 传输 · 显示解耦</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      树莓派采集 USB 摄像头，经裸 TCP 把 JPEG 帧推到本机窗口显示；任一侧异常都不会拖垮另一侧。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整命令与全量参数。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="采集、传输、显示三层解耦，任一侧异常都不拖垮另一侧"
    lead="树莓派（Raspberry Pi，下文简称 Pi）只负责采集与推流，本机只负责接收与显示，中间用裸 TCP（Transmission Control Protocol）自描述帧协议；换摄像头、换显示端、换机器都互不影响。"
  >
    <Grid cols={2}>
      <Card title="Pi 只采集" icon={Camera}>
        取帧 → JPEG（Joint Photographic Experts Group，压缩图像格式）→ 推流，不需要图形界面、不依赖外网。
      </Card>
      <Card title="裸 TCP 传输" icon={Network}>
        4 字节长度前缀切分帧边界，直连以太网 1 Gbps 下延迟低。
      </Card>
      <Card title="本机只显示" icon={Monitor}>
        收帧 → imdecode → imshow，跨平台可替换，显示端不碰摄像头。
      </Card>
      <Card title="不要三层耦合" icon={AlertTriangle} tone="warn">
        不要把采集与显示塞进同一个进程：显示端一旦卡住，采集也会被一起拖死。
      </Card>
    </Grid>
  </Frame>
);

const Architecture = () => (
  <Frame
    kicker="链路"
    floor="02"
    title="端到端链路：相机 → 采集 → 编码 → 传输 → 解码 → 显示"
    lead="每一环只做一件事；任一环出问题都能单独定位、单独替换，不必推翻整条链路。"
    wide
  >
    <div className="space-y-4">
      <LinkArchitecture />
      <Quote>边界落在「帧」上：4 字节长度说清一帧到哪里结束，客户端不必解析任何容器。</Quote>
    </div>
  </Frame>
);

const DataFlow = () => (
  <Frame
    kicker="链路"
    floor="03"
    title="数据流四步：取帧、编码、封装、显示"
  >
    <Grid cols={4}>
      <Card title="① 采集" icon={Camera}>
        cv2.VideoCapture(0, CAP_V4L2)，FOURCC=MJPG，默认 640×480。
      </Card>
      <Card title="② 编码" icon={Cpu}>
        cv2.imencode 压成 JPEG，质量默认 100。
      </Card>
      <Card title="③ 封装" icon={Server}>
        4 字节大端长度 + JPEG 载荷，sendall 推送。
      </Card>
      <Card title="④ 显示" icon={Monitor}>
        recv_exact → imdecode → imshow，叠加实时 FPS。
      </Card>
    </Grid>
    <div className="mt-7">
      <Quote>TCP_NODELAY 关闭 Nagle 算法，避免小帧被延迟合并——这是低延迟的关键一步。</Quote>
    </div>
  </Frame>
);

const DecisionBlock = () => (
  <Frame
    kicker="链路"
    floor="04"
    title="摄像头不在本机就必须网络串流，能插本机就别绕网络"
    lead="摄像头插在跑算法的机器上，就用 OpenCV 直接读；摄像头固定在车上 / 远端，才值得引入网络串流——MJPEG（Motion JPEG）、RTSP（Real-Time Streaming Protocol）生态成熟，本 deck 的裸 TCP 最薄、延迟最可控。"
    wide
  >
    <div className="space-y-4">
      <Decision />
      <Grid cols={2}>
        <Card title="方案 A · 直连 USB 采集" icon={Usb}>
          摄像头插在跑算法的同一台机器，OpenCV 直接读 <code>/dev/video0</code>，链路最短。
        </Card>
        <Card title="方案 B · 网络串流" icon={Network} tone="good">
          摄像头在远端，画面经以太网 / Wi-Fi 送到本机；可多端接入、跨系统。
        </Card>
      </Grid>
      <DataTable
        head={["维度", "方案 A：直连 USB 采集", "方案 B：网络串流（MJPEG / RTSP / 裸 TCP）"]}
        rows={[
          ["布线 / 距离", "摄像头必须插在跑算法的机器上，线长受限", "摄像头在哪都行，经网络跨机、可远程"],
          ["端到端延迟", "最低：没有编码 + 网络 + 解码环节", "多出编码、传输与解码，通常增加数十 ms"],
          ["跨平台 / 多端", "单机独占，画面只有本机能看", "跨系统、可多端接入，天然适合远程"],
          ["带宽占用", "只走 USB 总线，不占网络", "占用网络带宽（640×480 约 2 MB/s）"],
          ["实现复杂度", "最低：OpenCV 直接读设备", "要自己定帧协议，或引入 MJPEG / RTSP 服务"],
          ["适用场景", "单机低延迟闭环、摄像头可插本机", "摄像头固定在车上 / 远端、要远程观看"],
        ]}
      />
      <Quote>
        辩证一问：「什么情况下直连 USB 反而更好？」——摄像头能插在跑算法的同一台机器、又要极致低延迟时，直连 USB 最省事；只有摄像头必须离开本机（车载、远端、多端观看）时，才值得付出网络串流的编码与传输代价。
      </Quote>
    </div>
  </Frame>
);

const Protocol = () => (
  <Frame
    kicker="协议"
    floor="05"
    title="帧协议只有两段：4 字节长度 + JPEG 载荷"
    lead="自描述、自校验：长度说清边界，两端各自设上限与超时，坏帧就地断开而不是硬撑。"
  >
    <Grid cols={2}>
      <Card title="长度前缀" icon={Layers}>
        4 字节大端无符号整数，说明本帧 JPEG 的字节数。
      </Card>
      <Card title="载荷" icon={Layers}>
        紧随其后的 JPEG 数据，客户端无需解析 MJPEG / HTTP 容器。
      </Card>
      <Card title="边界校验" icon={ShieldCheck}>
        0 &lt; 长度 ≤ 8 MiB，超出即判非法并断开。
      </Card>
      <Card title="超时保护" icon={Timer}>
        读 / 写两侧各 10 s 空闲超时，防瞬时抖动拖死进程。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：帧协议完整定义">
        <Pre>{`帧 = [4 字节长度][JPEG 载荷]

长度：大端无符号 32 位，单位字节
边界校验：0 < 长度 ≤ 8 MiB，否则判非法并断开
超时：读 / 写两侧各 10 s 空闲超时
连接：单客户端 listen(1)，TCP_NODELAY 关闭 Nagle

收帧伪码：
  len = recv_exact(4)
  if not (0 < len <= 8 * 1024 * 1024): abort
  jpeg = recv_exact(len)
  img = cv2.imdecode(jpeg, IMREAD_COLOR)`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const PiSide = () => (
  <Frame kicker="实现" floor="06" title="树莓派端：连接即推流，单客户端独占换帧率" wide>
    <Focus
      no="Pi"
      title="采集与推流"
      tag="cam_server.py"
      goal="打开摄像头后进入 accept 主循环，单个客户端独占以获得最高帧率。"
      points={[
        "CAP_V4L2 + FOURCC=MJPG，指定分辨率与帧率。",
        "socket + SO_REUSEADDR → bind → listen(1) 单客户端。",
        "每客户端设置 TCP_NODELAY，关闭 Nagle。",
        "每 60 帧打印实测 FPS；读帧失败重试，连续 ≥ 20 次判为摄像头丢失。",
        "客户端掉线后回到 accept；摄像头丢失则 release 后重新打开。",
      ]}
      aside={
        <Card title="可配参数" icon={Terminal}>
          --device / --width / --height / --fps / --quality / --port / --bind
        </Card>
      }
    />
    <div className="mt-4">
      <Steps title="展开：cam_server.py 全部参数与默认值">
        <Pre>{`python3 cam_server.py \\
  --device 0 \\                  # 摄像头设备（/dev/video0）
  --width 640 --height 480 \\    # 分辨率（最高 1280×960）
  --fps 30 \\                    # 目标帧率（硬件封顶 25）
  --quality 100 \\               # JPEG 质量 0–100
  --port 5000 \\                 # 监听端口
  --bind 172.26.188.116         # 监听地址（默认新 Pi eth0）

# 依赖（Pi 端）
sudo apt-get install -y python3-opencv

# --bind 默认绑定 eth0 地址：避免 wlan0 接入热点时把未鉴权的画面暴露给同网段设备`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const PcSide = () => (
  <Frame kicker="实现" floor="07" title="本机端：断线自动重连，--check 可无人值守验证" wide>
    <Focus
      no="PC"
      title="接收与显示"
      tag="cam_view.py"
      goal="连接失败自动重连；--check 模式用于无人值守验证。"
      points={[
        "create_connection 连接，失败则 2 s 后重试；--check 下失败直接退出。",
        "recv_exact 先读 4 字节长度，校验后读满整帧数据。",
        "cv2.imdecode → imshow，窗口叠加实时 FPS，q / Esc 退出。",
        "断流 / 长度非法 / 解码失败 → 结束本次连接并自动重连。",
      ]}
      aside={
        <Card title="验证方式" icon={Eye}>
          python cam_view.py --check --frames 60
          <br />
          只统计首帧尺寸与平均 FPS，不弹窗。
        </Card>
      }
    />
    <div className="mt-4">
      <Steps title="展开：cam_view.py 全部参数与退出码">
        <Pre>{`python cam_view.py \\
  --host 172.26.188.116 \\      # 服务端地址
  --port 5000 \\                # 服务端端口
  --frames 0 \\                 # 收够 N 帧后退出，0 = 一直显示
  --check                      # 无窗口模式（无人值守验证）

# 依赖（本机）
pip install opencv-python numpy

# 退出码：0 = 正常退出 / --check 校验通过，非 0 = 连接或校验失败
# 显示窗口按 q 或 Esc 退出`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const DesignPoints = () => (
  <Frame kicker="实现" floor="08" title="关键设计点只为两件事：不卡、能自恢复" wide>
    <DataTable
      head={["设计点", "目的"]}
      rows={[
        ["采集 / 传输 / 显示分层", "摄像头驱动与图形界面不必同机，Pi 无需 GUI、无需外网"],
        ["4 字节大端长度前缀", "在字节流上切分帧边界，无需容器解析"],
        ["MJPG 采集 + JPEG 二次压缩", "降低 USB 与以太网带宽占用"],
        ["单客户端 listen(1)", "帧率优先，不引入多路复用"],
        ["TCP_NODELAY", "关闭 Nagle，压低端到端延迟"],
        ["双向超时 / 长度上限 / 重试", "防不可信输入与瞬时抖动拖死进程"],
        ["断线重连 + 摄像头自动重开", "单侧重启后无需人工干预"],
      ]}
    />
  </Frame>
);

const Run = () => (
  <Frame kicker="落地" floor="09" title="两条命令跑通：Pi 起服务，本机起窗口">
    <Grid cols={2}>
      <Card title="Pi 端启动" icon={Terminal}>
        python3 cam_server.py（默认监听 172.26.188.116:5000）
      </Card>
      <Card title="本机端显示" icon={Monitor}>
        python cam_view.py（默认连 172.26.188.116:5000）
      </Card>
      <Card title="无窗口验证" icon={Eye}>
        python cam_view.py --check --frames 60
      </Card>
      <Card title="要最高采集" icon={Gauge}>
        --width 1280 --height 960 --quality 100 --fps 25
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>依赖：Pi 端 python3-opencv；本机 opencv-python + numpy。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：从上传到跑通（完整步骤）">
        <Pre>{`# 1) 上传并启动服务（脚本在 教学demo/摄像头远程显示/）
python tools/pi.py --put cam_server.py /home/nanzhida/cam_server.py
python tools/pi.py --sudo "apt-get install -y python3-opencv"
python tools/pi.py "nohup python3 cam_server.py --bind 172.26.188.116 > /tmp/cam_server.log 2>&1 &"
python tools/pi.py "ss -ltn | grep 5000"        # 确认监听
python tools/pi.py "tail -n 20 /tmp/cam_server.log"

# 2) 本机装依赖并显示
pip install opencv-python numpy
python "教学demo/摄像头远程显示/cam_view.py" --host 172.26.188.116

# 3) 无窗口验证（脚本化 / 无人值守）
python "教学demo/摄像头远程显示/cam_view.py" --check --frames 60

# 4) 要最高采集
python3 cam_server.py --width 1280 --height 960 --quality 100 --fps 25

# 仓库内默认参数（docs/摄像头参数.md）
#   cam_server.py：--device 0 / 640×480 / --fps 30（硬件封顶 25）
#                  --quality 100 / --port 5000 / --bind 172.26.188.116
#   cam_view.py：  --host 172.26.188.116 / --port 5000 / --frames 0 / --check 关

# 注意：Pi 重启后 /home/nanzhida/cam_server.py 与后台进程都会丢，需重新上传并启动`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Perf = () => (
  <Frame kicker="落地" floor="10" title="640×480 跑到 25–27 fps，带宽从来不是瓶颈">
    <Grid cols={3}>
      <Stat value="640×480" label="质量 100 · 约 64 KB/帧 · 25–27 fps" />
      <Stat value="1280×960" label="质量 100 · 约 193–215 KB/帧 · 19–24 fps" tone="warn" />
      <Stat value="25" unit="fps" label="硬件帧率上限（所有分辨率）" tone="good" />
    </Grid>
    <div className="mt-7">
      <Quote>1280×960 × 质量 100 ≈ 5 MB/s，远低于 1 Gbps——要担心的不是带宽，而是清晰度与帧率的取舍。</Quote>
    </div>
  </Frame>
);

const TradeoffPage = () => (
  <Frame
    kicker="落地"
    floor="11"
    title="清晰度、帧率与延迟此消彼长，按用途选一档"
    lead="分辨率或画质提高，单帧体积随之变大，编码、传输与解码都更久——换来清晰度，付掉的是帧率与端到端延迟。"
    wide
  >
    <div className="space-y-4">
      <Tradeoff />
      <Quote>看画面够用就停 640×480；要抓细节再上 1280×960，别默认拉满质量。</Quote>
      <Steps title="展开：能力上限与取舍（实测）">
        <Pre>{`分辨率上限 1280×960（MJPG）；YUYV 最高只有 640×480
帧率上限   25 fps（所有分辨率，硬件固定档位 25/5）
JPEG 质量  上限 100；90→100 肉眼提升很小、体积翻倍，1280×960 下掉帧（约 25→20）
带宽       不是瓶颈：1280×960×质量100 ≈ 5 MB/s，远低于 1 Gbps
延迟       分辨率 / 画质越高，单帧越大、编码与传输越久，端到端延迟越高
定焦镜头   近距离小字发虚无法软件解决，需拉开到对焦距离或换自动对焦摄像头`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame kicker="收尾" floor="12" title="脚本与文字版全文，随 deck 下载" wide>
    <Grid cols={2}>
      <Card title="随 deck 分发的脚本" icon={Download}>
        <p>
          <a className="font-semibold text-brand-700 underline" href="./files/摄像头远程显示.zip">
            摄像头远程显示.zip
          </a>
        </p>
        <p className="mt-2 text-muted">cam_server.py + cam_view.py + README。</p>
      </Card>
      <Card title="工作区内的位置" icon={FolderTree}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>脚本：<code>教学demo/摄像头远程显示/</code></li>
          <li>文字版：<code>docs/设计原理流程图.md</code></li>
          <li>摄像头参数：<code>docs/摄像头参数.md</code>、<code>docs/摄像头选型.md</code></li>
        </ul>
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        相邻主题：<code>摄像头参数与选型</code>（硬件能力）、<code>树莓派连接与部署</code>（上传与启动）。
      </Card>
      <Card title="下载地址约定" icon={Target}>
        离线首选 <code>./files/…</code>（随 deck 分发）；在线地址以 <code>origin/main</code> 已推送为准，未推送的链接是 404。
      </Card>
    </Grid>
  </Frame>
);

const Action = () => (
  <Frame kicker="收尾" floor="13" title="照这份清单做：先跑通链路，再按用途调分辨率" wide>
    <div className="space-y-5">
      <Quote>采集在 Pi、传输用裸 TCP、显示在本机；分层让系统更稳、更好替换。</Quote>
      <Grid cols={3}>
        <Card title="易替换" icon={RefreshCw}>
          摄像头或显示端可单独更换，不牵动另一端。
        </Card>
        <Card title="可自恢复" icon={ShieldCheck} tone="good">
          断线自动重连、摄像头自动重开，无需人工干预。
        </Card>
        <Card title="好验证" icon={Eye}>
          --check 无窗口即可验证整条链路。
        </Card>
      </Grid>
      <Steps title="展开：上机与验收清单">
        <Pre>{`# 1) 先跑通（默认 640×480，最快见效）
python tools/pi.py --put cam_server.py /home/nanzhida/cam_server.py
python tools/pi.py "nohup python3 cam_server.py --bind 172.26.188.116 > /tmp/cam_server.log 2>&1 &"
python "教学demo/摄像头远程显示/cam_view.py" --check --frames 60

# 2) 看窗口确认画质与实时性，再决定要不要上高分辨率
python "教学demo/摄像头远程显示/cam_view.py" --host 172.26.188.116

# 3) 要抓细节再拉高（会掉帧，属正常）
python3 cam_server.py --width 1280 --height 960 --quality 100 --fps 25

# 4) 验收点：本机 --check 无报错、窗口 FPS 与实测一致
#    细节调参见 docs/摄像头参数.md；链路原理见 docs/设计原理流程图.md
#    不要默认拉满质量：90→100 肉眼提升很小，却可能掉帧`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Download}>
        下载：
        <a className="font-semibold text-brand-700 underline" href="./files/摄像头远程显示.zip">
          摄像头远程显示.zip
        </a>
        ；文字版见 <code>docs/设计原理流程图.md</code>、<code>docs/摄像头参数.md</code>。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "端到端链路", group: "链路", el: <Architecture /> },
  { nav: "数据流四步", group: "链路", el: <DataFlow /> },
  { nav: "对比决策", group: "链路", el: <DecisionBlock /> },
  { nav: "帧协议", group: "协议", el: <Protocol /> },
  { nav: "树莓派端", group: "实现", el: <PiSide /> },
  { nav: "本机端", group: "实现", el: <PcSide /> },
  { nav: "关键设计点", group: "实现", el: <DesignPoints /> },
  { nav: "运行方式", group: "落地", el: <Run /> },
  { nav: "实测性能", group: "落地", el: <Perf /> },
  { nav: "延迟与画质", group: "落地", el: <TradeoffPage /> },
  { nav: "下载与延伸", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
