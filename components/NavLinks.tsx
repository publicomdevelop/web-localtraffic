"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export default function NavLinks({ items }: { items: Item[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const isActive = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <>
      <nav aria-label="Principal" className="header__nav">
        {items.map((i) => (
          <Link key={i.href} href={i.href} aria-current={isActive(i.href) ? "page" : undefined}>
            {i.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Cerrar" : "Menú"}
      </button>
      <nav id="mobile-menu" aria-label="Principal" className={`mobile-menu${open ? " is-open" : ""}`} hidden={!open}>
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>
          Inicio
        </Link>
        {items.map((i) => (
          <Link key={i.href} href={i.href} aria-current={isActive(i.href) ? "page" : undefined}>
            {i.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
