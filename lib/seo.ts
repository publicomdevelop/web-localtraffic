import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT, SOCIAL_URLS } from "@/lib/site";

// Pages that set their own openGraph lose the file-based image, so it is listed explicitly.
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "localtraffic · Datos que cambian decisiones" };

/** Title, description, canonical and Open Graph for one page. */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const ogTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · Datos que cambian decisiones`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: SITE_NAME,
      url: path,
      title: ogTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [OG_IMAGE.url] },
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
    availableLanguage: ["es"],
    areaServed: "ES",
  },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "es-ES",
  publisher: { "@id": ORG_ID },
};
