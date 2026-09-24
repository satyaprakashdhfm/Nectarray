import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientPayments } from "@/lib/db/schema";
import { PageHead, Section, Stat, td, th } from "@/components/admin/Business";
import { NewProjectForm, ProjectsTable } from "@/components/admin/Projects";
import { PROJECT_SERVICES, rupees } from "@/lib/business";
import { lastMonths, loadMoney, totals } from "@/lib/business-data";

export const dynamic = "force-dynamic";

const IDS = PROJECT_SERVICES.map((s) => s.id);

/**
 * Every client project in one place — marketing, software, agentic AI and
 * the jobs that are software and AI together — with what came in each month
 * and in total. Each project also shows on its own service's tab; this is
 * the same record, not a copy.
 */
export default async function DevelopmentPage() {
  const [money, payments] = await Promise.all([
    loadMoney(),
    db.select().from(clientPayments).orderBy(desc(clientPayments.receivedOn)),
  ]);
  const t = totals(money, IDS);
  const months = lastMonths(
    money.receipts.filter((r) => r.service !== "academy"),
    12,
  ).reverse();
  const perService = PROJECT_SERVICES.map((s) => totals(money, [s.id]).all);

  return (
    <>
      <PageHead
        title="Projects"
        lede="All client work across Marketing, Software and Agentic AI — each project is also on its own service's tab."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="This month" value={rupees.format(t.month)} />
        <Stat label="Total received" value={rupees.format(t.all)} />
        <Stat label="Still owed" value={rupees.format(t.outstanding)} />
        <Stat
          label="Pipeline"
          value={rupees.format(t.pipeline)}
          hint="Leads and proposals"
        />
        <Stat label="Active projects" value={String(t.active)} />
      </div>

      <Section title="All projects">
        <ProjectsTable
          projects={t.projects}
          payments={payments}
          paidByProject={money.paidByProject}
          showService
        />
      </Section>

      <Section title="New project">
        <NewProjectForm />
      </Section>

      <Section title="Monthly">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left">
            <thead>
              <tr className="border-line-soft border-b">
                {[
                  "Month",
                  ...PROJECT_SERVICES.map((s) => s.label),
                  "Total",
                ].map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr
                  key={m.key}
                  className="border-line-soft border-b last:border-0"
                >
                  <td
                    className={`${td} text-ink font-semibold whitespace-nowrap`}
                  >
                    {m.longLabel}
                  </td>
                  {PROJECT_SERVICES.map((s) => {
                    const amount =
                      m.byService.find((x) => x.service === s.id)?.amount ?? 0;
                    return (
                      <td key={s.id} className={td}>
                        {amount ? rupees.format(amount) : "—"}
                      </td>
                    );
                  })}
                  <td className={`${td} text-ink font-semibold`}>
                    {m.total ? rupees.format(m.total) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-line border-t-2">
                <td className={`${td} text-ink font-semibold`}>All time</td>
                {perService.map((amount, i) => (
                  <td key={IDS[i]} className={`${td} text-ink font-semibold`}>
                    {rupees.format(amount)}
                  </td>
                ))}
                <td className={`${td} text-ink font-bold`}>
                  {rupees.format(t.all)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>
    </>
  );
}
