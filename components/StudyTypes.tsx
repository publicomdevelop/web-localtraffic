import InView from "@/components/InView";

type Study = { title: string; body: string; chart: React.ReactNode };

const line = (vals: number[], w = 220, h = 70) =>
  vals.map((v, i) => `${i ? "L" : "M"}${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - v * h).toFixed(1)}`).join("");

const STUDIES: Study[] = [
  {
    title: "Impacto de una peatonalización",
    body: "Peatones, vehículos y gasto antes y después del cambio, en la calle y en las de alrededor.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        <path className="chart-line" pathLength={1} d={line([0.3, 0.32, 0.29, 0.31, 0.3, 0.55, 0.68, 0.72, 0.75, 0.74])} stroke="#8A92FF" />
        <path className="chart-line chart-line--late" pathLength={1} d={line([0.75, 0.72, 0.74, 0.73, 0.7, 0.35, 0.22, 0.18, 0.17, 0.16])} stroke="#ECEDF7" strokeOpacity=".6" />
        <line x1="110" x2="110" y1="0" y2="70" stroke="#ECEDF7" strokeOpacity=".25" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    title: "Impacto de un evento",
    body: "Festivales, ferias o campañas comparados con un periodo normal: visitantes, origen y gasto.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[0.3, 0.32, 0.28, 0.34, 0.95, 0.8, 0.33, 0.3].map((v, i) => (
          <rect key={i} className="chart-bar" style={{ transitionDelay: `${i * 60}ms` }} x={i * 28} y={70 - v * 70} width="20" height={v * 70} rx="2" fill={i === 4 || i === 5 ? "#FF6B3D" : "#3340F5"} />
        ))}
      </svg>
    ),
  },
  {
    title: "Origen de los visitantes",
    body: "De qué municipios y barrios llegan, cuánto se quedan y cuánto gastan según su procedencia.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[1, 0.7, 0.45, 0.3, 0.18].map((v, i) => (
          <rect key={i} className="chart-hbar" style={{ transitionDelay: `${i * 70}ms` }} x="0" y={i * 14} width={v * 220} height="9" rx="2" fill="#8A92FF" fillOpacity={1 - i * 0.15} />
        ))}
      </svg>
    ),
  },
  {
    title: "Potencial de una ubicación",
    body: "Qué puede facturar un local según el gasto, el tráfico y la competencia de su zona.",
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        <path d="M20 64a90 90 0 0 1 180 0" fill="none" stroke="#ECEDF7" strokeOpacity=".12" strokeWidth="10" strokeLinecap="round" />
        <path className="chart-line" pathLength={1} d="M20 64a90 90 0 0 1 150-55" fill="none" stroke="#FF6B3D" strokeWidth="10" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function StudyTypes() {
  return (
    <section className="studies" aria-labelledby="studies-title">
      <div className="wrap">
        <h2 id="studies-title" className="section-title">
          Estudios que hacemos
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
