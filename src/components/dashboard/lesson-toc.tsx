"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { TocEntry } from "@/lib/toc";

/**
 * The open lesson's contents, published by the page and read by the rail.
 *
 * It has to travel this way round because of how the App Router re-renders.
 * The rail lives in the notes *layout*, and a layout is not re-rendered when
 * you move between two lessons — they are sibling routes under the same
 * shell. So the layout worked out the contents once, on whichever lesson you
 * happened to open first, and then kept showing that lesson's sections under
 * every other lesson you clicked. The page does re-render, every time; so the
 * page is where the contents are computed, and this is the wire back.
 */

const EMPTY: TocEntry[] = [];

let current: TocEntry[] = EMPTY;
const listeners = new Set<() => void>();

function publish(entries: TocEntry[]) {
  current = entries;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The contents of the lesson currently on screen, or nothing. */
export function useLessonToc(): TocEntry[] {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => EMPTY,
  );
}

/**
 * Renders nothing; announces the lesson's contents to the rail.
 *
 * The publish happens in an effect rather than during render because the
 * store is outside React, and writing to it mid-render is how you get a
 * component reading a value it is not allowed to see yet.
 */
export function LessonToc({ entries }: { entries: TocEntry[] }) {
  useEffect(() => {
    publish(entries);
    return () => publish(EMPTY);
  }, [entries]);

  return null;
}
