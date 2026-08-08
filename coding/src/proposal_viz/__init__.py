"""proposal-viz — โค้ดทำกราฟสำหรับเค้าโครงโครงงาน
Student Social Media & Mental Health Impact

รัน:  uv run proposal-viz
รูปออกที่ coding/output/  (คัดรูปที่จะใช้จริงไปวางใน proposal/figures/ เอง)
"""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt

from . import data, plots, style

OUTPUT_DIR = Path(__file__).resolve().parents[2] / "output"


def main() -> None:
    style.apply_style()
    dataset = data.load()
    note = dataset.source_note

    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"ข้อมูล: {len(dataset.df)} แถว, {len(dataset.df.columns)} คอลัมน์ — {note}")

    for name, fn in plots.ALL.items():
        fig = fn(dataset.df, note)
        path = OUTPUT_DIR / f"{name}.png"
        fig.savefig(path)
        plt.close(fig)
        print(f"  เซฟแล้ว: {path.relative_to(OUTPUT_DIR.parent)}")


__all__ = ["data", "main", "plots", "style"]
