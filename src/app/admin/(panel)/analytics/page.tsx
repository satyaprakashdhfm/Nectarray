import {
  ConnectionStrip,
  PageHead,
  Section,
  ServiceFilter,
} from "@/components/admin/Business";
import { SERVICES, isService } from "@/lib/business";
import { TrafficPanel } from "@/components/admin/SiteStats";
import { getTraffic } from "@/lib/site-stats";

export const dynamic = "force-dynamic";

/**
 * Site traffic from GA4, for the whole site or the pages under one service's
 * path. Ad campaigns have their own tab.
 */
export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: wanted } = await searchParams;
  const service = wanted && isService(wanted) ? wanted : null;

  const traffic = await getTraffic(service);

  return (
    <>
      <PageHead
        title="Analytics"
        lede="Visitors, where they came from and which pages they read, from Google Analytics."
      />
      <ConnectionStrip ids={["analytics"]} />
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
    </>
  );
}
