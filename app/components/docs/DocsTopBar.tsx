import type { DocCategoryNode } from "~/lib/docs/types";

export function DocsTopBar({
  categories,
  activeName,
  onSelect,
}: {
  categories: DocCategoryNode[];
  activeName: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="docs-topbar">
      <div className="docs-topbar__inner">
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            className="docs-topbar__link"
            data-active={activeName === c.name ? "true" : "false"}
            onClick={() => onSelect(c.name)}
          >
            {c.title}
          </button>
        ))}
      </div>
    </div>
  );
}
