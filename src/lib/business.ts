/**
 * The four services, and the words the business dashboard uses about them.
 *
 * `path` is the part of the site each service owns. It is what traffic and
 * rankings get split by once Analytics and Search Console are connected: a
 * visit to /software/… belongs to Software.
 */
export const SERVICES = [
  { id: "marketing", label: "Marketing", path: "/marketing" },
  { id: "software", label: "Software", path: "/software" },
  { id: "ai", label: "Agentic AI", path: "/agentic-ai" },
  { id: "academy", label: "Academy", path: "/academy" },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

/**
 * What a client project can be recorded under. `training` is a client's
 * team taught at the academy, so it is shown and counted as Academy.
 */
export const PROJECT_SERVICES = [
  { id: "marketing", label: "Marketing" },
  { id: "software", label: "Software" },
  { id: "ai", label: "Agentic AI" },
  { id: "training", label: "Academy" },
] as const;

/** Which recorded services each development tab shows. */
export const TAB_SERVICES: Record<string, string[]> = {
  marketing: ["marketing"],
  software: ["software", "software_ai"],
  ai: ["ai"],
  training: ["training"],
};

/**
 * The four lines money is split into, and the recorded services each one
 * takes in. "software_ai" is what Software projects were once saved as.
 */
export const REVENUE_LINES = [
  { id: "marketing", label: "Marketing", takes: ["marketing"] },
  { id: "software", label: "Software", takes: ["software", "software_ai"] },
  { id: "ai", label: "Agentic AI", takes: ["ai"] },
  { id: "academy", label: "Academy", takes: ["academy", "training"] },
] as const;

/** The revenue line a recorded service is counted on. */
export const lineOf = (service: string) =>
  REVENUE_LINES.find((l) => (l.takes as readonly string[]).includes(service))
    ?.id ?? service;

export const serviceLabel = (id: string) =>
  REVENUE_LINES.find((s) => s.id === lineOf(id))?.label ?? id;

/**
 * Our own products, recorded as projects: Nectarray and Verona Ads. Their
 * "client" is the company itself, so what they cost only ever comes out of
 * the company's money, and nothing they "pay back" comes in.
 */
export const isOwnCompany = (client: string, title = "") =>
  /verona|nect\s*array/i.test(`${client} ${title}`);

export const isService = (id: string): id is ServiceId =>
  SERVICES.some((s) => s.id === id);

export const PROJECT_STATUSES = [
  { id: "lead", label: "Lead", tone: "bg-mist text-ink-soft" },
  { id: "proposal", label: "Proposal", tone: "bg-amber-wash text-amber-deep" },
  { id: "active", label: "Active", tone: "bg-brand-wash text-brand-deep" },
  { id: "on_hold", label: "On hold", tone: "bg-mist text-ink-faint" },
  { id: "delivered", label: "Delivered", tone: "bg-leaf-wash text-leaf-deep" },
  { id: "lost", label: "Lost", tone: "bg-mist text-ink-faint" },
] as const;

export const BLOG_STATUSES = ["idea", "writing", "published"] as const;
export const CAMPAIGN_STATUSES = ["active", "paused", "ended"] as const;
export const PLATFORMS = [
  { id: "google", label: "Google Ads" },
  { id: "meta", label: "Meta Ads" },
  { id: "linkedin", label: "LinkedIn Ads" },
  { id: "amazon", label: "Amazon Ads" },
  { id: "other", label: "Other" },
] as const;

export const platformLabel = (id: string) =>
  PLATFORMS.find((p) => p.id === id)?.label ?? id;

/**
 * What each outside source needs before it can feed the dashboard.
 *
 * Only whether the variables are set is ever read here — never their
 * values — so this is safe to render. Search Console and GA4 are read live
 * through src/lib/google.ts; the ad platforms are not called yet.
 */
export const CONNECTIONS = {
  searchConsole: {
    label: "Google Search Console",
    gives:
      "Clicks, impressions and average position for every page and search term",
    env: ["SEARCH_CONSOLE_SITE_URL", "GOOGLE_SERVICE_ACCOUNT_JSON"],
  },
  analytics: {
    label: "Google Analytics 4",
    gives: "Visitors, sessions and traffic sources, split by service page",
    env: ["GA4_PROPERTY_ID", "GOOGLE_SERVICE_ACCOUNT_JSON"],
  },
  googleAds: {
    label: "Google Ads",
    gives: "Campaign spend, clicks and conversions",
    env: [
      "GOOGLE_ADS_DEVELOPER_TOKEN",
      "GOOGLE_ADS_CUSTOMER_ID",
      "GOOGLE_ADS_REFRESH_TOKEN",
    ],
  },
  metaAds: {
    label: "Meta Ads",
    gives: "Facebook and Instagram campaign spend, clicks and leads",
    env: ["META_ADS_ACCESS_TOKEN", "META_AD_ACCOUNT_ID"],
  },
} as const;

export type ConnectionId = keyof typeof CONNECTIONS;

/** Server only: which of a connection's variables are still unset. */
export function missingEnv(id: ConnectionId) {
  return CONNECTIONS[id].env.filter((name) => !process.env[name]);
}

export const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const num = (value: string | number | null | undefined) =>
  value == null || value === "" ? 0 : Number(value);
