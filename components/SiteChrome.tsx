import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import SocialLinks from "@/components/Social";
import LangSwitch from "@/components/LangSwitch";
import { LOGIN_URL } from "@/lib/site";
import { route, servicePath, type Lang } from "@/lib/i18n";
import { servicesFor } from "@/lib/services";
import CookieSettingsLink from "@/components/CookieSettingsLink";

const COPY = {
  es: {
    skip: "Saltar al contenido",
    home: "localtraffic, inicio",
    login: "Acceso clientes",
    newTab: " (se abre en otra pestaña)",
    demo: "Pedir demo",
    claim: "Datos que cambian decisiones.",
    web: "Web",
    footerNav: "Pie de página",
    services: "Servicios",
    contact: "Contacto",
    legal: "Aviso legal",
    privacy: "Privacidad",
    cookies: "Cookies",
    cookieSettings: "Configurar cookies",
    links: [
      { key: "home" as const, label: "Inicio" },
      { key: "approach" as const, label: "Enfoque" },
      { key: "services" as const, label: "Servicios" },
      { key: "campaigns" as const, label: "Campañas" },
    ],
  },
  en: {
    skip: "Skip to content",
    home: "localtraffic, home",
    login: "Client login",
    newTab: " (opens in a new tab)",
    demo: "Book a demo",
    claim: "Data that changes decisions.",
    web: "Site",
    footerNav: "Footer",
    services: "Services",
    contact: "Contact",
    legal: "Legal notice",
    privacy: "Privacy",
    cookies: "Cookies",
    cookieSettings: "Cookie settings",
    links: [
      { key: "home" as const, label: "Home" },
      { key: "approach" as const, label: "Approach" },
      { key: "services" as const, label: "Services" },
      { key: "campaigns" as const, label: "Campaigns" },
    ],
  },
};

function LoginIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="7" r="3.2" />
      <path d="M3.5 17c.9-3 3.4-4.6 6.5-4.6s5.6 1.6 6.5 4.6" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader({ lang = "es" }: { lang?: Lang }) {
  const t = COPY[lang];
  return (
    <header className="header">
      <a className="skip" href="#contenido">
        {t.skip}
      </a>
      <div className="header__inner wrap">
        <Link href={route("home", lang)} className="header__logo" aria-label={t.home}>
          <Image src="/logo-localtraffic.png" alt="" width={148} height={32} priority />
        </Link>
        <NavLinks />
        <LangSwitch />
        <a className="header__login" href={LOGIN_URL} target="_blank" rel="noopener noreferrer">
          <LoginIcon />
          <span>{t.login}</span>
          <span className="sr-only">{t.newTab}</span>
        </a>
        <Link className="btn btn--primary btn--small" href={route("contact", lang)}>
          {t.demo}
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter({ lang = "es" }: { lang?: Lang }) {
  const t = COPY[lang];
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <Image src="/logo-localtraffic.png" alt="localtraffic" width={130} height={28} />
          <p className="footer__claim">{t.claim}</p>
          <SocialLinks lang={lang} />
        </div>
        <nav aria-label={t.footerNav} className="footer__nav">
          <p className="footer__head">{t.web}</p>
          <ul>
            {t.links.map((l) => (
              <li key={l.key}>
                <Link href={route(l.key, lang)}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href={route("contact", lang)}>{t.demo}</Link>
            </li>
            <li>
              <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer">
                {t.login}
                <span className="sr-only">{t.newTab}</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="footer__nav">
          <p className="footer__head">{t.services}</p>
          <ul>
            {servicesFor(lang).map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug, lang)}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__nav">
          <p className="footer__head">{t.contact}</p>
          <ul className="footer__contact">
            <li>
              <a href="tel:+34938148787">938 148 787</a>
            </li>
            <li>
              <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>
            </li>
          </ul>
        </div>
        <div className="footer__copy">
          <span>© {new Date().getFullYear()} localtraffic · Publicom All Line, S.L.U.</span>
          <Link href={route("legal", lang)}>{t.legal}</Link>
          <Link href={route("privacy", lang)}>{t.privacy}</Link>
          <Link href={route("cookies", lang)}>{t.cookies}</Link>
          <CookieSettingsLink label={t.cookieSettings} />
        </div>
      </div>
    </footer>
  );
}
