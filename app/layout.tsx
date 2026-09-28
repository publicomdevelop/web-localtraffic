import type { Metadata, Viewport } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import AskBar from "@/components/AskBar";
import JsonLd from "@/components/JsonLd";
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { organizationLd, websiteLd } from "@/lib/seo";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "localtraffic · Datos que cambian decisiones", template: "%s · localtraffic" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0E0B1C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${mono.variable}`}>
      <body>
        <JsonLd data={[organizationLd, websiteLd]} />
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <AskBar />
      </body>
    </html>
  );
}
