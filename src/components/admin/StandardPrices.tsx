"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  resetStandardPrices,
  saveStandardPrices,
} from "@/app/admin/(panel)/quote-actions";
import { field, primaryButton, quietButton } from "@/components/admin/Business";
import { MoneyInput } from "@/components/admin/QuoteBuilder";
import { QuoteIcon } from "@/components/admin/quote-icons";
import { rupees } from "@/lib/business";
import {
  QUOTE_SECTIONS,
  newId,
  type QuoteLine,
  type QuoteSection,
} from "@/lib/quotes";
import { cn } from "@/lib/utils";

/**
 * The standard price list: one plain row per item, name, a line of
 * description, the price and whether it is one-time or monthly.
 */
export function StandardPrices({
  initial,
  customised,
}: {
  initial: QuoteLine[];
  customised: boolean;
}) {
  const [lines, setLines] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(lines) !== saved;
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (id: string, patch: Partial<QuoteLine>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const add = (section: QuoteSection) =>
    setLines((ls) => [
      ...ls,
      {
        id: newId(),
        on: false,
        section,
        groupId: null,
        groupName: null,
        name: "",
        service: section === "marketing" ? "marketing" : "software",
        description: "",
        price: 0,
        billing: section === "build" ? "once" : "monthly",
        discount: { mode: "none", value: 0 },
        ref: null,
      },
    ]);

  function save() {
    const snapshot = JSON.stringify(lines);
    setError(null);
    setNote(null);
    start(async () => {
      try {
        await saveStandardPrices(lines);
        setSaved(snapshot);
        setNote("Saved. New quotes and newly ticked rows use these prices.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  function reset() {
    if (
      !window.confirm(
        "Go back to the built-in list and prices? Your changes here are lost.",
      )
    )
      return;
    setError(null);
    start(async () => {
      await resetStandardPrices();
      // The page reloads with the built-in list.
      window.location.reload();
    });
  }

  return (
    <div className="mt-6 space-y-6">
      {QUOTE_SECTIONS.map((section) => {
        const rows = lines.filter((l) => l.section === section.id);
        return (
          <section key={section.id} className="card overflow-hidden p-0">
            <header className="border-line border-b px-4 py-3.5 sm:px-5">
              <h2 className="text-ink text-[1.0625rem] font-semibold">
                {section.label}
              </h2>
              <p className="text-ink-faint text-[0.75rem]">{section.lede}</p>
            </header>

            <div className="text-ink-faint hidden gap-3 px-5 pt-3 text-[0.6875rem] font-semibold md:flex">
              <span className="w-[17.25rem] shrink-0 pl-12">Item</span>
              <span className="flex-1">Short description</span>
              <span className="w-32 shrink-0">Price</span>
              <span className="w-32 shrink-0">Billed</span>
              <span className="w-8 shrink-0" />
            </div>

            <ul className="divide-line divide-y md:divide-y-0">
              {rows.map((line) => {
                const remove = () =>
                  setLines((ls) => ls.filter((l) => l.id !== line.id));
                const del = (className: string) => (
                  <button
                    type="button"
                    onClick={remove}
                    aria-label={`Delete ${line.name || "row"}`}
                    title="Delete"
                    className={cn(
                      "text-ink-faint hover:text-danger hover:bg-mist size-8 shrink-0 place-items-center rounded-md transition-colors",
                      className,
                    )}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                );
                return (
                  <li
                    key={line.id}
                    className="flex flex-col gap-2 px-4 py-3 sm:px-5 md:flex-row md:items-center md:gap-3 md:py-2"
                  >
                    <div className="flex items-center gap-3 md:w-[17.25rem] md:shrink-0">
                      <span className="bg-brand-wash text-brand-deep grid size-9 shrink-0 place-items-center rounded-lg">
                        <QuoteIcon refId={line.ref} className="size-4" />
                      </span>
                      <input
                        value={line.name}
                        onChange={(e) =>
                          update(line.id, { name: e.target.value })
                        }
                        placeholder="Item name"
                        aria-label="Item name"
                        className={cn(field, "py-2 font-semibold")}
                      />
                      {del("grid md:hidden")}
                    </div>
                    <input
                      value={line.description}
                      onChange={(e) =>
                        update(line.id, { description: e.target.value })
                      }
                      placeholder="One line on what it is"
                      aria-label={`Description of ${line.name || "this row"}`}
                      className={cn(field, "py-2 md:flex-1")}
                    />
                    <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
                      <div className="md:w-32">
                        <MoneyInput
                          value={line.price}
                          onChange={(price) => update(line.id, { price })}
                          ariaLabel={`Price of ${line.name || "this row"}`}
                        />
                      </div>
                      <select
                        value={line.billing}
                        onChange={(e) =>
                          update(line.id, {
                            billing: e.target.value as QuoteLine["billing"],
                          })
                        }
                        aria-label="Billed"
                        className={cn(field, "py-2 md:w-32")}
                      >
                        <option value="once">One-time</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    {del("hidden md:grid")}
                  </li>
                );
              })}
            </ul>

            <div className="px-4 pt-1 pb-4 sm:px-5">
              <button
                type="button"
                onClick={() => add(section.id)}
                className={cn(quietButton, "inline-flex items-center gap-1.5")}
              >
                <Plus className="size-3.5" aria-hidden />
                Add item
              </button>
            </div>
          </section>
        );
      })}

      <div className="border-line bg-surface/95 sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_10px_30px_-12px_rgba(16,40,60,0.35)] backdrop-blur">
        <p className="text-ink-soft text-[0.8125rem]">
          {lines.length} items ·{" "}
          {rupees.format(
            lines
              .filter((l) => l.billing === "once")
              .reduce((n, l) => n + l.price, 0),
          )}{" "}
          if every one-time item is bought
        </p>
        {error && (
          <p className="text-danger text-[0.8125rem]" role="alert">
            {error}
          </p>
        )}
        {note && !dirty && (
          <p className="text-leaf-deep text-[0.8125rem]" role="status">
            {note}
          </p>
        )}
        <div className="ml-auto flex items-center gap-2">
          {customised && (
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className={cn(quietButton, "py-2")}
            >
              Reset to built-in
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending}
            className={cn(primaryButton, "px-4 py-2 disabled:opacity-50")}
          >
            {pending ? "Saving" : dirty ? "Save prices" : "Saved"}
          </button>
        </div>
      </div>
    </div>
  );
}
