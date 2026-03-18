import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";

import { AnimatedButton } from "@/components/animated-button";
import { CreativeLab } from "@/components/creative-lab";
import { FloatingNavbar } from "@/components/floating-navbar";
import { HeroSection } from "@/components/hero-section";
import { HorizontalProjects } from "@/components/horizontal-projects";
import { MetricsTicker } from "@/components/metrics-ticker";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollStory } from "@/components/scroll-story";
import { SectionHeading } from "@/components/section-heading";
import { StackCloud } from "@/components/stack-cloud";
import { TiltCard } from "@/components/tilt-card";
import {
  clientProjects,
  featuredProjects,
  skills,
  storySteps,
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
        <ScrollStory steps={storySteps} />
        <HorizontalProjects projects={featuredProjects} />

        <section id="clients" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Client Work"
                title="Real production work that backs up the narrative with shipped outcomes."
                description="These projects show the other side of the portfolio: delivery, responsiveness, product framing, and interfaces built for actual users and businesses."
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
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.stack.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-ink/10 bg-shell px-3 py-1 text-xs font-medium text-slate"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </a>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <CreativeLab items={uiExperiments} />

        <section id="stack" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Tech Stack"
                title="A focused stack for premium frontend experiences and motion-heavy product work."
                description="Next.js, React, TypeScript, Tailwind, Framer Motion, GSAP, and Lenis stay at the center so the build can feel expressive without becoming hard to maintain."
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
                title="Real developer activity, experiments, and ongoing frontend exploration."
                description="GitHub is where the public side of the work lives: experiments, shipped ideas, prototypes, and the habit of building beyond client deadlines."
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
                      Let&apos;s build something smooth, premium, and impossible to ignore.
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
                      If you want a frontend experience with stronger motion, cleaner structure,
                      and a more cinematic feel, this portfolio is already showing the direction I
                      like to build in.
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
