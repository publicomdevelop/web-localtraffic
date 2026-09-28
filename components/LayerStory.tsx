"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CityCanvas from "@/components/city/CityCanvas";
import type { Camera, Layers } from "@/lib/city/renderer";

type Step = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  items: string[];
  legend: { tone: "consumo" | "movilidad" | "trafico" | "publico"; label: string };
  layers: Layers;
  camera: Camera;
};

const NONE: Layers = { consumo: 0, movilidad: 0, trafico: 0, publico: 0 };

const STEPS: Step[] = [
  {
    id: "consumo",
    kicker: "Consumo",
    title: "Cuánto se gasta, calle a calle.",
    body:
      "Transacciones con tarjeta en comercios y venta física, agregadas por zona. Ves cuánto se gasta, el ticket medio y en qué: alimentación, moda, restauración… y cómo cambia según el día y la hora.",
    items: ["Volumen de gasto", "Ticket medio", "Gasto por categoría", "Procedencia del comprador"],
    legend: { tone: "consumo", label: "Cada destello es una compra con tarjeta" },
    layers: { ...NONE, consumo: 1 },
    camera: { x: 720, y: 480, zoom: 2.1 },
  },
  {
    id: "movilidad",
    kicker: "Movilidad",
    title: "Quién llega, de dónde y cuánto se queda.",
    body:
      "Datos de movilidad agregados y anónimos: cuántas personas visitan una zona, desde qué municipio o barrio vienen, cuánto tiempo pasan y qué otras zonas visitan.",
    items: ["Visitantes al día", "Origen de los visitantes", "Tiempo de estancia", "Frecuencia de visita"],
    legend: { tone: "movilidad", label: "Cada punto es un grupo de visitantes" },
    layers: { ...NONE, movilidad: 1 },
    camera: { x: 860, y: 540, zoom: 1.5 },
  },
  {
    id: "trafico",
    kicker: "Tráfico",
    title: "Cuántos pasan por delante.",
    body:
      "Peatones y vehículos por tramo de calle, con los días y las horas punta. Sirve para comparar un local con otro o una calle con la de al lado.",
    items: ["Peatones por tramo", "Vehículos por tramo", "Días y horas punta", "Evolución en el tiempo"],
    legend: { tone: "trafico", label: "Flujo de vehículos en las vías principales" },
    layers: { ...NONE, trafico: 1, movilidad: 0.25 },
    camera: { x: 800, y: 520, zoom: 1.1 },
  },
  {
    id: "publico",
    kicker: "Fuentes públicas",
    title: "Y todo lo que ya es público, ordenado.",
    body:
      "Padrón, INE, catastro, renta por hogar, puntos de interés y competencia. Cruzados con lo anterior en el mismo mapa, sin juntar hojas de cálculo.",
    items: ["Población y edad", "Renta por hogar", "Catastro y vivienda", "Competencia y puntos de interés"],
    legend: { tone: "publico", label: "Densidad de población por manzana" },
    layers: { ...NONE, publico: 1 },
    camera: { x: 780, y: 520, zoom: 1.0 },
  },
  {
    id: "todo",
    kicker: "Todo junto",
    title: "Juntas responden una pregunta: ¿aquí sí o aquí no?",
    body:
      "Dónde abrir, dónde invertir en publicidad, qué calle necesita un impulso o qué efecto ha tenido un evento. Te lo explicamos con datos y con un informe que se entiende.",
    items: [],
    legend: { tone: "consumo", label: "Las cuatro capas a la vez" },
    layers: { consumo: 1, movilidad: 0.8, trafico: 0.8, publico: 0.35 },
    camera: { x: 800, y: 520, zoom: 1.25 },
  },
];

export default function LayerStory() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>(".story__step");
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        steps.forEach((step) => {
          gsap.fromTo(
            step.querySelector(".story__card"),
            { opacity: 0.25, y: 40 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: step, start: "top 85%", end: "top 45%", scrub: true },
            },
          );
        });
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const step = STEPS[active];

  return (
    <section id="datos" ref={root} className="story" aria-labelledby="story-title">
      <div className="story__intro wrap">
        <h2 id="story-title" className="section-title">
          Cuatro capas de datos sobre el mismo mapa.
        </h2>
        <p className="section-lede">
          Tres fuentes privadas que no encontrarás en datos abiertos, más todas las públicas. Baja para verlas una a
          una.
        </p>
      </div>

      <div className="story__body wrap-wide">
        <div className="story__sticky">
          <CityCanvas className="story__canvas" layers={step.layers} camera={step.camera} walkers={900} />
          <ol className="story__progress" aria-hidden="true">
            {STEPS.map((s, i) => (
              <li key={s.id} className={i === active ? "is-active" : undefined}>
                {s.kicker}
              </li>
            ))}
          </ol>
          <p className={`story__legend legend--${step.legend.tone}`}>
            <span className="legend__swatch" aria-hidden="true" />
            {step.legend.label}
          </p>
        </div>

        <div className="story__steps">
          {STEPS.map((s) => (
            <article key={s.id} className="story__step" aria-labelledby={`step-${s.id}`}>
              <div className={`story__card tone--${s.legend.tone}`}>
                <p className="kicker">{s.kicker}</p>
                <h3 id={`step-${s.id}`}>{s.title}</h3>
                <p>{s.body}</p>
                {s.items.length > 0 ? (
                  <ul className="story__items">
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <a className="btn btn--primary" href="#demo">
                    Verlo con mi zona
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
