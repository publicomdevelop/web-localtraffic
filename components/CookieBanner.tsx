"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/consent";
import { langFromPath, route } from "@/lib/i18n";

const COPY = {
  es: {
    label: "Aviso de cookies",
    text: "Usamos cookies de Google Analytics para saber cómo se usa la web y mejorarla. Solo se activan si las aceptas. Puedes cambiar de opinión cuando quieras desde el pie de página.",
    policy: "Política de cookies",
    reject: "Rechazar",
    settings: "Configurar",
    accept: "Aceptar",
    save: "Guardar",
    technical: "Técnicas",
    technicalBody: "Necesarias para que la web funcione y recuerde tu elección. Siempre activas.",
    analytics: "Analíticas",
    analyticsBody: "Google Analytics: cuántas personas visitan la web y qué páginas ven, de forma agregada.",
    always: "Siempre activas",
  },
  en: {
    label: "Cookie notice",
    text: "We use Google Analytics cookies to understand how the website is used and improve it. They are only turned on if you accept them. You can change your mind at any time from the footer.",
    policy: "Cookie policy",
    reject: "Reject",
    settings: "Settings",
    accept: "Accept",
    save: "Save",
    technical: "Technical",
    technicalBody: "Needed for the website to work and to remember your choice. Always on.",
    analytics: "Analytics",
    analyticsBody: "Google Analytics: how many people visit the website and which pages they see, in aggregate.",
    always: "Always on",
  },
};

/** First-layer cookie notice: reject is as easy as accept, as the AEPD requires. */
export default function CookieBanner() {
  const path = usePathname();
  const lang = langFromPath(path);
  const t = COPY[lang];
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const onOpen = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setDetail(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-cookie-banner", open);
    if (open && detail) firstButton.current?.focus();
  }, [open, detail]);

  if (!open) return null;

  const decide = (value: boolean) => {
    saveConsent(value);
    setOpen(false);
    setDetail(false);
  };

  return (
    <section className="cookies" role="dialog" aria-modal="false" aria-label={t.label}>
      <p className="cookies__text">
        {t.text} <a href={route("cookies", lang)}>{t.policy}</a>
      </p>
      {detail && (
        <div className="cookies__detail">
          <div className="cookies__row">
            <div>
              <p className="cookies__name">{t.technical}</p>
              <p className="cookies__desc">{t.technicalBody}</p>
            </div>
            <span className="cookies__always">{t.always}</span>
          </div>
          <label className="cookies__row">
            <div>
              <p className="cookies__name">{t.analytics}</p>
              <p className="cookies__desc">{t.analyticsBody}</p>
            </div>
            <input
              type="checkbox"
              className="cookies__switch"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </label>
        </div>
      )}
      <div className="cookies__actions">
        <button ref={firstButton} type="button" className="btn btn--ghost btn--small" onClick={() => decide(false)}>
          {t.reject}
        </button>
        {detail ? (
          <button type="button" className="btn btn--ghost btn--small" onClick={() => decide(analytics)}>
            {t.save}
          </button>
        ) : (
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setDetail(true)}>
            {t.settings}
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--small" onClick={() => decide(true)}>
          {t.accept}
        </button>
      </div>
    </section>
  );
}
