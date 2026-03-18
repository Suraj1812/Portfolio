"use client";

import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";

type CreativeLabItem = {
  title: string;
  description: string;
  link: string;
};

type CreativeLabProps = {
  items: CreativeLabItem[];
};

export function CreativeLab({ items }: CreativeLabProps) {
  const [featured, ...rest] = items;

  if (!featured) {
    return null;
  }

  return (
    <section id="lab" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Creative Lab"
            title="A sandbox for stronger visual direction, bolder interactions, and experimental UI energy."
            description="This is where I push the style further: richer motion, more expressive layout choices, and interface experiments that keep the work from feeling predictable."
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <ScrollReveal>
            <a
              href={featured.link}
              target="_blank"
              rel="noreferrer"
              className="neo-panel-lg group relative block min-h-[22rem] overflow-hidden bg-[var(--pink)] p-6 text-black sm:min-h-[28rem] sm:p-7"
            >
              <motion.div
                aria-hidden="true"
                className="absolute right-6 top-6 h-24 w-24 rounded-[1.3rem] border-4 border-black bg-[var(--yellow)] sm:right-8 sm:top-8 sm:h-36 sm:w-36 sm:rounded-[1.5rem]"
                animate={{ rotate: 360 }}
                transition={{ duration: 26, ease: "linear", repeat: Infinity }}
              />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="neo-chip inline-flex items-center gap-2 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-black">
                    <Sparkles className="h-4 w-4 text-black" />
                    <span>Featured experiment</span>
                  </div>
                  <h3 className="mt-6 max-w-xl font-display text-3xl font-black uppercase tracking-[-0.05em] sm:text-4xl">
                    {featured.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-base leading-8 text-black/75">{featured.description}</p>
                </div>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="neo-chip inline-flex items-center gap-3 bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-white">
                    <Play className="h-4 w-4 fill-current" />
                    <span>Open live experiment</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          </ScrollReveal>

          <div className="grid gap-5">
            {rest.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.06}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-panel-lg group relative flex min-h-[11rem] flex-col justify-between overflow-hidden bg-white p-6"
                >
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <p className="font-display text-xl font-black uppercase tracking-[-0.05em] text-black sm:text-2xl">
                      {item.title}
                    </p>
                    <ArrowUpRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <p className="relative z-10 mt-4 text-sm leading-7 text-black/75">{item.description}</p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
