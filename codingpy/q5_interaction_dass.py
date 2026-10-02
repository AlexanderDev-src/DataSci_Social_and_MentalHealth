"""
Research question 5: How do digital and lifestyle interaction patterns relate to DASS-21 dimensions?

Run: uv run python q5_interaction_dass.py
"""

import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from clean_data import CLEAN_PATH
from config import load_data, passed_attention, setup
from qr2 import DIMENSIONS, thai_font
from rich_console import console
from scipy import stats

INTERACTION_COLS = {
    "social_media_hours": "ชั่วโมงโซเชียล",
    "news_days": "วันติดตามข่าว",
    "sleep_hours": "ชั่วโมงนอน",
    "exercise_days": "วันออกกำลังกาย",
    "sleep_quality": "คุณภาพการนอน",
}

FIG_PATH = "../figures/q5-interaction-dass.png"


def analysis(df: pd.DataFrame) -> pd.DataFrame:
    results = []
    for int_col, int_label in INTERACTION_COLS.items():
        row = {"interaction": int_label}
        for dim_col, dim_label in DIMENSIONS.items():
            d = df[[int_col, dim_col]].dropna()
            r, p = stats.pearsonr(d[int_col], d[dim_col])
            row[f"{dim_label}_r"] = r
            row[f"{dim_label}_p"] = p
            console.print(f"{int_label} x {dim_label}: r = {r:.3f}, p = {p:.4f}")
        results.append(row)
    return pd.DataFrame(results)


def usage_vs_sleep(df: pd.DataFrame) -> None:
    """Methodology question 5: do heavier users sleep less, or sleep worse?"""
    for col in ["sleep_hours", "sleep_quality"]:
        d = df[["social_media_hours", col]].dropna()
        r, p = stats.pearsonr(d["social_media_hours"], d[col])
        rho = stats.spearmanr(d["social_media_hours"], d[col]).statistic
        console.print(
            f"{INTERACTION_COLS['social_media_hours']} x {INTERACTION_COLS[col]}: "
            f"r = {r:.3f}, p = {p:.4f}, rho = {rho:.3f}, n = {len(d)}"
        )


def plot(df: pd.DataFrame) -> None:
    plt.rcParams["font.family"] = thai_font()
    fig, ax = plt.subplots(figsize=(8, 6))

    corr_matrix = np.zeros((len(INTERACTION_COLS), len(DIMENSIONS)))
    
    int_keys = list(INTERACTION_COLS.keys())
    dim_keys = list(DIMENSIONS.keys())

    for i, int_col in enumerate(int_keys):
        for j, dim_col in enumerate(dim_keys):
            d = df[[int_col, dim_col]].dropna()
            r, _ = stats.pearsonr(d[int_col], d[dim_col])
            corr_matrix[i, j] = r

    cax = ax.matshow(corr_matrix, cmap="coolwarm", vmin=-0.4, vmax=0.4)
    fig.colorbar(cax)

    ax.set_xticks(range(len(DIMENSIONS)))
    ax.set_yticks(range(len(INTERACTION_COLS)))
    ax.set_xticklabels(list(DIMENSIONS.values()))
    ax.set_yticklabels(list(INTERACTION_COLS.values()))

    for i in range(len(INTERACTION_COLS)):
        for j in range(len(DIMENSIONS)):
            ax.text(j, i, f"{corr_matrix[i, j]:.2f}", ha="center", va="center", color="black")

    ax.set_title("สหสัมพันธ์ระหว่างพฤติกรรมพฤติกรรมชีวิตกับมิติสุขภาพจิต (DASS-21)", pad=20)
    fig.tight_layout()
    fig.savefig(FIG_PATH, dpi=200, facecolor="white")
    console.print(f"[green]Saved:[/green] {FIG_PATH}")
    plt.show()


if __name__ == "__main__":
    setup()
    df = passed_attention(load_data(CLEAN_PATH))
    console.print(f"[green]n = {len(df)}[/green] rows from {CLEAN_PATH}")
    analysis(df)
    usage_vs_sleep(df)
    plot(df)