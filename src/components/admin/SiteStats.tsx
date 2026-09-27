import { TriangleAlert } from "lucide-react";
import { Stat, td, th } from "@/components/admin/Business";
import { serviceAccountEmail, type Result, type SearchRow } from "@/lib/google";
import { WINDOW_DAYS, type Search, type Traffic } from "@/lib/site-stats";

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

/** Rows of label, bar and number, the bar scaled to the largest. */
function Bars({
  rows,
}: {
  rows: { label: string; value: number; mono?: boolean }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="text-[0.8125rem]">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`text-ink min-w-0 truncate ${r.mono ? "font-mono text-[0.75rem]" : "font-semibold"}`}
              title={r.label}
            >
              {r.label}
            </span>
            <span className="text-ink-soft shrink-0 tabular-nums">
              {count(r.value)}
            </span>
          </div>
          <div className="bg-mist mt-1 h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-brand-solid h-full rounded-full"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TrafficPanel({
  result,
  filtered,
}: {
  result: Result<Traffic>;
  filtered: boolean;
}) {
  if (result.error !== undefined) {
    return <ConnectionError source="GA4" error={result.error} />;
  }
  const t = result.data;
  const peak = Math.max(1, ...t.daily.map((d) => d.sessions));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Visitors" value={count(t.visitors)} />
        <Stat label="Sessions" value={count(t.sessions)} />
        <Stat label="Page views" value={count(t.views)} />
        <Stat label="Avg. session" value={duration(t.avgSession)} />
      </div>

      <div className="card p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow">Sessions per day</p>
          <p className="text-ink-faint text-[0.75rem]">
            Last {WINDOW_DAYS} days
          </p>
        </div>
        {t.daily.length === 0 ? (
          <p className="text-ink-faint mt-3 text-[0.8125rem]">
            No visits recorded in this period.
          </p>
        ) : (
          <>
            <div className="mt-4 flex h-28 items-end gap-[3px]">
              {t.daily.map((d) => (
                <div
                  key={d.date}
                  title={`${shortDate(d.date)}: ${count(d.sessions)} sessions`}
                  className="bg-brand-solid/80 hover:bg-brand-solid min-w-0 flex-1 rounded-t-sm transition-colors"
                  style={{
                    height: `${Math.max(2, (d.sessions / peak) * 100)}%`,
                  }}
                />
              ))}
            </div>
            <div className="text-ink-faint mt-1.5 flex justify-between text-[0.6875rem]">
              <span>{shortDate(t.daily[0].date)}</span>
              <span>{shortDate(t.daily.at(-1)!.date)}</span>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="eyebrow mb-3">Where visitors came from</p>
          {t.sources.length === 0 ? (
            <p className="text-ink-faint text-[0.8125rem]">Nothing yet.</p>
          ) : (
            <Bars
              rows={t.sources.map((s) => ({
                label: s.name,
                value: s.sessions,
              }))}
            />
          )}
          <p className="text-ink-faint mt-3 text-[0.6875rem]">Sessions</p>
        </div>

        <div className="card p-5">
          {filtered ? (
            <>
              <p className="eyebrow mb-3">Top pages</p>
              <Bars
                rows={t.pages.map((p) => ({
                  label: p.path,
                  value: p.views,
                  mono: true,
                }))}
              />
            </>
          ) : (
            <>
              <p className="eyebrow mb-3">Page views by service</p>
              <Bars
                rows={t.byService.map((s) => ({
                  label: s.label,
                  value: s.views,
                }))}
              />
              <p className="eyebrow mt-6 mb-3">Top pages</p>
              <Bars
                rows={t.pages.slice(0, 8).map((p) => ({
                  label: p.path,
                  value: p.views,
                  mono: true,
                }))}
              />
            </>
          )}
          <p className="text-ink-faint mt-3 text-[0.6875rem]">Page views</p>
        </div>
      </div>
    </div>
  );
}

function SearchTable({
  title,
  rows,
  isPage,
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

export function SearchPanel({ result }: { result: Result<Search> }) {
  if (result.error !== undefined) {
    return <ConnectionError source="Search Console" error={result.error} />;
  }
  const s = result.data;

  return (
    <div className="space-y-4">
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
      <div className="grid gap-4 xl:grid-cols-2">
        <SearchTable title="Search term" rows={s.queries} />
        <SearchTable title="Page" rows={s.pages} isPage />
      </div>
      <p className="text-ink-faint text-[0.75rem]">
        Last {WINDOW_DAYS} days. Google adds search data two to three days late,
        so the newest days fill in over time.
      </p>
    </div>
  );
}
