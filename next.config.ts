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
};

export default nextConfig;
