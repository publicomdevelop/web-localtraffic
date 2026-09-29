import { type CityModel, type Vec, ISO_RX, ISO_RY, mulberry32, pointOnPath } from "./model";

export type LayerKey = "consumo" | "movilidad" | "trafico" | "publico";
export type Layers = Record<LayerKey, number>;
export type Camera = { x: number; y: number; zoom: number };

const INK = "236, 237, 247";
const BLUE = "51, 64, 245";
const SIGNAL = "138, 146, 255";
const SPEND = "255, 107, 61";
const NIGHT = "#0E0B1C";

type Walker = { edge: number; from: number; t: number; speed: number };
type Car = { path: number; s: number; speed: number; lane: 1 | -1 };

/** Resolution of the pre-rendered city layers: lower on small screens to save memory. */
const baseScale = () => (typeof window !== "undefined" && window.innerWidth < 800 ? 1 : 1.6);

type StaticLayers = { base: HTMLCanvasElement; publicTint: HTMLCanvasElement; spendTint: HTMLCanvasElement };
/** The static layers never change, so the hero and the story map share them. */
const layerCache = new Map<number, StaticLayers>();

/**
 * Canvas renderer for the illustrated city. Framework-free: the React wrapper
 * only feeds it targets (layers, camera, isochrone) and it eases towards them.
 */
export class CityRenderer {
  private ctx: CanvasRenderingContext2D;
  private base!: HTMLCanvasElement;
  private publicTint!: HTMLCanvasElement;
  private spendTint!: HTMLCanvasElement;
  private scaleFactor = 1.6;
  private time = 0;
  private rand = mulberry32(7);
  private walkers: Walker[] = [];
  private cars: Car[] = [];
  private raf = 0;
  private last = 0;
  private running = false;
  private visible = true;
  private w = 0;
  private h = 0;
  private dpr = 1;

  layers: Layers = { consumo: 0, movilidad: 0, trafico: 0, publico: 0 };
  targetLayers: Layers = { consumo: 0, movilidad: 0, trafico: 0, publico: 0 };
  camera: Camera;
  targetCamera: Camera;
  /** Circular area of influence around the pin, in world units. */
  catchment: { center: Vec; radius: number } | null = null;
  reducedMotion = false;
  onFrame: (() => void) | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private model: CityModel,
    options: { walkers: number; camera: Camera; layers: Layers },
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not available");
    this.ctx = ctx;
    this.camera = { ...options.camera };
    this.targetCamera = { ...options.camera };
    this.layers = { ...options.layers };
    this.targetLayers = { ...options.layers };
    this.scaleFactor = baseScale();
    let layers = layerCache.get(this.scaleFactor);
    if (!layers) {
      layers = { base: this.renderBase(), publicTint: this.renderTint("publico"), spendTint: this.renderTint("consumo") };
      layerCache.set(this.scaleFactor, layers);
    }
    this.base = layers.base;
    this.publicTint = layers.publicTint;
    this.spendTint = layers.spendTint;
    this.seedWalkers(options.walkers);
    this.seedCars();
  }

  // --- setup -------------------------------------------------------------

  private makeLayer(): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
    const { model } = this;
    const c = document.createElement("canvas");
    c.width = Math.round(model.width * this.scaleFactor);
    c.height = Math.round(model.height * this.scaleFactor);
    const g = c.getContext("2d");
    g?.scale(this.scaleFactor, this.scaleFactor);
    return [c, g];
  }

  /** Every lot, back to front, so nearer buildings overlap the ones behind. */
  private sortedLots() {
    const out: { pts: Vec[]; h: number; cell: number }[] = [];
    this.model.cells.forEach((cell, ci) => {
      cell.lots.forEach((pts, li) => out.push({ pts, h: cell.heights[li], cell: ci }));
    });
    out.sort((a, b) => a.pts[2].y - b.pts[2].y);
    return out;
  }

  private renderBase(): HTMLCanvasElement {
    const { model } = this;
    const [c, g] = this.makeLayer();
    if (!g) return c;
    g.fillStyle = NIGHT;
    g.fillRect(0, 0, model.width, model.height);

    const poly = (pts: Vec[]) => {
      g.beginPath();
      pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.closePath();
    };
    const up = (p: Vec, h: number) => ({ x: p.x, y: p.y - h });

    // Parks sit on the ground, dotted with trees.
    model.cells.forEach((cell, ci) => {
      if (!cell.park) return;
      poly(cell.poly);
      g.fillStyle = `rgba(${SIGNAL}, 0.04)`;
      g.fill();
      const r = mulberry32(ci + 11);
      g.fillStyle = `rgba(${SIGNAL}, 0.18)`;
      const q = cell.poly;
      for (let k = 0; k < 22; k++) {
        const u = 0.15 + r() * 0.7;
        const v = 0.15 + r() * 0.7;
        const x = q[0].x + (q[1].x - q[0].x) * u + (q[3].x - q[0].x) * v;
        const y = q[0].y + (q[1].y - q[0].y) * u + (q[3].y - q[0].y) * v;
        g.beginPath();
        g.ellipse(x, y - 2, 2.2, 1.6, 0, 0, Math.PI * 2);
        g.fill();
      }
    });

    // Streets on the ground.
    g.lineCap = "round";
    model.edges.forEach((e) => {
      const a = model.nodes[e.a];
      const b = model.nodes[e.b];
      if (Math.max(a.x, b.x) < -40 || Math.min(a.x, b.x) > model.width + 40) return;
      if (Math.max(a.y, b.y) < -40 || Math.min(a.y, b.y) > model.height + 40) return;
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokeStyle = e.avenue ? `rgba(${INK}, 0.18)` : `rgba(${INK}, 0.08)`;
      g.lineWidth = e.avenue ? 3.4 : 1.2;
      g.stroke();
    });

    // Buildings: isometric boxes. Top face lit, the two visible sides in shade.
    for (const { pts, h } of this.sortedLots()) {
      const [p0, p1, p2, p3] = pts;
      poly([p1, p2, up(p2, h), up(p1, h)]);
      g.fillStyle = "#1a1630";
      g.fill();
      poly([p2, p3, up(p3, h), up(p2, h)]);
      g.fillStyle = "#141026";
      g.fill();
      poly([up(p0, h), up(p1, h), up(p2, h), up(p3, h)]);
      g.fillStyle = "#231e3b";
      g.fill();
      g.strokeStyle = `rgba(${INK}, 0.07)`;
      g.lineWidth = 0.6;
      g.stroke();
    }
    return c;
  }

  /** Static tint of building roofs (residents) or of postal-code areas (spend). */
  private renderTint(kind: "publico" | "consumo"): HTMLCanvasElement {
    const { model } = this;
    const [c, g] = this.makeLayer();
    if (!g) return c;
    const poly = (pts: Vec[]) => {
      g.beginPath();
      pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.closePath();
    };
    if (kind === "consumo") {
      // Ground first, then the zone borders along the streets.
      model.cells.forEach((cell) => {
        const z = model.zones[cell.zone];
        poly(cell.quad);
        g.fillStyle = `rgba(${SPEND}, ${0.02 + z.spend * z.spend * 0.22})`;
        g.fill();
      });
      g.beginPath();
      for (const [a, b] of model.zoneBorders) {
        g.moveTo(a.x, a.y);
        g.lineTo(b.x, b.y);
      }
      g.setLineDash([5, 5]);
      g.strokeStyle = `rgba(${SPEND}, 0.55)`;
      g.lineWidth = 1.3;
      g.stroke();
      g.setLineDash([]);
    }
    for (const { pts, h, cell } of this.sortedLots()) {
      const roof = pts.map((p) => ({ x: p.x, y: p.y - h }));
      poly(roof);
      const c0 = model.cells[cell];
      g.fillStyle =
        kind === "publico"
          ? `rgba(${BLUE}, ${0.06 + Math.pow(c0.pop, 2.2) * 0.85})`
          : `rgba(${SPEND}, ${0.03 + Math.pow(model.zones[c0.zone].spend, 2) * 0.5})`;
      g.fill();
    }
    return c;
  }

  private seedWalkers(count: number) {
    const { model } = this;
    // Bias spawn towards commercial streets, like real footfall.
    const weights = model.edges.map((e) => 0.08 + e.commerce * e.commerce);
    const total = weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < count; i++) {
      let r = this.rand() * total;
      let k = 0;
      while (k < weights.length - 1 && r > weights[k]) {
        r -= weights[k];
        k++;
      }
      const e = model.edges[k];
      this.walkers.push({
        edge: k,
        from: this.rand() < 0.5 ? e.a : e.b,
        t: this.rand(),
        speed: 14 + this.rand() * 18,
      });
    }
  }

  private seedCars() {
    this.model.paths.forEach((path, pi) => {
      const n = Math.round(path.length / 30);
      for (let i = 0; i < n; i++) {
        this.cars.push({
          path: pi,
          s: this.rand() * path.length,
          speed: 55 + this.rand() * 45,
          lane: this.rand() < 0.5 ? 1 : -1,
        });
      }
    });
  }

  // --- lifecycle ---------------------------------------------------------

  resize(w: number, h: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 800 ? 1.5 : 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.draw();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (this.visible) {
        this.step(dt);
        this.draw();
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  setVisible(v: boolean) {
    this.visible = v;
  }

  /** Redraw once, used when motion is reduced and something changed. */
  refresh() {
    this.layers = { ...this.targetLayers };
    this.camera = { ...this.targetCamera };
    this.draw();
  }

  // --- camera ------------------------------------------------------------

  private scale(cam: Camera = this.camera) {
    const fit = Math.max(this.w / this.model.width, this.h / this.model.height);
    return fit * cam.zoom;
  }

  worldToScreen(p: Vec): Vec {
    const s = this.scale();
    return { x: (p.x - this.camera.x) * s + this.w / 2, y: (p.y - this.camera.y) * s + this.h / 2 };
  }

  screenToWorld(p: Vec): Vec {
    const s = this.scale();
    return { x: (p.x - this.w / 2) / s + this.camera.x, y: (p.y - this.h / 2) / s + this.camera.y };
  }

  // --- simulation --------------------------------------------------------

  private step(dt: number) {
    this.time += dt;
    const k = 1 - Math.exp(-dt * 3.2);
    (Object.keys(this.layers) as LayerKey[]).forEach((key) => {
      this.layers[key] += (this.targetLayers[key] - this.layers[key]) * k;
    });
    const kc = 1 - Math.exp(-dt * 2.2);
    this.camera.x += (this.targetCamera.x - this.camera.x) * kc;
    this.camera.y += (this.targetCamera.y - this.camera.y) * kc;
    this.camera.zoom += (this.targetCamera.zoom - this.camera.zoom) * kc;

    const { model } = this;
    for (const w of this.walkers) {
      const e = model.edges[w.edge];
      w.t += (w.speed * dt) / e.length;
      if (w.t >= 1) {
        const at = w.from === e.a ? e.b : e.a;
        const options = model.adjacency[at].filter((x) => x !== w.edge);
        const pool = options.length ? options : model.adjacency[at];
        let total = 0;
        const ws = pool.map((x) => {
          const v = 0.12 + model.edges[x].commerce;
          total += v;
          return v;
        });
        let r = this.rand() * total;
        let pick = pool[0];
        for (let i = 0; i < pool.length; i++) {
          r -= ws[i];
          if (r <= 0) {
            pick = pool[i];
            break;
          }
        }
        w.edge = pick;
        w.from = at;
        w.t = 0;
      }
    }

    for (const c of this.cars) c.s += c.speed * c.lane * dt;

  }

  // --- drawing -----------------------------------------------------------

  draw() {
    const { ctx, model } = this;
    if (!this.w || !this.h) return;
    const s = this.scale();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = NIGHT;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.save();
    ctx.translate(this.w / 2, this.h / 2);
    ctx.scale(s, s);
    ctx.translate(-this.camera.x, -this.camera.y);
    ctx.drawImage(this.base, 0, 0, model.width, model.height);

    const L = this.layers;

    if (L.publico > 0.01) {
      ctx.globalAlpha = L.publico;
      ctx.drawImage(this.publicTint, 0, 0, model.width, model.height);
      ctx.globalAlpha = 1;
    }

    if (L.consumo > 0.01) this.drawSpendZones(L.consumo);

    if (this.catchment) this.drawCatchment(this.catchment.center, this.catchment.radius, s);

    if (L.trafico > 0.01) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const path of model.paths) {
        ctx.beginPath();
        path.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.strokeStyle = `rgba(${INK}, ${0.07 * L.trafico})`;
        ctx.lineWidth = 12;
        ctx.stroke();
      }
      for (const c of this.cars) {
        const path = model.paths[c.path];
        const { p, dir } = pointOnPath(path, c.s);
        const nx = -dir.y * 3.2 * c.lane;
        const ny = dir.x * 3.2 * c.lane;
        const len = 16 * c.lane;
        const tone = c.lane === 1 ? INK : "255, 120, 140";
        ctx.beginPath();
        ctx.moveTo(p.x + nx, p.y + ny);
        ctx.lineTo(p.x + nx - dir.x * len, p.y + ny - dir.y * len);
        ctx.strokeStyle = `rgba(${tone}, ${0.18 * L.trafico})`;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${tone}, ${(c.lane === 1 ? 0.95 : 0.7) * L.trafico})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    if (L.movilidad > 0.01) {
      const r = Math.max(1.7, 2.4 / Math.sqrt(s));
      const glow = `rgba(${SIGNAL}, ${0.16 * L.movilidad})`;
      const core = `rgba(${SIGNAL}, ${0.95 * L.movilidad})`;
      for (const w of this.walkers) {
        const e = model.edges[w.edge];
        const a = model.nodes[w.from];
        const b = model.nodes[w.from === e.a ? e.b : e.a];
        const x = a.x + (b.x - a.x) * w.t;
        const y = a.y + (b.y - a.y) * w.t;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // Soft vignette keeps the edges quiet behind overlaid UI.
    const vg = ctx.createRadialGradient(
      this.w / 2,
      this.h / 2,
      Math.min(this.w, this.h) * 0.35,
      this.w / 2,
      this.h / 2,
      Math.max(this.w, this.h) * 0.75,
    );
    vg.addColorStop(0, "rgba(14, 11, 28, 0)");
    vg.addColorStop(1, "rgba(14, 11, 28, 0.85)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, this.w, this.h);

    this.onFrame?.();
  }

  /** Card spending is known per postal code, so it is drawn as areas, not streets. */
  private destCache: { key: string; zone: number } | null = null;

  /** Postal area under a point (nearest block), cached while the point doesn't move. */
  private zoneAt(p: Vec) {
    const key = `${Math.round(p.x)},${Math.round(p.y)}`;
    if (this.destCache?.key === key) return this.destCache.zone;
    let best = 0;
    let bestD = Infinity;
    this.model.cells.forEach((c) => {
      const d = (c.center.x - p.x) ** 2 + (c.center.y - p.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = c.zone;
      }
    });
    this.destCache = { key, zone: best };
    return best;
  }

  private drawSpendZones(alpha: number) {
    const { ctx, model } = this;
    ctx.globalAlpha = alpha;
    ctx.drawImage(this.spendTint, 0, 0, model.width, model.height);
    ctx.globalAlpha = 1;

    // Spending flows into the pin when there is one (hero), otherwise into the
    // main shopping hub. The destination postcode is highlighted.
    const hub = this.catchment?.center ?? model.hubs[0];
    const destZone = this.zoneAt(hub);
    const dest = model.zones[destZone];
    dest.cells.forEach((k) => {
      const q = model.cells[k].quad;
      ctx.beginPath();
      q.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 150, 110, ${0.42 * alpha})`;
      ctx.fill();
    });

    ctx.lineCap = "round";
    ctx.setLineDash([7, 11]);
    ctx.lineDashOffset = this.reducedMotion ? 0 : -this.time * 26;
    model.zones.forEach((z, zi) => {
      if (!z.cells.length || zi === destZone) return;
      const dx = hub.x - z.centroid.x;
      const dy = hub.y - z.centroid.y;
      const d = Math.hypot(dx, dy);
      if (d < 60 || d > 900) return;
      const cx = (z.centroid.x + hub.x) / 2 - dy * 0.22;
      const cy = (z.centroid.y + hub.y) / 2 + dx * 0.22;
      // Nearer and higher-spending areas send more.
      const weight = z.spend * (1 - d / 1100);
      ctx.beginPath();
      ctx.moveTo(z.centroid.x, z.centroid.y);
      ctx.quadraticCurveTo(cx, cy, hub.x, hub.y);
      ctx.strokeStyle = `rgba(255, 180, 140, ${(0.5 + weight * 0.5) * alpha})`;
      ctx.lineWidth = 1.6 + weight * 4;
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    model.zones.forEach((z, zi) => {
      if (!z.cells.length || zi === destZone) return;
      ctx.beginPath();
      ctx.arc(z.centroid.x, z.centroid.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${SPEND}, ${0.9 * alpha})`;
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(hub.x, hub.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 190, 160, ${alpha})`;
    ctx.fill();
  }

  /** The pin's area of influence: a circle on the ground, so an ellipse on screen. */
  private drawCatchment(c: Vec, r: number, s: number) {
    const { ctx, model } = this;
    const rx = r * ISO_RX;
    const ry = r * ISO_RY;
    const shape = () => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI * 2);
    };
    shape();
    ctx.fillStyle = `rgba(${BLUE}, 0.14)`;
    ctx.fill();

    ctx.save();
    shape();
    ctx.clip();
    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(${SIGNAL}, 0.55)`;
    ctx.lineWidth = 2.2 / Math.sqrt(s);
    ctx.beginPath();
    for (const e of model.edges) {
      const a = model.nodes[e.a];
      const b = model.nodes[e.b];
      if (Math.abs(a.x - c.x) > rx + 80 || Math.abs(a.y - c.y) > ry + 80) continue;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
    ctx.restore();

    shape();
    ctx.setLineDash([6 / s, 5 / s]);
    ctx.strokeStyle = `rgba(${SIGNAL}, 0.9)`;
    ctx.lineWidth = 1.6 / s;
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
