"use client";

import { useEffect, useId, useRef, useState } from "react";
// Only the flags we list, so the bundle doesn't ship every country.
import { AD, AR, BE, CH, CL, CO, DE, ES, FR, GB, IE, IT, MA, MX, NL, PE, PT, US } from "country-flag-icons/react/3x2";
import { PREFIXES, type PhonePrefix as Prefix } from "@/lib/demoValidation";
import type { Lang } from "@/lib/i18n";

const FLAGS = { AD, AR, BE, CH, CL, CO, DE, ES, FR, GB, IE, IT, MA, MX, NL, PE, PT, US } as const;

function Flag({ iso }: { iso: string }) {
  const C = FLAGS[iso as keyof typeof FLAGS];
  return C ? <C className="prefix__flag" aria-hidden="true" /> : null;
}

/**
 * Country-code picker: the closed button shows only flag + code; the list shows
 * flag, country and code. Keyboard: arrows, Home/End, Enter, Escape, type to jump.
 */
export default function PhonePrefix({
  value,
  onChange,
  lang,
  label,
}: {
  value: string;
  onChange: (dial: string) => void;
  lang: Lang;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const id = useId();
  const current: Prefix = PREFIXES.find((p) => p.dial === value) ?? PREFIXES[0];

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, PREFIXES.findIndex((p) => p.dial === value)));
    list.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (i: number) => {
    onChange(PREFIXES[i].dial);
    setOpen(false);
    button.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = PREFIXES.length - 1;
    if (e.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") button.current?.focus();
      return;
    } else if (/^[\p{L}\d+]$/u.test(e.key)) {
      // Type-ahead by country name or by code.
      const now = Date.now();
      typed.current.text = (now - typed.current.at > 700 ? "" : typed.current.text) + e.key.toLowerCase();
      typed.current.at = now;
      const q = typed.current.text;
      const i = PREFIXES.findIndex((p) => p[lang].toLowerCase().startsWith(q) || p.dial.startsWith(q.startsWith("+") ? q : `+${q}`));
      if (i >= 0) setActive(i);
    } else return;
    e.preventDefault();
  };

  return (
    <div className="prefix" ref={wrap}>
      <button
        ref={button}
        type="button"
        className="prefix__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${current[lang]} ${current.dial}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Flag iso={current.iso} />
        <span className="prefix__dial">{current.dial}</span>
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" className="prefix__chevron">
          <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          className="prefix__list"
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
        >
          {PREFIXES.map((p, i) => (
            <li
              key={p.dial}
              id={`${id}-opt-${i}`}
              data-index={i}
              role="option"
              aria-selected={p.dial === value}
              className={`prefix__option${i === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
            >
              <Flag iso={p.iso} />
              <span className="prefix__country">{p[lang]}</span>
              <span className="prefix__code">{p.dial}</span>
              {p.dial === value && (
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="prefix__check">
                  <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
