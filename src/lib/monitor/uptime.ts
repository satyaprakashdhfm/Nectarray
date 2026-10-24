import { openIncident, resolveIncident } from "./incidents";

/**
 * The uptime checker: every two minutes, a plain GET to each address in
 * MONITOR_URLS, the way a visitor would. Started once per server from
 * instrumentation.ts; unset, it never runs.
 *
 *   MONITOR_URLS="A Dough Cookie=https://www.adoughcookie.com,
 *                 ADC API=https://adc-backend-production.up.railway.app/api/products"
 *
 * Point it at a page that needs the database (an API list, not a health
 * route that answers "ok" regardless), so a dead database counts as down.
 *
 * Down is two failed checks in a row, which keeps one slow answer during a
 * deploy from becoming an email. Back up is the first good answer. This sees
 * what Railway's webhook cannot: a site that is running but broken, or
 * unreachable from outside. It runs inside this site, so it is blind while
 * this site is down itself.
 */

const EVERY_MS = 2 * 60_000;
const TIMEOUT_MS = 20_000;
const FAILS_TO_OPEN = 2;

type Site = { name: string; url: string };

declare global {
  // One loop per process, even if register() runs again in development.
  var __uptimeTimer: ReturnType<typeof setInterval> | undefined;
}

export function parseSites(raw: string | undefined): Site[] {
  return (raw ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const at = entry.indexOf("=http");
      const name = at > 0 ? entry.slice(0, at).trim() : "";
      const url = at > 0 ? entry.slice(at + 1).trim() : entry;
      try {
        const parsed = new URL(url);
        return [{ name: name || parsed.host, url: parsed.toString() }];
      } catch {
        console.error(`[uptime] not a URL in MONITOR_URLS: ${entry}`);
        return [];
      }
    });
}

const failures = new Map<string, number>();

async function probe(site: Site): Promise<string | null> {
  try {
    const response = await fetch(site.url, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "NectArray uptime check" },
    });
    // Drain the body so the connection is reused.
    await response.arrayBuffer().catch(() => {});
    return response.ok ? null : `answered HTTP ${response.status}`;
  } catch (error) {
    return error instanceof Error && error.name === "TimeoutError"
      ? `no answer in ${TIMEOUT_MS / 1000} s`
      : `could not connect (${error instanceof Error ? error.message : String(error)})`;
  }
}

export async function checkOnce(sites: Site[]) {
  await Promise.all(
    sites.map(async (site) => {
      const target = `uptime:${site.url}`;
      const problem = await probe(site);
      try {
        if (problem) {
          const count = (failures.get(target) ?? 0) + 1;
          failures.set(target, count);
          if (count >= FAILS_TO_OPEN)
            await openIncident({
              source: "uptime",
              target,
              project: site.name,
              title: `${site.name} is down`,
              detail: `${site.url} ${problem}.`,
              href: site.url,
            });
        } else {
          failures.delete(target);
          await resolveIncident(target, `${site.name} is answering again.`);
        }
      } catch (error) {
        console.error(`[uptime] could not record ${site.name}:`, error);
      }
    }),
  );
}

export function startUptimeChecks() {
  const sites = parseSites(process.env.MONITOR_URLS);
  if (sites.length === 0 || globalThis.__uptimeTimer) return;
  console.log(
    `[uptime] checking ${sites.map((s) => s.name).join(", ")} every ${EVERY_MS / 60_000} min`,
  );
  globalThis.__uptimeTimer = setInterval(() => void checkOnce(sites), EVERY_MS);
  // First check after a minute, once the server is up and the pool is warm.
  setTimeout(() => void checkOnce(sites), 60_000);
}
