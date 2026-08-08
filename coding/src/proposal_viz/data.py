"""โหลดข้อมูล

ถ้ายังไม่มีไฟล์จริงใน data/ จะสร้าง "ข้อมูลจำลอง" ให้แทน
เพื่อให้รันกราฟทดสอบได้ก่อน แล้วค่อยเอาไฟล์จริงมาวางทีหลัง
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd

DATA_DIR = Path(__file__).resolve().parents[2] / "data"

PLATFORMS = ["TikTok", "Instagram", "Facebook", "YouTube", "X (Twitter)"]
YEARS = ["ปี 1", "ปี 2", "ปี 3", "ปี 4"]


@dataclass
class Dataset:
    df: pd.DataFrame
    is_synthetic: bool

    @property
    def source_note(self) -> str:
        if self.is_synthetic:
            return "ข้อมูลจำลอง (synthetic) สร้างเพื่อทดสอบรูปแบบกราฟเท่านั้น — ยังไม่ใช่ผลวิเคราะห์จริง"
        return "ที่มา: Student Social Media & Mental Health Impact (Kaggle)"


def load() -> Dataset:
    """อ่าน csv ไฟล์แรกที่เจอใน data/ ถ้าไม่มีก็ใช้ข้อมูลจำลอง"""
    files = sorted(DATA_DIR.glob("*.csv")) if DATA_DIR.exists() else []
    if files:
        return Dataset(df=pd.read_csv(files[0]), is_synthetic=False)
    return Dataset(df=make_synthetic(), is_synthetic=True)


def make_synthetic(n: int = 480, seed: int = 7) -> pd.DataFrame:
    """ข้อมูลจำลอง โครงสร้างคอลัมน์เลียนแบบชุดข้อมูลบน Kaggle

    ใส่ความสัมพันธ์ไว้ตั้งใจ ๆ (ใช้เวลามาก -> นอนน้อย -> เครียด/ซึมเศร้าสูง)
    เพื่อให้กราฟทดสอบมีอะไรให้ดู ตัวเลขไม่มีความหมายทางวิชาการ
    """
    rng = np.random.default_rng(seed)

    usage = np.clip(rng.gamma(shape=4.0, scale=1.05, size=n), 0.2, 14)
    sleep = np.clip(8.6 - 0.32 * usage + rng.normal(0, 0.75, n), 3.0, 11.0)
    stress = np.clip(2.4 + 0.42 * usage - 0.30 * (sleep - 7) + rng.normal(0, 1.1, n), 1, 10)
    depression = np.clip(1.6 + 0.75 * stress - 0.25 * (sleep - 7) + rng.normal(0, 1.2, n), 1, 10)
    activity = np.clip(rng.normal(4.2, 1.8, n) - 0.12 * usage, 0, 10)
    gpa = np.clip(3.55 - 0.075 * usage + 0.05 * activity + rng.normal(0, 0.28, n), 0.0, 4.0)

    # แพลตฟอร์มหลัก: คนที่ใช้เวลามากมีแนวโน้มตอบ TikTok/Instagram มากกว่า
    weight = np.stack(
        [
            0.5 + 0.20 * usage,     # TikTok
            0.8 + 0.10 * usage,     # Instagram
            1.6 - 0.05 * usage,     # Facebook
            1.4 - 0.02 * usage,     # YouTube
            0.9 - 0.03 * usage,     # X
        ],
        axis=1,
    ).clip(0.05)
    weight /= weight.sum(axis=1, keepdims=True)
    platform = [rng.choice(PLATFORMS, p=w) for w in weight]

    return pd.DataFrame(
        {
            "student_id": np.arange(1, n + 1),
            "year": rng.choice(YEARS, size=n, p=[0.3, 0.3, 0.22, 0.18]),
            "main_platform": platform,
            "usage_hours": usage.round(2),
            "sleep_hours": sleep.round(2),
            "physical_activity": activity.round(2),
            "stress_score": stress.round(2),
            "depression_score": depression.round(2),
            "gpa": gpa.round(2),
        }
    )
