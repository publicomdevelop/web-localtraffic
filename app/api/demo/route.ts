import { NextResponse } from "next/server";
import { confirmationEmail, internalEmail, type DemoRequest } from "@/lib/email";

const FIELDS = ["nombre", "empresa", "email", "telefono", "zona", "interes", "idioma"] as const;

const FROM = "localtraffic <noreply@localtraffic.app>";
const TEAM = process.env.DEMO_TO_EMAIL || "hola@localtraffic.es";

async function send(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) return null;
  // Resend explains the problem (invalid key, unverified domain…). It never contains the key.
  const text = await res.text();
  console.error("Resend error", res.status, text);
  let detail = "";
  try {
    detail = String((JSON.parse(text) as { message?: string }).message ?? "");
  } catch {
    detail = text.slice(0, 200);
  }
  return { status: res.status, detail };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // Honeypot: bots fill the hidden "web" field. Pretend success.
  if (typeof body.web === "string" && body.web.trim()) return NextResponse.json({ ok: true });

  const data = {} as DemoRequest;
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

  const team = internalEmail(data);
  const failed = await send(apiKey, { from: FROM, to: [TEAM], reply_to: data.email, subject: team.subject, html: team.html });
  if (failed) return NextResponse.json({ error: "send-failed", ...failed }, { status: 502 });

  // The request already reached the team; a failed confirmation is only logged.
  const confirm = confirmationEmail(data, process.env.NEXT_PUBLIC_BOOKING_URL || undefined);
  await send(apiKey, { from: FROM, to: [data.email], reply_to: TEAM, subject: confirm.subject, html: confirm.html });

  return NextResponse.json({ ok: true });
}
