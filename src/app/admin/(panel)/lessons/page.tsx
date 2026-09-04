import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { createLesson } from "../actions";
import { createClient } from "@/lib/supabase/server";

type Lesson = {
  id: string;
  day_label: string;
  title: string;
  is_published: boolean;
  position: number;
  body_md: string | null;
};

export default async function AdminLessonsPage() {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select(
      "id, title, position, lessons(id, day_label, title, is_published, position, body_md)",
    )
    .order("position");

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink focus:border-brand focus:outline-none";

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Lessons
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        Notes are imported from the course repositories, and editable here
        afterwards. Unpublished lessons are invisible to students, whatever
        their enrolment status.
      </p>

      {/* New lesson ------------------------------------------------------ */}
      <form action={createLesson} className="card mt-8 p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_2fr_auto] sm:items-end">
          <div>
            <label
              className="text-ink mb-2 block text-[0.8125rem] font-semibold"
              htmlFor="new-module"
            >
              Module
            </label>
            <select id="new-module" name="module_id" className={field}>
              {(modules ?? []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-ink mb-2 block text-[0.8125rem] font-semibold"
              htmlFor="new-day"
            >
              Day
            </label>
            <input
              id="new-day"
              name="day_label"
              placeholder="Day 12"
              className={`${field} sm:w-28`}
            />
          </div>
          <div>
            <label
              className="text-ink mb-2 block text-[0.8125rem] font-semibold"
              htmlFor="new-title"
            >
              Title
            </label>
            <input
              id="new-title"
              name="title"
              placeholder="Decorators and closures"
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

      <div className="mt-8 space-y-8">
        {(modules ?? []).map((module) => (
          <section key={module.id}>
            <h2 className="eyebrow">{module.title}</h2>
            <div className="card mt-4 overflow-hidden">
              {module.lessons.length === 0 ? (
                <p className="text-ink-faint p-6 text-[0.9375rem]">
                  No lessons in this module yet.
                </p>
              ) : (
                <ul>
                  {(module.lessons as Lesson[])
                    .sort((a, b) => a.position - b.position)
                    .map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/admin/lessons/${lesson.id}`}
                          className="border-line-soft hover:bg-mist flex items-center justify-between gap-4 border-b p-5 transition-colors last:border-0"
                        >
                          <span className="min-w-0">
                            <span className="text-ink-faint font-mono text-[0.8125rem]">
                              {lesson.day_label}
                            </span>
                            <span className="text-ink ml-3 text-[0.9375rem] font-semibold">
                              {lesson.title}
                            </span>
                            <span className="text-ink-faint ml-3 text-[0.8125rem]">
                              {lesson.body_md
                                ? `${Math.round(lesson.body_md.length / 1000)} KB`
                                : "empty"}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                                lesson.is_published
                                  ? "bg-leaf-wash text-leaf-deep"
                                  : "bg-mist text-ink-faint"
                              }`}
                            >
                              {lesson.is_published ? "published" : "draft"}
                            </span>
                            <Pencil
                              className="text-ink-faint size-4"
                              strokeWidth={2}
                              aria-hidden
                            />
                          </span>
                        </Link>
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
