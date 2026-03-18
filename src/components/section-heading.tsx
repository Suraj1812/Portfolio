import { Sparkles } from "lucide-react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <div className="neo-chip mb-4 inline-flex items-center gap-2 bg-[var(--pink)] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-black">
        <Sparkles className="h-3.5 w-3.5 text-black" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-black sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-black/75 sm:text-lg">{description}</p>
    </div>
  );
}
