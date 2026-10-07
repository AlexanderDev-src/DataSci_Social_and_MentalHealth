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

- เค้าโครงเสร็จแล้ว: `Report_Proposol-Done.pdf`
- เก็บข้อมูลเสร็จแล้ว ได้คำตอบ 121 ชุด ใช้วิเคราะห์ 107 คนที่ผ่านข้อดักความใส่ใจ (หญิง 59 ชาย 48)
- วิเคราะห์ครบทั้ง 7 คำถามวิจัย
- รายงาน 5 บทเขียนเสร็จแล้ว อยู่ระหว่างตรวจทาน: `Report_Full-report-0209Update1.pdf`
- บทความวิชาการรูปแบบ AUCC2027 (ภาษาไทย 7 หน้า ไม่ใส่ชื่อผู้แต่งตามแม่แบบ): `report_aucc/`

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
| `Report_Proposol-Done.pdf` | เค้าโครงฉบับสมบูรณ์ |
| `Report_Full-report-0209Update1.pdf` | รายงานฉบับสมบูรณ์ 5 บท |
| `main.tex`, `chapter/` | ต้นฉบับ LaTeX ของเค้าโครง |
| `report/` | ต้นฉบับ LaTeX ของรายงาน (`report/chapter/` มีปก บทคัดย่อ และบทที่ 1 ถึง 5) |
| `report_aucc/` | บทความวิชาการรูปแบบ AUCC2027 ไม่เกิน 8 หน้า เขียนด้วย LaTeX ตามแม่แบบ Word ของการประชุม (`template/`) รูปขนาดคอลัมน์สร้างด้วย `make_figures.py` |
| `references.bib` | รายการอ้างอิง ใช้ร่วมกันทั้งเค้าโครงและรายงาน |
| `figures/` | รูปทั้งหมดที่ notebook ใน `codingpy/` สร้างขึ้น |
| `Info.md` | ร่างเนื้อหาเค้าโครงก่อนแปลงเป็น LaTeX |
| `codingpy/` | โค้ด Python ทั้งหมด แบ่งเป็น notebook เรื่องละไฟล์ (จัดการแพ็กเกจด้วย uv) |
| `codingpy/data/` | ข้อมูลดิบและข้อมูลที่ทำความสะอาดแล้ว **ไม่ถูก commit** |
| `Website_for_presentation/` | เว็บสไลด์นำเสนอที่ปรับค่ากราฟได้ระหว่างนำเสนอ (Astro + React) วิธีรันอยู่ใน README ของโฟลเดอร์ |

### โค้ดใน `codingpy/`

โค้ดแบ่งเป็น notebook เรื่องละไฟล์ เรียงเลขตามขั้นตอนตั้งแต่นำเข้าข้อมูลจนถึงผลลัพธ์ และมีคำอธิบายกำกับทุกขั้น
แต่ละไฟล์เปิดและรันแยกกันได้ ขอเพียงรัน `01_data_preparation.ipynb` ก่อนหนึ่งครั้งเพื่อสร้าง `data/data_clean.csv` ที่ไฟล์อื่นอ่าน
ค่าตั้งที่ใช้ร่วมกันอยู่ใน `common.py` ซึ่งทุก notebook import

| ไฟล์ใน `codingpy/` | หน้าที่ |
|---|---|
| `common.py` | พาธข้อมูล ค่าคงที่ร่วม (seed = 42) ฟอนต์ภาษาไทยของกราฟ และฟังก์ชันที่ใช้มากกว่าหนึ่งไฟล์ |
| `00_overview.ipynb` | บทนำ คำถามวิจัย แหล่งข้อมูล และวิธีรัน |
| `01_data_preparation.ipynb` | อ่านไฟล์คำตอบ `data/data.csv` แปลงคำตอบภาษาไทยเป็นป้ายภาษาอังกฤษและรหัสตัวเลขสำหรับ SPSS แปลงข้อความเป็นตัวเลข คิดคะแนน DASS-21 และตัดผู้ไม่ผ่านข้อดัก |
| `02_reliability.ipynb` | ค่าแอลฟาของครอนบาคแต่ละมิติ พร้อมช่วงความเชื่อมั่นแบบ bootstrap |
| `03_q1_q3_correlation.ipynb` | คำถามข้อ 1 ถึง 3: scatter plot และสหสัมพันธ์ของชั่วโมงใช้งานและการติดตามข่าวกับสามมิติ พร้อม partial r |
| `04_q4_content_type.ipynb` | คำถามข้อ 4: เทียบคะแนนระหว่าง 4 กลุ่มเนื้อหา (Kruskal-Wallis) |
| `05_q5_sleep_habits.ipynb` | คำถามข้อ 5: ชั่วโมงใช้งานกับการนอน และพฤติกรรมในชีวิตประจำวันกับสามมิติ |
| `06_q6_q7_regression.ipynb` | คำถามข้อ 6 และ 7: การถดถอยแบบลำดับขั้น VIF การตรวจข้อตกลงเบื้องต้น และ partial regression plot |
| `07_gpa_finance.ipynb` | เกรดเฉลี่ยกับสามมิติ และสภาพการเงิน 3 กลุ่มกับสามมิติ (ANOVA) |
| `08_hypothesis_tests.ipynb` | การทดสอบสมมติฐาน 4 แบบตามที่รายวิชากำหนด |
| `09_3d_what_if.ipynb` | โซเชียลมีเดีย × การนอน → คะแนน DASS รวม และแอนิเมชันเพิ่มชั่วโมงใช้งานทีละชั่วโมง (ใช้ผู้ตอบทั้ง 121 คน) |
| `10_export_website.ipynb` | ส่งออกค่าสถิติรวม (ไม่มีข้อมูลรายคน) ให้เว็บใน `Website_for_presentation/` |
| `11_summary.ipynb` | ผลของคำถามทั้ง 7 ข้อ ข้อค้นพบหลัก และข้อจำกัด |

### วิธีคอมไพล์เอกสาร

ต้องมี XeLaTeX และฟอนต์ **TH Sarabun New** ติดตั้งในเครื่อง

```bash
latexmk -xelatex main.tex                 # เค้าโครง -> main.pdf
cd report && latexmk -xelatex main.tex    # รายงาน -> report/main.pdf
cd report_aucc && latexmk -xelatex main.tex    # บทความ AUCC -> report_aucc/main.pdf
```

### วิธีรันโค้ดวิเคราะห์

ใช้ [uv](https://docs.astral.sh/uv/) จัดการแพ็กเกจ ไม่ต้องสร้าง virtual environment เอง
ไลบรารีที่ใช้คือ numpy, pandas, scipy, statsmodels และ matplotlib
วางไฟล์คำตอบแบบสอบถามไว้ที่ `codingpy/data/data.csv` (ไฟล์นี้ไม่อยู่ใน repo) แล้วรัน

```bash
uv sync
uv run jupyter lab codingpy/    # เปิดไฟล์ที่ต้องการ แล้วเลือก Run > Run All Cells
```

หรือรันทุกไฟล์ตามลำดับเลขโดยไม่เปิดหน้าจอ

```bash
uv run jupyter nbconvert --to notebook --execute --inplace codingpy/[0-9]*.ipynb
```

Notebook อ่าน `data/` และเขียนรูปลง `../figures/` เปิดจากโฟลเดอร์ `codingpy/` หรือจากรากของ repo ก็ได้

บน Google Colab หนึ่ง notebook คือหนึ่ง session จึงต้องอัปโหลด `common.py` เข้า session ก่อนรันทุกครั้ง
`01_data_preparation.ipynb` จะเปิดช่องให้อัปโหลด `data.csv` ส่วนไฟล์ `02` เป็นต้นไปต้องมี `data/data_clean.csv`
ที่ไฟล์ `01` เขียนไว้อยู่ใน session ด้วย รูปจะถูกเขียนลงโฟลเดอร์ `figures/` ข้าง notebook

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

- Proposal finished: `Report_Proposol-Done.pdf`
- Data collection finished: 121 responses, 107 analysed after removing attention-check failures (59 female, 48 male)
- All seven research questions analysed
- Five-chapter report written and under review: `Report_Full-report-0209Update1.pdf`
- AUCC2027 conference paper (Thai, 7 pages, anonymous as the template requires): `report_aucc/`

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
| `Report_Proposol-Done.pdf` | Finished proposal |
| `Report_Full-report-0209Update1.pdf` | Finished five-chapter report |
| `main.tex`, `chapter/` | LaTeX source of the proposal |
| `report/` | LaTeX source of the report (`report/chapter/` holds the cover, abstract and chapters 1 to 5) |
| `report_aucc/` | AUCC2027 conference paper, 8 pages at most, in LaTeX following the conference Word template (`template/`); `make_figures.py` draws the column-width figures |
| `references.bib` | Bibliography shared by the proposal and the report |
| `figures/` | Every figure the notebooks in `codingpy/` produce |
| `Info.md` | Proposal draft before conversion to LaTeX |
| `codingpy/` | All Python code, one notebook per topic (packages managed with uv) |
| `codingpy/data/` | Raw and cleaned survey data, **not committed** |
| `Website_for_presentation/` | Presentation site with charts the presenter adjusts live (Astro + React); its README explains how to run it |

### Code in `codingpy/`

The code is split into one notebook per topic, numbered in working order from data import to results, with every step explained.
Each file opens and runs on its own once `01_data_preparation.ipynb` has run and written `data/data_clean.csv`, which the others read.
The shared setup lives in `common.py`, which every notebook imports.

| File in `codingpy/` | Purpose |
|---|---|
| `common.py` | Data paths, shared constants (seed 42), the Thai font for the figures, and the helpers more than one notebook uses |
| `00_overview.ipynb` | Introduction, research questions, data source and how to run |
| `01_data_preparation.ipynb` | Reads the survey export `data/data.csv`; Thai answers to English labels and SPSS codes, free text to numbers, DASS-21 scoring, and dropping attention-check failures |
| `02_reliability.ipynb` | Cronbach's alpha per dimension with a bootstrap confidence interval |
| `03_q1_q3_correlation.ipynb` | Questions 1 to 3: scatter plots and correlations of hours of use and news-following against the three dimensions, with partial r |
| `04_q4_content_type.ipynb` | Question 4: scores across the four content groups (Kruskal-Wallis) |
| `05_q5_sleep_habits.ipynb` | Question 5: hours of use against sleep, and daily habits against the three dimensions |
| `06_q6_q7_regression.ipynb` | Questions 6 and 7: hierarchical regression, VIF, assumption checks and the partial regression plot |
| `07_gpa_finance.ipynb` | GPA against the three dimensions, and the three money groups against the three dimensions (ANOVA) |
| `08_hypothesis_tests.ipynb` | The four hypothesis tests the course requires |
| `09_3d_what_if.ipynb` | Social media × sleep → DASS-21 total, and the animation that raises use one hour at a time (all 121 respondents) |
| `10_export_website.ipynb` | Writes the summary statistics (no respondent rows) that `Website_for_presentation/` draws from |
| `11_summary.ipynb` | The answer to each of the seven questions, the main findings and the limitations |

### Building the documents

Requires XeLaTeX and the **TH Sarabun New** font.

```bash
latexmk -xelatex main.tex                 # proposal -> main.pdf
cd report && latexmk -xelatex main.tex    # report -> report/main.pdf
cd report_aucc && latexmk -xelatex main.tex    # AUCC paper -> report_aucc/main.pdf
```

### Running the analysis code

Packages are managed with [uv](https://docs.astral.sh/uv/), so no manual virtual environment is needed.
The libraries used are numpy, pandas, scipy, statsmodels and matplotlib.
Put the survey export at `codingpy/data/data.csv` (it is not in the repository), then run:

```bash
uv sync
uv run jupyter lab codingpy/    # open the file you want, then Run > Run All Cells
```

Or execute every file in numbered order without opening them:

```bash
uv run jupyter nbconvert --to notebook --execute --inplace codingpy/[0-9]*.ipynb
```

The notebooks read `data/` and write figures to `../figures/`; open them from `codingpy/` or from the repository root.

On Google Colab one notebook is one session, so upload `common.py` into the session before each run.
`01_data_preparation.ipynb` opens an upload prompt for `data.csv`; from `02` onwards the session also needs the
`data/data_clean.csv` that `01` wrote. Figures go to a `figures/` folder beside the notebook.

### Data and privacy

- Every respondent gave consent before starting and could stop at any time
- The survey collects no names, student ID numbers, email addresses, or other identifying information
- `codingpy/data/` is listed in `.gitignore`, so respondent data never reaches the public repository
- The results describe the group, not individuals, and are not a diagnosis. Anyone worried about their
  mental health can call the Thai mental health hotline, 1323, at any hour

---

*Document written in Thai. Course: Data Science, second year.*
