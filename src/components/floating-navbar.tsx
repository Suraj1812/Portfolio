"use client";

import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FileText, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./floating-navbar.css";

const navItems = [
  { label: "Projects", href: "#work", color: "--yellow" },
  { label: "Experience", href: "#experience", color: "--mint" },
  { label: "About", href: "#about", color: "--orange" },
  { label: "Stack", href: "#stack", color: "--cyan" },
  { label: "Contact", href: "#contact", color: "--lime" },
];

/** Section whose top has passed 40% of the viewport, last match wins. */
function findActiveSection() {
  const line = window.innerHeight * 0.4;
  let active = "";
  for (const item of navItems) {
    const section = document.querySelector(item.href);
    if (section && section.getBoundingClientRect().top <= line) active = item.href;
  }
  return active;
}

export function FloatingNavbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (current) => {
    const nextCompact = current > 60;
    setCompact((was) => (was === nextCompact ? was : nextCompact));
    const nextActive = findActiveSection();
    setActive((was) => (was === nextActive ? was : nextActive));

    if (menuOpen) {
      setHidden(false);
      return;
    }
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;
    // Ignore tiny smooth-scroll deltas so the bar doesn't flicker mid-glide.
    if (Math.abs(delta) < 3) return;
    const next = delta > 0 && current > 160;
    setHidden((was) => (was === next ? was : next));
  });

  return (
    <motion.header
      className={cn("nav-shell", compact && "nav-shell-compact")}
      onFocusCapture={() => setHidden(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
      animate={{ y: hidden ? -130 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav-bar">
        <div className="nav-row">
          <Link href="#top" className="nav-brand" aria-label="Suraj Singh, back to top">
            <span className="nav-avatar">
              <Image src="/suraj-logo.png" alt="" width={48} height={48} />
              <span className="nav-avatar-dot" aria-hidden="true" />
            </span>
            <span className="nav-brand-text">
              <strong>Suraj Singh</strong>
              <span>AI + Full-Stack Engineer</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("nav-link", isActive && "is-active")}
                  aria-current={isActive ? "location" : undefined}
                  style={{ "--link-color": `var(${item.color})` } as CSSProperties}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="nav-link-pill"
                      transition={
                        reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span className="nav-link-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="nav-actions">
            <ThemeToggle className="nav-icon-btn" />
            <a href="/resume" className="nav-btn nav-btn-resume" aria-label="Preview Suraj Singh resume">
              <FileText size={16} aria-hidden="true" />
              <span>Resume</span>
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="nav-btn nav-btn-github"
              aria-label="Open GitHub profile (opens in a new tab)"
            >
              <Github size={16} aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="nav-icon-btn nav-menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav id="mobile-navigation" className="nav-mobile" aria-label="Mobile">
            <ol>
              {navItems.map((item, index) => (
                <li
                  key={item.href}
                  style={{ "--link-color": `var(${item.color})`, "--i": index } as CSSProperties}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === item.href ? "location" : undefined}
                  >
                    <span className="nav-mobile-index">{String(index + 1).padStart(2, "0")}</span>
                    {item.label}
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
            <div className="nav-mobile-socials">
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)">
                <Github size={18} />
              </a>
              <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)">
                <Linkedin size={18} />
              </a>
              <a href={siteConfig.links.email} aria-label="Email Suraj">
                <Mail size={18} />
              </a>
            </div>
          </nav>
        ) : null}

        <motion.span
          className="nav-progress"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      </div>
    </motion.header>
  );
}
