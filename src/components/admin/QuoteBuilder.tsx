"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  FileDown,
  ListPlus,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  addQuoteProjects,
  deleteQuote,
  saveQuote,
} from "@/app/admin/(panel)/quote-actions";
import {
  StatusPill,
  field,
  primaryButton,
  quietButton,
} from "@/components/admin/Business";
import {
  PROJECT_SERVICES,
  PROJECT_STATUSES,
  num,
  rupees,
  serviceLabel,
} from "@/lib/business";
import {
  DISCOUNT_PERCENTS,
  QUOTE_SECTIONS,
  QUOTE_STATUSES,
  BILLINGS,
  billingOf,
  rateFor,
  type Billing,
  STANDARD_TERMS,
  catalogueFor,
  standardFor,
  discountOf,
  lineTotal,
  newId,
  quoteTotals,
  serviceTab,
  totalsByService,
  understandingFromLines,
  type Discount,
  type QuoteBody,
  type QuoteDoc,
  type QuoteLine,
  type QuoteSection,
  type QuoteService,
} from "@/lib/quotes";
import { quoteHtml, type QuoteDocData } from "@/lib/quote-html";
import { QuoteIcon } from "@/components/admin/quote-icons";
import { cn } from "@/lib/utils";

type QuoteRecord = {
  id: string;
  number: string;
  title: string;
  company: string;
  contactName: string;
  phone: string;
  email: string;
  status: string;
  quoteDate: string;
  body: QuoteBody;
};

type Meta = Omit<QuoteRecord, "id" | "number" | "body">;

type LinkedProject = {
  id: string;
  service: string;
  title: string;
  status: string;
  value: string | null;
};

const label = "text-ink-faint mb-1 block text-[0.6875rem] font-semibold";

export function QuoteStatusPill({ status }: { status: string }) {
  const s = QUOTE_STATUSES.find((x) => x.id === status);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold whitespace-nowrap",
        s?.tone ?? "bg-mist text-ink-soft",
      )}
    >
      {s?.label ?? status}
    </span>
  );
}

/**
 * One quote, start to finish.
 *
 * Prices: the client's details, then the rows in three sections (build,
 * marketing, maintenance), each with a tick to include it, a service, a
 * price and a discount, and options grouped under one heading. Totals and
 * "add to the service tabs" sit beside them.
 *
 * Document: the wording, next to the page exactly as it prints. The page
 * can also be typed on for a last change before printing.
 */
export function QuoteBuilder({
  quote,
  projects,
  standards,
}: {
  quote: QuoteRecord;
  projects: LinkedProject[];
  /** The Standard prices list: what a row costs when it is ticked. */
  standards: QuoteLine[];
}) {
  const [meta, setMeta] = useState<Meta>(() => ({
    title: quote.title,
    company: quote.company,
    contactName: quote.contactName,
    phone: quote.phone,
    email: quote.email,
    status: quote.status,
    quoteDate: quote.quoteDate,
  }));
  const [body, setBody] = useState<QuoteBody>(quote.body);
  const [saved, setSaved] = useState(() => JSON.stringify({ meta, body }));
  const current = JSON.stringify({ meta, body });
  const dirty = current !== saved;
  const [tab, setTab] = useState<"prices" | "document">("prices");
  const [saving, startSave] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function save() {
    const snapshot = current;
    setError(null);
    startSave(async () => {
      try {
        await saveQuote(quote.id, { ...meta, body });
        setSaved(snapshot);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });
  }

  const setMetaField = (key: keyof Meta, value: string) =>
    setMeta((m) => ({ ...m, [key]: value }));
  const setLines = (fn: (lines: QuoteLine[]) => QuoteLine[]) =>
    setBody((b) => ({ ...b, lines: fn(b.lines) }));
  const setDoc = (patch: Partial<QuoteDoc>) =>
    setBody((b) => ({ ...b, doc: { ...b.doc, ...patch } }));

  const ops: LineOps = {
    standard: (line) => standardFor(line, standards),
    update: (id, patch) =>
      setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l))),
    remove: (id) => setLines((ls) => ls.filter((l) => l.id !== id)),
    move: (id, dir) =>
      setLines((ls) => {
        const i = ls.findIndex((l) => l.id === id);
        const me = ls[i];
        let j = i + dir;
        while (
          j >= 0 &&
          j < ls.length &&
          (ls[j].section !== me.section || ls[j].groupId !== me.groupId)
        )
          j += dir;
        if (j < 0 || j >= ls.length) return ls;
        const next = [...ls];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    add: (section) => setLines((ls) => [...ls, blankLine(section)]),
    addGroup: (section) =>
      setLines((ls) => {
        const g = { id: newId(), name: "New group" };
        return [...ls, blankLine(section, g), blankLine(section, g)];
      }),
    addToGroup: (groupId) =>
      setLines((ls) => {
        const at = ls.findLastIndex((l) => l.groupId === groupId);
        const like = ls[at];
        const next = [...ls];
        next.splice(
          at + 1,
          0,
          blankLine(like.section, {
            id: groupId,
            name: like.groupName ?? "",
          }),
        );
        return next;
      }),
    renameGroup: (groupId, name) =>
      setLines((ls) =>
        ls.map((l) => (l.groupId === groupId ? { ...l, groupName: name } : l)),
      ),
  };

  const docData: QuoteDocData = useMemo(
    () => ({ number: quote.number, ...meta, body }),
    [quote.number, meta, body],
  );

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div className="min-w-0">
          <h1 className="display text-ink truncate text-[1.6rem] sm:text-[2rem]">
            {meta.company || "Untitled quote"}
          </h1>
          <p className="text-ink-faint text-[0.8125rem]">
            {quote.number}
            {meta.title ? ` · ${meta.title}` : ""}
          </p>
        </div>
      </div>

      <div className="border-line bg-surface/95 sticky top-[72px] z-30 mt-4 flex flex-wrap items-center gap-2 rounded-xl border px-2.5 py-2 shadow-sm backdrop-blur sm:gap-3">
        <div
          role="tablist"
          aria-label="Quote view"
          className="bg-mist inline-flex rounded-lg p-0.5"
        >
          {(
            [
              ["prices", "Prices"],
              ["document", "Document"],
            ] as const
          ).map(([id, text]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors",
                tab === id
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-faint hover:text-ink",
              )}
            >
              {text}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2">
          <span className="text-ink-faint hidden text-[0.75rem] font-semibold sm:inline">
            Status
          </span>
          <select
            value={meta.status}
            onChange={(e) => setMetaField("status", e.target.value)}
            className={cn(field, "w-auto py-1.5")}
            aria-label="Status"
          >
            {QUOTE_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <span
          className={cn(
            "hidden text-[0.75rem] sm:inline",
            dirty ? "text-amber-deep" : "text-ink-faint",
          )}
          aria-live="polite"
        >
          {saving ? "Saving" : dirty ? "Unsaved changes" : "Saved"}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className={cn(primaryButton, "px-4 py-2 disabled:opacity-50")}
        >
          {saving ? "Saving" : "Save"}
        </button>
        {error && (
          <p className="text-danger w-full text-[0.8125rem]" role="alert">
            {error}
          </p>
        )}
      </div>

      {tab === "prices" ? (
        <div className="mt-6 space-y-6">
          <ClientCard meta={meta} set={setMetaField} />
          {QUOTE_SECTIONS.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              lines={body.lines.filter((l) => l.section === section.id)}
              ops={ops}
            />
          ))}
          <TotalsBar
            body={body}
            setDiscount={(discount) => setBody((b) => ({ ...b, discount }))}
          />
          <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ProjectsCard
              quoteId={quote.id}
              body={body}
              meta={meta}
              dirty={dirty}
              projects={projects}
            />
          </div>
          <form
            action={deleteQuote}
            onSubmit={(e) => {
              if (!window.confirm("Delete this quote? This cannot be undone."))
                e.preventDefault();
            }}
            className="px-1"
          >
            <input type="hidden" name="id" value={quote.id} />
            <button
              type="submit"
              className="text-ink-faint hover:text-danger inline-flex items-center gap-1.5 text-[0.75rem] font-semibold transition-colors"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Delete this quote
            </button>
          </form>
        </div>
      ) : (
        <DocumentPane
          data={docData}
          setDoc={setDoc}
          setValidDays={(validDays) => setBody((b) => ({ ...b, validDays }))}
        />
      )}
    </div>
  );
}

function blankLine(
  section: QuoteSection,
  group?: { id: string; name: string },
): QuoteLine {
  return {
    id: newId(),
    on: true,
    section,
    groupId: group?.id ?? null,
    groupName: group?.name ?? null,
    name: "",
    service: section === "marketing" ? "marketing" : "software",
    description: "",
    price: 0,
    billing: section === "build" ? "once" : "monthly",
    discount: { mode: "none", value: 0 },
  };
}

// Client ---------------------------------------------------------------------

function ClientCard({
  meta,
  set,
}: {
  meta: Meta;
  set: (key: keyof Meta, value: string) => void;
}) {
  const input = (
    key: keyof Meta,
    text: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className="block min-w-0">
      <span className={label}>
        {text}
        {props.required && <span className="text-danger"> *</span>}
      </span>
      <input
        value={meta[key]}
        onChange={(e) => set(key, e.target.value)}
        className={cn(field, "py-2")}
        {...props}
      />
    </label>
  );
  return (
    <section className="card p-4 sm:p-5">
      <h2 className="text-ink text-[1.0625rem] font-semibold">Client</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {input("company", "Company", { required: true })}
        {input("contactName", "Contact person")}
        {input("phone", "Phone", { type: "tel", inputMode: "tel" })}
        {input("email", "Email", { type: "email" })}
        {input("title", "Project name", {
          placeholder: "Website and admin portal",
        })}
        {input("quoteDate", "Quote date", { type: "date" })}
      </div>
    </section>
  );
}

// Rows -----------------------------------------------------------------------

type LineOps = {
  standard: (line: QuoteLine) => QuoteLine | undefined;
  update: (id: string, patch: Partial<QuoteLine>) => void;
  remove: (id: string) => void;
  move: (id: string, dir: 1 | -1) => void;
  add: (section: QuoteSection) => void;
  addGroup: (section: QuoteSection) => void;
  addToGroup: (groupId: string) => void;
  renameGroup: (groupId: string, name: string) => void;
};

function SectionBlock({
  section,
  lines,
  ops,
}: {
  section: (typeof QUOTE_SECTIONS)[number];
  lines: QuoteLine[];
  ops: LineOps;
}) {
  const ticked = lines.filter((l) => l.on);
  const once = ticked
    .filter((l) => l.billing === "once")
    .reduce((n, l) => n + lineTotal(l), 0);
  const recurring = BILLINGS.filter((b) => b.id !== "once").map((b) => ({
    ...b,
    total: ticked
      .filter((l) => l.billing === b.id)
      .reduce((n, l) => n + lineTotal(l), 0),
  }));

  const items: React.ReactNode[] = [];
  let group: string | null = null;
  lines.forEach((line, i) => {
    if (line.groupId && line.groupId !== group) {
      const members = lines.filter((l) => l.groupId === line.groupId);
      items.push(
        <GroupHeader
          key={`g-${line.groupId}`}
          groupId={line.groupId}
          name={line.groupName ?? ""}
          members={members}
          ops={ops}
        />,
      );
    }
    group = line.groupId;
    const sameBefore = lines
      .slice(0, i)
      .some((l) => l.groupId === line.groupId);
    const sameAfter = lines
      .slice(i + 1)
      .some((l) => l.groupId === line.groupId);
    items.push(
      <LineRow
        key={line.id}
        line={line}
        sub={Boolean(line.groupId)}
        canUp={sameBefore}
        canDown={sameAfter}
        ops={ops}
      />,
    );
  });

  return (
    <section className="card @container overflow-hidden p-0">
      <header className="border-line flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-ink text-[1.0625rem] font-semibold">
            {section.label}
          </h2>
          <p className="text-ink-faint text-[0.75rem]">{section.lede}</p>
        </div>
        <p className="text-ink-soft text-[0.8125rem] tabular-nums">
          {ticked.length} of {lines.length} ticked
          {once > 0 && (
            <>
              {" · "}
              <span className="text-ink font-semibold">
                {rupees.format(once)}
              </span>
            </>
          )}
          {recurring
            .filter((r) => r.total > 0)
            .map((r) => (
              <span key={r.id}>
                {" · "}
                <span className="text-ink font-semibold">
                  {rupees.format(r.total)}
                </span>
                {r.short}
              </span>
            ))}
        </p>
      </header>
      {items.length > 0 ? (
        <div className="divide-line divide-y">{items}</div>
      ) : (
        <p className="text-ink-faint px-5 py-6 text-center text-[0.8125rem]">
          No rows here yet.
        </p>
      )}
      <div className="border-line bg-mist/40 flex flex-wrap gap-2 border-t px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => ops.add(section.id)}
          className={cn(quietButton, "inline-flex items-center gap-1.5")}
        >
          <Plus className="size-3.5" aria-hidden />
          Add row
        </button>
        <button
          type="button"
          onClick={() => ops.addGroup(section.id)}
          className={cn(quietButton, "inline-flex items-center gap-1.5")}
        >
          <ListPlus className="size-3.5" aria-hidden />
          Add row with options
        </button>
      </div>
    </section>
  );
}

function GroupHeader({
  groupId,
  name,
  members,
  ops,
}: {
  groupId: string;
  name: string;
  members: QuoteLine[];
  ops: LineOps;
}) {
  const ticked = members.filter((l) => l.on);
  return (
    <div className="bg-mist/50 flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:px-5">
      <label className="min-w-0 flex-1 basis-48">
        <span className="sr-only">Group name</span>
        <input
          value={name}
          onChange={(e) => ops.renameGroup(groupId, e.target.value)}
          placeholder="Group name"
          className="text-ink placeholder:text-ink-faint hover:border-line focus:border-brand focus:bg-surface w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-[0.875rem] font-semibold focus:outline-none"
        />
      </label>
      <span className="text-ink-faint text-[0.75rem]">
        {ticked.length} of {members.length} options ticked
      </span>
      <button
        type="button"
        onClick={() => ops.addToGroup(groupId)}
        className="text-brand-deep hover:text-ink inline-flex items-center gap-1 text-[0.75rem] font-semibold"
      >
        <Plus className="size-3.5" aria-hidden />
        Add option
      </button>
    </div>
  );
}

function LineRow({
  line,
  sub,
  canUp,
  canDown,
  ops,
}: {
  line: QuoteLine;
  sub: boolean;
  canUp: boolean;
  canDown: boolean;
  ops: LineOps;
}) {
  // A new, empty row opens so its name can be typed straight away.
  const [open, setOpen] = useState(!line.name);
  const id = `line-${line.id}`;
  const set = (patch: Partial<QuoteLine>) => ops.update(line.id, patch);
  const item = catalogueFor(line);
  const std = ops.standard(line);
  const total = lineTotal(line);
  const off = discountOf(line.price, line.discount);
  const bill = billingOf(line.billing);
  const stdPrice = rateFor(std, line.billing);
  /** Switching billing brings in the standard price for it, if there is one. */
  const setBilling = (billing: Billing) =>
    set({ billing, price: rateFor(std, billing) ?? line.price });
  const discountText =
    line.discount.mode === "percent"
      ? `${line.discount.value}% off`
      : `${rupees.format(off)} off`;

  return (
    <div className={cn(sub && "pl-5 sm:pl-8")}>
      <div
        className={cn(
          "flex items-center gap-2.5 py-2.5 pr-3 pl-4 sm:gap-3 sm:pr-4 sm:pl-5",
          line.on && "bg-brand-wash/30",
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={line.on}
          onChange={(e) => {
            const on = e.target.checked;
            // Ticking an unpriced row brings in its standard price.
            if (on && line.price === 0 && stdPrice) {
              set({ on, price: stdPrice });
            } else set({ on });
          }}
          aria-label={`Include ${line.name || "this row"}`}
          className="accent-brand-solid size-[1.15rem] shrink-0 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
              line.on
                ? "bg-brand-solid text-cta-fg"
                : "bg-brand-wash text-brand-deep",
            )}
          >
            <QuoteIcon refId={item?.ref ?? line.ref} className="size-4" />
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate text-[0.9375rem] font-semibold",
                line.on ? "text-ink" : "text-ink-soft",
              )}
            >
              {line.name || "Untitled row"}
            </span>
            <span className="text-ink-faint block truncate text-[0.75rem]">
              {bill.label}
              {off > 0 && ` · ${discountText}`}
              {off > 0 && (
                <span className="sm:hidden">
                  {" · "}
                  {rupees.format(total)}
                </span>
              )}
            </span>
          </span>
        </button>
        <div className="w-[6.75rem] shrink-0 sm:w-32">
          {line.on ? (
            <MoneyInput
              value={line.price}
              onChange={(price) => set({ price })}
              ariaLabel={`Price of ${line.name || "this row"}`}
              suffix={bill.short || undefined}
            />
          ) : (
            <span className="text-ink-faint block px-2.5 text-right text-[0.8125rem] tabular-nums">
              {line.price || stdPrice
                ? `${rupees.format(line.price || stdPrice!)}${bill.short}`
                : ""}
            </span>
          )}
        </div>
        <div className="hidden w-28 shrink-0 text-right sm:block">
          {line.on ? (
            <span className="text-ink text-[0.9375rem] font-semibold tabular-nums">
              {rupees.format(total)}
            </span>
          ) : (
            <span className="text-ink-faint text-[0.75rem]">Not added</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Hide details" : "Show details"}
          className="text-ink-faint hover:text-ink hover:bg-mist grid size-8 shrink-0 place-items-center rounded-md transition-colors"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open && (
        <div
          className={cn(
            "border-line bg-mist/40 grid gap-4 border-t px-4 py-4 sm:px-5",
            item?.image && "lg:grid-cols-[17rem_minmax(0,1fr)]",
          )}
        >
          {item?.image && (
            <Image
              src={item.image}
              alt=""
              width={680}
              height={383}
              sizes="(min-width: 1024px) 17rem, 100vw"
              className="ring-line aspect-video w-full rounded-lg object-cover object-top ring-1"
            />
          )}
          <div className="grid min-w-0 gap-3">
            <label className="block">
              <span className={label}>Name</span>
              <input
                value={line.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="What it is, e.g. Basic website"
                className={cn(field, "py-2 font-semibold")}
              />
            </label>
            <label className="block">
              <span className={label}>Description (shown on the quote)</span>
              <textarea
                value={line.description}
                onChange={(e) => set({ description: e.target.value })}
                rows={2}
                placeholder="What the client gets"
                className={cn(field, "resize-y py-2 leading-snug")}
              />
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <label className="block min-w-0">
                <span className={label}>Service</span>
                <select
                  value={line.service}
                  onChange={(e) =>
                    set({ service: e.target.value as QuoteService })
                  }
                  className={cn(field, "py-2")}
                >
                  {PROJECT_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block min-w-0">
                <span className={label}>Billed</span>
                <select
                  value={line.billing}
                  onChange={(e) => setBilling(e.target.value as Billing)}
                  className={cn(field, "py-2")}
                >
                  {BILLINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                      {rateFor(std, b.id)
                        ? ` (${rupees.format(rateFor(std, b.id)!)})`
                        : ""}
                    </option>
                  ))}
                </select>
              </label>
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <span className={label}>Discount</span>
                <DiscountControl
                  value={line.discount}
                  onChange={(discount) => set({ discount })}
                  name={line.name || "this row"}
                />
              </div>
            </div>
            {item && item.includes.length > 0 && (
              <div>
                <span className={label}>What&apos;s included</span>
                <ul className="grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
                  {item.includes.map((point) => (
                    <li
                      key={point}
                      className="text-ink-soft flex gap-2 text-[0.8125rem] leading-snug"
                    >
                      <Check
                        className="text-leaf-deep mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <p className="text-ink-faint text-[0.75rem]">
                {stdPrice ? (
                  <>
                    Standard price {rupees.format(stdPrice)}
                    {bill.per && ` ${bill.per}`}
                    {stdPrice !== line.price && (
                      <button
                        type="button"
                        onClick={() => set({ price: stdPrice })}
                        className="text-brand-deep hover:text-ink ml-2 font-semibold"
                      >
                        Use it
                      </button>
                    )}
                  </>
                ) : std ? (
                  `No standard ${bill.label.toLowerCase()} price`
                ) : (
                  "Not on the standard price list"
                )}
              </p>
              <div className="flex items-center">
                <IconButton
                  label="Move up"
                  onClick={() => ops.move(line.id, -1)}
                  disabled={!canUp}
                >
                  <ArrowUp className="size-3.5" />
                </IconButton>
                <IconButton
                  label="Move down"
                  onClick={() => ops.move(line.id, 1)}
                  disabled={!canDown}
                >
                  <ArrowDown className="size-3.5" />
                </IconButton>
                <IconButton
                  label={`Delete ${line.name || "row"}`}
                  onClick={() => ops.remove(line.id)}
                  danger
                >
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
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
      aria-label={label}
      title={label}
      className={cn(
        "text-ink-faint grid size-8 place-items-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
        danger
          ? "hover:text-danger hover:bg-mist"
          : "hover:text-ink hover:bg-mist",
      )}
    >
      {children}
    </button>
  );
}

/** Rupees, typed as plain digits, shown with commas once you leave it. */
export function MoneyInput({
  value,
  onChange,
  ariaLabel,
  suffix,
}: {
  value: number;
  onChange: (n: number) => void;
  ariaLabel?: string;
  suffix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const shown = value
    ? focused
      ? String(value)
      : value.toLocaleString("en-IN")
    : "";
  return (
    <span className="relative block">
      <span className="text-ink-faint pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[0.8125rem]">
        ₹
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={shown}
        placeholder="0"
        aria-label={ariaLabel}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
          onChange(digits ? Number(digits) : 0);
        }}
        className={cn(field, "py-2 pl-6 tabular-nums", suffix && "pr-9")}
      />
      {suffix && (
        <span className="text-ink-faint pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[0.6875rem]">
          {suffix}
        </span>
      )}
    </span>
  );
}

/** A dropdown of percentages, or an exact amount typed in. */
function DiscountControl({
  value,
  onChange,
  name,
  inline = false,
}: {
  value: Discount;
  onChange: (d: Discount) => void;
  name: string;
  inline?: boolean;
}) {
  const selected =
    value.mode === "percent"
      ? `p${value.value}`
      : value.mode === "amount"
        ? "amount"
        : "none";
  const percents =
    DISCOUNT_PERCENTS.includes(value.value) || value.mode !== "percent"
      ? DISCOUNT_PERCENTS
      : [...DISCOUNT_PERCENTS, value.value].sort((a, b) => a - b);
  return (
    <div className={inline ? "flex gap-1.5" : "space-y-1.5"}>
      <select
        value={selected}
        aria-label={`Discount on ${name}`}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "none") onChange({ mode: "none", value: 0 });
          else if (v === "amount")
            onChange({
              mode: "amount",
              value: value.mode === "amount" ? value.value : 0,
            });
          else onChange({ mode: "percent", value: Number(v.slice(1)) });
        }}
        className={cn(field, "py-2")}
      >
        <option value="none">No discount</option>
        {percents.map((p) => (
          <option key={p} value={`p${p}`}>
            {p}% off
          </option>
        ))}
        <option value="amount">Exact amount</option>
      </select>
      {value.mode === "amount" && (
        <MoneyInput
          value={value.value}
          onChange={(n) => onChange({ mode: "amount", value: n })}
          ariaLabel={`Discount amount on ${name}`}
        />
      )}
    </div>
  );
}

// Side cards -----------------------------------------------------------------

/**
 * The totals, pinned to the bottom of the screen while the rows scroll:
 * how many rows are in, the overall discount, and the two totals.
 */
function TotalsBar({
  body,
  setDiscount,
}: {
  body: QuoteBody;
  setDiscount: (d: Discount) => void;
}) {
  const t = quoteTotals(body);
  return (
    <div className="border-line bg-surface/95 sticky bottom-3 z-20 rounded-xl border px-4 py-3 shadow-[0_10px_30px_-12px_rgba(16,40,60,0.35)] backdrop-blur sm:px-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-ink-soft text-[0.8125rem]">
            <span className="text-ink font-semibold">{t.count}</span>{" "}
            {t.count === 1 ? "row" : "rows"} added
          </p>
          <div className="flex items-center gap-2">
            <span className="text-ink-faint text-[0.75rem] font-semibold whitespace-nowrap">
              Overall discount
            </span>
            <div className="w-36 sm:w-44">
              <DiscountControl
                value={body.discount}
                onChange={setDiscount}
                name="the whole quote"
                inline
              />
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-end gap-5 sm:gap-8">
          <div className="text-right">
            <p className="text-ink-faint text-[0.6875rem] font-semibold">
              One-time
              {t.onceSaved > 0 && (
                <span className="ml-1.5 font-normal line-through">
                  {rupees.format(t.onceList)}
                </span>
              )}
            </p>
            <p className="display text-ink text-[1.25rem] leading-tight tabular-nums sm:text-[1.5rem]">
              {rupees.format(t.onceTotal)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-ink-faint text-[0.6875rem] font-semibold">
              Monthly
            </p>
            <p className="display text-ink text-[1.25rem] leading-tight tabular-nums sm:text-[1.5rem]">
              {rupees.format(t.monthlyTotal)}
              <span className="text-ink-faint text-[0.75rem] font-normal">
                /mo
              </span>
            </p>
          </div>
          {t.yearlyTotal > 0 && (
            <div className="text-right">
              <p className="text-ink-faint text-[0.6875rem] font-semibold">
                Yearly
              </p>
              <p className="display text-ink text-[1.25rem] leading-tight tabular-nums sm:text-[1.5rem]">
                {rupees.format(t.yearlyTotal)}
                <span className="text-ink-faint text-[0.75rem] font-normal">
                  /yr
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsCard({
  quoteId,
  body,
  meta,
  dirty,
  projects,
}: {
  quoteId: string;
  body: QuoteBody;
  meta: Meta;
  dirty: boolean;
  projects: LinkedProject[];
}) {
  const rows = totalsByService(body);
  const [skip, setSkip] = useState<Record<string, boolean>>({});
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>("proposal");
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const picked = rows.filter((r) => !skip[r.service]);
  const fallback = meta.title || meta.company;

  function add() {
    setMessage(null);
    start(async () => {
      try {
        await addQuoteProjects(
          quoteId,
          status,
          picked.map((r) => ({
            service: r.service,
            title: titles[r.service] ?? fallback,
            once: r.once,
            monthly: r.monthly,
            yearly: r.yearly,
          })),
        );
        setMessage(
          `Added ${picked.length} ${picked.length === 1 ? "project" : "projects"}.`,
        );
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Could not add them.");
      }
    });
  }

  return (
    <section className="card p-4 sm:p-5">
      <h2 className="text-ink text-[1.0625rem] font-semibold">
        Add to the service tabs
      </h2>
      <p className="text-ink-faint mt-0.5 text-[0.75rem]">
        One project per service on its tab: Marketing, Software or Agentic AI.
      </p>

      {rows.length === 0 ? (
        <p className="text-ink-soft mt-3 text-[0.8125rem]">
          Tick some rows first.
        </p>
      ) : (
        <>
          <ul className="mt-3 space-y-3">
            {rows.map((r) => (
              <li
                key={r.service}
                className="border-line rounded-lg border p-2.5"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!skip[r.service]}
                    onChange={(e) =>
                      setSkip((s) => ({ ...s, [r.service]: !e.target.checked }))
                    }
                    className="accent-brand-solid size-4"
                  />
                  <span className="text-ink text-[0.8125rem] font-semibold">
                    {serviceLabel(r.service)}
                  </span>
                  <span className="text-ink-soft ml-auto text-right text-[0.75rem] tabular-nums">
                    {rupees.format(r.once)}
                    {r.monthly > 0 && ` + ${rupees.format(r.monthly)}/mo`}
                    {r.yearly > 0 && ` + ${rupees.format(r.yearly)}/yr`}
                  </span>
                </label>
                <input
                  value={titles[r.service] ?? fallback}
                  onChange={(e) =>
                    setTitles((t) => ({ ...t, [r.service]: e.target.value }))
                  }
                  aria-label={`Project name on the ${serviceLabel(r.service)} tab`}
                  className={cn(field, "mt-2")}
                />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Project status"
              className={cn(field, "w-auto py-2")}
            >
              {PROJECT_STATUSES.filter((s) =>
                ["lead", "proposal", "active"].includes(s.id),
              ).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={add}
              disabled={dirty || pending || picked.length === 0}
              className={cn(primaryButton, "flex-1 py-2 disabled:opacity-50")}
            >
              {pending ? "Adding" : "Add as projects"}
            </button>
          </div>
          {dirty && (
            <p className="text-amber-deep mt-2 text-[0.75rem]">
              Save the quote first.
            </p>
          )}
          {projects.length > 0 && !message && (
            <p className="text-ink-faint mt-2 text-[0.75rem]">
              Adding again makes new projects next to the ones below.
            </p>
          )}
        </>
      )}
      {message && (
        <p className="text-ink-soft mt-2 text-[0.75rem]" role="status">
          {message}
        </p>
      )}

      {projects.length > 0 && (
        <ul className="border-line mt-4 space-y-2 border-t pt-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/services/${serviceTab(p.service)}`}
                className="hover:bg-mist -mx-1.5 flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-ink block truncate text-[0.8125rem] font-semibold">
                    {p.title}
                  </span>
                  <span className="text-ink-faint block text-[0.6875rem]">
                    {serviceLabel(p.service)} tab
                    {p.value ? ` · ${rupees.format(num(p.value))}` : ""}
                  </span>
                </span>
                <StatusPill status={p.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Document -------------------------------------------------------------------

function DocumentPane({
  data,
  setDoc,
  setValidDays,
}: {
  data: QuoteDocData;
  setDoc: (patch: Partial<QuoteDoc>) => void;
  setValidDays: (n: number) => void;
}) {
  const { doc, validDays, lines } = data.body;
  const frame = useRef<HTMLIFrameElement>(null);
  const html = useMemo(
    () => quoteHtml(data, { logo: "/logo-mark.png" }),
    [data],
  );

  function print() {
    const win = frame.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  }

  function download() {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    const copy = doc.documentElement.cloneNode(true) as HTMLElement;
    // Word cannot fetch the logo from this site, so the name stands alone.
    copy.querySelectorAll("img").forEach((img) => img.closest("td")?.remove());
    const file = new Blob(["﻿<!doctype html>\n", copy.outerHTML], {
      type: "application/msword",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = `${data.number} ${data.company}`
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .concat(".doc");
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function fill() {
    if (
      doc.understanding.trim() &&
      !window.confirm("Replace what is written under Our understanding?")
    )
      return;
    setDoc({ understanding: understandingFromLines(lines) });
  }

  const area = (
    key: keyof QuoteDoc,
    text: string,
    hint: string,
    rows: number,
  ) => (
    <label className="block">
      <span className={label}>{text}</span>
      <textarea
        value={doc[key]}
        onChange={(e) => setDoc({ [key]: e.target.value })}
        rows={rows}
        className={cn(field, "resize-y py-2 leading-relaxed")}
      />
      <span className="text-ink-faint mt-1 block text-[0.6875rem]">{hint}</span>
    </label>
  );

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)] xl:items-start">
      <aside className="min-w-0 space-y-4 xl:sticky xl:top-[148px] xl:max-h-[calc(100vh-164px)] xl:overflow-y-auto">
        <div className="card grid grid-cols-2 gap-2 p-3">
          <button
            type="button"
            onClick={print}
            className={cn(
              primaryButton,
              "inline-flex items-center justify-center gap-1.5 py-2.5",
            )}
          >
            <Printer className="size-4" aria-hidden />
            Print or PDF
          </button>
          <button
            type="button"
            onClick={download}
            className={cn(
              quietButton,
              "inline-flex items-center justify-center gap-1.5 py-2.5",
            )}
          >
            <FileDown className="size-4" aria-hidden />
            Word file
          </button>
          <p className="text-ink-faint col-span-2 text-[0.6875rem]">
            For a PDF, pick Save as PDF in the print window.
          </p>
        </div>

        <div className="card space-y-4 p-4 sm:p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">Wording</h2>
          {area(
            "intro",
            "Opening paragraph",
            "Shown under the client's name.",
            4,
          )}
          <div>
            {area(
              "understanding",
              "Our understanding so far",
              "Notes from the first meeting, one point a line.",
              7,
            )}
            <button
              type="button"
              onClick={fill}
              className="text-brand-deep hover:text-ink mt-1.5 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold"
            >
              <Sparkles className="size-3.5" aria-hidden />
              Fill from the ticked rows
            </button>
          </div>
          <div>
            {area(
              "terms",
              "Notes",
              "Price changes, payment, third-party costs. One a line.",
              6,
            )}
            <button
              type="button"
              onClick={() => setDoc({ terms: STANDARD_TERMS })}
              className="text-brand-deep hover:text-ink mt-1.5 text-[0.75rem] font-semibold"
            >
              Use our standard notes
            </button>
          </div>
          <label className="block">
            <span className={label}>Valid for (days)</span>
            <input
              type="number"
              min={1}
              max={365}
              value={validDays}
              onChange={(e) =>
                setValidDays(
                  Math.min(365, Math.max(1, Number(e.target.value) || 1)),
                )
              }
              className={cn(field, "w-28 py-2")}
            />
          </label>
        </div>
      </aside>

      <div className="min-w-0">
        <p className="text-ink-faint mb-2 text-[0.75rem]">
          This is the page as it prints. You can also click on it and type a
          last change before printing; that change is not saved, and is lost
          when the wording or prices change.
        </p>
        <DocPreview html={html} frame={frame} />
      </div>
    </div>
  );
}

const A4_WIDTH = 794;

/**
 * The quote in a frame at A4 width, scaled down to fit, as tall as the
 * page so it scrolls with the panel. Rewritten a moment after typing stops.
 */
function DocPreview({
  html,
  frame,
}: {
  html: string;
  frame: React.RefObject<HTMLIFrameElement | null>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(1123);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setScale(Math.min(1, el.clientWidth / A4_WIDTH)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const f = frame.current;
      const doc = f?.contentDocument;
      const win = f?.contentWindow;
      if (!doc || !win) return;
      doc.open();
      doc.write(html);
      doc.close();
      doc.designMode = "on";
      const measure = () =>
        setHeight(Math.max(1123, doc.documentElement.scrollHeight));
      measure();
      doc.addEventListener("input", measure);
      win.addEventListener("load", measure);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [html, frame]);

  return (
    <div
      ref={box}
      className="ring-line overflow-hidden rounded-lg bg-white shadow-sm ring-1"
    >
      <div style={{ height: height * scale }}>
        <iframe
          ref={frame}
          title="Quotation as it prints"
          style={{
            width: A4_WIDTH,
            height,
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: "#fff",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
