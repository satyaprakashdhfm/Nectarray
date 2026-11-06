### Hardware → OS → Node.js runtime → Express.js
### Hardware → OS → Python + WSGI server → Django
### Hardware → OS → JVM + Tomcat → Spring Boot


## 🔄 **Synchronous vs Asynchronous Nature**

### ✅ **The Reality:**

| Language | **Nature** | **Key Point** |
|----------|------------|---------------|
| **JavaScript** | **Asynchronous by design** | Event loop, non-blocking I/O |
| **Java** | **Synchronous by default** | But can do async with threads |
| **Python** | **Synchronous by default** | But has async capabilities |

---

### 🧠 **Important Distinction:**

**Languages themselves aren't inherently sync/async** - it's about:
1. **Default behavior** 
2. **How easy it is** to write async code
3. **Runtime architecture**

---

### 🎯 **Detailed Breakdown:**

**JavaScript (Node.js)**:
- **Naturally asynchronous** - everything is non-blocking by default
- **Single-threaded** with event loop
- **Async is the norm** (callbacks, promises, async/await)

**Java**:
- **Synchronous by default** - one line executes after another
- **Multi-threaded** - can run multiple things simultaneously
- **Async requires work** (CompletableFuture, reactive streams)

**Python**:
- **Synchronous by default** - similar to Java
- **Async support added later** (asyncio, async/await since Python 3.5)
- **Choice between sync and async** approaches

---

### 💡 **Web Framework Behavior:**

| Framework | Default Behavior | Async Support |
|-----------|------------------|---------------|
| **Express.js** | Async (non-blocking) | ✅ Built-in |
| **Spring Boot** | Sync (blocking) | ✅ Available (WebFlux) |
| **Django** | Sync (blocking) | ✅ Available (ASGI) |
| **FastAPI** | **Async-first** | ✅ Native async |

---

### 🔑 **Key Takeaway:**

- **JavaScript** = Async by nature
- **Java & Python** = Sync by default, async when needed
- **Modern frameworks** in all languages support both patterns
- The choice depends on your **use case** (I/O heavy = async better, CPU heavy = sync often fine)

So JavaScript is the odd one out - it's **async-first**, while Java and Python are **sync-first** with async capabilities!

🟩 **1. Median Latency**

> **What it means:**
> This is the *typical* time it takes for the backend to respond to a request.
> If you send 100 requests, about 50 of them will take **less than or equal to** this much time.

> **How to think of it:**
> It’s like asking, “What’s the average speed of a normal reply from this backend?”
> Lower = snappier feeling for the user.

 🟨 **2. Throughput (RPS)**

> **What it means:**
> This is how many requests per second (RPS) the backend can handle while still working well.

> **How to think of it:**
> It’s like the speed of a printer — how many pages (responses) it can give per second.
> Higher = more users it can handle at once.

🟧 **3. Concurrency Threshold**

> **What it means:**
> This is roughly how many users can send requests *at the same time* before the system starts slowing down badly (e.g. responses take longer than 1 second).

> **How to think of it:**
> Think of it like a restaurant: how many people it can serve before the kitchen gets overwhelmed and orders slow down.
> Higher = better under pressure.

🟥 **4. Memory Usage**

> **What it means:**
> How much RAM the backend app typically uses — idle and under stress.

> **How to think of it:**
> Like how much fuel the engine burns. More memory = heavier, possibly more expensive to host.
> Lower = lighter, cheaper to run — but may trade off features or speed.

| **Language**   | **Stack**           | **Frontend** | **Backend**     | **Used For (App Type)**                | **Examples**                                                 | **Median Latency**  | **Throughput (RPS)** | **Concurrency Threshold** | **Memory Usage** | **Top 5 Popular Libraries / Tools**                             | **Industry Fit**             |
| -------------- | ------------------- | ------------ | --------------- | -------------------------------------- | ------------------------------------------------------------ | ------------------- | -------------------- | ------------------------- | ---------------- | --------------------------------------------------------------- | ---------------------------- |
| **Python**     | Django              | React        | Django          | Internal Web apps, dashboards          | Instagram, Pinterest, Disqus, Reddit, NASA, Spotify, YouTube | \~8 ms              | \~1,150              | \~340 users               | \~150–400 MB     | Celery, Django REST Framework, Graphene, TensorFlow, PyTest     | Social, Admin Panels, EdTech |
|                | FastAPI             | Vue/React    | FastAPI         | High-performance APIs for Web & Mobile | Uber, Netflix, Microsoft, Expedia, Zalando, Primer           | \~2–6 ms            | \~18,000–21,000      | \~1,000+ users            | \~1–1.2 GB       | Pydantic, SQLModel, Uvicorn, TensorFlow, PyTorch                | ML/AI APIs, Developer Tools  |
| **JavaScript** | MERN                | React        | Node.js/Express | Real-time Web apps, chat               | Uber Eats, Airbnb, Walmart, Instagram, Netflix, Twitter      | \~10–20 ms          | \~15,000–20,000      | \~365 users               | \~100–400 MB     | Mongoose, Socket.io, Redux, Express-validator, TensorFlow\.js   | eCommerce, Real-Time Social  |
|                | Next.js             | Next.js      | Node.js         | SEO-friendly Web apps, landing pages   | OpenAI, Netflix Jobs, Nike, Hulu, Marvel, Twitch, GitHub     | \~10–20 ms          | \~10,000–15,000      | \~365 users               | \~100–400 MB     | NextAuth.js, Prisma, SWR, React Query, Tailwind CSS             | Streaming, Docs, Marketing   |
| **Java**       | Spring Boot + React | React        | Spring Boot     | Scalable Enterprise Web platforms      | Netflix, Alibaba, LinkedIn, Intuit, Udemy, CRED              | \~5–6 ms            | \~7,000–30,000       | \~355 users               | \~200 MB–1 GB    | Hibernate, Spring Data JPA, MapStruct, Kafka, OpenAPI (Swagger) | Enterprise, Banking, Fintech |
|                | Micronaut           | Vue          | Micronaut       | Cloud-native APIs and backend services | Target, Mojang (Minecraft), Samsung SmartThings, Alibaba     | \~5–10 ms (runtime) | \~2,800–150k         | \~500+ users              | \~50–60 MB       | Jackson, Reactor, GraalVM, Kafka, Micronaut Security            | IoT, Cloud APIs, Gaming      |

**Rendering Patterns:**
1. **CSR (Client-Side Rendering)** - The browser downloads a minimal HTML shell and JavaScript renders all content dynamically on the client side.

2. **SSR (Server-Side Rendering)** - HTML is fully rendered on the server for each request and sent to the browser, often followed by hydration for interactivity.

3. **SSG (Static Site Generation)** - HTML pages are pre-built at build time and served as static files, with optional hydration for dynamic features.

4. **ISR (Incremental Static Regeneration)** - Combines static generation with the ability to update or create new static pages on-demand after the initial build without rebuilding the entire site.

5. **Hydration** - The process of attaching JavaScript event listeners and state to server-rendered HTML to make it interactive on the client side.

**Architecture Patterns:**
6. **Static Website** - A website with fixed HTML, CSS, and JavaScript files that are served directly to users without server-side processing.

7. **Multi Page Apps** - Traditional web applications where each page requires a full server request and complete page reload when navigating between different URLs.

8. **Single Page App (SPA)** - A web application that loads once and dynamically updates content without full page reloads, typically using JavaScript frameworks like React or Vue.

9. **Partial Hydration** - Only specific components or sections of a page are made interactive with JavaScript, while other parts remain static HTML for better performance.

10. **Islands** - An architecture where interactive components are isolated "islands" of interactivity surrounded by static HTML, reducing JavaScript bundle size and improving performance.

11. **Streaming SSR** - Server-side rendering technique that sends HTML to the browser in chunks as it's generated, allowing faster initial page loads and progressive enhancement.

12. **Resumability** - An approach where the server renders the application state and the client can immediately resume execution without re-running initialization code, eliminating hydration overhead.
