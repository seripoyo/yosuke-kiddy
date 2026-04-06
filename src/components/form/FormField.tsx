"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, required, error, children }: Props) {
  return (
    <div className="mb-6">
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-mincho text-[14px] font-light tracking-[0.02em] text-text"
      >
        {label}
        {required && (
          <span className="ml-1 text-[#C62828]" aria-label="必須">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="mt-2 flex items-start gap-1 text-[13px] text-[#C62828]"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true" className="mt-px shrink-0">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
