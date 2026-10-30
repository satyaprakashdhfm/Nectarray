"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, RotateCcw } from "lucide-react";
import {
  FIELDS,
  OMNI_ARTICLES,
  fieldById,
  type FieldId,
} from "@/lib/content/omniproof";

/*
 * The Omniproof map. Four rings, left to right: the root (LLMs, with people),
 * the six fields, each field's subfields, and the articles hanging off those.
 * Dashed links run from every article back into each field it lands in.
 *
 * Click a field and the camera flies in: the field fills the frame, the rest
 * of the map falls back and fades. Click a subfield and it flies in again to
 * the articles. Drag to pan, use the buttons (or pinch / ctrl + wheel) to
 * zoom, and the breadcrumb or Escape to step back out.
 *
 * Everything is one SVG in world coordinates; the camera is its viewBox,
 * tweened on each move. It renders with the page, so it is there on first
 * paint rather than when scrolled to. Motion stops under reduced motion.
 */

const WORLD = { w: 1400, h: 1080 };
const ROOT = { x: 110, y: WORLD.h / 2 };
const FIELD_X = 420;
/** Where a field's label ends: its subfield branches start, links land. */
const HUB_X = 640;
const SUB_X = 880;
const ART_X = 1070;

type Box = { x: number; y: number; w: number; h: number };
type Focus =
  | { level: 0 }
  | { level: 1; field: FieldId }
  | { level: 2; field: FieldId; sub: string };

const fieldY = (i: number) => 90 + i * ((WORLD.h - 180) / (FIELDS.length - 1));
const FY = Object.fromEntries(
  FIELDS.map((f, i) => [f.id, fieldY(i)]),
) as Record<FieldId, number>;

const SUB_GAP = 40;
const subY = (field: FieldId, k: number) => {
  const n = fieldById(field).subfields.length;
  return FY[field] + (k - (n - 1) / 2) * SUB_GAP;
};
const SY: Record<string, number> = Object.fromEntries(
  FIELDS.flatMap((f) =>
    f.subfields.map((s, k) => [`${f.id}/${s.id}`, subY(f.id, k)]),
  ),
);

const ART_GAP = 16;
const LEAVES = OMNI_ARTICLES.map((a) => {
  const sibs = OMNI_ARTICLES.filter(
    (b) => b.field === a.field && b.subfield === a.subfield,
  );
  const k = sibs.indexOf(a);
  return {
    ...a,
    y: SY[`${a.field}/${a.subfield}`] + (k - (sibs.length - 1) / 2) * ART_GAP,
  };
});

/** How many articles from elsewhere land in each field. */
const ARRIVALS = Object.fromEntries(
  FIELDS.map((f) => [
    f.id,
    OMNI_ARTICLES.filter(
      (a) => a.field !== f.id && a.lands.some((l) => l.field === f.id),
    ).length,
  ]),
) as Record<FieldId, number>;

const curve = (x1: number, y1: number, x2: number, y2: number, bend = 0.5) => {
  const dx = (x2 - x1) * bend;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};
/** An article back into a field it lands in: out to the right, then home. */
const landing = (from: number, to: number) => {
  const reach = 90 + Math.abs(to - from) * 0.3;
  return `M ${ART_X} ${from} C ${ART_X + reach} ${from + (to - from) * 0.1}, ${HUB_X + 260} ${to}, ${HUB_X + 12} ${to}`;
};

/**
 * The frame for a focus: a centre and a width; height follows the box. On a
 * portrait screen the frames are tighter, so labels stay readable, and the
 * rest of the map is a drag away.
 */
function frameFor(focus: Focus, portrait: boolean) {
  if (focus.level === 1)
    return portrait
      ? { cx: SUB_X + 20, cy: FY[focus.field], w: 440 }
      : { cx: (FIELD_X + ART_X + 200) / 2 - 20, cy: FY[focus.field], w: 940 };
  if (focus.level === 2)
    return {
      cx: portrait ? SUB_X + 185 : (SUB_X + ART_X + 210) / 2,
      cy: SY[`${focus.field}/${focus.sub}`],
      w: portrait ? 380 : 520,
    };
  return portrait
    ? { cx: 380, cy: WORLD.h / 2, w: 760 }
    : { cx: WORLD.w / 2, cy: WORLD.h / 2, w: WORLD.w };
}

/** Fit a frame to the container's shape; the overview always shows it all. */
function toBox(focus: Focus, aspect: number): Box {
  const { cx, cy, w } = frameFor(focus, aspect < 1);
  let width = w;
  let height = width / aspect;
  if (focus.level === 0 && aspect >= 1 && height < WORLD.h) {
    height = WORLD.h;
    width = height * aspect;
  }
  return { x: cx - width / 2, y: cy - height / 2, w: width, h: height };
}

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export function OmniMap() {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const aspect = useRef(WORLD.w / WORLD.h);
  const [focus, setFocus] = useState<Focus>({ level: 0 });
  const focusRef = useRef<Focus>(focus);
  /** Set by a drag, so the click that ends it does not also open a node. */
  const dragged = useRef(false);
  const [hover, setHover] = useState<FieldId | null>(null);
  const [box, setBox] = useState<Box>({ x: 0, y: 0, ...WORLD });
  const boxRef = useRef(box);
  const anim = useRef<number | undefined>(undefined);

  const flyTo = useCallback((target: Box) => {
    window.cancelAnimationFrame(anim.current ?? 0);
    const from = boxRef.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const ms = still ? 0 : 750;
    const step = (now: number) => {
      const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
      const e = ease(t);
      const next = {
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e,
        h: from.h + (target.h - from.h) * e,
      };
      boxRef.current = next;
      setBox(next);
      if (t < 1) anim.current = window.requestAnimationFrame(step);
    };
    anim.current = window.requestAnimationFrame(step);
  }, []);

  const go = useCallback(
    (next: Focus) => {
      focusRef.current = next;
      setFocus(next);
      flyTo(toBox(next, aspect.current));
    },
    [flyTo],
  );

  // Track the container's shape so frames fill it; refit the current focus.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      // A new shape refits the current focus at once; moves between
      // focuses fly instead.
      aspect.current = width / height;
      const b = toBox(focusRef.current, aspect.current);
      boxRef.current = b;
      setBox(b);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const zoom = useCallback((factor: number, at?: { x: number; y: number }) => {
    const b = boxRef.current;
    const cx = at?.x ?? b.x + b.w / 2;
    const cy = at?.y ?? b.y + b.h / 2;
    const w = Math.min(WORLD.w * 2, Math.max(260, b.w * factor));
    const h = w * (b.h / b.w);
    const next = {
      x: cx - (cx - b.x) * (w / b.w),
      y: cy - (cy - b.y) * (h / b.h),
      w,
      h,
    };
    boxRef.current = next;
    setBox(next);
  }, []);

  // Pinch on a trackpad, or ctrl + wheel, zooms about the pointer. A plain
  // wheel is left alone so the page still scrolls past the map.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const b = boxRef.current;
      zoom(Math.exp(e.deltaY * 0.01), {
        x: b.x + ((e.clientX - r.left) / r.width) * b.w,
        y: b.y + ((e.clientY - r.top) / r.height) * b.h,
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom]);

  // Drag to pan. A drag shorter than a few pixels is still a click.
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = svg.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) el.setPointerCapture(e.pointerId);
    d.moved = true;
    dragged.current = true;
    const r = el.getBoundingClientRect();
    const b = boxRef.current;
    const next = {
      ...b,
      x: b.x - (dx / r.width) * b.w,
      y: b.y - (dy / r.height) * b.h,
    };
    d.x = e.clientX;
    d.y = e.clientY;
    window.cancelAnimationFrame(anim.current ?? 0);
    boxRef.current = next;
    setBox(next);
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  // The click that ends a drag is swallowed before it reaches a node.
  const onClickCapture = (e: React.MouseEvent) => {
    if (!dragged.current) return;
    dragged.current = false;
    e.stopPropagation();
  };

  const back = useCallback(() => {
    if (focus.level === 2) go({ level: 1, field: focus.field });
    else go({ level: 0 });
  }, [focus, go]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focus.level > 0) back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back, focus.level]);

  // What is in focus decides what is bright; the rest falls back.
  const inField = (id: FieldId) =>
    focus.level === 0 ? hover === null || hover === id : focus.field === id;
  const inSub = (id: FieldId, sub: string) =>
    focus.level !== 2 ? inField(id) : focus.field === id && focus.sub === sub;
  const dim = (on: boolean) => (on ? 1 : focus.level === 0 ? 0.3 : 0.12);

  /** Labels for a ring show once the camera is close enough to read them. */
  const scale = WORLD.w / box.w;
  const show = (from: number) =>
    Math.max(0, Math.min(1, (scale - from) / 0.35));

  const crumbs = useMemo(() => {
    const out: { label: string; to: Focus }[] = [
      { label: "All fields", to: { level: 0 } },
    ];
    if (focus.level !== 0) {
      const f = fieldById(focus.field);
      out.push({ label: f.label, to: { level: 1, field: f.id } });
      if (focus.level === 2) {
        const s = f.subfields.find((x) => x.id === focus.sub);
        if (s) out.push({ label: s.label, to: focus });
      }
    }
    return out;
  }, [focus]);

  const focusField = focus.level !== 0 ? fieldById(focus.field) : null;
  const focusSub =
    focus.level === 2
      ? focusField?.subfields.find((s) => s.id === focus.sub)
      : null;
  const focusArticles =
    focus.level === 0
      ? []
      : OMNI_ARTICLES.filter(
          (a) =>
            a.field === focus.field &&
            (focus.level === 1 || a.subfield === focus.sub),
        );

  return (
    <div
      ref={wrap}
      className="border-line bg-surface relative h-[72svh] min-h-[28rem] overflow-hidden rounded-3xl border select-none sm:h-[min(82vh,56rem)] sm:min-h-[34rem]"
    >
      <svg
        ref={svg}
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        preserveAspectRatio="xMidYMid meet"
        className="block size-full cursor-grab touch-pan-y active:cursor-grabbing sm:touch-none"
        role="group"
        aria-label="Omniproof map. LLMs branch into six fields, each field into subfields, each subfield into articles; dashed links show where an article lands in other fields."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <defs>
          <radialGradient id="omni-root-glow">
            <stop offset="0%" stopColor="#1fa5de" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1fa5de" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="omni-dots"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.2" className="fill-line" />
          </pattern>
        </defs>
        <rect
          x={-2000}
          y={-2000}
          width={6000}
          height={6000}
          fill="url(#omni-dots)"
        />

        {/* Root to fields. */}
        {FIELDS.map((f, i) => (
          <g
            key={f.id}
            style={{ opacity: dim(inField(f.id)) }}
            className="transition-opacity duration-500"
          >
            <path
              id={`omni-b-${f.id}`}
              d={curve(ROOT.x + 62, ROOT.y, FIELD_X - 12, FY[f.id], 0.6)}
              pathLength={1}
              fill="none"
              stroke={f.color}
              strokeWidth={hover === f.id || focusField?.id === f.id ? 4 : 2.5}
              className="omni-draw"
              style={{ animationDelay: `${i * 90}ms` }}
            />
            <circle r={4} fill={f.color} className="omni-pulse">
              <animateMotion
                dur="3.2s"
                begin={`${0.6 + i * 0.45}s`}
                repeatCount="indefinite"
              >
                <mpath href={`#omni-b-${f.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}

        {/* Fields to subfields. */}
        {FIELDS.map((f) => (
          <g
            key={f.id}
            style={{ opacity: dim(inField(f.id)) }}
            className="transition-opacity duration-500"
          >
            {f.subfields.map((s) => {
              const y = SY[`${f.id}/${s.id}`];
              const on = inSub(f.id, s.id);
              const count = OMNI_ARTICLES.filter(
                (a) => a.field === f.id && a.subfield === s.id,
              ).length;
              return (
                <g
                  key={s.id}
                  style={{ opacity: on ? 1 : 0.35 }}
                  className="transition-opacity duration-500"
                >
                  <path
                    d={curve(HUB_X, FY[f.id], SUB_X - 8, y, 0.55)}
                    pathLength={1}
                    fill="none"
                    stroke={f.color}
                    strokeWidth={1.75}
                    strokeOpacity={count ? 0.9 : 0.4}
                    strokeDasharray={count ? undefined : "4 5"}
                    className={count ? "omni-draw" : "omni-fade"}
                    style={{ animationDelay: "500ms" }}
                  />
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${f.label}, ${s.label}: ${count} article${count === 1 ? "" : "s"}. Zoom in.`}
                    className="cursor-pointer outline-none"
                    onClick={() => go({ level: 2, field: f.id, sub: s.id })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        go({ level: 2, field: f.id, sub: s.id });
                      }
                    }}
                  >
                    <circle cx={SUB_X} cy={y} r={14} fill="transparent" />
                    <circle
                      cx={SUB_X}
                      cy={y}
                      r={count ? 6 : 4.5}
                      fill={count ? f.color : "transparent"}
                      stroke={f.color}
                      strokeWidth={1.75}
                    />
                    <text
                      x={SUB_X + 12}
                      y={y + 4}
                      className="fill-ink-soft text-[12px] font-medium"
                      style={{ opacity: show(1.05) }}
                    >
                      {s.label}
                      {count === 0 && (
                        <tspan className="fill-ink-faint text-[9px] font-normal">
                          {" "}
                          · soon
                        </tspan>
                      )}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        ))}

        {/* Subfields to articles, and each article's landing links. */}
        {LEAVES.map((a) => {
          const f = fieldById(a.field);
          const y0 = SY[`${a.field}/${a.subfield}`];
          const on = inSub(a.field, a.subfield);
          return (
            <g key={a.slug}>
              <path
                d={curve(SUB_X + 130, y0, ART_X - 7, a.y, 0.5)}
                pathLength={1}
                fill="none"
                stroke={f.color}
                strokeWidth={2}
                style={{ opacity: dim(on), animationDelay: "800ms" }}
                className="omni-draw transition-opacity duration-500"
              />
              {a.lands.map((l) => {
                const to = fieldById(l.field);
                const id = `omni-l-${a.slug}-${l.field}`;
                const lit =
                  focus.level === 0
                    ? hover === null || hover === a.field || hover === l.field
                    : focus.field === a.field || focus.field === l.field;
                return (
                  <g
                    key={id}
                    style={{ opacity: lit ? 1 : 0.15 }}
                    className="transition-opacity duration-500"
                  >
                    <path
                      id={id}
                      d={landing(a.y, FY[l.field])}
                      fill="none"
                      stroke={to.color}
                      strokeWidth={1.75}
                      strokeOpacity={0.85}
                      strokeDasharray="5 6"
                      className="omni-fade omni-flow"
                      style={{ animationDelay: "1100ms" }}
                    />
                    <circle r={3} fill={to.color} className="omni-pulse">
                      <animateMotion
                        dur="2.8s"
                        begin={`${1.6 + FY[l.field] / 400}s`}
                        repeatCount="indefinite"
                      >
                        <mpath href={`#${id}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Intersections: rings where other fields' articles arrive. */}
        {FIELDS.filter((f) => ARRIVALS[f.id] > 0).map((f) => (
          <g
            key={f.id}
            className="omni-fade"
            style={{ animationDelay: "1300ms", opacity: dim(inField(f.id)) }}
          >
            <circle
              cx={HUB_X + 12}
              cy={FY[f.id]}
              r={12}
              fill={f.color}
              fillOpacity={0.16}
              className="omni-breathe"
            />
            <circle
              cx={HUB_X + 12}
              cy={FY[f.id]}
              r={5.5}
              className="fill-surface"
              stroke={f.color}
              strokeWidth={2.5}
            />
          </g>
        ))}

        {/* Root. */}
        <g
          style={{ opacity: focus.level === 0 ? 1 : 0.4 }}
          className="transition-opacity duration-500"
        >
          <circle
            cx={ROOT.x}
            cy={ROOT.y}
            r={130}
            fill="url(#omni-root-glow)"
            className="omni-breathe"
          />
          <g
            role="button"
            tabIndex={0}
            aria-label="Show every field"
            className="cursor-pointer outline-none"
            onClick={() => go({ level: 0 })}
            onKeyDown={(e) => e.key === "Enter" && go({ level: 0 })}
          >
            <rect
              x={ROOT.x - 64}
              y={ROOT.y - 42}
              width={128}
              height={84}
              rx={24}
              className="fill-ink"
            />
            <text
              x={ROOT.x}
              y={ROOT.y + 5}
              textAnchor="middle"
              className="fill-canvas text-[30px] font-semibold tracking-tight"
            >
              LLM
            </text>
            <text
              x={ROOT.x}
              y={ROOT.y + 27}
              textAnchor="middle"
              className="fill-canvas text-[12px] opacity-70"
            >
              + people
            </text>
          </g>
        </g>

        {/* Field nodes: hover to light, click to fly in. */}
        {FIELDS.map((f) => {
          const y = FY[f.id];
          const on = hover === f.id || focusField?.id === f.id;
          const count = OMNI_ARTICLES.filter((a) => a.field === f.id).length;
          return (
            <g
              key={f.id}
              role="button"
              tabIndex={0}
              aria-label={`${f.label}: ${count} article${count === 1 ? "" : "s"}. Zoom in.`}
              className="cursor-pointer transition-opacity duration-500 outline-none"
              style={{ opacity: dim(inField(f.id)) }}
              onClick={() => go({ level: 1, field: f.id })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  go({ level: 1, field: f.id });
                }
              }}
              onMouseEnter={() => setHover(f.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(f.id)}
              onBlur={() => setHover(null)}
            >
              <rect
                x={FIELD_X - 20}
                y={y - 26}
                width={HUB_X - FIELD_X + 20}
                height={52}
                rx={26}
                fill={f.color}
                fillOpacity={on ? 0.16 : 0}
                className="transition-[fill-opacity] duration-300"
              />
              <circle cx={FIELD_X} cy={y} r={on ? 11 : 9} fill={f.color} />
              <text
                x={FIELD_X + 22}
                y={y + 2}
                className={`text-[21px] ${on ? "fill-ink font-semibold" : "fill-ink font-medium"}`}
              >
                {f.label}
              </text>
              <text
                x={FIELD_X + 22}
                y={y + 19}
                className="fill-ink-faint text-[11px]"
              >
                {count
                  ? `${count} piece${count === 1 ? "" : "s"}`
                  : "in the works"}{" "}
                · {f.subfields.length} subfields
              </text>
            </g>
          );
        })}

        {/* Article leaves: click to read. */}
        {LEAVES.map((a) => {
          const f = fieldById(a.field);
          const open = () => router.push(`/omniproof/${a.slug}`);
          return (
            <g
              key={a.slug}
              role="link"
              tabIndex={0}
              aria-label={`Read: ${a.title}`}
              className="group cursor-pointer transition-opacity duration-500 outline-none"
              style={{ opacity: dim(inSub(a.field, a.subfield)) }}
              onClick={open}
              onKeyDown={(e) => e.key === "Enter" && open()}
              onMouseEnter={() => setHover(a.field)}
              onMouseLeave={() => setHover(null)}
            >
              <circle
                cx={ART_X}
                cy={a.y}
                r={15}
                fill={f.color}
                fillOpacity={0.18}
                className="omni-breathe"
              />
              <circle cx={ART_X} cy={a.y} r={7} fill={f.color} />
              <text
                x={ART_X + 18}
                y={a.y + 5}
                className="fill-ink group-hover:fill-brand-deep text-[14px] font-semibold"
              >
                {a.short} →
              </text>
            </g>
          );
        })}
      </svg>

      {/* Breadcrumb and zoom controls. */}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3">
        <nav aria-label="Map position" className="pointer-events-auto">
          <ol className="border-line bg-surface/90 flex flex-wrap items-center gap-1 rounded-full border px-2 py-1 text-[0.8125rem] shadow-sm backdrop-blur">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-ink-faint">›</span>}
                <button
                  type="button"
                  onClick={() => go(c.to)}
                  aria-current={
                    i === crumbs.length - 1 ? "location" : undefined
                  }
                  className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                    i === crumbs.length - 1
                      ? "text-ink"
                      : "text-ink-soft hover:bg-mist"
                  }`}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="border-line bg-surface/90 pointer-events-auto flex rounded-full border p-1 shadow-sm backdrop-blur">
          <ZoomButton label="Zoom in" icon={Plus} onClick={() => zoom(0.75)} />
          <ZoomButton
            label="Zoom out"
            icon={Minus}
            onClick={() => zoom(1.33)}
          />
          <ZoomButton
            label="Reset view"
            icon={RotateCcw}
            onClick={() => go({ level: 0 })}
          />
        </div>
      </div>

      {/* What is in focus, in words. */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
        {focusField ? (
          <div className="border-line bg-surface/92 pointer-events-auto max-w-sm rounded-2xl border p-3 shadow-sm backdrop-blur sm:p-4">
            <p
              className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase"
              style={{ color: focusField.color }}
            >
              {focusSub
                ? `${focusField.label} · ${focusSub.label}`
                : focusField.label}
            </p>
            <p className="text-ink-soft mt-1 hidden text-[0.875rem] leading-relaxed sm:block">
              {focusSub?.blurb ?? focusField.blurb}
            </p>
            {focusArticles.length === 0 ? (
              <p className="text-ink-faint mt-2 text-[0.8125rem]">
                No pieces here yet.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {focusArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/omniproof/${a.slug}`}
                      className="text-brand-deep inline-flex items-center gap-1 text-[0.875rem] font-semibold hover:underline"
                    >
                      {a.title}
                      <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="border-line bg-surface/90 text-ink-soft rounded-full border px-3 py-1.5 text-[0.8125rem] shadow-sm backdrop-blur">
            Click a field to fly in · drag to move · pinch to zoom
          </p>
        )}
      </div>
    </div>
  );
}

function ZoomButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Plus;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="text-ink-soft hover:bg-mist hover:text-ink grid size-8 place-items-center rounded-full transition-colors sm:size-9"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
