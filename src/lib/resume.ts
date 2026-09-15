import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { User } from "@/lib/db/schema";
import {
  MAX_RESUME_FILE_CHARS,
  RESUME_FILE_NAMES,
  type ResumeFiles,
} from "@/lib/resume-files";

const TEMPLATE_DIR = path.join(process.cwd(), "content", "resume");

const fileBody = z.string().max(MAX_RESUME_FILE_CHARS);

/** Exactly the template's files, each a string of sensible size. */
export const resumeFilesSchema = z
  .object({ "template.tex": fileBody, "resume.cls": fileBody })
  .strict();

/** A stored value, if it is still a complete set of files. */
export function asResumeFiles(value: unknown): ResumeFiles | null {
  const parsed = resumeFilesSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** Characters LaTeX would read as commands rather than print. */
function escapeLatex(text: string): string {
  return text.replace(/[\\{}$&#^_~%]/g, (c) =>
    c === "\\"
      ? "\\textbackslash{}"
      : c === "~"
        ? "\\textasciitilde{}"
        : c === "^"
          ? "\\textasciicircum{}"
          : `\\${c}`,
  );
}

/**
 * The template, with the student's name and email already in the header.
 *
 * Those are the two things the account already knows, and the first two
 * lines anyone edits — so a first compile shows their own name at the top
 * rather than a placeholder.
 */
export async function defaultResumeFiles(user: User): Promise<ResumeFiles> {
  const [tex, cls] = await Promise.all(
    RESUME_FILE_NAMES.map((name) =>
      readFile(path.join(TEMPLATE_DIR, name), "utf8"),
    ),
  );

  const name = [user.firstName, user.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  // Function replacers, so a "$" in either value is never read as a pattern.
  const link = `\\href{mailto:${user.email.replace(/[%#]/g, "\\$&")}}{${escapeLatex(user.email)}}`;
  let filled = tex.replace(
    "\\href{mailto:you@example.com}{you@example.com}",
    () => link,
  );
  if (name) {
    filled = filled.replace("YOUR FULL NAME", () =>
      escapeLatex(name.toUpperCase()),
    );
  }

  return { "template.tex": filled, "resume.cls": cls };
}

/** "Kurmarao_Marada_Resume.pdf" — safe as a download name on every OS. */
export function resumePdfName(user: User): string {
  const parts = [user.firstName, user.lastName]
    .map((part) => part?.trim().replace(/[^A-Za-z0-9]+/g, "_"))
    .filter(Boolean);
  return `${parts.length ? parts.join("_") : "Resume"}${parts.length ? "_Resume" : ""}.pdf`;
}
