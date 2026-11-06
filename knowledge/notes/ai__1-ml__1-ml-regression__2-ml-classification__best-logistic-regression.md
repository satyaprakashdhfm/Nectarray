```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn import preprocessing
import scipy.stats as stats
from sklearn.model_selection import train_test_split
from collections import Counter
from imblearn.over_sampling import SMOTE
from sklearn.metrics import accuracy_score,confusion_matrix,classification_report
from sklearn import metrics
from sklearn.ensemble import RandomForestClassifier
from catboost import CatBoostClassifier
from xgboost import XGBClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
import joblib
```

```python
pip install catboost
```
```output
Collecting catboost
  Downloading catboost-1.1.1-cp37-none-win_amd64.whl (73.9 MB)
     -------------------------------------- 73.9/73.9 MB 284.7 kB/s eta 0:00:00
Collecting graphviz
  Downloading graphviz-0.20.1-py3-none-any.whl (47 kB)
     -------------------------------------- 47.0/47.0 kB 196.8 kB/s eta 0:00:00
Requirement already satisfied: scipy in c:\users\surya\anaconda3\envs\logmodel_env\lib\site-packages (from catboost) (1.7.3)
Collecting plotly
  Downloading plotly-5.11.0-py2.py3-none-any.whl (15.3 MB)
     --------------------------------------- 15.3/15.3 MB 17.9 kB/s eta 0:00:00
… (15 more lines)
Installing collected packages: tenacity, graphviz, plotly, catboost
Successfully installed catboost-1.1.1 graphviz-0.20.1 plotly-5.11.0 tenacity-8.1.0
Note: you may need to restart the kernel to use updated packages.
```

```python
df = pd.read_csv(r"C:\Users\surya\ML CLASSIFICATION\weatherAUS.csv")
pd.set_option("display.max_columns", None)
df.head(20)
```

|  | Date | Location | MinTemp | MaxTemp | Rainfall | Evaporation | Sunshine | WindGustDir | WindGustSpeed | WindDir9am | WindDir3pm | WindSpeed9am | WindSpeed3pm | Humidity9am | Humidity3pm | Pressure9am | Pressure3pm | Cloud9am | Cloud3pm | Temp9am | Temp3pm | RainToday | RainTomorrow |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 2008-12-01 | Albury | 13.4 | 22.9 | 0.6 | NaN | NaN | W | 44.0 | W | WNW | 20.0 | 24.0 | 71.0 | 22.0 | 1007.7 | 1007.1 | 8.0 | NaN | 16.9 | 21.8 | No | No |
| 1 | 2008-12-02 | Albury | 7.4 | 25.1 | 0.0 | NaN | NaN | WNW | 44.0 | NNW | WSW | 4.0 | 22.0 | 44.0 | 25.0 | 1010.6 | 1007.8 | NaN | NaN | 17.2 | 24.3 | No | No |
| 2 | 2008-12-03 | Albury | 12.9 | 25.7 | 0.0 | NaN | NaN | WSW | 46.0 | W | WSW | 19.0 | 26.0 | 38.0 | 30.0 | 1007.6 | 1008.7 | NaN | 2.0 | 21.0 | 23.2 | No | No |
| 3 | 2008-12-04 | Albury | 9.2 | 28.0 | 0.0 | NaN | NaN | NE | 24.0 | SE | E | 11.0 | 9.0 | 45.0 | 16.0 | 1017.6 | 1012.8 | NaN | NaN | 18.1 | 26.5 | No | No |
| 4 | 2008-12-05 | Albury | 17.5 | 32.3 | 1.0 | NaN | NaN | W | 41.0 | ENE | NW | 7.0 | 20.0 | 82.0 | 33.0 | 1010.8 | 1006.0 | 7.0 | 8.0 | 17.8 | 29.7 | No | No |
| 5 | 2008-12-06 | Albury | 14.6 | 29.7 | 0.2 | NaN | NaN | WNW | 56.0 | W | W | 19.0 | 24.0 | 55.0 | 23.0 | 1009.2 | 1005.4 | NaN | NaN | 20.6 | 28.9 | No | No |
| 6 | 2008-12-07 | Albury | 14.3 | 25.0 | 0.0 | NaN | NaN | W | 50.0 | SW | W | 20.0 | 24.0 | 49.0 | 19.0 | 1009.6 | 1008.2 | 1.0 | NaN | 18.1 | 24.6 | No | No |
| 7 | 2008-12-08 | Albury | 7.7 | 26.7 | 0.0 | NaN | NaN | W | 35.0 | SSE | W | 6.0 | 17.0 | 48.0 | 19.0 | 1013.4 | 1010.1 | NaN | NaN | 16.3 | 25.5 | No | No |
| 8 | 2008-12-09 | Albury | 9.7 | 31.9 | 0.0 | NaN | NaN | NNW | 80.0 | SE | NW | 7.0 | 28.0 | 42.0 | 9.0 | 1008.9 | 1003.6 | NaN | NaN | 18.3 | 30.2 | No | Yes |
| 9 | 2008-12-10 | Albury | 13.1 | 30.1 | 1.4 | NaN | NaN | W | 28.0 | S | SSE | 15.0 | 11.0 | 58.0 | 27.0 | 1007.0 | 1005.7 | NaN | NaN | 20.1 | 28.2 | Yes | No |
| … 10 more rows |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

```python
numerical_feature = [feature for feature in df.columns if df[feature].dtypes != 'O']
discrete_feature=[feature for feature in numerical_feature if len(df[feature].unique())<25]
continuous_feature = [feature for feature in numerical_feature if feature not in discrete_feature]
categorical_feature = [feature for feature in df.columns if feature not in numerical_feature]
print("Numerical Features Count {}".format(len(numerical_feature)))
print("Discrete feature Count {}".format(len(discrete_feature)))
print("Continuous feature Count {}".format(len(continuous_feature)))
print("Categorical feature Count {}".format(len(categorical_feature)))
```
```output
Numerical Features Count 16
Discrete feature Count 2
Continuous feature Count 14
Categorical feature Count 7
```

```python
# Handle Missing Values
df.isnull().sum()*100/len(df)
```
```output
Date              0.000000
Location          0.000000
MinTemp           1.020899
MaxTemp           0.866905
Rainfall          2.241853
Evaporation      43.166506
Sunshine         48.009762
WindGustDir       7.098859
WindGustSpeed     7.055548
WindDir9am        7.263853
… (11 more lines)
RainToday         2.241853
RainTomorrow      2.245978
dtype: float64
```

```python
print(numerical_feature)
```
```output
['MinTemp', 'MaxTemp', 'Rainfall', 'Evaporation', 'Sunshine', 'WindGustSpeed', 'WindSpeed9am', 'WindSpeed3pm', 'Humidity9am', 'Humidity3pm', 'Pressure9am', 'Pressure3pm', 'Cloud9am', 'Cloud3pm', 'Temp9am', 'Temp3pm']
```

```python
def randomsampleimputation(df, variable):
    df[variable]=df[variable]
    random_sample=df[variable].dropna().sample(df[variable].isnull().sum(),random_state=0)
    random_sample.index=df[df[variable].isnull()].index
    df.loc[df[variable].isnull(),variable]=random_sample
```

```python
randomsampleimputation(df, "Cloud9am")
randomsampleimputation(df, "Cloud3pm")
randomsampleimputation(df, "Evaporation")
randomsampleimputation(df, "Sunshine")
```

```python
df.head(12)
```

|  | Date | Location | MinTemp | MaxTemp | Rainfall | Evaporation | Sunshine | WindGustDir | WindGustSpeed | WindDir9am | WindDir3pm | WindSpeed9am | WindSpeed3pm | Humidity9am | Humidity3pm | Pressure9am | Pressure3pm | Cloud9am | Cloud3pm | Temp9am | Temp3pm | RainToday | RainTomorrow |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 2008-12-01 | Albury | 13.4 | 22.9 | 0.6 | 2.4 | 8.3 | W | 44.0 | W | WNW | 20.0 | 24.0 | 71.0 | 22.0 | 1007.7 | 1007.1 | 8.0 | 0.0 | 16.9 | 21.8 | No | No |
| 1 | 2008-12-02 | Albury | 7.4 | 25.1 | 0.0 | 3.6 | 10.0 | WNW | 44.0 | NNW | WSW | 4.0 | 22.0 | 44.0 | 25.0 | 1010.6 | 1007.8 | 7.0 | 1.0 | 17.2 | 24.3 | No | No |
| 2 | 2008-12-03 | Albury | 12.9 | 25.7 | 0.0 | 2.6 | 4.4 | WSW | 46.0 | W | WSW | 19.0 | 26.0 | 38.0 | 30.0 | 1007.6 | 1008.7 | 8.0 | 2.0 | 21.0 | 23.2 | No | No |
| 3 | 2008-12-04 | Albury | 9.2 | 28.0 | 0.0 | 18.4 | 8.9 | NE | 24.0 | SE | E | 11.0 | 9.0 | 45.0 | 16.0 | 1017.6 | 1012.8 | 0.0 | 5.0 | 18.1 | 26.5 | No | No |
| 4 | 2008-12-05 | Albury | 17.5 | 32.3 | 1.0 | 5.4 | 3.0 | W | 41.0 | ENE | NW | 7.0 | 20.0 | 82.0 | 33.0 | 1010.8 | 1006.0 | 7.0 | 8.0 | 17.8 | 29.7 | No | No |
| 5 | 2008-12-06 | Albury | 14.6 | 29.7 | 0.2 | 5.2 | 11.6 | WNW | 56.0 | W | W | 19.0 | 24.0 | 55.0 | 23.0 | 1009.2 | 1005.4 | 8.0 | 5.0 | 20.6 | 28.9 | No | No |
| 6 | 2008-12-07 | Albury | 14.3 | 25.0 | 0.0 | 3.8 | 8.5 | W | 50.0 | SW | W | 20.0 | 24.0 | 49.0 | 19.0 | 1009.6 | 1008.2 | 1.0 | 8.0 | 18.1 | 24.6 | No | No |
| 7 | 2008-12-08 | Albury | 7.7 | 26.7 | 0.0 | 6.4 | 5.8 | W | 35.0 | SSE | W | 6.0 | 17.0 | 48.0 | 19.0 | 1013.4 | 1010.1 | 8.0 | 7.0 | 16.3 | 25.5 | No | No |
| 8 | 2008-12-09 | Albury | 9.7 | 31.9 | 0.0 | 3.0 | 6.1 | NNW | 80.0 | SE | NW | 7.0 | 28.0 | 42.0 | 9.0 | 1008.9 | 1003.6 | 1.0 | 8.0 | 18.3 | 30.2 | No | Yes |
| 9 | 2008-12-10 | Albury | 13.1 | 30.1 | 1.4 | 0.6 | 9.7 | W | 28.0 | S | SSE | 15.0 | 11.0 | 58.0 | 27.0 | 1007.0 | 1005.7 | 1.0 | 3.0 | 20.1 | 28.2 | Yes | No |
| … 2 more rows |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

```python
corrmat = df.corr(method = "spearman")
plt.figure(figsize=(20,20))
#plot heat map
g=sns.heatmap(corrmat,annot=True)
```

![Figure](kb-media:8a07b9e6358d1aa160ef.png)

```python
for feature in continuous_feature:
    data=df.copy()
    sns.distplot(df[feature])
    plt.xlabel(feature)
    plt.ylabel("Count")
    plt.title(feature)
    plt.figure(figsize=(15,15))
    plt.show()
```

![Figure](kb-media:7cd10671c7e80d5a919c.png)

![Figure](kb-media:dcbfa39f6c02c188a24d.png)

![Figure](kb-media:cf3009de266b84148df6.png)

![Figure](kb-media:8ad4e8a7d026d9f48424.png)

![Figure](kb-media:b5241cf83ab70f02c155.png)

![Figure](kb-media:8c3ab58781b5477b9d4f.png)

![Figure](kb-media:dd8d38172005fde131bc.png)

![Figure](kb-media:b4520f0970c3ef0ae05a.png)

![Figure](kb-media:308f494d11da5611ff1a.png)

![Figure](kb-media:88ea18038acfb4fa9cb8.png)

![Figure](kb-media:c66152e492dcfa6cedd5.png)

![Figure](kb-media:f9cede75c6182bb72447.png)

![Figure](kb-media:9eba82e1026709378546.png)

![Figure](kb-media:6c7ed6b7d7f50cb8e20a.png)

```python
#A for loop is used to plot a boxplot for all the continuous features to see the outliers
for feature in continuous_feature:
    data=df.copy()
    sns.boxplot(data[feature])
    plt.title(feature)
    plt.figure(figsize=(15,15))
```

![Figure](kb-media:59bddcd09c070ef6bc2e.png)

![Figure](kb-media:53a7bf0dacc18c7c4344.png)

![Figure](kb-media:895aa33da38efb436265.png)

![Figure](kb-media:b607646c2ff02142d4de.png)

![Figure](kb-media:f09a115299f0629909d0.png)

![Figure](kb-media:2e65178f31290807bf5a.png)

![Figure](kb-media:2e46719a10f666a3a707.png)

![Figure](kb-media:88a21d9951e50cf67fea.png)

![Figure](kb-media:18d0d09b1200d2340d36.png)

![Figure](kb-media:be3897bf4e7e05832e30.png)

![Figure](kb-media:621e88b09eb45cfc5b4c.png)

![Figure](kb-media:beb60459f6f3c9ec8bce.png)

![Figure](kb-media:4b8187f92de79b3c08d6.png)

![Figure](kb-media:6265d80a8a2e767da179.png)

```python
for feature in continuous_feature:
    if(df[feature].isnull().sum()*100/len(df))>0:
        df[feature] = df[feature].fillna(df[feature].median())
```

```python
df.isnull().sum()*100/len(df)
```
```output
Date             0.000000
Location         0.000000
MinTemp          0.000000
MaxTemp          0.000000
Rainfall         0.000000
Evaporation      0.000000
Sunshine         0.000000
WindGustDir      7.098859
WindGustSpeed    0.000000
WindDir9am       7.263853
… (11 more lines)
RainToday        2.241853
RainTomorrow     2.245978
dtype: float64
```

```python
discrete_feature
```
```output
['Cloud9am', 'Cloud3pm']
```

```python
def mode_nan(df,variable):
    mode=df[variable].value_counts().index[0]
    df[variable].fillna(mode,inplace=True)
mode_nan(df,"Cloud9am")
mode_nan(df,"Cloud3pm")
```

```python
df["RainToday"] = pd.get_dummies(df["RainToday"], drop_first = True)
df["RainTomorrow"] = pd.get_dummies(df["RainTomorrow"], drop_first = True)
df
```

|  | Date | Location | MinTemp | MaxTemp | Rainfall | Evaporation | Sunshine | WindGustDir | WindGustSpeed | WindDir9am | WindDir3pm | WindSpeed9am | WindSpeed3pm | Humidity9am | Humidity3pm | Pressure9am | Pressure3pm | Cloud9am | Cloud3pm | Temp9am | Temp3pm | RainToday | RainTomorrow |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 2008-12-01 | Albury | 13.4 | 22.9 | 0.6 | 2.4 | 8.3 | W | 44.0 | W | WNW | 20.0 | 24.0 | 71.0 | 22.0 | 1007.7 | 1007.1 | 8.0 | 0.0 | 16.9 | 21.8 | 0 | 0 |
| 1 | 2008-12-02 | Albury | 7.4 | 25.1 | 0.0 | 3.6 | 10.0 | WNW | 44.0 | NNW | WSW | 4.0 | 22.0 | 44.0 | 25.0 | 1010.6 | 1007.8 | 7.0 | 1.0 | 17.2 | 24.3 | 0 | 0 |
| 2 | 2008-12-03 | Albury | 12.9 | 25.7 | 0.0 | 2.6 | 4.4 | WSW | 46.0 | W | WSW | 19.0 | 26.0 | 38.0 | 30.0 | 1007.6 | 1008.7 | 8.0 | 2.0 | 21.0 | 23.2 | 0 | 0 |
| 3 | 2008-12-04 | Albury | 9.2 | 28.0 | 0.0 | 18.4 | 8.9 | NE | 24.0 | SE | E | 11.0 | 9.0 | 45.0 | 16.0 | 1017.6 | 1012.8 | 0.0 | 5.0 | 18.1 | 26.5 | 0 | 0 |
| 4 | 2008-12-05 | Albury | 17.5 | 32.3 | 1.0 | 5.4 | 3.0 | W | 41.0 | ENE | NW | 7.0 | 20.0 | 82.0 | 33.0 | 1010.8 | 1006.0 | 7.0 | 8.0 | 17.8 | 29.7 | 0 | 0 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 145455 | 2017-06-21 | Uluru | 2.8 | 23.4 | 0.0 | 1.4 | 7.8 | E | 31.0 | SE | ENE | 13.0 | 11.0 | 51.0 | 24.0 | 1024.6 | 1020.3 | 1.0 | 1.0 | 10.1 | 22.4 | 0 | 0 |
| 145456 | 2017-06-22 | Uluru | 3.6 | 25.3 | 0.0 | 7.6 | 13.5 | NNW | 22.0 | SE | N | 13.0 | 9.0 | 56.0 | 21.0 | 1023.5 | 1019.1 | 8.0 | 5.0 | 10.9 | 24.5 | 0 | 0 |
| 145457 | 2017-06-23 | Uluru | 5.4 | 26.9 | 0.0 | 6.8 | 11.0 | N | 37.0 | SE | WNW | 9.0 | 9.0 | 53.0 | 24.0 | 1021.0 | 1016.8 | 8.0 | 1.0 | 12.5 | 26.1 | 0 | 0 |
| 145458 | 2017-06-24 | Uluru | 7.8 | 27.0 | 0.0 | 2.6 | 13.2 | SE | 28.0 | SSE | N | 13.0 | 7.0 | 51.0 | 24.0 | 1019.4 | 1016.5 | 3.0 | 2.0 | 15.1 | 26.0 | 0 | 0 |
| … 1 more rows |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

```python
for feature in categorical_feature:
    print(feature, (df.groupby([feature])["RainTomorrow"].mean().sort_values(ascending = False)).index)
```
```output
Date Index(['2007-11-01', '2008-01-19', '2007-12-07', '2007-12-15', '2007-12-16',
       '2007-12-19', '2007-12-20', '2007-12-21', '2007-12-22', '2007-12-24',
       ...
       '2008-05-02', '2008-05-01', '2008-04-30', '2008-04-29', '2008-04-28',
       '2008-04-26', '2008-04-25', '2016-11-26', '2012-04-07', '2008-08-17'],
      dtype='object', name='Date', length=3436)
Location Index(['Portland', 'Walpole', 'Cairns', 'Dartmoor', 'NorfolkIsland',
       'MountGambier', 'Albany', 'Witchcliffe', 'CoffsHarbour', 'MountGinini',
       'NorahHead', 'Darwin', 'Sydney', 'SydneyAirport', 'Ballarat',
       'GoldCoast', 'Watsonia', 'Newcastle', 'Hobart', 'Wollongong',
… (15 more lines)
      dtype='object', name='WindDir3pm')
RainToday UInt64Index([1, 0], dtype='uint64', name='RainToday')
RainTomorrow UInt64Index([1, 0], dtype='uint64', name='RainTomorrow')
```

```python
windgustdir = {'NNW':0, 'NW':1, 'WNW':2, 'N':3, 'W':4, 'WSW':5, 'NNE':6, 'S':7, 'SSW':8, 'SW':9, 'SSE':10,
       'NE':11, 'SE':12, 'ESE':13, 'ENE':14, 'E':15}
winddir9am = {'NNW':0, 'N':1, 'NW':2, 'NNE':3, 'WNW':4, 'W':5, 'WSW':6, 'SW':7, 'SSW':8, 'NE':9, 'S':10,
       'SSE':11, 'ENE':12, 'SE':13, 'ESE':14, 'E':15}
winddir3pm = {'NW':0, 'NNW':1, 'N':2, 'WNW':3, 'W':4, 'NNE':5, 'WSW':6, 'SSW':7, 'S':8, 'SW':9, 'SE':10,
       'NE':11, 'SSE':12, 'ENE':13, 'E':14, 'ESE':15}
df["WindGustDir"] = df["WindGustDir"].map(windgustdir)
df["WindDir9am"] = df["WindDir9am"].map(winddir9am)
df["WindDir3pm"] = df["WindDir3pm"].map(winddir3pm)
```

```python
df["WindGustDir"] = df["WindGustDir"].fillna(df["WindGustDir"].value_counts().index[0])
df["WindDir9am"] = df["WindDir9am"].fillna(df["WindDir9am"].value_counts().index[0])
df["WindDir3pm"] = df["WindDir3pm"].fillna(df["WindDir3pm"].value_counts().index[0])
```

```python
df.isnull().sum()*100/len(df)
```
```output
Date             0.0
Location         0.0
MinTemp          0.0
MaxTemp          0.0
Rainfall         0.0
Evaporation      0.0
Sunshine         0.0
WindGustDir      0.0
WindGustSpeed    0.0
WindDir9am       0.0
… (11 more lines)
RainToday        0.0
RainTomorrow     0.0
dtype: float64
```

```python
encoder = preprocessing.LabelEncoder() 
df['Location']= encoder.fit_transform(df['Location'])
```

```python
df["Date"] = pd.to_datetime(df["Date"], format = "%Y-%m-%dT", errors = "coerce")
```

```python
df["Date_year"] = df["Date"].dt.year
df["Date_month"] = df["Date"].dt.month
df["Date_day"] = df["Date"].dt.day
```

```python
df
```

|  | Date | Location | MinTemp | MaxTemp | Rainfall | Evaporation | Sunshine | WindGustDir | WindGustSpeed | WindDir9am | WindDir3pm | WindSpeed9am | WindSpeed3pm | Humidity9am | Humidity3pm | Pressure9am | Pressure3pm | Cloud9am | Cloud3pm | Temp9am | Temp3pm | RainToday | RainTomorrow | Date_year | Date_month | Date_day |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 2008-12-01 | 2 | 13.4 | 22.9 | 0.6 | 2.4 | 8.3 | 4.0 | 44.0 | 5.0 | 3.0 | 20.0 | 24.0 | 71.0 | 22.0 | 1007.7 | 1007.1 | 8.0 | 0.0 | 16.9 | 21.8 | 0 | 0 | 2008 | 12 | 1 |
| 1 | 2008-12-02 | 2 | 7.4 | 25.1 | 0.0 | 3.6 | 10.0 | 2.0 | 44.0 | 0.0 | 6.0 | 4.0 | 22.0 | 44.0 | 25.0 | 1010.6 | 1007.8 | 7.0 | 1.0 | 17.2 | 24.3 | 0 | 0 | 2008 | 12 | 2 |
| 2 | 2008-12-03 | 2 | 12.9 | 25.7 | 0.0 | 2.6 | 4.4 | 5.0 | 46.0 | 5.0 | 6.0 | 19.0 | 26.0 | 38.0 | 30.0 | 1007.6 | 1008.7 | 8.0 | 2.0 | 21.0 | 23.2 | 0 | 0 | 2008 | 12 | 3 |
| 3 | 2008-12-04 | 2 | 9.2 | 28.0 | 0.0 | 18.4 | 8.9 | 11.0 | 24.0 | 13.0 | 14.0 | 11.0 | 9.0 | 45.0 | 16.0 | 1017.6 | 1012.8 | 0.0 | 5.0 | 18.1 | 26.5 | 0 | 0 | 2008 | 12 | 4 |
| 4 | 2008-12-05 | 2 | 17.5 | 32.3 | 1.0 | 5.4 | 3.0 | 4.0 | 41.0 | 12.0 | 0.0 | 7.0 | 20.0 | 82.0 | 33.0 | 1010.8 | 1006.0 | 7.0 | 8.0 | 17.8 | 29.7 | 0 | 0 | 2008 | 12 | 5 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 145455 | 2017-06-21 | 41 | 2.8 | 23.4 | 0.0 | 1.4 | 7.8 | 15.0 | 31.0 | 13.0 | 13.0 | 13.0 | 11.0 | 51.0 | 24.0 | 1024.6 | 1020.3 | 1.0 | 1.0 | 10.1 | 22.4 | 0 | 0 | 2017 | 6 | 21 |
| 145456 | 2017-06-22 | 41 | 3.6 | 25.3 | 0.0 | 7.6 | 13.5 | 0.0 | 22.0 | 13.0 | 2.0 | 13.0 | 9.0 | 56.0 | 21.0 | 1023.5 | 1019.1 | 8.0 | 5.0 | 10.9 | 24.5 | 0 | 0 | 2017 | 6 | 22 |
| 145457 | 2017-06-23 | 41 | 5.4 | 26.9 | 0.0 | 6.8 | 11.0 | 3.0 | 37.0 | 13.0 | 3.0 | 9.0 | 9.0 | 53.0 | 24.0 | 1021.0 | 1016.8 | 8.0 | 1.0 | 12.5 | 26.1 | 0 | 0 | 2017 | 6 | 23 |
| 145458 | 2017-06-24 | 41 | 7.8 | 27.0 | 0.0 | 2.6 | 13.2 | 12.0 | 28.0 | 11.0 | 2.0 | 13.0 | 7.0 | 51.0 | 24.0 | 1019.4 | 1016.5 | 3.0 | 2.0 | 15.1 | 26.0 | 0 | 0 | 2017 | 6 | 24 |
| … 1 more rows |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

```python
corrmat = df.corr()
plt.figure(figsize=(20,20))
#plot heat map
g=sns.heatmap(corrmat,annot=True)
```

![Figure](kb-media:b6695bd061171f4e520a.png)

```python
sns.countplot(df["RainTomorrow"])
```

![Figure](kb-media:c1ccab2fa63b2bc46265.png)

```python
df
```

|  | Date | Location | MinTemp | MaxTemp | Rainfall | Evaporation | Sunshine | WindGustDir | WindGustSpeed | WindDir9am | WindDir3pm | WindSpeed9am | WindSpeed3pm | Humidity9am | Humidity3pm | Pressure9am | Pressure3pm | Cloud9am | Cloud3pm | Temp9am | Temp3pm | RainToday | RainTomorrow | Date_year | Date_month | Date_day |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 2008-12-01 | 2 | 13.4 | 22.9 | 0.6 | 2.4 | 8.3 | 4.0 | 44.0 | 5.0 | 3.0 | 20.0 | 24.0 | 71.0 | 22.0 | 1007.7 | 1007.1 | 8.0 | 0.0 | 16.9 | 21.8 | 0 | 0 | 2008 | 12 | 1 |
| 1 | 2008-12-02 | 2 | 7.4 | 25.1 | 0.0 | 3.6 | 10.0 | 2.0 | 44.0 | 0.0 | 6.0 | 4.0 | 22.0 | 44.0 | 25.0 | 1010.6 | 1007.8 | 7.0 | 1.0 | 17.2 | 24.3 | 0 | 0 | 2008 | 12 | 2 |
| 2 | 2008-12-03 | 2 | 12.9 | 25.7 | 0.0 | 2.6 | 4.4 | 5.0 | 46.0 | 5.0 | 6.0 | 19.0 | 26.0 | 38.0 | 30.0 | 1007.6 | 1008.7 | 8.0 | 2.0 | 21.0 | 23.2 | 0 | 0 | 2008 | 12 | 3 |
| 3 | 2008-12-04 | 2 | 9.2 | 28.0 | 0.0 | 18.4 | 8.9 | 11.0 | 24.0 | 13.0 | 14.0 | 11.0 | 9.0 | 45.0 | 16.0 | 1017.6 | 1012.8 | 0.0 | 5.0 | 18.1 | 26.5 | 0 | 0 | 2008 | 12 | 4 |
| 4 | 2008-12-05 | 2 | 17.5 | 32.3 | 1.0 | 5.4 | 3.0 | 4.0 | 41.0 | 12.0 | 0.0 | 7.0 | 20.0 | 82.0 | 33.0 | 1010.8 | 1006.0 | 7.0 | 8.0 | 17.8 | 29.7 | 0 | 0 | 2008 | 12 | 5 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 145455 | 2017-06-21 | 41 | 2.8 | 23.4 | 0.0 | 1.4 | 7.8 | 15.0 | 31.0 | 13.0 | 13.0 | 13.0 | 11.0 | 51.0 | 24.0 | 1024.6 | 1020.3 | 1.0 | 1.0 | 10.1 | 22.4 | 0 | 0 | 2017 | 6 | 21 |
| 145456 | 2017-06-22 | 41 | 3.6 | 25.3 | 0.0 | 7.6 | 13.5 | 0.0 | 22.0 | 13.0 | 2.0 | 13.0 | 9.0 | 56.0 | 21.0 | 1023.5 | 1019.1 | 8.0 | 5.0 | 10.9 | 24.5 | 0 | 0 | 2017 | 6 | 22 |
| 145457 | 2017-06-23 | 41 | 5.4 | 26.9 | 0.0 | 6.8 | 11.0 | 3.0 | 37.0 | 13.0 | 3.0 | 9.0 | 9.0 | 53.0 | 24.0 | 1021.0 | 1016.8 | 8.0 | 1.0 | 12.5 | 26.1 | 0 | 0 | 2017 | 6 | 23 |
| 145458 | 2017-06-24 | 41 | 7.8 | 27.0 | 0.0 | 2.6 | 13.2 | 12.0 | 28.0 | 11.0 | 2.0 | 13.0 | 7.0 | 51.0 | 24.0 | 1019.4 | 1016.5 | 3.0 | 2.0 | 15.1 | 26.0 | 0 | 0 | 2017 | 6 | 24 |
| … 1 more rows |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

```python
for feature in continuous_feature:
    data=df.copy()
    sns.boxplot(data[feature])
    plt.title(feature)
    plt.figure(figsize=(15,15))
```

![Figure](kb-media:6bb9cde23e3a72cc444e.png)

![Figure](kb-media:13ded07de48c218876d0.png)

![Figure](kb-media:5ea1c697e6e13012ba5b.png)

![Figure](kb-media:b607646c2ff02142d4de.png)

![Figure](kb-media:f09a115299f0629909d0.png)

![Figure](kb-media:3cd978bf1726f3355158.png)

![Figure](kb-media:2e46719a10f666a3a707.png)

![Figure](kb-media:88a21d9951e50cf67fea.png)

![Figure](kb-media:18d0d09b1200d2340d36.png)

![Figure](kb-media:5a05178c3f8784285822.png)

![Figure](kb-media:f5f50719111ef3648cc9.png)

![Figure](kb-media:5cc058d6ac7c2995f401.png)

![Figure](kb-media:1507054291e600f141ed.png)

![Figure](kb-media:1ca4f357171951c8b0d8.png)

```python
def qq_plots(df, variable):
    plt.figure(figsize=(15,6))
    plt.subplot(1, 2, 1)
    df[variable].hist()
    plt.subplot(1, 2, 2)
    stats.probplot(df[variable], dist="norm", plot=plt)
    plt.show()
```

```python
for feature in continuous_feature:
    print(feature)
    plt.figure(figsize=(15,6))
    plt.subplot(1, 2, 1)
    df[feature].hist()
    plt.subplot(1, 2, 2)
    stats.probplot(df[feature], dist="norm", plot=plt)
    plt.show()
```
```output
MinTemp
MaxTemp
Rainfall
Evaporation
Sunshine
WindGustSpeed
WindSpeed9am
WindSpeed3pm
Humidity9am
Humidity3pm
Pressure9am
Pressure3pm
Temp9am
Temp3pm
```

![Figure](kb-media:a0863f8a1ecffa142e3f.png)

![Figure](kb-media:f57168a995fa6128494f.png)

![Figure](kb-media:8273a5d6c805ed03a04f.png)

![Figure](kb-media:7f04c3b8efafc1dbae05.png)

![Figure](kb-media:cf80c9bfdbabdec29bfd.png)

![Figure](kb-media:9fc764ee69a8e846b776.png)

![Figure](kb-media:6ccfcbab1032d1a35872.png)

![Figure](kb-media:ce856fa8f92d096755bd.png)

![Figure](kb-media:6c0d3ea0e2c411e5fb4d.png)

![Figure](kb-media:e6d6b0679297be5e8c33.png)

![Figure](kb-media:2833f8498adb8d430593.png)

![Figure](kb-media:685d545e86cd2621ac08.png)

![Figure](kb-media:764cdc14a4d0a0ca04df.png)

![Figure](kb-media:6c1c01e2b0925ae2dae1.png)

```python
df.to_csv("preprocessed3.csv", index=False)
```

```python
X = df.drop(["RainTomorrow", "Date"], axis=1)
Y = df["RainTomorrow"]
```

```python
# scaler = RobustScaler()
# X_scaled = scaler.fit_transform(X)
```

```python
X_train, X_test, y_train, y_test = train_test_split(X,Y, test_size =0.2, stratify = Y, random_state = 0)
```

```python
y_train
```
```output
43447     0
140904    0
54615     0
109793    0
74462     0
         ..
106567    0
52791     1
56339     0
82299     1
115175    0
Name: RainTomorrow, Length: 116368, dtype: uint8
```

```python
sm=SMOTE(random_state=0)
X_train_res, y_train_res = sm.fit_resample(X_train, y_train)
print("The number of classes before fit {}".format(Counter(y_train)))
print("The number of classes after fit {}".format(Counter(y_train_res)))
```
```output
The number of classes before fit Counter({0: 90866, 1: 25502})
The number of classes after fit Counter({0: 90866, 1: 90866})
```

```python
cat = CatBoostClassifier(iterations=2000, eval_metric = "AUC")
cat.fit(X_train_res, y_train_res)
```
```output
Learning rate set to 0.050311
0:	total: 214ms	remaining: 7m 7s
1:	total: 265ms	remaining: 4m 24s
2:	total: 318ms	remaining: 3m 31s
3:	total: 366ms	remaining: 3m 2s
4:	total: 414ms	remaining: 2m 45s
5:	total: 475ms	remaining: 2m 37s
6:	total: 534ms	remaining: 2m 32s
7:	total: 599ms	remaining: 2m 29s
8:	total: 650ms	remaining: 2m 23s
… (1989 more lines)
1998:	total: 1m 45s	remaining: 52.6ms
1999:	total: 1m 45s	remaining: 0us
<catboost.core.CatBoostClassifier at 0x257d5e7b358>
```

```python
y_pred = cat.predict(X_test)
print(confusion_matrix(y_test,y_pred))
print(accuracy_score(y_test,y_pred))
print(classification_report(y_test,y_pred))
```
```output
[[21520  1197]
 [ 2815  3560]]
0.8620926715248178
              precision    recall  f1-score   support

           0       0.88      0.95      0.91     22717
           1       0.75      0.56      0.64      6375

    accuracy                           0.86     29092
   macro avg       0.82      0.75      0.78     29092
weighted avg       0.85      0.86      0.85     29092
```

```python
metrics.plot_roc_curve(cat, X_test, y_test)
metrics.roc_auc_score(y_test, y_pred, average=None)
```
```output
0.7528697779239354
```

![Figure](kb-media:40c9bf03860403fbadc5.png)

```python
rf=RandomForestClassifier()
rf.fit(X_train_res,y_train_res)
```
```output
RandomForestClassifier()
```

```python
y_pred1 = rf.predict(X_test)
print(confusion_matrix(y_test,y_pred1))
print(accuracy_score(y_test,y_pred1))
print(classification_report(y_test,y_pred1))
```
```output
[[20614  2103]
 [ 2441  3934]]
0.843805857280352
              precision    recall  f1-score   support

           0       0.89      0.91      0.90     22717
           1       0.65      0.62      0.63      6375

    accuracy                           0.84     29092
   macro avg       0.77      0.76      0.77     29092
weighted avg       0.84      0.84      0.84     29092
```

```python
metrics.plot_roc_curve(rf, X_test, y_test)
metrics.roc_auc_score(y_test, y_pred1, average=None)
```
```output
0.7622620979192398
```

![Figure](kb-media:508ce28fc2310b299b9a.png)

```python
logreg = LogisticRegression()
logreg.fit(X_train_res, y_train_res)
```
```output
LogisticRegression()
```

```python
y_pred2 = logreg.predict(X_test)
print(confusion_matrix(y_test,y_pred2))
print(accuracy_score(y_test,y_pred2))
print(classification_report(y_test,y_pred2))
```
```output
[[17788  4929]
 [ 1521  4854]]
0.7782895641413446
              precision    recall  f1-score   support

           0       0.92      0.78      0.85     22717
           1       0.50      0.76      0.60      6375

    accuracy                           0.78     29092
   macro avg       0.71      0.77      0.72     29092
weighted avg       0.83      0.78      0.79     29092
```

```python
metrics.plot_roc_curve(logreg, X_test, y_test)
metrics.roc_auc_score(y_test, y_pred2, average=None)
```
```output
0.7722188462126058
```

![Figure](kb-media:7e5ff95c65e42063a40b.png)

```python
gnb = GaussianNB()
gnb.fit(X_train_res, y_train_res)
```
```output
GaussianNB()
```

```python
y_pred3 = gnb.predict(X_test)
print(confusion_matrix(y_test,y_pred3))
print(accuracy_score(y_test,y_pred3))
print(classification_report(y_test,y_pred3))
```
```output
[[18235  4482]
 [ 2011  4364]]
0.7768114945689537
              precision    recall  f1-score   support

           0       0.90      0.80      0.85     22717
           1       0.49      0.68      0.57      6375

    accuracy                           0.78     29092
   macro avg       0.70      0.74      0.71     29092
weighted avg       0.81      0.78      0.79     29092
```

```python
metrics.plot_roc_curve(gnb, X_test, y_test)
metrics.roc_auc_score(y_test, y_pred3, average=None)
```
```output
0.7436259206416201
```

![Figure](kb-media:9c9f5f46dcefdd7eaed4.png)

```python
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train_res, y_train_res)
```
```output
KNeighborsClassifier(n_neighbors=3)
```

```python
y_pred4 = knn.predict(X_test)
print(confusion_matrix(y_test,y_pred4))
print(accuracy_score(y_test,y_pred4))
print(classification_report(y_test,y_pred4))
```
```output
[[17294  5423]
 [ 1779  4596]]
0.7524405334799945
              precision    recall  f1-score   support

           0       0.91      0.76      0.83     22717
           1       0.46      0.72      0.56      6375

    accuracy                           0.75     29092
   macro avg       0.68      0.74      0.69     29092
weighted avg       0.81      0.75      0.77     29092
```

```python
metrics.plot_roc_curve(knn, X_test, y_test)
metrics.roc_auc_score(y_test, y_pred4, average=None)
```
```output
0.7411106375375787
```

![Figure](kb-media:12328e0f2c85f87183e2.png)

```python
svc = SVC()
```

```python
svc.fit(X_train_res, y_train_res)
```

```python
y_pred5 = svc.predict(X_test)
print(confusion_matrix(y_test,y_pred5))
print(accuracy_score(y_test,y_pred5))
print(classification_report(y_test,y_pred5))
```

```python
metrics.plot_roc_curve(svc, X_test, y_test)
metrics.roc_auc_score(y_test, y_pred5, average=None)
```

```python
xgb = XGBClassifier()
xgb.fit(X_train_res, y_train_res)
```

```python
y_pred6 = xgb.predict(X_test)
print(confusion_matrix(y_test,y_pred6))
print(accuracy_score(y_test,y_pred6))
print(classification_report(y_test,y_pred6))
```

```python
metrics.plot_roc_curve(xgb, X_test, y_test)
metrics.roc_auc_score(y_test, y_pred6, average=None)
```

```python
joblib.dump(rf, "rf.pkl")
joblib.dump(cat, "cat.pkl")
joblib.dump(logreg, "logreg.pkl")
joblib.dump(gnb, "gnb.pkl")
joblib.dump(knn, "knn.pkl")
joblib.dump(svc, "svc.pkl")
joblib.dump(xgb, "xgb.pkl")
```
