"use client";

import { useState } from "react";
import { HandCoins, Plus, X } from "lucide-react";
import { saveCommissions } from "@/app/admin/(panel)/business-actions";
import { SaveState, useAutoSave } from "@/components/admin/autosave";
import { field, quietButton } from "@/components/admin/Business";
import { rupees } from "@/lib/business";
import {
  commissionAmount,
  realCommissions,
  type Commission,
} from "@/lib/commissions";
import { cn } from "@/lib/utils";

/** A commission as typed: the numbers kept as text while they are edited. */
type Draft = {
  id: string;
  name: string;
  percent: string;
  amount: string;
  paidOn: string;
};

const toDraft = (c: Commission): Draft => ({
  id: c.id,
  name: c.name,
  percent: c.percent ? String(c.percent) : "",
  amount: c.amount == null ? "" : String(c.amount),
  paidOn: c.paidOn,
});

const toCommission = (d: Draft): Commission => {
  const amount = d.amount.trim() === "" ? null : Number(d.amount);
  return {
    id: d.id,
    name: d.name.trim(),
    percent: Number(d.percent) || 0,
    amount: amount != null && Number.isFinite(amount) ? amount : null,
    paidOn: d.paidOn,
  };
};

/**
 * Commission given on a project or on a student's fee: who gets it and
 * their percent of what we received. The amount works itself out from the
 * percent; typing an amount fixes it instead. A paid date takes it off the
 * company's money; until then it is listed as still to pay. Saves itself.
 */
export function Commissions({
  on,
  id,
  base,
  initial,
  compact = false,
}: {
  on: "project" | "enrolment";
  /** The project or the enrolment. */
  id: string;
  /** What we received, that the percent is of. */
  base: number;
  initial: Commission[];
  /** Narrow, for a cell in the students table. */
  compact?: boolean;
}) {
  const [rows, setRows] = useState<Draft[]>(() => initial.map(toDraft));
  const save = useAutoSave(rows, (r) =>
    saveCommissions(on, id, r.map(toCommission)),
  );

  const set = (i: number, patch: Partial<Draft>) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () =>
    setRows([
      ...rows,
      {
        id: crypto.randomUUID(),
        name: "",
        percent: "",
        amount: "",
        paidOn: "",
      },
    ]);
  const total = realCommissions(rows.map(toCommission)).reduce(
    (n, c) => n + commissionAmount(c, base),
    0,
  );

  return (
    <div className={cn(compact ? "mt-2" : "")}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={cn(
            "text-ink-faint inline-flex items-center gap-1 font-semibold",
            compact ? "text-[0.6875rem]" : "text-[0.75rem]",
          )}
        >
          <HandCoins className="size-3.5" aria-hidden />
          Commission
          {total > 0 && (
            <span className="text-ink tabular-nums">
              {" "}
              · {rupees.format(total)}
            </span>
          )}
        </span>
        {rows.length > 0 && (
          <SaveState
            status={save.status}
            error={save.error}
            onRetry={save.saveNow}
            className="ml-auto text-[0.6875rem]"
          />
        )}
      </div>
      {!compact && (
        <p className="text-ink-faint mt-0.5 text-[0.6875rem]">
          A share of the {rupees.format(base)} received. It stays in the revenue
          and comes off the profit; give it a paid date once it is paid.
        </p>
      )}

      {rows.length > 0 && (
        <ul className={cn("mt-1.5", compact ? "space-y-2" : "space-y-1.5")}>
          {rows.map((r, i) => {
            const c = toCommission(r);
            const auto = Math.round((base * c.percent) / 100);
            return (
              <li
                key={r.id}
                className={cn(
                  "grid items-center gap-1.5",
                  compact
                    ? "border-line-soft grid-cols-[1fr_4.5rem_auto] rounded-lg border p-1.5"
                    : "grid-cols-[minmax(0,1fr)_5rem_7rem_9.5rem_auto]",
                )}
              >
                <input
                  value={r.name}
                  onChange={(e) => set(i, { name: e.target.value })}
                  placeholder="Person"
                  aria-label="Who gets the commission"
                  className={cn(field, compact && "col-span-1")}
                />
                <label className="relative block">
                  <input
                    value={r.percent}
                    onChange={(e) => set(i, { percent: e.target.value })}
                    inputMode="decimal"
                    placeholder="0"
                    aria-label="Commission percent"
                    className={cn(field, "pr-6 tabular-nums")}
                  />
                  <span className="text-ink-faint pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[0.75rem]">
                    %
                  </span>
                </label>
                {compact && (
                  <button
                    type="button"
                    onClick={() => setRows(rows.filter((_, j) => j !== i))}
                    aria-label="Remove commission"
                    className="text-ink-faint hover:text-danger hover:bg-mist grid size-7 place-items-center rounded-md"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
                <label className="relative block">
                  <span className="text-ink-faint pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-[0.75rem]">
                    ₹
                  </span>
                  <input
                    value={r.amount}
                    onChange={(e) => set(i, { amount: e.target.value })}
                    inputMode="decimal"
                    placeholder={String(auto)}
                    title="Worked out from the percent; type to fix an amount"
                    aria-label="Commission amount"
                    className={cn(
                      field,
                      "placeholder:text-ink pl-5 font-semibold tabular-nums",
                    )}
                  />
                </label>
                <input
                  type="date"
                  value={r.paidOn}
                  onChange={(e) => set(i, { paidOn: e.target.value })}
                  title="The day it was paid; empty while still to pay"
                  aria-label="Commission paid on"
                  className={cn(
                    field,
                    compact && "col-span-2",
                    !r.paidOn && "text-ink-faint",
                  )}
                />
                {!compact && (
                  <button
                    type="button"
                    onClick={() => setRows(rows.filter((_, j) => j !== i))}
                    aria-label="Remove commission"
                    className="text-ink-faint hover:text-danger hover:bg-mist grid size-7 place-items-center rounded-md"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {!compact && rows.length > 0 && (
        <p className="text-ink-faint mt-1 text-[0.6875rem]">
          Person · percent · amount (filled from the percent) · paid on
        </p>
      )}

      <button
        type="button"
        onClick={add}
        className={cn(
          quietButton,
          "mt-1.5 inline-flex items-center gap-1",
          compact && "px-2 py-1 text-[0.75rem]",
        )}
      >
        <Plus className="size-3.5" aria-hidden />
        Add commission
      </button>
    </div>
  );
}
