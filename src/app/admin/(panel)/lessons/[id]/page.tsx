import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { updateLesson } from "../../actions";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, module_id, day_label, title, summary, body_md, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!lesson) notFound();

  const { data: module } = await supabase
    .from("modules")
    .select("title")
    .eq("id", lesson.module_id)
    .maybeSingle();

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
          <p className="eyebrow">{module?.title ?? "Lesson"}</p>
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
            open with its own heading — a leading one is dropped when it renders.
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
