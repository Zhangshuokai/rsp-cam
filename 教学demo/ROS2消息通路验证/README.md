# ROS2消息通路验证（WSL2 ↔ 树莓派）

在本地 **WSL2** 装 ROS 2 Jazzy，与树莓派上的 ROS 2（Docker 容器）做一轮 **ping-pong 往返**，
用来验证：树莓派 ROS 2 节点可用 + 跨主机的 ROS 2 消息通路双向可达。

- `ping.py`：发起端，跑在 **WSL2**（宿主 apt 装的 ROS 2）。
- `pong.py`：回应端，跑在 **树莓派**（`ros:jazzy-ros-base` 容器，`--network host`）。

话题：`/kilo_ping`（WSL→Pi）、`/kilo_pong`（Pi→WSL），`std_msgs/String`。
pong 回包格式 `"<原始载荷>|pong#<序号>@<主机名>"`，带主机名以证明是树莓派回的。

## 环境

| 项 | 值 |
| --- | --- |
| WSL2 | Ubuntu 24.04 (noble)，`ros-jazzy-ros-base`（apt，TUNA 镜像） |
| 宿主网络 | `.wslconfig` 设 `networkingMode=Mirrored`，WSL 直接持有宿主 IP |
| 直连链路 | 宿主 `172.26.188.100` ↔ 树莓派 `172.26.188.116` |
| 树莓派 | Docker + `ros:jazzy-ros-base`（见 `docs/ROS2与micro-ROS选型.md`） |

## 防火墙（关键前置）

跨机 DDS 需要**本机入站 UDP**；默认 WSL 的 Hyper-V 防火墙入站是 Block，Windows 防火墙入站也拦。
已加**定向**规则（只放行树莓派 `172.26.188.116` 的 UDP 入站，需管理员/UAC）：

```powershell
# WSL 侧 Hyper-V 防火墙
New-NetFirewallHyperVRule -Name 'ROS2-DDS-Pi-DirectLink' `
  -DisplayName 'ROS2 DDS from Pi (direct link)' -Direction Inbound `
  -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' `
  -Protocol UDP -LocalPorts Any -RemoteAddresses '172.26.188.116' -Action Allow

# Windows 防火墙
New-NetFirewallRule -DisplayName 'ROS2 DDS from Pi (direct link)' -Direction Inbound `
  -Protocol UDP -LocalAddress '172.26.188.100' -RemoteAddress '172.26.188.116' `
  -Action Allow -Profile Any
```

## 运行

1）树莓派起 pong（容器内，host 网络，domain 42；`pong.py` 先放到 `/home/nanzhida/pingpong/`）：

```bash
docker rm -f ros2-pong 2>/dev/null
docker run -d --name ros2-pong --network host --hostname pi-zhangsk \
  -e ROS_DOMAIN_ID=42 -e ROS_STATIC_PEERS=172.26.188.100 \
  -v /home/nanzhida/pingpong:/ws \
  ros:jazzy-ros-base \
  bash -lc 'source /opt/ros/jazzy/setup.bash && exec python3 /ws/pong.py'
docker logs ros2-pong   # 期望：pong ready on pi-zhangsk, waiting for kilo_ping
```

2）WSL 起 ping（`ping.py` 放 `~/pingpong/`）：

```bash
source /opt/ros/jazzy/setup.bash
ROS_DOMAIN_ID=42 ROS_STATIC_PEERS=172.26.188.116 python3 ~/pingpong/ping.py 5 3
```

## 实测结果（2026-09-25）

```text
waiting for pong peer on /kilo_ping ...
peer found, starting ping-pong
...
5/5 rounds answered
min=1.0 ms  max=2.0 ms  avg=1.3 ms
pong='1|wsl|1790341577.646|pong#1@pi-zhangsk'
```

## 要点

- 两端 `ROS_DOMAIN_ID` 必须一致（这里 42）。
- 直连链路跨机建议用 `ROS_STATIC_PEERS` 明确对端直连 IP，绕开多网卡/组播发现的坑。
- 停止：`docker rm -f ros2-pong`。
