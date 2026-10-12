"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A satellite intelligence hero, drawn live on a canvas with no photos and
 * no video. A pass over an icy harbour: green boxes lock onto the ships and
 * one ship's telemetry types itself out on a drop line. Then the camera
 * pulls back fast, with a zoom blur, until the harbour is one tile in a wall
 * of the planet (desert, coast, atolls, mountains, cities, fields, ice) where
 * changes keep being flagged, and dives back in. One loop is 14.4 seconds.
 *
 * Every tile is painted once at start from seeded random shapes, so the same
 * picture comes back on every visit. The HUD takes --s and the button --p.
 * Sound is off until the visitor turns it on, and is made on the spot with
 * the Web Audio API: a low drone, a tick per typed character, a chirp per
 * lock and a whoosh on each zoom.
 */

// ---------------------------------------------------------------------------
//  The world: a grid of tiles, one unit each, the harbour in the middle
// ---------------------------------------------------------------------------

const COLS = 17;
const ROWS = 11;
const GAP = 0.04;
const STEP = 1 + GAP;
const HOME_COL = Math.floor(COLS / 2);
const HOME_ROW = Math.floor(ROWS / 2);
const HOME = HOME_ROW * COLS + HOME_COL;
const HARBOUR_PX = 2048;
const TILE_PX = 320;

/** The loop, in seconds. */
const LOOP = 14.4;
const T = {
  boxes: 1.2,
  line: 3.0,
  type: 3.4,
  fade: 5.6,
  out: 6.2,
  hold: 8.4,
  back: 12.8,
};
const TYPE_SPEED = 34;

type Ship = {
  x: number;
  y: number;
  len: number;
  beam: number;
  hull: string;
  deck: string;
  flip?: boolean;
  angle?: number;
};

/** Ships in harbour-tile units (0 to 1), bow towards +x unless flipped. */
const SHIPS: Ship[] = [
  {
    x: 0.665,
    y: 0.6215,
    len: 0.13,
    beam: 0.019,
    hull: "#7a2a22",
    deck: "#4f524f",
  },
  {
    x: 0.52,
    y: 0.5795,
    len: 0.1,
    beam: 0.016,
    hull: "#24292d",
    deck: "#6b5a44",
    flip: true,
  },
  {
    x: 0.735,
    y: 0.4885,
    len: 0.12,
    beam: 0.018,
    hull: "#2d3a46",
    deck: "#5d6266",
  },
  {
    x: 0.575,
    y: 0.452,
    len: 0.09,
    beam: 0.015,
    hull: "#5a2c26",
    deck: "#6c6f70",
    flip: true,
  },
  {
    x: 0.615,
    y: 0.7485,
    len: 0.11,
    beam: 0.017,
    hull: "#1f2c38",
    deck: "#7b6a50",
  },
  {
    x: 0.445,
    y: 0.7135,
    len: 0.07,
    beam: 0.012,
    hull: "#2e3236",
    deck: "#8a8f90",
    flip: true,
  },
  {
    x: 0.88,
    y: 0.655,
    len: 0.032,
    beam: 0.009,
    hull: "#b8462e",
    deck: "#d9d4c8",
    angle: 0.5,
  },
];
const PIERS = [
  { y: 0.47, x0: 0.28, x1: 0.83 },
  { y: 0.6, x0: 0.28, x1: 0.87 },
  { y: 0.73, x0: 0.28, x1: 0.79 },
];
/** Which ships get boxed, in order; the first gets the telemetry. */
const TARGETS = [0, 1, 4, 6, 2];
const TELEMETRY = [
  "ID: 41-0927",
  "LEN: 118M",
  "BEAM: 013M",
  "HDG: 235",
  "CLASS: GEN CARGO",
];
const TELEMETRY_CHARS = TELEMETRY.reduce((n, l) => n + l.length, 0);

// ---------------------------------------------------------------------------
//  Painting helpers
// ---------------------------------------------------------------------------

type Rand = () => number;
type RGB = [number, number, number];
type Ctx = CanvasRenderingContext2D;

function seeded(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rgba = ([r, g, b]: RGB, a = 1) => `rgba(${r},${g},${b},${a})`;
const pick = <X,>(r: Rand, list: X[]) => list[Math.floor(r() * list.length)];

function canvas(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

/**
 * Soft blotches of one colour: a few random pixels, stretched over the tile
 * with smoothing on. Layered at a few scales it reads as terrain.
 */
function mottle(
  ctx: Ctx,
  s: number,
  r: Rand,
  color: RGB,
  alpha: number,
  cells: number,
) {
  const small = canvas(cells);
  const sctx = small.getContext("2d")!;
  const img = sctx.createImageData(cells, cells);
  for (let i = 0; i < cells * cells; i++) {
    img.data.set([color[0], color[1], color[2], Math.floor(r() * 255)], i * 4);
  }
  sctx.putImageData(img, 0, 0);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.globalAlpha = alpha;
  const pad = s / cells;
  ctx.drawImage(small, -pad, -pad, s + 2 * pad, s + 2 * pad);
  ctx.restore();
}

let grainCanvas: HTMLCanvasElement | null = null;
/** Sensor grain over everything, so flat fills do not look drawn. */
function grain(ctx: Ctx, s: number, alpha: number) {
  if (!grainCanvas) {
    grainCanvas = canvas(128);
    const g = grainCanvas.getContext("2d")!;
    const img = g.createImageData(128, 128);
    const r = seeded(7);
    for (let i = 0; i < 128 * 128; i++) {
      const v = Math.floor(r() * 255);
      img.data.set([v, v, v, 255], i * 4);
    }
    g.putImageData(img, 0, 0);
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = ctx.createPattern(grainCanvas, "repeat")!;
  ctx.fillRect(0, 0, s, s);
  ctx.restore();
}

/** A wandering line across the tile, as points. */
function wander(
  r: Rand,
  s: number,
  x: number,
  y: number,
  angle: number,
  steps: number,
  stride: number,
  turn: number,
) {
  const pts: [number, number][] = [[x, y]];
  for (let i = 0; i < steps; i++) {
    angle += (r() - 0.5) * turn;
    x += Math.cos(angle) * stride;
    y += Math.sin(angle) * stride;
    pts.push([x, y]);
    if (x < -s * 0.2 || x > s * 1.2 || y < -s * 0.2 || y > s * 1.2) break;
  }
  return pts;
}

function strokePts(ctx: Ctx, pts: [number, number][]) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

/** A jagged line from one edge to the other (midpoint displacement). */
function jagged(
  r: Rand,
  a: [number, number],
  b: [number, number],
  rough: number,
  depth = 7,
) {
  let pts = [a, b];
  for (let d = 0; d < depth; d++) {
    const next: [number, number][] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const len = Math.hypot(x2 - x1, y2 - y1);
      const off = (r() - 0.5) * len * rough;
      next.push(pts[i], [
        (x1 + x2) / 2 - ((y2 - y1) / len) * off,
        (y1 + y2) / 2 + ((x2 - x1) / len) * off,
      ]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}

function clouds(ctx: Ctx, s: number, r: Rand) {
  const n = 4 + Math.floor(r() * 6);
  for (let i = 0; i < n; i++) {
    const x = r() * s;
    const y = r() * s;
    const rad = s * (0.08 + r() * 0.2);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, "rgba(245,247,250,0.85)");
    g.addColorStop(1, "rgba(245,247,250,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
}

// ---------------------------------------------------------------------------
//  The tiles
// ---------------------------------------------------------------------------

type Painter = (ctx: Ctx, s: number, r: Rand) => void;

const desert: Painter = (ctx, s, r) => {
  ctx.fillStyle = rgba([188 + r() * 20, 150 + r() * 16, 100 + r() * 12] as RGB);
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [140, 100, 62], 0.45, 5);
  mottle(ctx, s, r, [232, 202, 152], 0.35, 11);
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate(r() * Math.PI);
  const rows = 18 + Math.floor(r() * 14);
  const f = 0.02 + r() * 0.03;
  for (let i = 0; i < rows; i++) {
    const base = -s * 0.75 + (i / rows) * s * 1.5 + (r() - 0.5) * 8;
    const ph = r() * 6;
    const amp = 4 + r() * 9;
    const pts: [number, number][] = [];
    for (let x = -s * 0.75; x <= s * 0.75; x += 6) {
      pts.push([
        x,
        base + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.7) * amp * 0.3,
      ]);
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(110,76,44,0.35)";
    strokePts(
      ctx,
      pts.map(([x, y]) => [x + 2, y + 2.5]),
    );
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(246,224,182,0.6)";
    strokePts(ctx, pts);
  }
  ctx.restore();
};

const coast: Painter = (ctx, s, r) => {
  ctx.fillStyle = rgba(
    pick(r, [
      [92, 104, 66],
      [118, 112, 78],
      [74, 92, 58],
    ] as RGB[]),
  );
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [52, 66, 40], 0.5, 9);
  mottle(ctx, s, r, [150, 140, 100], 0.3, 17);
  // Fields and a town on the land.
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = rgba(
      pick(r, [
        [110, 130, 70],
        [150, 140, 90],
        [90, 110, 60],
        [170, 160, 140],
      ] as RGB[]),
      0.55,
    );
    ctx.fillRect(r() * s, r() * s, 8 + r() * 26, 6 + r() * 20);
  }
  const a = r() * Math.PI * 2;
  const c = Math.cos(a);
  const d = Math.sin(a);
  const line = jagged(
    r,
    [s / 2 - c * s, s / 2 - d * s],
    [s / 2 + c * s, s / 2 + d * s],
    0.55,
  );
  const sea = new Path2D();
  line.forEach(([x, y], i) => (i ? sea.lineTo(x, y) : sea.moveTo(x, y)));
  sea.lineTo(s / 2 + c * s - d * s * 2, s / 2 + d * s + c * s * 2);
  sea.lineTo(s / 2 - c * s - d * s * 2, s / 2 - d * s + c * s * 2);
  sea.closePath();
  ctx.save();
  ctx.clip(sea);
  ctx.fillStyle = "rgb(14,50,82)";
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [24, 74, 110], 0.6, 7);
  ctx.lineJoin = "round";
  for (const [w, al] of [
    [70, 0.18],
    [44, 0.22],
    [24, 0.3],
    [10, 0.4],
  ]) {
    ctx.lineWidth = w;
    ctx.strokeStyle = `rgba(64,168,170,${al})`;
    strokePts(ctx, line);
  }
  ctx.restore();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = "rgba(222,206,160,0.9)";
  strokePts(ctx, line);
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  strokePts(ctx, line);
};

const atoll: Painter = (ctx, s, r) => {
  ctx.fillStyle = "rgb(9,42,86)";
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [18, 72, 124], 0.6, 6);
  const cx = s * (0.4 + r() * 0.2);
  const cy = s * (0.4 + r() * 0.2);
  const rx = s * (0.22 + r() * 0.12);
  const ry = s * (0.16 + r() * 0.12);
  const rot = r() * Math.PI;
  const ring = (w: number, color: string, from = 0, to = Math.PI * 2) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, from, to);
    ctx.lineWidth = w;
    ctx.strokeStyle = color;
    ctx.stroke();
  };
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(76,190,196,0.5)";
  ctx.fill();
  ring(38, "rgba(50,150,170,0.35)");
  ring(22, "rgba(92,214,206,0.65)");
  ring(9, "rgba(178,236,226,0.8)");
  ring(1.5, "rgba(255,255,255,0.5)");
  for (let i = 0; i < 9; i++) {
    const from = r() * Math.PI * 2;
    const to = from + 0.15 + r() * 0.5;
    ring(7, "rgba(232,222,186,1)", from, to);
    ring(3.5, "rgba(64,120,58,1)", from + 0.03, to - 0.03);
  }
};

const mountains: Painter = (ctx, s, r) => {
  ctx.fillStyle = rgba(
    pick(r, [
      [112, 98, 82],
      [96, 92, 86],
      [124, 104, 80],
    ] as RGB[]),
  );
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [60, 50, 40], 0.55, 6);
  mottle(ctx, s, r, [170, 156, 136], 0.35, 13);
  mottle(ctx, s, r, [70, 90, 56], 0.3, 9);
  ctx.lineCap = "round";
  for (let i = 0; i < 26; i++) {
    const pts = wander(r, s, r() * s, r() * s, r() * Math.PI * 2, 40, 6, 0.9);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(40,32,26,0.55)";
    strokePts(
      ctx,
      pts.map(([x, y]) => [x + 2, y + 2]),
    );
    ctx.lineWidth = 1.6;
    ctx.strokeStyle =
      i % 3 ? "rgba(206,196,180,0.5)" : "rgba(250,252,255,0.85)";
    strokePts(ctx, pts);
  }
  if (r() < 0.6) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(60,96,110,0.8)";
    strokePts(ctx, wander(r, s, 0, r() * s, 0, 80, 6, 0.6));
  }
};

const urban: Painter = (ctx, s, r) => {
  ctx.fillStyle = "rgb(74,76,80)";
  ctx.fillRect(0, 0, s, s);
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate((r() - 0.5) * 0.8);
  const block = 18 + r() * 12;
  const roofs: RGB[] = [
    [132, 134, 138],
    [168, 162, 150],
    [96, 100, 108],
    [150, 86, 60],
    [190, 186, 178],
    [118, 112, 104],
  ];
  for (let bx = -s; bx < s; bx += block) {
    for (let by = -s; by < s; by += block) {
      const w = block - 4;
      if (r() < 0.07) {
        ctx.fillStyle = "rgb(66,104,58)";
        ctx.fillRect(bx + 2, by + 2, w, w);
        continue;
      }
      const n = 1 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const bw = w / n;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(bx + 2 + k * bw + 1.5, by + 3.5, bw - 1, w - 1);
        ctx.fillStyle = rgba(pick(r, roofs));
        ctx.fillRect(bx + 2 + k * bw, by + 2, bw - 1, w - 1);
      }
    }
  }
  ctx.strokeStyle = "rgba(170,168,160,0.8)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const p = (r() - 0.5) * s;
    strokePts(
      ctx,
      i % 2
        ? [
            [p, -s],
            [p, s],
          ]
        : [
            [-s, p],
            [s, p],
          ],
    );
  }
  ctx.restore();
  if (r() < 0.4) {
    ctx.lineWidth = 12;
    ctx.strokeStyle = "rgb(38,66,76)";
    strokePts(ctx, wander(r, s, 0, r() * s, 0.3, 60, 8, 0.4));
  }
  mottle(ctx, s, r, [40, 40, 44], 0.3, 7);
};

const farmland: Painter = (ctx, s, r) => {
  ctx.fillStyle = "rgb(120,124,82)";
  ctx.fillRect(0, 0, s, s);
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate((r() - 0.5) * 0.9);
  const crops: RGB[] = [
    [100, 136, 62],
    [146, 158, 80],
    [190, 168, 92],
    [128, 98, 70],
    [78, 116, 58],
    [168, 148, 108],
    [206, 188, 120],
  ];
  for (let y = -s; y < s;) {
    const h = 14 + r() * 34;
    for (let x = -s; x < s;) {
      const w = 16 + r() * 50;
      ctx.fillStyle = rgba(pick(r, crops));
      ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
      if (r() < 0.4) {
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = 1;
        for (let k = x + 3; k < x + w - 2; k += 3)
          strokePts(ctx, [
            [k, y + 2],
            [k, y + h - 2],
          ]);
      }
      x += w;
    }
    y += h;
  }
  ctx.restore();
  for (let i = 0; i < 1 + Math.floor(r() * 4); i++) {
    const x = r() * s;
    const y = r() * s;
    const rad = 16 + r() * 22;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(122,96,66)";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, rad, r() * 6, r() * 6 + 3 + r() * 3);
    ctx.fillStyle = "rgb(84,132,58)";
    ctx.fill();
  }
  mottle(ctx, s, r, [60, 60, 40], 0.25, 6);
};

const forest: Painter = (ctx, s, r) => {
  ctx.fillStyle = "rgb(32,62,38)";
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [16, 38, 22], 0.6, 12);
  mottle(ctx, s, r, [64, 100, 54], 0.45, 26);
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = r() < 0.5 ? "rgba(12,30,16,0.45)" : "rgba(84,124,66,0.4)";
    ctx.beginPath();
    ctx.arc(r() * s, r() * s, 0.8 + r() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  const river = wander(r, s, 0, r() * s, (r() - 0.5) * 0.6, 90, 6, 0.7);
  ctx.lineCap = ctx.lineJoin = "round";
  ctx.lineWidth = 9;
  ctx.strokeStyle = "rgba(170,150,110,0.6)";
  strokePts(ctx, river);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgb(56,86,84)";
  strokePts(ctx, river);
};

const ice: Painter = (ctx, s, r) => {
  ctx.fillStyle = "rgb(212,222,230)";
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [160, 182, 200], 0.55, 6);
  mottle(ctx, s, r, [246, 248, 250], 0.5, 14);
  const a = r() * Math.PI;
  ctx.strokeStyle = "rgba(84,104,126,0.55)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const x = r() * s;
    const y = r() * s;
    const l = 6 + r() * 20;
    strokePts(ctx, [
      [x, y],
      [x + Math.cos(a) * l, y + Math.sin(a) * l],
    ]);
  }
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    ctx.ellipse(
      r() * s,
      r() * s,
      2 + r() * 7,
      1.5 + r() * 4,
      r() * 3,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(76,160,206,0.75)";
    ctx.fill();
  }
};

const delta: Painter = (ctx, s, r) => {
  ctx.fillStyle = "rgb(108,104,72)";
  ctx.fillRect(0, 0, s, s);
  mottle(ctx, s, r, [70, 100, 56], 0.55, 10);
  ctx.lineCap = ctx.lineJoin = "round";
  const branch = (
    x: number,
    y: number,
    a: number,
    w: number,
    depth: number,
  ) => {
    const pts = wander(r, s, x, y, a, 14 + Math.floor(r() * 10), 7, 0.5);
    ctx.lineWidth = w;
    ctx.strokeStyle = "rgb(66,92,92)";
    strokePts(ctx, pts);
    if (depth < 4) {
      for (let k = 0; k < 2; k++) {
        const [px, py] = pts[pts.length - 1];
        branch(
          px,
          py,
          a + (k ? 0.5 : -0.5) + (r() - 0.5) * 0.4,
          Math.max(1.2, w * 0.7),
          depth + 1,
        );
      }
    }
  };
  branch(s * (0.3 + r() * 0.4), -4, Math.PI / 2, 9, 0);
};

const PAINTERS: Painter[] = [
  desert,
  desert,
  coast,
  coast,
  atoll,
  mountains,
  mountains,
  urban,
  urban,
  farmland,
  farmland,
  forest,
  ice,
  delta,
];

function paintTile(index: number) {
  const c = canvas(TILE_PX);
  const ctx = c.getContext("2d")!;
  const r = seeded(index * 977 + 13);
  pick(r, PAINTERS)(ctx, TILE_PX, r);
  if (r() < 0.22) clouds(ctx, TILE_PX, r);
  ctx.fillStyle = `rgba(0,0,0,${r() * 0.18})`;
  ctx.fillRect(0, 0, TILE_PX, TILE_PX);
  grain(ctx, TILE_PX, 0.18);
  return c;
}

// ---------------------------------------------------------------------------
//  The harbour, painted large so it holds up full screen
// ---------------------------------------------------------------------------

function hullPath(ctx: Ctx, L: number, B: number) {
  ctx.beginPath();
  ctx.moveTo(-L / 2 + B * 0.15, -B / 2);
  ctx.lineTo(L / 2 - B * 1.3, -B / 2);
  ctx.quadraticCurveTo(L / 2 - B * 0.2, -B / 2, L / 2, 0);
  ctx.quadraticCurveTo(L / 2 - B * 0.2, B / 2, L / 2 - B * 1.3, B / 2);
  ctx.lineTo(-L / 2 + B * 0.15, B / 2);
  ctx.quadraticCurveTo(-L / 2, B / 2, -L / 2, B * 0.3);
  ctx.lineTo(-L / 2, -B * 0.3);
  ctx.quadraticCurveTo(-L / 2, -B / 2, -L / 2 + B * 0.15, -B / 2);
  ctx.closePath();
}

function drawShip(ctx: Ctx, ship: Ship, P: number, r: Rand) {
  const L = ship.len * P;
  const B = ship.beam * P;
  ctx.save();
  ctx.translate(ship.x * P, ship.y * P);
  if (ship.angle) ctx.rotate(ship.angle);
  if (ship.flip) ctx.scale(-1, 1);
  // Shadow falls down and to the right, from a low winter sun.
  ctx.save();
  ctx.translate(B * 0.25 * (ship.flip ? -1 : 1), B * 0.45);
  hullPath(ctx, L, B);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fill();
  ctx.restore();
  hullPath(ctx, L, B);
  ctx.fillStyle = ship.hull;
  ctx.fill();
  ctx.save();
  ctx.scale(0.93, 0.74);
  hullPath(ctx, L, B);
  ctx.fillStyle = ship.deck;
  ctx.fill();
  ctx.restore();
  if (ship.len > 0.05) {
    // Hatch covers, then the bridge at the stern.
    const holds = 3 + Math.floor(ship.len * 30);
    const start = -L * 0.3;
    const span = L * 0.62;
    for (let i = 0; i < holds; i++) {
      const w = (span / holds) * 0.82;
      ctx.fillStyle =
        r() < 0.5 ? "rgba(40,44,46,0.75)" : "rgba(120,124,118,0.7)";
      ctx.fillRect(start + (i * span) / holds, -B * 0.28, w, B * 0.56);
    }
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(-L * 0.44 + B * 0.2, -B * 0.32 + B * 0.25, L * 0.11, B * 0.66);
    ctx.fillStyle = "#e9ecec";
    ctx.fillRect(-L * 0.44, -B * 0.34, L * 0.11, B * 0.68);
    ctx.fillStyle = "#b9bfc1";
    ctx.fillRect(-L * 0.42, -B * 0.2, L * 0.05, B * 0.4);
  } else {
    ctx.fillStyle = "#f2f1ec";
    ctx.fillRect(-L * 0.1, -B * 0.25, L * 0.3, B * 0.5);
  }
  ctx.restore();
}

/** How much ice there is at a point: open water by the ships and out the channel. */
function iceAt(x: number, y: number, n: number) {
  let d = 0.35 + n * 0.75;
  for (const s of SHIPS) {
    const dx = Math.max(0, Math.abs(x - s.x) - s.len / 2);
    const dy = Math.max(0, Math.abs(y - s.y) - s.beam / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < 0.03) d -= (0.03 - dist) * 26;
  }
  const lane = Math.abs(y - (0.6 + (x - 0.85) * 1.6));
  if (x > 0.8 && lane < 0.07) d -= (0.07 - lane) * 12;
  return d;
}

function paintHarbour() {
  const P = HARBOUR_PX;
  const c = canvas(P);
  const ctx = c.getContext("2d")!;
  const r = seeded(4127);

  // Dark, cold water.
  ctx.fillStyle = "rgb(16,34,42)";
  ctx.fillRect(0, 0, P, P);
  mottle(ctx, P, r, [26, 54, 64], 0.7, 8);
  mottle(ctx, P, r, [8, 20, 26], 0.5, 19);

  // A coarse density field for the ice, from a small random grid.
  const N = 24;
  const field = Array.from({ length: (N + 1) * (N + 1) }, () => r());
  const noise = (x: number, y: number) => {
    const fx = x * N;
    const fy = y * N;
    const ix = Math.min(N - 1, Math.max(0, Math.floor(fx)));
    const iy = Math.min(N - 1, Math.max(0, Math.floor(fy)));
    const tx = fx - ix;
    const ty = fy - iy;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const at = (i: number, j: number) => field[j * (N + 1) + i];
    const top = at(ix, iy) + (at(ix + 1, iy) - at(ix, iy)) * sx;
    const bottom = at(ix, iy + 1) + (at(ix + 1, iy + 1) - at(ix, iy + 1)) * sx;
    return top + (bottom - top) * sy;
  };

  // Brash ice: a haze of tiny chips, then floes.
  for (let i = 0; i < 110000; i++) {
    const x = r();
    const y = r();
    if (r() > iceAt(x, y, noise(x, y))) continue;
    ctx.fillStyle = `rgba(${200 + r() * 40},${210 + r() * 35},${218 + r() * 30},${0.25 + r() * 0.4})`;
    const sz = 1 + r() * 2;
    ctx.fillRect(x * P, y * P, sz, sz);
  }
  for (let i = 0; i < 11000; i++) {
    const x = r();
    const y = r();
    if (r() * 1.3 > iceAt(x, y, noise(x, y))) continue;
    const rad = (0.0012 + r() ** 2 * 0.0075) * P;
    const sides = 5 + Math.floor(r() * 3);
    const rot = r() * 6;
    ctx.beginPath();
    for (let k = 0; k < sides; k++) {
      const a = rot + (k / sides) * Math.PI * 2;
      const rr = rad * (0.6 + r() * 0.5);
      const px = x * P + Math.cos(a) * rr;
      const py = y * P + Math.sin(a) * rr;
      if (k) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.save();
    ctx.translate(rad * 0.15, rad * 0.2);
    ctx.fill();
    ctx.restore();
    const v = 205 + r() * 45;
    ctx.fillStyle = `rgba(${v - 8},${v},${Math.min(255, v + 8)},${0.65 + r() * 0.35})`;
    ctx.fill();
  }

  // Land: a snowy shore along the top and the left.
  const top = jagged(r, [P * 1.05, P * 0.31], [P * 0.31, P * 0.37], 0.18, 6);
  const left = jagged(r, [P * 0.31, P * 0.37], [P * 0.27, P * 1.05], 0.12, 6);
  const shore = [...top, ...left.slice(1)];
  const land = new Path2D();
  land.moveTo(-10, -10);
  land.lineTo(P + 10, -10);
  shore.forEach(([x, y]) => land.lineTo(x, y));
  land.lineTo(-10, P + 10);
  land.closePath();
  ctx.save();
  ctx.clip(land);
  ctx.fillStyle = "rgb(222,228,232)";
  ctx.fillRect(0, 0, P, P);
  mottle(ctx, P, r, [168, 178, 186], 0.6, 10);
  mottle(ctx, P, r, [250, 251, 252], 0.5, 31);
  // Roads.
  ctx.strokeStyle = "rgba(62,68,74,0.85)";
  ctx.lineCap = "round";
  for (const [w, pts] of [
    [
      P * 0.007,
      [
        [0, P * 0.2],
        [P, P * 0.17],
      ],
    ],
    [
      P * 0.006,
      [
        [P * 0.16, 0],
        [P * 0.19, P],
      ],
    ],
    [
      P * 0.004,
      [
        [0, P * 0.55],
        [P * 0.24, P * 0.5],
      ],
    ],
    [
      P * 0.004,
      [
        [P * 0.5, 0],
        [P * 0.55, P * 0.3],
      ],
    ],
    [
      P * 0.004,
      [
        [P * 0.8, 0],
        [P * 0.82, P * 0.3],
      ],
    ],
  ] as [number, [number, number][]][]) {
    ctx.lineWidth = w;
    strokePts(ctx, pts);
  }
  // Sheds and warehouses, with shadows.
  for (let i = 0; i < 70; i++) {
    const inTop = r() < 0.55;
    const x = inTop ? P * (0.22 + r() * 0.75) : P * (0.01 + r() * 0.24);
    const y = inTop ? P * (0.01 + r() * 0.26) : P * (0.24 + r() * 0.74);
    const w = P * (0.012 + r() * 0.04);
    const h = P * (0.008 + r() * 0.025);
    ctx.fillStyle = "rgba(20,26,30,0.45)";
    ctx.fillRect(x + w * 0.12, y + h * 0.35, w, h);
    ctx.fillStyle = rgba(
      pick(r, [
        [150, 156, 160],
        [118, 124, 130],
        [196, 200, 202],
        [98, 70, 58],
        [70, 84, 96],
      ] as RGB[]),
    );
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(x, y, w, h * 0.45);
  }
  // Tanks.
  for (let i = 0; i < 9; i++) {
    const x = P * (0.6 + (i % 3) * 0.035);
    const y = P * (0.06 + Math.floor(i / 3) * 0.04);
    const rad = P * 0.013;
    ctx.beginPath();
    ctx.arc(x + rad * 0.3, y + rad * 0.4, rad, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(20,26,30,0.5)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = "#e3e6e6";
    ctx.fill();
    ctx.strokeStyle = "rgba(120,126,130,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Containers stacked along the quay, in rows of colour.
  const boxes: RGB[] = [
    [176, 64, 44],
    [44, 92, 140],
    [60, 122, 76],
    [204, 160, 40],
    [150, 150, 150],
    [120, 40, 40],
    [38, 60, 92],
  ];
  for (let row = 0; row < 14; row++) {
    for (let k = 0; k < 22; k++) {
      if (r() < 0.12) continue;
      const x = P * (0.05 + (row % 2) * 0.1 + (row > 7 ? 0.01 : 0));
      const y = P * (0.42 + (row % 7) * 0.06);
      const bx = x + (k % 11) * P * 0.0085;
      const by = y + Math.floor(k / 11) * P * 0.016;
      ctx.fillStyle = rgba(pick(r, boxes));
      ctx.fillRect(bx, by, P * 0.0075, P * 0.014);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(bx, by + P * 0.012, P * 0.0075, P * 0.002);
    }
  }
  ctx.restore();

  // The quay edge.
  ctx.lineJoin = "round";
  ctx.lineWidth = P * 0.009;
  ctx.strokeStyle = "rgb(150,156,160)";
  strokePts(ctx, shore);
  ctx.lineWidth = P * 0.002;
  ctx.strokeStyle = "rgba(20,24,28,0.6)";
  strokePts(
    ctx,
    shore.map(([x, y]) => [x + P * 0.004, y + P * 0.004]),
  );

  // Piers, then the ships moored along them.
  for (const pier of PIERS) {
    const w = 0.016 * P;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(
      pier.x0 * P + w * 0.3,
      pier.y * P - w / 2 + w * 0.5,
      (pier.x1 - pier.x0) * P,
      w,
    );
    ctx.fillStyle = "rgb(146,152,156)";
    ctx.fillRect(pier.x0 * P, pier.y * P - w / 2, (pier.x1 - pier.x0) * P, w);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(
      pier.x0 * P,
      pier.y * P - w / 2,
      (pier.x1 - pier.x0) * P,
      w * 0.3,
    );
    for (let x = pier.x0 + 0.02; x < pier.x1; x += 0.025) {
      ctx.fillStyle = "rgba(40,44,48,0.8)";
      ctx.fillRect(x * P, pier.y * P - w * 0.15, P * 0.004, w * 0.3);
    }
  }
  // The tug's wake, behind it.
  const tug = SHIPS[6];
  ctx.save();
  ctx.translate(tug.x * P, tug.y * P);
  ctx.rotate(tug.angle ?? 0);
  ctx.strokeStyle = "rgba(230,240,244,0.55)";
  ctx.lineWidth = P * 0.002;
  for (const side of [-1, 1]) {
    strokePts(ctx, [
      [-tug.len * P * 0.4, 0],
      [-tug.len * P * 2.4, side * tug.len * P * 0.9],
    ]);
  }
  ctx.lineWidth = P * 0.005;
  ctx.strokeStyle = "rgba(230,240,244,0.3)";
  strokePts(ctx, [
    [-tug.len * P * 0.5, 0],
    [-tug.len * P * 2.6, 0],
  ]);
  ctx.restore();
  for (const ship of SHIPS) drawShip(ctx, ship, P, r);

  grain(ctx, P, 0.14);
  return c;
}

// ---------------------------------------------------------------------------
//  Sound, made on the spot
// ---------------------------------------------------------------------------

type Sound = {
  tick: () => void;
  lock: (pitch?: number) => void;
  whoosh: (seconds: number, inwards: boolean) => void;
  stop: () => void;
};

function createSound(): Sound | null {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  const ac = new Ctor();
  const master = ac.createGain();
  master.gain.setValueAtTime(0, ac.currentTime);
  master.gain.linearRampToValueAtTime(0.8, ac.currentTime + 0.8);
  master.connect(ac.destination);

  // A low drone under everything, its filter slowly breathing.
  const lowpass = ac.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 340;
  lowpass.Q.value = 5;
  const drone = ac.createGain();
  drone.gain.value = 0.05;
  lowpass.connect(drone).connect(master);
  const sources: AudioScheduledSourceNode[] = [];
  for (const f of [55, 55.4, 82.6]) {
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.connect(lowpass);
    o.start();
    sources.push(o);
  }
  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.08;
  const depth = ac.createGain();
  depth.gain.value = 160;
  lfo.connect(depth).connect(lowpass.frequency);
  lfo.start();
  sources.push(lfo);

  const noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const blip = (
    type: OscillatorType,
    from: number,
    to: number,
    length: number,
    level: number,
  ) => {
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(from, now);
    o.frequency.exponentialRampToValueAtTime(to, now + length);
    g.gain.setValueAtTime(level, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + length);
    o.connect(g).connect(master);
    o.start(now);
    o.stop(now + length + 0.02);
  };

  return {
    tick: () => blip("square", 2200, 1800, 0.025, 0.018),
    lock: (pitch = 1) => blip("sine", 700 * pitch, 1400 * pitch, 0.09, 0.06),
    whoosh: (seconds, inwards) => {
      const now = ac.currentTime;
      const src = ac.createBufferSource();
      src.buffer = noise;
      src.loop = true;
      const band = ac.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 1.2;
      band.frequency.setValueAtTime(inwards ? 2600 : 260, now);
      band.frequency.exponentialRampToValueAtTime(
        inwards ? 260 : 2600,
        now + seconds,
      );
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.22, now + seconds * 0.5);
      g.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
      src.connect(band).connect(g).connect(master);
      src.start(now);
      src.stop(now + seconds + 0.05);
    },
    stop: () => {
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setValueAtTime(master.gain.value, ac.currentTime);
      master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3);
      window.setTimeout(() => {
        sources.forEach((s) => s.stop());
        void ac.close();
      }, 400);
    },
  };
}

// ---------------------------------------------------------------------------
//  The camera and the HUD
// ---------------------------------------------------------------------------

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const easeInOut = (u: number) =>
  u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
const easeSpeed = (u: number) =>
  (u < 0.5 ? 12 * u * u : 3 * (-2 * u + 2) ** 2) / 3;
const easeOutBack = (u: number) => 1 + 2.4 * (u - 1) ** 3 + 1.4 * (u - 1) ** 2;

/** Where the camera looks at time t, how close, and how hard it is moving. */
function cameraAt(t: number, W: number, H: number) {
  const focusX = HOME_COL * STEP + 0.6;
  const focusY = HOME_ROW * STEP + 0.58;
  const gridX = (COLS * STEP - GAP) / 2;
  const gridY = (ROWS * STEP - GAP) / 2;
  const close = Math.max(W, H) * 1.35;
  // Far enough out that a dozen tiles cross the hero, never so far the grid ends.
  const far = Math.max(W / 12.5, H / 7.2);
  const zoom = (a: number, b: number, u: number) =>
    Math.exp(lerp(Math.log(a), Math.log(b), u));

  if (t < T.out) {
    return {
      x: focusX,
      y: focusY,
      z: close * (1 + 0.05 * (t / T.out)),
      blur: 0,
    };
  }
  if (t < T.hold) {
    const u = (t - T.out) / (T.hold - T.out);
    const e = easeInOut(u);
    return {
      x: lerp(focusX, gridX, e),
      y: lerp(focusY, gridY, e),
      z: zoom(close * 1.05, far, e),
      blur: easeSpeed(u),
    };
  }
  if (t < T.back) {
    const s = Math.sin(Math.PI * ((t - T.hold) / (T.back - T.hold)));
    return {
      x: gridX + 0.3 * s,
      y: gridY - 0.12 * s,
      z: far * (1 - 0.03 * s),
      blur: 0,
    };
  }
  const u = (t - T.back) / (LOOP - T.back);
  const e = easeInOut(u);
  return {
    x: lerp(gridX, focusX, e),
    y: lerp(gridY, focusY, e),
    z: zoom(far, close, e),
    blur: easeSpeed(u),
  };
}

/** Change detections flagged across the grid while it holds. */
const FLAGS = (() => {
  const r = seeded(31);
  return Array.from({ length: 14 }, (_, i) => {
    let tile = HOME;
    while (tile === HOME) {
      const col = HOME_COL + Math.round((r() - 0.5) * 11);
      const row = HOME_ROW + Math.round((r() - 0.5) * 6);
      tile = row * COLS + col;
    }
    return {
      tile,
      x: 0.2 + r() * 0.5,
      y: 0.2 + r() * 0.5,
      size: 0.12 + r() * 0.14,
      at: T.hold + 0.2 + i * 0.28,
    };
  });
})();

// ---------------------------------------------------------------------------
//  The component
// ---------------------------------------------------------------------------

export function GeoChangeDetection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundRef = useRef<Sound | null>(null);
  const [sound, setSound] = useState(false);
  const reduce = useReducedMotion();

  // The audio starts inside the click, which is what browsers ask for.
  const toggleSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
      setSound(false);
    } else {
      soundRef.current = createSound();
      setSound(Boolean(soundRef.current));
    }
  };
  useEffect(
    () => () => {
      soundRef.current?.stop();
      soundRef.current = null;
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const cnv = canvasRef.current;
    const ctx = cnv?.getContext("2d");
    if (!section || !cnv || !ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let hud = "#7ed957";
    const readColours = () => {
      hud = getComputedStyle(section).getPropertyValue("--s").trim() || hud;
    };

    const tiles: (HTMLCanvasElement | null)[] = Array(COLS * ROWS).fill(null);
    tiles[HOME] = paintHarbour();
    // The rest are painted a few a frame, nearest the harbour first.
    const queue = Array.from({ length: COLS * ROWS }, (_, i) => i)
      .filter((i) => i !== HOME)
      .sort((a, b) => {
        const d = (i: number) =>
          Math.hypot((i % COLS) - HOME_COL, Math.floor(i / COLS) - HOME_ROW);
        return d(a) - d(b);
      });

    const drawWorld = (x: number, y: number, z: number) => {
      const ox = W / 2 - x * z;
      const oy = H / 2 - y * z;
      for (let i = 0; i < tiles.length; i++) {
        const sx = ox + (i % COLS) * STEP * z;
        const sy = oy + Math.floor(i / COLS) * STEP * z;
        if (sx > W || sy > H || sx + z < 0 || sy + z < 0) continue;
        const tile = tiles[i];
        if (tile) ctx.drawImage(tile, sx, sy, z, z);
        else {
          ctx.fillStyle = "#15191c";
          ctx.fillRect(sx, sy, z, z);
        }
      }
      return { ox, oy };
    };

    const mono = (px: number) =>
      `600 ${px}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

    const drawHud = (t: number, ox: number, oy: number, z: number) => {
      const fade = t < T.fade ? 1 : 1 - clamp((t - T.fade) / (T.out - T.fade));
      if (t < T.boxes || fade <= 0) return;
      const hx = ox + HOME_COL * STEP * z;
      const hy = oy + HOME_ROW * STEP * z;
      const font = clamp(W / 95, 10, 13);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.strokeStyle = hud;
      ctx.fillStyle = hud;
      ctx.shadowColor = hud;
      ctx.shadowBlur = 6;
      let primary: { x: number; y: number; w: number; h: number } | null = null;
      TARGETS.forEach((index, n) => {
        const ship = SHIPS[index];
        const p = clamp((t - (T.boxes + n * 0.32)) / 0.35);
        if (p <= 0) return;
        const pad = 0.007;
        const reach = Math.max(ship.len, ship.beam) * (ship.angle ? 0.55 : 0.5);
        const w = ((ship.angle ? reach * 2 : ship.len) + pad * 2) * z;
        const h = ((ship.angle ? reach * 1.2 : ship.beam) + pad * 2) * z;
        const cx = hx + ship.x * z;
        const cy = hy + ship.y * z;
        const grow = lerp(1.9, 1, easeOutBack(p));
        const bw = w * grow;
        const bh = h * grow;
        const x = cx - bw / 2;
        const y = cy - bh / 2;
        if (n === 0) primary = { x, y, w: bw, h: bh };
        ctx.lineWidth = 1;
        ctx.globalAlpha = fade * p * 0.55;
        ctx.strokeRect(x, y, bw, bh);
        ctx.globalAlpha = fade * p;
        ctx.lineWidth = 2;
        const c = Math.min(bw, bh) * 0.35;
        ctx.beginPath();
        for (const [px, py, dx, dy] of [
          [x, y, 1, 1],
          [x + bw, y, -1, 1],
          [x, y + bh, 1, -1],
          [x + bw, y + bh, -1, -1],
        ]) {
          ctx.moveTo(px + dx * c, py);
          ctx.lineTo(px, py);
          ctx.lineTo(px, py + dy * c);
        }
        ctx.stroke();
        if (n > 0) {
          ctx.font = mono(font * 0.85);
          ctx.fillText(`T-0${n + 1}`, x, y - 5);
        }
      });

      const box = primary as {
        x: number;
        y: number;
        w: number;
        h: number;
      } | null;
      if (box && t > T.line) {
        const p = easeInOut(clamp((t - T.line) / 0.4));
        const lineX = box.x + box.w * 0.3;
        const reach = clamp(H * 0.17, 60, 140);
        const topY = box.y - reach * p;
        ctx.globalAlpha = fade;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lineX, box.y);
        ctx.lineTo(lineX, topY);
        ctx.stroke();
        if (p >= 1) {
          ctx.beginPath();
          ctx.arc(lineX, topY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        let typed = Math.floor((t - T.type) * TYPE_SPEED);
        if (typed > 0) {
          ctx.font = mono(font);
          const lineH = font * 1.45;
          const width =
            ctx.measureText(TELEMETRY[TELEMETRY.length - 1]).width + font;
          const left =
            lineX + 10 + width > W - 12 ? lineX - 10 - width : lineX + 10;
          const startY = topY - 2;
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(4,10,8,0.55)";
          ctx.globalAlpha = fade;
          const shown = TELEMETRY.filter(
            (_, i) => typed > TELEMETRY.slice(0, i).join("").length,
          ).length;
          ctx.fillRect(
            left - 6,
            startY - font - 4,
            width + 8,
            shown * lineH + 6,
          );
          ctx.fillStyle = hud;
          ctx.shadowBlur = 4;
          let y = startY;
          for (const line of TELEMETRY) {
            if (typed <= 0) break;
            const part = line.slice(0, typed);
            ctx.fillText(part, left, y);
            if (typed < line.length && Math.floor(t * 4) % 2 === 0) {
              ctx.fillRect(
                left + ctx.measureText(part).width + 2,
                y - font * 0.8,
                font * 0.55,
                font * 0.95,
              );
            }
            typed -= line.length;
            y += lineH;
          }
        }
      }
      ctx.restore();
    };

    const drawGridMarks = (t: number, ox: number, oy: number, z: number) => {
      if (t < T.hold - 0.4 || t > T.back + 0.6) return;
      const fade =
        clamp((t - (T.hold - 0.4)) / 0.6) * (1 - clamp((t - T.back) / 0.6));
      ctx.save();
      ctx.strokeStyle = hud;
      ctx.fillStyle = hud;
      ctx.shadowColor = hud;
      ctx.shadowBlur = 8;
      // The harbour, outlined: where the camera came from.
      ctx.globalAlpha = fade;
      ctx.lineWidth = 2;
      const hx = ox + HOME_COL * STEP * z;
      const hy = oy + HOME_ROW * STEP * z;
      ctx.strokeRect(hx - 2, hy - 2, z + 4, z + 4);
      ctx.font = mono(clamp(z / 11, 9, 12));
      ctx.fillText(`AOI ${HOME} · ${SHIPS.length} VESSELS`, hx, hy - 7);
      ctx.lineWidth = 1.5;
      for (const flag of FLAGS) {
        const p = clamp((t - flag.at) / 0.25);
        if (p <= 0) continue;
        const blink =
          t - flag.at < 0.8
            ? Math.floor((t - flag.at) * 8) % 2 === 0
              ? 1
              : 0.25
            : 1;
        ctx.globalAlpha = fade * blink;
        const tx = ox + (flag.tile % COLS) * STEP * z;
        const ty = oy + Math.floor(flag.tile / COLS) * STEP * z;
        const sz = flag.size * z * lerp(2, 1, easeOutBack(p));
        const x = tx + flag.x * z;
        const y = ty + flag.y * z;
        ctx.strokeRect(x, y, sz, sz);
        ctx.font = mono(clamp(z / 13, 8, 11));
        ctx.fillText("Δ", x + sz + 3, y + 8);
      }
      ctx.restore();
    };

    let clock = 0;
    let typedBefore = 0;
    const events = (from: number, to: number) => {
      const s = soundRef.current;
      if (!s) return;
      const crossed = (at: number) => from < at && to >= at;
      TARGETS.forEach((_, n) => {
        if (crossed(T.boxes + n * 0.32)) s.lock(n ? 1 : 1.25);
      });
      FLAGS.forEach((f) => {
        if (crossed(f.at)) s.lock(0.7);
      });
      if (crossed(T.out)) s.whoosh(T.hold - T.out, false);
      if (crossed(T.back)) s.whoosh(LOOP - T.back, true);
      const typed = clamp(
        Math.floor((to - T.type) * TYPE_SPEED),
        0,
        TELEMETRY_CHARS,
      );
      if (typed > typedBefore && typed % 2 === 0) s.tick();
      typedBefore = typed;
    };

    const frame = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#050607";
      ctx.fillRect(0, 0, W, H);
      const cam = cameraAt(t, W, H);
      const { ox, oy } = drawWorld(cam.x, cam.y, cam.z);
      // Zoom blur: the same frame again a little nearer and farther, faint.
      if (cam.blur > 0.04) {
        ctx.globalAlpha = 0.2;
        for (let i = 1; i <= 4; i++) {
          const k = 1 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.045 * cam.blur;
          drawWorld(cam.x, cam.y, cam.z * k);
        }
        ctx.globalAlpha = 1;
      }
      drawHud(t, ox, oy, cam.z);
      drawGridMarks(t, ox, oy, cam.z);
      // "UN" goes out of focus while the ships are being found.
      const found = clamp((t - T.boxes) / 1.2) * (1 - clamp((t - T.out) / 1.5));
      section.style.setProperty("--un-blur", `${lerp(3, 7, found)}px`);
      section.style.setProperty("--un-alpha", `${lerp(0.5, 0.3, found)}`);
    };

    const resize = () => {
      const b = section.getBoundingClientRect();
      W = b.width;
      H = b.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cnv.width = Math.round(W * dpr);
      cnv.height = Math.round(H * dpr);
      readColours();
      frame(reduce ? T.fade - 0.01 : clock);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    resize();

    if (reduce) {
      // A still: every tile, and the ships found, with their telemetry.
      while (queue.length) {
        const i = queue.shift()!;
        tiles[i] = paintTile(i);
      }
      frame(T.fade - 0.01);
      return () => ro.disconnect();
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(section);

    let raf = 0;
    let last = performance.now();
    let frames = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      for (let k = 0; k < 3 && queue.length; k++) {
        const i = queue.shift()!;
        tiles[i] = paintTile(i);
      }
      if (!visible || document.hidden) return;
      if (++frames % 30 === 0) readColours();
      const before = clock;
      clock = (clock + dt) % LOOP;
      if (clock < before) typedBefore = 0;
      events(clock < before ? 0 : before, clock);
      frame(clock);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      className="@container relative isolate min-h-[38rem] overflow-hidden bg-[#050607] text-white @3xl:min-h-[44rem]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-20 size-full"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-950/85 via-zinc-950/35 to-transparent @3xl:bg-gradient-to-r @3xl:from-zinc-950/90 @3xl:via-zinc-950/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 shadow-[inset_0_0_160px_40px_rgba(0,0,0,0.7)]"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-4 font-mono text-[0.6875rem] tracking-[0.18em] text-white/60 @3xl:px-10">
        <span className="flex items-center gap-2">
          <motion.span
            className="size-1.5 rounded-full bg-(--s)"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          LIVE · PASS 0412
        </span>
        <span className="hidden @3xl:inline">
          69.6531°N 18.9560°E · GSD 0.5M
        </span>
      </div>

      <div className="mx-auto flex min-h-[38rem] max-w-6xl flex-col justify-start px-6 pt-20 pb-24 @3xl:min-h-[44rem] @3xl:justify-center @3xl:px-10 @3xl:pt-16">
        <motion.h1
          className="text-5xl leading-[0.9] font-black tracking-tight @md:text-6xl @3xl:text-8xl @5xl:text-[8.5rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="transition-[filter,opacity] duration-300"
            style={{
              filter: "blur(var(--un-blur, 3px))",
              opacity: "var(--un-alpha, 0.5)",
            }}
          >
            UN
          </span>
          DETECTED
        </motion.h1>
        <motion.p
          className="mt-5 max-w-[30ch] text-lg leading-snug text-white/90 @3xl:mt-7 @3xl:text-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
        >
          Decision advantage with rapid change detection
        </motion.p>
        <motion.a
          href="#"
          className="mt-9 inline-flex w-fit items-center gap-3 border border-(--p) bg-zinc-950/50 px-7 py-3.5 text-sm font-semibold tracking-[0.12em] text-white uppercase shadow-[0_0_22px_-4px_var(--p),inset_0_0_14px_-6px_var(--p)] backdrop-blur-sm hover:bg-(--p)/20"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Learn More
          <svg
            viewBox="0 0 16 16"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </motion.a>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={sound}
        className="absolute right-5 bottom-5 flex items-center gap-2 border border-white/25 bg-zinc-950/60 px-3 py-2 font-mono text-[0.6875rem] tracking-[0.16em] text-white/75 backdrop-blur-sm hover:border-white/60 hover:text-white @3xl:right-10"
      >
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
          {sound ? (
            <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9" />
          ) : (
            <path d="m11 6 4 4m0-4-4 4" />
          )}
        </svg>
        SOUND {sound ? "ON" : "OFF"}
      </button>
    </section>
  );
}
