export interface DocAuthor {
  name: string;
  email?: string;
  url?: string;
}

export type TranslatorType = "machine" | "llm" | "human" | "mix";

export interface DocTranslator {
  type: TranslatorType;
  model?: string;
  human?: string[];
}

export interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  navIgnore?: boolean;
  created?: string;
  updated?: string;
  author?: DocAuthor[];
  translator?: DocTranslator;
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
