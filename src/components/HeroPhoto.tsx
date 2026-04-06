"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroPhoto() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="absolute inset-0 bg-[#F5F5F5]"
        aria-hidden="true"
      >
        <div className="flex h-full items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#BDBDBD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <Image
      src="/photos/hero.jpg"
      alt="伊藤陽介さんの写真"
      fill
      priority
      quality={85}
      className="object-cover opacity-20"
      onError={() => setHasError(true)}
    />
  );
}
