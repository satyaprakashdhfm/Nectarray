```python
# DBSCAN Clustering

# Importing the libraries
import numpy as np
import pandas as pd

# Importing the dataset
dataset = pd.read_csv(r'F:\ML\Part 4 - Clustering\Section 25 - Hierarchical Clustering\Python\Mall_Customers.csv')
X = dataset.iloc[:, [3, 4]].values


# Using the elbow method to find the optimal number of clusters
from sklearn.cluster import DBSCAN
dbscan=DBSCAN(eps=3,min_samples=4)

# Fitting the model

model=dbscan.fit(X)

labels=model.labels_


from sklearn import metrics

#identifying the points which makes up our core points
sample_cores=np.zeros_like(labels,dtype=bool)

sample_cores[dbscan.core_sample_indices_]=True

#Calculating the number of clusters

n_clusters=len(set(labels))- (1 if -1 in labels else 0)



print(metrics.silhouette_score(X,labels))
```

```result
-0.1908319132560097
```

```text
This is a pertinent question. We already have basic clustering algorithms, so why should you spend your time and energy learning about yet another clustering method? It’s a fair question so let me answer that before I talk about what DBSCAN clustering is.

First, let’s clear up the role of clustering.

Clustering is an unsupervised learning technique where we try to group the data points based on specific characteristics. There are various clustering algorithms with K-Means and Hierarchical being the most used ones. Some of the use cases of clustering algorithms include:

Document Clustering
Recommendation Engine
Image Segmentation
Market Segmentation
Search Result Grouping
and Anomaly Detection.
All these problems use the concept of clustering to reach their end goal. Therefore, it is crucial to understand the concept of clustering. But here’s the issue with these two clustering algorithms.

K-Means and Hierarchical Clustering both fail in creating clusters of arbitrary shapes. They are not able to form clusters based on varying densities. That’s why we need DBSCAN clustering.

Let’s try to understand it with an example. Here we have data points densely present in the form of concentric circles:
```

 ![image.png](kb-media:3dd3f2f1d1774e5c98cf.png)

 ![image.png](kb-media:4155225e80fde928e19d.png)

![image.png](kb-media:5d512d4770418bf6098b.png)

# DBSCAN stands for Density-Based Spatial Clustering of Applications with Noise.
