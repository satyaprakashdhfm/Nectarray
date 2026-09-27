import "server-only";
import { SERVICES, type ServiceId } from "@/lib/business";
import type { SeoPage } from "@/lib/content/seo-pages";
import { siteUrl } from "@/lib/seo";
import {
  daysAgo,
  ga4Reports,
  inspectUrl,
  searchConsole,
  searchConsoleBase,
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

// ---------------------------------------------------------------------------
//  Per page, for the SEO tab
// ---------------------------------------------------------------------------

export type Ranked = { query: string; position: number | null };

export type IndexState =
  | { state: "indexed"; crawled: string | null }
  | { state: "waiting" | "other" | "error"; label: string };

export type PageReport = {
  page: SeoPage;
  url: string;
  index: IndexState;
  main: Ranked;
  /** Average position across every search the page was shown for. */
  avgPosition: number | null;
  searches: number;
  impressions: number;
  clicks: number;
  also: Ranked[];
  /** The page's other top searches, by times shown, not already targeted. */
  extra: { query: string; position: number }[];
};

/** A Search Console page URL as a path: https://x.com/blog/a/ → /blog/a */
const pathKey = (url: string) => {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return url;
  }
};

function indexState(
  result: Awaited<ReturnType<typeof inspectUrl>>,
): IndexState {
  if (result.error !== undefined) {
    return { state: "error", label: "Could not check" };
  }
  const status = result.data.inspectionResult?.indexStatusResult;
  const coverage = (status?.coverageState ?? "").toLowerCase();
  if (status?.verdict === "PASS" || coverage.includes("indexed, not")) {
    return { state: "indexed", crawled: status?.lastCrawlTime ?? null };
  }
  if (coverage.includes("discovered")) {
    return { state: "waiting", label: "Found, waiting" };
  }
  if (coverage.includes("crawled")) {
    return { state: "waiting", label: "Read, not added yet" };
  }
  if (coverage.includes("unknown")) {
    return { state: "other", label: "Not found yet" };
  }
  return { state: "other", label: status?.coverageState || "Not in Google" };
}

/**
 * Every tracked page with what Google says about it: whether it is indexed,
 * where it ranks for its main search and its close ones, and what else it is
 * being shown for. Two Search Console queries cover all the pages; the index
 * check is one call per page, kept for six hours.
 */
export async function getPageReports(
  pages: SeoPage[],
): Promise<Result<{ rows: PageReport[]; from: string; to: string }>> {
  const from = daysAgo(WINDOW_DAYS);
  const to = daysAgo(0);
  const base = { startDate: from, endDate: to };
  const origin = searchConsoleBase(siteUrl);

  const [byPage, byPageQuery, inspections] = await Promise.all([
    searchConsole({ ...base, dimensions: ["page"], rowLimit: 1000 }),
    searchConsole({ ...base, dimensions: ["page", "query"], rowLimit: 25000 }),
    Promise.all(pages.map((p) => inspectUrl(`${origin}${p.path}`))),
  ]);
  if (byPage.error !== undefined) return { error: byPage.error };
  if (byPageQuery.error !== undefined) return { error: byPageQuery.error };

  const totals = new Map<string, SearchRow>();
  for (const row of byPage.data) totals.set(pathKey(row.keys?.[0] ?? ""), row);

  const queries = new Map<string, SearchRow[]>();
  for (const row of byPageQuery.data) {
    const key = pathKey(row.keys?.[0] ?? "");
    queries.set(key, [...(queries.get(key) ?? []), row]);
  }

  const rows = pages.map((page, i): PageReport => {
    const mine = queries.get(page.path) ?? [];
    const positionOf = (q: string) =>
      mine.find((r) => (r.keys?.[1] ?? "").toLowerCase() === q.toLowerCase())
        ?.position ?? null;
    const targeted = new Set(
      [page.main, ...page.also].map((q) => q.toLowerCase()),
    );
    const total = totals.get(page.path);

    return {
      page,
      url: `${origin}${page.path}`,
      index: indexState(inspections[i]),
      main: { query: page.main, position: positionOf(page.main) },
      avgPosition: total?.position ?? null,
      searches: mine.length,
      impressions: total?.impressions ?? 0,
      clicks: total?.clicks ?? 0,
      also: page.also.map((q) => ({ query: q, position: positionOf(q) })),
      extra: mine
        .filter((r) => !targeted.has((r.keys?.[1] ?? "").toLowerCase()))
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 3)
        .map((r) => ({ query: r.keys?.[1] ?? "", position: r.position })),
    };
  });

  return { data: { rows, from, to } };
}
