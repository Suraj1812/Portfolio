"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const smoothX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const smoothY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX - 90);
      y.set(event.clientY - 90);
    };

    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(255,122,24,0.26)_0%,_rgba(15,157,154,0.16)_42%,_transparent_72%)] blur-2xl lg:block"
      style={{ x: smoothX, y: smoothY }}
    />
  );
}
