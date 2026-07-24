import { Button } from "@heroui/react";
import { useT } from "~/i18n/useT";
import { HeroBanner } from "./HeroBanner";

export function Hero() {
  const t = useT();
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pt-20 pb-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-mono text-[var(--color-accent)]">
            {t("hero.badge")}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[var(--color-fg)] md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-md text-base text-[var(--color-fg-muted)] md:text-lg">{t("hero.subtitle")}</p>
          <div className="mt-8 flex items-center gap-3">
            <a href="#pricing">
              <Button variant="primary" size="lg" className="font-semibold">{t("hero.ctaPrimary")}</Button>
            </a>
            <a href="#docs">
              <Button variant="outline" size="lg" className="font-semibold">{t("hero.ctaSecondary")}</Button>
            </a>
          </div>
        </div>
        <HeroBanner />
      </div>
    </section>
  );
}
