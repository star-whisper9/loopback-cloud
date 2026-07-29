import { useT } from "~/i18n/useT";

export function FallbackBanner() {
  const t = useT();
  return <div className="fallback-banner">{t("docs.fallback")}</div>;
}
