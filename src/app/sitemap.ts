import type { MetadataRoute } from "next";
import { publishedOmni } from "@/lib/omniproof";
import { siteUrl } from "@/lib/seo";

/** Omniproof pieces come from the database, so the map is built per request. */
export const dynamic = "force-dynamic";

/** Served at /sitemap.xml — one entry per route. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const routes: Array<[string, number]> = [
    ["", 1],
    ["/marketing", 0.9],
    ["/software", 0.9],
    ["/agentic-ai", 0.9],
    ["/academy", 0.9],
    ["/engagements", 0.7],
    ["/contact", 0.8],
  ];

  return [
    ...routes.map(([path, priority]) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    {
      url: `${siteUrl}/omniproof`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...(await publishedOmni()).map((a) => ({
      url: `${siteUrl}/omniproof/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
