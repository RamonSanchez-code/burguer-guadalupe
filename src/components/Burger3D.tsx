import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, Sparkles } from "@react-three/drei";
import { useMemo, useRef, type ReactNode } from "react";
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

function makeTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  srgb = true
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function blob(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot: number) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
}

function useBurgerTextures() {
  return useMemo(() => {
    const rand = lcg(7);

    // fine crumb / pore bump shared by the buns
    const crumb = makeTexture(
      256,
      256,
      (ctx, w, h) => {
        ctx.fillStyle = "#808080";
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 2600; i++) {
          const v = Math.floor(90 + rand() * 90);
          ctx.globalAlpha = 0.25 + rand() * 0.35;
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          blob(ctx, rand() * w, rand() * h, 0.8 + rand() * 2.2, 0.8 + rand() * 2.2, rand() * 3);
        }
        ctx.globalAlpha = 1;
      },
      false
    );

    // grilled beef — mottled meat, fibres, char marks and fat flecks
    const patty = makeTexture(1024, 512, (ctx, w, h) => {
      ctx.fillStyle = "#5a3122";
      ctx.fillRect(0, 0, w, h);
      const meat = ["#4a2618", "#6d3e2b", "#3b1e12", "#7b4a36", "#63352a"];
      for (let i = 0; i < 380; i++) {
        ctx.globalAlpha = 0.22 + rand() * 0.28;
        ctx.fillStyle = meat[Math.floor(rand() * meat.length)];
        blob(ctx, rand() * w, rand() * h, 6 + rand() * 34, 4 + rand() * 20, rand() * 3.14);
      }
      for (let i = 0; i < 2200; i++) {
        ctx.globalAlpha = 0.12 + rand() * 0.22;
        ctx.strokeStyle = rand() > 0.55 ? "#8d5b45" : "#24110a";
        ctx.lineWidth = 0.7 + rand() * 1.6;
        const x = rand() * w;
        const y = rand() * h;
        const a = rand() * Math.PI;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * (6 + rand() * 14), y + Math.sin(a) * (6 + rand() * 14));
        ctx.stroke();
      }
      for (let i = 0; i < 90; i++) {
        ctx.globalAlpha = 0.35 + rand() * 0.45;
        ctx.fillStyle = "#170a05";
        blob(ctx, rand() * w, rand() * h, 3 + rand() * 20, 3 + rand() * 12, rand() * 3.14);
      }
      for (let i = 0; i < 700; i++) {
        ctx.globalAlpha = 0.2 + rand() * 0.3;
        ctx.fillStyle = "#c8998a";
        blob(ctx, rand() * w, rand() * h, 0.8 + rand() * 2, 0.8 + rand() * 2, 0);
      }
      ctx.globalAlpha = 1;
    });

    // tomato slice — skin ring, flesh, seed chambers and core
    const tomato = makeTexture(512, 512, (ctx, w) => {
      const c = w / 2;
      ctx.fillStyle = "#ab2411";
      ctx.fillRect(0, 0, w, w);
      const flesh = ctx.createRadialGradient(c, c, 10, c, c, c * 0.93);
      flesh.addColorStop(0, "#e56a4c");
      flesh.addColorStop(0.7, "#d84a2c");
      flesh.addColorStop(1, "#c53520");
      ctx.fillStyle = flesh;
      ctx.beginPath();
      ctx.arc(c, c, c * 0.93, 0, Math.PI * 2);
      ctx.fill();
      const n = 6;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + 0.3;
        // seed chamber
        ctx.save();
        ctx.translate(c + Math.cos(a) * c * 0.5, c + Math.sin(a) * c * 0.5);
        ctx.rotate(a);
        ctx.fillStyle = "rgba(240,120,84,0.85)";
        ctx.beginPath();
        ctx.ellipse(0, 0, c * 0.26, c * 0.17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(244,224,150,0.9)";
        for (let k = 0; k < 7; k++) {
          ctx.beginPath();
          ctx.ellipse((rand() - 0.5) * c * 0.34, (rand() - 0.5) * c * 0.2, 5, 3, rand() * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        // wall between chambers
        const wa = a + Math.PI / n;
        ctx.strokeStyle = "rgba(196,52,32,0.9)";
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(wa) * 40, c + Math.sin(wa) * 40);
        ctx.lineTo(c + Math.cos(wa) * c * 0.8, c + Math.sin(wa) * c * 0.8);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(240,186,166,0.95)";
      ctx.beginPath();
      ctx.arc(c, c, 36, 0, Math.PI * 2);
      ctx.fill();
    });

    // lettuce — pale heart to dark frilly edge, with veins
    const lettuce = makeTexture(1024, 1024, (ctx, w) => {
      const c = w / 2;
      const g = ctx.createRadialGradient(c, c, 20, c, c, c);
      g.addColorStop(0, "#c2e08a");
      g.addColorStop(0.35, "#8dbb47");
      g.addColorStop(0.8, "#5a9a2c");
      g.addColorStop(1, "#3f7a1f");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, w);
      ctx.translate(c, c);
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2 + rand() * 0.2;
        ctx.save();
        ctx.rotate(a);
        ctx.strokeStyle = "rgba(226,240,178,0.4)";
        ctx.lineWidth = 3 + rand() * 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(c * 0.3, (rand() - 0.5) * 50, c * 0.95, (rand() - 0.5) * 90);
        ctx.stroke();
        for (let k = 0; k < 6; k++) {
          const d = c * (0.15 + k * 0.13);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(226,240,178,0.28)";
          ctx.beginPath();
          ctx.moveTo(d, 0);
          ctx.lineTo(d + 60, 44 + rand() * 20);
          ctx.moveTo(d, 0);
          ctx.lineTo(d + 60, -44 - rand() * 20);
          ctx.stroke();
        }
        ctx.restore();
      }
      for (let i = 0; i < 700; i++) {
        ctx.globalAlpha = 0.06 + rand() * 0.1;
        ctx.fillStyle = rand() > 0.5 ? "#2f5f16" : "#b6da79";
        blob(ctx, (rand() - 0.5) * w, (rand() - 0.5) * w, 3 + rand() * 12, 3 + rand() * 12, rand() * 3);
      }
      ctx.globalAlpha = 1;
    });

    // bacon — crisp meat stripes with rendered golden fat (stripes run along the length)
    const bacon = makeTexture(512, 128, (ctx, w, h) => {
      const meat = ["#a8331a", "#bd4626", "#c9532c", "#b03b20"];
      const fat = ["#f2c98a", "#e8b872", "#f8dcaa"];
      ctx.fillStyle = "#b03b20";
      ctx.fillRect(0, 0, w, h);
      let y = 0;
      let i = 0;
      while (y < h + 20) {
        const isFat = i % 2 === 1;
        const th = isFat ? 9 + rand() * 12 : 20 + rand() * 16;
        const p = rand() * 6;
        const palette = isFat ? fat : meat;
        ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(p) * 4);
        for (let x = 0; x <= w; x += 8) ctx.lineTo(x, y + Math.sin(x * 0.03 + p) * 4);
        for (let x = w; x >= 0; x -= 8) ctx.lineTo(x, y + th + Math.sin(x * 0.03 + p + 1) * 4);
        ctx.closePath();
        ctx.fill();
        y += th;
        i++;
      }
      for (let k = 0; k < 500; k++) {
        ctx.globalAlpha = 0.1 + rand() * 0.2;
        ctx.fillStyle = rand() > 0.5 ? "#3a1207" : "#f6d9a8";
        blob(ctx, rand() * w, rand() * h, 1 + rand() * 6, 0.6 + rand() * 1.4, 0);
      }
      const edge = ctx.createLinearGradient(0, 0, 0, h);
      edge.addColorStop(0, "rgba(70,20,8,0.5)");
      edge.addColorStop(0.16, "rgba(70,20,8,0)");
      edge.addColorStop(0.84, "rgba(70,20,8,0)");
      edge.addColorStop(1, "rgba(70,20,8,0.5)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = edge;
      ctx.fillRect(0, 0, w, h);
    });

    patty.repeat.set(3, 1);
    crumb.repeat.set(6, 3);
    return { crumb, patty, tomato, lettuce, bacon };
  }, []);
}

/* ------------------------------------------------------------------ */
/* organic geometries                                                  */
/* ------------------------------------------------------------------ */

function sampleProfile(points: [number, number][], samples: number) {
  const curve = new THREE.SplineCurve(points.map(([r, y]) => new THREE.Vector2(r, y)));
  return curve.getPoints(samples).map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
}

function paint(geo: THREE.BufferGeometry, fn: (p: THREE.Vector3, n: THREE.Vector3) => THREE.Color) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    n.fromBufferAttribute(nor, i);
    const c = fn(p, n);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

/** Glossy brioche dome — smooth, golden, darker toward the crown */
function useTopBun() {
  return useMemo(() => {
    const rand = lcg(3);
    const dome = sampleProfile(
      [
        [1.62, 0],
        [1.76, 0.07],
        [1.82, 0.22],
        [1.76, 0.47],
        [1.56, 0.76],
        [1.2, 1.0],
        [0.7, 1.14],
        [0, 1.19],
      ],
      44
    );
    const pts = [new THREE.Vector2(0, 0.02), new THREE.Vector2(0.8, 0.015), ...dome];
    const geo = new THREE.LatheGeometry(pts, 96);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.z, v.x);
      const groove = Math.exp(-Math.pow(v.y - 0.3, 2) / 0.0016) * 0.014;
      const k = 1 + trigNoise(a, 1.1, 2.3, 0.4) * 0.012 - groove;
      pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
    geo.computeVertexNormals();
    const side = new THREE.Color("#dc9a4a");
    const crown = new THREE.Color("#a04e17");
    const c = new THREE.Color();
    paint(geo, (p) => {
      const t = smoothstep(0.1, 1.15, p.y);
      c.copy(side).lerp(crown, Math.pow(t, 0.8));
      const blotch =
        Math.sin(p.x * 2.3 + p.z * 1.7) * Math.sin(p.z * 2.9 - p.x * 1.3) * 0.11 +
        Math.sin(p.x * 6.1 + p.z * 5.3) * 0.045;
      const j = 1 + (rand() - 0.5) * 0.07 + blotch;
      const out = c.clone().multiplyScalar(j);
      out.r *= 1 + blotch * 0.5; // warmer where the wash pooled
      return out;
    });
    return geo;
  }, []);
}

/** Bottom bun with a toasted cut face */
function useBottomBun() {
  return useMemo(() => {
    const rand = lcg(19);
    const body = sampleProfile(
      [
        [0.0, 0],
        [0.9, 0.0],
        [1.45, 0.06],
        [1.68, 0.22],
        [1.74, 0.46],
        [1.7, 0.66],
        [1.62, 0.74],
      ],
      34
    );
    const pts = [...body, new THREE.Vector2(1.2, 0.75), new THREE.Vector2(0.6, 0.752), new THREE.Vector2(0, 0.75)];
    const geo = new THREE.LatheGeometry(pts, 96);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.z, v.x);
      const k = 1 + trigNoise(a, 4.1, 0.7, 1.9) * 0.014;
      pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
    geo.computeVertexNormals();
    const pale = new THREE.Color("#e6b56f");
    const golden = new THREE.Color("#d0913f");
    const toast = new THREE.Color("#b9782f");
    const c = new THREE.Color();
    paint(geo, (p, n) => {
      const r = Math.hypot(p.x, p.z);
      c.copy(pale).lerp(golden, smoothstep(0.1, 0.7, p.y));
      const top = smoothstep(0.55, 0.95, n.y) * smoothstep(0.6, 0.74, p.y);
      c.lerp(toast, top * (0.75 + 0.25 * Math.sin(r * 5)));
      return c.clone().multiplyScalar(1 + (rand() - 0.5) * 0.06);
    });
    return geo;
  }, []);
}

/** Thick, irregular grilled patty with rounded seared edges */
function usePatty() {
  return useMemo(() => {
    const rand = lcg(5);
    const prof = sampleProfile(
      [
        [0, 0],
        [1.1, 0],
        [1.6, 0.02],
        [1.78, 0.1],
        [1.83, 0.27],
        [1.78, 0.42],
        [1.62, 0.55],
        [1.3, 0.6],
        [0.7, 0.615],
        [0, 0.6],
      ],
      54
    );
    const geo = new THREE.LatheGeometry(prof, 110);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.z, v.x);
      const r = Math.hypot(v.x, v.z);
      const edge = smoothstep(1.2, 1.85, r);
      const lump = trigNoise(a, 2.2, 5.1, 0.7) * 0.065 * edge + (rand() - 0.5) * 0.026 * edge;
      const k = 1 + lump;
      const top = v.y > 0.3 ? 1 : 0.35;
      const bump = (Math.sin(v.x * 4.2) * Math.sin(v.z * 3.6) * 0.018 + Math.sin(v.x * 9 + v.z * 7) * 0.008) * top;
      pos.setXYZ(i, v.x * k, v.y + bump, v.z * k);
    }
    geo.computeVertexNormals();
    const meat = new THREE.Color("#c98060");
    const seared = new THREE.Color("#6a3b28");
    const c = new THREE.Color();
    paint(geo, (p, n) => {
      const r = Math.hypot(p.x, p.z);
      c.copy(meat).lerp(seared, smoothstep(0.35, 0.95, 1 - Math.abs(n.y)) * 0.55 + smoothstep(1.55, 1.85, r) * 0.2);
      return c.clone().multiplyScalar(1 + (rand() - 0.5) * 0.18);
    });
    return geo;
  }, []);
}

/** Polar-grid disc so ruffles get real vertex density */
function polarDisc(
  R: number,
  rings: number,
  segs: number,
  shape: (r: number, a: number) => { r: number; y: number }
) {
  const count = 1 + rings * segs;
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const index: number[] = [];
  const put = (i: number, x: number, y: number, z: number) => {
    positions.set([x, y, z], i * 3);
    uvs.set([0.5 + (x / R) * 0.5, 0.5 + (z / R) * 0.5], i * 2);
  };
  put(0, 0, shape(0, 0).y, 0);
  for (let i = 1; i <= rings; i++) {
    for (let j = 0; j < segs; j++) {
      const a = (j / segs) * Math.PI * 2;
      const { r, y } = shape((i / rings) * R, a);
      put(1 + (i - 1) * segs + j, Math.cos(a) * r, y, Math.sin(a) * r);
    }
  }
  const at = (i: number, j: number) => 1 + (i - 1) * segs + (j % segs);
  for (let j = 0; j < segs; j++) index.push(0, at(1, j + 1), at(1, j));
  for (let i = 1; i < rings; i++) {
    for (let j = 0; j < segs; j++) {
      const A = at(i, j);
      const B = at(i, j + 1);
      const C = at(i + 1, j);
      const D = at(i + 1, j + 1);
      index.push(A, B, C, B, D, C);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

/** Frilly lettuce leaf that ruffles and curls past the bun edge */
function useLettuce(seed: number, R: number) {
  return useMemo(
    () =>
      polarDisc(R, 46, 180, (r, a) => {
        const t = r / R;
        const edge = smoothstep(0.25, 1, t);
        const frill = 1 + Math.sin(a * 11 + seed) * 0.055 * edge + Math.sin(a * 19 + seed * 2) * 0.03 * edge;
        const wave =
          Math.sin(a * 9 + seed + t * 3.5) * 0.16 * edge +
          Math.sin(a * 21 - seed + t * 6) * 0.075 * edge * edge +
          Math.sin(a * 5 + seed * 3) * 0.06 * t +
          Math.sin(t * 9 + seed) * 0.02;
        const curl = edge * edge * 0.12;
        return { r: r * frill, y: wave + curl };
      }),
    [seed, R]
  );
}

/** Melted cheese slice — rounded square that drapes over the patty and drips at the corners */
function useCheese(seed: number) {
  return useMemo(() => {
    const rand = lcg(seed);
    const drips = Array.from({ length: 8 }, () => ({
      ang: rand() * Math.PI * 2,
      depth: 0.16 + rand() * 0.3,
      width: 0.14 + rand() * 0.22,
    }));
    const half = 1.75;
    const R = half * Math.pow(2, 0.25);
    return polarDisc(R, 56, 220, (rr, a) => {
      const c = Math.abs(Math.cos(a));
      const s2 = Math.abs(Math.sin(a));
      const bound = half / Math.pow(Math.pow(c, 4) + Math.pow(s2, 4), 0.25);
      const t = rr / R;
      const r = t * bound * (1 + Math.sin(a * 13 + seed) * 0.012 * smoothstep(0.7, 1, t));
      let y = -Math.pow(Math.max(0, r - 1.25), 2) * 0.75;
      let lobe = 0;
      for (const d of drips) {
        const da = Math.abs(((a - d.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        lobe += d.depth * Math.exp(-(da * da) / (2 * d.width * d.width));
      }
      y -= lobe * smoothstep(1.85, 2.15, r) * 0.5;
      // melted bead along the rim + soft waviness
      y += smoothstep(0.93, 1, t) * 0.022;
      y += Math.sin(a * 9 + seed) * 0.014 * smoothstep(1.4, 2, r) + Math.sin(r * 9 + a * 3) * 0.006;
      return { r, y: Math.max(y, -0.85) };
    });
  }, [seed]);
}

/** Crispy, curly bacon strip */
function useBacon(len: number, seed: number) {
  const W = 0.72;
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(len, W, 130, 12);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const u = v.x / (len / 2); // -1..1 along length
      const across = v.z / (W / 2); // -1..1 across
      const ripple = Math.sin(u * Math.PI * 4.5 + seed) * 0.075 + Math.sin(u * Math.PI * 11 + seed * 2) * 0.022;
      const arch = (1 - u * u) * 0.1 + smoothstep(0.7, 1, Math.abs(u)) * 0.13;
      const curl = across * across * 0.05 * Math.sin(u * 5 + seed);
      const wobble = Math.sin(u * Math.PI * 3 + seed) * 0.07 + Math.sin(u * 9 + seed) * 0.02;
      pos.setXYZ(i, v.x, ripple + arch + curl, v.z + wobble);
    }
    geo.computeVertexNormals();
    return geo;
  }, [len, seed, W]);
}

/* ------------------------------------------------------------------ */
/* assembly choreography                                               */
/* ------------------------------------------------------------------ */

const START = 1.9; // seconds after canvas mount (waits for the preloader)
const FALL = 0.85; // seconds each ingredient takes to land

const STEPS = [
  { delay: 0, label: "Pão brioche tostado" },
  { delay: 0.55, label: "Alface crocante" },
  { delay: 1.0, label: "Tomate fresco" },
  { delay: 1.5, label: "Blend suculento na chapa" },
  { delay: 2.05, label: "Cheddar derretendo" },
  { delay: 2.55, label: "Bacon crocante" },
  { delay: 3.05, label: "Pão brioche dourado" },
] as const;

const END = START + STEPS[STEPS.length - 1].delay + FALL;

function easeOutBack(k: number) {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
}

/** Drops an ingredient from above, spinning into place with a soft bounce */
function Layer({ step, children }: { step: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime - START - STEPS[step].delay;
    const k = Math.min(1, Math.max(0, t / FALL));
    const e = easeOutBack(k);
    g.visible = t > 0;
    g.position.y = (1 - e) * 5.5;
    g.rotation.y = (1 - k) * (1 - k) * (step % 2 ? 3.2 : -3.2);
  });
  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  );
}

/** Caption that names each ingredient as it lands */
function Caption() {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const last = useRef(-1);
  useFrame((state) => {
    const t = state.clock.elapsedTime - START;
    let idx = -1;
    for (let i = 0; i < STEPS.length; i++) if (t >= STEPS[i].delay + FALL * 0.55) idx = i;
    if (idx !== last.current && text.current && count.current) {
      last.current = idx;
      text.current.textContent = idx >= 0 ? STEPS[idx].label : "";
      count.current.textContent = idx >= 0 ? `0${idx + 1}/0${STEPS.length}` : "";
    }
    if (box.current) {
      const done = state.clock.elapsedTime - END;
      const o = idx < 0 ? 0 : done > 0.6 ? Math.max(0, 1 - (done - 0.6) / 0.6) : 1;
      box.current.style.opacity = String(o);
    }
  });
  return (
    <Html fullscreen zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
      <div className="absolute inset-x-0 bottom-2 flex justify-center px-3 lg:bottom-[9%]">
        <div
          ref={box}
          style={{ opacity: 0 }}
          className="flex items-center gap-3 rounded-full border border-ember/40 bg-coal/70 px-4 py-2 backdrop-blur-md transition-opacity duration-200"
        >
          <span ref={count} className="font-mono text-[10px] tracking-widest text-ember" />
          <span ref={text} className="font-display text-sm uppercase tracking-wider text-cream sm:text-base" />
        </div>
      </div>
    </Html>
  );
}

/* ------------------------------------------------------------------ */
/* burger                                                              */
/* ------------------------------------------------------------------ */

function BurgerStack({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null!);
  const spin = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const tex = useBurgerTextures();
  const topBun = useTopBun();
  const bottomBun = useBottomBun();
  const pattyGeo = usePatty();
  const lettuceA = useLettuce(4, 2.05);
  const lettuceB = useLettuce(9, 1.85);
  const cheeseGeo = useCheese(21);
  const baconA = useBacon(4.4, 5);
  const baconB = useBacon(4.0, 12);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    spin.current += delta * 0.22;
    const p = progress.get();
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, 0.06);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, 0.06);
    group.current.position.y = Math.sin(t * 0.85) * 0.1;
    group.current.rotation.y = spin.current + p * Math.PI * 2.25 + pointer.current.x * 0.35;
    group.current.rotation.x = pointer.current.y * -0.18 + Math.sin(t * 0.5) * 0.02;
    group.current.rotation.z = Math.sin(t * 0.6) * 0.03;
  });

  return (
    <group ref={group} rotation={[0.1, 0, 0]} scale={0.84}>
      {/* slate plate */}
      <mesh position={[0, -1.68, 0]} receiveShadow>
        <cylinderGeometry args={[2.45, 2.3, 0.1, 72]} />
        <meshPhysicalMaterial color="#1a1612" roughness={0.5} clearcoat={0.5} clearcoatRoughness={0.35} />
      </mesh>

      {/* bottom bun */}
      <Layer step={0}>
        <mesh geometry={bottomBun} position={[0, -1.63, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial
            vertexColors
            bumpMap={tex.crumb}
            bumpScale={1.4}
            roughness={0.55}
            clearcoat={0.25}
            clearcoatRoughness={0.5}
          />
        </mesh>
      </Layer>

      {/* lettuce — two ruffled leaves */}
      <Layer step={1}>
        <mesh geometry={lettuceA} position={[0, -0.86, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial
            map={tex.lettuce}
            roughness={0.42}
            clearcoat={0.35}
            clearcoatRoughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={lettuceB} position={[0.05, -0.8, 0.02]} rotation={[0, 1.1, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial
            map={tex.lettuce}
            roughness={0.42}
            clearcoat={0.35}
            clearcoatRoughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Layer>

      {/* tomato — two thick slices */}
      <Layer step={2}>
        {[
          { p: [-0.72, -0.71, 0.12], r: 1.16, ry: 0.4 },
          { p: [0.78, -0.7, -0.1], r: 1.12, ry: 2.2 },
        ].map((t, i) => (
          <mesh
            key={i}
            position={t.p as [number, number, number]}
            rotation={[0.02 * (i ? -1 : 1), t.ry, 0.03 * (i ? 1 : -1)]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[t.r, t.r, 0.14, 72, 1]} />
            <meshPhysicalMaterial attach="material-0" color="#b32a16" roughness={0.28} clearcoat={0.85} clearcoatRoughness={0.18} />
            <meshPhysicalMaterial attach="material-1" map={tex.tomato} roughness={0.22} clearcoat={0.9} clearcoatRoughness={0.15} />
            <meshPhysicalMaterial attach="material-2" map={tex.tomato} roughness={0.22} clearcoat={0.9} clearcoatRoughness={0.15} />
          </mesh>
        ))}
      </Layer>

      {/* patty */}
      <Layer step={3}>
        <mesh geometry={pattyGeo} position={[0, -0.64, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial
            vertexColors
            map={tex.patty}
            bumpMap={tex.patty}
            bumpScale={3}
            roughness={0.58}
            clearcoat={0.5}
            clearcoatRoughness={0.38}
          />
        </mesh>
      </Layer>

      {/* melted cheddar */}
      <Layer step={4}>
        <mesh geometry={cheeseGeo} position={[0, 0.11, 0]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#f59a08"
            emissive="#7a3000"
            emissiveIntensity={0.3}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.14}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Layer>

      {/* bacon */}
      <Layer step={5}>
        <mesh geometry={baconA} position={[0.05, 0.11, 0.42]} rotation={[0, 0.12, 0]} scale={[1, 1, 0.97]} castShadow>
          <meshPhysicalMaterial color="#8a2a12" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={baconB} position={[-0.1, 0.13, -0.45]} rotation={[0, -0.32, 0]} scale={[1, 1, 0.97]} castShadow>
          <meshPhysicalMaterial color="#8a2a12" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={baconA} position={[0.05, 0.14, 0.42]} rotation={[0, 0.12, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={tex.bacon} roughness={0.4} clearcoat={0.55} clearcoatRoughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={baconB} position={[-0.1, 0.16, -0.45]} rotation={[0, -0.32, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={tex.bacon} roughness={0.4} clearcoat={0.55} clearcoatRoughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </Layer>

      {/* top bun */}
      <Layer step={6}>
        <mesh geometry={topBun} position={[0, 0.23, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial
            vertexColors
            bumpMap={tex.crumb}
            bumpScale={0.7}
            roughness={0.34}
            clearcoat={0.75}
            clearcoatRoughness={0.22}
          />
        </mesh>
      </Layer>

      {/* glow ring */}
      <mesh position={[0, -1.64, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.72, 0.01, 8, 90]} />
        <meshBasicMaterial color="#ff7a1a" transparent opacity={0.35} />
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
      shadows
      camera={{ position: [0, 1.0, 7.8], fov: 35 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute !inset-0"
    >
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.1}
        color="#ffe8cc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={5}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
        shadow-normalBias={0.03}
      />
      <spotLight position={[0, 4, -7]} angle={0.6} penumbra={1} intensity={50} color="#ffc98a" />
      <pointLight position={[-6, 2, -4]} intensity={45} distance={18} decay={2} color="#ff7a1a" />

      {/* studio environment — rendered locally, no external HDR */}
      <Environment resolution={256}>
        <Lightformer intensity={5} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} color="#fff3e0" />
        <Lightformer intensity={2.5} position={[-5, 1.5, -1]} rotation-y={Math.PI / 2} scale={[7, 2.5, 1]} color="#ffb347" />
        <Lightformer intensity={2.2} position={[5, 2, 3]} rotation-y={-Math.PI / 2} scale={[7, 3, 1]} color="#ffdcb0" />
        <Lightformer intensity={1.6} position={[0, 1, 7]} scale={[5, 2, 1]} color="#ffe9cf" />
      </Environment>

      <BurgerStack progress={progress} />
      <Caption />
      <Sparkles count={26} scale={[9, 7, 6]} position={[0, 0.6, 0]} size={1.6} speed={0.25} opacity={0.35} color="#ffb347" />
      <ContactShadows position={[0, -1.78, 0]} opacity={0.6} scale={11} blur={2.6} far={4} color="#000000" />
    </Canvas>
  );
}
