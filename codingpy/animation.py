# %%
"""What-if animation: raise social media use one hour at a time, 0 -> 15 h/day,
and follow the DASS-21 total that each gender's fitted plane predicts.

Sleep is held at each gender's mean, so only social media hours change. The
survey only covers 3-15.5 h/day, so the frames below 3 h are extrapolation.
"""

import matplotlib

matplotlib.use("TkAgg")  # ตัดออกได้ถ้ารันในเครื่องตัวเอง
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from clean_data import CLEAN_PATH
from config import load_data, setup
from matplotlib.animation import FuncAnimation, PillowWriter
from rich_console import console

HOURS = np.arange(0, 16)  # 0, 1, ..., 15 hours of social media per day
COLS = ["social_media_hours", "sleep_hours", "dass_total"]
# color + marker per gender, same as analysis.py
STYLE = {"Female": ("#eb6834", "o"), "Male": ("#2a78d6", "^")}
GIF_PATH = "../figures/what-if-social-media.gif"
Z_MAX = 100


def fit_plane(g: pd.DataFrame) -> np.ndarray:
    """Least-squares b for dass_total = b0 + b1*social_media_hours + b2*sleep_hours."""
    x, y, z = (g[c].to_numpy(dtype=float) for c in COLS)
    X = np.column_stack([np.ones_like(x), x, y])
    b, *_ = np.linalg.lstsq(X, z, rcond=None)
    return b


setup()
df = load_data(CLEAN_PATH)
d = df[COLS + ["gender"]].dropna()
low, high = d["social_media_hours"].min(), d["social_media_hours"].max()

# gender -> (rows, plane, mean sleep, predicted DASS for every hour in HOURS)
fits = {}
for gender in STYLE:
    g = d[d["gender"] == gender]
    b = fit_plane(g)
    sleep = g["sleep_hours"].mean()
    pred = b[0] + b[1] * HOURS + b[2] * sleep
    fits[gender] = (g, b, sleep, pred)
    console.print(
        f"[green]{gender}:[/green] each +1 h social media -> DASS {b[1]:+.2f} "
        f"(sleep held at {sleep:.1f} h): {HOURS[0]} h = {pred[0]:.1f}, "
        f"{HOURS[-1]} h = {pred[-1]:.1f}"
    )

# %%
fig = plt.figure(figsize=(9, 7))
ax = fig.add_subplot(projection="3d")

y_min, y_max = d["sleep_hours"].min(), d["sleep_hours"].max()
gx, gy = np.meshgrid(np.linspace(HOURS[0], HOURS[-1], 20), np.linspace(y_min, y_max, 20))
# the moving "you are here" wall at the current hour
wall_y, wall_z = np.meshgrid([y_min, y_max], [0, Z_MAX])

paths, dots = {}, {}
for gender, (color, marker) in STYLE.items():
    g, b, sleep, _ = fits[gender]
    # the real survey answers stay faint in the background for context
    ax.scatter(
        g["social_media_hours"],
        g["sleep_hours"],
        g["dass_total"],
        color=color,
        marker=marker,
        s=20,
        alpha=0.3,
        depthshade=False,
    )
    ax.plot_surface(gx, gy, b[0] + b[1] * gx + b[2] * gy, color=color, alpha=0.12)
    (paths[gender],) = ax.plot([], [], [], color=color, linewidth=2)
    (dots[gender],) = ax.plot(
        [],
        [],
        [],
        color=color,
        marker=marker,
        markersize=12,
        markeredgecolor="white",
        linestyle="",
        label=f"{gender} (sleep held at {sleep:.1f} h)",
    )

ax.set_xlim(HOURS[0], HOURS[-1])
ax.set_ylim(y_min, y_max)
ax.set_zlim(0, Z_MAX)
ax.set_xlabel("Social media (hours/day)")
ax.set_ylabel("Sleep (hours/night)")
ax.set_zlabel("DASS-21 total")
ax.view_init(elev=20, azim=-60)
ax.legend(loc="upper left")
caption = fig.text(0.5, 0.04, "", ha="center", fontsize=11, color="#333333")


def draw_wall(h: float):
    return ax.plot_surface(
        np.full_like(wall_y, h, dtype=float), wall_y, wall_z, color="#888888", alpha=0.15
    )


wall = [draw_wall(HOURS[0])]  # replaced every frame


def draw(i: int):
    h = HOURS[i]
    wall[0].remove()
    wall[0] = draw_wall(h)

    lines = []
    for gender in STYLE:
        _, _, sleep, pred = fits[gender]
        paths[gender].set_data_3d(HOURS[: i + 1], np.full(i + 1, sleep), pred[: i + 1])
        dots[gender].set_data_3d([h], [sleep], [pred[i]])
        lines.append(f"{gender} {pred[i]:.1f} ({pred[i] - pred[0]:+.1f} since 0 h)")

    outside = "  [outside survey range]" if not low <= h <= high else ""
    ax.set_title(f"What if social media = {h} h/day?{outside}")
    caption.set_text("Predicted DASS-21 total:   " + "   |   ".join(lines))


anim = FuncAnimation(fig, draw, frames=len(HOURS), interval=600, repeat_delay=1500)
anim.save(GIF_PATH, writer=PillowWriter(fps=2))
console.print(f"[green]saved:[/green] {GIF_PATH}")
plt.show()
