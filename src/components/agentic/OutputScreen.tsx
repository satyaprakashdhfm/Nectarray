import type { agenticAiPage } from "@/lib/content";

type Screen =
  (typeof agenticAiPage)["industries"][number]["tabs"][number]["screen"];

/** How a verdict reads. Every one of these is illustration, not real data. */
const TONE: Record<string, string> = {
  good: "text-leaf-deep",
  bad: "text-danger",
  warn: "text-amber-deep",
  muted: "text-ink-faint italic",
  total: "text-ink font-semibold",
};

/**
 * The view whoever owns the job opens afterwards, drawn as a spreadsheet.
 *
 * Drawn rather than photographed: a screenshot here is either a customer's
 * real data or a fake dressed up as one, and the caption says as much. Lifted
 * out of IndustryCard when the worked examples moved into the domain panel,
 * so the two places that show an output cannot drift apart.
 */
export function OutputScreen({ screen }: { screen: Screen }) {
  return (
    <figure className="border-line bg-surface min-w-0 self-start overflow-hidden rounded-2xl border shadow-[0_24px_60px_-30px_rgba(14,27,38,0.35)]">
      <div className="bg-night flex items-center gap-2.5 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </span>
        <span className="truncate font-mono text-[0.75rem] text-white/70">
          {screen.file}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] text-left text-[0.8125rem]">
          <thead className="bg-mist border-line-soft border-b">
            <tr>
              {screen.columns.map((column) => (
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
            {screen.rows.map((row) => (
              <tr
                key={row.cells.join("|")}
                className={`border-line-soft border-b last:border-0 ${
                  row.tone === "total" ? "bg-mist/60" : ""
                } ${row.tone === "warn" ? "bg-amber-wash/60" : ""}`}
              >
                {row.cells.map((cell, i) => {
                  /*
                   * A verdict colours the cell that carries it, not the line
                   * it is on. Colouring the whole row turned a confirmed
                   * appointment into four green cells, which reads as
                   * decoration rather than as a status.
                   */
                  const last = i === row.cells.length - 1;
                  const whole = row.tone === "muted" || row.tone === "total";
                  const tone = whole || last ? TONE[row.tone ?? ""] : undefined;
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
        {screen.sheets.map((sheet, i) => (
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
  );
}
