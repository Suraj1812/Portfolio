"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
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
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={cn(
          "group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-ember via-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(255,122,24,0.35)] transition-all duration-300 hover:shadow-[0_24px_70px_rgba(255,122,24,0.42)]",
          className
        )}
      >
        <span>{children}</span>
        <span className="rounded-full bg-white/18 p-1.5 backdrop-blur transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}
