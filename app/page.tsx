import Hero from "@/components/Hero";
import Approach from "@/components/Approach";
import LayerStory from "@/components/LayerStory";
import Services from "@/components/Services";
import Campaigns from "@/components/Campaigns";
import StudyTypes from "@/components/StudyTypes";
import { Marquee, CtaBand } from "@/components/Bands";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Approach />
      <LayerStory />
      <Services />
      <Campaigns />
      <StudyTypes />
      <CtaBand />
    </>
  );
}
