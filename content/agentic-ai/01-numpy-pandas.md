Everything in this half of the course is a table and a number. NumPy holds the
numbers; pandas puts names on them. Two libraries, and almost every tool you
meet later — scikit-learn, PyTorch, an embedding store — takes one of their
objects as input or hands one back.

This is a tour, not a course. You need enough to load a file, look at it, fix
what is wrong with it and hand it on. That is genuinely most of the job.

## Why NumPy exists

A Python list of a million numbers is a million separate objects, each with a
type tag and a reference count, scattered across memory. A NumPy array is one
block of memory holding a million numbers of the same type, end to end.

```python
import numpy as np

python_list = list(range(1_000_000))
numpy_array = np.arange(1_000_000)

sum(python_list)      # ~7 ms — a Python loop
numpy_array.sum()     # ~0.4 ms — one C loop over contiguous memory
```

That ratio is the whole reason the scientific stack is built on it. Anything
you can express as an operation on a whole array runs at C speed; anything you
write as a `for` loop over an array runs at Python speed, and you have lost
the point.

## Arrays

```python
a = np.array([1, 2, 3, 4])
a.shape        # (4,)      — one dimension, four elements
a.dtype        # int64     — every element the same type

m = np.array([[1, 2, 3],
              [4, 5, 6]])
m.shape        # (2, 3)    — two rows, three columns
m.T.shape      # (3, 2)    — transposed
```

`shape` is the thing to keep in your head. Most errors in this half of the
course are shape errors, and the traceback usually tells you both shapes.

## Vectorised thinking

Arithmetic applies element by element, with no loop:

```python
marks = np.array([72, 85, 60, 91, 48])

marks + 5             # array([77, 90, 65, 96, 53])
marks / 100           # array([0.72, 0.85, 0.6 , 0.91, 0.48])
marks > 70            # array([ True,  True, False,  True, False])
marks[marks > 70]     # array([72, 85, 91])  — boolean masking
```

That last line is the pattern you will use constantly: build a boolean array,
use it to select. It reads as a filter and runs as one pass.

```python
marks.mean()          # 71.2
marks.std()           # 15.5...
np.where(marks >= 60, "pass", "fail")
# array(['pass', 'pass', 'pass', 'pass', 'fail'], dtype='<U4')
```

## Broadcasting

When shapes differ, NumPy stretches the smaller one if it can:

```python
scores = np.array([[70, 80],
                   [60, 90],
                   [88, 75]])       # (3, 2) — three students, two tests

weights = np.array([0.4, 0.6])      # (2,)   — the second test counts more

(scores * weights).sum(axis=1)      # array([76., 78., 80.2])
```

`weights` was stretched down all three rows. The rule: compare shapes from the
right; dimensions must match or be 1. When you get a broadcast error, print
both `.shape` values and the mismatch is usually obvious.

`axis` is the other thing to internalise. `axis=0` collapses down the rows
(one number per column), `axis=1` collapses across the columns (one number per
row). Say it out loud as "the axis that disappears".

## pandas: names on the numbers

A `DataFrame` is a table of columns, each column a NumPy array with a name and
an index.

```python
import pandas as pd

df = pd.DataFrame({
    "name":  ["Anita", "Ravi", "Meera", "Karthik"],
    "city":  ["Bengaluru", "Hyderabad", "Bengaluru", "Chennai"],
    "marks": [72, 85, None, 91],
})

df.head()
df.info()          # column names, non-null counts, dtypes — read this first
df.describe()      # count, mean, std, min, quartiles, max for numeric columns
```

`info()` before anything else. It tells you how many rows are missing in each
column and whether a column you think is a number is actually a string —
which is the single most common surprise in a real file.

## Selecting

```python
df["marks"]                       # one column, a Series
df[["name", "marks"]]             # several columns, a DataFrame
df[df["city"] == "Bengaluru"]     # rows matching a condition

df.loc[df["marks"] > 80, "name"]  # label-based: rows by condition, one column
df.iloc[0:2]                      # position-based: first two rows
```

`loc` takes labels and conditions, `iloc` takes integer positions. Mixing them
up is the second most common surprise.

## Missing data

```python
df["marks"].isna().sum()          # 1 — how many are missing

df.dropna(subset=["marks"])       # drop those rows
df.fillna({"marks": df["marks"].mean()})   # or fill them
```

Neither is automatically right. Dropping loses information; filling with the
mean invents a value and shrinks the variance. Decide deliberately and write
down which you chose — a model trained on quietly invented numbers is a model
you cannot explain.

## Grouping

The single most useful operation in the library:

```python
df.groupby("city")["marks"].mean()
# city
# Bengaluru    72.0
# Chennai      91.0
# Hyderabad    85.0

df.groupby("city").agg(
    students=("name", "count"),
    average=("marks", "mean"),
    best=("marks", "max"),
)
```

If you have written SQL, this is `GROUP BY` with the same semantics: split by
key, apply a function, combine the results. The mental model transfers exactly.

## Joining

```python
courses = pd.DataFrame({
    "city": ["Bengaluru", "Hyderabad"],
    "centre": ["Indiranagar", "Madhapur"],
})

df.merge(courses, on="city", how="left")
```

`how` is the same set of joins as SQL: `inner`, `left`, `right`, `outer`. After
any merge, check the row count. If it went up, your join key was not unique on
one side and you have quietly duplicated rows — the classic silent bug in a
data pipeline.

## Reading and writing

```python
df = pd.read_csv("students.csv")
df = pd.read_csv("students.csv", parse_dates=["joined_on"])
df = pd.read_excel("students.xlsx", sheet_name="Sep")
df = pd.read_sql("SELECT * FROM students", connection)

df.to_csv("clean.csv", index=False)      # index=False, almost always
df.to_parquet("clean.parquet")           # smaller, typed, faster to reload
```

`index=False` matters: without it pandas writes its row numbers as an unnamed
first column, and the next person to read the file gets a mystery column
called `Unnamed: 0`.

## What to remember

| Thing | Why it matters |
| --- | --- |
| `df.info()` | The first thing to run on any file |
| `shape` | Nearly every error is a shape error |
| Boolean masking | Filtering without a loop |
| `groupby().agg()` | SQL's GROUP BY, same mental model |
| Row count after a merge | Catches duplicate join keys |
| `axis=0` vs `axis=1` | The axis that disappears |

---

**Practice.** Project 1 is a small pandas exercise against a messy file. Do the
reading here, then go and break something real — that is where it sticks.
