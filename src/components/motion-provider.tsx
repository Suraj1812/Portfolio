"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CursorGlow } from "@/components/cursor-glow";
import { ScrollAnimationObserver } from "@/components/scroll-animation-observer";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ScrollAnimationObserver />
        {children}
        <CursorGlow />
      </SmoothScroll>
    </MotionConfig>
  );
}
