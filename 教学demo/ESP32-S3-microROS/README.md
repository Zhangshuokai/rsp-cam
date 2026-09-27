# ESP32-S3 micro-ROS 固件工程（PlatformIO）

奇果派 S3 机器人控制板（ESP32-S3-WROOM-1-N8R8）作为 ROS 2 节点接入：
发 `/esp32/heartbeat`（std_msgs/Int32，1 Hz）、收 `/cmd_vel`（geometry_msgs/Twist）**直接驱动麦轮底盘**，
经树莓派上的 micro-ROS Agent（UDP4:8888）接入 ROS 2 图。

结构照**奇果派官方示例**（`micro-ROS.zip`）：连接管理放进 FreeRTOS 后台任务，用
`rmw_uros_ping_agent` 探测 Agent、断线销毁实体后自动重连；本工程只把官方示例里
「只打印」的 `twist_callback` 换成 `QGP_EVMotor` 的真实控车。

配套讲义见 `教学webppt/ESP32-S3接入micro-ROS/`；官方示例源码见
`教学webppt/ESP32-S3接入micro-ROS/files/micro-ROS-official-src.zip`。

## 目录

```
platformio.ini                       板型 / micro-ROS 发行版 / 传输 / 依赖 / QGP 链接参数
src/main.cpp                         固件：官方示例结构 + 麦轮控车
lib/QGP_EVMotor/                     官方电机库的精简子集（见其 README.md）
  ├─ src/EMotionPI.h                 EMotionPI / EMO_DCMotor / BaseChassis
  ├─ src/ESP32Encoder.h
  └─ src/esp32s3/libqgpmotor.a       官方预编译静态库（0.84 MB）
pi/heartbeat_listener.py             官方示例的心跳监听节点（Pi 侧，原样保留）
include/secrets.example.h            本机私密配置模板（复制为 secrets.h 后填值，secrets.h 不入库）
```

## 关键限制：Windows 上需要先在 WSL 编一次库

`micro_ros_platformio` 在**首次构建时**用 POSIX shell 调 `colcon` 从源码交叉编译出
micro-ROS 静态库 `libmicroros.a`（`. <venv>/activate`、`$(which python)`、`install/setup.sh`），
Windows 的 `cmd` 跑不了，会在 `Build dev micro-ROS environment failed: '.' is not recognized`
处失败。**这是上游库的限制，不是配置问题。**

可行做法：在 **WSL2 Ubuntu**（本机已装 ROS 2 Jazzy + colcon）里编一次库，把
`libmicroros/` 放回本工程 `.pio` 库目录；之后 Windows 上 `pio run` 会打印
`micro-ROS already built` 并直接链接。一键脚本：

```bash
# 在 WSL 里执行（脚本会装 PlatformIO、同步工程、pio run、再把库拷回来）
bash /mnt/c/vibecoding/rsp/tools/microros_lib_wsl.sh
```

改了 `board_microros_distro` / `board_microros_transport` 后要重新编库：
先 `pio run -t clean_microros`（或删掉库目录里的 `libmicroros/`），再跑上面的脚本。

> `.pio/`（含预编译的 `libmicroros.a`，约 60 MB）不入库，见根 `.gitignore`；换机器按本节重编一次即可。
> 首次下载 `espressif32` 平台与工具链走的是境外镜像、单连接很慢，可用
> `python tools/pio_mirror_seed.py <owner>/<type>/<name> <版本> 24` 多连接预取（见该脚本说明）。

## 配置

`platformio.ini` 与树莓派 ROS 2 版本一致（`board_microros_distro = jazzy`，传输 `wifi`），
并对官方电机库补了链接参数（原因见 `lib/QGP_EVMotor/README.md`）：

```ini
build_flags =
  -Llib/QGP_EVMotor/src/esp32s3
  -lqgpmotor
```

改 Wi-Fi 与 Agent 参数：**推荐**复制 `include/secrets.example.h` 为 `include/secrets.h` 再填值——
`secrets.h` 已在 `.gitignore` 里，密码不会入库、也不会进 deck 的下载包：

```cpp
// include/secrets.h
#define WIFI_SSID     "your_wifi_ssid"    // 必须是 2.4 GHz（ESP32-S3 不支持 5 GHz）
#define WIFI_PASSWORD "your_wifi_password"
#define AGENT_IP      "192.168.31.29"     // 树莓派 wlan0 的地址，同网段
#define AGENT_PORT    8888
```

没有 `secrets.h` 时用 `src/main.cpp` 里的占位默认值（同样是这 4 个宏，`#ifndef` 保护）：

```cpp
#ifndef WIFI_SSID
#define WIFI_SSID "your_wifi_ssid"
#endif
/* …WIFI_PASSWORD / AGENT_IP / AGENT_PORT 同理… */
```

> 节点名 `esp32_car`、话题 `/cmd_vel` 与 `/esp32/heartbeat` 都照官方示例。
> 传输头文件是 `#include <micro_ros_platformio.h>`（PlatformIO 版），
> `set_microros_wifi_transports()` 第 3 参是 `IPAddress`。
> 官方示例用的是 **gitee 镜像** `ohhuo/micro_ros_platformio` 且没写 distro；本工程用官方仓库 +
> `jazzy`，两者不能混：`libmicroros` 必须和 `board_microros_distro` 一致，换镜像要重编库。
> 注意 `firmware.bin` 里会带 Wi-Fi 明文密码（固件本来就得知道），烧录产物别外传。

## 程序结构（照官方示例）

| 位置 | 做什么 |
| --- | --- |
| `setup()` | `emo.begin()` → `emo.getEncoderMotor(M1/M2)->begin(90)`（**必须**，见下）→ 取 `emo.getMotor(M1/M2)` 句柄 → 刹车，再 `xTaskCreatePinnedToCore(microros_task, …, 10240, …, 0)` |
| `microros_task`（核心 0） | `wait_for_wifi(30s)`（失败 `ESP.restart()`）→ `set_microros_wifi_transports` → 循环：`ping_agent` 通了就 `create_entities()`；`spin_some` + `ping_agent(100,3)` 判掉线 → `destroy_entities()` 重连；`millis()` 每 1 s 发心跳 |
| `twist_callback`（核心 0） | 打印 `Received Twist message`，只计算左右目标占空比写入 `target_l/target_r` |
| `loop()`（核心 1） | 把目标占空比经 `drive_motor()` 下发；1 s 没收到 `/cmd_vel` 就归零停车 |

## 控车逻辑（本板实测配方，2026-09）

实车是**履带/两轮差速、电机为无编码器直流有刷**，只接 M1（左）、M2（右）。
逐条都是台架实测结论，踩过坑，别照官方 A9/A10 直接抄：

```cpp
// setup()：这一句不能少，否则所有 spin()/run() 都静默不出 PWM
emo.begin();
emo.getEncoderMotor(MOTOR_LEFT)->begin(90);    // 减速比 1:90
emo.getEncoderMotor(MOTOR_RIGHT)->begin(90);
motor_left  = emo.getMotor(MOTOR_LEFT);        // M1 = 0
motor_right = emo.getMotor(MOTOR_RIGHT);       // M2 = 1

// 回调里算目标（把指令映射进 60~100 的占空比带宽）
target_l = scale_duty(clampf(fwd - turn, 1.0f));   // 左 = 前进 − 转向
target_r = scale_duty(clampf(fwd + turn, 1.0f));   // 右 = 前进 + 转向

// loop()（核心 1）里下发
motor_left->spin((int)target_l);                   // -100~100，负值反转
```

- **`EMO_EncoderMotor::begin(减速比)` 必须调**（哪怕电机没有编码器）：它负责把电机驱动
  输出初始化起来。少这一步，`getMotor()->spin()`、`run()+setSpeed()`、`updateDuty()` 全都
  不出 PWM，现象是「串口打印正常、轮子纹丝不动」——**实测踩过**。减速比本板 1:90
  （`docs/ESP32-S3电机驱动板资料.md` 第三节、官方 A4 示例）。
- **占空比要够大**：40~50 低于静摩擦阈值，轮子完全不动；60 起能走、100 满速。所以
  `scale_duty()` 把非零指令映射到 `MOTOR_MIN_PWM(60) ~ MOTOR_MAX_PWM(100)`。
- **不要用 `BaseChassis::updateVelocity()` / `spinRPM()`**：它们是「目标 RPM + PID」，
  无编码器时反馈恒为 0，PID 会积分饱和到满 PWM——表现为**零速指令下轮子自己转**（实测踩过），
  一收到 `/cmd_vel` 还可能因 PCNT 未初始化直接 `abort()` 重启。开环 `spin()` 才是对的。
- **库调用只在核心 1 做**：从核心 0 的 micro-ROS 任务里调 `spin()` 不出 PWM（实测）；
  所以回调只写目标值，`loop()` 负责下发。
- 电机通道号：`M1=0 M2=1 M3=2 M4=3`（头文件宏），`getMotor(4)` 越界返回空指针。
- `MAX_LINEAR` / `MAX_ANGULAR` 是输入限幅（默认 0.5 m/s、2.0 rad/s），与占空比带宽独立。

## 编译与烧录（Windows）

```bash
pio run                        # 编译
pio run -t upload              # 烧录（Type-C 口，先确认 COM 端口）
pio device monitor -b 115200   # 查看串口日志，Ctrl+C 退出
```

板上 USB-C 口走 CH343 转串口（实测 `COM9`，`VID:PID=1A86:55D3`），也是烧录口；
另一个原生 USB 口看不到固件输出。上传时不要同时开串口监视器。

## 树莓派侧：跑 micro-ROS Agent

Agent 已在本项目树莓派（`zhangsk`，Docker + `ros:jazzy-ros-base`）的
`~/microros_ws` 里构建好（`micro-ROS-Agent` + `micro_ros_msgs`，jazzy 分支）：

```bash
# Pi 上：容器内启动 Agent（工作区挂载在宿主机 ~/microros_ws）
docker run -it --rm --network host -v ~/microros_ws:/microros_ws \
  ros:jazzy-ros-base bash -lc 'source /opt/ros/jazzy/setup.bash; \
  source /microros_ws/install/setup.bash; \
  ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888'

# 另开终端：看心跳（官方示例的监听节点，已随本工程放在 pi/）
export ROS_DOMAIN_ID=42
python3 ~/microros_ws/src/heartbeat_listener.py     # 见 pi/README.md 的上传方法
# 或简单看频率
ros2 topic hz /esp32/heartbeat

# 再开终端：键盘控车
ros2 run teleop_twist_keyboard teleop_twist_keyboard
```

先起 Agent 更顺；起晚了也没关系——固件会自动重连，不用重启板子。

## 验收

```bash
ros2 node list                     # /esp32_car
ros2 topic hz /esp32/heartbeat     # ≈ 1
ros2 topic echo /esp32/heartbeat   # data 递增
ros2 topic info /cmd_vel           # Publisher count ≥ 1
ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.2}, angular: {z: 0.0}}"   # 车应前进，停发 1 s 后自动停
```

串口（115200）上同时能看到官方的日志：`[ROS] Agent found, creating entities...`、
`[ROS] Heartbeat sent: n`、`Received Twist message: xyz = …`。

> 上电前把驱动板接好 6–24 V 动力电池（USB 供电带不动电机），并让车轮离地先试。

## 说明

遥测回传（编码器/IMU → `/odom`）尚未接，可用 `chassis->getOdometry(x, y, theta)` 扩展。
若还要用蓝牙手柄直连控车，把官方完整包
`教学webppt/ESP32-S3电机驱动板/files/QGP_EVMotor.zip` 解压覆盖 `lib/QGP_EVMotor/`
（含 `BLEControlStick.h` 与 NimBLE），API 见 `docs/ESP32-S3电机驱动板资料.md` 第三节。
