import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Camera,
  Cpu,
  Download,
  Eye,
  FolderTree,
  Gauge,
  Layers,
  ListChecks,
  Monitor,
  Network,
  Play,
  RefreshCw,
  RotateCcw,
  Server,
  ShieldCheck,
  Target,
  Terminal,
  Timer,
  Usb,
  Zap,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Stat, Focus, Steps, Pre } from "./components.jsx";

/* 端到端链路架构：内联 SVG（离线单文件，不用 ASCII 字符画 / 线框图） */
const LinkArchitecture = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 900 312"
      role="img"
      aria-label="端到端链路：树莓派 USB 摄像头经 OpenCV 采集、JPEG 编码与 4 字节长度封装，由 TCP 服务端推流；本机 TCP 客户端收帧校验、JPEG 解码后窗口显示，两端靠直连以太网传输"
      className="h-auto w-full"
    >
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="arch-net" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
      </defs>

      <rect x="16" y="14" width="868" height="112" rx="14" fill="#eff8ff" stroke="#93cdfb" />
      <text x="32" y="36" fill="#1a5cae" fontSize="12" fontWeight="700">树莓派 zhangsk · cam_server.py（只采集与推流）</text>

      <rect x="32" y="52" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="126" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">USB UVC 摄像头</text>
      <text x="126" y="97" textAnchor="middle" fill="#475569" fontSize="10">/dev/video0 · MJPG 640×480</text>

      <rect x="252" y="52" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="346" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">OpenCV 采集</text>
      <text x="346" y="97" textAnchor="middle" fill="#475569" fontSize="10">CAP_V4L2 · 上限 25 fps</text>

      <rect x="472" y="52" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="566" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">JPEG 编码</text>
      <text x="566" y="97" textAnchor="middle" fill="#475569" fontSize="10">imencode · 质量 100</text>

      <rect x="692" y="52" width="176" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="780" y="78" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">帧封装 + TCP 服务</text>
      <text x="780" y="97" textAnchor="middle" fill="#475569" fontSize="10">4B 长度 · listen(1)</text>

      <line x1="220" y1="83" x2="248" y2="83" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="440" y1="83" x2="468" y2="83" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="660" y1="83" x2="688" y2="83" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />

      <line x1="450" y1="126" x2="450" y2="144" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#arch-net)" />
      <rect x="280" y="146" width="340" height="24" rx="8" fill="#fffbeb" stroke="#fbbf24" />
      <text x="450" y="162" textAnchor="middle" fill="#b4690e" fontSize="10.5" fontWeight="700">直连以太网 TCP · 172.26.188.116:5000 · TCP_NODELAY</text>
      <line x1="450" y1="170" x2="450" y2="188" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#arch-net)" />

      <rect x="16" y="190" width="868" height="112" rx="14" fill="#f0fdfa" stroke="#5eead4" />
      <text x="32" y="212" fill="#0f766e" fontSize="12" fontWeight="700">本机 Windows · cam_view.py（只接收与显示）</text>

      <rect x="32" y="226" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="126" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">TCP 客户端</text>
      <text x="126" y="271" textAnchor="middle" fill="#475569" fontSize="10">create_connection · 断线重连</text>

      <rect x="252" y="226" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="346" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">收帧 + 校验</text>
      <text x="346" y="271" textAnchor="middle" fill="#475569" fontSize="10">4B 长度 · ≤ 8 MiB · 10 s</text>

      <rect x="472" y="226" width="188" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="566" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">JPEG 解码</text>
      <text x="566" y="271" textAnchor="middle" fill="#475569" fontSize="10">imdecode</text>

      <rect x="692" y="226" width="176" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="780" y="252" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">窗口显示</text>
      <text x="780" y="271" textAnchor="middle" fill="#475569" fontSize="10">imshow · 叠加 FPS</text>

      <line x1="220" y1="257" x2="248" y2="257" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="440" y1="257" x2="468" y2="257" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
      <line x1="660" y1="257" x2="688" y2="257" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arch-arrow)" />
    </svg>
  </div>
);

/* 帧结构（协议）：内联 SVG —— 一帧只有两段，长度说清边界 */
const FrameLayout = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 720 234"
      role="img"
      aria-label="帧结构：每帧由 4 字节大端长度前缀与随后的变长 JPEG 载荷组成，长度 0 到 8 MiB 之间合法，客户端先读 4 字节再读满整帧"
      className="h-auto w-full"
    >
      <defs>
        <marker id="fl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      <text x="60" y="34" fill="#0f172a" fontSize="13" fontWeight="700">一帧 = [4 字节长度][JPEG 载荷]</text>

      <line x1="60" y1="62" x2="660" y2="62" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="60" y1="56" x2="60" y2="68" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="180" y1="56" x2="180" y2="68" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="660" y1="56" x2="660" y2="68" stroke="#94a3b8" strokeWidth="1.2" />
      <text x="120" y="52" textAnchor="middle" fill="#64748b" fontSize="9.5">偏移 0</text>
      <text x="420" y="52" textAnchor="middle" fill="#64748b" fontSize="9.5">偏移 4 起，变长</text>
      <text x="660" y="52" textAnchor="middle" fill="#64748b" fontSize="9.5">帧尾</text>

      <rect x="60" y="74" width="120" height="52" rx="6" fill="#fffbeb" stroke="#fbbf24" />
      <text x="120" y="99" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">4 字节长度</text>
      <text x="120" y="115" textAnchor="middle" fill="#475569" fontSize="10">大端无符号 32 位</text>

      <rect x="180" y="74" width="480" height="52" rx="6" fill="#eff8ff" stroke="#93cdfb" />
      <text x="420" y="99" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">JPEG 载荷（本帧压缩图像）</text>
      <text x="420" y="115" textAnchor="middle" fill="#475569" fontSize="10">无需解析 MJPEG / HTTP 容器</text>

      <line x1="120" y1="126" x2="120" y2="150" stroke="#b4690e" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#fl-arrow)" />
      <text x="126" y="164" fill="#b4690e" fontSize="10">读 4 字节 → 得到帧长 len</text>

      <text x="60" y="192" fill="#475569" fontSize="10.5">边界校验：0 &lt; len ≤ 8 MiB，超出即判非法、断开本次连接。</text>
      <text x="60" y="212" fill="#475569" fontSize="10.5">超时保护：读 / 写两侧各 10 s 空闲超时，防瞬时抖动拖死进程。</text>
    </svg>
  </div>
);

/* 一次连接的时序（实现）：内联 SVG —— 多角色按时间交互 */
const ConnectionSequence = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 760 330"
      role="img"
      aria-label="连接时序：本机客户端发起 TCP 连接，Pi accept 后设 TCP_NODELAY，随后循环发送 4 字节长度加 JPEG 帧，本机收帧解码显示；断流或帧非法时结束本次连接并在 2 秒后重连"
      className="h-auto w-full"
    >
      <defs>
        <marker id="sq-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="sq-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="sq-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      <rect x="60" y="14" width="200" height="40" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="160" y="32" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">Pi · cam_server.py</text>
      <text x="160" y="47" textAnchor="middle" fill="#475569" fontSize="10">服务端 · 单客户端 listen(1)</text>

      <rect x="500" y="14" width="200" height="40" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="600" y="32" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">本机 · cam_view.py</text>
      <text x="600" y="47" textAnchor="middle" fill="#475569" fontSize="10">客户端 · create_connection</text>

      <line x1="160" y1="56" x2="160" y2="316" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" />
      <line x1="600" y1="56" x2="600" y2="316" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" />

      <line x1="600" y1="92" x2="164" y2="92" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#sq-blue)" />
      <text x="380" y="84" textAnchor="middle" fill="#1a5cae" fontSize="10.5" fontWeight="700">① 发起连接（SYN）</text>

      <rect x="40" y="108" width="230" height="24" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="155" y="124" textAnchor="middle" fill="#475569" fontSize="10">accept() 阻塞等到客户端 · 设 TCP_NODELAY</text>

      <line x1="164" y1="160" x2="596" y2="160" stroke="#0d9488" strokeWidth="2" markerEnd="url(#sq-teal)" />
      <text x="380" y="152" textAnchor="middle" fill="#0f766e" fontSize="10.5" fontWeight="700">② 循环推帧：[4B 长度][JPEG 载荷]</text>

      <rect x="490" y="176" width="230" height="24" rx="6" fill="#f0fdfa" stroke="#5eead4" />
      <text x="605" y="192" textAnchor="middle" fill="#0f766e" fontSize="10">recv_exact → 校验 → imdecode → imshow</text>

      <rect x="40" y="208" width="230" height="24" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="155" y="224" textAnchor="middle" fill="#475569" fontSize="10">每 60 帧打印实测 FPS</text>

      <line x1="596" y1="252" x2="596" y2="276" stroke="#b4690e" strokeWidth="2" markerEnd="url(#sq-amber)" />
      <text x="600" y="290" fill="#b4690e" fontSize="10">③ 断流 / 长度非法 / 解码失败 → 结束本次连接</text>

      <path d="M596,300 C430,318 330,318 164,300" fill="none" stroke="#b4690e" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#sq-amber)" />
      <text x="380" y="326" textAnchor="middle" fill="#b4690e" fontSize="10" fontWeight="700">④ 2 s 后重连（回到 ①）</text>
    </svg>
  </div>
);

/* 对比决策：直连 USB 采集 vs 网络串流（内联 SVG） */
const Decision = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 250"
      role="img"
      aria-label="对比决策：摄像头能否插在跑算法的机器上——能就直连 USB 采集，不能就网络串流"
      className="h-auto w-full"
    >
      <defs>
        <marker id="dec-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a5cae" />
        </marker>
        <marker id="dec-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="200" y="8" width="280" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="340" y="30" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">摄像头能插在跑算法的机器上吗？</text>
      <text x="340" y="47" textAnchor="middle" fill="#475569" fontSize="10">这一步决定采集走 USB 还是网络</text>

      <line x1="320" y1="58" x2="152" y2="98" stroke="#1a5cae" strokeWidth="2" markerEnd="url(#dec-blue)" />
      <line x1="360" y1="58" x2="528" y2="98" stroke="#0d9488" strokeWidth="2" markerEnd="url(#dec-teal)" />

      <rect x="16" y="100" width="260" height="118" rx="10" fill="#eff8ff" stroke="#93cdfb" />
      <text x="32" y="126" fill="#0f172a" fontSize="12" fontWeight="700">能 → 直连 USB 采集</text>
      <text x="32" y="150" fill="#475569" fontSize="10">OpenCV 直接读 /dev/video0</text>
      <text x="32" y="170" fill="#475569" fontSize="10">延迟最低，不占网络带宽</text>
      <text x="32" y="194" fill="#1a5cae" fontSize="10" fontWeight="700">适合：单机低延迟闭环</text>

      <rect x="404" y="100" width="260" height="118" rx="10" fill="#f0fdfa" stroke="#5eead4" />
      <text x="420" y="126" fill="#0f172a" fontSize="12" fontWeight="700">不能 → 网络串流</text>
      <text x="420" y="150" fill="#475569" fontSize="10">摄像头固定在车上 / 远端</text>
      <text x="420" y="170" fill="#475569" fontSize="10">MJPEG / RTSP / 裸 TCP</text>
      <text x="420" y="194" fill="#0f766e" fontSize="10" fontWeight="700">适合：远程、多端、跨平台</text>

      <text x="16" y="240" fill="#94a3b8" fontSize="10">
        判定关键：跨不过那根 USB 线，就只能把画面搬上网；摄像头能插在本机就别绕网络。
      </text>
    </svg>
  </div>
);

/* 延迟三因素（落地）：内联 SVG —— 分辨率 / 编码质量 / 带宽 各自的代价 */
const LatencyFactors = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 720 262"
      role="img"
      aria-label="延迟三因素对比：分辨率提高让单帧变大、帧率下降；JPEG 质量 90 到 100 体积翻倍但肉眼提升很小；带宽远不是瓶颈，1 Gbps 远大于约 5 MB/s"
      className="h-auto w-full"
    >
      <rect x="16" y="16" width="216" height="176" rx="12" fill="#eff8ff" stroke="#93cdfb" />
      <rect x="24" y="24" width="72" height="22" rx="6" fill="#1a5cae" />
      <text x="60" y="40" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">分辨率</text>
      <text x="32" y="70" fill="#0f172a" fontSize="11.5" fontWeight="700">640×480 → 1280×960</text>
      <text x="32" y="92" fill="#475569" fontSize="10">单帧 64 KB → 约 200 KB</text>
      <text x="32" y="112" fill="#475569" fontSize="10">帧率 25 → 约 20 fps</text>
      <text x="32" y="140" fill="#b4690e" fontSize="10" fontWeight="700">代价：单帧更大</text>
      <text x="32" y="158" fill="#b4690e" fontSize="10" fontWeight="700">编码 + 传输更久</text>
      <text x="32" y="180" fill="#64748b" fontSize="10">换清晰度，付帧率与延迟</text>

      <rect x="252" y="16" width="216" height="176" rx="12" fill="#fff7ed" stroke="#fcd34d" />
      <rect x="260" y="24" width="88" height="22" rx="6" fill="#b4690e" />
      <text x="304" y="40" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">编码质量</text>
      <text x="268" y="70" fill="#0f172a" fontSize="11.5" fontWeight="700">JPEG 质量 90 → 100</text>
      <text x="268" y="92" fill="#475569" fontSize="10">体积几乎翻倍</text>
      <text x="268" y="112" fill="#475569" fontSize="10">肉眼提升很小</text>
      <text x="268" y="140" fill="#b4690e" fontSize="10" fontWeight="700">代价：白涨体积</text>
      <text x="268" y="158" fill="#b4690e" fontSize="10" fontWeight="700">高分辨率下掉帧</text>
      <text x="268" y="180" fill="#64748b" fontSize="10">别默认拉满质量</text>

      <rect x="488" y="16" width="216" height="176" rx="12" fill="#f0fdfa" stroke="#5eead4" />
      <rect x="496" y="24" width="72" height="22" rx="6" fill="#0f766e" />
      <text x="532" y="40" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">带宽</text>
      <text x="504" y="70" fill="#0f172a" fontSize="11.5" fontWeight="700">1 Gbps ≫ 约 5 MB/s</text>
      <text x="504" y="92" fill="#475569" fontSize="10">1280×960×质量100 占用</text>
      <text x="504" y="112" fill="#475569" fontSize="10">仍远低于链路容量</text>
      <text x="504" y="140" fill="#0f8a5f" fontSize="10" fontWeight="700">结论：不是瓶颈</text>
      <text x="504" y="158" fill="#0f8a5f" fontSize="10" fontWeight="700">不必先担心带宽</text>
      <text x="504" y="180" fill="#64748b" fontSize="10">先看清晰度与帧率取舍</text>

      <text x="16" y="222" fill="#475569" fontSize="10.5">三因素里，真正会卡你的是分辨率与编码质量——它们直接决定单帧体积与端到端延迟。</text>
      <text x="16" y="244" fill="#94a3b8" fontSize="10">类比水管：管径＝分辨率、水压＝带宽、漏水＝丢包；管径一缩，后面全跟着细。</text>
    </svg>
  </div>
);

/* 延迟与画质取舍：内联 SVG */
const Tradeoff = () => (
  <div className="surface p-4">
    <svg
      viewBox="0 0 680 300"
      role="img"
      aria-label="延迟与画质取舍：分辨率与画质提高会让单帧体积变大、帧率下降，640×480 质量100 约 64 KB 25–27 fps，1280×960 约 200 KB 19–24 fps"
      className="h-auto w-full"
    >
      <defs>
        <marker id="tr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b4690e" />
        </marker>
      </defs>

      <line x1="80" y1="250" x2="652" y2="250" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="80" y1="250" x2="80" y2="44" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="652" y="266" textAnchor="end" fill="#64748b" fontSize="10">单帧体积（KB）→</text>
      <text x="86" y="36" textAnchor="middle" fill="#64748b" fontSize="10">帧率（fps）↑</text>

      <line x1="74" y1="250" x2="80" y2="250" stroke="#cbd5e1" />
      <text x="68" y="253" textAnchor="end" fill="#94a3b8" fontSize="9">0</text>
      <line x1="74" y1="183" x2="652" y2="183" stroke="#eef2f7" />
      <text x="68" y="186" textAnchor="end" fill="#94a3b8" fontSize="9">10</text>
      <line x1="74" y1="117" x2="652" y2="117" stroke="#eef2f7" />
      <text x="68" y="120" textAnchor="end" fill="#94a3b8" fontSize="9">20</text>
      <line x1="74" y1="50" x2="652" y2="50" stroke="#eef2f7" />
      <text x="68" y="53" textAnchor="end" fill="#94a3b8" fontSize="9">30</text>

      <text x="80" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">0</text>
      <text x="220" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">60</text>
      <text x="360" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">120</text>
      <text x="500" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">180</text>
      <text x="640" y="266" textAnchor="middle" fill="#94a3b8" fontSize="9">240</text>

      <line x1="229" y1="78" x2="229" y2="250" stroke="#93cdfb" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="547" y1="110" x2="547" y2="250" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="4 4" />

      <line x1="237" y1="74" x2="539" y2="106" stroke="#b4690e" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#tr-arrow)" />
      <text x="388" y="76" textAnchor="middle" fill="#b4690e" fontSize="10" fontWeight="700">分辨率 / 画质提高</text>

      <circle cx="229" cy="78" r="5" fill="#1a5cae" />
      <text x="229" y="52" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">640×480</text>
      <text x="229" y="65" textAnchor="middle" fill="#475569" fontSize="10">64 KB · 26 fps</text>

      <circle cx="547" cy="110" r="5" fill="#0d9488" />
      <text x="547" y="84" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">1280×960</text>
      <text x="547" y="97" textAnchor="middle" fill="#475569" fontSize="10">约 200 KB · 21 fps</text>

      <text x="80" y="290" fill="#94a3b8" fontSize="10">
        带宽不是瓶颈（≈5 MB/s ≪ 1 Gbps）：真正的取舍是清晰度换帧率，以及单帧变大带来的端到端延迟。
      </text>
    </svg>
  </div>
);

/* ============================================================
   守则第七节 · 点式动画（全册 ≤3 处）
   纯前端实现：React state + setTimeout + CSS transition，无任何外链资源。
   默认全亮（静态兜底：停帧 / 无 JS / 打印时完整可读）；播放时逐点 idle → active → done。
   颜色编码全册统一：蓝＝设备 / 摄像头，橙＝网络 / 参数，绿＝验证通过。
   ============================================================ */
function useSequence(count, initial = "on", { step = 950, hold = 850 } = {}) {
  const [statuses, setStatuses] = useState(() => Array(count).fill(initial));
  const timers = useRef([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);
  const reset = useCallback(() => {
    clearTimers();
    setStatuses(Array(count).fill(initial));
  }, [clearTimers, count, initial]);
  const play = useCallback(() => {
    clearTimers();
    setStatuses(Array(count).fill("idle"));
    for (let i = 0; i < count; i += 1) {
      timers.current.push(
        setTimeout(() => {
          setStatuses((prev) => {
            const next = [...prev];
            if (i > 0) next[i - 1] = "done";
            next[i] = "active";
            return next;
          });
        }, i * step)
      );
    }
    timers.current.push(
      setTimeout(() => setStatuses(Array(count).fill("done")), count * step + hold)
    );
  }, [clearTimers, count, step, hold]);
  const jump = useCallback(
    (idx) => {
      clearTimers();
      setStatuses(
        Array.from({ length: count }, (_, j) => (j < idx ? "done" : j === idx ? "active" : "idle"))
      );
    },
    [clearTimers, count]
  );
  return { statuses, play, reset, jump };
}

/* 颜色编码：同一含义固定同一颜色（全册一致） */
const SEQ_TONE = {
  device: {
    on: "border-brand-400 bg-brand-50 text-brand-700",
    active: "border-brand-600 bg-brand-600 text-white",
  },
  cmd: {
    on: "border-amber-400 bg-amber-50 text-warn2",
    active: "border-warn2 bg-warn2 text-white",
  },
  good: {
    on: "border-good bg-emerald-50 text-good",
    active: "border-good bg-good text-white",
  },
};
const IDLE_TONE = "border-line bg-paper text-muted";
const DONE_TONE = "border-good bg-good text-white";
const PING_BG = { device: "bg-brand-400/50", cmd: "bg-amber-400/50", good: "bg-emerald-400/50" };
const SEG_TONE = { device: "bg-brand-500", cmd: "bg-warn2", good: "bg-good" };
const segClass = (side, st) =>
  st === "done" ? "bg-good" : st === "idle" ? "bg-line" : SEG_TONE[side] || "bg-warn2";
const nodeTone = (side, st) =>
  st === "done" ? DONE_TONE : st === "idle" ? IDLE_TONE : (SEQ_TONE[side] || SEQ_TONE.cmd)[st];

const PlayBtn = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-[0.82rem] font-semibold text-white transition hover:bg-brand-700"
  >
    <Play size={13} />
    {children}
  </button>
);

const ResetBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-300 bg-paper px-3.5 py-1.5 text-[0.82rem] font-semibold text-brand-700 transition hover:bg-brand-50"
  >
    <RotateCcw size={13} />
    重置
  </button>
);

/* 颜色编码图例（记忆锚之一，在多张图示里重复出现） */
const ColorLegend = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.78rem] text-muted">
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-brand-600" />
      蓝＝设备 / 摄像头
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-warn2" />
      橙＝网络 / 参数
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded bg-good" />
      绿＝验证通过
    </span>
  </div>
);

/* ---- 点式动画 ① 端到端视频链路（横向）：摄像头 → 采集 → 编码 → 传输 → 显示 ---- */
function PointFlow({ steps, legend = true, hint }) {
  const { statuses, play, reset, jump } = useSequence(steps.length);
  return (
    <div className="surface p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {steps.map((s, i) => {
          const st = statuses[i];
          return (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => jump(i)}
                title={`跳到第 ${i + 1} 步`}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors duration-500 md:flex-col md:gap-2 md:py-3.5 md:text-center ${nodeTone(
                  s.side,
                  st
                )}`}
              >
                <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-current text-[0.9rem] font-bold md:h-10 md:w-10">
                  {st === "active" && (
                    <span className={`absolute inset-0 animate-ping rounded-full ${PING_BG[s.side] || "bg-brand-400/50"}`} />
                  )}
                  <span className="relative">{s.no}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-bold leading-tight md:text-[0.95rem]">{s.title}</span>
                  <span className="block text-[0.76rem] leading-tight opacity-80 md:text-[0.8rem]">{s.sub}</span>
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  className={`ml-[1.15rem] h-3 w-0.5 flex-none self-start rounded-full transition-colors duration-500 md:ml-1 md:mr-1 md:h-0.5 md:w-6 md:self-center ${segClass(
                    s.side,
                    st
                  )}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PlayBtn onClick={play}>播放点式动画</PlayBtn>
        <ResetBtn onClick={reset} />
        <span className="text-[0.78rem] text-muted">
          {hint || "点节点可手动跳到该步；默认全亮＝静态兜底（关动画 / 打印照样完整）。"}
        </span>
      </div>
      {legend && (
        <div className="mt-2.5 border-t border-line pt-2.5">
          <ColorLegend />
        </div>
      )}
    </div>
  );
}

/* ---- 点式动画 ② / ③ 纵向点式分步 ---- */
function PointSteps({ steps, hint }) {
  const { statuses, play, reset, jump } = useSequence(steps.length, "on", { step: 1050, hold: 900 });
  return (
    <div className="surface p-4 md:p-5">
      <div className="space-y-2.5">
        {steps.map((s, i) => {
          const st = statuses[i];
          const badge =
            st === "done"
              ? "bg-good text-white"
              : st === "active"
              ? "bg-warn2 text-white"
              : st === "idle"
              ? "bg-slate-200 text-muted"
              : s.side === "device"
              ? "bg-brand-600 text-white"
              : s.side === "good"
              ? "bg-good text-white"
              : "bg-warn2 text-white";
          return (
            <button
              key={i}
              type="button"
              onClick={() => jump(i)}
              className={`flex w-full items-start gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-colors duration-500 ${
                st === "done"
                  ? "border-good bg-emerald-50"
                  : st === "active"
                  ? "border-warn2 bg-amber-50"
                  : "border-line bg-paper"
              }`}
            >
              <span className={`relative mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full text-[0.8rem] font-bold transition-colors duration-500 ${badge}`}>
                {st === "active" && <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/50" />}
                <span className="relative">{i + 1}</span>
              </span>
              <span className="min-w-0">
                <span className="block text-[0.92rem] font-bold text-ink">{s.t}</span>
                <span className="block text-[0.82rem] leading-relaxed text-muted">{s.s}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlayBtn onClick={play}>逐步推进</PlayBtn>
        <ResetBtn onClick={reset} />
        {hint && <span className="text-[0.78rem] text-muted">{hint}</span>}
      </div>
    </div>
  );
}

/* ---- 记忆锚三卡（口诀 / 生活化类比 / 颜色编码），并在图示里重复出现 ---- */
const AnchorCards = () => (
  <div className="grid gap-3 md:grid-cols-3">
    <div className="surface border-t-4 border-t-brand-500 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-brand-700">口 诀</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">清不清看带宽，卡不卡看链路</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        先带宽、后链路依次排查：画面糊先查分辨率与带宽占用，画面卡先查链路延迟、超时与丢帧。
      </p>
    </div>
    <div className="surface border-t-4 border-t-warn2 p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-warn2">生活化类比</div>
      <p className="text-[1rem] font-extrabold leading-snug text-ink">视频流＝水管</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        管径＝分辨率（管越粗、水越多）、水压＝带宽（压力足才流得动）、漏水＝丢包（漏一处后面全虚）。链路任一段变细，整套就跟着变细。
      </p>
    </div>
    <div className="surface border-t-4 border-t-good p-4 md:p-5">
      <div className="mb-2 text-[0.72rem] font-extrabold tracking-[0.14em] text-good">颜色编码</div>
      <div className="space-y-1.5 text-[0.9rem] font-semibold text-ink">
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-brand-600" />
          蓝＝设备 / 摄像头
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-warn2" />
          橙＝网络 / 参数
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-good" />
          绿＝验证通过
        </p>
      </div>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
        全册一致：看颜色就知道这一步在动硬件、走网络 / 参数，还是验证通过。
      </p>
    </div>
  </div>
);

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      教学demo · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      摄像头远程显示
      <br />
      <span className="text-brand-600">采集 · 传输 · 显示解耦</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      树莓派采集 USB 摄像头，经裸 TCP 把 JPEG 帧推到本机窗口显示；任一侧异常都不会拖垮另一侧。
    </p>
    <p className="mt-4 text-[0.86rem] text-muted md:text-[0.92rem]">
      每页默认只留要点；点「展开：…」可看完整命令与全量参数。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame
    kicker="概览"
    floor="01"
    title="采集、传输、显示三层解耦，任一侧异常都不拖垮另一侧"
    lead="树莓派（Raspberry Pi，下文简称 Pi）只负责采集与推流，本机只负责接收与显示，中间用裸 TCP（Transmission Control Protocol）自描述帧协议；换摄像头、换显示端、换机器都互不影响。"
  >
    <Grid cols={2}>
      <Card title="Pi 只采集" icon={Camera}>
        取帧 → JPEG（Joint Photographic Experts Group，压缩图像格式）→ 推流，不需要图形界面、不依赖外网。
      </Card>
      <Card title="裸 TCP 传输" icon={Network}>
        4 字节长度前缀切分帧边界，直连以太网 1 Gbps 下延迟低。
      </Card>
      <Card title="本机只显示" icon={Monitor}>
        收帧 → imdecode → imshow，跨平台可替换，显示端不碰摄像头。
      </Card>
      <Card title="不要三层耦合" icon={AlertTriangle} tone="warn">
        不要把采集与显示塞进同一个进程：显示端一旦卡住，采集也会被一起拖死。
      </Card>
    </Grid>
  </Frame>
);

/* 概览 · 端到端视频链路（点式动画 ①） */
const VIDEO_CHAIN = [
  { no: "1", side: "device", title: "摄像头采集", sub: "USB UVC · /dev/video0 · MJPG" },
  { no: "2", side: "cmd", title: "帧编码", sub: "cv2.imencode → JPEG" },
  { no: "3", side: "cmd", title: "帧封装", sub: "4 字节长度 + JPEG 载荷" },
  { no: "4", side: "cmd", title: "网络传输", sub: "直连以太网 TCP · :5000" },
  { no: "5", side: "good", title: "解码显示", sub: "imdecode → imshow（叠加 FPS）" },
];

const VideoChain = () => (
  <Frame
    kicker="概览"
    floor="02"
    title="端到端视频链路：摄像头 → 采集 → 编码 → 传输 → 显示"
    lead="画面从摄像头走到屏幕上，是五步一条链；点式动画替学生把流程「走一遍」——灯走到哪，流程就记到哪。"
    wide
  >
    <div className="space-y-4">
      <PointFlow steps={VIDEO_CHAIN} />
      <Quote>
        口诀：<strong>清不清看带宽，卡不卡看链路</strong>——先看画面糊不糊，再看链路卡不卡。
      </Quote>
    </div>
  </Frame>
);

const Architecture = () => (
  <Frame
    kicker="链路"
    floor="03"
    title="端到端链路：相机 → 采集 → 编码 → 传输 → 解码 → 显示"
    lead="每一环只做一件事；任一环出问题都能单独定位、单独替换，不必推翻整条链路。"
    wide
  >
    <div className="space-y-4">
      <LinkArchitecture />
      <Quote>边界落在「帧」上：4 字节长度说清一帧到哪里结束，客户端不必解析任何容器。</Quote>
    </div>
  </Frame>
);

/* 链路 · 数据流四步（点式动画 ②） */
const DATA_FLOW = [
  { side: "device", t: "① 采集", s: "cv2.VideoCapture(0, CAP_V4L2)，FOURCC=MJPG，默认 640×480。" },
  { side: "cmd", t: "② 编码", s: "cv2.imencode 压成 JPEG，质量默认 100。" },
  { side: "cmd", t: "③ 封装", s: "4 字节大端长度 + JPEG 载荷，sendall 推送。" },
  { side: "good", t: "④ 显示", s: "recv_exact → imdecode → imshow，叠加实时 FPS。" },
];

const DataFlow = () => (
  <Frame
    kicker="链路"
    floor="04"
    title="数据流四步：取帧、编码、封装、显示"
    lead="每一步只看一件事；点「逐步推进」，当前步脉冲高亮、已完成转绿。"
  >
    <div className="space-y-4">
      <PointSteps steps={DATA_FLOW} hint="点任一步可手动跳到该步。" />
      <Quote>TCP_NODELAY 关闭 Nagle 算法，避免小帧被延迟合并——这是低延迟的关键一步。</Quote>
    </div>
  </Frame>
);

const DecisionBlock = () => (
  <Frame
    kicker="链路"
    floor="05"
    title="摄像头不在本机就必须网络串流，能插本机就别绕网络"
    lead="摄像头插在跑算法的机器上，就用 OpenCV 直接读；摄像头固定在车上 / 远端，才值得引入网络串流——MJPEG（Motion JPEG）、RTSP（Real-Time Streaming Protocol）生态成熟，本 deck 的裸 TCP 最薄、延迟最可控。"
    wide
  >
    <div className="space-y-4">
      <Decision />
      <Grid cols={2}>
        <Card title="方案 A · 直连 USB 采集" icon={Usb}>
          摄像头插在跑算法的同一台机器，OpenCV 直接读 <code>/dev/video0</code>，链路最短。
        </Card>
        <Card title="方案 B · 网络串流" icon={Network} tone="good">
          摄像头在远端，画面经以太网 / Wi-Fi 送到本机；可多端接入、跨系统。
        </Card>
      </Grid>
      <DataTable
        head={["维度", "方案 A：直连 USB 采集", "方案 B：网络串流（MJPEG / RTSP / 裸 TCP）"]}
        rows={[
          ["布线 / 距离", "摄像头必须插在跑算法的机器上，线长受限", "摄像头在哪都行，经网络跨机、可远程"],
          ["端到端延迟", "最低：没有编码 + 网络 + 解码环节", "多出编码、传输与解码，通常增加数十 ms"],
          ["跨平台 / 多端", "单机独占，画面只有本机能看", "跨系统、可多端接入，天然适合远程"],
          ["带宽占用", "只走 USB 总线，不占网络", "占用网络带宽（640×480 约 2 MB/s）"],
          ["实现复杂度", "最低：OpenCV 直接读设备", "要自己定帧协议，或引入 MJPEG / RTSP 服务"],
          ["适用场景", "单机低延迟闭环、摄像头可插本机", "摄像头固定在车上 / 远端、要远程观看"],
        ]}
      />
      <Quote>
        辩证一问：「什么情况下直连 USB 反而更好？」——摄像头能插在跑算法的同一台机器、又要极致低延迟时，直连 USB 最省事；只有摄像头必须离开本机（车载、远端、多端观看）时，才值得付出网络串流的编码与传输代价。
      </Quote>
    </div>
  </Frame>
);

const Protocol = () => (
  <Frame
    kicker="协议"
    floor="06"
    title="帧协议只有两段：4 字节长度 + JPEG 载荷"
    lead="自描述、自校验：长度说清边界，两端各自设上限与超时，坏帧就地断开而不是硬撑。"
    wide
  >
    <div className="space-y-4">
      <FrameLayout />
      <Grid cols={2}>
        <Card title="长度前缀" icon={Layers}>
          4 字节大端无符号整数，说明本帧 JPEG 的字节数。
        </Card>
        <Card title="载荷" icon={Layers}>
          紧随其后的 JPEG 数据，客户端无需解析 MJPEG / HTTP 容器。
        </Card>
        <Card title="边界校验" icon={ShieldCheck}>
          0 &lt; 长度 ≤ 8 MiB，超出即判非法并断开。
        </Card>
        <Card title="超时保护" icon={Timer}>
          读 / 写两侧各 10 s 空闲超时，防瞬时抖动拖死进程。
        </Card>
      </Grid>
      <Steps title="展开：帧协议完整定义">
        <Pre>{`帧 = [4 字节长度][JPEG 载荷]

长度：大端无符号 32 位，单位字节
边界校验：0 < 长度 ≤ 8 MiB，否则判非法并断开
超时：读 / 写两侧各 10 s 空闲超时
连接：单客户端 listen(1)，TCP_NODELAY 关闭 Nagle

收帧伪码：
  len = recv_exact(4)
  if not (0 < len <= 8 * 1024 * 1024): abort
  jpeg = recv_exact(len)
  img = cv2.imdecode(jpeg, IMREAD_COLOR)`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const PiSide = () => (
  <Frame kicker="实现" floor="07" title="树莓派端：连接即推流，单客户端独占换帧率" wide>
    <Focus
      no="Pi"
      title="采集与推流"
      tag="cam_server.py"
      goal="打开摄像头后进入 accept 主循环，单个客户端独占以获得最高帧率。"
      points={[
        "CAP_V4L2 + FOURCC=MJPG，指定分辨率与帧率。",
        "socket + SO_REUSEADDR → bind → listen(1) 单客户端。",
        "每客户端设置 TCP_NODELAY，关闭 Nagle。",
        "每 60 帧打印实测 FPS；读帧失败重试，连续 ≥ 20 次判为摄像头丢失。",
        "客户端掉线后回到 accept；摄像头丢失则 release 后重新打开。",
      ]}
      aside={
        <Card title="可配参数" icon={Terminal}>
          --device / --width / --height / --fps / --quality / --port / --bind
        </Card>
      }
    />
    <div className="mt-4">
      <Steps title="展开：cam_server.py 全部参数与默认值">
        <Pre>{`python3 cam_server.py \\
  --device 0 \\                  # 摄像头设备（/dev/video0）
  --width 640 --height 480 \\    # 分辨率（最高 1280×960）
  --fps 30 \\                    # 目标帧率（硬件封顶 25）
  --quality 100 \\               # JPEG 质量 0–100
  --port 5000 \\                 # 监听端口
  --bind 172.26.188.116         # 监听地址（默认新 Pi eth0）

# 依赖（Pi 端）
sudo apt-get install -y python3-opencv

# --bind 默认绑定 eth0 地址：避免 wlan0 接入热点时把未鉴权的画面暴露给同网段设备`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const PcSide = () => (
  <Frame kicker="实现" floor="08" title="本机端：断线自动重连，--check 可无人值守验证" wide>
    <Focus
      no="PC"
      title="接收与显示"
      tag="cam_view.py"
      goal="连接失败自动重连；--check 模式用于无人值守验证。"
      points={[
        "create_connection 连接，失败则 2 s 后重试；--check 下失败直接退出。",
        "recv_exact 先读 4 字节长度，校验后读满整帧数据。",
        "cv2.imdecode → imshow，窗口叠加实时 FPS，q / Esc 退出。",
        "断流 / 长度非法 / 解码失败 → 结束本次连接并自动重连。",
      ]}
      aside={
        <Card title="验证方式" icon={Eye}>
          python cam_view.py --check --frames 60
          <br />
          只统计首帧尺寸与平均 FPS，不弹窗。
        </Card>
      }
    />
    <div className="mt-4">
      <Steps title="展开：cam_view.py 全部参数与退出码">
        <Pre>{`python cam_view.py \\
  --host 172.26.188.116 \\      # 服务端地址
  --port 5000 \\                # 服务端端口
  --frames 0 \\                 # 收够 N 帧后退出，0 = 一直显示
  --check                      # 无窗口模式（无人值守验证）

# 依赖（本机）
pip install opencv-python numpy

# 退出码：0 = 正常退出 / --check 校验通过，非 0 = 连接或校验失败
# 显示窗口按 q 或 Esc 退出`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* 实现 · 连接时序（时序图）：本机 ↔ Pi 一次连接的往返 */
const SequencePage = () => (
  <Frame
    kicker="实现"
    floor="09"
    title="连接时序：连上就推帧，断了就重连"
    lead="客户端发起、服务端接受，之后服务端不停地推帧、本机不停地收帧显示；断流或帧非法时结束本次连接，2 s 后自动重连——两侧都不需要人工干预。"
    wide
  >
    <div className="space-y-4">
      <ConnectionSequence />
      <Quote>单客户端 listen(1)：一次只服务一个连接，换来最高帧率；客户端断开后回到 accept 等下一个。</Quote>
    </div>
  </Frame>
);

const DesignPoints = () => (
  <Frame kicker="实现" floor="10" title="关键设计点只为两件事：不卡、能自恢复" wide>
    <DataTable
      head={["设计点", "目的"]}
      rows={[
        ["采集 / 传输 / 显示分层", "摄像头驱动与图形界面不必同机，Pi 无需 GUI、无需外网"],
        ["4 字节大端长度前缀", "在字节流上切分帧边界，无需容器解析"],
        ["MJPG 采集 + JPEG 二次压缩", "降低 USB 与以太网带宽占用"],
        ["单客户端 listen(1)", "帧率优先，不引入多路复用"],
        ["TCP_NODELAY", "关闭 Nagle，压低端到端延迟"],
        ["双向超时 / 长度上限 / 重试", "防不可信输入与瞬时抖动拖死进程"],
        ["断线重连 + 摄像头自动重开", "单侧重启后无需人工干预"],
      ]}
    />
  </Frame>
);

const Run = () => (
  <Frame kicker="落地" floor="11" title="两条命令跑通：Pi 起服务，本机起窗口">
    <Grid cols={2}>
      <Card title="Pi 端启动" icon={Terminal}>
        python3 cam_server.py（默认监听 172.26.188.116:5000）
      </Card>
      <Card title="本机端显示" icon={Monitor}>
        python cam_view.py（默认连 172.26.188.116:5000）
      </Card>
      <Card title="无窗口验证" icon={Eye}>
        python cam_view.py --check --frames 60
      </Card>
      <Card title="要最高采集" icon={Gauge}>
        --width 1280 --height 960 --quality 100 --fps 25
      </Card>
    </Grid>
    <div className="mt-6">
      <Quote>依赖：Pi 端 python3-opencv；本机 opencv-python + numpy。</Quote>
    </div>
    <div className="mt-4">
      <Steps title="展开：从上传到跑通（完整步骤）">
        <Pre>{`# 1) 上传并启动服务（脚本在 教学demo/摄像头远程显示/）
python tools/pi.py --put cam_server.py /home/nanzhida/cam_server.py
python tools/pi.py --sudo "apt-get install -y python3-opencv"
python tools/pi.py "nohup python3 cam_server.py --bind 172.26.188.116 > /tmp/cam_server.log 2>&1 &"
python tools/pi.py "ss -ltn | grep 5000"        # 确认监听
python tools/pi.py "tail -n 20 /tmp/cam_server.log"

# 2) 本机装依赖并显示
pip install opencv-python numpy
python "教学demo/摄像头远程显示/cam_view.py" --host 172.26.188.116

# 3) 无窗口验证（脚本化 / 无人值守）
python "教学demo/摄像头远程显示/cam_view.py" --check --frames 60

# 4) 要最高采集
python3 cam_server.py --width 1280 --height 960 --quality 100 --fps 25

# 仓库内默认参数（docs/摄像头参数.md）
#   cam_server.py：--device 0 / 640×480 / --fps 30（硬件封顶 25）
#                  --quality 100 / --port 5000 / --bind 172.26.188.116
#   cam_view.py：  --host 172.26.188.116 / --port 5000 / --frames 0 / --check 关

# 注意：Pi 重启后 /home/nanzhida/cam_server.py 与后台进程都会丢，需重新上传并启动`}</Pre>
      </Steps>
    </div>
  </Frame>
);

const Perf = () => (
  <Frame kicker="落地" floor="12" title="640×480 跑到 25–27 fps，带宽从来不是瓶颈">
    <Grid cols={3}>
      <Stat value="640×480" label="质量 100 · 约 64 KB/帧 · 25–27 fps" />
      <Stat value="1280×960" label="质量 100 · 约 193–215 KB/帧 · 19–24 fps" tone="warn" />
      <Stat value="25" unit="fps" label="硬件帧率上限（所有分辨率）" tone="good" />
    </Grid>
    <div className="mt-7">
      <Quote>1280×960 × 质量 100 ≈ 5 MB/s，远低于 1 Gbps——要担心的不是带宽，而是清晰度与帧率的取舍。</Quote>
    </div>
  </Frame>
);

/* 落地 · 延迟三因素（对比图） */
const LatencyPage = () => (
  <Frame
    kicker="落地"
    floor="13"
    title="延迟三因素：分辨率、编码质量、带宽各自的代价"
    lead="决定画面与延迟的其实是三个旋钮。分辨率与编码质量一调高，单帧立刻变大、端到端延迟跟着涨；而带宽根本不是瓶颈。"
    wide
  >
    <div className="space-y-4">
      <LatencyFactors />
      <Quote>口诀：<strong>清不清看带宽，卡不卡看链路</strong>——先分「画质」还是「流畅」，再顺着三因素找代价。</Quote>
    </div>
  </Frame>
);

const TradeoffPage = () => (
  <Frame
    kicker="落地"
    floor="14"
    title="清晰度、帧率与延迟此消彼长，按用途选一档"
    lead="分辨率或画质提高，单帧体积随之变大，编码、传输与解码都更久——换来清晰度，付掉的是帧率与端到端延迟。"
    wide
  >
    <div className="space-y-4">
      <Tradeoff />
      <Quote>看画面够用就停 640×480；要抓细节再上 1280×960，别默认拉满质量。</Quote>
      <Steps title="展开：能力上限与取舍（实测）">
        <Pre>{`分辨率上限 1280×960（MJPG）；YUYV 最高只有 640×480
帧率上限   25 fps（所有分辨率，硬件固定档位 25/5）
JPEG 质量  上限 100；90→100 肉眼提升很小、体积翻倍，1280×960 下掉帧（约 25→20）
带宽       不是瓶颈：1280×960×质量100 ≈ 5 MB/s，远低于 1 Gbps
延迟       分辨率 / 画质越高，单帧越大、编码与传输越久，端到端延迟越高
定焦镜头   近距离小字发虚无法软件解决，需拉开到对焦距离或换自动对焦摄像头`}</Pre>
      </Steps>
    </div>
  </Frame>
);

/* 排障 · 连不上 / 看不清排查顺序（点式动画 ③） */
const TROUBLE_ORDER = [
  { side: "device", t: "① 看链路", s: "先 ping 172.26.188.116——不通就先查网线 / 网卡（详见《树莓派连接与部署》）。" },
  { side: "cmd", t: "② 看服务", s: "Pi 上 ss -ltn | grep 5000；没在监听就重启 cam_server.py 并看 /tmp/cam_server.log。" },
  { side: "cmd", t: "③ 看连接", s: "本机 cam_view.py --check --frames 60；连不上多为地址 / 端口 / 防火墙问题。" },
  { side: "cmd", t: "④ 看不清", s: "有画面但糊 → 对焦距离 / 补光；画面卡 → 降分辨率或质量，别默认拉满。" },
  { side: "good", t: "⑤ 验证通过", s: "--check 平均 FPS 与实测一致（640×480 约 25–27），窗口实时不卡。" },
];

const TroubleOrder = () => (
  <Frame
    kicker="排障"
    floor="15"
    title="连不上 / 看不清：先带宽、后链路依次排查"
    lead="出了画面问题别乱试，按顺序走一条链：先确认链路通、服务在、连得上，再处理「看不清」——口诀清不清看带宽、卡不卡看链路。"
  >
    <div className="space-y-4">
      <PointSteps steps={TROUBLE_ORDER} hint="点任一步可手动跳到该步。" />
      <div className="border-t border-line pt-3">
        <ColorLegend />
      </div>
      <Quote>排查也要「先通后清」：链路不通时，调分辨率 / 质量都是白费；确认通了再谈画质。</Quote>
    </div>
  </Frame>
);

/* 收尾 · 记忆锚（口诀 / 生活化类比 / 颜色编码） */
const MemoryAnchor = () => (
  <Frame
    kicker="收尾"
    floor="16"
    title="把「死记」换成「钩子」：口诀 / 类比 / 颜色编码"
    lead="同一知识点用三种锚重复出现——考场上先想起钩子，再顺出知识：清不清看带宽、卡不卡看链路。"
  >
    <div className="space-y-4">
      <AnchorCards />
      <Quote>颜色编码在全册重复出现：蓝＝设备 / 摄像头、橙＝网络 / 参数、绿＝验证通过。</Quote>
    </div>
  </Frame>
);

const Downloads = () => (
  <Frame kicker="收尾" floor="17" title="脚本与文字版全文，随 deck 下载" wide>
    <Grid cols={2}>
      <Card title="随 deck 分发的脚本" icon={Download}>
        <p>
          <a className="font-semibold text-brand-700 underline" href="./files/摄像头远程显示.zip">
            摄像头远程显示.zip
          </a>
        </p>
        <p className="mt-2 text-muted">cam_server.py + cam_view.py + README。</p>
      </Card>
      <Card title="工作区内的位置" icon={FolderTree}>
        <ul className="mt-1 list-disc space-y-1.5 pl-5">
          <li>脚本：<code>教学demo/摄像头远程显示/</code></li>
          <li>文字版：<code>docs/设计原理流程图.md</code></li>
          <li>摄像头参数：<code>docs/摄像头参数.md</code>、<code>docs/摄像头选型.md</code></li>
        </ul>
      </Card>
      <Card title="相关讲义" icon={BookOpen}>
        相邻主题：<code>摄像头参数与选型</code>（硬件能力）、<code>树莓派连接与部署</code>（上传与启动）。
      </Card>
      <Card title="下载地址约定" icon={Target}>
        离线首选 <code>./files/…</code>（随 deck 分发）；在线地址以 <code>origin/main</code> 已推送为准，未推送的链接是 404。
      </Card>
    </Grid>
  </Frame>
);

const Action = () => (
  <Frame kicker="收尾" floor="18" title="照这份清单做：先跑通链路，再按用途调分辨率" wide>
    <div className="space-y-5">
      <Quote>采集在 Pi、传输用裸 TCP、显示在本机；分层让系统更稳、更好替换。</Quote>
      <Grid cols={3}>
        <Card title="易替换" icon={RefreshCw}>
          摄像头或显示端可单独更换，不牵动另一端。
        </Card>
        <Card title="可自恢复" icon={ShieldCheck} tone="good">
          断线自动重连、摄像头自动重开，无需人工干预。
        </Card>
        <Card title="好验证" icon={Eye}>
          --check 无窗口即可验证整条链路。
        </Card>
      </Grid>
      <Steps title="展开：上机与验收清单">
        <Pre>{`# 1) 先跑通（默认 640×480，最快见效）
python tools/pi.py --put cam_server.py /home/nanzhida/cam_server.py
python tools/pi.py "nohup python3 cam_server.py --bind 172.26.188.116 > /tmp/cam_server.log 2>&1 &"
python "教学demo/摄像头远程显示/cam_view.py" --check --frames 60

# 2) 看窗口确认画质与实时性，再决定要不要上高分辨率
python "教学demo/摄像头远程显示/cam_view.py" --host 172.26.188.116

# 3) 要抓细节再拉高（会掉帧，属正常）
python3 cam_server.py --width 1280 --height 960 --quality 100 --fps 25

# 4) 验收点：本机 --check 无报错、窗口 FPS 与实测一致
#    细节调参见 docs/摄像头参数.md；链路原理见 docs/设计原理流程图.md
#    不要默认拉满质量：90→100 肉眼提升很小，却可能掉帧`}</Pre>
      </Steps>
      <Card title="下载与延伸" icon={Download}>
        下载：
        <a className="font-semibold text-brand-700 underline" href="./files/摄像头远程显示.zip">
          摄像头远程显示.zip
        </a>
        ；文字版见 <code>docs/设计原理流程图.md</code>、<code>docs/摄像头参数.md</code>。
      </Card>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "视频链路", group: "概览", el: <VideoChain /> },
  { nav: "端到端链路", group: "链路", el: <Architecture /> },
  { nav: "数据流四步", group: "链路", el: <DataFlow /> },
  { nav: "对比决策", group: "链路", el: <DecisionBlock /> },
  { nav: "帧协议", group: "协议", el: <Protocol /> },
  { nav: "树莓派端", group: "实现", el: <PiSide /> },
  { nav: "本机端", group: "实现", el: <PcSide /> },
  { nav: "连接时序", group: "实现", el: <SequencePage /> },
  { nav: "关键设计点", group: "实现", el: <DesignPoints /> },
  { nav: "运行方式", group: "落地", el: <Run /> },
  { nav: "实测性能", group: "落地", el: <Perf /> },
  { nav: "延迟三因素", group: "落地", el: <LatencyPage /> },
  { nav: "延迟与画质", group: "落地", el: <TradeoffPage /> },
  { nav: "排查顺序", group: "排障", el: <TroubleOrder /> },
  { nav: "记忆锚", group: "收尾", el: <MemoryAnchor /> },
  { nav: "下载与延伸", group: "收尾", el: <Downloads /> },
  { nav: "行动清单", group: "收尾", el: <Action /> },
];

export default slides;
