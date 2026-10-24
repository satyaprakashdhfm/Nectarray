import { PageHead } from "@/components/admin/Business";
import { Block } from "@/components/admin/MarketingNotes";
import type { DevopsPage } from "@/lib/content/devops";
import type { NoteSection } from "@/lib/content/marketing-notes";

/**
 * A jump list of the sections, then the sections themselves: one column on
 * a phone, two to a row from 1280px so a wide screen is not half empty.
 * Diagrams and other `wide` sections take the whole row. The jump list
 * sticks under the header, so any section is one click away while reading.
 *
 * Each section is a size container: its term boxes go three across only
 * when the section itself is wide enough, not when the screen is.
 */
export function NoteSections({ sections }: { sections: NoteSection[] }) {
  return (
    <>
      <nav
        aria-label="On this page"
        className="bg-mist/90 border-line sticky top-[72px] z-10 -mx-4 mt-6 border-b px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0"
      >
        <ul className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="text-ink-soft hover:bg-surface hover:text-ink block rounded-full px-3 py-1 text-[0.8125rem] font-semibold transition-colors"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 grid gap-x-10 gap-y-12 xl:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`@container min-w-0 scroll-mt-32 ${section.wide ? "xl:col-span-2" : ""}`}
          >
            <h2 className="text-ink border-line flex items-center gap-2.5 border-t pt-5 text-[1.125rem] font-semibold">
              <span className="bg-brand h-4 w-1 rounded-full" aria-hidden />
              {section.title}
            </h2>
            <div className="mt-4 space-y-4">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

/** Stack, System design and General knowledge: a title and its sections. */
export function DevopsNotesPage({ page }: { page: DevopsPage }) {
  return (
    <>
      <PageHead title={page.title} lede={page.lede} />
      <NoteSections sections={page.sections} />
    </>
  );
}
