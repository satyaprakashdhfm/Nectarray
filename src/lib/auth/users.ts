import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

/**
 * Finds or creates the user for a verified address.
 *
 * Google is the only way in, so every address reaching here is one Google
 * stands behind. Matching on the normalised address is what links a sign-in
 * to the account already behind it rather than minting a second one — and
 * `users.email` is unique, so a duplicate could not be written anyway.
 */
export async function upsertUser(
  rawEmail: string,
): Promise<{ userId: string; isNew: boolean }> {
  const email = normaliseEmail(rawEmail);

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(users.id, existing.id));
    return { userId: existing.id, isNew: false };
  }

  const [created] = await db
    .insert(users)
    .values({ email, emailVerifiedAt: new Date() })
    .returning({ id: users.id });

  return { userId: created.id, isNew: true };
}
