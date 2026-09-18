"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useCarousel } from "@/hooks";
import { Icon } from "@/components/ui/Icon";
import { agenticAiPage } from "@/lib/content/agentic-ai";

const { domains } = agenticAiPage;

/** How long a domain holds before the list moves on. */
const DWELL = 7000;

/**
 * Every kind of work an agent can take on, as a list you read down with the
 * open one playing beside it.
 *
 * This and "what that looks like on a Tuesday" used to be two sections making
 * the same argument a screen apart — a list of teams with no detail, then
 * three worked examples with no list. They are one thing now: pick the team,
 * and get the ask, the systems it reaches, and what comes back.
 *
 * What comes back is the agent's own console for that team. These replaced a
 * hand-drawn panel — the ask in a dark block, the systems as chips, a task
 * list ticking itself off, and a spreadsheet of the result — which the
 * captures now carry better and in one piece. Keeping both would have shown
 * the same prompt and the same connectors twice, side by side.
 *
 * Every capture is cut to one window, so the panel holds its height as the
 * rotation moves through the ten. A panel that grew and shrank would move the
 * strip under a thumb already reaching for it.
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
 * Auto-advancing at seven seconds, which is long enough to take a console in
 * without reading every row of it. Picking a team holds it for ten — see
 * useCarousel.
 */
export function AgentDomains() {
  const { i, running, engaged, mayAnimate, pick, holdProps, hoverProps } =
    useCarousel(domains.items.length, DWELL);
  const rail = useRef<HTMLUListElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const item = domains.items[i];

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
   * Every hold except the one on scrolling, which is dropped.
   *
   * `onScrollCapture` hears a descendant scroll and cannot tell whose it
   * was, and the effect above scrolls the strip every time the rotation
   * advances — so left on it would snooze the rotation that had just run,
   * and each team would sit for its seven seconds plus the ten a deliberate
   * pick buys. It used to sit on the panel instead, which had the one
   * genuinely scrollable thing in here, a spreadsheet wider than its column.
   * The captures replaced that, so the strip is now the only scroller left,
   * and a reader working it is already held by the touch, pointer and focus
   * captures here and by the cursor on the strip below.
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

      {/*
       * No aria-live. The alt on these runs to a couple of sentences, and a
       * region that re-read one every seven seconds would queue announcements
       * faster than a screen reader could finish them. The tabs carry the
       * state instead: aria-selected moves with the rotation, and the panel is
       * here to be read deliberately.
       */}
      <div
        className="card min-w-0 overflow-hidden p-2 sm:p-2.5 lg:p-3"
        role="tabpanel"
      >
        <div className="border-line bg-canvas overflow-hidden rounded-xl border">
          {/* Keyed on the team, so React swaps the element rather than
              pointing the old one at a new src — which would otherwise leave
              the outgoing capture on screen until the new one had arrived. */}
          <Image
            key={item.id}
            src={item.shot.src}
            alt={item.shot.alt}
            width={item.shot.width}
            height={item.shot.height}
            sizes="(min-width: 1024px) 68rem, 94vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
