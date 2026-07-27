import type { DocCategoryNode } from "~/lib/docs/types";
import { SidebarNode } from "./SidebarNode";

export function DocsSidebar({
  node,
  currentPath,
}: {
  node: DocCategoryNode;
  currentPath: string;
}) {
  return (
    <aside className="docs-sidebar">
      <SidebarNode node={node} currentPath={currentPath} autoOpen />
    </aside>
  );
}
