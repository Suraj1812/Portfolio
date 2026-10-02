"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CursorGlow } from "@/components/cursor-glow";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        {children}
        <CursorGlow />
      </SmoothScroll>
    </MotionConfig>
  );
}
