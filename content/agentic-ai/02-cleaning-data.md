Real files are not the tidy DataFrames of a tutorial. Dates arrive as strings
in three formats, a "number" column contains `1,200` and `N/A`, the same city
appears as `Bengaluru`, `bengaluru` and `Bangalore `, and one row is the
spreadsheet's own header repeated halfway down.

Cleaning is most of the work, and it is where the mistakes that matter happen
— because a bad clean does not crash, it just quietly changes the answer.

## Look before you touch

```python
df = pd.read_csv("enrolments.csv")

df.shape                    # how many rows and columns
df.info()                   # dtypes and non-null counts
df.head(20)                 # the actual values
df.isna().sum()             # missing per column
df.duplicated().sum()       # exact duplicate rows
df.nunique()                # cardinality — spots ID columns and constants
```

Then, for every column you plan to rely on:

```python
df["city"].value_counts(dropna=False)
```

`value_counts` is the single most useful diagnostic in pandas. It shows you
the casing problems, the trailing spaces, the three spellings of the same
city and the `-` someone typed for "unknown", all at once.

## Types that lie

A column of numbers that pandas read as `object` means at least one value is
not a number.

```python
df["fee"].dtype                       # object — not int64. Why?

pd.to_numeric(df["fee"], errors="coerce").isna() & df["fee"].notna()
# True on exactly the rows that failed to parse — look at those
```

Fix the cause, then convert:

```python
df["fee"] = (
    df["fee"].astype(str)
      .str.replace(",", "", regex=False)
      .str.strip()
      .replace({"N/A": None, "-": None, "": None})
)
df["fee"] = pd.to_numeric(df["fee"], errors="coerce")
```

`errors="coerce"` turns anything unparseable into `NaN` rather than raising.
That is what you want *after* you have looked at the failures — not instead of
looking at them.

Dates are the same story:

```python
df["joined_on"] = pd.to_datetime(df["joined_on"], errors="coerce")
df["joined_on"].isna().sum()          # how many failed — check before moving on
```

If your data is Indian and has day-first dates, say so, or `03/04/2026` becomes
the third of April in one row and the fourth of March in another:

```python
pd.to_datetime(df["joined_on"], dayfirst=True, errors="coerce")
```

## Text that nearly matches

```python
df["city"] = (
    df["city"].str.strip()
              .str.lower()
              .replace({"bangalore": "bengaluru", "blr": "bengaluru"})
              .str.title()
)
```

Strip, normalise case, map the known aliases, then present. Doing it in that
order means the alias map only has to contain lower-case keys.

## Duplicates

```python
df.duplicated().sum()                             # identical rows
df.duplicated(subset=["email"]).sum()             # same person twice

df = df.drop_duplicates(subset=["email"], keep="last")
```

`keep="last"` assumes later rows are corrections. That is an assumption about
your data, not a fact about pandas — sort the frame first so "last" means what
you think it means.

## Missing values, deliberately

There is no default answer. There is a decision, per column:

| Situation | Reasonable choice |
| --- | --- |
| A few rows, and the column is essential | Drop those rows |
| Numeric, missing at random, needed by a model | Fill with median; add an `x_was_missing` flag |
| Categorical | Fill with the literal `"unknown"` — it is a real category |
| Missing *means* something (no payment yet) | Fill with 0 and say so |
| Most of the column is missing | Drop the column |

```python
df["marks_missing"] = df["marks"].isna()
df["marks"] = df["marks"].fillna(df["marks"].median())
```

The flag column is worth the trouble. It lets a model learn that "we did not
have this" is itself informative, which it very often is.

## Reshaping

Wide to long, and back:

```python
wide = pd.DataFrame({
    "student": ["Anita", "Ravi"],
    "test_1": [70, 60],
    "test_2": [80, 90],
})

long = wide.melt(id_vars="student", var_name="test", value_name="marks")
#   student    test  marks
#     Anita  test_1     70
#      Ravi  test_1     60
#     Anita  test_2     80
#      Ravi  test_2     90

long.pivot(index="student", columns="test", values="marks")   # back to wide
```

Long format is what plotting libraries and most models want. Wide is what
humans want to read. Learn to move between them without thinking.

## The sanity checks that catch real bugs

Run these after every transformation:

```python
before = len(df)
df = df.merge(payments, on="student_id", how="left")
assert len(df) == before, f"merge changed row count: {before} -> {len(df)}"
```

```python
assert df["marks"].between(0, 100).all(), "marks out of range"
assert df["student_id"].is_unique, "duplicate student ids"
assert df["joined_on"].max() <= pd.Timestamp.today(), "a date in the future"
```

An `assert` that fires in your face is worth ten charts that quietly look
plausible. This is the habit that separates an analysis you can defend from
one you cannot.

## Method chaining

Once you trust the steps, write them as one pipeline. It reads top to bottom
and never mutates the original:

```python
clean = (
    pd.read_csv("enrolments.csv")
      .rename(columns=str.lower)
      .assign(
          city=lambda d: d["city"].str.strip().str.title(),
          fee=lambda d: pd.to_numeric(
              d["fee"].astype(str).str.replace(",", ""), errors="coerce"
          ),
          joined_on=lambda d: pd.to_datetime(d["joined_on"], dayfirst=True,
                                             errors="coerce"),
      )
      .drop_duplicates(subset=["email"], keep="last")
      .query("fee.notna() and joined_on.notna()")
      .reset_index(drop=True)
)
```

Avoid `inplace=True`. It saves nothing, breaks chaining, and makes it harder to
tell what a line actually did.

## A warning you will see

> SettingWithCopyWarning: A value is trying to be set on a copy of a slice

You wrote something like `df[df["x"] > 1]["y"] = 0`. pandas cannot tell whether
you meant to change the original or the filtered copy. Use `.loc`:

```python
df.loc[df["x"] > 1, "y"] = 0
```

Treat the warning as an error. When it appears, one of your edits is landing
somewhere you did not intend.

---

**Practice.** Project 1 hands you a deliberately messy file and asks for a
clean one plus the decisions you made. The decisions are the marked part.
