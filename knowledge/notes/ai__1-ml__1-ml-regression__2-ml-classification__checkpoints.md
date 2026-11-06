Earlier autosaved versions Jupyter kept beside the notebooks in this folder. They differ from the notebooks above, so they are kept; each renders below in full.

# BEST--logistic regression (earlier version)

[Download BEST--logistic regression-checkpoint.ipynb](kb-file:18CSC305J-Artificial%20intellegence/1.ML/1.ML%20REGRESSION/2.ML%20CLASSIFICATION/.ipynb_checkpoints/BEST--logistic%20regression-checkpoint.ipynb)

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

```result title="Error"
---------------------------------------------------------------------------
ModuleNotFoundError                       Traceback (most recent call last)
~\AppData\Local\Temp\ipykernel_18140\811512273.py in <module>
      7 from sklearn.model_selection import train_test_split
      8 from collections import Counter
----> 9 from imblearn.over_sampling import SMOTE
     10 from sklearn.metrics import accuracy_score,confusion_matrix,classification_report
     11 from sklearn import metrics

ModuleNotFoundError: No module named 'imblearn'
```

```python
pip install -U imbalanced-learn
```

```python
df = pd.read_csv(r"C:\Users\surya\ML CLASSIFICATION\weatherAUS.csv")
pd.set_option("display.max_columns", None)
df.head(20)
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Date</th>
      <th>Location</th>
      <th>MinTemp</th>
      <th>MaxTemp</th>
      <th>Rainfall</th>
      <th>Evaporation</th>
      <th>Sunshine</th>
      <th>WindGustDir</th>
      <th>WindGustSpeed</th>
      <th>WindDir9am</th>
      <th>WindDir3pm</th>
      <th>WindSpeed9am</th>
      <th>WindSpeed3pm</th>
      <th>Humidity9am</th>
      <th>Humidity3pm</th>
      <th>Pressure9am</th>
      <th>Pressure3pm</th>
      <th>Cloud9am</th>
      <th>Cloud3pm</th>
      <th>Temp9am</th>
      <th>Temp3pm</th>
      <th>RainToday</th>
      <th>RainTomorrow</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2008-12-01</td>
      <td>Albury</td>
      <td>13.4</td>
      <td>22.9</td>
      <td>0.6</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>W</td>
      <td>44.0</td>
      <td>W</td>
      <td>WNW</td>
      <td>20.0</td>
      <td>24.0</td>
      <td>71.0</td>
      <td>22.0</td>
      <td>1007.7</td>
      <td>1007.1</td>
      <td>8.0</td>
      <td>NaN</td>
      <td>16.9</td>
      <td>21.8</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2008-12-02</td>
      <td>Albury</td>
      <td>7.4</td>
      <td>25.1</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>WNW</td>
      <td>44.0</td>
      <td>NNW</td>
      <td>WSW</td>
      <td>4.0</td>
      <td>22.0</td>
      <td>44.0</td>
      <td>25.0</td>
      <td>1010.6</td>
      <td>1007.8</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>17.2</td>
      <td>24.3</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2008-12-03</td>
      <td>Albury</td>
      <td>12.9</td>
      <td>25.7</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>WSW</td>
      <td>46.0</td>
      <td>W</td>
      <td>WSW</td>
      <td>19.0</td>
      <td>26.0</td>
      <td>38.0</td>
      <td>30.0</td>
      <td>1007.6</td>
      <td>1008.7</td>
      <td>NaN</td>
      <td>2.0</td>
      <td>21.0</td>
      <td>23.2</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2008-12-04</td>
      <td>Albury</td>
      <td>9.2</td>
      <td>28.0</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NE</td>
      <td>24.0</td>
      <td>SE</td>
      <td>E</td>
      <td>11.0</td>
      <td>9.0</td>
      <td>45.0</td>
      <td>16.0</td>
      <td>1017.6</td>
      <td>1012.8</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>18.1</td>
      <td>26.5</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2008-12-05</td>
      <td>Albury</td>
      <td>17.5</td>
      <td>32.3</td>
      <td>1.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>W</td>
      <td>41.0</td>
      <td>ENE</td>
      <td>NW</td>
      <td>7.0</td>
      <td>20.0</td>
      <td>82.0</td>
      <td>33.0</td>
      <td>1010.8</td>
      <td>1006.0</td>
      <td>7.0</td>
      <td>8.0</td>
      <td>17.8</td>
      <td>29.7</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2008-12-06</td>
      <td>Albury</td>
      <td>14.6</td>
      <td>29.7</td>
      <td>0.2</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>WNW</td>
      <td>56.0</td>
      <td>W</td>
      <td>W</td>
      <td>19.0</td>
      <td>24.0</td>
      <td>55.0</td>
      <td>23.0</td>
      <td>1009.2</td>
      <td>1005.4</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>20.6</td>
      <td>28.9</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2008-12-07</td>
      <td>Albury</td>
      <td>14.3</td>
      <td>25.0</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>W</td>
      <td>50.0</td>
      <td>SW</td>
      <td>W</td>
      <td>20.0</td>
      <td>24.0</td>
      <td>49.0</td>
      <td>19.0</td>
      <td>1009.6</td>
      <td>1008.2</td>
      <td>1.0</td>
      <td>NaN</td>
      <td>18.1</td>
      <td>24.6</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2008-12-08</td>
      <td>Albury</td>
      <td>7.7</td>
      <td>26.7</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>W</td>
      <td>35.0</td>
      <td>SSE</td>
      <td>W</td>
      <td>6.0</td>
      <td>17.0</td>
      <td>48.0</td>
      <td>19.0</td>
      <td>1013.4</td>
      <td>1010.1</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>16.3</td>
      <td>25.5</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>8</th>
      <td>2008-12-09</td>
      <td>Albury</td>
      <td>9.7</td>
      <td>31.9</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NNW</td>
      <td>80.0</td>
      <td>SE</td>
      <td>NW</td>
      <td>7.0</td>
      <td>28.0</td>
      <td>42.0</td>
      <td>9.0</td>
      <td>1008.9</td>
      <td>1003.6</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>18.3</td>
      <td>30.2</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2008-12-10</td>
      <td>Albury</td>
      <td>13.1</td>
      <td>30.1</td>
      <td>1.4</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>W</td>
      <td>28.0</td>
      <td>S</td>
      <td>SSE</td>
      <td>15.0</td>
      <td>11.0</td>
      <td>58.0</td>
      <td>27.0</td>
      <td>1007.0</td>
      <td>1005.7</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>20.1</td>
      <td>28.2</td>
      <td>Yes</td>
      <td>No</td>
    </tr>
    <tr>
      <th>10</th>
      <td>2008-12-11</td>
      <td>Albury</td>
      <td>13.4</td>
      <td>30.4</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>N</td>
      <td>30.0</td>
      <td>SSE</td>
      <td>ESE</td>
      <td>17.0</td>
      <td>6.0</td>
      <td>48.0</td>
      <td>22.0</td>
      <td>1011.8</td>
      <td>1008.7</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>20.4</td>
      <td>28.8</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2008-12-12</td>
      <td>Albury</td>
      <td>15.9</td>
      <td>21.7</td>
      <td>2.2</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NNE</td>
      <td>31.0</td>
      <td>NE</td>
      <td>ENE</td>
      <td>15.0</td>
      <td>13.0</td>
      <td>89.0</td>
      <td>91.0</td>
      <td>1010.5</td>
      <td>1004.2</td>
      <td>8.0</td>
      <td>8.0</td>
      <td>15.9</td>
      <td>17.0</td>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>12</th>
      <td>2008-12-13</td>
      <td>Albury</td>
      <td>15.9</td>
      <td>18.6</td>
      <td>15.6</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>W</td>
      <td>61.0</td>
      <td>NNW</td>
      <td>NNW</td>
      <td>28.0</td>
      <td>28.0</td>
      <td>76.0</td>
      <td>93.0</td>
      <td>994.3</td>
      <td>993.0</td>
      <td>8.0</td>
      <td>8.0</td>
      <td>17.4</td>
      <td>15.8</td>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>13</th>
      <td>2008-12-14</td>
      <td>Albury</td>
      <td>12.6</td>
      <td>21.0</td>
      <td>3.6</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>SW</td>
      <td>44.0</td>
      <td>W</td>
      <td>SSW</td>
      <td>24.0</td>
      <td>20.0</td>
      <td>65.0</td>
      <td>43.0</td>
      <td>1001.2</td>
      <td>1001.8</td>
      <td>NaN</td>
      <td>7.0</td>
      <td>15.8</td>
      <td>19.8</td>
      <td>Yes</td>
      <td>No</td>
    </tr>
    <tr>
      <th>14</th>
      <td>2008-12-15</td>
      <td>Albury</td>
      <td>8.4</td>
      <td>24.6</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>S</td>
      <td>WNW</td>
      <td>4.0</td>
      <td>30.0</td>
      <td>57.0</td>
      <td>32.0</td>
      <td>1009.7</td>
      <td>1008.7</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>15.9</td>
      <td>23.5</td>
      <td>No</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>15</th>
      <td>2008-12-16</td>
      <td>Albury</td>
      <td>9.8</td>
      <td>27.7</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>WNW</td>
      <td>50.0</td>
      <td>NaN</td>
      <td>WNW</td>
      <td>NaN</td>
      <td>22.0</td>
      <td>50.0</td>
      <td>28.0</td>
      <td>1013.4</td>
      <td>1010.3</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>17.3</td>
      <td>26.2</td>
      <td>NaN</td>
      <td>No</td>
    </tr>
    <tr>
      <th>16</th>
      <td>2008-12-17</td>
      <td>Albury</td>
      <td>14.1</td>
      <td>20.9</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>ENE</td>
      <td>22.0</td>
      <td>SSW</td>
      <td>E</td>
      <td>11.0</td>
      <td>9.0</td>
      <td>69.0</td>
      <td>82.0</td>
      <td>1012.2</td>
      <td>1010.4</td>
      <td>8.0</td>
      <td>1.0</td>
      <td>17.2</td>
      <td>18.1</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>17</th>
      <td>2008-12-18</td>
      <td>Albury</td>
      <td>13.5</td>
      <td>22.9</td>
      <td>16.8</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>W</td>
      <td>63.0</td>
      <td>N</td>
      <td>WNW</td>
      <td>6.0</td>
      <td>20.0</td>
      <td>80.0</td>
      <td>65.0</td>
      <td>1005.8</td>
      <td>1002.2</td>
      <td>8.0</td>
      <td>1.0</td>
      <td>18.0</td>
      <td>21.5</td>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>18</th>
      <td>2008-12-19</td>
      <td>Albury</td>
      <td>11.2</td>
      <td>22.5</td>
      <td>10.6</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>SSE</td>
      <td>43.0</td>
      <td>WSW</td>
      <td>SW</td>
      <td>24.0</td>
      <td>17.0</td>
      <td>47.0</td>
      <td>32.0</td>
      <td>1009.4</td>
      <td>1009.7</td>
      <td>NaN</td>
      <td>2.0</td>
      <td>15.5</td>
      <td>21.0</td>
      <td>Yes</td>
      <td>No</td>
    </tr>
    <tr>
      <th>19</th>
      <td>2008-12-20</td>
      <td>Albury</td>
      <td>9.8</td>
      <td>25.6</td>
      <td>0.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>SSE</td>
      <td>26.0</td>
      <td>SE</td>
      <td>NNW</td>
      <td>17.0</td>
      <td>6.0</td>
      <td>45.0</td>
      <td>26.0</td>
      <td>1019.2</td>
      <td>1017.1</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>15.8</td>
      <td>23.2</td>
      <td>No</td>
      <td>No</td>
    </tr>
  </tbody>
</table>
</div>
</div>

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

```result
Numerical Features Count 16
Discrete feature Count 2
Continuous feature Count 14
Categorical feature Count 7
```

```python
# Handle Missing Values
df.isnull().sum()*100/len(df)
```

```result
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
WindDir3pm        2.906641
WindSpeed9am      1.214767
WindSpeed3pm      2.105046
Humidity9am       1.824557
Humidity3pm       3.098446
Pressure9am      10.356799
Pressure3pm      10.331363
Cloud9am         38.421559
Cloud3pm         40.807095
Temp9am           1.214767
Temp3pm           2.481094
RainToday         2.241853
RainTomorrow      2.245978
dtype: float64
```

```python
print(numerical_feature)
```

```result
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

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Date</th>
      <th>Location</th>
      <th>MinTemp</th>
      <th>MaxTemp</th>
      <th>Rainfall</th>
      <th>Evaporation</th>
      <th>Sunshine</th>
      <th>WindGustDir</th>
      <th>WindGustSpeed</th>
      <th>WindDir9am</th>
      <th>WindDir3pm</th>
      <th>WindSpeed9am</th>
      <th>WindSpeed3pm</th>
      <th>Humidity9am</th>
      <th>Humidity3pm</th>
      <th>Pressure9am</th>
      <th>Pressure3pm</th>
      <th>Cloud9am</th>
      <th>Cloud3pm</th>
      <th>Temp9am</th>
      <th>Temp3pm</th>
      <th>RainToday</th>
      <th>RainTomorrow</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2008-12-01</td>
      <td>Albury</td>
      <td>13.4</td>
      <td>22.9</td>
      <td>0.6</td>
      <td>2.4</td>
      <td>8.3</td>
      <td>W</td>
      <td>44.0</td>
      <td>W</td>
      <td>WNW</td>
      <td>20.0</td>
      <td>24.0</td>
      <td>71.0</td>
      <td>22.0</td>
      <td>1007.7</td>
      <td>1007.1</td>
      <td>8.0</td>
      <td>0.0</td>
      <td>16.9</td>
      <td>21.8</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2008-12-02</td>
      <td>Albury</td>
      <td>7.4</td>
      <td>25.1</td>
      <td>0.0</td>
      <td>3.6</td>
      <td>10.0</td>
      <td>WNW</td>
      <td>44.0</td>
      <td>NNW</td>
      <td>WSW</td>
      <td>4.0</td>
      <td>22.0</td>
      <td>44.0</td>
      <td>25.0</td>
      <td>1010.6</td>
      <td>1007.8</td>
      <td>7.0</td>
      <td>1.0</td>
      <td>17.2</td>
      <td>24.3</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2008-12-03</td>
      <td>Albury</td>
      <td>12.9</td>
      <td>25.7</td>
      <td>0.0</td>
      <td>2.6</td>
      <td>4.4</td>
      <td>WSW</td>
      <td>46.0</td>
      <td>W</td>
      <td>WSW</td>
      <td>19.0</td>
      <td>26.0</td>
      <td>38.0</td>
      <td>30.0</td>
      <td>1007.6</td>
      <td>1008.7</td>
      <td>8.0</td>
      <td>2.0</td>
      <td>21.0</td>
      <td>23.2</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2008-12-04</td>
      <td>Albury</td>
      <td>9.2</td>
      <td>28.0</td>
      <td>0.0</td>
      <td>18.4</td>
      <td>8.9</td>
      <td>NE</td>
      <td>24.0</td>
      <td>SE</td>
      <td>E</td>
      <td>11.0</td>
      <td>9.0</td>
      <td>45.0</td>
      <td>16.0</td>
      <td>1017.6</td>
      <td>1012.8</td>
      <td>0.0</td>
      <td>5.0</td>
      <td>18.1</td>
      <td>26.5</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2008-12-05</td>
      <td>Albury</td>
      <td>17.5</td>
      <td>32.3</td>
      <td>1.0</td>
      <td>5.4</td>
      <td>3.0</td>
      <td>W</td>
      <td>41.0</td>
      <td>ENE</td>
      <td>NW</td>
      <td>7.0</td>
      <td>20.0</td>
      <td>82.0</td>
      <td>33.0</td>
      <td>1010.8</td>
      <td>1006.0</td>
      <td>7.0</td>
      <td>8.0</td>
      <td>17.8</td>
      <td>29.7</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2008-12-06</td>
      <td>Albury</td>
      <td>14.6</td>
      <td>29.7</td>
      <td>0.2</td>
      <td>5.2</td>
      <td>11.6</td>
      <td>WNW</td>
      <td>56.0</td>
      <td>W</td>
      <td>W</td>
      <td>19.0</td>
      <td>24.0</td>
      <td>55.0</td>
      <td>23.0</td>
      <td>1009.2</td>
      <td>1005.4</td>
      <td>8.0</td>
      <td>5.0</td>
      <td>20.6</td>
      <td>28.9</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2008-12-07</td>
      <td>Albury</td>
      <td>14.3</td>
      <td>25.0</td>
      <td>0.0</td>
      <td>3.8</td>
      <td>8.5</td>
      <td>W</td>
      <td>50.0</td>
      <td>SW</td>
      <td>W</td>
      <td>20.0</td>
      <td>24.0</td>
      <td>49.0</td>
      <td>19.0</td>
      <td>1009.6</td>
      <td>1008.2</td>
      <td>1.0</td>
      <td>8.0</td>
      <td>18.1</td>
      <td>24.6</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2008-12-08</td>
      <td>Albury</td>
      <td>7.7</td>
      <td>26.7</td>
      <td>0.0</td>
      <td>6.4</td>
      <td>5.8</td>
      <td>W</td>
      <td>35.0</td>
      <td>SSE</td>
      <td>W</td>
      <td>6.0</td>
      <td>17.0</td>
      <td>48.0</td>
      <td>19.0</td>
      <td>1013.4</td>
      <td>1010.1</td>
      <td>8.0</td>
      <td>7.0</td>
      <td>16.3</td>
      <td>25.5</td>
      <td>No</td>
      <td>No</td>
    </tr>
    <tr>
      <th>8</th>
      <td>2008-12-09</td>
      <td>Albury</td>
      <td>9.7</td>
      <td>31.9</td>
      <td>0.0</td>
      <td>3.0</td>
      <td>6.1</td>
      <td>NNW</td>
      <td>80.0</td>
      <td>SE</td>
      <td>NW</td>
      <td>7.0</td>
      <td>28.0</td>
      <td>42.0</td>
      <td>9.0</td>
      <td>1008.9</td>
      <td>1003.6</td>
      <td>1.0</td>
      <td>8.0</td>
      <td>18.3</td>
      <td>30.2</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2008-12-10</td>
      <td>Albury</td>
      <td>13.1</td>
      <td>30.1</td>
      <td>1.4</td>
      <td>0.6</td>
      <td>9.7</td>
      <td>W</td>
      <td>28.0</td>
      <td>S</td>
      <td>SSE</td>
      <td>15.0</td>
      <td>11.0</td>
      <td>58.0</td>
      <td>27.0</td>
      <td>1007.0</td>
      <td>1005.7</td>
      <td>1.0</td>
      <td>3.0</td>
      <td>20.1</td>
      <td>28.2</td>
      <td>Yes</td>
      <td>No</td>
    </tr>
    <tr>
      <th>10</th>
      <td>2008-12-11</td>
      <td>Albury</td>
      <td>13.4</td>
      <td>30.4</td>
      <td>0.0</td>
      <td>9.6</td>
      <td>11.0</td>
      <td>N</td>
      <td>30.0</td>
      <td>SSE</td>
      <td>ESE</td>
      <td>17.0</td>
      <td>6.0</td>
      <td>48.0</td>
      <td>22.0</td>
      <td>1011.8</td>
      <td>1008.7</td>
      <td>1.0</td>
      <td>8.0</td>
      <td>20.4</td>
      <td>28.8</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2008-12-12</td>
      <td>Albury</td>
      <td>15.9</td>
      <td>21.7</td>
      <td>2.2</td>
      <td>5.6</td>
      <td>10.0</td>
      <td>NNE</td>
      <td>31.0</td>
      <td>NE</td>
      <td>ENE</td>
      <td>15.0</td>
      <td>13.0</td>
      <td>89.0</td>
      <td>91.0</td>
      <td>1010.5</td>
      <td>1004.2</td>
      <td>8.0</td>
      <td>8.0</td>
      <td>15.9</td>
      <td>17.0</td>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>
</div>
</div>

```python
corrmat = df.corr(method = "spearman")
plt.figure(figsize=(20,20))
#plot heat map
g=sns.heatmap(corrmat,annot=True)
```

![Output](kb-media:8a07b9e6358d1aa160ef.png)

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

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:7cd10671c7e80d5a919c.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:dcbfa39f6c02c188a24d.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:cf3009de266b84148df6.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:8ad4e8a7d026d9f48424.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:b5241cf83ab70f02c155.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:8c3ab58781b5477b9d4f.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:dd8d38172005fde131bc.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:b4520f0970c3ef0ae05a.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:308f494d11da5611ff1a.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:88ea18038acfb4fa9cb8.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:c66152e492dcfa6cedd5.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:f9cede75c6182bb72447.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:9eba82e1026709378546.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\distributions.py:2557: FutureWarning: `distplot` is a deprecated function and will be removed in a future version. Please adapt your code to use either `displot` (a figure-level function with similar flexibility) or `histplot` (an axes-level function for histograms).
  warnings.warn(msg, FutureWarning)
```

![Output](kb-media:6c7ed6b7d7f50cb8e20a.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```python
#A for loop is used to plot a boxplot for all the continuous features to see the outliers
for feature in continuous_feature:
    data=df.copy()
    sns.boxplot(data[feature])
    plt.title(feature)
    plt.figure(figsize=(15,15))
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
```

![Output](kb-media:59bddcd09c070ef6bc2e.png)

![Output](kb-media:53a7bf0dacc18c7c4344.png)

![Output](kb-media:895aa33da38efb436265.png)

![Output](kb-media:b607646c2ff02142d4de.png)

![Output](kb-media:f09a115299f0629909d0.png)

![Output](kb-media:2e65178f31290807bf5a.png)

![Output](kb-media:2e46719a10f666a3a707.png)

![Output](kb-media:88a21d9951e50cf67fea.png)

![Output](kb-media:18d0d09b1200d2340d36.png)

![Output](kb-media:be3897bf4e7e05832e30.png)

![Output](kb-media:621e88b09eb45cfc5b4c.png)

![Output](kb-media:beb60459f6f3c9ec8bce.png)

![Output](kb-media:4b8187f92de79b3c08d6.png)

![Output](kb-media:6265d80a8a2e767da179.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

```python
for feature in continuous_feature:
    if(df[feature].isnull().sum()*100/len(df))>0:
        df[feature] = df[feature].fillna(df[feature].median())
```

```python
df.isnull().sum()*100/len(df)
```

```result
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
WindDir3pm       2.906641
WindSpeed9am     0.000000
WindSpeed3pm     0.000000
Humidity9am      0.000000
Humidity3pm      0.000000
Pressure9am      0.000000
Pressure3pm      0.000000
Cloud9am         0.000000
Cloud3pm         0.000000
Temp9am          0.000000
Temp3pm          0.000000
RainToday        2.241853
RainTomorrow     2.245978
dtype: float64
```

```python
discrete_feature
```

```result
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

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Date</th>
      <th>Location</th>
      <th>MinTemp</th>
      <th>MaxTemp</th>
      <th>Rainfall</th>
      <th>Evaporation</th>
      <th>Sunshine</th>
      <th>WindGustDir</th>
      <th>WindGustSpeed</th>
      <th>WindDir9am</th>
      <th>WindDir3pm</th>
      <th>WindSpeed9am</th>
      <th>WindSpeed3pm</th>
      <th>Humidity9am</th>
      <th>Humidity3pm</th>
      <th>Pressure9am</th>
      <th>Pressure3pm</th>
      <th>Cloud9am</th>
      <th>Cloud3pm</th>
      <th>Temp9am</th>
      <th>Temp3pm</th>
      <th>RainToday</th>
      <th>RainTomorrow</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2008-12-01</td>
      <td>Albury</td>
      <td>13.4</td>
      <td>22.9</td>
      <td>0.6</td>
      <td>2.4</td>
      <td>8.3</td>
      <td>W</td>
      <td>44.0</td>
      <td>W</td>
      <td>WNW</td>
      <td>20.0</td>
      <td>24.0</td>
      <td>71.0</td>
      <td>22.0</td>
      <td>1007.7</td>
      <td>1007.1</td>
      <td>8.0</td>
      <td>0.0</td>
      <td>16.9</td>
      <td>21.8</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2008-12-02</td>
      <td>Albury</td>
      <td>7.4</td>
      <td>25.1</td>
      <td>0.0</td>
      <td>3.6</td>
      <td>10.0</td>
      <td>WNW</td>
      <td>44.0</td>
      <td>NNW</td>
      <td>WSW</td>
      <td>4.0</td>
      <td>22.0</td>
      <td>44.0</td>
      <td>25.0</td>
      <td>1010.6</td>
      <td>1007.8</td>
      <td>7.0</td>
      <td>1.0</td>
      <td>17.2</td>
      <td>24.3</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2008-12-03</td>
      <td>Albury</td>
      <td>12.9</td>
      <td>25.7</td>
      <td>0.0</td>
      <td>2.6</td>
      <td>4.4</td>
      <td>WSW</td>
      <td>46.0</td>
      <td>W</td>
      <td>WSW</td>
      <td>19.0</td>
      <td>26.0</td>
      <td>38.0</td>
      <td>30.0</td>
      <td>1007.6</td>
      <td>1008.7</td>
      <td>8.0</td>
      <td>2.0</td>
      <td>21.0</td>
      <td>23.2</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2008-12-04</td>
      <td>Albury</td>
      <td>9.2</td>
      <td>28.0</td>
      <td>0.0</td>
      <td>18.4</td>
      <td>8.9</td>
      <td>NE</td>
      <td>24.0</td>
      <td>SE</td>
      <td>E</td>
      <td>11.0</td>
      <td>9.0</td>
      <td>45.0</td>
      <td>16.0</td>
      <td>1017.6</td>
      <td>1012.8</td>
      <td>0.0</td>
      <td>5.0</td>
      <td>18.1</td>
      <td>26.5</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2008-12-05</td>
      <td>Albury</td>
      <td>17.5</td>
      <td>32.3</td>
      <td>1.0</td>
      <td>5.4</td>
      <td>3.0</td>
      <td>W</td>
      <td>41.0</td>
      <td>ENE</td>
      <td>NW</td>
      <td>7.0</td>
      <td>20.0</td>
      <td>82.0</td>
      <td>33.0</td>
      <td>1010.8</td>
      <td>1006.0</td>
      <td>7.0</td>
      <td>8.0</td>
      <td>17.8</td>
      <td>29.7</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>145455</th>
      <td>2017-06-21</td>
      <td>Uluru</td>
      <td>2.8</td>
      <td>23.4</td>
      <td>0.0</td>
      <td>1.4</td>
      <td>7.8</td>
      <td>E</td>
      <td>31.0</td>
      <td>SE</td>
      <td>ENE</td>
      <td>13.0</td>
      <td>11.0</td>
      <td>51.0</td>
      <td>24.0</td>
      <td>1024.6</td>
      <td>1020.3</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>10.1</td>
      <td>22.4</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>145456</th>
      <td>2017-06-22</td>
      <td>Uluru</td>
      <td>3.6</td>
      <td>25.3</td>
      <td>0.0</td>
      <td>7.6</td>
      <td>13.5</td>
      <td>NNW</td>
      <td>22.0</td>
      <td>SE</td>
      <td>N</td>
      <td>13.0</td>
      <td>9.0</td>
      <td>56.0</td>
      <td>21.0</td>
      <td>1023.5</td>
      <td>1019.1</td>
      <td>8.0</td>
      <td>5.0</td>
      <td>10.9</td>
      <td>24.5</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>145457</th>
      <td>2017-06-23</td>
      <td>Uluru</td>
      <td>5.4</td>
      <td>26.9</td>
      <td>0.0</td>
      <td>6.8</td>
      <td>11.0</td>
      <td>N</td>
      <td>37.0</td>
      <td>SE</td>
      <td>WNW</td>
      <td>9.0</td>
      <td>9.0</td>
      <td>53.0</td>
      <td>24.0</td>
      <td>1021.0</td>
      <td>1016.8</td>
      <td>8.0</td>
      <td>1.0</td>
      <td>12.5</td>
      <td>26.1</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>145458</th>
      <td>2017-06-24</td>
      <td>Uluru</td>
      <td>7.8</td>
      <td>27.0</td>
      <td>0.0</td>
      <td>2.6</td>
      <td>13.2</td>
      <td>SE</td>
      <td>28.0</td>
      <td>SSE</td>
      <td>N</td>
      <td>13.0</td>
      <td>7.0</td>
      <td>51.0</td>
      <td>24.0</td>
      <td>1019.4</td>
      <td>1016.5</td>
      <td>3.0</td>
      <td>2.0</td>
      <td>15.1</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>145459</th>
      <td>2017-06-25</td>
      <td>Uluru</td>
      <td>14.9</td>
      <td>22.6</td>
      <td>0.0</td>
      <td>1.4</td>
      <td>0.7</td>
      <td>NaN</td>
      <td>39.0</td>
      <td>ESE</td>
      <td>ESE</td>
      <td>17.0</td>
      <td>17.0</td>
      <td>62.0</td>
      <td>36.0</td>
      <td>1020.2</td>
      <td>1017.9</td>
      <td>8.0</td>
      <td>8.0</td>
      <td>15.0</td>
      <td>20.9</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>145460 rows × 23 columns</p>
</div>
</div>

```python
for feature in categorical_feature:
    print(feature, (df.groupby([feature])["RainTomorrow"].mean().sort_values(ascending = False)).index)
```

```result
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
       'Williamtown', 'Launceston', 'Brisbane', 'MelbourneAirport', 'Adelaide',
       'Sale', 'Albury', 'Perth', 'Melbourne', 'Nuriootpa', 'Penrith',
       'BadgerysCreek', 'PerthAirport', 'Tuggeranong', 'Richmond', 'Bendigo',
       'Canberra', 'WaggaWagga', 'Townsville', 'Katherine', 'PearceRAAF',
       'SalmonGums', 'Nhil', 'Moree', 'Cobar', 'Mildura', 'AliceSprings',
       'Uluru', 'Woomera'],
      dtype='object', name='Location')
WindGustDir Index(['NNW', 'NW', 'WNW', 'N', 'W', 'WSW', 'NNE', 'S', 'SSW', 'SW', 'SSE',
       'NE', 'SE', 'ESE', 'ENE', 'E'],
      dtype='object', name='WindGustDir')
WindDir9am Index(['NNW', 'N', 'NW', 'NNE', 'WNW', 'W', 'WSW', 'SW', 'SSW', 'NE', 'S',
       'SSE', 'ENE', 'SE', 'ESE', 'E'],
      dtype='object', name='WindDir9am')
WindDir3pm Index(['NW', 'NNW', 'N', 'WNW', 'W', 'NNE', 'WSW', 'SSW', 'S', 'SW', 'SE',
       'NE', 'SSE', 'ENE', 'E', 'ESE'],
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

```result
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
WindDir3pm       0.0
WindSpeed9am     0.0
WindSpeed3pm     0.0
Humidity9am      0.0
Humidity3pm      0.0
Pressure9am      0.0
Pressure3pm      0.0
Cloud9am         0.0
Cloud3pm         0.0
Temp9am          0.0
Temp3pm          0.0
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

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Date</th>
      <th>Location</th>
      <th>MinTemp</th>
      <th>MaxTemp</th>
      <th>Rainfall</th>
      <th>Evaporation</th>
      <th>Sunshine</th>
      <th>WindGustDir</th>
      <th>WindGustSpeed</th>
      <th>WindDir9am</th>
      <th>WindDir3pm</th>
      <th>WindSpeed9am</th>
      <th>WindSpeed3pm</th>
      <th>Humidity9am</th>
      <th>Humidity3pm</th>
      <th>Pressure9am</th>
      <th>Pressure3pm</th>
      <th>Cloud9am</th>
      <th>Cloud3pm</th>
      <th>Temp9am</th>
      <th>Temp3pm</th>
      <th>RainToday</th>
      <th>RainTomorrow</th>
      <th>Date_year</th>
      <th>Date_month</th>
      <th>Date_day</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2008-12-01</td>
      <td>2</td>
      <td>13.4</td>
      <td>22.9</td>
      <td>0.6</td>
      <td>2.4</td>
      <td>8.3</td>
      <td>4.0</td>
      <td>44.0</td>
      <td>5.0</td>
      <td>3.0</td>
      <td>20.0</td>
      <td>24.0</td>
      <td>71.0</td>
      <td>22.0</td>
      <td>1007.7</td>
      <td>1007.1</td>
      <td>8.0</td>
      <td>0.0</td>
      <td>16.9</td>
      <td>21.8</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2008-12-02</td>
      <td>2</td>
      <td>7.4</td>
      <td>25.1</td>
      <td>0.0</td>
      <td>3.6</td>
      <td>10.0</td>
      <td>2.0</td>
      <td>44.0</td>
      <td>0.0</td>
      <td>6.0</td>
      <td>4.0</td>
      <td>22.0</td>
      <td>44.0</td>
      <td>25.0</td>
      <td>1010.6</td>
      <td>1007.8</td>
      <td>7.0</td>
      <td>1.0</td>
      <td>17.2</td>
      <td>24.3</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2008-12-03</td>
      <td>2</td>
      <td>12.9</td>
      <td>25.7</td>
      <td>0.0</td>
      <td>2.6</td>
      <td>4.4</td>
      <td>5.0</td>
      <td>46.0</td>
      <td>5.0</td>
      <td>6.0</td>
      <td>19.0</td>
      <td>26.0</td>
      <td>38.0</td>
      <td>30.0</td>
      <td>1007.6</td>
      <td>1008.7</td>
      <td>8.0</td>
      <td>2.0</td>
      <td>21.0</td>
      <td>23.2</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2008-12-04</td>
      <td>2</td>
      <td>9.2</td>
      <td>28.0</td>
      <td>0.0</td>
      <td>18.4</td>
      <td>8.9</td>
      <td>11.0</td>
      <td>24.0</td>
      <td>13.0</td>
      <td>14.0</td>
      <td>11.0</td>
      <td>9.0</td>
      <td>45.0</td>
      <td>16.0</td>
      <td>1017.6</td>
      <td>1012.8</td>
      <td>0.0</td>
      <td>5.0</td>
      <td>18.1</td>
      <td>26.5</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>4</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2008-12-05</td>
      <td>2</td>
      <td>17.5</td>
      <td>32.3</td>
      <td>1.0</td>
      <td>5.4</td>
      <td>3.0</td>
      <td>4.0</td>
      <td>41.0</td>
      <td>12.0</td>
      <td>0.0</td>
      <td>7.0</td>
      <td>20.0</td>
      <td>82.0</td>
      <td>33.0</td>
      <td>1010.8</td>
      <td>1006.0</td>
      <td>7.0</td>
      <td>8.0</td>
      <td>17.8</td>
      <td>29.7</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>5</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>145455</th>
      <td>2017-06-21</td>
      <td>41</td>
      <td>2.8</td>
      <td>23.4</td>
      <td>0.0</td>
      <td>1.4</td>
      <td>7.8</td>
      <td>15.0</td>
      <td>31.0</td>
      <td>13.0</td>
      <td>13.0</td>
      <td>13.0</td>
      <td>11.0</td>
      <td>51.0</td>
      <td>24.0</td>
      <td>1024.6</td>
      <td>1020.3</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>10.1</td>
      <td>22.4</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>21</td>
    </tr>
    <tr>
      <th>145456</th>
      <td>2017-06-22</td>
      <td>41</td>
      <td>3.6</td>
      <td>25.3</td>
      <td>0.0</td>
      <td>7.6</td>
      <td>13.5</td>
      <td>0.0</td>
      <td>22.0</td>
      <td>13.0</td>
      <td>2.0</td>
      <td>13.0</td>
      <td>9.0</td>
      <td>56.0</td>
      <td>21.0</td>
      <td>1023.5</td>
      <td>1019.1</td>
      <td>8.0</td>
      <td>5.0</td>
      <td>10.9</td>
      <td>24.5</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>22</td>
    </tr>
    <tr>
      <th>145457</th>
      <td>2017-06-23</td>
      <td>41</td>
      <td>5.4</td>
      <td>26.9</td>
      <td>0.0</td>
      <td>6.8</td>
      <td>11.0</td>
      <td>3.0</td>
      <td>37.0</td>
      <td>13.0</td>
      <td>3.0</td>
      <td>9.0</td>
      <td>9.0</td>
      <td>53.0</td>
      <td>24.0</td>
      <td>1021.0</td>
      <td>1016.8</td>
      <td>8.0</td>
      <td>1.0</td>
      <td>12.5</td>
      <td>26.1</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>23</td>
    </tr>
    <tr>
      <th>145458</th>
      <td>2017-06-24</td>
      <td>41</td>
      <td>7.8</td>
      <td>27.0</td>
      <td>0.0</td>
      <td>2.6</td>
      <td>13.2</td>
      <td>12.0</td>
      <td>28.0</td>
      <td>11.0</td>
      <td>2.0</td>
      <td>13.0</td>
      <td>7.0</td>
      <td>51.0</td>
      <td>24.0</td>
      <td>1019.4</td>
      <td>1016.5</td>
      <td>3.0</td>
      <td>2.0</td>
      <td>15.1</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>24</td>
    </tr>
    <tr>
      <th>145459</th>
      <td>2017-06-25</td>
      <td>41</td>
      <td>14.9</td>
      <td>22.6</td>
      <td>0.0</td>
      <td>1.4</td>
      <td>0.7</td>
      <td>4.0</td>
      <td>39.0</td>
      <td>14.0</td>
      <td>15.0</td>
      <td>17.0</td>
      <td>17.0</td>
      <td>62.0</td>
      <td>36.0</td>
      <td>1020.2</td>
      <td>1017.9</td>
      <td>8.0</td>
      <td>8.0</td>
      <td>15.0</td>
      <td>20.9</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>25</td>
    </tr>
  </tbody>
</table>
<p>145460 rows × 26 columns</p>
</div>
</div>

```python
corrmat = df.corr()
plt.figure(figsize=(20,20))
#plot heat map
g=sns.heatmap(corrmat,annot=True)
```

![Output](kb-media:b6695bd061171f4e520a.png)

```python
sns.countplot(df["RainTomorrow"])
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
```

```result
<AxesSubplot:xlabel='RainTomorrow', ylabel='count'>
```

![Output](kb-media:c1ccab2fa63b2bc46265.png)

```python
df
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Date</th>
      <th>Location</th>
      <th>MinTemp</th>
      <th>MaxTemp</th>
      <th>Rainfall</th>
      <th>Evaporation</th>
      <th>Sunshine</th>
      <th>WindGustDir</th>
      <th>WindGustSpeed</th>
      <th>WindDir9am</th>
      <th>WindDir3pm</th>
      <th>WindSpeed9am</th>
      <th>WindSpeed3pm</th>
      <th>Humidity9am</th>
      <th>Humidity3pm</th>
      <th>Pressure9am</th>
      <th>Pressure3pm</th>
      <th>Cloud9am</th>
      <th>Cloud3pm</th>
      <th>Temp9am</th>
      <th>Temp3pm</th>
      <th>RainToday</th>
      <th>RainTomorrow</th>
      <th>Date_year</th>
      <th>Date_month</th>
      <th>Date_day</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2008-12-01</td>
      <td>2</td>
      <td>13.4</td>
      <td>22.9</td>
      <td>0.6</td>
      <td>2.4</td>
      <td>8.3</td>
      <td>4.0</td>
      <td>44.0</td>
      <td>5.0</td>
      <td>3.0</td>
      <td>20.0</td>
      <td>24.0</td>
      <td>71.0</td>
      <td>22.0</td>
      <td>1007.7</td>
      <td>1007.1</td>
      <td>8.0</td>
      <td>0.0</td>
      <td>16.9</td>
      <td>21.8</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2008-12-02</td>
      <td>2</td>
      <td>7.4</td>
      <td>25.1</td>
      <td>0.0</td>
      <td>3.6</td>
      <td>10.0</td>
      <td>2.0</td>
      <td>44.0</td>
      <td>0.0</td>
      <td>6.0</td>
      <td>4.0</td>
      <td>22.0</td>
      <td>44.0</td>
      <td>25.0</td>
      <td>1010.6</td>
      <td>1007.8</td>
      <td>7.0</td>
      <td>1.0</td>
      <td>17.2</td>
      <td>24.3</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2008-12-03</td>
      <td>2</td>
      <td>12.9</td>
      <td>25.7</td>
      <td>0.0</td>
      <td>2.6</td>
      <td>4.4</td>
      <td>5.0</td>
      <td>46.0</td>
      <td>5.0</td>
      <td>6.0</td>
      <td>19.0</td>
      <td>26.0</td>
      <td>38.0</td>
      <td>30.0</td>
      <td>1007.6</td>
      <td>1008.7</td>
      <td>8.0</td>
      <td>2.0</td>
      <td>21.0</td>
      <td>23.2</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2008-12-04</td>
      <td>2</td>
      <td>9.2</td>
      <td>28.0</td>
      <td>0.0</td>
      <td>18.4</td>
      <td>8.9</td>
      <td>11.0</td>
      <td>24.0</td>
      <td>13.0</td>
      <td>14.0</td>
      <td>11.0</td>
      <td>9.0</td>
      <td>45.0</td>
      <td>16.0</td>
      <td>1017.6</td>
      <td>1012.8</td>
      <td>0.0</td>
      <td>5.0</td>
      <td>18.1</td>
      <td>26.5</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>4</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2008-12-05</td>
      <td>2</td>
      <td>17.5</td>
      <td>32.3</td>
      <td>1.0</td>
      <td>5.4</td>
      <td>3.0</td>
      <td>4.0</td>
      <td>41.0</td>
      <td>12.0</td>
      <td>0.0</td>
      <td>7.0</td>
      <td>20.0</td>
      <td>82.0</td>
      <td>33.0</td>
      <td>1010.8</td>
      <td>1006.0</td>
      <td>7.0</td>
      <td>8.0</td>
      <td>17.8</td>
      <td>29.7</td>
      <td>0</td>
      <td>0</td>
      <td>2008</td>
      <td>12</td>
      <td>5</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>145455</th>
      <td>2017-06-21</td>
      <td>41</td>
      <td>2.8</td>
      <td>23.4</td>
      <td>0.0</td>
      <td>1.4</td>
      <td>7.8</td>
      <td>15.0</td>
      <td>31.0</td>
      <td>13.0</td>
      <td>13.0</td>
      <td>13.0</td>
      <td>11.0</td>
      <td>51.0</td>
      <td>24.0</td>
      <td>1024.6</td>
      <td>1020.3</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>10.1</td>
      <td>22.4</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>21</td>
    </tr>
    <tr>
      <th>145456</th>
      <td>2017-06-22</td>
      <td>41</td>
      <td>3.6</td>
      <td>25.3</td>
      <td>0.0</td>
      <td>7.6</td>
      <td>13.5</td>
      <td>0.0</td>
      <td>22.0</td>
      <td>13.0</td>
      <td>2.0</td>
      <td>13.0</td>
      <td>9.0</td>
      <td>56.0</td>
      <td>21.0</td>
      <td>1023.5</td>
      <td>1019.1</td>
      <td>8.0</td>
      <td>5.0</td>
      <td>10.9</td>
      <td>24.5</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>22</td>
    </tr>
    <tr>
      <th>145457</th>
      <td>2017-06-23</td>
      <td>41</td>
      <td>5.4</td>
      <td>26.9</td>
      <td>0.0</td>
      <td>6.8</td>
      <td>11.0</td>
      <td>3.0</td>
      <td>37.0</td>
      <td>13.0</td>
      <td>3.0</td>
      <td>9.0</td>
      <td>9.0</td>
      <td>53.0</td>
      <td>24.0</td>
      <td>1021.0</td>
      <td>1016.8</td>
      <td>8.0</td>
      <td>1.0</td>
      <td>12.5</td>
      <td>26.1</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>23</td>
    </tr>
    <tr>
      <th>145458</th>
      <td>2017-06-24</td>
      <td>41</td>
      <td>7.8</td>
      <td>27.0</td>
      <td>0.0</td>
      <td>2.6</td>
      <td>13.2</td>
      <td>12.0</td>
      <td>28.0</td>
      <td>11.0</td>
      <td>2.0</td>
      <td>13.0</td>
      <td>7.0</td>
      <td>51.0</td>
      <td>24.0</td>
      <td>1019.4</td>
      <td>1016.5</td>
      <td>3.0</td>
      <td>2.0</td>
      <td>15.1</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>24</td>
    </tr>
    <tr>
      <th>145459</th>
      <td>2017-06-25</td>
      <td>41</td>
      <td>14.9</td>
      <td>22.6</td>
      <td>0.0</td>
      <td>1.4</td>
      <td>0.7</td>
      <td>4.0</td>
      <td>39.0</td>
      <td>14.0</td>
      <td>15.0</td>
      <td>17.0</td>
      <td>17.0</td>
      <td>62.0</td>
      <td>36.0</td>
      <td>1020.2</td>
      <td>1017.9</td>
      <td>8.0</td>
      <td>8.0</td>
      <td>15.0</td>
      <td>20.9</td>
      <td>0</td>
      <td>0</td>
      <td>2017</td>
      <td>6</td>
      <td>25</td>
    </tr>
  </tbody>
</table>
<p>145460 rows × 26 columns</p>
</div>
</div>

```python
for feature in continuous_feature:
    data=df.copy()
    sns.boxplot(data[feature])
    plt.title(feature)
    plt.figure(figsize=(15,15))
```

```result
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
c:\users\admin\anaconda3\envs\rainprediction\lib\site-packages\seaborn\_decorators.py:43: FutureWarning: Pass the following variable as a keyword arg: x. From version 0.12, the only valid positional argument will be `data`, and passing other arguments without an explicit keyword will result in an error or misinterpretation.
  FutureWarning
```

![Output](kb-media:6bb9cde23e3a72cc444e.png)

![Output](kb-media:13ded07de48c218876d0.png)

![Output](kb-media:5ea1c697e6e13012ba5b.png)

![Output](kb-media:b607646c2ff02142d4de.png)

![Output](kb-media:f09a115299f0629909d0.png)

![Output](kb-media:3cd978bf1726f3355158.png)

![Output](kb-media:2e46719a10f666a3a707.png)

![Output](kb-media:88a21d9951e50cf67fea.png)

![Output](kb-media:18d0d09b1200d2340d36.png)

![Output](kb-media:5a05178c3f8784285822.png)

![Output](kb-media:f5f50719111ef3648cc9.png)

![Output](kb-media:5cc058d6ac7c2995f401.png)

![Output](kb-media:1507054291e600f141ed.png)

![Output](kb-media:1ca4f357171951c8b0d8.png)

```result
<Figure size 1080x1080 with 0 Axes>
```

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

```result
MinTemp
```

![Output](kb-media:a0863f8a1ecffa142e3f.png)

```result
MaxTemp
```

![Output](kb-media:f57168a995fa6128494f.png)

```result
Rainfall
```

![Output](kb-media:8273a5d6c805ed03a04f.png)

```result
Evaporation
```

![Output](kb-media:7f04c3b8efafc1dbae05.png)

```result
Sunshine
```

![Output](kb-media:cf80c9bfdbabdec29bfd.png)

```result
WindGustSpeed
```

![Output](kb-media:9fc764ee69a8e846b776.png)

```result
WindSpeed9am
```

![Output](kb-media:6ccfcbab1032d1a35872.png)

```result
WindSpeed3pm
```

![Output](kb-media:ce856fa8f92d096755bd.png)

```result
Humidity9am
```

![Output](kb-media:6c0d3ea0e2c411e5fb4d.png)

```result
Humidity3pm
```

![Output](kb-media:e6d6b0679297be5e8c33.png)

```result
Pressure9am
```

![Output](kb-media:2833f8498adb8d430593.png)

```result
Pressure3pm
```

![Output](kb-media:685d545e86cd2621ac08.png)

```result
Temp9am
```

![Output](kb-media:764cdc14a4d0a0ca04df.png)

```result
Temp3pm
```

![Output](kb-media:6c1c01e2b0925ae2dae1.png)

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

```result
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

```result
The number of classes before fit Counter({0: 90866, 1: 25502})
The number of classes after fit Counter({0: 90866, 1: 90866})
```

```python
cat = CatBoostClassifier(iterations=2000, eval_metric = "AUC")
cat.fit(X_train_res, y_train_res)
```

```result
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
9:	total: 702ms	remaining: 2m 19s
10:	total: 749ms	remaining: 2m 15s
11:	total: 802ms	remaining: 2m 12s
12:	total: 857ms	remaining: 2m 10s
13:	total: 902ms	remaining: 2m 7s
14:	total: 954ms	remaining: 2m 6s
15:	total: 1.01s	remaining: 2m 4s
16:	total: 1.06s	remaining: 2m 3s
17:	total: 1.11s	remaining: 2m 2s
18:	total: 1.16s	remaining: 2m 1s
19:	total: 1.21s	remaining: 1m 59s
20:	total: 1.27s	remaining: 1m 59s
21:	total: 1.32s	remaining: 1m 58s
22:	total: 1.37s	remaining: 1m 57s
23:	total: 1.42s	remaining: 1m 56s
24:	total: 1.47s	remaining: 1m 55s
25:	total: 1.52s	remaining: 1m 55s
26:	total: 1.57s	remaining: 1m 54s
27:	total: 1.62s	remaining: 1m 54s
28:	total: 1.67s	remaining: 1m 53s
29:	total: 1.72s	remaining: 1m 53s
30:	total: 1.77s	remaining: 1m 52s
31:	total: 1.83s	remaining: 1m 52s
32:	total: 1.88s	remaining: 1m 51s
33:	total: 1.93s	remaining: 1m 51s
34:	total: 1.98s	remaining: 1m 51s
35:	total: 2.04s	remaining: 1m 51s
36:	total: 2.09s	remaining: 1m 51s
37:	total: 2.14s	remaining: 1m 50s
38:	total: 2.2s	remaining: 1m 50s
39:	total: 2.25s	remaining: 1m 50s
40:	total: 2.29s	remaining: 1m 49s
41:	total: 2.34s	remaining: 1m 49s
42:	total: 2.39s	remaining: 1m 48s
43:	total: 2.44s	remaining: 1m 48s
44:	total: 2.49s	remaining: 1m 48s
45:	total: 2.54s	remaining: 1m 47s
46:	total: 2.59s	remaining: 1m 47s
47:	total: 2.64s	remaining: 1m 47s
48:	total: 2.69s	remaining: 1m 47s
49:	total: 2.74s	remaining: 1m 46s
50:	total: 2.79s	remaining: 1m 46s
51:	total: 2.84s	remaining: 1m 46s
52:	total: 2.89s	remaining: 1m 46s
53:	total: 2.94s	remaining: 1m 45s
54:	total: 2.98s	remaining: 1m 45s
55:	total: 3.04s	remaining: 1m 45s
56:	total: 3.1s	remaining: 1m 45s
57:	total: 3.15s	remaining: 1m 45s
58:	total: 3.19s	remaining: 1m 45s
59:	total: 3.25s	remaining: 1m 45s
60:	total: 3.3s	remaining: 1m 44s
61:	total: 3.35s	remaining: 1m 44s
62:	total: 3.4s	remaining: 1m 44s
63:	total: 3.45s	remaining: 1m 44s
64:	total: 3.5s	remaining: 1m 44s
65:	total: 3.56s	remaining: 1m 44s
66:	total: 3.6s	remaining: 1m 43s
67:	total: 3.67s	remaining: 1m 44s
68:	total: 3.72s	remaining: 1m 44s
69:	total: 3.77s	remaining: 1m 43s
70:	total: 3.83s	remaining: 1m 44s
71:	total: 3.88s	remaining: 1m 43s
72:	total: 3.93s	remaining: 1m 43s
73:	total: 3.98s	remaining: 1m 43s
74:	total: 4.03s	remaining: 1m 43s
75:	total: 4.08s	remaining: 1m 43s
76:	total: 4.15s	remaining: 1m 43s
77:	total: 4.2s	remaining: 1m 43s
78:	total: 4.25s	remaining: 1m 43s
79:	total: 4.3s	remaining: 1m 43s
80:	total: 4.35s	remaining: 1m 43s
81:	total: 4.4s	remaining: 1m 42s
82:	total: 4.45s	remaining: 1m 42s
83:	total: 4.49s	remaining: 1m 42s
84:	total: 4.54s	remaining: 1m 42s
85:	total: 4.59s	remaining: 1m 42s
86:	total: 4.64s	remaining: 1m 41s
87:	total: 4.69s	remaining: 1m 41s
88:	total: 4.73s	remaining: 1m 41s
89:	total: 4.78s	remaining: 1m 41s
90:	total: 4.83s	remaining: 1m 41s
91:	total: 4.88s	remaining: 1m 41s
92:	total: 4.93s	remaining: 1m 41s
93:	total: 4.98s	remaining: 1m 41s
94:	total: 5.03s	remaining: 1m 40s
95:	total: 5.08s	remaining: 1m 40s
96:	total: 5.14s	remaining: 1m 40s
97:	total: 5.19s	remaining: 1m 40s
98:	total: 5.24s	remaining: 1m 40s
99:	total: 5.29s	remaining: 1m 40s
100:	total: 5.34s	remaining: 1m 40s
101:	total: 5.39s	remaining: 1m 40s
102:	total: 5.44s	remaining: 1m 40s
103:	total: 5.49s	remaining: 1m 40s
104:	total: 5.54s	remaining: 1m 39s
105:	total: 5.59s	remaining: 1m 39s
106:	total: 5.63s	remaining: 1m 39s
107:	total: 5.68s	remaining: 1m 39s
108:	total: 5.73s	remaining: 1m 39s
109:	total: 5.79s	remaining: 1m 39s
110:	total: 5.84s	remaining: 1m 39s
111:	total: 5.89s	remaining: 1m 39s
112:	total: 5.94s	remaining: 1m 39s
113:	total: 6s	remaining: 1m 39s
114:	total: 6.05s	remaining: 1m 39s
115:	total: 6.1s	remaining: 1m 39s
116:	total: 6.15s	remaining: 1m 38s
117:	total: 6.2s	remaining: 1m 38s
118:	total: 6.25s	remaining: 1m 38s
119:	total: 6.3s	remaining: 1m 38s
120:	total: 6.35s	remaining: 1m 38s
121:	total: 6.4s	remaining: 1m 38s
122:	total: 6.45s	remaining: 1m 38s
123:	total: 6.49s	remaining: 1m 38s
124:	total: 6.54s	remaining: 1m 38s
125:	total: 6.59s	remaining: 1m 38s
126:	total: 6.65s	remaining: 1m 38s
127:	total: 6.7s	remaining: 1m 37s
128:	total: 6.76s	remaining: 1m 38s
129:	total: 6.81s	remaining: 1m 37s
130:	total: 6.86s	remaining: 1m 37s
131:	total: 6.91s	remaining: 1m 37s
132:	total: 6.96s	remaining: 1m 37s
133:	total: 7.01s	remaining: 1m 37s
134:	total: 7.05s	remaining: 1m 37s
135:	total: 7.1s	remaining: 1m 37s
136:	total: 7.15s	remaining: 1m 37s
137:	total: 7.2s	remaining: 1m 37s
138:	total: 7.25s	remaining: 1m 37s
139:	total: 7.3s	remaining: 1m 37s
140:	total: 7.35s	remaining: 1m 36s
141:	total: 7.4s	remaining: 1m 36s
142:	total: 7.46s	remaining: 1m 36s
143:	total: 7.51s	remaining: 1m 36s
144:	total: 7.57s	remaining: 1m 36s
145:	total: 7.61s	remaining: 1m 36s
146:	total: 7.66s	remaining: 1m 36s
147:	total: 7.71s	remaining: 1m 36s
148:	total: 7.76s	remaining: 1m 36s
149:	total: 7.81s	remaining: 1m 36s
150:	total: 7.85s	remaining: 1m 36s
151:	total: 7.9s	remaining: 1m 36s
152:	total: 7.96s	remaining: 1m 36s
153:	total: 8.01s	remaining: 1m 35s
154:	total: 8.06s	remaining: 1m 35s
155:	total: 8.11s	remaining: 1m 35s
156:	total: 8.16s	remaining: 1m 35s
157:	total: 8.2s	remaining: 1m 35s
158:	total: 8.26s	remaining: 1m 35s
159:	total: 8.3s	remaining: 1m 35s
160:	total: 8.35s	remaining: 1m 35s
161:	total: 8.4s	remaining: 1m 35s
162:	total: 8.45s	remaining: 1m 35s
163:	total: 8.5s	remaining: 1m 35s
164:	total: 8.54s	remaining: 1m 35s
165:	total: 8.59s	remaining: 1m 34s
166:	total: 8.64s	remaining: 1m 34s
167:	total: 8.7s	remaining: 1m 34s
168:	total: 8.75s	remaining: 1m 34s
169:	total: 8.81s	remaining: 1m 34s
170:	total: 8.86s	remaining: 1m 34s
171:	total: 8.91s	remaining: 1m 34s
172:	total: 8.96s	remaining: 1m 34s
173:	total: 9.01s	remaining: 1m 34s
174:	total: 9.05s	remaining: 1m 34s
175:	total: 9.1s	remaining: 1m 34s
176:	total: 9.15s	remaining: 1m 34s
177:	total: 9.21s	remaining: 1m 34s
178:	total: 9.25s	remaining: 1m 34s
179:	total: 9.31s	remaining: 1m 34s
180:	total: 9.36s	remaining: 1m 34s
181:	total: 9.4s	remaining: 1m 33s
182:	total: 9.45s	remaining: 1m 33s
183:	total: 9.5s	remaining: 1m 33s
184:	total: 9.55s	remaining: 1m 33s
185:	total: 9.59s	remaining: 1m 33s
186:	total: 9.64s	remaining: 1m 33s
187:	total: 9.69s	remaining: 1m 33s
188:	total: 9.75s	remaining: 1m 33s
189:	total: 9.8s	remaining: 1m 33s
190:	total: 9.85s	remaining: 1m 33s
191:	total: 9.9s	remaining: 1m 33s
192:	total: 9.95s	remaining: 1m 33s
193:	total: 10s	remaining: 1m 33s
194:	total: 10s	remaining: 1m 32s
195:	total: 10.1s	remaining: 1m 32s
196:	total: 10.1s	remaining: 1m 32s
197:	total: 10.2s	remaining: 1m 32s
198:	total: 10.3s	remaining: 1m 32s
199:	total: 10.3s	remaining: 1m 32s
200:	total: 10.4s	remaining: 1m 32s
201:	total: 10.4s	remaining: 1m 32s
202:	total: 10.5s	remaining: 1m 32s
203:	total: 10.5s	remaining: 1m 32s
204:	total: 10.6s	remaining: 1m 32s
205:	total: 10.6s	remaining: 1m 32s
206:	total: 10.7s	remaining: 1m 32s
207:	total: 10.8s	remaining: 1m 32s
208:	total: 10.8s	remaining: 1m 32s
209:	total: 10.9s	remaining: 1m 32s
210:	total: 10.9s	remaining: 1m 32s
211:	total: 11s	remaining: 1m 32s
212:	total: 11s	remaining: 1m 32s
213:	total: 11.1s	remaining: 1m 32s
214:	total: 11.1s	remaining: 1m 32s
215:	total: 11.2s	remaining: 1m 32s
216:	total: 11.2s	remaining: 1m 32s
217:	total: 11.3s	remaining: 1m 32s
218:	total: 11.3s	remaining: 1m 32s
219:	total: 11.4s	remaining: 1m 32s
220:	total: 11.4s	remaining: 1m 31s
221:	total: 11.5s	remaining: 1m 31s
222:	total: 11.5s	remaining: 1m 31s
223:	total: 11.6s	remaining: 1m 31s
224:	total: 11.6s	remaining: 1m 31s
225:	total: 11.7s	remaining: 1m 31s
226:	total: 11.7s	remaining: 1m 31s
227:	total: 11.8s	remaining: 1m 31s
228:	total: 11.8s	remaining: 1m 31s
229:	total: 11.9s	remaining: 1m 31s
230:	total: 11.9s	remaining: 1m 31s
231:	total: 12s	remaining: 1m 31s
232:	total: 12s	remaining: 1m 31s
233:	total: 12.1s	remaining: 1m 31s
234:	total: 12.1s	remaining: 1m 31s
```

```result
235:	total: 12.2s	remaining: 1m 31s
236:	total: 12.2s	remaining: 1m 31s
237:	total: 12.3s	remaining: 1m 31s
238:	total: 12.3s	remaining: 1m 30s
239:	total: 12.4s	remaining: 1m 30s
240:	total: 12.4s	remaining: 1m 30s
241:	total: 12.5s	remaining: 1m 30s
242:	total: 12.6s	remaining: 1m 30s
243:	total: 12.6s	remaining: 1m 30s
244:	total: 12.7s	remaining: 1m 30s
245:	total: 12.7s	remaining: 1m 30s
246:	total: 12.8s	remaining: 1m 30s
247:	total: 12.8s	remaining: 1m 30s
248:	total: 12.9s	remaining: 1m 30s
249:	total: 12.9s	remaining: 1m 30s
250:	total: 13s	remaining: 1m 30s
251:	total: 13s	remaining: 1m 30s
252:	total: 13.1s	remaining: 1m 30s
253:	total: 13.1s	remaining: 1m 30s
254:	total: 13.2s	remaining: 1m 29s
255:	total: 13.2s	remaining: 1m 29s
256:	total: 13.3s	remaining: 1m 29s
257:	total: 13.3s	remaining: 1m 29s
258:	total: 13.4s	remaining: 1m 29s
259:	total: 13.4s	remaining: 1m 29s
260:	total: 13.4s	remaining: 1m 29s
261:	total: 13.5s	remaining: 1m 29s
262:	total: 13.5s	remaining: 1m 29s
263:	total: 13.6s	remaining: 1m 29s
264:	total: 13.6s	remaining: 1m 29s
265:	total: 13.7s	remaining: 1m 29s
266:	total: 13.7s	remaining: 1m 29s
267:	total: 13.8s	remaining: 1m 29s
268:	total: 13.8s	remaining: 1m 29s
269:	total: 13.9s	remaining: 1m 29s
270:	total: 13.9s	remaining: 1m 28s
271:	total: 14s	remaining: 1m 28s
272:	total: 14s	remaining: 1m 28s
273:	total: 14.1s	remaining: 1m 28s
274:	total: 14.1s	remaining: 1m 28s
275:	total: 14.2s	remaining: 1m 28s
276:	total: 14.2s	remaining: 1m 28s
277:	total: 14.3s	remaining: 1m 28s
278:	total: 14.4s	remaining: 1m 28s
279:	total: 14.4s	remaining: 1m 28s
280:	total: 14.5s	remaining: 1m 28s
281:	total: 14.5s	remaining: 1m 28s
282:	total: 14.6s	remaining: 1m 28s
283:	total: 14.6s	remaining: 1m 28s
284:	total: 14.7s	remaining: 1m 28s
285:	total: 14.7s	remaining: 1m 28s
286:	total: 14.8s	remaining: 1m 28s
287:	total: 14.8s	remaining: 1m 28s
288:	total: 14.9s	remaining: 1m 28s
289:	total: 14.9s	remaining: 1m 28s
290:	total: 15s	remaining: 1m 28s
291:	total: 15.1s	remaining: 1m 28s
292:	total: 15.1s	remaining: 1m 27s
293:	total: 15.2s	remaining: 1m 27s
294:	total: 15.2s	remaining: 1m 27s
295:	total: 15.3s	remaining: 1m 27s
296:	total: 15.3s	remaining: 1m 27s
297:	total: 15.4s	remaining: 1m 27s
298:	total: 15.4s	remaining: 1m 27s
299:	total: 15.4s	remaining: 1m 27s
300:	total: 15.5s	remaining: 1m 27s
301:	total: 15.6s	remaining: 1m 27s
302:	total: 15.6s	remaining: 1m 27s
303:	total: 15.7s	remaining: 1m 27s
304:	total: 15.7s	remaining: 1m 27s
305:	total: 15.7s	remaining: 1m 27s
306:	total: 15.8s	remaining: 1m 27s
307:	total: 15.8s	remaining: 1m 27s
308:	total: 15.9s	remaining: 1m 26s
309:	total: 15.9s	remaining: 1m 26s
310:	total: 16s	remaining: 1m 26s
311:	total: 16s	remaining: 1m 26s
312:	total: 16.1s	remaining: 1m 26s
313:	total: 16.1s	remaining: 1m 26s
314:	total: 16.2s	remaining: 1m 26s
315:	total: 16.2s	remaining: 1m 26s
316:	total: 16.3s	remaining: 1m 26s
317:	total: 16.3s	remaining: 1m 26s
318:	total: 16.4s	remaining: 1m 26s
319:	total: 16.4s	remaining: 1m 26s
320:	total: 16.5s	remaining: 1m 26s
321:	total: 16.5s	remaining: 1m 26s
322:	total: 16.6s	remaining: 1m 26s
323:	total: 16.6s	remaining: 1m 26s
324:	total: 16.7s	remaining: 1m 25s
325:	total: 16.7s	remaining: 1m 25s
326:	total: 16.8s	remaining: 1m 25s
327:	total: 16.8s	remaining: 1m 25s
328:	total: 16.9s	remaining: 1m 25s
329:	total: 16.9s	remaining: 1m 25s
330:	total: 17s	remaining: 1m 25s
331:	total: 17s	remaining: 1m 25s
332:	total: 17.1s	remaining: 1m 25s
333:	total: 17.1s	remaining: 1m 25s
334:	total: 17.2s	remaining: 1m 25s
335:	total: 17.2s	remaining: 1m 25s
336:	total: 17.3s	remaining: 1m 25s
337:	total: 17.3s	remaining: 1m 25s
338:	total: 17.4s	remaining: 1m 25s
339:	total: 17.4s	remaining: 1m 25s
340:	total: 17.5s	remaining: 1m 25s
341:	total: 17.5s	remaining: 1m 25s
342:	total: 17.6s	remaining: 1m 24s
343:	total: 17.6s	remaining: 1m 24s
344:	total: 17.7s	remaining: 1m 24s
345:	total: 17.7s	remaining: 1m 24s
346:	total: 17.8s	remaining: 1m 24s
347:	total: 17.8s	remaining: 1m 24s
348:	total: 17.9s	remaining: 1m 24s
349:	total: 17.9s	remaining: 1m 24s
350:	total: 18s	remaining: 1m 24s
351:	total: 18s	remaining: 1m 24s
352:	total: 18.1s	remaining: 1m 24s
353:	total: 18.1s	remaining: 1m 24s
354:	total: 18.2s	remaining: 1m 24s
355:	total: 18.2s	remaining: 1m 24s
356:	total: 18.3s	remaining: 1m 24s
357:	total: 18.3s	remaining: 1m 24s
358:	total: 18.4s	remaining: 1m 24s
359:	total: 18.4s	remaining: 1m 23s
360:	total: 18.5s	remaining: 1m 23s
361:	total: 18.5s	remaining: 1m 23s
362:	total: 18.6s	remaining: 1m 23s
363:	total: 18.6s	remaining: 1m 23s
364:	total: 18.7s	remaining: 1m 23s
365:	total: 18.7s	remaining: 1m 23s
366:	total: 18.8s	remaining: 1m 23s
367:	total: 18.8s	remaining: 1m 23s
368:	total: 18.9s	remaining: 1m 23s
369:	total: 18.9s	remaining: 1m 23s
370:	total: 19s	remaining: 1m 23s
371:	total: 19s	remaining: 1m 23s
372:	total: 19.1s	remaining: 1m 23s
373:	total: 19.1s	remaining: 1m 23s
374:	total: 19.2s	remaining: 1m 23s
375:	total: 19.2s	remaining: 1m 23s
376:	total: 19.3s	remaining: 1m 22s
377:	total: 19.3s	remaining: 1m 22s
378:	total: 19.4s	remaining: 1m 22s
379:	total: 19.4s	remaining: 1m 22s
380:	total: 19.5s	remaining: 1m 22s
381:	total: 19.5s	remaining: 1m 22s
382:	total: 19.6s	remaining: 1m 22s
383:	total: 19.6s	remaining: 1m 22s
384:	total: 19.7s	remaining: 1m 22s
385:	total: 19.7s	remaining: 1m 22s
386:	total: 19.8s	remaining: 1m 22s
387:	total: 19.8s	remaining: 1m 22s
388:	total: 19.9s	remaining: 1m 22s
389:	total: 19.9s	remaining: 1m 22s
390:	total: 20s	remaining: 1m 22s
391:	total: 20s	remaining: 1m 22s
392:	total: 20.1s	remaining: 1m 22s
393:	total: 20.1s	remaining: 1m 21s
394:	total: 20.2s	remaining: 1m 21s
395:	total: 20.2s	remaining: 1m 21s
396:	total: 20.3s	remaining: 1m 21s
397:	total: 20.3s	remaining: 1m 21s
398:	total: 20.4s	remaining: 1m 21s
399:	total: 20.4s	remaining: 1m 21s
400:	total: 20.5s	remaining: 1m 21s
401:	total: 20.5s	remaining: 1m 21s
402:	total: 20.6s	remaining: 1m 21s
403:	total: 20.6s	remaining: 1m 21s
404:	total: 20.7s	remaining: 1m 21s
405:	total: 20.7s	remaining: 1m 21s
406:	total: 20.8s	remaining: 1m 21s
407:	total: 20.8s	remaining: 1m 21s
408:	total: 20.9s	remaining: 1m 21s
409:	total: 20.9s	remaining: 1m 21s
410:	total: 21s	remaining: 1m 21s
411:	total: 21.1s	remaining: 1m 21s
412:	total: 21.1s	remaining: 1m 21s
413:	total: 21.1s	remaining: 1m 20s
414:	total: 21.2s	remaining: 1m 20s
415:	total: 21.2s	remaining: 1m 20s
416:	total: 21.3s	remaining: 1m 20s
417:	total: 21.3s	remaining: 1m 20s
418:	total: 21.4s	remaining: 1m 20s
419:	total: 21.4s	remaining: 1m 20s
420:	total: 21.5s	remaining: 1m 20s
421:	total: 21.5s	remaining: 1m 20s
422:	total: 21.6s	remaining: 1m 20s
423:	total: 21.6s	remaining: 1m 20s
424:	total: 21.7s	remaining: 1m 20s
425:	total: 21.7s	remaining: 1m 20s
426:	total: 21.8s	remaining: 1m 20s
427:	total: 21.8s	remaining: 1m 20s
428:	total: 21.9s	remaining: 1m 20s
429:	total: 22s	remaining: 1m 20s
430:	total: 22s	remaining: 1m 20s
431:	total: 22s	remaining: 1m 20s
432:	total: 22.1s	remaining: 1m 19s
433:	total: 22.1s	remaining: 1m 19s
434:	total: 22.2s	remaining: 1m 19s
435:	total: 22.2s	remaining: 1m 19s
436:	total: 22.3s	remaining: 1m 19s
437:	total: 22.3s	remaining: 1m 19s
438:	total: 22.4s	remaining: 1m 19s
439:	total: 22.4s	remaining: 1m 19s
440:	total: 22.5s	remaining: 1m 19s
441:	total: 22.5s	remaining: 1m 19s
442:	total: 22.6s	remaining: 1m 19s
443:	total: 22.6s	remaining: 1m 19s
444:	total: 22.7s	remaining: 1m 19s
445:	total: 22.7s	remaining: 1m 19s
446:	total: 22.8s	remaining: 1m 19s
447:	total: 22.8s	remaining: 1m 19s
448:	total: 22.9s	remaining: 1m 19s
449:	total: 23s	remaining: 1m 19s
450:	total: 23s	remaining: 1m 19s
451:	total: 23.1s	remaining: 1m 18s
452:	total: 23.1s	remaining: 1m 18s
453:	total: 23.1s	remaining: 1m 18s
454:	total: 23.2s	remaining: 1m 18s
455:	total: 23.2s	remaining: 1m 18s
456:	total: 23.3s	remaining: 1m 18s
457:	total: 23.3s	remaining: 1m 18s
458:	total: 23.4s	remaining: 1m 18s
459:	total: 23.4s	remaining: 1m 18s
460:	total: 23.5s	remaining: 1m 18s
461:	total: 23.5s	remaining: 1m 18s
462:	total: 23.6s	remaining: 1m 18s
463:	total: 23.6s	remaining: 1m 18s
464:	total: 23.7s	remaining: 1m 18s
465:	total: 23.7s	remaining: 1m 18s
```

```result
466:	total: 23.8s	remaining: 1m 18s
467:	total: 23.8s	remaining: 1m 18s
468:	total: 23.9s	remaining: 1m 17s
469:	total: 23.9s	remaining: 1m 17s
470:	total: 24s	remaining: 1m 17s
471:	total: 24s	remaining: 1m 17s
472:	total: 24.1s	remaining: 1m 17s
473:	total: 24.1s	remaining: 1m 17s
474:	total: 24.2s	remaining: 1m 17s
475:	total: 24.2s	remaining: 1m 17s
476:	total: 24.3s	remaining: 1m 17s
477:	total: 24.3s	remaining: 1m 17s
478:	total: 24.4s	remaining: 1m 17s
479:	total: 24.4s	remaining: 1m 17s
480:	total: 24.5s	remaining: 1m 17s
481:	total: 24.5s	remaining: 1m 17s
482:	total: 24.6s	remaining: 1m 17s
483:	total: 24.6s	remaining: 1m 17s
484:	total: 24.7s	remaining: 1m 17s
485:	total: 24.7s	remaining: 1m 17s
486:	total: 24.8s	remaining: 1m 17s
487:	total: 24.8s	remaining: 1m 16s
488:	total: 24.9s	remaining: 1m 16s
489:	total: 24.9s	remaining: 1m 16s
490:	total: 25s	remaining: 1m 16s
491:	total: 25s	remaining: 1m 16s
492:	total: 25.1s	remaining: 1m 16s
493:	total: 25.1s	remaining: 1m 16s
494:	total: 25.2s	remaining: 1m 16s
495:	total: 25.2s	remaining: 1m 16s
496:	total: 25.3s	remaining: 1m 16s
497:	total: 25.3s	remaining: 1m 16s
498:	total: 25.4s	remaining: 1m 16s
499:	total: 25.4s	remaining: 1m 16s
500:	total: 25.5s	remaining: 1m 16s
501:	total: 25.5s	remaining: 1m 16s
502:	total: 25.6s	remaining: 1m 16s
503:	total: 25.6s	remaining: 1m 16s
504:	total: 25.7s	remaining: 1m 16s
505:	total: 25.7s	remaining: 1m 16s
506:	total: 25.8s	remaining: 1m 15s
507:	total: 25.8s	remaining: 1m 15s
508:	total: 25.9s	remaining: 1m 15s
509:	total: 26s	remaining: 1m 15s
510:	total: 26s	remaining: 1m 15s
511:	total: 26.1s	remaining: 1m 15s
512:	total: 26.1s	remaining: 1m 15s
513:	total: 26.2s	remaining: 1m 15s
514:	total: 26.2s	remaining: 1m 15s
515:	total: 26.2s	remaining: 1m 15s
516:	total: 26.3s	remaining: 1m 15s
517:	total: 26.4s	remaining: 1m 15s
518:	total: 26.4s	remaining: 1m 15s
519:	total: 26.5s	remaining: 1m 15s
520:	total: 26.5s	remaining: 1m 15s
521:	total: 26.6s	remaining: 1m 15s
522:	total: 26.6s	remaining: 1m 15s
523:	total: 26.7s	remaining: 1m 15s
524:	total: 26.7s	remaining: 1m 15s
525:	total: 26.8s	remaining: 1m 15s
526:	total: 26.8s	remaining: 1m 14s
527:	total: 26.9s	remaining: 1m 14s
528:	total: 26.9s	remaining: 1m 14s
529:	total: 27s	remaining: 1m 14s
530:	total: 27s	remaining: 1m 14s
531:	total: 27.1s	remaining: 1m 14s
532:	total: 27.1s	remaining: 1m 14s
533:	total: 27.2s	remaining: 1m 14s
534:	total: 27.2s	remaining: 1m 14s
535:	total: 27.3s	remaining: 1m 14s
536:	total: 27.3s	remaining: 1m 14s
537:	total: 27.4s	remaining: 1m 14s
538:	total: 27.4s	remaining: 1m 14s
539:	total: 27.5s	remaining: 1m 14s
540:	total: 27.5s	remaining: 1m 14s
541:	total: 27.6s	remaining: 1m 14s
542:	total: 27.6s	remaining: 1m 14s
543:	total: 27.7s	remaining: 1m 14s
544:	total: 27.7s	remaining: 1m 14s
545:	total: 27.8s	remaining: 1m 14s
546:	total: 27.8s	remaining: 1m 13s
547:	total: 27.9s	remaining: 1m 13s
548:	total: 28s	remaining: 1m 13s
549:	total: 28s	remaining: 1m 13s
550:	total: 28.1s	remaining: 1m 13s
551:	total: 28.1s	remaining: 1m 13s
552:	total: 28.2s	remaining: 1m 13s
553:	total: 28.2s	remaining: 1m 13s
554:	total: 28.3s	remaining: 1m 13s
555:	total: 28.3s	remaining: 1m 13s
556:	total: 28.4s	remaining: 1m 13s
557:	total: 28.4s	remaining: 1m 13s
558:	total: 28.5s	remaining: 1m 13s
559:	total: 28.5s	remaining: 1m 13s
560:	total: 28.6s	remaining: 1m 13s
561:	total: 28.6s	remaining: 1m 13s
562:	total: 28.7s	remaining: 1m 13s
563:	total: 28.8s	remaining: 1m 13s
564:	total: 28.8s	remaining: 1m 13s
565:	total: 28.9s	remaining: 1m 13s
566:	total: 28.9s	remaining: 1m 13s
567:	total: 29s	remaining: 1m 13s
568:	total: 29s	remaining: 1m 12s
569:	total: 29.1s	remaining: 1m 12s
570:	total: 29.1s	remaining: 1m 12s
571:	total: 29.2s	remaining: 1m 12s
572:	total: 29.2s	remaining: 1m 12s
573:	total: 29.3s	remaining: 1m 12s
574:	total: 29.4s	remaining: 1m 12s
575:	total: 29.4s	remaining: 1m 12s
576:	total: 29.4s	remaining: 1m 12s
577:	total: 29.5s	remaining: 1m 12s
578:	total: 29.6s	remaining: 1m 12s
579:	total: 29.6s	remaining: 1m 12s
580:	total: 29.7s	remaining: 1m 12s
581:	total: 29.7s	remaining: 1m 12s
582:	total: 29.8s	remaining: 1m 12s
583:	total: 29.8s	remaining: 1m 12s
584:	total: 29.9s	remaining: 1m 12s
585:	total: 29.9s	remaining: 1m 12s
586:	total: 30s	remaining: 1m 12s
587:	total: 30s	remaining: 1m 12s
588:	total: 30.1s	remaining: 1m 12s
589:	total: 30.1s	remaining: 1m 12s
590:	total: 30.2s	remaining: 1m 11s
591:	total: 30.2s	remaining: 1m 11s
592:	total: 30.3s	remaining: 1m 11s
593:	total: 30.3s	remaining: 1m 11s
594:	total: 30.4s	remaining: 1m 11s
595:	total: 30.4s	remaining: 1m 11s
596:	total: 30.5s	remaining: 1m 11s
597:	total: 30.6s	remaining: 1m 11s
598:	total: 30.6s	remaining: 1m 11s
599:	total: 30.7s	remaining: 1m 11s
600:	total: 30.7s	remaining: 1m 11s
601:	total: 30.8s	remaining: 1m 11s
602:	total: 30.8s	remaining: 1m 11s
603:	total: 30.9s	remaining: 1m 11s
604:	total: 30.9s	remaining: 1m 11s
605:	total: 31s	remaining: 1m 11s
606:	total: 31s	remaining: 1m 11s
607:	total: 31.1s	remaining: 1m 11s
608:	total: 31.1s	remaining: 1m 11s
609:	total: 31.2s	remaining: 1m 11s
610:	total: 31.2s	remaining: 1m 10s
611:	total: 31.3s	remaining: 1m 10s
612:	total: 31.4s	remaining: 1m 10s
613:	total: 31.4s	remaining: 1m 10s
614:	total: 31.5s	remaining: 1m 10s
615:	total: 31.5s	remaining: 1m 10s
616:	total: 31.6s	remaining: 1m 10s
617:	total: 31.6s	remaining: 1m 10s
618:	total: 31.7s	remaining: 1m 10s
619:	total: 31.7s	remaining: 1m 10s
620:	total: 31.8s	remaining: 1m 10s
621:	total: 31.8s	remaining: 1m 10s
622:	total: 31.9s	remaining: 1m 10s
623:	total: 31.9s	remaining: 1m 10s
624:	total: 32s	remaining: 1m 10s
625:	total: 32s	remaining: 1m 10s
626:	total: 32.1s	remaining: 1m 10s
627:	total: 32.1s	remaining: 1m 10s
628:	total: 32.2s	remaining: 1m 10s
629:	total: 32.2s	remaining: 1m 10s
630:	total: 32.3s	remaining: 1m 10s
631:	total: 32.3s	remaining: 1m 9s
632:	total: 32.4s	remaining: 1m 10s
633:	total: 32.5s	remaining: 1m 9s
634:	total: 32.5s	remaining: 1m 9s
635:	total: 32.6s	remaining: 1m 9s
636:	total: 32.7s	remaining: 1m 9s
637:	total: 32.7s	remaining: 1m 9s
638:	total: 32.8s	remaining: 1m 9s
639:	total: 32.8s	remaining: 1m 9s
640:	total: 32.9s	remaining: 1m 9s
641:	total: 32.9s	remaining: 1m 9s
642:	total: 33s	remaining: 1m 9s
643:	total: 33.1s	remaining: 1m 9s
644:	total: 33.1s	remaining: 1m 9s
645:	total: 33.2s	remaining: 1m 9s
646:	total: 33.2s	remaining: 1m 9s
647:	total: 33.3s	remaining: 1m 9s
648:	total: 33.3s	remaining: 1m 9s
649:	total: 33.4s	remaining: 1m 9s
650:	total: 33.4s	remaining: 1m 9s
651:	total: 33.5s	remaining: 1m 9s
652:	total: 33.6s	remaining: 1m 9s
653:	total: 33.6s	remaining: 1m 9s
654:	total: 33.7s	remaining: 1m 9s
655:	total: 33.8s	remaining: 1m 9s
656:	total: 33.8s	remaining: 1m 9s
657:	total: 33.9s	remaining: 1m 9s
658:	total: 34s	remaining: 1m 9s
659:	total: 34.1s	remaining: 1m 9s
660:	total: 34.1s	remaining: 1m 9s
661:	total: 34.2s	remaining: 1m 9s
662:	total: 34.3s	remaining: 1m 9s
663:	total: 34.3s	remaining: 1m 9s
664:	total: 34.4s	remaining: 1m 8s
665:	total: 34.4s	remaining: 1m 8s
666:	total: 34.5s	remaining: 1m 8s
667:	total: 34.5s	remaining: 1m 8s
668:	total: 34.6s	remaining: 1m 8s
669:	total: 34.6s	remaining: 1m 8s
670:	total: 34.7s	remaining: 1m 8s
671:	total: 34.7s	remaining: 1m 8s
672:	total: 34.8s	remaining: 1m 8s
673:	total: 34.8s	remaining: 1m 8s
674:	total: 34.9s	remaining: 1m 8s
675:	total: 34.9s	remaining: 1m 8s
676:	total: 35s	remaining: 1m 8s
677:	total: 35s	remaining: 1m 8s
678:	total: 35.1s	remaining: 1m 8s
679:	total: 35.1s	remaining: 1m 8s
680:	total: 35.2s	remaining: 1m 8s
681:	total: 35.2s	remaining: 1m 8s
682:	total: 35.3s	remaining: 1m 8s
683:	total: 35.3s	remaining: 1m 7s
684:	total: 35.4s	remaining: 1m 7s
685:	total: 35.4s	remaining: 1m 7s
686:	total: 35.5s	remaining: 1m 7s
687:	total: 35.6s	remaining: 1m 7s
688:	total: 35.6s	remaining: 1m 7s
689:	total: 35.7s	remaining: 1m 7s
690:	total: 35.7s	remaining: 1m 7s
691:	total: 35.8s	remaining: 1m 7s
692:	total: 35.8s	remaining: 1m 7s
693:	total: 35.9s	remaining: 1m 7s
694:	total: 35.9s	remaining: 1m 7s
695:	total: 36s	remaining: 1m 7s
696:	total: 36s	remaining: 1m 7s
697:	total: 36.1s	remaining: 1m 7s
```

```result
698:	total: 36.1s	remaining: 1m 7s
699:	total: 36.2s	remaining: 1m 7s
700:	total: 36.2s	remaining: 1m 7s
701:	total: 36.3s	remaining: 1m 7s
702:	total: 36.3s	remaining: 1m 7s
703:	total: 36.4s	remaining: 1m 7s
704:	total: 36.5s	remaining: 1m 6s
705:	total: 36.5s	remaining: 1m 6s
706:	total: 36.6s	remaining: 1m 6s
707:	total: 36.6s	remaining: 1m 6s
708:	total: 36.7s	remaining: 1m 6s
709:	total: 36.7s	remaining: 1m 6s
710:	total: 36.8s	remaining: 1m 6s
711:	total: 36.8s	remaining: 1m 6s
712:	total: 36.9s	remaining: 1m 6s
713:	total: 36.9s	remaining: 1m 6s
714:	total: 37s	remaining: 1m 6s
715:	total: 37s	remaining: 1m 6s
716:	total: 37.1s	remaining: 1m 6s
717:	total: 37.1s	remaining: 1m 6s
718:	total: 37.2s	remaining: 1m 6s
719:	total: 37.2s	remaining: 1m 6s
720:	total: 37.3s	remaining: 1m 6s
721:	total: 37.3s	remaining: 1m 6s
722:	total: 37.4s	remaining: 1m 6s
723:	total: 37.4s	remaining: 1m 5s
724:	total: 37.5s	remaining: 1m 5s
725:	total: 37.5s	remaining: 1m 5s
726:	total: 37.6s	remaining: 1m 5s
727:	total: 37.7s	remaining: 1m 5s
728:	total: 37.7s	remaining: 1m 5s
729:	total: 37.8s	remaining: 1m 5s
730:	total: 37.8s	remaining: 1m 5s
731:	total: 37.9s	remaining: 1m 5s
732:	total: 37.9s	remaining: 1m 5s
733:	total: 38s	remaining: 1m 5s
734:	total: 38s	remaining: 1m 5s
735:	total: 38s	remaining: 1m 5s
736:	total: 38.1s	remaining: 1m 5s
737:	total: 38.2s	remaining: 1m 5s
738:	total: 38.2s	remaining: 1m 5s
739:	total: 38.3s	remaining: 1m 5s
740:	total: 38.3s	remaining: 1m 5s
741:	total: 38.4s	remaining: 1m 5s
742:	total: 38.4s	remaining: 1m 4s
743:	total: 38.5s	remaining: 1m 4s
744:	total: 38.5s	remaining: 1m 4s
745:	total: 38.6s	remaining: 1m 4s
746:	total: 38.6s	remaining: 1m 4s
747:	total: 38.7s	remaining: 1m 4s
748:	total: 38.7s	remaining: 1m 4s
749:	total: 38.8s	remaining: 1m 4s
750:	total: 38.9s	remaining: 1m 4s
751:	total: 38.9s	remaining: 1m 4s
752:	total: 39s	remaining: 1m 4s
753:	total: 39s	remaining: 1m 4s
754:	total: 39.1s	remaining: 1m 4s
755:	total: 39.1s	remaining: 1m 4s
756:	total: 39.2s	remaining: 1m 4s
757:	total: 39.2s	remaining: 1m 4s
758:	total: 39.3s	remaining: 1m 4s
759:	total: 39.3s	remaining: 1m 4s
760:	total: 39.3s	remaining: 1m 4s
761:	total: 39.4s	remaining: 1m 4s
762:	total: 39.5s	remaining: 1m 3s
763:	total: 39.5s	remaining: 1m 3s
764:	total: 39.6s	remaining: 1m 3s
765:	total: 39.6s	remaining: 1m 3s
766:	total: 39.7s	remaining: 1m 3s
767:	total: 39.7s	remaining: 1m 3s
768:	total: 39.8s	remaining: 1m 3s
769:	total: 39.8s	remaining: 1m 3s
770:	total: 39.9s	remaining: 1m 3s
771:	total: 39.9s	remaining: 1m 3s
772:	total: 40s	remaining: 1m 3s
773:	total: 40s	remaining: 1m 3s
774:	total: 40.1s	remaining: 1m 3s
775:	total: 40.1s	remaining: 1m 3s
776:	total: 40.2s	remaining: 1m 3s
777:	total: 40.2s	remaining: 1m 3s
778:	total: 40.3s	remaining: 1m 3s
779:	total: 40.3s	remaining: 1m 3s
780:	total: 40.4s	remaining: 1m 3s
781:	total: 40.4s	remaining: 1m 2s
782:	total: 40.5s	remaining: 1m 2s
783:	total: 40.5s	remaining: 1m 2s
784:	total: 40.6s	remaining: 1m 2s
785:	total: 40.7s	remaining: 1m 2s
786:	total: 40.7s	remaining: 1m 2s
787:	total: 40.8s	remaining: 1m 2s
788:	total: 40.8s	remaining: 1m 2s
789:	total: 40.9s	remaining: 1m 2s
790:	total: 40.9s	remaining: 1m 2s
791:	total: 41s	remaining: 1m 2s
792:	total: 41s	remaining: 1m 2s
793:	total: 41.1s	remaining: 1m 2s
794:	total: 41.1s	remaining: 1m 2s
795:	total: 41.2s	remaining: 1m 2s
796:	total: 41.2s	remaining: 1m 2s
797:	total: 41.3s	remaining: 1m 2s
798:	total: 41.3s	remaining: 1m 2s
799:	total: 41.4s	remaining: 1m 2s
800:	total: 41.5s	remaining: 1m 2s
801:	total: 41.5s	remaining: 1m 2s
802:	total: 41.6s	remaining: 1m 1s
803:	total: 41.6s	remaining: 1m 1s
804:	total: 41.7s	remaining: 1m 1s
805:	total: 41.7s	remaining: 1m 1s
806:	total: 41.8s	remaining: 1m 1s
807:	total: 41.8s	remaining: 1m 1s
808:	total: 41.9s	remaining: 1m 1s
809:	total: 41.9s	remaining: 1m 1s
810:	total: 42s	remaining: 1m 1s
811:	total: 42s	remaining: 1m 1s
812:	total: 42.1s	remaining: 1m 1s
813:	total: 42.1s	remaining: 1m 1s
814:	total: 42.2s	remaining: 1m 1s
815:	total: 42.2s	remaining: 1m 1s
816:	total: 42.3s	remaining: 1m 1s
817:	total: 42.3s	remaining: 1m 1s
818:	total: 42.4s	remaining: 1m 1s
819:	total: 42.5s	remaining: 1m 1s
820:	total: 42.5s	remaining: 1m 1s
821:	total: 42.6s	remaining: 1m
822:	total: 42.6s	remaining: 1m
823:	total: 42.7s	remaining: 1m
824:	total: 42.7s	remaining: 1m
825:	total: 42.8s	remaining: 1m
826:	total: 42.9s	remaining: 1m
827:	total: 43s	remaining: 1m
828:	total: 43s	remaining: 1m
829:	total: 43.1s	remaining: 1m
830:	total: 43.1s	remaining: 1m
831:	total: 43.2s	remaining: 1m
832:	total: 43.2s	remaining: 1m
833:	total: 43.3s	remaining: 1m
834:	total: 43.3s	remaining: 1m
835:	total: 43.4s	remaining: 1m
836:	total: 43.4s	remaining: 1m
837:	total: 43.5s	remaining: 1m
838:	total: 43.5s	remaining: 1m
839:	total: 43.6s	remaining: 1m
840:	total: 43.7s	remaining: 1m
841:	total: 43.7s	remaining: 1m
842:	total: 43.8s	remaining: 1m
843:	total: 43.8s	remaining: 1m
844:	total: 43.9s	remaining: 60s
845:	total: 43.9s	remaining: 59.9s
846:	total: 44s	remaining: 59.9s
847:	total: 44s	remaining: 59.8s
848:	total: 44.1s	remaining: 59.7s
849:	total: 44.1s	remaining: 59.7s
850:	total: 44.2s	remaining: 59.6s
851:	total: 44.2s	remaining: 59.6s
852:	total: 44.3s	remaining: 59.5s
853:	total: 44.3s	remaining: 59.5s
854:	total: 44.4s	remaining: 59.4s
855:	total: 44.4s	remaining: 59.4s
856:	total: 44.5s	remaining: 59.3s
857:	total: 44.6s	remaining: 59.3s
858:	total: 44.6s	remaining: 59.3s
859:	total: 44.7s	remaining: 59.2s
860:	total: 44.7s	remaining: 59.2s
861:	total: 44.8s	remaining: 59.2s
862:	total: 44.9s	remaining: 59.1s
863:	total: 44.9s	remaining: 59.1s
864:	total: 45s	remaining: 59s
865:	total: 45s	remaining: 58.9s
866:	total: 45.1s	remaining: 58.9s
867:	total: 45.1s	remaining: 58.8s
868:	total: 45.2s	remaining: 58.8s
869:	total: 45.2s	remaining: 58.7s
870:	total: 45.3s	remaining: 58.7s
871:	total: 45.3s	remaining: 58.6s
872:	total: 45.4s	remaining: 58.6s
873:	total: 45.4s	remaining: 58.5s
874:	total: 45.5s	remaining: 58.5s
875:	total: 45.5s	remaining: 58.4s
876:	total: 45.6s	remaining: 58.4s
877:	total: 45.6s	remaining: 58.3s
878:	total: 45.7s	remaining: 58.3s
879:	total: 45.7s	remaining: 58.2s
880:	total: 45.8s	remaining: 58.2s
881:	total: 45.8s	remaining: 58.1s
882:	total: 45.9s	remaining: 58.1s
883:	total: 46s	remaining: 58s
884:	total: 46s	remaining: 58s
885:	total: 46.1s	remaining: 57.9s
886:	total: 46.1s	remaining: 57.9s
887:	total: 46.2s	remaining: 57.8s
888:	total: 46.2s	remaining: 57.8s
889:	total: 46.3s	remaining: 57.7s
890:	total: 46.3s	remaining: 57.6s
891:	total: 46.4s	remaining: 57.6s
892:	total: 46.4s	remaining: 57.6s
893:	total: 46.5s	remaining: 57.5s
894:	total: 46.5s	remaining: 57.4s
895:	total: 46.6s	remaining: 57.4s
896:	total: 46.6s	remaining: 57.3s
897:	total: 46.7s	remaining: 57.3s
898:	total: 46.7s	remaining: 57.2s
899:	total: 46.8s	remaining: 57.2s
900:	total: 46.8s	remaining: 57.1s
901:	total: 46.9s	remaining: 57s
902:	total: 46.9s	remaining: 57s
903:	total: 47s	remaining: 56.9s
904:	total: 47s	remaining: 56.9s
905:	total: 47.1s	remaining: 56.8s
906:	total: 47.1s	remaining: 56.8s
907:	total: 47.2s	remaining: 56.7s
908:	total: 47.2s	remaining: 56.7s
909:	total: 47.2s	remaining: 56.6s
910:	total: 47.3s	remaining: 56.6s
911:	total: 47.4s	remaining: 56.5s
912:	total: 47.4s	remaining: 56.4s
913:	total: 47.5s	remaining: 56.4s
914:	total: 47.5s	remaining: 56.3s
915:	total: 47.6s	remaining: 56.3s
916:	total: 47.6s	remaining: 56.2s
917:	total: 47.7s	remaining: 56.2s
918:	total: 47.7s	remaining: 56.1s
919:	total: 47.8s	remaining: 56.1s
920:	total: 47.8s	remaining: 56s
921:	total: 47.9s	remaining: 56s
922:	total: 47.9s	remaining: 55.9s
923:	total: 48s	remaining: 55.8s
924:	total: 48s	remaining: 55.8s
925:	total: 48.1s	remaining: 55.7s
926:	total: 48.1s	remaining: 55.7s
927:	total: 48.2s	remaining: 55.6s
928:	total: 48.2s	remaining: 55.6s
929:	total: 48.2s	remaining: 55.5s
930:	total: 48.3s	remaining: 55.5s
931:	total: 48.3s	remaining: 55.4s
932:	total: 48.4s	remaining: 55.4s
933:	total: 48.4s	remaining: 55.3s
934:	total: 48.5s	remaining: 55.3s
935:	total: 48.6s	remaining: 55.2s
936:	total: 48.6s	remaining: 55.2s
937:	total: 48.7s	remaining: 55.1s
```

```result
938:	total: 48.7s	remaining: 55s
939:	total: 48.8s	remaining: 55s
940:	total: 48.8s	remaining: 54.9s
941:	total: 48.9s	remaining: 54.9s
942:	total: 48.9s	remaining: 54.8s
943:	total: 49s	remaining: 54.8s
944:	total: 49s	remaining: 54.7s
945:	total: 49.1s	remaining: 54.7s
946:	total: 49.1s	remaining: 54.6s
947:	total: 49.2s	remaining: 54.6s
948:	total: 49.2s	remaining: 54.5s
949:	total: 49.3s	remaining: 54.4s
950:	total: 49.3s	remaining: 54.4s
951:	total: 49.4s	remaining: 54.3s
952:	total: 49.4s	remaining: 54.3s
953:	total: 49.4s	remaining: 54.2s
954:	total: 49.5s	remaining: 54.2s
955:	total: 49.5s	remaining: 54.1s
956:	total: 49.6s	remaining: 54.1s
957:	total: 49.6s	remaining: 54s
958:	total: 49.7s	remaining: 53.9s
959:	total: 49.8s	remaining: 53.9s
960:	total: 49.8s	remaining: 53.9s
961:	total: 49.9s	remaining: 53.9s
962:	total: 50s	remaining: 53.8s
963:	total: 50.1s	remaining: 53.8s
964:	total: 50.1s	remaining: 53.8s
965:	total: 50.2s	remaining: 53.7s
966:	total: 50.3s	remaining: 53.7s
967:	total: 50.3s	remaining: 53.7s
968:	total: 50.4s	remaining: 53.6s
969:	total: 50.5s	remaining: 53.6s
970:	total: 50.5s	remaining: 53.6s
971:	total: 50.6s	remaining: 53.5s
972:	total: 50.6s	remaining: 53.5s
973:	total: 50.7s	remaining: 53.4s
974:	total: 50.7s	remaining: 53.3s
975:	total: 50.8s	remaining: 53.3s
976:	total: 50.8s	remaining: 53.2s
977:	total: 50.9s	remaining: 53.2s
978:	total: 50.9s	remaining: 53.1s
979:	total: 51s	remaining: 53.1s
980:	total: 51s	remaining: 53s
981:	total: 51.1s	remaining: 53s
982:	total: 51.1s	remaining: 52.9s
983:	total: 51.2s	remaining: 52.9s
984:	total: 51.2s	remaining: 52.8s
985:	total: 51.3s	remaining: 52.8s
986:	total: 51.4s	remaining: 52.7s
987:	total: 51.4s	remaining: 52.6s
988:	total: 51.4s	remaining: 52.6s
989:	total: 51.5s	remaining: 52.6s
990:	total: 51.6s	remaining: 52.5s
991:	total: 51.6s	remaining: 52.4s
992:	total: 51.7s	remaining: 52.4s
993:	total: 51.7s	remaining: 52.3s
994:	total: 51.8s	remaining: 52.3s
995:	total: 51.8s	remaining: 52.2s
996:	total: 51.9s	remaining: 52.2s
997:	total: 51.9s	remaining: 52.1s
998:	total: 52s	remaining: 52.1s
999:	total: 52s	remaining: 52s
1000:	total: 52.1s	remaining: 52s
1001:	total: 52.1s	remaining: 51.9s
1002:	total: 52.2s	remaining: 51.9s
1003:	total: 52.2s	remaining: 51.8s
1004:	total: 52.3s	remaining: 51.8s
1005:	total: 52.3s	remaining: 51.7s
1006:	total: 52.4s	remaining: 51.7s
1007:	total: 52.5s	remaining: 51.6s
1008:	total: 52.5s	remaining: 51.6s
1009:	total: 52.6s	remaining: 51.5s
1010:	total: 52.6s	remaining: 51.5s
1011:	total: 52.7s	remaining: 51.4s
1012:	total: 52.7s	remaining: 51.4s
1013:	total: 52.8s	remaining: 51.3s
1014:	total: 52.8s	remaining: 51.2s
1015:	total: 52.9s	remaining: 51.2s
1016:	total: 52.9s	remaining: 51.1s
1017:	total: 53s	remaining: 51.1s
1018:	total: 53s	remaining: 51s
1019:	total: 53.1s	remaining: 51s
1020:	total: 53.1s	remaining: 50.9s
1021:	total: 53.2s	remaining: 50.9s
1022:	total: 53.2s	remaining: 50.8s
1023:	total: 53.3s	remaining: 50.8s
1024:	total: 53.3s	remaining: 50.7s
1025:	total: 53.4s	remaining: 50.7s
1026:	total: 53.4s	remaining: 50.6s
1027:	total: 53.5s	remaining: 50.6s
1028:	total: 53.5s	remaining: 50.5s
1029:	total: 53.6s	remaining: 50.5s
1030:	total: 53.6s	remaining: 50.4s
1031:	total: 53.7s	remaining: 50.4s
1032:	total: 53.7s	remaining: 50.3s
1033:	total: 53.8s	remaining: 50.2s
1034:	total: 53.8s	remaining: 50.2s
1035:	total: 53.9s	remaining: 50.1s
1036:	total: 53.9s	remaining: 50.1s
1037:	total: 54s	remaining: 50s
1038:	total: 54s	remaining: 50s
1039:	total: 54.1s	remaining: 49.9s
1040:	total: 54.2s	remaining: 49.9s
1041:	total: 54.2s	remaining: 49.9s
1042:	total: 54.3s	remaining: 49.8s
1043:	total: 54.4s	remaining: 49.8s
1044:	total: 54.4s	remaining: 49.7s
1045:	total: 54.5s	remaining: 49.7s
1046:	total: 54.6s	remaining: 49.7s
1047:	total: 54.6s	remaining: 49.6s
1048:	total: 54.7s	remaining: 49.6s
1049:	total: 54.7s	remaining: 49.5s
1050:	total: 54.8s	remaining: 49.5s
1051:	total: 54.9s	remaining: 49.4s
1052:	total: 54.9s	remaining: 49.4s
1053:	total: 55s	remaining: 49.3s
1054:	total: 55s	remaining: 49.3s
1055:	total: 55.1s	remaining: 49.2s
1056:	total: 55.1s	remaining: 49.2s
1057:	total: 55.2s	remaining: 49.1s
1058:	total: 55.2s	remaining: 49.1s
1059:	total: 55.3s	remaining: 49s
1060:	total: 55.4s	remaining: 49s
1061:	total: 55.4s	remaining: 48.9s
1062:	total: 55.5s	remaining: 48.9s
1063:	total: 55.5s	remaining: 48.8s
1064:	total: 55.6s	remaining: 48.8s
1065:	total: 55.6s	remaining: 48.7s
1066:	total: 55.7s	remaining: 48.7s
1067:	total: 55.7s	remaining: 48.6s
1068:	total: 55.8s	remaining: 48.6s
1069:	total: 55.8s	remaining: 48.5s
1070:	total: 55.9s	remaining: 48.5s
1071:	total: 55.9s	remaining: 48.4s
1072:	total: 56s	remaining: 48.4s
1073:	total: 56s	remaining: 48.3s
1074:	total: 56.1s	remaining: 48.3s
1075:	total: 56.1s	remaining: 48.2s
1076:	total: 56.2s	remaining: 48.1s
1077:	total: 56.2s	remaining: 48.1s
1078:	total: 56.3s	remaining: 48s
1079:	total: 56.3s	remaining: 48s
1080:	total: 56.4s	remaining: 47.9s
1081:	total: 56.4s	remaining: 47.9s
1082:	total: 56.5s	remaining: 47.8s
1083:	total: 56.5s	remaining: 47.8s
1084:	total: 56.6s	remaining: 47.7s
1085:	total: 56.6s	remaining: 47.7s
1086:	total: 56.7s	remaining: 47.6s
1087:	total: 56.7s	remaining: 47.5s
1088:	total: 56.8s	remaining: 47.5s
1089:	total: 56.8s	remaining: 47.4s
1090:	total: 56.9s	remaining: 47.4s
1091:	total: 56.9s	remaining: 47.3s
1092:	total: 57s	remaining: 47.3s
1093:	total: 57s	remaining: 47.2s
1094:	total: 57.1s	remaining: 47.2s
1095:	total: 57.1s	remaining: 47.1s
1096:	total: 57.2s	remaining: 47.1s
1097:	total: 57.2s	remaining: 47s
1098:	total: 57.3s	remaining: 47s
1099:	total: 57.3s	remaining: 46.9s
1100:	total: 57.4s	remaining: 46.9s
1101:	total: 57.4s	remaining: 46.8s
1102:	total: 57.5s	remaining: 46.7s
1103:	total: 57.5s	remaining: 46.7s
1104:	total: 57.6s	remaining: 46.6s
1105:	total: 57.6s	remaining: 46.6s
1106:	total: 57.7s	remaining: 46.5s
1107:	total: 57.7s	remaining: 46.5s
1108:	total: 57.8s	remaining: 46.4s
1109:	total: 57.8s	remaining: 46.4s
1110:	total: 57.9s	remaining: 46.3s
1111:	total: 57.9s	remaining: 46.2s
1112:	total: 58s	remaining: 46.2s
1113:	total: 58s	remaining: 46.1s
1114:	total: 58s	remaining: 46.1s
1115:	total: 58.1s	remaining: 46s
1116:	total: 58.1s	remaining: 46s
1117:	total: 58.2s	remaining: 45.9s
1118:	total: 58.2s	remaining: 45.9s
1119:	total: 58.3s	remaining: 45.8s
1120:	total: 58.3s	remaining: 45.7s
1121:	total: 58.4s	remaining: 45.7s
1122:	total: 58.4s	remaining: 45.6s
1123:	total: 58.5s	remaining: 45.6s
1124:	total: 58.5s	remaining: 45.5s
1125:	total: 58.6s	remaining: 45.5s
1126:	total: 58.6s	remaining: 45.4s
1127:	total: 58.7s	remaining: 45.4s
1128:	total: 58.7s	remaining: 45.3s
1129:	total: 58.8s	remaining: 45.3s
1130:	total: 58.8s	remaining: 45.2s
1131:	total: 58.9s	remaining: 45.1s
1132:	total: 58.9s	remaining: 45.1s
1133:	total: 59s	remaining: 45s
1134:	total: 59s	remaining: 45s
1135:	total: 59.1s	remaining: 44.9s
1136:	total: 59.1s	remaining: 44.9s
1137:	total: 59.2s	remaining: 44.8s
1138:	total: 59.2s	remaining: 44.8s
1139:	total: 59.3s	remaining: 44.7s
1140:	total: 59.3s	remaining: 44.7s
1141:	total: 59.4s	remaining: 44.6s
1142:	total: 59.4s	remaining: 44.6s
1143:	total: 59.5s	remaining: 44.5s
1144:	total: 59.5s	remaining: 44.4s
1145:	total: 59.6s	remaining: 44.4s
1146:	total: 59.6s	remaining: 44.3s
1147:	total: 59.7s	remaining: 44.3s
1148:	total: 59.7s	remaining: 44.2s
1149:	total: 59.8s	remaining: 44.2s
1150:	total: 59.8s	remaining: 44.1s
1151:	total: 59.9s	remaining: 44.1s
1152:	total: 59.9s	remaining: 44s
1153:	total: 60s	remaining: 44s
1154:	total: 1m	remaining: 43.9s
1155:	total: 1m	remaining: 43.8s
1156:	total: 1m	remaining: 43.8s
1157:	total: 1m	remaining: 43.7s
1158:	total: 1m	remaining: 43.7s
1159:	total: 1m	remaining: 43.6s
1160:	total: 1m	remaining: 43.6s
1161:	total: 1m	remaining: 43.5s
1162:	total: 1m	remaining: 43.5s
1163:	total: 1m	remaining: 43.4s
1164:	total: 1m	remaining: 43.4s
1165:	total: 1m	remaining: 43.3s
1166:	total: 1m	remaining: 43.2s
1167:	total: 1m	remaining: 43.2s
1168:	total: 1m	remaining: 43.1s
1169:	total: 1m	remaining: 43.1s
1170:	total: 1m	remaining: 43s
1171:	total: 1m	remaining: 43s
1172:	total: 1m	remaining: 42.9s
1173:	total: 1m	remaining: 42.9s
1174:	total: 1m	remaining: 42.8s
```

```result
1175:	total: 1m 1s	remaining: 42.8s
1176:	total: 1m 1s	remaining: 42.7s
1177:	total: 1m 1s	remaining: 42.7s
1178:	total: 1m 1s	remaining: 42.6s
1179:	total: 1m 1s	remaining: 42.6s
1180:	total: 1m 1s	remaining: 42.5s
1181:	total: 1m 1s	remaining: 42.4s
1182:	total: 1m 1s	remaining: 42.4s
1183:	total: 1m 1s	remaining: 42.3s
1184:	total: 1m 1s	remaining: 42.3s
1185:	total: 1m 1s	remaining: 42.2s
1186:	total: 1m 1s	remaining: 42.2s
1187:	total: 1m 1s	remaining: 42.1s
1188:	total: 1m 1s	remaining: 42.1s
1189:	total: 1m 1s	remaining: 42s
1190:	total: 1m 1s	remaining: 42s
1191:	total: 1m 1s	remaining: 41.9s
1192:	total: 1m 1s	remaining: 41.8s
1193:	total: 1m 1s	remaining: 41.8s
1194:	total: 1m 1s	remaining: 41.7s
1195:	total: 1m 2s	remaining: 41.7s
1196:	total: 1m 2s	remaining: 41.6s
1197:	total: 1m 2s	remaining: 41.6s
1198:	total: 1m 2s	remaining: 41.5s
1199:	total: 1m 2s	remaining: 41.5s
1200:	total: 1m 2s	remaining: 41.4s
1201:	total: 1m 2s	remaining: 41.4s
1202:	total: 1m 2s	remaining: 41.3s
1203:	total: 1m 2s	remaining: 41.3s
1204:	total: 1m 2s	remaining: 41.2s
1205:	total: 1m 2s	remaining: 41.1s
1206:	total: 1m 2s	remaining: 41.1s
1207:	total: 1m 2s	remaining: 41s
1208:	total: 1m 2s	remaining: 41s
1209:	total: 1m 2s	remaining: 40.9s
1210:	total: 1m 2s	remaining: 40.9s
1211:	total: 1m 2s	remaining: 40.8s
1212:	total: 1m 2s	remaining: 40.8s
1213:	total: 1m 2s	remaining: 40.7s
1214:	total: 1m 2s	remaining: 40.7s
1215:	total: 1m 2s	remaining: 40.6s
1216:	total: 1m 3s	remaining: 40.6s
1217:	total: 1m 3s	remaining: 40.5s
1218:	total: 1m 3s	remaining: 40.5s
1219:	total: 1m 3s	remaining: 40.4s
1220:	total: 1m 3s	remaining: 40.4s
1221:	total: 1m 3s	remaining: 40.3s
1222:	total: 1m 3s	remaining: 40.2s
1223:	total: 1m 3s	remaining: 40.2s
1224:	total: 1m 3s	remaining: 40.1s
1225:	total: 1m 3s	remaining: 40.1s
1226:	total: 1m 3s	remaining: 40s
1227:	total: 1m 3s	remaining: 40s
1228:	total: 1m 3s	remaining: 39.9s
1229:	total: 1m 3s	remaining: 39.9s
1230:	total: 1m 3s	remaining: 39.8s
1231:	total: 1m 3s	remaining: 39.8s
1232:	total: 1m 3s	remaining: 39.7s
1233:	total: 1m 3s	remaining: 39.7s
1234:	total: 1m 3s	remaining: 39.6s
1235:	total: 1m 3s	remaining: 39.5s
1236:	total: 1m 4s	remaining: 39.5s
1237:	total: 1m 4s	remaining: 39.4s
1238:	total: 1m 4s	remaining: 39.4s
1239:	total: 1m 4s	remaining: 39.3s
1240:	total: 1m 4s	remaining: 39.3s
1241:	total: 1m 4s	remaining: 39.2s
1242:	total: 1m 4s	remaining: 39.2s
1243:	total: 1m 4s	remaining: 39.1s
1244:	total: 1m 4s	remaining: 39.1s
1245:	total: 1m 4s	remaining: 39s
1246:	total: 1m 4s	remaining: 39s
1247:	total: 1m 4s	remaining: 38.9s
1248:	total: 1m 4s	remaining: 38.9s
1249:	total: 1m 4s	remaining: 38.8s
1250:	total: 1m 4s	remaining: 38.8s
1251:	total: 1m 4s	remaining: 38.7s
1252:	total: 1m 4s	remaining: 38.7s
1253:	total: 1m 4s	remaining: 38.6s
1254:	total: 1m 4s	remaining: 38.6s
1255:	total: 1m 5s	remaining: 38.5s
1256:	total: 1m 5s	remaining: 38.5s
1257:	total: 1m 5s	remaining: 38.4s
1258:	total: 1m 5s	remaining: 38.4s
1259:	total: 1m 5s	remaining: 38.3s
1260:	total: 1m 5s	remaining: 38.3s
1261:	total: 1m 5s	remaining: 38.2s
1262:	total: 1m 5s	remaining: 38.2s
1263:	total: 1m 5s	remaining: 38.1s
1264:	total: 1m 5s	remaining: 38.1s
1265:	total: 1m 5s	remaining: 38s
1266:	total: 1m 5s	remaining: 38s
1267:	total: 1m 5s	remaining: 37.9s
1268:	total: 1m 5s	remaining: 37.9s
1269:	total: 1m 5s	remaining: 37.8s
1270:	total: 1m 5s	remaining: 37.8s
1271:	total: 1m 5s	remaining: 37.7s
1272:	total: 1m 5s	remaining: 37.7s
1273:	total: 1m 6s	remaining: 37.6s
1274:	total: 1m 6s	remaining: 37.6s
1275:	total: 1m 6s	remaining: 37.5s
1276:	total: 1m 6s	remaining: 37.5s
1277:	total: 1m 6s	remaining: 37.4s
1278:	total: 1m 6s	remaining: 37.4s
1279:	total: 1m 6s	remaining: 37.3s
1280:	total: 1m 6s	remaining: 37.3s
1281:	total: 1m 6s	remaining: 37.2s
1282:	total: 1m 6s	remaining: 37.2s
1283:	total: 1m 6s	remaining: 37.1s
1284:	total: 1m 6s	remaining: 37.1s
1285:	total: 1m 6s	remaining: 37s
1286:	total: 1m 6s	remaining: 37s
1287:	total: 1m 6s	remaining: 36.9s
1288:	total: 1m 6s	remaining: 36.9s
1289:	total: 1m 6s	remaining: 36.8s
1290:	total: 1m 6s	remaining: 36.8s
1291:	total: 1m 7s	remaining: 36.7s
1292:	total: 1m 7s	remaining: 36.7s
1293:	total: 1m 7s	remaining: 36.6s
1294:	total: 1m 7s	remaining: 36.6s
1295:	total: 1m 7s	remaining: 36.6s
1296:	total: 1m 7s	remaining: 36.5s
1297:	total: 1m 7s	remaining: 36.5s
1298:	total: 1m 7s	remaining: 36.4s
1299:	total: 1m 7s	remaining: 36.4s
1300:	total: 1m 7s	remaining: 36.4s
1301:	total: 1m 7s	remaining: 36.3s
1302:	total: 1m 7s	remaining: 36.3s
1303:	total: 1m 7s	remaining: 36.2s
1304:	total: 1m 7s	remaining: 36.1s
1305:	total: 1m 7s	remaining: 36.1s
1306:	total: 1m 7s	remaining: 36s
1307:	total: 1m 8s	remaining: 36s
1308:	total: 1m 8s	remaining: 35.9s
1309:	total: 1m 8s	remaining: 35.9s
1310:	total: 1m 8s	remaining: 35.8s
1311:	total: 1m 8s	remaining: 35.8s
1312:	total: 1m 8s	remaining: 35.7s
1313:	total: 1m 8s	remaining: 35.7s
1314:	total: 1m 8s	remaining: 35.7s
1315:	total: 1m 8s	remaining: 35.6s
1316:	total: 1m 8s	remaining: 35.5s
1317:	total: 1m 8s	remaining: 35.5s
1318:	total: 1m 8s	remaining: 35.4s
1319:	total: 1m 8s	remaining: 35.4s
1320:	total: 1m 8s	remaining: 35.4s
1321:	total: 1m 8s	remaining: 35.3s
1322:	total: 1m 8s	remaining: 35.3s
1323:	total: 1m 8s	remaining: 35.2s
1324:	total: 1m 9s	remaining: 35.2s
1325:	total: 1m 9s	remaining: 35.1s
1326:	total: 1m 9s	remaining: 35.1s
1327:	total: 1m 9s	remaining: 35s
1328:	total: 1m 9s	remaining: 35s
1329:	total: 1m 9s	remaining: 34.9s
1330:	total: 1m 9s	remaining: 34.8s
1331:	total: 1m 9s	remaining: 34.8s
1332:	total: 1m 9s	remaining: 34.7s
1333:	total: 1m 9s	remaining: 34.7s
1334:	total: 1m 9s	remaining: 34.6s
1335:	total: 1m 9s	remaining: 34.6s
1336:	total: 1m 9s	remaining: 34.5s
1337:	total: 1m 9s	remaining: 34.5s
1338:	total: 1m 9s	remaining: 34.4s
1339:	total: 1m 9s	remaining: 34.4s
1340:	total: 1m 9s	remaining: 34.3s
1341:	total: 1m 9s	remaining: 34.3s
1342:	total: 1m 9s	remaining: 34.2s
1343:	total: 1m 10s	remaining: 34.2s
1344:	total: 1m 10s	remaining: 34.1s
1345:	total: 1m 10s	remaining: 34.1s
1346:	total: 1m 10s	remaining: 34s
1347:	total: 1m 10s	remaining: 34s
1348:	total: 1m 10s	remaining: 33.9s
1349:	total: 1m 10s	remaining: 33.9s
1350:	total: 1m 10s	remaining: 33.8s
1351:	total: 1m 10s	remaining: 33.8s
1352:	total: 1m 10s	remaining: 33.7s
1353:	total: 1m 10s	remaining: 33.7s
1354:	total: 1m 10s	remaining: 33.6s
1355:	total: 1m 10s	remaining: 33.6s
1356:	total: 1m 10s	remaining: 33.5s
1357:	total: 1m 10s	remaining: 33.5s
1358:	total: 1m 10s	remaining: 33.4s
1359:	total: 1m 10s	remaining: 33.4s
1360:	total: 1m 10s	remaining: 33.3s
1361:	total: 1m 11s	remaining: 33.3s
1362:	total: 1m 11s	remaining: 33.2s
1363:	total: 1m 11s	remaining: 33.2s
1364:	total: 1m 11s	remaining: 33.1s
1365:	total: 1m 11s	remaining: 33.1s
1366:	total: 1m 11s	remaining: 33s
1367:	total: 1m 11s	remaining: 33s
1368:	total: 1m 11s	remaining: 32.9s
1369:	total: 1m 11s	remaining: 32.9s
1370:	total: 1m 11s	remaining: 32.8s
1371:	total: 1m 11s	remaining: 32.8s
1372:	total: 1m 11s	remaining: 32.7s
1373:	total: 1m 11s	remaining: 32.7s
1374:	total: 1m 11s	remaining: 32.6s
1375:	total: 1m 11s	remaining: 32.6s
1376:	total: 1m 11s	remaining: 32.5s
1377:	total: 1m 11s	remaining: 32.5s
1378:	total: 1m 11s	remaining: 32.4s
1379:	total: 1m 12s	remaining: 32.4s
1380:	total: 1m 12s	remaining: 32.3s
1381:	total: 1m 12s	remaining: 32.3s
1382:	total: 1m 12s	remaining: 32.2s
1383:	total: 1m 12s	remaining: 32.1s
1384:	total: 1m 12s	remaining: 32.1s
1385:	total: 1m 12s	remaining: 32s
1386:	total: 1m 12s	remaining: 32s
1387:	total: 1m 12s	remaining: 31.9s
1388:	total: 1m 12s	remaining: 31.9s
1389:	total: 1m 12s	remaining: 31.8s
1390:	total: 1m 12s	remaining: 31.8s
1391:	total: 1m 12s	remaining: 31.7s
1392:	total: 1m 12s	remaining: 31.7s
1393:	total: 1m 12s	remaining: 31.6s
1394:	total: 1m 12s	remaining: 31.6s
1395:	total: 1m 12s	remaining: 31.5s
1396:	total: 1m 12s	remaining: 31.5s
1397:	total: 1m 12s	remaining: 31.4s
1398:	total: 1m 13s	remaining: 31.4s
1399:	total: 1m 13s	remaining: 31.3s
1400:	total: 1m 13s	remaining: 31.3s
1401:	total: 1m 13s	remaining: 31.2s
1402:	total: 1m 13s	remaining: 31.2s
1403:	total: 1m 13s	remaining: 31.1s
```

```result
1404:	total: 1m 13s	remaining: 31.1s
1405:	total: 1m 13s	remaining: 31s
1406:	total: 1m 13s	remaining: 31s
1407:	total: 1m 13s	remaining: 30.9s
1408:	total: 1m 13s	remaining: 30.8s
1409:	total: 1m 13s	remaining: 30.8s
1410:	total: 1m 13s	remaining: 30.7s
1411:	total: 1m 13s	remaining: 30.7s
1412:	total: 1m 13s	remaining: 30.6s
1413:	total: 1m 13s	remaining: 30.6s
1414:	total: 1m 13s	remaining: 30.5s
1415:	total: 1m 13s	remaining: 30.5s
1416:	total: 1m 14s	remaining: 30.5s
1417:	total: 1m 14s	remaining: 30.4s
1418:	total: 1m 14s	remaining: 30.4s
1419:	total: 1m 14s	remaining: 30.3s
1420:	total: 1m 14s	remaining: 30.3s
1421:	total: 1m 14s	remaining: 30.2s
1422:	total: 1m 14s	remaining: 30.2s
1423:	total: 1m 14s	remaining: 30.1s
1424:	total: 1m 14s	remaining: 30.1s
1425:	total: 1m 14s	remaining: 30s
1426:	total: 1m 14s	remaining: 29.9s
1427:	total: 1m 14s	remaining: 29.9s
1428:	total: 1m 14s	remaining: 29.8s
1429:	total: 1m 14s	remaining: 29.8s
1430:	total: 1m 14s	remaining: 29.7s
1431:	total: 1m 14s	remaining: 29.7s
1432:	total: 1m 14s	remaining: 29.6s
1433:	total: 1m 14s	remaining: 29.6s
1434:	total: 1m 14s	remaining: 29.5s
1435:	total: 1m 15s	remaining: 29.5s
1436:	total: 1m 15s	remaining: 29.4s
1437:	total: 1m 15s	remaining: 29.4s
1438:	total: 1m 15s	remaining: 29.3s
1439:	total: 1m 15s	remaining: 29.3s
1440:	total: 1m 15s	remaining: 29.2s
1441:	total: 1m 15s	remaining: 29.2s
1442:	total: 1m 15s	remaining: 29.1s
1443:	total: 1m 15s	remaining: 29.1s
1444:	total: 1m 15s	remaining: 29s
1445:	total: 1m 15s	remaining: 29s
1446:	total: 1m 15s	remaining: 28.9s
1447:	total: 1m 15s	remaining: 28.8s
1448:	total: 1m 15s	remaining: 28.8s
1449:	total: 1m 15s	remaining: 28.7s
1450:	total: 1m 15s	remaining: 28.7s
1451:	total: 1m 15s	remaining: 28.6s
1452:	total: 1m 15s	remaining: 28.6s
1453:	total: 1m 15s	remaining: 28.5s
1454:	total: 1m 16s	remaining: 28.5s
1455:	total: 1m 16s	remaining: 28.4s
1456:	total: 1m 16s	remaining: 28.4s
1457:	total: 1m 16s	remaining: 28.3s
1458:	total: 1m 16s	remaining: 28.3s
1459:	total: 1m 16s	remaining: 28.2s
1460:	total: 1m 16s	remaining: 28.2s
1461:	total: 1m 16s	remaining: 28.1s
1462:	total: 1m 16s	remaining: 28s
1463:	total: 1m 16s	remaining: 28s
1464:	total: 1m 16s	remaining: 27.9s
1465:	total: 1m 16s	remaining: 27.9s
1466:	total: 1m 16s	remaining: 27.8s
1467:	total: 1m 16s	remaining: 27.8s
1468:	total: 1m 16s	remaining: 27.7s
1469:	total: 1m 16s	remaining: 27.7s
1470:	total: 1m 16s	remaining: 27.6s
1471:	total: 1m 16s	remaining: 27.6s
1472:	total: 1m 16s	remaining: 27.5s
1473:	total: 1m 16s	remaining: 27.5s
1474:	total: 1m 17s	remaining: 27.4s
1475:	total: 1m 17s	remaining: 27.4s
1476:	total: 1m 17s	remaining: 27.3s
1477:	total: 1m 17s	remaining: 27.3s
1478:	total: 1m 17s	remaining: 27.2s
1479:	total: 1m 17s	remaining: 27.2s
1480:	total: 1m 17s	remaining: 27.1s
1481:	total: 1m 17s	remaining: 27.1s
1482:	total: 1m 17s	remaining: 27s
1483:	total: 1m 17s	remaining: 27s
1484:	total: 1m 17s	remaining: 26.9s
1485:	total: 1m 17s	remaining: 26.8s
1486:	total: 1m 17s	remaining: 26.8s
1487:	total: 1m 17s	remaining: 26.7s
1488:	total: 1m 17s	remaining: 26.7s
1489:	total: 1m 17s	remaining: 26.7s
1490:	total: 1m 17s	remaining: 26.6s
1491:	total: 1m 18s	remaining: 26.6s
1492:	total: 1m 18s	remaining: 26.5s
1493:	total: 1m 18s	remaining: 26.5s
1494:	total: 1m 18s	remaining: 26.4s
1495:	total: 1m 18s	remaining: 26.3s
1496:	total: 1m 18s	remaining: 26.3s
1497:	total: 1m 18s	remaining: 26.2s
1498:	total: 1m 18s	remaining: 26.2s
1499:	total: 1m 18s	remaining: 26.1s
1500:	total: 1m 18s	remaining: 26.1s
1501:	total: 1m 18s	remaining: 26s
1502:	total: 1m 18s	remaining: 26s
1503:	total: 1m 18s	remaining: 25.9s
1504:	total: 1m 18s	remaining: 25.9s
1505:	total: 1m 18s	remaining: 25.8s
1506:	total: 1m 18s	remaining: 25.8s
1507:	total: 1m 18s	remaining: 25.7s
1508:	total: 1m 18s	remaining: 25.7s
1509:	total: 1m 18s	remaining: 25.6s
1510:	total: 1m 18s	remaining: 25.6s
1511:	total: 1m 19s	remaining: 25.5s
1512:	total: 1m 19s	remaining: 25.4s
1513:	total: 1m 19s	remaining: 25.4s
1514:	total: 1m 19s	remaining: 25.3s
1515:	total: 1m 19s	remaining: 25.3s
1516:	total: 1m 19s	remaining: 25.2s
1517:	total: 1m 19s	remaining: 25.2s
1518:	total: 1m 19s	remaining: 25.1s
1519:	total: 1m 19s	remaining: 25.1s
1520:	total: 1m 19s	remaining: 25s
1521:	total: 1m 19s	remaining: 25s
1522:	total: 1m 19s	remaining: 24.9s
1523:	total: 1m 19s	remaining: 24.9s
1524:	total: 1m 19s	remaining: 24.8s
1525:	total: 1m 19s	remaining: 24.8s
1526:	total: 1m 19s	remaining: 24.7s
1527:	total: 1m 19s	remaining: 24.7s
1528:	total: 1m 19s	remaining: 24.6s
1529:	total: 1m 19s	remaining: 24.6s
1530:	total: 1m 19s	remaining: 24.5s
1531:	total: 1m 20s	remaining: 24.5s
1532:	total: 1m 20s	remaining: 24.4s
1533:	total: 1m 20s	remaining: 24.4s
1534:	total: 1m 20s	remaining: 24.3s
1535:	total: 1m 20s	remaining: 24.2s
1536:	total: 1m 20s	remaining: 24.2s
1537:	total: 1m 20s	remaining: 24.1s
1538:	total: 1m 20s	remaining: 24.1s
1539:	total: 1m 20s	remaining: 24s
1540:	total: 1m 20s	remaining: 24s
1541:	total: 1m 20s	remaining: 23.9s
1542:	total: 1m 20s	remaining: 23.9s
1543:	total: 1m 20s	remaining: 23.8s
1544:	total: 1m 20s	remaining: 23.8s
1545:	total: 1m 20s	remaining: 23.7s
1546:	total: 1m 20s	remaining: 23.7s
1547:	total: 1m 20s	remaining: 23.6s
1548:	total: 1m 20s	remaining: 23.6s
1549:	total: 1m 21s	remaining: 23.5s
1550:	total: 1m 21s	remaining: 23.5s
1551:	total: 1m 21s	remaining: 23.4s
1552:	total: 1m 21s	remaining: 23.4s
1553:	total: 1m 21s	remaining: 23.3s
1554:	total: 1m 21s	remaining: 23.3s
1555:	total: 1m 21s	remaining: 23.2s
1556:	total: 1m 21s	remaining: 23.2s
1557:	total: 1m 21s	remaining: 23.1s
1558:	total: 1m 21s	remaining: 23.1s
1559:	total: 1m 21s	remaining: 23s
1560:	total: 1m 21s	remaining: 22.9s
1561:	total: 1m 21s	remaining: 22.9s
1562:	total: 1m 21s	remaining: 22.8s
1563:	total: 1m 21s	remaining: 22.8s
1564:	total: 1m 21s	remaining: 22.7s
1565:	total: 1m 21s	remaining: 22.7s
1566:	total: 1m 21s	remaining: 22.6s
1567:	total: 1m 21s	remaining: 22.6s
1568:	total: 1m 22s	remaining: 22.5s
1569:	total: 1m 22s	remaining: 22.5s
1570:	total: 1m 22s	remaining: 22.4s
1571:	total: 1m 22s	remaining: 22.4s
1572:	total: 1m 22s	remaining: 22.3s
1573:	total: 1m 22s	remaining: 22.3s
1574:	total: 1m 22s	remaining: 22.2s
1575:	total: 1m 22s	remaining: 22.2s
1576:	total: 1m 22s	remaining: 22.1s
1577:	total: 1m 22s	remaining: 22.1s
1578:	total: 1m 22s	remaining: 22s
1579:	total: 1m 22s	remaining: 22s
1580:	total: 1m 22s	remaining: 21.9s
1581:	total: 1m 22s	remaining: 21.9s
1582:	total: 1m 22s	remaining: 21.8s
1583:	total: 1m 22s	remaining: 21.8s
1584:	total: 1m 22s	remaining: 21.7s
1585:	total: 1m 22s	remaining: 21.7s
1586:	total: 1m 23s	remaining: 21.6s
1587:	total: 1m 23s	remaining: 21.6s
1588:	total: 1m 23s	remaining: 21.5s
1589:	total: 1m 23s	remaining: 21.4s
1590:	total: 1m 23s	remaining: 21.4s
1591:	total: 1m 23s	remaining: 21.3s
1592:	total: 1m 23s	remaining: 21.3s
1593:	total: 1m 23s	remaining: 21.2s
1594:	total: 1m 23s	remaining: 21.2s
1595:	total: 1m 23s	remaining: 21.1s
1596:	total: 1m 23s	remaining: 21.1s
1597:	total: 1m 23s	remaining: 21s
1598:	total: 1m 23s	remaining: 21s
1599:	total: 1m 23s	remaining: 20.9s
1600:	total: 1m 23s	remaining: 20.9s
1601:	total: 1m 23s	remaining: 20.8s
1602:	total: 1m 23s	remaining: 20.8s
1603:	total: 1m 23s	remaining: 20.7s
1604:	total: 1m 23s	remaining: 20.7s
1605:	total: 1m 23s	remaining: 20.6s
1606:	total: 1m 24s	remaining: 20.5s
1607:	total: 1m 24s	remaining: 20.5s
1608:	total: 1m 24s	remaining: 20.4s
1609:	total: 1m 24s	remaining: 20.4s
1610:	total: 1m 24s	remaining: 20.3s
1611:	total: 1m 24s	remaining: 20.3s
1612:	total: 1m 24s	remaining: 20.2s
1613:	total: 1m 24s	remaining: 20.2s
1614:	total: 1m 24s	remaining: 20.1s
1615:	total: 1m 24s	remaining: 20.1s
1616:	total: 1m 24s	remaining: 20s
1617:	total: 1m 24s	remaining: 20s
1618:	total: 1m 24s	remaining: 19.9s
1619:	total: 1m 24s	remaining: 19.9s
1620:	total: 1m 24s	remaining: 19.8s
1621:	total: 1m 24s	remaining: 19.8s
1622:	total: 1m 24s	remaining: 19.7s
1623:	total: 1m 24s	remaining: 19.7s
1624:	total: 1m 25s	remaining: 19.6s
1625:	total: 1m 25s	remaining: 19.6s
1626:	total: 1m 25s	remaining: 19.5s
1627:	total: 1m 25s	remaining: 19.5s
```

```result
1628:	total: 1m 25s	remaining: 19.4s
1629:	total: 1m 25s	remaining: 19.4s
1630:	total: 1m 25s	remaining: 19.3s
1631:	total: 1m 25s	remaining: 19.3s
1632:	total: 1m 25s	remaining: 19.2s
1633:	total: 1m 25s	remaining: 19.2s
1634:	total: 1m 25s	remaining: 19.1s
1635:	total: 1m 25s	remaining: 19.1s
1636:	total: 1m 25s	remaining: 19s
1637:	total: 1m 25s	remaining: 18.9s
1638:	total: 1m 25s	remaining: 18.9s
1639:	total: 1m 25s	remaining: 18.8s
1640:	total: 1m 25s	remaining: 18.8s
1641:	total: 1m 25s	remaining: 18.7s
1642:	total: 1m 26s	remaining: 18.7s
1643:	total: 1m 26s	remaining: 18.6s
1644:	total: 1m 26s	remaining: 18.6s
1645:	total: 1m 26s	remaining: 18.5s
1646:	total: 1m 26s	remaining: 18.5s
1647:	total: 1m 26s	remaining: 18.4s
1648:	total: 1m 26s	remaining: 18.4s
1649:	total: 1m 26s	remaining: 18.3s
1650:	total: 1m 26s	remaining: 18.3s
1651:	total: 1m 26s	remaining: 18.2s
1652:	total: 1m 26s	remaining: 18.2s
1653:	total: 1m 26s	remaining: 18.1s
1654:	total: 1m 26s	remaining: 18.1s
1655:	total: 1m 26s	remaining: 18s
1656:	total: 1m 26s	remaining: 18s
1657:	total: 1m 26s	remaining: 17.9s
1658:	total: 1m 26s	remaining: 17.9s
1659:	total: 1m 26s	remaining: 17.8s
1660:	total: 1m 26s	remaining: 17.7s
1661:	total: 1m 27s	remaining: 17.7s
1662:	total: 1m 27s	remaining: 17.6s
1663:	total: 1m 27s	remaining: 17.6s
1664:	total: 1m 27s	remaining: 17.5s
1665:	total: 1m 27s	remaining: 17.5s
1666:	total: 1m 27s	remaining: 17.4s
1667:	total: 1m 27s	remaining: 17.4s
1668:	total: 1m 27s	remaining: 17.3s
1669:	total: 1m 27s	remaining: 17.3s
1670:	total: 1m 27s	remaining: 17.2s
1671:	total: 1m 27s	remaining: 17.2s
1672:	total: 1m 27s	remaining: 17.1s
1673:	total: 1m 27s	remaining: 17.1s
1674:	total: 1m 27s	remaining: 17s
1675:	total: 1m 27s	remaining: 17s
1676:	total: 1m 27s	remaining: 16.9s
1677:	total: 1m 27s	remaining: 16.9s
1678:	total: 1m 27s	remaining: 16.8s
1679:	total: 1m 27s	remaining: 16.8s
1680:	total: 1m 28s	remaining: 16.7s
1681:	total: 1m 28s	remaining: 16.7s
1682:	total: 1m 28s	remaining: 16.6s
1683:	total: 1m 28s	remaining: 16.5s
1684:	total: 1m 28s	remaining: 16.5s
1685:	total: 1m 28s	remaining: 16.4s
1686:	total: 1m 28s	remaining: 16.4s
1687:	total: 1m 28s	remaining: 16.3s
1688:	total: 1m 28s	remaining: 16.3s
1689:	total: 1m 28s	remaining: 16.2s
1690:	total: 1m 28s	remaining: 16.2s
1691:	total: 1m 28s	remaining: 16.1s
1692:	total: 1m 28s	remaining: 16.1s
1693:	total: 1m 28s	remaining: 16s
1694:	total: 1m 28s	remaining: 16s
1695:	total: 1m 28s	remaining: 15.9s
1696:	total: 1m 28s	remaining: 15.9s
1697:	total: 1m 28s	remaining: 15.8s
1698:	total: 1m 29s	remaining: 15.8s
1699:	total: 1m 29s	remaining: 15.7s
1700:	total: 1m 29s	remaining: 15.7s
1701:	total: 1m 29s	remaining: 15.6s
1702:	total: 1m 29s	remaining: 15.6s
1703:	total: 1m 29s	remaining: 15.5s
1704:	total: 1m 29s	remaining: 15.5s
1705:	total: 1m 29s	remaining: 15.4s
1706:	total: 1m 29s	remaining: 15.3s
1707:	total: 1m 29s	remaining: 15.3s
1708:	total: 1m 29s	remaining: 15.2s
1709:	total: 1m 29s	remaining: 15.2s
1710:	total: 1m 29s	remaining: 15.1s
1711:	total: 1m 29s	remaining: 15.1s
1712:	total: 1m 29s	remaining: 15s
1713:	total: 1m 29s	remaining: 15s
1714:	total: 1m 29s	remaining: 14.9s
1715:	total: 1m 29s	remaining: 14.9s
1716:	total: 1m 29s	remaining: 14.8s
1717:	total: 1m 29s	remaining: 14.8s
1718:	total: 1m 30s	remaining: 14.7s
1719:	total: 1m 30s	remaining: 14.7s
1720:	total: 1m 30s	remaining: 14.6s
1721:	total: 1m 30s	remaining: 14.6s
1722:	total: 1m 30s	remaining: 14.5s
1723:	total: 1m 30s	remaining: 14.5s
1724:	total: 1m 30s	remaining: 14.4s
1725:	total: 1m 30s	remaining: 14.3s
1726:	total: 1m 30s	remaining: 14.3s
1727:	total: 1m 30s	remaining: 14.2s
1728:	total: 1m 30s	remaining: 14.2s
1729:	total: 1m 30s	remaining: 14.1s
1730:	total: 1m 30s	remaining: 14.1s
1731:	total: 1m 30s	remaining: 14s
1732:	total: 1m 30s	remaining: 14s
1733:	total: 1m 30s	remaining: 13.9s
1734:	total: 1m 30s	remaining: 13.9s
1735:	total: 1m 30s	remaining: 13.8s
1736:	total: 1m 30s	remaining: 13.8s
1737:	total: 1m 31s	remaining: 13.7s
1738:	total: 1m 31s	remaining: 13.7s
1739:	total: 1m 31s	remaining: 13.6s
1740:	total: 1m 31s	remaining: 13.6s
1741:	total: 1m 31s	remaining: 13.5s
1742:	total: 1m 31s	remaining: 13.5s
1743:	total: 1m 31s	remaining: 13.4s
1744:	total: 1m 31s	remaining: 13.4s
1745:	total: 1m 31s	remaining: 13.3s
1746:	total: 1m 31s	remaining: 13.3s
1747:	total: 1m 31s	remaining: 13.2s
1748:	total: 1m 31s	remaining: 13.2s
1749:	total: 1m 31s	remaining: 13.1s
1750:	total: 1m 31s	remaining: 13.1s
1751:	total: 1m 31s	remaining: 13s
1752:	total: 1m 31s	remaining: 12.9s
1753:	total: 1m 31s	remaining: 12.9s
1754:	total: 1m 32s	remaining: 12.8s
1755:	total: 1m 32s	remaining: 12.8s
1756:	total: 1m 32s	remaining: 12.7s
1757:	total: 1m 32s	remaining: 12.7s
1758:	total: 1m 32s	remaining: 12.6s
1759:	total: 1m 32s	remaining: 12.6s
1760:	total: 1m 32s	remaining: 12.5s
1761:	total: 1m 32s	remaining: 12.5s
1762:	total: 1m 32s	remaining: 12.4s
1763:	total: 1m 32s	remaining: 12.4s
1764:	total: 1m 32s	remaining: 12.3s
1765:	total: 1m 32s	remaining: 12.3s
1766:	total: 1m 32s	remaining: 12.2s
1767:	total: 1m 32s	remaining: 12.2s
1768:	total: 1m 33s	remaining: 12.1s
1769:	total: 1m 33s	remaining: 12.1s
1770:	total: 1m 33s	remaining: 12s
1771:	total: 1m 33s	remaining: 12s
1772:	total: 1m 33s	remaining: 11.9s
1773:	total: 1m 33s	remaining: 11.9s
1774:	total: 1m 33s	remaining: 11.8s
1775:	total: 1m 33s	remaining: 11.8s
1776:	total: 1m 33s	remaining: 11.7s
1777:	total: 1m 33s	remaining: 11.7s
1778:	total: 1m 33s	remaining: 11.6s
1779:	total: 1m 33s	remaining: 11.6s
1780:	total: 1m 33s	remaining: 11.5s
1781:	total: 1m 33s	remaining: 11.5s
1782:	total: 1m 33s	remaining: 11.4s
1783:	total: 1m 33s	remaining: 11.4s
1784:	total: 1m 33s	remaining: 11.3s
1785:	total: 1m 33s	remaining: 11.3s
1786:	total: 1m 33s	remaining: 11.2s
1787:	total: 1m 34s	remaining: 11.1s
1788:	total: 1m 34s	remaining: 11.1s
1789:	total: 1m 34s	remaining: 11s
1790:	total: 1m 34s	remaining: 11s
1791:	total: 1m 34s	remaining: 10.9s
1792:	total: 1m 34s	remaining: 10.9s
1793:	total: 1m 34s	remaining: 10.8s
1794:	total: 1m 34s	remaining: 10.8s
1795:	total: 1m 34s	remaining: 10.7s
1796:	total: 1m 34s	remaining: 10.7s
1797:	total: 1m 34s	remaining: 10.6s
1798:	total: 1m 34s	remaining: 10.6s
1799:	total: 1m 34s	remaining: 10.5s
1800:	total: 1m 34s	remaining: 10.5s
1801:	total: 1m 34s	remaining: 10.4s
1802:	total: 1m 34s	remaining: 10.4s
1803:	total: 1m 34s	remaining: 10.3s
1804:	total: 1m 34s	remaining: 10.3s
1805:	total: 1m 34s	remaining: 10.2s
1806:	total: 1m 35s	remaining: 10.1s
1807:	total: 1m 35s	remaining: 10.1s
1808:	total: 1m 35s	remaining: 10s
1809:	total: 1m 35s	remaining: 9.99s
1810:	total: 1m 35s	remaining: 9.94s
1811:	total: 1m 35s	remaining: 9.88s
1812:	total: 1m 35s	remaining: 9.83s
1813:	total: 1m 35s	remaining: 9.78s
1814:	total: 1m 35s	remaining: 9.73s
1815:	total: 1m 35s	remaining: 9.67s
1816:	total: 1m 35s	remaining: 9.62s
1817:	total: 1m 35s	remaining: 9.57s
1818:	total: 1m 35s	remaining: 9.52s
1819:	total: 1m 35s	remaining: 9.46s
1820:	total: 1m 35s	remaining: 9.41s
1821:	total: 1m 35s	remaining: 9.36s
1822:	total: 1m 35s	remaining: 9.31s
1823:	total: 1m 35s	remaining: 9.25s
1824:	total: 1m 35s	remaining: 9.2s
1825:	total: 1m 36s	remaining: 9.15s
1826:	total: 1m 36s	remaining: 9.1s
1827:	total: 1m 36s	remaining: 9.04s
1828:	total: 1m 36s	remaining: 8.99s
1829:	total: 1m 36s	remaining: 8.94s
1830:	total: 1m 36s	remaining: 8.89s
1831:	total: 1m 36s	remaining: 8.84s
1832:	total: 1m 36s	remaining: 8.78s
1833:	total: 1m 36s	remaining: 8.73s
1834:	total: 1m 36s	remaining: 8.68s
1835:	total: 1m 36s	remaining: 8.62s
1836:	total: 1m 36s	remaining: 8.57s
1837:	total: 1m 36s	remaining: 8.52s
1838:	total: 1m 36s	remaining: 8.47s
1839:	total: 1m 36s	remaining: 8.42s
1840:	total: 1m 36s	remaining: 8.36s
1841:	total: 1m 36s	remaining: 8.31s
1842:	total: 1m 36s	remaining: 8.26s
1843:	total: 1m 37s	remaining: 8.21s
1844:	total: 1m 37s	remaining: 8.15s
1845:	total: 1m 37s	remaining: 8.1s
1846:	total: 1m 37s	remaining: 8.05s
1847:	total: 1m 37s	remaining: 7.99s
1848:	total: 1m 37s	remaining: 7.94s
1849:	total: 1m 37s	remaining: 7.89s
1850:	total: 1m 37s	remaining: 7.83s
1851:	total: 1m 37s	remaining: 7.78s
1852:	total: 1m 37s	remaining: 7.73s
1853:	total: 1m 37s	remaining: 7.68s
```

```result
1854:	total: 1m 37s	remaining: 7.62s
1855:	total: 1m 37s	remaining: 7.57s
1856:	total: 1m 37s	remaining: 7.52s
1857:	total: 1m 37s	remaining: 7.47s
1858:	total: 1m 37s	remaining: 7.42s
1859:	total: 1m 37s	remaining: 7.36s
1860:	total: 1m 37s	remaining: 7.31s
1861:	total: 1m 37s	remaining: 7.26s
1862:	total: 1m 37s	remaining: 7.2s
1863:	total: 1m 38s	remaining: 7.15s
1864:	total: 1m 38s	remaining: 7.1s
1865:	total: 1m 38s	remaining: 7.05s
1866:	total: 1m 38s	remaining: 7s
1867:	total: 1m 38s	remaining: 6.94s
1868:	total: 1m 38s	remaining: 6.89s
1869:	total: 1m 38s	remaining: 6.84s
1870:	total: 1m 38s	remaining: 6.79s
1871:	total: 1m 38s	remaining: 6.73s
1872:	total: 1m 38s	remaining: 6.68s
1873:	total: 1m 38s	remaining: 6.63s
1874:	total: 1m 38s	remaining: 6.58s
1875:	total: 1m 38s	remaining: 6.52s
1876:	total: 1m 38s	remaining: 6.47s
1877:	total: 1m 38s	remaining: 6.42s
1878:	total: 1m 38s	remaining: 6.37s
1879:	total: 1m 38s	remaining: 6.31s
1880:	total: 1m 38s	remaining: 6.26s
1881:	total: 1m 39s	remaining: 6.21s
1882:	total: 1m 39s	remaining: 6.16s
1883:	total: 1m 39s	remaining: 6.1s
1884:	total: 1m 39s	remaining: 6.05s
1885:	total: 1m 39s	remaining: 6s
1886:	total: 1m 39s	remaining: 5.94s
1887:	total: 1m 39s	remaining: 5.89s
1888:	total: 1m 39s	remaining: 5.84s
1889:	total: 1m 39s	remaining: 5.79s
1890:	total: 1m 39s	remaining: 5.73s
1891:	total: 1m 39s	remaining: 5.68s
1892:	total: 1m 39s	remaining: 5.63s
1893:	total: 1m 39s	remaining: 5.58s
1894:	total: 1m 39s	remaining: 5.52s
1895:	total: 1m 39s	remaining: 5.47s
1896:	total: 1m 39s	remaining: 5.42s
1897:	total: 1m 39s	remaining: 5.36s
1898:	total: 1m 39s	remaining: 5.31s
1899:	total: 1m 39s	remaining: 5.26s
1900:	total: 1m 39s	remaining: 5.21s
1901:	total: 1m 40s	remaining: 5.15s
1902:	total: 1m 40s	remaining: 5.1s
1903:	total: 1m 40s	remaining: 5.05s
1904:	total: 1m 40s	remaining: 5s
1905:	total: 1m 40s	remaining: 4.94s
1906:	total: 1m 40s	remaining: 4.89s
1907:	total: 1m 40s	remaining: 4.84s
1908:	total: 1m 40s	remaining: 4.79s
1909:	total: 1m 40s	remaining: 4.73s
1910:	total: 1m 40s	remaining: 4.68s
1911:	total: 1m 40s	remaining: 4.63s
1912:	total: 1m 40s	remaining: 4.58s
1913:	total: 1m 40s	remaining: 4.52s
1914:	total: 1m 40s	remaining: 4.47s
1915:	total: 1m 40s	remaining: 4.42s
1916:	total: 1m 40s	remaining: 4.37s
1917:	total: 1m 40s	remaining: 4.31s
1918:	total: 1m 40s	remaining: 4.26s
1919:	total: 1m 40s	remaining: 4.21s
1920:	total: 1m 41s	remaining: 4.15s
1921:	total: 1m 41s	remaining: 4.1s
1922:	total: 1m 41s	remaining: 4.05s
1923:	total: 1m 41s	remaining: 4s
1924:	total: 1m 41s	remaining: 3.94s
1925:	total: 1m 41s	remaining: 3.89s
1926:	total: 1m 41s	remaining: 3.84s
1927:	total: 1m 41s	remaining: 3.79s
1928:	total: 1m 41s	remaining: 3.73s
1929:	total: 1m 41s	remaining: 3.68s
1930:	total: 1m 41s	remaining: 3.63s
1931:	total: 1m 41s	remaining: 3.58s
1932:	total: 1m 41s	remaining: 3.52s
1933:	total: 1m 41s	remaining: 3.47s
1934:	total: 1m 41s	remaining: 3.42s
1935:	total: 1m 41s	remaining: 3.37s
1936:	total: 1m 41s	remaining: 3.31s
1937:	total: 1m 41s	remaining: 3.26s
1938:	total: 1m 42s	remaining: 3.21s
1939:	total: 1m 42s	remaining: 3.16s
1940:	total: 1m 42s	remaining: 3.1s
1941:	total: 1m 42s	remaining: 3.05s
1942:	total: 1m 42s	remaining: 3s
1943:	total: 1m 42s	remaining: 2.95s
1944:	total: 1m 42s	remaining: 2.89s
1945:	total: 1m 42s	remaining: 2.84s
1946:	total: 1m 42s	remaining: 2.79s
1947:	total: 1m 42s	remaining: 2.73s
1948:	total: 1m 42s	remaining: 2.68s
1949:	total: 1m 42s	remaining: 2.63s
1950:	total: 1m 42s	remaining: 2.58s
1951:	total: 1m 42s	remaining: 2.52s
1952:	total: 1m 42s	remaining: 2.47s
1953:	total: 1m 42s	remaining: 2.42s
1954:	total: 1m 42s	remaining: 2.37s
1955:	total: 1m 42s	remaining: 2.31s
1956:	total: 1m 42s	remaining: 2.26s
1957:	total: 1m 43s	remaining: 2.21s
1958:	total: 1m 43s	remaining: 2.16s
1959:	total: 1m 43s	remaining: 2.1s
1960:	total: 1m 43s	remaining: 2.05s
1961:	total: 1m 43s	remaining: 2s
1962:	total: 1m 43s	remaining: 1.95s
1963:	total: 1m 43s	remaining: 1.89s
1964:	total: 1m 43s	remaining: 1.84s
1965:	total: 1m 43s	remaining: 1.79s
1966:	total: 1m 43s	remaining: 1.74s
1967:	total: 1m 43s	remaining: 1.68s
1968:	total: 1m 43s	remaining: 1.63s
1969:	total: 1m 43s	remaining: 1.58s
1970:	total: 1m 43s	remaining: 1.53s
1971:	total: 1m 43s	remaining: 1.47s
1972:	total: 1m 43s	remaining: 1.42s
1973:	total: 1m 43s	remaining: 1.37s
1974:	total: 1m 43s	remaining: 1.31s
1975:	total: 1m 44s	remaining: 1.26s
1976:	total: 1m 44s	remaining: 1.21s
1977:	total: 1m 44s	remaining: 1.16s
1978:	total: 1m 44s	remaining: 1.1s
1979:	total: 1m 44s	remaining: 1.05s
1980:	total: 1m 44s	remaining: 1s
1981:	total: 1m 44s	remaining: 947ms
1982:	total: 1m 44s	remaining: 895ms
1983:	total: 1m 44s	remaining: 842ms
1984:	total: 1m 44s	remaining: 789ms
1985:	total: 1m 44s	remaining: 737ms
1986:	total: 1m 44s	remaining: 684ms
1987:	total: 1m 44s	remaining: 632ms
1988:	total: 1m 44s	remaining: 579ms
1989:	total: 1m 44s	remaining: 526ms
1990:	total: 1m 44s	remaining: 474ms
1991:	total: 1m 44s	remaining: 421ms
1992:	total: 1m 44s	remaining: 369ms
1993:	total: 1m 44s	remaining: 316ms
1994:	total: 1m 45s	remaining: 263ms
1995:	total: 1m 45s	remaining: 211ms
1996:	total: 1m 45s	remaining: 158ms
1997:	total: 1m 45s	remaining: 105ms
1998:	total: 1m 45s	remaining: 52.6ms
1999:	total: 1m 45s	remaining: 0us
```

```result
<catboost.core.CatBoostClassifier at 0x257d5e7b358>
```

```python
y_pred = cat.predict(X_test)
print(confusion_matrix(y_test,y_pred))
print(accuracy_score(y_test,y_pred))
print(classification_report(y_test,y_pred))
```

```result
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

```result
0.7528697779239354
```

![Output](kb-media:40c9bf03860403fbadc5.png)

```python
rf=RandomForestClassifier()
rf.fit(X_train_res,y_train_res)
```

```result
RandomForestClassifier()
```

```python
y_pred1 = rf.predict(X_test)
print(confusion_matrix(y_test,y_pred1))
print(accuracy_score(y_test,y_pred1))
print(classification_report(y_test,y_pred1))
```

```result
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

```result
0.7622620979192398
```

![Output](kb-media:508ce28fc2310b299b9a.png)

```python
logreg = LogisticRegression()
logreg.fit(X_train_res, y_train_res)
```

```result
LogisticRegression()
```

```python
y_pred2 = logreg.predict(X_test)
print(confusion_matrix(y_test,y_pred2))
print(accuracy_score(y_test,y_pred2))
print(classification_report(y_test,y_pred2))
```

```result
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

```result
0.7722188462126058
```

![Output](kb-media:7e5ff95c65e42063a40b.png)

```python
gnb = GaussianNB()
gnb.fit(X_train_res, y_train_res)
```

```result
GaussianNB()
```

```python
y_pred3 = gnb.predict(X_test)
print(confusion_matrix(y_test,y_pred3))
print(accuracy_score(y_test,y_pred3))
print(classification_report(y_test,y_pred3))
```

```result
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

```result
0.7436259206416201
```

![Output](kb-media:9c9f5f46dcefdd7eaed4.png)

```python
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train_res, y_train_res)
```

```result
KNeighborsClassifier(n_neighbors=3)
```

```python
y_pred4 = knn.predict(X_test)
print(confusion_matrix(y_test,y_pred4))
print(accuracy_score(y_test,y_pred4))
print(classification_report(y_test,y_pred4))
```

```result
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

```result
0.7411106375375787
```

![Output](kb-media:12328e0f2c85f87183e2.png)

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

# K nearest neighbors (earlier version)

[Download k_nearest_neighbors-checkpoint.ipynb](kb-file:18CSC305J-Artificial%20intellegence/1.ML/1.ML%20REGRESSION/2.ML%20CLASSIFICATION/.ipynb_checkpoints/k_nearest_neighbors-checkpoint.ipynb)

# K-Nearest Neighbors (K-NN)

## Importing the libraries

```python
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
```

## Importing the dataset

```python
dataset = pd.read_csv('Social_Network_Ads.csv')
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values
```

## Splitting the dataset into the Training set and Test set

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)
```

```python
print(X_train)
```

```result
[[    44  39000]
 [    32 120000]
 [    38  50000]
 [    32 135000]
 [    52  21000]
 [    53 104000]
 [    39  42000]
 [    38  61000]
 [    36  50000]
 [    36  63000]
 [    35  25000]
 [    35  50000]
 [    42  73000]
 [    47  49000]
 [    59  29000]
 [    49  65000]
 [    45 131000]
 [    31  89000]
 [    46  82000]
 [    47  51000]
 [    26  15000]
 [    60 102000]
 [    38 112000]
 [    40 107000]
 [    42  53000]
 [    35  59000]
 [    48  41000]
 [    48 134000]
 [    38 113000]
 [    29 148000]
 [    26  15000]
 [    60  42000]
 [    24  19000]
 [    42 149000]
 [    46  96000]
 [    28  59000]
 [    39  96000]
 [    28  89000]
 [    41  72000]
 [    45  26000]
 [    33  69000]
 [    20  82000]
 [    31  74000]
 [    42  80000]
 [    35  72000]
 [    33 149000]
 [    40  71000]
 [    51 146000]
 [    46  79000]
 [    35  75000]
 [    38  51000]
 [    36  75000]
 [    37  78000]
 [    38  61000]
 [    60 108000]
 [    20  82000]
 [    57  74000]
 [    42  65000]
 [    26  80000]
 [    46 117000]
 [    35  61000]
 [    21  68000]
 [    28  44000]
 [    41  87000]
 [    37  33000]
 [    27  90000]
 [    39  42000]
 [    28 123000]
 [    31 118000]
 [    25  87000]
 [    35  71000]
 [    37  70000]
 [    35  39000]
 [    47  23000]
 [    35 147000]
 [    48 138000]
 [    26  86000]
 [    25  79000]
 [    52 138000]
 [    51  23000]
 [    35  60000]
 [    33 113000]
 [    30 107000]
 [    48  33000]
 [    41  80000]
 [    48  96000]
 [    31  18000]
 [    31  71000]
 [    43 129000]
 [    59  76000]
 [    18  44000]
 [    36 118000]
 [    42  90000]
 [    47  30000]
 [    26  43000]
 [    40  78000]
 [    46  59000]
 [    59  42000]
 [    46  74000]
 [    35  91000]
 [    28  59000]
 [    40  57000]
 [    59 143000]
 [    57  26000]
 [    52  38000]
 [    47 113000]
 [    53 143000]
 [    35  27000]
 [    58 101000]
 [    45  45000]
 [    23  82000]
 [    46  23000]
 [    42  65000]
 [    28  84000]
 [    38  59000]
 [    26  84000]
 [    29  28000]
 [    37  71000]
 [    22  55000]
 [    48  35000]
 [    49  28000]
 [    38  65000]
 [    27  17000]
 [    46  28000]
 [    48 141000]
 [    26  17000]
 [    35  97000]
 [    39  59000]
 [    24  27000]
 [    32  18000]
 [    46  88000]
 [    35  58000]
 [    56  60000]
 [    47  34000]
 [    40  72000]
 [    32 100000]
 [    19  21000]
 [    25  90000]
 [    35  88000]
 [    28  32000]
 [    50  20000]
 [    40  59000]
 [    50  44000]
 [    35  72000]
 [    40 142000]
 [    46  32000]
 [    39  71000]
 [    20  74000]
 [    29  75000]
 [    31  76000]
 [    47  25000]
 [    40  61000]
 [    34 112000]
 [    38  80000]
 [    42  75000]
 [    47  47000]
 [    39  75000]
 [    19  25000]
 [    37  80000]
 [    36  60000]
 [    41  52000]
 [    36 125000]
 [    48  29000]
 [    36 126000]
 [    51 134000]
 [    27  57000]
 [    38  71000]
 [    39  61000]
 [    22  27000]
 [    33  60000]
 [    48  74000]
 [    58  23000]
 [    53  72000]
 [    32 117000]
 [    54  70000]
 [    30  80000]
 [    58  95000]
 [    26  52000]
 [    45  79000]
 [    24  55000]
 [    40  75000]
 [    33  28000]
 [    44 139000]
 [    22  18000]
 [    33  51000]
 [    43 133000]
 [    24  32000]
 [    46  22000]
 [    35  55000]
 [    54 104000]
 [    48 119000]
 [    35  53000]
 [    37 144000]
 [    23  66000]
 [    37 137000]
 [    31  58000]
 [    33  41000]
 [    45  22000]
 [    30  15000]
 [    19  19000]
 [    49  74000]
 [    39 122000]
 [    35  73000]
 [    39  71000]
 [    24  23000]
 [    41  72000]
 [    29  83000]
 [    54  26000]
 [    35  44000]
 [    37  75000]
 [    29  47000]
 [    31  68000]
 [    42  54000]
 [    30 135000]
 [    52 114000]
 [    50  36000]
 [    56 133000]
 [    29  61000]
 [    30  89000]
 [    26  16000]
 [    33  31000]
 [    41  72000]
 [    36  33000]
 [    55 125000]
 [    48 131000]
 [    41  71000]
 [    30  62000]
 [    37  72000]
 [    41  63000]
 [    58  47000]
 [    30 116000]
 [    20  49000]
 [    37  74000]
 [    41  59000]
 [    49  89000]
 [    28  79000]
 [    53  82000]
 [    40  57000]
 [    60  34000]
 [    35 108000]
 [    21  72000]
 [    38  71000]
 [    39 106000]
 [    37  57000]
 [    26  72000]
 [    35  23000]
 [    54 108000]
 [    30  17000]
 [    39 134000]
 [    29  43000]
 [    33  43000]
 [    35  38000]
 [    41  45000]
 [    41  72000]
 [    39 134000]
 [    27 137000]
 [    21  16000]
 [    26  32000]
 [    31  66000]
 [    39  73000]
 [    41  79000]
 [    47  50000]
 [    41  30000]
 [    37  93000]
 [    60  46000]
 [    25  22000]
 [    28  37000]
 [    38  55000]
 [    36  54000]
 [    20  36000]
 [    56 104000]
 [    40  57000]
 [    42 108000]
 [    20  23000]
 [    40  65000]
 [    47  20000]
 [    18  86000]
 [    35  79000]
 [    57  33000]
 [    34  72000]
 [    49  39000]
 [    27  31000]
 [    19  70000]
 [    39  79000]
 [    26  81000]
 [    25  80000]
 [    28  85000]
 [    55  39000]
 [    50  88000]
 [    49  88000]
 [    52 150000]
 [    35  65000]
 [    42  54000]
 [    34  43000]
 [    37  52000]
 [    48  30000]
 [    29  43000]
 [    36  52000]
 [    27  54000]
 [    26 118000]]
```

```python
print(y_train)
```

```result
[0 1 0 1 1 1 0 0 0 0 0 0 1 1 1 0 1 0 0 1 0 1 0 1 0 0 1 1 1 1 0 1 0 1 0 0 1
 0 0 1 0 0 0 0 0 1 1 1 1 0 0 0 1 0 1 0 1 0 0 1 0 0 0 1 0 0 0 1 1 0 0 1 0 1
 1 1 0 0 1 1 0 0 1 1 0 1 0 0 1 1 0 1 1 1 0 0 0 0 0 1 0 0 1 1 1 1 1 0 1 1 0
 1 0 0 0 0 0 0 0 1 1 0 0 1 0 0 1 0 0 0 1 0 1 1 0 1 0 0 0 0 1 0 0 0 1 1 0 0
 0 0 1 0 1 0 0 0 1 0 0 0 0 1 1 1 0 0 0 0 0 0 1 1 1 1 1 0 1 0 0 0 0 0 1 0 0
 0 0 0 0 1 1 0 1 0 1 0 0 1 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 1 1 0 0 0 0 0
 0 1 1 0 0 0 0 1 0 0 0 0 1 0 1 0 1 0 0 0 1 0 0 0 1 0 1 0 0 0 0 0 1 1 0 0 0
 0 0 1 0 1 1 0 0 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 1
 0 0 0 0]
```

```python
print(X_test)
```

```result
[[    30  87000]
 [    38  50000]
 [    35  75000]
 [    30  79000]
 [    35  50000]
 [    27  20000]
 [    31  15000]
 [    36 144000]
 [    18  68000]
 [    47  43000]
 [    30  49000]
 [    28  55000]
 [    37  55000]
 [    39  77000]
 [    20  86000]
 [    32 117000]
 [    37  77000]
 [    19  85000]
 [    55 130000]
 [    35  22000]
 [    35  47000]
 [    47 144000]
 [    41  51000]
 [    47 105000]
 [    23  28000]
 [    49 141000]
 [    28  87000]
 [    29  80000]
 [    37  62000]
 [    32  86000]
 [    21  88000]
 [    37  79000]
 [    57  60000]
 [    37  53000]
 [    24  58000]
 [    18  52000]
 [    22  81000]
 [    34  43000]
 [    31  34000]
 [    49  36000]
 [    27  88000]
 [    41  52000]
 [    27  84000]
 [    35  20000]
 [    43 112000]
 [    27  58000]
 [    37  80000]
 [    52  90000]
 [    26  30000]
 [    49  86000]
 [    57 122000]
 [    34  25000]
 [    35  57000]
 [    34 115000]
 [    59  88000]
 [    45  32000]
 [    29  83000]
 [    26  80000]
 [    49  28000]
 [    23  20000]
 [    32  18000]
 [    60  42000]
 [    19  76000]
 [    36  99000]
 [    19  26000]
 [    60  83000]
 [    24  89000]
 [    27  58000]
 [    40  47000]
 [    42  70000]
 [    32 150000]
 [    35  77000]
 [    22  63000]
 [    45  22000]
 [    27  89000]
 [    18  82000]
 [    42  79000]
 [    40  60000]
 [    53  34000]
 [    47 107000]
 [    58 144000]
 [    59  83000]
 [    24  55000]
 [    26  35000]
 [    58  38000]
 [    42  80000]
 [    40  75000]
 [    59 130000]
 [    46  41000]
 [    41  60000]
 [    42  64000]
 [    37 146000]
 [    23  48000]
 [    25  33000]
 [    24  84000]
 [    27  96000]
 [    23  63000]
 [    48  33000]
 [    48  90000]
 [    42 104000]]
```

```python
print(y_test)
```

```result
[0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0 1 0 1 0 1 0 0 0 0 0 1 1 0 0 0 0
 0 0 1 0 0 0 0 1 0 0 1 0 1 1 0 0 0 1 1 0 0 1 0 0 1 0 1 0 1 0 0 0 0 1 0 0 1
 0 0 0 0 1 1 1 0 0 0 1 1 0 1 1 0 0 1 0 0 0 1 0 1 1 1]
```

## Feature Scaling

```python
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)
```

```python
print(X_train)
```

```result
[[ 0.58164944 -0.88670699]
 [-0.60673761  1.46173768]
 [-0.01254409 -0.5677824 ]
 [-0.60673761  1.89663484]
 [ 1.37390747 -1.40858358]
 [ 1.47293972  0.99784738]
 [ 0.08648817 -0.79972756]
 [-0.01254409 -0.24885782]
 [-0.21060859 -0.5677824 ]
 [-0.21060859 -0.19087153]
 [-0.30964085 -1.29261101]
 [-0.30964085 -0.5677824 ]
 [ 0.38358493  0.09905991]
 [ 0.8787462  -0.59677555]
 [ 2.06713324 -1.17663843]
 [ 1.07681071 -0.13288524]
 [ 0.68068169  1.78066227]
 [-0.70576986  0.56295021]
 [ 0.77971394  0.35999821]
 [ 0.8787462  -0.53878926]
 [-1.20093113 -1.58254245]
 [ 2.1661655   0.93986109]
 [-0.01254409  1.22979253]
 [ 0.18552042  1.08482681]
 [ 0.38358493 -0.48080297]
 [-0.30964085 -0.30684411]
 [ 0.97777845 -0.8287207 ]
 [ 0.97777845  1.8676417 ]
 [-0.01254409  1.25878567]
 [-0.90383437  2.27354572]
 [-1.20093113 -1.58254245]
 [ 2.1661655  -0.79972756]
 [-1.39899564 -1.46656987]
 [ 0.38358493  2.30253886]
 [ 0.77971394  0.76590222]
 [-1.00286662 -0.30684411]
 [ 0.08648817  0.76590222]
 [-1.00286662  0.56295021]
 [ 0.28455268  0.07006676]
 [ 0.68068169 -1.26361786]
 [-0.50770535 -0.01691267]
 [-1.79512465  0.35999821]
 [-0.70576986  0.12805305]
 [ 0.38358493  0.30201192]
 [-0.30964085  0.07006676]
 [-0.50770535  2.30253886]
 [ 0.18552042  0.04107362]
 [ 1.27487521  2.21555943]
 [ 0.77971394  0.27301877]
 [-0.30964085  0.1570462 ]
 [-0.01254409 -0.53878926]
 [-0.21060859  0.1570462 ]
 [-0.11157634  0.24402563]
 [-0.01254409 -0.24885782]
 [ 2.1661655   1.11381995]
 [-1.79512465  0.35999821]
 [ 1.86906873  0.12805305]
 [ 0.38358493 -0.13288524]
 [-1.20093113  0.30201192]
 [ 0.77971394  1.37475825]
 [-0.30964085 -0.24885782]
 [-1.6960924  -0.04590581]
 [-1.00286662 -0.74174127]
 [ 0.28455268  0.50496393]
 [-0.11157634 -1.06066585]
 [-1.10189888  0.59194336]
 [ 0.08648817 -0.79972756]
 [-1.00286662  1.54871711]
 [-0.70576986  1.40375139]
 [-1.29996338  0.50496393]
 [-0.30964085  0.04107362]
 [-0.11157634  0.01208048]
 [-0.30964085 -0.88670699]
 [ 0.8787462  -1.3505973 ]
 [-0.30964085  2.24455257]
 [ 0.97777845  1.98361427]
 [-1.20093113  0.47597078]
 [-1.29996338  0.27301877]
 [ 1.37390747  1.98361427]
 [ 1.27487521 -1.3505973 ]
 [-0.30964085 -0.27785096]
 [-0.50770535  1.25878567]
 [-0.80480212  1.08482681]
 [ 0.97777845 -1.06066585]
 [ 0.28455268  0.30201192]
 [ 0.97777845  0.76590222]
 [-0.70576986 -1.49556302]
 [-0.70576986  0.04107362]
 [ 0.48261718  1.72267598]
 [ 2.06713324  0.18603934]
 [-1.99318916 -0.74174127]
 [-0.21060859  1.40375139]
 [ 0.38358493  0.59194336]
 [ 0.8787462  -1.14764529]
 [-1.20093113 -0.77073441]
 [ 0.18552042  0.24402563]
 [ 0.77971394 -0.30684411]
 [ 2.06713324 -0.79972756]
 [ 0.77971394  0.12805305]
 [-0.30964085  0.6209365 ]
 [-1.00286662 -0.30684411]
 [ 0.18552042 -0.3648304 ]
 [ 2.06713324  2.12857999]
 [ 1.86906873 -1.26361786]
 [ 1.37390747 -0.91570013]
 [ 0.8787462   1.25878567]
 [ 1.47293972  2.12857999]
 [-0.30964085 -1.23462472]
 [ 1.96810099  0.91086794]
 [ 0.68068169 -0.71274813]
 [-1.49802789  0.35999821]
 [ 0.77971394 -1.3505973 ]
 [ 0.38358493 -0.13288524]
 [-1.00286662  0.41798449]
 [-0.01254409 -0.30684411]
 [-1.20093113  0.41798449]
 [-0.90383437 -1.20563157]
 [-0.11157634  0.04107362]
 [-1.59706014 -0.42281668]
 [ 0.97777845 -1.00267957]
 [ 1.07681071 -1.20563157]
 [-0.01254409 -0.13288524]
 [-1.10189888 -1.52455616]
 [ 0.77971394 -1.20563157]
 [ 0.97777845  2.07059371]
 [-1.20093113 -1.52455616]
 [-0.30964085  0.79489537]
 [ 0.08648817 -0.30684411]
 [-1.39899564 -1.23462472]
 [-0.60673761 -1.49556302]
 [ 0.77971394  0.53395707]
 [-0.30964085 -0.33583725]
 [ 1.77003648 -0.27785096]
 [ 0.8787462  -1.03167271]
 [ 0.18552042  0.07006676]
 [-0.60673761  0.8818748 ]
 [-1.89415691 -1.40858358]
 [-1.29996338  0.59194336]
 [-0.30964085  0.53395707]
 [-1.00286662 -1.089659  ]
 [ 1.17584296 -1.43757673]
 [ 0.18552042 -0.30684411]
 [ 1.17584296 -0.74174127]
 [-0.30964085  0.07006676]
 [ 0.18552042  2.09958685]
 [ 0.77971394 -1.089659  ]
 [ 0.08648817  0.04107362]
 [-1.79512465  0.12805305]
 [-0.90383437  0.1570462 ]
 [-0.70576986  0.18603934]
 [ 0.8787462  -1.29261101]
 [ 0.18552042 -0.24885782]
 [-0.4086731   1.22979253]
 [-0.01254409  0.30201192]
 [ 0.38358493  0.1570462 ]
 [ 0.8787462  -0.65476184]
 [ 0.08648817  0.1570462 ]
 [-1.89415691 -1.29261101]
 [-0.11157634  0.30201192]
 [-0.21060859 -0.27785096]
 [ 0.28455268 -0.50979612]
 [-0.21060859  1.6067034 ]
 [ 0.97777845 -1.17663843]
 [-0.21060859  1.63569655]
 [ 1.27487521  1.8676417 ]
 [-1.10189888 -0.3648304 ]
 [-0.01254409  0.04107362]
 [ 0.08648817 -0.24885782]
 [-1.59706014 -1.23462472]
 [-0.50770535 -0.27785096]
 [ 0.97777845  0.12805305]
 [ 1.96810099 -1.3505973 ]
 [ 1.47293972  0.07006676]
 [-0.60673761  1.37475825]
 [ 1.57197197  0.01208048]
 [-0.80480212  0.30201192]
 [ 1.96810099  0.73690908]
 [-1.20093113 -0.50979612]
 [ 0.68068169  0.27301877]
 [-1.39899564 -0.42281668]
 [ 0.18552042  0.1570462 ]
 [-0.50770535 -1.20563157]
 [ 0.58164944  2.01260742]
 [-1.59706014 -1.49556302]
 [-0.50770535 -0.53878926]
 [ 0.48261718  1.83864855]
 [-1.39899564 -1.089659  ]
 [ 0.77971394 -1.37959044]
 [-0.30964085 -0.42281668]
 [ 1.57197197  0.99784738]
 [ 0.97777845  1.43274454]
 [-0.30964085 -0.48080297]
 [-0.11157634  2.15757314]
 [-1.49802789 -0.1038921 ]
 [-0.11157634  1.95462113]
 [-0.70576986 -0.33583725]
 [-0.50770535 -0.8287207 ]
 [ 0.68068169 -1.37959044]
 [-0.80480212 -1.58254245]
 [-1.89415691 -1.46656987]
 [ 1.07681071  0.12805305]
 [ 0.08648817  1.51972397]
 [-0.30964085  0.09905991]
 [ 0.08648817  0.04107362]
 [-1.39899564 -1.3505973 ]
 [ 0.28455268  0.07006676]
 [-0.90383437  0.38899135]
 [ 1.57197197 -1.26361786]
 [-0.30964085 -0.74174127]
 [-0.11157634  0.1570462 ]
 [-0.90383437 -0.65476184]
 [-0.70576986 -0.04590581]
 [ 0.38358493 -0.45180983]
 [-0.80480212  1.89663484]
 [ 1.37390747  1.28777882]
 [ 1.17584296 -0.97368642]
 [ 1.77003648  1.83864855]
 [-0.90383437 -0.24885782]
 [-0.80480212  0.56295021]
 [-1.20093113 -1.5535493 ]
 [-0.50770535 -1.11865214]
 [ 0.28455268  0.07006676]
 [-0.21060859 -1.06066585]
 [ 1.67100423  1.6067034 ]
 [ 0.97777845  1.78066227]
 [ 0.28455268  0.04107362]
 [-0.80480212 -0.21986468]
 [-0.11157634  0.07006676]
 [ 0.28455268 -0.19087153]
 [ 1.96810099 -0.65476184]
 [-0.80480212  1.3457651 ]
 [-1.79512465 -0.59677555]
 [-0.11157634  0.12805305]
 [ 0.28455268 -0.30684411]
 [ 1.07681071  0.56295021]
 [-1.00286662  0.27301877]
 [ 1.47293972  0.35999821]
 [ 0.18552042 -0.3648304 ]
 [ 2.1661655  -1.03167271]
 [-0.30964085  1.11381995]
 [-1.6960924   0.07006676]
 [-0.01254409  0.04107362]
 [ 0.08648817  1.05583366]
 [-0.11157634 -0.3648304 ]
 [-1.20093113  0.07006676]
 [-0.30964085 -1.3505973 ]
 [ 1.57197197  1.11381995]
 [-0.80480212 -1.52455616]
 [ 0.08648817  1.8676417 ]
 [-0.90383437 -0.77073441]
 [-0.50770535 -0.77073441]
 [-0.30964085 -0.91570013]
 [ 0.28455268 -0.71274813]
 [ 0.28455268  0.07006676]
 [ 0.08648817  1.8676417 ]
 [-1.10189888  1.95462113]
 [-1.6960924  -1.5535493 ]
 [-1.20093113 -1.089659  ]
 [-0.70576986 -0.1038921 ]
 [ 0.08648817  0.09905991]
 [ 0.28455268  0.27301877]
 [ 0.8787462  -0.5677824 ]
 [ 0.28455268 -1.14764529]
 [-0.11157634  0.67892279]
 [ 2.1661655  -0.68375498]
 [-1.29996338 -1.37959044]
 [-1.00286662 -0.94469328]
 [-0.01254409 -0.42281668]
 [-0.21060859 -0.45180983]
 [-1.79512465 -0.97368642]
 [ 1.77003648  0.99784738]
 [ 0.18552042 -0.3648304 ]
 [ 0.38358493  1.11381995]
 [-1.79512465 -1.3505973 ]
 [ 0.18552042 -0.13288524]
 [ 0.8787462  -1.43757673]
 [-1.99318916  0.47597078]
 [-0.30964085  0.27301877]
 [ 1.86906873 -1.06066585]
 [-0.4086731   0.07006676]
 [ 1.07681071 -0.88670699]
 [-1.10189888 -1.11865214]
 [-1.89415691  0.01208048]
 [ 0.08648817  0.27301877]
 [-1.20093113  0.33100506]
 [-1.29996338  0.30201192]
 [-1.00286662  0.44697764]
 [ 1.67100423 -0.88670699]
 [ 1.17584296  0.53395707]
 [ 1.07681071  0.53395707]
 [ 1.37390747  2.331532  ]
 [-0.30964085 -0.13288524]
 [ 0.38358493 -0.45180983]
 [-0.4086731  -0.77073441]
 [-0.11157634 -0.50979612]
 [ 0.97777845 -1.14764529]
 [-0.90383437 -0.77073441]
 [-0.21060859 -0.50979612]
 [-1.10189888 -0.45180983]
 [-1.20093113  1.40375139]]
```

```python
print(X_test)
```

```result
[[-0.80480212  0.50496393]
 [-0.01254409 -0.5677824 ]
 [-0.30964085  0.1570462 ]
 [-0.80480212  0.27301877]
 [-0.30964085 -0.5677824 ]
 [-1.10189888 -1.43757673]
 [-0.70576986 -1.58254245]
 [-0.21060859  2.15757314]
 [-1.99318916 -0.04590581]
 [ 0.8787462  -0.77073441]
 [-0.80480212 -0.59677555]
 [-1.00286662 -0.42281668]
 [-0.11157634 -0.42281668]
 [ 0.08648817  0.21503249]
 [-1.79512465  0.47597078]
 [-0.60673761  1.37475825]
 [-0.11157634  0.21503249]
 [-1.89415691  0.44697764]
 [ 1.67100423  1.75166912]
 [-0.30964085 -1.37959044]
 [-0.30964085 -0.65476184]
 [ 0.8787462   2.15757314]
 [ 0.28455268 -0.53878926]
 [ 0.8787462   1.02684052]
 [-1.49802789 -1.20563157]
 [ 1.07681071  2.07059371]
 [-1.00286662  0.50496393]
 [-0.90383437  0.30201192]
 [-0.11157634 -0.21986468]
 [-0.60673761  0.47597078]
 [-1.6960924   0.53395707]
 [-0.11157634  0.27301877]
 [ 1.86906873 -0.27785096]
 [-0.11157634 -0.48080297]
 [-1.39899564 -0.33583725]
 [-1.99318916 -0.50979612]
 [-1.59706014  0.33100506]
 [-0.4086731  -0.77073441]
 [-0.70576986 -1.03167271]
 [ 1.07681071 -0.97368642]
 [-1.10189888  0.53395707]
 [ 0.28455268 -0.50979612]
 [-1.10189888  0.41798449]
 [-0.30964085 -1.43757673]
 [ 0.48261718  1.22979253]
 [-1.10189888 -0.33583725]
 [-0.11157634  0.30201192]
 [ 1.37390747  0.59194336]
 [-1.20093113 -1.14764529]
 [ 1.07681071  0.47597078]
 [ 1.86906873  1.51972397]
 [-0.4086731  -1.29261101]
 [-0.30964085 -0.3648304 ]
 [-0.4086731   1.31677196]
 [ 2.06713324  0.53395707]
 [ 0.68068169 -1.089659  ]
 [-0.90383437  0.38899135]
 [-1.20093113  0.30201192]
 [ 1.07681071 -1.20563157]
 [-1.49802789 -1.43757673]
 [-0.60673761 -1.49556302]
 [ 2.1661655  -0.79972756]
 [-1.89415691  0.18603934]
 [-0.21060859  0.85288166]
 [-1.89415691 -1.26361786]
 [ 2.1661655   0.38899135]
 [-1.39899564  0.56295021]
 [-1.10189888 -0.33583725]
 [ 0.18552042 -0.65476184]
 [ 0.38358493  0.01208048]
 [-0.60673761  2.331532  ]
 [-0.30964085  0.21503249]
 [-1.59706014 -0.19087153]
 [ 0.68068169 -1.37959044]
 [-1.10189888  0.56295021]
 [-1.99318916  0.35999821]
 [ 0.38358493  0.27301877]
 [ 0.18552042 -0.27785096]
 [ 1.47293972 -1.03167271]
 [ 0.8787462   1.08482681]
 [ 1.96810099  2.15757314]
 [ 2.06713324  0.38899135]
 [-1.39899564 -0.42281668]
 [-1.20093113 -1.00267957]
 [ 1.96810099 -0.91570013]
 [ 0.38358493  0.30201192]
 [ 0.18552042  0.1570462 ]
 [ 2.06713324  1.75166912]
 [ 0.77971394 -0.8287207 ]
 [ 0.28455268 -0.27785096]
 [ 0.38358493 -0.16187839]
 [-0.11157634  2.21555943]
 [-1.49802789 -0.62576869]
 [-1.29996338 -1.06066585]
 [-1.39899564  0.41798449]
 [-1.10189888  0.76590222]
 [-1.49802789 -0.19087153]
 [ 0.97777845 -1.06066585]
 [ 0.97777845  0.59194336]
 [ 0.38358493  0.99784738]]
```

## Training the K-NN model on the Training set

```python
from sklearn.neighbors import KNeighborsClassifier
classifier = KNeighborsClassifier(n_neighbors = 5, metric = 'minkowski', p = 2)
classifier.fit(X_train, y_train)
```

```result
KNeighborsClassifier(algorithm='auto', leaf_size=30, metric='minkowski',
                     metric_params=None, n_jobs=None, n_neighbors=5, p=2,
                     weights='uniform')
```

## Predicting a new result

```python
print(classifier.predict(sc.transform([[30,87000]])))
```

```result
[0]
```

## Predicting the Test set results

```python
y_pred = classifier.predict(X_test)
print(np.concatenate((y_pred.reshape(len(y_pred),1), y_test.reshape(len(y_test),1)),1))
```

```result
[[0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 1]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [1 1]
 [0 0]
 [0 0]
 [1 0]
 [1 1]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [1 1]
 [1 1]
 [1 0]
 [0 0]
 [0 0]
 [1 1]
 [0 1]
 [0 0]
 [1 1]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 1]
 [0 0]
 [1 1]
 [1 1]
 [1 1]]
```

## Making the Confusion Matrix

```python
from sklearn.metrics import confusion_matrix, accuracy_score
cm = confusion_matrix(y_test, y_pred)
print(cm)
accuracy_score(y_test, y_pred)
```

```result
[[64  4]
 [ 3 29]]
```

```result
0.93
```

## Visualising the Training set results

```python
from matplotlib.colors import ListedColormap
X_set, y_set = sc.inverse_transform(X_train), y_train
X1, X2 = np.meshgrid(np.arange(start = X_set[:, 0].min() - 10, stop = X_set[:, 0].max() + 10, step = 1),
                     np.arange(start = X_set[:, 1].min() - 1000, stop = X_set[:, 1].max() + 1000, step = 1))
plt.contourf(X1, X2, classifier.predict(sc.transform(np.array([X1.ravel(), X2.ravel()]).T)).reshape(X1.shape),
             alpha = 0.75, cmap = ListedColormap(('red', 'green')))
plt.xlim(X1.min(), X1.max())
plt.ylim(X2.min(), X2.max())
for i, j in enumerate(np.unique(y_set)):
    plt.scatter(X_set[y_set == j, 0], X_set[y_set == j, 1], c = ListedColormap(('red', 'green'))(i), label = j)
plt.title('K-NN (Training set)')
plt.xlabel('Age')
plt.ylabel('Estimated Salary')
plt.legend()
plt.show()
```

```result
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
```

![Output](kb-media:5afd4d9783fc4f0fcfe7.png)

## Visualising the Test set results

```python
from matplotlib.colors import ListedColormap
X_set, y_set = sc.inverse_transform(X_test), y_test
X1, X2 = np.meshgrid(np.arange(start = X_set[:, 0].min() - 10, stop = X_set[:, 0].max() + 10, step = 1),
                     np.arange(start = X_set[:, 1].min() - 1000, stop = X_set[:, 1].max() + 1000, step = 1))
plt.contourf(X1, X2, classifier.predict(sc.transform(np.array([X1.ravel(), X2.ravel()]).T)).reshape(X1.shape),
             alpha = 0.75, cmap = ListedColormap(('red', 'green')))
plt.xlim(X1.min(), X1.max())
plt.ylim(X2.min(), X2.max())
for i, j in enumerate(np.unique(y_set)):
    plt.scatter(X_set[y_set == j, 0], X_set[y_set == j, 1], c = ListedColormap(('red', 'green'))(i), label = j)
plt.title('K-NN (Test set)')
plt.xlabel('Age')
plt.ylabel('Estimated Salary')
plt.legend()
plt.show()
```

```result
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
```

![Output](kb-media:d6bdd893576a2b70159b.png)

# Naive bayes (earlier version)

[Download naive_bayes-checkpoint.ipynb](kb-file:18CSC305J-Artificial%20intellegence/1.ML/1.ML%20REGRESSION/2.ML%20CLASSIFICATION/.ipynb_checkpoints/naive_bayes-checkpoint.ipynb)

# Naive Bayes

## Importing the libraries

```python
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
```

## Importing the dataset

```python
dataset = pd.read_csv('Social_Network_Ads.csv')
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values
```

## Splitting the dataset into the Training set and Test set

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)
```

```python
print(X_train)
```

```result
[[    44  39000]
 [    32 120000]
 [    38  50000]
 [    32 135000]
 [    52  21000]
 [    53 104000]
 [    39  42000]
 [    38  61000]
 [    36  50000]
 [    36  63000]
 [    35  25000]
 [    35  50000]
 [    42  73000]
 [    47  49000]
 [    59  29000]
 [    49  65000]
 [    45 131000]
 [    31  89000]
 [    46  82000]
 [    47  51000]
 [    26  15000]
 [    60 102000]
 [    38 112000]
 [    40 107000]
 [    42  53000]
 [    35  59000]
 [    48  41000]
 [    48 134000]
 [    38 113000]
 [    29 148000]
 [    26  15000]
 [    60  42000]
 [    24  19000]
 [    42 149000]
 [    46  96000]
 [    28  59000]
 [    39  96000]
 [    28  89000]
 [    41  72000]
 [    45  26000]
 [    33  69000]
 [    20  82000]
 [    31  74000]
 [    42  80000]
 [    35  72000]
 [    33 149000]
 [    40  71000]
 [    51 146000]
 [    46  79000]
 [    35  75000]
 [    38  51000]
 [    36  75000]
 [    37  78000]
 [    38  61000]
 [    60 108000]
 [    20  82000]
 [    57  74000]
 [    42  65000]
 [    26  80000]
 [    46 117000]
 [    35  61000]
 [    21  68000]
 [    28  44000]
 [    41  87000]
 [    37  33000]
 [    27  90000]
 [    39  42000]
 [    28 123000]
 [    31 118000]
 [    25  87000]
 [    35  71000]
 [    37  70000]
 [    35  39000]
 [    47  23000]
 [    35 147000]
 [    48 138000]
 [    26  86000]
 [    25  79000]
 [    52 138000]
 [    51  23000]
 [    35  60000]
 [    33 113000]
 [    30 107000]
 [    48  33000]
 [    41  80000]
 [    48  96000]
 [    31  18000]
 [    31  71000]
 [    43 129000]
 [    59  76000]
 [    18  44000]
 [    36 118000]
 [    42  90000]
 [    47  30000]
 [    26  43000]
 [    40  78000]
 [    46  59000]
 [    59  42000]
 [    46  74000]
 [    35  91000]
 [    28  59000]
 [    40  57000]
 [    59 143000]
 [    57  26000]
 [    52  38000]
 [    47 113000]
 [    53 143000]
 [    35  27000]
 [    58 101000]
 [    45  45000]
 [    23  82000]
 [    46  23000]
 [    42  65000]
 [    28  84000]
 [    38  59000]
 [    26  84000]
 [    29  28000]
 [    37  71000]
 [    22  55000]
 [    48  35000]
 [    49  28000]
 [    38  65000]
 [    27  17000]
 [    46  28000]
 [    48 141000]
 [    26  17000]
 [    35  97000]
 [    39  59000]
 [    24  27000]
 [    32  18000]
 [    46  88000]
 [    35  58000]
 [    56  60000]
 [    47  34000]
 [    40  72000]
 [    32 100000]
 [    19  21000]
 [    25  90000]
 [    35  88000]
 [    28  32000]
 [    50  20000]
 [    40  59000]
 [    50  44000]
 [    35  72000]
 [    40 142000]
 [    46  32000]
 [    39  71000]
 [    20  74000]
 [    29  75000]
 [    31  76000]
 [    47  25000]
 [    40  61000]
 [    34 112000]
 [    38  80000]
 [    42  75000]
 [    47  47000]
 [    39  75000]
 [    19  25000]
 [    37  80000]
 [    36  60000]
 [    41  52000]
 [    36 125000]
 [    48  29000]
 [    36 126000]
 [    51 134000]
 [    27  57000]
 [    38  71000]
 [    39  61000]
 [    22  27000]
 [    33  60000]
 [    48  74000]
 [    58  23000]
 [    53  72000]
 [    32 117000]
 [    54  70000]
 [    30  80000]
 [    58  95000]
 [    26  52000]
 [    45  79000]
 [    24  55000]
 [    40  75000]
 [    33  28000]
 [    44 139000]
 [    22  18000]
 [    33  51000]
 [    43 133000]
 [    24  32000]
 [    46  22000]
 [    35  55000]
 [    54 104000]
 [    48 119000]
 [    35  53000]
 [    37 144000]
 [    23  66000]
 [    37 137000]
 [    31  58000]
 [    33  41000]
 [    45  22000]
 [    30  15000]
 [    19  19000]
 [    49  74000]
 [    39 122000]
 [    35  73000]
 [    39  71000]
 [    24  23000]
 [    41  72000]
 [    29  83000]
 [    54  26000]
 [    35  44000]
 [    37  75000]
 [    29  47000]
 [    31  68000]
 [    42  54000]
 [    30 135000]
 [    52 114000]
 [    50  36000]
 [    56 133000]
 [    29  61000]
 [    30  89000]
 [    26  16000]
 [    33  31000]
 [    41  72000]
 [    36  33000]
 [    55 125000]
 [    48 131000]
 [    41  71000]
 [    30  62000]
 [    37  72000]
 [    41  63000]
 [    58  47000]
 [    30 116000]
 [    20  49000]
 [    37  74000]
 [    41  59000]
 [    49  89000]
 [    28  79000]
 [    53  82000]
 [    40  57000]
 [    60  34000]
 [    35 108000]
 [    21  72000]
 [    38  71000]
 [    39 106000]
 [    37  57000]
 [    26  72000]
 [    35  23000]
 [    54 108000]
 [    30  17000]
 [    39 134000]
 [    29  43000]
 [    33  43000]
 [    35  38000]
 [    41  45000]
 [    41  72000]
 [    39 134000]
 [    27 137000]
 [    21  16000]
 [    26  32000]
 [    31  66000]
 [    39  73000]
 [    41  79000]
 [    47  50000]
 [    41  30000]
 [    37  93000]
 [    60  46000]
 [    25  22000]
 [    28  37000]
 [    38  55000]
 [    36  54000]
 [    20  36000]
 [    56 104000]
 [    40  57000]
 [    42 108000]
 [    20  23000]
 [    40  65000]
 [    47  20000]
 [    18  86000]
 [    35  79000]
 [    57  33000]
 [    34  72000]
 [    49  39000]
 [    27  31000]
 [    19  70000]
 [    39  79000]
 [    26  81000]
 [    25  80000]
 [    28  85000]
 [    55  39000]
 [    50  88000]
 [    49  88000]
 [    52 150000]
 [    35  65000]
 [    42  54000]
 [    34  43000]
 [    37  52000]
 [    48  30000]
 [    29  43000]
 [    36  52000]
 [    27  54000]
 [    26 118000]]
```

```python
print(y_train)
```

```result
[0 1 0 1 1 1 0 0 0 0 0 0 1 1 1 0 1 0 0 1 0 1 0 1 0 0 1 1 1 1 0 1 0 1 0 0 1
 0 0 1 0 0 0 0 0 1 1 1 1 0 0 0 1 0 1 0 1 0 0 1 0 0 0 1 0 0 0 1 1 0 0 1 0 1
 1 1 0 0 1 1 0 0 1 1 0 1 0 0 1 1 0 1 1 1 0 0 0 0 0 1 0 0 1 1 1 1 1 0 1 1 0
 1 0 0 0 0 0 0 0 1 1 0 0 1 0 0 1 0 0 0 1 0 1 1 0 1 0 0 0 0 1 0 0 0 1 1 0 0
 0 0 1 0 1 0 0 0 1 0 0 0 0 1 1 1 0 0 0 0 0 0 1 1 1 1 1 0 1 0 0 0 0 0 1 0 0
 0 0 0 0 1 1 0 1 0 1 0 0 1 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 1 1 0 0 0 0 0
 0 1 1 0 0 0 0 1 0 0 0 0 1 0 1 0 1 0 0 0 1 0 0 0 1 0 1 0 0 0 0 0 1 1 0 0 0
 0 0 1 0 1 1 0 0 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 1
 0 0 0 0]
```

```python
print(X_test)
```

```result
[[    30  87000]
 [    38  50000]
 [    35  75000]
 [    30  79000]
 [    35  50000]
 [    27  20000]
 [    31  15000]
 [    36 144000]
 [    18  68000]
 [    47  43000]
 [    30  49000]
 [    28  55000]
 [    37  55000]
 [    39  77000]
 [    20  86000]
 [    32 117000]
 [    37  77000]
 [    19  85000]
 [    55 130000]
 [    35  22000]
 [    35  47000]
 [    47 144000]
 [    41  51000]
 [    47 105000]
 [    23  28000]
 [    49 141000]
 [    28  87000]
 [    29  80000]
 [    37  62000]
 [    32  86000]
 [    21  88000]
 [    37  79000]
 [    57  60000]
 [    37  53000]
 [    24  58000]
 [    18  52000]
 [    22  81000]
 [    34  43000]
 [    31  34000]
 [    49  36000]
 [    27  88000]
 [    41  52000]
 [    27  84000]
 [    35  20000]
 [    43 112000]
 [    27  58000]
 [    37  80000]
 [    52  90000]
 [    26  30000]
 [    49  86000]
 [    57 122000]
 [    34  25000]
 [    35  57000]
 [    34 115000]
 [    59  88000]
 [    45  32000]
 [    29  83000]
 [    26  80000]
 [    49  28000]
 [    23  20000]
 [    32  18000]
 [    60  42000]
 [    19  76000]
 [    36  99000]
 [    19  26000]
 [    60  83000]
 [    24  89000]
 [    27  58000]
 [    40  47000]
 [    42  70000]
 [    32 150000]
 [    35  77000]
 [    22  63000]
 [    45  22000]
 [    27  89000]
 [    18  82000]
 [    42  79000]
 [    40  60000]
 [    53  34000]
 [    47 107000]
 [    58 144000]
 [    59  83000]
 [    24  55000]
 [    26  35000]
 [    58  38000]
 [    42  80000]
 [    40  75000]
 [    59 130000]
 [    46  41000]
 [    41  60000]
 [    42  64000]
 [    37 146000]
 [    23  48000]
 [    25  33000]
 [    24  84000]
 [    27  96000]
 [    23  63000]
 [    48  33000]
 [    48  90000]
 [    42 104000]]
```

```python
print(y_test)
```

```result
[0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0 1 0 1 0 1 0 0 0 0 0 1 1 0 0 0 0
 0 0 1 0 0 0 0 1 0 0 1 0 1 1 0 0 0 1 1 0 0 1 0 0 1 0 1 0 1 0 0 0 0 1 0 0 1
 0 0 0 0 1 1 1 0 0 0 1 1 0 1 1 0 0 1 0 0 0 1 0 1 1 1]
```

## Feature Scaling

```python
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)
```

```python
print(X_train)
```

```result
[[ 0.58164944 -0.88670699]
 [-0.60673761  1.46173768]
 [-0.01254409 -0.5677824 ]
 [-0.60673761  1.89663484]
 [ 1.37390747 -1.40858358]
 [ 1.47293972  0.99784738]
 [ 0.08648817 -0.79972756]
 [-0.01254409 -0.24885782]
 [-0.21060859 -0.5677824 ]
 [-0.21060859 -0.19087153]
 [-0.30964085 -1.29261101]
 [-0.30964085 -0.5677824 ]
 [ 0.38358493  0.09905991]
 [ 0.8787462  -0.59677555]
 [ 2.06713324 -1.17663843]
 [ 1.07681071 -0.13288524]
 [ 0.68068169  1.78066227]
 [-0.70576986  0.56295021]
 [ 0.77971394  0.35999821]
 [ 0.8787462  -0.53878926]
 [-1.20093113 -1.58254245]
 [ 2.1661655   0.93986109]
 [-0.01254409  1.22979253]
 [ 0.18552042  1.08482681]
 [ 0.38358493 -0.48080297]
 [-0.30964085 -0.30684411]
 [ 0.97777845 -0.8287207 ]
 [ 0.97777845  1.8676417 ]
 [-0.01254409  1.25878567]
 [-0.90383437  2.27354572]
 [-1.20093113 -1.58254245]
 [ 2.1661655  -0.79972756]
 [-1.39899564 -1.46656987]
 [ 0.38358493  2.30253886]
 [ 0.77971394  0.76590222]
 [-1.00286662 -0.30684411]
 [ 0.08648817  0.76590222]
 [-1.00286662  0.56295021]
 [ 0.28455268  0.07006676]
 [ 0.68068169 -1.26361786]
 [-0.50770535 -0.01691267]
 [-1.79512465  0.35999821]
 [-0.70576986  0.12805305]
 [ 0.38358493  0.30201192]
 [-0.30964085  0.07006676]
 [-0.50770535  2.30253886]
 [ 0.18552042  0.04107362]
 [ 1.27487521  2.21555943]
 [ 0.77971394  0.27301877]
 [-0.30964085  0.1570462 ]
 [-0.01254409 -0.53878926]
 [-0.21060859  0.1570462 ]
 [-0.11157634  0.24402563]
 [-0.01254409 -0.24885782]
 [ 2.1661655   1.11381995]
 [-1.79512465  0.35999821]
 [ 1.86906873  0.12805305]
 [ 0.38358493 -0.13288524]
 [-1.20093113  0.30201192]
 [ 0.77971394  1.37475825]
 [-0.30964085 -0.24885782]
 [-1.6960924  -0.04590581]
 [-1.00286662 -0.74174127]
 [ 0.28455268  0.50496393]
 [-0.11157634 -1.06066585]
 [-1.10189888  0.59194336]
 [ 0.08648817 -0.79972756]
 [-1.00286662  1.54871711]
 [-0.70576986  1.40375139]
 [-1.29996338  0.50496393]
 [-0.30964085  0.04107362]
 [-0.11157634  0.01208048]
 [-0.30964085 -0.88670699]
 [ 0.8787462  -1.3505973 ]
 [-0.30964085  2.24455257]
 [ 0.97777845  1.98361427]
 [-1.20093113  0.47597078]
 [-1.29996338  0.27301877]
 [ 1.37390747  1.98361427]
 [ 1.27487521 -1.3505973 ]
 [-0.30964085 -0.27785096]
 [-0.50770535  1.25878567]
 [-0.80480212  1.08482681]
 [ 0.97777845 -1.06066585]
 [ 0.28455268  0.30201192]
 [ 0.97777845  0.76590222]
 [-0.70576986 -1.49556302]
 [-0.70576986  0.04107362]
 [ 0.48261718  1.72267598]
 [ 2.06713324  0.18603934]
 [-1.99318916 -0.74174127]
 [-0.21060859  1.40375139]
 [ 0.38358493  0.59194336]
 [ 0.8787462  -1.14764529]
 [-1.20093113 -0.77073441]
 [ 0.18552042  0.24402563]
 [ 0.77971394 -0.30684411]
 [ 2.06713324 -0.79972756]
 [ 0.77971394  0.12805305]
 [-0.30964085  0.6209365 ]
 [-1.00286662 -0.30684411]
 [ 0.18552042 -0.3648304 ]
 [ 2.06713324  2.12857999]
 [ 1.86906873 -1.26361786]
 [ 1.37390747 -0.91570013]
 [ 0.8787462   1.25878567]
 [ 1.47293972  2.12857999]
 [-0.30964085 -1.23462472]
 [ 1.96810099  0.91086794]
 [ 0.68068169 -0.71274813]
 [-1.49802789  0.35999821]
 [ 0.77971394 -1.3505973 ]
 [ 0.38358493 -0.13288524]
 [-1.00286662  0.41798449]
 [-0.01254409 -0.30684411]
 [-1.20093113  0.41798449]
 [-0.90383437 -1.20563157]
 [-0.11157634  0.04107362]
 [-1.59706014 -0.42281668]
 [ 0.97777845 -1.00267957]
 [ 1.07681071 -1.20563157]
 [-0.01254409 -0.13288524]
 [-1.10189888 -1.52455616]
 [ 0.77971394 -1.20563157]
 [ 0.97777845  2.07059371]
 [-1.20093113 -1.52455616]
 [-0.30964085  0.79489537]
 [ 0.08648817 -0.30684411]
 [-1.39899564 -1.23462472]
 [-0.60673761 -1.49556302]
 [ 0.77971394  0.53395707]
 [-0.30964085 -0.33583725]
 [ 1.77003648 -0.27785096]
 [ 0.8787462  -1.03167271]
 [ 0.18552042  0.07006676]
 [-0.60673761  0.8818748 ]
 [-1.89415691 -1.40858358]
 [-1.29996338  0.59194336]
 [-0.30964085  0.53395707]
 [-1.00286662 -1.089659  ]
 [ 1.17584296 -1.43757673]
 [ 0.18552042 -0.30684411]
 [ 1.17584296 -0.74174127]
 [-0.30964085  0.07006676]
 [ 0.18552042  2.09958685]
 [ 0.77971394 -1.089659  ]
 [ 0.08648817  0.04107362]
 [-1.79512465  0.12805305]
 [-0.90383437  0.1570462 ]
 [-0.70576986  0.18603934]
 [ 0.8787462  -1.29261101]
 [ 0.18552042 -0.24885782]
 [-0.4086731   1.22979253]
 [-0.01254409  0.30201192]
 [ 0.38358493  0.1570462 ]
 [ 0.8787462  -0.65476184]
 [ 0.08648817  0.1570462 ]
 [-1.89415691 -1.29261101]
 [-0.11157634  0.30201192]
 [-0.21060859 -0.27785096]
 [ 0.28455268 -0.50979612]
 [-0.21060859  1.6067034 ]
 [ 0.97777845 -1.17663843]
 [-0.21060859  1.63569655]
 [ 1.27487521  1.8676417 ]
 [-1.10189888 -0.3648304 ]
 [-0.01254409  0.04107362]
 [ 0.08648817 -0.24885782]
 [-1.59706014 -1.23462472]
 [-0.50770535 -0.27785096]
 [ 0.97777845  0.12805305]
 [ 1.96810099 -1.3505973 ]
 [ 1.47293972  0.07006676]
 [-0.60673761  1.37475825]
 [ 1.57197197  0.01208048]
 [-0.80480212  0.30201192]
 [ 1.96810099  0.73690908]
 [-1.20093113 -0.50979612]
 [ 0.68068169  0.27301877]
 [-1.39899564 -0.42281668]
 [ 0.18552042  0.1570462 ]
 [-0.50770535 -1.20563157]
 [ 0.58164944  2.01260742]
 [-1.59706014 -1.49556302]
 [-0.50770535 -0.53878926]
 [ 0.48261718  1.83864855]
 [-1.39899564 -1.089659  ]
 [ 0.77971394 -1.37959044]
 [-0.30964085 -0.42281668]
 [ 1.57197197  0.99784738]
 [ 0.97777845  1.43274454]
 [-0.30964085 -0.48080297]
 [-0.11157634  2.15757314]
 [-1.49802789 -0.1038921 ]
 [-0.11157634  1.95462113]
 [-0.70576986 -0.33583725]
 [-0.50770535 -0.8287207 ]
 [ 0.68068169 -1.37959044]
 [-0.80480212 -1.58254245]
 [-1.89415691 -1.46656987]
 [ 1.07681071  0.12805305]
 [ 0.08648817  1.51972397]
 [-0.30964085  0.09905991]
 [ 0.08648817  0.04107362]
 [-1.39899564 -1.3505973 ]
 [ 0.28455268  0.07006676]
 [-0.90383437  0.38899135]
 [ 1.57197197 -1.26361786]
 [-0.30964085 -0.74174127]
 [-0.11157634  0.1570462 ]
 [-0.90383437 -0.65476184]
 [-0.70576986 -0.04590581]
 [ 0.38358493 -0.45180983]
 [-0.80480212  1.89663484]
 [ 1.37390747  1.28777882]
 [ 1.17584296 -0.97368642]
 [ 1.77003648  1.83864855]
 [-0.90383437 -0.24885782]
 [-0.80480212  0.56295021]
 [-1.20093113 -1.5535493 ]
 [-0.50770535 -1.11865214]
 [ 0.28455268  0.07006676]
 [-0.21060859 -1.06066585]
 [ 1.67100423  1.6067034 ]
 [ 0.97777845  1.78066227]
 [ 0.28455268  0.04107362]
 [-0.80480212 -0.21986468]
 [-0.11157634  0.07006676]
 [ 0.28455268 -0.19087153]
 [ 1.96810099 -0.65476184]
 [-0.80480212  1.3457651 ]
 [-1.79512465 -0.59677555]
 [-0.11157634  0.12805305]
 [ 0.28455268 -0.30684411]
 [ 1.07681071  0.56295021]
 [-1.00286662  0.27301877]
 [ 1.47293972  0.35999821]
 [ 0.18552042 -0.3648304 ]
 [ 2.1661655  -1.03167271]
 [-0.30964085  1.11381995]
 [-1.6960924   0.07006676]
 [-0.01254409  0.04107362]
 [ 0.08648817  1.05583366]
 [-0.11157634 -0.3648304 ]
 [-1.20093113  0.07006676]
 [-0.30964085 -1.3505973 ]
 [ 1.57197197  1.11381995]
 [-0.80480212 -1.52455616]
 [ 0.08648817  1.8676417 ]
 [-0.90383437 -0.77073441]
 [-0.50770535 -0.77073441]
 [-0.30964085 -0.91570013]
 [ 0.28455268 -0.71274813]
 [ 0.28455268  0.07006676]
 [ 0.08648817  1.8676417 ]
 [-1.10189888  1.95462113]
 [-1.6960924  -1.5535493 ]
 [-1.20093113 -1.089659  ]
 [-0.70576986 -0.1038921 ]
 [ 0.08648817  0.09905991]
 [ 0.28455268  0.27301877]
 [ 0.8787462  -0.5677824 ]
 [ 0.28455268 -1.14764529]
 [-0.11157634  0.67892279]
 [ 2.1661655  -0.68375498]
 [-1.29996338 -1.37959044]
 [-1.00286662 -0.94469328]
 [-0.01254409 -0.42281668]
 [-0.21060859 -0.45180983]
 [-1.79512465 -0.97368642]
 [ 1.77003648  0.99784738]
 [ 0.18552042 -0.3648304 ]
 [ 0.38358493  1.11381995]
 [-1.79512465 -1.3505973 ]
 [ 0.18552042 -0.13288524]
 [ 0.8787462  -1.43757673]
 [-1.99318916  0.47597078]
 [-0.30964085  0.27301877]
 [ 1.86906873 -1.06066585]
 [-0.4086731   0.07006676]
 [ 1.07681071 -0.88670699]
 [-1.10189888 -1.11865214]
 [-1.89415691  0.01208048]
 [ 0.08648817  0.27301877]
 [-1.20093113  0.33100506]
 [-1.29996338  0.30201192]
 [-1.00286662  0.44697764]
 [ 1.67100423 -0.88670699]
 [ 1.17584296  0.53395707]
 [ 1.07681071  0.53395707]
 [ 1.37390747  2.331532  ]
 [-0.30964085 -0.13288524]
 [ 0.38358493 -0.45180983]
 [-0.4086731  -0.77073441]
 [-0.11157634 -0.50979612]
 [ 0.97777845 -1.14764529]
 [-0.90383437 -0.77073441]
 [-0.21060859 -0.50979612]
 [-1.10189888 -0.45180983]
 [-1.20093113  1.40375139]]
```

```python
print(X_test)
```

```result
[[-0.80480212  0.50496393]
 [-0.01254409 -0.5677824 ]
 [-0.30964085  0.1570462 ]
 [-0.80480212  0.27301877]
 [-0.30964085 -0.5677824 ]
 [-1.10189888 -1.43757673]
 [-0.70576986 -1.58254245]
 [-0.21060859  2.15757314]
 [-1.99318916 -0.04590581]
 [ 0.8787462  -0.77073441]
 [-0.80480212 -0.59677555]
 [-1.00286662 -0.42281668]
 [-0.11157634 -0.42281668]
 [ 0.08648817  0.21503249]
 [-1.79512465  0.47597078]
 [-0.60673761  1.37475825]
 [-0.11157634  0.21503249]
 [-1.89415691  0.44697764]
 [ 1.67100423  1.75166912]
 [-0.30964085 -1.37959044]
 [-0.30964085 -0.65476184]
 [ 0.8787462   2.15757314]
 [ 0.28455268 -0.53878926]
 [ 0.8787462   1.02684052]
 [-1.49802789 -1.20563157]
 [ 1.07681071  2.07059371]
 [-1.00286662  0.50496393]
 [-0.90383437  0.30201192]
 [-0.11157634 -0.21986468]
 [-0.60673761  0.47597078]
 [-1.6960924   0.53395707]
 [-0.11157634  0.27301877]
 [ 1.86906873 -0.27785096]
 [-0.11157634 -0.48080297]
 [-1.39899564 -0.33583725]
 [-1.99318916 -0.50979612]
 [-1.59706014  0.33100506]
 [-0.4086731  -0.77073441]
 [-0.70576986 -1.03167271]
 [ 1.07681071 -0.97368642]
 [-1.10189888  0.53395707]
 [ 0.28455268 -0.50979612]
 [-1.10189888  0.41798449]
 [-0.30964085 -1.43757673]
 [ 0.48261718  1.22979253]
 [-1.10189888 -0.33583725]
 [-0.11157634  0.30201192]
 [ 1.37390747  0.59194336]
 [-1.20093113 -1.14764529]
 [ 1.07681071  0.47597078]
 [ 1.86906873  1.51972397]
 [-0.4086731  -1.29261101]
 [-0.30964085 -0.3648304 ]
 [-0.4086731   1.31677196]
 [ 2.06713324  0.53395707]
 [ 0.68068169 -1.089659  ]
 [-0.90383437  0.38899135]
 [-1.20093113  0.30201192]
 [ 1.07681071 -1.20563157]
 [-1.49802789 -1.43757673]
 [-0.60673761 -1.49556302]
 [ 2.1661655  -0.79972756]
 [-1.89415691  0.18603934]
 [-0.21060859  0.85288166]
 [-1.89415691 -1.26361786]
 [ 2.1661655   0.38899135]
 [-1.39899564  0.56295021]
 [-1.10189888 -0.33583725]
 [ 0.18552042 -0.65476184]
 [ 0.38358493  0.01208048]
 [-0.60673761  2.331532  ]
 [-0.30964085  0.21503249]
 [-1.59706014 -0.19087153]
 [ 0.68068169 -1.37959044]
 [-1.10189888  0.56295021]
 [-1.99318916  0.35999821]
 [ 0.38358493  0.27301877]
 [ 0.18552042 -0.27785096]
 [ 1.47293972 -1.03167271]
 [ 0.8787462   1.08482681]
 [ 1.96810099  2.15757314]
 [ 2.06713324  0.38899135]
 [-1.39899564 -0.42281668]
 [-1.20093113 -1.00267957]
 [ 1.96810099 -0.91570013]
 [ 0.38358493  0.30201192]
 [ 0.18552042  0.1570462 ]
 [ 2.06713324  1.75166912]
 [ 0.77971394 -0.8287207 ]
 [ 0.28455268 -0.27785096]
 [ 0.38358493 -0.16187839]
 [-0.11157634  2.21555943]
 [-1.49802789 -0.62576869]
 [-1.29996338 -1.06066585]
 [-1.39899564  0.41798449]
 [-1.10189888  0.76590222]
 [-1.49802789 -0.19087153]
 [ 0.97777845 -1.06066585]
 [ 0.97777845  0.59194336]
 [ 0.38358493  0.99784738]]
```

## Training the Naive Bayes model on the Training set

```python
from sklearn.naive_bayes import GaussianNB
classifier = GaussianNB()
classifier.fit(X_train, y_train)
```

```result
GaussianNB(priors=None, var_smoothing=1e-09)
```

## Predicting a new result

```python
print(classifier.predict(sc.transform([[30,87000]])))
```

```result
[0]
```

## Predicting the Test set results

```python
y_pred = classifier.predict(X_test)
print(np.concatenate((y_pred.reshape(len(y_pred),1), y_test.reshape(len(y_test),1)),1))
```

```result
[[0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 1]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [1 1]
 [0 0]
 [0 0]
 [1 0]
 [1 1]
 [0 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 1]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [1 1]
 [1 1]
 [1 0]
 [0 0]
 [0 0]
 [1 1]
 [0 1]
 [0 0]
 [1 1]
 [0 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 1]
 [0 0]
 [1 1]
 [1 1]
 [1 1]]
```

## Making the Confusion Matrix

```python
from sklearn.metrics import confusion_matrix, accuracy_score
cm = confusion_matrix(y_test, y_pred)
print(cm)
accuracy_score(y_test, y_pred)
```

```result
[[65  3]
 [ 7 25]]
```

```result
0.9
```

## Visualising the Training set results

```python
from matplotlib.colors import ListedColormap
X_set, y_set = sc.inverse_transform(X_train), y_train
X1, X2 = np.meshgrid(np.arange(start = X_set[:, 0].min() - 10, stop = X_set[:, 0].max() + 10, step = 0.25),
                     np.arange(start = X_set[:, 1].min() - 1000, stop = X_set[:, 1].max() + 1000, step = 0.25))
plt.contourf(X1, X2, classifier.predict(sc.transform(np.array([X1.ravel(), X2.ravel()]).T)).reshape(X1.shape),
             alpha = 0.75, cmap = ListedColormap(('red', 'green')))
plt.xlim(X1.min(), X1.max())
plt.ylim(X2.min(), X2.max())
for i, j in enumerate(np.unique(y_set)):
    plt.scatter(X_set[y_set == j, 0], X_set[y_set == j, 1], c = ListedColormap(('red', 'green'))(i), label = j)
plt.title('Naive Bayes (Training set)')
plt.xlabel('Age')
plt.ylabel('Estimated Salary')
plt.legend()
plt.show()
```

```result
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
```

![Output](kb-media:56ba0dcd4d40bac732ee.png)

## Visualising the Test set results

```python
from matplotlib.colors import ListedColormap
X_set, y_set = sc.inverse_transform(X_test), y_test
X1, X2 = np.meshgrid(np.arange(start = X_set[:, 0].min() - 10, stop = X_set[:, 0].max() + 10, step = 0.25),
                     np.arange(start = X_set[:, 1].min() - 1000, stop = X_set[:, 1].max() + 1000, step = 0.25))
plt.contourf(X1, X2, classifier.predict(sc.transform(np.array([X1.ravel(), X2.ravel()]).T)).reshape(X1.shape),
             alpha = 0.75, cmap = ListedColormap(('red', 'green')))
plt.xlim(X1.min(), X1.max())
plt.ylim(X2.min(), X2.max())
for i, j in enumerate(np.unique(y_set)):
    plt.scatter(X_set[y_set == j, 0], X_set[y_set == j, 1], c = ListedColormap(('red', 'green'))(i), label = j)
plt.title('Naive Bayes (Test set)')
plt.xlabel('Age')
plt.ylabel('Estimated Salary')
plt.legend()
plt.show()
```

```result
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
```

![Output](kb-media:9866c6d54ff2cfc220a0.png)

# Random forest classification (earlier version)

[Download random_forest_classification-checkpoint.ipynb](kb-file:18CSC305J-Artificial%20intellegence/1.ML/1.ML%20REGRESSION/2.ML%20CLASSIFICATION/.ipynb_checkpoints/random_forest_classification-checkpoint.ipynb)

# Random Forest Classification

## Importing the libraries

```python
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
```

## Importing the dataset

```python
dataset = pd.read_csv('Social_Network_Ads.csv')
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values
```

```result title="Error"
---------------------------------------------------------------------------
NameError                                 Traceback (most recent call last)
<ipython-input-1-f66964059c2f> in <module>
----> 1 dataset = pd.read_csv('Social_Network_Ads.csv')
      2 X = dataset.iloc[:, :-1].values
      3 y = dataset.iloc[:, -1].values

NameError: name 'pd' is not defined
```

## Splitting the dataset into the Training set and Test set

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)
```

```python
print(X_train)
```

```result
[[    44  39000]
 [    32 120000]
 [    38  50000]
 [    32 135000]
 [    52  21000]
 [    53 104000]
 [    39  42000]
 [    38  61000]
 [    36  50000]
 [    36  63000]
 [    35  25000]
 [    35  50000]
 [    42  73000]
 [    47  49000]
 [    59  29000]
 [    49  65000]
 [    45 131000]
 [    31  89000]
 [    46  82000]
 [    47  51000]
 [    26  15000]
 [    60 102000]
 [    38 112000]
 [    40 107000]
 [    42  53000]
 [    35  59000]
 [    48  41000]
 [    48 134000]
 [    38 113000]
 [    29 148000]
 [    26  15000]
 [    60  42000]
 [    24  19000]
 [    42 149000]
 [    46  96000]
 [    28  59000]
 [    39  96000]
 [    28  89000]
 [    41  72000]
 [    45  26000]
 [    33  69000]
 [    20  82000]
 [    31  74000]
 [    42  80000]
 [    35  72000]
 [    33 149000]
 [    40  71000]
 [    51 146000]
 [    46  79000]
 [    35  75000]
 [    38  51000]
 [    36  75000]
 [    37  78000]
 [    38  61000]
 [    60 108000]
 [    20  82000]
 [    57  74000]
 [    42  65000]
 [    26  80000]
 [    46 117000]
 [    35  61000]
 [    21  68000]
 [    28  44000]
 [    41  87000]
 [    37  33000]
 [    27  90000]
 [    39  42000]
 [    28 123000]
 [    31 118000]
 [    25  87000]
 [    35  71000]
 [    37  70000]
 [    35  39000]
 [    47  23000]
 [    35 147000]
 [    48 138000]
 [    26  86000]
 [    25  79000]
 [    52 138000]
 [    51  23000]
 [    35  60000]
 [    33 113000]
 [    30 107000]
 [    48  33000]
 [    41  80000]
 [    48  96000]
 [    31  18000]
 [    31  71000]
 [    43 129000]
 [    59  76000]
 [    18  44000]
 [    36 118000]
 [    42  90000]
 [    47  30000]
 [    26  43000]
 [    40  78000]
 [    46  59000]
 [    59  42000]
 [    46  74000]
 [    35  91000]
 [    28  59000]
 [    40  57000]
 [    59 143000]
 [    57  26000]
 [    52  38000]
 [    47 113000]
 [    53 143000]
 [    35  27000]
 [    58 101000]
 [    45  45000]
 [    23  82000]
 [    46  23000]
 [    42  65000]
 [    28  84000]
 [    38  59000]
 [    26  84000]
 [    29  28000]
 [    37  71000]
 [    22  55000]
 [    48  35000]
 [    49  28000]
 [    38  65000]
 [    27  17000]
 [    46  28000]
 [    48 141000]
 [    26  17000]
 [    35  97000]
 [    39  59000]
 [    24  27000]
 [    32  18000]
 [    46  88000]
 [    35  58000]
 [    56  60000]
 [    47  34000]
 [    40  72000]
 [    32 100000]
 [    19  21000]
 [    25  90000]
 [    35  88000]
 [    28  32000]
 [    50  20000]
 [    40  59000]
 [    50  44000]
 [    35  72000]
 [    40 142000]
 [    46  32000]
 [    39  71000]
 [    20  74000]
 [    29  75000]
 [    31  76000]
 [    47  25000]
 [    40  61000]
 [    34 112000]
 [    38  80000]
 [    42  75000]
 [    47  47000]
 [    39  75000]
 [    19  25000]
 [    37  80000]
 [    36  60000]
 [    41  52000]
 [    36 125000]
 [    48  29000]
 [    36 126000]
 [    51 134000]
 [    27  57000]
 [    38  71000]
 [    39  61000]
 [    22  27000]
 [    33  60000]
 [    48  74000]
 [    58  23000]
 [    53  72000]
 [    32 117000]
 [    54  70000]
 [    30  80000]
 [    58  95000]
 [    26  52000]
 [    45  79000]
 [    24  55000]
 [    40  75000]
 [    33  28000]
 [    44 139000]
 [    22  18000]
 [    33  51000]
 [    43 133000]
 [    24  32000]
 [    46  22000]
 [    35  55000]
 [    54 104000]
 [    48 119000]
 [    35  53000]
 [    37 144000]
 [    23  66000]
 [    37 137000]
 [    31  58000]
 [    33  41000]
 [    45  22000]
 [    30  15000]
 [    19  19000]
 [    49  74000]
 [    39 122000]
 [    35  73000]
 [    39  71000]
 [    24  23000]
 [    41  72000]
 [    29  83000]
 [    54  26000]
 [    35  44000]
 [    37  75000]
 [    29  47000]
 [    31  68000]
 [    42  54000]
 [    30 135000]
 [    52 114000]
 [    50  36000]
 [    56 133000]
 [    29  61000]
 [    30  89000]
 [    26  16000]
 [    33  31000]
 [    41  72000]
 [    36  33000]
 [    55 125000]
 [    48 131000]
 [    41  71000]
 [    30  62000]
 [    37  72000]
 [    41  63000]
 [    58  47000]
 [    30 116000]
 [    20  49000]
 [    37  74000]
 [    41  59000]
 [    49  89000]
 [    28  79000]
 [    53  82000]
 [    40  57000]
 [    60  34000]
 [    35 108000]
 [    21  72000]
 [    38  71000]
 [    39 106000]
 [    37  57000]
 [    26  72000]
 [    35  23000]
 [    54 108000]
 [    30  17000]
 [    39 134000]
 [    29  43000]
 [    33  43000]
 [    35  38000]
 [    41  45000]
 [    41  72000]
 [    39 134000]
 [    27 137000]
 [    21  16000]
 [    26  32000]
 [    31  66000]
 [    39  73000]
 [    41  79000]
 [    47  50000]
 [    41  30000]
 [    37  93000]
 [    60  46000]
 [    25  22000]
 [    28  37000]
 [    38  55000]
 [    36  54000]
 [    20  36000]
 [    56 104000]
 [    40  57000]
 [    42 108000]
 [    20  23000]
 [    40  65000]
 [    47  20000]
 [    18  86000]
 [    35  79000]
 [    57  33000]
 [    34  72000]
 [    49  39000]
 [    27  31000]
 [    19  70000]
 [    39  79000]
 [    26  81000]
 [    25  80000]
 [    28  85000]
 [    55  39000]
 [    50  88000]
 [    49  88000]
 [    52 150000]
 [    35  65000]
 [    42  54000]
 [    34  43000]
 [    37  52000]
 [    48  30000]
 [    29  43000]
 [    36  52000]
 [    27  54000]
 [    26 118000]]
```

```python
print(y_train)
```

```result
[0 1 0 1 1 1 0 0 0 0 0 0 1 1 1 0 1 0 0 1 0 1 0 1 0 0 1 1 1 1 0 1 0 1 0 0 1
 0 0 1 0 0 0 0 0 1 1 1 1 0 0 0 1 0 1 0 1 0 0 1 0 0 0 1 0 0 0 1 1 0 0 1 0 1
 1 1 0 0 1 1 0 0 1 1 0 1 0 0 1 1 0 1 1 1 0 0 0 0 0 1 0 0 1 1 1 1 1 0 1 1 0
 1 0 0 0 0 0 0 0 1 1 0 0 1 0 0 1 0 0 0 1 0 1 1 0 1 0 0 0 0 1 0 0 0 1 1 0 0
 0 0 1 0 1 0 0 0 1 0 0 0 0 1 1 1 0 0 0 0 0 0 1 1 1 1 1 0 1 0 0 0 0 0 1 0 0
 0 0 0 0 1 1 0 1 0 1 0 0 1 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 1 1 0 0 0 0 0
 0 1 1 0 0 0 0 1 0 0 0 0 1 0 1 0 1 0 0 0 1 0 0 0 1 0 1 0 0 0 0 0 1 1 0 0 0
 0 0 1 0 1 1 0 0 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 1
 0 0 0 0]
```

```python
print(X_test)
```

```result
[[    30  87000]
 [    38  50000]
 [    35  75000]
 [    30  79000]
 [    35  50000]
 [    27  20000]
 [    31  15000]
 [    36 144000]
 [    18  68000]
 [    47  43000]
 [    30  49000]
 [    28  55000]
 [    37  55000]
 [    39  77000]
 [    20  86000]
 [    32 117000]
 [    37  77000]
 [    19  85000]
 [    55 130000]
 [    35  22000]
 [    35  47000]
 [    47 144000]
 [    41  51000]
 [    47 105000]
 [    23  28000]
 [    49 141000]
 [    28  87000]
 [    29  80000]
 [    37  62000]
 [    32  86000]
 [    21  88000]
 [    37  79000]
 [    57  60000]
 [    37  53000]
 [    24  58000]
 [    18  52000]
 [    22  81000]
 [    34  43000]
 [    31  34000]
 [    49  36000]
 [    27  88000]
 [    41  52000]
 [    27  84000]
 [    35  20000]
 [    43 112000]
 [    27  58000]
 [    37  80000]
 [    52  90000]
 [    26  30000]
 [    49  86000]
 [    57 122000]
 [    34  25000]
 [    35  57000]
 [    34 115000]
 [    59  88000]
 [    45  32000]
 [    29  83000]
 [    26  80000]
 [    49  28000]
 [    23  20000]
 [    32  18000]
 [    60  42000]
 [    19  76000]
 [    36  99000]
 [    19  26000]
 [    60  83000]
 [    24  89000]
 [    27  58000]
 [    40  47000]
 [    42  70000]
 [    32 150000]
 [    35  77000]
 [    22  63000]
 [    45  22000]
 [    27  89000]
 [    18  82000]
 [    42  79000]
 [    40  60000]
 [    53  34000]
 [    47 107000]
 [    58 144000]
 [    59  83000]
 [    24  55000]
 [    26  35000]
 [    58  38000]
 [    42  80000]
 [    40  75000]
 [    59 130000]
 [    46  41000]
 [    41  60000]
 [    42  64000]
 [    37 146000]
 [    23  48000]
 [    25  33000]
 [    24  84000]
 [    27  96000]
 [    23  63000]
 [    48  33000]
 [    48  90000]
 [    42 104000]]
```

```python
print(y_test)
```

```result
[0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0 1 0 1 0 1 0 0 0 0 0 1 1 0 0 0 0
 0 0 1 0 0 0 0 1 0 0 1 0 1 1 0 0 0 1 1 0 0 1 0 0 1 0 1 0 1 0 0 0 0 1 0 0 1
 0 0 0 0 1 1 1 0 0 0 1 1 0 1 1 0 0 1 0 0 0 1 0 1 1 1]
```

## Feature Scaling

```python
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)
```

```python
print(X_train)
```

```result
[[ 0.58164944 -0.88670699]
 [-0.60673761  1.46173768]
 [-0.01254409 -0.5677824 ]
 [-0.60673761  1.89663484]
 [ 1.37390747 -1.40858358]
 [ 1.47293972  0.99784738]
 [ 0.08648817 -0.79972756]
 [-0.01254409 -0.24885782]
 [-0.21060859 -0.5677824 ]
 [-0.21060859 -0.19087153]
 [-0.30964085 -1.29261101]
 [-0.30964085 -0.5677824 ]
 [ 0.38358493  0.09905991]
 [ 0.8787462  -0.59677555]
 [ 2.06713324 -1.17663843]
 [ 1.07681071 -0.13288524]
 [ 0.68068169  1.78066227]
 [-0.70576986  0.56295021]
 [ 0.77971394  0.35999821]
 [ 0.8787462  -0.53878926]
 [-1.20093113 -1.58254245]
 [ 2.1661655   0.93986109]
 [-0.01254409  1.22979253]
 [ 0.18552042  1.08482681]
 [ 0.38358493 -0.48080297]
 [-0.30964085 -0.30684411]
 [ 0.97777845 -0.8287207 ]
 [ 0.97777845  1.8676417 ]
 [-0.01254409  1.25878567]
 [-0.90383437  2.27354572]
 [-1.20093113 -1.58254245]
 [ 2.1661655  -0.79972756]
 [-1.39899564 -1.46656987]
 [ 0.38358493  2.30253886]
 [ 0.77971394  0.76590222]
 [-1.00286662 -0.30684411]
 [ 0.08648817  0.76590222]
 [-1.00286662  0.56295021]
 [ 0.28455268  0.07006676]
 [ 0.68068169 -1.26361786]
 [-0.50770535 -0.01691267]
 [-1.79512465  0.35999821]
 [-0.70576986  0.12805305]
 [ 0.38358493  0.30201192]
 [-0.30964085  0.07006676]
 [-0.50770535  2.30253886]
 [ 0.18552042  0.04107362]
 [ 1.27487521  2.21555943]
 [ 0.77971394  0.27301877]
 [-0.30964085  0.1570462 ]
 [-0.01254409 -0.53878926]
 [-0.21060859  0.1570462 ]
 [-0.11157634  0.24402563]
 [-0.01254409 -0.24885782]
 [ 2.1661655   1.11381995]
 [-1.79512465  0.35999821]
 [ 1.86906873  0.12805305]
 [ 0.38358493 -0.13288524]
 [-1.20093113  0.30201192]
 [ 0.77971394  1.37475825]
 [-0.30964085 -0.24885782]
 [-1.6960924  -0.04590581]
 [-1.00286662 -0.74174127]
 [ 0.28455268  0.50496393]
 [-0.11157634 -1.06066585]
 [-1.10189888  0.59194336]
 [ 0.08648817 -0.79972756]
 [-1.00286662  1.54871711]
 [-0.70576986  1.40375139]
 [-1.29996338  0.50496393]
 [-0.30964085  0.04107362]
 [-0.11157634  0.01208048]
 [-0.30964085 -0.88670699]
 [ 0.8787462  -1.3505973 ]
 [-0.30964085  2.24455257]
 [ 0.97777845  1.98361427]
 [-1.20093113  0.47597078]
 [-1.29996338  0.27301877]
 [ 1.37390747  1.98361427]
 [ 1.27487521 -1.3505973 ]
 [-0.30964085 -0.27785096]
 [-0.50770535  1.25878567]
 [-0.80480212  1.08482681]
 [ 0.97777845 -1.06066585]
 [ 0.28455268  0.30201192]
 [ 0.97777845  0.76590222]
 [-0.70576986 -1.49556302]
 [-0.70576986  0.04107362]
 [ 0.48261718  1.72267598]
 [ 2.06713324  0.18603934]
 [-1.99318916 -0.74174127]
 [-0.21060859  1.40375139]
 [ 0.38358493  0.59194336]
 [ 0.8787462  -1.14764529]
 [-1.20093113 -0.77073441]
 [ 0.18552042  0.24402563]
 [ 0.77971394 -0.30684411]
 [ 2.06713324 -0.79972756]
 [ 0.77971394  0.12805305]
 [-0.30964085  0.6209365 ]
 [-1.00286662 -0.30684411]
 [ 0.18552042 -0.3648304 ]
 [ 2.06713324  2.12857999]
 [ 1.86906873 -1.26361786]
 [ 1.37390747 -0.91570013]
 [ 0.8787462   1.25878567]
 [ 1.47293972  2.12857999]
 [-0.30964085 -1.23462472]
 [ 1.96810099  0.91086794]
 [ 0.68068169 -0.71274813]
 [-1.49802789  0.35999821]
 [ 0.77971394 -1.3505973 ]
 [ 0.38358493 -0.13288524]
 [-1.00286662  0.41798449]
 [-0.01254409 -0.30684411]
 [-1.20093113  0.41798449]
 [-0.90383437 -1.20563157]
 [-0.11157634  0.04107362]
 [-1.59706014 -0.42281668]
 [ 0.97777845 -1.00267957]
 [ 1.07681071 -1.20563157]
 [-0.01254409 -0.13288524]
 [-1.10189888 -1.52455616]
 [ 0.77971394 -1.20563157]
 [ 0.97777845  2.07059371]
 [-1.20093113 -1.52455616]
 [-0.30964085  0.79489537]
 [ 0.08648817 -0.30684411]
 [-1.39899564 -1.23462472]
 [-0.60673761 -1.49556302]
 [ 0.77971394  0.53395707]
 [-0.30964085 -0.33583725]
 [ 1.77003648 -0.27785096]
 [ 0.8787462  -1.03167271]
 [ 0.18552042  0.07006676]
 [-0.60673761  0.8818748 ]
 [-1.89415691 -1.40858358]
 [-1.29996338  0.59194336]
 [-0.30964085  0.53395707]
 [-1.00286662 -1.089659  ]
 [ 1.17584296 -1.43757673]
 [ 0.18552042 -0.30684411]
 [ 1.17584296 -0.74174127]
 [-0.30964085  0.07006676]
 [ 0.18552042  2.09958685]
 [ 0.77971394 -1.089659  ]
 [ 0.08648817  0.04107362]
 [-1.79512465  0.12805305]
 [-0.90383437  0.1570462 ]
 [-0.70576986  0.18603934]
 [ 0.8787462  -1.29261101]
 [ 0.18552042 -0.24885782]
 [-0.4086731   1.22979253]
 [-0.01254409  0.30201192]
 [ 0.38358493  0.1570462 ]
 [ 0.8787462  -0.65476184]
 [ 0.08648817  0.1570462 ]
 [-1.89415691 -1.29261101]
 [-0.11157634  0.30201192]
 [-0.21060859 -0.27785096]
 [ 0.28455268 -0.50979612]
 [-0.21060859  1.6067034 ]
 [ 0.97777845 -1.17663843]
 [-0.21060859  1.63569655]
 [ 1.27487521  1.8676417 ]
 [-1.10189888 -0.3648304 ]
 [-0.01254409  0.04107362]
 [ 0.08648817 -0.24885782]
 [-1.59706014 -1.23462472]
 [-0.50770535 -0.27785096]
 [ 0.97777845  0.12805305]
 [ 1.96810099 -1.3505973 ]
 [ 1.47293972  0.07006676]
 [-0.60673761  1.37475825]
 [ 1.57197197  0.01208048]
 [-0.80480212  0.30201192]
 [ 1.96810099  0.73690908]
 [-1.20093113 -0.50979612]
 [ 0.68068169  0.27301877]
 [-1.39899564 -0.42281668]
 [ 0.18552042  0.1570462 ]
 [-0.50770535 -1.20563157]
 [ 0.58164944  2.01260742]
 [-1.59706014 -1.49556302]
 [-0.50770535 -0.53878926]
 [ 0.48261718  1.83864855]
 [-1.39899564 -1.089659  ]
 [ 0.77971394 -1.37959044]
 [-0.30964085 -0.42281668]
 [ 1.57197197  0.99784738]
 [ 0.97777845  1.43274454]
 [-0.30964085 -0.48080297]
 [-0.11157634  2.15757314]
 [-1.49802789 -0.1038921 ]
 [-0.11157634  1.95462113]
 [-0.70576986 -0.33583725]
 [-0.50770535 -0.8287207 ]
 [ 0.68068169 -1.37959044]
 [-0.80480212 -1.58254245]
 [-1.89415691 -1.46656987]
 [ 1.07681071  0.12805305]
 [ 0.08648817  1.51972397]
 [-0.30964085  0.09905991]
 [ 0.08648817  0.04107362]
 [-1.39899564 -1.3505973 ]
 [ 0.28455268  0.07006676]
 [-0.90383437  0.38899135]
 [ 1.57197197 -1.26361786]
 [-0.30964085 -0.74174127]
 [-0.11157634  0.1570462 ]
 [-0.90383437 -0.65476184]
 [-0.70576986 -0.04590581]
 [ 0.38358493 -0.45180983]
 [-0.80480212  1.89663484]
 [ 1.37390747  1.28777882]
 [ 1.17584296 -0.97368642]
 [ 1.77003648  1.83864855]
 [-0.90383437 -0.24885782]
 [-0.80480212  0.56295021]
 [-1.20093113 -1.5535493 ]
 [-0.50770535 -1.11865214]
 [ 0.28455268  0.07006676]
 [-0.21060859 -1.06066585]
 [ 1.67100423  1.6067034 ]
 [ 0.97777845  1.78066227]
 [ 0.28455268  0.04107362]
 [-0.80480212 -0.21986468]
 [-0.11157634  0.07006676]
 [ 0.28455268 -0.19087153]
 [ 1.96810099 -0.65476184]
 [-0.80480212  1.3457651 ]
 [-1.79512465 -0.59677555]
 [-0.11157634  0.12805305]
 [ 0.28455268 -0.30684411]
 [ 1.07681071  0.56295021]
 [-1.00286662  0.27301877]
 [ 1.47293972  0.35999821]
 [ 0.18552042 -0.3648304 ]
 [ 2.1661655  -1.03167271]
 [-0.30964085  1.11381995]
 [-1.6960924   0.07006676]
 [-0.01254409  0.04107362]
 [ 0.08648817  1.05583366]
 [-0.11157634 -0.3648304 ]
 [-1.20093113  0.07006676]
 [-0.30964085 -1.3505973 ]
 [ 1.57197197  1.11381995]
 [-0.80480212 -1.52455616]
 [ 0.08648817  1.8676417 ]
 [-0.90383437 -0.77073441]
 [-0.50770535 -0.77073441]
 [-0.30964085 -0.91570013]
 [ 0.28455268 -0.71274813]
 [ 0.28455268  0.07006676]
 [ 0.08648817  1.8676417 ]
 [-1.10189888  1.95462113]
 [-1.6960924  -1.5535493 ]
 [-1.20093113 -1.089659  ]
 [-0.70576986 -0.1038921 ]
 [ 0.08648817  0.09905991]
 [ 0.28455268  0.27301877]
 [ 0.8787462  -0.5677824 ]
 [ 0.28455268 -1.14764529]
 [-0.11157634  0.67892279]
 [ 2.1661655  -0.68375498]
 [-1.29996338 -1.37959044]
 [-1.00286662 -0.94469328]
 [-0.01254409 -0.42281668]
 [-0.21060859 -0.45180983]
 [-1.79512465 -0.97368642]
 [ 1.77003648  0.99784738]
 [ 0.18552042 -0.3648304 ]
 [ 0.38358493  1.11381995]
 [-1.79512465 -1.3505973 ]
 [ 0.18552042 -0.13288524]
 [ 0.8787462  -1.43757673]
 [-1.99318916  0.47597078]
 [-0.30964085  0.27301877]
 [ 1.86906873 -1.06066585]
 [-0.4086731   0.07006676]
 [ 1.07681071 -0.88670699]
 [-1.10189888 -1.11865214]
 [-1.89415691  0.01208048]
 [ 0.08648817  0.27301877]
 [-1.20093113  0.33100506]
 [-1.29996338  0.30201192]
 [-1.00286662  0.44697764]
 [ 1.67100423 -0.88670699]
 [ 1.17584296  0.53395707]
 [ 1.07681071  0.53395707]
 [ 1.37390747  2.331532  ]
 [-0.30964085 -0.13288524]
 [ 0.38358493 -0.45180983]
 [-0.4086731  -0.77073441]
 [-0.11157634 -0.50979612]
 [ 0.97777845 -1.14764529]
 [-0.90383437 -0.77073441]
 [-0.21060859 -0.50979612]
 [-1.10189888 -0.45180983]
 [-1.20093113  1.40375139]]
```

```python
print(X_test)
```

```result
[[-0.80480212  0.50496393]
 [-0.01254409 -0.5677824 ]
 [-0.30964085  0.1570462 ]
 [-0.80480212  0.27301877]
 [-0.30964085 -0.5677824 ]
 [-1.10189888 -1.43757673]
 [-0.70576986 -1.58254245]
 [-0.21060859  2.15757314]
 [-1.99318916 -0.04590581]
 [ 0.8787462  -0.77073441]
 [-0.80480212 -0.59677555]
 [-1.00286662 -0.42281668]
 [-0.11157634 -0.42281668]
 [ 0.08648817  0.21503249]
 [-1.79512465  0.47597078]
 [-0.60673761  1.37475825]
 [-0.11157634  0.21503249]
 [-1.89415691  0.44697764]
 [ 1.67100423  1.75166912]
 [-0.30964085 -1.37959044]
 [-0.30964085 -0.65476184]
 [ 0.8787462   2.15757314]
 [ 0.28455268 -0.53878926]
 [ 0.8787462   1.02684052]
 [-1.49802789 -1.20563157]
 [ 1.07681071  2.07059371]
 [-1.00286662  0.50496393]
 [-0.90383437  0.30201192]
 [-0.11157634 -0.21986468]
 [-0.60673761  0.47597078]
 [-1.6960924   0.53395707]
 [-0.11157634  0.27301877]
 [ 1.86906873 -0.27785096]
 [-0.11157634 -0.48080297]
 [-1.39899564 -0.33583725]
 [-1.99318916 -0.50979612]
 [-1.59706014  0.33100506]
 [-0.4086731  -0.77073441]
 [-0.70576986 -1.03167271]
 [ 1.07681071 -0.97368642]
 [-1.10189888  0.53395707]
 [ 0.28455268 -0.50979612]
 [-1.10189888  0.41798449]
 [-0.30964085 -1.43757673]
 [ 0.48261718  1.22979253]
 [-1.10189888 -0.33583725]
 [-0.11157634  0.30201192]
 [ 1.37390747  0.59194336]
 [-1.20093113 -1.14764529]
 [ 1.07681071  0.47597078]
 [ 1.86906873  1.51972397]
 [-0.4086731  -1.29261101]
 [-0.30964085 -0.3648304 ]
 [-0.4086731   1.31677196]
 [ 2.06713324  0.53395707]
 [ 0.68068169 -1.089659  ]
 [-0.90383437  0.38899135]
 [-1.20093113  0.30201192]
 [ 1.07681071 -1.20563157]
 [-1.49802789 -1.43757673]
 [-0.60673761 -1.49556302]
 [ 2.1661655  -0.79972756]
 [-1.89415691  0.18603934]
 [-0.21060859  0.85288166]
 [-1.89415691 -1.26361786]
 [ 2.1661655   0.38899135]
 [-1.39899564  0.56295021]
 [-1.10189888 -0.33583725]
 [ 0.18552042 -0.65476184]
 [ 0.38358493  0.01208048]
 [-0.60673761  2.331532  ]
 [-0.30964085  0.21503249]
 [-1.59706014 -0.19087153]
 [ 0.68068169 -1.37959044]
 [-1.10189888  0.56295021]
 [-1.99318916  0.35999821]
 [ 0.38358493  0.27301877]
 [ 0.18552042 -0.27785096]
 [ 1.47293972 -1.03167271]
 [ 0.8787462   1.08482681]
 [ 1.96810099  2.15757314]
 [ 2.06713324  0.38899135]
 [-1.39899564 -0.42281668]
 [-1.20093113 -1.00267957]
 [ 1.96810099 -0.91570013]
 [ 0.38358493  0.30201192]
 [ 0.18552042  0.1570462 ]
 [ 2.06713324  1.75166912]
 [ 0.77971394 -0.8287207 ]
 [ 0.28455268 -0.27785096]
 [ 0.38358493 -0.16187839]
 [-0.11157634  2.21555943]
 [-1.49802789 -0.62576869]
 [-1.29996338 -1.06066585]
 [-1.39899564  0.41798449]
 [-1.10189888  0.76590222]
 [-1.49802789 -0.19087153]
 [ 0.97777845 -1.06066585]
 [ 0.97777845  0.59194336]
 [ 0.38358493  0.99784738]]
```

## Training the Random Forest Classification model on the Training set

```python
from sklearn.ensemble import RandomForestClassifier
classifier = RandomForestClassifier(n_estimators = 10, criterion = 'entropy', random_state = 0)
classifier.fit(X_train, y_train)
```

```result
RandomForestClassifier(bootstrap=True, ccp_alpha=0.0, class_weight=None,
                       criterion='entropy', max_depth=None, max_features='auto',
                       max_leaf_nodes=None, max_samples=None,
                       min_impurity_decrease=0.0, min_impurity_split=None,
                       min_samples_leaf=1, min_samples_split=2,
                       min_weight_fraction_leaf=0.0, n_estimators=10,
                       n_jobs=None, oob_score=False, random_state=0, verbose=0,
                       warm_start=False)
```

## Predicting a new result

```python
print(classifier.predict(sc.transform([[30,87000]])))
```

```result
[0]
```

## Predicting the Test set results

```python
y_pred = classifier.predict(X_test)
print(np.concatenate((y_pred.reshape(len(y_pred),1), y_test.reshape(len(y_test),1)),1))
```

```result
[[0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 0]
 [1 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [0 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 1]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [1 1]
 [0 0]
 [0 0]
 [1 0]
 [1 1]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 0]
 [1 1]
 [1 1]
 [1 1]
 [1 0]
 [0 0]
 [0 0]
 [1 1]
 [0 1]
 [0 0]
 [1 1]
 [1 1]
 [0 0]
 [0 0]
 [1 1]
 [0 0]
 [0 0]
 [0 0]
 [0 1]
 [0 0]
 [1 1]
 [1 1]
 [1 1]]
```

## Making the Confusion Matrix

```python
from sklearn.metrics import confusion_matrix, accuracy_score
cm = confusion_matrix(y_test, y_pred)
print(cm)
accuracy_score(y_test, y_pred)
```

```result
[[63  5]
 [ 4 28]]
```

```result
0.91
```

## Visualising the Training set results

```python
from matplotlib.colors import ListedColormap
X_set, y_set = sc.inverse_transform(X_train), y_train
X1, X2 = np.meshgrid(np.arange(start = X_set[:, 0].min() - 10, stop = X_set[:, 0].max() + 10, step = 0.25),
                     np.arange(start = X_set[:, 1].min() - 1000, stop = X_set[:, 1].max() + 1000, step = 0.25))
plt.contourf(X1, X2, classifier.predict(sc.transform(np.array([X1.ravel(), X2.ravel()]).T)).reshape(X1.shape),
             alpha = 0.75, cmap = ListedColormap(('red', 'green')))
plt.xlim(X1.min(), X1.max())
plt.ylim(X2.min(), X2.max())
for i, j in enumerate(np.unique(y_set)):
    plt.scatter(X_set[y_set == j, 0], X_set[y_set == j, 1], c = ListedColormap(('red', 'green'))(i), label = j)
plt.title('Random Forest Classification (Training set)')
plt.xlabel('Age')
plt.ylabel('Estimated Salary')
plt.legend()
plt.show()
```

```result
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
```

![Output](kb-media:e21ab1354a09780abb2c.png)

## Visualising the Test set results

```python
from matplotlib.colors import ListedColormap
X_set, y_set = sc.inverse_transform(X_test), y_test
X1, X2 = np.meshgrid(np.arange(start = X_set[:, 0].min() - 10, stop = X_set[:, 0].max() + 10, step = 0.25),
                     np.arange(start = X_set[:, 1].min() - 1000, stop = X_set[:, 1].max() + 1000, step = 0.25))
plt.contourf(X1, X2, classifier.predict(sc.transform(np.array([X1.ravel(), X2.ravel()]).T)).reshape(X1.shape),
             alpha = 0.75, cmap = ListedColormap(('red', 'green')))
plt.xlim(X1.min(), X1.max())
plt.ylim(X2.min(), X2.max())
for i, j in enumerate(np.unique(y_set)):
    plt.scatter(X_set[y_set == j, 0], X_set[y_set == j, 1], c = ListedColormap(('red', 'green'))(i), label = j)
plt.title('Random Forest Classification (Test set)')
plt.xlabel('Age')
plt.ylabel('Estimated Salary')
plt.legend()
plt.show()
```

```result
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
'c' argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with 'x' & 'y'.  Please use a 2-D array with a single row if you really want to specify the same RGB or RGBA value for all points.
```

![Output](kb-media:f5e8e37d5191fa748944.png)

