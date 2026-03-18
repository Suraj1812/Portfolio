"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type MetricsTickerProps = {
  items: string[];
};

export function MetricsTicker({ items }: MetricsTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;

    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1
    });

    return () => {
      tween.kill();
    };
  }, []);

  const loopItems = [...items, ...items];

  return (
    <div className="overflow-hidden border-y-4 border-black bg-black py-4">
      <div ref={trackRef} className="flex w-max items-center gap-4 pr-4">
        {loopItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="neo-chip bg-[var(--yellow)] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-black"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
