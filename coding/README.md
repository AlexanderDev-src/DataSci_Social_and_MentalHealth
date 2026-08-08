# coding — สำรวจข้อมูล + ทำกราฟ

โค้ดของเค้าโครงโครงงาน **Student Social Media & Mental Health Impact**
ทำงานใน Jupyter notebook ทั้งหมด จัดการแพ็กเกจด้วย [uv](https://docs.astral.sh/uv/)

## เริ่มยังไง

```fish
cd coding
uv run jupyter lab      # แล้วเปิด notebooks/explore.ipynb
```

ครั้งแรก uv จะสร้าง `.venv/` แล้วลงแพ็กเกจตาม `uv.lock` ให้เอง ไม่ต้อง `pip install`
ใน JupyterLab เลือก kernel **Python 3 (ipykernel)** (ตัว default ก็คือ `.venv` นี้แล้ว)

## ไฟล์อะไรอยู่ตรงไหน

| | |
|---|---|
| `notebooks/explore.ipynb` | โน้ตบุ๊กหลัก — โหลดข้อมูลจาก Kaggle, สำรวจ, วาดกราฟ |
| `data/` | ไฟล์ `.csv` (โน้ตบุ๊กโหลดมาให้เอง — ไม่ commit ขึ้น git) |
| `pyproject.toml` + `uv.lock` | รายการแพ็กเกจ |

รูปที่จะใช้จริงให้เซฟไปที่ `proposal/figures/` แล้วอ้างใน LaTeX ได้เลย
(`main.tex` ตั้ง `\graphicspath{{figures/}}` ไว้แล้ว จึงใส่แค่ชื่อไฟล์)

## ข้อมูล

<https://www.kaggle.com/datasets/shivasingh4945/student-social-media-and-mental-health-impact>

โน้ตบุ๊กใช้ `kagglehub` โหลดให้อัตโนมัติ ชุดนี้เป็น public เลยไม่ต้องมี API token
ถ้ามีไฟล์ใน `data/` อยู่แล้วจะข้ามการโหลด (รันตอนไม่มีเน็ตก็ได้)

5,000 แถว 13 คอลัมน์ ไม่มีค่าว่าง — **แต่ค่าสหสัมพันธ์สูงผิดปกติ**
(เวลาใช้งาน ↔ จำนวนครั้งปลดล็อก r ≈ 0.96) ข้อมูลแบบสอบถามจริงแทบไม่เคยสวยขนาดนี้
น่าจะเป็นข้อมูลที่ generate ขึ้น ต้องเช็กหน้า dataset แล้วเขียนกำกับไว้ในเล่มด้วย

## คำสั่ง uv ที่ใช้บ่อย

```fish
uv run jupyter lab           # เปิด notebook
uv run python                # REPL ที่มีแพ็กเกจครบ
uv add <package>             # เพิ่มแพ็กเกจ (แก้ pyproject.toml + uv.lock ให้เอง)
uv add --dev <package>       # แพ็กเกจที่ใช้ตอนพัฒนา เช่น jupyterlab
uv sync                      # ลงของให้ตรงกับ uv.lock (เช่นตอนย้ายเครื่อง)
```
