"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon } from "@/components/ui/Icon";
import { marketingPage } from "@/lib/content";

const { loop } = marketingPage;

/* ---------------------------------------------------------------------------
   Ring geometry

   Everything below is derived from these three numbers, so moving a node or
   widening the gap around one is a single edit rather than a set of hand-placed
   coordinates. Angles run clockwise from the top, which is the direction a
   reader expects a cycle to turn.
--------------------------------------------------------------------------- */

const BOX = 360;
const C = BOX / 2;
const R = 128;
/** Degrees of arc left clear at each end so the stroke never runs under a node. */
const CLEARANCE = 26;

const STEP = 360 / loop.stages.length;
const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const at = (deg: number, radius = R) => ({
  x: C + radius * Math.cos(rad(deg)),
  y: C + radius * Math.sin(rad(deg)),
});

const nodes = loop.stages.map((stage, i) => {
  const angle = i * STEP;
  const p = at(angle);
  return {
    stage,
    angle,
    ...p,
    pct: { x: (p.x / BOX) * 100, y: (p.y / BOX) * 100 },
  };
});

/** One arrowed arc per gap between neighbouring nodes, including the last back to 01. */
const arcs = nodes.map((node, i) => {
  const from = node.angle + CLEARANCE;
  const to = node.angle + STEP - CLEARANCE;
  const a = at(from);
  const b = at(to);
  // The arrowhead sits at the far end, turned to follow the tangent there.
  const tip = at(to + 3);
  return {
    key: node.stage.n,
    d: `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`,
    tip,
    rotate: to + 90,
    /** The arc that leads *into* the next node, so it can light up with it. */
    leadsTo: (i + 1) % nodes.length,
  };
});

/**
 * `children` is the section's heading and lede. They sit above the wheel in
 * the same column rather than across the top of the section: the wheel is
 * only 22rem wide, so a full-width heading left a shelf of empty space beside
 * it and made the panel look like it had drifted away from the words.
 */
export function GrowthLoop({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const stage = loop.stages[active];

  return (
    <div className="grid gap-10 lg:grid-cols-[24rem_1fr] lg:gap-14">
      <div className="flex flex-col">
        {children}

        {/* ── The wheel. Decorative on its own — every stage it offers is
               also a button in the rail opposite — so it is hidden from
               assistive tech and the rail carries the semantics. ── */}
        <div
          className="relative mx-auto mt-10 hidden w-full max-w-[22rem] lg:block"
          aria-hidden
        >
          <svg viewBox={`0 0 ${BOX} ${BOX}`} className="w-full">
            <circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              className="stroke-line"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            {arcs.map((arc) => {
              const lit = arc.leadsTo === active;
              return (
                <g
                  key={arc.key}
                  className={
                    lit ? "text-brand" : "text-brand/25"
                  } /* currentColor drives both the arc and its head */
                >
                  <path
                    d={arc.d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={lit ? 3 : 2}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <path
                    d="M -5 -4 L 0 0 L -5 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={lit ? 3 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform={`translate(${arc.tip.x.toFixed(2)} ${arc.tip.y.toFixed(2)}) rotate(${arc.rotate.toFixed(2)})`}
                    className="transition-all duration-500"
                  />
                </g>
              );
            })}
          </svg>

          {/* The hub names whatever is selected, so the wheel is readable at a
            glance instead of being four unlabelled dots. */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <span className="text-brand-deep font-mono text-[0.72rem] font-semibold">
                {stage.n}
              </span>
              <span className="display text-ink mt-1 block text-[1.375rem] leading-tight">
                {stage.short}
              </span>
            </div>
          </div>

          {nodes.map((node, i) => (
            <button
              key={node.stage.n}
              type="button"
              tabIndex={-1}
              onClick={() => setActive(i)}
              style={{ left: `${node.pct.x}%`, top: `${node.pct.y}%` }}
              className={`absolute grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-all duration-300 ${
                i === active
                  ? "border-brand-deep bg-brand-deep scale-110 text-white shadow-lg"
                  : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand-deep"
              }`}
            >
              <Icon name={node.stage.icon} className="size-5" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {/* ── The rail. The real control: a tablist on every width, and the
               only one below lg, where the wheel would be too small to aim
               at. Scrolls sideways on a phone rather than wrapping into a
               block that pushes the panel off screen. ── */}
        <div
          role="tablist"
          aria-label="The four stages"
          className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0"
        >
          {loop.stages.map((s, i) => (
            <button
              key={s.n}
              type="button"
              role="tab"
              id={`loop-tab-${s.n}`}
              aria-selected={i === active}
              aria-controls={`loop-panel-${s.n}`}
              onClick={() => setActive(i)}
              className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors ${
                i === active
                  ? "border-brand-deep bg-brand-deep text-white"
                  : "border-line bg-surface text-ink-soft hover:border-brand hover:text-ink"
              }`}
            >
              <span
                className={`font-mono text-[0.6875rem] ${i === active ? "text-white/70" : "text-ink-faint"}`}
              >
                {s.n}
              </span>
              {s.title}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`loop-panel-${stage.n}`}
          aria-labelledby={`loop-tab-${stage.n}`}
          className="card mt-4 flex flex-1 flex-col p-5 sm:p-8"
        >
          <h3 className="display text-ink text-[1.5rem] sm:text-[1.75rem]">
            {stage.title}
          </h3>
          <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
            {stage.lede}
          </p>

          {/* The platforms hang off the stage that uses them. This is the
              whole reason the flat channel grid went: Meta Ads and content
              management were sitting in one list as if they were the same
              kind of decision. */}
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {stage.services.map((service) => (
              <li
                key={service.title}
                className="border-line bg-mist rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-ink text-[0.875rem] font-semibold tracking-tight">
                    {service.title}
                  </h4>
                  {service.logos && (
                    <ul className="flex shrink-0 items-center gap-1">
                      {service.logos.map((brand) => (
                        <li
                          key={brand.name}
                          className="border-line bg-canvas grid size-6 place-items-center rounded-md border"
                          title={brand.name}
                        >
                          <BrandLogo
                            name={brand.name}
                            domain={brand.domain}
                            className="size-3.5"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-[1.55]">
                  {service.body}
                </p>
              </li>
            ))}
          </ul>

          <a
            href={stage.anchor}
            className="text-brand-deep hover:text-brand mt-auto flex w-fit items-center gap-1.5 pt-6 text-[0.875rem] font-semibold transition-colors"
          >
            The full detail on {stage.short.toLowerCase()}
            <Icon name="arrow" className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
