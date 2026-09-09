import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { practiceDrafts } from "@/lib/db/schema";
import { AccessError, requireEnrolled } from "@/lib/auth/access";

export const runtime = "nodejs";

/**
 * Saves a student's in-progress SQL or Python for one question.
 *
 * Called on a debounce from the editor, not on every keystroke — an upsert
 * per question is cheap, but there is no reason to fire one per character.
 * An empty string is written like anything else: clearing the editor is a
 * real edit, and a student who deletes everything wants that remembered too.
 */
export async function POST(request: Request) {
  try {
    const user = await requireEnrolled();
    const body = (await request.json()) as {
      questionId?: unknown;
      code?: unknown;
    };
    const questionId = String(body.questionId ?? "");
    const code = typeof body.code === "string" ? body.code : null;

    if (!questionId || code === null) {
      return NextResponse.json(
        { error: "A question and its code are both required." },
        { status: 400 },
      );
    }

    // A cap well past anything a practice answer needs, so a runaway client
    // cannot use this as free storage.
    if (code.length > 20_000) {
      return NextResponse.json(
        { error: "That is too long to save." },
        {
          status: 413,
        },
      );
    }

    await db
      .insert(practiceDrafts)
      .values({ userId: user.id, questionId, code })
      .onConflictDoUpdate({
        target: [practiceDrafts.userId, practiceDrafts.questionId],
        set: { code, updatedAt: new Date() },
      });

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

/**
 * Clears a saved draft — used when "Reset" should also forget what was
 * typed, not just the SQLite copy in the browser.
 */
export async function DELETE(request: Request) {
  try {
    const user = await requireEnrolled();
    const body = (await request.json()) as { questionId?: unknown };
    const questionId = String(body.questionId ?? "");
    if (!questionId) {
      return NextResponse.json({ error: "Which question?" }, { status: 400 });
    }

    await db
      .delete(practiceDrafts)
      .where(
        and(
          eq(practiceDrafts.userId, user.id),
          eq(practiceDrafts.questionId, questionId),
        ),
      );

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
