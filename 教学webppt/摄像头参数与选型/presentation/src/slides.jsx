import React from "react";
import {
  Camera,
  Usb,
  Gauge,
  Focus,
  Zap,
  ShieldCheck,
  Layers,
  Cpu,
  Eye,
  Compass,
  Route,
  Lightbulb,
  Wrench,
} from "lucide-react";
import { Frame, Card, DataTable, Grid, Quote, Stat } from "./components.jsx";

const Cover = () => (
  <div className="mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center">
    <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-300 bg-paper px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] text-brand-700 md:mb-6 md:px-4 md:py-1.5 md:text-[0.82rem]">
      文档讲解 · 2026-09-25
    </span>
    <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] md:text-[3.5rem]">
      摄像头参数与选型
      <br />
      <span className="text-brand-600">从 UVC 协议到具体型号</span>
    </h1>
    <p className="mt-5 max-w-4xl border-l-4 border-brand-500 pl-4 text-[1rem] leading-relaxed text-slateink md:mt-8 md:pl-5 md:text-[1.15rem]">
      先把当前摄像头的真实能力查清，再判断「换 UVC 摄像头」到底有没有必要。
    </p>
  </div>
);

const Conclusion = () => (
  <Frame kicker="概览" floor="01" title="结论先行">
    <Grid cols={2}>
      <Card title="当前就是 UVC" icon={ShieldCheck}>
        uvcvideo 驱动；dmesg 输出 Found UVC 1.00 device HD camera (349c:2317)，
        挂在 USB 2.0 总线上。
      </Card>
      <Card title="UVC 是协议标准" icon={Layers}>
        不是画质档次；所有普通 USB 摄像头都走 UVC，换协议本身没有提升。
      </Card>
    </Grid>
    <div className="mt-7">
      <Quote>
        真正决定画质与帧率的是：传感器、镜头（对焦）、快门类型、接口带宽。
      </Quote>
    </div>
  </Frame>
);

const Device = () => (
  <Frame kicker="现状" floor="02" title="当前摄像头" wide>
    <DataTable
      head={["项", "值"]}
      rows={[
        ["名称", "HD camera（Generic）"],
        ["USB ID", "349c:2317"],
        ["协议", "UVC 1.00（uvcvideo 驱动）"],
        ["总线", "USB 2.0（480 Mbps）"],
        ["分辨率上限", "1280×960 MJPG；YUYV 仅 640×480"],
        ["帧率上限", "25 fps"],
        ["对焦", "定焦（无 focus_* 控件）"],
        ["快门", "卷帘（普通 webcam）"],
      ]}
    />
  </Frame>
);

const Formats = () => (
  <Frame kicker="现状" floor="03" title="支持的分辨率与帧率" wide>
    <DataTable
      head={["格式", "分辨率", "帧率档位"]}
      rows={[
        [
          "MJPG",
          "1280×960 / 1280×720 / 1280×640 / 1280×480 / 1024×576 / 640×480 / 640×360 / 320×480 / 320×240",
          "25 / 5",
        ],
        ["YUYV", "640×480 / 352×288 / 320×240 / 176×144", "25 / 5"],
      ]}
    />
  </Frame>
);

const Controls = () => (
  <Frame kicker="现状" floor="04" title="可调控件（V4L2）" wide>
    <DataTable
      head={["控件", "范围", "默认"]}
      rows={[
        ["brightness 亮度", "0–255", "138"],
        ["contrast 对比度", "0–255", "128"],
        ["saturation 饱和度", "0–255", "80"],
        ["hue 色调", "0–255", "128"],
        ["gamma 伽马", "0–255", "0"],
        ["gain 增益", "0–255", "136"],
        ["sharpness 锐度", "0–63", "63（已最大）"],
        ["backlight_compensation 背光补偿", "0–255", "136"],
        ["white_balance_automatic 自动白平衡", "0/1", "1"],
        ["power_line_frequency 抗闪烁", "0–2", "0（Disabled）"],
      ]}
    />
  </Frame>
);

const Protocols = () => (
  <Frame kicker="选型" floor="05" title="协议对比" wide>
    <DataTable
      head={["协议", "走线", "Pi 上的访问方式", "取舍"]}
      rows={[
        ["UVC", "USB", "/dev/video0 + OpenCV CAP_V4L2", "免驱、通用；受 USB 带宽限制"],
        ["CSI + libcamera", "排线", "picamera2（非 /dev/video0）", "低延迟、硬件 ISP；OpenCV 需转换"],
        ["GMSL / 工业", "同轴", "专用驱动 + 采集卡", "长线抗干扰；成本高，场景过剩"],
      ]}
    />
  </Frame>
);

const Dimensions = () => (
  <Frame kicker="选型" floor="06" title="选型六维度">
    <Grid cols={3}>
      <Card title="分辨率 / 像素尺寸" icon={Camera}>
        不只看多少 MP，也看单像素大小（决定低照度）。
      </Card>
      <Card title="对焦方式" icon={Focus}>
        定焦 / 手动（M12·C·CS 可换镜头）/ 自动对焦。
      </Card>
      <Card title="快门类型" icon={Zap}>
        卷帘有果冻效应；高速运动必须全局快门。
      </Card>
      <Card title="帧率 / 延迟" icon={Gauge}>
        看画面 25fps 够用；闭环抓取要低延迟。
      </Card>
      <Card title="视场角 / 景深" icon={Compass}>
        读码分拣常用 70–110°；C/CS 口可配镜头。
      </Card>
      <Card title="接口带宽" icon={Usb}>
        USB2 只能 MJPG；USB3 可跑未压缩 YUY2。
      </Card>
    </Grid>
  </Frame>
);

const Models = () => (
  <Frame kicker="选型" floor="07" title="型号参考（Arducam USB UVC）" wide>
    <DataTable
      head={["方向", "型号 / 传感器", "备注"]}
      rows={[
        ["全局快门", "IMX296 B0499 · AR0234 B0495 · OV9281 B0332 · OV9782 B0385", "防运动拖影，工业常用"],
        ["自动对焦", "5MP B0441 · IMX179 B0447 · IMX219 B0292 · IMX298 B0290", "近距 / 变距拍摄"],
        ["低照度", "IMX462 B0496 · IMX291 B0200 · IMX708 B0305", "弱光环境"],
        ["高分辨率", "IMX477 B0459 · IMX519 B0471 · IMX708 B0474", "可换镜头 / 电动对焦"],
        ["官方 CSI", "Camera Module 3（IMX708 12MP AF）· GS Camera（IMX296）", "非 UVC，用 picamera2"],
      ]}
    />
  </Frame>
);

const Scenarios = () => (
  <Frame kicker="选型" floor="08" title="按赛项场景的建议">
    <Grid cols={2}>
      <Card title="智能分拣 / 读码" icon={Lightbulb}>
        工作距离固定 → 定焦即可，优先分辨率与景深，并做好补光。
      </Card>
      <Card title="智能搬运 / 移动" icon={Route}>
        有相对运动 → 优先全局快门，避免拖影。
      </Card>
      <Card title="智能救援 / 弱光" icon={Zap}>
        优先大像素低照度传感器（IMX462 / IMX291 / IMX708）。
      </Card>
      <Card title="低延迟闭环" icon={Gauge}>
        USB3 UVC（YUY2 无压缩）或官方 CSI + picamera2。
      </Card>
    </Grid>
  </Frame>
);

const Closing = () => (
  <Frame kicker="收尾" floor="09" title="建议清单">
    <div className="space-y-5">
      <Quote>别为「协议」换摄像头：先用固定工作距离 + 补光榨干现有这颗。</Quote>
      <Grid cols={3}>
        <Card title="现有榨干" icon={Wrench}>
          锁死距离、加光源，解决大部分“看不清”。
        </Card>
        <Card title="要防拖影" icon={Zap}>
          换全局快门 UVC（IMX296 / OV9281 / AR0234）。
        </Card>
        <Card title="要拍清小字" icon={Eye}>
          换可对焦 / 可换镜头的高分辨率型号（IMX477 / IMX519 / IMX708）。
        </Card>
      </Grid>
    </div>
  </Frame>
);

export const slides = [
  { nav: "封面", group: "概览", el: <Cover /> },
  { nav: "结论先行", group: "概览", el: <Conclusion /> },
  { nav: "当前摄像头", group: "现状", el: <Device /> },
  { nav: "分辨率与帧率", group: "现状", el: <Formats /> },
  { nav: "可调控件", group: "现状", el: <Controls /> },
  { nav: "协议对比", group: "选型", el: <Protocols /> },
  { nav: "六维度", group: "选型", el: <Dimensions /> },
  { nav: "型号参考", group: "选型", el: <Models /> },
  { nav: "场景建议", group: "选型", el: <Scenarios /> },
  { nav: "建议清单", group: "收尾", el: <Closing /> },
];
