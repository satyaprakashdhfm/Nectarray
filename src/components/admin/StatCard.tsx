"use client";

import { useRef, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** A change against the period before: +12%, or new when there was none. */
export type Change = { now: number; before: number; against: string };

/** "↑ 12% vs September", green up, red down. */
export function ChangeBadge({ change }: { change: Change }) {
  const { now, before, against } = change;
  if (now === before)
    return (
      <span className="text-ink-faint text-[0.75rem]">Same as {against}</span>
    );
  const up = now > before;
  const pct =
    before === 0
      ? null
      : Math.round((Math.abs(now - before) / Math.abs(before)) * 100);
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[0.75rem] font-semibold",
        up ? "text-leaf-deep" : "text-danger",
      )}
    >
      <Arrow className="size-3.5" aria-hidden />
      {pct == null ? "New" : `${pct}%`}
      <span className="text-ink-faint font-normal">vs {against}</span>
    </span>
  );
}

/** What a card shows: its name, its figure, and a line under it. */
export function StatFace({
  label,
  value,
  hint,
  change,
  tone,
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  change?: Change;
  tone?: "good" | "warn" | "bad";
}) {
  return (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className="eyebrow">{label}</span>
        <Maximize2
          className="text-ink-faint group-hover:text-brand-deep size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden
        />
      </span>
      <span
        className={cn(
          "display mt-1.5 block text-[1.25rem] break-words sm:text-[1.5rem]",
          tone === "good"
            ? "text-leaf-deep"
            : tone === "warn"
              ? "text-amber-deep"
              : tone === "bad"
                ? "text-danger"
                : "text-ink",
        )}
      >
        {value}
      </span>
      <span className="mt-1 flex min-h-[1.125rem] flex-wrap items-center gap-x-2 text-[0.75rem]">
        {change && <ChangeBadge change={change} />}
        {hint && <span className="text-ink-faint">{hint}</span>}
      </span>
    </>
  );
}

/** The look every clickable card shares. */
export const cardButton =
  "card group min-w-0 p-4 text-left transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_14px_30px_-18px_rgba(16,40,60,0.45)] focus-visible:border-brand focus-visible:outline-none sm:p-5";

/** The pop-up shell: a header with the figure, and a scrolling body. */
export function Pop({
  dialog,
  label,
  value,
  lede,
  children,
}: {
  dialog: React.RefObject<HTMLDialogElement | null>;
  label: string;
  value: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <dialog
      ref={dialog}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current.close();
      }}
      className="pop bg-surface text-ink m-auto max-h-[92vh] w-[min(96vw,60rem)] max-w-none overflow-hidden rounded-2xl p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex max-h-[92vh] flex-col">
        <header className="border-line flex items-start gap-4 border-b px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{label}</p>
            <p className="display mt-1 text-[1.75rem] leading-none sm:text-[2.25rem]">
              {value}
            </p>
            {lede && (
              <div className="text-ink-faint mt-1.5 text-[0.75rem]">{lede}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="text-ink-faint hover:text-ink hover:bg-mist grid size-9 shrink-0 place-items-center rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}

/**
 * A dashboard card that opens what makes up its figure. The body is drawn
 * on the server and handed in as children.
 */
export function StatCard({
  label,
  value,
  hint,
  change,
  tone,
  lede,
  children,
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  change?: Change;
  tone?: "good" | "warn" | "bad";
  lede?: ReactNode;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={cardButton}
        aria-haspopup="dialog"
      >
        <StatFace
          label={label}
          value={value}
          hint={hint}
          change={change}
          tone={tone}
        />
      </button>
      <Pop dialog={dialog} label={label} value={value} lede={lede}>
        {children}
      </Pop>
    </>
  );
}
