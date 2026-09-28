const REASONS = [
  {
    title: "Consumo real, no estimado",
    body: "Trabajamos con transacciones con tarjeta en comercios y venta física, no con encuestas ni modelos teóricos.",
  },
  {
    title: "Al detalle de la calle",
    body: "Los datos llegan a tramo de calle, no se quedan en el municipio o el código postal.",
  },
  {
    title: "Todo en el mismo mapa",
    body: "Fuentes públicas y privadas cruzadas, sin tener que juntar hojas de cálculo.",
  },
  {
    title: "Analistas, no solo un panel",
    body: "Cada estudio lo prepara una persona que conoce el territorio y te explica qué significa cada dato.",
  },
  {
    title: "Informes que se entienden",
    body: "Pensados para presentarlos a dirección o en un pleno, no solo para expertos en datos.",
  },
  {
    title: "Datos agregados y anónimos",
    body: "Nunca trabajamos con información de personas concretas.",
  },
];

const FAQ = [
  {
    q: "¿De dónde salen los datos de consumo?",
    a: "De transacciones con tarjeta en comercios y venta física, agregadas por zona, categoría de gasto y periodo.",
  },
  {
    q: "¿Son datos personales?",
    a: "No. Todos los datos están agregados y anonimizados: no se puede identificar a ninguna persona.",
  },
  {
    q: "¿Qué zonas podéis analizar?",
    a: "Cualquier calle, barrio o municipio de España. En la demo lo vemos con la zona que te interese.",
  },
  {
    q: "¿Tengo que instalar algo?",
    a: "No. Recibes un informe y, si lo necesitas, acceso a un panel con tus zonas.",
  },
  {
    q: "¿Trabajáis con administraciones públicas?",
    a: "Sí. Ayuntamientos, cámaras de comercio y asociaciones de comerciantes nos encargan estudios para entender sus áreas comerciales y medir el efecto de sus acciones.",
  },
  {
    q: "¿Cómo es la demo?",
    a: "Una videollamada en la que vemos datos reales de la zona que nos digas y hablamos de qué necesitas decidir.",
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

export function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-title">
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
