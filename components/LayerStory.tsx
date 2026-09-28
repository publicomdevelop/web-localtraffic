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
    id: "residente",
    kicker: "Perfil del residente",
    title: "Quién vive en la zona.",
    body: "Cuántas personas viven, qué edad tienen, de qué renta disponen los hogares y en qué gastan.",
    items: ["¿Cuánta gente vive aquí y de qué edad?", "¿Qué renta tienen los hogares?", "¿En qué se reparte su gasto?"],
    legend: { tone: "publico", label: "Densidad de residentes por manzana" },
    layers: { ...NONE, publico: 1 },
    camera: { x: 800, y: 520, zoom: 1.05 },
  },
  {
    id: "visitante",
    kicker: "Perfil del visitante",
    title: "Quién viene, cuándo y cuánto se queda.",
    body: "Visitas por día y por hora, tiempo de estancia, edad y renta de quien pasa por la zona, y cómo se mueve la gente a su alrededor.",
    items: ["¿Qué días y a qué horas hay más visitas?", "¿Cuánto tiempo se quedan?", "¿Qué perfil tiene quien visita la zona?"],
    legend: { tone: "movilidad", label: "Personas y vehículos en movimiento" },
    layers: { ...NONE, movilidad: 1, trafico: 0.6 },
    camera: { x: 820, y: 520, zoom: 1.45 },
  },
  {
    id: "consumidor",
    kicker: "Origen del consumidor",
    title: "De dónde viene quien compra.",
    body: "Qué códigos postales aportan el gasto de la zona y cuánto pesa cada uno. Así sabes si tu cliente es del barrio o viene de fuera, y dónde ir a buscarlo.",
    items: ["¿Qué áreas aportan más gasto?", "¿Cuánto pesa el cliente de fuera?", "¿Dónde está el cliente que aún no viene?"],
    legend: { tone: "consumo", label: "Gasto por código postal y hacia dónde se desplaza" },
    layers: { ...NONE, consumo: 1 },
    camera: { x: 760, y: 500, zoom: 1.15 },
  },
  {
    id: "ih",
    kicker: "Inteligencia Humana",
    title: "Y lo más importante: interpretarlo.",
    body: "Los datos no deciden solos. Nuestro equipo los cruza con lo que conoce del territorio y te entrega una conclusión clara: qué está pasando, por qué y qué te recomendamos hacer.",
    items: [],
    legend: { tone: "consumo", label: "Todas las miradas a la vez" },
    layers: { consumo: 0.7, movilidad: 0.8, trafico: 0.6, publico: 0.35 },
    camera: { x: 800, y: 520, zoom: 1.2 },
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
          Tres miradas sobre cualquier zona.
        </h2>
        <p className="section-lede">
          Reunimos fuentes públicas y privadas para entender quién vive, quién viene y quién compra. Baja para verlo.
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
                  <a className="btn btn--primary" href="/contacto">
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
