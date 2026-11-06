```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pickle
from pandas_profiling import ProfileReport
```

```result title="Error"
---------------------------------------------------------------------------
ModuleNotFoundError                       Traceback (most recent call last)
<ipython-input-1-2c2c42d158a6> in <module>
      3 import matplotlib.pyplot as plt
      4 import pickle
----> 5 from pandas_profiling import ProfileReport

ModuleNotFoundError: No module named 'pandas_profiling'
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

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Unnamed: 0</th>
      <th>TV</th>
      <th>radio</th>
      <th>newspaper</th>
      <th>sales</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>230.1</td>
      <td>37.8</td>
      <td>69.2</td>
      <td>22.1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>44.5</td>
      <td>39.3</td>
      <td>45.1</td>
      <td>10.4</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>17.2</td>
      <td>45.9</td>
      <td>69.3</td>
      <td>9.3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>151.5</td>
      <td>41.3</td>
      <td>58.5</td>
      <td>18.5</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>180.8</td>
      <td>10.8</td>
      <td>58.4</td>
      <td>12.9</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>195</th>
      <td>196</td>
      <td>38.2</td>
      <td>3.7</td>
      <td>13.8</td>
      <td>7.6</td>
    </tr>
    <tr>
      <th>196</th>
      <td>197</td>
      <td>94.2</td>
      <td>4.9</td>
      <td>8.1</td>
      <td>9.7</td>
    </tr>
    <tr>
      <th>197</th>
      <td>198</td>
      <td>177.0</td>
      <td>9.3</td>
      <td>6.4</td>
      <td>12.8</td>
    </tr>
    <tr>
      <th>198</th>
      <td>199</td>
      <td>283.6</td>
      <td>42.0</td>
      <td>66.2</td>
      <td>25.5</td>
    </tr>
    <tr>
      <th>199</th>
      <td>200</td>
      <td>232.1</td>
      <td>8.6</td>
      <td>8.7</td>
      <td>13.4</td>
    </tr>
  </tbody>
</table>
<p>200 rows × 5 columns</p>
</div>
</div>

```python
df.head()
```

<div class="kb-html">
<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Unnamed: 0</th>
      <th>TV</th>
      <th>radio</th>
      <th>newspaper</th>
      <th>sales</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>230.1</td>
      <td>37.8</td>
      <td>69.2</td>
      <td>22.1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>44.5</td>
      <td>39.3</td>
      <td>45.1</td>
      <td>10.4</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>17.2</td>
      <td>45.9</td>
      <td>69.3</td>
      <td>9.3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>151.5</td>
      <td>41.3</td>
      <td>58.5</td>
      <td>18.5</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>180.8</td>
      <td>10.8</td>
      <td>58.4</td>
      <td>12.9</td>
    </tr>
  </tbody>
</table>
</div>
</div>

```python
pip install pandas-profiling
```

```result
Collecting pandas-profiling
  Downloading pandas_profiling-3.0.0-py2.py3-none-any.whl (248 kB)
Requirement already satisfied: seaborn>=0.10.1 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (0.11.0)
Requirement already satisfied: joblib in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (0.17.0)
Requirement already satisfied: requests>=2.24.0 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (2.24.0)
Requirement already satisfied: pandas!=1.0.0,!=1.0.1,!=1.0.2,!=1.1.0,>=0.25.3 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (1.1.3)
Collecting visions[type_image_path]==0.7.1
  Downloading visions-0.7.1-py3-none-any.whl (102 kB)
Note: you may need to restart the kernel to use updated packages.Collecting htmlmin>=0.1.12
```

```result
WARNING: Retrying (Retry(total=4, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProtocolError('Connection aborted.', ConnectionResetError(10054, 'An existing connection was forcibly closed by the remote host', None, 10054, None))': /simple/pandas-profiling/
WARNING: Retrying (Retry(total=3, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProtocolError('Connection aborted.', ConnectionResetError(10054, 'An existing connection was forcibly closed by the remote host', None, 10054, None))': /simple/pandas-profiling/
```

```result

  Downloading htmlmin-0.1.12.tar.gz (19 kB)
Requirement already satisfied: scipy>=1.4.1 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (1.5.2)
Collecting missingno>=0.4.2
  Downloading missingno-0.5.0-py3-none-any.whl (8.8 kB)
Collecting tangled-up-in-unicode==0.1.0
  Downloading tangled_up_in_unicode-0.1.0-py3-none-any.whl (3.1 MB)
Requirement already satisfied: numpy>=1.16.0 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (1.19.2)
Requirement already satisfied: matplotlib>=3.2.0 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (3.3.2)
Collecting phik>=0.11.1
  Downloading phik-0.12.0-cp38-cp38-win_amd64.whl (659 kB)
Requirement already satisfied: jinja2>=2.11.1 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (2.11.2)
Requirement already satisfied: tqdm>=4.48.2 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (4.50.2)
Requirement already satisfied: PyYAML>=5.0.0 in c:\users\surya\anaconda3\lib\site-packages (from pandas-profiling) (5.3.1)
Collecting pydantic>=1.8.1
  Downloading pydantic-1.8.2-cp38-cp38-win_amd64.whl (2.0 MB)
Requirement already satisfied: chardet<4,>=3.0.2 in c:\users\surya\anaconda3\lib\site-packages (from requests>=2.24.0->pandas-profiling) (3.0.4)
Requirement already satisfied: idna<3,>=2.5 in c:\users\surya\anaconda3\lib\site-packages (from requests>=2.24.0->pandas-profiling) (2.10)
Requirement already satisfied: certifi>=2017.4.17 in c:\users\surya\anaconda3\lib\site-packages (from requests>=2.24.0->pandas-profiling) (2020.6.20)
Requirement already satisfied: urllib3!=1.25.0,!=1.25.1,<1.26,>=1.21.1 in c:\users\surya\anaconda3\lib\site-packages (from requests>=2.24.0->pandas-profiling) (1.25.11)
Requirement already satisfied: python-dateutil>=2.7.3 in c:\users\surya\anaconda3\lib\site-packages (from pandas!=1.0.0,!=1.0.1,!=1.0.2,!=1.1.0,>=0.25.3->pandas-profiling) (2.8.1)
Requirement already satisfied: pytz>=2017.2 in c:\users\surya\anaconda3\lib\site-packages (from pandas!=1.0.0,!=1.0.1,!=1.0.2,!=1.1.0,>=0.25.3->pandas-profiling) (2020.1)
Requirement already satisfied: bottleneck in c:\users\surya\anaconda3\lib\site-packages (from visions[type_image_path]==0.7.1->pandas-profiling) (1.3.2)
Collecting multimethod==1.4
  Downloading multimethod-1.4-py2.py3-none-any.whl (7.3 kB)
Requirement already satisfied: attrs>=19.3.0 in c:\users\surya\anaconda3\lib\site-packages (from visions[type_image_path]==0.7.1->pandas-profiling) (20.3.0)
Requirement already satisfied: networkx>=2.4 in c:\users\surya\anaconda3\lib\site-packages (from visions[type_image_path]==0.7.1->pandas-profiling) (2.5)
Requirement already satisfied: Pillow; extra == "type_image_path" in c:\users\surya\anaconda3\lib\site-packages (from visions[type_image_path]==0.7.1->pandas-profiling) (8.0.1)
Collecting imagehash; extra == "type_image_path"
  Downloading ImageHash-4.2.1.tar.gz (812 kB)
Requirement already satisfied: kiwisolver>=1.0.1 in c:\users\surya\anaconda3\lib\site-packages (from matplotlib>=3.2.0->pandas-profiling) (1.3.0)
Requirement already satisfied: cycler>=0.10 in c:\users\surya\anaconda3\lib\site-packages (from matplotlib>=3.2.0->pandas-profiling) (0.10.0)
Requirement already satisfied: pyparsing!=2.0.4,!=2.1.2,!=2.1.6,>=2.0.3 in c:\users\surya\anaconda3\lib\site-packages (from matplotlib>=3.2.0->pandas-profiling) (2.4.7)
Requirement already satisfied: MarkupSafe>=0.23 in c:\users\surya\anaconda3\lib\site-packages (from jinja2>=2.11.1->pandas-profiling) (1.1.1)
Requirement already satisfied: typing-extensions>=3.7.4.3 in c:\users\surya\anaconda3\lib\site-packages (from pydantic>=1.8.1->pandas-profiling) (3.7.4.3)
Requirement already satisfied: six>=1.5 in c:\users\surya\anaconda3\lib\site-packages (from python-dateutil>=2.7.3->pandas!=1.0.0,!=1.0.1,!=1.0.2,!=1.1.0,>=0.25.3->pandas-profiling) (1.15.0)
Requirement already satisfied: decorator>=4.3.0 in c:\users\surya\anaconda3\lib\site-packages (from networkx>=2.4->visions[type_image_path]==0.7.1->pandas-profiling) (4.4.2)
Requirement already satisfied: PyWavelets in c:\users\surya\anaconda3\lib\site-packages (from imagehash; extra == "type_image_path"->visions[type_image_path]==0.7.1->pandas-profiling) (1.1.1)
Building wheels for collected packages: htmlmin, imagehash
  Building wheel for htmlmin (setup.py): started
  Building wheel for htmlmin (setup.py): finished with status 'done'
  Created wheel for htmlmin: filename=htmlmin-0.1.12-py3-none-any.whl size=27091 sha256=15331dca92468a811124387b06481949db524afec78e51dd5a994c1f2638128e
  Stored in directory: c:\users\surya\appdata\local\pip\cache\wheels\23\14\6e\4be5bfeeb027f4939a01764b48edd5996acf574b0913fe5243
  Building wheel for imagehash (setup.py): started
  Building wheel for imagehash (setup.py): finished with status 'done'
  Created wheel for imagehash: filename=ImageHash-4.2.1-py2.py3-none-any.whl size=295204 sha256=f92985911256eee7fc362718c8c28b8fa755c053aacf98f20519b3ac4cea4ad0
  Stored in directory: c:\users\surya\appdata\local\pip\cache\wheels\48\a1\7f\096c1269d6bf78d4768180602579b35a1e8cb1250bb4b40c74
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

```result
HBox(children=(HTML(value='Summarize dataset'), FloatProgress(value=0.0, max=18.0), HTML(value='')))
```

```result
HBox(children=(HTML(value='Generate report structure'), FloatProgress(value=0.0, max=1.0), HTML(value='')))
```

```result
HBox(children=(HTML(value='Render HTML'), FloatProgress(value=0.0, max=1.0), HTML(value='')))
```

```result
HBox(children=(HTML(value='Export report to file'), FloatProgress(value=0.0, max=1.0), HTML(value='')))
```

```python
y=df.iloc[:,-1].values
```

```python
y
```

```result
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
       13.4, 21.8, 14.1, 15.9, 14.6, 12.6, 12.2,  9.4, 15.9,  6.6, 15.5,
        7. , 11.6, 15.2, 19.7, 10.6,  6.6,  8.8, 24.7,  9.7,  1.6, 12.7,
        5.7, 19.6, 10.8, 11.6,  9.5, 20.8,  9.6, 20.7, 10.9, 19.2, 20.1,
       10.4, 11.4, 10.3, 13.2, 25.4, 10.9, 10.1, 16.1, 11.6, 16.6, 19. ,
       15.6,  3.2, 15.3, 10.1,  7.3, 12.9, 14.4, 13.3, 14.9, 18. , 11.9,
       11.9,  8. , 12.2, 17.1, 15. ,  8.4, 14.5,  7.6, 11.7, 11.5, 27. ,
       20.2, 11.7, 11.8, 12.6, 10.5, 12.2,  8.7, 26.2, 17.6, 22.6, 10.3,
       17.3, 15.9,  6.7, 10.8,  9.9,  5.9, 19.6, 17.3,  7.6,  9.7, 12.8,
       25.5, 13.4])
```

```python
y=y.reshape(len(y),1)
```

```result title="Error"
---------------------------------------------------------------------------
AttributeError                            Traceback (most recent call last)
<ipython-input-42-27dee1b33103> in <module>
----> 1 y=y.reshape(len(y),1)

~\anaconda3\lib\site-packages\pandas\core\generic.py in __getattr__(self, name)
   5137             if self._info_axis._can_hold_identifiers_and_holds_name(name):
   5138                 return self[name]
-> 5139             return object.__getattribute__(self, name)
   5140 
   5141     def __setattr__(self, name: str, value) -> None:

AttributeError: 'Series' object has no attribute 'reshape'
```

```python
x=df.TV
```

```python
x
```

```result
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

```result title="Error"
---------------------------------------------------------------------------
ValueError                                Traceback (most recent call last)
<ipython-input-34-415b976c8561> in <module>
----> 1 regressor.fit(x,y)

~\anaconda3\lib\site-packages\sklearn\linear_model\_base.py in fit(self, X, y, sample_weight)
    503 
    504         n_jobs_ = self.n_jobs
--> 505         X, y = self._validate_data(X, y, accept_sparse=['csr', 'csc', 'coo'],
    506                                    y_numeric=True, multi_output=True)
    507 

~\anaconda3\lib\site-packages\sklearn\base.py in _validate_data(self, X, y, reset, validate_separately, **check_params)
    430                 y = check_array(y, **check_y_params)
    431             else:
--> 432                 X, y = check_X_y(X, y, **check_params)
    433             out = X, y
    434 

~\anaconda3\lib\site-packages\sklearn\utils\validation.py in inner_f(*args, **kwargs)
     70                           FutureWarning)
     71         kwargs.update({k: arg for k, arg in zip(sig.parameters, args)})
---> 72         return f(**kwargs)
     73     return inner_f
     74 

~\anaconda3\lib\site-packages\sklearn\utils\validation.py in check_X_y(X, y, accept_sparse, accept_large_sparse, dtype, order, copy, force_all_finite, ensure_2d, allow_nd, multi_output, ensure_min_samples, ensure_min_features, y_numeric, estimator)
    793         raise ValueError("y cannot be None")
    794 
--> 795     X = check_array(X, accept_sparse=accept_sparse,
    796                     accept_large_sparse=accept_large_sparse,
    797                     dtype=dtype, order=order, copy=copy,

~\anaconda3\lib\site-packages\sklearn\utils\validation.py in inner_f(*args, **kwargs)
     70                           FutureWarning)
     71         kwargs.update({k: arg for k, arg in zip(sig.parameters, args)})
---> 72         return f(**kwargs)
     73     return inner_f
     74 

~\anaconda3\lib\site-packages\sklearn\utils\validation.py in check_array(array, accept_sparse, accept_large_sparse, dtype, order, copy, force_all_finite, ensure_2d, allow_nd, ensure_min_samples, ensure_min_features, estimator)
    617             # If input is 1D raise error
    618             if array.ndim == 1:
--> 619                 raise ValueError(
    620                     "Expected 2D array, got 1D array instead:\narray={}.\n"
    621                     "Reshape your data either using array.reshape(-1, 1) if "

ValueError: Expected 2D array, got 1D array instead:
array=[230.1  44.5  17.2 151.5 180.8   8.7  57.5 120.2   8.6 199.8  66.1 214.7
  23.8  97.5 204.1 195.4  67.8 281.4  69.2 147.3 218.4 237.4  13.2 228.3
  62.3 262.9 142.9 240.1 248.8  70.6 292.9 112.9  97.2 265.6  95.7 290.7
 266.9  74.7  43.1 228.  202.5 177.  293.6 206.9  25.1 175.1  89.7 239.9
 227.2  66.9 199.8 100.4 216.4 182.6 262.7 198.9   7.3 136.2 210.8 210.7
  53.5 261.3 239.3 102.7 131.1  69.   31.5 139.3 237.4 216.8 199.1 109.8
  26.8 129.4 213.4  16.9  27.5 120.5   5.4 116.   76.4 239.8  75.3  68.4
 213.5 193.2  76.3 110.7  88.3 109.8 134.3  28.6 217.7 250.9 107.4 163.3
 197.6 184.9 289.7 135.2 222.4 296.4 280.2 187.9 238.2 137.9  25.   90.4
  13.1 255.4 225.8 241.7 175.7 209.6  78.2  75.1 139.2  76.4 125.7  19.4
 141.3  18.8 224.  123.1 229.5  87.2   7.8  80.2 220.3  59.6   0.7 265.2
   8.4 219.8  36.9  48.3  25.6 273.7  43.  184.9  73.4 193.7 220.5 104.6
  96.2 140.3 240.1 243.2  38.   44.7 280.7 121.  197.6 171.3 187.8   4.1
  93.9 149.8  11.7 131.7 172.5  85.7 188.4 163.5 117.2 234.5  17.9 206.8
 215.4 284.3  50.  164.5  19.6 168.4 222.4 276.9 248.4 170.2 276.7 165.6
 156.6 218.5  56.2 287.6 253.8 205.  139.5 191.1 286.   18.7  39.5  75.5
  17.2 166.8 149.7  38.2  94.2 177.  283.6 232.1].
Reshape your data either using array.reshape(-1, 1) if your data has a single feature or array.reshape(1, -1) if it contains a single sample.
```

```python
regressor.intercept_
```

```result
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
       13.4, 21.8, 14.1, 15.9, 14.6, 12.6, 12.2,  9.4, 15.9,  6.6, 15.5,
        7. , 11.6, 15.2, 19.7, 10.6,  6.6,  8.8, 24.7,  9.7,  1.6, 12.7,
        5.7, 19.6, 10.8, 11.6,  9.5, 20.8,  9.6, 20.7, 10.9, 19.2, 20.1,
       10.4, 11.4, 10.3, 13.2, 25.4, 10.9, 10.1, 16.1, 11.6, 16.6, 19. ,
       15.6,  3.2, 15.3, 10.1,  7.3, 12.9, 14.4, 13.3, 14.9, 18. , 11.9,
       11.9,  8. , 12.2, 17.1, 15. ,  8.4, 14.5,  7.6, 11.7, 11.5, 27. ,
       20.2, 11.7, 11.8, 12.6, 10.5, 12.2,  8.7, 26.2, 17.6, 22.6, 10.3,
       17.3, 15.9,  6.7, 10.8,  9.9,  5.9, 19.6, 17.3,  7.6,  9.7, 12.8,
       25.5, 13.4])
```

```python
regressor.coef_
```

```result
array([[0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.],
       ...,
       [0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.],
       [0., 0., 0., ..., 0., 0., 0.]])
```
