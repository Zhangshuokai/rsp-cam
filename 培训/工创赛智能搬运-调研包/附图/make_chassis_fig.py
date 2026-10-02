# -*- coding: utf-8 -*-
"""工创赛底盘选型对比图：4麦轮 vs 3全向轮 支撑多边形可视化"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon, Circle
import numpy as np

plt.rcParams["font.family"] = ["Noto Sans CJK SC", "WenQuanYi Micro Hei", "sans-serif"]
plt.rcParams["axes.unicode_minus"] = False

fig, axes = plt.subplots(1, 2, figsize=(11.5, 5.4), dpi=200)
fig.text(0.5, 0.985, "工创赛智能搬运 · 底盘选型工程账：为什么决赛清一色麦轮",
         ha="center", fontsize=14, weight="bold")
fig.text(0.5, 0.015,
         "获奖 / 决赛级公开案例清一色 4×麦轮（全向轮仅见个别实验性尝试）——规则未禁用全向轮，这是工程取舍的结果",
         ha="center", fontsize=10, color="#555")

# ---------- Panel A: mecanum ----------
ax = axes[0]
w = 0.42
poly = [(-w, -w), (w, -w), (w, w), (-w, w)]
ax.add_patch(Polygon(poly, closed=True, facecolor="#e74c3c", alpha=0.13,
                     edgecolor="#c0392b", ls="--", lw=1.6))
ax.add_patch(Rectangle((-0.5, -0.5), 1.0, 1.0, facecolor="#95a5a6", alpha=0.30,
                       edgecolor="#666", lw=1.2))
for sx in (-1, 1):
    for sy in (-1, 1):
        ax.add_patch(Rectangle((sx * 0.40 - 0.085, sy * 0.40 - 0.045), 0.17, 0.09,
                               angle=45 if sx * sy > 0 else -45,
                               facecolor="#2c3e50", edgecolor="k", lw=0.5))
ax.plot(0, 0, marker="o", ms=10, color="#e67e22", zorder=5)
ax.annotate("重心高\n(立柱+机械臂)", (0, 0), textcoords="offset points",
            xytext=(10, 10), fontsize=10, color="#b35900")
ax.annotate("", xy=(0.68, 0), xytext=(0, 0),
            arrowprops=dict(arrowstyle="-|>", color="#2980b9", lw=2.2))
ax.text(0.70, -0.05, "横移", fontsize=10.5, color="#2980b9", va="top")
ax.annotate("", xy=(0.5, 0.5), xytext=(0, 0),
            arrowprops=dict(arrowstyle="-|>", color="#27ae60", lw=2.2))
ax.text(0.42, 0.56, "斜移", fontsize=10.5, color="#27ae60")
ax.text(0, -0.78, "支撑多边形 = 大矩形（四点）\n横移/斜移/自转可自由合成，急停裕度大",
        ha="center", fontsize=11)
ax.text(-0.88, 0.72, "支撑多边形", fontsize=10, color="#c0392b")
ax.set_xlim(-0.95, 0.98)
ax.set_ylim(-0.98, 0.88)
ax.set_aspect("equal")
ax.axis("off")
ax.set_title("4× 麦克纳姆轮（决赛主流）", fontsize=12.5)

# ---------- Panel B: 3 omni ----------
ax = axes[1]
R = 0.45
angs = [90, 210, 330]
xs = [R * np.cos(np.deg2rad(a)) for a in angs]
ys = [R * np.sin(np.deg2rad(a)) for a in angs]
ax.add_patch(Polygon(list(zip(xs, ys)), closed=True, facecolor="#e74c3c", alpha=0.13,
                     edgecolor="#c0392b", ls="--", lw=1.6))
ax.add_patch(Circle((0, 0), 0.5, facecolor="#95a5a6", alpha=0.30,
                    edgecolor="#666", lw=1.2))
for a, x, y in zip(angs, xs, ys):
    t = np.deg2rad(a + 90)
    ax.add_patch(Rectangle((x - 0.075, y - 0.035), 0.15, 0.07, angle=np.rad2deg(t),
                           facecolor="#2c3e50", edgecolor="k", lw=0.5,
                           rotation_point="center"))
ax.plot(0, 0, marker="o", ms=10, color="#e67e22", zorder=5)
ax.annotate("重心高", (0, 0), textcoords="offset points", xytext=(10, 8),
            fontsize=10, color="#b35900")
ax.annotate("", xy=(0.68, 0), xytext=(0, 0),
            arrowprops=dict(arrowstyle="-|>", color="#2980b9", lw=2.2))
ax.text(0.70, -0.05, "横移", fontsize=10.5, color="#2980b9", va="top")
ax.annotate("横移/过缝时\n易翘脚、矢量乱", xy=(0.30, -0.26), xytext=(0.28, -0.72),
            fontsize=10, color="#c0392b", ha="center",
            arrowprops=dict(arrowstyle="->", color="#c0392b"))
ax.text(0, 0.79, "支撑多边形 = 三角形（三点）\n侧向翻倾裕度小；四轮O形布置则要\n解决受力均衡与标定，复杂度上升",
        ha="center", fontsize=11)
ax.text(-0.62, -0.28, "支撑多边形", fontsize=10, color="#c0392b")
ax.set_xlim(-0.95, 0.98)
ax.set_ylim(-0.98, 0.98)
ax.set_aspect("equal")
ax.axis("off")
ax.set_title("3× 全向轮（少数尝试）", fontsize=12.5)

plt.tight_layout(rect=[0, 0.03, 1, 0.95])
out = "/home/zhangsk/projects/banyun-recon/report/底盘选型-麦轮vs全向轮.png"
plt.savefig(out, bbox_inches="tight", facecolor="white")
print("SAVED", out)
