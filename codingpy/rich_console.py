"""Pretty-print a pandas DataFrame to the terminal with rich.

Wide frames are split into column batches that fit the terminal, so a
39-column frame stays readable instead of collapsing into empty cells.
"""

import pandas as pd
from rich import box
from rich.console import Console
from rich.table import Table

console = Console()

MIN_COL_WIDTH = 6
MAX_COL_WIDTH = 32


def _cell(value, limit: int = MAX_COL_WIDTH) -> str:
    """Stringify one value, clipping long free text so it stays one line."""
    if pd.isna(value):
        return ""
    text = str(value)
    return text if len(text) <= limit else text[: limit - 1] + "\u2026"


def _column_widths(frame: pd.DataFrame) -> list[int]:
    """Width each column needs: the wider of its header and its values."""
    widths = []
    for col in frame.columns:
        body = max((len(_cell(v)) for v in frame[col]), default=0)
        header = min(len(str(col)), MAX_COL_WIDTH)
        widths.append(max(header, body, MIN_COL_WIDTH))
    return widths


def _batch_columns(frame: pd.DataFrame, budget: int) -> list[list[str]]:
    """Group columns into batches whose rendered width fits `budget`."""
    batches: list[list[str]] = []
    current: list[str] = []
    used = 0
    for col, width in zip(frame.columns, _column_widths(frame)):
        cost = width + 3  # padding plus the column separator
        if current and used + cost > budget:
            batches.append(current)
            current, used = [], 0
        current.append(col)
        used += cost
    if current:
        batches.append(current)
    return batches


def _render(frame: pd.DataFrame, title: str | None, index: bool) -> None:
    table = Table(title=title, box=box.SIMPLE_HEAD)
    if index:
        table.add_column(str(frame.index.name or ""), style="bold")
    for col in frame.columns:
        justify = "right" if pd.api.types.is_numeric_dtype(frame[col]) else "left"
        table.add_column(
            _cell(col), justify=justify, max_width=MAX_COL_WIDTH, overflow="ellipsis"
        )

    for label, row in zip(frame.index, frame.itertuples(index=False)):
        cells = [_cell(v) for v in row]
        if index:
            cells.insert(0, str(label))
        table.add_row(*cells)
    console.print(table)


def print_df(
    df: pd.DataFrame,
    rows: int = 20,
    title: str | None = None,
    index: bool = False,
) -> None:
    """Print the first `rows` rows of `df` as one or more rich tables.

    Set `index` to True for frames whose row labels matter, such as the
    output of df.describe() or df.corr().
    """
    head = df.head(rows)
    index_width = max((len(str(i)) for i in head.index), default=0) + 3 if index else 0
    batches = _batch_columns(head, console.width - index_width)

    for n, cols in enumerate(batches, start=1):
        part = f" ({n}/{len(batches)})" if len(batches) > 1 else ""
        _render(head[cols], f"{title}{part}" if title else None, index)

    shown = min(rows, len(df))
    console.print(
        f"[dim]showing {shown} of {len(df)} rows x {len(df.columns)} columns[/dim]"
    )


def print_series(s: pd.Series, rows: int = 20, title: str | None = None) -> None:
    """Print a Series as a two-column rich table."""
    print_df(s.to_frame(name=s.name or "value"), rows=rows, title=title, index=True)
