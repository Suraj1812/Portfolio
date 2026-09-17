const languages = [
  { name: "TypeScript", value: 36, color: "#377CC5", icon: "/icons/typescript.svg" },
  { name: "Python", value: 34, color: "#F1DE53", icon: "/icons/python.svg" },
  { name: "C#", value: 20, color: "#7654D5", icon: "/icons/csharp.svg" },
  { name: "JavaScript", value: 10, color: "#F29D38", icon: "/icons/javascript.svg" }
];

export function GithubLanguageCard() {
  const gradient = languages.reduce((parts, language, index) => {
    const start = languages
      .slice(0, index)
      .reduce((total, item) => total + item.value, 0);
    const end = start + language.value;
    parts.push(`${language.color} ${start}% ${end}%`);
    return parts;
  }, [] as string[]).join(", ");

  return (
    <div className="neo-panel-lg overflow-hidden bg-[var(--yellow)] p-4">
      <div className="rounded-[1rem] border-4 border-black bg-[#fffdf8] p-5 text-black sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b-4 border-black pb-5">
          <p className="font-display text-xl font-black uppercase tracking-[-0.04em] sm:text-2xl">
            Public code / language mix
          </p>
          <span className="hidden text-right text-xs font-black uppercase tracking-[0.12em] text-black/55 sm:block">
            Suraj1812 / GitHub
          </span>
        </div>

        <div className="mt-7 grid items-center gap-8 sm:grid-cols-[1fr_0.85fr]">
          <div className="space-y-5">
            {languages.map((language) => (
              <div key={language.name} title={`${language.name} — ${language.value}%`}>
                <div className="flex items-center gap-3">
                  <img
                    src={language.icon}
                    alt=""
                    width={34}
                    height={34}
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-base font-black sm:text-lg">{language.name}</span>
                  <span className="ml-auto text-base font-black text-black/55 sm:text-lg">
                    {language.value}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${language.value}%`, backgroundColor: language.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full p-5 sm:h-60 sm:w-60">
            <div
              className="flex h-full w-full items-center justify-center rounded-full"
              style={{ background: `conic-gradient(${gradient})` }}
              title="Hover a language row to see its percentage"
            >
              <div className="flex h-[68%] w-[68%] flex-col items-center justify-center rounded-full bg-[#fffdf8] text-center">
                <span className="font-display text-2xl font-black uppercase tracking-[-0.05em]">4 core</span>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-black/55">languages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
