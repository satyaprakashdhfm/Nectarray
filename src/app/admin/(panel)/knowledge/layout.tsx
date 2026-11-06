import "katex/dist/katex.min.css";
import { Suspense } from "react";
import { KnowledgeRail } from "@/components/admin/KnowledgeRail";
import { adminPage } from "@/lib/auth/access";
import { KB_BASE, knowledgeIndex } from "@/lib/knowledge";

/**
 * The Knowledge base shell: the academy notes' rail-plus-article layout,
 * reading the archive in knowledge/ instead of the lessons table. Separate
 * from the Academy on purpose — this is the founder's own library (the old
 * NOTES repository, every notebook, image and file of it), not course
 * material, and no student route reads it.
 */
export default async function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await adminPage();
  const subjects = (await knowledgeIndex()).map((subject) => ({
    slug: subject.slug,
    short: subject.short,
    title: subject.title,
    sections: subject.sections.map((section) => ({
      title: section.title,
      notes: section.notes.map(({ id, title }) => ({ id, title })),
    })),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <Suspense fallback={<div />}>
        <KnowledgeRail subjects={subjects} basePath={KB_BASE} />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
