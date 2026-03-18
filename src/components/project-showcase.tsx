"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { TiltCard } from "@/components/tilt-card";
import type { FeaturedProject } from "@/lib/data";
import { cn } from "@/lib/utils";

type ProjectShowcaseProps = {
  projects: FeaturedProject[];
};

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [selected, setSelected] = useState<FeaturedProject | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="work" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Featured Work"
            title="Interactive projects with personality, polish, and real frontend craft."
            description="These are the strongest examples of how I combine product thinking, visual direction, and reusable engineering into interfaces that feel premium."
          />
        </ScrollReveal>

        <LayoutGroup>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <ScrollReveal key={project.slug} delay={index * 0.06}>
                <TiltCard className="h-full">
                  <motion.button
                    layoutId={`card-${project.slug}`}
                    type="button"
                    onClick={() => setSelected(project)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 text-left shadow-card backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate">
                          {project.category}
                        </p>
                        <motion.h3
                          layoutId={`title-${project.slug}`}
                          className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink"
                        >
                          {project.title}
                        </motion.h3>
                      </div>
                      <div className="rounded-full border border-ink/10 bg-shell px-3 py-1 text-xs text-slate">
                        {project.year}
                      </div>
                    </div>

                    <p className="mt-4 text-base leading-7 text-slate">{project.description}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.stack.slice(0, 4).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-ink/10 bg-shell px-3 py-1 text-xs font-medium text-slate"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <motion.div
                      layoutId={`art-${project.slug}`}
                      className={cn(
                        "relative mt-8 flex min-h-[15rem] flex-1 overflow-hidden rounded-[1.75rem] border border-white/20 bg-gradient-to-br p-5 text-white",
                        project.accent
                      )}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(17,24,39,0.25),_transparent_40%)]" />
                      <motion.div
                        aria-hidden="true"
                        className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-white/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
                      />
                      <motion.div
                        aria-hidden="true"
                        className="absolute bottom-4 left-5 h-16 w-16 rounded-full border border-white/30"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <div className="relative z-10 mt-auto grid gap-3 sm:grid-cols-3">
                        {project.metrics.map((metric) => (
                          <div key={metric} className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm">
                            <p className="text-sm font-medium">{metric}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate">Open project details</span>
                      <span className="rounded-full bg-navy px-3 py-2 text-xs font-semibold text-white transition-transform group-hover:translate-x-1">
                        View
                      </span>
                    </div>
                  </motion.button>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          <AnimatePresence>
            {selected ? (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-navy/45 p-4 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
              >
                <motion.div
                  layoutId={`card-${selected.slug}`}
                  className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[2rem] border border-white/25 bg-shell p-6 shadow-[0_30px_120px_rgba(15,23,42,0.28)] sm:p-8"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="sticky top-0 z-20 ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink backdrop-blur"
                    aria-label="Close project details"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="mt-2 flex flex-col gap-8">
                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                      <motion.div
                        layoutId={`art-${selected.slug}`}
                        className={cn(
                          "relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-white/20 bg-gradient-to-br p-6 text-white",
                          selected.accent
                        )}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.3),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(17,24,39,0.26),_transparent_40%)]" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                              {selected.category}
                            </p>
                            <motion.h3
                              layoutId={`title-${selected.slug}`}
                              className="mt-3 font-display text-3xl font-semibold tracking-tight"
                            >
                              {selected.title}
                            </motion.h3>
                            <p className="mt-4 max-w-md text-sm leading-7 text-white/82">
                              {selected.tagline}
                            </p>
                          </div>
                          <div className="grid gap-3">
                            {selected.metrics.map((metric) => (
                              <div
                                key={metric}
                                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm"
                              >
                                {metric}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate">
                          Project overview
                        </p>
                        <p className="mt-4 text-base leading-8 text-slate">{selected.description}</p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {selected.stack.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-medium text-slate"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                          <div className="rounded-[1.5rem] border border-ink/10 bg-white p-5">
                            <p className="text-sm font-semibold text-ink">Features</p>
                            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate">
                              {selected.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-[1.5rem] border border-ink/10 bg-white p-5">
                            <p className="text-sm font-semibold text-ink">Architecture</p>
                            <p className="mt-4 text-sm leading-7 text-slate">{selected.architecture}</p>
                          </div>
                        </div>

                        <div className="mt-6 rounded-[1.5rem] border border-ink/10 bg-white p-5">
                          <p className="text-sm font-semibold text-ink">Why it matters</p>
                          <p className="mt-4 text-sm leading-7 text-slate">{selected.impact}</p>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                          <a
                            href={selected.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live project
                          </a>
                          {selected.repoUrl ? (
                            <a
                              href={selected.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
                            >
                              <Github className="h-4 w-4" />
                              {selected.repoLabel ?? "GitHub"}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
