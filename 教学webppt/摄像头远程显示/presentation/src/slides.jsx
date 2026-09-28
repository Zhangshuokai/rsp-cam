import React from "react";
import {
  Camera,
  Cpu,
  Network,
  Monitor,
  ShieldCheck,
  RefreshCw,
  Timer,
  Terminal,
  Gauge,
  Layers,
  Server,
  Eye,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Stat, Focus, Steps, Pre } from "./components.jsx";

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
  </div>
);

const Decoupling = () => (
  <Frame kicker="概览" floor="01" title="一句话结论">
    <Grid cols={3}>
      <Card title="树莓派只采集" icon={Camera}>
        取帧 → JPEG → 推流，不需要图形界面、不需要联网。
      </Card>
      <Card title="裸 TCP 传输" icon={Network}>
        4 字节长度前缀切分帧边界，直连以太网低延迟。
      </Card>
      <Card title="本机只显示" icon={Monitor}>
        收帧解码后 imshow 显示，可跨平台替换。
      </Card>
    </Grid>
    <div className="mt-7">
      <Quote>采集、传输、显示三层各自独立，换摄像头或换显示端互不影响。</Quote>
    </div>
  </Frame>
);

const Architecture = () => (
  <Frame kicker="架构" floor="02" title="数据流：四步">
    <Grid cols={4}>
      <Card title="① 采集" icon={Camera}>
        cv2.VideoCapture(0, CAP_V4L2)，FOURCC=MJPG，640×480。
      </Card>
      <Card title="② 编码" icon={Cpu}>
        cv2.imencode 编码 JPEG，质量可配（默认 100）。
      </Card>
      <Card title="③ 封装" icon={Server}>
        4B 大端长度 + JPEG 载荷，sendall 推送。
      </Card>
      <Card title="④ 显示" icon={Monitor}>
        recv_exact → imdecode → imshow，叠加实时 FPS。
      </Card>
    </Grid>
    <div className="mt-7">
      <Quote>TCP_NODELAY 关闭 Nagle，避免小帧被延迟合并。</Quote>
    </div>
  </Frame>
);

const Protocol = () => (
  <Frame kicker="协议" floor="03" title="帧协议：4 字节长度 + 载荷">
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
        读写两侧 10s 空闲超时，防止瞬时抖动拖死进程。
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
  <Frame kicker="服务端" floor="04" title="树莓派端要点" wide>
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
      <Steps title="展开：cam_server.py 全部参数">
        <Pre>{`python3 cam_server.py \\
  --device /dev/video0 \\       # 摄像头设备
  --width 1280 --height 960 \\  # 分辨率（上限）
  --fps 25 \\                   # 目标帧率
  --quality 100 \\              # JPEG 质量 0–100
  --port 5000 \\                # 监听端口
  --bind 172.26.188.116         # 监听地址（默认本机直连 IP）

# 依赖（Pi 端）
sudo apt-get install -y python3-opencv`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const PcSide = () => (
  <Frame kicker="客户端" floor="05" title="本机端要点" wide>
    <Focus
      no="PC"
      title="接收与显示"
      tag="cam_view.py"
      goal="连接失败自动重连；--check 模式用于无人值守验证。"
      points={[
        "create_connection 连接，失败则 2s 后重试；--check 下失败直接退出。",
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
  --check \\                    # 无窗口模式（无人值守验证）
  --frames 60                   # --check 下统计的帧数

# 依赖（本机）
pip install opencv-python numpy

# 退出码：0 = 正常 / 校验通过，非 0 = 连接或校验失败`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const DesignPoints = () => (
  <Frame kicker="设计" floor="06" title="关键设计点" wide>
    <DataTable
      head={["设计点", "目的"]}
      rows={[
        ["采集 / 传输 / 显示分层", "摄像头驱动与图形界面不必同机"],
        ["4 字节大端长度前缀", "在字节流上切分帧边界，无需容器解析"],
        ["MJPG 采集 + JPEG 二次压缩", "降低 USB 与以太网带宽占用"],
        ["单客户端 listen(1)", "帧率优先，不引入多路复用"],
        ["TCP_NODELAY", "关闭 Nagle，压低端到端延迟"],
        ["双向超时 / 上限 / 重试", "防不可信输入与瞬时抖动拖死进程"],
        ["断线重连 + 摄像头自动重开", "单侧重启后无需人工干预"],
      ]}
    />
  </Frame>
);

const Run = () => (
  <Frame kicker="运行" floor="07" title="怎么跑起来">
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
      <Card title="最高采集" icon={Gauge}>
        --width 1280 --height 960 --quality 100 --fps 25
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>依赖：Pi 端 python3-opencv；本机 opencv-python + numpy。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：从依赖安装到跑通（完整步骤）">
        <Pre>{`# 1) Pi 端装依赖并启动服务
sudo apt-get install -y python3-opencv
# 把 cam_server.py 传到 Pi 后后台启动
nohup python3 cam_server.py --bind 172.26.188.116 > /tmp/cam_server.log 2>&1 &
ss -ltn | grep 5000             # 确认监听

# 2) 本机装依赖并显示
pip install opencv-python numpy
python "教学demo/摄像头远程显示/cam_view.py" --host 172.26.188.116

# 3) 无窗口验证（脚本化 / 无人值守）
python "教学demo/摄像头远程显示/cam_view.py" --check --frames 60

# 4) 要最高采集
python cam_view.py --width 1280 --height 960 --quality 100 --fps 25

# 仓库内默认参数（docs/摄像头参数.md）
# cam_server.py：--device 0 / --width 640 --height 480 / --fps 30（硬件封顶 25）
#                --quality 100 / --port 5000 / --bind 172.26.188.116
# cam_view.py：  --host 172.26.188.116 / --port 5000 / --frames 0（不停止）/ --check 关

# 注意：Pi 重启后 /home/nanzhida/cam_server.py 与后台进程都会丢，需重新上传并启动`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Perf = () => (
  <Frame kicker="实测" floor="08" title="实测性能（1G 直连）">
    <Grid cols={3}>
      <Stat value="640×480" label="质量 100 · 约 64 KB/帧 · 25–27 fps" />
      <Stat value="1280×960" label="质量 100 · 约 193–215 KB/帧 · 19–24 fps" tone="warn" />
      <Stat value="25" unit="fps" label="硬件帧率上限（所有分辨率）" tone="good" />
    </Grid>
    <div className="mt-7">
      <Quote>1280×960×质量 100 ≈ 5 MB/s，远低于 1 Gbps，带宽不是瓶颈。</Quote>
    </div>
  </Frame>
);

const Closing = () => (
  <Frame kicker="收尾" floor="09" title="小结">
    <div className="space-y-5">
      <Quote>采集在 Pi、传输用裸 TCP、显示在本机；分层让系统更稳、更好替换。</Quote>
      <Grid cols={3}>
        <Card title="易替换" icon={RefreshCw}>
          摄像头或显示端可单独更换。
        </Card>
        <Card title="可自恢复" icon={ShieldCheck}>
          断线自动重连、摄像头自动重开。
        </Card>
        <Card title="好验证" icon={Eye}>
          --check 无窗口即可验证链路。
        </Card>
      </Grid>
      <div className="mt-4">
        <Card title="脚本下载（随 deck 分发）" icon={Terminal}>
          <a className="font-semibold text-brand-700 underline" href="./files/摄像头远程显示.zip">
            摄像头远程显示.zip
          </a>
          （cam_server.py + cam_view.py + README）。
        </Card>
      </div>
      <p className="text-[0.86rem] text-muted">
        完整流程图（总体数据流、服务端 / 客户端状态机）与摄像头参数说明随仓库 <code>docs/</code> 文档提供。
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "一句话结论", group: "概览", el: <Decoupling /> },
  { nav: "数据流", group: "架构", el: <Architecture /> },
  { nav: "帧协议", group: "架构", el: <Protocol /> },
  { nav: "树莓派端", group: "实现", el: <PiSide /> },
  { nav: "本机端", group: "实现", el: <PcSide /> },
  { nav: "关键设计点", group: "实现", el: <DesignPoints /> },
  { nav: "运行方式", group: "落地", el: <Run /> },
  { nav: "实测性能", group: "落地", el: <Perf /> },
  { nav: "小结", group: "收尾", el: <Closing /> },
];
