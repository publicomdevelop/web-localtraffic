import { notFound } from "next/navigation";
import ServicePage from "@/components/pages/ServicePage";
import { serviceMeta } from "@/lib/pageMeta";
import { getService, servicesFor } from "@/lib/services";

export function generateStaticParams() {
  return servicesFor("es").map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return serviceMeta(params.slug, "es");
}

export default function Page({ params }: { params: { slug: string } }) {
  const s = getService(params.slug, "es");
  if (!s) notFound();
  return <ServicePage service={s} lang="es" />;
}
