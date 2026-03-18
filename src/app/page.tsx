import Image from "next/image";
import { ArrowUpRight, Github, Linkedin, Mail, Phone } from "lucide-react";

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
import { absoluteUrl, siteConfig } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}#person`,
      name: "Suraj Singh",
      url: siteConfig.url,
      image: absoluteUrl(siteConfig.ogImage),
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
      jobTitle: "Full-Stack Software Engineer",
      description: siteConfig.description,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phoneRaw,
      mainEntityOfPage: siteConfig.url,
      nationality: siteConfig.country,
      knowsLanguage: ["English", "Hindi"],
      hasOccupation: {
        "@type": "Occupation",
        name: "Full-Stack Software Engineer",
        skills:
          "AI-powered applications, scalable web systems, Next.js, React, TypeScript, frontend architecture, API integrations"
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "business inquiries",
          email: siteConfig.contact.email,
          telephone: siteConfig.contact.phoneRaw,
          availableLanguage: ["English", "Hindi"]
        }
      ],
      knowsAbout: [
        "Next.js",
        "React",
        "TypeScript",
        "AI Applications",
        "Artificial Intelligence",
        "AI Product Engineering",
        "GSAP",
        "Framer Motion",
        "Frontend Architecture",
        "Responsive Web Design",
        "Scalable Web Systems"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}#website`,
      name: siteConfig.shortName,
      alternateName: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "en-IN",
      publisher: {
        "@id": `${siteConfig.url}#person`
      }
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}#webpage`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      isPartOf: {
        "@id": `${siteConfig.url}#website`
      },
      about: {
        "@id": `${siteConfig.url}#person`
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.ogImage)
      },
      inLanguage: "en-IN"
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteConfig.url}#portfolio`,
      url: siteConfig.url,
      name: "AI-Powered Full-Stack Software Engineering Portfolio",
      description:
        "Portfolio of Suraj Singh featuring AI-powered applications, scalable web systems, client projects, and interactive frontend engineering work.",
      isPartOf: {
        "@id": `${siteConfig.url}#website`
      },
      about: {
        "@id": `${siteConfig.url}#person`
      },
      inLanguage: "en-IN"
    },
    {
      "@type": "ItemList",
      name: "Featured AI and web projects",
      itemListElement: featuredProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: project.liveUrl,
        name: project.title
      }))
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <FloatingNavbar />

      <main className="relative overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HeroSection />
        <MetricsTicker items={tickerItems} />
        <ScrollStory steps={storySteps} />
        <HorizontalProjects projects={featuredProjects} />

        <section id="clients" className="bg-[var(--cream)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Client Work"
                title="Real production work behind the web and AI product systems."
                description="These launches show the business side of the portfolio too: real delivery, real users, AI-ready product framing, and interfaces built to support live companies."
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
                      className="neo-panel-lg group flex h-full flex-col bg-white p-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-display text-xl font-black uppercase tracking-[-0.03em] text-black">
                          {project.name}
                        </p>
                        <ArrowUpRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </div>
                      <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-black/70">
                        {project.focus}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-black/75">{project.summary}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.stack.map((item) => (
                          <span
                            key={item}
                            className="neo-chip bg-[var(--yellow)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-black"
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
                title="A focused stack for product UI, scalable systems, and AI-assisted applications."
                description="Next.js, React, TypeScript, Tailwind, GSAP, Framer Motion, and API-driven full-stack work stay at the center so the build looks strong and still ships cleanly."
              />
            </ScrollReveal>

            <div className="mt-12">
              <StackCloud skills={skills} tools={techCloud} />
            </div>
          </div>
        </section>

        <section id="github" className="bg-[var(--blue)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <ScrollReveal>
              <SectionHeading
                eyebrow="GitHub"
                title="Public AI, web, and product engineering output."
                description="GitHub is where the public side of the work lives: AI experiments, shipped ideas, prototypes, frontend systems, and the habit of building beyond project deadlines."
              />

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <AnimatedButton href={siteConfig.links.github} external>
                  Explore GitHub
                </AnimatedButton>
                <AnimatedButton href="#contact" variant="secondary">
                  Let&apos;s connect
                </AnimatedButton>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="grid gap-5">
                <div className="neo-panel-lg overflow-hidden bg-[var(--yellow)] p-4">
                  <Image
                    src="https://github-readme-stats.vercel.app/api/top-langs/?username=Suraj1812&layout=compact&hide_border=true&bg_color=00000000&title_color=111827&text_color=475569"
                    alt="Top languages for Suraj Singh"
                    width={1200}
                    height={420}
                    unoptimized
                    className="h-auto w-full rounded-[1rem] border-4 border-black"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="contact" className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <div className="neo-panel-lg relative overflow-hidden bg-[var(--orange)] px-6 py-10 text-black sm:px-10 sm:py-12">
                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="neo-chip inline-flex items-center gap-2 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-black">
                      <Github className="h-3.5 w-3.5" />
                      <span>Available for collaboration</span>
                    </div>
                    <h2 className="mt-5 max-w-3xl font-display text-3xl font-black uppercase tracking-[-0.05em] sm:text-4xl">
                      Let&apos;s build scalable web products and AI-powered systems that actually ship.
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-black/80">
                      If you need a full-stack engineer who can handle product UI, frontend
                      systems, integration work, and a sharper design direction, I&apos;m ready to
                      talk.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <a
                        href={siteConfig.links.phone}
                        className="neo-panel-lg flex items-center gap-3 bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.1em] text-black"
                      >
                        <Phone className="h-4 w-4" />
                        {siteConfig.contact.phoneDisplay}
                      </a>
                      <a
                        href={siteConfig.links.email}
                        className="neo-panel-lg flex items-center gap-3 bg-[var(--yellow)] px-4 py-4 text-sm font-black uppercase tracking-[0.1em] text-black"
                      >
                        <Mail className="h-4 w-4" />
                        {siteConfig.contact.email}
                      </a>
                      <a
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="neo-panel-lg flex items-center gap-3 bg-[var(--cyan)] px-4 py-4 text-sm font-black uppercase tracking-[0.1em] text-black"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                      <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="neo-panel-lg flex items-center gap-3 bg-[var(--lime)] px-4 py-4 text-sm font-black uppercase tracking-[0.1em] text-black"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                    <AnimatedButton href={siteConfig.links.github} external className="justify-center">
                      GitHub Profile
                    </AnimatedButton>
                    <AnimatedButton
                      href={siteConfig.links.linkedin}
                      external
                      variant="secondary"
                      className="justify-center"
                    >
                      LinkedIn
                    </AnimatedButton>
                    <AnimatedButton href="#work" variant="secondary" className="justify-center">
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
