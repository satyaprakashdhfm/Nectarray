import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Pencil, Plus } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { updateLesson } from "../../actions";
import { IntentLink } from "@/components/dashboard/IntentLink";
import { LessonToc } from "@/components/dashboard/lesson-toc";
import { Markdown } from "@/components/dashboard/Markdown";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { getLesson, stripLeadingHeading } from "@/lib/lessons";
import { tocEntries } from "@/lib/toc";

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
 * One lesson, read and edited in the same place.
 *
 * By default it renders exactly what a student sees — same header, same
 * contents rail, same `Markdown` renderer. `?edit=1` swaps the article for
 * the form, and saving comes straight back here, so a change is checked
 * against the real rendering the moment it is made.
 *
 * The form is a plain markdown textarea rather than a rich editor, because
 * the notes are markdown in the repository too — the same text renders in
 * both places, and a WYSIWYG that quietly rewrites it would make the import
 * a one-way trip.
 */
export default async function AdminLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const [{ id }, { edit }] = await Promise.all([params, searchParams]);
  const lesson = await getLesson(id);

  // Students and whoever is teaching read the same notes, so only a student
  // lesson is shown here. The old teaching modules are still in the table
  // but nothing reads them, and an id from one is simply not found.
  if (!lesson || lesson.audience !== "student") notFound();

  const editing = edit === "1";
  const href = `/admin/lessons/${lesson.id}`;

  const body = lesson.bodyMd
    ? stripLeadingHeading(lesson.bodyMd, lesson.title)
    : "";

  // Worked out here and handed to the rail, which lives in the layout and is
  // not re-rendered when you move between lessons.
  const toc = tocEntries(body);

  const status = (
    <span
      className={`rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
        lesson.isPublished
          ? "bg-leaf-wash text-leaf-deep"
          : "bg-mist text-ink-faint"
      }`}
    >
      {lesson.isPublished ? "Published" : "Draft"}
    </span>
  );

  const button =
    "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-semibold transition-colors";

  if (editing) {
    const field =
      "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-brand focus:outline-none";
    const label = "mb-2 block text-[0.8125rem] font-semibold text-ink";

    return (
      <article className="min-w-0 pb-16">
        <LessonToc entries={toc} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="eyebrow">Editing</p>
            {status}
          </div>
          <Link href={href} className={button}>
            <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden />
            Back to notes
          </Link>
        </div>

        <form action={updateLesson} className="card mt-4 p-6 sm:p-7">
          <input type="hidden" name="id" value={lesson.id} />

          <div>
            <label className={label} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={lesson.title}
              required
              className={field}
            />
          </div>

          <div className="mt-5">
            <label className={label} htmlFor="summary">
              Summary{" "}
              <span className="text-ink-faint font-normal">
                (the standfirst under the title)
              </span>
            </label>
            <input
              id="summary"
              name="summary"
              defaultValue={lesson.summary ?? ""}
              className={field}
            />
          </div>

          <div className="mt-5">
            <label className={label} htmlFor="body_md">
              Notes{" "}
              <span className="text-ink-faint font-normal">
                (markdown — GFM tables and fenced code render)
              </span>
            </label>
            <textarea
              id="body_md"
              name="body_md"
              defaultValue={lesson.bodyMd ?? ""}
              spellCheck={false}
              rows={30}
              className="border-line bg-night w-full resize-y rounded-xl border p-4 font-mono text-[0.8125rem] leading-[1.7] text-white/90 focus:outline-none"
            />
            <p className="text-ink-faint mt-2 text-[0.8125rem]">
              The page prints the title above already, so a note does not need
              to open with its own heading — a leading one is dropped when it
              renders.
            </p>
          </div>

          <div className="border-line-soft mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <label className="text-ink flex cursor-pointer items-center gap-3 text-[0.9375rem] font-medium">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={lesson.isPublished}
                className="check"
              />
              Published — visible to enrolled students
            </label>

            <div className="flex items-center gap-3">
              <Link
                href={href}
                className="text-ink-soft hover:text-ink px-3 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-ink hover:bg-brand-deep text-cta-fg rounded-full px-6 py-3 text-[0.9375rem] font-semibold transition-colors"
              >
                Save lesson
              </button>
            </div>
          </div>
        </form>
      </article>
    );
  }

  // The pager walks every lesson in the module, drafts included — the rail
  // beside it lists them too, and an admin opens all of them.
  const list = await db
    .select({ id: lessons.id, title: lessons.title })
    .from(lessons)
    .where(eq(lessons.moduleId, lesson.moduleId))
    .orderBy(asc(lessons.position));

  const index = list.findIndex((entry) => entry.id === lesson.id);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  return (
    <article className="min-w-0 pb-16">
      <LessonToc entries={toc} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        {status}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/lessons?new=1&module=${lesson.moduleSlug}`}
            className={button}
          >
            <Plus className="size-3.5" strokeWidth={2} aria-hidden />
            New lesson
          </Link>
          <Link href={`${href}?edit=1`} className={button}>
            <Pencil className="size-3.5" strokeWidth={2} aria-hidden />
            Edit
          </Link>
        </div>
      </div>

      <header className="border-brand/15 from-brand-wash/70 mt-4 rounded-2xl border bg-gradient-to-br to-transparent p-7 sm:p-9">
        <h1 className="display text-ink text-[2rem] sm:text-[2.5rem]">
          {lesson.title}
        </h1>
        {lesson.summary && <p className="lede mt-4">{lesson.summary}</p>}
      </header>

      <div className="mt-10">
        {body ? (
          <Markdown>{body}</Markdown>
        ) : (
          <p className="text-ink-faint text-[0.9375rem]">
            This lesson has no written notes yet.
          </p>
        )}
      </div>

      {(prev || next) && (
        <nav
          aria-label="Lessons"
          className="border-line mt-14 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:justify-between"
        >
          {prev ? (
            <IntentLink
              href={`/admin/lessons/${prev.id}`}
              className="card card-hover group flex items-center gap-3 p-4 sm:max-w-[48%]"
            >
              <ArrowLeft
                className="text-ink-faint size-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="text-brand-deep block text-[0.75rem] font-semibold">
                  Previous
                </span>
                <span className="text-ink block truncate text-[0.9375rem] font-semibold">
                  {prev.title}
                </span>
              </span>
            </IntentLink>
          ) : (
            <span />
          )}

          {next && (
            <IntentLink
              href={`/admin/lessons/${next.id}`}
              className="card card-hover group flex items-center gap-3 p-4 text-right sm:max-w-[48%]"
            >
              <span className="min-w-0 flex-1">
                <span className="text-brand-deep block text-[0.75rem] font-semibold">
                  Next
                </span>
                <span className="text-ink block truncate text-[0.9375rem] font-semibold">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                className="text-ink-faint size-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
            </IntentLink>
          )}
        </nav>
      )}
    </article>
  );
}
