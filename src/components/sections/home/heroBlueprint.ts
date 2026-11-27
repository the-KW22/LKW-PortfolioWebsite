// Pure blueprint data + maths for the home hero scene (ported 1:1 from the hero-lab mockup).
// No three.js, no DOM. Local units, centred, ~6.2 x 3.1.

export type Pt = [number, number];

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
const arc = (cx: number, cy: number, rx: number, ry: number, a0 = 0, a1 = Math.PI * 2, n = 48): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
  });

// Connector routes.
const conns: Pt[][] = [
  [[0, 0.8], [0.35, 0.8], [0.35, 1.25], [0.7, 1.25]],
  [[0, 0.8], [0.35, 0.8], [0.35, 0.45], [0.7, 0.45]],
  [[1.35, 0.15], [1.35, -0.78]],
  [[2.0, 0.45], [2.33, 0.45]],
  [[1.35, 0.75], [1.35, 0.95]],
];

const polys: Pt[][] = [
  rect(-3.1, -1.5, 0, 1.6), [[-3.1, 1.2], [0, 1.2]], [[-2.2, 1.2], [-2.2, -1.5]],
  ...[-2.85, -2.65, -2.45].map((x) => arc(x, 1.4, 0.06, 0.06, 0, Math.PI * 2, 12)),
  ...[0.8, 0.5, 0.2].map((y) => rect(-2.95, y, -2.4, y + 0.1)),
  rect(-2, 0.2, -0.2, 1.0), rect(-2, -1.2, -1.5, -0.2), rect(-1.35, -1.2, -0.85, -0.2), rect(-0.7, -1.2, -0.2, -0.2),
  rect(0.7, 0.95, 2.0, 1.55), rect(0.7, 0.15, 2.0, 0.75),
  arc(1.35, -0.95, 0.6, 0.17), arc(1.35, -1.55, 0.6, 0.17, Math.PI, Math.PI * 2, 24), arc(1.35, -1.25, 0.6, 0.17, Math.PI, Math.PI * 2, 24),
  [[0.75, -0.95], [0.75, -1.55]], [[1.95, -0.95], [1.95, -1.55]],
  arc(2.65, 0.45, 0.32, 0.32), arc(2.65, 0.45, 0.14, 0.14, 0, Math.PI * 2, 24),
  ...[0, 1, 2, 3].map((k): Pt[] => {
    const a = Math.PI / 4 + (k * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a);
    return [[2.65 + c * 0.14, 0.45 + s * 0.14], [2.65 + c * 0.32, 0.45 + s * 0.32]];
  }),
  ...conns,
];

const segs: [number, number, number, number][] = [];
for (const pl of polys) for (let i = 0; i < pl.length - 1; i++) segs.push([...pl[i], ...pl[i + 1]]);
const cum: number[] = [];
let total = 0;
for (const g of segs) { total += Math.hypot(g[2] - g[0], g[3] - g[1]); cum.push(total); }

/** Particle targets along the outlines: n xyz triplets (z jitter +-0.02). */
export function sampleBlueprint(n: number, rand: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = rand() * total;
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; }
    const g = segs[lo], len = cum[lo] - (lo ? cum[lo - 1] : 0), t = 1 - (cum[lo] - r) / len;
    out.set([g[0] + (g[2] - g[0]) * t, g[1] + (g[3] - g[1]) * t, (rand() - 0.5) * 0.04], i * 3);
  }
  return out;
}

/** Violet line segments: xyz per endpoint (2 per segment) and aT draw-order (start,end per segment, 0..1). */
export function blueprintLines(): { positions: Float32Array; order: Float32Array } {
  const positions = new Float32Array(segs.length * 6), order = new Float32Array(segs.length * 2);
  segs.forEach((g, i) => {
    positions.set([g[0], g[1], 0, g[2], g[3], 0], i * 6);
    order.set([i / segs.length, (i + 1) / segs.length], i * 2);
  });
  return { positions, order };
}

const rgb = (h: number): [number, number, number] => [(h >> 16) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];

/** Built-part triangles, interleaved 7 floats per vertex: x, y, z, r, g, b, buildOrder. */
export function blueprintSurfaces(): Float32Array {
  const tv: number[] = [];
  const tri = (a: Pt, c: number[], o: number) => tv.push(a[0], a[1], -0.02, ...c, o);
  const quad = (x0: number, y0: number, x1: number, y1: number, h: number, o: number) => {
    const c = rgb(h);
    tri([x0, y0], c, o); tri([x1, y0], c, o); tri([x1, y1], c, o); tri([x0, y0], c, o); tri([x1, y1], c, o); tri([x0, y1], c, o);
  };
  const fan = (cx: number, cy: number, rx: number, ry: number, h: number, o: number, a0 = 0, a1 = Math.PI * 2) => {
    const c = rgb(h), pts = arc(cx, cy, rx, ry, a0, a1, 32);
    for (let i = 0; i < 32; i++) { tri([cx, cy], c, o); tri(pts[i], c, o); tri(pts[i + 1], c, o); }
  };
  quad(-3.1, -1.5, 0, 1.6, 0x12102a, 0); quad(-3.1, 1.2, 0, 1.6, 0x1f1c4a, 0.05); quad(-3.1, -1.5, -2.2, 1.2, 0x171436, 0.1);
  [0.8, 0.5, 0.2].forEach((y, i) => quad(-2.95, y, -2.4, y + 0.1, 0x3a3480, 0.15 + i * 0.03));
  quad(-2, 0.2, -0.2, 1.0, 0x3a3380, 0.25);
  [[-2, -1.5], [-1.35, -0.85], [-0.7, -0.2]].forEach(([a, b], i) => quad(a, -1.2, b, -0.2, 0x2a2566, 0.3 + i * 0.05));
  quad(0.7, 0.95, 2.0, 1.55, 0x24205a, 0.5); quad(0.7, 0.15, 2.0, 0.75, 0x24205a, 0.55);
  quad(0.75, -1.55, 1.95, -0.95, 0x1f1c4e, 0.65); fan(1.35, -1.55, 0.6, 0.17, 0x1f1c4e, 0.65, Math.PI, Math.PI * 2); fan(1.35, -0.95, 0.6, 0.17, 0x3a3490, 0.7);
  fan(2.65, 0.45, 0.32, 0.32, 0x4a5e0c, 0.8); fan(2.65, 0.45, 0.14, 0.14, 0xc6f432, 0.85);
  return new Float32Array(tv);
}

