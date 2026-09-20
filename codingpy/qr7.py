# %%
"""Question refinement: does money change the three DASS-21 dimensions?

financial_sufficiency is a 1-10 self-rating of how far the respondent's money
goes. To see whether it moves mental health, the comparison is the same one the
assignment asks for elsewhere: split respondents into three money groups and
compare the mean subscale score of each group.

  low  1-4   money does not cover the month
  mid  5-7   just enough
  high 8-10  comfortable

The three DASS-21 subscales share one 0-42 scale, so their means can sit on a
single axis and be compared directly.

Each dimension gets a one-way ANOVA across the three groups (with Kruskal-Wallis
as the rank check), eta-squared for the size of the gap, and a Pearson r against
the raw 1-10 rating so nothing is lost to the grouping. The same r for social
media hours is printed beside it, as the yardstick for "is money a bigger
correlate than screen time?".

Run: python qr7.py   (writes ../figures/qr7-finance-dass-dimension.png)
"""

import matplotlib

matplotlib.use("TkAgg")  # ตัดออกได้ถ้ารันในเครื่องตัวเอง
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from clean_data import CLEAN_PATH
from config import load_data, setup
from qr2 import DIMENSIONS, thai_font
from rich_console import console
from scipy import stats

ALPHA = 0.05
FINANCE = "financial_sufficiency"
BENCHMARK = "social_media_hours"  # the correlate qr2.py measured, for scale

# 1-10 self-rating cut into three money groups
GROUP_EDGES = [0, 4, 7, 10]
GROUPS = ["low", "mid", "high"]

# money level is ordered, so it gets one hue light -> dark, not three hues
COLOR = {"low": "#86b6ef", "mid": "#2a78d6", "high": "#104281"}

# Thai labels: the proposal body is Thai, so the figure is too
DIMENSION_TH = {
    "Depression": "ซึมเศร้า",
    "Anxiety": "วิตกกังวล",
    "Stress": "ความเครียด",
}
GROUP_TH = {
    "low": "เงินไม่พอใช้ (1-4)",
    "mid": "พอใช้ (5-7)",
    "high": "สบาย (8-10)",
}

TITLE_SIZE = 21
TITLES = {
    "title": "สภาพการเงินเปลี่ยนคะแนน DASS-21 ทั้งสามมิติหรือไม่",
    "subtitle": "เทียบคะแนนเฉลี่ยของกลุ่มเงินไม่พอ พอใช้ และสบาย — ซึมเศร้าต่างกันมากที่สุด",
}

FIG_PATH = "../figures/qr7-finance-dass-dimension.png"


def money_group(df: pd.DataFrame) -> pd.Series:
    """The 1-10 rating cut into low / mid / high, as an ordered category."""
    return pd.cut(df[FINANCE], bins=GROUP_EDGES, labels=GROUPS, ordered=True)


def eta_squared(groups: list[np.ndarray]) -> float:
    """Share of the total variance that lies between the groups."""
    everyone = np.concatenate(groups)
    ss_between = sum(len(g) * (g.mean() - everyone.mean()) ** 2 for g in groups)
    ss_total = ((everyone - everyone.mean()) ** 2).sum()
    return float(ss_between / ss_total)


def cohens_d(a: np.ndarray, b: np.ndarray) -> float:
    """Pooled-SD effect size for the low-money vs high-money gap."""
    sp = np.sqrt(
        ((len(a) - 1) * a.var(ddof=1) + (len(b) - 1) * b.var(ddof=1))
        / (len(a) + len(b) - 2)
    )
    return float((a.mean() - b.mean()) / sp)


def dimension_stats(df: pd.DataFrame) -> pd.DataFrame:
    """One row per dimension: group means, ANOVA, eta^2, and both correlations."""
    group = money_group(df)
    rows = []
    for col, dimension in DIMENSIONS.items():
        d = df[[col, FINANCE, BENCHMARK]].assign(group=group).dropna(subset=[col, "group"])
        parts = [d.loc[d["group"] == name, col].to_numpy(dtype=float) for name in GROUPS]
        F, p = stats.f_oneway(*parts)
        kw = stats.kruskal(*parts)
        money = d[[col, FINANCE]].dropna()
        screen = d[[col, BENCHMARK]].dropna()
        rows.append(
            {
                "dimension": dimension,
                **{f"mean_{name}": part.mean() for name, part in zip(GROUPS, parts)},
                **{f"se_{name}": part.std(ddof=1) / np.sqrt(len(part)) for name, part in zip(GROUPS, parts)},
                **{f"n_{name}": len(part) for name, part in zip(GROUPS, parts)},
                "F": F,
                "p": p,
                "kruskal_p": kw.pvalue,
                "eta2": eta_squared(parts),
                "d_low_high": cohens_d(parts[0], parts[2]),
                "r_money": stats.pearsonr(money[col], money[FINANCE]).statistic,
                "p_money": stats.pearsonr(money[col], money[FINANCE]).pvalue,
                "r_screen": stats.pearsonr(screen[col], screen[BENCHMARK]).statistic,
            }
        )
    return pd.DataFrame(rows)


def report(table: pd.DataFrame) -> None:
    for row in table.itertuples():
        verdict = "reject H0" if float(row.p) < ALPHA else "fail to reject H0"
        console.print(
            f"\n[bold cyan]{row.dimension}[/bold cyan]  "
            f"low {row.mean_low:.1f} (n = {row.n_low})  "
            f"mid {row.mean_mid:.1f} (n = {row.n_mid})  "
            f"high {row.mean_high:.1f} (n = {row.n_high})"
        )
        console.print(
            f"  one-way ANOVA F(2, {row.n_low + row.n_mid + row.n_high - 3}) = {row.F:.2f}, "
            f"p = {row.p:.4f} -> {verdict}; Kruskal-Wallis p = {row.kruskal_p:.4f}"
        )
        console.print(
            f"  eta^2 = {row.eta2:.3f}, low vs high Cohen's d = {row.d_low_high:+.2f}; "
            f"r with the raw 1-10 rating = {row.r_money:+.3f} (p = {row.p_money:.4f}), "
            f"against r = {row.r_screen:+.3f} for social media hours"
        )
    biggest = table.loc[table["eta2"].idxmax()]
    console.print(
        f"\n[bold]largest gap:[/bold] {biggest.dimension} "
        f"(eta^2 = {biggest.eta2:.3f}, low - high = "
        f"{biggest.mean_low - biggest.mean_high:.1f} points)"
    )


# %%
def plot(table: pd.DataFrame) -> None:
    """Three clusters, one per dimension; three bars each, one per money group."""
    plt.rcParams["font.family"] = thai_font()

    fig, ax = plt.subplots(figsize=(10.5, 6.4))
    width = 0.26
    x = np.arange(len(table))

    for offset, name in zip((-width, 0.0, width), GROUPS):
        means = table[f"mean_{name}"].to_numpy()
        errs = table[f"se_{name}"].to_numpy()
        ax.bar(
            x + offset,
            means,
            width=width * 0.92,  # the gap keeps neighbouring bars apart
            color=COLOR[name],
            label=GROUP_TH[name],
            zorder=2,
        )
        ax.errorbar(
            x + offset,
            means,
            yerr=errs,
            fmt="none",
            ecolor="#52514e",
            elinewidth=1.5,
            capsize=4,
            zorder=3,
        )
        for xi, mean, err in zip(x + offset, means, errs):
            ax.annotate(  # above the whisker, not on it
                f"{mean:.1f}",
                (xi, mean + err),
                textcoords="offset points",
                xytext=(0, 12),
                ha="center",
                fontsize=12,
                color="#0b0b0b",
            )

    # p-value per dimension, written above its cluster
    top = max(table[f"mean_{name}"].max() for name in GROUPS)
    for xi, row in zip(x, table.itertuples()):
        mark = "ต่างกันอย่างมีนัยสำคัญ" if float(row.p) < ALPHA else "ไม่ต่างกัน"
        shown = "p < 0.001" if float(row.p) < 0.001 else f"p = {row.p:.3f}"
        ax.annotate(
            f"{mark}  ({shown})",
            (xi, top + 4.6),
            ha="center",
            fontsize=12,
            color="#0b0b0b" if float(row.p) < ALPHA else "#52514e",
        )

    ax.set_xticks(x)
    ax.set_xticklabels([DIMENSION_TH[d] for d in table["dimension"]], fontsize=15)
    ax.set_ylim(0, top + 7.5)
    ax.set_ylabel("คะแนนเฉลี่ย DASS-21 (0-42 คะแนน)", fontsize=13)
    ax.grid(axis="y", color="#e5e4e0", linewidth=0.8)
    ax.set_axisbelow(True)
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)

    ax.set_title(TITLES["title"], loc="left", fontsize=TITLE_SIZE, pad=34)
    ax.annotate(
        TITLES["subtitle"],
        (0.0, 1.04),
        xycoords="axes fraction",
        fontsize=13,
        color="#52514e",
    )
    # legend under the axis: the top of the plot belongs to the p-value line
    ax.legend(
        title="สภาพการเงิน",
        loc="upper center",
        bbox_to_anchor=(0.5, -0.09),
        ncol=3,
        fontsize=12,
        title_fontsize=12,
        frameon=False,
    )

    total = int(sum(table.iloc[0][f"n_{name}"] for name in GROUPS))
    fig.tight_layout(rect=(0, 0.05, 1, 1))
    fig.text(
        0.012,
        0.02,
        "เส้นบนแท่งคือค่าคลาดเคลื่อนมาตรฐาน คะแนนยิ่งสูงยิ่งมีอาการมาก  "
        f"(n = {total} คน แบ่งเป็น "
        + ", ".join(f"{GROUP_TH[name]} {int(table.iloc[0][f'n_{name}'])}" for name in GROUPS)
        + ")",
        fontsize=12,
        color="#52514e",
    )
    fig.savefig(FIG_PATH, dpi=200, facecolor="white")
    console.print(f"[green]saved:[/green] {FIG_PATH}")
    plt.show()


# %%
if __name__ == "__main__":
    setup()
    df = load_data(CLEAN_PATH)
    console.print(f"[green]n = {len(df)}[/green] rows from {CLEAN_PATH}")
    table = dimension_stats(df)
    report(table)
    plot(table)
