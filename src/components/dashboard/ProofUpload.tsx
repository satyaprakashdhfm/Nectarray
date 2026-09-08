"use client";

import { useRef, useState } from "react";
import { Check, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage =
  | { at: "idle" }
  | { at: "working"; note: string }
  | { at: "passed"; note: string }
  | { at: "failed"; note: string };

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Proof that a Python problem was solved: a screenshot of the accepted
 * submission, read by the grader.
 *
 * There is no checkbox here on purpose. A tick used to be something a student
 * could give themselves, which made the sheet a to-do list rather than a
 * record — and the whole point of the sheet is that it is a record. The
 * upload goes to a private bucket the student can write into but only they
 * and the admin can read, and the verdict is written server-side.
 */
export function ProofUpload({
  questionId,
  solved,
  onSolved,
}: {
  questionId: string;
  solved: boolean;
  onSolved: () => void;
}) {
  const [stage, setStage] = useState<Stage>({ at: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(file: File) {
    if (file.size > MAX_BYTES) {
      setStage({ at: "failed", note: "That image is over 5 MB." });
      return;
    }

    setStage({ at: "working", note: "Checking your submission…" });
    try {
      /*
       * Straight to the grader. This used to be three round trips — upload to
       * a bucket, insert a row pointing at it, then ask for it to be read —
       * and the file was read once, seconds later, and never again. One
       * request now, and nothing is kept but the verdict.
       */
      const body = new FormData();
      body.append("questionId", questionId);
      body.append("image", file);

      const response = await fetch("/api/verify-submission", {
        method: "POST",
        body,
      });
      const result = (await response.json()) as {
        accepted?: boolean;
        reason?: string;
        error?: string;
      };

      if (!response.ok) throw new Error(result.error ?? "Checking failed.");

      if (result.accepted) {
        setStage({ at: "passed", note: result.reason ?? "Accepted." });
        onSolved();
      } else {
        setStage({
          at: "failed",
          note: result.reason ?? "That did not look accepted.",
        });
      }
    } catch (error) {
      setStage({
        at: "failed",
        note: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }

  if (solved && stage.at === "idle") {
    return (
      <span className="text-leaf-deep inline-flex items-center gap-1.5 text-[0.875rem] font-semibold">
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-start gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void submit(file);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={stage.at === "working"}
        className={cn(
          "inline-flex items-center gap-1.5 text-[0.875rem] font-semibold transition-colors disabled:opacity-60",
          stage.at === "passed"
            ? "text-leaf-deep"
            : "text-brand-deep hover:underline",
        )}
      >
        {stage.at === "working" ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : stage.at === "passed" ? (
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
        ) : (
          <Upload className="size-3.5" strokeWidth={2} aria-hidden />
        )}
        {stage.at === "working"
          ? stage.note
          : stage.at === "passed"
            ? "Verified"
            : solved
              ? "Replace proof"
              : "Upload proof"}
      </button>

      {(stage.at === "passed" || stage.at === "failed") && (
        <span
          className={cn(
            "flex max-w-[22rem] items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.8125rem] leading-snug",
            stage.at === "passed"
              ? "bg-leaf-wash text-leaf-deep"
              : "bg-amber-wash text-amber-deep",
          )}
        >
          {stage.at === "failed" && (
            <X className="mt-0.5 size-3 shrink-0" strokeWidth={3} aria-hidden />
          )}
          {stage.note}
        </span>
      )}
    </span>
  );
}
