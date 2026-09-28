import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import SolutionArt from "@/components/illustrations/SolutionArt";
import { CtaBand, Marquee } from "@/components/Bands";

export const metadata: Metadata = pageMeta({
  title: "Campañas geolocalizadas",
  description:
    "Usamos datos de residentes, visitantes y origen del consumidor para decidir dónde y cuándo activar una campaña geolocalizada, y medimos después su efecto en visitas y consumo.",
  path: "/campanas",
});

const STAGES = [
  {
    title: "Entender",
    body: "Antes de invertir, sabemos dónde vive tu público, por dónde se mueve, a qué horas y de dónde sale el gasto que buscas.",
    art: "influence" as const,
  },
  {
    title: "Activar",
    body: "Llevamos la campaña a las zonas y los momentos con más potencial, en lugar de repartir el presupuesto por igual.",
    art: "campaign" as const,
  },
  {
    title: "Medir",
    body: "Comparamos visitas y consumo antes, durante y después de la campaña para saber qué ha funcionado y qué no.",
    art: "impact" as const,
  },
];

const TYPES = [
  { title: "Campañas geolocalizadas", body: "Mensajes dirigidos a quien vive, trabaja o pasa por las zonas que elegimos." },
  { title: "Publicidad exterior", body: "Ubicaciones con más paso del público que te interesa, no solo con más paso." },
  { title: "Dinamización comercial", body: "Acciones en los días y horas en que la zona tiene más afluencia." },
  { title: "Captación en origen", body: "Promociones en las áreas desde las que ya llegan tus clientes, o desde las que deberían llegar." },
];

export default function CampanasPage() {
  return (
    <>
      <PageHero
        title="Del análisis a la campaña."
        lede="Los mismos datos que explican una zona sirven para actuar en ella: decidimos dónde y cuándo activar una campaña y comprobamos después si ha funcionado."
        crumbs={[{ href: "/", label: "Inicio" }, { href: "/campanas", label: "Campañas" }]}
        art={<SolutionArt kind="campaign" />}
      />

      <section className="section" aria-label="Cómo lo hacemos">
        <div className="wrap stages">
          {STAGES.map((s, i) => (
            <article key={s.title} className={`stage${i % 2 ? " stage--flip" : ""}`}>
              <div className="stage__text">
                <h2 className="stage__title">{s.title}</h2>
                <p>{s.body}</p>
              </div>
              <div className="stage__art">
                <SolutionArt kind={s.art} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <Marquee />

      <section className="section band--layer" aria-labelledby="types-title">
        <div className="wrap split">
          <h2 id="types-title" className="section-title">
            Qué activamos.
          </h2>
          <dl className="includes includes--two">
            {TYPES.map((t) => (
              <div key={t.title} className="includes__item">
                <dt>{t.title}</dt>
                <dd>{t.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand title="¿Dónde activarías tu próxima campaña?" body="Te enseñamos qué zonas y qué momentos tienen más potencial para tu público." />
    </>
  );
}
