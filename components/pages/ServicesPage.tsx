import Link from "next/link";
import PageHero from "@/components/PageHero";
import SolutionArt from "@/components/illustrations/SolutionArt";
import ZoneStudy from "@/components/ZoneStudy";
import { CtaBand } from "@/components/Bands";
import { servicesFor } from "@/lib/services";
import { route, servicePath, type Lang } from "@/lib/i18n";

type Row = { label: string; values: [string, string, string] };

const COPY = {
  es: {
    title: "Tres formas de trabajar juntos.",
    lede: "Una foto, una evolución o una pregunta a medida. Las tres incluyen lo mismo que nos diferencia: un equipo que interpreta los datos y te dice qué significan.",
    home: "Inicio",
    here: "Servicios",
    useful: "Útil para",
    see: (n: string) => `Ver ${n}`,
    compareTitle: "Cuál encaja contigo.",
    feature: "Característica",
    compare: [
      { label: "Para qué", values: ["Una foto de una ubicación", "La evolución de una zona", "Una pregunta concreta"] },
      {
        label: "Área",
        values: ["Un área de influencia: a pie, en coche, radio o administrativa", "Una o varias áreas comerciales a medida", "La que haga falta"],
      },
      { label: "Periodo", values: ["Un periodo cerrado", "Mes a mes durante un año", "A medida"] },
      { label: "Entrega", values: ["Un informe", "Un informe cada mes", "Un análisis a medida"] },
      { label: "Tus propios datos", values: ["—", "—", "Sí, cruzados con los nuestros"] },
      { label: "Inteligencia Humana", values: ["Sí", "Sí", "Sí"] },
    ] as Row[],
    ctaTitle: "¿No sabes cuál necesitas?",
    ctaBody: "Cuéntanos qué quieres decidir y te proponemos el análisis que encaja.",
  },
  en: {
    title: "Three ways to work together.",
    lede: "A snapshot, a trend or a tailor-made question. All three include what sets us apart: a team that interprets the data and tells you what it means.",
    home: "Home",
    here: "Services",
    useful: "Useful for",
    see: (n: string) => `See ${n}`,
    compareTitle: "Which one fits you.",
    feature: "Feature",
    compare: [
      { label: "What for", values: ["A snapshot of one location", "How an area evolves", "A specific question"] },
      {
        label: "Area",
        values: ["One catchment area: on foot, by car, radius or administrative", "One or more shopping areas drawn to measure", "Whatever it takes"],
      },
      { label: "Period", values: ["A fixed period", "Month by month over a year", "To measure"] },
      { label: "Delivery", values: ["One report", "A report every month", "A tailor-made analysis"] },
      { label: "Your own data", values: ["—", "—", "Yes, combined with ours"] },
      { label: "Human Intelligence", values: ["Yes", "Yes", "Yes"] },
    ] as Row[],
    ctaTitle: "Not sure which one you need?",
    ctaBody: "Tell us what you want to decide and we'll suggest the analysis that fits.",
  },
};

export default function ServicesPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const services = servicesFor(lang);
  return (
    <>
      <PageHero
        lang={lang}
        title={t.title}
        lede={t.lede}
        crumbs={[
          { href: route("home", lang), label: t.home },
          { href: route("services", lang), label: t.here },
        ]}
      />

      <section className="section" aria-label={t.here}>
        <div className="wrap service-rows">
          {services.map((s, i) => (
            <article key={s.slug} className={`service-row${i % 2 ? " service-row--flip" : ""}`}>
              <div className="service-row__text">
                <h2 className="service-row__name">{s.name}</h2>
                <p className="service-row__tagline">{s.tagline}</p>
                <p className="service-row__intro">{s.intro}</p>
                <p className="service-row__useful">
                  <span className="mono">{t.useful}</span> {s.useful}
                </p>
                <Link className="btn btn--ghost" href={servicePath(s.slug, lang)}>
                  {t.see(s.name)}
                </Link>
              </div>
              <div className="service-row__art">
                <SolutionArt kind={s.art} lang={lang} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section band--layer" aria-labelledby="compare-title">
        <div className="wrap">
          <h2 id="compare-title" className="section-title">
            {t.compareTitle}
          </h2>
          <div className="compare" role="region" aria-labelledby="compare-title" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">{t.feature}</span>
                  </th>
                  {services.map((s) => (
                    <th key={s.slug} scope="col">
                      <Link href={servicePath(s.slug, lang)}>{s.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.compare.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ZoneStudy lang={lang} />
      <CtaBand title={t.ctaTitle} body={t.ctaBody} />
    </>
  );
}
