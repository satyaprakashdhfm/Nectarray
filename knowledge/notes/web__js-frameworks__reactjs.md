- leetcode for frontend 
    https://www.greatfrontend.com/questions
- 25 done :
    https://www.greatfrontend.com/blog/50-must-know-html-css-and-javascript-interview-questions-by-ex-interviewers

# React Development Notes - Complete Guide

## 📝 Key Insights & Quick Facts

- **React Framework vs Library**: React is primarily a library (small API surface for rendering HTML from JS), but with enough packages it feels like a framework
- **Arrow Functions vs Regular Methods**: Arrow functions automatically bind `this` in React class components, preventing common "undefined.setState" errors
- **State vs Props Rule**: If changing a value should update what users see → use state. If it's just data passed down → use props
- **AJAX Advantages**: Better UX with no page reloads, reduced server load by sending only necessary data
- **Virtual DOM**: React's in-memory UI representation that optimizes rendering performance
- **JavaScript is single-threaded but non-blocking - it uses an event loop to handle async operations without freezing the browser. If fetch was synchronous, your entire page would freeze during network requests. Promises make fetch asynchronous, allowing other code to run while waiting for responses.**

    ```javascript
    console.log('1. Start - runs immediately');

    // If this was synchronous, it would FREEZE the browser here
    fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => response.json())
    .then(data => console.log('4. API response received:', data.title));

    console.log('2. This runs immediately (doesn\'t wait for fetch)');

    setTimeout(() => console.log('3. Timer callback'), 0);

    console.log('5. End - also runs immediately');

    // Output order: 1, 2, 5, 3, 4
    // Synchronous code (1,2,5) runs first
    // Then event loop processes async callbacks (3,4) when ready
    ```
    
---

# 1. Core React Concepts

## 1.1 Components & JSX

### Component Definition
A component is a reusable piece of UI that can be used as element in the jsx code where it starts with capital letter and normal html with small letter.

### JSX Definition
JSX is a syntax that combines JavaScript with HTML-like tags to create UI elements in React.

### React Framework vs Library Debate
Mainly: libraries help you accomplish a couple tasks; frameworks define your whole project, from how it does what it does to probably even your file structure and naming conventions.

React really only helps you render HTML from JS, and keep it in-sync with application state. That's it. Its API surface area is really small. That's why it's often considered a library, and not a framework.

But if you pile enough React packages on top of it, it can start to feel pretty frameworky. Does that make sense?

## 1.2 Props vs State

### Props
Props are attributes passed from declaration of component.(in simple terms components are custom html elements and props are its attributes) - Props are read-only and can't be modified inside this component

### State
State is an object that stores dynamic data that determines how a component renders and behaves.( state is just a way for your component to "remember" things that might change, like user input, button clicks, or data from an API. When state changes, your component re-renders to show the new information.)

> so in attribute when we pass a value that changes a variable and it renders whole component again in which it is declared is **state** and in attribute,a value passed to a child component form parent as simple value to a variable which is immutable is a **prop**

### Practical Example

```javascript
// App.jsx
import { useState } from 'react' // Import useState hook from React
import './App.css'

// Child component - receives props from parent
function Greeting(props) {
  // useState hook creates state: likes is state value, setLikes changes it
  // State is internal to component and can be modified
  const [likes, setLikes] = useState(0)

  return (
    <div>
      {/* Props are immutable values passed from parent */}
      <h2>Hello, {props.name}!</h2>
      <p>{props.message}</p>

      {/* State value that changes and re-renders component */}
      <p>Likes: {likes}</p>
      <button onClick={() => setLikes(likes + 1)}>Like</button>
    </div>
  );
}

// Parent component
function App() {
  // useState hook: userName is state, setUserName updates it
  // State lives inside component and triggers re-render when changed
  const [userName, setUserName] = useState("John")

  return (
    <div className="container">
      <h1>Welcome to My App</h1>
      
      {/* Props: passing data down to child components */}
      <Greeting 
        name={userName}        // State value passed as prop
        message="Have a great day!" 
      />
      <Greeting 
        name="Sarah"          // Direct value passed as prop
        message="Nice to meet you!" 
      />

      {/* setState function changes state and re-renders component */}
      <button onClick={() => setUserName("Jack")}>
        Change First User
      </button>
    </div>
  )
}

export default App;
```

---

# 2. React Hooks - https://youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h&si=Yp-vo3c24LAcPNH_

## 2.1 Hook Definition & Rules

A hook is a function that lets you use React features like state and lifecycle in functional components.

### Rules of Hooks (Must Follow!)

1. **Only call hooks at the top level** - Never inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - React components or custom hooks only
3. **Start custom hook names with "use"** - Like `useCustomHook`
4. **Don't call hooks conditionally** - Same hooks must run in same order every render

```javascript
// ❌ WRONG - Don't do this
function BadComponent() {
  if (someCondition) {
    const [state, setState] = useState(); // Never inside if!
  }
  
  for (let i = 0; i < 5; i++) {
    useEffect(() => {}); // Never inside loops!
  }
}

// ✅ CORRECT - Do this
function GoodComponent() {
  const [state, setState] = useState(); // Always at top level
  
  useEffect(() => {
    if (someCondition) {
      // Conditions inside hooks are fine
    }
  });
}
```

## 2.2 Core React Hooks

- **useState Hook**: Lets functional components manage and update state.
  - **Syntax:** `const [stateValue, setStateFunction] = useState(initialValue);`
  - to use setStateFunction we can set using direct value or function type(`setState(prevState => newState)`-arrow function without block , `setState(prevState => {return newState;})`-arrow function with block)
  - ```javascript
    const [count, setCount] = useState(0);
    const [name, setName] = useState('John');
    const [items, setItems] = useState([]);
    const [items, setItems] = useState({count:1,theme:'dark'})
    ```

- **useEffect Hook**: Performs side effects like fetching data, subscriptions, timers.
  - **Syntax:** `useEffect(effectFunction, dependencyArray)`
  - ```javascript
    useEffect(() => {}, []); // Run once on mount
    useEffect(() => {}); // Run on every render
    useEffect(() => {}, [count]); // Run when count changes
    ```
  - LifeCycle hook:
  
    React lifecycle hooks are functions that allow you to execute code at specific moments during a component's existence - when it's created, updated, or destroyed in the DOM.

    ## Key Points
    • **Mounting**: Component is created and added to DOM - useEffect body runs
    • **Updating**: Component re-renders due to state/prop changes - useEffect body runs again
    • **Unmounting**: Component is removed from DOM - cleanup function (return) runs
    • **Dependencies**: Control when effects run using dependency array `[value]`
    • **Cleanup**: Always clean up timers, subscriptions to prevent memory leaks

  - Example
  ```javascript
  function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      // MOUNTING/UPDATING: Fetch user data
      fetchUser(userId).then(setUser);
      
      // UNMOUNTING: Cleanup function
      return () => {
        console.log('Cleaning up user profile');
      };
    }, [userId]); // Re-run when userId changes

    return <div>{user?.name}</div>;
  }
  ```
  - **What happens if you DON'T have the cleanup function:**

    **Without cleanup:**
    ```javascript
    useEffect(() => {
      const interval = setInterval(() => {
        console.log('Running every second');
      }, 1000);
      // NO return - timer keeps running forever!
    }, []);
    ```

    **Problems:**
    - Timer runs FOREVER even after component is destroyed
    - Memory leak - timer never stops
    - If component mounts/unmounts multiple times, you get multiple timers running
    - Browser gets slower and slower

    **With cleanup:**
    ```javascript
    useEffect(() => {
      const interval = setInterval(() => {
        console.log('Running every second');
      }, 1000);
      
      return () => clearInterval(interval); // Stops timer when component dies
    }, []);
    ```

    **Think of it like:** 
    - You turn on a tap (useEffect)
    - You MUST turn it off when you leave (cleanup function)
    - If you don't turn it off, water keeps running and floods the house (memory leak)

    - The cleanup function is like turning off the tap when you're done!

- **useRef Hook**: Access DOM elements or store mutable values without re-renders.
  - **Key Rule:** If changing the value should update what the user sees → use state. If it's just for internal tracking → use ref.
  - | Use Case                | Purpose                                                                      |
    | ----------------------- | ---------------------------------------------------------------------------- |
    | 📌 Access DOM           | Interact with real elements (`input`, `video`, `.click()`, `.focus()`, etc.) |
    | 🧠 Store Mutable Values | Save values between renders without causing a re-render                      |
  - **Syntax:** `const refContainer = useRef(initialValue);`
  - ```javascript
    const inputRef = useRef(null);
    const prevValue = useRef('');
    ```
## 2.3 Additional React Hooks (Most Used 20)

- **useContext**: Access React Context values without Consumer wrapper.
  - **Syntax:** `const contextValue = useContext(MyContext);`
  - ```javascript
    const theme = useContext(ThemeContext);
    const user = useContext(UserContext);
    ```

- **useReducer**: Alternative to useState for complex state logic.
  - **Syntax:** `const [state, dispatch] = useReducer(reducer, initialState);`
  - ```javascript
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });
    ```

- **useMemo**: Memoize expensive calculations to optimize performance.
  - **Syntax:** `const memoizedValue = useMemo(() => computation, dependencies);`
  - ```javascript
    const expensiveValue = useMemo(() => heavyCalculation(a, b), [a, b]);
    ```

- **useCallback**: Memoize functions to prevent unnecessary re-renders.
  - **Syntax:** `const memoizedCallback = useCallback(callbackFunction, dependencies);`
  - ```javascript
    const handleClick = useCallback(() => doSomething(a, b), [a, b]);
    ```

- **useLayoutEffect**: Similar to useEffect but fires synchronously after DOM mutations.
  - **Syntax:** `useLayoutEffect(effectFunction, dependencies);`
  - ```javascript
    useLayoutEffect(() => {
      // Runs before browser paints
    }, []);
    ```

- **useImperativeHandle**: Customize the instance value exposed to parent components when using ref.
  - **Syntax:** `useImperativeHandle(ref, createHandle, dependencies);`
  - ```javascript
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }));
    ```

- **useDebugValue**: Displays a label for custom hooks in React DevTools.
  - **Syntax:** `useDebugValue(value);`
  - ```javascript
    useDebugValue(isOnline ? 'Online' : 'Offline');
    ```

## 2.4 Custom Hooks (Most Common Patterns)

### useLocalStorage
Store state in localStorage.

```javascript
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
};
```

### useFetch
Fetch data from API.

```javascript
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
};
```

### useToggle
Toggle boolean state.

```javascript
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
};
```

### useInterval
Set up intervals that clean up automatically.

```javascript
const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => { savedCallback.current = callback; }, [callback]);
};
```

### useWindowSize
Get current window dimensions.

```javascript
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
};
```

### usePrevious
Get previous value of a state or prop.

```javascript
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
};
```

### useOnClickOutside
Detect clicks outside of component.

```javascript
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
  });
};
```

### useKeyPress
Detect when specific key is pressed.

```javascript
const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);
  useEffect(() => {
    const downHandler = ({ key }) => key === targetKey && setKeyPressed(true);
  });
};
```

### useAsync
Handle async operations with loading states.

```javascript
const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
};
```

### useHover
Detect hover state of element.

```javascript
const useHover = () => {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  return [ref, value];
};
```

# 3. Event Handling

## 3.1 Event Types
- Functions that run when user interacts with elements.
- Each event has a handler function that executes when the event happens.

  - Common Event Types:
    - **onClick** - Runs when element is clicked
    - **onChange** - Runs when input value changes  
    - **onSubmit** - Runs when form is submitted
    - **onMouseOver** - Runs when mouse hovers over element
    - **onMouseOut** - Runs when mouse leaves element
    - **onFocus** - Runs when element gets focus (clicked/tabbed to)
    - **onBlur** - Runs when element loses focus
    - **onKeyDown** - Runs when key is pressed down
    - **onKeyUp** - Runs when key is released
    - **onDoubleClick** - Runs when element is double-clicked
    - **onScroll** - Runs when page/element is scrolled
    - **onLoad** - Runs when page/image finishes loading
-  why does onClick={() => increaseCount()} works AND why onClick={increaseCount()} or onClick={() => increaseCount} doesn't work?
    - onClick={increaseCount()} -> React runs increaseCount as soon as this code is encountered. increaseCount changes state and causes a re-render, and in the next render cycle same thing happens causing a cycle. This should have infinite renders.

    - onClick={() => increaseCount} -> Like the first one but here inside the function body, () is missing after increaseCount. This does not execute the function increaseCount when the event happens. A simple statement with function name without the parentheses will do nothing.


## 3.2 The 'this' Binding Problem in Class Components

  ```javascript
  class Button extends React.Component {
    constructor(props) {
      super(props);
      this.state = { count: 0 };
    }

    // Regular method - loses 'this' when passed as prop
    regularClick() {
      this.setState({ count: this.state.count + 1 }); // ERROR!
    }

    // Arrow function - keeps 'this' when passed as prop
    arrowClick = () => {
      this.setState({ count: this.state.count + 1 }); // WORKS!
    }

    render() {
      return (
        <div>
          <p>Count: {this.state.count}</p>
          <button onClick={this.regularClick}>Regular (Breaks)</button>
          <button onClick={this.arrowClick}>Arrow (Works)</button>
        </div>
      );
    }
  }
  ```

- **The Problem:** `onClick={this.regularClick}` passes the function without its `this` context, so `this.setState` becomes `undefined.setState` and crashes.
- **The Solution:** Arrow functions automatically bind `this` to the component instance.

---

# 4. Component Types & Patterns

## 4.1 Class Components vs Functional Components

### Class Components
Class Components are the older way to create React components using ES6 classes. They were the primary way before React Hooks were introduced.

```javascript
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: 'John'
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

## 4.2 Controlled vs Uncontrolled Components

**Controlled vs Uncontrolled Components** refer to how form inputs manage their data in React.

### Controlled Components
**React controls the input value** - the value is stored in React state and updated via event handlers.

```javascript
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value} // React controls this
      onChange={(e) => setValue(e.target.value)} // Update state
    />
  );
}
```

**Characteristics:**
- Input value comes from React state
- Changes handled by React event handlers
- React is the "single source of truth"
- Can validate/format input in real-time
- Easy to reset, pre-populate, or transform data

### Uncontrolled Components
**DOM controls the input value** - React doesn't manage the value, just reads it when needed.

```javascript
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value); // Read from DOM
  };
  
  return (
    <input 
      ref={inputRef} // Access DOM directly
      defaultValue="initial value" // Set initial value
    />
  );
}
```

**Characteristics:**
- Input value managed by DOM
- Use `ref` to access value when needed
- Use `defaultValue` instead of `value`
- Less React code, more like traditional HTML
- Good for simple forms or integrating with non-React libraries

### Comparison Table:

| Aspect | Controlled | Uncontrolled |
|--------|------------|--------------|
| **Data source** | React state | DOM |
| **Real-time validation** | ✅ Easy | ❌ Harder |
| **Dynamic updates** | ✅ Easy | ❌ Manual |
| **Performance** | Re-renders on change | No re-renders |
| **Code complexity** | More setup | Less setup |

### When to Use:

**Controlled**: Most form inputs, real-time validation, dynamic forms, search filters

**Uncontrolled**: Simple forms, file inputs (always uncontrolled), integrating with third-party libraries

### Mixed Example:
```javascript
function Form() {
  const [email, setEmail] = useState(''); // Controlled
  const passwordRef = useRef(); // Uncontrolled
  
  return (
    <form>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password"
        ref={passwordRef}
        defaultValue=""
      />
    </form>
  );
}
```

**Rule of thumb**: Use controlled components unless you have a specific reason not to!

## 4.3 Component Composition Patterns

### Components as Props
You can pass entire components (not just data) as props to other components.

**Useful for**: 
- Creating flexible, reusable layouts
- Building wrapper components that can display any content
- Making components that don't know what they'll contain

### Nested Components
Components inside other components (like HTML tags inside each other).

**Why useful?**
- Card component doesn't know what content it will show
- Same Card can display login, error, welcome, etc.
- Makes components super reusable and flexible

**Nested components**: WelcomeMessage is nested inside Card, Card is nested inside App.

```javascript
import { useState } from 'react';

// Simple components to pass as props
function LoginButton() {
  return <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>;
}

function WelcomeMessage() {
  return <h3 className="text-green-600">Welcome back!</h3>;
}

function ErrorMessage() {
  return <p className="text-red-500">Something went wrong!</p>;
}

// Wrapper component that accepts other components as props
function Card({ title, content, footer }) {
  return (
    <div className="border p-4 m-2 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      
      {/* Nested component: content component inside Card */}
      <div className="mb-4">
        {content}  {/* This is a component passed as prop */}
      </div>
      
      <div className="border-t pt-2">
        {footer}   {/* This is a component passed as prop */}
      </div>
    </div>
  );
}

export default function App() {
  const [showError, setShowError] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Components as Props Example</h1>
      
      {/* Passing components as props to Card */}
      <Card 
        title="User Dashboard"
        content={<WelcomeMessage />}           // Component as prop
        footer={<LoginButton />}              // Component as prop
      />
      
      <Card 
        title="Status"
        content={showError ? <ErrorMessage /> : <p>All good!</p>}  // Conditional component
        footer={
          <button 
            onClick={() => setShowError(!showError)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Toggle Error
          </button>
        }
      />
    </div>
  );
}
```

## 4.4 Fragments

**Fragment** – Learn how to return multiple elements without wrappers. 

```javascript
function Header() {
  return (
    <>
      <h1>Welcome</h1>
      <nav>Navigation here</nav>
    </>
  );
}
```

---

# 5. Rendering Patterns

## 5.1 Conditional Rendering

**Conditional Rendering**: Conditional rendering means showing different content based on conditions like state or props. using ternary operator or | or && flow control

```javascript
import { useState } from 'react';

export default function ConditionalExample() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="p-4">
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle
      </button>
      
      {isVisible && <p>Hello! I'm visible now!</p>}
    </div>
  );
}
```

**Conditional Rendering**: Show or hide elements based on a condition.

`{isVisible && <p>Hello!</p>}` - Shows paragraph only if `isVisible` is true.

## 5.2 List Rendering

Display arrays of data by converting each item into JSX using .map()

Advantage: Shows only existing items - if item is removed from array, it automatically disappears from screen without leaving gaps.

```javascript
export default function ListExample() {
  const fruits = ['Apple', 'Banana', 'Orange'];

  return (
    <div className="p-4">
      <h2>My Fruits:</h2>
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Keys in Lists
**Key**: A key is a unique identifier used in lists to help React manage and update items efficiently.

---

# 6. AJAX & API Integration

## 6.1 Modern AJAX with Fetch

```javascript
const response = await fetch('/api/endpoint');
const data = await response.json();
```

This uses async/await syntax to make it more readable while still keeping the core AJAX functionality of fetching data without refreshing the page.

## 6.2 AJAX Advantages & Disadvantages

### Advantages:
1. **Better UX** - No page reloads, faster and smoother interactions
2. **Reduced server load** - Only sends/receives necessary data, not entire HTML pages

### Disadvantages:
1. **SEO challenges** - Search engines have trouble indexing dynamically loaded content
2. **Browser history issues** - Back/forward buttons don't work as expected without extra handling

---

# 7. Advanced React Concepts

## 7.1 React Portals

**React Portals** let you render components outside their normal parent hierarchy in the DOM tree, while keeping them logically connected in the React component tree.

### What Problem Do Portals Solve?

Normally, React components render inside their parent's DOM element. But sometimes you need to "escape" this - like for modals, tooltips, or dropdowns that need to appear on top of everything else.

### Syntax
```javascript
import { createPortal } from 'react-dom'

createPortal(children, domNode)
```

### Common Use Cases:

#### 1. Modals/Dialogs
```javascript
function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  
  // Renders inside document.body instead of parent component
  return createPortal(
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>,
    document.body
  );
}
```

#### 2. Tooltips
```javascript
function Tooltip({ text, targetElement }) {
  return createPortal(
    <div className="tooltip">{text}</div>,
    targetElement // Render near the target element
  );
}
```

#### 3. Notifications/Toast
```javascript
function Toast({ message }) {
  return createPortal(
    <div className="toast">{message}</div>,
    document.getElementById('toast-root') // Dedicated container
  );
}
```

### Key Benefits:

- **CSS stacking**: Escape z-index issues by rendering at document root
- **Event bubbling**: Events still bubble up through React component tree (not DOM tree)
- **Logical structure**: Component stays connected to its React parent for props/state
- **Styling isolation**: Avoid CSS inheritance problems

### HTML Structure:
```html
<div id="root">
  <!-- Your main app -->
</div>
<div id="modal-root">
  <!-- Portals render here -->
</div>
```

Portals are perfect when you need something to appear "outside" visually but stay "inside" logically in your React app!

## 7.2 React Context

**Context** – Share data like theme or user across many components.
**useContext** – Use the shared context data in functional components.

```javascript
import { createContext, useContext, useState } from 'react';

// 1. Create Context
const UserContext = createContext();

// 2. Provider (Wrapper)
function App() {
  const [user, setUser] = useState('John');
  
  return (
    <UserContext.Provider value={user}>
      <Parent />
    </UserContext.Provider>
  );
}

// 3. Skip Middle Components
function Parent() {
  return <Child />; // No props needed!
}

// 4. Use Context Anywhere
function Child() {
  const user = useContext(UserContext);
  return <h1>Hello {user}!</h1>;
}
```

### Context Definition
**Context** = Share data between components without passing props through every level.

**Problem it solves:** Prop drilling (passing props down multiple levels)

**How it works:**
1. Create context with `createContext()`
2. Wrap components with `Provider` 
3. Access data anywhere with `useContext()`

That's it! Context lets you "teleport" data to any component in the tree.

---

# 8. React Router

## 8.1 Installation
```bash
npm install react-router-dom
```

## 8.2 Basic Setup
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 8.3 Router Types
- **`BrowserRouter`** - Clean URLs (example.com/about)
- **`HashRouter`** - Hash URLs (example.com/#/about)

## 8.4 Core Components
- **`<Routes>`** - Container for all routes
- **`<Route>`** - Defines path and component
- **`<Link>`** - Navigation links
- **`<NavLink>`** - Links with active styling

## 8.5 Navigation
```javascript
import { Link, NavLink } from 'react-router-dom';

// Basic link
<Link to="/about">About</Link>

// Link with active styling
<NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>
  About
</NavLink>
```

## 8.6 Route Types
```javascript
<Routes>
  <Route path="/" element={<Home />} />                    {/* Exact match */}
  <Route path="/users/:id" element={<User />} />           {/* Dynamic param */}
  <Route path="/products/*" element={<Products />} />      {/* Nested routes */}
  <Route path="*" element={<NotFound />} />                {/* Catch all */}
</Routes>
```

## 8.7 Get Route Data
```javascript
import { useParams, useNavigate } from 'react-router-dom';

function User() {
  const { id } = useParams();        // Get :id from URL
  const navigate = useNavigate();    // Programmatic navigation
  
  return (
    <div>
      <p>User ID: {id}</p>
      <button onClick={() => navigate('/home')}>Go Home</button>
    </div>
  );
}
```

## 8.8 Nested Routes
```javascript
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>

// In Dashboard component
import { Outlet } from 'react-router-dom';
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}
```

## 8.9 Complete Example
```javascript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/123">User 123</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
```

That's it! Router = navigation between pages without page refresh.

---

# 9. State Management

## 9.1 Advanced State Management (Redux)

🟣 **Advanced (Redux and Middleware)**

Once you're comfortable with React and Context, move to more powerful state management.

### Redux Concepts:
1. **Redux** – Centralized state management across the whole app.
2. **Store** – Learn where Redux state is held.
3. **Action** – Describe events that should change the state.
4. **Dispatch** – Send actions to update the Redux store.
5. **Reducer** – Logic to compute new state from action and old state.
6. **Thunk / Middleware** – Handle async operations like API calls in Redux.

---

# 10. Next.js Framework

## 10.1 API vs SSR Comparison

✅ **API (Client-Side) vs SSR (Server-Side Rendering)**

| Feature           | **API-Based (Client-Side Rendering)**     | **Server-Side Rendering (SSR)**                   |
| ----------------- | ----------------------------------------- | ------------------------------------------------- |
| **What is sent?** | Only JSON data                            | Full HTML (pre-rendered using data)               |
| **When to use?**  | Apps, dashboards, chat, dynamic tools     | Blogs, SEO pages, landing pages, product details  |
| **Pros**          | Fast UX, reusable frontend, easy to scale | Better SEO, faster first paint, shareable content |
| **Cons**          | Poor SEO, slower initial load, JS required | Slower navigation, more server load, complex state |
| **Popular Frameworks** | **React SPA**, **Vue.js**, **Angular**, **Svelte** | **Next.js**, **Nuxt.js**, **SvelteKit**, **Remix** |

## 10.2 Next.js Core Concepts

### Essential Next.js Features:
1. **Pages and Routing** - File-based routing system
2. **Components** - React functional and class components
3. **Server-Side Rendering (SSR)** - Pre-rendering pages on the server
4. **Static Site Generation (SSG)** - Pre-building pages at build time
5. **API Routes** - Backend API endpoints within Next.js
6. **Dynamic Routing** - URL parameters and catch-all routes
7. **Image Optimization** - Next.js Image component for performance
8. **CSS Modules/Styled JSX** - Component-scoped styling
9. **Data Fetching** - getStaticProps, getServerSideProps, SWR/React Query
10. **Middleware** - Request/response interception and modification

### 5 Most Notable Next.js Features React Doesn't Have:

1. **File-based Routing** - Automatic routing based on file structure, no need for React Router setup

2. **Built-in Server-Side Rendering (SSR)** - Pages render on the server by default, React is client-side only

3. **API Routes** - Create backend endpoints directly in your Next.js app without separate server

4. **Automatic Code Splitting** - Bundles are automatically split per page for optimal loading

5. **Image Optimization** - Built-in Image component with automatic optimization, lazy loading, and responsive images

---

# 11. Styling Solutions

## 11.1 Tailwind CSS vs Regular CSS

| Feature | Tailwind CSS | Regular CSS |
|---------|--------------|-------------|
| **Writing Style** | Use ready-made classes like `bg-red text-white` | Write your own CSS code like `background: red; color: white;` |
| **Where You Write** | Put classes directly in HTML | Write CSS in separate files |
| **Learning** | Learn class names | Learn CSS properties |
| **Control** | Limited to what Tailwind provides | Full control over everything |
| **File Size** | Starts big, gets smaller after cleanup | Starts small, can get messy |

## 11.2 Component Libraries

### Daisy UI
- **daisy ui** - Component library built on top of Tailwind CSS

---

# 12. Additional Learning Topics

## 12.1 Essential React Concepts to Master

1. **Fragment** – Learn how to return multiple elements without wrappers
2. **Controlled Component** – Understand how form inputs work with React state
3. **Uncontrolled Component** – Explore how form inputs can be handled via the DOM
4. **Ref** – Learn how to directly access DOM elements or components
5. **Lifecycle Methods** – Important if you're learning class components (for understanding mounting, updating, unmounting)

## 12.2 Form Handling with Components
- Form handling with componenets

## 12.3 Custom Hooks
- custom_created_hooks:

---
