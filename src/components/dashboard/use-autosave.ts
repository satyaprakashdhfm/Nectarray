"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "saved" | "pending" | "saving" | "error";

/** Sends one value to the server. `keepalive` for a page that is going away. */
export type Saver = (value: string, keepalive: boolean) => Promise<boolean>;

const DEBOUNCE_MS = 1200;

/**
 * What this browser tab last saved, per key.
 *
 * The router keeps a rendered page for half a minute (staleTimes in
 * next.config), so leaving for Notes and coming straight back can hand the
 * editor the text as it was when the page was first loaded — and a student
 * who then typed would save that stale copy over their newer one. Editors
 * start from here when it holds something, and from the server otherwise.
 */
const savedThisSession = new Map<string, string>();

export function recallSaved(key: string, fallback: string): string {
  return savedThisSession.get(key) ?? fallback;
}

/**
 * Saves a value a moment after the student stops typing.
 *
 * Also saves straight away when the page is hidden or the editor unmounts —
 * a client-side move to another tab fires neither a debounce nor `pagehide`,
 * so without the unmount case the last second of typing would be lost.
 */
export function useAutosave(key: string, value: string, save: Saver) {
  const [saved, setSaved] = useState(value);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const latest = useRef({ value, saved });
  useEffect(() => {
    latest.current = { value, saved };
  }, [value, saved]);

  const persist = useCallback(
    async (next: string) => {
      setSaving(true);
      const ok = await save(next, false);
      setSaving(false);
      setFailed(!ok);
      if (ok) {
        savedThisSession.set(key, next);
        setSaved(next);
      }
      return ok;
    },
    [key, save],
  );

  useEffect(() => {
    if (value === saved) return;
    const timer = setTimeout(() => void persist(value), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, saved, persist]);

  useEffect(() => {
    const flush = () => {
      const { value: current, saved: stored } = latest.current;
      if (current === stored) return;
      savedThisSession.set(key, current);
      void save(current, true);
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [key, save]);

  const saveNow = useCallback(
    () => void persist(latest.current.value),
    [persist],
  );

  const status: SaveStatus = saving
    ? "saving"
    : value === saved
      ? "saved"
      : failed
        ? "error"
        : "pending";

  return { status, saveNow };
}

/** Shared by both tools, so "Saved" reads the same everywhere. */
export const SAVE_LABEL: Record<SaveStatus, string> = {
  saved: "Saved",
  pending: "Unsaved changes",
  saving: "Saving…",
  error: "Couldn't save — retrying on your next edit",
};

/** PUTs part of the placement profile. */
export async function putPlacement(
  body: string,
  keepalive: boolean,
): Promise<boolean> {
  try {
    const response = await fetch("/api/placement", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
      // Browsers refuse keepalive bodies over about 64 KB outright.
      keepalive: keepalive && body.length < 60_000,
    });
    return response.ok;
  } catch {
    return false;
  }
}
