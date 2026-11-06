# DOM api:

Here's Chrome-specific browser vocabulary with detailed technical terms:

**🔧 V8 JavaScript Engine (Chrome)**
- **Ignition** - V8's bytecode interpreter for initial code execution
- **TurboFan** - V8's optimizing compiler for hot code paths
- **Liftoff** - V8's baseline WebAssembly compiler
- **Orinoco** - V8's concurrent garbage collector
- **Scavenger** - Young generation garbage collection in V8
- **Mark-Compact** - Old generation garbage collection algorithm
- **Hidden Classes** - V8's optimization for object property access
- **Inline Caching** - V8's technique for optimizing property lookups
- **Deoptimization** - V8 falls back to interpreter when assumptions fail
- **Torque** - V8's domain-specific language for built-in functions
- **CodeStubAssembler** - V8's framework for generating optimized code stubs
- **Heap Snapshots** - Memory debugging tool in V8

**🎨 Blink Rendering Engine (Chrome)**
- **LayoutNG** - Blink's next-generation layout engine
- **CompositorThread** - Dedicated thread for layer composition
- **PaintWorklet** - Custom painting API in Blink
- **IntersectionObserver** - Blink's API for tracking element visibility
- **ResizeObserver** - Blink's API for monitoring element size changes
- **MutationObserver** - Blink's DOM change notification system
- **StyleEngine** - Manages CSS style computation in Blink
- **LayoutTree** - Internal representation of page layout
- **PaintLayer** - Blink's abstraction for composited elements
- **GraphicsLayer** - Hardware-accelerated rendering layer
- **DisplayList** - Recorded drawing operations for painting
- **RasterInvalidation** - Marks areas needing repainting

**💾 Storage Systems (Chrome)**
- **LevelDB** - Chrome's underlying database for storage APIs
- **Quota Manager** - Controls storage space allocation per origin
- **Storage Partitioning** - Isolates storage by site for security
- **Persistent Storage** - Storage that survives browser restarts
- **Ephemeral Storage** - Temporary storage in incognito mode
- **Blob Storage** - Chrome's system for handling binary data
- **File System Access API** - Chrome's API for local file operations
- **Origin Private File System** - Chrome's sandboxed file system
- **Cache Storage** - Service Worker cache implementation
- **WebLocks API** - Chrome's coordination primitive for shared resources
- **Storage Foundation API** - Low-level storage access (experimental)
- **Persistent Storage Permission** - User permission for unlimited storage

**🌐 Chrome Networking Stack**
- **Cronet** - Chrome's networking library (also used in Android)
- **QUIC Protocol** - Chrome's implementation of Google's transport protocol
- **HTTP/3 Stack** - Chrome's implementation over QUIC
- **DNS-over-HTTPS** - Secure DNS resolution in Chrome
- **Connection Coalescing** - Reuses connections for multiple origins
- **Socket Pools** - Chrome's connection management system
- **Proxy Resolution** - Chrome's system for handling proxy configurations
- **Network Service** - Chrome's isolated networking process
- **Traffic Annotation** - Chrome's system for documenting network requests
- **Network Quality Estimator** - Measures connection quality metrics
- **Expect-CT** - Certificate Transparency enforcement
- **HSTS Preload** - HTTP Strict Transport Security preloaded list
- **Certificate Transparency** - Chrome's CT log verification
- **Mixed Content Upgrader** - Automatically upgrades HTTP to HTTPS
- **Signed Exchange** - Chrome's support for SXG format

**🏗️ Chrome Process Architecture**
- **Site Isolation** - Chrome's security model separating sites
- **Process-per-Site-Instance** - Chrome's process allocation strategy
- **Mojo IPC** - Chrome's inter-process communication system
- **Service Manager** - Chrome's service orchestration framework
- **GPU Sandbox** - Restricted environment for graphics operations
- **Network Sandbox** - Isolated networking in separate process
- **Utility Sandbox** - Sandboxed helper processes for various tasks
- **Zygote Process** - Linux process spawning optimization
- **Broker Process** - Windows sandbox policy enforcement
- **Crashpad** - Chrome's crash reporting system

**🔒 Chrome Security Systems**
- **Safe Browsing** - Chrome's malware/phishing protection
- **Security State API** - Chrome's security indicator system
- **Permissions Policy** - Chrome's feature policy enforcement
- **Trusted Types** - Chrome's XSS prevention API
- **Origin Trials** - Chrome's experimental feature testing
- **SecureContext** - Chrome's secure origin determination
- **Reporting API** - Chrome's violation reporting system
- **Network Error Logging** - Chrome's network failure reporting
- **Certificate Pinning** - Chrome's public key pinning system
- **Site Engagement** - Chrome's user interaction scoring

**⚡ Chrome Performance Systems**
- **Chrome DevTools Protocol** - Debugging and profiling interface
- **Trace Events** - Chrome's internal performance logging
- **User Timing API** - Performance measurement in Chrome
- **Navigation Timing** - Chrome's page load metrics
- **Paint Timing API** - Chrome's rendering performance metrics
- **Long Tasks API** - Chrome's main thread blocking detection
- **Memory Pressure** - Chrome's low memory handling system
- **Tab Discarding** - Chrome's memory management strategy
- **Intervention API** - Chrome's automatic optimization system
- **Loading Priorities** - Chrome's resource loading prioritization
- **Preload Scanner** - Chrome's speculative resource loading
- **Critical Resource Hint** - Chrome's rendering optimization hints

---

Here's the complete unified parsing flow with all paths integrated:

**🔄 Complete Browser Parsing Flow (Chrome) - Sequential Order**

**STEP 1: Network Request**
```
User enters URL → DNS Resolution → TCP Connection → HTTP Request → HTML Response
```

**STEP 2: HTML Parsing Begins**
```
HTML bytes → Tokenizer → HTML Parser → DOM Tree (incremental)
    ↓
Preload Scanner (parallel) → Finds <link>, <script>, <img> → Queue downloads
    ↓
Speculative Parser → Downloads CSS/JS before reaching tags
```

**STEP 3: CSS Processing (Parallel to HTML)**
```
CSS bytes → CSS Tokenizer → CSS Parser → CSSOM Tree
    ↓
Media Query Evaluation → Rule Matching → Cascade Resolution
    ↓
**CSS BLOCKS RENDERING** (waits for CSSOM completion)
```

**STEP 4: JavaScript Encounter**
```
<script> tag found → **HTML PARSING PAUSES**
    ↓
JS bytes → V8 Tokenizer → V8 Parser → AST Generation
    ↓
AST → V8 Ignition (Bytecode) → Execution
    ↓
DOM Manipulation (if any) → **HTML PARSING RESUMES**
```

**STEP 5: Render Tree Construction**
```
DOM Tree + CSSOM Tree → Render Tree Creation
    ↓
Layout Engine (LayoutNG) → Calculate positions/sizes
    ↓
Paint Engine → Fill pixels for each element
    ↓
Compositor → Combine layers → GPU Process → Screen Display
```

---

**⚛️ React Application Complete Flow Path**

**BUILD TIME PATH:**
```
package.json dependencies → npm install → Webpack bundling
    ↓
JSX files → Babel transpiler → JavaScript transformation
    ↓
src/index.js + App.js + components → Single bundle.js creation
```

**RUNTIME PATH:**

**Phase 1: Initial HTML Load**
```
Network → public/index.html → HTML Parser → DOM with <div id="root">
    ↓ (parallel)
bundle.js download → V8 receives React bundle
```

**Phase 2: React Bundle Execution**
```
V8 Tokenizer → Parser → AST (for entire React bundle)
    ↓
Bytecode generation → Ignition execution:
    1. React library code execution
    2. ReactDOM library code execution  
    3. Component definitions (App.js) loaded
    4. src/index.js execution (entry point)
```

**Phase 3: React Bootstrap**
```
ReactDOM.createRoot(document.getElementById('root'))
    ↓
Creates Fiber Root Node → Initializes React Scheduler
    ↓
root.render(<App />) → Schedules initial render work
```

**Phase 4: React Rendering Cycle**
```
App component function execution → Returns JSX
    ↓
JSX → React.createElement() calls → React Elements
    ↓
React Elements → Fiber Node creation → Virtual DOM tree
    ↓
Fiber Reconciler → Diff algorithm → Change detection
    ↓
Commit Phase → DOM mutations → Browser re-render trigger
```

**Phase 5: Browser Re-render**
```
DOM changes → Layout recalculation → Paint → Composite → Display
```

---

**🔄 COMPLETE INTEGRATED PATH (React App)**

```
1. Network Request → HTML download
2. HTML Parser → Creates <div id="root"> + downloads bundle.js
3. CSS Parser (parallel) → App.css processing → CSSOM
4. V8 Engine → bundle.js execution:
   - React libraries load
   - Component definitions load
   - index.js executes
5. ReactDOM.createRoot() → Fiber Root creation
6. root.render(<App />) → React render scheduling
7. App() function → JSX return
8. JSX → React Elements → Fiber Nodes
9. Reconciliation → DOM mutations
10. Browser Layout → Paint → Composite → Display
```

**Critical Blocking Points:**
- **CSS blocks rendering** until CSSOM complete
- **Script tags pause HTML parsing** (unless async/defer)
- **React waits for DOM** before mounting
- **Initial render blocks** until component tree complete

**Parallel Processes:**
- HTML parsing + CSS parsing + Resource downloading
- React reconciliation + Browser layout calculation
- V8 optimization (TurboFan) + React fiber scheduling

This shows the complete sequential flow where each step depends on the previous one, with parallel processes happening simultaneously.
