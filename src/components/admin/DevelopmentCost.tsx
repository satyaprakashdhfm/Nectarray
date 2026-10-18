import { CalendarDays, Check, Hammer, Plus, X } from "lucide-react";
import {
  addPayment,
  deletePayment,
  setProjectValue,
} from "@/app/admin/(panel)/business-actions";
import { AutoSaveForm } from "@/components/admin/autosave";
import { field, primaryButton } from "@/components/admin/Business";
import { rupees } from "@/lib/business";
import { todayIST } from "@/lib/work";
import { cn } from "@/lib/utils";

const day = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * The one-time price for building the project, at the top of its page:
 * what we charge, every payment the client has made towards it with its
 * date, and what is still to come. The monthly running costs are further
 * down, on Amounts paid.
 */
export function DevelopmentCost({
  projectId,
  expected,
  quoted,
  payments,
}: {
  projectId: string;
  /** The agreed one-time price, or null while it is not set. */
  expected: number | null;
  /** The quotation's one-time total, offered while nothing is set. */
  quoted: number | null;
  /** Newest first. */
  payments: { id: string; amount: number; on: string; ref: string | null }[];
}) {
  const received = payments.reduce((n, p) => n + p.amount, 0);
  const left = expected == null ? null : Math.max(0, expected - received);
  const share =
    expected && expected > 0 ? Math.min(1, received / expected) : null;
  const paidUp = expected != null && expected > 0 && left === 0;
  const last = payments[0];

  return (
    <section className="card mt-5 overflow-hidden p-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-4 sm:px-5">
        <span className="bg-brand-wash text-brand-deep grid size-8 place-items-center rounded-lg">
          <Hammer className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-ink text-[1.0625rem] leading-tight font-semibold">
            Development cost
          </h2>
          <p className="text-ink-faint text-[0.75rem]">
            One-time charge for building it. Monthly costs are on Amounts paid
            below.
          </p>
        </div>
        {paidUp && (
          <span className="bg-leaf-wash text-leaf-deep ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold">
            <Check className="size-3.5" aria-hidden />
            Fully paid
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 pt-4 sm:grid-cols-3 sm:px-5">
        <div className="bg-mist/70 rounded-xl px-3.5 py-3">
          <p className="text-ink-faint text-[0.75rem] font-semibold">
            Expected
          </p>
          <AutoSaveForm action={setProjectValue} className="mt-1">
            <input type="hidden" name="id" value={projectId} />
            <label className="flex items-center gap-1">
              <span className="text-ink-faint text-[1.125rem]">₹</span>
              <input
                name="value"
                inputMode="decimal"
                defaultValue={expected ?? ""}
                placeholder={quoted ? String(quoted) : "Set amount"}
                aria-label="Expected development cost"
                className="text-ink placeholder:text-ink-faint focus:border-line focus:bg-surface w-full min-w-0 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[1.25rem] font-semibold tabular-nums focus:outline-none"
              />
            </label>
          </AutoSaveForm>
          {expected == null && quoted ? (
            <p className="text-ink-faint mt-0.5 text-[0.6875rem]">
              Quotation says {rupees.format(quoted)}
            </p>
          ) : null}
        </div>
        <div className="bg-mist/70 rounded-xl px-3.5 py-3">
          <p className="text-ink-faint text-[0.75rem] font-semibold">
            Received
          </p>
          <p className="text-leaf-deep mt-1 text-[1.25rem] font-semibold tabular-nums">
            {rupees.format(received)}
          </p>
          <p className="text-ink-faint text-[0.6875rem]">
            {last
              ? `${payments.length} ${payments.length === 1 ? "payment" : "payments"} · last ${day(last.on)}`
              : "Nothing yet"}
          </p>
        </div>
        <div className="bg-mist/70 rounded-xl px-3.5 py-3">
          <p className="text-ink-faint text-[0.75rem] font-semibold">
            Still to come
          </p>
          <p
            className={cn(
              "mt-1 text-[1.25rem] font-semibold tabular-nums",
              left ? "text-amber-deep" : "text-ink",
            )}
          >
            {left == null ? "—" : rupees.format(left)}
          </p>
          {expected != null && received > expected && (
            <p className="text-ink-faint text-[0.6875rem]">
              {rupees.format(received - expected)} more than expected
            </p>
          )}
        </div>
      </div>

      {share != null && (
        <div className="px-4 pt-3 sm:px-5">
          <div className="bg-mist h-2 overflow-hidden rounded-full">
            <div
              className="bg-leaf-deep h-full rounded-full"
              style={{ width: `${share * 100}%` }}
            />
          </div>
          <p className="text-ink-faint mt-1 text-[0.6875rem]">
            {Math.round(share * 100)}% received
          </p>
        </div>
      )}

      <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="min-w-0">
          <p className="text-ink-faint mb-1.5 text-[0.75rem] font-semibold">
            Payments received
          </p>
          {payments.length === 0 ? (
            <p className="text-ink-faint text-[0.8125rem]">
              No payment recorded yet.
            </p>
          ) : (
            <ul className="divide-line-soft border-line divide-y rounded-lg border">
              {payments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 px-3 py-2 text-[0.8125rem]"
                >
                  <CalendarDays
                    className="text-ink-faint size-3.5 shrink-0"
                    aria-hidden
                  />
                  <span className="text-ink-soft w-28 shrink-0">
                    {day(p.on)}
                  </span>
                  <span className="text-ink-faint min-w-0 flex-1 truncate">
                    {p.ref ?? ""}
                  </span>
                  <span className="text-leaf-deep shrink-0 font-semibold tabular-nums">
                    {rupees.format(p.amount)}
                  </span>
                  <form action={deletePayment} className="shrink-0">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      aria-label={`Remove the ${rupees.format(p.amount)} payment of ${day(p.on)}`}
                      title="Remove payment"
                      className="text-ink-faint hover:text-danger hover:bg-mist grid size-6 place-items-center rounded-md transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          action={addPayment}
          className="border-line bg-mist/40 grid grid-cols-2 gap-2 self-start rounded-lg border p-3"
        >
          <p className="text-ink col-span-2 text-[0.8125rem] font-semibold">
            Record a payment
          </p>
          <input type="hidden" name="project_id" value={projectId} />
          <input
            name="amount"
            inputMode="decimal"
            required
            placeholder="₹ amount"
            aria-label="Amount received"
            className={cn(field, "py-2")}
          />
          <input
            name="received_on"
            type="date"
            required
            defaultValue={todayIST()}
            aria-label="Date received"
            className={cn(field, "py-2")}
          />
          <input
            name="ref"
            placeholder="Note: advance, UPI ref…"
            aria-label="Note"
            className={cn(field, "col-span-2 py-2")}
          />
          <button
            className={cn(
              primaryButton,
              "col-span-2 inline-flex items-center justify-center gap-1.5 py-2",
            )}
          >
            <Plus className="size-3.5" aria-hidden />
            Add payment
          </button>
        </form>
      </div>
    </section>
  );
}
