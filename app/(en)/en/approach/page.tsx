import ApproachPage from "@/components/pages/ApproachPage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("approach", "en");

export default function Page() {
  return <ApproachPage lang="en" />;
}
