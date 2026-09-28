import CampaignsPage from "@/components/pages/CampaignsPage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("campaigns", "es");

export default function Page() {
  return <CampaignsPage lang="es" />;
}
