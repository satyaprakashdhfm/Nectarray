import Link from "next/link";
import { IntentLink } from "@/components/dashboard/IntentLink";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { LessonToc } from "@/components/dashboard/lesson-toc";
import { Markdown } from "@/components/dashboard/Markdown";
import {
  getLesson,
  publishedSiblings,
  stripLeadingHeading,
} from "@/lib/lessons";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, modules } from "@/lib/db/schema";
import { tocEntries } from "@/lib/toc";

export const dynamic = "force-dynamic";

/**
 * The teaching notes, read the way a student reads theirs — same header,
 * same contents rail, same `Markdown` renderer — but pulling the full
 * admin-audience lesson instead of the short student one, and with no form
 * on the page. This route is deliberately read-only: teaching content is
 * written at the source, not edited by clicking around here, so there is
 * nothing to accidentally save over.
 */
export default async function TeachingLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Side by side: the list is found through the lesson's id, so it does not
  // have to wait for the lesson.
  const [lesson, list] = await Promise.all([
    getLesson(id),
    publishedSiblings(id),
  ]);

  // A missing lesson and a student one are the same answer here: this route
  // only ever shows teaching content.
  if (!lesson || lesson.audience !== "admin" || !lesson.isPublished) notFound();

  const index = list.findIndex((entry) => entry.id === lesson.id);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  const body = lesson.bodyMd
    ? stripLeadingHeading(lesson.bodyMd, lesson.title)
    : "";

  const toc = tocEntries(body);

  // The student module this one mirrors, if any — same pairing convention
  // as the editor's tabs: "<slug>-teaching" reads back to "<slug>", and the
  // corresponding short lesson shares this one's position.
  const [studentLesson] = await db
    .select({ id: lessons.id })
    .from(lessons)
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .where(
      and(
        eq(modules.slug, lesson.moduleSlug.replace(/-teaching$/, "")),
        eq(lessons.position, lesson.position),
      ),
    )
    .limit(1);

  return (
    <article className="min-w-0 pb-16">
      <LessonToc entries={toc} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          href="/admin/teaching"
          className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors lg:hidden"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
          All teaching notes
        </Link>
        {studentLesson && (
          <Link
            href={`/admin/lessons/${studentLesson.id}`}
            className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-semibold transition-colors"
          >
            <Pencil className="size-3.5" strokeWidth={2} aria-hidden />
            Edit student lesson
          </Link>
        )}
      </div>

      <header className="border-line mt-4 border-b pb-8">
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
              href={`/admin/teaching/${prev.id}`}
              className="card card-hover group flex items-center gap-3 p-4 sm:max-w-[48%]"
            >
              <ArrowLeft
                className="text-ink-faint size-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="text-ink-faint block text-[0.75rem]">
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
              href={`/admin/teaching/${next.id}`}
              className="card card-hover group flex items-center gap-3 p-4 text-right sm:max-w-[48%]"
            >
              <span className="min-w-0 flex-1">
                <span className="text-ink-faint block text-[0.75rem]">
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
