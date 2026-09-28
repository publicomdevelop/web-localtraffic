import InView from "@/components/InView";
import { MapCrop, project, VB_W, VB_H, type Crop } from "@/components/illustrations/MapCrop";
import { getCity, type Vec } from "@/lib/city/model";
import { route, type Lang } from "@/lib/i18n";

// Our main edge: card spending per postcode and which other postcodes that
// money comes from. The illustration uses the same invented city, with the
// postal-code areas it already has.

const COPY = {
  es: {
    title: "Sabemos cuánto se gasta en cada código postal. Y de dónde viene quien lo gasta.",
    lede: "Es nuestra gran ventaja. Con transacciones con tarjeta en comercios y venta física vemos el gasto de cada código postal y de qué otros códigos postales llegan los compradores.",
    points: [
      { title: "Cuánto se gasta", body: "El volumen de gasto de un código postal, por categoría y mes a mes." },
      { title: "De dónde viene", body: "Qué códigos postales aportan cada euro y cuánto pesa el cliente de fuera." },
      { title: "Qué hacer con ello", body: "Dónde captar, qué zona reforzar y a quién dirigir la próxima campaña." },
    ],
    cta: "Verlo con mi código postal",
    rankTitle: "Origen del gasto en el CP destino",
    dest: "CP destino",
    own: "El propio CP",
    cp: (i: number) => `CP ${String.fromCharCode(65 + i)}`,
    sample: "Datos de ejemplo",
    aria: "Mapa de códigos postales con flujos de gasto hacia un código postal destino y ranking del origen del gasto",
  },
  en: {
    title: "We know how much is spent in every postcode. And where the people spending it come from.",
    lede: "It's our biggest edge. With card transactions in shops and in-store sales we see the spending in each postcode and which other postcodes its buyers come from.",
    points: [
      { title: "How much is spent", body: "A postcode's spending volume, by category and month by month." },
      { title: "Where it comes from", body: "Which postcodes bring in every euro and how much outside customers weigh." },
      { title: "What to do about it", body: "Where to win customers, which area to strengthen and who to target with your next campaign." },
    ],
    cta: "See it for my postcode",
    rankTitle: "Where spending in the target postcode comes from",
    dest: "Target postcode",
    own: "The postcode itself",
    cp: (i: number) => `Postcode ${String.fromCharCode(65 + i)}`,
    sample: "Sample data",
    aria: "Postcode map with spending flows into a target postcode and a ranking of where spending comes from",
  },
};

const CROP: Crop = { cx: 760, cy: 470, k: 0.5 };
const BLUE = "#3340F5";
const SIGNAL = "#8A92FF";
const SPEND = "#FF6B3D";
const INK = "#ECEDF7";

type Origin = { zone: number; c: Vec; share: number };

function buildArt() {
  const city = getCity();
  const hub = city.hubs[0];
  // Destination: the biggest postal area near the main shopping hub, so it reads as one shape.
  let dest = 0;
  let best = -Infinity;
  city.zones.forEach((z, i) => {
    if (!z.cells.length) return;
    const d = Math.hypot(z.centroid.x - hub.x, z.centroid.y - hub.y);
    const score = z.cells.length - d / 12;
    if (d < 320 && score > best) {
      best = score;
      dest = i;
    }
  });
  const destC = project(CROP, city.zones[dest].centroid);
  const inView = (p: Vec) => p.x > 20 && p.x < VB_W - 20 && p.y > 20 && p.y < VB_H - 20;
  // Weight each origin by its own spending and by how close it is.
  const raw = city.zones
    .map((z, i) => ({ zone: i, c: project(CROP, z.centroid), w: z.cells.length ? z.spend : 0 }))
    .filter((o) => o.zone !== dest && o.w > 0 && inView(o.c))
    .map((o) => ({ ...o, w: o.w / (1 + Math.hypot(o.c.x - destC.x, o.c.y - destC.y) / 160) }));
  const total = raw.reduce((a, o) => a + o.w, 0) || 1;
  const origins: Origin[] = raw
    .map((o) => ({ zone: o.zone, c: o.c, share: o.w / total }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 5);

  const quad = (q: Vec[]) => q.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") + "Z";
  const zoneShape = (zi: number) =>
    city.zones[zi].cells.map((k) => quad(city.cells[k].quad.map((p) => project(CROP, p)))).join("");

  const borders = city.zoneBorders
    .map(([a, b]) => {
      const p = project(CROP, a);
      const q = project(CROP, b);
      return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    })
    .join("");

  return { dest, destC, origins, borders, destShape: zoneShape(dest), originShapes: origins.map((o) => zoneShape(o.zone)) };
}

export default function SpendOrigin({ lang = "es" }: { lang?: Lang }) {
  const t = COPY[lang];
  const art = buildArt();
  // Illustrative split: the postcode's own residents plus the six top origins.
  const ownShare = 0.38;
  const rows = [
    { label: t.own, share: ownShare, own: true },
    ...art.origins.map((o, i) => ({ label: t.cp(i), share: o.share * (1 - ownShare), own: false })),
  ].slice(0, 6);
  const pct = (v: number) => `${Math.round(v * 100)} %`;

  return (
    <section className="origin" aria-labelledby="origin-title">
      <div className="wrap origin__grid">
        <div className="origin__text">
          <h2 id="origin-title" className="origin__title">
            {t.title}
          </h2>
          <p className="section-lede">{t.lede}</p>
          <dl className="origin__points">
            {t.points.map((p) => (
              <div key={p.title}>
                <dt>{p.title}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>
          <a className="btn btn--primary" href={route("contact", lang)}>
            {t.cta}
          </a>
        </div>

        <InView as="figure" className="origin__figure">
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="art origin__map" role="img" aria-label={t.aria}>
            <rect width={VB_W} height={VB_H} fill="#0E0B1C" />
            <MapCrop crop={CROP} />
            {art.originShapes.map((d, i) => (
              <path key={i} d={d} fill={SPEND} fillOpacity={[0.62, 0.5, 0.4, 0.31, 0.23, 0.16][i]} />
            ))}
            <path d={art.destShape} fill={BLUE} fillOpacity=".7" />
            {/* Postcode boundaries */}
            <path d={art.borders} fill="none" stroke={INK} strokeOpacity=".4" strokeWidth=".9" strokeDasharray="3 3" />
            {art.origins.map((o, i) => {
              const dx = art.destC.x - o.c.x;
              const dy = art.destC.y - o.c.y;
              const mx = (o.c.x + art.destC.x) / 2 - dy * 0.25;
              const my = (o.c.y + art.destC.y) / 2 + dx * 0.25;
              return (
                <g key={o.zone}>
                  <path
                    d={`M${o.c.x.toFixed(1)} ${o.c.y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${art.destC.x.toFixed(1)} ${art.destC.y.toFixed(1)}`}
                    fill="none"
                    stroke="#FFAA82"
                    strokeWidth={1.2 + o.share * 9}
                    strokeLinecap="round"
                    className="flow"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                  <circle cx={o.c.x} cy={o.c.y} r="4" fill={SPEND} />
                  <text x={o.c.x} y={o.c.y - 9} textAnchor="middle" className="art__label" fill={INK}>
                    {t.cp(i).replace(/^.* /, "")}
                  </text>
                </g>
              );
            })}
            <circle cx={art.destC.x} cy={art.destC.y} r="8" fill={BLUE} stroke={INK} strokeWidth="2" />
            <text x={art.destC.x} y={art.destC.y + 24} textAnchor="middle" className="art__label" fill={INK}>
              {t.dest}
            </text>
          </svg>
          <figcaption className="origin__rank">
            <p className="origin__rank-title">
              <span>{t.rankTitle}</span>
              <span className="report__tag">{t.sample}</span>
            </p>
            <ul className="hbars origin__bars">
              {rows.map((r, i) => (
                <li key={r.label}>
                  <span>{r.label}</span>
                  <span className="hbars__track">
                    <span
                      className={`hbars__bar${r.own ? " hbars__bar--own" : ""}`}
                      style={{ ["--v" as string]: Math.min(1, r.share / rows[0].share), transitionDelay: `${i * 80}ms` } as React.CSSProperties}
                    />
                  </span>
                  <span className="origin__pct">{pct(r.share)}</span>
                </li>
              ))}
            </ul>
          </figcaption>
        </InView>
      </div>
    </section>
  );
}
