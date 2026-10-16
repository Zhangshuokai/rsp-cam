# 教学demo

可直接运行的最小演示。每个 demo 一个子目录，内含该 demo 的 `README.md`（目的、依赖、运行方式）。

## 目录

- `摄像头远程显示/` —— 树莓派 USB 摄像头经裸 TCP 推流，本机 OpenCV 窗口实时显示。
- `ROS2消息通路验证/` —— WSL2 与树莓派 ROS 2 之间做 ping-pong 往返，验证跨机消息通路。
- `ESP32-S3-microROS/` —— ESP32-S3（奇果派 S3 控制板）的 PlatformIO 固件工程：经 micro-ROS Agent 接入 ROS 2，发 `/esp32/heartbeat`、收 `/cmd_vel`。见该目录 `README.md`。
- `ESP32-ROS2-LED协同系统/` —— 绿/蓝 ESP32-S3 + 学而思掌机三块板（MicroPython）经 WiFi/TCP 接入 WSL 里的 ROS 2：`wifi_server` / `relay` / `led_ui` + 一键部署脚本 + 两块板的固件。课程见 `培训/ESP32与ROS2开发基础课程包/`，deck 见 `教学webppt/ESP32与ROS2开发基础/`。见该目录 `README.md`。

## 约定

- 只放“能跑起来、能看懂”的最小示例，每个 demo 自包含。
- 生产/复用代码放 `算法/`（或后续的 `src/`），不要在 demo 里堆功能。
