"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { motion, useReducedMotion } from "motion/react";
import * as THREE from "three";

/** Repeatable 0–1 noise, so the particle cloud is the same on every render. */
const rand = (n: number) => {
  const s = Math.sin(n * 91.345 + 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

/** A shield outline: flat top with rounded shoulders, tapering to a point. */
function shieldShape() {
  const s = new THREE.Shape();
  s.moveTo(0, 1.6);
  s.bezierCurveTo(0.7, 1.35, 1.1, 1.3, 1.35, 1.3);
  s.bezierCurveTo(1.35, 0.2, 1.1, -0.9, 0, -1.7);
  s.bezierCurveTo(-1.1, -0.9, -1.35, 0.2, -1.35, 1.3);
  s.bezierCurveTo(-1.1, 1.3, -0.7, 1.35, 0, 1.6);
  return s;
}

function Shield({ glow, speed }: { glow: string; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const [body, edges, inset, front] = useMemo(() => {
    const shape = shieldShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 4,
      curveSegments: 32,
    });
    geo.center();
    geo.computeBoundingBox();
    // A smaller outline on the face, like an emblem inlaid in the metal.
    const ring = new THREE.BufferGeometry().setFromPoints(
      shape
        .getPoints(64)
        .map((pt) => new THREE.Vector3(pt.x * 0.68, pt.y * 0.68 - 0.02, 0)),
    );
    return [
      geo,
      new THREE.EdgesGeometry(geo, 30),
      ring,
      geo.boundingBox!.max.z + 0.01,
    ];
  }, []);
  const insetLine = useMemo(
    () =>
      new THREE.LineLoop(
        inset,
        new THREE.LineBasicMaterial({
          color: new THREE.Color(glow).multiplyScalar(2.4),
          toneMapped: false,
        }),
      ),
    [inset, glow],
  );
  const hot = useMemo(() => new THREE.Color(glow).multiplyScalar(2), [glow]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    if (!group.current) return;
    group.current.rotation.y = Math.sin(t * 0.5) * 0.55;
    group.current.position.y = Math.sin(t * 0.9) * 0.08;
  });

  return (
    <group ref={group}>
      {/* Pushed back a hair in depth so the glowing edges draw on top. */}
      <mesh geometry={body}>
        <meshStandardMaterial
          color="#2a3442"
          metalness={0.8}
          roughness={0.3}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <primitive object={insetLine} position={[0, 0, front]} />
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={hot} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

/** A geodesic cage turning slowly around the shield. */
function Cage({ glow, speed }: { glow: string; speed: number }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.6, 1)),
    [],
  );
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.12 * speed;
    ref.current.rotation.x += delta * 0.05 * speed;
  });
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial
        color={glow}
        transparent
        opacity={0.35}
        toneMapped={false}
      />
    </lineSegments>
  );
}

/** Thin rings orbiting on different tilts, and one scanning up and down. */
function Rings({ glow, speed }: { glow: string; speed: number }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const scan = useRef<THREE.Mesh>(null);
  const hot = useMemo(() => new THREE.Color(glow).multiplyScalar(1.8), [glow]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    // Spun about their own axis and only wobbled in tilt, so neither ever
    // turns edge-on into a stray line.
    if (a.current)
      a.current.rotation.set(1.25 + Math.sin(t * 0.4) * 0.15, 0.3, t * 0.6);
    if (b.current)
      b.current.rotation.set(1.6 + Math.cos(t * 0.3) * 0.2, -0.5, -t * 0.45);
    if (scan.current) {
      const y = Math.sin(t * 0.8) * 1.9;
      scan.current.position.y = y;
      const r = Math.sqrt(Math.max(0.05, 3.6 - y * y));
      scan.current.scale.setScalar(r / 1.9);
    }
  });

  return (
    <>
      <mesh ref={a}>
        <torusGeometry args={[3.3, 0.012, 8, 160]} />
        <meshBasicMaterial color={hot} toneMapped={false} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[3.7, 0.008, 8, 160]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.02, 8, 120]} />
        <meshBasicMaterial color={hot} toneMapped={false} />
      </mesh>
    </>
  );
}

/** A shell of drifting particles: the traffic being watched. */
function Particles({ glow, speed }: { glow: string; speed: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const out = new Float32Array(1800 * 3);
    for (let i = 0; i < 1800; i++) {
      const r = 4 + rand(i) * 4;
      const th = rand(i + 0.3) * Math.PI * 2;
      const ph = Math.acos(2 * rand(i + 0.7) - 1);
      out.set(
        [
          r * Math.sin(ph) * Math.cos(th),
          r * Math.cos(ph),
          r * Math.sin(ph) * Math.sin(th),
        ],
        i * 3,
      );
    }
    return out;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.03 * speed;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={glow}
        size={0.035}
        transparent
        opacity={0.7}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * A security film loop: a dark metal shield with glowing edges, turning
 * inside a geodesic cage, orbited by rings while a scanner sweeps up and
 * down it, in a cloud of drifting particles. The glow is the palette's
 * primary colour. Rendering pauses off screen; motion freezes for readers
 * who ask for reduced motion.
 */
export function CinematicShieldCore() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const speed = reduce ? 0 : 1;
  const [glow, setGlow] = useState("#1fa5de");
  const [visible, setVisible] = useState(true);

  // The glow comes from the palette's --p variable, read once on mount (the
  // Animations tab remounts the hero when the palette changes).
  useEffect(() => {
    const value = ref.current
      ? getComputedStyle(ref.current).getPropertyValue("--p").trim()
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
      className="@container relative isolate overflow-hidden bg-[#05070b] text-white"
    >
      <div className="mx-auto grid min-h-[36rem] max-w-6xl items-center gap-6 px-5 py-14 @3xl:grid-cols-[1fr_1.1fr] @3xl:py-10">
        <div className="relative z-10">
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-(--p)" />
            Threats blocked today: 12,408
          </motion.p>
          <motion.h1
            className="mt-6 text-4xl leading-[1.04] font-semibold tracking-tight @3xl:text-6xl"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Zero trust. Zero gaps. Zero downtime.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[42ch] text-base leading-relaxed text-white/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Endpoint, cloud and identity protection that watches every request
            and answers in milliseconds, not after the breach report.
          </motion.p>
          <motion.a
            href="#"
            className="mt-8 inline-block rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Book a security review
          </motion.a>
        </div>

        <motion.div
          className="relative h-80 @3xl:h-[34rem]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Canvas
            className="!absolute inset-0"
            dpr={[1, 1.75]}
            camera={{ fov: 40, position: [0, 0.4, 10] }}
            frameloop={visible ? "always" : "never"}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[4, 6, 5]} intensity={2.5} />
            <pointLight position={[-4, -2, 3]} intensity={30} color={glow} />
            <Shield glow={glow} speed={speed} />
            <Cage glow={glow} speed={speed} />
            <Rings glow={glow} speed={speed} />
            <Particles glow={glow} speed={speed} />
            <EffectComposer>
              <Bloom intensity={1.1} luminanceThreshold={0.6} mipmapBlur />
              <Vignette offset={0.3} darkness={0.6} />
            </EffectComposer>
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
