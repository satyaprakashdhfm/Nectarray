import { createClient } from "@/lib/supabase/server";

export default async function AdminLessonsPage() {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select(
      "id, title, position, lessons(id, day_label, title, is_published, position)",
    )
    .order("position");

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Lessons
      </h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem]">
        Notes are imported from the course repositories. Unpublished lessons are
        invisible to students, whatever their enrolment status.
      </p>

      <div className="mt-8 space-y-8">
        {(modules ?? []).map((module) => (
          <section key={module.id}>
            <h2 className="eyebrow">{module.title}</h2>
            <div className="card mt-4 overflow-hidden">
              {module.lessons.length === 0 ? (
                <p className="text-ink-faint p-6 text-[0.9375rem]">
                  No lessons imported yet.
                </p>
              ) : (
                <ul>
                  {module.lessons
                    .sort((a, b) => a.position - b.position)
                    .map((lesson) => (
                      <li
                        key={lesson.id}
                        className="border-line-soft flex items-center justify-between gap-4 border-b p-5 last:border-0"
                      >
                        <span className="min-w-0">
                          <span className="text-ink-faint font-mono text-[0.8125rem]">
                            {lesson.day_label}
                          </span>
                          <span className="text-ink ml-3 text-[0.9375rem] font-semibold">
                            {lesson.title}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                            lesson.is_published
                              ? "bg-leaf-wash text-leaf-deep"
                              : "bg-mist text-ink-faint"
                          }`}
                        >
                          {lesson.is_published ? "published" : "draft"}
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
