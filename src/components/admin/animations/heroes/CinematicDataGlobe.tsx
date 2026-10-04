"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { motion, useReducedMotion } from "motion/react";
import * as THREE from "three";

const R = 2.5;

// Cities as [latitude, longitude]: Hyderabad first, then where it ships to.
const CITIES: [number, number][] = [
  [17.4, 78.5],
  [51.5, -0.1],
  [40.7, -74],
  [1.35, 103.8],
  [25.2, 55.3],
  [-33.9, 151.2],
  [35.7, 139.7],
  [52.5, 13.4],
  [37.8, -122.4],
  [-23.5, -46.6],
];
const ROUTES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [4, 7],
  [1, 8],
  [2, 9],
  [3, 6],
];

const toVec = ([lat, lon]: [number, number], r = R) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
};

/** Even dots over the sphere (a Fibonacci lattice), like a dotted map. */
function Dots() {
  const positions = useMemo(() => {
    const n = 4200;
    const out = new Float32Array(n * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      out.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
    }
    return out;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#5d6f8c" size={0.022} />
    </points>
  );
}

/** Arcs that draw themselves from Hyderabad outwards, then fade and repeat. */
function Arcs({ colours, speed }: { colours: string[]; speed: number }) {
  const lines = useMemo(
    () =>
      ROUTES.map(([a, b], i) => {
        const from = toVec(CITIES[a]);
        const to = toVec(CITIES[b]);
        const mid = from
          .clone()
          .add(to)
          .multiplyScalar(0.5)
          .setLength(R + from.distanceTo(to) * 0.35);
        const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
        const geo = new THREE.BufferGeometry().setFromPoints(
          curve.getPoints(80),
        );
        const mat = new THREE.LineBasicMaterial({
          color: new THREE.Color(colours[i % colours.length]).multiplyScalar(
            1.6,
          ),
          transparent: true,
          toneMapped: false,
        });
        return new THREE.Line(geo, mat);
      }),
    [colours],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    lines.forEach((line, i) => {
      // Each arc: draw for 1.6s, hold, fade, wait — offset from the others.
      const cycle = (t * 0.35 + i * 0.37) % 1;
      const drawn = Math.min(1, cycle / 0.45);
      line.geometry.setDrawRange(0, Math.floor(drawn * 81));
      (line.material as THREE.LineBasicMaterial).opacity =
        cycle < 0.7 ? 1 : Math.max(0, 1 - (cycle - 0.7) / 0.2);
    });
  });

  return (
    <>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}

function Pins({ glow, speed }: { glow: string; speed: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const hot = useMemo(() => new THREE.Color(glow).multiplyScalar(2), [glow]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    refs.current.forEach((m, i) =>
      m?.scale.setScalar(1 + Math.sin(t * 3 + i) * 0.35),
    );
  });
  return (
    <>
      {CITIES.map((c, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={toVec(c, R + 0.02)}
        >
          <sphereGeometry args={[i === 0 ? 0.07 : 0.045, 16, 16]} />
          <meshBasicMaterial color={hot} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function Globe({
  glow,
  second,
  speed,
}: {
  glow: string;
  second: string;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // Beside the text on a wide hero, behind it (and lower) on a narrow one.
  const wide = viewport.aspect > 1.15;
  const colours = useMemo(() => [glow, second], [glow, second]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12 * speed;
  });

  return (
    <group
      position={wide ? [viewport.width * 0.2, 0, 0] : [0, -1.4, 0]}
      rotation={[0.35, 0, 0.12]}
    >
      <group ref={group} rotation={[0, -1.4, 0]}>
        {/* Hides the dots on the far side, so the globe reads as solid. */}
        <mesh>
          <sphereGeometry args={[R - 0.02, 64, 64]} />
          <meshBasicMaterial color="#070b14" />
        </mesh>
        <Dots />
        <Arcs colours={colours} speed={speed} />
        <Pins glow={glow} speed={speed} />
      </group>
      {/* Atmosphere: a soft rim of light just outside the surface. */}
      <mesh scale={1.06}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/**
 * A slowly turning dotted globe with payment routes drawing themselves out
 * from Hyderabad, glowing pins pulsing at each city, and a faint atmosphere.
 * Arcs take the palette's primary and secondary colours. Rendering pauses
 * off screen; motion freezes for readers who ask for reduced motion.
 */
export function CinematicDataGlobe() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const speed = reduce ? 0 : 1;
  const [glow, setGlow] = useState("#1fa5de");
  const [second, setSecond] = useState("#7ed957");
  const [visible, setVisible] = useState(true);

  // Colours from the palette variables, read once on mount (the Animations
  // tab remounts the hero when the palette changes).
  useEffect(() => {
    if (!ref.current) return;
    const css = getComputedStyle(ref.current);
    const p = css.getPropertyValue("--p").trim();
    const s = css.getPropertyValue("--s").trim();
    if (p) setGlow(p);
    if (s) setSecond(s);
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
      className="@container relative isolate min-h-[36rem] overflow-hidden bg-[#070b14] text-white"
    >
      <Canvas
        className="!absolute inset-0 -z-10"
        dpr={[1, 1.75]}
        camera={{ fov: 40, position: [0, 0, 9] }}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#070b14"]} />
        <Globe glow={glow} second={second} speed={speed} />
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.5} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <div className="mx-auto flex min-h-[36rem] max-w-6xl flex-col justify-center px-5 py-14">
        <div className="max-w-xl">
          <motion.p
            className="text-xs font-semibold tracking-[0.3em] text-(--s) uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Cross-border payments
          </motion.p>
          <motion.h1
            className="mt-4 text-4xl leading-[1.04] font-semibold tracking-tight @3xl:text-6xl"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Get paid from 40 countries, settled in rupees by morning
          </motion.h1>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.a
              href="#"
              className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Open an account
            </motion.a>
            <span className="text-sm text-white/60">
              0.5% FX margin, no hidden fees
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
