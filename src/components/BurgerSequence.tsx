import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/* frame sequence                                                      */
/* ------------------------------------------------------------------ */

const FRAMES = 70;
const FRAME_RATIO = 666 / 716; // width / height of the rendered frames
const FULL_W = 666; // native resolution of the source footage
const SMALL_W = 380;

/** how much scrolling, as a share of the viewport height, the whole build
    takes. The hero is only about one screen tall, so this has to stay short —
    the burger is anchored against the scroll while it runs (see `drift`). */
const BUILD_VH = 0.5;
const BUILD_VH_SM = 0.32;
/** frames 0-9 are the bottom bun still falling, so the sequence settles this
    far on its own — otherwise the hero would open on an empty stage.
    Raise it to start further along (0.26 ≈ bun + carne, 0.41 ≈ + cheddar). */
const INTRO_TO = 0.13;
const INTRO_FRAMES = 10;

const src = (i: number, small: boolean) =>
  `/burger-build/${small ? "sm/" : ""}${String(i).padStart(2, "0")}.webp`;

/** the opening beat first, then a coarse-to-fine sweep: a handful of frames
    in and the whole build already scrubs, just in bigger steps */
function loadOrder() {
  const out: number[] = [];
  const seen = new Set<number>();
  const push = (i: number) => {
    if (i >= 0 && i < FRAMES && !seen.has(i)) {
      seen.add(i);
      out.push(i);
    }
  };
  for (let i = 0; i < INTRO_FRAMES; i++) push(i);
  push(FRAMES - 1);
  for (let step = 16; step >= 1; step >>= 1) for (let i = 0; i < FRAMES; i += step) push(i);
  for (let i = 0; i < FRAMES; i++) push(i);
  return out;
}

export default function BurgerSequence({ progress }: { progress: MotionValue<number> }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imgs = useRef<(CanvasImageSource | null)[]>(Array(FRAMES).fill(null));
  const ready = useRef<boolean[]>(Array(FRAMES).fill(false));
  const drawn = useRef(-1);
  const raf = useRef(0);
  const target = useRef(0);
  const maxW = useRef(FULL_W);
  const refit = useRef<() => void>(() => {});
  const introStarted = useRef(false);

  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(0);

  /* the hero's progress is a share of the section height, which differs a lot
     between desktop and phone — convert it back to scrolled pixels */
  const metrics = useRef({ vh: 800, range: 800, wide: false });

  useEffect(() => {
    const section = stageRef.current?.closest("section");
    const measure = () => {
      metrics.current = {
        vh: window.innerHeight,
        range: (section as HTMLElement | null)?.offsetHeight ?? window.innerHeight,
        wide: window.matchMedia("(min-width: 1024px)").matches,
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (section) ro.observe(section);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const buildPx = () => {
    const { vh, wide } = metrics.current;
    return Math.max(1, vh * (wide ? BUILD_VH : BUILD_VH_SM));
  };

  /* scroll and the entrance both feed one timeline; whichever is further wins */
  const scrollPlay = useTransform(progress, (p) =>
    Math.min(1, Math.max(0, (p * metrics.current.range) / buildPx()))
  );
  const intro = useMotionValue(0);
  const play = useMotionValue(0);

  /* ---------------- drawing ---------------- */

  /** closest frame that has actually arrived — keeps the sequence usable
      while the rest of the images are still downloading */
  const pick = (i: number) => {
    for (let d = 0; d < FRAMES; d++) {
      if (i - d >= 0 && ready.current[i - d]) return i - d;
      if (i + d < FRAMES && ready.current[i + d]) return i + d;
    }
    return -1;
  };

  const render = useCallback(() => {
    raf.current = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const idx = Math.max(0, Math.min(FRAMES - 1, Math.round(target.current * (FRAMES - 1))));
    const use = pick(idx);
    if (use < 0) return;
    const key = use * 8192 + canvas.width;
    if (key === drawn.current) return;
    drawn.current = key;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgs.current[use]!, 0, 0, canvas.width, canvas.height);
  }, []);

  const requestDraw = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(render);
  }, [render]);

  const apply = useCallback(() => {
    const v = Math.max(scrollPlay.get(), intro.get());
    play.set(v);
    target.current = v;
    requestDraw();
  }, [intro, play, requestDraw, scrollPlay]);

  useMotionValueEvent(scrollPlay, "change", apply);
  useMotionValueEvent(intro, "change", apply);
  useEffect(apply, [apply]);

  /* ---------------- canvas sizing ---------------- */

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      /* never allocate more pixels than the source frames actually carry */
      const w = Math.min(Math.round(stage.clientWidth * dpr), maxW.current);
      const h = Math.round(w / FRAME_RATIO);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      drawn.current = -1;
      requestDraw();
    };
    refit.current = fit;
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [requestDraw]);

  /* ---------------- preload ---------------- */

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    /* below lg the stage never gets wider than the small set */
    const small =
      window.matchMedia("(max-width: 1023px)").matches ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    maxW.current = small ? SMALL_W : FULL_W;
    refit.current();

    const order = loadOrder();
    let next = 0;
    let active = 0;

    const pump = () => {
      while (active < 6 && next < order.length) {
        const i = order[next++];
        active++;
        const img = new Image();
        img.decoding = "async";
        const settle = () => {
          if (cancelled) return;
          active--;
          done++;
          setLoaded(done);
          requestDraw();
          pump();
        };
        img.onload = () => {
          imgs.current[i] = img;
          ready.current[i] = true;
          if (img.decode) img.decode().then(settle, settle);
          else settle();
        };
        img.onerror = settle;
        img.src = src(i, small);
      }
    };
    pump();

    return () => {
      cancelled = true;
    };
  }, [requestDraw]);

  /* entrance: hold until the opening frames are in, then land the bun */
  useEffect(() => {
    if (introStarted.current || loaded < INTRO_FRAMES) return;
    introStarted.current = true;
    if (reduced) {
      intro.set(INTRO_TO);
      return;
    }
    const controls = animate(intro, INTRO_TO, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [intro, loaded, reduced]);

  /* ---------------- 3D motion ---------------- */

  const soft = { stiffness: 110, damping: 26, mass: 0.45 };
  const tiltX = useSpring(useTransform(play, [0, 0.45, 1], [14, 4, -4]), soft);
  const tiltY = useSpring(useTransform(play, [0, 0.3, 0.65, 1], [-12, 6, -5, 9]), soft);
  const tiltZ = useSpring(useTransform(play, [0, 0.5, 1], [-2.4, 1, -0.8]), soft);
  const zoom = useSpring(useTransform(play, [0, 0.82, 1], [0.88, 1.04, 1.0]), soft);
  /* counter-scroll: the burger is held almost still while it assembles, then
     eases out of the hold and leaves with the page. h·(1−e^(−s/h)) starts at
     slope 1 (a perfect anchor) and relaxes without a kink at the hand-off. */
  const drift = useTransform(progress, (p) => {
    const s = p * metrics.current.range;
    const h = buildPx();
    return h * (1 - Math.exp(-s / h));
  });

  const px = useSpring(useMotionValue(0), { stiffness: 70, damping: 20, mass: 0.6 });
  const py = useSpring(useMotionValue(0), { stiffness: 70, damping: 20, mass: 0.6 });
  const pointerX = useTransform(px, [-1, 1], [10, -10]);
  const pointerY = useTransform(py, [-1, 1], [-7, 7]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  const shadowScale = useTransform(play, [0, 0.12, 1], [0.45, 0.8, 1.12]);
  const shadowFade = useTransform(play, [0, 0.12, 1], [0, 0.55, 0.95]);
  const glow = useTransform(play, [0, 0.35, 1], [0.3, 0.65, 1]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[130px]"
      />

      <motion.div
        style={reduced ? undefined : { y: drift }}
        className="perspective-1200 relative w-[min(84vw,52svh)] sm:w-[min(68vw,54svh)] lg:w-[min(38rem,66svh)]"
      >
        {/* pointer parallax */}
        <motion.div
          style={reduced ? undefined : { rotateX: pointerY, rotateY: pointerX }}
          className="preserve-3d relative"
        >
          {/* scroll-driven 3D */}
          <motion.div
            ref={stageRef}
            style={
              reduced ? undefined : { rotateX: tiltX, rotateY: tiltY, rotateZ: tiltZ, scale: zoom }
            }
            className="preserve-3d relative will-change-transform"
          >
            {/* pool of light + contact shadow under the stack */}
            <motion.div
              style={{ opacity: shadowFade, scaleX: shadowScale }}
              className="pointer-events-none absolute inset-x-[14%] bottom-[2%] h-12 rounded-[50%] bg-ember/25 blur-2xl"
            />
            <motion.div
              style={{ opacity: shadowFade, scaleX: shadowScale }}
              className="pointer-events-none absolute inset-x-[22%] bottom-[3%] h-5 rounded-[50%] bg-black/70 blur-md"
            />
            <canvas
              ref={canvasRef}
              aria-hidden
              className="relative block w-full [aspect-ratio:666/716] drop-shadow-[0_26px_32px_rgba(0,0,0,0.55)]"
            />
          </motion.div>
        </motion.div>

        {/* until the first frames land */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            loaded > 1 ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
            montando {Math.round((loaded / FRAMES) * 100)}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
