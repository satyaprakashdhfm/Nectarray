"use client";

import { useEffect, useState } from "react";
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
 * Auto-advancing at seven seconds, which is long enough to watch a task list
 * finish. Picking a team holds it for ten — see useCarousel.
 */
export function AgentDomains() {
  const { i, running, mayAnimate, pick, holdProps } = useCarousel(
    domains.items.length,
    DWELL,
  );
  const [done, setDone] = useState(0);

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

  return (
    <div
      className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10"
      {...holdProps}
    >
      {/* The list. Only the open one carries its description, so ten teams
          fit in a column a reader takes in at once. */}
      <div role="tablist" aria-label="Where an agent earns its place">
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

      <div className="card overflow-hidden p-2.5 sm:p-3" aria-live="polite">
        <div className="border-line bg-canvas overflow-hidden rounded-xl border">
          <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[0.85fr_1.15fr] xl:gap-8">
            {/* The ask, and what it reaches. */}
            <div className="min-w-0">
              <div className="bg-night rounded-2xl p-5 text-white/80">
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
