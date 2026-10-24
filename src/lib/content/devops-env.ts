/**
 * Every environment variable each project reads: what it is, where to get
 * a new value, which dashboard to open, where we keep it and which file
 * reads it. Names only — never a value. Shown on the DevOps page, one
 * dropdown per variable.
 *
 * When code starts reading a new variable, add it here in the same commit.
 */

export type Risk = "high" | "medium" | "low";

export type EnvVar = {
  /** One name, or several that always travel together. */
  name: string;
  what: string;
  /** How to get or make a value, in a line or two. */
  get: string;
  link?: { label: string; url: string };
  /** Where we keep it right now. */
  stored: string;
  /** The file that reads it. */
  code: string;
  risk: Risk;
};

export type EnvGroup = { title: string; vars: EnvVar[] };

const RAILWAY = {
  nectarray: "https://railway.com/project/7a06811e-f5f6-48f0-a7c3-74a941821ed8",
  adc: "https://railway.com/project/bf463f9d-23f7-4f83-9d26-85e45369e364",
  mobile: "https://railway.com/project/55c59057-0700-4ef8-9e9d-9ab16e3d4347",
};

const MAKE_SECRET =
  "Make one yourself: run `openssl rand -hex 32` and paste the output.";

const link = (label: string, url: string) => ({ label, url });

const GEMINI_KEYS = link("Google AI Studio → API keys", "https://aistudio.google.com/apikey");
const GOOGLE_CREDENTIALS = link(
  "Google Cloud → Credentials",
  "https://console.cloud.google.com/apis/credentials",
);
const SERVICE_ACCOUNTS = link(
  "Google Cloud → Service accounts",
  "https://console.cloud.google.com/iam-admin/serviceaccounts",
);

/* -------------------------------------------------------------------- */

const NECTARRAY: EnvGroup[] = [
  {
    title: "Core",
    vars: [
      {
        name: "DATABASE_URL",
        what: "Postgres connection string for the app.",
        get: "Railway → Nectarray → Postgres → Variables → DATABASE_URL. On Web it is the reference ${{Postgres.DATABASE_URL}} (private network).",
        link: link("Railway project", RAILWAY.nectarray),
        stored: "Railway → Web → Variables · .env.local (local DB on :5434)",
        code: "src/lib/db/index.ts, scripts/migrate.mjs",
        risk: "high",
      },
      {
        name: "SITE_URL",
        what: "The canonical address, https://nectarray.com. Drives the apex redirect and OAuth return URL.",
        get: "Not a key: type the site address.",
        stored: "Railway → Web → Variables",
        code: "src/middleware.ts, src/lib/auth/google.ts",
        risk: "low",
      },
      {
        name: "NEXT_PUBLIC_ADMIN_PATH",
        what: "The hidden address of this admin panel.",
        get: "Chosen by us; an unguessable path. Changing it moves the panel.",
        stored: "Railway → Web → Variables",
        code: "src/lib/admin-path.ts",
        risk: "low",
      },
      {
        name: "ADMIN_EMAILS",
        what: "Comma-separated Google addresses allowed into the admin panel.",
        get: "Not a key: list the addresses.",
        stored: "Railway → Web → Variables",
        code: "src/lib/auth/access.ts",
        risk: "low",
      },
      {
        name: "PROJECT_VAULT_KEY",
        what: "Encrypts client passwords and .env files on project sheets. Never change it once set.",
        get: `${MAKE_SECRET} Keep a copy in the password manager: losing it locks every sealed password.`,
        stored: "Railway → Web → Variables · password manager",
        code: "src/lib/vault.ts, scripts/migrate.mjs",
        risk: "high",
      },
    ],
  },
  {
    title: "Sign-in",
    vars: [
      {
        name: "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET",
        what: "Google OAuth client for every sign-in (students, app, admin).",
        get: "Google Cloud → APIs & Services → Credentials → the OAuth 2.0 Web client. Redirect URI: https://nectarray.com/api/auth/google/callback.",
        link: GOOGLE_CREDENTIALS,
        stored: "Railway → Web → Variables",
        code: "src/lib/auth/google.ts",
        risk: "high",
      },
      {
        name: "APP_AUTH_SECRET",
        what: "Signs the 3-minute Android sign-in codes. Optional: falls back to the Google client secret.",
        get: MAKE_SECRET,
        stored: "Railway → Web → Variables (optional)",
        code: "src/lib/auth/app-codes.ts",
        risk: "high",
      },
    ],
  },
  {
    title: "Email",
    vars: [
      {
        name: "RESEND_KEY",
        what: "Sends contact-form mail, admin codes, down alerts and backup-failure emails.",
        get: "Resend → API Keys → Create (Sending access, domain nectarray.com).",
        link: link("Resend → API keys", "https://resend.com/api-keys"),
        stored: "Railway → Web → Variables · GitHub → Actions secrets (backup emails)",
        code: "src/app/api/contact/route.ts, src/lib/auth/admin-otp.ts, src/lib/monitor/incidents.ts",
        risk: "medium",
      },
      {
        name: "CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, ADMIN_OTP_FROM_EMAIL",
        what: "From and to addresses. The from address must be on a domain verified in Resend.",
        get: "Resend → Domains shows which domains can send.",
        link: link("Resend → Domains", "https://resend.com/domains"),
        stored: "Railway → Web → Variables",
        code: "src/app/api/contact/route.ts, src/lib/auth/admin-otp.ts",
        risk: "low",
      },
      {
        name: "ALERT_EMAIL",
        what: "Where down alerts and backup failures go. Unset: the owner's address from ADMIN_EMAILS.",
        get: "Not a key: an address.",
        stored: "Railway → Web → Variables · GitHub → Actions secrets",
        code: "src/lib/monitor/incidents.ts, .github/workflows/backup.yml",
        risk: "low",
      },
    ],
  },
  {
    title: "AI",
    vars: [
      {
        name: "GOOGLE_GENERATIVE_AI_API_KEY",
        what: "Gemini: academy fit, project review, admin agent, transcription fallback.",
        get: "Google AI Studio → Get API key → Create.",
        link: GEMINI_KEYS,
        stored: "Railway → Web → Variables",
        code: "src/app/api/admin/agent/route.ts, src/app/api/review-project/route.ts",
        risk: "medium",
      },
      {
        name: "GEMINI_MODEL, AGENT_MODEL, GEMINI_TRANSCRIBE_MODEL, AGENT_PRICE_PER_M",
        what: "Which Gemini model each feature uses, and the price used to show agent cost. All optional.",
        get: "Model names from Google AI Studio's model list.",
        link: link("Gemini models", "https://ai.google.dev/gemini-api/docs/models"),
        stored: "Railway → Web → Variables (optional)",
        code: "src/app/api/admin/agent/route.ts, src/lib/agent/cost.ts",
        risk: "low",
      },
      {
        name: "GROQ_API_KEY",
        what: "Whisper transcription in the admin agent (faster than Gemini). Optional.",
        get: "Groq Console → API Keys → Create.",
        link: link("Groq → API keys", "https://console.groq.com/keys"),
        stored: "Railway → Web → Variables",
        code: "src/app/api/admin/transcribe/route.ts",
        risk: "medium",
      },
    ],
  },
  {
    title: "Analytics",
    vars: [
      {
        name: "GA4_PROPERTY_ID",
        what: "The GA4 property behind Admin → Analytics.",
        get: "Google Analytics → Admin → Property details → Property ID (digits only).",
        link: link("Google Analytics", "https://analytics.google.com/analytics/web/"),
        stored: "Railway → Web → Variables",
        code: "src/lib/google.ts",
        risk: "low",
      },
      {
        name: "SEARCH_CONSOLE_SITE_URL",
        what: "The Search Console property behind Admin → SEO.",
        get: "Search Console → property picker; copy it exactly (e.g. sc-domain:nectarray.com).",
        link: link("Search Console", "https://search.google.com/search-console"),
        stored: "Railway → Web → Variables",
        code: "src/lib/google.ts",
        risk: "low",
      },
      {
        name: "GOOGLE_SERVICE_ACCOUNT_JSON",
        what: "Reads GA4 and Search Console. Its email needs Viewer on GA4 and access on Search Console.",
        get: "Google Cloud → Service accounts → the account → Keys → Add key → JSON. Paste the whole file.",
        link: SERVICE_ACCOUNTS,
        stored: "Railway → Web → Variables",
        code: "src/lib/google.ts",
        risk: "medium",
      },
      {
        name: "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
        what: "Search Console HTML-tag verification. Only if not verified by DNS.",
        get: "Search Console → Settings → Ownership verification → HTML tag → the content value.",
        link: link("Search Console", "https://search.google.com/search-console"),
        stored: "Railway → Web → Variables (optional)",
        code: "src/app/layout.tsx",
        risk: "low",
      },
    ],
  },
  {
    title: "Services and storage",
    vars: [
      {
        name: "JUDGE_URL, JUDGE_TOKEN, LATEX_URL, LATEX_TOKEN",
        what: "Nectarray Backend (Python judge + LaTeX). Same URL, two tokens. Locally http://localhost:8081, tokens \"dev\".",
        get: `URL: Railway → Nectarray Backend → Settings → Networking (private judge.railway.internal). Tokens: ${MAKE_SECRET} Set the same token on both services.`,
        link: link("Railway project", RAILWAY.nectarray),
        stored: "Railway → Web and Nectarray Backend → Variables",
        code: "src/app/api/judge/route.ts, src/lib/latex-compile.ts, services/judge",
        risk: "high",
      },
      {
        name: "DRIVE_BUCKET_ENDPOINT, _NAME, _REGION, _ACCESS_KEY_ID, _SECRET_ACCESS_KEY",
        what: "The Railway bucket behind Admin → Drive.",
        get: "Railway → bucket drive → Credentials. On Web use references: ${{drive.ENDPOINT}}, ${{drive.BUCKET}} …",
        link: link("Railway project", RAILWAY.nectarray),
        stored: "Railway → Web → Variables · GitHub → Actions secrets (Drive backup, still to add)",
        code: "src/lib/drive-storage.ts, .github/workflows/backup.yml",
        risk: "high",
      },
      {
        name: "WORKSPACE_URL, WORKSPACE_SECRET",
        what: "Address of the Workspace runner and the secret that signs its one-minute pass.",
        get: `URL: Railway → Workspace → Settings → Networking. Secret: ${MAKE_SECRET} Same value on Web and Workspace.`,
        link: link("Railway project", RAILWAY.nectarray),
        stored: "Railway → Web and Workspace → Variables",
        code: "src/app/admin/(panel)/workspace/actions.ts, workspace/server.mjs",
        risk: "high",
      },
      {
        name: "GITHUB_TOKEN",
        what: "Raises GitHub API limits for project reviews (Web); clones and pushes repos (Workspace).",
        get: "GitHub → Settings → Developer settings → Fine-grained tokens → Generate. Contents: read (Web), read and write (Workspace).",
        link: link("GitHub → Tokens", "https://github.com/settings/personal-access-tokens"),
        stored: "Railway → Web (optional) and Workspace → Variables",
        code: "src/lib/github.ts, workspace/server.mjs",
        risk: "high",
      },
    ],
  },
  {
    title: "Deploy board and alerts",
    vars: [
      {
        name: "RAILWAY_API_TOKEN",
        what: "Reads deploy status for the Workspace board. Full access today: swap for a project token (F9).",
        get: "Railway → Account → Tokens → Create (or a project token under Project → Settings → Tokens).",
        link: link("Railway → Tokens", "https://railway.com/account/tokens"),
        stored: "Railway → Web → Variables",
        code: "src/lib/deploys/board.ts",
        risk: "high",
      },
      {
        name: "VERCEL_API_TOKEN",
        what: "Reads Vercel deploys for the board.",
        get: "Vercel → Account Settings → Tokens → Create, scoped to the team.",
        link: link("Vercel → Tokens", "https://vercel.com/account/settings/tokens"),
        stored: "Railway → Web → Variables",
        code: "src/lib/deploys/board.ts",
        risk: "high",
      },
      {
        name: "MONITOR_HOOK_TOKEN",
        what: "Checks Railway webhook calls to /api/hooks/railway.",
        get: `${MAKE_SECRET} Then in each Railway project → Settings → Webhooks, use https://nectarray.com/api/hooks/railway?token=<it>.`,
        link: link("Railway project", RAILWAY.nectarray),
        stored: "Railway → Web → Variables · each project's webhook URL",
        code: "src/app/api/hooks/railway/route.ts",
        risk: "medium",
      },
      {
        name: "MONITOR_URLS",
        what: "Addresses the uptime checker requests every 2 minutes, comma-separated.",
        get: "Not a key: list the URLs.",
        stored: "Railway → Web → Variables",
        code: "src/lib/monitor/uptime.ts",
        risk: "low",
      },
    ],
  },
  {
    title: "Backups (GitHub Actions)",
    vars: [
      {
        name: "BACKUP_DATABASE_URL",
        what: "Public connection string the backup job dumps from.",
        get: "Railway → Postgres → Variables → DATABASE_PUBLIC_URL. Update it whenever the DB password changes.",
        link: link(
          "GitHub → Actions secrets",
          "https://github.com/satyaprakashdhfm/Nectarray/settings/secrets/actions",
        ),
        stored: "GitHub → Actions secrets",
        code: ".github/workflows/backup.yml, backup-verify.yml",
        risk: "high",
      },
      {
        name: "R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY",
        what: "Write access to the R2 bucket nectarray-backup.",
        get: "Cloudflare → R2 → Manage API tokens → Create (Object Read & Write, bucket nectarray-backup).",
        link: link("Cloudflare → R2", "https://dash.cloudflare.com/?to=/:account/r2/api-tokens"),
        stored: "GitHub → Actions secrets",
        code: ".github/workflows/backup.yml",
        risk: "high",
      },
      {
        name: "ANDROID_KEYSTORE, ANDROID_KEYSTORE_PASSWORD",
        what: "Signs the Android APK. Losing the keystore means users must uninstall to update.",
        get: "Made once with keytool; the base64 of the .jks file. Keep the original in the password manager.",
        link: link(
          "GitHub → Actions secrets",
          "https://github.com/satyaprakashdhfm/Nectarray/settings/secrets/actions",
        ),
        stored: "GitHub → Actions secrets · password manager",
        code: ".github/workflows/mobile-app.yml",
        risk: "high",
      },
    ],
  },
  {
    title: "Leftovers to remove",
    vars: [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
        what: "Supabase is retired; only the migration's one-time import still reads them.",
        get: "Nothing to get. Delete from Railway and .env.example once the import is gone.",
        stored: "Railway → Web → Variables (if still there)",
        code: "scripts/migrate.mjs",
        risk: "high",
      },
    ],
  },
];

/* -------------------------------------------------------------------- */

const ADC_BACKEND = "Railway → adc-backend → Variables";

const ADC: EnvGroup[] = [
  {
    title: "Core",
    vars: [
      {
        name: "DATABASE_URL",
        what: "PostgresProd connection string. Leave empty locally (use PG* vars), or SSL is forced.",
        get: "Railway → adoughcookie → PostgresProd → Variables → DATABASE_URL (reference it from adc-backend).",
        link: link("Railway project", RAILWAY.adc),
        stored: ADC_BACKEND,
        code: "src/db/index.ts",
        risk: "high",
      },
      {
        name: "JWT_SECRET, STORE_JWT_SECRET",
        what: "Signs store-staff tokens and media links. STORE_JWT_SECRET overrides for staff tokens.",
        get: MAKE_SECRET,
        stored: ADC_BACKEND,
        code: "src/services/storeAuth.service.ts, src/services/storage.client.ts",
        risk: "high",
      },
      {
        name: "FRONTEND_URL, ALLOWED_ORIGINS",
        what: "The storefront address, and the browser origins the API accepts.",
        get: "Not keys: https://www.adoughcookie.com (comma-separate several origins).",
        stored: ADC_BACKEND,
        code: "src/app.ts, src/routes/auth.routes.ts",
        risk: "low",
      },
      {
        name: "NEXT_PUBLIC_API_URL, BACKEND_INTERNAL_URL",
        what: "Where the frontend calls the API. Internal = Railway private network, used first.",
        get: "Internal: http://adc-backend.railway.internal:8080. Public: the backend's Railway domain + /api.",
        link: link("Railway project", RAILWAY.adc),
        stored: "Railway → adc-frontend → Variables",
        code: "adc-cookies-frontend/next.config.ts, src/lib/api.ts",
        risk: "low",
      },
    ],
  },
  {
    title: "Sign-in",
    vars: [
      {
        name: "AUTH_KEY, CUSTOMER_ID, MC_BASE_URL",
        what: "Message Central (VerifyNow) phone OTP. No sandbox: every code is a real SMS.",
        get: "Message Central console → Settings / Credentials: Customer ID and auth token. MC_BASE_URL https://cpaas.messagecentral.com.",
        link: link("Message Central console", "https://console.messagecentral.com/"),
        stored: ADC_BACKEND,
        code: "src/services/messageCentral.client.ts",
        risk: "medium",
      },
      {
        name: "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI",
        what: "Google sign-in for customers.",
        get: "Google Cloud → Credentials → the ADC OAuth Web client. The redirect URI must match one listed there.",
        link: GOOGLE_CREDENTIALS,
        stored: ADC_BACKEND,
        code: "src/services/googleAuth.service.ts",
        risk: "high",
      },
    ],
  },
  {
    title: "Payments",
    vars: [
      {
        name: "RAZORPAY_API_KEY, RAZORPAY_API_SECRET",
        what: "Takes payments. rzp_test_ keys for testing, rzp_live_ in production.",
        get: "Razorpay Dashboard → Account & Settings → API Keys → Generate. The secret shows once.",
        link: link("Razorpay → API keys", "https://dashboard.razorpay.com/app/website-app-settings/api-keys"),
        stored: ADC_BACKEND,
        code: "src/services/razorpay.client.ts",
        risk: "high",
      },
      {
        name: "RAZORPAY_WEBHOOK_SECRET",
        what: "Verifies Razorpay's payment webhooks.",
        get: "Razorpay → Webhooks → the webhook → Secret (you choose it there).",
        link: link("Razorpay → Webhooks", "https://dashboard.razorpay.com/app/webhooks"),
        stored: ADC_BACKEND,
        code: "src/services/razorpay.client.ts",
        risk: "medium",
      },
    ],
  },
  {
    title: "Delivery and POS",
    vars: [
      {
        name: "DELIVERY_API_TOKEN, DELHIVERY_BASE_URL",
        what: "Delhivery intercity shipping. Default host is production.",
        get: "Delhivery One → Settings → API Setup → token. Base URL https://track.delhivery.com.",
        link: link("Delhivery One", "https://one.delhivery.com/"),
        stored: ADC_BACKEND,
        code: "src/services/delhivery.client.ts",
        risk: "medium",
      },
      {
        name: "SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_BASE_URL",
        what: "Shiprocket same-day (hyperlocal) delivery. Logs in as an API user.",
        get: "Shiprocket → Settings → API → Configure → Create an API user (its own email and password).",
        link: link("Shiprocket → API users", "https://app.shiprocket.in/api-user"),
        stored: ADC_BACKEND,
        code: "src/services/shiprocket.client.ts",
        risk: "medium",
      },
      {
        name: "SHIPROCKET_WEBHOOK_TOKEN",
        what: "Checks Shiprocket's status calls to /api/hyperlocal.",
        get: "Shiprocket → Settings → API → Webhooks: set the token there and here to the same value.",
        link: link("Shiprocket", "https://app.shiprocket.in/"),
        stored: ADC_BACKEND,
        code: "src/routes/webhooks/hyperlocal.routes.ts",
        risk: "medium",
      },
      {
        name: "PETPOOJA_API, PETPOOJA_API_SECRET, PETPOOJA_API_TOKEN, PETPOOJA_WEBHOOK_SECRET",
        what: "Kitchen POS link. Petpooja allowlists the backend's static outbound IPs.",
        get: "Not self-serve: Petpooja's integration team issues them. Ask your Petpooja account manager.",
        stored: ADC_BACKEND,
        code: "src/services/petpooja.client.ts, src/routes/webhooks/petpooja.routes.ts",
        risk: "medium",
      },
    ],
  },
  {
    title: "WhatsApp and Meta",
    vars: [
      {
        name: "META_ACCESS_TOKEN",
        what: "One system-user token for WhatsApp, Conversions API and Ads.",
        get: "Meta Business Settings → System users → the user → Generate token (whatsapp_business_messaging, ads_read, …).",
        link: link("Meta → System users", "https://business.facebook.com/settings/system-users"),
        stored: ADC_BACKEND,
        code: "src/services/whatsapp.client.ts, metaCapi.client.ts, metaAds.client.ts",
        risk: "medium",
      },
      {
        name: "WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_BUSINESS_ACCOUNT_ID",
        what: "Which WhatsApp number and account to send from.",
        get: "Meta for Developers → the app → WhatsApp → API Setup.",
        link: link("Meta for Developers → Apps", "https://developers.facebook.com/apps"),
        stored: ADC_BACKEND,
        code: "src/services/whatsapp.client.ts",
        risk: "low",
      },
      {
        name: "WHATSAPP_APP_SECRET, WHATSAPP_WEBHOOK_VERIFY_TOKEN",
        what: "Verify incoming WhatsApp webhooks. Must be set: unset, unsigned calls get in (F7).",
        get: "App secret: the app → App settings → Basic. Verify token: you choose it, and enter it under WhatsApp → Configuration.",
        link: link("Meta for Developers → Apps", "https://developers.facebook.com/apps"),
        stored: ADC_BACKEND,
        code: "src/routes/webhooks/whatsapp.routes.ts",
        risk: "medium",
      },
      {
        name: "META_PIXEL_ID, META_AD_ACCOUNT_ID, NEXT_PUBLIC_META_PIXEL_ID",
        what: "Pixel for Conversions API and the browser; ad account for spend reports.",
        get: "Pixel: Events Manager → the dataset → Settings. Ad account: Ads Manager, top-left account ID.",
        link: link("Meta Events Manager", "https://business.facebook.com/events_manager2"),
        stored: "adc-backend and adc-frontend → Variables",
        code: "src/services/metaCapi.client.ts, metaAds.client.ts",
        risk: "low",
      },
    ],
  },
  {
    title: "Email, maps, AI, analytics",
    vars: [
      {
        name: "ZEPTOMAIL_API_KEY",
        what: "Order and account emails.",
        get: "ZeptoMail → Mail Agents → the agent → SMTP/API → Send Mail Token.",
        link: link("ZeptoMail", "https://zeptomail.zoho.in/"),
        stored: ADC_BACKEND,
        code: "src/services/mailer.client.ts",
        risk: "medium",
      },
      {
        name: "OLA_CLIENT_ID, OLA_CLIENT_SECRET",
        what: "Ola Maps geocoding and distance (falls back to Nominatim).",
        get: "Ola Krutrim Maps console → Projects → the project → Credentials.",
        link: link("Ola Maps console", "https://maps.olakrutrim.com/"),
        stored: ADC_BACKEND,
        code: "src/services/geo.client.ts",
        risk: "medium",
      },
      {
        name: "GOOGLE_API_KEY, CHAT_MODEL",
        what: "Gemini for the storefront chat assistant.",
        get: "Google AI Studio → Get API key → Create.",
        link: GEMINI_KEYS,
        stored: ADC_BACKEND,
        code: "src/services/chat.service.ts",
        risk: "medium",
      },
      {
        name: "GA4_PROPERTY_ID, SEARCH_CONSOLE_SITE, GA4_SERVICE_ACCOUNT_JSON",
        what: "Admin analytics. Service account needs Viewer on GA4 and Search Console access.",
        get: "Property ID: GA4 → Admin → Property details. JSON: Google Cloud → Service accounts → Keys → Add key.",
        link: SERVICE_ACCOUNTS,
        stored: ADC_BACKEND,
        code: "src/services/ga4.client.ts, searchConsole.client.ts",
        risk: "medium",
      },
      {
        name: "NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_ADS_ID, NEXT_PUBLIC_ADS_PURCHASE_LABEL",
        what: "Browser tags for GA4 and Google Ads conversions.",
        get: "GA4 → Admin → Data streams → Measurement ID. Ads → Goals → Conversions → the tag.",
        link: link("Google Ads", "https://ads.google.com/"),
        stored: "Railway → adc-frontend → Variables",
        code: "adc-cookies-frontend/src",
        risk: "low",
      },
    ],
  },
  {
    title: "Backups, tuning, leftovers",
    vars: [
      {
        name: "BACKUP_DATABASE_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY",
        what: "Nightly dump to R2.",
        get: "PostgresProd → Variables → DATABASE_PUBLIC_URL. R2: Cloudflare → R2 → Manage API tokens.",
        link: link("GitHub → Actions secrets", "https://github.com/satyaprakashdhfm/ADC/settings/secrets/actions"),
        stored: "GitHub → Actions secrets",
        code: ".github/workflows/db-backup.yml",
        risk: "high",
      },
      {
        name: "STATUS_POLL_*, PAYMENT_RECONCILE_*, RIDER_*, LOG_*, WHATSAPP_REMINDER_SWEEP_MS, USER_SESSION_DAYS …",
        what: "Timers and limits for background jobs. All have defaults; set only to change behaviour.",
        get: "Not keys: read the default in the file before changing.",
        stored: `${ADC_BACKEND} (only if overridden)`,
        code: "src/jobs/*, src/config/delivery.ts",
        risk: "low",
      },
      {
        name: "SUPABASE_URL, ANON_KEY, SUPABASE_SERVICE_ROLE_KEY",
        what: "Supabase is retired (8 Sep 2026). Still read in config/supabase.ts.",
        get: "Nothing to get. Remove from code and Railway.",
        stored: `${ADC_BACKEND} (if still there)`,
        code: "src/config/supabase.ts",
        risk: "high",
      },
    ],
  },
];

/* -------------------------------------------------------------------- */

const MOBILE: EnvGroup[] = [
  {
    title: "API (Rust)",
    vars: [
      {
        name: "DATABASE_URL",
        what: "Postgres connection string. Migrations run on start.",
        get: "Railway → Mobile_Dashboard → Postgres → Variables → DATABASE_URL.",
        link: link("Railway project", RAILWAY.mobile),
        stored: "Railway → API service → Variables · backend/.env locally",
        code: "backend/crates/core/src/config.rs",
        risk: "high",
      },
      {
        name: "ADMIN_PASSWORD",
        what: "Password for the admin user created on first start.",
        get: "Choose a strong one; keep it in the password manager.",
        stored: "Railway → API service → Variables",
        code: "backend/crates/core/src/bootstrap.rs",
        risk: "high",
      },
      {
        name: "HOST, PORT, UPLOAD_DIR, COOKIE_SECURE",
        what: "Listen on [::]:$PORT, uploads on the volume, secure cookies behind HTTPS.",
        get: "Not keys. Dockerfile sets HOST=::, PORT=8080, UPLOAD_DIR=/data/uploads.",
        stored: "backend/Dockerfile · Railway → API service → Variables",
        code: "backend/crates/core/src/config.rs",
        risk: "low",
      },
    ],
  },
  {
    title: "Frontend",
    vars: [
      {
        name: "API_ORIGIN",
        what: "Where the Next.js rewrite sends /api/*.",
        get: "The API's private address on Railway, e.g. http://<api>.railway.internal:8080.",
        link: link("Railway project", RAILWAY.mobile),
        stored: "Railway → frontend service → Variables",
        code: "frontend/next.config.ts",
        risk: "low",
      },
    ],
  },
];

export const DEVOPS_ENV: Record<string, EnvGroup[]> = {
  nectarray: NECTARRAY,
  adc: ADC,
  "mobile-dashboard": MOBILE,
};
