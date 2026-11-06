```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pickle
from pandas_profiling import ProfileReport
```

```python
from pandas_profiling import ProfileReport
```

```python
df=pd.read_csv('Desktop//Advertising.csv')
```

```python
df
```

|  | Unnamed: 0 | TV | radio | newspaper | sales |
|---|---|---|---|---|---|
| 0 | 1 | 230.1 | 37.8 | 69.2 | 22.1 |
| 1 | 2 | 44.5 | 39.3 | 45.1 | 10.4 |
| 2 | 3 | 17.2 | 45.9 | 69.3 | 9.3 |
| 3 | 4 | 151.5 | 41.3 | 58.5 | 18.5 |
| 4 | 5 | 180.8 | 10.8 | 58.4 | 12.9 |
| ... | ... | ... | ... | ... | ... |
| 195 | 196 | 38.2 | 3.7 | 13.8 | 7.6 |
| 196 | 197 | 94.2 | 4.9 | 8.1 | 9.7 |
| 197 | 198 | 177.0 | 9.3 | 6.4 | 12.8 |
| 198 | 199 | 283.6 | 42.0 | 66.2 | 25.5 |
| … 1 more rows |  |  |  |  |  |

```python
df.head()
```

|  | Unnamed: 0 | TV | radio | newspaper | sales |
|---|---|---|---|---|---|
| 0 | 1 | 230.1 | 37.8 | 69.2 | 22.1 |
| 1 | 2 | 44.5 | 39.3 | 45.1 | 10.4 |
| 2 | 3 | 17.2 | 45.9 | 69.3 | 9.3 |
| 3 | 4 | 151.5 | 41.3 | 58.5 | 18.5 |
| 4 | 5 | 180.8 | 10.8 | 58.4 | 12.9 |

```python
pip install pandas-profiling
```
```output
Collecting pandas-profiling
  Downloading pandas_profiling-3.0.0-py2.py3-none-any.whl (248 kB)
Requirement already satisfied: seaborn>=0.10.1 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (0.11.0)
Requirement already satisfied: joblib in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (0.17.0)
Requirement already satisfied: requests>=2.24.0 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (2.24.0)
Requirement already satisfied: pandas!=1.0.0,!=1.0.1,!=1.0.2,!=1.1.0,>=0.25.3 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (1.1.3)
Collecting visions[type_image_path]==0.7.1
  Downloading visions-0.7.1-py3-none-any.whl (102 kB)
Note: you may need to restart the kernel to use updated packages.Collecting htmlmin>=0.1.12

… (46 more lines)
Successfully built htmlmin imagehash
Installing collected packages: multimethod, tangled-up-in-unicode, imagehash, visions, htmlmin, missingno, phik, pydantic, pandas-profiling
Successfully installed htmlmin-0.1.12 imagehash-4.2.1 missingno-0.5.0 multimethod-1.4 pandas-profiling-3.0.0 phik-0.12.0 pydantic-1.8.2 tangled-up-in-unicode-0.1.0 visions-0.7.1
```

```python
pf=ProfileReport(df)
```

```python
pf.to_file('test.html')
```

```python
y=df.iloc[:,-1].values
```

```python
y
```
```output
array([22.1, 10.4,  9.3, 18.5, 12.9,  7.2, 11.8, 13.2,  4.8, 10.6,  8.6,
       17.4,  9.2,  9.7, 19. , 22.4, 12.5, 24.4, 11.3, 14.6, 18. , 12.5,
        5.6, 15.5,  9.7, 12. , 15. , 15.9, 18.9, 10.5, 21.4, 11.9,  9.6,
       17.4,  9.5, 12.8, 25.4, 14.7, 10.1, 21.5, 16.6, 17.1, 20.7, 12.9,
        8.5, 14.9, 10.6, 23.2, 14.8,  9.7, 11.4, 10.7, 22.6, 21.2, 20.2,
       23.7,  5.5, 13.2, 23.8, 18.4,  8.1, 24.2, 15.7, 14. , 18. ,  9.3,
        9.5, 13.4, 18.9, 22.3, 18.3, 12.4,  8.8, 11. , 17. ,  8.7,  6.9,
       14.2,  5.3, 11. , 11.8, 12.3, 11.3, 13.6, 21.7, 15.2, 12. , 16. ,
       12.9, 16.7, 11.2,  7.3, 19.4, 22.2, 11.5, 16.9, 11.7, 15.5, 25.4,
       17.2, 11.7, 23.8, 14.8, 14.7, 20.7, 19.2,  7.2,  8.7,  5.3, 19.8,
… (6 more lines)
       20.2, 11.7, 11.8, 12.6, 10.5, 12.2,  8.7, 26.2, 17.6, 22.6, 10.3,
       17.3, 15.9,  6.7, 10.8,  9.9,  5.9, 19.6, 17.3,  7.6,  9.7, 12.8,
       25.5, 13.4])
```

```python
y=y.reshape(len(y),1)
```

```python
x=df.TV
```

```python
x
```
```output
0      230.1
1       44.5
2       17.2
3      151.5
4      180.8
       ...  
195     38.2
196     94.2
197    177.0
198    283.6
199    232.1
Name: TV, Length: 200, dtype: float64
```

```python
from sklearn.linear_model import LinearRegression
```

```python
regressor=LinearRegression()
```

```python
regressor.fit(x,y)
```

```python
regressor.intercept_
```
```output
array([22.1, 10.4,  9.3, 18.5, 12.9,  7.2, 11.8, 13.2,  4.8, 10.6,  8.6,
       17.4,  9.2,  9.7, 19. , 22.4, 12.5, 24.4, 11.3, 14.6, 18. , 12.5,
        5.6, 15.5,  9.7, 12. , 15. , 15.9, 18.9, 10.5, 21.4, 11.9,  9.6,
       17.4,  9.5, 12.8, 25.4, 14.7, 10.1, 21.5, 16.6, 17.1, 20.7, 12.9,
        8.5, 14.9, 10.6, 23.2, 14.8,  9.7, 11.4, 10.7, 22.6, 21.2, 20.2,
       23.7,  5.5, 13.2, 23.8, 18.4,  8.1, 24.2, 15.7, 14. , 18. ,  9.3,
        9.5, 13.4, 18.9, 22.3, 18.3, 12.4,  8.8, 11. , 17. ,  8.7,  6.9,
       14.2,  5.3, 11. , 11.8, 12.3, 11.3, 13.6, 21.7, 15.2, 12. , 16. ,
       12.9, 16.7, 11.2,  7.3, 19.4, 22.2, 11.5, 16.9, 11.7, 15.5, 25.4,
       17.2, 11.7, 23.8, 14.8, 14.7, 20.7, 19.2,  7.2,  8.7,  5.3, 19.8,
… (6 more lines)
       20.2, 11.7, 11.8, 12.6, 10.5, 12.2,  8.7, 26.2, 17.6, 22.6, 10.3,
       17.3, 15.9,  6.7, 10.8,  9.9,  5.9, 19.6, 17.3,  7.6,  9.7, 12.8,
       25.5, 13.4])
```

```python
regressor.coef_
```
```output
array([[0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.],
       ...,
       [0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.]])
```
