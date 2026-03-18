"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles, Star } from "lucide-react";
import { useRef } from "react";

import { AnimatedButton } from "@/components/animated-button";
import { MagneticButton } from "@/components/magnetic-button";
import { heroStats } from "@/lib/data";

const snippet = [
  "const Suraj = {",
  "  role: 'Frontend / Full-Stack Engineer',",
  "  focus: ['scroll storytelling', 'product UI'],",
  "  stack: ['Next.js', 'React', 'TypeScript', 'GSAP'],",
  "  style: 'smooth, cinematic, premium',",
  "};"
];

const orbitTags = ["GSAP ScrollTrigger", "Lenis smooth scroll", "Pinned sections", "Horizontal rails"];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.24]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0.16]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const visualRotate = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[180vh] overflow-hidden bg-[#07111f] text-white"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-25"
        style={{ y: gridY, scale: gridScale }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[8%] top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(15,157,154,0.26)_0%,_rgba(15,157,154,0.06)_48%,_transparent_72%)] blur-3xl"
        style={{ y: glowY }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[4%] top-40 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(255,122,24,0.22)_0%,_rgba(255,122,24,0.05)_50%,_transparent_72%)] blur-3xl"
        style={{ y: visualY }}
      />
      <div className="sticky top-0 flex min-h-screen items-center">
        <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-4 py-28 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <motion.div style={{ y: contentY, opacity: contentOpacity }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Scroll storytelling portfolio</span>
            </div>

            <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Hi, I&apos;m Suraj Singh.
              <span className="mt-3 block text-slate-300">
                I build smooth, scalable web applications with modern UI and cinematic motion.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Frontend and full-stack engineer focused on premium interfaces, production launches,
              and the kind of scroll-driven experience that makes a portfolio feel alive.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <MagneticButton href="#work">View Projects</MagneticButton>
              <AnimatedButton
                href="https://github.com/Suraj1812"
                external
                variant="secondary"
                className="border-white/12 bg-white/6 text-white hover:bg-white/10"
              >
                Visit GitHub
              </AnimatedButton>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/12 bg-white/6 p-5 backdrop-blur"
                >
                  <p className="font-display text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 inline-flex items-center gap-3 text-sm font-medium text-slate-300">
              <ArrowDown className="h-4 w-4 animate-bounce" />
              <span>Scroll to enter the story</span>
            </div>
          </motion.div>

          <motion.div
            style={{ y: visualY, rotate: visualRotate, scale: visualScale }}
            className="relative lg:pt-8"
          >
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.25)] backdrop-blur xl:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,157,154,0.22),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(255,122,24,0.24),_transparent_34%)]" />

              <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-teal" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <span>Scroll System Active</span>
                </div>
              </div>

              <div className="relative mt-4 rounded-[1.85rem] bg-[#091220] p-5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] xl:p-6">
                <div className="space-y-3 font-mono text-[13px] leading-6 text-slate-200">
                  {snippet.map((line, index) => (
                    <div key={line} className="flex items-start gap-4">
                      <span className="w-4 text-right text-slate-500">{index + 1}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {orbitTags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24 + index * 0.08, duration: 0.5 }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative mt-5 rounded-[1.85rem] border border-white/10 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                  Portfolio feel
                </p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-200">
                  Think premium SaaS landing page energy: sticky hero, pinned story sections,
                  horizontal project movement, and interactions that feel deliberate all the way
                  through.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
