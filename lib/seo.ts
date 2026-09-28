import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT, SOCIAL_URLS } from "@/lib/site";
import { languageAlternates, type Lang } from "@/lib/i18n";

// Share image served by app/og/[lang] (a fixed URL; file-based images inside route groups get hashed names).
const OG_IMAGE = { url: "/og/es", width: 1200, height: 630, alt: "localtraffic · Datos que cambian decisiones" };

/** Title, description, canonical, hreflang and Open Graph for one page. */
export function pageMeta({
  title,
  description,
  lang = "es",
  paths,
}: {
  title?: string;
  description: string;
  lang?: Lang;
  /** The page's URL in each language. */
  paths: { es: string; en: string };
}): Metadata {
  const path = paths[lang];
  const claim = lang === "en" ? "Data that changes decisions" : "Datos que cambian decisiones";
  const ogTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · ${claim}`;
  const image = { ...OG_IMAGE, url: `/og/${lang}`, alt: `${SITE_NAME} · ${claim}` };
  return {
    ...(title ? { title } : { title: { absolute: `${SITE_NAME} · ${claim}` } }),
    description,
    alternates: { canonical: path, languages: languageAlternates(paths.es, paths.en) },
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_GB" : "es_ES",
      alternateLocale: lang === "en" ? ["es_ES"] : ["en_GB"],
      siteName: SITE_NAME,
      url: path,
      title: ogTitle,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [image.url] },
  };
}

export const ORG_ID = `${SITE_URL}/#organization`;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-localtraffic.png`,
  slogan: "Datos que cambian decisiones",
  description: SITE_DESCRIPTION,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  sameAs: SOCIAL_URLS,
  areaServed: { "@type": "Country", name: "España" },
  knowsAbout: [
    "Datos geoespaciales",
    "Geomarketing",
    "Áreas de influencia",
    "Perfil del residente",
    "Perfil del visitante",
    "Origen del consumidor",
    "Análisis de zonas comerciales",
    "Campañas geolocalizadas",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: CONTACT.phone,
    email: CONTACT.email,
    availableLanguage: ["es", "en"],
    areaServed: "ES",
  },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ["es-ES", "en-GB"],
  publisher: { "@id": ORG_ID },
};
