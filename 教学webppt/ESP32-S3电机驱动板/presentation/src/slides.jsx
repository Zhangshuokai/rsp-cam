import React from "react";
import {
  CircuitBoard,
  Layers,
  Cable,
  Wrench,
  Terminal,
  Download,
  AlertTriangle,
  ListChecks,
  Rocket,
  Boxes,
  Wifi,
  CheckCircle2,
  BookOpen,
  Gauge,
  Gamepad2,
  Smartphone,
  Cloud,
  Zap,
  Battery,
  Usb,
  Radio,
  Server,
  Network,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Stat, Pill } from "./components.jsx";

const Code = ({ children }) => (
  <div className="surface overflow-x-auto p-4 font-mono text-[0.78rem] leading-relaxed text-ink md:text-[0.82rem]">
    {children}
  </div>
);

const A = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="break-words font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2"
  >
    {children}
  </a>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-26
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      ESP32-S3 电机驱动板
      <br />
      <span className="text-brand-600">奇果派 S3 机器人控制板</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      一块 ESP32-S3 + 四路电机驱动的集成板：<b>Pi 跑 ROS 2</b> 做视觉与规划，
      <b>ESP32-S3 做实时底层</b>，直接驱动电机、舵机、编码器与 IMU。
    </p>
  </div>
);

const Position = () => (
  <Frame kicker="概览" floor="01" title="在「Pi 算 + MCU 控」里的位置">
    <Grid cols={2}>
      <Card title="它是什么" icon={CircuitBoard}>
        ESP32-S3-WROOM-1-N8R8 模组 + 四路电机驱动 + 传感器/扩展接口的集成驱动板，官方定位"智能小车的完美解决方案"。
      </Card>
      <Card title="算控分离" icon={Layers}>
        Pi 5 跑 ROS 2 做视觉/规划；ESP32-S3 跑硬实时底层，直接驱动电机、舵机、编码器、IMU。
      </Card>
      <Card title="什么时候用它" icon={Zap}>
        需要硬实时闭环（PID、舵机时序）、大量 GPIO/PWM/CAN，或高频采集不想占用主控 CPU。
      </Card>
      <Card title="怎么接进来" icon={Network}>
        MCU 当 ROS 2 的一等节点，走 micro-ROS 进入 ROS 2 图——官方有双向通讯示例。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>本项目结构 = 树莓派 5（算）+ ESP32-S3 电机驱动板（控）。</Quote>
    </div>
  </Frame>
);

const Versions = () => (
  <Frame kicker="硬件" floor="02" title="两个版本：12V 与 24V" wide>
    <DataTable
      head={["项", "12V 版（EMO_Lite）", "24V 版（EM_MAX）"]}
      rows={[
        ["模组", "ESP32-S3-WROOM-1-N8R8，8 MB Flash", "同左"],
        ["驱动芯片", "高性能驱动芯片", "BTN8982"],
        ["电机", "4 路直流 或 2 路步进", "4 路直流"],
        [
          "单路电流",
          "2.2 A（峰值 3.6 A）",
          <strong className="font-bold text-ink">10 A（芯片最高 30 A，长期发热大、不建议）</strong>,
        ],
        ["电机电压", "4.5–13.5 V", "6–24 V"],
        ["推荐输入", "6–12 V，最大 3 A", "6–24 V（匹配电机），最大 10 A"],
      ]}
    />
    <div className="mt-5">
      <Quote>两块板的原理图都在官网资料文档可下载（EMO_Lite / EM_MAX）。</Quote>
    </div>
  </Frame>
);

const Specs = () => (
  <Frame kicker="硬件" floor="03" title="共同规格与接口" wide>
    <Grid cols={3}>
      <Stat value="240" unit="MHz" label="32 位 LX7 双核，集成 Wi-Fi + BLE" />
      <Stat value="8" unit="MB" label="N8R8 模组 Flash" tone="brand" />
      <Stat value="4" unit="路" label="额外 PWM，官方示例支持 4 个舵机" tone="good" />
    </Grid>
    <div className="mt-5">
      <Grid cols={2}>
        <Card title="I2C ×2 / 编码器 ×4" icon={Cable}>
          集成两个 I2C 与四个编码器电机接口，且不占用其它 I2C 设备。
        </Card>
        <Card title="显示 / 姿态 / 电压" icon={Boxes}>
          OLED 显示屏接口、IMU 陀螺仪接口、电压检测模块一应俱全。
        </Card>
        <Card title="三种遥控与联网" icon={Wifi}>
          支持蓝牙手柄、PS2 手柄与 MQTT 物联网远程控制。
        </Card>
        <Card title="供电与下载" icon={Usb}>
          Type-C 供电/下载；推荐动力型电池，供电不足系统会不稳。
        </Card>
      </Grid>
    </div>
  </Frame>
);

const Wiring = () => (
  <Frame kicker="硬件" floor="04" title="接线要点">
    <Grid cols={2}>
      <Card title="普通有刷直流电机" icon={Wrench}>
        电源线插蓝色电机接口，不分正负极；测试发现转向反了，就对调电机正负极。
      </Card>
      <Card title="编码器电机" icon={Gauge}>
        电源线插蓝色接口，编码器数据线插对应的白色接口。
      </Card>
      <Card title="第三方编码器" icon={AlertTriangle} tone="warn">
        板背有引脚标识，VCC/GND 接反会短路烧件；每个编码器占 2 引脚，用满 4 路会占正面 8 个引脚。
      </Card>
      <Card title="舵机" icon={Radio}>
        官方示例对应引脚 5 / 6 / 7 / 15，每排 IO / 5V / GND，插反则舵机不动。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>供电不足会使系统工作不稳定——官方推荐使用动力型（大放电电流）电池。</Quote>
    </div>
  </Frame>
);

const DevPaths = () => (
  <Frame kicker="开发" floor="05" title="四条开发路径" wide>
    <DataTable
      head={["路径", "适合", "备注"]}
      rows={[
        ["程序烧录工具", "不写代码（仅 Windows）", "刷官方示例；集成板选 ESP32-S3 板型"],
        ["Arduino IDE", "C++ 入门", "导入 QGP_EVMotor 库 + 官方示例"],
        ["Mixly 米思奇", "图形化编程", "已配插件环境，适合教学"],
        ["VSCode + PlatformIO", "进阶", "出厂/进阶源码，需找客服索取"],
      ]}
    />
    <div className="mt-5">
      <Quote>同一块板，按需要选一条即可；入门与进阶源码可并存。</Quote>
    </div>
  </Frame>
);

const ArduinoFlow = () => (
  <Frame kicker="开发" floor="06" title="Arduino IDE：五步烧录" wide>
    <Focus
      no="05"
      title="从装环境到上传"
      tag="Arduino IDE"
      goal="官方提供 ESP32 示例代码，覆盖蓝牙手柄、PS2 手柄，以及直流电机、舵机、编码器、电压、陀螺仪、OLED 等设备的用法。"
      points={[
        "装好 Arduino IDE（新手可看官网《安装三板斧》）。",
        "下载库 QGP_EVMotor.zip，用「项目 → 导入库 → 添加 .ZIP 库」导入。",
        "打开「文件 → 示例 → QGP_EVMotor」，先另存再改。",
        "工具 → 开发板 → esp32 → ESP32S3 Dev Module，选对 USB 端口。",
        "Type-C 连板，点上传即可。",
      ]}
      aside={
        <Code>
          库更新：先删旧目录再重导
          <br />
          Documents\Arduino\libraries\QGP_EVMotor
          <br />
          <br />
          #include "StickCB.h"
          <br />
          BLEControlStick _joy;
          <br />
          _joy.setStickCallback(new StickCB());
          <br />
          _joy.begin(); _joy.update();
        </Code>
      }
    />
  </Frame>
);

const ArduinoApi = () => (
  <Frame kicker="开发" floor="07" title="Arduino 常用 API" wide>
    <Code>
      EMotionPI emo;
      <br />
      EMO_DCMotor *m1 = emo.getMotor(M1);
      <br />
      m1-&gt;run(FORWARD); m1-&gt;setSpeed(100);
      <br />
      EMO_Servo *s1 = emo.getServo(S1);
      <br />
      EMO_EncoderMotor *e1 = emo.getEncoderMotor(M1);
      <br />
      e1-&gt;begin(90); &nbsp;&nbsp;// 齿数比 1:90
    </Code>
    <div className="mt-5">
      <DataTable
        head={["对象", "方法", "作用"]}
        rows={[
          ["直流电机", "run(FORWARD / BACKWARD)", "前进 / 后退"],
          ["直流电机", "setSpeed(0–100)", "转速；过低可能转不动"],
          ["直流电机", "brake(0–100)", "主动刹车"],
          ["舵机", "write(角度) / read()", "设定 / 读取角度"],
          ["编码器电机", "begin(减速比)", "初始化，如 1:90 填 90"],
          ["编码器电机", "getRPM() / getEncoderPos()", "转速 / 位置（48 触点一圈）"],
        ]}
      />
    </div>
  </Frame>
);

const Mixly = () => (
  <Frame kicker="开发" floor="08" title="Mixly 米思奇：图形化与两个坑" wide>
    <Grid cols={2}>
      <Card title="已配插件环境" icon={Download}>
        Windows 下载官方配好插件的 Mixly 3.0；Mac 去 Mixly 官网装最新版。
      </Card>
      <Card title="插件导入" icon={Terminal}>
        插件压缩包<strong>无需解压</strong>，Mixly 里「本地导入」选压缩包，界面刷新出板卡。
      </Card>
      <Card title="首次编译慢" icon={Gauge} tone="warn">
        蓝牙库较大，第一次编译要耐心等待。
      </Card>
      <Card title="蓝牙手柄配对" icon={Gamepad2}>
        首次按住 X + Home 开机；4 号灯常亮=已连接，闪烁=扫描中，灯号不对就关机重试。
      </Card>
    </Grid>
    <div className="mt-5">
      <Code>
        报错：找不到 bits/c++config.h
        <br />
        把 ...\xtensa-esp32s3-elf\include\c++\8.4.0\xtensa-esp32s3-elf\bits\ 下的文件
        <br />
        拷贝到 ...\include\c++\8.4.0\bits\ 后，再上传。
      </Code>
    </div>
  </Frame>
);

const Controllers = () => (
  <Frame kicker="遥控与联网" floor="09" title="两种手柄" wide>
    <DataTable
      head={["", "蓝牙遥控器", "单手 RC 遥控器"]}
      rows={[
        ["控制", "方向键 / 左摇杆控车；SELECT 切麦轮/普通模式（默认麦轮）", "摇杆控车；按钮 5 切换前后/转弯与横移"],
        ["显示", "4 号灯表示连接状态；多灯闪=亏电", "LCD 显示信号强度与板电压"],
        ["调速", "右食指 B/T 加最大/起步速度，左食指 B/T 减，各 ±5%", "按钮 3/4 加/减最大速度 ±5%"],
        ["预留", "功能键二开预留", "按钮 6 拉高 45 号引脚，可外接 LED/继电器"],
      ]}
    />
    <div className="mt-5">
      <Quote>两种手柄的入门版源码都在官网/米思奇开源，进阶版找客服。</Quote>
    </div>
  </Frame>
);

const Iot = () => (
  <Frame kicker="遥控与联网" floor="10" title="物联网远程控制">
    <Grid cols={2}>
      <Card title="协议" icon={Cloud}>
        局域网内用 <b>Socket</b>，跨网用 <b>MQTT</b>。
      </Card>
      <Card title="控制端" icon={Smartphone}>
        网页 rc.7gp.cn 或安卓 App，填入与板子一致的「通讯标识」即可控。
      </Card>
      <Card title="带 4G 模块" icon={Radio}>
        开机后连 KiKuPi 热点（密码 1234567890），插流量卡后即可跨网遥控。
      </Card>
      <Card title="不带 4G 模块" icon={Wifi}>
        长按 boot 待 LED 变红，连 RobotS3 热点，浏览器开 192.168.123.1 配网。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>有自建服务器时，改 Mixly 里的服务器信息 + 网页端开源代码配对即可。</Quote>
    </div>
  </Frame>
);

const Packet = () => (
  <Frame kicker="遥控与联网" floor="11" title="10 字节数据包（可自写控制端）" wide>
    <Focus
      no="10"
      title="数据包结构"
      tag="字节"
      goal="官方公开了 MQTT 协议的数据包格式，开发者可据此自己编写其它控制端。"
      points={[
        "共 10 字节：类型 | 辅助 | 左摇杆 Y | 左摇杆 X | 右摇杆 2 字节 | 按钮 4 字节。",
        "类型：1 = 数据包，2 = 心跳包，其它可自定义。",
        "摇杆默认 127；向上/左最小到 0，向下/右最大到 255。",
        "按钮 4 字节位图，最多表达 32 个按钮：A 按下为 0x01，A+B 同时按下为 0x03。",
      ]}
      aside={
        <Code>
          [0] 类型 &nbsp;&nbsp;1=数据 2=心跳
          <br />
          [1] 辅助 &nbsp;&nbsp;自定义
          <br />
          [2] 左摇杆 Y &nbsp;&nbsp;127 居中
          <br />
          [3] 左摇杆 X
          <br />
          [4][5] 右摇杆
          <br />
          [6..9] 按钮位图（4 字节 = 32 位）
        </Code>
      }
    />
  </Frame>
);

const Ros2 = () => (
  <Frame kicker="ROS 2 对接" floor="12" title="micro-ROS：Pi 与 ESP32-S3 双向通讯" wide>
    <Focus
      no="12"
      title="官方示例做了什么"
      tag="micro-ROS"
      goal="Pi 键盘发控制量控车；ESP32 定时发心跳、Pi 打印频率——以此实现双向通讯，可继续完善电机控制。"
      points={[
        "环境：ESP32 侧 VSCode + PlatformIO；Pi 5 装 ROS 2 Jazzy。",
        "Pi → ESP32：teleop_twist_keyboard 发 /cmd_vel（Twist：x 前后、y 横移、z 转向）。",
        "ESP32 → Pi：定时发 /esp32/heartbeat，Pi 的监听节点订阅打印。",
        "通道：micro-ROS Agent 的 UDP4:8888。",
        "调试：ros2 topic list / echo / pub 手动验证。",
      ]}
      aside={
        <Code>
          # Pi：构建并启动 Agent
          <br />
          colcon build
          <br />
          ros2 run micro_ros_agent \
          <br />
          &nbsp;&nbsp;micro_ros_agent udp4 --port 8888
          <br />
          <br />
          # 键盘控制
          <br />
          ros2 run teleop_twist_keyboard \
          <br />
          &nbsp;&nbsp;teleop_twist_keyboard
          <br />
          <br />
          ros2 topic echo /esp32/heartbeat
        </Code>
      }
    />
  </Frame>
);

const Integration = () => (
  <Frame kicker="ROS 2 对接" floor="13" title="在本项目里怎么落地" wide>
    <Grid cols={2}>
      <Card title="本项目的 ROS 2 是 Docker 版" icon={Boxes}>
        仓库的 Pi 是 Debian 13 + Docker `ros:jazzy-ros-base`，不是示例里的 Ubuntu 原生安装。
      </Card>
      <Card title="Agent 跑在容器里" icon={Terminal}>
        在 ROS 2 容器内安装并运行 micro-ROS Agent。
      </Card>
      <Card title="网络要打通" icon={Network}>
        容器用 `--network host`，让 Agent 的 UDP 8888 直接落在宿主网络，ESP32 才找得到它。
      </Card>
      <Card title="发现要配置" icon={Layers}>
        跨机/跨容器统一 `ROS_DOMAIN_ID`，并处理 DDS 发现（参考 ROS2消息通路验证）。
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>是否引入 micro-ROS 的决策条件，见 docs/ROS2与micro-ROS选型.md 第六节。</Quote>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame kicker="收尾" floor="14" title="下载入口与文档" wide>
    <DataTable
      head={["资源", "入口"]}
      rows={[
        [
          "12V 原理图 EMO_Lite",
          <A href="https://www.7gp.cn/wp-content/uploads/2025/08/SCH_EMO_Lite.pdf">SCH_EMO_Lite.pdf</A>,
        ],
        [
          "24V 原理图 EM_MAX",
          <A href="https://www.7gp.cn/wp-content/uploads/2025/08/SCH_EMO_MAX_3-V1.0_USE.pdf">SCH_EMO_MAX_3-V1.0_USE.pdf</A>,
        ],
        [
          "Arduino 库 QGP_EVMotor.zip",
          <A href="https://www.7gp.cn/wp-content/uploads/2025/11/QGP_EVMotor.zip">QGP_EVMotor.zip</A>,
        ],
        [
          "Windows 程序烧录工具",
          <A href="https://doc.7gp.cn/download/FlashingTool.zip">FlashingTool.zip</A>,
        ],
        ["物联网网页控制端", <A href="http://rc.7gp.cn/">rc.7gp.cn</A>],
        ["完整资料整理", "docs/ESP32-S3电机驱动板资料.md"],
      ]}
    />
    <div className="mt-5">
      <Quote>Mixly 插件与 ROS 2 示例源码走百度网盘，链接见资料文档第七节。</Quote>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "板子的位置", group: "概览", el: <Position /> },
  { nav: "12V / 24V 版本", group: "硬件", el: <Versions /> },
  { nav: "共同规格与接口", group: "硬件", el: <Specs /> },
  { nav: "接线要点", group: "硬件", el: <Wiring /> },
  { nav: "四条开发路径", group: "开发", el: <DevPaths /> },
  { nav: "Arduino 烧录", group: "开发", el: <ArduinoFlow /> },
  { nav: "Arduino API", group: "开发", el: <ArduinoApi /> },
  { nav: "Mixly 与避坑", group: "开发", el: <Mixly /> },
  { nav: "两种手柄", group: "遥控与联网", el: <Controllers /> },
  { nav: "物联网远程控制", group: "遥控与联网", el: <Iot /> },
  { nav: "数据包格式", group: "遥控与联网", el: <Packet /> },
  { nav: "micro-ROS 通讯", group: "ROS 2 对接", el: <Ros2 /> },
  { nav: "本项目落地", group: "ROS 2 对接", el: <Integration /> },
  { nav: "下载与文档", group: "收尾", el: <Downloads /> },
];

export default slides;
