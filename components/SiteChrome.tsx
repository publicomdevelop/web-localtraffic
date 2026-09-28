import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import SocialLinks from "@/components/Social";
import { LOGIN_URL } from "@/lib/site";

function LoginIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="7" r="3.2" />
      <path d="M3.5 17c.9-3 3.4-4.6 6.5-4.6s5.6 1.6 6.5 4.6" strokeLinecap="round" />
    </svg>
  );
}

export const NAV = [
  { href: "/enfoque", label: "Enfoque" },
  { href: "/servicios", label: "Servicios" },
  { href: "/campanas", label: "Campañas" },
];

export function SiteHeader() {
  return (
    <header className="header">
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="header__inner wrap">
        <Link href="/" className="header__logo" aria-label="localtraffic, inicio">
          <Image src="/logo-localtraffic.png" alt="" width={148} height={32} priority />
        </Link>
        <NavLinks />
        <a className="header__login" href={LOGIN_URL} target="_blank" rel="noopener noreferrer">
          <LoginIcon />
          <span>Acceso clientes</span>
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
        <Link className="btn btn--primary btn--small" href="/contacto">
          Pedir demo
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <Image src="/logo-localtraffic.png" alt="localtraffic" width={130} height={28} />
          <p className="footer__claim">Datos que cambian decisiones.</p>
          <SocialLinks />
        </div>
        <nav aria-label="Pie de página" className="footer__nav">
          <p className="footer__head">Web</p>
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contacto">Pedir demo</Link>
            </li>
            <li>
              <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer">
                Acceso clientes<span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="footer__nav">
          <p className="footer__head">Servicios</p>
          <ul>
            <li>
              <Link href="/servicios/tailored">Tailored</Link>
            </li>
            <li>
              <Link href="/servicios/focus">Focus</Link>
            </li>
            <li>
              <Link href="/servicios/on-demand">On Demand</Link>
            </li>
          </ul>
        </div>
        <div className="footer__nav">
          <p className="footer__head">Contacto</p>
          <ul className="footer__contact">
            <li>
              <a href="tel:+34938148787">938 148 787</a>
            </li>
            <li>
              <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>
            </li>
          </ul>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} localtraffic</p>
      </div>
    </footer>
  );
}
