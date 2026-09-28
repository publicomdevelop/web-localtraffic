import InView from "@/components/InView";

type Study = { title: string; body: string; chart: React.ReactNode };

const line = (vals: number[], w = 220, h = 70) =>
  vals.map((v, i) => `${i ? "L" : "M"}${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - v * h).toFixed(1)}`).join("");

const STUDIES: Study[] = [
  {
    title: "¿De dónde viene quien compra aquí?",
    body: "Qué áreas aportan visitantes y gasto, y cuánto pesa el cliente de fuera.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[1, 0.7, 0.45, 0.3, 0.18].map((v, i) => (
          <rect key={i} className="chart-hbar" style={{ transitionDelay: `${i * 70}ms` }} x="0" y={i * 14} width={v * 220} height="9" rx="2" fill="#8A92FF" fillOpacity={1 - i * 0.15} />
        ))}
      </svg>
    ),
  },
  {
    title: "¿Tiene potencial esta ubicación?",
    body: "Cómo es su entorno frente a otras opciones antes de tomar la decisión.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        <path d="M20 64a90 90 0 0 1 180 0" fill="none" stroke="#ECEDF7" strokeOpacity=".12" strokeWidth="10" strokeLinecap="round" />
        <path className="chart-line" pathLength={1} d="M20 64a90 90 0 0 1 150-55" fill="none" stroke="#FF6B3D" strokeWidth="10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "¿Cuánta gente atrajo el evento?",
    body: "Festivales, ferias o campañas comparados con un periodo normal: visitantes, origen y estancia.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[0.3, 0.32, 0.28, 0.34, 0.95, 0.8, 0.33, 0.3].map((v, i) => (
          <rect key={i} className="chart-bar" style={{ transitionDelay: `${i * 60}ms` }} x={i * 28} y={70 - v * 70} width="20" height={v * 70} rx="2" fill={i === 4 || i === 5 ? "#FF6B3D" : "#3340F5"} />
        ))}
      </svg>
    ),
  },
  {
    title: "¿Qué horas y qué días mueven la zona?",
    body: "Cuándo llega la gente, cuánto se queda y qué momentos conviene aprovechar para abrir, atender o comunicar.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[0.35, 0.3, 0.32, 0.38, 0.55, 0.95, 0.6].map((v, i) => (
          <rect key={i} className="chart-bar" style={{ transitionDelay: `${i * 60}ms` }} x={i * 32} y={70 - v * 70} width="24" height={v * 70} rx="2" fill={i === 5 ? "#8A92FF" : "#3340F5"} fillOpacity={i === 5 ? 1 : 0.7} />
        ))}
      </svg>
    ),
  },
];

export default function StudyTypes() {
  return (
    <section className="studies" aria-labelledby="studies-title">
      <div className="wrap">
        <h2 id="studies-title" className="section-title">
          Preguntas que respondemos
        </h2>
        <ul className="studies__list">
          {STUDIES.map((s) => (
            <InView as="li" key={s.title} className="study">
              <h3 className="study__title">{s.title}</h3>
              <p className="study__body">{s.body}</p>
              <div className="study__chart">{s.chart}</div>
            </InView>
          ))}
        </ul>
      </div>
    </section>
  );
}
