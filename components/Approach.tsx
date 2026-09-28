import Link from "next/link";
import { mulberry32 } from "@/lib/city/model";
import { route, type Lang } from "@/lib/i18n";

const ART = {
  es: { aria: "Muchas señales de datos se juntan en un punto de interpretación y salen como una sola decisión", data: "datos", reading: "interpretación", decision: "decisión" },
  en: { aria: "Many data signals come together at one point of interpretation and leave as a single decision", data: "data", reading: "interpretation", decision: "decision" },
};

/** Many thin data signals converge into one interpretation, then one decision. */
export function ConvergeArt({ lang = "es" }: { lang?: Lang }) {
  const t = ART[lang];
  const r = mulberry32(21);
  const tones = ["#8A92FF", "#ECEDF7", "#FF6B3D", "#3340F5"];
  const lines = Array.from({ length: 26 }, (_, i) => {
    const y0 = 20 + i * 12 + (r() - 0.5) * 8;
    const c1 = 120 + r() * 80;
    const tone = tones[i % tones.length];
    return { d: `M0 ${y0.toFixed(1)}C${c1.toFixed(1)} ${y0.toFixed(1)} ${(c1 + 60).toFixed(1)} 180 330 180`, tone, o: 0.3 + r() * 0.4 };
  });
  return (
    <svg viewBox="0 0 640 360" className="converge" role="img" aria-label={t.aria}>
      {lines.map((l, i) => (
        <path key={i} d={l.d} fill="none" stroke={l.tone} strokeOpacity={l.o} strokeWidth="1.2" className="flow" style={{ animationDelay: `${(i % 7) * 0.2}s` }} />
      ))}
      <circle cx="330" cy="180" r="34" fill="#18142C" stroke="#8A92FF" strokeOpacity=".6" />
      <circle cx="330" cy="180" r="34" fill="none" stroke="#8A92FF" className="pulse" />
      <text x="330" y="186" textAnchor="middle" className="converge__ih" fill="#ECEDF7">
        IH
      </text>
      <path d="M364 180H600" stroke="#3340F5" strokeWidth="5" strokeLinecap="round" />
      <path d="M364 180H600" stroke="#8A92FF" strokeWidth="2" strokeLinecap="round" className="flow flow--fast" />
      <path d="M590 170l14 10-14 10" fill="none" stroke="#8A92FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="20" y="352" className="art__label" fill="rgba(236,237,247,.5)">
        {t.data}
      </text>
      <text x="330" y="244" textAnchor="middle" className="art__label" fill="rgba(236,237,247,.7)">
        {t.reading}
      </text>
      <text x="600" y="214" textAnchor="end" className="art__label" fill="#8A92FF">
        {t.decision}
      </text>
    </svg>
  );
}

export default function Approach({ lang = "es" }: { lang?: Lang }) {
  const en = lang === "en";
  return (
    <section className="approach band--grid" aria-labelledby="approach-title">
      <div className="wrap approach__grid">
        <div>
          <h2 id="approach-title" className="approach__title">
            {en ? "Data doesn't make decisions. People do." : "Los datos no toman decisiones. Las personas, sí."}
          </h2>
          <p className="section-lede">
            {en ? (
              <>
                We work with all the data within our reach and interpret it with experience on the ground. We call it{" "}
                <strong>Human Intelligence</strong>.
              </>
            ) : (
              <>
                Trabajamos con todos los datos a nuestro alcance y los interpretamos con experiencia sobre el terreno. A
                eso lo llamamos <strong>Inteligencia Humana</strong>.
              </>
            )}
          </p>
          <Link className="link-arrow" href={route("approach", lang)}>
            {en ? "How we work" : "Cómo trabajamos"}
          </Link>
        </div>
        <ConvergeArt lang={lang} />
      </div>
    </section>
  );
}
