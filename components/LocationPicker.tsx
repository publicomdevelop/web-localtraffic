"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchAddress, mapboxReady, type Suggestion } from "@/lib/mapbox";
import { MINUTES, adminLabel, areaSummary, modeLabel, type Area, type Mode, type Place } from "@/lib/location";

const COPY = {
  es: {
    placeholder: "Escribe una dirección",
    label: "Dirección que quieres analizar",
    area: "Área de influencia",
    mode: "Cómo se llega",
    minutes: "Minutos",
    kind: "Tipo de área",
    none: "Sin resultados",
  },
  en: {
    placeholder: "Type an address",
    label: "Address you want to analyse",
    area: "Catchment area",
    mode: "How people get there",
    minutes: "Minutes",
    kind: "Type of area",
    none: "No results",
  },
};

export function ModeIcon({ mode, size = 18 }: { mode: Mode; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (mode === "walk")
    return (
      <svg {...common}>
        <circle cx="13" cy="4" r="1.8" />
        <path d="m9 21 2.5-6.5L14 17v4M8.5 11l2-3.5 3.5.8 2.5 3.2M11.5 14.5 10.5 8" />
      </svg>
    );
  if (mode === "drive")
    return (
      <svg {...common}>
        <path d="M5 16.5V12l1.8-4.4A2 2 0 0 1 8.7 6.4h6.6a2 2 0 0 1 1.9 1.2L19 12v4.5M5 12h14M5 16.5h14" />
        <circle cx="7.8" cy="16.5" r="1.7" />
        <circle cx="16.2" cy="16.5" r="1.7" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4 10h16M5.5 10V19M9.5 10V19M14.5 10V19M18.5 10V19M3.5 19.5h17M12 3.5 4 8h16Z" />
    </svg>
  );
}

type Props = {
  lang: "es" | "en";
  query: string;
  onQuery: (q: string) => void;
  place: Place | null;
  onPlace: (p: Place | null) => void;
  area: Area;
  onArea: (a: Area) => void;
  /** Open the suggestion list and mode menu upwards (for the bottom dock). */
  dropUp?: boolean;
  /** Smaller layout for the floating dock. */
  compact?: boolean;
  inputId?: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

/** Address autocomplete (Mapbox) plus the catchment area chip: on foot / by car / administrative. */
export default function LocationPicker({ lang, query, onQuery, place, onPlace, area, onArea, dropUp, compact, inputId, inputRef }: Props) {
  const t = COPY[lang];
  const id = useId();
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [menu, setMenu] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const skipNext = useRef(false);
  const fieldId = inputId ?? `${id}-q`;
  // Suggestions only open while the visitor is typing in this very field,
  // never when the picker mounts with an address already chosen.
  const isTyping = () => typeof document !== "undefined" && document.activeElement?.id === fieldId;

  // Debounced search; stale requests are aborted.
  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (!mapboxReady() || query.trim().length < 3 || !isTyping() || (place && query === place.address)) {
      setItems([]);
      setOpen(false);
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const found = await searchAddress(query, lang, ctrl.signal);
        setItems(found);
        setActive(-1);
        if (isTyping()) setOpen(true);
      } catch {
        // Aborted or offline: keep what we had.
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, lang]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setOpen(false);
        setMenu(false);
      }
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  const choose = (s: Suggestion) => {
    skipNext.current = true;
    onQuery(s.address);
    onPlace({ address: s.address, lng: s.lng, lat: s.lat, postcode: s.postcode, municipality: s.municipality });
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(items[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const setMode = (mode: Mode) => onArea({ ...area, mode });

  return (
    <div className={`loc${compact ? " loc--compact" : ""}${dropUp ? " loc--up" : ""}`} ref={wrap}>
      <div className="loc__field">
        <label htmlFor={fieldId} className="sr-only">
          {t.label}
        </label>
        <input
          ref={inputRef}
          id={fieldId}
          className="loc__input"
          value={query}
          placeholder={t.placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && items.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          onChange={(e) => {
            onQuery(e.target.value);
            if (place) onPlace(null);
          }}
          onFocus={() => {
            if (items.length && !(place && query === place.address)) setOpen(true);
          }}
          onKeyDown={onKey}
          maxLength={160}
        />
        {open && query.trim().length >= 3 && (
          <ul id={`${id}-list`} role="listbox" className="loc__list">
            {items.length === 0 && <li className="loc__empty">{t.none}</li>}
            {items.map((s, i) => (
              <li
                key={s.id}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={`loc__option${i === active ? " is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(s)}
              >
                <span className="loc__title">{s.title}</span>
                <span className="loc__sub">{s.subtitle}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {place && (
        <div className="loc__area">
          <button
            type="button"
            className="loc__chip"
            aria-haspopup="dialog"
            aria-expanded={menu}
            aria-label={`${t.area}: ${areaSummary(area, place, lang)}`}
            onClick={() => setMenu((m) => !m)}
          >
            <ModeIcon mode={area.mode} />
            <span>{area.mode === "admin" ? (area.admin === "cp" ? "CP" : lang === "en" ? "Town" : "Mun.") : `${area.minutes}'`}</span>
          </button>
          {menu && (
            <div className="loc__menu" role="dialog" aria-label={t.area}>
              <p className="loc__menu-head">{t.mode}</p>
              <div className="loc__modes" role="radiogroup" aria-label={t.mode}>
                {(["walk", "drive", "admin"] as Mode[]).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={area.mode === m} className="loc__mode" onClick={() => setMode(m)}>
                    <ModeIcon mode={m} />
                    <span>{modeLabel(m, lang)}</span>
                  </button>
                ))}
              </div>
              {area.mode === "admin" ? (
                <>
                  <p className="loc__menu-head">{t.kind}</p>
                  <div className="loc__seg" role="radiogroup" aria-label={t.kind}>
                    {(["cp", "municipio"] as const).map((k) => (
                      <button key={k} type="button" role="radio" aria-checked={area.admin === k} onClick={() => onArea({ ...area, admin: k })}>
                        {adminLabel(k, lang)}
                        <small>{k === "cp" ? place.postcode ?? "—" : place.municipality ?? "—"}</small>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="loc__menu-head">{t.minutes}</p>
                  <div className="loc__seg" role="radiogroup" aria-label={t.minutes}>
                    {MINUTES.map((m) => (
                      <button key={m} type="button" role="radio" aria-checked={area.minutes === m} onClick={() => onArea({ ...area, minutes: m })}>
                        {m} min
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Static map with the area drawn, from /api/map. */
export function MapPreview({ place, area, lang }: { place: Place | null; area: Area; lang: "es" | "en" }) {
  const [loaded, setLoaded] = useState(false);
  const src = place
    ? `/api/map?${new URLSearchParams({ lng: place.lng.toFixed(5), lat: place.lat.toFixed(5), mode: area.mode, min: String(area.minutes) })}`
    : "";
  useEffect(() => setLoaded(false), [src]);
  return (
    <figure className="mapprev">
      {place ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={`${place.address} · ${areaSummary(area, place, lang)}`}
            className={loaded ? "is-loaded" : undefined}
            onLoad={() => setLoaded(true)}
            width={640}
            height={420}
          />
          {!loaded && <span className="mapprev__loading" aria-hidden="true" />}
          <figcaption>
            <ModeIcon mode={area.mode} size={16} />
            {areaSummary(area, place, lang)}
          </figcaption>
        </>
      ) : (
        <p className="mapprev__empty">
          {lang === "en"
            ? "Type an address to see its catchment area on the map."
            : "Escribe una dirección para ver su área de influencia en el mapa."}
        </p>
      )}
    </figure>
  );
}
