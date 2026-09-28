import ServicesPage from "@/components/pages/ServicesPage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("services", "es");

export default function Page() {
  return <ServicesPage lang="es" />;
}
