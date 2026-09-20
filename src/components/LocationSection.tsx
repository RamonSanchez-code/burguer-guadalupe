import { ArrowUpRight, Clock, MapPin, Navigation } from "lucide-react";
import { Reveal, RevealWords } from "./Reveal";
import { BRAND } from "../data/site";

export default function LocationSection() {
  return (
    <section id="local" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">[ o point ]</span>
          </Reveal>
          <h2 className="mt-4 font-display uppercase leading-[0.92] text-cream [font-size:clamp(2.8rem,7vw,5.8rem)]">
            <RevealWords text="Passa aqui" />
            <RevealWords text="no rolê." delay={0.14} wordClassName="text-ember" />
          </h2>
          <Reveal delay={0.2}>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-cream/10 bg-soot/70 p-5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ember/30 bg-ember/10 text-ember">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <span className="font-display text-lg uppercase tracking-wide text-cream">{BRAND.hood}</span>
                  <span className="block text-sm text-smoke">{BRAND.city} — Brasil</span>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-cream/10 bg-soot/70 p-5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <span className="font-display text-lg uppercase tracking-wide text-cream">Horários no delivery</span>
                  <span className="block text-sm text-smoke">
                    Aberto hoje? Confira o status em tempo real no app de delivery.
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-4">
              <a
                href={BRAND.links.loja}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-ember px-7 py-3.5 font-display text-base tracking-wide text-coal transition-transform duration-300 hover:scale-[1.05] active:scale-95"
              >
                FAZER PEDIDO <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jardim+Maria+Candida+Brodowski+SP"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-cream/20 px-7 py-3.5 font-display text-base tracking-wide text-cream transition-all duration-300 hover:border-ember hover:text-ember"
              >
                <Navigation className="h-4 w-4" /> COMO CHEGAR
              </a>
            </div>
          </Reveal>
        </div>

        {/* stylized map */}
        <Reveal delay={0.15}>
          <div
            className="relative h-[24rem] overflow-hidden rounded-3xl border border-cream/10 bg-soot md:h-[28rem]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,237,222,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,237,222,0.05) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          >
            {/* roads */}
            <div className="absolute left-0 top-[30%] h-[2px] w-full -rotate-6 border-t-2 border-dashed border-cream/12" />
            <div className="absolute left-[55%] top-0 h-full w-[2px] rotate-12 border-l-2 border-dashed border-cream/12" />
            <div className="absolute left-0 top-[68%] h-[2px] w-full rotate-3 border-t-2 border-dashed border-cream/10" />

            {/* neighborhood chips */}
            <span className="absolute left-[10%] top-[12%] rounded-full border border-cream/12 bg-coal/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">
              Centro
            </span>
            <span className="absolute bottom-[14%] right-[10%] rounded-full border border-cream/12 bg-coal/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">
              Brodowski • SP
            </span>

            {/* pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping-slow rounded-full bg-ember/30" />
              <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 animate-ping-slow rounded-full bg-ember/40 [animation-delay:0.5s]" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ember shadow-[0_0_50px_rgba(255,122,26,0.55)]">
                <MapPin className="h-8 w-8 text-coal" />
              </div>
            </div>

            {/* label */}
            <div className="absolute left-1/2 top-[calc(50%+3.4rem)] -translate-x-1/2 rounded-2xl border border-cream/15 bg-coal/85 px-4 py-2.5 text-center backdrop-blur-md">
              <span className="block font-display text-sm tracking-wide text-cream">IMACULADA II</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ember">{BRAND.name}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
