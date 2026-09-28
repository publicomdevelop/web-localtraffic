import { ImageResponse } from "next/og";

export const alt = "localtraffic · Datos que cambian decisiones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const lines = Array.from({ length: 14 }, (_, i) => i);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0E0B1C",
          color: "#ECEDF7",
          position: "relative",
        }}
      >
        {lines.map((i) => (
          <div
            key={`h${i}`}
            style={{ position: "absolute", left: 0, right: 0, top: i * 48, height: 1, background: "rgba(236,237,247,0.06)" }}
          />
        ))}
        {lines.map((i) => (
          <div
            key={`v${i}`}
            style={{ position: "absolute", top: 0, bottom: 0, left: 600 + i * 48, width: 1, background: "rgba(236,237,247,0.06)" }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 170,
            width: 300,
            height: 300,
            borderRadius: 300,
            border: "3px dashed #8A92FF",
            background: "rgba(51,64,245,0.18)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 600 }}>
          <div style={{ width: 22, height: 22, borderRadius: 22, background: "#3340F5", border: "5px solid #ECEDF7" }} />
          localtraffic
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 1, letterSpacing: -3, maxWidth: 760 }}>Datos que cambian decisiones.</div>
          <div style={{ fontSize: 30, marginTop: 28, color: "rgba(236,237,247,0.7)" }}>
            Datos geoespaciales con Inteligencia Humana
          </div>
        </div>
      </div>
    ),
    size,
  );
}
