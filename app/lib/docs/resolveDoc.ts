import { docsByLocale, trees } from "~/docs/.generated/docs";
import type { DocEntry, DocLocale } from "~/lib/docs/types";

export interface ResolvedDoc {
  doc: DocEntry;
  fallback: boolean;
  isIndex: boolean;
}

export function resolveDoc(locale: DocLocale, path: string): ResolvedDoc {
  if (path === "") {
    const idx = trees[locale].indexDoc ?? trees.zh.indexDoc;
    if (!idx) throw new Error("TODO: docs indexDoc missing for both locales");
    return { doc: idx, fallback: locale !== "zh" && !trees[locale].indexDoc, isIndex: true };
  }
  const primary = docsByLocale[locale][path];
  if (primary) return { doc: primary, fallback: false, isIndex: false };
  const fallbackDoc = docsByLocale.zh[path];
  if (!fallbackDoc) {
    throw new Response("Not Found", { status: 404, statusText: "docs missing: " + path });
  }
  return { doc: fallbackDoc, fallback: locale !== "zh", isIndex: false };
}
