import { describe, expect, it } from "vitest";
import { normalizeDatetime } from "./normalizeDatetime";

describe("normalizeDatetime", () => {
  it("accepts ISO 8601 with Z", () => {
    expect(normalizeDatetime("2026-07-29T13:16:13Z")).toBe(
      "2026-07-29T13:16:13.000Z",
    );
  });

  it("accepts ISO 8601 with offset and fraction", () => {
    expect(normalizeDatetime("2026-07-29T13:16:13.5+08:00")).toBe(
      "2026-07-29T05:16:13.500Z",
    );
  });

  it("accepts loose format with short offset (+8)", () => {
    expect(normalizeDatetime("2026-07-29 13:16:13 +8")).toBe(
      "2026-07-29T05:16:13.000Z",
    );
  });

  it("accepts loose format without timezone (treated as UTC)", () => {
    expect(normalizeDatetime("2026-07-29 13:16:13")).toBe(
      "2026-07-29T13:16:13.000Z",
    );
  });

  it("accepts time without seconds or minutes", () => {
    expect(normalizeDatetime("2026-07-29 13:16")).toBe(
      "2026-07-29T13:16:00.000Z",
    );
    expect(normalizeDatetime("2026-07-29 13")).toBe("2026-07-29T13:00:00.000Z");
  });

  it("accepts date-only (treated as UTC midnight)", () => {
    expect(normalizeDatetime("2026-07-29")).toBe("2026-07-29T00:00:00.000Z");
  });

  it("accepts offset without colon (+0800)", () => {
    expect(normalizeDatetime("2026-07-29 13:16:13 +0800")).toBe(
      "2026-07-29T05:16:13.000Z",
    );
  });

  it("throws on invalid formats (Fail-Fast)", () => {
    expect(() => normalizeDatetime("29/07/2026")).toThrow(
      /invalid datetime format/,
    );
    expect(() => normalizeDatetime("2026-07-29 25:00:00")).toThrow(
      /invalid datetime/,
    );
    expect(() => normalizeDatetime("not a date")).toThrow(
      /invalid datetime format/,
    );
  });
});
