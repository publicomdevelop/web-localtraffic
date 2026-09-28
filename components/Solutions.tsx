"use client";

import { useState } from "react";
import SolutionArt, { type ArtKind } from "@/components/illustrations/SolutionArt";

type Solution = { art: ArtKind; title: string; body: string };
type Audience = { id: "retail" | "ciudades"; label: string; intro: string; items: Solution[] };

const AUDIENCES: Audience[] = [
  {
    id: "retail",
    label: "Retail y marketing",
    intro: "Para cadenas, marcas y agencias que necesitan decidir dónde abrir, dónde invertir y qué ha funcionado.",
    items: [
      {
        art: "expansion",
        title: "Dónde abrir la próxima tienda",
        body: "Compara ubicaciones por gasto, tráfico y competencia antes de firmar un local.",
      },
      {
        art: "network",
        title: "Qué tiendas rinden por debajo de su zona",
        body: "Cruza la facturación de tu red con el potencial real de cada área de influencia.",
      },
      {
        art: "campaign",
        title: "Dónde poner la campaña",
        body: "Elige barrios, códigos postales y soportes exteriores según quién pasa y cuánto gasta.",
      },
      {
        art: "impact",
        title: "Qué ha movido la campaña",
        body: "Mide visitas y gasto antes, durante y después de cada acción.",
      },
    ],
  },
  {
    id: "ciudades",
    label: "Ciudades y entidades",
    intro:
      "Para ayuntamientos, cámaras de comercio y asociaciones de comerciantes que quieren entender y reactivar su territorio.",
    items: [
      {
        art: "influence",
        title: "Hasta dónde llega tu área de influencia",
        body: "De qué municipios y barrios vienen quienes compran en tu centro urbano.",
      },
      {
        art: "axis",
        title: "Cómo va cada eje comercial",
        body: "Gasto, visitantes y tráfico por calle, comparados entre zonas y a lo largo del tiempo.",
      },
      {
        art: "event",
        title: "Qué impacto ha tenido un evento",
        body: "Festivales, ferias o la campaña de Navidad frente a un periodo normal.",
      },
      {
        art: "pedestrian",
        title: "Qué ha cambiado tras una peatonalización",
        body: "Peatones, vehículos y consumo antes y después, en la zona y en sus alrededores.",
      },
    ],
  },
];

export default function Solutions() {
  const [audience, setAudience] = useState(0);
  const [item, setItem] = useState(0);
  const current = AUDIENCES[audience];
  const selected = current.items[item];

  const selectAudience = (i: number) => {
    setAudience(i);
    setItem(0);
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (audience + 1) % AUDIENCES.length;
    selectAudience(next);
    document.getElementById(`tab-${AUDIENCES[next].id}`)?.focus();
  };

  return (
    <section id="soluciones" className="solutions" aria-labelledby="solutions-title">
      <div className="wrap">
        <h2 id="solutions-title" className="section-title">
          Qué resolvemos
        </h2>
        <div className="tabs" role="tablist" aria-label="Tipo de cliente">
          {AUDIENCES.map((a, i) => (
            <button
              key={a.id}
              id={`tab-${a.id}`}
              role="tab"
              type="button"
              aria-selected={i === audience}
              aria-controls={`panel-${a.id}`}
              tabIndex={i === audience ? 0 : -1}
              className="tabs__tab"
              onClick={() => selectAudience(i)}
              onKeyDown={onTabKey}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div id={`panel-${current.id}`} role="tabpanel" aria-labelledby={`tab-${current.id}`} className="solutions__panel">
          <div className="solutions__list">
            <p className="solutions__intro">{current.intro}</p>
            <ul>
              {current.items.map((s, i) => (
                <li key={s.art}>
                  <button
                    type="button"
                    className="solution"
                    aria-pressed={i === item}
                    onClick={() => setItem(i)}
                    onMouseEnter={() => setItem(i)}
                    onFocus={() => setItem(i)}
                  >
                    <span className="solution__title">{s.title}</span>
                    <span className="solution__body">{s.body}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="solutions__art" key={selected.art}>
            <SolutionArt kind={selected.art} />
            <p className="solutions__caption">{selected.title}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
