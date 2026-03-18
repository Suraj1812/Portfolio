"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { StoryStep } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollStoryProps = {
  steps: StoryStep[];
};

export function ScrollStory({ steps }: ScrollStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        gsap.fromTo(
          item,
          { opacity: 0.34, y: 72 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 78%",
              end: "top 38%",
              scrub: 0.9,
              onEnter: () => setActiveIndex(index),
              onEnterBack: () => setActiveIndex(index)
            }
          }
        );
      });

      gsap.to("[data-story-orb='one']", {
        yPercent: -16,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to("[data-story-orb='two']", {
        yPercent: 12,
        xPercent: -8,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const activeStep = steps[activeIndex] ?? steps[0];

  return (
    <section id="about" ref={sectionRef} className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate backdrop-blur">
            <Sparkles className="h-4 w-4 text-ember" />
            <span>Scroll Story</span>
          </div>
          <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            A portfolio that reveals itself like a product story instead of a static page.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">
            The goal here is to guide people through how I think about frontend craft: motion,
            systems, product clarity, and the proof that comes after the visual setup.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-800/70 bg-[#08111f] p-6 text-white shadow-[0_30px_100px_rgba(8,17,31,0.18)] sm:p-7">
              <div
                aria-hidden="true"
                data-story-orb="one"
                className="absolute left-8 top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
              />
              <div
                aria-hidden="true"
                data-story-orb="two"
                className="absolute bottom-6 right-4 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(255,122,24,0.34),_rgba(15,157,154,0.18),_transparent_72%)] blur-3xl"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                    <span>{activeStep.label}</span>
                  </div>

                  <div
                    className={`mt-6 rounded-[1.75rem] bg-gradient-to-br p-[1px] ${activeStep.accent}`}
                  >
                    <div className="rounded-[calc(1.75rem-1px)] bg-[#0b1628] p-6">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/55">
                        Story focus
                      </p>
                      <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                        {activeStep.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-slate-200">
                        {activeStep.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {activeStep.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-10 lg:space-y-14">
            {steps.map((step, index) => (
              <article
                key={step.id}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="flex min-h-[70vh] items-center"
              >
                <div className="rounded-[2rem] border border-white/70 bg-white/78 p-7 shadow-card backdrop-blur sm:p-8">
                  <div className="flex flex-col gap-5 border-b border-ink/8 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate">
                        {step.label}
                      </p>
                      <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
                        {step.title}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-ember">
                      <span>Scroll-driven reveal</span>
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="mt-6 text-base leading-8 text-slate">{step.description}</p>
                  <p className="mt-4 text-base leading-8 text-slate">{step.detail}</p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {step.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-[1.5rem] border border-ink/10 bg-shell px-4 py-4 text-sm font-medium text-ink"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
