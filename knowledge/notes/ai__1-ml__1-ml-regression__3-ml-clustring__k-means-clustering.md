# K-Means Clustering

## Importing the libraries

```python
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
```

## Importing the dataset

```python
dataset = pd.read_csv(r'F:\ML\Part 4 - Clustering\Section 25 - Hierarchical Clustering\Python\Mall_Customers.csv')
X = dataset.iloc[:, [3, 4]].values
```

## Using the elbow method to find the optimal number of clusters

Within-Cluster Sum of Square--wcss

```python
from sklearn.cluster import KMeans
wcss = []
for i in range(1, 11):
    kmeans = KMeans(n_clusters = i, init = 'k-means++', random_state = 42)
    kmeans.fit(X)
    wcss.append(kmeans.inertia_)
plt.plot(range(1, 11), wcss)
plt.title('The Elbow Method')
plt.xlabel('Number of clusters')
plt.ylabel('WCSS')
plt.show()
```

```result
C:\Users\surya\anaconda3\envs\logmodel_env\lib\site-packages\sklearn\cluster\_kmeans.py:1037: UserWarning: KMeans is known to have a memory leak on Windows with MKL, when there are less chunks than available threads. You can avoid it by setting the environment variable OMP_NUM_THREADS=1.
  "KMeans is known to have a memory leak on Windows "
```

![Output](kb-media:63ab040544be229b8dcb.png)

## Training the K-Means model on the dataset

```python
kmeans = KMeans(n_clusters = 5, init = 'k-means++', random_state = 42)
y_kmeans = kmeans.fit_predict(X)
```

## Visualising the clusters

```python
plt.scatter(X[y_kmeans == 0, 0], X[y_kmeans == 0, 1], s = 100, c = 'red', label = 'Cluster 1')
plt.scatter(X[y_kmeans == 1, 0], X[y_kmeans == 1, 1], s = 100, c = 'blue', label = 'Cluster 2')
plt.scatter(X[y_kmeans == 2, 0], X[y_kmeans == 2, 1], s = 100, c = 'green', label = 'Cluster 3')
plt.scatter(X[y_kmeans == 3, 0], X[y_kmeans == 3, 1], s = 100, c = 'cyan', label = 'Cluster 4')
plt.scatter(X[y_kmeans == 4, 0], X[y_kmeans == 4, 1], s = 100, c = 'magenta', label = 'Cluster 5')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s = 300, c = 'yellow', label = 'Centroids')
plt.title('Clusters of customers')
plt.xlabel('Annual Income (k$)')
plt.ylabel('Spending Score (1-100)')
plt.legend()
plt.show()
```

![Output](kb-media:ed67ccb99acdb17a6c9d.png)

```python
from sklearn.metrics import silhouette_score
```

```python
score=silhouette_score(X,kmeans.labels_,metric='euclidean')
print(score)
```

```result
0.553931997444648
```
