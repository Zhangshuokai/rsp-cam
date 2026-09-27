# tools

工程工具脚本。

## 内容

- `pi.py` —— 通过 SSH 在树莓派上执行命令 / 上传脚本。参数与两台树莓派的地址、账号见 `AGENTS.md`。
- `serial_monitor/` —— 串口波形监控 GUI（tkinter + pyserial），把板子输出的逗号分隔数值画成实时波形。用法见 `serial_monitor/README.md`。
- `pio_mirror_seed.py` —— 并行预下载 PlatformIO 包到本地缓存。PlatformIO 的下载会 302 到境外对象存储，单连接仅 ~50 KB/s；本脚本按 PlatformIO 的缓存命名规则多连接下载并校验，之后 `pio run` 直接命中缓存。
- `microros_lib_wsl.sh` —— 在 WSL 里构建 `micro_ros_platformio` 的 `libmicroros` 静态库并拷回 Windows 工程（见 `教学demo/ESP32-S3-microROS/README.md`）。

## 用法

```
python tools/pi.py [--sudo] [--host <IP>] [--user <u>] [--pass <p>] [--file <本地脚本>] '<命令>'
```

默认指向新 Pi `172.26.188.116`（账号 `nanzhida`）。
