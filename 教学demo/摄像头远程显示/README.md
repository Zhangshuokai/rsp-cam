# 摄像头远程显示 Demo

树莓派采集 USB 摄像头（OpenCV + V4L2/MJPG）→ 裸 TCP 推流 → 本机收帧显示。
设计原理见 `docs/设计原理流程图.md`；摄像头硬件参数见 `docs/摄像头参数.md`、选型见 `docs/摄像头选型.md`。

## 文件

- `cam_server.py` —— 跑在树莓派上：采集 → JPEG → `4 字节大端长度 + 载荷` 推流。
- `cam_view.py` —— 跑在本机：收帧解码 → 窗口显示（`q` / `Esc` 退出，`--check` 为无窗口验证）。

## 运行

> 以下命令在本目录（`教学demo/摄像头远程显示/`）下执行。

树莓派端（默认监听 `172.26.188.116:5000`、640×480、JPEG 质量 100）：

```bash
python3 cam_server.py
# 最高采集：python3 cam_server.py --width 1280 --height 960 --quality 100 --fps 25
```

本机端（默认连 `172.26.188.116:5000`）：

```bash
python cam_view.py
# 无窗口验证：python cam_view.py --check --frames 60
```

## 依赖

- 树莓派：`python3-opencv`（`sudo apt-get install -y python3-opencv`）
- 本机：`opencv-python`、`numpy`
- 树莓派连接与部署见 `AGENTS.md` 与 `tools/pi.py`
