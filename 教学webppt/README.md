# 教学webppt

线下教学用的教程演示（web 幻灯片）。**添加/归档新内容后自动**用 `web-slide-deck` 技能生成或更新对应主题并构建（`npm run build` 后覆盖成品），放本目录，不再逐次询问用户。

编写规范见 [`编写守则.md`](./编写守则.md)：**组织**（deck 怎么分与放）、**语言**（每页怎么说）、**顺序**（全局主题顺序与单 deck 页序）。新建/改 deck 前先过一遍。

## 目录

```
教学webppt/
├── index.html           # 目录首页（链到各主题成品）
├── 编写守则.md           # 组织 / 语言 / 顺序规范
├── <主题>/
│   ├── index.html       # 交付：单文件幻灯片（双击即可打开）
│   └── presentation/    # 源码（Vite + React + Tailwind）
└── README.md
```

## 约定

- 一个主题一个子目录：`教学webppt/<主题>/`，主题与对应提交 / 目录同名。
- 组织 / 语言 / 顺序按 [`编写守则.md`](./编写守则.md)：全局主题顺序为「工程与协作 → 环境与设备 → 感知 → 通信 → 执行」，单 deck 页序收尾恒在最后；新增主题插到规定位置并同步本文件与目录首页。
- 交付物是 `index.html`（单文件，CSS/JS 全部内联），可直接双击或拷给别人。
- `node_modules/` 与 `presentation/dist/` 已在根 `.gitignore` 忽略，仓库只保留源码与单文件 HTML。
- 统一导航：每个主题成品顶栏都有固定的「← 目录」链接（`presentation/src/App.jsx` 顶栏的 `<a href="../index.html">`），回到本目录首页。
- 改了 `App.jsx` / 组件后必须 `npm run build` 并覆盖成品 `index.html`，否则成品与源码不一致。

## 构建

```bash
cd 教学webppt/<主题>/presentation
npm install
npm run dev      # 本地预览
npm run build    # 产物 dist/index.html
```

构建后把 `presentation/dist/index.html` 复制为同主题目录下的 `index.html`。

## 如何打开（重要）

- **看成品**：直接打开 `教学webppt/<主题>/index.html`（单文件、离线可播；`←` `→` 翻页、`O` 总览、`F` 全屏）。
  该文件与 `教学webppt/index.html`（目录首页）都是自包含 HTML，无任何外部依赖。
- **不要**把 `presentation/index.html` 当成品打开——那是 Vite 开发壳（引用 `/src/main.jsx`），只在 `npm run dev` 下有效。
- **VS Code Live Server**：右键**成品** `教学webppt/<主题>/index.html` → Open with Live Server，可用。
  源码壳 `presentation/index.html` 已内置跳转：在 Live Server / 双击打开时会自动跳到成品 `../index.html`（不再白屏）；
  `npm run dev` 下不跳转，正常开发。要在源码上迭代：`cd presentation && npm run dev`。
- **不要**对**文件夹**路径用「在浏览器打开」：相对路径会被当成网址（会出现 `http://xn--webppt-.../` 这类 punycode 报错）。要打开具体的 `.html` 文件。
- 若插件只认 URL，可在本目录起静态服务后走 ASCII 主机名：
  `python -m http.server 8080` → 打开 `http://127.0.0.1:8080/index.html`。

## 已有主题

按「工程与协作 → 环境与设备 → 感知 → 通信 → 执行」排序（见 [`编写守则.md`](./编写守则.md)）：

- `项目结构整理/` —— 总纲：分类目录、工程规范与协作约定
- `树莓派连接与部署/` —— 环境：直连网线、tools/pi.py 用法与排障
- `摄像头参数与选型/` —— 感知器件：UVC 协议、硬件参数与型号建议
- `摄像头远程显示/` —— 感知应用：采集 / 传输 / 显示解耦（教学 demo 讲解）
- `ROS2与micro-ROS选型/` —— 通信：选型结论、树莓派 Docker 安装 ROS 2 Jazzy、WSL2 跨机 ping-pong 验证
- `ESP32-S3电机驱动板/` —— 执行：奇果派 S3 机器人控制板，硬件与接线、Arduino/Mixly 开发、遥控与物联网、micro-ROS 对接
- `ESP32-S3接入micro-ROS/` —— 执行：S3 写 micro-ROS 固件、Pi 上跑 Agent，UDP4 通路与验证
