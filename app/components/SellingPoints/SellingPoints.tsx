import { ShieldCheck, Gauge, Lock, Activity, Cpu } from "lucide-react";
import { GlareCard } from "@/components/ui/glare-card";
import { useT } from "~/i18n/useT";
import { useInView } from "~/lib/useInView";

const ICONS = [ShieldCheck, Gauge, Lock, Activity, Cpu] as const;

export function SellingPoints() {
  const t = useT();
  const [ref, inView] = useInView<HTMLDivElement>();
  const items = [
    t("sellingPoints.items.0.title"),
    t("sellingPoints.items.0.principle"),
    t("sellingPoints.items.1.title"),
    t("sellingPoints.items.1.principle"),
    t("sellingPoints.items.2.title"),
    t("sellingPoints.items.2.principle"),
    t("sellingPoints.items.3.title"),
    t("sellingPoints.items.3.principle"),
    t("sellingPoints.items.4.title"),
    t("sellingPoints.items.4.principle"),
  ];

  return (
    <section id="product" ref={ref} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-10 text-3xl font-bold tracking-tight text-[var(--color-fg)] md:text-4xl">
        {t("sellingPoints.sectionTitle")}
      </h2>
      <div
        className="grid gap-6 transition-all duration-500"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(20px)",
        }}
      >
        {ICONS.map((Icon, idx) => {
          const title = items[idx * 2];
          const principle = items[idx * 2 + 1];
          return (
            <div key={idx} className="h-[220px]">
              <GlareCard className="h-full w-full">
                <div className="flex h-full flex-col gap-3 p-6">
                  <span className="text-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent)]">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="text-lg font-semibold leading-tight text-[var(--color-fg)]">{title}</h3>
                  <p className="mt-auto text-sm text-[var(--color-fg-muted)]">{principle}</p>
                </div>
              </GlareCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
