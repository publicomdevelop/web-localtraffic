"use client";

import { useState } from "react";
import Link from "next/link";
import SolutionArt from "@/components/illustrations/SolutionArt";
import { SERVICES } from "@/lib/services";

export default function Services() {
  const [active, setActive] = useState(0);
  const current = SERVICES[active];

  return (
    <section className="services band--layer" aria-labelledby="services-title">
      <div className="wrap">
        <h2 id="services-title" className="section-title">
          Tres formas de trabajar juntos.
        </h2>
        <p className="section-lede">
          Todas incluyen lo mismo que nos diferencia: un equipo que interpreta los datos y te dice qué significan.
        </p>

        <div className="services__panel">
          <ul className="services__list">
            {SERVICES.map((s, i) => (
              <li key={s.slug}>
                <button
                  type="button"
                  className="service"
                  aria-pressed={i === active}
                  aria-controls="service-detail"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="service__name">{s.name}</span>
                  <span className="service__tagline">{s.tagline}</span>
                </button>
              </li>
            ))}
          </ul>

          <div id="service-detail" className="services__detail" key={current.slug} aria-live="polite">
            <SolutionArt kind={current.art} />
            <div className="services__text">
              <p>{current.body}</p>
              <dl className="services__meta">
                <div>
                  <dt>Útil para</dt>
                  <dd>{current.useful}</dd>
                </div>
                <div>
                  <dt>Un ejemplo</dt>
                  <dd>{current.example}</dd>
                </div>
              </dl>
              <Link className="link-arrow" href={`/servicios/${current.slug}`}>
                Ver {current.name} en detalle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
