"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { FX_INR_PER_USD } from "@/lib/price-book";
import {
  estimateTotals,
  priceIn,
  type EstimateItem,
  type EstimateLine,
} from "@/lib/project-estimate";
import { formatMoney, type Currency } from "@/lib/price-money";
import { TEAM_RATES_CHECKED, TEAM_ROLES } from "@/lib/team-rates";
import { box, Field, NumberInput } from "@/components/admin/CostEstimator";
import { cn } from "@/lib/utils";

/** Ticked from the start: what nearly every site needs. */
const STARTER = new Set(["domain", "hosting", "database"]);

type Pick = { on: boolean; option: string; quantity: string };
type Hire = { on: boolean; people: string; monthly: string };

const amount = (text: string) => {
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Tick what a project needs, choose a provider for each and say how many:
 * the total comes out as the first payment, then what recurs each month
 * and each year. The team below adds people at Indian market salaries.
 */
export function ProjectEstimate({ items }: { items: EstimateItem[] }) {
  const [currency, setCurrency] = useState<Currency>("inr");
  const [picks, setPicks] = useState<Record<string, Pick>>(() =>
    Object.fromEntries(
      items.map((item) => [
        item.id,
        {
          on: STARTER.has(item.id),
          option: item.options[0].id,
          quantity: String(item.defaultQuantity),
        },
      ]),
    ),
  );
  const [hires, setHires] = useState<Record<string, Hire>>(() =>
    Object.fromEntries(
      TEAM_ROLES.map((r) => [
        r.id,
        { on: false, people: "1", monthly: String(r.monthly) },
      ]),
    ),
  );

  const money = (value: number) =>
    formatMoney(currency === "usd" ? { usd: value } : { inr: value }, currency);
  const groups = [...new Set(items.map((i) => i.group))];

  const serviceLines = items.flatMap((item) => {
    const pick = picks[item.id];
    const option =
      item.options.find((o) => o.id === pick.option) ?? item.options[0];
    const line: EstimateLine = {
      billing: item.billing,
      quantity: amount(pick.quantity),
      price: priceIn(option.price, currency),
      ...(option.first ? { first: priceIn(option.first, currency) } : {}),
    };
    return pick.on ? [{ id: item.id, line }] : [];
  });
  const teamLines = TEAM_ROLES.flatMap((role) => {
    const hire = hires[role.id];
    if (!hire.on) return [];
    const line: EstimateLine = {
      billing: "monthly",
      quantity: amount(hire.people),
      price: priceIn({ inr: amount(hire.monthly) }, currency),
    };
    return [line];
  });
  const services = estimateTotals(serviceLines.map((l) => l.line));
  const team = estimateTotals(teamLines);
  const all = estimateTotals([
    ...serviceLines.map((l) => l.line),
    ...teamLines,
  ]);

  const setPick = (id: string, change: Partial<Pick>) =>
    setPicks((p) => ({ ...p, [id]: { ...p[id], ...change } }));
  const setHire = (id: string, change: Partial<Hire>) =>
    setHires((h) => ({ ...h, [id]: { ...h[id], ...change } }));

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Show prices in"
          className="border-line bg-surface flex rounded-lg border p-0.5"
        >
          {(
            [
              ["inr", "₹ INR"],
              ["usd", "$ USD"],
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
          $1 = ₹{FX_INR_PER_USD}. Prices come from the other sheets, edits
          included.
        </p>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          {groups.map((group) => (
            <section key={group} aria-labelledby={`group-${group}`}>
              <h2
                id={`group-${group}`}
                className="text-ink text-[1rem] font-semibold"
              >
                {group}
              </h2>
              <ul className="mt-3 space-y-3">
                {items
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const pick = picks[item.id];
                    const line = serviceLines.find((l) => l.id === item.id);
                    const each = line
                      ? (line.line.first ?? line.line.price) *
                        line.line.quantity
                      : 0;
                    return (
                      <li
                        key={item.id}
                        className={cn(
                          "border-line bg-surface rounded-xl border p-4 transition-colors",
                          pick.on && "border-brand",
                        )}
                      >
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={pick.on}
                            onChange={(e) =>
                              setPick(item.id, { on: e.target.checked })
                            }
                            className="accent-brand mt-0.5 size-4 shrink-0"
                          />
                          <span className="min-w-0">
                            <span className="text-ink block text-[0.9375rem] font-semibold">
                              {item.label}
                            </span>
                            {item.note && (
                              <span className="text-ink-faint mt-0.5 block text-[0.75rem]">
                                {item.note}
                              </span>
                            )}
                          </span>
                        </label>
                        <div
                          className={cn(
                            "mt-3 grid grid-cols-2 items-end gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(6rem,1fr)_minmax(8rem,1fr)]",
                            !pick.on && "opacity-50",
                          )}
                        >
                          <Field
                            label="Provider"
                            className="col-span-2 sm:col-span-1"
                          >
                            <select
                              value={pick.option}
                              disabled={!pick.on}
                              onChange={(e) =>
                                setPick(item.id, { option: e.target.value })
                              }
                              className={box}
                            >
                              {item.options.map((o) => (
                                <option key={o.id} value={o.id}>
                                  {o.label}: {formatMoney(o.price, currency)}{" "}
                                  {item.per}
                                  {o.first
                                    ? ` (first ${formatMoney(o.first, currency)})`
                                    : ""}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label={`How many ${item.unit}`}>
                            <NumberInput
                              value={pick.quantity}
                              onChange={(quantity) =>
                                setPick(item.id, { quantity })
                              }
                            />
                          </Field>
                          <div className="bg-brand-wash rounded-lg px-3 py-1.5">
                            <p className="text-ink-faint text-[0.75rem]">
                              {item.billing === "yearly"
                                ? "First year"
                                : item.billing === "monthly"
                                  ? "A month"
                                  : "Once"}
                            </p>
                            <p className="text-brand-deep text-[1.0625rem] leading-tight font-semibold tabular-nums">
                              {money(each)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}

          <section aria-labelledby="team">
            <h2 id="team" className="text-ink text-[1rem] font-semibold">
              Team
            </h2>
            <p className="text-ink-faint mt-1 max-w-[70ch] text-[0.8125rem]">
              Average monthly CTC in India for each role (before tax, not
              take-home). Change the monthly figure for the person you have in
              mind. Checked {TEAM_RATES_CHECKED}.
            </p>
            <ul className="mt-3 space-y-3">
              {TEAM_ROLES.map((role) => {
                const hire = hires[role.id];
                const cost =
                  amount(hire.people) *
                  priceIn({ inr: amount(hire.monthly) }, currency);
                return (
                  <li
                    key={role.id}
                    className={cn(
                      "border-line bg-surface rounded-xl border p-4 transition-colors",
                      hire.on && "border-brand",
                    )}
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={hire.on}
                        onChange={(e) =>
                          setHire(role.id, { on: e.target.checked })
                        }
                        className="accent-brand mt-0.5 size-4 shrink-0"
                      />
                      <span className="min-w-0">
                        <span className="text-ink block text-[0.9375rem] font-semibold">
                          {role.role}
                        </span>
                        <span className="text-ink-faint mt-0.5 block text-[0.75rem]">
                          Usually ₹{role.low.toLocaleString("en-IN")} to ₹
                          {role.high.toLocaleString("en-IN")} a month.{" "}
                          {role.basis}{" "}
                          <a
                            href={role.source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-deep inline-flex items-center gap-0.5 font-semibold"
                          >
                            {role.source.label}
                            <ExternalLink className="size-3" aria-hidden />
                          </a>
                        </span>
                      </span>
                    </label>
                    <div
                      className={cn(
                        "mt-3 grid grid-cols-2 items-end gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(6rem,1fr)_minmax(8rem,1fr)]",
                        !hire.on && "opacity-50",
                      )}
                    >
                      <Field
                        label="Monthly CTC (₹)"
                        className="col-span-2 sm:col-span-1"
                      >
                        <NumberInput
                          value={hire.monthly}
                          onChange={(monthly) => setHire(role.id, { monthly })}
                        />
                      </Field>
                      <Field label="People">
                        <NumberInput
                          value={hire.people}
                          onChange={(people) => setHire(role.id, { people })}
                        />
                      </Field>
                      <div className="bg-brand-wash rounded-lg px-3 py-1.5">
                        <p className="text-ink-faint text-[0.75rem]">A month</p>
                        <p className="text-brand-deep text-[1.0625rem] leading-tight font-semibold tabular-nums">
                          {money(hire.on ? cost : 0)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside aria-labelledby="estimate-total">
          <div
            aria-live="polite"
            className="border-line bg-surface rounded-xl border p-4 lg:sticky lg:top-24"
          >
            <h2
              id="estimate-total"
              className="text-ink text-[1rem] font-semibold"
            >
              What it costs
            </h2>
            <dl className="mt-3 space-y-3">
              <Sum
                label="To start"
                hint="One-time fees, the first month and the first year of yearly items"
                value={money(all.firstPayment)}
                strong
              />
              <Sum
                label="Every month"
                hint={
                  team.monthly > 0
                    ? `${money(services.monthly)} services + ${money(team.monthly)} team`
                    : undefined
                }
                value={money(all.monthly)}
                strong
              />
              <Sum label="Every year (renewals)" value={money(all.yearly)} />
              <Sum label="One-time only" value={money(all.oneTime)} />
              <div className="border-line border-t pt-3">
                <Sum
                  label="First 12 months"
                  hint="Everything paid in the first year"
                  value={money(all.firstYear)}
                />
              </div>
            </dl>
            {serviceLines.length + teamLines.length === 0 && (
              <p className="text-ink-faint mt-3 text-[0.75rem]">
                Tick a service or a role to start the estimate.
              </p>
            )}
            <p className="text-ink-faint mt-3 text-[0.75rem]">
              Payment gateway fees (about 2% of what customers pay) and traffic
              beyond each plan&apos;s allowance are not included.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Sum({
  label,
  hint,
  value,
  strong,
}: {
  label: string;
  hint?: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <dt className="text-ink-soft text-[0.8125rem] font-semibold">
          {label}
        </dt>
        <dd
          className={cn(
            "tabular-nums",
            strong
              ? "text-brand-deep text-[1.25rem] font-semibold"
              : "text-ink text-[0.9375rem] font-semibold",
          )}
        >
          {value}
        </dd>
      </div>
      {hint && <p className="text-ink-faint mt-0.5 text-[0.75rem]">{hint}</p>}
    </div>
  );
}
