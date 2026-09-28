import PageHero from "@/components/PageHero";
import SolutionArt from "@/components/illustrations/SolutionArt";
import { CtaBand, Marquee } from "@/components/Bands";
import { route, type Lang } from "@/lib/i18n";

const COPY = {
  es: {
    title: "Del análisis a la campaña.",
    lede: "Los mismos datos que explican una zona sirven para actuar en ella: decidimos dónde y cuándo activar una campaña y comprobamos después si ha funcionado.",
    home: "Inicio",
    here: "Campañas",
    how: "Cómo lo hacemos",
    stages: [
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
    ],
    typesTitle: "Qué activamos.",
    types: [
      { title: "Campañas geolocalizadas", body: "Mensajes dirigidos a quien vive, trabaja o pasa por las zonas que elegimos." },
      { title: "Publicidad exterior", body: "Ubicaciones con más paso del público que te interesa, no solo con más paso." },
      { title: "Dinamización comercial", body: "Acciones en los días y horas en que la zona tiene más afluencia." },
      { title: "Captación en origen", body: "Promociones en las áreas desde las que ya llegan tus clientes, o desde las que deberían llegar." },
    ],
    ctaTitle: "¿Dónde activarías tu próxima campaña?",
    ctaBody: "Te enseñamos qué zonas y qué momentos tienen más potencial para tu público.",
  },
  en: {
    title: "From analysis to campaign.",
    lede: "The same data that explains an area is what you act on: we decide where and when to launch a campaign, and check afterwards whether it worked.",
    home: "Home",
    here: "Campaigns",
    how: "How we do it",
    stages: [
      {
        title: "Understand",
        body: "Before investing, we know where your audience lives, where it moves, at what times and where the spending you're after comes from.",
        art: "influence" as const,
      },
      {
        title: "Activate",
        body: "We take the campaign to the areas and moments with the most potential, instead of spreading the budget evenly.",
        art: "campaign" as const,
      },
      {
        title: "Measure",
        body: "We compare visits and spending before, during and after the campaign to know what worked and what didn't.",
        art: "impact" as const,
      },
    ],
    typesTitle: "What we activate.",
    types: [
      { title: "Geotargeted campaigns", body: "Messages aimed at people who live in, work in or pass through the areas we choose." },
      { title: "Outdoor advertising", body: "Sites with the most footfall from the audience you care about, not just the most footfall." },
      { title: "Retail activation", body: "Actions on the days and at the hours when the area is busiest." },
      { title: "Reaching customers at source", body: "Promotions in the areas your customers already come from, or the ones they should come from." },
    ],
    ctaTitle: "Where would you run your next campaign?",
    ctaBody: "We'll show you which areas and moments have the most potential for your audience.",
  },
};

export default function CampaignsPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <>
      <PageHero
        lang={lang}
        title={t.title}
        lede={t.lede}
        crumbs={[
          { href: route("home", lang), label: t.home },
          { href: route("campaigns", lang), label: t.here },
        ]}
        art={<SolutionArt kind="campaign" lang={lang} />}
      />

      <section className="section" aria-label={t.how}>
        <div className="wrap stages">
          {t.stages.map((s, i) => (
            <article key={s.title} className={`stage${i % 2 ? " stage--flip" : ""}`}>
              <div className="stage__text">
                <h2 className="stage__title">{s.title}</h2>
                <p>{s.body}</p>
              </div>
              <div className="stage__art">
                <SolutionArt kind={s.art} lang={lang} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <Marquee />

      <section className="section band--layer" aria-labelledby="types-title">
        <div className="wrap split">
          <h2 id="types-title" className="section-title">
            {t.typesTitle}
          </h2>
          <dl className="includes includes--two">
            {t.types.map((x) => (
              <div key={x.title} className="includes__item">
                <dt>{x.title}</dt>
                <dd>{x.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand title={t.ctaTitle} body={t.ctaBody} />
    </>
  );
}
