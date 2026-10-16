# ESP32 + ROS 2 LED 协同系统（三块板 + 1 驱动板）

来源：私有仓库 `esp32s3_ros2_3board_1drvboard` 的**工程部分**（本机开发副本
`C:\vibecoding\esp32s3`），2026-10-07 归档进本工作区。配套课程见
`培训/ESP32与ROS2开发基础课程包/`，讲义 deck 见 `教学webppt/ESP32与ROS2开发基础/`，
文字版技术要点见 `docs/ESP32与ROS2开发基础.md`。

三块板用 MicroPython 编写，经 WiFi/TCP 接入 WSL 里的 ROS 2，并可用 Web 控制台管理灯效：

| 板 | 硬件 | 说明 |
| --- | --- | --- |
| `green` / `blue` | ESP32-S3 N16R8，板载 WS2812（GPIO48） | 绿/蓝两块教学板，一键部署脚本区分 |
| `xrs` | 学而思掌机（ESP32-WROVER-B + ST7735S 128×160 屏） | 无 WS2812，屏幕上画"虚拟 LED"；6 个按键可本地/远程操作 |
| 1 drvboard | 掌机上的 GD32 USB 串口桥（VID 28E9，`USB 串行设备`） | `deploy.py` 自动识别，改用友好 REPL + base64 上传 |

数据链路：板 → WiFi/TCP `:6000` → Windows `tcp_forwarder.py` → WSL `:6001`
`wifi_server` → ROS 2 话题 `/board/<板名>/rx`、`/board/<板名>/tx`；`relay` 做板间
`FROM` 转发；`led_ui` 提供 Web 控制台（`:8080`）。

## 目录

```text
common/board_common.py     公共固件：WS2812/屏幕、样式 CRUD、心跳、WiFi 链路、按键处理
common/wifi_config.example.py  本机私密配置模板（复制为 wifi_config.py 后填值，不入库）
green/main.py blue/main.py 两块 S3 板入口（各两行：颜色 + 名字）
xrs/main.py               掌机入口（接 XrsDisplay）
xrs/xrs_display.py        掌机 ST7735S 驱动 + 状态界面
xrs/xrs_keys.py           掌机 6 按键（UP/DOWN/LEFT/RIGHT/A/B，IRQ + 60ms 消抖）
xrs/firmware/             掌机 MicroPython 固件（烧 0x1000）与原厂 4MB flash 备份
firmware/                  ESP32-S3 板的 MicroPython 完整镜像（烧 0x0，取自厂商资料）
tools/deploy.py            一键部署：公共模块 + wifi 配置 + 板级 main.py，再复位
tools/tcp_forwarder.py     Windows LAN→WSL TCP 转发器（WiFi 链路必需）
tools/serial_tcp_bridge.py 旧版 Windows COM↔TCP 桥（串口链路，备课保留）
ros2_ws/src/board_bridge/  ROS 2 Jazzy 功能包：wifi_server / relay / led_ui（+ 旧 serial_bridge）
```

## 快速开始

```powershell
# ① 工具（每台电脑一次）
python -m pip install esptool mpremote pyserial

# ② 烧板（先擦后写；S3 完整镜像烧 0x0，掌机烧 0x1000；COM 号按设备管理器）
python -m esptool --port COM13 --baud 460800 erase-flash
python -m esptool --port COM13 --baud 460800 write-flash -z 0x0 "教学demo/ESP32-ROS2-LED协同系统/firmware/GENERIC_S3-20220618-v1.19.1.bin"
python -m esptool --port COM5  --baud 460800 erase-flash
python -m esptool --port COM5  --baud 460800 write-flash -z 0x1000 "教学demo/ESP32-ROS2-LED协同系统/xrs/firmware/ESP32_GENERIC-SPIRAM-20220618-v1.19.1.bin"

# ③ 配置本组网络：复制模板后填写（wifi_config.py 不入库、不截图）
copy common\wifi_config.example.py common\wifi_config.py

# ④ 部署（脚本内部会自动重试第一次 raw-REPL 失败，掌机自动走 GD32 通道）
python tools\deploy.py COM13 green
python tools\deploy.py COM14 blue
python tools\deploy.py COM5  xrs

# ⑤ Windows 转发器（保持运行）：LAN :6000 → WSL :6001
python tools\tcp_forwarder.py --listen 0.0.0.0:6000 --target 127.0.0.1:6001
```

```bash
# ⑥ WSL 全栈（ROS 2 Jazzy）
source /opt/ros/jazzy/setup.bash
cd <本目录>/ros2_ws && colcon build && source install/setup.bash
UI_HOST=0.0.0.0 ros2 launch board_bridge wifi.launch.py   # 页面：http://<WSL_IP>:8080

# ⑦ 命令行联调
ros2 topic list                      # /board/green/rx、/board/green/tx、/board/blue/...、/board/xrs/...
ros2 topic pub --once /board/green/tx std_msgs/String "{data: 'COLOR 255 0 0'}"
ros2 topic pub --once /board/green/tx std_msgs/String "{data: 'STYLE LIST'}"
```

## 板端指令速查（`common/board_common.py` 解析）

```text
HELLO <NAME>            # 连接服务器时自动注册；DATA <NAME> <seq> 每 4s 心跳（自动）
STYLE SET <name> <R> <G> <B> <PERIOD_MS> [solid|blink]   # 只保存，不切换
STYLE DEL <name>        # default 受保护，删不掉
STYLE USE <name>        # 应用
STYLE LIST              # 回 STYLE ... 多行 + MIXING/PLAYING + STYLE-END
PLAY <name> ...         # 轮流播放（每样式 4 个周期）；PLAY STOP
MIX <name> ...          # 并行混合：20ms 采样，亮灭 OR、颜色相加截断；MIX STOP
LED/COLOR/PERIOD/PATTERN/RESET   # 快捷键（RESET 恢复本板默认闪烁，保留自定义样式）
KEY <NAME>              # 掌机按键（本地按下或网络下发），relay 转发为 EVENT <BOARD> <NAME>
```

样式保存在 RAM，重启即清空；`default` 永不可覆盖，所以原始绿/蓝闪烁不会丢。

## 已踩过的坑

- `mpremote` 第一次进入 raw REPL 常失败（"could not enter raw repl"），等 2 s 重试即可；`deploy.py` 已内置一次重试。
- 同一连接里链式 `cp ... + reset` 会把板子留在 REPL 不跑 `main.py`；必须单独一次连接复位（脚本已这么做）。
- 掌机经 GD32 桥时 `mpremote` 无法握手（主机字节被桥缓冲到 CR 才发），`deploy.py` 会改用友好 REPL + base64 + 尺寸校验上传。
- 读掌机串口日志要 `dtr=False, rts=False`，否则桥把 ESP32 按在复位上；esptool/mpremote 不受影响。
- 任何 `mpremote` 命令都会打断 `main.py`、把板子留在 REPL；跑完记得 `python -m mpremote connect COMx reset`。
- 烧录前确认没有别的程序占用串口（Thonny / 串口助手 / `serial_tcp_bridge.py`）。
- WiFi 只支持 2.4 GHz；`SERVER_IP` 必须填 **Windows 电脑**的局域网 IP（不是 WSL 的地址）。
- 板子连不上 WSL 是 WSL 镜像网络的入站限制：用 `tcp_forwarder.py` 绕开，别去改 Hyper-V 防火墙。
- 重启服务器后板子约 12 s 内自动重连（每 4 s 重试）；页面在线状态按心跳超时 10 s 判定。
- 掌机固件偏移是经典 ESP32 的 **0x1000**，S3 是 **0x0**，别混。
