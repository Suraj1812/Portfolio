"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { gsap } from "gsap";

type MetricsTickerProps = { items: string[] };

export function MetricsTicker({ items }: MetricsTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 32,
      ease: "none",
      repeat: -1,
    });
    tweenRef.current = tween;
    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, []);
  useEffect(() => {
    tweenRef.current?.paused(paused);
  }, [paused]);
  return (
    <div
      className="focus-ticker relative overflow-hidden border-y-4 border-black bg-black py-5"
      aria-label="Engineering focus areas"
    >
      <div ref={trackRef} className="flex w-max items-center gap-4 pr-4">
        {[...items, ...items].map((item, index) => (
          <div
            key={`${item}-${index}`}
            aria-hidden={index >= items.length || undefined}
            className={`focus-ticker-chip neo-chip ${index % 3 === 0 ? "bg-[var(--yellow)]" : index % 3 === 1 ? "bg-[var(--cyan)]" : "bg-[var(--pink)]"} px-5 py-2 text-xs font-black uppercase tracking-[.12em] text-black sm:text-sm`}
          >
            {item}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[3px_3px_0_black]"
        aria-label={
          paused
            ? "Resume focus ticker animation"
            : "Pause focus ticker animation"
        }
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </div>
  );
}
