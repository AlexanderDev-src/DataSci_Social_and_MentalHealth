"""Shared setup for every notebook in this folder.

Paths, constants, the Thai font of the figures, the analysis sample, and the
few helpers more than one notebook needs. Importing it sets the figure font.
"""

import pathlib
import subprocess
import sys

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import font_manager

IN_COLAB = "google.colab" in sys.modules

DATA_DIR = pathlib.Path("data")
RAW_PATH = DATA_DIR / "data.csv"  # the Google Forms export, never committed
CLEAN_PATH = DATA_DIR / "data_clean.csv"
SPSS_PATH = DATA_DIR / "data_clean_spss.csv"
CODEBOOK_PATH = DATA_DIR / "spss_codebook.csv"
SPSS_SYNTAX_PATH = DATA_DIR / "spss_value_labels.sps"

# in the repo the figures folder is one level up, shared with the report;
# anywhere else (Colab) the figures land beside the notebooks
FIG_DIR = pathlib.Path("../figures")
if not FIG_DIR.is_dir():
    FIG_DIR = pathlib.Path("figures")

DATA_DIR.mkdir(exist_ok=True)
FIG_DIR.mkdir(exist_ok=True)

SEED = 42
ALPHA = 0.05
N_BOOT = 5000  # bootstrap resamples behind every percentile CI

np.random.seed(SEED)
pd.set_option("display.max_columns", 50)
pd.set_option("display.width", 100)

# Thai text on the figures, in the same face main.tex sets for the document body.
# TH Sarabun New is small on the metric, hence the size bumps in the plots.
THAI_FONTS = ("TH Sarabun New", "Sarabun", "Noto Sans Thai", "Garuda")


def thai_font() -> str:
    """First installed font from THAI_FONTS; Thai text needs one or it prints boxes."""
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

    print("no Thai font found; Thai text will render as boxes")
    return str(plt.rcParams["font.family"][0])


if IN_COLAB:
    # Colab ships no Thai font; this package brings Garuda, the last name in THAI_FONTS
    subprocess.run(["apt-get", "-qq", "install", "-y", "fonts-thai-tlwg"], check=False)

# notebook.nvim restyles matplotlib for a dark editor (white text, see-through
# background) when the kernel starts; the saved figures go on a white page
matplotlib.rcdefaults()
THAI_FONT = thai_font()
plt.rcParams["font.family"] = THAI_FONT

DIMENSIONS = {
    "dass_depression": "Depression",
    "dass_anxiety": "Anxiety",
    "dass_stress": "Stress",
}

# Thai labels for the figures: the report body is Thai, so the charts are too
DIMENSION_TH = {
    "Depression": "ซึมเศร้า",
    "Anxiety": "วิตกกังวล",
    "Stress": "ความเครียด",
}

# categorical slots 1-3, one per dimension; every bar is also labelled with its
# value, so the three are never told apart by color alone
COLOR = {
    "Depression": "#2a78d6",
    "Anxiety": "#eb6834",
    "Stress": "#1baf7a",
}

# DASS-21 item numbers as printed on the form, seven per dimension
DASS_ITEMS = {
    "dass_depression": [3, 5, 10, 13, 16, 17, 21],
    "dass_anxiety": [2, 4, 7, 9, 15, 19, 20],
    "dass_stress": [1, 6, 8, 11, 12, 14, 18],
}

TITLE_SIZE = 21

# the regression equation of chapter 4: two exposures, six controls
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


def load_data(path=CLEAN_PATH) -> pd.DataFrame:
    if not pathlib.Path(path).exists():
        raise FileNotFoundError(f"{path} not found; run 01_data_preparation.ipynb first")
    return pd.read_csv(path)


def passed_attention(df: pd.DataFrame) -> pd.DataFrame:
    """Respondents who passed the attention check; the methodology drops the rest."""
    return df[df["attention_check"] == 1].reset_index(drop=True)


def formula(y: str, xs: list[str]) -> str:
    return f"{y} ~ " + " + ".join(xs)


def eta_squared(groups: list[np.ndarray]) -> float:
    """Share of the total variance that lies between the groups."""
    everyone = np.concatenate(groups)
    ss_between = sum(len(g) * (g.mean() - everyone.mean()) ** 2 for g in groups)
    ss_total = ((everyone - everyone.mean()) ** 2).sum()
    return float(ss_between / ss_total)


def cohens_d(a, b) -> float:
    """Pooled-SD effect size for two independent means."""
    sp = np.sqrt(
        ((len(a) - 1) * a.var(ddof=1) + (len(b) - 1) * b.var(ddof=1))
        / (len(a) + len(b) - 2)
    )
    return float((a.mean() - b.mean()) / sp)
