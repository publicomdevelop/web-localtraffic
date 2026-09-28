import HomePage from "@/components/pages/HomePage";
import { metaFor } from "@/lib/pageMeta";

export const metadata = metaFor("home", "es");

export default function Page() {
  return <HomePage lang="es" />;
}
