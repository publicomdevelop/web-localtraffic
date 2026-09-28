/** Public site settings shared by metadata, sitemap, robots and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://localtraffic.es").replace(/\/$/, "");
export const SITE_NAME = "localtraffic";
export const SITE_DESCRIPTION =
  "Datos geoespaciales con Inteligencia Humana: perfil del residente, perfil del visitante y origen del consumidor para decidir dónde abrir, qué zona impulsar y qué campaña activar.";

/**
 * Search engines only index the site once it lives on its real domain. Until
 * then (vercel.app previews) every page is noindex. Set SITE_INDEXABLE=true in
 * Vercel when localtraffic.es points here.
 */
export const INDEXABLE = process.env.SITE_INDEXABLE === "true";

export const LOGIN_URL = "https://localtraffic.app/";

export const CONTACT = { phone: "+34938148787", email: "hola@localtraffic.es" };

export const SOCIAL_URLS = [
  "https://www.instagram.com/localtraffic.es/",
  "https://www.linkedin.com/company/localtraffic",
];
