import Link from "next/link";
import PageHero from "@/components/PageHero";
import SolutionArt from "@/components/illustrations/SolutionArt";
import JsonLd from "@/components/JsonLd";
import { CtaBand } from "@/components/Bands";
import { IH_TITLES, servicesFor, type ServiceInfo } from "@/lib/services";
import { ORG_ID } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { route, servicePath, type Lang } from "@/lib/i18n";

const COPY = {
  es: {
    home: "Inicio",
    services: "Servicios",
    how: "Cómo funciona.",
    includes: "Qué incluye.",
    when: "Cuándo tiene sentido.",
    example: "Un ejemplo",
    others: "Otras formas de trabajar juntos",
    start: (n: string) => `¿Empezamos con ${n}?`,
    catalog: (n: string) => `Qué incluye ${n}`,
    country: "España",
  },
  en: {
    home: "Home",
    services: "Services",
    how: "How it works.",
    includes: "What's included.",
    when: "When it makes sense.",
    example: "An example",
    others: "Other ways to work together",
    start: (n: string) => `Shall we start with ${n}?`,
    catalog: (n: string) => `What ${n} includes`,
    country: "Spain",
  },
};

export default function ServicePage({ service: s, lang }: { service: ServiceInfo; lang: Lang }) {
  const t = COPY[lang];
  const others = servicesFor(lang).filter((o) => o.slug !== s.slug);
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${s.name} · localtraffic`,
    serviceType: s.tagline,
    description: s.intro,
    url: `${SITE_URL}${servicePath(s.slug, lang)}`,
    inLanguage: lang,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: t.country },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.catalog(s.name),
      itemListElement: s.includes.map((i) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: i.title, description: i.body },
      })),
    },
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <PageHero
        lang={lang}
        title={s.name}
        lede={`${s.tagline} ${s.intro}`}
        crumbs={[
          { href: route("home", lang), label: t.home },
          { href: route("services", lang), label: t.services },
          { href: servicePath(s.slug, lang), label: s.name },
        ]}
        art={<SolutionArt kind={s.art} lang={lang} />}
      />

      <section className="section" aria-labelledby="how-title">
        <div className="wrap split">
          <h2 id="how-title" className="section-title">
            {t.how}
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
            {t.includes}
          </h2>
          <dl className="includes">
            {s.includes.map((i) => (
              <div key={i.title} className={`includes__item${IH_TITLES.includes(i.title) ? " includes__item--ih" : ""}`}>
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
              {t.when}
            </h2>
            <ul className="when">
              {s.when.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <aside className="example" aria-label={t.example}>
            <p className="mono example__label">{t.example}</p>
            <p className="example__text">{s.example}</p>
          </aside>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="others-title">
        <div className="wrap">
          <h2 id="others-title" className="others__title">
            {t.others}
          </h2>
          <ul className="others">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={servicePath(o.slug, lang)} className="others__link">
                  <span className="others__name">{o.name}</span>
                  <span className="others__tagline">{o.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={t.start(s.name)} />
    </>
  );
}
