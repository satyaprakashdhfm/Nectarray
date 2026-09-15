/**
 * The resume project's shape, shared by the editor and the server.
 *
 * Fixed rather than open-ended: the editor supports one template, so a
 * student edits these two files and cannot add, rename or delete one. That
 * keeps what is saved, what is compiled and what the compiler has packages
 * for the same set of things.
 */
export const RESUME_MAIN = "template.tex";
export const RESUME_FILE_NAMES = ["template.tex", "resume.cls"] as const;

export type ResumeFileName = (typeof RESUME_FILE_NAMES)[number];
export type ResumeFiles = Record<ResumeFileName, string>;

export const MAX_RESUME_FILE_CHARS = 100_000;
export const MAX_INTRO_CHARS = 8_000;
