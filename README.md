# การศึกษาความสัมพันธ์ระหว่างพฤติกรรมการใช้โซเชียลมีเดียกับสุขภาวะทางจิตของนักศึกษา

**A Study of the Relationship between Social Media Usage Behavior and Mental Well-being among University Students**

โครงงานรายวิชาวิทยาการข้อมูล ชั้นปีที่ 2 · สาขาวิชาวิทยาการคอมพิวเตอร์ วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น

[ภาษาไทย](#ภาษาไทย) · [English](#english)

---

## ภาษาไทย

### โครงงานนี้คืออะไร

โครงงานนี้ศึกษาว่าเวลาที่นักศึกษาใช้กับโซเชียลมีเดียและประเภทเนื้อหาที่เสพ
สัมพันธ์กับภาวะซึมเศร้า ความวิตกกังวล และความเครียดมากน้อยเพียงใด
และความสัมพันธ์นั้นยังเหลืออยู่หรือไม่เมื่อควบคุมการนอน ความกดดันจากการเรียน ผลการเรียน และสภาพการเงิน
ที่เก็บนี้มีทั้งเค้าโครง รายงานฉบับสมบูรณ์ โค้ดวิเคราะห์ และรูปผลลัพธ์

### สถานะ

- เค้าโครงเสร็จแล้ว: `Proposol-Done.pdf`
- เก็บข้อมูลเสร็จแล้ว ได้คำตอบ 121 ชุด ใช้วิเคราะห์ 107 คนที่ผ่านข้อดักความใส่ใจ (หญิง 59 ชาย 48)
- วิเคราะห์ครบทั้ง 7 คำถามวิจัย
- รายงาน 5 บทเขียนเสร็จแล้ว อยู่ระหว่างตรวจทาน: `Full-report-0209Update.pdf`

### ที่มาของข้อมูล

เดิมตั้งใจใช้ชุดข้อมูลสาธารณะจาก Kaggle แต่ชุดข้อมูลในหัวข้อนี้ที่ตรวจแล้วเป็น**ข้อมูลสังเคราะห์**
ที่สร้างไว้ฝึกฝน ไม่ได้เก็บจากผู้ตอบจริง หลักฐานที่พบคือ

- หลักทศนิยมกระจายเท่ากันทั้ง 10 หลัก ขณะที่คนจริงมักตอบเป็นเลขกลม
- แพลตฟอร์มผูกกับประเทศแบบตายตัวทุกแถว เช่น LINE ปรากฏเฉพาะในญี่ปุ่น
- ตัวแปรที่วัดคนละเรื่องมีสหสัมพันธ์กันสูงถึง 0.80 ถึง 0.95
- ไม่มีค่าว่างเลยสักช่อง

โครงงานจึง**เก็บข้อมูลเองด้วยแบบสอบถามออนไลน์**จากนักศึกษามหาวิทยาลัยขอนแก่น
ระหว่างวันที่ 23 สิงหาคม ถึง 3 กันยายน 2569
ใช้แบบวัด DASS-21 ฉบับภาษาไทย ร่วมกับคำถามเรื่องการนอน การออกกำลังกาย ความกดดันจากการเรียน
เกรดเฉลี่ย และความเพียงพอทางการเงิน และมีข้อดักความใส่ใจหนึ่งข้อ
ผู้ที่ตอบข้อดักผิด 14 คนถูกตัดออกตามที่เค้าโครงกำหนด

### ผลที่ได้

จากผู้ตอบ 107 คน

- **ชั่วโมงใช้โซเชียลมีเดียไม่สัมพันธ์กับมิติใดเลย** (r อยู่ระหว่าง −0.15 ถึง −0.09)
  และเมื่อควบคุมตัวแปรอื่นในสมการถดถอยแล้ว ตัวแปรโซเชียลมีเดียเพิ่ม R² ได้ไม่เกิน 0.045 อย่างไม่มีนัยสำคัญ
- **การติดตามข่าวเชิงลบสัมพันธ์กับความวิตกกังวลมากกว่ามิติอื่น** ตามที่คาดไว้ แต่ไม่มีนัยสำคัญ
  (r = 0.15, p = 0.134; partial r = 0.17, p = 0.103)
  ผลนี้มีนัยสำคัญเฉพาะเมื่อรวมผู้ที่ไม่ผ่านข้อดักเข้าไปด้วย จึงไม่ใช้เป็นข้อสรุป
- **สภาพการเงินแยกคะแนนภาวะซึมเศร้าได้ชัดที่สุด** กลุ่มเงินไม่พอใช้มีคะแนนเฉลี่ย 16.6
  กลุ่มสบาย 6.6 (F(2, 104) = 10.91, p < 0.001, η² = 0.17)
  ความเครียดต่างกันเช่นกัน (p = 0.008) ส่วนความวิตกกังวลไม่ต่าง (p = 0.153)
- **คุณภาพการนอนสัมพันธ์กับภาวะซึมเศร้าและความเครียด** (r = -0.28 และ −0.32)
  แต่ชั่วโมงการนอนและเกรดเฉลี่ยไม่สัมพันธ์กับมิติใด
- ความเชื่อมั่นของ DASS-21 (แอลฟาของครอนบาค): ซึมเศร้า 0.844 วิตกกังวล 0.737 เครียด 0.771

รายละเอียดทั้งหมดอยู่ในบทที่ 4 ของรายงาน

### โครงสร้างที่เก็บ

| ไฟล์ / โฟลเดอร์ | คำอธิบาย |
|---|---|
| `Proposol-Done.pdf` | เค้าโครงฉบับสมบูรณ์ |
| `Full-report-0209Update.pdf` | รายงานฉบับสมบูรณ์ 5 บท |
| `main.tex`, `chapter/` | ต้นฉบับ LaTeX ของเค้าโครง |
| `report/` | ต้นฉบับ LaTeX ของรายงาน (`report/chapter/` มีปก บทคัดย่อ และบทที่ 1 ถึง 5) |
| `references.bib` | รายการอ้างอิง ใช้ร่วมกันทั้งเค้าโครงและรายงาน |
| `figures/` | รูปทั้งหมดที่สคริปต์ใน `codingpy/` สร้างขึ้น |
| `Info.md` | ร่างเนื้อหาเค้าโครงก่อนแปลงเป็น LaTeX |
| `codingpy/` | โค้ด Python ทั้งหมด (จัดการแพ็กเกจด้วย uv) |
| `codingpy/data/` | ข้อมูลดิบและข้อมูลที่ทำความสะอาดแล้ว **ไม่ถูก commit** |

### ไฟล์โค้ดใน `codingpy/`

| ไฟล์ | หน้าที่ |
|---|---|
| `config.py` | ค่าคงที่ร่วม (seed = 42, พาธข้อมูล) ฟังก์ชันโหลดข้อมูล และ `passed_attention()` ที่ตัดผู้ไม่ผ่านข้อดัก |
| `labels.py` | แปลงคำตอบภาษาไทยเป็นป้ายภาษาอังกฤษ และเป็นรหัสตัวเลขสำหรับ SPSS |
| `clean_data.py` | ทำความสะอาดข้อมูลดิบ แปลงข้อความเป็นตัวเลข คิดคะแนน DASS-21 และเขียนไฟล์สำหรับ SPSS |
| `rich_console.py` | พิมพ์ DataFrame เป็นตารางอ่านง่ายในเทอร์มินัล |
| `reliability.py` | ค่าแอลฟาของครอนบาคแต่ละมิติ พร้อมช่วงความเชื่อมั่นแบบ bootstrap |
| `qr2.py` | คำถามข้อ 1 ถึง 3: สหสัมพันธ์ของชั่วโมงใช้งานและการติดตามข่าวกับสามมิติ พร้อม partial r |
| `q1_usage_dass.py` | คำถามข้อ 1: scatter plot ชั่วโมงใช้งานกับสามมิติ |
| `q3_news_anxiety.py` | คำถามข้อ 3: การติดตามข่าวกับสามมิติ |
| `q4_content_type.py` | คำถามข้อ 4: เทียบคะแนนระหว่าง 4 กลุ่มเนื้อหา (Kruskal-Wallis) |
| `q5_interaction_dass.py` | คำถามข้อ 5: ชั่วโมงใช้งานกับการนอน และพฤติกรรมในชีวิตประจำวันกับสามมิติ |
| `q6_regression.ipynb` | คำถามข้อ 6 และ 7: การถดถอยแบบลำดับขั้น VIF การตรวจข้อตกลงเบื้องต้น และ partial regression plot |
| `q6_gpa_finance.py` | เกรดเฉลี่ยและสภาพการเงินกับสามมิติ |
| `qr7.py` | สภาพการเงิน 3 กลุ่มกับสามมิติ (ANOVA) |
| `hypothesis_tests.py` | การทดสอบสมมติฐาน 4 แบบตามที่รายวิชากำหนด |
| `analysis.py` | กราฟ 3 มิติ โซเชียลมีเดีย × การนอน → คะแนน DASS รวม (ใช้ผู้ตอบทั้ง 121 คน) |
| `animation.py` | แอนิเมชัน what-if เพิ่มชั่วโมงการใช้โซเชียลมีเดียทีละชั่วโมง (ใช้ผู้ตอบทั้ง 121 คน) |

### วิธีคอมไพล์เอกสาร

ต้องมี XeLaTeX และฟอนต์ **TH Sarabun New** ติดตั้งในเครื่อง

```bash
latexmk -xelatex main.tex                 # เค้าโครง -> main.pdf
cd report && latexmk -xelatex main.tex    # รายงาน -> report/main.pdf
```

### วิธีรันโค้ดวิเคราะห์

ใช้ [uv](https://docs.astral.sh/uv/) จัดการแพ็กเกจ ไม่ต้องสร้าง virtual environment เอง
สคริปต์อ้างพาธแบบสัมพัทธ์ (อ่าน `data/` เขียน `../figures/`) จึง**ต้องรันจากโฟลเดอร์ `codingpy/`**

```bash
uv sync
cd codingpy

uv run python clean_data.py        # data/data.csv -> data/data_clean.csv (+ ไฟล์ SPSS)
uv run python reliability.py       # ค่าแอลฟาของ DASS-21
uv run python qr2.py               # คำถามข้อ 1-3
uv run python q4_content_type.py   # คำถามข้อ 4
uv run python q5_interaction_dass.py  # คำถามข้อ 5
uv run python qr7.py               # สภาพการเงิน
uv run python hypothesis_tests.py  # การทดสอบสมมติฐาน 4 แบบ
```

คำถามข้อ 6 และ 7 อยู่ใน `q6_regression.ipynb` ให้เปิดด้วย Jupyter แล้วรันทุกเซลล์

สคริปต์ที่วาดกราฟตั้ง backend เป็น `TkAgg` เพื่อเปิดหน้าต่างดูผลทันที
ถ้ารันบนเครื่องที่ไม่มีหน้าจอ ให้ลบบรรทัด `matplotlib.use("TkAgg")` ออก

### ข้อมูลและความเป็นส่วนตัว

- ผู้ตอบทุกคนกดยินยอมก่อนเข้าแบบสอบถาม และหยุดตอบได้ตลอดเวลา
- แบบสอบถามไม่เก็บชื่อ รหัสประจำตัวนักศึกษา อีเมล หรือข้อมูลที่ระบุตัวผู้ตอบได้
- โฟลเดอร์ `codingpy/data/` อยู่ใน `.gitignore` ข้อมูลผู้ตอบจึงไม่ขึ้นมาบนที่เก็บสาธารณะ
- ผลใช้ได้ในระดับกลุ่มเท่านั้น ไม่ใช่การวินิจฉัยรายบุคคล ผู้ที่มีข้อกังวลเรื่องสุขภาพจิตโทรสายด่วนสุขภาพจิต 1323 ได้ตลอด 24 ชั่วโมง

---

## English

### What this is

This project asks how much the time students spend on social media, and the type of content they
consume, relates to depression, anxiety and stress, and whether that relationship survives once sleep,
study pressure, grades and financial situation are controlled for. The repository holds the proposal,
the full report, the analysis code and the figures.

### Status

- Proposal finished: `Proposol-Done.pdf`
- Data collection finished: 121 responses, 107 analysed after removing attention-check failures (59 female, 48 male)
- All seven research questions analysed
- Five-chapter report written and under review: `Full-report-0209Update.pdf`

### About the data

The original plan was a public Kaggle dataset, but the topic-relevant datasets turned out to be
**synthetic**, generated for practice rather than collected from real respondents:

- Decimal digits spread evenly across all ten values, where real people favour round numbers
- Platform was tied to country in every row (LINE appeared only in Japan, for example)
- Variables measuring unrelated things correlated at 0.80 to 0.95
- Not a single missing value anywhere

The project therefore **ran its own online survey** at Khon Kaen University between
23 August and 3 September 2026, using the Thai DASS-21 plus items on sleep, exercise, study pressure,
GPA and financial sufficiency, and one attention-check item. The 14 respondents who failed the
attention check were removed, as the proposal specified.

### Results

From 107 respondents

- **Hours of social media use relate to none of the three dimensions** (r between −0.15 and −0.09).
  With the other variables controlled in a regression, the social media variables add at most 0.045
  to R², and the increase is not significant
- **Following negative news relates to anxiety more than to the other dimensions**, as expected,
  but not significantly (r = 0.15, p = 0.134; partial r = 0.17, p = 0.103). It only reaches
  significance when the attention-check failures are put back in, so it is not treated as a finding
- **Financial sufficiency separates depression scores most clearly**: the group short of money
  averages 16.6 against 6.6 for the comfortable group (F(2, 104) = 10.91, p < 0.001, η² = 0.17).
  Stress differs too (p = 0.008); anxiety does not (p = 0.153)
- **Sleep quality relates to depression and stress** (r = −0.28 and −0.32); hours of sleep and GPA do not
- DASS-21 reliability (Cronbach's alpha): depression 0.844, anxiety 0.737, stress 0.771

Chapter 4 of the report has the full results.

### Repository layout

| File / folder | Description |
|---|---|
| `Proposol-Done.pdf` | Finished proposal |
| `Full-report-0209Update.pdf` | Finished five-chapter report |
| `main.tex`, `chapter/` | LaTeX source of the proposal |
| `report/` | LaTeX source of the report (`report/chapter/` holds the cover, abstract and chapters 1 to 5) |
| `references.bib` | Bibliography shared by the proposal and the report |
| `figures/` | Every figure the scripts in `codingpy/` produce |
| `Info.md` | Proposal draft before conversion to LaTeX |
| `codingpy/` | All Python code (packages managed with uv) |
| `codingpy/data/` | Raw and cleaned survey data, **not committed** |

### Code in `codingpy/`

| File | Purpose |
|---|---|
| `config.py` | Shared constants (seed 42, data path), the loader, and `passed_attention()` which drops attention-check failures |
| `labels.py` | Thai answers to English labels, and labels to SPSS codes |
| `clean_data.py` | Cleans the raw export, parses free text into numbers, scores DASS-21, writes the SPSS files |
| `rich_console.py` | Prints wide DataFrames as readable terminal tables |
| `reliability.py` | Cronbach's alpha per dimension with a bootstrap confidence interval |
| `qr2.py` | Questions 1 to 3: hours of use and news-following against the three dimensions, with partial r |
| `q1_usage_dass.py` | Question 1: scatter plots of hours of use against the three dimensions |
| `q3_news_anxiety.py` | Question 3: news-following against the three dimensions |
| `q4_content_type.py` | Question 4: scores across the four content groups (Kruskal-Wallis) |
| `q5_interaction_dass.py` | Question 5: hours of use against sleep, and daily habits against the three dimensions |
| `q6_regression.ipynb` | Questions 6 and 7: hierarchical regression, VIF, assumption checks and the partial regression plot |
| `q6_gpa_finance.py` | GPA and financial sufficiency against the three dimensions |
| `qr7.py` | The three money groups against the three dimensions (ANOVA) |
| `hypothesis_tests.py` | The four hypothesis tests the course requires |
| `analysis.py` | 3D plot: social media × sleep → DASS-21 total (all 121 respondents) |
| `animation.py` | What-if animation: raise social media use one hour at a time (all 121 respondents) |

### Building the documents

Requires XeLaTeX and the **TH Sarabun New** font.

```bash
latexmk -xelatex main.tex                 # proposal -> main.pdf
cd report && latexmk -xelatex main.tex    # report -> report/main.pdf
```

### Running the analysis code

Packages are managed with [uv](https://docs.astral.sh/uv/), so no manual virtual environment is needed.
The scripts use relative paths (they read `data/` and write `../figures/`), so **run them from `codingpy/`**.

```bash
uv sync
cd codingpy

uv run python clean_data.py        # data/data.csv -> data/data_clean.csv (+ SPSS files)
uv run python reliability.py       # DASS-21 alpha
uv run python qr2.py               # questions 1-3
uv run python q4_content_type.py   # question 4
uv run python q5_interaction_dass.py  # question 5
uv run python qr7.py               # financial sufficiency
uv run python hypothesis_tests.py  # the four hypothesis tests
```

Questions 6 and 7 live in `q6_regression.ipynb`; open it in Jupyter and run every cell.

The plotting scripts set the `TkAgg` backend so a window opens straight away.
On a headless machine, delete the `matplotlib.use("TkAgg")` line.

### Data and privacy

- Every respondent gave consent before starting and could stop at any time
- The survey collects no names, student ID numbers, email addresses, or other identifying information
- `codingpy/data/` is listed in `.gitignore`, so respondent data never reaches the public repository
- The results describe the group, not individuals, and are not a diagnosis. Anyone worried about their
  mental health can call the Thai mental health hotline, 1323, at any hour

---

*Document written in Thai. Course: Data Science, second year.*
