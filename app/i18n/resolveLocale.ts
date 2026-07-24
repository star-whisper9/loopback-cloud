import { DEFAULT_LOCALE, type Locale, isLocale } from "./types";

export interface ResolveLocaleInput {
  url: URL;
  cookie?: string | null;
  acceptLanguages: readonly string[];
}

export function resolveLocale(input: ResolveLocaleInput): Locale {
  const { url, cookie, acceptLanguages } = input;

  const urlLang = url.searchParams.get("lang");
  if (urlLang && isLocale(urlLang)) return urlLang;

  if (cookie && isLocale(cookie)) return cookie;

  for (const tag of acceptLanguages) {
    const base = tag.split("-")[0];
    if (base === "zh") return "zh";
    if (base === "en") return "en";
  }

  return DEFAULT_LOCALE;
}
