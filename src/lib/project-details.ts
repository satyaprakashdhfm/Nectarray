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
  billing: "monthly" | "yearly";
  renews: string;
  note: string;
};
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
        billing: o.billing === "yearly" ? "yearly" : "monthly",
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
