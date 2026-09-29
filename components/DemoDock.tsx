"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LocationPicker, { MapPreview } from "@/components/LocationPicker";
import { DemoFormBody } from "@/components/DemoForm";
import { DEFAULT_AREA, type Area, type Place } from "@/lib/location";
import { langFromPath, route } from "@/lib/i18n";

const COPY = {
  es: {
    cta: "Pedir demo",
    title: "Tu demo con esta zona",
    lede: "Revisa el área de influencia y déjanos tus datos. Te enseñaremos lo que vemos en ella.",
    close: "Cerrar",
    dialog: "Pedir demo",
  },
  en: {
    cta: "Book a demo",
    title: "Your demo for this area",
    lede: "Check the catchment area and leave us your details. We'll show you what we see there.",
    close: "Close",
    dialog: "Book a demo",
  },
};

/**
 * Floating demo dock. Collapsed: address autocomplete + catchment chip + CTA.
 * On "Pedir demo" it lifts off the bottom, flies to the centre and grows into a
 * panel with the map of the area and the demo form. Hidden on the contact page
 * and while any `data-hide-askbar` element (demo form, CTA band) is on screen.
 */
export default function DemoDock() {
  const path = usePathname();
  const lang = langFromPath(path);
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [area, setArea] = useState<Area>(DEFAULT_AREA);
  const [open, setOpen] = useState(false);
  const [covered, setCovered] = useState(false);
  const dock = useRef<HTMLFormElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const from = useRef<DOMRect | null>(null);
  const closeTimer = useRef<number>();

  const reset = () => {
    setQuery("");
    setPlace(null);
    setArea(DEFAULT_AREA);
  };

  // After a successful request: show "Recibido" for 3 s, close, and start clean.
  const onSent = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      reset();
    }, 3000);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    setCovered(false);
    setOpen(false);
    const targets = document.querySelectorAll("[data-hide-askbar]");
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setCovered(visible.size > 0);
      },
      { threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  const onContact = path === route("contact", "es") || path === route("contact", "en");
  const hidden = covered || onContact || open;

  const openPanel = (e?: React.FormEvent) => {
    e?.preventDefault();
    from.current = dock.current?.getBoundingClientRect() ?? null;
    setOpen(true);
  };

  // FLIP: the panel starts where the dock was and flies to the centre, growing.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!open || !el) return;
    document.body.classList.add("has-demo-panel");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = from.current;
    if (a && !reduce) {
      const b = el.getBoundingClientRect();
      const dx = a.left + a.width / 2 - (b.left + b.width / 2);
      const dy = a.top + a.height / 2 - (b.top + b.height / 2);
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${a.width / b.width}, ${a.height / b.height})`, borderRadius: "999px", opacity: 0.6 },
          { transform: `translate(${dx * 0.35}px, ${dy * 0.55}px) scale(${Math.max(0.6, a.width / b.width)}, 0.35)`, borderRadius: "40px", opacity: 1, offset: 0.4 },
          { transform: "none", borderRadius: "24px", opacity: 1 },
        ],
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      el.querySelector(".dpanel__inner")?.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }], { duration: 650, easing: "ease-out" });
    }
    return () => document.body.classList.remove("has-demo-panel");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (onContact) return null;

  return (
    <>
      <form ref={dock} className={`askbar dock${hidden ? " is-hidden" : ""}`} onSubmit={openPanel} aria-hidden={hidden || undefined}>
        <svg viewBox="0 0 40 52" width="14" height="18" aria-hidden="true" className="askbar__pin">
          <path d="M20 1C9.5 1 1 9.4 1 19.8c0 7.4 4.3 12.3 9.3 18.6L20 51l9.7-12.6c5-6.3 9.3-11.2 9.3-18.6C39 9.4 30.5 1 20 1Z" fill="#3340F5" />
          <circle cx="20" cy="19.5" r="6" fill="#ECEDF7" />
        </svg>
        {!open && (
          <LocationPicker
            lang={lang}
            query={query}
            onQuery={setQuery}
            place={place}
            onPlace={setPlace}
            area={area}
            onArea={setArea}
            dropUp
            compact
            inputId="dock-address"
          />
        )}
        <button type="submit" className="askbar__go" tabIndex={hidden ? -1 : 0}>
          {t.cta}
        </button>
      </form>

      {open && (
        <div className="dpanel-backdrop" onClick={() => setOpen(false)}>
          <div
            ref={panel}
            className="dpanel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dpanel-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dpanel__inner">
              <button type="button" className="dpanel__close" onClick={() => setOpen(false)} aria-label={t.close}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <div className="dpanel__map">
                <h2 id="dpanel-title" className="dpanel__title">
                  {t.title}
                </h2>
                <p className="dpanel__lede">{t.lede}</p>
                <LocationPicker
                  lang={lang}
                  query={query}
                  onQuery={setQuery}
                  place={place}
                  onPlace={setPlace}
                  area={area}
                  onArea={setArea}
                  inputId="dpanel-address"
                />
                <MapPreview place={place} area={area} lang={lang} />
              </div>
              <div className="dpanel__form">
                <DemoFormBody variant="panel" place={place} area={area} locationText={query} onSent={onSent} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
