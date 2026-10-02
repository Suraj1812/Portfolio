import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TiltCard } from "@/components/tilt-card";

import { clientProjects } from "@/lib/data";
import "./client-work.css";

const logos: Record<
  string,
  {
    src: string;
    width: number;
    height: number;
    dark?: boolean;
    compact?: boolean;
  }
> = {
  PeopleMaketh: {
    src: "/client-logos/peoplemaketh.svg",
    width: 167,
    height: 88,
  },
  SecureThread: {
    src: "/client-logos/securethread.png",
    width: 300,
    height: 300,
    dark: true,
    compact: true,
  },
  Evtaar: {
    src: "/client-logos/evtaar.webp",
    width: 640,
    height: 102,
    dark: true,
  },
  EkkoMD: {
    src: "/client-logos/ekkomd-mark.svg",
    width: 192,
    height: 192,
    compact: true,
  },
  Humigy: { src: "/client-logos/humigy.svg", width: 163, height: 57 },
};

export function ClientWork() {
  return (
    <section
      id="clients"
      className="branded-clients portfolio-container"
      aria-labelledby="client-work-title"
    >
      <div className="branded-clients-heading">
        <div>
          <span className="branded-clients-eyebrow">
            {clientProjects.length} CLIENT WEB EXPERIENCES
          </span>
          <h2 id="client-work-title">
            Client work.
            <br />
            <span>Different businesses. The same care.</span>
          </h2>
        </div>
        <p>
          Company websites and product experiences across security, healthcare,
          and business services.
        </p>
      </div>
      <div className="branded-client-grid">
        {clientProjects.map((project, index) => {
          const logo = logos[project.name];
          return (
            <ScrollReveal
              key={project.name}
              delay={(index % 3) * 0.05}
              className="branded-client-reveal"
            >
              <TiltCard className="branded-client-shell">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="branded-client-card"
                  style={
                    {
                      "--client-accent": `var(--${["cyan", "pink", "yellow", "lime", "orange", "blue"][index % 6]})`,
                    } as CSSProperties
                  }
                  aria-label={`Visit ${project.name} website, opens in a new tab`}
                >
                  <div className="branded-client-topline">
                    <span>0{index + 1} / WEB EXPERIENCE</span>
                    <span className="branded-client-domain">
                      {new URL(project.url).hostname
                        .replace("www.", "")
                        .replace("staging.", "")}
                    </span>
                  </div>
                  <div
                    className={`branded-client-logo${logo?.dark ? " branded-client-logo-dark" : ""}${logo?.compact ? " branded-client-logo-compact" : ""}`}
                  >
                    {logo ? (
                      <Image
                        src={logo.src}
                        alt=""
                        width={logo.width}
                        height={logo.height}
                        sizes="(max-width: 600px) 150px, 200px"
                        className="branded-client-image"
                      />
                    ) : (
                      <span className="branded-client-name-only">
                        {project.name}
                      </span>
                    )}
                  </div>
                  <div className="branded-client-details">
                    <h3>{project.name}</h3>
                    <p>
                      {project.name === "EaseMyCRM"
                        ? "Company web experience"
                        : project.focus}
                    </p>
                  </div>
                  <div className="branded-client-footer">
                    <span>Explore website</span>
                    <span className="branded-client-arrow">
                      <ArrowUpRight size={19} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </TiltCard>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
