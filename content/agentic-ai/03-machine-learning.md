This is one pass over machine learning: enough to recognise the shape of a
problem, run a baseline, and read the number honestly. It is not enough to
design a model, and it is not trying to be — you will spend the rest of the
course on agents, where this is the supporting act.

We use scikit-learn throughout. The API is four methods wide and every model
in the library obeys it.

## The shape of the problem

| You have | You want | That is |
| --- | --- | --- |
| Labelled rows, a number to predict | 71.5 | Regression |
| Labelled rows, a category to predict | "will churn" | Classification |
| Unlabelled rows | Groups | Clustering |
| Anything, too many columns | Fewer columns | Dimensionality reduction |

Naming this correctly is most of the work. The rest is picking a model that
matches, and almost any reasonable model will do for a first pass.

## The four methods

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)          # learn
model.predict(X_test)                # predict
model.score(X_test, y_test)          # a default metric
```

`fit`, `predict`, `score`, and `transform` for anything that reshapes data.
Swap `LogisticRegression` for `RandomForestClassifier` and nothing else in
your code changes. That consistency is the library's real contribution.

## Splitting, and why it is not optional

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
```

A model scored on the data it learned from tells you nothing — it can memorise
and score 100%. The test set is the only honest number you have, and it stops
being honest the moment you start tuning against it.

`stratify=y` keeps the class balance the same in both halves. Without it, a
rare class can end up entirely in one side.

If your data has a time dimension, do **not** split randomly. Train on the
past and test on the future, or you have let the model see tomorrow:

```python
from sklearn.model_selection import TimeSeriesSplit
```

## A worked baseline

```python
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric = ["age", "marks", "fee"]
categorical = ["city", "course"]

pre = ColumnTransformer([
    ("num", Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("scale", StandardScaler()),
    ]), numeric),
    ("cat", Pipeline([
        ("impute", SimpleImputer(strategy="most_frequent")),
        ("encode", OneHotEncoder(handle_unknown="ignore")),
    ]), categorical),
])

model = Pipeline([
    ("pre", pre),
    ("clf", RandomForestClassifier(n_estimators=300, random_state=42)),
])

model.fit(X_train, y_train)
```

**Everything goes in the pipeline.** This is the point of the example. If you
scale or impute before splitting, the mean you scaled by was computed using
the test rows — the model has seen data it should not have, and your score is
optimistic. Inside a `Pipeline`, every step is fitted on the training fold
only. That single habit prevents the most common serious mistake in applied
ML.

`handle_unknown="ignore"` matters too: a city that appears only in the test
set would otherwise raise at predict time.

## Reading the score honestly

Accuracy is a trap on imbalanced data. If 97% of students pass, a model that
predicts "pass" every time is 97% accurate and completely useless.

```python
from sklearn.metrics import classification_report, confusion_matrix

print(confusion_matrix(y_test, model.predict(X_test)))
print(classification_report(y_test, model.predict(X_test)))
```

| Metric | Question it answers |
| --- | --- |
| Precision | Of the ones I flagged, how many were real? |
| Recall | Of the real ones, how many did I catch? |
| F1 | One number balancing the two |
| ROC-AUC | How well does it rank, at any threshold? |

Which one matters is a business question, not a technical one. Screening for a
disease, recall dominates. Blocking transactions, precision does. Decide before
you look at the numbers, or you will pick whichever flatters the model.

For regression: RMSE (in the units of the thing, punishes large errors), MAE
(in the units, treats all errors alike), R² (fraction of variance explained).
Quote RMSE or MAE — they mean something to a person; R² usually does not.

## Cross-validation

One split is one sample of how well you did. Five splits tell you how much
that number moves:

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5, scoring="f1_macro")
print(f"{scores.mean():.3f} ± {scores.std():.3f}")
```

If the spread is wide, your single split was luck. Report the mean and the
spread — a model quoted to three decimal places from one split is a model
nobody should trust.

## Overfitting, in one line

Training score high, test score low. The model memorised.

The fixes, in the order worth trying: more data; fewer features; a simpler
model; regularisation; early stopping. Not: tuning until the test score comes
up, which is the same mistake wearing a different hat.

## Fine-tuning, and when not to

"Fine-tuning" now usually means continuing to train a large pretrained model
on your own examples. It is the last thing to reach for, not the first.

For most tasks you meet in this course, the ladder is:

1. **Prompting** — a clear instruction and a few examples. Free, instant.
2. **Retrieval** (the next lesson) — give the model your documents at question
   time. Solves "it does not know about our data", which is what people
   usually mean when they ask for fine-tuning.
3. **Fine-tuning** — teach a consistent *format*, *style* or narrow *task*.
   Needs hundreds to thousands of good examples, and every base-model upgrade
   invalidates it.

Fine-tuning teaches behaviour, not facts. If the complaint is "it does not
know our product catalogue", fine-tuning is the wrong tool and retrieval is
the right one. That distinction is worth more than any hyperparameter.

## What to remember

- Name the problem type first; the model choice follows and matters less.
- Split before you touch the data; do every transformation inside a pipeline.
- Accuracy on imbalanced data is a lie — look at the confusion matrix.
- Choose the metric before you see the results.
- Reach for retrieval before fine-tuning.

---

**Practice.** Project 2 is a small model trained end to end: a pipeline, an
honest split, and a short written defence of the metric you chose.
