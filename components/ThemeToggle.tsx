"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/useLang";

type Theme = "dark" | "light";
const KEY = "lt:theme";

/** Floating light/dark switch (bottom right). The choice is remembered per browser. */
export default function ThemeToggle() {
  const lang = useLang();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Storage blocked: the switch still works for this visit.
    }
  };

  const toLight = theme === "dark";
  const label =
    lang === "en" ? (toLight ? "Switch to light mode" : "Switch to dark mode") : toLight ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {toLight ? (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
        </svg>
      )}
    </button>
  );
}
