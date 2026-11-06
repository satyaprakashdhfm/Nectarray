"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are scene
   state, mutated every frame in useFrame and never read by React. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  N8AO,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode, type BloomEffect } from "postprocessing";
import gsap from "gsap";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import {
  circuitTexture,
  panelTexture,
  plinthTextures,
  PRACTICES,
} from "./textures";

/**
 * THE DIGITAL GROWTH ENGINE
 *
 * A machined plinth, the product core at its centre — glass layers of
 * circuitry held in a brushed-aluminium frame — and the four practices
 * around it as four precision modules, wired to the core by traces drawn
 * in the logo's own circuit language. Signals run module → core → module:
 * the software, the agents, the demand and the people, as one system.
 *
 * The choreography lives in one plain object (`Stage`) that a GSAP timeline
 * tweens and every component reads in useFrame, so the whole sequence is
 * one timeline to retime, and reduced motion is that timeline jumped to
 * its end.
 */

export type Variant = "desktop" | "mobile";

type Stage = {
  rim: number;
  grid: number;
  env: number;
  key: number;
  mod: [number, number, number, number];
  core: number;
  coreGlow: number;
  trace: number;
  pulse: number;
  ui: [number, number, number, number];
  cam: number;
  live: number;
};

const freshStage = (): Stage => ({
  rim: 0,
  grid: 0,
  env: 0,
  key: 0,
  mod: [0, 0, 0, 0],
  core: 0,
  coreGlow: 0,
  trace: 0,
  pulse: 0,
  ui: [0, 0, 0, 0],
  cam: 0,
  live: 0,
});

/** Height of the plinth's top face. */
const TOP = 0.3;
const NIGHT = "#04080c";

/** Where each practice's module stands on the board, and how tall it is. */
const MODULES: Record<
  (typeof PRACTICES)[number]["id"],
  {
    x: number;
    z: number;
    h: number;
    /** Where its panel floats: x/z offset from the module, height above it. */
    panel: Record<Variant, [number, number, number]>;
  }
> = {
  // The tall one at the back right, where nothing stands in front of it.
  marketing: {
    x: 2.7,
    z: -2.15,
    h: 1.02,
    panel: { desktop: [0.35, 0.75, -0.2], mobile: [0, 0.45, 0] },
  },
  software: {
    x: -2.7,
    z: -2.15,
    h: 0.62,
    panel: { desktop: [-0.1, 0.95, -0.3], mobile: [0, 0.6, 0] },
  },
  ai: {
    x: 2.7,
    z: 2.15,
    h: 0.68,
    panel: { desktop: [-0.7, -0.35, 2.55], mobile: [0.2, 0.4, 0.2] },
  },
  academy: {
    x: -2.7,
    z: 2.15,
    h: 0.72,
    panel: { desktop: [0.7, -0.35, 2.55], mobile: [-0.2, 0.4, 0.2] },
  },
};

/** Per-module brightness: the agents' fins glow over a broad plate, so it
 *  runs lower to read as bright as the thin strips on the others. */
const GAIN: Record<(typeof PRACTICES)[number]["id"], number> = {
  marketing: 1,
  software: 1,
  ai: 0.5,
  academy: 1.15,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);

/* ------------------------------------------------------------------------ */
/* Geometry helpers                                                          */
/* ------------------------------------------------------------------------ */

/** A polyline on the board with its corners rounded, as a curve for a tube. */
function roundedPath(points: [number, number][], y: number, r = 0.09) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const v = points.map(([x, z]) => new THREE.Vector3(x, y, z));
  let from = v[0].clone();
  for (let i = 1; i < v.length; i++) {
    const p = v[i];
    if (i === v.length - 1) {
      path.add(new THREE.LineCurve3(from, p));
      break;
    }
    const inDir = p
      .clone()
      .sub(v[i - 1])
      .normalize();
    const outDir = v[i + 1].clone().sub(p).normalize();
    const a = p.clone().addScaledVector(inDir, -r);
    const b = p.clone().addScaledVector(outDir, r);
    path.add(new THREE.LineCurve3(from, a));
    path.add(new THREE.QuadraticBezierCurve3(a, p.clone(), b));
    from = b;
  }
  return path;
}

/**
 * One lane of the bus from a module to the core: out along the row, a 45°
 * bend, then straight in to the core's side. Lanes are offset so they nest
 * around the bend at an even pitch, like real board traces.
 */
function lane(mx: number, mz: number, o: number): [number, number][] {
  const sx = Math.sign(mx);
  const sz = Math.sign(mz);
  const ax = Math.abs(mx);
  const az = Math.abs(mz);
  const ex = 0.42 + o;
  const ez = 1.12;
  const z2 = 1.42 - 0.414 * o;
  const rz = az - o;
  const x1 = ex + (rz - z2);
  const start = ax - 0.6;
  return (
    [
      [start, rz],
      [x1, rz],
      [ex, z2],
      [ex, ez],
    ] as [number, number][]
  ).map(([x, z]) => [x * sx, z * sz]);
}

/** Short traces on the open board — detail, not signal. */
const STUBS: [number, number][][] = [
  [
    [-1.3, 3.35],
    [-0.4, 3.35],
    [-0.1, 3.05],
    [0.9, 3.05],
  ],
  [
    [-0.9, 3.62],
    [0.55, 3.62],
    [0.82, 3.35],
    [1.35, 3.35],
  ],
  [
    [-1.35, -3.3],
    [0.2, -3.3],
    [0.5, -3.0],
    [1.1, -3.0],
  ],
  [
    [-0.6, -3.6],
    [1.25, -3.6],
  ],
  [
    [-3.62, -0.55],
    [-3.62, 0.5],
  ],
  [
    [3.62, -0.45],
    [3.62, 0.15],
    [3.35, 0.42],
    [3.35, 0.95],
  ],
];

/* ------------------------------------------------------------------------ */
/* Trace material — dark metal until drawn, then lit, then carrying signal   */
/* ------------------------------------------------------------------------ */

const traceVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const traceFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uReveal;
  uniform float uTime;
  uniform float uPulse;
  uniform float uSpeed;
  uniform float uPhase;
  uniform float uDir;
  uniform float uLen;
  uniform float uLit;
  uniform float uTwo;
  varying vec2 vUv;
  varying vec3 vN;

  float comet(float x, float p) {
    float d = (x - p) * uLen;
    return d < 0.0 ? exp(d * 4.0) : exp(-d * 70.0);
  }

  void main() {
    float x = vUv.x;
    float drawn = 1.0 - smoothstep(uReveal - 0.004, uReveal, x);
    float shade = 0.35 + 0.65 * max(dot(normalize(vN), normalize(vec3(-0.2, 0.9, 0.4))), 0.0);
    vec3 body = vec3(0.075, 0.095, 0.115) * shade;

    vec3 col = body + uColor * uLit * 0.42 * drawn * shade;

    // The bright point that draws the trace on.
    float head = exp(-pow((x - uReveal) * uLen * 5.0, 2.0));
    head *= step(0.0005, uReveal) * (1.0 - step(0.9995, uReveal));
    col += uColor * head * 4.0;

    // Signals, travelling at a steady world-space speed.
    float px = uDir > 0.0 ? x : 1.0 - x;
    float p = fract(uTime * uSpeed / uLen + uPhase);
    float s = comet(px, p) + comet(px, p - 1.0) + uTwo * (comet(px, fract(p + 0.5)) + comet(px, fract(p + 0.5) - 1.0));
    col += uColor * s * uPulse * drawn * 4.5;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function makeTraceMaterial(color: string, len: number, seed: number) {
  return new THREE.ShaderMaterial({
    vertexShader: traceVertex,
    fragmentShader: traceFragment,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uSpeed: { value: 0.9 + (seed % 3) * 0.18 },
      uPhase: { value: (seed * 0.371) % 1 },
      uDir: { value: seed % 2 === 0 ? 1 : -1 },
      uLen: { value: len },
      uLit: { value: 1 },
      uTwo: { value: seed % 3 === 0 ? 1 : 0 },
    },
  });
}

/* ------------------------------------------------------------------------ */
/* Shared materials                                                          */
/* ------------------------------------------------------------------------ */

function useMaterials() {
  return useMemo(() => {
    const titanium = new THREE.MeshPhysicalMaterial({
      color: "#2a333c",
      metalness: 1,
      roughness: 0.34,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
    });
    const aluminium = new THREE.MeshPhysicalMaterial({
      color: "#8f9ba6",
      metalness: 1,
      roughness: 0.3,
      anisotropy: 0.7,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: "#e9eff4",
      metalness: 1,
      roughness: 0.08,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#e6f6ff",
      metalness: 0,
      roughness: 0.06,
      transmission: 1,
      thickness: 0.35,
      ior: 1.5,
      attenuationColor: new THREE.Color("#8fd0ea"),
      attenuationDistance: 1.6,
      specularIntensity: 1,
      envMapIntensity: 1.3,
    });
    const anodised = new THREE.MeshPhysicalMaterial({
      color: "#0e151b",
      metalness: 0.75,
      roughness: 0.46,
      clearcoat: 0.6,
      clearcoatRoughness: 0.35,
    });
    return { titanium, aluminium, chrome, glass, anodised };
  }, []);
}

type Mats = ReturnType<typeof useMaterials>;

/** A light-emitting accent whose brightness the stage drives. */
function useAccent(color: string) {
  return useMemo(() => {
    const base = new THREE.Color(color);
    const mat = new THREE.MeshBasicMaterial({ color: base.clone() });
    const set = (k: number) => mat.color.copy(base).multiplyScalar(k);
    set(0.03);
    return { mat, set };
  }, [color]);
}

/* ------------------------------------------------------------------------ */
/* Environment: lighting, reflections, floor, plinth                         */
/* ------------------------------------------------------------------------ */

function Environment({ stage }: { stage: Stage }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = env;
    scene.environmentIntensity = 0;
    scene.background = new THREE.Color(NIGHT);
    scene.fog = new THREE.Fog(NIGHT, 17, 36);
    return () => {
      env.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);

  useFrame(() => {
    scene.environmentIntensity = 0.008 + stage.env * 0.36;
  });
  return null;
}

function Lights({ stage, variant }: { stage: Stage; variant: Variant }) {
  const key = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const warm = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0.6, 0);
    return o;
  }, []);

  useFrame(() => {
    if (key.current) key.current.intensity = stage.key * 210;
    if (rim.current) rim.current.intensity = stage.key * 170;
    if (warm.current) warm.current.intensity = stage.key * 60;
  });

  const size = variant === "desktop" ? 2048 : 1024;
  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={key}
        position={[-6.5, 9.5, 5.5]}
        angle={0.5}
        penumbra={0.85}
        decay={2}
        color="#f4f8ff"
        target={target}
        castShadow
        shadow-mapSize-width={size}
        shadow-mapSize-height={size}
        shadow-bias={-0.0002}
        shadow-normalBias={0.025}
        shadow-radius={6}
        shadow-camera-near={4}
        shadow-camera-far={26}
      />
      {/* Cool rim from behind — separates the silhouette from the dark. */}
      <spotLight
        ref={rim}
        position={[4.5, 6.5, -9]}
        angle={0.55}
        penumbra={1}
        decay={2}
        color="#9fd8ff"
        target={target}
      />
      {/* A low warm kicker, the amber of the mark's rays. */}
      <spotLight
        ref={warm}
        position={[9, 2.2, 3]}
        angle={0.6}
        penumbra={1}
        decay={2}
        color="#ffc27a"
        target={target}
      />
    </>
  );
}

function Floor({ variant }: { variant: Variant }) {
  const { size, viewport } = useThree();
  const reflector = useMemo(() => {
    if (variant !== "desktop") return null;
    const dpr = Math.min(viewport.dpr, 1.5);
    const r = new Reflector(new THREE.PlaneGeometry(70, 70), {
      textureWidth: Math.round(size.width * dpr * 0.6),
      textureHeight: Math.round(size.height * dpr * 0.6),
      color: new THREE.Color("#8a96a2"),
      clipBias: 0.002,
    });
    r.rotation.x = -Math.PI / 2;
    r.position.y = -0.012;
    return r;
    // The reflection's resolution is set once; a resize keeps the old one,
    // which is invisible under the frosted overlay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  useEffect(() => () => reflector?.dispose(), [reflector]);

  return (
    <>
      {reflector && <primitive object={reflector} />}
      {/* Polished dark stone over the mirror: a soft, dim reflection. */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.008} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color="#05090d"
          metalness={0.2}
          roughness={0.55}
          transparent={variant === "desktop"}
          opacity={variant === "desktop" ? 0.86 : 1}
        />
      </mesh>
    </>
  );
}

function Plinth({ stage, mats }: { stage: Stage; mats: Mats }) {
  const textures = useMemo(() => plinthTextures(), []);
  const top = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: textures.map,
        emissiveMap: textures.emissive,
        emissive: new THREE.Color("#3fb8e8"),
        emissiveIntensity: 0,
        metalness: 0.6,
        roughness: 0.42,
        clearcoat: 0.8,
        clearcoatRoughness: 0.28,
      }),
    [textures],
  );
  const rim = useAccent("#3fb8e8");
  const body = useMemo(() => new RoundedBoxGeometry(8, TOP, 8, 4, 0.05), []);
  const rimPath = useMemo(
    () =>
      roundedPath(
        [
          [-4.03, -4.03],
          [4.03, -4.03],
          [4.03, 4.03],
          [-4.03, 4.03],
          [-4.03, -4.03],
        ],
        0.045,
        0.06,
      ),
    [],
  );

  useFrame(() => {
    top.emissiveIntensity = stage.grid * 0.55;
    rim.set(0.03 + stage.rim * 1.6);
  });

  return (
    <group>
      <mesh
        geometry={body}
        material={mats.anodised}
        position-y={TOP / 2}
        castShadow
        receiveShadow
      />
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={TOP + 0.001}
        material={top}
        receiveShadow
      >
        <planeGeometry args={[7.9, 7.9]} />
      </mesh>
      {/* The light line around the foot of the plinth — the first thing lit. */}
      <mesh material={rim.mat}>
        <tubeGeometry args={[rimPath, 220, 0.008, 4, true]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------------ */
/* The product core                                                          */
/* ------------------------------------------------------------------------ */

const TIERS = 4;
const PED = 0.24;
const TIER_GAP = 0.34;

function Core({
  stage,
  mats,
  variant,
}: {
  stage: Stage;
  mats: Mats;
  variant: Variant;
}) {
  const tiers = useRef<(THREE.Group | null)[]>([]);
  const cap = useRef<THREE.Group>(null);
  const posts = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  const geo = useMemo(() => {
    const pedestal = new RoundedBoxGeometry(2.24, PED, 2.24, 4, 0.04);
    const slab = new RoundedBoxGeometry(1.74, 0.11, 1.74, 4, 0.035);
    const outer = 0.96;
    const inner = 0.84;
    const shape = new THREE.Shape();
    shape.moveTo(-outer, -outer);
    shape.lineTo(outer, -outer);
    shape.lineTo(outer, outer);
    shape.lineTo(-outer, outer);
    shape.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-inner, -inner);
    hole.lineTo(-inner, inner);
    hole.lineTo(inner, inner);
    hole.lineTo(inner, -inner);
    hole.closePath();
    shape.holes.push(hole);
    const frame = new THREE.ExtrudeGeometry(shape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
    frame.rotateX(-Math.PI / 2);
    const capPlate = new RoundedBoxGeometry(1.32, 0.07, 1.32, 3, 0.025);
    const die = new RoundedBoxGeometry(0.62, 0.05, 0.62, 3, 0.02);
    const post = new THREE.CylinderGeometry(0.032, 0.032, 1, 20);
    post.translate(0, 0.5, 0);
    const collar = new THREE.CylinderGeometry(0.052, 0.052, 0.05, 20);
    return { pedestal, slab, frame, capPlate, die, post, collar };
  }, []);

  const layer = useMemo(
    () =>
      Array.from({ length: TIERS }, (_, i) => {
        const map = circuitTexture(101 + i * 37, i === 0 ? 1.2 : 1);
        const base = new THREE.Color(1, 1, 1);
        const mat = new THREE.MeshBasicMaterial({
          map,
          alphaTest: 0.35,
          side: THREE.DoubleSide,
          color: base.clone().multiplyScalar(0.05),
        });
        return { mat, base };
      }),
    [],
  );
  const dieGlow = useMemo(() => {
    const map = circuitTexture(7, 0.55);
    return new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(0, 0, 0),
    });
  }, []);

  const pedTop = TOP + PED;
  const tierY = (i: number) => pedTop + 0.16 + i * TIER_GAP;
  const capY = tierY(TIERS - 1) + 0.24;
  const postH = capY - pedTop + 0.02;

  useFrame(({ clock }) => {
    const c = stage.core;
    for (let i = 0; i < TIERS; i++) {
      const g = tiers.current[i];
      if (!g) continue;
      const e = easeOut((c * 1.5 - i * 0.14) / 0.9);
      g.position.y = pedTop - 0.1 + (tierY(i) - pedTop + 0.1) * e;
      g.scale.setScalar(0.94 + 0.06 * e);
      g.visible = e > 0.001;
      // Each layer of circuitry powers up bottom to top.
      const glow = clamp01(stage.coreGlow * 1.6 - i * 0.18);
      const flicker =
        stage.live > 0
          ? 1 + 0.06 * Math.sin(clock.elapsedTime * 1.3 + i * 1.7)
          : 1;
      layer[i].mat.color
        .copy(layer[i].base)
        .multiplyScalar(0.05 + glow * 2.8 * flicker);
    }
    const e = easeOut((c * 1.5 - 0.5) / 1.0);
    if (cap.current) {
      cap.current.position.y = pedTop - 0.1 + (capY - pedTop + 0.1) * e;
      cap.current.visible = e > 0.001;
    }
    if (posts.current) {
      posts.current.scale.y = Math.max(0.001, easeOut(c * 1.2) * postH);
    }
    dieGlow.color.setScalar(stage.coreGlow * 2.6);
    if (light.current) {
      light.current.intensity =
        stage.coreGlow *
        (variant === "desktop" ? 7 : 5) *
        (1 + 0.05 * Math.sin(clock.elapsedTime * 0.9));
    }
  });

  return (
    <group>
      <mesh
        geometry={geo.pedestal}
        material={mats.titanium}
        position-y={TOP + PED / 2}
        castShadow
        receiveShadow
      />
      {/* A machined lip around the pedestal top. */}
      <mesh
        geometry={geo.frame}
        material={mats.aluminium}
        position-y={pedTop - 0.002}
        scale={[1.12, 0.6, 1.12]}
        castShadow
      />

      <group ref={posts} position-y={pedTop}>
        {[
          [-1.02, -1.02],
          [1.02, -1.02],
          [1.02, 1.02],
          [-1.02, 1.02],
        ].map(([x, z]) => (
          <mesh
            key={`${x}${z}`}
            geometry={geo.post}
            material={mats.chrome}
            position={[x, 0, z]}
            castShadow
          />
        ))}
      </group>

      {Array.from({ length: TIERS }, (_, i) => (
        <group
          key={i}
          ref={(g) => {
            tiers.current[i] = g;
          }}
          visible={false}
        >
          <mesh
            geometry={geo.frame}
            material={mats.aluminium}
            position-y={-0.075}
            castShadow
            receiveShadow
          />
          <mesh geometry={geo.slab} material={mats.glass} />
          <mesh rotation-x={-Math.PI / 2} material={layer[i].mat}>
            <planeGeometry args={[1.56, 1.56]} />
          </mesh>
          {/* Collars where the frame meets the posts. */}
          {[
            [-1.02, -1.02],
            [1.02, -1.02],
            [1.02, 1.02],
            [-1.02, 1.02],
          ].map(([x, z]) => (
            <mesh
              key={`${x}${z}`}
              geometry={geo.collar}
              material={mats.chrome}
              position={[x, -0.055, z]}
            />
          ))}
        </group>
      ))}

      <group ref={cap} visible={false}>
        <mesh
          geometry={geo.capPlate}
          material={mats.aluminium}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={geo.die}
          material={mats.titanium}
          position-y={0.055}
          castShadow
        />
        <mesh rotation-x={-Math.PI / 2} position-y={0.082} material={dieGlow}>
          <planeGeometry args={[0.54, 0.54]} />
        </mesh>
      </group>

      <pointLight
        ref={light}
        position={[0, pedTop + 0.75, 0]}
        color="#5fd3e6"
        distance={6}
        decay={2}
        intensity={0}
      />
    </group>
  );
}

/* ------------------------------------------------------------------------ */
/* The four practice modules                                                 */
/* ------------------------------------------------------------------------ */

function Module({
  index,
  stage,
  mats,
}: {
  index: number;
  stage: Stage;
  mats: Mats;
}) {
  const practice = PRACTICES[index];
  const at = MODULES[practice.id];
  const accent = useAccent(practice.color);
  const light = useRef<THREE.PointLight>(null);

  const geo = useMemo(() => {
    const pad = new RoundedBoxGeometry(1.3, 0.07, 1.3, 3, 0.02);
    const ring = roundedPath(
      [
        [-0.6, -0.6],
        [0.6, -0.6],
        [0.6, 0.6],
        [-0.6, 0.6],
        [-0.6, -0.6],
      ],
      0,
      0.05,
    );
    return { pad, ring: new THREE.TubeGeometry(ring, 120, 0.007, 4, true) };
  }, []);

  useFrame(({ clock }) => {
    const m = stage.mod[index];
    const breathe =
      1 + stage.live * 0.08 * Math.sin(clock.elapsedTime * 0.8 + index * 1.9);
    accent.set(0.03 + m * 2.4 * GAIN[practice.id] * breathe);
    if (light.current) light.current.intensity = m * 1.6 * GAIN[practice.id];
  });

  return (
    <group position={[at.x, TOP, at.z]}>
      <mesh
        geometry={geo.pad}
        material={mats.titanium}
        position-y={0.035}
        castShadow
        receiveShadow
      />
      <mesh geometry={geo.ring} material={accent.mat} position-y={0.072} />
      <ModuleBody id={practice.id} mats={mats} accent={accent.mat} />
      <pointLight
        ref={light}
        position={[0, 0.5, 0]}
        color={practice.color}
        distance={2.6}
        decay={2}
        intensity={0}
      />
    </group>
  );
}

function ModuleBody({
  id,
  mats,
  accent,
}: {
  id: (typeof PRACTICES)[number]["id"];
  mats: Mats;
  accent: THREE.Material;
}) {
  const geo = useMemo(
    () => ({
      column: new RoundedBoxGeometry(0.36, 1, 0.36, 3, 0.025),
      blade: new RoundedBoxGeometry(1.0, 0.1, 0.78, 3, 0.02),
      cover: new RoundedBoxGeometry(1.04, 0.035, 0.82, 3, 0.012),
      block: new RoundedBoxGeometry(0.92, 0.28, 0.92, 3, 0.03),
      fin: new RoundedBoxGeometry(0.035, 0.36, 0.84, 2, 0.01),
      step: new RoundedBoxGeometry(1, 0.1, 1, 3, 0.02),
      page: new RoundedBoxGeometry(0.42, 0.012, 0.32, 2, 0.005),
      strip: new THREE.BoxGeometry(1, 1, 1),
    }),
    [],
  );
  const base = 0.07;

  if (id === "marketing") {
    // Demand, in metal: four columns stepping up toward the core.
    const cols: [number, number, number][] = [
      [-0.24, 0.24, 0.32],
      [0.24, 0.24, 0.52],
      [-0.24, -0.24, 0.72],
      [0.24, -0.24, 0.95],
    ];
    return (
      <group position-y={base}>
        {cols.map(([x, z, h]) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <mesh
              geometry={geo.column}
              material={mats.aluminium}
              scale={[1, h, 1]}
              position-y={h / 2}
              castShadow
              receiveShadow
            />
            <mesh
              geometry={geo.strip}
              material={accent}
              scale={[0.28, 0.008, 0.28]}
              position-y={h + 0.002}
            />
          </group>
        ))}
      </group>
    );
  }

  if (id === "software") {
    // Built and running: three blades with live status strips, under glass.
    return (
      <group position-y={base}>
        {[0, 1, 2].map((i) => (
          <group key={i} position-y={0.08 + i * 0.15}>
            <mesh
              geometry={geo.blade}
              material={mats.titanium}
              castShadow
              receiveShadow
            />
            <mesh
              geometry={geo.strip}
              material={accent}
              scale={[0.46, 0.016, 0.01]}
              position={[-0.18, 0, 0.392]}
            />
            <mesh
              geometry={geo.strip}
              material={accent}
              scale={[0.01, 0.016, 0.34]}
              position={[0.502, 0, 0.12]}
            />
            <mesh
              geometry={geo.strip}
              material={mats.chrome}
              scale={[0.12, 0.03, 0.02]}
              position={[0.34, 0, 0.395]}
            />
          </group>
        ))}
        <mesh geometry={geo.cover} material={mats.glass} position-y={0.47} />
      </group>
    );
  }

  if (id === "ai") {
    // Compute: a block with a heat-sink of fins, the light coming up
    // between them — the agent working.
    return (
      <group position-y={base}>
        <mesh
          geometry={geo.block}
          material={mats.titanium}
          position-y={0.14}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={geo.strip}
          material={accent}
          scale={[0.8, 0.01, 0.8]}
          position-y={0.286}
        />
        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={i}
            geometry={geo.fin}
            material={mats.aluminium}
            position={[-0.4 + i * 0.1, 0.46, 0]}
            castShadow
          />
        ))}
      </group>
    );
  }

  // Academy: tiers, like an amphitheatre, and an open book of glass on top.
  return (
    <group position-y={base}>
      {[1, 0.76, 0.52].map((s, i) => (
        <group key={s} position-y={0.05 + i * 0.1}>
          <mesh
            geometry={geo.step}
            material={mats.titanium}
            scale={[s, 1, s]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={geo.strip}
            material={accent}
            scale={[s * 0.9, 0.008, 0.008]}
            position={[0, 0.052, s / 2 - 0.02]}
          />
          <mesh
            geometry={geo.strip}
            material={accent}
            scale={[0.008, 0.008, s * 0.9]}
            position={[s / 2 - 0.02, 0.052, 0]}
          />
        </group>
      ))}
      <group position-y={0.36}>
        <mesh
          geometry={geo.page}
          material={mats.glass}
          position={[-0.2, 0.06, 0]}
          rotation-z={0.32}
        />
        <mesh
          geometry={geo.page}
          material={mats.glass}
          position={[0.2, 0.06, 0]}
          rotation-z={-0.32}
        />
        <mesh
          geometry={geo.strip}
          material={mats.chrome}
          scale={[0.03, 0.03, 0.32]}
        />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------------ */
/* Traces                                                                    */
/* ------------------------------------------------------------------------ */

type Trace = {
  geo: THREE.TubeGeometry;
  mat: THREE.ShaderMaterial;
  start: THREE.Vector3;
  end: THREE.Vector3;
  module: number;
  order: number;
  signal: boolean;
};

function Traces({ stage }: { stage: Stage }) {
  const y = TOP + 0.012;
  const traces = useMemo(() => {
    const out: Trace[] = [];
    let seed = 0;
    PRACTICES.forEach((p, m) => {
      const at = MODULES[p.id];
      [-0.13, 0, 0.13].forEach((o) => {
        const path = roundedPath(lane(at.x, at.z, o), y);
        const len = path.getLength();
        out.push({
          geo: new THREE.TubeGeometry(path, 200, 0.0125, 6, false),
          mat: makeTraceMaterial(p.color, len, seed++),
          start: path.getPoint(0),
          end: path.getPoint(1),
          module: m,
          order: out.length,
          signal: true,
        });
      });
    });

    // Side buses: growth ↔ agents on the right, software ↔ academy on
    // the left.
    const sides: [number, number, [number, number][]][] = [
      [
        0,
        0,
        [
          [2.62, -1.47],
          [2.62, 1.47],
        ],
      ],
      [
        0,
        1,
        [
          [2.78, -1.47],
          [2.78, 1.47],
        ],
      ],
      [
        1,
        0,
        [
          [-2.62, -1.47],
          [-2.62, 1.47],
        ],
      ],
      [
        1,
        1,
        [
          [-2.78, -1.47],
          [-2.78, 1.47],
        ],
      ],
    ];
    sides.forEach(([a, k, pts]) => {
      const path = roundedPath(pts, y);
      const len = path.getLength();
      out.push({
        geo: new THREE.TubeGeometry(path, 120, 0.0115, 6, false),
        mat: makeTraceMaterial(
          k === 0 ? PRACTICES[a].color : "#4fd1c5",
          len,
          seed++,
        ),
        start: path.getPoint(0),
        end: path.getPoint(1),
        module: a,
        order: out.length,
        signal: true,
      });
    });

    STUBS.forEach((pts) => {
      const path = roundedPath(pts, y);
      const len = path.getLength();
      const mat = makeTraceMaterial("#3fb8e8", len, seed++);
      mat.uniforms.uLit.value = 0.45;
      out.push({
        geo: new THREE.TubeGeometry(path, 80, 0.011, 6, false),
        mat,
        start: path.getPoint(0),
        end: path.getPoint(1),
        module: -1,
        order: out.length,
        signal: false,
      });
    });
    return out;
  }, [y]);

  const pads = useMemo(() => {
    const ring = new THREE.RingGeometry(0.03, 0.048, 28);
    ring.rotateX(-Math.PI / 2);
    const dot = new THREE.CircleGeometry(0.022, 20);
    dot.rotateX(-Math.PI / 2);
    const metal = new THREE.MeshStandardMaterial({
      color: "#56636f",
      metalness: 1,
      roughness: 0.3,
    });
    return { ring, dot, metal };
  }, []);

  const padMats = useMemo(
    () =>
      traces.map((t) => {
        const color = new THREE.Color(t.mat.uniforms.uColor.value);
        const mat = new THREE.MeshBasicMaterial({ color: color.clone() });
        return { mat, color };
      }),
    [traces],
  );

  useFrame(({ clock }) => {
    const n = traces.length;
    traces.forEach((t, i) => {
      const u = t.mat.uniforms;
      const r = clamp01((stage.trace * (1 + n * 0.035) - t.order * 0.035) / 1);
      u.uReveal.value = r;
      u.uPulse.value = t.signal ? stage.pulse : 0;
      u.uTime.value = stage.live > 0 ? clock.elapsedTime : 2.4;
      const lit = t.module >= 0 ? stage.mod[t.module] : stage.grid;
      padMats[i].mat.color
        .copy(padMats[i].color)
        .multiplyScalar(0.04 + Math.max(lit * 0.9, r * 1.6));
    });
  });

  return (
    <group>
      {traces.map((t, i) => (
        <group key={i}>
          <mesh geometry={t.geo} material={t.mat} />
          <mesh
            geometry={pads.ring}
            material={padMats[i].mat}
            position={[t.start.x, y + 0.002, t.start.z]}
          />
          {!t.signal && (
            <mesh
              geometry={pads.ring}
              material={padMats[i].mat}
              position={[t.end.x, y + 0.002, t.end.z]}
            />
          )}
          <mesh
            geometry={pads.dot}
            material={pads.metal}
            position={[t.start.x, y + 0.003, t.start.z]}
          />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------------ */
/* Floating interface panels                                                 */
/* ------------------------------------------------------------------------ */

function Panels({
  stage,
  variant,
  restAz,
  restEl,
  font,
}: {
  stage: Stage;
  variant: Variant;
  restAz: number;
  restEl: number;
  font: string;
}) {
  const compact = variant === "mobile";
  const groups = useRef<(THREE.Group | null)[]>([]);

  const items = useMemo(
    () =>
      PRACTICES.map((p) => {
        const map = panelTexture(p, font, compact);
        const mat = new THREE.MeshBasicMaterial({
          map,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        mat.color.setScalar(1.15);
        const at = MODULES[p.id];
        const lineGeo = new THREE.BufferGeometry();
        const lineMat = new THREE.LineBasicMaterial({
          color: p.color,
          transparent: true,
          opacity: 0,
        });
        return {
          p,
          mat,
          at,
          lineGeo,
          lineMat,
          line: new THREE.Line(lineGeo, lineMat),
        };
      }),
    [font, compact],
  );

  const w = compact ? 1.55 : 1.85;
  const h = compact ? w * (168 / 768) : w * (480 / 768);

  // Each panel has its own spot (MODULES[…].panel), chosen so that none
  // crosses the core or the words beside the scene.
  const place = useMemo(
    () =>
      items.map(({ at }) => {
        const [dx, dy, dz] = at.panel[variant];
        return new THREE.Vector3(at.x + dx, TOP + at.h + dy + h / 2, at.z + dz);
      }),
    [items, variant, h],
  );

  useEffect(() => {
    items.forEach(({ lineGeo, at }, i) => {
      const p = place[i];
      lineGeo.setFromPoints([
        new THREE.Vector3(p.x, p.y - h / 2 - 0.02, p.z),
        new THREE.Vector3(at.x, TOP + at.h + 0.12, at.z),
      ]);
    });
  }, [items, place, h]);

  useFrame(({ clock }) => {
    items.forEach(({ mat, lineMat }, i) => {
      const u = easeOut(stage.ui[i]);
      mat.opacity = u * 0.96;
      lineMat.opacity = u * 0.45;
      const g = groups.current[i];
      if (g) {
        const bob =
          stage.live * 0.025 * Math.sin(clock.elapsedTime * 0.6 + i * 1.3);
        g.position.set(
          place[i].x,
          place[i].y - (1 - u) * 0.18 + bob,
          place[i].z,
        );
        g.visible = u > 0.001;
      }
    });
  });

  return (
    <group>
      {items.map(({ mat, line, p }, i) => (
        <group key={p.id}>
          <group
            ref={(g) => {
              groups.current[i] = g;
            }}
            rotation={[-restEl * 0.45, restAz, 0, "YXZ"]}
            visible={false}
          >
            <mesh material={mat} renderOrder={10}>
              <planeGeometry args={[w, h]} />
            </mesh>
          </group>
          <primitive object={line} />
        </group>
      ))}
    </group>
  );
}

/**
 * On a phone a panel in the scene would be a few pixels of text, so the
 * modules are named by real HTML labels instead, which this keeps pinned to
 * each module as the camera moves — crisp at any size, and selectable.
 */
function LabelProjector({
  stage,
  labels,
}: {
  stage: Stage;
  labels: React.RefObject<(HTMLElement | null)[]>;
}) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    PRACTICES.forEach((p, i) => {
      const el = labels.current?.[i];
      if (!el) return;
      const at = MODULES[p.id];
      v.set(at.x, TOP + at.h + 0.25, at.z).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const u = easeOut(stage.ui[i]);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + (1 - u) * 8).toFixed(1)}px, 0) translate(-50%, -100%)`;
      el.style.opacity = String(u);
    });
  });
  return null;
}

/* ------------------------------------------------------------------------ */
/* Air: a few motes in the key light                                         */
/* ------------------------------------------------------------------------ */

function Motes({ stage, count }: { stage: Stage; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.sin(i * 12.9898) * 43758.5453;
      const r = a - Math.floor(a);
      const b = Math.sin(i * 78.233) * 12345.678;
      const q = b - Math.floor(b);
      pos[i * 3] = (r - 0.5) * 12;
      pos[i * 3 + 1] = 0.4 + q * 4.5;
      pos[i * 3 + 2] = (((r * 7.13 + q * 3.1) % 1) - 0.5) * 12;
      seeds[i] = q;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: "#a9dcf2",
      size: 0.022,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    return { geo, mat, seeds };
  }, [count]);

  useFrame((_, dt) => {
    mat.opacity = stage.env * 0.32;
    if (stage.live <= 0) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let yv = pos.getY(i) + dt * (0.035 + seeds[i] * 0.05);
      if (yv > 5) yv = 0.4;
      pos.setY(i, yv);
    }
    pos.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------------------ */
/* Camera                                                                    */
/* ------------------------------------------------------------------------ */

const FRAMING: Record<
  Variant,
  {
    r: number;
    az: number;
    el: number;
    target: [number, number, number];
    fov: number;
    /** Shift of the picture, as a fraction of the canvas size. */
    shift: [number, number];
  }
> = {
  desktop: {
    r: 23,
    az: 0.3,
    el: 0.46,
    target: [0, 0.9, 0],
    fov: 27,
    shift: [0.215, 0.0],
  },
  mobile: {
    r: 22,
    az: 0.14,
    el: 0.7,
    target: [0.3, 0.55, 0.45],
    fov: 30,
    shift: [0.07, 0],
  },
};

function CameraRig({
  stage,
  variant,
  pointer,
}: {
  stage: Stage;
  variant: Variant;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const { camera, size } = useThree();
  const f = FRAMING[variant];
  const target = useMemo(() => new THREE.Vector3(...f.target), [f]);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame(({ clock }, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const k = easeOut(stage.cam);
    const t = clock.elapsedTime;
    const live = stage.live;

    const p = pointer.current ?? { x: 0, y: 0 };
    const a = 1 - Math.exp(-dt * 2.2);
    smooth.current.x += (p.x - smooth.current.x) * a;
    smooth.current.y += (p.y - smooth.current.y) * a;

    const r = f.r + 3.6 * (1 - k);
    const az =
      f.az +
      0.28 * (1 - k) +
      live * (0.04 * Math.sin(t * 0.07) + smooth.current.x * 0.06);
    const el =
      f.el -
      0.22 * (1 - k) +
      live * (0.015 * Math.sin(t * 0.05 + 1) - smooth.current.y * 0.03);

    cam.position.set(
      target.x + r * Math.cos(el) * Math.sin(az),
      target.y + r * Math.sin(el),
      target.z + r * Math.cos(el) * Math.cos(az),
    );
    cam.lookAt(target);

    // Frame the engine into the right of the picture on desktop, leaving
    // the left for the words, without moving the camera off its subject.
    const v = cam.view;
    const dx = -f.shift[0] * size.width;
    const dy = -f.shift[1] * size.height;
    if (
      !v ||
      v.fullWidth !== size.width ||
      v.fullHeight !== size.height ||
      v.offsetX !== dx ||
      v.offsetY !== dy
    ) {
      if (f.shift[0] || f.shift[1]) {
        cam.setViewOffset(
          size.width,
          size.height,
          dx,
          dy,
          size.width,
          size.height,
        );
      } else {
        cam.clearViewOffset();
      }
    }
  });
  return null;
}

/* ------------------------------------------------------------------------ */
/* Choreography                                                              */
/* ------------------------------------------------------------------------ */

function Director({
  stage,
  reduced,
  freezeAt,
  onReady,
}: {
  stage: Stage;
  reduced: boolean;
  /** Development only: hold the sequence at this many seconds. */
  freezeAt: number | null;
  onReady: () => void;
}) {
  const { gl, scene, camera, invalidate } = useThree();

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    const build = () => {
      tl = gsap.timeline({ paused: true });
      tl.to(stage, { rim: 1, duration: 1.3, ease: "power2.inOut" }, 0.15)
        .to(stage, { grid: 1, duration: 2.2, ease: "power1.inOut" }, 0.3)
        .to(stage, { env: 1, key: 1, duration: 2.4, ease: "power2.inOut" }, 0.7)
        .to(stage, { cam: 1, duration: 5.2, ease: "power3.inOut" }, 0);
      [0, 1, 2, 3].forEach((i) =>
        tl!.to(
          stage.mod,
          { [i]: 1, duration: 0.9, ease: "power2.out" },
          0.9 + i * 0.24,
        ),
      );
      tl.to(stage, { core: 1, duration: 1.9, ease: "power2.out" }, 1.55)
        .to(stage, { coreGlow: 1, duration: 1.2, ease: "power2.inOut" }, 2.5)
        .to(stage, { trace: 1, duration: 1.5, ease: "power1.inOut" }, 2.7)
        .to(stage, { pulse: 1, duration: 1.0, ease: "power1.out" }, 3.7)
        .to(stage, { live: 1, duration: 1.4, ease: "power1.inOut" }, 4.0);
      [0, 1, 2, 3].forEach((i) =>
        tl!.to(
          stage.ui,
          { [i]: 1, duration: 0.9, ease: "power2.out" },
          3.85 + i * 0.13,
        ),
      );
      return tl;
    };

    // Compile every shader before the first frame of the sequence, so the
    // opening is not a stutter while the GPU catches up.
    // …but never wait more than a moment for it: a slow driver should
    // start a little rough rather than sit dark.
    const compile = Promise.race([
      gl.compileAsync?.(scene, camera) ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
    compile
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        const timeline = build();
        if (freezeAt !== null) {
          timeline.seek(freezeAt);
          invalidate();
          requestAnimationFrame(() => invalidate());
        } else if (reduced) {
          timeline.progress(1);
          invalidate();
          requestAnimationFrame(() => invalidate());
        } else {
          timeline.play();
        }
        onReady();
      });

    return () => {
      cancelled = true;
      tl?.kill();
    };
  }, [gl, scene, camera, stage, reduced, freezeAt, onReady, invalidate]);

  return null;
}

/** Steps resolution down if the device cannot hold a frame rate. */
function Governor({ min, max }: { min: number; max: number }) {
  const setDpr = useThree((s) => s.setDpr);
  const dpr = useRef(max);
  const acc = useRef({ t: 0, n: 0, wait: 2.5 });
  useFrame((_, dt) => {
    const a = acc.current;
    if (a.wait > 0) {
      a.wait -= dt;
      return;
    }
    a.t += dt;
    a.n += 1;
    if (a.t < 1.5) return;
    const avg = a.t / a.n;
    a.t = 0;
    a.n = 0;
    if (avg > 1 / 45 && dpr.current > min) {
      dpr.current = Math.max(min, dpr.current - 0.25);
      setDpr(dpr.current);
      a.wait = 1;
    }
  });
  return null;
}

/* ------------------------------------------------------------------------ */
/* The canvas                                                                */
/* ------------------------------------------------------------------------ */

export default function EngineScene({
  variant,
  active,
  reduced,
  freezeAt = null,
  onReady,
  pointer,
  labels,
}: {
  variant: Variant;
  active: boolean;
  reduced: boolean;
  freezeAt?: number | null;
  onReady: () => void;
  pointer: React.RefObject<{ x: number; y: number }>;
  /** Phone only: HTML labels the scene keeps pinned over its modules. */
  labels?: React.RefObject<(HTMLElement | null)[]>;
}) {
  const stage = useMemo(() => freshStage(), []);
  const f = FRAMING[variant];
  const desktop = variant === "desktop";
  const maxDpr = desktop ? 1.75 : 1.5;

  // Panels use the site's own face, so wait until it has loaded.
  const [font, setFont] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const family =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-schibsted")
        .trim() || "ui-sans-serif";
    document.fonts.ready.then(() => alive && setFont(family));
    return () => {
      alive = false;
    };
  }, []);

  if (!font) return null;

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, maxDpr]}
      frameloop={
        !active ? "never" : reduced || freezeAt !== null ? "demand" : "always"
      }
      camera={{ fov: f.fov, near: 0.5, far: 60, position: [10, 6, 10] }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <Environment stage={stage} />
      <Lights stage={stage} variant={variant} />
      <Floor variant={variant} />
      <SceneBody stage={stage} variant={variant} font={font} labels={labels} />
      <CameraRig stage={stage} variant={variant} pointer={pointer} />
      <Director
        stage={stage}
        reduced={reduced}
        freezeAt={freezeAt}
        onReady={onReady}
      />
      {!reduced && freezeAt === null && <Governor min={1} max={maxDpr} />}

      <EffectComposer multisampling={desktop ? 4 : 0} enableNormalPass={false}>
        {desktop ? (
          <N8AO
            aoRadius={0.55}
            distanceFalloff={0.6}
            intensity={2.2}
            quality="medium"
            halfRes
          />
        ) : (
          <></>
        )}
        <BloomStage stage={stage} />
        <Vignette offset={0.22} darkness={0.72} />
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </Canvas>
  );
}

function SceneBody({
  stage,
  variant,
  font,
  labels,
}: {
  stage: Stage;
  variant: Variant;
  font: string;
  labels?: React.RefObject<(HTMLElement | null)[]>;
}) {
  const mats = useMaterials();
  const f = FRAMING[variant];
  return (
    <group>
      <Plinth stage={stage} mats={mats} />
      <Core stage={stage} mats={mats} variant={variant} />
      {PRACTICES.map((p, i) => (
        <Module key={p.id} index={i} stage={stage} mats={mats} />
      ))}
      <Traces stage={stage} />
      {variant === "desktop" ? (
        <Panels
          stage={stage}
          variant={variant}
          restAz={f.az}
          restEl={f.el}
          font={font}
        />
      ) : (
        labels && <LabelProjector stage={stage} labels={labels} />
      )}
      <Motes stage={stage} count={variant === "desktop" ? 70 : 36} />
    </group>
  );
}

function BloomStage({ stage }: { stage: Stage }) {
  const ref = useRef<BloomEffect>(null);
  useFrame(() => {
    if (ref.current)
      ref.current.intensity = 0.35 + stage.coreGlow * 0.55 + stage.pulse * 0.2;
  });
  return (
    <Bloom
      ref={ref}
      mipmapBlur
      luminanceThreshold={0.95}
      luminanceSmoothing={0.25}
      radius={0.72}
      intensity={0.4}
    />
  );
}
