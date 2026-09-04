import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { createClient, getViewer } from "@/lib/supabase/server";

type Lesson = {
  id: string;
  day_label: string;
  title: string;
  summary: string | null;
  position: number;
};
type Module = {
  id: string;
  title: string;
  slug: string;
  position: number;
  lessons: Lesson[];
};

export default async function NotesPage() {
  const { enrolment } = await getViewer();
  const status = enrolment?.status ?? "none";
  if (status !== "enrolled" && status !== "completed") {
    return <EnrolmentPanel status={status} />;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("modules")
    .select(
      "id, title, slug, position, lessons(id, day_label, title, summary, position)",
    )
    .order("position");

  const modules = (data ?? []) as Module[];
  const total = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Notes &amp; curriculum
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        Written notes with runnable examples and real output — every query was
        executed before it was written down. {total} published so far; the rest
        open as each day is taught.
      </p>

      <div className="mt-8 space-y-8">
        {modules.map((module) => (
          <section key={module.id}>
            <h2 className="eyebrow">{module.title}</h2>

            {module.lessons.length === 0 ? (
              <div className="card mt-4 p-6">
                <p className="text-ink-faint text-[0.9375rem]">
                  Nothing published in this module yet.
                </p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {[...module.lessons]
                  .sort((a, b) => a.position - b.position)
                  .map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/dashboard/notes/${lesson.id}`}
                        className="card card-hover group flex items-start gap-5 p-5 sm:p-6"
                      >
                        <span className="bg-brand-wash text-brand-deep grid size-10 shrink-0 place-items-center rounded-xl">
                          <BookOpen
                            className="size-[1.125rem]"
                            strokeWidth={1.9}
                            aria-hidden
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="text-ink-faint font-mono text-[0.75rem]">
                            {lesson.day_label}
                          </span>
                          <span className="text-ink mt-1 block text-[1.0625rem] font-semibold">
                            {lesson.title}
                          </span>
                          {lesson.summary && (
                            <span className="text-ink-soft mt-1.5 block text-[0.9rem] leading-relaxed">
                              {lesson.summary}
                            </span>
                          )}
                        </span>

                        <ArrowRight
                          className="text-ink-faint group-hover:text-brand-deep mt-1 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
