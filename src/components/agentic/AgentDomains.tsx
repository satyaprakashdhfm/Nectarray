"use client";

import { useEffect, useRef, useState } from "react";
import { useCarousel } from "@/hooks";
import { OutputScreen } from "@/components/agentic/OutputScreen";
import { Icon } from "@/components/ui/Icon";
import { agenticAiPage } from "@/lib/content/agentic-ai";

const { domains, industries } = agenticAiPage;

/** How long a domain holds before the list moves on. */
const DWELL = 7000;
/** And how fast its task list ticks itself off inside that. */
const TICK = 1100;

/** The worked example already written for a trade, where there is one. */
const screenFor = (id?: string) =>
  id ? industries.find((entry) => entry.id === id)?.tabs[0].screen : undefined;

/**
 * Every kind of work an agent can take on, as a list you read down with the
 * open one playing beside it.
 *
 * This and "what that looks like on a Tuesday" used to be two sections making
 * the same argument a screen apart — a list of teams with no detail, then
 * three worked examples with no list. They are one thing now: pick the team,
 * and get the ask, the systems it reaches, and what comes back.
 *
 * What comes back is the spreadsheet where a worked example has been written
 * for that trade, and the agent's own task list emptying itself where one has
 * not. Films of real runs will replace the task list — the panel is framed
 * for that already, so dropping a video in changes this one element and
 * nothing around it.
 *
 * The control has two shapes. Wide, it is the column of ten on the left, open
 * one carrying its description. Narrow, that column would be four hundred
 * pixels of list before a reader reaches the thing it controls, and the
 * description opening and closing under an auto-advancing rotation would move
 * the page under their thumb every seven seconds. So below `lg` it is a strip
 * that scrolls sideways, of the kind /marketing uses, with the description
 * beneath it in a cell sized to the longest of them — fixed height, whichever
 * team is live.
 *
 * Auto-advancing at seven seconds, which is long enough to watch a task list
 * finish. Picking a team holds it for ten — see useCarousel.
 */
export function AgentDomains() {
  const { i, running, engaged, mayAnimate, pick, holdProps, hoverProps } =
    useCarousel(domains.items.length, DWELL);
  const [done, setDone] = useState(0);
  const rail = useRef<HTMLUListElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const item = domains.items[i];
  // Its own sample output where the team has one, and the worked example
  // already written for that trade where it does not — every team has one or
  // the other now, so the panel never falls back to the ticking task list.
  const screen = item.screen ?? screenFor(item.industry);

  // The task list starts again whenever the team does, however it changed.
  // Adjusted during render rather than in an effect: React throws away the
  // in-progress output and re-renders before painting, so the panel is never
  // caught showing the previous team's list already ticked off.
  const [shownFor, setShownFor] = useState(i);
  if (shownFor !== i) {
    setShownFor(i);
    setDone(0);
  }

  useEffect(() => {
    if (!mayAnimate || done >= item.steps.length) return;
    const t = setTimeout(() => setDone((n) => n + 1), TICK);
    return () => clearTimeout(t);
  }, [done, mayAnimate, item.steps.length]);

  // The live chip pulled to the left edge of the strip, so the teams still to
  // come arrive from the right. Never while someone is working it, or the
  // chip being aimed at slides out from under the thumb. A no-op at `lg`,
  // where the strip is display:none and every offset reads zero.
  useEffect(() => {
    if (engaged) return;
    const box = rail.current;
    const tab = tabs.current[i];
    if (!box || !tab) return;
    box.scrollTo({
      left: Math.max(0, tab.offsetLeft - 8),
      behavior: mayAnimate ? "smooth" : "auto",
    });
  }, [i, mayAnimate, engaged]);

  /*
   * Every hold except the one on scrolling, which goes on the panel instead.
   *
   * `onScrollCapture` hears a descendant scroll and cannot tell whose it
   * was, and the effect above scrolls the strip every time the rotation
   * advances — so left on the wrapper it would snooze the rotation that had
   * just run, and each team would sit for its seven seconds plus the ten a
   * deliberate pick buys. The panel is the part with something scrollable
   * inside it (the spreadsheet), which is what that hold is for. A reader
   * working the strip itself still holds it, through the touch, pointer and
   * focus captures here and the cursor on the strip below.
   */
  const outerHold = { ...holdProps, onScrollCapture: undefined };

  return (
    <div
      className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10"
      {...outerHold}
    >
      {/* ── Narrow: the teams as a strip ─────────────────────────── */}
      {/* min-w-0, or the strip below does not scroll — it stretches.
          A grid item's min-width defaults to `auto`, which means "never
          narrower than your contents", and the contents here are five team
          tabs in a row. On a phone that laid this column out at 1612px; the
          section's overflow-hidden then cut it off at the screen edge, so the
          page did not scroll sideways, it simply lost everything past
          "Customer su…". */}
      <div className="min-w-0 lg:hidden">
        <div className="relative" {...hoverProps}>
          {/* A fade at each end rather than a scrollbar, the same as the
              strip on /marketing: it says there is more without spending a
              row on saying it. */}
          <span
            className="from-mist pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r to-transparent"
            aria-hidden
          />
          <span
            className="from-mist pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l to-transparent"
            aria-hidden
          />
          <ul
            ref={rail}
            role="tablist"
            aria-label={domains.eyebrow}
            className="relative flex [scrollbar-width:none] gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
          >
            {domains.items.map((entry, n) => (
              <li key={entry.id} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={n === i}
                  ref={(el) => {
                    tabs.current[n] = el;
                  }}
                  onClick={() => pick(n)}
                  className={`relative flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-2 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors ${
                    n === i
                      ? "border-brand-deep bg-brand-deep text-white"
                      : "border-line bg-surface text-ink-soft hover:border-brand hover:text-ink"
                  }`}
                >
                  <Icon
                    name={entry.icon}
                    className={`size-4 shrink-0 ${n === i ? "text-white/80" : "text-ink-faint/70"}`}
                  />
                  {entry.label}

                  {n === i && running && (
                    <span
                      key={i}
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/70"
                      style={{
                        animation: `showcase-run ${DWELL}ms linear forwards`,
                      }}
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Every description in the one cell, all but the live one hidden
            rather than unmounted, so the cell is as tall as the longest and
            the panel below never moves as the rotation advances. */}
        <div className="mt-4 grid">
          {domains.items.map((entry, n) => (
            <p
              key={entry.id}
              className={`text-ink-soft col-start-1 row-start-1 text-[0.875rem] leading-relaxed ${
                n === i ? "" : "invisible"
              }`}
            >
              {entry.body}
            </p>
          ))}
        </div>
      </div>

      {/* ── Wide: the column. Only the open one carries its description,
              so ten teams fit in a column a reader takes in at once. ── */}
      <div
        role="tablist"
        aria-label={domains.eyebrow}
        className="hidden lg:block"
      >
        {domains.items.map((entry, n) => {
          const open = n === i;
          return (
            <div key={entry.id} className="border-line border-b last:border-0">
              <button
                type="button"
                role="tab"
                aria-selected={open}
                onClick={() => pick(n)}
                className={`flex w-full items-center gap-2.5 py-3 text-left transition-colors ${
                  open
                    ? "text-ink text-[1rem] font-semibold"
                    : "text-ink-faint hover:text-ink-soft text-[0.9375rem]"
                }`}
              >
                <Icon
                  name={entry.icon}
                  className={`size-4 shrink-0 ${open ? "text-brand-deep" : "text-ink-faint/70"}`}
                />
                {entry.label}
              </button>

              {open && (
                <div className="pb-4">
                  <p className="text-ink-soft text-[0.8125rem] leading-relaxed">
                    {entry.body}
                  </p>
                  {running && (
                    <span
                      className="bg-line mt-3 block h-0.5 overflow-hidden rounded-full"
                      aria-hidden
                    >
                      <span
                        key={i}
                        className="bg-brand-deep block h-full origin-left"
                        style={{
                          animation: `showcase-run ${DWELL}ms linear forwards`,
                        }}
                      />
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="card min-w-0 overflow-hidden p-2 sm:p-2.5 lg:p-3"
        aria-live="polite"
        onScrollCapture={holdProps.onScrollCapture}
      >
        <div className="border-line bg-canvas overflow-hidden rounded-xl border">
          <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 xl:grid-cols-[0.85fr_1.15fr] xl:gap-8 xl:p-7">
            {/* The ask, and what it reaches. */}
            <div className="min-w-0">
              <div className="bg-night rounded-2xl p-4 text-white/80 sm:p-5">
                <p className="text-[0.625rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
                  What you ask for
                </p>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed">
                  {item.prompt}
                </p>
                <p className="mt-5 text-[0.625rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
                  Connected to
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {item.connectors.map((connector) => (
                    <span
                      key={connector}
                      className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[0.75rem] font-medium text-white/85"
                    >
                      {connector}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-ink-faint mt-5 text-[0.625rem] font-semibold tracking-[0.16em] uppercase">
                What it does
              </p>
              <ol className="mt-2.5 space-y-1.5">
                {item.steps.map((step, n) => {
                  const complete = n < done;
                  return (
                    <li
                      key={step}
                      className={`flex items-start gap-2.5 text-[0.8125rem] leading-snug transition-opacity duration-500 ${
                        n <= done ? "opacity-100" : "opacity-45"
                      }`}
                    >
                      <span
                        className={`mt-[0.1rem] grid size-4 shrink-0 place-items-center rounded-full border text-[0.5625rem] transition-colors duration-300 ${
                          complete
                            ? "border-brand-deep bg-brand-deep text-white"
                            : "border-line text-ink-faint"
                        }`}
                        aria-hidden
                      >
                        {complete ? (
                          <Icon name="check" className="size-2.5" />
                        ) : (
                          n + 1
                        )}
                      </span>
                      <span className={complete ? "text-ink-soft" : "text-ink"}>
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* And what comes back. */}
            {screen ? (
              <OutputScreen screen={screen} />
            ) : (
              <div className="border-line bg-mist text-ink-faint grid min-h-[14rem] place-items-center rounded-2xl border border-dashed p-6 text-center text-[0.8125rem]">
                A worked example for this team is on its way. Ask us and we will
                walk you through one on a call.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
