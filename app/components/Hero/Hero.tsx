import { Button } from "@heroui/react";
import { useT } from "~/i18n/useT";
import { Button as MovingButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { HeroBanner } from "./HeroBanner";

export function Hero() {
  const t = useT();
  return (
    <section id="top" className="relative overflow-hidden">
      <BackgroundRippleEffect />
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-mono text-accent">
              {t("hero.badge")}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-fg md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-md text-base text-fg-muted md:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <MovingButton
                as="a"
                href="#pricing"
                containerClassName="w-40 h-12 text-base"
                className="bg-accent text-black border-transparent font-semibold hover:brightness-110 transition"
                borderClassName="bg-[radial-gradient(var(--color-accent)_40%,transparent_60%)] opacity-[0.8]"
              >
                {t("hero.ctaPrimary")}
              </MovingButton>
              <a href="#docs">
                <Button variant="outline" size="lg" className="font-semibold">
                  {t("hero.ctaSecondary")}
                </Button>
              </a>
            </div>
          </div>
          <HeroBanner />
        </div>
      </div>
    </section>
  );
}
