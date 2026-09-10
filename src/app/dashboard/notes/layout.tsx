import { Suspense } from "react";
import { NotesRail, type RailModule } from "@/components/dashboard/NotesRail";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, modules as modulesTable } from "@/lib/db/schema";
import { getAccess } from "@/lib/auth/access";
import { releasedLessonIds } from "@/lib/lessons";

/**
 * Short tab labels. The full module title is the heading above the lesson
 * list; a tab has room for a word.
 */
const SHORT: Record<string, string> = {
  python: "Python",
  sql: "SQL",
  "agentic-ai": "Agentic AI",
  placement: "Placement",
};

/**
 * The documentation shell: one rail on the left, the article beside it.
 *
 * The rail is fetched here rather than in each page, so switching lessons
 * re-renders only the article — the rail keeps its scroll position instead
 * of jumping back to the top on every navigation.
 *
 * The contents of the open lesson are deliberately *not* worked out here.
 * A layout is not re-rendered when you move between sibling routes, so
 * anything derived from the current path is frozen at whichever lesson you
 * opened first — which is exactly how the rail came to list the first
 * lesson's sections underneath a later one. The lesson page publishes them
 * instead.
 */
export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { active, enrolment } = await getAccess();

  // Not enrolled: the page itself renders the gate, and a rail listing
  // lessons they cannot open would only be a menu of locked doors.
  if (!active) {
    return <div className="shell py-8 lg:py-10">{children}</div>;
  }

  const released = await releasedLessonIds(enrolment?.cohortId);

  /*
   * One query with the lessons nested, rather than a query per module. The
   * rail wants the whole tree and there are four modules, so a join and a
   * regroup beats five round trips.
   */
  const rows = await db
    .select({
      id: modulesTable.id,
      slug: modulesTable.slug,
      title: modulesTable.title,
      position: modulesTable.position,
      lessonId: lessons.id,
      lessonTitle: lessons.title,
      lessonPosition: lessons.position,
    })
    .from(modulesTable)
    .innerJoin(lessons, eq(lessons.moduleId, modulesTable.id))
    .where(eq(modulesTable.audience, "student"))
    .orderBy(asc(modulesTable.position), asc(lessons.position));

  /*
   * The join drops modules with nothing published, which is what we want.
   * "Placement Readiness" had no lessons and no short label, so it fell
   * through to the tab bar's else-branch and rendered a *second* tab reading
   * "SQL" — three tabs, two of them claiming to be the same course.
   *
   * The where clause drops the teaching notes, which are the same course
   * again at four times the length and are not addressed to the student.
   */
  const byModule = new Map<string, RailModule>();
  for (const row of rows) {
    let entry = byModule.get(row.id);
    if (!entry) {
      entry = {
        id: row.id,
        slug: row.slug,
        title: row.title,
        position: row.position,
        short: SHORT[row.slug] ?? row.title.split(" ")[0],
        lessons: [],
      };
      byModule.set(row.id, entry);
    }
    entry.lessons.push({
      id: row.lessonId,
      title: row.lessonTitle,
      position: row.lessonPosition,
      locked: !released.has(row.lessonId),
    });
  }

  const modules: RailModule[] = [...byModule.values()];

  return (
    <div className="mx-auto grid w-full max-w-[110rem] gap-8 px-5 py-8 md:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-10 xl:px-10">
      <Suspense fallback={<div />}>
        <NotesRail modules={modules} />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
