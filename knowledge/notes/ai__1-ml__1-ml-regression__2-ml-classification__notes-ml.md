# logistic regression

**Linear Regression vs. Logistic Regression for Classification:**

Linear regression is not ideal for classification because it produces continuous outputs that range from $-\infty$ to $+\infty$, which do not naturally fit within the 0 to 1 probability range needed for classification tasks. This necessitates manually applying a threshold to determine class labels, which can be unreliable and does not provide calibrated probabilities. Additionally, linear regression uses Mean Squared Error (MSE) as the cost function, which is not well-suited for classification as it does not appropriately handle the asymmetry between false positives and false negatives. In contrast, logistic regression is designed specifically for classification. It uses the sigmoid function to produce probabilities between 0 and 1, offering a direct and interpretable measure of class membership. The Log Loss (Binary Cross-Entropy) cost function aligns with classification needs by penalizing misclassifications more effectively, and the sigmoid function's output helps in maintaining stable performance even in the presence of outliers.

### **1. Assumptions**
- **Linearity of the Logit**: The log odds of the outcome are a linear combination of the input features.
- **Independence of Observations**: Each observation is independent of the others.
- **No Multicollinearity**: The input features should not be highly correlated with each other.
- **Binary Outcome**: Logistic regression is designed for binary classification tasks (though it can be extended to multiclass problems).
- **Large Sample Size**: Logistic regression performs better with a larger sample size to ensure reliable estimates.

### **2. Working**

![image.png](kb-media:2d486e53cd09042e225d.png)

- Logistic Regression models the probability that a given input belongs to a particular category.
- It uses the **sigmoid function** (also known as the logistic function) to map predicted values to probabilities between 0 and 1.
- The decision rule is typically to classify inputs as belonging to the positive class if the predicted probability exceeds a certain threshold (commonly 0.5).

   **Logistic Regression Equation**:
   ```
   P(y=1|x) = 1 / (1 + e^-(θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ))
   ```
- The model coefficients are estimated by maximizing the **likelihood function**, which represents the probability of observing the given data under the model.

### **3. Cost Function**
- The cost function used in logistic regression is the **log-loss** or **cross-entropy loss**.
  
  **Cost Function**:
  ```
  J(θ) = - (1/m) Σ[yᵢ log(hθ(xᵢ)) + (1 - yᵢ) log(1 - hθ(xᵢ))]
  ```
- **Graph of the Cost Function**:

### **Why Use Log-Likelihood for Logistic Regression Instead of MSE:**

**1. Convexity of Cost Function**
- **Log-Likelihood**: Provides a convex cost function for binary classification, ensuring a single global minimum. This makes optimization more straightforward and reliable.
- **MSE**: Can lead to a non-convex cost function with multiple local minima, complicating the optimization process.

**2. Probabilistic Nature**
- **Log-Likelihood**: Directly models the probability of the correct class and is well-suited for classification tasks. It aligns with the sigmoid function’s output, which represents probabilities.
- **MSE**: Treats output as continuous values, not probabilities, which is less effective for classification and can distort the optimization process.

**3. Effective Penalization of Classification Errors**
- **Log-Likelihood**: Properly penalizes misclassifications by evaluating the likelihood of correct predictions, making it better suited for handling classification errors.
- **MSE**: Does not differentiate well between types of errors and may not effectively capture the nuances of classification problems.

![image-2.png](kb-media:83bb7f5bd962371e2386.png)

  - The graph of the cost function for logistic regression is convex, meaning it has a single global minimum. This property ensures that gradient descent will converge to the optimal solution.

### **4. Performance Metrics**
   - **Precision:**------spam classification
     - **Description:** The proportion of positive predictions that are actually positive.
     - **Formula:** ```Precision = True Positives / (True Positives + False Positives)```
   - **Recall:**---------cancer detection
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

### **5. Advantages**
- **Simplicity and Interpretability**: Logistic regression is easy to understand and interpret, especially in terms of odds ratios.
- **Efficiency**: Computationally efficient, especially for small to medium-sized datasets.
- **Probability Outputs**: Provides probabilistic predictions, which can be useful in decision-making processes.
- **Baseline Model**: Often serves as a strong baseline for binary classification tasks.
- **Regularization Capabilities**: Supports L1 and L2 regularization to prevent overfitting.

### **6. Disadvantages**
- **Linear Decision Boundary**: Assumes a linear relationship between the input features and the log odds, which may not capture complex patterns in the data.
- **Sensitivity to Outliers**: Logistic regression can be sensitive to outliers, which can disproportionately influence the model.
- **Multicollinearity Issues**: If the input features are highly correlated, it can lead to unreliable coefficient estimates.
- **Not Suitable for Non-linear Data**: Without proper feature engineering, logistic regression may struggle with non-linear relationships.
- **Imbalanced Datasets**: Logistic regression can perform poorly on imbalanced datasets unless properly adjusted with techniques like resampling or class weights.
