"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { StoryStep } from "@/lib/data";
import { cn } from "@/lib/utils";

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
          <div className="neo-chip inline-flex items-center gap-2 bg-[var(--yellow)] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-black">
            <Sparkles className="h-4 w-4 text-black" />
            <span>Scroll Story</span>
          </div>
          <h2 className="mt-6 font-display text-4xl font-black uppercase tracking-[-0.05em] text-black sm:text-5xl">
            A scroll-led breakdown of how I design, ship, and scale product work.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/75">
            This section turns the portfolio into a story about clarity, engineering systems, AI
            product thinking, and the delivery proof behind the visuals.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="neo-panel-lg relative overflow-hidden bg-white p-6 sm:p-7">
              <div
                aria-hidden="true"
                data-story-orb="one"
                className="absolute -right-6 top-8 h-24 w-24 rounded-[1.2rem] border-4 border-black bg-[var(--pink)]"
              />
              <div
                aria-hidden="true"
                data-story-orb="two"
                className="absolute -bottom-4 left-6 h-28 w-28 rounded-[1.2rem] border-4 border-black bg-[var(--cyan)]"
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
                  <div className="neo-chip inline-flex items-center gap-2 bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white">
                    <span>{activeStep.label}</span>
                  </div>

                  <div className={cn("neo-panel-lg mt-6 p-6 text-black", activeStep.accent)}>
                    <p className="text-sm font-black uppercase tracking-[0.22em]">Story focus</p>
                    <h3 className="mt-4 font-display text-2xl font-black uppercase tracking-[-0.04em]">
                      {activeStep.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-black/75">{activeStep.description}</p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {activeStep.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="neo-panel-sm bg-[var(--cream)] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-black"
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
                <div className={cn("neo-panel-lg w-full p-7 sm:p-8", step.accent)}>
                  <div className="flex flex-col gap-5 border-b-4 border-black pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">
                        {step.label}
                      </p>
                      <h3 className="mt-4 font-display text-3xl font-black uppercase tracking-[-0.05em] text-black">
                        {step.title}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-black">
                      <span>Scroll-driven reveal</span>
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="mt-6 text-base leading-8 text-black/80">{step.description}</p>
                  <p className="mt-4 text-base leading-8 text-black/80">{step.detail}</p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {step.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="neo-panel-sm bg-white px-4 py-4 text-sm font-bold uppercase tracking-[0.08em] text-black"
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
