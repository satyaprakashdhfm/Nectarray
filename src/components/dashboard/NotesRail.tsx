"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type RailLesson = {
  id: string;
  day_label: string;
  title: string;
  position: number;
};
export type RailModule = {
  id: string;
  slug: string;
  title: string;
  position: number;
  lessons: RailLesson[];
};

/**
 * The document rail: module tabs on top, that module's lessons beneath.
 *
 * Python and SQL are separated rather than listed one after the other,
 * because they are two courses that happen to share a dashboard. Showing 23
 * lessons in one column buries the one you want.
 *
 * Which module is open follows the lesson you are reading, so arriving from
 * a link never leaves the rail pointing somewhere else.
 */
export function NotesRail({ modules }: { modules: RailModule[] }) {
  const pathname = usePathname();
  const params = useSearchParams();

  /*
   * Which module is open is derived, never stored. On a lesson it is
   * whichever module owns that lesson, so a link from anywhere lands with
   * the correct rail; on the index it is the ?module= tab, defaulting to the
   * first. A layout cannot read either of these on the server, which is why
   * this lives in the rail rather than being passed down.
   */
  const lessonId = pathname.startsWith("/dashboard/notes/")
    ? pathname.slice("/dashboard/notes/".length)
    : null;

  const active =
    (lessonId
      ? modules.find((module) =>
          module.lessons.some((lesson) => lesson.id === lessonId),
        )
      : modules.find((module) => module.slug === params.get("module"))) ??
    modules[0];

  return (
    <div className="lg:border-line lg:sticky lg:top-[125px] lg:h-[calc(100vh-125px)] lg:overflow-y-auto lg:border-r lg:pr-6">
      {/* Module switch */}
      <div className="border-line bg-mist flex gap-1 rounded-xl border p-1">
        {modules.map((module) => (
          <Link
            key={module.slug}
            href={`/dashboard/notes?module=${module.slug}`}
            aria-current={module.slug === active?.slug ? "true" : undefined}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-center text-[0.875rem] font-medium transition-colors",
              module.slug === active?.slug
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {module.slug === "python" ? "Python" : "SQL"}
          </Link>
        ))}
      </div>

      {active && (
        <>
          <p className="eyebrow mt-7 mb-3">{active.title}</p>
          <ul className="border-line-soft space-y-0.5 border-l">
            {active.lessons.map((lesson) => {
              const href = `/dashboard/notes/${lesson.id}`;
              const current = pathname === href;
              return (
                <li key={lesson.id}>
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "-ml-px flex flex-col border-l-2 py-2 pl-4 transition-colors",
                      current
                        ? "border-brand text-ink"
                        : "text-ink-soft hover:border-line hover:text-ink border-transparent",
                    )}
                  >
                    <span className="text-ink-faint font-mono text-[0.6875rem]">
                      {lesson.day_label}
                    </span>
                    <span className="text-[0.875rem] leading-snug font-medium">
                      {lesson.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
