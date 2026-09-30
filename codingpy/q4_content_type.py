"""
Research question 4: Do students who primarily consume different content types report different depression, anxiety, or stress levels?

Run: uv run python q4_content_type.py
"""

import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import pandas as pd
from clean_data import CLEAN_PATH
from config import load_data, setup
from qr2 import DIMENSIONS, thai_font
from rich_console import console
from scipy import stats

GROUP_COL = "content_group"
FIG_PATH = "../figures/q4-content-type.png"


def analysis(df: pd.DataFrame) -> None:
    for col, name in DIMENSIONS.items():
        groups = [group[col].dropna() for _, group in df.groupby(GROUP_COL)]
        # ใช้ Kruskal-Wallis ตามที่ระบุในคู่มือโครงงาน
        stat, p = stats.kruskal(*groups)
        console.print(f"{name}: Kruskal-Wallis H = {stat:.3f}, p = {p:.4f}")


def plot(df: pd.DataFrame) -> None:
    plt.rcParams["font.family"] = thai_font()
    fig, axes = plt.subplots(1, 3, figsize=(14, 4), sharey=True)
    
    # จัดเรียงประเภทกลุ่มเนื้อหา
    group_order = df[GROUP_COL].dropna().unique()
    
    for ax, (col, name) in zip(axes, DIMENSIONS.items()):
        data_to_plot = [df[df[GROUP_COL] == g][col].dropna() for g in group_order]
        ax.boxplot(data_to_plot, tick_labels=group_order)
        ax.set_title(name)
        ax.tick_params(axis='x', rotation=15)
        
    axes[0].set_ylabel("คะแนน DASS-21 (0-42)")
    fig.tight_layout()
    fig.savefig(FIG_PATH, dpi=200, facecolor="white")
    console.print(f"[green]Saved:[/green] {FIG_PATH}")
    plt.show()


if __name__ == "__main__":
    setup()
    df = load_data(CLEAN_PATH)
    console.print(f"[green]n = {len(df)}[/green] rows from {CLEAN_PATH}")
    analysis(df)
    plot(df)