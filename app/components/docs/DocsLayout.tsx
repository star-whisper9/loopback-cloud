import { useMemo, useState } from "react";
import { Navbar } from "~/components/Navbar/Navbar";
import { Footer } from "~/components/Footer/Footer";
import { trees } from "~/docs/.generated/docs";
import type { DocCategoryNode, DocEntry, DocLocale } from "~/lib/docs/types";
import { DocsTopBar } from "./DocsTopBar";
import { DocsSidebar } from "./DocsSidebar";
import { DocsContent } from "./DocsContent";
import { AnchorToc } from "./AnchorToc";
import { FallbackBanner } from "./FallbackBanner";

function findTopCategory(root: DocCategoryNode, path: string): DocCategoryNode | null {
  for (const c of root.children) {
    if (path === "") return c;
    if (path.startsWith(c.name + "/") || contains(c, path)) return c;
  }
  return root.children[0] ?? null;
}

function contains(node: DocCategoryNode, path: string): boolean {
  if (node.docs.some((d) => d.path === path)) return true;
  return node.children.some((c) => contains(c, path));
}

export function DocsLayout({
  locale,
  doc,
  fallback,
}: {
  locale: DocLocale;
  doc: DocEntry;
  fallback: boolean;
}) {
  const tree = trees[locale];
  const zhTree = trees.zh;
  const useTree = tree.root.children.length > 0 ? tree : zhTree;
  const categories = useTree.root.children;

  const [activeName, setActiveName] = useState<string | null>(() => {
    const top = findTopCategory(useTree.root, doc.path);
    return top?.name ?? categories[0]?.name ?? null;
  });

  const activeCategory = useMemo(
    () => categories.find((c) => c.name === activeName) ?? categories[0] ?? null,
    [categories, activeName],
  );

  return (
    <div className="docs-shell">
      <Navbar />
      <DocsTopBar
        categories={categories}
        activeName={activeName}
        onSelect={setActiveName}
      />
      <div className="docs-grid">
        {activeCategory ? <DocsSidebar node={activeCategory} currentPath={doc.path} /> : null}
        <main>
          {fallback ? <FallbackBanner /> : null}
          <DocsContent doc={doc} />
        </main>
        <AnchorToc anchors={doc.anchors} />
      </div>
      <Footer />
    </div>
  );
}
