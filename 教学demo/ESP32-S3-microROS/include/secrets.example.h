// 复制本文件为同目录下的 secrets.h 并填入真实值。
// secrets.h 已被 .gitignore 忽略，不会进仓库、也不会进 deck 的下载包。
#pragma once

#define WIFI_SSID     "your_wifi_ssid"    // 必须是 2.4 GHz（ESP32-S3 不支持 5 GHz）
#define WIFI_PASSWORD "your_wifi_password"
#define AGENT_IP      "192.168.31.29"     // 树莓派 wlan0 的地址，同网段
#define AGENT_PORT    8888
