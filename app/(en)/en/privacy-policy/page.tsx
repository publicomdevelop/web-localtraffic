import LegalPage from "@/components/pages/LegalPage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("privacy", "en");

export default function Page() {
  return <LegalPage kind="privacy" lang="en" />;
}
