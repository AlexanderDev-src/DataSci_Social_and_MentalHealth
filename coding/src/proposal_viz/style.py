"""สไตล์กลางของกราฟทุกใบในโครงงาน

แยกไว้ที่เดียว เพื่อให้กราฟทุกใบใน figures/ หน้าตาเป็นชุดเดียวกัน
ถ้าจะเปลี่ยนสี/ฟอนต์ ให้แก้ที่ไฟล์นี้ไฟล์เดียว
"""

from __future__ import annotations

import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
from cycler import cycler
from matplotlib import font_manager

# ---------------------------------------------------------------
# สี — เรียงตามลำดับสล็อตคงที่ ห้ามสลับ/วนซ้ำ
# (ตรวจผ่าน colorblind-safe: worst pair ΔE 9.2 deutan, 24.0 normal)
# ถ้ามีมากกว่า 3 กลุ่มในกราฟ scatter ให้ยุบเป็น "อื่น ๆ" หรือแยกเป็นหลายรูปแทน
# ---------------------------------------------------------------
SERIES = ["#2a78d6", "#eb6834", "#1baf7a"]  # blue, orange, aqua

# ไล่เฉดสีเดียว (น้ำเงิน) สำหรับค่าต่อเนื่อง เช่น heatmap
SEQUENTIAL = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"]

SURFACE = "#fcfcfb"
INK = "#0b0b0b"
INK_MUTED = "#52514e"
GRID = "#e3e2de"

# ฟอนต์ไทย — ใช้ตัวเดียวกับเล่มเอกสาร (main.tex ใช้ TH Sarabun New)
_THAI_CANDIDATES = ["TH Sarabun New", "Sarabun", "IBM Plex Sans Thai", "Noto Sans Thai"]


def _pick_thai_font() -> str | None:
    installed = {f.name for f in font_manager.fontManager.ttflist}
    for name in _THAI_CANDIDATES:
        if name in installed:
            return name
    return None


def apply_style(backend: str | None = "Agg") -> None:
    """ตั้งค่า rcParams ให้กราฟทั้งหมด เรียกครั้งเดียวตอนเริ่มโปรแกรม

    backend="Agg" = เซฟเป็นไฟล์อย่างเดียว ไม่เปิดหน้าต่าง (ใช้ตอนรันเป็นสคริปต์)
    backend=None  = ไม่ยุ่งกับ backend ใช้ใน notebook เพื่อให้รูปโผล่ใต้เซลล์ตามปกติ
    """
    if backend is not None:
        matplotlib.use(backend)
    sns.set_theme(style="whitegrid", context="notebook")

    font = _pick_thai_font()
    family = [font] if font else []

    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": family + ["DejaVu Sans"],
            # TH Sarabun New ตัวเล็กกว่าฟอนต์ฝรั่งที่ point เท่ากัน จึงต้องขยาย
            "font.size": 15 if font == "TH Sarabun New" else 11,
            "axes.titlesize": "large",
            "axes.titleweight": "bold",
            "axes.titlelocation": "left",
            "axes.titlepad": 12,
            "axes.labelcolor": INK_MUTED,
            "axes.edgecolor": GRID,
            "axes.facecolor": SURFACE,
            "figure.facecolor": SURFACE,
            "savefig.facecolor": SURFACE,
            "text.color": INK,
            "xtick.color": INK_MUTED,
            "ytick.color": INK_MUTED,
            "grid.color": GRID,
            "grid.linewidth": 0.8,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "lines.linewidth": 2.0,
            "lines.markersize": 8,
            "figure.dpi": 110,
            "savefig.dpi": 200,
            "savefig.bbox": "tight",
            "axes.prop_cycle": cycler(color=SERIES),
        }
    )


def footnote(fig, text: str) -> None:
    """ข้อความกำกับใต้รูป เช่น ที่มาของข้อมูล"""
    # -0.06 = ต่ำกว่าชื่อแกน x พอที่จะไม่ทับกัน (savefig ใช้ bbox="tight" จะขยายกรอบให้เอง)
    fig.text(0.0, -0.06, text, ha="left", va="top", fontsize="small", color=INK_MUTED)
