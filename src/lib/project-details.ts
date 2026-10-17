/**
 * The working file for a client project: status notes, deployment links,
 * its environment variables, its notes and the three handover sheets. Shared by the page (client) and the actions
 * and Excel download (server).
 */

export type LinkRow = { id: string; label: string; url: string };
export type PaidRow = {
  id: string;
  item: string;
  vendor: string;
  amount: number;
  /** The month whose bill it goes on, as "2026-10". */
  month: string;
  note: string;
  /** The receipt or invoice kept with it (project_files), or "" for none. */
  fileId: string;
  fileName: string;
  /**
   * Who paid it: "" when the company paid from its own account, otherwise
   * the person who paid out of pocket. For us only; never on the Excel files.
   */
  paidBy: string;
  /** For a payment a person made: whether the company has paid them back. */
  repaid: boolean;
};
export type RecurringRow = {
  id: string;
  item: string;
  vendor: string;
  amount: number;
  billing: Frequency;
  renews: string;
  note: string;
  /**
   * Where its billing and usage are, for us to open (the browser is already
   * signed in). Kept off the Excel files.
   */
  link: string;
};
/** How often a service is paid for. */
export type Frequency = "monthly" | "yearly" | "on_demand" | "once";

export const FREQUENCIES: { id: Frequency; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "on_demand", label: "On demand" },
  { id: "once", label: "One-time" },
];

export const frequencyLabel = (id: string) =>
  FREQUENCIES.find((f) => f.id === id)?.label ?? id;

export type AccessRow = {
  id: string;
  service: string;
  url: string;
  username: string;
  password: string;
  note: string;
};

/** A note kept with a project: a title and its formatted text. */
export type NoteRow = {
  id: string;
  title: string;
  /** The text as the editor writes it: headings, lists, links, tables. */
  html: string;
  /** When it was last changed, as an ISO time; "" if never. */
  updated: string;
};

export type ProjectSheets = {
  statusNote: string;
  links: LinkRow[];
  paid: PaidRow[];
  recurring: RecurringRow[];
  access: AccessRow[];
  /** The project's .env file as typed, one KEY=value a line. */
  env: string;
  /** Months whose bill is done; they fold up above the open month. */
  closedMonths: string[];
  /** Notes, newest first. */
  notes: NoteRow[];
};

export const EMPTY_SHEETS: ProjectSheets = {
  statusNote: "",
  links: [],
  paid: [],
  recurring: [],
  access: [],
  env: "",
  closedMonths: [],
  notes: [],
};

const svc = (
  i: number,
  item: string,
  billing: Frequency,
  amount: number,
  note: string,
): RecurringRow => ({
  id: `s${i}`,
  item,
  vendor: "",
  amount,
  billing,
  renews: "",
  note,
  link: "",
});

/**
 * The dashboard page of the platforms a build usually runs on, matched on
 * the platform's name. Fills a row's link when none was typed.
 */
const DASHBOARDS: [RegExp, string][] = [
  [/railway/i, "https://railway.com/dashboard"],
  [/cloudflare/i, "https://dash.cloudflare.com/?to=/:account/billing"],
  [/ola\s*maps|krutrim/i, "https://cloud.olakrutrim.com/"],
  [/godaddy/i, "https://account.godaddy.com/products"],
  [/message\s*central/i, "https://console.messagecentral.com/"],
  [/google/i, "https://console.cloud.google.com/billing"],
  [/shiprocket/i, "https://app.shiprocket.in/"],
  [/delhivery/i, "https://one.delhivery.com/"],
  [/razorpay/i, "https://dashboard.razorpay.com/"],
  [/vercel/i, "https://vercel.com/dashboard"],
  [/supabase/i, "https://supabase.com/dashboard"],
];

export const dashboardFor = (platform: string) =>
  DASHBOARDS.find(([name]) => name.test(platform))?.[1] ?? "";

/**
 * What a project's handover sheet starts with before anything is saved:
 * the services a typical build runs on and what they charge, and a login
 * row for each. Change or delete whatever does not apply.
 */
export const STARTER_SHEETS: ProjectSheets = {
  ...EMPTY_SHEETS,
  recurring: [
    svc(1, "Railway", "monthly", 1911, "Cloud charges for hosting the website"),
    svc(
      2,
      "Cloudflare",
      "on_demand",
      0,
      "Free up to 10 GB, then charged on storage (₹1.43 per GB a month)",
    ),
    svc(
      3,
      "Ola Maps",
      "on_demand",
      0,
      "Free up to 50,000 requests, then charged per request (₹0.254 a request)",
    ),
    svc(4, "Domain (GoDaddy)", "yearly", 1600, "Domain renewal"),
    svc(
      5,
      "Message Central",
      "on_demand",
      0,
      "Charged per login OTP from a prepaid wallet; top up when low",
    ),
    svc(
      6,
      "Google sign-in",
      "on_demand",
      0,
      "Free up to 50,000 monthly active users, then ₹0.5 per active user",
    ),
    svc(
      7,
      "Shiprocket",
      "on_demand",
      0,
      "Handed over to the client, who maintains it",
    ),
    svc(
      8,
      "Delhivery",
      "on_demand",
      0,
      "Handed over to the client, who maintains it",
    ),
    svc(
      9,
      "Razorpay",
      "on_demand",
      0,
      "2% per transaction + 18% GST (2.36% in all). Settlement in 2 working days (T+2)",
    ),
  ],
  access: [
    "Admin portal",
    "Railway",
    "Cloudflare",
    "GoDaddy",
    "Razorpay",
    "Message Central",
    "Google Cloud",
  ].map((service, i) => ({
    id: `a${i + 1}`,
    service,
    url: "",
    username: "",
    password: "",
    note: "",
  })),
};

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : "";
const money = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.round(n), 1e10) : 0;
};
const day = (v: unknown) => {
  const s = str(v, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
};
const rows = (v: unknown) => (Array.isArray(v) ? v.slice(0, 200) : []);
const obj = (v: unknown) => (v ?? {}) as Record<string, unknown>;
const id = (v: unknown, i: number) => str(v, 64) || `r${i}`;
/** An address typed without its scheme gets https://. */
const web = (v: string) => {
  const url = v.trim();
  return /^https?:\/\//.test(url) ? url : url ? `https://${url}` : "";
};
const file = (o: Record<string, unknown>) => {
  const fileId = str(o.fileId, 36);
  return isFileId(fileId)
    ? { fileId, fileName: str(o.fileName, 160) }
    : { fileId: "", fileName: "" };
};

/** A stored document's id. */
export const isFileId = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** Anything the page sends, made safe to store. */
export function cleanSheets(input: unknown): ProjectSheets {
  const x = obj(input);
  return {
    statusNote: str(x.statusNote, 8000),
    links: rows(x.links).map((r, i) => {
      const o = obj(r);
      const url = str(o.url, 500).trim();
      return {
        id: id(o.id, i),
        label: str(o.label, 120),
        url: web(url),
      };
    }),
    paid: rows(x.paid).map((r, i) => {
      const o = obj(r);
      return {
        id: id(o.id, i),
        item: str(o.item, 160),
        vendor: str(o.vendor, 120),
        amount: money(o.amount),
        // Rows saved before months had a date; theirs gives the month.
        month: isMonth(str(o.month, 7))
          ? str(o.month, 7)
          : day(o.date).slice(0, 7),
        note: str(o.note, 500),
        ...file(o),
        paidBy: isCompany(str(o.paidBy, 80)) ? "" : str(o.paidBy, 80).trim(),
        repaid: o.repaid === true,
      };
    }),
    recurring: rows(x.recurring).map((r, i) => {
      const o = obj(r);
      return {
        id: id(o.id, i),
        item: str(o.item, 160),
        vendor: str(o.vendor, 120),
        amount: money(o.amount),
        billing: FREQUENCIES.some((f) => f.id === o.billing)
          ? (o.billing as Frequency)
          : "monthly",
        renews: day(o.renews),
        note: str(o.note, 500),
        link: web(str(o.link, 500)),
      };
    }),
    access: rows(x.access).map((r, i) => {
      const o = obj(r);
      return {
        id: id(o.id, i),
        service: str(o.service, 160),
        url: str(o.url, 500),
        username: str(o.username, 200),
        password: str(o.password, 500),
        note: str(o.note, 500),
      };
    }),
    env: str(x.env, 20000).replace(/\r\n?/g, "\n"),
    closedMonths: [
      ...new Set(
        rows(x.closedMonths)
          .map((m) => str(m, 7))
          .filter(isMonth),
      ),
    ].sort(),
    notes: rows(x.notes).map((r, i) => {
      const o = obj(r);
      const updated = str(o.updated, 40);
      return {
        id: id(o.id, i),
        title: str(o.title, 200),
        html: str(o.html, 400_000),
        updated: Number.isNaN(Date.parse(updated)) ? "" : updated,
      };
    }),
  };
}

/**
 * The stored documents a project's notes show or link to: pictures put in
 * a note, and files attached to one. Kept when unused files are removed.
 */
export function noteFileIds(notes: NoteRow[]): string[] {
  return notes.flatMap((n) =>
    [...n.html.matchAll(/\/files\/([0-9a-f-]{36})/gi)]
      .map((m) => m[1])
      .filter(isFileId),
  );
}

/** The names set in a .env file, in order: comments and blank lines skipped. */
export function envKeys(env: string): string[] {
  return env
    .split("\n")
    .map((line) => /^\s*(?:export\s+)?([A-Za-z_][\w.-]*)\s*=/.exec(line)?.[1])
    .filter((key): key is string => Boolean(key));
}

/* The monthly bill: every payment is put on a month's bill by hand. */

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** A month written as "2026-10". */
export const isMonth = (v: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(v);

/** "2026-10" as "October 2026". */
export function monthLabel(month: string): string {
  const [year, m] = month.split("-");
  return `${MONTH_NAMES[Number(m) - 1] ?? m} ${year}`;
}

/** This month in India, as "2026-10". */
export const currentMonth = (at = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).format(at);

/** "2026-12" moved by n months: 1 gives "2027-01", -1 gives "2026-11". */
export function addMonths(month: string, n: number): string {
  const [year, m] = month.split("-").map(Number);
  const index = year * 12 + (m - 1) + n;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

/** The payments on a month's bill, in the order they were added. */
export function paidInMonth(rows: PaidRow[], month: string): PaidRow[] {
  return rows.filter((r) => r.month === month);
}

/** Whether "Paid by" means the company itself: left blank or typed as such. */
export const isCompany = (paidBy: string) => /^\s*(company)?\s*$/i.test(paidBy);

/**
 * What the company still has to pay back, person by person: the payments
 * people made themselves that are not yet marked paid back. Most owed first.
 */
export function owedByCompany(
  rows: PaidRow[],
): { name: string; count: number; total: number }[] {
  const people = new Map<
    string,
    { name: string; count: number; total: number }
  >();
  for (const r of rows) {
    if (isCompany(r.paidBy) || r.repaid) continue;
    const name = r.paidBy.trim();
    // "Ravi" and "ravi " are the same person.
    const key = name.toLowerCase();
    const p = people.get(key) ?? { name, count: 0, total: 0 };
    people.set(key, { ...p, count: p.count + 1, total: p.total + r.amount });
  }
  return [...people.values()].sort((a, b) => b.total - a.total);
}

/** Every month with a payment on it, newest first, and what it came to. */
export function monthlyTotals(
  rows: PaidRow[],
): { month: string; count: number; total: number }[] {
  const months = new Map<string, { count: number; total: number }>();
  for (const r of rows) {
    if (!r.month) continue;
    const month = r.month;
    const m = months.get(month) ?? { count: 0, total: 0 };
    months.set(month, { count: m.count + 1, total: m.total + r.amount });
  }
  return [...months]
    .map(([month, m]) => ({ month, ...m }))
    .sort((a, b) => b.month.localeCompare(a.month));
}

/**
 * What the fixed charges come to a month: the monthly ones plus a twelfth
 * of the yearly ones. On-demand and one-time charges are left out; they
 * show up as payments in the month they are paid.
 */
export function fixedMonthlyCost(rows: RecurringRow[]) {
  const sum = (billing: Frequency) =>
    rows.filter((r) => r.billing === billing).reduce((n, r) => n + r.amount, 0);
  const monthly = sum("monthly");
  const yearly = sum("yearly");
  return { monthly, yearly, perMonth: Math.round(monthly + yearly / 12) };
}
