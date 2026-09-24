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
import { PageHead, Section, Stat } from "@/components/admin/Business";
import { NewProjectForm, ProjectsTable } from "@/components/admin/Projects";
import { SERVICES, TAB_SERVICES, rupees } from "@/lib/business";
import { loadMoney, totals } from "@/lib/business-data";

export const dynamic = "force-dynamic";

const LEDE: Record<string, string> = {
  marketing: "Ads, SEO and content work for clients.",
  software:
    "Websites, web apps, stores and dashboards for clients — including Software + AI jobs.",
  ai: "Chatbots, RAG and agents built for clients — including Software + AI jobs.",
};

/**
 * One service's work: what it has earned, what is owed, and every project
 * from first conversation to delivered. Software + AI jobs show on both the
 * Software and the Agentic AI tab.
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: id } = await params;
  const recorded = TAB_SERVICES[id];
  const service = SERVICES.find((s) => s.id === id);
  if (!recorded || !service) notFound();

  const money = await loadMoney();
  const t = totals(money, recorded);
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

  const leads = campaigns.reduce((n, c) => n + c.leads, 0);
  const adSpend = totals(money, [service.id]).adSpend;

  return (
    <>
      <PageHead title={service.label} lede={LEDE[service.id]} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        <ProjectsTable
          projects={t.projects}
          payments={payments}
          paidByProject={money.paidByProject}
          showService={recorded.length > 1}
        />
      </Section>

      <Section title="New project">
        <NewProjectForm service={service.id} />
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
              campaigns · {rupees.format(adSpend)} spent · {leads} leads
            </p>
          </Link>
        </div>
      </Section>
    </>
  );
}
