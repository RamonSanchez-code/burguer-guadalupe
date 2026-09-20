import { Flame, Star } from "lucide-react";
import { MARQUEE_ITEMS } from "../data/site";

function Band({
  items,
  reverse = false,
  className = "",
  textClass = "",
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  textClass?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={`w-[106vw] -ml-[3vw] overflow-hidden py-3.5 md:py-5 ${className}`}>
      <div className={`flex w-max items-center gap-8 pr-8 ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8">
            <span className={`font-display text-2xl uppercase tracking-wide md:text-4xl ${textClass}`}>{item}</span>
            {reverse ? (
              <Star className="h-5 w-5 shrink-0 text-ember/50 md:h-7 md:w-7" />
            ) : (
              <Flame className="h-5 w-5 shrink-0 md:h-7 md:w-7" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-hidden className="relative z-20 -my-6 select-none py-6">
      <Band items={MARQUEE_ITEMS} className="-rotate-[1.4deg] bg-ember text-coal shadow-[0_10px_40px_rgba(255,122,26,0.25)]" />
      <Band
        items={[...MARQUEE_ITEMS].reverse()}
        reverse
        className="mt-2 hidden rotate-[1.1deg] border-y border-cream/12 bg-coal md:block"
        textClass="text-stroke-cream"
      />
    </section>
  );
}
