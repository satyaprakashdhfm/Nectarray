import { PROJECT_SERVICES } from "@/lib/business";

/**
 * Quotations: the rows a quote is made of, the sums, and the rows a new
 * quote starts with. Shared by the builder (client) and the actions
 * (server), so nothing here touches the database.
 */

export type QuoteService = (typeof PROJECT_SERVICES)[number]["id"];
export type Billing = "once" | "monthly";
export type DiscountMode = "none" | "percent" | "amount";
export type Discount = { mode: DiscountMode; value: number };
export type QuoteSection = "build" | "marketing" | "maintenance";

export type QuoteLine = {
  id: string;
  /** Ticked rows are in the quote; unticked ones stay in the list. */
  on: boolean;
  section: QuoteSection;
  /** Rows sharing a group show as options under one heading. */
  groupId: string | null;
  groupName: string | null;
  name: string;
  service: QuoteService;
  description: string;
  price: number;
  billing: Billing;
  discount: Discount;
  /** The standard item this row came from, for its picture and details. */
  ref?: string | null;
};

export type QuoteDoc = {
  intro: string;
  /** What was agreed in the first meeting, one point a line. */
  understanding: string;
  terms: string;
};

export type QuoteBody = {
  lines: QuoteLine[];
  /** Taken off the one-time total, after each row's own discount. */
  discount: Discount;
  doc: QuoteDoc;
  validDays: number;
};

export const QUOTE_STATUSES = [
  { id: "draft", label: "Draft", tone: "bg-mist text-ink-soft" },
  { id: "sent", label: "Sent", tone: "bg-amber-wash text-amber-deep" },
  { id: "accepted", label: "Accepted", tone: "bg-leaf-wash text-leaf-deep" },
  { id: "declined", label: "Declined", tone: "bg-mist text-ink-faint" },
] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number]["id"];

export const QUOTE_SECTIONS: {
  id: QuoteSection;
  label: string;
  lede: string;
}[] = [
  {
    id: "build",
    label: "Build",
    lede: "The website, app and features, paid once.",
  },
  {
    id: "marketing",
    label: "Marketing",
    lede: "Search, blogs and ads, usually monthly.",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    lede: "Keeping everything running after launch, monthly.",
  },
];

/** The percentages in the discount dropdown. */
export const DISCOUNT_PERCENTS = [5, 10, 15, 20, 25, 30, 40, 50];

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

// Sums ---------------------------------------------------------------------

export function discountOf(amount: number, d: Discount) {
  if (d.mode === "percent") return Math.round((amount * d.value) / 100);
  if (d.mode === "amount") return Math.min(d.value, amount);
  return 0;
}

export const lineTotal = (line: QuoteLine) =>
  line.price - discountOf(line.price, line.discount);

export function quoteTotals(body: QuoteBody) {
  const on = body.lines.filter((l) => l.on);
  const once = on.filter((l) => l.billing === "once");
  const monthly = on.filter((l) => l.billing === "monthly");
  const onceList = once.reduce((n, l) => n + l.price, 0);
  const onceSubtotal = once.reduce((n, l) => n + lineTotal(l), 0);
  const overall = discountOf(onceSubtotal, body.discount);
  const onceTotal = onceSubtotal - overall;
  const monthlyTotal = monthly.reduce((n, l) => n + lineTotal(l), 0);
  return {
    onceList,
    onceSubtotal,
    overall,
    onceTotal,
    monthlyTotal,
    /** Everything taken off the one-time list price. */
    onceSaved: onceList - onceTotal,
    count: on.length,
  };
}

/**
 * What each service is worth in this quote, for adding it to that service's
 * tab: one-time rows after their own discount, less a fair share of the
 * overall discount, and the monthly rows on their own.
 */
export function totalsByService(body: QuoteBody) {
  const t = quoteTotals(body);
  const share = t.onceSubtotal > 0 ? t.onceTotal / t.onceSubtotal : 1;
  const out = new Map<QuoteService, { once: number; monthly: number }>();
  for (const line of body.lines) {
    if (!line.on) continue;
    const row = out.get(line.service) ?? { once: 0, monthly: 0 };
    if (line.billing === "once") row.once += lineTotal(line) * share;
    else row.monthly += lineTotal(line);
    out.set(line.service, row);
  }
  return [...out].map(([service, v]) => ({
    service,
    once: Math.round(v.once),
    monthly: Math.round(v.monthly),
  }));
}

// The standard items, and what a new quote starts with ----------------------

export type CatalogueItem = {
  ref: string;
  section: QuoteSection;
  name: string;
  description: string;
  /** Our standard price, in rupees: one-time, or a month for monthly rows. */
  price: number;
  billing: Billing;
  service: QuoteService;
  /** Rows offered as options under one heading. */
  group?: string;
  image?: string;
  includes: string[];
};

/**
 * Every standard row, with our price for it.
 *
 * The prices are a starting point for a small business in India and are
 * meant to be changed per client. Monthly rows are per month; ad spend and
 * provider charges are always on top.
 */
export const CATALOGUE: CatalogueItem[] = [
  {
    ref: "website",
    section: "build",
    name: "Basic website",
    description:
      "A static website of 5 to 7 pages: home, about, services, gallery and contact. Works on phones and laptops.",
    price: 15000,
    billing: "once",
    service: "software",
    image: "/services/software.webp",
    includes: [
      "Design in your brand colours, with your logo and photos",
      "Up to 7 pages: home, about, services, gallery, contact and two more",
      "Contact form and WhatsApp button that send enquiries to you",
      "Works on phones, tablets and laptops",
      "Basic SEO set-up: page titles, Google Search Console, sitemap",
      "Domain and hosting set-up (domain and hosting fees are separate)",
    ],
  },
  {
    ref: "admin",
    section: "build",
    name: "Admin portal",
    description:
      "An admin panel to change the website's text, images, prices and offers without a developer.",
    price: 20000,
    billing: "once",
    service: "software",
    image: "/agentic/domains/reporting.webp",
    includes: [
      "Secure admin sign-in",
      "Edit text, photos, prices, offers and banners yourself",
      "Add and remove products, services or gallery items",
      "See and export every enquiry from the website",
      "Changes show on the website straight away",
    ],
  },
  {
    ref: "articles-admin",
    section: "build",
    group: "Articles",
    name: "Articles uploaded by the admin",
    description:
      "The admin writes or uploads an article and it shows on the website straight away.",
    price: 8000,
    billing: "once",
    service: "software",
    image: "/marketing/text-articles.webp",
    includes: [
      "Blog or news section on the website",
      "Write or paste an article with photos from the admin portal",
      "Categories, cover image and share buttons",
      "Each article gets its own page that Google can find",
    ],
  },
  {
    ref: "articles-ai",
    section: "build",
    group: "Articles",
    name: "AI-written articles",
    description:
      "AI drafts articles on your topics. You edit them and publish them to the website.",
    price: 15000,
    billing: "once",
    service: "ai",
    image: "/marketing/text-articles.webp",
    includes: [
      "Give a topic or keyword and get a full draft article",
      "Edit the draft in the admin portal before it goes live",
      "Publish now or schedule for later",
      "Written to rank in Google search",
      "AI usage charges are separate",
    ],
  },
  {
    ref: "client-login",
    section: "build",
    group: "Logins and dashboards",
    name: "Client login",
    description:
      "Customers sign in to see their orders, bookings or documents.",
    price: 15000,
    billing: "once",
    service: "software",
    image: "/agentic/domains/support.webp",
    includes: [
      "Sign-in with mobile OTP or email",
      "Each customer sees only their own orders, bookings or files",
      "Download invoices and documents",
      "Profile and password reset",
    ],
  },
  {
    ref: "employee-login",
    section: "build",
    group: "Logins and dashboards",
    name: "Employee login",
    description:
      "Staff sign in to their own dashboard, with only the pages they need.",
    price: 15000,
    billing: "once",
    service: "software",
    image: "/agentic/domains/people.webp",
    includes: [
      "Separate sign-in for staff",
      "Roles, so each person sees only the pages they need",
      "Assign enquiries, orders or tasks to a person",
      "Activity log of who changed what",
    ],
  },
  {
    ref: "social",
    section: "build",
    name: "Social media integration",
    description:
      "Instagram, Facebook, LinkedIn and YouTube linked to the site, with share buttons on pages.",
    price: 5000,
    billing: "once",
    service: "marketing",
    image: "/marketing/instagram-search.webp",
    includes: [
      "Links to all your social pages",
      "Latest Instagram posts or YouTube videos shown on the site",
      "Share buttons on pages and articles",
      "Preview image and text when a link is shared on WhatsApp",
    ],
  },
  {
    ref: "notifications",
    section: "build",
    name: "Notifications",
    description:
      "Automatic email, WhatsApp and SMS messages for enquiries, orders and reminders. Message charges from the providers are extra.",
    price: 12000,
    billing: "once",
    service: "software",
    image: "/agentic/agents.webp",
    includes: [
      "Email to you and the customer on every enquiry or order",
      "WhatsApp messages through the WhatsApp Business API",
      "SMS for OTPs and reminders",
      "Message templates you can change",
      "Provider message charges are paid separately",
    ],
  },
  {
    ref: "analytics",
    section: "build",
    name: "Analytics dashboard",
    description:
      "How many people visit the website, where they come from, which pages they read and how many enquire.",
    price: 10000,
    billing: "once",
    service: "marketing",
    image: "/marketing/measure-dashboard.webp",
    includes: [
      "Google Analytics and Search Console set up",
      "Visitors by day, city and source (Google, Instagram, ads)",
      "Most-read pages and how long people stay",
      "Enquiries and which page they came from",
      "One dashboard inside the admin portal",
    ],
  },
  {
    ref: "delivery",
    section: "build",
    name: "Delivery integration",
    description:
      "Book deliveries through partners such as Rapido and Porter from the admin panel, with live status.",
    price: 25000,
    billing: "once",
    service: "software",
    image: "/agentic/domains/operations.webp",
    includes: [
      "Book a pickup from the admin portal in one click",
      "Delivery partners such as Rapido, Porter or Shiprocket",
      "Live delivery status for you and the customer",
      "Delivery charge worked out at checkout",
      "Partner delivery fees are paid separately",
    ],
  },
  {
    ref: "app",
    section: "build",
    name: "Mobile app",
    description:
      "Android and iPhone app with the same features as the website, published on the Play Store and App Store.",
    price: 80000,
    billing: "once",
    service: "software",
    image: "/services/software.webp",
    includes: [
      "One app for Android and iPhone",
      "Same sign-in, products and features as the website",
      "Push notifications",
      "Published on the Play Store and App Store",
      "Store developer accounts are paid separately",
    ],
  },
  {
    ref: "seo",
    section: "marketing",
    name: "SEO and blog writing",
    description:
      "Keyword research, page fixes and new blog articles every month to move the website up in Google search.",
    price: 10000,
    billing: "monthly",
    service: "marketing",
    image: "/marketing/ads-google-seo.webp",
    includes: [
      "Keyword research for your area and services",
      "4 blog articles a month",
      "Page speed and on-page fixes",
      "Google Business Profile updates",
      "Monthly report of rankings and visitors",
    ],
  },
  {
    ref: "meta-ads",
    section: "marketing",
    name: "Meta ads",
    description:
      "Facebook and Instagram ads: set-up, creatives and weekly tuning. Ad spend is paid separately.",
    price: 8000,
    billing: "monthly",
    service: "marketing",
    image: "/marketing/ads-meta.webp",
    includes: [
      "Campaign set-up and audience targeting",
      "4 ad creatives a month",
      "Leads sent to WhatsApp or the website",
      "Weekly tuning and a monthly report",
      "Ad spend is paid to Meta directly",
    ],
  },
  {
    ref: "google-ads",
    section: "marketing",
    name: "Google ads",
    description:
      "Search and display ads: set-up, keywords and weekly tuning. Ad spend is paid separately.",
    price: 8000,
    billing: "monthly",
    service: "marketing",
    image: "/marketing/ads-google.webp",
    includes: [
      "Search campaign with your keywords",
      "Call and enquiry tracking",
      "Weekly tuning of keywords and bids",
      "Monthly report of cost per enquiry",
      "Ad spend is paid to Google directly",
    ],
  },
  {
    ref: "maintenance",
    section: "maintenance",
    name: "Maintenance",
    description:
      "Hosting checks, security updates, backups, bug fixes and small changes across all the services above.",
    price: 3000,
    billing: "monthly",
    service: "software",
    image: "/hero/software-hero.jpg",
    includes: [
      "Uptime checks and security updates",
      "Weekly backups",
      "Bug fixes",
      "Up to 2 hours of small changes a month",
    ],
  },
  {
    ref: "support-person",
    section: "maintenance",
    name: "Dedicated support person",
    description:
      "One named person for day-to-day updates, content uploads and questions.",
    price: 15000,
    billing: "monthly",
    service: "software",
    image: "/agentic/domains/support.webp",
    includes: [
      "One named person on WhatsApp and phone",
      "Uploads content, photos and offers for you",
      "Replies within working hours, Monday to Saturday",
    ],
  },
];

/** The standard item behind a row: by its ref, or else by its name. */
export function catalogueFor(line: Pick<QuoteLine, "ref" | "name">) {
  if (line.ref) {
    const hit = CATALOGUE.find((c) => c.ref === line.ref);
    if (hit) return hit;
  }
  const name = line.name.trim().toLowerCase();
  return CATALOGUE.find((c) => c.name.toLowerCase() === name);
}

export function defaultLines(): QuoteLine[] {
  const groups = new Map<string, string>();
  return CATALOGUE.map((c) => {
    let groupId: string | null = null;
    if (c.group) {
      if (!groups.has(c.group)) groups.set(c.group, newId());
      groupId = groups.get(c.group)!;
    }
    return {
      id: newId(),
      on: c.ref === "website",
      section: c.section,
      groupId,
      groupName: c.group ?? null,
      name: c.name,
      service: c.service,
      description: c.description,
      price: c.price,
      billing: c.billing,
      discount: { mode: "none", value: 0 },
      ref: c.ref,
    };
  });
}

export const STANDARD_TERMS = [
  "Prices are based on our first conversation and may change with the final requirements.",
  "Prices are in Indian rupees.",
  "Monthly maintenance charges start from the day the project goes live.",
  "Third-party costs such as ad spend, domain, hosting, SMS and WhatsApp message charges are paid separately.",
  "Payment terms will be agreed before work starts.",
].join("\n");

export const DEFAULT_DOC: QuoteDoc = {
  intro:
    "Thank you for taking the time to talk to us. This quotation lists the services you asked about, what we understood from our first conversation, and the price for each.",
  understanding: "",
  terms: STANDARD_TERMS,
};

export function defaultBody(): QuoteBody {
  return {
    lines: defaultLines(),
    discount: { mode: "none", value: 0 },
    doc: { ...DEFAULT_DOC },
    validDays: 30,
  };
}

/** One point a line, from the ticked rows. A starting draft to edit. */
export function understandingFromLines(lines: QuoteLine[]) {
  return lines
    .filter((l) => l.on)
    .map((l) => (l.description ? `${l.name}: ${l.description}` : l.name))
    .join("\n");
}

/**
 * A new quote's body from the saved starting rows, with fresh ids so two
 * quotes never share one. Group ids are remapped together.
 */
export function freshBody(base: QuoteBody): QuoteBody {
  const groups = new Map<string, string>();
  const lines = base.lines.map((l) => {
    let groupId = l.groupId;
    if (groupId) {
      if (!groups.has(groupId)) groups.set(groupId, newId());
      groupId = groups.get(groupId)!;
    }
    return { ...l, id: newId(), groupId };
  });
  return {
    ...base,
    lines,
    doc: { ...base.doc, understanding: understandingFromLines(lines) },
  };
}

// Checking what comes back from the browser ---------------------------------

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : "";

const money = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.round(n), 1e10) : 0;
};

function cleanDiscount(v: unknown): Discount {
  const d = (v ?? {}) as Partial<Discount>;
  const mode: DiscountMode =
    d.mode === "percent" || d.mode === "amount" ? d.mode : "none";
  const value = money(d.value);
  return { mode, value: mode === "percent" ? Math.min(value, 100) : value };
}

/** Anything the builder sends, made into a body that is safe to store. */
export function cleanBody(input: unknown): QuoteBody {
  const b = (input ?? {}) as Partial<QuoteBody>;
  const services = PROJECT_SERVICES.map((s) => s.id as string);
  const sections = QUOTE_SECTIONS.map((s) => s.id as string);
  const lines = (Array.isArray(b.lines) ? b.lines : [])
    .slice(0, 150)
    .map((raw): QuoteLine => {
      const l = (raw ?? {}) as Partial<QuoteLine>;
      const groupId = l.groupId ? str(l.groupId, 64) : null;
      return {
        id: str(l.id, 64) || newId(),
        on: Boolean(l.on),
        section: sections.includes(l.section as string)
          ? (l.section as QuoteSection)
          : "build",
        groupId,
        groupName: groupId ? str(l.groupName, 120) : null,
        name: str(l.name, 160),
        service: services.includes(l.service as string)
          ? (l.service as QuoteService)
          : "software",
        description: str(l.description, 2000),
        price: money(l.price),
        billing: l.billing === "monthly" ? "monthly" : "once",
        discount: cleanDiscount(l.discount),
        ref: l.ref ? str(l.ref, 40) : null,
      };
    });
  const doc = (b.doc ?? {}) as Partial<QuoteDoc>;
  const valid = Math.round(Number(b.validDays));
  return {
    lines,
    discount: cleanDiscount(b.discount),
    doc: {
      intro: str(doc.intro, 4000),
      understanding: str(doc.understanding, 8000),
      terms: str(doc.terms, 6000),
    },
    validDays: Number.isFinite(valid) && valid > 0 ? Math.min(valid, 365) : 30,
  };
}

/** Which development tab a service's projects show on. */
export const serviceTab = (service: string) =>
  service === "marketing" ? "marketing" : service === "ai" ? "ai" : "software";
