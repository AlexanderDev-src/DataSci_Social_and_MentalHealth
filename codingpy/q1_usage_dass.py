"""
Research question 1: How strongly do daily social media hours relate to depression, anxiety, and stress?

Run: uv run python q1_usage_dass.py
"""

import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import pandas as pd
from clean_data import CLEAN_PATH
from config import load_data, passed_attention, setup
from qr2 import DIMENSIONS, thai_font
from rich_console import console
from scipy import stats

EXPOSURE = "social_media_hours"
FIG_PATH = "../figures/q1-usage-dass.png"


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
        ax.set_xlabel("จำนวนชั่วโมง")
    axes[0].set_ylabel("คะแนน DASS-21 (0-42)")
    fig.tight_layout()
    fig.savefig(FIG_PATH, dpi=200, facecolor="white")
    console.print(f"[green]Saved:[/green] {FIG_PATH}")
    plt.show()


if __name__ == "__main__":
    setup()
    df = passed_attention(load_data(CLEAN_PATH))
    console.print(f"[green]n = {len(df)}[/green] rows from {CLEAN_PATH}")
    analysis(df)
    plot(df)