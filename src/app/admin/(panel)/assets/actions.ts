"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assetEntries } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/access";

/**
 * Money put in and money spent, on the Assets page. Like every admin action
 * these check for an admin first: a server action is a public endpoint.
 */

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

export async function addAssetEntry(form: FormData) {
  const admin = await requireAdmin();
  const kind = text(form, "kind");
  if (kind !== "in" && kind !== "out") throw new Error("Unknown entry.");
  const amount = Number(text(form, "amount").replace(/[₹,\s]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0)
    throw new Error("Enter an amount above 0.");
  const on = text(form, "on");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(on)) throw new Error("Enter the date.");
  const reason = text(form, "reason").slice(0, 300);
  if (!reason) throw new Error("Say what it was for.");

  await db.insert(assetEntries).values({
    kind,
    amount: String(amount),
    on,
    reason,
    addedBy: admin.email,
  });
  revalidatePath("/admin", "layout");
}

export async function deleteAssetEntry(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing entry.");
  await db.delete(assetEntries).where(eq(assetEntries.id, id));
  revalidatePath("/admin", "layout");
}
