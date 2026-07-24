import { useT } from "~/i18n/useT";

export function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-white/10 bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
            <span className="text-sm font-semibold text-[var(--color-fg)]">
              {t("brand")}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-fg-muted)]">
            {t("footer.slogan")}
          </p>
        </div>
        <nav className="flex gap-6 text-xs text-[var(--color-fg-muted)]">
          <a href="#" className="hover:text-[var(--color-fg)]">
            {t("footer.links.about")}
          </a>
          <a href="#" className="hover:text-[var(--color-fg)]">
            {t("footer.links.blog")}
          </a>
          <a href="#" className="hover:text-[var(--color-fg)]">
            {t("footer.links.status")}
          </a>
        </nav>
      </div>
      <div className="border-t border-white/5 px-6 py-6">
        <p className="mx-auto max-w-6xl text-center text-[10px] leading-relaxed text-[var(--color-fg-muted)]/70">
          {t("footer.disclaimer1")}
        </p>
        <p className="mx-auto mt-2 max-w-6xl text-center text-[10px] text-[var(--color-fg-muted)]/70">
          {t("footer.disclaimer2")}
        </p>
      </div>
    </footer>
  );
}
