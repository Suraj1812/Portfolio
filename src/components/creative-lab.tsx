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
    <section id="lab" className="px-4 py-24 sm:px-6 lg:px-8">
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
              className="group relative block min-h-[28rem] overflow-hidden rounded-[2.25rem] border border-white/70 bg-[#08111f] p-7 text-white shadow-[0_30px_100px_rgba(8,17,31,0.18)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,157,154,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,122,24,0.34),_transparent_34%)] transition-transform duration-500 group-hover:scale-110" />
              <motion.div
                aria-hidden="true"
                className="absolute right-8 top-8 h-36 w-36 rounded-full border border-white/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 26, ease: "linear", repeat: Infinity }}
              />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Featured experiment</span>
                  </div>
                  <h3 className="mt-6 max-w-xl font-display text-4xl font-semibold tracking-tight">
                    {featured.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">
                    {featured.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white/85">
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
                  className="group relative flex min-h-[11rem] flex-col justify-between overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,250,242,0.74))] p-6 shadow-card backdrop-blur"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,157,154,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,122,24,0.14),_transparent_38%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                      {item.title}
                    </p>
                    <ArrowUpRight className="h-5 w-5 text-slate transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <p className="relative z-10 mt-4 text-sm leading-7 text-slate">
                    {item.description}
                  </p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
