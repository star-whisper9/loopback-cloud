import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import matter from "gray-matter";
import { globSync } from "tinyglobby";
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  DocAnchor,
  DocCategoryNode,
  DocEntry,
  DocLocale,
  DocMeta,
  DocTree,
} from "../app/lib/docs/types";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC_DIR = join(ROOT, "docs");
const OUT_DIR = join(ROOT, "app/docs/.generated");
const LOCALES: DocLocale[] = ["zh", "en"];

async function renderMarkdown(md: string): Promise<{ html: string; anchors: DocAnchor[] }> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeShiki, { theme: "github-dark" })
    .use(rehypeStringify)
    .process(md);
  const html = String(file);

  const anchors: DocAnchor[] = [];
  const re = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const level = m[1] === "2" ? 2 : 3;
    const text = m[3].replace(/<[^>]+>/g, "").trim();
    anchors.push({ id: m[2], text, level });
  }

  return { html, anchors };
}

function parseFrontmatter(raw: string, relPath: string): { meta: DocMeta; body: string } {
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  const title = fm.title;
  if (typeof title !== "string" || title.length === 0) {
    throw new Error(`docs frontmatter missing title: ${relPath}`);
  }
  const meta: DocMeta = { title };
  if (typeof fm.description === "string") meta.description = fm.description;
  if (typeof fm.order === "number") meta.order = fm.order;
  const isIndex = relPath.endsWith("index.md");
  meta.navIgnore = typeof fm.navIgnore === "boolean" ? fm.navIgnore : isIndex;
  return { meta, body: parsed.content };
}

function entryPath(localeRootAbs: string, fileAbs: string): string {
  const rel = relative(localeRootAbs, fileAbs).split(sep).join("/");
  if (!rel.endsWith(".md")) {
    throw new Error(`TODO: non-md file in docs tree: ${rel}`);
  }
  const noExt = rel.slice(0, -3);
  if (noExt === "index") return "";
  if (noExt.endsWith("/index")) return noExt.slice(0, -"/index".length);
  return noExt;
}

async function buildEntry(localeRootAbs: string, fileAbs: string): Promise<DocEntry> {
  const relPath = relative(localeRootAbs, fileAbs).split(sep).join("/");
  const raw = readFileSync(fileAbs, "utf8");
  const { meta, body } = parseFrontmatter(raw, relPath);
  const { html, anchors } = await renderMarkdown(body);
  return { path: entryPath(localeRootAbs, fileAbs), meta, html, anchors };
}

function readCategoryMeta(dirAbs: string): { title: string; order?: number } {
  const file = join(dirAbs, "_category.md");
  try {
    const raw = readFileSync(file, "utf8");
    const parsed = matter(raw);
    const title =
      typeof parsed.data.title === "string"
        ? parsed.data.title
        : (dirAbs.split(sep).pop() as string);
    const order =
      typeof parsed.data.order === "number" ? parsed.data.order : undefined;
    return { title, order };
  } catch {
    return { title: dirAbs.split(sep).pop() as string };
  }
}

async function buildNode(
  localeRootAbs: string,
  dirAbs: string,
  seenPaths: Set<string>,
): Promise<DocCategoryNode> {
  const name =
    dirAbs === localeRootAbs ? "root" : (dirAbs.split(sep).pop() as string);
  const cat = readCategoryMeta(dirAbs);
  const children: DocCategoryNode[] = [];
  const docs: DocEntry[] = [];

  const entries = globSync(["*"], {
    cwd: dirAbs,
    onlyFiles: false,
  }).sort();

  for (let ent of entries) {
    if (ent.endsWith(sep)) ent = ent.slice(0, -1);
    const abs = join(dirAbs, ent);
    if (ent === "_category.md") continue;
    if (ent === "index.md") continue;
    if (ent.endsWith(".md")) {
      const e = await buildEntry(localeRootAbs, abs);
      if (seenPaths.has(e.path)) {
        throw new Error(`docs path conflict: ${e.path || "<root>"}`);
      }
      seenPaths.add(e.path);
      if (!e.meta.navIgnore) docs.push(e);
      continue;
    }

    const st = statSync(abs);
    if (!st.isDirectory()) {
      throw new Error(`docs: unexpected non-md, non-directory entry: ${ent}`);
    }
    children.push(await buildNode(localeRootAbs, abs, seenPaths));
  }

  docs.sort(
    (a, b) =>
      (a.meta.order ?? 0) - (b.meta.order ?? 0) ||
      a.path.localeCompare(b.path),
  );
  children.sort(
    (a, b) =>
      (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
  );

  return {
    name,
    title: dirAbs === localeRootAbs ? "root" : cat.title,
    ...(cat.order !== undefined ? { order: cat.order } : {}),
    children,
    docs,
  };
}

async function buildTree(locale: DocLocale): Promise<DocTree> {
  const localeRootAbs = join(SRC_DIR, locale);
  const seenPaths = new Set<string>();
  const root = await buildNode(localeRootAbs, localeRootAbs, seenPaths);

  const indexFile = join(localeRootAbs, "index.md");
  let indexDoc: DocEntry | undefined;
  try {
    indexDoc = await buildEntry(localeRootAbs, indexFile);
  } catch {
    if (locale === "zh") throw new Error("docs: zh/index.md required");
  }

  return { root, ...(indexDoc ? { indexDoc } : {}) };
}

function emit(
  trees: Record<DocLocale, DocTree>,
  docsByLocale: Record<DocLocale, Record<string, DocEntry>>,
  allDocPaths: string[],
): void {
  mkdirSync(OUT_DIR, { recursive: true });

  const out = `/* eslint-disable */
/* AUTO-GENERATED by scripts/build-docs.ts — do NOT edit by hand. */
import type {
  DocAnchor,
  DocCategoryNode,
  DocEntry,
  DocLocale,
  DocMeta,
  DocTree,
} from "~/lib/docs/types";

export type {
  DocAnchor,
  DocCategoryNode,
  DocEntry,
  DocLocale,
  DocMeta,
  DocTree,
};

export const trees: Record<DocLocale, DocTree> = ${JSON.stringify(trees, null, 2)};

export const docsByLocale: Record<DocLocale, Record<string, DocEntry>> = ${JSON.stringify(docsByLocale, null, 2)};

export const allDocPaths: string[] = ${JSON.stringify(allDocPaths, null, 2)};
`;

  writeFileSync(join(OUT_DIR, "docs.ts"), out, "utf8");
}

async function main(): Promise<void> {
  const trees: Record<DocLocale, DocTree> = {
    zh: undefined as any,
    en: undefined as any,
  };
  const docsByLocale: Record<DocLocale, Record<string, DocEntry>> = {
    zh: {},
    en: {},
  };

  for (const loc of LOCALES) {
    const tree = await buildTree(loc);
    trees[loc] = tree;

    const walk = (node: DocCategoryNode): void => {
      for (const d of node.docs) docsByLocale[loc][d.path] = d;
      for (const c of node.children) walk(c);
    };
    walk(tree.root);
    if (tree.indexDoc) docsByLocale[loc][tree.indexDoc.path] = tree.indexDoc;
  }

  const allDocPaths = Object.keys(docsByLocale.zh).sort();
  emit(trees, docsByLocale, allDocPaths);

  console.log(
    `[build-docs] wrote ${allDocPaths.length} docs zh + ${Object.keys(docsByLocale.en).length} en → app/docs/.generated/docs.ts`,
  );
}

main();
