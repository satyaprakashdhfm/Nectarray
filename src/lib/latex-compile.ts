import "server-only";
import { RESUME_MAIN, type ResumeFiles } from "@/lib/resume-files";

export type CompileResult =
  | { ok: true; pdf: ArrayBuffer }
  | {
      ok: false;
      error: string;
      file?: string;
      line?: number;
      log?: string;
      unavailable?: boolean;
    };

/** Whether services/latex is configured on this deployment. */
export function compilerConfigured(): boolean {
  return Boolean(process.env.LATEX_URL && process.env.LATEX_TOKEN);
}

/**
 * Sends a resume to services/latex and returns the PDF, or why it failed.
 *
 * Shared by the student compile route and the admin placement page — both
 * want exactly this call, and the admin page makes it directly rather than
 * through the API route since a server component can just call it.
 */
export async function compileResume(
  files: ResumeFiles,
): Promise<CompileResult> {
  const url = process.env.LATEX_URL;
  const token = process.env.LATEX_TOKEN;
  if (!url || !token) {
    return {
      ok: false,
      error: "The resume preview is not set up yet.",
      unavailable: true,
    };
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${url.replace(/\/+$/, "")}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Latex-Token": token },
      body: JSON.stringify({ main: RESUME_MAIN, files }),
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "Could not reach the compiler." };
  }

  if (upstream.ok) {
    return { ok: true, pdf: await upstream.arrayBuffer() };
  }

  if (upstream.status === 422) {
    const data = (await upstream.json().catch(() => ({}))) as {
      error?: unknown;
      file?: unknown;
      line?: unknown;
      log?: unknown;
    };
    return {
      ok: false,
      error: typeof data.error === "string" ? data.error : "LaTeX error.",
      file: typeof data.file === "string" ? data.file : undefined,
      line: typeof data.line === "number" ? data.line : undefined,
      log: typeof data.log === "string" ? data.log : undefined,
    };
  }

  return { ok: false, error: "The compiler had a problem." };
}
