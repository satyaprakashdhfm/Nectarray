"use client";
import { ADMIN } from "@/lib/admin-path";

import { useState } from "react";
import { SaveState, useAutoSave } from "@/components/admin/autosave";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { saveWebNotes, type WebNoteInput } from "@/app/admin/(panel)/actions";
import {
  WEB_NOTE_KINDS,
  type WebNote,
  type WebNoteKind,
} from "@/lib/content/web-building";
import { cn } from "@/lib/utils";

type Draft = WebNoteInput & { key: string };

const field =
  "border-line bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2 text-[0.875rem] transition-colors focus:outline-none";
const iconButton =
  "text-ink-faint hover:bg-mist hover:text-ink grid size-8 place-items-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30";
const smallButton =
  "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors";

const toDraft = (n: WebNote): Draft => ({
  key: n.id,
  title: n.title,
  body: n.body,
  url: n.url ?? "",
});

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * One list on the Website tab, read like a page and edited in place.
 *
 * Learnings and steps read as a numbered list; references as a grid of link
 * cards. Edit turns the same list into fields, saved by themselves a
 * moment after each change, the whole list in its order.
 */
export function WebNotesEditor({
  kind,
  initial,
  customised,
  title,
  lede,
}: {
  kind: WebNoteKind;
  initial: WebNote[];
  customised: boolean;
  title: string;
  lede: string;
}) {
  const [notes, setNotes] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(() => initial.map(toDraft));
  const singular = WEB_NOTE_KINDS[kind].singular;
  const isReference = kind === "reference";
  // An empty row waits until something is typed in it.
  const ready = drafts
    .filter((d) => d.title.trim() || d.body.trim() || d.url.trim())
    .map(({ key: _key, ...n }) => n);
  const auto = useAutoSave(ready, async (list) => {
    const result = await saveWebNotes(kind, list);
    if (result.error) throw new Error(result.error);
  });

  const change = (next: Draft[]) => setDrafts(next);

  const edit = (i: number, patch: Partial<Draft>) =>
    change(drafts.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  function move(i: number, by: -1 | 1) {
    const next = [...drafts];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    change(next);
  }

  function done() {
    if (auto.dirty) auto.saveNow();
    setNotes(
      drafts
        .filter((d) => d.title.trim() || d.body.trim() || d.url.trim())
        .map((d) => ({
          id: d.key,
          title: d.title.trim(),
          body: d.body.trim(),
          url: d.url.trim() || undefined,
        })),
    );
    setEditing(false);
  }

  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-ink text-[1.125rem] font-semibold">{title}</h2>
          <p className="text-ink-soft mt-1 max-w-[60ch] text-[0.8125rem] leading-relaxed">
            {lede}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={smallButton}
          >
            <Pencil className="size-3.5" strokeWidth={2} aria-hidden />
            Edit
          </button>
        )}
      </div>

      {!editing && auto.status !== "saved" && (
        <SaveState
          status={auto.status}
          error={auto.error}
          onRetry={auto.saveNow}
          className="mt-2"
        />
      )}
      {!customised && !editing && !auto.dirty && notes === initial && (
        <p className="text-ink-faint mt-2 text-[0.75rem]">
          The built-in list. Edit it to make it yours.
        </p>
      )}

      {!editing ? (
        isReference ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {notes.map((n) => (
              <li key={n.id}>
                <a
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card card-hover group flex h-full flex-col p-4"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-ink text-[0.9375rem] font-semibold">
                      {n.title}
                    </span>
                    <ExternalLink
                      className="text-ink-faint group-hover:text-brand-deep mt-0.5 size-4 shrink-0 transition-colors"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                  {n.url && (
                    <span className="text-brand-deep mt-0.5 font-mono text-[0.75rem]">
                      {host(n.url)}
                    </span>
                  )}
                  {n.body && (
                    <span className="text-ink-soft mt-2 text-[0.8125rem] leading-relaxed">
                      {n.body}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ol className="mt-4 space-y-3">
            {notes.map((n, i) => (
              <li key={n.id} className="card flex gap-4 p-4">
                <span className="bg-brand-wash text-brand-deep grid size-7 shrink-0 place-items-center rounded-full font-mono text-[0.75rem] font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-ink text-[0.9375rem] font-semibold">
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-ink-soft mt-1 text-[0.8125rem] leading-relaxed">
                      {n.body}
                    </p>
                  )}
                  {n.url &&
                    (n.url.startsWith("/") ? (
                      <Link
                        href={n.url}
                        className="text-brand-deep mt-2 inline-flex items-center gap-1 text-[0.8125rem] font-semibold hover:underline"
                      >
                        Open
                        <ArrowRight
                          className="size-3.5"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </Link>
                    ) : (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-deep mt-2 inline-flex items-center gap-1 text-[0.8125rem] font-semibold hover:underline"
                      >
                        {host(n.url)}
                        <ExternalLink
                          className="size-3.5"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </a>
                    ))}
                </div>
              </li>
            ))}
          </ol>
        )
      ) : (
        <>
          <ol
            className={cn(
              "mt-4 gap-3",
              isReference ? "grid sm:grid-cols-2 2xl:grid-cols-3" : "space-y-3",
            )}
          >
            {drafts.map((d, i) => (
              <li key={d.key} className="card p-4">
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
                      aria-label={`Delete ${singular}`}
                      className={cn(iconButton, "hover:text-danger")}
                    >
                      <Trash2 className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <label className="mt-3 block">
                  <span className="eyebrow">Title</span>
                  <input
                    value={d.title}
                    onChange={(e) => edit(i, { title: e.target.value })}
                    className={cn(field, "mt-1 font-semibold")}
                  />
                </label>
                <label className="mt-3 block">
                  <span className="eyebrow">
                    {isReference ? "What it is good for" : "Details"}
                  </span>
                  <textarea
                    value={d.body}
                    onChange={(e) => edit(i, { body: e.target.value })}
                    rows={3}
                    className={cn(field, "mt-1 resize-y leading-relaxed")}
                  />
                </label>
                <label className="mt-3 block">
                  <span className="eyebrow">
                    Link {isReference ? "" : "(optional)"}
                  </span>
                  <input
                    value={d.url}
                    onChange={(e) => edit(i, { url: e.target.value })}
                    placeholder={
                      isReference
                        ? "https://"
                        : `${ADMIN}/web/colours or https://`
                    }
                    className={cn(field, "mt-1 font-mono text-[0.8125rem]")}
                  />
                </label>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() =>
              change([
                ...drafts,
                { key: crypto.randomUUID(), title: "", body: "", url: "" },
              ])
            }
            className={cn(smallButton, "mt-3")}
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden />
            Add a {singular}
          </button>

          <div className="border-line bg-surface sticky bottom-3 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 shadow-lg">
            <SaveState
              status={auto.status}
              error={auto.error}
              onRetry={auto.saveNow}
            />
            <button
              type="button"
              onClick={done}
              className="bg-ink hover:bg-brand-deep text-cta-fg rounded-lg px-4 py-1.5 text-[0.8125rem] font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </>
      )}
    </section>
  );
}
