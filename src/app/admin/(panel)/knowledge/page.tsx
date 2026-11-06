import Link from "next/link";
import { PageHead } from "@/components/admin/Business";
import { adminPage } from "@/lib/auth/access";
import { KB_BASE, knowledgeIndex } from "@/lib/knowledge";

/**
 * The Knowledge base's front door: one card per subject, with how much is
 * in it. A subject opens its own page; the rail beside lists every note.
 */
export default async function KnowledgeIndexPage() {
  await adminPage();
  const subjects = await knowledgeIndex();
  const total = subjects.reduce(
    (sum, s) => sum + s.sections.reduce((n, sec) => n + sec.notes.length, 0),
    0,
  );

  return (
    <>
      <PageHead
        title="Knowledge base"
        lede={`Every notebook, image, code project and file from the old NOTES repository, by subject — ${total} notes in ${subjects.length} subjects. Admin only, and separate from the Academy's notes.`}
      />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => {
          const notes = subject.sections.flatMap((s) => s.notes);
          const notebooks = notes.filter((n) => n.kind === "notebook").length;
          return (
            <li key={subject.slug}>
              <Link
                href={`${KB_BASE}/${subject.slug}`}
                className="card hover:border-brand block h-full p-5 transition-colors"
              >
                <p className="text-ink text-[0.9375rem] font-semibold">
                  {subject.title}
                </p>
                <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-relaxed">
                  {subject.blurb}
                </p>
                <p className="text-ink-faint mt-3 text-[0.75rem]">
                  {notes.length} {notes.length === 1 ? "note" : "notes"} ·{" "}
                  {notebooks} {notebooks === 1 ? "notebook" : "notebooks"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
