```python
import pandas as pd 
import numpy as np 
from sklearn.preprocessing import StandardScaler 
from sklearn.linear_model  import Ridge,Lasso,RidgeCV, LassoCV, ElasticNet, ElasticNetCV, LogisticRegression
from sklearn.model_selection import train_test_split
from statsmodels.stats.outliers_influence import variance_inflation_factor 
from sklearn.metrics import accuracy_score, confusion_matrix, roc_curve, roc_auc_score
import matplotlib.pyplot as plt
from pandas_profiling import ProfileReport
import seaborn as sns
import pickle
```

```python
#Reading the data file

df = pd.read_csv("https://raw.githubusercontent.com/plotly/datasets/master/diabetes.csv")
```

```python
df.head()
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Pregnancies</th>
      <th>Glucose</th>
      <th>BloodPressure</th>
      <th>SkinThickness</th>
      <th>Insulin</th>
      <th>BMI</th>
      <th>DiabetesPedigreeFunction</th>
      <th>Age</th>
      <th>Outcome</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>6</td>
      <td>148</td>
      <td>72</td>
      <td>35</td>
      <td>0</td>
      <td>33.6</td>
      <td>0.627</td>
      <td>50</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>85</td>
      <td>66</td>
      <td>29</td>
      <td>0</td>
      <td>26.6</td>
      <td>0.351</td>
      <td>31</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>8</td>
      <td>183</td>
      <td>64</td>
      <td>0</td>
      <td>0</td>
      <td>23.3</td>
      <td>0.672</td>
      <td>32</td>
      <td>1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>89</td>
      <td>66</td>
      <td>23</td>
      <td>94</td>
      <td>28.1</td>
      <td>0.167</td>
      <td>21</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0</td>
      <td>137</td>
      <td>40</td>
      <td>35</td>
      <td>168</td>
      <td>43.1</td>
      <td>2.288</td>
      <td>33</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</div>
</div>

```python
df.describe()
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Pregnancies</th>
      <th>Glucose</th>
      <th>BloodPressure</th>
      <th>SkinThickness</th>
      <th>Insulin</th>
      <th>BMI</th>
      <th>DiabetesPedigreeFunction</th>
      <th>Age</th>
      <th>Outcome</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>count</th>
      <td>768.000000</td>
      <td>768.000000</td>
      <td>768.000000</td>
      <td>768.000000</td>
      <td>768.000000</td>
      <td>768.000000</td>
      <td>768.000000</td>
      <td>768.000000</td>
      <td>768.000000</td>
    </tr>
    <tr>
      <th>mean</th>
      <td>3.845052</td>
      <td>120.894531</td>
      <td>69.105469</td>
      <td>20.536458</td>
      <td>79.799479</td>
      <td>31.992578</td>
      <td>0.471876</td>
      <td>33.240885</td>
      <td>0.348958</td>
    </tr>
    <tr>
      <th>std</th>
      <td>3.369578</td>
      <td>31.972618</td>
      <td>19.355807</td>
      <td>15.952218</td>
      <td>115.244002</td>
      <td>7.884160</td>
      <td>0.331329</td>
      <td>11.760232</td>
      <td>0.476951</td>
    </tr>
    <tr>
      <th>min</th>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>0.078000</td>
      <td>21.000000</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>25%</th>
      <td>1.000000</td>
      <td>99.000000</td>
      <td>62.000000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>27.300000</td>
      <td>0.243750</td>
      <td>24.000000</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>50%</th>
      <td>3.000000</td>
      <td>117.000000</td>
      <td>72.000000</td>
      <td>23.000000</td>
      <td>30.500000</td>
      <td>32.000000</td>
      <td>0.372500</td>
      <td>29.000000</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>75%</th>
      <td>6.000000</td>
      <td>140.250000</td>
      <td>80.000000</td>
      <td>32.000000</td>
      <td>127.250000</td>
      <td>36.600000</td>
      <td>0.626250</td>
      <td>41.000000</td>
      <td>1.000000</td>
    </tr>
    <tr>
      <th>max</th>
      <td>17.000000</td>
      <td>199.000000</td>
      <td>122.000000</td>
      <td>99.000000</td>
      <td>846.000000</td>
      <td>67.100000</td>
      <td>2.420000</td>
      <td>81.000000</td>
      <td>1.000000</td>
    </tr>
  </tbody>
</table>
</div>
</div>

```python
#Generating the ProfileReport

ProfileReport(df)
```

```result
HBox(children=(HTML(value='Summarize dataset'), FloatProgress(value=0.0, max=22.0), HTML(value='')))
```

```result
HBox(children=(HTML(value='Generate report structure'), FloatProgress(value=0.0, max=1.0), HTML(value='')))
```

```result
HBox(children=(HTML(value='Render HTML'), FloatProgress(value=0.0, max=1.0), HTML(value='')))
```

<iframe src="kb-media:41a08d85b5bfbd0302fa.html" title="Embedded report" class="kb-report" loading="lazy"></iframe>

[Open the full report in a new tab](kb-media:41a08d85b5bfbd0302fa.html)

```python
df.columns
```

```result
Index(['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin',
       'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome'],
      dtype='object')
```

```python
df.dtypes
```

```result
Pregnancies                   int64
Glucose                       int64
BloodPressure                 int64
SkinThickness                 int64
Insulin                       int64
BMI                         float64
DiabetesPedigreeFunction    float64
Age                           int64
Outcome                       int64
dtype: object
```

```python
#Replacing the zero's values in the dataset with mean.
```

```python
df['BMI']=df['BMI'].replace(0,df['BMI'].mean())
```

```python
df['Insulin']=df['Insulin'].replace(0,df['Insulin'].mean())
```

```python
df['SkinThickness']=df['SkinThickness'].replace(0,df['SkinThickness'].mean())
```

```python
df['BloodPressure']=df['BloodPressure'].replace(0,df['BloodPressure'].mean())
```

```python
df['Glucose']=df['Glucose'].replace(0,df['Glucose'].mean())
```

```python
#finding outliers
fig,ax=plt.subplots(figsize=(20,20))
sns.boxplot(data=df,ax=ax)
```

```result
<AxesSubplot:>
```

![Output](kb-media:acf33b6cea1a70f3f391.png)

```python
q = df['Pregnancies'].quantile(.98)
df_new = df[df['Pregnancies'] < q]

q = df_new['BMI'].quantile(.99)
df_new = df_new[df_new['BMI']< q]

q = df_new['SkinThickness'].quantile(.99)
df_new = df_new[df_new['SkinThickness']< q]

q = df_new['Insulin'].quantile(.95)
df_new = df_new[df_new['Insulin']< q]

q = df_new['DiabetesPedigreeFunction'].quantile(.99)
df_new = df_new[df_new['DiabetesPedigreeFunction']< q]


q = df_new['Age'].quantile(.99)
df_new = df_new[df_new['Age']< q]
```

```python
def outlier_removal(data):
        def outlier_limits(col):
            Q3, Q1 = np.nanpercentile(col, [75,25])
            IQR= Q3-Q1
            UL= Q3+1.5*IQR
            LL= Q1-1.5*IQR
            return UL, LL

        for column in data.columns:
            if data[column].dtype != 'int64':
                UL, LL= outlier_limits(data[column])
                data[column]= np.where((data[column] > UL) | (data[column] < LL), np.nan, data[column])

        return data
df_new=outlier_removal(df)        
```

```python
fig,ax=plt.subplots(figsize=(20,20))
sns.boxplot(data=df_new,ax=ax)
```

```result
<AxesSubplot:>
```

![Output](kb-media:d9b85691578d1587534b.png)

```python
df_new.describe()
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Pregnancies</th>
      <th>Glucose</th>
      <th>BloodPressure</th>
      <th>SkinThickness</th>
      <th>Insulin</th>
      <th>BMI</th>
      <th>DiabetesPedigreeFunction</th>
      <th>Age</th>
      <th>Outcome</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>count</th>
      <td>674.000000</td>
      <td>674.000000</td>
      <td>674.000000</td>
      <td>674.000000</td>
      <td>674.000000</td>
      <td>674.000000</td>
      <td>674.000000</td>
      <td>674.000000</td>
      <td>674.000000</td>
    </tr>
    <tr>
      <th>mean</th>
      <td>3.602374</td>
      <td>119.217318</td>
      <td>71.994622</td>
      <td>25.721354</td>
      <td>101.061453</td>
      <td>31.904204</td>
      <td>0.447338</td>
      <td>32.454006</td>
      <td>0.327893</td>
    </tr>
    <tr>
      <th>std</th>
      <td>3.011478</td>
      <td>29.272890</td>
      <td>11.891728</td>
      <td>8.507237</td>
      <td>49.005425</td>
      <td>6.384238</td>
      <td>0.285170</td>
      <td>10.964692</td>
      <td>0.469794</td>
    </tr>
    <tr>
      <th>min</th>
      <td>0.000000</td>
      <td>44.000000</td>
      <td>24.000000</td>
      <td>8.000000</td>
      <td>15.000000</td>
      <td>18.200000</td>
      <td>0.078000</td>
      <td>21.000000</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>25%</th>
      <td>1.000000</td>
      <td>99.000000</td>
      <td>64.000000</td>
      <td>20.536458</td>
      <td>79.799479</td>
      <td>27.300000</td>
      <td>0.238000</td>
      <td>24.000000</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>50%</th>
      <td>3.000000</td>
      <td>114.500000</td>
      <td>72.000000</td>
      <td>22.000000</td>
      <td>79.799479</td>
      <td>31.992578</td>
      <td>0.356000</td>
      <td>29.000000</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>75%</th>
      <td>6.000000</td>
      <td>136.000000</td>
      <td>80.000000</td>
      <td>32.000000</td>
      <td>111.500000</td>
      <td>35.800000</td>
      <td>0.600000</td>
      <td>39.000000</td>
      <td>1.000000</td>
    </tr>
    <tr>
      <th>max</th>
      <td>11.000000</td>
      <td>199.000000</td>
      <td>122.000000</td>
      <td>49.000000</td>
      <td>291.000000</td>
      <td>50.000000</td>
      <td>1.476000</td>
      <td>66.000000</td>
      <td>1.000000</td>
    </tr>
  </tbody>
</table>
</div>
</div>

```python
ProfileReport(df_new)
```

```result
HBox(children=(HTML(value='Summarize dataset'), FloatProgress(value=0.0, max=23.0), HTML(value='')))
```

```result
HBox(children=(HTML(value='Generate report structure'), FloatProgress(value=0.0, max=1.0), HTML(value='')))
```

```result
HBox(children=(HTML(value='Render HTML'), FloatProgress(value=0.0, max=1.0), HTML(value='')))
```

<iframe src="kb-media:4fa0752ab07140f84d11.html" title="Embedded report" class="kb-report" loading="lazy"></iframe>

[Open the full report in a new tab](kb-media:4fa0752ab07140f84d11.html)

```python
y=df_new['Outcome']
```

```python
x=df_new.drop(columns=['Outcome'])
```

```python
scalar = StandardScaler()
ProfileReport(pd.DataFrame(scalar.fit_transform(x)))
X_scaled = scalar.fit_transform(x)
```

```python
df_new_scalar = pd.DataFrame(scalar.fit_transform(df_new))
fig ,ax  = plt.subplots(figsize = (20,20))
sns.boxplot(data = df_new_scalar , ax = ax)
```

```result
<AxesSubplot:>
```

![Output](kb-media:f7d8949cb1def365f577.png)

```python
#Finding multicollinearity

def vif_score(x):
    scaler = StandardScaler()
    arr = scaler.fit_transform(x)
    return pd.DataFrame([[x.columns[i], variance_inflation_factor(arr,i)] for i in range(arr.shape[1])], columns=["FEATURE", "VIF_SCORE"])
```

```python
vif_score(x)
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>FEATURE</th>
      <th>VIF_SCORE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Pregnancies</td>
      <td>1.449056</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Glucose</td>
      <td>1.304263</td>
    </tr>
    <tr>
      <th>2</th>
      <td>BloodPressure</td>
      <td>1.262686</td>
    </tr>
    <tr>
      <th>3</th>
      <td>SkinThickness</td>
      <td>1.470049</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Insulin</td>
      <td>1.271017</td>
    </tr>
    <tr>
      <th>5</th>
      <td>BMI</td>
      <td>1.513160</td>
    </tr>
    <tr>
      <th>6</th>
      <td>DiabetesPedigreeFunction</td>
      <td>1.042300</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Age</td>
      <td>1.662728</td>
    </tr>
  </tbody>
</table>
</div>
</div>

```python
x_train, x_test, y_train, y_test = train_test_split(X_scaled , y , test_size = .20 , random_state = 144)
```

```python
x_train
```

```result
array([[-0.86479354,  0.19769063, -1.85094678, ...,  0.21879402,
         1.80609569, -0.40651517],
       [ 2.45830136,  1.22329076,  0.33707068, ...,  0.21879402,
         3.1782269 ,  1.69268475],
       [ 0.13213493,  0.91561072,  1.09446134, ..., -0.47091521,
        -0.90658316, -0.49778473],
       ...,
       [-0.86479354, -0.28092276,  1.17861586, ..., -0.28281269,
        -1.06801036, -0.86286298],
       [ 1.46137289,  0.02675728,  0.50537972, ..., -1.08224839,
        -0.13454002,  2.87918905],
       [-0.86479354, -0.75953616, -0.33616546, ..., -0.73739378,
         2.27283086, -0.95413254]])
```

```python
x_test
```

```result
array([[ 1.32134931e-01, -1.44176079e-01,  4.52611463e-04, ...,
        -4.70915211e-01, -2.50346495e-01,  1.23633694e+00],
       [-1.19710303e+00,  6.76304024e-01, -8.41092564e-01, ...,
        -1.53682948e+00, -8.43415997e-01, -1.04540210e+00],
       [ 2.45830136e+00,  8.13050708e-01,  1.85185200e+00, ...,
         7.36075942e-01, -6.78479508e-01,  1.69268475e+00],
       ...,
       [ 7.96753910e-01, -5.54416131e-01, -5.04474494e-01, ...,
        -1.19197486e+00, -6.96025943e-01, -3.15245608e-01],
       [-5.32484049e-01, -1.20396288e+00, -2.43135269e-01, ...,
         1.38528976e-02, -5.03015158e-01, -1.04540210e+00],
       [-8.64793539e-01, -1.64838960e+00, -2.01925581e+00, ...,
        -1.80330804e+00, -4.36338705e-01, -9.54132539e-01]])
```

```python
y_test
```

```result
406    1
511    0
24     1
751    0
689    1
      ..
3      0
469    0
587    0
60     0
97     0
Name: Outcome, Length: 135, dtype: int64
```

```python
logr = LogisticRegression(verbose=1)
```

```python
logr.fit(x_train,y_train)
```

```result
[Parallel(n_jobs=1)]: Using backend SequentialBackend with 1 concurrent workers.
[Parallel(n_jobs=1)]: Done   1 out of   1 | elapsed:    1.7s finished
```

```result
LogisticRegression(verbose=1)
```

```python
x_test[0]
```

```result
array([ 1.32134931e-01, -1.44176079e-01,  4.52611463e-04, -6.09921498e-01,
       -4.34192020e-01, -4.70915211e-01, -2.50346495e-01,  1.23633694e+00])
```

```python
logr.predict([x_test[0]])
```

```result
array([0], dtype=int64)
```

```python
logr.predict_proba([x_test[0]])
```

```result
array([[0.83549024, 0.16450976]])
```

```python
logr.predict_log_proba([x_test[0]])
```

```result
array([[-0.17973662, -1.80478536]])
```

```python
logr_liblinear = LogisticRegression(verbose=1,solver='liblinear')
```

```python
logr_liblinear.fit(x_train,y_train )
```

```result
[LibLinear]
```

```result
LogisticRegression(solver='liblinear', verbose=1)
```

```python
y_pred_liblinear = logr_liblinear.predict(x_test)
```

```python
y_pred_default = logr.predict(x_test)
```

```python
confusion_matrix(y_test,y_pred_liblinear)
```

```result
array([[77, 10],
       [24, 24]], dtype=int64)
```

```python
confusion_matrix(y_test,y_pred_default)
```

```result
array([[77, 10],
       [24, 24]], dtype=int64)
```

```python
#Model Evaluation

def model_eval(y_true,y_pred):
    tn, fp, fn, tp = confusion_matrix(y_test,y_pred).ravel()
    accuracy=(tp+tn)/(tp+tn+fp+fn)
    precision=tp/(tp+fp)
    recall=tp/(tp+fn)
    specificity=tn/(fp+tn)
    F1_Score = 2*(recall * precision) / (recall + precision)
    result={"Accuracy":accuracy,"Precision":precision,"Recall":recall,'Specficity':specificity,'F1':F1_Score}
    return result
model_eval(y_test,y_pred_liblinear)
```

```result
{'Accuracy': 0.7481481481481481,
 'Precision': 0.7058823529411765,
 'Recall': 0.5,
 'Specficity': 0.8850574712643678,
 'F1': 0.5853658536585366}
```

```python
auc = roc_auc_score(y_test,y_pred_liblinear)
```

```python
auc
```

```result
0.692528735632184
```

```python
fpr, tpr, thresholds  = roc_curve(y_test,y_pred_liblinear)
```

```python
plt.plot(fpr, tpr, color='orange', label='ROC')
plt.plot([0, 1], [0, 1], color='darkblue', linestyle='--',label='ROC curve (area = %0.2f)' % auc)
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curve')
plt.legend()
plt.show()
```

![Output](kb-media:80bd8cd779386e047888.png)

```python
x=lambda a,b:a+b
```

```python
x(10,2)
```

```result
12
```

```python
def myfun(a):
    return lambda b:b*a
```

```python
y=myfun(2)
```

```python
y(11)
```

```result
22
```
