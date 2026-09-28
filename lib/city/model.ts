// Procedural, deterministic "ciudad ilustrada". It is invented on purpose: the
// site cannot show real clients or municipalities, so every number derived
// from it is labelled as example data in the UI.

export type Vec = { x: number; y: number };

export type Edge = {
  a: number;
  b: number;
  length: number;
  avenue: boolean;
  /** 0..1, how commercial the street is (drives shops, walkers, spend). */
  commerce: number;
};

export type Lot = Vec[];

export type Cell = {
  /** Full block outline (street centre lines), used for area fills. */
  quad: Vec[];
  poly: Vec[];
  center: Vec;
  /** 0..1 resident density, used by the "fuentes públicas" layer. */
  pop: number;
  park: boolean;
  lots: Lot[];
  /** 0..1 household income, for the resident profile. */
  income: number;
  /** Index of the postal-code zone this block belongs to. */
  zone: number;
};

/** Postal-code area: card spending is only known at this level, never per street. */
export type Zone = { centroid: Vec; spend: number; cells: number[] };

export type Shop = { p: Vec; weight: number };

export type TrafficPath = {
  points: Vec[];
  cumulative: number[];
  length: number;
  closed: boolean;
};

export type CityModel = {
  width: number;
  height: number;
  nodes: Vec[];
  edges: Edge[];
  adjacency: number[][];
  cells: Cell[];
  shops: Shop[];
  shopCdf: number[];
  paths: TrafficPath[];
  hubs: Vec[];
  zones: Zone[];
  zoneBorders: [Vec, Vec][];
};

export const WORLD_W = 1600;
export const WORLD_H = 1000;
/** World units per 100 m, used by the scale bar and the isochrone budget. */
export const UNITS_PER_100M = 26;

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const dist = (p: Vec, q: Vec) => Math.hypot(p.x - q.x, p.y - q.y);

function bilinear(q: Vec[], u: number, v: number): Vec {
  // q: [topLeft, topRight, bottomRight, bottomLeft]
  const top = { x: lerp(q[0].x, q[1].x, u), y: lerp(q[0].y, q[1].y, u) };
  const bottom = { x: lerp(q[3].x, q[2].x, u), y: lerp(q[3].y, q[2].y, u) };
  return { x: lerp(top.x, bottom.x, v), y: lerp(top.y, bottom.y, v) };
}

function buildPath(points: Vec[], closed: boolean): TrafficPath {
  const pts = closed ? [...points, points[0]] : points;
  const cumulative = [0];
  for (let i = 1; i < pts.length; i++) {
    cumulative.push(cumulative[i - 1] + dist(pts[i - 1], pts[i]));
  }
  return { points: pts, cumulative, length: cumulative[cumulative.length - 1], closed };
}

export function pointOnPath(path: TrafficPath, s: number): { p: Vec; dir: Vec } {
  const L = path.length;
  const d = ((s % L) + L) % L;
  const c = path.cumulative;
  let lo = 0;
  let hi = c.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (c[mid] <= d) lo = mid;
    else hi = mid;
  }
  const a = path.points[lo];
  const b = path.points[hi];
  const seg = c[hi] - c[lo] || 1;
  const t = (d - c[lo]) / seg;
  const dx = (b.x - a.x) / seg;
  const dy = (b.y - a.y) / seg;
  return { p: { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }, dir: { x: dx, y: dy } };
}

let cached: CityModel | null = null;

export function getCity(): CityModel {
  if (!cached) cached = buildCity(20260925);
  return cached;
}

function buildCity(seed: number): CityModel {
  const rand = mulberry32(seed);
  const NX = 30;
  const NY = 22;
  const S = 72;
  const cx = WORLD_W / 2;
  const cy = WORLD_H / 2;
  const angle = -0.17;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const hubs: Vec[] = [
    { x: 700, y: 470 },
    { x: 1070, y: 610 },
    { x: 420, y: 700 },
  ];
  const hubStrength = [1, 0.8, 0.45];
  const commerceAt = (p: Vec) => {
    let best = 0;
    hubs.forEach((h, i) => {
      const d = dist(p, h);
      best = Math.max(best, hubStrength[i] * Math.exp(-(d * d) / (2 * 150 * 150)));
    });
    return best;
  };

  const id = (i: number, j: number) => j * (NX + 1) + i;
  const nodes: Vec[] = [];
  for (let j = 0; j <= NY; j++) {
    for (let i = 0; i <= NX; i++) {
      const wx = (i - NX / 2) * S + (rand() - 0.5) * 6;
      const wy = (j - NY / 2) * S + (rand() - 0.5) * 6;
      nodes.push({ x: cx + wx * cos - wy * sin, y: cy + wx * sin + wy * cos });
    }
  }

  const AV_ROW = 11;
  const AV_COL = 15;
  const DIAG = 4; // nodes where i - j === DIAG form the diagonal avenue
  const edges: Edge[] = [];
  const addEdge = (a: number, b: number, avenue: boolean) => {
    const pa = nodes[a];
    const pb = nodes[b];
    const mid = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
    edges.push({ a, b, length: dist(pa, pb), avenue, commerce: commerceAt(mid) });
  };
  for (let j = 0; j <= NY; j++) {
    for (let i = 0; i <= NX; i++) {
      if (i < NX) {
        const avenue = j === AV_ROW;
        if (avenue || rand() > 0.09) addEdge(id(i, j), id(i + 1, j), avenue);
      }
      if (j < NY) {
        const avenue = i === AV_COL;
        if (avenue || rand() > 0.09) addEdge(id(i, j), id(i, j + 1), avenue);
      }
      if (i < NX && j < NY && i - j === DIAG) addEdge(id(i, j), id(i + 1, j + 1), true);
    }
  }

  const adjacency: number[][] = nodes.map(() => []);
  edges.forEach((e, k) => {
    adjacency[e.a].push(k);
    adjacency[e.b].push(k);
  });

  const zoneSeeds: Vec[] = [];
  for (let k = 0; k < 11; k++) {
    zoneSeeds.push({ x: 140 + rand() * (WORLD_W - 280), y: 110 + rand() * (WORLD_H - 220) });
  }
  zoneSeeds.push({ x: 720, y: 480 }, { x: 1060, y: 610 });

  const cells: Cell[] = [];
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const quad = [nodes[id(i, j)], nodes[id(i + 1, j)], nodes[id(i + 1, j + 1)], nodes[id(i, j + 1)]];
      const center = bilinear(quad, 0.5, 0.5);
      const onDiagonal = i - j === DIAG;
      const inset = (u: number, v: number) => bilinear(quad, u, v);
      const m = 0.09;
      const dCenter = dist(center, { x: 760, y: 520 });
      const commerce = commerceAt(center);
      const park = !onDiagonal && commerce < 0.25 && rand() < 0.05;
      const pop = Math.min(
        1,
        (0.25 + 0.75 * Math.exp(-(dCenter * dCenter) / (2 * 420 * 420))) * (0.55 + rand() * 0.45) + commerce * 0.15,
      );
      const lots: Lot[] = [];
      if (!park) {
        const splitsU = 1 + Math.floor(rand() * 3);
        const splitsV = 1 + Math.floor(rand() * 2);
        for (let a = 0; a < splitsU; a++) {
          for (let b = 0; b < splitsV; b++) {
            if (onDiagonal && Math.abs((a + 0.5) / splitsU - (b + 0.5) / splitsV) < 0.3) continue;
            const u0 = lerp(m, 1 - m, a / splitsU) + 0.015;
            const u1 = lerp(m, 1 - m, (a + 1) / splitsU) - 0.015;
            const v0 = lerp(m, 1 - m, b / splitsV) + 0.015;
            const v1 = lerp(m, 1 - m, (b + 1) / splitsV) - 0.015;
            lots.push([inset(u0, v0), inset(u1, v0), inset(u1, v1), inset(u0, v1)]);
          }
        }
      }
      let zone = 0;
      let zoneD = Infinity;
      zoneSeeds.forEach((z, k) => {
        const d = dist(center, z) + rand() * 26;
        if (d < zoneD) {
          zoneD = d;
          zone = k;
        }
      });
      const income = Math.min(1, Math.max(0, 0.25 + ((center.x - center.y) / 1600) * 0.6 + (rand() - 0.5) * 0.35));
      cells.push({
        quad,
        poly: [inset(m, m), inset(1 - m, m), inset(1 - m, 1 - m), inset(m, 1 - m)],
        center,
        pop,
        park,
        lots,
        income,
        zone,
      });
    }
  }

  const shops: Shop[] = [];
  edges.forEach((e) => {
    if (e.commerce < 0.12) return;
    const count = Math.round(e.commerce * 5 * (0.5 + rand()));
    const pa = nodes[e.a];
    const pb = nodes[e.b];
    const nx = -(pb.y - pa.y) / e.length;
    const ny = (pb.x - pa.x) / e.length;
    for (let k = 0; k < count; k++) {
      const t = 0.15 + rand() * 0.7;
      const side = rand() < 0.5 ? -1 : 1;
      shops.push({
        p: { x: lerp(pa.x, pb.x, t) + nx * 9 * side, y: lerp(pa.y, pb.y, t) + ny * 9 * side },
        weight: e.commerce * (0.5 + rand()),
      });
    }
  });
  const shopCdf: number[] = [];
  let acc = 0;
  shops.forEach((s) => {
    acc += s.weight;
    shopCdf.push(acc);
  });

  const row: Vec[] = [];
  for (let i = 0; i <= NX; i++) row.push(nodes[id(i, AV_ROW)]);
  const col: Vec[] = [];
  for (let j = 0; j <= NY; j++) col.push(nodes[id(AV_COL, j)]);
  const diag: Vec[] = [];
  for (let j = 0; j <= NY; j++) {
    const i = j + DIAG;
    if (i <= NX) diag.push(nodes[id(i, j)]);
  }
  const ring: Vec[] = [];
  for (let k = 0; k < 72; k++) {
    const t = (k / 72) * Math.PI * 2;
    const r = 430 + Math.sin(t * 3) * 18;
    ring.push({ x: 780 + Math.cos(t) * r * 1.25, y: 520 + Math.sin(t) * r * 0.82 });
  }

  const zones: Zone[] = zoneSeeds.map(() => ({ centroid: { x: 0, y: 0 }, spend: 0, cells: [] }));
  cells.forEach((c, k) => zones[c.zone].cells.push(k));
  zones.forEach((z) => {
    if (!z.cells.length) return;
    let x = 0;
    let y = 0;
    let commerce = 0;
    z.cells.forEach((k) => {
      x += cells[k].center.x;
      y += cells[k].center.y;
      commerce += commerceAt(cells[k].center);
    });
    z.centroid = { x: x / z.cells.length, y: y / z.cells.length };
    z.spend = Math.min(1, 0.12 + (commerce / z.cells.length) * 1.5);
  });
  const cellAt = (i: number, j: number) => cells[j * NX + i];
  const zoneBorders: [Vec, Vec][] = [];
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const c = cellAt(i, j);
      if (i + 1 < NX && cellAt(i + 1, j).zone !== c.zone) zoneBorders.push([nodes[id(i + 1, j)], nodes[id(i + 1, j + 1)]]);
      if (j + 1 < NY && cellAt(i, j + 1).zone !== c.zone) zoneBorders.push([nodes[id(i, j + 1)], nodes[id(i + 1, j + 1)]]);
    }
  }

  return {
    width: WORLD_W,
    height: WORLD_H,
    nodes,
    edges,
    adjacency,
    cells,
    shops,
    shopCdf,
    paths: [buildPath(row, false), buildPath(col, false), buildPath(diag, false), buildPath(ring, true)],
    hubs,
    zones,
    zoneBorders,
  };
}

export function pickShop(model: CityModel, r: number): Shop {
  const total = model.shopCdf[model.shopCdf.length - 1];
  const target = r * total;
  let lo = 0;
  let hi = model.shopCdf.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (model.shopCdf[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return model.shops[lo];
}

export function nearestNode(model: CityModel, p: Vec): number {
  let best = 0;
  let bestD = Infinity;
  model.nodes.forEach((n, i) => {
    const d = (n.x - p.x) ** 2 + (n.y - p.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

export type Isochrone = {
  /** Street pieces reachable within the budget, as [from, to] points. */
  segments: [Vec, Vec][];
  polygon: Vec[];
};

/** Walking isochrone over the street graph (Dijkstra), 10 minutes ≈ 800 m. */
export function isochrone(model: CityModel, origin: Vec, budget = UNITS_PER_100M * 8): Isochrone {
  const start = nearestNode(model, origin);
  const startCost = dist(origin, model.nodes[start]);
  const n = model.nodes.length;
  const cost = new Float64Array(n).fill(Infinity);
  const done = new Uint8Array(n);
  cost[start] = startCost;
  // The graph is small (~700 nodes): a linear-scan Dijkstra is fast enough.
  for (;;) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!done[i] && cost[i] < best) {
        best = cost[i];
        u = i;
      }
    }
    if (u === -1 || best > budget) break;
    done[u] = 1;
    for (const k of model.adjacency[u]) {
      const e = model.edges[k];
      const v = e.a === u ? e.b : e.a;
      const c = best + e.length;
      if (c < cost[v]) cost[v] = c;
    }
  }

  const segments: [Vec, Vec][] = [];
  const reach: Vec[] = [];
  model.edges.forEach((e) => {
    const ca = cost[e.a];
    const cb = cost[e.b];
    const pa = model.nodes[e.a];
    const pb = model.nodes[e.b];
    if (ca <= budget && cb <= budget) {
      segments.push([pa, pb]);
      reach.push(pa, pb);
      return;
    }
    const partial = (from: Vec, to: Vec, c: number) => {
      const t = Math.min(1, (budget - c) / e.length);
      if (t <= 0) return;
      const end = { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
      segments.push([from, end]);
      reach.push(from, end);
    };
    if (ca <= budget) partial(pa, pb, ca);
    if (cb <= budget) partial(pb, pa, cb);
  });

  const SECTORS = 48;
  const radii = new Array<number>(SECTORS).fill(0);
  reach.forEach((p) => {
    const a = Math.atan2(p.y - origin.y, p.x - origin.x);
    const k = Math.floor(((a + Math.PI) / (Math.PI * 2)) * SECTORS) % SECTORS;
    radii[k] = Math.max(radii[k], dist(p, origin));
  });
  const filled = radii.map((r, k) => {
    if (r > 0) return r;
    const prev = radii[(k + SECTORS - 1) % SECTORS];
    const next = radii[(k + 1) % SECTORS];
    return Math.max(24, (prev + next) / 2);
  });
  const smooth = filled.map((r, k) => {
    const a = filled[(k + SECTORS - 1) % SECTORS];
    const b = filled[(k + 1) % SECTORS];
    return (a + 2 * r + b) / 4 + 10;
  });
  const polygon = smooth.map((r, k) => {
    const a = ((k + 0.5) / SECTORS) * Math.PI * 2 - Math.PI;
    return { x: origin.x + Math.cos(a) * r, y: origin.y + Math.sin(a) * r };
  });
  return { segments, polygon };
}

export type ZoneStats = {
  residentes: number;
  rentaHogar: number;
  visitasMes: number;
  minutosVisita: number;
  foraneos: number;
};

/** Example figures for the area around a point. Illustrative, not real data. */
export function zoneStats(model: CityModel, origin: Vec, radius = UNITS_PER_100M * 7): ZoneStats {
  const r2 = radius * radius;
  const within = (p: Vec) => (p.x - origin.x) ** 2 + (p.y - origin.y) ** 2 <= r2;
  let pop = 0;
  let income = 0;
  let n = 0;
  model.cells.forEach((c) => {
    if (!within(c.center)) return;
    pop += c.pop * 1150;
    income += c.income;
    n++;
  });
  let visits = 0;
  let commerce = 0;
  let edges = 0;
  model.edges.forEach((e) => {
    const a = model.nodes[e.a];
    const b = model.nodes[e.b];
    if (!within({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })) return;
    visits += 900 + e.commerce * 21000;
    commerce += e.commerce;
    edges++;
  });
  const c = edges ? commerce / edges : 0;
  const round = (v: number, step: number) => Math.round(v / step) * step;
  return {
    residentes: round(pop, 50),
    rentaHogar: round(24000 + (n ? income / n : 0.4) * 24000, 100),
    visitasMes: round(visits, 1000),
    minutosVisita: Math.round(24 + c * 48),
    foraneos: Math.round(12 + c * 46),
  };
}
