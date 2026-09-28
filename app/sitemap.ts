import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ROUTES, servicePath, type Lang } from "@/lib/i18n";
import { servicesFor } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const langs: Lang[] = ["es", "en"];
  const pages = langs.flatMap((lang) => [
    ...Object.values(ROUTES).map((r) => r[lang] as string),
    ...servicesFor(lang).map((s) => servicePath(s.slug, lang)),
  ]);
  return pages.map((p) => ({
    url: `${SITE_URL}${p === "/" ? "" : p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : p === "/en" ? 0.9 : p.includes("servic") ? 0.8 : 0.6,
  }));
}
