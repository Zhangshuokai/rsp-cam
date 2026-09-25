# 树莓派竞赛工作区 · 协作备忘

仓库是树莓派（Pi 5）视觉/工程竞赛工作区，目录划分见 `README.md`：`docs/`、`培训/`、`教学webppt/`、`教学demo/`、`算法/`、`模型/`、`训练/`、`数据/`、`tools/`。Python 侧无构建/测试/lint 工具链，不要去找；只有 `教学webppt/` 用 npm/Vite 构建。

## 工作流约定（用户要求）

- 用户常在**根目录**新建/更新文档：提交前必须把它归档进合适分类目录，并同步更新相关 md（目标目录的 `README.md`，必要时根 `README.md`）。移动已跟踪文件用 `git mv` 保留历史；路径含中文，命令里要加引号。
- 归档去向：培训资料/规则解读 → `培训/`；可运行最小示例 → `教学demo/<名称>/`；技术文档 → `docs/`；算法 → `算法/`；权重与产物 → `模型/`；训练脚本 → `训练/`；数据集 → `数据/`（内容不入库）；脚本工具 → `tools/`；线下教学 webppt → `教学webppt/<主题>/`。
- **每次提交后**：主动询问用户是否要生成对应的教程 webppt；确认后用 `web-slide-deck` 技能生成，产物放 `教学webppt/<主题>/`。
- 提交信息沿用历史风格（`feat(...):` / `docs(...):` 等 + 中文描述）；不要主动 push。

## 目录与入口

- 摄像头远程显示：`教学demo/摄像头远程显示/{cam_server.py,cam_view.py}`（原理见 `docs/设计原理流程图.md`，硬件见 `docs/摄像头参数.md`、`docs/摄像头选型.md`）。
  Pi 端运行前需 `sudo apt-get install -y python3-opencv`，脚本放 `/home/nanzhida/cam_server.py`，后台启动 `nohup python3 cam_server.py > /tmp/cam_server.log 2>&1 &`；本机 `python "教学demo/摄像头远程显示/cam_view.py"`（默认 `172.26.188.116:5000`）。
- 树莓派连接工具：`tools/pi.py`。
- 不入库：`__pycache__` / `*.pyc`、`数据/*/` 内容（只保留 `.gitkeep`）、`node_modules/` 与 `**/presentation/dist/`、`.vscode/`（Live Server 写的端口）。

## 教学 webppt（教学webppt/）

- 一个主题一个独立 Vite 工程：`教学webppt/<主题>/presentation/`；交付成品是 `教学webppt/<主题>/index.html`（单文件，可离线双击）。
- 构建：`cd 教学webppt/<主题>/presentation` → `npm install` → `npm run build`，再把 `presentation/dist/index.html` 复制为上一级 `index.html`。
- `presentation/index.html` 是**源码壳不是成品**（引用 `/src/main.jsx`，需 Vite）：它内置守卫，在 Live Server / 双击时会自动跳转到 `../index.html`；改源码用 `npm run dev`（默认 5173）。
- 目录首页：`教学webppt/index.html`。新增 deck 用 `web-slide-deck` 技能（复制技能里的 `assets/deck-template/`，只改 `src/slides.jsx` 与标题/品牌）。
- **统一导航**：每个 deck 成品顶栏都有固定的「← 目录」链接（源码 `presentation/src/App.jsx` 顶栏的 `<a href="../index.html">`），回到 `教学webppt/index.html`；deck 内的分页侧栏称「大纲」，别和「目录」混称。
- 各 deck 的 `components.jsx` 完全一致，`App.jsx` 仅品牌文案不同；改导航/交互要 5 个 deck 同步改并全部重建（`npm run build` 后把 `dist/index.html` 覆盖成品），否则成品与源码漂移。
- 验证要求：桌面 1366×860 与手机 390×844 逐页断言 `overflowX === 0` 且首行可见；幻灯片外层用 `min-h-full` 而非 `h-full`（否则高页内容顶部会被顶掉）。

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

本机侧：Realtek 2.5GbE 静态 `172.26.188.100/24`（另有 `192.168.199.100/24`）、DHCP 已关闭、无网关。该网卡 ifIndex 会变（本机曾经是 23，现在 20），用 `Get-NetAdapter` 查。改动需管理员权限（`Start-Process -Verb RunAs`，会弹 UAC）。

## 执行命令的方式

```
python tools/pi.py [--sudo] [--host <IP>] [--user <u>] [--pass <p>] [--file <本地脚本>] '<命令>'
```

- 选项可任意顺序、可省略；`fe80::...%20` 这种带 scope 的链路本地地址可直接作为 `--host` 传入（Windows `getaddrinfo` 认识 `%<ifIndex>`，paramiko 可用）。
- 底层用 paramiko（`python -m pip install paramiko` 安装到用户级 Python 3.14）；Windows 自带 OpenSSH 没有 sshpass，所以**不要**直接调 `ssh`，密码无法非交互传入。
- 复杂命令、含引号/括号/管道的命令一律写成 **纯 ASCII** 的 `.sh`，用 `--file` 上传到 `/tmp/kilo-run.sh` 执行。PowerShell → paramiko → bash 三层引号极易被破坏（会报 `unexpected token` / `bash: - : invalid option`）。
- PowerShell 5.1：不支持 `&&`；`.ps1` 若含中文且为 UTF-8 无 BOM 会被按 ANSI 读取而乱码，改用 `Get-NetAdapter | Where-Object { $_.ifIndex -eq 20 }` 管道传对象，不要用网卡中文名。
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

## 仓库状态

- git 仓库分支 `main`，跟踪 `origin/main`；`.kilo/worktrees/` 是 Kilo Agent Manager 的状态目录，不要手改。
