import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { ADMIN } from "@/lib/admin-path";

/**
 * The admin Knowledge base: the old NOTES repository, kept here for good.
 *
 * Everything lives in knowledge/ at the repository root, not in content/,
 * so the ~120 MB archive ships only with the routes that read it and not
 * with every page that reads a lesson file:
 *
 *     knowledge/source/   the archive itself, file for file
 *     knowledge/notes/    one markdown note per notebook, text file or folder
 *     knowledge/media/    every image and report pulled out of the notebooks
 *     knowledge/index.json  subjects -> sections -> notes
 *
 * notes/, media/ and index.json are generated from source/ by
 * scripts/build-knowledge.py; edit the archive and rerun it, never the
 * generated files. This is reference material for whoever runs the place —
 * nothing here is shown to students, and the academy's notes are separate.
 */

export type KbNote = {
  id: string;
  title: string;
  file: string;
  kind: "notebook" | "text" | "files" | "project" | "checkpoints";
  /** Path of the original inside knowledge/source/, when there is one file. */
  source: string | null;
  cells?: number;
};
export type KbSection = { title: string; notes: KbNote[] };
export type KbSubject = {
  slug: string;
  title: string;
  short: string;
  blurb: string;
  sections: KbSection[];
};

const ROOT = path.join(process.cwd(), "knowledge");

/** Read once per process: it changes only with a deploy. */
let indexPromise: Promise<KbSubject[]> | null = null;

export function knowledgeIndex(): Promise<KbSubject[]> {
  indexPromise ??= readFile(path.join(ROOT, "index.json"), "utf8").then(
    (text) => (JSON.parse(text) as { subjects: KbSubject[] }).subjects,
  );
  return indexPromise;
}

export const knowledgeSubject = cache(async (slug: string) => {
  const subjects = await knowledgeIndex();
  return subjects.find((subject) => subject.slug === slug) ?? null;
});

/** A note, the subject and section it sits in, and its neighbours. */
export const knowledgeNote = cache(async (id: string) => {
  const subjects = await knowledgeIndex();
  for (const subject of subjects) {
    const flat = subject.sections.flatMap((section) =>
      section.notes.map((note) => ({ note, section })),
    );
    const index = flat.findIndex(({ note }) => note.id === id);
    if (index === -1) continue;
    const { note, section } = flat[index];
    const markdown = await readFile(
      path.join(ROOT, "notes", note.file),
      "utf8",
    );
    return {
      subject,
      section,
      note,
      body: resolveLinks(markdown),
      prev: flat[index - 1]?.note ?? null,
      next: flat[index + 1]?.note ?? null,
    };
  }
  return null;
});

export const KB_BASE = `${ADMIN}/knowledge`;

/** Where an original in the archive downloads from. */
export function kbFileHref(source: string): string {
  return `${KB_BASE}/file/${source.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * The notes are written with `kb-media:` and `kb-file:` links so that they
 * do not carry the panel's address, which is a deploy secret. Swapped here,
 * on the server, just before rendering.
 */
function resolveLinks(markdown: string): string {
  return markdown
    .replaceAll("kb-media:", `${KB_BASE}/media/`)
    .replace(/kb-file:([^)\s"']+)/g, (_, rel: string) =>
      kbFileHref(decodeURIComponent(rel)),
    );
}

const MEDIA_NAME = /^[0-9a-f]{20}\.[a-z0-9]{2,5}$/;

/** Bytes of one extracted image or report, or null. Names are content hashes. */
export async function knowledgeMedia(name: string): Promise<Buffer | null> {
  if (!MEDIA_NAME.test(name)) return null;
  try {
    return await readFile(path.join(ROOT, "media", name));
  } catch {
    return null;
  }
}

/** Bytes of one original from the archive, or null. Never leaves source/. */
export async function knowledgeSource(parts: string[]): Promise<Buffer | null> {
  const base = path.join(ROOT, "source");
  const target = path.resolve(base, ...parts);
  if (!target.startsWith(base + path.sep)) return null;
  try {
    return await readFile(target);
  } catch {
    return null;
  }
}

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".py": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".ipynb": "application/x-ipynb+json",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function contentType(name: string): string {
  return TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream";
}
