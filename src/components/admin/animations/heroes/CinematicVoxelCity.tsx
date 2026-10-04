"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { motion, useReducedMotion } from "motion/react";
import * as THREE from "three";

const COLS = 46;
const ROWS = 46;
const GAP = 1.08;

/** A cheap repeatable 0–1 hash, so the glowing blocks stay put. */
const hash = (x: number, z: number) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Block height: a slow swell rolling across the field, plus fixed jitter. */
const heightAt = (x: number, z: number, t: number) =>
  0.35 +
  Math.max(0, Math.sin(x * 0.32 + t * 0.55) * Math.cos(z * 0.28 - t * 0.4)) *
    2.4 +
  hash(x, z) * 0.7;

type Cell = { x: number; z: number };

// Which blocks glow never changes, so the split is worked out once, and
// one scratch object positions every block each frame.
const DARK: Cell[] = [];
const LIT: Cell[] = [];
for (let x = 0; x < COLS; x++)
  for (let z = 0; z < ROWS; z++)
    (hash(x, z) > 0.955 ? LIT : DARK).push({ x, z });
const dummy = new THREE.Object3D();

function Field({ glow, speed }: { glow: string; speed: number }) {
  const dark = useRef<THREE.InstancedMesh>(null);
  const lit = useRef<THREE.InstancedMesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    const place = (
      mesh: THREE.InstancedMesh | null,
      cells: Cell[],
      extra: number,
    ) => {
      if (!mesh) return;
      cells.forEach((c, i) => {
        const h =
          heightAt(c.x, c.z, t) +
          extra * (0.9 + Math.sin(t * 1.6 + c.x * 0.7) * 0.6);
        dummy.position.set(
          (c.x - COLS / 2) * GAP,
          h / 2,
          (c.z - ROWS / 2) * GAP,
        );
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    place(dark.current, DARK, 0);
    place(lit.current, LIT, 1);
  });

  return (
    <>
      <instancedMesh ref={dark} args={[undefined, undefined, DARK.length]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#30343b"
          roughness={0.42}
          metalness={0.35}
        />
      </instancedMesh>
      <instancedMesh ref={lit} args={[undefined, undefined, LIT.length]}>
        <boxGeometry />
        {/* Black base so the lights add nothing: the colour is all glow. */}
        <meshStandardMaterial
          color="#000000"
          emissive={glow}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}

/** Molten light running along the seams between the blocks. */
function Beams({ glow, speed }: { glow: string; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const span = COLS * GAP;
  const beams = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        alongX: i % 2 === 0,
        lane:
          (Math.floor(hash(i, 3) * (COLS - 6)) + 3 - COLS / 2) * GAP + GAP / 2,
        offset: hash(i, 9) * span,
        rate: 5 + hash(i, 5) * 6,
        length: 3 + hash(i, 7) * 6,
      })),
    [span],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    group.current?.children.forEach((mesh, i) => {
      const b = beams[i];
      const run = ((t * b.rate + b.offset) % span) - span / 2;
      if (b.alongX) mesh.position.set(run, 0.7, b.lane);
      else mesh.position.set(b.lane, 0.7, run);
    });
  });

  // Pushed past 1 so the core burns white-hot and the bloom halos it.
  const hot = useMemo(() => new THREE.Color(glow).multiplyScalar(2.2), [glow]);

  return (
    <group ref={group}>
      {beams.map((b, i) => (
        <mesh key={i} rotation={[0, b.alongX ? 0 : Math.PI / 2, 0]}>
          <boxGeometry args={[b.length, 1.4, 0.06]} />
          <meshBasicMaterial color={hot} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** A slow, drifting camera, like a drone pass in a product film. */
function Rig({ speed }: { speed: number }) {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime * speed;
    camera.position.set(
      Math.sin(t * 0.07) * 9,
      6.5 + Math.sin(t * 0.11) * 1.5,
      15 + Math.cos(t * 0.07) * 3,
    );
    camera.lookAt(Math.sin(t * 0.05) * 2, 0, -5);
  });
  return null;
}

/**
 * A cinematic loop in the style of a 3D product film: a field of dark blocks
 * swelling like a city seen from a drone, a few glowing blocks pushing up
 * through it, light racing along the seams, and bloom, grain and a vignette
 * over the lot. Real-time three.js, not a video file, so it is a few
 * hundred kilobytes of script rather than tens of megabytes of footage, and
 * it takes the palette's colours.
 *
 * Rendering stops while the hero is off screen, and the motion freezes for
 * readers who ask for reduced motion.
 */
export function CinematicVoxelCity() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const speed = reduce ? 0 : 1;
  const [glow, setGlow] = useState("#f5a44a");
  const [visible, setVisible] = useState(true);

  // The glow comes from the palette's --t variable, read once on mount (the
  // Animations tab remounts the hero when the palette changes).
  useEffect(() => {
    const value = ref.current
      ? getComputedStyle(ref.current).getPropertyValue("--t").trim()
      : "";
    if (value) setGlow(value);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="@container relative isolate min-h-[36rem] overflow-hidden bg-[#07080a] text-white @3xl:min-h-[42rem]"
    >
      <Canvas
        className="!absolute inset-0 -z-10"
        dpr={[1, 1.75]}
        camera={{ fov: 42, position: [0, 6.5, 15] }}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false }}
      >
        <color attach="background" args={["#07080a"]} />
        <fog attach="fog" args={["#07080a", 14, 46]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[-10, 14, 8]}
          intensity={2.2}
          color="#c9d6ee"
        />
        <pointLight
          position={[0, 3, -2]}
          intensity={25}
          distance={18}
          color={glow}
        />
        <Field glow={glow} speed={speed} />
        <Beams glow={glow} speed={speed} />
        <Rig speed={speed} />
        <EffectComposer>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.2}
            mipmapBlur
          />
          <Noise opacity={0.06} />
          <Vignette offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#07080a] via-[#07080a]/30 to-transparent" />

      <div className="mx-auto flex min-h-[36rem] max-w-6xl flex-col justify-end px-5 pb-14 @3xl:min-h-[42rem] @3xl:pb-20">
        <motion.p
          className="text-xs font-semibold tracking-[0.3em] text-(--t) uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Security ecosystem
        </motion.p>
        <motion.h1
          className="mt-4 max-w-[18ch] text-4xl leading-[1.04] font-semibold tracking-tight @3xl:text-6xl"
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Every block of your network, watched in real time
        </motion.h1>
        <motion.div
          className="pointer-events-auto mt-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <motion.a
            href="#"
            className="rounded-full bg-(--t) px-6 py-3 text-sm font-semibold text-(--t-on)"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Request a threat audit
          </motion.a>
          <a
            href="#"
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
          >
            Watch the film
          </a>
        </motion.div>
      </div>
    </section>
  );
}
