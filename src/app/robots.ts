import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** Served at /robots.txt — allows everything and points crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
