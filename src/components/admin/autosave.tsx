"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { Check, CloudUpload, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type AutoSaveStatus = "saved" | "pending" | "saving" | "error";

/** After typing stops, this long before the change is saved. */
const DELAY_MS = 900;
/** After a failed save, this long before it is tried again by itself. */
const RETRY_MS = 8000;

/**
 * Saves `value` by itself a moment after it stops changing, so nothing in
 * the admin needs a Save button. One save runs at a time; whatever changed
 * while it ran is saved straight after. Leaving the page with a change not
 * yet saved asks first.
 */
export function useAutoSave<T>(value: T, save: (value: T) => Promise<unknown>) {
  const json = JSON.stringify(value);
  const [saved, setSaved] = useState(json);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latest = useRef({ value, json, save });
  useEffect(() => {
    latest.current = { value, json, save };
  });

  const run = useCallback(async () => {
    const { value: next, json: snapshot, save: send } = latest.current;
    setSaving(true);
    try {
      await send(next);
      setSaved(snapshot);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }, []);

  const dirty = json !== saved;
  useEffect(() => {
    if (!dirty || saving) return;
    const timer = setTimeout(() => void run(), error ? RETRY_MS : DELAY_MS);
    return () => clearTimeout(timer);
  }, [json, dirty, saving, error, run]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const status: AutoSaveStatus = saving
    ? "saving"
    : !dirty
      ? "saved"
      : error
        ? "error"
        : "pending";

  return {
    status,
    dirty,
    error,
    /** Saves now instead of waiting. */
    saveNow: () => void run(),
    /** Takes a value as saved without sending it, e.g. after a reload. */
    markSaved: (v: T) => setSaved(JSON.stringify(v)),
  };
}

/** "Saving…", "Saved", or what went wrong with a retry. */
export function SaveState({
  status,
  error,
  onRetry,
  className,
}: {
  status: AutoSaveStatus;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold whitespace-nowrap",
        status === "error"
          ? "text-danger"
          : status === "saved"
            ? "text-leaf-deep"
            : "text-ink-faint",
        className,
      )}
    >
      {status === "saved" && <Check className="size-3.5" aria-hidden />}
      {(status === "saving" || status === "pending") && (
        <CloudUpload className="size-3.5 animate-pulse" aria-hidden />
      )}
      {status === "saved"
        ? "Saved"
        : status === "error"
          ? (error ?? "Could not save")
          : "Saving…"}
      {status === "error" && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-ink hover:text-brand-deep inline-flex items-center gap-1 underline underline-offset-2"
        >
          <RotateCcw className="size-3" aria-hidden />
          Retry
        </button>
      )}
    </span>
  );
}

/**
 * A form that sends itself: a pick from a list or a tick at once, typing a
 * moment after it stops. For editing something that already exists; a form
 * that adds something new keeps its button. A small "Saved" shows by the
 * fields after each save.
 */
export function AutoSaveForm({
  children,
  className,
  ...props
}: ComponentProps<"form">) {
  const form = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<"idle" | "pending" | "saved">("idle");

  const send = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const el = form.current;
    if (!el || !el.checkValidity()) return;
    el.requestSubmit();
    setState("saved");
    setTimeout(() => setState("idle"), 1600);
  };

  // Leaving with typing not yet sent: send it. The form is gone from the
  // page by then and cannot submit itself, so its action is called with
  // what was last typed.
  const last = useRef<{ data: FormData | null; action: unknown }>({
    data: null,
    action: props.action,
  });
  useEffect(() => {
    last.current.action = props.action;
  });
  useEffect(
    () => () => {
      const { data, action } = last.current;
      if (timer.current && data && typeof action === "function")
        void (action as (d: FormData) => unknown)(data);
    },
    [],
  );

  return (
    <form
      ref={form}
      {...props}
      className={cn("relative", className)}
      onChange={(e) => {
        const target = e.target as unknown as HTMLInputElement;
        const typed =
          target.tagName === "TEXTAREA" ||
          (target.tagName === "INPUT" &&
            !["checkbox", "radio", "date", "month", "file", "color"].includes(
              target.type,
            ));
        if (timer.current) clearTimeout(timer.current);
        last.current.data = new FormData(e.currentTarget);
        setState("pending");
        if (typed) timer.current = setTimeout(send, DELAY_MS + 300);
        else send();
      }}
      onBlur={() => {
        if (timer.current) send();
      }}
    >
      {children}
      {state !== "idle" && (
        <span
          role="status"
          className={cn(
            "pointer-events-none absolute -top-2 right-0 rounded-full px-1.5 text-[0.625rem] font-semibold",
            state === "saved"
              ? "bg-leaf-wash text-leaf-deep"
              : "bg-mist text-ink-faint",
          )}
        >
          {state === "saved" ? "Saved" : "Saving…"}
        </span>
      )}
    </form>
  );
}
