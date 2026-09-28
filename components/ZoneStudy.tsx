import InView from "@/components/InView";
import { MapCrop } from "@/components/illustrations/MapCrop";

const INCLUDES = [
  "Área de influencia a pie, en coche o a medida",
  "Perfil del residente",
  "Perfil del visitante: visitas, horarios y estancia",
  "Origen del consumidor",
  "Nuestra lectura: qué significa y qué haríamos",
];

const DURATION = [
  { label: "0-29 min", v: 0.9 },
  { label: "30-59 min", v: 0.42 },
  { label: "60-89 min", v: 0.24 },
  { label: "90-119 min", v: 0.16 },
  { label: "120+ min", v: 0.3 },
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
            Dinos una ubicación, un barrio o un municipio. En la demo te enseñamos lo que vemos en ella con datos
            reales, no con un ejemplo.
          </p>
          <ul className="checklist">
            {INCLUDES.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <a className="btn btn--primary" href="/contacto">
            Pedir demo con mi zona
          </a>
        </div>

        <InView as="figure" className="report">
          <div className="report__sheet report__sheet--back" aria-hidden="true" />
          <div className="report__sheet">
            <header className="report__head">
              <span className="mono">Perfil del visitante</span>
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
                <dt>Visitas en el mes</dt>
                <dd>96.400</dd>
              </div>
              <div>
                <dt>Tiempo medio</dt>
                <dd>52 min</dd>
              </div>
              <div>
                <dt>Edad media</dt>
                <dd>43 años</dd>
              </div>
            </dl>
            <div className="report__charts">
              <div>
                <p className="report__label">Duración de la visita</p>
                <ul className="hbars">
                  {DURATION.map((c, i) => (
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
                <p className="report__label">Visitas por día</p>
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
