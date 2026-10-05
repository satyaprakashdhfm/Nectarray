import { PROJECT_SERVICES } from "@/lib/business";

/**
 * Quotations: the rows a quote is made of, the sums, and the rows a new
 * quote starts with. Shared by the builder (client) and the actions
 * (server), so nothing here touches the database.
 */

export type QuoteService = (typeof PROJECT_SERVICES)[number]["id"];
export type Billing = "once" | "monthly" | "yearly";
/** A standard price for each way an item can be billed. */
export type Rates = Partial<Record<Billing, number>>;

export const BILLINGS: {
  id: Billing;
  label: string;
  /** After a price on a row: /mo, /yr. */
  short: string;
  /** After a total: a month, a year. */
  per: string;
}[] = [
  { id: "once", label: "One-time", short: "", per: "" },
  { id: "monthly", label: "Monthly", short: "/mo", per: "a month" },
  { id: "yearly", label: "Yearly", short: "/yr", per: "a year" },
];

export const billingOf = (id: Billing) =>
  BILLINGS.find((b) => b.id === id) ?? BILLINGS[0];
export type DiscountMode = "none" | "percent" | "amount";
export type Discount = { mode: DiscountMode; value: number };
/** A section id from the template: build, marketing, knowledge-transfer. */
export type QuoteSection = string;

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
  /** On the Standard prices list only: the price for each billing. */
  rates?: Rates;
  /** Ticked on a new row: add it to Standard prices when the quote is saved. */
  toStandard?: boolean;
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
    lede: "Search, blogs and ads: a one-time set-up, or run for you every month.",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    lede: "Keeping everything running after launch, monthly or yearly.",
  },
  {
    id: "handover",
    label: "Knowledge transfer",
    lede: "Handing over the code and teaching your team to run it.",
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
  const yearlyTotal = on
    .filter((l) => l.billing === "yearly")
    .reduce((n, l) => n + lineTotal(l), 0);
  return {
    onceList,
    onceSubtotal,
    overall,
    onceTotal,
    monthlyTotal,
    yearlyTotal,
    /** Everything taken off the one-time list price. */
    onceSaved: onceList - onceTotal,
    count: on.length,
  };
}

/**
 * What each service is worth in this quote, for adding it to that service's
 * tab: one-time rows after their own discount, less a fair share of the
 * overall discount, and the monthly and yearly rows on their own.
 */
export function totalsByService(body: QuoteBody) {
  const t = quoteTotals(body);
  const share = t.onceSubtotal > 0 ? t.onceTotal / t.onceSubtotal : 1;
  const out = new Map<
    QuoteService,
    { once: number; monthly: number; yearly: number }
  >();
  for (const line of body.lines) {
    if (!line.on) continue;
    const row = out.get(line.service) ?? { once: 0, monthly: 0, yearly: 0 };
    if (line.billing === "once") row.once += lineTotal(line) * share;
    else row[line.billing] += lineTotal(line);
    out.set(line.service, row);
  }
  return [...out].map(([service, v]) => ({
    service,
    once: Math.round(v.once),
    monthly: Math.round(v.monthly),
    yearly: Math.round(v.yearly),
  }));
}

// The standard items, and what a new quote starts with ----------------------

export type CatalogueItem = {
  ref: string;
  section: QuoteSection;
  name: string;
  description: string;
  /** Our standard prices, in rupees: one-time, a month, a year. */
  rates: Rates;
  /** How it is billed when first ticked. */
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
    rates: { once: 15000 },
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
    rates: { once: 20000 },
    billing: "once",
    service: "software",
    image: "/samples/dash-b.webp",
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
    rates: { once: 8000 },
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
    rates: { once: 15000 },
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
    rates: { once: 15000 },
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
    rates: { once: 15000 },
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
    rates: { once: 5000 },
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
    rates: { once: 12000 },
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
    rates: { once: 10000 },
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
    rates: { once: 25000 },
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
    rates: { once: 80000 },
    billing: "once",
    service: "software",
    image: "/samples/mobile-b.webp",
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
      "One-time: a full SEO set-up of the website. Monthly: keyword research, page fixes and new blog articles every month to move the website up in Google search.",
    rates: { once: 12000, monthly: 10000, yearly: 100000 },
    billing: "monthly",
    service: "marketing",
    image: "/marketing/ads-google-seo.webp",
    includes: [
      "One-time: titles, descriptions, sitemap, Search Console and Google Business Profile set up",
      "Monthly: keyword research for your area and services",
      "Monthly: 4 blog articles",
      "Monthly: page speed and on-page fixes",
      "Monthly: report of rankings and visitors",
    ],
  },
  {
    ref: "meta-ads",
    section: "marketing",
    name: "Meta ads",
    description:
      "We set up your Meta Business account, Facebook page and ad account, and run the ads. Your team or a content creator gives us the photos and videos; we turn them into ads. Ad spend is paid separately.",
    rates: { once: 6000, monthly: 8000, yearly: 80000 },
    billing: "monthly",
    service: "marketing",
    image: "/marketing/ads-meta.webp",
    includes: [
      "One-time: Meta Business account, Facebook page, Instagram link, ad account and pixel set up, with the first campaign",
      "Monthly: we run the ads, choose the audience and tune them every week",
      "Content (photos, videos, offers) comes from your team or a content creator",
      "Leads sent to WhatsApp or the website",
      "Monthly report of spend, leads and cost per lead",
      "Ad spend is paid to Meta directly",
    ],
  },
  {
    ref: "google-ads",
    section: "marketing",
    name: "Google ads",
    description:
      "We set up your Google Ads account with search and display campaigns, and run them. Someone on your side answers the calls and enquiries they bring. Ad spend is paid separately.",
    rates: { once: 6000, monthly: 8000, yearly: 80000 },
    billing: "monthly",
    service: "marketing",
    image: "/marketing/ads-google.webp",
    includes: [
      "One-time: Google Ads account, conversion tracking, keywords and the first campaign",
      "Monthly: we run the campaigns and tune keywords and bids every week",
      "Someone on your side answers the calls and enquiries",
      "Monthly report of cost per enquiry",
      "Ad spend is paid to Google directly",
    ],
  },
  {
    ref: "maintenance",
    section: "maintenance",
    name: "Maintenance",
    description:
      "Looking after every service in use: cloud hosting, APIs, email and the like. The cost depends on the services taken.",
    rates: { monthly: 3000, yearly: 30000 },
    billing: "monthly",
    service: "software",
    image: "/hero/software-hero.jpg",
    includes: [
      "Cloud hosting and database kept running and backed up",
      "APIs and integrations checked and kept working",
      "Business email and notifications kept working",
      "Security updates and bug fixes",
      "The price depends on the services taken; cloud and provider bills are separate",
    ],
  },
  {
    ref: "support-person",
    section: "maintenance",
    name: "Dedicated support person",
    description:
      "One named person for day-to-day updates, content uploads and questions.",
    rates: { monthly: 15000, yearly: 150000 },
    billing: "monthly",
    service: "software",
    image: "/agentic/domains/support.webp",
    includes: [
      "One named person on WhatsApp and phone",
      "Uploads content, photos and offers for you",
      "Replies within working hours, Monday to Saturday",
    ],
  },
  {
    ref: "code-handover",
    section: "handover",
    name: "Complete code handover",
    description:
      "The full source code, database and accounts handed over to you, with the documentation to run it.",
    rates: { once: 10000 },
    billing: "once",
    service: "software",
    image: "/hero/software-hero.jpg",
    includes: [
      "Full source code in your own GitHub account",
      "Database, hosting, domain and email accounts moved into your name",
      "Every password and API key handed over safely",
      "Written guide to run, update and deploy the project",
    ],
  },
  {
    ref: "kt-sessions",
    section: "handover",
    name: "KT sessions",
    description:
      "Knowledge transfer sessions where we walk your team through the code, the admin portal and how to run everything.",
    rates: { once: 9000 },
    billing: "once",
    service: "software",
    image: "/agentic/domains/people.webp",
    includes: [
      "3 live sessions of about 2 hours each, recorded for later",
      "How the code is organised and how to make changes",
      "How to use the admin portal day to day",
      "How to deploy, back up and fix common problems",
    ],
  },
  {
    ref: "academy-training",
    section: "handover",
    name: "Team training at NectArray Academy",
    description:
      "Our academy teaches your team the skills to run and grow the project themselves: the tools, data, marketing and AI behind it.",
    rates: { once: 15000 },
    billing: "once",
    service: "training",
    image: "/services/academy.webp",
    includes: [
      "Hands-on classes for your team at NectArray Academy",
      "The tools behind your project: web, data, marketing or AI",
      "Practice on your own project",
      "Questions answered during the course",
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

/**
 * The admin's standard row behind a quote row (from the Standard prices
 * page): by its ref, or else by its name.
 */
export function standardFor(
  line: Pick<QuoteLine, "ref" | "name">,
  standards: QuoteLine[],
) {
  if (line.ref) {
    const hit = standards.find((s) => s.ref === line.ref);
    if (hit) return hit;
  }
  const name = line.name.trim().toLowerCase();
  return name
    ? standards.find((s) => s.name.trim().toLowerCase() === name)
    : undefined;
}

/**
 * A quote brought up to date with the Standard prices list, each time it
 * is opened.
 *
 * Unticked rows take the list's name, description, section, service and
 * price, so a change saved there shows on every quote. Ticked rows are what
 * the client was quoted and keep their own words and price. Items added to
 * the list since appear unticked; items deleted from it go, unless ticked.
 * Rows typed into the quote by hand (not on the list) are left alone.
 */
export function syncWithStandards(
  body: QuoteBody,
  standards: QuoteLine[],
): QuoteBody {
  const used = new Set<QuoteLine>();
  const lines: QuoteLine[] = [];
  for (const l of body.lines) {
    const std = standardFor(l, standards);
    if (!std) {
      // Gone from the list: drop it unless it is in the quote.
      if (!l.on && l.ref && !l.ref.startsWith("custom-") && catalogueFor(l))
        continue;
      if (!l.on && l.ref?.startsWith("custom-")) continue;
      lines.push(l);
      continue;
    }
    used.add(std);
    if (l.on) {
      lines.push({ ...l, ref: std.ref });
      continue;
    }
    lines.push({
      ...l,
      ref: std.ref,
      name: std.name,
      description: std.description,
      section: std.section,
      service: std.service,
      groupName: std.groupName,
      groupId: std.groupName ? l.groupId : null,
      price: rateFor(std, l.billing) ?? rateFor(std, std.billing) ?? std.price,
      billing: rateFor(std, l.billing) ? l.billing : std.billing,
    });
  }

  // New on the list: put each after its group or at the end of its section.
  for (const std of standards) {
    if (used.has(std)) continue;
    const group = std.groupName
      ? lines.find(
          (l) => l.section === std.section && l.groupName === std.groupName,
        )
      : undefined;
    const row: QuoteLine = {
      ...std,
      id: newId(),
      on: false,
      groupId: std.groupName ? (group?.groupId ?? newId()) : null,
      discount: { mode: "none", value: 0 },
      rates: undefined,
    };
    const after = group
      ? lines.findLastIndex((l) => l.groupId === group.groupId)
      : lines.findLastIndex((l) => l.section === std.section);
    if (after === -1) lines.push(row);
    else lines.splice(after + 1, 0, row);
  }
  return { ...body, lines };
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
      price: c.rates[c.billing] ?? 0,
      billing: c.billing,
      discount: { mode: "none", value: 0 },
      ref: c.ref,
      rates: { ...c.rates },
    };
  });
}

/**
 * The standard price for a billing: the item's own rate for it, or its
 * single price when the list has only that one.
 */
export function rateFor(
  std: Pick<QuoteLine, "rates" | "billing" | "price"> | undefined,
  billing: Billing,
) {
  if (!std) return undefined;
  const rate = std.rates?.[billing];
  if (rate) return rate;
  return !std.rates && std.billing === billing && std.price
    ? std.price
    : undefined;
}

/**
 * A saved Standard prices list, brought up to date with the built-in one:
 * prices for billings it has none for, and sections added since it was
 * saved. Nothing the admin set is overwritten.
 */
export function withCatalogue(lines: QuoteLine[]): QuoteLine[] {
  const out = lines.map((l) => {
    const item = CATALOGUE.find((c) => c.ref === l.ref);
    const own: Rates = l.rates ?? (l.price ? { [l.billing]: l.price } : {});
    const rates = { ...(item?.rates ?? {}), ...own };
    return { ...l, rates, price: rates[l.billing] ?? l.price };
  });
  const sections = new Set(out.map((l) => l.section));
  const missing = defaultLines().filter((l) => !sections.has(l.section));
  return [...out, ...missing];
}

export const STANDARD_TERMS = [
  "Prices are based on our first conversation and may change with the final requirements.",
  "Prices are in Indian rupees.",
  "Monthly and yearly maintenance charges start from the day the project goes live.",
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

function cleanRates(v: unknown): Rates {
  const r = (v ?? {}) as Record<string, unknown>;
  const out: Rates = {};
  for (const b of BILLINGS) {
    const n = money(r[b.id]);
    if (n > 0) out[b.id] = n;
  }
  return out;
}

/** Anything the builder sends, made into a body that is safe to store. */
export function cleanBody(input: unknown): QuoteBody {
  const b = (input ?? {}) as Partial<QuoteBody>;
  const services = PROJECT_SERVICES.map((s) => s.id as string);
  const lines = (Array.isArray(b.lines) ? b.lines : [])
    .slice(0, 150)
    .map((raw): QuoteLine => {
      const l = (raw ?? {}) as Partial<QuoteLine>;
      const groupId = l.groupId ? str(l.groupId, 64) : null;
      return {
        id: str(l.id, 64) || newId(),
        on: Boolean(l.on),
        section:
          typeof l.section === "string" && /^[a-z0-9-]{1,40}$/.test(l.section)
            ? l.section
            : "build",
        groupId,
        groupName: groupId ? str(l.groupName, 120) : null,
        name: str(l.name, 160),
        service: services.includes(l.service as string)
          ? (l.service as QuoteService)
          : "software",
        description: str(l.description, 2000),
        price: money(l.price),
        billing:
          l.billing === "monthly" || l.billing === "yearly"
            ? l.billing
            : "once",
        discount: cleanDiscount(l.discount),
        ref: l.ref ? str(l.ref, 40) : null,
        ...(l.toStandard ? { toStandard: true } : {}),
        ...(l.rates ? { rates: cleanRates(l.rates) } : {}),
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
  service === "marketing" || service === "ai" || service === "training"
    ? service
    : "software";
