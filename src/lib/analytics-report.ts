import "server-only";
import { and, countDistinct, count, gte, lt, eq } from "drizzle-orm";
import { SERVICES, type ServiceId } from "@/lib/business";
import { db } from "@/lib/db";
import { academyEnquiries, sessions, users } from "@/lib/db/schema";
import {
  ga4Realtime,
  ga4Reports,
  type Ga4Report,
  type Result,
} from "@/lib/google";

/*
 * Everything on the Analytics tab: GA4 for visits, our own tables for
 * sign-ins and enquiries. Every figure covers the same last 28 days.
 */

export const DAYS = 28;

type Row = NonNullable<Ga4Report["rows"]>[number];
const dim = (row: Row, i = 0) => row.dimensionValues?.[i]?.value ?? "";
const met = (row: Row, i = 0) => Number(row.metricValues?.[i]?.value ?? 0);

// ---------------------------------------------------------------------------
//  Where visits come from, in words an owner would use
// ---------------------------------------------------------------------------

export type SourceId =
  | "search"
  | "direct"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "whatsapp"
  | "other-social"
  | "google-ads"
  | "meta-ads"
  | "referral"
  | "email"
  | "tagged"
  | "unknown";

export const SOURCES: Record<SourceId, { label: string; hint: string }> = {
  search: {
    label: "Search (Google, Bing…)",
    hint: "Found us by searching, without an ad.",
  },
  direct: {
    label: "Direct",
    hint: "Typed the address, used a bookmark, or came from an app that hides where the link was. WhatsApp often does.",
  },
  instagram: {
    label: "Instagram (not an ad)",
    hint: "Our profile, a post, a story or the bio link.",
  },
  facebook: {
    label: "Facebook (not an ad)",
    hint: "Our page or a post on Facebook that was not an ad.",
  },
  linkedin: {
    label: "LinkedIn",
    hint: "Our company page, a post, or someone sharing a link there.",
  },
  whatsapp: {
    label: "WhatsApp",
    hint: "A link someone shared on WhatsApp that kept its source.",
  },
  "other-social": {
    label: "Other social",
    hint: "YouTube, X, Reddit and other social sites, not ads.",
  },
  "google-ads": {
    label: "Google ads",
    hint: "Clicked one of our paid ads on Google search or YouTube.",
  },
  "meta-ads": {
    label: "Meta ads",
    hint: "Clicked one of our paid ads on Instagram or Facebook.",
  },
  referral: {
    label: "Other websites",
    hint: "A link on another site: a directory, an article, a partner.",
  },
  email: { label: "Email", hint: "A link in an email." },
  tagged: {
    label: "Other tagged links",
    hint: "A link we tagged ourselves (a QR code, a partner) that is none of the above.",
  },
  unknown: {
    label: "Other / unknown",
    hint: "Google could not tell where these came from. Common with privacy-protecting browsers.",
  },
};

function sourceOf(channel: string, source: string): SourceId {
  const c = channel.toLowerCase();
  const s = source.toLowerCase();
  if (s.includes("whatsapp") || s === "wa.me" || s.includes("l.wl.co")) {
    return "whatsapp";
  }
  if (c === "organic search") return "search";
  if (c === "direct") return "direct";
  if (c === "paid social") {
    return /facebook|instagram|meta|fb|ig/.test(s) ? "meta-ads" : "tagged";
  }
  if (/paid search|paid shopping|paid video|cross-network|display/.test(c)) {
    return "google-ads";
  }
  if (c === "organic social" || c === "organic video") {
    if (s.includes("instagram")) return "instagram";
    if (s.includes("facebook") || s === "fb" || s === "m.facebook.com") {
      return "facebook";
    }
    if (s.includes("linkedin") || s === "lnkd.in") return "linkedin";
    return "other-social";
  }
  if (c === "referral") return "referral";
  if (c === "email") return "email";
  if (c === "unassigned" || c === "(other)" || c === "") return "unknown";
  return "tagged";
}

// ---------------------------------------------------------------------------
//  The report
// ---------------------------------------------------------------------------

export type Analytics = {
  visitors: number;
  newVisitors: number;
  visits: number;
  views: number;
  avgVisit: number;
  daily: { date: string; visitors: number }[];
  sources: {
    id: SourceId;
    visitors: number;
    visits: number;
    enquiries: number;
  }[];
  landing: { path: string; visits: number }[];
  devices: { name: string; visitors: number }[];
  cities: { name: string; visitors: number }[];
  newVsReturning: { name: string; visitors: number }[];
  funnel: { label: string; people: number }[];
  enquiryPages: { path: string; enquiries: number }[];
};

type Filter = object;
const pathStarts = (value: string): Filter => ({
  filter: {
    fieldName: "pagePath",
    stringFilter: { matchType: "BEGINS_WITH", value },
  },
});
const isLead: Filter = {
  filter: {
    fieldName: "eventName",
    stringFilter: { matchType: "EXACT", value: "generate_lead" },
  },
};
const allOf = (...filters: (Filter | null)[]) => {
  const list = filters.filter((f): f is Filter => f !== null);
  if (list.length === 0) return {};
  if (list.length === 1) return { dimensionFilter: list[0] };
  return { dimensionFilter: { andGroup: { expressions: list } } };
};

/** GA4's own labels, reworded. */
const DEVICE: Record<string, string> = {
  mobile: "Phone",
  desktop: "Computer",
  tablet: "Tablet",
};
const VISIT: Record<string, string> = {
  new: "First visit",
  returning: "Came back again",
};

export async function getAnalytics(
  service: ServiceId | null,
): Promise<Result<Analytics>> {
  const path = service ? SERVICES.find((s) => s.id === service)!.path : null;
  const scope = path ? pathStarts(path) : null;
  const range = {
    dateRanges: [{ startDate: `${DAYS}daysAgo`, endDate: "today" }],
  };
  const report = (extra: object, filter: Filter | null = scope) => ({
    ...range,
    ...allOf(filter),
    ...extra,
  });

  const servicePages: Filter = {
    orGroup: { expressions: SERVICES.map((s) => pathStarts(s.path)) },
  };
  const formPages: Filter = {
    orGroup: {
      expressions: [pathStarts("/contact"), pathStarts("/academy")],
    },
  };

  const [a, b, c] = await Promise.all([
    ga4Reports([
      report({
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
      }),
      report({
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      report({
        dimensions: [
          { name: "sessionDefaultChannelGroup" },
          { name: "sessionSource" },
        ],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        limit: 250,
      }),
      {
        ...range,
        ...allOf(scope, isLead),
        dimensions: [
          { name: "sessionDefaultChannelGroup" },
          { name: "sessionSource" },
        ],
        metrics: [{ name: "eventCount" }],
        limit: 250,
      },
      report({
        dimensions: [{ name: "landingPage" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
    ]),
    ga4Reports([
      report({
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      }),
      report({
        dimensions: [{ name: "city" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
      report({
        dimensions: [{ name: "newVsReturning" }],
        metrics: [{ name: "activeUsers" }],
      }),
      // The funnel is always the whole site: it follows people across pages.
      report({ metrics: [{ name: "activeUsers" }] }, null),
      report({ metrics: [{ name: "activeUsers" }] }, servicePages),
    ]),
    ga4Reports([
      report({ metrics: [{ name: "activeUsers" }] }, formPages),
      report({ metrics: [{ name: "activeUsers" }] }, isLead),
      report(
        {
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "eventCount" }],
          orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
          limit: 10,
        },
        isLead,
      ),
    ]),
  ]);
  for (const r of [a, b, c])
    if (r.error !== undefined) return { error: r.error };

  const [totals, daily, sources, leadSources, landing] = a.data!.map(
    (r) => r.rows ?? [],
  );
  const [devices, cities, newVsReturning, siteUsers, serviceUsers] =
    b.data!.map((r) => r.rows ?? []);
  const [formUsers, leadUsers, leadPages] = c.data!.map((r) => r.rows ?? []);
  const total = totals[0];
  const first = (rows: Row[]) => (rows[0] ? met(rows[0]) : 0);

  const bySource = new Map<SourceId, Analytics["sources"][number]>();
  const bucket = (id: SourceId) => {
    const hit = bySource.get(id) ?? {
      id,
      visitors: 0,
      visits: 0,
      enquiries: 0,
    };
    bySource.set(id, hit);
    return hit;
  };
  for (const row of sources) {
    const hit = bucket(sourceOf(dim(row, 0), dim(row, 1)));
    // Visitors can be double counted across two sources; close enough here.
    hit.visitors += met(row, 0);
    hit.visits += met(row, 1);
  }
  for (const row of leadSources) {
    bucket(sourceOf(dim(row, 0), dim(row, 1))).enquiries += met(row, 0);
  }

  return {
    data: {
      visitors: total ? met(total, 0) : 0,
      newVisitors: total ? met(total, 1) : 0,
      visits: total ? met(total, 2) : 0,
      views: total ? met(total, 3) : 0,
      avgVisit: total ? met(total, 4) : 0,
      daily: daily.map((r) => ({ date: dim(r), visitors: met(r) })),
      sources: [...bySource.values()].sort((x, y) => y.visitors - x.visitors),
      landing: landing.map((r) => ({ path: dim(r) || "/", visits: met(r) })),
      devices: devices.map((r) => ({
        name: DEVICE[dim(r)] ?? dim(r),
        visitors: met(r),
      })),
      cities: cities
        .filter((r) => dim(r) !== "(not set)")
        .map((r) => ({ name: dim(r), visitors: met(r) })),
      newVsReturning: newVsReturning
        .filter((r) => VISIT[dim(r)])
        .map((r) => ({ name: VISIT[dim(r)], visitors: met(r) })),
      funnel: [
        { label: "Visited the site", people: first(siteUsers) },
        { label: "Read a service page", people: first(serviceUsers) },
        {
          label: "Reached an enquiry form (contact or academy)",
          people: first(formUsers),
        },
        { label: "Sent an enquiry", people: first(leadUsers) },
      ],
      enquiryPages: leadPages.map((r) => ({ path: dim(r), enquiries: met(r) })),
    },
  };
}

// ---------------------------------------------------------------------------
//  Our own records
// ---------------------------------------------------------------------------

export type OwnRecords = {
  newAccounts: number;
  returningSignIns: number;
  academyEnquiries: number;
};

/** Sign-ins and enquiries from our database, over the same window. */
export async function getOwnRecords(): Promise<OwnRecords> {
  const since = new Date(Date.now() - DAYS * 86_400_000);
  const [[made], [back], [asked]] = await Promise.all([
    db.select({ n: count() }).from(users).where(gte(users.createdAt, since)),
    db
      .select({ n: countDistinct(sessions.userId) })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(gte(sessions.createdAt, since), lt(users.createdAt, since))),
    db
      .select({ n: count() })
      .from(academyEnquiries)
      .where(gte(academyEnquiries.createdAt, since)),
  ]);
  return {
    newAccounts: made?.n ?? 0,
    returningSignIns: back?.n ?? 0,
    academyEnquiries: asked?.n ?? 0,
  };
}

// ---------------------------------------------------------------------------
//  Right now
// ---------------------------------------------------------------------------

export type Realtime = {
  active: number;
  pages: { name: string; people: number }[];
  devices: { name: string; people: number }[];
};

/** The last 30 minutes, from GA4's realtime report. */
export async function getRealtime(): Promise<Result<Realtime>> {
  const [total, pages, devices] = await Promise.all([
    ga4Realtime({ metrics: [{ name: "activeUsers" }] }),
    ga4Realtime({
      dimensions: [{ name: "unifiedScreenName" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 8,
    }),
    ga4Realtime({
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
    }),
  ]);
  for (const r of [total, pages, devices]) {
    if (r.error !== undefined) return { error: r.error };
  }
  const rows = (r: typeof total) => r.data?.rows ?? [];
  return {
    data: {
      active: rows(total)[0] ? met(rows(total)[0]) : 0,
      pages: rows(pages).map((r) => ({ name: dim(r), people: met(r) })),
      devices: rows(devices).map((r) => ({
        name: DEVICE[dim(r)] ?? dim(r),
        people: met(r),
      })),
    },
  };
}
