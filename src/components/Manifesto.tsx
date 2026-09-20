import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame } from "lucide-react";
import { Reveal, RevealWords } from "./Reveal";
import { IMG } from "../data/site";

const STATS = [
  { value: "100%", label: "burger artesanal" },
  { value: "R$ 1", label: "= 1 ponto seu" },
  { value: "JUL/25", label: "no ar desde então" },
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-46, 46]);

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-36">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-8 rotate-[8deg] font-display uppercase text-stroke-cream opacity-15 [font-size:clamp(6rem,18vw,14rem)]"
      >
        rolê
      </span>
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">[ a casa ]</span>
          </Reveal>
          <h2 className="mt-4 font-display uppercase leading-[0.92] text-cream [font-size:clamp(2.8rem,7vw,5.8rem)]">
            <RevealWords text="Mais que um rango," />
            <RevealWords text="um rolê." delay={0.15} wordClassName="text-ember" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md leading-relaxed text-smoke md:text-lg">
              Burger artesanal feito na chapa, no coração de{" "}
              <span className="text-cream">Brodowski</span>. Aqui cada pedido vira ponto, cada ponto
              vira prêmio — e cada visita vira rolê. Jardim Maria Candida (Imaculada II) é o point.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-cream/10 pt-8">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.1}>
                <span className="font-display text-3xl text-ember md:text-4xl">{s.value}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-smoke">
                  {s.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-cream/10">
            <motion.img
              src={IMG.cozyBeer}
              alt="Burger, batata e cerveja — o rolê completo"
              style={{ y: imgY }}
              className="h-[26rem] w-full scale-[1.15] object-cover md:h-[30rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coal/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-2xl border border-cream/15 bg-coal/70 px-4 py-3 backdrop-blur-md">
              <Flame className="h-5 w-5 text-ember" />
              <div className="leading-tight">
                <span className="block font-display text-sm tracking-wide text-cream">BRASA DE VERDADE</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">sempre na chapa</span>
              </div>
            </div>
            <div className="absolute right-5 top-5 rounded-full bg-gold px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-coal">
              desde 2025
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
