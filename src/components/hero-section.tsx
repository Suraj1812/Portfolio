"use client";

import { useSyncExternalStore } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { HeroOrbit } from "@/components/hero-orbit";
import { ExperienceDuration } from "@/components/experience-duration";
import { MagneticButton } from "@/components/magnetic-button";
import { AnimatedButton } from "@/components/animated-button";
import { siteConfig } from "@/lib/site";
import { portfolioProjects } from "@/lib/portfolio-data";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function HeroSection({ initialMonth }: { initialMonth: string }) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const reduced = useReducedMotion();
  const motionEnabled = hydrated && !reduced;
  // The hero starts at the document top, so window scroll gives it a stable
  // parallax range without measuring a target against a static scroll container.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -80]);
  const rotate = useTransform(scrollY, [0, 1000], [0, -7]);
  const shapeY = useTransform(scrollY, [0, 1000], [0, 150]);
  return (
    <section
      id="top"
      className="neo-grid-bg relative overflow-hidden lg:min-h-[125vh]"
    >
      <motion.div
        aria-hidden="true"
        initial={false}
        style={{
          y: motionEnabled ? shapeY : 0,
          rotate: motionEnabled ? rotate : 0,
        }}
        className="absolute -left-14 top-48 h-40 w-40 rounded-[2rem] border-4 border-black bg-[var(--cyan)] opacity-60 sm:h-56 sm:w-56"
      />
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={motionEnabled ? { rotate: [10, 25, 10] } : { rotate: 0 }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-9 top-32 h-48 w-48 rounded-[2.5rem] border-4 border-black bg-[var(--pink)]"
      />
      <div className="relative flex min-h-screen items-center pb-16 pt-36 sm:pt-40 lg:sticky lg:top-0 lg:py-36">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10">
          <motion.div
            initial={false}
            style={{ y: motionEnabled ? y : 0 }}
            className="relative z-10"
          >
            <motion.div
              initial={false}
              animate={
                motionEnabled
                  ? { opacity: [0, 1], y: [24, 0] }
                  : { opacity: 1, y: 0 }
              }
              transition={{ duration: 0.7 }}
            >
              <div className="neo-chip inline-flex items-center gap-2 bg-[var(--lime)] px-4 py-2 text-[10px] font-black uppercase tracking-[.12em] text-black sm:text-xs">
                <span className="h-2 w-2 rounded-full border border-black bg-black" />{" "}
                AI × Full-stack × 3D
              </div>
              <h1 className="mt-7 font-display text-[clamp(3.7rem,7.2vw,7rem)] font-black uppercase leading-[.86] tracking-[-.07em]">
                Suraj
                <br />
                Singh<span className="text-[var(--blue)]">.</span>
              </h1>
              <div className="mt-7 inline-block -rotate-2 rounded-xl border-4 border-black bg-[var(--yellow)] px-4 py-3 text-black shadow-[7px_7px_0_#111] sm:px-5">
                <p className="font-display text-xl font-black uppercase leading-tight tracking-[-.04em] sm:text-3xl">
                  AI Developer ×<br />
                  Full-Stack Engineer
                </p>
              </div>
              <p className="mt-8 max-w-xl text-base leading-8 text-[var(--ink-muted)] sm:text-lg">
                I build AI-assisted products, automation workflows, and
                full-stack applications — from expressive interfaces to the
                APIs, databases, and services behind them.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <MagneticButton href="#work">Explore projects</MagneticButton>
                <AnimatedButton href="/resume" variant="secondary">
                  My resume
                </AnimatedButton>
              </div>
              <div className="mt-9 grid grid-cols-2 gap-4">
                <div className="neo-panel-sm bg-white p-4 text-black">
                  <p className="font-display text-lg font-black leading-snug sm:text-xl">
                    <ExperienceDuration total initialMonth={initialMonth} />
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[.1em] text-black/65">
                    Engineering experience
                  </p>
                </div>
                <div className="neo-panel-sm bg-[var(--cyan)] p-4 text-black">
                  <p className="font-display text-3xl font-black">
                    {portfolioProjects.length}
                    <span className="text-xl"> projects</span>
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[.1em] text-black/65">
                    AI · Backend · Web · 3D
                  </p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-5 text-sm font-bold">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Github size={17} /> GitHub <ArrowUpRight size={14} />
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Linkedin size={17} /> LinkedIn
                </a>
                <a
                  href={siteConfig.links.email}
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Mail size={17} /> Email
                </a>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={false}
            style={{
              y: motionEnabled ? y : 0,
              rotate: motionEnabled ? rotate : 0,
            }}
            className="relative z-10 lg:pt-8"
          >
            <div className="neo-panel-lg relative bg-[var(--blue)] p-4 text-black sm:p-5">
              <div className="relative z-10 flex items-center justify-between rounded-xl border-4 border-black bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[.12em]">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-black bg-[var(--pink)]" />
                  <span className="h-3 w-3 rounded-full border-2 border-black bg-[var(--yellow)]" />
                  <span className="h-3 w-3 rounded-full border-2 border-black bg-[var(--lime)]" />
                </div>
                <span>The engineering playground</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-[1.5rem] border-4 border-black bg-[var(--cream)]">
                <HeroOrbit />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="neo-panel-sm bg-[var(--pink)] p-4">
                  <p className="text-xs font-black uppercase tracking-[.12em]">
                    AI + Automation
                  </p>
                  <p className="mt-2 text-xs leading-6">
                    LLMs, retrieval, local agents, and connected workflows.
                  </p>
                </div>
                <div className="neo-panel-sm bg-[var(--lime)] p-4">
                  <p className="text-xs font-black uppercase tracking-[.12em]">
                    Full-stack thinking
                  </p>
                  <p className="mt-2 text-xs leading-6">
                    React, Next.js, Node.js, Go, and database-backed systems.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-black bg-[var(--yellow)] px-4 py-3 text-[10px] font-black uppercase tracking-[.1em]">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={13} /> Faridabad, India
                </span>
                <span>Move your cursor ↗</span>
              </div>
            </div>
          </motion.div>
          <div className="col-span-full mt-2 flex items-center gap-3 text-xs font-black uppercase tracking-[.12em]">
            <ArrowDown
              size={17}
              className={motionEnabled ? "animate-bounce" : ""}
            />{" "}
            Scroll into the work
          </div>
        </div>
      </div>
    </section>
  );
}
