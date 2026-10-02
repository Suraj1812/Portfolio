"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 36,
}: ScrollRevealProps) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const reduced = useReducedMotion();
  const motionEnabled = hydrated && !reduced;

  return (
    <motion.div
      className={cn(className)}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      whileInView={
        motionEnabled ? { opacity: [0, 1], y: [y, 0] } : undefined
      }
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
