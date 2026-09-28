"use client";

import { useEffect, useRef, useState } from "react";
import { ZONE_KEY } from "@/components/AskBar";
import { useLang } from "@/lib/useLang";
import { route } from "@/lib/i18n";

const COPY = {
  es: {
    title: "Pide una demo con tu zona.",
    lede: "Te enseñamos un análisis de la ubicación, el barrio o el municipio que nos digas.",
    done: "Recibido.",
    doneBody: "Te escribimos en breve para concretar la demo.",
    name: "Nombre",
    company: "Empresa o entidad",
    email: "Email",
    phone: "Teléfono",
    optional: "(opcional)",
    zone: "Zona que te interesa",
    zonePh: "Una ubicación, un barrio o un municipio",
    interest: "Te interesa",
    notSure: "Aún no lo sé",
    sending: "Enviando…",
    submit: "Pedir demo",
    error: "No se ha podido enviar. Escríbenos a",
    legal: "Usaremos tus datos solo para contactarte sobre la demo.",
    privacy: "Política de privacidad",
  },
  en: {
    title: "Book a demo for your area.",
    lede: "We'll show you an analysis of the location, neighbourhood or town you choose.",
    done: "Got it.",
    doneBody: "We'll be in touch shortly to arrange the demo.",
    name: "Name",
    company: "Company or organisation",
    email: "Email",
    phone: "Phone",
    optional: "(optional)",
    zone: "Area you're interested in",
    zonePh: "A location, a neighbourhood or a town",
    interest: "You're interested in",
    notSure: "Not sure yet",
    sending: "Sending…",
    submit: "Book a demo",
    error: "It couldn't be sent. Email us at",
    legal: "We'll only use your details to contact you about the demo.",
    privacy: "Privacy policy",
  },
};

type Status = "idle" | "sending" | "sent" | "error";

export default function DemoForm() {
  const lang = useLang();
  const t = COPY[lang];
  const [status, setStatus] = useState<Status>("idle");
  const [zona, setZona] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(ZONE_KEY);
      if (saved) {
        setZona(saved);
        sessionStorage.removeItem(ZONE_KEY);
        nameRef.current?.focus({ preventScroll: true });
      }
    } catch {
      // Storage unavailable: the field just starts empty.
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, idioma: lang }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="demo" className="demo" data-hide-askbar aria-labelledby="demo-title">
      <div className="wrap demo__grid">
        <div className="demo__text">
          <h1 id="demo-title" className="page-title">
            {t.title}
          </h1>
          <p className="section-lede">
            {t.lede}
          </p>
          <ul className="demo__contact">
            <li>
              <a href="tel:+34938148787">938 148 787</a>
            </li>
            <li>
              <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>
            </li>
          </ul>
        </div>

        {status === "sent" ? (
          <div className="form form--done" role="status">
            <p className="form__done-title">{t.done}</p>
            <p>{t.doneBody}</p>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate={false}>
            <div className="form__row">
              <label htmlFor="f-nombre">{t.name}</label>
              <input ref={nameRef} id="f-nombre" name="nombre" required autoComplete="name" />
            </div>
            <div className="form__row">
              <label htmlFor="f-empresa">{t.company}</label>
              <input id="f-empresa" name="empresa" required autoComplete="organization" />
            </div>
            <div className="form__pair">
              <div className="form__row">
                <label htmlFor="f-email">{t.email}</label>
                <input id="f-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="form__row">
                <label htmlFor="f-tel">
                  {t.phone} <span className="form__opt">{t.optional}</span>
                </label>
                <input id="f-tel" name="telefono" type="tel" autoComplete="tel" />
              </div>
            </div>
            <div className="form__row">
              <label htmlFor="f-zona">{t.zone}</label>
              <input
                id="f-zona"
                name="zona"
                placeholder={t.zonePh}
                value={zona}
                onChange={(e) => setZona(e.target.value)}
              />
            </div>
            <fieldset className="form__row form__choices">
              <legend>{t.interest}</legend>
              {["Tailored", "Focus", "On Demand", t.notSure].map((o, i) => (
                <label key={o} className="choice">
                  <input type="radio" name="interes" value={o} defaultChecked={i === 3} />
                  <span>{o}</span>
                </label>
              ))}
            </fieldset>
            <div className="form__hp" aria-hidden="true">
              <label htmlFor="f-web">Web</label>
              <input id="f-web" name="web" tabIndex={-1} autoComplete="off" />
            </div>
            <button className="btn btn--primary btn--block" type="submit" disabled={status === "sending"}>
              {status === "sending" ? t.sending : t.submit}
            </button>
            {status === "error" && (
              <p className="form__error" role="alert">
                {t.error} <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>.
              </p>
            )}
            <p className="form__legal">
              {t.legal} <a href={route("privacy", lang)}>{t.privacy}</a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
