"use client";

import { useEffect, useRef, useState } from "react";

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
 * The cursor over the panel no longer pauses it. On a wide screen the pointer
 * rests over the panel for most of the time the panel is on screen, so pausing
 * on hover meant the rotation almost never ran for the people most likely to
 * be watching it. The cursor over the tab strip is a different matter and does
 * hold it: that row is the control, and a cursor on it means someone is
 * picking rather than reading.
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
  /**
   * When the panel was last touched. A ref rather than state because
   * scrolling fires this dozens of times a second, and re-rendering the
   * whole showcase on every wheel tick to restart a timer is not worth it.
   */
  const lastUsed = useRef(0);
  const [held, setHeld] = useState(false);
  /**
   * The cursor resting on the tab strip. Separate from `held`, which is
   * keyboard focus: someone can tab in and then move the mouse away, and one
   * flag for both would let the mouse leaving cancel the keyboard's hold.
   */
  const [hovered, setHovered] = useState(false);
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

  const running = !snoozed && !held && !hovered && mayAnimate && count > 1;

  /**
   * Someone is working the panel rather than watching it: they have picked,
   * focused, or put the cursor on the strip. Callers use it to stop moving
   * things about while that is true — see the rail in StageShowcase.
   */
  const engaged = snoozed || held || hovered;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((n) => (n + 1) % count), dwell);
    return () => clearTimeout(t);
  }, [running, i, count, dwell]);

  /*
   * Resume once the panel has been quiet for RESUME — not RESUME after the
   * first touch. Each check looks at how long ago the last one was and, if
   * that is still inside the window, waits out the remainder instead of
   * starting the rotation under someone mid-scroll.
   */
  useEffect(() => {
    if (!snoozed) return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const quietFor = Date.now() - lastUsed.current;
      if (quietFor >= RESUME) setSnoozed(false);
      else timer = setTimeout(check, RESUME - quietFor);
    };
    timer = setTimeout(check, RESUME);
    return () => clearTimeout(timer);
  }, [snoozed]);

  /**
   * Hold the rotation for RESUME without moving it.
   *
   * Every call restarts the countdown, so the panel stays put while someone
   * is working in it and only carries on once they have been still for ten
   * seconds. The panels are not always just something to look at — the one
   * on /software has a whole site to browse inside it, and having the tab
   * change under you mid-scroll is the specific thing this prevents.
   */
  const snooze = () => {
    lastUsed.current = Date.now();
    setSnoozed(true);
  };

  /** Show this one, and hold the rotation for RESUME. */
  const pick = (next: number) => {
    setI(((next % count) + count) % count);
    snooze();
  };

  /**
   * Spread onto the panel. Anything that means "I am using this" holds the
   * rotation: a click, a wheel, a scroll inside it, a drag on a phone.
   *
   * All captured, so they count even when the event lands on something
   * nested with handlers of its own — the sample sites on /software scroll
   * in their own box, and `scroll` does not bubble, so a capture listener on
   * the panel is the only way an ancestor hears it at all.
   *
   * Keyboard focus holds too. The cursor merely resting over the panel does
   * not, since on a wide screen it does that most of the time anyway.
   */
  /**
   * Spread on the tab strip. A cursor sitting on the row of controls means
   * somebody is choosing from it, and a strip that keeps rotating and
   * re-scrolling while they aim is a strip that gets mis-clicked.
   */
  const hoverProps = {
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
  };

  const holdProps = {
    onPointerDownCapture: snooze,
    onWheelCapture: snooze,
    onScrollCapture: snooze,
    onTouchMoveCapture: snooze,
    onFocusCapture: () => setHeld(true),
    onBlurCapture: () => setHeld(false),
  };

  return {
    i,
    running,
    engaged,
    mayAnimate,
    pick,
    snooze,
    holdProps,
    hoverProps,
  };
}
