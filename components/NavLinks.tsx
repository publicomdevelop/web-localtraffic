"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SolutionArt from "@/components/illustrations/SolutionArt";
import SocialLinks from "@/components/Social";
import LangSwitch from "@/components/LangSwitch";
import { servicesFor } from "@/lib/services";
import { LOGIN_URL } from "@/lib/site";
import { langFromPath, route, servicePath } from "@/lib/i18n";

const COPY = {
  es: {
    approach: "Enfoque",
    services: "Servicios",
    campaigns: "Campañas",
    home: "Inicio",
    compare: "Comparar los tres servicios",
    also: "También",
    pages: [
      { key: "approach" as const, label: "Enfoque", body: "Qué es la Inteligencia Humana y cómo leemos cada zona." },
      { key: "campaigns" as const, label: "Campañas", body: "Cómo usamos los datos para activar y medir campañas." },
    ],
    ctaQ: "¿Qué zona quieres entender?",
    demo: "Pedir demo",
    login: "Acceso clientes",
    newTab: " (se abre en otra pestaña)",
    menu: "Menú",
    close: "Cerrar",
    nav: "Principal",
  },
  en: {
    approach: "Approach",
    services: "Services",
    campaigns: "Campaigns",
    home: "Home",
    compare: "Compare the three services",
    also: "Also",
    pages: [
      { key: "approach" as const, label: "Approach", body: "What Human Intelligence is and how we read each area." },
      { key: "campaigns" as const, label: "Campaigns", body: "How we use data to launch and measure campaigns." },
    ],
    ctaQ: "Which area do you want to understand?",
    demo: "Book a demo",
    login: "Client login",
    newTab: " (opens in a new tab)",
    menu: "Menu",
    close: "Close",
    nav: "Main",
  },
};

/** Desktop nav with a mega menu under Services, plus the mobile menu. */
export default function NavLinks() {
  const path = usePathname();
  const lang = langFromPath(path);
  const t = COPY[lang];
  const services = servicesFor(lang);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number>();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [path]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMega(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [mega]);

  const isActive = (href: string) => path === href || path.startsWith(`${href}/`);
  const current = (href: string) => (isActive(href) ? ("page" as const) : undefined);
  const open = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setMega(false), 180);
  };

  const approach = route("approach", lang);
  const servicesHref = route("services", lang);
  const campaigns = route("campaigns", lang);

  return (
    <>
      <div className="header__nav" ref={wrapRef} onMouseLeave={closeSoon} onMouseEnter={() => mega && open()}>
        <nav aria-label={t.nav} className="header__links">
          <Link href={approach} aria-current={current(approach)}>
            {t.approach}
          </Link>
          <button
            type="button"
            className="header__mega-toggle"
            aria-expanded={mega}
            aria-controls="mega-menu"
            aria-current={current(servicesHref)}
            onClick={() => (mega ? setMega(false) : open())}
            onMouseEnter={open}
          >
            {t.services}
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <Link href={campaigns} aria-current={current(campaigns)}>
            {t.campaigns}
          </Link>
        </nav>

        <div id="mega-menu" className={`mega${mega ? " is-open" : ""}`} hidden={!mega}>
          <div className="wrap mega__inner">
            <div className="mega__services">
              <p className="mega__head">{t.services}</p>
              <ul>
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={servicePath(s.slug, lang)} className="mega__service">
                      {/* Only drawn while the menu is open, to keep every page light. */}
                      <span className="mega__thumb">{mega && <SolutionArt kind={s.art} lang={lang} />}</span>
                      <span className="mega__name">{s.name}</span>
                      <span className="mega__tagline">{s.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={servicesHref} className="link-arrow">
                {t.compare}
              </Link>
            </div>
            <div className="mega__side">
              <p className="mega__head">{t.also}</p>
              <ul className="mega__pages">
                {t.pages.map((p) => (
                  <li key={p.key}>
                    <Link href={route(p.key, lang)}>
                      <span className="mega__page">{p.label}</span>
                      <span className="mega__tagline">{p.body}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mega__cta">
                <p>{t.ctaQ}</p>
                <Link className="btn btn--primary btn--small" href={route("contact", lang)}>
                  {t.demo}
                </Link>
              </div>
              <SocialLinks lang={lang} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={mobile}
        aria-controls="mobile-menu"
        onClick={() => setMobile((o) => !o)}
      >
        {mobile ? t.close : t.menu}
      </button>
      <nav id="mobile-menu" aria-label={t.nav} className={`mobile-menu${mobile ? " is-open" : ""}`} hidden={!mobile}>
        <Link href={route("home", lang)} aria-current={path === route("home", lang) ? "page" : undefined}>
          {t.home}
        </Link>
        <Link href={approach} aria-current={current(approach)}>
          {t.approach}
        </Link>
        <Link href={servicesHref} aria-current={path === servicesHref ? "page" : undefined}>
          {t.services}
        </Link>
        {services.map((s) => (
          <Link
            key={s.slug}
            href={servicePath(s.slug, lang)}
            className="mobile-menu__sub"
            aria-current={path === servicePath(s.slug, lang) ? "page" : undefined}
          >
            {s.name}
          </Link>
        ))}
        <Link href={campaigns} aria-current={current(campaigns)}>
          {t.campaigns}
        </Link>
        <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer" className="mobile-menu__login">
          {t.login} ↗<span className="sr-only">{t.newTab}</span>
        </a>
        <LangSwitch className="lang-switch mobile-menu__lang" />
        <SocialLinks className="social social--menu" lang={lang} />
      </nav>
    </>
  );
}
