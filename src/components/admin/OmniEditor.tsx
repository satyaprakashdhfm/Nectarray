"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SaveState, useAutoSave } from "@/components/admin/autosave";
import { STATUS_TONE } from "@/components/admin/omni-status";
import {
  removeOmniPiece,
  saveOmniPiece,
  setOmniStatus,
  type OmniDraft,
} from "@/app/admin/(panel)/(website)/omniproof/actions";
import { ADMIN } from "@/lib/admin-path";
import { FIELDS, fieldById, type FieldId } from "@/lib/content/omniproof";
import type { OmniStatus } from "@/lib/omniproof";
import { cn } from "@/lib/utils";

/** Five minutes at 220 words a minute: the most an Omniproof piece runs to. */
const MAX_WORDS = 1100;

const field =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-brand focus:outline-none";
const label = "mb-1.5 block text-[0.8125rem] font-semibold text-ink";
const hint = "mt-1 text-[0.75rem] text-ink-faint";

/**
 * The Omniproof editor, laid out after the Deeds & Co articles console: the
 * piece itself on the left (title, one-line description, the body), and the
 * panels that place it on the right (status, where it sits on the map, the
 * fields it lands in, its source and cover).
 *
 * The body is markdown, the same text the files in content/omniproof hold,
 * so a piece pasted from a document or written by the omniproof-writer skill
 * goes in as it is. Preview is the saved text, rendered on the server by
 * the site's own renderer (it is server-only, so it cannot run here).
 * Everything saves by itself a moment after typing stops; the status is the
 * only thing that needs a click, so nothing goes live by accident.
 */
export function OmniEditor({
  slug,
  status: initialStatus,
  inRepo,
  edited,
  initial,
  preview,
}: {
  slug: string;
  status: OmniStatus;
  /** Whether the piece started as a file in content/omniproof. */
  inRepo: boolean;
  /** Whether it has a row in the table yet (edited here, or new). */
  edited: boolean;
  initial: OmniDraft;
  /** The saved body, rendered on the server by the site's own renderer. */
  preview: React.ReactNode;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState(initialStatus);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, startTransition] = useTransition();
  const [problem, setProblem] = useState<string | null>(null);

  const auto = useAutoSave(draft, async (d) => {
    const result = await saveOmniPiece(slug, d);
    if (result.error) throw new Error(result.error);
    // The first save of a bundled piece copies it in: offer the way back.
    if (!edited) router.refresh();
  });

  // Once a save lands while the preview is open, render the saved text.
  const saved = auto.status === "saved";
  useEffect(() => {
    if (saved && tab === "preview") router.refresh();
  }, [saved, tab, router]);

  const set = <K extends keyof OmniDraft>(key: K, value: OmniDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const home = fieldById(draft.field as FieldId);
  const words = draft.body.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  const impactFor = (id: string) =>
    draft.lands.find((l) => l.field === id)?.impact ?? "";
  const setImpact = (id: string, impact: string) =>
    set("lands", [
      ...draft.lands.filter((l) => l.field !== id),
      ...(impact ? [{ field: id, impact }] : []),
    ]);

  function changeStatus(next: OmniStatus) {
    setProblem(null);
    startTransition(async () => {
      if (auto.dirty) auto.saveNow();
      const result = await setOmniStatus(slug, next);
      if (result.error) setProblem(result.error);
      else {
        setStatus(next);
        router.refresh();
      }
    });
  }

  function remove() {
    const question = inRepo
      ? "Undo every change made here and go back to the version in the repo?"
      : `Delete “${draft.title}”? This cannot be undone.`;
    if (!window.confirm(question)) return;
    startTransition(() => removeOmniPiece(slug));
  }

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`${ADMIN}/omniproof`}
          className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All pieces
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <SaveState
            status={auto.status}
            error={auto.error}
            onRetry={auto.saveNow}
          />
          <span
            className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold capitalize ${STATUS_TONE[status]}`}
          >
            {status}
          </span>
          {status === "published" && (
            <Link
              href={`/omniproof/${slug}`}
              target="_blank"
              className="text-brand-deep inline-flex items-center gap-0.5 text-[0.875rem] font-semibold"
            >
              View on the site
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* The piece. */}
        <div className="card min-w-0 p-5 sm:p-7">
          <input
            aria-label="Title"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Title"
            className="display text-ink placeholder:text-ink-faint w-full bg-transparent text-[1.75rem] leading-tight focus:outline-none sm:text-[2.125rem]"
          />
          <textarea
            aria-label="Description"
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="One or two sentences: what happened and why it matters. Shown under the title, on the card and in Google."
            className="text-ink-soft placeholder:text-ink-faint mt-3 w-full resize-y bg-transparent text-[1.0625rem] leading-relaxed focus:outline-none"
          />

          <div className="border-line mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div className="flex gap-1" role="tablist" aria-label="Body">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => {
                    setTab(t);
                    // The preview is the saved text: save, then re-render.
                    if (t === "preview" && auto.dirty) auto.saveNow();
                  }}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold capitalize transition-colors",
                    tab === t
                      ? "bg-ink text-cta-fg"
                      : "text-ink-soft hover:bg-mist",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <p
              className={cn(
                "text-[0.8125rem] font-semibold",
                words > MAX_WORDS ? "text-amber-deep" : "text-ink-faint",
              )}
            >
              {words.toLocaleString("en-IN")} words · {minutes} min read
              {words > MAX_WORDS && " · over five minutes"}
            </p>
          </div>

          {tab === "write" ? (
            <>
              <textarea
                aria-label="Body, in markdown"
                value={draft.body}
                onChange={(e) => set("body", e.target.value)}
                rows={28}
                spellCheck
                placeholder={
                  "Markdown. Paste the whole piece here.\n\n## What happened\n\n## How it was actually done\n\n## The business impact\n\n## The impact on society"
                }
                className={`${field} mt-4 resize-y font-mono text-[0.875rem] leading-relaxed`}
              />
              <p className={hint}>
                ## for a section, **bold**, [a link](https://…), - for a list,
                ![alt](/omniproof/{slug}/picture.svg) for a picture. “Where this
                lands” is not written here: it comes from the panel on the
                right.
              </p>
            </>
          ) : (
            <div className="mt-6">
              {auto.status !== "saved" && (
                <p className="text-ink-faint mb-4 text-[0.8125rem]">
                  Saving… the preview catches up once it is saved.
                </p>
              )}
              {draft.body.trim() ? (
                preview
              ) : (
                <p className="text-ink-faint">Nothing written yet.</p>
              )}
            </div>
          )}
        </div>

        {/* What places it. */}
        <div className="grid content-start gap-4">
          <Panel title="Status">
            <div className="grid grid-cols-3 gap-1.5">
              {(["draft", "published", "archived"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy || s === status}
                  onClick={() => changeStatus(s)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-[0.8125rem] font-semibold capitalize transition-colors",
                    s === status
                      ? "border-brand bg-brand-wash text-brand-deep"
                      : "border-line text-ink-soft hover:border-brand hover:text-ink",
                  )}
                >
                  {s === "published" && s !== status ? "Publish" : s}
                </button>
              ))}
            </div>
            <p className={hint}>
              Only published pieces are on the site and the map. Edits to a
              published piece go live as they save.
            </p>
            {problem && (
              <p className="text-danger mt-2 text-[0.8125rem]">{problem}</p>
            )}
          </Panel>

          <Panel title="On the map">
            <div className="grid grid-cols-2 gap-3">
              <label className="col-span-2">
                <span className={label}>Domain</span>
                <select
                  value={draft.field}
                  onChange={(e) => {
                    const f = fieldById(e.target.value as FieldId);
                    setDraft((d) => ({
                      ...d,
                      field: f.id,
                      subfield: f.subfields[0].id,
                      lands: d.lands.filter((l) => l.field !== f.id),
                    }));
                  }}
                  className={field}
                >
                  {FIELDS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="col-span-2">
                <span className={label}>Subdomain</span>
                <select
                  value={draft.subfield}
                  onChange={(e) => set("subfield", e.target.value)}
                  className={field}
                >
                  {home.subfields.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className={label}>Short name</span>
                <input
                  value={draft.short}
                  maxLength={40}
                  onChange={(e) => set("short", e.target.value)}
                  className={field}
                />
              </label>
              <label>
                <span className={label}>Date</span>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={field}
                />
              </label>
            </div>
            <p className={hint}>
              The short name is the label on its leaf in the map. Web address:
              /omniproof/{slug}
            </p>
          </Panel>

          <Panel title="Where this lands">
            <p className={`${hint} mt-0 mb-3`}>
              One line for each domain the result reaches: what it changes there.
              Leave a domain empty if it does not land there. These draw the
              links between domains on the map.
            </p>
            <div className="grid gap-3">
              {FIELDS.filter((f) => f.id !== draft.field).map((f) => (
                <label key={f.id}>
                  <span className={`${label} flex items-center gap-2`}>
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: f.color }}
                      aria-hidden
                    />
                    {f.label}
                  </span>
                  <textarea
                    value={impactFor(f.id)}
                    onChange={(e) => setImpact(f.id, e.target.value)}
                    rows={impactFor(f.id) ? 3 : 1}
                    placeholder="Does not land here"
                    className={`${field} resize-y text-[0.875rem]`}
                  />
                </label>
              ))}
            </div>
          </Panel>

          <Panel title="Source">
            <label className="block">
              <span className={label}>Built on</span>
              <input
                value={draft.sourceLabel}
                onChange={(e) => set("sourceLabel", e.target.value)}
                placeholder="Lex Fridman Podcast #503"
                className={field}
              />
            </label>
            <label className="mt-3 block">
              <span className={label}>Link</span>
              <input
                value={draft.sourceHref}
                onChange={(e) => set("sourceHref", e.target.value)}
                placeholder="https://"
                className={field}
              />
            </label>
          </Panel>

          <Panel title="Cover">
            <label className="block">
              <span className={label}>Image</span>
              <input
                value={draft.coverSrc}
                onChange={(e) => set("coverSrc", e.target.value)}
                placeholder="/omniproof/… or https://"
                className={field}
              />
            </label>
            <label className="mt-3 block">
              <span className={label}>Describe it</span>
              <input
                value={draft.coverAlt}
                onChange={(e) => set("coverAlt", e.target.value)}
                placeholder="What the picture shows, for screen readers"
                className={field}
              />
            </label>
            <p className={hint}>
              Optional. Without one the card shows the domain’s colour and the
              short name.
            </p>
          </Panel>

          {(edited || !inRepo) && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="text-danger hover:bg-mist justify-self-start rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold disabled:opacity-40"
            >
              {inRepo
                ? "Go back to the version in the repo"
                : "Delete this piece"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-4 sm:p-5">
      <h2 className="text-ink mb-3 text-[0.9375rem] font-semibold">{title}</h2>
      {children}
    </section>
  );
}
