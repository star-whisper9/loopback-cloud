import { useT } from "~/i18n/useT";
import { useInView } from "~/lib/useInView";
import { cn } from "~/lib/utils";

const AVATAR_COLORS = ["#a1f50a", "#54a8ff", "#ff8a3d", "#d8ff7c", "#ff5ea0", "#7c5cff"] as const;

export function DevQuotes() {
  const t = useT();
  const [ref, inView] = useInView<HTMLDivElement>();

  const quotes = [
    { name: t("devQuotes.quotes.0.name"), role: t("devQuotes.quotes.0.role"), text: t("devQuotes.quotes.0.text") },
    { name: t("devQuotes.quotes.1.name"), role: t("devQuotes.quotes.1.role"), text: t("devQuotes.quotes.1.text") },
    { name: t("devQuotes.quotes.2.name"), role: t("devQuotes.quotes.2.role"), text: t("devQuotes.quotes.2.text") },
    { name: t("devQuotes.quotes.3.name"), role: t("devQuotes.quotes.3.role"), text: t("devQuotes.quotes.3.text") },
    { name: t("devQuotes.quotes.4.name"), role: t("devQuotes.quotes.4.role"), text: t("devQuotes.quotes.4.text") },
    { name: t("devQuotes.quotes.5.name"), role: t("devQuotes.quotes.5.role"), text: t("devQuotes.quotes.5.text") },
  ];

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-12 text-3xl font-bold tracking-tight text-[var(--color-fg)] md:text-4xl">
        {t("devQuotes.sectionTitle")}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {quotes.map(({ name, role, text }, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const real = name === "star-whisper9";
          return (
            <article
              key={i}
              className={cn(
                "rounded-2xl border border-white/10 bg-[var(--color-surface)] p-6 transition-all duration-500",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                real && "ring-1 ring-[var(--color-accent)]/40",
              )}
            >
              <p className="text-sm leading-relaxed text-[var(--color-fg)]">"{text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.04] text-xs font-bold"
                  style={{ color }}
                >
                  {name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[var(--color-fg)]">{name}</div>
                  <div className="text-xs text-[var(--color-fg-muted)]">{role}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
