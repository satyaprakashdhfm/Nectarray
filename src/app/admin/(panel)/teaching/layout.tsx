import { Suspense } from "react";
import { NotesRail, type RailModule } from "@/components/dashboard/NotesRail";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, modules as modulesTable } from "@/lib/db/schema";

/**
 * Short tab labels, same convention as the student rail. New teaching
 * modules just need an entry here — falling back to the module's first word
 * otherwise, same as the student side.
 */
const SHORT: Record<string, string> = {
  "python-teaching": "Python",
  "sql-teaching": "SQL",
  "agentic-ai-teaching": "Agentic AI",
};

/**
 * The teaching-notes shell: the same rail-plus-article documentation layout
 * as `/dashboard/notes`, reading the admin-audience modules instead of the
 * student ones.
 *
 * No enrolment gate here — the parent admin layout already requires
 * `is_admin()`, and that is the only check this content needs. Nothing on
 * this route is ever editable; it exists so whoever is teaching a class can
 * read the full notes the way a student reads the short ones, not so they
 * can change them here. Edits to teaching content happen at the source.
 */
export default async function TeachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    .where(eq(modulesTable.audience, "admin"))
    .orderBy(asc(modulesTable.position), asc(lessons.position));

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
    });
  }

  const modules: RailModule[] = [...byModule.values()];

  // Sits inside the admin shell's own 80rem gutter already, unlike the
  // student notes shell which opts out of one for the extra width — the
  // rail-plus-article grid just needs the columns, not another wrapper.
  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <Suspense fallback={<div />}>
        <NotesRail modules={modules} basePath="/admin/teaching" stickyTop={88} />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
