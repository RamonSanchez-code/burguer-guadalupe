import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import HowItWorks from "./components/HowItWorks";
import Menu from "./components/Menu";
import Manifesto from "./components/Manifesto";
import Loyalty from "./components/Loyalty";
import Rewards from "./components/Rewards";
import LocationSection from "./components/LocationSection";
import Footer from "./components/Footer";
import RulesModal from "./components/RulesModal";
import Preloader from "./components/Preloader";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1750);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="relative min-h-svh bg-coal text-cream">
      <AnimatePresence>{loading && <Preloader key="preloader" />}</AnimatePresence>

      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <Menu />
        <Manifesto />
        <Loyalty />
        <Rewards onOpenRules={() => setRulesOpen(true)} />
        <LocationSection />
      </main>
      <Footer />
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
