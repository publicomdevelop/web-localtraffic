import {
  type CityModel,
  type Isochrone,
  type Vec,
  mulberry32,
  pickShop,
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
type Flash = { p: Vec; age: number; life: number; size: number };

const BASE_SCALE = 1.6;

/**
 * Canvas renderer for the illustrated city. Framework-free: the React wrapper
 * only feeds it targets (layers, camera, isochrone) and it eases towards them.
 */
export class CityRenderer {
  private ctx: CanvasRenderingContext2D;
  private base: HTMLCanvasElement;
  private heat: HTMLCanvasElement;
  private rand = mulberry32(7);
  private walkers: Walker[] = [];
  private cars: Car[] = [];
  private flashes: Flash[] = [];
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
    this.heat = this.renderHeat();
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
        const shade = 0.035 + ((ci * 7 + li * 3) % 5) * 0.008;
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

  private renderHeat(): HTMLCanvasElement {
    const { model } = this;
    const scale = 0.5;
    const c = document.createElement("canvas");
    c.width = Math.round(model.width * scale);
    c.height = Math.round(model.height * scale);
    const g = c.getContext("2d");
    if (!g) return c;
    g.scale(scale, scale);
    g.globalCompositeOperation = "lighter";
    model.shops.forEach((s) => {
      const r = 34 + s.weight * 20;
      const grd = g.createRadialGradient(s.p.x, s.p.y, 0, s.p.x, s.p.y, r);
      grd.addColorStop(0, `rgba(${SPEND}, ${0.045 + s.weight * 0.075})`);
      grd.addColorStop(1, `rgba(${SPEND}, 0)`);
      g.fillStyle = grd;
      g.beginPath();
      g.arc(s.p.x, s.p.y, r, 0, Math.PI * 2);
      g.fill();
    });
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
      const n = Math.round(path.length / 38);
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

    if (this.layers.consumo > 0.05) {
      const rate = 26 * this.layers.consumo;
      let spawn = rate * dt;
      while (spawn > 0) {
        if (this.rand() < spawn) {
          const shop = pickShop(model, this.rand());
          this.flashes.push({ p: shop.p, age: 0, life: 1.1 + this.rand() * 0.6, size: 6 + shop.weight * 12 });
        }
        spawn -= 1;
      }
    }
    for (const f of this.flashes) f.age += dt;
    this.flashes = this.flashes.filter((f) => f.age < f.life);
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
        ctx.fillStyle = `rgba(${BLUE}, ${(0.08 + cell.pop * 0.5) * L.publico})`;
        ctx.fill();
      });
    }

    if (L.consumo > 0.01) {
      ctx.globalAlpha = L.consumo;
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(this.heat, 0, 0, model.width, model.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }

    if (this.iso) this.drawIsochrone(this.iso, s);

    if (L.trafico > 0.01) {
      ctx.lineCap = "round";
      for (const c of this.cars) {
        const path = model.paths[c.path];
        const { p, dir } = pointOnPath(path, c.s);
        const nx = -dir.y * 3.2 * c.lane;
        const ny = dir.x * 3.2 * c.lane;
        const len = 9 * c.lane;
        ctx.beginPath();
        ctx.moveTo(p.x + nx, p.y + ny);
        ctx.lineTo(p.x + nx - dir.x * len, p.y + ny - dir.y * len);
        ctx.strokeStyle =
          c.lane === 1 ? `rgba(${INK}, ${0.85 * L.trafico})` : `rgba(${SPEND}, ${0.45 * L.trafico})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
    }

    if (L.movilidad > 0.01) {
      ctx.fillStyle = `rgba(${SIGNAL}, ${0.9 * L.movilidad})`;
      const r = Math.max(1.1, 1.6 / Math.sqrt(s));
      for (const w of this.walkers) {
        const e = model.edges[w.edge];
        const a = model.nodes[w.from];
        const b = model.nodes[w.from === e.a ? e.b : e.a];
        const x = a.x + (b.x - a.x) * w.t;
        const y = a.y + (b.y - a.y) * w.t;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (L.consumo > 0.01) {
      for (const f of this.flashes) {
        const t = f.age / f.life;
        const alpha = (1 - t) * L.consumo;
        ctx.beginPath();
        ctx.arc(f.p.x, f.p.y, 1.5 + f.size * t, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${SPEND}, ${alpha * 0.8})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(f.p.x, f.p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 190, 160, ${alpha})`;
        ctx.fill();
      }
      if (this.reducedMotion) {
        // Static fallback: show the busiest shops as solid dots.
        ctx.fillStyle = `rgba(${SPEND}, ${0.9 * L.consumo})`;
        model.shops.forEach((shop) => {
          if (shop.weight > 0.6) {
            ctx.beginPath();
            ctx.arc(shop.p.x, shop.p.y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
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
