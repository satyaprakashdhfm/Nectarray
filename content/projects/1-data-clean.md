Find a genuinely messy public dataset. Government open data portals, Kaggle and data.gov.in are full of them; pick something with at least a few thousand rows, mixed types and real missing values. Do not use a tutorial dataset that is already clean.

**Build**

- `notebooks/` or `src/` — the cleaning, as a script or notebook that runs top to bottom
- `data/` — the raw file (or a link to it if it is large) and the cleaned output
- `README.md` — what the data is, what was wrong with it, and what you did

**Answer at least five questions** of your own about the data using `groupby` and a join, and show the output.

**The marked part** is the README section headed "Decisions". For every missing-value choice, every de-duplication rule and every row you dropped, say what you did and why. "Filled with the median" is not enough; "filled with the median because it is 3% of rows, missing at random, and the column is skewed" is.

Include the assertions that check your work — row counts after merges, ranges, uniqueness.
