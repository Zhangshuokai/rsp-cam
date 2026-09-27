# tools

工程工具脚本。

## 内容

- `pi.py` —— 通过 SSH 在树莓派上执行命令 / 上传脚本。参数与两台树莓派的地址、账号见 `AGENTS.md`。
- `serial_monitor/` —— 串口波形监控 GUI（tkinter + pyserial），把板子输出的逗号分隔数值画成实时波形。用法见 `serial_monitor/README.md`。

## 用法

```
python tools/pi.py [--sudo] [--host <IP>] [--user <u>] [--pass <p>] [--file <本地脚本>] '<命令>'
```

默认指向新 Pi `172.26.188.116`（账号 `nanzhida`）。
