type SectionHeadingProps = {
  title: string;
};

export function SectionHeading({
  title,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-black dark:text-white sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
