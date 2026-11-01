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
 * The Omniproof map, in 3D. The root (LLMs, with people) sits at the centre;
 * the six domains ring it, each opening outward into its subdomains, and the
 * articles hang off those. A dashed link runs straight from an article to
 * every other domain it lands in, through the space between, so a link never
 * has to route back round the map.
 *
 * Drag to turn it, pinch or ctrl + wheel (or the buttons) to zoom. Click a
 * domain and the camera turns and flies to it; click a subdomain to go in
 * again. The breadcrumb or Escape steps back out.
 *
 * No 3D library: every point is turned and projected in a few lines of maths
 * and drawn as one SVG in screen pixels, so words stay the same size at any
 * zoom. It only redraws while something moves. The slow idle turn runs while
 * the map is on screen and nobody is using it, and never under reduced
 * motion.
 */

type V = [number, number, number];
type Focus =
  | { level: 0 }
  | { level: 1; field: FieldId }
  | { level: 2; field: FieldId; sub: string };
type Cam = { yaw: number; pitch: number; zoom: number; pivot: V };
/** The container in pixels, and the size markers are drawn at. */
type View = { w: number; h: number; fit: number; px: number };

const R_DOMAIN = 300;
const SUB_OUT = 175;
const SUB_SPREAD = 80;
const ART_OUT = 125;
const ART_GAP = 24;
/** Camera distance: larger is flatter. */
const DEPTH = 2400;
const ZOOM: Record<Focus["level"], number> = { 0: 1, 1: 2.1, 2: 3.3 };

const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const len = (a: V) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V): V => mul(a, 1 / (len(a) || 1));
const cross = (a: V, b: V): V => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const mean = (ps: V[]): V =>
  mul(ps.reduce((s, p) => add(s, p), [0, 0, 0] as V), 1 / ps.length);

/** Domains round the root, alternately a little above and below. */
const DP = Object.fromEntries(
  FIELDS.map((f, i) => {
    const a = (i / FIELDS.length) * Math.PI * 2 - Math.PI / 2;
    return [
      f.id,
      [R_DOMAIN * Math.cos(a), (i % 2 ? 1 : -1) * 95, R_DOMAIN * Math.sin(a)],
    ];
  }),
) as Record<FieldId, V>;

/** Subdomains on a small circle, further out along their domain's line. */
const SP: Record<string, V> = Object.fromEntries(
  FIELDS.flatMap((f) => {
    const d = norm(DP[f.id]);
    const u1 = norm(cross(d, [0, 1, 0]));
    const u2 = cross(u1, d);
    const n = f.subfields.length;
    return f.subfields.map((s, k) => {
      const b = (k / n) * Math.PI * 2 + Math.PI / 4;
      const ring = add(
        mul(u1, Math.cos(b) * SUB_SPREAD),
        mul(u2, Math.sin(b) * SUB_SPREAD),
      );
      return [`${f.id}/${s.id}`, add(add(DP[f.id], mul(d, SUB_OUT)), ring)];
    });
  }),
);

/**
 * The turn that puts a point to the right of the pivot, angled a little
 * towards the viewer, so whatever grows outward from it spreads across the
 * screen instead of straight at the camera.
 */
function orient(p: V, tilt = 0.45) {
  const rho = Math.hypot(p[0], p[2]);
  const a = Math.min(rho, len(p) * Math.cos(tilt));
  const b = -Math.sqrt(Math.max(0, rho * rho - a * a));
  const yaw = Math.atan2(p[2], p[0]) - Math.atan2(b, a);
  return { yaw, pitch: Math.atan2(-p[1], -b) };
}

function project(p: V, cam: Cam, view: View) {
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

/** Far things fade: nearest at full strength, the far side at under half. */
const depth = (z: number) =>
  0.4 + 0.6 * Math.max(0, Math.min(1, (650 - z) / 1300));

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const turn = (from: number, to: number) =>
  ((((to - from + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) -
  Math.PI;

const START: Cam = { yaw: 0.5, pitch: -0.32, zoom: 1, pivot: [0, 0, 0] };

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

  // Where each article sits, and how many land in each domain from elsewhere.
  const { leaves, arrivals, perField, perSub } = useMemo(() => {
    const leaves = articles
      .filter((a) => SP[`${a.field}/${a.subfield}`] !== undefined)
      .map((a, _, all) => {
        const sibs = all.filter(
          (b) => b.field === a.field && b.subfield === a.subfield,
        );
        const k = sibs.indexOf(a);
        const sp = SP[`${a.field}/${a.subfield}`];
        const d = norm(sp);
        const side = norm(cross(d, [0, 1, 0]));
        return {
          ...a,
          p: add(
            add(sp, mul(d, ART_OUT)),
            mul(side, (k - (sibs.length - 1) / 2) * ART_GAP),
          ),
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
        flyTo({ ...START, yaw: camRef.current.yaw, zoom: ZOOM[0] });
        return;
      }
      const portrait = (viewRef.current?.w ?? 1) < (viewRef.current?.h ?? 1);
      if (next.level === 1) {
        const p = DP[next.field];
        const kids = fieldById(next.field).subfields.map(
          (s) => SP[`${next.field}/${s.id}`],
        );
        flyTo({
          ...orient(p),
          zoom: ZOOM[1] * (portrait ? 0.8 : 1),
          pivot: mean([p, ...kids]),
        });
        return;
      }
      const p = SP[`${next.field}/${next.sub}`];
      const kids = leaves
        .filter((a) => a.field === next.field && a.subfield === next.sub)
        .map((a) => a.p);
      flyTo({
        ...orient(p),
        zoom: ZOOM[2] * (portrait ? 0.8 : 1),
        pivot: mean([p, ...(kids.length ? kids : [add(p, mul(norm(p), 60))])]),
      });
    },
    [flyTo, leaves],
  );

  // Track the container's size; the whole map fits it at zoom 1.
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
        fit: Math.min(w / 1300, h / 1050),
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
      setCam({ ...c, yaw: c.yaw + dt * 0.00012 });
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
      setCam({ ...c, zoom: Math.min(6, Math.max(0.55, c.zoom * factor)) });
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
      yaw: c.yaw - dx * 0.007,
      pitch: Math.max(-1.45, Math.min(1.45, c.pitch + dy * 0.007)),
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

  // What is in focus decides what is bright; the rest steps back a little.
  const inField = (id: FieldId) =>
    focus.level === 0 ? hover === null || hover === id : focus.field === id;
  const inSub = (id: FieldId, sub: string) =>
    focus.level !== 2 ? inField(id) : focus.field === id && focus.sub === sub;
  const dim = (on: boolean) => (on ? 1 : focus.level === 0 ? 0.45 : 0.18);

  const v = view;
  const u = (n: number) => n * (v?.px ?? 1);
  const P = (p: V) => (v ? project(p, cam, v) : { x: 0, y: 0, z: 0, k: 1 });
  const root = P([0, 0, 0]);
  const domains = FIELDS.map((f) => ({ f, at: P(DP[f.id]) }));
  const subs = FIELDS.flatMap((f) =>
    f.subfields.map((s) => ({ f, s, at: P(SP[`${f.id}/${s.id}`]) })),
  );
  const subAt = Object.fromEntries(
    subs.map((x) => [`${x.f.id}/${x.s.id}`, x.at]),
  );
  const domAt = Object.fromEntries(domains.map((x) => [x.f.id, x.at]));
  const arts = leaves.map((a) => ({ a, at: P(a.p) }));
  const line = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const subLabels = (id: FieldId) =>
    cam.zoom >= 2.4 || hover === id || (focus.level !== 0 && focus.field === id);

  type Node =
    | { kind: "domain"; z: number; f: (typeof FIELDS)[number]; at: ReturnType<typeof P> }
    | { kind: "sub"; z: number; x: (typeof subs)[number] }
    | { kind: "art"; z: number; x: (typeof arts)[number] }
    | { kind: "root"; z: number };
  const nodes: Node[] = [
    { kind: "root" as const, z: root.z },
    ...domains.map((d) => ({ kind: "domain" as const, z: d.at.z, ...d })),
    ...subs.map((x) => ({ kind: "sub" as const, z: x.at.z, x })),
    ...arts.map((x) => ({ kind: "art" as const, z: x.at.z, x })),
  ].sort((a, b) => b.z - a.z);

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
        aria-label="Omniproof map, in 3D. LLMs at the centre branch into six domains, each domain into subdomains, each subdomain into articles; dashed links run from an article to the other domains it lands in."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <defs>
          <radialGradient id="omni-root-glow">
            <stop offset="0%" stopColor="#1fa5de" stopOpacity="0.22" />
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
            <circle
              cx={root.x}
              cy={root.y}
              r={u(130) * root.k}
              fill="url(#omni-root-glow)"
              className="omni-breathe"
            />

            {/* Root to domains, domains to subdomains, subdomains to articles. */}
            {domains.map(({ f, at }, i) => (
              <g
                key={f.id}
                style={{ opacity: dim(inField(f.id)) * depth(at.z) }}
                className="transition-opacity duration-500"
              >
                <path
                  d={line(root, at)}
                  pathLength={1}
                  fill="none"
                  stroke={f.color}
                  strokeWidth={u(2.25)}
                  className="omni-draw"
                  style={{ animationDelay: `${i * 90}ms` }}
                />
                {f.subfields.map((s) => {
                  const sa = subAt[`${f.id}/${s.id}`];
                  const n = perSub(f.id, s.id).length;
                  return (
                    <path
                      key={s.id}
                      d={line(at, sa)}
                      fill="none"
                      stroke={f.color}
                      strokeWidth={u(1.4)}
                      strokeOpacity={n ? 0.85 : 0.4}
                      strokeDasharray={n ? undefined : `${u(4)} ${u(5)}`}
                      style={{ opacity: inSub(f.id, s.id) ? 1 : 0.5 }}
                      className="omni-fade"
                    />
                  );
                })}
              </g>
            ))}
            {arts.map(({ a, at }) => {
              const f = fieldById(a.field);
              return (
                <path
                  key={a.slug}
                  d={line(subAt[`${a.field}/${a.subfield}`], at)}
                  fill="none"
                  stroke={f.color}
                  strokeWidth={u(1.75)}
                  style={{
                    opacity: dim(inSub(a.field, a.subfield)) * depth(at.z),
                  }}
                  className="omni-fade transition-opacity duration-500"
                />
              );
            })}

            {/* Landing links: straight across, bowed towards the centre. */}
            {leaves.map((a) =>
              a.lands.map((l) => {
                const to = fieldById(l.field);
                const from = P(a.p);
                const end = domAt[l.field];
                const c = P(mul(add(a.p, DP[l.field]), 0.32));
                const lit =
                  focus.level === 0
                    ? hover === null || hover === a.field || hover === l.field
                    : focus.field === a.field || focus.field === l.field;
                return (
                  <path
                    key={`${a.slug}-${l.field}`}
                    d={`M ${from.x} ${from.y} Q ${c.x} ${c.y} ${end.x} ${end.y}`}
                    fill="none"
                    stroke={to.color}
                    strokeWidth={u(1.5)}
                    strokeDasharray={`${u(5)} ${u(6)}`}
                    className="omni-fade omni-flow transition-opacity duration-500"
                    style={
                      {
                        opacity: (lit ? 0.85 : 0.25) * depth(c.z),
                        animationDelay: "900ms",
                        "--omni-flow": -u(22),
                      } as React.CSSProperties
                    }
                  />
                );
              }),
            )}

            {/* Nodes, far side first so near ones draw on top. */}
            {nodes.map((n) => {
              if (n.kind === "root")
                return (
                  <g
                    key="root"
                    role="button"
                    tabIndex={0}
                    aria-label="Show every domain"
                    className="cursor-pointer outline-none"
                    style={{ opacity: focus.level === 0 ? 1 : 0.55 }}
                    onClick={() => go({ level: 0 })}
                    onKeyDown={(e) => e.key === "Enter" && go({ level: 0 })}
                  >
                    <rect
                      x={root.x - u(48)}
                      y={root.y - u(30)}
                      width={u(96)}
                      height={u(60)}
                      rx={u(18)}
                      className="fill-ink"
                    />
                    <text
                      x={root.x}
                      y={root.y + u(4)}
                      textAnchor="middle"
                      className="fill-canvas font-semibold tracking-tight"
                      style={{ fontSize: u(22) }}
                    >
                      LLM
                    </text>
                    <text
                      x={root.x}
                      y={root.y + u(20)}
                      textAnchor="middle"
                      className="fill-canvas opacity-70"
                      style={{ fontSize: u(10) }}
                    >
                      + people
                    </text>
                  </g>
                );

              if (n.kind === "domain") {
                const { f, at } = n;
                const count = perField(f.id).length;
                const on = hover === f.id || focusField?.id === f.id;
                const r = u(8) * Math.sqrt(at.k);
                return (
                  <g
                    key={f.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${f.label}: ${count} article${count === 1 ? "" : "s"}. Zoom in.`}
                    className="cursor-pointer transition-opacity duration-500 outline-none"
                    style={{ opacity: dim(inField(f.id)) * depth(at.z) }}
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
                    {arrivals[f.id] > 0 && (
                      <circle
                        cx={at.x}
                        cy={at.y}
                        r={r + u(8)}
                        fill={f.color}
                        fillOpacity={0.14}
                        className="omni-breathe"
                      />
                    )}
                    <circle
                      cx={at.x}
                      cy={at.y}
                      r={r + u(4)}
                      fill={f.color}
                      fillOpacity={on ? 0.25 : 0}
                    />
                    <circle cx={at.x} cy={at.y} r={r} fill={f.color} />
                    <text
                      x={at.x + r + u(8)}
                      y={at.y + u(1)}
                      className="fill-ink font-medium"
                      style={{ fontSize: u(16) }}
                    >
                      {f.label}
                    </text>
                    <text
                      x={at.x + r + u(8)}
                      y={at.y + u(15)}
                      className="fill-ink-faint"
                      style={{ fontSize: u(10.5) }}
                    >
                      {count
                        ? `${count} piece${count === 1 ? "" : "s"}`
                        : "in the works"}{" "}
                      · {f.subfields.length} subdomains
                    </text>
                  </g>
                );
              }

              if (n.kind === "sub") {
                const { f, s, at } = n.x;
                const count = perSub(f.id, s.id).length;
                const open = () => go({ level: 2, field: f.id, sub: s.id });
                return (
                  <g
                    key={`${f.id}/${s.id}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${f.label}, ${s.label}: ${count} article${count === 1 ? "" : "s"}. Zoom in.`}
                    className="cursor-pointer transition-opacity duration-500 outline-none"
                    style={{
                      opacity: dim(inSub(f.id, s.id)) * depth(at.z),
                    }}
                    onClick={open}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        open();
                      }
                    }}
                  >
                    <circle cx={at.x} cy={at.y} r={u(12)} fill="transparent" />
                    <circle
                      cx={at.x}
                      cy={at.y}
                      r={u(count ? 4.5 : 3.5) * Math.sqrt(at.k)}
                      fill={count ? f.color : "transparent"}
                      stroke={f.color}
                      strokeWidth={u(1.4)}
                    />
                    {subLabels(f.id) && (
                      <text
                        x={at.x + u(10)}
                        y={at.y + u(4)}
                        className="fill-ink-soft font-medium"
                        style={{ fontSize: u(12) }}
                      >
                        {s.label}
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
                    )}
                  </g>
                );
              }

              const { a, at } = n.x;
              const f = fieldById(a.field);
              const open = () => router.push(`/omniproof/${a.slug}`);
              return (
                <g
                  key={a.slug}
                  role="link"
                  tabIndex={0}
                  aria-label={`Read: ${a.title}`}
                  className="group cursor-pointer transition-opacity duration-500 outline-none"
                  style={{
                    opacity: dim(inSub(a.field, a.subfield)) * depth(at.z),
                  }}
                  onClick={open}
                  onKeyDown={(e) => e.key === "Enter" && open()}
                  onMouseEnter={() => setHover(a.field)}
                  onMouseLeave={() => setHover(null)}
                >
                  <circle
                    cx={at.x}
                    cy={at.y}
                    r={u(12)}
                    fill={f.color}
                    fillOpacity={0.14}
                    className="omni-breathe"
                  />
                  <circle
                    cx={at.x}
                    cy={at.y}
                    r={u(5.5) * Math.sqrt(at.k)}
                    fill={f.color}
                  />
                  <text
                    x={at.x + u(15)}
                    y={at.y + u(4.5)}
                    className="fill-ink group-hover:fill-brand-deep font-semibold"
                    style={{ fontSize: u(13) }}
                  >
                    {a.short} →
                  </text>
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
            Drag to turn · click a domain to fly in · pinch to zoom
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
