"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * The figure at the top of the decision-brain piece: situations stream into
 * a small decision model and straight out to an action; now and then one it
 * is unsure of goes up to the LLM, which takes longer, then acts.
 *
 * Colours are the site's tokens, so it follows the light and dark themes.
 * It only animates while on screen, and stands still for reduced motion.
 */
const S = { x: 110, y: 300 };
const D = { x: 430, y: 300 };
const A = { x: 790, y: 300 };
const L = { x: 610, y: 112 };

const ACCENT = "#e0607e";
const LLM = "#2bb3ad";

const FAST = 6;
const CYCLE = 3.6;

export function DecisionLoop() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const still = useReducedMotion() || !inView;

  return (
    <figure className="border-line bg-surface mt-8 overflow-hidden rounded-2xl border">
      <svg
        ref={ref}
        viewBox="0 0 900 420"
        className="block w-full"
        role="img"
        aria-label="Situations flow into a small decision model, which sends most of them straight to an action. The few it is unsure of go up to the LLM, which reasons more slowly and then acts."
      >
        {/* Paths. */}
        <path
          d={`M${S.x} ${S.y} H${A.x}`}
          className="stroke-line"
          strokeWidth={3}
          fill="none"
        />
        <path
          d={`M${D.x} ${D.y} Q${D.x + 40} ${L.y} ${L.x - 70} ${L.y} M${L.x + 70} ${L.y} Q${A.x - 40} ${L.y} ${A.x} ${A.y}`}
          stroke={LLM}
          strokeOpacity={0.45}
          strokeWidth={2.5}
          strokeDasharray="6 8"
          fill="none"
        />

        {/* Situation. */}
        <circle cx={S.x} cy={S.y} r={34} className="fill-mist stroke-line" strokeWidth={2} />
        <text x={S.x} y={S.y + 66} textAnchor="middle" className="fill-ink" fontSize={20} fontWeight={600}>
          Situation
        </text>
        <text x={S.x} y={S.y + 90} textAnchor="middle" className="fill-ink-faint" fontSize={15}>
          sensors, messages
        </text>

        {/* Decision model: small, fast. */}
        <circle cx={D.x} cy={D.y} r={40} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={2.5} />
        <circle cx={D.x} cy={D.y} r={12} fill={ACCENT} />
        <text x={D.x} y={D.y + 72} textAnchor="middle" className="fill-ink" fontSize={20} fontWeight={600}>
          Decision model
        </text>
        <text x={D.x} y={D.y + 96} textAnchor="middle" className="fill-ink-faint" fontSize={15}>
          milliseconds, same answer every time
        </text>

        {/* LLM: large, slow. */}
        <rect
          x={L.x - 70}
          y={L.y - 44}
          width={140}
          height={88}
          rx={22}
          fill={LLM}
          fillOpacity={0.12}
          stroke={LLM}
          strokeWidth={2.5}
        />
        <text x={L.x} y={L.y + 8} textAnchor="middle" className="fill-ink" fontSize={24} fontWeight={700}>
          LLM
        </text>
        <text x={L.x} y={L.y - 58} textAnchor="middle" className="fill-ink-faint" fontSize={15}>
          reasons when the decision model is unsure
        </text>

        {/* Act. */}
        <circle cx={A.x} cy={A.y} r={34} className="fill-ink" />
        <path
          d={`M${A.x - 9} ${A.y - 13} L${A.x + 12} ${A.y} L${A.x - 9} ${A.y + 13} Z`}
          className="fill-surface"
        />
        <text x={A.x} y={A.y + 66} textAnchor="middle" className="fill-ink" fontSize={20} fontWeight={600}>
          Act
        </text>
        <text x={A.x} y={A.y + 90} textAnchor="middle" className="fill-ink-faint" fontSize={15}>
          brake, grip, turn
        </text>

        {/* The traffic. */}
        {still ? (
          <>
            <circle cx={270} cy={S.y} r={7} fill={ACCENT} />
            <circle cx={610} cy={S.y} r={7} fill={ACCENT} />
            <circle cx={L.x} cy={L.y + 30} r={7} fill={LLM} />
          </>
        ) : (
          <>
            {Array.from({ length: FAST }, (_, i) => (
              <motion.circle
                key={i}
                r={7}
                fill={ACCENT}
                initial={{ cx: S.x, cy: S.y, opacity: 0 }}
                animate={{
                  cx: [S.x, D.x, A.x],
                  cy: [S.y, S.y, S.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.4,
                  ease: "linear",
                  repeat: Infinity,
                  repeatDelay: CYCLE - 1.4,
                  delay: (i * CYCLE) / FAST,
                  opacity: { times: [0, 0.1, 0.9, 1], duration: 1.4, repeat: Infinity, repeatDelay: CYCLE - 1.4, delay: (i * CYCLE) / FAST },
                }}
              />
            ))}
            <motion.circle
              r={7}
              fill={LLM}
              initial={{ cx: S.x, cy: S.y, opacity: 0 }}
              animate={{
                cx: [S.x, D.x, L.x, L.x, A.x],
                cy: [S.y, S.y, L.y + 30, L.y + 30, S.y],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 5,
                times: [0, 0.12, 0.42, 0.78, 1],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: CYCLE * 2 - 5,
                delay: 0.3,
              }}
            />
          </>
        )}
      </svg>
      <figcaption className="text-ink-faint border-line border-t px-5 py-3 text-[0.8125rem]">
        Cheap and fast by default, the large model on exception.
      </figcaption>
    </figure>
  );
}
