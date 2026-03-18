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

  useEffect(() => {
    if (!selected) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-black py-24 text-white">
      <div ref={stageRef} className="relative flex min-h-screen flex-col justify-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="neo-chip inline-flex items-center gap-2 bg-[var(--yellow)] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-black">
              <Sparkles className="h-4 w-4 text-black" />
              <span>Horizontal Projects</span>
            </div>
            <h2 className="mt-6 font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
              Featured work unfolds as a pinned project rail with brutal cards and full breakdowns.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              On desktop, the rail pins and scrolls sideways. On smaller screens it stays readable
              as a stacked layout, so the interaction still feels intentional without sacrificing
              usability.
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
              className="neo-panel-lg relative flex min-h-[32rem] w-full shrink-0 overflow-hidden bg-white p-7 text-black lg:w-[28rem]"
            >
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-black/65">
                    Scroll instruction
                  </p>
                  <h3 className="mt-5 font-display text-3xl font-black uppercase tracking-[-0.05em]">
                    Keep scrolling to move through selected projects horizontally.
                  </h3>
                  <p className="mt-5 text-base leading-8 text-black/75">
                    This is where the portfolio shifts from narrative into proof: shipped product
                    work, creative experiments, and motion-rich interfaces with stronger personality.
                  </p>
                </div>

                <div className="grid gap-3">
                  {["Pinned section", "GSAP ScrollTrigger", "Project detail modal"].map((item) => (
                    <div
                      key={item}
                      className="neo-panel-sm bg-[var(--yellow)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-black"
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
                className={cn(
                  "neo-panel-lg group relative flex min-h-[32rem] w-full shrink-0 flex-col overflow-hidden p-6 text-left text-black lg:w-[38rem] xl:w-[42rem]",
                  project.accent
                )}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-black/65">
                      {project.category}
                    </p>
                    <h3 className="mt-4 font-display text-3xl font-black uppercase tracking-[-0.05em]">
                      {project.title}
                    </h3>
                  </div>
                  <div className="neo-chip bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
                    {project.year}
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-8 text-black/80">{project.tagline}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="neo-chip bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-black"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="neo-panel-lg neo-stripes relative mt-8 flex flex-1 overflow-hidden bg-white p-5">
                  <motion.div
                    aria-hidden="true"
                    className="absolute -right-10 -top-12 h-36 w-36 rounded-[1.5rem] border-4 border-black bg-[var(--pink)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="absolute bottom-6 left-6 h-20 w-20 rounded-[1.2rem] border-4 border-black bg-[var(--cyan)]"
                    animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity }}
                  />

                  <div className="relative z-10 mt-auto grid gap-3 sm:grid-cols-3">
                    {project.metrics.map((metric) => (
                      <div
                        key={metric}
                        className="neo-panel-sm bg-[var(--yellow)] px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-black"
                      >
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-[0.1em] text-black/70">
                    Click to expand project
                  </span>
                  <span className="neo-chip inline-flex items-center gap-2 bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white transition-transform group-hover:translate-x-1">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
              className="neo-panel-lg relative max-h-[90vh] w-full max-w-5xl overflow-auto bg-[var(--paper)] p-6 text-black sm:p-8"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`project-${selected.slug}`}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="neo-chip sticky top-0 z-20 ml-auto flex h-11 w-11 items-center justify-center bg-[var(--yellow)] text-black"
                aria-label="Close project details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mt-2 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div
                  className={cn(
                    "neo-panel-lg relative min-h-[24rem] overflow-hidden p-6 text-black",
                    selected.accent
                  )}
                >
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-black/65">
                        {selected.category}
                      </p>
                      <h3
                        id={`project-${selected.slug}`}
                        className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.05em]"
                      >
                        {selected.title}
                      </h3>
                      <p className="mt-5 max-w-md text-sm leading-7 text-black/80">{selected.tagline}</p>
                    </div>

                    <div className="grid gap-3">
                      {selected.metrics.map((metric) => (
                        <div
                          key={metric}
                          className="neo-panel-sm bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.08em]"
                        >
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">
                    Project overview
                  </p>
                  <p className="mt-5 text-base leading-8 text-black/80">{selected.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {selected.stack.map((item) => (
                      <span
                        key={item}
                        className="neo-chip bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-black"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <div className="neo-panel-lg bg-white p-5">
                      <p className="text-sm font-black uppercase tracking-[0.12em] text-black">Features</p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                        {selected.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="neo-panel-lg bg-[var(--cream)] p-5">
                      <p className="text-sm font-black uppercase tracking-[0.12em] text-black">Architecture</p>
                      <p className="mt-4 text-sm leading-7 text-black/75">{selected.architecture}</p>
                    </div>
                  </div>

                  <div className="neo-panel-lg mt-5 bg-[var(--lime)] p-5">
                    <p className="text-sm font-black uppercase tracking-[0.12em] text-black">Why it matters</p>
                    <p className="mt-4 text-sm leading-7 text-black/75">{selected.impact}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border-4 border-black bg-[var(--yellow)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition-transform hover:-translate-y-0.5"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live project
                    </a>
                    {selected.repoUrl ? (
                      <a
                        href={selected.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border-4 border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition-transform hover:-translate-y-0.5"
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
