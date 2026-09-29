"use client";

import { useEffect, useRef, useState } from "react";
import { ZONE_KEY } from "@/components/AskBar";
import PhonePrefix from "@/components/PhonePrefix";
import LocationPicker, { MapPreview } from "@/components/LocationPicker";
import { DEFAULT_AREA, type Area, type Place } from "@/lib/location";
import { useLang } from "@/lib/useLang";
import { route } from "@/lib/i18n";
import {
  DEFAULT_PREFIX,
  formatPhone,
  maxDigits,
  validateDemo,
  type DemoInput,
  type Errors,
  type Field,
} from "@/lib/demoValidation";

const COPY = {
  es: {
    title: "Pide una demo con tu zona.",
    lede: "Te enseñamos un análisis de la ubicación, el barrio o el municipio que nos digas.",
    done: "Recibido.",
    doneBody: "Te hemos enviado un correo de confirmación y te escribiremos en breve para concretar la demo.",
    book: "Elige ya día y hora",
    bookIntro: "¿Prefieres no esperar? Reserva directamente un hueco en nuestra agenda.",
    name: "Nombre completo",
    company: "Empresa o entidad",
    email: "Email",
    phone: "Teléfono",
    prefix: "Prefijo",
    phonePh: "612 345 678",
    fixErrors: "Revisa los campos marcados.",
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
    doneBody: "We've sent you a confirmation email and will be in touch shortly to arrange the demo.",
    book: "Pick a day and time now",
    bookIntro: "Rather not wait? Book a slot in our calendar straight away.",
    name: "Full name",
    company: "Company or organisation",
    email: "Email",
    phone: "Phone",
    prefix: "Country code",
    phonePh: "612 345 678",
    fixErrors: "Please check the highlighted fields.",
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

/** Optional scheduling link (Google Calendar, Cal.com, Calendly…), set in Vercel. */
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

type BodyProps = {
  /** "page" for /contacto, "panel" inside the floating dock panel. */
  variant?: "page" | "panel";
  place: Place | null;
  area: Area;
  /** Free text of the address field (sent as "zona" even if no suggestion was picked). */
  locationText: string;
  /** Location controls shown at the top of the form (page variant). */
  locationSlot?: React.ReactNode;
  /** Called once the request has been sent. */
  onSent?: () => void;
};

/** Demo request form: validation, phone prefix, and the chosen location + area. */
export function DemoFormBody({ variant = "page", place, area, locationText, locationSlot, onSent }: BodyProps) {
  const lang = useLang();
  const t = COPY[lang];
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState<DemoInput>({
    nombre: "",
    empresa: "",
    email: "",
    prefijo: DEFAULT_PREFIX,
    telefono: "",
    zona: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [errorCode, setErrorCode] = useState("");
  const refs = {
    nombre: useRef<HTMLInputElement>(null),
    empresa: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    telefono: useRef<HTMLInputElement>(null),
    zona: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    setValues((v) => ({ ...v, zona: locationText.slice(0, 160) }));
  }, [locationText]);

  useEffect(() => {
    if (variant === "panel") {
      refs.nombre.current?.focus({ preventScroll: true });
      return;
    }
    try {
      const saved = sessionStorage.getItem(ZONE_KEY);
      if (saved) {
        setValues((v) => ({ ...v, zona: saved.slice(0, 160) }));
        sessionStorage.removeItem(ZONE_KEY);
        refs.nombre.current?.focus({ preventScroll: true });
      }
    } catch {
      // Storage unavailable: the field just starts empty.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field: keyof DemoInput, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a field has been left with an error, re-check it as the user types.
    if (field !== "prefijo" && touched[field as Field]) setErrors(validateDemo(next, lang));
    if (field === "prefijo" && touched.telefono) setErrors(validateDemo(next, lang));
  };

  const onPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, maxDigits(values.prefijo));
    update("telefono", formatPhone(digits));
  };

  const onPrefix = (dial: string) => {
    const digits = values.telefono.replace(/\D/g, "").slice(0, maxDigits(dial));
    const next = { ...values, prefijo: dial, telefono: formatPhone(digits) };
    setValues(next);
    if (touched.telefono) setErrors(validateDemo(next, lang));
  };

  const blur = (field: Field) => {
    setTouched((s) => ({ ...s, [field]: true }));
    setErrors(validateDemo(values, lang));
  };

  const field = (name: Field) => ({
    ref: refs[name],
    id: `f-${name}`,
    name,
    value: values[name],
    onBlur: () => blur(name),
    "aria-invalid": touched[name] && errors[name] ? true : undefined,
    "aria-describedby": touched[name] && errors[name] ? `f-${name}-err` : undefined,
  });

  const errorFor = (name: Field) =>
    touched[name] && errors[name] ? (
      <p id={`f-${name}-err`} className="form__field-error">
        {errors[name]}
      </p>
    ) : null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateDemo(values, lang);
    setErrors(found);
    setTouched({ nombre: true, empresa: true, email: true, telefono: true, zona: true });
    const first = (["nombre", "empresa", "email", "telefono", "zona"] as Field[]).find((f) => found[f]);
    if (first) {
      refs[first].current?.focus();
      return;
    }
    const form = new FormData(e.currentTarget);
    const digits = values.telefono.replace(/\s/g, "");
    setStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          telefono: digits ? `${values.prefijo} ${values.telefono}` : "",
          telefonoNacional: values.telefono,
          interes: form.get("interes"),
          web: form.get("web"),
          idioma: lang,
          ...(place
            ? {
                direccion: place.address,
                lng: place.lng,
                lat: place.lat,
                cp: place.postcode ?? "",
                municipio: place.municipality ?? "",
                modo: area.mode,
                minutos: area.minutes,
                admin: area.admin,
              }
            : {}),
        }),
      });
      if (res.ok) {
        setStatus("sent");
        onSent?.();
      } else {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          status?: number;
          detail?: string;
          fields?: Errors;
        };
        if (body.error === "invalid-fields" && body.fields) {
          setErrors(body.fields);
          setStatus("idle");
          return;
        }
        setErrorCode([body.error, body.status, body.detail].filter(Boolean).join(" · ") || `http ${res.status}`);
        setStatus("error");
      }
    } catch {
      setErrorCode("network");
      setStatus("error");
    }
  };

  const hasErrors = Object.keys(errors).some((k) => touched[k as Field]);

  return (
    <>
        {status === "sent" ? (
          <div className="form form--done" role="status">
            <p className="form__done-title">{t.done}</p>
            <p>{t.doneBody}</p>
            {BOOKING_URL && (
              <div className="form__book">
                <p>{t.bookIntro}</p>
                <a className="btn btn--primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  {t.book}
                </a>
              </div>
            )}
          </div>
        ) : (
          <form className={`form${variant === "panel" ? " form--panel" : ""}`} onSubmit={onSubmit} noValidate>
            <div className="form__row">
              <label htmlFor="f-nombre">{t.name}</label>
              <input {...field("nombre")} autoComplete="name" maxLength={80} onChange={(e) => update("nombre", e.target.value)} />
              {errorFor("nombre")}
            </div>
            <div className="form__row">
              <label htmlFor="f-empresa">{t.company}</label>
              <input
                {...field("empresa")}
                autoComplete="organization"
                maxLength={120}
                onChange={(e) => update("empresa", e.target.value)}
              />
              {errorFor("empresa")}
            </div>
            <div className="form__pair">
              <div className="form__row">
                <label htmlFor="f-email">{t.email}</label>
                <input
                  {...field("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  onChange={(e) => update("email", e.target.value)}
                />
                {errorFor("email")}
              </div>
              <div className="form__row">
                <label htmlFor="f-telefono">
                  {t.phone} <span className="form__opt">{t.optional}</span>
                </label>
                <div className="phone">
                  <PhonePrefix value={values.prefijo} onChange={onPrefix} lang={lang} label={t.prefix} />
                  <input
                    {...field("telefono")}
                    className="phone__number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder={values.prefijo === DEFAULT_PREFIX ? t.phonePh : ""}
                    onChange={(e) => onPhone(e.target.value)}
                  />
                </div>
                {errorFor("telefono")}
              </div>
            </div>
            {locationSlot}
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
            {hasErrors && status !== "sending" && (
              <p className="form__error" role="alert">
                {t.fixErrors}
              </p>
            )}
            {status === "error" && (
              <p className="form__error" role="alert">
                {t.error} <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>.
                {errorCode && <span className="form__code"> ({errorCode})</span>}
              </p>
            )}
            <p className="form__legal">
              {t.legal} <a href={route("privacy", lang)}>{t.privacy}</a>
            </p>
          </form>
        )}
    </>
  );
}

/** /contacto: heading, contact details and the form with its own location picker. */
export default function DemoForm() {
  const lang = useLang();
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [area, setArea] = useState<Area>(DEFAULT_AREA);

  return (
    <section id="demo" className="demo" data-hide-askbar aria-labelledby="demo-title">
      <div className="wrap demo__grid">
        <div className="demo__text">
          <h1 id="demo-title" className="page-title">
            {t.title}
          </h1>
          <p className="section-lede">{t.lede}</p>
          <ul className="demo__contact">
            <li>
              <a href="tel:+34938148787">938 148 787</a>
            </li>
            <li>
              <a href="mailto:hola@localtraffic.es">hola@localtraffic.es</a>
            </li>
          </ul>
        </div>
        <div className="demo__card">
          <DemoFormBody
            place={place}
            area={area}
            locationText={query}
            locationSlot={
              <div className="form__row">
                <label htmlFor="f-zona">{t.zone}</label>
                <LocationPicker
                  lang={lang}
                  inputId="f-zona"
                  query={query}
                  onQuery={setQuery}
                  place={place}
                  onPlace={setPlace}
                  area={area}
                  onArea={setArea}
                />
                {place && <MapPreview place={place} area={area} lang={lang} />}
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
