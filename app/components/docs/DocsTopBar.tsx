import { Link } from "react-router";
import type { DocCategoryNode } from "~/lib/docs/types";

export function DocsTopBar({
  categories,
  activeName,
  homeTitle,
  isHome,
  onHome,
  onSelect,
}: {
  categories: DocCategoryNode[];
  activeName: string | null;
  homeTitle: string;
  isHome: boolean;
  onHome: () => void;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="docs-topbar">
      <div className="docs-topbar__inner">
        <Link
          to="/docs"
          className="docs-topbar__link"
          data-active={isHome ? "true" : "false"}
          aria-current={isHome ? "page" : undefined}
          onClick={onHome}
        >
          {homeTitle}
        </Link>
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            className="docs-topbar__link"
            data-active={!isHome && activeName === c.name ? "true" : "false"}
            onClick={() => onSelect(c.name)}
          >
            {c.title}
          </button>
        ))}
      </div>
    </div>
  );
}
