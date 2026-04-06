"use client";

import {
  useRef,
  useCallback,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  variant?: Variant;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  children,
  disabled,
  className = "",
  ...rest
}: Props) {
  const svgRef = useRef<SVGRectElement>(null);

  const animateBorder = useCallback(
    (reverse: boolean) => {
      const rect = svgRef.current;
      if (!rect || variant === "ghost") return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      rect.animate(
        [
          { strokeDashoffset: reverse ? "0" : "100%" },
          { strokeDashoffset: reverse ? "100%" : "0" },
        ],
        {
          duration: 400,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );
    },
    [variant]
  );

  if (variant === "ghost") {
    return (
      <button
        disabled={disabled}
        className={`
          group relative inline-flex h-12 items-center
          font-mincho text-[14px] font-light tracking-[0.05em]
          text-sub
          transition-colors duration-200
          hover:text-text active:text-text
          disabled:cursor-not-allowed disabled:opacity-35
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pressed
          ${className}
        `}
        {...rest}
      >
        <span className="relative">
          {children}
          <span
            className="absolute -bottom-0.5 left-0 h-px w-full bg-current transition-all duration-200 group-hover:h-0.5 group-active:h-0.5"
          />
        </span>
      </button>
    );
  }

  const variantStyles: Record<Exclude<Variant, "ghost">, {
    base: string;
    active: string;
    borderColor: string;
  }> = {
    primary: {
      base: "bg-pressed/15 border-pressed text-text",
      active: "active:bg-pressed active:text-white",
      borderColor: "#a06a8c",
    },
    secondary: {
      base: "bg-transparent border-text text-text",
      active: "active:bg-text/[0.08]",
      borderColor: "#484848",
    },
  };

  const styles = variantStyles[variant];

  return (
    <button
      disabled={disabled}
      className={`
        group relative inline-flex h-12 items-center justify-center gap-3
        rounded-[2px] border px-7
        font-mincho text-[14px] font-light tracking-[0.05em]
        transition-all duration-300
        ${styles.base}
        ${styles.active}
        disabled:cursor-not-allowed disabled:opacity-35
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pressed
        ${className}
      `}
      onPointerDown={() => animateBorder(false)}
      onPointerUp={() => animateBorder(true)}
      onPointerLeave={() => animateBorder(true)}
      {...rest}
    >
      {/* SVG border animation overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect
          ref={svgRef}
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          rx="2"
          ry="2"
          fill="none"
          stroke={styles.borderColor}
          strokeWidth="2"
          strokeDasharray="100%"
          strokeDashoffset="100%"
        />
      </svg>
      <span>{children}</span>
      <span className="text-[10px] leading-none" aria-hidden="true">
        ▶
      </span>
    </button>
  );
}
