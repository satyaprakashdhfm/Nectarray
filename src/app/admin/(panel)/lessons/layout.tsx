import { Suspense } from "react";
import { NotesRail, type RailModule } from "@/components/dashboard/NotesRail";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, modules as modulesTable } from "@/lib/db/schema";

/** Short tab labels, same convention as the student rail. */
const SHORT: Record<string, string> = {
  python: "Python",
  sql: "SQL",
  "agentic-ai": "Agentic AI",
  placement: "Placement",
};

/**
 * The notes shell: the same rail-plus-article layout as `/dashboard/notes`,
 * reading the same student modules, so what is on screen here is what a
 * student reads. Students and whoever is teaching share one set of notes.
 *
 * Unlike the student rail it lists every lesson, drafts included — a draft
 * is exactly what an admin comes here to finish — and marks them, since the
 * rail is the only place their status would otherwise be invisible. No
 * enrolment gate or lock: the parent admin layout already requires an admin.
 */
export default async function AdminNotesLayout({
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
      isPublished: lessons.isPublished,
    })
    .from(modulesTable)
    .innerJoin(lessons, eq(lessons.moduleId, modulesTable.id))
    .where(eq(modulesTable.audience, "student"))
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
      title: row.isPublished ? row.lessonTitle : `${row.lessonTitle} (draft)`,
      position: row.lessonPosition,
    });
  }

  const modules: RailModule[] = [...byModule.values()];

  // Sits inside the admin shell's own gutter already, so the grid needs only
  // its columns. 88px clears the admin header, which has no second nav row.
  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <Suspense fallback={<div />}>
        <NotesRail
          modules={modules}
          basePath="/admin/lessons"
          stickyTop="88px"
          progress={false}
        />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
