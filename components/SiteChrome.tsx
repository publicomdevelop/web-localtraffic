import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="header">
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="header__inner wrap-wide">
        <a href="/" className="header__logo" aria-label="localtraffic, inicio">
          <Image src="/logo-localtraffic.png" alt="" width={148} height={32} priority />
        </a>
        <nav aria-label="Principal" className="header__nav">
          <a href="#datos">Datos</a>
          <a href="#soluciones">Soluciones</a>
          <a href="#estudios">Estudios</a>
        </nav>
        <a className="btn btn--primary btn--small" href="#demo">
          Pedir demo
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap-wide footer__inner">
        <div>
          <Image src="/logo-localtraffic.png" alt="localtraffic" width={130} height={28} />
          <p className="footer__claim">Datos que cambian decisiones.</p>
        </div>
        <ul className="footer__links">
          <li>
            <a href="tel:+34938148787">938 148 787</a>
          </li>
          <li>
            <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>
          </li>
        </ul>
        <p className="footer__copy">© {new Date().getFullYear()} localtraffic</p>
      </div>
    </footer>
  );
}
