import Hero from "@/components/Hero";
import Approach from "@/components/Approach";
import LayerStory from "@/components/LayerStory";
import Services from "@/components/Services";
import Campaigns from "@/components/Campaigns";
import StudyTypes from "@/components/StudyTypes";
import SpendOrigin from "@/components/SpendOrigin";
import { Marquee, CtaBand } from "@/components/Bands";
import type { Lang } from "@/lib/i18n";

export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero />
      <Marquee />
      <SpendOrigin lang={lang} />
      <Approach lang={lang} />
      <LayerStory />
      <Services />
      <Campaigns lang={lang} />
      <StudyTypes lang={lang} />
      <CtaBand />
    </>
  );
}
