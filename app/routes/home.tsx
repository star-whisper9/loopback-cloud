import { useEffect } from "react";
import type { Route } from "./+types/home";
import { Navbar } from "~/components/Navbar/Navbar";
import { Hero } from "~/components/Hero/Hero";
import { SellingPoints } from "~/components/SellingPoints/SellingPoints";
import { DevQuotes } from "~/components/DevQuotes/DevQuotes";
import { Pricing } from "~/components/Pricing/Pricing";
import { FAQ } from "~/components/FAQ/FAQ";
import { CTA } from "~/components/CTA/CTA";
import { Footer } from "~/components/Footer/Footer";
import { useLocale } from "~/i18n/useT";

export function meta({ matches }: Route.MetaArgs) {
  const rootMatch = matches.find((m) => m?.id === "root");
  const locale = (rootMatch?.loaderData as { locale?: string } | undefined)?.locale ?? "zh";
  return [
    { title: locale === "en" ? "Loopback Cloud · Local-First Quantum Cloud" : "环回云 · Loopback Cloud" },
    {
      name: "description",
      content:
        locale === "en"
          ? "0 latency, 0 cost, absolutely secure — the world's only quantum-grade cloud whose data never leaves your home."
          : "0 延迟，0 成本，绝对安全——全球唯一数据绝不出户的量子级云服务。",
    },
  ];
}

export default function Home() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SellingPoints />
        <DevQuotes />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
