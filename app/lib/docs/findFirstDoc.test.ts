import { describe, expect, it } from "vitest";
import type { DocCategoryNode, DocEntry } from "./types";
import { findFirstDoc } from "./findFirstDoc";

function doc(path: string): DocEntry {
  return { path, meta: { title: path }, html: "", anchors: [] };
}

function category(
  overrides: Partial<DocCategoryNode> = {},
): DocCategoryNode {
  return {
    name: "category",
    title: "Category",
    children: [],
    docs: [],
    ...overrides,
  };
}

describe("findFirstDoc", () => {
  it("returns the first document in the category", () => {
    const first = doc("first");
    const result = findFirstDoc(category({ docs: [first, doc("second")] }));

    expect(result).toBe(first);
  });

  it("searches child categories when the category has no direct documents", () => {
    const first = doc("nested/first");
    const result = findFirstDoc(
      category({ children: [category({ children: [], docs: [first] })] }),
    );

    expect(result).toBe(first);
  });

  it("returns null for an empty category tree", () => {
    expect(findFirstDoc(category())).toBeNull();
  });
});
