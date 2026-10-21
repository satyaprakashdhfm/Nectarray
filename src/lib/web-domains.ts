import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { webDomainSites, webNotes } from "@/lib/db/schema";
import { WEB_DOMAINS, type DomainSite } from "@/lib/content/web-domains";

const missingTable = (error: unknown) =>
  ((error as { code?: string }).code ??
    (error as { cause?: { code?: string } }).cause?.code) === "42P01";

/**
 * One domain's reference sites: the admin's saved list once there is one,
 * and the built-in list until then.
 */
export async function getDomainSites(
  domain: string,
): Promise<{ sites: DomainSite[]; customised: boolean }> {
  const builtIn = WEB_DOMAINS.find((d) => d.id === domain)?.sites ?? [];
  let rows;
  try {
    rows = await db
      .select()
      .from(webDomainSites)
      .where(eq(webDomainSites.domain, domain))
      .orderBy(asc(webDomainSites.position));
  } catch (error) {
    // A database the migration has not reached yet: no table is no edits.
    if (missingTable(error)) return { sites: builtIn, customised: false };
    throw error;
  }
  if (rows.length === 0) return { sites: builtIn, customised: false };
  return {
    sites: rows.map((row) => ({
      name: row.name,
      url: row.url,
      ...(row.score ? { score: row.score } : {}),
      ...(row.note ? { note: row.note } : {}),
    })),
    customised: true,
  };
}

export type SavedPalette = { id: string; colors: string[] };

/**
 * Palettes added on the Colours tab from a Coolors link, newest first.
 * Kept in web_notes as kind "palette", the hex codes in the title.
 */
export async function getSavedPalettes(): Promise<SavedPalette[]> {
  try {
    const rows = await db
      .select()
      .from(webNotes)
      .where(eq(webNotes.kind, "palette"))
      .orderBy(asc(webNotes.position));
    return rows
      .map((row) => ({ id: row.id, colors: row.title.split("-") }))
      .reverse();
  } catch (error) {
    if (missingTable(error)) return [];
    throw error;
  }
}
