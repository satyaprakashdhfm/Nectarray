1. **`char[]` prints like a String** – JVM implicitly converts it to a String.
2. **`int[]` prints object hashcode** – because it inherits `Object.toString()`.
3. **String is immutable** – methods like `toUpperCase()` don’t modify the original.
4. **`==` vs `.equals()` in Strings** – `==` checks reference, `.equals()` checks content.
5. **String literals are interned** – identical literals share the same memory reference.
6. **Arrays are fixed-size** – their length can't be changed once created.
7. **`println(obj)` calls `toString()`** – prints object info unless overridden.
8. **Array uses `.length`** – whereas String uses `.length()`.
9. **No native multiple return values** – use arrays or wrapper objects.
10. **Use `Arrays.toString()` to print arrays** – for readable output.
11. **`final` makes variables constant** – they can't be reassigned.
12. **Autoboxing** – Java auto-converts `int` to `Integer` when needed.

✅ Fixed Version:

```java
import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int rem = target - nums[i];

            if (map.containsKey(rem)) {
                int[] ans = {i, map.get(rem)};
                return ans;
            }

            map.put(nums[i], i);
        }

        // 🔴 This return is required if no pair is found
        return new int[] {};  // or throw an exception if needed
    }
}
```
🧠 Why This Is Needed:

Java **doesn’t assume** that your loop will definitely return a value. If no pair is found, and the method ends, Java wants to know: *“What should I return?”* That’s why you must add a return at the end.

---
---

Java is a **high-level, class-based, object-oriented programming language** (developed by Sun Microsystems in 1995) that emphasizes portability and robustness. Java is **statically typed** and **compiled to bytecode**, which runs on the Java Virtual Machine (JVM), enabling Write-Once-Run-Anywhere (WORA) platform independence.Java is fundamentally synchronous by default, meaning code execution typically proceeds step-by-step in the order it is written, with each operation completing before the next one begins.

- The **JDK (Java Development Kit)** is used to **compile, debug, and execute** Java programs.
- The **JRE** only runs Java programs; it lacks compilers and debuggers.
- The **JVM** executes bytecode but cannot compile source code.
- The **JIT compiler**, part of the JVM, optimizes bytecode at runtime for better performance.

---
---

## Basic Syntax and Structure

Java source code is organized into **classes** and methods. Each application has a `main` method as the entry point:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");  // Print to console
    }
}
```

* **Class and File Names:** The public class name must match the filename (e.g. `HelloWorld.java` contains `public class HelloWorld`).
* **Case Sensitivity:** Java is case-sensitive (`Hello` and `hello` are different).
* **Semicolons:** Most statements end with a semicolon (`;`).
* **Braces:** Code blocks (classes, methods, control-flow bodies) are enclosed in `{ }`.
* **Comments:** Use `//` for single-line or `/* … */` for multi-line comments. Documentation comments use `/** … */`. For example, `// This is a comment` or `/* multi-line comment */`.

Java source files optionally start with `package` and `import` declarations, followed by one or more class definitions. Each Java application must have a `public static void main(String[] args)` method to run.

## Data Types and Variables - In any language it is possible that , a data structure like an array or `ArrayList` is also a **data type** if it can be used to declare a variable holding a specific kind of data.


Java is **statically and strongly typed**, so every variable has a declared type. Types are divided into **primitive types** and **reference types**:

## 🧩 Java Data Types

### 🔹 **Primitive Data Types** ( there are 8 - Built-in, fixed-size)

| Type      | Size   | Example                | Default Value | Description                 | Python Equivalent |
| --------- | ------ | ---------------------- | ------------- | --------------------------- | ----------------- |
| `byte`    | 8-bit  | `byte b = 10;`         | `0`           | Small integer (-128 to 127) | `int`             |
| `short`   | 16-bit | `short s = 1000;`      | `0`           | Medium-range integer        | `int`             |
| `int`     | 32-bit | `int x = 50000;`       | `0`           | Default integer type        | `int`             |
| `long`    | 64-bit | `long l = 123456789L;` | `0L`          | Large-range integer         | `int`             |
| `float`   | 32-bit | `float f = 3.14f;`     | `0.0f`        | Single-precision decimal    | `float`           |
| `double`  | 64-bit | `double d = 3.14159;`  | `0.0d`        | Double-precision decimal    | `float`           |
| `char`    | 16-bit | `char c = 'A';`        | `'\u0000'`    | Single Unicode character    | `str` (1-char)    |
| `boolean` | 1-bit  | `boolean flag = true;` | `false`       | Logical `true` / `false`    | `bool`            |

> ☑️ **Immutable**, passed by **value**, stored in **stack memory**.


### 🔸 **Non-Primitive Data Types** (Reference types)

| Type            | Example                                           | Default | Description                                           | Python Comparison              |
| --------------- | ------------------------------------------------- | ------- | ----------------------------------------------------- | ------------------------------ |
| `String`        | `String name = "Alice";`                          | `null`  | Immutable text type                                   | `str`                          |
| `Array`         | `int[] nums = {1, 2, 3};`                         | `null`  | Fixed-size collection of elements of same type        | `list` (fixed-size)            |
| `Class`         | `class Dog {}`                                    | `null`  | Custom OOP blueprint                                  | `class`                        |
| `Object`        | `Object o = new Dog();`                           | `null`  | Superclass of all reference types                     | `object`                       |
| `Interface`     | `interface Shape { void draw(); }`                | `null`  | Defines abstract contract (enforced via `implements`) | `ABC`, `Protocol` (Python)     |
| `Enum`          | `enum Day { MON, TUE }`                           | `null`  | Set of named constants                                | `Enum` module                  |
| `ArrayList`     | `ArrayList<Integer> list = new ArrayList<>();`    | `null`  | Dynamic array with resizing                           | `list`                         |
| `HashMap`       | `HashMap<String, Integer> map = new HashMap<>();` | `null`  | Key-value data structure                              | `dict`                         |
| Wrapper Classes | `Integer`, `Double`, `Boolean`, etc.              | `null`  | Object forms of primitives (autoboxing supported)     | No exact equivalent (implicit) |

> 🔁 **Mutable or immutable**, passed by **reference**, stored in **heap memory**.



### 💡 Summary (Quick)

* **Primitives**: Small, fast, low-level — fixed set of types (8 total), value-based
* **Non-Primitives**: Everything else (Strings, arrays, classes, collections, etc.) — reference-based, object-oriented
* **Default values**: Primitives have non-null defaults (like `0`), but non-primitives default to `null`


```java
int count = 10;          // primitive int
double price = 19.99;    // primitive double
boolean flag = true;     // primitive boolean
char letter ='a';        // primitive character
String name = "Alice";   // reference type (String)
char[] name = "Alice".toCharArray();  // ✅ Correct way
System.out.println(name);  // Prints: Alice 
// from array of char to string;
String s = new String(name);

```


## 🧱 Primitive vs Non-Primitive Data **Structures** in Java

| Category                     | Type                  | Mutable? | Description / Notes                                     | Python Equivalent    |
| ---------------------------- | --------------------- | -------- | ------------------------------------------------------- | -------------------- |
| **Primitive (Single-value)** | `int`, `double`, etc. | ❌ No     | Hold single, raw values. No methods.                    | `int`, `float`, etc. |
|                              | `char`, `boolean`     | ❌ No     | Basic building blocks. Stored directly in stack memory. |                      |
|                              | Arrays of primitives  | ✅ Yes    | e.g., `int[]`, `char[]`. Mutable containers of values.  | `list[int]`, etc.    |



| Category                      | Type / Structure       | Mutable? | Description / Notes                                   | Python Equivalent   |
| ----------------------------- | ---------------------- | -------- | ----------------------------------------------------- | ------------------- |
| **Non-Primitive (Reference)** | `String`               | ❌ No     | Immutable object holding character data.              | `str`               |
|                               | `StringBuilder`        | ✅ Yes    | Mutable alternative to String.                        | `list of char`      |
|                               | `Array` of objects     | ✅ Yes    | e.g., `String[]`, `Object[]`. Fixed-length, typed.    | `list`              |
|                               | `ArrayList`            | ✅ Yes    | Resizable array-backed list.                          | `list`              |
|                               | `LinkedList`           | ✅ Yes    | Doubly-linked list. Supports queue/stack operations.  | `collections.deque` |
|                               | `HashMap`              | ✅ Yes    | Key-value store (unordered).                          | `dict`              |
|                               | `TreeMap`              | ✅ Yes    | Sorted map (Red-Black Tree based).                    | `dict + sort()`     |
|                               | `HashSet`              | ✅ Yes    | Set of unique elements.                               | `set`               |
|                               | `TreeSet`              | ✅ Yes    | Sorted set.                                           | `sorted(set)`       |
|                               | `Deque`, `ArrayDeque`  | ✅ Yes    | Double-ended queue. Used as queue or stack.           | `deque`             |
|                               | `User-defined classes` | ✅/❌      | Depends on fields — mix of primitives or collections. | `custom class`      |


### 💡 Summary

* ✅ **Primitive structures** are fixed and value-based — like `int`, `char`, `int[]`.
* ✅ **Non-primitive structures** are object-based (class instances), hold complex data, and are stored as **references**.
* ✅ Java collections (`ArrayList`, `HashMap`, etc.) are all non-primitive and mutable by design.

---
---

## 🧾 Java Functions / Methods – Full Summary



 ✅ 1. **Definition**

In Java, a **function** is called a **method**, and every method must be defined **inside a class**. Java does **not support** standalone functions like Python.


🧩 2. **Method Syntax**

```java
<access_modifier> [static] <return_type> <method_name>(<parameters>) {
    // body
}
```

✅ Example:

```java
public int sum(int a, int b) {
    return a + b;
}
```



 🧪 3. **Types of Methods**

| Type                     | Description                        | Example                        |
| ------------------------ | ---------------------------------- | ------------------------------ |
| **Instance Method**      | Requires object to call            | `obj.show()`                   |
| **Static Method**        | Belongs to class, no object needed | `ClassName.method()`           |
| **Void Method**          | Returns nothing                    | `public void print()`          |
| **Return Method**        | Returns a value                    | `public int square()`          |
| **Parameterized Method** | Takes arguments                    | `public int add(int a, int b)` |
| **No-Parameter Method**  | No arguments                       | `public void greet()`          |



🔄 4. **Method Overloading**

Same method name, different parameters:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
```

Overloading works with:

* Different number of parameters
* Different types or order of parameters

🚫 **Return type alone** cannot differentiate methods.



🛠️ 5. **Calling Methods**

```java
// Static
MyClass.staticMethod();
staticMethod(); // within same class

// Instance
MyClass obj = new MyClass();
obj.instanceMethod();
```


🔐 6. **Access Modifiers**

| Modifier             | Scope                     |
| -------------------- | ------------------------- |
| `public`             | Everywhere                |
| `private`            | Within the class only     |
| `protected`          | Same package + subclasses |
| default (no keyword) | Same package only         |



🧵 7. **Main Method (Entry Point)**

```java
public static void main(String[] args) {
    // Program starts here
}
```

Only `main()` runs directly. All other code must be called from here or another method.


🧠 8. **Comparison with Python**

| Feature              | Python                   | Java            |
| -------------------- | ------------------------ | --------------- |
| Top-level functions  | ✅ Yes                    | ❌ No            |
| Methods inside class | Optional                 | Required        |
| Default access       | Public                   | Package-private |
| Function overloading | ❌ Not supported natively | ✅ Supported     |



✅ Example Recap

```java
public class Calculator {
    public int add(int a, int b) { return a + b; }
    public static void greet() { System.out.println("Hello!"); }

    public static void main(String[] args) {
        greet();
        Calculator c = new Calculator();
        System.out.println(c.add(3, 4));
    }
}
```

---

## Java Collections Framework

Java provides a rich **Collections Framework** for storing and manipulating groups of objects. Key interfaces and implementations include:

* **`List`** – ordered sequences. Example implementations: `ArrayList`, `LinkedList`.
* **`Set`** – collections with no duplicates. Example: `HashSet`, `TreeSet`, `LinkedHashSet`.
* **`Map`** – key-value pairs (not a `Collection`). Example: `HashMap`, `TreeMap`, `LinkedHashMap`.

These collections are generic (`List<String>`, etc.) and support operations like add/remove, iteration, searching, sorting, etc. For example:

```java
import java.util.*;
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
list.add("apple");  // duplicates allowed in List
System.out.println(list);  // [apple, banana, apple]

Set<String> set = new HashSet<>(list);
System.out.println(set);   // [banana, apple] (duplicates removed)

Map<String,Integer> map = new HashMap<>();
map.put("Alice", 30);
map.put("Bob", 25);
System.out.println(map.get("Alice"));  // 30
```

The Oracle docs summarize these: a unified collections framework with interfaces like `List`, `Set`, `Map` and implementations like `HashSet`, `TreeSet`, `ArrayList`, `HashMap`. These provide data structures and algorithms out-of-the-box for high performance and code reuse.

 

📚 1. What is the **Collections API**?

* The **Collections API** is a **framework of classes and interfaces** in `java.util` for working with **groups of objects** (aka data structures).
* It includes:

  * **Interfaces**: `Collection`, `List`, `Set`, `Map`, `Queue`, etc.
  * **Classes**: `ArrayList`, `LinkedList`, `HashSet`, `TreeMap`, etc.
  * **Utility class**: `Collections` (with helper methods like `sort()`, `shuffle()`)

✅ Think of the **Collections API** as the **whole toolbox**.

 

🔗 2. What is the **Collection Interface**?

* `Collection` is the **root interface** in the Collections API hierarchy.
* It represents a group of **objects known as elements**.
* `List`, `Set`, and `Queue` **extend** `Collection`, but **Map does not** (because Map holds key-value pairs, not a simple group of objects).

Basic hierarchy:

```
Collection (interface)
├── List      → ArrayList, LinkedList
├── Set       → HashSet, TreeSet
└── Queue     → PriorityQueue, LinkedList
```

✅ Summary

| Term                     | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| **Collections API**      | The entire framework (interfaces + classes) for data structures |
| **Collection Interface** | Root interface for lists, sets, queues                          |
| **Collections Class**    | A helper class with static methods like `sort()`, `reverse()`   |

 

---

---
---

```java
// String Creation
String s = "Hello";
String s2 = new String("Hello");  // using constructor

// Basic String Methods
s.length();             // Returns the number of characters
s.charAt(2);            // Returns the character at index 2
s.toLowerCase();        // Converts to lowercase
s.toUpperCase();        // Converts to uppercase
s.trim();               // Removes leading and trailing spaces
s.strip();              // Java 11+, removes Unicode white space
s.substring(1);         // Returns substring from index 1
s.substring(1, 4);      // Returns substring from index 1 to 3
s.replace("l", "x");    // Replaces all 'l' with 'x'
s.concat(" World");     // Appends " World" to the string
s.startsWith("He");     // Checks if string starts with "He"
s.endsWith("lo");       // Checks if string ends with "lo"
s.contains("ll");       // Checks if substring exists
s.indexOf("l");         // Returns first index of 'l'
s.lastIndexOf("l");     // Returns last index of 'l'
s.equals("Hello");      // Compares content
s.equalsIgnoreCase("HELLO");  // Ignores case while comparing
s.compareTo("World");   // Lexicographical comparison
s.toCharArray();        // Converts string to char array
s.getBytes();           // Converts string to byte array
String.valueOf(123);    // Converts int to string
String.format("Age: %d", 25);  // String formatting
String.join("-", "a", "b", "c");  // Joins strings with delimiter
"hello".repeat(3);      // Java 11+, repeats the string 3 times
"hi".intern();          // Moves string to string pool

// Checking Properties
"abc".isEmpty();        // Checks if string is empty
"abc".isBlank();        // Java 11+, checks if only whitespace

// StringBuilder Only (Mutable)
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");           // Adds to end
sb.insert(5, ",");             // Inserts at index
sb.delete(5, 6);               // Deletes characters from index
sb.replace(0, 5, "Hi");        // Replaces characters from 0 to 4
sb.reverse();                  // Reverses the string
sb.setCharAt(0, 'Y');          // Changes character at index 0
sb.length();                   // Gets length
sb.capacity();                 // Gets current buffer size
sb.ensureCapacity(50);         // Ensures capacity
sb.toString();                 // Converts back to normal string

// StringBuffer is same as StringBuilder, but thread-safe (synchronized)
```
```output
YlroW iH
```

```java
// 📦 Array Creation
int[] a = new int[5];                 // [0, 0, 0, 0, 0]
int[] b = {1, 2, 3};                  // Inline
int[] c = new int[] {4, 5, 6};       // Explicit new
String[] s = {"A", "B"};
char[] ch = "Hello".toCharArray();   // String ➜ char array

// 📦 ArrayList Creation
import java.util.ArrayList;
ArrayList<Integer> list = new ArrayList<>();
ArrayList<String> names = new ArrayList<>(List.of("A", "B"));  // Java 9+

// 🎯 Access & Modify
a[0] = 99;                   // Array: set
int v = a[1];                // Array: get
int len = a.length;          // Array: length

list.add(10);                // Add element
list.get(0);                 // Get element
list.set(0, 99);             // Replace
list.remove(0);              // Remove by index
list.contains(10);           // Check exists
int size = list.size();      // List size

// 🔁 Iteration
for (int i = 0; i < a.length; i++) {}
for (int x : a) {}

for (int val : list) {}
list.forEach(System.out::println);

// 🧰 Arrays Utility (java.util.Arrays)
import java.util.Arrays;
Arrays.toString(a);              // "[1, 2, 3]"
Arrays.equals(a, b);             // Compare content
Arrays.copyOf(a, 10);            // Resize ➜ [1,2,3,0,0...]
Arrays.sort(a);                  // In-place sort
Arrays.fill(a, 42);              // Fill all
Arrays.binarySearch(a, 5);       // Binary search
Arrays.hashCode(a);              // Array hash
Arrays.setAll(a, i -> i * i);    // Fill with lambda
Arrays.stream(a).sum();          // Sum of values

// 🧰 Collections Utility
import java.util.Collections;
Collections.sort(list);          // Sort list
Collections.reverse(list);       // Reverse list
Collections.shuffle(list);       // Random order
Collections.max(list);           // Max element
Collections.min(list);           // Min element

// 🔄 Conversion
String[] strArr = {"a", "b"};
List<String> list1 = Arrays.asList(strArr);    // Array ➜ Fixed List
int[] primitive = {1, 2, 3};
List<Integer> boxed = Arrays.stream(primitive).boxed().toList();  // int[] ➜ List<Integer>

list.toArray();                  // List ➜ Object[]
list.toArray(new Integer[0]);   // List ➜ Typed Array

// 🧪 Common Mistakes
int[] bad = new int[] = {1, 2};      // ❌ Invalid
int[] empty = {};                    // ❌ Invalid
int[] ok = new int[] {};             // ✅ Correct

// ✅ Cloning
int[] cloned = a.clone();            // Deep copy
ArrayList<Integer> copiedList = new ArrayList<>(list);  // Copy list

// 🧮 Streams (Arrays & Lists)
Arrays.stream(a).forEach(System.out::println);
list.stream().map(x -> x * 2).toList();       // Java 16+
list.stream().filter(x -> x > 5).count();

// 📚 Multi-Dimensional Arrays
int[][] matrix = new int[2][3];
matrix[0][1] = 7;
int val2 = matrix[1][2];

// ✨ Varargs Method (flexible array)
void printAll(int... nums) {
    for (int n : nums) System.out.println(n);
}
printAll(1, 2, 3);  // Call
```

---
---

```java
// 1. Reverse digits of a number
public static int reverseDigits(int n) {
    int rev = 0;
    while (n != 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev;
}

// 2. Check if number is palindrome
public static boolean isPalindrome(int n) {
    return n == reverseDigits(n);
}

// 3. Reverse a string
public static String reverseString(String s) {
    return new StringBuilder(s).reverse().toString();
}

// 4. Square root using Math.sqrt
public static double sqrt(double x) {
    return Math.sqrt(x);
}

// 5. Check if prime
public static boolean isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

// 5.1 First n primes
public static void printFirstNPrimes(int n) {
    int count = 0, num = 2;
    while (count < n) {
        if (isPrime(num)) {
            System.out.print(num + " ");
            count++;
        }
        num++;
    }
}

// 5.2 Primes below n
public static void printPrimesBelowN(int n) {
    for (int i = 2; i < n; i++) {
        if (isPrime(i)) System.out.print(i + " ");
    }
}

// 6. Factors of a number
public static void printFactors(int n) {
    for (int i = 1; i <= n; i++) {
        if (n % i == 0) System.out.print(i + " ");
    }
}

// 6.1 Prime factors
public static void printPrimeFactors(int n) {
    for (int i = 2; i <= n; i++) {
        while (n % i == 0) {
            System.out.print(i + " ");
            n /= i;
        }
    }
}

// 7. Strong number
public static boolean isStrong(int n) {
    int original = n, sum = 0;
    while (n != 0) {
        int digit = n % 10;
        sum += factorial(digit);
        n /= 10;
    }
    return sum == original;
}

// 7.1 Perfect number
public static boolean isPerfect(int n) {
    int sum = 0;
    for (int i = 1; i < n; i++) {
        if (n % i == 0) sum += i;
    }
    return sum == n;
}

// 8. Factorial
public static int factorial(int n) {
    int res = 1;
    for (int i = 2; i <= n; i++) res *= i;
    return res;
}

// 8.1 Fibonacci up to n terms
public static void printFibonacci(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        System.out.print(a + " ");
        int next = a + b;
        a = b;
        b = next;
    }
}

// 9. LCM using GCD
public static int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

public static int lcm(int a, int b) {
    return (a * b) / gcd(a, b);
}

    // ✅ You can test any function in the main method

System.out.println("Reverse: " + reverseDigits(1234));
System.out.println("Palindrome: " + isPalindrome(121));
System.out.println("Reverse String: " + reverseString("hello"));
System.out.println("Square Root of 9: " + sqrt(9));
System.out.println("Is Prime: " + isPrime(17));
System.out.print("First 5 Primes: "); printFirstNPrimes(5); System.out.println();
System.out.print("Primes < 10: "); printPrimesBelowN(10); System.out.println();
System.out.print("Factors of 12: "); printFactors(12); System.out.println();
System.out.print("Prime Factors of 60: "); printPrimeFactors(60); System.out.println();
System.out.println("Is Strong: " + isStrong(145));
System.out.println("Is Perfect: " + isPerfect(28));
System.out.println("Factorial of 5: " + factorial(5));
System.out.print("Fibonacci (7 terms): "); printFibonacci(7); System.out.println();
System.out.println("GCD(12, 18): " + gcd(12, 18));
System.out.println("LCM(12, 18): " + lcm(12, 18));
```
```output
Reverse: 4321
Palindrome: true
Reverse String: olleh
Square Root of 9: 3.0
Is Prime: true
First 5 Primes: 2 3 5 7 11 
Primes < 10: 2 3 5 7 
Factors of 12: 1 2 3 4 6 12 
Prime Factors of 60: 2 2 3 5 
Is Strong: true
Is Perfect: true
Factorial of 5: 120
Fibonacci (7 terms): 0 1 1 2 3 5 8 
GCD(12, 18): 6
LCM(12, 18): 36
```

## Exception Handling

Java uses exceptions to handle errors and unusual conditions. The core constructs are `try`, `catch`, `finally`, and `throw`.

* **`try`/`catch`/`finally`:** Wrap code that may throw exceptions in a `try` block. Use one or more `catch` blocks to handle specific exceptions, and an optional `finally` block for cleanup.
* **Checked vs Unchecked:** Checked exceptions (subclasses of `Exception` excluding `RuntimeException`) must be caught or declared. Unchecked (runtime) exceptions do not require declaration.
* **`throws`:** A method can declare it may throw exceptions using `throws` in its signature. For example:

  ```java
  public void riskyIO() throws IOException {
      // code that may throw IOException
  }
  ```

  The `throws` clause lists checked exceptions the method may propagate.
* **`throw`:** To throw an exception explicitly, use `throw`. You can throw new exceptions or rethrow caught ones. Example:

  ```java
  if (x < 0) {
      throw new IllegalArgumentException("Negative value");
  }
  ```

  As Oracle shows, *“The `throw` statement requires a throwable object... e.g. `throw new EmptyStackException();`.”*.
* **Custom Exceptions:** You can define your own exception classes by extending `Exception` (or `RuntimeException`). By convention, name them ending in `Exception`. For example:

  ```java
  class MyException extends Exception {
      public MyException(String msg) { super(msg); }
  }
  ```

  Then methods can `throw new MyException("error")` and callers can `catch (MyException e) { ... }`.

**Example of try-catch-finally and custom exception:**

```java
// Example with try-catch-finally
try {
    int result = 10 / 0;  // throws ArithmeticException
    System.out.println(result);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero: " + e.getMessage());
} finally {
    System.out.println("Finally block always executes.");
}

// Example with throws and custom exception
class MyException extends Exception {
    public MyException(String msg) { super(msg); }
}
public static void check(int x) throws MyException {
    if (x < 0) throw new MyException("Negative value: " + x);
}
try {
    check(-5);
} catch (MyException e) {
    System.out.println("Caught custom exception: " + e.getMessage());
}
```

Java’s exception handling provides a structured way to deal with errors without cluttering logic. As Oracle notes, use `try-catch-finally` blocks to write handlers, and apply `throws` to propagate exceptions.

---
---

## File I/O

Java’s I/O libraries allow reading from and writing to files, streams, etc. Key classes include:

* **`java.io.File`:** Represents file or directory pathnames. You can check existence, list directory contents, get file attributes, etc.
* **Reading text:** Common approaches:

  * `Scanner`: easily read tokens or lines. E.g. `Scanner sc = new Scanner(new File("input.txt")); while(sc.hasNextLine()) System.out.println(sc.nextLine());`.
  * `BufferedReader` with `FileReader` or `InputStreamReader`: efficient line-by-line reading.
* **Writing text:**

  * `FileWriter` or `PrintWriter`: write characters to files. For example, `PrintWriter out = new PrintWriter(new FileWriter("out.txt")); out.println("Hello"); out.close();`.
* **Binary I/O:** Classes like `FileInputStream`/`FileOutputStream`, `BufferedInputStream`/`BufferedOutputStream` for bytes.
* **NIO (Java 7+):** `java.nio.file.Files` for convenience (e.g. `Files.readAllLines(Path)`).

Example: writing to and reading from a file:

```java
import java.io.*;
import java.util.*;

// Write to a file
try (FileWriter fw = new FileWriter("test.txt")) {
    fw.write("Line 1\nLine 2\n");
} catch (IOException e) {
    e.printStackTrace();
}

// Read from the file
try (Scanner sc = new Scanner(new File("test.txt"))) {
    while (sc.hasNextLine()) {
        String line = sc.nextLine();
        System.out.println("Read: " + line);
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
}
```

Here, `FileWriter` and `Scanner` are used. The `File` class (or `Path` in NIO) identifies the file on disk. According to Oracle: *“File class is a representation of a file or directory pathname.”*. Remember to handle `IOException` (checked exception) when doing file operations. Using try-with-resources (as above) ensures files are closed automatically.

---
Packages and managing 

---

## Java 8+ Features (Lambdas, Streams, Functional Interfaces)

Java 8 introduced **lambda expressions**, the **Stream API**, and functional interfaces, enabling functional-style programming.

* **Lambda Expressions:** Provide a concise syntax for implementing single-method interfaces (functional interfaces). Example: `(x, y) -> x + y` is a lambda that takes two arguments. Lambdas let you pass behavior as data. For instance:

  ```java
  List<Integer> nums = Arrays.asList(1, 2, 3);
  nums.forEach(n -> System.out.println(n)); 
  // prints 1 2 3
  ```

  Internally, `n -> System.out.println(n)` is an implementation of the `Consumer<Integer>` functional interface. As Oracle explains, lambda expressions *“let you express instances of single-method classes more compactly”*. A functional interface is any interface with one abstract method (e.g. `Runnable`, `Callable`, `Predicate`, `Function` in `java.util.function`).
* **Standard Functional Interfaces:** Java provides many ready-made functional interfaces in `java.util.function`, such as `Predicate<T>` (takes T, returns boolean), `Function<T,R>` (takes T, returns R), `Consumer<T>` (takes T, returns void), etc. You often use these with lambdas (e.g. `Predicate<String> isEmpty = s -> s.isEmpty();`).
* **Streams API:** The `java.util.stream.Stream` API enables processing collections in a pipeline of operations. A stream pipeline consists of zero or more **intermediate operations** (like `filter`, `map`, `sorted`) and a **terminal operation** (like `collect`, `forEach`, `sum`). Streams can be sequential or parallel and provide high-level, declarative data processing. For example:

  ```java
  List<String> names = Arrays.asList("Bob", "Alice", "Eve");
  List<String> longNames = 
      names.stream()
           .filter(s -> s.length() > 3)  // intermediate
           .map(String::toUpperCase)     // intermediate
           .collect(Collectors.toList()); // terminal
  System.out.println(longNames);  // [ALICE]
  ```

  Here `filter` uses a lambda to keep strings longer than 3 characters, `map` converts to uppercase (using a method reference), and `collect` gathers results into a list. Oracle notes that with Java 8, *“a stream supports many operations such as `filter`, `map`, `reduce`, ... to write concise and expressive data processing queries.”*.

Java 8 and beyond also introduced other features (default methods in interfaces, Optional, new date-time API, etc.), but lambdas and streams are the most transformative for core language.

---
---

# oops


### 1️⃣ **Class**

### 2️⃣ **Object**

### in hava every class extends object class

### ✅ Why `String[] args` in `main()`? (in 5 points)

1. **Entry Point**:
   JVM looks for `public static void main(String[] args)` as the starting point of your program.

2. **Command-Line Arguments**:
   `args` captures the inputs you pass from the terminal when running the program.

3. **Type is String Array**:
   Everything from the command line is passed as strings:
   `java MyApp one two` → becomes → `args[0]="one"`, `args[1]="two"`

4. **Static Required**:
   `main()` is `static` so JVM can call it **without creating an object** of the class.

5. **public & void**:

   * `public`: So JVM can access it
   * `void`: It returns nothing to JVM

---

### 🧪 Code Example

```java
public class Demo {
    public static void main(String[] args) {
        System.out.println("Total arguments: " + args.length);
        for (int i = 0; i < args.length; i++) {
            System.out.println("Arg " + i + ": " + args[i]);
        }
    }
}
```

### ▶️ Command to Run

```bash
javac Demo.java
java Demo Hello 123 Test
```

### 🖨️ Output

```
Total arguments: 3
Arg 0: Hello
Arg 1: 123
Arg 2: Test
```

```java
class Example {
    // Instance variable (belongs to each object)
    int instanceVar = 10;

    // Static variable (shared by all objects)
    static int staticVar = 20;

    // Constructor (runs when object is created)
    public Example() {
        System.out.println("Constructor called");
    }

    // Instance method (can access instance and static variables)
    public void instanceMethod() {
        System.out.println("Instance Method");
        System.out.println("instanceVar = " + instanceVar);
        System.out.println("staticVar = " + staticVar);
    }

    // Static method (can access only static variables directly)
    public static void staticMethod() {
        System.out.println("Static Method");
        // System.out.println("instanceVar = " + instanceVar); // ❌ Not allowed
        System.out.println("staticVar = " + staticVar);
    }

    // Local variable (inside method)
    public void showLocalVar() {
        int localVar = 5; // local variable
        System.out.println("Local variable = " + localVar);
    }

    // Parameter variable
    public void showParameterVar(int paramVar) {
        System.out.println("Parameter variable = " + paramVar);
    }
}

// Usage
Example obj1 = new Example();
obj1.instanceMethod();      // Instance method
Example.staticMethod();     // Static method
obj1.showLocalVar();        // Local variable
obj1.showParameterVar(99);  // Parameter variable

// Accessing variables
System.out.println("obj1.instanceVar = " + obj1.instanceVar); // Instance variable
System.out.println("Example.staticVar = " + Example.staticVar); // Static variable
```
```output
Constructor called
Instance Method
instanceVar = 10
staticVar = 20
Static Method
staticVar = 20
Local variable = 5
Parameter variable = 99
obj1.instanceVar = 10
Example.staticVar = 20
```

```java
// Array of Objects Example with toString()

class Student {
    String name;
    int age;

    // Constructor
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Override toString() for readable output
    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}

// Create an array of Student objects
Student[] students = new Student[3];
students[0] = new Student("Alice", 20);
students[1] = new Student("Bob", 22);
students[2] = new Student("Charlie", 19);

// Print all students using toString()
for (Student s : students) {
    System.out.println(s); // calls s.toString()
}
```
```output
Student{name='Alice', age=20}
Student{name='Bob', age=22}
Student{name='Charlie', age=19}
```

### 3️⃣ **Variables in OOP**
| Type              | Description                                          | Example                         |
|-------------------|------------------------------------------------------|----------------------------------|
| **Instance**      | Belongs to each object                               | `String name;`                  |
| **Static**        | Shared by all instances (class-level)                | `static int count;`             |
| **Local**         | Defined inside a method                              | `int temp = 0;`                 |
| **Parameter**     | Passed into methods                                  | `void setName(String name)`     |

---

### 4️⃣ **Methods in OOP**
| Type           | Description                              | Example                              |
|----------------|------------------------------------------|--------------------------------------|
| **Instance**   | Belongs to object                        | `c.drive();`                         |
| **Static**     | Belongs to class                         | `Math.sqrt(9)`                       |
| **Constructor**| Initializes object                       | `new Car()`                          |
| **Overloaded** | Same method name, different parameters   | `void add(int a), add(double a)`     |

---

# by default java gives us constructor

```java
class Person {
    String name;

    // Constructor: called when object is created
    public Person(String name) {
        this.name = name;
        System.out.println("Constructor called for " + name);
    }

    // Destructor (finalizer): called by GC before object is destroyed (not deterministic)
    @Override
    protected void finalize() throws Throwable {
        System.out.println("Destructor called for " + name);
        super.finalize();
    }
}

Person p = new Person("Alice");

// To suggest garbage collection (not guaranteed/designed for production use)
p = null;
System.gc(); // May trigger finalize(), but not immediately or reliably
```
```output
Constructor called for Alice
Destructor called for Alice
```

### multiple inheritance:
-  is not suppported in java directly because it can lead to ambiguity which means that if a class inherits from two classes that have methods with the same name, it can be unclear which method should be called.but in python it is supported because it uses a method resolution order (MRO) to determine the order in which methods are inherited.
- However, Java supports multiple inheritance through interfaces.

```java
// single inheritance
class Computer {
    String brand; //instance variable
    
    public void displayBrand() {
        System.out.println("Brand: " + brand);
    }
}
class Laptop extends Computer {
    int batteryLife;
    
    public void displayBatteryLife() {
        System.out.println("Battery Life: " + batteryLife + " hours");
    }
}
 
Laptop myLaptop = new Laptop();
myLaptop.brand = "Dell";
myLaptop.batteryLife = 10;

myLaptop.displayBrand();
myLaptop.displayBatteryLife();

// multi-level inheritance
class Animal {
    public void eat() {
        System.out.println("Animal is eating");
    }
}
class Dog extends Animal {
    public void bark() {
        System.out.println("Dog is barking");
    }
}
class Puppy extends Dog {
    public void weep() {
        System.out.println("Puppy is weeping");
    }
}
 
Puppy myPuppy = new Puppy();
myPuppy.eat();  // inherited from Animal
myPuppy.bark(); // inherited from Dog
myPuppy.weep(); // own method

// hierarchical inheritance
class Vehicle {
    public void start() {
        System.out.println("Vehicle is starting");
    }
}
class Car extends Vehicle {
    public void drive() {
        System.out.println("Car is driving");
    }
}
class Bike extends Vehicle {
    public void ride() {
        System.out.println("Bike is riding");
    }
}

Car myCar = new Car();
myCar.start(); // inherited from Vehicle
myCar.drive(); // own method

Bike myBike = new Bike();
myBike.start(); // inherited from Vehicle
myBike.ride();  // own method


interface Animal {
    void sound();
}
interface Pet {
    void sound();
}
class Dog implements Animal, Pet {
    // Only one implementation needed, as both interfaces have the same method signature
    public void sound() {
        System.out.println("Dog makes a sound");
    }
}
Dog myDog = new Dog();
myDog.sound(); // Calls the single implementation for both interfaces
```
```output
Brand: Dell
Battery Life: 10 hours
Animal is eating
Dog is barking
Puppy is weeping
Vehicle is starting
Car is driving
Vehicle is starting
Bike is riding
Dog makes a sound
```

### ✅ Polymorphism in Java

**Polymorphism** is one of the four pillars of Object-Oriented Programming (OOP) in Java (alongside **Encapsulation**, **Inheritance**, and **Abstraction**). It allows objects to take **many forms** — the same method or behavior can perform **differently based on the object** that is calling it.


### 🔸 Types of Polymorphism in Java

| Type                      | Description                                     | Achieved By            |
| ------------------------- | ----------------------------------------------- | ---------------------- |
| **Compile-Time (Static)** | Method call is resolved during **compile time** | **Method Overloading** |
| **Runtime (Dynamic)**     | Method call is resolved during **runtime**      | **Method Overriding**  |



## 🔹 1. Compile-Time Polymorphism (Method Overloading no operator overloading)

**Method Overloading** means defining multiple methods in the same class with the same name but different parameters (number, type, or order).

### ✅ Example:

```java
class MathOperations {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

| Feature              | Java               | Python / C++                                    |
| -------------------- | ------------------ | ----------------------------------------------- |
| Operator overloading | ❌ Not allowed      | ✅ Supported                                     |
| Object + Object      | ❌ Error            | ✅ Can override `+`                              |
| Alternative in Java  | Use `add()` method | Use `__add__()` in Python or `operator+` in C++ |


Usage:

```java
MathOperations m = new MathOperations();
System.out.println(m.add(2, 3));        // Calls int add(int, int)
System.out.println(m.add(2.5, 3.5));    // Calls double add(double, double)
System.out.println(m.add(1, 2, 3));     // Calls int add(int, int, int)
```


## 🔹 2. Runtime Polymorphism (Method Overriding)

**Method Overriding** happens when a subclass provides a specific implementation of a method already defined in its superclass.

### ✅ Example:

```java
class Animal {
    void sound() {
        System.out.println("Some animal sound");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Bark");
    }
}

class Cat extends Animal {
    void sound() {
        System.out.println("Meow");
    }
}
```

Usage:

```java
Animal a;
a = new Dog();
a.sound();  // Output: Bark

a = new Cat();
a.sound();  // Output: Meow
```

Even though the reference type is `Animal`, the actual method executed depends on the object (`Dog`, `Cat`) — this is **runtime polymorphism**.


### 🔸 Why Use Polymorphism?

* Code reusability
* Better readability
* Flexibility and scalability
* Supports **loose coupling** in design

| **Feature**                      | **Java**                               | **Python**                            | **JavaScript**                          |
| -------------------------------- | -------------------------------------- | ------------------------------------- | --------------------------------------- |
| **Typing**                       | Statically typed                       | Dynamically typed                     | Dynamically typed                       |
| **Runtime Polymorphism**         | ✅ Yes (via method overriding)          | ✅ Yes (duck typing, overriding)       | ✅ Yes (duck typing, overriding)         |
| **Compile-time Polymorphism**    | ✅ Yes (method overloading)             | 🚫 No (simulated only)                | 🚫 No (simulated only)                  |
| **Method Overriding**            | ✅ Yes (subclass overrides superclass)  | ✅ Yes                                 | ✅ Yes                                   |
| **Method Overloading**           | ✅ Yes (based on parameter types)       | ⚠️ Simulated (with `*args`, defaults) | ⚠️ Simulated (with `...args`, defaults) |
| **Operator Overloading**         | ❌ No                                   | ✅ Yes (magic methods like `__add__`)  | ❌ No                                    |
| **Duck Typing**                  | ❌ No (type must match)                 | ✅ Yes ("If it walks like a duck...")  | ✅ Yes                                   |
| **Function Dispatch**            | ⚠️ No (manual overloading or patterns) | ✅ Yes (`@singledispatch`, etc.)       | ⚠️ No (manual via `if/else`)            |
| **Multiple Inheritance**         | ❌ No (via classes), ✅ via interfaces   | ✅ Yes (uses MRO to resolve conflicts) | ❌ No (simulated via mixins)             |
| **Interface-based Polymorphism** | ✅ Yes (via `implements`)               | ⚠️ Possible (via duck typing or ABCs) | ⚠️ Possible (dynamic + prototype chain) |

```java
// Abstraction Example in Java

// Abstract class: cannot be instantiated, may have abstract (no body) and concrete methods
abstract class Vehicle {
    String brand;

    // Abstract method (no body): must be implemented by subclasses
    abstract void start();

    // Concrete method: has implementation, can be inherited
    void showBrand() {
        System.out.println("Brand: " + brand);
    }
}

// Concrete subclass: must implement all abstract methods
class Car extends Vehicle {
    int wheels = 4;

    // Implementing abstract method
    @Override
    void start() {
        System.out.println("Car started with key ignition.");
    }

    void showWheels() {
        System.out.println("Wheels: " + wheels);
    }
}

// Another subclass
class ElectricScooter extends Vehicle {
    int batteryLevel = 100;

    @Override
    void start() {
        System.out.println("Electric Scooter started with button.");
    }

    void showBattery() {
        System.out.println("Battery Level: " + batteryLevel + "%");
    }
}

Vehicle myCar = new Car(); // generally object creation is like classname objectName = new ClassName() but for abstraction, we done like absctact className objectName = new ClassName();
// Using abstract class reference
myCar.brand = "Toyota";
myCar.showBrand();
myCar.start();
// myCar.showWheels(); // Not allowed: reference is Vehicle type

Car realCar = new Car();
realCar.brand = "Honda";
realCar.showBrand();
realCar.start();
realCar.showWheels(); // Allowed: reference is Car type

Vehicle myScooter = new ElectricScooter();
myScooter.brand = "Xiaomi";
myScooter.showBrand();
myScooter.start();
// myScooter.showBattery(); // Not allowed: reference is Vehicle type

ElectricScooter scooter = new ElectricScooter();
scooter.brand = "Ola";
scooter.showBrand();
scooter.start();
scooter.showBattery();



/*
Sure ra! Here's a **simple 3-line explanation**:

1. In abstraction, we define a **general template** (like `Vehicle`) with common methods (`start()`).
2. When we use an **abstract class reference**, we can only call the methods defined in that abstract class — not subclass-specific ones.
3. This hides internal details and shows only **essential features**, which is the **main concept of abstraction**.
4. we cann't create an object of an abstract class directly, but we can create objects of its subclasses that implement the abstract methods.

 

Abstraction:
- Hides implementation details (e.g., how start() works) and exposes only essential features.
- Abstract class can have both abstract and concrete methods.
- You cannot create an object of an abstract class. -------------- imp------------------------------------
- Subclasses must implement all abstract methods.
- Promotes code reusability and flexibility.
*/
```
```output
Brand: Toyota
Car started with key ignition.
Brand: Honda
Car started with key ignition.
Wheels: 4
Brand: Xiaomi
Electric Scooter started with button.
Brand: Ola
Electric Scooter started with button.
Battery Level: 100%
```

- **Abstraction** is a concept that hides implementation details and shows only the essential features.
- **Interface** is one way to achieve abstraction in Java by defining a contract with abstract methods.

### abstraction vs interface:

- 🧠 Abstract Class = "Some methods are common; others you must define."

- 🔌 Interface = "You must define all these methods. I don't care how."

```java
// Interface Example in Java

// Interface: defines a contract with abstract methods (no implementation)
interface Device {
    void turnOn();  // Abstract method: must be implemented
    void turnOff();
}

// Implementing class: must implement all methods from the interface
class Laptop implements Device {
    String brand = "Dell";

    @Override
    public void turnOn() {
        System.out.println("Laptop turning on...");
    }

    @Override
    public void turnOff() {
        System.out.println("Laptop shutting down...");
    }

    void showBrand() {
        System.out.println("Brand: " + brand);
    }
}

// Another class implementing the same interface
class SmartTV implements Device {
    int screenSize = 55;

    @Override
    public void turnOn() {
        System.out.println("SmartTV booting up...");
    }

    @Override
    public void turnOff() {
        System.out.println("SmartTV powering down...");
    }

    void showSize() {
        System.out.println("Screen Size: " + screenSize + " inches");
    }
}

// Using interface reference
Device dev1 = new Laptop();
dev1.turnOn();
dev1.turnOff();
// dev1.showBrand(); // ❌ Not allowed: reference is of interface type

Laptop myLaptop = new Laptop();
myLaptop.turnOn();
myLaptop.showBrand(); // ✅ Allowed: reference is of concrete class

Device dev2 = new SmartTV();
dev2.turnOn();
dev2.turnOff();
// dev2.showSize(); // ❌ Not allowed

SmartTV tv = new SmartTV();
tv.turnOn();
tv.showSize(); // ✅ Allowed
```
```output
Laptop turning on...
Laptop shutting down...
Laptop turning on...
Brand: Dell
SmartTV booting up...
SmartTV powering down...
SmartTV booting up...
Screen Size: 55 inches
```

```java
// Encapsulation Example with all access modifiers

class BankAccount {
    // Private field (only accessible within this class)
    private String accountNumber;

    // Public field (accessible from anywhere)
    public String accountHolder;

    // Protected field (accessible in this class, subclasses, and same package)
    protected double balance;

    // Default/package-private field (accessible in same package)
    String branchName;

    // Public constructor
    public BankAccount(String accountNumber, String accountHolder, double balance, String branchName) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
        this.branchName = branchName;
    }
    

    // Private method (only within this class)
    private void showPrivateInfo() {
        System.out.println("Private Info: " + accountNumber);
    }

    // Public method (accessible from anywhere)
    public String getAccountNumber() {
        showPrivateInfo(); // can call private method internally
        return accountNumber;
    }

    // Protected method (accessible in subclasses and same package)
    protected void showProtectedInfo() {
        System.out.println("Protected Info: Balance = " + balance);
    }

    // Default/package-private method (accessible in same package)
    void showBranch() {
        System.out.println("Branch: " + branchName);
    }

    // Public getter and setter for accountHolder
    public String getAccountHolder() {
        return accountHolder;
    }
    public void setAccountHolder(String accountHolder) {
        this.accountHolder = accountHolder;
    }

    // Public getter for balance (read-only)
    public double getBalance() {
        return balance;
    }

    // Public method to deposit money (with validation)
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: " + amount);
        } else {
            System.out.println("Invalid deposit amount!");
        }
    }

    // Public method to withdraw money (with validation)
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount);
        } else {
            System.out.println("Invalid or insufficient funds!");
        }
    }
}

// Usage example
BankAccount acc = new BankAccount("123456", "Alice", 1000.0, "Main Branch");

// Accessing data via getters/setters (not directly)
System.out.println("Account Number: " + acc.getAccountNumber());
System.out.println("Account Holder: " + acc.getAccountHolder());
System.out.println("Balance: " + acc.getBalance());
System.out.println("Branch: " + acc.branchName); // public/package-private field

acc.deposit(500.0);
acc.withdraw(200.0);
acc.setAccountHolder("Alice Smith");
System.out.println("Updated Account Holder: " + acc.getAccountHolder());
System.out.println("Final Balance: " + acc.getBalance());

// Accessing protected and package-private methods
acc.showProtectedInfo();
acc.showBranch();

// Trying to access private fields/methods directly (will cause error if uncommented)
// System.out.println(acc.accountNumber); // ❌ Not allowed
// acc.showPrivateInfo(); // ❌ Not allowed
```
```output
Private Info: 123456
Account Number: 123456
Account Holder: Alice
Balance: 1000.0
Branch: Main Branch
Deposited: 500.0
Withdrawn: 200.0
Updated Account Holder: Alice Smith
Final Balance: 1300.0
Protected Info: Balance = 1300.0
Branch: Main Branch
```

---
---

---

## ⚙️ Multitasking in Java
Java supports multitasking via **multiprocessing** and **multithreading**.

### 🔁 1. **Multiprocessing**
- Uses **multiple processes** running independently.
- Each process has its own memory space.
- In Java, typically achieved via:
  - External processes using `ProcessBuilder`
  - Parallel JVM instances or external tools
- Less common in day-to-day Java apps than multithreading.

### 🔀 2. **Multithreading**
- Allows multiple tasks to run **concurrently** in the **same process**.

#### ✅ Ways to Create a Thread:

1. **Implement Runnable Interface**
```java
class HelloRunnable implements Runnable {
    public void run() {
        System.out.println("Hello from a thread!");
    }
}
new Thread(new HelloRunnable()).start();
```

2. **Extend Thread Class**
```java
class HelloThread extends Thread {
    public void run() {
        System.out.println("Hello from a thread!");
    }
}
new HelloThread().start();
```

#### ✅ Using Lambda with Runnable
```java
Runnable task = () -> System.out.println("Runnable running");
new Thread(task).start();
```

#### ✅ Using ExecutorService (Advanced)
```java
import java.util.concurrent.*;
ExecutorService exec = Executors.newFixedThreadPool(2);
exec.submit(() -> System.out.println("Task 1 running"));
exec.submit(() -> System.out.println("Task 2 running"));
exec.shutdown();
```

- `ExecutorService` handles thread pools and task scheduling.
- Great for scalable concurrent apps.

---

Let me know if you want **thread lifecycle**, synchronization, or producer-consumer added!

---
---

## Java Memory Model (Stack, Heap, Garbage Collection)

Java manages memory automatically. Important points:

* **Heap:** All objects (created via `new`) reside on the heap. The JVM allocates a heap at startup and may grow/shrink it as needed. When the heap is full, the garbage collector frees memory by reclaiming unreachable objects.
* **Stack:** Each thread has its own stack for method calls and local variables (primitives and object references). Stack frames are created on method entry and discarded on exit. Unlike the heap, stacks are thread-local and do not need GC.
* **Garbage Collection:** Java automatically performs garbage collection (GC) to reclaim memory of objects no longer in use. The JVM **traces reachability** from references in stacks, registers, and static fields to determine which objects are still needed; unreferenced objects are collected. You cannot explicitly free memory.
* **Other areas:** Method code (bytecode), static variables, and JVM metadata reside in separate memory areas (e.g., method area, metaspace).

As noted by Oracle, *“Java objects reside in an area called the heap...When the heap becomes full, garbage is collected. ... Java methods, thread stacks and native handles are allocated in memory separate from the heap”*. In practice, this means you usually don’t worry about deallocating objects; the GC does it for you. However, you should avoid memory leaks by dropping references to unused objects.

**Summary:** Java’s memory model separates stack (thread-local) and heap (shared), with automated garbage collection on the heap. Understanding this helps when optimizing performance (e.g. avoiding unnecessary object creation, using primitives vs objects) and debugging memory issues.

---
---

```java
System.out.println("Hello, World!");
```
```output
Hello, World!
```
