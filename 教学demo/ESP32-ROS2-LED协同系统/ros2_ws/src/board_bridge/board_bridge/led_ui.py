"""Browser control panel for the boards' LEDs.

Serves a small web page on ``port`` (default 8080) and publishes the commands
it receives to ``/board/<board>/tx``, which ``wifi_server`` forwards to the
board. Board replies (``/board/<board>/rx``) are shown in the page log.

Commands understood by the firmware (see ``common/board_common.py``):
    LED <R> <G> <B> <PERIOD_MS>   set colour and blink period
    COLOR <R> <G> <B>             set colour only
    PERIOD <MS>                   set blink period only
    PATTERN solid|blink           steady on vs. toggle
    RESET                         back to the default blink

Open the page from Windows at http://localhost:8080 .
"""

import json
import threading
import time
from collections import deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

BOARDS = ("green", "blue", "xrs")
OFFLINE_AFTER_S = 10

PAGE = """<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ESP32 板卡控制台</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; font-family: system-ui, "Segoe UI", sans-serif;
         background: #0f172a; color: #e2e8f0; }
  header { padding: 18px 24px; border-bottom: 1px solid #1e293b; }
  h1 { margin: 0; font-size: 20px; }
  header small { color: #94a3b8; }
  main { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
         gap: 16px; padding: 16px; max-width: 1400px; margin: 0 auto; }
  @media (max-width: 720px) { main { grid-template-columns: 1fr; } }
  .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px;
          padding: 16px; }
  .card h2 { margin: 0 0 12px; font-size: 16px; display: flex;
             align-items: center; gap: 8px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .green .dot { background: #22c55e; }
  .blue .dot { background: #3b82f6; }
  .xrs .dot { background: #eab308; }
  .status { margin-left: auto; font-size: 12px; font-weight: 400; }
  .status.online { color: #4ade80; }
  .status.offline { color: #f87171; }
  label { display: block; font-size: 13px; color: #94a3b8; margin: 10px 0 4px; }
  input[type=color] { width: 100%; height: 42px; border: none; background: none;
                      padding: 0; cursor: pointer; }
  input[type=range] { width: 100%; }
  select, input[type=number] { width: 100%; padding: 8px; border-radius: 8px;
      border: 1px solid #475569; background: #0f172a; color: #e2e8f0; }
  .row { display: flex; gap: 10px; align-items: center; }
  .buttons { display: flex; gap: 10px; margin-top: 14px; }
  button { flex: 1; padding: 10px; border: none; border-radius: 8px;
           font-size: 14px; cursor: pointer; }
  .save { background: #16a34a; color: #fff; }
  .play { background: #7c3aed; color: #fff; }
  .stop-play { background: #64748b; color: #fff; }
  .mix { background: #ea580c; color: #fff; }
  .stop-mix { background: #64748b; color: #fff; }
  .pick { flex: none; margin: 0; cursor: pointer; }
  .badge { font-size: 11px; background: #7c3aed; color: #fff;
           border-radius: 6px; padding: 1px 6px; }
  .badge.mix { background: #ea580c; }
  button:active { transform: translateY(1px); }
  input[type=text] { width: 100%; padding: 8px; border-radius: 8px;
      border: 1px solid #475569; background: #0f172a; color: #e2e8f0; }
  .styles { display: flex; flex-direction: column; gap: 6px; margin: 4px 0 12px; }
  .style-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px;
       border: 1px solid #334155; border-radius: 8px; font-size: 13px; }
  .style-item.active { border-color: #38bdf8; background: #0b2b3d; }
  .swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid #64748b; }
  .style-name { font-weight: 600; }
  .style-meta { color: #94a3b8; }
  .style-actions { margin-left: auto; display: flex; gap: 6px; }
  .mini { padding: 4px 8px; font-size: 12px; border-radius: 6px; flex: none;
          background: #334155; color: #e2e8f0; }
  .mini.del { background: #7f1d1d; }
  .refresh { background: #0e7490; color: #fff; }
  .default { background: #475569; color: #fff; }
  .log { grid-column: 1 / -1; }
  .log pre { margin: 0; height: 160px; overflow: auto; background: #0b1220;
             border: 1px solid #334155; border-radius: 8px; padding: 10px;
             font-size: 12px; line-height: 1.5; white-space: pre-wrap; }
  .hint { color: #64748b; font-size: 12px; }
</style>
</head>
<body>
<header>
  <h1>ESP32 板卡控制台</h1>
  <small>通过 ROS 2 向 <code>/board/green/tx</code>、<code>/board/blue/tx</code>、<code>/board/xrs/tx</code> 发送指令</small>
</header>
<main>
  <section class="card green" data-board="green">
    <h2><span class="dot"></span> GREEN 板 <span class="status offline">离线</span></h2>
    <label>已有样式</label>
    <div class="styles"><span class="hint">加载中...</span></div>
    <label>样式名称（1-16 位字母/数字/_/-）</label>
    <input type="text" class="name" placeholder="例如 party">
    <label>颜色</label><input type="color" class="color" value="#00ff00">
    <label>闪烁周期 (ms)</label>
    <div class="row"><input type="range" class="period" min="50" max="2000" step="10" value="500">
      <input type="number" class="periodNum" min="50" max="5000" step="10" value="500" style="width:90px"></div>
    <label>规律</label>
    <select class="pattern"><option value="blink">闪烁 blink</option><option value="solid">常亮 solid</option></select>
    <div class="buttons">
      <button class="save">保存样式</button>
      <button class="default">恢复默认</button>
      <button class="refresh">刷新</button>
    </div>
    <div class="buttons">
      <button class="play">轮播所选</button>
      <button class="stop-play">停止轮播</button>
      <button class="mix">混合所选</button>
      <button class="stop-mix">停止混合</button>
    </div>
    <p class="hint">勾选多条样式：轮播=依次播放，混合=同时叠加（20ms 合成）；保存不改变当前闪烁。</p>
  </section>

  <section class="card blue" data-board="blue">
    <h2><span class="dot"></span> BLUE 板 <span class="status offline">离线</span></h2>
    <label>已有样式</label>
    <div class="styles"><span class="hint">加载中...</span></div>
    <label>样式名称（1-16 位字母/数字/_/-）</label>
    <input type="text" class="name" placeholder="例如 party">
    <label>颜色</label><input type="color" class="color" value="#0000ff">
    <label>闪烁周期 (ms)</label>
    <div class="row"><input type="range" class="period" min="50" max="2000" step="10" value="500">
      <input type="number" class="periodNum" min="50" max="5000" step="10" value="500" style="width:90px"></div>
    <label>规律</label>
    <select class="pattern"><option value="blink">闪烁 blink</option><option value="solid">常亮 solid</option></select>
    <div class="buttons">
      <button class="save">保存样式</button>
      <button class="default">恢复默认</button>
      <button class="refresh">刷新</button>
    </div>
    <div class="buttons">
      <button class="play">轮播所选</button>
      <button class="stop-play">停止轮播</button>
      <button class="mix">混合所选</button>
      <button class="stop-mix">停止混合</button>
    </div>
    <p class="hint">勾选多条样式：轮播=依次播放，混合=同时叠加（20ms 合成）；保存不改变当前闪烁。</p>
  </section>

  <section class="card xrs" data-board="xrs">
    <h2><span class="dot"></span> XRS 掌机 <span class="status offline">离线</span></h2>
    <label>已有样式</label>
    <div class="styles"><span class="hint">加载中...</span></div>
    <label>样式名称（1-16 位字母/数字/_/-）</label>
    <input type="text" class="name" placeholder="例如 party">
    <label>颜色</label><input type="color" class="color" value="#ffaa00">
    <label>闪烁周期 (ms)</label>
    <div class="row"><input type="range" class="period" min="50" max="2000" step="10" value="500">
      <input type="number" class="periodNum" min="50" max="5000" step="10" value="500" style="width:90px"></div>
    <label>规律</label>
    <select class="pattern"><option value="blink">闪烁 blink</option><option value="solid">常亮 solid</option></select>
    <div class="buttons">
      <button class="save">保存样式</button>
      <button class="default">恢复默认</button>
      <button class="refresh">刷新</button>
    </div>
    <div class="buttons">
      <button class="play">轮播所选</button>
      <button class="stop-play">停止轮播</button>
      <button class="mix">混合所选</button>
      <button class="stop-mix">停止混合</button>
    </div>
    <label>掌机按键（等效实体键）</label>
    <div class="buttons">
      <button class="mini key" data-key="UP">上</button>
      <button class="mini key" data-key="DOWN">下</button>
      <button class="mini key" data-key="LEFT">左</button>
      <button class="mini key" data-key="RIGHT">右</button>
      <button class="mini key" data-key="A">A</button>
      <button class="mini key" data-key="B">B</button>
    </div>
    <p class="hint">掌机无板载 LED，样式/轮播/混合显示在屏幕上（虚拟 LED）。按键：左/右=切换样式，上/下=加减周期，A=闪烁/常亮，B=恢复默认；实体键与此等效。</p>
  </section>

  <section class="card log">
    <h2>板端回传</h2>
    <pre id="log">等待消息...</pre>
    <p class="hint">DATA / FROM 心跳与 [RX] 回显来自 <code>/board/&lt;board&gt;/rx</code></p>
  </section>
</main>
<script>
function send(board, cmd) {
  return fetch("/api/send?board=" + board + "&cmd=" + encodeURIComponent(cmd))
    .then(r => r.json()).catch(() => ({}));
}
const BOARDS = ["green", "blue", "xrs"];
const lastStyles = { green: null, blue: null, xrs: null };
const prevOnline = { green: null, blue: null, xrs: null };
const picked = { green: new Set(), blue: new Set(), xrs: new Set() };
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function refreshStyles(board) { send(board, "STYLE LIST"); }
function parseBlock(lines) {
  let end = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith("STYLE-END")) { end = i; break; }
  }
  if (end < 0) return null;
  let start = 0;
  for (let i = end - 1; i >= 0; i--) {
    if (lines[i].startsWith("STYLE-END")) { start = i + 1; break; }
  }
  const seen = new Map();
  let playing = [];
  let mixing = [];
  for (let i = start; i < end; i++) {
    const line = lines[i];
    if (line.startsWith("PLAYING")) {
      playing = line.split(" ").slice(1).filter(n => n && n !== "-");
      continue;
    }
    if (line.startsWith("MIXING")) {
      mixing = line.split(" ").slice(1).filter(n => n && n !== "-");
      continue;
    }
    const p = line.split(" ");
    if (p.length < 8 || p[0] !== "STYLE") continue;
    seen.set(p[1], { name: p[1], r: +p[2], g: +p[3], b: +p[4],
                     period: +p[5], pattern: p[6], active: p[7] === "1" });
  }
  const styles = Array.from(seen.values());
  styles.sort((a, b) => (a.name === "default" ? -1 : b.name === "default" ? 1 : 0));
  return { styles: styles, playing: playing, mixing: mixing };
}
function renderStyles(board, block) {
  const box = document.querySelector('section[data-board="' + board + '"] .styles');
  if (!box) return;
  const styles = block && block.styles;
  if (!styles || !styles.length) {
    box.innerHTML = '<span class="hint">无样式数据（板子可能离线，点击刷新）</span>';
    return;
  }
  const playing = new Set(block.playing || []);
  const mixing = new Set(block.mixing || []);
  const sel = picked[board];
  box.innerHTML = styles.map(s => {
    const isDefault = s.name === "default";
    const del = isDefault ? "" :
      '<button class="mini del" data-act="del" data-name="' + esc(s.name) + '">删除</button>';
    const checked = (sel.has(s.name) || playing.has(s.name) || mixing.has(s.name)) ? " checked" : "";
    let badge = "";
    if (playing.has(s.name)) badge += ' <span class="badge">轮播</span>';
    if (mixing.has(s.name)) badge += ' <span class="badge mix">混合</span>';
    return '<div class="style-item ' + (s.active ? "active" : "") + '" data-name="' + esc(s.name) + '">' +
      '<input type="checkbox" class="pick" value="' + esc(s.name) + '"' + checked + '>' +
      '<span class="swatch" style="background:rgb(' + s.r + ',' + s.g + ',' + s.b + ')"></span>' +
      '<span class="style-name">' + esc(isDefault ? "默认" : s.name) + badge + '</span>' +
      '<span class="style-meta">' + s.period + 'ms · ' + esc(s.pattern) + '</span>' +
      '<span class="style-actions">' +
      '<button class="mini" data-act="use" data-name="' + esc(s.name) + '">应用</button>' + del +
      '</span></div>';
  }).join("");
}

document.querySelectorAll("section.card[data-board]").forEach(card => {
  const board = card.dataset.board;
  const name = card.querySelector(".name");
  const color = card.querySelector(".color");
  const range = card.querySelector(".period");
  const num = card.querySelector(".periodNum");
  const pattern = card.querySelector(".pattern");
  range.addEventListener("input", () => num.value = range.value);
  num.addEventListener("input", () => range.value = num.value);

  function styleName() {
    const n = (name.value || "").trim();
    if (!/^[A-Za-z0-9_-]{1,16}$/.test(n)) {
      alert("样式名称需为 1-16 位字母、数字、_ 或 -");
      return null;
    }
    return n;
  }
  function setCmd(n) {
    const hex = color.value;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return "STYLE SET " + n + " " + r + " " + g + " " + b + " " + num.value + " " + pattern.value;
  }
  card.querySelector(".save").addEventListener("click", () => {
    const n = styleName(); if (!n) return;
    send(board, setCmd(n)).then(res => {
      if (res && res.online === false) console.warn(board.toUpperCase() + " 离线，命令可能被丢弃");
      setTimeout(() => refreshStyles(board), 400);
    });
  });
  card.querySelector(".default").addEventListener("click", () => {
    send(board, "RESET");
    setTimeout(() => refreshStyles(board), 400);
  });
  card.querySelector(".refresh").addEventListener("click", () => refreshStyles(board));
  function pickedNames() {
    return Array.from(card.querySelectorAll(".styles .style-item"))
      .map(el => el.dataset.name)
      .filter(n => n && picked[board].has(n));
  }
  card.querySelector(".play").addEventListener("click", () => {
    const names = pickedNames();
    if (names.length < 2) { alert("请勾选至少两种样式再轮播"); return; }
    send(board, "PLAY " + names.join(" ")).then(() => setTimeout(() => refreshStyles(board), 400));
  });
  card.querySelector(".stop-play").addEventListener("click", () => {
    send(board, "PLAY STOP").then(() => setTimeout(() => refreshStyles(board), 400));
  });
  card.querySelector(".mix").addEventListener("click", () => {
    const names = pickedNames();
    if (names.length < 2) { alert("请勾选至少两种样式再混合"); return; }
    send(board, "MIX " + names.join(" ")).then(() => setTimeout(() => refreshStyles(board), 400));
  });
  card.querySelector(".stop-mix").addEventListener("click", () => {
    send(board, "MIX STOP").then(() => setTimeout(() => refreshStyles(board), 400));
  });
  card.querySelectorAll(".key").forEach(btn => {
    btn.addEventListener("click", () => send(board, "KEY " + btn.dataset.key));
  });
  card.querySelector(".styles").addEventListener("change", ev => {
    const cb = ev.target;
    if (!cb.classList.contains("pick")) return;
    if (cb.checked) picked[board].add(cb.value); else picked[board].delete(cb.value);
  });
  card.querySelector(".styles").addEventListener("click", ev => {
    const btn = ev.target.closest("button[data-act]");
    if (!btn) return;
    const styleName = btn.dataset.name;
    if (btn.dataset.act === "use") send(board, "STYLE USE " + styleName);
    else if (btn.dataset.act === "del") {
      if (!confirm("删除样式 " + styleName + " ?")) return;
      send(board, "STYLE DEL " + styleName);
    }
    setTimeout(() => refreshStyles(board), 400);
  });
});
function poll() {
  fetch("/api/log").then(r => r.json()).then(data => {
    const lines = [];
    for (const b of BOARDS) {
      const raw = data[b] || [];
      for (const m of raw) lines.push("[" + b.toUpperCase() + "] " + m);
      const badge = document.querySelector('section[data-board="' + b + '"] .status');
      const online = !!(data.online && data.online[b]);
      if (badge) {
        badge.textContent = online ? "在线" : "离线";
        badge.className = "status " + (online ? "online" : "offline");
      }
      const block = parseBlock(raw);
      const key = JSON.stringify(block);
      if (key !== lastStyles[b]) { lastStyles[b] = key; renderStyles(b, block); }
      if (online && prevOnline[b] === false) refreshStyles(b);
      prevOnline[b] = online;
    }
    const el = document.getElementById("log");
    el.textContent = lines.length ? lines.join("\\n") : "等待消息...";
    el.scrollTop = el.scrollHeight;
  }).catch(() => {});
}
setInterval(poll, 1000); poll();
BOARDS.forEach(refreshStyles);
</script>
</body>
</html>
"""


class LedUi(Node):
    def __init__(self):
        super().__init__("led_ui")
        self.declare_parameter("port", 8080)
        self.declare_parameter("host", "127.0.0.1")
        self.port = self.get_parameter("port").value
        self.host = self.get_parameter("host").value

        self.lock = threading.Lock()
        self.publishers_by_board = {}
        self.log = {board: deque(maxlen=100) for board in BOARDS}
        self.last_rx = {board: 0.0 for board in BOARDS}
        for board in BOARDS:
            self.publishers_by_board[board] = self.create_publisher(
                String, "/board/%s/tx" % board, 10
            )
            self.create_subscription(
                String, "/board/%s/rx" % board, self.make_rx_callback(board), 10
            )

    def make_rx_callback(self, board):
        def callback(msg):
            with self.lock:
                self.log[board].append(msg.data)
                self.last_rx[board] = time.monotonic()
        return callback

    def is_online(self, board):
        with self.lock:
            return time.monotonic() - self.last_rx.get(board, 0.0) < OFFLINE_AFTER_S

    def online_snapshot(self):
        return {board: self.is_online(board) for board in BOARDS}

    def publish(self, board, cmd):
        publisher = self.publishers_by_board.get(board)
        if publisher is None:
            return False
        with self.lock:
            publisher.publish(String(data=cmd))
        self.get_logger().info("-> %s: %s" % (board, cmd))
        return True

    def log_snapshot(self):
        now = time.monotonic()
        with self.lock:
            snapshot = {board: list(self.log[board]) for board in BOARDS}
            snapshot["online"] = {
                board: now - self.last_rx[board] < OFFLINE_AFTER_S
                for board in BOARDS
            }
        return snapshot


def make_handler(node):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def _send(self, code, body, content_type):
            self.send_response(code)
            self.send_header("Content-Type", content_type)
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            parsed = urlparse(self.path)
            if parsed.path in ("/", "/index.html"):
                self._send(200, PAGE.encode(), "text/html; charset=utf-8")
            elif parsed.path == "/api/send":
                params = parse_qs(parsed.query)
                board = params.get("board", [""])[0].lower()
                cmd = params.get("cmd", [""])[0].strip()
                if board not in BOARDS or not cmd:
                    self._send(400, b'{"ok":false}', "application/json")
                    return
                ok = node.publish(board, cmd)
                body = {"ok": ok, "online": node.is_online(board)}
                self._send(200, json.dumps(body).encode(), "application/json")
            elif parsed.path == "/api/log":
                body = json.dumps(node.log_snapshot()).encode()
                self._send(200, body, "application/json")
            else:
                self._send(404, b"not found", "text/plain")

    return Handler


def main(args=None):
    rclpy.init(args=args)
    node = LedUi()
    server = ThreadingHTTPServer((node.host, node.port), make_handler(node))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    node.get_logger().info("LED control panel on http://%s:%d" % (node.host, node.port))
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        node.destroy_node()
        rclpy.shutdown()
