import Link from "next/link";
import { PageHead } from "@/components/admin/Business";
import { MARKETING_NOTES, NOTE_GROUPS } from "@/lib/content/marketing-notes";

/**
 * Marketing notes: one card per tool or idea, grouped into research and
 * search, measuring, paid and reach. Each opens its own page.
 */
export default function MarketingNotesPage() {
  return (
    <>
      <PageHead
        title="Marketing notes"
        lede="How each tool is connected, what goes into it and what comes out, written from the official docs. Admin only."
      />
      {NOTE_GROUPS.map((group) => (
        <section key={group} className="mt-8">
          <h2 className="text-ink text-[1.125rem] font-semibold">{group}</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MARKETING_NOTES.filter((t) => t.group === group).map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/admin/marketing/notes/${topic.id}`}
                  className="card hover:border-brand block h-full p-5 transition-colors"
                >
                  <p className="text-ink text-[0.9375rem] font-semibold">
                    {topic.label}
                  </p>
                  <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-relaxed">
                    {topic.blurb}
                  </p>
                  <p className="text-ink-faint mt-3 text-[0.75rem]">
                    {topic.sections.map((s) => s.title).join(" · ")}
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
