"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
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
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300",
          variant === "primary"
            ? "border-transparent bg-navy text-shell shadow-glow"
            : "border-ink/10 bg-white/75 text-ink backdrop-blur hover:border-ink/20 hover:bg-white",
          className
        )}
      >
        <span>{children}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
