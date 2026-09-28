import JsonLd from "@/components/JsonLd";

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

export function Why() {
  return (
    <section className="why" aria-labelledby="why-title">
      <div className="wrap why__grid">
        <h2 id="why-title" className="section-title">
          Por qué localtraffic
        </h2>
        <dl className="why__list">
          {REASONS.map((r) => (
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

export function Faq({ schema = true }: { schema?: boolean }) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="faq" aria-labelledby="faq-title">
      {schema && <JsonLd data={faqLd} />}
      <div className="wrap faq__grid">
        <h2 id="faq-title" className="section-title">
          Preguntas frecuentes
        </h2>
        <div className="faq__list">
          {FAQ.map((f) => (
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
