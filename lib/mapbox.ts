"use client";

import type { Place } from "@/lib/location";

// Address autocomplete with Mapbox Geocoding v6 (browser side). The token is a
// public "pk." token restricted to our domains in the Mapbox dashboard.

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const mapboxReady = () => TOKEN.length > 0;

export type Suggestion = Place & { id: string; title: string; subtitle: string };

type Feature = {
  id: string;
  properties: {
    name?: string;
    full_address?: string;
    place_formatted?: string;
    coordinates?: { longitude: number; latitude: number };
    context?: {
      postcode?: { name?: string };
      place?: { name?: string };
      locality?: { name?: string };
    };
  };
};

export async function searchAddress(query: string, lang: "es" | "en", signal?: AbortSignal): Promise<Suggestion[]> {
  if (!TOKEN || query.trim().length < 3) return [];
  const q = new URLSearchParams({
    q: query,
    country: "es",
    language: lang,
    autocomplete: "true",
    limit: "5",
    types: "address,street,neighborhood,locality,place,postcode",
    access_token: TOKEN,
  });
  const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${q}`, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as { features?: Feature[] };
  return (data.features ?? [])
    .filter((f) => f.properties.coordinates)
    .map((f) => {
      const p = f.properties;
      const ctx = p.context ?? {};
      return {
        id: f.id,
        title: p.name ?? "",
        subtitle: p.place_formatted ?? "",
        address: p.full_address ?? [p.name, p.place_formatted].filter(Boolean).join(", "),
        lng: p.coordinates!.longitude,
        lat: p.coordinates!.latitude,
        postcode: ctx.postcode?.name,
        municipality: ctx.place?.name ?? ctx.locality?.name,
      };
    });
}
