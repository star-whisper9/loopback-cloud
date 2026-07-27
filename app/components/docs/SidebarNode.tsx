import { Link } from "react-router";
import type { DocCategoryNode } from "~/lib/docs/types";

export function SidebarNode({
  node,
  currentPath,
  autoOpen,
}: {
  node: DocCategoryNode;
  currentPath: string;
  autoOpen: boolean;
}) {
  const containsCurrent =
    node.docs.some((d) => d.path === currentPath) ||
    node.children.some((c) => pathContains(c, currentPath));
  return (
    <details className="docs-sidebar__group" open={autoOpen || containsCurrent}>
      <summary>{node.title}</summary>
      {node.docs.length > 0 ? (
        <ul className="docs-sidebar__list">
          {node.docs.map((d) => (
            <li key={d.path}>
              <Link
                to={d.path === "" ? "/docs" : `/docs/${d.path}`}
                className="docs-nav-link"
                aria-current={d.path === currentPath ? "page" : undefined}
              >
                {d.meta.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {node.children.map((c) => (
        <SidebarNode key={c.name} node={c} currentPath={currentPath} autoOpen={autoOpen} />
      ))}
    </details>
  );
}

function pathContains(node: DocCategoryNode, path: string): boolean {
  if (node.docs.some((d) => d.path === path)) return true;
  return node.children.some((c) => pathContains(c, path));
}
