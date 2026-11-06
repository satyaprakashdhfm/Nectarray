## Quick Reference Summary

### Most Common Operations by Category

**Data Import/Export:** `read_csv()`, `read_excel()`, `to_csv()`, `to_excel()`, `read_sql()`, `to_sql()`

**Data Inspection:** `head()`, `tail()`, `info()`, `describe()`, `shape`, `dtypes`, `columns`, `index`

**Selection:** `loc[]`, `iloc[]`, `[]`, `query()`, `at[]`, `iat[]`

**Cleaning:** `dropna()`, `fillna()`, `drop_duplicates()`, `replace()`, `rename()`

**Transformation:** `apply()`, `map()`, `applymap()`, `assign()`, `pipe()`

**Aggregation:** `groupby()`, `agg()`, `pivot_table()`, `crosstab()`

**Combining:** `merge()`, `join()`, `concat()`, `append()`

**Reshaping:** `pivot()`, `melt()`, `stack()`, `unstack()`, `transpose()`

**String Operations:** `.str.` methods (lower, upper, contains, replace, split, etc.)

**DateTime:** `.dt.` methods (year, month, day, strftime, etc.), `to_datetime()`

**Statistics:** `mean()`, `median()`, `sum()`, `std()`, `corr()`, `describe()`

**Sorting:** `sort_values()`, `sort_index()`, `rank()`

**Window Functions:** `rolling()`, `expanding()`, `ewm()`

---

## Tips for Learning Pandas Efficiently

1. **Start with Level 1** - Master basic operations before moving to advanced features
2. **Practice with real datasets** - Use Kaggle datasets or create your own
3. **Use method chaining** - Makes code more readable and efficient
4. **Learn one category at a time** - Don't try to memorize everything at once
5. **Understand the difference between** Series and DataFrame operations
6. **Always check the documentation** - `help(df.function)` or `df.function?` in Jupyter
7. **Use vectorized operations** - Avoid loops whenever possible for performance
8. **Experiment in Jupyter notebooks** - Great for learning and testing
9. **Learn keyboard shortcuts** - `Tab` for autocomplete, `Shift+Tab` for documentation
10. **Practice, practice, practice** - The more you use it, the more natural it becomes

# Complete Pandas Quick Reference

## Level 1: Beginner

### Setup & Creation
```python
import pandas as pd
import numpy as np

# DataFrames & Series
df = pd.DataFrame({'A': [1,2,3], 'B': [4,5,6]})
s = pd.Series([1,2,3], index=['a','b','c'])
```

### Read/Write
```python
df = pd.read_csv('file.csv')
df = pd.read_excel('file.xlsx')
df = pd.read_json('file.json')
df.to_csv('out.csv', index=False)
df.to_excel('out.xlsx', index=False)
df.to_json('out.json')
```

### View Data
```python
df.head()              # First 5 rows
df.tail()              # Last 5 rows
df.shape               # (rows, cols)
df.info()              # Summary
df.describe()          # Statistics
df.columns             # Column names
df.index               # Row labels
df.dtypes              # Data types
```

### Select Data
```python
df['col']                        # One column (Series)
df[['col1', 'col2']]            # Multiple columns (DataFrame)
df.loc[0:5, 'col']              # Label-based
df.iloc[0:5, 0:3]               # Position-based
df[df['age'] > 30]              # Boolean filter
df[(df['age'] > 30) & (df['city'] == 'NYC')]
```

### Basic Operations
```python
df.drop('col', axis=1)                    # Drop column
df.drop([0,1,2], axis=0)                  # Drop rows
df.rename(columns={'old': 'new'})         # Rename
df.sort_values('col')                     # Sort ascending
df.sort_values('col', ascending=False)    # Sort descending
df.sort_index()                           # Sort by index
df.reset_index(drop=True)                 # Reset index
df.set_index('col')                       # Set column as index
```

### Missing Data
```python
df.isna()                      # Find NaN
df.notna()                     # Find non-NaN
df.dropna()                    # Drop rows with NaN
df.dropna(axis=1)              # Drop columns with NaN
df.dropna(subset=['col'])      # Drop based on specific column
df.fillna(0)                   # Fill with value
df.fillna(method='ffill')      # Forward fill
df.fillna(method='bfill')      # Backward fill
df.fillna(df.mean())           # Fill with mean
```

### Statistics
```python
df.mean()                      # Mean
df.median()                    # Median
df.sum()                       # Sum
df.min() / df.max()           # Min/Max
df.std()                       # Standard deviation
df.var()                       # Variance
df.count()                     # Count non-null
df['col'].value_counts()       # Count unique values
df['col'].unique()             # Unique values
df['col'].nunique()            # Number of unique values
```

---

## Level 2: Intermediate

### Data Manipulation
```python
df['col'].apply(lambda x: x * 2)           # Apply to column
df.apply(lambda x: x.max() - x.min())      # Apply to DataFrame
df['col'].map({'old': 'new'})              # Map values
df.replace(0, np.nan)                      # Replace values
df.replace([0, 1], [10, 100])             # Multiple replacements
df['col'].astype(int)                      # Convert type
df.astype({'col1': int, 'col2': str})     # Multiple conversions
df.copy()                                  # Deep copy
```

### String Operations
```python
df['col'].str.lower()                      # Lowercase
df['col'].str.upper()                      # Uppercase
df['col'].str.strip()                      # Remove whitespace
df['col'].str.contains('pattern')          # Check contains
df['col'].str.replace('old', 'new')        # Replace substring
df['col'].str.split(',')                   # Split string
df['col'].str.split(',', expand=True)      # Split into columns
df['col'].str.startswith('prefix')         # Starts with
df['col'].str.endswith('suffix')           # Ends with
df['col'].str.len()                        # String length
df['col'].str[:5]                          # Slice string
```

### Date/Time
```python
pd.to_datetime(df['date'])                 # Convert to datetime
pd.to_datetime('2023-01-01')              
df['date'].dt.year                         # Extract year
df['date'].dt.month                        # Extract month
df['date'].dt.day                          # Extract day
df['date'].dt.hour                         # Extract hour
df['date'].dt.dayofweek                    # Day of week (0=Mon)
df['date'].dt.day_name()                   # Day name
df['date'].dt.strftime('%Y-%m-%d')        # Format datetime
pd.date_range('2023-01-01', '2023-12-31') # Date range
pd.date_range('2023-01-01', periods=10)   
```

### Grouping & Aggregation
```python
df.groupby('col')                          # Group by column
df.groupby(['col1', 'col2'])              # Group by multiple
df.groupby('col').mean()                   # Aggregate
df.groupby('col')['value'].sum()          # Group specific column
df.groupby('col').agg(['mean', 'sum'])    # Multiple aggregations
df.groupby('col').agg({'col1': 'mean', 'col2': 'sum'})
df.groupby('col').transform('mean')        # Transform (same shape)
df.groupby('col').filter(lambda x: len(x) > 5)  # Filter groups
```

### Combining DataFrames
```python
pd.concat([df1, df2])                      # Vertical stack
pd.concat([df1, df2], axis=1)             # Horizontal stack
pd.concat([df1, df2], ignore_index=True)  
pd.merge(df1, df2, on='key')              # Inner join
pd.merge(df1, df2, on='key', how='left')  # Left join
pd.merge(df1, df2, on='key', how='right') # Right join
pd.merge(df1, df2, on='key', how='outer') # Outer join
pd.merge(df1, df2, left_on='k1', right_on='k2')
df1.join(df2)                              # Join on index
```

### Reshaping
```python
df.pivot(index='date', columns='cat', values='val')
df.pivot_table(values='val', index='row', columns='col', aggfunc='mean')
df.melt(id_vars=['id'], value_vars=['col1', 'col2'])
df.stack()                                 # Columns to rows
df.unstack()                               # Rows to columns
df.T                                       # Transpose
df.transpose()
```

### Duplicates
```python
df.duplicated()                            # Find duplicates
df.duplicated(subset=['col'])             # Based on column
df.duplicated(keep='first')               # Mark except first
df.duplicated(keep='last')                # Mark except last
df.duplicated(keep=False)                 # Mark all duplicates
df.drop_duplicates()                      # Remove duplicates
df.drop_duplicates(subset=['col'])       
```

### Binning
```python
pd.cut(df['age'], bins=3)                 # Equal-width bins
pd.cut(df['age'], bins=[0,18,65,100], labels=['Child','Adult','Senior'])
pd.qcut(df['value'], q=4)                 # Quartiles
pd.qcut(df['value'], q=10)                # Deciles
```

### Statistical Functions
```python
df.corr()                                  # Correlation matrix
df.corr(method='pearson')
df.corr(method='spearman')
df.cov()                                   # Covariance matrix
df['col'].rank()                           # Rank values
df['col'].pct_change()                     # Percentage change
df['col'].diff()                           # Difference
df['col'].cumsum()                         # Cumulative sum
df['col'].cumprod()                        # Cumulative product
df['col'].cummax()                         # Cumulative max
df['col'].cummin()                         # Cumulative min
```

---

## Level 3: Advanced

### Advanced Grouping
```python
df.groupby('col').size()                   # Group sizes
df.groupby('col').nth(0)                   # First of each group
df.groupby('col').nth(-1)                  # Last of each group
df.groupby('col')['val'].cumsum()         # Cumulative within groups
df.groupby('col').cumcount()              # Counter within groups
df.groupby('cat')['val'].rolling(3).mean() # Rolling within groups
df.groupby('cat')['val'].expanding().mean() # Expanding within groups
```

### Window Functions
```python
df['col'].rolling(window=3).mean()        # Rolling mean
df['col'].rolling(3, min_periods=1).sum() # Rolling sum
df.rolling(5).agg(['mean', 'std'])        # Multiple functions
df['col'].expanding().mean()              # Expanding mean
df['col'].ewm(span=10).mean()             # Exponential weighted
df['col'].ewm(alpha=0.5).mean()          
```

### MultiIndex
```python
idx = pd.MultiIndex.from_tuples([('A',1), ('A',2), ('B',1)])
df = pd.DataFrame({'val': [1,2,3]}, index=idx)
idx = pd.MultiIndex.from_product([['A','B'], [1,2,3]])
df.xs('A', level=0)                        # Cross-section
df.xs(('A',1), level=[0,1])              
df.swaplevel(0, 1)                         # Swap levels
```

### Advanced Merging
```python
pd.merge_asof(df1, df2, on='date')        # Merge on nearest key
pd.merge_asof(df1, df2, on='date', by='cat')
pd.merge_ordered(df1, df2, on='date', fill_method='ffill')
```

### Categorical Data
```python
df['col'] = df['col'].astype('category')  # Convert to category
df['col'].cat.categories                   # Get categories
df['col'].cat.codes                        # Get codes
df['col'].cat.rename_categories({'old': 'new'})
df['col'].cat.reorder_categories(['low', 'med', 'high'])
df['col'].cat.add_categories(['new'])     # Add category
df['col'].cat.remove_categories(['old'])  # Remove category
```

### Performance
```python
df.memory_usage(deep=True)                # Memory usage
df.select_dtypes(include=['int64'])       # Select by type
df.select_dtypes(exclude=['object'])     
pd.eval('df1 + df2')                      # Efficient evaluation
df.eval('C = A + B')                      # Add column efficiently
df.query('age > 30')                      # Efficient filtering
df.query('age > 30 and city == "NYC"')   
df.query('age > @threshold')              # Use variables
```

### Advanced Indexing
```python
df.where(df > 0, 0)                       # Replace where False
df.mask(df < 0, 0)                        # Replace where True
df.at[0, 'col']                           # Fast scalar access (label)
df.iat[0, 0]                              # Fast scalar access (position)
df.get('col', default=None)               # Get with default
```

### Sampling & Selection
```python
df.sample(n=10)                           # Random n rows
df.sample(frac=0.1)                       # Random 10%
df.sample(n=5, replace=True)              # With replacement
df.sample(n=10, random_state=42)          # Reproducible
df.nlargest(10, 'col')                    # N largest
df.nsmallest(5, 'col')                    # N smallest
```

### Advanced Strings
```python
df['col'].str.extract(r'(\d+)')           # Extract pattern
df['col'].str.extract(r'(\w+)-(\d+)', expand=True)
df['col'].str.findall(r'\d+')             # Find all
df['col'].str.match(r'^\d+')              # Match pattern
df['col'].str.pad(10, side='left', fillchar='0')  # Pad
df['col'].str.wrap(width=50)              # Wrap text
```

### Time Series
```python
df.resample('D').mean()                   # Daily resample
df.resample('W').sum()                    # Weekly resample
df.resample('M').last()                   # Monthly last
df['col'].shift(1)                        # Shift down
df['col'].shift(-1)                       # Shift up
df.shift(periods=2, freq='D')             # Shift time index
df.asfreq('D')                            # Convert frequency
df.between_time('09:00', '17:00')        # Time range
df.at_time('10:30')                       # Specific time
```

### Sparse Data
```python
df['col'].astype(pd.SparseDtype('int', 0))  # Sparse type
df.sparse.to_dense()                       # Convert to dense
```

### Styling (Display)
```python
df.style.highlight_max(color='lightgreen')
df.style.highlight_min(color='lightcoral')
df.style.background_gradient(cmap='viridis')
df.style.format('{:.2f}')                 # Format numbers
df.style.format({'col1': '{:.2%}', 'col2': '${:.2f}'})
df.style.bar(color='lightblue')           # Bar in cells
```

### Advanced I/O
```python
# SQL
df = pd.read_sql('SELECT * FROM table', conn)
df.to_sql('table', conn, if_exists='replace')

# Parquet
df = pd.read_parquet('file.parquet')
df.to_parquet('file.parquet', compression='gzip')

# HDF5
df = pd.read_hdf('file.h5', 'key')
df.to_hdf('file.h5', key='data', mode='w')

# Pickle
df = pd.read_pickle('file.pkl')
df.to_pickle('file.pkl')

# Clipboard
df = pd.read_clipboard()
df.to_clipboard()
```

### Advanced Aggregation
```python
df.pipe(func1).pipe(func2)                # Chain functions
df.assign(new=lambda x: x['a'] * 2)       # Add column (chainable)
pd.crosstab(df['col1'], df['col2'])       # Cross-tabulation
pd.crosstab(df['col1'], df['col2'], normalize='all')
pd.get_dummies(df['cat'])                 # One-hot encode
pd.get_dummies(df, columns=['cat1', 'cat2'])
pd.get_dummies(df['cat'], prefix='cat', drop_first=True)
```

### Data Validation
```python
df['col'].isin([1, 2, 3])                 # Check membership
df.isin({'col1': [1,2], 'col2': ['a','b']})
df['col'].between(10, 20)                 # Between bounds
df['col'].clip(lower=0, upper=100)        # Clip values
df['col'].interpolate()                   # Interpolate NaN
df['col'].interpolate(method='linear')   
df['col'].interpolate(method='polynomial', order=2)
```

### Boolean Operations
```python
df.all()                                  # All True?
df.any()                                  # Any True?
df1.equals(df2)                           # DataFrames equal?
```

### Memory Optimization
```python
# Downcast numerics
df['int_col'] = pd.to_numeric(df['int_col'], downcast='integer')
df['float_col'] = pd.to_numeric(df['float_col'], downcast='float')

# Use categorical
df['cat_col'] = df['cat_col'].astype('category')

# Sparse for mostly zeros/NaN
df['sparse'] = df['sparse'].astype(pd.SparseDtype('float', np.nan))
```

### Advanced Index Operations
```python
df.reindex([0,1,2,3])                     # Conform to new index
df.reindex(columns=['col1', 'col2'])     
df.reindex(index=new_idx, fill_value=0)  
df.reindex(index=new_idx, method='ffill')
df1.reindex_like(df2)                     # Match another DF
df1_aligned, df2_aligned = df1.align(df2, join='inner')
```

### Iteration
```python
for col_name, col_data in df.items():     # Iterate columns
    print(col_name, col_data.sum())

for idx, row in df.iterrows():            # Iterate rows (slow)
    print(idx, row['col'])

for row in df.itertuples():               # Iterate rows (fast)
    print(row.Index, row.col_name)
```

### JSON Operations
```python
df = pd.json_normalize(json_data)         # Flatten JSON
df = pd.json_normalize(json_data, record_path='items')
df = pd.json_normalize(json_data, record_path='items', meta=['id'])
```

### Options & Settings
```python
pd.set_option('display.max_rows', 100)
pd.set_option('display.max_columns', None)
pd.set_option('display.precision', 2)
pd.get_option('display.max_rows')
pd.reset_option('display.max_rows')

# Context manager
with pd.option_context('display.max_rows', 10):
    print(df)
```

### Type Conversion
```python
pd.to_numeric(df['col'], errors='coerce') # Invalid → NaN
pd.to_numeric(df['col'], errors='ignore') # Keep invalid
pd.to_timedelta(df['duration'])           # To timedelta
df.convert_dtypes()                       # Best possible dtypes
df.infer_objects()                        # Infer better dtypes
```

### Nullable Types
```python
df['col'].astype('Int64')                 # Nullable int
df['col'].astype('boolean')               # Nullable bool
df['col'].astype('string')                # String type
```

### Advanced Accessors
```python
# String
df['text'].str.extractall(r'(\d+)')
df['text'].str.get_dummies(sep=',')

# DateTime
df['date'].dt.tz_localize('UTC')
df['date'].dt.tz_convert('US/Eastern')
df['date'].dt.to_period('M')
df['date'].dt.quarter
df['date'].dt.is_leap_year

# Categorical
df['cat'].cat.set_categories(['low','med','high'], ordered=True)
df['cat'].cat.as_ordered()
```

### Plotting
```python
df.plot()                                 # Line plot
df.plot(kind='bar')                       # Bar chart
df.plot(kind='barh')                      # Horizontal bar
df.plot(kind='hist')                      # Histogram
df.plot(kind='box')                       # Box plot
df.plot(kind='scatter', x='col1', y='col2')
df.plot(kind='area')                      # Area plot
df.plot(kind='pie', y='col')             # Pie chart
df.hist()                                 # Histogram
df.boxplot()                              # Box plot
```

### Intervals
```python
interval = pd.Interval(left=0, right=5)
intervals = pd.interval_range(start=0, end=5)
pd.IntervalIndex.from_tuples([(0,1), (1,2)])
```

### Fill Methods
```python
df.ffill()                                # Forward fill
df.bfill()                                # Backward fill
df.ffill(limit=2)                         # Limit fills
```

### Testing
```python
pd.testing.assert_frame_equal(df1, df2)   # Assert DFs equal
pd.testing.assert_series_equal(s1, s2)    # Assert Series equal
```

### Utilities
```python
codes, uniques = pd.factorize(df['col'])  # Encode as integers
pd.wide_to_long(df, stubnames='val', i='id', j='year')
pd.from_dummies(dummies_df)               # Reverse one-hot

# Large file chunks
for chunk in pd.read_csv('big.csv', chunksize=10000):
    process(chunk)
```

### Best Practices
```python
# Method chaining
result = (df
    .query('age > 30')
    .groupby('city')
    .agg({'salary': 'mean'})
    .reset_index()
    .sort_values('salary', ascending=False)
)

# Conditional column with np.select
conditions = [df['val'] > 100, df['val'] < 50]
choices = ['high', 'low']
df['cat'] = np.select(conditions, choices, default='med')

# Use vectorized operations (not loops!)
df['new'] = df['a'] + df['b']  # Good
# for i in range(len(df)): ...  # Bad
```

# Complete NumPy Guide: Vectors, 2D Arrays, and 3D Arrays

## Understanding NumPy Array Dimensions

### What are Vectors, 2D Arrays, and 3D Arrays?

**1D Array (Vector)**
- Single row or column of numbers
- Shape: `(n,)` 
- Example: `[1, 2, 3, 4, 5]`
- Used for: single list of values, time series data

**2D Array (Matrix)**
- Table with rows and columns
- Shape: `(rows, columns)`
- Example: `[[1, 2, 3], [4, 5, 6]]` → 2 rows, 3 columns
- Used for: spreadsheets, images (grayscale), data tables

**3D Array (Tensor)**
- Stack of 2D arrays
- Shape: `(depth, rows, columns)`
- Example: Stack of 3 matrices
- Used for: RGB images, video frames, batch of data

---

## LEVEL 1: Basic Vector Operations (1D Arrays)

### Creating Vectors

**np.array() - Create from list**
```python
vec = np.array([1, 2, 3, 4, 5])
# Result: [1 2 3 4 5]
# Shape: (5,)
```

**np.arange() - Range of values**
```python
vec = np.arange(0, 10, 2)
# Result: [0 2 4 6 8]
# Shape: (5,)
```

**np.linspace() - Evenly spaced values**
```python
vec = np.linspace(0, 1, 5)
# Result: [0.   0.25 0.5  0.75 1.  ]
# Shape: (5,)
```

**np.zeros() - Vector of zeros**
```python
vec = np.zeros(5)
# Result: [0. 0. 0. 0. 0.]
```

**np.ones() - Vector of ones**
```python
vec = np.ones(5)
# Result: [1. 1. 1. 1. 1.]
```

**np.random.rand() - Random vector**
```python
vec = np.random.rand(5)
# Result: [0.23 0.67 0.45 0.89 0.12]  # random values
```

### Accessing Vector Elements

**Indexing (starts from 0)**
```python
vec = np.array([10, 20, 30, 40, 50])
vec[0]      # First element: 10
vec[2]      # Third element: 30
vec[-1]     # Last element: 50
vec[-2]     # Second last: 40
```

**Slicing**
```python
vec[1:4]    # Elements from index 1 to 3: [20 30 40]
vec[:3]     # First 3 elements: [10 20 30]
vec[2:]     # From index 2 onwards: [30 40 50]
vec[::2]    # Every 2nd element: [10 30 50]
```

### Vector Operations

**Addition**
```python
vec1 = np.array([1, 2, 3])
vec2 = np.array([4, 5, 6])
result = vec1 + vec2
# Result: [5 7 9]
```

**Multiplication (element-wise)**
```python
result = vec1 * vec2
# Result: [4 10 18]
```

**Scalar Operations**
```python
vec = np.array([1, 2, 3, 4])
vec + 10        # Add 10 to all: [11 12 13 14]
vec * 5         # Multiply all by 5: [5 10 15 20]
vec ** 2        # Square all: [1 4 9 16]
```

**Vector Statistics**
```python
vec = np.array([1, 2, 3, 4, 5])
vec.sum()       # Sum: 15
vec.mean()      # Average: 3.0
vec.max()       # Maximum: 5
vec.min()       # Minimum: 1
vec.std()       # Standard deviation
```

**Dot Product (important for vectors!)**
```python
vec1 = np.array([1, 2, 3])
vec2 = np.array([4, 5, 6])
result = np.dot(vec1, vec2)
# Result: 1*4 + 2*5 + 3*6 = 32
```

---

## LEVEL 1: Basic 2D Array Operations (Matrices)

### Creating 2D Arrays

**np.array() - From nested list**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
# Shape: (2, 3) → 2 rows, 3 columns
```

**np.zeros() - 2D array of zeros**
```python
matrix = np.zeros((3, 4))
# Creates 3x4 matrix of zeros
# Shape: (3, 4)
```

**np.ones() - 2D array of ones**
```python
matrix = np.ones((2, 5))
# Creates 2x5 matrix of ones
```

**np.eye() - Identity matrix**
```python
matrix = np.eye(3)
# Result:
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]
```

**np.random.rand() - Random 2D array**
```python
matrix = np.random.rand(3, 4)
# Creates 3x4 matrix with random values
```

**np.arange().reshape() - Range reshaped**
```python
matrix = np.arange(12).reshape(3, 4)
# Result:
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]
```

### Understanding 2D Array Shape

```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])

matrix.shape        # (2, 3) → 2 rows, 3 columns
matrix.ndim         # 2 → 2 dimensions
matrix.size         # 6 → total elements
```

### Accessing 2D Array Elements

**Single Element**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])

matrix[0, 0]    # First row, first column: 1
matrix[1, 2]    # Second row, third column: 6
matrix[-1, -1]  # Last row, last column: 9
```

**Row Access**
```python
matrix[0]       # First row: [1 2 3]
matrix[1]       # Second row: [4 5 6]
matrix[-1]      # Last row: [7 8 9]
```

**Column Access**
```python
matrix[:, 0]    # First column: [1 4 7]
matrix[:, 1]    # Second column: [2 5 8]
matrix[:, -1]   # Last column: [3 6 9]
```

**Submatrix (Slicing)**
```python
matrix[0:2, 1:3]    # First 2 rows, columns 1-2
# Result:
# [[2 3]
#  [5 6]]

matrix[:2, :]       # First 2 rows, all columns
matrix[:, 1:]       # All rows, from column 1 onwards
```

### 2D Array Operations

**Row-wise Operations (axis=1)**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])

matrix.sum(axis=1)      # Sum each row: [6 15]
matrix.mean(axis=1)     # Mean of each row: [2. 5.]
matrix.max(axis=1)      # Max in each row: [3 6]
```

**Column-wise Operations (axis=0)**
```python
matrix.sum(axis=0)      # Sum each column: [5 7 9]
matrix.mean(axis=0)     # Mean of each column: [2.5 3.5 4.5]
matrix.min(axis=0)      # Min in each column: [1 2 3]
```

**Matrix Addition**
```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
C = A + B
# Result:
# [[ 6  8]
#  [10 12]]
```

**Matrix Multiplication**
```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
C = np.dot(A, B)  # or A @ B
# Result:
# [[19 22]
#  [43 50]]
```

**Transpose**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
transposed = matrix.T
# Result:
# [[1 4]
#  [2 5]
#  [3 6]]
```

---

## LEVEL 1: Basic 3D Array Operations

### Creating 3D Arrays

**np.zeros() - 3D array of zeros**
```python
arr_3d = np.zeros((2, 3, 4))
# Shape: (2, 3, 4)
# 2 layers, 3 rows, 4 columns
```

**np.ones() - 3D array of ones**
```python
arr_3d = np.ones((3, 2, 5))
# 3 layers, 2 rows, 5 columns
```

**np.arange().reshape() - Range to 3D**
```python
arr_3d = np.arange(24).reshape(2, 3, 4)
# Creates 2x3x4 array with values 0-23
# Shape: (2, 3, 4)
```

**From nested lists**
```python
arr_3d = np.array([
    [[1, 2], [3, 4]],          # First layer
    [[5, 6], [7, 8]]           # Second layer
])
# Shape: (2, 2, 2)
```

### Understanding 3D Array Structure

```python
arr_3d = np.arange(24).reshape(2, 3, 4)
# Shape: (2, 3, 4)
# Think of it as: 2 matrices, each with 3 rows and 4 columns

print(arr_3d.shape)     # (2, 3, 4)
print(arr_3d.ndim)      # 3
print(arr_3d.size)      # 24
```

### Accessing 3D Array Elements

**Single Element**
```python
arr_3d = np.arange(24).reshape(2, 3, 4)
arr_3d[0, 0, 0]     # First layer, first row, first column
arr_3d[1, 2, 3]     # Second layer, third row, fourth column
```

**Getting Layers**
```python
arr_3d[0]           # First complete layer (3x4 matrix)
arr_3d[1]           # Second complete layer (3x4 matrix)
```

**Getting Rows from specific layer**
```python
arr_3d[0, 0]        # First row of first layer
arr_3d[1, 2]        # Third row of second layer
```

**Getting Columns**
```python
arr_3d[:, :, 0]     # First column from all layers
arr_3d[0, :, 1]     # Second column from first layer
```

### 3D Array Operations

**Operations along different axes**
```python
arr_3d = np.arange(24).reshape(2, 3, 4)

# axis=0 → across layers
arr_3d.sum(axis=0)      # Sum across layers → (3, 4) result

# axis=1 → across rows (within each layer)
arr_3d.sum(axis=1)      # Sum across rows → (2, 4) result

# axis=2 → across columns (within each row)
arr_3d.sum(axis=2)      # Sum across columns → (2, 3) result
```

**Flattening 3D to 1D**
```python
arr_3d = np.arange(8).reshape(2, 2, 2)
flat = arr_3d.flatten()
# Result: [0 1 2 3 4 5 6 7]
```

---

## LEVEL 2: Intermediate Vector/Matrix Operations

### Vector Advanced Operations

**Vector Magnitude (Length)**
```python
vec = np.array([3, 4])
magnitude = np.linalg.norm(vec)
# Result: 5.0 (because sqrt(3² + 4²) = 5)
```

**Unit Vector (Normalized)**
```python
vec = np.array([3, 4])
unit_vec = vec / np.linalg.norm(vec)
# Result: [0.6 0.8]
```

**Cross Product (3D vectors only)**
```python
vec1 = np.array([1, 0, 0])
vec2 = np.array([0, 1, 0])
cross = np.cross(vec1, vec2)
# Result: [0 0 1]
```

**Outer Product**
```python
vec1 = np.array([1, 2, 3])
vec2 = np.array([4, 5])
outer = np.outer(vec1, vec2)
# Result:
# [[ 4  5]
#  [ 8 10]
#  [12 15]]
```

### 2D Array Reshaping

**Reshape**
```python
arr = np.arange(12)
matrix = arr.reshape(3, 4)      # 3x4 matrix
matrix = arr.reshape(4, 3)      # 4x3 matrix
matrix = arr.reshape(2, 6)      # 2x6 matrix
matrix = arr.reshape(2, -1)     # 2 rows, auto-calculate columns
```

**Flatten vs Ravel**
```python
matrix = np.array([[1, 2], [3, 4]])
flat1 = matrix.flatten()    # Creates copy
flat2 = matrix.ravel()      # Creates view (when possible)
```

### Stacking and Splitting

**Vertical Stack (vstack) - Stack rows**
```python
arr1 = np.array([[1, 2, 3]])
arr2 = np.array([[4, 5, 6]])
result = np.vstack((arr1, arr2))
# Result:
# [[1 2 3]
#  [4 5 6]]
```

**Horizontal Stack (hstack) - Stack columns**
```python
arr1 = np.array([[1], [2]])
arr2 = np.array([[3], [4]])
result = np.hstack((arr1, arr2))
# Result:
# [[1 3]
#  [2 4]]
```

**Concatenate**
```python
arr1 = np.array([[1, 2], [3, 4]])
arr2 = np.array([[5, 6]])

# Along rows (axis=0)
result = np.concatenate((arr1, arr2), axis=0)
# Result:
# [[1 2]
#  [3 4]
#  [5 6]]

# Along columns (axis=1) - shapes must match!
```

**Split**
```python
matrix = np.array([[1, 2, 3, 4],
                   [5, 6, 7, 8]])

# Split into 2 parts along columns
left, right = np.hsplit(matrix, 2)
# left: [[1 2], [5 6]]
# right: [[3 4], [7 8]]
```

### Matrix Operations

**Determinant**
```python
matrix = np.array([[1, 2], [3, 4]])
det = np.linalg.det(matrix)
# Result: -2.0
```

**Inverse**
```python
matrix = np.array([[1, 2], [3, 4]])
inv = np.linalg.inv(matrix)
# Result:
# [[-2.   1. ]
#  [ 1.5 -0.5]]
```

**Eigenvalues and Eigenvectors**
```python
matrix = np.array([[1, 2], [3, 4]])
eigenvalues, eigenvectors = np.linalg.eig(matrix)
```

**Matrix Power**
```python
matrix = np.array([[1, 2], [3, 4]])
squared = np.linalg.matrix_power(matrix, 2)
# Same as: matrix @ matrix
```

---

## LEVEL 2: Intermediate 3D Operations

### Stacking 2D Arrays into 3D

**Stack along new axis**
```python
matrix1 = np.array([[1, 2], [3, 4]])
matrix2 = np.array([[5, 6], [7, 8]])

# Stack to create depth
arr_3d = np.stack((matrix1, matrix2), axis=0)
# Shape: (2, 2, 2)
```

**dstack - Depth stack**
```python
arr_3d = np.dstack((matrix1, matrix2))
# Stacks along third dimension
```

### Transposing 3D Arrays

```python
arr_3d = np.arange(24).reshape(2, 3, 4)
# Original shape: (2, 3, 4)

transposed = np.transpose(arr_3d, (1, 0, 2))
# New shape: (3, 2, 4)
# Axes reordered: axis 1 → axis 0, axis 0 → axis 1, axis 2 → axis 2
```

### Swapping Axes

```python
arr_3d = np.arange(24).reshape(2, 3, 4)
swapped = np.swapaxes(arr_3d, 0, 1)
# Swaps first and second axes
# New shape: (3, 2, 4)
```

---

## LEVEL 3: Advanced Operations

### Broadcasting

**What is Broadcasting?**
Broadcasting allows operations on arrays of different shapes.

**1D + 2D Broadcasting**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
vec = np.array([10, 20, 30])

result = matrix + vec
# vec is broadcast to each row
# Result:
# [[11 22 33]
#  [14 25 36]]
```

**Column Broadcasting**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
vec = np.array([[10], [20]])

result = matrix + vec
# Result:
# [[11 12 13]
#  [24 25 26]]
```

### Advanced Indexing

**Boolean Masking (2D)**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])

# Get all values > 5
result = matrix[matrix > 5]
# Result: [6 7 8 9]

# Set all values > 5 to 0
matrix[matrix > 5] = 0
```

**Fancy Indexing (2D)**
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])

# Get specific rows
rows = matrix[[0, 2]]
# Result: [[1 2 3], [7 8 9]]

# Get specific elements
elements = matrix[[0, 1, 2], [0, 1, 2]]
# Gets: (0,0), (1,1), (2,2) → diagonal
# Result: [1 5 9]
```

### Advanced 3D Operations

**Meshgrid - Creating coordinate arrays**
```python
x = np.array([1, 2, 3])
y = np.array([4, 5])
X, Y = np.meshgrid(x, y)
# X: [[1 2 3]
#      [1 2 3]]
# Y: [[4 4 4]
#      [5 5 5]]
```

**Einstein Summation (einsum)**
```python
# Matrix multiplication
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
C = np.einsum('ij,jk->ik', A, B)
# Same as: A @ B

# Trace (sum of diagonal)
trace = np.einsum('ii', A)

# Batch matrix multiplication (3D)
A_batch = np.random.rand(10, 3, 4)  # 10 matrices of 3x4
B_batch = np.random.rand(10, 4, 5)  # 10 matrices of 4x5
C_batch = np.einsum('bij,bjk->bik', A_batch, B_batch)
# Result: 10 matrices of 3x5
```

### Tensor Operations (3D+)

**Batched Operations**
```python
# Process multiple images at once
images = np.random.rand(32, 224, 224, 3)
# 32 images, 224x224 pixels, 3 color channels

# Mean across color channels
gray_images = images.mean(axis=3)
# Result: (32, 224, 224)
```

**4D Arrays (Common in Deep Learning)**
```python
# Batch of RGB images
batch = np.random.rand(32, 64, 64, 3)
# Shape: (batch_size, height, width, channels)

print(batch.shape)      # (32, 64, 64, 3)
print(batch[0].shape)   # (64, 64, 3) - First image
```

---

## Quick Reference: Axis Understanding

### For 2D Arrays (Matrix)
```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])

# axis=0 → Down the rows (column-wise operation)
matrix.sum(axis=0)  # [5 7 9] - sum each column

# axis=1 → Across the columns (row-wise operation)
matrix.sum(axis=1)  # [6 15] - sum each row
```

### For 3D Arrays
```python
arr_3d = np.arange(24).reshape(2, 3, 4)
# Shape: (2, 3, 4)

# axis=0 → across depth (layers)
# axis=1 → across rows
# axis=2 → across columns
```

### Memory Rule
- **axis=0** → First dimension (outermost)
- **axis=1** → Second dimension (middle)
- **axis=2** → Third dimension (innermost)
- **axis=-1** → Last dimension

---

## Common Use Cases

### Image as 2D Array (Grayscale)
```python
image = np.random.randint(0, 256, (100, 100))
# 100x100 grayscale image
# Each value is pixel intensity (0-255)
```

### Image as 3D Array (RGB)
```python
image = np.random.randint(0, 256, (100, 100, 3))
# 100x100 RGB image
# Shape: (height, width, channels)
# channels: 0=Red, 1=Green, 2=Blue
```

### Video as 4D Array
```python
video = np.random.randint(0, 256, (30, 1920, 1080, 3))
# Shape: (frames, height, width, channels)
# 30 frames, 1920x1080 resolution, RGB
```

### Dataset as 2D Array
```python
data = np.array([[25, 170, 1],    # age, height, gender
                 [30, 165, 0],
                 [28, 180, 1]])
# Shape: (samples, features)
# Each row is one data sample
```

This guide covers everything about vectors, 2D arrays, and 3D arrays in a clear, organized way!

---
----

# SciPy Library - Ordered Notes

## 1. Visualization (scipy.misc - limited, use matplotlib/seaborn instead)

**Note:** SciPy has minimal visualization. Use `matplotlib` or `seaborn` for plotting.

```python
import matplotlib.pyplot as plt
import numpy as np

# Example: Plot a signal
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.plot(x, y)
plt.show()
```

---

## 2. Filtering (scipy.signal)

### `signal.butter(N, Wn, btype='low')`
Design Butterworth filter (N=order, Wn=cutoff frequency)
```python
from scipy import signal
b, a = signal.butter(4, 0.2, 'low')
```

### `signal.filtfilt(b, a, data)`
Zero-phase digital filtering (forward-backward)
```python
filtered = signal.filtfilt(b, a, data)
```

### `signal.lfilter(b, a, data)`
One-directional digital filter
```python
filtered = signal.lfilter(b, a, data)
```

### `signal.medfilt(data, kernel_size)`
Median filter for noise reduction
```python
filtered = signal.medfilt(data, kernel_size=5)
```

### `signal.savgol_filter(data, window_length, polyorder)`
Savitzky-Golay smoothing filter
```python
smoothed = signal.savgol_filter(data, 51, 3)
```

### `signal.wiener(data)`
Wiener filter for denoising
```python
denoised = signal.wiener(data)
```

---

## 3. Spectral Analysis (scipy.signal, scipy.fft)

### `fft.fft(signal)`
Fast Fourier Transform
```python
from scipy.fft import fft, fftfreq
spectrum = fft(signal)
```

### `fft.ifft(spectrum)`
Inverse FFT
```python
reconstructed = fft.ifft(spectrum)
```

### `fft.fftfreq(n, d)`
Frequency bins for FFT (n=samples, d=sample spacing)
```python
freqs = fft.fftfreq(len(signal), 1/fs)
```

### `signal.periodogram(data, fs)`
Power spectral density estimation
```python
f, Pxx = signal.periodogram(data, fs=1000)
```

### `signal.welch(data, fs)`
Welch's method for PSD (reduces noise)
```python
f, Pxx = signal.welch(data, fs=1000, nperseg=256)
```

### `signal.spectrogram(data, fs)`
Time-frequency spectrogram
```python
f, t, Sxx = signal.spectrogram(data, fs=1000)
plt.pcolormesh(t, f, 10*np.log10(Sxx))
```

### `signal.stft(data, fs)`
Short-Time Fourier Transform
```python
f, t, Zxx = signal.stft(data, fs=1000)
```

### `signal.istft(Zxx, fs)`
Inverse STFT
```python
t, reconstructed = signal.istft(Zxx, fs=1000)
```

---

## 4. Optimization (scipy.optimize)

### `optimize.minimize(fun, x0, method)`
Minimize scalar/vector function
```python
from scipy import optimize
result = optimize.minimize(lambda x: x**2, x0=2)
```

### `optimize.minimize_scalar(fun)`
Minimize single-variable function
```python
result = optimize.minimize_scalar(lambda x: (x-2)**2)
```

### `optimize.curve_fit(f, xdata, ydata)`
Fit function to data (nonlinear least squares)
```python
params, cov = optimize.curve_fit(lambda x, a, b: a*x+b, xdata, ydata)
```

### `optimize.root(fun, x0)`
Find roots of equations
```python
sol = optimize.root(lambda x: x**2 - 4, x0=1)
```

### `optimize.fsolve(func, x0)`
Solve nonlinear equations
```python
solution = optimize.fsolve(lambda x: x**2 - 4, x0=1)
```

### `optimize.least_squares(fun, x0)`
Solve nonlinear least-squares problems
```python
result = optimize.least_squares(lambda x: x**2 - 4, x0=1)
```

### `optimize.linprog(c, A_ub, b_ub)`
Linear programming minimization
```python
result = optimize.linprog([1, 2], A_ub=[[-1, 1]], b_ub=[1])
```

### `optimize.differential_evolution(func, bounds)`
Global optimization using genetic algorithm
```python
result = optimize.differential_evolution(lambda x: x**2, bounds=[(-5, 5)])
```

---

## Quick Example Pipeline

```python
import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import matplotlib.pyplot as plt

# Generate noisy signal
fs = 1000
t = np.linspace(0, 1, fs)
clean = np.sin(2*np.pi*50*t)
noisy = clean + 0.5*np.random.randn(fs)

# 1. Filter
b, a = signal.butter(4, 0.15, 'low')
filtered = signal.filtfilt(b, a, noisy)

# 2. Spectral Analysis
freqs = fftfreq(len(filtered), 1/fs)
spectrum = np.abs(fft(filtered))

# 3. Visualization
plt.figure(figsize=(12, 4))
plt.subplot(131); plt.plot(t, noisy); plt.title('Noisy')
plt.subplot(132); plt.plot(t, filtered); plt.title('Filtered')
plt.subplot(133); plt.plot(freqs[:fs//2], spectrum[:fs//2]); plt.title('Spectrum')
plt.tight_layout(); plt.show()
```

---

**Note:** Run each cell in Jupyter for interactive exploration!

---
---

# Matplotlib Complete Guide - Level 1 to 3

---

## 📘 LEVEL 1: FUNDAMENTALS (Beginner)

### 1.1 Basic Plotting Structure

**Two Ways to Plot:**
1. **Pyplot Interface** (MATLAB-style, quick and easy)
2. **Object-Oriented Interface** (Professional, more control)

plot all inputs paramsna dn its means i mena most ussed and output
    params like format strings like k--... used in color , linestyle=, lable, markers 
plt of funtion like legend, grid, right_layout [padding]

```python
import matplotlib.pyplot as plt
import numpy as np

# Method 1: Pyplot (Simple)
plt.plot([1, 2, 3], [4, 5, 6] ,color="k",linestyle='--', label = "All devs" , marker='o')
plt.plot([1, 2, 3], [5, 6, 8],"b", label = "python",marker='x')
plt.xlabel('X-axis Label')
plt.ylabel('Y-axis Label')
plt.title('Simple Plot Example')
plt.legend() # Show legend
plt.tight_layout()  # Adjust layout to prevent clipping of labels
plt.grid(True) # Add grid lines
plt.show() # shows the plot
# plt.style.available  # To see available themes or plt.xkcd() for hand-drawn comic style
# plt.style.use('ggplot')  # Example of using a style
# plt.savefig('plot.png') saves plot as img
```

![Figure](kb-media:31eb163ead267d398c20.png)

### barcharts and data from csv

```python
width = 0.25
x=np.array([1,2,3]) # using np array because list -> TypeError: unsupported operand type(s) for -: 'list' and 'float'

plt.bar(x - width/2, [4, 5, 6] ,color="b",width = width, label = "All devs")
plt.bar(x + width/2, [5, 6, 8],color = "k",width= width, label = "python")
```

![Figure](kb-media:9ff102d562ef4ca25ac6.png)

```python
# Method 2: Object-Oriented (Recommended)
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [4, 5, 6])
plt.show()
```

![Figure](kb-media:0c144499ac5d159df2c8.png)

```python
### 1.2 Basic Plot Types

#### Line Plot

x = np.linspace(0, 10, 100)
y = np.sin(x)

fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_xlabel('X-axis')
ax.set_ylabel('Y-axis')
ax.set_title('Sine Wave')
plt.show()


#### Scatter Plot

x = np.random.rand(50)
y = np.random.rand(50)

fig, ax = plt.subplots()
ax.scatter(x, y, c='red', marker='o', s=100, alpha=0.5)
ax.set_title('Scatter Plot')
plt.show()


#### Bar Plot

categories = ['A', 'B', 'C', 'D']
values = [23, 45, 56, 78]

fig, ax = plt.subplots()
ax.bar(categories, values, color='skyblue')
ax.set_ylabel('Values')
plt.show()


#### Histogram

data = np.random.randn(1000)

fig, ax = plt.subplots()
ax.hist(data, bins=30, color='green', alpha=0.7)
ax.set_xlabel('Value')
ax.set_ylabel('Frequency')
plt.show()
```

![Figure](kb-media:3f3c446c006368a90929.png)

![Figure](kb-media:25a9879696dbc3c70fe4.png)

![Figure](kb-media:984a0e62db93788fa432.png)

![Figure](kb-media:c748d157084b360c005b.png)

### 1.3 Essential Customizations

```python
fig, ax = plt.subplots(figsize=(8, 6))

# Plot with customizations
ax.plot(x, y, 
        color='blue',        # Color
        linewidth=2,         # Line width
        linestyle='--',      # Line style: '-', '--', '-.', ':'
        marker='o',          # Marker style
        markersize=5,        # Marker size
        label='Sine')        # Legend label

# Labels and title
ax.set_xlabel('X-axis', fontsize=12)
ax.set_ylabel('Y-axis', fontsize=12)
ax.set_title('My Plot', fontsize=14, fontweight='bold')

# Grid and legend
ax.grid(True, alpha=0.3)
ax.legend(loc='upper right')

plt.show()
```

### 1.4 Saving Figures

```python
# Save in different formats
fig.savefig('plot.png', dpi=300, bbox_inches='tight')
fig.savefig('plot.pdf', bbox_inches='tight')
fig.savefig('plot.svg', bbox_inches='tight')
```

---

## 📗 LEVEL 2: INTERMEDIATE

### 2.1 Subplots and Layout

#### Creating Multiple Subplots
```python
# Method 1: Regular grid
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title('Sine')

axes[0, 1].plot(x, np.cos(x))
axes[0, 1].set_title('Cosine')

axes[1, 0].plot(x, np.tan(x))
axes[1, 0].set_title('Tangent')

axes[1, 1].plot(x, x**2)
axes[1, 1].set_title('Quadratic')

plt.tight_layout()
plt.show()
```

#### Custom Subplot Layout
```python
# Using subplot2grid for custom layouts
fig = plt.figure(figsize=(10, 8))

ax1 = plt.subplot2grid((3, 3), (0, 0), colspan=3)  # Top spanning
ax2 = plt.subplot2grid((3, 3), (1, 0), colspan=2)  # Middle left
ax3 = plt.subplot2grid((3, 3), (1, 2), rowspan=2)  # Right side
ax4 = plt.subplot2grid((3, 3), (2, 0))
ax5 = plt.subplot2grid((3, 3), (2, 1))

plt.tight_layout()
plt.show()
```

### 2.2 Advanced Plot Types

#### Contour Plot
```python
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

fig, ax = plt.subplots()
contour = ax.contourf(X, Y, Z, levels=20, cmap='viridis')
plt.colorbar(contour, ax=ax)
ax.set_title('Contour Plot')
plt.show()
```

#### Heatmap
```python
data = np.random.rand(10, 10)

fig, ax = plt.subplots()
im = ax.imshow(data, cmap='hot', interpolation='nearest')
plt.colorbar(im, ax=ax)
ax.set_title('Heatmap')
plt.show()
```

#### Box Plot
```python
data = [np.random.normal(0, std, 100) for std in range(1, 4)]

fig, ax = plt.subplots()
ax.boxplot(data, labels=['A', 'B', 'C'])
ax.set_ylabel('Values')
plt.show()
```

#### Violin Plot
```python
fig, ax = plt.subplots()
parts = ax.violinplot(data, showmeans=True, showmedians=True)
ax.set_xticks([1, 2, 3])
ax.set_xticklabels(['A', 'B', 'C'])
plt.show()
```

### 2.3 Customizing Axes

```python
fig, ax = plt.subplots()
ax.plot(x, y)

# Axis limits
ax.set_xlim(0, 10)
ax.set_ylim(-1.5, 1.5)

# Axis scales
ax.set_xscale('log')  # 'linear', 'log', 'symlog', 'logit'
ax.set_yscale('linear')

# Tick customization
ax.set_xticks([0, 2, 4, 6, 8, 10])
ax.set_xticklabels(['zero', 'two', 'four', 'six', 'eight', 'ten'], rotation=45)

# Spine customization
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.show()
```

### 2.4 Text and Annotations

```python
fig, ax = plt.subplots()
ax.plot(x, np.sin(x))

# Add text
ax.text(5, 0.5, 'Peak region', fontsize=12, color='red')

# Annotate with arrow
ax.annotate('Maximum', 
            xy=(np.pi/2, 1),           # Point to annotate
            xytext=(3, 0.5),            # Text position
            arrowprops=dict(arrowstyle='->', color='red'))

plt.show()
```

### 2.5 Colors and Colormaps

```python
# Using colormaps
x = np.linspace(0, 10, 100)
colors = np.linspace(0, 1, 100)

fig, ax = plt.subplots()
for i in range(10):
    ax.plot(x, np.sin(x + i*0.5), color=plt.cm.viridis(i/10))

# Common colormaps: 'viridis', 'plasma', 'inferno', 'magma', 'cividis'
# Sequential: 'Blues', 'Greens', 'Reds', 'YlOrRd'
# Diverging: 'RdBu', 'coolwarm', 'seismic'

plt.show()
```

---

## 📕 LEVEL 3: ADVANCED

### 3.1 Figure and Axes Architecture

```python
# Complete control over figure creation
fig = plt.figure(figsize=(12, 8), dpi=100)

# Add axes manually with positions [left, bottom, width, height]
ax1 = fig.add_axes([0.1, 0.5, 0.8, 0.4])   # Main plot
ax2 = fig.add_axes([0.1, 0.1, 0.8, 0.3])   # Secondary plot
ax3 = fig.add_axes([0.7, 0.65, 0.2, 0.2])  # Inset plot

ax1.plot(x, np.sin(x))
ax2.plot(x, np.cos(x))
ax3.scatter(x[:10], np.sin(x[:10]))

plt.show()
```

### 3.2 Twin Axes (Multiple Y-axes)

```python
fig, ax1 = plt.subplots()

# First y-axis
ax1.plot(x, np.sin(x), 'b-', label='Sine')
ax1.set_xlabel('X-axis')
ax1.set_ylabel('Sine', color='b')
ax1.tick_params(axis='y', labelcolor='b')

# Second y-axis sharing same x-axis
ax2 = ax1.twinx()
ax2.plot(x, np.exp(x/5), 'r-', label='Exponential')
ax2.set_ylabel('Exponential', color='r')
ax2.tick_params(axis='y', labelcolor='r')

fig.tight_layout()
plt.show()
```

### 3.3 3D Plotting

```python
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# 3D Surface
x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

surf = ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.8)
fig.colorbar(surf, ax=ax)

ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
ax.set_title('3D Surface')

plt.show()
```

#### 3D Scatter and Lines
```python
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# 3D Scatter
x = np.random.rand(100)
y = np.random.rand(100)
z = np.random.rand(100)
colors = z

ax.scatter(x, y, z, c=colors, cmap='viridis', s=50)

# 3D Line
t = np.linspace(0, 10, 100)
ax.plot(np.sin(t), np.cos(t), t, 'r-', linewidth=2)

plt.show()
```

### 3.4 Animation

```python
from matplotlib.animation import FuncAnimation

fig, ax = plt.subplots()
x = np.linspace(0, 2*np.pi, 100)
line, = ax.plot(x, np.sin(x))

def animate(frame):
    line.set_ydata(np.sin(x + frame/10))
    return line,

ani = FuncAnimation(fig, animate, frames=100, interval=50, blit=True)
plt.show()

# Save animation
# ani.save('animation.gif', writer='pillow', fps=20)
```

### 3.5 Style Sheets

```python
# View available styles
print(plt.style.available)

# Use a style
plt.style.use('seaborn-v0_8-darkgrid')
# Other popular: 'ggplot', 'fivethirtyeight', 'bmh', 'dark_background'

fig, ax = plt.subplots()
ax.plot(x, np.sin(x))
plt.show()

# Reset to default
plt.style.use('default')
```

### 3.6 Custom Styling with rcParams

```python
# Temporarily modify settings
with plt.rc_context({'font.size': 14, 'lines.linewidth': 2}):
    fig, ax = plt.subplots()
    ax.plot(x, y)
    plt.show()

# Permanently modify (for session)
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 12
plt.rcParams['lines.linewidth'] = 2
plt.rcParams['axes.grid'] = True
plt.rcParams['grid.alpha'] = 0.3
```

### 3.7 Complex Layouts with GridSpec

```python
import matplotlib.gridspec as gridspec

fig = plt.figure(figsize=(12, 8))
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.3, wspace=0.3)

# Create subplots with different sizes
ax1 = fig.add_subplot(gs[0, :])      # Top row, all columns
ax2 = fig.add_subplot(gs[1, :-1])    # Middle row, first 2 columns
ax3 = fig.add_subplot(gs[1:, -1])    # Last column, bottom 2 rows
ax4 = fig.add_subplot(gs[-1, 0])     # Bottom left
ax5 = fig.add_subplot(gs[-1, 1])     # Bottom middle

ax1.plot(x, np.sin(x))
ax2.plot(x, np.cos(x))
ax3.plot(x, np.tan(x))
ax4.scatter(x[:20], np.sin(x[:20]))
ax5.bar(range(10), np.random.rand(10))

plt.show()
```

### 3.8 Interactive Features

```python
# Enable interactive mode
plt.ion()

fig, ax = plt.subplots()
line, = ax.plot([], [])
ax.set_xlim(0, 2*np.pi)
ax.set_ylim(-1, 1)

for i in range(100):
    x = np.linspace(0, 2*np.pi, 100)
    y = np.sin(x + i/10)
    line.set_data(x, y)
    plt.pause(0.05)

plt.ioff()
plt.show()
```

### 3.9 Event Handling

```python
def onclick(event):
    if event.inaxes:
        print(f'Clicked at x={event.xdata:.2f}, y={event.ydata:.2f}')

fig, ax = plt.subplots()
ax.plot(x, np.sin(x))

# Connect event
cid = fig.canvas.mpl_connect('button_press_event', onclick)

plt.show()
```

### 3.10 Professional Publication-Ready Plots

```python
# Set publication style
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman']
plt.rcParams['font.size'] = 10
plt.rcParams['axes.linewidth'] = 1.5
plt.rcParams['xtick.major.width'] = 1.5
plt.rcParams['ytick.major.width'] = 1.5

fig, ax = plt.subplots(figsize=(6, 4))

# Plot with error bars
x = np.linspace(0, 10, 20)
y = 2*x + 1 + np.random.randn(20)
yerr = np.random.rand(20)

ax.errorbar(x, y, yerr=yerr, fmt='o', capsize=3, capthick=1.5, 
            label='Data', color='#2C3E50', markersize=6)

# Fit line
z = np.polyfit(x, y, 1)
p = np.poly1d(z)
ax.plot(x, p(x), '--', color='#E74C3C', linewidth=2, label='Fit')

ax.set_xlabel('X-axis (units)', fontsize=12)
ax.set_ylabel('Y-axis (units)', fontsize=12)
ax.set_title('Publication-Ready Plot', fontsize=14, fontweight='bold')
ax.legend(frameon=False, loc='upper left')
ax.grid(True, alpha=0.3, linestyle='--')

plt.tight_layout()
plt.savefig('publication_plot.pdf', dpi=300, bbox_inches='tight')
plt.show()
```

---

## 🎯 KEY CONCEPTS TO REMEMBER

### Figure vs Axes
- **Figure**: The entire window/page (container)
- **Axes**: The actual plot area (can have multiple per figure)

### Common Patterns
```python
# Always use this pattern for control
fig, ax = plt.subplots()

# For multiple plots
fig, axes = plt.subplots(2, 2)
```

### Essential Methods
- **ax.plot()** - line plots
- **ax.scatter()** - scatter plots
- **ax.bar()** - bar charts
- **ax.hist()** - histograms
- **ax.imshow()** - images/heatmaps
- **ax.contour()** - contour plots

### Customization Hierarchy
1. Figure level (size, dpi)
2. Axes level (limits, labels, title)
3. Plot level (color, style, markers)
4. Global level (rcParams, styles)

---

## 📝 QUICK REFERENCE

### Line Styles
- `'-'` solid
- `'--'` dashed
- `'-.'` dash-dot
- `':'` dotted

### Markers
- `'o'` circle
- `'s'` square
- `'^'` triangle up
- `'*'` star
- `'+'` plus
- `'x'` x-mark

### Colors
- Named: `'red'`, `'blue'`, `'green'`
- Hex: `'#FF5733'`
- RGB tuple: `(0.1, 0.2, 0.5)`
- Short codes: `'r'`, `'b'`, `'g'`, `'c'`, `'m'`, `'y'`, `'k'`, `'w'`

### Common Arguments
- **figsize**: `(width, height)` in inches
- **dpi**: dots per inch (resolution)
- **alpha**: transparency (0-1)
- **linewidth** or **lw**: line thickness
- **markersize** or **ms**: marker size
- **label**: for legends

---

## 🚀 PRACTICE EXERCISES

1. **Level 1**: Create a line plot with custom colors, labels, and grid
2. **Level 2**: Create a 2x2 subplot with different plot types in each
3. **Level 3**: Create an animated 3D surface plot with custom colormap

**Remember**: Practice with real data! Use `plt.show()` to display, always use `fig, ax = plt.subplots()` pattern, and save your work with `fig.savefig()`

---
---

# Scikit-Learn Complete Guide - Level 1 to 3

---

## 📘 LEVEL 1: FUNDAMENTALS (Beginner)

### 1.1 Basic Workflow

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# 1. Load data
X, y = load_data()  # Features and target

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Preprocess
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Train model
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# 5. Predict
y_pred = model.predict(X_test_scaled)

# 6. Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')
```

### 1.2 Loading Sample Datasets

```python
from sklearn.datasets import load_iris, load_diabetes, load_wine, make_classification

# Built-in datasets
iris = load_iris()
X, y = iris.data, iris.target

# Generate synthetic data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
```

### 1.3 Train-Test Split

```python
from sklearn.model_selection import train_test_split

# Basic split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Stratified split (keeps class distribution)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
```

### 1.4 Basic Preprocessing

#### StandardScaler (Z-score normalization)
```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Use same parameters
```

#### MinMaxScaler (0-1 scaling)
```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X_train)
```

#### Label Encoding
```python
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
y_encoded = le.fit_transform(['cat', 'dog', 'cat', 'bird'])
# Output: [0, 2, 0, 1]
```

### 1.5 Basic Models

#### Linear Regression
```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f'Coefficients: {model.coef_}')
print(f'Intercept: {model.intercept_}')
```

#### Logistic Regression (Classification)
```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)  # Probabilities
```

#### Decision Tree
```python
from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(max_depth=5, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

#### K-Nearest Neighbors
```python
from sklearn.neighbors import KNeighborsClassifier

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

### 1.6 Basic Evaluation Metrics

#### Classification Metrics
```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

print(f'Accuracy: {accuracy:.3f}')
print(f'Precision: {precision:.3f}')
print(f'Recall: {recall:.3f}')
print(f'F1-Score: {f1:.3f}')
```

#### Regression Metrics
```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'MSE: {mse:.3f}')
print(f'MAE: {mae:.3f}')
print(f'R²: {r2:.3f}')
```

#### Confusion Matrix
```python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt

cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot()
plt.show()
```

---

## 📗 LEVEL 2: INTERMEDIATE

### 2.1 Cross-Validation

#### K-Fold Cross-Validation
```python
from sklearn.model_selection import cross_val_score

model = LogisticRegression()
scores = cross_val_score(model, X, y, cv=5)  # 5-fold CV

print(f'Scores: {scores}')
print(f'Mean: {scores.mean():.3f} (+/- {scores.std():.3f})')
```

#### Stratified K-Fold
```python
from sklearn.model_selection import StratifiedKFold, cross_val_score

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=skf)
```

#### Cross-Val Predict
```python
from sklearn.model_selection import cross_val_predict

y_pred = cross_val_predict(model, X, y, cv=5)
```

### 2.2 Hyperparameter Tuning

#### GridSearchCV (Exhaustive search)
```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(random_state=42)

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(model, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train, y_train)

print(f'Best parameters: {grid_search.best_params_}')
print(f'Best score: {grid_search.best_score_:.3f}')

best_model = grid_search.best_estimator_
```

#### RandomizedSearchCV (Faster)
```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint

param_dist = {
    'n_estimators': randint(50, 200),
    'max_depth': [5, 10, 15, None],
    'min_samples_split': randint(2, 20)
}

random_search = RandomizedSearchCV(model, param_dist, n_iter=20, cv=5, random_state=42, n_jobs=-1)
random_search.fit(X_train, y_train)

print(f'Best parameters: {random_search.best_params_}')
```

### 2.3 Advanced Preprocessing

#### One-Hot Encoding
```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(sparse_output=False)
X_encoded = encoder.fit_transform(X_categorical)

# Get feature names
feature_names = encoder.get_feature_names_out()
```

#### Polynomial Features
```python
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)
```

#### Handling Missing Values
```python
from sklearn.impute import SimpleImputer

# Mean imputation
imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)

# Other strategies: 'median', 'most_frequent', 'constant'
```

#### Feature Selection
```python
from sklearn.feature_selection import SelectKBest, f_classif

selector = SelectKBest(f_classif, k=10)  # Select top 10 features
X_selected = selector.fit_transform(X_train, y_train)

# Get selected feature indices
selected_features = selector.get_support(indices=True)
```

### 2.4 Ensemble Methods

#### Random Forest
```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

# Feature importance
importances = model.feature_importances_
```

#### Gradient Boosting
```python
from sklearn.ensemble import GradientBoostingClassifier

model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
model.fit(X_train, y_train)
```

#### AdaBoost
```python
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

base_model = DecisionTreeClassifier(max_depth=1)
model = AdaBoostClassifier(estimator=base_model, n_estimators=50, random_state=42)
model.fit(X_train, y_train)
```

#### Voting Classifier
```python
from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

model1 = LogisticRegression()
model2 = SVC(probability=True)
model3 = RandomForestClassifier()

voting = VotingClassifier(
    estimators=[('lr', model1), ('svc', model2), ('rf', model3)],
    voting='soft'  # 'soft' uses probabilities, 'hard' uses majority vote
)
voting.fit(X_train, y_train)
```

### 2.5 Support Vector Machines

```python
from sklearn.svm import SVC, SVR

# Classification
svc = SVC(kernel='rbf', C=1.0, gamma='scale')
svc.fit(X_train, y_train)

# Regression
svr = SVR(kernel='rbf', C=1.0, gamma='scale')
svr.fit(X_train, y_train)

# Kernels: 'linear', 'poly', 'rbf', 'sigmoid'
```

### 2.6 Clustering (Unsupervised)

#### K-Means
```python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X)
centers = kmeans.cluster_centers_

# Inertia (within-cluster sum of squares)
inertia = kmeans.inertia_
```

#### DBSCAN
```python
from sklearn.cluster import DBSCAN

dbscan = DBSCAN(eps=0.5, min_samples=5)
labels = dbscan.fit_predict(X)
```

#### Hierarchical Clustering
```python
from sklearn.cluster import AgglomerativeClustering

model = AgglomerativeClustering(n_clusters=3, linkage='ward')
labels = model.fit_predict(X)
```

### 2.7 Dimensionality Reduction

#### PCA (Principal Component Analysis)
```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Explained variance
explained_var = pca.explained_variance_ratio_
print(f'Explained variance: {explained_var}')
```

#### t-SNE
```python
from sklearn.manifold import TSNE

tsne = TSNE(n_components=2, random_state=42)
X_tsne = tsne.fit_transform(X)
```

---

## 📕 LEVEL 3: ADVANCED

### 3.1 Pipelines

#### Basic Pipeline
```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', SVC())
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
```

#### Pipeline with Feature Selection
```python
from sklearn.feature_selection import SelectKBest, f_classif

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('feature_selection', SelectKBest(f_classif, k=10)),
    ('classifier', RandomForestClassifier())
])

pipeline.fit(X_train, y_train)
```

#### ColumnTransformer (Different preprocessing for different columns)
```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

numeric_features = [0, 1, 2]
categorical_features = [3, 4]

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(), categorical_features)
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression())
])

pipeline.fit(X_train, y_train)
```

### 3.2 Custom Transformers

```python
from sklearn.base import BaseEstimator, TransformerMixin

class LogTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, columns=None):
        self.columns = columns
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        X_copy = X.copy()
        if self.columns:
            X_copy[:, self.columns] = np.log1p(X_copy[:, self.columns])
        else:
            X_copy = np.log1p(X_copy)
        return X_copy

# Use in pipeline
pipeline = Pipeline([
    ('log_transform', LogTransformer(columns=[0, 1])),
    ('scaler', StandardScaler()),
    ('model', LinearRegression())
])
```

### 3.3 Model Persistence

```python
import joblib
import pickle

# Save model (joblib - recommended)
joblib.dump(model, 'model.pkl')

# Load model
model = joblib.load('model.pkl')

# Using pickle
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)
```

### 3.4 Advanced Cross-Validation

#### Time Series Split
```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)
for train_idx, test_idx in tscv.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    # Train and evaluate
```

#### Leave-One-Out CV
```python
from sklearn.model_selection import LeaveOneOut

loo = LeaveOneOut()
scores = cross_val_score(model, X, y, cv=loo)
```

### 3.5 Calibration

```python
from sklearn.calibration import CalibratedClassifierCV

base_model = RandomForestClassifier()
calibrated_model = CalibratedClassifierCV(base_model, cv=5, method='sigmoid')
calibrated_model.fit(X_train, y_train)

# Get calibrated probabilities
proba = calibrated_model.predict_proba(X_test)
```

### 3.6 Multi-Output Models

```python
from sklearn.multioutput import MultiOutputClassifier, MultiOutputRegressor

# Multiple target variables
model = MultiOutputClassifier(RandomForestClassifier())
model.fit(X_train, y_train_multi)  # y_train_multi has multiple columns
```

### 3.7 Imbalanced Data Handling

#### Class Weights
```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(class_weight='balanced')
model.fit(X_train, y_train)
```

#### SMOTE (Synthetic Minority Over-sampling)
```python
from imblearn.over_sampling import SMOTE

smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
```

### 3.8 Learning Curves

```python
from sklearn.model_selection import learning_curve
import numpy as np

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5, n_jobs=-1,
    train_sizes=np.linspace(0.1, 1.0, 10)
)

# Plot learning curves
import matplotlib.pyplot as plt
plt.plot(train_sizes, train_scores.mean(axis=1), label='Training score')
plt.plot(train_sizes, val_scores.mean(axis=1), label='Validation score')
plt.xlabel('Training size')
plt.ylabel('Score')
plt.legend()
plt.show()
```

### 3.9 Partial Dependence Plots

```python
from sklearn.inspection import PartialDependenceDisplay

fig, ax = plt.subplots(figsize=(12, 4))
PartialDependenceDisplay.from_estimator(model, X_train, features=[0, 1, (0, 1)], ax=ax)
plt.show()
```

### 3.10 Advanced Metrics

#### ROC Curve and AUC
```python
from sklearn.metrics import roc_curve, roc_auc_score, auc

y_proba = model.predict_proba(X_test)[:, 1]
fpr, tpr, thresholds = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.plot(fpr, tpr, label=f'ROC curve (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], 'k--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.legend()
plt.show()
```

#### Precision-Recall Curve
```python
from sklearn.metrics import precision_recall_curve, average_precision_score

precision, recall, thresholds = precision_recall_curve(y_test, y_proba)
ap = average_precision_score(y_test, y_proba)

plt.plot(recall, precision, label=f'AP = {ap:.2f}')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.legend()
plt.show()
```

#### Classification Report
```python
from sklearn.metrics import classification_report

print(classification_report(y_test, y_pred, target_names=['Class 0', 'Class 1']))
```

### 3.11 Neural Networks (MLPClassifier/Regressor)

```python
from sklearn.neural_network import MLPClassifier

model = MLPClassifier(
    hidden_layer_sizes=(100, 50),  # Two hidden layers
    activation='relu',
    solver='adam',
    max_iter=500,
    random_state=42
)

model.fit(X_train, y_train)
```

### 3.12 Bayesian Optimization

```python
from sklearn.model_selection import cross_val_score
from scipy.optimize import minimize

def objective(params):
    n_estimators, max_depth = int(params[0]), int(params[1])
    model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth)
    score = cross_val_score(model, X_train, y_train, cv=3).mean()
    return -score  # Minimize negative score

result = minimize(objective, x0=[100, 10], bounds=[(50, 200), (5, 20)], method='L-BFGS-B')
```

---

## 🎯 KEY CONCEPTS TO REMEMBER

### Sklearn API Pattern
All estimators follow the same pattern:
```python
model = Model(parameters)      # Initialize
model.fit(X_train, y_train)    # Train
predictions = model.predict(X_test)  # Predict
```

### Transformers vs Estimators
- **Transformers**: Transform data (`.fit_transform()`, `.transform()`)
- **Estimators**: Make predictions (`.fit()`, `.predict()`)
- **Both**: Can be chained in pipelines

### Cross-Validation Best Practices
- Always use CV for model evaluation
- Use `stratified` splits for classification
- Use `TimeSeriesSplit` for time-series data
- Never use test data during CV

### Pipeline Benefits
- Prevents data leakage
- Simplifies code
- Easy to deploy
- Enables grid search on entire pipeline

---

## 📝 QUICK REFERENCE

### Model Selection Guide

**Classification:**
- Small dataset: Logistic Regression, SVM
- Large dataset: Random Forest, Gradient Boosting
- High dimensional: Naive Bayes, Linear SVM
- Non-linear: Random Forest, SVM (RBF kernel)

**Regression:**
- Linear relationships: Linear Regression, Ridge, Lasso
- Non-linear: Random Forest, Gradient Boosting, SVR
- Many features: Ridge, Lasso (regularization)

**Clustering:**
- Known number of clusters: K-Means
- Unknown clusters: DBSCAN, Hierarchical
- High dimensional: Spectral Clustering

### Common Hyperparameters

**Random Forest:**
- `n_estimators`: 100-500
- `max_depth`: 5-20
- `min_samples_split`: 2-10

**Gradient Boosting:**
- `n_estimators`: 100-1000
- `learning_rate`: 0.01-0.1
- `max_depth`: 3-7

**SVM:**
- `C`: 0.1-100 (regularization)
- `gamma`: 'scale' or 0.001-1
- `kernel`: 'rbf', 'linear', 'poly'

### Metrics Cheat Sheet

**Classification:**
- Balanced classes: Accuracy
- Imbalanced: F1-score, ROC-AUC
- Cost-sensitive: Precision/Recall

**Regression:**
- Standard: MSE, RMSE
- Outliers present: MAE
- Comparison: R²

---

## 🚀 BEST PRACTICES

1. **Always split data before any preprocessing**
2. **Use pipelines to prevent data leakage**
3. **Scale features for distance-based algorithms (KNN, SVM)**
4. **Use cross-validation for model selection**
5. **Grid search on validation set, final evaluation on test set**
6. **Check for overfitting (compare train vs validation scores)**
7. **Save models with versioning**
8. **Document hyperparameters and preprocessing steps**

---

## 🎓 PRACTICE WORKFLOW

```python
# 1. Load and explore data
X, y = load_data()

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier())
])

# 4. Hyperparameter tuning with CV
param_grid = {'model__n_estimators': [100, 200], 'model__max_depth': [5, 10]}
grid_search = GridSearchCV(pipeline, param_grid, cv=5)
grid_search.fit(X_train, y_train)

# 5. Evaluate on test set
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)
print(f'Test Accuracy: {accuracy_score(y_test, y_pred):.3f}')

# 6. Save model
joblib.dump(best_model, 'final_model.pkl')
```
