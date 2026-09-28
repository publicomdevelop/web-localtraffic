import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/enfoque", "/servicios", "/campanas", "/contacto", ...SERVICES.map((s) => `/servicios/${s.slug}`)];
  return pages.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p.startsWith("/servicios") ? 0.8 : 0.6,
  }));
}
