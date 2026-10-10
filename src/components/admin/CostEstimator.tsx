"use client";

import { useState } from "react";
import type { PriceTable } from "@/lib/price-book";
import { formatMoney, type Currency } from "@/lib/price-money";
import { estimate, priceableModels } from "@/lib/token-cost";
import { cn } from "@/lib/utils";

const box =
  "border-line bg-surface text-ink focus:border-brand h-10 w-full rounded-lg border px-3 text-[0.875rem] outline-none";

/**
 * What a call costs on a chosen model, from words rather than tokens:
 * how much is sent, roughly how much comes back, and how many times.
 * Prices come from the API price table, edits included.
 */
export function CostEstimator({
  table,
  currency,
}: {
  table: PriceTable;
  currency: Currency;
}) {
  const models = priceableModels(table);
  const [modelId, setModelId] = useState(models[0]?.id ?? "");
  const [wordsIn, setWordsIn] = useState("1000");
  const [wordsOut, setWordsOut] = useState("500");
  const [requests, setRequests] = useState("1");

  if (models.length === 0) return null;
  // The chosen row may have been deleted in an edit since.
  const model = models.find((m) => m.id === modelId) ?? models[0];
  const result = estimate(
    {
      wordsIn: count(wordsIn),
      wordsOut: count(wordsOut),
      requests: count(requests),
      input: model.input,
      output: model.output,
    },
    currency,
  );
  const money = (value: number) =>
    formatMoney(currency === "usd" ? { usd: value } : { inr: value }, currency);
  const providers = [...new Set(models.map((m) => m.provider))];

  return (
    <section
      aria-labelledby="cost-estimator"
      className="border-line bg-surface mt-6 rounded-xl border p-4"
    >
      <h2 id="cost-estimator" className="text-ink text-[1rem] font-semibold">
        What will it cost?
      </h2>
      <div className="mt-3 grid grid-cols-2 items-end gap-3 lg:grid-cols-[minmax(14rem,2fr)_repeat(3,minmax(7rem,1fr))_minmax(11rem,1.4fr)]">
        <Field label="Model" className="col-span-2 lg:col-span-1">
          <select
            value={model.id}
            onChange={(e) => setModelId(e.target.value)}
            className={box}
          >
            {providers.map((provider) => (
              <optgroup key={provider} label={provider || "Other"}>
                {models
                  .filter((m) => m.provider === provider)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Words you send">
          <NumberInput value={wordsIn} onChange={setWordsIn} />
        </Field>
        <Field label="Words back (about)">
          <NumberInput value={wordsOut} onChange={setWordsOut} />
        </Field>
        <Field label="Requests">
          <NumberInput value={requests} onChange={setRequests} />
        </Field>
        <div
          aria-live="polite"
          className="bg-brand-wash rounded-lg px-3 py-1.5"
        >
          <p className="text-ink-faint text-[0.75rem]">
            {count(requests) === 1
              ? "Cost"
              : `Cost for ${count(requests).toLocaleString("en-US")}`}
          </p>
          <p className="text-brand-deep text-[1.25rem] leading-tight font-semibold tabular-nums">
            {money(result.total)}
          </p>
        </div>
      </div>
      <p className="text-ink-faint mt-3 text-[0.75rem]">
        About {result.tokensIn.toLocaleString("en-US")} tokens in and{" "}
        {result.tokensOut.toLocaleString("en-US")} out per request, at{" "}
        {formatMoney(model.input, currency)} in and{" "}
        {formatMoney(model.output, currency)} out per 1M tokens
        {count(requests) !== 1 && `, so ${money(result.perRequest)} each`}.
        Counted as 3 words to 4 tokens, which holds for English prose; other
        languages and code use more tokens.
      </p>
    </section>
  );
}

/** A count typed into a box; blanks and junk count as nothing. */
function count(text: string) {
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-ink-soft text-[0.8125rem] font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      step={1}
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${box} text-right tabular-nums`}
    />
  );
}
