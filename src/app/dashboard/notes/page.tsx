import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { getViewer } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function NotesPage() {
  const { enrolment } = await getViewer();
  const status = enrolment?.status ?? "none";
  if (status !== "enrolled" && status !== "completed") {
    return <EnrolmentPanel status={status} />;
  }

  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select(
      "id, title, slug, position, lessons(id, day_label, title, summary, position)",
    )
    .order("position");

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Notes &amp; curriculum
      </h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem]">
        Written notes with runnable examples. Each day&rsquo;s assignment lives
        inside its lesson.
      </p>

      <div className="mt-8 space-y-8">
        {(modules ?? []).map((module) => (
          <section key={module.id}>
            <h2 className="eyebrow">{module.title}</h2>
            <div className="card mt-4 overflow-hidden">
              {module.lessons.length === 0 ? (
                <p className="text-ink-faint p-6 text-[0.9375rem]">
                  No lessons published in this module yet.
                </p>
              ) : (
                <ul>
                  {module.lessons
                    .sort((a, b) => a.position - b.position)
                    .map((lesson) => (
                      <li
                        key={lesson.id}
                        className="border-line-soft grid gap-1 border-b p-5 last:border-0 sm:grid-cols-[7rem_1fr] sm:gap-6"
                      >
                        <span className="text-ink-faint pt-0.5 font-mono text-[0.8125rem]">
                          {lesson.day_label}
                        </span>
                        <span>
                          <span className="text-ink block text-[0.9375rem] font-semibold">
                            {lesson.title}
                          </span>
                          {lesson.summary && (
                            <span className="text-ink-soft mt-1 block text-[0.9rem] leading-relaxed">
                              {lesson.summary}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
