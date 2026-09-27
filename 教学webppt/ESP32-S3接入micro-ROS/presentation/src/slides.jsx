import React from "react";
import {
  Cpu,
  Server,
  Network,
  Terminal,
  Cable,
  Wifi,
  Rocket,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Gauge,
  Send,
  Download,
  Play,
  Boxes,
  BookOpen,
  CircuitBoard,
  Wrench,
  Activity,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps } from "./components.jsx";

/* 代码块：whitespace-pre 保留缩进与换行 */
const Code = ({ children }) => (
  <div className="surface overflow-x-auto whitespace-pre p-4 font-mono text-[0.74rem] leading-relaxed text-ink md:text-[0.8rem]">
    {children}
  </div>
);

/* 架构示意图：内联 SVG（离线单文件，不用 ASCII / 线框图） */
const ArchFlow = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 460 330"
      role="img"
      aria-label="ESP32-S3 经 micro-ROS Agent 接入 ROS 2 的数据流"
      className="h-auto w-full"
    >
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="80" y="14" width="300" height="60" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="230" y="40" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="700">ESP32-S3</text>
      <text x="230" y="60" textAnchor="middle" fill="#475569" fontSize="12">micro-ROS 客户端（rcl + rclc）</text>

      <line x1="230" y1="74" x2="230" y2="118" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <text x="242" y="100" fill="#0f766e" fontSize="12">UDP4 :8888</text>

      <rect x="80" y="120" width="300" height="60" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <text x="230" y="146" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="700">树莓派 micro-ROS Agent</text>
      <text x="230" y="166" textAnchor="middle" fill="#475569" fontSize="12">ROS 2 容器 · --network host</text>

      <line x1="230" y1="180" x2="230" y2="224" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />

      <rect x="80" y="226" width="300" height="92" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="230" y="252" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="700">ROS 2 图</text>
      <text x="230" y="276" textAnchor="middle" fill="#475569" fontSize="12">/cmd_vel ← teleop 发布</text>
      <text x="230" y="298" textAnchor="middle" fill="#475569" fontSize="12">/esp32/heartbeat → 监听节点订阅</text>
    </svg>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-26
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      ESP32-S3 接入 micro-ROS
      <br />
      <span className="text-brand-600">把控制板变成 ROS 2 节点</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      在 ESP32-S3 上写 micro-ROS 固件，通过树莓派上的 <b>micro-ROS Agent</b> 接入 ROS 2：
      收 <code>/cmd_vel</code> 控车，发 <code>/esp32/heartbeat</code> 报活。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开完整步骤」可看该步的全量命令与完整代码。
    </p>
  </div>
);

const Goal = () => (
  <Frame kicker="概览" floor="01" title="本课目标：一收一发都跑通">
    <Grid cols={2}>
      <Card title="ESP32-S3 侧" icon={Cpu}>
        用 PlatformIO 写 micro-ROS 固件：连 Wi-Fi、连 Agent、发心跳、订阅 /cmd_vel。
      </Card>
      <Card title="树莓派侧" icon={Server}>
        在 ROS 2 容器里跑 micro-ROS Agent（UDP4:8888），把 S3 接进 ROS 2 图。
      </Card>
      <Card title="两条链路" icon={Send}>
        Pi → S3：<code>/cmd_vel</code>（geometry_msgs/Twist）；S3 → Pi：<code>/esp32/heartbeat</code>。
      </Card>
      <Card title="验收标准" icon={CheckCircle2} tone="good">
        <code>ros2 topic echo</code> 能看到心跳；按键控车时 S3 能收到 Twist。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>先跑通通路，再把回调里的转向量换成真正的电机控制。</Quote>
    </div>
  </Frame>
);

const Architecture = () => (
  <Frame kicker="概览" floor="02" title="三个角色：谁连谁" wide>
    <Focus
      no="3"
      title="S3 不是直接说 DDS"
      tag="Micro XRCE-DDS"
      goal="受限设备用 Micro XRCE-DDS：S3 只和 Agent 建一条会话，Agent 再把它翻译成 ROS 2 里的普通节点。"
      points={[
        "ESP32-S3：micro-ROS 客户端（rcl + rclc），内存占用几十 KB。",
        "micro-ROS Agent：跑在树莓派 ROS 2 容器里，本身是一个 ROS 2 节点。",
        "ROS 2 图：teleop、监听节点都在这里，与 S3 经 Agent 收发。",
        "传输：Wi-Fi 下用 UDP4；有线场景可用串口。",
        "Agent 依附在完整 ROS 2 上——micro-ROS 不能替代 ROS 2。",
      ]}
      aside={<ArchFlow />}
    />
  </Frame>
);

const Esp32Env = () => (
  <Frame kicker="准备" floor="03" title="ESP32 侧：PlatformIO + micro-ROS" wide>
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="为什么用 PlatformIO" icon={Wrench}>
          官方示例即 VSCode + PlatformIO；装依赖、编译、烧录一条龙。
        </Card>
        <Card title="micro-ROS 是依赖" icon={Download}>
          在 platformio.ini 里引用 micro_ros_platformio，固件头文件用 <code>micro_ros_arduino.h</code>。
        </Card>
        <Card title="板型与传输" icon={CircuitBoard}>
          板型选 ESP32-S3；传输选 <code>wifi</code>（或 <code>serial</code>）。
        </Card>
        <Card title="版本要对齐" icon={Layers}>
          固件 <code>board_microros_distro = jazzy</code>，与 Pi 上 ROS 2 版本一致。
        </Card>
      </Grid>
      <Code>{`[env:esp32-s3-devkitc-1]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
board_microros_distro = jazzy
board_microros_transport = wifi
lib_deps =
  https://github.com/micro-ROS/micro_ros_platformio.git`}</Code>
      <Steps title="展开：从零建工程（完整步骤）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            安装 VSCode，再装扩展 <b>PlatformIO IDE</b>；首次打开会自动安装 PlatformIO Core。
          </li>
          <li>
            PlatformIO Home → <b>New Project</b>：名称自定，Board 选{" "}
            <code>ESP32-S3-DevKitC-1</code>，Framework 选 <code>Arduino</code>。
          </li>
          <li>
            把生成的 <code>platformio.ini</code> 替换为上面的配置（板型、传输、micro-ROS 依赖）。
          </li>
          <li>
            保存后 PlatformIO 自动下载 espressif32 平台与 <code>micro_ros_platformio</code>；
            首次较慢，需能访问 GitHub（国内走本机 Clash 代理）。
          </li>
          <li>
            在 <code>src/main.cpp</code> 里 <code>#include &lt;micro_ros_arduino.h&gt;</code>，转到「固件骨架」页继续。
          </li>
        </ol>
        <p className="text-[0.84rem] text-muted">
          提示：关键是把 <code>board_microros_transport</code> 设为 <code>wifi</code> 或{" "}
          <code>serial</code>；SSID、密码与 Agent IP 在固件里设置（见「固件骨架」）。
        </p>
      </Steps>
    </div>
  </Frame>
);

const AgentSetup = () => (
  <Frame kicker="准备" floor="04" title="树莓派侧：在 ROS 2 容器里跑 Agent" wide>
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="构建来源" icon={Boxes}>
          官方源码 micro-ROS-Agent + micro_ros_msgs（jazzy 分支），用 colcon build。
        </Card>
        <Card title="构建产物要持久化" icon={Layers} tone="warn">
          <code>~/ros2.sh</code> 是 <code>--rm</code> 一次性容器；用 <code>-v</code> 把工作区挂进容器。
        </Card>
        <Card title="网络必须 host" icon={Network}>
          <code>--network host</code> 时 Agent 的 UDP 8888 才落在 Pi 的宿主网络上。
        </Card>
        <Card title="先起 Agent 再上电" icon={Play}>
          S3 上电后主动连 Agent；Agent 要先在监听，否则固件一直重连。
        </Card>
      </Grid>
      <Code>{`docker run -it --rm --network host \\
  -v ~/microros_ws:/microros_ws \\
  ros:jazzy-ros-base bash

# 容器内（首次先构建）
source /opt/ros/jazzy/setup.bash
cd /microros_ws && colcon build
source install/setup.bash
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888`}</Code>
      <Steps title="展开：Pi 上完整部署步骤（含拉源码）">
        <Code>{`# --- 宿主机（Pi）上执行 ---
mkdir -p ~/microros_ws/src

docker run -it --rm --network host \\
  -v ~/microros_ws:/microros_ws \\
  --name microros \\
  ros:jazzy-ros-base bash

# --- 以下都在容器内执行 ---
source /opt/ros/jazzy/setup.bash
cd /microros_ws

# 首次：拉取官方 Agent 与消息包（jazzy 分支）
git clone -b jazzy \\
  https://github.com/micro-ROS/micro-ROS-Agent.git src/micro-ROS-Agent
git clone -b jazzy \\
  https://github.com/micro-ROS/micro_ros_msgs.git src/micro_ros_msgs

# 首次若缺依赖（可选）
apt-get update && apt-get install -y python3-rosdep
rosdep update
rosdep install --from-paths src --ignore-src -y

# 首次：编译 Agent
colcon build --symlink-install
source install/setup.bash

# 之后每次启动 Agent
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888`}</Code>
        <p className="text-[0.84rem] text-muted">
          工作区挂载在宿主机 <code>~/microros_ws</code>，容器 <code>--rm</code> 退出也不丢；
          下次重进只需 <code>source /microros_ws/install/setup.bash</code>。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Transport = () => (
  <Frame kicker="准备" floor="05" title="用 UDP 还是串口" wide>
    <DataTable
      head={["", "UDP4（Wi-Fi）", "串口（Serial）"]}
      rows={[
        ["接线", "无线，S3 不用连 Pi", "USB / GPIO 串口线接到 Pi"],
        ["地址", "填 Pi 的 IP + 端口 8888", "指定 /dev/tty*（要 --device 进容器）"],
        ["适合", "遥控、移动小车", "调试、固定安装"],
        [
          "注意",
          <strong className="font-bold text-ink">S3 只连 2.4 GHz Wi-Fi，且与 Pi 同网段</strong>,
          "别和 serial monitor 抢同一个串口",
        ],
      ]}
    />
    <div className="mt-4">
      <Quote>本课默认 UDP4——车能自由移动，不必拖一根数据线。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：串口传输的完整步骤（备选）">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <code>platformio.ini</code> 里把 <code>board_microros_transport</code> 改成{" "}
            <code>serial</code>，固件里改用 <code>set_microros_transports()</code>。
          </li>
          <li>把板子用 USB 接到 Pi，确认串口设备：<code>ls -l /dev/ttyUSB* /dev/ttyACM*</code>。</li>
          <li>
            启动 Agent 时加上串口设备（容器要映射）：<code>--dev /dev/ttyUSB0</code>。
          </li>
        </ol>
        <Code>{`# 容器内（映射串口后）
ros2 run micro_ros_agent micro_ros_agent serial --dev /dev/ttyUSB0 -b 115200

# 宿主机起容器时映射串口
docker run -it --rm --network host \\
  --device /dev/ttyUSB0 \\
  -v ~/microros_ws:/microros_ws ros:jazzy-ros-base bash`}</Code>
      </Steps>
    </div>
  </Frame>
);

const Skeleton = () => (
  <Frame kicker="编程" floor="06" title="固件骨架：rclc 五步" wide>
    <div className="space-y-4">
      <Focus
        no="5"
        title="初始化顺序是固定的"
        tag="rclc"
        goal="micro-ROS 固件的结构就是「接传输 → 建 allocator/support → 建节点 → 建收发 → 交给 executor」。"
        points={[
          "连接：set_microros_wifi_transports(SSID, PASS, AgentIP, 8888)。",
          "内存与上下文：rcl_get_default_allocator + rclc_support_init。",
          "节点：rclc_node_init_default(&node, \"esp32_node\", \"\", &support)。",
          "收发：publisher / subscription / timer 都挂到 executor。",
          "loop()：rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100))。",
        ]}
        aside={
          <Code>{`set_microros_wifi_transports(
  "SSID", "PASS", "192.168.31.29", 8888);

allocator = rcl_get_default_allocator();
rclc_support_init(&support, 0, NULL, &allocator);
rclc_node_init_default(
  &node, "esp32_node", "", &support);`}</Code>
        }
      />
      <Steps title="展开：最小可编译固件 main.cpp（完整）">
        <Code>{`#include <micro_ros_arduino.h>

#include <rcl/rcl.h>
#include <rclc/rclc.h>
#include <rclc/executor.h>

rcl_allocator_t allocator;
rclc_support_t  support;
rcl_node_t      node;

void setup() {
  // ① 接传输：Wi-Fi 名 / 密码 / Agent 的 IP / 端口
  set_microros_wifi_transports(
    "SSID", "PASS", "192.168.31.29", 8888);

  // ② 内存与上下文
  allocator = rcl_get_default_allocator();
  rclc_support_init(&support, 0, NULL, &allocator);

  // ③ 建节点（名字就是 ros2 node list 里看到的名字）
  rclc_node_init_default(&node, "esp32_node", "", &support);
}

void loop() {
  delay(100);   // ④⑤ 的收发在后面的页里挂上来
}`}</Code>
      </Steps>
    </div>
  </Frame>
);

const Heartbeat = () => (
  <Frame kicker="编程" floor="07" title="发心跳：发布者 + 定时器" wide>
    <div className="space-y-4">
      <Code>{`rclc_publisher_init_default(&pub, &node,
  ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
  "esp32/heartbeat");

rclc_timer_init_default(
  &timer, &support, RCL_MS_TO_NS(1000), timer_cb);

rclc_executor_init(&executor, &support.context, 2, &allocator);
rclc_executor_add_timer(&executor, &timer);

void timer_cb(rcl_timer_t *t, int64_t last_call) {
  static int n = 0;
  msg.data = ++n;
  rcl_publish(&pub, &msg, NULL);   // 每秒一次
}`}</Code>
      <Grid cols={3}>
        <Card title="话题" icon={Send}>
          /esp32/heartbeat，示例用 std_msgs/Int32。
        </Card>
        <Card title="周期" icon={Gauge}>
          1000 ms；RCL_MS_TO_NS 把毫秒换成纳秒。
        </Card>
        <Card title="作用" icon={Activity}>
          证明 S3 在线，Pi 端可统计收包频率。
        </Card>
      </Grid>
      <Steps title="展开：加上发布者与定时器（完整固件）">
        <Code>{`rcl_publisher_t pub;
std_msgs__msg__Int32 msg;
rcl_timer_t      timer;
rclc_executor_t  executor;

void timer_cb(rcl_timer_t *t, int64_t last_call) {
  msg.data++;
  rcl_publish(&pub, &msg, NULL);   // 每秒发一次
}

void setup() {
  /* …前面骨架的 ①②③ 三步… */

  // ④ 发布者 + 定时器
  rclc_publisher_init_default(&pub, &node,
    ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
    "esp32/heartbeat");
  rclc_timer_init_default(&timer, &support,
    RCL_MS_TO_NS(1000), timer_cb);

  // ⑤ 挂到 executor（句柄数 ≥ 实际实体数）
  rclc_executor_init(&executor, &support.context, 2, &allocator);
  rclc_executor_add_timer(&executor, &timer);
}

void loop() {
  rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100));
}`}</Code>
      </Steps>
    </div>
  </Frame>
);

const CmdVel = () => (
  <Frame kicker="编程" floor="08" title="收指令：订阅 /cmd_vel" wide>
    <div className="space-y-4">
      <Code>{`geometry_msgs__msg__Twist msg;
rclc_subscription_init_default(&sub, &node,
  ROSIDL_GET_MSG_TYPE_SUPPORT(geometry_msgs, msg, Twist),
  "cmd_vel");
rclc_executor_add_subscription(
  &executor, &sub, &msg, cmd_cb, ON_NEW_DATA);

void cmd_cb(const void *msgin) {
  const geometry_msgs__msg__Twist *m =
      (const geometry_msgs__msg__Twist *)msgin;
  // m->linear.x  前后
  // m->linear.y  横移
  // m->angular.z 转向
  // TODO：换成 EMO_DCMotor 的真实控制
}`}</Code>
      <DataTable
        head={["字段", "含义", "接到板上"]}
        rows={[
          ["linear.x", "前后", "两侧电机同向速度"],
          ["linear.y", "横移", "麦轮平移"],
          ["angular.z", "转向", "左右轮差速"],
        ]}
      />
      <Steps title="展开：加上订阅与回调（完整固件）">
        <Code>{`rcl_subscription_t sub;
geometry_msgs__msg__Twist cmd;

void cmd_cb(const void *msgin) {
  const geometry_msgs__msg__Twist *m =
      (const geometry_msgs__msg__Twist *)msgin;
  float vx = m->linear.x;    // 前后
  float vy = m->linear.y;    // 横移
  float wz = m->angular.z;   // 转向
  (void)vx; (void)vy; (void)wz;
  // TODO：换成 EMO_DCMotor 的 run() / setSpeed()
}

void setup() {
  /* …骨架 + 发布者 + 定时器… */

  // 订阅 /cmd_vel
  rclc_subscription_init_default(&sub, &node,
    ROSIDL_GET_MSG_TYPE_SUPPORT(geometry_msgs, msg, Twist),
    "cmd_vel");
  rclc_executor_add_subscription(
    &executor, &sub, &cmd, cmd_cb, ON_NEW_DATA);

  // 注意：executor 句柄数要覆盖 timer + subscription（如 2）
}`}</Code>
      </Steps>
    </div>
  </Frame>
);

const Params = () => (
  <Frame kicker="编程" floor="09" title="连接参数要填对">
    <Grid cols={2}>
      <Card title="Wi-Fi SSID / 密码" icon={Wifi} tone="warn">
        ESP32-S3 只支持 2.4 GHz；5 GHz 的 SSID 连不上。
      </Card>
      <Card title="Agent IP" icon={Network}>
        填 Pi 在同一网段的地址（如 Wi-Fi 的 192.168.31.29），不是 127.0.0.1。
      </Card>
      <Card title="端口 8888" icon={Cable}>
        与 Agent 启动参数 <code>udp4 --port 8888</code> 一致。
      </Card>
      <Card title="ROS_DOMAIN_ID" icon={Layers}>
        Pi 侧 Agent 与 teleop / 监听节点用同一个域（如 42）。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>这些参数错一个，Agent 日志里就看不到 S3 连上来。</Quote>
    </div>
  </Frame>
);

const BuildFlash = () => (
  <Frame kicker="运行" floor="10" title="编译与烧录（PlatformIO）" wide>
    <div className="space-y-4">
      <Code>{`# 在固件工程目录
pio run             # 编译
pio run -t upload   # 烧录
pio device monitor  # 查看串口日志`}</Code>
      <Grid cols={2}>
        <Card title="板型与端口" icon={CircuitBoard}>
          板子选 ESP32-S3；Type-C 连板，选对 USB 端口。
        </Card>
        <Card title="首次编译慢" icon={Gauge} tone="warn">
          会拉取 micro-ROS 源码并打补丁，需能访问 GitHub，第一次耐心等。
        </Card>
      </Grid>
      <Steps title="展开：从编译到烧录的完整流程">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Type-C 线连板；设备管理器里出现串口（缺驱动装 CP210x / CH34x）。</li>
          <li>PlatformIO 点 <b>Build</b>（等价 <code>pio run</code>）确认能编译通过。</li>
          <li>点 <b>Upload</b>（等价 <code>pio run -t upload</code>）；上传时别同时开串口监视器。</li>
          <li>看日志：<code>pio device monitor -b 115200</code>，<code>Ctrl+C</code> 退出。</li>
          <li>若卡在连接：按住 <b>BOOT</b> 再点 <b>RST</b> 进入下载模式后重试。</li>
        </ol>
        <Code>{`pio run                        # 只编译
pio run -t upload              # 编译并烧录
pio device monitor -b 115200   # 看串口输出`}</Code>
      </Steps>
    </div>
  </Frame>
);

const Startup = () => (
  <Frame kicker="运行" floor="11" title="启动顺序：先 Agent，后上电" wide>
    <div className="space-y-4">
      <Focus
        no="4"
        title="四个步骤"
        tag="顺序"
        goal="先让 Agent 在监听，再给 S3 上电；顺序反了固件会一直重连，需重启 S3。"
        points={[
          "Pi：起 ROS 2 容器（--network host）→ 启动 Agent（udp4 8888）。",
          "Pi：另开终端 source ROS 2 → 运行监听 / 遥操作节点。",
          "S3：上电，固件主动连 Agent。",
          "观察：Agent 打印 session created；topic list 出现 /esp32/heartbeat。",
        ]}
        aside={
          <Code>{`# 终端 A：Agent
ros2 run micro_ros_agent \\
  micro_ros_agent udp4 --port 8888

# 终端 B：看心跳
ROS_DOMAIN_ID=42 ros2 topic echo /esp32/heartbeat

# 终端 C：键盘控车
ROS_DOMAIN_ID=42 ros2 run \\
  teleop_twist_keyboard teleop_twist_keyboard`}</Code>
        }
      />
      <Steps title="展开：三终端完整启动步骤">
        <Code>{`# 每个终端先进入同一个容器
docker exec -it microros bash
source /opt/ros/jazzy/setup.bash

# --- 终端 A：Agent（必须最先起）---
source /microros_ws/install/setup.bash
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888

# --- 终端 B：看心跳 ---
export ROS_DOMAIN_ID=42
ros2 topic echo /esp32/heartbeat

# --- 终端 C：键盘控车 ---
export ROS_DOMAIN_ID=42
# ros-base 不含 teleop，首次安装：
apt-get update && apt-get install -y ros-jazzy-teleop-twist-keyboard
ros2 run teleop_twist_keyboard teleop_twist_keyboard

# 三个终端都就绪后，最后给 ESP32-S3 上电`}</Code>
        <p className="text-[0.84rem] text-muted">
          三个终端必须用同一个 <code>ROS_DOMAIN_ID</code>；跨容器 / 跨机还要保证 DDS 发现可达。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Verify = () => (
  <Frame kicker="验证" floor="12" title="验证清单" wide>
    <div className="space-y-4">
      <DataTable
        head={["检查", "命令", "期望"]}
        rows={[
          ["节点接入", "ros2 node list", "出现 esp32_node"],
          ["话题存在", "ros2 topic list | grep esp32", "/esp32/heartbeat"],
          ["心跳频率", "ros2 topic hz /esp32/heartbeat", "约 1 Hz"],
          ["指令下发", "ros2 topic echo /cmd_vel", "按键后出现 Twist"],
          ["Agent 日志", "session created", "S3 已连上"],
        ]}
      />
      <Steps title="展开：逐条验证命令与期望输出">
        <Code>{`export ROS_DOMAIN_ID=42
source /opt/ros/jazzy/setup.bash

ros2 node list                     # 期望：/esp32_node
ros2 topic list | grep heartbeat   # 期望：/esp32/heartbeat
ros2 topic hz /esp32/heartbeat     # 期望：average rate ≈ 1
ros2 topic echo /esp32/heartbeat   # 期望：data 递增
ros2 topic info /cmd_vel           # 期望：Publisher count ≥ 1

# 先跑 teleop 按键，确认指令真的到了 S3
ros2 topic echo /cmd_vel`}</Code>
        <p className="text-[0.84rem] text-muted">
          节点名以固件里 <code>rclc_node_init_default</code> 的第一个参数为准（本课为{" "}
          <code>esp32_node</code>）。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Pitfalls = () => (
  <Frame kicker="排障" floor="13" title="常见坑与排查" wide>
    <div className="space-y-4">
      <Grid cols={2}>
        <Card title="Agent 没起 / 端口被占" icon={AlertTriangle} tone="warn">
          8888 无监听，S3 一直重连。
        </Card>
        <Card title="IP 或网段错" icon={Network} tone="warn">
          S3 连的不是 Pi；确认与 Pi 在同一 Wi-Fi 网段。
        </Card>
        <Card title="只开了 5 GHz" icon={Wifi} tone="warn">
          ESP32-S3 连不上，改用 2.4 GHz 频段。
        </Card>
        <Card title="容器没加 host 网络" icon={Boxes} tone="warn">
          UDP 8888 只活在容器内，S3 到不了。
        </Card>
        <Card title="DOMAIN_ID 不一致" icon={Layers} tone="warn">
          Agent 与 teleop / 监听节点互相看不见。
        </Card>
        <Card title="串口被监视器占用" icon={Terminal} tone="warn">
          用 serial 传输时先关掉 serial monitor，再让 Agent 开门。
        </Card>
      </Grid>
      <Steps title="展开：连不上时的排查命令">
        <Code>{`# 1) Agent 是否在监听 8888（容器/宿主机内）
ss -lunp | grep 8888

# 2) Pi 上确认自己的 IP（填进固件的那个）
ip -4 addr show wlan0

# 3) 容器是否用了 host 网络
docker inspect -f '{{.HostConfig.NetworkMode}}' microros   # 期望 host

# 4) Agent 日志有没有 S3 会话
#    出现 session established / create session 即已连上

# 5) 网段与频段：S3 与 Pi 必须同网段可达，且用 2.4 GHz
#    Agent IP 若写成 127.0.0.1，S3 永远连不上`}</Code>
      </Steps>
    </div>
  </Frame>
);

const Wrap = () => (
  <Frame kicker="收尾" floor="14" title="记住这几条与下一步">
    <div className="space-y-5">
      <Quote>S3 侧写固件、Pi 侧跑 Agent，两边都到位才有一条 ROS 2 通路。</Quote>
      <Grid cols={2}>
        <Card title="一收一发" icon={ListChecks}>
          S3 发 /esp32/heartbeat、收 /cmd_vel；先跑通再谈控制。
        </Card>
        <Card title="顺序不可反" icon={Play}>
          先起 Agent，再给 S3 上电；断线要重启固件重连。
        </Card>
        <Card title="下一步：真控车" icon={Rocket}>
          把 cmd_cb 里的 Twist 换成 EMO_DCMotor 的 run/setSpeed。
        </Card>
        <Card title="再下一步：闭环" icon={BookOpen}>
          读编码器 / IMU，往 ROS 2 发 /odom 等反馈话题。
        </Card>
      </Grid>
      <p className="text-[0.88rem] leading-relaxed text-muted md:text-[0.95rem]">
        背景与选型见 <code>ROS2与micro-ROS选型</code> deck；硬件、开发与遥控见{" "}
        <code>ESP32-S3电机驱动板</code> deck；官方示例细节见{" "}
        <code>docs/ESP32-S3电机驱动板资料.md</code> 第六节。
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "本课目标", group: "概览", el: <Goal /> },
  { nav: "三个角色", group: "概览", el: <Architecture /> },
  { nav: "ESP32 侧环境", group: "准备", el: <Esp32Env /> },
  { nav: "Pi 侧 Agent", group: "准备", el: <AgentSetup /> },
  { nav: "UDP 还是串口", group: "准备", el: <Transport /> },
  { nav: "固件骨架", group: "编程", el: <Skeleton /> },
  { nav: "发心跳", group: "编程", el: <Heartbeat /> },
  { nav: "收 /cmd_vel", group: "编程", el: <CmdVel /> },
  { nav: "连接参数", group: "编程", el: <Params /> },
  { nav: "编译与烧录", group: "运行", el: <BuildFlash /> },
  { nav: "启动顺序", group: "运行", el: <Startup /> },
  { nav: "验证清单", group: "验证与排障", el: <Verify /> },
  { nav: "常见坑", group: "验证与排障", el: <Pitfalls /> },
  { nav: "小结与下一步", group: "收尾", el: <Wrap /> },
];

export default slides;
