import Link from "next/link";
import SolutionArt from "@/components/illustrations/SolutionArt";

export const FLOW = [
  { title: "Entender", body: "Dónde vive tu público, por dónde se mueve y dónde gasta." },
  { title: "Activar", body: "Campañas geolocalizadas en las zonas y momentos con más potencial." },
  { title: "Medir", body: "Qué ha cambiado en visitas y en consumo después de la campaña." },
];

export default function Campaigns() {
  return (
    <section className="campaigns" aria-labelledby="campaigns-title">
      <div className="wrap campaigns__grid">
        <div className="campaigns__text">
          <h2 id="campaigns-title" className="section-title">
            Del análisis a la campaña.
          </h2>
          <p className="section-lede">
            Los mismos datos que explican una zona sirven para actuar en ella. Los usamos para decidir dónde y cuándo
            activar una campaña, y para comprobar después si ha funcionado.
          </p>
          <ol className="flow-steps">
            {FLOW.map((f) => (
              <li key={f.title}>
                <span className="flow-steps__title">{f.title}</span>
                <span className="flow-steps__body">{f.body}</span>
              </li>
            ))}
          </ol>
          <Link className="link-arrow" href="/campanas">
            Cómo activamos campañas
          </Link>
        </div>
        <div className="campaigns__art">
          <SolutionArt kind="campaign" />
          <SolutionArt kind="impact" />
        </div>
      </div>
    </section>
  );
}
