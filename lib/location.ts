// The area of influence someone asks us about in the demo form, shared by the
// browser (picker, map preview) and the API (validation, email).

export type Mode = "walk" | "drive" | "admin";
export type AdminKind = "cp" | "municipio";

export const MINUTES = [10, 15, 20] as const;
export type Minutes = (typeof MINUTES)[number];

export type Place = {
  address: string;
  lng: number;
  lat: number;
  postcode?: string;
  municipality?: string;
};

export type Area = { mode: Mode; minutes: Minutes; admin: AdminKind };

export const DEFAULT_AREA: Area = { mode: "walk", minutes: 15, admin: "cp" };

type L = "es" | "en";

const T = {
  es: { walk: "A pie", drive: "En coche", admin: "Área administrativa", cp: "Código postal", municipio: "Municipio" },
  en: { walk: "On foot", drive: "By car", admin: "Administrative area", cp: "Postcode", municipio: "Municipality" },
};

export const modeLabel = (mode: Mode, lang: L) => T[lang][mode];
export const adminLabel = (kind: AdminKind, lang: L) => T[lang][kind];

/** "A pie · 15 min", "Código postal 08800", "Municipio Vilanova i la Geltrú". */
export function areaSummary(area: Area, place: Place | null, lang: L) {
  if (area.mode !== "admin") return `${T[lang][area.mode]} · ${area.minutes} min`;
  const value = area.admin === "cp" ? place?.postcode : place?.municipality;
  return `${T[lang][area.admin]}${value ? ` ${value}` : ""}`;
}

/** Spain, Balearic and Canary Islands, Ceuta and Melilla. */
export const inSpain = (lng: number, lat: number) => lng > -18.5 && lng < 4.6 && lat > 27.4 && lat < 44;

/** URL of the static map preview with the area drawn (served by /api/map). */
export function mapUrl(place: Place, area: Area, base = "") {
  const q = new URLSearchParams({
    lng: place.lng.toFixed(5),
    lat: place.lat.toFixed(5),
    mode: area.mode,
    min: String(area.minutes),
  });
  return `${base}/api/map?${q}`;
}

export const googleMapsUrl = (place: Place) => `https://www.google.com/maps?q=${place.lat.toFixed(5)},${place.lng.toFixed(5)}`;

/** Parse and check what the browser sent. Returns null if there is no usable location. */
export function parseLocation(body: Record<string, unknown>): { place: Place; area: Area } | null {
  const lng = Number(body.lng);
  const lat = Number(body.lat);
  const address = typeof body.direccion === "string" ? body.direccion.trim().slice(0, 200) : "";
  if (!address || !Number.isFinite(lng) || !Number.isFinite(lat) || !inSpain(lng, lat)) return null;
  const mode: Mode = body.modo === "drive" || body.modo === "admin" ? body.modo : "walk";
  const minutes = (MINUTES as readonly number[]).includes(Number(body.minutos)) ? (Number(body.minutos) as Minutes) : 15;
  const admin: AdminKind = body.admin === "municipio" ? "municipio" : "cp";
  const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 80) : undefined);
  return {
    place: { address, lng, lat, postcode: str(body.cp), municipality: str(body.municipio) },
    area: { mode, minutes, admin },
  };
}
