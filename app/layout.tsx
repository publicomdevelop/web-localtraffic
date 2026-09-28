import type { Metadata, Viewport } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import AskBar from "@/components/AskBar";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "localtraffic · Datos que cambian decisiones", template: "%s · localtraffic" },
  description:
    "Consultoría de datos geoespaciales con Inteligencia Humana: perfil del residente, perfil del visitante y origen del consumidor para decidir y activar campañas.",
};

export const viewport: Viewport = { themeColor: "#0E0B1C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${mono.variable}`}>
      <body>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <AskBar />
      </body>
    </html>
  );
}
