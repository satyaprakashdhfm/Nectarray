/**
 * The working file for a client project: status notes, deployment links and
 * the three handover sheets. Shared by the page (client) and the actions
 * and Excel download (server).
 */

export type LinkRow = { id: string; label: string; url: string };
export type PaidRow = {
  id: string;
  item: string;
  vendor: string;
  amount: number;
  date: string;
  note: string;
};
export type RecurringRow = {
  id: string;
  item: string;
  vendor: string;
  amount: number;
  billing: Frequency;
  renews: string;
  note: string;
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

export type ProjectSheets = {
  statusNote: string;
  links: LinkRow[];
  paid: PaidRow[];
  recurring: RecurringRow[];
  access: AccessRow[];
};

export const EMPTY_SHEETS: ProjectSheets = {
  statusNote: "",
  links: [],
  paid: [],
  recurring: [],
  access: [],
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
});

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
        url: /^https?:\/\//.test(url) ? url : url ? `https://${url}` : "",
      };
    }),
    paid: rows(x.paid).map((r, i) => {
      const o = obj(r);
      return {
        id: id(o.id, i),
        item: str(o.item, 160),
        vendor: str(o.vendor, 120),
        amount: money(o.amount),
        date: day(o.date),
        note: str(o.note, 500),
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
  };
}
