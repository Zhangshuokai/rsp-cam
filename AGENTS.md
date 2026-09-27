# 树莓派竞赛工作区 · 协作备忘

仓库是树莓派（Pi 5）视觉/工程竞赛工作区，目录划分见 `README.md`：`docs/`、`培训/`、`教学webppt/`、`教学demo/`、`算法/`、`模型/`、`训练/`、`数据/`、`tools/`。Python 侧无构建/测试/lint 工具链，不要去找；个别脚本有 pip 依赖（`paramiko`、`pyserial`，已装在用户级 Python 3.14）。只有 `教学webppt/` 用 npm/Vite 构建。每个分类目录都有 `README.md` 说明用途与命名，新增内容先看对应 README（如 `数据/README.md`、`模型/README.md`）。

## 工作流约定（用户要求）

- 用户常在**根目录**新建/更新文档：提交前必须把它归档进合适分类目录，并同步更新相关 md（目标目录的 `README.md`，必要时根 `README.md`）。移动已跟踪文件用 `git mv` 保留历史；路径含中文，命令里要加引号。
- 归档去向：培训资料/规则解读 → `培训/`；可运行最小示例 → `教学demo/<名称>/`；技术文档 → `docs/`；算法 → `算法/`；权重与产物 → `模型/`；训练脚本 → `训练/`；数据集 → `数据/`（内容不入库）；脚本工具 → `tools/`；线下教学 webppt → `教学webppt/<主题>/`。
- **本地编写的代码必须给出下载地址**：`tools/`、`教学demo/` 里我们自己写的脚本/工具，要在交付物（deck 的收尾下载页、`docs/` 相关文档、最终答复）里给出「去哪下载」，不能只留一个仓库路径。离线首选：把文件（或打包成 zip）放进对应的 `教学webppt/<主题>/files/`，deck 里用相对链接 `./files/…` 引用（随 deck 分发、离线可用，也是唯一不依赖推送的地址）。在线地址（仓库 `origin` = `https://github.com/Zhangshuokai/rsp-cam`）：`https://github.com/Zhangshuokai/rsp-cam/blob/main/<路径>`，raw 直链 `https://raw.githubusercontent.com/Zhangshuokai/rsp-cam/main/<路径>`（实测可直连，不用代理）。**写 GitHub 地址前先确认该文件已在 `origin/main` 上**——未推送的文件链接是 404，此时只给仓库内路径或 `files/` 副本。`files/` 里的副本与源文件改动后要同步刷新，别留两个版本。
- **添加/归档新内容后自动更新 webppt**：用 `web-slide-deck` 技能生成或更新对应主题，产物放 `教学webppt/<主题>/`，并**执行构建把成品刷新**（见下节），不再逐次询问用户。新增 deck 还要同步 `教学webppt/index.html` 目录首页与 `教学webppt/README.md` 的「已有主题」。
- 提交信息沿用历史风格（`feat(...):` / `docs(...):` 等 + 中文描述）；不要主动 push。

## 目录与入口

- 摄像头远程显示：`教学demo/摄像头远程显示/{cam_server.py,cam_view.py}`（原理见 `docs/设计原理流程图.md`，硬件见 `docs/摄像头参数.md`、`docs/摄像头选型.md`）。
  Pi 端运行前需 `sudo apt-get install -y python3-opencv`，脚本放 `/home/nanzhida/cam_server.py`，后台启动 `nohup python3 cam_server.py > /tmp/cam_server.log 2>&1 &`；本机 `python "教学demo/摄像头远程显示/cam_view.py"`（默认 `172.26.188.116:5000`）。
- 树莓派连接工具：`tools/pi.py`。
- ESP32-S3 电机驱动板（奇果派 S3 机器人控制板）资料汇总：`docs/ESP32-S3电机驱动板资料.md`（硬件/接线/Arduino/Mixly/物联网/micro-ROS）。
- ESP32-S3 接入 micro-ROS 的完整步骤 deck：`教学webppt/ESP32-S3接入micro-ROS/`；背景见 `docs/ESP32-S3电机驱动板资料.md` 第六节与 `docs/ROS2与micro-ROS选型.md` 第六节。
- 串口波形监控 GUI：`tools/serial_monitor/serial_monitor.py`（tkinter + pyserial；示波器风格、10 通道泳道、悬停游标、点击徽标隐藏通道）。用法 `python tools/serial_monitor/serial_monitor.py --port <COM> --baud 115200 --autostart`（先用 `--list` 确认端口）；无硬件用 `--demo` 看界面、`--names` 改通道名。依赖 `python -m pip install pyserial`（tkinter 随 Python 自带）；通道定义（遥控器 `c0…c9` → `ch1…ch4 / swa-5…swd-8 / vra / vrb`）见其 `README.md`。下载：`教学webppt/ESP32-S3电机驱动板/files/serial_monitor.zip`（随 deck 分发）。
- 不入库：`__pycache__` / `*.pyc`、`数据/*/` 内容（只保留 `.gitkeep`）、`node_modules/` 与 `**/presentation/dist/`、`.vscode/`（Live Server 写的端口）。

## ESP32-S3 板（奇果派 S3）串口与供电

- 板上两个 USB 口不一样：**USB-C 口**走 CH343 转串口（`VID_1A86:PID_55D3`），固件控制台在 **UART0 / 115200**，也是烧录口；COM 号不固定（实测为 `COM9`），用 `--list` 或 GUI 的「刷新」确认。
- 另一个口是 ESP32-S3 **原生 USB**（`VID_303A:PID_1001`，USB-Serial/JTAG）。固件没往 USB CDC 打印，**接这个口看不到任何输出**，插拔/开串口只会让它复位一次——不要据此判断板子坏了。
- 打开 CH343 串口会经 DTR/RTS 自动复位电路让板子重启并打印 `ESP-ROM:esp32s3-…` 启动日志，属正常现象。
- 跑出厂/示例固件时板子每 **~500 ms** 输出一行逗号分隔的 **10 个数值**（如 `992,992,1376,992,992,192,192,992,1126,924`），全部为 0 或恒定值表示没有接电机/没有动遥控器，不是故障。
- 串口独占：GUI 占着口时其它程序再打开会 `Access is denied`，先停 GUI（或就用 GUI 自己读）。
- 供电：Type-C 是逻辑供电/下载口，**驱动电机必须接 6–24 V（按 12V/24V 版本）动力电池**——USB 供电不足以带电机，官方明确「务必用动力型电池，供电不足会导致系统不稳」，详见 `docs/ESP32-S3电机驱动板资料.md`。

## 教学 webppt（教学webppt/）

- 一个主题一个独立 Vite 工程：`教学webppt/<主题>/presentation/`；交付成品是 `教学webppt/<主题>/index.html`（单文件，可离线双击）。
- 构建：`cd 教学webppt/<主题>/presentation` → `npm install` → `npm run build`，再把 `presentation/dist/index.html` 复制为上一级 `index.html`。
- `presentation/index.html` 是**源码壳不是成品**（引用 `/src/main.jsx`，需 Vite）：它内置守卫，在 Live Server / 双击时会自动跳转到 `../index.html`；改源码用 `npm run dev`（默认 5173）。
- 目录首页：`教学webppt/index.html`。新增 deck 优先**复制一个已有 deck 的 `presentation/`**（保证 `components.jsx` 与各 deck 一致），只改 `src/slides.jsx` 与标题/品牌；`web-slide-deck` 技能里的 `assets/deck-template/` 已落后于本仓库（缺共用组件），直接用会造成组件不一致。
- **编写守则**：组织 / 语言 / 顺序按 `教学webppt/编写守则.md`（依据多媒体学习认知理论与教学 PPT 规范）。全局主题顺序「工程与协作 → 环境与设备 → 感知 → 通信 → 执行」；单 deck 页序「封面 → 结论先行 → …… → 收尾」，收尾恒在最后。新增主题插到规定位置并同步 `index.html` 与 `README.md`；改顺序后必须重建成品。
- **统一导航**：每个 deck 成品顶栏都有固定的「← 目录」链接（源码 `presentation/src/App.jsx` 顶栏的 `<a href="../index.html">`），回到 `教学webppt/index.html`；deck 内的分页侧栏称「大纲」，别和「目录」混称。
- 各 deck 的 `components.jsx` 完全一致，`App.jsx` 仅品牌文案不同；改导航/交互要**所有 deck** 同步改并全部重建（`npm run build` 后把 `dist/index.html` 覆盖成品），否则成品与源码漂移。构建后不要留下「源码已改、成品未刷新」的状态。
- **详情默认折叠**：完整步骤 / 全量命令放共用组件 `Steps`（`<details>`，摘要写「展开：…」，默认收起）＋ `Pre`（保留换行缩进的代码块）；正文只留要点。二者定义在 `components.jsx`，不要在 `slides.jsx` 里另写一套；规则见 `教学webppt/编写守则.md`。
- **附件本地化**：deck 的可下载文件（PDF / zip / **本仓库自写的代码**）放 `<主题>/files/`，deck 里用相对链接 `./files/…` 引用，随目录一起分发，**不内联**进单文件；对应 `docs/` 里的下载链接同步改成本地路径。图片放 `presentation/src/assets/` 并用 `import` 引用，构建会内联进单文件（`assetsInlineLimit` 已调大）。相对链接只在**成品目录**下有效，`npm run dev` 下指不到 `files/`。
  已有先例：`教学webppt/ESP32-S3电机驱动板/files/{SCH_EMO_Lite.pdf,SCH_EMO_MAX_3-V1.0_USE.pdf,QGP_EVMotor.zip,serial_monitor.zip}`，下载页在 `slides.jsx` 的 `Downloads`。
- 验证要求：桌面 1366×860 与手机 390×844 逐页断言 `overflowX === 0` 且首行可见；幻灯片外层用 `min-h-full` 而非 `h-full`（否则高页内容顶部会被顶掉）。

## 图表约定（全仓库）

- **禁止**用 ASCII 字符画（`─` `│` `┌` `└` `├` `┐` `┘` `▼` 等）或线框图表示任何流程 / 架构 / 结构。
- Markdown（`docs/`、`README.md`、`培训/`）：用 ` ```mermaid ` 代码块，GitHub / GitLab 会渲染成真实图形（flowchart / sequenceDiagram / stateDiagram 等）。
- `教学webppt/` deck：用内联 `<svg>` 或结构化卡片排版；成品是**离线单文件**，不要引 CDN 或 Mermaid 运行时。
- 目录结构用嵌套列表；代码注释里的分隔线用 `---`，不用 `──`。

## 目标设备（两台树莓派，都走同一条直连网线）

### 当前在用：新 Pi

| 项 | 值 |
| --- | --- |
| 主机名 | `zhangsk` |
| 硬件/系统 | Raspberry Pi 5 (aarch64, `2712`)，Debian 13 (trixie)，kernel `6.18.50+rpt-rpi-2712` |
| IPv4 | `172.26.188.116`（eth0 静态 /24，无网关、`never-default yes`） |
| IPv6 备用 | `fe80::2ecf:67ff:fece:9bce%<本机以太网 ifIndex>`（仅经网线可达） |
| 账号 | `nanzhida` / `nanzhida`（在 `sudo` 组，无 NOPASSWD，必须用 `--sudo`） |
| 网口 MAC | `2c:cf:67:ce:9b:ce`（eth0） |
| 无线 | wlan0 `192.168.31.29/24`（与本机 WLAN 同网段，可当带外通道） |

### 旧 Pi（保留）

| 项 | 值 |
| --- | --- |
| 主机名 | `NCZYDX` |
| IPv4 | `172.26.188.115`（eth0 静态 /24） |
| IPv6 备用 | `fe80::2ecf:67ff:fece:a998%<本机以太网 ifIndex>` |
| 账号 | `nczydx` / `123456789`（sudo 同密码） |
| 网口 MAC | `2c:cf:67:ce:a9:98`（eth0） |

`tools/pi.py` 默认指向**新 Pi**；连旧 Pi 用 `--host 172.26.188.115 --user nczydx --pass 123456789`。

本机侧：Realtek 2.5GbE（网卡名「以太网」）静态 `172.26.188.100/24`（另有 `192.168.199.100/24`）、DHCP 已关闭、无网关。该网卡 ifIndex 每次开机都可能变（见过 20 / 22 / 23），用 `Get-NetAdapter` 现查，别背数字。改动需管理员权限（`Start-Process -Verb RunAs`，会弹 UAC）。

## 执行命令的方式

```
python tools/pi.py [--sudo] [--host <IP>] [--user <u>] [--pass <p>] [--file <本地脚本>] '<命令>'
```

- 选项可任意顺序、可省略；`fe80::...%20` 这种带 scope 的链路本地地址可直接作为 `--host` 传入（Windows `getaddrinfo` 认识 `%<ifIndex>`，paramiko 可用）。
- 底层用 paramiko（已装在用户级 Python 3.14：`C:\Users\z\AppData\Roaming\Python\Python314\site-packages`）：务必用 PATH 上同一个 `python`（3.14.6）运行 `tools/pi.py`，换解释器会 `ModuleNotFoundError: paramiko`。Windows 自带 OpenSSH 没有 sshpass，所以**不要**直接调 `ssh`，密码无法非交互传入。
- 复杂命令、含引号/括号/管道的命令一律写成 **纯 ASCII** 的 `.sh`，用 `--file` 上传到 `/tmp/kilo-run.sh` 执行。PowerShell → paramiko → bash 三层引号极易被破坏（会报 `unexpected token` / `bash: - : invalid option`）。
- PowerShell 5.1：不支持 `&&`；**不要把中文路径写进 `.ps1` 文件**——UTF-8 无 BOM 的脚本会被按 ANSI 读取，生成乱码目录、文件落错位置（本仓库踩过：`教学webppt` 变 `鏁欏webppt`）。中文路径改用 **bash 内联命令**（工具按 UTF-8 传入），或写成带 BOM 的脚本。网卡操作用 `Get-NetAdapter | Where-Object { $_.ifIndex -eq <号> }` 管道传对象，不要用中文网卡名。
- `Restart-NetAdapter` / `Disable-NetAdapter` / `Enable-NetAdapter` 都不接受 `-InterfaceIndex`，必须走上面的管道；`Get-NetAdapterStatistics` / `Get-NetAdapterAdvancedProperty` 同理（只接受 `-Name`，或用管道）。
- 临时脚本放 `C:\Users\z\AppData\Local\Temp\kilo\`。

## Pi 网络配置现状

- 新 Pi `netplan-eth0`：`ipv4.method manual` / `172.26.188.116/24` / 无网关 / `never-default yes` / `ipv6.method auto`。
- 旧 Pi `netplan-eth0`：`172.26.188.115/24`，其余同上。
- 改 eth0 会掐断走网线的 SSH（含 IPv6 会话）：优先走 Wi-Fi（新 Pi wlan0 `192.168.31.29`）操作；或把 `nmcli con up` 后台延迟执行（`nohup bash -c 'sleep 3; nmcli con up netplan-eth0' &`）再轮询验证。
- 改回 DHCP：`python tools/pi.py --sudo "nmcli con mod netplan-eth0 ipv4.method auto ipv4.addresses '' && nmcli con up netplan-eth0"`。

## ROS 2 / Docker（新 Pi）

- 树莓派上装 **ROS 2**（不装 micro-ROS），方案为 Docker + `ros:jazzy-ros-base`；选型与安装记录见 `docs/ROS2与micro-ROS选型.md`。
- 已就绪：Docker 26.1.5（Debian 源 `docker.io`，已设开机自启，`nanzhida` 在 `docker` 组）；镜像 `ros:jazzy-ros-base`（896 MB）、`ros:jazzy-ros-core`（511 MB）。
- 进入 ROS 2：Pi 上运行 `~/ros2.sh`，可追加参数如 `~/ros2.sh --device /dev/video0`（摄像头）、`--device /dev/i2c-1 --device /dev/gpiomem`。
- **拉取镜像走本机 Clash 代理**（Docker Hub 直连不可达）：本机 Clash Verge 需 `allow-lan: true` + `mixed-port 7897`；Pi 侧 dockerd 代理在 `/etc/systemd/system/docker.service.d/http-proxy.conf`，指向 `http://192.168.31.57:7897`（WLAN）或 `http://172.26.188.100:7897`（直连）。**拉镜像前确认本机 Clash 在运行。**
  `allow-lan: true` 等于对全网卡开放无鉴权代理，共享 WLAN 下建议把 Clash `bind-address` 限定到 `172.26.188.100`，或用完即关。
- **WSL2 侧 ROS 2**：Ubuntu 24.04 已装 `ros-jazzy-ros-base`（apt，走清华 TUNA 镜像 `http://mirrors.tuna.tsinghua.edu.cn/ros2/ubuntu`）；`.wslconfig` 为 `networkingMode=Mirrored` + `hostAddressLoopback`，WSL 直接持有宿主 IP（`172.26.188.100`、`192.168.31.57`），与 Pi 同网段互通；`~/.bashrc` 已 source `setup.bash`。
- **跨机 ROS 2（WSL2 ↔ Pi）**：两端用同一 `ROS_DOMAIN_ID`（示例 42）+ `ROS_STATIC_PEERS` 指定对端直连 IP，绕开多网卡/组播发现。注意**本机入站 UDP 默认被拦**（WSL Hyper-V 防火墙 `DefaultInboundAction=Block` + Windows 防火墙，两个网卡都是 Public），否则跨机 DDS 发现失败；已加定向规则只放行 `172.26.188.116` 的 UDP 入站（WSL Hyper-V + Windows 两层），改动需管理员（`Start-Process -Verb RunAs`，会弹 UAC）。
- 验证 demo：`教学demo/ROS2消息通路验证/`（ping/pong，实测 5/5、RTT 1–2 ms）。

## 已踩过的坑

- **Docker 拉大镜像卡在 layer**：直连 `registry-1.docker.io` 超时；`docker.m.daocloud.io` / `docker.1ms.run` / `docker.1panel.live` 等镜像站能拉小镜像（如 `alpine`），但拉 `ros:jazzy-ros-base` 时大 layer 反复卡死（`Download complete` 后长时间不推进，重试可续但极慢）。最终用**本机 Clash 代理**拉取成功，速度快且稳定。`/etc/docker/daemon.json` 现为 `{}`（已不再配 `registry-mirrors`）。
- **WSL2 跨机 DDS 发现失败**：根因是本机入站 UDP 被拦——从 Pi `ping 172.26.188.100` 若 100% 丢包即入站被拦（WSL Hyper-V 防火墙默认入站 Block、Windows 防火墙两网卡均 Public）。加定向放行规则（见上节）后 Pi→WSL 的 UDP 才通。
- **直连网线链路不稳定**：本机网卡多次出现 `MediaConnectionState=Disconnected` / `LinkSpeed 0 bps`、收发字节长期为 0，此时强制 1G/100M/10M、关 Realtek 节能特性、复位网卡都无效；换网线/重插后恢复。`0 bps` 属于物理层无信号，不必再从软件侧找。
- **新 Pi 的 eth0 出厂是 DHCP**：直连线上没有 DHCP 服务器，会一直卡在 `connecting (getting IP configuration)`，此时只有 IPv6 链路本地可用（`ping -6 ff02::1%<ifIndex>` 或邻居表可发现）。已改为静态 IPv4。
- **`172.26.188.114` 不是固定地址**，那是旧 Pi wlan0 从手机热点 `Redmi K70`（网关 `172.26.188.48`）DHCP 拿到的租约，热点一断即失效。不要再把 `.114` 当成 Pi 的地址用。
- **IPv4 与 IPv6 同时不通**时，通常是 Pi 的 NM 因 eth0 反复 DHCP 失败而失活该设备，连链路本地地址一起被清掉（表现为二层完全静默：链路仍 1 Gbps Up 但零入站报文）。解决办法是本机网卡 disable/enable 制造一次链路抖动，或重插网线/重启 Pi。
- 这条网线是**直连**（笔记本 ↔ Pi），两端任何一侧指望 DHCP 都不会成功。
- **资料站可直连、Docker Hub 不行**：抓取奇果派（`www.7gp.cn` / `doc.7gp.cn`）的图片与文件可直接 `Invoke-WebRequest`，无需 Clash 代理；GitHub 同样可直连（`raw.githubusercontent.com` 上已推送的文件返回 200）。只有 Docker Hub 才需要走代理（见上）。个别直链会 404（如 `doc.7gp.cn/download/FlashingTool.zip`），先按官网文章页核链接再判失败。
- **本机只有一份「学而思编程助手」内嵌的 esptool `3.0-dev`**（`C:\Users\z\AppData\Local\Programs\学而思编程助手\`）。它能打开串口但**不支持 ESP32-S3 的 USB-JTAG**：表现为 `Connecting....` 后 `serial.serialutil.SerialTimeoutException: Write timeout`。要 `chip_id` / `flash_id` 得另装 esptool ≥ 4.x（`python -m pip install esptool`）。
- **截 GUI 窗口不要用 `CopyFromScreen`**：窗口被别的程序（游戏等）遮挡时会拍到遮挡窗口的画面。按窗口句柄用 `PrintWindow(hwnd, hdc, 2)` 抓最稳；句柄用 `Get-Process <exe> | Where-Object { $_.MainWindowHandle -ne 0 }` 取——`background_process` 返回的 pid 常是外层 powershell，它的 `MainWindowHandle` 为 0。

## 仓库状态

- git 仓库分支 `main`，跟踪 `origin/main`；`.kilo/worktrees/` 是 Kilo Agent Manager 的状态目录，不要手改。
