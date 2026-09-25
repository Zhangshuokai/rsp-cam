# 教学webppt

线下教学用的教程演示（web 幻灯片）。**每次提交后**，若用户确认生成对应教程，就用 `web-slide-deck` 技能产出，放本目录。

## 目录

```
教学webppt/
├── <主题>/
│   ├── index.html       # 交付：单文件幻灯片（双击即可打开）
│   └── presentation/    # 源码（Vite + React + Tailwind）
└── README.md
```

## 约定

- 一个主题一个子目录：`教学webppt/<主题>/`，主题与对应提交 / 目录同名。
- 交付物是 `index.html`（单文件，CSS/JS 全部内联），可直接双击或拷给别人。
- `node_modules/` 与 `presentation/dist/` 已在根 `.gitignore` 忽略，仓库只保留源码与单文件 HTML。

## 构建

```bash
cd 教学webppt/<主题>/presentation
npm install
npm run dev      # 本地预览
npm run build    # 产物 dist/index.html
```

构建后把 `presentation/dist/index.html` 复制为同主题目录下的 `index.html`。

## 已有主题

- `项目结构整理/` —— 分类目录、工程规范与协作约定
- `摄像头远程显示/` —— 采集 / 传输 / 显示解耦（教学 demo 讲解）
- `摄像头参数与选型/` —— UVC 协议、硬件参数与型号建议
