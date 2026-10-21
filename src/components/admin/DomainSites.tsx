"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { SaveState, useAutoSave } from "@/components/admin/autosave";
import {
  saveDomainSites,
  type DomainSiteInput,
} from "@/app/admin/(panel)/actions";
import {
  DOMAIN_INDUSTRIES,
  byScore,
  type DomainSite,
} from "@/lib/content/web-domains";
import { cn } from "@/lib/utils";

type Draft = DomainSiteInput & { key: string };

const field =
  "border-line bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2 text-[0.875rem] transition-colors focus:outline-none";
const iconButton =
  "text-ink-faint hover:bg-mist hover:text-ink grid size-8 place-items-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30";
const smallButton =
  "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors";

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const toDraft = (s: DomainSite): Draft => ({
  key: crypto.randomUUID(),
  name: s.name,
  url: s.url,
  score: s.score ?? null,
  note: s.note ?? "",
});

function Stars({ score }: { score?: number }) {
  if (!score) return null;
  return (
    <span className="text-brand-deep inline-flex" aria-label={`${score} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < score ? "fill-current" : "opacity-25")}
          strokeWidth={2}
          aria-hidden
        />
      ))}
    </span>
  );
}

/**
 * Websites to look at for one kind of business. The dropdown picks the
 * domain; the list shows the best-scored first. Edit turns it into fields,
 * saved by themselves a moment after each change.
 */
export function DomainSites({
  domain,
  initial,
  customised,
}: {
  domain: string;
  initial: DomainSite[];
  customised: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [sites, setSites] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(() => initial.map(toDraft));

  const ready = drafts
    .filter((d) => d.name.trim() || d.url.trim())
    .map(({ key: _key, ...s }) => s);
  const auto = useAutoSave(ready, async (list) => {
    const result = await saveDomainSites(domain, list);
    if (result.error) throw new Error(result.error);
  });

  const edit = (i: number, patch: Partial<Draft>) =>
    setDrafts(drafts.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  function move(i: number, by: -1 | 1) {
    const next = [...drafts];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setDrafts(next);
  }

  function done() {
    if (auto.dirty) auto.saveNow();
    setSites(
      ready.map((s) => ({
        name: s.name.trim(),
        url: s.url.trim(),
        ...(s.score ? { score: s.score } : {}),
        ...(s.note.trim() ? { note: s.note.trim() } : {}),
      })),
    );
    setEditing(false);
  }

  function pick(next: string) {
    if (auto.dirty) auto.saveNow();
    startTransition(() =>
      router.replace(`${pathname}?category=domains&domain=${next}`, {
        scroll: false,
      }),
    );
  }

  return (
    <section className={cn("transition-opacity", pending && "opacity-60")}>
      <div className="card flex flex-wrap items-center justify-between gap-3 p-3">
        <label className="flex flex-wrap items-center gap-2">
          <span className="text-ink text-[0.8125rem] font-semibold">
            Domain
          </span>
          <select
            value={domain}
            onChange={(e) => pick(e.target.value)}
            className="border-line bg-surface text-ink focus:border-brand rounded-lg border px-3 py-1.5 text-[0.875rem] focus:outline-none"
          >
            {DOMAIN_INDUSTRIES.map((g) => (
              <optgroup key={g.industry} label={g.industry}>
                {g.domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
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
      {!customised && !editing && !auto.dirty && sites === initial && (
        <p className="text-ink-faint mt-3 text-[0.75rem]">
          The built-in list. Edit it to make it yours.
        </p>
      )}

      {!editing ? (
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {byScore(sites).map((s) => (
            <li key={`${s.name}-${s.url}`}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="card hover:border-brand group block h-full p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-ink text-[0.9375rem] font-semibold">
                    {s.name}
                  </h3>
                  <Stars score={s.score} />
                </div>
                <p className="text-brand-deep mt-0.5 inline-flex items-center gap-1 font-mono text-[0.75rem]">
                  {host(s.url)}
                  <ExternalLink className="size-3" strokeWidth={2} aria-hidden />
                </p>
                {s.note && (
                  <p className="text-ink-soft mt-2 text-[0.8125rem] leading-relaxed">
                    {s.note}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
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
                      onClick={() => setDrafts(drafts.filter((_, j) => j !== i))}
                      aria-label="Delete website"
                      className={cn(iconButton, "hover:text-danger")}
                    >
                      <Trash2 className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_6rem] gap-2">
                  <label className="block">
                    <span className="eyebrow">Name</span>
                    <input
                      value={d.name}
                      onChange={(e) => edit(i, { name: e.target.value })}
                      className={cn(field, "mt-1 font-semibold")}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Score</span>
                    <select
                      value={d.score ?? ""}
                      onChange={(e) =>
                        edit(i, {
                          score: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className={cn(field, "mt-1")}
                    >
                      <option value="">None</option>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} ★
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mt-3 block">
                  <span className="eyebrow">Link</span>
                  <input
                    value={d.url}
                    onChange={(e) => edit(i, { url: e.target.value })}
                    placeholder="https://"
                    className={cn(field, "mt-1 font-mono text-[0.8125rem]")}
                  />
                </label>
                <label className="mt-3 block">
                  <span className="eyebrow">What to look at</span>
                  <textarea
                    value={d.note}
                    onChange={(e) => edit(i, { note: e.target.value })}
                    rows={2}
                    className={cn(field, "mt-1 resize-y leading-relaxed")}
                  />
                </label>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() =>
              setDrafts([
                ...drafts,
                {
                  key: crypto.randomUUID(),
                  name: "",
                  url: "",
                  score: null,
                  note: "",
                },
              ])
            }
            className={cn(smallButton, "mt-3")}
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden />
            Add a website
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
