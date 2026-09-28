export type Lang = "es" | "en";

/** Page keys and their URL in each language. Spanish keeps the original URLs. */
export const ROUTES = {
  home: { es: "/", en: "/en" },
  approach: { es: "/enfoque", en: "/en/approach" },
  services: { es: "/servicios", en: "/en/services" },
  campaigns: { es: "/campanas", en: "/en/campaigns" },
  contact: { es: "/contacto", en: "/en/contact" },
} as const;

export type RouteKey = keyof typeof ROUTES;

export const route = (key: RouteKey, lang: Lang) => ROUTES[key][lang];
export const servicePath = (slug: string, lang: Lang) => `${ROUTES.services[lang]}/${slug}`;

export const langFromPath = (path: string | null | undefined): Lang =>
  path === "/en" || path?.startsWith("/en/") ? "en" : "es";

/** The same page in the other language (falls back to that language's home). */
export function counterpart(path: string, to: Lang): string {
  const from = langFromPath(path);
  if (from === to) return path;
  const clean = path.replace(/\/$/, "") || "/";
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    const r = ROUTES[key];
    if (clean === r[from]) return r[to];
    if (key === "services" && clean.startsWith(`${r[from]}/`)) return `${r[to]}${clean.slice(r[from].length)}`;
  }
  return ROUTES.home[to];
}

/** hreflang alternates for a page in both languages. */
export function languageAlternates(es: string, en: string) {
  return { es, en, "x-default": es };
}
