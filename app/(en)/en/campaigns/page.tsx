import CampaignsPage from "@/components/pages/CampaignsPage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("campaigns", "en");

export default function Page() {
  return <CampaignsPage lang="en" />;
}
