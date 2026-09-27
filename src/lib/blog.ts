import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** An article's markdown, from content/blog/<slug>.md. */
export async function readPost(slug: string): Promise<string> {
  return readFile(
    path.join(process.cwd(), "content", "blog", `${slug}.md`),
    "utf8",
  );
}

/** Minutes to read, at 220 words a minute, code blocks included. */
export function readingMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const postDate = (iso: string) =>
  new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
