"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/auth/access";
import * as store from "@/lib/price-book-store";

/**
 * Saving and resetting price book tables. Admins only (a server action is
 * a public endpoint whatever page imports it); the rows are checked against
 * the table's columns in lib/price-book-store before anything is written.
 */

type Result = { ok: true } | { ok: false; error: string };

async function run(work: (by: string) => Promise<void>): Promise<Result> {
  const admin = await requireAdmin();
  try {
    await work(admin.firstName ?? admin.email);
    revalidatePath("/admin/integrations");
    return { ok: true };
  } catch (error) {
    console.error("[price-book]", error);
    if (error instanceof ZodError)
      return { ok: false, error: "Some cells are too long or not valid." };
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}

export async function savePriceTable(
  sheet: string,
  table: string,
  rows: unknown,
) {
  return run((by) => store.saveTable(sheet, table, rows, by));
}

export async function resetPriceTable(sheet: string, table: string) {
  return run(() => store.resetTable(sheet, table));
}
