# ESP32-S3 micro-ROS 固件工程（PlatformIO）

奇果派 S3 机器人控制板（ESP32-S3-WROOM-1-N8R8）作为 ROS 2 节点接入的最小固件工程：
发 `/esp32/heartbeat`（std_msgs/Int32，1 Hz）、收 `/cmd_vel`（geometry_msgs/Twist），
经树莓派上的 micro-ROS Agent（UDP4:8888）接入 ROS 2 图。

配套讲义见 `教学webppt/ESP32-S3接入micro-ROS/`；背景见
`docs/ESP32-S3电机驱动板资料.md` 第六节、`docs/ROS2与micro-ROS选型.md` 第六节。

## 目录

```
platformio.ini     板型 / micro-ROS 发行版 / 传输 / 依赖
src/main.cpp       固件：心跳发布者 + cmd_vel 订阅（回调里未接电机）
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

`platformio.ini` 与树莓派 ROS 2 版本一致（`board_microros_distro = jazzy`，传输 `wifi`）。
改 `src/main.cpp` 顶部：

```cpp
#define WIFI_SSID "your_wifi_ssid"     // 必须是 2.4 GHz
#define WIFI_PASS "your_wifi_password"
#define AGENT_OCTET_0 192               // 树莓派同一网段地址，如 192.168.31.29
#define AGENT_OCTET_1 168
#define AGENT_OCTET_2 31
#define AGENT_OCTET_3 29
#define AGENT_PORT 8888
```

> Agent 地址要填**树莓派可达的地址**（如 wlan0 的 `192.168.31.29`），不能写 `127.0.0.1`。
> 头文件是 `#include <micro_ros_platformio.h>`（PlatformIO 版），
> `set_microros_wifi_transports()` 的第 3 个参数是 `IPAddress`，不是字符串。

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

# 另开终端：看心跳 / 键盘控车（同一个 ROS_DOMAIN_ID）
export ROS_DOMAIN_ID=42
ros2 topic hz /esp32/heartbeat
ros2 run teleop_twist_keyboard teleop_twist_keyboard
```

顺序不可反：**先起 Agent，再给 ESP32-S3 上电**，否则固件一直重连。

## 验收

```bash
ros2 node list                     # /esp32_node
ros2 topic hz /esp32/heartbeat     # ≈ 1
ros2 topic echo /esp32/heartbeat   # data 递增
ros2 topic info /cmd_vel           # Publisher count ≥ 1
```

## 说明

回调 `cmd_cb` 里只解析出 `linear.x/y`、`angular.z`，未接电机；真控车时换成
`QGP_EVMotor`（`教学webppt/ESP32-S3电机驱动板/files/QGP_EVMotor.zip`）的
`EMO_DCMotor::run()` / `setSpeed()`。
