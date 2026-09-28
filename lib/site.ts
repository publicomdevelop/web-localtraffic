/** Public site settings shared by metadata, sitemap, robots and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.localtraffic.es").replace(/\/$/, "");
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

/** Google Analytics 4 property (same one the previous site used). Loaded only after consent. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-GPP24MSVBB";

export const CONTACT = { phone: "+34938148787", email: "hola@localtraffic.es" };

/** Legal owner of the localtraffic brand and website (same company as publicom.cat). */
export const COMPANY = {
  legalName: "Publicom All Line, S.L.U.",
  taxId: "B66271453",
  registry: "Registro Mercantil de Barcelona, tomo 44290, folio 192, hoja 451874",
  representative: "Jaume Blanxart",
  // Office address (the one Google shows). Not the billing address.
  street: "Carrer Sant Antoni, 2",
  postalCode: "08800",
  city: "Vilanova i la Geltrú",
  region: "Barcelona",
  country: "ES",
  phone: "938 148 787",
  privacyEmail: "publicom@publicom.cat",
};

export const SOCIAL_URLS = [
  "https://www.instagram.com/localtraffic.es/",
  "https://www.linkedin.com/company/localtraffic",
];
