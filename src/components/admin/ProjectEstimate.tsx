"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { FX_INR_PER_USD } from "@/lib/price-book";
import {
  estimateTotals,
  priceIn,
  type EstimateItem,
  type EstimateLine,
} from "@/lib/project-estimate";
import { formatMoney, type Currency } from "@/lib/price-money";
import { clearEstimate, saveEstimate, readChoices } from "@/lib/estimate-picks";
import { resetSavedChoices, useSavedState } from "@/lib/use-saved-state";
import { TEAM_RATES_CHECKED, TEAM_ROLES } from "@/lib/team-rates";
import { box, Field, NumberInput } from "@/components/admin/CostEstimator";
import { Dropdown } from "@/components/admin/Dropdown";
import { cn } from "@/lib/utils";

/** Ticked from the start: what nearly every site needs. */
const STARTER = new Set(["domain", "hosting", "database"]);

type Pick = { on: boolean; option: string; quantity: string };
type Member = {
  id: string;
  role: string;
  on: boolean;
  people: string;
  monthly: string;
};

const amount = (text: string) => {
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Tick what a project needs, choose a provider for each and say how many:
 * the total comes out as the first payment, then what recurs each month
 * and each year. Developers below adds the people, with Indian market
 * salaries shown as a guide and each figure left to fill in.
 */
export function ProjectEstimate({ items }: { items: EstimateItem[] }) {
  const [currency, setCurrency] = useSavedState<Currency>(
    "estimate:currency",
    "inr",
  );
  const [picks, setPicks] = useState(() => startingPicks(items));
  const [team, setTeam] = useState(startingTeam);
  const [newRole, setNewRole] = useState("");
  const [loaded, setLoaded] = useState(false);

  /*
   * Pick up where this browser left off, then apply what was chosen on the
   * sheets since: a ticked row or a chosen model selects that provider and
   * ticks the service; an unticked row drops it again. Read after the first
   * render, because the saved state lives only in the browser.
   */
  useEffect(() => {
    const { log, estimate } = readChoices();
    const next = startingPicks(items);
    for (const item of items) {
      const saved = estimate?.picks[item.id];
      if (saved && item.options.some((o) => o.id === saved.option))
        next[item.id] = saved;
    }
    for (const { option, on } of log) {
      const item = items.find((i) => i.options.some((o) => o.id === option));
      if (!item) continue;
      if (on) next[item.id] = { ...next[item.id], on: true, option };
      else if (next[item.id].option === option)
        next[item.id] = { ...next[item.id], on: false };
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only state, read once on mount
    setPicks(next);
    if (Array.isArray(estimate?.team)) setTeam(estimate.team);
    setLoaded(true);
  }, [items]);

  useEffect(() => {
    if (loaded) saveEstimate({ picks, team });
  }, [loaded, picks, team]);

  const startOver = () => {
    if (!window.confirm("Clear every choice on every sheet and the estimate?"))
      return;
    resetSavedChoices();
    clearEstimate();
    window.location.reload();
  };

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
  const teamLines = team.flatMap((member): EstimateLine[] =>
    member.on
      ? [
          {
            billing: "monthly",
            quantity: amount(member.people),
            price: priceIn({ inr: amount(member.monthly) }, currency),
          },
        ]
      : [],
  );
  const services = estimateTotals(serviceLines.map((l) => l.line));
  const people = estimateTotals(teamLines);
  const all = estimateTotals([
    ...serviceLines.map((l) => l.line),
    ...teamLines,
  ]);

  const setPick = (id: string, change: Partial<Pick>) =>
    setPicks((p) => ({ ...p, [id]: { ...p[id], ...change } }));
  const setMember = (id: string, change: Partial<Member>) =>
    setTeam((list) => list.map((m) => (m.id === id ? { ...m, ...change } : m)));
  const addRole = () => {
    const role = newRole.trim();
    if (!role) return;
    setTeam((list) => [
      ...list,
      { id: crypto.randomUUID(), role, on: true, people: "1", monthly: "" },
    ]);
    setNewRole("");
  };

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
          $1 = ₹{FX_INR_PER_USD}. What you tick or choose on the other sheets is
          picked here already; change it below.
        </p>
        <button
          type="button"
          onClick={startOver}
          className="border-line text-ink-soft hover:text-ink hover:border-brand ml-auto rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors"
        >
          Reset all
        </button>
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
                            <Dropdown
                              value={pick.option}
                              disabled={!pick.on}
                              aria-label={`${item.label} provider`}
                              onChange={(option) =>
                                setPick(item.id, { option })
                              }
                              options={item.options.map((o) => ({
                                value: o.id,
                                label: `${o.label}: ${formatMoney(o.price, currency)} ${item.per}${
                                  o.first
                                    ? ` (first ${formatMoney(o.first, currency)})`
                                    : ""
                                }`,
                              }))}
                            />
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

          <section aria-labelledby="developers">
            <h2 id="developers" className="text-ink text-[1rem] font-semibold">
              Developers
            </h2>
            <p className="text-ink-faint mt-1 max-w-[70ch] text-[0.8125rem]">
              Enter what each person costs a month (CTC, before tax). The Indian
              market average is shown as a guide, checked {TEAM_RATES_CHECKED}.
              Add any role the project needs.
            </p>
            <ul className="mt-3 space-y-3">
              {team.map((member) => {
                const market = TEAM_ROLES.find((r) => r.id === member.id);
                const cost =
                  amount(member.people) *
                  priceIn({ inr: amount(member.monthly) }, currency);
                return (
                  <li
                    key={member.id}
                    className={cn(
                      "border-line bg-surface rounded-xl border p-4 transition-colors",
                      member.on && "border-brand",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={member.on}
                          onChange={(e) =>
                            setMember(member.id, { on: e.target.checked })
                          }
                          className="accent-brand mt-0.5 size-4 shrink-0"
                        />
                        <span className="min-w-0">
                          <span className="text-ink block text-[0.9375rem] font-semibold">
                            {member.role}
                          </span>
                          {market && (
                            <span className="text-ink-faint mt-0.5 block text-[0.75rem]">
                              Market average ₹
                              {market.monthly.toLocaleString("en-IN")} a month,
                              usually ₹{market.low.toLocaleString("en-IN")} to ₹
                              {market.high.toLocaleString("en-IN")}.{" "}
                              {market.basis}{" "}
                              <a
                                href={market.source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-deep inline-flex items-center gap-0.5 font-semibold"
                              >
                                {market.source.label}
                                <ExternalLink className="size-3" aria-hidden />
                              </a>
                            </span>
                          )}
                        </span>
                      </label>
                      {market ? (
                        <button
                          type="button"
                          onClick={() =>
                            setMember(member.id, {
                              monthly: String(market.monthly),
                              on: true,
                            })
                          }
                          className="text-brand-deep hover:bg-brand-wash shrink-0 rounded-md px-2 py-1 text-[0.75rem] font-semibold"
                        >
                          Use average
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setTeam((list) =>
                              list.filter((m) => m.id !== member.id),
                            )
                          }
                          aria-label={`Remove ${member.role}`}
                          className="text-ink-faint hover:text-danger shrink-0 rounded-md p-1"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      )}
                    </div>
                    <div
                      className={cn(
                        "mt-3 grid grid-cols-2 items-end gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(6rem,1fr)_minmax(8rem,1fr)]",
                        !member.on && "opacity-50",
                      )}
                    >
                      <Field
                        label="Monthly cost (₹)"
                        className="col-span-2 sm:col-span-1"
                      >
                        <NumberInput
                          value={member.monthly}
                          onChange={(monthly) =>
                            setMember(member.id, {
                              monthly,
                              ...(amount(monthly) > 0 ? { on: true } : {}),
                            })
                          }
                        />
                      </Field>
                      <Field label="People">
                        <NumberInput
                          value={member.people}
                          onChange={(people) =>
                            setMember(member.id, { people })
                          }
                        />
                      </Field>
                      <div className="bg-brand-wash rounded-lg px-3 py-1.5">
                        <p className="text-ink-faint text-[0.75rem]">A month</p>
                        <p className="text-brand-deep text-[1.0625rem] leading-tight font-semibold tabular-nums">
                          {money(member.on ? cost : 0)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addRole();
              }}
              className="mt-3 flex flex-wrap items-end gap-2"
            >
              <Field label="Add a role" className="min-w-[14rem] flex-1">
                <input
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Mobile app developer"
                  className={box}
                />
              </Field>
              <button
                type="submit"
                disabled={!newRole.trim()}
                className="bg-brand-solid text-cta-fg inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-[0.875rem] font-semibold disabled:opacity-50"
              >
                <Plus className="size-4" aria-hidden />
                Add role
              </button>
            </form>
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
                  people.monthly > 0
                    ? `${money(services.monthly)} services + ${money(people.monthly)} developers`
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
                Tick a service or a developer to start the estimate.
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

function startingPicks(items: EstimateItem[]): Record<string, Pick> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      {
        on: STARTER.has(item.id),
        option: item.options[0].id,
        quantity: String(item.defaultQuantity),
      },
    ]),
  );
}

function startingTeam(): Member[] {
  return TEAM_ROLES.map((r) => ({
    id: r.id,
    role: r.role,
    on: false,
    people: "1",
    monthly: "",
  }));
}
