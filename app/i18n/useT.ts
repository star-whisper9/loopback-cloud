import { createContext, useContext } from "react";
import type { Dict } from "./en";
import type { Locale } from "./types";

export type NestedKey<T> = T extends readonly (infer U)[]
  ? U extends object
    ? `${number}.${NestedKey<U>}`
    : `${number}`
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends object
          ? `${K}.${NestedKey<T[K]>}`
          : K;
      }[keyof T & string]
    : never;

export type TranslationFn = (
  key: NestedKey<Dict>,
  params?: Record<string, string | number>,
) => string;

export function createT(dict: Dict): TranslationFn {
  return (key, params) => {
    const parts = key.split(".");
    let cur: unknown = dict;
    for (const p of parts) {
      if (
        cur === null ||
        typeof cur !== "object" ||
        !(p in (cur as Record<string, unknown>))
      ) {
        throw new Error(`i18n missing key: ${key}`);
      }
      cur = (cur as Record<string, unknown>)[p];
    }
    if (typeof cur !== "string")
      throw new Error(`i18n key is not a string leaf: ${key}`);
    if (!params) return cur;
    let out = cur;
    for (const [k, v] of Object.entries(params)) {
      out = out.replaceAll(`{{${k}}}`, String(v));
    }
    return out;
  };
}

export interface I18nContextValue {
  locale: Locale;
  dict: Dict;
  t: TranslationFn;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useT(): TranslationFn {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used inside <I18nProvider>");
  return ctx.t;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used inside <I18nProvider>");
  return ctx.locale;
}
