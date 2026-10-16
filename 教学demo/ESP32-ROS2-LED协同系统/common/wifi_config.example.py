# 复制本文件为 wifi_config.py 后按本组环境填写。
# wifi_config.py 含真实 WiFi 密码：不入库、不截图、不投屏。
# 未部署本文件时，板子不发 WiFi、DATA 心跳直接打印到串口（实验一~五用这个状态）。

SSID = "lab-2g"                # 2.4 GHz 热点/路由器
PASSWORD = "<本组热点密码>"
SERVER_IP = "192.168.1.100"    # 教师电脑（Windows）的局域网 IP，不是 WSL 的地址
SERVER_PORT = 6000             # Windows 转发器监听端口（再转 WSL 的 6001）
