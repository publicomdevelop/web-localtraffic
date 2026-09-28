import { NextResponse } from "next/server";

const FIELDS = ["nombre", "empresa", "email", "telefono", "zona", "interes"] as const;

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // Honeypot: bots fill the hidden "web" field. Pretend success.
  if (typeof body.web === "string" && body.web.trim()) return NextResponse.json({ ok: true });

  const data: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = body[f];
    data[f] = typeof v === "string" ? v.trim().slice(0, 500) : "";
  }
  if (!data.nombre || !data.empresa || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "missing" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; demo request not sent", data.email);
    return NextResponse.json({ error: "not-configured" }, { status: 500 });
  }

  const rows = FIELDS.map(
    (f) =>
      `<tr><td style="padding:4px 12px 4px 0;color:#666">${f}</td><td style="padding:4px 0">${escape(data[f] || "—")}</td></tr>`,
  ).join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Web localtraffic <noreply@localtraffic.app>",
      to: [process.env.DEMO_TO_EMAIL || "hola@localtraffic.es"],
      reply_to: data.email,
      subject: `Demo: ${data.empresa}${data.zona ? ` · ${data.zona}` : ""}`,
      html: `<h2 style="font-family:sans-serif">Nueva solicitud de demo</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
