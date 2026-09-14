"use client";

import { useEffect, useState } from "react";

/** How long a deliberate pick holds the rotation before it picks up again. */
const RESUME = 10000;

/**
 * The auto-advancing panel behind every tabbed showcase on the site.
 *
 * Picking a tab pauses the rotation for ten seconds and then lets it carry
 * on. It used to stop for good, which sounds considerate and is not: a reader
 * who taps one tab out of curiosity has silently switched the thing off, and
 * nothing tells them why it went still.
 *
 * The cursor no longer pauses it either. On a wide screen the pointer rests
 * over the panel for most of the time the panel is on screen, so pausing on
 * hover meant the rotation almost never ran for the people most likely to be
 * watching it.
 *
 * Keyboard focus does still hold it, and that is deliberate rather than an
 * oversight: content that moves on its own has to be stoppable without a
 * mouse, and tabbing into the strip is how someone doing that arrives.
 *
 * Nothing moves for a reader who has asked for reduced motion.
 */
export function useCarousel(count: number, dwell: number) {
  const [i, setI] = useState(0);
  const [snoozed, setSnoozed] = useState(false);
  /** Bumped on every pick, so a second click restarts the ten seconds. */
  const [nudge, setNudge] = useState(0);
  const [held, setHeld] = useState(false);
  const [mayAnimate, setMayAnimate] = useState(false);

  // Opt in only once the browser has said motion is welcome, so the markup
  // rendered on the server is the still one either way.
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMayAnimate(!q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);

  const running = !snoozed && !held && mayAnimate && count > 1;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((n) => (n + 1) % count), dwell);
    return () => clearTimeout(t);
  }, [running, i, count, dwell]);

  useEffect(() => {
    if (!snoozed) return;
    const t = setTimeout(() => setSnoozed(false), RESUME);
    return () => clearTimeout(t);
  }, [snoozed, nudge]);

  /** Show this one, and hold the rotation for RESUME. */
  const pick = (next: number) => {
    setI(((next % count) + count) % count);
    setSnoozed(true);
    setNudge((k) => k + 1);
  };

  /** Spread onto the panel: keyboard focus holds, the cursor does not. */
  const holdProps = {
    onFocusCapture: () => setHeld(true),
    onBlurCapture: () => setHeld(false),
  };

  return { i, running, mayAnimate, pick, holdProps };
}
