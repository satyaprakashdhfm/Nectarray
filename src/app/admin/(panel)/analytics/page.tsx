import { ADMIN } from "@/lib/admin-path";
import {
  ConnectionStrip,
  PageHead,
  Section,
  ServiceFilter,
} from "@/components/admin/Business";
import { AnalyticsReport } from "@/components/admin/AnalyticsReport";
import { LiveVisitors } from "@/components/admin/LiveVisitors";
import {
  DAYS,
  getAnalytics,
  getOwnRecords,
  getRealtime,
} from "@/lib/analytics-report";
import { isService } from "@/lib/business";

export const dynamic = "force-dynamic";

/**
 * Everyone who opened the site, whatever brought them, from GA4, with the
 * sign-ins and enquiries from our own tables beside it. Ad campaigns have
 * their own tab.
 */
export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: wanted } = await searchParams;
  const service = wanted && isService(wanted) ? wanted : null;

  const [report, own, live] = await Promise.all([
    getAnalytics(service),
    getOwnRecords(),
    getRealtime(),
  ]);

  return (
    <>
      <PageHead
        title="Analytics"
        lede={`Everyone who opened the site, whatever brought them: Google, Instagram, WhatsApp, an ad, or typing the address. Last ${DAYS} days.`}
      />
      <ConnectionStrip ids={["analytics"]} />

      <Section title="On the site right now">
        <p className="text-ink-soft -mt-1 mb-3 text-[0.8125rem]">
          People with the site open in the last 30 minutes, from Google
          Analytics. Updates every minute.
        </p>
        <LiveVisitors initial={live} />
      </Section>

      <ServiceFilter basePath={`${ADMIN}/analytics`} current={service} />
      <AnalyticsReport result={report} own={own} filtered={Boolean(service)} />
    </>
  );
}
