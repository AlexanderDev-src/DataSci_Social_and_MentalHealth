# การศึกษาความสัมพันธ์ระหว่างพฤติกรรมการใช้โซเชียลมีเดียกับสุขภาวะทางจิตของนักศึกษา

**A Study of the Relationship between Social Media Usage Behavior and Mental Well-being among University Students**

โครงงานรายวิชาวิทยาการข้อมูล ชั้นปีที่ 2 · สาขาวิชาวิทยาการคอมพิวเตอร์ วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น

[ภาษาไทย](#ภาษาไทย) · [English](#english)

---

## ภาษาไทย

### โครงงานนี้คืออะไร

ที่เก็บนี้เก็บ **เอกสารเค้าโครงโครงงาน (proposal)** และโค้ดวิเคราะห์ข้อมูลของโครงงาน
ที่ศึกษาว่าปริมาณเวลาที่ใช้กับโซเชียลมีเดียและประเภทเนื้อหาที่เสพ
มีความสัมพันธ์กับสุขภาวะทางจิตของนักศึกษามากน้อยเพียงใด

สถานะปัจจุบัน: **อยู่ในขั้นเสนอเค้าโครง** ยังไม่ได้เก็บข้อมูลจริง

### ที่มาของข้อมูล

เดิมตั้งใจใช้ชุดข้อมูลสาธารณะจาก Kaggle แต่เมื่อตรวจสอบแล้วพบว่า
ชุดข้อมูลที่เกี่ยวข้องกับหัวข้อนี้ที่ตรวจสอบเป็น **ข้อมูลสังเคราะห์** (synthetic data)
ที่สร้างขึ้นเพื่อการฝึกฝน ไม่ได้เก็บจากผู้ตอบจริง

หลักฐานที่พบ

- การกระจายของหลักทศนิยมสม่ำเสมอทั้ง 10 หลัก ขัดกับพฤติกรรมการตอบของมนุษย์ที่มักตอบเป็นเลขกลม
- แพลตฟอร์มผูกกับประเทศแบบตายตัว 100% (เช่น LINE ปรากฏเฉพาะในญี่ปุ่น)
- ค่าสหสัมพันธ์สูงถึง 0.80–0.95 ระหว่างตัวแปรคนละมิติ
- ไม่มีค่าว่างเลยแม้แต่ช่องเดียว

โครงงานจึงเปลี่ยนมา **เก็บข้อมูลเองด้วยแบบสอบถาม** จากนักศึกษามหาวิทยาลัยขอนแก่น
โดยใช้แบบวัดมาตรฐาน DASS-21 (Depression Anxiety Stress Scales) ฉบับแปลภาษาไทย

### โครงสร้างที่เก็บ

| ไฟล์ / โฟลเดอร์ | คำอธิบาย |
|---|---|
| `main.tex` | ไฟล์หลักของเอกสาร LaTeX |
| `chapter/` | เนื้อหาแยกตามหัวข้อ 8 หัวข้อ |
| `figures/` | รูปที่ใช้ในเอกสาร |
| `references.bib` | รายการอ้างอิง |
| `Info.md` | ร่างเนื้อหาฉบับเต็มก่อนแปลงเป็น LaTeX |
| `coding/` | โค้ดสำรวจข้อมูลและทำกราฟ (Python + uv) |

### วิธีคอมไพล์เอกสาร

ต้องมี XeLaTeX และฟอนต์ **TH Sarabun New** ติดตั้งในเครื่อง

```bash
latexmk -xelatex main.tex
```

### วิธีรันโค้ดวิเคราะห์

ใช้ [uv](https://docs.astral.sh/uv/) จัดการแพ็กเกจ ไม่ต้องสร้าง virtual environment เอง

```bash
cd coding
uv run jupyter lab      # แล้วเปิด notebooks/explore.ipynb
```

### หมายเหตุ

ที่เก็บนี้เป็นสาธารณะ จึง**ไม่มีการเก็บรหัสประจำตัวนักศึกษา**ไว้ในไฟล์ใด ๆ
และข้อมูลที่เก็บจากแบบสอบถามจะไม่มีข้อมูลที่ระบุตัวผู้ตอบได้

---

## English

### What is this

This repository contains the **project proposal** and analysis code for a study
on how the amount of time spent on social media, and the type of content consumed,
relate to the mental well-being of university students.

Current status: **proposal stage** — data collection has not started yet.

### About the data

The project originally planned to use a public dataset from Kaggle. On inspection,
the topic-relevant datasets we examined turned out to be **synthetic data** generated
for practice purposes, not collected from real respondents.

Evidence found

- Decimal digits distributed uniformly across all ten values, unlike human responses which cluster on round numbers
- Platform-to-country mapping was deterministic at 100% (e.g. LINE appeared only in Japan)
- Correlations of 0.80–0.95 between conceptually distinct variables
- Zero missing values across the entire table

The project therefore switched to **collecting its own survey data** from students at
Khon Kaen University, using the standardised DASS-21 (Depression Anxiety Stress Scales), Thai translation.

### Repository layout

| File / folder | Description |
|---|---|
| `main.tex` | LaTeX entry point |
| `chapter/` | Proposal content split into 8 sections |
| `figures/` | Figures used in the document |
| `references.bib` | Bibliography |
| `Info.md` | Full working draft before conversion to LaTeX |
| `coding/` | Data exploration and plotting code (Python + uv) |

### Building the document

Requires XeLaTeX and the **TH Sarabun New** font.

```bash
latexmk -xelatex main.tex
```

### Running the analysis code

Package management uses [uv](https://docs.astral.sh/uv/) — no manual virtual environment needed.

```bash
cd coding
uv run jupyter lab      # then open notebooks/explore.ipynb
```

### Note

This repository is public, so **no student ID numbers are stored in any file**, and the
survey collects no personally identifying information from respondents.

---

*Document written in Thai. Course: Data Science, second year.*
