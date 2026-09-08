import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { AccessError, requireUser } from "@/lib/auth/access";

/** The name and phone number asked for once, after a first sign-in. */
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as Record<string, unknown>;

    const firstName = String(body.firstName ?? "")
      .trim()
      .slice(0, 80);
    const lastName = String(body.lastName ?? "")
      .trim()
      .slice(0, 80);
    const phone = String(body.phone ?? "")
      .trim()
      .slice(0, 30);

    if (!firstName) {
      return NextResponse.json(
        { error: "A first name, at least." },
        { status: 400 },
      );
    }

    await db
      .update(users)
      .set({ firstName, lastName: lastName || null, phone: phone || null })
      .where(eq(users.id, user.id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
