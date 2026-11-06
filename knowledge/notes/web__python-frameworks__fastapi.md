# Python os Library - Quick Notes

## Import
```python
import os
```

## Current Directory
```python
# Get current working directory
current_dir = os.getcwd()
print(current_dir)  # /home/user/project

# Change directory
os.chdir('/path/to/directory')

# Change to parent directory
os.chdir('..')
```

## File & Directory Operations
```python
# Create directory
os.mkdir('new_folder')

# Create nested directories
os.makedirs('parent/child/grandchild')

# Remove empty directory
os.rmdir('folder')

# Remove directory tree
os.removedirs('parent/child/grandchild')

# Rename/move file or directory
os.rename('old_name.txt', 'new_name.txt')
os.rename('folder1', 'folder2')

# Delete file
os.remove('file.txt')
# or
os.unlink('file.txt')
```

## List Directory Contents
```python
# List all files and folders
items = os.listdir('.')  # Current directory
items = os.listdir('/path/to/dir')

# Example
for item in os.listdir('.'):
    print(item)

# List with full paths
for item in os.listdir('.'):
    full_path = os.path.join('.', item)
    print(full_path)
```

## Check File/Directory Existence
```python
# Check if path exists
os.path.exists('file.txt')  # True or False
os.path.exists('folder')    # True or False

# Check if it's a file
os.path.isfile('file.txt')  # True if file

# Check if it's a directory
os.path.isdir('folder')     # True if directory

# Check if it's a symbolic link
os.path.islink('link')      # True if symlink

# Check if path is absolute
os.path.isabs('/home/user')  # True
os.path.isabs('file.txt')    # False
```

## Path Operations
```python
# Join paths (works across OS)
path = os.path.join('folder', 'subfolder', 'file.txt')
# Windows: folder\subfolder\file.txt
# Linux/Mac: folder/subfolder/file.txt

# Get absolute path
abs_path = os.path.abspath('file.txt')
# /home/user/project/file.txt

# Get directory name (parent folder)
dir_name = os.path.dirname('/home/user/file.txt')
# /home/user

# Get filename (base name)
file_name = os.path.basename('/home/user/file.txt')
# file.txt

# Split path into directory and file
dir_path, file_name = os.path.split('/home/user/file.txt')
# dir_path = '/home/user', file_name = 'file.txt'

# Split extension
name, ext = os.path.splitext('document.pdf')
# name = 'document', ext = '.pdf'
```

## File Information
```python
# Get file size (bytes)
size = os.path.getsize('file.txt')

# Get file stats
stats = os.stat('file.txt')
print(stats.st_size)   # Size in bytes
print(stats.st_mtime)  # Last modified time
print(stats.st_atime)  # Last access time
print(stats.st_ctime)  # Creation time (Windows) / metadata change (Unix)

# Check file permissions
mode = os.stat('file.txt').st_mode
```

## Walk Directory Tree
```python
# Traverse all subdirectories
for root, dirs, files in os.walk('/path/to/directory'):
    print(f"Directory: {root}")
    print(f"Subdirectories: {dirs}")
    print(f"Files: {files}")
    print()

# Find all .txt files
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.txt'):
            full_path = os.path.join(root, file)
            print(full_path)
```

## Environment Variables
```python
# Get environment variable
home = os.environ.get('HOME')
path = os.environ.get('PATH')
user = os.environ.get('USER')

# Get with default value
db_url = os.environ.get('DATABASE_URL', 'localhost:5432')

# Set environment variable (current process only)
os.environ['API_KEY'] = 'secret123'

# Get all environment variables
all_vars = os.environ

# Check if variable exists
if 'API_KEY' in os.environ:
    print("API_KEY is set")
```

## System Information
```python
# Operating system name
os.name  # 'posix' (Linux/Mac), 'nt' (Windows)

# Detailed system info
import platform
platform.system()    # 'Linux', 'Windows', 'Darwin' (Mac)
platform.release()   # OS version

# Path separator
os.sep      # '/' on Linux/Mac, '\\' on Windows
os.pathsep  # ':' on Linux/Mac, ';' on Windows

# Line separator
os.linesep  # '\n' on Linux/Mac, '\r\n' on Windows
```

## Execute System Commands
```python
# Execute command (simple, not recommended)
os.system('ls -l')
os.system('dir')  # Windows

# Better way - use subprocess module
import subprocess
result = subprocess.run(['ls', '-l'], capture_output=True, text=True)
print(result.stdout)
```

## Process Information
```python
# Get process ID
pid = os.getpid()

# Get parent process ID
ppid = os.getppid()

# Get user ID (Unix only)
uid = os.getuid()

# Kill process (Unix)
os.kill(pid, signal.SIGTERM)
```

## Practical Examples
```python
# Create directory if not exists
def create_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# Get all files with extension
def get_files_by_ext(directory, extension):
    files = []
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(extension):
                files.append(os.path.join(root, filename))
    return files

# Example usage
pdf_files = get_files_by_ext('.', '.pdf')

# Safe file deletion
def safe_delete(filepath):
    if os.path.exists(filepath) and os.path.isfile(filepath):
        os.remove(filepath)
        print(f"Deleted: {filepath}")
    else:
        print(f"File not found: {filepath}")

# Get file size in readable format
def human_readable_size(filepath):
    size = os.path.getsize(filepath)
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0

# List directory with details
def list_dir_details(directory):
    for item in os.listdir(directory):
        path = os.path.join(directory, item)
        size = os.path.getsize(path) if os.path.isfile(path) else 0
        type_ = "DIR" if os.path.isdir(path) else "FILE"
        print(f"{type_:4} {item:30} {size:10} bytes")

# Find files modified in last N days
import time
def find_recent_files(directory, days=7):
    cutoff = time.time() - (days * 86400)  # 86400 seconds in a day
    recent = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            path = os.path.join(root, file)
            if os.path.getmtime(path) > cutoff:
                recent.append(path)
    return recent
```

## Common Path Patterns
```python
# User home directory
home = os.path.expanduser('~')  # /home/username

# Expand environment variables in path
path = os.path.expandvars('$HOME/documents')

# Normalize path (clean up .., ., etc.)
normalized = os.path.normpath('/home/user/../file.txt')
# /home/file.txt

# Get common path prefix
common = os.path.commonpath(['/home/user/file1.txt', '/home/user/file2.txt'])
# /home/user

# Relative path
rel_path = os.path.relpath('/home/user/file.txt', '/home')
# user/file.txt
```

## Working with Temp Files
```python
# Get temp directory
temp_dir = os.environ.get('TEMP') or os.environ.get('TMP') or '/tmp'

# Create temp file path
import tempfile
temp_file = os.path.join(tempfile.gettempdir(), 'myfile.txt')
```

## Key Points
- **os.path** - path manipulations (join, split, exists, etc.)
- **Always use os.path.join()** - works across Windows/Linux/Mac
- **os.walk()** - traverse directory trees
- **os.environ** - access environment variables
- **Check existence** before operations to avoid errors
- **Use pathlib** for modern path operations (Python 3.4+)
- **subprocess** preferred over os.system() for commands
- **Cross-platform** - os module handles OS differences automatically

# Python Requests - Quick Notes

## Installation & Import
```python
# pip install requests

import requests
```

## GET Request
```python
# Simple GET
response = requests.get('https://api.example.com/users')

# GET with parameters
params = {'page': 1, 'limit': 10}
response = requests.get('https://api.example.com/users', params=params)
# URL becomes: https://api.example.com/users?page=1&limit=10

# Access response
print(response.status_code)  # 200
print(response.text)         # Raw text
print(response.json())       # Parse JSON to dict
print(response.headers)      # Response headers
```

## POST Request
```python
# POST with JSON data
data = {'name': 'John', 'email': 'john@example.com'}
response = requests.post('https://api.example.com/users', json=data)

# POST with form data
data = {'username': 'john', 'password': 'secret'}
response = requests.post('https://api.example.com/login', data=data)

# POST with files
files = {'file': open('document.pdf', 'rb')}
response = requests.post('https://api.example.com/upload', files=files)
```

## Other HTTP Methods
```python
# PUT (update)
response = requests.put('https://api.example.com/users/1', json={'name': 'John Doe'})

# PATCH (partial update)
response = requests.patch('https://api.example.com/users/1', json={'age': 30})

# DELETE
response = requests.delete('https://api.example.com/users/1')

# HEAD (headers only)
response = requests.head('https://api.example.com/users')

# OPTIONS
response = requests.options('https://api.example.com/users')
```

## Headers
```python
# Custom headers
headers = {
    'Authorization': 'Bearer your_token_here',
    'Content-Type': 'application/json',
    'User-Agent': 'MyApp/1.0'
}
response = requests.get('https://api.example.com/data', headers=headers)

# Common header patterns
headers = {'Authorization': f'Bearer {token}'}
headers = {'API-Key': 'your_api_key'}
```

## Authentication
```python
# Basic Auth
from requests.auth import HTTPBasicAuth
response = requests.get(
    'https://api.example.com/data',
    auth=HTTPBasicAuth('username', 'password')
)
# Or shorthand
response = requests.get('https://api.example.com/data', auth=('username', 'password'))

# Bearer Token
headers = {'Authorization': 'Bearer YOUR_TOKEN'}
response = requests.get('https://api.example.com/data', headers=headers)
```

## Response Object
```python
response = requests.get('https://api.example.com/users')

# Status
response.status_code        # 200, 404, 500, etc.
response.ok                 # True if status < 400
response.reason             # 'OK', 'Not Found', etc.

# Content
response.text              # String content
response.content           # Bytes content
response.json()            # Parse JSON to dict/list
response.headers           # Response headers dict
response.url               # Final URL

# Timing
response.elapsed           # Time taken (timedelta)
```

## Error Handling
```python
try:
    response = requests.get('https://api.example.com/users')
    response.raise_for_status()  # Raises HTTPError for bad status
    data = response.json()
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
except requests.exceptions.ConnectionError:
    print("Connection failed")
except requests.exceptions.Timeout:
    print("Request timed out")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
```

## Timeouts
```python
# Timeout in seconds
response = requests.get('https://api.example.com/users', timeout=5)

# Separate connect and read timeouts
response = requests.get('https://api.example.com/users', timeout=(3, 10))
# 3 seconds to connect, 10 seconds to read
```

## Sessions (Persistent Connection)
```python
# Reuse connection - faster for multiple requests
session = requests.Session()

# Set default headers for all requests
session.headers.update({'Authorization': 'Bearer token123'})

# Make requests
response1 = session.get('https://api.example.com/users')
response2 = session.get('https://api.example.com/posts')

# Cookies persist across requests
session.close()
```

## Cookies
```python
# Send cookies
cookies = {'session_id': '12345'}
response = requests.get('https://api.example.com/data', cookies=cookies)

# Get cookies from response
response = requests.get('https://api.example.com/login')
print(response.cookies['session_id'])

# With session (automatic cookie handling)
session = requests.Session()
session.get('https://api.example.com/login')  # Sets cookies
session.get('https://api.example.com/profile')  # Uses cookies automatically
```

## Query Parameters
```python
# Method 1: Dict
params = {'search': 'python', 'page': 1, 'sort': 'recent'}
response = requests.get('https://api.example.com/search', params=params)

# Method 2: List of tuples (for duplicate keys)
params = [('tag', 'python'), ('tag', 'api'), ('limit', '10')]
response = requests.get('https://api.example.com/posts', params=params)

# Method 3: In URL directly
response = requests.get('https://api.example.com/search?q=python&page=1')
```

## File Upload
```python
# Single file
files = {'file': open('document.pdf', 'rb')}
response = requests.post('https://api.example.com/upload', files=files)

# Multiple files
files = [
    ('files', open('file1.txt', 'rb')),
    ('files', open('file2.txt', 'rb'))
]
response = requests.post('https://api.example.com/upload', files=files)

# With additional data
files = {'file': open('image.jpg', 'rb')}
data = {'description': 'Profile picture'}
response = requests.post('https://api.example.com/upload', files=files, data=data)
```

## Download Files
```python
# Download file
response = requests.get('https://example.com/file.pdf')
with open('downloaded.pdf', 'wb') as f:
    f.write(response.content)

# Stream large files
response = requests.get('https://example.com/largefile.zip', stream=True)
with open('largefile.zip', 'wb') as f:
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)
```

## Proxies
```python
# HTTP proxy
proxies = {
    'http': 'http://10.10.10.10:8000',
    'https': 'http://10.10.10.10:8000'
}
response = requests.get('https://api.example.com/data', proxies=proxies)
```

## SSL Verification
```python
# Disable SSL verification (not recommended for production)
response = requests.get('https://api.example.com/data', verify=False)

# Custom CA bundle
response = requests.get('https://api.example.com/data', verify='/path/to/certfile')
```

## Redirects
```python
# Allow redirects (default=True)
response = requests.get('https://example.com', allow_redirects=True)

# Disable redirects
response = requests.get('https://example.com', allow_redirects=False)

# View redirect history
print(response.history)  # List of redirect responses
```

## Practical Examples
```python
# API call with error handling
def fetch_user(user_id):
    try:
        response = requests.get(
            f'https://api.example.com/users/{user_id}',
            headers={'Authorization': f'Bearer {token}'},
            timeout=5
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user: {e}")
        return None

# POST with retry
from time import sleep

def post_with_retry(url, data, retries=3):
    for i in range(retries):
        try:
            response = requests.post(url, json=data, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if i < retries - 1:
                sleep(2 ** i)  # Exponential backoff
                continue
            raise

# Download with progress
def download_file(url, filename):
    response = requests.get(url, stream=True)
    total = int(response.headers.get('content-length', 0))
    with open(filename, 'wb') as f:
        downloaded = 0
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
            downloaded += len(chunk)
            print(f"Downloaded {downloaded}/{total} bytes")
```

## Key Points
- **Simple API** - easy to use for HTTP requests
- **Automatic encoding** - handles JSON, forms, files
- **Sessions** - reuse connections for better performance
- **Error handling** - use try/except and raise_for_status()
- **Timeouts** - always set timeout to avoid hanging
- **Stream** - use stream=True for large files
- **Status codes** - 200=OK, 404=Not Found, 500=Server Error
- **Headers** - use for authentication, content-type, etc.

# Python Pydantic - Quick Notes

## Installation & Basic Model
```python
# pip install pydantic

from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str
    age: int = 18  # Default value
    is_active: bool = True

# Create instance
user = User(id=1, name="John", email="john@example.com", age=25)

# Access fields
print(user.name)  # John
print(user.age)   # 25

# Convert to dict
user.model_dump()  # {'id': 1, 'name': 'John', ...}

# Convert to JSON
user.model_dump_json()  # '{"id":1,"name":"John",...}'
```

## Type Validation (Automatic)
```python
from pydantic import BaseModel

class Product(BaseModel):
    id: int
    name: str
    price: float
    in_stock: bool

# Valid - auto type conversion
p = Product(id="1", name="Laptop", price="999.99", in_stock="yes")
# id becomes int(1), price becomes float(999.99), in_stock becomes True

# Invalid - raises ValidationError
try:
    p = Product(id="abc", name="Laptop", price=999.99, in_stock=True)
except Exception as e:
    print(e)  # Validation error
```

## Optional & Union Types
```python
from typing import Optional, Union
from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: Optional[str] = None  # Can be None
    age: Union[int, str]  # Can be int OR str

user = User(name="John", age="25")  # Valid
user = User(name="John")  # Valid (email is None)
```

## Field Validation
```python
from pydantic import BaseModel, Field

class User(BaseModel):
    id: int = Field(gt=0)  # Greater than 0
    name: str = Field(min_length=1, max_length=50)
    age: int = Field(ge=0, le=120)  # 0 <= age <= 120
    email: str = Field(pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    score: float = Field(default=0.0, ge=0.0, le=100.0)

# Valid
user = User(id=1, name="John", age=25, email="john@example.com")

# Invalid - raises ValidationError
# user = User(id=-1, name="", age=200, email="invalid")
```

## Custom Validators
```python
from pydantic import BaseModel, field_validator, model_validator

class User(BaseModel):
    name: str
    email: str
    age: int
    
    # Validate single field
    @field_validator('email')
    def email_must_be_valid(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email')
        return v.lower()  # Transform value
    
    @field_validator('age')
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        return v
    
    # Validate entire model
    @model_validator(mode='after')
    def check_name_age(self):
        if self.age < 18 and 'admin' in self.name.lower():
            raise ValueError('Admins must be 18+')
        return self

user = User(name="John", email="JOHN@EXAMPLE.COM", age=25)
print(user.email)  # john@example.com (lowercased)
```

## Nested Models
```python
from pydantic import BaseModel
from typing import List

class Address(BaseModel):
    street: str
    city: str
    zip_code: str

class User(BaseModel):
    name: str
    address: Address  # Nested model
    tags: List[str]   # List of strings

user = User(
    name="John",
    address={"street": "123 Main St", "city": "NYC", "zip_code": "10001"},
    tags=["admin", "user"]
)

print(user.address.city)  # NYC
```

## Lists & Dictionaries
```python
from pydantic import BaseModel
from typing import List, Dict

class Team(BaseModel):
    name: str
    members: List[str]
    scores: Dict[str, int]

team = Team(
    name="Alpha",
    members=["Alice", "Bob", "Charlie"],
    scores={"Alice": 95, "Bob": 87}
)

print(team.members[0])  # Alice
print(team.scores["Alice"])  # 95
```

## Parse JSON/Dict
```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str

# From dict
data = {"id": 1, "name": "John"}
user = User(**data)

# From JSON string
json_str = '{"id": 1, "name": "John"}'
user = User.model_validate_json(json_str)

# Parse list of objects
users_data = [{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]
users = [User(**data) for data in users_data]
```

## Config & Settings
```python
from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,  # Strip whitespace from strings
        validate_assignment=True,    # Validate on assignment
        frozen=True                  # Immutable (can't change after creation)
    )
    
    name: str
    age: int

user = User(name="  John  ", age=25)
print(user.name)  # "John" (stripped)

# user.age = 30  # Error if frozen=True
```

## Environment Variables
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "MyApp"
    database_url: str
    api_key: str
    debug: bool = False
    
    class Config:
        env_file = ".env"  # Load from .env file

# Automatically reads from environment variables or .env file
settings = Settings()
print(settings.database_url)
```

## Exclude/Include Fields
```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str
    password: str

user = User(id=1, name="John", email="john@example.com", password="secret")

# Exclude password
user.model_dump(exclude={'password'})
# {'id': 1, 'name': 'John', 'email': 'john@example.com'}

# Include only specific fields
user.model_dump(include={'id', 'name'})
# {'id': 1, 'name': 'John'}
```

## Field Aliases
```python
from pydantic import BaseModel, Field

class User(BaseModel):
    id: int
    name: str = Field(alias="userName")
    email: str = Field(alias="userEmail")

# Use aliases when creating
user = User(id=1, userName="John", userEmail="john@example.com")

print(user.name)   # John
print(user.email)  # john@example.com
```

## Common Field Constraints
```python
from pydantic import BaseModel, Field

class Example(BaseModel):
    # Numbers
    positive: int = Field(gt=0)           # Greater than
    non_negative: int = Field(ge=0)       # Greater or equal
    limited: int = Field(ge=0, le=100)    # Between 0-100
    
    # Strings
    short_text: str = Field(max_length=50)
    name: str = Field(min_length=1, max_length=100)
    pattern_text: str = Field(pattern=r'^[A-Z]')  # Regex
    
    # Lists
    items: list = Field(min_length=1, max_length=10)
    
    # With description
    age: int = Field(description="User's age", ge=0, le=120)
```

## Error Handling
```python
from pydantic import BaseModel, ValidationError

class User(BaseModel):
    id: int
    name: str
    age: int

try:
    user = User(id="invalid", name="John", age=25)
except ValidationError as e:
    print(e.json())  # Detailed error in JSON
    # Shows which fields failed and why
```

## Key Points
- **Automatic validation** on object creation
- **Type coercion** - converts compatible types automatically
- **Data parsing** from JSON/dict easily
- **Nested models** for complex structures
- **Custom validators** for business logic
- **Immutable models** with frozen config
- **Great for APIs** - FastAPI uses it heavily
- **Settings management** from environment variables
- **Clear error messages** on validation failure

# Python SQLAlchemy - Quick Notes


# SQLAlchemy vs SQL: Complete Function Reference

## Core Query Functions

### SELECT Operations
- **SQL**: `SELECT column FROM table`
- **SQLAlchemy**: `session.query(Model.column)` or `select(Model.column)`

### WHERE Clause
- **SQL**: `WHERE column = value`
- **SQLAlchemy**: `.filter(Model.column == value)` or `.where(Model.column == value)`

### AND/OR Conditions
- **SQL**: `WHERE col1 = val1 AND col2 = val2`
- **SQLAlchemy**: `.filter(and_(Model.col1 == val1, Model.col2 == val2))` or `.filter(Model.col1 == val1, Model.col2 == val2)`

### ORDER BY
- **SQL**: `ORDER BY column ASC/DESC`
- **SQLAlchemy**: `.order_by(Model.column.asc())` or `.order_by(Model.column.desc())`

### LIMIT/OFFSET
- **SQL**: `LIMIT 10 OFFSET 5`
- **SQLAlchemy**: `.limit(10).offset(5)`

### JOIN
- **SQL**: `JOIN table2 ON table1.id = table2.foreign_id`
- **SQLAlchemy**: `.join(Model2, Model1.id == Model2.foreign_id)`

### GROUP BY
- **SQL**: `GROUP BY column`
- **SQLAlchemy**: `.group_by(Model.column)`

### HAVING
- **SQL**: `HAVING COUNT(*) > 5`
- **SQLAlchemy**: `.having(func.count() > 5)`

### COUNT/SUM/AVG
- **SQL**: `COUNT(*), SUM(column), AVG(column)`
- **SQLAlchemy**: `func.count()`, `func.sum(Model.column)`, `func.avg(Model.column)`

### DISTINCT
- **SQL**: `SELECT DISTINCT column`
- **SQLAlchemy**: `.distinct()` or `select(Model.column).distinct()`

### INSERT
- **SQL**: `INSERT INTO table (col1, col2) VALUES (val1, val2)`
- **SQLAlchemy**: `session.add(Model(col1=val1, col2=val2))`

### UPDATE
- **SQL**: `UPDATE table SET column = value WHERE id = 1`
- **SQLAlchemy**: `.update({Model.column: value})` or modify object + `session.commit()`

### DELETE
- **SQL**: `DELETE FROM table WHERE condition`
- **SQLAlchemy**: `.delete()` or `session.delete(obj)`

### LIKE Pattern
- **SQL**: `WHERE column LIKE '%pattern%'`
- **SQLAlchemy**: `.filter(Model.column.like('%pattern%'))`

### IN Clause
- **SQL**: `WHERE column IN (1, 2, 3)`
- **SQLAlchemy**: `.filter(Model.column.in_([1, 2, 3]))`

### BETWEEN
- **SQL**: `WHERE column BETWEEN 10 AND 20`
- **SQLAlchemy**: `.filter(Model.column.between(10, 20))`

### NULL Checks
- **SQL**: `WHERE column IS NULL / IS NOT NULL`
- **SQLAlchemy**: `.filter(Model.column.is_(None))` or `.filter(Model.column.isnot(None))`

### UNION
- **SQL**: `query1 UNION query2`
- **SQLAlchemy**: `query1.union(query2)`

### Subqueries
- **SQL**: `SELECT * FROM (SELECT ...) AS subq`
- **SQLAlchemy**: `subq = select(...).subquery()` then use in main query

### CASE Statements
- **SQL**: `CASE WHEN condition THEN result END`
- **SQLAlchemy**: `case((condition, result), else_=default)`

---

## 20 Perfect Examples

### 1. Simple Select All
**SQL**: `SELECT * FROM users;`
**SQLAlchemy**: `session.query(User).all()`

### 2. Select Specific Columns
**SQL**: `SELECT name, email FROM users;`
**SQLAlchemy**: `session.query(User.name, User.email).all()`

### 3. Filter with WHERE
**SQL**: `SELECT * FROM users WHERE age > 18;`
**SQLAlchemy**: `session.query(User).filter(User.age > 18).all()`

### 4. Multiple Conditions (AND)
**SQL**: `SELECT * FROM users WHERE age > 18 AND city = 'NYC';`
**SQLAlchemy**: `session.query(User).filter(User.age > 18, User.city == 'NYC').all()`

### 5. OR Condition
**SQL**: `SELECT * FROM users WHERE city = 'NYC' OR city = 'LA';`
**SQLAlchemy**: `session.query(User).filter(or_(User.city == 'NYC', User.city == 'LA')).all()`

### 6. Order By Descending
**SQL**: `SELECT * FROM users ORDER BY created_at DESC;`
**SQLAlchemy**: `session.query(User).order_by(User.created_at.desc()).all()`

### 7. Limit Results
**SQL**: `SELECT * FROM users LIMIT 10;`
**SQLAlchemy**: `session.query(User).limit(10).all()`

### 8. Pagination
**SQL**: `SELECT * FROM users LIMIT 10 OFFSET 20;`
**SQLAlchemy**: `session.query(User).limit(10).offset(20).all()`

### 9. Count Records
**SQL**: `SELECT COUNT(*) FROM users;`
**SQLAlchemy**: `session.query(func.count(User.id)).scalar()`

### 10. Group By with Count
**SQL**: `SELECT city, COUNT(*) FROM users GROUP BY city;`
**SQLAlchemy**: `session.query(User.city, func.count(User.id)).group_by(User.city).all()`

### 11. Join Tables
**SQL**: `SELECT users.*, orders.* FROM users JOIN orders ON users.id = orders.user_id;`
**SQLAlchemy**: `session.query(User, Order).join(Order).all()`

### 12. Left Join
**SQL**: `SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id;`
**SQLAlchemy**: `session.query(User).outerjoin(Order).all()`

### 13. LIKE Pattern Match
**SQL**: `SELECT * FROM users WHERE email LIKE '%@gmail.com';`
**SQLAlchemy**: `session.query(User).filter(User.email.like('%@gmail.com')).all()`

### 14. IN Clause
**SQL**: `SELECT * FROM users WHERE id IN (1, 2, 3, 4);`
**SQLAlchemy**: `session.query(User).filter(User.id.in_([1, 2, 3, 4])).all()`

### 15. IS NULL Check
**SQL**: `SELECT * FROM users WHERE deleted_at IS NULL;`
**SQLAlchemy**: `session.query(User).filter(User.deleted_at.is_(None)).all()`

### 16. Insert Record
**SQL**: `INSERT INTO users (name, email) VALUES ('John', 'john@example.com');`
**SQLAlchemy**: `session.add(User(name='John', email='john@example.com')); session.commit()`

### 17. Update Record
**SQL**: `UPDATE users SET email = 'new@example.com' WHERE id = 5;`
**SQLAlchemy**: `session.query(User).filter(User.id == 5).update({'email': 'new@example.com'}); session.commit()`

### 18. Delete Record
**SQL**: `DELETE FROM users WHERE id = 5;`
**SQLAlchemy**: `session.query(User).filter(User.id == 5).delete(); session.commit()`

### 19. Aggregate Functions
**SQL**: `SELECT AVG(age), MAX(age), MIN(age) FROM users;`
**SQLAlchemy**: `session.query(func.avg(User.age), func.max(User.age), func.min(User.age)).first()`

### 20. Subquery
**SQL**: `SELECT * FROM users WHERE age > (SELECT AVG(age) FROM users);`
**SQLAlchemy**: 
```python
subq = session.query(func.avg(User.age)).scalar_subquery()
session.query(User).filter(User.age > subq).all()
```


## Installation & Setup
```python
# pip install sqlalchemy

from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# Create engine
engine = create_engine('sqlite:///database.db')  # SQLite
# engine = create_engine('postgresql://user:pass@localhost/dbname')  # PostgreSQL
# engine = create_engine('mysql://user:pass@localhost/dbname')  # MySQL

Base = declarative_base()
```

## Define Models (ORM)
```python
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True)
    age = Column(Integer)
    
    # Relationship
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    content = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))
    
    # Relationship
    author = relationship("User", back_populates="posts")

# Create tables
Base.metadata.create_all(engine)
```

## Session Management
```python
# Create session
Session = sessionmaker(bind=engine)
session = Session()

# Context manager (auto-close)
with Session() as session:
    # your operations
    session.commit()
```

## INSERT (Create)
```python
# Single insert
user = User(name="John", email="john@example.com", age=25)
session.add(user)
session.commit()

# Multiple insert
users = [
    User(name="Alice", email="alice@example.com"),
    User(name="Bob", email="bob@example.com")
]
session.add_all(users)
session.commit()
```

## SELECT (Read)
```python
# Get all
users = session.query(User).all()

# Get first
user = session.query(User).first()

# Get by ID
user = session.query(User).get(1)  # or filter_by
user = session.query(User).filter_by(id=1).first()

# Filter
users = session.query(User).filter(User.age > 20).all()
user = session.query(User).filter(User.name == "John").first()

# Multiple conditions
users = session.query(User).filter(
    User.age > 20,
    User.name.like("J%")
).all()

# Order by
users = session.query(User).order_by(User.name).all()
users = session.query(User).order_by(User.age.desc()).all()

# Limit
users = session.query(User).limit(5).all()

# Count
count = session.query(User).count()
```

## UPDATE
```python
# Method 1: Get and modify
user = session.query(User).filter_by(id=1).first()
user.age = 30
session.commit()

# Method 2: Direct update
session.query(User).filter_by(id=1).update({"age": 30})
session.commit()

# Update multiple
session.query(User).filter(User.age < 18).update({"age": 18})
session.commit()
```

## DELETE
```python
# Method 1: Get and delete
user = session.query(User).filter_by(id=1).first()
session.delete(user)
session.commit()

# Method 2: Direct delete
session.query(User).filter_by(id=1).delete()
session.commit()

# Delete multiple
session.query(User).filter(User.age < 18).delete()
session.commit()
```

## Relationships & Joins
```python
# Access related data
user = session.query(User).filter_by(id=1).first()
posts = user.posts  # Get all posts by user

post = session.query(Post).first()
author = post.author  # Get author of post

# Join queries
results = session.query(User, Post).join(Post).all()

# Filter on joined table
users = session.query(User).join(Post).filter(
    Post.title.like("%Python%")
).all()
```

## Common Query Filters
```python
from sqlalchemy import and_, or_, not_

# AND
users = session.query(User).filter(
    and_(User.age > 20, User.name == "John")
).all()

# OR
users = session.query(User).filter(
    or_(User.age < 18, User.age > 60)
).all()

# NOT
users = session.query(User).filter(
    not_(User.name == "John")
).all()

# IN
users = session.query(User).filter(
    User.id.in_([1, 2, 3])
).all()

# LIKE
users = session.query(User).filter(
    User.name.like("J%")
).all()

# BETWEEN
users = session.query(User).filter(
    User.age.between(20, 30)
).all()

# IS NULL
users = session.query(User).filter(User.email == None).all()

# IS NOT NULL
users = session.query(User).filter(User.email != None).all()
```

## Common Column Types
```python
from sqlalchemy import Integer, String, Float, Boolean, DateTime, Text, Date

Column(Integer)           # Integer
Column(String(50))        # Variable string (max 50)
Column(Text)              # Large text
Column(Float)             # Decimal
Column(Boolean)           # True/False
Column(DateTime)          # Date & time
Column(Date)              # Date only
```

## Column Constraints
```python
Column(Integer, primary_key=True)           # Primary key
Column(String(50), nullable=False)          # NOT NULL
Column(String(100), unique=True)            # UNIQUE
Column(Integer, default=0)                  # Default value
Column(DateTime, default=datetime.now)      # Default function
Column(Integer, ForeignKey('users.id'))     # Foreign key
```

## Raw SQL Queries
```python
from sqlalchemy import text

# Execute raw SQL
result = session.execute(text("SELECT * FROM users WHERE age > :age"), {"age": 20})
users = result.fetchall()

# With ORM objects
result = session.query(User).from_statement(
    text("SELECT * FROM users WHERE age > :age")
).params(age=20).all()
```

## Transactions
```python
try:
    user = User(name="John")
    session.add(user)
    # more operations
    session.commit()
except:
    session.rollback()
    raise
finally:
    session.close()
```

## Key Points
- **Engine** = database connection
- **Base** = base class for models
- **Session** = handles transactions
- **Query** = retrieve data
- **commit()** = save changes
- **rollback()** = undo changes
- Always close sessions or use context managers
- Use relationships for foreign keys
- ORM maps Python classes to database tables

# Python datetime Library - Quick Notes

## Import & Basic Objects
```python
from datetime import datetime, date, time, timedelta

# Current date/time
now = datetime.now()          # 2025-11-15 14:30:45
today = date.today()          # 2025-11-15
```

## datetime Object
```python
# Create specific datetime
dt = datetime(2025, 11, 15, 14, 30, 45)

# Access components
dt.year        # 2025
dt.month       # 11
dt.day         # 15
dt.hour        # 14
dt.minute      # 30
dt.second      # 45
dt.weekday()   # 0=Monday, 6=Sunday
```

## date Object
```python
# Create date
d = date(2025, 11, 15)

# From datetime
d = datetime.now().date()

# Access
d.year, d.month, d.day
```

## time Object
```python
# Create time
t = time(14, 30, 45)  # hour, minute, second

# Access
t.hour, t.minute, t.second
```

## String Formatting (strftime)
```python
dt = datetime.now()

dt.strftime("%Y-%m-%d")           # 2025-11-15
dt.strftime("%d/%m/%Y")           # 15/11/2025
dt.strftime("%Y-%m-%d %H:%M:%S")  # 2025-11-15 14:30:45
dt.strftime("%B %d, %Y")          # November 15, 2025
dt.strftime("%A")                 # Saturday
```

## String Parsing (strptime)
```python
# Parse string to datetime
dt = datetime.strptime("2025-11-15", "%Y-%m-%d")
dt = datetime.strptime("15/11/2025 14:30", "%d/%m/%Y %H:%M")
```

## timedelta (Date/Time Arithmetic)
```python
from datetime import timedelta

# Create duration
delta = timedelta(days=7, hours=2, minutes=30)

# Add/subtract
tomorrow = datetime.now() + timedelta(days=1)
last_week = datetime.now() - timedelta(weeks=1)

# Difference between dates
dt1 = datetime(2025, 11, 15)
dt2 = datetime(2025, 11, 1)
diff = dt1 - dt2  # timedelta object
diff.days         # 14
diff.total_seconds()  # total seconds
```

## Common Format Codes
| Code | Meaning | Example |
|------|---------|---------|
| `%Y` | Year (4 digits) | 2025 |
| `%m` | Month (01-12) | 11 |
| `%d` | Day (01-31) | 15 |
| `%H` | Hour 24h (00-23) | 14 |
| `%I` | Hour 12h (01-12) | 02 |
| `%M` | Minute (00-59) | 30 |
| `%S` | Second (00-59) | 45 |
| `%p` | AM/PM | PM |
| `%A` | Weekday full | Saturday |
| `%a` | Weekday short | Sat |
| `%B` | Month full | November |
| `%b` | Month short | Nov |

## Timezone Handling
```python
from datetime import timezone, timedelta

# UTC timezone
utc_now = datetime.now(timezone.utc)

# Custom timezone
tz = timezone(timedelta(hours=5, minutes=30))  # IST
ist_now = datetime.now(tz)

# Convert timezone
dt_utc = datetime.now(timezone.utc)
dt_ist = dt_utc.astimezone(timezone(timedelta(hours=5, minutes=30)))
```

## Practical Examples
```python
# Age calculation
birth = date(1990, 5, 15)
age = (date.today() - birth).days // 365

# Days until event
event = datetime(2025, 12, 25)
days_left = (event - datetime.now()).days

# Format for display
dt = datetime.now()
print(dt.strftime("%B %d, %Y at %I:%M %p"))
# November 15, 2025 at 02:30 PM

# Check if date is in past
is_past = datetime(2020, 1, 1) < datetime.now()
```

## Key Points
- **datetime** = date + time combined
- **date** = just year, month, day
- **time** = just hour, minute, second
- **timedelta** = duration/difference
- **strftime** = datetime → string
- **strptime** = string → datetime
- Timezone-naive by default (add timezone for aware datetimes)

---
---
---

- type hinting: mypy just a meta data like typing libraray
- type checking ( data validation) : while running check and raise error

# Python typing Library - Quick Notes

## Basic Types
```python
from typing import List, Dict, Set, Tuple, Optional

def greet(name: str) -> str:
    return f"Hello {name}"

numbers: List[int] = [1, 2, 3]
user: Dict[str, int] = {"age": 25}
coords: Tuple[float, float] = (10.5, 20.3)
```

## Optional & Union
```python
from typing import Optional, Union

# Optional = value or None
def find_user(id: int) -> Optional[str]:
    return "John" if id == 1 else None

# Union = multiple possible types
def process(data: Union[int, str]) -> str:
    return str(data)
```

## Any & Callable
```python
from typing import Any, Callable

# Any = any type (avoid if possible)
data: Any = "anything"

# Callable = function type
def executor(func: Callable[[int, int], int]) -> int:
    return func(5, 3)
```

## TypeAlias & Generic Types
```python
from typing import TypeAlias, List, Dict

# Type aliases for readability
UserId: TypeAlias = int
UserData: TypeAlias = Dict[str, str]

def get_user(id: UserId) -> UserData:
    return {"name": "John"}
```

## Common Collections
```python
from typing import List, Dict, Set, Tuple

users: List[str] = ["Alice", "Bob"]
scores: Dict[str, int] = {"Alice": 95}
tags: Set[str] = {"python", "typing"}
point: Tuple[int, int, int] = (1, 2, 3)
```

## Protocol (Structural Typing)
```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

def render(obj: Drawable) -> None:
    obj.draw()  # any object with draw() works
```

## Literal & Final
```python
from typing import Literal, Final

# Literal = exact values only
Mode = Literal["read", "write"]

def open_file(mode: Mode) -> None:
    pass

# Final = constant
MAX_SIZE: Final = 100
```

## Key Points
- **Type hints don't enforce at runtime** - use mypy/pyright for checking
- **Use Optional[T]** instead of T | None for Python < 3.10
- **from __future__ import annotations** enables newer syntax in older Python
- **typing.cast()** for explicit type conversions when needed

---
---
---

Here are the points short and precise:

---

## 📌 POINT 1: Response Serialization - How Data Converts to JSON

### What FastAPI Returns:

**Basic Types → JSON directly**
- Dict → JSON object
- List → JSON array  
- String, int, bool → JSON primitives

**Pydantic Models → JSON via `.dict()`**
```python
user = User(username="john", email="j@ex.com")
return user  # FastAPI calls user.dict() internally
```

**SQLAlchemy Objects → Need special handling**

```python
# SQLAlchemy Model
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String)

# Pydantic Schema (MUST have this config!)
class UserResponse(BaseModel):
    id: int
    username: str
    
    class Config:
        from_attributes = True  # ⭐ CRITICAL!

# Endpoint
@app.get("/user/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).first()  # Returns ORM object
    return user  # ✅ Works because of response_model + from_attributes
```

**Key Points:**
- SQLAlchemy returns **ORM objects** (not dicts)
- Must use `response_model` + `from_attributes=True` in Config
- Without this: ❌ Error (ORM objects aren't JSON serializable)
- FastAPI converts: ORM object → Pydantic → dict → JSON

---

## 📌 POINT 2: PATCH vs PUT

### PUT - Full Replacement
- Replace **entire resource**
- ALL fields must be sent
- Missing fields = removed/null

```python
class UserUpdate(BaseModel):
    username: str
    email: str
    age: int

@app.put("/users/{user_id}")
def update_full(user_id: int, user: UserUpdate):
    # Replace all fields
    db_user.username = user.username
    db_user.email = user.email
    db_user.age = user.age
```

### PATCH - Partial Update
- Update **only specific fields**
- Send only fields to change
- Other fields unchanged

```python
class UserPatch(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None

@app.patch("/users/{user_id}")
def update_partial(user_id: int, user: UserPatch):
    # Update ONLY provided fields
    update_data = user.dict(exclude_unset=True)  # ⭐ KEY!
    for field, value in update_data.items():
        setattr(db_user, field, value)
```

**Key Difference:**
- PUT: `user.dict()` → includes all fields
- PATCH: `user.dict(exclude_unset=True)` → only set fields

---

## 📌 POINT 3: Path Parameters vs Query Parameters - Route Order Issue

### The Problem:
```python
@app.get("/users/me")  # Specific route
def get_current_user():
    return {"user": "current"}

@app.get("/users/{user_id}")  # Generic route with path parameter
def get_user(user_id: int):
    return {"user_id": user_id}
```

**If routes are reversed:**
```python
@app.get("/users/{user_id}")  # ❌ This catches everything first!
def get_user(user_id: int):
    return {"user_id": user_id}

@app.get("/users/me")  # ❌ Never reached!
def get_current_user():
    return {"user": "current"}
```

**What happens:**
- Request: `GET /users/me`
- FastAPI matches first route: `/users/{user_id}`
- Treats "me" as `user_id`
- Tries to convert "me" to int → **Error!**

### The Solution:
**Always put specific routes BEFORE generic ones**

```python
# ✅ CORRECT ORDER
@app.get("/users/me")        # Most specific first
def get_current_user():
    return {"user": "current"}

@app.get("/users/active")    # Specific routes
def get_active_users():
    return {"users": "active"}

@app.get("/users/{user_id}") # Generic route last
def get_user(user_id: int):
    return {"user_id": user_id}
```

**Rule:** 
- **Static paths first** (`/users/me`)
- **Dynamic paths last** (`/users/{user_id}`)
- FastAPI matches routes in **declaration order**

# FASTAPI - ESSENTIAL THEORY & CORE CONCEPTS (PRODUCTION-READY KNOWLEDGE)

## **1. PYTHON WEB FRAMEWORKS EVOLUTION**

### **Three-Tier Web Application Architecture**
- **Presentation Tier**: Front-end interface (HTML5, CSS3, JavaScript, Angular)
- **Application/Service Tier**: Core business logic (Java, Python, NodeJS, PHP, DotNet)
- **Persistence Tier**: Data storage and querying (Database layer)

### **Full Stack Framework - Django**
- **"Batteries-included"** complete framework
- Provides complete system for building web applications
- Includes ORM (Object-Relational Mapper)
- Built-in admin panel
- Comprehensive, opinionated solution

### **Lightweight/Micro Framework - Flask**
- **Minimalist** framework
- Provides only core features needed
- Flexibility to choose own libraries
- Developers get choice in architecture
- Smaller footprint

### **Modern API Framework - FastAPI**
- **High-performance** framework specifically designed for modern APIs
- **Automatic documentation** generation
- **Fast execution speed**
- Built for **asynchronous programming**
- **Automatic type checking**
- **Interactive API documentation**

---

## **2. WHY FASTAPI WAS CREATED**

### **Traditional Frameworks Were Powerful BUT Built Before:**
- Asynchronous programming became standard
- Automatic type checking was essential
- Interactive API docs were expected

### **Modern API Development Needs:**
- **Fast**: High execution speed
- **Type-safe**: Automatic validation
- **Async-friendly**: Non-blocking operations
- **Auto-documented**: Zero-effort API docs

### **FastAPI Core Features:**
- High-performance framework
- Automatic documentation (Swagger UI, ReDoc)
- Known for automatic type checking
- Fast execution speed
- Interactive API docs

---

## **3. FASTAPI ARCHITECTURE & COMPONENTS**

### **Built On Top Of:**
- **Starlette**: For web routing and middleware
- **Pydantic**: For data validation using Python type hints
- **ASGI**: Asynchronous Server Gateway Interface (not WSGI)
- **Uvicorn**: ASGI server for running FastAPI apps

### **Request-Response Flow:**
1. Client sends HTTP request
2. ASGI server (Uvicorn) receives request
3. FastAPI router matches path and method
4. Dependency injection executes (auth, DB connection, etc.)
5. Pydantic validates request data
6. Path operation function executes
7. Response model validates output
8. JSON response sent to client

---

## **4. CORE FASTAPI CONCEPTS**

### **Path Operations**
- Combination of HTTP method (GET, POST, PUT, DELETE, PATCH) + URL path
- Decorated functions that handle specific routes
- **Order matters**: Specific routes must come before generic routes
- Each operation can have tags for API documentation grouping

### **Type Hints & Automatic Validation**
- Python type hints enable automatic request validation
- Pydantic validates data types automatically
- Type mismatches return clear error messages
- Editor autocomplete and IntelliSense support
- Reduces manual validation code

### **Pydantic Models**
- Define structure of request and response data
- Automatic validation and serialization
- Type coercion (converts compatible types)
- Field validation with constraints (min, max, regex)
- Nested models support
- Generate JSON Schema automatically

### **Dependency Injection System**
- Reusable components (auth, database sessions, common parameters)
- Executed before path operation function
- Can have sub-dependencies (dependencies of dependencies)
- Supports caching for performance
- Clean separation of concerns

### **Automatic API Documentation**
- **Swagger UI**: Interactive docs at `/docs`
- **ReDoc**: Alternative docs at `/redoc`
- Generated from code and type hints
- Live API testing in browser
- No manual documentation needed

### **Async/Await Support**
- Native asynchronous operation support
- Non-blocking I/O for database, API calls
- Better performance for I/O-bound operations
- Can mix sync and async functions
- Use `async def` for async operations

---

## **5. FASTAPI IN MICROSERVICES ARCHITECTURE**

### **Why FastAPI is Perfect for Microservices**
- **Lightweight**: Small memory footprint, fast startup
- **High Performance**: Handles high concurrent requests
- **Auto Documentation**: Service contract generation
- **Easy Containerization**: Works great with Docker/Kubernetes
- **Async Support**: Non-blocking service-to-service calls
- **Type Safety**: Prevents inter-service communication errors

### **Service-to-Service Communication in FastAPI**

**Synchronous Communication (REST APIs)**
- Direct HTTP calls between services using httpx or requests
- Immediate response needed
- Example: User Service calls Payment Service via REST

**Asynchronous Communication (Event-Driven)**
- Message queues like Kafka, RabbitMQ
- Fire-and-forget pattern
- Eventual consistency
- Example: Order Service publishes event, multiple services consume

### **Microservice Patterns with FastAPI**

**1. API Gateway Pattern**
- FastAPI acts as single entry point
- Routes requests to appropriate backend services
- Handles cross-cutting concerns (auth, rate limiting, logging)
- Request/response aggregation

**2. Service Registry & Discovery**
- Each FastAPI service registers with discovery service (Consul, Eureka)
- Services find each other dynamically
- Health check endpoints expose service status
- Load balancing across service instances

**3. Circuit Breaker Pattern**
- Prevents cascading failures in distributed systems
- FastAPI service stops calling failing service temporarily
- Returns fallback response or cached data
- Automatically retries after timeout

**4. Database per Service**
- Each FastAPI microservice has own database
- Data independence and isolation
- Services don't share database tables
- Use APIs to access other service's data

**5. Saga Pattern (Distributed Transactions)**
- Manage data consistency across services
- Series of local transactions
- Compensating transactions for rollback
- Event-driven coordination

### **FastAPI Microservice Best Practices**

**Health Check Endpoints**
- Implement `/health` endpoint
- Kubernetes/Docker health checks
- Liveness and readiness probes
- Monitor service availability

**Configuration Management**
- Environment variables for config
- Separate config for dev/staging/prod
- Never hardcode secrets
- Use config management tools

**Logging & Monitoring**
- Structured logging (JSON format)
- Centralized log aggregation
- Distributed tracing (trace requests across services)
- Metrics collection (Prometheus)

**Authentication & Authorization**
- OAuth2 for inter-service auth
- JWT tokens for stateless auth
- API keys for service-to-service
- Role-based access control (RBAC)

**Containerization**
- Docker containers for FastAPI services
- Kubernetes for orchestration
- Each service in separate container
- Environment consistency (dev = prod)

---

## **6. FASTAPI RESPONSE & ERROR HANDLING**

### **Response Models**
- Define expected response structure
- Automatic validation of output
- Filter sensitive data from responses
- Multiple response models for different status codes
- OpenAPI schema generation

### **Status Codes**
- HTTP status codes indicate operation result
- 2xx: Success (200 OK, 201 Created)
- 4xx: Client errors (400 Bad Request, 404 Not Found)
- 5xx: Server errors (500 Internal Server Error)
- FastAPI makes setting status codes easy

### **Exception Handling**
- HTTPException for standard HTTP errors
- Custom exception handlers for specific error types
- Validation errors handled automatically
- Global exception handlers for consistency

---

## **7. FASTAPI MIDDLEWARE CONCEPT**

### **What is Middleware**
- Code that runs before and after each request
- Intercepts all requests/responses
- Cross-cutting concerns implementation
- Runs in order of registration

### **Common Middleware Use Cases**
- **CORS**: Cross-Origin Resource Sharing for frontend
- **Authentication**: Verify tokens on every request
- **Logging**: Log all incoming requests and responses
- **Timing**: Measure request processing time
- **Rate Limiting**: Prevent API abuse
- **Compression**: Compress response data

---

## **8. BACKGROUND TASKS IN FASTAPI**

### **Purpose**
- Execute tasks after returning response
- Don't make user wait for long operations
- Send emails, process files, update cache
- Non-blocking operations

### **Use Cases**
- Send email notifications
- Generate reports in background
- Update analytics data
- Process uploaded files
- Clear cache or temp files

---

## **9. FASTAPI SECURITY CONCEPTS**

### **Authentication Methods**
- **OAuth2**: Industry standard for authorization
- **JWT (JSON Web Tokens)**: Stateless authentication
- **API Keys**: Simple key-based access
- **Basic Auth**: Username/password (not recommended for production)

### **Security Best Practices**
- Always use HTTPS in production
- Validate and sanitize all inputs
- Use password hashing (never store plain text)
- Implement rate limiting
- CORS configuration for frontend access
- SQL injection prevention via ORMs
- Dependency injection for auth checks

---

## **10. FASTAPI DATABASE INTEGRATION**

### **ORM Support**
- **SQLAlchemy**: Most popular Python ORM
- Defines database models as Python classes
- Database-agnostic (works with PostgreSQL, MySQL, SQLite)
- Session management via dependency injection

### **Database Session Pattern**
- Create session for each request
- Use dependency injection to provide session
- Automatically close session after request
- Transaction management

### **Async Database Support**
- Use async database drivers for better performance
- Non-blocking database queries
- Higher concurrency
- Examples: asyncpg (PostgreSQL), aiomysql (MySQL)

---

## **11. FASTAPI TESTING CONCEPTS**

### **Why Testing Matters**
- Ensures API behaves as expected
- Catches bugs before production
- Validates business logic
- Regression testing

### **Testing Approaches**
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test API endpoints with TestClient
- **Dependency Overrides**: Mock databases, external services
- **Async Testing**: Test async functions properly

---

## **12. FASTAPI PRODUCTION DEPLOYMENT**

### **ASGI Server (Uvicorn)**
- Development: Single worker with --reload
- Production: Multiple workers for concurrency
- Process manager (Gunicorn + Uvicorn workers)
- Use environment variables for config

### **Containerization**
- Docker containers for consistency
- Multi-stage builds for smaller images
- Docker Compose for local development
- Kubernetes for production orchestration

### **Performance Optimization**
- Use async for I/O-bound operations
- Database connection pooling
- Response caching where appropriate
- CDN for static content
- Load balancing across instances

### **Monitoring & Logging**
- Application logs in JSON format
- Centralized logging (ELK stack)
- Performance metrics (Prometheus + Grafana)
- Error tracking (Sentry)
- Request tracing across microservices

---

## **13. REAL-WORLD FASTAPI USAGE**

### **When to Use FastAPI**
- Building REST APIs
- Microservices architecture
- Real-time applications with WebSocket
- Machine Learning model serving
- Data processing pipelines
- IoT backend services

### **When NOT to Use FastAPI**
- Traditional server-rendered web apps (use Django)
- Simple static websites
- Heavy computational tasks without async benefits

### **FastAPI vs Other Frameworks**

**vs Flask**
- FastAPI: Better performance, automatic docs, type safety
- Flask: More mature, larger ecosystem, simpler learning curve

**vs Django**
- FastAPI: Lighter, faster, API-focused
- Django: Full-featured, admin panel, ORM, templates

**vs Node.js (Express)**
- FastAPI: Python ecosystem, type safety, automatic validation
- Express: JavaScript ecosystem, larger community

---

## **14. KEY TAKEAWAYS FOR PRODUCTION**

### **Must Know Concepts**
1. **Async/await**: Non-blocking I/O operations
2. **Type hints**: Enable automatic validation and docs
3. **Dependency injection**: Reusable components pattern
4. **Pydantic models**: Data validation and serialization
5. **Response models**: Output structure and validation
6. **Middleware**: Cross-cutting concerns
7. **Exception handling**: Consistent error responses
8. **Background tasks**: Non-blocking operations
9. **Security**: OAuth2, JWT, input validation
10. **Testing**: TestClient for endpoint testing

### **Production Checklist**
- ✅ Use environment variables for configuration
- ✅ Implement proper logging and monitoring
- ✅ Set up health check endpoints
- ✅ Use multiple Uvicorn workers
- ✅ Enable HTTPS only
- ✅ Implement rate limiting
- ✅ Use connection pooling for databases
- ✅ Containerize with Docker
- ✅ Set up CI/CD pipelines
- ✅ Monitor performance and errors

### **Common Pitfalls to Avoid**
- ❌ Blocking I/O in async functions
- ❌ Not closing database connections
- ❌ Hardcoding secrets in code
- ❌ Ignoring security best practices
- ❌ Not validating user inputs
- ❌ Missing error handling
- ❌ No request/response logging
- ❌ Single worker in production

# Complete FastAPI Learning Guide

## 📚 PART 1: CORE CONCEPTS & FUNDAMENTALS

### 1. What is FastAPI?
FastAPI is a modern, high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints. It's designed to be fast (comparable to NodeJS and Go), easy to code, and reduces about 40% of developer-induced errors. It automatically generates interactive API documentation and validates request/response data using Pydantic models.

**Key Features:**
- Fast performance (one of the fastest Python frameworks)
- Automatic interactive API documentation (Swagger UI & ReDoc)
- Type safety with Python type hints
- Built-in data validation
- Async/await support out of the box
- Based on open standards (OpenAPI, JSON Schema)

---

### 2. ASGI (Asynchronous Server Gateway Interface)
ASGI is the spiritual successor to WSGI, designed to handle asynchronous Python web applications. FastAPI is built on top of Starlette (an ASGI framework), which allows it to handle async/await patterns efficiently. This makes FastAPI capable of handling thousands of concurrent connections, WebSockets, and long-running requests without blocking, making it ideal for modern real-time applications.

**Why ASGI matters:**
- Handles both synchronous and asynchronous code
- Supports WebSockets and HTTP/2
- Better scalability for I/O-bound operations
- Non-blocking request handling

---

### 3. REST API Principles
REST (Representational State Transfer) is an architectural style where resources are identified by URLs and manipulated using standard HTTP methods:
- **GET** - Retrieve resources (e.g., get user details)
- **POST** - Create new resources (e.g., create new user)
- **PUT** - Full update of resource (e.g., replace entire user data)
- **PATCH** - Partial update (e.g., update only user email)
- **DELETE** - Remove resources (e.g., delete user)

**RESTful principles:**
- Stateless - Each request contains all necessary information
- Resource-based - URLs represent resources, not actions
- Standard HTTP methods for operations
- Proper use of HTTP status codes (200, 201, 404, 500, etc.)

---

### 4. Path Operations & Routing
Path operations define how your API responds to different endpoints and HTTP methods. In FastAPI, decorators like `@app.get()`, `@app.post()` bind URL paths to Python functions.

**Key concepts:**
- **Path parameters**: Dynamic URL segments - `/users/{user_id}`
- **Query parameters**: URL filters/options - `/items?skip=0&limit=10`
- **Request body**: Data sent in POST/PUT requests
- **Route ordering**: More specific routes should come before general ones

---

### 5. Dependency Injection System
FastAPI's dependency injection allows you to declare reusable logic (database connections, authentication, pagination) that gets automatically executed before your path operation. 

**Benefits:**
- Code reusability across multiple endpoints
- Clean separation of concerns
- Easy testing with dependency overrides
- Nested dependencies (dependencies can have dependencies)
- Automatic execution and cleanup

**Common use cases:**
- Database session management
- User authentication and authorization
- Pagination logic
- Request validation
- Rate limiting

---

### 6. Request & Response Lifecycle

**Complete request flow:**
1. Client sends HTTP request to FastAPI server
2. URL is matched to a path operation
3. Path/query parameters are extracted and validated
4. Request body is parsed and validated against Pydantic models
5. Dependencies are resolved and executed in order
6. Your path operation function runs
7. Return value is validated against response model
8. Response is serialized to JSON
9. HTTP response sent to client

This entire pipeline provides **type safety** and **automatic validation** at every step, catching errors before they reach your business logic.

---

### 7. Automatic API Documentation
FastAPI automatically generates interactive API documentation using OpenAPI standards.

**Two built-in interfaces:**
- **Swagger UI** - Available at `/docs` - Interactive testing interface
- **ReDoc** - Available at `/redoc` - Clean, readable documentation

**Features:**
- Try endpoints directly from browser
- See request/response schemas
- View all available endpoints
- Auto-updates when you change code
- Supports authentication testing

---

### 8. Type Hints & Validation Power
Python type hints (`: str`, `: int`, etc.) drive FastAPI's entire validation system.

**What type hints enable:**
- Automatic request data validation
- Data type conversion (string "123" → integer 123)
- Clear error messages for invalid data
- IDE autocomplete and type checking
- Self-documenting code
- Automatic API documentation generation

**Example:**
```python
def get_user(user_id: int, include_posts: bool = False) -> UserResponse:
    # FastAPI ensures:
    # - user_id is integer (converts if possible, errors if not)
    # - include_posts is boolean
    # - Return value matches UserResponse model
    pass
```

---

## 💡 PART 2: PYDANTIC ESSENTIALS

### Understanding Pydantic Models

Pydantic is a data validation library that uses Python type hints. In FastAPI, Pydantic models define the structure of request/response data.

---

### 1. Basic Model Structure

```python
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str          # Required field
    email: str            # Required field
    age: int              # Required field
    is_active: bool = True  # Optional with default value
    bio: Optional[str] = None  # Optional, can be None
```

**Key insights:**
- All fields **without defaults are required**
- Fields with `= value` are optional with default values
- `Optional[Type]` means field can be None
- Missing required fields → Automatic validation error
- Wrong types → Automatic conversion attempt or error

---

### 2. Field Validation with Field()

```python
from pydantic import BaseModel, Field

class Product(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0, description="Price must be positive")
    quantity: int = Field(default=1, ge=1, le=1000)
    tags: list[str] = Field(default_factory=list)
```

**Field() parameters:**
- `...` means required (ellipsis)
- `default=value` sets default value
- `default_factory=callable` generates default (useful for lists/dicts)
- `min_length`, `max_length` - String/list length validation
- `gt`, `ge`, `lt`, `le` - Numeric comparisons (greater than, greater/equal, etc.)
- `regex` - Pattern matching for strings
- `description` - Documentation for the field

---

### 3. Constrained Types

```python
from pydantic import BaseModel, conint, constr, confloat

class RestrictedModel(BaseModel):
    age: conint(gt=0, le=120)  # Integer: 1-120
    username: constr(regex=r'^[a-zA-Z0-9_]+$', min_length=3)
    rating: confloat(ge=0.0, le=5.0)  # Float: 0.0-5.0
```

**Benefits:** More concise than Field() for simple numeric/string constraints

---

### 4. Special Types

```python
from pydantic import BaseModel, EmailStr, HttpUrl, SecretStr
from datetime import datetime

class AdvancedUser(BaseModel):
    email: EmailStr  # Validates email format
    website: HttpUrl  # Validates URL format
    password: SecretStr  # Never logged or displayed in errors
    created_at: datetime  # Automatically parses date strings
```

**Note:** `EmailStr` requires: `pip install pydantic[email]`

---

### 5. Collections & Nested Models

```python
from typing import List, Dict, Optional

class Address(BaseModel):
    street: str
    city: str
    zipcode: str

class UserWithAddress(BaseModel):
    name: str
    email: str
    addresses: List[Address] = []  # List of nested models
    metadata: Dict[str, str] = {}  # Dictionary
    primary_address: Optional[Address] = None  # Optional nested
```

**Usage:**
```python
user = UserWithAddress(
    name="John",
    email="john@example.com",
    addresses=[
        {"street": "123 Main St", "city": "NYC", "zipcode": "10001"}
    ]
)
```

---

### 6. Custom Validators

```python
from pydantic import BaseModel, validator

class Order(BaseModel):
    product: str
    quantity: int
    price: float
    
    @validator('quantity')
    def quantity_positive(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v
    
    @validator('price')
    def round_price(cls, v):
        return round(v, 2)  # Always round to 2 decimals
```

**Validator features:**
- Runs after type conversion
- Can modify the value (return new value)
- Can raise ValueError for validation errors
- `pre=True` runs before type conversion
- Can validate multiple fields: `@validator('field1', 'field2')`

---

### 7. Root Validators (Cross-field validation)

```python
from pydantic import BaseModel, root_validator

class Discount(BaseModel):
    original_price: float
    discount_percent: float
    final_price: Optional[float] = None
    
    @root_validator
    def calculate_final_price(cls, values):
        original = values.get('original_price')
        discount = values.get('discount_percent')
        
        if original and discount:
            values['final_price'] = original * (1 - discount / 100)
        
        return values
```

**Root validators:**
- Receive all field values as a dictionary
- Can validate relationships between fields
- Can compute derived fields
- Runs after all field validators

---

### 8. Model Configuration

```python
class ConfiguredModel(BaseModel):
    name: str
    internal_id: int
    
    class Config:
        # Validate on attribute assignment (not just __init__)
        validate_assignment = True
        
        # How to handle extra fields
        extra = "forbid"  # Options: "forbid", "allow", "ignore"
        
        # Use enum values instead of enum instances
        use_enum_values = True
        
        # Example for API documentation
        schema_extra = {
            "example": {
                "name": "Example",
                "internal_id": 123
            }
        }
```

---

### 9. Model Methods

```python
class User(BaseModel):
    username: str
    email: str
    age: int
    
    # Convert to dictionary
    user_dict = user.dict()
    
    # Convert to JSON string
    user_json = user.json()
    
    # Copy with updates
    updated_user = user.copy(update={'age': 30})
    
    # Create from dictionary
    user = User(**{"username": "john", "email": "j@ex.com", "age": 25})
    
    # Parse from JSON string
    user = User.parse_raw('{"username": "john", "email": "j@ex.com", "age": 25}')
```

---

## 🗄️ PART 3: SQLALCHEMY INTEGRATION

### Understanding SQLAlchemy

SQLAlchemy is a SQL toolkit and ORM (Object-Relational Mapping) for Python. It allows you to interact with databases using Python objects instead of writing raw SQL.

---

### 1. Core Concepts

**ORM (Object-Relational Mapping):**
- Maps database tables to Python classes
- Rows become class instances
- Columns become class attributes
- Relationships between tables become object references

**Two layers of SQLAlchemy:**
- **Core** - SQL Expression Language (low-level)
- **ORM** - Object-Relational Mapping (high-level, what we use)

**Session:**
- Manages database transactions
- Tracks changes to objects
- Commits changes to database
- Handles connection pooling

---

### 2. Setting Up Database Connection

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL format: dialect+driver://user:password@host:port/database
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
# PostgreSQL: "postgresql://user:password@localhost/dbname"
# MySQL: "mysql+pymysql://user:password@localhost/dbname"

# Create engine (manages connection pool)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Only for SQLite
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
```

---

### 3. Defining SQLAlchemy Models

```python
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = "users"  # Table name in database
    
    # Columns
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship (one-to-many)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship (many-to-one)
    author = relationship("User", back_populates="posts")
```

**Column parameters:**
- `primary_key=True` - Makes column primary key
- `unique=True` - Ensures unique values
- `nullable=False` - Column cannot be NULL
- `index=True` - Creates database index (faster queries)
- `default=value` - Default value for new rows
- `ForeignKey("table.column")` - References another table

---

### 4. Pydantic Schemas for SQLAlchemy Models

```python
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Base schemas (shared properties)
class UserBase(BaseModel):
    username: str
    email: str

# Schema for creating user (what client sends)
class UserCreate(UserBase):
    password: str

# Schema for updating user
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None

# Schema for reading user (what API returns)
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True  # Allows reading from ORM objects (was orm_mode in v1)

# Post schemas
class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    author_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# User with nested posts
class UserWithPosts(UserResponse):
    posts: List[PostResponse] = []
```

**Schema pattern:**
- `Base` - Shared fields
- `Create` - Fields needed to create (includes password, no id)
- `Update` - Optional fields for updates
- `Response` - What API returns (includes id, excludes password)
- `Config.from_attributes = True` - Critical for ORM integration

---

### 5. Database Dependency

```python
from typing import Generator

def get_db() -> Generator:
    """Dependency that provides database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Usage in endpoints
@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

---

### 6. Common CRUD Operations

```python
from sqlalchemy.orm import Session
from fastapi import HTTPException

# CREATE
def create_user(db: Session, user: UserCreate):
    # Hash password first (use passlib or bcrypt)
    hashed_password = hash_password(user.password)
    
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # Refresh to get generated id
    return db_user

# READ - single
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# READ - multiple with pagination
def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(User).offset(skip).limit(limit).all()

# UPDATE
def update_user(db: Session, user_id: int, user_update: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    # Update only provided fields
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

# DELETE
def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True
```

**Important methods:**
- `db.add(obj)` - Add object to session
- `db.commit()` - Save changes to database
- `db.refresh(obj)` - Reload object from database
- `db.query(Model)` - Start a query
- `.filter()` - WHERE clause
- `.first()` - Get first result or None
- `.all()` - Get all results as list
- `.offset()` / `.limit()` - Pagination

---

### 7. Complete FastAPI + SQLAlchemy Example

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# CRUD endpoints
@app.post("/users", response_model=UserResponse, status_code=201)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return create_user(db, user)

@app.get("/users/{user_id}", response_model=UserWithPosts)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_users(db, skip, limit)

@app.patch("/users/{user_id}", response_model=UserResponse)
def update_user_endpoint(
    user_id: int, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db)
):
    user = update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/users/{user_id}")
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
```

---

## 🏗️ PART 4: MICROSERVICES CONCEPTS

### What are Microservices?

Microservices architecture breaks down applications into small, independent services that communicate via APIs (usually REST or message queues).

**Monolith vs Microservices:**
- **Monolith**: One large application, all features in single codebase
- **Microservices**: Multiple small applications, each handles specific domain

---

### Key Microservices Principles

**1. Single Responsibility**
- Each service handles ONE business capability
- Example: User Service, Payment Service, Notification Service

**2. Independence**
- Deploy independently
- Scale independently
- Use different tech stacks if needed
- Fail independently (one service down ≠ whole system down)

**3. Decentralized Data**
- Each service has its own database
- No shared databases between services
- Data duplication is acceptable

**4. API Communication**
- Services communicate via REST APIs, gRPC, or message queues
- Synchronous (HTTP) or Asynchronous (message queues)
- Use API Gateway as single entry point

**5. Containerization**
- Package services in Docker containers
- Easy deployment and scaling
- Consistent environments (dev, staging, prod)

---

### FastAPI in Microservices

**Why FastAPI is great for microservices:**
- Fast performance (critical for service-to-service calls)
- Async support (handle many concurrent requests)
- Automatic documentation (each service documents itself)
- Easy to containerize
- Small footprint (lightweight services)

---

### Service Communication Patterns

**1. Synchronous (REST API calls)**
```python
import httpx  # Async HTTP client

@app.get("/user-orders/{user_id}")
async def get_user_with_orders(user_id: int):
    # Call User Service
    async with httpx.AsyncClient() as client:
        user_response = await client.get(f"http://user-service/users/{user_id}")
        user = user_response.json()
        
        # Call Order Service
        order_response = await client.get(f"http://order-service/orders?user_id={user_id}")
        orders = order_response.json()
    
    return {"user": user, "orders": orders}
```

**2. Asynchronous (Message Queue - RabbitMQ/Kafka)**
```python
# Service A publishes event
def create_order(order_data):
    # Save order to database
    order = save_order(order_data)
    
    # Publish event to message queue
    publish_event("order.created", {
        "order_id": order.id,
        "user_id": order.user_id,
        "total": order.total
    })
    
    return order

# Service B listens for events
def on_order_created(event_data):
    # Send confirmation email
    send_email(event_data["user_id"], "Order confirmed")
    
    # Update inventory
    update_inventory(event_data["order_id"])
```

---

### API Gateway Pattern

API Gateway sits in front of all microservices, routing requests to appropriate services.

**Benefits:**
- Single entry point for clients
- Authentication/authorization in one place
- Rate limiting
- Request routing and load balancing
- Response aggregation

**Simple example with FastAPI:**
```python
# api_gateway.py
from fastapi import FastAPI
import httpx

gateway = FastAPI()

@gateway.get("/api/users/{user_id}")
async def get_user(user_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://user-service:8001/users/{user_id}")
    return response.json()

@gateway.get("/api/products/{product_id}")
async def get_product(product_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://product-service:8002/products/{product_id}")
    return response.json()
```

---

### Service Discovery

Services need to find each other. Solutions:
- **Static configuration** (hardcoded URLs) - Simple but inflexible
- **Environment variables** - Better, configurable per environment
- **Service registry** (Consul, Eureka) - Services register themselves, dynamic discovery

```python
# Using environment variables
import os

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8001")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://localhost:8002")
```

---

### Health Checks & Monitoring

Each service should expose health endpoints:

```python
@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "user-service",
        "version": "1.0.0"
    }

@app.get("/health/db")
def db_health_check(db: Session = Depends(get_db)):
    """Check database connectivity"""
    try:
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}
```

---

### Docker for Microservices

**Dockerfile for FastAPI service:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml for multiple services:**
```yaml
version: '3.8'

services:
  user-service:
    build: ./user-service
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/users
  
  order-service:
    build: ./order-service
    ports:
      - "8002:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/orders
      - USER_SERVICE_URL=http://user-service:8000
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=pass
```

---

### Best Practices

**1. Keep services small and focused**
- If a service is doing too much, split it

**2. Design for failure**
- Services will fail, plan for it
- Implement retry logic, circuit breakers
- Use timeouts on external calls

**3. Use asynchronous communication when possible**
- Loosely coupled services
- Better resilience
- Use message queues for non-critical operations

**4. Centralized logging**
- Use tools like ELK stack (Elasticsearch, Logstash, Kibana)
- Correlate logs across services with request IDs

**5. API versioning**
- Version your APIs (/api/v1/, /api/v2/)
- Don't break existing clients

**6. Security between services**
- Use service-to-service authentication
- Network isolation where possible
- Encrypt sensitive data in transit

---

## 🚀 QUICK REFERENCE

### Running FastAPI

```bash
# Install
pip install fastapi uvicorn[standard] sqlalchemy

# Development (auto-reload)
uvicorn main:app --reload

# Production (multiple workers)
uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000

# Access docs
http://localhost:8000/docs  (Swagger UI)
http://localhost:8000/redoc (ReDoc)
```

### Project Structure
```
my_service/
├── main.py              # FastAPI app
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── database.py          # DB connection
├── crud.py              # Database operations
├── dependencies.py      # Shared dependencies
├── routers/             # Route modules
│   ├── users.py
│   └── posts.py
├── requirements.txt
├── Dockerfile
└── .env
```

---

**End of Complete Guide** 📝
