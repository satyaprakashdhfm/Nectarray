"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Copies a block of text, and says so for a moment.
 *
 * Students read these panels with the editor beside them, and the thing they
 * do most often with a block of code is take it. Selecting fifteen lines of
 * indented Python out of a scrolling box with a trackpad is a small misery,
 * and it picks up the wrong leading whitespace about half the time.
 *
 * Same behaviour as the copy button on a fenced block in the notes; this one
 * is the standalone version, for the places that are not markdown.
 */
export function CopyButton({
  text,
  label = "Copy",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be refused. The text is still selectable.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.6875rem] font-semibold transition-colors",
        copied
          ? "text-leaf-deep"
          : "text-ink-faint hover:bg-mist hover:text-ink",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3" strokeWidth={3} aria-hidden />
      ) : (
        <Copy className="size-3" strokeWidth={2} aria-hidden />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}
