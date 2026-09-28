"use client";

import { useState } from "react";
import Link from "next/link";
import SolutionArt from "@/components/illustrations/SolutionArt";
import { servicesFor } from "@/lib/services";
import { servicePath } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

const COPY = {
  es: {
    title: "Tres formas de trabajar juntos.",
    lede: "Todas incluyen lo mismo que nos diferencia: un equipo que interpreta los datos y te dice qué significan.",
    useful: "Útil para",
    example: "Un ejemplo",
    more: (n: string) => `Ver ${n} en detalle`,
  },
  en: {
    title: "Three ways to work together.",
    lede: "All of them include what sets us apart: a team that interprets the data and tells you what it means.",
    useful: "Useful for",
    example: "An example",
    more: (n: string) => `See ${n} in detail`,
  },
};

export default function Services() {
  const lang = useLang();
  const c = COPY[lang];
  const SERVICES = servicesFor(lang);
  const [active, setActive] = useState(0);
  const current = SERVICES[active];

  const detail = (
    <>
      <SolutionArt kind={current.art} lang={lang} />
      <div className="services__text">
        <p>{current.body}</p>
        <dl className="services__meta">
          <div>
            <dt>{c.useful}</dt>
            <dd>{current.useful}</dd>
          </div>
          <div>
            <dt>{c.example}</dt>
            <dd>{current.example}</dd>
          </div>
        </dl>
        <Link className="link-arrow" href={servicePath(current.slug, lang)}>
          {c.more(current.name)}
        </Link>
      </div>
    </>
  );

  return (
    <section className="services band--layer" aria-labelledby="services-title">
      <div className="wrap">
        <h2 id="services-title" className="section-title">
          {c.title}
        </h2>
        <p className="section-lede">
          {c.lede}
        </p>

        <div className="services__panel">
          <ul className="services__list">
            {SERVICES.map((s, i) => (
              <li key={s.slug}>
                <button
                  type="button"
                  className="service"
                  aria-pressed={i === active}
                  aria-controls="service-detail"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="service__name">{s.name}</span>
                  <span className="service__tagline">{s.tagline}</span>
                </button>
                {i === active && (
                  <div className="services__detail services__detail--inline" key={s.slug}>
                    {detail}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop: detail panel beside the list. Phones use the inline copy under the tapped service. */}
          <div id="service-detail" className="services__detail services__detail--side" key={current.slug} aria-live="polite">
            {detail}
          </div>
        </div>
      </div>
    </section>
  );
}
