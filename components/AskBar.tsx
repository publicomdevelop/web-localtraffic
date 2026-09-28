"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const ZONE_KEY = "lt:zona";

/**
 * Floating "¿Qué zona quieres analizar?" bar. Hides on the contact page and
 * while any element marked `data-hide-askbar` is on screen.
 */
export default function AskBar() {
  const [value, setValue] = useState("");
  const [covered, setCovered] = useState(false);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCovered(false);
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
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [path]);

  const hidden = covered || path === "/contacto";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(ZONE_KEY, value.trim());
    } catch {
      // Storage can be blocked; the form still opens, just without the zone filled in.
    }
    router.push("/contacto");
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
