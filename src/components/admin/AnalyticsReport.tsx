import { Section, Stat, td, th } from "@/components/admin/Business";
import { ConnectionError } from "@/components/admin/SiteStats";
import {
  SOURCES,
  type Analytics,
  type OwnRecords,
} from "@/lib/analytics-report";
import type { Result } from "@/lib/google";

/*
 * The Analytics tab below the live panel, top to bottom: the four headline
 * numbers, visitors per day, where they came from, how far they got, sign-ins,
 * the first page they saw, device, city, and new against returning.
 */

const n = (value: number) => Math.round(value).toLocaleString("en-IN");

const duration = (seconds: number) => {
  const s = Math.round(seconds);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
};

const day = (yyyymmdd: string) =>
  new Date(
    `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const pct = (part: number, whole: number) =>
  whole
    ? `${((part / whole) * 100).toFixed(part / whole < 0.1 ? 1 : 0)}%`
    : "0%";

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-ink-soft -mt-1 mb-3 text-[0.8125rem] leading-relaxed">
      {children}
    </p>
  );
}

/** Label, count and a bar, the bar scaled to the largest in the list. */
function BarList({
  rows,
  unit,
  mono = false,
}: {
  rows: { label: string; value: number }[];
  unit: string;
  mono?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="text-ink-faint text-[0.8125rem]">Nothing yet.</p>;
  }
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="text-[0.8125rem]">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`text-ink min-w-0 truncate ${mono ? "font-mono text-[0.75rem]" : "font-semibold"}`}
              title={r.label}
            >
              {r.label}
            </span>
            <span className="text-ink-soft shrink-0 tabular-nums">
              {n(r.value)} {unit}
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

export function AnalyticsReport({
  result,
  own,
  filtered,
}: {
  result: Result<Analytics>;
  own: OwnRecords;
  filtered: boolean;
}) {
  if (result.error !== undefined) {
    return (
      <div className="mt-8">
        <ConnectionError source="GA4" error={result.error} />
      </div>
    );
  }
  const a = result.data;
  const busiest = a.daily.reduce(
    (top, d) => (d.visitors > top.visitors ? d : top),
    { date: "", visitors: 0 },
  );
  const peak = Math.max(1, busiest.visitors);
  const leadsTotal = a.sources.reduce((t, s) => t + s.enquiries, 0);

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Visitors" value={n(a.visitors)} hint="different people" />
        <Stat
          label="New visitors"
          value={n(a.newVisitors)}
          hint="first time on the site"
        />
        <Stat
          label="Pages viewed"
          value={n(a.views)}
          hint={`${a.visits ? (a.views / a.visits).toFixed(1) : "0"} per visit`}
        />
        <Stat
          label="Time per visit"
          value={duration(a.avgVisit)}
          hint="on average"
        />
      </div>

      <Section title="Visitors per day">
        <Hint>
          How many different people opened the site each day. Hover a bar for
          the exact number.
        </Hint>
        <div className="card p-5">
          {a.daily.length === 0 ? (
            <p className="text-ink-faint text-[0.8125rem]">
              No visits recorded yet.
            </p>
          ) : (
            <>
              <div className="flex h-36 items-end gap-[3px]">
                {a.daily.map((d) => (
                  <div
                    key={d.date}
                    title={`${day(d.date)}: ${n(d.visitors)} visitors`}
                    className="bg-brand-solid/75 hover:bg-brand-solid min-w-0 flex-1 rounded-t-sm transition-colors"
                    style={{
                      height: `${Math.max(2, (d.visitors / peak) * 100)}%`,
                    }}
                  />
                ))}
              </div>
              <div className="text-ink-faint mt-2 flex flex-wrap justify-between gap-2 text-[0.75rem]">
                <span>{day(a.daily[0].date)}</span>
                <span className="text-ink-soft">
                  busiest day: {n(busiest.visitors)} visitors
                  {busiest.date && ` on ${day(busiest.date)}`}
                </span>
                <span>{day(a.daily.at(-1)!.date)}</span>
              </div>
            </>
          )}
        </div>
      </Section>

      <Section title="Where people come from">
        <Hint>
          Every place a visit came from: Google, Instagram, WhatsApp, an ad, or
          typing the address. Enquiries are the contact and academy forms sent
          from those visits.
        </Hint>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left">
            <thead>
              <tr className="border-line-soft border-b">
                {[
                  "Where from",
                  "Visitors",
                  "Visits",
                  "Enquiries",
                  "Visits that enquired",
                ].map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.sources.map((s) => (
                <tr
                  key={s.id}
                  className="border-line-soft border-b last:border-0"
                >
                  <td className={`${td} max-w-[22rem]`}>
                    <span className="text-ink block font-semibold">
                      {SOURCES[s.id].label}
                    </span>
                    <span className="text-ink-faint block text-[0.75rem] leading-snug">
                      {SOURCES[s.id].hint}
                    </span>
                  </td>
                  <td className={`${td} text-ink font-semibold tabular-nums`}>
                    {n(s.visitors)}
                  </td>
                  <td className={`${td} tabular-nums`}>{n(s.visits)}</td>
                  <td className={`${td} tabular-nums`}>
                    {s.enquiries ? n(s.enquiries) : "—"}
                  </td>
                  <td className={`${td} tabular-nums`}>
                    {pct(s.enquiries, s.visits)}
                  </td>
                </tr>
              ))}
              {a.sources.length === 0 && (
                <tr>
                  <td colSpan={5} className={`${td} text-ink-faint`}>
                    No visits recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="From visit to enquiry">
        <Hint>
          How far people got, across the whole site. The biggest drop between
          two steps is where the site loses the most people.
        </Hint>
        <div className="card p-5">
          <ol className="space-y-3">
            {a.funnel.map((step, i) => {
              const before = i > 0 ? a.funnel[i - 1].people : 0;
              return (
                <li key={step.label}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-[0.875rem]">
                    <span className="text-ink font-semibold">
                      {i + 1}. {step.label}
                    </span>
                    <span className="text-ink-soft tabular-nums">
                      <span className="text-ink font-semibold">
                        {n(step.people)}
                      </span>{" "}
                      people
                      {i > 0 &&
                        ` · ${pct(step.people, before)} of the step before`}
                    </span>
                  </div>
                  <div className="bg-mist mt-1.5 h-2.5 overflow-hidden rounded-full">
                    <div
                      className="bg-leaf-deep h-full rounded-full"
                      style={{
                        width: `${a.funnel[0].people ? (step.people / a.funnel[0].people) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="text-ink-soft border-line-soft mt-4 border-t pt-4 text-[0.8125rem] leading-relaxed">
            Our own records show{" "}
            <span className="text-ink font-semibold">
              {n(own.academyEnquiries)} academy enquiries
            </span>{" "}
            in this period, against {n(leadsTotal)} enquiries Google counted
            from every form. Contact-form enquiries arrive by email and are not
            in our records. Google&rsquo;s count is usually a little lower,
            because people who block tracking still send the form.
          </p>
          {a.enquiryPages.length > 0 && (
            <p className="text-ink-faint mt-2 text-[0.75rem]">
              Sent from:{" "}
              {a.enquiryPages
                .map((p) => `${p.path} (${n(p.enquiries)})`)
                .join(", ")}
            </p>
          )}
        </div>
      </Section>

      <Section title="Sign-ins">
        <Hint>Students signing in to the dashboard, and new accounts.</Hint>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Stat
            label="Returning students signed in"
            value={n(own.returningSignIns)}
          />
          <Stat label="New accounts created" value={n(own.newAccounts)} />
        </div>
      </Section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">
            First page they saw
          </h2>
          <Hint>
            Where visits started. An ad pointing at a page shows up here.
          </Hint>
          <BarList
            rows={a.landing.map((l) => ({ label: l.path, value: l.visits }))}
            unit="visits"
            mono
          />
        </div>

        <div className="card p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">Cities</h2>
          <Hint>
            Where visitors were, as Google estimates it from their connection.
          </Hint>
          <BarList
            rows={a.cities.map((c) => ({ label: c.name, value: c.visitors }))}
            unit="visitors"
          />
        </div>

        <div className="card p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">
            Phone or computer
          </h2>
          <Hint>What people browsed on.</Hint>
          <BarList
            rows={a.devices.map((d) => ({ label: d.name, value: d.visitors }))}
            unit="visitors"
          />
        </div>

        <div className="card p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">
            New or returning
          </h2>
          <Hint>First-time visitors against people who had been before.</Hint>
          <BarList
            rows={a.newVsReturning.map((v) => ({
              label: v.name,
              value: v.visitors,
            }))}
            unit="visitors"
          />
        </div>
      </div>

      {filtered && (
        <p className="text-ink-faint mt-4 text-[0.75rem]">
          Filtered to one service&rsquo;s pages. The funnel and sign-ins always
          cover the whole site.
        </p>
      )}
    </>
  );
}
