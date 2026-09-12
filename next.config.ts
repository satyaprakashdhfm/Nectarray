import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
        // The hero film and its poster: named files that only change when
        // they are replaced, so a revalidation on every visit buys nothing.
        source: "/hero/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
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
