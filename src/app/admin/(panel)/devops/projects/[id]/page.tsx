import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHead, Stat } from "@/components/admin/Business";
import { NoteSections } from "@/components/admin/DevopsNotes";
import { DEVOPS_PROJECTS, devopsProject } from "@/lib/content/devops";

/**
 * One project: four figures at a glance, then architecture, versions,
 * deploy, data, cost and what is still open. A strip of the other projects
 * sits at the top so moving between them takes one click.
 */
export default async function DevopsProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = devopsProject(id);
  if (!project) notFound();

  return (
    <>
      <Link
        href={`${ADMIN}/devops`}
        className="text-ink-soft hover:text-ink mb-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        All projects
      </Link>

      <ul className="tab-bar mb-6" aria-label="Projects">
        {DEVOPS_PROJECTS.map((p) => (
          <li key={p.id}>
            <Link
              href={`${ADMIN}/devops/projects/${p.id}`}
              aria-current={p.id === project.id ? "page" : undefined}
              className="tab"
            >
              {p.label}
            </Link>
          </li>
        ))}
      </ul>

      <PageHead title={project.label} lede={project.blurb} />
      <p className="text-ink-faint mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem]">
        <span>{project.status}</span>
        <span>{project.repo}</span>
        <span>Checked {project.checked}</span>
        {project.url && (
          <Link
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="text-brand-deep hover:text-brand inline-flex items-center gap-0.5 font-semibold"
          >
            {project.url.replace(/^https:\/\/(www\.)?/, "")}
            <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        )}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {project.facts.map((fact) => (
          <Stat key={fact.label} {...fact} />
        ))}
      </div>

      <NoteSections sections={project.sections} />
    </>
  );
}
