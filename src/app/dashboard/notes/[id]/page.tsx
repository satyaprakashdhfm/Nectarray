import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { LessonToc } from "@/components/dashboard/lesson-toc";
import { Markdown } from "@/components/dashboard/Markdown";
import {
  getLesson,
  releasedLessonIds,
  stripLeadingHeading,
} from "@/lib/lessons";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { getAccess } from "@/lib/auth/access";
import { tocEntries } from "@/lib/toc";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { active, status, enrolment } = await getAccess();
  if (!active) return <EnrolmentPanel status={status} />;

  const { id } = await params;

  const lesson = await getLesson(id);

  // A missing lesson and a teacher-only one are the same answer here: the
  // student has no business knowing the difference.
  // Unpublished is the same answer again: a draft is not a lesson yet.
  if (!lesson || lesson.audience !== "student" || !lesson.isPublished)
    notFound();

  /*
   * The lock, enforced where the body would otherwise be read.
   *
   * The rail already declines to link a locked lesson, but the rail is a
   * convenience and this is the gate: typing the id into the address bar has
   * to hit the same answer. Told plainly rather than 404ed, because the title
   * is listed either way and pretending it does not exist would only be
   * confusing.
   */
  const released = await releasedLessonIds(enrolment?.cohortId);
  if (!released.has(lesson.id)) {
    return (
      <article className="min-w-0 pb-16">
        <div className="card mt-4 flex flex-col items-center p-10 text-center">
          <span className="bg-mist text-ink-faint grid size-14 place-items-center rounded-full">
            <Lock className="size-6" strokeWidth={2} aria-hidden />
          </span>
          <h1 className="display text-ink mt-5 text-[1.5rem]">
            {lesson.title}
          </h1>
          <p className="text-ink-soft mt-3 max-w-prose text-[0.9375rem] leading-relaxed">
            These notes open once this topic has been taught. Everything covered
            so far is in the rail beside you.
          </p>
        </div>
      </article>
    );
  }

  // Neighbours for the prev/next pager, within the same module. Locked ones
  // are dropped rather than shown: a pager is a door, and this one would
  // offer to walk the student straight into a topic they cannot read.
  const list = (
    await db
      .select({ id: lessons.id, title: lessons.title })
      .from(lessons)
      .where(
        and(
          eq(lessons.moduleId, lesson.moduleId),
          eq(lessons.isPublished, true),
        ),
      )
      .orderBy(asc(lessons.position))
  ).filter((entry) => released.has(entry.id));

  const index = list.findIndex((entry) => entry.id === lesson.id);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  const body = lesson.bodyMd
    ? stripLeadingHeading(lesson.bodyMd, lesson.title)
    : "";

  /*
   * The contents are worked out here, beside the body they describe, and
   * handed to the rail in the layout. The layout cannot do it itself: it is
   * not re-rendered when you move from one lesson to the next.
   */
  const toc = tocEntries(body);

  return (
    <article className="min-w-0 pb-16">
      <LessonToc entries={toc} />

      {/*
       * The tint lives here rather than behind the whole article. A wash
       * under two thousand words of prose is a wash you stop seeing by the
       * second paragraph, and it costs contrast the whole way down; on the
       * title it does the one job colour is good for, which is telling you
       * where the piece begins.
       */}
      <header className="border-brand/15 from-brand-wash/70 rounded-2xl border bg-gradient-to-br to-transparent p-7 sm:p-9">
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
            <Link
              href={`/dashboard/notes/${prev.id}`}
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
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={`/dashboard/notes/${next.id}`}
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
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
