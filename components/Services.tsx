"use client";

import { useState } from "react";
import SolutionArt, { type ArtKind } from "@/components/illustrations/SolutionArt";

type Service = {
  id: string;
  name: string;
  tagline: string;
  body: string;
  useful: string;
  example: string;
  art: ArtKind;
};

const SERVICES: Service[] = [
  {
    id: "tailored",
    name: "Tailored",
    tagline: "Una foto precisa de una ubicación.",
    body:
      "Eliges un punto, su área de influencia (a pie, en coche, por radio o por área administrativa) y un periodo. Te contamos quién vive, quién viene y de dónde sale el gasto.",
    useful: "Decidir una apertura, valorar un local o preparar una campaña.",
    example: "Radiografía de un barrio comercial durante un mes concreto.",
    art: "tailored",
  },
  {
    id: "focus",
    name: "Focus",
    tagline: "La evolución de una zona, mes a mes.",
    body:
      "Definimos una o varias áreas comerciales y las seguimos durante el año: visitas, perfil del visitante, horarios y origen del gasto, con un informe cada mes.",
    useful: "Ver el efecto de lo que haces y detectar cambios a tiempo.",
    example: "Seguimiento mensual de seis ejes comerciales de un mismo municipio, comparados entre sí.",
    art: "focus",
  },
  {
    id: "ondemand",
    name: "On Demand",
    tagline: "Un análisis a medida para una pregunta concreta.",
    body:
      "Periodo, zonas y datos a medida, incluidos los tuyos si quieres cruzarlos con los nuestros. Para preguntas que no caben en un informe estándar.",
    useful: "Medir el impacto de una obra, un evento o un cambio en la movilidad.",
    example: "Impacto de una zona peatonal en el tráfico peatonal y rodado, dos años y medio después de implantarla.",
    art: "pedestrian",
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const current = SERVICES[active];

  return (
    <section id="servicios" className="services" aria-labelledby="services-title">
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
              <li key={s.id}>
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

          <div id="service-detail" className="services__detail" key={current.id} aria-live="polite">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
