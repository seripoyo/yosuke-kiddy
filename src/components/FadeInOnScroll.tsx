"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "fade" | "slide-up";
  delay?: number;
};

export function FadeInOnScroll({
  children,
  variant = "fade",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseStyle = {
    transitionProperty: "opacity, transform",
    transitionDuration: "600ms",
    transitionTimingFunction: "ease-out",
    transitionDelay: `${delay}ms`,
  };

  const hiddenStyle =
    variant === "slide-up"
      ? { opacity: 0, transform: "translateY(20px)" }
      : { opacity: 0 };

  const visibleStyle =
    variant === "slide-up"
      ? { opacity: 1, transform: "translateY(0)" }
      : { opacity: 1 };

  return (
    <div
      ref={ref}
      style={{
        ...baseStyle,
        ...(isVisible ? visibleStyle : hiddenStyle),
      }}
    >
      {children}
    </div>
  );
}
