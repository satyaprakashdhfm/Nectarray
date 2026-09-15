import { NextResponse } from "next/server";
import { z } from "zod";
import { AccessError, requireEnrolled } from "@/lib/auth/access";
import { compileResume } from "@/lib/latex-compile";
import { resumeFilesSchema } from "@/lib/resume";

export const runtime = "nodejs";

const body = z.object({ files: resumeFilesSchema });

/**
 * Compiles the editor's current resume source to a PDF.
 *
 * What is in the editor, not what is saved — a student presses Recompile to
 * see the line they just typed. The LaTeX itself runs in services/latex,
 * never here: a document can read files, and this process can read the
 * database credentials.
 */
export async function POST(request: Request) {
  try {
    await requireEnrolled();

    const parsed = body.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "That resume is too large to compile." },
        { status: 400 },
      );
    }

    const result = await compileResume(parsed.data.files);

    if (result.ok) {
      return new Response(result.pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json(
      {
        error: result.error,
        file: result.file,
        line: result.line,
        log: result.log,
        unavailable: result.unavailable,
      },
      { status: result.unavailable ? 503 : result.file ? 422 : 502 },
    );
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
