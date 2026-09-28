"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CityCanvas from "@/components/city/CityCanvas";
import AnimatedNumber from "@/components/AnimatedNumber";
import { getCity, zoneStats, UNITS_PER_100M, WORLD_W, WORLD_H, type Vec } from "@/lib/city/model";
import type { CityRenderer, Layers } from "@/lib/city/renderer";
import { formatInt } from "@/lib/format";

type Chip = "residentes" | "visitantes" | "consumo";

const LAYER_BUTTONS: { key: Chip; label: string }[] = [
  { key: "residentes", label: "Residentes" },
  { key: "visitantes", label: "Visitantes" },
  { key: "consumo", label: "Consumo" },
];

/** 800 m around the pin. */
const RADIUS = UNITS_PER_100M * 8;

const clampPin = (p: Vec): Vec => ({
  x: Math.min(WORLD_W - 140, Math.max(140, p.x)),
  y: Math.min(WORLD_H - 120, Math.max(120, p.y)),
});

export default function Hero() {
  const [pin, setPin] = useState<Vec>({ x: 700, y: 470 });
  const [on, setOn] = useState<Record<Chip, boolean>>({
    residentes: false,
    visitantes: true,
    consumo: true,
  });
  const [narrow, setNarrow] = useState(false);
  const [touched, setTouched] = useState(false);
  const pinRef = useRef(pin);
  const pinEl = useRef<HTMLButtonElement>(null);
  const renderer = useRef<CityRenderer | null>(null);
  const dragging = useRef(false);
  const pending = useRef<Vec | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    setNarrow(mq.matches);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const city = getCity();
  const catchment = useMemo(() => ({ center: pin, radius: RADIUS }), [pin]);
  const stats = useMemo(() => zoneStats(city, pin, RADIUS), [city, pin]);

  const layers: Layers = useMemo(
    () => ({
      consumo: on.consumo ? 0.85 : 0,
      movilidad: on.visitantes ? 0.9 : 0,
      trafico: on.visitantes ? 0.7 : 0,
      publico: on.residentes ? 0.8 : 0,
    }),
    [on],
  );
  const camera = useMemo(
    () => (narrow ? { x: 720, y: 500, zoom: 2.2 } : { x: 800, y: 520, zoom: 1.3 }),
    [narrow],
  );

  const placePinEl = useCallback(() => {
    const r = renderer.current;
    const el = pinEl.current;
    if (!r || !el) return;
    const s = r.worldToScreen(pinRef.current);
    el.style.transform = `translate(${s.x}px, ${s.y}px)`;
  }, []);

  const onReady = useCallback(
    (r: CityRenderer) => {
      renderer.current = r;
      r.onFrame = placePinEl;
      placePinEl();
    },
    [placePinEl],
  );

  const movePin = useCallback(
    (p: Vec) => {
      const next = clampPin(p);
      pinRef.current = next;
      placePinEl();
      pending.current = next;
      if (!frame.current) {
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          if (pending.current) setPin(pending.current);
        });
      }
    },
    [placePinEl],
  );

  const toWorld = (e: { clientX: number; clientY: number }, target: HTMLElement) => {
    const r = renderer.current;
    const box = target.getBoundingClientRect();
    if (!r) return null;
    return r.screenToWorld({ x: e.clientX - box.left, y: e.clientY - box.top });
  };

  const mapRef = useRef<HTMLDivElement>(null);

  const onPinPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragging.current = true;
    setTouched(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPinPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current || !mapRef.current) return;
    const w = toWorld(e, mapRef.current);
    if (w) movePin(w);
  };
  const onPinPointerUp = () => {
    dragging.current = false;
  };
  const onMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const w = toWorld(e, e.currentTarget);
    if (w) {
      setTouched(true);
      movePin(w);
    }
  };
  const onPinKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 60 : 20;
    const d: Record<string, Vec> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    setTouched(true);
    movePin({ x: pinRef.current.x + v.x, y: pinRef.current.y + v.y });
  };

  // Scale bar length in screen px for 200 m.
  const [barPx, setBarPx] = useState(60);
  useEffect(() => {
    const id = window.setInterval(() => {
      const r = renderer.current;
      if (!r) return;
      const a = r.worldToScreen({ x: 0, y: 0 });
      const b = r.worldToScreen({ x: UNITS_PER_100M * 2, y: 0 });
      setBarPx(Math.round(b.x - a.x));
    }, 500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__intro wrap">
        <h1 id="hero-title" className="hero__title">
          Datos que cambian decisiones.
        </h1>
        <p className="hero__lede">
          Datos geoespaciales con Inteligencia Humana. Reunimos todo lo que se puede saber de un lugar, lo
          interpretamos y te decimos qué hacer: dónde abrir, qué zona impulsar o qué campaña activar.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="/contacto">
            Pedir demo
          </a>
          <a className="btn btn--ghost" href="/enfoque">
            Cómo trabajamos
          </a>
        </div>
      </div>

      <div className="hero__stage wrap-wide">
        <div className="map" ref={mapRef} onClick={onMapClick}>
          <CityCanvas className="map__canvas" layers={layers} camera={camera} catchment={catchment} onReady={onReady} />

          <button
            ref={pinEl}
            type="button"
            className="map__pin"
            aria-label="Punto de análisis. Arrástralo o muévelo con las flechas del teclado."
            onPointerDown={onPinPointerDown}
            onPointerMove={onPinPointerMove}
            onPointerUp={onPinPointerUp}
            onPointerCancel={onPinPointerUp}
            onKeyDown={onPinKey}
          >
            <svg viewBox="0 0 40 52" width="34" height="44" aria-hidden="true">
              <path
                d="M20 1C9.5 1 1 9.4 1 19.8c0 7.4 4.3 12.3 9.3 18.6L20 51l9.7-12.6c5-6.3 9.3-11.2 9.3-18.6C39 9.4 30.5 1 20 1Z"
                fill="#3340F5"
                stroke="#ECEDF7"
                strokeOpacity=".9"
                strokeWidth="1.5"
              />
              <circle cx="20" cy="19.5" r="6" fill="#ECEDF7" />
            </svg>
            {!touched && <span className="map__hint">Arrástrame</span>}
          </button>

          <div className="map__layers" role="group" aria-label="Capas de datos">
            {LAYER_BUTTONS.map((b) => (
              <button
                key={b.key}
                type="button"
                className={`chip chip--${b.key}`}
                aria-pressed={on[b.key]}
                onClick={() => setOn((s) => ({ ...s, [b.key]: !s[b.key] }))}
              >
                <span className="chip__dot" aria-hidden="true" />
                {b.label}
              </button>
            ))}
          </div>

          <div className="map__scale" aria-hidden="true">
            <span className="map__scale-bar" style={{ width: barPx }} />
            <span>200 m</span>
          </div>
        </div>

        <aside className="stats" aria-live="polite" aria-label="Datos de la zona seleccionada">
          <p className="stats__head">
            <span className="mono">Radio de 800 m</span>
            <span className="stats__note">alrededor del pin</span>
          </p>
          <div className="stats__group">
            <p className="stats__label">Perfil del residente</p>
            <dl className="stats__list">
              <div className="stats__row stats__row--publico">
                <dt>Residentes</dt>
                <dd>
                  <AnimatedNumber value={stats.residentes} format={formatInt} />
                </dd>
              </div>
              <div className="stats__row stats__row--publico">
                <dt>Renta por hogar</dt>
                <dd>
                  <AnimatedNumber value={stats.rentaHogar} format={(v) => `${formatInt(v)} €`} />
                </dd>
              </div>
            </dl>
          </div>
          <div className="stats__group">
            <p className="stats__label">Perfil del visitante</p>
            <dl className="stats__list">
              <div className="stats__row stats__row--movilidad">
                <dt>Visitas al mes</dt>
                <dd>
                  <AnimatedNumber value={stats.visitasMes} format={formatInt} />
                </dd>
              </div>
              <div className="stats__row stats__row--movilidad">
                <dt>Tiempo medio de visita</dt>
                <dd>
                  <AnimatedNumber value={stats.minutosVisita} format={(v) => `${formatInt(v)} min`} />
                </dd>
              </div>
            </dl>
          </div>
          <div className="stats__group">
            <p className="stats__label">Origen del consumidor</p>
            <dl className="stats__list">
              <div className="stats__row stats__row--consumo">
                <dt>Compran desde fuera de la zona</dt>
                <dd>
                  <AnimatedNumber value={stats.foraneos} format={(v) => `${formatInt(v)} %`} />
                </dd>
              </div>
            </dl>
          </div>
          <p className="stats__foot">Ciudad ilustrada con datos de ejemplo. En la demo, tu zona real.</p>
        </aside>
      </div>
    </section>
  );
}
