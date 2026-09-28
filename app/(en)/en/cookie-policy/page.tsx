import LegalPage from "@/components/pages/LegalPage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("cookies", "en");

export default function Page() {
  return <LegalPage kind="cookies" lang="en" />;
}
