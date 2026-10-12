import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    /*
     * 90 is for the sample sites on /software: whole-page captures full of
     * small text, which the default 75 visibly smears. Next 16 clamps any
     * quality not listed here to the nearest one that is, silently — so
     * without this, asking for 90 quietly got 75.
     */
    qualities: [75, 90],
  },

  /*
   * The Animations tab shows each hero's real source under its preview, read
   * from src/ at request time. A deployed build has no src/ folder unless the
   * files are traced in, so they are, for that one route.
   */
  outputFileTracingIncludes: {
    "/admin/web/animations": ["./src/components/admin/animations/heroes/**/*"],
  },

  experimental: {
    /*
     * How long a navigated-to page stays in the client router cache.
     *
     * The default for dynamic routes is zero, so moving Notes → Assignments →
     * Notes re-rendered Notes on the server both times, auth round trip and
     * all. Half a minute is long enough that flicking between tabs is
     * instant, and short enough that a solved question or a new lesson shows
     * up on the next visit rather than needing a reload.
     */
    staleTimes: { dynamic: 30, static: 180 },
  },

  /*
   * Lesson screenshots and the files the lessons hand out. Files in public/
   * are served with `max-age=0`, so every lesson view asked the server again
   * about every image on it, one round trip each. A day's freshness, then a
   * week of serving the old copy while the new one is fetched: a replaced
   * screenshot shows up by the next day, and nobody ever waits for one.
   */
  async headers() {
    return [
      {
        /*
         * Every response: HTTPS only from the first visit on, no guessing at
         * content types, no framing by other sites (clickjacking), only the
         * origin sent to other sites as a Referer, and no camera or location.
         * The microphone stays available to our own pages, for the admin
         * Workspace's voice input.
         */
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=(self)",
          },
        ],
      },
      {
        source: "/notes/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
