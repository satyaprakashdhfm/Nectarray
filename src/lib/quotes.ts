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

// What a new quote starts with ----------------------------------------------

const row = (
  section: QuoteSection,
  name: string,
  description: string,
  extra: Partial<QuoteLine> = {},
): QuoteLine => ({
  id: newId(),
  on: false,
  section,
  groupId: null,
  groupName: null,
  name,
  service: section === "marketing" ? "marketing" : "software",
  description,
  price: 0,
  billing: section === "build" ? "once" : "monthly",
  discount: { mode: "none", value: 0 },
  ...extra,
});

export function defaultLines(): QuoteLine[] {
  const articles = { groupId: newId(), groupName: "Articles" };
  const logins = { groupId: newId(), groupName: "Logins and dashboards" };
  return [
    row(
      "build",
      "Basic website",
      "A static website of 5 to 7 pages: home, about, services, gallery and contact. Works on phones and laptops.",
      { on: true },
    ),
    row(
      "build",
      "Admin portal",
      "An admin panel to change the website's text, images, prices and offers without a developer.",
    ),
    row(
      "build",
      "Articles uploaded by the admin",
      "The admin writes or uploads an article and it shows on the website straight away.",
      articles,
    ),
    row(
      "build",
      "AI-written articles",
      "AI drafts articles on your topics. You edit them and publish them to the website.",
      { ...articles, service: "ai" },
    ),
    row(
      "build",
      "Client login",
      "Customers sign in to see their orders, bookings or documents.",
      logins,
    ),
    row(
      "build",
      "Employee login",
      "Staff sign in to their own dashboard, with only the pages they need.",
      logins,
    ),
    row(
      "build",
      "Social media integration",
      "Instagram, Facebook, LinkedIn and YouTube linked to the site, with share buttons on pages.",
    ),
    row(
      "build",
      "Notifications",
      "Automatic email, WhatsApp and SMS messages for enquiries, orders and reminders. Message charges from the providers are extra.",
    ),
    row(
      "build",
      "Analytics dashboard",
      "How many people visit the website, where they come from, which pages they read and how many enquire.",
    ),
    row(
      "build",
      "Delivery integration",
      "Book deliveries through partners such as Rapido and Porter from the admin panel, with live status.",
    ),
    row(
      "build",
      "Mobile app",
      "Android and iPhone app with the same features as the website, published on the Play Store and App Store.",
    ),
    row(
      "marketing",
      "SEO and blog writing",
      "Keyword research, page fixes and new blog articles every month to move the website up in Google search.",
    ),
    row(
      "marketing",
      "Meta ads",
      "Facebook and Instagram ads: set-up, creatives and weekly tuning. Ad spend is paid separately.",
    ),
    row(
      "marketing",
      "Google ads",
      "Search and display ads: set-up, keywords and weekly tuning. Ad spend is paid separately.",
    ),
    row(
      "maintenance",
      "Maintenance",
      "Hosting checks, security updates, backups, bug fixes and small changes across all the services above.",
    ),
    row(
      "maintenance",
      "Dedicated support person",
      "One named person for day-to-day updates, content uploads and questions.",
    ),
  ];
}

export const DEFAULT_DOC: QuoteDoc = {
  intro:
    "Thank you for taking the time to talk to us. This quotation lists the services you asked about, what we understood from our first conversation, and the price for each.",
  understanding: "",
  terms: [
    "Prices are based on our first conversation and may change once the full requirements are agreed.",
    "Prices are in Indian rupees and do not include GST.",
    "Monthly charges start from the month the work goes live.",
    "Third-party costs such as ad spend, domain, hosting, SMS and WhatsApp message charges are paid separately.",
    "Payment terms will be agreed before work starts.",
  ].join("\n"),
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
