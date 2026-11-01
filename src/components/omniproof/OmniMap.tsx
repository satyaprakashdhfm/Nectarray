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
 * The Omniproof map, as an orbit. LLMs (with people) sit at the centre; the
 * six domains sit evenly on one ring round them, seen a little from above.
 * Each article stands on its domain. A dashed arc rises from an article and
 * comes down on every other domain it lands in, over the ring rather than
 * through the middle.
 *
 * Drag sideways to turn the ring (up and down tilts it, within limits, so it
 * never flips). Click a domain and it turns to the front and the camera
 * flies in; its subdomains open round it as a ring of satellites. Click one
 * to go in again. The breadcrumb or Escape steps back out.
 *
 * No 3D library: each point is turned and projected in a few lines of maths
 * and drawn as one SVG in screen pixels, so words stay the same size at any
 * zoom. It redraws only while something moves. The slow idle turn runs only
 * while the map is on screen and nobody is using it, and never under
 * reduced motion.
 */

type V = [number, number, number];
type Focus =
  | { level: 0 }
  | { level: 1; field: FieldId }
  | { level: 2; field: FieldId; sub: string };
type Cam = { yaw: number; pitch: number; zoom: number; pivot: V };
/** The container in pixels, and the size markers are drawn at. */
type View = { w: number; h: number; fit: number; px: number };
type At = { x: number; y: number; z: number; k: number };

const RING = 330;
/** Satellites round a domain, and how far out its articles stand. */
const SAT = 78;
const ART = 140;
const ART_GAP = 30;
const DEPTH = 2400;
const PITCH = { min: -1.05, max: -0.12, rest: -0.42 };
const ZOOM: Record<Focus["level"], number> = { 0: 1, 1: 2.3, 2: 3.4 };

const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const mean = (ps: V[]): V =>
  mul(ps.reduce((s, p) => add(s, p), [0, 0, 0] as V), 1 / ps.length);

const angle = (i: number) => (i / FIELDS.length) * Math.PI * 2;
const DP = Object.fromEntries(
  FIELDS.map((f, i) => [
    f.id,
    [RING * Math.cos(angle(i)), 0, RING * Math.sin(angle(i))],
  ]),
) as Record<FieldId, V>;

/**
 * A point in the upright plane through a domain, square to the ring: what
 * faces the viewer when that domain is turned to the front. `b` is the angle
 * round the domain, 0 to the right, and `r` the distance out.
 */
function around(field: FieldId, b: number, r: number): V {
  const [x, , z] = DP[field];
  const t: V = [-z / RING, 0, x / RING];
  return add(DP[field], add(mul(t, Math.cos(b) * r), [0, -Math.sin(b) * r, 0]));
}
/** Subdomains spread over the upper half, so articles stand above the ring. */
const subAngle = (k: number, n: number) =>
  Math.PI * (n === 1 ? 0.5 : 0.12 + (0.76 * k) / (n - 1));
const SP: Record<string, V> = Object.fromEntries(
  FIELDS.flatMap((f) =>
    f.subfields.map((s, k) => [
      `${f.id}/${s.id}`,
      around(f.id, subAngle(k, f.subfields.length), SAT),
    ]),
  ),
);

/** The turn that brings a domain to the front of the ring. */
const frontYaw = (field: FieldId) => {
  const [x, , z] = DP[field];
  return Math.atan2(x, -z);
};

function project(p: V, cam: Cam, view: View): At {
  const x = p[0] - cam.pivot[0];
  const y = p[1] - cam.pivot[1];
  const z = p[2] - cam.pivot[2];
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  const k = DEPTH / (DEPTH + Math.max(z2, -DEPTH * 0.7));
  const s = view.fit * cam.zoom * k;
  return { x: view.w / 2 + x1 * s, y: view.h / 2 + y2 * s, z: z2, k };
}

/** The back of the ring fades: front at full strength, back at about half. */
const depth = (z: number) =>
  0.45 + 0.55 * Math.max(0, Math.min(1, (RING - z) / (2 * RING)));

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const turn = (from: number, to: number) =>
  ((((to - from + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) -
  Math.PI;

const START: Cam = { yaw: 0.35, pitch: PITCH.rest, zoom: 1, pivot: [0, 0, 0] };

export function OmniMap({ articles }: { articles: OmniArticle[] }) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View | null>(null);
  const viewRef = useRef<View | null>(null);
  const [cam, setCamState] = useState<Cam>(START);
  const camRef = useRef(cam);
  const setCam = useCallback((c: Cam) => {
    camRef.current = c;
    setCamState(c);
  }, []);
  const [focus, setFocus] = useState<Focus>({ level: 0 });
  const [hover, setHover] = useState<FieldId | null>(null);
  const anim = useRef<number | undefined>(undefined);
  /** True while the camera flies to a focus; the idle turn holds off. */
  const flying = useRef(false);
  /** When someone last touched the map; the idle turn waits for quiet. */
  const touched = useRef(0);
  /** Set by a drag, so the click that ends it does not also open a node. */
  const dragged = useRef(false);

  // Where each article stands, and how many land in each domain.
  const { leaves, arrivals, perField, perSub } = useMemo(() => {
    const leaves = articles
      .filter((a) => SP[`${a.field}/${a.subfield}`] !== undefined)
      .map((a, _, all) => {
        const f = fieldById(a.field);
        const n = f.subfields.length;
        const k = f.subfields.findIndex((s) => s.id === a.subfield);
        const sibs = all.filter(
          (b) => b.field === a.field && b.subfield === a.subfield,
        );
        const i = sibs.indexOf(a);
        return {
          ...a,
          p: around(a.field, subAngle(k, n), ART + i * ART_GAP),
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
      leaves.filter((a) => a.field === id && a.subfield === sub);
    return { leaves, arrivals, perField, perSub };
  }, [articles]);

  const flyTo = useCallback(
    (target: Cam) => {
      window.cancelAnimationFrame(anim.current ?? 0);
      const from = camRef.current;
      const still = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dYaw = turn(from.yaw, target.yaw);
      const start = performance.now();
      const ms = still ? 0 : 900;
      const step = (now: number) => {
        const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
        const e = ease(t);
        setCam({
          yaw: from.yaw + dYaw * e,
          pitch: from.pitch + (target.pitch - from.pitch) * e,
          zoom: from.zoom + (target.zoom - from.zoom) * e,
          pivot: add(from.pivot, mul(add(target.pivot, mul(from.pivot, -1)), e)),
        });
        if (t < 1) anim.current = window.requestAnimationFrame(step);
        else flying.current = false;
      };
      flying.current = true;
      anim.current = window.requestAnimationFrame(step);
    },
    [setCam],
  );

  const go = useCallback(
    (next: Focus) => {
      touched.current = performance.now();
      setFocus(next);
      if (next.level === 0) {
        flyTo({ ...START, yaw: camRef.current.yaw });
        return;
      }
      const portrait = (viewRef.current?.w ?? 1) < (viewRef.current?.h ?? 1);
      const yaw = frontYaw(next.field);
      if (next.level === 1) {
        const sats = fieldById(next.field).subfields.map(
          (s) => SP[`${next.field}/${s.id}`],
        );
        flyTo({
          yaw,
          pitch: -0.16,
          zoom: ZOOM[1] * (portrait ? 0.75 : 1),
          pivot: mean([DP[next.field], ...sats]),
        });
        return;
      }
      const sat = SP[`${next.field}/${next.sub}`];
      const kids = leaves
        .filter((a) => a.field === next.field && a.subfield === next.sub)
        .map((a) => a.p);
      flyTo({
        yaw,
        pitch: -0.16,
        zoom: ZOOM[2] * (portrait ? 0.75 : 1),
        pivot: mean([sat, ...kids]),
      });
    },
    [flyTo, leaves],
  );

  // Track the container's size; the whole ring fits it at zoom 1.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (!w || !h) return;
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const v = {
        w,
        h,
        fit: Math.min(w / 1000, h / 760),
        px: (rem / 16) * (w < 640 ? 0.85 : 1),
      };
      viewRef.current = v;
      setView(v);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The idle turn: only on the overview, on screen, with nobody using it.
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!onScreen || focus.level !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = window.requestAnimationFrame(tick);
      // About 30 frames a second is smooth enough for a slow turn.
      if (now - last < 33) return;
      const dt = last ? now - last : 33;
      last = now;
      if (now - touched.current < 4000 || flying.current) return;
      const c = camRef.current;
      setCam({ ...c, yaw: c.yaw + dt * 0.0001 });
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [onScreen, focus.level, setCam]);

  const zoom = useCallback(
    (factor: number) => {
      touched.current = performance.now();
      window.cancelAnimationFrame(anim.current ?? 0);
      flying.current = false;
      const c = camRef.current;
      setCam({ ...c, zoom: Math.min(6, Math.max(0.6, c.zoom * factor)) });
    },
    [setCam],
  );

  // Pinch on a trackpad, or ctrl + wheel, zooms. A plain wheel is left alone
  // so the page still scrolls past the map.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoom(Math.exp(-e.deltaY * 0.01));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom]);

  // Drag to turn; two fingers to zoom. A drag under a few pixels is a click.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ moved: boolean; pinch?: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = { moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = svg.current;
    const prev = pointers.current.get(e.pointerId);
    if (!d || !el || !prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    if (pointers.current.size === 2) {
      pointers.current.set(e.pointerId, cur);
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (d.pinch) zoom(dist / d.pinch);
      d.pinch = dist;
      d.moved = true;
      dragged.current = true;
      return;
    }
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) el.setPointerCapture(e.pointerId);
    d.moved = true;
    dragged.current = true;
    pointers.current.set(e.pointerId, cur);
    touched.current = performance.now();
    window.cancelAnimationFrame(anim.current ?? 0);
    flying.current = false;
    const c = camRef.current;
    setCam({
      ...c,
      yaw: c.yaw - dx * 0.006,
      pitch: Math.max(PITCH.min, Math.min(PITCH.max, c.pitch + dy * 0.004)),
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) drag.current = null;
    else if (drag.current) drag.current.pinch = undefined;
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

  const crumbs = useMemo(() => {
    const out: { label: string; to: Focus }[] = [
      { label: "All domains", to: { level: 0 } },
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

  // What is in focus decides what is bright; the rest steps back.
  const inField = (id: FieldId) =>
    focus.level === 0 ? hover === null || hover === id : focus.field === id;
  const inSub = (id: FieldId, sub: string) =>
    focus.level !== 2 ? inField(id) : focus.field === id && focus.sub === sub;
  const dim = (on: boolean) => (on ? 1 : focus.level === 0 ? 0.4 : 0.15);
  /** Subdomains show only for the domain that is open or pointed at. */
  const open = (id: FieldId) =>
    (focus.level !== 0 && focus.field === id) ||
    (focus.level === 0 && hover === id);

  const v = view;
  const u = (n: number) => n * (v?.px ?? 1);
  const P = (p: V): At => (v ? project(p, cam, v) : { x: 0, y: 0, z: 0, k: 1 });
  const root = P([0, 0, 0]);
  const domAt = Object.fromEntries(
    FIELDS.map((f) => [f.id, P(DP[f.id])]),
  ) as Record<FieldId, At>;

  // The orbit, as a closed path through the projected ring.
  const ring = (() => {
    if (!v) return "";
    const pts = Array.from({ length: 73 }, (_, i) => {
      const a = (i / 72) * Math.PI * 2;
      return P([RING * Math.cos(a), 0, RING * Math.sin(a)]);
    });
    return pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  })();
  const line = (a: At, b: At) => `M ${a.x} ${a.y} L ${b.x} ${b.y}`;

  // Far side first, so the front of the ring draws on top.
  const order = [...FIELDS].sort((a, b) => domAt[b.id].z - domAt[a.id].z);

  return (
    <div
      ref={wrap}
      className="border-line bg-surface relative h-[72svh] min-h-[28rem] overflow-hidden rounded-3xl border select-none sm:h-[min(82vh,56rem)] sm:min-h-[34rem]"
    >
      <svg
        ref={svg}
        viewBox={v ? `0 0 ${v.w} ${v.h}` : "0 0 1 1"}
        className="block size-full cursor-grab touch-pan-y active:cursor-grabbing sm:touch-none"
        role="group"
        aria-label="Omniproof map. LLMs at the centre, six domains on a ring round them, each with its subdomains and articles; dashed arcs run from an article to the other domains it lands in."
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
        <rect width="100%" height="100%" fill="url(#omni-dots)" />

        {v && (
          <>
            {/* The orbit and the spokes to it. */}
            <path
              d={ring}
              fill="none"
              className="stroke-line"
              strokeWidth={u(1.5)}
              style={{ opacity: focus.level === 0 ? 1 : 0.5 }}
            />
            {FIELDS.map((f, i) => (
              <g
                key={f.id}
                style={{
                  opacity: dim(inField(f.id)) * depth(domAt[f.id].z) * 0.7,
                }}
                className="transition-opacity duration-500"
              >
                <path
                  d={line(root, domAt[f.id])}
                  pathLength={1}
                  fill="none"
                  stroke={f.color}
                  strokeWidth={u(1.5)}
                  className="omni-draw"
                  style={{ animationDelay: `${i * 90}ms` }}
                />
              </g>
            ))}
            <circle
              cx={root.x}
              cy={root.y}
              r={u(110) * root.k}
              fill="url(#omni-root-glow)"
              className="omni-breathe"
              style={{ opacity: focus.level === 0 ? 1 : 0 }}
            />
            <g
              role="button"
              tabIndex={0}
              aria-label="Show every domain"
              className="cursor-pointer transition-opacity duration-500 outline-none"
              style={{ opacity: focus.level === 0 ? 1 : 0.12 }}
              onClick={() => go({ level: 0 })}
              onKeyDown={(e) => e.key === "Enter" && go({ level: 0 })}
            >
              <rect
                x={root.x - u(44)}
                y={root.y - u(27)}
                width={u(88)}
                height={u(54)}
                rx={u(16)}
                className="fill-ink"
              />
              <text
                x={root.x}
                y={root.y + u(3)}
                textAnchor="middle"
                className="fill-canvas font-semibold tracking-tight"
                style={{ fontSize: u(20) }}
              >
                LLM
              </text>
              <text
                x={root.x}
                y={root.y + u(18)}
                textAnchor="middle"
                className="fill-canvas opacity-70"
                style={{ fontSize: u(9.5) }}
              >
                + people
              </text>
            </g>

            {/* Landing arcs: up from the article, over, down on the domain. */}
            {leaves.map((a) =>
              a.lands.map((l) => {
                const to = fieldById(l.field);
                const from = P(a.p);
                const end = domAt[l.field];
                const mid = mul(add(a.p, DP[l.field]), 0.5);
                // Lower when zoomed in, so the arcs stay on screen.
                const c = P(add(mul(mid, 0.6), [0, -240 / Math.sqrt(cam.zoom), 0]));
                const lit =
                  focus.level === 0
                    ? hover === null || hover === a.field || hover === l.field
                    : focus.field === a.field || focus.field === l.field;
                return (
                  <g
                    key={`${a.slug}-${l.field}`}
                    style={{ opacity: lit ? 0.75 : 0.15 }}
                    className="transition-opacity duration-500"
                  >
                    <path
                      d={`M ${from.x} ${from.y} Q ${c.x} ${c.y} ${end.x} ${end.y}`}
                      fill="none"
                      stroke={to.color}
                      strokeWidth={u(1.4)}
                      strokeDasharray={`${u(5)} ${u(6)}`}
                      className="omni-flow"
                      style={
                        {
                          animationDelay: "900ms",
                          "--omni-flow": -u(22),
                        } as React.CSSProperties
                      }
                    />
                  </g>
                );
              }),
            )}

            {/* Each domain with what stands on it, back of the ring first. */}
            {order.map((f) => {
              const at = domAt[f.id];
              const count = perField(f.id).length;
              const fade = depth(at.z);
              const shown = open(f.id);
              const r = u(9) * Math.sqrt(at.k);
              return (
                <g
                  key={f.id}
                  style={{ opacity: dim(inField(f.id)) * fade }}
                  className="transition-opacity duration-500"
                >
                  {/* Subdomains: a ring of satellites, when open. */}
                  {f.subfields.map((s) => {
                    const sa = P(SP[`${f.id}/${s.id}`]);
                    const n = perSub(f.id, s.id).length;
                    const go2 = () => go({ level: 2, field: f.id, sub: s.id });
                    return (
                      <g
                        key={s.id}
                        role="button"
                        tabIndex={shown ? 0 : -1}
                        aria-label={`${f.label}, ${s.label}: ${n} article${n === 1 ? "" : "s"}. Zoom in.`}
                        className="cursor-pointer transition-opacity duration-300 outline-none"
                        style={{
                          opacity: shown ? (inSub(f.id, s.id) ? 1 : 0.4) : 0,
                          pointerEvents: shown ? "auto" : "none",
                        }}
                        onClick={go2}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            go2();
                          }
                        }}
                      >
                        <path
                          d={line(at, sa)}
                          stroke={f.color}
                          strokeWidth={u(1.25)}
                          strokeOpacity={n ? 0.8 : 0.4}
                          strokeDasharray={n ? undefined : `${u(3)} ${u(4)}`}
                        />
                        <circle cx={sa.x} cy={sa.y} r={u(12)} fill="transparent" />
                        <circle
                          cx={sa.x}
                          cy={sa.y}
                          r={u(n ? 4.5 : 3.5)}
                          fill={n ? f.color : "var(--color-surface)"}
                          stroke={f.color}
                          strokeWidth={u(1.4)}
                        />
                        <text
                          x={sa.x}
                          y={sa.y - u(10)}
                          textAnchor="middle"
                          className="fill-ink-soft font-medium"
                          style={{ fontSize: u(11.5) }}
                        >
                          {s.label}
                          {n === 0 && (
                            <tspan className="fill-ink-faint font-normal">
                              {" "}
                              · soon
                            </tspan>
                          )}
                        </text>
                      </g>
                    );
                  })}

                  {/* Articles standing on the domain. */}
                  {perField(f.id).map((a) => {
                    const pa = P(a.p);
                    const base = shown ? P(SP[`${a.field}/${a.subfield}`]) : at;
                    const read = () => router.push(`/omniproof/${a.slug}`);
                    return (
                      <g
                        key={a.slug}
                        role="link"
                        tabIndex={0}
                        aria-label={`Read: ${a.title}`}
                        className="group cursor-pointer transition-opacity duration-500 outline-none"
                        style={{ opacity: inSub(a.field, a.subfield) ? 1 : 0.35 }}
                        onClick={read}
                        onKeyDown={(e) => e.key === "Enter" && read()}
                        onMouseEnter={() => setHover(a.field)}
                        onMouseLeave={() => setHover(null)}
                      >
                        <path
                          d={line(base, pa)}
                          stroke={f.color}
                          strokeWidth={u(1.5)}
                        />
                        <circle
                          cx={pa.x}
                          cy={pa.y}
                          r={u(12)}
                          fill={f.color}
                          fillOpacity={0.14}
                          className="omni-breathe"
                        />
                        <circle cx={pa.x} cy={pa.y} r={u(5.5)} fill={f.color} />
                        <text
                          x={pa.x}
                          y={pa.y - u(16)}
                          textAnchor="middle"
                          className="fill-ink group-hover:fill-brand-deep font-semibold"
                          style={{ fontSize: u(13) }}
                        >
                          {a.short} →
                        </text>
                      </g>
                    );
                  })}

                  {/* The domain itself. */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${f.label}: ${count} article${count === 1 ? "" : "s"}. Zoom in.`}
                    className="cursor-pointer outline-none"
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
                    <circle cx={at.x} cy={at.y} r={u(26)} fill="transparent" />
                    {arrivals[f.id] > 0 && (
                      <circle
                        cx={at.x}
                        cy={at.y}
                        r={r + u(7)}
                        fill={f.color}
                        fillOpacity={0.15}
                        className="omni-breathe"
                      />
                    )}
                    <circle
                      cx={at.x}
                      cy={at.y}
                      r={r}
                      fill={f.color}
                      stroke="var(--color-surface)"
                      strokeWidth={u(2)}
                    />
                    <text
                      x={at.x}
                      y={at.y + r + u(18)}
                      textAnchor="middle"
                      className="fill-ink font-semibold"
                      style={{ fontSize: u(15) }}
                    >
                      {f.label}
                    </text>
                    <text
                      x={at.x}
                      y={at.y + r + u(32)}
                      textAnchor="middle"
                      className="fill-ink-faint"
                      style={{ fontSize: u(10.5) }}
                    >
                      {count
                        ? `${count} page${count === 1 ? "" : "s"}`
                        : "in the works"}
                    </text>
                  </g>
                </g>
              );
            })}
          </>
        )}
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
          <ZoomButton label="Zoom in" icon={Plus} onClick={() => zoom(1.33)} />
          <ZoomButton
            label="Zoom out"
            icon={Minus}
            onClick={() => zoom(0.75)}
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
                No pages here yet.
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
            Drag to turn · click a domain to open it · pinch to zoom
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
