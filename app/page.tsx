import Hero from "@/components/Hero";
import LayerStory from "@/components/LayerStory";
import Solutions from "@/components/Solutions";
import ZoneStudy from "@/components/ZoneStudy";
import StudyTypes from "@/components/StudyTypes";
import { Why, Faq } from "@/components/WhyFaq";
import DemoForm from "@/components/DemoForm";
import AskBar from "@/components/AskBar";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

// TODO: replace with real coverage figures when available (municipios, transacciones/año, años de histórico).
const FACTS = [
  { value: "Tramo de calle", label: "nivel de detalle" },
  { value: "7 fuentes", label: "públicas y privadas" },
  { value: "A pie y en coche", label: "áreas de influencia" },
  { value: "Toda España", label: "cobertura" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <section className="facts" aria-label="Qué cubren nuestros datos">
          <dl className="facts__list wrap-wide">
            {FACTS.map((f) => (
              <div key={f.label} className="facts__item">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <LayerStory />
        <Solutions />
        <ZoneStudy />
        <div id="estudios">
          <StudyTypes />
        </div>
        <Why />
        <Faq />
        <DemoForm />
      </main>
      <SiteFooter />
      <AskBar />
    </>
  );
}
