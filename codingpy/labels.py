"""Thai survey answers -> English labels, and English labels -> SPSS codes.

The raw Google Forms export stores every categorical answer as Thai free text.
Analysis and SPSS both want stable English labels, so the mapping lives here
instead of being repeated in each script.
"""

import re

import numpy as np
import pandas as pd

GENDER = {
    "ชาย": "Male",
    "หญิง": "Female",
    "อื่น ๆ": "Other",
    "อื่นๆ": "Other",
    "ไม่ประสงค์ระบุ": "Prefer not to say",
}

PLATFORM = {
    "Tiktok": "TikTok",
    "Instagram": "Instagram",
    "Youtube": "YouTube",
    "Facebook": "Facebook",
    "X": "X",
}

CONTENT_TYPE = {
    "ข่าวสารบ้านเมือง การเมือง เหตุการณ์ปัจจุบัน": "News and politics",
    "บันเทิง (ซีรีส์ อนิเมะ คลิปตลก เพลง)": "Entertainment",
    "เกม / อีสปอร์ต": "Games and esports",
    "กีฬา": "Sports",
    "ความรู้ การเรียน พัฒนาตนเอง": "Education and self-improvement",
    "ชีวิตประจำวันของคนอื่น (เพื่อน คนดัง อินฟลูเอนเซอร์)": "Other people's daily life",
    "สินค้า รีวิว ช้อปปิ้ง": "Products and shopping",
    "Podcast": "Podcast",
    "การทำอาหาร": "Cooking",
}

# the four-group collapse fixed in the proposal, used when a cell is too small
# for a group comparison (News 11, Other people's life 15, Entertainment 61)
CONTENT_GROUP = {
    "News and politics": "News",
    "Entertainment": "Entertainment",
    "Other people's daily life": "Others' daily life",
}
CONTENT_GROUP_FALLBACK = "Other"

# faculty is free text: 66 spellings for ~13 faculties. Rules are tried in
# order, so a faculty keyword wins over the field-of-study keyword that follows
# it ("คณะวิทยาศาสตร์ สาขาวิทยาการคอมพิวเตอร์" is Science, not Computing).
FACULTY_RULES = [
    ("Education", ["ครุศาสตร์", "ศึกษาศาสตร์"]),
    ("Humanities and Social Sciences", ["มนุษย", "มนุษฯ", "สังคมศาสตร์"]),
    ("Law", ["นิติ"]),
    (
        "Political Science and Public Affairs",
        ["รัฐศาสตร์", "รปศ", "นโยบายสาธารณะ", "COPA"],
    ),
    ("Agriculture", ["เกษตร"]),
    ("Engineering", ["วิศวกรรม", "EN"]),
    ("Architecture and Fine Arts", ["สถาปัตย", "ศิลปกรรม"]),
    ("Public Health", ["สาธารณสุข"]),
    ("International College", ["นานาชาติ"]),
    (
        "Science",
        ["วิทยาศาสตร์", "วืทยาศาสตร์", "ฟิสิกส์", "สถิติ", "วิทยาการคำนวณ"],
    ),
    (
        "Business and Management",
        ["บริหาร", "การตลาด", "วิทยาการจัดการ", "ธุรกิจ", "KKBS"],
    ),
    (
        "College of Computing",
        ["คอม", "วิทคอม", "ปัญญาประดิษฐ์", "CP", "CS", "GIS", "AI"],
    ),
    ("Communication Arts", ["นิเทศ"]),
    ("Interdisciplinary Studies", ["สหวิทยาการ"]),
]
FACULTY_FALLBACK = "Other"

# order = SPSS code order; the code is the position in the list, starting at 1
CODE_ORDER = {
    "gender": ["Male", "Female", "Other", "Prefer not to say"],
    "faculty_group": [name for name, _ in FACULTY_RULES] + [FACULTY_FALLBACK],
    "main_platform": ["TikTok", "Instagram", "YouTube", "Facebook", "X"],
    "content_type": list(CONTENT_TYPE.values()),
    "content_group": [
        "News",
        "Entertainment",
        "Others' daily life",
        CONTENT_GROUP_FALLBACK,
    ],
}


def faculty_group(value) -> float | str:
    """Bucket a free-text faculty answer into one English faculty name."""
    if pd.isna(value) or not str(value).strip():
        return np.nan
    text = str(value)
    upper = text.upper()
    for name, keywords in FACULTY_RULES:
        for kw in keywords:
            # ASCII abbreviations (CP, CS, EN) must match as whole words so that
            # "CS" does not fire inside an unrelated English word
            if re.fullmatch(r"[A-Za-z]+", kw):
                if re.search(rf"\b{kw}\b", upper):
                    return name
            elif kw in text:
                return name
    return FACULTY_FALLBACK


def to_english(df: pd.DataFrame) -> pd.DataFrame:
    """Replace every Thai categorical answer with its English label."""
    out = df.copy()
    out["gender"] = out["gender"].map(GENDER).fillna(out["gender"])
    out["main_platform"] = (
        out["main_platform"].map(PLATFORM).fillna(out["main_platform"])
    )
    out["content_type"] = (
        out["content_type"].map(CONTENT_TYPE).fillna(out["content_type"])
    )
    out["content_group"] = out["content_type"].map(
        lambda v: np.nan if pd.isna(v) else CONTENT_GROUP.get(v, CONTENT_GROUP_FALLBACK)
    )
    out["faculty_group"] = out["faculty"].map(faculty_group)

    # keep the new columns where the Thai ones were; the raw free-text faculty
    # answer is dropped so the file holds no Thai at all (data.csv still has it)
    order = []
    for col in out.columns:
        if col == "faculty":
            order.append("faculty_group")
        elif col in ("faculty_group", "content_group"):
            continue
        else:
            order.append(col)
            if col == "content_type":
                order.append("content_group")
    return out[order]


def to_codes(df: pd.DataFrame) -> pd.DataFrame:
    """Numeric-coded copy for SPSS: no text cells, blanks stay blank."""
    out = df.copy()
    for col, labels in CODE_ORDER.items():
        codes = {label: i for i, label in enumerate(labels, start=1)}
        out[col] = out[col].map(codes)
    return out


def codebook() -> pd.DataFrame:
    """variable / code / label table describing every coded column."""
    rows = [
        {"variable": col, "code": i, "label": label}
        for col, labels in CODE_ORDER.items()
        for i, label in enumerate(labels, start=1)
    ]
    return pd.DataFrame(rows)


def spss_value_labels() -> str:
    """VALUE LABELS syntax so SPSS shows names instead of the numbers."""
    blocks = []
    for col, labels in CODE_ORDER.items():
        lines = [
            f"  {i} '{label.replace(chr(39), chr(39) * 2)}'"
            for i, label in enumerate(labels, start=1)
        ]
        blocks.append(f"VALUE LABELS {col}\n" + "\n".join(lines) + ".")
    return "\n\n".join(blocks) + "\n"
