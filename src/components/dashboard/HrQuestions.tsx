"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import {
  HR_FIELDS,
  HR_QUESTIONS,
  type HrFieldKey,
} from "@/lib/content/hr-questions";
import { cn } from "@/lib/utils";
import { PlacementBar } from "./PlacementBar";

type Filled = Partial<Record<HrFieldKey, string>>;

const STORE = "na_hr_fields";
const EMPTY: Filled = {};

/*
 * What the student typed, kept in this browser and read through a store
 * rather than copied into state by an effect.
 *
 * It is the name of a company they are interviewing at. There is no reason
 * for the server to hold that, and no reason for it to survive the browser.
 *
 * useSyncExternalStore rather than useState + useEffect: the server has no
 * localStorage, so the two would disagree on the first paint and React would
 * have to throw the markup away. The server snapshot is simply empty, and the
 * filled version arrives on the render after hydration.
 */
let cache: Filled = EMPTY;
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): Filled {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORE);
  } catch {
    return EMPTY; // Private window, or storage refused.
  }
  // Same string as last time means the same object, which is what
  // useSyncExternalStore needs to avoid re-rendering forever.
  if (raw === cachedRaw) return cache;
  cachedRaw = raw;
  try {
    cache = raw ? (JSON.parse(raw) as Filled) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Filled): void {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(next));
  } catch {
    // Nothing to do, and nothing worth telling anybody about.
  }
  cachedRaw = null;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab of the same page counts as a change here too.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * The HR round: the questions that actually get asked, and an answer to each
 * worth starting from.
 *
 * Every answer carries {placeholders} where it would otherwise carry a
 * company name. Type the company once at the top and every answer on the page
 * is aimed at them — which is the whole point, because the way a rehearsed
 * answer goes wrong is the candidate leaving last week's company name in the
 * middle of a paragraph.
 */
export function HrQuestions({ tabs }: { tabs: ReactNode }) {
  const filled = useSyncExternalStore(subscribe, read, () => EMPTY);

  const set = (key: HrFieldKey, value: string) =>
    write({ ...filled, [key]: value });

  const anyFilled = HR_FIELDS.some((f) => (filled[f.key] ?? "").trim() !== "");

  return (
    <>
      <PlacementBar tabs={tabs}>
        {anyFilled && (
          <button
            type="button"
            onClick={() => write(EMPTY)}
            className="text-ink-faint hover:text-ink text-[0.8125rem] font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </PlacementBar>

      <div className="shell-narrow py-8 lg:py-10">
        <h1 className="display text-ink text-[1.75rem]">The HR round</h1>
        <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
          These are the questions that keep coming up. For each one: what the
          interviewer is actually listening for, how to build an answer, a
          frame to fill in, and the ways it usually goes wrong.
        </p>
        <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
          There are no model answers here on purpose. HR asks a follow-up, and
          a paragraph you did not live through has nothing behind it — the only
          answer that survives the second question is one made of your own
          examples. Fill the frames with what you have actually done, then say
          each one out loud until it sounds like you talking.
        </p>

        {/* ── Fill the blanks once ─────────────────────────────────── */}
        <section className="card mt-7 p-5 sm:p-6">
          <h2 className="text-ink text-[1rem] font-semibold">
            Fill these in for the interview you are preparing for
          </h2>
          <p className="text-ink-soft mt-1.5 text-[0.875rem] leading-relaxed">
            Every answer below updates as you type. Leave one blank and it stays
            a placeholder, so you can see what is still missing.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {HR_FIELDS.map((field) => (
              <div
                key={field.key}
                className={cn(field.key === "recent" && "sm:col-span-2")}
              >
                <label
                  htmlFor={`hr-${field.key}`}
                  className="text-ink mb-1.5 block text-[0.8125rem] font-semibold"
                >
                  {field.label}
                </label>
                <input
                  id={`hr-${field.key}`}
                  value={filled[field.key] ?? ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="border-line bg-surface text-ink focus:border-brand w-full rounded-xl border px-3.5 py-2.5 text-[0.9375rem] transition-colors focus:outline-none"
                />
                <p className="text-ink-faint mt-1.5 text-[0.75rem] leading-relaxed">
                  {field.hint}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The questions ────────────────────────────────────────── */}
        <ol className="mt-8 space-y-5">
          {HR_QUESTIONS.map((entry, i) => (
            <li key={entry.id} className="card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="bg-brand-wash text-brand-deep mt-0.5 grid size-6 shrink-0 place-items-center rounded-full font-mono text-[0.75rem] font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-ink text-[1.0625rem] leading-snug font-semibold">
                    {entry.question}
                  </h2>
                  {entry.alsoAsked && (
                    <p className="text-ink-faint mt-1.5 text-[0.8125rem] leading-relaxed">
                      Also asked as: {entry.alsoAsked.join(" · ")}
                    </p>
                  )}

                  <p className="text-ink-soft border-line-soft mt-3 border-t pt-3 text-[0.9375rem] leading-relaxed">
                    <span className="text-ink font-semibold">
                      What they are really asking.{" "}
                    </span>
                    {entry.asking}
                  </p>

                  <div className="mt-4">
                    <p className="eyebrow mb-2">How to build the answer</p>
                    <ol className="space-y-1.5">
                      {entry.structure.map((step, n) => (
                        <li
                          key={n}
                          className="text-ink-soft flex gap-2.5 text-[0.9375rem] leading-relaxed"
                        >
                          <span className="text-brand-deep font-mono text-[0.8125rem] font-bold">
                            {n + 1}
                          </span>
                          <span className="min-w-0">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="border-line bg-mist mt-4 rounded-xl border p-3.5">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="eyebrow">A frame to fill in</p>
                      <CopyButton text={substitute(entry.skeleton, filled)} />
                    </div>
                    <Skeleton text={entry.skeleton} filled={filled} />
                  </div>

                  <div className="mt-4">
                    <p className="eyebrow mb-2">What sinks this answer</p>
                    <ul className="space-y-1.5">
                      {entry.avoid.map((line, n) => (
                        <li
                          key={n}
                          className="text-ink-soft flex gap-2.5 text-[0.875rem] leading-relaxed"
                        >
                          <span
                            className="text-amber-deep shrink-0"
                            aria-hidden
                          >
                            &times;
                          </span>
                          <span className="min-w-0">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

/** The skeleton with the known fields filled, for the clipboard. */
function substitute(text: string, filled: Filled): string {
  return text.replace(/\{([^}]+)\}/g, (whole, key: string) => {
    const field = HR_FIELDS.find((f) => f.key === key);
    if (!field) return whole; // Guidance, not a field. Copy it as written.
    return filled[field.key]?.trim() || whole;
  });
}

/**
 * The frame, with two kinds of brace in it.
 *
 * {company} is a field the student has filled in at the top, and once filled
 * it should read as ordinary prose — it is their sentence now. Everything
 * else in braces is an instruction about what belongs there, and it stays
 * visibly an instruction, because the failure this page exists to prevent is
 * somebody reading a brace out loud in an interview.
 */
function Skeleton({ text, filled }: { text: string; filled: Filled }) {
  return (
    <p className="text-ink-soft text-[0.9375rem] leading-relaxed">
      {text.split(/(\{[^}]+\})/g).map((part, i) => {
        const match = /^\{([^}]+)\}$/.exec(part);
        if (!match) return part;

        const field = HR_FIELDS.find((f) => f.key === match[1]);
        const value = field ? filled[field.key]?.trim() : undefined;
        if (value)
          return (
            <span key={i} className="text-ink font-semibold">
              {value}
            </span>
          );

        return (
          <span
            key={i}
            className="border-amber/40 bg-amber-wash text-amber-deep mx-0.5 rounded border border-dashed px-1.5 py-0.5 text-[0.875rem] font-medium"
          >
            {field ? field.label : match[1]}
          </span>
        );
      })}
    </p>
  );
}
