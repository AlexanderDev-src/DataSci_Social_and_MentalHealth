# proposal-viz

โค้ดทำกราฟของเค้าโครงโครงงาน **Student Social Media & Mental Health Impact**
(จัดการ environment ด้วย [uv](https://docs.astral.sh/uv/) — ไม่ต้อง `pip install` เอง)

## รัน

```fish
cd coding
uv run proposal-viz          # สร้างกราฟทั้ง 4 ใบลงใน output/
```

ครั้งแรกที่รัน uv จะสร้าง `.venv/` และลงแพ็กเกจตาม `uv.lock` ให้เอง

## เล่นใน notebook

```fish
cd coding
uv run jupyter lab           # แล้วเปิด notebooks/explore.ipynb
```

`explore.ipynb` โหลด `proposal_viz` มาใช้ได้เลย (uv ลง package แบบ editable ให้)
และเปิด `autoreload` ไว้ — แก้ `plots.py` แล้วรันเซลล์ใหม่ได้ ไม่ต้อง restart kernel

แบ่งงานกันแบบนี้: **ลองในโน้ตบุ๊ก → พอใจแล้วย้ายเป็นฟังก์ชันใน `plots.py`**
ของที่จะใส่ในเล่มควรอยู่ใน `plots.py` เพราะสั่ง `uv run proposal-viz` แล้วได้รูปเดิมทุกครั้ง
ส่วนโน้ตบุ๊กรันสลับลำดับเซลล์เมื่อไหร่ผลก็เพี้ยนได้

## คำสั่ง uv ที่ใช้บ่อย

```fish
uv run python                # python ที่มี pandas/numpy/matplotlib/seaborn พร้อมแล้ว
uv run python my_script.py
uv add <package>             # เพิ่มแพ็กเกจ (แก้ pyproject.toml + uv.lock ให้อัตโนมัติ)
uv add --dev <package>       # แพ็กเกจที่ใช้ตอนพัฒนาเท่านั้น เช่น jupyterlab
uv sync                      # ลงของให้ตรงกับ uv.lock (เช่นตอนย้ายเครื่อง)
```

## ข้อมูล

วางไฟล์ `.csv` จาก Kaggle ไว้ใน `data/` แล้วโค้ดจะอ่านไฟล์แรกที่เจอ
**ถ้า `data/` ว่าง จะใช้ข้อมูลจำลอง (synthetic) แทน** เพื่อให้ทดสอบกราฟได้ก่อน
กราฟที่ได้จากข้อมูลจำลองจะมีข้อความกำกับใต้รูปเสมอ — อย่าเอาไปใส่ในเล่มโดยไม่ดูให้ดี

ชุดข้อมูล: <https://www.kaggle.com/datasets/shivasingh4945/student-social-media-and-mental-health-impact>

คอลัมน์ที่โค้ดใช้ (ถ้าไฟล์จริงชื่อคอลัมน์ไม่ตรง ต้องแก้ชื่อใน `data.py` ก่อน):
`usage_hours`, `sleep_hours`, `physical_activity`, `stress_score`,
`depression_score`, `gpa`, `main_platform`, `year`

## ไฟล์อะไรอยู่ตรงไหน

| ไฟล์ | หน้าที่ |
|---|---|
| `notebooks/explore.ipynb` | ที่ไว้ลองเล่น สำรวจข้อมูล ลองกราฟใหม่ ๆ |
| `src/proposal_viz/__init__.py` | `main()` — วนสร้างกราฟทุกใบแล้วเซฟลง `output/` |
| `src/proposal_viz/data.py` | อ่าน csv จาก `data/` หรือสร้างข้อมูลจำลอง |
| `src/proposal_viz/style.py` | สี ฟอนต์ไทย (TH Sarabun New ตัวเดียวกับเล่ม) และ rcParams |
| `src/proposal_viz/plots.py` | กราฟ 4 ใบ — หนึ่งฟังก์ชันต่อหนึ่งรูป |

กราฟที่มี:

1. `01-usage-distribution` — ฮิสโทแกรมเวลาใช้โซเชียลต่อวัน (แกน y เป็น % ด้วย `mticker.PercentFormatter`)
2. `02-usage-vs-depression` — scatter เวลาใช้งาน × คะแนนซึมเศร้า + เส้นค่าเฉลี่ยรายช่วง
3. `03-stress-by-platform` — แท่งแนวนอน คะแนนเครียดเฉลี่ยแยกตามแพลตฟอร์ม
4. `04-correlation` — heatmap สหสัมพันธ์ (น้ำเงิน = ลบ, แดง = บวก)

## จะเอารูปไปใส่ในเล่ม

`output/` ไม่ถูก commit (เป็นของ generate ใหม่ได้) — เลือกรูปที่จะใช้จริง ก็อปไปไว้ที่
`proposal/figures/` แล้วอ้างใน LaTeX ตามปกติ:

```latex
\begin{figure}[H]
  \centering
  \includegraphics[width=0.8\textwidth]{01-usage-distribution.png}
  \caption{...}
\end{figure}
```

`main.tex` ตั้ง `\graphicspath{{figures/}}` ไว้แล้ว จึงไม่ต้องใส่ path เต็ม
