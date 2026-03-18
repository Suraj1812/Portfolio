"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Menu, Phone, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { navItems } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (menuOpen) {
      setHidden(false);
      return;
    }

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
          "neo-panel flex w-full max-w-6xl flex-col bg-[var(--yellow)] px-3 py-2 transition-all duration-300 sm:px-4"
        )}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <Link href="#top" className="flex min-w-0 items-center gap-3 rounded-[1rem] px-2 py-2 sm:px-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border-2 border-black bg-white text-sm font-black text-black">
              SS
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-black uppercase tracking-[0.12em] text-black">
                Suraj Singh
              </p>
              <p className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-black/70 sm:block">
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
              className="inline-flex items-center gap-2 rounded-[0.95rem] border-2 border-black bg-white px-3 py-2 text-sm font-black uppercase tracking-[0.12em] text-black"
              aria-label="Call Suraj Singh"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </a>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[0.95rem] border-2 border-black bg-[var(--cyan)] px-3 py-2 text-sm font-black uppercase tracking-[0.12em] text-black transition-transform hover:-translate-y-0.5 sm:px-4"
              aria-label="Open GitHub profile"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex items-center justify-center rounded-[0.95rem] border-2 border-black bg-white p-2 text-black md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav className="mt-3 grid w-full grid-cols-2 gap-2 border-t-4 border-black pt-3 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[0.95rem] border-2 border-black bg-white px-3 py-3 text-center text-xs font-black uppercase tracking-[0.12em] text-black"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </motion.header>
  );
}
