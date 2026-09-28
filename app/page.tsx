import Hero from "@/components/Hero";
import Approach from "@/components/Approach";
import LayerStory from "@/components/LayerStory";
import Services from "@/components/Services";
import Campaigns from "@/components/Campaigns";
import ZoneStudy from "@/components/ZoneStudy";
import StudyTypes from "@/components/StudyTypes";
import { Why, Faq } from "@/components/WhyFaq";
import DemoForm from "@/components/DemoForm";
import AskBar from "@/components/AskBar";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Approach />
        <LayerStory />
        <Services />
        <Campaigns />
        <ZoneStudy />
        <StudyTypes />
        <Why />
        <Faq />
        <DemoForm />
      </main>
      <SiteFooter />
      <AskBar />
    </>
  );
}
