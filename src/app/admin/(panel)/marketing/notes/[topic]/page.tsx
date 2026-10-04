import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHead } from "@/components/admin/Business";
import {
  Block,
  SetupBoxes,
  SourceLinks,
} from "@/components/admin/MarketingNotes";
import { MARKETING_NOTES, noteTopic } from "@/lib/content/marketing-notes";

/**
 * One marketing topic: the connect / fill / get boxes, a jump list of its
 * sections, the sections themselves and the docs it came from. A strip of
 * the other topics sits at the top so moving between them takes one click.
 */
export default async function MarketingNoteTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: id } = await params;
  const topic = noteTopic(id);
  if (!topic) notFound();

  return (
    <>
      <Link
        href="/admin/marketing/notes"
        className="text-ink-soft hover:text-ink mb-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        All notes
      </Link>

      <ul className="tab-bar mb-6" aria-label="Topics">
        {MARKETING_NOTES.map((t) => (
          <li key={t.id}>
            <Link
              href={`/admin/marketing/notes/${t.id}`}
              aria-current={t.id === topic.id ? "page" : undefined}
              className="tab"
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>

      <PageHead title={topic.label} lede={topic.blurb} />
      <SetupBoxes topic={topic} />

      <nav
        aria-label="On this page"
        className="mt-8 flex flex-wrap gap-x-4 gap-y-1"
      >
        {topic.sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-brand-deep hover:text-brand text-[0.8125rem] font-semibold"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {topic.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mt-10 scroll-mt-24"
        >
          <h2 className="text-ink text-[1.125rem] font-semibold">
            {section.title}
          </h2>
          <div className="mt-3 space-y-4">
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-10">
        <h2 className="eyebrow">Official docs</h2>
        <div className="mt-3">
          <SourceLinks links={topic.links} />
        </div>
      </section>
    </>
  );
}
