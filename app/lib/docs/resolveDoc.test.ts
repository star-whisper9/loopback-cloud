import { describe, expect, it } from "vitest";
import { resolveDoc } from "./resolveDoc";

describe("resolveDoc", () => {
  it("returns zh index doc when path empty", () => {
    const r = resolveDoc("zh", "");
    expect(r.isIndex).toBe(true);
    expect(r.doc.meta.title).toBe("文档首页");
  });

  it("falls back to zh when en missing", () => {
    const r = resolveDoc("en", "software/zh-only");
    expect(r.doc.meta.title).toMatch(/仅中文|ZH only/);
    expect(r.fallback).toBe(true);
  });

  it("returns en doc when present", () => {
    const r = resolveDoc("en", "software/getting-started");
    expect(r.doc.meta.title).toBe("Quick Start");
    expect(r.fallback).toBe(false);
  });

  it("throws 404 when both missing", () => {
    expect(() => resolveDoc("zh", "nope/nope")).toThrow();
  });
});
