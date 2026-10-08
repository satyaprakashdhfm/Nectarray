import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Served at /robots.txt.
 *
 * The student dashboard is disallowed: it redirects anonymous visitors, so a
 * crawler would only ever see the sign-in bounce, and a bounce is still a
 * crawled URL.
 *
 * The admin panel is deliberately not listed. robots.txt is public, so
 * naming it here would point every scanner at it; it lives at an
 * unguessable address instead (lib/admin-path.ts), answers /admin with a
 * 404, and sends noindex headers on every page of its own.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/auth/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
