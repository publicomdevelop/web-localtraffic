import type { Lang } from "@/lib/i18n";

const locale = (lang: Lang) => (lang === "en" ? "en-GB" : "es-ES");

export const intFormatter = (lang: Lang = "es") => {
  const f = new Intl.NumberFormat(locale(lang), { maximumFractionDigits: 0 });
  return (v: number) => f.format(Math.round(v));
};

export const formatInt = intFormatter("es");
