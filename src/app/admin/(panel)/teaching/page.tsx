import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, modules } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

/**
 * Same move as the student notes index: opens the first lesson of the
 * chosen course rather than listing everything the rail beside it already
 * lists.
 */
export default async function TeachingIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const { module: wanted } = await searchParams;

  const rows = await db
    .select({ slug: modules.slug, lessonId: lessons.id })
    .from(modules)
    .innerJoin(lessons, eq(lessons.moduleId, modules.id))
    .where(eq(modules.audience, "admin"))
    .orderBy(asc(modules.position), asc(lessons.position));

  const first =
    rows.find((row) => row.slug === wanted)?.lessonId ?? rows[0]?.lessonId;

  if (first) redirect(`/admin/teaching/${first}`);

  return (
    <div className="card p-8 text-center">
      <p className="text-ink-soft text-[0.9375rem]">
        No teaching notes have been written yet.
      </p>
    </div>
  );
}
