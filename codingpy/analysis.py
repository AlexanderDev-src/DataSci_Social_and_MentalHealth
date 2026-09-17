# %%
import matplotlib

matplotlib.use("TkAgg")  # ตัดออกได้ถ้ารันในเครื่องตัวเอง
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from clean_data import CLEAN_PATH
from config import SEED, load_data, setup
from rich_console import console, print_df, print_series

setup()
df = load_data(CLEAN_PATH)
console.print(
    f"[green]load_data:[/green] {df.shape[0]} row, {df.shape[1]} columns (seed={SEED})"
)

# %%

# print_df(df.describe().round(2), title="describe", index=True)

# %%
# 3D: social media hours x sleep hours -> DASS total, one least-squares plane per gender
cols = ["social_media_hours", "sleep_hours", "dass_total"]
d = df[cols + ["gender"]].dropna()

# color + marker per gender, so the groups differ by more than color alone
STYLE = {"Female": ("#eb6834", "o"), "Male": ("#2a78d6", "^")}

gx, gy = np.meshgrid(
    np.linspace(d["social_media_hours"].min(), d["social_media_hours"].max(), 20),
    np.linspace(d["sleep_hours"].min(), d["sleep_hours"].max(), 20),
)

fig = plt.figure(figsize=(9, 7))
ax = fig.add_subplot(projection="3d")

for gender, (color, marker) in STYLE.items():
    g = d[d["gender"] == gender]
    x, y, z = (g[c].to_numpy(dtype=float) for c in cols)

    # z = b0 + b1*x + b2*y
    X = np.column_stack([np.ones_like(x), x, y])
    b, *_ = np.linalg.lstsq(X, z, rcond=None)
    r2 = 1 - np.sum((z - X @ b) ** 2) / np.sum((z - z.mean()) ** 2)
    console.print(
        f"[green]{gender}:[/green] dass_total = {b[0]:.2f} + {b[1]:.2f}*social_media_hours "
        f"+ {b[2]:.2f}*sleep_hours  (R²={r2:.3f}, n={len(g)}, mean DASS={z.mean():.1f})"
    )

    ax.scatter(
        x,
        y,
        z,
        color=color,
        marker=marker,
        s=40,
        edgecolors="white",
        linewidths=0.5,
        depthshade=False,
        label=f"{gender} (n={len(g)}, mean DASS {z.mean():.1f}, R² {r2:.2f})",
    )
    ax.plot_surface(gx, gy, b[0] + b[1] * gx + b[2] * gy, color=color, alpha=0.2)

ax.set_xlabel("Social media (hours/day)")
ax.set_ylabel("Sleep (hours/night)")
ax.set_zlabel("DASS-21 total")
ax.set_title("Social media, sleep and DASS-21 total: female vs male")
ax.view_init(elev=20, azim=-60)
ax.legend(loc="upper left")
fig.tight_layout()
fig.savefig("../figures/3d-usage-sleep-dass.png", dpi=200)
plt.show()
