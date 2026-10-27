import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHead, Stat } from "@/components/admin/Business";
import {
  EnvList,
  Part,
  RiskLegend,
  SectionGrid,
} from "@/components/admin/DevopsNotes";
import {
  DEVOPS_DESIGN,
  DEVOPS_KNOWLEDGE,
  DEVOPS_PROJECTS,
  DEVOPS_STACK,
  devopsProject,
} from "@/lib/content/devops";
import { DEVOPS_ENV } from "@/lib/content/devops-env";
import { DEVOPS_UI } from "@/lib/content/devops-ui";
import { ProjectUi } from "@/components/admin/ProjectUi";

const PARTS = [
  { id: "project", label: "Project" },
  { id: "ui", label: "UI / UX" },
  { id: "env", label: "Environment variables" },
  { id: "stack", label: "Stack" },
  { id: "design", label: "System design" },
  { id: "knowledge", label: "General knowledge" },
];

/**
 * DevOps on one page. A bar under the header jumps between its parts: the
 * chosen project (UI / UX first, then architecture, versions, deploy, data,
 * cost, open items),
 * that project's environment variables, then the stack, system design and
 * general knowledge shared by all of them. The project is picked by tabs
 * (?project=), so a link can point straight at one.
 */
export default async function DevopsPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project: id } = await searchParams;
  const project = devopsProject(id ?? "") ?? DEVOPS_PROJECTS[0];
  const env = DEVOPS_ENV[project.id] ?? [];
  const envCount = env.reduce((n, g) => n + g.vars.length, 0);
  const ui = DEVOPS_UI[project.id];

  return (
    <>
      <PageHead
        title="DevOps"
        lede="Every project we run: how it is built, deployed and backed up, what it costs, where each key comes from, and what we are learning."
      />

      <nav
        aria-label="On this page"
        className="bg-mist/90 border-line sticky top-[72px] z-10 -mx-4 mt-6 border-b px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0"
      >
        <ul className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
          {PARTS.map((part) => (
            <li key={part.id} className="shrink-0">
              <a
                href={`#${part.id}`}
                className="text-ink-soft hover:bg-surface hover:text-ink block rounded-full px-3 py-1 text-[0.8125rem] font-semibold transition-colors"
              >
                {part.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="project" className="mt-6 scroll-mt-32">
        <ul className="tab-bar" aria-label="Projects">
          {DEVOPS_PROJECTS.map((p) => (
            <li key={p.id}>
              <Link
                href={`${ADMIN}/devops?project=${p.id}`}
                aria-current={p.id === project.id ? "page" : undefined}
                className="tab"
                scroll={false}
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h2 className="display text-ink text-[1.5rem]">{project.label}</h2>
            <p className="text-ink-soft mt-1 max-w-3xl text-[0.875rem]">
              {project.blurb}
            </p>
          </div>
          <p className="text-ink-faint flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem]">
            <span className="bg-brand-wash text-brand-deep rounded-full px-2.5 py-0.5 font-semibold">
              {project.status}
            </span>
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
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {project.facts.map((fact) => (
            <Stat key={fact.label} {...fact} />
          ))}
        </div>

        {ui && <ProjectUi ui={ui} />}

        <div className="mt-10">
          <SectionGrid sections={project.sections} />
        </div>
      </section>

      <Part
        id="env"
        title={`Environment variables · ${project.label}`}
        lede={`${envCount} entries. Open one to see where to get it, the dashboard, where we keep it and which file reads it. Names only, never values.`}
      >
        <RiskLegend />
        <div className="mt-5">
          <EnvList groups={env} />
        </div>
      </Part>

      <Part id="stack" title={DEVOPS_STACK.title} lede={DEVOPS_STACK.lede}>
        <SectionGrid sections={DEVOPS_STACK.sections} />
      </Part>

      <Part id="design" title={DEVOPS_DESIGN.title} lede={DEVOPS_DESIGN.lede}>
        <SectionGrid sections={DEVOPS_DESIGN.sections} />
      </Part>

      <Part
        id="knowledge"
        title={DEVOPS_KNOWLEDGE.title}
        lede={DEVOPS_KNOWLEDGE.lede}
      >
        <SectionGrid sections={DEVOPS_KNOWLEDGE.sections} />
      </Part>
    </>
  );
}
