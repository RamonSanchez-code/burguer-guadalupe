import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/* ------------------------------------------------------------------ */
/* utils                                                               */
/* ------------------------------------------------------------------ */

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function trigNoise(a: number, p1: number, p2: number, p3: number) {
  return Math.sin(a * 3 + p1) * 0.5 + Math.sin(a * 7 + p2) * 0.3 + Math.sin(a * 13 + p3) * 0.2;
}

/* ------------------------------------------------------------------ */
/* procedural canvas textures                                          */
/* ------------------------------------------------------------------ */

function makeTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function useBurgerTextures() {
  return useMemo(() => {
    const rand = lcg(7);

    // bun — baked golden base with toasted speckles
    const bun = makeTexture(512, (ctx, s) => {
      ctx.fillStyle = "#d9964e";
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 900; i++) {
        const r = rand() * 4 + 0.6;
        ctx.globalAlpha = 0.05 + rand() * 0.14;
        ctx.fillStyle = rand() > 0.5 ? "#f4c37c" : "#a9702f";
        ctx.beginPath();
        ctx.arc(rand() * s, rand() * s, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    // patty — mottled grilled beef
    const patty = makeTexture(512, (ctx, s) => {
      ctx.fillStyle = "#432612";
      ctx.fillRect(0, 0, s, s);
      const palette = ["#331a09", "#54301a", "#2a1204", "#5f3a20", "#3d2210"];
      for (let i = 0; i < 160; i++) {
        const rx = 5 + rand() * 22;
        ctx.globalAlpha = 0.25 + rand() * 0.3;
        ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
        ctx.beginPath();
        ctx.ellipse(rand() * s, rand() * s, rx, rx * (0.5 + rand() * 0.8), rand() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 600; i++) {
        ctx.globalAlpha = 0.15 + rand() * 0.25;
        ctx.fillStyle = rand() > 0.6 ? "#6e4526" : "#221004";
        ctx.beginPath();
        ctx.arc(rand() * s, rand() * s, rand() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    // bacon — fat & meat stripes along length
    const bacon = makeTexture(256, (ctx, s) => {
      const bands = ["#7a2b18", "#b15a38", "#8e3520", "#c07a4e", "#6e2413", "#a04a2c"];
      let y = 0;
      let i = 0;
      while (y < s) {
        const h = 14 + rand() * 30;
        ctx.fillStyle = bands[i % bands.length];
        ctx.globalAlpha = 0.92;
        ctx.fillRect(0, y, s, h);
        y += h;
        i++;
      }
      ctx.globalAlpha = 0.18;
      for (let j = 0; j < 200; j++) {
        ctx.fillStyle = "#3d1108";
        ctx.fillRect(rand() * s, rand() * s, 2 + rand() * 8, 1 + rand() * 2);
      }
      ctx.globalAlpha = 1;
    });

    // lettuce — fresh green with veins
    const lettuce = makeTexture(512, (ctx, s) => {
      ctx.fillStyle = "#5e9c33";
      ctx.fillRect(0, 0, s, s);
      ctx.translate(s / 2, s / 2);
      for (let i = 0; i < 90; i++) {
        const ang = rand() * Math.PI * 2;
        ctx.save();
        ctx.rotate(ang);
        ctx.globalAlpha = 0.12 + rand() * 0.14;
        ctx.strokeStyle = rand() > 0.5 ? "#3f7322" : "#84c04d";
        ctx.lineWidth = 1 + rand() * 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(s * 0.2, (rand() - 0.5) * s * 0.2, s * 0.48, (rand() - 0.5) * s * 0.3);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    });

    return { bun, patty, bacon, lettuce };
  }, []);
}

/* ------------------------------------------------------------------ */
/* organic geometries                                                  */
/* ------------------------------------------------------------------ */

/** Displace a cylinder-ish geometry with organic radial noise (patty / tomato) */
function useNoisyCylinder(radius: number, height: number, amp: number, seed: number) {
  return useMemo(() => {
    const geo = new THREE.CylinderGeometry(radius, radius, height, 72, 3);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ang = Math.atan2(v.z, v.x);
      const n = trigNoise(ang, seed * 1.7, seed * 0.9, seed * 2.3);
      const scale = 1 + n * amp;
      pos.setXYZ(i, v.x * scale, v.y + n * amp * height * 0.35, v.z * scale);
    }
    geo.computeVertexNormals();
    return geo;
  }, [radius, height, amp, seed]);
}

/** Slightly lumpy squashed sphere (hand-made buns) */
function useLumpySphere(seed: number) {
  return useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 48);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ang = Math.atan2(v.z, v.x);
      const n = trigNoise(ang, seed, seed * 1.3, seed * 0.6);
      v.multiplyScalar(1 + n * 0.018);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
}

/** Ruffled lettuce disc */
function useLettuce(seed: number) {
  return useMemo(() => {
    const geo = new THREE.CircleGeometry(1.85, 128);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = Math.hypot(v.x, v.y);
      const ang = Math.atan2(v.y, v.x);
      const falloff = smoothstep(0.3, 1, r / 1.85);
      const z =
        (Math.sin(ang * 9 + seed) * 0.16 + Math.sin(ang * 17 + seed * 2) * 0.08) * falloff +
        Math.sin(r * 5 + seed) * 0.02;
      const scale = 1 + falloff * trigNoise(ang, seed, seed * 2, seed * 3) * 0.07;
      pos.setXYZ(i, v.x * scale, v.y * scale, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
}

/** Melted cheese — squarish slice with drip bulges */
function useCheese(seed: number) {
  return useMemo(() => {
    const rand = lcg(seed);
    const drips = Array.from({ length: 9 }, () => ({
      ang: rand() * Math.PI * 2,
      depth: 0.1 + rand() * 0.34,
      width: 0.12 + rand() * 0.28,
    }));
    const pts: THREE.Vector2[] = [];
    const N = 110;
    const exponent = 4.4;
    const half = 1.42;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const c = Math.cos(t);
      const s = Math.sin(t);
      let x = Math.sign(c) * Math.pow(Math.abs(c), 2 / exponent) * half || 0;
      let y = Math.sign(s) * Math.pow(Math.abs(s), 2 / exponent) * half || 0;
      let mod = 1;
      for (const d of drips) {
        let da = Math.abs(((t - d.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        mod += d.depth * Math.exp(-(da * da) / (2 * d.width * d.width));
      }
      x *= mod;
      y *= mod;
      pts.push(new THREE.Vector2(x, y));
    }
    const shape = new THREE.Shape(pts);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    geo.rotateX(-Math.PI / 2);
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
}

/** Wavy bacon strip */
function useBacon(seed: number) {
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.7, 0.55, 60, 8);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const z = Math.sin((v.x / 2.7) * Math.PI * 3 + seed) * 0.09 + Math.sin(v.x * 9 + seed) * 0.012;
      pos.setXYZ(i, v.x, v.y + Math.sin((v.x / 2.7) * Math.PI * 1.5 + seed) * 0.05, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
}

/* ------------------------------------------------------------------ */
/* burger                                                              */
/* ------------------------------------------------------------------ */

type Seed = { pos: [number, number, number]; rot: [number, number, number] };

function SesameSeeds({ bunY }: { bunY: number }) {
  const seeds = useMemo<Seed[]>(() => {
    const rand = lcg(42);
    const arr: Seed[] = [];
    const R = 1.6;
    for (let i = 0; i < 34; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = 0.15 + rand() * (Math.PI / 2.9);
      const x = Math.sin(phi) * Math.cos(theta) * R * 0.94;
      const z = Math.sin(phi) * Math.sin(theta) * R * 0.94;
      const y = bunY + Math.cos(phi) * R * 0.6 + 0.015;
      arr.push({ pos: [x, y, z], rot: [rand() * 0.9 - 0.45, theta + Math.PI / 2, rand() * 0.9 - 0.45] });
    }
    return arr;
  }, [bunY]);

  return (
    <group>
      {seeds.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <capsuleGeometry args={[0.034, 0.055, 4, 10]} />
          <meshPhysicalMaterial color="#f3ddab" roughness={0.55} clearcoat={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function BurgerStack({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null!);
  const spin = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const tex = useBurgerTextures();
  const bunTop = useLumpySphere(11);
  const bunBottom = useLumpySphere(29);
  const pattyGeo = useNoisyCylinder(1.72, 0.5, 0.045, 3);
  const tomatoGeo = useNoisyCylinder(1.52, 0.18, 0.02, 8);
  const lettuceGeo = useLettuce(4);
  const lettuceGeo2 = useLettuce(9);
  const cheeseGeo = useCheese(21);
  const cheeseGeo2 = useCheese(33);
  const baconGeo = useBacon(5);
  const baconGeo2 = useBacon(12);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    spin.current += delta * 0.22;
    const p = progress.get();
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, 0.06);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, 0.06);
    group.current.position.y = Math.sin(t * 0.85) * 0.13;
    group.current.rotation.y = spin.current + p * Math.PI * 2.25 + pointer.current.x * 0.35;
    group.current.rotation.x = pointer.current.y * -0.18 + Math.sin(t * 0.5) * 0.02;
    group.current.rotation.z = Math.sin(t * 0.6) * 0.03;
  });

  return (
    <group ref={group} rotation={[0.06, 0, 0]} scale={0.96}>
      {/* slate plate */}
      <mesh position={[0, -1.68, 0]}>
        <cylinderGeometry args={[2.35, 2.2, 0.1, 64]} />
        <meshPhysicalMaterial color="#181410" roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.4} />
      </mesh>

      {/* bottom bun */}
      <mesh geometry={bunBottom} position={[0, -1.06, 0]} scale={[1.58, 0.52, 1.58]}>
        <meshPhysicalMaterial
          map={tex.bun}
          bumpMap={tex.bun}
          bumpScale={0.6}
          roughness={0.62}
          clearcoat={0.3}
          clearcoatRoughness={0.55}
        />
      </mesh>

      {/* patty */}
      <mesh geometry={pattyGeo} position={[0, -0.28, 0]}>
        <meshPhysicalMaterial
          map={tex.patty}
          bumpMap={tex.patty}
          bumpScale={1.2}
          roughness={0.88}
          clearcoat={0.18}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* melted cheese — double slice */}
      <mesh geometry={cheeseGeo} position={[0, 0.01, 0]} rotation={[0, 0.28, 0]}>
        <meshPhysicalMaterial color="#f5a11c" roughness={0.32} clearcoat={0.85} clearcoatRoughness={0.28} />
      </mesh>
      <mesh geometry={cheeseGeo2} position={[0, 0.045, 0]} rotation={[0, -0.42, 0]}>
        <meshPhysicalMaterial color="#f8ab24" roughness={0.3} clearcoat={0.85} clearcoatRoughness={0.25} />
      </mesh>

      {/* tomato */}
      <mesh geometry={tomatoGeo} position={[0, 0.15, 0]}>
        <meshPhysicalMaterial color="#cf3a22" roughness={0.24} clearcoat={0.75} clearcoatRoughness={0.2} />
      </mesh>

      {/* lettuce — two ruffled layers */}
      <mesh geometry={lettuceGeo} position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial map={tex.lettuce} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={lettuceGeo2} position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0.9]} scale={0.93}>
        <meshPhysicalMaterial map={tex.lettuce} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* bacon */}
      <mesh geometry={baconGeo} position={[0, 0.4, 0.12]} rotation={[0, 0.5, 0]}>
        <meshPhysicalMaterial map={tex.bacon} roughness={0.48} clearcoat={0.4} clearcoatRoughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={baconGeo2} position={[0, 0.44, -0.14]} rotation={[0, -0.55, 0]}>
        <meshPhysicalMaterial map={tex.bacon} roughness={0.48} clearcoat={0.4} clearcoatRoughness={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* top bun */}
      <mesh geometry={bunTop} position={[0, 1.06, 0]} scale={[1.6, 0.62, 1.6]}>
        <meshPhysicalMaterial
          map={tex.bun}
          bumpMap={tex.bun}
          bumpScale={0.6}
          roughness={0.5}
          clearcoat={0.45}
          clearcoatRoughness={0.4}
        />
      </mesh>
      <SesameSeeds bunY={1.06} />

      {/* glow ring */}
      <mesh position={[0, -1.64, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.62, 0.012, 8, 90]} />
        <meshBasicMaterial color="#ff7a1a" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */

export default function Burger3D({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.15, 7.6], fov: 35 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute !inset-0"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 4]} intensity={1.6} color="#ffedd6" />
      <pointLight position={[-6, 3, -4]} intensity={55} distance={18} decay={2} color="#ff7a1a" />

      {/* studio environment — rendered locally, no external HDR */}
      <Environment resolution={256}>
        <Lightformer intensity={5} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} color="#fff3e0" />
        <Lightformer intensity={2.5} position={[-5, 1.5, -1]} rotation-y={Math.PI / 2} scale={[7, 2.5, 1]} color="#ffb347" />
        <Lightformer intensity={2} position={[5, 2, 3]} rotation-y={-Math.PI / 2} scale={[7, 3, 1]} color="#ffdcb0" />
        <Lightformer intensity={1.4} position={[0, 1, 7]} scale={[5, 2, 1]} color="#ffe9cf" />
      </Environment>

      <BurgerStack progress={progress} />
      <Sparkles count={70} scale={[9, 7, 6]} position={[0, 0.6, 0]} size={3.2} speed={0.35} opacity={0.7} color="#ffb347" />
      <ContactShadows position={[0, -1.78, 0]} opacity={0.6} scale={11} blur={2.6} far={4} color="#000000" />
    </Canvas>
  );
}
