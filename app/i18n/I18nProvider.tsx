import { I18nContext, createT } from "./useT";
import type { Dict } from "./en";
import type { Locale } from "./types";
import type { ReactNode } from "react";

export interface I18nProviderProps {
  locale: Locale;
  dict: Dict;
  children: ReactNode;
}

export function I18nProvider({ locale, dict, children }: I18nProviderProps) {
  const value = { locale, dict, t: createT(dict) };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
