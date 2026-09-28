import type { Metadata, Viewport } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import AskBar from "@/components/AskBar";
import JsonLd from "@/components/JsonLd";
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { organizationLd, websiteLd } from "@/lib/seo";
import { mono, outfit } from "@/lib/fonts";
import type { Lang } from "@/lib/i18n";

export const baseMetadata = (lang: Lang): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: {
    default: lang === "en" ? "localtraffic · Data that changes decisions" : "localtraffic · Datos que cambian decisiones",
    template: "%s · localtraffic",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
});

export const viewport: Viewport = { themeColor: "#0E0B1C" };

/** The <html> shell shared by the Spanish and English root layouts. */
export default function Document({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${outfit.variable} ${mono.variable}`}>
      <body>
        <JsonLd data={[organizationLd, websiteLd]} />
        <SiteHeader lang={lang} />
        <main id="contenido">{children}</main>
        <SiteFooter lang={lang} />
        <AskBar />
      </body>
    </html>
  );
}
