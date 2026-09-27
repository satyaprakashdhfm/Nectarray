/**
 * The finished projects a student can take into an interview: the source as
 * a zip, and the guide that explains it, served from
 * content/placement-projects/<slug>/ by /api/placement/projects.
 *
 * Everything written here is drawn from each project's own guide, so the
 * page and the PDF never disagree about what the project does.
 */

export type PlacementProject = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  stack: string[];
  /** Numbers worth saying out loud in an interview. */
  facts: { value: string; label: string }[];
  highlights: { title: string; body: string }[];
  run: { label: string; commands: string }[];
  /** Questions an interviewer is likely to ask, and the short answer. */
  talkingPoints: { q: string; a: string }[];
  zipName: string;
  zipBytes: number;
  guideName: string;
  guidePages: number;
};

export const PLACEMENT_PROJECTS: PlacementProject[] = [
  {
    slug: "ai-invoice-auditor",
    title: "AI Invoice Auditor",
    kind: "Agentic AI · Full stack",
    summary:
      "Supplier invoices arrive as PDFs. A pipeline reads each one, checks it against the ERP's vendor and purchase-order records over an MCP server, and stores the clean ones automatically. Anything that does not match waits for a human to approve or reject. Afterwards, a chat answers questions about the invoices using vector search and Gemini.",
    stack: [
      "React + Vite",
      "FastAPI",
      "MCP (FastMCP)",
      "LangGraph",
      "LangChain",
      "Google Gemini",
      "pypdf + regex",
    ],
    facts: [
      { value: "100", label: "invoices audited per run" },
      { value: "92 / 8", label: "auto-stored / held for review" },
      { value: "0.9 s", label: "full run, down from 13.7 s" },
      { value: "9", label: "audit rules" },
    ],
    highlights: [
      {
        title: "No model touches the audit",
        body: "Fields are read with regex and checked by plain rules, so a verdict is repeatable, explainable line by line, free to run, and never stopped by a rate limit. Gemini is used for the chat only.",
      },
      {
        title: "The ERP sits behind an MCP server",
        body: "A separate server on port 8001 exposes two read-only tools, get_vendor and get_po. Nothing in the app opens the ERP files, so the rules never change when the mock ERP is swapped for a real one.",
      },
      {
        title: "Human in the loop",
        body: "Any finding (price, quantity, total, an item that is not on the PO, vendor, currency) holds the invoice for review. The reviewer approves or rejects it on a card, and the chat sees the new status straight away.",
      },
      {
        title: "RAG chat over the results",
        body: "A two-step LangGraph graph embeds each audited invoice with gemini-embedding-001. The chat retrieves the 8 closest invoices and adds a one-line summary of all of them, so it can answer both 'which' and 'how many'.",
      },
    ],
    run: [
      {
        label: "Once, from the project folder",
        commands:
          "python -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npip install -r requirements.txt\ncd frontend; npm install; cd ..",
      },
      {
        label: "Terminal 1 · ERP MCP server",
        commands: "python -m backend.mcp_servers.mcp_server",
      },
      {
        label: "Terminal 2 · API (http://localhost:8000/docs)",
        commands: "uvicorn backend.app.main:app --reload --port 8000",
      },
      {
        label: "Terminal 3 · UI (http://localhost:5173)",
        commands: "cd frontend; npm run dev",
      },
    ],
    talkingPoints: [
      {
        q: "Why not let the LLM read the invoices?",
        a: "An earlier version did, and it was removed: 100 model calls per run, a key before anything starts, rate limits halfway through, and replies to double-check. Regex gives the same 92 / 8 verdict in 0.74 s for nothing. The reader is one function, extract(path), so a layout-aware model can replace it when invoices come in many layouts.",
      },
      {
        q: "Why put the ERP behind MCP?",
        a: "It is the only place the auditor reaches the system of record. Behind MCP another team can own and secure it, other agents can reuse it, and swapping the mock ERP for a real one changes the server, not the rules.",
      },
      {
        q: "How did you make it fast?",
        a: "Opening an MCP session costs about 150 ms and a call on an open session about 8 ms. Reading every PDF first and fetching all vendors and POs over one session took a run from 13.7 s to 0.9 s.",
      },
      {
        q: "Why one vector per invoice, with no chunking?",
        a: "Each record is a few hundred characters the system wrote itself. Chunking would put the problem in one chunk and the invoice number in another, and search would return fragments instead of invoices.",
      },
    ],
    zipName: "ai-invoice-auditor.zip",
    zipBytes: 273671,
    guideName: "AI-Invoice-Auditor-Technical-Guide.pdf",
    guidePages: 5,
  },
  {
    slug: "student-management",
    title: "Student Management System",
    kind: "Full stack · Web app",
    summary:
      "A school management app with three roles. Admins run classes, students, teachers, fees, exams, holidays and the timetable. Teachers take attendance, enter marks and track the syllabus. Students see their timetable, attendance, fees and results. A React single-page app talks to a FastAPI backend, which stores everything through the SQLAlchemy ORM in SQLite or PostgreSQL.",
    stack: [
      "React 18",
      "React Router 6",
      "FastAPI",
      "SQLAlchemy 2.0",
      "SQLite / PostgreSQL",
      "PBKDF2 + HMAC tokens",
    ],
    facts: [
      { value: "3", label: "roles: admin, teacher, student" },
      { value: "11", label: "database tables" },
      { value: "29", label: "role pages (17 + 6 + 6)" },
      { value: "12", label: "demo students seeded on first run" },
    ],
    highlights: [
      {
        title: "One codebase, two databases",
        body: "With no DATABASE_URL it creates and seeds a local SQLite file. Point DATABASE_URL at PostgreSQL and the same models run there, with a starter SQL script that adds the CHECK constraints and indexes.",
      },
      {
        title: "Generic CRUD from one map",
        body: "A single RESOURCES map drives list, fetch, create, update and delete for nine tables. Fee balances are always recomputed on the server, and a delete that other records still reference returns 409.",
      },
      {
        title: "Authentication written from scratch",
        body: "Passwords are hashed with PBKDF2-HMAC-SHA256 at 210,000 iterations. Sessions are HMAC-SHA256-signed tokens that last 24 hours, and every protected route verifies them and rejects deactivated accounts.",
      },
      {
        title: "A resilient API client",
        body: "The React app calls the API through a singleton that retries with backoff, queues requests while offline, tracks connection health and runs requests in order.",
      },
    ],
    run: [
      {
        label: "Terminal 1 · backend (http://localhost:8080)",
        commands:
          "cd backend\npython -m pip install -r requirements.txt\npython main.py",
      },
      {
        label: "Terminal 2 · frontend (http://localhost:3000)",
        commands: "cd frontend\nnpm install\nnpm start",
      },
      {
        label: "Demo logins",
        commands:
          "admin / admin123\nteacher1 … teacher3 / teacher123\nstudent1 … student12 / student123",
      },
    ],
    talkingPoints: [
      {
        q: "Walk me through a login.",
        a: "The role's login form posts to /api/auth/login. The backend checks the password against the PBKDF2 hash and returns a signed token with the profile. AuthContext stores the token, AuthGuard checks the role, and every later API call sends the token as a bearer header.",
      },
      {
        q: "Why an ORM instead of raw SQL?",
        a: "Routes never write SQL by hand, so dates, decimals, JSON and booleans are converted in one place, and the same models serve SQLite and PostgreSQL. Lowercase column names keep both databases happy.",
      },
      {
        q: "How do you stop a route from clashing with the generic CRUD?",
        a: "resources.py ends in catch-all /api/{resource} routes, so every more specific router is registered before it in main.py.",
      },
      {
        q: "What would you change for production?",
        a: "Replace the hand-rolled token with a standard JWT library, set a real JWT_SECRET, move to PostgreSQL, and add tests around the fee and attendance calculations.",
      },
    ],
    zipName: "student-management-system.zip",
    zipBytes: 443296,
    guideName: "Student-Management-System-Architecture.pdf",
    guidePages: 5,
  },
];

export const projectBySlug = (slug: string) =>
  PLACEMENT_PROJECTS.find((p) => p.slug === slug);
