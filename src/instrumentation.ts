/**
 * Runs once when the server starts. Starts the uptime checker
 * (lib/monitor/uptime.ts), which does nothing unless MONITOR_URLS is set.
 *
 * The test has to stay exactly `process.env.NEXT_RUNTIME === "nodejs"` around
 * the import: that is the form Next strips from the Edge build, and anything
 * looser pulls the database driver into it and fails the build.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startUptimeChecks } = await import("@/lib/monitor/uptime");
    startUptimeChecks();
  }
}
