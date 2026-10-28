/**
 * The DevOps section of the admin: every project we run, the languages and
 * frameworks under them, how their code is laid out, and what we are
 * learning about running them. A short, kept-current version of
 * D:\Projects\projects-architecture.md (the long one keeps the details).
 *
 * Admin only. Update a project's entry when it changes, and the "Checked"
 * date with it.
 */

import type { NoteSection } from "@/lib/content/marketing-notes";

export type DevopsProject = {
  id: string;
  label: string;
  /** One line under the title, and on the project's card. */
  blurb: string;
  url?: string;
  repo: string;
  status: string;
  checked: string;
  /** The four numbers worth knowing at a glance. */
  facts: { label: string; value: string; hint?: string }[];
  sections: NoteSection[];
};

/** A page of notes that is not about one project: Stack, Design, Knowledge. */
export type DevopsPage = { title: string; lede: string; sections: NoteSection[] };

export const DEVOPS_PROJECTS: DevopsProject[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "nectarray",
    label: "Nectarray",
    blurb:
      "This site: company pages, the Academy, this admin panel and the Android app, from one Next.js app with two helper services.",
    url: "https://nectarray.com",
    repo: "github.com/satyaprakashdhfm/Nectarray",
    status: "Live",
    checked: "24 Oct 2026",
    facts: [
      { label: "Hosting", value: "Railway", hint: "Singapore, 1 replica each" },
      { label: "Stack", value: "Next.js 16 + Python", hint: "Node 24, FastAPI judge" },
      { label: "Database", value: "Postgres 17", hint: "Dump to R2 every 3 days" },
      { label: "Bill", value: "$5.75 / mo", hint: "RAM is 80% of it" },
    ],
    sections: [
      {
        id: "architecture",
        wide: true,
        title: "Architecture",
        blocks: [
          {
            kind: "code",
            text: `Browser / Android app ──► Web (Next.js) ──► Postgres 17 (private network)
                            ├──► drive bucket (S3 API, signed links)
                            ├──► Nectarray Backend (Python judge + LaTeX), sleeps when idle
                            └──► Resend, Google OAuth, Gemini, Groq, GA4, Railway + Vercel APIs
                 signed 1-minute pass ──► Workspace (Claude Code runner, volume /data)
Railway webhooks (all projects) ──► /api/hooks/railway     Uptime checker inside Web, every 2 min`,
          },
          {
            kind: "list",
            items: [
              "Web is the backend too: pages, API routes and server actions in one process, Drizzle over postgres.js. The browser never touches the database.",
              "Untrusted work runs elsewhere: student Python and LaTeX in services/judge (non-root, no DB access, own tokens).",
              "Schema in src/lib/db/schema.ts; scripts/migrate.mjs runs as Railway's pre-deploy command. A failed migration fails the deploy and the old container keeps serving.",
            ],
          },
        ],
      },
      {
        id: "versions",
        title: "Versions",
        blocks: [
          {
            kind: "table",
            head: ["Part", "Version"],
            rows: [
              ["Web", "Next.js 16.4.3, React 19.2.8, Tailwind 4.3.3, TypeScript 5.9.3, Drizzle 0.45.2"],
              ["AI", "AI SDK 7, @ai-sdk/google 4 (Gemini), @ai-sdk/groq 4"],
              ["Node", "24.x (local 24.20). No engines field yet: pin >=24"],
              ["Backend", "Python 3.13 slim, FastAPI"],
              ["Workspace", "node:22-bookworm, Claude Code on the volume"],
              ["Android", "Expo 57, React Native 0.86, app 1.2.0"],
            ],
          },
        ],
      },
      {
        id: "deploy",
        title: "Deploy and CI",
        blocks: [
          {
            kind: "steps",
            items: [
              "Local: npm run lint && npm run typecheck && npm run build.",
              "Push to main. CI: npm ci → lint → typecheck → migrate an empty Postgres 17 → next build → npm audit (critical fails).",
              "Railway builds; watch paths skip mobile/, workspace/, services/ and .md changes.",
              "Pre-deploy migration, then healthcheck GET /api/health (select 1).",
              "Roll back: redeploy the previous deployment. Migrations only add, so old code runs.",
            ],
          },
        ],
      },
      {
        id: "data",
        title: "Data and backups",
        blocks: [
          {
            kind: "table",
            head: ["Data", "Lives in", "Backup"],
            rows: [
              ["Users, academy, projects, quotes, receipts", "Railway Postgres 17", "pg_dump every 3 days → R2 nectarray.com/db/; restore checked monthly"],
              ["Drive files", "Railway bucket drive", "Mirrored to R2 nectarray.com/drive/ once DRIVE_BUCKET_* secrets exist"],
              ["Cloned repos, Claude sign-in", "workspace-volume", "None (re-creatable)"],
            ],
          },
        ],
      },
      {
        id: "cost",
        title: "Runtime and cost",
        blocks: [
          {
            kind: "table",
            head: ["Service", "RAM", "Notes"],
            rows: [
              ["Web", "0.27 GB avg, 0.57 GB peak", "CPU ~0"],
              ["Nectarray Backend", "0.04 GB", "Sleeps when idle; wake-fetch retries the cold start"],
              ["Postgres", "0.05 GB", "~1 GB on disk"],
              ["Workspace", "0 asleep, 2–4.6 GB in a session", "Biggest cost when awake"],
            ],
          },
        ],
      },
      {
        id: "watch",
        title: "Breaks easily",
        blocks: [
          {
            kind: "list",
            items: [
              "migrate.mjs must stay idempotent and additive.",
              "Never change PROJECT_VAULT_KEY once set: sealed passwords lock.",
              "Rate limits are in memory, per instance. Two replicas → move them to a table.",
              "Removing Postgres's TCP proxy or changing its password without BACKUP_DATABASE_URL stops the backup.",
            ],
          },
        ],
      },
      {
        id: "open",
        title: "Open items",
        blocks: [
          {
            kind: "list",
            items: [
              "Turn on Wait for CI on Web.",
              "R2 lifecycle rule: nectarray.com/db/ → delete after 30 days.",
              "Add DRIVE_BUCKET_* GitHub secrets.",
              "Project-scoped, read-only Railway and Vercel tokens (F9).",
              "engines: node >=24; remove vercel.json and supabase/.",
              "UptimeRobot outside Railway; optional CSP header.",
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "adc",
    label: "ADC (A Dough Cookie)",
    blurb:
      "Cookie shop: storefront, admin dashboard and store staff portal in one Next.js app on top of one Express API.",
    url: "https://www.adoughcookie.com",
    repo: "github.com/satyaprakashdhfm/ADC",
    status: "Live",
    checked: "24 Oct 2026",
    facts: [
      { label: "Hosting", value: "Railway", hint: "Singapore, CDN on frontend" },
      { label: "Stack", value: "Next.js 16 + Express 4", hint: "Node 24, TypeScript" },
      { label: "Database", value: "Postgres 18", hint: "PITR on + nightly R2 dump" },
      { label: "Bill", value: "$14.66 / mo", hint: "RAM is 91% of it" },
    ],
    sections: [
      {
        id: "architecture",
        wide: true,
        title: "Architecture",
        blocks: [
          {
            kind: "code",
            text: `Browser ──► adc-frontend (Next.js) ──/api rewrite, private network──► adc-backend (Express)
                                                                     ├──► Postgres 18 (PostgresProd)
                                                                     ├──► volume (media, logs)
                                                                     └──► Razorpay, Petpooja, Shiprocket,
                                                                          Delhivery, WhatsApp, ZeptoMail, Gemini
Webhooks (Razorpay, Petpooja, Shiprocket, WhatsApp) ──► adc-backend`,
          },
          {
            kind: "list",
            items: [
              "Schema is created at boot by src/db/initSchema.ts: idempotent and additive only.",
              "Drizzle models in src/models/ mirror the live schema; add every new column there too, or drizzle-kit generates a DROP.",
              "Media on a Railway volume, served at /api/media/* through signed, expiring URLs.",
              "Backend has static outbound IPs: Petpooja allowlists them.",
            ],
          },
        ],
      },
      {
        id: "versions",
        title: "Versions",
        blocks: [
          {
            kind: "table",
            head: ["Part", "Version"],
            rows: [
              ["Backend", "Express 4.22, TypeScript 5.9.3, pg 8.21, Drizzle 0.45.2, zod 4.4, helmet 8"],
              ["Frontend", "Next.js 16.2.7, React 19.2.4, Tailwind 4.3, framer-motion 12"],
              ["AI", "AI SDK 7, @ai-sdk/google 4, gemini-3.5-flash-lite"],
              ["Node", "Frontend 24.21.0; backend engines >=24"],
              ["Database", "PostgreSQL 18 (postgres-ssl:18)"],
            ],
          },
        ],
      },
      {
        id: "deploy",
        title: "Deploy and CI",
        blocks: [
          {
            kind: "steps",
            items: [
              "Local: Postgres on :5433, npm test (107 pass) and upgrade-test.sh before risky merges.",
              "Push to main. CI: backend tests against postgres:18, frontend next build, in parallel.",
              "Railway builds only the side that changed (watch paths).",
              "Healthcheck, then live. No staging, no PR previews, by choice.",
              "Roll back: redeploy the previous deployment.",
            ],
          },
        ],
      },
      {
        id: "data",
        title: "Data and backups",
        blocks: [
          {
            kind: "table",
            head: ["Data", "Lives in", "Backup"],
            rows: [
              ["Orders, customers, products", "PostgresProd (18)", "PITR (any minute) + nightly pg_dump to R2; restore checked monthly"],
              ["Product images", "adc-backend-volume (media/)", "None yet: schedule a weekly volume backup"],
              ["API logs", "Same volume (logs/)", "No (14 days, disposable)"],
            ],
          },
        ],
      },
      {
        id: "cost",
        title: "Runtime and cost",
        blocks: [
          {
            kind: "table",
            head: ["Service", "RAM", "Notes"],
            rows: [
              ["adc-frontend (Next.js)", "0.8–1.2 GB", "~$10/mo. Locally ~190 MB; production growth is Linux memory fragmentation, not a leak"],
              ["adc-backend (Express)", "0.1–0.2 GB, 0.8 GB peak", "~$1.5/mo. The Node side of the Rust test"],
              ["PostgresProd", "0.1–0.15 GB", "~$1.5/mo, 1.7 GB disk (mostly PITR log)"],
            ],
          },
          {
            kind: "tip",
            text: "Optional experiment: MALLOC_ARENA_MAX=2 on adc-frontend, then watch memory for 2–3 days.",
          },
        ],
      },
      {
        id: "watch",
        title: "Breaks easily",
        blocks: [
          {
            kind: "list",
            items: [
              "Razorpay and WhatsApp webhooks need the raw body: mount them before express.json.",
              "Every order path re-checks price, quantity (1–99) and pack contents on the server.",
              "Never match an account by an unverified email or phone.",
              "PostgresProd's TCP proxy and BACKUP_DATABASE_URL keep the nightly backup alive.",
            ],
          },
        ],
      },
      {
        id: "open",
        title: "Open items",
        blocks: [
          {
            kind: "list",
            items: [
              "F6: 500 responses return raw err.message. F7: WhatsApp webhook accepts unsigned calls when its secret is unset.",
              "Turn on Wait for CI on both services.",
              "Weekly backup for adc-backend-volume (product images).",
              "npm audit: next (critical), proxy-addr (critical), undici.",
              "Pin frontend engines; remove @supabase/supabase-js; update DEPLOYMENT.md.",
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "mobile-dashboard",
    label: "Mobile Dashboard",
    blurb:
      "Admin and store portals for a mobile-phone wholesale business: stock by IMEI, bills, daybook, transfers. Our first Rust backend.",
    repo: "github.com/satyaprakashdhfm/Mobile_Dashboard",
    status: "Setting up on Railway",
    checked: "24 Oct 2026",
    facts: [
      { label: "Hosting", value: "Railway", hint: "Project created 23 Oct 2026" },
      { label: "Stack", value: "Rust + Next.js 16", hint: "Axum API, shadcn frontend" },
      { label: "Database", value: "Postgres 17", hint: "SQLx migrations, embedded" },
      { label: "Tests", value: "100 pass", hint: "cargo test, 22 Oct 2026" },
    ],
    sections: [
      {
        id: "architecture",
        wide: true,
        title: "Architecture",
        blocks: [
          {
            kind: "code",
            text: `Browser ──► frontend (Next.js, :3100) ──/api/* rewrite──► mw-server (Rust, Axum, :8080) ──► Postgres 17
                                                         └──► uploads/ (invoice files)`,
          },
          {
            kind: "list",
            items: [
              "The browser only talks to the frontend; /api/* is proxied, so the mw_session cookie stays first-party.",
              "Docs/TECH_SPEC.md is the contract between backend and frontend: JSON snake_case, one error shape, money as 2-decimal numbers.",
              "Stores are scoped to their own location server-side; they never receive cost, profit or balances.",
              "Every write adds one audit_log row.",
            ],
          },
        ],
      },
      {
        id: "versions",
        title: "Versions",
        blocks: [
          {
            kind: "table",
            head: ["Part", "Version"],
            rows: [
              ["Backend", "Rust 1.99 (edition 2024), Axum 0.8.9, Tokio 1.54, SQLx 0.9, rust_decimal, argon2 0.6"],
              ["Frontend", "Next.js 16.4.2 (webpack), React 19.3, shadcn, TanStack Query + Table, ECharts 6, React Flow 12"],
              ["Database", "PostgreSQL 17"],
            ],
          },
        ],
      },
      {
        id: "deploy",
        title: "Deploy",
        blocks: [
          {
            kind: "list",
            items: [
              "API image: multi-stage Dockerfile, rust:1-slim-trixie builds mw-server, debian:trixie-slim runs it. One binary, migrations embedded.",
              "Runs on [::]:$PORT (Railway private networking needs IPv6), uploads at /data/uploads on a volume, stops cleanly on SIGTERM.",
              "No CI yet: add cargo test against a throwaway Postgres, like ADC's.",
            ],
          },
        ],
      },
    ],
  },
];

export const devopsProject = (id: string) =>
  DEVOPS_PROJECTS.find((p) => p.id === id);

/* -------------------------------------------------------------------- */

/**
 * The General tab: decisions that hold for every project rather than one.
 * From the "Backend decision" box at the top of projects-architecture.md.
 */
export const DEVOPS_GENERAL: DevopsPage = {
  title: "General",
  lede: "Rules that apply to every project, before any one of them is built.",
  sections: [
    {
      id: "backend-default",
      wide: true,
      title: "Why a backend? Inside Next.js, or a separate one",
      blocks: [
        {
          kind: "p",
          text: "Default: keep the backend inside the Next.js app. API routes (app/api/*), server actions and server-only code (lib/server/*) run on Next.js's own Node.js server. One service, one deploy, one set of variables, the lowest bill. Enough for a shop or site taking hundreds of orders a day.",
        },
        {
          kind: "tip",
          text: "Secrets never reach the browser: mark server files import 'server-only', so the build fails if browser code imports one.",
        },
      ],
    },
    {
      id: "backend-when",
      wide: true,
      title: "When we need a separate backend",
      blocks: [
        {
          kind: "p",
          text: "Move to a separate backend (Node.js + Express, or Rust + Axum, as its own Railway service) as soon as any one of these is true.",
        },
        {
          kind: "table",
          head: ["#", "Case", "Why the Next.js server stops being enough"],
          rows: [
            ["1", "A second client: mobile app, POS tablet, partner or store portal", "They all need one shared API. Next.js routes are shaped around its own pages and cookies."],
            ["2", "Heavy or long background work: scheduled jobs, pollers, queues, retries, big exports, PDF or image processing", "It runs inside the web server, so it slows pages down and is killed on every deploy or restart."],
            ["3", "More than one server copy (scaling out for traffic)", "Every copy runs the in-process jobs, so trackers and pollers run twice and bookings or emails can repeat. Jobs need a single worker."],
            ["4", "Many webhooks and integrations: payment, courier, POS, WhatsApp, each needing raw bodies, ordering or retries", "Easier to control in Express: middleware order, raw-body parsers, one place to log."],
            ["5", "Long-lived connections: WebSockets, live tracking, chat streams", "Route handlers are not built to hold these open."],
            ["6", "Separate teams or release cycles for frontend and backend", "The API can be deployed and versioned without rebuilding the site."],
            ["7", "Hosting on Vercel with jobs or long requests", "Functions time out and have no always-on process for jobs."],
          ],
        },
      ],
    },
    {
      id: "backend-not",
      title: "When we don't",
      blocks: [
        {
          kind: "list",
          items: [
            "A website, landing pages or a blog, even with a contact form or an enquiry email.",
            "A shop with one storefront and its admin: cart, checkout, one payment gateway, order emails.",
            "An admin panel or dashboard used only through its own pages.",
            "A light job or two that can miss a run safely, on a single copy of the server.",
          ],
        },
        {
          kind: "tip",
          text: "Stay ready: keep all logic in lib/server/*, apart from pages and routes. Splitting out later is then rewiring (an Express server imports the same files), not a rewrite.",
        },
      ],
    },
    {
      id: "backend-projects",
      title: "Where each project stands",
      blocks: [
        {
          kind: "table",
          head: ["Project", "Backend", "Why"],
          rows: [
            ["ADC", "Separate (Express)", "Cases 1, 2 and 4: store portal, POS relay, status poller, four webhook types"],
            ["Mobile Dashboard", "Separate (Rust, Axum)", "Admin and store portals share one API (case 1); also our Rust vs Node test"],
            ["LegallyYours", "Separate API service", "The web app calls it with x-admin-key"],
            ["Nectarray", "Inside Next.js", "The Python judge is a helper, not the app's backend"],
            ["Minimals", "Inside Next.js", "Watch case 3: the 30-minute Delhivery tracking job runs in the web server. Move it to a worker or Railway cron before a second copy"],
          ],
        },
      ],
    },
  ],
};

export const DEVOPS_STACK: DevopsPage = {
  title: "Stack",
  lede: "The languages, frameworks and infrastructure under every project, and why each one is there.",
  sections: [
    {
      id: "languages",
      wide: true,
      title: "Languages",
      blocks: [
        {
          kind: "table",
          head: ["Language", "Where", "Why"],
          rows: [
            ["TypeScript", "Nectarray, ADC (both sides), Mobile Dashboard frontend", "One language for UI and server; types catch mistakes before deploy"],
            ["Rust", "Mobile Dashboard backend", "No garbage collector, one small binary, low RAM. Under test against Node (see Knowledge)"],
            ["Python", "Nectarray Backend (judge + LaTeX)", "Runs student code; FastAPI is quick to write"],
            ["SQL", "Postgres in every project", "The data lives here; migrations are plain SQL"],
          ],
        },
      ],
    },
    {
      id: "frameworks",
      title: "Frameworks and libraries",
      blocks: [
        {
          kind: "table",
          head: ["Name", "Used for", "Projects"],
          rows: [
            ["Next.js 16 + React 19", "Pages, server rendering, API routes", "All three"],
            ["Tailwind CSS 4", "Styling", "All three"],
            ["Express 4", "REST API", "ADC"],
            ["Axum 0.8 + Tokio", "REST API (async Rust)", "Mobile Dashboard"],
            ["FastAPI", "Judge and LaTeX service", "Nectarray"],
            ["Drizzle ORM", "Typed SQL in TypeScript", "Nectarray, ADC"],
            ["SQLx", "Compile-checked SQL in Rust", "Mobile Dashboard"],
            ["Vercel AI SDK 7", "Gemini and Groq calls", "Nectarray, ADC"],
            ["Expo + React Native", "Android app", "Nectarray"],
            ["shadcn/ui, TanStack Query", "Dashboard UI and data fetching", "Mobile Dashboard"],
          ],
        },
      ],
    },
    {
      id: "infra",
      title: "Infrastructure",
      blocks: [
        {
          kind: "table",
          head: ["Piece", "What we use", "Notes"],
          rows: [
            ["Runtime", "Node 24 LTS", "Pin engines >=24 everywhere"],
            ["Database", "PostgreSQL 17 / 18 on Railway", "pg_dump client must be ≥ server major"],
            ["Hosting", "Railway (Singapore)", "Railpack for Node apps, Dockerfile for Rust, Python, Workspace"],
            ["CI", "GitHub Actions", "Lint, typecheck, test, build on every push"],
            ["Backups", "Cloudflare R2 nectarray-backup", "One folder per project, restore checked monthly"],
            ["Email", "Resend (Nectarray), ZeptoMail (ADC)", "Alerts and transactional mail"],
            ["Alerts", "Railway webhooks + uptime checker", "Admin → Workspace → Incidents"],
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------- */

export const DEVOPS_DESIGN: DevopsPage = {
  title: "System design",
  lede: "How the code inside each project is laid out, the patterns we repeat, and when to split a piece out.",
  sections: [
    {
      id: "shape",
      wide: true,
      title: "The shape we use",
      blocks: [
        {
          kind: "p",
          text: "A modular monolith: one app holds pages, API and business logic, and only the risky or heavy parts run as their own service (untrusted code in the judge, terminals in the Workspace). At our size that is cheaper and simpler than microservices: one deploy, no network hops between our own pieces, no duplicated code.",
        },
        {
          kind: "list",
          items: [
            "Split when the Android app's API grows past a few routes, when background work starts slowing pages (move it to a worker first), or when Web passes ~1 GB RAM or needs a second replica.",
            "Keep business logic in src/lib, not in route files, so a split later is a move, not a rewrite.",
          ],
        },
      ],
    },
    {
      id: "nectarray",
      title: "Nectarray: layers",
      blocks: [
        {
          kind: "code",
          text: `request
  └─ src/middleware.ts        one hostname, hidden admin path, cookie gates
      └─ src/app/…            page.tsx · route.ts · actions.ts (server actions)
          └─ src/lib/…        auth/ · db/ · monitor/ · deploys/ · vault.ts · rate-limit.ts
              └─ Drizzle (src/lib/db/schema.ts) ──► Postgres`,
        },
      ],
    },
    {
      id: "adc",
      title: "ADC: layers",
      blocks: [
        {
          kind: "code",
          text: `request
  └─ src/app.ts               middleware order matters (raw-body webhooks first)
      └─ src/routes/…         customer · admin/ · store · webhooks/
          └─ src/services/…   business logic
              ├─ *.client.ts  one file per third-party API
              └─ src/models/  Drizzle tables ──► pg pool ──► Postgres
  src/jobs/                   pollers, reconcile, reminders, log retention`,
        },
      ],
    },
    {
      id: "mobile",
      wide: true,
      title: "Mobile Dashboard: crates",
      blocks: [
        {
          kind: "code",
          text: `mw-server (binary)            loads config, runs migrations, merges routers under /api
  ├─ mw-api-masters           auth, products, stock, prices, purchases, people, ledger …
  ├─ mw-api-ops               bills, daybook, approvals, transfers, deliveries, reports
  └─ mw-core                  AppState, AppError, auth extractors, audit, ledger, stock, money
mw-testkit                    test helpers: a throwaway database per test`,
        },
        {
          kind: "p",
          text: "Each api-* crate exposes router() -> axum::Router<AppState>. The shared rules live once in core, and the compiler stops one feature crate reaching into another.",
        },
      ],
    },
    {
      id: "patterns",
      wide: true,
      title: "Patterns we repeat",
      blocks: [
        {
          kind: "terms",
          items: [
            { term: "Additive migrations", meaning: "Add tables and columns, never drop or rename. Old code keeps running on the new schema, so a rollback is just a redeploy." },
            { term: "One client per API", meaning: "Each third-party service sits behind one file. Swapping a provider touches one place." },
            { term: "Fail closed", meaning: "A webhook or token check with no secret configured refuses the request instead of letting it through." },
            { term: "Hashed sessions", meaning: "A random token in the cookie; only its sha256 is stored. A leaked table holds no usable sessions." },
            { term: "Server is the truth", meaning: "Prices, quantities and permissions are re-checked on the server; the browser's numbers are never trusted." },
            { term: "Private network", meaning: "Services talk over *.railway.internal, so internal traffic never crosses the internet." },
            { term: "Signed, short links", meaning: "Files are handed out as links that expire, not public URLs." },
            { term: "Audit log", meaning: "Every write records who did what, so a wrong number can be traced." },
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------- */

export const DEVOPS_KNOWLEDGE: DevopsPage = {
  title: "General knowledge",
  lede: "Internal experiments with their results, and the DevOps ideas behind how we run things.",
  sections: [
    {
      id: "rust-vs-node",
      wide: true,
      title: "Experiment: Rust vs Node, 30 days",
      blocks: [
        {
          kind: "p",
          text: "Claim to test: a Rust backend uses about a fifth of the runtime resources of a Node one. Railway bills mostly for RAM (~$10 per GB held a month), so memory is the number that decides cost.",
        },
        {
          kind: "table",
          head: ["Measure (Railway metrics)", "Node: ADC backend (Express)", "Rust: Mobile Dashboard API (Axum)"],
          rows: [
            ["RAM, normal", "0.1–0.2 GB", "to measure"],
            ["RAM, peak", "0.7–0.8 GB", "to measure"],
            ["CPU, average", "~0 vCPU", "to measure"],
            ["Cost per month", "~$1.5", "to measure"],
            ["Image size", "to note from the build", "to note from the build"],
            ["Start-up time", "to note from the deploy log", "to note from the deploy log"],
          ],
        },
        {
          kind: "list",
          items: [
            "Window: 23 Oct → 22 Nov 2026. Read both services' metrics on the same day, last 30 days.",
            "Not a perfect match: different apps and different traffic. Compare idle RAM most, and RAM per request where traffic allows.",
            "Same region (Singapore), one replica each.",
          ],
        },
        {
          kind: "tip",
          text: "Why it is plausible: Rust has no garbage collector and no runtime to load, and ships as one binary. OpenAI rewrote its Codex CLI from TypeScript to Rust in 2025, partly because needing Node 22 or newer to install it was a barrier, and for lower memory use.",
        },
      ],
    },
    {
      id: "pipeline",
      title: "From commit to live",
      blocks: [
        {
          kind: "terms",
          items: [
            { term: "CI (continuous integration)", meaning: "Every push is linted, type-checked, tested and built by GitHub Actions. A red run means something is broken before users see it." },
            { term: "CD (continuous deployment)", meaning: "Railway deploys main automatically. Wait for CI holds the deploy until CI is green." },
            { term: "Watch paths", meaning: "Only redeploy a service when its own folder changes." },
            { term: "Pre-deploy step", meaning: "Migrations run before the new version takes traffic; a failure keeps the old one serving." },
            { term: "Healthcheck", meaning: "An address Railway calls to decide the new version is up. Should touch the database, not just answer ok." },
            { term: "Rollback", meaning: "Redeploy the previous build. Only safe because migrations are additive." },
          ],
        },
      ],
    },
    {
      id: "reliability",
      title: "Keeping it up and keeping the data",
      blocks: [
        {
          kind: "terms",
          items: [
            { term: "Off-site backup", meaning: "A copy outside the host (R2), so losing the Railway account does not lose the data." },
            { term: "Restore drill", meaning: "A backup nobody has restored is a guess. Monthly jobs restore the newest dump into a throwaway database." },
            { term: "PITR", meaning: "Point-in-time recovery: restore the database to any minute. On for ADC, off for Nectarray." },
            { term: "Uptime check", meaning: "Something outside the app requests it every few minutes and alerts on failure. Ours runs inside Railway, so add one outside it." },
            { term: "Sleep when idle", meaning: "Railway stops a service with no traffic; the next request wakes it in a few seconds. Good for rarely-used services." },
            { term: "CDN", meaning: "Copies of images, CSS and JS served from the edge, so the app server does less." },
          ],
        },
      ],
    },
    {
      id: "cost",
      title: "Estimating the bill",
      blocks: [
        {
          kind: "code",
          text: `monthly ≈   avg GB of RAM   × $10
          + avg vCPU used   × $20
          + GB sent out     × $0.05
          + avg GB on disk  × $0.15`,
        },
        {
          kind: "p",
          text: "RAM dominates for small apps: CPU is billed only while busy, and egress and disk are cheap. At 10× traffic expect egress ~10×, RAM only 1.5–2×.",
        },
      ],
    },
    {
      id: "secrets",
      title: "Secrets by risk",
      blocks: [
        {
          kind: "table",
          head: ["Risk", "Rotate", "Typical names"],
          rows: [
            ["High", "Immediately", "DATABASE_URL, *_SERVICE_ROLE_KEY, payment secrets, cloud API tokens, session/JWT secrets, encryption keys"],
            ["Medium", "Soon", "AI keys, WhatsApp/SMS/email keys, courier and POS logins, webhook secrets, OAuth client secrets"],
            ["Low", "No need", "NEXT_PUBLIC_*, client IDs, public URLs, ports, feature flags"],
          ],
        },
      ],
    },
  ],
};
