/**
 * Work items, sprints and quarters, for the Tasks and Timeline tabs.
 *
 * Client-safe: plain values and date arithmetic, no database. Dates are
 * ISO day strings (2026-10-06) throughout, in India time, because "due
 * today" has to mean the day it is in the office, not in UTC.
 *
 * Quarters follow the Indian financial year (April to March), the year the
 * accounts and GST returns run on: Q1 is April to June, Q3 is October to
 * December. Sprints are two weeks, numbered from the first day of the
 * quarter, so a quarter holds six or seven of them.
 */

export const WORK_STATUSES = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "In progress" },
  { id: "done", label: "Done" },
] as const;

export type WorkStatus = (typeof WORK_STATUSES)[number]["id"];

export const PRIORITIES = [
  { id: "high", label: "High" },
  { id: "normal", label: "Normal" },
  { id: "low", label: "Low" },
] as const;

export type Priority = (typeof PRIORITIES)[number]["id"];

export const SPRINT_DAYS = 14;

const DAY = 86_400_000;

/** Today in India, as 2026-10-06. */
export function todayIST(now = Date.now()) {
  return new Date(now + 5.5 * 3_600_000).toISOString().slice(0, 10);
}

const toTime = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const toIso = (time: number) => new Date(time).toISOString().slice(0, 10);

export const addDays = (iso: string, days: number) =>
  toIso(toTime(iso) + days * DAY);

/** Whole days from a to b: positive when b is later. */
export const daysBetween = (a: string, b: string) =>
  Math.round((toTime(b) - toTime(a)) / DAY);

export type Quarter = {
  /** 1 to 4, April to June being 1. */
  q: number;
  /** The year the financial year starts in: 2026 for FY 2026-27. */
  fy: number;
  start: string;
  end: string;
  label: string;
  short: string;
};

export function quarterOf(iso: string): Quarter {
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7));
  const fy = month >= 4 ? year : year - 1;
  const q = month >= 4 ? Math.floor((month - 4) / 3) + 1 : 4;
  const startMonth = ((q - 1) * 3 + 3) % 12; // 0-based: 3 is April
  const startYear = q === 4 ? fy + 1 : fy;
  const start = toIso(Date.UTC(startYear, startMonth, 1));
  const end = toIso(Date.UTC(startYear, startMonth + 3, 1) - DAY);
  const fyLabel = `${fy}-${String((fy + 1) % 100).padStart(2, "0")}`;
  return {
    q,
    fy,
    start,
    end,
    label: `Q${q} FY ${fyLabel}`,
    short: `Q${q}`,
  };
}

export type Sprint = {
  n: number;
  /** How many sprints this quarter holds. */
  of: number;
  start: string;
  end: string;
  quarter: Quarter;
  label: string;
};

export function sprintOf(iso: string): Sprint {
  const quarter = quarterOf(iso);
  const length = daysBetween(quarter.start, quarter.end) + 1;
  const of = Math.ceil(length / SPRINT_DAYS);
  const n = Math.floor(daysBetween(quarter.start, iso) / SPRINT_DAYS) + 1;
  const start = addDays(quarter.start, (n - 1) * SPRINT_DAYS);
  const end = n === of ? quarter.end : addDays(start, SPRINT_DAYS - 1);
  return {
    n,
    of,
    start,
    end,
    quarter,
    label: `Sprint ${n} of ${quarter.short}`,
  };
}

/** The sprint after this one, crossing into the next quarter if need be. */
export const nextSprint = (s: Sprint) => sprintOf(addDays(s.end, 1));

/** 6 Oct, or 6 Oct 2025 when it is not this year. */
export function shortDay(iso: string, today = todayIST()) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(iso.slice(0, 4) === today.slice(0, 4) ? {} : { year: "numeric" }),
    timeZone: "UTC",
  });
}

export type DueState = "done" | "overdue" | "today" | "soon" | "later" | "none";

/** Where an item stands against its due date. */
export function dueState(
  item: { status: string; dueOn: string | null },
  today = todayIST(),
): DueState {
  if (item.status === "done") return "done";
  if (!item.dueOn) return "none";
  const days = daysBetween(today, item.dueOn);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 3) return "soon";
  return "later";
}

/** "Overdue by 2 days", "Due today", "Due in 3 days", "Due 14 Oct". */
export function dueText(
  item: { status: string; dueOn: string | null },
  today = todayIST(),
) {
  if (!item.dueOn) return "No due date";
  const days = daysBetween(today, item.dueOn);
  if (item.status === "done") return `Was due ${shortDay(item.dueOn, today)}`;
  if (days < 0) return `Overdue by ${-days} day${days === -1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 6) return `Due in ${days} days`;
  return `Due ${shortDay(item.dueOn, today)}`;
}

export const isStatus = (v: string): v is WorkStatus =>
  WORK_STATUSES.some((s) => s.id === v);

export const isPriority = (v: string): v is Priority =>
  PRIORITIES.some((p) => p.id === v);
