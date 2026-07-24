import { describe, it, expect } from "vitest";
import { resolveLocale } from "./resolveLocale";

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
