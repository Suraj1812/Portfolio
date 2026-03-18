"use client";

import { useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(current > previous && current > 140);
    setScrolled(current > 24);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 mx-auto flex justify-center px-4 py-4"
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0.85 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-300 sm:px-4",
          scrolled
            ? "border-ink/10 bg-white/78 shadow-card backdrop-blur-xl"
            : "border-white/50 bg-white/60 backdrop-blur-md"
        )}
      >
        <Link href="#top" className="flex items-center gap-3 rounded-full px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
            SS
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-semibold text-ink">Suraj Singh</p>
            <p className="text-xs text-slate">Frontend / Full-Stack Engineer</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-slate transition-colors hover:bg-white hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="https://github.com/Suraj1812"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </Link>
      </div>
    </motion.header>
  );
}
