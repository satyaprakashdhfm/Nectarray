import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { omniproofArticles } from "@/lib/db/schema";
import {
  FIELDS,
  OMNI_ARTICLES,
  type FieldId,
  type OmniArticle,
} from "@/lib/content/omniproof";

/**
 * Where Omniproof articles come from.
 *
 * Two sources, merged by slug. The pieces bundled in content/omniproof/ (with
 * their data in lib/content/omniproof.ts) are the starting set; rows in
 * `omniproof_articles`, written in the admin, come on top. A row replaces the
 * bundled piece of the same slug, whatever its status, so a bundled piece
 * can be edited, held back as a draft or archived from the admin. Only
 * published pieces reach the public site.
 *
 * If the database cannot be reached the bundled set is served on its own, so
 * the section never goes blank because Postgres is restarting.
 */

export type OmniStatus = "draft" | "published" | "archived";

/** An article with its body and where it lives, as the admin sees it. */
export type OmniEntry = OmniArticle & {
  body: string;
  status: OmniStatus;
  /** "bundled": still the file in the repo; "database": edited or new. */
  origin: "bundled" | "database";
  updatedAt: string | null;
};

const FIELD_IDS = new Set<string>(FIELDS.map((f) => f.id));

/** An Omniproof article's markdown, from content/omniproof/<slug>.md. */
export async function readOmni(slug: string): Promise<string> {
  return readFile(
    path.join(process.cwd(), "content", "omniproof", `${slug}.md`),
    "utf8",
  );
}

type Row = typeof omniproofArticles.$inferSelect;

function fromRow(row: Row): OmniEntry {
  const field = (
    FIELD_IDS.has(row.field) ? row.field : "mathematics"
  ) as FieldId;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.date,
    field,
    subfield: row.subfield,
    short: row.short,
    cover: row.coverSrc
      ? { src: row.coverSrc, alt: row.coverAlt ?? "" }
      : undefined,
    source: { label: row.sourceLabel, href: row.sourceHref },
    lands: row.lands
      .filter((l) => FIELD_IDS.has(l.field) && l.impact.trim())
      .map((l) => ({ field: l.field as FieldId, impact: l.impact })),
    body: row.body,
    status: (["draft", "published", "archived"].includes(row.status)
      ? row.status
      : "draft") as OmniStatus,
    origin: "database",
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function bundled(a: OmniArticle): Promise<OmniEntry> {
  return {
    ...a,
    body: await readOmni(a.slug).catch(() => ""),
    status: "published",
    origin: "bundled",
    updatedAt: null,
  };
}

async function rows(): Promise<Row[]> {
  try {
    return await db
      .select()
      .from(omniproofArticles)
      .orderBy(desc(omniproofArticles.date));
  } catch (error) {
    console.error("[omniproof] database unavailable, bundled only:", error);
    return [];
  }
}

/** Every piece, any status, newest first: the admin's list. */
export async function allOmni(): Promise<OmniEntry[]> {
  const stored = (await rows()).map(fromRow);
  const taken = new Set(stored.map((a) => a.slug));
  const files = await Promise.all(
    OMNI_ARTICLES.filter((a) => !taken.has(a.slug)).map(bundled),
  );
  return [...stored, ...files].sort((a, b) => b.date.localeCompare(a.date));
}

/** The published pieces, newest first, with their bodies. */
export async function publishedOmni(): Promise<OmniEntry[]> {
  return (await allOmni()).filter((a) => a.status === "published");
}

/** Just the article data, for a client component that has no use for bodies. */
export const omniCard = ({
  body: _body,
  status: _status,
  origin: _origin,
  updatedAt: _updatedAt,
  ...article
}: OmniEntry): OmniArticle => article;

/** One piece by slug, any status; the public page checks it is published. */
export async function getOmni(slug: string): Promise<OmniEntry | null> {
  return (await allOmni()).find((a) => a.slug === slug) ?? null;
}

/** Minutes to read, at 220 words a minute, code blocks included. */
export function readingMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const postDate = (iso: string) =>
  new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
