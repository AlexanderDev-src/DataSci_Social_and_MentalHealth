"""
Research question 3: Is news consumption frequency more strongly related to anxiety than to depression or stress?

Run: uv run python q3_news_anxiety.py
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

EXPOSURE = "news_days"
FIG_PATH = "../figures/q3-news-anxiety.png"


def analysis(df: pd.DataFrame) -> None:
    for col, name in DIMENSIONS.items():
        d = df[[EXPOSURE, col]].dropna()
        r, p = stats.pearsonr(d[EXPOSURE], d[col])
        console.print(f"{name}: r = {r:.3f}, r^2 = {r**2:.3f}, p = {p:.4f}, n = {len(d)}")


def plot(df: pd.DataFrame) -> None:
    plt.rcParams["font.family"] = thai_font()
    fig, axes = plt.subplots(1, 3, figsize=(12, 4), sharey=True)
    for ax, (col, name) in zip(axes, DIMENSIONS.items()):
        ax.scatter(df[EXPOSURE], df[col], alpha=0.6)
        ax.set_title(name)
        ax.set_xlabel("จำนวนวันติดตามข่าว/สัปดาห์")
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