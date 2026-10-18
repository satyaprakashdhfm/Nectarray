"use client";

import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, Search, Trash2, X } from "lucide-react";
import { deleteAssetEntry } from "@/app/admin/(panel)/assets/actions";
import { field } from "@/components/admin/Business";
import { rupees } from "@/lib/business";
import type { Movement } from "@/lib/assets";
import { isMonth, monthLabel } from "@/lib/project-details";
import { cn } from "@/lib/utils";

/** What each kind of movement is called in the log. */
const KINDS: Record<string, string> = {
  payment: "Client payment",
  repaid: "Client paid back",
  bill: "Bill paid",
  "entry-in": "Money added",
  "entry-out": "Spent",
};
const kindOf = (m: Movement) =>
  m.source === "entry" ? `entry-${m.kind}` : m.source;

const day = (value: string) =>
  isMonth(value)
    ? monthLabel(value)
    : new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

/**
 * The company balance as a button that opens its full history: every rupee
 * in and out, newest first, with the balance after each, and filters for
 * direction, kind, project, month and words.
 */
export function BalanceLog({
  balance,
  movements,
  children,
  className,
}: {
  balance: number;
  movements: Movement[];
  /** What the button shows. */
  children: ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [dir, setDir] = useState<"all" | "in" | "out">("all");
  const [kind, setKind] = useState("all");
  const [project, setProject] = useState("all");
  const [month, setMonth] = useState("all");
  const [query, setQuery] = useState("");

  // Oldest first to add up the balance after each one; shown newest first.
  const rows = useMemo(() => {
    const oldest = [...movements].sort((a, b) => a.on.localeCompare(b.on));
    const out: (Movement & { after: number })[] = [];
    for (const m of oldest) {
      const before = out.at(-1)?.after ?? 0;
      out.push({
        ...m,
        after: before + (m.kind === "in" ? m.amount : -m.amount),
      });
    }
    return out.reverse();
  }, [movements]);

  const projects = [
    ...new Map(
      movements.filter((m) => m.project).map((m) => [m.id, m.project!]),
    ),
  ].sort((a, b) => a[1].localeCompare(b[1]));
  const months = [...new Set(movements.map((m) => m.on.slice(0, 7)))]
    .sort()
    .reverse();

  const q = query.trim().toLowerCase();
  const shown = rows.filter(
    (m) =>
      (dir === "all" || m.kind === dir) &&
      (kind === "all" || kindOf(m) === kind) &&
      (project === "all" || (m.source !== "entry" && m.id === project)) &&
      (month === "all" || m.on.startsWith(month)) &&
      (!q || `${m.reason} ${m.project ?? ""}`.toLowerCase().includes(q)),
  );
  const totalIn = shown
    .filter((m) => m.kind === "in")
    .reduce((n, m) => n + m.amount, 0);
  const totalOut = shown
    .filter((m) => m.kind === "out")
    .reduce((n, m) => n + m.amount, 0);
  const filtered =
    dir !== "all" ||
    kind !== "all" ||
    project !== "all" ||
    month !== "all" ||
    q;

  const clear = () => {
    setDir("all");
    setKind("all");
    setProject("all");
    setMonth("all");
    setQuery("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={cn("text-left", className)}
        title="See the full history"
      >
        {children}
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => {
          // A click on the dimmed backdrop closes it.
          if (e.target === dialog.current) dialog.current.close();
        }}
        className="bg-surface text-ink m-auto h-[min(92vh,52rem)] w-[min(96vw,64rem)] max-w-none overflow-hidden rounded-2xl p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex h-full flex-col">
          <header className="border-line flex items-start gap-4 border-b px-4 py-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Company balance</p>
              <p
                className={cn(
                  "display mt-1 text-[1.75rem] leading-none sm:text-[2.25rem]",
                  balance < 0 ? "text-danger" : "text-ink",
                )}
              >
                {rupees.format(balance)}
              </p>
              <p className="text-ink-faint mt-1.5 text-[0.75rem]">
                Client money comes in by itself; anything marked company paid,
                or paid back to a person, goes out.
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="text-ink-faint hover:text-ink hover:bg-mist grid size-9 shrink-0 place-items-center rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          </header>

          <div className="border-line bg-mist/40 space-y-2.5 border-b px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Direction"
                className="bg-mist inline-flex rounded-lg p-0.5"
              >
                {(
                  [
                    ["all", "All"],
                    ["in", "Money in"],
                    ["out", "Money out"],
                  ] as const
                ).map(([id, text]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDir(id)}
                    aria-pressed={dir === id}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors",
                      dir === id
                        ? "bg-surface text-ink shadow-sm"
                        : "text-ink-faint hover:text-ink",
                    )}
                  >
                    {text}
                  </button>
                ))}
              </div>
              <label className="relative min-w-[12rem] flex-1">
                <Search
                  className="text-ink-faint pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: Railway, rent, a client…"
                  aria-label="Search the history"
                  className={cn(field, "py-1.5 pl-8")}
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                aria-label="Kind"
                className={cn(field, "py-1.5")}
              >
                <option value="all">Every kind</option>
                {Object.entries(KINDS).map(([id, text]) => (
                  <option key={id} value={id}>
                    {text}
                  </option>
                ))}
              </select>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                aria-label="Project"
                className={cn(field, "py-1.5")}
              >
                <option value="all">Every project</option>
                {projects.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                aria-label="Month"
                className={cn(field, "py-1.5")}
              >
                <option value="all">Every month</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(m)}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-ink-soft flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] tabular-nums">
              <span>
                {shown.length} {shown.length === 1 ? "entry" : "entries"}
              </span>
              <span className="text-leaf-deep inline-flex items-center gap-1 font-semibold">
                <ArrowDownLeft className="size-3.5" aria-hidden />
                {rupees.format(totalIn)} in
              </span>
              <span className="text-ink inline-flex items-center gap-1 font-semibold">
                <ArrowUpRight className="text-ink-faint size-3.5" aria-hidden />
                {rupees.format(totalOut)} out
              </span>
              {filtered && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-brand-deep hover:text-ink ml-auto font-semibold"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {shown.length === 0 ? (
              <p className="text-ink-faint px-6 py-12 text-center text-[0.875rem]">
                Nothing matches.
              </p>
            ) : (
              <table className="w-full text-left text-[0.8125rem]">
                <thead className="bg-surface sticky top-0 z-10 shadow-[0_1px_0_var(--color-line)]">
                  <tr className="text-ink-faint text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
                    <th className="px-4 py-2.5 sm:pl-6">Date</th>
                    <th className="px-2 py-2.5">What</th>
                    <th className="px-2 py-2.5 text-right">Amount</th>
                    <th className="hidden px-4 py-2.5 text-right sm:table-cell sm:pr-6">
                      Balance after
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-line-soft divide-y">
                  {shown.map((m) => (
                    <tr key={m.key} className="hover:bg-mist/50 align-top">
                      <td className="text-ink-soft px-4 py-2.5 whitespace-nowrap sm:pl-6">
                        {day(m.on)}
                      </td>
                      <td className="min-w-0 px-2 py-2.5">
                        <p className="text-ink break-words">{m.reason}</p>
                        <p className="text-ink-faint mt-0.5 text-[0.75rem]">
                          <span
                            className={cn(
                              "mr-1.5 inline-block rounded-full px-1.5 py-px text-[0.6875rem] font-semibold",
                              m.kind === "in"
                                ? "bg-leaf-wash text-leaf-deep"
                                : "bg-mist text-ink-soft",
                            )}
                          >
                            {KINDS[kindOf(m)]}
                          </span>
                          {m.source !== "entry" && m.project && (
                            <Link
                              href={`${ADMIN}/projects/${m.id}`}
                              className="hover:text-brand-deep underline-offset-2 hover:underline"
                            >
                              {m.project}
                            </Link>
                          )}
                          {m.repaidTo && ` · paid back to ${m.repaidTo}`}
                        </p>
                      </td>
                      <td
                        className={cn(
                          "px-2 py-2.5 text-right font-semibold whitespace-nowrap tabular-nums",
                          m.kind === "in" ? "text-leaf-deep" : "text-ink",
                        )}
                      >
                        {m.kind === "in" ? (
                          <ArrowDownLeft
                            className="mr-0.5 inline size-3.5 align-[-0.2em]"
                            aria-label="In"
                          />
                        ) : (
                          <ArrowUpRight
                            className="text-ink-faint mr-0.5 inline size-3.5 align-[-0.2em]"
                            aria-label="Out"
                          />
                        )}
                        {rupees.format(m.amount)}
                        {m.source === "entry" && (
                          <form
                            action={deleteAssetEntry}
                            onSubmit={(e) => {
                              if (!confirm(`Remove "${m.reason}"?`))
                                e.preventDefault();
                            }}
                            className="ml-1 inline"
                          >
                            <input type="hidden" name="id" value={m.id} />
                            <button
                              aria-label={`Remove ${m.reason}`}
                              title="Remove"
                              className="text-ink-faint hover:text-danger align-[-0.15em]"
                            >
                              <Trash2 className="inline size-3.5" />
                            </button>
                          </form>
                        )}
                        <span className="text-ink-faint block text-[0.6875rem] font-normal sm:hidden">
                          after {rupees.format(m.after)}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "hidden px-4 py-2.5 text-right whitespace-nowrap tabular-nums sm:table-cell sm:pr-6",
                          m.after < 0 ? "text-danger" : "text-ink-soft",
                        )}
                      >
                        {rupees.format(m.after)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
