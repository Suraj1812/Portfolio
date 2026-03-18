import { Sparkles } from "lucide-react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-ember" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate sm:text-lg">{description}</p>
    </div>
  );
}
