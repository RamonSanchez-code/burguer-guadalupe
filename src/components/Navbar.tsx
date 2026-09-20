import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Flame, Menu, X, MapPin } from "lucide-react";
import { BRAND, scrollToId } from "../data/site";
import { cn } from "../utils/cn";

const LINKS = [
  { label: "Início", id: "inicio" },
  { label: "Cardápio", id: "cardapio" },
  { label: "Fidelidade", id: "fidelidade" },
  { label: "Prêmios", id: "premios" },
  { label: "Local", id: "local" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "bg-coal/75 backdrop-blur-xl border-b border-cream/8" : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <button onClick={() => scrollToId("inicio")} className="group flex items-center gap-3">
            <img
              src={BRAND.logoSquare80}
              alt="Logo Guadalupe Rango e Rolê"
              className="h-10 w-10 rounded-full ring-2 ring-ember/60 transition-transform duration-500 group-hover:rotate-[15deg]"
            />
            <span className="flex flex-col items-start leading-none">
              <span className="font-display text-lg tracking-wide text-cream">GUADALUPE</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">rango & rolê</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke transition-colors hover:bg-cream/5 hover:text-cream"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={BRAND.links.entrar}
              target="_blank"
              rel="noreferrer"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-ember px-5 py-2.5 font-display text-sm tracking-wide text-coal transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:inline-flex"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Flame className="h-4 w-4" />
              QUERO FAZER PARTE
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors hover:border-ember hover:text-ember lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="h-[2px] origin-left bg-gradient-to-r from-ketchup via-ember to-gold" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-coal/97 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-[70px] items-center justify-between px-5">
              <span className="font-display text-lg tracking-wide text-cream">GUADALUPE</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors hover:border-ember hover:text-ember"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => scrollToId(l.id), 350);
                  }}
                  className="font-display text-5xl uppercase tracking-wide text-cream transition-colors hover:text-ember"
                >
                  {l.label}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                href={BRAND.links.entrar}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3.5 font-display text-lg text-coal"
              >
                <Flame className="h-5 w-5" /> QUERO FAZER PARTE!
              </motion.a>
            </nav>
            <div className="flex items-center gap-2 px-8 pb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
              <MapPin className="h-4 w-4 text-ember" />
              {BRAND.hood} — {BRAND.city}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
