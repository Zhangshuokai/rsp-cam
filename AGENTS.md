# 树莓派连接与操作备忘

本仓库目前只有一个脚本 `pi.py`（无构建/测试/lint 工具链，不要去找）。

## 目标设备（树莓派）

| 项 | 值 |
| --- | --- |
| 主机名 | `NCZYDX` |
| 硬件/系统 | Raspberry Pi 5 (aarch64, `2712`)，Debian 13 (trixie)，kernel `6.18.34+rpt-rpi-2712` |
| IPv4 | `172.26.188.115`（eth0 静态，/24） |
| IPv6 备用 | `fe80::2ecf:67ff:fece:a998%23`（`%23` = 本机以太网 ifIndex，仅经网线可达） |
| 账号 | `nczydx` / `123456789` |
| sudo | 同一密码，`(ALL : ALL) ALL`（无 NOPASSWD，必须用 `--sudo`） |
| 网口 MAC | `2c:cf:67:ce:a9:98`（eth0） |

本机侧：Realtek 2.5GbE（ifIndex `23`）静态 `172.26.188.100/24`、DHCP 已关闭、无网关。改动需管理员权限（`Start-Process -Verb RunAs`，会弹 UAC）。

## 执行命令的方式

```
python pi.py [--sudo] [--host <IP>] [--file <本地脚本>] '<命令>'
```

- 底层用 paramiko（`python -m pip install paramiko` 安装到用户级 Python 3.14）；Windows 自带 OpenSSH 没有 sshpass，所以**不要**直接调 `ssh`，密码无法非交互传入。
- 复杂命令、含引号/括号/管道的命令一律写成 **纯 ASCII** 的 `.sh`，用 `--file` 上传到 `/tmp/kilo-run.sh` 执行。PowerShell → paramiko → bash 三层引号极易被破坏（会报 `unexpected token` / `bash: - : invalid option`）。
- PowerShell 5.1：不支持 `&&`；`.ps1` 若含中文且为 UTF-8 无 BOM 会被按 ANSI 读取而乱码，改用 `Get-NetAdapter | Where-Object { $_.ifIndex -eq 23 }` 管道传对象，不要用网卡中文名。
- `Restart-NetAdapter` / `Disable-NetAdapter` / `Enable-NetAdapter` 都不接受 `-InterfaceIndex`，必须走上面的管道；`Get-NetAdapterStatistics` 同理（只有 `-Name`）。
- 临时脚本放 `C:\Users\z\AppData\Local\Temp\kilo\`。

## Pi 网络配置现状

- NetworkManager 配置 `netplan-eth0`：`ipv4.method manual` / `172.26.188.115/24` / 无网关 / `never-default yes` / `ipv6.method auto`（保留 IPv6 后备通道）。
- 改回 DHCP：`python pi.py --sudo "nmcli con mod netplan-eth0 ipv4.method auto ipv4.addresses '' && nmcli con up netplan-eth0"`。
- 重新激活 eth0 会掐断当前 SSH（含 IPv6 会话）：把 `nmcli con up` 放到后台延迟执行（`nohup bash -c 'sleep 3; nmcli con up netplan-eth0' &`）再轮询验证。

## 已踩过的坑

- **`172.26.188.114` 不是固定地址**，那是 wlan0 从手机热点 `Redmi K70`（网关 `172.26.188.48`）DHCP 拿到的租约，热点一断即失效。不要再把 `.114` 当成 Pi 的地址用；wlan0 的 profile 仍是 `ipv4.method auto`，热点可达时它会与 `172.26.188.0/24` 重叠。
- **IPv4 与 IPv6 同时不通**时，通常是 Pi 的 NM 因 eth0 反复 DHCP 失败而失活该设备，连链路本地地址一起被清掉（表现为二层完全静默：本机网卡 20 秒零入站报文但链路仍是 1 Gbps Up）。解决办法是本机网卡 disable/enable 制造一次链路抖动，或重插网线/重启 Pi，Pi 会自行恢复。
- 这条网线是**直连**（笔记本 ↔ Pi），线上没有 DHCP 服务器，因此两端任何一侧指望 DHCP 都不会成功。

## 仓库状态

- git 仓库分支 `main`，**尚无任何提交**；`.kilo/worktrees/` 是 Kilo Agent Manager 的状态目录，不要手改。
