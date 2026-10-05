"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  resetQuoteTemplate,
  saveQuoteTemplate,
} from "@/app/admin/(panel)/quote-actions";
import { field, primaryButton, quietButton } from "@/components/admin/Business";
import { DocPreview } from "@/components/admin/QuoteBuilder";
import { quoteHtml, type QuoteDocData } from "@/lib/quote-html";
import {
  LABEL_FIELDS,
  type QuoteLabels,
  type QuoteSectionDef,
  type QuoteTemplate,
} from "@/lib/quote-template";
import { cn } from "@/lib/utils";

const label = "text-ink-faint mb-1 block text-[0.6875rem] font-semibold";

/**
 * The quotation template: sections, the headings on the printed quote and
 * the wording a new quote starts with, beside a live preview of a sample
 * quote.
 */
export function TemplateEditor({
  initial,
  customised,
  sample,
}: {
  initial: QuoteTemplate;
  customised: boolean;
  /** A quote with a few standard rows ticked, for the preview. */
  sample: QuoteDocData;
}) {
  const [t, setT] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(t) !== saved;
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const html = useMemo(
    () =>
      quoteHtml(
        {
          ...sample,
          body: {
            ...sample.body,
            doc: { ...t.doc, understanding: sample.body.doc.understanding },
            validDays: t.validDays,
          },
        },
        { logo: "/logo-mark.png", sections: t.sections, labels: t.labels },
      ),
    [sample, t],
  );

  const setSection = (i: number, patch: Partial<QuoteSectionDef>) =>
    setT((x) => ({
      ...x,
      sections: x.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    }));
  const moveSection = (i: number, dir: 1 | -1) =>
    setT((x) => {
      const j = i + dir;
      if (j < 0 || j >= x.sections.length) return x;
      const sections = [...x.sections];
      [sections[i], sections[j]] = [sections[j], sections[i]];
      return { ...x, sections };
    });
  const setLabel = (key: keyof QuoteLabels, value: string) =>
    setT((x) => ({ ...x, labels: { ...x.labels, [key]: value } }));

  function save() {
    const snapshot = JSON.stringify(t);
    setError(null);
    start(async () => {
      try {
        await saveQuoteTemplate(t);
        setSaved(snapshot);
        // New sections get their ids on the server; load them back.
        if (t.sections.some((s) => !s.id)) window.location.reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  function reset() {
    if (!window.confirm("Go back to the built-in template?")) return;
    start(async () => {
      await resetQuoteTemplate();
      window.location.reload();
    });
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-start">
      <div className="min-w-0 space-y-6">
        <section className="card p-4 sm:p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">Sections</h2>
          <p className="text-ink-faint mt-0.5 text-[0.75rem]">
            The groups rows sit in, in this order, on every quote and on
            Standard prices. Add items to a new section on Standard prices.
          </p>
          <ul className="mt-3 space-y-2.5">
            {t.sections.map((s, i) => (
              <li
                key={s.id || `new-${i}`}
                className="border-line flex items-start gap-2 rounded-lg border p-2.5"
              >
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <input
                    value={s.label}
                    onChange={(e) => setSection(i, { label: e.target.value })}
                    placeholder="Section name"
                    aria-label="Section name"
                    className={cn(field, "py-2 font-semibold")}
                  />
                  <input
                    value={s.lede}
                    onChange={(e) => setSection(i, { lede: e.target.value })}
                    placeholder="One line about it"
                    aria-label={`About ${s.label || "this section"}`}
                    className={cn(field, "py-2")}
                  />
                </div>
                <div className="flex shrink-0 items-center">
                  <Icon
                    label="Move up"
                    onClick={() => moveSection(i, -1)}
                    disabled={i === 0}
                  >
                    <ArrowUp className="size-3.5" />
                  </Icon>
                  <Icon
                    label="Move down"
                    onClick={() => moveSection(i, 1)}
                    disabled={i === t.sections.length - 1}
                  >
                    <ArrowDown className="size-3.5" />
                  </Icon>
                  <Icon
                    label={`Delete ${s.label || "section"}`}
                    danger
                    disabled={t.sections.length === 1}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete the ${s.label} section? Rows already in it still show on quotes, under its old name.`,
                        )
                      )
                        setT((x) => ({
                          ...x,
                          sections: x.sections.filter((_, j) => j !== i),
                        }));
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Icon>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() =>
              setT((x) => ({
                ...x,
                sections: [...x.sections, { id: "", label: "", lede: "" }],
              }))
            }
            className={cn(quietButton, "mt-3 inline-flex items-center gap-1.5")}
          >
            <Plus className="size-3.5" aria-hidden />
            Add section
          </button>
        </section>

        <section className="card p-4 sm:p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">Headings</h2>
          <p className="text-ink-faint mt-0.5 text-[0.75rem]">
            The words printed on every quote.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {LABEL_FIELDS.map(({ key, what }) => (
              <label key={key} className="block min-w-0">
                <span className={label}>{what}</span>
                <input
                  value={t.labels[key]}
                  onChange={(e) => setLabel(key, e.target.value)}
                  className={cn(field, "py-2")}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="card space-y-4 p-4 sm:p-5">
          <div>
            <h2 className="text-ink text-[1.0625rem] font-semibold">
              Starting wording
            </h2>
            <p className="text-ink-faint mt-0.5 text-[0.75rem]">
              What a new quote says before you change it. On an existing quote,
              Use the template wording on its Document tab brings this in.
            </p>
          </div>
          <label className="block">
            <span className={label}>Opening paragraph</span>
            <textarea
              value={t.doc.intro}
              onChange={(e) =>
                setT((x) => ({
                  ...x,
                  doc: { ...x.doc, intro: e.target.value },
                }))
              }
              rows={4}
              className={cn(field, "resize-y py-2 leading-relaxed")}
            />
          </label>
          <label className="block">
            <span className={label}>Notes, one a line</span>
            <textarea
              value={t.doc.terms}
              onChange={(e) =>
                setT((x) => ({
                  ...x,
                  doc: { ...x.doc, terms: e.target.value },
                }))
              }
              rows={7}
              className={cn(field, "resize-y py-2 leading-relaxed")}
            />
          </label>
          <label className="block">
            <span className={label}>Valid for (days)</span>
            <input
              type="number"
              min={1}
              max={365}
              value={t.validDays}
              onChange={(e) =>
                setT((x) => ({
                  ...x,
                  validDays: Math.min(
                    365,
                    Math.max(1, Number(e.target.value) || 1),
                  ),
                }))
              }
              className={cn(field, "w-28 py-2")}
            />
          </label>
        </section>

        <div className="border-line bg-surface/95 sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_10px_30px_-12px_rgba(16,40,60,0.35)] backdrop-blur">
          <p
            className={cn(
              "text-[0.8125rem]",
              dirty ? "text-amber-deep" : "text-ink-faint",
            )}
          >
            {dirty ? "Unsaved changes" : "Saved"}
          </p>
          {error && (
            <p className="text-danger text-[0.8125rem]" role="alert">
              {error}
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
              {pending ? "Saving" : "Save template"}
            </button>
          </div>
        </div>
      </div>

      <div className="min-w-0 xl:sticky xl:top-[88px]">
        <p className="text-ink-faint mb-2 text-[0.75rem]">
          A sample quote with this template, as it prints.
        </p>
        <DocPreview html={html} frame={frame} />
      </div>
    </div>
  );
}

function Icon({
  label: text,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={text}
      title={text}
      className={cn(
        "text-ink-faint hover:bg-mist grid size-8 place-items-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
        danger ? "hover:text-danger" : "hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
