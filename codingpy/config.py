"""Shared setup for every analysis script in this project."""

import numpy as np
import pandas as pd

SEED = 42
DATA_PATH = "data/data_clean.csv"


def setup():
    np.random.seed(SEED)
    pd.set_option("display.max_columns", 50)
    pd.set_option("display.width", 100)


def load_data(path: str = DATA_PATH) -> pd.DataFrame:
    return pd.read_csv(path)
