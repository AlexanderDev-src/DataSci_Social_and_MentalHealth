# %%
"""Reliability of the Thai DASS-21: Cronbach's alpha for each dimension.

The proposal promised to report alpha for all three dimensions from our own
data, because the scale was validated on other groups (Thai nursing students,
Ethiopian university students) and not on this sample.

For every dimension this prints alpha with a percentile bootstrap 95% CI, then
one row per item: the corrected item-total r (the item against the sum of the
other six) and alpha if that item were dropped. A weak item shows up as a low r
and an alpha that rises when it is removed. The last table is the correlation
between the three dimension scores; a very high value would mean the three
dimensions do not separate well in this sample.

Run: python reliability.py
"""

import numpy as np
import pandas as pd
from clean_data import CLEAN_PATH
from config import SEED, load_data, passed_attention, setup
from qr2 import DIMENSIONS
from rich_console import console, print_df

N_BOOT = 5000
CUTOFF = 0.70  # the usual "acceptable" line for alpha

# item numbers as printed on the form; same split as clean_data.py
ITEMS = {
    "dass_depression": [3, 5, 10, 13, 16, 17, 21],
    "dass_anxiety": [2, 4, 7, 9, 15, 19, 20],
    "dass_stress": [1, 6, 8, 11, 12, 14, 18],
}


def cronbach_alpha(x: np.ndarray) -> float:
    """Alpha for an n-respondents x k-items array."""
    k = x.shape[1]
    item_var = x.var(axis=0, ddof=1).sum()
    total_var = x.sum(axis=1).var(ddof=1)
    return k / (k - 1) * (1 - item_var / total_var)


def bootstrap_ci(x: np.ndarray, rng: np.random.Generator) -> tuple[float, float]:
    boots = [cronbach_alpha(x[rng.integers(0, len(x), len(x))]) for _ in range(N_BOOT)]
    low, high = np.percentile(boots, [2.5, 97.5])
    return low, high


def item_table(x: np.ndarray, items: list[int]) -> pd.DataFrame:
    rows = []
    for j, item in enumerate(items):
        rest = np.delete(x, j, axis=1)
        rows.append(
            {
                "item": item,
                "item-total r": np.corrcoef(x[:, j], rest.sum(axis=1))[0, 1],
                "alpha if deleted": cronbach_alpha(rest),
            }
        )
    return pd.DataFrame(rows).round(3)


def report(df: pd.DataFrame) -> None:
    rng = np.random.default_rng(SEED)
    scales = {**{col: ITEMS[col] for col in DIMENSIONS}, "dass_total": range(1, 22)}
    for col, items in scales.items():
        x = df[[f"dass_{i}" for i in items]].dropna().to_numpy(dtype=float)
        alpha = cronbach_alpha(x)
        low, high = bootstrap_ci(x, rng)
        name = DIMENSIONS.get(col, "Total (21 items)")
        verdict = "acceptable" if alpha >= CUTOFF else "below 0.70"
        console.print(
            f"\n{name:<17} alpha = {alpha:.3f}  [95% CI {low:.3f}, {high:.3f}]  "
            f"n = {len(x)}, k = {x.shape[1]} -> {verdict}"
        )
        if col in ITEMS:
            print_df(item_table(x, ITEMS[col]))

    console.print("\ncorrelation between the dimension scores (Pearson):")
    print_df(df[list(DIMENSIONS)].corr().round(2), index=True)


# %%
if __name__ == "__main__":
    setup()
    df = passed_attention(load_data(CLEAN_PATH))
    console.print(f"[green]n = {len(df)}[/green] rows from {CLEAN_PATH}")
    report(df)
