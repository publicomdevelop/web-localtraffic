import { notFound } from "next/navigation";
import ServicePage from "@/components/pages/ServicePage";
import { serviceMeta } from "@/lib/pageMeta";
import { getService, servicesFor } from "@/lib/services";

export function generateStaticParams() {
  return servicesFor("en").map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return serviceMeta(params.slug, "en");
}

export default function Page({ params }: { params: { slug: string } }) {
  const s = getService(params.slug, "en");
  if (!s) notFound();
  return <ServicePage service={s} lang="en" />;
}
