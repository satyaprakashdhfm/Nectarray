import "server-only";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { priceTables } from "@/lib/db/schema";
import {
  sheetBySlug,
  type Cell,
  type Column,
  type PriceRow,
  type PriceTable,
  type Sheet,
} from "@/lib/price-book";
import { PROVIDERS, providersSheet } from "@/lib/price-book-providers";

/**
 * The price book as the team has edited it. The code holds every sheet as
 * the workbook had it; a table saved from the admin panel replaces that
 * table's rows (never its columns), and resetting it brings the workbook's
 * rows back.
 */

const key = (sheet: string, table: string) => `${sheet}/${table}`;

/** A sheet as the code has it, before edits. */
export function baseSheet(slug: string | undefined): Sheet | undefined {
  return slug === PROVIDERS ? providersSheet() : sheetBySlug(slug);
}

const word = z.string().trim().max(200);
const amount = z.number().finite().min(0).max(1e12);

function cellSchema(kind: Column["kind"]): z.ZodType<Cell> {
  switch (kind) {
    case "money":
      return z.union([
        z.strictObject({ usd: amount }),
        z.strictObject({ inr: amount }),
        word,
        z.null(),
      ]);
    case "number":
    case "percent":
      return z.union([z.number().finite(), word, z.null()]);
    case "long":
      return z.union([z.string().trim().max(2000), z.null()]);
    default:
      return z.union([word, z.null()]);
  }
}

const rowShape = z.object({
  id: z.string().min(1).max(64),
  cells: z.array(z.unknown()),
});

/**
 * Untrusted rows (from the browser, or saved before a column changed)
 * checked against a table's columns. Links are never taken from the input:
 * a row keeps the link its workbook row had, so a saved table cannot point
 * anywhere new.
 */
function parseRows(table: PriceTable, input: unknown): PriceRow[] {
  const rows = z.array(rowShape).max(500).parse(input);
  const links = new Map(table.rows.map((r) => [r.id, r.href]));
  const seen = new Set<string>();
  return rows.map((row) => {
    if (seen.has(row.id)) throw new Error("Two rows have the same id.");
    seen.add(row.id);
    if (row.cells.length !== table.columns.length)
      throw new Error("A row does not match the table's columns.");
    const cells = table.columns.map((c, i) =>
      cellSchema(c.kind).parse(row.cells[i] === "" ? null : row.cells[i]),
    );
    if (cells[0] === null)
      throw new Error("Every row needs a name in the first column.");
    const href = links.get(row.id);
    return href ? { id: row.id, cells, href } : { id: row.id, cells };
  });
}

/** A sheet with the team's saved tables in place of the workbook's. */
export async function withEdits(sheet: Sheet): Promise<Sheet> {
  const saved = await db
    .select()
    .from(priceTables)
    .where(
      inArray(
        priceTables.id,
        sheet.tables.map((t) => key(sheet.slug, t.id)),
      ),
    );
  return {
    ...sheet,
    tables: sheet.tables.map((table) => {
      const row = saved.find((s) => s.id === key(sheet.slug, table.id));
      if (!row) return table;
      try {
        return {
          ...table,
          rows: parseRows(table, row.rows),
          edited: { at: row.updatedAt.toISOString(), by: row.updatedBy },
        };
      } catch (error) {
        // The table's columns changed in code since it was saved. Show the
        // workbook's rows rather than a broken table; the saved row stays
        // in the database for whoever fixes the columns.
        console.error("[price-book] saved table no longer fits", row.id, error);
        return table;
      }
    }),
  };
}

function baseTable(slug: string, tableId: string) {
  const table = baseSheet(slug)?.tables.find((t) => t.id === tableId);
  if (!table) throw new Error("No such table.");
  return table;
}

export async function saveTable(
  slug: string,
  tableId: string,
  rows: unknown,
  by: string,
) {
  const parsed = parseRows(baseTable(slug, tableId), rows);
  const id = key(slug, tableId);
  const values = { rows: parsed, updatedAt: new Date(), updatedBy: by };
  await db
    .insert(priceTables)
    .values({ id, ...values })
    .onConflictDoUpdate({ target: priceTables.id, set: values });
}

export async function resetTable(slug: string, tableId: string) {
  baseTable(slug, tableId);
  await db.delete(priceTables).where(eq(priceTables.id, key(slug, tableId)));
}
