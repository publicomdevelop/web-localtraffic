import { MapCrop, project, VB_H, VB_W, type Crop } from "./MapCrop";
import { getCity, isochrone, mulberry32 } from "@/lib/city/model";

export type ArtKind =
  | "expansion"
  | "network"
  | "campaign"
  | "impact"
  | "influence"
  | "axis"
  | "event"
  | "pedestrian"
  | "tailored"
  | "focus";

const CROPS: Record<ArtKind, Crop> = {
  expansion: { cx: 760, cy: 500, k: 1.1 },
  network: { cx: 820, cy: 520, k: 0.62 },
  campaign: { cx: 700, cy: 470, k: 0.9 },
  impact: { cx: 1070, cy: 610, k: 1.3 },
  influence: { cx: 800, cy: 520, k: 0.55 },
  axis: { cx: 700, cy: 470, k: 1.5 },
  event: { cx: 420, cy: 700, k: 1.1 },
  pedestrian: { cx: 700, cy: 470, k: 2 },
  tailored: { cx: 1060, cy: 590, k: 0.72 },
  focus: { cx: 800, cy: 520, k: 0.7 },
};

const BLUE = "#3340F5";
const SIGNAL = "#8A92FF";
const SPEND = "#FF6B3D";
const INK = "#ECEDF7";

function Frame({ kind, children, label }: { kind: ArtKind; children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className={`art art--${kind}`} role="img" aria-label={label}>
      <rect width={VB_W} height={VB_H} fill="#0E0B1C" />
      <MapCrop crop={CROPS[kind]} />
      {children}
    </svg>
  );
}

function Expansion() {
  const spots = [
    { x: 150, y: 120, score: 47 },
    { x: 330, y: 250, score: 64 },
    { x: 250, y: 170, score: 82, best: true },
  ];
  return (
    <Frame kind="expansion" label="Tres ubicaciones candidatas comparadas; una destaca con la mejor puntuación">
      {spots.map((s) => (
        <g key={s.score} className={s.best ? "pulse-group" : undefined}>
          <circle cx={s.x} cy={s.y} r={s.best ? 62 : 44} fill={s.best ? BLUE : INK} fillOpacity={s.best ? 0.16 : 0.04} stroke={s.best ? SIGNAL : INK} strokeOpacity={s.best ? 0.9 : 0.25} strokeDasharray="4 4" />
          {s.best && <circle className="pulse" cx={s.x} cy={s.y} r="62" fill="none" stroke={SIGNAL} />}
          <circle cx={s.x} cy={s.y} r="6" fill={s.best ? BLUE : "#3a3554"} stroke={INK} strokeWidth="1.5" />
          <text x={s.x + 12} y={s.y - 10} className="art__num" fill={s.best ? INK : "rgba(236,237,247,.55)"}>
            {s.score}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function Network() {
  const r = mulberry32(3);
  const stores = Array.from({ length: 11 }, (_, i) => ({
    x: 50 + r() * 380,
    y: 40 + r() * 280,
    perf: 0.3 + r() * 0.7,
    low: i === 2 || i === 7,
  }));
  return (
    <Frame kind="network" label="Red de tiendas con dos puntos de venta por debajo del potencial de su zona">
      {stores.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={8 + s.perf * 16} fill={s.low ? SPEND : BLUE} fillOpacity={s.low ? 0.22 : 0.3} />
          <circle cx={s.x} cy={s.y} r="3.5" fill={s.low ? SPEND : SIGNAL} />
          {s.low && <circle className="pulse pulse--spend" cx={s.x} cy={s.y} r="26" fill="none" stroke={SPEND} />}
        </g>
      ))}
    </Frame>
  );
}

function Campaign() {
  const size = 28;
  const hexes: { x: number; y: number; v: number }[] = [];
  const h = Math.sqrt(3) * size;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 12; col++) {
      const x = col * size * 1.5;
      const y = row * h + (col % 2 ? h / 2 : 0);
      const d = Math.hypot(x - 250, y - 180);
      const v = Math.max(0, 1 - d / 200) * (0.6 + ((row * 7 + col * 3) % 5) / 10);
      hexes.push({ x, y, v });
    }
  }
  const hex = (x: number, y: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i;
      return `${(x + Math.cos(a) * (size - 2)).toFixed(1)},${(y + Math.sin(a) * (size - 2)).toFixed(1)}`;
    }).join(" ");
  return (
    <Frame kind="campaign" label="Zonas hexagonales coloreadas según potencial para una campaña">
      {hexes.map((c, i) => (
        <polygon
          key={i}
          points={hex(c.x, c.y)}
          className="hex"
          style={{ animationDelay: `${(c.x / 480) * 1.6}s` }}
          fill={c.v > 0.62 ? SPEND : BLUE}
          fillOpacity={c.v > 0.62 ? 0.55 : 0.05 + c.v * 0.55}
          stroke={INK}
          strokeOpacity="0.06"
        />
      ))}
    </Frame>
  );
}

function Impact() {
  const pts = [60, 62, 58, 61, 63, 60, 74, 88, 95, 92, 86, 84, 83, 85];
  const x = (i: number) => 40 + i * 30;
  const y = (v: number) => 300 - (v - 40) * 3.2;
  const d = pts.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join("");
  return (
    <Frame kind="impact" label="Gráfico de visitas antes, durante y después de una campaña">
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="#0E0B1C" fillOpacity=".55" />
      <rect x={x(6) - 10} y="40" width={x(9) - x(6) + 20} height="270" fill={BLUE} fillOpacity=".14" />
      <text x={x(6) - 4} y="58" className="art__label" fill={SIGNAL}>
        campaña
      </text>
      <line x1="40" x2="440" y1={y(61)} y2={y(61)} stroke={INK} strokeOpacity=".3" strokeDasharray="3 5" />
      <path d={d} className="draw" pathLength={1} fill="none" stroke={SPEND} strokeWidth="3" strokeLinejoin="round" />
      <text x="44" y={y(61) - 8} className="art__label" fill="rgba(236,237,247,.6)">
        periodo normal
      </text>
    </Frame>
  );
}

function Influence() {
  const r = mulberry32(9);
  const origins = Array.from({ length: 14 }, () => {
    const a = r() * Math.PI * 2;
    const d = 90 + r() * 110;
    return { x: 240 + Math.cos(a) * d * 1.3, y: 180 + Math.sin(a) * d * 0.8, w: 0.3 + r() * 0.7 };
  });
  return (
    <Frame kind="influence" label="Flujos de visitantes desde distintos barrios hacia un centro comercial">
      <ellipse cx="240" cy="180" rx="210" ry="130" fill={BLUE} fillOpacity=".06" stroke={SIGNAL} strokeOpacity=".4" strokeDasharray="4 6" />
      <ellipse cx="240" cy="180" rx="120" ry="75" fill={BLUE} fillOpacity=".1" stroke={SIGNAL} strokeOpacity=".5" strokeDasharray="4 6" />
      {origins.map((o, i) => {
        const mx = (o.x + 240) / 2 + (o.y - 180) * 0.25;
        const my = (o.y + 180) / 2 - (o.x - 240) * 0.25;
        return (
          <g key={i}>
            <path d={`M${o.x} ${o.y}Q${mx} ${my} 240 180`} fill="none" stroke={SIGNAL} strokeOpacity={0.3 + o.w * 0.5} strokeWidth={1 + o.w * 2.5} className="flow" style={{ animationDelay: `${i * 0.15}s` }} />
            <circle cx={o.x} cy={o.y} r={2 + o.w * 3} fill={SIGNAL} />
          </g>
        );
      })}
      <circle cx="240" cy="180" r="9" fill={BLUE} stroke={INK} strokeWidth="2" />
    </Frame>
  );
}

function Axis() {
  const city = getCity();
  const crop = CROPS.axis;
  const street = city.paths[0].points.map((p) => project(crop, p));
  const d = street.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
  const r = mulberry32(5);
  const bars = street.filter((p) => p.x > 20 && p.x < 460 && p.y > 20 && p.y < 340);
  return (
    <Frame kind="axis" label="Eje comercial con barras de gasto por tramo de calle">
      <path d={d} fill="none" stroke={SIGNAL} strokeWidth="5" strokeLinecap="round" strokeOpacity=".8" />
      {bars.map((p, i) => {
        const h = 30 + r() * 90;
        return (
          <rect key={i} className="bar" style={{ animationDelay: `${i * 0.08}s` }} x={p.x - 7} y={p.y - h - 8} width="14" height={h} rx="2" fill={SPEND} fillOpacity={0.55 + (h / 120) * 0.4} />
        );
      })}
    </Frame>
  );
}

function EventArt() {
  const days = [42, 45, 40, 47, 44, 118, 96, 50, 46, 43];
  return (
    <Frame kind="event" label="Visitantes por día con un pico el día del festival">
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="#0E0B1C" fillOpacity=".6" />
      {days.map((v, i) => {
        const h = v * 2.1;
        const peak = i === 5 || i === 6;
        return (
          <rect key={i} className="bar" style={{ animationDelay: `${i * 0.06}s` }} x={48 + i * 40} y={318 - h} width="26" height={h} rx="3" fill={peak ? SPEND : BLUE} fillOpacity={peak ? 0.95 : 0.55} />
        );
      })}
      <text x={48 + 5 * 40} y={318 - 118 * 2.1 - 10} className="art__label" fill={INK}>
        festival
      </text>
      <line x1="36" x2="444" y1="318" y2="318" stroke={INK} strokeOpacity=".25" />
    </Frame>
  );
}

function Pedestrian() {
  const r = mulberry32(12);
  const walkers = Array.from({ length: 36 }, () => ({ x: 250 + r() * 210, y: 150 + r() * 60 }));
  return (
    <Frame kind="pedestrian" label="Una calle antes y después de peatonalizarla: menos coches y más peatones">
      <rect x="20" y="150" width="440" height="60" fill={INK} fillOpacity=".05" />
      <line x1="240" x2="240" y1="40" y2="320" stroke={INK} strokeOpacity=".35" strokeDasharray="4 4" />
      <text x="40" y="70" className="art__label" fill="rgba(236,237,247,.7)">
        antes
      </text>
      <text x="262" y="70" className="art__label" fill={SIGNAL}>
        después
      </text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className="car" style={{ animationDelay: `${i * 0.5}s` }} x={30 + i * 34} y={i % 2 ? 188 : 164} width="18" height="8" rx="2" fill={INK} fillOpacity=".75" />
      ))}
      {walkers.map((w, i) => (
        <circle key={i} className="walker" style={{ animationDelay: `${(i % 9) * 0.3}s` }} cx={w.x} cy={w.y} r="3" fill={SIGNAL} />
      ))}
    </Frame>
  );
}

function Tailored() {
  const city = getCity();
  const crop = CROPS.tailored;
  const origin = { x: 1060, y: 600 };
  const iso = isochrone(city, origin);
  const poly = iso.polygon.map((p) => project(crop, p));
  const d = poly.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") + "Z";
  const segs = iso.segments
    .map(([a, b]) => {
      const pa = project(crop, a);
      const pb = project(crop, b);
      return `M${pa.x.toFixed(1)} ${pa.y.toFixed(1)}L${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`;
    })
    .join("");
  const o = project(crop, origin);
  const modes = ["A pie", "En coche", "Radio", "Área administrativa"];
  return (
    <Frame kind="tailored" label="Área de influencia a pie alrededor de una ubicación durante un periodo">
      <path d={d} fill={BLUE} fillOpacity=".18" stroke={SIGNAL} strokeDasharray="5 5" className="iso-grow" />
      <path d={segs} stroke={SIGNAL} strokeOpacity=".75" strokeWidth="2" fill="none" strokeLinecap="round" className="draw-soft" />
      <circle cx={o.x} cy={o.y} r="7" fill={BLUE} stroke={INK} strokeWidth="2" />
      <g transform="translate(16 16)">
        {modes.map((m, i) => (
          <g key={m} transform={`translate(${[0, 62, 140, 196][i]} 0)`}>
            <rect width={[54, 70, 48, 130][i]} height="24" rx="12" fill={i === 0 ? INK : "#18142C"} stroke={INK} strokeOpacity=".2" />
            <text x={[54, 70, 48, 130][i] / 2} y="16" textAnchor="middle" className="art__chip" fill={i === 0 ? "#0E0B1C" : "rgba(236,237,247,.7)"}>
              {m}
            </text>
          </g>
        ))}
      </g>
      <g transform="translate(16 318)">
        <rect width="150" height="26" rx="6" fill="#18142C" stroke={INK} strokeOpacity=".2" />
        <text x="12" y="17" className="art__label" fill={INK}>
          periodo: 1 mes
        </text>
      </g>
    </Frame>
  );
}

function Focus() {
  const zones = [
    { x: 120, y: 110, w: 80, h: 50 },
    { x: 250, y: 90, w: 70, h: 60 },
    { x: 330, y: 170, w: 90, h: 44 },
    { x: 150, y: 190, w: 76, h: 48 },
  ];
  const series = [
    [0.5, 0.52, 0.55, 0.6, 0.58, 0.64, 0.7, 0.68, 0.72, 0.75, 0.78, 0.8],
    [0.62, 0.6, 0.58, 0.61, 0.6, 0.57, 0.55, 0.56, 0.54, 0.55, 0.53, 0.52],
    [0.3, 0.33, 0.35, 0.34, 0.4, 0.46, 0.52, 0.6, 0.58, 0.61, 0.66, 0.7],
    [0.42, 0.44, 0.43, 0.45, 0.44, 0.46, 0.45, 0.47, 0.48, 0.47, 0.49, 0.5],
  ];
  const tones = [SIGNAL, INK, SPEND, BLUE];
  const cx = (i: number) => 40 + i * 36;
  const cy = (v: number) => 340 - v * 90;
  return (
    <Frame kind="focus" label="Cuatro zonas comerciales y su evolución mensual durante un año">
      <rect x="0" y="236" width={VB_W} height="124" fill="#0E0B1C" fillOpacity=".85" />
      {zones.map((z, i) => (
        <rect key={i} x={z.x} y={z.y} width={z.w} height={z.h} rx="8" fill={tones[i]} fillOpacity=".14" stroke={tones[i]} strokeOpacity=".8" strokeDasharray="4 4" />
      ))}
      {series.map((vals, k) => (
        <path
          key={k}
          d={vals.map((v, i) => `${i ? "L" : "M"}${cx(i)} ${cy(v)}`).join("")}
          fill="none"
          stroke={tones[k]}
          strokeWidth="2.2"
          strokeLinejoin="round"
          pathLength={1}
          className="draw"
          style={{ animationDelay: `${k * 0.15}s` }}
        />
      ))}
      {["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
        <text key={i} x={cx(i)} y="354" textAnchor="middle" className="art__tick" fill="rgba(236,237,247,.45)">
          {m}
        </text>
      ))}
    </Frame>
  );
}

export default function SolutionArt({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "expansion":
      return <Expansion />;
    case "network":
      return <Network />;
    case "campaign":
      return <Campaign />;
    case "impact":
      return <Impact />;
    case "influence":
      return <Influence />;
    case "axis":
      return <Axis />;
    case "event":
      return <EventArt />;
    case "pedestrian":
      return <Pedestrian />;
    case "tailored":
      return <Tailored />;
    case "focus":
      return <Focus />;
  }
}
