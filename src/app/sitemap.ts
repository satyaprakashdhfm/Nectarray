import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** Served at /sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/agentic-ai`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
