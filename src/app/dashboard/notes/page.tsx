import { redirect } from "next/navigation";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { asc, eq } from "drizzle-orm";
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
   * The first *unlocked* lesson of the chosen course, or of the first course
   * that has one. Landing on a locked lesson would put every student on the
   * locked notice the moment their batch is a day behind, so the ones their
   * batch cannot open are dropped before the first is picked.
   */
  const released = await releasedLessonIds(enrolment?.cohortId);

  const rows = (
    await db
      .select({ slug: modules.slug, lessonId: lessons.id })
      .from(modules)
      .innerJoin(lessons, eq(lessons.moduleId, modules.id))
      .where(eq(modules.audience, "student"))
      .orderBy(asc(modules.position), asc(lessons.position))
  ).filter((row) => released.has(row.lessonId));

  const first =
    rows.find((row) => row.slug === wanted)?.lessonId ?? rows[0]?.lessonId;

  if (first) redirect(`/dashboard/notes/${first}`);

  return (
    <div className="card p-8 text-center">
      <p className="text-ink-soft text-[0.9375rem]">
        No notes have been unlocked yet. They open as each topic is taught.
      </p>
    </div>
  );
}
