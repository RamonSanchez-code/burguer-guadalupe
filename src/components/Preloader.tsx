import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { BRAND } from "../data/site";
import { EASE } from "./Reveal";

export default function Preloader() {
  const word = "GUADALUPE".split("");
  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.75, ease: EASE }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-coal"
    >
      <div className="absolute inset-0 bg-noise opacity-[0.05]" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative mb-6"
      >
        <img src={BRAND.logoSquare512} alt="" className="h-20 w-20 rounded-full ring-2 ring-ember/60" />
        <motion.span
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-ember"
        >
          <Flame className="h-4 w-4 text-coal" />
        </motion.span>
      </motion.div>

      <div className="flex overflow-hidden">
        {word.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.05, ease: EASE }}
            className="font-display text-4xl tracking-wide text-cream md:text-6xl"
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-ember"
      >
        rango & rolê
      </motion.span>

      <div className="mt-8 h-[3px] w-44 overflow-hidden rounded-full bg-cream/10">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.25, delay: 0.2, ease: "easeInOut" }}
          className="h-full w-full bg-gradient-to-r from-ketchup via-ember to-gold"
        />
      </div>
    </motion.div>
  );
}
