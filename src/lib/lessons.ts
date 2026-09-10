import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  lessonReleases,
  lessons,
  modules,
  type Lesson,
} from "@/lib/db/schema";

export type { Lesson };

/**
 * The lessons a batch has been let into, as a set to test membership against.
 *
 * Absence is the lock, so a student with no batch — which should not happen
 * past the enrolment gate — gets an empty set rather than everything. The
 * cache matters here for the same reason it does on getLesson: the rail in
 * the layout and the page beside it both need this, and it cannot have
 * changed between them.
 */
export const releasedLessonIds = cache(
  async (cohortId: string | null | undefined): Promise<Set<string>> => {
    if (!cohortId) return new Set();
    const rows = await db
      .select({ lessonId: lessonReleases.lessonId })
      .from(lessonReleases)
      .where(eq(lessonReleases.cohortId, cohortId));
    return new Set(rows.map((row) => row.lessonId));
  },
);

/** A lesson, plus who the module it belongs to is written for and that module's slug. */
export type LessonWithAudience = Lesson & {
  audience: string;
  moduleSlug: string;
};

/**
 * One lesson, fetched at most once per request.
 *
 * Both the documentation shell and the article itself need the body — the
 * shell to build the contents list in the rail, the page to render it. Left
 * alone that is the same 40 KB row pulled twice over the same request.
 */
export const getLesson = cache(
  async (id: string): Promise<LessonWithAudience | null> => {
    /*
     * The module's audience comes back with the lesson because the caller
     * has to check it, and a lesson is addressed by its own id — nothing in
     * the URL says which module it belongs to. Without this the teacher's
     * notes were one guessed id away from any enrolled student.
     */
    const [row] = await db
      .select({
        lesson: lessons,
        audience: modules.audience,
        moduleSlug: modules.slug,
      })
      .from(lessons)
      .innerJoin(modules, eq(modules.id, lessons.moduleId))
      .where(eq(lessons.id, id))
      .limit(1);
    return row
      ? { ...row.lesson, audience: row.audience, moduleSlug: row.moduleSlug }
      : null;
  },
);

/**
 * Strips a lesson body's opening H1 when it is just the title again.
 *
 * Every imported Python note opens with its own title, and the page renders
 * that title above the body already — so the reader met "Programming
 * Fundamentals" twice, once as the page heading and again as the first line
 * of the article, with a rule between them.
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
