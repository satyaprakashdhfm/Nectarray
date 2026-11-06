# Magic:
```javascript
var firstPalindrome = function(words) {
    let ans = words.find( string => string.split('').reverse().join('') === string );
    return ans!=undefined ? ans:""
};



```

---

- **JavaScript Object Creation Methods:**
    - **1. Object Literal**
    ```javascript
    const obj = { name: "John", age: 30 };
    ```

    - **2. Constructor Function**
    ```javascript
    function Person(name) { this.name = name; }
    const obj = new Person("John");
    ```

    - **3. Object.create()**
    ```javascript
    const obj = Object.create(prototype);
    ```

    - **4. Class Constructor**
    ```javascript
    class Person { constructor(name) { this.name = name; } }
    const obj = new Person("John");
    ```

    - **5. Factory Function**
    ```javascript
    function createPerson(name) { return { name }; }
    const obj = createPerson("John");
    ```

    - **6. new Object()**
    ```javascript
    const obj = new Object(); obj.name = "John";
    ```
- JS block scope vs function scope vs global scope.
    ```javascript
    // 🌍 Global Scope
    var globalVar = "🌍 Global var";
    let globalLet = "🌍 Global let";
    const globalConst = "🌍 Global const";

    console.log(globalVar);   // ✅ Global
    console.log(globalLet);   // ✅ Global
    console.log(globalConst); // ✅ Global

    function exampleFunction() {
    // 📦 Function Scope (applies to var)
    var functionVar = "📦 Function var";

    if (true) {
        // 🔒 Block Scope (let & const)
        let blockLet = "🔒 Block let";
        const blockConst = "🔒 Block const";

        // var here is still function scoped
        var blockVar = "⚠️ Block var using var";

        console.log(functionVar);  // ✅ Accessible
        console.log(blockLet);     // ✅ Accessible
        console.log(blockConst);   // ✅ Accessible
        console.log(blockVar);     // ✅ Accessible
    }

    console.log(functionVar);  // ✅ Accessible
    // console.log(blockLet);  // ❌ ReferenceError
    // console.log(blockConst);// ❌ ReferenceError
    console.log(blockVar);     // ✅ Accessible — var "leaks" out of block
    }

    exampleFunction();

    // console.log(functionVar);   // ❌ ReferenceError
    // console.log(blockLet);      // ❌ ReferenceError
    // console.log(blockVar);      // ❌ ReferenceError
    ```
- JS uses type coercion, so names converted to a boolean is always true.
    - names array is always truthy: Arrays in JavaScript are objects, and all objects (including empty arrays) are truthy values. So while (names) will always be true.

- null vs undefined vs NaN vs Infinity : 

| Value | Meaning | Type | Use Case |
|-------|---------|------|----------|
| `null` | Intentional "nothing" | `object` | Reset/clear values |
| `undefined` | Accidental "missing" | `undefined` | Default state of uninitialized variable |
| `NaN` | Invalid math result | `number` | Math errors |
| `Infinity` | Value beyond limits | `number` | Division by zero, overflow |

- let vs const vs var :

| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| **Scope** | Function/Global | Block | Block |
| **Hoisting** | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| **Redeclaration** | Allowed | Not allowed | Not allowed |
| **Reassignment** | Allowed | Allowed | Not allowed |
| **Initialization** | Optional | Optional | Required |
| **Temporal Dead Zone** | No | Yes | Yes |

- return in java vs python:
    - **Java**: Compiler requires explicit `return` statements for ALL possible code paths - even unreachable ones after loops - due to strict compile-time checking.
    - **Python**: Automatically returns `None` if no explicit return is reached, so no extra return statements needed after loops.

- global this. vs object this.

   -  **Regular functions**: `this` changes based on **how** the function is called (object, global, etc.)

   -  **Arrow functions**: `this` is **fixed** - always uses `this` from where the arrow function was **defined** (lexical binding)

    - **Problem**: Arrow functions in object methods use global `this`, not the object's `this`

    - **Solution**: Use regular functions for object methods, arrow functions for callbacks to preserve outer `this`

- not changing const variable ref but changing content in it okay fine.
- spreac vs rest operator:
    - **Spread:** Takes array apart into individual elements for function calls, array literals, etc.
    ```javascript
    Math.max(...[1,5,3]); // Same as Math.max(1,5,3) = 5
    ```

    - **Rest:** Collects remaining elements into an array during destructuring or function parameters
    ```javascript
    const [first, ...remaining] = [1,2,3,4]; // first=1, remaining=[2,3,4]
    ```

- Desstructering:
    - Array Destructuring : **Definition:** Extract values from arrays into variables based on position/index
    ```javascript
    const [first, second, , fourth] = [1, 2, 3, 4]; // first=1, second=2, fourth=4 (skip 3rd)
    ```

    - Object Destructuring: **Definition:** Extract properties from objects into variables with matching property names
    ```javascript
    const {name, age, city} = {name: 'John', age: 30, city: 'NYC', job: 'Dev'}; // extracts specific props
    ```

    - String Destructuring: **Definition:** Treat strings as arrays and extract characters by position
    ```javascript
    const [first, second, ...rest] = "Hello"; // first='H', second='e', rest=['l','l','o']
    ```

    - Nested Array Destructuring: **Definition:** Extract values from multi-dimensional arrays in one assignment
    ```javascript
    const [[a, b], [c, d]] = [[1, 2], [3, 4]]; // a=1, b=2, c=3, d=4
    ```

    - Nested Object Destructuring : **Definition:** Extract properties from nested objects directly
    ```javascript
    const {user: {name, profile: {age}}} = {user: {name: 'Alice', profile: {age: 25}}}; // name='Alice', age=25
    ```

    - Mixed Array-Object Destructuring: **Definition:** Destructure arrays containing objects or objects containing arrays
    ```javascript
    const [, {name, skills: [skill1]}] = [123, {name: 'Bob', skills: ['JS', 'React']}]; // name='Bob', skill1='JS'
    ```
- cookies vs localstorage vs sessionstorage:
    **Cookies:**
    - Small text files sent between client and server with every HTTP request
    - Limited to 4KB storage, have expiration dates, and are automatically included in requests
    - `document.cookie = "username=john; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";`

    **localStorage:**
    - Browser storage that persists data until explicitly cleared by user or code
    - Can store up to 5-10MB, stays across browser sessions, and is domain-specific
    - `localStorage.setItem("username", "john"); // Persists until manually cleared`

    **sessionStorage:**
    - Temporary browser storage that clears when the browser tab/window closes
    - Same storage capacity as localStorage but limited to current session only
    - ` sessionStorage.setItem("tempData", "value"); // Clears when tab closes`
- .call vs .apply :
    - .call:
    Accepts arguments as a comma-separated list.

    - .apply:
    Accepts arguments as an array.

- printing ways:
    - console.log("name: " + name)
    - console.log(\`name${name}\`)
- Function.prototype.bind:  creates a new function with a specific `this` context and optionally pre-filled arguments. It's useful for setting the context when passing methods as callbacks or creating partially applied functions.The bound function maintains the specified `this` value regardless of how it's called, making it perfect for event handlers and callback scenarios where context would otherwise be lost.

    ```javascript
    const person = { name: 'Alice' };
    function greet(greeting) { return `${greeting}, ${this.name}!`; }

    console.log(greet('Hi')); // "Hi, undefined!" - no context
    const boundGreet = greet.bind(person, 'Hello');
    console.log(boundGreet()); // "Hello, Alice!" - bound context
    ```
- Arrow functions in constructors:  keep `this` pointing to the object being created, even when the method is called from somewhere else.
    - In scenarios like React class components, where methods are passed as props and need to retain their original this context.

    ```javascript
    function Person(name) {
    this.name = name;
    
    // Regular function - 'this' can change
    this.regularMethod = function() {
        console.log(this.name);
    };
    
    // Arrow function - 'this' stays the same
    this.arrowMethod = () => {
        console.log(this.name);
    };
    }

    const john = new Person('John');
    const dave = new Person('Dave');

    // Both work normally
    john.regularMethod(); // "John"
    john.arrowMethod();   // "John"

    // When called with different context
    john.regularMethod.call(dave); // "Dave" (this changed)
    john.arrowMethod.call(dave);   // "John" (this stayed same)
    ```
- **One-line Definitions:**
    - `XMLHttpRequest`: Legacy callback-based API for HTTP requests with event-driven architecture
    - `fetch()`: Modern Promise-based API for HTTP requests with cleaner syntax and functional design

    | Feature | XMLHttpRequest | fetch() |
    |---------|----------------|---------|
    | **Syntax** | Callback-based, event-driven | Promise-based, async/await friendly |
    | **Error Handling** | Throws errors for HTTP status codes | Only rejects on network failures |
    | **Response Parsing** | Automatic based on responseType | Manual using .json(), .text(), etc. |
    | **Browser Support** | Universal (including IE) | Modern browsers (IE needs polyfill) |
    | **Code Complexity** | Verbose, imperative style | Concise, functional style |

- JavaScript Asynchronous Programming Guide-Single-Threaded Nature: 
    - No, it's not a bug - it's an **intentional JavaScript feature** that lets you control what `this` refers to in functions.

    - JavaScript is single-threaded but achieves asynchronous behavior through the Event Loop - this is Node.js's most famous feature.

    - Core Async Mechanism

    - Event Loop (The Heart of Async)
    - Orchestrates all async operations
    - Manages Call Stack, Task Queues, and Microtasks
    - Keeps the thread non-blocking

    - Async Task Sources

        | Tool | Purpose | Returns | Example |
        |------|---------|---------|---------|
        | setTimeout() | Timer scheduling | Timer ID | setTimeout(fn, 1000) |
        | fetch() | HTTP requests | Promise | fetch('/api/data') |
        | Promises | Async abstraction | Promise | new Promise(resolve => ...) |
        | async/await | Promise syntax sugar | Promise | await fetchData() |
        | DOM Events | User interactions | Event object | click, scroll |

    - Execution Queues (Priority Order)

        1. Call Stack → Current executing code (highest priority)
        2. Microtask Queue → Promises, async/await (high priority)  
        3. Callback Queue → Timers, DOM events (lower priority)

    - Key Concepts

    - Callback
        ```javascript
        // callback = function passed as parameter
        const fetchData = (callback) => {
            setTimeout(() => callback('Data loaded!'), 1000);
        };

        fetchData((result) => console.log(result)); // Runs after 1 second
        ```

    - Promise
        ```javascript
        // Represents eventual result of async operation
        fetchData()
            .then(result => console.log(result))    // Success
            .catch(error => console.log(error));    // Error
        ```

    - Event Delegation (Pattern)
        ```javascript
        // Efficient event handling for dynamic elements
        document.body.addEventListener("click", (e) => {
            if (e.target.matches(".btn")) {
                console.log("Button clicked!");
            }
        });
        ```
    - What Is Event Bubbling?
        - Event bubbling is when an event starts at the target element and propagates up through its ancestors.
        ```javascript
        parent.addEventListener('click', () => console.log('Parent clicked'));
        child.addEventListener('click', () => console.log('Child clicked'));
        ```
        - Clicking the child triggers both handlers.
     -What Is Event Capturing?
        - Event capturing is when an event starts at the root and propagates down to the target element.
        - Enabling Capturing:
            `parent.addEventListener('click', () => console.log('Parent capturing'), true);`
    - Quick Reference

        - 1000 milliseconds = 1 second
        - Callback = function passed as argument (not a keyword)
        - Event Loop vs Event Delegation: Loop = async engine, Delegation = DOM pattern
        - All async tasks eventually handled by the Event Loop

- PrototypeInheritence: Every object in JavaScript has a hidden link to another object called its **prototype**. When you try to access a property/method, JavaScript first looks on the object itself, then on its prototype, then the prototype's prototype, and so on.
    - **The Chain:** `myDog` → `Dog.prototype` → `Animal.prototype` → `Object.prototype` → `null`
    - JavaScript climbs this chain until it finds the method or reaches the end.
    ```javascript
    // Parent constructor
    function Animal(name) {
    this.name = name;
    }

    // Add method to Animal's prototype
    Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound`);
    };

    // Child constructor
    function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
    }

    // Set up inheritance - Dog inherits from Animal
    Dog.prototype = Object.create(Animal.prototype);
    Dog.prototype.constructor = Dog;

    // Add Dog-specific method
    Dog.prototype.bark = function() {
    console.log(`${this.name} barks!`);
    };

    // Usage
    const myDog = new Dog("Buddy", "Golden Retriever");
    myDog.speak(); // "Buddy makes a sound" (inherited from Animal)
    myDog.bark();  // "Buddy barks!" (Dog's own method)
    ```

- function Person(){} vs  const person = Person() vs const person = new Person() :
    - **1. `function Person(){}` - Declares/defines a function but doesn't execute it**
    - **2. `const person = Person()` - Calls the function normally and stores its return value**  
    - **3. `const person = new Person()` - Uses the function as a constructor to create a new object**

    ```javascript
    // 1. Declaration - just defines it
    function Person(name) {
    this.name = name;
    return "hello";
    }

    // 2. Regular call - gets return value
    const person1 = Person("Alice");
    console.log(person1); // "hello"

    // 3. Constructor call - creates new object
    const person2 = new Person("Bob");
    console.log(person2); // { name: "Bob" }
    console.log(person2.name); // "Bob"
    ```

1. **mouseenter/mouseleave**: Fire only when entering/leaving the target element itself, do not bubble, and ignore child elements.

2. **mouseover/mouseout**: Fire when entering/leaving the target element OR its children, bubble up through the DOM, and can trigger multiple times as you move over child elements.

- synchronous vs asycnhronous functions:

**ES2015 Classes vs ES5 Constructors - Key Differences:**

1. **Syntax**: Classes use `class` keyword with cleaner syntax; ES5 uses function constructors with prototype methods added separately.

2. **Hoisting**: ES5 constructors are hoisted (can be used before declaration); classes are not hoisted and must be declared first.

3. **New requirement**: Classes must be called with `new` keyword (throws error otherwise); ES5 constructors can be called without `new` (but shouldn't be).

4. **Inheritance**: Classes use simple `extends` and `super`; ES5 requires complex `Object.create()` and `call()` patterns.

5. **Method enumeration**: Class methods are non-enumerable by default; ES5 prototype methods are enumerable.

```javascript
function reverseDigit(num){
    let reversed =0;
    while(num > 0){
        let digit = num % 10;
        reversed = reversed * 10 + digit;
        num = Math.floor(num / 10);
    }
    return reversed;
}

function isPalindrome(string){
    let reverse = '';
    for (let i = string.length-1;i>=0;i--) {
        reverse = reverse + string[i];
    }
    return reverse==string ;
}

function reverserString(string){
    let reversed = '';
    for (let i = string.length - 1; i >= 0; i--) {
        reversed += string[i];
    }
    return reversed;
}

function sqrt(num) {
    return Math.sqrt(num);
}

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function gcd(a,b){
    while (b!=0){
        let temp = b;
        b= a % b;
        a = temp;
    }
    return a;
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}


console.log(reverseDigit(12345)); // Output: 54321
console.log(isPalindrome("racecar")); // Output: true
console.log(reverserString("hello")); // Output: "olleh"
console.log(sqrt(16)); // Output: 4
console.log(isPrime(7)); // Output: true
console.log(gcd(48, 18)); // Output: 6
console.log(lcm(4, 5)); // Output: 20
console.log(factorial(5)); // Output: 120
```

```result
54321
true
olleh
4
true
6
20
120
```

---
---

1. **Language insights and rules** - Core JavaScript concepts, best practices, and fundamental principles
2. **Compilation & type system** - How JavaScript executes, its dynamic nature, and engine details
3. **Data types & structures** - All primitive types, objects, arrays, Maps, Sets with essential methods
4. **Functions & methods** - Various function types, array/string methods, and functional programming
5. **OOP concepts** - Classes, inheritance, encapsulation, polymorphism with modern ES6+ syntax
6. **Advanced OOP features** - Mixins, decorators, proxies, design patterns
7. **Exception handling** - Try-catch, custom errors, async error handling
8. **Memory management** - Garbage collection, WeakMap/WeakSet, optimization tips
9. **Concurrency** - Event loop, Promises, async/await, Web Workers, generators

# Complete JavaScript Reference Notes

## 🚀 JavaScript Insights & Rules

### Core Language Insights
- **Prototype-based**: JavaScript uses prototypal inheritance, not classical inheritance
- **Dynamic & Weakly Typed**: Variables can change types at runtime
- **First-class Functions**: Functions are objects and can be passed around
- **Event-driven**: Built for **asynchronous programming** and event handling
- **Hoisting**: Variable and function declarations are moved to the top of their scope
- **Closures**: Inner functions have access to outer function variables
- **`this` Context**: The value of `this` depends on how a function is called

### Best Practices
- Use `const` by default, `let` when reassignment needed, avoid `var`
- Always use semicolons (though optional, prevents issues)
- Use strict mode (`'use strict';`) for better error checking
- Prefer arrow functions for callbacks and short functions
- Use template literals for string interpolation
- Handle async operations with Promises/async-await

---

## 🏗️ Language Compilation & Type System

### Language Characteristics
- **Interpreted Language**: No compilation step, executed directly by JavaScript engine
- **Just-in-Time (JIT) Compilation**: Modern engines compile to bytecode for optimization
- **High-level Language**: Abstracted from machine code details
- **Dynamic Typing**: Types are determined at runtime
- **Weakly Typed**: Automatic type coercion occurs

### JavaScript Engines
- **V8**: Chrome, Node.js
- **SpiderMonkey**: Firefox
- **JavaScriptCore**: Safari
- **Chakra**: Internet Explorer/Edge (legacy)


---

✍️ 1. Basic Syntax and Structure

JavaScript source files end in `.js` and run in browsers or Node.js.

```js
// Hello world
console.log("Hello, world!");
```

* **Semicolons:** Optional but recommended to avoid ASI pitfalls.
* **Case Sensitivity:** `myVar` ≠ `MyVar`.
* **Comments:**

  * `// single‑line`
  * `/* multi‑line */`


🧩 2. Data Types & Variables

JavaScript is **dynamically** and **loosely** typed. Declare variables with:

* `let` – block‑scoped, reassignable
* `const` – block‑scoped, read‑only after init
* `var` – function‑scoped, hoisted (avoid in modern code)

🔹 Primitive Types

| Type        | Example              | Default Value   | Description                              |
| ----------- | -------------------- | --------------- | ---------------------------------------- |
| `number`    | `let n = 3.14;`      | `NaN` if bad op | 64‑bit float; includes `NaN`, `Infinity` |
| `string`    | `let s = "hello";`   | `""`            | Immutable text                           |
| `boolean`   | `let b = true;`      | `false`         | Logical `true`/`false`                   |
| `undefined` | `let x;`             | `undefined`     | Uninitialized variable                   |
| `null`      | `let y = null;`      | `null`          | Explicit “no value”                      |
| `symbol`    | `let id = Symbol();` | —               | Unique identifier                        |
| `bigint`    | `let bi = 123n;`     | —               | Arbitrarily large integers               |

> **Note:** `typeof null` returns `"object"` (legacy bug), and `NaN !== NaN` is `true`.

🔸 Non‑Primitive Types (Reference)

| Type       | Example                          | Description                    |
| ---------- | -------------------------------- | ------------------------------ |
| `object`   | `let o = {a:1, b:2};`            | Key‑value container            |
| `array`    | `let arr = [1,2,3];`             | Ordered list (zero‑indexed)    |
| `function` | `function f(x){ return x*2; }`   | First‑class callable object    |
| `Map`      | `new Map([['k', 1]]);`           | Key‑value store (any key type) |
| `Set`      | `new Set([1,2,2,3]);`            | Unique collection              |
| `Date`     | `new Date();`                    | Date/time object               |
| `RegExp`   | `/ab+c/` or `new RegExp('ab+c')` | Regular expression             |


🧱 3. Primitive vs Non‑Primitive Structures

| Category          | Type/Structure                                                         | Mutable? | Notes                      |
| ----------------- | ---------------------------------------------------------------------- | -------- | -------------------------- |
| **Primitive**     | `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint` | No       | Stored by value, immutable |
| **Non‑Primitive** | `object`, `array`, `function`, `Map`, `Set`, etc.                      | Yes      | Stored by reference        |

```js
let a = 5;
let b = a;
b = 10;
console.log(a, b); // 5, 10 (value copy)

let objA = {x:1};
let objB = objA;
objB.x = 2;
console.log(objA.x, objB.x); // 2, 2 (shared reference)
```

🔧 4. Operators

| Category      | Operators                                      | Purpose                                 |                            |               |
| ------------- | ---------------------------------------------- | --------------------------------------- | -------------------------- | ------------- |
| Arithmetic    | `+`, `-`, `*`, `/`, `%`, `**`                  | Math                                    |                            |               |
| Assignment    | `=`, `+=`, `-=`, `*=`, `/=`, `**=`             | Assign and update                       |                            |               |
| Increment/Dec | `++`, `--`                                     | Increase/decrease by 1                  |                            |               |
| Comparison    | `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=` | Value/type comparisons                  |                            |               |
| Logical       | `&&`, \`                                       |                                         | `, `!\`                    | Boolean logic |
| Bitwise       | `&`, \`                                        | `, `^`, `\~`, `<<`, `>>`, `>>>\`        | Operate on 32‑bit integers |               |
| Ternary       | `condition ? expr1 : expr2`                    | Inline `if‑else`                        |                            |               |
| Type‑checking | `typeof`, `instanceof`                         | Check type or prototype                 |                            |               |
| Spread/Rest   | `...`                                          | Expand or collect array/object elements |                            |               |


- watch-out:
> - '5' == 5      // ✅ true (type coercion)
> - '5' === 5     // ❌ false (strict equal)


```js
// Ternary
let status = (age >= 18) ? "adult" : "minor";

// Spread & Rest
let nums = [1,2,3];
let copy = [...nums, 4]; // [1,2,3,4]
function sum(...args) { return args.reduce((a,b)=>a+b, 0); }
```
> reduce() is a higher-order function in JavaScript that lets you apply a logic (like a lambda) across an array to accumulate a single result.
> - const arr = [1, 2, 3, 4];
> - const sum = arr.reduce((acc, curr) => acc + curr, 0);  // 10



 🔁 5. Control Flow

 5.1 Conditional Statements

```js
if (x > 0) {
  console.log("Positive");
} else if (x < 0) {
  console.log("Negative");
} else {
  console.log("Zero");
}
```

5.2 Switch

```js
switch (day) {
  case 1: console.log("Mon"); break;
  case 2: console.log("Tue"); break;
  default: console.log("Other");
}
```

5.3 Loops

* **`for`**

  ```js
  for (let i=0; i<5; i++) { console.log(i); }
  ```
* **`while`**

  ```js
  let i = 0;
  while (i < 5) { console.log(i); i++; }
  ```
* **`do…while`**

  ```js
  let i = 0;
  do { console.log(i); i++; } while (i < 5);
  ```
* **Control Keywords**

  * `break` – exit loop/switch
  * `continue` – skip to next iteration
  * `return` – exit function

---

📚 6. Arrays & Strings

Arrays

```js
let fruits = ["apple", "banana", "cherry"];
fruits.push("date");        // ["apple","banana","cherry","date"]
fruits.pop();               // removes "date"
fruits.slice(1,3);          // ["banana","cherry"]
fruits.splice(1,1,"blueberry"); // ["apple","blueberry","cherry"]
```


**Common Methods:** `map()`, `filter()`, `reduce()`, `forEach()`, `find()`, `includes()`, `indexOf()`

Strings

```js
let str = "Hello, JS!";
str.length;                 // 9
str.charAt(1);              // "e"
str.toUpperCase();          // "HELLO, JS!"
str.slice(7);               // "JS!"
str.split(", ");            // ["Hello","JS!"]
```

**Template Literals:**

```js
let name = "Alice";
let msg = `Hi ${name}, today is ${new Date().toLocaleDateString()}`;
```

```javascript
// ===========================
// String Creation
// ===========================

// Literal
let s  = "Hello";
// String object (rarely used)
let s2 = new String("Hello");


// ===========================
// Basic String Methods
// ===========================

s.length                // 5 – number of characters
s.charAt(2)             // "l" – character at index 2
s[2]                    // "l" – alternate bracket notation
s.toLowerCase()         // "hello"
s.toUpperCase()         // "HELLO"
s.trim()                // removes whitespace at both ends
s.trimStart()           // removes whitespace at start
s.trimEnd()             // removes whitespace at end
s.slice(1)              // "ello" – from index 1 to end
s.slice(1, 4)           // "ell" – from 1 up to (not including) 4
s.substring(1)          // "ello" – similar to slice but swaps if start> end
s.substring(1, 4)       // "ell"
s.substr(1, 3)          // "ell" – start + length (deprecated in modern code)
s.replace("l", "x")     // "Hexlo" – replaces first occurrence
s.replaceAll("l", "x")  // "Hexxo" – replaces all occurrences
s.concat(" World")      // "Hello World"
s.startsWith("He")      // true
s.endsWith("lo")        // true
s.includes("ll")        // true – substring check
s.indexOf("l")          // 2 – first index of "l"
s.lastIndexOf("l")      // 3 – last index of "l"
s.repeat(3)             // "HelloHelloHello"
s.split(",")            // [ "Hello" ] – split on comma
s.match(/l+/g)          // [ "ll", "l" ] – regex matches
s.search("l")           // 2 – index of match
s.padStart(8, "*")      // "***Hello" – pad to length 8 on left
s.padEnd(8, "!")        // "Hello!!!" – pad to length 8 on right
s.normalize()           // Unicode normalization (NFC)  
String(s)               // "Hello" – global String cast
String.fromCharCode(72,101,108,108,111) // "Hello"
s.split('').reverse().join('') // "olleH" – reverse string using split/join


// ===========================
// Checking String Properties
// ===========================

s === ""                // false – test for empty
s.length === 0          // false – another way to test empty
/\S/.test(s)            // true – checks for any non-whitespace
```

```result title="Error"
evalmachine.<anonymous>:53
/\S/.test(s)            // true – checks for any non-whitespace
 ^

SyntaxError: Invalid or unexpected token
    at new Script (node:vm:117:7)
    at createScript (node:vm:269:10)
    at Object.runInThisContext (node:vm:317:10)
    at run ([eval]:1020:15)
    at onRunRequest ([eval]:864:18)
    at onMessage ([eval]:828:13)
    at process.emit (node:events:524:28)
    at emit (node:internal/child_process:950:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:83:21)
```

## **array iteration**
```javascript
for (let hobby of hobbies) {
    console.log(hobby);
}
```

**forEach method:**
```javascript
hobbies.forEach(hobby => console.log(hobby));
```

**Traditional for loop with index:**
```javascript
for (let i = 0; i < hobbies.length; i++) {
    console.log(hobbies[i]);
}
```

**for...in loop (gets indices):**
```javascript
for (let index in hobbies) {
    console.log(hobbies[index]);
}
```

**With index using for...of:**
```javascript
for (let [index, hobby] of hobbies.entries()) {
    console.log(`${index}: ${hobby}`);
}
```

Here are the most useful array execution shortcuts in JavaScript:

## Array Methods Chaining
```javascript
const numbers = [1, 2, 3, 4, 5];

// Chain multiple operations
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0);
```

## Quick Array Creation
```javascript
// Create array with spread
const arr = [...Array(5)].map((_, i) => i); // [0,1,2,3,4]

// Range creation
const range = Array.from({length: 5}, (_, i) => i + 1); // [1,2,3,4,5]

// Fill array
const filled = new Array(3).fill(0); // [0,0,0]
```

## Destructuring Shortcuts
```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3,4,5]

// Swap variables
[a, b] = [b, a];
```

## Common Quick Operations
```javascript
const arr = [1, 2, 3, 4, 5];

// Check if any/all meet condition
arr.some(n => n > 3);     // true
arr.every(n => n > 0);    // true

// Find items
arr.find(n => n > 3);     // 4
arr.includes(3);          // true

// Quick copy
const copy = [...arr];

// Remove duplicates
const unique = [...new Set(arr)];

// Flatten arrays
const nested = [[1,2], [3,4]];
const flat = nested.flat(); // [1,2,3,4]
```

## Modern Shortcuts (ES2019+)
```javascript
// Array.flatMap - map then flatten
arr.flatMap(n => [n, n * 2]); // [1,2,2,4,3,6,4,8,5,10]

// Optional chaining with arrays
const item = data?.items?.[0];

// Nullish coalescing for arrays
const result = arr ?? [];
```

## Performance Shortcuts
```javascript
// Quick array check
Array.isArray(arr);

// Fast iteration
for (const item of arr) { /* fastest for simple loops */ }

// Quick min/max
Math.max(...arr);
Math.min(...arr);
```

```javascript

// ===========================
// Array Creation
// ===========================

// Literal
let arr1 = [1, 2, 3];
// Constructor
let arr2 = new Array(3);     // [ <3 empty items> ]
let arr3 = Array.of(1, 2, 3);
// From iterable or string
let arr4 = Array.from("hey"); // ["h","e","y"]


// ===========================
// Basic Array Methods
// ===========================

arr1.length               // 3
arr1.push(4)              // adds 4, returns new length
arr1.pop()                // removes last, returns removed element
arr1.shift()              // removes first, returns it
arr1.unshift(0)           // adds at front, returns new length
arr1.concat([5,6])        // [1,2,3,5,6] – merges arrays
arr1.join("-")            // "1-2-3" – joins to string
arr1.toString()           // "1,2,3"


// ===========================
// Advanced Array Methods
// ===========================

arr1.slice(1,3)           // [2,3] – shallow copy subarray
arr1.splice(1,1,9,9)      // [2] – removes 1 at idx1, inserts 9,9
arr1.indexOf(9)           // 1 – first occurrence
arr1.lastIndexOf(9)       // 2 – last occurrence
arr1.includes(3)          // true
arr1.reverse()            // [3,2,1] – in-place reverse
arr1.sort((a,b)=>a-b)     // [1,2,3] – in-place sort with compare fn
arr1.map(x=>x*2)          // [2,4,6] – new array
arr1.filter(x=>x%2===0)   // [2] – new array
arr1.reduce((sum,x)=>sum+x, 0)  // 6 – single value
arr1.forEach(x=>console.log(x)) // logs each element
arr1.find(x=>x>1)         // 2 – first match
arr1.findIndex(x=>x>1)    // 1 – index of first match
arr1.some(x=>x>2)         // true – any match
arr1.every(x=>x>0)        // true – all match
arr1.fill(0,1,3)          // [1,0,0] – fill values from idx1 up to 3
arr1.flat()               // flattens one level
arr1.flatMap(x=>[x,x*2])  // map then flatten
arr1.entries()            // iterator of [index, value]
arr1.keys()               // iterator of keys (indices)
arr1.values()             // iterator of values
arr1.copyWithin(0,2,3)    // copies part within same array
```

```result
0
3
9
9
```

```result
[ 0, 0, 0, 9 ]
```

```javascript

// ===========================
// Map (Key-Value Store)
// ===========================

let map = new Map([
  ["a", 1],
  [2, "two"]
]);
map.set("b", 2);           // adds/updates
map.get("a");              // 1
map.has("c");              // false
map.delete(2);             // removes key 2
map.size;                  // 2
map.clear();               // empties map
map.keys();                // iterator of keys
map.values();              // iterator of values
map.entries();             // iterator of [key, value]
map.forEach((v,k)=>console.log(k, v)); // iterate


// ===========================
// Set (Unique Collection)
// ===========================

let set = new Set([1,2,2,3]);
set.add(4);                // Set {1,2,3,4}
set.has(2);                // true
set.delete(3);             // true
set.size;                  // 3
set.clear();               // empties set
set.values();              // iterator of values
set.forEach(v=>console.log(v)); // iterate


// ===========================
// Additional Data Structures
// ===========================

// WeakMap (keys must be objects, allow GC)
let wm = new WeakMap();
let obj = {};
wm.set(obj, "meta");
wm.get(obj);               // "meta"

// WeakSet (values must be objects, allow GC)
let ws = new WeakSet();
ws.add(obj);
ws.has(obj);               // true
```

```result
true
```

# JavaScript Sorting Reference Guide

## String Sorting

| Method | Code | Example Input | Output | Notes |
|--------|------|---------------|---------|-------|
| **Basic Sort** | `arr.sort()` | `['banana', 'apple', 'cherry']` | `['apple', 'banana', 'cherry']` | Default lexicographic order |
| **Case Insensitive** | `arr.sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()))` | `['Banana', 'apple', 'Cherry']` | `['apple', 'Banana', 'Cherry']` | Ignores case differences |
| **Reverse** | `arr.sort().reverse()` | `['banana', 'apple', 'cherry']` | `['cherry', 'banana', 'apple']` | Sort then reverse |
| **By Length** | `arr.sort((a,b) => a.length - b.length)` | `['hi', 'hello', 'hey']` | `['hi', 'hey', 'hello']` | Shortest to longest |
| **Locale Aware** | `arr.sort((a,b) => a.localeCompare(b))` | `['café', 'zebra', 'apple']` | `['apple', 'café', 'zebra']` | Handles accents/special chars |

## Array Sorting

| Type | Code | Example Input | Output | Use Case |
|------|------|---------------|---------|----------|
| **Numbers Ascending** | `arr.sort((a,b) => a - b)` | `[10, 5, 40, 25, 1]` | `[1, 5, 10, 25, 40]` | Most common numeric sort |
| **Numbers Descending** | `arr.sort((a,b) => b - a)` | `[10, 5, 40, 25, 1]` | `[40, 25, 10, 5, 1]` | High to low |
| **Mixed Types** | `arr.sort()` | `[10, 5, '40', '25', 1]` | `[1, 10, '25', '40', 5]` | ⚠️ Converts to strings |
| **2D Arrays** | `arr.sort((a,b) => a[0] - b[0])` | `[[3,1], [1,2], [2,3]]` | `[[1,2], [2,3], [3,1]]` | Sort by first element |
| **Preserve Original** | `[...arr].sort((a,b) => a - b)` | `[3, 1, 4]` | `[1, 3, 4]` | Original array unchanged |

## Object/Dictionary Sorting

| Property Type | Code | Example Input | Output | Description |
|---------------|------|---------------|---------|-------------|
| **By Number Property** | `arr.sort((a,b) => a.age - b.age)` | `[{name:'John',age:30}, {name:'Alice',age:25}]` | `[{name:'Alice',age:25}, {name:'John',age:30}]` | Sort by numeric property |
| **By String Property** | `arr.sort((a,b) => a.name.localeCompare(b.name))` | `[{name:'John'}, {name:'Alice'}]` | `[{name:'Alice'}, {name:'John'}]` | Sort by string property |
| **Multiple Criteria** | `arr.sort((a,b) => a.dept.localeCompare(b.dept) \|\| a.age - b.age)` | `[{dept:'IT',age:30}, {dept:'IT',age:25}]` | `[{dept:'IT',age:25}, {dept:'IT',age:30}]` | Sort by dept, then age |
| **Nested Property** | `arr.sort((a,b) => a.address.city.localeCompare(b.address.city))` | `[{address:{city:'NYC'}}, {address:{city:'LA'}}]` | `[{address:{city:'LA'}}, {address:{city:'NYC'}}]` | Sort by nested property |
| **Boolean Property** | `arr.sort((a,b) => b.active - a.active)` | `[{active:false}, {active:true}]` | `[{active:true}, {active:false}]` | true values first |

## Advanced Sorting Patterns

| Pattern | Code | Use Case |
|---------|------|----------|
| **Custom Order** | `arr.sort((a,b) => ['small','medium','large'].indexOf(a.size) - ['small','medium','large'].indexOf(b.size))` | Predefined order |
| **Null/Undefined Safe** | `arr.sort((a,b) => (a?.value \|\| 0) - (b?.value \|\| 0))` | Handle missing values |
| **Date Sorting** | `arr.sort((a,b) => new Date(a.date) - new Date(b.date))` | Sort by date strings |
| **Random Shuffle** | `arr.sort(() => Math.random() - 0.5)` | Randomize array order |

## Performance & Memory Notes

- `sort()` **modifies original array** - use spread `[...arr].sort()` to preserve
- Time complexity: **O(n log n)** average case
- For large datasets, consider specialized algorithms
- `localeCompare()` is slower but handles internationalization
- Numbers without compare function become strings: `[1, 10, 2]` → `[1, 10, 2]` (wrong!)

## Quick Reference Shortcuts

```javascript
// Most common patterns
arr.sort()                           // Strings A-Z
arr.sort((a,b) => a - b)            // Numbers low-high  
arr.sort((a,b) => b - a)            // Numbers high-low
arr.sort((a,b) => a.prop - b.prop)  // Objects by number property
arr.sort((a,b) => a.name.localeCompare(b.name)) // Objects by string property
```

---

###  What is **Hoisting** in JavaScript?

🔎 How Hoisting Works (with `var`)

```js
console.log(x); // undefined
var x = 5;
```

✅ JavaScript behind the scenes:

```js
var x;          // hoisted
console.log(x); // undefined
x = 5;
```

* `var x` is **hoisted** (declared at top), but the **value assignment stays in place**.
* So before line 2, `x` exists but is `undefined`.

### `let` and `const` are **not** hoisted the same way

```js
console.log(y); // ❌ ReferenceError
let y = 10;
```

* `let` and `const` **are hoisted**, but **not initialized**.
* This causes a **"temporal dead zone"** where using the variable before its declaration gives an error.

### Function Declarations ARE hoisted

```js
sayHello(); // ✅ Works

function sayHello() {
  console.log("Hello!");
}
```

* Entire function is hoisted — so you can call it even before its definition.

### Function Expressions are NOT hoisted

```js
greet(); // ❌ TypeError: greet is not a function

var greet = function() {
  console.log("Hi!");
};
```

* `var greet` is hoisted (as `undefined`), but the function itself is **not assigned yet**.

 Summary Table

| Item                   | Hoisted?   | Initialized? | Can use before declaration?   |
| ---------------------- | ---------- | ------------ | ----------------------------- |
| `var`                  | ✅ Yes      | ❌ No         | ⚠️ Yes, but gives `undefined` |
| `let` / `const`        | ✅ Yes      | ❌ No         | ❌ No — ReferenceError         |
| `function` declaration | ✅ Yes      | ✅ Yes        | ✅ Yes                         |
| `function` expression  | ✅ var only | ❌ No         | ❌ No                          |

## 🔧 Functions & Methods

### Function Types
```javascript
// Function Declaration (hoisted)
function greet(name) {
    return `Hello, ${name}!`;
}

// Function Expression (not hoisted)
const greet2 = function(name) {
    return `Hello, ${name}!`;
};

// Arrow Function (ES6+)
const greet3 = (name) => `Hello, ${name}!`;
const greet4 = name => `Hello, ${name}!`; // Single parameter
const greet5 = () => "Hello, World!"; // No parameters


// Immediately Invoked Function Expression (IIFE)
(function() {
    console.log("I run immediately!");
})();

// Generator Function
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

// Async Function
async function fetchData() {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
}
```

#### ✅ Arrow function:

```js
const add = (a, b) => a + b;
```


📌 2. **Syntax Variants**

| Scenario              | Arrow Function Syntax                    |
| --------------------- | ---------------------------------------- |
| One param, one line   | `x => x * 2`                             |
| Multiple params       | `(x, y) => x + y`                        |
| No params             | `() => console.log("Hi!")`               |
| Multiple statements   | `(x, y) => { let z = x + y; return z; }` |
| Return object literal | `() => ({ name: "JS" })`                 |

> ⚠️ For object literals, **wrap in `()`** or JS thinks it's a block `{}`.

📌 3. **Arrow Functions vs Regular Functions**

| Feature        | Arrow Function          | Regular Function     |
| -------------- | ----------------------- | -------------------- |
| Syntax         | Short (`=>`)            | Verbose (`function`) |
| `this` binding | ❌ No own `this`         | ✅ Has its own `this` |
| Use in class   | ❌ Not for class methods | ✅ Ideal for methods  |
| Hoisting       | ❌ Not hoisted           | ✅ Hoisted            |


📌 4. **Arrow Function & `this`**

```js
const person = {
  name: "Alex",
  sayHi: function () {
    console.log("Hi " + this.name);
  },
  sayHiArrow: () => {
    console.log("Hi " + this.name); // ❌ `this` is not bound to person
  }
};

person.sayHi();       // Hi Alex
person.sayHiArrow();  // Hi undefined
```

> 🔥 Arrow functions **don’t bind their own `this`** — they inherit it from the surrounding scope.
> This is great for callbacks, but not for class/object methods.

5. **Common Use Cases**

- **sorting**:

| Comparator                               | Result                  |
| ---------------------------------------- | ----------------------- |
| `(a, b) => a - b`                        | Ascending (low → high)  |
| `(a, b) => b - a`                        | Descending (high → low) |
| `(a, b) => a.name.localeCompare(b.name)` | Alphabetical by name    |

- **Array methods:**

```js
const nums = [1, 2, 3];
const squared = nums.map(x => x * x);  // [1, 4, 9]
```

- **Event handlers (React / DOM):**

```js
button.addEventListener("click", () => {
  console.log("Clicked!");
});
```

- **Promise chains:**

```js
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data));
```

🚫 Where NOT to use arrow functions

* As **constructor functions** → `const A = () => {}` ❌
* As **class methods** (if `this` is needed)
* When you need your own `arguments` object

 🧪 Python Comparison

| Concept       | Python                                       | JavaScript (arrow)     |
| ------------- | -------------------------------------------- | ---------------------- |
| Lambda        | `lambda x: x + 1`                            | `x => x + 1`           |
| No own `self` | Class method loses `self` if used improperly | Arrow loses `this` too |




### Function Features
```javascript
// Default Parameters
function greet(name = "World") {
    return `Hello, ${name}!`;
}

// Rest Parameters
function sum(...numbers) {
    return numbers.reduce((acc, num) => acc + num, 0);
}

// Spread Operator
const numbers = [1, 2, 3];
console.log(sum(...numbers));

// Destructuring Parameters
function createUser({name, age, email}) {
    return {name, age, email};
}

// Higher-Order Functions
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
console.log(double(5)); // 10
```
 

---

## OOPs:

```javascript
// classes and objects
// method and variable types
class Person {
  // Class variable (shared across all instances)
  static numberOfPeople = 0;

  constructor(name, age) {
    this.name = name; // Instance variable
    this.age = age;   // Instance variable
    Person.numberOfPeople++; // Increment class (static) variable
  }

  // Instance Method
  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }

  // Class Method (static)
  static getNumberOfPeople() {
    return Person.numberOfPeople;
  }

  // Static Method
  static isAdult(age) {
    return age >= 18;
  }
}

// Creating instances
const person1 = new Person("Alice", 30);
const person2 = new Person("Bob", 25);

// Using Instance Method
console.log(person1.greet()); // Hello, my name is Alice and I am 30 years old.

// Using Class Method
console.log(Person.getNumberOfPeople()); // 2

// Using Static Method
console.log(Person.isAdult(30)); // true
console.log(Person.isAdult(16)); // false

// Calling static method from instance (possible but not ideal)
console.log(person1.constructor.isAdult(30)); // true

// Print method references
console.log(Person.getNumberOfPeople); // [Function: getNumberOfPeople]
console.log(Person.isAdult);           // [Function: isAdult]
```

### javascript doesnt support multiple inheritence nativley and special heritence like prototype is there to check

```javascript
// ✅ 1. Single Inheritance
class Computer {
  constructor() {
    this.brand = ''; // instance variable
  }

  displayBrand() {
    console.log("Brand: " + this.brand);
  }
}

class Laptop extends Computer {
  constructor() {
    super();
    this.batteryLife = 0;
  }

  displayBatteryLife() {
    console.log("Battery Life: " + this.batteryLife + " hours");
  }
}

const myLaptop = new Laptop();
myLaptop.brand = "Dell";
myLaptop.batteryLife = 10;
myLaptop.displayBrand();           // Output: Brand: Dell
myLaptop.displayBatteryLife();    // Output: Battery Life: 10 hours


// ✅ 2. Multi-level Inheritance
class Animal {
  eat() {
    console.log("Animal is eating");
  }
}

class Dog extends Animal {
  bark() {
    console.log("Dog is barking");
  }
}

class Puppy extends Dog {
  weep() {
    console.log("Puppy is weeping");
  }
}

const myPuppy = new Puppy();
myPuppy.eat();   // inherited from Animal
myPuppy.bark();  // inherited from Dog
myPuppy.weep();  // own method


// ✅ 3. Hierarchical Inheritance
class Vehicle {
  start() {
    console.log("Vehicle is starting");
  }
}

class Car extends Vehicle {
  drive() {
    console.log("Car is driving");
  }
}

class Bike extends Vehicle {
  ride() {
    console.log("Bike is riding");
  }
}

const myCar = new Car();
myCar.start();  // from Vehicle
myCar.drive();  // own method

const myBike = new Bike();
myBike.start(); // from Vehicle
myBike.ride();  // own method


// ✅ 4. Multiple Inheritance via Mixins (simulate interface-style behavior)
const AnimalSound = {
  sound() {
    console.log("Animal makes sound");
  }
};

const PetSound = {
  sound() {
    console.log("Pet makes sound");
  }
};

// Mixing both interfaces
class DogWithMix {
  sound() {
    console.log("Dog makes a sound");
  }
}

// Apply mixins (simulate multiple interfaces)
Object.assign(DogWithMix.prototype, AnimalSound, PetSound);

const myDog = new DogWithMix();
myDog.sound();  // Calls overridden DogWithMix method
```

### **Polymorphism in JavaScript**

### **Definition**

Polymorphism is the ability of different objects to respond to the same function or method call in their own way. It's about having **one interface, many implementations**.

> JavaScript is **dynamically typed** and **interpreted**, so most polymorphism in JS is **runtime-based** — like Python.



## ✅ **Types of Polymorphism in JavaScript**

 1. **Runtime Polymorphism**

> Happens when the method to invoke is determined at **runtime**

✅ a. **Method Overriding (Inheritance-based)**

```js
class Animal {
  speak() {
    console.log("Animal makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Cat meows");
  }
}

const a1 = new Dog();
const a2 = new Cat();

a1.speak(); // Dog barks
a2.speak(); // Cat meows
```

✅ b. **Duck Typing (Like Python)**

> JS doesn't care what type an object is — if it has the method, it works.

```js
function makeItSpeak(animal) {
  animal.speak();
}

const bird = {
  speak: () => console.log("Bird sings")
};

makeItSpeak(bird);  // Bird sings
```

🔹 2. **Compile-Time Polymorphism (Simulated Only)**

> JavaScript does **not support** real compile-time polymorphism like C++ or Java.

⚠️ a. **Method Overloading — Not Supported Natively**

> You **can't define multiple methods** with the same name and different parameters.

```js
class Greet {
  // Only one definition allowed; last one will overwrite
  sayHello(name) {
    console.log("Hello " + name);
  }

  // This will overwrite the previous sayHello()
  // sayHello(name, age) { ... } ❌ Not valid overloading
}
```

✅ Simulated Using **Default/Rest Parameters**

```js
class Greet {
  sayHello(name = "Guest", age = null) {
    if (age !== null) {
      console.log(`Hello ${name}, age ${age}`);
    } else {
      console.log(`Hello ${name}`);
    }
  }
}

const g = new Greet();
g.sayHello();           // Hello Guest
g.sayHello("Alice");    // Hello Alice
g.sayHello("Bob", 25);  // Hello Bob, age 25
```

🔹 3. **Operator Overloading**

> ❌ **Not supported** in JS
> JS does not allow operator overloading directly (e.g., redefining `+` for objects), unlike Python or C++.

```js
// Example that would work in Python but not in JS:
// obj1 + obj2  ❌ Invalid in JS
```



## 📝 Summary Table

| Feature                   | Supported in JS | Notes                                                          |
| ------------------------- | --------------- | -------------------------------------------------------------- |
| Compile-time Polymorphism | 🚫 No           | No method overloading or operator overloading                  |
| Method Overloading        | ⚠️ Simulated    | Use default parameters or `...args`                            |
| Operator Overloading      | 🚫 No           | Not possible in JS natively                                    |
| Method Overriding         | ✅ Yes           | Achieved via inheritance and subclass methods                  |
| Duck Typing               | ✅ Yes           | JS is dynamic; just check if method exists and invoke it       |
| Runtime Polymorphism      | ✅ Yes           | Core type in JS: method overriding, dynamic method calls, etc. |

✅ Bonus: Dynamic Dispatch with Function Behavior

```js
function greet(person) {
  if (person.language === "English") {
    console.log("Hello");
  } else if (person.language === "French") {
    console.log("Bonjour");
  } else {
    console.log("Hi there!");
  }
}

greet({ language: "English" }); // Hello
greet({ language: "French" });  // Bonjour
```

| Feature                       | **Python**                                        | **JavaScript**                                     | ✅ Summary          |
| ----------------------------- | ------------------------------------------------- | -------------------------------------------------- | ------------------ |
| **Dynamically Typed**         | ✅ Yes                                             | ✅ Yes                                              | Same               |
| **Runtime Polymorphism**      | ✅ Yes (core type)                                 | ✅ Yes (core type)                                  | Same               |
| **Method Overriding**         | ✅ Yes                                             | ✅ Yes                                              | Same               |
| **Duck Typing**               | ✅ Yes                                             | ✅ Yes (just check if method exists)                | Same               |
| **Compile-time Polymorphism** | 🚫 No (simulated only)                            | 🚫 No (simulated only)                             | Same               |
| **Method Overloading**        | ❌ Not natively, simulated via `*args`, `**kwargs` | ❌ Not natively, simulated via `default`, `...args` | Similar workaround |
| **Operator Overloading**      | ✅ Yes (via magic methods like `__add__`)          | ❌ No native operator overloading                   | ❌ JS lacks this    |
| **Multiple Inheritance**      | ✅ Yes (with MRO)                                  | ❌ Not directly, but simulated with mixins          | Different          |
| **Single Dispatch**           | ✅ Yes (`functools.singledispatch`)                | ❌ Not built-in (can simulate manually)             | Python wins        |

---
---
### abstraction:

| Feature / Language             | **Java** | **Python**                | **JavaScript**             |
| ------------------------------ | -------- | ------------------------- | -------------------------- |
| `abstract` keyword             | ✅ Yes    | ⚠️ No keyword (use `abc`) | ❌ No                       |
| Abstract base class            | ✅ Yes    | ✅ Via `abc.ABC`           | ⚠️ Simulated               |
| Abstract method                | ✅ Yes    | ✅ `@abstractmethod`       | ⚠️ Simulated (throw error) |
| Enforcement by language        | ✅ Strong | ✅ Strong                  | ❌ No enforcement           |
| Can mix concrete and abstract  | ✅ Yes    | ✅ Yes                     | ✅ Yes                      |
| Interface-like behavior        | ✅ Yes    | ✅ With ABCs               | ⚠️ Simulated               |
| Can instantiate abstract class | ❌ No     | ❌ No                      | ⚠️ Prevent manually        |

### abstraction vs interface:

- 🧠 Abstract Class = "Some methods are common; others you must define."

- 🔌 Interface = "You must define all these methods. I don't care how."

### interfaces :

| Language       | Interface Support  | Type    | Strength                |
| -------------- | ------------------ | ------- | ----------------------- |
| **Java**       | ✅ Native           | Static  | 🔒 Strong               |
| **Python**     | ✅ Simulated (ABCs) | Dynamic | 🔐 Moderate             |
| **JavaScript** | ⚠️ Simulated       | Dynamic | 🔓 Weak (by convention) |

### encapsulation:

| **Access Modifier** | **Java**          | **JavaScript**           | **Python**                                 |
| ------------------- | ----------------- | ------------------------ | ------------------------------------------ |
| `public`            | ✅ Yes             | ✅ Yes                    | ✅ Yes (no underscore)                      |
| `private`           | ✅ Yes (`private`) | ✅ Yes (with `#`)         | ⚠️ Simulated with `__name` (name mangling) |
| `protected`         | ✅ Yes             | ❌ No (simulate with `_`) | ⚠️ Convention only: `_name`                |
| `package-private`   | ✅ Yes (default)   | ❌ No                     | ❌ No (everything is public by default)     |

```javascript
// Encapsulation:

class BankAccount {
  // ✅ Private field (true private in JS using #)
  #accountNumber;

  // ✅ Public fields
  accountHolder;
  branchName;

  // ⚠️ "Protected" simulation (by convention using underscore _balance)
  _balance;

  // ✅ Constructor
  constructor(accountNumber, accountHolder, balance, branchName) {
    this.#accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this._balance = balance;
    this.branchName = branchName;
  }

  // ✅ Private method (accessible only within the class)
  #showPrivateInfo() {
    console.log(`Private Info: ${this.#accountNumber}`);
  }

  // ✅ Public method: can access private method internally
  getAccountNumber() {
    this.#showPrivateInfo(); // Internal access
    return this.#accountNumber;
  }

  // ✅ Public getter & setter
  getAccountHolder() {
    return this.accountHolder;
  }

  setAccountHolder(name) {
    this.accountHolder = name;
  }

  // ✅ Public read-only getter for balance
  getBalance() {
    return this._balance;
  }

  // ✅ Public method with validation
  deposit(amount) {
    if (amount > 0) {
      this._balance += amount;
      console.log(`Deposited: ${amount}`);
    } else {
      console.log("Invalid deposit amount!");
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this._balance) {
      this._balance -= amount;
      console.log(`Withdrawn: ${amount}`);
    } else {
      console.log("Invalid or insufficient funds!");
    }
  }

  // ⚠️ "Protected" method (simulated with _ prefix)
  _showProtectedInfo() {
    console.log(`Protected Info: Balance = ${this._balance}`);
  }

  // Default/public method (accessible anywhere)
  showBranch() {
    console.log(`Branch: ${this.branchName}`);
  }
}
```

| **Access Type**       | **How to Define**                     | **How to Use**                          | **Notes**                               |
| --------------------- | ------------------------------------- | --------------------------------------- | --------------------------------------- |
| **Private Field**     | `#fieldName`                          | Only inside class via `this.#fieldName` | 🔒 True privacy (ES2022+)               |
| **Public Field**      | `this.fieldName` or declared normally | `object.fieldName`                      | 🌐 Accessible from outside              |
| **"Protected" Field** | `this._fieldName` (convention)        | `object._fieldName`                     | ⚠️ Not enforced, by naming convention   |
| **Private Method**    | `#methodName()`                       | Only within class: `this.#methodName()` | 🔒 Same as private field                |
| **Public Method**     | `methodName()`                        | `object.methodName()`                   | ✅ Standard method                       |
| **Getter/Setter**     | `get name()` / `set name(val)`        | `object.name`, `object.name = "X"`      | 🧠 Looks like a field, acts like method |

```javascript
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    // Instance method
    speak() {
        console.log(`${this.name} makes a sound`);
    }
    
    // Static method
    static getSpeciesCount() {
        return "Many species exist";
    }
    
    // Getter
    get info() {
        return `${this.name} is a ${this.species}`;
    }
    
    // Setter
    set name(newName) {
        this._name = newName;
    }
}

// Inheritance
class Dog extends Animal {
    constructor(name, breed) {
        super(name, "dog"); // Call parent constructor
        this.breed = breed;
    }
    
    // Override method
    speak() {
        console.log(`${this.name} barks`);
    }
    
    // New method
    wagTail() {
        console.log(`${this.name} is wagging tail`);
    }
}

const myDog = new Dog("Buddy", "Golden Retriever");
myDog.speak(); // "Buddy barks"
myDog.wagTail(); // "Buddy is wagging tail"


//Prototypal Inheritance (Traditional)

// Constructor function
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Adding methods to prototype
Person.prototype.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
};

Person.prototype.getAge = function() {
    return this.age;
};

// Creating instances
const person1 = new Person("Alice", 25);
const person2 = new Person("Bob", 30);

person1.greet(); // "Hello, I'm Alice"

// Inheritance with prototypes
function Student(name, age, grade) {
    Person.call(this, name, age); // Call parent constructor
    this.grade = grade;
}

// Set up inheritance
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

// Add student-specific methods
Student.prototype.study = function() {
    console.log(`${this.name} is studying`);
};

const student1 = new Student("Charlie", 20, "A");
student1.greet(); // "Hello, I'm Charlie"
student1.study(); // "Charlie is studying"
```

```javascript
class BankAccount {
    // Private fields (ES2022+)
    #balance = 0;
    #accountNumber;
    
    constructor(accountNumber) {
        this.#accountNumber = accountNumber;
    }
    
    // Public method
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            console.log(`Deposited $${amount}`);
        }
    }
    
    // Public method
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            console.log(`Withdrew $${amount}`);
        } else {
            console.log("Insufficient funds");
        }
    }
    
    // Public getter
    get balance() {
        return this.#balance;
    }
    
    // Private method
    #validateTransaction(amount) {
        return amount > 0 && amount <= this.#balance;
    }
}

const account = new BankAccount("123456789");
account.deposit(100);
console.log(account.balance); // 100
// console.log(account.#balance); // Error: Private field
```

```javascript
class Shape {
    area() {
        throw new Error("Area method must be implemented");
    }
    
    perimeter() {
        throw new Error("Perimeter method must be implemented");
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
    
    perimeter() {
        return 2 * (this.width + this.height);
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    area() {
        return Math.PI * this.radius * this.radius;
    }
    
    perimeter() {
        return 2 * Math.PI * this.radius;
    }
}

// Polymorphic usage
const shapes = [
    new Rectangle(5, 10),
    new Circle(3),
    new Rectangle(3, 4)
];

shapes.forEach(shape => {
    console.log(`Area: ${shape.area()}`);
    console.log(`Perimeter: ${shape.perimeter()}`);
});
```

## 🔥 Advanced OOP Features

### Mixins (Composition over Inheritance)
```javascript
// Mixin objects
const Flyable = {
    fly() {
        console.log(`${this.name} is flying`);
    }
};

const Swimmable = {
    swim() {
        console.log(`${this.name} is swimming`);
    }
};

// Base class
class Animal {
    constructor(name) {
        this.name = name;
    }
}

// Apply mixins
Object.assign(Animal.prototype, Flyable, Swimmable);

class Duck extends Animal {
    constructor(name) {
        super(name);
    }
}

const duck = new Duck("Donald");
duck.fly();  // "Donald is flying"
duck.swim(); // "Donald is swimming"
```

### Decorators (Proposal - Stage 3)
```javascript
// Method decorator example (when available)
function log(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args) {
        console.log(`Calling ${propertyKey} with:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };
    
    return descriptor;
}

class Calculator {
    @log
    add(a, b) {
        return a + b;
    }
}
```

### Proxy & Reflection
```javascript
// Proxy for property access control
const user = {
    name: "John",
    age: 30,
    _password: "secret123"
};

const userProxy = new Proxy(user, {
    get(target, prop) {
        if (prop.startsWith('_')) {
            throw new Error("Access denied to private property");
        }
        return target[prop];
    },
    
    set(target, prop, value) {
        if (prop === 'age' && typeof value !== 'number') {
            throw new Error("Age must be a number");
        }
        target[prop] = value;
        return true;
    }
});

console.log(userProxy.name); // "John"
// console.log(userProxy._password); // Error: Access denied
```

### Symbols for Privacy
```javascript
const _balance = Symbol('balance');
const _accountNumber = Symbol('accountNumber');

class BankAccount {
    constructor(accountNumber) {
        this[_balance] = 0;
        this[_accountNumber] = accountNumber;
    }
    
    deposit(amount) {
        this[_balance] += amount;
    }
    
    get balance() {
        return this[_balance];
    }
}
```

### Factory Pattern
```javascript
class AnimalFactory {
    static createAnimal(type, name) {
        switch (type) {
            case 'dog':
                return new Dog(name);
            case 'cat':
                return new Cat(name);
            default:
                throw new Error(`Unknown animal type: ${type}`);
        }
    }
}

const dog = AnimalFactory.createAnimal('dog', 'Buddy');
const cat = AnimalFactory.createAnimal('cat', 'Whiskers');
```

### Observer Pattern
```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.windowMs - (now - oldestRequest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.request(fn);
        }
        
        this.requests.push(now);
        return fn();
    }
}

// Usage
const limiter = new RateLimiter(5, 60000); // 5 requests per minute

async function makeAPICall() {
    return limiter.request(() => {
        console.log('Making API call...');
        return fetch('https://api.example.com/data');
    });
}
```

### Task Queue Management
```javascript
// Task queue with priority
class TaskQueue {
    constructor() {
        this.tasks = [];
        this.running = false;
    }
    
    add(task, priority = 0) {
        const taskWrapper = { task, priority };
        
        // Insert task based on priority
        const insertIndex = this.tasks.findIndex(t => t.priority < priority);
        if (insertIndex === -1) {
            this.tasks.push(taskWrapper);
        } else {
            this.tasks.splice(insertIndex, 0, taskWrapper);
        }
        
        this.process();
    }
    
    async process() {
        if (this.running || this.tasks.length === 0) return;
        
        this.running = true;
        
        while (this.tasks.length > 0) {
            const { task } = this.tasks.shift();
            try {
                await task();
            } catch (error) {
                console.error('Task failed:', error);
            }
        }
        
        this.running = false;
    }
}

// Usage
const taskQueue = new TaskQueue();

taskQueue.add(() => console.log('Low priority task'), 1);
taskQueue.add(() => console.log('High priority task'), 10);
taskQueue.add(() => console.log('Medium priority task'), 5);
```



### Functional Programming Patterns
```javascript
// Pure functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const compose = (f, g) => (x) => f(g(x));

// Immutable data manipulation
const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
];

// Instead of mutating
const updateUserAge = (users, id, newAge) => 
    users.map(user => 
        user.id === id 
            ? { ...user, age: newAge }
            : user
    );

// Currying
const curry = (fn) => {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...nextArgs) {
            return curried.apply(this, args.concat(nextArgs));
        };
    };
};

const add3 = curry((a, b, c) => a + b + c);
const addFive = add3(5);
const addFiveAndTwo = addFive(2);
console.log(addFiveAndTwo(3)); // 10
```

---
---

## 🧠 Memory Management

### Garbage Collection
```javascript
// Memory allocation and deallocation
function createObjects() {
    let obj1 = { name: "Object 1" };
    let obj2 = { name: "Object 2" };
    
    // Create circular reference
    obj1.ref = obj2;
    obj2.ref = obj1;
    
    // Objects will be garbage collected when function exits
    // even with circular references (modern JS engines handle this)
}

// Memory leaks to avoid
let globalArray = [];

function memoryLeak() {
    // Bad: Adding to global array without cleanup
    globalArray.push(new Array(1000000));
}

// Good: Proper cleanup
function properCleanup() {
    let localArray = [];
    localArray.push(new Array(1000000));
    
    // Cleanup when done
    localArray = null;
}
```

### WeakMap and WeakSet for Memory Management
```javascript
// WeakMap doesn't prevent garbage collection
const weakMap = new WeakMap();
let obj = { name: "Test" };

weakMap.set(obj, "some value");
console.log(weakMap.get(obj)); // "some value"

// When obj is no longer referenced, it can be garbage collected
obj = null; // Now the entry in weakMap can be garbage collected too

// Use case: Private data storage
const privateData = new WeakMap();

class User {
    constructor(name) {
        privateData.set(this, { name, createdAt: new Date() });
    }
    
    getName() {
        return privateData.get(this).name;
    }
}
```

## 🎨 Modern JavaScript Features

### Optional Chaining & Nullish Coalescing
```javascript
// Optional chaining (?.)
const user = {
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'New York'
    }
};

console.log(user.address?.street); // '123 Main St'
console.log(user.address?.country); // undefined
console.log(user.phone?.mobile); // undefined (no error)

// Method chaining
user.getName?.(); // Call method if it exists
user.address?.getCoordinates?.(); // Chain method calls safely

// Nullish coalescing (??)
const username = user.name ?? 'Guest';
const theme = user.preferences?.theme ?? 'light';
const port = process.env.PORT ?? 3000;

// Difference from ||
const value1 = 0 || 'default';    // 'default' (falsy)
const value2 = 0 ?? 'default';    // 0 (not nullish)
```

### Logical Assignment Operators
```javascript
// Logical AND assignment (&&=)
let user = { name: 'John' };
user.name &&= user.name.toUpperCase(); // Only if name exists
console.log(user.name); // 'JOHN'

// Logical OR assignment (||=)
let config = {};
config.theme ||= 'light'; // Set if falsy
console.log(config.theme); // 'light'

// Nullish coalescing assignment (??=)
let settings = { theme: null };
settings.theme ??= 'dark'; // Set if null or undefined
settings.notifications ??= true;
console.log(settings); // { theme: 'dark', notifications: true }
```

### BigInt for Large Numbers
```javascript
// Creating BigInt
const bigInt1 = 123456789012345678901234567890n;
const bigInt2 = BigInt('123456789012345678901234567890');

// Operations
const sum = bigInt1 + bigInt2;
const product = bigInt1 * 2n;

// Cannot mix BigInt with regular numbers
// const invalid = bigInt1 + 5; // Error!
const valid = bigInt1 + 5n; // OK

// Comparisons
console.log(bigInt1 === bigInt2); // true
console.log(bigInt1 > 1000n); // true
```

### Dynamic Imports & Top-level Await
```javascript
// Dynamic imports
async function loadUtility() {
    const { default: lodash } = await import('lodash');
    return lodash.chunk([1, 2, 3, 4, 5, 6], 2);
}

// Top-level await (ES2022)
// In a module file
const data = await fetch('/api/data').then(res => res.json());
console.log(data);

// Conditional imports
if (condition) {
    const { heavyFunction } = await import('./heavy-module.js');
    heavyFunction();
}
```

---

### Memory Optimization Tips
```javascript
// 1. Avoid global variables
// Bad
var globalVar = "I'm global";

// Good
(function() {
    var localVar = "I'm local";
    // Use localVar here
})();

// 2. Remove event listeners
const button = document.getElementById('myButton');
const handler = () => console.log('Clicked');

button.addEventListener('click', handler);
// When done:
button.removeEventListener('click', handler);

// 3. Clear timers
const intervalId = setInterval(() => {
    console.log('Running...');
}, 1000);

// Clear when done
clearInterval(intervalId);

// 4. Nullify references
let heavyObject = {
    data: new Array(1000000).fill('data')
};

// When done with the object
heavyObject = null;
```

---

## ⚠️ Exception Handling

### Try-Catch-Finally
```javascript
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero is not allowed");
        }
        return a / b;
    } catch (error) {
        console.error("Error occurred:", error.message);
        return null;
    } finally {
        console.log("Division operation completed");
    }
}

// Custom error types
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class NetworkError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "NetworkError";
        this.statusCode = statusCode;
    }
}

function validateUser(user) {
    try {
        if (!user.name) {
            throw new ValidationError("Name is required");
        }
        if (!user.email) {
            throw new ValidationError("Email is required");
        }
        // Process user...
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error("Validation failed:", error.message);
        } else {
            console.error("Unexpected error:", error.message);
        }
    }
}
```

### Async Error Handling
```javascript
// Promise-based error handling
function fetchUserData(userId) {
    return fetch(`/api/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("User data:", data);
            return data;
        })
        .catch(error => {
            console.error("Failed to fetch user data:", error.message);
            throw error; // Re-throw if needed
        });
}

// Async/await error handling
async function fetchUserDataAsync(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("User data:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch user data:", error.message);
        throw error;
    }
}

// Multiple async operations
async function processUserData(userId) {
    try {
        const user = await fetchUserData(userId);
        const profile = await fetchUserProfile(user.id);
        const settings = await fetchUserSettings(user.id);
        
        return {
            user,
            profile,
            settings
        };
    } catch (error) {
        console.error("Error processing user data:", error.message);
        // Handle specific error types
        if (error instanceof NetworkError) {
            console.error("Network issue:", error.statusCode);
        }
        throw error;
    }
}
```

---

---

## 🎯 Advanced JavaScript Features

### Modules (ES6+)
```javascript
// math.js - Named exports
export const PI = 3.14159;
export function add(a, b) {
    return a + b;
}
export function multiply(a, b) {
    return a * b;
}

// calculator.js - Default export
export default class Calculator {
    add(a, b) {
        return a + b;
    }
    
    subtract(a, b) {
        return a - b;
    }
}

// main.js - Importing
import Calculator from './calculator.js';
import { PI, add, multiply } from './math.js';
import * as MathUtils from './math.js';

// Dynamic imports
async function loadModule() {
    const module = await import('./math.js');
    console.log(module.add(2, 3));
}
```

### Destructuring Assignment
```javascript
// Array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Object destructuring
const person = {
    name: 'John',
    age: 30,
    city: 'New York',
    country: 'USA'
};

const { name, age, ...location } = person;
console.log(name);     // 'John'
console.log(age);      // 30
console.log(location); // { city: 'New York', country: 'USA' }

// Nested destructuring
const user = {
    id: 1,
    profile: {
        name: 'Alice',
        settings: {
            theme: 'dark',
            notifications: true
        }
    }
};

const {
    profile: {
        name: userName,
        settings: { theme, notifications }
    }
} = user;

console.log(userName);      // 'Alice'
console.log(theme);         // 'dark'
console.log(notifications); // true
```

### Template Literals & Tagged Templates
```javascript
// Template literals
const name = 'Alice';
const age = 30;
const message = `
    Hello, my name is ${name}
    and I am ${age} years old.
    Next year I'll be ${age + 1}.
`;

// Tagged templates
function highlight(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] ? `<mark>${values[i]}</mark>` : '';
        return result + string + value;
    }, '');
}

const emphasized = highlight`Hello ${name}, you are ${age} years old!`;
console.log(emphasized);
// "Hello <mark>Alice</mark>, you are <mark>30</mark> years old!"
```

### Iterators & Iterables
```javascript
// Custom iterator
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    
    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        
        return {
            next() {
                if (current < end) {
                    return { value: current++, done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }
}

// Usage
const range = new Range(1, 5);
for (const num of range) {
    console.log(num); // 1, 2, 3, 4
}

// Converting to array
const rangeArray = [...range]; // [1, 2, 3, 4]
```

### Regular Expressions
```javascript
// Basic regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s-()]+$/;
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// String methods with regex
const text = "Contact us at support@example.com or sales@company.org";
const emails = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g);
console.log(emails); // ['support@example.com', 'sales@company.org']

// Replace with regex
const phoneNumber = "123-456-7890";
const cleanNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
console.log(cleanNumber); // "1234567890"

// Named capture groups
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2023-12-25".match(dateRegex);
console.log(match.groups); // { year: '2023', month: '12', day: '25' }
```

### Performance Optimization
```javascript
// Memoization
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Usage
const fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(50)); // Much faster with memoization

// Lazy evaluation
class LazyArray {
    constructor(generator) {
        this.generator = generator;
    }
    
    map(fn) {
        const generator = this.generator;
        return new LazyArray(function* () {
            for (const item of generator()) {
                yield fn(item);
            }
        });
    }
    
    filter(predicate) {
        const generator = this.generator;
        return new LazyArray(function* () {
            for (const item of generator()) {
                if (predicate(item)) {
                    yield item;
                }
            }
        });
    }
    
    take(n) {
        const generator = this.generator;
        return new LazyArray(function* () {
            let count = 0;
            for (const item of generator()) {
                if (count >= n) break;
                yield item;
                count++;
            }
        });
    }
    
    toArray() {
        return [...this.generator()];
    }
}

// Usage
const lazyNumbers = new LazyArray(function* () {
    for (let i = 1; i <= 1000000; i++) {
        yield i;
    }
});

const result = lazyNumbers
    .filter(n => n % 2 === 0)
    .map(n => n * 2)
    .take(5)
    .toArray();

console.log(result); // [4, 8, 12, 16, 20]
```

---

---

## 🧵 Concurrency: Threads & Async Processing

### Event Loop & Concurrency Model
```javascript
// JavaScript is single-threaded but handles concurrency through event loop
console.log('1'); // Synchronous

setTimeout(() => {
    console.log('2'); // Asynchronous - goes to task queue
}, 0);

Promise.resolve().then(() => {
    console.log('3'); // Asynchronous - goes to microtask queue
});

console.log('4'); // Synchronous

// Output: 1, 4, 3, 2
// (Microtasks have higher priority than tasks)
```

### Promises
```javascript
// Creating promises
const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise 1 resolved');
    }, 1000);
});

const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('Promise 2 rejected'));
    }, 500);
});

// Promise methods
Promise.all([promise1, promise2])
    .then(results => console.log('All resolved:', results))
    .catch(error => console.error('One failed:', error.message));

Promise.allSettled([promise1, promise2])
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index + 1} resolved:`, result.value);
            } else {
                console.log(`Promise ${index + 1} rejected:`, result.reason.message);
            }
        });
    });

Promise.race([promise1, promise2])
    .then(result => console.log('First resolved:', result))
    .catch(error => console.error('First failed:', error.message));
```

### Async/Await
```javascript
// Async function
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Parallel execution
async function fetchMultipleData() {
    try {
        // Sequential (slower)
        const user = await fetchUser();
        const posts = await fetchPosts();
        const comments = await fetchComments();
        
        // Parallel (faster)
        const [user2, posts2, comments2] = await Promise.all([
            fetchUser(),
            fetchPosts(),
            fetchComments()
        ]);
        
        return { user2, posts2, comments2 };
    } catch (error) {
        console.error('Error in parallel fetch:', error);
    }
}
```

### Web Workers (True Parallelism)
```javascript
// Main thread
const worker = new Worker('worker.js');

worker.postMessage({ command: 'start', data: [1, 2, 3, 4, 5] });

worker.onmessage = function(e) {
    console.log('Result from worker:', e.data);
};

worker.onerror = function(error) {
    console.error('Worker error:', error);
};

// worker.js file
self.onmessage = function(e) {
    const { command, data } = e.data;
    
    if (command === 'start') {
        // Heavy computation
        const result = data.map(num => num * num);
        
        // Send result back to main thread
        self.postMessage(result);
    }
};
```

### Generators (Pausable Functions)
```javascript
// Generator function
function* numberGenerator() {
    console.log('Starting generator');
    yield 1;
    console.log('After first yield');
    yield 2;
    console.log('After second yield');
    yield 3;
    console.log('Generator finished');
}

const gen = numberGenerator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Async generator
async function* asyncGenerator() {
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield i;
    }
}

// Usage
(async () => {
    for await (const value of asyncGenerator()) {
        console.log(value);
    }
})();
```

### Advanced Async Patterns
```javascript
// Debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttling
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Rate limiting
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    
    async request(fn) {
        const now = Date.now();
        
        // Remove old requests
        this.requests = this.requests.filter(
            time => now - time < this.windowMs
        );
        
        if (this.
```
