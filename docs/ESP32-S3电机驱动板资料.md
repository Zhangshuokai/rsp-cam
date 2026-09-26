# ESP32-S3 电机驱动板（奇果派 S3 机器人控制板）资料整理

> 来源：奇果派工坊 ESP32-S3 专题 <https://www.7gp.cn/archives/special/esp32-s3>。
> 本文把该专题散落的硬件、编程、遥控、物联网与 ROS 2 文档汇总成一份项目内可查阅的资料索引；**不替代官方原文**，下载链接与截图以官网为准（源文章见文末「来源」）。

## 一、这块板子是什么

奇果派 S3 机器人控制板 = **ESP32-S3 模组 + 四路电机驱动 + 传感器/扩展接口** 的集成驱动板，定位"MCU 实时底层"。它与本项目的树莓派 5 正好组成"**Pi 算 + MCU 控**"结构：Pi 跑 ROS 2 做视觉/规划，ESP32-S3 直接驱动电机/舵机/编码器/IMU。

### 两个版本

| | 12V 版（EMO_Lite） | 24V 版（EM_MAX） |
| --- | --- | --- |
| 模组 | ESP32-S3-WROOM-1-N8R8：LX7 双核 240 MHz，8 MB Flash，Wi-Fi + BLE | 同左 |
| 驱动芯片 | 高性能驱动芯片 | BTN8982 |
| 电机 | 4 路直流 **或** 2 路步进 | 4 路直流 |
| 单路电流 | 2.2 A（峰值 3.6 A） | 10 A（芯片最高 30 A，长期发热大、不建议） |
| 电机电压 | 4.5–13.5 V | 6–24 V |
| 推荐输入 | 6–12 V，最大 3 A | 6–24 V（匹配电机），最大 10 A |
| 原理图 | [SCH_EMO_Lite.pdf](https://www.7gp.cn/wp-content/uploads/2025/08/SCH_EMO_Lite.pdf) | [SCH_EMO_MAX_3-V1.0_USE.pdf](https://www.7gp.cn/wp-content/uploads/2025/08/SCH_EMO_MAX_3-V1.0_USE.pdf) |

### 共同规格

- 额外 **4 路 PWM**（可控制 4–8 路舵机，官网概述与参数两处写法不一致，以实测为准），官方示例支持 4 个舵机。
- 集成 **2 个 I2C**、**4 个编码器电机接口**、OLED 显示屏接口、IMU 陀螺仪接口、电压检测模块，均不占用其它 I2C 设备。
- 支持蓝牙手柄遥控、PS2 手柄、MQTT 物联网远程控制。
- Type-C 供电/下载；推荐输入 6–12 V（12V 版），务必用**动力型电池**，供电不足会导致系统不稳。

## 二、接线要点

- **普通有刷直流电机**：电源线插蓝色电机接口，不分正负极；若转向反了，调换电机正负极。
- **编码器电机**：电源线插蓝色接口，编码器数据线插对应白色接口。
- **第三方编码器**：注意板背引脚标识，VCC/GND 接反会短路烧件；每个编码器占用 2 个引脚，用满 4 路会占用正面 8 个引脚。
- **舵机**：官方示例对应 4 排引脚 **5 / 6 / 7 / 15**，每排三列（IO / 5V / GND），三色线插反则不动。

## 三、开发方式

同一块板提供四条路径，按上手难度排序：

### 1. 程序烧录工具（不写代码，仅 Windows）

- 下载 [FlashingTool.zip](https://doc.7gp.cn/download/FlashingTool.zip)，解压双击运行。
- 板型选择：Arduino Uno / ESP32（板与驱动板分离）/ **ESP32-S3（集成板选这个）**；端口自动检测；选程序 → 开始烧录 → 等到 100% 显示"烧录成功完成!"再拔板。
- 出厂程序开源，用 VSCode + PlatformIO 开发，可找客服索取。

### 2. Arduino IDE（入门版源码）

1. 装 Arduino IDE（[新手安装三板斧](https://www.7gp.cn/archives/697)）。
2. 下载库：[QGP_EVMotor.zip](https://www.7gp.cn/wp-content/uploads/2025/11/QGP_EVMotor.zip)（或[百度网盘](https://pan.baidu.com/s/1Ics52oTadGGIVccjC52InA?pwd=1314)）。
3. **项目 → 导入库 → 添加 .ZIP 库**；更新时先删 `C:\Users\<用户>\Documents\Arduino\libraries\QGP_EVMotor` 再重导。
4. **文件 → 示例 → QGP_EVMotor** 打开示例，另存后再改。
5. 烧录：**工具 → 开发板 → esp32 → ESP32S3 Dev Module**，选对 USB 端口，Type-C 连板。

常用 API（示例节选，完整见官方原文）：

```cpp
#include "StickCB.h"
#include "EMotionPI.h"

BLEControlStick _joy;          // 蓝牙手柄
EMotionPI emo;                 // 驱动板对象

// 直流电机
EMO_DCMotor *m1 = emo.getMotor(M1);
m1->run(FORWARD); m1->setSpeed(100);   // setSpeed 0–100
m1->brake(100);                        // 主动刹车 0–100

// 舵机
EMO_Servo *s1 = emo.getServo(S1);
s1->write(s1->read() + 1);             // read()/write(角度)

// 编码器电机（setup 里需 emo.begin() 与 enMotor->begin(减速比)）
EMO_EncoderMotor *e1 = emo.getEncoderMotor(M1);
e1->begin(90);                         // 齿数比 1:90
e1->getRPM();                          // 转速（圈/分）
e1->getEncoderPos();                   // 位置，48 触点/圈

// 蓝牙手柄事件
_joy.setStickCallback(new StickCB());
_joy.begin();
_joy.update();
if (_joy.Button(BTN_DPAD_UP)) { /* ... */ }
_joy.Analog(BPSS_LY);                  // 左摇杆 Y 轴
```

### 3. Mixly 米思奇（图形化，入门版）

1. 下载：Windows 用[已配好插件的 Mixly 3.0](https://pan.baidu.com/s/1cP_Ca2-YIF1ggjxb3lBMuw?pwd=2jih)；Mac 走[Mixly 官网](https://mixly.cn/fredqian/mixly3)。
2. 下载[奇果派 S3 插件](https://pan.baidu.com/s/12dWAfmevUxAKlHdhSA3Abg?pwd=1314)，**无需解压**，在 Mixly 中点"本地导入"选择压缩包，界面刷新出现板卡。
3. 打开示例先另存为再改；插板选串口上传；首次编译因蓝牙库较大较慢。
4. 蓝牙手柄配对：首次 **按住 X 键 + Home 键**开机，4 号灯亮；4 号灯**常亮=已连接**、闪烁=扫描中；灯号不对就长按 Home 关机重试。
5. 常见报错 `bits/c++config.h` 找不到：把
   `...\xtensa-esp32s3-elf\include\c++\8.4.0\xtensa-esp32s3-elf\bits` 下所有文件
   拷到 `...\xtensa-esp32s3-elf\include\c++\8.4.0\bits` 后重传。

### 4. VSCode + PlatformIO（进阶版）

进阶源码与出厂程序用 PlatformIO 开发，**不公开**，需购物好评后联系客服索取。

## 四、遥控器

| | 蓝牙遥控器 | 单手 RC 遥控器 |
| --- | --- | --- |
| 控制 | 方向键 / 左摇杆 控车；SELECT 切麦轮/普通模式（默认麦轮）；右摇杆转向（普通模式预留舵机） | 摇杆控车，按钮 5 切换前后/转弯 与 横移 |
| 显示 | 4 号灯表示连接状态；多灯闪=亏电 | LCD 显示信号强度与板电压 |
| 调速 | 右食指 B/T 增最大/起步速度，左食指 B/T 减，各 ±5% | 按钮 3/4 增/减最大速度 ±5% |
| 预留 | 功能键二开预留 | 按钮 6 拉高 **45 号引脚**，可外接 LED/继电器 |

两种手柄的入门版源码均在官网/米思奇开源，进阶版找客服。

## 五、物联网远程控制

- 局域网用 **Socket**，跨网用 **MQTT**。
- Mixly 打开"物联网控制"示例，改**唯一通讯标识**后上传；手机网页控制端 <http://rc.7gp.cn/> 或[安卓 App](https://pan.baidu.com/s/1uJ_lGoXwTgDLesGdStcYuQ?pwd=ate5)填相同标识即可控。有自建服务器时改 Mixly 服务器信息 + 网页开源代码配对。
- **视频车 App**（[安卓 App](https://pan.baidu.com/s/1Lu2Tys0gsobUnCzFyeGd8g?pwd=1314)）：
  - 带 4G 模块：开机后连 `KiKuPi` 热点（密码 `1234567890`），App 自动发现设备，插流量卡后跨网遥控。
  - 不带 4G：长按 boot 待 LED 变红，连 `RobotS3` 热点，浏览器开 `192.168.123.1` 配网，LED 变黄即成功。
- **10 字节数据包格式**（可自写控制端）：`[类型|辅助|左摇杆Y|左摇杆X|右摇杆…|按钮 4 字节位图]`；类型 1=数据、2=心跳；摇杆默认 127，上/左到 0、下/右到 255；按钮位图最多表达 32 个按钮状态。

## 六、ROS 2 / micro-ROS 对接

官方示例验证"**ESP32-S3 板 + 树莓派 5**"双向通讯：

- 环境：ESP32 侧 VSCode + PlatformIO；Pi 5（示例用 Ubuntu 22.04）装 ROS 2 **Jazzy**。
- 目标：Pi 键盘发控制量 → ESP32 控车；ESP32 定时发心跳 → Pi 打印频率。
- 关键组件：micro-ROS Agent（选 `jazzy` 分支）、`teleop_twist_keyboard`、心跳监听节点 `heartbeat_listener.py`（在官方示例工程内）。
- 通讯：ESP32 走 **UDP4:8888** 连 Agent；话题 `/cmd_vel`（`geometry_msgs/Twist`，`x` 前后、`y` 横移、`z` 转向）与 `/esp32/heartbeat`。
- 调试：`ros2 topic list | grep heartbeat`、`ros2 topic echo /esp32/heartbeat`、`ros2 topic pub /cmd_vel ...` 手动验证。

官方步骤（命令摘要）：

```bash
# Pi 侧装 ROS 2（第三方源）
wget http://fishros.com/install -O fishros && bash fishros

# 构建 micro-ROS Agent
mkdir -p ~/microros_ws/src && cd ~/microros_ws
git clone https://github.com/micro-ROS/micro-ROS-Agent.git -b jazzy
git clone https://github.com/micro-ROS/micro_ros_msgs.git -b jazzy
colcon build

sudo apt install ros-jazzy-teleop-twist-keyboard   # 键盘控制

# 运行
cd ~/microros_ws && source install/setup.bash
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888
# 另开终端：python3 heartbeat_listener.py
# 再开终端：ros2 run teleop_twist_keyboard teleop_twist_keyboard
```

源码（含 ROS 2 代码与 `heartbeat_listener.py`）：[百度网盘](https://pan.baidu.com/s/1L9PQhWvsiyluuN4WXUIEoA?pwd=5bg8)。

> **本项目对接要点**：本仓库的 PI 是 Debian 13 + **Docker 版 ROS 2 Jazzy**（见 `ROS2与micro-ROS选型.md`），并非示例里的 Ubuntu 原生安装。要在本项目复用该方案，需在 ROS 2 容器内安装/运行 **micro-ROS Agent**，并用 `--network host` 让 Agent 的 UDP 8888 直接落在宿主机网络上，ESP32 才能发现到它；跨机/跨容器还需统一 `ROS_DOMAIN_ID` 并处理 DDS 发现（参考 `教学demo/ROS2消息通路验证/`）。是否引入 micro-ROS 的决策条件见 `ROS2与micro-ROS选型.md` 第六节。

## 七、下载与入口汇总

| 资源 | 链接 |
| --- | --- |
| 12V 版原理图 EMO_Lite | <https://www.7gp.cn/wp-content/uploads/2025/08/SCH_EMO_Lite.pdf> |
| 24V 版原理图 EM_MAX | <https://www.7gp.cn/wp-content/uploads/2025/08/SCH_EMO_MAX_3-V1.0_USE.pdf> |
| Arduino 库 QGP_EVMotor.zip | <https://www.7gp.cn/wp-content/uploads/2025/11/QGP_EVMotor.zip> |
| Arduino 库（网盘，pwd 1314） | <https://pan.baidu.com/s/1Ics52oTadGGIVccjC52InA?pwd=1314> |
| Mixly 3.0 已配插件（Win，pwd 2jih） | <https://pan.baidu.com/s/1cP_Ca2-YIF1ggjxb3lBMuw?pwd=2jih> |
| Mixly 奇果派 S3 插件（pwd 1314） | <https://pan.baidu.com/s/12dWAfmevUxAKlHdhSA3Abg?pwd=1314> |
| ROS 2 示例源码（pwd 5bg8） | <https://pan.baidu.com/s/1L9PQhWvsiyluuN4WXUIEoA?pwd=5bg8> |
| 安卓 App：物联网遥控（pwd ate5） | <https://pan.baidu.com/s/1uJ_lGoXwTgDLesGdStcYuQ?pwd=ate5> |
| 安卓 App：视频车（pwd 1314） | <https://pan.baidu.com/s/1Lu2Tys0gsobUnCzFyeGd8g?pwd=1314> |
| Windows 程序烧录工具 | <https://doc.7gp.cn/download/FlashingTool.zip> |
| 物联网网页控制端 | <http://rc.7gp.cn/> |
| Mixly 米思奇官网 | <https://mixly.cn/fredqian/mixly3> |

## 八、来源

- ESP32-S3 专题目录：<https://www.7gp.cn/archives/special/esp32-s3>
- 硬件文档：<https://www.7gp.cn/archives/1391>
- Arduino IDE 编程：<https://www.7gp.cn/archives/1409>
- MIxly 图形编程：<https://www.7gp.cn/archives/1410>
- 物联网远程控制：<https://www.7gp.cn/archives/1536>
- 视频车 App 遥控教程：<https://www.7gp.cn/archives/1495>
- 程序烧录工具：<https://www.7gp.cn/archives/1516>
- 遥控器操作说明：<https://www.7gp.cn/archives/1714>
- ROS 2 开发：<https://www.7gp.cn/archives/1747>
