import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ROUTES, servicePath, type Lang, type RouteKey } from "@/lib/i18n";
import { getService } from "@/lib/services";
import { SITE_DESCRIPTION } from "@/lib/site";

const TEXT: Record<RouteKey, Record<Lang, { title?: string; description: string }>> = {
  home: {
    es: { description: SITE_DESCRIPTION },
    en: {
      description:
        "Geospatial data with Human Intelligence: resident profile, visitor profile and consumer origin to decide where to open, which area to boost and which campaign to launch.",
    },
  },
  approach: {
    es: {
      title: "Enfoque: Inteligencia Humana",
      description:
        "Qué es la Inteligencia Humana de localtraffic: reunimos datos de residentes, visitantes y consumo de cualquier zona, los interpretamos con experiencia sobre el terreno y te decimos qué hacer.",
    },
    en: {
      title: "Approach: Human Intelligence",
      description:
        "What localtraffic's Human Intelligence is: we gather data on residents, visitors and spending in any area, interpret it with experience on the ground and tell you what to do.",
    },
  },
  services: {
    es: {
      title: "Servicios: Tailored, Focus y On Demand",
      description:
        "Tres formas de analizar una zona con datos geoespaciales: Tailored (una ubicación en un periodo), Focus (seguimiento mensual de áreas comerciales) y On Demand (análisis a medida).",
    },
    en: {
      title: "Services: Tailored, Focus and On Demand",
      description:
        "Three ways to analyse an area with geospatial data: Tailored (one location over a period), Focus (monthly tracking of shopping areas) and On Demand (tailor-made analysis).",
    },
  },
  campaigns: {
    es: {
      title: "Campañas geolocalizadas",
      description:
        "Usamos datos de residentes, visitantes y origen del consumidor para decidir dónde y cuándo activar una campaña geolocalizada, y medimos después su efecto en visitas y consumo.",
    },
    en: {
      title: "Geotargeted campaigns",
      description:
        "We use data on residents, visitors and consumer origin to decide where and when to launch a geotargeted campaign, then measure its effect on visits and spending.",
    },
  },
  contact: {
    es: {
      title: "Pedir demo",
      description: "Pide una demo de localtraffic con la ubicación, el barrio o el municipio que te interese y te enseñamos lo que vemos en ella.",
    },
    en: {
      title: "Book a demo",
      description: "Book a localtraffic demo for the location, neighbourhood or town you're interested in and we'll show you what we see there.",
    },
  },
};

export const metaFor = (key: RouteKey, lang: Lang): Metadata =>
  pageMeta({ ...TEXT[key][lang], lang, paths: { es: ROUTES[key].es, en: ROUTES[key].en } });

export function serviceMeta(slug: string, lang: Lang): Metadata {
  const s = getService(slug, lang);
  if (!s) return {};
  return pageMeta({
    title: `${s.name}: ${s.tagline.replace(/\.$/, "")}`,
    description: `${s.tagline} ${s.intro}`,
    lang,
    paths: { es: servicePath(slug, "es"), en: servicePath(slug, "en") },
  });
}
