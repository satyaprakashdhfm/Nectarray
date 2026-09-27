import "server-only";
import { SERVICES, type ServiceId } from "@/lib/business";
import {
  daysAgo,
  ga4Reports,
  searchConsole,
  type Ga4Report,
  type Result,
  type SearchRow,
} from "@/lib/google";

/** Both panels cover the same window, so their numbers can be compared. */
export const WINDOW_DAYS = 28;

const pathOf = (service: ServiceId | null) =>
  service ? SERVICES.find((s) => s.id === service)!.path : null;

// ---------------------------------------------------------------------------
//  Traffic, from GA4
// ---------------------------------------------------------------------------

export type Traffic = {
  visitors: number;
  sessions: number;
  views: number;
  /** Seconds. */
  avgSession: number;
  daily: { date: string; sessions: number }[];
  sources: { name: string; sessions: number }[];
  pages: { path: string; views: number; visitors: number }[];
  /** Page views per service, by the path its pages live under. */
  byService: { id: ServiceId; label: string; views: number }[];
};

const n = (row: NonNullable<Ga4Report["rows"]>[number], i: number) =>
  Number(row.metricValues?.[i]?.value ?? 0);
const dim = (row: NonNullable<Ga4Report["rows"]>[number], i = 0) =>
  row.dimensionValues?.[i]?.value ?? "";

/**
 * The last four weeks of traffic, for the whole site or one service's pages.
 * One request, four reports.
 */
export async function getTraffic(
  service: ServiceId | null,
): Promise<Result<Traffic>> {
  const path = pathOf(service);
  const base = {
    dateRanges: [{ startDate: `${WINDOW_DAYS}daysAgo`, endDate: "today" }],
    ...(path && {
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "BEGINS_WITH", value: path },
        },
      },
    }),
  };

  const result = await ga4Reports([
    {
      ...base,
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
      ],
    },
    {
      ...base,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    },
    {
      ...base,
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    },
    {
      ...base,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 500,
    },
  ]);
  if (result.error !== undefined) return { error: result.error };

  const [totals, daily, sources, pages] = result.data.map((r) => r.rows ?? []);
  const total = totals[0];
  const allPages = pages.map((row) => ({
    path: dim(row),
    views: n(row, 0),
    visitors: n(row, 1),
  }));

  return {
    data: {
      visitors: total ? n(total, 0) : 0,
      sessions: total ? n(total, 1) : 0,
      views: total ? n(total, 2) : 0,
      avgSession: total ? n(total, 3) : 0,
      daily: daily.map((row) => ({ date: dim(row), sessions: n(row, 0) })),
      sources: sources.map((row) => ({ name: dim(row), sessions: n(row, 0) })),
      pages: allPages.slice(0, 12),
      byService: SERVICES.map((s) => ({
        id: s.id,
        label: s.label,
        views: allPages
          .filter((p) => p.path.startsWith(s.path))
          .reduce((sum, p) => sum + p.views, 0),
      })),
    },
  };
}

// ---------------------------------------------------------------------------
//  Search, from Search Console
// ---------------------------------------------------------------------------

export type Search = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  queries: SearchRow[];
  pages: SearchRow[];
  /** Lower-cased query to its average position, for the tracked keywords. */
  positionOf: Map<string, number>;
};

/** The last four weeks of Google search, for the whole site or one service. */
export async function getSearch(
  service: ServiceId | null,
): Promise<Result<Search>> {
  const path = pathOf(service);
  const base = {
    startDate: daysAgo(WINDOW_DAYS),
    endDate: daysAgo(0),
    ...(path && {
      dimensionFilterGroups: [
        {
          filters: [
            { dimension: "page", operator: "contains", expression: path },
          ],
        },
      ],
    }),
  };

  const [totals, queries, pages] = await Promise.all([
    searchConsole(base),
    searchConsole({ ...base, dimensions: ["query"], rowLimit: 1000 }),
    searchConsole({ ...base, dimensions: ["page"], rowLimit: 15 }),
  ]);
  const failed = [totals, queries, pages].find((r) => r.error !== undefined);
  if (failed?.error !== undefined) return { error: failed.error };

  const total = totals.data![0];
  return {
    data: {
      clicks: total?.clicks ?? 0,
      impressions: total?.impressions ?? 0,
      ctr: total?.ctr ?? 0,
      position: total?.position ?? 0,
      queries: queries.data!.slice(0, 20),
      pages: pages.data!,
      positionOf: new Map(
        queries.data!.map((row) => [
          (row.keys?.[0] ?? "").toLowerCase(),
          row.position,
        ]),
      ),
    },
  };
}
