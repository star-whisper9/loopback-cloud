import type { DocCategoryNode, DocEntry } from "~/lib/docs/types";

export function findFirstDoc(node: DocCategoryNode): DocEntry | null {
  const [firstDoc] = node.docs;
  if (firstDoc) return firstDoc;

  for (const child of node.children) {
    const firstChildDoc = findFirstDoc(child);
    if (firstChildDoc) return firstChildDoc;
  }

  return null;
}
