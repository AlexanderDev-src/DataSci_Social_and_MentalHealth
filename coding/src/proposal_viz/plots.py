"""กราฟทดสอบ 4 แบบ — หนึ่งฟังก์ชันต่อหนึ่งรูป

แต่ละฟังก์ชันรับ DataFrame + note (ที่มาข้อมูล) แล้วคืน Figure
ตัวที่เซฟไฟล์คือ __init__.main() ไม่ใช่ที่นี่ จะได้เอาไปเรียกใน notebook ได้ด้วย
"""

from __future__ import annotations

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.figure import Figure

from .style import INK, INK_MUTED, SERIES, footnote

# ไล่สีสองขั้ว น้ำเงิน <- เทา -> แดง สำหรับค่าที่มีทั้งบวกและลบ (สหสัมพันธ์)
DIVERGING = LinearSegmentedColormap.from_list(
    "blue_red",
    ["#184f95", "#2a78d6", "#9ec5f4", "#f0efec", "#f5a9a8", "#e34948", "#a12c2b"],
)


def usage_distribution(df: pd.DataFrame, note: str) -> Figure:
    """เวลาใช้โซเชียลต่อวันกระจายตัวอย่างไร -> ฮิสโทแกรม"""
    fig, ax = plt.subplots(figsize=(7.2, 4.2))

    ax.hist(
        df["usage_hours"],
        bins=np.arange(0, df["usage_hours"].max() + 1, 1.0),
        color=SERIES[0],
        edgecolor="white",   # ช่องว่าง 2px ระหว่างแท่ง
        linewidth=1.5,
        weights=np.full(len(df), 100 / len(df)),
    )

    median = float(df["usage_hours"].median())
    ax.axvline(median, color=INK, linewidth=1.5, linestyle="--")
    ax.annotate(
        f"มัธยฐาน {median:.1f} ชม./วัน",
        xy=(median, ax.get_ylim()[1] * 0.92),
        xytext=(6, 0),
        textcoords="offset points",
        color=INK,
        fontweight="bold",
    )

    ax.set_title("นักศึกษาส่วนใหญ่ใช้โซเชียลมีเดียกี่ชั่วโมงต่อวัน")
    ax.set_xlabel("ชั่วโมงต่อวัน")
    ax.set_ylabel("สัดส่วนนักศึกษา")
    ax.xaxis.set_major_locator(mticker.MultipleLocator(2))
    ax.yaxis.set_major_formatter(mticker.PercentFormatter(decimals=0))
    ax.grid(axis="x", visible=False)
    footnote(fig, note)
    return fig


def usage_vs_depression(df: pd.DataFrame, note: str) -> Figure:
    """เวลาใช้งาน สัมพันธ์กับคะแนนซึมเศร้าไหม -> scatter + ค่าเฉลี่ยรายช่วง"""
    fig, ax = plt.subplots(figsize=(7.2, 4.6))

    ax.scatter(
        df["usage_hours"],
        df["depression_score"],
        s=26,
        color=SERIES[0],
        alpha=0.35,
        edgecolor="none",
        label="นักศึกษา 1 คน",
    )

    # ค่าเฉลี่ยของแต่ละช่วง 1 ชั่วโมง — เส้นนี้คือสิ่งที่อยากให้คนอ่านเห็น
    bins = np.arange(0, df["usage_hours"].max() + 1, 1.0)
    mid = bins[:-1] + 0.5
    # observed=False = เก็บช่วงที่ไม่มีคนไว้ด้วย แถวจะได้ตรงกับ mid ทีละตัว
    grouped = df.groupby(pd.cut(df["usage_hours"], bins), observed=False)["depression_score"].agg(
        ["mean", "count"]
    )
    solid = (grouped["count"] >= 5).to_numpy()   # ช่วงที่มีคนน้อยเกินไป ไม่ลาก
    ax.plot(
        mid[solid],
        grouped.loc[solid, "mean"],
        color=SERIES[1],
        marker="o",
        markeredgecolor="white",
        markeredgewidth=1.5,
        label="ค่าเฉลี่ยของแต่ละช่วง",
    )

    ax.set_title("ยิ่งใช้โซเชียลนาน คะแนนภาวะซึมเศร้ายิ่งสูง")
    ax.set_xlabel("ชั่วโมงต่อวัน")
    ax.set_ylabel("คะแนนภาวะซึมเศร้า (1–10)")
    ax.xaxis.set_major_locator(mticker.MultipleLocator(2))
    ax.yaxis.set_major_locator(mticker.MultipleLocator(2))
    ax.set_ylim(0, 10.5)
    ax.legend(loc="lower right", frameon=False)

    r = df["usage_hours"].corr(df["depression_score"])
    footnote(fig, f"{note}  ·  สหสัมพันธ์เพียร์สัน r = {r:.2f}")
    return fig


def scores_by_platform(df: pd.DataFrame, note: str) -> Figure:
    """คะแนนเครียดเฉลี่ย แยกตามแพลตฟอร์มหลัก -> แท่งแนวนอน เรียงมาก->น้อย"""
    stats = (
        df.groupby("main_platform")["stress_score"]
        .agg(["mean", "count"])
        .sort_values("mean")
    )

    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    bars = ax.barh(
        stats.index,
        stats["mean"],
        color=SERIES[0],
        height=0.62,
        edgecolor="white",
        linewidth=1.5,
    )

    # ติดตัวเลขไว้ที่ปลายแท่ง จะได้ไม่ต้องกวาดตาไปอ่านแกน
    for bar, (mean, count) in zip(bars, stats.to_numpy()):
        ax.annotate(
            f"{mean:.1f}  (n={int(count)})",
            xy=(bar.get_width(), bar.get_y() + bar.get_height() / 2),
            xytext=(6, 0),
            textcoords="offset points",
            va="center",
            color=INK_MUTED,
        )

    ax.set_title("คะแนนความเครียดเฉลี่ย แยกตามแพลตฟอร์มที่ใช้มากที่สุด")
    ax.set_xlabel("คะแนนความเครียดเฉลี่ย (1–10)")
    ax.set_xlim(0, 10)
    ax.xaxis.set_major_locator(mticker.MultipleLocator(2))
    ax.grid(axis="y", visible=False)
    ax.tick_params(axis="y", length=0)
    footnote(fig, note)
    return fig


def correlation_heatmap(df: pd.DataFrame, note: str) -> Figure:
    """ตัวแปรเชิงตัวเลขเกี่ยวข้องกันแค่ไหน -> heatmap สองขั้ว (ลบ=น้ำเงิน บวก=แดง)"""
    labels = {
        "usage_hours": "เวลาใช้โซเชียล",
        "sleep_hours": "ชั่วโมงการนอน",
        "physical_activity": "กิจกรรมทางกาย",
        "stress_score": "ความเครียด",
        "depression_score": "ภาวะซึมเศร้า",
        "gpa": "เกรดเฉลี่ย",
    }
    cols = [c for c in labels if c in df.columns]
    corr = df[cols].corr().rename(index=labels, columns=labels)

    # เส้นทแยง = ตัวเองเทียบตัวเอง (1.00 เสมอ) และครึ่งบน = ค่าซ้ำ ตัดทิ้งทั้งคู่
    # ตัดแถวแรก/คอลัมน์สุดท้ายออก จะได้ไม่เหลือแถวว่างค้างไว้
    corr = corr.iloc[1:, :-1]
    mask = np.triu(np.ones_like(corr, dtype=bool), k=1)

    fig, ax = plt.subplots(figsize=(7.0, 5.4))
    sns.heatmap(
        corr,
        mask=mask,
        cmap=DIVERGING,
        vmin=-1,
        vmax=1,
        center=0,
        annot=True,
        fmt=".2f",
        annot_kws={"fontsize": "small"},
        linewidths=2,
        linecolor="white",
        square=True,
        cbar_kws={"shrink": 0.75, "label": "สหสัมพันธ์เพียร์สัน (r)"},
        ax=ax,
    )
    ax.set_title("ความสัมพันธ์ระหว่างตัวแปรหลัก")
    ax.tick_params(length=0)
    plt.setp(ax.get_xticklabels(), rotation=30, ha="right")
    footnote(fig, note)
    return fig


ALL = {
    "01-usage-distribution": usage_distribution,
    "02-usage-vs-depression": usage_vs_depression,
    "03-stress-by-platform": scores_by_platform,
    "04-correlation": correlation_heatmap,
}
