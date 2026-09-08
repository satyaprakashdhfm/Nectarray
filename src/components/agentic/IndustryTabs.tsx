"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { agenticAiPage } from "@/lib/content";

const { industries } = agenticAiPage;

/**
 * How a row in the mock reads. Every one of these is illustration — the
 * shape of the output, not anybody's real numbers.
 */
const TONE: Record<string, string> = {
  good: "text-leaf-deep",
  bad: "text-[#c0392b]",
  warn: "text-amber-deep",
  muted: "text-ink-faint italic",
  total: "text-ink font-semibold",
};

/**
 * What an agent does in one business, tab by tab.
 *
 * The families above this say what we build. A buyer reading them is
 * translating in their head into their own week, and this does that
 * translation for them: one real job of work per tab, the systems it plugs
 * into, and the view whoever owns that job would open afterwards.
 *
 * The screen on the right is drawn rather than photographed, because a
 * screenshot would either be a real client's data or a fake pretending to
 * be one. This is neither — it is a diagram of the output, and it says so.
 */
export function IndustryTabs() {
  const [active, setActive] = useState(0);
  const industry = industries[active];

  return (
    <div>
      {/* Tabs -------------------------------------------------------- */}
      <div
        role="tablist"
        aria-label="Industries"
        className="border-line bg-surface -mx-1 flex gap-1 overflow-x-auto rounded-full border p-1 lg:mx-0 lg:w-fit"
      >
        {industries.map((entry, i) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            id={`industry-tab-${entry.id}`}
            aria-selected={i === active}
            aria-controls={`industry-panel-${entry.id}`}
            onClick={() => setActive(i)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[0.875rem] font-semibold whitespace-nowrap transition-colors ${
              i === active
                ? "bg-ink text-cta-fg"
                : "text-ink-soft hover:bg-mist hover:text-ink"
            }`}
          >
            <Icon name={entry.icon} className="size-4" />
            {entry.label}
          </button>
        ))}
      </div>

      {/* Panel ------------------------------------------------------- */}
      <div
        role="tabpanel"
        id={`industry-panel-${industry.id}`}
        aria-labelledby={`industry-tab-${industry.id}`}
        className="border-line from-brand-wash to-surface mt-6 grid gap-10 rounded-[1.5rem] border bg-gradient-to-br p-6 sm:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:p-10"
      >
        {/* Left — what it is */}
        <div className="min-w-0">
          <h3 className="display text-ink text-[1.5rem] leading-tight sm:text-[1.75rem]">
            {industry.title}
          </h3>
          <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
            {industry.body}
          </p>

          <ul className="mt-6 space-y-2.5">
            {industry.points.map((point) => (
              <li
                key={point}
                className="text-ink-soft flex items-start gap-2.5 text-[0.875rem] leading-relaxed"
              >
                <Icon
                  name="check"
                  className="text-brand-deep mt-[0.15rem] size-3.5 shrink-0"
                  strokeWidth={2.75}
                />
                {point}
              </li>
            ))}
          </ul>

          {/* The instruction someone actually types, and what it reaches. */}
          <div className="bg-night mt-7 rounded-2xl p-5 text-white/80">
            <p className="text-[0.625rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
              What you ask for
            </p>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed">
              {industry.prompt}
            </p>
            <p className="mt-5 text-[0.625rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
              Connected to
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {industry.connectors.map((connector) => (
                <span
                  key={connector}
                  className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[0.75rem] font-medium text-white/85"
                >
                  {connector}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — the view it leaves behind */}
        <figure className="border-line bg-surface min-w-0 overflow-hidden rounded-2xl border shadow-[0_24px_60px_-30px_rgba(14,27,38,0.35)]">
          <div className="bg-night flex items-center gap-2.5 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </span>
            <span className="truncate font-mono text-[0.75rem] text-white/70">
              {industry.screen.file}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-[0.8125rem]">
              <thead className="bg-mist border-line-soft border-b">
                <tr>
                  {industry.screen.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="text-ink-faint px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {industry.screen.rows.map((row) => (
                  <tr
                    key={row.cells.join("|")}
                    className={`border-line-soft border-b last:border-0 ${
                      row.tone === "total" ? "bg-mist/60" : ""
                    } ${row.tone === "warn" ? "bg-amber-wash/60" : ""}`}
                  >
                    {row.cells.map((cell, i) => {
                      const last = i === row.cells.length - 1;
                      /*
                       * A verdict colours the cell that carries it, not the
                       * line it is on. Colouring the whole row turned a
                       * confirmed appointment into four green cells, which
                       * reads as decoration rather than as a status.
                       */
                      const wholeRow =
                        row.tone === "muted" || row.tone === "total";
                      const tone =
                        wholeRow || last ? TONE[row.tone ?? ""] : undefined;
                      return (
                        <td
                          key={i}
                          className={`px-4 py-2.5 align-top ${
                            i === 0 ? "whitespace-nowrap" : ""
                          } ${tone ?? (i === 0 ? "text-ink font-medium" : "text-ink-soft")}`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-line-soft bg-mist/50 flex gap-1 overflow-x-auto border-t px-3 py-2">
            {industry.screen.sheets.map((sheet, i) => (
              <span
                key={sheet}
                className={`rounded-md px-2.5 py-1 text-[0.75rem] whitespace-nowrap ${
                  i === 0
                    ? "bg-surface text-ink border-line border font-semibold"
                    : "text-ink-faint"
                }`}
              >
                {sheet}
              </span>
            ))}
          </div>

          <figcaption className="border-line-soft text-ink-faint border-t px-4 py-2.5 text-[0.75rem]">
            Illustration of the output. Not a customer&rsquo;s data.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
