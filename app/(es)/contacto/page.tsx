import DemoForm from "@/components/DemoForm";
import { Faq } from "@/components/WhyFaq";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("contact", "es");

export default function Page() {
  return (
    <>
      <DemoForm />
      <Faq schema={false} lang="es" />
    </>
  );
}
