import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useT } from "~/i18n/useT";

const FRAME_DURATION_MS = 1000;

export function HeroBanner() {
  const t = useT();
  const frames = [
    { kw: t("hero.bannerFrames.kw1") },
    { kw: t("hero.bannerFrames.kw2") },
    { kw: t("hero.bannerFrames.kw3") },
    { kw: t("hero.bannerFrames.kw4") },
  ] as const;
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % frames.length), FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, [frames.length]);

  const leftTitle = t("hero.bannerFrames.leftTitle");
  const leftSubtitle = t("hero.bannerFrames.leftSubtitle");

  return (
    <div className="relative aspect-[24/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-surface)]">
      {/* Left 45% — static identity */}
      <div className="absolute inset-y-0 left-0 flex w-[45%] items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="font-mono text-5xl font-bold tracking-tight text-[var(--color-fg)] md:text-6xl">{leftTitle}</div>
          <div className="mt-2 font-mono text-sm text-[var(--color-fg-muted)]">{leftSubtitle}</div>
        </div>
      </div>

      {/* 60-degree glow divider */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[45%] w-[2px] origin-top -rotate-[30deg] bg-[var(--color-accent)] shadow-[0_0_20px_var(--color-accent)]"
        style={{ height: "140%", top: "-20%" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-[45%] w-px origin-top -rotate-[30deg] bg-[var(--color-accent-hi)]"
        style={{ height: "140%", top: "-20%", marginLeft: "1px" }}
      />

      {/* Right 55% — scanning stripes + cycling word */}
      <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
        <div
          className="absolute inset-0 animate-[scan_2s_linear_infinite]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(116deg, transparent 0 28px, rgba(161,245,10,0.05) 28px 32px)",
            backgroundSize: "auto, 200% 100%",
          }}
        />
        <div className="flex h-full items-center justify-center">
          {reduce ? (
            <ol className="space-y-2 text-center">
              {frames.map((f) => (
                <li key={f.kw} className="font-mono text-2xl font-bold">
                  <span className="text-[var(--color-fg)]">{f.kw.replace(/[A-Za-z0-9$]+$/, "")}</span>{" "}
                  <span className="text-[var(--color-accent)]">{f.kw.match(/[A-Za-z0-9$]+$/)?.[0] ?? ""}</span>
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
                className="font-mono text-3xl font-bold tracking-tight md:text-5xl"
              >
                {splitFrame(frames[i].kw)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function splitFrame(text: string) {
  const m = text.match(/^(.*?)([A-Za-z0-9$]+)$/);
  if (!m) return <span className="text-[var(--color-accent)]">{text}</span>;
  const [, prefix, kw] = m;
  return (
    <span>
      <span className="text-[var(--color-fg)]">{prefix}</span>{" "}
      <span className="text-[var(--color-accent)] shadow-[0_0_18px_var(--color-accent)]">{kw}</span>
    </span>
  );
}
