"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export function MagneticButton({
  href,
  children,
  className,
  external = false
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 14 });
  const springY = useSpring(y, { stiffness: 200, damping: 14 });

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;

    x.set(offsetX * 0.18);
    y.set(offsetY * 0.18);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: springX, y: springY }} whileTap={{ scale: 0.98 }}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={cn(
          "group inline-flex items-center gap-3 rounded-[1.2rem] border-4 border-black bg-[var(--pink)] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[10px_10px_0_#111111] transition-all duration-200",
          className
        )}
      >
        <span>{children}</span>
        <span className="rounded-full border-2 border-black bg-white p-1.5 transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </a>
    </motion.div>
  );
}
