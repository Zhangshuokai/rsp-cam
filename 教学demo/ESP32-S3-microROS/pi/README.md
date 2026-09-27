# Pi 侧脚本（官方示例自带）

`heartbeat_listener.py` 来自奇果派官方示例（`micro-ROS.zip` 的 `src/`），**原样保留**：
订阅 `/esp32/heartbeat`（`std_msgs/Int32`），按收到时间算频率并打印，超过 5 s 没收到就告警
——比 `ros2 topic hz` 多一个「掉线告警」。

官方示例源（已本地化）：`教学webppt/ESP32-S3接入micro-ROS/files/micro-ROS-official-src.zip`

## 在本项目的树莓派上跑

ROS 2 跑在 Docker 容器里（`~/microros_ws`，见工程根 `README.md`）：

```bash
# 1) 把脚本放到 Pi 的 ~/microros_ws/src/（该目录随 -v 挂载进容器）
python tools/pi.py --put "教学demo/ESP32-S3-microROS/pi/heartbeat_listener.py" \
  /home/nanzhida/microros_ws/src/heartbeat_listener.py

# 2) Agent 起来后，另开一个容器终端跑监听
docker run -it --rm --network host -v ~/microros_ws:/microros_ws \
  ros:jazzy-ros-base bash -lc 'source /opt/ros/jazzy/setup.bash; \
  ROS_DOMAIN_ID=42 python3 /microros_ws/src/heartbeat_listener.py'
```

> 官方示例里的 `start_car_control.sh` 面向 **Ubuntu 原生 ROS 2 + gnome-terminal**
> （还写死了 `~/ros2_ws/install/setup.bash` 与 `xterm` 两个分支），与本项目
> 「Docker 容器、无桌面终端」的环境不匹配，故未一并收录；等价操作就是分别起
> Agent / 监听 / teleop 三个终端，见工程根 `README.md` 的「树莓派侧」一节。
