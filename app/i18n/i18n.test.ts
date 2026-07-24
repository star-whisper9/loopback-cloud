import { describe, it, expect } from "vitest";
import { resolveLocale } from "./resolveLocale";
import { createT } from "./useT";
import zh from "./zh";
import en from "./en";

const base = "http://localhost/";

describe("resolveLocale", () => {
  it("returns URL ?lang= value when present and whitelisted", () => {
    expect(resolveLocale({ url: new URL(base + "?lang=en"), cookie: "zh", acceptLanguages: ["zh"] })).toBe("en");
    expect(resolveLocale({ url: new URL(base + "?lang=zh"), cookie: "en", acceptLanguages: ["en"] })).toBe("zh");
  });

  it("ignores non-whitelisted URL lang", () => {
    expect(resolveLocale({ url: new URL(base + "?lang=fr"), cookie: undefined, acceptLanguages: ["zh-CN"] })).toBe("zh");
  });

  it("falls back to cookie when URL param absent", () => {
    expect(resolveLocale({ url: new URL(base), cookie: "en", acceptLanguages: ["zh"] })).toBe("en");
  });

  it("falls back to best Accept-Language match", () => {
    expect(resolveLocale({ url: new URL(base), cookie: undefined, acceptLanguages: ["en-US", "en", "zh-CN"] })).toBe("en");
    expect(resolveLocale({ url: new URL(base), cookie: undefined, acceptLanguages: ["zh-CN", "zh"] })).toBe("zh");
    expect(resolveLocale({ url: new URL(base), cookie: undefined, acceptLanguages: ["ja-JP"] })).toBe("zh");
  });

  it("defaults to zh when nothing matches", () => {
    expect(resolveLocale({ url: new URL(base), cookie: undefined, acceptLanguages: [] })).toBe("zh");
  });
});

describe("t()", () => {
  it("returns zh value", () => {
    const t = createT(zh);
    expect(t("hero.badge")).toBe(zh.hero.badge);
  });

  it("interpolates {{v}}", () => {
    const t = createT(zh);
    const out = t("hero.bannerFrames.kw1", { v: "0$" });
    expect(out).toContain("0$");
  });

  it("throws on missing key (Fail-Fast)", () => {
    const t = createT(zh);
    expect(() => t("nonexistent.deeply.nested" as any)).toThrow(/i18n missing key/);
  });
});

describe("dict parity", () => {
  it("en satisfies Dict and matches zh keyset", () => {
    const zhSet = new Set(flattenKeys(zh));
    const enKeys = flattenKeys(en);
    for (const k of enKeys) {
      if (!zhSet.has(k)) throw new Error("en has extra key: " + k);
    }
    for (const k of flattenKeys(zh)) {
      if (!new Set(enKeys).has(k)) throw new Error("en missing key: " + k);
    }
  });
});

function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return [prefix].filter(Boolean);
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) out.push(...flattenKeys(v, next));
    else out.push(next);
  }
  return out;
}
