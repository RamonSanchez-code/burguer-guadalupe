import { motion } from "framer-motion";
import { BadgePercent, Gift, ShoppingBag, Flame } from "lucide-react";
import { Reveal, RevealWords, EASE } from "./Reveal";
import { BRAND } from "../data/site";

const STEPS = [
  {
    icon: ShoppingBag,
    num: "01",
    title: "Ganhe 1 ponto a cada R$ 1,00 em compras",
    desc: "Junte pontos sempre que consumir — no balcão ou no delivery, é só informar seu CPF ou telefone.",
  },
  {
    icon: Gift,
    num: "02",
    title: "Resgate prêmios",
    desc: "Troque seus pontos por prêmios: refris, batatas, burgers e combos inteiros te esperam.",
  },
  {
    icon: BadgePercent,
    num: "03",
    title: "Ganhe ofertas exclusivas",
    desc: "Como membro, você pode receber as melhores ofertas e descontos. Aproveite!",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">[ programa de fidelidade ]</span>
        </Reveal>
        <RevealWords
          text="É muito fácil participar!"
          className="mt-4 block font-display uppercase leading-[0.95] text-cream [font-size:clamp(2.6rem,7vw,5.5rem)]"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-lg leading-relaxed text-smoke">
            Três passos e você já está dentro. Sem pegadinha, sem letra miúda — só sabor voltando pra você.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -10, rotateX: 3, rotateY: i === 0 ? -3 : i === 2 ? 3 : 0 }}
              className="group relative overflow-hidden rounded-3xl border border-cream/10 bg-soot/80 p-8 [transform-style:preserve-3d] [perspective:800px] transition-colors duration-500 hover:border-ember/40"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-ember/0 blur-3xl transition-all duration-700 group-hover:bg-ember/18" />
              <span className="absolute right-6 top-5 font-display text-6xl text-stroke-cream opacity-40 transition-opacity duration-500 group-hover:opacity-90">
                {step.num}
              </span>
              <div className="mb-16 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-ember/30 bg-ember/10 text-ember transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-8deg]">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl uppercase leading-tight text-cream">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-smoke">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <a
            href={BRAND.links.entrar}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-ember/50 px-8 py-3.5 font-display text-base tracking-wide text-ember transition-all duration-300 hover:bg-ember hover:text-coal"
          >
            <Flame className="h-4.5 w-4.5" />
            BORA ACUMULAR PONTOS
          </a>
        </Reveal>
      </div>
    </section>
  );
}
