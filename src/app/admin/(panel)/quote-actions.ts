"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientProjects, quoteDefaults, quotations } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/access";
import { PROJECT_SERVICES, PROJECT_STATUSES, rupees } from "@/lib/business";
import {
  QUOTE_STATUSES,
  cleanBody,
  newId,
  type QuoteBody,
  type QuoteLine,
  freshBody,
  quoteTotals,
} from "@/lib/quotes";
import { getQuoteDefaults, getQuoteTemplate } from "@/lib/quotes-data";
import { cleanCosts } from "@/lib/third-party-costs";
import { cleanTemplate } from "@/lib/quote-template";

/**
 * Quotations: start one, save it, delete it, keep the starting rows, and
 * turn an accepted quote into projects on the service tabs. Every action
 * checks for an admin first; a server action is a public endpoint.
 */

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

const done = (id?: string) => {
  revalidatePath("/admin/quotes");
  if (id) revalidatePath(`/admin/quotes/${id}`);
};

/** NA-Q-2026-007: the year, then one more than the year's highest. */
async function nextNumber() {
  const year = new Date().getFullYear();
  const prefix = `NA-Q-${year}-`;
  const rows = await db
    .select({ number: quotations.number })
    .from(quotations)
    .where(like(quotations.number, `${prefix}%`));
  const highest = rows.reduce(
    (n, r) => Math.max(n, Number(r.number.slice(prefix.length)) || 0),
    0,
  );
  return prefix + String(highest + 1).padStart(3, "0");
}

export async function createQuote(form: FormData) {
  await requireAdmin();
  const company = text(form, "company");
  if (!company) throw new Error("A quote needs the company's name.");

  const [{ body: base }, { template }] = await Promise.all([
    getQuoteDefaults(),
    getQuoteTemplate(),
  ]);
  // Rows and prices from Standard prices, wording from the template.
  const body = freshBody({
    ...base,
    doc: { ...template.doc, understanding: "" },
    validDays: template.validDays,
  });
  const t = quoteTotals(body);
  const [row] = await db
    .insert(quotations)
    .values({
      number: await nextNumber(),
      title: text(form, "title").slice(0, 200),
      company: company.slice(0, 200),
      contactName: text(form, "contact_name").slice(0, 120) || null,
      phone: text(form, "phone").slice(0, 40) || null,
      email: text(form, "email").slice(0, 200) || null,
      body,
      onceTotal: String(t.onceTotal),
      monthlyTotal: String(t.monthlyTotal),
    })
    .returning({ id: quotations.id });
  done();
  redirect(`/admin/quotes/${row.id}`);
}

export type QuoteInput = {
  title: string;
  company: string;
  contactName: string;
  phone: string;
  email: string;
  status: string;
  quoteDate: string;
  body: unknown;
};

export async function saveQuote(id: string, input: QuoteInput) {
  await requireAdmin();
  const company = input.company.trim();
  if (!company) throw new Error("A quote needs the company's name.");
  if (!QUOTE_STATUSES.some((s) => s.id === input.status)) {
    throw new Error(`Unknown status: ${input.status}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.quoteDate)) {
    throw new Error("The quote date is not a date.");
  }
  const body = cleanBody(input.body);
  await addToStandards(body);
  const t = quoteTotals(body);

  await db
    .update(quotations)
    .set({
      title: input.title.trim().slice(0, 200),
      company: company.slice(0, 200),
      contactName: input.contactName.trim().slice(0, 120) || null,
      phone: input.phone.trim().slice(0, 40) || null,
      email: input.email.trim().slice(0, 200) || null,
      status: input.status,
      quoteDate: input.quoteDate,
      body,
      onceTotal: String(t.onceTotal),
      monthlyTotal: String(t.monthlyTotal),
      updatedAt: new Date(),
    })
    .where(eq(quotations.id, id));
  done(id);
  return body;
}

/**
 * Rows ticked "Add to Standard prices" in a quote go onto the standard list
 * with their name, description, section, group and price, or update the
 * item of the same name there. The quote row is then linked to it.
 */
async function addToStandards(body: QuoteBody) {
  const adding = body.lines.filter((l) => l.toStandard && l.name.trim());
  for (const l of body.lines) delete l.toStandard;
  if (adding.length === 0) return;

  const { body: base } = await getQuoteDefaults();
  const standards = [...base.lines];
  for (const l of adding) {
    const name = l.name.trim().toLowerCase();
    const at = standards.findIndex(
      (s) => (l.ref && s.ref === l.ref) || s.name.trim().toLowerCase() === name,
    );
    const taken = new Set(standards.map((s) => s.ref));
    let ref = at >= 0 ? standards[at].ref : null;
    if (!ref) {
      ref = `custom-${slug(l.name) || "row"}`;
      while (taken.has(ref)) ref += "-2";
    }
    const row: QuoteLine = {
      ...(at >= 0 ? standards[at] : {}),
      id: at >= 0 ? standards[at].id : newId(),
      on: false,
      section: l.section,
      groupName: l.groupName,
      groupId: l.groupName ? `g-${slug(l.groupName)}` : null,
      name: l.name.trim(),
      service: l.service,
      description: l.description,
      price: l.price,
      billing: l.billing,
      discount: { mode: "none", value: 0 },
      ref,
      rates: {
        ...(at >= 0 ? standards[at].rates : {}),
        [l.billing]: l.price,
      },
    };
    if (at >= 0) standards[at] = row;
    else standards.push(row);
    l.ref = ref;
  }
  const saved = {
    ...base,
    lines: standards,
    doc: { ...base.doc, understanding: "" },
  };
  await db
    .insert(quoteDefaults)
    .values({ id: "default", body: saved })
    .onConflictDoUpdate({
      target: quoteDefaults.id,
      set: { body: saved, updatedAt: new Date() },
    });
  revalidatePath("/admin/quotes/prices");
}

export async function deleteQuote(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing quote.");
  // The projects made from it stay: they are real work by then.
  await db.delete(quotations).where(eq(quotations.id, id));
  done();
  redirect("/admin/quotes");
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The Standard prices page: the rows every new quote starts with, and the
 * price a row takes when it is ticked. The quote wording is kept as it is.
 */
export async function saveStandardPrices(input: unknown) {
  await requireAdmin();
  const { body: base } = await getQuoteDefaults();
  const { lines } = cleanBody({ lines: input });
  const used = new Set<string>();
  for (const line of lines) {
    if (!line.name.trim()) throw new Error("Every row needs a name.");
    let ref = line.ref || `custom-${slug(line.name) || "row"}`;
    while (used.has(ref)) ref += "-2";
    used.add(ref);
    line.ref = ref;
    line.groupId = line.groupName ? `g-${slug(line.groupName)}` : null;
    line.discount = { mode: "none", value: 0 };
  }
  const body = {
    ...base,
    lines,
    doc: { ...base.doc, understanding: "" },
  };
  await db
    .insert(quoteDefaults)
    .values({ id: "default", body })
    .onConflictDoUpdate({
      target: quoteDefaults.id,
      set: { body, updatedAt: new Date() },
    });
  revalidatePath("/admin/quotes", "layout");
}

/** Back to the built-in list and prices. */
export async function resetStandardPrices() {
  await requireAdmin();
  await db.delete(quoteDefaults).where(eq(quoteDefaults.id, "default"));
  revalidatePath("/admin/quotes", "layout");
}

export type ProjectFromQuote = {
  service: string;
  title: string;
  once: number;
  monthly: number;
  yearly?: number;
};

/**
 * One project per service on the quote, on that service's tab, with the
 * one-time amount as its value and the monthly charge in the note.
 */
export async function addQuoteProjects(
  id: string,
  status: string,
  entries: ProjectFromQuote[],
) {
  await requireAdmin();
  if (!PROJECT_STATUSES.some((s) => s.id === status)) {
    throw new Error(`Unknown status: ${status}`);
  }
  if (entries.length === 0) throw new Error("Pick at least one service.");
  const [quote] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, id));
  if (!quote) throw new Error("That quote no longer exists.");

  const rows = entries.map((e) => {
    if (!PROJECT_SERVICES.some((s) => s.id === e.service)) {
      throw new Error(`Unknown service: ${e.service}`);
    }
    const once = Math.max(0, Math.round(Number(e.once) || 0));
    const monthly = Math.max(0, Math.round(Number(e.monthly) || 0));
    const yearly = Math.max(0, Math.round(Number(e.yearly) || 0));
    const note = [
      `From quotation ${quote.number}.`,
      monthly ? `Monthly charges: ${rupees.format(monthly)} a month.` : "",
      yearly ? `Yearly charges: ${rupees.format(yearly)} a year.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return {
      service: e.service,
      client: quote.company,
      title: (e.title.trim() || quote.title || quote.company).slice(0, 200),
      status,
      value: once ? String(once) : null,
      note,
    };
  });

  const made = await db
    .insert(clientProjects)
    .values(rows)
    .returning({ id: clientProjects.id });
  const before = Array.isArray(quote.projectIds) ? quote.projectIds : [];
  await db
    .update(quotations)
    .set({ projectIds: [...before, ...made.map((m) => m.id)] })
    .where(eq(quotations.id, id));
  revalidatePath("/admin", "layout");
}

/** The Template tab: sections, headings and the wording quotes start with. */
export async function saveQuoteTemplate(input: unknown) {
  await requireAdmin();
  const body = cleanTemplate(input);
  await db
    .insert(quoteDefaults)
    .values({ id: "template", body })
    .onConflictDoUpdate({
      target: quoteDefaults.id,
      set: { body, updatedAt: new Date() },
    });
  revalidatePath("/admin/quotes", "layout");
}

/** Back to the built-in template. */
export async function resetQuoteTemplate() {
  await requireAdmin();
  await db.delete(quoteDefaults).where(eq(quoteDefaults.id, "template"));
  revalidatePath("/admin/quotes", "layout");
}

/** The Third-party costs tab. */
export async function saveThirdPartyCosts(input: unknown) {
  await requireAdmin();
  const body = cleanCosts(input);
  await db
    .insert(quoteDefaults)
    .values({ id: "costs", body })
    .onConflictDoUpdate({
      target: quoteDefaults.id,
      set: { body, updatedAt: new Date() },
    });
  revalidatePath("/admin/quotes/costs");
}

export async function resetThirdPartyCosts() {
  await requireAdmin();
  await db.delete(quoteDefaults).where(eq(quoteDefaults.id, "costs"));
  revalidatePath("/admin/quotes/costs");
}
