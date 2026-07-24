import {
  ShieldCheck,
  Gauge,
  Lock,
  Activity,
  Cpu,
  Footprints,
} from "lucide-react";
import { GlareCard } from "@/components/ui/glare-card";
import { useT } from "~/i18n/useT";
import { useInView } from "~/lib/useInView";
import { useCores } from "~/lib/useCores";

const ICONS = [ShieldCheck, Gauge, Lock, Activity, Cpu, Footprints] as const;
const IMAGES = [
  "/ddos.jpg",
  "/low-latency.jpg",
  "/zero-trust.jpg",
  "/sla.jpg",
  "/hardware.jpg",
  "/ops.jpg",
];

export function SellingPoints() {
  const t = useT();
  const cores = useCores();
  const [ref, inView] = useInView<HTMLDivElement>();
  const principle4 =
    cores !== undefined
      ? t("sellingPoints.items.4.principle", { cores: String(cores) })
      : t("sellingPoints.items.4.principleNoCores");
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
    principle4,
    t("sellingPoints.items.5.title"),
    t("sellingPoints.items.5.principle"),
  ];

  return (
    <section id="product" ref={ref} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-10 text-3xl font-bold tracking-tight text-fg md:text-4xl">
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
            <div key={idx} className="h-55">
              <GlareCard className="h-full w-full">
                <div className="relative flex h-full flex-col gap-3 p-6">
                  <img
                    src={IMAGES[idx]}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
                  <span className="relative z-1 text-accent drop-shadow-[0_0_8px_var(--color-accent)]">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="relative z-1 text-lg font-semibold leading-tight text-fg drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    {title}
                  </h3>
                  <p className="relative z-1 mt-auto text-sm text-fg-muted drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {principle}
                  </p>
                </div>
              </GlareCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
