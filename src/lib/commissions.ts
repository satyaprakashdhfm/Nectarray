/**
 * Commission given to a person for bringing in work: on a project, a share
 * of what its client has paid for the development; on a student, a share of
 * their course fee. Kept with the project (project_details.commissions) or
 * the enrolment (enrolments.commissions).
 *
 * The revenue stays what came in; the commission is a cost, so it comes off
 * the profit, and off the company's money once it is paid.
 */
export type Commission = {
  id: string;
  /** Who gets it. */
  name: string;
  /** Their share, in percent of what we received. */
  percent: number;
  /** A fixed amount typed in instead; null works it out from the percent. */
  amount: number | null;
  /** The day it was paid to them; "" while it is still to pay. */
  paidOn: string;
};

const DAY = /^\d{4}-\d{2}-\d{2}$/;

const number = (value: unknown) => {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/** Whatever was stored or sent, as a clean list. */
export function cleanCommissions(input: unknown): Commission[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 20).flatMap((raw, i): Commission[] => {
    if (!raw || typeof raw !== "object") return [];
    const r = raw as Record<string, unknown>;
    const paidOn = String(r.paidOn ?? "");
    return [
      {
        id: String(r.id ?? "").slice(0, 40) || `c${i}`,
        name: String(r.name ?? "")
          .trim()
          .slice(0, 80),
        percent: Math.min(100, number(r.percent) ?? 0),
        amount: r.amount === null || r.amount === "" ? null : number(r.amount),
        paidOn: DAY.test(paidOn) ? paidOn : "",
      },
    ];
  });
}

/** What the commission comes to, out of `base` rupees received. */
export const commissionAmount = (c: Commission, base: number) =>
  c.amount ?? Math.round((base * c.percent) / 100);

/** Only the ones that name someone or come to something. */
export const realCommissions = (list: Commission[]) =>
  list.filter((c) => c.name || c.percent || c.amount);
