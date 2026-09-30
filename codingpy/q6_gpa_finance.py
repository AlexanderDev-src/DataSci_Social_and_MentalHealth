"""
Research question 6: How do academic performance (GPA) and financial status relate to DASS-21 dimensions?

Run: uv run python q6_gpa_finance.py
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

FIG_PATH = "../figures/q6-gpa-finance.png"


def analysis(df: pd.DataFrame) -> None:
    console.print("\n--- GPA vs DASS-21 (Pearson Correlation) ---")
    for col, name in DIMENSIONS.items():
        d = df[["GPA", col]].dropna()
        r, p = stats.pearsonr(d["GPA"], d[col])
        console.print(f"GPA x {name}: r = {r:.3f}, p = {p:.4f}, n = {len(d)}")

    console.print("\n--- Financial Sufficiency vs DASS-21 (Kruskal-Wallis) ---")
    for col, name in DIMENSIONS.items():
        groups = [group[col].dropna() for _, group in df.groupby("financial_sufficiency")]
        stat, p = stats.kruskal(*groups)
        console.print(f"Financial x {name}: Kruskal-Wallis H = {stat:.3f}, p = {p:.4f}")


def plot(df: pd.DataFrame) -> None:
    plt.rcParams["font.family"] = thai_font()
    fig, axes = plt.subplots(2, 3, figsize=(14, 8), sharey=True)

    # แถวที่ 1: GPA vs DASS-21 (Scatter plot)
    for ax, (col, name) in zip(axes[0], DIMENSIONS.items()):
        d = df[["GPA", col]].dropna()
        ax.scatter(d["GPA"], d[col], alpha=0.6, color="teal")
        ax.set_title(f"GPA vs {name}")
        ax.set_xlabel("เกรดเฉลี่ย (GPA)")

    axes[0, 0].set_ylabel("คะแนน DASS-21 (0-42)")

    # แถวที่ 2: Financial Sufficiency vs DASS-21 (Boxplot)
    fin_order = df["financial_sufficiency"].dropna().unique()
    for ax, (col, name) in zip(axes[1], DIMENSIONS.items()):
        data_to_plot = [df[df["financial_sufficiency"] == f][col].dropna() for f in fin_order]
        ax.boxplot(data_to_plot, tick_labels=fin_order)
        ax.set_title(f"สถานะการเงิน vs {name}")
        ax.set_xlabel("ความเพียงพอทางการเงิน")
        ax.tick_params(axis="x", rotation=15)

    axes[1, 0].set_ylabel("คะแนน DASS-21 (0-42)")

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