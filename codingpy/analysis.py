# %%
import matplotlib

matplotlib.use("QtAgg")  # ตัดออกได้ถ้ารันในเครื่องตัวเอง
import matplotlib.pyplot as plt
import seaborn as sns
from clean_data import CLEAN_PATH
from config import SEED, load_data, setup
from rich_console import console, print_df, print_series

setup()
df = load_data(CLEAN_PATH)
console.print(
    f"[green]load_data:[/green] {df.shape[0]} row, {df.shape[1]} columns (seed={SEED})"
)

# %%

print_df(df, rows=1)
# print_df(df.describe().round(2), title="describe", index=True)

# %%
sns.regplot(
    data=df,
    x="dass_total",
    y="GPA",
    scatter_kws={"alpha": 0.4},
    line_kws={"color": "red"},
)
plt.xlabel("DASS total")
plt.ylabel("GPA")
plt.show()
