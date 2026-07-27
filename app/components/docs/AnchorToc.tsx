import { useEffect, useRef, useState } from "react";
import type { DocAnchor } from "~/lib/docs/types";

export function AnchorToc({ anchors }: { anchors: DocAnchor[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchors.length === 0) return;
    const els = anchors
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [anchors]);

  if (anchors.length === 0) return null;

  return (
    <div ref={rootRef} className="docs-anchor-toc">
      <nav>
        {anchors.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className={a.level === 3 ? "docs-anchor-toc__h3" : undefined}
            data-active={activeId === a.id ? "true" : "false"}
          >
            {a.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
