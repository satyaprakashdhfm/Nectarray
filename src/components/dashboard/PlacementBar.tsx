import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SAVE_LABEL, type SaveStatus } from "./use-autosave";

/** The strip under the dashboard nav: tool tabs left, that tool's actions right. */
export function PlacementBar({
  tabs,
  children,
}: {
  tabs: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-line bg-canvas flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5">
      {tabs}
      <div className="flex flex-wrap items-center gap-2.5">{children}</div>
    </div>
  );
}

export function SaveIndicator({ status }: { status: SaveStatus }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.8125rem]",
        status === "error" ? "text-amber-deep" : "text-ink-faint",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "saved"
            ? "bg-leaf"
            : status === "error"
              ? "bg-amber"
              : "bg-ink-faint",
        )}
      />
      {SAVE_LABEL[status]}
    </span>
  );
}
