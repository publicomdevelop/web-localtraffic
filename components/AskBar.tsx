"use client";

import { useEffect, useState } from "react";
import { ZONE_EVENT } from "@/components/DemoForm";

/** Floating "¿Qué zona quieres analizar?" bar. Hides while the demo form is on screen. */
export default function AskBar() {
  const [value, setValue] = useState("");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const demo = document.getElementById("demo");
    if (!demo) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(demo);
    return () => io.disconnect();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(ZONE_EVENT, { detail: value.trim() }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("demo")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <form className={`askbar${hidden ? " is-hidden" : ""}`} onSubmit={onSubmit} aria-hidden={hidden || undefined}>
      <label htmlFor="askbar-input" className="sr-only">
        ¿Qué zona quieres analizar?
      </label>
      <svg viewBox="0 0 40 52" width="14" height="18" aria-hidden="true" className="askbar__pin">
        <path d="M20 1C9.5 1 1 9.4 1 19.8c0 7.4 4.3 12.3 9.3 18.6L20 51l9.7-12.6c5-6.3 9.3-11.2 9.3-18.6C39 9.4 30.5 1 20 1Z" fill="#3340F5" />
        <circle cx="20" cy="19.5" r="6" fill="#ECEDF7" />
      </svg>
      <input
        id="askbar-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="¿Qué zona quieres analizar?"
        tabIndex={hidden ? -1 : 0}
      />
      <button type="submit" className="askbar__go" tabIndex={hidden ? -1 : 0}>
        Pedir demo
      </button>
    </form>
  );
}
