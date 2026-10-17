# 源码工程（不是成品）

这是 Vite + React 源码。成品是上一级的 `../index.html`（单文件，可直接双击或 Live Server 打开）。

## 用法

```bash
npm install
npm run dev      # 开发预览，打开终端里的 http://localhost:5173
npm run build    # 构建，产物 dist/index.html（单文件）
```

构建后把 `dist/index.html` 复制为上一级的 `index.html` 作为交付。

## 为什么不能用 Live Server 预览本目录

`index.html` 引用的是 `/src/main.jsx`（JSX + `import React from "react"`）。Live Server 只做静态托管，
不做 JSX 编译、也不解析裸模块名，所以会出现 `:5501/src/main.jsx 404` 与白屏。
要在源码上迭代就用 `npm run dev`；只想看效果就打开 `../index.html`。
