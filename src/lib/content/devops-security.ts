/**
 * Cybersecurity in DevOps: every security finding across our projects, what
 * we did about it, and the domain and subdomain of security it belongs to,
 * so the same class of bug is recognised the next time in another project.
 *
 * From the "Security audit" tables in D:\Projects\architecture.md. Change
 * that file first (each finding row carries its Domain › Subdomain), then add
 * or update the row here. Admin only, like the rest of DevOps.
 */

export type SecDomainId =
  | "access"
  | "identity"
  | "abuse"
  | "injection"
  | "logic"
  | "integrity"
  | "supply"
  | "secrets"
  | "data"
  | "config"
  | "cloud"
  | "sandbox"
  | "ai"
  | "mobile"
  | "devsecops";

export type SecDomain = {
  id: SecDomainId;
  label: string;
  /** What the domain covers, in a line. */
  blurb: string;
  /** The standard it maps to, for reading further. */
  ref: string;
};

/** The domains, roughly in the order an attacker meets them. */
export const SEC_DOMAINS: SecDomain[] = [
  {
    id: "access",
    label: "Access control",
    blurb: "Who may see or do what, checked on the server for every request.",
    ref: "OWASP A01 Broken Access Control",
  },
  {
    id: "identity",
    label: "Identity and sessions",
    blurb: "Sign-in, session tokens, their lifetime, and guessing limits.",
    ref: "OWASP A07 Identification and Authentication Failures",
  },
  {
    id: "abuse",
    label: "Abuse and availability",
    blurb: "Rate limits and cost caps, so a script cannot run up a bill or lock out real users.",
    ref: "OWASP API4 Unrestricted Resource Consumption",
  },
  {
    id: "injection",
    label: "Injection and output handling",
    blurb: "Data that ends up as code: SQL, HTML, scripts.",
    ref: "OWASP A03 Injection · CWE-79",
  },
  {
    id: "logic",
    label: "Business logic",
    blurb: "Flows that work as written but not as meant: payments, codes, replays.",
    ref: "OWASP A04 Insecure Design",
  },
  {
    id: "integrity",
    label: "API and webhook integrity",
    blurb: "Proving a call came from who it claims: signatures, secrets that fail closed.",
    ref: "OWASP A08 Software and Data Integrity Failures",
  },
  {
    id: "supply",
    label: "Supply chain",
    blurb: "The code we did not write: dependencies, plugins, build tools.",
    ref: "OWASP A06 Vulnerable and Outdated Components",
  },
  {
    id: "secrets",
    label: "Secrets and exposure",
    blurb: "Keys, passwords and personal data kept out of code, logs and public repos; rotated when leaked.",
    ref: "CWE-798 · CWE-200",
  },
  {
    id: "data",
    label: "Data protection",
    blurb: "Encrypting what we store, so a backup or a database dump is not a leak.",
    ref: "OWASP A02 Cryptographic Failures",
  },
  {
    id: "config",
    label: "Security configuration",
    blurb: "Headers, error messages and defaults.",
    ref: "OWASP A05 Security Misconfiguration",
  },
  {
    id: "cloud",
    label: "Cloud and infrastructure",
    blurb: "Least-privilege tokens, what is reachable from the internet, network separation.",
    ref: "CIS Controls 3, 5, 12",
  },
  {
    id: "sandbox",
    label: "Isolation and sandboxing",
    blurb: "Running code we do not trust (students' code) where it cannot reach anything.",
    ref: "CWE-653 · CWE-250",
  },
  {
    id: "ai",
    label: "AI and agent security",
    blurb: "Prompt injection and what an agent's tools may do without a person saying yes.",
    ref: "OWASP LLM01 Prompt Injection · LLM06 Excessive Agency",
  },
  {
    id: "mobile",
    label: "Mobile app security",
    blurb: "Deep links, app sign-in and what the phone can be tricked into.",
    ref: "OWASP MASVS-PLATFORM",
  },
  {
    id: "devsecops",
    label: "DevSecOps",
    blurb: "CI, branch protection and release gates, so nothing unreviewed ships.",
    ref: "NIST SSDF",
  },
];

export const secDomain = (id: SecDomainId) =>
  SEC_DOMAINS.find((d) => d.id === id)!;

export type SecSeverity = "Critical" | "High" | "Medium" | "Low" | "Owner check";
export type SecStatus = "fixed" | "partly" | "open" | "accepted";

export type SecurityFinding = {
  /** The id in the audit's table: F1, S3, O2. */
  id: string;
  /** A DEVOPS_PROJECTS id. */
  project: string;
  /** The audit it came from, as dated in architecture.md. */
  audit: string;
  severity: SecSeverity;
  domain: SecDomainId;
  subdomain: string;
  finding: string;
  /** What was done, or what is still to do. */
  fix: string;
  status: SecStatus;
};

export const SECURITY_FINDINGS: SecurityFinding[] = [
  /* Nectarray · 31 Oct 2026, pre-launch audit skill ------------------- */
  {
    id: "S1",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Critical",
    domain: "access",
    subdomain: "Missing authorization on server-rendered data",
    finding:
      "Admin pages had no auth check of their own; only the panel layout did. An RSC request with any admin cookie value got page data: student emails, decrypted vault .env files.",
    fix: "adminPage() at the top of all 37 pages and sub-layouts; loadProjectSheets calls requireAdmin itself. Rule: every new admin page calls adminPage() first.",
    status: "fixed",
  },
  {
    id: "S2",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Medium",
    domain: "sandbox",
    subdomain: "Untrusted code execution",
    finding:
      "Student code in the judge inherited JUDGE_TOKEN and LATEX_TOKEN (one raise printed them) and ran as the service's own user.",
    fix: "Runner gets an empty environment, tokens popped, service non-dumpable, exec uvicorn. Still open: a separate user for student code and LaTeX jobs.",
    status: "partly",
  },
  {
    id: "S3",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Medium",
    domain: "identity",
    subdomain: "Session lifetime and privilege",
    finding:
      "A verified 5-hour admin token could be stretched to 30 days through /api/app/me or the student cookie, and still pass as a verified admin session.",
    fix: "Admin sessions capped at 5 h from creation; panel-verified tokens refused at the app and student doors.",
    status: "fixed",
  },
  {
    id: "S4",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Low",
    domain: "access",
    subdomain: "Function-level authorization",
    finding:
      "/api/judge needed only a sign-in, not an enrolment, and accepted unpublished questions.",
    fix: "requireEnrolled, and published questions only.",
    status: "fixed",
  },
  {
    id: "S5",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Low",
    domain: "access",
    subdomain: "Routing and middleware coverage",
    finding:
      "The hidden admin path leaked through a hand-set OAuth realm cookie, and dotted /admin/x.y paths skipped the middleware.",
    fix: "Realm cookie is a hash of state and path, set only by /start; /admin/:path* added to the matcher.",
    status: "fixed",
  },
  {
    id: "S6",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Low",
    domain: "secrets",
    subdomain: "Personal data in a public repo",
    finding: "Four real admin email addresses in .env.example, in a public repository.",
    fix: "Replaced with a placeholder. They stay in git history, so 2FA stays on those accounts.",
    status: "fixed",
  },
  {
    id: "S7",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Low",
    domain: "abuse",
    subdomain: "Rate limits that lock out real users",
    finding:
      "The global caps on /api/academy-fit and /api/contact refused genuine enquiries during a flood.",
    fix: "Academy-fit always records and caps only the model call; contact counts valid messages only. Still open: store contact messages when over the cap.",
    status: "partly",
  },
  {
    id: "S8",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Owner check",
    domain: "logic",
    subdomain: "Replay of one-time codes",
    finding:
      "Enrolment codes migrated from Supabase had redeemed_by blanked, so they could be redeemed again.",
    fix: "Claiming also requires redeemed_at IS NULL. Owner to run the count on production.",
    status: "fixed",
  },
  {
    id: "O1",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Owner check",
    domain: "ai",
    subdomain: "Prompt injection and tool confirmation",
    finding:
      "The admin AI agent reads visitor-set GA page paths, renders external markdown images, and its delete and payment tools run without a code-level confirmation.",
    fix: "To do: a confirmation step for destructive tools; treat analytics text as data.",
    status: "open",
  },
  {
    id: "O2",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Owner check",
    domain: "mobile",
    subdomain: "Deep-link hijacking",
    finding: "App sign-in returns on the nectarray:// scheme, which another app can claim.",
    fix: "To do: move to a verified Android App Link.",
    status: "open",
  },
  {
    id: "O3",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Owner check",
    domain: "supply",
    subdomain: "Third-party plugins with repo access",
    finding:
      "The Workspace installs unpinned third-party skills and plugins with GITHUB_TOKEN in the environment.",
    fix: "To do: check the token's scope, protect main, put the APK release behind a protected Environment.",
    status: "open",
  },
  {
    id: "O4",
    project: "nectarray",
    audit: "31 Oct 2026",
    severity: "Owner check",
    domain: "cloud",
    subdomain: "Network segmentation",
    finding: "The judge has open network egress.",
    fix: "To do: check what shares its Railway private network.",
    status: "open",
  },

  /* Nectarray · 24 Oct 2026, first audit ------------------------------- */
  {
    id: "F1",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Medium",
    domain: "abuse",
    subdomain: "Paid API cost",
    finding:
      "/api/academy-fit (public) made a paid Gemini call and wrote a row on every request, with no limit.",
    fix: "5 per IP per 10 minutes, 60 an hour overall.",
    status: "fixed",
  },
  {
    id: "F2",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Medium",
    domain: "access",
    subdomain: "Function-level authorization",
    finding:
      "/api/review-project needed only a Google sign-in, then made a GitHub fetch and a Gemini call, with no limit.",
    fix: "Enrolled students only, 10 an hour each.",
    status: "fixed",
  },
  {
    id: "F3",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Medium",
    domain: "data",
    subdomain: "Encryption at rest",
    finding:
      "Client passwords and .env files on project sheets were stored as typed, so every backup carried them.",
    fix: "PROJECT_VAULT_KEY set on Web; the pre-deploy migration seals every row with AES-256-GCM.",
    status: "fixed",
  },
  {
    id: "F4",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "abuse",
    subdomain: "Email flooding",
    finding: "/api/contact sent email with no limit.",
    fix: "5 per IP per 10 minutes, 100 an hour.",
    status: "fixed",
  },
  {
    id: "F5",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "identity",
    subdomain: "Session privilege escalation",
    finding:
      "A 30-day student or app token pasted into the admin cookie became a 30-day admin session after the emailed code.",
    fix: "Admin sessions with more than 5 h left are refused.",
    status: "fixed",
  },
  {
    id: "F6",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "identity",
    subdomain: "Brute force",
    finding: "Enrolment codes could be guessed without limit.",
    fix: "10 tries an hour per account.",
    status: "fixed",
  },
  {
    id: "F7",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Critical",
    domain: "supply",
    subdomain: "Vulnerable dependencies",
    finding: "next 16.0–16.4.0, plus high-severity zod, sharp, undici, source-map-js, brace-expansion.",
    fix: "npm audit fix (Next 16.4.3). Left: exceljs → uuid, moderate and not reachable.",
    status: "fixed",
  },
  {
    id: "F8",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "injection",
    subdomain: "Script injection (XSS)",
    finding: "Article JSON-LD put page data in a <script> without escaping <.",
    fix: "Escaped as \\u003c, on every page that emits JSON-LD.",
    status: "fixed",
  },
  {
    id: "F9",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Medium",
    domain: "cloud",
    subdomain: "Least-privilege tokens",
    finding:
      "RAILWAY_API_TOKEN, VERCEL_API_TOKEN and the Google service account sit on Web, so a Web compromise becomes an account compromise.",
    fix: "To do: swap for project-scoped, read-only tokens.",
    status: "open",
  },
  {
    id: "F10",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "cloud",
    subdomain: "Internet exposure",
    finding: "Postgres has a public TCP proxy.",
    fix: "Accepted: the backup job needs it. Strong password and SSL.",
    status: "accepted",
  },
  {
    id: "F11",
    project: "nectarray",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "config",
    subdomain: "Security headers",
    finding: "No Content-Security-Policy header (HSTS, nosniff, frame and referrer headers are set).",
    fix: "To do: add a CSP.",
    status: "open",
  },

  /* LegallyYours · 24 Oct 2026 ----------------------------------------- */
  {
    id: "F1",
    project: "legallyyours",
    audit: "24 Oct 2026",
    severity: "Critical",
    domain: "access",
    subdomain: "Checks that fail open",
    finding:
      "ADMIN_KEY is not set on Railway, and both the API and web's proxy skip the admin check when it is unset: anyone can open /admin.",
    fix: "Accepted during development. Before launch: set it on web and api, and refuse to boot without it in production.",
    status: "accepted",
  },
  {
    id: "F2",
    project: "legallyyours",
    audit: "24 Oct 2026",
    severity: "Critical",
    domain: "supply",
    subdomain: "Vulnerable dependencies",
    finding: "next 16.4.0 (unauthenticated RCE via Image Optimization, Server Actions DoS), zod < 4.6.6.",
    fix: "Next 16.4.3, zod 4.6.7; npm audit clean (commit a8991c9).",
    status: "fixed",
  },
  {
    id: "F3",
    project: "legallyyours",
    audit: "24 Oct 2026",
    severity: "Medium",
    domain: "logic",
    subdomain: "Payment integrity",
    finding: "POST /v1/me/orders/:id/pay marks an order paid with no payment gateway.",
    fix: "To do before launch: Razorpay, verifying signature, amount and order.",
    status: "open",
  },
  {
    id: "F4",
    project: "legallyyours",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "identity",
    subdomain: "Default credentials",
    finding: "A demo account whose password is in the repo is created in production on every deploy.",
    fix: "To do: skip seedDemoAccount in production.",
    status: "open",
  },
  {
    id: "F5",
    project: "legallyyours",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "devsecops",
    subdomain: "CI",
    finding: "No CI: tests and typecheck run only by hand.",
    fix: "To do: GitHub Actions like the other projects.",
    status: "open",
  },
  {
    id: "E1",
    project: "legallyyours",
    audit: "24 Oct 2026",
    severity: "High",
    domain: "secrets",
    subdomain: "Rotation after a provider breach",
    finding: "Railway reported a breach; the Postgres password lives on Railway.",
    fix: "Password regenerated and api redeployed. Postgres has no public proxy, so the old one alone could not reach it.",
    status: "fixed",
  },

  /* ADC ---------------------------------------------------------------- */
  {
    id: "F6",
    project: "adc",
    audit: "24 Oct 2026",
    severity: "Low",
    domain: "config",
    subdomain: "Error messages",
    finding: "500 responses return the raw err.message.",
    fix: "To do: a fixed message, details to the log only.",
    status: "open",
  },
  {
    id: "F7",
    project: "adc",
    audit: "24 Oct 2026",
    severity: "Medium",
    domain: "integrity",
    subdomain: "Webhook signatures",
    finding: "The WhatsApp webhook accepts unsigned calls when WHATSAPP_APP_SECRET is empty.",
    fix: "To do: reject every call when the secret is unset (fail closed).",
    status: "open",
  },
  {
    id: "D1",
    project: "adc",
    audit: "24 Oct 2026",
    severity: "Critical",
    domain: "supply",
    subdomain: "Vulnerable dependencies",
    finding: "npm audit: backend proxy-addr (critical) and undici; frontend next (critical) and 5 high.",
    fix: "To do: upgrade.",
    status: "open",
  },
];
