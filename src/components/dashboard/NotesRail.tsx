"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { TocEntry } from "@/lib/toc";
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
export function NotesRail({
  modules,
  toc,
}: {
  modules: RailModule[];
  toc: TocEntry[];
}) {
  const pathname = usePathname();
  const params = useSearchParams();

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
              {module.short}
            </Link>
          ))}
        </div>
      )}

      {active && (
        <>
          <p className="eyebrow mt-6 mb-3">{active.title}</p>
          <ul className="border-line-soft space-y-0.5 border-l">
            {active.lessons.map((lesson) => {
              const href = `/dashboard/notes/${lesson.id}`;
              const current = lesson.id === lessonId;
              return (
                <li key={lesson.id}>
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "-ml-px flex flex-col border-l-2 py-2 pl-4 transition-colors",
                      current
                        ? "border-brand text-ink bg-brand-wash/40 rounded-r-md"
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

                  {/* The open lesson's sections, one level in. */}
                  {current && toc.length > 1 && (
                    <ul className="border-line-soft mt-1 mb-2 ml-4 border-l">
                      {toc.map((entry, i) => (
                        <li key={`${entry.id}-${i}`}>
                          <a
                            href={`#${entry.id}`}
                            className={cn(
                              "text-ink-soft hover:border-brand hover:text-ink -ml-px block border-l-2 border-transparent py-[0.3rem] text-[0.8125rem] leading-snug transition-colors",
                              entry.level === 2 ? "pl-7" : "pl-4",
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
