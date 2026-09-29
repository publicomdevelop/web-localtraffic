import type { Metadata, Viewport } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import DemoDock from "@/components/DemoDock";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";
import ThemeToggle from "@/components/ThemeToggle";
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
    <html lang={lang} className={`${outfit.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved light/dark choice before first paint, so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('lt:theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body>
        <JsonLd data={[organizationLd, websiteLd]} />
        <SiteHeader lang={lang} />
        <main id="contenido">{children}</main>
        <SiteFooter lang={lang} />
        <DemoDock />
        <CookieBanner />
        <ThemeToggle />
        <Analytics />
      </body>
    </html>
  );
}
