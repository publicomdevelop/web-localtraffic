import "../globals.css";
import Document, { baseMetadata } from "@/components/Document";

export const viewport = { themeColor: "#0E0B1C" };
export const metadata = baseMetadata("en");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Document lang="en">{children}</Document>;
}
