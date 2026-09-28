import { cropPaths, VB_H, VB_W } from "@/components/illustrations/MapCrop";

// The isometric city behind every illustration, as a standalone SVG file.
// It is deterministic, so it is cached forever; bump MAPCROP_VERSION in
// MapCrop.tsx when the city drawing changes. Keeping it out of the page HTML
// saves ~150 KB per page (Next would otherwise inline it twice).

export function GET(_req: Request, { params }: { params: { file: string } }) {
  const m = params.file.match(/^v\d+_(\d{2,4})_(\d{2,4})_(\d(?:\.\d{1,2})?)\.svg$/);
  if (!m) return new Response("Not found", { status: 404 });
  const crop = { cx: Number(m[1]), cy: Number(m[2]), k: Number(m[3]) };
  if (crop.cx > 1600 || crop.cy > 1000 || crop.k < 0.2 || crop.k > 3) return new Response("Not found", { status: 404 });
  const { streets, avenues, lots } = cropPaths(crop);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${VB_W}" height="${VB_H}">
<path d="${streets}" stroke="rgba(236,237,247,0.1)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<path d="${avenues}" stroke="rgba(236,237,247,0.2)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="${lots.sideR}" fill="#1a1630"/>
<path d="${lots.sideL}" fill="#141026"/>
<path d="${lots.roofs}" fill="#231e3b" stroke="rgba(236,237,247,0.07)" stroke-width="0.6"/>
</svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
