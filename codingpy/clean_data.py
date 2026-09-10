# %%
"""Turn the raw survey export into a numeric table for analysis.

Free-text answers such as "8.5 ชั่วโมง", "6-7 ชม." or "ปี 2" are reduced to a
single number: every number found in the cell is extracted and averaged, so a
range like "10-12" becomes 11. Values outside a plausible range are dropped to
NaN instead of silently skewing the statistics.
"""

import pathlib
import re

import labels
import numpy as np
import pandas as pd
from config import DATA_PATH, setup
from rich_console import console, print_df

CLEAN_PATH = "data/data_clean.csv"
SPSS_PATH = "data/data_clean_spss.csv"
CODEBOOK_PATH = "data/spss_codebook.csv"
SPSS_SYNTAX_PATH = "data/spss_value_labels.sps"

NUMBER = re.compile(r"\d+(?:\.\d+)?")

TIMESTAMP = "ประทับเวลา"

ATTENTION = "attention_check"

# column -> (low, high) accepted range; anything else becomes NaN
RANGES = {
    "age": (15, 60),
    "year_of_study": (1, 8),
    "social_media_hours": (0, 24),
    "news_days": (0, 7),
    "sleep_hours": (0, 24),
    "exercise_days": (0, 7),
    "sleep_quality": (1, 10),
    "study_pressure": (1, 10),
    "GPA": (0, 4),
    "financial_sufficiency": (1, 10),
}

CATEGORICAL = ["gender", "faculty", "main_platform", "content_type"]

# the export misspells three headers; fix them before anything else reads them
RENAME = {
    "main_platfrom": "main_platform",
    "sleep_hour": "sleep_hours",
    "exersice_days": "exercise_days",
}

# the attention-check item asks the respondent to pick option 3
ATTENTION_ANSWER = "ไม่ค่อยตรงกับฉัน"


def to_number(value) -> float:
    """Mean of every number in the cell; NaN when the cell holds none."""
    if pd.isna(value):
        return np.nan
    # "2,94" is a comma used as a decimal point, not two numbers
    text = re.sub(r"(?<=\d),(?=\d)", ".", str(value))
    found = NUMBER.findall(text)
    if not found:
        return np.nan
    return float(np.mean([float(n) for n in found]))


def clip_to_range(s: pd.Series, low: float, high: float) -> pd.Series:
    """NaN out values that cannot be real answers (typos such as 210 hours)."""
    return s.where(s.between(low, high))


def clean(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy().rename(columns=RENAME)

    # the 21 DASS items are the numbered Thai questions; give them short names
    dass = [c for c in out.columns if re.match(r"^\d+\.\s", str(c))]
    out = out.rename(columns={c: f"dass_{c.split('.', 1)[0]}" for c in dass})
    dass = [f"dass_{c.split('.', 1)[0]}" for c in dass]

    # attention check -> 1 when the respondent picked the requested option
    check = [c for c in out.columns if ATTENTION_ANSWER in str(c)]
    if check:
        out[ATTENTION] = (
            out[check[0]].astype(str).str.strip() == ATTENTION_ANSWER
        ).astype(int)
        out = out.drop(columns=check)

    for col in list(RANGES) + dass:
        if col not in out.columns:
            continue
        out[col] = out[col].map(to_number)

    for col, (low, high) in RANGES.items():
        if col in out.columns:
            out[col] = clip_to_range(out[col], low, high)
    for col in dass:
        out[col] = clip_to_range(out[col], 0, 3)

    # DASS-21 subscale and total scores (x2 is the standard scoring)
    groups = {
        "dass_depression": [3, 5, 10, 13, 16, 17, 21],
        "dass_anxiety": [2, 4, 7, 9, 15, 19, 20],
        "dass_stress": [1, 6, 8, 11, 12, 14, 18],
    }
    for name, items in groups.items():
        cols = [f"dass_{i}" for i in items if f"dass_{i}" in out.columns]
        out[name] = out[cols].sum(axis=1, min_count=len(cols)) * 2
    out["dass_total"] = out[list(groups)].sum(axis=1, min_count=len(groups))

    # free-text metadata that carries no analysable value
    drop = [c for c in out.columns if c == TIMESTAMP or str(c).startswith("คอลัมน์")]
    drop += [c for c in out.columns if "ยินยอม" in str(c) or "ข้อมูลที่สอบถาม" in str(c)]
    out = out.drop(columns=drop)

    for col in CATEGORICAL:
        if col in out.columns:
            out[col] = (
                out[col]
                .astype(str)
                .str.strip()
                .replace({"": np.nan, "-": np.nan, "_": np.nan})
            )

    return labels.to_english(out)


def report(raw: pd.DataFrame, out: pd.DataFrame) -> None:
    """Show which cells the cleaner could not turn into a usable number."""
    rows = []
    for col in RANGES:
        if col not in raw.columns:
            continue
        lost = raw[col][out[col].isna() & raw[col].notna()]
        for i, v in lost.items():
            rows.append({"row": i, "column": col, "raw_value": v})
    if rows:
        print_df(pd.DataFrame(rows), rows=50, title="dropped values")
    else:
        console.print("[green]no values dropped[/green]")


# %%
if __name__ == "__main__":
    setup()
    raw = pd.read_csv(DATA_PATH).rename(columns=RENAME)
    out = clean(raw)
    out.to_csv(CLEAN_PATH, index=False)
    console.print(
        f"[green]cleaned:[/green] {out.shape[0]} rows x {out.shape[1]} columns "
        f"-> {CLEAN_PATH}"
    )

    # SPSS reads numbers, not words: same rows with every category coded 1..k
    spss = labels.to_codes(out)
    spss.to_csv(SPSS_PATH, index=False)
    labels.codebook().to_csv(CODEBOOK_PATH, index=False)
    pathlib.Path(SPSS_SYNTAX_PATH).write_text(
        labels.spss_value_labels(), encoding="utf-8"
    )
    console.print(
        f"[green]spss:[/green] {spss.shape[0]} rows x {spss.shape[1]} columns "
        f"-> {SPSS_PATH} (codes in {CODEBOOK_PATH}, syntax in {SPSS_SYNTAX_PATH})"
    )

    left = [
        c
        for c in out.columns
        if out[c].astype(str).str.contains(r"[\u0E00-\u0E7F]", regex=True).any()
    ]
    if left:
        console.print(f"[red]still Thai:[/red] {left}")

    report(raw, out)
    print_df(out[list(RANGES)], rows=150, title="numeric columns")
