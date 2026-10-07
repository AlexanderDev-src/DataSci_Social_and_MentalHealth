"""Figures for the AUCC paper, sized to one 82 mm column.

The notebooks in codingpy/ draw the same results for a full A4 page, with
titles inside the picture. A conference column is less than half that width,
so this script draws them again with larger text and no titles; the caption
in section/04-results.tex carries the title instead.

Run from the repository root:  uv run python report_aucc/make_figures.py
"""

from dataclasses import dataclass
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import font_manager
from matplotlib.figure import Figure
from scipy import stats

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "codingpy" / "data" / "data_clean.csv"
OUT = Path(__file__).resolve().parent / "figures"

# same values as the notebook, so the bootstrap CIs come out identical
SEED = 42
N_BOOT = 5000

MM = 1 / 25.4  # inches
WIDTH = 80 * MM
FONT_SIZE = 13  # TH Sarabun New runs small; 13 here reads like 12 pt body text

DIMENSIONS = {
    "dass_depression": "ซึมเศร้า",
    "dass_anxiety": "วิตกกังวล",
    "dass_stress": "เครียด",
}
DIMENSION_COLOR = {
    "dass_depression": "#2a78d6",
    "dass_anxiety": "#eb6834",
    "dass_stress": "#1baf7a",
}
EXPOSURES = {
    "social_media_hours": "ชั่วโมงใช้งานต่อวัน",
    "news_days": "วันที่ติดตามข่าวเชิงลบ",
}
# 1-10 self-rating cut into three money groups, as in the notebook
FINANCE_EDGES = [0, 4, 7, 10]
FINANCE_GROUPS = {
    "low": ("ไม่พอใช้", "#86b6ef"),
    "mid": ("พอใช้", "#2a78d6"),
    "high": ("สบาย", "#104281"),
}


@dataclass(frozen=True)
class Correlation:
    exposure: str
    dimension: str
    r: float
    low: float
    high: float


@dataclass(frozen=True)
class GroupMean:
    group: str
    dimension: str
    mean: float
    se: float
    n: int


def passed_attention(df: pd.DataFrame) -> pd.DataFrame:
    return df[df["attention_check"] == 1].reset_index(drop=True)


def boot_ci(
    x: np.ndarray, y: np.ndarray, rng: np.random.Generator
) -> tuple[float, float]:
    idx = rng.integers(0, len(x), size=(N_BOOT, len(x)))
    draws = np.array([np.corrcoef(x[i], y[i])[0, 1] for i in idx])
    low, high = np.percentile(draws[np.isfinite(draws)], [2.5, 97.5])
    return float(low), float(high)


def correlations(df: pd.DataFrame) -> list[Correlation]:
    # one generator in the notebook's loop order, or the CIs would differ
    rng = np.random.default_rng(SEED)
    rows = []
    for exposure in EXPOSURES:
        for dimension in DIMENSIONS:
            d = df[[exposure, dimension]].dropna()
            x = d[exposure].to_numpy(dtype=float)
            y = d[dimension].to_numpy(dtype=float)
            r, _ = stats.pearsonr(x, y)
            low, high = boot_ci(x, y, rng)
            rows.append(Correlation(exposure, dimension, float(r), low, high))
    return rows


def finance_means(df: pd.DataFrame) -> list[GroupMean]:
    group = pd.cut(
        df["financial_sufficiency"],
        bins=FINANCE_EDGES,
        labels=list(FINANCE_GROUPS),
        ordered=True,
    )
    rows = []
    for dimension in DIMENSIONS:
        for name, scores in df[dimension].groupby(group, observed=True):
            rows.append(
                GroupMean(
                    str(name),
                    dimension,
                    float(scores.mean()),
                    float(scores.sem()),
                    len(scores),
                )
            )
    return rows


def thai_font() -> str:
    # register every weight; matplotlib's cache can miss /usr/share/fonts/SIPA
    found = False
    for path in font_manager.findSystemFonts():
        try:
            name = font_manager.FontProperties(fname=path).get_name()
        except (RuntimeError, OSError):
            continue
        if name == "TH Sarabun New":
            font_manager.fontManager.addfont(path)
            found = True
    if not found:
        raise SystemExit("TH Sarabun New is not installed")
    return "TH Sarabun New"


def style(font: str) -> None:
    plt.rcParams.update(
        {
            "font.family": font,
            "font.size": FONT_SIZE,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "axes.linewidth": 0.6,
            "xtick.major.width": 0.6,
            "ytick.major.width": 0.6,
            "axes.unicode_minus": False,
            "savefig.dpi": 300,
        }
    )


def correlation_figure(rows: list[Correlation]) -> Figure:
    fig, ax = plt.subplots(figsize=(WIDTH, 62 * MM))
    labels = []
    y = 0.0
    for exposure, title in EXPOSURES.items():
        labels.append((y, title, True))
        y -= 1
        for row in (r for r in rows if r.exposure == exposure):
            color = DIMENSION_COLOR[row.dimension]
            ax.plot([row.low, row.high], [y, y], color=color, lw=1.4)
            ax.plot(row.r, y, "o", color=color, ms=4.5)
            ax.annotate(
                f"{row.r:+.2f}".replace("-", "−"),
                (row.high, y),
                xytext=(4, 0),
                textcoords="offset points",
                va="center",
                fontsize=FONT_SIZE - 2,
            )
            labels.append((y, DIMENSIONS[row.dimension], False))
            y -= 1
        y -= 0.4
    ax.axvline(0, color="black", lw=0.8)
    ax.set_yticks([p for p, _, _ in labels])
    ax.set_yticklabels([t for _, t, _ in labels])
    for tick, (_, _, header) in zip(ax.get_yticklabels(), labels):
        if header:
            tick.set_fontweight("bold")
    ax.tick_params(axis="y", length=0)
    ax.spines["left"].set_visible(False)
    ax.set_xlim(-0.4, 0.5)
    ax.set_xticks([-0.4, -0.2, 0, 0.2, 0.4])
    ax.set_xticklabels(["−0.4", "−0.2", "0", "0.2", "0.4"])
    ax.set_xlabel("ค่าสหสัมพันธ์ r และช่วงความเชื่อมั่น 95%")
    ax.grid(axis="x", color="#dddddd", lw=0.5)
    ax.set_axisbelow(True)
    fig.tight_layout(pad=0.3)
    return fig


def finance_figure(rows: list[GroupMean]) -> Figure:
    fig, ax = plt.subplots(figsize=(WIDTH, 58 * MM))
    bar = 0.26
    centers = np.arange(len(DIMENSIONS))
    for i, (group, (label, color)) in enumerate(FINANCE_GROUPS.items()):
        values = [r for r in rows if r.group == group]
        n = values[0].n
        x = centers + (i - 1) * bar
        means = [r.mean for r in values]
        ax.bar(
            x,
            means,
            bar * 0.92,
            yerr=[r.se for r in values],
            color=color,
            error_kw={"elinewidth": 0.7, "capsize": 1.8, "ecolor": "#444444"},
            label=f"{label} (n = {n})",
        )
        for xi, m, r in zip(x, means, values):
            ax.text(
                xi,
                m + r.se + 0.4,
                f"{m:.1f}",
                ha="center",
                va="bottom",
                fontsize=FONT_SIZE - 3,
            )
    ax.set_xticks(centers)
    ax.set_xticklabels(DIMENSIONS.values())
    ax.set_ylabel("คะแนนเฉลี่ย (0–42)")
    ax.set_ylim(0, 24)
    ax.grid(axis="y", color="#dddddd", lw=0.5)
    ax.set_axisbelow(True)
    fig.legend(
        frameon=False,
        fontsize=FONT_SIZE - 2,
        ncol=3,
        loc="upper center",
        handlelength=1,
        columnspacing=0.8,
        handletextpad=0.4,
    )
    fig.tight_layout(pad=0.3, rect=(0, 0, 1, 0.9))
    return fig


def main() -> None:
    df = passed_attention(pd.read_csv(DATA))
    style(thai_font())
    OUT.mkdir(exist_ok=True)

    rows = correlations(df)
    for r in rows:
        print(f"{r.exposure:20} {r.dimension:16} r={r.r:+.3f} CI [{r.low:+.3f}, {r.high:+.3f}]")
    correlation_figure(rows).savefig(OUT / "fig-correlation.png")

    means = finance_means(df)
    for m in means:
        print(f"{m.dimension:16} {m.group:5} n={m.n:3} mean={m.mean:5.2f} se={m.se:4.2f}")
    finance_figure(means).savefig(OUT / "fig-finance.png")

    print(f"n = {len(df)}; figures in {OUT}")


if __name__ == "__main__":
    main()
