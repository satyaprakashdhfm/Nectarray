import { TriangleAlert } from "lucide-react";
import { Stat, td, th } from "@/components/admin/Business";
import { serviceAccountEmail, type Result, type SearchRow } from "@/lib/google";
import { WINDOW_DAYS, type Search } from "@/lib/site-stats";

/*
 * The live GA4 and Search Console panels on the analytics and SEO pages.
 * Server components: the data is fetched on the page and handed in whole.
 */

const count = (value: number) => Math.round(value).toLocaleString("en-IN");

const duration = (seconds: number) => {
  const s = Math.round(seconds);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
};

/** 20260927 → 27 Sep */
const shortDate = (yyyymmdd: string) =>
  new Date(
    `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`,
  ).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/** A Search Console page URL without the site in front of it. */
const pathOnly = (url: string) => {
  try {
    const { pathname, search } = new URL(url);
    return pathname + search;
  } catch {
    return url;
  }
};

/**
 * What Google said, and the most likely fix.
 *
 * The first thing to go wrong is almost always access: the variables are
 * right but the service account was never added to the property, or the API
 * was never switched on in its Cloud project. Both answers are spelled out,
 * with the email to add.
 */
export function ConnectionError({
  source,
  error,
}: {
  source: "GA4" | "Search Console";
  error: string;
}) {
  const email = serviceAccountEmail();
  return (
    <div className="border-amber/30 bg-amber-wash card flex gap-3 p-5">
      <TriangleAlert
        className="text-amber-deep mt-0.5 size-5 shrink-0"
        strokeWidth={2}
        aria-hidden
      />
      <div className="min-w-0 text-[0.875rem] leading-relaxed">
        <p className="text-ink font-semibold">
          {source} could not be read yet.
        </p>
        <p className="text-ink-soft mt-1 break-words">Google said: {error}</p>
        <ul className="text-ink-soft mt-2 list-disc space-y-1 pl-5">
          {source === "GA4" ? (
            <>
              <li>
                GA4 → Admin → Property access management: add{" "}
                {email ? (
                  <code className="text-ink font-mono text-[0.8125rem] break-all">
                    {email}
                  </code>
                ) : (
                  "the service account's email"
                )}{" "}
                as a Viewer.
              </li>
              <li>
                Google Cloud → APIs &amp; Services: enable the Google Analytics
                Data API in the service account&rsquo;s project.
              </li>
            </>
          ) : (
            <>
              <li>
                Search Console → Settings → Users and permissions: add{" "}
                {email ? (
                  <code className="text-ink font-mono text-[0.8125rem] break-all">
                    {email}
                  </code>
                ) : (
                  "the service account's email"
                )}{" "}
                with Restricted access.
              </li>
              <li>
                Google Cloud → APIs &amp; Services: enable the Google Search
                Console API.
              </li>
              <li>
                SEARCH_CONSOLE_SITE_URL must match the property exactly —{" "}
                <code className="font-mono text-[0.8125rem]">
                  sc-domain:example.com
                </code>{" "}
                for a domain property,{" "}
                <code className="font-mono text-[0.8125rem]">
                  https://example.com/
                </code>{" "}
                with the slash for a URL one.
              </li>
            </>
          )}
        </ul>
        <p className="text-ink-faint mt-2 text-[0.75rem]">
          Access changes can take a few minutes to reach the API. Results are
          kept for ten minutes, so reload after that.
        </p>
      </div>
    </div>
  );
}

function SearchTable({
  title,
  rows,
  isPage = false,
}: {
  title: string;
  rows: SearchRow[];
  isPage?: boolean;
}) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[26rem] text-left">
        <thead>
          <tr className="border-line-soft border-b">
            {[title, "Clicks", "Shown", "Position"].map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className={`${td} text-ink-faint`}>
                Nothing yet.
              </td>
            </tr>
          ) : (
            rows.map((r) => {
              const key = r.keys?.[0] ?? "";
              return (
                <tr
                  key={key}
                  className="border-line-soft border-b last:border-0"
                >
                  <td
                    className={`${td} text-ink max-w-[16rem] truncate ${isPage ? "font-mono text-[0.75rem]" : "font-semibold"}`}
                    title={key}
                  >
                    {isPage ? pathOnly(key) : key}
                  </td>
                  <td className={`${td} tabular-nums`}>{count(r.clicks)}</td>
                  <td className={`${td} tabular-nums`}>
                    {count(r.impressions)}
                  </td>
                  <td className={`${td} tabular-nums`}>
                    {r.position.toFixed(1)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/** The four whole-site search numbers. Nothing when Search Console failed; the pages table below says why. */
export function SearchStats({ result }: { result: Result<Search> }) {
  if (result.error !== undefined) return null;
  const s = result.data;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Stat label="Clicks" value={count(s.clicks)} />
      <Stat
        label="Times shown"
        value={count(s.impressions)}
        hint="Impressions"
      />
      <Stat label="Click rate" value={`${(s.ctr * 100).toFixed(1)}%`} />
      <Stat
        label="Avg. position"
        value={s.position ? s.position.toFixed(1) : "—"}
      />
    </div>
  );
}

/** The site's top search terms, whichever page they land on. */
export function TopSearches({ result }: { result: Result<Search> }) {
  if (result.error !== undefined) return null;
  return (
    <>
      <SearchTable title="Search term" rows={result.data.queries} />
      <p className="text-ink-faint mt-2 text-[0.75rem]">
        Last {WINDOW_DAYS} days, whole site.
      </p>
    </>
  );
}
