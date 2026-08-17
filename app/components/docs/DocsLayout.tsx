import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "~/components/Navbar/Navbar";
import { Footer } from "~/components/Footer/Footer";
import { trees } from "~/docs/.generated/docs";
import type { DocCategoryNode, DocEntry, DocLocale } from "~/lib/docs/types";
import { findFirstDoc } from "~/lib/docs/findFirstDoc";
import { useT } from "~/i18n/useT";
import { DocsTopBar } from "./DocsTopBar";
import { DocsSidebar } from "./DocsSidebar";
import { DocsContent } from "./DocsContent";
import { AnchorToc } from "./AnchorToc";
import { FallbackBanner } from "./FallbackBanner";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";

function findTopCategory(
  root: DocCategoryNode,
  path: string,
): DocCategoryNode | null {
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

function EmptyCategory({ title }: { title: string }) {
  const t = useT();

  return (
    <section className="docs-empty" aria-live="polite">
      <p className="docs-empty__category">{title}</p>
      <h1 className="docs-empty__title">{t("docs.emptyTitle")}</h1>
      <p className="docs-empty__description">
        {t("docs.emptyDescription")}
      </p>
    </section>
  );
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
  const navigate = useNavigate();
  const tree = trees[locale];
  const zhTree = trees.zh;
  const useTree = tree.root.children.length > 0 ? tree : zhTree;
  const categories = useTree.root.children;

  const [activeName, setActiveName] = useState<string | null>(() => {
    const top = findTopCategory(useTree.root, doc.path);
    return top?.name ?? categories[0]?.name ?? null;
  });

  useEffect(() => {
    const top = findTopCategory(useTree.root, doc.path);
    setActiveName(top?.name ?? categories[0]?.name ?? null);
  }, [categories, doc.path, useTree]);

  const activeCategory = useMemo(
    () =>
      categories.find((c) => c.name === activeName) ?? categories[0] ?? null,
    [categories, activeName],
  );
  const firstDoc = activeCategory ? findFirstDoc(activeCategory) : null;
  const showEmptyCategory = activeCategory !== null && firstDoc === null;

  function handleCategorySelect(name: string) {
    const category = categories.find((c) => c.name === name);
    if (!category) throw new Error(`TODO: docs category missing: ${name}`);

    setActiveName(name);
    const firstCategoryDoc = findFirstDoc(category);
    if (!firstCategoryDoc) return;

    navigate(
      firstCategoryDoc.path === ""
        ? "/docs"
        : `/docs/${firstCategoryDoc.path}`,
    );
  }

  return (
    <div className="docs-shell">
      <Navbar />
      <DocsTopBar
        categories={categories}
        activeName={activeName}
        onSelect={handleCategorySelect}
      />
      <div className="docs-grid">
        {activeCategory ? (
          <DocsSidebar node={activeCategory} currentPath={doc.path} />
        ) : null}
        <main>
          {showEmptyCategory && activeCategory ? (
            <EmptyCategory title={activeCategory.title} />
          ) : (
            <>
              {fallback ? <FallbackBanner /> : null}
              <DocsContent doc={doc} />
            </>
          )}
        </main>
        <AnchorToc anchors={showEmptyCategory ? [] : doc.anchors} />
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
