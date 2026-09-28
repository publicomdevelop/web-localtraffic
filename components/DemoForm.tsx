"use client";

import { useEffect, useRef, useState } from "react";

export const ZONE_EVENT = "lt:zona";

type Status = "idle" | "sending" | "sent" | "error";

export default function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [zona, setZona] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onZone = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setZona(detail);
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 600);
    };
    window.addEventListener(ZONE_EVENT, onZone);
    return () => window.removeEventListener(ZONE_EVENT, onZone);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="demo" className="demo" aria-labelledby="demo-title">
      <div className="wrap demo__grid">
        <div className="demo__text">
          <h2 id="demo-title" className="section-title">
            Pide una demo con tu zona.
          </h2>
          <p className="section-lede">
            Te enseñamos los datos de la calle, el barrio o el municipio que nos digas.
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
            <p className="form__done-title">Recibido.</p>
            <p>Te escribimos en breve para concretar la demo.</p>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate={false}>
            <div className="form__row">
              <label htmlFor="f-nombre">Nombre</label>
              <input ref={nameRef} id="f-nombre" name="nombre" required autoComplete="name" />
            </div>
            <div className="form__row">
              <label htmlFor="f-empresa">Empresa o entidad</label>
              <input id="f-empresa" name="empresa" required autoComplete="organization" />
            </div>
            <div className="form__pair">
              <div className="form__row">
                <label htmlFor="f-email">Email</label>
                <input id="f-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="form__row">
                <label htmlFor="f-tel">
                  Teléfono <span className="form__opt">(opcional)</span>
                </label>
                <input id="f-tel" name="telefono" type="tel" autoComplete="tel" />
              </div>
            </div>
            <div className="form__row">
              <label htmlFor="f-zona">Zona que te interesa</label>
              <input
                id="f-zona"
                name="zona"
                placeholder="Una calle, un barrio o un municipio"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
              />
            </div>
            <fieldset className="form__row form__choices">
              <legend>Somos</legend>
              {["Retail o marca", "Agencia de marketing", "Administración pública", "Otro"].map((o, i) => (
                <label key={o} className="choice">
                  <input type="radio" name="perfil" value={o} defaultChecked={i === 0} />
                  <span>{o}</span>
                </label>
              ))}
            </fieldset>
            <div className="form__hp" aria-hidden="true">
              <label htmlFor="f-web">Web</label>
              <input id="f-web" name="web" tabIndex={-1} autoComplete="off" />
            </div>
            <button className="btn btn--primary btn--block" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Enviando…" : "Pedir demo"}
            </button>
            {status === "error" && (
              <p className="form__error" role="alert">
                No se ha podido enviar. Escríbenos a <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>.
              </p>
            )}
            <p className="form__legal">Usaremos tus datos solo para contactarte sobre la demo.</p>
          </form>
        )}
      </div>
    </section>
  );
}
