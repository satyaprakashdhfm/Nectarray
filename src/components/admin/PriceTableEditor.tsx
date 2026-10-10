"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  resetPriceTable,
  savePriceTable,
} from "@/app/admin/(panel)/integrations/actions";
import type { Cell, Column, PriceRow, PriceTable } from "@/lib/price-book";
import { cn } from "@/lib/utils";

type Currency = "usd" | "inr";

/** A row while it is being edited: every cell as the text in its box. */
type DraftRow = {
  id: string;
  inputs: string[];
  /** Per money cell, which currency its number is in. */
  currencies: Currency[];
};

const CONFIDENCE = ["Official", "Secondary", "Low"];

/**
 * A price book table with every cell open for editing, rows to add and
 * delete, and Save. What is typed is turned back into prices here; the
 * server checks it again against the table's columns before saving.
 */
export function TableEditor({
  sheet,
  table,
  onDone,
}: {
  sheet: string;
  table: PriceTable;
  onDone: () => void;
}) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // An empty price, or one in a new row, starts in its column's currency.
  const [columnCurrency] = useState(() =>
    table.columns.map((_, i) => currencyOf(table.rows, i)),
  );
  const [rows, setRows] = useState<DraftRow[]>(() =>
    table.rows.map((row) => toDraft(row, table.columns, columnCurrency)),
  );

  const change = (id: string, col: number, patch: Partial<Cellish>) =>
    setRows((list) =>
      list.map((r) =>
        r.id !== id
          ? r
          : {
              ...r,
              inputs: r.inputs.map((v, i) =>
                i === col ? (patch.input ?? v) : v,
              ),
              currencies: r.currencies.map((c, i) =>
                i === col ? (patch.currency ?? c) : c,
              ),
            },
      ),
    );

  const addRow = () =>
    setRows((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        inputs: table.columns.map(() => ""),
        currencies: columnCurrency,
      },
    ]);

  const save = () =>
    startSaving(async () => {
      setError(null);
      const result = await savePriceTable(
        sheet,
        table.id,
        rows.map((r) => ({
          id: r.id,
          cells: table.columns.map((c, i) =>
            toCell(r.inputs[i], c, r.currencies[i]),
          ),
        })),
      );
      if (!result.ok) return setError(result.error);
      router.refresh();
      onDone();
    });

  const reset = () => {
    if (
      !confirm(
        `Put "${table.title}" back to the workbook's rows? Your edits to this table will be lost.`,
      )
    )
      return;
    startSaving(async () => {
      setError(null);
      const result = await resetPriceTable(sheet, table.id);
      if (!result.ok) return setError(result.error);
      router.refresh();
      onDone();
    });
  };

  return (
    <div className="border-brand/40 bg-surface mt-3 rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.8125rem]">
          <thead>
            <tr className="bg-mist">
              {table.columns.map((column, i) => (
                <th
                  key={i}
                  scope="col"
                  className="border-line text-ink-soft border-b px-2 py-2 font-semibold whitespace-nowrap"
                >
                  {column.label}
                  {column.kind === "percent" && (
                    <span className="text-ink-faint font-normal"> (%)</span>
                  )}
                  {column.unit && (
                    <span className="text-ink-faint font-normal">
                      {" "}
                      ({column.unit})
                    </span>
                  )}
                </th>
              ))}
              <th className="border-line border-b px-2 py-2">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-line-soft border-b align-top last:border-b-0"
              >
                {table.columns.map((column, col) => (
                  <td key={col} className="px-2 py-1.5">
                    <CellInput
                      column={column}
                      value={row.inputs[col]}
                      currency={row.currencies[col]}
                      label={`${column.label}, row ${row.inputs[0] || "new"}`}
                      onChange={(patch) => change(row.id, col, patch)}
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setRows((list) => list.filter((r) => r.id !== row.id))
                    }
                    aria-label={`Delete row ${row.inputs[0] || "new"}`}
                    title="Delete row"
                    className="text-ink-faint hover:text-danger hover:bg-mist rounded-md p-1.5 transition-colors"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-line flex flex-wrap items-center gap-2 border-t px-3 py-2.5">
        <button
          type="button"
          onClick={addRow}
          className="border-line text-ink hover:border-brand inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden />
          Add row
        </button>
        {table.edited && (
          <button
            type="button"
            onClick={reset}
            disabled={saving}
            className="text-ink-soft hover:text-ink inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[0.8125rem] font-semibold disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Back to workbook
          </button>
        )}
        {error && (
          <p role="alert" className="text-danger text-[0.8125rem]">
            {error}
          </p>
        )}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={onDone}
            disabled={saving}
            className="text-ink-soft hover:text-ink rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="bg-brand-solid text-cta-fg rounded-lg px-4 py-1.5 text-[0.8125rem] font-semibold transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </div>
      <p className="text-ink-faint px-3 pb-3 text-[0.75rem]">
        Prices take a number in $ or ₹ (choose beside it), or a word such as
        Custom. Percentages are typed as percent: 2 for 2%. Leave a cell empty
        when it does not apply.
      </p>
    </div>
  );
}

type Cellish = { input: string; currency: Currency };

function CellInput({
  column,
  value,
  currency,
  label,
  onChange,
}: {
  column: Column;
  value: string;
  currency: Currency;
  label: string;
  onChange: (patch: Partial<Cellish>) => void;
}) {
  const box =
    "border-line bg-surface text-ink focus:border-brand rounded-md border px-2 py-1 text-[0.8125rem] outline-none";

  if (column.kind === "long")
    return (
      <textarea
        value={value}
        rows={2}
        maxLength={2000}
        aria-label={label}
        onChange={(e) => onChange({ input: e.target.value })}
        className={cn(box, "w-full min-w-[16rem] resize-y")}
      />
    );
  if (column.kind === "confidence") {
    const options =
      CONFIDENCE.includes(value) || !value
        ? CONFIDENCE
        : [value, ...CONFIDENCE];
    return (
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange({ input: e.target.value })}
        className={cn(box, "w-full min-w-[7rem]")}
      >
        <option value="">None</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  }
  if (column.kind === "money")
    return (
      <div className="flex min-w-[8.5rem] gap-1">
        <select
          value={currency}
          aria-label={`${label}, currency`}
          onChange={(e) => onChange({ currency: e.target.value as Currency })}
          className={cn(box, "w-12 shrink-0 px-1")}
        >
          <option value="usd">$</option>
          <option value="inr">₹</option>
        </select>
        <input
          value={value}
          inputMode="decimal"
          maxLength={200}
          aria-label={label}
          onChange={(e) => onChange({ input: e.target.value })}
          className={cn(box, "w-full min-w-0 text-right")}
        />
      </div>
    );
  return (
    <input
      value={value}
      inputMode={column.kind === "text" ? undefined : "decimal"}
      maxLength={200}
      aria-label={label}
      onChange={(e) => onChange({ input: e.target.value })}
      className={cn(
        box,
        "w-full",
        column.kind === "text" ? "min-w-[9rem]" : "min-w-[5.5rem] text-right",
      )}
    />
  );
}

const moneyCurrency = (cell: Cell): Currency | null =>
  cell !== null && typeof cell === "object"
    ? "inr" in cell
      ? "inr"
      : "usd"
    : null;

/** The currency a column's prices are quoted in, going by its first price. */
function currencyOf(rows: PriceRow[], column: number): Currency {
  for (const row of rows) {
    const currency = moneyCurrency(row.cells[column]);
    if (currency) return currency;
  }
  return "usd";
}

function toDraft(
  row: PriceRow,
  columns: Column[],
  columnCurrency: Currency[],
): DraftRow {
  return {
    id: row.id,
    inputs: columns.map((column, i) => toInput(row.cells[i], column)),
    currencies: columns.map(
      (_, i) => moneyCurrency(row.cells[i]) ?? columnCurrency[i],
    ),
  };
}

function toInput(cell: Cell, column: Column): string {
  if (cell === null) return "";
  if (typeof cell === "object")
    return String("usd" in cell ? cell.usd : cell.inr);
  if (typeof cell === "number")
    // Shown as typed: 0.0215 is entered as 2.15 (%). Rounding clears float
    // noise such as 2.1500000000000004.
    return String(
      column.kind === "percent" ? Math.round(cell * 1e8) / 1e6 : cell,
    );
  return cell;
}

/** A number as people type it: "1,49,900", "$0.20", "2%". */
function parseNumber(text: string): number | null {
  const clean = text.replace(/[,\s$₹%]/g, "");
  return /^-?(\d+\.?\d*|\.\d+)$/.test(clean) ? Number(clean) : null;
}

function toCell(input: string, column: Column, currency: Currency): Cell {
  const text = input.trim();
  if (!text) return null;
  const number = parseNumber(text);
  switch (column.kind) {
    case "money":
      if (number === null) return text;
      return currency === "inr" ? { inr: number } : { usd: number };
    case "percent":
      return number === null ? text : number / 100;
    case "number":
      return number ?? text;
    default:
      return text;
  }
}
