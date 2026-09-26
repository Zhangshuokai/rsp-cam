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
import { Frame, Card, DataTable, Grid, Quote, Focus } from "./components.jsx";

/* 代码块：whitespace-pre 保留缩进与换行 */
const Code = ({ children }) => (
  <div className="surface overflow-x-auto whitespace-pre p-4 font-mono text-[0.74rem] leading-relaxed text-ink md:text-[0.8rem]">
    {children}
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
      aside={
        <Code>{`ESP32-S3  micro-ROS client
   │  UDP4 :8888
   ▼
树莓派  micro-ROS Agent
   │
ROS 2 图
   /cmd_vel        ← teleop 发布
   /esp32/heartbeat → 监听节点订阅`}</Code>
      }
    />
  </Frame>
);

const Esp32Env = () => (
  <Frame kicker="准备" floor="03" title="ESP32 侧：PlatformIO + micro-ROS" wide>
    <div className="space-y-5">
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
    </div>
  </Frame>
);

const AgentSetup = () => (
  <Frame kicker="准备" floor="04" title="树莓派侧：在 ROS 2 容器里跑 Agent" wide>
    <div className="space-y-5">
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
    <div className="mt-5">
      <Quote>本课默认 UDP4——车能自由移动，不必拖一根数据线。</Quote>
    </div>
  </Frame>
);

const Skeleton = () => (
  <Frame kicker="编程" floor="06" title="固件骨架：rclc 五步" wide>
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
  </Frame>
);

const Heartbeat = () => (
  <Frame kicker="编程" floor="07" title="发心跳：发布者 + 定时器" wide>
    <div className="space-y-5">
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
    </div>
  </Frame>
);

const CmdVel = () => (
  <Frame kicker="编程" floor="08" title="收指令：订阅 /cmd_vel" wide>
    <div className="space-y-5">
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
    <div className="space-y-5">
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
    </div>
  </Frame>
);

const Startup = () => (
  <Frame kicker="运行" floor="11" title="启动顺序：先 Agent，后上电" wide>
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
  </Frame>
);

const Verify = () => (
  <Frame kicker="验证" floor="12" title="验证清单" wide>
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
    <div className="mt-5">
      <Quote>心跳稳定、指令能到，说明「Pi 算 + MCU 控」的通路通了。</Quote>
    </div>
  </Frame>
);

const Pitfalls = () => (
  <Frame kicker="排障" floor="13" title="常见坑与排查" wide>
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
