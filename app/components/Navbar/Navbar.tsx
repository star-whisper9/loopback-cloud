import { useEffect, useState } from "react";
import { useT } from "~/i18n/useT";
import { LangSwitch } from "~/components/LangSwitch/LangSwitch";
import { Button as MovingButton } from "@/components/ui/moving-border";
import { cn } from "~/lib/utils";

export function Navbar() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-bg/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
          <span className="text-sm font-semibold tracking-tight text-fg">
            {t("brand")}
          </span>
          <span className="hidden text-xs text-fg-muted sm:inline">
            {t("brandTagline")}
          </span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#product"
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            {t("nav.product")}
          </a>
          <a
            href="#pricing"
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            {t("nav.pricing")}
          </a>
          <a
            href="#docs"
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            {t("nav.docs")}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <MovingButton
            as="a"
            href="#pricing"
            borderRadius="9999px"
            containerClassName="w-28 h-9 text-sm"
            className="bg-accent text-black border-transparent font-semibold hover:brightness-110 transition"
            borderClassName="bg-[radial-gradient(var(--color-accent)_40%,transparent_60%)] opacity-[0.8]"
          >
            {t("nav.cta")}
          </MovingButton>
        </div>
      </nav>
    </header>
  );
}
