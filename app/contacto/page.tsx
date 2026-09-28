import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import DemoForm from "@/components/DemoForm";
import { Faq } from "@/components/WhyFaq";

export const metadata: Metadata = pageMeta({
  title: "Pedir demo",
  description: "Pide una demo de localtraffic con la ubicación, el barrio o el municipio que te interese y te enseñamos lo que vemos en ella.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <>
      <DemoForm />
      <Faq schema={false} />
    </>
  );
}
