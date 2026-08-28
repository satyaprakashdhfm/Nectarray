import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Served at /sitemap.xml. The site is a single page, so this is one entry —
 * its job is to give Search Console something concrete to submit and to date
 * the content, not to enumerate routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
