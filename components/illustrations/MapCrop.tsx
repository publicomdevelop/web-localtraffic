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

const cache = new Map<string, { streets: string; avenues: string; lots: string }>();

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
  let lots = "";
  city.cells.forEach((c) => {
    if (!inView(project(crop, c.center), 80)) return;
    c.lots.forEach((lot) => {
      lot.forEach((p, i) => {
        const q = project(crop, p);
        lots += `${i ? "L" : "M"}${f(q.x)} ${f(q.y)}`;
      });
      lots += "Z";
    });
  });
  const out = { streets, avenues, lots };
  cache.set(key, out);
  return out;
}

export function MapCrop({ crop }: { crop: Crop }) {
  const { streets, avenues, lots } = cropPaths(crop);
  return (
    <g aria-hidden="true">
      <path d={lots} fill="rgba(236,237,247,0.045)" />
      <path d={streets} stroke="rgba(236,237,247,0.1)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d={avenues} stroke="rgba(236,237,247,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}
