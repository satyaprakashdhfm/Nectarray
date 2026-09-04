import { slugify } from "@/components/dashboard/Markdown";

export type TocEntry = { level: 1 | 2; text: string; id: string };

/**
 * "On this page", built by scanning the markdown for its top two heading
 * levels.
 *
 * Parsed from the raw source rather than from the DOM so it renders on the
 * server with everything else — a client-side scan would leave the column
 * empty until hydration, which on a 40 KB lesson is exactly when a reader
 * is looking for it.
 *
 * Fenced blocks are stripped first: these notes are full of shell examples
 * where a line legitimately starts with #, and every one of those would
 * otherwise arrive as a heading.
 */
export function tocEntries(source: string): TocEntry[] {
  const withoutFences = source.replace(/```[\s\S]*?```/g, "");

  const entries: TocEntry[] = [];
  for (const line of withoutFences.split("\n")) {
    const match = /^(#{1,2})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/`/g, "").trim();
    if (!text) continue;
    entries.push({
      level: match[1].length as 1 | 2,
      text,
      id: slugify(text),
    });
  }
  return entries;
}
