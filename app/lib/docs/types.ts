export interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  navIgnore?: boolean;
}

export interface DocAnchor {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface DocEntry {
  path: string;
  meta: DocMeta;
  html: string;
  anchors: DocAnchor[];
}

export interface DocCategoryNode {
  name: string;
  title: string;
  order?: number;
  children: DocCategoryNode[];
  docs: DocEntry[];
}

export interface DocTree {
  root: DocCategoryNode;
  indexDoc?: DocEntry;
}

export type DocLocale = "zh" | "en";
