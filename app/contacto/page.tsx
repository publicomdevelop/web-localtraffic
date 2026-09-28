import type { Metadata } from "next";
import DemoForm from "@/components/DemoForm";
import { Faq } from "@/components/WhyFaq";

export const metadata: Metadata = {
  title: "Pedir demo",
  description: "Pide una demo con la zona que te interese y te enseñamos lo que vemos en ella.",
};

export default function ContactoPage() {
  return (
    <>
      <DemoForm />
      <Faq />
    </>
  );
}
