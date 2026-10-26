import type { CSSProperties } from "react";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";

import "./creative-lab.css";

type CreativeLabItem = {
  title: string;
  description: string;
  link: string;
};

type CreativeLabProps = {
  items: CreativeLabItem[];
};

// Each side card gets its own accent and a small CSS-drawn motif.
const sideStyles = [
  { accent: "--orange", motif: "burst" },
  { accent: "--cyan", motif: "blocks" },
  { accent: "--lime", motif: "tag" },
] as const;

function Motif({ kind }: { kind: (typeof sideStyles)[number]["motif"] }) {
  if (kind === "blocks") {
    return (
      <span className="lab-motif lab-motif-blocks" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    );
  }
  if (kind === "tag") {
    return (
      <span className="lab-motif lab-motif-tag" aria-hidden="true">
        <span>SS/26</span>
      </span>
    );
  }
  return <span className="lab-motif lab-motif-burst" aria-hidden="true" />;
}

export function CreativeLab({ items }: CreativeLabProps) {
  const [featured, ...rest] = items;
  if (!featured) return null;

  return (
    <section id="lab" className="lab-section portfolio-container" aria-labelledby="lab-title">
      <div className="lab-heading" data-aos="blur-up">
        <div>
          <span className="lab-eyebrow">
            <Sparkles size={14} aria-hidden="true" /> THE PLAYGROUND
          </span>
          <h2 id="lab-title">
            Small experiments.
            <br />
            <span className="lab-highlight">Big interaction ideas.</span>
          </h2>
        </div>
        <p className="lab-sticker">
          <span className="lab-live-dot" aria-hidden="true" />
          {items.length} live builds
          <br />
          made for curiosity
        </p>
      </div>

      <div className="lab-grid">
        <a
          href={featured.link}
          target="_blank"
          rel="noreferrer"
          className="lab-featured"
          data-aos="fade-right"
        >
          <div className="lab-featured-top">
            <span className="lab-chip">
              <Sparkles size={14} aria-hidden="true" /> Featured experiment
            </span>
            <span className="lab-featured-index">EXP / 01</span>
          </div>
          <h3>{featured.title}</h3>
          <p>{featured.description}</p>

          <div className="lab-scene" aria-hidden="true">
            <div className="lab-solar">
              <span className="lab-orbit lab-orbit-1" />
              <span className="lab-orbit lab-orbit-2" />
              <span className="lab-orbit lab-orbit-3" />
              <span className="lab-sun-rays" />
              <span className="lab-sun" />
            </div>
          </div>

          <span className="lab-cta">
            <Play size={15} className="fill-current" aria-hidden="true" />
            Open live experiment
            <ArrowUpRight size={17} aria-hidden="true" />
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>

        <div className="lab-side">
          {rest.map((item, index) => {
            const style = sideStyles[index % sideStyles.length];
            return (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="lab-card"
                style={{ "--lab-accent": `var(${style.accent})` } as CSSProperties}
                data-aos="fade-left"
                data-aos-delay={100 + index * 90}
              >
                <div className="lab-card-top">
                  <span className="lab-card-index">
                    EXP / {String(index + 2).padStart(2, "0")}
                  </span>
                  <span className="lab-card-arrow">
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </div>
                <div className="lab-card-body">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <Motif kind={style.motif} />
                </div>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
