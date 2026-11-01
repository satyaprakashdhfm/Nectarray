"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ADMIN } from "@/lib/admin-path";
import { requireAdmin } from "@/lib/auth/access";
import { db } from "@/lib/db";
import { omniproofArticles } from "@/lib/db/schema";
import { FIELDS, OMNI_ARTICLES } from "@/lib/content/omniproof";
import { getOmni, type OmniStatus } from "@/lib/omniproof";
import { todayIST } from "@/lib/work";

/**
 * Writing and editing Omniproof pieces from the admin.
 *
 * Every action checks for an admin first: a server action is a public
 * endpoint whatever page imports it. A bundled piece (a file in the repo) is
 * copied into the table on its first save or status change, and from then on
 * the row is what the site shows.
 */

/** What the editor sends on each save. The slug and the status travel apart. */
export type OmniDraft = {
  title: string;
  description: string;
  date: string;
  field: string;
  subfield: string;
  short: string;
  body: string;
  coverSrc: string;
  coverAlt: string;
  sourceLabel: string;
  sourceHref: string;
  lands: { field: string; impact: string }[];
};

const STATUSES: OmniStatus[] = ["draft", "published", "archived"];

/** The public pages, the map and everything else that lists the pieces. */
function refresh(slug?: string) {
  revalidatePath("/omniproof");
  if (slug) revalidatePath(`/omniproof/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath(`${ADMIN}/omniproof`, "layout");
}

/** A link is a path on this site or an https address, nothing else. */
const safeHref = (href: string) =>
  !href || href.startsWith("/") || /^https:\/\//i.test(href);

function check(draft: OmniDraft): string | null {
  if (draft.title.trim().length < 5) return "Give the piece a title.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return "Pick a date.";
  const field = FIELDS.find((f) => f.id === draft.field);
  if (!field) return "Pick a field.";
  if (!field.subfields.some((s) => s.id === draft.subfield))
    return "Pick a subfield of that field.";
  if (!draft.short.trim()) return "Give it a short name for the map.";
  if (draft.body.length > 60_000) return "The body is too long.";
  if (!safeHref(draft.coverSrc.trim()) || !safeHref(draft.sourceHref.trim()))
    return "Links must be a path on this site or start with https://.";
  return null;
}

function values(draft: OmniDraft) {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    date: draft.date,
    field: draft.field,
    subfield: draft.subfield,
    short: draft.short.trim().slice(0, 40),
    body: draft.body,
    coverSrc: draft.coverSrc.trim() || null,
    coverAlt: draft.coverAlt.trim() || null,
    sourceLabel: draft.sourceLabel.trim(),
    sourceHref: draft.sourceHref.trim(),
    lands: draft.lands
      .filter(
        (l) =>
          l.impact.trim() &&
          l.field !== draft.field &&
          FIELDS.some((f) => f.id === l.field),
      )
      .map((l) => ({ field: l.field, impact: l.impact.trim() })),
    updatedAt: new Date(),
  };
}

/** Copies a bundled piece into the table, if it is not there yet. */
async function ensureRow(slug: string) {
  const entry = await getOmni(slug);
  if (!entry) throw new Error("No such piece.");
  if (entry.origin === "database") return entry;
  await db
    .insert(omniproofArticles)
    .values({
      slug,
      ...values({
        ...entry,
        coverSrc: entry.cover?.src ?? "",
        coverAlt: entry.cover?.alt ?? "",
        sourceLabel: entry.source.label,
        sourceHref: entry.source.href,
      }),
      status: "published",
    })
    .onConflictDoNothing();
  return entry;
}

/** Saved by itself while typing. */
export async function saveOmniPiece(
  slug: string,
  draft: OmniDraft,
): Promise<{ error?: string }> {
  await requireAdmin();
  const problem = check(draft);
  if (problem) return { error: problem };
  await ensureRow(slug);
  await db
    .update(omniproofArticles)
    .set(values(draft))
    .where(eq(omniproofArticles.slug, slug));
  refresh(slug);
  return {};
}

export async function setOmniStatus(
  slug: string,
  status: OmniStatus,
): Promise<{ error?: string }> {
  await requireAdmin();
  if (!STATUSES.includes(status)) return { error: "Unknown status." };
  await ensureRow(slug);
  await db
    .update(omniproofArticles)
    .set({ status, updatedAt: new Date() })
    .where(eq(omniproofArticles.slug, slug));
  refresh(slug);
  return {};
}

const slugOf = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** A new piece, as a draft, from a title and a field; opens it in the editor. */
export async function createOmniPiece(form: FormData) {
  await requireAdmin();
  const title = String(form.get("title") ?? "").trim();
  const field = FIELDS.find((f) => f.id === form.get("field")) ?? FIELDS[0];
  if (title.length < 5) throw new Error("Give the piece a title.");

  const base = slugOf(title) || "piece";
  let slug = base;
  for (let n = 2; await getOmni(slug); n++) slug = `${base}-${n}`;

  await db.insert(omniproofArticles).values({
    slug,
    title,
    date: todayIST(),
    field: field.id,
    subfield: field.subfields[0].id,
    short: title.split(/\s+/).slice(0, 4).join(" "),
    status: "draft",
  });
  refresh();
  redirect(`${ADMIN}/omniproof/${slug}`);
}

/**
 * Deletes a piece written in the admin. A bundled piece cannot be deleted
 * here (its file is in the repo); this takes it back to that file instead.
 */
export async function removeOmniPiece(slug: string) {
  await requireAdmin();
  await db.delete(omniproofArticles).where(eq(omniproofArticles.slug, slug));
  refresh(slug);
  const bundled = OMNI_ARTICLES.some((a) => a.slug === slug);
  redirect(bundled ? `${ADMIN}/omniproof/${slug}` : `${ADMIN}/omniproof`);
}
