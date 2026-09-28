import LegalPage from "@/components/pages/LegalPage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("legal", "es");

export default function Page() {
  return <LegalPage kind="legal" lang="es" />;
}
