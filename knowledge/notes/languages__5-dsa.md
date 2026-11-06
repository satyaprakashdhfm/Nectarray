IN PYTHON WE SHOULD NEVER ASK SOMEONE TO WRITE CODE WITHOUT FUNCTIONS...WE INSTEAD HOW MANY FUNCTIONS HE KNOW AND VERY IMP HOW WELL HE KNOWS ONE FUNCTION WITH PARAMETERS IN IT(it can be understood by inbuilt code logic only but still)....BECAUSE END OF DAY HE HANDLES LOTS OF FUNCTION IN NUMPY AND PYTROCH..BETTER TO KNOW HOW WELL HE UNDERSTAND FUNCTION AND PARAMETERS REQUIRED. 


### index :

- simple logic
- time complexity
- Every small problems:
    1. reverse_digit
    2. palindrome
    3. reverse_string
    4. sqrt_function
    5. isprime , first n or nth prime ,primes below n
    6. factors , prime factors
    7. strong , perfect numbers
    8. factorial , fibonacii
    9. lcm , gcd
- sorting
- searching
- linked list
......

# Optimization Mapping (quick)

-  substring problems → sliding window
- repeated counting → hashmap
- range sum → prefix sum
Complexity Patterns

O(n)

-  sliding window
-  hashmap / set
-  prefix sum
-  single pass

------------------------------------arrays----------------------------

core subarray patterns (very short + usable) 


2. sliding window (two pointers)

* use when: positive numbers / fixed condition
* idea: expand right, shrink left

```python
l = 0
sum = 0
for r in range(n):
    sum += arr[r]
    while sum > k:
        sum -= arr[l]
        l += 1
```

1. prefix sum + hashmap (most important)

* use when: sum = k, sum = 0, longest subarray
* idea: same prefix sum repeats → middle = 0
* template:

```python
sum = 0
seen = {0:-1}
for i in range(n):
    sum += arr[i]
    if (sum-k) in seen:  # for sum=k
        # found subarray
    if sum not in seen:
        seen[sum] = i
```

# prefix sum to kill o(n**2) complexity
5. count subarrays with sum = k

* slight change of hashmap

```python
count = 0
sum = 0
seen = {0:1}
for x in arr:
    sum += x
    count += seen.get(sum-k,0)
    seen[sum] = seen.get(sum,0) + 1
```

6. longest subarray with sum = 0

```python
sum = 0
seen = {0:-1}
ans = 0
for i,x in enumerate(arr):
    sum += x
    if sum in seen:
        ans = max(ans, i-seen[sum])
    else:
        seen[sum] = i
```

3. kadane’s algorithm

* use when: max subarray sum

```python
max_sum = cur = arr[0]
for i in range(1,n):
    cur = max(arr[i], cur+arr[i])
    max_sum = max(max_sum, cur)
```

![image.png](kb-media:e92831212d820368e38e.png)

![image.png](kb-media:1eea24627bf5a1248537.png)

# ✅ SIMPLE LOGICS with Leetcode - *The Path to Enlightenment*

---

## **String Operations**

* Convert to string: `a = str(a)`
* Add character to string: `new_string += char` or `''.join(char for char in original_string)`
* Check if character is alphabet: `char.isalpha()`, `char.isalnum()`
* Check palindrome: `s == s[::-1]`
* Remove last character: `s = s[:-1]`
* Remove spaces: `s.replace(" ", "")`, `"".join(s.split())`
* Reverse string: `"".join(reversed(s))`
* Regex patterns: `re.findall()` (for email, date, phone numbers)
* Substring slicing: `s[-1:]`, `s[-1::-1]`
* Max digit in number string: `max(map(int, str(num)))`
* Alphabet index: `ord(char) - ord('A') + 1`
* **Excel column to number**:

  ```python
  result = 0
  for s in columnTitle:
      result = result * 26 + (ord(s) - ord('A') + 1)
  return result
  ```
* Binary string to number: `int(b, 2)`
* Number to binary string: `bin(num)`
* Count 1s in binary (Hamming weight):

  ```python
  res = 0
  while n:
      res += n & 1
      n >>= 1
  return res
  ```

---

## **List and Array Operations**

* Ranges: `range(0, 20, num)`, `range(20, -1, -num)`
* Check 3 consecutive odds: `for i in range(n - 2): nums[i:i+3]`
* Remove element: `remove()`, `pop()`, `del`
* Modify list in-place: `nums[:] = set(nums)`
* Unique nested lists: `list(set(tuple(x) for x in nested_list))`
* Multiply list: `nums *= 2`
* Second last element: `arr[-2]`
* Index + values: `enumerate`, `zip`, `zip_longest`
* Slice from negative: `nums[-8:]`
* Join elements: `'-'.join(...)`
* Count with Counter: `Counter(my_list)`
* Sort dict by key/value: `sorted(dic.items(), key=lambda x: ...)`
* Rotate matrix (clockwise 90°): `mat = [list(x) for x in zip(*mat[::-1])]`
* Reshape matrix (NumPy): `np.reshape(mat, (r, c))`
* Accumulate/reduce: `itertools.accumulate()`, `functools.reduce()`

---

## **Dictionary Operations**

* Count elements: `Counter()`
* Word count: `Counter(s.split())`
* Max value: `max(dic, key=dic.get)`
* First key: `list(my_dict.keys())[0]`
* Init and increment: `dic[key] = dic.get(key, 0) + 1`
* Sort by key/value: `sorted(dic.items(), key=lambda x: ...)`

---

## **Mathematical Operations**

* Leap year:

  ```python
  (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
  ```
* Division types:

  * Floor: `a // b`
  * True: `a / b`
* Quotient & remainder: `divmod(a, b)`
* Round: `round(x, n)`
* Ceiling/Floor: `math.ceil(x)`, `math.floor(x)`
* Square root: `int(math.sqrt(x))`
* Infinity: `float('inf')`, `-float('inf')`, `sys.maxsize`

---

## **Input/Output Patterns**

* **Matrix input**:

  ```python
  matrix = [list(map(int, input().split())) for _ in range(rows)]
  ```
* **Multi-line input**:

  ```python
  data = [list(map(int, input().split())) for _ in range(n)]
  ```
* Remove whitespace: `strip()`
* Custom split: `text.split('###')`, then filter empty
* **Unknown input count**:

  ```python
  while True:
      try:
          num = int(input())
          numbers.append(num)
      except EOFError:
          break
  ```
* **Mixed types**:

  ```python
  parts = input().split()
  a, b, c = parts[0], int(parts[1]), float(parts[2])
  ```
* **Comma-separated**:

  ```python
  l = list(map(int, input().split(',')))
  ```
* **Single-line space-separated**:

  ```python
  l = list(map(int, input().split()))
  ```

---

## **Control Flow & Iteration**

* One vs rest: single loop
* All pairwise comparisons: nested loops
* Parenthesis matching:

  ```python
  stack and c == valid_pairs[stack[-1]]
  ```

---

## **Copying and Memory**

* Shallow copy: `copy.copy()` (shared inner objects)
* Deep copy: `copy.deepcopy()` (everything new)
* Assignment: `a = b` (same reference)

---

## **Functional Programming**

* `map(lambda x: ...)`
* `filter(lambda x: ...)`
* List comprehension: `[x for x in list if condition]`

---

## **Miscellaneous**

* Use of `.count()` in lists
* In-place slice reverse: `s[i:i+k] = reversed(s[i:i+k])`
* `list.reverse()` vs `reversed()`
* Be careful with `list.pop(i)` inside loops
* Meeting scheduler: focus on input structure

#  Time Complexities Acceptable :

Certainly! Here's a short and concise explanation of time complexity:

### Time Complexity (Short Version)

1. **Definition**: Time complexity measures how the running time of an algorithm grows with the size of the input, denoted as $n$.

2. **Big O Notation**: 
   - Written as $O(f(n))$, it describes the upper limit of an algorithm's run time.
   - Common complexities: 
     - $O(1)$: Constant time 
     - $O(n)$: Linear time 
     - $O(\log n)$: Logarithmic time 

3. **Combining Complexities**:
   - When you have multiple parts, add their complexities, but focus on the dominant term.
   - Example: $O(\log n) + O(n) = O(n)$ because $O(n)$ grows faster than $O(\log n)$ for large $n$.

4. **Conclusion**: Time complexity helps assess the efficiency of algorithms, allowing comparisons based on how they scale with larger inputs.

If you have any specific questions or need further details, just let me know!



In competitive programming, solutions with acceptable time complexity generally depend on the constraints provided in the problem. For a problem like finding the number of ways to climb a staircase with 234 steps, here are the complexities that are usually acceptable:
1. **O(n) Time Complexity**:
    - **Dynamic Programming Approach**: This approach is usually acceptable and efficient for large values of $n$. For example, in the staircase problem, using dynamic programming or a sliding window technique to calculate the number of ways to climb the stairs is efficient.
    - **Iterative Approach with Constant Space**: Using a sliding window approach to keep track of only the last two computed values is also efficient and acceptable.
    
    ```python
    def climbStairs(n):
        if n == 0 or n == 1:
            return 1
        
        prev2, prev1 = 1, 1
        
        for i in range(2, n + 1):
            current = prev1 + prev2
            prev2 = prev1
            prev1 = current
        
        return prev1

    # Number of steps
    n = 234
    print(climbStairs(n))
    ```

2. **O(log n) Time Complexity**:
    - **Matrix Exponentiation**: For problems related to Fibonacci numbers, matrix exponentiation can be used to achieve O(log n) time complexity, which is even faster than O(n). This is acceptable but more complex to implement.
    
    ```python
    def matrix_mult(A, B):
        return [
            [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
        ]

    def matrix_pow(mat, exp):
        result = [[1, 0], [0, 1]]
        base = mat

        while exp > 0:
            if exp % 2 == 1:
                result = matrix_mult(result, base)
            base = matrix_mult(base, base)
            exp //= 2
        
        return result

    def climbStairs(n):
        if n == 0 or n == 1:
            return 1
        
        transformation_matrix = [[1, 1], [1, 0]]
        result_matrix = matrix_pow(transformation_matrix, n - 1)
        
        return result_matrix[0][0] + result_matrix[0][1]

    # Number of steps
    n = 234
    print(climbStairs(n))
    ```
Unacceptable Time Complexities

1. **O(2^n) Time Complexity**:
    - **Exponential Recursion**: This approach is generally not acceptable for large values of $n$ in competitive programming due to its inefficiency. It quickly becomes infeasible as $n$ increases beyond small values (e.g., $n > 30$).

    ```python
    def climbStairs(n):
        if n == 0 or n == 1:
            return 1
        return climbStairs(n-1) + climbStairs(n-2)

    # Number of steps
    n = 234
    print(climbStairs(n))  # This will take an impractically long time to compute
    ```

**Conclusion** :
For the staircase problem with 234 steps, using either the iterative approach with O(n) time complexity or the matrix exponentiation approach with O(log n) time complexity is acceptable and efficient for competitive programming. The exponential time complexity approach (O(2^n)) is not suitable for large inputs and should be avoided.



---

```python
name="John Doe"
age = 30
height = 1.75  # in meters
score = 85.5
grade = 'B'
item = "Apple"
price = 0.99  # in dollars
quantity = 5
i = 1

# printing:
print(f"{name} scored {score} and received a grade of {grade}") 
print(f"Name: {name}, Age: {age}, Height: {height:.2f} meters")
print(f"{item}: ${price:.2f}")  # 2 decimal places
print(f"{item}: ${price:.3f}")  # 3 decimal places
print(f"{i}. {item:<10} x {quantity}")
print('name is {} age is {}'.format(name,age))
```
```output
John Doe scored 85.5 and received a grade of B
Name: John Doe, Age: 30, Height: 1.75 meters
Apple: $0.99
Apple: $0.990
1. Apple      x 5
name is John Doe age is 30
```

Comparison
    
    \r (Carriage Return)

Moves the cursor to the start of the current line.
Does not move to the next line.
Useful for overwriting text on the same line.

    \n (Newline)

Moves the cursor to the beginning of the next line.
Creates a line break.
Standard for separating lines in text files and outputs.

end="": Prevents the print() function from adding a newline after the output, keeping the cursor on the same line.

```python
for i in range(5):
    for j in range(i+1):
        print("*" , end="")
    print("\r")
```
```output
*
**
***
****
*****
```

```python
for i in range(5):
    for j in range(i,5): #(5,i,-1)
        print("s" , end="")
    print("\r")
```
```output
sssss
ssss
sss
ss
s
```

```python
for i in range(5):
    for j in range(i,5):
        print(end=" ")
    for k in range(i+1):
        print("*",end="") # print(end="*")
    print("\r")
```

```python
for i in range(5):
    for j in range(i):
        print(end=" ")
    for u in range(i,5):
        print(end="*")
    print()
```
```output
*****
 ****
  ***
   **
    *
```

```python
n=5
for i in range(n):
    # Print leading spaces
    for j in range(n - i -1):
        print(" ", end="")
    # Print asterisks
    for j in range(2 * i + 1):
        print("*", end="")
    print()
```
```output
    *
   ***
  *****
 *******
*********
```

```python
n=5
for i in range(n-2,-1,-1):
    for j in range(n-i-1):
        print(end=" ")
    for k in range(2*i+1):
        print(end="*")
    print()
```
```output
 *******
  *****
   ***
    *
```

```python
n = 5  # This is the number of lines for the top half of the diamond.

# Top half of the diamond
for i in range(n):
    # Print leading spaces
    for j in range(n - i - 1):
        print(end=" ")
    # Print asterisks
    for j in range(2 * i + 1):
        print(end="*")
    print()

# Bottom half of the diamond
for i in range(n - 2, -1, -1):
    # Print leading spaces
    for j in range(n - i - 1):
        print(end=" ")
    # Print asterisks
    for j in range(2 * i + 1):
        print(end="*")
    print()
```
```output
    *
   ***
  *****
 *******
*********
 *******
  *****
   ***
    *
```

```python
txt = "This will insert one \\ (backslash)."
print(txt) 

txt = 'It\'s alright.'
print(txt) 

txt = "Hello\tWorld!" # \t indication
print(txt) 

#A backslash followed by an 'x' and a hex number represents a hex value:
txt = "\x48\x65\x6c\x6c\x6f"
print(txt) 

#A backslash followed by three integers will result in a octal value:
txt = "\110\145\154\154\157"
print(txt)
```
```output
This will insert one \ (backslash).
It's alright.
Hello	World!
Hello
Hello
```

# Every small problmes

```python
def reverse_number(num):
    reversed_num = 0
    while num > 0:
        digit = num % 10
        reversed_num = reversed_num * 10 + digit
        num //= 10
    return reversed_num

original_num = 1234
result = reverse_number(original_num)
print(result)
```
```output
4321
```

```python
def is_palindrome(s):        # time:O(n) space:O(1)
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
def is_palindrome_slicing(arr): # time:O(n) space:O(n)
    if arr==arr[::-1]:
        return True
    else:
        return False
```

```python
# Method 1: Using a Loop
def reverse_string_loop(s):
    """
    Reverses the string using a loop.
    Time Complexity: O(n^2) - Each iteration involves concatenating the character to the front of the string.
    Space Complexity: O(n) - Creates a new string that grows with the size of the input.
    """
    reversed_str = ""
    for char in s:
        reversed_str = char + reversed_str
    return reversed_str

# Method 2: Using join and reversed
def reverse_string_join(s):
    """
    Reverses the string using join and reversed.
    Time Complexity: O(n) - Creates a reversed iterator and joins the characters in one pass.
    Space Complexity: O(n) - Creates a new string for the reversed result.
    """
    return "".join(reversed(s))

# Example usage
print(reverse_string_loop("hello"))  # Output: "olleh"
print(reverse_string_join("hello"))  # Output: "olleh"
```
```output
olleh
olleh
```

```python
def factorial(num):
    result = 1
    for i in range(2, num + 1):
        result *= i
    return result

def is_strong_number(n):
    # Convert number to string to iterate over each digit
    digits = str(n)
    sum_of_factorials = 0
    
    for digit in digits:
        sum_of_factorials += factorial(int(digit))
    
    # A number is strong if the sum of the factorials of its digits equals the number
    return sum_of_factorials == n

print(is_strong_number(145))  # Output: True (145 is a strong number: 1! + 4! + 5! = 145)
```
```output
True
True
```

```python
def is_perfect_number(n):
    # Time complexity: O(n), Space complexity: O(1)
    if n <= 1:
        return False

    sum_of_divisors = 1  # Start with 1, since 1 is always a divisor of n

    # Check for divisors up to n/2
    for i in range(2, n // 2 + 1):
        if n % i == 0:
            sum_of_divisors += i

    return sum_of_divisors == n

# Example usage
print(is_perfect_number(6))   # Output: True
print(is_perfect_number(28))  # Output: True
print(is_perfect_number(12))  # Output: False
```
```output
True
True
False
```

```python
print(5 // 2)    # Output: 2  (2.5 rounds down to 2)
print(-5 // 2)   # Output: -3 (-2.5 rounds down to -3)
print(10 // 3)   # Output: 3  (3.33... rounds down to 3)
print(-10 // 3)  # Output: -4 (-3.33... rounds down to -4)
```
```output
2
-3
3
-4
```

```python
153//10
```
```output
15
```

```python
153%10
```
```output
3
```

```python
def fac(n):
    if n==0:
        return 1
    else:
        return n*fac(n-1)
    
def factorial(n):
    result = 1
    for i in range(2, n+1):
        result *= i
    return result
```

```python
def fiba(n):
    if n<=1:
        return n
    else:
        return(fiba(n-1)+fiba(n-2))

def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    a, b = 0, 1
    fib_sequence = [a, b]
    
    for _ in range(2, n):
        a, b = b, a + b
        fib_sequence.append(b)
    
    return fib_sequence

print(fibonacci(10))  # Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]


def fibonacci_nth(n):
    if n < 0:
        return "Invalid input. Please enter a non-negative integer."
    elif n == 0:
        return 0
    elif n == 1:
        return 1
    
    a, b = 0, 1
    for _ in range(2, n):
        a, b = b, a + b
    
    return b
print(fibonacci_nth(10))
```
```output
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
34
```

```python
# i am fan of euclid's algorithm for GCD and LCM
def gcd_iterative(a, b):
    while b:
        a, b = b, a % b
    return a
# lcm(a,b)*gcd(a,b)=a*b
def lcm_using_gcd(a, b):
    return abs(a * b) // gcd_iterative(a, b)

# Example usage
a, b = 12, 15
print(f"GCD (iterative) of {a} and {b} is {gcd_iterative(a, b)}")
print(f"LCM (using GCD) of {a} and {b} is {lcm_using_gcd(a, b)}")
```
```output
GCD (iterative) of 12 and 15 is 3
LCM (using GCD) of 12 and 15 is 60
```

```python
def dectobi(n):
    if n==0:
        return 0
    else:
        return n%2 + 10*dectobi(int(n/2))
```

```python
#factors printing
# Method 1: Print all factors of a number
def print_all_factors(n):
    print(f"All factors of {n} are:")
    for i in range(1, n + 1):
        if n % i == 0:
            print(i)
# Method 2: Optimized way to print factors
def print_factors_optimized(n):
    print(f"Optimized factors of {n} are:")
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            print(i)
            if i != n // i:
                print(n // i)

# Example usage
print_all_factors(36)
print_factors_optimized(45)
```
```output
All factors of 36 are:
1
2
3
4
6
9
12
18
36
… (4 more lines)
15
5
9
```

```python
# 1. Prime Basics
# ----------------
# - 1 is NOT a prime number.
# - All primes except 2 are odd, but not all odd numbers are prime.
# - Composite numbers must have at least one factor <= sqrt(n)



# ----------------
# 3. Prime Factorization
# ----------------

def prime_factors(n):
    factors = []
    while n % 2 == 0:
        factors.append(2)
        n //= 2

    factor = 3
    while factor * factor <= n:
        if n % factor == 0:
            factors.append(factor)
            n //= factor
        else:
            factor += 2

    if n > 2:
        factors.append(n)
    return factors

# Example usage
print(f"Prime factors of 69 are: {prime_factors(69)}")


# ----------------
# 5. Prime Check Function
# ----------------

def is_prime(num):
    if num < 2:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

def print_primes_below(limit):
    print(f"Prime numbers below {limit}:")
    for i in range(limit):
        if is_prime(i):
            print(i, end=' ')
    print()

print_primes_below(30)


def find_nth_prime(N):
    primes = []
    num = 2
    while len(primes) < N:
        if is_prime(num):
            primes.append(num)
        num += 1
    return primes

n = 6
nth_prime_list = find_nth_prime(n)
print(f"First {n} primes: {nth_prime_list}")
print(f"{n}th prime is: {nth_prime_list[-1]}")
```
```output
Prime factors of 69 are: [3, 23]
Prime numbers below 30:
2 3 5 7 11 13 17 19 23 29 
First 6 primes: [2, 3, 5, 7, 11, 13]
6th prime is: 13
```

# sorting
Inbuilt Python uses timsort technique:
Performance:

- Worst-case time complexity: O(n log n)
- Average-case time complexity: O(n log n)
- Best-case time complexity: O(n) (when the input is already sorted)
- Space complexity: O(n)

![image.png](kb-media:26aac44758cc1aacd8e4.png)

# Python's built-in sorted() function and the list.sort() method both utilize a hybrid sorting algorithm called Timsort.

![image.png](kb-media:05042d996ef063a35f47.png)

```python
import math

def bubbleSort(customList): # if n=8
    for i in range(len(customList)-1): # for i in range(7) # 0 to 6
        for j in range(len(customList)-i-1):# for j in range(7-i-1) # 0 to 6-i
            if customList[j] > customList[j+1]: # ascending order
                customList[j], customList[j+1] = customList[j+1], customList[j]
                # for each loop it keeps largest element in the end of list and then last before and then last before that and so on.
    return customList


def merge(arr, left, mid, right):
    left_half = arr[left:mid+1]
    right_half = arr[mid+1:right+1]
    i, j, k = 0, 0, left

    while i < len(left_half) and j < len(right_half):
        if left_half[i] <= right_half[j]:
            arr[k] = left_half[i]
            i += 1
        else:
            arr[k] = right_half[j]
            j += 1
        k += 1
    while i < len(left_half): #You’ve already compared and merged elements from both sides until one side is completely used up.
        arr[k] = left_half[i] # only one of these two while  loops only will execute depending on array length.
        i += 1     # If there are remaining elements in left_half
        k += 1
    while j < len(right_half):
        arr[k] = right_half[j]
        j += 1
        k += 1
def merge_sort(arr, left, right):
    if left < right:
        mid = (left + right) // 2
        merge_sort(arr, left, mid)
        merge_sort(arr, mid + 1, right)          
        merge(arr, left, mid, right)
    return arr

arr=[1,8,2,7,3,9,6,4,5]
print(merge_sort(arr,0,len(arr)-1))


def selectionSort(customList):
    for i in range(len(customList)):
        min_index = i
        for j in range(i+1, len(customList)):
            if customList[min_index] > customList[j]:
                min_index = j
        customList[i], customList[min_index] = customList[min_index], customList[i]
    print(customList)


def insertionSort(customList):
    for i in range(1, len(customList)):
        key = customList[i]
        j = i-1
        while j>=0 and key < customList[j]:
            customList[j+1] = customList[j]
            j -= 1
        customList[j+1] = key
    return customList


def bucketSort(customList):
    numberofBuckets = round(math.sqrt(len(customList)))
    maxValue = max(customList)
    arr = []

    for i in range(numberofBuckets):
        arr.append([])
    for j in customList:
        index_b = math.ceil(j*numberofBuckets/maxValue)
        arr[index_b-1].append(j)
    
    for i in range(numberofBuckets):
        arr[i] = insertionSort(arr[i])
    
    k = 0
    for i in range(numberofBuckets):
        for j in range(len(arr[i])):
            customList[k] = arr[i][j]
            k += 1
    return customList


def partition(customList, low, high):
    i = low - 1
    pivot = customList[high]
    for j in range(low,high):
        if customList[j] <= pivot:
            i += 1
            customList[i], customList[j] = customList[j], customList[i]
    customList[i+1], customList[high] = customList[high], customList[i+1]
    return (i+1)
def quickSort(customList, low, high):
    if low < high:
        # Partition the list and get the pivot index
        pi = partition(customList, low, high)
        
        # Recursively sort the sub-lists
        quickSort(customList, low, pi - 1)
        quickSort(customList, pi + 1, high)
        
        
def heapify(customList, n, i):
    smallest = i
    l = 2*i + 1
    r = 2*i + 2
    if l < n and customList[l] < customList[smallest]:
        smallest = l
    
    if r < n and customList[r] < customList[smallest]:
        smallest = r
    
    if smallest != i:
        customList[i], customList[smallest] = customList[smallest], customList[i]
        heapify(customList, n, smallest)
def heapSort(customList):
    n = len(customList)
    for i in range(int(n/2)-1, -1, -1):
        heapify(customList, n, i)
    
    for i in range(n-1,0,-1):
        customList[i], customList[0] = customList[0], customList[i]
        heapify(customList, i, 0)
    # customList.reverse()



cList = [2,1,7,6,5,3,4,9,8]
heapSort(cList)
print(cList)
# Example usage:
cList = [2, 1, 7, 6, 5, 3, 4, 9, 8]
quickSort(cList, 0, len(cList) - 1)
print(cList)
```
```output
[9, 8, 7, 6, 5, 4, 3, 2, 1]
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

# searching algo
 
When searching for a target in an unsorted array, the most straightforward method is **linear search**, as no sorting has been applied to the array.

**Sorting + Binary Search**:
  - **Sorting Time Complexity**: $O(n \log n)$--we can use merge sort
  - **Binary Search Time Complexity**: $O(\log n)$
  - **Combined Time Complexity**: $O(n \log n)$
    - First, you would sort the array (which takes $O(n \log n)$) and then apply binary search to find the target (which takes $O(\log n)$).

```python
# ----------------
# 4. Avoid Integer Overflow
# ----------------
# Why: In large values, `m = (l + r) // 2` may overflow.
# Better: Use `m = l + (r - l) // 2`

# Example to show the difference:
l = 2_000_000_000
r = 2_147_483_640
safe_m = l + ((r - l) // 2)
print(f"Safe mid value: {safe_m}")

# ----------------
def binarySearch(a, target):
    a.sort()  # Binary search needs sorted list
    n = len(a)
    l, r = 0, n - 1
    while l <= r:
        mid = (l + r) // 2
        if a[mid] == target:
            print(f'found {target} at index {mid}')
            break
        elif target > a[mid]:
            l = mid + 1
        else:
            r = mid - 1
    else:
        print('not found')
custArray = [1, 3, 5, 6, 7, 8, 9]
print(binarySearch(custArray, 6))


def binary_search_first_occurrence(arr, target):
    left = 0
    right = len(arr) - 1
    result = -1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid  # Potential first occurrence
            right = mid - 1  # Continue searching in the left half
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result

# Example usage:
sorted_array = [1, 3, 5, 6, 6, 6, 7, 8, 9]
target = 6

result = binary_search_first_occurrence(sorted_array, target)
if result != -1:
    print(f"First occurrence of {target} is at index {result}")
else:
    print(f"Element {target} is not present in the array")
```
```output
Safe mid value: 2073741820
found 6 at index 3
None
First occurrence of 6 is at index 3
```

```python
# must logics to known
#two sum:
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        dic={}
        for i,n in enumerate(nums):
            rem=target-n
            if rem in dic:
                return [i,dic[rem]]
            dic[n]=i

# three sum:
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()  # Sort the array
        t = []  # To store the result
        n = len(nums)
        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:  # Skip duplicate elements
                continue
            l, r = i + 1, n - 1
            while l < r:
                total = nums[i] + nums[l] + nums[r]
                if total == 0:
                    t.append([nums[i], nums[l], nums[r]])
                    # Skip duplicates
                    while l < r and nums[l] == nums[l + 1]:
                        l += 1
                    while l < r and nums[r] == nums[r - 1]:
                        r -= 1
                    l += 1
                    r -= 1
                elif total > 0:
                    r -= 1
                else:
                    l += 1
        return t
```

# linked list

```python
# Node class
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Linked List class
class LinkedList:
    def __init__(self):
        self.head = None

    # 1. Add node at the end
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    # 2. Add node at the beginning
    def prepend(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    # 3. Insert after a node
    def insert_after(self, prev_data, data):
        current = self.head
        while current and current.data != prev_data:
            current = current.next
        if not current:
            print(f"{prev_data} not found")
            return
        new_node = Node(data)
        new_node.next = current.next
        current.next = new_node

    # 4. Delete a node by value
    def delete(self, data):
        current = self.head
        if not current:
            return

        if current.data == data:
            self.head = current.next
            return

        prev = None
        while current and current.data != data:
            prev = current
            current = current.next

        if not current:
            print(f"{data} not found")
            return

        prev.next = current.next

    # 5. Search a value
    def search(self, data):
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False

    # 6. Print the list
    def print_list(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

    # 7. Count nodes
    def length(self):
        count = 0
        current = self.head
        while current:
            count += 1
            current = current.next
        return count
    # Insert at a specific position (0-based)
    def insert_at_position(self, position, data):
        new_node = Node(data)

        # Insert at head
        if position == 0:
            new_node.next = self.head
            self.head = new_node
            return

        current = self.head
        count = 0

        # Traverse to the node just before desired position
        while current and count < position - 1:
            current = current.next
            count += 1

        if not current:
            print("Position out of range")
            return

        new_node.next = current.next
        current.next = new_node
Ll = LinkedList()
Ll.append(10)
Ll.append(20)
Ll.prepend(5)
Ll.insert_after(10, 15)
Ll.print_list()  # 5 -> 10 -> 15 -> 20 -> None

print("Search 15:", Ll.search(15))  # True
Ll.delete(10)
Ll.print_list()  # 5 -> 15 -> 20 -> None

print("Length:", Ll.length())  # 3

Ll.append(1)
Ll.append(2)
Ll.append(4)
Ll.insert_at_position(2, 3)  # Insert 3 at index 2
Ll.print_list()  # Output: 1 -> 2 -> 3 -> 4 -> None
```
```output
5 -> 10 -> 15 -> 20 -> None
Search 15: True
5 -> 15 -> 20 -> None
Length: 3
5 -> 15 -> 3 -> 20 -> 1 -> 2 -> 4 -> None
```

### 🔗 **Types of Linked Lists**

| Type                            | Structure                         | Description                                                  |
| ------------------------------- | --------------------------------- | ------------------------------------------------------------ |
| **Singly Linked List**          | `A -> B -> C -> None`             | Each node points to the **next** node only.                  |
| **Doubly Linked List**          | `None <- A <-> B <-> C -> None`   | Each node has **both previous and next** pointers.           |
| **Circular Singly Linked List** | `A -> B -> C -> A (back to head)` | Last node points back to the **head**, forming a circle.     |
| **Circular Doubly Linked List** | `A <-> B <-> C <-> A (both ways)` | Doubly linked, but tail connects to head in both directions. |

---

### ✅ **Use Cases (Quick)**

* **Singly**: Simple and memory-efficient (best for stacks/queues).
* **Doubly**: Easy to move **forward and backward** (best for navigation, undo-redo).
* **Circular**: Good for **cyclic tasks** (e.g., CPU scheduling, music playlist).

---

### 🧠 **Common Operations** (in all types)

* `append(data)`
* `insert(position, data)`
* `delete(value)`
* `traverse()`
* `search(data)`

Here's the updated table with **time complexities** specified for every operation in brackets:

---

| **Data Structure**      | **Classification**                      | **Operations Supported**                                                       | **Performance Metrics**                                      | **Storage Mechanism**            | **Usability**                                                    | **Use Case Examples**                                   | **Trade-offs**                                           |
|--------------------------|------------------------------------------|-------------------------------------------------------------------------------|-------------------------------------------------------------|-----------------------------------|----------------------------------------------------------------|--------------------------------------------------------|---------------------------------------------------------|
| **Array**               | Linear, Static                          | Insertion ($O(n)$), Deletion ($O(n)$), Traversal ($O(n)$), Searching ($O(n)$), Access ($O(1)$) | Access: $O(1)$, Search: $O(n)$, Insertion/Deletion: $O(n)$   | Contiguous Memory                 | Used for fixed-size collections. Easy to implement.           | Matrices, lookup tables, storing static datasets       | High memory utilization for resizing.                  |
| **Linked List**         | Linear, Dynamic                         | Insertion ($O(1)$ at head), Deletion ($O(1)$ at head), Traversal ($O(n)$), Searching ($O(n)$) | Access/Search: $O(n)$, Insertion/Deletion: $O(1)$ (at head) | Non-contiguous Memory            | Flexible size. Efficient insertion/deletion at head or tail. | Dynamic memory allocation, undo functionality          | Slower traversal due to pointer overhead.              |
| **Stack**               | Linear, Dynamic or Static               | Push ($O(1)$), Pop ($O(1)$), Peek ($O(1)$)                                    | Push/Pop: $O(1)$, Traversal: $O(n)$                         | Contiguous or Non-contiguous Memory | Used for function calls, expression evaluation.             | Expression evaluation, browser history                 | Limited to LIFO operations only.                       |
| **Queue**               | Linear, Dynamic or Static               | Enqueue ($O(1)$), Dequeue ($O(1)$), Peek ($O(1)$)                              | Enqueue/Dequeue: $O(1)$, Traversal: $O(n)$                  | Contiguous or Non-contiguous Memory | Scheduling tasks, buffering data in streams.                | Process scheduling, print spooling                     | Limited to FIFO operations.                            |
| **Binary Heap**         | Non-linear, Dynamic                     | Insertion ($O(\log n)$), Deletion ($O(\log n)$), Peek ($O(1)$)                 | Insertion/Deletion: $O(\log n)$, Access: $O(1)$             | Contiguous Memory (Array)        | Priority management. Efficient for retrieving min/max values.| Priority queues, Dijkstra’s algorithm                  | Unsorted access to non-root elements.                  |
| **Tree**                | Non-linear, Dynamic                     | Insertion ($O(\log n)$ for BST), Deletion ($O(\log n)$ for BST), Traversal ($O(n)$), Searching ($O(\log n)$ for BST) | Traversal: $O(n)$, Searching: $O(\log n)$ (for BST)         | Non-contiguous Memory            | Hierarchical representation. Used for sorting, searching.   | File systems, databases, JSON parsing                  | Balancing needed for performance in BST.               |
| **Graph**               | Non-linear, Dynamic                     | Add/Remove Edges/Nodes ($O(1)$ or $O(V)$), Traversal ($O(V + E)$), Searching ($O(V + E)$) | Traversal: $O(V + E)$                                       | Adjacency List or Matrix         | Models relationships. Efficient for networks and routes.    | Social networks, route planning                        | Memory intensive for dense graphs.                     |
| **Hash Table**          | Linear (abstract), Dynamic              | Insertion ($O(1)$ on average), Deletion ($O(1)$ on average), Search ($O(1)$ on average), Access ($O(1)$ on average) | Average: $O(1)$, Worst: $O(n)$                              | Contiguous or Non-contiguous Memory | Fast lookups. Ideal for key-value data storage.             | Symbol tables, caching, dictionaries                   | Collisions affect performance.                         |

---

# QUEUES

```python
class Queue:
    def __init__(self):
        self.items = []
    
    def __str__(self):
        values = [str(x) for x in self.items]
        return ' '.join(values)
    
    def isEmpty(self):
        if self.items == []:
            return True
        else:
            return False
    
    def enqueue(self, value):
        self.items.append(value)
        return "The element is inserted at the end of Queue"
    
    def dequeue(self):
        if self.isEmpty():
            return "The is not any element in the Queue"
        else:
            return self.items.pop(0)
    
    def peek(self):
        if self.isEmpty():
            return "The is not any element in the Queue"
        else:
            return self.items[0]
    
    def delete(self):
        self.items = None




customQueue = Queue()
customQueue.enqueue(1)
customQueue.enqueue(2)
customQueue.enqueue(3)
print(customQueue)
print(customQueue.peek())
customQueue.delete()
```

```python
from multiprocessing import Queue

customQueue = Queue(maxsize= 3)
customQueue.put(1)
customQueue.put(2)
customQueue.put(3)
customQueue.put(4)
print(customQueue)
```

```python
import queue as q

customQueue = q.Queue(maxsize=3)
print(customQueue.empty())
customQueue.put(1)
customQueue.put(2)
customQueue.put(3)
print(customQueue.full())
print(customQueue.get())
print(customQueue.qsize())
```

![image.png](kb-media:ebda0604703bf44da859.png)

### 2. **Circular Queue**
   - **Definition**: A queue where the last position connects back to the first position, forming a circle. This avoids the "wasted space" problem in simple queues.
   - **Data Structure**: Array or Circular Linked List.

---

### 3. **Priority Queue**
   - **Definition**: A queue where each element has a priority. Elements with higher priority are dequeued first, regardless of their order of arrival.
   - **Data Structure**: Binary Heap or Balanced Binary Search Tree (e.g., AVL Tree).

---

### 4. **Double-Ended Queue (Deque)**
   - **Definition**: A queue where elements can be added or removed from both ends (front and rear).
   - **Data Structure**: Array or Doubly Linked List.

---

### 5. **Input-Restricted Deque**
   - **Definition**: A type of deque where elements can only be added at one end but removed from both ends.
   - **Data Structure**: Array or Doubly Linked List.

---

### 6. **Output-Restricted Deque**
   - **Definition**: A type of deque where elements can be added at both ends but removed only from one end.
   - **Data Structure**: Array or Doubly Linked List.

## Deque

![image.png](kb-media:5d031580a61cabafec16.png)

```python
import collections
de = collections.deque([1, 2, 3,4,5,6,7,8,9,10,20,30,40])
print("deque: ", de)
de.append(4)
print("\nThe deque after appending at right is : ")
print(de)
de.appendleft(6)
print("\nThe deque after appending at left is : ")
print(de)
de.pop()
print("\nThe deque after deleting from right is : ")
print(de)
de.popleft()
print("\nThe deque after deleting from left is : ")
print(de)
print ("The number 4 first occurs at a position : ")
print (de.index(4,2,5))
de.insert(4,3)
print ("The deque after inserting 3 at 5th position is : ")
print (de)
print ("The count of 3 in deque is : ")
print (de.count(3))
de.remove(3)
print ("The deque after deleting first occurrence of 3 is : ")
print (de)
de.extend([4,5,6])
print ("The deque after extending deque at end is : ")
print (de)
de.extendleft([7,8,9])
print ("The deque after extending deque at beginning is : ")
print (de)
de.rotate(-3)
print ("The deque after rotating deque is : ")
print (de)
de.reverse()
print ("The deque after reversing deque is : ")
print (de)
```

```python
# A simple implementation of Priority Queue
# using Queue.
class PriorityQueue(object):
	def __init__(self):
		self.queue = []

	def __str__(self):
		return ' '.join([str(i) for i in self.queue])

	# for checking if the queue is empty
	def isEmpty(self):
		return len(self.queue) == 0

	# for inserting an element in the queue
	def insert(self, data):
		self.queue.append(data)

	# for popping an element based on Priority
	def delete(self):
		try:
			max_val = 0
			for i in range(len(self.queue)):
				if self.queue[i] > self.queue[max_val]:
					max_val = i
			item = self.queue[max_val]
			del self.queue[max_val]
			return item
		except IndexError:
			print()
			exit()

if __name__ == '__main__':
	myQueue = PriorityQueue()
	myQueue.insert(12)
	myQueue.insert(1)
	myQueue.insert(14)
	myQueue.insert(7)
	print(myQueue)		
	while not myQueue.isEmpty():
		print(myQueue.delete())
        
        
#using heap or binary heap we can get log(n) complexity
```

```python
class CircularQueue():

	# constructor
	def __init__(self, size): # initializing the class
		self.size = size
		
		# initializing queue with none
		self.queue = [None for i in range(size)]
		self.front = self.rear = -1

	def enqueue(self, data):
		
		# condition if queue is full
		if ((self.rear + 1) % self.size == self.front):
			print(" Queue is Full\n")
			
		# condition for empty queue
		elif (self.front == -1):
			self.front = 0
			self.rear = 0
			self.queue[self.rear] = data
		else:
			
			# next position of rear
			self.rear = (self.rear + 1) % self.size #here it can't be zero
			self.queue[self.rear] = data
			
	def dequeue(self):
		if (self.front == -1): # condition for empty queue
			print ("Queue is Empty\n")
			
		# condition for only one element
		elif (self.front == self.rear):
			temp=self.queue[self.front]
			self.front = -1
			self.rear = -1
			return temp
		else:
			temp = self.queue[self.front]
			self.front = (self.front + 1) % self.size
			return temp

	def display(self):
	
		# condition for empty queue
		if(self.front == -1):
			print ("Queue is Empty")
		elif (self.rear >= self.front):
			print("Elements in the circular queue are:",
											end = " ")
			for i in range(self.front, self.rear + 1):
				print(self.queue[i], end = " ")
			print ()
		else:
			print ("Elements in Circular (what is this) Queue are:",
										end = " ")
			for i in range(self.front, self.size):
				print(self.queue[i], end = " ")
			for i in range(0, self.rear + 1):
				print(self.queue[i], end = " ")
			print ()
		if ((self.rear + 1) % self.size == self.front):
			print("Queue is Full")
# Driver Code
ob = CircularQueue(5)
ob.enqueue(14)
ob.enqueue(22)
ob.enqueue(13)
ob.enqueue(-6)
ob.enqueue(20)
ob.enqueue(90)
ob.display()
print ("Deleted value = ", ob.dequeue())
print ("Deleted value = ", ob.dequeue())
ob.display()
ob.enqueue(9)
ob.enqueue(20)
ob.enqueue(5)
ob.display()
```

# stack

```python
class Stack:
    def __init__(self, maxSize):
        self.maxSize = maxSize
        self.list = []
    
    def __str__(self):
        values = self.list.reverse()
        values = [str(x) for x in self.list]
        return '\n'.join(values)
    
    # isEmpty
    def isEmpty(self):
        if self.list == []:
            return True
        else:
            return False
    
    # isFull
    def isFull(self):
        if len(self.list) == self.maxSize:
            return True
        else:
            return False
    
    #  Push
    def push(self, value):
        if self.isFull():
            return "The stack is full"
        else:
            self.list.append(value)
            return "The element has been successfully inserted"
    # Pop
    def pop(self):
        if self.isEmpty():
            return "There is not any element in the stack"
        else:
            return self.list.pop()
    
    # peek
    def peek(self):
        if self.isEmpty():
            return "There is not any element in the stack"
        else:
            return self.list[len(self.list)-1]

    #  delete
    def delete(self):
        self.list = None
    

customStack = Stack(4)
print(customStack.isEmpty())
print(customStack.isFull())
customStack.push(1)
customStack.push(2)
customStack.push(3)
print(customStack)
```
```output
True
False
3
2
1
```

```python
class MultiStack:

    def __init__(self, stacksize):
        self.numstacks = 5
        self.array = [0] * (stacksize * self.numstacks)
        self.sizes = [0] * self.numstacks
        self.stacksize = stacksize
        # print(self.array)
        # print(self.sizes)

    def Push(self, item, stacknum):
        if self.IsFull(stacknum):
            raise Exception('Stack is full')
        self.sizes[stacknum] += 1
        self.array[self.IndexOfTop(stacknum)] = item

    def Pop(self, stacknum):
        if self.IsEmpty(stacknum):
            raise Exception('Stack is empty')
        value = self.array[self.IndexOfTop(stacknum)]
        self.array[self.IndexOfTop(stacknum)] = 0
        self.sizes[stacknum] -= 1
        return value

    def Peek(self, stacknum):
        if self.IsEmpty(stacknum):
            raise Exception('Stack is empty')
        return self.array[self.IndexOfTop(stacknum)]

    def IsEmpty(self, stacknum):
        return self.sizes[stacknum] == 0

    def IsFull(self, stacknum):
        return self.sizes[stacknum] == self.stacksize

    def IndexOfTop(self, stacknum):
        offset = stacknum * self.stacksize
        return offset + self.sizes[stacknum] - 1

stack = MultiStack(2)
stack.Push(10,1)
stack.Push(9,2)
stack.Push(2,3)
stack.Push(7,2)
stack.Pop(2)
```
```output
7
```

# TREE

Here is a list of data structures that can be used to implement trees in Python:

1. **List (Array)**  
2. **Linked List**  
3. **Object-Oriented Approach (Classes)**  
4. **Dictionary (for specific tree types like Tries)**  
5. **Heap (for binary heaps)**

![image.png](kb-media:80dfecd165176e54d1a6.png)

![image.png](kb-media:60f9b61475e28f09cd20.png)

1. **Descendant**: Any node that lies on the path from a given node to its leaves.  
2. **Height of a Node**: The longest path from the node to any of its leaf nodes.  
3. **Height of a Tree**: The height of the root node.  
4. **Depth of a Node**: The number of edges from the root to the node.  
5. **Level**: The depth of a node plus one (e.g., the root is at level 1).  
6. **Subtree**: A tree formed by taking a node and all its descendants.  
7. **Degree of a Node**: The number of children a node has.  
8. **Path**: A sequence of nodes connected by edges.  
9. **Internal Node**: A node that has at least one child.  
10. **External Node**: Another name for a leaf node.

```python
class TreeNode: #TreeA hierarchical structure with nodes that can have any number of children.
    def __init__(self, data, children = []):
        self.data = data
        self.children = children
    
    def __str__(self, level=0):
        ret = "  " * level + str(self.data)  + "\n"
        for child in self.children:
            ret += child.__str__(level + 1)
        return ret
    
    def addChild(self, TreeNode):
        self.children.append(TreeNode)

tree = TreeNode('Drinks', [])
cold = TreeNode('Cold', [])
hot = TreeNode('Hot', [])
tree.addChild(cold)
tree.addChild(hot)
tea = TreeNode('Tea', [])
coffee = TreeNode('Coffee', [])
cola = TreeNode('Cola', [])
fanta = TreeNode('Fanta', [])
cold.addChild(cola)
cold.addChild(fanta)
hot.addChild(tea)
hot.addChild(coffee)
print(tree)
```

```python
# Binary Tree Definition :A hierarchical structure where each node has at most two children.
class BinaryTree:
    def __init__(self, size):
        self.customList = size * [None]
        self.lastUsedIndex = 0
        self.maxSize = size
    def  nothing(self):
        values=[self.customList[x] for x in range(len(self.customList))]
        return values
    def insertNode(self, value):
        if self.lastUsedIndex + 1 == self.maxSize:
            return "The Binary Tree is full"
        self.customList[self.lastUsedIndex+1] = value
        self.lastUsedIndex += 1
        return "The value has been successfully inserted"

    def searchNode(self, nodeValue):
        for i in range(len(self.customList)):
            if self.customList[i] == nodeValue:
                return "Success"
        return "Not found"
    
    def preOrderTraversal(self, index):
        if index > self.lastUsedIndex:
            return
        print(self.customList[index])
        self.preOrderTraversal(index*2)
        self.preOrderTraversal(index*2 + 1)

    def inOrderTraversal(self, index):
        if index > self.lastUsedIndex:
            return
        self.inOrderTraversal(index*2)
        print(self.customList[index])
        self.inOrderTraversal(index*2+1)
    
    def postOrderTraversal(self, index):
        if index > self.lastUsedIndex:
            return
        self.postOrderTraversal(index*2)
        self.postOrderTraversal(index*2+1)
        print(self.customList[index])
    
    def levelOrderTraversal(self, index):
        for i in range(index, self.lastUsedIndex+1):
            print(self.customList[i])
    
    def deleteNode(self, value):
        if self.lastUsedIndex == 0:
            return "There is not any node to delete"
        for i in range(1, self.lastUsedIndex+1):
            if self.customList[i] == value:
                self.customList[i] = self.customList[self.lastUsedIndex]
                self.customList[self.lastUsedIndex] = None
                self.lastUsedIndex -= 1
                return "The node has been successfully deleted"
    
    def deleteBT(self):
        self.customList = None
        return "The BT has been successfully deleted"

newBT = BinaryTree(8)
newBT.insertNode("Drinks")
newBT.insertNode("Hot")
newBT.insertNode("Cold")
newBT.insertNode("Tea")
newBT.insertNode("Coffee")
print(newBT.nothing())
newBT.postOrderTraversal(1)

print(newBT.deleteBT())
```

![image.png](kb-media:2c54df077e08ee994782.png)

![image.png](kb-media:0f6f534a1bfd9160742d.png)

Full Tree: Every node has either 0 or 2 children. It can be a binary tree, but it doesn't necessarily need to be complete or balanced.

Complete Tree: All levels are fully filled except possibly the last level, which is filled from left to right. This tree is always binary, and it can be unbalanced but not sparse.

Almost Complete Tree: Similar to a complete tree, but may have some missing nodes in the last level. It ensures that all nodes before the last level are fully filled, and the last level is filled from left to right.

Perfect Tree: A fully balanced tree where all nodes (except leaves) have exactly two children, and all leaves are at the same level. Every level in the tree is completely filled.

----

https://www.youtube.com/playlist?list=PLEJXowNB4kPyP2PdMhOUlTY6GrRIITx28

Here’s the difference between **Heap** and **Binary Heap** in a table format:

| **Aspect**           | **Heap**                              | **Binary Heap**                         |
|----------------------|---------------------------------------|-----------------------------------------|
| **Definition**        | A general term for a tree-based data structure satisfying the heap property. | A specific type of heap implemented as a **complete binary tree**. |
| **Structure**         | Can be any tree structure, not limited to binary trees. | Always a **binary tree** with at most two children per node. |
| **Tree Type**         | Not restricted to binary trees.       | **Complete binary tree** (all levels fully filled except the last). |
| **Implementation**    | Can be implemented using various tree types (e.g., binary, ternary). | Typically implemented using **arrays** or **lists**. |
| **Operations**        | Depends on the implementation (can vary in complexity). | Operations (insert, delete) are **O(log n)** for both **max-heap** and **min-heap**. |
| **Efficiency**        | Varies depending on tree type.       | Very efficient in terms of space and time, with logarithmic complexity. |
| **Usage**             | Used in generalized tree-based heap operations. | Used for **priority queues**, heapsort, and efficient **min/max access**. |

Let me know if you'd like further clarification!

![image.png](kb-media:73c0385d55568ea137b2.png)

### Heap and Its Types

A **Heap** is a specialized tree-based data structure that satisfies the **heap property**:
- **Max-Heap**: The value of a parent node is greater than or equal to the values of its children. The largest value is at the root.
- **Min-Heap**: The value of a parent node is less than or equal to the values of its children. The smallest value is at the root.

---

### Types of Heap
1. **Max-Heap**: Used when the maximum value is needed quickly (e.g., priority queues for maximum).
2. **Min-Heap**: Used when the minimum value is needed quickly (e.g., Dijkstra’s algorithm).

---

### Simple Python Code for a Min-Heap

Here’s a simple implementation of a Min-Heap:

```python
import heapq

# Create a Min-Heap
min_heap = []

# Add elements to the heap
heapq.heappush(min_heap, 10)
heapq.heappush(min_heap, 5)
heapq.heappush(min_heap, 20)

# Remove and return the smallest element
smallest = heapq.heappop(min_heap)

# Check the heap
print("Smallest element:", smallest)  # Output: 5
print("Heap after pop:", min_heap)    # Output: [10, 20]
```

---

### Simple Python Code for a Max-Heap

In Python, a **Max-Heap** can be implemented using `heapq` by negating the values:

```python
import heapq

# Create a Max-Heap
max_heap = []

# Add elements to the heap (negate the values)
heapq.heappush(max_heap, -10)
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -20)

# Remove and return the largest element (negate back to get the original value)
largest = -heapq.heappop(max_heap)

# Check the heap
print("Largest element:", largest)  # Output: 10
print("Heap after pop:", [-x for x in max_heap])  # Output: [5, 20]
```

---

### Key Points
- **Min-Heap**: Directly supported by Python's `heapq`.
- **Max-Heap**: Simulated using negation (`-value`) because Python's `heapq` defaults to a Min-Heap.

These implementations are simple and use Python’s built-in library, `heapq`, for efficiency and ease.

Here’s a table highlighting the differences between different types of trees along with their definitions:

| **Tree Type**          | **Definition**                                                                                   | **Key Characteristics**                                                                          |
|------------------------|-------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| **General Tree**        | A tree in which each node can have an arbitrary number of children.                             | No restrictions on the number of children. Each node can have multiple children.                |
| **Binary Tree**         | A tree where each node has at most two children: a left child and a right child.                 | Every node has either 0, 1, or 2 children. Simple structure, often used in search trees.        |
| **Binary Search Tree (BST)** | A binary tree with an additional property: left child < parent < right child.                   | Left child is smaller, right child is larger, ensuring ordered structure for efficient searches. |
| **AVL Tree**            | A self-balancing binary search tree where the difference in heights of left and right subtrees is at most 1. | Ensures logarithmic height to maintain O(log n) time complexity for search operations.         |
| **Red-Black Tree**      | A balanced binary search tree with an additional color attribute for each node to ensure balance. | Each node is either red or black; maintains balance through specific properties.               |
| **Heap**                | A complete binary tree that satisfies the heap property: either max-heap or min-heap.           | Used to implement priority queues; max-heap has parent > children, min-heap has parent < children. |
| **B-Tree**              | A self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time. | Nodes can have multiple children (more than 2); commonly used in databases and filesystems.     |
| **B+ Tree**             | A variation of the B-tree where only the leaf nodes contain data, and internal nodes only store keys. | Optimized for range queries and commonly used in indexing in databases.                        |
| **Trie**                | A tree-like data structure used to store strings, where each node represents a character.       | Used for efficient string searching and prefix matching, such as autocomplete systems.          |
| **Segment Tree**        | A binary tree used for storing intervals or segments, allowing efficient range queries.          | Used for range query problems, like sum, minimum, or maximum over a range of indices.          |
| **Fenwick Tree (Binary Indexed Tree)** | A tree structure used for efficient range sum queries and updates.                       | Allows both point updates and prefix sum queries in O(log n) time.                            |
| **N-ary Tree**          | A tree where each node can have up to 'N' children.                                             | Generalized version of a tree with any number of children per node, often used in file systems. |
| **Expression Tree**     | A tree used to represent mathematical expressions, where leaves represent operands and internal nodes represent operators. | Commonly used in compilers for parsing expressions.                                          |

This table outlines key types of trees, their characteristics, and typical use cases. Let me know if you'd like more information on any specific tree type!
