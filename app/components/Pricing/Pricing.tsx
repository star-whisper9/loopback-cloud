import { Check } from "lucide-react";
import { Button } from "@heroui/react";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useT } from "~/i18n/useT";
import { useInView } from "~/lib/useInView";
import { useCores } from "~/lib/useCores";
import { cn } from "~/lib/utils";

export function Pricing() {
  const t = useT();
  const cores = useCores();
  const [ref, inView] = useInView<HTMLDivElement>();
  const enterpriseCpuRow =
    cores !== undefined
      ? t("pricing.enterprise.rows.0", { cores: String(cores) })
      : t("pricing.enterprise.cpuCoresFallback");

  const community = {
    name: t("pricing.community.name"),
    tag: t("pricing.community.tag"),
    price: t("pricing.community.price"),
    priceNote: t("pricing.community.priceNote"),
    cta: t("pricing.community.cta"),
    rows: [
      t("pricing.community.rows.0"),
      t("pricing.community.rows.1"),
      t("pricing.community.rows.2"),
      t("pricing.community.rows.3"),
      t("pricing.community.rows.4"),
    ],
  };
  const enterprise = {
    name: t("pricing.enterprise.name"),
    tag: t("pricing.enterprise.tag"),
    price: t("pricing.enterprise.price"),
    priceNote: t("pricing.enterprise.priceNote"),
    cta: t("pricing.enterprise.cta"),
    popularBadge: t("pricing.enterprise.popularBadge"),
    rows: [
      enterpriseCpuRow,
      t("pricing.enterprise.rows.1"),
      t("pricing.enterprise.rows.2"),
      t("pricing.enterprise.rows.3"),
      t("pricing.enterprise.rows.4"),
    ],
  };

  const Card = ({
    c,
    popular,
  }: {
    c: typeof community & { popularBadge?: string };
    popular?: boolean;
  }) => (
    <div className="relative flex flex-col h-full p-7">
      {popular && (
        <span className="absolute right-5 top-5 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-bold tracking-wider text-black z-10">
          {c.popularBadge!}
        </span>
      )}
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)]">
        {c.tag}
      </span>
      <h3 className="mt-3 text-2xl font-bold text-[var(--color-fg)]">{c.name}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-[var(--color-fg)]">{c.price}</span>
        <span className="text-sm text-[var(--color-fg-muted)]">{c.priceNote}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {c.rows.map((r) => (
          <li
            key={r}
            className="flex items-start gap-3 text-sm text-[var(--color-fg)]"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <a href="#cta">
          <Button
            variant={popular ? "primary" : "outline"}
            className="w-full font-semibold"
          >
            {c.cta}
          </Button>
        </a>
      </div>
    </div>
  );

  return (
    <section id="pricing" ref={ref} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--color-fg)] md:text-4xl">
        {t("pricing.sectionTitle")}
      </h2>
      <p className="mb-12 text-center text-sm text-[var(--color-fg-muted)]">
        {t("pricing.subtitle")}
      </p>
      <div className="grid items-stretch gap-6 md:grid-cols-2">
        <div
          className={cn(
            "transition-all duration-500",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <EvervaultCard className="h-full w-full">
            <Card c={community} />
          </EvervaultCard>
        </div>
        <div
          className={cn(
            "transition-all duration-500",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <EvervaultCard className="h-full w-full">
            <Card c={enterprise} popular />
          </EvervaultCard>
        </div>
      </div>
    </section>
  );
}
