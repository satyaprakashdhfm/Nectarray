import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createLesson } from "../actions";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  lessons as lessonsTable,
  modules as modulesTable,
} from "@/lib/db/schema";

/*
 * Rendered per request, never at build time.
 *
 * Without this Next tries each of these during "Generating static pages" to
 * find out whether it can prerender them — which means running the query,
 * against a database the build container cannot reach on the private
 * network. It does not fail; it hangs for sixty seconds and then retries,
 * and the build went from twenty seconds to nearly two minutes. Nothing here
 * could ever be static: it is all somebody's admin panel.
 */
export const dynamic = "force-dynamic";

/**
 * The Notes tab's front door.
 *
 * Same move as the student notes index: it opens the first lesson of the
 * chosen course rather than listing what the rail beside it already lists.
 * `?new=1` — the "New lesson" button on every lesson — stops here instead
 * and shows the form, with that lesson's course already picked. So does a
 * course that has no lessons yet, since there is nothing to open.
 */
export default async function AdminNotesIndex({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; new?: string }>;
}) {
  const { module: wanted, new: adding } = await searchParams;

  // Students and whoever is teaching read the same notes; the old teaching
  // modules are still in the table, but nothing shows them any more.
  const rows = await db
    .select({
      id: modulesTable.id,
      slug: modulesTable.slug,
      title: modulesTable.title,
      lessonId: lessonsTable.id,
    })
    .from(modulesTable)
    .leftJoin(lessonsTable, eq(lessonsTable.moduleId, modulesTable.id))
    .where(eq(modulesTable.audience, "student"))
    .orderBy(asc(modulesTable.position), asc(lessonsTable.position));

  const chosen = rows.filter((row) => row.slug === wanted);
  const first = (chosen.length ? chosen : rows).find(
    (row) => row.lessonId,
  )?.lessonId;

  if (adding !== "1" && first) redirect(`/admin/lessons/${first}`);

  const modules = [...new Map(rows.map((row) => [row.id, row])).values()];

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink focus:border-brand focus:outline-none";
  const label = "text-ink mb-2 block text-[0.8125rem] font-semibold";

  return (
    <form action={createLesson} className="card p-6 sm:p-7">
      <h1 className="display text-ink text-[1.5rem]">New lesson</h1>
      <p className="text-ink-soft mt-2 text-[0.9375rem] leading-relaxed">
        Added as a draft at the end of its course, and opened in the editor.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
        <div>
          <label className={label} htmlFor="new-module">
            Course
          </label>
          <select
            id="new-module"
            name="module_id"
            defaultValue={chosen[0]?.id}
            className={field}
          >
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="new-title">
            Title
          </label>
          <input
            id="new-title"
            name="title"
            placeholder="Decorators and closures"
            required
            className={field}
          />
        </div>
        <button
          type="submit"
          className="bg-ink hover:bg-brand-deep text-cta-fg inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[0.9375rem] font-semibold transition-colors"
        >
          <Plus className="size-4" strokeWidth={2.5} aria-hidden />
          Add
        </button>
      </div>
    </form>
  );
}
