# 树莓派竞赛工作区 · 协作备忘

仓库是树莓派（Pi 5）视觉/工程竞赛工作区，按**用途**分目录；完整划分与命名见根 `README.md` 与 `docs/工作区结构与协作约定.md`。本文件是给会话直接读的要点版，与那两处同源，改动要一致。

- Python 侧**没有构建 / 测试 / lint 工具链**，不要去找；个别脚本有 pip 依赖（`paramiko`、`pyserial`，已装在用户级 Python 3.14）。只有 `教学webppt/` 用 npm/Vite 构建。
- 仓库**没有 `kilo.json`、没有 CI / pre-commit**；每个分类目录有 `README.md` 说明用途与命名，新增内容先看对应 README（如 `数据/README.md`、`模型/README.md`）。

## 工作流约定（用户要求）

- **根目录是暂存区**：新文件在提交前必须归档进合适分类目录，并同步相关 md（目标目录 `README.md`，必要时根 `README.md`）。移动已跟踪文件用 `git mv` 保留历史；路径含中文，命令里要加引号。
- 归档去向：培训资料/规则解读 → `培训/`；可运行最小示例 → `教学demo/<名称>/`；技术文档 → `docs/`；算法 → `算法/`；权重与产物 → `模型/`；训练脚本 → `训练/`；数据集 → `数据/`（内容不入库）；脚本工具 → `tools/`；线下教学 deck → `教学webppt/<主题>/`。
- **本地编写的代码必须给出下载地址**（deck 收尾下载页、`docs/`、最终答复），不能只留仓库路径。离线首选：把文件/zip 放进对应 `教学webppt/<主题>/files/`，deck 里用相对链接 `./files/…`——**下载目标必须在成品目录内可达，不要指向 deck 之外的仓库路径**（否则静态页取不到，本仓库踩过）。在线地址（`origin` = `https://github.com/Zhangshuokai/rsp-cam`）：`…/blob/main/<路径>`，raw 直链 `…/raw.githubusercontent.com/…`（直连不稳、需重试）；**写 GitHub 地址前先确认文件已 push 到 `origin/main`**，未推送是 404，只能给仓库内路径或 `files/` 副本。`files/` 副本与源文件改动后同步刷新，别留两版。
- **归档/新增内容后自动更新 webppt**：用 `web-slide-deck` 技能生成或更新对应主题，产物放 `教学webppt/<主题>/`，并**执行构建刷新成品**（见下节），不再逐次询问。新 deck 还要同步 `教学webppt/index.html` 目录首页与 `教学webppt/README.md`「已有主题」。
- 提交信息沿用历史风格（`feat(...):` / `docs(...):` / `fix(...):` + 中文描述）；**不主动 push**。

## 目录与入口

- **摄像头远程显示**：`教学demo/摄像头远程显示/{cam_server.py,cam_view.py}`（原理 `docs/设计原理流程图.md`，硬件 `docs/摄像头参数.md`、`docs/摄像头选型.md`）。Pi 端先 `sudo apt-get install -y python3-opencv`，脚本放 `/home/nanzhida/cam_server.py`，后台 `nohup python3 cam_server.py > /tmp/cam_server.log 2>&1 &`；本机 `python "教学demo/摄像头远程显示/cam_view.py"`（默认 `172.26.188.116:5000`）。
- **树莓派连接工具**：`tools/pi.py`（`--put <本地> <远端>` 只上传不执行）。完整用法、两台 Pi 参数、网络与排障见 `docs/树莓派连接与部署.md`；工具链坑（PlatformIO 加速、WSL 编库、链接参数、PowerShell/串口）见 `docs/工具链与踩坑.md`。
- **ESP32-S3 电机驱动板（奇果派 S3）资料汇总**：`docs/ESP32-S3电机驱动板资料.md`（硬件/接线/Arduino/Mixly/物联网/micro-ROS）。
- **ESP32-S3 接入 micro-ROS**：步骤 deck `教学webppt/ESP32-S3接入micro-ROS/`；背景见 `docs/ESP32-S3电机驱动板资料.md` 第六节与 `docs/ROS2与micro-ROS选型.md` 第六节。固件工程 `教学demo/ESP32-S3-microROS/`（头文件 `micro_ros_platformio.h`，`board_microros_distro = jazzy` + `board_microros_transport = wifi`；结构照奇果派官方示例——FreeRTOS 任务管 WiFi/`rmw_uros_ping_agent` 重连/心跳，节点名 `esp32_car`）。控车按「已踩过的坑」实测配方。Pi 侧监听节点 `pi/heartbeat_listener.py`（官方原样，`pi.py --put` 上传）。下载：`教学webppt/ESP32-S3接入micro-ROS/files/{ESP32-S3-microROS.zip,micro-ROS-official-src.zip}`。
- **串口波形监控 GUI**：`tools/serial_monitor/serial_monitor.py`（tkinter + pyserial；示波器风格、10 通道、悬停游标、点徽标隐藏通道）。`python tools/serial_monitor/serial_monitor.py --port <COM> --baud 115200 --autostart`（先 `--list`）；无硬件用 `--demo`，`--names` 改通道名。依赖 `python -m pip install pyserial`（tkinter 随 Python）。通道定义（`c0…c9` → `ch1…ch4 / swa-5…swd-8 / vra / vrb`）见其 `README.md`。下载 `教学webppt/ESP32-S3电机驱动板/files/serial_monitor.zip`。
- **工创赛「智能+」两赛项**：`培训/工创赛智能救援-限重方案调研/`（救援）、`培训/工创赛智能搬运-调研包/`（搬运 v1.2；`00`–`07` 外部包，`08-联网补充与规格核对.md` 是按官方原文 + 联网核对的补齐件——规则口径、圆环/区域尺寸、文档分与决赛、视觉与通信参数、电控对标、RDK X5 / ZDT 步进规格都在 `08`；补件3 见 `09-补件3-攻略与省冠技术报告.md` + `浙工大非官方攻略/` + `河北冠-技术报告与代码/`——浙工大视觉算法与训练部署教程、2025 河北省冠 STM32F4 报告与代码，正弦加减速 / 边转边直走 / 陀螺仪与舵机供电教训）。文字版 `docs/智能救援车辆设计.md`、`docs/智能搬运车辆设计.md`；deck `教学webppt/智能救援车辆设计/`、`教学webppt/智能搬运车辆设计/`。搬运规则原文合订本 `培训/工创赛智能搬运-调研包/官方原件/搬运-官方原文分节合订.txt`（附件 2-1/2-2 全，含官方圆环尺寸公式与判定口径）。
- **不入库**：`__pycache__/` / `*.pyc`、`数据/*/` 内容（只留 `.gitkeep`）、`node_modules/` 与 `**/presentation/dist/`、`.vscode/`（Live Server 写的端口）、`.pio/`（PlatformIO 产物与预编译 `libmicroros`，约 60 MB）、`教学demo/ESP32-S3-microROS/include/secrets.h`（Wi-Fi 密码，模板 `secrets.example.h` 入库）、`.kilo/worktrees/`（Kilo Agent Manager 状态，不要手改）。`.gitattributes` 固定 `*.sh text eol=lf`，否则 WSL 脚本变 CRLF 报 `$'\r': command not found`。

## ESP32-S3 板（奇果派 S3）串口与供电

- 两个 USB 口不一样：**USB-C 口**走 CH343 转串口（`VID_1A86:PID_55D3`），固件控制台在 **UART0 / 115200**，也是烧录口；COM 号不固定（实测 `COM9`），用 `--list` 或 GUI「刷新」确认。
- 另一口是 ESP32-S3 **原生 USB**（`VID_303A:PID_1001`，USB-Serial/JTAG）。固件没往 USB CDC 打印，**接这个口看不到任何输出**，插拔/开串口只让它复位一次——不要据此判断板子坏。
- 打开 CH343 串口会经 DTR/RTS 自动复位电路让板子重启并打印 `ESP-ROM:esp32s3-…` 启动日志，正常。
- 出厂/示例固件每 **~500 ms** 输出一行逗号分隔的 **10 个数值**（如 `992,992,1376,992,992,192,192,992,1126,924`）；全 0 或恒定表示没接电机/没动遥控器，不是故障。
- 串口独占：GUI 占着口时其它程序再打开会 `Access is denied`，先停 GUI（或就用 GUI 读）。
- 供电：Type-C 是逻辑供电/下载口，**驱动电机必须接 6–24 V（按 12V/24V 版本）动力电池**——USB 供电不足以带电机，官方明确「务必用动力型电池」，详见 `docs/ESP32-S3电机驱动板资料.md`。

## 教学 webppt（教学webppt/）

- 一个主题一个独立 Vite 工程：`教学webppt/<主题>/presentation/`；交付成品是 `教学webppt/<主题>/index.html`（单文件，可离线双击）。
- 构建：`cd 教学webppt/<主题>/presentation` → `npm install` → `npm run build`，再把 `presentation/dist/index.html` 复制为上一级 `index.html`。
- `presentation/index.html` 是**源码壳不是成品**（引 `/src/main.jsx`，需 Vite），内置守卫在 Live Server / 双击时自动跳 `../index.html`；改源码用 `npm run dev`（默认 5173）。
- 新增 deck 优先**复制一个已有 deck 的 `presentation/`**（保证 `components.jsx` 与各 deck 一致），只改 `src/slides.jsx` 与标题/品牌；`web-slide-deck` 技能的 `assets/deck-template/` 已落后本仓库（缺共用组件），直接用会组件不一致。复制后改 `package.json` 的 `name`/`description` 与 `presentation/index.html` 的 `<title>`（成品标题由它内联）。
- 复制 `presentation/` 时**不要用 Python `shutil.copytree` 连 `node_modules` 一起拷**——会漏文件（实测缺 `vite/dist/node/cli.js`，`npm run build` 报 `ERR_MODULE_NOT_FOUND`，而 `npm install` 还误报 up to date）。用 `robocopy <src>\node_modules <dst>\node_modules /MIR`（长路径安全），或在目标删掉重装。
- **编写守则**：组织/语言/顺序按 `教学webppt/编写守则.md`。全局主题顺序「工程与协作 → 环境与设备 → 感知 → 通信 → 执行」；单 deck 页序「封面 → 结论先行 → …… → 收尾」，收尾恒在最后；插入后同步 `index.html` 与 `README.md` 并重建成品。
- **统一导航**：每个成品顶栏固定「← 目录」链接（源码 `presentation/src/App.jsx` 的 `<a href="../index.html">`）回 `教学webppt/index.html`；deck 内分页侧栏称「大纲」，别和「目录」混称。
- 各 deck 的 `components.jsx` 一致，`App.jsx` 仅品牌文案不同；改导航/交互要**所有 deck** 同步改并全部重建，否则成品与源码漂移。构建后不要留「源码已改、成品未刷新」。
- **详情默认折叠**：完整步骤/命令放共用 `Steps`（`<details>`，摘要「展开：…」，默认收起）＋ `Pre`（保留换行缩进）；正文只留要点。二者定义在 `components.jsx`，不要在 `slides.jsx` 另写一套。
- **附件本地化**：可下载文件（PDF / zip / 本仓库自写代码）放 `<主题>/files/`，deck 用相对链接 `./files/…`，随目录分发、**不内联**进单文件；对应 `docs/` 下载链接同步改本地路径。图片放 `presentation/src/assets/` 用 `import`（构建内联进单文件，`assetsInlineLimit` 已调大）。相对链接只在**成品目录**下有效，`npm run dev` 指不到。先例：`教学webppt/ESP32-S3电机驱动板/files/{SCH_EMO_Lite.pdf,SCH_EMO_MAX_3-V1.0_USE.pdf,QGP_EVMotor.zip,serial_monitor.zip}`、`教学webppt/智能搬运车辆设计/files/{调研包核心文档与官方原件.zip,补件3-攻略与省冠技术报告.zip,文字版教程.md}`。
- **验证要求**：桌面 1366×860 与手机 390×844 逐页断言 `overflowX === 0` 且首行可见；幻灯片外层用 `min-h-full` 而非 `h-full`（否则高页顶部被顶掉）。不能直接开 `file://`（Playwright 拦），要在 `教学webppt/` 起 `python -m http.server <port>`，访问 `http://127.0.0.1:<port>/<主题>/index.html?t=<n>#/1`（中文目录名 URL 编码，`?t=` 破缓存）。逐页断言做法：循环 `location.hash='#/'+i`、等 React 重渲染后 `main.scrollTop=0`，量 `main`/`documentElement` 的 `scrollWidth-clientWidth` 与首页元素 `getBoundingClientRect().top`，并统计底部 `x / N`；下载页的相对 `./files/…` 链接要确认返回 200。

## 图表约定（全仓库）

- **禁止** ASCII 字符画（`─` `│` `┌` `└` `├` `┐` `┘` `▼` 等）或线框图表示任何流程/架构/结构。
- Markdown（`docs/`、`README.md`、`培训/`）用 ` ```mermaid ` 代码块；`教学webppt/` deck 用内联 `<svg>` 或结构化卡片（成品离线单文件，不引 CDN / Mermaid 运行时）。
- 目录结构用嵌套列表；代码注释里的分隔线用 `---`，不用 `──`。

## 目标设备（两台树莓派，同一根直连网线）

### 当前在用：新 Pi

| 项 | 值 |
| --- | --- |
| 主机名 | `zhangsk` |
| 硬件/系统 | Raspberry Pi 5 (aarch64, `2712`)，Debian 13 (trixie)，kernel `6.18.50+rpt-rpi-2712` |
| IPv4 | `172.26.188.116`（eth0 静态 /24，无网关、`never-default yes`） |
| IPv6 备用 | `fe80::2ecf:67ff:fece:9bce%<本机以太网 ifIndex>`（仅经网线可达） |
| 账号 | `nanzhida` / `nanzhida`（在 `sudo` 组，无 NOPASSWD，必须 `--sudo`） |
| 网口 MAC | `2c:cf:67:ce:9b:ce`（eth0） |
| 无线 | wlan0 `192.168.31.29/24`（与本机 WLAN 同网段，带外通道） |

### 旧 Pi（保留）

| 项 | 值 |
| --- | --- |
| 主机名 | `NCZYDX` |
| IPv4 | `172.26.188.115`（eth0 静态 /24） |
| IPv6 备用 | `fe80::2ecf:67ff:fece:a998%<本机以太网 ifIndex>` |
| 账号 | `nczydx` / `123456789`（sudo 同密码） |
| 网口 MAC | `2c:cf:67:ce:a9:98`（eth0） |

`tools/pi.py` 默认指向**新 Pi**；连旧 Pi 用 `--host 172.26.188.115 --user nczydx --pass 123456789`。

本机侧：Realtek 2.5GbE（网卡名「以太网」）静态 `172.26.188.100/24`（另有 `192.168.199.100/24`）、DHCP 关闭、无网关。该网卡 ifIndex 每次开机都可能变（见过 20/22/23），用 `Get-NetAdapter` 现查；改动需管理员（`Start-Process -Verb RunAs`，会弹 UAC）。

## 执行命令的方式

```
python tools/pi.py [--sudo] [--host <IP>] [--user <u>] [--pass <p>] [--file <本地脚本>] '<命令>'
python tools/pi.py --put <本地文件> <Pi 上的绝对路径>     # 只上传，不执行（SFTP，不做 ~ 展开）
```

- 选项可任意顺序、可省略；带 scope 的链路本地地址（`fe80::...%20`）可直接作 `--host`（Windows `getaddrinfo` 认识 `%<ifIndex>`）。
- 底层 paramiko（装在用户级 Python 3.14：`C:\Users\z\AppData\Roaming\Python\Python314\site-packages`）：务必用 PATH 上同一个 `python`（3.14.6），换解释器会 `ModuleNotFoundError: paramiko`。Windows 自带 OpenSSH 没有 sshpass，**不要**直接调 `ssh`。
- `pi.py` 已把 stdout/stderr `reconfigure` 成 UTF-8（`errors=replace`）：否则远端中文/`\ufeff` 会让 Windows 控制台 GBK 崩 `UnicodeEncodeError`。改脚本别删这两行。
- 复杂命令、含引号/括号/管道的一律写成**纯 ASCII** `.sh`，用 `--file` 上传到 `/tmp/kilo-run.sh` 执行（PowerShell → paramiko → bash 三层引号极易被破坏，报 `unexpected token` / `bash: - : invalid option`）。
- PowerShell 5.1：不支持 `&&`；**不要把中文路径写进 `.ps1` 文件**（UTF-8 无 BOM 会被按 ANSI 读，生成乱码目录，本仓库踩过 `教学webppt` 变 `鏁欏webppt`）。中文路径用 bash 内联命令或带 BOM 脚本。网卡操作用 `Get-NetAdapter | Where-Object { $_.ifIndex -eq <号> }` 管道传对象，不要用中文网卡名。
- `Restart-NetAdapter` / `Disable-NetAdapter` / `Enable-NetAdapter` 都不接受 `-InterfaceIndex`，必须走上述管道；`Get-NetAdapterStatistics` / `Get-NetAdapterAdvancedProperty` 同理（只接受 `-Name` 或管道）。
- 临时脚本放 `C:\Users\z\AppData\Local\Temp\kilo\`。

## Pi 网络配置现状

- 新 Pi `netplan-eth0`：`ipv4.method manual` / `172.26.188.116/24` / 无网关 / `never-default yes` / `ipv6.method auto`。
- 旧 Pi `netplan-eth0`：`172.26.188.115/24`，其余同上。
- 改 eth0 会掐断走网线的 SSH（含 IPv6）：优先走 Wi-Fi（新 Pi wlan0 `192.168.31.29`），或把 `nmcli con up` 后台延迟执行（`nohup bash -c 'sleep 3; nmcli con up netplan-eth0' &`）再轮询验证。
- 改回 DHCP：`python tools/pi.py --sudo "nmcli con mod netplan-eth0 ipv4.method auto ipv4.addresses '' && nmcli con up netplan-eth0"`。

## ROS 2 / Docker（新 Pi）

- 树莓派装 **ROS 2**（不装 micro-ROS），方案 Docker + `ros:jazzy-ros-base`；选型见 `docs/ROS2与micro-ROS选型.md`。
- 已就绪：Docker 26.1.5（Debian 源 `docker.io`，开机自启，`nanzhida` 在 `docker` 组）；镜像 `ros:jazzy-ros-base`（896 MB）、`ros:jazzy-ros-core`（511 MB）。进入 ROS 2：Pi 上 `~/ros2.sh`，可加 `--device /dev/video0`、`--device /dev/i2c-1 --device /dev/gpiomem`。
- **拉镜像走本机 Clash 代理**（Docker Hub 直连不可达）：Clash Verge 需 `allow-lan: true` + `mixed-port 7897`；Pi 侧 dockerd 代理在 `/etc/systemd/system/docker.service.d/http-proxy.conf`，指向 `http://192.168.31.57:7897`（WLAN）或 `http://172.26.188.100:7897`（直连）。**拉镜像前确认 Clash 在运行**。`allow-lan` 等于全网卡开放无鉴权代理，共享 WLAN 下建议把 `bind-address` 限定到 `172.26.188.100`，或用完即关。
- **WSL2 侧 ROS 2**：Ubuntu 24.04 已装 `ros-jazzy-ros-base`（apt，清华 TUNA 镜像）；`.wslconfig` 为 `networkingMode=Mirrored` + `hostAddressLoopback`，WSL 直接持有宿主 IP（`172.26.188.100`、`192.168.31.57`），与 Pi 同网段；`~/.bashrc` 已 source `setup.bash`。
- **跨机 ROS 2（WSL2 ↔ Pi）**：两端同一 `ROS_DOMAIN_ID`（示例 42）+ `ROS_STATIC_PEERS` 指对端直连 IP，绕开多网卡/组播发现。**本机入站 UDP 默认被拦**（WSL Hyper-V `DefaultInboundAction=Block` + Windows 防火墙，两网卡都 Public），否则跨机 DDS 发现失败；已加定向规则只放行 `172.26.188.116` 的 UDP 入站（Hyper-V + Windows 两层），改动需管理员。
- 验证 demo：`教学demo/ROS2消息通路验证/`（ping/pong，实测 5/5、RTT 1–2 ms）。

## 已踩过的坑

- **Docker 拉大镜像卡 layer**：直连 `registry-1.docker.io` 超时；`docker.m.daocloud.io` / `docker.1ms.run` / `docker.1panel.live` 能拉小镜像（`alpine`），但 `ros:jazzy-ros-base` 大 layer 反复卡死（`Download complete` 后长时间不推进，重试可续但极慢）。最终用**本机 Clash 代理**成功。`/etc/docker/daemon.json` 现为 `{}`（不再配 `registry-mirrors`）。
- **WSL2 跨机 DDS 发现失败**：根因本机入站 UDP 被拦——Pi `ping 172.26.188.100` 若 100% 丢包即入站被拦；加定向放行后 Pi→WSL 的 UDP 才通。
- **直连网线链路不稳定**：本机网卡多次 `MediaConnectionState=Disconnected` / `LinkSpeed 0 bps`、收发长期为 0，此时强制速率、关 Realtek 节能、复位网卡都无效；换线/重插后恢复。`0 bps` 是物理层无信号，别从软件找。
- **新 Pi 的 eth0 出厂是 DHCP**：直连线上没有 DHCP 服务器，会卡 `connecting (getting IP configuration)`，此时只有 IPv6 链路本地可用（`ping -6 ff02::1%<ifIndex>` 或邻居表）；已改静态 IPv4。
- **`172.26.188.114` 不是固定地址**：那是旧 Pi wlan0 从手机热点 `Redmi K70`（网关 `172.26.188.48`）DHCP 拿的租约，热点一断即失效。不要再当 Pi 地址用。
- **IPv4 与 IPv6 同时不通**：通常是 Pi 的 NM 因 eth0 反复 DHCP 失败而失活该设备（链路仍 1 Gbps Up 但零入站报文）。本机网卡 disable/enable 制造链路抖动，或重插网线/重启 Pi。
- 这条网线是**直连**（笔记本 ↔ Pi），两端任何一侧指望 DHCP 都不会成功。
- **资料站可直连、Docker Hub 不行**：奇果派（`www.7gp.cn` / `doc.7gp.cn`）图片与文件可直接 `Invoke-WebRequest`，无需代理；只有 Docker Hub 需代理。个别直链会 404（如 `doc.7gp.cn/download/FlashingTool.zip`），先按官网文章页核链接。
- **联网抓资料的现状（2026-09 实测）**：可直连的有 `www.7gp.cn` / `doc.7gp.cn`、`www.wit-motion.com`、`developer.d-robotics.cc`（RDK X5 规格页）、`api.github.com`。`raw.githubusercontent.com` **不稳定**（多数请求 40 s 超时，重试 1–3 次才偶有 200；`webfetch` 对该域名直接 `Transport error`）——抓仓库 README 优先走 `api.github.com`（`/repos/<owner>/<repo>/readme`，`Accept: application/vnd.github+json`），或对 raw 多次重试并加 `User-Agent`。`gcxl.edu.cn` HTTPS 证书不受信任；`www.zdtmotor.com` DNS 解析失败。**Bing RSS（`?format=rss`）返回空 channel，Bing HTML 中文搜索基本无关**——别拿搜索引擎兜底。
- **写 GitHub 链接前先确认文件已在 `origin/main`**：已推送的可直连 200（需重试），未推送 404；不确定就只给仓库内路径或 `files/` 副本。
- **本机只有一份「学而思编程助手」内嵌的 esptool `3.0-dev`**（`C:\Users\z\AppData\Local\Programs\学而思编程助手\`）：能打开串口但**不支持 ESP32-S3 的 USB-JTAG**（`Connecting....` 后 `serial.serialutil.SerialTimeoutException: Write timeout`）。要 `chip_id` / `flash_id` 得另装 esptool ≥ 4.x（`python -m pip install esptool`）。
- **截 GUI 窗口不要用 `CopyFromScreen`**（被其它窗口遮挡时会拍到遮挡窗口）。按窗口句柄用 `PrintWindow(hwnd, hdc, 2)`；句柄用 `Get-Process <exe> | Where-Object { $_.MainWindowHandle -ne 0 }` 取——`background_process` 返回的 pid 常是外层 powershell，其 `MainWindowHandle` 为 0。
- **PlatformIO 下载慢到不可用**：`pio run` 装 `espressif32` 平台/工具链时 registry 302 到境外对象存储（实测 `usc1.contabostorage.com`），**单连接约 50 KB/s**（Windows 直连和走 Clash 都慢，不是代理问题）；该存储支持 HTTP Range，多连接线性叠加（24 连接 ~1 MB/s）。用 `tools/pio_mirror_seed.py` 按 PIO 缓存命名（`sha1(镜像 Location + X-PIO-Content-SHA256)`）预取到 `~/.platformio/.cache/downloads/`，之后 `pio run` 命中缓存。另：PIO 的平台/工具包**可能装不全就中断**（下载 tmp 长期 0 字节），杀掉重跑即可。
- **`micro_ros_platformio` 在原生 Windows 编不过**（不是配置问题）：首次构建要 POSIX shell + `colcon` 交叉编译 `libmicroros`（`. <venv>/activate`、`` `which python` ``、`install/setup.sh`），Windows `cmd` 报 `'.' is not recognized`。且它**总是从源码编库**，官方无预编译包（`micro_ros_arduino` 的 `src/` 只有 `esp32`、没有 `esp32s3`，且只支持 serial）。做法：WSL 里跑一次 `tools/microros_lib_wsl.sh`，产物 `libmicroros/`（`libmicroros.a` + `include/`，约 60 MB）放回工程 `.pio` 库目录即可跨平台复用（同一 xtensa 工具链，Windows 链接正常）。
- **官方 `QGP_EVMotor` 在 PlatformIO 里要手动补链接参数**：预编译库是 `src/esp32s3/libqgpmotor.a`，`library.properties` 写了 `precompiled=true`，PlatformIO 只据此加 `LIBPATH`、**不加 `-l`**（`builder/tools/piolib.py` 的 `build_flags`），归档名 `libqgpmotor.a` 与库名 `QGP_EVMotor` 也对不上 → `undefined reference to EMotionPI::begin()` 等。补 `build_flags = -Llib/QGP_EVMotor/src/esp32s3 -lqgpmotor`（工程已配好）。库内 NimBLE 占 341 文件/4.5 MB（蓝牙手柄），随工程内置的是裁过的子集。
- **驱动本板电机（无编码器直流有刷、履带 M1/M2）的实测配方与四个坑**（2026-09 台架逐条验证；官方 A9/A10 直接抄无效）：
  1. **`emo.getEncoderMotor(M1/M2)->begin(90)` 必须调**（哪怕电机没编码器）：它负责初始化电机驱动输出；少了这句，`getMotor()->spin()`、`run()+setSpeed()`、`updateDuty()` **全都静默不出 PWM**（串口正常、轮子纹丝不动）。M1..M4 = 0..3，`getMotor(4)` 越界返回空指针。
  2. **占空比要够大**：`spin(40~50)` 低于静摩擦阈值不动，60 起能走、100 满速 → 非零指令映射到 60~100。
  3. **不要用 `BaseChassis::updateVelocity()` / `spinRPM()`**（目标 RPM + PID）：无编码器时反馈恒 0，PID 积分饱和到满 PWM（**零速指令下轮子自己转**），且编码器未 `begin()` 时读 PCNT 会在日志路径 `abort()` 重启。
  4. **库调用只在核心 1（`loop()`）做**：从核心 0 的 micro-ROS 任务里调 `spin()` 不出 PWM；回调只写目标值。
  另：micro-ROS Agent **固定跑在默认 DDS 域 0**，不认 `ROS_DOMAIN_ID`——Pi 侧客户端设成 42 就看不到 `/esp32/heartbeat` 等话题。

## 仓库状态

- git 分支 `main`，跟踪 `origin/main`；**不主动 push**。`.kilo/worktrees/` 是 Kilo Agent Manager 的状态目录，不要手改。
