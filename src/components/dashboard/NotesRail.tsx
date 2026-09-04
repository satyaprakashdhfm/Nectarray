"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLessonToc } from "@/components/dashboard/lesson-toc";
import { cn } from "@/lib/utils";

export type RailLesson = {
  id: string;
  title: string;
  position: number;
};
export type RailModule = {
  id: string;
  slug: string;
  title: string;
  short: string;
  position: number;
  lessons: RailLesson[];
};

/**
 * The document rail: course tabs on top, that course's lessons beneath, and
 * the open lesson's own sections nested under it.
 *
 * All navigation on one side. A left rail plus a right "on this page" column
 * squeezes the prose into the middle third of a desktop screen and asks the
 * reader to track two indexes at once; the lessons and the sections of the
 * lesson you are in are the same kind of thing, one level apart, so they
 * belong in one tree.
 *
 * Which course is open follows the lesson you are reading, so arriving from
 * a link never leaves the rail pointing somewhere else.
 */
export function NotesRail({ modules }: { modules: RailModule[] }) {
  const pathname = usePathname();
  const params = useSearchParams();

  // Published by the lesson page, because this component's layout does not
  // re-render when you move between lessons. See lesson-toc.tsx.
  const toc = useLessonToc();

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
    <div className="lg:border-line lg:sticky lg:top-[125px] lg:h-[calc(100vh-125px)] lg:overflow-y-auto lg:border-r lg:pr-5 lg:pb-16">
      {/* Course switch */}
      {modules.length > 1 && (
        <div
          role="tablist"
          aria-label="Courses"
          className="border-line bg-mist flex gap-1 rounded-xl border p-1"
        >
          {modules.map((module) => {
            const current = module.slug === active?.slug;
            return (
              <Link
                key={module.slug}
                href={`/dashboard/notes?module=${module.slug}`}
                prefetch={false}
                role="tab"
                aria-selected={current}
                className={cn(
                  // The unselected tabs used to differ from the selected one
                  // by a hairline shadow, which on a light panel is no
                  // difference at all: you could not tell which course you
                  // were in without reading the lesson list.
                  "flex-1 rounded-lg px-2 py-2 text-center text-[0.8125rem] font-semibold transition-colors",
                  current
                    ? "bg-ink text-cta-fg shadow-sm"
                    : "text-ink-faint hover:bg-surface hover:text-ink",
                )}
              >
                {module.short}
              </Link>
            );
          })}
        </div>
      )}

      {active && (
        <>
          <p className="eyebrow mt-6 mb-3">{active.title}</p>
          <ul className="border-line-soft space-y-0.5 border-l">
            {active.lessons.map((lesson) => {
              const current = lesson.id === lessonId;
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/dashboard/notes/${lesson.id}`}
                    // Fourteen lessons in view meant fourteen speculative
                    // renders of a 40 KB page nobody asked for.
                    prefetch={false}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "-ml-px block border-l-2 py-2 pl-4 text-[0.875rem] leading-snug transition-colors",
                      current
                        ? "border-brand text-ink bg-brand-wash/40 rounded-r-md font-semibold"
                        : "text-ink-soft hover:border-line hover:text-ink border-transparent",
                    )}
                  >
                    {lesson.title}
                  </Link>

                  {/* The open lesson's sections, one level in. */}
                  {current && toc.length > 1 && (
                    <ul className="border-line-soft mt-1 mb-2 ml-4 border-l">
                      {toc.map((entry, i) => (
                        <li key={`${entry.id}-${i}`}>
                          <a
                            href={`#${entry.id}`}
                            className={cn(
                              "hover:border-brand hover:text-ink -ml-px block border-l-2 border-transparent leading-snug transition-colors",
                              entry.level === 1
                                ? "text-ink-soft py-[0.3rem] pl-4 text-[0.8125rem]"
                                : "text-ink-faint py-[0.25rem] pl-7 text-[0.75rem]",
                            )}
                          >
                            {entry.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
