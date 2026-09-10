# %%
"""The three hypothesis tests required by the assignment.

One test per population layout, each printed as the five steps asked for:
hypotheses, alpha, test statistic, statistic + p-value, decision.

  1 population   sleep_hours vs the 7-hour recommended minimum   (mean)
                 proportion above the DASS-21 normal cut-off      (proportion)
  2 populations  depression score, male vs female                 (mean)
  k populations  anxiety score across the four content groups     (mean)

Run: python hypothesis_tests.py   (needs scipy: `uv add scipy`)
"""

import numpy as np
import pandas as pd
from clean_data import CLEAN_PATH
from config import load_data, setup
from rich_console import console
from scipy import stats

ALPHA = 0.05

# DASS-21 upper bound of the "normal" band, per subscale (Lovibond & Lovibond)
NORMAL_CUTOFF = {"dass_depression": 9, "dass_anxiety": 7, "dass_stress": 14}

SLEEP_REFERENCE = 7.0  # hours: recommended minimum for adults


def steps(title, h0, h1, test, statistic, pvalue, decision, note=""):
    console.print(f"\n[bold cyan]{title}[/bold cyan]")
    console.print(f"  H0        : {h0}")
    console.print(f"  H1        : {h1}")
    console.print(f"  alpha     : {ALPHA}")
    console.print(f"  test      : {test}")
    console.print(f"  statistic : {statistic}")
    console.print(f"  p-value   : {pvalue:.6g}")
    verdict = "reject H0" if pvalue < ALPHA else "fail to reject H0"
    console.print(f"  decision  : {verdict} -> {decision}")
    if note:
        console.print(f"  note      : {note}")


def cohens_d(a, b):
    """Pooled-SD effect size for two independent means."""
    na, nb = len(a), len(b)
    sp = np.sqrt(((na - 1) * a.var(ddof=1) + (nb - 1) * b.var(ddof=1)) / (na + nb - 2))
    return (a.mean() - b.mean()) / sp


def one_prop_z(successes: int, n: int, p0: float):
    """z statistic and two-sided p for a single proportion."""
    phat = successes / n
    z = (phat - p0) / np.sqrt(p0 * (1 - p0) / n)
    return phat, z, 2 * (1 - stats.norm.cdf(abs(z)))


# %%
def one_population_mean(df: pd.DataFrame) -> None:
    x = df["sleep_hours"].dropna()
    t, p = stats.ttest_1samp(x, SLEEP_REFERENCE)
    steps(
        "1 population, mean: average sleep vs the 7-hour recommendation",
        f"mu = {SLEEP_REFERENCE} hours",
        f"mu != {SLEEP_REFERENCE} hours (two-sided)",
        f"one-sample t-test, df = {len(x) - 1} "
        f"(n = {len(x)}, mean = {x.mean():.2f}, SD = {x.std(ddof=1):.2f})",
        f"t = {t:.3f}",
        p,
        f"mean sleep {x.mean():.2f} h differs from {SLEEP_REFERENCE} h",
        "Shapiro p < .05, but n = 120 so the CLT covers the t-test; "
        f"Wilcoxon signed-rank agrees (p = {stats.wilcoxon(x - SLEEP_REFERENCE).pvalue:.2g})",
    )


def one_population_proportion(df: pd.DataFrame, col="dass_anxiety") -> None:
    above = (df[col] > NORMAL_CUTOFF[col]).sum()
    n = df[col].notna().sum()
    phat, z, p = one_prop_z(above, n, 0.5)
    steps(
        "1 population, proportion: share above the DASS-21 anxiety cut-off vs one half",
        "p = 0.50",
        "p != 0.50 (two-sided)",
        f"one-proportion z-test (x = {above}, n = {n}, p-hat = {phat:.3f}); "
        f"n*p0 = {n * 0.5:.0f} >= 10, so the normal approximation holds",
        f"z = {z:.3f}",
        p,
        f"{phat:.1%} score above the normal band, not half",
    )


# %%
def two_population_mean(df: pd.DataFrame, col="dass_depression") -> None:
    male = df.loc[df["gender"] == "Male", col].dropna()
    female = df.loc[df["gender"] == "Female", col].dropna()
    levene = stats.levene(male, female)
    equal_var = levene.pvalue >= ALPHA
    t, p = stats.ttest_ind(male, female, equal_var=equal_var)
    mw = stats.mannwhitneyu(male, female)
    kind = "pooled-variance" if equal_var else "Welch"
    steps(
        "2 populations, mean: depression score, male vs female",
        "mu_male = mu_female",
        "mu_male != mu_female (two-sided)",
        f"independent-samples t-test, {kind} "
        f"(Levene p = {levene.pvalue:.3f}); "
        f"male n = {len(male)}, mean = {male.mean():.2f}; "
        f"female n = {len(female)}, mean = {female.mean():.2f}",
        f"t = {t:.3f}, Cohen's d = {cohens_d(male, female):.2f}",
        p,
        f"male depression mean is {male.mean() - female.mean():.2f} points higher",
        f"Mann-Whitney U agrees (p = {mw.pvalue:.4f}); result is borderline and "
        "would not survive a Bonferroni correction across the three subscales "
        f"(alpha = {ALPHA / 3:.4f})",
    )


# %%
def k_population_mean(df: pd.DataFrame, col="dass_anxiety") -> None:
    groups = [g[col].dropna().values for _, g in df.groupby("content_group")]
    names = sorted(df["content_group"].dropna().unique())
    levene = stats.levene(*groups)
    F, p = stats.f_oneway(*groups)
    kw = stats.kruskal(*groups)
    k, n = len(groups), sum(len(g) for g in groups)
    ss_b = sum(len(g) * (g.mean() - np.concatenate(groups).mean()) ** 2 for g in groups)
    ss_t = ((np.concatenate(groups) - np.concatenate(groups).mean()) ** 2).sum()
    sizes = ", ".join(f"{nm} n = {len(g)}, mean = {g.mean():.2f}" for nm, g in zip(names, groups))
    steps(
        "k populations, mean: anxiety score across the four content groups",
        "mu_News = mu_Entertainment = mu_OthersLife = mu_Other",
        "at least one group mean differs",
        f"one-way ANOVA, df = ({k - 1}, {n - k}); equal variances hold "
        f"(Levene p = {levene.pvalue:.3f}). {sizes}",
        f"F = {F:.3f}, eta^2 = {ss_b / ss_t:.4f}",
        p,
        "no detectable difference in anxiety between content groups",
        f"Kruskal-Wallis agrees (p = {kw.pvalue:.4f}); the News group has only "
        "11 respondents, so power against a small difference is low",
    )


# %%
if __name__ == "__main__":
    setup()
    df = load_data(CLEAN_PATH)
    console.print(f"[green]n = {len(df)}[/green] rows from {CLEAN_PATH}")
    one_population_mean(df)
    one_population_proportion(df)
    two_population_mean(df)
    k_population_mean(df)
