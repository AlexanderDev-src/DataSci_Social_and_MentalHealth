# %%
"""Export the summary statistics the presentation site needs, and nothing else.

The site in ../Website_for_presentation/ draws its charts from this file. It holds only
aggregates (correlations, regression coefficients, histogram counts), never a
respondent's row, so it can be committed while data/ stays out of git.

Run: python export_presentation.py   (writes ../Website_for_presentation/src/data/generated/aggregates.json)
"""

import json
import pathlib

import numpy as np
import pandas as pd
import statsmodels.formula.api as smf
from clean_data import CLEAN_PATH
from config import load_data, passed_attention, setup
from scipy import stats

OUT_PATH = pathlib.Path("../Website_for_presentation/src/data/generated/aggregates.json")

DIMENSIONS = {
    "dass_depression": "depression",
    "dass_anxiety": "anxiety",
    "dass_stress": "stress",
}

# same order and split as q6_regression.ipynb
EXPOSURES = ["social_media_hours", "news_days"]
CONTROLS = [
    "sleep_hours",
    "sleep_quality",
    "exercise_days",
    "study_pressure",
    "GPA",
    "financial_sufficiency",
]
PREDICTORS = EXPOSURES + CONTROLS


def fisher_ci(r: float, n: int) -> tuple[float, float]:
    """95% CI of Pearson r through the Fisher z transform."""
    z = np.arctanh(r)
    half = stats.norm.ppf(0.975) / np.sqrt(n - 3)
    return float(np.tanh(z - half)), float(np.tanh(z + half))


def correlations(df: pd.DataFrame) -> list[dict]:
    """Pearson r of every predictor with every dimension, pairwise complete."""
    rows = []
    for x in PREDICTORS:
        for col, dim in DIMENSIONS.items():
            pair = df[[x, col]].dropna()
            r, p = stats.pearsonr(pair[x], pair[col])
            low, high = fisher_ci(r, len(pair))
            rows.append(
                {
                    "predictor": x,
                    "dimension": dim,
                    "r": round(float(r), 4),
                    "p": round(float(p), 4),
                    "ciLow": round(low, 4),
                    "ciHigh": round(high, 4),
                    "n": len(pair),
                }
            )
    return rows


def formula(y: str, xs: list[str]) -> str:
    return f"{y} ~ " + " + ".join(xs)


def regression(df: pd.DataFrame) -> dict:
    """Block 1 (controls) and block 2 (all eight) per dimension, HC3 errors as in chapter 4."""
    data = df[PREDICTORS + list(DIMENSIONS)].dropna().reset_index(drop=True)
    models = {}
    for col, dim in DIMENSIONS.items():
        reduced = smf.ols(formula(col, CONTROLS), data=data).fit()
        full = smf.ols(formula(col, PREDICTORS), data=data).fit(cov_type="HC3")
        ci = full.conf_int()
        # HC3 covariance of [Intercept, *PREDICTORS]; the site turns it into the CI of a prediction
        cov = full.cov_params().loc[["Intercept", *PREDICTORS], ["Intercept", *PREDICTORS]]
        models[dim] = {
            "intercept": round(float(full.params["Intercept"]), 4),
            "r2Block1": round(float(reduced.rsquared), 4),
            "r2": round(float(full.rsquared), 4),
            "coefficients": [
                {
                    "predictor": x,
                    "b": round(float(full.params[x]), 4),
                    "se": round(float(full.bse[x]), 4),
                    "ciLow": round(float(ci.loc[x, 0]), 4),
                    "ciHigh": round(float(ci.loc[x, 1]), 4),
                    "p": round(float(full.pvalues[x]), 4),
                }
                for x in PREDICTORS
            ],
            "covariance": [[round(float(v), 8) for v in row] for row in cov.to_numpy()],
        }
    ranges = [
        {
            "predictor": x,
            "mean": round(float(data[x].mean()), 4),
            "min": float(data[x].min()),
            "max": float(data[x].max()),
        }
        for x in PREDICTORS
    ]
    return {"n": len(data), "predictors": ranges, "models": models}


def hours_histogram(df: pd.DataFrame) -> list[dict]:
    """Respondents per one-hour band of daily social media use."""
    hours = df["social_media_hours"].dropna()
    edges = np.arange(np.floor(hours.min()), np.ceil(hours.max()) + 1)
    counts, _ = np.histogram(hours, bins=edges)
    return [
        {"from": float(a), "to": float(b), "count": int(c)}
        for a, b, c in zip(edges[:-1], edges[1:], counts)
    ]


def last_digit_share(df: pd.DataFrame) -> dict:
    """Share of hours answers by first decimal digit; people favour .0 and .5."""
    hours = df["social_media_hours"].dropna()
    digit = (np.round(hours * 10) % 10).astype(int)
    share = digit.value_counts(normalize=True).reindex(range(10), fill_value=0.0)
    return {str(d): round(float(s), 4) for d, s in share.items()}


def main() -> None:
    setup()
    raw = load_data(CLEAN_PATH)
    passed = passed_attention(raw)

    aggregates = {
        "source": "codingpy/export_presentation.py",
        "sample": {"responses": len(raw), "passed": len(passed)},
        "correlations": {"passed": correlations(passed), "all": correlations(raw)},
        "regression": regression(passed),
        "hoursHistogram": hours_histogram(passed),
        "hoursDecimalDigit": last_digit_share(passed),
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(aggregates, ensure_ascii=False, indent=2) + "\n")
    print(f"saved: {OUT_PATH}")


if __name__ == "__main__":
    main()
