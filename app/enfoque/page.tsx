import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import { ConvergeArt } from "@/components/Approach";
import { Why, Faq } from "@/components/WhyFaq";
import { Marquee, CtaBand } from "@/components/Bands";
import SolutionArt from "@/components/illustrations/SolutionArt";

export const metadata: Metadata = pageMeta({
  title: "Enfoque: Inteligencia Humana",
  description:
    "Qué es la Inteligencia Humana de localtraffic: reunimos datos de residentes, visitantes y consumo de cualquier zona, los interpretamos con experiencia sobre el terreno y te decimos qué hacer.",
  path: "/enfoque",
});

const PARTS = [
  {
    title: "Reunimos",
    body: "Fuentes públicas y privadas sobre quién vive en una zona, quién la visita y de dónde sale su gasto. Todo sobre el mismo mapa, con el mismo criterio.",
  },
  {
    title: "Interpretamos",
    body: "Un dato aislado no dice nada. Lo leemos con el contexto de la zona: su comercio, su calendario, sus obras, lo que ya sabemos del terreno.",
  },
  {
    title: "Recomendamos",
    body: "Terminamos siempre con una conclusión: qué está pasando, por qué y qué haríamos en tu lugar, ordenado por prioridad.",
  },
];

const LENSES = [
  {
    title: "Perfil del residente",
    body: "Quién vive en la zona: cuántos son, qué edad tienen, qué renta disponen los hogares y en qué la gastan.",
    art: "influence" as const,
  },
  {
    title: "Perfil del visitante",
    body: "Quién viene, cuándo y cuánto se queda: días y horas de más afluencia, duración de la visita y perfil de quien llega.",
    art: "event" as const,
  },
  {
    title: "Origen del consumidor",
    body: "De dónde sale el gasto: qué áreas aportan más, cuánto pesa el cliente de fuera y dónde está el que todavía no viene.",
    art: "campaign" as const,
  },
];

export default function EnfoquePage() {
  return (
    <>
      <PageHero
        title="Los datos no toman decisiones. Las personas, sí."
        lede="Trabajamos con todos los datos a nuestro alcance, pero lo que nos diferencia es lo que hacemos con ellos. A eso lo llamamos Inteligencia Humana."
        crumbs={[{ href: "/", label: "Inicio" }, { href: "/enfoque", label: "Enfoque" }]}
        art={<ConvergeArt />}
      />

      <section className="section" aria-labelledby="ih-title">
        <div className="wrap split">
          <h2 id="ih-title" className="section-title">
            Qué es la Inteligencia Humana.
          </h2>
          <ol className="parts">
            {PARTS.map((p) => (
              <li key={p.title} className="parts__item">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Marquee />

      <section className="section band--layer" aria-labelledby="lenses-title">
        <div className="wrap">
          <h2 id="lenses-title" className="section-title">
            Tres miradas sobre cada zona.
          </h2>
          <div className="lenses">
            {LENSES.map((l) => (
              <article key={l.title} className="lens">
                <SolutionArt kind={l.art} />
                <h3>{l.title}</h3>
                <p>{l.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Why />
      <Faq />
      <CtaBand />
    </>
  );
}
