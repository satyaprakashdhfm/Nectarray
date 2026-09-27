import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adCampaigns } from "@/lib/db/schema";
import {
  ConnectionStrip,
  Empty,
  PageHead,
  Section,
  ServiceFilter,
  ServiceSelect,
  Stat,
  deleteButton,
  field,
  primaryButton,
  quietButton,
  td,
  th,
} from "@/components/admin/Business";
import {
  CAMPAIGN_STATUSES,
  PLATFORMS,
  SERVICES,
  isService,
  num,
  platformLabel,
  rupees,
  serviceLabel,
} from "@/lib/business";
import { TrafficPanel } from "@/components/admin/SiteStats";
import { getTraffic } from "@/lib/site-stats";
import {
  addCampaign,
  deleteCampaign,
  updateCampaign,
} from "../business-actions";

export const dynamic = "force-dynamic";

/**
 * Paid ads and site traffic, for all services or one.
 *
 * Traffic is read live from GA4, for the whole site or the pages under
 * one service's path. Campaign figures are typed in until the Google Ads and
 * Meta APIs are connected.
 */
export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: wanted } = await searchParams;
  const service = wanted && isService(wanted) ? wanted : null;

  const [campaigns, traffic] = await Promise.all([
    db
      .select()
      .from(adCampaigns)
      .where(service ? eq(adCampaigns.service, service) : undefined)
      .orderBy(desc(adCampaigns.createdAt)),
    getTraffic(service),
  ]);

  const spend = campaigns.reduce((t, c) => t + num(c.spend), 0);
  const clicks = campaigns.reduce((n, c) => n + c.clicks, 0);
  const leads = campaigns.reduce((n, c) => n + c.leads, 0);

  return (
    <>
      <PageHead
        title="Ads & Analytics"
        lede="The traffic each service's pages get, from Google Analytics, and what the ads cost and brought in."
      />
      <ConnectionStrip ids={["analytics", "googleAds", "metaAds"]} />
      <ServiceFilter basePath="/admin/analytics" current={service} />

      <Section
        title="Traffic"
        aside={
          <span className="text-ink-faint text-[0.75rem]">
            {service
              ? `Pages under ${SERVICES.find((x) => x.id === service)!.path}`
              : "Whole site"}
          </span>
        }
      >
        <TrafficPanel result={traffic} filtered={Boolean(service)} />
      </Section>

      <Section title="Campaigns">
        <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Stat label="Ad spend" value={rupees.format(spend)} />
          <Stat label="Clicks" value={clicks.toLocaleString("en-IN")} />
          <Stat label="Leads" value={leads.toLocaleString("en-IN")} />
          <Stat
            label="Cost per lead"
            value={leads ? rupees.format(spend / leads) : "—"}
          />
        </div>

        {campaigns.length === 0 ? (
          <Empty>No campaigns yet.</Empty>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[58rem] text-left">
              <thead>
                <tr className="border-line-soft border-b">
                  {[
                    "Campaign",
                    "Service",
                    "Status, spend, clicks, leads",
                    "Cost per lead",
                    "",
                  ].map((h) => (
                    <th key={h} className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="border-line-soft border-b last:border-0"
                  >
                    <td className={td}>
                      <span className="text-ink block font-semibold">
                        {c.name}
                      </span>
                      <span className="text-ink-faint block text-[0.75rem]">
                        {platformLabel(c.platform)}
                      </span>
                    </td>
                    <td className={td}>{serviceLabel(c.service)}</td>
                    <td className={td}>
                      <form
                        action={updateCampaign}
                        className="flex flex-wrap items-center gap-1.5"
                      >
                        <input type="hidden" name="id" value={c.id} />
                        <select
                          name="status"
                          defaultValue={c.status}
                          className={`${field} w-24 capitalize`}
                        >
                          {CAMPAIGN_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <input
                          name="spend"
                          aria-label="Spend"
                          defaultValue={num(c.spend)}
                          className={`${field} w-24`}
                        />
                        <input
                          name="clicks"
                          aria-label="Clicks"
                          defaultValue={c.clicks}
                          className={`${field} w-20`}
                        />
                        <input
                          name="leads"
                          aria-label="Leads"
                          defaultValue={c.leads}
                          className={`${field} w-16`}
                        />
                        <button className={quietButton}>Save</button>
                      </form>
                    </td>
                    <td className={`${td} text-ink font-semibold`}>
                      {c.leads ? rupees.format(num(c.spend) / c.leads) : "—"}
                    </td>
                    <td className={td}>
                      <form action={deleteCampaign}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className={deleteButton}>Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form
          action={addCampaign}
          className="card mt-4 grid gap-3 p-5 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_0.8fr_0.8fr_auto] lg:items-end"
        >
          <label className="block">
            <span className="eyebrow">Campaign</span>
            <input name="name" required className={`${field} mt-1`} />
          </label>
          <ServiceSelect current={service} />
          <label className="block">
            <span className="eyebrow">Platform</span>
            <select name="platform" className={`${field} mt-1`}>
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow">Spend (₹)</span>
            <input
              name="spend"
              inputMode="decimal"
              className={`${field} mt-1`}
            />
          </label>
          <label className="block">
            <span className="eyebrow">Clicks</span>
            <input
              name="clicks"
              inputMode="numeric"
              className={`${field} mt-1`}
            />
          </label>
          <label className="block">
            <span className="eyebrow">Leads</span>
            <input
              name="leads"
              inputMode="numeric"
              className={`${field} mt-1`}
            />
          </label>
          <button className={primaryButton}>Add campaign</button>
        </form>
      </Section>
    </>
  );
}
