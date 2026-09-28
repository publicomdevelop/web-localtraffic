import PageHero from "@/components/PageHero";
import { ConvergeArt } from "@/components/Approach";
import { Why, Faq } from "@/components/WhyFaq";
import { Marquee, CtaBand } from "@/components/Bands";
import SolutionArt from "@/components/illustrations/SolutionArt";
import { route, type Lang } from "@/lib/i18n";

const COPY = {
  es: {
    title: "Los datos no toman decisiones. Las personas, sí.",
    lede: "Trabajamos con todos los datos a nuestro alcance, pero lo que nos diferencia es lo que hacemos con ellos. A eso lo llamamos Inteligencia Humana.",
    home: "Inicio",
    here: "Enfoque",
    ihTitle: "Qué es la Inteligencia Humana.",
    parts: [
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
    ],
    lensesTitle: "Tres miradas sobre cada zona.",
    lenses: [
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
    ],
  },
  en: {
    title: "Data doesn't make decisions. People do.",
    lede: "We work with all the data within our reach, but what sets us apart is what we do with it. We call it Human Intelligence.",
    home: "Home",
    here: "Approach",
    ihTitle: "What Human Intelligence is.",
    parts: [
      {
        title: "We gather",
        body: "Public and private sources on who lives in an area, who visits it and where its spending comes from. All on the same map, with the same criteria.",
      },
      {
        title: "We interpret",
        body: "A single figure says nothing on its own. We read it in the context of the area: its shops, its calendar, its roadworks, what we already know on the ground.",
      },
      {
        title: "We recommend",
        body: "We always finish with a conclusion: what is happening, why, and what we would do in your place, in order of priority.",
      },
    ],
    lensesTitle: "Three views of every area.",
    lenses: [
      {
        title: "Resident profile",
        body: "Who lives in the area: how many people, how old they are, what income households have and what they spend it on.",
        art: "influence" as const,
      },
      {
        title: "Visitor profile",
        body: "Who comes, when and how long they stay: busiest days and hours, length of visit and the profile of those who come.",
        art: "event" as const,
      },
      {
        title: "Consumer origin",
        body: "Where spending comes from: which areas bring in the most, how much outside customers weigh and where the ones who don't come yet are.",
        art: "campaign" as const,
      },
    ],
  },
};

export default function ApproachPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <>
      <PageHero
        lang={lang}
        title={t.title}
        lede={t.lede}
        crumbs={[
          { href: route("home", lang), label: t.home },
          { href: route("approach", lang), label: t.here },
        ]}
        art={<ConvergeArt lang={lang} />}
      />

      <section className="section" aria-labelledby="ih-title">
        <div className="wrap split">
          <h2 id="ih-title" className="section-title">
            {t.ihTitle}
          </h2>
          <ol className="parts">
            {t.parts.map((p) => (
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
            {t.lensesTitle}
          </h2>
          <div className="lenses">
            {t.lenses.map((l) => (
              <article key={l.title} className="lens">
                <SolutionArt kind={l.art} lang={lang} />
                <h3>{l.title}</h3>
                <p>{l.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Why lang={lang} />
      <Faq lang={lang} />
      <CtaBand />
    </>
  );
}
