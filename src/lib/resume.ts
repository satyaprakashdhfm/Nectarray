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

/**
 * The self-introduction template, with the student's name already in it.
 *
 * Never saved on its own — the placement page falls back to this at read
 * time when a student's `intro` is null, the same way it falls back to
 * `defaultResumeFiles` for the resume. Editing it is what actually creates
 * the saved row; opening the tab and doing nothing leaves the account with
 * no intro at all, which is the right default rather than a database full
 * of copies of this same paragraph.
 *
 * `user` is optional so the admin panel can render the bare template — the
 * one every student who hasn't written their own sees — without a person to
 * attach it to.
 */
export function defaultIntro(
  user?: Pick<User, "firstName" | "lastName"> | null,
): string {
  const name = [user?.firstName, user?.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return `I am ${name || "[Your Name]"}, currently pursuing my Bachelor's degree in Computer Science Engineering at [Your College Name]. I have built a strong foundation in [Your Specialisation — e.g. AI/ML, Web Development] through both college subjects and hands-on projects.

Throughout my academic journey, I have studied core computer science subjects and gained practical skills in [Your Key Skills]. These have helped me understand both the fundamentals and the real-world applications of the technologies I work with.

As part of my time at NectArray, I worked on projects involving [Your Tools and Technologies], and gained hands-on experience with [Something Specific You Built or Learned]. This helped me understand how to bring together [X] and [Y] to build something people can actually use.

I am excited about this opportunity, and if given a chance, I will contribute meaningfully to the team and the organisation.`;
}

/** "Kurmarao_Marada_Resume.pdf" — safe as a download name on every OS. */
export function resumePdfName(user: User): string {
  const parts = [user.firstName, user.lastName]
    .map((part) => part?.trim().replace(/[^A-Za-z0-9]+/g, "_"))
    .filter(Boolean);
  return `${parts.length ? parts.join("_") : "Resume"}${parts.length ? "_Resume" : ""}.pdf`;
}
