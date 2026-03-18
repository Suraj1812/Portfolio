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
  "left-[54%] top-[84%]",
  "left-[76%] top-[82%]"
];

const chipColors = [
  "bg-[var(--yellow)]",
  "bg-[var(--pink)]",
  "bg-[var(--cyan)]",
  "bg-[var(--lime)]",
  "bg-[var(--orange)]",
  "bg-white"
] as const;

export function StackCloud({ skills, tools }: StackCloudProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="neo-panel-lg bg-white p-6">
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={skill.label}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-black uppercase tracking-[-0.03em] text-black">
                    {skill.label}
                  </p>
                  <p className="mt-1 text-sm text-black/70">{skill.detail}</p>
                </div>
                <p className="text-sm font-black uppercase tracking-[0.1em] text-black">
                  {skill.level}%
                </p>
              </div>

              <div className="mt-4 h-5 overflow-hidden rounded-[999px] border-2 border-black bg-[var(--cream)]">
                <motion.div
                  className="h-full rounded-[999px] border-r-4 border-black bg-[var(--blue)]"
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

      <div className="neo-panel-lg neo-grid-bg relative min-h-[30rem] overflow-hidden bg-[var(--yellow)] p-6">
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black">Tech cloud</p>
          <h3 className="mt-3 font-display text-2xl font-black uppercase tracking-[-0.04em] text-black">
            Floating tools I reach for when building scalable web and AI products.
          </h3>
        </div>

        <div className="relative z-10 mt-8 h-[23rem]">
          {tools.map((tool, index) => (
            <motion.div
              key={tool}
              className={`neo-chip absolute ${chipPositions[index]} ${
                chipColors[index % chipColors.length]
              } px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-black`}
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
