"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The solution button's whole life: the clock, the lock and the fetch.
 *
 * Both workspaces use it, and neither holds the answer. Opening a question
 * starts a fifteen-minute clock on the server; the button stays shut until it
 * runs out, and only then is there anything to ask for. A student who has
 * already solved the problem skips the wait — the point of the delay is the
 * time spent stuck, and they have done that.
 *
 * The countdown here is a courtesy so the button can say how long is left. It
 * is not the lock. The lock is the endpoint, which checks the same clock
 * against a row and hands back a 403 and no solution when it has not run out
 * — so winding the browser's clock forward achieves nothing.
 */

export const WAIT_MS = 15 * 60 * 1000;

export type SolutionState = {
  /** Milliseconds left before the answer can be read; 0 once it can. */
  remaining: number;
  unlocked: boolean;
  showing: boolean;
  busy: boolean;
  text: string | null;
  note: string | null;
  error: string;
  toggle: () => void;
};

export function useSolution(
  questionId: string | null,
  solved: boolean,
  /** Clocks already running when the page was rendered, keyed by question. */
  openedAt: Record<string, number>,
): SolutionState {
  const [opens, setOpens] = useState<Record<string, number>>(openedAt);
  /*
   * Everything about the answer is keyed by question rather than reset when
   * the question changes. Same effect, no effect: switching problems shows
   * nothing because nothing is stored under the new id, and coming back to
   * one you already opened does not fetch it again.
   */
  const [fetched, setFetched] = useState<
    Record<string, { text: string; note: string | null }>
  >({});
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [busyFor, setBusyFor] = useState<string | null>(null);
  const [failure, setFailure] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const [now, setNow] = useState(() => Date.now());

  /*
   * Tell the server the problem has been opened. It records the moment once
   * and ignores every later call, so this is safe to fire on each visit — and
   * it has to be fired here rather than on the first press of the button,
   * because a clock that starts when you reach for the answer never runs out.
   */
  useEffect(() => {
    if (!questionId) return;
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/practice/open", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId }),
        });
        if (!response.ok) return;
        const clock = (await response.json()) as { openedAt: number };
        if (cancelled) return;
        setOpens((current) => ({ ...current, [questionId]: clock.openedAt }));
      } catch {
        // Offline, or the request was abandoned by a navigation. The button
        // stays locked, which is the safe way round.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [questionId]);

  const started = questionId ? opens[questionId] : undefined;
  const unlocksAt = started === undefined ? Infinity : started + WAIT_MS;
  const remaining = solved ? 0 : Math.max(0, unlocksAt - now);
  const unlocked = solved || remaining === 0;

  // Tick only while something is counting down. An unlocked button has
  // nothing to re-render for.
  useEffect(() => {
    if (unlocked || !questionId) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [unlocked, questionId]);

  const showing = openFor !== null && openFor === questionId;
  const busy = busyFor !== null && busyFor === questionId;
  const held = questionId ? fetched[questionId] : undefined;

  const toggle = useCallback(() => {
    if (!questionId || !unlocked) return;

    if (openFor === questionId) {
      setOpenFor(null);
      return;
    }

    setOpenFor(questionId);
    setFailure(null);
    if (fetched[questionId] || busyFor === questionId) return;

    setBusyFor(questionId);
    void (async () => {
      try {
        const response = await fetch(
          `/api/practice/solution?questionId=${encodeURIComponent(questionId)}`,
        );
        const result = (await response.json()) as {
          solution?: string;
          note?: string | null;
          error?: string;
        };
        if (!response.ok) throw new Error(result.error ?? "Not available.");
        setFetched((current) => ({
          ...current,
          [questionId]: {
            text: result.solution ?? "",
            note: result.note ?? null,
          },
        }));
      } catch (err) {
        setFailure({
          id: questionId,
          message: err instanceof Error ? err.message : "Not available.",
        });
        setOpenFor((current) => (current === questionId ? null : current));
      } finally {
        setBusyFor((current) => (current === questionId ? null : current));
      }
    })();
  }, [questionId, unlocked, openFor, fetched, busyFor]);

  return {
    remaining,
    unlocked,
    showing,
    busy,
    text: held?.text ?? null,
    note: held?.note ?? null,
    error: failure && failure.id === questionId ? failure.message : "",
    toggle,
  };
}

/** "12:43" — what the button says while it is still counting down. */
export function countdown(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
