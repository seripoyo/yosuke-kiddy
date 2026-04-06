"use client";

import {
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
  if (variant === "ghost") {
    return (
      <button
        disabled={disabled}
        className={`
          group relative inline-flex items-center
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
          <span className="absolute -bottom-0.5 left-0 h-px w-full bg-current transition-all duration-200 group-hover:h-0.5 group-active:h-0.5" />
        </span>
      </button>
    );
  }

  const isPrimary = variant === "primary";

  return (
    <button
      disabled={disabled}
      className={`
        group relative inline-flex w-[65%] items-center justify-center
        border px-5 py-[15px]
        font-mincho text-[14px] font-light tracking-[0.05em] text-text
        transition-all duration-100
        active:translate-x-[7px] active:translate-y-[7px]
        disabled:cursor-not-allowed disabled:opacity-35
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pressed
        before:absolute before:-bottom-[7px] before:-right-[7px] before:h-px before:w-full before:transition-all before:duration-100
        after:absolute after:-bottom-[7px] after:-right-[7px] after:h-full after:w-px after:transition-all after:duration-100
        active:before:h-0 active:after:w-0
        ${isPrimary
          ? "border-pressed before:bg-pressed after:bg-pressed"
          : "border-text before:bg-text after:bg-text"
        }
        ${className}
      `}
      {...rest}
    >
      <span>{children}</span>
    </button>
  );
}
