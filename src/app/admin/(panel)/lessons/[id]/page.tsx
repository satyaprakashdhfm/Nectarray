import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { updateLesson } from "../../actions";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, modules } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

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
 * The lesson editor.
 *
 * A plain markdown textarea rather than a rich editor, because the notes are
 * markdown in the repository too — the same text renders in both places, and
 * a WYSIWYG that quietly rewrites it would make the import a one-way trip.
 */
export default async function AdminLessonEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // One join rather than a lookup and then a second lookup for its module.
  const [row] = await db
    .select({
      id: lessons.id,
      day_label: lessons.dayLabel,
      title: lessons.title,
      summary: lessons.summary,
      body_md: lessons.bodyMd,
      is_published: lessons.isPublished,
      position: lessons.position,
      moduleTitle: modules.title,
      moduleSlug: modules.slug,
      audience: modules.audience,
    })
    .from(lessons)
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .where(eq(lessons.id, id))
    .limit(1);

  if (!row) notFound();

  const lesson = row;

  /*
   * The same day's content lives twice — a short student lesson and a full
   * teaching one — as two separate rows in two separate modules, paired only
   * by sharing a position. "<slug>" and "<slug>-teaching" is the pairing
   * convention those modules were created with; a module outside that
   * convention (Agentic AI, Placement) simply has no counterpart, and the
   * tabs below don't render.
   */
  const siblingSlug =
    lesson.audience === "student"
      ? `${lesson.moduleSlug}-teaching`
      : lesson.moduleSlug.replace(/-teaching$/, "");

  const [siblingModule] =
    siblingSlug === lesson.moduleSlug
      ? []
      : await db
          .select({ id: modules.id })
          .from(modules)
          .where(eq(modules.slug, siblingSlug))
          .limit(1);

  const [siblingLesson] = siblingModule
    ? await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(
          and(
            eq(lessons.moduleId, siblingModule.id),
            eq(lessons.position, lesson.position),
          ),
        )
        .limit(1)
    : [];

  const tabs = siblingLesson
    ? lesson.audience === "student"
      ? [
          { href: `/admin/lessons/${siblingLesson.id}`, label: "Teacher Notes", active: false },
          { href: `/admin/lessons/${lesson.id}`, label: "Student Lesson", active: true },
        ]
      : [
          { href: `/admin/lessons/${lesson.id}`, label: "Teacher Notes", active: true },
          { href: `/admin/lessons/${siblingLesson.id}`, label: "Student Lesson", active: false },
        ]
    : null;

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-brand focus:outline-none";
  const label = "mb-2 block text-[0.8125rem] font-semibold text-ink";

  return (
    <>
      <Link
        href="/admin/lessons"
        className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        All lessons
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{row.moduleTitle ?? "Lesson"}</p>
          <h1 className="display text-ink mt-1 text-[1.875rem]">
            {lesson.title}
          </h1>
        </div>
        {lesson.is_published && (
          <Link
            href={`/dashboard/notes/${lesson.id}`}
            target="_blank"
            className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-semibold transition-colors"
          >
            View as student
            <ExternalLink className="size-3.5" strokeWidth={2} aria-hidden />
          </Link>
        )}
      </div>

      {tabs && (
        <div className="mt-6">
          <nav
            aria-label="Notes version"
            className="border-line bg-surface inline-flex gap-1 rounded-full border p-1"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={tab.active ? "page" : undefined}
                className={cn(
                  "inline-flex rounded-full px-4 py-1.5 text-[0.875rem] font-medium transition-colors",
                  tab.active
                    ? "bg-ink text-cta-fg"
                    : "text-ink-soft hover:bg-mist hover:text-ink",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <p className="text-ink-faint mt-2 text-[0.8125rem]">
            Teacher Notes is the full version, for preparing to teach the
            class. Student Lesson is the short version enrolled students
            actually see — they are two separate rows, each saved on its own.
          </p>
        </div>
      )}

      <form action={updateLesson} className="card mt-6 p-6 sm:p-7">
        <input type="hidden" name="id" value={lesson.id} />

        <div className="grid gap-5 sm:grid-cols-[8rem_1fr]">
          <div>
            <label className={label} htmlFor="day_label">
              Day
            </label>
            <input
              id="day_label"
              name="day_label"
              defaultValue={lesson.day_label}
              className={field}
            />
          </div>
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
            defaultValue={lesson.body_md ?? ""}
            spellCheck={false}
            rows={30}
            className="border-line bg-night w-full resize-y rounded-xl border p-4 font-mono text-[0.8125rem] leading-[1.7] text-white/90 focus:outline-none"
          />
          <p className="text-ink-faint mt-2 text-[0.8125rem]">
            The page prints the title above already, so a note does not need to
            open with its own heading — a leading one is dropped when it
            renders.
          </p>
        </div>

        <div className="border-line-soft mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <label className="text-ink flex cursor-pointer items-center gap-3 text-[0.9375rem] font-medium">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={lesson.is_published}
              className="check"
            />
            Published — visible to enrolled students
          </label>

          <button
            type="submit"
            className="bg-ink hover:bg-brand-deep text-cta-fg rounded-full px-6 py-3 text-[0.9375rem] font-semibold transition-colors"
          >
            Save lesson
          </button>
        </div>
      </form>
    </>
  );
}
