import { ArrowUpRight, Flame } from "lucide-react";
import { BRAND, scrollToId } from "../data/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-soot/60">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img src={BRAND.logoSquare80} alt="" className="h-12 w-12 rounded-full ring-2 ring-ember/60" />
              <div className="leading-none">
                <span className="block font-display text-2xl tracking-wide text-cream">GUADALUPE</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">rango & rolê</span>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-smoke">
              Burger artesanal em Brodowski/SP. Peça, acumule pontos, resgate prêmios e repita. Esse é o rolê.
            </p>
            <a
              href={BRAND.links.entrar}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 font-display text-sm tracking-wide text-coal transition-transform duration-300 hover:scale-105"
            >
              <Flame className="h-4 w-4" /> QUERO FAZER PARTE!
            </a>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke"> navegar </span>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Início", id: "inicio" },
                  { label: "Cardápio", id: "cardapio" },
                  { label: "Fidelidade", id: "fidelidade" },
                  { label: "Prêmios", id: "premios" },
                  { label: "Local", id: "local" },
                ].map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => scrollToId(l.id)}
                      className="text-sm text-cream/75 transition-colors hover:text-ember"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke"> links </span>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Delivery", href: BRAND.links.loja },
                  { label: "Entrar / Cadastrar", href: BRAND.links.entrar },
                  { label: "Fidelidade", href: BRAND.links.fidelidade },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-cream/75 transition-colors hover:text-ember"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none mt-14 select-none text-center font-display uppercase leading-[0.8] text-stroke-cream opacity-25 [font-size:clamp(3.4rem,12vw,10rem)]"
        >
          rango & rolê
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-smoke md:flex-row md:text-left">
          <span>
            © 2026 {BRAND.legal} — CNPJ {BRAND.cnpj}
          </span>
          <span>
            {BRAND.hood} — {BRAND.city}
          </span>
          <span>fidelidade via simsoft</span>
        </div>
      </div>
    </footer>
  );
}
