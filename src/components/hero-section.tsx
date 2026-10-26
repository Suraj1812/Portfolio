"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";

import { HeroAvatar } from "@/components/hero-avatar-3d";
import { MagneticButton } from "@/components/magnetic-button";
import { AnimatedButton } from "@/components/animated-button";
import { experience } from "@/lib/portfolio-data";
import "./hero-section.css";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

const buildWords = [
  { text: "AI products", color: "--cyan" },
  { text: "full-stack apps", color: "--mint" },
  { text: "LLM integrations", color: "--lime" },
  { text: "automation workflows", color: "--orange" },
  { text: "interactive web", color: "--yellow" },
];

const stickers = [
  { label: "LLMs", color: "--lime", x: "8%", y: "34%", tilt: "-8deg", delay: "0s" },
  { label: "Next.js", color: "#fff9ef", x: "4%", y: "52%", tilt: "7deg", delay: "-1.2s" },
  { label: "RAG", color: "--cyan", x: "82%", y: "58%", tilt: "-5deg", delay: "-2.4s" },
];

function colorValue(color: string) {
  return color.startsWith("--") ? `var(${color})` : color;
}

/** Cycles through what Suraj builds; stays on the first word for reduced motion. */
function RotatingWord({ enabled }: { enabled: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % buildWords.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [enabled]);

  const word = buildWords[enabled ? index : 0];
  return (
    <span className="hero-rotator" aria-live="off">
      <span
        key={word.text}
        className="hero-rotator-word"
        style={{ "--word-color": `var(${word.color})` } as CSSProperties}
      >
        {word.text}
      </span>
    </span>
  );
}

function SplitWord({ word, offset = 0 }: { word: string; offset?: number }) {
  return (
    <span className="hero-name-line" aria-hidden="true">
      {word.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className="hero-name-letter"
          style={{ "--i": index + offset } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export function HeroSection() {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const reduced = useReducedMotion();
  const motionEnabled = hydrated && !reduced;

  // The hero starts at the document top, so window scroll gives a stable parallax range.
  const { scrollY } = useScroll();
  const copyY = useTransform(scrollY, [0, 900], [0, -40]);
  const stageY = useTransform(scrollY, [0, 900], [0, 60]);
  const shapeY = useTransform(scrollY, [0, 900], [0, 140]);
  const shapeRotate = useTransform(scrollY, [0, 900], [0, -25]);

  const current = experience[0];

  return (
    <section id="top" className="hero neo-grid-bg" aria-labelledby="hero-title">
      {/* Decorative shapes */}
      <motion.span
        aria-hidden="true"
        className="hero-shape hero-shape-star"
        style={{ y: motionEnabled ? shapeY : 0, rotate: motionEnabled ? shapeRotate : 0 }}
      />
      <motion.span
        aria-hidden="true"
        className="hero-shape hero-shape-pill"
        style={{ y: motionEnabled ? shapeY : 0 }}
      />
      <svg className="hero-shape hero-squiggle" viewBox="0 0 160 40" aria-hidden="true">
        <path d="M4 30 Q 20 4, 36 22 T 68 22 T 100 22 T 132 22 T 156 14" />
      </svg>

      <div className="hero-inner">
        <motion.div className="hero-copy" style={{ y: motionEnabled ? copyY : 0 }}>
          <div className="hero-status hero-intro" style={{ "--d": "0ms" } as CSSProperties}>
            <span className="hero-status-dot" aria-hidden="true" />
            Building AI features @ {current?.company ?? "WellM"}
            <span className="hero-status-sep" aria-hidden="true" />
            <MapPin size={14} aria-hidden="true" /> Faridabad, IN
          </div>

          <h1 id="hero-title" className="hero-name">
            <span className="sr-only">Suraj Singh</span>
            <SplitWord word="SURAJ" />
            <span className="hero-name-row">
              <SplitWord word="SINGH" offset={5} />
              <span className="hero-name-dot" aria-hidden="true">
                .
              </span>
            </span>
          </h1>

          <div className="hero-role hero-intro" style={{ "--d": "520ms" } as CSSProperties}>
            AI Developer <span aria-hidden="true">×</span> Full-Stack Engineer
          </div>

          <p className="hero-lede hero-intro" style={{ "--d": "640ms" } as CSSProperties}>
            I build <RotatingWord enabled={motionEnabled} />
          </p>

          <div className="hero-actions hero-intro" style={{ "--d": "760ms" } as CSSProperties}>
            <MagneticButton href="#work">Explore projects</MagneticButton>
            <AnimatedButton href="/resume" variant="secondary">
              My resume
            </AnimatedButton>
          </div>
        </motion.div>

        <motion.div className="hero-stage" style={{ y: motionEnabled ? stageY : 0 }}>
          <div className="hero-stage-backdrop" aria-hidden="true">
            <span className="hero-sun" />
            <span className="hero-ring hero-ring-1" />
            <span className="hero-ring hero-ring-2" />
          </div>

          <HeroAvatar />

          <div className="hero-bubble" aria-hidden="true">
            <span>
              Hey, I&apos;m Suraj <span className="hero-wave">👋</span>
            </span>
          </div>

          <svg className="hero-arrow" viewBox="0 0 120 80" aria-hidden="true">
            <path d="M6 70 C 30 70, 60 60, 78 30" />
            <path d="M66 32 L 79 28 L 82 42" />
          </svg>
          <span className="hero-arrow-label" aria-hidden="true">
            that&apos;s me!
          </span>

          {stickers.map((sticker) => (
            <span
              key={sticker.label}
              className="hero-sticker"
              aria-hidden="true"
              style={
                {
                  "--x": sticker.x,
                  "--y": sticker.y,
                  "--tilt": sticker.tilt,
                  "--delay": sticker.delay,
                  "--sticker-color": colorValue(sticker.color),
                } as CSSProperties
              }
            >
              {sticker.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
