import { Button } from "@heroui/react";
import { useT } from "~/i18n/useT";
import { useInView } from "~/lib/useInView";
import { cn } from "~/lib/utils";

export function CTA() {
  const t = useT();
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <section id="cta" ref={ref} className="mx-auto max-w-4xl px-6 py-24">
      <div
        className={cn(
          "rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] px-8 py-12 text-center transition-all duration-500",
          inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        )}
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-fg)] md:text-5xl">
          {t("cta.title")}
        </h2>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          {t("cta.subtitle")}
        </p>
        <div className="mt-8 flex justify-center">
          <a href="#pricing">
            <Button variant="primary" size="lg" className="font-semibold">
              {t("cta.button")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
