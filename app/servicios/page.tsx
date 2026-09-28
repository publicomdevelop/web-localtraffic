import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SolutionArt from "@/components/illustrations/SolutionArt";
import ZoneStudy from "@/components/ZoneStudy";
import { CtaBand } from "@/components/Bands";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = pageMeta({
  title: "Servicios: Tailored, Focus y On Demand",
  description:
    "Tres formas de analizar una zona con datos geoespaciales: Tailored (una ubicación en un periodo), Focus (seguimiento mensual de áreas comerciales) y On Demand (análisis a medida).",
  path: "/servicios",
});

const COMPARE: { label: string; values: [string, string, string] }[] = [
  { label: "Para qué", values: ["Una foto de una ubicación", "La evolución de una zona", "Una pregunta concreta"] },
  {
    label: "Área",
    values: ["Un área de influencia: a pie, en coche, radio o administrativa", "Una o varias áreas comerciales a medida", "La que haga falta"],
  },
  { label: "Periodo", values: ["Un periodo cerrado", "Mes a mes durante un año", "A medida"] },
  { label: "Entrega", values: ["Un informe", "Un informe cada mes", "Un análisis a medida"] },
  { label: "Tus propios datos", values: ["—", "—", "Sí, cruzados con los nuestros"] },
  { label: "Inteligencia Humana", values: ["Sí", "Sí", "Sí"] },
];

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        title="Tres formas de trabajar juntos."
        lede="Una foto, una evolución o una pregunta a medida. Las tres incluyen lo mismo que nos diferencia: un equipo que interpreta los datos y te dice qué significan."
        crumbs={[{ href: "/", label: "Inicio" }, { href: "/servicios", label: "Servicios" }]}
      />

      <section className="section" aria-label="Servicios">
        <div className="wrap service-rows">
          {SERVICES.map((s, i) => (
            <article key={s.slug} className={`service-row${i % 2 ? " service-row--flip" : ""}`}>
              <div className="service-row__text">
                <h2 className="service-row__name">{s.name}</h2>
                <p className="service-row__tagline">{s.tagline}</p>
                <p className="service-row__intro">{s.intro}</p>
                <p className="service-row__useful">
                  <span className="mono">Útil para</span> {s.useful}
                </p>
                <Link className="btn btn--ghost" href={`/servicios/${s.slug}`}>
                  Ver {s.name}
                </Link>
              </div>
              <div className="service-row__art">
                <SolutionArt kind={s.art} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section band--layer" aria-labelledby="compare-title">
        <div className="wrap">
          <h2 id="compare-title" className="section-title">
            Cuál encaja contigo.
          </h2>
          <div className="compare" role="region" aria-labelledby="compare-title" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Característica</span>
                  </th>
                  {SERVICES.map((s) => (
                    <th key={s.slug} scope="col">
                      <Link href={`/servicios/${s.slug}`}>{s.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
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

      <ZoneStudy />
      <CtaBand title="¿No sabes cuál necesitas?" body="Cuéntanos qué quieres decidir y te proponemos el análisis que encaja." />
    </>
  );
}
