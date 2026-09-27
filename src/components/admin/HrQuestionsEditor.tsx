"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  saveHrQuestions,
  type HrQuestionInput,
} from "@/app/admin/(panel)/actions";
import { HR_FIELDS, type HrQuestion } from "@/lib/content/hr-questions";
import { cn } from "@/lib/utils";

type Draft = HrQuestionInput & { key: string };

const field =
  "border-line bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2 text-[0.875rem] transition-colors focus:outline-none";
const iconButton =
  "text-ink-faint hover:bg-mist hover:text-ink grid size-8 place-items-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30";

const toDraft = (q: HrQuestion): Draft => ({
  key: q.id,
  question: q.question,
  alsoAsked: q.alsoAsked ?? [],
  note: q.note ?? "",
  isGuide: q.mode === "guide",
  answer: q.answer,
});

/**
 * The HR questions as an editable list: the wording, the answer, the other
 * ways it gets asked, a note, and whether the answer is a draft or advice.
 *
 * Everything is local until Save, which writes the whole list in this order.
 * Leaving with unsaved changes asks first — a rewritten answer is a long
 * thing to lose to a stray click on the sidebar.
 */
export function HrQuestionsEditor({
  initial,
  customised,
}: {
  initial: HrQuestion[];
  customised: boolean;
}) {
  const [drafts, setDrafts] = useState<Draft[]>(() => initial.map(toDraft));
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();
  const [saving, startSaving] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function change(next: Draft[]) {
    setDrafts(next);
    setDirty(true);
    setMessage(undefined);
  }

  const edit = (i: number, patch: Partial<Draft>) =>
    change(drafts.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  function move(i: number, by: -1 | 1) {
    const next = [...drafts];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    change(next);
  }

  const add = () =>
    change([
      ...drafts,
      {
        key: crypto.randomUUID(),
        question: "",
        alsoAsked: [],
        note: "",
        isGuide: false,
        answer: "",
      },
    ]);

  function save() {
    startSaving(async () => {
      const result = await saveHrQuestions(
        drafts.map(({ key: _key, ...q }) => q),
      );
      if (result.error) {
        setMessage({ ok: false, text: result.error });
      } else {
        setDirty(false);
        setMessage({ ok: true, text: "Saved. Students see this now." });
      }
    });
  }

  return (
    <>
      <div className="card mt-6 p-5">
        <p className="text-ink text-[0.9375rem] font-semibold">
          Blanks students fill in
        </p>
        <p className="text-ink-soft mt-1 text-[0.8125rem] leading-relaxed">
          Write one of these into a question or an answer and it is replaced by
          what the student types at the top of their page.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {HR_FIELDS.map((f) => (
            <li
              key={f.key}
              className="border-amber/40 bg-amber-wash text-amber-deep rounded border border-dashed px-2 py-0.5 text-[0.8125rem]"
            >
              <code className="font-mono font-semibold">{`{${f.key}}`}</code>{" "}
              {f.label.toLowerCase()}
            </li>
          ))}
        </ul>
        {!customised && (
          <p className="text-ink-faint mt-3 text-[0.8125rem]">
            These are the built-in questions. Nothing has been saved yet.
          </p>
        )}
      </div>

      <ol className="mt-6 space-y-4">
        {drafts.map((d, i) => (
          <li key={d.key} className="card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="bg-brand-wash text-brand-deep grid size-7 place-items-center rounded-full font-mono text-[0.75rem] font-bold">
                {i + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className={iconButton}
                >
                  <ArrowUp className="size-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === drafts.length - 1}
                  aria-label="Move down"
                  className={iconButton}
                >
                  <ArrowDown className="size-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => change(drafts.filter((_, j) => j !== i))}
                  aria-label="Delete question"
                  className={cn(iconButton, "hover:text-danger")}
                >
                  <Trash2 className="size-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            <label className="mt-3 block">
              <span className="eyebrow">Question</span>
              <input
                value={d.question}
                onChange={(e) => edit(i, { question: e.target.value })}
                placeholder="Why do you want to join {company}?"
                className={cn(field, "mt-1 font-semibold")}
              />
            </label>

            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="eyebrow">
                  {d.isGuide ? "How to answer this one" : "Answer"}
                </span>
                <div
                  role="radiogroup"
                  aria-label="Kind of answer"
                  className="bg-mist inline-flex rounded-lg p-0.5"
                >
                  {[
                    { value: false, label: "Answer to start from" },
                    { value: true, label: "Advice" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      role="radio"
                      aria-checked={d.isGuide === opt.value}
                      onClick={() => edit(i, { isGuide: opt.value })}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[0.75rem] font-semibold transition-colors",
                        d.isGuide === opt.value
                          ? "bg-surface text-ink shadow-sm"
                          : "text-ink-faint hover:text-ink",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={d.answer}
                onChange={(e) => edit(i, { answer: e.target.value })}
                rows={7}
                className={cn(field, "mt-1.5 resize-y leading-relaxed")}
              />
              <p className="text-ink-faint mt-1 text-[0.75rem]">
                A blank line starts a new paragraph.
                {d.isGuide &&
                  " Advice has no copy button on the student's page."}
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="eyebrow">Also asked as</span>
                <textarea
                  value={d.alsoAsked.join("\n")}
                  onChange={(e) =>
                    edit(i, { alsoAsked: e.target.value.split("\n") })
                  }
                  rows={3}
                  placeholder="One wording per line"
                  className={cn(field, "mt-1 resize-y")}
                />
              </label>
              <label className="block">
                <span className="eyebrow">Note (optional)</span>
                <textarea
                  value={d.note}
                  onChange={(e) => edit(i, { note: e.target.value })}
                  rows={3}
                  placeholder="Shown in a highlighted box under the question"
                  className={cn(field, "mt-1 resize-y")}
                />
              </label>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={add}
        className="border-line text-ink-soft hover:border-brand hover:text-brand-deep mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-[0.875rem] font-semibold transition-colors"
      >
        <Plus className="size-4" strokeWidth={2} aria-hidden />
        Add a question
      </button>

      {/* Stays on screen however long the list gets. */}
      <div className="bg-mist/90 sticky bottom-0 z-10 -mx-1 mt-6 px-1 py-3 backdrop-blur">
        <div className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p
            role="status"
            className={cn(
              "text-[0.8125rem]",
              message
                ? message.ok
                  ? "text-leaf-deep font-semibold"
                  : "text-danger font-semibold"
                : "text-ink-faint",
            )}
          >
            {message?.text ??
              (dirty
                ? "You have unsaved changes."
                : `${drafts.length} questions`)}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="bg-ink hover:bg-brand-deep text-cta-fg rounded-lg px-4 py-2 text-[0.875rem] font-semibold transition-colors disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </>
  );
}
