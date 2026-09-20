# การศึกษาความสัมพันธ์ระหว่างพฤติกรรมการใช้โซเชียลมีเดียกับสุขภาวะทางจิตของนักศึกษา

**A Study of the Relationship between Social Media Usage Behavior and Mental Well-being among University Students**

โครงงานรายวิชาวิทยาการข้อมูล ชั้นปีที่ 2 · สาขาวิชาวิทยาการคอมพิวเตอร์ วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น

[ภาษาไทย](#ภาษาไทย) · [English](#english)

---

## ภาษาไทย

### โครงงานนี้คืออะไร

ที่เก็บนี้รวมเอกสารเค้าโครงโครงงาน โค้ดวิเคราะห์ข้อมูล และผลวิเคราะห์
ของโครงงานที่ศึกษาว่าปริมาณเวลาที่ใช้กับโซเชียลมีเดียและประเภทเนื้อหาที่เสพ
สัมพันธ์กับสุขภาวะทางจิตของนักศึกษามากน้อยเพียงใด

สถานะปัจจุบัน

- เค้าโครงโครงงาน (`main.tex`) เขียนเสร็จและคอมไพล์เป็น `main.pdf` แล้ว
- เก็บข้อมูลจริงเสร็จแล้ว ได้ผู้ตอบ **121 คน** (หญิง 63 ชาย 58)
- กำลังอยู่ระหว่างวิเคราะห์ข้อมูลและตอบคำถามวิจัยทีละข้อ
- รายงานฉบับสมบูรณ์ 5 บท ยังไม่ได้เขียน (มีแค่โครงใน `report/`)

### ที่มาของข้อมูล

เดิมตั้งใจใช้ชุดข้อมูลสาธารณะจาก Kaggle แต่เมื่อตรวจสอบแล้วพบว่า
ชุดข้อมูลที่เกี่ยวข้องกับหัวข้อนี้เป็น **ข้อมูลสังเคราะห์** (synthetic data)
ที่สร้างขึ้นเพื่อการฝึกฝน ไม่ได้เก็บจากผู้ตอบจริง

หลักฐานที่พบ

- การกระจายของหลักทศนิยมสม่ำเสมอทั้ง 10 หลัก ขัดกับพฤติกรรมการตอบของมนุษย์ที่มักตอบเป็นเลขกลม
- แพลตฟอร์มผูกกับประเทศแบบตายตัว 100% (เช่น LINE ปรากฏเฉพาะในญี่ปุ่น)
- ค่าสหสัมพันธ์สูงถึง 0.80–0.95 ระหว่างตัวแปรคนละมิติ
- ไม่มีค่าว่างเลยแม้แต่ช่องเดียว

โครงงานจึงเปลี่ยนมา **เก็บข้อมูลเองด้วยแบบสอบถามออนไลน์** จากนักศึกษามหาวิทยาลัยขอนแก่น
โดยใช้แบบวัดมาตรฐาน DASS-21 (Depression Anxiety Stress Scales) ฉบับแปลภาษาไทย
พร้อมคำถามเรื่องการนอน การออกกำลังกาย ความกดดันจากการเรียน ผลการเรียน และความเพียงพอทางการเงิน
และมีข้อตรวจความตั้งใจตอบ (attention check) อยู่ในแบบสอบถาม

### โครงสร้างที่เก็บ

| ไฟล์ / โฟลเดอร์ | คำอธิบาย |
|---|---|
| `main.tex` | ไฟล์หลักของเอกสารเค้าโครง (XeLaTeX) |
| `chapter/` | เนื้อหาเค้าโครงแยกตามหัวข้อ 8 หัวข้อ |
| `figures/` | รูปทั้งหมดที่สคริปต์ใน `codingpy/` สร้างขึ้น |
| `references.bib` | รายการอ้างอิง (ใช้ร่วมกันทั้งเค้าโครงและรายงาน) |
| `Info.md` | ร่างเนื้อหาฉบับเต็มก่อนแปลงเป็น LaTeX |
| `PRESENTATION.md` | บันทึกเตรียมนำเสนอ พร้อมคำอธิบายสถิติที่ใช้ |
| `codingpy/` | โค้ด Python ทั้งหมด (จัดการแพ็กเกจด้วย uv) |
| `codingpy/data/` | ข้อมูลดิบและข้อมูลที่ทำความสะอาดแล้ว — **ไม่ถูก commit** |
| `report/` | โครงรายงานฉบับสมบูรณ์ 5 บท ยังเขียนไม่เสร็จ |

### ไฟล์โค้ดใน `codingpy/`

| ไฟล์ | หน้าที่ |
|---|---|
| `config.py` | ค่าคงที่ร่วม (seed, พาธข้อมูล) และฟังก์ชันโหลดข้อมูล |
| `labels.py` | แปลงคำตอบภาษาไทยเป็นป้ายภาษาอังกฤษ และเป็นรหัสตัวเลขสำหรับ SPSS |
| `clean_data.py` | ทำความสะอาดข้อมูลดิบ แปลงข้อความเป็นตัวเลข คิดคะแนน DASS-21 และเขียนไฟล์สำหรับ SPSS |
| `rich_console.py` | พิมพ์ DataFrame เป็นตารางอ่านง่ายในเทอร์มินัล |
| `hypothesis_tests.py` | การทดสอบสมมติฐาน 3 แบบตามที่รายวิชากำหนด (1 ประชากร, 2 ประชากร, k ประชากร) |
| `analysis.py` | กราฟ 3 มิติ โซเชียลมีเดีย × การนอน → คะแนน DASS รวม แยกตามเพศ |
| `animation.py` | แอนิเมชัน what-if เพิ่มชั่วโมงการใช้โซเชียลมีเดียทีละชั่วโมง |
| `qr2.py` | คำถามวิจัยข้อ 2 — โซเชียลมีเดียเกี่ยวข้องกับมิติใดของ DASS-21 |
| `qr7.py` | คำถามวิจัยข้อ 7 — สภาพการเงินทำให้คะแนนทั้งสามมิติต่างกันหรือไม่ |

### วิธีคอมไพล์เอกสาร

ต้องมี XeLaTeX และฟอนต์ **TH Sarabun New** ติดตั้งในเครื่อง

```bash
latexmk -xelatex main.tex
```

### วิธีรันโค้ดวิเคราะห์

ใช้ [uv](https://docs.astral.sh/uv/) จัดการแพ็กเกจ ไม่ต้องสร้าง virtual environment เอง
สคริปต์อ้างพาธแบบสัมพัทธ์ (อ่าน `data/` เขียน `../figures/`) จึง**ต้องรันจากโฟลเดอร์ `codingpy/`**

```bash
uv sync
cd codingpy

uv run python clean_data.py        # data/data.csv -> data/data_clean.csv (+ ไฟล์ SPSS)
uv run python hypothesis_tests.py  # การทดสอบสมมติฐาน 3 แบบ
uv run python qr2.py               # คำถามข้อ 2 + figures/qr2-social-media-dass-dimension.png
uv run python qr7.py               # คำถามข้อ 7 + figures/qr7-finance-dass-dimension.png
uv run python analysis.py          # กราฟ 3 มิติ
uv run python animation.py         # ไฟล์ GIF
```

สคริปต์ที่วาดกราฟตั้ง backend เป็น `TkAgg` เพื่อเปิดหน้าต่างดูผลทันที
ถ้ารันบนเครื่องที่ไม่มีหน้าจอ ให้ลบบรรทัด `matplotlib.use("TkAgg")` ออก

### ผลที่ได้จนถึงตอนนี้

จากผู้ตอบ 121 คน

- **จำนวนชั่วโมงที่ใช้โซเชียลมีเดียไม่สัมพันธ์กับมิติใดเลย** ทั้งซึมเศร้า วิตกกังวล และความเครียด
  (r อยู่ระหว่าง −0.10 ถึง −0.03 ทุกค่าไม่มีนัยสำคัญ และยังไม่มีนัยสำคัญหลังคุมตัวแปรอื่น)
- **การเสพข่าวสัมพันธ์กับความวิตกกังวล** มากกว่ามิติอื่น (r = +0.17, p = 0.061
  และ p = 0.047 เมื่อคุมการนอน คุณภาพการนอน ความกดดันจากการเรียน ผลการเรียน และสภาพการเงิน)
- **สภาพการเงินคือตัวแปรที่แรงที่สุดเท่าที่พบ** กลุ่มเงินไม่พอใช้มีคะแนนซึมเศร้าเฉลี่ย 17.5
  เทียบกับกลุ่มสบาย 6.2 (F = 15.87, p < 0.001, η² = 0.21) ความเครียดต่างกันเช่นกัน
  (p = 0.001) ส่วนวิตกกังวลไม่ต่างกันอย่างมีนัยสำคัญ (p = 0.120)

ตัวเลขทั้งหมดพิมพ์ออกทางเทอร์มินัลเมื่อรัน `qr2.py` และ `qr7.py`

### ข้อมูลและความเป็นส่วนตัว

- แบบสอบถามไม่เก็บชื่อ รหัสประจำตัวนักศึกษา หรือข้อมูลที่ระบุตัวผู้ตอบได้
- โฟลเดอร์ `codingpy/data/` ถูกกำหนดไว้ใน `.gitignore` ข้อมูลผู้ตอบจึงไม่ขึ้นมาบนที่เก็บสาธารณะ

---

## English

### What is this

This repository holds the proposal document, the analysis code, and the results for a
study of how the amount of time spent on social media, and the type of content consumed,
relate to the mental well-being of university students.

Current status

- The proposal (`main.tex`) is written and compiled to `main.pdf`
- Data collection is finished: **121 respondents** (63 female, 58 male)
- Analysis is in progress, one research question at a time
- The full five-chapter report has not been written yet; only a skeleton exists in `report/`

### About the data

The project originally planned to use a public dataset from Kaggle. On inspection,
the topic-relevant datasets turned out to be **synthetic data** generated for practice,
not collected from real respondents.

Evidence found

- Decimal digits distributed uniformly across all ten values, unlike human responses which cluster on round numbers
- Platform-to-country mapping was deterministic at 100% (e.g. LINE appeared only in Japan)
- Correlations of 0.80–0.95 between conceptually distinct variables
- Zero missing values across the entire table

The project therefore switched to **running its own online survey** at Khon Kaen University,
using the standardised DASS-21 (Depression Anxiety Stress Scales) in Thai translation, plus
items on sleep, exercise, study pressure, GPA and financial sufficiency, and an attention-check item.

### Repository layout

| File / folder | Description |
|---|---|
| `main.tex` | Proposal entry point (XeLaTeX) |
| `chapter/` | Proposal content split into 8 sections |
| `figures/` | Every figure the scripts in `codingpy/` produce |
| `references.bib` | Bibliography, shared by the proposal and the report |
| `Info.md` | Full working draft before conversion to LaTeX |
| `PRESENTATION.md` | Presentation notes, including the statistics used |
| `codingpy/` | All Python code (packages managed with uv) |
| `codingpy/data/` | Raw and cleaned survey data — **not committed** |
| `report/` | Skeleton of the five-chapter final report, still unfinished |

### Code in `codingpy/`

| File | Purpose |
|---|---|
| `config.py` | Shared constants (seed, data path) and the loader |
| `labels.py` | Thai answers to English labels, and labels to SPSS codes |
| `clean_data.py` | Cleans the raw export, parses free text into numbers, scores DASS-21, writes the SPSS files |
| `rich_console.py` | Prints wide DataFrames as readable terminal tables |
| `hypothesis_tests.py` | The three required hypothesis tests (1, 2 and k populations) |
| `analysis.py` | 3D plot: social media × sleep → DASS-21 total, by gender |
| `animation.py` | What-if animation: raise social media use one hour at a time |
| `qr2.py` | Research question 2 — which DASS-21 dimension social media ties to |
| `qr7.py` | Research question 7 — whether financial sufficiency shifts the three dimensions |

### Building the document

Requires XeLaTeX and the **TH Sarabun New** font.

```bash
latexmk -xelatex main.tex
```

### Running the analysis code

Package management uses [uv](https://docs.astral.sh/uv/) — no manual virtual environment needed.
The scripts use relative paths (they read `data/`, write `../figures/`), so **run them from `codingpy/`**.

```bash
uv sync
cd codingpy

uv run python clean_data.py        # data/data.csv -> data/data_clean.csv (+ SPSS files)
uv run python hypothesis_tests.py  # the three hypothesis tests
uv run python qr2.py               # question 2 + figures/qr2-social-media-dass-dimension.png
uv run python qr7.py               # question 7 + figures/qr7-finance-dass-dimension.png
uv run python analysis.py          # the 3D plot
uv run python animation.py         # the GIF
```

The plotting scripts set the `TkAgg` backend so a window opens straight away.
On a headless machine, delete the `matplotlib.use("TkAgg")` line.

### Results so far

From 121 respondents

- **Hours of social media use tie to none of the three dimensions** — depression, anxiety
  and stress all sit between r = −0.10 and −0.03, none significant, and none becomes
  significant after controls
- **News consumption ties to anxiety** more than to the other dimensions (r = +0.17, p = 0.061;
  p = 0.047 after controlling for sleep, sleep quality, study pressure, GPA and financial sufficiency)
- **Financial sufficiency is the strongest correlate found so far**: the low-money group averages
  17.5 on depression against 6.2 for the comfortable group (F = 15.87, p < 0.001, η² = 0.21).
  Stress differs too (p = 0.001); anxiety does not reach significance (p = 0.120)

Running `qr2.py` and `qr7.py` prints all of these numbers to the terminal.

### Data and privacy

- The survey collects no names, student ID numbers, or other identifying information
- `codingpy/data/` is listed in `.gitignore`, so respondent data never reaches the public repository

---

*Document written in Thai. Course: Data Science, second year.*
