"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Phone } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { navItems } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(current > previous && current > 140);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 mx-auto flex justify-center px-4 py-4"
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0.85 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "neo-panel flex w-full max-w-6xl items-center justify-between bg-[var(--yellow)] px-3 py-2 transition-all duration-300 sm:px-4"
        )}
      >
        <Link href="#top" className="flex items-center gap-3 rounded-[1rem] px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] border-2 border-black bg-white text-sm font-black text-black">
            SS
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-black uppercase tracking-[0.12em] text-black">
              Suraj Singh
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/70">
              Full-Stack + AI Systems
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[0.9rem] px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.links.phone}
            className="hidden items-center gap-2 rounded-[0.95rem] border-2 border-black bg-white px-3 py-2 text-sm font-black uppercase tracking-[0.12em] text-black sm:inline-flex"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-[0.95rem] border-2 border-black bg-[var(--cyan)] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-black transition-transform hover:-translate-y-0.5"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
