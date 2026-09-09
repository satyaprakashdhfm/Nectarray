"use client";

import { useCallback, useEffect, useRef } from "react";

const DEBOUNCE_MS = 900;

/**
 * Autosaves a student's in-progress SQL or Python, per question.
 *
 * The editor used to hold one piece of state with no question attached, so
 * switching problems — or just closing the tab — reset it to the starter
 * code and an afternoon's work on a hard one was gone. This keeps a small
 * map of "what was last written to the server for this question" and sends
 * an update whenever the live value drifts from it, on a debounce so typing
 * does not fire a request per keystroke.
 *
 * Returns `flush`, which sends immediately rather than waiting out the
 * debounce. Call it right before navigating to another question — otherwise
 * a switch inside the debounce window would cancel the pending save along
 * with the timer that was going to send it.
 */
export function useDraftSave(questionId: string | null, code: string) {
  const saved = useRef<Record<string, string>>({});
  const pending = useRef<{
    id: string;
    code: string;
    timer: ReturnType<typeof setTimeout> | null;
  }>({ id: "", code: "", timer: null });

  const send = useCallback((id: string, value: string) => {
    saved.current[id] = value;
    void fetch("/api/practice/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: id, code: value }),
      keepalive: true,
    }).catch(() => {
      // Offline, or the tab is closing. Nothing to recover here — the next
      // edit reschedules a save the normal way.
    });
  }, []);

  const flush = useCallback(() => {
    const p = pending.current;
    if (!p.timer) return;
    clearTimeout(p.timer);
    p.timer = null;
    if (p.id && saved.current[p.id] !== p.code) send(p.id, p.code);
  }, [send]);

  useEffect(() => {
    if (!questionId) return;

    /*
     * The first time a question is seen this session, `code` is whatever was
     * restored from the server (or the starter code, for one never opened).
     * That is already saved by definition — writing it straight back would
     * be a request that changes nothing, on every single question a student
     * opens.
     */
    if (!(questionId in saved.current)) {
      saved.current[questionId] = code;
      return;
    }
    if (saved.current[questionId] === code) return;

    if (pending.current.timer) clearTimeout(pending.current.timer);
    pending.current = {
      id: questionId,
      code,
      timer: setTimeout(() => {
        pending.current.timer = null;
        send(questionId, code);
      }, DEBOUNCE_MS),
    };
  }, [questionId, code, send]);

  // A closed tab does not wait for a debounce. `pagehide` fires reliably on
  // navigation and on close; `visibilitychange` catches a phone's tab-switch
  // and app-switch, which do not always raise `pagehide` in time.
  useEffect(() => {
    const onHide = () => flush();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      flush();
    };
  }, [flush]);

  return flush;
}
