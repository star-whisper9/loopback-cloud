import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useT } from "~/i18n/useT";

const FRAME_DURATION_MS = 2000;

export function HeroBanner() {
  const t = useT();
  const frames = [
    { prefix: t("hero.bannerFrames.kw1.prefix"), kw: t("hero.bannerFrames.kw1.kw") },
    { prefix: t("hero.bannerFrames.kw2.prefix"), kw: t("hero.bannerFrames.kw2.kw") },
    { prefix: t("hero.bannerFrames.kw3.prefix"), kw: t("hero.bannerFrames.kw3.kw") },
    { prefix: t("hero.bannerFrames.kw4.prefix"), kw: t("hero.bannerFrames.kw4.kw") },
  ] as const;
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(
      () => setI((p) => (p + 1) % frames.length),
      FRAME_DURATION_MS,
    );
    return () => clearInterval(id);
  }, [frames.length]);

  return (
    <div className="relative aspect-[24/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-surface)]">
      <div className="absolute inset-y-0 right-0 w-full overflow-hidden">
        <div
          className="absolute inset-0 animate-[scan_3s_linear_infinite]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(116deg, transparent 0 28px, rgba(161,245,10,0.05) 28px 32px)",
            backgroundSize: "200% 100%",
          }}
        />
        <div className="flex h-full items-center justify-center">
          {reduce ? (
            <ol className="space-y-2 text-center px-2">
              {frames.map((f, idx) => (
                <li
                  key={idx}
                  className="font-mono text-xl md:text-2xl font-bold"
                >
                  <span className="text-[var(--color-fg)]">{f.prefix}</span>
                  <span className="text-[var(--color-accent)]">{f.kw}</span>
                </li>
              ))}
            </ol>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="font-mono text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl px-2 text-center"
              >
                <span className="text-[var(--color-fg)]">{frames[i].prefix}</span>
                <span
                  className="text-[var(--color-accent)]"
                  style={{ textShadow: "0 0 18px var(--color-accent)" }}
                >
                  {frames[i].kw}
                </span>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}