import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import SocialLinks from "@/components/Social";

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
