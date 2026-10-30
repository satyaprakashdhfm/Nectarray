"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  FIELDS,
  OMNI_ARTICLES,
  fieldById,
  type FieldId,
} from "@/lib/content/omniproof";

/*
 * The root graph. One root on the left (LLMs, working with people), a branch
 * to each field, a leaf for each article, and from each leaf a dashed link
 * back into every field the article lands in. Those links are the point:
 * read together they show where the fields intersect.
 *
 * It is plain SVG rendered with the page, so it is there on first paint; the
 * branches draw in and the pulses start at once, not when it scrolls into
 * view. Motion stops under prefers-reduced-motion (see .omni-* in
 * globals.css).
 */

const W = 1000;
const H = 600;
const ROOT = { x: 120, y: H / 2 };
const FIELD_X = 430;
/** Where a field's own stub starts, and where landing links arrive. */
const HUB_X = 610;
const LEAF_X = 770;

const fieldY = (i: number) => 70 + i * ((H - 140) / (FIELDS.length - 1));

const yOf = Object.fromEntries(
  FIELDS.map((f, i) => [f.id, fieldY(i)]),
) as Record<FieldId, number>;

/** Leaves sit level with their field, fanned out when a field has several. */
const leaves = OMNI_ARTICLES.map((a) => {
  const siblings = OMNI_ARTICLES.filter((b) => b.field === a.field);
  const k = siblings.indexOf(a);
  return { ...a, y: yOf[a.field] + (k - (siblings.length - 1) / 2) * 26 };
});

const branch = (y: number) =>
  `M ${ROOT.x + 62} ${ROOT.y} C ${ROOT.x + 190} ${ROOT.y}, ${FIELD_X - 150} ${y}, ${FIELD_X - 10} ${y}`;
const stub = (from: number, to: number) =>
  `M ${HUB_X} ${from} C ${HUB_X + 80} ${from}, ${LEAF_X - 80} ${to}, ${LEAF_X - 7} ${to}`;
const landing = (from: number, to: number) =>
  `M ${LEAF_X} ${from} C ${LEAF_X + 90} ${from + (to - from) * 0.25}, ${HUB_X + 130} ${to}, ${HUB_X + 14} ${to}`;

/** How many article links arrive in each field: its intersection count. */
const arrivals = Object.fromEntries(
  FIELDS.map((f) => [
    f.id,
    OMNI_ARTICLES.filter(
      (a) => a.field !== f.id && a.lands.some((l) => l.field === f.id),
    ).length,
  ]),
) as Record<FieldId, number>;

export function ProofGraph() {
  const router = useRouter();
  const [active, setActive] = useState<FieldId>("mathematics");
  const [hover, setHover] = useState<FieldId | null>(null);
  const lit = hover ?? active;

  const field = fieldById(active);
  const own = OMNI_ARTICLES.filter((a) => a.field === active);
  const arriving = OMNI_ARTICLES.filter(
    (a) => a.field !== active && a.lands.some((l) => l.field === active),
  );

  // A field is lit with its own branch, and with any link that touches it.
  const touches = (id: FieldId, a: (typeof leaves)[number], to: FieldId) =>
    a.field === id || to === id;

  return (
    <div>
      <div className="border-line bg-surface relative overflow-x-auto rounded-3xl border">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full min-w-[720px]"
          role="group"
          aria-label="Omniproof map: LLMs branch into six fields; each article links to the fields it lands in."
        >
          <defs>
            <radialGradient id="omni-root-glow">
              <stop offset="0%" stopColor="#1fa5de" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1fa5de" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Root to field branches. */}
          {FIELDS.map((f, i) => (
            <g key={f.id}>
              <path
                id={`omni-branch-${f.id}`}
                d={branch(fieldY(i))}
                pathLength={1}
                fill="none"
                stroke={f.color}
                strokeWidth={lit === f.id ? 3.5 : 2}
                strokeOpacity={lit === f.id ? 1 : 0.55}
                className="omni-draw transition-[stroke-width,stroke-opacity] duration-300"
                style={{ animationDelay: `${i * 90}ms` }}
              />
              <circle r={3.5} fill={f.color} className="omni-pulse">
                <animateMotion
                  dur="3.2s"
                  begin={`${0.6 + i * 0.45}s`}
                  repeatCount="indefinite"
                >
                  <mpath href={`#omni-branch-${f.id}`} />
                </animateMotion>
              </circle>
            </g>
          ))}

          {/* Field to article stubs, and a faint bud where none is out yet. */}
          {FIELDS.map((f, i) => {
            const mine = leaves.filter((a) => a.field === f.id);
            const y = fieldY(i);
            // A field with nothing yet says so beside its name instead.
            if (mine.length === 0) return null;
            return mine.map((a) => (
              <path
                key={a.slug}
                d={stub(y, a.y)}
                pathLength={1}
                fill="none"
                stroke={f.color}
                strokeWidth={lit === f.id ? 3 : 2}
                strokeOpacity={lit === f.id ? 1 : 0.6}
                className="omni-draw transition-[stroke-width,stroke-opacity] duration-300"
                style={{ animationDelay: "600ms" }}
              />
            ));
          })}

          {/* Landing links: from an article back into each field it reaches. */}
          {leaves.flatMap((a) =>
            a.lands.map((l) => {
              const on = touches(lit, a, l.field);
              const id = `omni-land-${a.slug}-${l.field}`;
              const color = fieldById(l.field).color;
              return (
                <g key={id}>
                  <path
                    id={id}
                    d={landing(a.y, yOf[l.field])}
                    fill="none"
                    stroke={color}
                    strokeWidth={on ? 2.25 : 1.25}
                    strokeOpacity={on ? 0.95 : 0.35}
                    strokeDasharray="5 6"
                    className="omni-fade omni-flow transition-[stroke-width,stroke-opacity] duration-300"
                    style={{ animationDelay: "1100ms" }}
                  />
                  <circle r={3} fill={color} className="omni-pulse">
                    <animateMotion
                      dur="2.6s"
                      begin={`${1.6 + yOf[l.field] / 300}s`}
                      repeatCount="indefinite"
                    >
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            }),
          )}

          {/* Intersections: where other fields' articles land in this one. */}
          {FIELDS.filter((f) => arrivals[f.id] > 0).map((f) => (
            <g
              key={f.id}
              className="omni-fade"
              style={{ animationDelay: "1300ms" }}
            >
              <circle
                cx={HUB_X + 14}
                cy={yOf[f.id]}
                r={11}
                fill={f.color}
                fillOpacity={0.16}
                className="omni-breathe"
              />
              <circle
                cx={HUB_X + 14}
                cy={yOf[f.id]}
                r={5}
                className="fill-surface"
                stroke={f.color}
                strokeWidth={2.5}
              />
            </g>
          ))}

          {/* Root. */}
          <circle
            cx={ROOT.x}
            cy={ROOT.y}
            r={110}
            fill="url(#omni-root-glow)"
            className="omni-breathe"
          />
          <rect
            x={ROOT.x - 62}
            y={ROOT.y - 40}
            width={124}
            height={80}
            rx={22}
            className="fill-ink"
          />
          <text
            x={ROOT.x}
            y={ROOT.y + 4}
            textAnchor="middle"
            className="fill-canvas text-[28px] font-semibold tracking-tight"
          >
            LLM
          </text>
          <text
            x={ROOT.x}
            y={ROOT.y + 25}
            textAnchor="middle"
            className="fill-canvas text-[12px] opacity-70"
          >
            + people
          </text>

          {/* Field nodes: hover to light a field, click to open it below. */}
          {FIELDS.map((f, i) => {
            const y = fieldY(i);
            const on = lit === f.id;
            return (
              <g
                key={f.id}
                role="button"
                tabIndex={0}
                aria-pressed={active === f.id}
                aria-label={`${f.label}: show articles and links`}
                className="cursor-pointer outline-none"
                onClick={() => setActive(f.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(f.id);
                  }
                }}
                onMouseEnter={() => setHover(f.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(f.id)}
                onBlur={() => setHover(null)}
              >
                <rect
                  x={FIELD_X - 16}
                  y={y - 20}
                  width={HUB_X - FIELD_X + 16}
                  height={40}
                  rx={20}
                  fill={f.color}
                  fillOpacity={on ? 0.14 : 0}
                  className="transition-[fill-opacity] duration-300"
                />
                <circle
                  cx={FIELD_X}
                  cy={y}
                  r={on ? 9 : 7}
                  fill={f.color}
                  className="transition-[r] duration-300"
                />
                <text
                  x={FIELD_X + 18}
                  y={y + 5}
                  className={`text-[16px] ${on ? "fill-ink font-semibold" : "fill-ink-soft font-medium"}`}
                >
                  {f.label}
                  {arrivals[f.id] === 0 &&
                    !OMNI_ARTICLES.some((a) => a.field === f.id) && (
                      <tspan className="fill-ink-faint text-[12px] font-normal">
                        {"  "}· in the works
                      </tspan>
                    )}
                </text>
              </g>
            );
          })}

          {/* Article leaves: click to read. */}
          {leaves.map((a) => {
            const color = fieldById(a.field).color;
            const go = () => router.push(`/omniproof/${a.slug}`);
            return (
              <g
                key={a.slug}
                role="link"
                tabIndex={0}
                aria-label={`Read: ${a.title}`}
                className="group cursor-pointer outline-none"
                onClick={go}
                onKeyDown={(e) => e.key === "Enter" && go()}
                onMouseEnter={() => setHover(a.field)}
                onMouseLeave={() => setHover(null)}
              >
                <circle
                  cx={LEAF_X}
                  cy={a.y}
                  r={14}
                  fill={color}
                  fillOpacity={0.18}
                  className="omni-breathe"
                />
                <circle cx={LEAF_X} cy={a.y} r={7} fill={color} />
                <text
                  x={LEAF_X + 20}
                  y={a.y + 5}
                  className="fill-ink group-hover:fill-brand-deep text-[15px] font-semibold"
                >
                  {a.short} →
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* The open field: its articles, where they land, and what lands in it. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p
            className="text-[0.8125rem] font-semibold tracking-[0.08em] uppercase"
            style={{ color: field.color }}
          >
            {field.label}
          </p>
          <p className="text-ink-soft mt-2 text-[1rem] leading-relaxed">
            {field.blurb}
          </p>
          {own.length === 0 && (
            <p className="text-ink-faint mt-4 text-[0.9375rem]">
              The first {field.label.toLowerCase()} piece is in the works.
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {own.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/omniproof/${a.slug}`}
                  className="group border-line bg-surface hover:border-brand block rounded-2xl border p-5 transition-colors"
                >
                  <p className="text-ink group-hover:text-brand-deep text-[1.0625rem] leading-snug font-semibold transition-colors">
                    {a.title}
                  </p>
                  <p className="text-ink-soft mt-1.5 text-[0.9375rem] leading-relaxed">
                    {a.description}
                  </p>
                  <span className="text-brand-deep mt-3 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold">
                    Read in 5 minutes
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          {own.flatMap((a) =>
            a.lands.map((l) => (
              <Impact
                key={`${a.slug}-${l.field}`}
                to={l.field}
                text={l.impact}
              />
            )),
          )}
          {arriving.map((a) => (
            <Impact
              key={a.slug}
              from={a.field}
              to={active}
              text={a.lands.find((l) => l.field === active)!.impact}
              href={`/omniproof/${a.slug}`}
              title={a.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Impact({
  from,
  to,
  text,
  href,
  title,
}: {
  from?: FieldId;
  to: FieldId;
  text: string;
  href?: string;
  title?: string;
}) {
  const target = fieldById(from ?? to);
  return (
    <div className="border-line bg-surface rounded-2xl border p-4">
      <p className="text-ink flex items-center gap-2 text-[0.875rem] font-semibold">
        <span
          className="size-2.5 rounded-full"
          style={{ background: target.color }}
          aria-hidden
        />
        {from ? `Arriving from ${target.label}` : `Lands in ${target.label}`}
      </p>
      <p className="text-ink-soft mt-1.5 text-[0.9375rem] leading-relaxed">
        {text}
      </p>
      {href && title && (
        <Link
          href={href}
          className="text-brand-deep mt-2 inline-block text-[0.875rem] font-semibold"
        >
          {title} →
        </Link>
      )}
    </div>
  );
}
