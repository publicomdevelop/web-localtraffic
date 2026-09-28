import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { pageMeta } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site";
import Approach from "@/components/Approach";
import LayerStory from "@/components/LayerStory";
import Services from "@/components/Services";
import Campaigns from "@/components/Campaigns";
import StudyTypes from "@/components/StudyTypes";
import { Marquee, CtaBand } from "@/components/Bands";

export const metadata: Metadata = pageMeta({ description: SITE_DESCRIPTION, path: "/" });

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
