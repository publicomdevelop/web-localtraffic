"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { route } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

const WORDS = {
  es: ["Datos que cambian decisiones", "Perfil del residente", "Perfil del visitante", "Origen del consumidor", "Inteligencia Humana"],
  en: ["Data that changes decisions", "Resident profile", "Visitor profile", "Consumer origin", "Human Intelligence"],
};

/** Oversized type that slides sideways with the scroll: a pause between sections. */
export function Marquee() {
  const lang = useLang();
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { xPercent: 0 },
        {
          xPercent: -35,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={track}>
        {[...WORDS[lang], ...WORDS[lang]].map((w, i) => (
          <span key={i} className={i % 2 ? "marquee__word marquee__word--outline" : "marquee__word"}>
            {w}
            <svg viewBox="0 0 40 52" className="marquee__pin">
              <path d="M20 1C9.5 1 1 9.4 1 19.8c0 7.4 4.3 12.3 9.3 18.6L20 51l9.7-12.6c5-6.3 9.3-11.2 9.3-18.6C39 9.4 30.5 1 20 1Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

const CTA = {
  es: {
    title: "¿Qué zona quieres entender?",
    body: "Dinos una ubicación, un barrio o un municipio y en la demo te enseñamos lo que vemos en ella.",
    button: "Pedir demo",
  },
  en: {
    title: "Which area do you want to understand?",
    body: "Tell us a location, a neighbourhood or a town and in the demo we'll show you what we see there.",
    button: "Book a demo",
  },
};

export function CtaBand({ title, body }: { title?: string; body?: string }) {
  const lang = useLang();
  const t = CTA[lang];
  return (
    <section className="cta-band" data-hide-askbar aria-labelledby="cta-title">
      <div className="wrap cta-band__inner">
        <h2 id="cta-title" className="cta-band__title">
          {title ?? t.title}
        </h2>
        <div>
          <p className="cta-band__body">{body ?? t.body}</p>
          <Link className="btn btn--light" href={route("contact", lang)}>
            {t.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
