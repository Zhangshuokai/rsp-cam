import React from "react";
import {
  Plug,
  Network,
  Terminal,
  Server,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  Search,
  Upload,
  KeyRound,
  ListChecks,
  Cable,
  Activity,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Focus, Steps, Pre } from "./components.jsx";

const Code = ({ children }) => (
  <div className="surface overflow-x-auto p-4 font-mono text-[0.78rem] leading-relaxed text-ink md:text-[0.82rem]">
    {children}
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      培训讲义 · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      树莓派连接与部署
      <br />
      <span className="text-brand-600">直连网线 · SSH 工具 · 排障</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      两台树莓派走同一条直连网线；本机用 tools/pi.py 免交互执行命令与部署脚本。
    </p>
  </div>
);

const PiDevices = () => (
  <Frame kicker="目标设备" floor="01" title="两台树莓派" wide>
    <DataTable
      head={["项", "新 Pi（在用）", "旧 Pi（保留）"]}
      rows={[
        ["主机名", "zhangsk", "NCZYDX"],
        ["硬件 / 系统", "Pi 5（aarch64, 2712）· Debian 13 trixie · 2 GB", "早期 Pi（备用）"],
        ["eth0 IPv4", "172.26.188.116/24", "172.26.188.115/24"],
        ["账号 / 密码", "nanzhida / nanzhida", "nczydx / 123456789"],
        ["eth0 MAC", "2c:cf:67:ce:9b:ce", "2c:cf:67:ce:a9:98"],
        ["IPv6 链路本地", "fe80::2ecf:67ff:fece:9bce", "fe80::2ecf:67ff:fece:a998"],
        ["无线（带外）", "wlan0 192.168.31.29/24", "—"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：两台 Pi 完整参数与核对命令">
        <Pre>{`# 新 Pi zhangsk：Raspberry Pi 5（aarch64, 2712），Debian 13 (trixie)
#   kernel 6.18.50+rpt-rpi-2712，2 GB RAM
#   eth0 172.26.188.116/24（静态、无网关、never-default yes）
#   账号 nanzhida / nanzhida（在 sudo 组，无 NOPASSWD）
#   eth0 MAC 2c:cf:67:ce:9b:ce；wlan0 192.168.31.29/24（带外通道）
#   节点名/IPv6：zhangsk / fe80::2ecf:67ff:fece:9bce%<本机以太网 ifIndex>

# 旧 Pi NCZYDX：eth0 172.26.188.115/24，MAC 2c:cf:67:ce:a9:98
#   账号 nczydx / 123456789（sudo 同密码）
#   连接时加：--host 172.26.188.115 --user nczydx --pass 123456789

# 现场核对
python tools/pi.py "hostname; uname -a; ip -4 addr show eth0"
python tools/pi.py "nmcli -g GENERAL.STATE,IP4.ADDRESS con show netplan-eth0"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const LocalSide = () => (
  <Frame kicker="目标设备" floor="02" title="本机侧网络">
    <Grid cols={2}>
      <Card title="静态地址" icon={Network}>
        有线网卡 172.26.188.100/24（另有 192.168.199.100/24），DHCP 已关闭、无网关。
      </Card>
      <Card title="ifIndex 会变" icon={Search}>
        用 Get-NetAdapter 查询，不要写死；本机曾从 23 变成 20。
      </Card>
      <Card title="需要管理员" icon={ShieldCheck}>
        改网卡配置走 Start-Process -Verb RunAs（会弹 UAC）。
      </Card>
      <Card title="直连拓扑" icon={Cable}>
        笔记本 ↔ 单根网线 ↔ 树莓派；接哪台就控制哪台。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：本机网卡排查与设置（完整命令）">
        <Pre>{`# 查网卡、ifIndex 与链路状态（ifIndex 每次开机可能变，现查）
Get-NetAdapter
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Select-Object Name, Status, LinkSpeed

# 收发字节长期为 0 = 物理层无信号
Get-NetAdapterStatistics -Name "以太网"

# 制造一次链路抖动（会短暂断网）
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Disable-NetAdapter
Get-NetAdapter | Where-Object { $_.ifIndex -eq 22 } | Enable-NetAdapter

# 改静态地址需管理员（Start-Process -Verb RunAs，会弹 UAC）
New-NetIPAddress -InterfaceIndex 22 -IPAddress 172.26.188.100 -PrefixLength 24
Set-NetIPInterface -InterfaceIndex 22 -Dhcp Disabled

# 注意：Restart/Disable/Enable-NetAdapter 不接受 -InterfaceIndex，必须管道传对象`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const DirectLink = () => (
  <Frame kicker="网络" floor="03" title="直连网络要点">
    <Grid cols={2}>
      <Card title="没有 DHCP 服务器" icon={AlertTriangle}>
        直连线上别指望自动分配；Pi 的 eth0 出厂是 DHCP，会一直卡在 connecting
        (getting IP configuration)。
      </Card>
      <Card title="eth0 静态 + never-default" icon={Network}>
        ipv4.method manual、地址 /24、无网关、never-default yes、ipv6 自动。
      </Card>
      <Card title="IPv6 链路本地备用" icon={Activity}>
        仅经网线可达；形如 fe80::...%&lt;ifIndex&gt;，Windows getaddrinfo 认得 %20。
      </Card>
      <Card title="改 eth0 会断 SSH" icon={Wifi}>
        走 Wi-Fi（Pi wlan0 192.168.31.29）操作，或用 nohup 延迟执行再轮询验证。
      </Card>
    </Grid>
    <div className="mt-4">
      <Steps title="展开：eth0 静态配置与改回 DHCP（完整命令）">
        <Pre>{`# 在 Pi 上改 eth0（新 Pi 172.26.188.116，旧 Pi 172.26.188.115）
sudo nmcli con mod netplan-eth0 \\
  ipv4.method manual ipv4.addresses 172.26.188.116/24 \\
  ipv4.gateway "" ipv4.never-default yes ipv6.method auto

# 改 eth0 会掐断走网线的 SSH：放后台延迟执行，再轮询验证
sudo nohup bash -c 'sleep 3; nmcli con up netplan-eth0' >/tmp/nm.log 2>&1 &

# 验证
ip -4 addr show eth0
ip -6 addr show eth0 scope link

# 改回 DHCP
python tools/pi.py --sudo "nmcli con mod netplan-eth0 ipv4.method auto ipv4.addresses '' && nmcli con up netplan-eth0"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Tool = () => (
  <Frame kicker="工具" floor="04" title="tools/pi.py 用法" wide>
    <div className="space-y-5">
      <Code>
        python tools/pi.py [--sudo] [--host &lt;IP&gt;] [--user &lt;u&gt;] [--pass &lt;p&gt;]
        [--file &lt;本地脚本&gt;] '&lt;命令&gt;'
      </Code>
      <DataTable
        head={["选项", "作用", "说明"]}
        rows={[
          ["--sudo", "以 root 执行", "账号不在 NOPASSWD，必须显式加"],
          ["--host", "目标地址", "默认新 Pi 172.26.188.116；可传 fe80::...%20"],
          ["--user / --pass", "账号密码", "默认 nanzhida / nanzhida；连旧 Pi 需覆盖"],
          ["--file", "上传脚本并执行", "传到 /tmp/kilo-run.sh；复杂命令必用"],
        ]}
      />
      <Quote>底层用 paramiko；Windows 自带 OpenSSH 没有 sshpass，不要直接调 ssh。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：pi.py 完整用法与等价命令">
        <Pre>{`# 基本
python tools/pi.py "hostname"

# 需要 root（账号不在 NOPASSWD，必须显式加 --sudo）
python tools/pi.py --sudo "apt-get install -y python3-opencv"

# 连旧 Pi
python tools/pi.py --host 172.26.188.115 --user nczydx --pass 123456789 "hostname"

# 上传并执行脚本（自动放到 /tmp/kilo-run.sh）
python tools/pi.py --file C:\\Users\\z\\AppData\\Local\\Temp\\kilo\\run.sh

# 只上传文件、不执行（SFTP；不做 ~ 展开，远端写绝对路径）
python tools/pi.py --put heartbeat_listener.py /home/nanzhida/microros_ws/src/heartbeat_listener.py

# 复杂命令一律先写成纯 ASCII 的 .sh 再 --file 执行，避免三层引号损坏`}</Pre>
      <p className="text-[0.84rem] text-muted">
        底层 paramiko 装在用户级 Python 3.14；要用 PATH 上同一个 <code>python</code>（3.14.6）运行。
        Windows 自带 OpenSSH 没有 sshpass，不要直接调 <code>ssh</code>；<code>pi.py</code> 已把输出设成 UTF-8，
        否则远端中文 / BOM 会让 Windows 控制台 GBK 崩溃。
      </p>
      </Steps>
    </div>
  </Frame>
);

const Usages = () => (
  <Frame kicker="工具" floor="05" title="典型用法">
    <Grid cols={2}>
      <Card title="执行命令" icon={Terminal}>
        python tools/pi.py "hostname"
      </Card>
      <Card title="需要 root" icon={KeyRound}>
        python tools/pi.py --sudo "apt-get install -y python3-opencv"
      </Card>
      <Card title="上传并运行脚本" icon={Upload}>
        python tools/pi.py --file start_cam.sh
      </Card>
      <Card title="连旧 Pi" icon={Server}>
        加 --host 172.26.188.115 --user nczydx --pass 123456789
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>复杂命令 / 含引号括号管道 → 写成纯 ASCII 的 .sh，再用 --file 执行。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：常用调用示例">
        <Pre>{`python tools/pi.py "hostname"
python tools/pi.py "ip -4 addr show eth0"
python tools/pi.py --sudo "systemctl status docker --no-pager"
python tools/pi.py --host fe80::2ecf:67ff:fece:9bce%20 "hostname"
python tools/pi.py --file deploy_cam.sh`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Deploy = () => (
  <Frame kicker="部署" floor="06" title="部署一个后台服务" wide>
    <Focus
      no="4"
      title="上传 → 启动 → 验证"
      tag="流程"
      goal="把要跑的东西送上 Pi 并让它脱离 SSH 会话持续运行。"
      points={[
        "把脚本包成 .sh 上传（避免 PowerShell→paramiko→bash 三层引号）。",
        "nohup ... > /tmp/xxx.log 2>&1 & 后台运行，SSH 断开也不被杀。",
        "ss -ltn 查端口是否监听，tail 日志看运行状态。",
        "本机用 ping / --check 做端到端验证。",
      ]}
      aside={
        <Card title="示例：摄像头服务" icon={Terminal}>
          python3 cam_server.py --bind 172.26.188.116
          <br />
          日志：/tmp/cam_server.log
        </Card>
      }
    />
    <div className="mt-4">
      <Steps title="展开：部署后台服务（完整命令）">
        <Pre>{`# 1) 本机写好纯 ASCII 脚本并上传执行
python tools/pi.py --file start_service.sh

# start_service.sh 示例（在 Pi 上运行）
# nohup python3 cam_server.py --bind 172.26.188.116 \\
#   > /tmp/cam_server.log 2>&1 &

# 2) 在 Pi 上确认端口与进程
python tools/pi.py "ss -ltn | grep 5000"
python tools/pi.py "pgrep -af cam_server"

# 3) 看日志
python tools/pi.py "tail -n 50 /tmp/cam_server.log"

# 4) 常驻容器（例：micro-ROS Agent，见 ROS2 与 micro-ROS 选型 deck）
docker run -d --name microros_agent --network host \\
  -v ~/microros_ws:/microros_ws ros:jazzy-ros-base bash -lc \\
  'source /opt/ros/jazzy/setup.bash; source /microros_ws/install/setup.bash; \\
   exec ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888'
python tools/pi.py "docker logs --tail 30 microros_agent"`}</Pre>
        <p className="text-[0.84rem] text-muted">
          Pi 重启后 <code>/home/nanzhida/</code> 下的脚本与后台进程都会丢，需重新上传并启动；
          Agent 目前未设开机自启，手动起，并且要<b>先起 Agent、再给 ESP32 上电</b>（起晚了固件也会自动重连）。
        </p>
      </Steps>
    </div>
  </Frame>
);

const Troubleshoot = () => (
  <Frame kicker="排障" floor="07" title="常见故障与处理" wide>
    <DataTable
      head={["现象", "原因", "处理"]}
      rows={[
        ["LinkSpeed 0 bps / Disconnected", "物理层无信号（网线 / 接口）", "换线、重插；别在软件侧找"],
        ["卡在 connecting (getting IP configuration)", "eth0 是 DHCP，直连线无服务器", "改静态 IP，或直接用 IPv6 链路本地"],
        ["IPv4 与 IPv6 同时不通", "NM 因反复 DHCP 失败失活设备", "本机网卡 disable/enable 制造链路抖动，或重插线 / 重启 Pi"],
        ["只有 IPv6 能通", "Pi 没有 IPv4", "fe80::2ecf:67ff:fece:9bce%20 直连"],
        ["Destination host unreachable", "ARP 无应答，网段不对", "确认 Pi 是否在该网段、链路是否 Up"],
        ["按 172.26.188.114 连不上", "那是旧 Pi wlan0 从手机热点 DHCP 拿的临时租约", "不要再用 .114，按上表地址连"],
        ["串口 Access is denied", "COM 口被独占（GUI 占着口）", "先停占用程序（或就用 GUI 自己读）"],
      ]}
    />
    <div className="mt-4">
      <Steps title="展开：排障命令合集">
        <Pre>{`# 本机（Windows）看链路与地址
Get-NetAdapter | Where-Object { $_.ifIndex -eq 20 }
Get-NetAdapterStatistics -Name "以太网"

# 制造一次链路抖动（会短暂断网）
Get-NetAdapter | Where-Object { $_.ifIndex -eq 20 } | Disable-NetAdapter
Get-NetAdapter | Where-Object { $_.ifIndex -eq 20 } | Enable-NetAdapter

# Pi 侧
ip -4 addr show eth0
ip -6 addr show eth0 scope link
cat /etc/netplan/*.yaml

# 从 Pi 看能否到本机（诊断入站是否被拦）
ping -c 3 172.26.188.100

# 升级链路状态：LinkSpeed 0 bps = 物理层无信号，换线/重插即可，
# 强制 1G/100M、关节能、复位网卡都无效

# 网络可达性：7gp.cn 与 GitHub（已推送文件）可直连；
# 只有 Docker Hub 需要本机 Clash 代理

# 备份通道：改 eth0 前优先走 Wi-Fi（Pi wlan0 192.168.31.29）
python tools/pi.py --host 192.168.31.29 "ip -4 addr show eth0"`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Gotchas = () => (
  <Frame kicker="排障" floor="08" title="PowerShell 与引号坑">
    <Grid cols={2}>
      <Card title="不支持 &&" icon={AlertTriangle}>
        Windows PowerShell 5.1 没有 &&；用 ; 或 if ($?) {"{ ... }"}。
      </Card>
      <Card title="别用中文网卡名" icon={Network}>
        用 Get-NetAdapter | Where-Object {"{ $_.ifIndex -eq 20 }"} 管道传对象。
      </Card>
      <Card title="三层引号易碎" icon={Terminal}>
        PowerShell → paramiko → bash；含引号 / 括号 / 管道一律写成 .sh。
      </Card>
      <Card title="临时脚本目录" icon={Upload}>
        放 C:\Users\z\AppData\Local\Temp\kilo\。
      </Card>
    </Grid>
  </Frame>
);

const Closing = () => (
  <Frame kicker="收尾" floor="09" title="纪律与快速清单">
    <div className="space-y-5">
      <Quote>不主动 push；改网卡 / 网络前先想清楚会不会断掉当前 SSH。</Quote>
      <Grid cols={3}>
        <Card title="先看链路" icon={Activity}>
          网卡 Status / LinkSpeed、收发字节是否为 0。
        </Card>
        <Card title="再查地址" icon={Search}>
          Pi 端 ip -4 addr；本机 Get-NetAdapter。
        </Card>
        <Card title="复用工具" icon={ListChecks}>
          一律走 tools/pi.py，不手敲 ssh。
        </Card>
      </Grid>
      <p className="text-[0.86rem] text-muted">
        文字版：<code>docs/树莓派连接与部署.md</code>（含本 deck 全部命令、参数表与排障清单）；工具链坑见 <code>docs/工具链与踩坑.md</code>。
      </p>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "两台树莓派", group: "概览", el: <PiDevices /> },
  { nav: "本机侧网络", group: "概览", el: <LocalSide /> },
  { nav: "直连网络要点", group: "网络", el: <DirectLink /> },
  { nav: "pi.py 用法", group: "工具", el: <Tool /> },
  { nav: "典型用法", group: "工具", el: <Usages /> },
  { nav: "部署后台服务", group: "部署", el: <Deploy /> },
  { nav: "故障与处理", group: "排障", el: <Troubleshoot /> },
  { nav: "引号与 PowerShell 坑", group: "排障", el: <Gotchas /> },
  { nav: "快速清单", group: "收尾", el: <Closing /> },
];
