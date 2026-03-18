"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Sparkles, Star } from "lucide-react";
import { useRef } from "react";

import { AnimatedButton } from "@/components/animated-button";
import { MagneticButton } from "@/components/magnetic-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { heroStats } from "@/lib/data";

const snippet = [
  "const Suraj = {",
  "  role: 'Frontend / Full-Stack Engineer',",
  "  focus: ['motion-rich UI', 'product engineering'],",
  "  stack: ['Next.js', 'React', 'TypeScript', 'Tailwind'],",
  "  style: 'smooth, scalable, premium',",
  "};"
];

const orbitTags = [
  "Motion-first UI",
  "Client-ready builds",
  "Responsive systems",
  "Modern frontend craft"
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-full bg-grid bg-[size:34px_34px] opacity-40"
        style={{ y: gridY }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[8%] top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(15,157,154,0.26)_0%,_rgba(15,157,154,0.06)_48%,_transparent_72%)] blur-3xl"
        style={{ y: glowY }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[4%] top-40 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(255,122,24,0.22)_0%,_rgba(255,122,24,0.05)_50%,_transparent_72%)] blur-3xl"
        style={{ y: cardY }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <ScrollReveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-ember" />
              <span>Premium motion portfolio</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Hi, I&apos;m Suraj Singh.
              <span className="mt-3 block text-slate">
                I build smooth, scalable web applications with modern UI and animation.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate sm:text-xl">
              Frontend and full-stack engineer focused on expressive interfaces, clean systems,
              and production-ready execution across client work and experimental builds.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.24}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <MagneticButton href="#work">View Work</MagneticButton>
              <AnimatedButton href="https://github.com/Suraj1812" external variant="secondary">
                Visit GitHub
              </AnimatedButton>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.32}>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/65 bg-white/70 p-5 shadow-card backdrop-blur"
                >
                  <p className="font-display text-3xl font-semibold text-ink">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <motion.div style={{ y: cardY }} className="relative">
          <ScrollReveal delay={0.18} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-card backdrop-blur xl:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,157,154,0.14),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,122,24,0.14),_transparent_32%)]" />

              <div className="relative flex items-center justify-between rounded-2xl border border-ink/10 bg-shell px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-teal" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <span>Motion Stack Active</span>
                </div>
              </div>

              <div className="relative mt-4 rounded-[1.75rem] bg-navy p-5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] xl:p-6">
                <div className="space-y-3 font-mono text-[13px] leading-6 text-slate-200">
                  {snippet.map((line) => (
                    <div key={line} className="flex items-start gap-4">
                      <span className="w-4 text-right text-slate-500">{snippet.indexOf(line) + 1}</span>
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
                      transition={{ delay: 0.35 + index * 0.08, duration: 0.5 }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative mt-5 flex flex-col gap-4 rounded-[1.75rem] border border-ink/10 bg-white/75 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                    Signature approach
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-7 text-slate">
                    Premium SaaS feel, polished motion, strong hierarchy, and a responsive build
                    that still behaves well when shipped.
                  </p>
                </div>
                <a
                  href="#clients"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-ember"
                >
                  See production projects
                  <ArrowDownRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </motion.div>
      </div>
    </section>
  );
}
