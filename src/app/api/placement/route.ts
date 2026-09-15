import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { placementProfiles } from "@/lib/db/schema";
import { AccessError, requireEnrolled } from "@/lib/auth/access";
import { resumeFilesSchema } from "@/lib/resume";
import { MAX_INTRO_CHARS } from "@/lib/resume-files";

export const runtime = "nodejs";

const body = z
  .object({
    intro: z.string().max(MAX_INTRO_CHARS).optional(),
    files: resumeFilesSchema.optional(),
  })
  .refine((b) => b.intro !== undefined || b.files !== undefined);

/**
 * Saves a student's intro, their resume source, or both.
 *
 * Called on a debounce from the editors. Each field is written only when it
 * is sent, so saving the intro never touches the resume and the other way
 * round — the two tabs autosave independently.
 */
export async function PUT(request: Request) {
  try {
    const user = await requireEnrolled();
    const parsed = body.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "That could not be saved — it may be too long." },
        { status: 400 },
      );
    }

    const { intro, files } = parsed.data;
    await db
      .insert(placementProfiles)
      .values({
        userId: user.id,
        intro: intro ?? null,
        resumeFiles: files ?? null,
      })
      .onConflictDoUpdate({
        target: placementProfiles.userId,
        set: {
          ...(intro !== undefined && { intro }),
          ...(files !== undefined && { resumeFiles: files }),
          updatedAt: new Date(),
        },
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
