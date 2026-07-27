import { describe, expect, it } from "vitest";
import { trees, docsByLocale, allDocPaths } from "../app/docs/.generated/docs";

describe("build-docs generated output", () => {
  it("zh tree has indexDoc", () => {
    expect(trees.zh.indexDoc).toBeTruthy();
    expect(trees.zh.indexDoc!.meta.title).toBe("文档首页");
  });

  it("en tree has indexDoc", () => {
    expect(trees.en.indexDoc).toBeTruthy();
    expect(trees.en.indexDoc!.meta.title).toBe("Docs Home");
  });

  it("zh getting-started anchors contain 安装 + 配置", () => {
    const d = docsByLocale.zh["software/getting-started"];
    expect(d).toBeTruthy();
    const texts = d.anchors.map((a) => a.text);
    expect(texts).toContain("安装");
    expect(texts).toContain("配置");
  });

  it("html contains callout class", () => {
    const d = docsByLocale.zh["software/getting-started"];
    expect(d.html).toContain('class="docs-callout docs-callout--warning"');
  });

  it("html contains docs-tabs structure", () => {
    const d = docsByLocale.zh["software/getting-started"];
    expect(d.html).toContain('class="docs-tabs"');
    expect(d.html).toContain('name="docs-tabs-');
  });

  it("zh-only doc absent in en, present in zh", () => {
    expect(docsByLocale.en["software/zh-only"]).toBeUndefined();
    expect(docsByLocale.zh["software/zh-only"]).toBeTruthy();
  });

  it("allDocPaths includes software/getting-started and index", () => {
    expect(allDocPaths).toContain("software/getting-started");
    expect(allDocPaths).toContain("");
  });
});
