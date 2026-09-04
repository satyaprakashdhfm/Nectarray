import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Served at /robots.txt.
 *
 * The signed-in areas are disallowed. They already redirect anonymous
 * visitors, so a crawler would only ever see the sign-in bounce — but a
 * bounce is still a crawled URL, and neither belongs in the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/auth/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
