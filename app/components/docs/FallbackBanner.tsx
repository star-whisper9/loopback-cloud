import type { DocLocale } from "~/lib/docs/types";

export function FallbackBanner({ locale }: { locale: DocLocale }) {
  const text =
    locale === "zh"
      ? "本文暂无对应语言译文，已为您回退到中文版本。"
      : "This article has no translation in your language; showing the Chinese version.";
  return <div className="fallback-banner">{text}</div>;
}
