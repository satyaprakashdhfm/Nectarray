"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as THREE from "three";

/**
 * A whole one-page site for a property law firm, built around one object:
 * the client's property file, in live 3D.
 *
 * It floats beside the headline, and as the reader scrolls a pinned stage
 * plays it like a film (the way card sites scrub a rendered card): the file
 * comes to the centre and opens, the sale deed, EC, approved plan and tax
 * receipts fan out, each comes forward to be scanned and ticked, they go
 * back in, a stamp comes down and seals it Verified, and the file flies into
 * a phone as the finished legal opinion. The rest of the page follows in
 * ordinary sections: services, process, numbers, reviews, questions and a
 * last call to act.
 *
 * Scroll position is the playhead. The 3D scene reads it every frame and
 * eases towards it, so a mouse wheel that jumps still plays smoothly, and
 * scrolling back runs the film backwards. Colours come from the palette
 * variables (--p, --s, --t), read once on mount.
 */

type Colours = { p: string; pDark: string; pLight: string; s: string };

const BRAND = "Vidhi Legal";

const PAPERS = [
  {
    title: "SALE DEED",
    sub: "Registered at the Sub-Registrar Office",
    heading: "Title traced back 30 years",
    detail:
      "Every owner and every transfer, matched with the sub-registrar's records.",
  },
  {
    title: "ENCUMBRANCE CERTIFICATE",
    sub: "Form 15, 1994 to date",
    heading: "No loans, no charges",
    detail:
      "Nothing mortgaged, attached by a court or under dispute in the records.",
  },
  {
    title: "APPROVED BUILDING PLAN",
    sub: "Sanction by the planning authority",
    heading: "Built the way it was approved",
    detail:
      "Floors, setbacks and use checked against the sanctioned plan and site.",
  },
  {
    title: "TAX AND DUES RECEIPTS",
    sub: "Property tax, water and society",
    heading: "Dues paid up to date",
    detail:
      "Property tax, water and society dues, so nothing follows you home.",
  },
];

/* The film, as fractions of the pinned stage's scroll. */
const T = {
  centre: [0.06, 0.18],
  open: [0.2, 0.29],
  check: 0.31,
  per: 0.075,
  gather: [0.61, 0.67],
  close: [0.65, 0.7],
  stamp: [0.69, 0.725, 0.77],
  phone: [0.79, 0.87],
  deliver: [0.85, 0.93],
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const backOut = (x: number) => {
  if (x <= 0) return 0;
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

/* ------------------------------------------------------------------ */
/* Textures, drawn on a 2D canvas so the file needs no image assets.   */
/* ------------------------------------------------------------------ */

const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";

function texture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function paperTexture(title: string, sub: string, colour: string) {
  return texture(600, 800, (c) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, 600, 800);
    c.fillStyle = colour;
    c.fillRect(0, 0, 600, 14);
    c.fillStyle = "#18181b";
    c.font = `700 ${title.length > 18 ? 30 : 40}px ${SANS}`;
    c.fillText(title, 48, 96);
    c.fillStyle = "#71717a";
    c.font = `500 22px ${SANS}`;
    c.fillText(sub, 48, 134);
    c.fillStyle = colour;
    c.fillRect(48, 158, 120, 4);
    c.fillStyle = "#e4e4e7";
    const widths = [470, 500, 430, 490, 380, 500, 460, 300, 480, 440, 500, 260];
    widths.forEach((w, i) => {
      c.fillRect(48, 206 + i * 34, w, 12);
    });
    // A signature and the office seal at the foot.
    c.strokeStyle = "#3f3f46";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(56, 700);
    c.bezierCurveTo(90, 640, 120, 730, 150, 690);
    c.bezierCurveTo(175, 660, 200, 720, 240, 680);
    c.stroke();
    c.strokeStyle = colour;
    c.lineWidth = 5;
    c.beginPath();
    c.arc(480, 690, 58, 0, Math.PI * 2);
    c.stroke();
    c.lineWidth = 2;
    c.beginPath();
    c.arc(480, 690, 44, 0, Math.PI * 2);
    c.stroke();
  });
}

function labelTexture() {
  return texture(560, 300, (c) => {
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.roundRect(0, 0, 560, 300, 28);
    c.fill();
    c.fillStyle = "#71717a";
    c.font = `600 30px ${SANS}`;
    c.fillText("PROPERTY FILE", 44, 78);
    c.fillStyle = "#18181b";
    c.font = `700 46px ${SANS}`;
    c.fillText("Flat 402, Tower B", 44, 150);
    c.fillStyle = "#52525b";
    c.font = `500 32px ${SANS}`;
    c.fillText("Survey No. 118/4", 44, 206);
    c.fillText("Purchase verification", 44, 252);
  });
}

function sealTexture() {
  return texture(400, 400, (c) => {
    const g = "#15803d";
    c.strokeStyle = g;
    c.lineWidth = 16;
    c.beginPath();
    c.arc(200, 200, 180, 0, Math.PI * 2);
    c.stroke();
    c.lineWidth = 5;
    c.beginPath();
    c.arc(200, 200, 150, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = "rgba(22,163,74,0.12)";
    c.beginPath();
    c.arc(200, 200, 146, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = g;
    c.font = `800 58px ${SANS}`;
    c.textAlign = "center";
    c.fillText("VERIFIED", 200, 270);
    c.strokeStyle = g;
    c.lineWidth = 18;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(150, 165);
    c.lineTo(188, 202);
    c.lineTo(256, 128);
    c.stroke();
  });
}

function tickTexture() {
  return texture(200, 200, (c) => {
    c.fillStyle = "#16a34a";
    c.beginPath();
    c.arc(100, 100, 96, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#ffffff";
    c.lineWidth = 18;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(56, 104);
    c.lineTo(86, 134);
    c.lineTo(146, 70);
    c.stroke();
  });
}

function screenTexture(colour: string) {
  return texture(500, 1000, (c) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, 500, 1000);
    c.fillStyle = "#18181b";
    c.font = `700 30px ${SANS}`;
    c.fillText(BRAND, 40, 110);
    c.fillStyle = "#dcfce7";
    c.beginPath();
    c.arc(250, 300, 96, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#16a34a";
    c.beginPath();
    c.arc(250, 300, 66, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#ffffff";
    c.lineWidth = 14;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(218, 302);
    c.lineTo(242, 326);
    c.lineTo(286, 278);
    c.stroke();
    c.textAlign = "center";
    c.fillStyle = "#18181b";
    c.font = `700 40px ${SANS}`;
    c.fillText("Legal opinion ready", 250, 470);
    c.fillStyle = "#52525b";
    c.font = `500 26px ${SANS}`;
    [
      "Title clear for 30 years",
      "No encumbrances",
      "Approvals in order",
    ].forEach((line, i) => c.fillText(line, 250, 540 + i * 44));
    c.fillStyle = colour;
    c.beginPath();
    c.roundRect(60, 760, 380, 92, 46);
    c.fill();
    c.fillStyle = "#ffffff";
    c.font = `700 30px ${SANS}`;
    c.fillText("Download PDF", 250, 818);
  });
}

function roundedSlab(w: number, h: number, r: number, depth: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 4,
    curveSegments: 16,
  });
  geo.center();
  return geo;
}

/* ------------------------------------------------------------------ */
/* The scene.                                                          */
/* ------------------------------------------------------------------ */

const FILE_W = 2.3;
const FILE_H = 3.0;
const PAPER_W = 1.5;
const PAPER_H = 2.0;
/* Where the seal sits on the front cover. */
const SEAL_X = 0.42;
const SEAL_Y = -0.62;

function Scene({
  progress,
  colours,
  still,
}: {
  progress: MotionValue<number>;
  colours: Colours;
  still: boolean;
}) {
  const { viewport } = useThree();
  const root = useRef<THREE.Group>(null);
  const file = useRef<THREE.Group>(null);
  const cover = useRef<THREE.Group>(null);
  const seal = useRef<THREE.Mesh>(null);
  const papers = useRef<(THREE.Group | null)[]>([]);
  const ticks = useRef<(THREE.Mesh | null)[]>([]);
  const scanner = useRef<THREE.Group>(null);
  const stamp = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const phone = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const played = useRef(0);
  const born = useRef<number | null>(null);

  const tex = useMemo(
    () => ({
      papers: PAPERS.map((d) => paperTexture(d.title, d.sub, colours.p)),
      label: labelTexture(),
      seal: sealTexture(),
      tick: tickTexture(),
      screen: screenTexture(colours.p),
    }),
    [colours.p],
  );
  const coverGeo = useMemo(() => roundedSlab(FILE_W, FILE_H, 0.08, 0.03), []);
  const phoneGeo = useMemo(() => roundedSlab(1.62, 3.3, 0.26, 0.14), []);

  useEffect(
    () => () => {
      [...tex.papers, tex.label, tex.seal, tex.tick, tex.screen].forEach((t) =>
        t.dispose(),
      );
    },
    [tex],
  );

  useFrame((state, dt) => {
    const P0 = progress.get();
    played.current += (P0 - played.current) * Math.min(1, dt * 5);
    const P = played.current;
    const t = state.clock.elapsedTime;
    born.current ??= t;
    const life = t - born.current;
    const sway = still ? 0 : 1;

    // Fit: shrink the whole scene on narrow screens, and put the hero
    // file beside the headline when wide, below it when narrow.
    const narrow = viewport.aspect < 0.9;
    const S = Math.min(1, Math.max(0.42, viewport.width / 9.5));
    if (root.current) root.current.scale.setScalar(S);
    const heroX = narrow ? 0 : (viewport.width * 0.23) / S;
    const heroY = narrow ? -(viewport.height * 0.2) / S : -0.1;

    /* The file: hero, centre, lie back to open, stand up, into the phone. */
    const toCentre = smooth(seg(P, T.centre[0], T.centre[1]));
    const lieBack = smooth(seg(P, T.open[0], T.open[1]));
    const standUp = smooth(seg(P, T.close[0], T.close[1]));
    const lying = lieBack * (1 - standUp);
    const deliver = smooth(seg(P, T.deliver[0], T.deliver[1]));
    const landIn = smooth(seg(P, 0.91, 0.94));
    const intro = backOut(clamp01(life / 1.3));

    // Where the phone ends up, and the file with it.
    const phoneRise = smooth(seg(P, T.phone[0], T.phone[1]));
    const phoneX = 0;
    const phoneY = lerp(-8, -0.15, phoneRise);

    const pointer = state.pointer;
    const f = file.current;
    if (f) {
      const heroTilt = 1 - toCentre;
      f.position.x = lerp(lerp(heroX, 0, toCentre), phoneX, deliver);
      f.position.y =
        lerp(lerp(heroY, 0, toCentre), -1.25, lying) * (1 - deliver) +
        (phoneY + 0.25) * deliver +
        Math.sin(t * 1.1) * 0.08 * heroTilt * sway;
      f.position.z = lerp(0, 0.4, deliver);
      f.rotation.x =
        lerp(0.22 + Math.sin(t * 0.8) * 0.05 * sway, 0.06, toCentre) -
        1.1 * lying -
        pointer.y * 0.12 * heroTilt;
      f.rotation.y =
        lerp(-0.5 + Math.sin(t * 0.6) * 0.12 * sway, 0, toCentre) +
        pointer.x * 0.22 * heroTilt;
      f.rotation.z = lerp(-0.08, 0, toCentre);
      const size = lerp(1, 0.92, lying) * lerp(1, 0.34, deliver) * (1 - landIn);
      f.scale.setScalar(Math.max(0.0001, size * intro));
    }

    /* The cover swings open on its left edge, and shut again. */
    const opened =
      smooth(seg(P, T.open[0] + 0.01, T.open[1] - 0.01)) *
      (1 - smooth(seg(P, T.close[0], T.close[1])));
    if (cover.current) cover.current.rotation.y = -2.55 * opened;

    /* The papers: out in a fan, each forward in turn, back in. */
    const fileX = f?.position.x ?? 0;
    const fileY = f?.position.y ?? 0;
    if (scanner.current) scanner.current.visible = false;
    papers.current.forEach((g, i) => {
      if (!g) return;
      const out = smooth(seg(P, 0.22 + i * 0.015, 0.31 + i * 0.015));
      const back = smooth(
        seg(
          P,
          T.gather[0] + (3 - i) * 0.008,
          T.gather[1] - 0.02 + (3 - i) * 0.008,
        ),
      );
      const k = out * (1 - back);
      g.visible = k > 0.002;
      const fanX = (i - 1.5) * 1.75;
      const fanY = 0.85;
      const fanZ = 0.35 - Math.abs(i - 1.5) * 0.18;

      const w0 = T.check + i * T.per;
      const w1 = w0 + T.per;
      const focus =
        smooth(seg(P, w0, w0 + 0.018)) * (1 - smooth(seg(P, w1 - 0.016, w1)));

      g.position.set(
        lerp(lerp(fileX, fanX, k), 0, focus),
        lerp(lerp(fileY + 0.2, fanY, k), 0.35, focus),
        lerp(lerp(0.1, fanZ, k), 1.7, focus),
      );
      g.rotation.set(
        -1.1 * (1 - k),
        lerp((i - 1.5) * -0.14 * k, 0, focus),
        lerp(-(i - 1.5) * 0.07 * k, 0, focus),
      );
      g.scale.setScalar(lerp(lerp(0.8, 1, k), 1.25, focus));

      const tick = ticks.current[i];
      if (tick) {
        const pop = backOut(seg(P, w0 + 0.05, w0 + 0.062));
        tick.scale.setScalar(Math.max(0.0001, pop));
      }

      // The scanner sweeps down the paper in front.
      if (scanner.current && focus > 0.5) {
        const s = seg(P, w0 + 0.02, w0 + 0.05);
        const active = s > 0 && s < 1;
        scanner.current.visible = active;
        if (active) {
          const sc = g.scale.x;
          scanner.current.position.set(
            g.position.x,
            g.position.y + (0.5 - s) * PAPER_H * sc,
            g.position.z + 0.03,
          );
          scanner.current.scale.set(sc, 1, 1);
        }
      }
    });

    /* The stamp comes down on the closed file, and the seal appears. */
    const [s0, sHit, s1] = T.stamp;
    const down = smooth(seg(P, s0, sHit));
    const up = smooth(seg(P, sHit + 0.008, s1));
    if (stamp.current) {
      stamp.current.visible = P > s0 && P < s1;
      stamp.current.position.set(
        SEAL_X,
        lerp(lerp(4.6, SEAL_Y, down), 4.6, up),
        lerp(lerp(2.4, 0.14, down), 2.4, up),
      );
      stamp.current.rotation.z = lerp(0.5, 0, down);
    }
    const sealed = backOut(seg(P, sHit, sHit + 0.014));
    if (seal.current) seal.current.scale.setScalar(Math.max(0.0001, sealed));
    const ripple = seg(P, sHit, sHit + 0.05);
    if (ring.current && ringMat.current) {
      ring.current.visible = ripple > 0 && ripple < 1;
      ring.current.scale.setScalar(lerp(0.6, 2.6, ripple));
      ringMat.current.opacity = 1 - ripple;
    }

    /* The phone rises to catch the file; the opinion lights its screen. */
    if (phone.current) {
      phone.current.visible = phoneRise > 0.001;
      phone.current.position.set(phoneX, phoneY, 0.1);
      phone.current.rotation.set(
        lerp(-0.35, -0.06, phoneRise),
        lerp(0.6, 0, phoneRise) + pointer.x * 0.12 * phoneRise,
        0,
      );
    }
    if (screenMat.current) {
      screenMat.current.opacity = smooth(seg(P, 0.92, 0.95));
    }
  });

  return (
    <group ref={root}>
      {/* The property file. */}
      <group ref={file}>
        {/* Back cover. */}
        <mesh geometry={coverGeo} position={[0, 0, -0.06]}>
          <meshPhysicalMaterial
            color={colours.pDark}
            roughness={0.55}
            clearcoat={0.4}
          />
        </mesh>
        {/* The papers inside, as a block. */}
        <mesh position={[0.03, -0.02, 0.03]}>
          <boxGeometry args={[FILE_W - 0.16, FILE_H - 0.14, 0.1]} />
          <meshStandardMaterial color="#f4f4f5" roughness={0.9} />
        </mesh>
        {/* Front cover, hinged on its left edge. */}
        <group ref={cover} position={[-FILE_W / 2, 0, 0.12]}>
          <group position={[FILE_W / 2, 0, 0]}>
            <mesh geometry={coverGeo}>
              <meshPhysicalMaterial
                color={colours.p}
                roughness={0.45}
                clearcoat={0.6}
                clearcoatRoughness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.62, 0.035]}>
              <planeGeometry args={[1.7, 0.91]} />
              <meshStandardMaterial map={tex.label} roughness={0.7} />
            </mesh>
            {/* The ribbon that ties a legal file. */}
            <mesh position={[0, -0.55, 0.04]}>
              <boxGeometry args={[FILE_W + 0.02, 0.12, 0.02]} />
              <meshStandardMaterial color={colours.s} roughness={0.5} />
            </mesh>
            <mesh ref={seal} position={[SEAL_X, SEAL_Y, 0.06]} scale={0.0001}>
              <planeGeometry args={[1.05, 1.05]} />
              <meshBasicMaterial map={tex.seal} transparent />
            </mesh>
          </group>
        </group>
      </group>

      {/* The four papers. */}
      {PAPERS.map((d, i) => (
        <group
          key={d.title}
          ref={(g) => {
            papers.current[i] = g;
          }}
          visible={false}
        >
          <mesh>
            <boxGeometry args={[PAPER_W, PAPER_H, 0.012]} />
            <meshStandardMaterial attach="material-0" color="#e4e4e7" />
            <meshStandardMaterial attach="material-1" color="#e4e4e7" />
            <meshStandardMaterial attach="material-2" color="#e4e4e7" />
            <meshStandardMaterial attach="material-3" color="#e4e4e7" />
            <meshStandardMaterial
              attach="material-4"
              map={tex.papers[i]}
              roughness={0.85}
            />
            <meshStandardMaterial attach="material-5" color="#fafafa" />
          </mesh>
          <mesh
            ref={(m) => {
              ticks.current[i] = m;
            }}
            position={[PAPER_W / 2 - 0.12, PAPER_H / 2 - 0.12, 0.03]}
            scale={0.0001}
          >
            <planeGeometry args={[0.42, 0.42]} />
            <meshBasicMaterial map={tex.tick} transparent />
          </mesh>
        </group>
      ))}

      {/* The scanner line, with a soft glow above it. */}
      <group ref={scanner} visible={false}>
        <mesh>
          <planeGeometry args={[PAPER_W * 1.08, 0.035]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0, 0.14, -0.001]}>
          <planeGeometry args={[PAPER_W * 1.08, 0.28]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.16} />
        </mesh>
      </group>

      {/* The stamp: a handle over a round base, face down. */}
      <group ref={stamp} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.5, 0.52, 0.2, 48]} />
          <meshPhysicalMaterial
            color="#27272a"
            roughness={0.35}
            clearcoat={1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.16, 0.22, 0.6, 32]} />
          <meshPhysicalMaterial color="#3f3f46" roughness={0.3} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, 0.86]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshPhysicalMaterial
            color={colours.s}
            roughness={0.3}
            clearcoat={1}
          />
        </mesh>
      </group>
      <mesh ref={ring} position={[SEAL_X, SEAL_Y, 0.3]} visible={false}>
        <ringGeometry args={[0.55, 0.62, 64]} />
        <meshBasicMaterial ref={ringMat} color="#16a34a" transparent />
      </mesh>

      {/* The phone that receives the opinion. */}
      <group ref={phone} visible={false}>
        <mesh geometry={phoneGeo}>
          <meshPhysicalMaterial color="#18181b" roughness={0.3} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[1.46, 3.12]} />
          <meshBasicMaterial color="#f4f4f5" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.46, 2.92]} />
          <meshBasicMaterial ref={screenMat} map={tex.screen} transparent />
        </mesh>
        <mesh position={[0, 1.42, 0.1]}>
          <planeGeometry args={[0.42, 0.1]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The pinned stage: hero copy, the 3D film, and its captions.         */
/* ------------------------------------------------------------------ */

function Caption({
  progress,
  from,
  to,
  heading,
  detail,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  heading: string;
  detail: string;
  children?: React.ReactNode;
}) {
  const opacity = useTransform(
    progress,
    [from, from + 0.02, to - 0.02, to],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [from, from + 0.025], [18, 0]);
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[7%] mx-auto max-w-xl px-5 text-center"
      style={{ opacity, y }}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
        {heading}
      </h2>
      <p className="mx-auto mt-2 max-w-[44ch] text-sm leading-relaxed text-zinc-600 @3xl:text-base">
        {detail}
      </p>
      {children}
    </motion.div>
  );
}

function Stage({ colours }: { colours: Colours }) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion() ?? false;
  const [visible, setVisible] = useState(true);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.06], [0, -40]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lastOpacity = useTransform(scrollYProgress, [0.86, 0.9], [0, 1]);
  const lastY = useTransform(scrollYProgress, [0.86, 0.9], [18, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="how" className="relative h-[700vh] bg-white">
      <div className="sticky top-0 h-[100dvh] overflow-clip">
        {/* A faint dot grid, and a wash of the brand colour behind the file. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle, #e4e4e7 1px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--p-light) opacity-70 blur-3xl"
          aria-hidden
        />

        <Canvas
          className="!absolute inset-0"
          dpr={[1, 2]}
          camera={{ fov: 35, position: [0, 0, 10] }}
          frameloop={visible ? "always" : "never"}
          gl={{ antialias: true, alpha: true }}
        >
          <hemisphereLight args={["#ffffff", "#d4d4d8", 1.5]} />
          <directionalLight position={[3, 5, 7]} intensity={2.2} />
          <directionalLight position={[-4, -2, 4]} intensity={0.6} />
          <Scene progress={scrollYProgress} colours={colours} still={still} />
        </Canvas>

        {/* Progress of the story, across the top. */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1 origin-left bg-(--p)"
          style={{ scaleX: bar }}
        />

        {/* The hero copy, which steps aside as the film starts. */}
        <motion.div
          className="pointer-events-none absolute inset-0 mx-auto flex max-w-6xl items-start px-5 pt-[14vh] @3xl:items-center @3xl:pt-0"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="pointer-events-auto max-w-xl @3xl:max-w-[30rem]">
            <motion.h1
              className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Buy your home with every paper checked.
            </motion.h1>
            <motion.p
              className="mt-5 max-w-[40ch] text-base leading-relaxed text-zinc-600 @3xl:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Property lawyers who verify the title, loans and approvals before
              you pay a rupee.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <a
                href="#start"
                className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold whitespace-nowrap text-(--p-on) transition-transform active:scale-[0.98]"
              >
                Verify my property
              </a>
              <a
                href="#services"
                className="rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-semibold whitespace-nowrap text-zinc-900 transition-colors hover:border-zinc-900"
              >
                Our services
              </a>
            </motion.div>
          </div>
        </motion.div>

        <Caption
          progress={scrollYProgress}
          from={0.19}
          to={0.31}
          heading="We open the whole file."
          detail="Sale deed, EC, approved plan and tax receipts. Every page, not a summary."
        />
        {PAPERS.map((d, i) => (
          <Caption
            key={d.title}
            progress={scrollYProgress}
            from={T.check + i * T.per}
            to={T.check + (i + 1) * T.per}
            heading={d.heading}
            detail={d.detail}
          />
        ))}
        <Caption
          progress={scrollYProgress}
          from={0.65}
          to={0.79}
          heading="Signed, stamped, verified."
          detail="A senior advocate reviews every finding and signs your legal opinion."
        />
        <motion.div
          className="absolute inset-x-0 bottom-[6%] mx-auto max-w-xl px-5 text-center"
          style={{ opacity: lastOpacity, y: lastY }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
            On your phone in 7 working days.
          </h2>
          <p className="mx-auto mt-2 max-w-[44ch] text-sm leading-relaxed text-zinc-600 @3xl:text-base">
            A clear opinion you can show your bank, your family and the seller.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The rest of the page.                                               */
/* ------------------------------------------------------------------ */

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
};

function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">
            V
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            {BRAND}
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 @3xl:flex">
          <a href="#services" className="hover:text-zinc-900">
            Services
          </a>
          <a href="#process" className="hover:text-zinc-900">
            Process
          </a>
          <a href="#reviews" className="hover:text-zinc-900">
            Reviews
          </a>
          <a href="#faq" className="hover:text-zinc-900">
            Questions
          </a>
        </nav>
        <a
          href="#start"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white"
        >
          Verify my property
        </a>
      </div>
    </header>
  );
}

const SERVICES = [
  {
    name: "Title verification",
    text: "Thirty years of ownership traced, with every document cross-checked at the registrar.",
    span: "@3xl:col-span-2 @3xl:row-span-2",
    tone: "bg-(--p) text-(--p-on)",
    big: true,
  },
  {
    name: "Sale agreement drafting",
    text: "Clauses that protect your advance, your dates and your exit.",
    span: "",
    tone: "bg-zinc-50 text-zinc-900",
  },
  {
    name: "Registration support",
    text: "Stamp duty worked out, slot booked, and a lawyer beside you on the day.",
    span: "",
    tone: "bg-(--s-light) text-zinc-900",
  },
  {
    name: "Home loan legal opinion",
    text: "The report banks ask for, in the format they accept.",
    span: "",
    tone: "bg-zinc-50 text-zinc-900",
  },
  {
    name: "NRI property help",
    text: "Power of attorney, video consultations and updates in your time zone.",
    span: "",
    tone: "bg-(--p-light) text-zinc-900",
  },
];

function Services() {
  return (
    <section id="services" className="bg-white py-20 @3xl:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          {...reveal}
          className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
        >
          Everything a property purchase needs from a lawyer.
        </motion.h2>
        <div className="mt-12 grid gap-4 @3xl:grid-cols-4 @3xl:grid-rows-2">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className={`flex flex-col justify-between rounded-3xl p-6 ${s.span} ${s.tone} ${
                s.big ? "min-h-72" : "min-h-48"
              }`}
            >
              {s.big ? (
                <div className="flex gap-1.5" aria-hidden>
                  {Array.from({ length: 30 }).map((_, y) => (
                    <motion.span
                      key={y}
                      className="h-10 flex-1 rounded-sm bg-current"
                      initial={{ opacity: 0.12, scaleY: 0.3 }}
                      whileInView={{ opacity: 0.55, scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + y * 0.025 }}
                    />
                  ))}
                </div>
              ) : (
                <span />
              )}
              <div>
                <h3
                  className={`font-semibold tracking-tight ${s.big ? "text-2xl @3xl:text-3xl" : "text-lg"}`}
                >
                  {s.name}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${s.big ? "opacity-85" : "text-zinc-600"}`}
                >
                  {s.text}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Share your papers",
    text: "Upload photos of what the seller gave you. We tell you what is missing.",
  },
  {
    title: "We search the records",
    text: "Registrar, revenue and court records, in person where it matters.",
  },
  {
    title: "Site and approval check",
    text: "The building is matched against the plan the authority sanctioned.",
  },
  {
    title: "Your legal opinion",
    text: "Signed by a senior advocate, explained on a call, ready for your bank.",
  },
];

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 50%"],
  });
  return (
    <section id="process" className="bg-zinc-50 py-20 @3xl:py-28">
      <div ref={ref} className="mx-auto max-w-6xl px-5">
        <motion.h2
          {...reveal}
          className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
        >
          Four steps, one week, no surprises.
        </motion.h2>
        <div className="relative mt-14">
          <div className="absolute top-5 right-0 left-0 hidden h-0.5 bg-zinc-200 @3xl:block" />
          <motion.div
            className="absolute top-5 left-0 hidden h-0.5 w-full origin-left bg-(--p) @3xl:block"
            style={{ scaleX: scrollYProgress }}
          />
          <ol className="grid gap-10 @3xl:grid-cols-4 @3xl:gap-6">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.1 }}
                className="relative"
              >
                <span className="relative grid size-10 place-items-center rounded-full bg-white text-sm font-bold text-(--p-dark) ring-2 ring-(--p)">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-zinc-600">
                  {s.text}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / 1400);
        setValue(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);
  return (
    <span ref={ref}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* Sample figures for the template: replace with the firm's own. */
const NUMBERS = [
  { to: 4860, suffix: "+", label: "Properties verified" },
  { to: 27, label: "Years in property law" },
  { to: 7, label: "Working days to an opinion" },
  { to: 0, label: "Hidden fees" },
];

function Numbers() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 @2xl:grid-cols-2 @4xl:grid-cols-4">
        {NUMBERS.map((n) => (
          <motion.div key={n.label} {...reveal}>
            <p className="text-5xl font-semibold tracking-tight text-zinc-900 tabular-nums">
              <Counter to={n.to} suffix={n.suffix} />
            </p>
            <p className="mt-2 text-sm text-zinc-600">{n.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    quote:
      "They found a bank charge the seller never mentioned. It was cleared before we paid a rupee.",
    who: "Home buyer, Kondapur",
  },
  {
    quote:
      "I was abroad for all of it. Every update came on WhatsApp and the opinion was ready in a week.",
    who: "NRI buyer, Dubai",
  },
  {
    quote:
      "The plan showed four floors, the building had five. That one check saved our savings.",
    who: "First-time buyer, Whitefield",
  },
];

function Reviews() {
  return (
    <section id="reviews" className="bg-(--p-light) py-20 @3xl:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          {...reveal}
          className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
        >
          Buyers who checked first.
        </motion.h2>
        <div className="mt-12 grid gap-5 @3xl:grid-cols-[1.3fr_1fr]">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.who}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className={`rounded-3xl bg-white p-7 ${i === 0 ? "@3xl:row-span-2 @3xl:p-10" : ""}`}
            >
              <blockquote
                className={`leading-snug font-medium tracking-tight text-zinc-900 ${
                  i === 0 ? "text-2xl @3xl:text-3xl" : "text-lg"
                }`}
              >
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm text-zinc-500">
                {r.who}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "What do I need to send you?",
    a: "Whatever the seller has shared: the sale deed, previous deeds, tax receipts and the approved plan. Photos are fine to start; we will tell you what is missing.",
  },
  {
    q: "How long does verification take?",
    a: "Seven working days for most flats and plots. Older or inherited properties can take longer, and we tell you on day one if yours will.",
  },
  {
    q: "Will my bank accept your legal opinion?",
    a: "Yes. We write it in the format banks and housing finance companies ask for, and we answer their lawyers' questions directly.",
  },
  {
    q: "What if you find a problem?",
    a: "We explain it plainly, tell you whether it can be fixed, and what to ask the seller for. Many issues are cleared before the sale.",
  },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-white py-20 @3xl:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <motion.h2
          {...reveal}
          className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
        >
          Questions buyers ask us.
        </motion.h2>
        <ul className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
          {FAQS.map((f, i) => (
            <li key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-zinc-900"
              >
                {f.q}
                <motion.span
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-lg leading-none text-zinc-700"
                  animate={{ rotate: open === i ? 45 : 0 }}
                  aria-hidden
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[60ch] pb-5 text-sm leading-relaxed text-zinc-600">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section id="start" className="bg-white px-5 pb-20">
      <motion.div
        {...reveal}
        className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[2rem] bg-zinc-900 p-8 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:p-14"
      >
        <div>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white @3xl:text-4xl">
            Send us the papers before you pay the advance.
          </h2>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-zinc-400">
            A first look at your documents is free, and we reply within one
            working day.
          </p>
        </div>
        <motion.a
          href="#start"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-(--p) px-7 py-3.5 text-sm font-semibold whitespace-nowrap text-(--p-on)"
        >
          Verify my property
        </motion.a>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 @3xl:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-base font-semibold text-zinc-900">{BRAND}</p>
          <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-zinc-600">
            Advocates for property purchase, title and registration.
          </p>
        </div>
        <div className="text-sm text-zinc-600">
          <p className="font-semibold text-zinc-900">Office</p>
          <p className="mt-2">Road No. 12, Banjara Hills</p>
          <p>Hyderabad 500034</p>
        </div>
        <div className="text-sm text-zinc-600">
          <p className="font-semibold text-zinc-900">Contact</p>
          <p className="mt-2">hello@vidhilegal.in</p>
          <p>Mon to Sat, 10am to 7pm</p>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-zinc-500">
        As per the rules of the Bar Council of India, this website is for
        information only and is not an advertisement or a solicitation of work.
      </p>
    </footer>
  );
}

export function LawFirmScrollSite() {
  const ref = useRef<HTMLDivElement>(null);
  const [colours, setColours] = useState<Colours>({
    p: "#1f5f8b",
    pDark: "#163f5c",
    pLight: "#e3eef6",
    s: "#c2410c",
  });

  // Colours from the palette variables, read once on mount (the Animations
  // tab remounts it when the palette changes).
  useEffect(() => {
    if (!ref.current) return;
    const css = getComputedStyle(ref.current);
    const read = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;
    setColours((c) => ({
      p: read("--p", c.p),
      pDark: read("--p-dark", c.pDark),
      pLight: read("--p-light", c.pLight),
      s: read("--s", c.s),
    }));
  }, []);

  return (
    <div ref={ref} className="@container bg-white">
      <Nav />
      <Stage colours={colours} />
      <Services />
      <Process />
      <Numbers />
      <Reviews />
      <Faq />
      <Closing />
      <Footer />
    </div>
  );
}
