import { motion } from "framer-motion";
import { FileText, Star } from "lucide-react";
import { Reveal, RevealWords, EASE } from "./Reveal";
import { REWARDS } from "../data/site";

const MAX = 1200;

export default function Rewards({ onOpenRules }: { onOpenRules: () => void }) {
  return (
    <section id="premios" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute left-[-12%] top-1/4 h-[30rem] w-[30rem] rounded-full bg-gold/8 blur-[130px]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">[ prêmios ]</span>
            </Reveal>
            <RevealWords
              text="Juntou, trocou."
              className="mt-4 block font-display uppercase leading-[0.92] text-cream [font-size:clamp(2.8rem,7vw,5.8rem)]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-sm text-sm leading-relaxed text-smoke">
              A cada R$ 1 em compras, você ganha 1 ponto! Junte e troque pelos prêmios abaixo.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {REWARDS.map((r, i) => {
            const pct = Math.min(100, Math.round((r.points / MAX) * 100));
            return (
              <motion.article
                key={r.name}
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -10 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-cream/10 bg-soot/80 transition-colors duration-500 hover:border-gold/45"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soot via-soot/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-end gap-1.5 [transform:translateZ(0)]">
                    <span className="font-display text-4xl leading-none text-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                      {r.points.toLocaleString("pt-BR")}
                    </span>
                    <span className="mb-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cream">
                      pontos
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl uppercase leading-tight text-cream">{r.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-smoke">{r.desc}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">
                      <span>progresso do rolê</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: EASE }}
                        className="h-full rounded-full bg-gradient-to-r from-ember to-gold"
                      />
                    </div>
                  </div>
                  <a
                    href="https://guadalupeburger.simsoft.app/parceiroCadastro?parceiro=15158&loja=16589&source=fidelidade"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 font-display text-sm tracking-wide text-gold transition-all duration-300 hover:bg-gold hover:text-coal"
                  >
                    <Star className="h-4 w-4" />
                    RESGATAR
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-cream/10 bg-soot/60 px-6 py-6 md:flex-row md:px-8">
            <p className="max-w-xl text-center text-xs leading-relaxed text-smoke md:text-left">
              Os resgates podem sofrer alterações conforme política da empresa, sem aviso prévio.
            </p>
            <button
              onClick={onOpenRules}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-cream/20 px-6 py-3 font-display text-sm tracking-wide text-cream transition-all duration-300 hover:border-ember hover:text-ember"
            >
              <FileText className="h-4 w-4" />
              REGULAMENTO DO PROGRAMA
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
