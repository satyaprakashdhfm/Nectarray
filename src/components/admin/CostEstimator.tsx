"use client";

import { useState } from "react";
import type { PriceTable } from "@/lib/price-book";
import {
  pricedRows,
  textCost,
  unitCost,
  type PricedRow,
} from "@/lib/model-cost";
import { formatMoney, type Currency } from "@/lib/price-money";
import { cn } from "@/lib/utils";

const box =
  "border-line bg-surface text-ink focus:border-brand h-10 w-full rounded-lg border px-3 text-[0.875rem] outline-none";

/** Every mode lays out the same: model, three fields, then the cost. */
const row =
  "mt-3 grid grid-cols-2 items-end gap-3 lg:grid-cols-[minmax(14rem,2fr)_repeat(3,minmax(7rem,1fr))_minmax(11rem,1.4fr)]";

type Mode = "text" | "image" | "video";

/**
 * What work costs on a chosen model, in the units people think in: words
 * for text, images, and seconds of video. Prices come from the sheet's
 * tables, edits included.
 */
export function CostEstimator({
  tables,
  currency,
}: {
  tables: Partial<Record<Mode, PriceTable>>;
  currency: Currency;
}) {
  const modes = (
    [
      ["text", "Text"],
      ["image", "Images"],
      ["video", "Video"],
    ] as const
  ).filter(([mode]) => tables[mode]);
  const [mode, setMode] = useState<Mode>(modes[0]?.[0] ?? "text");
  if (modes.length === 0) return null;

  return (
    <section
      aria-labelledby="cost-estimator"
      className="border-line bg-surface mt-6 rounded-xl border p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="cost-estimator" className="text-ink text-[1rem] font-semibold">
          What will it cost?
        </h2>
        <div
          role="group"
          aria-label="Estimate for"
          className="border-line flex rounded-lg border p-0.5"
        >
          {modes.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              className={cn(
                "rounded-md px-3 py-1 text-[0.8125rem] font-semibold transition-colors",
                mode === value
                  ? "bg-brand-wash text-brand-deep"
                  : "text-ink-faint hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* All kept mounted so switching back keeps what was typed. */}
      {tables.text && (
        <div hidden={mode !== "text"}>
          <TextCost table={tables.text} currency={currency} />
        </div>
      )}
      {tables.image && (
        <div hidden={mode !== "image"}>
          <ImageCost table={tables.image} currency={currency} />
        </div>
      )}
      {tables.video && (
        <div hidden={mode !== "video"}>
          <VideoCost table={tables.video} currency={currency} />
        </div>
      )}
    </section>
  );
}

function TextCost({
  table,
  currency,
}: {
  table: PriceTable;
  currency: Currency;
}) {
  const models = pricedRows(table, ["Input / 1M", "Output / 1M"]).filter((m) =>
    m.prices.every(Boolean),
  );
  const [model, setModelId] = useChosen(models);
  const [wordsIn, setWordsIn] = useState("1000");
  const [wordsOut, setWordsOut] = useState("500");
  const [requests, setRequests] = useState("1");
  const [input, output] = model?.prices ?? [];
  if (!model || !input || !output) return <Empty />;

  const times = count(requests);
  const result = textCost(
    {
      wordsIn: count(wordsIn),
      wordsOut: count(wordsOut),
      requests: times,
      input,
      output,
    },
    currency,
  );
  const money = moneyIn(currency);

  return (
    <>
      <div className={row}>
        <ModelSelect models={models} value={model.id} onChange={setModelId} />
        <Field label="Words you send">
          <NumberInput value={wordsIn} onChange={setWordsIn} />
        </Field>
        <Field label="Words back (about)">
          <NumberInput value={wordsOut} onChange={setWordsOut} />
        </Field>
        <Field label="Requests">
          <NumberInput value={requests} onChange={setRequests} />
        </Field>
        <Total times={times} of="" value={money(result.total)} />
      </div>
      <Explain>
        About {result.tokensIn.toLocaleString("en-US")} tokens in and{" "}
        {result.tokensOut.toLocaleString("en-US")} out per request, at{" "}
        {formatMoney(input, currency)} in and {formatMoney(output, currency)}{" "}
        out per 1M tokens
        {times !== 1 && `, so ${money(result.perRequest)} each`}. Counted as 3
        words to 4 tokens, which holds for English prose; other languages and
        code use more tokens.
      </Explain>
    </>
  );
}

function ImageCost({
  table,
  currency,
}: {
  table: PriceTable;
  currency: Currency;
}) {
  const models = pricedRows(
    table,
    ["Standard image", "Top setting"],
    ["Standard means", "Top means"],
  );
  const [model, setModelId] = useChosen(models);
  const [setting, setSetting] = useState(0);
  const [images, setImages] = useState("10");
  if (!model) return <Empty />;

  const options = choices(model, ["Standard", "Top"]);
  // A setting the newly chosen model does not price falls back to its first.
  const chosen = options.find((o) => o.index === setting) ?? options[0];
  const times = count(images);
  const money = moneyIn(currency);

  return (
    <>
      <div className={row}>
        <ModelSelect models={models} value={model.id} onChange={setModelId} />
        <Field label="Size or quality" className="lg:col-span-2">
          <select
            value={chosen.index}
            onChange={(e) => setSetting(Number(e.target.value))}
            className={box}
          >
            {options.map((o) => (
              <option key={o.index} value={o.index}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Images">
          <NumberInput value={images} onChange={setImages} />
        </Field>
        <Total
          times={times}
          of=" images"
          value={money(unitCost(chosen.price, times, currency))}
        />
      </div>
      <Explain>
        {formatMoney(chosen.price, currency)} an image ({chosen.label}). Prompt
        text and reference images can add a little.
      </Explain>
    </>
  );
}

function VideoCost({
  table,
  currency,
}: {
  table: PriceTable;
  currency: Currency;
}) {
  const models = pricedRows(table, ["720p / second", "1080p / second"]);
  const [model, setModelId] = useChosen(models);
  const [resolution, setResolution] = useState(0);
  const [seconds, setSeconds] = useState("8");
  const [videos, setVideos] = useState("1");
  if (!model) return <Empty />;

  const options = choices(model, ["720p", "1080p"]);
  const chosen = options.find((o) => o.index === resolution) ?? options[0];
  const length = count(seconds);
  const times = count(videos);
  const money = moneyIn(currency);
  const perVideo = unitCost(chosen.price, length, currency);

  return (
    <>
      <div className={row}>
        <ModelSelect models={models} value={model.id} onChange={setModelId} />
        <Field label="Resolution">
          <select
            value={chosen.index}
            onChange={(e) => setResolution(Number(e.target.value))}
            className={box}
          >
            {options.map((o) => (
              <option key={o.index} value={o.index}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Seconds each">
          <NumberInput value={seconds} onChange={setSeconds} />
        </Field>
        <Field label="Videos">
          <NumberInput value={videos} onChange={setVideos} />
        </Field>
        <Total times={times} of=" videos" value={money(perVideo * times)} />
      </div>
      <Explain>
        {formatMoney(chosen.price, currency)} a second at {chosen.label}
        {times !== 1 && `, so ${money(perVideo)} a video`}.
        {options.length === 1 &&
          " This model has one listed price, so other resolutions may cost more."}
      </Explain>
    </>
  );
}

/** The chosen model, falling back to the first if it has since been deleted. */
function useChosen(models: PricedRow[]) {
  const [id, setId] = useState(models[0]?.id ?? "");
  return [models.find((m) => m.id === id) ?? models[0], setId] as const;
}

/** A model's priced settings, named by its label column when it has one. */
function choices(model: PricedRow, names: string[]) {
  return model.prices.flatMap((price, index) =>
    price
      ? [
          {
            index,
            price,
            label: model.labels[index]
              ? `${names[index]}: ${model.labels[index]}`
              : names[index],
          },
        ]
      : [],
  );
}

const moneyIn = (currency: Currency) => (value: number) =>
  formatMoney(currency === "usd" ? { usd: value } : { inr: value }, currency);

/** A count typed into a box; blanks and junk count as nothing. */
function count(text: string) {
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function ModelSelect({
  models,
  value,
  onChange,
}: {
  models: PricedRow[];
  value: string;
  onChange: (id: string) => void;
}) {
  const providers = [...new Set(models.map((m) => m.provider))];
  return (
    <Field label="Model" className="col-span-2 lg:col-span-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  );
}

function Total({
  times,
  of,
  value,
  className,
}: {
  times: number;
  of: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      aria-live="polite"
      className={cn("bg-brand-wash rounded-lg px-3 py-1.5", className)}
    >
      <p className="text-ink-faint text-[0.75rem]">
        {times === 1
          ? "Cost"
          : `Cost for ${times.toLocaleString("en-US")}${of}`}
      </p>
      <p className="text-brand-deep text-[1.25rem] leading-tight font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function Explain({ children }: { children: React.ReactNode }) {
  return <p className="text-ink-faint mt-3 text-[0.75rem]">{children}</p>;
}

function Empty() {
  return (
    <p className="text-ink-faint mt-3 text-[0.8125rem]">
      No model in this table has a price to work from. Add one with Edit below.
    </p>
  );
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
