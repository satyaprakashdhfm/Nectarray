import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { PageHead } from "@/components/admin/Business";
import { DEVOPS_PROJECTS } from "@/lib/content/devops";

/**
 * DevOps: one card per project we run, each opening its architecture,
 * versions, deploy, data, cost and open items. Stack, System design and
 * General knowledge are the tabs beside it (devops/layout.tsx).
 */
export default function DevopsPage() {
  return (
    <>
      <PageHead
        title="DevOps"
        lede="Every project we run: how it is built, deployed, backed up and what it costs. Short on purpose; the long version is projects-architecture.md."
      />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DEVOPS_PROJECTS.map((project) => (
          <li key={project.id}>
            <Link
              href={`${ADMIN}/devops/projects/${project.id}`}
              className="card hover:border-brand block h-full p-5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-ink text-[0.9375rem] font-semibold">
                  {project.label}
                </p>
                <span className="bg-brand-wash text-brand-deep shrink-0 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold">
                  {project.status}
                </span>
              </div>
              <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-relaxed">
                {project.blurb}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                {project.facts.map((fact) => (
                  <div key={fact.label} className="min-w-0">
                    <dt className="text-ink-faint text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-ink truncate text-[0.8125rem] font-medium">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
