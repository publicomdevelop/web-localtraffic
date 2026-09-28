// Demo form rules, shared by the browser (inline errors) and the API (the
// source of truth, since anyone can call it directly).

export type PhonePrefix = { dial: string; iso: string; es: string; en: string };

/** Spain first and selected by default; then nearby and common markets. */
export const PREFIXES: PhonePrefix[] = [
  { dial: "+34", iso: "ES", es: "España", en: "Spain" },
  { dial: "+376", iso: "AD", es: "Andorra", en: "Andorra" },
  { dial: "+351", iso: "PT", es: "Portugal", en: "Portugal" },
  { dial: "+33", iso: "FR", es: "Francia", en: "France" },
  { dial: "+39", iso: "IT", es: "Italia", en: "Italy" },
  { dial: "+49", iso: "DE", es: "Alemania", en: "Germany" },
  { dial: "+44", iso: "GB", es: "Reino Unido", en: "United Kingdom" },
  { dial: "+353", iso: "IE", es: "Irlanda", en: "Ireland" },
  { dial: "+32", iso: "BE", es: "Bélgica", en: "Belgium" },
  { dial: "+31", iso: "NL", es: "Países Bajos", en: "Netherlands" },
  { dial: "+41", iso: "CH", es: "Suiza", en: "Switzerland" },
  { dial: "+1", iso: "US", es: "EE. UU. / Canadá", en: "USA / Canada" },
  { dial: "+52", iso: "MX", es: "México", en: "Mexico" },
  { dial: "+54", iso: "AR", es: "Argentina", en: "Argentina" },
  { dial: "+56", iso: "CL", es: "Chile", en: "Chile" },
  { dial: "+57", iso: "CO", es: "Colombia", en: "Colombia" },
  { dial: "+51", iso: "PE", es: "Perú", en: "Peru" },
  { dial: "+212", iso: "MA", es: "Marruecos", en: "Morocco" },
];

export const DEFAULT_PREFIX = "+34";

/** Max national digits: Spain is always 9; elsewhere allow up to 12. */
export const maxDigits = (dial: string) => (dial === "+34" ? 9 : 12);

/** Digits grouped 3-3-3 (Spain) or in threes elsewhere: "612345678" → "612 345 678". */
export const formatPhone = (digits: string) => digits.replace(/(\d{3})(?=\d)/g, "$1 ");

export type Field = "nombre" | "empresa" | "email" | "telefono" | "zona";
export type Errors = Partial<Record<Field, string>>;

const MSG = {
  es: {
    nameReq: "Escribe tu nombre y apellido.",
    nameFull: "Escribe nombre y apellido.",
    nameBad: "Usa solo letras, espacios, guiones o apóstrofos.",
    companyReq: "Escribe el nombre de tu empresa o entidad.",
    emailReq: "Escribe tu email.",
    emailBad: "Revisa el email: debería ser algo como nombre@empresa.com.",
    phoneEs: "Un teléfono español tiene 9 cifras y empieza por 6, 7, 8 o 9.",
    phoneOther: "Revisa el teléfono: entre 6 y 12 cifras, sin el prefijo.",
    prefix: "Elige un prefijo de la lista.",
    tooLong: "Es demasiado largo.",
  },
  en: {
    nameReq: "Please enter your first and last name.",
    nameFull: "Please enter your first and last name.",
    nameBad: "Use letters, spaces, hyphens or apostrophes only.",
    companyReq: "Please enter your company or organisation.",
    emailReq: "Please enter your email.",
    emailBad: "Check the email: it should look like name@company.com.",
    phoneEs: "A Spanish phone number has 9 digits and starts with 6, 7, 8 or 9.",
    phoneOther: "Check the phone number: 6 to 12 digits, without the prefix.",
    prefix: "Choose a prefix from the list.",
    tooLong: "This is too long.",
  },
};

export type DemoInput = { nombre: string; empresa: string; email: string; prefijo: string; telefono: string; zona: string };

/** `telefono` holds national digits only (spaces allowed). Empty phone is fine: it's optional. */
export function validateDemo(d: DemoInput, lang: "es" | "en" = "es"): Errors {
  const m = MSG[lang];
  const e: Errors = {};
  const name = d.nombre.trim();
  if (!name) e.nombre = m.nameReq;
  else if (name.length > 80) e.nombre = m.tooLong;
  else if (!/^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u.test(name) || name.replace(/[^\p{L}]/gu, "").length < 2) e.nombre = m.nameBad;
  else if (name.split(/\s+/).filter((w) => w.replace(/[^\p{L}]/gu, "").length >= 2).length < 2) e.nombre = m.nameFull;

  const company = d.empresa.trim();
  if (company.length < 2) e.empresa = m.companyReq;
  else if (company.length > 120) e.empresa = m.tooLong;

  const email = d.email.trim();
  if (!email) e.email = m.emailReq;
  else if (email.length > 254 || !/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(email)) e.email = m.emailBad;

  const digits = d.telefono.replace(/\s/g, "");
  if (digits) {
    if (!PREFIXES.some((p) => p.dial === d.prefijo)) e.telefono = m.prefix;
    else if (!/^\d+$/.test(digits)) e.telefono = d.prefijo === "+34" ? m.phoneEs : m.phoneOther;
    else if (d.prefijo === "+34" && !/^[6789]\d{8}$/.test(digits)) e.telefono = m.phoneEs;
    else if (d.prefijo !== "+34" && (digits.length < 6 || digits.length > 12)) e.telefono = m.phoneOther;
  }

  if (d.zona.trim().length > 160) e.zona = m.tooLong;
  return e;
}
