"use client";
import { ADMIN } from "@/lib/admin-path";

import { useEffect, useState, useTransition } from "react";
import {
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { setProjectStatus } from "@/app/admin/(panel)/business-actions";
import { saveProjectSheets } from "@/app/admin/(panel)/project-actions";
import { field, primaryButton, quietButton } from "@/components/admin/Business";
import { MoneyInput } from "@/components/admin/QuoteBuilder";
import { PROJECT_STATUSES, rupees } from "@/lib/business";
import {
  FREQUENCIES,
  type AccessRow,
  type LinkRow,
  type PaidRow,
  type ProjectSheets,
  type RecurringRow,
} from "@/lib/project-details";
import { newId } from "@/lib/quotes";
import { cn } from "@/lib/utils";

const label = "text-ink-faint mb-1 block text-[0.6875rem] font-semibold";

type Col<T> = {
  key: keyof T & string;
  text: string;
  kind: "text" | "money" | "date" | "billing" | "secret";
  /** Desktop column width. */
  w: string;
  placeholder?: string;
};

const PAID_COLS: Col<PaidRow>[] = [
  {
    key: "item",
    text: "Item",
    kind: "text",
    w: "minmax(10rem,1.4fr)",
    placeholder: "Domain for 1 year",
  },
  {
    key: "vendor",
    text: "Paid to",
    kind: "text",
    w: "minmax(7rem,1fr)",
    placeholder: "GoDaddy",
  },
  { key: "amount", text: "Amount", kind: "money", w: "8rem" },
  { key: "date", text: "Date", kind: "date", w: "9.5rem" },
  { key: "note", text: "Note", kind: "text", w: "minmax(8rem,1.2fr)" },
];
const RECURRING_COLS: Col<RecurringRow>[] = [
  {
    key: "item",
    text: "Platform",
    kind: "text",
    w: "minmax(8rem,1fr)",
    placeholder: "Railway",
  },
  { key: "billing", text: "Billing", kind: "billing", w: "8.5rem" },
  { key: "amount", text: "Amount", kind: "money", w: "8rem" },
  { key: "renews", text: "Next renewal", kind: "date", w: "9.5rem" },
  { key: "note", text: "Details", kind: "text", w: "minmax(12rem,2.2fr)" },
];
const ACCESS_COLS: Col<AccessRow>[] = [
  {
    key: "service",
    text: "Service",
    kind: "text",
    w: "minmax(8rem,1fr)",
    placeholder: "Admin portal",
  },
  {
    key: "url",
    text: "Link",
    kind: "text",
    w: "minmax(9rem,1.2fr)",
    placeholder: "https://",
  },
  {
    key: "username",
    text: "Username or email",
    kind: "text",
    w: "minmax(9rem,1.2fr)",
  },
  { key: "password", text: "Password", kind: "secret", w: "minmax(8rem,1fr)" },
  { key: "note", text: "Note", kind: "text", w: "minmax(7rem,1fr)" },
];

const TABS = [
  { id: "paid", label: "Amounts paid" },
  { id: "recurring", label: "Services and charges" },
  { id: "access", label: "Passwords" },
] as const;
type Tab = (typeof TABS)[number]["id"];

/**
 * The working file of one project: status, deployment links and the three
 * handover sheets, saved together and downloaded as one Excel workbook.
 */
export function ProjectWorkspace({
  projectId,
  status,
  initial,
  vaultReady,
}: {
  projectId: string;
  status: string;
  initial: ProjectSheets;
  vaultReady: boolean;
}) {
  const [s, setS] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(s) !== saved;
  const [tab, setTab] = useState<Tab>("paid");
  const [show, setShow] = useState(false);
  const [pending, start] = useTransition();
  const [statusPending, startStatus] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function save() {
    const snapshot = JSON.stringify(s);
    setError(null);
    start(async () => {
      try {
        await saveProjectSheets(projectId, s);
        setSaved(snapshot);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  function changeStatus(next: string) {
    const form = new FormData();
    form.set("id", projectId);
    form.set("status", next);
    startStatus(() => setProjectStatus(form));
  }

  const paidTotal = s.paid.reduce((n, r) => n + r.amount, 0);
  const monthly = s.recurring
    .filter((r) => r.billing === "monthly")
    .reduce((n, r) => n + r.amount, 0);
  const yearly = s.recurring
    .filter((r) => r.billing === "yearly")
    .reduce((n, r) => n + r.amount, 0);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="card space-y-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-ink text-[1.0625rem] font-semibold">
              Current status
            </h2>
            <select
              defaultValue={status}
              onChange={(e) => changeStatus(e.target.value)}
              disabled={statusPending}
              aria-label="Project status"
              className={cn(field, "w-auto py-1.5")}
            >
              {PROJECT_STATUSES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <label className="block">
            <span className={label}>Where it stands, what is next</span>
            <textarea
              value={s.statusNote}
              onChange={(e) => setS({ ...s, statusNote: e.target.value })}
              rows={6}
              placeholder={
                "Design approved.\nAdmin portal in progress, due next week.\nWaiting for product photos from the client."
              }
              className={cn(field, "resize-y py-2 leading-relaxed")}
            />
          </label>
        </section>

        <section className="card p-4 sm:p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">
            Deployment links
          </h2>
          <p className="text-ink-faint mt-0.5 text-[0.75rem]">
            Live site, admin portal, test site, code repository, app stores.
          </p>
          <ul className="mt-3 space-y-2">
            {s.links.map((l, i) => (
              <li key={l.id} className="flex items-center gap-2">
                <input
                  value={l.label}
                  onChange={(e) =>
                    setS({
                      ...s,
                      links: s.links.map((x, j) =>
                        j === i ? { ...x, label: e.target.value } : x,
                      ),
                    })
                  }
                  placeholder="Live site"
                  aria-label="Link name"
                  className={cn(field, "w-32 shrink-0 py-2 sm:w-40")}
                />
                <input
                  value={l.url}
                  onChange={(e) =>
                    setS({
                      ...s,
                      links: s.links.map((x, j) =>
                        j === i ? { ...x, url: e.target.value } : x,
                      ),
                    })
                  }
                  placeholder="https://"
                  aria-label={`${l.label || "Link"} address`}
                  className={cn(field, "min-w-0 flex-1 py-2")}
                />
                {/^https?:\/\//.test(l.url) && (
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${l.label || "link"}`}
                    className="text-brand-deep hover:bg-mist grid size-8 shrink-0 place-items-center rounded-md"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
                <RemoveButton
                  label={`Remove ${l.label || "link"}`}
                  onClick={() =>
                    setS({ ...s, links: s.links.filter((_, j) => j !== i) })
                  }
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() =>
              setS({
                ...s,
                links: [
                  ...s.links,
                  { id: newId(), label: "", url: "" } satisfies LinkRow,
                ],
              })
            }
            className={cn(quietButton, "mt-3 inline-flex items-center gap-1.5")}
          >
            <Plus className="size-3.5" aria-hidden />
            Add link
          </button>
        </section>
      </div>

      <section className="card overflow-hidden p-0">
        <header className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-ink text-[1.0625rem] font-semibold">
              Handover sheet
            </h2>
            <p className="text-ink-faint text-[0.75rem]">
              Filled in as the project goes; given to the client as an Excel
              file at handover.
            </p>
          </div>
          <a
            href={dirty ? undefined : `${ADMIN}/projects/${projectId}/sheet`}
            aria-disabled={dirty}
            title={dirty ? "Save first" : "Download as Excel"}
            className={cn(
              quietButton,
              "inline-flex items-center gap-1.5 py-2",
              dirty && "pointer-events-none opacity-50",
            )}
          >
            <Download className="size-3.5" aria-hidden />
            Download Excel
          </a>
        </header>

        <div className="border-line flex flex-wrap items-center gap-2 border-b px-4 py-2.5 sm:px-5">
          <div role="tablist" className="bg-mist inline-flex rounded-lg p-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                  tab === t.id
                    ? "bg-surface text-ink shadow-sm"
                    : "text-ink-faint hover:text-ink",
                )}
              >
                {t.label}
                <span className="text-ink-faint ml-1.5 font-normal">
                  {s[t.id].length}
                </span>
              </button>
            ))}
          </div>
          <p className="text-ink-soft ml-auto text-[0.8125rem] tabular-nums">
            {tab === "paid" && `Total paid ${rupees.format(paidTotal)}`}
            {tab === "recurring" &&
              [
                monthly && `${rupees.format(monthly)} a month`,
                yearly && `${rupees.format(yearly)} a year`,
              ]
                .filter(Boolean)
                .join(" + ")}
            {tab === "access" && (
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="text-brand-deep hover:text-ink inline-flex items-center gap-1.5 font-semibold"
              >
                {show ? (
                  <EyeOff className="size-3.5" aria-hidden />
                ) : (
                  <Eye className="size-3.5" aria-hidden />
                )}
                {show ? "Hide passwords" : "Show passwords"}
              </button>
            )}
          </p>
        </div>

        {tab === "access" && !vaultReady && (
          <p className="bg-amber-wash text-amber-deep flex gap-2 px-4 py-2.5 text-[0.75rem] sm:px-5">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Passwords are saved without encryption until PROJECT_VAULT_KEY is
            added to the site&apos;s variables in Railway.
          </p>
        )}

        {tab === "paid" && (
          <SheetTable
            cols={PAID_COLS}
            rows={s.paid}
            onChange={(paid) => setS({ ...s, paid })}
            blank={() => ({
              id: newId(),
              item: "",
              vendor: "",
              amount: 0,
              date: new Date().toISOString().slice(0, 10),
              note: "",
            })}
            addText="Add payment"
          />
        )}
        {tab === "recurring" && (
          <SheetTable
            cols={RECURRING_COLS}
            rows={s.recurring}
            onChange={(recurring) => setS({ ...s, recurring })}
            blank={(): RecurringRow => ({
              id: newId(),
              item: "",
              vendor: "",
              amount: 0,
              billing: "monthly",
              renews: "",
              note: "",
            })}
            addText="Add charge"
          />
        )}
        {tab === "access" && (
          <SheetTable
            cols={ACCESS_COLS}
            rows={s.access}
            onChange={(access) => setS({ ...s, access })}
            blank={() => ({
              id: newId(),
              service: "",
              url: "",
              username: "",
              password: "",
              note: "",
            })}
            addText="Add login"
            showSecrets={show}
          />
        )}
      </section>

      {(dirty || error) && (
        <div className="border-line bg-surface/95 sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_10px_30px_-12px_rgba(16,40,60,0.35)] backdrop-blur">
          <p className="text-amber-deep text-[0.8125rem]">Unsaved changes</p>
          {error && (
            <p className="text-danger text-[0.8125rem]" role="alert">
              {error}
            </p>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setS(JSON.parse(saved) as ProjectSheets)}
              disabled={pending}
              className={cn(quietButton, "py-2")}
            >
              Undo
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
      )}
    </div>
  );
}

/**
 * An editable sheet: a grid of inputs on a wide screen, a card per row on a
 * phone, with a row added at the bottom.
 */
function SheetTable<T extends { id: string }>({
  cols,
  rows,
  onChange,
  blank,
  addText,
  showSecrets = false,
}: {
  cols: Col<T>[];
  rows: T[];
  onChange: (rows: T[]) => void;
  blank: () => T;
  addText: string;
  showSecrets?: boolean;
}) {
  const grid = `${cols.map((c) => c.w).join(" ")} 2rem`;
  const set = (i: number, key: keyof T, value: unknown) =>
    onChange(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));

  const cell = (r: T, i: number, c: Col<T>) => {
    const value = r[c.key] as unknown;
    if (c.kind === "money")
      return (
        <MoneyInput
          value={Number(value) || 0}
          onChange={(n) => set(i, c.key, n)}
          ariaLabel={c.text}
        />
      );
    if (c.kind === "billing")
      return (
        <select
          value={String(value)}
          onChange={(e) => set(i, c.key, e.target.value)}
          aria-label={c.text}
          className={cn(field, "py-2")}
        >
          {FREQUENCIES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      );
    return (
      <input
        type={
          c.kind === "date"
            ? "date"
            : c.kind === "secret" && !showSecrets
              ? "password"
              : "text"
        }
        autoComplete={c.kind === "secret" ? "new-password" : "off"}
        value={String(value ?? "")}
        onChange={(e) => set(i, c.key, e.target.value)}
        placeholder={c.placeholder}
        aria-label={c.text}
        className={cn(field, "py-2", c.kind === "secret" && "font-mono")}
      />
    );
  };

  return (
    <div className="px-4 py-3 sm:px-5">
      {rows.length > 0 && (
        <div
          className="text-ink-faint mb-1.5 hidden gap-2 text-[0.6875rem] font-semibold lg:grid"
          style={{ gridTemplateColumns: grid }}
        >
          {cols.map((c) => (
            <span key={c.key}>{c.text}</span>
          ))}
        </div>
      )}
      <ul className="space-y-3 lg:space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className="border-line rounded-lg border p-3 lg:rounded-none lg:border-0 lg:p-0"
          >
            <div
              className="hidden items-center gap-2 lg:grid"
              style={{ gridTemplateColumns: grid }}
            >
              {cols.map((c) => (
                <div key={c.key} className="min-w-0">
                  {cell(r, i, c)}
                </div>
              ))}
              <RemoveButton
                label="Remove row"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:hidden">
              {cols.map((c, k) => (
                <label
                  key={c.key}
                  className={cn("block min-w-0", k === 0 && "col-span-2")}
                >
                  <span className={label}>{c.text}</span>
                  {cell(r, i, c)}
                </label>
              ))}
              <div className="col-span-2 flex justify-end">
                <RemoveButton
                  label="Remove row"
                  onClick={() => onChange(rows.filter((_, j) => j !== i))}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {rows.length === 0 && (
        <p className="text-ink-faint py-4 text-center text-[0.8125rem]">
          Nothing here yet.
        </p>
      )}
      <button
        type="button"
        onClick={() => onChange([...rows, blank()])}
        className={cn(quietButton, "mt-3 inline-flex items-center gap-1.5")}
      >
        <Plus className="size-3.5" aria-hidden />
        {addText}
      </button>
    </div>
  );
}

function RemoveButton({
  label: text,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={text}
      title={text}
      className="text-ink-faint hover:text-danger hover:bg-mist grid size-8 shrink-0 place-items-center rounded-md transition-colors"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}
