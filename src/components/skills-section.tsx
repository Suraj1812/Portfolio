import Image from "next/image";
import type { CSSProperties } from "react";
import { skillGroups } from "@/lib/portfolio-data";
import { TiltCard } from "@/components/tilt-card";

import "./skills-section.css";

const cards = [
  { art: "/artwork/ai-robot.png", color: "--cyan" },
  { art: "/artwork/browser-ui.png", color: "--mint" },
  { art: "/artwork/backend-database.png", color: "--blue" },
  { art: "/artwork/automation-gears.png", color: "--lime" },
];

// The first few tools in each group are the everyday go-to picks.
const coreCount = 3;

export function SkillsSection() {
  const totalTools = skillGroups.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <div id="stack" className="skills-section" aria-labelledby="skills-title">
      <div className="skills-heading" data-aos="blur-up">
        <div>
          <span className="skills-eyebrow">
            <span aria-hidden="true">✳</span> THE STACK
          </span>
          <h3 id="skills-title">
            The tools behind{" "}
            <span className="skills-scribble">
              the work.
              <svg viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 15 C 40 6, 80 5, 118 11 S 190 20, 217 8" />
              </svg>
            </span>
          </h3>
        </div>
        <dl className="skills-stats">
          <div>
            <dt>Tools in rotation</dt>
            <dd>{totalTools}+</dd>
          </div>
          <div>
            <dt>Disciplines</dt>
            <dd>{String(skillGroups.length).padStart(2, "0")}</dd>
          </div>
        </dl>
      </div>

      <div className="skills-grid">
        {skillGroups.map((group, index) => {
          const card = cards[index % cards.length];
          return (
            <div
              key={group.title}
              className="skills-card-wrap"
              data-aos="zoom-in"
              data-aos-delay={index * 90}
            >
              <TiltCard className="h-full">
                <article
                  className="skill-card"
                  style={{ "--skill-bg": `var(${card.color})` } as CSSProperties}
                >
                  <div className="skill-card-top">
                    <span className="skill-card-art">
                      <Image src={card.art} alt="" width={64} height={64} sizes="64px" />
                    </span>
                    <span className="skill-card-count">
                      {group.skills.length} tools
                    </span>
                  </div>
                  <h4>{group.title}</h4>
                  <p>{group.description}</p>
                  <ul className="skill-chips" aria-label={`${group.title} tools`}>
                    {group.skills.map((skill, skillIndex) => (
                      <li
                        key={skill}
                        className={skillIndex < coreCount ? "is-core" : undefined}
                        style={{ "--i": skillIndex } as CSSProperties}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <span className="skill-card-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </article>
              </TiltCard>
            </div>
          );
        })}
      </div>
      <p className="skills-legend">
        <span className="skills-legend-swatch" aria-hidden="true" /> Dark chips are
        my everyday go-to tools.
      </p>
    </div>
  );
}
