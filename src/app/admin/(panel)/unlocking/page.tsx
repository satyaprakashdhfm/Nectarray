import Link from "next/link";
import { Lock, LockOpen } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  cohorts as cohortsTable,
  lessonReleases,
  lessons as lessonsTable,
  modules as modulesTable,
} from "@/lib/db/schema";
import { setLessonRelease } from "../actions";

/*
 * Rendered per request, never at build time. See the panel layout — the
 * build container cannot reach the database on the private network.
 */
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  dayLabel: string;
  title: string;
  released: boolean;
};

export default async function AdminUnlockingPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const { batch } = await searchParams;

  const batches = await db
    .select()
    .from(cohortsTable)
    .orderBy(asc(cohortsTable.createdAt));

  const current =
    batches.find((row) => row.id === batch) ??
    batches.find((row) => row.isActive) ??
    batches[0];

  if (!current) {
    return (
      <>
        <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
          Unlocking
        </h1>
        <p className="text-ink-soft mt-3 text-[0.9375rem]">
          There are no batches yet, so there is nothing to unlock against.
        </p>
      </>
    );
  }

  const rows = await db
    .select({
      moduleId: modulesTable.id,
      moduleTitle: modulesTable.title,
      modulePosition: modulesTable.position,
      lessonId: lessonsTable.id,
      dayLabel: lessonsTable.dayLabel,
      title: lessonsTable.title,
      lessonPosition: lessonsTable.position,
    })
    .from(modulesTable)
    .innerJoin(lessonsTable, eq(lessonsTable.moduleId, modulesTable.id))
    .where(eq(modulesTable.audience, "student"))
    .orderBy(asc(modulesTable.position), asc(lessonsTable.position));

  const released = new Set(
    (
      await db
        .select({ lessonId: lessonReleases.lessonId })
        .from(lessonReleases)
        .where(eq(lessonReleases.cohortId, current.id))
    ).map((row) => row.lessonId),
  );

  const byModule = new Map<string, { title: string; lessons: Row[] }>();
  for (const row of rows) {
    let entry = byModule.get(row.moduleId);
    if (!entry) {
      entry = { title: row.moduleTitle, lessons: [] };
      byModule.set(row.moduleId, entry);
    }
    entry.lessons.push({
      id: row.lessonId,
      dayLabel: row.dayLabel,
      title: row.title,
      released: released.has(row.lessonId),
    });
  }

  const total = rows.length;

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Unlocking
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        Notes stay shut until you open them. Unlock a topic once you have
        taught it and it appears for everyone in that batch; until then they
        see the title greyed out and cannot read it.{" "}
        <strong className="text-ink">
          {released.size} of {total}
        </strong>{" "}
        unlocked for this batch.
      </p>

      {batches.length > 1 && (
        <nav aria-label="Batches" className="mt-7">
          <ul className="tab-bar">
            {batches.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/unlocking?batch=${row.id}`}
                  aria-current={row.id === current.id ? "page" : undefined}
                  className="tab"
                >
                  {row.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-8 space-y-6">
        {[...byModule.entries()].map(([moduleId, module]) => (
          <section key={moduleId} className="card p-7">
            <h2 className="display text-ink text-[1.375rem]">{module.title}</h2>

            <ul className="border-line mt-5 border-t">
              {module.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="border-line flex items-center justify-between gap-4 border-b py-3"
                >
                  <div className="min-w-0">
                    <p className="text-ink-faint text-[0.75rem]">
                      {lesson.dayLabel}
                    </p>
                    <p className="text-ink truncate text-[0.9375rem] font-medium">
                      {lesson.title}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={
                        lesson.released
                          ? "bg-leaf-wash text-leaf-deep rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase"
                          : "bg-mist text-ink-faint rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase"
                      }
                    >
                      {lesson.released ? "open" : "locked"}
                    </span>

                    <form action={setLessonRelease}>
                      <input
                        type="hidden"
                        name="cohort_id"
                        value={current.id}
                      />
                      <input type="hidden" name="lesson_id" value={lesson.id} />
                      <input
                        type="hidden"
                        name="unlock"
                        value={lesson.released ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        className="border-line bg-surface text-ink hover:bg-mist hover:border-brand active:bg-line inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-colors duration-200"
                      >
                        {lesson.released ? (
                          <Lock className="size-3.5" aria-hidden />
                        ) : (
                          <LockOpen className="size-3.5" aria-hidden />
                        )}
                        {lesson.released ? "Lock" : "Unlock"}
                        <span className="sr-only"> {lesson.title}</span>
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
