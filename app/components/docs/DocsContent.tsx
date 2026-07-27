import type { DocEntry } from "~/lib/docs/types";

export function DocsContent({ doc }: { doc: DocEntry }) {
  return (
    <article className="docs-prose">
      <h1>{doc.meta.title}</h1>
      {doc.meta.description ? <p className="text-fg-muted">{doc.meta.description}</p> : null}
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
