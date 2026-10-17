"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Search, StickyNote, Trash2 } from "lucide-react";
import { field, primaryButton, quietButton } from "@/components/admin/Business";
import type { NoteRow } from "@/lib/project-details";
import { newId } from "@/lib/quotes";
import { cn } from "@/lib/utils";

// The editor is only for the browser, and heavy: loaded once a note opens.
const NoteEditor = dynamic(
  () => import("@/components/admin/NoteEditor").then((m) => m.NoteEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border-line bg-mist h-80 animate-pulse rounded-xl border" />
    ),
  },
);

const when = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

/** A note's text without its formatting, for search and the list. */
const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The project's notes: as many as needed, newest first, each one a
 * document with headings, lists, links, tables, pictures and files.
 * Saved with the rest of the page.
 */
export function ProjectNotes({
  projectId,
  notes,
  onChange,
  version,
}: {
  projectId: string;
  notes: NoteRow[];
  onChange: (notes: NoteRow[]) => void;
  /** Changes when the page's edits are undone, so the editor reloads. */
  version: number;
}) {
  const [openId, setOpenId] = useState(notes[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const open = notes.find((n) => n.id === openId) ?? notes[0];

  const q = query.trim().toLowerCase();
  const shown = q
    ? notes.filter((n) =>
        `${n.title} ${plain(n.html)}`.toLowerCase().includes(q),
      )
    : notes;

  function add() {
    const note: NoteRow = {
      id: newId(),
      title: "",
      html: "",
      updated: new Date().toISOString(),
    };
    onChange([note, ...notes]);
    setOpenId(note.id);
    setQuery("");
  }

  function change(id: string, patch: Partial<NoteRow>) {
    onChange(
      notes.map((n) =>
        n.id === id ? { ...n, ...patch, updated: new Date().toISOString() } : n,
      ),
    );
  }

  function remove(note: NoteRow) {
    if (!confirm(`Delete "${note.title || "Untitled note"}"?`)) return;
    const rest = notes.filter((n) => n.id !== note.id);
    onChange(rest);
    setOpenId(rest[0]?.id ?? "");
  }

  return (
    <section className="card overflow-hidden p-0">
      <header className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-ink text-[1.0625rem] font-semibold">Notes</h2>
          <p className="text-ink-faint text-[0.75rem]">
            Meeting notes, decisions, client requests, anything worth keeping.
            Format it like a document; paste links, pictures and tables in.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          className={cn(primaryButton, "inline-flex items-center gap-1.5 py-2")}
        >
          <Plus className="size-3.5" aria-hidden />
          New note
        </button>
      </header>

      {notes.length === 0 ? (
        <div className="grid place-items-center gap-3 px-4 py-12 text-center">
          <StickyNote className="text-ink-faint size-8" aria-hidden />
          <p className="text-ink-soft text-[0.875rem]">
            No notes yet for this project.
          </p>
          <button type="button" onClick={add} className={quietButton}>
            Write the first note
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="border-line bg-mist/40 border-b lg:border-r lg:border-b-0">
            {notes.length > 4 && (
              <label className="border-line relative block border-b p-2">
                <Search
                  className="text-ink-faint pointer-events-none absolute top-1/2 left-4.5 size-3.5 -translate-y-1/2"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes"
                  aria-label="Search notes"
                  className={cn(field, "py-1.5 pl-7")}
                />
              </label>
            )}
            <ul className="max-h-64 overflow-y-auto p-1.5 lg:max-h-[38rem]">
              {shown.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(n.id)}
                    aria-current={n.id === open?.id ? "true" : undefined}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left transition-colors",
                      n.id === open?.id
                        ? "bg-surface shadow-sm"
                        : "hover:bg-surface/70",
                    )}
                  >
                    <span
                      className={cn(
                        "block truncate text-[0.8125rem] font-semibold",
                        n.title ? "text-ink" : "text-ink-faint italic",
                      )}
                    >
                      {n.title || "Untitled note"}
                    </span>
                    <span className="text-ink-faint block truncate text-[0.6875rem]">
                      {n.updated ? when.format(new Date(n.updated)) : ""}
                      {plain(n.html) && ` · ${plain(n.html).slice(0, 60)}`}
                    </span>
                  </button>
                </li>
              ))}
              {shown.length === 0 && (
                <li className="text-ink-faint px-3 py-2 text-[0.75rem]">
                  No note matches.
                </li>
              )}
            </ul>
          </aside>

          {open && (
            <div className="min-w-0 space-y-3 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <input
                  value={open.title}
                  onChange={(e) => change(open.id, { title: e.target.value })}
                  placeholder="Untitled note"
                  aria-label="Note title"
                  className="text-ink placeholder:text-ink-faint focus:border-line min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-[1.25rem] font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => remove(open)}
                  aria-label="Delete note"
                  title="Delete note"
                  className="text-ink-faint hover:text-danger hover:bg-mist grid size-8 shrink-0 place-items-center rounded-md transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {open.updated && (
                <p className="text-ink-faint -mt-2 px-2 text-[0.6875rem]">
                  Last changed {when.format(new Date(open.updated))}
                </p>
              )}
              <NoteEditor
                key={`${open.id}:${version}`}
                projectId={projectId}
                html={open.html}
                onChange={(html) => change(open.id, { html })}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
