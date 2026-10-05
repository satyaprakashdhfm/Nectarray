import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { quoteDefaults } from "@/lib/db/schema";
import { cleanBody, defaultBody, type QuoteBody } from "@/lib/quotes";

/**
 * The rows and wording a new quote starts with: the admin's saved set once
 * there is one, the built-in list until then.
 */
export async function getQuoteDefaults(): Promise<{
  body: QuoteBody;
  customised: boolean;
}> {
  try {
    const [row] = await db
      .select()
      .from(quoteDefaults)
      .where(eq(quoteDefaults.id, "default"));
    if (row) return { body: cleanBody(row.body), customised: true };
  } catch (error) {
    // A database the migration has not reached yet.
    const code =
      (error as { code?: string }).code ??
      (error as { cause?: { code?: string } }).cause?.code;
    if (code !== "42P01") throw error;
  }
  return { body: defaultBody(), customised: false };
}
