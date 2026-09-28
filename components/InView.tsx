"use client";

import { createElement, useEffect, useRef, useState } from "react";

/** Adds `is-in` once the element scrolls into view, so CSS can draw charts. */
export default function InView({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: "div" | "li" | "figure";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(
    Tag,
    {
      ref: (node: HTMLElement | null) => {
        ref.current = node;
      },
      className: `${className}${seen ? " is-in" : ""}`,
    },
    children,
  );
}
