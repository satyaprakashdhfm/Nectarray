Use your cleaned dataset from Project 1, or another one. Pick a real question — will a student pass, will an order be late, what will this cost.

**Build**

- A scikit-learn `Pipeline` containing every transformation. No scaling or imputing outside it.
- An honest split. Time-ordered data gets a time-ordered split, not a random one.
- A baseline to beat — predicting the majority class, or the mean.
- Cross-validation, reported as mean and spread.

**Write, in the README, before the results section**: which metric you are optimising and why that one matters for this problem. Then the confusion matrix and the classification report.

**Say what you would need to trust this in production.** More data, a different metric, a fairness check, a human in the loop — whatever is actually true.
