"use client";

import { usePathname } from "next/navigation";
import { IntentLink } from "@/components/dashboard/IntentLink";
import { useLessonToc } from "@/components/dashboard/lesson-toc";
import { cn } from "@/lib/utils";

export type RailSubject = {
  slug: string;
  short: string;
  title: string;
  sections: { title: string; notes: { id: string; title: string }[] }[];
};

/**
 * The Knowledge base's rail: subject tabs on top, that subject's notes in
 * their folders beneath, and the open note's own sections under it — the
 * same one-tree layout as the academy notes (NotesRail), with one level
 * more, because the archive is nested (AI › Machine learning › Regression).
 *
 * The subject follows the URL, so arriving from a link never leaves the
 * rail pointing somewhere else.
 */
export function KnowledgeRail({
  subjects,
  basePath,
  stickyTop = "88px",
}: {
  subjects: RailSubject[];
  basePath: string;
  stickyTop?: string;
}) {
  const pathname = usePathname();
  const toc = useLessonToc();

  const rest = pathname.startsWith(`${basePath}/`)
    ? decodeURIComponent(pathname.slice(basePath.length + 1))
    : "";
  const active = subjects.find(
    (subject) => rest === subject.slug || rest.startsWith(`${subject.slug}/`),
  );
  const noteId = active && rest !== active.slug ? rest : null;

  return (
    <div
      style={{ "--rail-top": stickyTop } as React.CSSProperties}
      className="lg:border-line lg:sticky lg:top-[var(--rail-top)] lg:h-[calc(100vh-var(--rail-top))] lg:overflow-y-auto lg:border-r lg:pr-5 lg:pb-16"
    >
      <div
        role="tablist"
        aria-label="Subjects"
        className="tab-bar tab-bar-wrap w-full"
      >
        <IntentLink
          href={basePath}
          role="tab"
          aria-selected={!active}
          aria-current={!active ? "page" : undefined}
          className="tab grow basis-[calc(50%-0.125rem)] justify-center px-2 text-[0.8125rem]"
        >
          All subjects
        </IntentLink>
        {subjects.map((subject) => {
          const current = subject.slug === active?.slug;
          return (
            <IntentLink
              key={subject.slug}
              href={`${basePath}/${subject.slug}`}
              role="tab"
              aria-selected={current}
              aria-current={current ? "page" : undefined}
              title={subject.title}
              className="tab grow basis-[calc(50%-0.125rem)] justify-center px-2 text-[0.8125rem]"
            >
              {subject.short}
            </IntentLink>
          );
        })}
      </div>

      {active && (
        <>
          <p className="eyebrow mt-6 mb-3">{active.title}</p>
          {active.sections.map((section) => (
            <div key={section.title} className="mb-4">
              {section.title !== active.title && (
                <p className="text-ink-faint mb-1.5 text-[0.75rem] font-semibold">
                  {section.title}
                </p>
              )}
              <ul className="border-line-soft space-y-0.5 border-l">
                {section.notes.map((note) => {
                  const current = note.id === noteId;
                  return (
                    <li key={note.id}>
                      <IntentLink
                        href={`${basePath}/${note.id}`}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "-ml-px block rounded-r-md border-l-2 py-1.5 pl-4 text-[0.875rem] leading-snug transition-colors duration-200",
                          current
                            ? "border-brand text-ink bg-brand-wash/40 font-semibold"
                            : "text-ink-soft hover:border-brand/40 hover:text-ink hover:bg-brand-wash/30 border-transparent",
                        )}
                      >
                        {note.title}
                      </IntentLink>

                      {current && toc.length > 1 && (
                        <ul className="border-line-soft mt-1 mb-2 ml-4 max-h-[50vh] overflow-y-auto border-l">
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
            </div>
          ))}
        </>
      )}
    </div>
  );
}
