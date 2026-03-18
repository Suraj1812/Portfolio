"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

export function TiltCard({ children, className }: TiltCardProps) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, { stiffness: 140, damping: 18 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 140, damping: 18 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const percentX = (event.clientX - bounds.left) / bounds.width;
    const percentY = (event.clientY - bounds.top) / bounds.height;

    rotateX.set((0.5 - percentY) * 10);
    rotateY.set((percentX - 0.5) * 10);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={cn("transform-gpu", className)}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
    >
      <div className="h-full" style={{ transform: "translateZ(18px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
