import { redirect } from "next/navigation";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, modules } from "@/lib/db/schema";
import { getAccess } from "@/lib/auth/access";
import { releasedLessonIds } from "@/lib/lessons";

/**
 * The notes index does not exist as a page any more — it opens the first
 * lesson of the chosen course instead.
 *
 * It used to list every module and every lesson, which was the exact content
 * of the rail sitting next to it: the same twenty-three links, twice on one
 * screen, and a click that only ever led to the first one anyway. Landing on
 * the material is what a documentation site does.
 */
export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const { active, status, enrolment } = await getAccess();
  if (!active) return <EnrolmentPanel status={status} />;

  const { module: wanted } = await searchParams;

  /*
   * The first *unlocked* lesson of the chosen course. Locked ones are dropped
   * first, so a batch a day behind lands on material it can read rather than
   * on the locked notice.
   */
  const released = await releasedLessonIds(enrolment?.cohortId);

  const rows = (
    await db
      .select({ slug: modules.slug, lessonId: lessons.id })
      .from(modules)
      .innerJoin(lessons, eq(lessons.moduleId, modules.id))
      .where(
        and(eq(modules.audience, "student"), eq(lessons.isPublished, true)),
      )
      .orderBy(asc(modules.position), asc(lessons.position))
  ).filter((row) => released.has(row.lessonId));

  /*
   * A named course is answered with that course or with nothing — never with
   * a different one. This used to fall back to the first unlocked lesson
   * anywhere, which was invisible until releases existed and then became the
   * whole behaviour: with only Python unlocked, clicking SQL or Agentic AI
   * bounced the reader back to Python and left the Python tab lit, so the
   * tabs looked broken rather than empty.
   */
  const inCourse = wanted ? rows.filter((row) => row.slug === wanted) : rows;
  const first = inCourse[0]?.lessonId;

  if (first) redirect(`/dashboard/notes/${first}`);

  return (
    <div className="card p-8 text-center">
      <p className="text-ink-soft text-[0.9375rem]">
        {wanted
          ? "Nothing in this course has been unlocked yet."
          : "No notes have been unlocked yet."}{" "}
        Topics open as each one is taught.
      </p>
    </div>
  );
}
