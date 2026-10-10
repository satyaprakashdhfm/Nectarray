"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Pencil,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  FX_INR_PER_USD,
  type Cell,
  type Column,
  type PriceRow,
  type PriceTable,
  type Sheet,
} from "@/lib/price-book";
import { CostEstimator } from "@/components/admin/CostEstimator";
import { TableEditor } from "@/components/admin/PriceTableEditor";
import {
  formatMoney,
  inCurrency,
  isMoney,
  type Currency,
} from "@/lib/price-money";
import { cn } from "@/lib/utils";

/**
 * One sheet of the price book, laid out like the workbook it came from:
 * every table open at once. Search runs across all of them; each table can
 * be sorted by any column, filtered, and has rows that can be ticked and
 * set side by side.
 */
export function PriceSheet({ sheet }: { sheet: Sheet }) {
  const [currency, setCurrency] = useState<Currency>("usd");
  const [query, setQuery] = useState("");
  const apiPrices =
    sheet.slug === "ai-models"
      ? sheet.tables.find((t) => t.id === "api")
      : undefined;

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-2">
        <label className="border-line bg-surface focus-within:border-brand flex min-w-[14rem] flex-1 items-center gap-2 rounded-lg border px-3 sm:max-w-sm">
          <Search className="text-ink-faint size-4 shrink-0" aria-hidden />
          <span className="sr-only">Search this sheet</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this sheet"
            className="text-ink placeholder:text-ink-faint w-full bg-transparent py-2 text-[0.875rem] outline-none focus-visible:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-ink-faint hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </label>
        <div
          role="group"
          aria-label="Show prices in"
          className="border-line bg-surface flex rounded-lg border p-0.5"
        >
          {(
            [
              ["usd", "$ USD"],
              ["inr", "₹ INR"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCurrency(value)}
              aria-pressed={currency === value}
              className={cn(
                "rounded-md px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors",
                currency === value
                  ? "bg-brand-wash text-brand-deep"
                  : "text-ink-faint hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-ink-faint text-[0.75rem]">
          $1 = ₹{FX_INR_PER_USD}. Each price is converted from the currency it
          was quoted in.
        </p>
      </div>

      {apiPrices && <CostEstimator table={apiPrices} currency={currency} />}

      {sheet.tables.map((table) => (
        <PriceGrid
          key={table.id}
          sheet={sheet.slug}
          table={table}
          currency={currency}
          query={query.trim().toLowerCase()}
        />
      ))}

      {sheet.checks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-ink text-[1rem] font-semibold">
            Check before quoting
          </h2>
          <ul className="text-ink-soft mt-2 max-w-4xl list-disc space-y-1.5 pl-5 text-[0.8125rem]">
            {sheet.checks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {sheet.sources.length > 0 && (
        <section className="mt-8">
          <h2 className="text-ink text-[1rem] font-semibold">Sources</h2>
          <ul className="mt-2 grid gap-x-6 gap-y-1 text-[0.8125rem] sm:grid-cols-2 xl:grid-cols-3">
            {sheet.sources.map((s) => (
              <li key={s.url + s.label} className="min-w-0">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-deep inline-flex max-w-full items-center gap-1 hover:underline"
                >
                  <span className="truncate">{s.label}</span>
                  <ExternalLink className="size-3 shrink-0" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

type Sort = { column: number; descending: boolean } | null;

function PriceGrid({
  sheet,
  table,
  currency,
  query,
}: {
  sheet: string;
  table: PriceTable;
  currency: Currency;
  query: string;
}) {
  const [sort, setSort] = useState<Sort>(null);
  const [facets, setFacets] = useState<Record<number, string>>({});
  const [picked, setPicked] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);

  const facetColumns = table.columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => column.facet);

  const visible = useMemo(() => {
    const rows = table.rows
      .filter(({ cells }) =>
        Object.entries(facets).every(
          ([col, value]) => !value || cellText(cells[Number(col)]) === value,
        ),
      )
      .filter(
        ({ cells }) =>
          !query ||
          cells.some((c) => cellText(c).toLowerCase().includes(query)),
      );
    if (!sort) return rows;
    const kind = table.columns[sort.column].kind;
    return [...rows].sort((a, b) => {
      const x = sortValue(a.cells[sort.column], kind);
      const y = sortValue(b.cells[sort.column], kind);
      // Blanks stay at the bottom whichever way the column is sorted.
      if (x === null || y === null) return x === y ? 0 : x === null ? 1 : -1;
      const order =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y));
      return sort.descending ? -order : order;
    });
  }, [table, facets, query, sort]);

  const toggleSort = (column: number) =>
    setSort((s) =>
      s?.column !== column
        ? { column, descending: false }
        : s.descending
          ? null
          : { column, descending: true },
    );

  const togglePick = (id: string) =>
    setPicked((list) =>
      list.includes(id) ? list.filter((i) => i !== id) : [...list, id],
    );
  // Ticks on rows that an edit has since removed simply drop out.
  const pickedRows = picked
    .map((id) => table.rows.find((r) => r.id === id))
    .filter((r): r is PriceRow => r !== undefined);

  const nameOf = (cells: Cell[]) =>
    table.nameColumns.map((i) => cellText(cells[i])).join(" ");

  // Searching hides a table with nothing to show, so the sheet reads as
  // the answer rather than a stack of empty grids.
  if (query && visible.length === 0 && !editing) return null;

  return (
    <section className="mt-8" aria-labelledby={`t-${table.id}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <h2
          id={`t-${table.id}`}
          className="text-ink text-[1.0625rem] font-semibold"
        >
          {table.title}
        </h2>
        {!editing && (
          <div className="flex flex-wrap items-center gap-2">
            {facetColumns.map(({ column, index }) => (
              <FacetSelect
                key={index}
                label={column.label}
                values={distinct(
                  table.rows.map((r) => cellText(r.cells[index])),
                )}
                value={facets[index] ?? ""}
                onChange={(value) =>
                  setFacets((f) => ({ ...f, [index]: value }))
                }
              />
            ))}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="border-line bg-surface text-ink hover:border-brand inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.8125rem] font-semibold transition-colors active:scale-[0.98]"
            >
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <TableEditor
          sheet={sheet}
          table={table}
          onDone={() => setEditing(false)}
        />
      ) : (
        <>
          {table.compare && pickedRows.length > 0 && (
            <Comparison
              table={table}
              rows={pickedRows}
              currency={currency}
              nameOf={nameOf}
              onRemove={togglePick}
              onClear={() => setPicked([])}
            />
          )}

          <div className="border-line bg-surface mt-3 overflow-x-auto rounded-xl border">
            <table className="w-full border-collapse text-left text-[0.8125rem]">
              <thead>
                <tr className="bg-mist">
                  {table.columns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      aria-sort={
                        sort?.column === index
                          ? sort.descending
                            ? "descending"
                            : "ascending"
                          : undefined
                      }
                      className={cn(
                        "border-line border-b px-3 py-2 align-bottom font-semibold",
                        index === 0 && "bg-mist sticky left-0 z-[1]",
                        isNumeric(column) && "text-right",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(index)}
                        className={cn(
                          "text-ink-soft hover:text-ink inline-flex items-center gap-1 text-left whitespace-nowrap",
                          isNumeric(column) && "flex-row-reverse",
                        )}
                      >
                        <span>
                          {column.label}
                          {column.unit && (
                            <span className="text-ink-faint font-normal">
                              {" "}
                              ({column.unit})
                            </span>
                          )}
                        </span>
                        <SortIcon
                          state={
                            sort?.column === index
                              ? sort.descending
                                ? "down"
                                : "up"
                              : "none"
                          }
                        />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => {
                  const { cells } = row;
                  const isPicked = picked.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "group border-line-soft border-b last:border-b-0",
                        isPicked && "bg-brand-wash/60",
                      )}
                    >
                      {table.columns.map((column, col) => (
                        <td
                          key={col}
                          className={cn(
                            "px-3 py-2 align-top",
                            col === 0 &&
                              cn(
                                "text-ink sticky left-0 z-[1] max-w-[16rem] min-w-[10rem] font-semibold",
                                isPicked ? "bg-brand-wash" : "bg-surface",
                              ),
                            col !== 0 && cellClass(column),
                          )}
                        >
                          {col === 0 && table.compare ? (
                            <label className="flex cursor-pointer items-start gap-2">
                              <input
                                type="checkbox"
                                checked={isPicked}
                                onChange={() => togglePick(row.id)}
                                aria-label={`Compare ${nameOf(cells)}`}
                                className="accent-brand mt-0.5 size-3.5 shrink-0"
                              />
                              <CellView
                                cell={cells[col]}
                                column={column}
                                currency={currency}
                                href={col === 0 ? row.href : undefined}
                              />
                            </label>
                          ) : (
                            <CellView
                              cell={cells[col]}
                              column={column}
                              currency={currency}
                              href={col === 0 ? row.href : undefined}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {visible.length === 0 && (
                  <tr>
                    <td
                      colSpan={table.columns.length}
                      className="text-ink-faint px-3 py-6 text-center"
                    >
                      No rows match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {table.edited && !editing && (
        <p className="text-ink-faint mt-2 text-[0.75rem]">
          Edited by {table.edited.by} on{" "}
          {new Date(table.edited.at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          .
        </p>
      )}
      {table.note && (
        <p className="text-ink-faint mt-2 max-w-4xl text-[0.75rem]">
          {table.note}
        </p>
      )}
    </section>
  );
}

/**
 * The ticked rows turned on their side: one column each, one line per
 * field, with the lowest price on each line marked.
 */
function Comparison({
  table,
  rows,
  currency,
  nameOf,
  onRemove,
  onClear,
}: {
  table: PriceTable;
  rows: PriceRow[];
  currency: Currency;
  nameOf: (cells: Cell[]) => string;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (rows.length < 2)
    return (
      <p className="bg-brand-wash text-brand-deep mt-3 rounded-lg px-3 py-2 text-[0.8125rem]">
        Tick one more row to compare it with {nameOf(rows[0].cells)}.
      </p>
    );

  const fields = table.columns
    .map((column, index) => ({ column, index }))
    .filter(({ index }) => !table.nameColumns.includes(index));

  return (
    <div className="border-brand/40 bg-surface mt-3 overflow-hidden rounded-xl border">
      <div className="bg-brand-wash flex items-center justify-between gap-3 px-3 py-2">
        <p className="text-brand-deep text-[0.8125rem] font-semibold">
          Comparing {rows.length}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-brand-deep text-[0.75rem] font-semibold hover:underline"
        >
          Clear
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.8125rem]">
          <thead>
            <tr>
              <th className="bg-surface border-line sticky left-0 z-[1] w-40 border-b px-3 py-2" />
              {rows.map((row) => (
                <th
                  key={row.id}
                  scope="col"
                  className="border-line text-ink min-w-[11rem] border-b px-3 py-2 align-top font-semibold"
                >
                  <span className="flex items-start justify-between gap-2">
                    {nameOf(row.cells)}
                    <button
                      type="button"
                      onClick={() => onRemove(row.id)}
                      aria-label={`Remove ${nameOf(row.cells)}`}
                      className="text-ink-faint hover:text-ink mt-0.5"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map(({ column, index }) => {
              const lowest = lowestOf(
                column,
                rows.map((r) => r.cells[index]),
              );
              return (
                <tr
                  key={index}
                  className="border-line-soft border-b last:border-b-0"
                >
                  <th
                    scope="row"
                    className="bg-surface text-ink-faint sticky left-0 z-[1] px-3 py-2 align-top text-[0.75rem] font-semibold"
                  >
                    {column.label}
                    {column.unit && ` (${column.unit})`}
                  </th>
                  {rows.map((row) => {
                    const cell = row.cells[index];
                    const best =
                      lowest !== null &&
                      sortValue(cell, column.kind) === lowest;
                    return (
                      <td
                        key={row.id}
                        className={cn(
                          "px-3 py-2 align-top",
                          column.kind === "long" ? "text-ink-soft" : "text-ink",
                          best && "text-leaf-deep font-semibold",
                        )}
                      >
                        <CellView
                          cell={cell}
                          column={column}
                          currency={currency}
                        />
                        {best && (
                          <span className="text-leaf-deep ml-1.5 text-[0.6875rem]">
                            lowest
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FacetSelect({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-ink-faint flex items-center gap-1.5 text-[0.75rem] font-semibold">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-line bg-surface focus:border-brand rounded-md border px-2 py-1 text-[0.8125rem] font-medium outline-none",
          value ? "text-brand-deep" : "text-ink",
        )}
      >
        <option value="">All</option>
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}

function SortIcon({ state }: { state: "up" | "down" | "none" }) {
  const props = { className: "size-3 shrink-0", "aria-hidden": true } as const;
  if (state === "up") return <ArrowUp {...props} />;
  if (state === "down") return <ArrowDown {...props} />;
  return <ArrowUpDown {...props} className="size-3 shrink-0 opacity-35" />;
}

function CellView({
  cell,
  column,
  currency,
  href,
}: {
  cell: Cell;
  column: Column;
  currency: Currency;
  href?: string;
}) {
  if (cell === null || cell === "") return null;
  if (column.kind === "confidence" && typeof cell === "string")
    return <ConfidencePill value={cell} />;
  const text = formatCell(cell, column, currency);
  if (href)
    return (
      <Link href={href} className="text-brand-deep hover:underline">
        {text}
      </Link>
    );
  // A converted price says what it was quoted as, on hover.
  if (isMoney(cell) && !(currency in cell))
    return <span title={`Quoted as ${cellText(cell)}`}>{text}</span>;
  return <>{text}</>;
}

function ConfidencePill({ value }: { value: string }) {
  const tone = /^official/i.test(value)
    ? "bg-leaf-wash text-leaf-deep"
    : /^(secondary|reported)/i.test(value)
      ? "bg-brand-wash text-brand-deep"
      : "bg-amber-wash text-amber-deep";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap",
        tone,
      )}
    >
      {value}
    </span>
  );
}

const isNumeric = (column: Column) =>
  column.kind === "money" ||
  column.kind === "number" ||
  column.kind === "percent";

function cellClass(column: Column) {
  switch (column.kind) {
    case "long":
      return "text-ink-soft min-w-[18rem] max-w-[28rem]";
    case "text":
      return "text-ink min-w-[7rem]";
    case "confidence":
      return "";
    default:
      return "text-ink text-right whitespace-nowrap";
  }
}

function formatCell(cell: Cell, column: Column, currency: Currency) {
  if (cell === null) return "";
  if (isMoney(cell)) return formatMoney(cell, currency);
  if (typeof cell === "number") {
    if (column.kind === "percent")
      return `${(cell * 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
    return cell.toLocaleString("en-US", {
      maximumFractionDigits: Math.abs(cell) < 10 ? 2 : 0,
    });
  }
  return cell;
}

/** The text a cell is searched and filtered by. */
function cellText(cell: Cell) {
  if (cell === null) return "";
  if (isMoney(cell)) return formatMoney(cell, "usd" in cell ? "usd" : "inr");
  return String(cell);
}

function sortValue(cell: Cell, kind: Column["kind"]): number | string | null {
  if (cell === null || cell === "") return null;
  if (isMoney(cell)) return inCurrency(cell, "usd");
  if (typeof cell === "number") return cell;
  // A word in a price column ("Custom") sorts after every number.
  if (kind === "money" || kind === "number" || kind === "percent") return null;
  return cell.toLowerCase();
}

/** The lowest price among the compared cells, if there is a real lowest. */
function lowestOf(column: Column, cells: Cell[]) {
  if (column.kind !== "money" && column.kind !== "percent") return null;
  const values = cells
    .map((c) => sortValue(c, column.kind))
    .filter((v): v is number => typeof v === "number");
  if (values.length < 2) return null;
  const min = Math.min(...values);
  return values.every((v) => v === min) ? null : min;
}

function distinct(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}
