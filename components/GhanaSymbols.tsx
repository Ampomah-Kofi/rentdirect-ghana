type SymbolName = "gye-nyame" | "sankofa" | "dwennimmen" | "fawohodie";

interface AdinkraSymbolProps {
  name: SymbolName;
  className?: string;
  title?: string;
}

const paths: Record<SymbolName, React.ReactNode> = {
  "gye-nyame": (
    <>
      <path d="M20 5c-5 3-7 7-6 11 1 5 7 6 10 2 2-3 0-7-4-8" />
      <path d="M20 35c5-3 7-7 6-11-1-5-7-6-10-2-2 3 0 7 4 8" />
      <path d="M9 20h22" />
      <path d="M13 12c-4 2-6 5-6 8s2 6 6 8" />
      <path d="M27 12c4 2 6 5 6 8s-2 6-6 8" />
    </>
  ),
  sankofa: (
    <>
      <path d="M28 12c-5-5-14-3-17 4-3 8 3 17 12 16 6-1 10-5 11-11" />
      <path d="M28 12h-8" />
      <path d="M28 12v8" />
      <path d="M18 18c3 0 5 2 5 5s-2 5-5 5-5-2-5-5" />
    </>
  ),
  dwennimmen: (
    <>
      <path d="M10 25c-4-5-2-12 4-14 5-2 10 2 10 7 0 4-3 7-7 7" />
      <path d="M30 25c4-5 2-12-4-14-5-2-10 2-10 7 0 4 3 7 7 7" />
      <path d="M8 29h24" />
      <path d="M14 17h12" />
    </>
  ),
  fawohodie: (
    <>
      <path d="M20 6v28" />
      <path d="M8 20h24" />
      <path d="M12 12c5 2 11 2 16 0" />
      <path d="M12 28c5-2 11-2 16 0" />
      <path d="M12 12c-3 5-3 11 0 16" />
      <path d="M28 12c3 5 3 11 0 16" />
    </>
  ),
};

export function AdinkraSymbol({ name, className = "", title }: AdinkraSymbolProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
}

export const GHANA_SYMBOL_STORIES = [
  {
    name: "gye-nyame" as const,
    label: "Gye Nyame",
    meaning: "Trust and protection",
  },
  {
    name: "sankofa" as const,
    label: "Sankofa",
    meaning: "Learn from home, build forward",
  },
  {
    name: "dwennimmen" as const,
    label: "Dwennimmen",
    meaning: "Strength with humility",
  },
  {
    name: "fawohodie" as const,
    label: "Fawohodie",
    meaning: "Independence and freedom",
  },
];

export function KenteSymbolRow({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {GHANA_SYMBOL_STORIES.map((item) => (
        <div key={item.name} className="rd-symbol-tile rounded-2xl px-4 py-3">
          <AdinkraSymbol name={item.name} className="h-8 w-8 text-[#F2B84B]" title={item.label} />
          <div>
            <p className="text-sm font-black text-white">{item.label}</p>
            <p className="text-xs text-white/58">{item.meaning}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
