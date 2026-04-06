"use client";

import Image from "next/image";
import { useState } from "react";

const photos = [
  { src: "/photos/about-1.jpg", alt: "陽介さんの思い出の写真 1" },
  { src: "/photos/about-2.jpg", alt: "陽介さんの思い出の写真 2" },
  { src: "/photos/about-3.jpg", alt: "陽介さんの思い出の写真 3" },
];

// petit-pas style: scattered layout with slight rotations
const layouts = [
  { width: "75%", marginLeft: "0", rotate: "-1.5deg", zIndex: 3 },
  { width: "55%", marginLeft: "40%", rotate: "1.2deg", zIndex: 2, marginTop: "-24px" },
  { width: "60%", marginLeft: "5%", rotate: "-0.8deg", zIndex: 1, marginTop: "-16px" },
];

function PhotoSlot({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style: (typeof layouts)[number];
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: style.width,
        marginLeft: style.marginLeft,
        marginTop: style.marginTop ?? "0",
        transform: `rotate(${style.rotate})`,
        zIndex: style.zIndex,
      }}
    >
      <div className="relative aspect-[4/3] w-full">
        {hasError ? (
          <div className="flex h-full w-full items-center justify-center bg-[#F5F5F5]">
            <svg
              width="32"
              height="32"
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
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            quality={80}
            className="object-cover"
            sizes="(max-width: 800px) 75vw, 600px"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
}

export function AboutPhotos() {
  return (
    <div className="flex flex-col">
      {photos.map((photo, i) => (
        <PhotoSlot
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          style={layouts[i]}
        />
      ))}
    </div>
  );
}
