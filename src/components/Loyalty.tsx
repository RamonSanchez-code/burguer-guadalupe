import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, CircleDollarSign, Flame, Gift, LogIn, Nfc, Star } from "lucide-react";
import { Reveal, RevealWords } from "./Reveal";
import { BRAND } from "../data/site";

function PointsCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  return (
    <div
      ref={wrapRef}
      onPointerMove={(e) => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 22);
        rx.set((0.5 - py) * 16);
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className="relative mx-auto w-full max-w-[540px] [perspective:1100px]"
    >
      {/* glow + spinning ring */}
      <div className="absolute -inset-10 rounded-full bg-ember/25 blur-[80px]" aria-hidden />
      <div
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-cream/15"
        aria-hidden
      />

      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative [transform-style:preserve-3d]">
        <div className="relative aspect-[1.55/1] w-full overflow-hidden rounded-[2rem] border border-cream/25 bg-gradient-to-br from-ember via-[#e05a12] to-ketchup shadow-[0_40px_80px_-20px_rgba(255,90,20,0.45)]">
          {/* texture + shine */}
          <div className="absolute inset-0 bg-noise opacity-[0.12]" aria-hidden />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(420px circle at var(--gx, 70%) var(--gy, 20%), rgba(255,255,255,0.28), transparent 60%)",
            }}
          />
          <Flame aria-hidden className="absolute -bottom-10 -right-8 h-56 w-56 rotate-12 text-coal/15" />

          {/* content layers */}
          <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between [transform:translateZ(45px)]">
              <div className="flex items-center gap-3.5">
                <img
                  src={BRAND.logoSquare80}
                  alt=""
                  className="h-11 w-11 rounded-full ring-2 ring-coal/25"
                />
                <div className="leading-tight">
                  <span className="block font-display text-lg tracking-wide text-coal">GUADALUPE</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-coal/70">
                    programa de fidelidade
                  </span>
                </div>
              </div>
              <Nfc className="h-6 w-6 text-coal/70" />
            </div>

            <div className="[transform:translateZ(65px)]">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coal/70">seus pontos</span>
              <div className="flex items-end gap-2.5">
                <span className="font-display leading-none text-coal [font-size:clamp(2.8rem,7vw,4.4rem)]">1.250</span>
                <span className="mb-1.5 font-mono text-sm font-bold uppercase tracking-widest text-coal/80">pts</span>
              </div>
            </div>

            <div className="flex items-end justify-between [transform:translateZ(45px)]">
              <div className="space-y-1.5">
                <div className="h-6 w-10 rounded-md border border-coal/30 bg-coal/15 p-1">
                  <div className="h-full w-full rounded-sm border border-coal/40" />
                </div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-coal/75">
                  membro guadalupe
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-coal/75">desde 07/2025</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating chips */}
      <div className="absolute -left-4 top-6 hidden animate-float md:block [animation-delay:0.6s]">
        <div className="flex -rotate-6 items-center gap-1.5 rounded-full border border-gold/40 bg-coal/80 px-3.5 py-2 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 text-gold" />
          <span className="font-mono text-[11px] font-bold text-gold">+150 pts</span>
        </div>
      </div>
      <div className="absolute -right-3 bottom-10 hidden animate-float md:block [animation-delay:1.6s]">
        <div className="flex rotate-3 items-center gap-1.5 rounded-full border border-cream/20 bg-coal/80 px-3.5 py-2 backdrop-blur-md">
          <Gift className="h-3.5 w-3.5 text-ember" />
          <span className="font-mono text-[11px] font-bold text-cream">resgate livre</span>
        </div>
      </div>
    </div>
  );
}

export default function Loyalty() {
  return (
    <section id="fidelidade" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute right-[-15%] top-0 h-[36rem] w-[36rem] rounded-full bg-ember/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">[ fidelidade ]</span>
          </Reveal>
          <h2 className="mt-4 font-display uppercase leading-[0.92] text-cream [font-size:clamp(2.6rem,6.5vw,5.4rem)]">
            <RevealWords text="A cada pedido," />
            <RevealWords text="novas vantagens" delay={0.12} wordClassName="text-ember" />
            <RevealWords text="garantidas." delay={0.24} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md leading-relaxed text-smoke md:text-lg">
              Cadastre-se e aproveite os nossos benefícios feitos especialmente para você!
            </p>
          </Reveal>

          {/* equation */}
          <Reveal delay={0.28}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-2xl border border-cream/15 bg-soot px-4 py-3 font-mono text-sm font-bold text-cream">
                <CircleDollarSign className="h-4 w-4 text-ember" /> R$ 1,00 em compras
              </span>
              <ArrowRight className="h-4 w-4 text-smoke" />
              <span className="flex items-center gap-2 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 font-mono text-sm font-bold text-gold">
                <Star className="h-4 w-4" /> 1 ponto
              </span>
              <ArrowRight className="h-4 w-4 text-smoke" />
              <span className="flex items-center gap-2 rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 font-mono text-sm font-bold text-ember">
                <Gift className="h-4 w-4" /> prêmios & ofertas
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-smoke">
              Acesse sua conta para ver seus <span className="text-cream">pontos</span>,{" "}
              <span className="text-cream">prêmios</span> e <span className="text-cream">atividades</span> em{" "}
              {BRAND.legal}.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
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
              <a
                href={BRAND.links.entrar}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-cream/20 px-8 py-4 font-display text-lg tracking-wide text-cream transition-all duration-300 hover:border-gold hover:text-gold"
              >
                <LogIn className="h-5 w-5" />
                ENTRAR
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <PointsCard />
        </Reveal>
      </div>
    </section>
  );
}
