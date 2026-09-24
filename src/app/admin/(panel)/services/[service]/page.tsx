import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adCampaigns,
  blogPosts,
  clientPayments,
  seoKeywords,
} from "@/lib/db/schema";
import {
  Empty,
  PageHead,
  Section,
  Stat,
  StatusPill,
  deleteButton,
  field,
  primaryButton,
  quietButton,
  td,
  th,
} from "@/components/admin/Business";
import {
  PROJECT_SERVICES,
  PROJECT_STATUSES,
  num,
  rupees,
  type ServiceId,
} from "@/lib/business";
import { loadMoney, totals } from "@/lib/business-data";
import {
  addPayment,
  createProject,
  deletePayment,
  deleteProject,
  setProjectStatus,
} from "../../business-actions";

export const dynamic = "force-dynamic";

const LEDE: Record<string, string> = {
  marketing: "Ads, SEO and content work for clients.",
  software: "Websites, web apps, stores and dashboards for clients.",
  ai: "Chatbots, RAG and agents built for clients.",
};

const day = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/**
 * One service's work: what it has earned, what is owed, and every project
 * from first conversation to delivered.
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: id } = await params;
  const service = PROJECT_SERVICES.find((s) => s.id === id);
  if (!service) notFound();

  const money = await loadMoney();
  const t = totals(money, service.id as ServiceId);
  const projectIds = t.projects.map((p) => p.id);

  const [payments, keywords, posts, campaigns] = await Promise.all([
    projectIds.length
      ? db
          .select()
          .from(clientPayments)
          .where(inArray(clientPayments.projectId, projectIds))
          .orderBy(desc(clientPayments.receivedOn))
      : Promise.resolve([]),
    db
      .select({ id: seoKeywords.id })
      .from(seoKeywords)
      .where(eq(seoKeywords.service, service.id)),
    db
      .select({ status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.service, service.id)),
    db
      .select({ leads: adCampaigns.leads, status: adCampaigns.status })
      .from(adCampaigns)
      .where(eq(adCampaigns.service, service.id)),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const leads = campaigns.reduce((n, c) => n + c.leads, 0);

  return (
    <>
      <PageHead title={service.label} lede={LEDE[service.id]} />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="This month" value={rupees.format(t.month)} />
        <Stat label="All time" value={rupees.format(t.all)} />
        <Stat label="Still owed" value={rupees.format(t.outstanding)} />
        <Stat
          label="Pipeline"
          value={rupees.format(t.pipeline)}
          hint="Leads and proposals"
        />
        <Stat label="Active projects" value={String(t.active)} />
      </div>

      <Section title="Projects">
        {t.projects.length === 0 ? (
          <Empty>No projects yet. Add the first one below.</Empty>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[64rem] text-left">
              <thead>
                <tr className="border-line-soft border-b">
                  {[
                    "Project",
                    "Status",
                    "Dates",
                    "Value",
                    "Received",
                    "Payments",
                    "",
                  ].map((h) => (
                    <th key={h} className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.projects.map((p) => {
                  const paid = money.paidByProject.get(p.id) ?? 0;
                  const owed = Math.max(0, num(p.value) - paid);
                  const mine = payments.filter((x) => x.projectId === p.id);
                  return (
                    <tr
                      key={p.id}
                      className="border-line-soft border-b last:border-0"
                    >
                      <td className={td}>
                        <span className="text-ink block text-[0.9375rem] font-semibold">
                          {p.title}
                        </span>
                        <span className="block">{p.client}</span>
                        {p.note && (
                          <span className="text-ink-faint mt-1 block max-w-xs text-[0.75rem]">
                            {p.note}
                          </span>
                        )}
                      </td>
                      <td className={td}>
                        <StatusPill status={p.status} />
                        <form
                          action={setProjectStatus}
                          className="mt-2 flex gap-1.5"
                        >
                          <input type="hidden" name="id" value={p.id} />
                          <select
                            name="status"
                            defaultValue={p.status}
                            className={field}
                          >
                            {PROJECT_STATUSES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button className={quietButton}>Set</button>
                        </form>
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        <span className="block">Start {day(p.startsOn)}</span>
                        <span
                          className={`block ${
                            p.dueOn && p.dueOn < today && p.status === "active"
                              ? "text-danger font-semibold"
                              : ""
                          }`}
                        >
                          Due {day(p.dueOn)}
                        </span>
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        {p.value ? rupees.format(num(p.value)) : "—"}
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        <span className="text-ink block font-semibold">
                          {rupees.format(paid)}
                        </span>
                        {owed > 0 && (
                          <span className="text-amber-deep block text-[0.75rem]">
                            {rupees.format(owed)} owed
                          </span>
                        )}
                      </td>
                      <td className={td}>
                        {mine.length > 0 && (
                          <ul className="mb-2 space-y-1">
                            {mine.map((x) => (
                              <li
                                key={x.id}
                                className="flex items-center gap-2 whitespace-nowrap"
                              >
                                <span className="text-ink">
                                  {rupees.format(num(x.amount))}
                                </span>
                                <span className="text-ink-faint text-[0.75rem]">
                                  {day(x.receivedOn)}
                                  {x.ref && ` · ${x.ref}`}
                                </span>
                                <form action={deletePayment}>
                                  <input type="hidden" name="id" value={x.id} />
                                  <button
                                    className={deleteButton}
                                    aria-label="Remove payment"
                                  >
                                    ×
                                  </button>
                                </form>
                              </li>
                            ))}
                          </ul>
                        )}
                        <form
                          action={addPayment}
                          className="grid grid-cols-[6rem_8.5rem_auto] gap-1.5"
                        >
                          <input type="hidden" name="project_id" value={p.id} />
                          <input
                            name="amount"
                            inputMode="decimal"
                            placeholder="₹ amount"
                            required
                            className={field}
                          />
                          <input
                            name="received_on"
                            type="date"
                            defaultValue={today}
                            required
                            className={field}
                          />
                          <button className={quietButton}>Add</button>
                          <input
                            name="ref"
                            placeholder="Reference (optional)"
                            className={`${field} col-span-2`}
                          />
                        </form>
                      </td>
                      <td className={td}>
                        <details>
                          <summary
                            className={`${deleteButton} cursor-pointer list-none`}
                          >
                            Delete
                          </summary>
                          <form action={deleteProject} className="mt-2">
                            <input type="hidden" name="id" value={p.id} />
                            <button className="text-danger text-[0.75rem] font-semibold whitespace-nowrap">
                              Yes, delete with its payments
                            </button>
                          </form>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="New project">
        <form
          action={createProject}
          className="card grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <input type="hidden" name="service" value={service.id} />
          <label className="block">
            <span className="eyebrow">Client</span>
            <input name="client" required className={`${field} mt-1`} />
          </label>
          <label className="block lg:col-span-2">
            <span className="eyebrow">Project</span>
            <input name="title" required className={`${field} mt-1`} />
          </label>
          <label className="block">
            <span className="eyebrow">Status</span>
            <select
              name="status"
              defaultValue="lead"
              className={`${field} mt-1`}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow">Value (₹)</span>
            <input
              name="value"
              inputMode="decimal"
              className={`${field} mt-1`}
            />
          </label>
          <label className="block">
            <span className="eyebrow">Starts</span>
            <input name="starts_on" type="date" className={`${field} mt-1`} />
          </label>
          <label className="block">
            <span className="eyebrow">Due</span>
            <input name="due_on" type="date" className={`${field} mt-1`} />
          </label>
          <label className="block">
            <span className="eyebrow">Note</span>
            <input name="note" className={`${field} mt-1`} />
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <button className={primaryButton}>Add project</button>
          </div>
        </form>
      </Section>

      <Section title="Search and ads">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href={`/admin/seo?service=${service.id}`}
            className="card hover:border-brand block p-5 transition-colors"
          >
            <p className="eyebrow">SEO</p>
            <p className="text-ink mt-1.5 text-[0.9375rem]">
              {keywords.length} keywords tracked ·{" "}
              {posts.filter((p) => p.status === "published").length} of{" "}
              {posts.length} blog posts published
            </p>
          </Link>
          <Link
            href={`/admin/analytics?service=${service.id}`}
            className="card hover:border-brand block p-5 transition-colors"
          >
            <p className="eyebrow">Ads</p>
            <p className="text-ink mt-1.5 text-[0.9375rem]">
              {campaigns.filter((c) => c.status === "active").length} active
              campaigns · {rupees.format(t.adSpend)} spent · {leads} leads
            </p>
          </Link>
        </div>
      </Section>
    </>
  );
}
