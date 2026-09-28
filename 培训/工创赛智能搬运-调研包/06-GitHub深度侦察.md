# 06 · GitHub 深度侦察：智能搬运开源方案（补充件）

> 采集：2026-09-28 ｜ 方法：gh search + GitHub API 多关键词检索（工创赛 / 工训赛 / 智能物流搬运 / 智能搬运 / 物流搬运小车 / 搬运小车 比赛 等），命中 **55 个仓库**（含相邻赛项），逐个抓取 README 与文件树（原始数据 `_meta.json` 383KB）。
> 本地克隆：`~/projects/banyun-recon/refs/github/`（**yuanxiexie531-glitch/gcs-gold-medal**、**Thirtynine3939/2025GongChuang_AGV** 已完成；cheese-shredded-ice/gongchuangsai_MBH、ATouDouYo619/2025-Intelligent-logistics-handling 本轮补克隆）。
> 全量 55 仓索引：本包 `GitHub-55仓库总表.csv`。

## 一、总表（精选，按可用度分梯队）

### 第一梯队 · 整机开源、资料完整（可直接对标）
| 仓库 | ⭐ | 届次/成绩 | 一句话 | 看什么 |
|---|---|---|---|---|
| **yuanxiexie531-glitch/gcs-gold-medal** | 117 | 2025 国金·全国第六·江苏省冠 | 整车 STEP + 初赛视觉 1891 行 + **材料清单/调试说明在线实时更新** | ★起跑线：装配模型、BOM、避坑手册 |
| **Thirtynine3939/2025GongChuang_AGV** | 138 | 2025 满环车 | 代码、电路、结构开源；Jetson+STM32 分层 | Jetson+STM32 分层；物料追踪；Qt HMI |
| **aystmjz/Stepping-Motor-Car** | 97 | 2023 国银 | 步进电机机械臂+双 PID+陀螺仪+树莓派视觉；控制板开源 | `Finals_Code` 分支=国赛现场代码 |
| **zpclyn/GongXun2025** | 34 | 2025 河北省冠 | 全套开源+技术报告（121MB） | 技术报告写法 |
| **ATouDouYo619/2025-Intelligent-logistics-handling** | 50 | 2025 | 资料合集 | 素材齐全 |
| **darrrt/EngineeringInnovationComp2023** | 49 | 2023 省赛 | 二维码/圆环/通信 Python + 2560 扩展板原理图 | 早期视觉流水线 |
| **liaojingwu20041031/GX-Intelligent-Logistics-Silver** | 7 | 2025 国银 | STM32F103+麦轮+Emm_V5 闭环步进+3 轴码垛臂+ArUco（±2mm/±0.5°） | 结构化最强的代码仓（含架构图） |

### 第二梯队 · 单点突出（视觉 / 控制 / 最新）
| 仓库 | ⭐ | 届次 | 一句话 |
|---|---|---|---|
| **Wuyanzu-wuhu/gc-stm32F4-** | 3 | 2025–26 广东省赛（2026-08 更新） | F407+4 路串口 42 步进+HWT101+K230 视觉+GM65 扫码+3 舵机；分层状态机 ★最新现役代码 |
| innns/GCXL-Conveying-Robot-CV | 15 | 2021 国赛（UESTC） | 树莓派 OpenCV 视觉+16 字节串口协议+报告 PDF |
| zhiyyyu/GCXL-Vision-2021 | 15 | 2021 | C++/CMake 二维码+检测视觉 |
| wwwgb/intelligent_logistics | 3 | 2025 银奖 | STM32+RTOS+K210 |
| Jees996/Eng-Prac-2025 | 3 | 2025 北京二等 | OpenMV H7 视觉+UART 状态机（含接线表） |
| dixiatielu/DeliveryCarVision | 2 | 2025 | 视觉部分 |
| Blue-Net-Team/Engineering-innovation-competition-vision | 2 | 2025 广东 | 视觉识别代码 |
| sincerely-hello-world/SmartCar | 9 | 2023 | 214MB 大合集 |
| Chemcrin/IntelligentTransformCart | 5 | （CTGU·天问） | ZDT X57 V2 闭环步进（Modbus-RTU）+SLDPRT 全套建模+PCB+BOM 表 |
| pinksakuragit/Logistics_Vehicle_F407_V2 | 0 | 2025 | 西安理工·塔吊方案 |
| moyan-git/Logistics-handling-trolley | 0 | 2026 | 广东省赛·设计 |
| GYD-418/smart-logistics-robot-2024 | 1 | 2024 | 3×STM32+OpenMV+语音+HMI |
| niutu1224/logistics_robot2021 | 13 | 2021 国赛 | 历史参考 |
| NanoPangBZ/SmartCar-For-GCXLDS | 8 | 2021 | 历史参考 |
| WindowsXp-Beta/intelligent_transporting_robot | 2 | ~2021（SJTU） | 上海赛 |

### 相邻 / 前瞻
| 仓库 | ⭐ | 说明 |
|---|---|---|
| Oples-Xi/Oct_race | 1 | **2027 第十届·智能分拣赛项**（2026-09 创建，前瞻跟踪） |
| liangtian061109/stm32f407forgongchuang | 0 | **2027 物流搬运**·STM32F407（2026-09 创建） |
| lambdalaiwx/robot-car-2026 | 0 | 工创赛搬运+CRAIC 双赛备份 |
| Tuzfucius/Unofficial-Guide-to-… | 1 | ZJUT 非官方参赛指南 |
| kalun1031-dev/RC2026- | 2 | RoboCup 车型搬运（**非工创赛**；工程规范/证据分级值得学） |
| ANGJustinl/gcxl_2025 | 6 | 实为**垃圾分类赛项**（选型文档可参考） |
| ArnoldZhou/Arduino-LogisticsCar | 26 | 2019 古早 Arduino 方案 |
| lifuguan/gx2019_omni_simulations | 13 | 2019 ROS/VISP 仿真 |

（其余 20+ 个见 CSV）

## 二、重点仓库深读

### ★1 yuanxiexie531-glitch/gcs-gold-medal —— 2025 国金第六（本轮已克隆）
仓库实际内容（2026-09-28 核对，main 分支共 16 个文件）：
- `1A整车第三版装配A.STEP`（21MB）：**整车总装模型**，SolidWorks 可直接打开，量尺寸/对接口首选（比截图/三视图强）
- `cv2_python/zongchengxu20250724chusai.py`（**1891 行**）：初赛视觉主程序（日期 2025-07-24）
- `yyb_stm32/`：STM32 基础工程（PWM/pid/servo/switch 驱动框架）
- 两份 kdocs 在线文档（**实时更新**）：
  - 材料清单（BOM）：https://www.kdocs.cn/l/culQA3BLVIfF
  - 调试说明及方案说明：https://www.kdocs.cn/l/cazWiByP5Yd8 —— README 强调「**加工或调试前先看**，含常见问题解决方案」
- 注意：结构 SW 源文件与 PCB 未随仓上传（README 提及但实际以在线文档/联系作者方式提供）；作者联系：抖音 918575532 / B站 589391307
→ **拿法**：STEP 建模参照 → 对照 kdocs BOM 采购 → 调试手册避坑 → 视觉代码作初赛起点。

### ★2 Thirtynine3939/2025GongChuang_AGV —— 满环车（⭐138，本轮已克隆）
**架构**：Jetson Orin Nano 上位机（Python）+ STM32 下位机（标准库）。
- `程序/上位机/国赛决赛/`：**视觉 + 机械臂解算（直线插补、物料追踪）+ 比赛任务状态机（task.py）+ 位置 PID + HMI（Qt，含 .ui 多版迭代备份）**——满环车的「动态跟踪抓取」就在这套代码里；另附 **调阈值工具 GreenLight.exe**（桌面工具，现场调视觉阈值给队友用）
- `程序/下位机/Chassis_v2.0.zip`：四轮毂步进脉冲控制、惯导、直线/旋转运动、舵机、蓝牙调试 App 工程
- `电路/`：立创 EDA 专业版工程（底盘主控 v3_2025-03-24）+ **叠板装配 STEP（75MB）**
- `结构/度盘链接.txt`：结构件网盘分发（pan.baidu.com/s/1TqB33Q76j-LBA5p1XvQL6w 提取码 trbq；作者队友 B 站「澡堂战神」）
→ 拿法：上位机代码看「视觉-机械臂-任务调度」分层；电路看叠板设计；结构走网盘。

### ★3 aystmjz/Stepping-Motor-Car —— 国银·步进方案（⭐97）
2023 国银完整代码；README：硬件控制板已开源（立创 oshwhub.com/aystmjz/gong-xun-sai）；**国赛现场最终代码在 `Finals_Code` 分支**；双 PID 控制环+陀螺仪+树莓派视觉。
→ 与课程「ZDT 步进」主线互证：步进方案有国银背书。

### ★4 Wuyanzu-wuhu/gc-stm32F4- —— 2025–26 广东省赛现役代码（2026-08 更新）
README 含完整硬件表与工程细节：F407VGT6@168MHz；4 路串口 42 步进（地址 0x05/08/06/09，速度/位置/回零/同步下发）；世界坐标→车体→麦轮逆运动学；HWT101 航向 PID（实现「车身漂移」式运动）；**K230 视觉回传 dx/dy 做末段对准**；GM65 扫码 `123+456`→六个任务位；3 路 PWM 舵机（夹爪/转盘/皮带升降）+S 曲线平滑；SysTick 1ms 时间片；**分层状态机**（总调度+子状态机）。
→ 目前公开的**最接近 2027 流程**的代码级参考；B 站演示：BV1aPby6JE3m。

### 5. liaojingwu20041031/GX-Intelligent-Logistics-Silver —— 2025 国银全套
架构（README）：4 麦轮+**Emm_V5 闭环步进**；正交编码轮里程计+陀螺仪（±2mm/±0.5°）；树莓派 OpenCV+**ArUco 定位校正**；3 轴码垛机械臂+逆运动学；状态机含异常恢复；含 mermaid 架构图+能力指标表。
→ 想写「技术报告/文档」的直接范本。

## 三、结论：先拿什么、能借鉴什么
1. **优先级**：yuanxiexie（STEP+BOM+调试手册+视觉）→ Thirtynine3939（电路+上位机）→ aystmjz（步进国银代码）。三层把「结构-电路-代码-调试」配齐。
2. **与 B 站资料的分工**：B 站课程教「怎么做」，GitHub 仓给「做成什么样」的具体文件（代码/模型/清单），互补使用。
3. **采购清单双保险**：yuanxiexie kdocs BOM（在线实时）+ CTGU BOM 表（xlsx 随仓）。
4. **风向印证**：2026 年新仓（Wuyanzu/cheese）确认「F407 + 串口步进 + K230」是省赛层主流配置，与课程口径一致。
5. **前瞻**：Oples-Xi/Oct_race（2027 智能分拣）、liangtian061109（2027 搬运）——2026-09 刚建，值得持续跟踪（可加入赛季看板监控）。
6. **避坑提醒**：2021 及更早仓库（Arduino/ROS 时代）规则差异大，只作历史参考；正式对标以 **2023+** 为准。

## 四、复用与溯源
- 全量索引：`GitHub-55仓库总表.csv`（仓库/Star/更新时间/简介/大小/链接）
- 原始数据：`_meta.json`（383KB，含每仓 README 全文与文件树）存于本机 `~/projects/banyun-recon/refs/github/`，需要可补发
- 检索关键词矩阵：工创赛 / 工训赛 / 智能物流搬运 / 智能搬运 / 物流搬运小车 / 搬运小车 比赛 / engineering training competition robot
