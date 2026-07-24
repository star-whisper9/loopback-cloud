import { Button } from "@heroui/react";
import { Link } from "react-router";
import { Button as MovingButton } from "@/components/ui/moving-border";
import { useT } from "~/i18n/useT";
import { useMachine } from "~/lib/useMachine";
import { useInView } from "~/lib/useInView";
import { cn } from "~/lib/utils";

export function CTA() {
  const t = useT();
  const machine = useMachine();
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <section id="cta" ref={ref} className="mx-auto max-w-4xl px-6 py-24">
      <div
        className={cn(
          "rounded-3xl border border-accent/30 bg-surface px-8 py-12 text-center transition-all duration-500",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
      >
        <h2 className="text-3xl font-bold tracking-tight text-fg md:text-5xl">
          {t("cta.title")}
        </h2>
        <p className="mt-3 text-sm text-fg-muted">{t("cta.subtitle")}</p>
        <div className="mt-8 flex justify-center">
          {machine !== null ? (
            <Link to="/console">
              <MovingButton
                as="span"
                containerClassName="w-40 h-12 text-base"
                className="bg-accent text-black border-transparent font-semibold hover:brightness-110 transition"
                borderClassName="bg-[radial-gradient(var(--color-accent)_40%,transparent_60%)] opacity-[0.8]"
              >
                {t("console.layout.gotoConsole")}
              </MovingButton>
            </Link>
          ) : (
            <MovingButton
              as="a"
              href="#pricing"
              containerClassName="w-40 h-12 text-base"
              className="bg-accent text-black border-transparent font-semibold hover:brightness-110 transition"
              borderClassName="bg-[radial-gradient(var(--color-accent)_40%,transparent_60%)] opacity-[0.8]"
            >
              {t("cta.button")}
            </MovingButton>
          )}
        </div>
      </div>
    </section>
  );
}
