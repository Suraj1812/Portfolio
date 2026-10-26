import Image from "next/image";
import { skillGroups } from "@/lib/portfolio-data";
import { TiltCard } from "@/components/tilt-card";

const artwork = [
  "/artwork/ai-robot.png",
  "/artwork/browser-ui.png",
  "/artwork/backend-database.png",
  "/artwork/automation-gears.png",
];
const cardColors = ["--cyan", "--mint", "--blue", "--lime"];

export function SkillsSection() {
  return (
    <div id="stack" className="skills-section" aria-label="Technical skills">
      <div className="skills-heading" data-aos="blur-up">
        <h3>The tools behind the work.</h3>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group, index) => {
          return (
            <div
              key={group.title}
              className="h-full"
              data-aos="zoom-in"
              data-aos-delay={index * 90}
            >
              <TiltCard className="group h-full">
              <div
                className="skill-group h-full"
                style={{ backgroundColor: `var(${cardColors[index]})` }}
              >
                <div className="skill-group-heading">
                  <Image
                    src={artwork[index]}
                    alt=""
                    width={52}
                    height={52}
                    sizes="52px"
                    className="h-[52px] w-[52px] shrink-0 object-contain transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transform-none"
                  />
                  <h4>{group.title}</h4>
                </div>
                <p>{group.description}</p>
                <div className="skill-tags">
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
              </TiltCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
