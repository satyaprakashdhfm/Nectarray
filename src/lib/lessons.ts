import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, type Lesson } from "@/lib/db/schema";

export type { Lesson };

/**
 * One lesson, fetched at most once per request.
 *
 * Both the documentation shell and the article itself need the body — the
 * shell to build the contents list in the rail, the page to render it. Left
 * alone that is the same 40 KB row pulled twice over the same request.
 */
export const getLesson = cache(async (id: string): Promise<Lesson | null> => {
  const [row] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, id))
    .limit(1);
  return row ?? null;
});

/**
 * Strips a lesson body's opening H1 when it is just the title again.
 *
 * Every imported Python note opens with its own title, and the page renders
 * that title above the body already — so the reader met "Day 1 - Python
 * Programming Fundamentals" twice, once as the page heading and again as the
 * first line of the article, with a rule between them.
 *
 * It has to be the title though, not merely the first heading. The SQL notes
 * open on a real section — "MySQL - Database and Table Basics" under a lesson
 * called "Database Objects" — and removing that took a section of the course
 * away along with its place in the contents.
 */
export function stripLeadingHeading(markdown: string, title: string): string {
  const match = /^\s*#\s+([^\n]*)\n+/.exec(markdown);
  if (!match) return markdown;

  const squash = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");
  const heading = squash(match[1]);
  const wanted = squash(title);

  if (!wanted || !heading.includes(wanted)) return markdown;
  return markdown.slice(match[0].length);
}
