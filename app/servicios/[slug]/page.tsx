import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import SolutionArt from "@/components/illustrations/SolutionArt";
import { CtaBand } from "@/components/Bands";
import { SERVICES, getService } from "@/lib/services";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  return s ? { title: s.name, description: `${s.tagline} ${s.intro}` } : {};
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();
  const others = SERVICES.filter((o) => o.slug !== s.slug);

  return (
    <>
      <PageHero
        title={s.name}
        lede={`${s.tagline} ${s.intro}`}
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/servicios", label: "Servicios" },
          { href: `/servicios/${s.slug}`, label: s.name },
        ]}
        art={<SolutionArt kind={s.art} />}
      />

      <section className="section" aria-labelledby="how-title">
        <div className="wrap split">
          <h2 id="how-title" className="section-title">
            Cómo funciona.
          </h2>
          <ol className="flow-steps flow-steps--large">
            {s.steps.map((st) => (
              <li key={st.title}>
                <span className="flow-steps__title">{st.title}</span>
                <span className="flow-steps__body">{st.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section band--layer" aria-labelledby="includes-title">
        <div className="wrap">
          <h2 id="includes-title" className="section-title">
            Qué incluye.
          </h2>
          <dl className="includes">
            {s.includes.map((i) => (
              <div key={i.title} className={`includes__item${i.title === "Inteligencia Humana" ? " includes__item--ih" : ""}`}>
                <dt>{i.title}</dt>
                <dd>{i.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="when-title">
        <div className="wrap split">
          <div>
            <h2 id="when-title" className="section-title">
              Cuándo tiene sentido.
            </h2>
            <ul className="when">
              {s.when.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <aside className="example" aria-label="Un ejemplo">
            <p className="mono example__label">Un ejemplo</p>
            <p className="example__text">{s.example}</p>
          </aside>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="others-title">
        <div className="wrap">
          <h2 id="others-title" className="others__title">
            Otras formas de trabajar juntos
          </h2>
          <ul className="others">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/servicios/${o.slug}`} className="others__link">
                  <span className="others__name">{o.name}</span>
                  <span className="others__tagline">{o.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={`¿Empezamos con ${s.name}?`} />
    </>
  );
}
