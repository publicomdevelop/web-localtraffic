import Link from "next/link";
import SolutionArt from "@/components/illustrations/SolutionArt";
import { route, type Lang } from "@/lib/i18n";

const COPY = {
  es: {
    title: "Del análisis a la campaña.",
    lede: "Los mismos datos que explican una zona sirven para actuar en ella. Los usamos para decidir dónde y cuándo activar una campaña, y para comprobar después si ha funcionado.",
    more: "Cómo activamos campañas",
    flow: [
      { title: "Entender", body: "Dónde vive tu público, por dónde se mueve y dónde gasta." },
      { title: "Activar", body: "Campañas geolocalizadas en las zonas y momentos con más potencial." },
      { title: "Medir", body: "Qué ha cambiado en visitas y en consumo después de la campaña." },
    ],
  },
  en: {
    title: "From analysis to campaign.",
    lede: "The same data that explains an area is what you act on. We use it to decide where and when to launch a campaign, and to check afterwards whether it worked.",
    more: "How we run campaigns",
    flow: [
      { title: "Understand", body: "Where your audience lives, where it moves and where it spends." },
      { title: "Activate", body: "Geotargeted campaigns in the areas and moments with the most potential." },
      { title: "Measure", body: "What changed in visits and spending after the campaign." },
    ],
  },
};

export default function Campaigns({ lang = "es" }: { lang?: Lang }) {
  const t = COPY[lang];
  return (
    <section className="campaigns" aria-labelledby="campaigns-title">
      <div className="wrap campaigns__grid">
        <div className="campaigns__text">
          <h2 id="campaigns-title" className="section-title">
            {t.title}
          </h2>
          <p className="section-lede">
            {t.lede}
          </p>
          <ol className="flow-steps">
            {t.flow.map((f) => (
              <li key={f.title}>
                <span className="flow-steps__title">{f.title}</span>
                <span className="flow-steps__body">{f.body}</span>
              </li>
            ))}
          </ol>
          <Link className="link-arrow" href={route("campaigns", lang)}>
            {t.more}
          </Link>
        </div>
        <div className="campaigns__art">
          <SolutionArt kind="campaign" lang={lang} />
          <SolutionArt kind="impact" lang={lang} />
        </div>
      </div>
    </section>
  );
}
