"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SolutionArt from "@/components/illustrations/SolutionArt";
import SocialLinks from "@/components/Social";
import { SERVICES } from "@/lib/services";

const PAGES = [
  { href: "/enfoque", label: "Enfoque", body: "Qué es la Inteligencia Humana y cómo leemos cada zona." },
  { href: "/campanas", label: "Campañas", body: "Cómo usamos los datos para activar y medir campañas." },
];

/** Desktop nav with a mega menu under "Servicios", plus the mobile menu. */
export default function NavLinks() {
  const path = usePathname();
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
  const open = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setMega(false), 180);
  };

  return (
    <>
      <div className="header__nav" ref={wrapRef} onMouseLeave={closeSoon} onMouseEnter={() => mega && open()}>
        <nav aria-label="Principal" className="header__links">
          <Link href="/enfoque" aria-current={isActive("/enfoque") ? "page" : undefined}>
            Enfoque
          </Link>
          <button
            type="button"
            className="header__mega-toggle"
            aria-expanded={mega}
            aria-controls="mega-menu"
            aria-current={isActive("/servicios") ? "page" : undefined}
            onClick={() => (mega ? setMega(false) : open())}
            onMouseEnter={open}
          >
            Servicios
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/campanas" aria-current={isActive("/campanas") ? "page" : undefined}>
            Campañas
          </Link>
        </nav>

        <div id="mega-menu" className={`mega${mega ? " is-open" : ""}`} hidden={!mega}>
          <div className="wrap mega__inner">
            <div className="mega__services">
              <p className="mega__head">Servicios</p>
              <ul>
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/servicios/${s.slug}`} className="mega__service">
                      <span className="mega__thumb">
                        <SolutionArt kind={s.art} />
                      </span>
                      <span className="mega__name">{s.name}</span>
                      <span className="mega__tagline">{s.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/servicios" className="link-arrow">
                Comparar los tres servicios
              </Link>
            </div>
            <div className="mega__side">
              <p className="mega__head">También</p>
              <ul className="mega__pages">
                {PAGES.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href}>
                      <span className="mega__page">{p.label}</span>
                      <span className="mega__tagline">{p.body}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mega__cta">
                <p>¿Qué zona quieres entender?</p>
                <Link className="btn btn--primary btn--small" href="/contacto">
                  Pedir demo
                </Link>
              </div>
              <SocialLinks />
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
        {mobile ? "Cerrar" : "Menú"}
      </button>
      <nav id="mobile-menu" aria-label="Principal" className={`mobile-menu${mobile ? " is-open" : ""}`} hidden={!mobile}>
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>
          Inicio
        </Link>
        <Link href="/enfoque" aria-current={isActive("/enfoque") ? "page" : undefined}>
          Enfoque
        </Link>
        <Link href="/servicios" aria-current={path === "/servicios" ? "page" : undefined}>
          Servicios
        </Link>
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            href={`/servicios/${s.slug}`}
            className="mobile-menu__sub"
            aria-current={path === `/servicios/${s.slug}` ? "page" : undefined}
          >
            {s.name}
          </Link>
        ))}
        <Link href="/campanas" aria-current={isActive("/campanas") ? "page" : undefined}>
          Campañas
        </Link>
        <SocialLinks className="social social--menu" />
      </nav>
    </>
  );
}
