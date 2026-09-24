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
 * What a client project can be recorded under. The academy is not one — its
 * money is on enrolments. `software_ai` is a single job that is both a build
 * and an agent: it shows on the Software tab and the Agentic AI tab, and its
 * money is counted once, on its own line.
 */
export const PROJECT_SERVICES = [
  { id: "marketing", label: "Marketing" },
  { id: "software", label: "Software" },
  { id: "ai", label: "Agentic AI" },
  { id: "software_ai", label: "Software + AI" },
] as const;

/** Which recorded services each development tab shows. */
export const TAB_SERVICES: Record<string, string[]> = {
  marketing: ["marketing"],
  software: ["software", "software_ai"],
  ai: ["ai", "software_ai"],
};

/** The lines revenue is split into: every project service, then the academy. */
export const REVENUE_LINES = [
  ...PROJECT_SERVICES,
  { id: "academy", label: "Academy" },
] as const;

export const serviceLabel = (id: string) =>
  REVENUE_LINES.find((s) => s.id === id)?.label ?? id;

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
 * values — so this is safe to render. Nothing calls these APIs yet; the
 * cards say what is still missing.
 */
export const CONNECTIONS = {
  searchConsole: {
    label: "Google Search Console",
    gives:
      "Clicks, impressions and average position for every page and search term",
    env: ["GSC_SITE_URL", "GOOGLE_SERVICE_ACCOUNT_JSON"],
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
