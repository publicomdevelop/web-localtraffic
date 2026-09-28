"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Props = { value: number; format: (v: number) => string };

export default function AnimatedNumber({ value, format }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ v: value });
  const reduced = usePrefersReducedMotion();
  const formatRef = useRef(format);
  formatRef.current = format;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = current.current;
    if (reduced) {
      state.v = value;
      el.textContent = formatRef.current(value);
      return;
    }
    const tween = gsap.to(state, {
      v: value,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatRef.current(state.v);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, reduced]);

  return <span ref={ref}>{format(value)}</span>;
}
