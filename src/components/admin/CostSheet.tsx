"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import {
  resetThirdPartyCosts,
  saveThirdPartyCosts,
} from "@/app/admin/(panel)/quote-actions";
import { field, primaryButton, quietButton } from "@/components/admin/Business";
import { newId } from "@/lib/quotes";
import type { CostGroup, CostItem } from "@/lib/third-party-costs";
import { cn } from "@/lib/utils";

const label = "text-ink-faint mb-1 block text-[0.6875rem] font-semibold";

const FIELDS: { key: keyof CostItem; text: string; long?: boolean }[] = [
  { key: "name", text: "Service" },
  { key: "free", text: "Free" },
  { key: "price", text: "Price" },
  { key: "extra", text: "Renewal or extra" },
  { key: "notes", text: "Notes", long: true },
  { key: "url", text: "Source link" },
  { key: "checked", text: "Checked on" },
];

/**
 * What outside services cost, for reference when quoting: read by default,
 * with an Edit button that turns every item into fields.
 */
export function CostSheet({
  initial,
  customised,
}: {
  initial: CostGroup[];
  customised: boolean;
}) {
  const [groups, setGroups] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setItem = (gi: number, ii: number, patch: Partial<CostItem>) =>
    setGroups((gs) =>
      gs.map((g, a) =>
        a !== gi
          ? g
          : {
              ...g,
              items: g.items.map((it, b) =>
                b === ii ? { ...it, ...patch } : it,
              ),
            },
      ),
    );

  function save() {
    setError(null);
    start(async () => {
      try {
        await saveThirdPartyCosts(groups);
        setSaved(groups);
        setEditing(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  function reset() {
    if (!window.confirm("Go back to the built-in list? Your edits are lost."))
      return;
    start(async () => {
      await resetThirdPartyCosts();
      window.location.reload();
    });
  }

  return (
    <div className="mt-6 space-y-6">
      {!editing && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-ink-soft max-w-2xl text-[0.8125rem]">
            Prices outside services charge, checked on the date shown. They
            change, so open the source before quoting a big amount.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={cn(quietButton, "inline-flex items-center gap-1.5 py-2")}
          >
            <Pencil className="size-3.5" aria-hidden />
            Edit
          </button>
        </div>
      )}

      {groups.map((g, gi) => (
        <section key={g.id} className="card overflow-hidden p-0">
          <header className="border-line flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
            {editing ? (
              <input
                value={g.label}
                onChange={(e) =>
                  setGroups((gs) =>
                    gs.map((x, a) =>
                      a === gi ? { ...x, label: e.target.value } : x,
                    ),
                  )
                }
                aria-label="Group name"
                className={cn(field, "max-w-sm py-2 font-semibold")}
              />
            ) : (
              <h2 className="text-ink text-[1.0625rem] font-semibold">
                {g.label}
              </h2>
            )}
            {editing && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete the ${g.label} group?`))
                    setGroups((gs) => gs.filter((_, a) => a !== gi));
                }}
                className="text-ink-faint hover:text-danger text-[0.75rem] font-semibold"
              >
                Delete group
              </button>
            )}
          </header>

          {editing ? (
            <div className="divide-line divide-y">
              {g.items.map((it, ii) => (
                <div
                  key={it.id}
                  className="grid gap-3 px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-3"
                >
                  {FIELDS.map((f) => (
                    <label
                      key={f.key}
                      className={cn(
                        "block min-w-0",
                        f.long && "sm:col-span-2 lg:col-span-3",
                      )}
                    >
                      <span className={label}>{f.text}</span>
                      {f.long ? (
                        <textarea
                          value={it[f.key]}
                          onChange={(e) =>
                            setItem(gi, ii, { [f.key]: e.target.value })
                          }
                          rows={2}
                          className={cn(field, "resize-y py-2")}
                        />
                      ) : (
                        <input
                          value={it[f.key]}
                          onChange={(e) =>
                            setItem(gi, ii, { [f.key]: e.target.value })
                          }
                          placeholder={f.key === "url" ? "https://" : undefined}
                          className={cn(field, "py-2")}
                        />
                      )}
                    </label>
                  ))}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setGroups((gs) =>
                          gs.map((x, a) =>
                            a === gi
                              ? {
                                  ...x,
                                  items: x.items.filter((_, b) => b !== ii),
                                }
                              : x,
                          ),
                        )
                      }
                      className="text-ink-faint hover:text-danger inline-flex items-center gap-1.5 py-2 text-[0.75rem] font-semibold"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Delete item
                    </button>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() =>
                    setGroups((gs) =>
                      gs.map((x, a) =>
                        a === gi
                          ? {
                              ...x,
                              items: [
                                ...x.items,
                                {
                                  id: newId(),
                                  name: "",
                                  free: "",
                                  price: "",
                                  extra: "",
                                  notes: "",
                                  url: "",
                                  checked: new Date().toLocaleDateString(
                                    "en-IN",
                                    { month: "short", year: "numeric" },
                                  ),
                                },
                              ],
                            }
                          : x,
                      ),
                    )
                  }
                  className={cn(
                    quietButton,
                    "inline-flex items-center gap-1.5",
                  )}
                >
                  <Plus className="size-3.5" aria-hidden />
                  Add item
                </button>
              </div>
            </div>
          ) : (
            <ul className="grid gap-px bg-[var(--color-line)] lg:grid-cols-2">
              {g.items.map((it) => (
                <li key={it.id} className="bg-surface px-4 py-4 sm:px-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-ink text-[0.9375rem] font-semibold">
                      {it.name}
                    </h3>
                    {it.url && (
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-deep hover:text-ink inline-flex shrink-0 items-center gap-1 text-[0.75rem] font-semibold"
                      >
                        Source
                        <ExternalLink className="size-3" aria-hidden />
                      </a>
                    )}
                  </div>
                  <p className="text-ink mt-1.5 text-[0.875rem] font-semibold">
                    {it.price}
                  </p>
                  <dl className="mt-1.5 space-y-1 text-[0.8125rem]">
                    {it.free && (
                      <div className="flex gap-2">
                        <dt className="text-leaf-deep w-14 shrink-0 font-semibold">
                          Free
                        </dt>
                        <dd className="text-ink-soft">{it.free}</dd>
                      </div>
                    )}
                    {it.extra && (
                      <div className="flex gap-2">
                        <dt className="text-ink-faint w-14 shrink-0 font-semibold">
                          Then
                        </dt>
                        <dd className="text-ink-soft">{it.extra}</dd>
                      </div>
                    )}
                  </dl>
                  {it.notes && (
                    <p className="text-ink-faint mt-2 text-[0.75rem] leading-relaxed">
                      {it.notes}
                    </p>
                  )}
                  {it.checked && (
                    <p className="text-ink-faint mt-2 text-[0.6875rem]">
                      Checked {it.checked}
                    </p>
                  )}
                </li>
              ))}
              {g.items.length % 2 === 1 && (
                <li aria-hidden className="bg-surface hidden lg:block" />
              )}
            </ul>
          )}
        </section>
      ))}

      {editing && (
        <>
          <button
            type="button"
            onClick={() =>
              setGroups((gs) => [
                ...gs,
                { id: newId(), label: "New group", items: [] },
              ])
            }
            className={cn(quietButton, "inline-flex items-center gap-1.5")}
          >
            <Plus className="size-3.5" aria-hidden />
            Add group
          </button>
          <div className="border-line bg-surface/95 sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_10px_30px_-12px_rgba(16,40,60,0.35)] backdrop-blur">
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
                onClick={() => {
                  setGroups(saved);
                  setEditing(false);
                }}
                disabled={pending}
                className={cn(quietButton, "py-2")}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className={cn(primaryButton, "px-4 py-2 disabled:opacity-50")}
              >
                {pending ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
