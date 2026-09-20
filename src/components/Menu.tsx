import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Flame, MoveRight } from "lucide-react";
import { BRAND, MENU } from "../data/site";

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      }
    };
    measure();
    const t = setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["6%", "-38%"]);

  return (
    <section ref={sectionRef} id="cardapio" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {/* ghost background word */}
        <motion.span
          style={{ x: ghostX }}
          aria-hidden
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 font-display uppercase text-stroke-cream opacity-[0.13] whitespace-nowrap [font-size:clamp(10rem,30vw,24rem)]"
        >
          O RANGO
        </motion.span>

        {/* progress */}
        <div className="absolute right-5 top-24 z-10 hidden items-center gap-3 md:right-8 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">rolando</span>
          <div className="h-[3px] w-36 overflow-hidden rounded-full bg-cream/10">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-ember" />
          </div>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-5 px-[6vw] md:gap-7">
          {/* intro card */}
          <div className="flex w-[78vw] shrink-0 flex-col justify-center sm:w-[26rem]">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">[ cardápio ]</span>
            <h2 className="mt-4 font-display uppercase leading-[0.9] text-cream [font-size:clamp(3rem,8vw,6rem)]">
              O rango
              <span className="block text-stroke-ember">do rolê</span>
            </h2>
            <p className="mt-5 max-w-xs leading-relaxed text-smoke">
              Smash na chapa, brasa de verdade e aquele cheddar escorrendo. Escolhe o teu e já garante os pontos.
            </p>
            <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cream/60">
              continue rolando <MoveRight className="h-4 w-4 text-ember" />
            </span>
          </div>

          {/* item cards */}
          {MENU.map((item) => (
            <article
              key={item.name}
              className="group relative flex w-[76vw] shrink-0 flex-col overflow-hidden rounded-3xl border border-cream/10 bg-soot/80 transition-all duration-500 hover:-translate-y-2 hover:border-ember/40 sm:w-[400px]"
            >
              <div className="relative h-52 overflow-hidden sm:h-60">
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soot via-transparent to-transparent" />
                {item.tag && (
                  <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-ember px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-coal">
                    <Flame className="h-3 w-3" /> {item.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl uppercase text-cream">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-smoke">{item.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-ember">{item.price}</span>
                  <a
                    href={BRAND.links.loja}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Pedir ${item.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-coal"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}

          {/* CTA card */}
          <a
            href={BRAND.links.loja}
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-[76vw] shrink-0 flex-col items-start justify-center overflow-hidden rounded-3xl border border-ember/40 bg-gradient-to-br from-ember/20 via-soot to-soot p-8 transition-all duration-500 hover:-translate-y-2 sm:w-[400px]"
          >
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-ember/25 blur-3xl transition-all duration-700 group-hover:bg-ember/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">[ delivery ]</span>
            <h3 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream">
              Ver tudo<br />no delivery
            </h3>
            <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-smoke">
              Cardápio completo, montagem do seu jeito e pontuação automática no seu cadastro.
            </p>
            <span className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ember px-6 py-3.5 font-display text-base tracking-wide text-coal transition-transform duration-300 group-hover:scale-105">
              PEDIR AGORA <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
              compras online pontuam sozinhas
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
