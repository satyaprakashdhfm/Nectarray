import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { ChevronLeft, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { clientProjects, quotations } from "@/lib/db/schema";
import { StatusPill } from "@/components/admin/Business";
import { ProjectWorkspace } from "@/components/admin/ProjectWorkspace";
import { num, rupees, serviceLabel } from "@/lib/business";
import { loadProjectSheets } from "@/lib/project-data";
import { points } from "@/lib/quote-html";
import { cleanBody, serviceTab } from "@/lib/quotes";
import { vaultReady } from "@/lib/vault";

export const dynamic = "force-dynamic";

const day = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * One client project: the quotation it was agreed on, where it stands, its
 * deployment links, and the handover sheet that goes to the client.
 */
export default async function AdminProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [project] = await db
    .select()
    .from(clientProjects)
    .where(eq(clientProjects.id, id));
  if (!project) notFound();

  const [quotes, sheets] = await Promise.all([
    db
      .select()
      .from(quotations)
      .where(sql`${quotations.projectIds} @> ${JSON.stringify([id])}::jsonb`)
      .limit(1)
      .catch(() => []),
    loadProjectSheets(id),
  ]);
  const quote = quotes[0];
  const agreed = quote ? cleanBody(quote.body) : null;
  const tab = serviceTab(project.service);

  return (
    <>
      <Link
        href={`/admin/services/${tab}`}
        className="text-ink-soft hover:text-ink inline-flex items-center gap-1 text-[0.8125rem] font-semibold"
      >
        <ChevronLeft className="size-4" aria-hidden />
        {serviceLabel(tab)} projects
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="display text-ink text-[1.6rem] sm:text-[2rem]">
          {project.title}
        </h1>
        <StatusPill status={project.status} />
      </div>
      <p className="text-ink-soft mt-1 text-[0.875rem]">
        {project.client} · {serviceLabel(project.service)}
        {project.value ? ` · ${rupees.format(num(project.value))}` : ""}
      </p>

      <section className="card mt-6 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-ink text-[1.0625rem] font-semibold">
              Agreed at the start
            </h2>
            <p className="text-ink-faint mt-0.5 text-[0.75rem]">
              {quote
                ? `Quotation ${quote.number}, ${day(quote.quoteDate)}`
                : "This project was not made from a quotation."}
            </p>
          </div>
          {quote && (
            <Link
              href={`/admin/quotes/${quote.id}`}
              className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold transition-colors"
            >
              <FileText className="size-3.5" aria-hidden />
              Open the quotation
            </Link>
          )}
        </div>
        {quote && agreed ? (
          <div className="mt-4 grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <dl className="bg-mist grid grid-cols-2 gap-3 self-start rounded-xl p-3 lg:grid-cols-1">
              <div>
                <dt className="text-ink-faint text-[0.75rem]">One-time</dt>
                <dd className="display text-ink text-[1.25rem] tabular-nums">
                  {rupees.format(num(quote.onceTotal))}
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint text-[0.75rem]">Monthly</dt>
                <dd className="display text-ink text-[1.25rem] tabular-nums">
                  {rupees.format(num(quote.monthlyTotal))}
                </dd>
              </div>
            </dl>
            <div className="min-w-0 space-y-4">
              <div>
                <p className="text-ink-faint mb-1.5 text-[0.75rem] font-semibold">
                  Services agreed
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {agreed.lines
                    .filter((l) => l.on)
                    .map((l) => (
                      <li
                        key={l.id}
                        className="bg-brand-wash text-brand-deep rounded-full px-2.5 py-1 text-[0.75rem] font-semibold"
                      >
                        {l.name}
                      </li>
                    ))}
                </ul>
              </div>
              {points(agreed.doc.understanding).length > 0 && (
                <div>
                  <p className="text-ink-faint mb-1.5 text-[0.75rem] font-semibold">
                    Our understanding
                  </p>
                  <ul className="text-ink-soft list-disc space-y-1 pl-5 text-[0.8125rem] leading-relaxed">
                    {points(agreed.doc.understanding).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          project.note && (
            <p className="text-ink-soft mt-3 text-[0.875rem]">{project.note}</p>
          )
        )}
      </section>

      <ProjectWorkspace
        projectId={id}
        status={project.status}
        initial={sheets}
        vaultReady={vaultReady()}
      />
    </>
  );
}
