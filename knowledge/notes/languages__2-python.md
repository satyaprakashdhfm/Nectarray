# Python Notes - 05-11-2025

## 1. Operators & Precedence
Basic operations in Python: `a, b = 2, 8` with operators like `+, -, *, /, %, //, **`

**Operator Precedence (PEMDAS):**
- `**` (Power) - highest priority
- `*, /, //, %` (Multiplication, Division, Floor Division, Modulo)
- `+, -` (Addition, Subtraction) - lowest priority

```python
a, b = 2, 8
print(a + b * 2)  # 18 (not 20, because * comes first)
print((a + b) * 2)  # 20 (parentheses override)
print(a ** b // 2)  # 128 (2^8=256, then 256//2=128)
```

## 2. String Upper/Lowercase Naming
When naming variables, they should be immutable. String methods like `.upper()` and `.lower()` don't change the original; they need to be reassigned or cast back.

```python
name = "Alice"
name.upper()  # Doesn't change 'name'
name = name.upper()  # Now name is "ALICE"
```

## 3. Round vs Floor vs Ceil
- **Round**: Rounds to nearest number, if exactly `.5` then nearest even number
- **Floor**: Always rounds down to smaller number  
- **Ceil**: Always rounds up to larger number

```python
import math

# Round to nearest, .5 goes to nearest even
print(round(6.9))   # 7 (nearest)
print(round(6.5))   # 6 (nearest even)
print(round(7.5))   # 8 (nearest even)
print(round(6.4))   # 6 (nearest)

# Floor - always down
print(math.floor(6.9))  # 6

# Ceil - always up
print(math.ceil(6.5))   # 7
```

## 4. Range Function
`range(start, end)` returns an empty range if start >= end. **Negative step makes empty range if not configured properly.**

```python
range(5, 1)  # Empty range (5 > 1)
range(1, 5, -1)  # Empty range (going backward but start < end)

# Correct way for negative step:
range(5, 1, -1)  # [5, 4, 3, 2]
list(range(5, 1, -1))  # [5, 4, 3, 2]
```

## 5. Top 5 Confusions with Comparison Operators

### i. Range with < vs <=
```python
range(1, 5)  # [1, 2, 3, 4] - end is exclusive (<)
range(1, 6)  # [1, 2, 3, 4, 5] - need +1 for inclusive
```

### ii. Loop conditions
```python
# Off-by-one errors
for i in range(len(arr)):  # Correct: goes 0 to len-1
    print(arr[i])

for i in range(len(arr) + 1):  # Wrong! Index out of range
    print(arr[i])
```

### iii. While loop boundaries
```python
i = 0
while i < 5:  # Runs for i = 0,1,2,3,4
    i += 1

i = 0
while i <= 5:  # Runs for i = 0,1,2,3,4,5 (one extra!)
    i += 1
```

### iv. String/List slicing
```python
s = "hello"
s[1:4]  # "ell" (index 1,2,3 - end exclusive)
s[1:5]  # "ello" (index 1,2,3,4 - includes last char)
```

### v. Checking empty containers
```python
arr = []
if len(arr) > 0:  # Explicit check
    print("Not empty")

if arr:  # Pythonic way (empty is False)
    print("Not empty")
```

## 6. Dictionary Values & Keys
`dict.values()` or `dict.keys()` returns view objects, not lists

```python
d = {'a': 1, 'b': 2}
print(d.values())  # dict_values([1, 2])
print(list(d.values()))  # [1, 2]
```

## 7. Using `all()` and `any()`
Test conditions across iterables

```python
words = ["action", "traction", "faction"]
# Check if 'y' in all words
print(all(y in word for y in "action"))  # True

# Check if 'y' in any word (when y not in "action")
print(any(y in word for y in words if y not in "action"))  # False
```

## 8. Handling Key Errors in Dictionaries
Use `.get()` method to avoid KeyError

```python
d = {'name': 'Alice'}
print(d.get('age', 'Not found'))  # 'Not found'
# vs d['age'] which would raise KeyError
```

## 9. Creating Dictionary from Two Lists
Zip two lists together

```python
keys = ['a', 'b', 'c']
values = [1, 2, 3]
d = dict(zip(keys, values))
print(d)  # {'a': 1, 'b': 2, 'c': 3}
```

## 10. Set Operations
Set operations with union, intersection, difference

```python
setA = {1, 2, 3, 4}
setB = {3, 4, 5, 6}
print(setA - setB)  # {1, 2} (difference)
print(setA | setB)  # {1, 2, 3, 4, 5, 6} (union)
print(setA & setB)  # {3, 4} (intersection)
```

## 11. Pass by Value vs Pass by Reference
Immutable types (int, str, tuple) are pass by value. Mutable types (list, dict, set) are pass by reference.

```python
# Pass by value (immutable)
x = 5
def change(n):
    n = 10
change(x)
print(x)  # Still 5

# Pass by reference (mutable)
lst = [1, 2, 3]
def modify(l):
    l.append(4)
modify(lst)
print(lst)  # [1, 2, 3, 4] - modified!
```

## 12. List `.index()` Function
Returns the index of first occurrence of a value

```python
fruits = ['apple', 'banana', 'cherry', 'banana']
print(fruits.index('banana'))  # 1 (first occurrence)
print(fruits.index('cherry'))  # 2

# Raises ValueError if not found
# print(fruits.index('mango'))  # ValueError!

# Safe way:
if 'mango' in fruits:
    print(fruits.index('mango'))
else:
    print("Not found")
```

## 13. Solving Linear Equations in Python
Simple algebraic approach

```python
# Solve: 2x + 3 = 11
# 2x = 11 - 3
# x = 8 / 2
x = (11 - 3) / 2
print(f"x = {x}")  # x = 4.0

# Solve: 3y - 5 = 10
# 3y = 15
y = (10 + 5) / 3
print(f"y = {y}")  # y = 5.0
```

### ✅ Native vs Simulated – At a Glance

| **Feature**                 | **Natively Supported**                         | **Simulated**                               |
| --------------------------- | ---------------------------------------------- | ------------------------------------------- |
| **Enforced by language?**   | ✅ Yes (compiler/interpreter will block access) | ❌ No (developer discipline only)            |
| **Errors when violated?**   | ✅ Yes                                          | ❌ No (you can still access the member)      |
| **Examples**                | Java `private`, JS `#name`                     | Python `__name`, JS `_name`, Python `_name` |
| **Use in real-world apps?** | ✅ Strong typing systems                        | ✅ Used in scripting/dynamic environments    |

Python is meant to be high level means only mind business about only functiona input and output..nothing else

# intro:

The key points to understand are:

- All data structures in Python are implemented using some data type, but not all data types are necessarily data structures.

- In the memory all list , str are Sequence types and they are differentiated by data type and sequence have  characteristics of both: they're fundamental types in Python, but they also organize data in a structured way.

Here's a concise overview of the main data types in Python:

1. Numeric Types:
   - int: Integers
   - float: Floating-point numbers
   - complex: Complex numbers

2. Sequence Types:
   - str: Strings
   - bytes: Immutable sequences of bytes
   - bytearray: Mutable sequences of bytes

3. Text Type:
   - str: Strings (Unicode)

4. Boolean Type:
   - bool: True or False

5. None Type:
   - NoneType: Represents the None object

6. Set Types:
   - set: Mutable sets
   - frozenset: Immutable sets


### **Data Structures in Python:**
1. **List**
2. **Tuple**
3. **Set**
4. **Dictionary**
5. **String**
6. **Deque**
7. **NamedTuple**
8. **OrderedDict**
9. **DefaultDict**
10. **HeapQueue**
11. **Queue**
12. **Array**
13. **Bitarray**

---
---

| Feature        | List                  | Set                  | Dictionary            | Tuple                 | String                 |
|---------------|------------------------|----------------------|------------------------|-----------------------|------------------------|
| **Callable**   | No                     | No                   | No                     | No                    | No                     |
| **Indexing**   | Yes                    | No (Unordered)       | Yes (by key)           | Yes                   | Yes                    |
| **Ordering**   | Yes                    | No                   | Yes (Python 3.7+)      | Yes                   | Yes                    |
| **Hashable**   | No                     | No                   | No                     | Yes (if all elements are hashable) | Yes (Immutable) |
| **Mutable**    | Yes                    | Yes                  | Yes                    | No                    | No                     |




### Brief Explanation:

- **Callable**: Determines if you can call the object as a function. None of these data structures are callable.
- **Indexing**: Determines if you can access elements using an index (like `obj[index]`).
- **Ordering**: Determines if the order of elements is maintained. Dictionaries maintain insertion order starting from Python 3.7.
- **Hashable**: Determines if the object can be used as a key in a dictionary or as an element in a set. Hashable objects are immutable ones
- **Mutable**: Determines if you can change the content of the object after creation.If an object were immutable, then neither its values(updating) nor its size could be changed once it's created

mutable vs immutable 
- **Mutable objects allow in-place modification (like `my_list[5] = 6`), while "updating" immutable objects like strings (`my_string[5] = 's'`) is not allowed and instead requires creating a new object.**
 

While immutability and hashability often go hand-in-hand, they are not the same thing. Here’s a clearer explanation:

Immutability vs. Hashability

Immutability: An immutable object is one whose state cannot be modified after it is created. This means that once an immutable object is created, its data cannot be changed. Examples include tuples and strings in Python.

Hashability: A hashable object is one that has a fixed hash value and can be used as a key in a dictionary or as an element in a set. For an object to be hashable, it must be immutable because its hash value must remain constant throughout its lifetime.


**"All hashable objects are immutable, but not all immutable objects are hashable."**
    example:
        - **An immutable object is not hashable when it contains a mutable element. The most common example of this in Python is a tuple that contains a list (or another mutable object).**

---
---

Certainly! Here's a list of common and useful functions and methods for each of the main data structures in Python: lists, strings, tuples, dictionaries, and sets.

### 1. **List**

- **Creation**: `list()`
- **Methods**:
  - `append(x)`: Adds item `x` to the end of the list.
  - `extend(iterable)`: Extends the list by appending elements from an iterable.
  - `insert(i, x)`: Inserts item `x` at a given position `i`.
  - `remove(x)`: Removes the first item with value `x`. Raises `ValueError` if not found.
  - `pop([i])`: Removes and returns item at position `i` in the list. If no index is specified, `pop()` removes and returns the last item.
  - `clear()`: Removes all items from the list.
  - `index(x[, start[, end]])`: Returns the index of the first item whose value is equal to `x`. Raises `ValueError` if not found.
  - `count(x)`: Returns the number of occurrences of item `x`.
  - `sort(key=None, reverse=False)`: Sorts the items of the list in place.
  - `reverse()`: Reverses the elements of the list in place.
  - `copy()`: Returns a shallow copy of the list.

### 2. **String**

- **Creation**: `str()`

**Basic Methods:**
- **`str()`** - Converts an object to a string.
- **`.capitalize()`** - Capitalizes the first letter of the string.
- **`.casefold()`** - Converts the string to lowercase for case-insensitive comparisons.
- **`.center(width[, fillchar])`** - Centers the string in a field of a given width.
- **`.encode(encoding='utf-8', errors='strict')`** - Encodes the string using a specified encoding.
- **`.find(sub[, start[, end]])`** - Returns the lowest index where substring `sub` is found.
- **`.index(sub[, start[, end]])`** - Returns the lowest index where substring `sub` is found (raises `ValueError` if not found).
- **`.join(iterable)`** - Joins elements of an iterable with the string as a separator.
- **`.lower()`** - Converts the string to lowercase.
- **`.lstrip([chars])`** - Removes leading whitespace or specified characters.
- **`.rstrip([chars])`** - Removes trailing whitespace or specified characters.
- **`.strip([chars])`** - Removes leading and trailing whitespace or specified characters.
- **`.replace(old, new[, count])`** - Replaces occurrences of `old` with `new` in the string.
- **`.split([sep[, maxsplit]])`** - Splits the string into a list using a specified separator.
- **`.splitlines([keepends])`** - Splits the string at line boundaries.
- **`.title()`** - Converts the string to title case.
- **`.upper()`** - Converts the string to uppercase.
- **`.zfill(width)`** - Pads the string with zeros on the left, to a specified width.

**String Checking Methods:**
- **`.isalpha()`** - Returns `True` if all characters are alphabetic.
- **`.isdigit()`** - Returns `True` if all characters are digits.
- **`.islower()`** - Returns `True` if all characters are lowercase.
- **`.isupper()`** - Returns `True` if all characters are uppercase.
- **`.isspace()`** - Returns `True` if all characters are whitespace.
- **`.istitle()`** - Returns `True` if the string is title-cased.
- **`.isalnum()`** - Returns `True` if all characters are alphanumeric.

### 3. **Tuple**

- **Creation**: `tuple()`
- **Methods**:
  - `count(x)`: Returns the number of occurrences of item `x`.
  - `index(x[, start[, end]])`: Returns the index of the first occurrence of item `x`. Raises `ValueError` if not found.

### 4. **Dictionary**

- **Creation**: `dict()`
- **Methods**:
  - `clear()`: Removes all items from the dictionary.
  - `copy()`: Returns a shallow copy of the dictionary.
  - `fromkeys(iterable[, value])`: Creates a new dictionary with keys from `iterable` and values set to `value` (default is `None`).
  - `get(key[, default])`: Returns the value for `key` if `key` is in the dictionary, else returns `default`.
  - `items()`: Returns a view object that displays a list of a dictionary's key-value tuple pairs.
  - `keys()`: Returns a view object that displays a list of all the dictionary's keys.
  - `pop(key[, default])`: Removes and returns the value for `key`. Raises `KeyError` if `key` is not found and `default` is not provided.
  - `popitem()`: Removes and returns a (key, value) pair from the dictionary. Pairs are returned in LIFO order.
  - `setdefault(key[, default])`: Returns the value for `key` if `key` is in the dictionary. If not, inserts `key` with a value of `default` and returns `default`.
  - `update([other])`: Updates the dictionary with key-value pairs from `other`, overwriting existing keys.
  - `values()`: Returns a view object that displays a list of all the dictionary's values.

### 5. **Set**

- **Creation**: `set()`
- **Methods**:
  - `add(elem)`: Adds element `elem` to the set.
  - `clear()`: Removes all elements from the set.
  - `copy()`: Returns a shallow copy of the set.
  - `difference(*others)`: Returns a set containing elements that are in the set but not in `others`.
  - `difference_update(*others)`: Removes elements found in `others` from the set.
  - `discard(elem)`: Removes element `elem` from the set if it is present.
  - `intersection(*others)`: Returns a set containing elements that are common to all sets in `others`.
  - `intersection_update(*others)`: Updates the set with elements that are common to all sets in `others`.
  - `isdisjoint(other)`: Returns `True` if the set has no elements in common with `other`.
  - `issubset(other)`: Returns `True` if the set is a subset of `other`.
  - `issuperset(other)`: Returns `True` if the set is a superset of `other`.
  - `pop()`: Removes and returns an arbitrary element from the set.
  - `remove(elem)`: Removes element `elem` from the set. Raises `KeyError` if `elem` is not present.
  - `symmetric_difference(other)`: Returns a set containing elements in either the set or `other` but not in both.
  - `symmetric_difference_update(other)`: Updates the set with elements in either the set or `other` but not in both.
  - `union(*others)`: Returns a set containing all elements from the set and `others`.
  - `update(*others)`: Updates the set with elements from `others`.

### **2. Characters**
In Python, characters are just strings of length 1, so character methods are essentially string methods. Common methods include:
- **`.ord(c)`** - Returns the Unicode code point for a one-character string.
- **`.chr(i)`** - Returns a string representing a character whose Unicode code point is the integer `i`.

### **3. Numbers**

**Integer Methods:**
- **`int(x[, base])`** - Converts a number or string to an integer.
- **`.bit_length()`** - Returns the number of bits necessary to represent the integer in binary.

**Floating-Point Methods:**
- **`float([x])`** - Converts a number or string to a floating-point number.
- **`.as_integer_ratio()`** - Returns a tuple representing the fraction of the floating-point number.







 

Here’s a list of commonly used Python built-in functions and methods, arranged by their general frequency of use:

1. **`len(s)`** - Returns the length (number of items) of an object.
2. **`str(object='', encoding='utf-8', errors='strict')`** - Converts an object to a string.
3. **`int([x[, base]])`** - Converts a number or string to an integer.
4. **`float([x])`** - Converts a number or string to a floating-point number.
5. **`list([iterable])`** - Creates a list from an iterable.
6. **`dict([mapping or iterable])`** - Creates a dictionary.
7. **`set([iterable])`** - Creates a set.
8. **`range(start, stop[, step])`** - Returns an immutable sequence of numbers from `start` to `stop` by `step`.
9. **`type(object)`** - Returns the type of an object.
10. **`sorted(iterable, *, key=None, reverse=False)`** - Returns a new sorted list from the items in `iterable`.
11. **`max(iterable, *[, key, default])`** - Returns the largest item in an iterable or the largest of two or more arguments.
12. **`min(iterable, *[, key, default])`** - Returns the smallest item in an iterable or the smallest of two or more arguments.
13. **`sum(iterable[, start])`** - Sums start and the items of an iterable from left to right.
14. **`enumerate(iterable, start=0)`** - Returns an iterator that produces pairs of index and value from the iterable.
15. **`zip(*iterables)`** - Returns an iterator of tuples, where the i-th tuple contains the i-th element from each of the argument iterables.
16. **`map(function, iterable, ...)`** - Applies `function` to every item of `iterable` (and others) and returns a map object.
17. **`filter(function, iterable)`** - Constructs an iterator from elements of `iterable` for which `function` returns `True`.
18. **`abs(x)`** - Returns the absolute value of a number.
19. **`round(number[, ndigits])`** - Rounds a floating-point number to a specified number of decimal places.
20. **`eval(expression[, globals[, locals]])`** - Evaluates a string expression and returns the result.
21. **`input([prompt])`** - Reads a line from input and returns it as a string.
22. **`print(*objects, sep=' ', end='\n', file=sys.stdout)`** - Prints objects to the text stream `file`.
23. **`isinstance(object, classinfo)`** - Returns `True` if `object` is an instance of `classinfo`.
24. **`hasattr(object, name)`** - Returns `True` if the object has the named attribute.
25. **`getattr(object, name[, default])`** - Returns the value of the named attribute of an object.
26. **`setattr(object, name, value)`** - Sets the value of the named attribute of an object.
27. **`delattr(object, name)`** - Deletes an attribute from an object.
28. **`del`** - Deletes a reference to an object.
29. **`open(file[, mode, buffering])`** - Opens a file and returns a file object.
30. **`close()`** - Closes the file object.
31. **`chr(i)`** - Returns a string representing a character whose Unicode code point is the integer `i`.
32. **`ord(c)`** - Returns the Unicode code point for a one-character string.
33. **`hex(x)`** - Converts an integer to a hexadecimal string.
34. **`bin(x)`** - Converts an integer to a binary string.
35. **`oct(x)`** - Converts an integer to an octal string.
36. **`format(value[, format_spec])`** - Returns a formatted string representation of `value`.
37. **`slice(start, stop[, step])`** - Returns a slice object.
38. **`reversed(seq)`** - Returns an iterator that accesses the given sequence in the reverse order.
39. **`frozenset([iterable])`** - Creates an immutable set.
40. **`id(object)`** - Returns the identity of an object (its memory address).
41. **`classobject()`** - Returns a new featureless object.
42. **`exec(object[, globals[, locals]])`** - Executes a string of Python code.
43. **`exit([status])`** - Exits the interpreter with an optional status code.
44. **`import(name)`** - Imports a module.
45. **`__import__(name, globals=None, locals=None, fromlist=(), level=0)`** - Imports a module.
46. **`locals()`** - Updates and returns a dictionary representing the current local symbol table.
47. **`globals()`** - Returns a dictionary representing the current global symbol table.

These functions and methods are frequently used in everyday Python programming tasks.

---
---

- Use `*args` when you want to handle a flexible number of positional arguments.
- Use `**kwargs` when you want to handle a flexible number of keyword arguments.

| Feature          | `*args`                                 | `**kwargs`                             |
|------------------|-----------------------------------------|----------------------------------------|
| Purpose           | Passes a variable number of positional arguments | Passes a variable number of keyword arguments |
| Syntax            | Uses a single asterisk `*`             | Uses double asterisks `**`            |
| Type of Arguments | Accepts non-keyword arguments (positional) | Accepts keyword arguments (key-value pairs) |
| Access            | Accessed as a tuple                      | Accessed as a dictionary               |
| Example Usage     | `def func(*args):`                      | `def func(**kwargs):`                 |
| Call Example      | `func(1, 2, 3)`                        | `func(a=1, b=2)`                      |

```python
class MathOperations:
    def add(self, *args):
        return sum(args)  # Sums all provided arguments

math = MathOperations()

print(math.add(1, 2))             # Output: 3
print(math.add(1, 2, 3, 4, 5))    # Output: 15

class Person:
    def __init__(self, **kwargs):
        self.name = kwargs.get('name', 'Unknown')
        self.age = kwargs.get('age', 0)

person1 = Person(name="Alice", age=30)
person2 = Person(name="Bob")

print(f"{person1.name} is {person1.age} years old.")  # Output: Alice is 30 years old.
print(f"{person2.name} is {person2.age} years old.")  # Output: Bob is 0 years old.

```

---
---

---
---
---
---

# Object-Oriented Programming (OOPs) 
- Class,
- Objects,
- Polymorphism,
- Encapsulation,
- Inheritance,
- Data Abstraction,
 

## Class: group of similar objects -- blue print  or templates in which objects are created

## Object: is an instance of class --different types of products of class model

## Methods:
- functions or definations in objects.
- types:
    - class method 
    - instance method
    - static method - are put into class because of reason that code should not look bad..thats it..they can be defined without need of class

1. **Magic Methods**
  - **`__len__()` (Length of Object):**
    - **Purpose:** Returns the length of the object.
    - **Usage:** Used by `len()`.

  - **`__call__()` (Callable Objects):**
    - **Purpose:** Makes an instance callable like a function.
    - **Usage:** Allows objects to be called as functions.

  - **`__eq__()`, `__lt__()`, `__gt__()` (Comparison Operators):**
    - **Purpose:** Define behavior for equality and comparison operators (`==`, `<`, `>`).
    - **Usage:** Enables custom comparison logic between objects.

  - **`__iter__()`, `__next__()` (Iteration Protocol):**
    - **Purpose:** Support iteration over objects.
    - **Usage:** Allows objects to be used in loops (e.g., `for` loops).

  - **`__enter__()`, `__exit__()` (Context Management):**
    - **Purpose:** Define setup and teardown actions for context managers.
    - **Usage:** Used by the `with` statement.

  - **`__del__()` (Destructor):**
    - **Purpose:** Called when an object is about to be destroyed.
    - **Usage:** Used for cleanup actions.

  - **`__contains__()` (Membership Test):**
    - **Purpose:** Checks if an item is in the object.
    - **Usage:** Used by the `in` keyword.

   - **`__getitem__()`, `__setitem__()` (Item Access):**
     - **Purpose:** Define behavior for indexing and setting items.
     - **Usage:** Allows objects to be accessed like lists or dictionaries.
     - **Example:**
       ```python
       class MyList:
           def __init__(self):
               self.items = []
           
           def __getitem__(self, index):
               return self.items[index]
           
           def __setitem__(self, index, value):
               self.items[index] = value
       ```

```python
# variables code

class Person:
    # Class variable
    number_of_people = 0

    def __init__(self, name, age):
        self.name = name   # Instance variable
        self.age = age     # Instance variable
        Person.number_of_people += 1  # Increment class variable

    # Instance Method
    def greet(self):
        return f"Hello, my name is {self.name} and I am {self.age} years old."

    # Class Method
    @classmethod
    def get_number_of_people(cls):
        return cls.number_of_people

    # Static Method
    @staticmethod
    def is_adult(age):
        # age is a static variable
        return age >= 18

# Creating instances
person1 = Person("Alice", 30)
person2 = Person("Bob", 25)

# Using Instance Method
print(person1.greet())  # Output: Hello, my name is Alice and I am 30 years old.

# Using Class Method
print(Person.get_number_of_people())  # Output: 2

# Using Static Method
print(Person.is_adult(30))  # Output: True
print(Person.is_adult(16))  # Output: False

person1.is_adult(30)  # Output: True

# shows that statis method is without self or cls and can be called without instance or class and class method is with class as first argument and can be called with class object.
print(Person.get_number_of_people)
print(Person.is_adult)
```

```result
Hello, my name is Alice and I am 30 years old.
2
True
False
<bound method Person.get_number_of_people of <class '__main__.Person'>>
<function Person.is_adult at 0x7ffb82f03600>
```

```python
# magic methods code
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def __str__(self):
        return f"{self.name}, {self.age} years old"
    def __repr__(self):
        return f"Person('{self.name}', {self.age})"

person = Person("Alice", 30)
print(type(person))
repr_person = repr(person)
print(type(repr_person))


class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
vec=Vector(2,3)+Vector(3,5)
print(vec.x, vec.y)  # Output: 5 8
```

```result
<class '__main__.Person'>
<class 'str'>
5 8
```

## Variables: 
- A variable in Python is a named storage location used to hold data.
- types:
    - class variables
    - instance variables
    - static variable
    
### Special Built-in Variables in Python
    Python provides several special built-in variables, often called "dunder" (double underscore) variables, that are automatically defined and have special meaning:

- **`__name__`**: Indicates the name of the current module. It is `"__main__"` if the module is being run as the main program. && `function.__name__` -- function’s name as a string
- **`__doc__`**: Contains the documentation string for the module, class, method, or function.
- **`__file__`**: The path to the file from which the module was loaded.
- **`__dict__`**: A dictionary representing the namespace of the object (such as a module, class, or instance).
- **`__class__`**: The class to which an instance belongs.
- **`__bases__`**: A tuple containing the base classes of a class.
- **`__mro__`**: The method resolution order for a class.
- **`__module__`**: The name of the module in which a class was defined.
- **`__slots__`**: Used to declare a fixed set of attributes for instances.
- **`__annotations__`**: Stores type hints for variables, functions, and classes.
- **`__package__`**: The package name for the module.
- **`__builtins__`**: A reference to the built-in module.
- **`__spec__`**: Module specification object, used for import machinery.
- **`__loader__`**: The loader used to import the module.
- **`__cached__`**: The path to the compiled bytecode file.

---
---

# Inheritence:
- is the capbility of one class to derive or inherit the properties from another class

![](kb-media:17810ef1d7891ef4dab4.png)

```python
# Base Class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, my name is {self.name} and I am {self.age} years old."

# Single Inheritance
class Student(Person):
    def __init__(self, name, age, student_id):
        Person.__init__(self, name, age)
        self.student_id = student_id

    def greet(self):
        return f"Hi, I'm {self.name}, a student with ID {self.student_id}."

# Multiple Inheritance
class Employee(Person):
    def __init__(self, name, age, employee_id):
        Person.__init__(self, name, age)
        self.employee_id = employee_id

    def greet(self):
        return f"Hello, I'm {self.name}, an employee with ID {self.employee_id}."

class Intern:
    def __init__(self, internship_id):
        self.internship_id = internship_id

    def intern_info(self):
        return f"Internship ID: {self.internship_id}"

class InternEmployee(Student, Employee, Intern):
    def __init__(self, name, age, student_id, employee_id, internship_id):
        Student.__init__(self, name, age, student_id)
        Employee.__init__(self, name, age, employee_id)
        Intern.__init__(self, internship_id)

    def greet(self):
        return (f"Hello, I'm {self.name}, a student with ID {self.student_id}, "
                f"an employee with ID {self.employee_id}, and an intern with ID {self.internship_id}.")

# Hierarchical Inheritance
class Adult(Person):
    def __init__(self, name, age, job_title):
        Person.__init__(self, name, age)
        self.job_title = job_title

    def greet(self):
        return f"Hello, I'm {self.name}, an adult with the job title {self.job_title}."

# Multilevel Inheritance
class Retired(Adult):
    def __init__(self, name, age, job_title, retirement_age):
        Adult.__init__(self, name, age, job_title)
        self.retirement_age = retirement_age

    def greet(self):
        return (f"Hello, I'm {self.name}, a retired individual with the job title {self.job_title}, "
                f"retired at age {self.retirement_age}.")

# Instances of each class
person = Person("John", 40)
student = Student("Alice", 22, "S1234")
employee = Employee("Bob", 30, "E5678")
intern_employee = InternEmployee("Eve", 25, "S5678", "E9101", "I1122")
adult = Adult("Jane", 35, "Engineer")
retired = Retired("Mary", 65, "Teacher", 60)

# Print greetings
print(person.greet())
print(student.greet())
print(employee.greet())
print(intern_employee.greet())
print(adult.greet())
print(retired.greet())
```

```result
Hello, my name is John and I am 40 years old.
Hi, I'm Alice, a student with ID S1234.
Hello, I'm Bob, an employee with ID E5678.
Hello, I'm Eve, a student with ID S5678, an employee with ID E9101, and an intern with ID I1122.
Hello, I'm Jane, an adult with the job title Engineer.
Hello, I'm Mary, a retired individual with the job title Teacher, retired at age 60.
```

- `super()` is used to make inheritance of init or constructor but without it `class.init(self,self.values)` is fine to write

---
---

# **Polymorphism in Python**

*Definition:*
Polymorphism refers to the ability of different objects to respond to the same method in their own way or accessing of different no: of objects properties through same interface.

* Not tied to inheritance: Inheritance is often used to achieve polymorphism but is not a requirement.

## Ways to Implement Polymorphism in Python

1. Duck Typing (Pure Pythonic Polymorphism)
- Python focuses on method and checks does it have then execute,but not the object type.
> "If it walks like a duck and quacks like a duck, it must be a duck."
> This is the essence of duck typing, a core concept in Python’s polymorphism.

2. Operator Overloading
- Allows custom behavior for operators when used with user-defined objects , like adding classes.

3. Method Overloading (Simulated)
- general c++ will have different same named methods with different parameters, but python does not support this directly.
- Instead, we can use default arguments or variable-length arguments to achieve similar functionality.
- Python doesn't support traditional method overloading, but you can simulate it using:

* Default arguments
* Variable-length arguments (`*args`, `**kwargs`)

4. Method Overriding
- Occurs when a subclass provides a different implementation of a method defined in its superclass.

---
### Types of Polymorphism in Python

 1. Runtime Polymorphism (Main Type in Python)

* Method resolution is determined **at runtime**
* Includes: **Method Overriding**, **Duck Typing**, **Operator Overloading**

 2. Compile-time Polymorphism (Simulated)

Python is not compiled and **does not support** traditional compile-time polymorphism. However, we simulate similar behavior using:

* **Default Arguments**
* **Variable Arguments**
* **Function Dispatch (e.g., `functools.singledispatch`)**

---

## 📝 Summary

| Feature                   | Supported in Python | Notes                                          |
| ------------------------- | ------------------- | ---------------------------------------------- |
| Compile-time Polymorphism | 🚫 No               | Python is dynamically typed and interpreted    |
| Operator Overloading(general - compile time)      | ✅ Yes (stimulated not real)              | Via magic methods (`__add__`, `__mul__`, etc.) |
| Method Overloading(general - compile time)        | ✅ Yes (Simulated not real)   | Use default/variable (*args, **kwargs) arguments instead         |
| Method Overriding(general - runtime)         | ✅ Yes               | Inheritance-based,Duck Typing                              |

```python
# duck typing
class Duck:
    def fly(self):
        print("Duck flying")

class Airplane:
    def fly(self):
        print("Airplane flying")

def lift_off(entity):
    entity.fly()

duck = Duck()
airplane = Airplane()

lift_off(duck)      # Output: Duck flying
lift_off(airplane)  # Output: Airplane flying


# method overriding:

class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "Some sound"

class Dog(Animal):
    def __init__(self, name):
        super().__init__(name)

    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def __init__(self, name):
        super().__init__(name)

    def speak(self):
        return f"{self.name} says Meow!"

def animal_sound(animal):
    print(animal.speak())

dog = Dog("Buddy")
cat = Cat("Whiskers")

animal_sound(dog)  # Output: Buddy says Woof!
animal_sound(cat)  # Output: Whiskers says Meow!


# method overloading:
# general c++ will have different same named methods with different parameters, but python does not support this directly.
# Instead, we can use default arguments or variable-length arguments to achieve similar functionality.

class MathOperations:
    def add(self, a, b=0, c=0):
        return a + b + c

math = MathOperations()
print(math.add(5))        # Output: 5
print(math.add(5, 10))    # Output: 15
print(math.add(5, 10, 15))# Output: 30

# or 

def display_info(*args, **kwargs):
    # Print positional arguments
    print("Positional arguments:")
    for arg in args:
        print(arg)

    # Print keyword arguments
    print("\nKeyword arguments:")
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Example usage
display_info(1, 2, 3, name="Alice", age=30, city="New York")


# operator overloading
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

p1 = Point(1, 2)
p2 = Point(3, 4)
p3 = p1 + p2
print(f"({p3.x}, {p3.y})")  # Output: (4, 6)
```

```result
Duck flying
Airplane flying
Buddy says Woof!
Whiskers says Meow!
5
15
30
Positional arguments:
1
2
3

Keyword arguments:
name: Alice
age: 30
city: New York
(4, 6)
```

# Abstraction : 
- Hiding data and showing only imp things.......for easy understanding purpose.....at 

- for a small-scale application or a script, using an abstract base class might be unnecessary. However, the benefits of using abstraction become more apparent in larger, more complex systems. Let's explore why:

- Code Organization and Standardization:

- The abstract base class defines a consistent interface that all database connectors must follow.
This enforces a standard structure, making the code more predictable and easier to maintain.


- Ease of Extending:

- When you need to add a new type of database connector, the abstract base class provides a clear template to follow.
This reduces the chance of forgetting to implement critical methods.

- In Python, abstraction is primarily achieved through Abstract Base Classes (ABC).

Here’s a detailed look at each:

###  **Abstract Classes and Methods**

- **Abstract Classes:** These are classes that cannot be instantiated directly and are meant to be subclassed. They provide a blueprint for other classes. Abstract classes can contain abstract methods, which must be implemented by any subclass.

- **Abstract Methods:** These are methods declared in an abstract class using the `@abstractmethod` decorator. They do not have an implementation in the abstract class, and subclasses are required to provide an implementation.


In this below example:
- `Shape` defines the methods `area()` and `perimeter()` that any subclass must implement.
- `Rectangle` provides concrete implementations of these methods.

### Summary

- **Abstract Classes and Methods:** Define a class that cannot be instantiated and methods that must be implemented by subclasses.
- **Interfaces (via Abstract Base Classes):** Define a set of methods that must be implemented by any class that uses the interface, often through abstract base classes.

Both methods use the `abc` module and are integral to achieving abstraction in Python.

---

https://peps.python.org/pep-3119/

```python
from abc import ABC, abstractmethod

# Abstract class
class Vehicle(ABC):
    def __init__(self, brand):
        self.brand = brand

    @abstractmethod
    def start(self):
        pass

    def show_brand(self):
        print(f"Brand: {self.brand}")

# Subclass Car
class Car(Vehicle):
    def __init__(self, brand):
        super().__init__(brand)
        self.wheels = 4

    def start(self):
        print("Car started with key ignition.")

    def show_wheels(self):
        print(f"Wheels: {self.wheels}")

# Subclass ElectricScooter
class ElectricScooter(Vehicle):
    def __init__(self, brand):
        super().__init__(brand)
        self.battery_level = 100

    def start(self):
        print("Electric Scooter started with button.")

    def show_battery(self):
        print(f"Battery Level: {self.battery_level}%")

# Using abstract class reference
my_car = Car("Toyota")
my_car.show_brand()
my_car.start()
# my_car.show_wheels()  # Allowed in Python, because Python is dynamic

# But to simulate abstraction strictly like Java:
vehicle_ref: Vehicle = Car("Honda")
vehicle_ref.show_brand()
vehicle_ref.start()
# vehicle_ref.show_wheels()  # ❌ Not recommended: Python allows but not abstraction-safe

# Subclass-specific usage
real_car = Car("Honda")
real_car.show_brand()
real_car.start()
real_car.show_wheels()  # ✅ Allowed

my_scooter = ElectricScooter("Xiaomi")
my_scooter.show_brand()
my_scooter.start()
# my_scooter.show_battery()  # ✅ Allowed

scooter = ElectricScooter("Ola")
scooter.show_brand()
scooter.start()
scooter.show_battery()
```

```result
Brand: Toyota
Car started with key ignition.
Brand: Honda
Car started with key ignition.
Wheels: 4
Brand: Honda
Car started with key ignition.
Wheels: 4
Brand: Xiaomi
Electric Scooter started with button.
Brand: Ola
Electric Scooter started with button.
Battery Level: 100%
```

# Encapsulation:
 Hiding data for protection purpose. They must access it via getter and setter methods.

- abstraction=data hiding.
- encapsulation = data hiding + protection

wraping of data and the methods that work on data with in one unit uses:
        data hiding ,
        flexibility,
        reusability

Encapsulation in Python is achieved through the use of classes to bundle data (attributes) and methods (functions) together. Encapsulation is one of the core principles of Object-Oriented Programming (OOP) and helps in restricting access to certain components of an object to prevent unintended interference and misuse.

### **Key Concepts of Encapsulation in Python**

1. **Private Attributes and Methods:**
   Private attributes and methods are not directly accessible from outside the class. They are intended to be used only within the class itself. In Python, private attributes and methods are indicated by a leading underscore (`_`) or double underscore (`__`).

2. **Protected Attributes and Methods:**
   Protected attributes and methods are accessible within the class and by subclasses. They are indicated by a single leading underscore (`_`), suggesting that they are intended for internal use.

- ✅ Accessing varibles or setting varibles :f
 You can use both @property and public methods to get and set values of both private (__var) and protected (_var) variables in Python.

   1. **Public Attributes and Methods:**
      Public attributes and methods are accessible from outside the class. By default, all attributes and methods are public if no leading underscores are used.

   2. **Property Decorators:**
      Property decorators (`@property`, `@<name>.setter`, `@<name>.deleter`) allow you to define methods in a class that can be accessed like attributes, enabling controlled access and modification of private attributes.

```python
class BankAccount:
    def __init__(self, account_number, account_holder, balance, branch_name):
        self.__account_number = account_number      # "private"
        self.account_holder = account_holder        # public
        self._balance = balance                     # "protected"
        self.branch_name = branch_name              # default/public

    # "Private" method: by convention
    def __show_private_info(self):
        print(f"Private Info: {self.__account_number}")

    # Public getter for account number
    def get_account_number(self):
        self.__show_private_info()  # ✅ internal call to private method
        return self.__account_number

    # Protected method: by convention
    def _show_protected_info(self):
        print(f"Protected Info: Balance = {self._balance}")

    # Public method for showing branch
    def show_branch(self):
        print(f"Branch: {self.branch_name}")

    # Public getters/setters
    def get_account_holder(self):
        return self.account_holder

    def set_account_holder(self, new_name):
        self.account_holder = new_name

    def get_balance(self):
        return self._balance

    # Public deposit method with validation
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            print(f"Deposited: {amount}")
        else:
            print("Invalid deposit amount!")

    # Public withdraw method with validation
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            print(f"Withdrawn: {amount}")
        else:
            print("Invalid or insufficient funds!")
# Example usage
acc = BankAccount("123456", "Alice", 1000.0, "Main Branch")

# Public access
print("Account Number:", acc.get_account_number())   # ✅ via method
print("Account Holder:", acc.get_account_holder())   # ✅ public
print("Balance:", acc.get_balance())                 # ✅ via getter
print("Branch:", acc.branch_name)                    # ✅ public field

acc.deposit(500)
acc.withdraw(200)
acc.set_account_holder("Alice Smith")
print("Updated Account Holder:", acc.get_account_holder())
print("Final Balance:", acc.get_balance())

# Accessing "protected" and "default" methods
acc._show_protected_info()  # ⚠️ Allowed, but meant for internal/subclass
acc.show_branch()           # ✅ public

# ❌ Trying to access private members (will work, but discouraged)
# print(acc.__account_number)         # AttributeError
# acc.__show_private_info()           # AttributeError

# ⚠️ Still possible (name mangling, not true private)
# print(acc._BankAccount__account_number)  # 😬 possible but discouraged
```

```result
Private Info: 123456
Account Number: 123456
Account Holder: Alice
Balance: 1000.0
Branch: Main Branch
Deposited: 500
Withdrawn: 200
Updated Account Holder: Alice Smith
Final Balance: 1300.0
Protected Info: Balance = 1300.0
Branch: Main Branch
```

### can be done with @setter @getter decorators

---

# 5. Mastering oops:

### 🔧 **Creational Patterns**

These deal with **object creation** mechanisms.

1. **Singleton**
Ensures a class has only one instance throughout the application.

2. **Factory**
Provides a way to create objects without specifying the exact class type.

3. **Builder**
Constructs complex objects step-by-step, separating the construction logic from the final representation.


### 🏗️ **Structural Patterns**

These deal with the **composition of classes and objects**.

1. **Adapter**
Converts one interface into another that clients expect, allowing incompatible classes to work together.

2. **Composite**
Composes objects into tree structures to represent part-whole hierarchies (e.g., folders and files).

3. **Decorator**
Adds responsibilities to individual objects dynamically without modifying the original class.


### 🎭 **Behavioral Patterns**

These focus on **communication between objects**.

1. **Observer**
When one object changes state, all its dependents are notified automatically (e.g., event systems).

2. **Strategy**
Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.

3. **Command**
Encapsulates a request as an object, allowing requests to be queued, logged, or undone.


### 🧩 **Other Important Constructs** (not GoF design patterns but very useful):

1. **Mixin**
A reusable class that adds specific functionality to other classes via inheritance (commonly used in Python, JavaScript, etc.).

2. **Decorator (Python-specific)**
A language feature (using `@`) that wraps a function or method to modify or extend its behavior (similar to the pattern but built-in).
- closure property is used for decorator working
- stacking one decorator with another many we can do
- practical examples:
    1. logging
    2. function execution check

```python

def outer(fuck):
    def inner(*args): # just a norma habit to write * args(for values), **kwargs (for extra keywrod arguments as a dictory like a=2 as {'a'=2})
        print('inner executed this before {}'.format(fuck.__name__))
        print(f'Decorator1: there is a king with certain name and age')
        return fuck(*args)
    return inner


@outer
def display_data(name, age):
    print('display_info ran with arguments: {}, {}'.format(name, age))

display()
display_data('surya', 26)
```

```result
inner executed this before display_data
Decorator1: there is a king with certain name and age
display_info ran with arguments: surya, 26
```

```python
# class as a decorator:

class decorator_class(object):
    def __init__(self, original_function):
        self.original_function = original_function

    def __call__(self, *args, **kwargs):
        print('Call executed this before {}'.format(self.original_function.__name__))
        print('Decorator: there is a king with certain name and age')
        return self.original_function(*args, **kwargs)
    
@decorator_class
def display_info(name,age):
    print('here are name and age: {}, {}'.format(name, age))

display_info('satya',25)
```

```result
Call executed this before display_info
Decorator: there is a king with certain name and age
here are name and age: satya, 25
```

```python
# example of logging

def  my_logger(orig_func):
    import logging
    logging.basicConfig(filename='{}.log'.format(orig_func.__name__),level=logging.INFO)

    def wrapper(*args,**kwargs):
        logging.info('Ran with args : {},and kwargs: {}'.format(args,kwargs))
        return orig_func(*args, **kwargs)
    return wrapper

def my_timer(orig_func):
    import time

    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = orig_func(*args, **kwargs)
        end_time = time.time()
        run_time = end_time - start_time
        print('Ran {} in: {} sec'.format(orig_func.__name__, run_time))
        return result
    return wrapper

# stacking two decorators:
# 1. loggin example
# 2. timer example

@my_logger
@my_timer
def display_info(name, age): # display_info = my_logger(my_timer(display_info))
    print('display_info ran with arguments: {}, {}'.format(name, age))  

display_info('satya', 26)
```

```result
display_info ran with arguments: satya, 26
Ran display_info in: 0.000102996826171875 sec
```

# 6. **Functional Programming in OOP**

1. **Functions as First-Class Citizens:** Functions can be passed as arguments, returned from other functions, and assigned to variables just as any varibles.

2. **Higher-Order Functions:** Functions that take other functions as arguments or return functions.

Uses:
1. **Closures and Lambdas:**
   - **Closures:** Functions that retain access to their enclosing scopes even after enclosing function completed execution.
   - **Lambdas:** Anonymous functions defined using the `lambda` keyword.
   ```python
   def make_multiplier(factor):
       def multiplier(x):
           return x * factor
    return multiplier # first class functions & high order functions example

   doubler = make_multiplier(2)
   print(doubler(5))  # 10

   add = lambda x, y: x + y
   print(add(2, 3))  # 5
   ```
2. Closures are also often used with `callbacks`, particularly for `event handlers`, such as in JavaScript, where they are used for interactions with a dynamic web page.

# 7. **Error Handling and Exceptions**

1. **Exception Handling:**
   - **`try`, `except`,`else`, `finally`:** Used to handle exceptions and clean up resources.
    

1. **ArithmeticError** – Base class for errors in numeric calculations.
2. **AssertionError** – Raised when an `assert` statement fails.
3. **BufferError** – Raised when a buffer-related operation cannot be performed.
4. **EOFError** – Raised when input() hits end-of-file condition.
5. **FloatingPointError** – Raised for floating point calculation errors.
6. **GeneratorExit** – Raised when a generator’s `close()` method is called.
7. **ImportWarning** – Warning for issues related to module imports.
8. **DeprecationWarning** – Warning for deprecated features.
9. **FutureWarning** – Warning for features that will change in the future.
10. **KeyboardInterrupt** – Raised when the user interrupts program execution (Ctrl+C).
11. **LookupError** – Base class for errors raised when a lookup fails (e.g., index/key).
12. **MemoryError** – Raised when an operation runs out of memory.
13. **NotImplementedError** – Raised when an abstract method requires an override.
14. **OSError** – Raised for system-related errors (e.g., file not found).
15. **OverflowError** – Raised when a calculation exceeds the maximum limit for a numeric type.
16. **PendingDeprecationWarning** – Warning for features that will be deprecated in the future.
17. **ProcessLookupError** – Raised when a process cannot be found.
18. **RecursionError** – Raised when the maximum recursion depth is exceeded.
19. **ReferenceError** – Raised when a weak reference is used after the object is deleted.
20. **ResourceWarning** – Warning for resource usage (e.g., unclosed files).
21. **RuntimeError** – Raised for errors that don’t fall into other categories.
22. **RuntimeWarning** – Warning for dubious runtime behavior.
23. **StopAsyncIteration** – Raised to signal the end of an asynchronous iterator.
24. **StopIteration** – Raised to signal the end of an iterator.
25. **SyntaxWarning** – Warning for dubious syntax.
26. **SystemError** – Raised when the interpreter detects an internal error.
27. **SystemExit** – Raised by `sys.exit()` to exit the interpreter.
28. **TabError** – Raised when indentation uses inconsistent tabs and spaces.
29. **TimeoutError** – Raised when a system function times out.
30. **UnicodeDecodeError** – Raised when a Unicode-related error occurs during decoding.
31. **UnicodeEncodeError** – Raised when a Unicode-related error occurs during encoding.
32. **UnicodeError** – Base class for Unicode-related errors.
33. **UnicodeTranslateError** – Raised when a Unicode-related error occurs during translation.
34. **UnboundLocalError** – Raised when a local variable is referenced before assignment.
35. **UserWarning** – Warning for user-generated warnings.

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("You cannot divide by zero!")
```

```result
You cannot divide by zero!
```

```python
try:
    with open('curruptfile.txt') as f:
        if f.name == 'curruptfile.txt':
            raise Exception("Custom error: File is named 'curruptfile.txt'")
except FileNotFoundError as err:
    print(f"FileNotFoundError: {err}")
except Exception as e:
    print(f"An error occurred: {e}") # if file there then it should have printed Custom error: File is named 'curruptfile.txt'
```

```result
FileNotFoundError: [Errno 2] No such file or directory: 'curruptfile.txt'
```

# 8.Multitasking
-  is the ability of an operating system or a program to execute multiple tasks (processes or threads) at the same time. In practice, the CPU switches rapidly between tasks, giving the illusion that they are running simultaneously.

- In process-based multitasking, each task is a separate process. useful for cpu bounded tasks because it will have big things like ipc, pipes, sockets, message queues and one process dont crash other processes and true paralelism across miltiple cpu cores so best for using all cpu cores because worth of execution of large process.
- In thread-based multitasking, multiple threads within a process run concurrently.Useful for i/o operations because it only have shared variables, mutexes, locks and fast and lightweight..one thread can crash entire process if executed in single core or gil there then it is not ture parllelism..so best of i/o not cpu because this requirement itself so small and no need to use ipc and all cores so complex things..noo need for threads

- Preemptive Multi-tasking: OS controls task switching.
- Cooperative Multi-tasking: Tasks control when to switch.Python uses cooperative multitasking through coroutines, generators, and the asyncio library. 

### Multithreading 
- involves dividing a single process into smaller, concurrent threads, while multiprocessing involves running multiple independent processes simultaneously. 

- multihreads are lightweight and i/o based
- multiprocessing are heavy and cpu bounded based
Both can be done in different core or single core of cpu.

- Multithreading: The GIL (Global Interpreter Lock) is present. Only one thread executes Python bytecode at a time, so CPU-bound tasks do not run in true parallel.
- Multiprocessing: Each process has its own Python interpreter and GIL, so processes can run in parallel on multiple CPU cores with differnet gils not a problem.

- More about gil :
    - The GIL in CPython is only concerned with Python code being executed. A thread-safe C extension that uses a lot of CPU might release the GIL as long as it doesn't need to interact with the Python runtime.

    - As soon as the C code needs to 'talk' to Python (read: call back into the Python runtime) then it needs to acquire the GIL again - that is, the GIL is to establish protection/atomic behavior for the "interpreter" (and I use the term loosely) and is not to prevent native/non-Python code from running concurrently.

    - Releasing the GIL around I/O (blocking or not, using CPU or not) is the same thing - until the data is moved into Python there is no reason to acquire the GIL.

    - So all processes in python are starts all threads at single time if it is input based like just sleep , and ends all at once because time is done as output.......but whoever just stays in the cpu keep on executing like any cpu bounded tasks...then another threads won't show as executed until one is done.. i thin corey examples are also not enough to show true multi tasking .

- A race condition only occurs if threads are competing to read/write shared data without proper synchronization.
- https://dev.to/coderatul/race-condition-in-pythons-threading-3o4g
- for clear understanding use article not ai it is not good.

## Multi-Threading

```python
import time 
start = time.perf_counter()

def do_something():
    print("Sleeping for 1 second...")
    time.sleep(1)  # Simulating a time-consuming task
    print("Done sleeping!")

do_something()
do_something() # synchronous execution, each call waits for the previous one to finish. isn't much on cpu usage , but just waiting ....this is much of i/o bound task. like writing to file and reading from a file , network opearations, downloading stuff.
# but above is lie just a illusion of synchronous execution , but here it goes into second of do_something() before it can execute the first one this is called concurrent execution or asynchronous behavior ,# python and c++ are asynchronous by nature, but c is synchronous by nature.
# if cpu bound task we use multiprocessing to run tasks in parallel like data crunching, image processing, etc.

finish = time.perf_counter()
print(f"Finished in {round(finish - start, 2)} second(s)")
```

```result
Sleeping for 1 second...
Done sleeping!
Sleeping for 1 second...
Done sleeping!
Finished in 2.0 second(s)
```

```python
import threading
import time

start = time.perf_counter()

def do_something_threaded():
    print("Thread is sleeping for 1 second...")
    time.sleep(1)  # Simulating a time-consuming task
    print("Thread done sleeping!")

t1 = threading.Thread(target=do_something_threaded)
t2 = threading.Thread(target=do_something_threaded)

t1.start()  # Start the first thread
t2.start()  # Start the second thread

t1.join()  # Wait for the first thread to finish - making code synchronous again
t2.join()  # Wait for the second thread to finish - making code synchronous again

finish = time.perf_counter()
print(f"Threads finished at {round(finish - start, 2)} second(s)") # prints 0.0 without join because of going to next line without any waiting for sleep completion in python, lack of synchronization. # python and c++ are asynchronous by nature, but c is synchronous by nature.
```

```result
Thread is sleeping for 1 second...
Thread is sleeping for 1 second...
Thread done sleeping!
Thread done sleeping!
Threads started at 1.0 second(s)
```

```python
import threading
import time

start = time.perf_counter()

def do_something_threaded(seconds):
    print(f"Thread is sleeping for {seconds} seconds...")
    time.sleep(seconds)  # Simulating a time-consuming task
    print("Thread done sleeping!")
threads = []  # List to hold threads
for _ in range(10):  # Create 10 threads
    t = threading.Thread(target=do_something_threaded,args=[1.5])  # Each thread will sleep for 1 second
    t.start()  # Start the thread
    threads.append(t)  # Add the thread to the list
for t in threads:  # Wait for each thread to finish
    t.join()   # Wait & checking for the thread to finish before checking the time

finish = time.perf_counter()
print(f"Threads finished at {round(finish - start, 2)} second(s)")
```

```result
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread is sleeping for 1.5 seconds...
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Threads started at 1.5 second(s)
```

```python
# Using ThreadPoolExecutor for concurrent execution which is easier to manage than creating threads manually which we have done above.
import concurrent.futures
import time

start = time.perf_counter()

def do_something_threaded(seconds):
    print(f"Thread is sleeping for {seconds} seconds...")
    time.sleep(seconds)  # Simulating a time-consuming task
    return "Thread done sleeping!"

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor: # By default, ThreadPoolExecutor uses min(32, os.cpu_count() + 4) worker threads. If your system has fewer than 10 workers, some tasks will wait for a thread to become available, causing a slight delay.
    results = [executor.submit(do_something_threaded, 1) for _ in range(10)]  # Create 10 threads
    
    for f in concurrent.futures.as_completed(results):
        print(f.result())
    
finish = time.perf_counter()
print(f"Threads finished at {round(finish - start, 2)} second(s)")
# checkout this function min(32, os.cpu_count() + 4).
```

```result
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread is sleeping for 1 seconds...
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Thread done sleeping!
Threads started at 1.01 second(s)
```

```python
# Using ThreadPoolExecutor for concurrent execution which is easier to manage than creating threads manually which we have done above.
import concurrent.futures
import time

start = time.perf_counter()

def do_something_threaded(seconds):
    print(f"Thread is sleeping for {seconds} seconds...")
    time.sleep(seconds)  # Simulating a time-consuming task
    return f"Thread done sleeping!{seconds}"

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    secs=[5,4,3,2,1]
    #results = [executor.submit(do_something_threaded, sec) for sec in secs]  
    results = executor.map(do_something_threaded, secs) 

    # for f in results:
    #     print(f)
    
finish = time.perf_counter()
print(f"Threads finished at {round(finish - start, 2)} second(s)")
```

```result
Thread is sleeping for 5 seconds...
Thread is sleeping for 4 seconds...
Thread is sleeping for 3 seconds...
Thread is sleeping for 2 seconds...
Thread is sleeping for 1 seconds...
Threads started at 5.01 second(s)
```

```python
import requests
import time
import os
import concurrent.futures

img_urls = [
    'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759',
    'https://images.unsplash.com/photo-1532009324734-20a7a5813719',
    'https://images.unsplash.com/photo-1524429656589-6633a470097c',
    'https://images.unsplash.com/photo-1530224264768-7ff8c1789d79',
    'https://images.unsplash.com/photo-1564135624576-c5c88640f235',
    'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6',
    'https://images.unsplash.com/photo-1522364723953-452d3431c267',
    'https://images.unsplash.com/photo-1513938709626-033611b8cc03',
    'https://images.unsplash.com/photo-1507143550189-fed454f93097',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    'https://images.unsplash.com/photo-1504198453319-5ce911bafcde',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
    'https://images.unsplash.com/photo-1516972810927-80185027ca84',
    'https://images.unsplash.com/photo-1550439062-609e1531270e',
    'https://images.unsplash.com/photo-1549692520-acc6669e2f0c'
]

t1 = time.perf_counter()


def download_image(img_url):
    folder = "downloaded_images"
    os.makedirs(folder, exist_ok=True)
    img_bytes = requests.get(img_url).content
    img_name = img_url.split('/')[3]
    img_name = f'{img_name}.jpg'
    img_path = os.path.join(folder, img_name)
    with open(img_path, 'wb') as img_file:
        img_file.write(img_bytes)
        print(f'{img_name} was downloaded to {folder}...')

# for img_url in img_urls:
#     download_image(img_url) #--used 8.8 seconds to download all images sequentially. 
# uisng max_workers it just going to 1.4 sec to 0.9
with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(download_image, img_urls)

t2 = time.perf_counter()

print(f'Finished in {t2-t1} seconds')
```

```result
photo-1516117172878-fd2c41f4a759.jpg was downloaded to downloaded_images...
photo-1532009324734-20a7a5813719.jpg was downloaded to downloaded_images...
photo-1524429656589-6633a470097c.jpg was downloaded to downloaded_images...
photo-1541698444083-023c97d3f4b6.jpg was downloaded to downloaded_images...
photo-1564135624576-c5c88640f235.jpg was downloaded to downloaded_images...
photo-1530224264768-7ff8c1789d79.jpg was downloaded to downloaded_images...
photo-1504198453319-5ce911bafcde.jpg was downloaded to downloaded_images...
photo-1522364723953-452d3431c267.jpg was downloaded to downloaded_images...
photo-1530122037265-a5f1f91d3b99.jpg was downloaded to downloaded_images...
photo-1493976040374-85c8e12f0c0e.jpg was downloaded to downloaded_images...
photo-1513938709626-033611b8cc03.jpg was downloaded to downloaded_images...
photo-1516972810927-80185027ca84.jpg was downloaded to downloaded_images...
photo-1507143550189-fed454f93097.jpg was downloaded to downloaded_images...
photo-1550439062-609e1531270e.jpg was downloaded to downloaded_images...
photo-1549692520-acc6669e2f0c.jpg was downloaded to downloaded_images...
Finished in 1.7272368550002284 seconds
```

```python
# exceptions in threads are not propagated to the main thread, so you need to handle them explicitly if needed. and exceptions are handled only when thread done finishing execution, not while it is running.
# In Python, the Global Interpreter Lock (GIL) allows only one thread to execute Python bytecode at a time, which can limit the performance benefits of threading for CPU-bound tasks.
```

---
## MultiProcessing

```python
import multiprocessing
import time

start = time.perf_counter()

def do_something(seconds):
    print(f"Sleeping for {seconds} second...")
    time.sleep(seconds)  # Simulating a time-consuming task
    print("Done sleeping! ")
process =[]
for _ in range(10):  # Create 10 processes
    p = multiprocessing.Process(target=do_something,args=[1.5])  # Each process will sleep for 1.5 seconds
    p.start()  # Start the process
    process.append(p)  # Add the process to the list
for p in process:  # Wait for each process to finish
    p.join()   # Wait & checking for the process to finish before checking the time

finish = time.perf_counter()
print(f"Finished in {round(finish - start, 2)} second(s)")
```

```result
Sleeping for 1.5 second...Sleeping for 1.5 second...

Sleeping for 1.5 second...Sleeping for 1.5 second...Sleeping for 1.5 second...


Sleeping for 1.5 second...
```

```result
Sleeping for 1.5 second...

Sleeping for 1.5 second...Sleeping for 1.5 second...

Sleeping for 1.5 second...
Done sleeping! 
Done sleeping! 
Done sleeping! 
Done sleeping! Done sleeping! 

Done sleeping! Done sleeping! 

Done sleeping! Done sleeping! Done sleeping! 


Finished in 1.63 second(s)
```

```python
import time

import concurrent.futures


start = time.perf_counter()

def do_something(seconds):
    print(f"Sleeping for {seconds} second...")
    time.sleep(seconds)
    print("Done sleeping!")

with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
    processes = [executor.submit(do_something, 1.5) for _ in range(10)]
    for p in concurrent.futures.as_completed(processes):
        pass  # Results are printed inside do_something

finish = time.perf_counter()
print(f"Finished in {round(finish - start, 2)} second(s)")
```

```result
Sleeping for 1.5 second...Sleeping for 1.5 second...Sleeping for 1.5 second...
Sleeping for 1.5 second...Sleeping for 1.5 second...Sleeping for 1.5 second...Sleeping for 1.5 second...Sleeping for 1.5 second...

Sleeping for 1.5 second...





Sleeping for 1.5 second...
Done sleeping!
Done sleeping!
Done sleeping!Done sleeping!Done sleeping!Done sleeping!
Done sleeping!Done sleeping!Done sleeping!Done sleeping!






Finished in 1.63 second(s)
```

```python
import time
import os

import concurrent.futures
from PIL import Image, ImageFilter

img_names = [
    'photo-1516117172878-fd2c41f4a759.jpg',
    'photo-1532009324734-20a7a5813719.jpg',
    'photo-1524429656589-6633a470097c.jpg',
    'photo-1530224264768-7ff8c1789d79.jpg',
    'photo-1564135624576-c5c88640f235.jpg',
    'photo-1541698444083-023c97d3f4b6.jpg',
    'photo-1522364723953-452d3431c267.jpg',
    'photo-1513938709626-033611b8cc03.jpg',
    'photo-1507143550189-fed454f93097.jpg',
    'photo-1493976040374-85c8e12f0c0e.jpg',
    'photo-1504198453319-5ce911bafcde.jpg',
    'photo-1530122037265-a5f1f91d3b99.jpg',
    'photo-1516972810927-80185027ca84.jpg',
    'photo-1550439062-609e1531270e.jpg',
    'photo-1549692520-acc6669e2f0c.jpg'
]

t1 = time.perf_counter()

size = (1200, 1200)



def process_image(img_name):
    image_folder = "downloaded_images"
    processed_folder = "processed"
    os.makedirs(processed_folder, exist_ok=True)
    img_path = os.path.join(image_folder, img_name)
    img = Image.open(img_path)

    img = img.filter(ImageFilter.GaussianBlur(15))

    img.thumbnail(size)
    save_path = os.path.join(processed_folder, img_name)
    img.save(save_path)
    print(f'{img_name} was processed...')


with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
    executor.map(process_image, img_names)


t2 = time.perf_counter()

print(f'Finished in {t2-t1} seconds')
# still feel like i/o bound because of reading and writing images is more than filtering.
```

```result
photo-1516117172878-fd2c41f4a759.jpg was processed...
photo-1516972810927-80185027ca84.jpg was processed...
photo-1524429656589-6633a470097c.jpg was processed...
photo-1522364723953-452d3431c267.jpg was processed...
photo-1532009324734-20a7a5813719.jpg was processed...
photo-1530122037265-a5f1f91d3b99.jpg was processed...
photo-1530224264768-7ff8c1789d79.jpg was processed...
photo-1541698444083-023c97d3f4b6.jpg was processed...
photo-1564135624576-c5c88640f235.jpg was processed...
photo-1550439062-609e1531270e.jpg was processed...
photo-1493976040374-85c8e12f0c0e.jpg was processed...
photo-1549692520-acc6669e2f0c.jpg was processed...
Finished in 14.548195418999967 seconds
```

---
---

# Advance Concepts:

# when .pyc files created : 

- python executes like compiling into bytecode then interpretated ...the .pyc files are created if you say explicitly to saved bytecode into .pyc like caching if not it does bytecode everytime or if you import library in python script it automatically creates the .pyc file by default..
- .pyc can be created in you own folder if specified if not in host env folders or separtely created env folders

### Understanding High-Level Languages

- High-level languages abstract machine code through scripting process where executed by interpreter.


### 🧾 **Scripting vs Non-Scripting Languages**

#### 📜 **Scripting Languages**

- * **Scripting** refers to languages that are executed by some other code line by line (interpreter), but not by direct machine.    
- interpreter(a program that reads and executes the code line by line) 
- The Python interpreter (CPython) is a big C program.

- Types of scripting languages:
    * They're either **scripting languages** that are interpretated directly (like Bash), or compiled to intermediate code (like Python/Java bytecode) for a virtual machine where interpretation happens (also called as scripting language only), boosting portability.

- example python :

    1. You write example.py (your source code).

    2. CPython compiles it into bytecode → stored as example.pyc.

    3. Then the CPython interpreter (written in C) reads that .pyc bytecode like a string or numbers inputs into c functions by taking each line and executes it line by line.


#### ⚙️ **Non-Scripting Languages**

* **Non-scripting languages**, like low-level ones (C/C++), compile straight to machine code for top performance and hardware control, but are less portable.



**Dynamic typing** (Python) checks variable types at runtime, offering flexibility but delaying error detection. **Static typing** (Java) checks types during compilation for early error catching and better optimization. Python compiles to bytecode for speed while keeping dynamic typing. Java, also using bytecode, employs powerful **JIT compilation** for near native-code speeds, a key performance difference.

---

# Premitive and Non-Premitive:
- Yes, Python does not have primitive or non-primitive types internally —
- 👉 Everything in Python is an object, whether it's an int, list, str, or even None.

- There’s no low-level "primitive type" distinction like in C++ or Java (where primitives have optimized memory and execution).

https://www.reddit.com/r/learnprogramming/comments/ui1e44/why_do_data_types_like_char_int_or_long_are/

if asked about premitive and non premitive variables ?

### Namespace Lifetime

- **Built-in Namespace**: Exists for the entire runtime of the Python interpreter.
- **Global Namespace**: Exists for the duration of the module or script.
- **Local Namespace**: Exists only for the duration of the function or method call.
- **Enclosing Namespace**: Exists as long as the enclosing function is alive.

### Summary

- **Namespace**: A container that maps names to objects.
- **Types**: Built-in, global, local, and enclosing.
- **Hierarchy**: Built-in > Global > Enclosing > Local.
- **Access**: Namespaces control variable visibility and scope.



### Accessing Namespaces

- **Global Scope**:
  ```python
  x = 10  # 'x' is in the global namespace

  def func():
      print(x)  # Accesses 'x' from the global namespace

  func()
  ```

- **Local Scope**:
  ```python
  def func():
      y = 5  # 'y' is in the local namespace of func
      print(y)

  func()
  ```

- **Enclosing Scope**:
  ```python
  def outer_func():
      z = 20  # 'z' is in the enclosing namespace

      def inner_func():
          print(z)  # Accesses 'z' from the enclosing namespace

      inner_func()

  outer_func()
  ```

- **Built-in Namespace**:
  ```python
  print(len([1, 2, 3]))  # 'len' is in the built-in namespace
  ```

# Shallow copy:
- just make pointer to points same memory __ no new memory is created
- a. List[:]=list1
- b. List=list1
- in **Pandas**: df.copy(deep=False) or simply df.copy(). (Note: For df.copy(), deep=True is the default, so df.copy(deep=False) is explicit for shallow).
- in **pyspark**:
      PySpark DataFrames are fundamentally immutable. This is a core design principle in distributed computing frameworks.
      Immutability: When you perform any transformation (like select, filter, withColumn, join), PySpark always returns a new DataFrame object. The original DataFrame remains unchanged.
      No Direct "Shallow" or "Deep" Copy Methods in the Python Sense: Because of immutability, the concepts of copy.copy() or copy.deepcopy() (which imply modifying an existing object or creating a copy that shares mutable internal state) don't apply directly.
# Deep copy:    
- deep_copied_list = copy.deepcopy(original_list) --creates new memory and points to it....quite opp right

| Feature               | Iterator                                   | Generator                               |
|-----------------------|--------------------------------------------|-----------------------------------------|
| **Definition**        | An object implementing `__iter__()` and `__next__()` methods | A special type of iterator created with a function containing `yield` statements |
| **Creation**          | Requires defining a class with `__iter__()` and `__next__()` | Created using a function with `yield` expressions |
| **Memory Usage**      | Efficient; typically knows all elements at once or maintains state | Efficient; produces one element at a time, does not require all elements to be known at once |
| **Knowledge of Elements** | Can have access to all elements at once or in chunks | Knows only the next element to produce |

import sys
def create_all_numbers(limit): # for loop in itself uses iter and next keyword.
    nums = []
    for i in range(1, limit + 1):
        nums.append(i)
    return nums

def generate_numbers(limit):
    for i in range(1, limit + 1):
        yield i

# Execution:
my_list = create_all_numbers(5)  # Memory of my_list: All 5 numbers are immediately stored in RAM as a complete list.
my_gen = generate_numbers(5)     # Memory of my_gen variable: Only a small generator object is created; numbers are not yet in RAM.

print(my_list,my_gen)

for num in my_gen:               # Memory: Each 'num' is computed and held in RAM one at a time, then released.
    print(num)
print(sys.getsizeof(my_list),sys.getsizeof(my_gen))
print("Generators are generally more memory efficient than class-based iterators when dealing with large sequences, not less.Just imagine a big file holding in array and in generator you can find diff")

---
---

### memory management


| Aspect                 | Description                                               |
|------------------------|-----------------------------------------------------------|
| **Garbage Collection** | Uses reference counting and cyclic garbage collection to manage memory automatically. |
| **Memory Allocation**  | Manages memory using pools and object-specific allocators to reduce fragmentation. |
| **Dynamic Typing**     | Allows flexible memory usage for variables with changing types. |
| **Memory Fragmentation** | Mitigated by using memory pools and block management. |
| **Memory Leaks**       | Can occur if references are unintentionally held; managed by tools and garbage collection. |
| **Tools**              | `gc` module for garbage collection, `memory_profiler`, and `tracemalloc` for profiling. |
