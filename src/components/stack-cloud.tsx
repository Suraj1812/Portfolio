"use client";

import { motion } from "framer-motion";

type Skill = {
  label: string;
  level: number;
  detail: string;
};

type StackCloudProps = {
  skills: Skill[];
  tools: string[];
};

const chipPositions = [
  "left-[8%] top-[8%]",
  "left-[46%] top-[10%]",
  "left-[68%] top-[22%]",
  "left-[14%] top-[34%]",
  "left-[48%] top-[38%]",
  "left-[72%] top-[48%]",
  "left-[10%] top-[58%]",
  "left-[42%] top-[62%]",
  "left-[68%] top-[74%]",
  "left-[24%] top-[78%]",
  "left-[56%] top-[16%]",
  "left-[26%] top-[50%]",
  "left-[62%] top-[60%]",
  "left-[36%] top-[26%]",
  "left-[54%] top-[84%]"
];

export function StackCloud({ skills, tools }: StackCloudProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-card backdrop-blur">
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={skill.label}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{skill.label}</p>
                  <p className="mt-1 text-sm text-slate">{skill.detail}</p>
                </div>
                <p className="text-sm font-semibold text-slate">{skill.level}%</p>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/8">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal via-cyan-500 to-ember"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.78),rgba(255,250,242,0.82))] p-6 shadow-card backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,157,154,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,122,24,0.18),_transparent_34%)]" />

        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate">Tech cloud</p>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
            Floating tools I reach for when building polished frontend work.
          </h3>
        </div>

        <div className="relative z-10 mt-8 h-[23rem]">
          {tools.map((tool, index) => (
            <motion.div
              key={tool}
              className={`absolute ${chipPositions[index]} rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur`}
              animate={{ y: [0, -10, 0], x: index % 2 === 0 ? [0, 6, 0] : [0, -6, 0] }}
              transition={{
                duration: 5 + (index % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.08
              }}
            >
              {tool}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
