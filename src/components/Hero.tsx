import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, BadgePercent, Flame, Gift, MapPin } from "lucide-react";
import Burger3D from "./Burger3D";
import { BRAND, scrollToId } from "../data/site";
import { EASE } from "./Reveal";

function TitleLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em] -mb-[0.04em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="inicio" className="relative min-h-svh overflow-hidden">
      {/* background layers */}
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-ember/14 blur-[130px]" />
        <div className="absolute right-[-10%] top-1/3 h-[30rem] w-[30rem] rounded-full bg-ketchup/10 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-[0.05]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-coal to-transparent z-[5]" />

      {/* 3D burger */}
      <div className="absolute inset-x-0 top-16 h-[62svh] lg:inset-y-0 lg:left-auto lg:right-[-4%] lg:top-0 lg:h-auto lg:w-[58%] xl:w-[56%]">
        <Burger3D progress={scrollYProgress} />
        {/* floating chips */}
        <motion.div style={{ opacity: fade }} className="absolute left-[6%] top-[20%] hidden animate-float md:block [animation-delay:0.4s]">
          <div className="flex -rotate-6 items-center gap-2 rounded-2xl border border-cream/15 bg-cream/8 px-4 py-2.5 backdrop-blur-md">
            <Flame className="h-4 w-4 text-ember" />
            <span className="font-mono text-xs font-bold tracking-widest text-cream">+1 PONTO = R$ 1</span>
          </div>
        </motion.div>
        <motion.div style={{ opacity: fade }} className="absolute bottom-[16%] left-[12%] hidden animate-float lg:block [animation-delay:1.3s]">
          <div className="flex rotate-3 items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-2.5 backdrop-blur-md">
            <Gift className="h-4 w-4 text-gold" />
            <span className="font-mono text-xs font-bold tracking-widest text-cream">PRÊMIO DESBLOQUEADO</span>
          </div>
        </motion.div>
        <motion.div style={{ opacity: fade }} className="absolute right-[10%] top-[30%] hidden animate-float md:block [animation-delay:2s]">
          <div className="flex rotate-6 items-center gap-2 rounded-2xl border border-cream/15 bg-cream/8 px-4 py-2.5 backdrop-blur-md">
            <BadgePercent className="h-4 w-4 text-ketchup" />
            <span className="font-mono text-xs font-bold tracking-widest text-cream">OFERTA EXCLUSIVA</span>
          </div>
        </motion.div>
      </div>

      {/* content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-5 pb-28 pt-[68svh] sm:pt-[70svh] md:px-8 md:pb-24 lg:justify-center lg:pt-40"
      >
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cream/15 bg-coal/60 px-4 py-2 backdrop-blur-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-ember" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/80">
              Brodowski • SP — programa de fidelidade
            </span>
          </motion.div>

          <h1 className="font-display uppercase leading-[0.88] tracking-[0.01em] text-cream [font-size:clamp(3.4rem,13vw,9.5rem)] lg:[font-size:clamp(4rem,8.5vw,9rem)]">
            <TitleLine delay={0.45}>Guadalupe</TitleLine>
            <TitleLine delay={0.58}>
              <span className="text-ember">Rango</span>
            </TitleLine>
            <TitleLine delay={0.71}>
              <span className="text-stroke-cream">& Rolê</span>
            </TitleLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
            className="mt-7 max-w-md text-base leading-relaxed text-smoke md:text-lg"
          >
            A cada pedido, novas vantagens garantidas. Cadastre-se e aproveite benefícios feitos
            especialmente para você:{" "}
            <span className="font-semibold text-cream">1 ponto a cada R$ 1,00 em compras.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href={BRAND.links.entrar}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ember px-8 py-4 font-display text-lg tracking-wide text-coal transition-transform duration-300 hover:scale-[1.05] active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Flame className="h-5 w-5" />
              QUERO FAZER PARTE!
            </a>
            <button
              onClick={() => scrollToId("cardapio")}
              className="inline-flex items-center gap-2.5 rounded-full border border-cream/20 px-8 py-4 font-display text-lg tracking-wide text-cream transition-all duration-300 hover:border-ember hover:text-ember"
            >
              VER CARDÁPIO
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-12 hidden grid-cols-3 gap-6 border-t border-cream/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke md:grid"
          >
            <span className="text-cream/70">R$ 1 = 1 ponto</span>
            <span>Prêmios pra resgatar</span>
            <span>Ofertas só pra membro</span>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-cream/25 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-ember" />
        </motion.div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
          role pro rolê <ArrowDown className="h-3 w-3" />
        </span>
      </motion.div>
    </section>
  );
}
