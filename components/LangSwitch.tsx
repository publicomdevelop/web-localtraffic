"use client";

import { usePathname } from "next/navigation";
import { counterpart, langFromPath } from "@/lib/i18n";

/** ES / EN switch that keeps you on the same page in the other language. */
export default function LangSwitch({ className = "lang-switch" }: { className?: string }) {
  const path = usePathname() || "/";
  const lang = langFromPath(path);
  const other = lang === "en" ? "es" : "en";
  return (
    <a
      className={className}
      href={counterpart(path, other)}
      hrefLang={other}
      lang={other}
      aria-label={other === "en" ? "English version" : "Versión en castellano"}
    >
      <span aria-hidden="true" className={lang === "es" ? "is-current" : undefined}>
        ES
      </span>
      <span aria-hidden="true" className="lang-switch__sep">
        /
      </span>
      <span aria-hidden="true" className={lang === "en" ? "is-current" : undefined}>
        EN
      </span>
    </a>
  );
}
