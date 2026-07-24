import { useLocale, useT } from "~/i18n/useT";
import type { Locale } from "~/i18n/types";
import { LOCALES } from "~/i18n/types";
import { cn } from "~/lib/utils";

export function LangSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/3 p-1",
        className,
      )}
    >
      {LOCALES.map((l: Locale) => {
        const active = l === locale;
        return (
          <a
            key={l}
            href={`?lang=${l}`}
            onClick={() => {
              document.cookie = `loopback-lang=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
            }}
            className={cn(
              "px-3 py-1 text-xs font-medium transition-colors rounded-full",
              active ? "bg-accent text-black" : "text-fg-muted hover:text-fg",
            )}
          >
            {t(`lang.${l}` as any)}
          </a>
        );
      })}
    </div>
  );
}
