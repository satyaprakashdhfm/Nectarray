import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHead } from "@/components/admin/Business";
import { IntentLink } from "@/components/dashboard/IntentLink";
import { LessonToc } from "@/components/dashboard/lesson-toc";
import { Markdown } from "@/components/dashboard/Markdown";
import { adminPage } from "@/lib/auth/access";
import { KB_BASE, knowledgeNote, knowledgeSubject } from "@/lib/knowledge";
import { stripLeadingHeading } from "@/lib/lessons";
import { tocEntries } from "@/lib/toc";

const KIND: Record<string, string> = {
  note: "Notes",
  text: "Notes",
  files: "Files",
  project: "Code project",
};

/**
 * One subject (`/knowledge/ai`) or one note (`/knowledge/ai/…`).
 *
 * A note reads exactly like an academy lesson — same header, same contents
 * rail, same renderer, code and its output as one card with tabs — with
 * math typeset (Markdown's rich mode). The notebooks these were made from
 * stay in the repository as a backup and are never served here.
 */
export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  await adminPage();
  const { slug } = await params;
  const id = slug.map((part) => decodeURIComponent(part)).join("/");

  if (slug.length === 1) {
    const subject = await knowledgeSubject(id);
    if (!subject) notFound();
    return (
      <>
        <PageHead title={subject.title} lede={subject.blurb} />
        {subject.sections.map((section) => (
          <section key={section.title} className="mt-8">
            <h2 className="text-ink text-[1.0625rem] font-semibold">
              {section.title}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {section.notes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`${KB_BASE}/${note.id}`}
                    className="card hover:border-brand block h-full p-4 transition-colors"
                  >
                    <p className="text-ink text-[0.9375rem] font-semibold">
                      {note.title}
                    </p>
                    <p className="text-ink-faint mt-1 text-[0.75rem]">
                      {KIND[note.kind] ?? "Notes"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </>
    );
  }

  const found = await knowledgeNote(id);
  if (!found) notFound();
  const { subject, section, note, prev, next } = found;
  // The header already prints the title; a notebook's own opening "# Naive
  // Bayes" would only say it twice. Same rule as the academy lessons.
  const body = stripLeadingHeading(found.body, note.title);
  const toc = tocEntries(body);

  const button =
    "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-semibold transition-colors";

  return (
    <article className="min-w-0 pb-16">
      <LessonToc entries={toc} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow">
          {section.title === subject.title
            ? subject.title
            : `${subject.title} › ${section.title}`}
        </p>
      </div>

      <header className="border-brand/15 from-brand-wash/70 mt-4 rounded-2xl border bg-gradient-to-br to-transparent p-7 sm:p-9">
        <h1 className="display text-ink text-[2rem] sm:text-[2.5rem]">
          {note.title}
        </h1>
      </header>

      <div className="kb-note mt-10">
        {body.trim() ? (
          <Markdown rich>{body}</Markdown>
        ) : (
          <p className="text-ink-faint text-[0.9375rem]">
            This note is empty in the archive.
          </p>
        )}
      </div>

      {(prev || next) && (
        <nav
          aria-label="Notes"
          className="border-line mt-14 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:justify-between"
        >
          {prev ? (
            <IntentLink
              href={`${KB_BASE}/${prev.id}`}
              className="card card-hover group flex items-center gap-3 p-4 sm:max-w-[48%]"
            >
              <ArrowLeft className="text-ink-faint size-4 shrink-0" strokeWidth={2} aria-hidden />
              <span className="min-w-0">
                <span className="text-brand-deep block text-[0.75rem] font-semibold">
                  Previous
                </span>
                <span className="text-ink block truncate text-[0.9375rem] font-semibold">
                  {prev.title}
                </span>
              </span>
            </IntentLink>
          ) : (
            <span />
          )}
          {next && (
            <IntentLink
              href={`${KB_BASE}/${next.id}`}
              className="card card-hover group flex items-center gap-3 p-4 text-right sm:max-w-[48%]"
            >
              <span className="min-w-0 flex-1">
                <span className="text-brand-deep block text-[0.75rem] font-semibold">
                  Next
                </span>
                <span className="text-ink block truncate text-[0.9375rem] font-semibold">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="text-ink-faint size-4 shrink-0" strokeWidth={2} aria-hidden />
            </IntentLink>
          )}
        </nav>
      )}
    </article>
  );
}
