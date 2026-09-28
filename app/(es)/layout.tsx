import "../globals.css";
import Document, { baseMetadata } from "@/components/Document";

export const viewport = { themeColor: "#0E0B1C" };
export const metadata = baseMetadata("es");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Document lang="es">{children}</Document>;
}
