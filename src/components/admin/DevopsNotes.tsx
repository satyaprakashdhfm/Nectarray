import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Block } from "@/components/admin/MarketingNotes";
import type { EnvGroup, Risk } from "@/lib/content/devops-env";
import type { NoteSection } from "@/lib/content/marketing-notes";

/**
 * Sections two to a row from 1280px so a wide screen is not half empty;
 * diagrams and other `wide` sections take the whole row. Each section is a
 * size container: its term boxes go three across only when the section
 * itself is wide enough, not when the screen is.
 */
export function SectionGrid({ sections }: { sections: NoteSection[] }) {
  return (
    <div className="grid gap-x-10 gap-y-10 xl:grid-cols-2">
      {sections.map((section) => (
        <section
          key={section.id}
          className={`@container min-w-0 ${section.wide ? "xl:col-span-2" : ""}`}
        >
          <h3 className="text-ink flex items-center gap-2.5 text-[1rem] font-semibold">
            <span className="bg-brand h-4 w-1 rounded-full" aria-hidden />
            {section.title}
          </h3>
          <div className="mt-3 space-y-4">
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** One part of the DevOps page: an anchor, a heading, a line, its content. */
export function Part({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-line mt-14 scroll-mt-32 border-t pt-8">
      <h2 className="display text-ink text-[1.5rem]">{title}</h2>
      {lede && (
        <p className="text-ink-soft mt-1.5 max-w-3xl text-[0.875rem]">{lede}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const RISK: Record<Risk, { label: string; dot: string }> = {
  high: { label: "High: rotate at once if leaked", dot: "bg-danger" },
  medium: { label: "Medium: rotate soon if leaked", dot: "bg-amber" },
  low: { label: "Low: public or harmless", dot: "bg-leaf" },
};

export function RiskLegend() {
  return (
    <ul className="text-ink-faint flex flex-wrap gap-x-5 gap-y-1 text-[0.75rem]">
      {Object.values(RISK).map((r) => (
        <li key={r.label} className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${r.dot}`} aria-hidden />
          {r.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Every variable a project reads, grouped by service. Each is a dropdown:
 * closed it shows the name and what it is; open, where to get a value, the
 * dashboard to do it in, where we keep it and which file reads it.
 */
export function EnvList({ groups }: { groups: EnvGroup[] }) {
  return (
    <div className="grid gap-x-8 gap-y-8 xl:grid-cols-2">
      {groups.map((group) => (
        <div key={group.title} className="min-w-0">
          <h3 className="eyebrow">{group.title}</h3>
          <ul className="card divide-line mt-2.5 divide-y overflow-hidden">
            {group.vars.map((v) => (
              <li key={v.name}>
                <details className="group">
                  <summary className="hover:bg-surface flex cursor-pointer list-none items-start gap-3 px-4 py-3 transition-colors [&::-webkit-details-marker]:hidden">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${RISK[v.risk].dot}`}
                      title={RISK[v.risk].label}
                      aria-label={RISK[v.risk].label}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="text-ink block font-mono text-[0.75rem] font-semibold break-words">
                        {v.name}
                      </span>
                      <span className="text-ink-soft mt-0.5 block text-[0.8125rem] leading-snug">
                        {v.what}
                      </span>
                    </span>
                    <ChevronDown
                      className="text-ink-faint mt-1 size-4 shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <dl className="bg-canvas border-line grid gap-x-4 gap-y-2 border-t px-4 py-3 pl-9 text-[0.8125rem] sm:grid-cols-[6rem_minmax(0,1fr)]">
                    <dt className="text-ink-faint font-semibold">Get it</dt>
                    <dd className="text-ink-soft leading-relaxed">
                      {v.get}
                      {v.link && (
                        <Link
                          href={v.link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-deep hover:text-brand mt-1.5 flex w-fit items-center gap-1 font-semibold"
                        >
                          {v.link.label}
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </Link>
                      )}
                    </dd>
                    <dt className="text-ink-faint font-semibold">Stored</dt>
                    <dd className="text-ink-soft">{v.stored}</dd>
                    <dt className="text-ink-faint font-semibold">Read in</dt>
                    <dd className="text-ink-soft font-mono text-[0.75rem] break-words">
                      {v.code}
                    </dd>
                  </dl>
                </details>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
