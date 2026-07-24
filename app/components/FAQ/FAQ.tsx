import { Accordion } from "@heroui/react";
import { useT } from "~/i18n/useT";
import { useInView } from "~/lib/useInView";
import { useCores } from "~/lib/useCores";
import { cn } from "~/lib/utils";

export function FAQ() {
  const t = useT();
  const cores = useCores();
  const [ref, inView] = useInView<HTMLDivElement>();
  const k8sA =
    cores !== undefined
      ? t("faq.items.5.a", { cores: String(cores) })
      : t("faq.items.5.aNoCores");
  const items = [
    [t("faq.items.0.q"), t("faq.items.0.a")],
    [t("faq.items.1.q"), t("faq.items.1.a")],
    [t("faq.items.2.q"), t("faq.items.2.a")],
    [t("faq.items.3.q"), t("faq.items.3.a")],
    [t("faq.items.4.q"), t("faq.items.4.a")],
    [t("faq.items.5.q"), k8sA],
  ] as const;

  return (
    <section ref={ref} className="mx-auto max-w-3xl px-6 py-20" id="faq">
      <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-fg md:text-4xl">
        {t("faq.sectionTitle")}
      </h2>
      <div
        className={cn(
          "transition-opacity duration-500",
          inView ? "opacity-100" : "opacity-0",
        )}
      >
        <Accordion>
          {items.map(([q, a], i) => (
            <Accordion.Item key={i} id={`faq-${i}`}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  {q}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="text-fg-muted">{a}</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
