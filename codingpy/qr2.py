# %%
"""Question refinement: which DASS-21 dimension is social media tied to?

The proposal asks about "mental health" as one lump. DASS-21 measures three
separate dimensions, so the question only becomes testable once we say which
one social media is supposed to touch: depression, anxiety or stress.

Two exposure measures are compared against all three dimensions:

  social_media_hours  how much  (self-reported hours per day)
  news_days           what kind (days per week spent on news content)

Each cell is a Pearson r with a percentile bootstrap 95% CI, plus a partial r
that holds sleep, sleep quality, study pressure, GPA and financial sufficiency
fixed, so a correlation that is only a sleep-deprivation echo shows up as a
partial r that collapses toward zero.

Run: python qr2.py   (writes ../figures/qr2-social-media-dass-dimension.png)
"""

import matplotlib

matplotlib.use("TkAgg")  # ตัดออกได้ถ้ารันในเครื่องตัวเอง
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from clean_data import CLEAN_PATH
from config import SEED, load_data, setup
from rich_console import console
from scipy import stats

DIMENSIONS = {
    "dass_depression": "Depression",
    "dass_anxiety": "Anxiety",
    "dass_stress": "Stress",
}

EXPOSURES = {
    "social_media_hours": "Daily use (hours/day)",
    "news_days": "News content (days/week)",
}

# confounders held fixed in the partial correlation
CONTROLS = [
    "sleep_hours",
    "sleep_quality",
    "study_pressure",
    "GPA",
    "financial_sufficiency",
]

# categorical slots 1-3, one per dimension; every bar is also labelled with its
# value, so the three are never told apart by color alone
COLOR = {
    "Depression": "#2a78d6",
    "Anxiety": "#eb6834",
    "Stress": "#1baf7a",
}

N_BOOT = 5000
FIG_PATH = "../figures/qr2-social-media-dass-dimension.png"

# Thai text on the figure, in the same face main.tex sets for the document body.
# TH Sarabun New is small on the metric, hence the size bumps.
THAI_FONTS = ("TH Sarabun New", "Sarabun", "Noto Sans Thai", "Garuda")
TITLE_SIZE = 21
TITLES = {
    "title": "โซเชียลมีเดียเกี่ยวข้องกับมิติใดของ DASS-21",
    "subtitle": "จำนวนชั่วโมงที่ใช้ไม่สัมพันธ์กับมิติใดเลย มีเพียงการเสพข่าวที่สัมพันธ์กับความวิตกกังวล",
}


def thai_font() -> str:
    """First installed font from THAI_FONTS; Thai text needs one or it prints boxes."""
    from matplotlib import font_manager

    installed = {f.name for f in font_manager.fontManager.ttflist}
    for name in THAI_FONTS:
        if name in installed:
            return name

    # matplotlib's font cache can miss a directory fontconfig knows about
    # (TH Sarabun New ships in /usr/share/fonts/SIPA), so rescan and register
    for path in font_manager.findSystemFonts():
        try:
            family = font_manager.FontProperties(fname=path).get_name()
        except (RuntimeError, OSError):
            continue
        if family in THAI_FONTS:
            font_manager.fontManager.addfont(path)
            return family

    console.print("[yellow]no Thai font found; Thai text will render as boxes[/yellow]")
    return str(plt.rcParams["font.family"][0])


def residuals(y: np.ndarray, controls: pd.DataFrame) -> np.ndarray:
    """What is left of y once the control columns have explained what they can."""
    X = np.column_stack([np.ones(len(controls)), controls.to_numpy(dtype=float)])
    beta, *_ = np.linalg.lstsq(X, y, rcond=None)
    return y - X @ beta


def partial_r(df: pd.DataFrame, x_col: str, y_col: str) -> tuple[float, float, int]:
    """Pearson r between x and y after both are regressed on CONTROLS."""
    d = df[[x_col, y_col] + CONTROLS].dropna()
    x = residuals(d[x_col].to_numpy(dtype=float), d[CONTROLS])
    y = residuals(d[y_col].to_numpy(dtype=float), d[CONTROLS])
    # two control-fitting steps cost 2 df, so the p-value is taken from t with
    # n - len(CONTROLS) - 2 df rather than from stats.pearsonr's n - 2
    r = float(np.corrcoef(x, y)[0, 1])
    dof = len(d) - len(CONTROLS) - 2
    t = r * np.sqrt(dof / max(1 - r**2, 1e-12))
    return r, float(2 * stats.t.sf(abs(t), dof)), len(d)


def boot_ci(x: np.ndarray, y: np.ndarray, rng: np.random.Generator) -> tuple[float, float]:
    """Percentile bootstrap 95% CI for Pearson r, resampling respondents in pairs."""
    idx = rng.integers(0, len(x), size=(N_BOOT, len(x)))
    draws = np.array([np.corrcoef(x[i], y[i])[0, 1] for i in idx])
    return tuple(np.percentile(draws[np.isfinite(draws)], [2.5, 97.5]))


def correlation_table(df: pd.DataFrame) -> pd.DataFrame:
    """One row per exposure x dimension pair: raw r with CI, partial r, n."""
    rng = np.random.default_rng(SEED)
    rows = []
    for x_col, x_label in EXPOSURES.items():
        for y_col, y_label in DIMENSIONS.items():
            d = df[[x_col, y_col]].dropna()
            x = d[x_col].to_numpy(dtype=float)
            y = d[y_col].to_numpy(dtype=float)
            r, p = stats.pearsonr(x, y)
            lo, hi = boot_ci(x, y, rng)
            pr, pp, pn = partial_r(df, x_col, y_col)
            rows.append(
                {
                    "exposure": x_label,
                    "dimension": y_label,
                    "n": len(d),
                    "r": r,
                    "ci_low": lo,
                    "ci_high": hi,
                    "p": p,
                    "partial_r": pr,
                    "partial_p": pp,
                    "partial_n": pn,
                    "rho": stats.spearmanr(x, y).statistic,
                }
            )
    return pd.DataFrame(rows)


def report(table: pd.DataFrame) -> None:
    for row in table.itertuples():
        star = "*" if float(row.p) < 0.05 else " "
        console.print(
            f"[green]{row.exposure:<26}[/green] {row.dimension:<11} "
            f"n = {row.n:>3}  r = {row.r:+.3f} {star} "
            f"[95% CI {row.ci_low:+.3f}, {row.ci_high:+.3f}]  p = {row.p:.3f}  "
            f"rho = {row.rho:+.3f}  partial r = {row.partial_r:+.3f} (p = {row.partial_p:.3f})"
        )
    hours = table[table["exposure"] == EXPOSURES["social_media_hours"]]
    strongest = table.loc[table["r"].abs().idxmax()]
    console.print(
        f"\n[bold]largest |r| overall:[/bold] {strongest.exposure} x {strongest.dimension} "
        f"(r = {strongest.r:+.3f}, p = {strongest.p:.3f})"
    )
    if (hours["p"] >= 0.05).all():
        console.print(
            "[yellow]none of the three dimensions separates on hours of use[/yellow] — "
            "every CI covers 0, so the refined question should name the content type, "
            "not the amount"
        )


# %%
# Thai labels for the figure: the proposal body is Thai, so the chart is too
DIMENSION_TH = {
    "Depression": "ซึมเศร้า",
    "Anxiety": "วิตกกังวล",
    "Stress": "ความเครียด",
}
EXPOSURE_TH = {
    "Daily use (hours/day)": "ใช้โซเชียลกี่ชั่วโมงต่อวัน",
    "News content (days/week)": "เสพข่าวกี่วันต่อสัปดาห์",
}


def plot(table: pd.DataFrame) -> None:
    """One bar per exposure x dimension pair: bar length = r, whisker = 95% CI."""
    plt.rcParams["font.family"] = thai_font()

    fig, ax = plt.subplots(figsize=(10.5, 6.2))

    # rows top to bottom, one blank slot between the two exposure blocks
    rows = []
    y = 0.0
    for block, exposure in enumerate(EXPOSURES.values()):
        if block:
            y -= 1.0
        for dimension in DIMENSIONS.values():
            rows.append((exposure, dimension, y))
            y -= 1.0

    for exposure, dimension, y in rows:
        row = table[
            (table["exposure"] == exposure) & (table["dimension"] == dimension)
        ].iloc[0]
        color = COLOR[dimension]
        significant = row["p"] < 0.05

        ax.barh(
            y,
            row["r"],
            height=0.55,
            color=color,
            alpha=1.0 if significant else 0.45,
            zorder=2,
        )
        ax.plot(
            [row["ci_low"], row["ci_high"]],
            [y, y],
            color="#52514e",
            linewidth=1.5,
            zorder=3,
        )
        # value written out: the reader should not have to measure a bar
        side = 8 if row["r"] >= 0 else -8
        ax.annotate(
            f"r = {row['r']:+.2f}   p = {row['p']:.2f}",
            (max(row["ci_high"], row["r"]) if row["r"] >= 0 else min(row["ci_low"], row["r"]), y),
            textcoords="offset points",
            xytext=(side, 0),
            ha="left" if row["r"] >= 0 else "right",
            va="center",
            fontsize=11,
            color="#0b0b0b" if significant else "#52514e",
        )

    ax.axvline(0, color="#0b0b0b", linewidth=1.5, zorder=4)
    ax.set_yticks([y for _, _, y in rows])
    ax.set_yticklabels([DIMENSION_TH[d] for _, d, _ in rows], fontsize=13)
    ax.set_ylim(min(y for _, _, y in rows) - 1.0, max(y for _, _, y in rows) + 1.1)
    ax.set_xlim(-0.45, 0.55)
    ax.set_xticks(np.arange(-0.4, 0.55, 0.2))
    ax.set_xlabel(
        "ค่าสหสัมพันธ์ r — ยิ่งแท่งยาวออกจากเส้น 0 ยิ่งสัมพันธ์กันมาก",
        fontsize=13,
        labelpad=10,
    )
    ax.grid(axis="x", color="#e5e4e0", linewidth=0.8)
    ax.set_axisbelow(True)
    for spine in ("top", "right", "left"):
        ax.spines[spine].set_visible(False)

    # block headings stand in for a second axis
    for exposure in EXPOSURES.values():
        ys = [y for e, _, y in rows if e == exposure]
        ax.annotate(
            EXPOSURE_TH[exposure],
            (-0.44, max(ys) + 0.6),
            fontsize=14,
            fontweight="bold",
            color="#0b0b0b",
        )

    ax.set_title(TITLES["title"], loc="left", fontsize=TITLE_SIZE, pad=34)
    ax.annotate(
        TITLES["subtitle"],
        (0.0, 1.04),
        xycoords="axes fraction",
        fontsize=13,
        color="#52514e",
    )
    fig.tight_layout(rect=(0, 0.06, 1, 1))
    # footnote on the figure, below the axis, so it cannot collide with the label
    fig.text(
        0.012,
        0.02,
        "เส้นบางคือช่วงความเชื่อมั่น 95% ถ้าเส้นคร่อมเลข 0 แปลว่ายังสรุปไม่ได้ว่ามีความสัมพันธ์จริง"
        f"   (n = {int(table['n'].max())} คน)",
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
    table = correlation_table(df)
    report(table)
    plot(table)
