supervised
unsupervised
semisupervised_
### What is Semi-Supervised Learning?

Semi-supervised learning is a machine learning technique that combines both **labeled data** (data with known outputs) and **unlabeled data** (data without known outputs) to improve model performance. The goal is to utilize a small amount of labeled data to infer labels for the large amount of unlabeled data, thus reducing the need for manual labeling while still achieving high accuracy. 

### How it Works:
1. **Initial Model Training:** A model is first trained on the labeled data.
2. **Label Prediction:** This trained model is then used to predict labels for the unlabeled data.
3. **Pseudo-Labeling:** High-confidence predictions are treated as "pseudo-labels" and added to the labeled dataset.
4. **Model Retraining:** The model is retrained using both the labeled and pseudo-labeled data to improve its performance.

### Example 1: Medical Imaging
- **Problem:** Radiologists label a small set of lung X-ray images for diagnosing diseases like pneumonia, but labeling large volumes of images is time-consuming and costly.
- **Solution:** Semi-supervised learning uses a small set of labeled X-ray images and a large set of unlabeled X-rays. The model learns from the labeled set and pseudo-labels the unlabeled images. By iteratively refining these pseudo-labels, the model improves its ability to detect pneumonia across the entire dataset, reducing the need for expert labeling.

### Example 2: Fraud Detection in Banking
- **Problem:** Fraudulent transactions in banking are rare, and labeling them requires manual review, making it difficult to build accurate models.
- **Solution:** A semi-supervised model is trained on a small set of labeled transactions (fraudulent and non-fraudulent) and a large set of unlabeled transactions. The model predicts potential fraud in the unlabeled set, and high-confidence predictions are used to retrain the model. Over time, the model gets better at identifying fraud, even with limited labeled data.
### Example 1: NLP (Natural Language Processing) - Text Classification
- **Problem:** A company wants to categorize customer reviews into "positive" or "negative" sentiments, but only a small portion of the reviews has been manually labeled due to the time it takes to label text data.
- **Solution:** 
   - A semi-supervised learning model is first trained on the small set of labeled reviews.
   - The model then predicts the sentiment of the unlabeled reviews, generating "pseudo-labels" for them.
   - High-confidence predictions are added to the labeled set, and the model is retrained.
   - As the process continues, the model learns to classify reviews more accurately, improving its performance even on the unlabeled reviews.
   
   This technique can be used in sentiment analysis for product reviews, social media comments, or customer feedback.
### Example 2: CV (Computer Vision) - Object Detection
- **Problem:** A company is building an object detection system for autonomous cars, but labeling large datasets of images (e.g., pedestrians, traffic signs) is costly and labor-intensive.
- **Solution:** 
   - The model is trained on a small labeled dataset containing objects like cars and pedestrians.
   - The trained model then predicts objects in a larger, unlabeled image dataset, generating pseudo-labels for these objects.
   - Confident predictions (e.g., where the model is sure of the object) are treated as new labeled examples, and the model is retrained using both the original labeled and pseudo-labeled data.
   
   This process enables the model to generalize better to real-world scenarios without requiring full manual annotation of all images.

I understand you'd like the equations formatted for proper display in Jupyter notebook markdown. I'll update the content with the correct Markdown syntax for equations. Here's the revised version:

---
### **Linear Regression: Key Concepts**
#### **1. Linear Regression Equation**
- **Simple Linear Regression**:
  ```
  y = θ₀ + θ₁x
  ```
- **Multiple Linear Regression**:
  ```
  y = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ
  ```
#### **2. Cost Function and Graphical Representation**
- **Mean Squared Error (MSE)**:
  ```
  J(θ) = (1/2m) Σ(hθ(xᵢ) - yᵢ)²
  ```
  - **Graph**: Convex curve, single global minimum.
#### **3. Convergence Algorithm**
- **Gradient Descent**:
  ```
  θ := θ - α(∂J(θ)/∂θ)
  ```
  - **Hyperparameters**:
    - **Learning Rate (α)**: Step size.
    - **Number of Iterations**: Updates count.
- **Why Not Local Minimum?**:
  - **Convex Function**: Ensures a single global minimum.
#### **4. Assumptions, Advantages, Disadvantages**
- **Assumptions**:
  1. **Linearity**: y and predictors are linearly related.
  2. **Independence**: Observations are independent.
  3. **Homoscedasticity**: Constant error variance.
  4. **No Multicollinearity**: Predictors are not highly correlated.
  5. **Normality**: Errors are normally distributed.
- **Advantages**:
  1. **Simple and Interpretable**.
  2. **Computationally Efficient**.
- **Disadvantages**:
  1. **Sensitive to Assumptions**.
  2. **Overfitting Risk**.
  3. **Limited to Linear Relationships**.
#### **5. Data Preprocessing Requirements**
- **Feature Scaling**: Yes.
- **Handling Missing Values**: Yes.
- **Outliers**: Sensitive.
- **Overfitting/Underfitting**:
  - **Overfitting**: Regularization.
  - **Underfitting**: More predictors.
#### **6. Performance Metrics**
- **R-squared (R²)**:
  ```
  R² = 1 - (SSᵣₑₛ / SSₜₒₜ)
  ```
- **Adjusted R-squared**:
  ```
  Adj R² = 1 - (1 - R²) * ((n - 1) / (n - p - 1))
  ```
- **Mean Squared Error (MSE)**:
  ```
  MSE = (1/m) Σ(yᵢ - ŷᵢ)²
  ```
- **Root Mean Squared Error (RMSE)**:
  ```
  RMSE = √MSE
  ```
- **Mean Absolute Error (MAE)**:
  ```
  MAE = (1/m) Σ|yᵢ - ŷᵢ|
  ```
#### **7. Hyperparameter Tuning**
- **For Regularized Regression**:
  - **Grid Search/Random Search**.
  - **Cross-Validation**.
parameters in code:

1. fit_interceptbool, default=True
Whether to calculate the intercept for this model. If set to False, no intercept will be used in calculations (i.e. data is expected to be centered).

2. copy_Xbool, default=True
If True, X will be copied; else, it may be overwritten.

3. n_jobsint, default=None
The number of jobs to use for the computation. This will only provide speedup in case of sufficiently large problems, that is if firstly n_targets > 1 and secondly X is sparse or if positive is set to True. None means 1 unless in a joblib.parallel_backend context. -1 means using all processors. See Glossary for more details.

4. positivebool, default=False
When set to True, forces the coefficients to be positive. This option is only supported for dense arrays.


---
### **Polynomial Regression**
#### **1. Polynomial Regression Equation**
- **Equation**:
  ```
  y = θ₀ + θ₁x + θ₂x² + ... + θₙxⁿ
  ```
#### **2. Cost Function**
- Same as linear regression but applied to polynomial features.
#### **3. Data Preprocessing**
- **Feature Scaling**: Yes.
- **Handling Overfitting**: Regularization or reducing polynomial degree.

parameters:
1. PolynomialFeatures Parameters:
2. degree: int (default: 2) - Maximum degree of polynomial features generated.
3. interaction_only: bool (default: False) - If True, only interaction features are produced.
4. include_bias: bool (default: True) - If True, includes a bias (intercept) term in the output.


---

![image.png](kb-media:12a6dd1efd056fc65a97.png)

### **Ridge Regression: How It Works**

 **Equation**:
   ```
   y = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ
   ```
   - **Cost Function**:
     ```
     J(θ) = (1/2m) Σ(hθ(xᵢ) - yᵢ)² + λ Σθᵢ²
     ```
     - The **penalty term** (λ Σθᵢ²) adds a constraint to the optimization, shrinking the coefficients towards zero but not necessarily making them zero.

3. **Regularization Effect**:
   - **λ (Lambda)**: The regularization strength. A higher λ means stronger regularization, leading to smaller coefficients and a model that is less sensitive to individual data points, thus reducing overfitting.

4. **Multicollinearity**:
   - Ridge is particularly useful when predictors are highly correlated. It distributes the impact of collinear variables more evenly by shrinking the coefficients of correlated features.

5. **When to Use**:
   - Ridge regression is suitable when you have many features, and some may be correlated. It helps in controlling model complexity while maintaining predictive performance.

---

### **Lasso Regression: How It Works**

2. **Equation**:
   ```
   y = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ
   ```
   - **Cost Function**:
     ```
     J(θ) = (1/2m) Σ(hθ(xᵢ) - yᵢ)² + λ Σ|θᵢ|
     ```
     - The **penalty term** (λ Σ|θᵢ|) encourages sparsity in the model coefficients. This means that the model can reduce the number of predictors by setting some coefficients exactly to zero.

3. **Regularization Effect**:
   - **λ (Lambda)**: Similar to Ridge, a higher λ increases regularization. However, in Lasso, this leads to more coefficients becoming zero, simplifying the model by selecting a subset of features.

4. **Feature Selection**:
   - Unlike Ridge, which only shrinks coefficients, Lasso can completely eliminate some predictors by setting their coefficients to zero, making it a powerful tool for feature selection.

5. **When to Use**:
   - Lasso is particularly useful when you have a large number of features and expect that only a small subset is actually important. It simplifies the model by automatically selecting the most important features.
   
**In prepesctive of slope steepnes**

- Ridge Regression tends to reduce the slope uniformly, resulting in less steep and more uniform slopes across all features.

- Lasso Regression selectively reduces some slopes to zero, resulting in a sparse model with some coefficients completely eliminated and others potentially retaining a steep slope, leading to a "striped" pattern where only significant features remain.

- Penalty Terms: Ridge and Lasso regularization add terms to the cost function that penalize large coefficients. This affects the overall model by shrinking coefficients or setting them to zero, indirectly influencing the slope of the regression line.

- Indirect Impact on Slope: The regularization terms control how much each feature influences the prediction, which in turn affects the slope of the regression line. Ridge makes the slope smoother and less steep across features, while Lasso can lead to abrupt changes in the slope due to feature selection.
---

with knn we can use average of k nearest neaghbour value as prediction regression.

gussain naive bayes is also used for 

---
---
---

# Support Vector Machine (SVM)

## Overview
* SVM is a supervised learning algorithm used for both classification and regression tasks.
* It finds the hyperplane that best separates the data points from different classes in a high-dimensional space.
* The goal is to maximize the margin between the classes and the support vectors (points closest to the hyperplane).

## Assumptions
* Data is linearly separable (in the case of linear SVM).
* Non-linearly separable data can be transformed into a higher-dimensional space using a kernel function to make it linearly separable.

## Main Equation for Output
The decision function for an SVM is given by:

$$
f(x) = w^T x + b
$$

Where:
* $w$: Weight vector perpendicular to the hyperplane.
* $x$: Feature vector of the input data.
* $b$: Bias term (offset).

The goal of SVM is to find the optimal hyperplane that maximizes the margin between two classes.

### Margin:
The margin is the distance between the hyperplane and the closest data points (support vectors):

$$
\text{Margin} = \frac{2}{\|w\|}
$$

## Cost Function
SVM uses the hinge loss function to penalize misclassified points:

$$
L(y, f(x)) = \max(0, 1 - y \cdot f(x))
$$

Where:
* $y$: True label of the instance.
* $f(x)$: Predicted value from the model.

For correctly classified points, $L(y, f(x)) = 0$ when $y \cdot f(x) \geq 1$. Misclassified points or points within the margin have a non-zero loss.

## Optimization Process

### Step 1: Primal Formulation
The SVM optimization problem can be written as:

$$
\min_{w,b} \frac{1}{2} \|w\|^2 \quad \text{subject to} \quad y_i (w^T x_i + b) \geq 1, \, \forall i
$$

This aims to minimize the norm of the weight vector $w$ while ensuring that all data points are correctly classified (or within the margin for soft-margin SVM).

### Step 2: Dual Formulation
To make the optimization more efficient, we convert the problem into its dual form:

$$
\max_{\alpha} \sum_{i=1}^{n} \alpha_i - \frac{1}{2} \sum_{i,j} \alpha_i \alpha_j y_i y_j x_i^T x_j
$$

Where:
* $\alpha_i$: Lagrange multipliers.
* $x_i$, $x_j$: Feature vectors of instances.
* $y_i$, $y_j$: Labels of instances.

### Step 3: Support Vectors
Only a subset of the data points (support vectors) will have non-zero Lagrange multipliers $\alpha_i$. The final decision function is based on these support vectors:

$$
f(x) = \sum_{i=1}^{n} \alpha_i y_i x_i^T x + b
$$

### Step 4: Kernel Trick
For non-linearly separable data, SVM applies the kernel trick to transform the data into a higher-dimensional space:

$$
K(x_i, x_j) = \phi(x_i)^T \phi(x_j)
$$

Common kernels:
* **Linear Kernel**: $K(x_i, x_j) = x_i^T x_j$
* **Polynomial Kernel**: $K(x_i, x_j) = (x_i^T x_j + 1)^d$
* **Radial Basis Function (RBF) Kernel**: $K(x_i, x_j) = \exp(-\gamma \|x_i - x_j\|^2)$
* **Sigmoid Kernel**: $K(x_i, x_j) = \tanh(\kappa x_i^T x_j + \theta)$

## Hyperparameters in `sklearn`
Key hyperparameters for `SVC` in `sklearn`:

| Hyperparameter     | Description                                                   |
|-------------------|---------------------------------------------------------------|
| `C`               | Regularization parameter (default=1.0). Smaller values allow for more slack (soft margin). |
| `kernel`          | Specifies the kernel type (default=`rbf`). Other options: `linear`, `poly`, `sigmoid`. |
| `degree`          | Degree of the polynomial kernel function (if `poly` is chosen). |
| `gamma`           | Kernel coefficient for `rbf`, `poly`, and `sigmoid` kernels.   |
| `tol`             | Tolerance for stopping criterion.                              |
| `max_iter`        | Maximum number of iterations (default=-1, meaning no limit).   |

Example:

```python
from sklearn.svm import SVC
model = SVC(C=1.0, kernel='rbf', gamma='scale')

```

---
---
---

Decision Trees are better:
1. Non-linearity  
2. Feature interactions  
3. No statistical assumptions  
4. Outlier resistance 
5. if over fitting can be solved by ensemble techniques

*** Decision Treees: ***
https://youtu.be/FuTRucXB9rA?si=-QzbEhbNeW11ZZOv

https://youtu.be/_L39rN6gz7Y?si=IGD88Mf9d3HZYfMH

https://youtu.be/g9c66TUylZ4?si=Y5BCtl458Dk5Yrs7f

---

 **Decision Trees**

  **Assumptions**:
1. **Independence of Features**: Assumes features are independent of each other.
2. **Non-linearity**: Capable of capturing non-linear relationships in the data.
3. **No strict distribution requirements**: Decision trees do not require the data to follow a specific distribution (e.g., normal distribution).

 **Conditions**:
- Suitable for both classification and regression tasks.
- Works well with categorical and continuous data.
- Can handle missing values and outliers.-
Here’s a simplified overview of how decision trees can handle missing values:

1. **Surrogate Splits**: If a feature is missing, the tree can use another similar feature to make the split.

2. **Probabilistic Assignment**: Missing values can be assigned probabilities based on other data, helping to classify the instance without discarding it.

3. **Weighted Instances**https://youtu.be/sQ870aTKqiM?si=w0R95FCPNNueLm_C : Instances with missing values may receive less influence during training, so they don't overly affect the model's decisions.

In scikit-learn, you'll need to preprocess the data (like imputation) since it doesn't handle missing values automatically.
 
  **Equation**:
- Decision trees do not have a specific mathematical equation like linear models. Instead, they create a series of decision rules based on feature values:
$$
\text{If } \text{feature}_1 \leq \theta_1 \text{ and } \text{feature}_2 > \theta_2 \text{ then classify as class } C
$$
Where $\theta_1$ and $\theta_2$ are thresholds determined during the tree-building process.

  **Cost Function**:
- For classification tasks, the cost function often used is **Gini Impurity** or **Entropy**:
  - **Gini Impurity**:
  $$
  Gini = 1 - \sum_{i=1}^{C} p_i^2
  $$
  - **Entropy**:
  $$
  Entropy = -\sum_{i=1}^{C} p_i \log_2(p_i)
  $$
  Where $p_i$ is the probability of class $i$.

- For regression tasks, the cost function is usually the **Mean Squared Error (MSE)**:
$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

  **Optimization Function**:
- Decision trees optimize by recursively splitting the data to minimize the impurity (for classification) or variance (for regression) at each node.

  **Graph**:
- The graph of a decision tree visualizes nodes representing features, branches representing decision rules, and leaf nodes representing outcomes (predictions).
 
  **Parameters in scikit-learn**:
- **DecisionTreeClassifier** / **DecisionTreeRegressor**:
  - `criterion`: Function to measure the quality of a split (e.g., "gini" or "entropy" for classification; "mse" for regression).
  - `max_depth`: Maximum depth of the tree; controls overfitting.
  - `min_samples_split`: Minimum number of samples required to split an internal node.
  - `min_samples_leaf`: Minimum number of samples required to be at a leaf node.
  - `max_features`: Number of features to consider when looking for the best split.

  **Hyperparameter Tuning Methods**:
- **Grid Search**: Searches exhaustively over specified parameter values.
- **Random Search**: Samples parameter combinations randomly for a specified number of iterations.
- **Cross-Validation**: Validates model performance through various train-test splits during tuning.

  **Sensitivity and Robustness**:
- **Sensitive to Overfitting**: Decision trees can overfit the training data if not properly pruned or limited in depth.
- **Robust to Outliers**: Generally, decision trees are less influenced by outliers compared to linear models.

---

No, **bagging** (Bootstrap Aggregating) is a general ensemble method, and **Random Forest** is just one example of it. Bagging can be applied to other models as well.

### Bagging Overview:
- **Bagging** involves training multiple models (typically the same model type) on different random subsets of the training data (with replacement), and then aggregating their predictions to improve performance and reduce overfitting.
- The aggregation is done by majority vote for classification or averaging for regression.

### Other Models in Bagging:
1. **Bagging Classifier/Regressor** (General):
   - Can use any model (e.g., decision trees, support vector machines, k-nearest neighbors) in a bagging framework. This is a general implementation of bagging in scikit-learn.

2. **Random Forest**:
   - A specialized form of bagging that uses **decision trees** with additional randomness (random feature selection) at each split.

3. **Bagged K-Nearest Neighbors**:
   - KNN can also be bagged, where multiple KNN models are trained on different bootstrap samples.

4. **Bagged SVM**:
   - Support Vector Machines (SVM) can be combined with bagging to create an ensemble of SVM models trained on different subsets of the data.

In summary, **Random Forest** is a specific type of bagging, but bagging can be applied to a variety of other models as well.


random forest famous because the random forest eliminate only problem of decision tree of overfitting...by sampling and subset features by no of trees.

### Random Forest :

 **Assumptions**:
- No specific assumptions about data distribution, unlike linear models.
- Works well with large datasets and high-dimensional data.
- Handles both categorical and continuous features.

**Conditions**:
- Works well with non-linear relationships.
- Requires enough data to avoid overfitting due to the ensemble of multiple trees.
- Handles imbalanced data better with class weighting or subsampling.
- handles missing values - how 
https://youtu.be/sQ870aTKqiM?si=w0R95FCPNNueLm_C

 **Equation / Formula**:
- Aggregates predictions from multiple decision trees, where each tree is built on a random subset of features and samples.
- The final prediction is the **majority vote** (for classification) or **average** (for regression).

 **Cost Function**:
- No explicit cost function; minimizes **Gini Impurity** or **Entropy** at each tree node split.

 **Optimization Function**:
- No explicit optimization like gradient descent.
- Random forest optimizes by choosing the best split at each node (based on the metric like Gini/Entropy).
### Summary of Randomization in Random Forest:

**Random Forest** utilizes **randomization** in two key ways to enhance model performance:

1. **Bootstrap Sampling**: Each tree is trained on a random subset of data samples (with replacement), introducing variability across trees.`min_samples_split`

2. **Random Feature Selection**: At each node, only a random subset of features is considered for splitting, preventing any single feature from dominating the decision-making process and increasing diversity among the trees.

This combination of techniques reduces overfitting and improves generalization, making Random Forest a powerful ensemble method.

 **Graph**:
- Random forest graphically is a combination of decision trees, where the model aggregates results from multiple trees.

 **Parameters in Scikit-learn**:
- `n_estimators`: Number of trees in the forest (default=100).
- `max_depth`: Maximum depth of the trees (None by default, grow until all leaves are pure).
- `min_samples_split`: Minimum samples required to split a node (default=2).
- `min_samples_leaf`: Minimum samples required at a leaf node (default=1).
- `max_features`: Number of features to consider when looking for the best split (default="auto").
- `bootstrap`: Whether bootstrap samples are used (default=True).

 **Sensitive and Robust to**:
- **Robust** to noisy data and overfitting due to averaging across trees.
- **Sensitive** to large datasets, as random forest may require more computational resources.

 **Hyperparameter Tuning**:
- **GridSearchCV** or **RandomizedSearchCV**: Used to find optimal `n_estimators`, `max_depth`, `min_samples_split`, etc.
- **Random Grid Search** is preferred for faster tuning across many parameters.

---
---
---

### Boosting: Types, Advantages, and Disadvantages

**Boosting** is an ensemble learning technique that combines multiple weak learners (usually decision trees) to create a strong learner. The key idea is to train models sequentially, with each new model focusing on the errors made by the previous ones.

### Types of Boosting:

1. **AdaBoost (Adaptive Boosting)**:
   - **Description**: Assigns weights to each instance, increasing the weights of misclassified instances to focus on difficult cases in subsequent models.
  
2. **Gradient Boosting**:
   - **Description**: Builds models sequentially by optimizing a loss function using gradient descent. Each model corrects the errors of the previous ones.

3. **XGBoost (Extreme Gradient Boosting)**:
   - **Description**: An optimized version of gradient boosting, known for its speed and performance. It includes regularization techniques to prevent overfitting.

4. **LightGBM (Light Gradient Boosting Machine)**:
   - **Description**: A gradient boosting framework that uses a histogram-based approach to speed up training and reduce memory usage.

5. **CatBoost**:
   - **Description**: A gradient boosting library that handles categorical features directly without needing to preprocess them, making it user-friendly for datasets with many categorical variables.

### Advantages of Boosting:

- **High Accuracy**: Boosting can significantly improve the accuracy of models compared to single learners, often achieving state-of-the-art results in competitions.
  
- **Focus on Difficult Cases**: By sequentially focusing on errors made by previous models, boosting can effectively reduce bias and improve performance on hard-to-classify instances.

- **Flexibility**: Boosting algorithms can optimize various loss functions and can be adapted for different types of predictive modeling tasks.

- **Feature Importance**: Boosting methods can provide insights into feature importance, helping in model interpretation.

### Disadvantages of Boosting:

- **Overfitting**: Boosting can overfit the training data if not properly tuned, especially with complex models or when the dataset is small.

- **Computationally Intensive**: Boosting algorithms can be slower to train than simpler models due to their sequential nature.

- **Sensitive to Noisy Data**: Boosting is more sensitive to noisy data and outliers because it focuses on correcting errors, which may lead to fitting noise in the data.

- **Complexity**: The complexity of boosting algorithms can make them harder to understand and interpret compared to simpler models.

### Summary
Boosting is a powerful ensemble technique that improves model accuracy by focusing on errors from previous models. While it offers high performance and flexibility, it can be prone to overfitting and may require careful tuning to manage complexity.

---
---
---

# AdaBoost

## Overview
* AdaBoost (Adaptive Boosting) is an ensemble learning method that combines multiple weak classifiers to form a strong classifier.
* It focuses on misclassified instances by increasing their weights in each iteration, forcing subsequent learners to focus more on those harder-to-classify points.

## Assumptions
* Assumes that weak learners can be combined to form a strong learner.
* Assumes that the training dataset is representative of the test dataset.

## Conditions
* Requires a base learner that can classify instances with accuracy better than random guessing (accuracy > 50%).
* Sensitive to noisy data, outliers, and missing values.

## Main Equation for Output
The prediction of the AdaBoost model is the weighted sum of predictions from weak learners:

$$
F(x) = \sum_{m=1}^{M} \alpha_m h_m(x)
$$

* $F(x)$: Final model prediction.
* $M$: Total number of weak learners.
* $\alpha_m$: Weight of each weak learner.
* $h_m(x)$: Prediction from the $m$-th weak learner.

## Cost Function
AdaBoost minimizes the **exponential loss** function:

$$
L(y, F(x)) = e^{-y \cdot F(x)}
$$

Where:
* $y$: True label of the instance.
* $F(x)$: Model’s prediction.

## Optimization Process

### Step 1: Initialize Weights
All training instances are given equal weight initially.

### Step 2: Train Weak Learner
Train a weak learner (e.g., a decision stump) on the weighted dataset.

### Step 3: Calculate Weighted Error
Compute the weighted classification error for the $m$-th weak learner:

$$
\epsilon_m = \frac{\sum_{i=1}^{n} w_i \cdot \mathbb{1}(y_i \neq h_m(x_i))}{\sum_{i=1}^{n} w_i}
$$

Where:
* $w_i$: Weight of instance $i$.
* $\mathbb{1}(y_i \neq h_m(x_i))$: Indicator function, 1 if $h_m(x_i)$ misclassifies $x_i$, otherwise 0.

### Step 4: Update Learner Weight
The weight of the weak learner is calculated based on its error:

$$
\alpha_m = \frac{1}{2} \log \left( \frac{1 - \epsilon_m}{\epsilon_m} \right)
$$

### Step 5: Update Instance Weights
Update the weights of each instance to emphasize misclassified points:

$$
w_i^{(m+1)} = w_i^{(m)} \cdot e^{\alpha_m \cdot \mathbb{1}(y_i \neq h_m(x_i))}
$$

Weights are then normalized so they sum to 1:

$$
w_i^{(m+1)} = \frac{w_i^{(m+1)}}{\sum_{i=1}^{n} w_i^{(m+1)}}
$$

### Step 6: Repeat
Repeat steps 2-5 for $M$ iterations or until a stopping criterion is met.

### Final Prediction
The final prediction is a weighted sum of the predictions from all weak learners:

$$
F(x) = \text{sign} \left( \sum_{m=1}^{M} \alpha_m h_m(x) \right)
$$

## Hyperparameters in `sklearn`
Key hyperparameters for `AdaBoostClassifier` in `sklearn`:

| Hyperparameter   | Description                                                       |
|------------------|-------------------------------------------------------------------|
| `n_estimators`   | Number of weak learners to be combined (default=50).              |
| `learning_rate`  | Weight applied to each classifier at each iteration (default=1.0).|
| `base_estimator` | The base learner used (default is a decision stump).              |
| `algorithm`      | 'SAMME' or 'SAMME.R' (real) algorithm for boosting.              |

Example:

```python
from sklearn.ensemble import AdaBoostClassifier
model = AdaBoostClassifier(n_estimators=100, learning_rate=0.1)

```

Gradient boosting and Xgboost required hyper parameter tuning..for sure
---
---
---

![gradientboosting.png](kb-media:3d5bccd5c88cff34051a.png)

# Gradient Boosting

## Overview
* Gradient Boosting is an ensemble technique that sequentially adds weak learners (often decision trees) to minimize a loss function.
* Each new learner corrects the residuals of the previous model.
* The model is additive, combining predictions from multiple weak learners to improve performance.

## Main Equation for Output
The output is an additive model:

$$F(x) = F_0(x) + \sum_{m=1}^{M} \gamma_m h_m(x)$$

* $F_0(x)$: Initial model (e.g., mean prediction for regression)
* $h_m(x)$: The prediction from the $m$-th weak learner
* $\gamma_m$: Learning rate (controls step size)
* $M$: Number of iterations (or trees)

## Cost Function

For **regression** (e.g., mean squared error):

$$L(y, F(x)) = \frac{1}{2}(y - F(x))^2$$

For **binary classification** (e.g., log-loss):

$$L(y, F(x)) = -[y \log(p) + (1 - y) \log(1 - p)]$$

Where:
* $p$: Predicted probability for class 1.

## Optimization Steps
Gradient Boosting minimizes the loss function by adding new models sequentially, each focusing on the residuals of the previous models.

### Step 1: Initialize the Model
Start with a simple initial model, typically the mean for regression:

$$F_0(x) = \arg \min_{\gamma} \sum_{i=1}^{n} L(y_i, \gamma)$$

### Step 2: Compute Residuals
The residuals (pseudo-residuals) for the $m$-th iteration are calculated as the negative gradient of the loss function:

$$r_{im} = -\frac{\partial L(y_i, F(x_i))}{\partial F(x_i)}$$

### Step 3: Fit a Weak Learner
Fit a weak learner (e.g., a decision tree) to the residuals:

$$h_m(x) = \arg \min_h \sum_{i=1}^{n} (r_{im} - h(x_i))^2$$

### Step 4: Update the Model
Update the model by adding the weak learner’s contribution, scaled by the learning rate:

$$F_{m}(x) = F_{m-1}(x) + \gamma_m h_m(x)$$

### Step 5: Repeat
Repeat steps 2-4 for $M$ iterations or until convergence.

## Hyperparameters in `sklearn`
Key hyperparameters in `sklearn.ensemble.GradientBoostingClassifier` or `GradientBoostingRegressor`:

| Hyperparameter     | Description                                      |
|-------------------|--------------------------------------------------|
| `n_estimators`     | Number of boosting stages (trees)                |
| `learning_rate`    | Step size for each weak learner                  |
| `max_depth`        | Maximum depth of each tree                       |
| `min_samples_split`| Minimum samples to split an internal node        |
| `min_samples_leaf` | Minimum samples at a leaf node                   |
| `subsample`        | Fraction of samples for fitting each learner     |
| `max_features`     | Number of features considered for each split     |
| `loss`             | Loss function to optimize (e.g., `deviance`)     |

Example:

```python
from sklearn.ensemble import GradientBoostingClassifier
model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)

```

---
---

# entropy and gini impurity gives how inpure the split..but inofrmation gain gives feature importance.
# different gradient boosting types uses different types of tree...basically what is $f_k()$ formula

# Gradient Boosting Methods: Comparing Base Learners and Final Outputs

| Method | Base Prediction (F₀) | Base Learner Definition (fₖ) | Final Output Formula | Tree Construction Method |
|--------|---------------------|------------------------------|---------------------|------------------------|
| **Traditional GB** | F₀(x) = argmin_γ ∑L(yᵢ, γ) | fₖ(x) = γₖhₖ(x)<br>where:<br>• hₖ is regression tree<br>• γₖ is step size from line search<br>• γₖ = argmin_γ ∑L(yᵢ, Fₖ₋₁(xᵢ) + γhₖ(xᵢ)) | F(x) = F₀(x) + ν∑ₖ₌₁ᴷ fₖ(x)<br>where ν is learning rate | • Uses residuals as targets<br>• Each split minimizes squared error |
| **XGBoost** | Same as traditional | fₖ(x) = wₖ(q(x))<br>where:<br>• q(x) maps data to leaf index<br>• wₖ is leaf weight vector<br>• wₖⱼ = -gⱼ/(hⱼ + λ)<br>• gⱼ, hⱼ are gradient sums in leaf j | F(x) = ∑ₖ₌₁ᴷ fₖ(x)<br>with regularization Ω(fₖ) | • Uses gradient & hessian<br>• Leaf weights analytically optimized<br>• Includes regularization term |
| **LightGBM** | Same as traditional | fₖ(x) = wₖ(qₖ(x))<br>where:<br>• qₖ(x) uses histogram-based splits<br>• wₖ optimized on histograms<br>• Exclusive Feature Bundling used | F(x) = ∑ₖ₌₁ᴷ fₖ(x)<br>with GOSS sampling | • Leaf-wise growth<br>• Histogram-based splits<br>• GOSS sampling for gradients |
| **CatBoost** | Uses ordered target statistics | fₖ(x) = wₖ(qₖ(x))<br>where:<br>• qₖ uses ordered target statistics<br>• wₖ computed using ordered gradients<br>• Categorical features handled natively | F(x) = M₀ + ∑ₖ₌₁ᴷ (F^k(x) - M₀)/k<br>where F^k are ordered models | • Symmetric trees<br>• Ordered boosting<br>• Native categorical handling |

 

 

---

this much scope or level is enough....https://youtu.be/OtD8wVaFm6E?si=pW5-fGtG5O2RrfwW

### XGBoost Model Overview

#### 1. Assumptions and Conditions:
- **Assumptions**:
  - The relationship between features and the target variable can be approximated by decision trees.
  - The loss function is differentiable.
  - The model assumes independence of trees, as each tree corrects the errors of the previous ones.
- **Conditions**:
  - Sufficient training data to avoid overfitting.
  - Feature relevance: Important features should influence the target variable.

#### 2. Equations and Formulae:

The predicted output for a given input feature vector $x_i$ in XGBoost is calculated as:

$$ F(x_i) = F_0 + \sum_{k=1}^{K} \eta f_k(x_i) $$

here $(f_k(x_i))$ is like
$$\sum_{k=1}^{K} \eta \left(-\frac{g_k}{h_k + \lambda} \cdot I(x_i \in R_k)\right)$$

where $F_0$ is the initial prediction and $f_k(x_i)$ is the contribution from the $k^{th}$ decision tree, scaled by the learning rate $\eta$.

- **Similarity Score**:
  During tree construction, the similarity score $S$ is calculated for potential splits:
  $$
  S = \frac{(\sum g_i)^2}{\sum h_i + \lambda}
  $$

- **Objective Function or cost function**:
  $$
  L(F) = \sum_{i=1}^{n} l(y_i, F(x_i)) + \sum_{k=1}^{K} \Omega(f_k)
  $$

- **Loss Function**:
  - **For Regression**:
    $$
    l(y_i, F(x_i)) = (y_i - F(x_i))^2
    $$
  - **For Binary Classification**:
    $$
    l(y_i, F(x_i)) = -[y_i \log(\sigma(F(x_i))) + (1 - y_i) \log(1 - \sigma(F(x_i)))]
    $$

- **Regularization Term (Ω(fₖ) = γT + ½λ||w||²)**:
  - γ (gamma): Complexity parameter that controls tree size/depth
  - T: Number of leaves in the tree
  - λ (lambda): L2 regularization parameter
  - ||w||²: L2 norm of the leaf weights squared
  - ½: Scaling factor

-  **Cost Function (J = L(F) = Σᵢ l(yᵢ, F(xᵢ)) + Σₖ Ω(fₖ))**:
  - J: Overall cost/objective function
  - L(F): Total loss function
  - l(yᵢ, F(xᵢ)): Loss for individual prediction vs actual value
  - yᵢ: True/target value for ith instance
  - F(xᵢ): Predicted value for ith instance
  - Ω(fₖ): Regularization term for the kth tree
  - n: Number of training instances
  - K: Number of trees in the ensemble

#### 4. Optimization Process:
Yes, in XGBoost, the optimization process uses a second-order Taylor approximation to improve the efficiency of gradient descent. Here's how it works:

### Second-Order Taylor Approximation

The second-order Taylor approximation of the loss function $l(y_i, F(x_i))$ around the current prediction $F(x)$ can be expressed as:

$$
l(y_i, F(x)) \approx l(y_i, F(x^{(t)})) + g_i (F(x) - F(x^{(t)})) + \frac{1}{2} h_i (F(x) - F(x^{(t)})^2
$$

### Components Explained
- **$g_i$**: The first derivative (gradient) of the loss function with respect to the predicted value. It indicates the direction to update the prediction.
  
- **$h_i$**: The second derivative (Hessian) of the loss function. It provides information about the curvature of the loss function, allowing for more precise adjustments.

# XGBoost Mathematical Framework
https://youtu.be/oRrKeUCEbq8?si=BhjwNGK4v5Poamyd
## 1. Loss Function

The fundamental building block of XGBoost is its loss function. This measures the difference between predicted values and true labels:

$L = \sum_{i=1}^n l(y_i, F(x_i))$

Where:
* $l$ represents the loss function (e.g., squared error, logistic loss)
* $n$ is the number of training instances
* $y_i$ is the true label
* $F(x_i)$ is the predicted value

## 2. Gradient and Hessian

XGBoost optimizes using both first and second order derivatives:

**Gradient:**
$g_i = \frac{\partial l(y_i, F(x_i))}{\partial F(x_i)}$

**Hessian:**
$h_i = \frac{\partial^2 l(y_i, F(x_i))}{\partial (F(x_i))^2}$

## 3. Tree Construction

### A. Similarity Scores

For each leaf node $R_j$, we calculate:

**Gradient Sum:**
$S_j = \sum_{i \in R_j} g_i$

**Hessian Sum:**
$H_j = \sum_{i \in R_j} h_i$

### B. Split Gain

The gain from splitting a node is calculated as:

$\text{Gain} = \frac{1}{2} \left( \frac{S_j^2}{H_j + \lambda} - \frac{S_{parent}^2}{H_{parent} + \lambda} \right) - \gamma$

Where:
* $\lambda$ is the L2 regularization term
* $\gamma$ is the minimum loss reduction required for a split

## 4. Weight Optimization

The optimal weight for each leaf $j$ is:

$w_j = -\frac{S_j}{H_j + \lambda}$

## 5. Model Prediction

For a new instance $x$, the prediction after $K$ trees is:

$F(x) = \sum_{k=1}^{K} f_k(x)$

Where $f_k(x)$ is the prediction from the $k$th tree.

## 6. Tree Pruning

### A. Max Depth Control
Trees are limited to a maximum depth to prevent overfitting. This is controlled by the hyperparameter `max_depth`.

### B. Cost Complexity
The cost complexity of a tree is defined as:

$\text{Cost Complexity} = L + \alpha \cdot \text{Number of Leaves}$

Where $\alpha$ balances model complexity and fitting accuracy.

## 7. Regularization

XGBoost employs two types of regularization:

### A. L1 Regularization (Lasso)
$L_{\text{new}} = L + \lambda \sum_{j=1}^m |w_j|$

### B. L2 Regularization (Ridge)
$L_{\text{new}} = L + \lambda \sum_{j=1}^m w_j^2$

Where $m$ is the number of leaves.

## 8. Final Prediction

The complete model prediction is:

$\hat{y} = F(x) = F_0 + \sum_{k=1}^{K} \eta \left(-\frac{g_k}{h_k + \lambda} \cdot I(x_i \in R_k)\right)$

Where $F_0$ is the initial prediction (typically the mean of the target variable).

---

## Key Takeaways

1. XGBoost uses both first and second order derivatives for optimization
2. Tree construction is guided by the gain calculation
3. Multiple forms of regularization prevent overfitting
4. Pruning is performed both during and after tree construction
5. The final model is an additive ensemble of trees

### Final Prediction Incorporating Updates

The overall prediction becomes:

$$
F(x_i) = F_0 + \sum_{k=1}^{K} \eta \left(-\frac{g_k}{h_k + \lambda} \cdot I(x_i \in R_k)\right)
$$

This incorporates the contributions from all trees with their respective weights based on the gradients and Hessians.

- **Weight Update**:
  $$
  F_{new}(x) = F_{old}(x) + \eta f_k(x)
  $$

- the key differences in formulas for **XGBoost regression** and **classification**:

| **Aspect**               | **Regression**                                          | **Classification**                                       |
|--------------------------|--------------------------------------------------------|---------------------------------------------------------|
| **Loss Function**        | Mean Squared Error (MSE)                              | Logarithmic Loss (Log Loss)                             |
| **Formula**              | $$ l(y_i, F(x_i)) = (y_i - F(x_i))^2 $$              | $$ l(y_i, F(x_i)) = -[y_i \log(\sigma(F(x_i))) + (1 - y_i) \log(1 - \sigma(F(x_i)))] $$ |
| **Objective Function**   | $$ L(F) = \sum_{i=1}^{n} l(y_i, F(x_i)) + \sum_{k=1}^{K} \Omega(f_k) $$ | $$ L(F) = \sum_{i=1}^{n} l(y_i, F(x_i)) + \sum_{k=1}^{K} \Omega(f_k) $$ |
| **Gradient Calculation** | $$ g_i = -2(y_i - F(x_i)) $$                         | $$ g_i = \sigma(F(x_i)) - y_i $$                      |
| **Hessian Calculation**  | $$ h_i = 2 $$                                        | $$ h_i = \sigma(F(x_i))(1 - \sigma(F(x_i))) $$       |

### Explanation:
- **Loss Function**: The loss function differs between regression and classification tasks, reflecting the nature of the predictions. Regression typically uses Mean Squared Error, while classification uses Log Loss.
- **Objective Function**: The structure is similar for both tasks, combining the loss and the regularization term.
- **Gradient and Hessian**: The formulas for calculating the gradient and Hessian differ, aligning with the nature of the loss function used in each task.

#### 5. Parameters in Scikit-Learn for Hyperparameter Tuning:
- `n_estimators`: Number of boosting rounds (trees).
- `learning_rate`: Step size shrinkage to prevent overfitting.
- `max_depth`: Maximum depth of trees.
- `min_child_weight`: Minimum sum of instance weight (hessian) needed in a child.
- `subsample`: Fraction of samples used for fitting individual base learners.
- `colsample_bytree`: Fraction of features used for each tree.

#### 6. Sensitivity and Robustness:
- **Sensitivity**: XGBoost can be sensitive to outliers, especially in the target variable.
- **Robustness**: Regularization helps mitigate overfitting, making the model more robust to noise in the data.

### Summary
XGBoost is a powerful gradient boosting framework that optimizes an objective function through an iterative process of adding decision trees, using gradients and Hessians to update predictions. Its use of regularization improves model generalization, allowing it to effectively handle complex datasets while controlling overfitting.






https://youtu.be/oRrKeUCEbq8?si=tah1A663p2UUAzlb

In XGBoost, handling large datasets efficiently involves several advanced techniques, particularly with respect to parallel computing, greedy algorithms, binning, and sparsity. Here’s how these concepts are implemented in XGBoost, along with the mathematical formulations relevant to each aspect:

### 1. **Parallel Computing in XGBoost**
- **How It Works**: 
  - XGBoost parallelizes the construction of trees. Each tree is built independently, allowing for parallel execution of the tree-building process. 
  - Each feature's contribution can be computed simultaneously.

- **Mathematics**: 
  - The objective function is optimized in parallel across multiple trees:
  
  $$ 
  L(F) = \sum_{i=1}^{n} l(y_i, F(x_i)) + \sum_{k=1}^{K} \Omega(f_k)
  $$

  In parallel implementations, the tree-building process for each $f_k$ can be distributed across available computational resources.

### 2. **Greedy Algorithms for Tree Splitting**
- **How It Works**: 
  - At each node in the tree, XGBoost uses a greedy approach to find the best split. It evaluates potential splits based on minimizing the loss function.
  
- **Mathematics**:
  - For a given feature, the loss reduction for a split can be calculated as:
  
  $$ 
  \text{Gain} = \frac{1}{2} \left( \frac{g^2}{h + \lambda} \right) 
  $$
  
  Here, $g$ is the sum of gradients and $h$ is the sum of Hessians for the left and right child nodes, and $\lambda$ is the regularization term. The split that maximizes the gain is chosen.

### 3. **Binning**
- **How It Works**: 
  - Continuous features are discretized into bins, which reduces the number of potential split points and speeds up the computation of gains for tree splits.
  
- **Mathematics**:
  - Binning can be performed using histograms, where the feature space is divided into $b$ bins, and each bin corresponds to a range of values:
  
  $$
  \text{Bin}_j = \{ x | a_j \leq x < a_{j+1} \}
  $$
  
  where $a_j$ are the boundaries of the bins.

### 4. **Handling Sparsity**
- **How It Works**: 
  - XGBoost is designed to efficiently handle sparse data structures by skipping missing values during the computation of gradients and Hessians.
  
- **Mathematics**:
  - The sum of gradients and Hessians can be calculated over non-missing values only:
  
  $$
  g = \sum_{i \in \text{non-missing}} g_i, \quad h = \sum_{i \in \text{non-missing}} h_i
  $$
  
  This reduces the computational burden when dealing with datasets that have many missing entries.

### Summary
In summary, XGBoost uses parallel computing to speed up tree construction, applies greedy algorithms to find optimal splits based on a gain formula, utilizes binning to reduce computational complexity, and efficiently handles sparsity by focusing only on available data. These mathematical principles and computational strategies enable XGBoost to perform effectively on large datasets, maintaining speed and accuracy.

---
----

https://youtu.be/9uxWzeLglr0?si=KyJHt1yrIUYRhauj

Here's a comprehensive structural and mathematical comparison of XGBoost, LightGBM, and CatBoost, including an additional column for CatBoost in the same format as the original table:

| Aspect | XGBoost | LightGBM | CatBoost |
|--------|---------|-----------|-----------|
| **Tree Growth Strategy** | Level-wise (grows trees breadth-first)<br><br>![Level-wise]<br>• Grows all nodes at same level<br>• More balanced trees<br>• Higher memory usage | Leaf-wise (grows trees depth-first)<br><br>![Leaf-wise]<br>• Grows leaf with max delta loss<br>• Can be asymmetric<br>• Lower memory usage | Symmetric (balanced tree growth)<br><br>• Grows trees in a balanced way<br>• Ensures efficient use of data<br>• Generally maintains lower overfitting |
| **Split Finding Formula** | For each candidate split:<br>`Gain = ½[GL²/HL + GR²/HR - (GL+GR)²/(HL+HR)] - γ`<br>where:<br>• GL, GR = gradient sums<br>• HL, HR = hessian sums<br>• γ = regularization term | Similar base formula but with histogram bins:<br>`Gain = ½[GL²/HL + GR²/HR - (GL+GR)²/(HL+HR)] - γ`<br>Modified by GOSS weights:<br>`w = 1.0 if \|g\| ≥ top_gradients else a/b` | Uses a similar formula:<br>`Gain = ½[GL²/HL + GR²/HR - (GL+GR)²/(HL+HR)] - γ`<br>Incorporates various optimization techniques to reduce overfitting and enhance stability. |
| **Feature Discretization** | Weighted Quantile Sketch:<br>• Exact quantiles for numerical features<br>• Dynamic split points<br>• Memory: O(n * #features)<br><br>Formula:<br>`P(X ≤ x) = Σᵢ hᵢI(xᵢ ≤ x) / Σᵢ hᵢ` | Histogram-based Binning:<br>• Fixed number of bins (usually 255)<br>• Static bin boundaries<br>• Memory: O(#bins * #features)<br><br>Formula:<br>`bin_id = floor((x - min) * #bins / (max - min))` | **Ordered Target Encoding**:<br>• Encodes categorical features directly during training<br>• Uses a statistical approach to prevent overfitting on categorical data<br>• Efficiently handles categorical features without prior binning. |
| **Instance Sampling** | Row sampling:<br>`sample_weight = uniform(0,1)`<br><br>Column sampling:<br>`feature_sample ~ random(#features * colsample_bytree)` | Gradient-based One-Side Sampling (GOSS):<br>`top_gradients = sort(\|g\|)[1:a*N]`<br>`small_gradients = sample(rest, b*N)`<br>`weights = if g in top else (1-a)/b` | **Random Sampling**:<br>• Uses a form of random sampling with stratification<br>• Ensures a balanced representation of classes in the training set, which helps mitigate bias. |
| **Feature Bundling** | None (handles each feature separately) | Exclusive Feature Bundling (EFB):<br>1. Build feature graph<br>2. Bundle mutually exclusive features<br>3. Reduce feature space<br><br>Bundle condition:<br>`conflict(A,B) = \|overlap(A,B)\| / min(\|A\|,\|B\|) < threshold` | **Feature Combinations**:<br>• Automatically generates combinations of features<br>• Aims to enhance predictive power by using interactions between features without requiring manual feature engineering. |
| **Memory Usage Pattern** | For N samples, M features:<br>• Main: O(N*M)<br>• Split finding: O(N*log N) per feature<br>• Total: O(N*M + N*log N*M) | For N samples, M features, K bins:<br>• Main: O(K*M)<br>• Split finding: O(K) per feature<br>• Total: O(K*M) where K << N | For N samples, M features:<br>• Main: O(N*M)<br>• Memory optimized for categorical encoding<br>• Total depends on the number of categories and features. |
| **Base Learner Definition** | `fₖ(x) = wₖ(q(x))`<br>where:<br>• q(x) = leaf index from quantile splits<br>• wₖⱼ = -gⱼ/(hⱼ + λ) | `fₖ(x) = wₖ(qₖ(x))`<br>where:<br>• qₖ(x) = leaf index from histogram splits<br>• wₖⱼ = -gⱼ/(hⱼ + λ) * GOSS_weight | `fₖ(x) = wₖ(qₖ(x))`<br>where:<br>• qₖ(x) is derived from ordered target encoding<br>• wₖ incorporates handling of categorical weights. |
| **Split Evaluation** | 1. Sort feature values<br>2. Scan all possible splits<br>3. Calculate gain for each split<br>4. Choose best split | 1. Build gradient histograms<br>2. Scan histogram boundaries<br>3. Calculate gain with GOSS weights<br>4. Choose best bin boundary | 1. Utilize ordered target encoding<br>2. Evaluate splits based on encoded categories<br>3. Optimize for both categorical and numerical splits<br>4. Choose optimal boundaries based on gain. |
| **Regularization** | Explicit regularization:<br>`Ω(f) = γT + ½λ\|\|w\|\|²`<br>where:<br>• T = number of leaves<br>• w = leaf weights | Similar plus:<br>• Natural regularization from histograms<br>• Additional from GOSS sampling<br>• Bundle constraints from EFB | **L2 Regularization**:<br>• Incorporates L2 regularization into the loss function<br>• Aims to stabilize learning and prevent overfitting on categorical features. |

This table highlights the structural and mathematical distinctions among XGBoost, LightGBM, and CatBoost, particularly focusing on their strategies for handling tree growth, feature discretization, sampling methods, and memory usage. Each algorithm has its strengths, making them suitable for different types of data and tasks.

---
---
---

### Classification models:

---

### K-Nearest Neighbors (KNN) Overview

#### 1. Assumptions and Conditions:
- **Assumptions**:
  - Instances that are closer in feature space are more likely to have similar output values (locality assumption).
  - The dataset should be well-represented in the feature space.
- **Conditions**:
  - The data should be normalized or standardized due to distance-based calculations.
  - Sufficient computational resources, as KNN can be memory and computation-intensive.

#### 2. Equations and Formulae:
- **Distance Calculation**: The most common distance metric used is the Euclidean distance, defined as:
  $$
  d(x_i, x_j) = \sqrt{\sum_{k=1}^{n}(x_{ik} - x_{jk})^2}
  $$

- **Prediction**:
  - **For Classification**: The predicted class is determined by the majority class among the $k$ nearest neighbors:
  $$
  \hat{y} = \text{mode}(y_{N_k}) \quad \text{where } N_k \text{ are the } k \text{ nearest neighbors}
  $$
  - **For Regression**: The predicted value is the average of the values of the $k$ nearest neighbors:
  $$
  \hat{y} = \frac{1}{k} \sum_{j=1}^{k} y_{N_j} \quad \text{where } N_j \text{ are the } k \text{ nearest neighbors}
  $$

#### 3. Cost Function:
KNN does not have a conventional cost function like other algorithms because it does not involve training in the same way; it simply stores the training instances for prediction.

#### 4. Optimization Process:
- **Choice of k**: The parameter $k$ can significantly impact the model's performance. A small $k$ may lead to noise sensitivity, while a large $k$ might smooth out the decision boundary too much.
- **Distance metric selection**: Different distance metrics (e.g., Manhattan, Minkowski) can influence the performance depending on the dataset.

#### 5. Parameters in Scikit-Learn for Hyperparameter Tuning:
- `n_neighbors`: Number of neighbors to use for predictions.
- `weights`: Weight function used in prediction (`uniform` or `distance`).
- `algorithm`: Algorithm used to compute the nearest neighbors (`auto`, `ball_tree`, `kd_tree`, `brute`).
- `metric`: The distance metric used (default is `minkowski`).

#### 6. Sensitivity and Robustness:
- **Sensitivity**: KNN is sensitive to irrelevant features and the scale of data.
- **Robustness**: Less robust to noise in the dataset as all instances are considered in the prediction.

### Relevance of KNN in Modern Machine Learning:
Despite being a simple and small model, KNN remains relevant due to its:
- **Intuition and Interpretability**: It provides a clear and intuitive understanding of how predictions are made based on local information.
- **Baseline Comparisons**: KNN serves as a strong baseline model to evaluate more complex models.
- **Performance**: For certain datasets, especially those with clear decision boundaries, KNN can perform surprisingly well.
- **Non-parametric Nature**: KNN does not assume any underlying distribution for the data, making it versatile for various types of datasets.

In the era of ensemble techniques, KNN can complement other models, especially in scenarios where interpretability is crucial or when combining models in ensemble methods. 
<span style="color:red">***However, due to its computational inefficiency with large datasets, it is often not the first choice when scalability is a concern.*** </span> 

Certainly! Here’s the structured information for **Logistic Regression** including the optimization step with equations, representations, and a graph representation of the gradient descent process.

### Logistic Regression Model Overview

#### 1. Assumptions and Conditions:
- **Assumptions**:
  - The relationship between the independent variables and the log-odds of the dependent variable is linear.
  - The dependent variable is binary (0 or 1).
  - Observations are independent of each other.
- **Conditions**:
  - Sufficient sample size to ensure the model is robust.
  - Features should not exhibit multicollinearity.

#### 2. Equations and Formulae:

The predicted probability for a given input feature vector $x_i$ is calculated using the logistic function:

$$
P(y_i = 1 | x_i) = \sigma(F(x_i)) = \frac{1}{1 + e^{-F(x_i)}}
$$

where $F(x_i)$ is the linear combination of features:

$$
F(x_i) = \beta_0 + \beta_1 x_{i1} + \beta_2 x_{i2} + ... + \beta_n x_{in}
$$



#### 3. Cost Function:
- The cost function measures the error in the predictions. The goal is to minimize this cost during training.
- **Objective Function (Cost Function)**:
  $$ 
  L(\beta) = -\sum_{i=1}^{n} [y_i \log(P(y_i | x_i)) + (1 - y_i) \log(1 - P(y_i | x_i))]
  $$

  ![image.png](kb-media:4099a837bb4e0957e73b.png)

#### 4. Optimization Process:
Logistic regression uses gradient descent or its variants to minimize the cost function. The optimization updates the coefficients iteratively.

- **Gradient Calculation**:
  $$ 
  g_j = \frac{\partial L(\beta)}{\partial \beta_j} = \sum_{i=1}^{n} (P(y_i | x_i) - y_i) x_{ij}
  $$

![image-2.png](kb-media:3161f7099f93f9229cdf.png)

- **Weight Update**:
  $$ 
  \beta_j^{(t+1)} = \beta_j^{(t)} - \eta g_j
  $$

where $\eta$ is the learning rate.

### 5. Gradient Descent Visualization
In logistic regression, gradient descent optimizes the cost function iteratively. Here's a graphical representation of the gradient descent process:



- **Graph Representation**:
  - The x-axis represents the parameter values, and the y-axis represents the cost (loss). 
  - The red dot indicates the initial parameters, while the blue arrows represent the gradient descent steps towards the minimum cost.

### 6. Parameters in Scikit-Learn for Hyperparameter Tuning:
- `penalty`: Type of regularization to apply (e.g., 'l1', 'l2').
- `C`: Inverse of regularization strength; smaller values specify stronger regularization.
- `solver`: Algorithm to use for optimization (e.g., 'liblinear', 'saga').
- `max_iter`: Maximum number of iterations for convergence.

#### 7. Sensitivity and Robustness:
- **Sensitivity**: Logistic regression can be sensitive to outliers, which can affect the estimated coefficients.
- **Robustness**: Regularization can help improve robustness against multicollinearity and overfitting.

### Summary
Logistic regression remains relevant in modern machine learning due to its simplicity, interpretability, and efficiency in binary classification tasks. It often serves as a strong baseline model. In ensemble techniques, such as stacking or bagging, logistic regression can be combined with other algorithms to improve performance and robustness. Its probabilistic outputs make it suitable for use in conjunction with other models, allowing for a diverse range of predictions in ensemble frameworks.

---

Why Mean Squared Error cannot be used as cost function for Logistic Regression
Let’s consider the Mean Squared Error (MSE) as a cost function, but it is not suitable for logistic regression due to its nonlinearity introduced by the sigmoid function.

In logistic regression, if we substitute the sigmoid function into the above MSE equation, we get:


\begin{aligned}  J(\theta) &= \frac{1}{2m} \sum_{i = 1}^{m}[\sigma^{(i)} - y^{(i)}]^{2}   \\&= \frac{1}{2m} \sum_{i=1}^{m} \left(\frac{1}{1 + e^{-z^{(i)}}} - y^{(i)}\right)^2 \\&= \frac{1}{2m} \sum_{i=1}^{m} \left(\frac{1}{1 + e^{-(\theta_1x^{(i)}+\theta_2)}} - y^{(i)}\right)^2  \end{aligned}

The equation $$ \frac{1}{1 + e^{-z}} $$  is a nonlinear transformation, and evaluating this term within the Mean Squared Error formula results in a non-convex cost function. A non-convex function, have multiple local minima which can make it difficult to optimize using traditional gradient descent algorithms as shown below.

![image.png](kb-media:38dfed70372cece2317c.png)

---
---
---

### Naive Bayes Model Overview

#### 1. Assumptions and Conditions
- **Assumptions**:
  - **Conditional Independence**: Each feature is independent of others given the class label.
  - **Feature Distribution**: Assumes a specific distribution of features (e.g., Gaussian for continuous features, multinomial for categorical features).

- **Conditions**:
  - Sufficient training data for accurate probability estimation.
  - Features must have a meaningful relationship with the target variable.

#### 2. Equations and Formulae
The predicted class label $y$ for a given feature vector $x$ is obtained using Bayes' theorem:

$$
P(y|x) = \frac{P(x|y) \cdot P(y)}{P(x)}
$$

Where:
- $P(y|x)$: Posterior probability of class $y$ given feature $x$.
- $P(x|y)$: Likelihood of feature $x$ given class $y$.
- $P(y)$: Prior probability of class $y$.
- $P(x)$: Evidence (normalizing constant).

Using the independence assumption, the likelihood $P(x|y)$ can be decomposed as:

$$
P(x|y) = P(x_1, x_2, \ldots, x_n | y) = \prod_{i=1}^{n} P(x_i | y)
$$

Thus, the posterior becomes:

$$
P(y|x) \propto P(y) \prod_{i=1}^{n} P(x_i | y)
$$

#### 3. Cost Function
Naive Bayes does not explicitly minimize a cost function like other algorithms. Instead, it maximizes the posterior probability directly:

$$
\hat{y} = \arg\max_{y} P(y|x)
$$

#### 4. Optimization Process
Naive Bayes does not use traditional optimization techniques like gradient descent. It relies on calculating probabilities from training data:

- **Maximum Likelihood Estimation (MLE)** for estimating prior and likelihood:

$$
P(y) = \frac{N_y}{N}
$$

Where $N_y$ is the count of instances in class $y$ and $N$ is the total number of instances.

For likelihood $P(x_i | y)$:

- For continuous features (Gaussian Naive Bayes):

$$
P(x_i | y) = \frac{1}{\sqrt{2\pi \sigma_y^2}} \exp\left(-\frac{(x_i - \mu_y)^2}{2\sigma_y^2}\right)
$$

- For categorical features (Multinomial Naive Bayes):

$$
P(x_i = k | y) = \frac{N_{yk} + \alpha}{N_y + \alpha K}
$$

Where:
- $N_{yk}$: Count of feature $x_i$ in class $y$.
- $\alpha$: Laplace smoothing parameter.
- $K$: Number of unique classes.

#### 5. Parameters in Scikit-Learn for Hyperparameter Tuning
- `alpha`: Smoothing parameter for handling zero probabilities (Laplace smoothing).
- `fit_prior`: Whether to learn class prior probabilities from the data.
- `class_prior`: Prior probabilities for the classes (if `fit_prior` is False).

#### 6. Sensitivity and Robustness

In machine learning lingo , we would say that by ignoring relationships among words, naive bayes had high bias.... but because it works well in practice , Naive bayes had low variance.

- **Sensitivity**: Naive Bayes can be sensitive to irrelevant features and may not perform well when the independence assumption is violated.
- **Robustness**: Generally robust to noise in data and works well with high-dimensional datasets.

---

### Summary
Naive Bayes is a probabilistic classifier based on Bayes' theorem with strong independence assumptions. Despite its simplicity, it often performs well, especially in text classification and spam detection. It remains relevant due to its efficiency, speed, and effectiveness with large datasets, even in the era of ensemble techniques.

---

https://youtu.be/H3EjCKtlVog?si=1AkoWlPLC8NbHVf7

### Naive Bayes Gaussian Algorithm

#### 1. Overview
The Naive Bayes Gaussian classifier is a probabilistic model used for classification tasks. It assumes that the features follow a Gaussian (normal) distribution, making it suitable for continuous data.

#### 2. Key Concepts
- **Naive Assumption**: Assumes that the features are independent given the class label. This simplifies the computation of probabilities.
- **Gaussian Distribution**: For each feature $x_j$ given a class $C_k$, it is assumed that $x_j$ follows a Gaussian distribution with mean $\mu_{jk}$ and variance $\sigma_{jk}^2$:

  $$ P(x_j | C_k) = \frac{1}{\sqrt{2 \pi \sigma_{jk}^2}} \exp\left(-\frac{(x_j - \mu_{jk})^2}{2 \sigma_{jk}^2}\right) $$

#### 3. Steps in the Algorithm
1. **Calculate Prior Probabilities**: Estimate the prior probability of each class $C_k$:
   
   $$ P(C_k) = \frac{N_k}{N} $$

   Where $N_k$ is the number of instances in class $C_k$ and $N$ is the total number of instances.

2. **Calculate Likelihood**: For each feature $x_j$ given class $C_k$, compute the likelihood using the Gaussian probability density function:

   $$ P(x_j | C_k) $$

3. **Combine Probabilities**: For a new instance with features $x_1, x_2, \ldots, x_n$, compute the posterior probability for each class $C_k$ using Bayes’ theorem:

   $$ P(C_k | x_1, x_2, \ldots, x_n) \propto P(C_k) \prod_{j=1}^{n} P(x_j | C_k) $$

4. **Predict Class**: Select the class with the highest posterior probability:

   $$ \hat{C} = \arg \max_{C_k} P(C_k | x_1, x_2, \ldots, x_n) $$

### Conclusion
The Naive Bayes Gaussian algorithm is efficient for classification tasks, especially when the independence assumption holds. Despite its simplicity, it can perform well even with large datasets and is often used in text classification, spam detection, and sentiment analysis.

---

---
---
---

Clustering:
---

Here’s the revised K-Means overview using double dollar signs for all mathematical formulas.

---

### Definition
K-Means is an unsupervised clustering algorithm that partitions a dataset into $k$ distinct, non-overlapping clusters based on feature similarity. The goal is to minimize intra-cluster variance (within-cluster distance) and maximize inter-cluster variance (between clusters).

### Assumptions
- The number of clusters $k$ must be predefined.
- Each point belongs to the cluster with the nearest mean.
- Clusters are spherical and evenly sized.
- Features are treated as equally important (no weights).

### Equation
The objective function for K-Means is to minimize the sum of squared distances between each point and its cluster's centroid:

$$
\arg \min_S \sum_{i=1}^{k} \sum_{x \in S_i} \left\| x - \mu_i \right\|^2
$$

Where:
- $S_i$ is the set of points in the $i$-th cluster.
- $\mu_i$ is the centroid of the $i$-th cluster.
- $x$ is a data point.

### Cost Function
The cost function (also known as the distortion function) is:

$$
J = \sum_{i=1}^{k} \sum_{x \in S_i} \left\| x - \mu_i \right\|^2
$$

The goal is to minimize this cost, which represents the squared distance between each point and its assigned cluster centroid.

### Optimization Steps
1. **Initialize centroids** $\mu_1, \mu_2, \ldots, \mu_k$ randomly from the data points.
2. **Cluster assignment step** (E-step):  
    Assign each data point $x$ to the cluster $i$ whose centroid $\mu_i$ is closest:

    $$
    C_i = \{ x_j : \left\| x_j - \mu_i \right\|^2 \leq \left\| x_j - \mu_l \right\|^2 \, \forall \, l \}
    $$

3. **Centroid update step** (M-step):  
    Update the centroids by calculating the mean of the points assigned to each cluster:

    $$
    \mu_i = \frac{1}{|C_i|} \sum_{x_j \in C_i} x_j
    $$

4. **Repeat steps 2 and 3** until convergence (when assignments no longer change).

### Optimization Steps Explanation
- **Initialization**: The random choice of initial centroids may affect the final solution. Multiple runs with different initializations (e.g., K-Means++) improve results.
- **E-step**: Minimizes the distance between data points and the nearest centroid.
- **M-step**: Recalculates the centroids to minimize the intra-cluster variance.

### Graph Description
A typical plot of K-Means performance includes the **elbow method**, where the cost function (inertia) is plotted against the number of clusters. The optimal number of clusters is often indicated by the "elbow" point, where the cost reduction slows down.

### Hyperparameters in scikit-learn
- `n_clusters`: The number of clusters.
- `init`: Initialization method for centroids (e.g., 'random', 'k-means++').
- `max_iter`: Maximum number of iterations.
- `tol`: Tolerance to declare convergence.
- `n_init`: Number of times the algorithm will run with different centroid seeds.

```python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, init='k-means++', max_iter=300, tol=1e-4, n_init=10)
kmeans.fit(X)
```

### Sensitive To
- Initialization of centroids (bad initializations may lead to poor results).
- Number of clusters $k$ (wrong $k$ can lead to poor clustering).

### Robust To
- Large datasets (with efficient implementation, can handle large-scale problems).
- Features that are well-separated and clustered naturally.

Here's a structured comparison of **K-Means** and **K-Means++** using mathematical formulas and clearly differentiating the key aspects of each algorithm:
| Aspect | K-Means | K-Means++ |
|--------|---------|-----------|
| Definition | Clustering algorithm that partitions data into $k$ clusters by minimizing variance within clusters. | Improved version of K-Means that optimally initializes centroids to enhance clustering results. |
| Initialization | Randomly selects $k$ data points as initial centroids. | Selects first centroid randomly; subsequent centroids selected based on probability which is based on the distance between centriod is more means more probability. |
| Centroid Initialization | $c_1, c_2, \ldots, c_k$ chosen randomly from data points. | 1. Select $c_1$ randomly from data.<br>2. For each $x_i$ not selected, compute:<br>   $D(x_i) = \min_{j \in \{1, \ldots, k\}} \|x_i - c_j\|^2$<br>3. Choose $c_j$ with probability:<br>   $P(c_j) = \frac{D(x_i)^2}{\sum_{x \in X} D(x)^2}$ |
| Cost Function | $J = \sum_{j=1}^{k} \sum_{x_i \in C_j} \|x_i - c_j\|^2$ | Same as K-Means |
| Cluster Assignment | $C_j = \{ x_i \in X \| \|x_i - c_j\| \leq \|x_i - c_l\| \text{ for all } l \neq j \}$ | Same as K-Means |
| Centroid Update | $c_j = \frac{1}{|C_j|} \sum_{x_i \in C_j} x_i$ | Same as K-Means |
| Convergence | Iteratively refines clusters until centroids do not change. | Same as K-Means |
| Sensitivity | Sensitive to initial centroid placement; may lead to poor results. | More robust to initial conditions due to improved centroid initialization. |
| Efficiency | Can converge to local minima quickly, but may not be optimal. | Tends to converge to better solutions faster and more reliably. |


### Summary of Differences
- **Centroid Initialization**: The primary difference lies in how the initial centroids are selected. K-Means uses random selection, while K-Means++ employs a probabilistic method that helps spread out the centroids initially, reducing the chances of poor clustering.
- **Performance**: K-Means++ generally performs better than standard K-Means in terms of clustering quality and convergence speed due to its strategic centroid initialization.

This structured overview highlights the mathematical formulations and differences between K-Means and K-Means++. If you need further details or specific examples, feel free to ask!

---

# kmeans vs DB scan:
![image.png](kb-media:cb1cb6efd5a463632056.png)

Here’s the corrected overview of the DBSCAN algorithm with the proper formatting for variable equations in the text using single dollar signs:

### Definition
DBSCAN (Density-Based Spatial Clustering of Applications with Noise) is a density-based clustering algorithm that identifies clusters based on the density of data points in the feature space.

### Assumptions
1. Clusters are formed from dense regions of points separated by areas of lower density.
2. Clusters can take on arbitrary shapes.
3. The algorithm can effectively identify noise and outliers.

### Equations
- **Neighborhood of a point**:
  $$
  N(p, \varepsilon) = \{ q \in \mathbb{R}^d \mid \| p - q \| \leq \varepsilon \}
  $$
- **Core point condition**:
  A point $p$ is a core point if:
  $$
  |N(p, \varepsilon)| \geq \text{MinPts}
  $$

### Cost
DBSCAN does not have a traditional cost function like other clustering algorithms because it relies on density rather than minimizing distances.

### Optimization Steps for DBSCAN
1. **Initialization**: 
   - Start with all points labeled as unvisited. Select an arbitrary unvisited point $p$.

2. **Neighborhood Search**:
   - Identify the neighborhood of point $p$:
   $$
   N(p, \varepsilon) = \{ q \in \mathbb{R}^d \mid \| p - q \| \leq \varepsilon \}
   $$

3. **Core Point Check**:
   - Check if $p$ is a core point:
   $$
   |N(p, \varepsilon)| \geq \text{MinPts}
   $$
   - If true, proceed to create a new cluster.

4. **Cluster Formation**:---first all core points are made into cluster with corepoint condition
   - Initialize a new cluster with $p$ and label it.
   - For each point $q$ in $N(p, \varepsilon)$:
     - If $q$ is unvisited, mark it as visited.
     - If $q$ is a core point:
       - Add the points in $N(q, \varepsilon)$ to the neighborhood to explore further.

5. **Expand the Cluster**:---next all neighbourhood conditioned with $N(\varepsilon)$ condition are merged into cluster....and remainging any point is outlier
   - For each point in the expanded neighborhood $N(q, \varepsilon)$:
     - If $q$ is unvisited, mark it as visited and check its neighborhood.
     - If $q$ is a core point, expand the cluster by including its neighborhood(border point) points.

6. **Repeat**:
   - Continue this process until all points have been visited.
   - Points that are neither core nor border points are labeled as noise.

### Graph Description
DBSCAN can be visualized in scatter plots where core points are clustered together, border points are near core points but not densely connected, and noise points are isolated.

### Hyperparameters in Scikit-Learn
- `eps`: Maximum distance between two samples for them to be considered as in the same neighborhood.
- `min_samples`: Minimum number of samples in a neighborhood for a point to be considered a core point.

### Sensitivity To and Robustness To
- **Sensitivity**: DBSCAN is sensitive to the choice of $\varepsilon$ and $\text{MinPts}$, which can affect clustering results.
- **Robustness**: It is robust to outliers and can discover clusters of varying shapes and sizes.

Let me know if you need any further adjustments!

---
---
---

### Hierarchical Clustering overview

### Definition  
https://youtu.be/8QCBl-xdeZI?si=WtlpgPPohFjsgPdB
Hierarchical Clustering is a clustering algorithm that builds a hierarchy of clusters either by a bottom-up approach (agglomerative) or a top-down approach (divisive).

### Assumptions
1. Data can be represented as a dendrogram (tree-like structure).
2. Clusters can be formed based on various linkage criteria (single, complete, average, etc.).
3. The algorithm does not require a predefined number of clusters.

### Equations
1. **Distance Calculation**:
   - The distance between two clusters $C_i$ and $C_j$ can be defined using various linkage criteria. For example:
     - **Single Linkage**:
     $$
     d(C_i, C_j) = \min_{x \in C_i, y \in C_j} \| x - y \|
     $$
     - **Complete Linkage**:
     $$
     d(C_i, C_j) = \max_{x \in C_i, y \in C_j} \| x - y \|
     $$
     - **Average Linkage**:
     $$
     d(C_i, C_j) = \frac{1}{|C_i| \cdot |C_j|} \sum_{x \in C_i} \sum_{y \in C_j} \| x - y \|
     $$

### Cost
Hierarchical clustering does not have a traditional cost function; instead, it focuses on minimizing the distances between clusters based on the selected linkage criteria.

### Optimization Steps for Hierarchical Clustering


1. **Initialization**: 
   - Each data point is treated as a separate cluster $C_i$:
   $$
   C_i = \{x_i\} \quad \forall i \in [1, n]
   $$

2. **Distance Calculation**: 
   - Compute the pairwise distance between all clusters $C_i$ and $C_j$ using a chosen distance metric $d$:
   $$
   d(C_i, C_j) = \text{distance between clusters} 
   $$

3. **Cluster Merging**: 
   - Identify the two closest clusters $C_a$ and $C_b$:
   $$
   \text{Merge } C_a \text{ and } C_b \Rightarrow C = C_a \cup C_b
   $$

4. **Update Distance Matrix**: 
   - Update the distance matrix to reflect the new cluster $C$.

5. **Stopping Criteria**:
   - **Dendrogram Cutting**: The algorithm stops when the dendrogram is cut at a desired height $\text{threshold}$:
   $$
   d(C_i, C_j) \leq \text{threshold} 
   $$
   where $\text{threshold}$ is a user-defined distance level.we define based on the highest vertical line where no horiaontal line passes thorugh it.

   - **Fixed Number of Clusters**: Alternatively, the algorithm stops when a specified number of clusters $n$ is formed:
   $$
   |C| = n 
   $$


### Graph Description
- Hierarchical clustering can be visualized using a dendrogram, where the x-axis represents the data points, and the y-axis represents the distance or dissimilarity between clusters.

### Hyperparameters in Scikit-Learn
- `linkage`: Method for calculating the distance between clusters (e.g., ‘ward’, ‘complete’, ‘average’, ‘single’).
- `n_clusters`: Number of clusters to find (used in truncating the dendrogram).

### Sensitivity To and Robustness To
- **Sensitivity**: Hierarchical clustering can be sensitive to noise and outliers, affecting the clustering structure.
- **Robustness**: It is robust in discovering clusters of various shapes and sizes but may struggle with large datasets due to its computational complexity.

Let me know if you need further adjustments or additional information!

### Model Evaluation Metrics
#### 1. **Regression Metrics**
   - **R-squared (R²):**
     - **Description:** Measures the proportion of variance in the dependent variable explained by the model.
     - **Purpose:** Assesses model fit and explanatory power.
   - **Adjusted R²:**
     - **Description:** Adjusts R² for the number of predictors in the model.
     - **Purpose:** Penalizes the inclusion of irrelevant features, providing a more accurate measure of model performance.
   - **Mean Squared Error (MSE):**
     - **Description:** Measures the average squared difference between predicted and actual values.
     - **Purpose:** Evaluates model accuracy; lower values indicate better performance.
   - **Mean Absolute Error (MAE):**
     - **Description:** Measures the average absolute difference between predicted and actual values.
     - **Purpose:** Provides a direct measure of prediction error; less sensitive to outliers than MSE.
   - **Root Mean Squared Error (RMSE):**
     - **Description:** The square root of the MSE, giving a measure in the same units as the target variable.
     - **Purpose:** Provides a more interpretable measure of prediction error compared to MSE.
#### 2. **Classification Metrics**
   - **Confusion Matrix:**
     - **Description:** A table summarizing the performance of a classification model by showing true positives, true negatives, false positives, and false negatives.
   - **Precision:**- spam classification metric
     - **Description:** The proportion of positive predictions that are actually positive.
     - **Formula:** ```Precision = True Positives / (True Positives + False Positives)```
   - **Recall:True Positive Rate (TPR)** - cancer classification metric
     - **Description:** The proportion of actual positive instances that are correctly predicted as positive.
     - **Formula:** ```Recall = True Positives / (True Positives + False Negatives)```
   - **Accuracy:**
     - **Description:** The overall proportion of correct predictions (both positive and negative).
     - **Formula:** ```Accuracy = (True Positives + True Negatives) / Total Predictions```
   - **F-score:**
     - **Description:** The harmonic mean of precision and recall.
     - **Formula:** ```F_β = (1 + β²) * (Precision * Recall) / (β² * Precision + Recall)```
   - **Type I Error (False Positive Rate, FPR):**
     - **Description:** The rate of incorrectly predicting the positive class when the true class is negative.
     - **Formula:** ```FPR = False Positives / (True Negatives + False Positives)```
   - **Type II Error (False Negative Rate, FNR):**
     - **Description:** The rate of incorrectly predicting the negative class when the true class is positive.
     - **Formula:** ```FNR = False Negatives / (True Positives + False Negatives)```
   - **ROC Curve:**
     - **Description:** A plot showing the trade-off between the true positive rate (sensitivity) and the false positive rate.
   - **AUC-ROC:**
     - **Description:** The area under the ROC curve, representing the model's overall ability to distinguish between classes.
     - **Purpose:** Higher AUC indicates better model performance.
    *** People replace FPR with precision when the cost of false positives is higher, and we care more about the accuracy of positive predictions rather than just minimizing false alarms. Precision is crucial when positive predictions need to be highly reliable.***
Summary:
# For both spam and disease classification, Precision-Recall AUC is generally more appropriate in the context of imbalanced datasets, while AUC-ROC can be used when you have a balanced dataset or when both classes are equally important.


    
    
#### 3. **Clustering Metrics**https://youtu.be/AtxQ0rvdQIA?si=z24p8u8tdb6loC2v
   - **Elbow curve** :
   
![image.png](kb-media:7e631c7d8bac9f68ee71.png)

      1. **X-axis:** Number of clusters $k$.  
      2. **Y-axis:** Inertia or Within-Cluster Sum of Squares (WCSS), which measures cluster compactness.  
      3. **Elbow Point:** The point where increasing $k$ results in diminishing returns on reducing WCSS, indicating the optimal number of clusters.
   - **Silhouette Coefficient:**
     - **Description:** Measures how similar a data point is to its own cluster compared to other clusters.
     - **Purpose:** Helps assess the quality of clustering.
      1. **X-axis:** Number of clusters $k$.  
      2. **Y-axis:** **Silhouette score**, which measures how well-separated and cohesive the clusters are, ranging from $-1$ (poor clustering) to $1$ (perfect clustering).  
      3. **Optimal Point:** The number of clusters with the highest **silhouette score**, indicating the best separation and compactness of clusters.

calculation will be like we find each shiloute cofficient for each cluster like how close within cluster to how far nearest cluster and plot in graph....differetn graphs compared

### Silhouette Coefficient Formula

![image-3.png](kb-media:ba60f410822ab25462ce.png)

The silhouette coefficient for a point $i$ is given by:
$$
s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}
$$
where $a(i)$ is the average distance to points in the same cluster, and $b(i)$ is the average distance to points in the nearest cluster.

### Interpretation
- **+1:** Well-clustered.
- **0:** Ambiguous (boundary).
- **-1:** Misclassified.
    

   - **Davies-Bouldin Index:**
     - **Description:** Measures the average similarity between each cluster and its nearest cluster.
     - **Purpose:** Lower values indicate better clustering.
   - **Calinski-Harabasz Index:**
     - **Description:** Measures the ratio of between-cluster variance to within-cluster variance.
     - **Purpose:** Higher values indicate more distinct clusters.
---
