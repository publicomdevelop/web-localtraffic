"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CityCanvas from "@/components/city/CityCanvas";
import type { Camera, Layers } from "@/lib/city/renderer";
import { route, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

type Tone = "consumo" | "movilidad" | "trafico" | "publico";
type StepText = { kicker: string; title: string; body: string; items: string[]; legend: string };
type Step = { id: string; tone: Tone; layers: Layers; camera: Camera; text: Record<Lang, StepText> };

const NONE: Layers = { consumo: 0, movilidad: 0, trafico: 0, publico: 0 };

const STEPS: Step[] = [
  {
    id: "residente",
    tone: "publico",
    layers: { ...NONE, publico: 1 },
    camera: { x: 800, y: 520, zoom: 1.05 },
    text: {
      es: {
        kicker: "Perfil del residente",
        title: "Quién vive en la zona.",
        body: "Cuántas personas viven, qué edad tienen, de qué renta disponen los hogares y en qué gastan.",
        items: ["¿Cuánta gente vive aquí y de qué edad?", "¿Qué renta tienen los hogares?", "¿En qué se reparte su gasto?"],
        legend: "Densidad de residentes por manzana",
      },
      en: {
        kicker: "Resident profile",
        title: "Who lives in the area.",
        body: "How many people live there, how old they are, what income households have and what they spend it on.",
        items: ["How many people live here, and how old are they?", "What income do households have?", "How is their spending split?"],
        legend: "Resident density by block",
      },
    },
  },
  {
    id: "visitante",
    tone: "movilidad",
    layers: { ...NONE, movilidad: 1, trafico: 0.6 },
    camera: { x: 820, y: 520, zoom: 1.45 },
    text: {
      es: {
        kicker: "Perfil del visitante",
        title: "Quién viene, cuándo y cuánto se queda.",
        body: "Visitas por día y por hora, tiempo de estancia, edad y renta de quien pasa por la zona, y cómo se mueve la gente a su alrededor.",
        items: ["¿Qué días y a qué horas hay más visitas?", "¿Cuánto tiempo se quedan?", "¿Qué perfil tiene quien visita la zona?"],
        legend: "Personas y vehículos en movimiento",
      },
      en: {
        kicker: "Visitor profile",
        title: "Who comes, when, and how long they stay.",
        body: "Visits by day and hour, length of stay, age and income of the people who pass through, and how people move around it.",
        items: ["Which days and hours get the most visits?", "How long do people stay?", "What profile do visitors have?"],
        legend: "People and vehicles on the move",
      },
    },
  },
  {
    id: "consumidor",
    tone: "consumo",
    layers: { ...NONE, consumo: 1 },
    camera: { x: 760, y: 500, zoom: 1.15 },
    text: {
      es: {
        kicker: "Origen del consumidor",
        title: "De dónde viene quien compra.",
        body: "Qué códigos postales aportan el gasto de la zona y cuánto pesa cada uno. Así sabes si tu cliente es del barrio o viene de fuera, y dónde ir a buscarlo.",
        items: ["¿Qué áreas aportan más gasto?", "¿Cuánto pesa el cliente de fuera?", "¿Dónde está el cliente que aún no viene?"],
        legend: "Gasto por código postal y hacia dónde se desplaza",
      },
      en: {
        kicker: "Consumer origin",
        title: "Where the people who buy come from.",
        body: "Which postcodes bring spending into the area and how much each one weighs. So you know whether your customer is local or comes from elsewhere, and where to go and find them.",
        items: ["Which areas bring in the most spending?", "How much do outside customers weigh?", "Where is the customer who doesn't come yet?"],
        legend: "Spending by postcode and where it flows",
      },
    },
  },
  {
    id: "ih",
    tone: "consumo",
    layers: { consumo: 0.7, movilidad: 0.8, trafico: 0.6, publico: 0.35 },
    camera: { x: 800, y: 520, zoom: 1.2 },
    text: {
      es: {
        kicker: "Inteligencia Humana",
        title: "Y lo más importante: interpretarlo.",
        body: "Los datos no deciden solos. Nuestro equipo los cruza con lo que conoce del territorio y te entrega una conclusión clara: qué está pasando, por qué y qué te recomendamos hacer.",
        items: [],
        legend: "Todas las miradas a la vez",
      },
      en: {
        kicker: "Human Intelligence",
        title: "And the most important part: making sense of it.",
        body: "Data doesn't decide on its own. Our team reads it against what it knows about the area and gives you a clear conclusion: what is happening, why, and what we recommend you do.",
        items: [],
        legend: "Every view at once",
      },
    },
  },
];

const COPY = {
  es: {
    title: "Tres miradas sobre cualquier zona.",
    lede: "Reunimos fuentes públicas y privadas para entender quién vive, quién viene y quién compra. Baja para verlo.",
    cta: "Verlo con mi zona",
  },
  en: {
    title: "Three views of any area.",
    lede: "We combine public and private sources to understand who lives there, who visits and who buys. Scroll to see it.",
    cta: "See it with my area",
  },
};

export default function LayerStory() {
  const lang = useLang();
  const c = COPY[lang];
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
          {c.title}
        </h2>
        <p className="section-lede">
          {c.lede}
        </p>
      </div>

      <div className="story__body wrap-wide">
        <div className="story__sticky">
          <CityCanvas className="story__canvas" layers={step.layers} camera={step.camera} walkers={900} />
          <ol className="story__progress" aria-hidden="true">
            {STEPS.map((s, i) => (
              <li key={s.id} className={i === active ? "is-active" : undefined}>
                {s.text[lang].kicker}
              </li>
            ))}
          </ol>
          <p className={`story__legend legend--${step.tone}`}>
            <span className="legend__swatch" aria-hidden="true" />
            {step.text[lang].legend}
          </p>
        </div>

        <div className="story__steps">
          {STEPS.map((s) => (
            <article key={s.id} className="story__step" aria-labelledby={`step-${s.id}`}>
              <div className={`story__card tone--${s.tone}`}>
                <p className="kicker">{s.text[lang].kicker}</p>
                <h3 id={`step-${s.id}`}>{s.text[lang].title}</h3>
                <p>{s.text[lang].body}</p>
                {s.text[lang].items.length > 0 ? (
                  <ul className="story__items">
                    {s.text[lang].items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <a className="btn btn--primary" href={route("contact", lang)}>
                    {c.cta}
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
