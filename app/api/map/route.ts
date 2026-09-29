import { inSpain, MINUTES } from "@/lib/location";
import { SITE_URL } from "@/lib/site";

// Static map of an address with its area of influence drawn on it: the real
// walking/driving isochrone from Mapbox, or just the pin for administrative
// areas. Used for the preview in the demo panel and inside the emails, so the
// Mapbox token never has to travel in an email. The token is restricted by URL,
// so requests from here send our site as referrer.

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
const STYLE = "mapbox/dark-v11";
const SIZE = "640x420@2x";
const REFERER = { Referer: `${SITE_URL}/` };

type Geometry = { type: "Polygon" | "MultiPolygon"; coordinates: unknown };

/** Round to ~10 m and drop points until the overlay fits in a URL. */
function compact(geometry: Geometry) {
  const round = (n: number) => Math.round(n * 1e4) / 1e4;
  const ring = (pts: number[][], step: number) => {
    const out = pts.filter((_, i) => i % step === 0 || i === pts.length - 1).map(([x, y]) => [round(x), round(y)]);
    return out.length >= 4 ? out : pts.map(([x, y]) => [round(x), round(y)]);
  };
  for (let step = 1; step <= 12; step++) {
    const coords =
      geometry.type === "Polygon"
        ? (geometry.coordinates as number[][][]).map((r) => ring(r, step))
        : (geometry.coordinates as number[][][][]).map((poly) => poly.map((r) => ring(r, step)));
    const feature = {
      type: "Feature",
      properties: { fill: "#3340F5", "fill-opacity": 0.32, stroke: "#8A92FF", "stroke-width": 2.5, "stroke-opacity": 0.95 },
      geometry: { type: geometry.type, coordinates: coords },
    };
    const encoded = encodeURIComponent(JSON.stringify(feature));
    if (encoded.length < 6500) return `geojson(${encoded})`;
  }
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lng = Number(url.searchParams.get("lng"));
  const lat = Number(url.searchParams.get("lat"));
  const mode = url.searchParams.get("mode");
  const min = Number(url.searchParams.get("min"));
  if (!TOKEN) return new Response("Map not configured", { status: 503 });
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || !inSpain(lng, lat)) return new Response("Bad location", { status: 400 });
  if (mode !== "walk" && mode !== "drive" && mode !== "admin") return new Response("Bad mode", { status: 400 });
  if (mode !== "admin" && !(MINUTES as readonly number[]).includes(min)) return new Response("Bad minutes", { status: 400 });

  const pin = `pin-l+3340f5(${lng.toFixed(5)},${lat.toFixed(5)})`;
  let staticUrl = `https://api.mapbox.com/styles/v1/${STYLE}/static/${pin}/${lng.toFixed(5)},${lat.toFixed(5)},13/${SIZE}?access_token=${TOKEN}`;

  if (mode !== "admin") {
    const profile = mode === "walk" ? "walking" : "driving";
    const iso = await fetch(
      `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${lng.toFixed(5)},${lat.toFixed(5)}?contours_minutes=${min}&polygons=true&denoise=1&generalize=${mode === "walk" ? 20 : 60}&access_token=${TOKEN}`,
      { headers: REFERER },
    );
    if (iso.ok) {
      const data = (await iso.json()) as { features?: { geometry: Geometry }[] };
      const overlay = data.features?.[0] ? compact(data.features[0].geometry) : null;
      if (overlay) {
        staticUrl = `https://api.mapbox.com/styles/v1/${STYLE}/static/${overlay},${pin}/auto/${SIZE}?padding=48&access_token=${TOKEN}`;
      }
    } else {
      console.error("Mapbox isochrone error", iso.status, await iso.text());
    }
  }

  const img = await fetch(staticUrl, { headers: REFERER });
  if (!img.ok) {
    console.error("Mapbox static error", img.status, await img.text());
    return new Response("Map unavailable", { status: 502 });
  }
  return new Response(img.body, {
    headers: {
      "Content-Type": img.headers.get("Content-Type") || "image/png",
      // Same address and area always give the same picture.
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
    },
  });
}
