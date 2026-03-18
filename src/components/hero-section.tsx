"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Phone } from "lucide-react";
import { useRef } from "react";

import { AnimatedButton } from "@/components/animated-button";
import { MagneticButton } from "@/components/magnetic-button";
import { heroStats } from "@/lib/data";
import { siteConfig } from "@/lib/site";

const snippet = [
  "const suraj = {",
  "  role: 'Full-Stack Software Engineer',",
  "  focus: ['AI-powered apps', 'scalable systems'],",
  "  stack: ['Next.js', 'React', 'TypeScript', 'Node.js'],",
  "  style: 'neobrutal, bold, production-ready',",
  "};"
];

const contactLinks = [
  {
    label: siteConfig.contact.phoneDisplay,
    href: siteConfig.links.phone,
    icon: Phone
  },
  {
    label: siteConfig.contact.email,
    href: siteConfig.links.email,
    icon: Mail
  },
  {
    label: "LinkedIn",
    href: siteConfig.links.linkedin,
    icon: Linkedin
  },
  {
    label: "GitHub",
    href: siteConfig.links.github,
    icon: Github
  }
] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const gridRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0.12]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const visualRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const tagX = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="neo-grid-bg relative overflow-hidden bg-[var(--paper)] lg:h-[170vh]"
    >
      <motion.div
        aria-hidden="true"
        className="absolute -left-20 top-28 hidden h-52 w-52 rounded-[2rem] border-4 border-black bg-[var(--cyan)] sm:block"
        style={{ y: gridY, rotate: gridRotate }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[6%] top-24 hidden h-40 w-40 rounded-[1.8rem] border-4 border-black bg-[var(--pink)] sm:block"
        style={{ x: tagX, rotate: visualRotate }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-24 left-[12%] hidden h-28 w-28 rounded-[1.5rem] border-4 border-black bg-[var(--lime)] md:block"
        style={{ y: visualY }}
      />
      <div className="flex min-h-screen items-center pt-20 sm:pt-24 lg:sticky lg:top-0 lg:pt-16">
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8 lg:py-24">
          <motion.div style={{ y: contentY, opacity: contentOpacity }}>
            <h1 className="max-w-5xl font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-black sm:text-5xl lg:text-7xl">
              Suraj Singh
              <span className="mt-4 block max-w-4xl text-xl leading-tight tracking-[-0.05em] sm:text-2xl lg:text-4xl">
                {siteConfig.name}
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-black/75 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl">
              I build product-grade interfaces, AI-assisted workflows, and scalable web systems
              with strong frontend architecture, bold design direction, and clean implementation.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <MagneticButton href="#work">View Projects</MagneticButton>
              <AnimatedButton href={siteConfig.links.github} external variant="secondary">
                Visit GitHub
              </AnimatedButton>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="neo-panel-sm bg-white p-5">
                  <p className="font-display text-3xl font-black uppercase text-black">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-black/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {contactLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="neo-panel-sm flex min-w-0 items-start gap-3 bg-[var(--cream)] px-4 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-black sm:items-center sm:text-sm"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
                  <span className="min-w-0 break-all">{label}</span>
                </a>
              ))}
            </div>

            <div className="mt-10 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.12em] text-black/70">
              <ArrowDown className="h-4 w-4 animate-bounce" />
              <span>Scroll to enter the system</span>
            </div>
          </motion.div>

          <motion.div
            style={{ y: visualY, rotate: visualRotate, scale: visualScale }}
            className="relative lg:pt-8"
          >
            <div className="neo-panel-lg neo-stripes relative overflow-hidden bg-[var(--blue)] p-4 sm:p-5 xl:p-6">
              <div className="relative flex items-center justify-between rounded-[1.1rem] border-4 border-black bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-black bg-[var(--pink)]" />
                  <span className="h-3 w-3 rounded-full border-2 border-black bg-[var(--yellow)]" />
                  <span className="h-3 w-3 rounded-full border-2 border-black bg-[var(--lime)]" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-black sm:text-xs">
                  Production-ready stack
                </div>
              </div>

              <div className="relative mt-4 rounded-[1.6rem] border-4 border-black bg-black p-4 text-sm text-white sm:p-5 xl:p-6">
                <div className="space-y-3 font-mono text-[12px] leading-6 text-white sm:text-[13px]">
                  {snippet.map((line, index) => (
                    <div key={line} className="flex items-start gap-4">
                      <span className="w-4 text-right text-white/45">{index + 1}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["AI-powered apps", "Scalable systems", "GSAP + Lenis", "React architecture"].map(
                    (tag, index) => (
                      <motion.div
                        key={tag}
                        className="rounded-[1rem] border-2 border-black bg-[var(--yellow)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-black"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 + index * 0.08, duration: 0.5 }}
                      >
                        {tag}
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              <div className="relative mt-5 grid gap-4 sm:grid-cols-2">
                <div className="neo-panel-sm bg-[var(--pink)] p-5 text-black">
                  <p className="text-xs font-black uppercase tracking-[0.22em]">Core promise</p>
                  <p className="mt-3 text-sm leading-7">
                    Build product experiences that feel memorable without sacrificing clarity,
                    performance, or engineering discipline.
                  </p>
                </div>
                <div className="neo-panel-sm bg-[var(--lime)] p-5 text-black">
                  <p className="text-xs font-black uppercase tracking-[0.22em]">What this shows</p>
                  <p className="mt-3 text-sm leading-7">
                    Client delivery, experimental range, AI product direction, and a frontend
                    system with a point of view.
                  </p>
                </div>
              </div>

              <div className="neo-panel-sm relative mt-5 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-black">
                  Shipping focus
                </p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-black/75">
                  Full-stack software engineer with strong frontend instincts, real client launches,
                  and a growing focus on AI-powered product workflows.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
