"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { agenticAiPage } from "@/lib/content";

type Industry = (typeof agenticAiPage)["industries"][number];

/** How a verdict reads. Every one of these is illustration, not real data. */
const TONE: Record<string, string> = {
  good: "text-leaf-deep",
  bad: "text-[#c0392b]",
  warn: "text-amber-deep",
  muted: "text-ink-faint italic",
  total: "text-ink font-semibold",
};

/**
 * One industry, with a tab per job of work inside it.
 *
 * A single tab bar across all three industries made a visitor from a clinic
 * click past a reconciliation to find out whether we had anything for them.
 * Each industry is its own card now, and the tabs inside it are the jobs —
 * so the card is scannable as a whole ("healthcare: front desk, waitlist,
 * insurance") before anybody clicks anything.
 *
 * Each tab is one instruction someone types, the systems it reaches, and the
 * view whoever owns that job opens afterwards. The screens are drawn rather
 * than photographed, because a screenshot is either a client's real data or
 * a fake dressed as one; each says as much underneath it.
 */
export function IndustryCard({ industry }: { industry: Industry }) {
  const [active, setActive] = useState(0);
  const tab = industry.tabs[active];

  return (
    <article
      id={industry.id}
      className="card scroll-mt-24 overflow-hidden p-6 sm:p-8"
    >
      {/* Which industry, and why these three jobs ------------------- */}
      <header className="flex items-start gap-4">
        <span className="bg-brand-deep grid size-11 shrink-0 place-items-center rounded-xl text-white">
          <Icon name={industry.icon} className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="display text-ink text-[1.5rem] sm:text-[1.75rem]">
            {industry.label}
          </h3>
          <p className="text-ink-soft mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
            {industry.lede}
          </p>
        </div>
      </header>

      {/* The jobs ---------------------------------------------------- */}
      <div
        role="tablist"
        aria-label={`${industry.label} — what the agent does`}
        className="border-line bg-mist mt-7 flex gap-1 overflow-x-auto rounded-full border p-1 lg:w-fit"
      >
        {industry.tabs.map((entry, i) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            id={`${industry.id}-tab-${entry.id}`}
            aria-selected={i === active}
            aria-controls={`${industry.id}-panel-${entry.id}`}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-[0.875rem] font-semibold whitespace-nowrap transition-colors ${
              i === active
                ? "bg-ink text-cta-fg"
                : "text-ink-soft hover:bg-surface hover:text-ink"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${industry.id}-panel-${tab.id}`}
        aria-labelledby={`${industry.id}-tab-${tab.id}`}
        className="mt-6 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10"
      >
        {/* Left — what this job is */}
        <div className="min-w-0">
          <h4 className="display text-ink text-[1.25rem] leading-tight sm:text-[1.375rem]">
            {tab.title}
          </h4>
          <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
            {tab.body}
          </p>

          <ul className="mt-5 space-y-2.5">
            {tab.points.map((point) => (
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
          <div className="bg-night mt-6 rounded-2xl p-5 text-white/80">
            <p className="text-[0.625rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
              What you ask for
            </p>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed">
              {tab.prompt}
            </p>
            <p className="mt-5 text-[0.625rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
              Connected to
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {tab.connectors.map((connector) => (
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
        <figure className="border-line bg-surface min-w-0 self-start overflow-hidden rounded-2xl border shadow-[0_24px_60px_-30px_rgba(14,27,38,0.35)]">
          <div className="bg-night flex items-center gap-2.5 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </span>
            <span className="truncate font-mono text-[0.75rem] text-white/70">
              {tab.screen.file}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-[0.8125rem]">
              <thead className="bg-mist border-line-soft border-b">
                <tr>
                  {tab.screen.columns.map((column) => (
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
                {tab.screen.rows.map((row) => (
                  <tr
                    key={row.cells.join("|")}
                    className={`border-line-soft border-b last:border-0 ${
                      row.tone === "total" ? "bg-mist/60" : ""
                    } ${row.tone === "warn" ? "bg-amber-wash/60" : ""}`}
                  >
                    {row.cells.map((cell, i) => {
                      /*
                       * A verdict colours the cell that carries it, not the
                       * line it is on. Colouring the whole row turned a
                       * confirmed appointment into four green cells, which
                       * reads as decoration rather than as a status.
                       */
                      const last = i === row.cells.length - 1;
                      const whole =
                        row.tone === "muted" || row.tone === "total";
                      const tone =
                        whole || last ? TONE[row.tone ?? ""] : undefined;
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
            {tab.screen.sheets.map((sheet, i) => (
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
    </article>
  );
}
