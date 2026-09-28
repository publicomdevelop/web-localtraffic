import InView from "@/components/InView";
import { MapCrop } from "@/components/illustrations/MapCrop";

const INCLUDES = [
  "Área de influencia a pie y en coche",
  "Gasto con tarjeta por categoría y ticket medio",
  "Peatones y vehículos por tramo de calle",
  "Perfil y origen de quienes la visitan",
  "Comparativa con otras zonas que elijas",
];

const CATEGORIES = [
  { label: "Alimentación", v: 0.92 },
  { label: "Restauración", v: 0.74 },
  { label: "Moda", v: 0.58 },
  { label: "Hogar", v: 0.36 },
  { label: "Salud", v: 0.28 },
];

const WEEK = [0.52, 0.48, 0.55, 0.6, 0.78, 1, 0.66];

export default function ZoneStudy() {
  return (
    <section className="zone" aria-labelledby="zone-title">
      <div className="wrap zone__grid">
        <div className="zone__text">
          <h2 id="zone-title" className="section-title">
            Tu zona, en una demo.
          </h2>
          <p className="section-lede">
            Dinos una calle, un barrio o un municipio. En la demo te enseñamos lo que vemos en ella con datos reales, no
            con un ejemplo.
          </p>
          <ul className="checklist">
            {INCLUDES.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <a className="btn btn--primary" href="#demo">
            Pedir demo con mi zona
          </a>
        </div>

        <InView as="figure" className="report">
          <div className="report__sheet report__sheet--back" aria-hidden="true" />
          <div className="report__sheet">
            <header className="report__head">
              <span className="mono">Estudio de zona</span>
              <span className="report__tag">Ejemplo</span>
            </header>
            <svg viewBox="0 0 480 200" className="report__map" aria-hidden="true">
              <rect width="480" height="200" fill="#0E0B1C" />
              <g transform="translate(0 -80)">
                <MapCrop crop={{ cx: 700, cy: 470, k: 1.2 }} />
              </g>
              <ellipse cx="240" cy="100" rx="120" ry="72" fill="#3340F5" fillOpacity=".16" stroke="#8A92FF" strokeDasharray="4 4" />
              <circle cx="240" cy="100" r="6" fill="#3340F5" stroke="#ECEDF7" strokeWidth="1.5" />
            </svg>
            <dl className="report__kpis">
              <div>
                <dt>Gasto mensual</dt>
                <dd>1,8 M€</dd>
              </div>
              <div>
                <dt>Ticket medio</dt>
                <dd>27 €</dd>
              </div>
              <div>
                <dt>Peatones/día</dt>
                <dd>9.400</dd>
              </div>
            </dl>
            <div className="report__charts">
              <div>
                <p className="report__label">Gasto por categoría</p>
                <ul className="hbars">
                  {CATEGORIES.map((c, i) => (
                    <li key={c.label}>
                      <span>{c.label}</span>
                      <span className="hbars__track">
                        <span
                          className="hbars__bar"
                          style={{ ["--v" as string]: c.v, transitionDelay: `${i * 80}ms` } as React.CSSProperties}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="report__label">Gasto por día</p>
                <div className="vbars" aria-hidden="true">
                  {WEEK.map((v, i) => (
                    <span
                      key={i}
                      className="vbars__bar"
                      style={{ ["--v" as string]: v, transitionDelay: `${i * 70}ms` } as React.CSSProperties}
                    />
                  ))}
                </div>
                <div className="vbars__days" aria-hidden="true">
                  {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <figcaption className="sr-only">Vista previa de un informe de zona con datos de ejemplo.</figcaption>
        </InView>
      </div>
    </section>
  );
}
