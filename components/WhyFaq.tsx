import JsonLd from "@/components/JsonLd";
import type { Lang } from "@/lib/i18n";

const REASONS = [
  {
    title: "Interpretamos, no solo medimos",
    body: "Cada análisis llega con una lectura clara: qué está pasando, por qué y qué te recomendamos hacer.",
  },
  {
    title: "Muchas fuentes, una respuesta",
    body: "Cruzamos datos públicos y privados para no depender de una sola mirada.",
  },
  {
    title: "Experiencia sobre el terreno",
    body: "Conocemos cómo funciona el comercio local y cómo se mueve una ciudad. Eso no sale en ningún dato.",
  },
  {
    title: "Del análisis a la acción",
    body: "Usamos los mismos datos para activar campañas y medir su efecto.",
  },
  {
    title: "Informes que se entienden",
    body: "Pensados para presentarlos y decidir, no solo para expertos en datos.",
  },
  {
    title: "Datos agregados y anónimos",
    body: "Nunca trabajamos con información de personas concretas.",
  },
];

export const FAQ = [
  {
    q: "¿Sois una herramienta?",
    a: "No. Somos una consultoría: analizamos los datos por ti y te entregamos conclusiones y recomendaciones, no un programa que tengas que aprender a usar.",
  },
  {
    q: "¿Qué es la Inteligencia Humana?",
    a: "Es la parte que no hace ningún algoritmo: interpretar los datos con experiencia sobre el terreno y convertirlos en decisiones.",
  },
  {
    q: "¿Qué diferencia hay entre Tailored, Focus y On Demand?",
    a: "Tailored es una foto de una ubicación en un periodo. Focus sigue una o varias zonas mes a mes. On Demand es un análisis a medida para una pregunta concreta.",
  },
  {
    q: "¿Son datos personales?",
    a: "No. Todos los datos están agregados y anonimizados: no se puede identificar a ninguna persona.",
  },
  {
    q: "¿Podéis usar mis propios datos?",
    a: "Sí. En los análisis On Demand podemos cruzar tus datos con los nuestros.",
  },
  {
    q: "¿Cómo es la demo?",
    a: "Te enseñamos un análisis de la zona que nos digas y vemos qué servicio encaja con lo que necesitas decidir.",
  },
];

const REASONS_EN = [
  {
    title: "We interpret, not just measure",
    body: "Every analysis comes with a clear reading: what is happening, why and what we recommend you do.",
  },
  {
    title: "Many sources, one answer",
    body: "We combine public and private data so you never rely on a single view.",
  },
  {
    title: "Experience on the ground",
    body: "We know how local retail works and how a town moves. That doesn't show up in any dataset.",
  },
  {
    title: "From analysis to action",
    body: "We use the same data to launch campaigns and measure their effect.",
  },
  {
    title: "Reports people understand",
    body: "Made to present and decide on, not only for data experts.",
  },
  {
    title: "Aggregated, anonymous data",
    body: "We never work with information about specific individuals.",
  },
];

export const FAQ_EN = [
  {
    q: "Do I need to learn a tool?",
    a: "No. We analyse the data for you and hand you conclusions and recommendations, not software you have to learn.",
  },
  {
    q: "What is Human Intelligence?",
    a: "It is the part no algorithm does: interpreting the data with experience on the ground and turning it into decisions.",
  },
  {
    q: "What's the difference between Tailored, Focus and On Demand?",
    a: "Tailored is a snapshot of one location over a period. Focus follows one or more areas month by month. On Demand is a tailor-made analysis for a specific question.",
  },
  {
    q: "Is this personal data?",
    a: "No. All data is aggregated and anonymised: no individual can be identified.",
  },
  {
    q: "Can you use my own data?",
    a: "Yes. In On Demand analyses we can combine your data with ours.",
  },
  {
    q: "What does the demo look like?",
    a: "We show you an analysis of the area you choose and work out which service fits the decision you need to make.",
  },
];

const faqFor = (lang: Lang) => (lang === "en" ? FAQ_EN : FAQ);

export function Why({ lang = "es" }: { lang?: Lang }) {
  const reasons = lang === "en" ? REASONS_EN : REASONS;
  return (
    <section className="why" aria-labelledby="why-title">
      <div className="wrap why__grid">
        <h2 id="why-title" className="section-title">
          {lang === "en" ? "Why localtraffic" : "Por qué localtraffic"}
        </h2>
        <dl className="why__list">
          {reasons.map((r) => (
            <div key={r.title} className="why__item">
              <dt>{r.title}</dt>
              <dd>{r.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Faq({ schema = true, lang = "es" }: { schema?: boolean; lang?: Lang }) {
  const faq = faqFor(lang);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang === "en" ? "en" : "es",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="faq" aria-labelledby="faq-title">
      {schema && <JsonLd data={faqLd} />}
      <div className="wrap faq__grid">
        <h2 id="faq-title" className="section-title">
          {lang === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}
        </h2>
        <div className="faq__list">
          {faq.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
