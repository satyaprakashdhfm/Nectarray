"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, RotateCcw } from "lucide-react";
import {
  FIELDS,
  fieldById,
  type FieldId,
  type OmniArticle,
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
 * tweened on each move. Zooming spreads the map out, like a street map: the
 * positions move apart, but the words, dots and lines stay the size they
 * are on screen. Everything drawn as a marker is sized in screen pixels
 * through `u()`, which turns them into world units at the current zoom.
 * It renders with the page, so it is there on first paint rather than when
 * scrolled to. Motion stops under reduced motion.
 */

const WORLD = { w: 1440, h: 1080 };
const ROOT = { x: 110, y: WORLD.h / 2 };
const FIELD_X = 420;
/** Where a field's label ends: its subfield branches start, links land. */
const HUB_X = 700;
const SUB_X = 920;
const ART_X = 1110;

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
 * portrait screen the frames are tighter and the rest of the map is a drag
 * away.
 */
function frameFor(focus: Focus, portrait: boolean) {
  if (focus.level === 1)
    return portrait
      ? { cx: SUB_X + 20, cy: FY[focus.field], w: 460 }
      : { cx: (FIELD_X + ART_X + 200) / 2 - 20, cy: FY[focus.field], w: 980 };
  if (focus.level === 2)
    return {
      cx: portrait ? SUB_X + 185 : (SUB_X + ART_X + 210) / 2,
      cy: SY[`${focus.field}/${focus.sub}`],
      w: portrait ? 400 : 560,
    };
  return portrait
    ? { cx: 400, cy: WORLD.h / 2, w: 800 }
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

/** The container's size, and the root font size the site scales with. */
type View = { px: number; aspect: number; rem: number };

export function OmniMap({ articles }: { articles: OmniArticle[] }) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const aspect = useRef(WORLD.w / WORLD.h);
  const [view, setView] = useState<View | null>(null);
  const [focus, setFocus] = useState<Focus>({ level: 0 });
  const focusRef = useRef<Focus>(focus);
  /** Set by a drag, so the click that ends it does not also open a node. */
  const dragged = useRef(false);
  const [hover, setHover] = useState<FieldId | null>(null);
  const [box, setBox] = useState<Box>({ x: 0, y: 0, ...WORLD });
  const boxRef = useRef(box);
  const anim = useRef<number | undefined>(undefined);

  // Where each article sits, and how many land in each field from elsewhere.
  const { leaves, arrivals, perField, perSub } = useMemo(() => {
    const leaves = articles
      .filter((a) => SY[`${a.field}/${a.subfield}`] !== undefined)
      .map((a, _, all) => {
        const sibs = all.filter(
          (b) => b.field === a.field && b.subfield === a.subfield,
        );
        const k = sibs.indexOf(a);
        return {
          ...a,
          y:
            SY[`${a.field}/${a.subfield}`] +
            (k - (sibs.length - 1) / 2) * ART_GAP,
        };
      });
    const arrivals = Object.fromEntries(
      FIELDS.map((f) => [
        f.id,
        leaves.filter(
          (a) => a.field !== f.id && a.lands.some((l) => l.field === f.id),
        ).length,
      ]),
    ) as Record<FieldId, number>;
    const perField = (id: FieldId) => leaves.filter((a) => a.field === id);
    const perSub = (id: FieldId, sub: string) =>
      leaves.filter((a) => a.field === id && a.subfield === sub).length;
    return { leaves, arrivals, perField, perSub };
  }, [articles]);

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
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setView({ px: width, aspect: aspect.current, rem });
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
    const w = Math.min(WORLD.w * 2, Math.max(220, b.w * factor));
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

  /*
   * Screen pixels to world units. World units per pixel is box.w / px; the
   * overview's value caps it, so zooming out past the overview shrinks the
   * words with the map instead of piling them on top of each other. Phones
   * get slightly smaller markers, big screens larger ones (the site's root
   * font grows past 1920px).
   */
  const s = (() => {
    if (!view) return 1;
    const perPx = box.w / view.px;
    const overview = toBox({ level: 0 }, view.aspect).w / view.px;
    const size = (view.rem / 16) * (view.px < 640 ? 0.85 : 1);
    return size * Math.min(perPx, overview * 1.1);
  })();
  const u = (n: number) => n * s;

  // What is in focus decides what is bright; the rest steps back a little.
  const inField = (id: FieldId) =>
    focus.level === 0 ? hover === null || hover === id : focus.field === id;
  const inSub = (id: FieldId, sub: string) =>
    focus.level !== 2 ? inField(id) : focus.field === id && focus.sub === sub;
  const dim = (on: boolean) => (on ? 1 : focus.level === 0 ? 0.5 : 0.22);

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
        const sub = f.subfields.find((x) => x.id === focus.sub);
        if (sub) out.push({ label: sub.label, to: focus });
      }
    }
    return out;
  }, [focus]);

  const focusField = focus.level !== 0 ? fieldById(focus.field) : null;
  const focusSub =
    focus.level === 2
      ? focusField?.subfields.find((x) => x.id === focus.sub)
      : null;
  const focusArticles =
    focus.level === 0
      ? []
      : perField(focus.field).filter(
          (a) => focus.level === 1 || a.subfield === focus.sub,
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
            <stop offset="0%" stopColor="#1fa5de" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1fa5de" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="omni-dots"
            width={u(28)}
            height={u(28)}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={u(1.5)} cy={u(1.5)} r={u(1.1)} className="fill-line" />
          </pattern>
        </defs>
        <rect
          x={-3000}
          y={-3000}
          width={8000}
          height={8000}
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
              d={curve(ROOT.x + u(62), ROOT.y, FIELD_X - u(12), FY[f.id], 0.6)}
              pathLength={1}
              fill="none"
              stroke={f.color}
              strokeWidth={u(2.25)}
              className="omni-draw"
              style={{ animationDelay: `${i * 90}ms` }}
            />
            <circle r={u(3.5)} fill={f.color} className="omni-pulse">
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
            {f.subfields.map((sub) => {
              const y = SY[`${f.id}/${sub.id}`];
              const on = inSub(f.id, sub.id);
              const count = perSub(f.id, sub.id);
              return (
                <g
                  key={sub.id}
                  style={{ opacity: on ? 1 : 0.5 }}
                  className="transition-opacity duration-500"
                >
                  <path
                    d={curve(HUB_X, FY[f.id], SUB_X - u(8), y, 0.55)}
                    pathLength={1}
                    fill="none"
                    stroke={f.color}
                    strokeWidth={u(1.5)}
                    strokeOpacity={count ? 0.85 : 0.4}
                    strokeDasharray={count ? undefined : `${u(4)} ${u(5)}`}
                    className={count ? "omni-draw" : "omni-fade"}
                    style={{ animationDelay: "500ms" }}
                  />
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${f.label}, ${sub.label}: ${count} article${count === 1 ? "" : "s"}. Zoom in.`}
                    className="cursor-pointer outline-none"
                    onClick={() => go({ level: 2, field: f.id, sub: sub.id })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        go({ level: 2, field: f.id, sub: sub.id });
                      }
                    }}
                  >
                    <circle cx={SUB_X} cy={y} r={u(14)} fill="transparent" />
                    <circle
                      cx={SUB_X}
                      cy={y}
                      r={u(count ? 5 : 4)}
                      fill={count ? f.color : "transparent"}
                      stroke={f.color}
                      strokeWidth={u(1.5)}
                    />
                    <text
                      x={SUB_X + u(12)}
                      y={y + u(4)}
                      className="fill-ink-soft font-medium"
                      style={{ fontSize: u(12), opacity: show(1.05) }}
                    >
                      {sub.label}
                      {count === 0 && (
                        <tspan
                          className="fill-ink-faint font-normal"
                          style={{ fontSize: u(10) }}
                        >
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
        {leaves.map((a) => {
          const f = fieldById(a.field);
          const y0 = SY[`${a.field}/${a.subfield}`];
          const on = inSub(a.field, a.subfield);
          return (
            <g key={a.slug}>
              <path
                d={curve(
                  // Just past the subfield's label, which is screen-sized.
                  Math.min(
                    ART_X - u(40),
                    SUB_X +
                      u(
                        22 +
                          (f.subfields.find((x) => x.id === a.subfield)?.label
                            .length ?? 10) *
                            6.4,
                      ),
                  ),
                  y0,
                  ART_X - u(7),
                  a.y,
                  0.5,
                )}
                pathLength={1}
                fill="none"
                stroke={f.color}
                strokeWidth={u(1.75)}
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
                    style={{ opacity: lit ? 0.9 : 0.3 }}
                    className="transition-opacity duration-500"
                  >
                    <path
                      id={id}
                      d={landing(a.y, FY[l.field])}
                      fill="none"
                      stroke={to.color}
                      strokeWidth={u(1.5)}
                      strokeOpacity={0.8}
                      strokeDasharray={`${u(5)} ${u(6)}`}
                      className="omni-fade omni-flow"
                      style={
                        {
                          animationDelay: "1100ms",
                          "--omni-flow": -u(22),
                        } as React.CSSProperties
                      }
                    />
                    <circle r={u(2.75)} fill={to.color} className="omni-pulse">
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
        {FIELDS.filter((f) => arrivals[f.id] > 0).map((f) => (
          <g
            key={f.id}
            className="omni-fade"
            style={{ animationDelay: "1300ms", opacity: dim(inField(f.id)) }}
          >
            <circle
              cx={HUB_X + 12}
              cy={FY[f.id]}
              r={u(11)}
              fill={f.color}
              fillOpacity={0.12}
              className="omni-breathe"
            />
            <circle
              cx={HUB_X + 12}
              cy={FY[f.id]}
              r={u(5)}
              className="fill-surface"
              stroke={f.color}
              strokeWidth={u(2)}
            />
          </g>
        ))}

        {/* Root. */}
        <g
          style={{ opacity: focus.level === 0 ? 1 : 0.5 }}
          className="transition-opacity duration-500"
        >
          <circle
            cx={ROOT.x}
            cy={ROOT.y}
            r={u(120)}
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
              x={ROOT.x - u(60)}
              y={ROOT.y - u(38)}
              width={u(120)}
              height={u(76)}
              rx={u(22)}
              className="fill-ink"
            />
            <text
              x={ROOT.x}
              y={ROOT.y + u(5)}
              textAnchor="middle"
              className="fill-canvas font-semibold tracking-tight"
              style={{ fontSize: u(26) }}
            >
              LLM
            </text>
            <text
              x={ROOT.x}
              y={ROOT.y + u(25)}
              textAnchor="middle"
              className="fill-canvas opacity-70"
              style={{ fontSize: u(11) }}
            >
              + people
            </text>
          </g>
        </g>

        {/* Field nodes: hover to light, click to fly in. */}
        {FIELDS.map((f) => {
          const y = FY[f.id];
          const on = hover === f.id || focusField?.id === f.id;
          const count = perField(f.id).length;
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
                x={FIELD_X - u(18)}
                y={y - u(24)}
                width={u(36) + u(f.label.length * 9.5 + 24)}
                height={u(48)}
                rx={u(24)}
                fill={f.color}
                fillOpacity={on ? 0.08 : 0}
                className="transition-[fill-opacity] duration-300"
              />
              <circle cx={FIELD_X} cy={y} r={u(8)} fill={f.color} />
              <text
                x={FIELD_X + u(20)}
                y={y + u(2)}
                className="fill-ink font-medium"
                style={{ fontSize: u(17) }}
              >
                {f.label}
              </text>
              <text
                x={FIELD_X + u(20)}
                y={y + u(17)}
                className="fill-ink-faint"
                style={{ fontSize: u(11) }}
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
        {leaves.map((a) => {
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
                r={u(13)}
                fill={f.color}
                fillOpacity={0.12}
                className="omni-breathe"
              />
              <circle cx={ART_X} cy={a.y} r={u(6)} fill={f.color} />
              <text
                x={ART_X + u(17)}
                y={a.y + u(4.5)}
                className="fill-ink group-hover:fill-brand-deep font-semibold"
                style={{ fontSize: u(13) }}
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
