import Image from "next/image";
import { HeroPhoto } from "./HeroPhoto";

export function Hero() {
  return (
    <section className="relative w-screen overflow-hidden" style={{ height: "100svh" }}>
      {/* Background photo with reduced opacity */}
      <HeroPhoto />

      {/* Vertical text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="font-klee text-[24px] font-semibold leading-[2] tracking-[0.1em] text-text-heading"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {/* Name - right column (renders first in vertical-rl) */}
          <p className="ml-4">
            伊藤
            <br />
            陽介
          </p>

          {/* Dates and English name - left column */}
          <p className="font-cormorant text-[14px] font-normal leading-[2.4] tracking-[0.15em] text-sub">
            1988.11.17
            <span className="mx-1">—</span>
            2026.04.03
          </p>
        </div>
      </div>
    </section>
  );
}
