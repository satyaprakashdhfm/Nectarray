import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { Markdown } from "@/components/dashboard/Markdown";
import { Toc } from "@/components/dashboard/Toc";
import { createClient, getViewer } from "@/lib/supabase/server";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { enrolment } = await getViewer();
  const status = enrolment?.status ?? "none";
  if (status !== "enrolled" && status !== "completed") {
    return <EnrolmentPanel status={status} />;
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, module_id, day_label, title, summary, body_md, position")
    .eq("id", id)
    .maybeSingle();

  // RLS returns nothing rather than refusing, so "not visible to you" and
  // "does not exist" arrive the same way — 404 is the honest answer to both.
  if (!lesson) notFound();

  // Neighbours for the prev/next pager, within the same module.
  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, title, position")
    .eq("module_id", lesson.module_id)
    .order("position");

  const list = siblings ?? [];
  const index = list.findIndex((entry) => entry.id === lesson.id);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  return (
    <div className="grid min-w-0 gap-10 xl:grid-cols-[1fr_14rem]">
      <article className="min-w-0">
        <header className="border-line border-b pb-8">
          <p className="text-ink-faint font-mono text-[0.8125rem]">
            {lesson.day_label}
          </p>
          <h1 className="display text-ink mt-2 text-[2rem] sm:text-[2.5rem]">
            {lesson.title}
          </h1>
          {lesson.summary && <p className="lede mt-4">{lesson.summary}</p>}
        </header>

        <div className="mt-10">
          {lesson.body_md ? (
            <Markdown>{lesson.body_md}</Markdown>
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
                  <span className="text-ink-faint block text-[0.75rem]">
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
              </Link>
            )}
          </nav>
        )}
      </article>

      <Toc source={lesson.body_md ?? ""} />
    </div>
  );
}
