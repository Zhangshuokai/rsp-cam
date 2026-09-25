# rsp — 智能+工程创新赛道工作区

树莓派（Raspberry Pi 5）视觉/工程竞赛的**训练与开发工作区**：文档、教学演示、算法、模型、训练与工程工具分目录管理。

## 目录结构

```
rsp/
├── AGENTS.md          # 协作/环境备忘（树莓派连接与操作）
├── README.md          # 本文件：项目总览与目录约定
├── docs/              # 技术文档：设计原理、硬件参数、选型
├── 培训/              # 培训资料与赛项规则解读
├── 教学demo/          # 可直接运行的教学演示（每个 demo 一个子目录）
├── 算法/              # 视觉 / 控制算法实现
├── 模型/              # 模型权重与产物
├── 训练/              # 模型训练脚本、配置与数据说明
├── 数据/              # 数据集（raw / interim / processed / external）
└── tools/             # 工程工具（树莓派连接脚本）
```

分类约定与通用工程标准的对应（参考 Cookiecutter Data Science）：

| 本仓库 | 通用对应 | 说明 |
| --- | --- | --- |
| `docs/` | docs / references | 设计、硬件、选型等参考文档 |
| `培训/` | tutorials | 培训讲义、赛项解读 |
| `教学demo/` | examples / demos | 最小可运行示例 |
| `算法/` | src（算法部分） | 识别/定位/控制算法 |
| `模型/` | models | 权重与序列化产物 |
| `训练/` | modeling（train.py） | 训练脚本与配置 |
| `数据/` | data | 数据集，内容不入库 |
| `tools/` | scripts | 工程脚本 |

## 快速开始

```powershell
# 1) 连接树莓派（参数与备忘见 AGENTS.md）
python tools/pi.py "hostname"

# 2) 摄像头远程显示 demo：Pi 端启动服务，本机显示
#    Pi 端：把 cam_server.py 传到 Pi 后 `python3 cam_server.py`
#    本机端：
python "教学demo/摄像头远程显示/cam_view.py"
```

## 约定

- 每个分类目录都有 `README.md` 说明用途与命名规则，新增内容先看对应 README。
- 大文件（模型权重、数据集）不入库，见 `模型/README.md`、`数据/README.md`。
- 环境与树莓派操作细节集中在 `AGENTS.md`，避免散落。

## 参考

- Cookiecutter Data Science：<https://cookiecutter-data-science.drivendata.org/>
