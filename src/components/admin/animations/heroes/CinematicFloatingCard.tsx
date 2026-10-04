"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "motion/react";
import * as THREE from "three";

/** A rounded rectangle, extruded and bevelled into a card. */
function cardGeometry() {
  const w = 3.4;
  const h = 2.14;
  const r = 0.22;
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
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 6,
    curveSegments: 24,
  });
  geo.center();
  return geo;
}

function Card({ colour, speed }: { colour: string; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => cardGeometry(), []);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime * speed;
    const g = group.current;
    if (!g) return;
    // Its own slow sway, nudged towards wherever the pointer is.
    const targetY = -0.45 + Math.sin(t * 0.6) * 0.35 + pointer.x * 0.35;
    const targetX = 0.35 + Math.sin(t * 0.8) * 0.12 - pointer.y * 0.25;
    g.rotation.y += (targetY - g.rotation.y) * 0.06;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.rotation.z = -0.18 + Math.sin(t * 0.5) * 0.05;
    g.position.y = Math.sin(t * 1.1) * 0.12;
  });

  return (
    <group ref={group}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          color={colour}
          roughness={0.28}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {/* The chip. */}
      <mesh position={[-1.05, 0.25, 0.07]}>
        <boxGeometry args={[0.46, 0.36, 0.02]} />
        <meshStandardMaterial
          color="#e3c27a"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
      {/* An embossed mark, top left, and a stripe of lighter tone. */}
      <mesh position={[-1.15, 0.75, 0.065]}>
        <boxGeometry args={[0.32, 0.32, 0.015]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.6, -0.55, 0.062]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[2.6, 0.18, 0.01]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

type Toy = {
  shape: "coin" | "ball" | "ring" | "cube";
  colour: string;
  position: [number, number, number];
  size: number;
  phase: number;
};

/** Small objects bobbing and turning around the card. */
function Toys({ toys, speed }: { toys: Toy[]; speed: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const toy = toys[i];
      m.position.y = toy.position[1] + Math.sin(t * 1.2 + toy.phase) * 0.18;
      m.rotation.x = t * 0.6 + toy.phase;
      m.rotation.y = t * 0.8 + toy.phase;
    });
  });
  return (
    <>
      {toys.map((toy, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={toy.position}
          scale={toy.size}
        >
          {toy.shape === "coin" && (
            <cylinderGeometry args={[0.5, 0.5, 0.12, 40]} />
          )}
          {toy.shape === "ball" && <sphereGeometry args={[0.5, 40, 40]} />}
          {toy.shape === "ring" && (
            <torusGeometry args={[0.42, 0.16, 24, 60]} />
          )}
          {toy.shape === "cube" && <boxGeometry args={[0.7, 0.7, 0.7]} />}
          <meshPhysicalMaterial
            color={toy.colour}
            roughness={toy.shape === "coin" ? 0.25 : 0.35}
            metalness={toy.shape === "coin" ? 0.9 : 0.05}
            clearcoat={1}
          />
        </mesh>
      ))}
    </>
  );
}

/**
 * A glossy card floating in a bright sky, swaying on its own and leaning
 * towards the pointer, with coins and toy shapes bobbing around it — the
 * playful 3D look of consumer fintech sites, rendered live. The card takes
 * the palette's secondary colour and the toys the other two.
 */
export function CinematicFloatingCard() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const speed = reduce ? 0 : 1;
  const [colours, setColours] = useState({
    p: "#1fa5de",
    s: "#7ed957",
    t: "#f5a44a",
  });
  const [visible, setVisible] = useState(true);

  // Colours from the palette variables, read once on mount (the Animations
  // tab remounts the hero when the palette changes).
  useEffect(() => {
    if (!ref.current) return;
    const css = getComputedStyle(ref.current);
    setColours((c) => ({
      p: css.getPropertyValue("--p").trim() || c.p,
      s: css.getPropertyValue("--s").trim() || c.s,
      t: css.getPropertyValue("--t").trim() || c.t,
    }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toys = useMemo<Toy[]>(
    () => [
      {
        shape: "coin",
        colour: "#e8b84a",
        position: [-2.9, 1.3, -0.5],
        size: 0.9,
        phase: 0,
      },
      {
        shape: "coin",
        colour: "#e8b84a",
        position: [2.7, -1.4, 0.4],
        size: 0.7,
        phase: 2.1,
      },
      {
        shape: "ball",
        colour: colours.p,
        position: [2.6, 1.5, -1],
        size: 0.8,
        phase: 1,
      },
      {
        shape: "ring",
        colour: colours.t,
        position: [-2.6, -1.5, 0.2],
        size: 0.9,
        phase: 3,
      },
      {
        shape: "cube",
        colour: colours.p,
        position: [0.4, 2.1, -1.6],
        size: 0.5,
        phase: 4.2,
      },
      {
        shape: "ball",
        colour: colours.t,
        position: [-0.6, -2.1, -0.8],
        size: 0.45,
        phase: 5,
      },
    ],
    [colours.p, colours.t],
  );

  return (
    <section
      ref={ref}
      className="@container relative isolate overflow-hidden bg-gradient-to-b from-(--p-light) via-white to-(--s-light)"
    >
      {/* Clouds drifting behind everything. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {[
          "top-10 -left-20 h-24 w-80",
          "top-1/2 -right-24 h-28 w-96",
          "bottom-6 left-1/4 h-20 w-72",
        ].map((cls, i) => (
          <motion.div
            key={cls}
            className={`absolute rounded-full bg-white/80 blur-2xl ${cls}`}
            animate={{ x: [0, i % 2 ? -60 : 60, 0] }}
            transition={{
              duration: 18 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="mx-auto grid min-h-[36rem] max-w-6xl items-center gap-4 px-5 py-14 @3xl:grid-cols-2 @3xl:py-10">
        <div>
          <motion.h1
            className="text-5xl leading-[1.02] font-semibold tracking-tight text-zinc-900 @3xl:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            A little more,{" "}
            <span className="text-(--s-dark) italic">every day.</span>
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[40ch] text-lg leading-relaxed text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            A credit card on UPI. 1.5% back on chai, cabs and groceries, and no
            annual fee, ever.
          </motion.p>
          <motion.a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Apply in 2 minutes →
          </motion.a>
        </div>

        <motion.div
          className="relative h-80 @3xl:h-[32rem]"
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        >
          <Canvas
            className="!absolute inset-0"
            dpr={[1, 2]}
            camera={{ fov: 35, position: [0, 0, 9] }}
            frameloop={visible ? "always" : "never"}
            gl={{ antialias: true, alpha: true }}
          >
            <hemisphereLight args={["#ffffff", "#b8c6d6", 1.4]} />
            <directionalLight position={[3, 5, 6]} intensity={2.4} />
            <directionalLight
              position={[-5, -2, 3]}
              intensity={0.8}
              color={colours.p}
            />
            <pointLight position={[0, 0, 4]} intensity={8} />
            <Card colour={colours.s} speed={speed} />
            <Toys toys={toys} speed={speed} />
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
