"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import * as THREE from "three";
import { ASSET, container, display, reveal } from "./DeedsParts";
import { paperTexture, roundedSlab, texture } from "./LawFirmScrollSite";

/**
 * The Deeds & Co. home page's opening, on the pattern of gokiwi.in, where
 * one card carries the reader down the page: the film under a tinted panel
 * that slides up over it, a paragraph that fills in word by word, and then
 * the client's title file, in live 3D, travelling through the sections.
 *
 * It drops in tumbling through a soft haze as the paragraph finishes, then
 * rests beside each step and flies across to the next one: in at the front
 * desk, spun round to the associate's desk, opened on the sale deed and the
 * EC, then on the RTC, e-Khata and sanctioned plan, closed and stamped with
 * the firm's seal, and finally dropped into a phone as the signed opinion.
 *
 * Where the file rests is measured from the sections themselves, so the
 * words and the file stay together however the text wraps; the scroll
 * position is the playhead, and the scene eases towards it every frame, so
 * a mouse wheel that jumps still plays smoothly and scrolling up runs it
 * backwards. On a phone the file keeps to the top of the screen and each
 * step's words sit on a card at the bottom.
 */

export type JourneyStep = { title: string; text: string; points?: string[] };

export type JourneyCopy = {
  title: string;
  body: string;
  primary: string;
  secondary: string;
  /** The paragraph that fills in; words in `accent` fill in maroon. */
  fill: string;
  accent: string;
  last: string;
};

const MAROON = "#7a0204";
const MAROON_DEEP = "#5e0103";
const RIBBON = "#b08968";
const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";

const PAPERS = [
  ["SALE DEED", "Registered in Kaveri"],
  ["ENCUMBRANCE CERTIFICATE", "Form 15, thirty years"],
  ["RTC AND E-KHATA", "Bhoomi and BBMP records"],
  ["SANCTIONED PLAN", "BBMP and BDA approval"],
] as const;

/* ------------------------------------------------------------------ */
/* Where the file is, step by step.                                    */
/* ------------------------------------------------------------------ */

/**
 * x is the side (-1 left, 1 right, scaled to the middle of that half), y
 * a share of half the screen's height, angles in radians. open swings the
 * cover, fanA and fanB lift the first and second pair of papers out,
 * stamp runs the stamp down and up again (the seal appears halfway),
 * phone raises the phone and deliver drops the file into it.
 */
type Pose = {
  x: number;
  y: number;
  s: number;
  rx: number;
  ry: number;
  rz: number;
  open: number;
  fanA: number;
  fanB: number;
  stamp: number;
  phone: number;
  deliver: number;
};

const REST: Pose = {
  x: 0,
  y: 0,
  s: 1,
  rx: 0.1,
  ry: 0,
  rz: 0,
  open: 0,
  fanA: 0,
  fanB: 0,
  stamp: 0,
  phone: 0,
  deliver: 0,
};
const pose = (p: Partial<Pose>): Pose => ({ ...REST, ...p });
const TURN = Math.PI * 2;

/** Above the screen, then big and tilted as it falls past the paragraph. */
const ABOVE = pose({ x: 0.4, y: 1.9, s: 1.25, rx: 1.3, ry: 0.5, rz: -1.1 });
const FALLING = pose({ y: 0.05, s: 1.45, rx: 0.8, ry: -0.3, rz: -0.55 });

/** Each step's pose as its words come in and as they leave. */
const STEP_POSES: [Pose, Pose][] = [
  // In at the front desk: closed, the label showing.
  [
    pose({ x: -1, rx: 0.12, ry: 0.42, rz: -0.06 }),
    pose({ x: -1, rx: 0.12, ry: 0.36, rz: -0.04 }),
  ],
  // Spun round once on its way to the associate's desk.
  [
    pose({ x: 1, rx: 0.1, ry: -0.42 - TURN, rz: 0.06 }),
    pose({ x: 1, rx: 0.1, ry: -0.36 - TURN, rz: 0.04 }),
  ],
  // Opened on the records: the sale deed and the EC.
  [
    pose({
      x: -0.6,
      y: -0.12,
      s: 0.86,
      rx: -0.3,
      ry: 0.22 - TURN,
      open: 1,
      fanA: 1,
    }),
    pose({
      x: -0.6,
      y: -0.12,
      s: 0.86,
      rx: -0.3,
      ry: 0.18 - TURN,
      open: 1,
      fanA: 1,
    }),
  ],
  // The RTC, e-Khata and the sanctioned plan.
  [
    pose({
      x: 1,
      y: -0.12,
      s: 0.86,
      rx: -0.3,
      ry: -0.22 - TURN,
      open: 1,
      fanB: 1,
    }),
    pose({
      x: 1,
      y: -0.12,
      s: 0.86,
      rx: -0.3,
      ry: -0.18 - TURN,
      open: 1,
      fanB: 1,
    }),
  ],
  // Closed, and stamped in the cabin.
  [
    pose({ x: -1, rx: -0.45, ry: 0.3 - TURN, rz: -0.04 }),
    pose({ x: -1, rx: -0.45, ry: 0.22 - TURN, rz: -0.03, stamp: 1 }),
  ],
  // Into the phone, as the signed opinion.
  [
    pose({
      x: 1,
      y: 0.1,
      s: 0.9,
      rx: 0.05,
      ry: -TURN,
      stamp: 1,
      phone: 1,
      deliver: 0.35,
    }),
    pose({
      x: 1,
      y: 0.1,
      s: 0.9,
      rx: 0.05,
      ry: -TURN,
      stamp: 1,
      phone: 1,
      deliver: 1,
    }),
  ],
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (v: number, a: number, b: number) =>
  b > a ? clamp01((v - a) / (b - a)) : v >= b ? 1 : 0;
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const backOut = (x: number) => {
  if (x <= 0) return 0;
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

/** The pose at scroll position `y`, and whether the file is between rests. */
function poseAt(y: number, stops: number[], poses: Pose[]) {
  if (y <= stops[0]) return { pose: poses[0], moving: 0, segment: -1 };
  for (let k = 0; k < stops.length - 1; k++) {
    if (y <= stops[k + 1]) {
      const t = smooth(seg(y, stops[k], stops[k + 1]));
      const a = poses[k];
      const b = poses[k + 1];
      const mixed = Object.fromEntries(
        (Object.keys(a) as (keyof Pose)[]).map((key) => [
          key,
          lerp(a[key], b[key], t),
        ]),
      ) as Pose;
      // Odd segments after the fall are the flights between steps.
      const flight = k < 2 || k % 2 === 1;
      return {
        pose: mixed,
        moving: flight ? Math.sin(Math.PI * t) : 0,
        segment: k,
      };
    }
  }
  return { pose: poses[poses.length - 1], moving: 0, segment: stops.length };
}

/* ------------------------------------------------------------------ */
/* Textures in the firm's colours.                                     */
/* ------------------------------------------------------------------ */

function labelTexture() {
  return texture(560, 300, (c) => {
    c.fillStyle = "#fffaf8";
    c.beginPath();
    c.roundRect(0, 0, 560, 300, 28);
    c.fill();
    c.fillStyle = MAROON;
    c.font = `700 28px ${SANS}`;
    c.fillText("DEEDS & CO.  TITLE FILE", 44, 76);
    c.fillStyle = "#2a0a0c";
    c.font = `700 44px ${SANS}`;
    c.fillText("Site No. 42, HSR Layout", 44, 150);
    c.fillStyle = "#5c4446";
    c.font = `500 30px ${SANS}`;
    c.fillText("Sale purchase, Bengaluru", 44, 204);
    c.fillText("Thirty-year title search", 44, 250);
  });
}

function sealTexture() {
  return texture(400, 400, (c) => {
    c.strokeStyle = MAROON;
    c.lineWidth = 14;
    c.beginPath();
    c.arc(200, 200, 182, 0, Math.PI * 2);
    c.stroke();
    c.lineWidth = 4;
    c.beginPath();
    c.arc(200, 200, 154, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = "rgba(122,2,4,0.1)";
    c.beginPath();
    c.arc(200, 200, 150, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = MAROON;
    c.textAlign = "center";
    c.font = `800 40px ${SANS}`;
    c.fillText("DEEDS & CO.", 200, 140);
    c.font = `800 52px ${SANS}`;
    c.fillText("TITLE", 200, 296);
    c.font = `700 30px ${SANS}`;
    c.fillText("CLEAR", 200, 332);
    c.lineWidth = 16;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(150, 205);
    c.lineTo(186, 240);
    c.lineTo(252, 170);
    c.stroke();
  });
}

function tickTexture() {
  return texture(200, 200, (c) => {
    c.fillStyle = MAROON;
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

function screenTexture() {
  return texture(500, 1000, (c) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, 500, 1000);
    c.fillStyle = MAROON;
    c.fillRect(0, 0, 500, 150);
    c.fillStyle = "#ffffff";
    c.font = `700 34px ${SANS}`;
    c.fillText("Deeds & Co.", 40, 100);
    c.fillStyle = "#faf1f0";
    c.beginPath();
    c.arc(250, 330, 96, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = MAROON;
    c.beginPath();
    c.arc(250, 330, 66, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#ffffff";
    c.lineWidth = 14;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(218, 332);
    c.lineTo(242, 356);
    c.lineTo(286, 308);
    c.stroke();
    c.textAlign = "center";
    c.fillStyle = "#2a0a0c";
    c.font = `700 38px ${SANS}`;
    c.fillText("Title opinion signed", 250, 500);
    c.fillStyle = "#5c4446";
    c.font = `500 26px ${SANS}`;
    [
      "Thirty years of title, clear",
      "No encumbrances",
      "Khata and plan in order",
    ].forEach((line, i) => c.fillText(line, 250, 570 + i * 44));
    c.fillStyle = MAROON;
    c.beginPath();
    c.roundRect(60, 780, 380, 92, 46);
    c.fill();
    c.fillStyle = "#ffffff";
    c.font = `700 30px ${SANS}`;
    c.fillText("Download PDF", 250, 838);
  });
}

/* ------------------------------------------------------------------ */
/* The scene.                                                          */
/* ------------------------------------------------------------------ */

const FILE_W = 2.3;
const FILE_H = 3.0;
const PAPER_W = 1.5;
const PAPER_H = 2.0;
const SEAL_X = 0.42;
const SEAL_Y = -0.85;

function Scene({
  scrollY,
  stops,
  count,
  still,
}: {
  scrollY: MotionValue<number>;
  stops: React.RefObject<number[]>;
  count: number;
  still: boolean;
}) {
  const { viewport, size } = useThree();
  const file = useRef<THREE.Group>(null);
  const cover = useRef<THREE.Group>(null);
  const seal = useRef<THREE.Mesh>(null);
  const papers = useRef<(THREE.Group | null)[]>([]);
  const ticks = useRef<(THREE.Mesh | null)[]>([]);
  const stamp = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const played = useRef<number | null>(null);

  const poses = useMemo(
    () => [ABOVE, FALLING, ...STEP_POSES.slice(0, count).flat()],
    [count],
  );
  const tex = useMemo(
    () => ({
      papers: PAPERS.map(([title, sub]) => paperTexture(title, sub, MAROON)),
      label: labelTexture(),
      seal: sealTexture(),
      tick: tickTexture(),
      screen: screenTexture(),
    }),
    [],
  );
  const coverGeo = useMemo(() => roundedSlab(FILE_W, FILE_H, 0.08, 0.03), []);
  const phoneGeo = useMemo(() => roundedSlab(1.62, 3.3, 0.26, 0.14), []);

  useEffect(
    () => () => {
      [...tex.papers, tex.label, tex.seal, tex.tick, tex.screen].forEach((t) =>
        t.dispose(),
      );
      coverGeo.dispose();
      phoneGeo.dispose();
    },
    [tex, coverGeo, phoneGeo],
  );

  useFrame((state, dt) => {
    const at = stops.current;
    if (at.length !== poses.length) return;
    const target = scrollY.get();
    played.current ??= target;
    played.current = still
      ? target
      : played.current + (target - played.current) * Math.min(1, dt * 6);
    const { pose: p, moving, segment } = poseAt(played.current, at, poses);
    const t = state.clock.elapsedTime;
    const sway = still ? 0 : 1;
    const resting = segment >= 2 && segment % 2 === 0 ? 1 : 0;

    // Fit to the screen: a side each on a wide screen, the top on a phone.
    const narrow = size.width < 768;
    const halfW = viewport.width / 2;
    const halfH = viewport.height / 2;
    const S = narrow
      ? Math.min(halfW / 2.1, (halfH * 0.7) / FILE_H)
      : Math.min(1.1, halfW / 4.4, (halfH * 1.25) / FILE_H);
    const slotX = narrow ? 0 : halfW * 0.5;
    const baseY = narrow ? halfH * 0.38 : 0;
    const side = narrow ? 0.18 : 1;

    // The phone sits where the last step's file rests.
    const phoneX = p.x * slotX * side;
    const phoneY = lerp(-halfH * 2.2, baseY + p.y * halfH, p.phone);
    if (phone.current) {
      phone.current.visible = p.phone > 0.001;
      phone.current.position.set(phoneX, phoneY, 0.1);
      phone.current.scale.setScalar(S * 0.9);
      phone.current.rotation.set(
        lerp(-0.35, -0.05, p.phone),
        lerp(0.6, -0.12, p.phone),
        0,
      );
    }
    if (screenMat.current)
      screenMat.current.opacity = smooth(seg(p.deliver, 0.75, 1));

    // Opened, the file is twice as wide: on a phone it shrinks and moves
    // right so the cover, swung out to the left, stays on the screen.
    const opened = narrow ? smooth(p.open) : 0;
    const fit = lerp(1, 0.72, opened);
    const nudge = opened * FILE_W * S * fit * 0.5;

    const f = file.current;
    if (f) {
      const flight = smooth(seg(p.deliver, 0.35, 1));
      f.position.set(
        lerp(p.x * slotX * side + nudge, phoneX, flight),
        lerp(
          baseY + p.y * halfH + Math.sin(t * 1.1) * 0.06 * sway * resting,
          phoneY + 0.3 * S,
          flight,
        ),
        lerp(0, 0.5, flight),
      );
      f.rotation.set(
        p.rx + Math.sin(t * 0.8) * 0.03 * sway * resting,
        p.ry + Math.sin(t * 0.6) * 0.07 * sway * resting,
        p.rz + moving * 0.35 * sway,
      );
      // Shrinks into the phone and is gone once it is in.
      const into = lerp(1, 0.3, flight) * (1 - smooth(seg(p.deliver, 0.9, 1)));
      f.scale.setScalar(Math.max(0.0001, p.s * S * fit * into));
    }

    if (cover.current) cover.current.rotation.y = -2.5 * smooth(p.open);

    // Papers 0 and 1 lift out with fanA, 2 and 3 with fanB.
    papers.current.forEach((g, i) => {
      if (!g) return;
      const k = smooth(i < 2 ? p.fanA : p.fanB);
      g.visible = k > 0.002;
      const j = i % 2;
      g.position.set(
        lerp(0, (j - 0.5) * 1.65, k),
        lerp(0.1, 1.15, k),
        lerp(0.05, 0.7 + j * 0.08, k),
      );
      g.rotation.set(
        lerp(0, 0.38, k),
        (j - 0.5) * -0.2 * k,
        (j - 0.5) * -0.12 * k,
      );
      g.scale.setScalar(lerp(0.85, 1, k));
      const tick = ticks.current[i];
      if (tick)
        tick.scale.setScalar(
          Math.max(0.0001, backOut(seg(k, 0.8 + j * 0.08, 1))),
        );
    });

    // The stamp comes down on the cover, and the seal is left behind.
    const down = smooth(seg(p.stamp, 0, 0.45));
    const up = smooth(seg(p.stamp, 0.55, 1));
    if (stamp.current) {
      stamp.current.visible = p.stamp > 0.001 && p.stamp < 0.999;
      stamp.current.position.set(
        SEAL_X,
        SEAL_Y,
        lerp(lerp(3.2, 0.2, down), 3.2, up),
      );
      stamp.current.rotation.z = lerp(0.5, 0, down);
    }
    if (seal.current)
      seal.current.scale.setScalar(
        Math.max(0.0001, backOut(seg(p.stamp, 0.45, 0.6))),
      );
  });

  return (
    <>
      {/* The title file. */}
      <group ref={file}>
        <mesh geometry={coverGeo} position={[0, 0, -0.06]}>
          <meshPhysicalMaterial
            color={MAROON_DEEP}
            roughness={0.55}
            clearcoat={0.4}
          />
        </mesh>
        <mesh position={[0.03, -0.02, 0.03]}>
          <boxGeometry args={[FILE_W - 0.16, FILE_H - 0.14, 0.1]} />
          <meshStandardMaterial color="#f6f1ee" roughness={0.9} />
        </mesh>

        {/* The papers, lifted out of the file in pairs. */}
        {PAPERS.map(([title], i) => (
          <group
            key={title}
            ref={(g) => {
              papers.current[i] = g;
            }}
            visible={false}
          >
            <mesh>
              <boxGeometry args={[PAPER_W, PAPER_H, 0.012]} />
              <meshStandardMaterial attach="material-0" color="#e7e1df" />
              <meshStandardMaterial attach="material-1" color="#e7e1df" />
              <meshStandardMaterial attach="material-2" color="#e7e1df" />
              <meshStandardMaterial attach="material-3" color="#e7e1df" />
              <meshStandardMaterial
                attach="material-4"
                map={tex.papers[i]}
                roughness={0.85}
              />
              <meshStandardMaterial attach="material-5" color="#fbf8f7" />
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

        {/* The front cover, hinged on its left edge. */}
        <group ref={cover} position={[-FILE_W / 2, 0, 0.12]}>
          <group position={[FILE_W / 2, 0, 0]}>
            <mesh geometry={coverGeo}>
              <meshPhysicalMaterial
                color={MAROON}
                roughness={0.45}
                clearcoat={0.6}
                clearcoatRoughness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.62, 0.062]}>
              <planeGeometry args={[1.7, 0.91]} />
              <meshStandardMaterial map={tex.label} roughness={0.7} />
            </mesh>
            {/* The ribbon that ties a legal file. */}
            <mesh position={[0, -0.12, 0.058]}>
              <boxGeometry args={[FILE_W + 0.02, 0.12, 0.02]} />
              <meshStandardMaterial color={RIBBON} roughness={0.5} />
            </mesh>
            <mesh ref={seal} position={[SEAL_X, SEAL_Y, 0.08]} scale={0.0001}>
              <planeGeometry args={[1.05, 1.05]} />
              <meshBasicMaterial map={tex.seal} transparent />
            </mesh>
            {/* The stamp: a handle over a round base, face down. */}
            <group ref={stamp} visible={false}>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
                <cylinderGeometry args={[0.5, 0.52, 0.2, 48]} />
                <meshPhysicalMaterial
                  color="#2a0a0c"
                  roughness={0.35}
                  clearcoat={1}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
                <cylinderGeometry args={[0.16, 0.22, 0.6, 32]} />
                <meshPhysicalMaterial
                  color="#45100f"
                  roughness={0.3}
                  clearcoat={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.86]}>
                <sphereGeometry args={[0.26, 32, 32]} />
                <meshPhysicalMaterial
                  color={RIBBON}
                  roughness={0.3}
                  clearcoat={1}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* The phone the signed opinion arrives on. */}
      <group ref={phone} visible={false}>
        <mesh geometry={phoneGeo}>
          <meshPhysicalMaterial color="#180506" roughness={0.3} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[1.46, 3.12]} />
          <meshBasicMaterial color="#f6f1ee" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.46, 2.92]} />
          <meshBasicMaterial
            ref={screenMat}
            map={tex.screen}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh position={[0, 1.42, 0.106]}>
          <planeGeometry args={[0.42, 0.1]} />
          <meshBasicMaterial color="#180506" />
        </mesh>
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The page's opening: film, panel, paragraph and steps.               */
/* ------------------------------------------------------------------ */

function Hero({ copy, covered }: { copy: JourneyCopy; covered: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const still = useReducedMotion() ?? false;

  // Plays only while it can be seen, and never under reduced motion.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (covered || still) el.pause();
    else el.play().catch(() => undefined);
  }, [covered, still]);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="sticky top-(--hh) isolate flex h-[calc(100svh-var(--hh))] min-h-[30rem] items-center overflow-clip bg-[#180506] pb-[14vh] text-white"
    >
      <video
        ref={video}
        className="absolute inset-0 -z-20 size-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
        poster={`${ASSET}/hero-poster.webp`}
        aria-hidden
      >
        <source
          src={`${ASSET}/hero-mobile.webm`}
          type="video/webm"
          media="(max-width: 640px)"
        />
        <source
          src={`${ASSET}/hero-mobile.mp4`}
          type="video/mp4"
          media="(max-width: 640px)"
        />
        <source src={`${ASSET}/hero.webm`} type="video/webm" />
        <source src={`${ASSET}/hero.mp4`} type="video/mp4" />
      </video>
      {/* Dark from the left, and darker towards the panel below. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(24_5_6/0.35)_0%,rgb(24_5_6/0.15)_45%,#180506_100%)] @3xl:bg-[linear-gradient(to_right,rgb(24_5_6/0.82)_0%,rgb(24_5_6/0.45)_45%,rgb(24_5_6/0.1)_75%),linear-gradient(to_bottom,transparent_55%,#180506_100%)]"
      />
      <motion.div
        className={container}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          className={`${display} max-w-2xl text-4xl leading-[1.06] font-semibold tracking-tight text-balance @3xl:text-6xl`}
        >
          {copy.title}
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 @3xl:text-lg">
          {copy.body}
        </p>
        <div className="mt-8 flex flex-col gap-3 @xl:flex-row">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#5e0103] transition hover:bg-[#f3cfc6] active:scale-[0.98]"
          >
            {copy.primary} <ArrowRight className="size-4" />
          </a>
          <a
            href="#practices"
            className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 active:scale-[0.98]"
          >
            {copy.secondary}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Word({
  word,
  accent,
  progress,
  range,
}: {
  word: string;
  accent: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={accent ? "text-[#7a0204]" : undefined}
    >
      {word}{" "}
    </motion.span>
  );
}

/** The paragraph, pinned while it fills, then lifting away for the file. */
const FillParagraph = ({
  copy,
  ref,
}: {
  copy: JourneyCopy;
  ref: React.RefObject<HTMLElement | null>;
}) => {
  const still = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const words = copy.fill.split(" ");
  const start = copy.fill.indexOf(copy.accent);
  const accentFrom = copy.fill.slice(0, start).split(" ").length - 1;
  const accentTo = accentFrom + copy.accent.split(" ").length;
  const leave = useTransform(scrollYProgress, [0.72, 0.92], [1, 0]);
  const lift = useTransform(scrollYProgress, [0.72, 0.92], [0, -60]);
  const fill = 0.65 / words.length;

  return (
    <section ref={ref} aria-label="Our standard" className="relative h-[260vh]">
      <div className="sticky top-(--hh) flex h-[calc(100vh-var(--hh))] items-center">
        <motion.p
          style={still ? undefined : { opacity: leave, y: lift }}
          className={`${container} max-w-6xl text-center ${display} text-3xl leading-[1.18] font-semibold tracking-tight text-balance text-[#2a0a0c] @3xl:text-5xl @7xl:text-6xl`}
        >
          {words.map((word, i) =>
            still ? (
              <span
                key={i}
                className={
                  i >= accentFrom && i < accentTo ? "text-[#7a0204]" : undefined
                }
              >
                {word}{" "}
              </span>
            ) : (
              <Word
                key={i}
                word={word}
                accent={i >= accentFrom && i < accentTo}
                progress={scrollYProgress}
                range={[0.04 + i * fill, 0.04 + (i + 1.5) * fill]}
              />
            ),
          )}
        </motion.p>
      </div>
    </section>
  );
};

/** Soft haze drifting past at its own pace, the page's version of clouds. */
function Haze({ scrollY }: { scrollY: MotionValue<number> }) {
  const slow = useTransform(scrollY, (v) => -v * 0.08);
  const fast = useTransform(scrollY, (v) => -v * 0.16);
  return (
    <>
      <motion.div
        style={{ y: slow }}
        className="absolute -top-[10%] -left-[10%] size-[60vmax] rounded-full bg-white/80 blur-[90px]"
      />
      <motion.div
        style={{ y: fast }}
        className="absolute top-[60%] right-[-15%] size-[55vmax] rounded-full bg-white/70 blur-[100px]"
      />
      <motion.div
        style={{ y: slow }}
        className="absolute top-[130%] left-[20%] size-[50vmax] rounded-full bg-[#f3cfc6]/50 blur-[110px]"
      />
      <motion.div
        style={{ y: fast }}
        className="absolute top-[210%] left-[-10%] size-[45vmax] rounded-full bg-white/80 blur-[90px]"
      />
    </>
  );
}

function StepBlock({
  step,
  index,
  last,
  lastLabel,
  ref,
}: {
  step: JourneyStep;
  index: number;
  last: boolean;
  lastLabel: string;
  ref: (el: HTMLDivElement | null) => void;
}) {
  // The file rests on the left for even steps, so the words take the right.
  const right = index % 2 === 0;
  return (
    <section className="relative flex min-h-[125vh] items-center">
      <div className={`${container} grid @3xl:grid-cols-2 @3xl:gap-16`}>
        <motion.div
          ref={ref}
          {...reveal}
          className={`rounded-3xl bg-white/85 p-6 shadow-[0_20px_50px_-30px_rgb(94_1_3/0.35)] backdrop-blur-md @3xl:bg-transparent @3xl:p-0 @3xl:shadow-none @3xl:backdrop-blur-none ${right ? "@3xl:col-start-2" : "@3xl:col-start-1"} @3xl:max-w-xl`}
        >
          <h2
            className={`${display} text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-[#2a0a0c] @3xl:text-5xl`}
          >
            {step.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5c4446] @3xl:text-lg">
            {step.text}
          </p>
          {step.points && (
            <ul className="mt-6 grid gap-2.5">
              {step.points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-[0.9375rem] font-medium text-[#2a0a0c]"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#7a0204] text-white">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          )}
          {last && (
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#7a0204] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5e0103] active:scale-[0.98]"
            >
              {lastLabel} <ArrowRight className="size-4" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function FileJourney({
  steps,
  copy,
}: {
  steps: JourneyStep[];
  copy: JourneyCopy;
}) {
  const still = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const journey = useRef<HTMLDivElement>(null);
  const paragraph = useRef<HTMLElement>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const stops = useRef<number[]>([]);
  const [covered, setCovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Where the file rests, measured in scroll positions from the sections:
  // above the screen while the paragraph fills, falling as it lifts away,
  // then for each step a pair of stops around its words.
  useEffect(() => {
    const root = journey.current;
    if (!root) return;
    const measure = () => {
      const p = paragraph.current;
      if (!p) return;
      const vh = window.innerHeight;
      const hh =
        parseFloat(getComputedStyle(root).getPropertyValue("--hh")) * 16 || 0;
      const top = (el: HTMLElement) =>
        el.getBoundingClientRect().top + window.scrollY;
      const pTop = top(p);
      const pEnd = pTop + p.offsetHeight - vh;
      const out = [pTop + (pEnd - pTop) * 0.74, pEnd + vh * 0.2];
      // The words sit mid-screen beside the file, or low on a phone
      // with the file above them.
      const at = root.clientWidth < 768 ? 0.68 : 0.5;
      for (const el of blocks.current) {
        if (!el) continue;
        const centre = top(el) + el.offsetHeight / 2 - hh - (vh - hh) * at;
        out.push(centre - vh * 0.22, centre + vh * 0.22);
      }
      stops.current = out;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(root);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The film stops once the panel has covered it.
  useMotionValueEvent(scrollY, "change", (y) => {
    const root = journey.current;
    if (!root) return;
    const next =
      root.getBoundingClientRect().top + y - window.innerHeight * 0.3 < y;
    if (next !== covered) setCovered(next);
  });

  return (
    <div>
      <Hero copy={copy} covered={covered} />

      {/* The panel that slides up over the film and carries the file. */}
      <div
        ref={journey}
        className="relative z-10 -mt-[14vh] overflow-clip rounded-t-[2rem] bg-[#faf1f0] @3xl:rounded-t-[4rem]"
      >
        <div
          aria-hidden
          className="pointer-events-none sticky top-(--hh) mb-[calc(var(--hh)-100vh)] h-[calc(100vh-var(--hh))]"
        >
          <Haze scrollY={scrollY} />
          <Canvas
            className="!absolute inset-0"
            dpr={[1, 2]}
            camera={{ fov: 35, position: [0, 0, 10] }}
            frameloop={visible ? "always" : "never"}
            gl={{ antialias: true, alpha: true }}
          >
            <hemisphereLight args={["#ffffff", "#e7d6d3", 1.5]} />
            <directionalLight position={[3, 5, 7]} intensity={2.2} />
            <directionalLight position={[-4, -2, 4]} intensity={0.6} />
            <Scene
              scrollY={scrollY}
              stops={stops}
              count={steps.length}
              still={still}
            />
          </Canvas>
        </div>

        <FillParagraph copy={copy} ref={paragraph} />
        {steps.map((step, i) => (
          <StepBlock
            key={step.title}
            step={step}
            index={i}
            last={i === steps.length - 1}
            lastLabel={copy.last}
            ref={(el) => {
              blocks.current[i] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
