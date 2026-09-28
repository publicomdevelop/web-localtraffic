import {
  type CityModel,
  type Isochrone,
  type Vec,
  mulberry32,
  pointOnPath,
} from "./model";

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

const BASE_SCALE = 1.6;

/**
 * Canvas renderer for the illustrated city. Framework-free: the React wrapper
 * only feeds it targets (layers, camera, isochrone) and it eases towards them.
 */
export class CityRenderer {
  private ctx: CanvasRenderingContext2D;
  private base: HTMLCanvasElement;
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
  iso: Isochrone | null = null;
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
    this.base = this.renderBase();
    this.seedWalkers(options.walkers);
    this.seedCars();
  }

  // --- setup -------------------------------------------------------------

  private renderBase(): HTMLCanvasElement {
    const { model } = this;
    const c = document.createElement("canvas");
    c.width = Math.round(model.width * BASE_SCALE);
    c.height = Math.round(model.height * BASE_SCALE);
    const g = c.getContext("2d");
    if (!g) return c;
    g.scale(BASE_SCALE, BASE_SCALE);
    g.fillStyle = NIGHT;
    g.fillRect(0, 0, model.width, model.height);

    const poly = (pts: Vec[]) => {
      g.beginPath();
      pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.closePath();
    };

    // Blocks: lots with slightly varied lightness read as buildings.
    model.cells.forEach((cell, ci) => {
      if (cell.park) {
        poly(cell.poly);
        g.fillStyle = `rgba(${SIGNAL}, 0.035)`;
        g.fill();
        const r = mulberry32(ci + 11);
        g.fillStyle = `rgba(${SIGNAL}, 0.16)`;
        for (let k = 0; k < 26; k++) {
          const u = 0.15 + r() * 0.7;
          const v = 0.15 + r() * 0.7;
          const q = cell.poly;
          const x = q[0].x + (q[1].x - q[0].x) * u + (q[3].x - q[0].x) * v;
          const y = q[0].y + (q[1].y - q[0].y) * u + (q[3].y - q[0].y) * v;
          g.beginPath();
          g.arc(x, y, 1.2 + r() * 1.4, 0, Math.PI * 2);
          g.fill();
        }
        return;
      }
      cell.lots.forEach((lot, li) => {
        poly(lot);
        const shade = 0.04 + ((ci * 7 + li * 3) % 3) * 0.005;
        g.fillStyle = `rgba(${INK}, ${shade})`;
        g.fill();
      });
    });

    // Streets.
    g.lineCap = "round";
    model.edges.forEach((e) => {
      const a = model.nodes[e.a];
      const b = model.nodes[e.b];
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokeStyle = e.avenue ? `rgba(${INK}, 0.16)` : `rgba(${INK}, 0.075)`;
      g.lineWidth = e.avenue ? 3.2 : 1.2;
      g.stroke();
    });

    // Ring road with a casing so it cuts through blocks.
    const ring = model.paths[3];
    const ringLine = () => {
      g.beginPath();
      ring.points.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
    };
    ringLine();
    g.strokeStyle = NIGHT;
    g.lineWidth = 9;
    g.stroke();
    ringLine();
    g.strokeStyle = `rgba(${INK}, 0.14)`;
    g.lineWidth = 3;
    g.stroke();

    // Shop fronts: tiny ticks along commercial streets.
    g.fillStyle = `rgba(${INK}, 0.22)`;
    model.shops.forEach((s) => g.fillRect(s.p.x - 1, s.p.y - 1, 2, 2));
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
      const n = Math.round(path.length / 20);
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
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      model.cells.forEach((cell) => {
        ctx.beginPath();
        cell.poly.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.closePath();
        ctx.fillStyle = `rgba(${BLUE}, ${(0.03 + Math.pow(cell.pop, 2.4) * 0.85) * L.publico})`;
        ctx.fill();
      });
    }

    if (L.consumo > 0.01) this.drawSpendZones(L.consumo);

    if (this.iso) this.drawIsochrone(this.iso, s);

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
  private drawSpendZones(alpha: number) {
    const { ctx, model } = this;
    model.cells.forEach((cell) => {
      const z = model.zones[cell.zone];
      ctx.beginPath();
      cell.quad.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fillStyle = `rgba(${SPEND}, ${(0.02 + z.spend * z.spend * 0.26) * alpha})`;
      ctx.fill();
    });
    ctx.beginPath();
    for (const [a, b] of model.zoneBorders) {
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = `rgba(${SPEND}, ${0.5 * alpha})`;
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Where the spenders come from: flows from each postal area to the main hub.
    const hub = model.hubs[0];
    ctx.lineCap = "round";
    ctx.setLineDash([7, 11]);
    ctx.lineDashOffset = this.reducedMotion ? 0 : -this.time * 26;
    model.zones.forEach((z) => {
      if (!z.cells.length) return;
      const dx = hub.x - z.centroid.x;
      const dy = hub.y - z.centroid.y;
      const d = Math.hypot(dx, dy);
      if (d < 90) return;
      const cx = (z.centroid.x + hub.x) / 2 - dy * 0.22;
      const cy = (z.centroid.y + hub.y) / 2 + dx * 0.22;
      ctx.beginPath();
      ctx.moveTo(z.centroid.x, z.centroid.y);
      ctx.quadraticCurveTo(cx, cy, hub.x, hub.y);
      ctx.strokeStyle = `rgba(255, 170, 130, ${(0.25 + z.spend * 0.6) * alpha})`;
      ctx.lineWidth = 1 + z.spend * 3;
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    model.zones.forEach((z) => {
      if (!z.cells.length) return;
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

  private drawIsochrone(iso: Isochrone, s: number) {
    const { ctx } = this;
    const pts = iso.polygon;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      const mx = (p.x + q.x) / 2;
      const my = (p.y + q.y) / 2;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.quadraticCurveTo(p.x, p.y, mx, my);
    }
    const p0 = pts[0];
    const p1 = pts[1];
    ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
    ctx.closePath();
    ctx.fillStyle = `rgba(${BLUE}, 0.14)`;
    ctx.fill();
    ctx.setLineDash([6 / s, 5 / s]);
    ctx.strokeStyle = `rgba(${SIGNAL}, 0.8)`;
    ctx.lineWidth = 1.4 / s;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(${SIGNAL}, 0.55)`;
    ctx.lineWidth = 2.4 / Math.sqrt(s);
    ctx.beginPath();
    for (const [a, b] of iso.segments) {
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
  }
}
