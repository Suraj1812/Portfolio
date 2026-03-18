"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, MoveRight, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { FeaturedProject } from "@/lib/data";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type HorizontalProjectsProps = {
  projects: FeaturedProject[];
};

export function HorizontalProjects({ projects }: HorizontalProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<FeaturedProject | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const rail = railRef.current;

    if (
      !section ||
      !stage ||
      !rail ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add("(min-width: 1024px)", () => {
        const distance = Math.max(0, rail.scrollWidth - window.innerWidth);

        if (distance <= 0) {
          return;
        }

        const tween = gsap.to(rail, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance + window.innerHeight * 0.75}`,
            pin: stage,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.42, y: 52, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 72%",
                end: "center center",
                scrub: true
              }
            }
          );
        });
      });
    }, section);

    return () => {
      ctx.revert();
      media.revert();
    };
  }, [projects.length]);

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-[#07111f] py-24 text-white">
      <div ref={stageRef} className="relative flex min-h-screen flex-col justify-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Horizontal Projects</span>
            </div>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Featured work presented as a pinned rail that unfolds with scroll.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              On desktop, this section pins and moves sideways to create that award-site style
              transition. On smaller screens, it falls back to a clean stacked layout.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-visible">
          <div
            ref={railRef}
            className="flex flex-col gap-5 px-4 sm:px-6 lg:w-max lg:flex-row lg:gap-8 lg:px-8"
          >
            <div
              data-project-card
              className="relative flex min-h-[32rem] w-full shrink-0 overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_26px_80px_rgba(0,0,0,0.2)] backdrop-blur lg:w-[28rem]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,157,154,0.24),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,122,24,0.24),_transparent_34%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                    Scroll instruction
                  </p>
                  <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight">
                    Keep scrolling to move through selected projects horizontally.
                  </h3>
                  <p className="mt-5 text-base leading-8 text-slate-300">
                    This is where the portfolio shifts from narrative into proof: shipped product
                    work, creative experiments, and motion-rich interfaces with stronger personality.
                  </p>
                </div>

                <div className="grid gap-3">
                  {["Pinned section", "GSAP ScrollTrigger", "Project detail modal"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {projects.map((project) => (
              <motion.button
                key={project.slug}
                data-project-card
                type="button"
                onClick={() => setSelected(project)}
                className="group relative flex min-h-[32rem] w-full shrink-0 flex-col overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-6 text-left shadow-[0_26px_80px_rgba(0,0,0,0.2)] backdrop-blur lg:w-[38rem] xl:w-[42rem]"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                      {project.category}
                    </p>
                    <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight">
                      {project.title}
                    </h3>
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/72">
                    {project.year}
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  {project.tagline}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-slate-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div
                  className={cn(
                    "relative mt-8 flex flex-1 overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br p-5",
                    project.accent
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(17,24,39,0.25),_transparent_40%)]" />
                  <motion.div
                    aria-hidden="true"
                    className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/25"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="absolute bottom-6 left-6 h-20 w-20 rounded-full border border-white/30"
                    animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity }}
                  />

                  <div className="relative z-10 mt-auto grid gap-3 sm:grid-cols-3">
                    {project.metrics.map((metric) => (
                      <div
                        key={metric}
                        className="rounded-2xl bg-white/14 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm"
                      >
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">Click to expand project</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                    Open details
                    <MoveRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[2rem] border border-white/12 bg-[#091220] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="sticky top-0 z-20 ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white backdrop-blur"
                aria-label="Close project details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mt-2 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div
                  className={cn(
                    "relative min-h-[24rem] overflow-hidden rounded-[1.9rem] border border-white/12 bg-gradient-to-br p-6 text-white",
                    selected.accent
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(17,24,39,0.28),_transparent_40%)]" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
                        {selected.category}
                      </p>
                      <h3 className="mt-4 font-display text-4xl font-semibold tracking-tight">
                        {selected.title}
                      </h3>
                      <p className="mt-5 max-w-md text-sm leading-7 text-white/82">
                        {selected.tagline}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {selected.metrics.map((metric) => (
                        <div
                          key={metric}
                          className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 text-sm backdrop-blur-sm"
                        >
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Project overview
                  </p>
                  <p className="mt-5 text-base leading-8 text-slate-200">{selected.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {selected.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-slate-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                      <p className="text-sm font-semibold text-white">Features</p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                        {selected.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                      <p className="text-sm font-semibold text-white">Architecture</p>
                      <p className="mt-4 text-sm leading-7 text-slate-300">{selected.architecture}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                    <p className="text-sm font-semibold text-white">Why it matters</p>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{selected.impact}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live project
                    </a>
                    {selected.repoUrl ? (
                      <a
                        href={selected.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                      >
                        <Github className="h-4 w-4" />
                        {selected.repoLabel ?? "GitHub"}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
