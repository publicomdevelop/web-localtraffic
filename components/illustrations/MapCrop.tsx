import { getCity, type Vec } from "@/lib/city/model";

export const VB_W = 480;
export const VB_H = 360;

export type Crop = { cx: number; cy: number; k: number };

export const project = (crop: Crop, p: Vec): Vec => ({
  x: (p.x - crop.cx) * crop.k + VB_W / 2,
  y: (p.y - crop.cy) * crop.k + VB_H / 2,
});

const inView = (p: Vec, pad = 40) => p.x > -pad && p.x < VB_W + pad && p.y > -pad && p.y < VB_H + pad;
const f = (n: number) => n.toFixed(1);

const cache = new Map<string, { streets: string; avenues: string; lots: { sideR: string; sideL: string; roofs: string } }>();

/** SVG paths for a window of the same illustrated city used by the canvas. */
export function cropPaths(crop: Crop) {
  const key = `${crop.cx},${crop.cy},${crop.k}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const city = getCity();
  let streets = "";
  let avenues = "";
  city.edges.forEach((e) => {
    const a = project(crop, city.nodes[e.a]);
    const b = project(crop, city.nodes[e.b]);
    if (!inView(a) && !inView(b)) return;
    const d = `M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}`;
    if (e.avenue) avenues += d;
    else streets += d;
  });
  // Isometric buildings: shaded sides plus a lighter roof, back to front.
  const boxes: { pts: Vec[]; h: number }[] = [];
  city.cells.forEach((c) => {
    if (!inView(project(crop, c.center), 80)) return;
    c.lots.forEach((lot, li) => boxes.push({ pts: lot.map((p) => project(crop, p)), h: c.heights[li] * crop.k }));
  });
  boxes.sort((a, b) => a.pts[2].y - b.pts[2].y);
  // Three merged paths (right sides, left sides, roofs) keep the DOM small.
  let sideR = "";
  let sideL = "";
  let roofs = "";
  const poly = (pts: Vec[]) => pts.map((p, i) => `${i ? "L" : "M"}${f(p.x)} ${f(p.y)}`).join("") + "Z";
  const up = (p: Vec, h: number) => ({ x: p.x, y: p.y - h });
  boxes.forEach(({ pts, h }) => {
    const [p0, p1, p2, p3] = pts;
    sideR += poly([p1, p2, up(p2, h), up(p1, h)]);
    sideL += poly([p2, p3, up(p3, h), up(p2, h)]);
    roofs += poly([up(p0, h), up(p1, h), up(p2, h), up(p3, h)]);
  });
  const lots = { sideR, sideL, roofs };
  const out = { streets, avenues, lots };
  cache.set(key, out);
  return out;
}

/**
 * A rectangular group of blocks (cells i0..i1, j0..j1) as it sits on the
 * isometric ground: its outline and the roofs of the buildings inside it.
 */
export function blockArea(crop: Crop, i0: number, j0: number, i1: number, j1: number) {
  const city = getCity();
  const node = (i: number, j: number) => project(crop, city.nodes[j * (city.nx + 1) + i]);
  const outline = [node(i0, j0), node(i1 + 1, j0), node(i1 + 1, j1 + 1), node(i0, j1 + 1)];
  let roofs = "";
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const cell = city.cells[j * city.nx + i];
      cell.lots.forEach((lot, li) => {
        const h = cell.heights[li] * crop.k;
        roofs += lot.map((p, k) => {
          const q = project(crop, p);
          return `${k ? "L" : "M"}${f(q.x)} ${f(q.y - h)}`;
        }).join("") + "Z";
      });
    }
  }
  const d = outline.map((p, k) => `${k ? "L" : "M"}${f(p.x)} ${f(p.y)}`).join("") + "Z";
  const top = outline.reduce((a, b) => (b.y < a.y ? b : a));
  return { outline: d, roofs, top };
}

/**
 * Any set of blocks on the isometric ground: the ground fill, the roofs of the
 * buildings inside and the outer border (edges shared with blocks outside the set).
 */
export function blockSet(crop: Crop, blocks: [number, number][]) {
  const city = getCity();
  const node = (i: number, j: number) => project(crop, city.nodes[j * (city.nx + 1) + i]);
  const inSet = new Set(blocks.map(([i, j]) => `${i},${j}`));
  const has = (i: number, j: number) => inSet.has(`${i},${j}`);
  const seg = (a: Vec, b: Vec) => `M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}`;
  let ground = "";
  let roofs = "";
  let border = "";
  let streets = "";
  for (const [i, j] of blocks) {
    const q = [node(i, j), node(i + 1, j), node(i + 1, j + 1), node(i, j + 1)];
    ground += q.map((p, k) => `${k ? "L" : "M"}${f(p.x)} ${f(p.y)}`).join("") + "Z";
    streets += seg(q[0], q[1]) + seg(q[1], q[2]) + seg(q[2], q[3]) + seg(q[3], q[0]);
    if (!has(i - 1, j)) border += seg(q[0], q[3]);
    if (!has(i + 1, j)) border += seg(q[1], q[2]);
    if (!has(i, j - 1)) border += seg(q[0], q[1]);
    if (!has(i, j + 1)) border += seg(q[3], q[2]);
    const cell = city.cells[j * city.nx + i];
    cell.lots.forEach((lot, li) => {
      const h = cell.heights[li] * crop.k;
      roofs += lot.map((p, k) => {
        const r = project(crop, p);
        return `${k ? "L" : "M"}${f(r.x)} ${f(r.y - h)}`;
      }).join("") + "Z";
    });
  }
  return { ground, roofs, border, streets };
}

/** Bump when the drawing of the city changes, so cached map files are refreshed. */
export const MAPCROP_VERSION = 1;

export const mapCropUrl = (crop: Crop) => `/mapcrop/v${MAPCROP_VERSION}_${Math.round(crop.cx)}_${Math.round(crop.cy)}_${crop.k}.svg`;

/** The city behind an illustration, loaded as a cached SVG file instead of inline paths. */
export function MapCrop({ crop }: { crop: Crop }) {
  return <image href={mapCropUrl(crop)} x="0" y="0" width={VB_W} height={VB_H} aria-hidden="true" />;
}
