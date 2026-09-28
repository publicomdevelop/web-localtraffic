"use client";

import { useEffect, useRef } from "react";
import { getCity, type Vec } from "@/lib/city/model";
import { CityRenderer, type Camera, type Layers } from "@/lib/city/renderer";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  layers: Layers;
  camera: Camera;
  catchment?: { center: Vec; radius: number } | null;
  walkers?: number;
  className?: string;
  /** Called once the renderer exists, e.g. to position DOM overlays per frame. */
  onReady?: (renderer: CityRenderer) => void;
};

export default function CityCanvas({ layers, camera, catchment = null, walkers = 700, className, onReady }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CityRenderer | null>(null);
  const reduced = usePrefersReducedMotion();
  const initial = useRef({ layers, camera, walkers, onReady });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const { layers: l, camera: c, walkers: n, onReady: ready } = initial.current;
    const renderer = new CityRenderer(canvas, getCity(), { walkers: n, camera: c, layers: l });
    rendererRef.current = renderer;

    const ro = new ResizeObserver(() => {
      const rect = wrap.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => renderer.setVisible(entry.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(wrap);
    ready?.(renderer);
    return () => {
      ro.disconnect();
      io.disconnect();
      renderer.stop();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    r.reducedMotion = reduced;
    if (reduced) {
      r.stop();
      r.refresh();
    } else {
      r.start();
    }
  }, [reduced]);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    r.targetLayers = { ...layers };
    r.targetCamera = { ...camera };
    r.catchment = catchment;
    if (r.reducedMotion) r.refresh();
  }, [layers, camera, catchment]);

  return (
    <div ref={wrapRef} className={className} style={{ overflow: "hidden" }}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ display: "block" }} />
    </div>
  );
}
