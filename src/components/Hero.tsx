"use client";

import { useCallback } from "react";
import { HeroPhoto } from "./HeroPhoto";

export function Hero() {
  const scrollToNext = useCallback(() => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      className="relative flex w-screen overflow-hidden bg-base"
      style={{ height: "100svh" }}
    >
      {/* Left column — vertical text + triangle accent */}
      <div className="relative flex w-[72px] shrink-0 flex-col items-center justify-end pb-8 pt-8 md:w-[30%]">
        {/* Vertical text — positioned 32px above triangle */}
        <div
          className="mt-auto font-klee text-[17px] font-semibold leading-[2.2] tracking-[0.08em] text-text sm:text-[18px] md:text-[24px]"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          「信じられない」を受け止めて、私たちは明日も生きていく。
        </div>

        {/* Downward triangle — scroll hint, tappable */}
        <button
          type="button"
          onClick={scrollToNext}
          className="mt-8 flex flex-col items-center gap-[2px] p-1"
          aria-label="下にスクロール"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="#C2185B">
            <polygon points="0,0 14,0 7,12" />
          </svg>
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="#C2185B"
            className="opacity-60"
          >
            <polygon points="0,0 14,0 7,12" />
          </svg>
        </button>
      </div>

      {/* Right — photo with max-width constraint */}
      <div className="relative min-w-0 flex-1 pt-8 md:w-[70%] md:flex-none md:pt-8">
        <div className="relative h-full w-full overflow-hidden md:ml-0">
          <HeroPhoto />
        </div>
      </div>
    </section>
  );
}
