import Image from "next/image";
import { ArrowUpRight, Github, Layers3, Sparkles } from "lucide-react";

import { AnimatedButton } from "@/components/animated-button";
import { FloatingNavbar } from "@/components/floating-navbar";
import { HeroSection } from "@/components/hero-section";
import { MetricsTicker } from "@/components/metrics-ticker";
import { ProjectShowcase } from "@/components/project-showcase";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { StackCloud } from "@/components/stack-cloud";
import { TiltCard } from "@/components/tilt-card";
import {
  capabilityCards,
  clientProjects,
  featuredProjects,
  skills,
  techCloud,
  tickerItems,
  uiExperiments
} from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <FloatingNavbar />

      <main className="relative overflow-hidden">
        <HeroSection />
        <MetricsTicker items={tickerItems} />

        <section id="about" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <ScrollReveal>
              <SectionHeading
                eyebrow="About"
                title="Frontend work that feels deliberate, expressive, and ready for real users."
                description="I focus on product-minded UI engineering: clean systems, thoughtful motion, and launches that work across devices instead of just looking good in screenshots."
              />
            </ScrollReveal>

            <div className="grid gap-5 sm:grid-cols-3">
              {capabilityCards.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.08}>
                  <div className="h-full rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-card backdrop-blur">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-white">
                      <Layers3 className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <ProjectShowcase projects={featuredProjects} />

        <section id="clients" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Client Work"
                title="Production projects where clarity, trust, and delivery mattered."
                description="Alongside personal experiments, I have shipped client-facing experiences across SaaS, healthcare, commerce, and brand-led web products."
              />
            </ScrollReveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {clientProjects.map((project, index) => (
                <ScrollReveal key={project.name} delay={index * 0.05}>
                  <TiltCard className="h-full">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex h-full flex-col rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-card backdrop-blur"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-display text-xl font-semibold text-ink">{project.name}</p>
                        <ArrowUpRight className="h-5 w-5 text-slate transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-ember">{project.focus}</p>
                      <p className="mt-4 text-sm leading-7 text-slate">{project.summary}</p>
                    </a>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="UI Experiments"
                title="Creative playground work that keeps the portfolio from feeling generic."
                description="These experiments are where I push visual direction, interaction ideas, and layout personality further than a typical product brief would allow."
              />
            </ScrollReveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-4">
              {uiExperiments.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.06}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex h-full min-h-[18rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,250,242,0.72))] p-6 shadow-card backdrop-blur"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,157,154,0.1),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,122,24,0.12),_transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-ink">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate">{item.description}</p>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Tech Stack"
                title="A focused build stack designed for premium frontend work."
                description="Next.js, React, TypeScript, Tailwind, and motion tooling form the core. I use them to build fast landing pages, product UIs, and expressive interactions without losing maintainability."
              />
            </ScrollReveal>

            <div className="mt-12">
              <StackCloud skills={skills} tools={techCloud} />
            </div>
          </div>
        </section>

        <section id="github" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <ScrollReveal>
              <SectionHeading
                eyebrow="GitHub"
                title="A mix of shipped products, experiments, and ongoing frontend exploration."
                description="Most of my personal and experimental builds live on GitHub, where I keep exploring interface direction, product surfaces, and motion-heavy concepts."
              />

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <AnimatedButton href="https://github.com/Suraj1812" external>
                  Explore GitHub
                </AnimatedButton>
                <AnimatedButton href="#contact" variant="secondary">
                  Let&apos;s connect
                </AnimatedButton>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="grid gap-5">
                <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-card backdrop-blur">
                  <Image
                    src="https://github-readme-stats.vercel.app/api?username=Suraj1812&show_icons=true&hide_border=true&bg_color=00000000&title_color=111827&text_color=475569&icon_color=0f9d9a"
                    alt="GitHub stats for Suraj Singh"
                    width={1200}
                    height={500}
                    className="h-auto w-full rounded-[1.25rem]"
                  />
                </div>
                <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-card backdrop-blur">
                  <Image
                    src="https://github-readme-stats.vercel.app/api/top-langs/?username=Suraj1812&layout=compact&hide_border=true&bg_color=00000000&title_color=111827&text_color=475569"
                    alt="Top languages for Suraj Singh"
                    width={1200}
                    height={420}
                    className="h-auto w-full rounded-[1.25rem]"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="contact" className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-navy px-6 py-10 text-white shadow-[0_30px_120px_rgba(15,23,42,0.24)] sm:px-10 sm:py-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,157,154,0.24),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,122,24,0.28),_transparent_36%)]" />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                      <Github className="h-3.5 w-3.5" />
                      <span>Available for collaboration</span>
                    </div>
                    <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                      Building interfaces that feel fast, premium, and distinctly yours.
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
                      If you want a frontend experience with stronger motion, cleaner structure,
                      and sharper visual direction, this portfolio is built to show exactly that.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                    <AnimatedButton
                      href="https://github.com/Suraj1812"
                      external
                      className="justify-center bg-white text-ink hover:bg-shell"
                    >
                      GitHub Profile
                    </AnimatedButton>
                    <AnimatedButton href="#work" variant="secondary" className="justify-center border-white/15 bg-white/8 text-white hover:bg-white/12">
                      Featured Work
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  );
}
