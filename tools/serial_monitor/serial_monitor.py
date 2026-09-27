import argparse
import csv
import math
import queue
import threading
import time
from collections import deque

import tkinter as tk
import tkinter.font as tkfont
from tkinter import ttk, filedialog, messagebox

try:
    import serial
    from serial.tools import list_ports
except ImportError:
    serial = None
    list_ports = None

BAUD_CHOICES = ["9600", "19200", "38400", "57600", "74880", "115200", "230400", "460800", "921600"]

DEFAULT_NAMES = ["ch1", "ch2", "ch3", "ch4", "swa-5", "swb-6", "swc-7", "swd-8", "vra", "vrb"]

TRACE_COLORS = [
    "#ff4d5a", "#4ee06a", "#4d9bff", "#ffa93d", "#c06cff", "#33d6e6",
    "#ff5ce1", "#c6f24a", "#ff9db0", "#3fb8a0", "#a894ff", "#e0b060",
    "#d06a6a", "#8fe6b0", "#b8b840", "#7aa6d8",
]

BG = "#070a0d"
PANEL = "#0c1116"
SCREEN_BG = "#03060a"
GRID_MINOR = "#101d26"
GRID_MAJOR = "#1b3446"
BORDER = "#2a4a61"
TEXT = "#cfdae4"
TEXT_DIM = "#5f7286"
TEXT_FAINT = "#3d4c59"
GREEN = "#3ddc84"
AMBER = "#ffb020"
RED = "#ff5c5c"
CYAN = "#39d0ff"

FONT_UI = ("Microsoft YaHei UI", 13)
FONT_MONO = ("Consolas", 13)
FONT_MONO_BOLD = ("Consolas", 14, "bold")
FONT_VALUE = ("Consolas", 24, "bold")
FONT_NAME = ("Consolas", 24, "bold")
FONT_TITLE = ("Consolas", 22, "bold")
FONT_TINY = ("Consolas", 11)

GRID_MINOR_PX = 20
GRID_MAJOR_EVERY = 5
GUTTER_W = 250
AXIS_H = 40
TOP_PAD = 18


def shade(color, factor):
    color = color.lstrip("#")
    parts = [int(color[i:i + 2], 16) for i in (0, 2, 4)]
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(c * factor))) for c in parts)


class Channel:
    def __init__(self, index, window, name=None):
        self.index = index
        self.name = name or "c{}".format(index)
        self.color = TRACE_COLORS[index % len(TRACE_COLORS)]
        self.glow = shade(self.color, 0.34)
        self.values = deque(maxlen=window)
        self.hidden = False

    def resize(self, window):
        self.values = deque(self.values, maxlen=window)


class ScopeCanvas(tk.Canvas):
    def __init__(self, master, app, **kwargs):
        super().__init__(master, background=SCREEN_BG, highlightthickness=0, borderwidth=0, **kwargs)
        self.app = app
        self.badges = []
        self.cursor_x = None
        self.bind("<Motion>", self.on_motion)
        self.bind("<Leave>", self.on_leave)
        self.bind("<Button-1>", self.on_click)

    def on_motion(self, event):
        self.cursor_x = event.x
        self.app.cursor_dirty = True
        self.configure(cursor="hand2" if self.badge_at(event.x, event.y) else "")

    def on_leave(self, _event):
        self.cursor_x = None
        self.app.cursor_dirty = True

    def on_click(self, event):
        hit = self.badge_at(event.x, event.y)
        if hit is not None:
            hit.hidden = not hit.hidden
            self.app.redraw(force=True)

    def badge_at(self, x, y):
        for x0, y0, x1, y1, channel in self.badges:
            if x0 <= x <= x1 and y0 <= y <= y1:
                return channel
        return None

    def geometry(self):
        w = self.winfo_width()
        h = self.winfo_height()
        return w, h, GUTTER_W, w - 16, TOP_PAD, h - AXIS_H

    def redraw(self, force=False):
        self.delete("all")
        self.badges = []
        w, h, left, right, top, bottom = self.geometry()
        if w < 120 or h < 80 or right - left < 40 or bottom - top < 40:
            return

        channels = self.app.channels
        plot_w = right - left
        plot_h = bottom - top

        self.create_rectangle(0, 0, w, h, fill=SCREEN_BG, outline="")
        self.create_rectangle(left, top, right, bottom, outline=BORDER, fill="")
        self.draw_grid(left, top, right, bottom)

        if not channels:
            self.create_text(left + plot_w / 2, top + plot_h / 2, text="等待数据 …",
                             fill=TEXT_FAINT, font=("Microsoft YaHei UI", 13))
            self.draw_hint(left, bottom)
            return

        lane_h = plot_h / len(channels)
        for i, ch in enumerate(channels):
            y0 = top + i * lane_h
            y1 = y0 + lane_h
            if i % 2 == 1:
                self.create_rectangle(left + 1, y0, right - 1, y1, fill="#05090d", outline="")
            self.create_line(left + 1, y0, right - 1, y0, fill=GRID_MINOR)
            mid = (y0 + y1) / 2
            self.create_line(left + 1, mid, right - 1, mid, fill="#14222c")
            self.draw_trace(ch, y0, y1, left, right, plot_w)

        self.draw_channel_badges(channels, top, lane_h)
        self.draw_time_axis(left, right, bottom, plot_w)
        self.draw_now_marker(right, top, bottom)
        self.draw_cursor(left, right, top, bottom, plot_h)

    def draw_grid(self, left, top, right, bottom):
        x = right - GRID_MINOR_PX
        n = 0
        while x > left:
            color = GRID_MAJOR if n % GRID_MAJOR_EVERY == 0 else GRID_MINOR
            self.create_line(x, top + 1, x, bottom - 1, fill=color)
            x -= GRID_MINOR_PX
            n += 1
        y = bottom - GRID_MINOR_PX
        n = 0
        while y > top:
            color = GRID_MAJOR if n % GRID_MAJOR_EVERY == 0 else GRID_MINOR
            self.create_line(left + 1, y, right - 1, y, fill=color)
            y -= GRID_MINOR_PX
            n += 1

    def lane_range(self, values):
        lo = min(values)
        hi = max(values)
        if hi - lo < 1e-9:
            pad = 1.0 if hi == 0 else abs(hi) * 0.1
            return lo - pad, hi + pad
        pad = (hi - lo) * 0.12
        return lo - pad, hi + pad

    def draw_trace(self, ch, y0, y1, left, right, plot_w):
        values = list(ch.values)
        if ch.hidden or len(values) < 2:
            return
        lo, hi = self.lane_range(values)
        span = hi - lo
        inset = min(4.0, (y1 - y0) * 0.08)
        top_y = y0 + inset
        bot_y = y1 - inset
        step = plot_w / max(1, self.app.window - 1)
        x_off = right - 1 - (len(values) - 1) * step

        coords = []
        for k, v in enumerate(values):
            x = x_off + k * step
            y = bot_y - (v - lo) / span * (bot_y - top_y)
            coords.extend((x, y))
        if len(coords) < 4:
            return
        self.create_line(*coords, fill=ch.glow, width=4.6)
        self.create_line(*coords, fill=ch.color, width=2.0)
        last_x, last_y = coords[-2], coords[-1]
        self.create_oval(last_x - 5, last_y - 5, last_x + 5, last_y + 5, fill=ch.color, outline="")

    def draw_channel_badges(self, channels, top, lane_h):
        compact = lane_h < 72
        for i, ch in enumerate(channels):
            y0 = top + i * lane_h
            y1 = y0 + lane_h
            self.badges.append((6, y0, GUTTER_W - 10, y1, ch))
            dot_color = TEXT_FAINT if ch.hidden else ch.color
            name_color = TEXT_FAINT if ch.hidden else ch.color
            values = list(ch.values)
            mid = y0 + lane_h * (0.42 if compact else 0.36)
            radius = 9 if lane_h >= 56 else 6
            self.create_oval(14, mid - radius, 14 + radius * 2, mid + radius, fill=dot_color, outline="")
            self.create_text(46, mid, anchor="w", text=ch.name, fill=name_color, font=FONT_NAME)
            self.create_text(GUTTER_W - 16, mid, anchor="e",
                             text="{:.4g}".format(values[-1]) if values else "--",
                             fill=TEXT_FAINT if ch.hidden else TEXT, font=FONT_VALUE)
            if compact:
                continue
            label = "c{}".format(ch.index)
            if values:
                label = "c{} · {:.4g} ~ {:.4g}".format(ch.index, min(values), max(values))
            self.create_text(GUTTER_W - 16, y1 - 15, anchor="e", text=label,
                             fill=TEXT_FAINT, font=FONT_TINY)

    def draw_time_axis(self, left, right, bottom, plot_w):
        rate = self.app.line_rate()
        divisions = 5
        for i in range(divisions + 1):
            x = right - i * (plot_w / divisions)
            self.create_line(x, bottom, x, bottom + 5, fill=BORDER)
            if i == 0:
                label, anchor = "now", "e"
            else:
                if rate > 0:
                    label = "-{:.1f}s".format((plot_w / divisions * i) / self.app.px_per_sample() / rate)
                else:
                    label = "-{}".format(int((plot_w / divisions * i) / self.app.px_per_sample()))
                anchor = "w" if i == divisions else "center"
            self.create_text(x, bottom + 16, text=label, fill=TEXT_DIM, font=FONT_TINY, anchor=anchor)
        self.create_text(8, bottom + 16, anchor="w", text="时间 →", fill=TEXT_FAINT, font=FONT_TINY)

    def draw_now_marker(self, right, top, bottom):
        self.create_line(right, top + 1, right, bottom - 1, fill=shade(CYAN, 0.55))
        self.create_polygon(right - 5, top + 1, right + 5, top + 1, right, top + 8, fill=CYAN, outline="")

    def draw_cursor(self, left, right, top, bottom, plot_h):
        if self.cursor_x is None or not (left < self.cursor_x < right):
            return
        x = self.cursor_x
        self.create_line(x, top + 1, x, bottom - 1, fill=shade(AMBER, 0.7), dash=(3, 3))
        channels = [c for c in self.app.channels if c.values]
        if not channels:
            return
        step = self.app.px_per_sample()
        newest_x = right - 1
        index = int(round((x - newest_x) / step))
        lines = ["样本 {}".format(index)]
        for ch in channels:
            values = list(ch.values)
            offset = len(values) - 1 + index
            if 0 <= offset < len(values):
                lines.append("{}  {:.4g}".format(ch.name, values[offset]))
        box_w = 240
        line_h = 23
        box_h = 16 + line_h * len(lines)
        bx = x + 14 if x + 14 + box_w < right else x - 14 - box_w
        by = top + 16
        self.create_rectangle(bx, by, bx + box_w, by + box_h, fill="#0a1016", outline=BORDER)
        for i, text in enumerate(lines):
            color = TEXT if i == 0 else channels[i - 1].color
            font = FONT_MONO_BOLD if i == 0 else FONT_MONO
            self.create_text(bx + 12, by + 14 + i * line_h, anchor="w", text=text, fill=color, font=font)

    def draw_hint(self, left, bottom):
        self.create_text(left, bottom + 16, anchor="w", text="时间 →", fill=TEXT_FAINT, font=FONT_TINY)


class SerialMonitorApp(tk.Tk):
    POLL_MS = 30
    DRAW_INTERVAL = 0.06
    MAX_LOG_LINES = 2000

    def __init__(self, opts):
        super().__init__()
        self.title("串口波形监控")
        self.geometry("1500x950")
        self.minsize(1180, 760)
        self.configure(background=BG)

        self.window = opts.window
        self.channels = []
        self.names = opts.names or DEFAULT_NAMES
        self.paused = False
        self.reader = None
        self.stop_flag = threading.Event()
        self.rx_queue = queue.Queue()
        self.serial_port = None
        self.line_count = 0
        self.byte_count = 0
        self.numeric_count = 0
        self.recent_stamps = deque(maxlen=400)
        self.demo_mode = opts.demo
        self.last_raw = ""
        self.cursor_dirty = False
        self.last_draw = 0.0
        self.log_visible = True

        self._build_fonts()
        self._build_style()
        self._build_ui()
        self.refresh_ports()
        if opts.port:
            self.port_var.set(opts.port)
        if opts.baud:
            self.baud_var.set(str(opts.baud))
        self._bind_keys()
        self.protocol("WM_DELETE_WINDOW", self.on_close)
        self.after(self.POLL_MS, self.poll)
        if opts.autostart or opts.demo:
            self.after(300, self.toggle_port)

    def _build_fonts(self):
        try:
            for name in ("TkDefaultFont", "TkTextFont", "TkMenuFont", "TkHeadingFont"):
                tkfont.nametofont(name).configure(family="Microsoft YaHei UI", size=9)
        except Exception:
            pass

    def _build_style(self):
        style = ttk.Style(self)
        try:
            style.theme_use("clam")
        except Exception:
            pass
        style.configure("TFrame", background=PANEL)
        style.configure("Bar.TFrame", background="#0e141a")
        style.configure("TLabel", background=PANEL, foreground=TEXT, font=FONT_UI)
        style.configure("Bar.TLabel", background="#0e141a", foreground=TEXT_DIM, font=FONT_UI)
        style.configure("TButton", background="#16212b", foreground=TEXT, borderwidth=0,
                        focusthickness=0, padding=(14, 8), font=FONT_UI)
        style.map("TButton",
                  background=[("active", "#1e2f3d"), ("pressed", "#243a4a")],
                  foreground=[("disabled", TEXT_FAINT)])
        style.configure("Accent.TButton", background="#14424f", foreground="#9ff0ff")
        style.map("Accent.TButton", background=[("active", "#1a5b6c")])
        style.configure("TCheckbutton", background="#0e141a", foreground=TEXT_DIM, font=FONT_UI)
        style.map("TCheckbutton", background=[("active", "#0e141a")])
        style.configure("TCombobox", fieldbackground="#101821", background="#16212b",
                        foreground=TEXT, arrowcolor=TEXT_DIM, borderwidth=0, padding=3)
        style.map("TCombobox", fieldbackground=[("readonly", "#101821")],
                  foreground=[("readonly", TEXT)])
        style.configure("TSpinbox", fieldbackground="#101821", background="#16212b",
                        foreground=TEXT, arrowcolor=TEXT_DIM, borderwidth=0, padding=3)
        self.option_add("*TCombobox*Listbox.background", "#101821")
        self.option_add("*TCombobox*Listbox.foreground", TEXT)
        self.option_add("*TCombobox*Listbox.selectBackground", "#1e5f74")

    def _build_ui(self):
        head = ttk.Frame(self, style="Bar.TFrame", padding=(16, 12, 16, 10))
        head.pack(side="top", fill="x")
        tk.Label(head, text="SERIAL SCOPE", background="#0e141a", foreground=CYAN,
                 font=FONT_TITLE).pack(side="left")
        tk.Label(head, text="串口波形监控", background="#0e141a", foreground=TEXT_DIM,
                 font=FONT_UI).pack(side="left", padx=(12, 0))
        self.led = tk.Label(head, text="● IDLE", background="#0e141a", foreground=TEXT_DIM,
                            font=FONT_MONO_BOLD)
        self.led.pack(side="left", padx=(22, 0))
        self.head_metrics = tk.Label(head, text="", background="#0e141a", foreground=TEXT_DIM,
                                     font=FONT_MONO)
        self.head_metrics.pack(side="right")
        tk.Frame(self, background="#1e5f74", height=2).pack(side="top", fill="x")

        bar = ttk.Frame(self, style="Bar.TFrame", padding=(16, 10, 16, 12))
        bar.pack(side="top", fill="x")
        ttk.Label(bar, text="端口", style="Bar.TLabel").pack(side="left")
        self.port_var = tk.StringVar()
        self.port_box = ttk.Combobox(bar, textvariable=self.port_var, width=24, state="readonly")
        self.port_box.pack(side="left", padx=(6, 4))
        ttk.Button(bar, text="刷新", command=self.refresh_ports).pack(side="left", padx=(0, 12))
        ttk.Label(bar, text="波特率", style="Bar.TLabel").pack(side="left")
        self.baud_var = tk.StringVar(value="115200")
        ttk.Combobox(bar, textvariable=self.baud_var, values=BAUD_CHOICES, width=8).pack(side="left", padx=(6, 12))
        ttk.Label(bar, text="窗口", style="Bar.TLabel").pack(side="left")
        self.window_var = tk.IntVar(value=self.window)
        spin = ttk.Spinbox(bar, from_=50, to=50000, increment=50, textvariable=self.window_var, width=6,
                           command=self.apply_window)
        spin.pack(side="left", padx=(6, 14))
        spin.bind("<Return>", lambda e: self.apply_window())

        self.toggle_btn = ttk.Button(bar, text="▶ 运行", style="Accent.TButton", command=self.toggle_port)
        self.toggle_btn.pack(side="left", padx=(0, 6))
        self.pause_btn = ttk.Button(bar, text="❚❚ 暂停", command=self.toggle_pause)
        self.pause_btn.pack(side="left", padx=(0, 6))
        ttk.Button(bar, text="清空", command=self.clear_data).pack(side="left", padx=(0, 6))
        ttk.Button(bar, text="导出CSV", command=self.save_csv).pack(side="left", padx=(0, 6))
        ttk.Button(bar, text="全通道", command=self.restore_channels).pack(side="left", padx=(0, 6))
        self.log_btn = ttk.Button(bar, text="日志", style="Accent.TButton", command=self.toggle_log)
        self.log_btn.pack(side="left")

        self.pane = ttk.PanedWindow(self, orient="vertical")
        self.pane.pack(side="top", fill="both", expand=True, padx=10, pady=(0, 8))

        self.screen_frame = tk.Frame(self.pane, background=SCREEN_BG)
        self.canvas = ScopeCanvas(self.screen_frame, self)
        self.canvas.pack(fill="both", expand=True)
        self.pane.add(self.screen_frame, weight=8)

        self.log_frame = ttk.Frame(self.pane)
        log_head = ttk.Frame(self.log_frame)
        log_head.pack(side="top", fill="x")
        tk.Label(log_head, text=" 原始输出", background=PANEL, foreground=TEXT_DIM,
                 font=FONT_UI).pack(side="left")
        self.autoscroll_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(log_head, text="自动滚动", variable=self.autoscroll_var).pack(side="right", padx=(0, 8))
        self.log_text = tk.Text(self.log_frame, height=4, background=SCREEN_BG, foreground="#7f8f9d",
                                insertbackground=TEXT, font=FONT_MONO, wrap="none",
                                highlightthickness=0, borderwidth=0, padx=10, pady=6)
        scroll = ttk.Scrollbar(self.log_frame, orient="vertical", command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=scroll.set)
        scroll.pack(side="right", fill="y")
        self.log_text.pack(side="left", fill="both", expand=True)
        self.pane.add(self.log_frame, weight=1)

        self.status = tk.Label(self, text="", background=BG, foreground=TEXT_DIM, anchor="w",
                               font=FONT_MONO, padx=14, pady=4)
        self.status.pack(side="bottom", fill="x")

        self.canvas.bind("<Configure>", lambda e: self.redraw(force=True))

    def _bind_keys(self):
        self.bind("<space>", lambda e: self.toggle_pause())
        self.bind("<Escape>", lambda e: self.toggle_port())
        self.bind("<Control-s>", lambda e: self.save_csv())
        self.bind("<Control-l>", lambda e: self.toggle_log())

    def px_per_sample(self):
        w, _h, left, right, _t, _b = self.canvas.geometry()
        return max(1e-6, (right - left) / max(1, self.window - 1))

    def line_rate(self):
        if len(self.recent_stamps) < 2:
            return 0.0
        cutoff = time.monotonic() - 2.0
        recent = [s for s in self.recent_stamps if s >= cutoff]
        if len(recent) < 2:
            return 0.0
        span = recent[-1] - recent[0]
        return (len(recent) - 1) / span if span > 0 else 0.0

    def redraw(self, force=False):
        now = time.monotonic()
        if not force and now - self.last_draw < self.DRAW_INTERVAL:
            return
        self.last_draw = now
        self.cursor_dirty = False
        self.canvas.redraw()

    def refresh_ports(self):
        if list_ports is None:
            self.port_box["values"] = []
            return
        entries = []
        for info in list_ports.comports():
            desc = info.description or ""
            hwid = info.hwid or ""
            is_bluetooth = hwid.upper().startswith("BTHENUM") or "蓝牙" in desc
            entries.append((is_bluetooth, info.device, desc))
        entries.sort(key=lambda e: (e[0], e[1]))
        ports = ["{} | {}".format(d, s) if s else d for _b, d, s in entries]
        self.port_box["values"] = ports
        if ports and not self.port_var.get():
            self.port_var.set(ports[0])

    def selected_port(self):
        raw = self.port_var.get().strip()
        return raw.split("|")[0].strip() if raw else ""

    def apply_window(self):
        try:
            value = int(self.window_var.get())
        except Exception:
            return
        self.window = max(10, value)
        for ch in self.channels:
            ch.resize(self.window)
        self.redraw(force=True)

    def restore_channels(self):
        for ch in self.channels:
            ch.hidden = False
        self.redraw(force=True)

    def toggle_log(self):
        if self.log_visible:
            self.pane.forget(self.log_frame)
            self.log_btn.configure(style="TButton")
        else:
            self.pane.add(self.log_frame, weight=1)
            self.log_btn.configure(style="Accent.TButton")
        self.log_visible = not self.log_visible

    def toggle_pause(self):
        self.paused = not self.paused
        self.pause_btn.configure(text="▶ 继续" if self.paused else "❚❚ 暂停")
        self.redraw(force=True)

    def toggle_port(self):
        if self.reader and self.reader.is_alive():
            self.close_port()
        else:
            self.open_port()

    def open_port(self):
        if self.demo_mode:
            self.stop_flag.clear()
            self.reader = threading.Thread(target=self.demo_reader, daemon=True)
            self.reader.start()
            self.toggle_btn.configure(text="■ 停止")
            self.append_log("== 演示数据模式（未占用真实串口）==")
            return
        if serial is None:
            messagebox.showerror("缺少依赖", "未安装 pyserial，请先运行：python -m pip install pyserial")
            return
        port = self.selected_port()
        if not port:
            messagebox.showwarning("未选择端口", "请先选择一个串口")
            return
        try:
            baud = int(self.baud_var.get())
        except Exception:
            messagebox.showwarning("波特率无效", "波特率必须是整数")
            return
        try:
            self.serial_port = serial.Serial(port, baud, timeout=0.2)
        except Exception as exc:
            messagebox.showerror("打开失败", "{}".format(exc))
            return
        self.stop_flag.clear()
        self.reader = threading.Thread(target=self.serial_reader, args=(self.serial_port, baud), daemon=True)
        self.reader.start()
        self.toggle_btn.configure(text="■ 停止")
        self.title("串口波形监控 — {} @ {}".format(port, baud))
        self.append_log("== 已打开 {} @ {} ==".format(port, baud))

    def close_port(self):
        self.stop_flag.set()
        if self.serial_port is not None:
            try:
                self.serial_port.close()
            except Exception:
                pass
            self.serial_port = None
        self.reader = None
        self.toggle_btn.configure(text="▶ 运行")
        self.title("串口波形监控")
        self.append_log("== 已断开 ==")
        self.redraw(force=True)

    def serial_reader(self, port, baud):
        try:
            while not self.stop_flag.is_set():
                try:
                    raw = port.readline()
                except Exception as exc:
                    self.rx_queue.put(("error", str(exc)))
                    break
                if raw:
                    self.rx_queue.put(("line", raw))
        finally:
            try:
                port.close()
            except Exception:
                pass

    def demo_reader(self):
        t = 0.0
        phase = [0.0, 0.4, 0.9, 1.7, 2.2, 0.7, 1.1, 2.8, 3.3, 0.2]
        self.rx_queue.put(("line", b"setup\r\n"))
        while not self.stop_flag.is_set():
            t += 0.2
            row = []
            for i in range(10):
                base = math.sin(t + phase[i]) * (i + 1) * 40
                noise = math.sin(t * 11.3 + i) * 6
                row.append("{:.3f}".format(base + noise))
            self.rx_queue.put(("line", (",".join(row) + "\r\n").encode()))
            time.sleep(0.2)

    def ensure_channels(self, count):
        while len(self.channels) < count:
            index = len(self.channels)
            name = self.names[index] if index < len(self.names) else None
            self.channels.append(Channel(index, self.window, name))

    def parse_line(self, text):
        stripped = text.strip()
        if not stripped:
            return
        parts = [p.strip() for p in stripped.split(",")]
        try:
            numbers = [float(p) for p in parts]
        except ValueError:
            self.append_log(stripped)
            return
        self.ensure_channels(len(numbers))
        if len(numbers) < len(self.channels):
            self.append_log(stripped)
            return
        for ch, value in zip(self.channels, numbers):
            ch.values.append(value)
        self.numeric_count += 1

    def append_log(self, text):
        self.log_text.insert("end", text + "\n")
        excess = int(self.log_text.index("end-1c").split(".")[0]) - self.MAX_LOG_LINES
        if excess > 0:
            self.log_text.delete("1.0", "{}.0".format(excess + 1))
        if self.autoscroll_var.get():
            self.log_text.see("end")

    def clear_data(self):
        self.channels = []
        self.line_count = 0
        self.numeric_count = 0
        self.byte_count = 0
        self.recent_stamps.clear()
        self.last_raw = ""
        self.log_text.delete("1.0", "end")
        self.redraw(force=True)

    def save_csv(self):
        if not self.channels or not self.channels[0].values:
            messagebox.showinfo("无数据", "当前没有可保存的数值数据")
            return
        path = filedialog.asksaveasfilename(defaultextension=".csv",
                                            filetypes=[("CSV 文件", "*.csv")],
                                            initialfile="serial_capture.csv")
        if not path:
            return
        try:
            with open(path, "w", newline="", encoding="utf-8-sig") as fh:
                writer = csv.writer(fh)
                writer.writerow([ch.name for ch in self.channels])
                columns = [list(ch.values) for ch in self.channels]
                rows = max(len(c) for c in columns)
                for i in range(rows):
                    writer.writerow([(c[i] if i < len(c) else "") for c in columns])
        except Exception as exc:
            messagebox.showerror("保存失败", "{}".format(exc))
            return
        self.append_log("== 已保存 {}".format(path))

    def poll(self):
        wrote = False
        while True:
            try:
                kind, payload = self.rx_queue.get_nowait()
            except queue.Empty:
                break
            if kind == "error":
                self.append_log("串口错误: {}".format(payload))
                self.close_port()
                break
            if kind == "line":
                self.byte_count += len(payload)
                text = payload.decode("utf-8", "replace") if isinstance(payload, bytes) else payload
                self.line_count += 1
                self.recent_stamps.append(time.monotonic())
                if text.strip():
                    self.last_raw = text.strip()
                self.parse_line(text)
                wrote = True
        if (wrote or self.cursor_dirty) and not self.paused:
            self.redraw()
        self.update_status()
        self.after(self.POLL_MS, self.poll)

    def update_status(self):
        running = bool(self.reader and self.reader.is_alive())
        if self.paused:
            state, color = "PAUSE", AMBER
        elif running:
            state, color = "RUN", GREEN
        else:
            state, color = "IDLE", TEXT_DIM
        self.led.configure(text="● {}".format(state), foreground=color)
        rate = self.line_rate()
        shown = len([c for c in self.channels if not c.hidden])
        device = "DEMO" if self.demo_mode else (self.selected_port() or "--")
        self.head_metrics.configure(
            text="{}   {} baud   {:.1f} 样本/s   通道 {}/{}   帧 {}   {} B".format(
                device, self.baud_var.get(), rate, shown, len(self.channels),
                self.line_count, self.byte_count))
        recent = self.last_raw if len(self.last_raw) <= 64 else self.last_raw[:61] + "..."
        self.status.configure(
            text="数值行 {}   通道 {}（显示 {}）   窗口 {} 点   ·   空格 暂停 · Esc 停止 · Ctrl+S 导出 · Ctrl+L 日志   ·   最近 {}".format(
                self.numeric_count, len(self.channels),
                len([c for c in self.channels if not c.hidden]), self.window, recent))

    def on_close(self):
        self.stop_flag.set()
        if self.serial_port is not None:
            try:
                self.serial_port.close()
            except Exception:
                pass
        self.destroy()


def list_serial_ports():
    if list_ports is None:
        print("未安装 pyserial：python -m pip install pyserial")
        return
    for info in list_ports.comports():
        print("{}  {}  {}".format(info.device, info.description or "", info.hwid or ""))


def main():
    parser = argparse.ArgumentParser(description="串口数据波形监控（ESP32-S3 等）")
    parser.add_argument("--port", help="串口设备，如 COM9")
    parser.add_argument("--baud", type=int, default=115200, help="波特率，默认 115200")
    parser.add_argument("--window", type=int, default=300, help="波形窗口点数，默认 300")
    parser.add_argument("--names", help="通道名，按 c0,c1,… 顺序用逗号分隔；默认按当前遥控器定义")
    parser.add_argument("--autostart", action="store_true", help="启动后自动打开串口")
    parser.add_argument("--demo", action="store_true", help="演示模式：不占用串口，生成模拟数据")
    parser.add_argument("--list", action="store_true", help="列出串口后退出")
    opts = parser.parse_args()

    if opts.list:
        list_serial_ports()
        return
    if serial is None and not opts.demo:
        print("未安装 pyserial，请先运行：python -m pip install pyserial")
        return
    opts.names = [n.strip() for n in opts.names.split(",") if n.strip()] if opts.names else list(DEFAULT_NAMES)
    app = SerialMonitorApp(opts)
    app.mainloop()


if __name__ == "__main__":
    main()
