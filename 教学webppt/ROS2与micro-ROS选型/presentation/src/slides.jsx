import React from "react";
import {
  Cpu,
  Server,
  Network,
  Terminal,
  Download,
  AlertTriangle,
  ShieldCheck,
  ListChecks,
  Rocket,
  Boxes,
  Layers,
  Gauge,
  Wifi,
  CheckCircle2,
  BookOpen,
  Cable,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Stat, Steps, Pre } from "./components.jsx";

const Code = ({ children }) => (
  <div className="surface overflow-x-auto p-4 font-mono text-[0.78rem] leading-relaxed text-ink md:text-[0.82rem]">
    {children}
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      ROS 2 与 micro-ROS 选型
      <br />
      <span className="text-brand-600">以及在树莓派上装 ROS 2 Jazzy</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      结论先行：树莓派装 <b>ROS 2</b>（Docker + ros:jazzy-ros-base）；micro-ROS 是"给单片机用的 ROS 2"，
      只在系统里存在 MCU 做实时底层时才引入。
    </p>
  </div>
);

const Difference = () => (
  <Frame kicker="概念" floor="01" title="一句话区分两者" wide>
    <DataTable
      head={["", "ROS 2", "micro-ROS"]}
      rows={[
        ["目标平台", "Linux / SBC（树莓派、Jetson）", "微控制器（MCU）、RTOS"],
        ["运行环境", "完整 Linux 用户态", "FreeRTOS / Zephyr / NuttX（或裸机）"],
        ["资源需求", "数百 MB 内存起", "几十 KB RAM"],
        ["中间件", "DDS（Fast DDS / Cyclone DDS）", "Micro XRCE-DDS（为受限设备优化）"],
        ["客户端 API", "rclcpp / rclpy 等完整版", "rcl + rclc（C，静态内存）"],
        ["与 ROS 2 的关系", "本体", "经 micro-ROS Agent 接入 ROS 2 图"],
      ]}
    />
    <div className="mt-5">
      <Quote>micro-ROS 的架构是「MCU 客户端 → Agent → ROS 2 图」，Agent 本身仍是 ROS 2 节点——它不能替代 ROS 2。</Quote>
    </div>
  </Frame>
);

const WhyPi = () => (
  <Frame kicker="选型" floor="02" title="为什么树莓派 5 选 ROS 2">
    <Grid cols={2}>
      <Card title="Pi 是完整 Linux 平台" icon={Server}>
        Pi 5（BCM2712，aarch64）跑 Debian/Ubuntu，属 ROS 2 的宿主侧；视觉、规划本就该放在这里。
      </Card>
      <Card title="官方 MCU 列表里没有 Pi" icon={Cpu}>
        micro-ROS 支持硬件只有单片机；树莓派侧仅有 Pico（RP2040），没有任何 Pi 4/5 的 Linux 版本。
      </Card>
      <Card title="micro-ROS 是 Agent 侧" icon={Network}>
        Agent 依附在完整 ROS 2 上，所以树莓派上装的是 ROS 2，不是 micro-ROS。
      </Card>
      <Card title="算控分离才用它" icon={Cable}>
        电机闭环、IMU、GPIO 这类硬实时放 MCU，用 micro-ROS 把数据接进树莓派。
      </Card>
    </Grid>
  </Frame>
);

const Decision = () => (
  <Frame kicker="选型" floor="03" title="决策速查" wide>
    <DataTable
      head={["场景", "装什么"]}
      rows={[
        ["Pi 做视觉 / 主控，系统里没有单片机", "只装 ROS 2（本课方案）"],
        ["Pi 做上位机 + Pico/STM32/ESP32 做实时底层", "两边都要：Pi 装 ROS 2，MCU 装 micro-ROS，中间起 Agent"],
        ["只有 Pi，只是 OpenCV 取图 / 算法验证", "ROS 2 可用可不用，直接用 Python / OpenCV 更省事"],
      ]}
    />
    <div className="mt-6">
      <Grid cols={3}>
        <Card title="纯树莓派" icon={Server}>
          ROS 2
        </Card>
        <Card title="树莓派 + MCU" icon={Layers}>
          ROS 2 + micro-ROS
        </Card>
        <Card title="只做视觉验证" icon={BookOpen}>
          不一定上 ROS
        </Card>
      </Grid>
    </div>
  </Frame>
);

const WhenMicro = () => (
  <Frame kicker="选型" floor="04" title="什么时候才引入 micro-ROS" wide>
    <Focus
      no="4"
      title="出现这些需求才上 micro-ROS"
      tag="MCU 侧"
      goal="把硬实时与底层 I/O 从 Linux 挪到单片机，再用 micro-ROS 接进 ROS 2。"
      points={[
        "需要硬实时闭环（电机 PID、舵机时序），Linux 抖动不可接受。",
        "需要直接驱动大量 GPIO / ADC / PWM / CAN。",
        "采集频率高、主控 CPU 不想被底层 I/O 占用（IMU、编码器）。",
        "官方支持硬件：ESP32、Pico、Teensy 4.x、STM32、RA6M5 等。",
      ]}
      aside={
        <Code>
          MCU（Pico/STM32/ESP32）<br />
          &nbsp;&nbsp;micro-ROS client (rcl+rclc)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;↓ 串口 / UDP<br />
          树莓派 micro-ROS Agent<br />
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br />
          ROS 2 图（视觉 / 规划 / 决策）
        </Code>
      }
    />
  </Frame>
);

const Options = () => (
  <Frame kicker="部署" floor="05" title="树莓派上的部署方案对比" wide>
    <p className="mb-4 text-[0.92rem] leading-relaxed text-muted md:text-[0.98rem]">
      关键约束：ROS 2 的 apt 二进制包只支持 Ubuntu；按 REP-2000，arm64 的 Tier 1 是 Ubuntu，
      Raspberry Pi OS / Debian 属 Tier 3（需源码编译）。官方给的路就是 Docker 或 Ubuntu。
    </p>
    <DataTable
      head={["方案", "做法", "结论"]}
      rows={[
        ["Docker（本项目采用）", "Debian 64 位 + 跑官方 arm64 镜像", "✅ 推荐：不污染宿主、升级换 tag"],
        ["Ubuntu 24.04 for Pi", "重刷系统 + 标准 apt", "破坏现有环境与网络，谨慎"],
        ["源码编译", "在 Debian 上自建工作区", "❌ 耗时长、坑多、难维护"],
        ["conda / RoboStack(pixi)", "pixi 装 conda-forge 的 ROS 2", "备选：宿主原生、免 Docker"],
      ]}
    />
  </Frame>
);

const ChosenDocker = () => (
  <Frame kicker="部署" floor="06" title="最终方案：Docker + Jazzy">
    <Grid cols={2}>
      <Card title="官方 arm64 二进制" icon={Download}>
        ros:jazzy-ros-base 由官方构建，Pi 上无需编译，直接跑。
      </Card>
      <Card title="不污染宿主系统" icon={Boxes}>
        依赖都封在镜像里；换版本只换 tag，卸载只删镜像。
      </Card>
      <Card title="访问硬件要显式映射" icon={Cable}>
        摄像头 / 串口 / GPIO 默认不进容器，需 --device。
      </Card>
      <Card title="发行版选 LTS" icon={ShieldCheck}>
        Jazzy（2024-05，维护到 2029-05）；ROS 1 Noetic 已停维，不要再用。
      </Card>
    </Grid>
    <div className="mt-6">
      <Grid cols={3}>
        <Stat value="26.1.5" unit="Docker" label="Debian 源 docker.io，已设开机自启" />
        <Stat value="Jazzy" unit="LTS" label="对应 Ubuntu 24.04，维护到 2029-05" tone="good" />
        <Stat value="896" unit="MB" label="ros:jazzy-ros-base 镜像体积" tone="brand" />
      </Grid>
    </div>
  </Frame>
);

const ProxySetup = () => (
  <Frame kicker="部署" floor="07" title="网络：镜像站不稳，改走本机 Clash 代理" wide>
    <div className="space-y-5">
      <Grid cols={2}>
        <Card title="Docker Hub 直连超时" icon={AlertTriangle} tone="warn">
          registry-1.docker.io 在树莓派上不可达。
        </Card>
        <Card title="国内镜像站拉大 layer 会卡" icon={Gauge} tone="warn">
          小镜像能拉，但 ros:jazzy-ros-base 的大 layer 反复「Download complete 后不推进」。
        </Card>
        <Card title="本机 Clash 代理稳定" icon={Wifi} tone="good">
          Clash Verge allow-lan: true、mixed-port 7897；Pi 走 192.168.31.57:7897。
        </Card>
        <Card title="给 dockerd 配代理" icon={Network}>
          写在 systemd drop-in，不是 daemon.json；同时清空 registry-mirrors。
        </Card>
      </Grid>
      <Code>
        /etc/systemd/system/docker.service.d/http-proxy.conf
        <br />
        <br />
        [Service]
        <br />
        Environment="HTTP_PROXY=http://192.168.31.57:7897"
        <br />
        Environment="HTTPS_PROXY=http://192.168.31.57:7897"
        <br />
        Environment="NO_PROXY=localhost,127.0.0.1,::1"
        <br />
        <br />
        sudo systemctl daemon-reload &amp;&amp; sudo systemctl restart docker
      </Code>
      <Quote>拉镜像前确认本机 Clash 在运行且开了 allow-lan；已拉好的镜像与运行中的容器不受影响。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：Clash 代理与 dockerd 配置（完整命令）">
        <Pre>{`# 本机 Clash Verge：allow-lan: true，mixed-port: 7897

# Pi 上先验证代理连通（期望 401）
curl -sS -o /dev/null -w '%{http_code}\\n' --max-time 12 \\
  -x http://192.168.31.57:7897 https://registry-1.docker.io/v2/

# 给 dockerd 配代理（systemd drop-in，不是 daemon.json）
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf >/dev/null <<'EOF'
[Service]
Environment="HTTP_PROXY=http://192.168.31.57:7897"
Environment="HTTPS_PROXY=http://192.168.31.57:7897"
Environment="NO_PROXY=localhost,127.0.0.1,::1,172.26.188.116,192.168.31.29"
EOF

# 清空 registry-mirrors，避免请求绕远
echo '{}' | sudo tee /etc/docker/daemon.json

sudo systemctl daemon-reload
sudo systemctl restart docker
systemctl show docker --property=Environment`}</Pre>
        <p className="text-[0.84rem] text-muted">直连网线不可用时，把代理地址换成 <code>172.26.188.100:7897</code>。</p>
      </Steps>
    </div>
  </Frame>
);

const Install = () => (
  <Frame kicker="部署" floor="08" title="安装与拉取" wide>
    <div className="space-y-5">
      <Code>
        sudo apt-get install -y docker.io &nbsp;&nbsp;# Debian 13 自带 26.1.5
        <br />
        sudo systemctl enable --now docker
        <br />
        sudo usermod -aG docker nanzhida &nbsp;&nbsp;# 之后免 sudo
        <br />
        <br />
        docker pull ros:jazzy-ros-core &nbsp;&nbsp;# 511 MB（最小集）
        <br />
        docker pull ros:jazzy-ros-base &nbsp;&nbsp;# 896 MB（推荐）
      </Code>
      <DataTable
        head={["镜像", "Image ID", "大小"]}
        rows={[
          ["ros:jazzy-ros-base", "2ff2feced2a6", "896 MB（含 rclcpp / rclpy）"],
          ["ros:jazzy-ros-core", "c9df25bdf5d9", "511 MB（最小可运行集）"],
        ]}
      />
      <Quote>本次实测：Docker 26.1.5+dfsg1，Driver overlay2，Arch aarch64。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：Docker 安装与拉取（完整命令）">
        <Pre>{`# 装 Docker（Debian 13 自带 26.1.5）
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker nanzhida      # 之后免 sudo，需重新登录

# 拉镜像（依赖本机 Clash 代理已就绪）
docker pull ros:jazzy-ros-core        # 511 MB
docker pull ros:jazzy-ros-base        # 896 MB（推荐）

# 确认
docker images | grep ros
docker version`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Verify = () => (
  <Frame kicker="验证" floor="09" title="跑起来才算装上" wide>
    <Grid cols={2}>
      <div className="space-y-4">
        <Card title="容器内 ROS 2 可用" icon={CheckCircle2} tone="good">
          ROS_DISTRO = jazzy；ros2 pkg list 共 194 个包；rclpy 可导入。
        </Card>
        <Card title="发布 / 订阅回环通过" icon={Rocket} tone="good">
          ros2 topic pub 发字符串，ros2 topic echo 收到 hello_from_pi。
        </Card>
        <Card title="启动器已就位" icon={Terminal}>
          Pi 上 ~/ros2.sh 一条命令进入容器并自动 source 环境。
        </Card>
      </div>
      <Code>
        docker run --rm --network host ros:jazzy-ros-base \
        <br />
        &nbsp;&nbsp;bash -lc 'source /opt/ros/jazzy/setup.bash; ...'
        <br />
        <br />
        ROS_DISTRO=jazzy
        <br />
        pkg_count=194
        <br />
        rclpy: rclpy
        <br />
        <br />
        --- pub/sub test ---
        <br />
        data: hello_from_pi
      </Code>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：自测复现命令（容器内发布/订阅回环）">
        <Pre>{`docker run --rm --network host ros:jazzy-ros-base bash -lc '
  source /opt/ros/jazzy/setup.bash
  echo "ROS_DISTRO=$(printenv ROS_DISTRO)"; echo "pkg_count=$(ros2 pkg list | wc -l)"
  ros2 topic pub -r 5 /kilo_test std_msgs/msg/String "{data: hello_from_pi}" >/tmp/pub.log 2>&1 &
  sleep 3; timeout 5 ros2 topic echo --once /kilo_test; kill %1'

# 期望输出
# ROS_DISTRO=jazzy
# pkg_count=194
# rclpy: rclpy
# data: hello_from_pi`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Daily = () => (
  <Frame kicker="使用" floor="10" title="日常使用" wide>
    <div className="space-y-5">
      <Grid cols={3}>
        <Card title="进入环境" icon={Terminal}>
          ~/ros2.sh
        </Card>
        <Card title="挂摄像头" icon={Cable}>
          ~/ros2.sh --device /dev/video0
        </Card>
        <Card title="挂 GPIO / I2C" icon={Layers}>
          ~/ros2.sh --device /dev/i2c-1 --device /dev/gpiomem
        </Card>
      </Grid>
      <DataTable
        head={["要点", "说明"]}
        rows={[
          ["--network host", "单机多容器 ROS 2 通信最省心，避免 DDS 跨容器发现配置"],
          ["硬件访问", "摄像头 / 串口 / GPIO 默认不进容器，必须显式 --device"],
          ["示例包", "ros-base 不含 demo_nodes；需要时容器内 apt install ros-jazzy-demo-nodes-cpp"],
          ["环境变量", "新 shell 要 source setup.bash（ros2.sh 已自动处理），多容器用同一 ROS_DOMAIN_ID"],
        ]}
      />
    </div>
    <div className="mt-4">
      <Steps title="展开：ros2.sh 启动器与常用映射（完整）">
        <Pre>{`# /home/nanzhida/ros2.sh
#!/bin/bash
exec docker run -it --rm --network host --name ros2 "$@" \\
  ros:jazzy-ros-base bash -lc 'source /opt/ros/jazzy/setup.bash; echo "ROS 2 ready."; exec bash'

# 用法
~/ros2.sh                                    # 进入 ROS 2
~/ros2.sh --device /dev/video0               # 挂摄像头
~/ros2.sh --device /dev/i2c-1 --device /dev/gpiomem   # 挂 GPIO / I2C
~/ros2.sh --device /dev/ttyAMA0              # 挂串口（后续接 Agent）

# 多容器互通：都加 --network host，并用同一 ROS_DOMAIN_ID`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Checklist = () => (
  <Frame kicker="收尾" floor="11" title="记住这几条">
    <div className="space-y-5">
      <Quote>树莓派装 ROS 2；micro-ROS 只在有 MCU 做实时底层时才出现在 MCU 上。</Quote>
      <Grid cols={2}>
        <Card title="已在 Pi 上就绪" icon={CheckCircle2} tone="good">
          Docker 26.1.5、ros:jazzy-ros-base（896 MB）、~/ros2.sh。
        </Card>
        <Card title="拉镜像的前提" icon={Wifi} tone="warn">
          本机 Clash 在运行且 allow-lan；关掉则 docker pull 失败。
        </Card>
        <Card title="配套下载（随 deck 分发）" icon={Download}>
          <a className="font-semibold text-brand-700 underline" href="./files/ROS2消息通路验证.zip">
            ROS2消息通路验证.zip
          </a>
          （ping.py / pong.py / README，跨机 DDS 验证脚本）。
        </Card>
        <Card title="下一步" icon={ListChecks}>
          在容器里跑视觉节点；若要接 MCU，再起 micro-ROS Agent。
        </Card>
      </Grid>
    </div>
    <div className="mt-4">
      <Steps title="展开：micro-ROS 在本项目的落地（2026-09 实测）">
        <Pre>{`# 1) Pi 侧 Agent：zhangsk 的 ~/microros_ws（micro-ROS-Agent + micro_ros_msgs，
#    均取 jazzy 分支、--depth 1）colcon build --symlink-install 成功（约 2 分半）
docker run -d --name microros_agent --network host \\
  -v ~/microros_ws:/microros_ws ros:jazzy-ros-base bash -lc \\
  'source /opt/ros/jazzy/setup.bash; source /microros_ws/install/setup.bash; \\
   exec ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888'
# 看日志 / 停止：docker logs -f microros_agent ｜ docker rm -f microros_agent

# 2) ESP32-S3 侧：教学demo/ESP32-S3-microROS/（micro_ros_platformio，
#    board_microros_distro = jazzy + board_microros_transport = wifi，
#    节点名 esp32_car，接 /cmd_vel、发 /esp32/heartbeat）
#    首次要编 libmicroros，Windows 原生编不了 → 见 docs/工具链与踩坑.md 第二节

# 3) 踩坑：Agent 固定跑在默认 DDS 域 0，不认 ROS_DOMAIN_ID
#    Pi 侧客户端若 export ROS_DOMAIN_ID=42，连 /esp32/heartbeat 都看不到

# 4) 结果：ros2 node list → /esp32_car；/esp32/heartbeat ≈1 Hz；
#    teleop 发 /cmd_vel 后左右履带前进/后退/左转/右转/停车方向全对（架空台架实测）

# 来源：micro-ROS 官站 https://micro.vulcanexus.org/
#       硬件列表 https://micro.vulcanexus.org/docs/overview/hardware/
#       Pi 安装指引 https://docs.ros.org/en/jazzy/How-To-Guides/Installing-on-Raspberry-Pi.html
#       REP-2000 https://reps.openrobotics.org/rep-2000/ ｜ 官方镜像 https://hub.docker.com/_/ros`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Wsl2Ros = () => (
  <Frame kicker="跨机验证" floor="12" title="WSL2 里再装一份 ROS 2" wide>
    <Grid cols={2}>
      <Card title="Ubuntu 24.04 + Jazzy" icon={Server}>
        WSL2 里 apt 装 ros-jazzy-ros-base，与树莓派同版本，作为独立的第二节点。
      </Card>
      <Card title="apt 走 TUNA 镜像" icon={Download}>
        http://mirrors.tuna.tsinghua.edu.cn/ros2/ubuntu，比官方源快很多。
      </Card>
      <Card title="镜像网络模式" icon={Network}>
        .wslconfig 设 networkingMode=Mirrored，WSL 直接持有宿主 IP 172.26.188.100。
      </Card>
      <Card title="配置即用" icon={CheckCircle2} tone="good">
        ~/.bashrc 已 source setup.bash；ros2 直接可用，与 Pi 直连同网段。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：WSL2 装 ROS 2（完整步骤）">
        <Pre>{`# WSL2（Ubuntu 24.04）内执行
sudo apt install -y curl gnupg lsb-release
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key \\
  -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \\
http://mirrors.tuna.tsinghua.edu.cn/ros2/ubuntu noble main" \\
  | sudo tee /etc/apt/sources.list.d/ros2.list
sudo apt update
sudo apt install -y ros-jazzy-ros-base

# 每个新 shell 都要 source（写进 ~/.bashrc 即自动）
echo 'source /opt/ros/jazzy/setup.bash' >> ~/.bashrc

# .wslconfig（Windows 用户目录）：镜像网络，WSL 直接持有宿主 IP
# [wsl2]
# networkingMode=Mirrored
# hostAddressLoopback=true`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const CrossDds = () => (
  <Frame kicker="跨机验证" floor="13" title="跨机 DDS 的两个前提" wide>
    <div className="space-y-5">
      <Grid cols={2}>
        <Card title="同一 ROS_DOMAIN_ID" icon={Layers}>
          两端都设 42，与默认域隔离，避免和别的节点串在一起。
        </Card>
        <Card title="ROS_STATIC_PEERS 指对端" icon={Cable}>
          WSL → 172.26.188.116，Pi → 172.26.188.100，绕开多网卡 / 组播发现的坑。
        </Card>
        <Card title="入站 UDP 默认被拦" icon={AlertTriangle} tone="warn">
          WSL Hyper-V 防火墙入站 Block + Windows 防火墙网卡 Public；Pi→WSL 连 ping 都 100% 丢。
        </Card>
        <Card title="定向放行（需管理员）" icon={ShieldCheck} tone="good">
          只放行 172.26.188.116 的 UDP 入站：Hyper-V 规则 + Windows 规则各一条。
        </Card>
      </Grid>
      <Quote>判据：从 Pi ping 172.26.188.100 若 100% 丢包，就是本机入站被拦。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：跨机 DDS 配置与放行（完整）">
        <Pre>{`# 两端都用同一个域，并指定对端直连 IP
export ROS_DOMAIN_ID=42
export ROS_STATIC_PEERS=172.26.188.116   # WSL 侧指向 Pi
export ROS_STATIC_PEERS=172.26.188.100   # Pi 侧指向 WSL

# 本机入站 UDP 默认被拦，需管理员加定向放行：
#   WSL Hyper-V 防火墙 + Windows 防火墙各一条
#   只放行 172.26.188.116 的 UDP 入站
# 判据：从 Pi ping 172.26.188.100，若 100% 丢包即入站被拦

# WSL 侧测连通
ping -c 2 172.26.188.116`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const PingPong = () => (
  <Frame kicker="跨机验证" floor="14" title="ping-pong 实测" wide>
    <Grid cols={2}>
      <div className="space-y-4">
        <Card title="分工" icon={Terminal}>
          ping.py 跑 WSL2；pong.py 跑树莓派容器（--network host --hostname pi-zhangsk）。
        </Card>
        <Card title="话题" icon={Network}>
          /kilo_ping（WSL→Pi）与 /kilo_pong（Pi→WSL），std_msgs/String。
        </Card>
        <Card title="结果 5/5" icon={CheckCircle2} tone="good">
          RTT 1–2 ms，avg 1.3 ms；回包带 @pi-zhangsk，证明经过树莓派 ROS 2 图。
        </Card>
        <Card title="复现" icon={BookOpen}>
          脚本与防火墙规则见{" "}
          <a className="font-semibold text-brand-700 underline" href="./files/ROS2消息通路验证.zip">
            ROS2消息通路验证.zip
          </a>
          。
        </Card>
      </div>
      <Code>
        ROS_DOMAIN_ID=42 ROS_STATIC_PEERS=172.26.188.116 \
        <br />
        &nbsp;&nbsp;python3 ping.py 5 3
        <br />
        <br />
        peer found, starting ping-pong
        <br />
        5/5 rounds answered
        <br />
        min=1.0 ms&nbsp;&nbsp;max=2.0 ms&nbsp;&nbsp;avg=1.3 ms
        <br />
        pong='...|pong#1@pi-zhangsk'
      </Code>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：ping-pong 复现命令">
        <Pre>{`# WSL2：发 ping
cd 教学demo/ROS2消息通路验证
ROS_DOMAIN_ID=42 ROS_STATIC_PEERS=172.26.188.116 python3 ping.py 5 3

# 树莓派容器内：跑 pong
docker run -it --rm --network host --hostname pi-zhangsk \\
  -e ROS_DOMAIN_ID=42 -e ROS_STATIC_PEERS=172.26.188.100 \\
  ros:jazzy-ros-base bash
# 容器内
source /opt/ros/jazzy/setup.bash
python3 pong.py

# 期望：5/5 rounds answered，RTT 1–2 ms，回包带 @pi-zhangsk`}</Pre>
      </Steps>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "一句话区分", group: "概览", el: <Difference /> },
  { nav: "为什么选 ROS 2", group: "选型", el: <WhyPi /> },
  { nav: "决策速查", group: "选型", el: <Decision /> },
  { nav: "何时用 micro-ROS", group: "选型", el: <WhenMicro /> },
  { nav: "部署方案对比", group: "部署", el: <Options /> },
  { nav: "Docker + Jazzy", group: "部署", el: <ChosenDocker /> },
  { nav: "Clash 代理加速", group: "部署", el: <ProxySetup /> },
  { nav: "安装与拉取", group: "部署", el: <Install /> },
  { nav: "验证", group: "验证", el: <Verify /> },
  { nav: "日常使用", group: "使用", el: <Daily /> },
  { nav: "WSL2 侧 ROS 2", group: "跨机验证", el: <Wsl2Ros /> },
  { nav: "跨机 DDS 前置", group: "跨机验证", el: <CrossDds /> },
  { nav: "ping-pong 实测", group: "跨机验证", el: <PingPong /> },
  { nav: "快速清单", group: "收尾", el: <Checklist /> },
];
