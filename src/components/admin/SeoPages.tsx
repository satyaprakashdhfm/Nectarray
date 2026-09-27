import { ExternalLink } from "lucide-react";
import { ConnectionError } from "@/components/admin/SiteStats";
import { keywordStats } from "@/lib/content/keyword-stats";
import type { Result } from "@/lib/google";
import type { IndexState, PageReport, Ranked } from "@/lib/site-stats";

const shortDay = (iso: string) =>
  new Date(
    iso.length === 10 ? `${iso}T00:00:00+05:30` : iso,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

const pos = (value: number) =>
  `#${value < 10 ? value.toFixed(1) : Math.round(value)}`;

/** Page one reads green; anything further down is plain. */
const posTone = (value: number) =>
  value <= 10 ? "text-leaf-deep" : "text-ink";

const COLUMNS = "lg:grid-cols-[1.25fr_1.15fr_0.8fr_0.85fr_0.8fr_1.9fr]";

/**
 * One row per page: what it is written to rank for, whether Google has it,
 * where it sits, how often it was shown and clicked, and the close searches
 * it also targets. Under the chips, the searches Google already shows it for
 * that nobody targeted, which is where the next page ideas come from.
 *
 * A table on a laptop; on a phone every row folds into a card and each cell
 * carries its own small label.
 */
export function SeoPages({
  result,
}: {
  result: Result<{ rows: PageReport[]; from: string; to: string }>;
}) {
  if (result.error !== undefined) {
    return <ConnectionError source="Search Console" error={result.error} />;
  }
  const { rows, from, to } = result.data;

  return (
    <div>
      <p className="text-ink-soft mb-3 text-[0.8125rem] leading-relaxed">
        Each page is written for one main search, plus a few close ones. Shown,
        clicks and position are for {shortDay(from)} to {shortDay(to)}. The
        numbers above cover the whole site. Google&rsquo;s numbers run about two
        days behind.
      </p>

      <div className="card overflow-hidden">
        <div
          className={`border-line-soft hidden gap-4 border-b px-5 py-3 lg:grid ${COLUMNS}`}
        >
          {[
            "Page",
            "Main search",
            "In Google",
            "Position",
            "Shown · clicks",
            "Also targets",
          ].map((h) => (
            <p
              key={h}
              className="text-ink-faint text-[0.6875rem] font-semibold tracking-[0.1em] uppercase"
            >
              {h}
            </p>
          ))}
        </div>

        <ul>
          {rows.map((row) => (
            <li
              key={row.page.path}
              className={`border-line-soft grid gap-4 border-b px-5 py-5 last:border-0 sm:grid-cols-2 ${COLUMNS}`}
            >
              <Cell label="Page">
                <p className="text-ink text-[0.9375rem] leading-snug font-semibold">
                  {row.page.title}
                </p>
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener"
                  className="text-brand-deep hover:text-brand mt-1 inline-flex items-center gap-1 font-mono text-[0.75rem] break-all"
                >
                  {row.page.path}
                  <ExternalLink className="size-3 shrink-0" aria-hidden />
                </a>
                <p className="text-ink-faint mt-1 text-[0.75rem]">
                  {row.page.kind}
                  {row.page.liveSince &&
                    ` · live since ${shortDay(row.page.liveSince)}`}
                </p>
              </Cell>

              <Cell label="Main search">
                <p className="text-ink text-[0.9375rem] font-semibold">
                  {row.main.query}
                </p>
                <p className="text-ink-faint mt-1 text-[0.75rem]">
                  {keywordStats(row.main.query)}
                </p>
              </Cell>

              <Cell label="In Google">
                <IndexPill index={row.index} />
              </Cell>

              <Cell label="Position">
                {row.main.position !== null ? (
                  <p
                    className={`text-[1.125rem] font-bold ${posTone(row.main.position)}`}
                  >
                    {pos(row.main.position)}
                  </p>
                ) : (
                  <p className="text-ink-faint text-[0.9375rem]">
                    Not showing yet
                  </p>
                )}
                {row.avgPosition !== null && (
                  <p className="text-ink-faint mt-1 text-[0.75rem]">
                    avg {pos(row.avgPosition)} over {row.searches} searches
                  </p>
                )}
              </Cell>

              <Cell label="Shown · clicks">
                <p className="text-ink-soft text-[0.9375rem]">
                  <span className="text-ink font-semibold">
                    {row.impressions.toLocaleString("en-IN")}
                  </span>{" "}
                  shown ·{" "}
                  <span className="text-ink font-semibold">
                    {row.clicks.toLocaleString("en-IN")}
                  </span>{" "}
                  {row.clicks === 1 ? "click" : "clicks"}
                </p>
              </Cell>

              <Cell label="Also targets" wide>
                <ul className="flex flex-wrap gap-1.5">
                  {row.also.map((r) => (
                    <Chip key={r.query} ranked={r} />
                  ))}
                </ul>
                {row.extra.length > 0 && (
                  <p className="text-ink-faint mt-2.5 text-[0.75rem] leading-relaxed">
                    Google also shows it for:{" "}
                    {row.extra
                      .map((e) => `${e.query} ${pos(e.position)}`)
                      .join(", ")}
                  </p>
                )}
              </Cell>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Cell({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`min-w-0 ${wide ? "sm:col-span-2 lg:col-span-1" : ""}`}>
      <p className="text-ink-faint mb-1 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase lg:hidden">
        {label}
      </p>
      {children}
    </div>
  );
}

function IndexPill({ index }: { index: IndexState }) {
  if (index.state === "indexed") {
    return (
      <>
        <span className="bg-leaf-wash text-leaf-deep inline-flex rounded-full px-3 py-1 text-[0.8125rem] font-semibold">
          In Google
        </span>
        {index.crawled && (
          <p className="text-ink-faint mt-1.5 text-[0.75rem]">
            Read by Google {shortDay(index.crawled)}
          </p>
        )}
      </>
    );
  }
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[0.8125rem] font-semibold ${
        index.state === "waiting"
          ? "bg-amber-wash text-amber-deep"
          : "bg-mist text-ink-faint"
      }`}
    >
      {index.label}
    </span>
  );
}

function Chip({ ranked }: { ranked: Ranked }) {
  return (
    <li className="bg-mist text-ink inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.8125rem] font-medium">
      {ranked.query}
      {ranked.position !== null && (
        <span className={`font-bold ${posTone(ranked.position)}`}>
          {pos(ranked.position)}
        </span>
      )}
    </li>
  );
}
