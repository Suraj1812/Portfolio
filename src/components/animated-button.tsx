"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AnimatedButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

export function AnimatedButton({
  href,
  children,
  className,
  variant = "primary",
  external = false
}: AnimatedButtonProps) {
  return (
    <motion.div whileHover={{ x: 4, y: -4 }} whileTap={{ scale: 0.98 }}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(
          "group inline-flex items-center gap-2 border-4 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] transition-transform duration-200",
          variant === "primary"
            ? "rounded-[1.15rem] border-black bg-[var(--yellow)] text-black shadow-[8px_8px_0_#111111]"
            : "rounded-[1.15rem] border-black bg-white text-black shadow-[8px_8px_0_#111111]",
          className
        )}
      >
        <span>{children}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </motion.div>
  );
}
