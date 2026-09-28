import InView from "@/components/InView";
import type { Lang } from "@/lib/i18n";

type Study = { title: Record<Lang, string>; body: Record<Lang, string>; chart: React.ReactNode };

const line = (vals: number[], w = 220, h = 70) =>
  vals.map((v, i) => `${i ? "L" : "M"}${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - v * h).toFixed(1)}`).join("");

const STUDIES: Study[] = [
  {
    title: { es: "¿De dónde viene quien compra aquí?", en: "Where do the people who buy here come from?" },
    body: {
      es: "Qué áreas aportan visitantes y gasto, y cuánto pesa el cliente de fuera.",
      en: "Which areas bring in visitors and spending, and how much outside customers weigh.",
    },
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[1, 0.7, 0.45, 0.3, 0.18].map((v, i) => (
          <rect key={i} className="chart-hbar" style={{ transitionDelay: `${i * 70}ms` }} x="0" y={i * 14} width={v * 220} height="9" rx="2" fill="#8A92FF" fillOpacity={1 - i * 0.15} />
        ))}
      </svg>
    ),
  },
  {
    title: { es: "¿Tiene potencial esta ubicación?", en: "Does this location have potential?" },
    body: {
      es: "Cómo es su entorno frente a otras opciones antes de tomar la decisión.",
      en: "How its surroundings compare with other options before you decide.",
    },
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        <path d="M20 64a90 90 0 0 1 180 0" fill="none" stroke="#ECEDF7" strokeOpacity=".12" strokeWidth="10" strokeLinecap="round" />
        <path className="chart-line" pathLength={1} d="M20 64a90 90 0 0 1 150-55" fill="none" stroke="#FF6B3D" strokeWidth="10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: { es: "¿Cuánta gente atrajo el evento?", en: "How many people did the event bring in?" },
    body: {
      es: "Festivales, ferias o campañas comparados con un periodo normal: visitantes, origen y estancia.",
      en: "Festivals, fairs or campaigns compared with a normal period: visitors, origin and length of stay.",
    },
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[0.3, 0.32, 0.28, 0.34, 0.95, 0.8, 0.33, 0.3].map((v, i) => (
          <rect key={i} className="chart-bar" style={{ transitionDelay: `${i * 60}ms` }} x={i * 28} y={70 - v * 70} width="20" height={v * 70} rx="2" fill={i === 4 || i === 5 ? "#FF6B3D" : "#3340F5"} />
        ))}
      </svg>
    ),
  },
  {
    title: { es: "¿Qué horas y qué días mueven la zona?", en: "Which hours and days drive the area?" },
    body: {
      es: "Cuándo llega la gente, cuánto se queda y qué momentos conviene aprovechar para abrir, atender o comunicar.",
      en: "When people arrive, how long they stay and which moments are worth using to open, serve or advertise.",
    },
    chart: (
      <svg viewBox="0 0 220 70" aria-hidden="true">
        {[0.35, 0.3, 0.32, 0.38, 0.55, 0.95, 0.6].map((v, i) => (
          <rect key={i} className="chart-bar" style={{ transitionDelay: `${i * 60}ms` }} x={i * 32} y={70 - v * 70} width="24" height={v * 70} rx="2" fill={i === 5 ? "#8A92FF" : "#3340F5"} fillOpacity={i === 5 ? 1 : 0.7} />
        ))}
      </svg>
    ),
  },
];

export default function StudyTypes({ lang = "es" }: { lang?: Lang }) {
  return (
    <section className="studies" aria-labelledby="studies-title">
      <div className="wrap">
        <h2 id="studies-title" className="section-title">
          {lang === "en" ? "Questions we answer" : "Preguntas que respondemos"}
        </h2>
        <ul className="studies__list">
          {STUDIES.map((s) => (
            <InView as="li" key={s.title.es} className="study">
              <h3 className="study__title">{s.title[lang]}</h3>
              <p className="study__body">{s.body[lang]}</p>
              <div className="study__chart">{s.chart}</div>
            </InView>
          ))}
        </ul>
      </div>
    </section>
  );
}
