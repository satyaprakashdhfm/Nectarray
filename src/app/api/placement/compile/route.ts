import { NextResponse } from "next/server";
import { z } from "zod";
import { AccessError, requireEnrolled } from "@/lib/auth/access";
import { resumeFilesSchema } from "@/lib/resume";
import { RESUME_MAIN } from "@/lib/resume-files";

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

    const url = process.env.LATEX_URL;
    const token = process.env.LATEX_TOKEN;
    if (!url || !token) {
      return NextResponse.json(
        { error: "The resume preview is not set up yet.", unavailable: true },
        { status: 503 },
      );
    }

    const parsed = body.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "That resume is too large to compile." },
        { status: 400 },
      );
    }

    let upstream: Response;
    try {
      upstream = await fetch(`${url.replace(/\/+$/, "")}/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Latex-Token": token },
        body: JSON.stringify({ main: RESUME_MAIN, files: parsed.data.files }),
        signal: AbortSignal.timeout(45_000),
        cache: "no-store",
      });
    } catch {
      return NextResponse.json(
        { error: "Could not reach the compiler. Try again in a moment." },
        { status: 502 },
      );
    }

    if (upstream.ok) {
      return new Response(await upstream.arrayBuffer(), {
        headers: {
          "Content-Type": "application/pdf",
          "Cache-Control": "no-store",
        },
      });
    }

    // A LaTeX error in the document: pass on only what the editor shows.
    if (upstream.status === 422) {
      const data = (await upstream.json().catch(() => ({}))) as {
        error?: unknown;
        file?: unknown;
        line?: unknown;
        log?: unknown;
      };
      return NextResponse.json(
        {
          error: typeof data.error === "string" ? data.error : "LaTeX error.",
          file: typeof data.file === "string" ? data.file : undefined,
          line: typeof data.line === "number" ? data.line : undefined,
          log: typeof data.log === "string" ? data.log : undefined,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: "The compiler had a problem. Try again in a moment." },
      { status: 502 },
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
