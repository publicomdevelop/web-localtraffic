import { COMPANY, SITE_URL } from "@/lib/site";

// Branded HTML emails for the demo form. Table layout and inline styles, the
// only thing email clients (Outlook included) render reliably.

const INK = "#1E1633";
const MUTED = "#5B5676";
const BLUE = "#3340F5";
const NIGHT = "#0E0B1C";
const LINE = "#E6E5EF";

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c);

type Lang = "es" | "en";

function layout({ preheader, body, lang }: { preheader: string; body: string; lang: Lang }) {
  const footer =
    lang === "en"
      ? `localtraffic · Data that changes decisions<br>${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city} (${COMPANY.region}), Spain`
      : `localtraffic · Datos que cambian decisiones<br>${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city} (${COMPANY.region})`;
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>localtraffic</title></head>
<body style="margin:0;padding:0;background:#F3F3F8;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F3F8;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid ${LINE};">
<tr><td style="background:${NIGHT};padding:26px 32px;">
<a href="${SITE_URL}" style="text-decoration:none;"><img src="${SITE_URL}/logo-localtraffic.png" width="150" alt="localtraffic" style="display:block;border:0;width:150px;height:auto;"></a>
</td></tr>
<tr><td style="height:4px;background:${BLUE};line-height:4px;font-size:0;">&nbsp;</td></tr>
<tr><td style="padding:32px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:${INK};">
${body}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid ${LINE};font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:${MUTED};">
${footer}<br><a href="${SITE_URL}" style="color:${BLUE};text-decoration:none;">www.localtraffic.es</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="background:${BLUE};border-radius:999px;">
<a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${esc(label)}</a>
</td></tr></table>`;

export type DemoRequest = Record<"nombre" | "empresa" | "email" | "telefono" | "zona" | "interes" | "idioma", string>;

const LABELS: [keyof DemoRequest, string][] = [
  ["nombre", "Nombre"],
  ["empresa", "Empresa o entidad"],
  ["email", "Email"],
  ["telefono", "Teléfono"],
  ["zona", "Zona"],
  ["interes", "Le interesa"],
  ["idioma", "Idioma de la web"],
];

/** Internal notification to the localtraffic team. */
export function internalEmail(d: DemoRequest) {
  const rows = LABELS.map(
    ([k, label]) =>
      `<tr><td style="padding:10px 16px 10px 0;border-bottom:1px solid ${LINE};color:${MUTED};font-size:14px;white-space:nowrap;vertical-align:top;">${label}</td>` +
      `<td style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:15px;">${esc(d[k] || "—")}</td></tr>`,
  ).join("");
  const body = `<p style="margin:0 0 6px;font-size:13px;letter-spacing:.02em;color:${BLUE};font-weight:bold;">Nueva solicitud de demo</p>
<h1 style="margin:0 0 20px;font-size:24px;line-height:1.2;color:${INK};">${esc(d.empresa)}${d.zona ? ` · ${esc(d.zona)}` : ""}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
<p style="margin:20px 0 0;font-size:14px;color:${MUTED};">Responde a este correo para escribir directamente a ${esc(d.nombre)}.</p>`;
  return {
    subject: `Demo: ${d.empresa}${d.zona ? ` · ${d.zona}` : ""}`,
    html: layout({ preheader: `${d.nombre} (${d.empresa}) pide una demo`, body, lang: "es" }),
  };
}

/**
 * Confirmation to the person who asked for the demo. It only echoes their first
 * name (trimmed, no links), so the form can't be used to send spam to others.
 */
export function confirmationEmail(d: DemoRequest, bookingUrl?: string) {
  const lang: Lang = d.idioma === "en" ? "en" : "es";
  const first = (d.nombre.split(/\s+/)[0] || "").replace(/[^\p{L}\p{M}'-]/gu, "").slice(0, 30);
  const t =
    lang === "en"
      ? {
          subject: "We've received your demo request · localtraffic",
          pre: "Thanks for your interest. We'll be in touch shortly.",
          hi: first ? `Hi ${esc(first)},` : "Hi,",
          p1: "Thanks for your interest in localtraffic. We've received your demo request and will get back to you shortly to arrange a day and time.",
          p2: "In the demo we'll show you what we see in the area you're interested in, with real data, and work out together which analysis fits what you need to decide.",
          book: "Pick a slot now",
          bookText: "If you'd rather not wait, you can book a slot in our calendar right away:",
          p3: "If you want to tell us anything beforehand, just reply to this email.",
          sign: "The localtraffic team",
          ih: "Human Intelligence applied to geospatial data",
        }
      : {
          subject: "Hemos recibido tu solicitud de demo · localtraffic",
          pre: "Gracias por tu interés. Te escribimos en breve.",
          hi: first ? `Hola, ${esc(first)}:` : "Hola:",
          p1: "Gracias por tu interés en localtraffic. Hemos recibido tu solicitud de demo y te escribiremos en breve para concretar el día y la hora.",
          p2: "En la demo te enseñaremos lo que vemos en la zona que te interesa, con datos reales, y veremos juntos qué análisis encaja con lo que necesitas decidir.",
          book: "Elige día y hora",
          bookText: "Si prefieres no esperar, puedes reservar ya un hueco en nuestra agenda:",
          p3: "Si quieres adelantarnos algo, responde a este correo.",
          sign: "El equipo de localtraffic",
          ih: "Inteligencia Humana aplicada a los datos geoespaciales",
        };
  const booking = bookingUrl ? `<p style="margin:20px 0 0;">${t.bookText}</p>${button(bookingUrl, t.book)}` : "";
  const body = `<p style="margin:0 0 16px;">${t.hi}</p>
<p style="margin:0 0 16px;">${t.p1}</p>
<p style="margin:0;">${t.p2}</p>
${booking}
<p style="margin:20px 0 0;">${t.p3}</p>
<p style="margin:28px 0 0;font-weight:bold;">${t.sign}</p>
<p style="margin:2px 0 0;font-size:14px;color:${MUTED};">${t.ih}</p>`;
  return { subject: t.subject, html: layout({ preheader: t.pre, body, lang }) };
}
