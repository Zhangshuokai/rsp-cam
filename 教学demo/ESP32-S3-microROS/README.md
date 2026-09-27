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

改 `src/main.cpp` 顶部：

```cpp
#define WIFI_SSID "your_wifi_ssid"       // 必须是 2.4 GHz
#define WIFI_PASSWORD "your_wifi_password"
#define AGENT_IP "192.168.31.29"         // 树莓派在同一网段的地址，不是 127.0.0.1
#define AGENT_PORT 8888
```

> 节点名 `esp32_car`、话题 `/cmd_vel` 与 `/esp32/heartbeat` 都照官方示例。
> 传输头文件是 `#include <micro_ros_platformio.h>`（PlatformIO 版），
> `set_microros_wifi_transports()` 第 3 参是 `IPAddress`。
> 官方示例用的是 **gitee 镜像** `ohhuo/micro_ros_platformio` 且没写 distro；本工程用官方仓库 +
> `jazzy`，两者不能混：`libmicroros` 必须和 `board_microros_distro` 一致，换镜像要重编库。

## 程序结构（照官方示例）

| 位置 | 做什么 |
| --- | --- |
| `setup()` | `emo.begin()` + `createBaseChassis(BaseChassis::MECANUM)`，再 `xTaskCreatePinnedToCore(microros_task, …, 10240, …, 0)` |
| `microros_task`（核心 0） | `wait_for_wifi(30s)`（失败 `ESP.restart()`）→ `set_microros_wifi_transports` → 循环：`ping_agent` 通了就 `create_entities()`；`spin_some` + `ping_agent(100,3)` 判掉线 → `destroy_entities()` 重连；`millis()` 每 1 s 发心跳 |
| `twist_callback` | 打印 `Received Twist message`（官方保留），再接 `chassis->updateVelocity()` 控车 |
| `loop()`（核心 1） | 只做断连/丢包保护：1 s 没收到 `/cmd_vel` 就 `chassis->stop()` |

## 控车逻辑

`twist_callback` 把 Twist 直接交给官方 `BaseChassis`（两者速度定义一致：米/秒、米/秒、弧度/秒）：

```cpp
chassis->updateVelocity(clampf(linear_x, MAX_LINEAR),
                        clampf(linear_y, MAX_LINEAR),
                        clampf(angular_z, MAX_ANGULAR));
last_cmd_ms = millis();
moving = true;
```

- 底盘类型 `BaseChassis::MECANUM`（麦轮，可横移）；纯差速车改成 `SKID_STEER` / `DIFFERENTIAL_DRIVE`。
- `MAX_LINEAR` / `MAX_ANGULAR` 是限幅（默认 0.5 m/s、2.0 rad/s）。
- 轮径、轮距、减速比等若要精确，用带参构造
  `emo.createBaseChassis(BaseChassis::MECANUM, max_rpm, gear_ratio, ppr, voltage, wheel_diameter, wheel_y_distance)`。

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
