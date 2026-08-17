import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
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
  DocAuthor,
  DocCategoryNode,
  DocEntry,
  DocLocale,
  DocMeta,
  DocTranslator,
  DocTree,
} from "../app/lib/docs/types";
import {
  parseTerminalConfig,
  parseTerminalTranscript,
  type TerminalLine,
} from "../app/lib/docs/terminal";
import { normalizeDatetime } from "./normalizeDatetime";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC_DIR = join(ROOT, "docs");
const OUT_DIR = join(ROOT, "app/docs/.generated");
const LOCALES: DocLocale[] = ["zh", "en"];

const DEFAULT_CALLOUT_TITLE: Record<string, { zh: string; en: string }> = {
  note: { zh: "注释", en: "Note" },
  warning: { zh: "警告", en: "Warning" },
  tip: { zh: "提示", en: "Tip" },
  important: { zh: "重要", en: "Important" },
};

const TERMINAL_LABELS: Record<DocLocale, {
  demo: string;
  play: string;
  pause: string;
  replay: string;
  showAll: string;
  copy: string;
}> = {
  zh: {
    demo: "终端演示",
    play: "播放",
    pause: "暂停",
    replay: "重播",
    showAll: "显示全部",
    copy: "复制命令",
  },
  en: {
    demo: "Terminal demo",
    play: "Play",
    pause: "Pause",
    replay: "Replay",
    showAll: "Show all",
    copy: "Copy commands",
  },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineToMd(children: any[]): string {
  return children
    .map((c: any) => {
      if (c.type === "text") return c.value;
      if (c.type === "inlineCode") return "`" + c.value + "`";
      if (c.type === "strong") return "**" + inlineToMd(c.children || []) + "**";
      if (c.type === "emphasis") return "*" + inlineToMd(c.children || []) + "*";
      if (c.type === "delete") return "~~" + inlineToMd(c.children || []) + "~~";
      if (c.type === "link") return "[" + inlineToMd(c.children || []) + "](" + (c.url || "") + ")";
      if (c.type === "image") return "![" + (c.alt || "") + "](" + (c.url || "") + ")";
      if (c.type === "html") return c.value;
      if (c.type === "break") return "\n";
      throw new Error("TODO: unsupported inline node type in directive: " + c.type);
    })
    .join("");
}

function blockToMd(children: any[]): string {
  return children
    .map((c: any) => {
      if (c.type === "code") {
        const lang = c.lang || "";
        return "```" + lang + "\n" + c.value + "\n```";
      }
      if (c.type === "paragraph") return inlineToMd(c.children || []);
      if (c.type === "blockquote") return "> " + blockToMd(c.children || []).replace(/\n/g, "\n> ");
      if (c.type === "list") {
        return (c.children || [])
          .map((item: any) => {
            const prefix = c.ordered ? "1. " : "- ";
            const body = (item.children || [])
              .map((child: any) => {
                if (child.type === "paragraph") return inlineToMd(child.children || []);
                return blockToMd([child]);
              })
              .join("\n");
            return prefix + body;
          })
          .join("\n");
      }
      if (c.type === "html") return c.value;
      if (c.type === "heading") {
        const level = c.depth || 1;
        return "#".repeat(level) + " " + inlineToMd(c.children || []);
      }
      if (c.type === "thematicBreak") return "---";
      throw new Error("TODO: unsupported block node type in directive: " + c.type);
    })
    .join("\n\n");
}

function renderTerminalLine(line: TerminalLine): string {
  if (line.kind === "command") {
    return `<span class="docs-terminal__line docs-terminal__line--command" data-terminal-line data-terminal-kind="command"><span class="docs-terminal__prompt">${escapeHtml(line.prompt)}</span><span class="docs-terminal__command" data-terminal-command>${escapeHtml(line.text)}</span></span>`;
  }

  return `<span class="docs-terminal__line docs-terminal__line--output" data-terminal-line data-terminal-kind="output"><span data-terminal-output>${escapeHtml(line.text)}</span></span>`;
}

function renderTerminalBlock(
  locale: DocLocale,
  value: string,
  meta: string | null | undefined,
): string {
  const labels = TERMINAL_LABELS[locale];
  const config = parseTerminalConfig(meta, labels.demo);
  const lines = parseTerminalTranscript(value);
  const linesHtml = lines.map(renderTerminalLine).join("");

  return `<figure class="docs-terminal" data-docs-terminal data-terminal-locale="${locale}" data-terminal-autoplay="${config.autoplay}" data-terminal-speed="${config.speed}" data-terminal-loop="${config.loop}" aria-label="${escapeHtml(config.title)}"><figcaption class="docs-terminal__bar"><span class="docs-terminal__lights" aria-hidden="true"><span></span><span></span><span></span></span><span class="docs-terminal__title">${escapeHtml(config.title)}</span><span class="docs-terminal__badge">${escapeHtml(labels.demo)}</span></figcaption><div class="docs-terminal__screen" data-terminal-screen tabindex="0"><div class="docs-terminal__transcript" data-terminal-transcript>${linesHtml}</div><span class="docs-terminal__cursor" data-terminal-cursor aria-hidden="true"></span></div><div class="docs-terminal__controls" data-terminal-controls><button type="button" data-terminal-action="toggle" data-terminal-label="play">${escapeHtml(labels.play)}</button><button type="button" data-terminal-action="replay" data-terminal-label="replay">${escapeHtml(labels.replay)}</button><button type="button" data-terminal-action="show-all" data-terminal-label="showAll">${escapeHtml(labels.showAll)}</button><button type="button" data-terminal-action="copy" data-terminal-label="copy">${escapeHtml(labels.copy)}</button></div></figure>`;
}

async function renderMarkdown(
  locale: DocLocale,
  md: string,
): Promise<{ html: string; anchors: DocAnchor[] }> {
  let tabsUid = 0;

  async function nodeContentToHtml(children: any[]): Promise<string> {
    if (children.length === 0) return "";
    const mdString = blockToMd(children);
    if (mdString.trim() === "") return "";
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeShiki, { theme: "github-dark" })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(mdString);
    return String(result);
  }

  async function renderDirective(node: any): Promise<string> {
    const name = node.name as string;

    if (name === "details") {
      const labelChild = (node.children || []).find((c: any) => c.data?.directiveLabel);
      const summaryText = labelChild
        ? (labelChild.children || []).map((t: any) => t.value || "").join("")
        : "";
      const contentChildren = (node.children || []).filter((c: any) => !c.data?.directiveLabel);
      const inner = await nodeContentToHtml(contentChildren);
      return `<details class="docs-details"><summary>${escapeHtml(summaryText)}</summary>${inner}</details>`;
    }

    if (name === "code-tabs") {
      const tabs = (node.children || []).filter(
        (c: any) => c.type === "containerDirective" && c.name === "tab",
      ) as any[];
      if (tabs.length > 3) {
        throw new Error("TODO: docs-tabs supports at most 3 tabs");
      }
      tabsUid += 1;
      const uid = tabsUid;
      const labelsHtml = tabs
        .map(
          (t: any, i: number) =>
            `<label><input type="radio" name="docs-tabs-${uid}" data-index="${i}"${i === 0 ? " checked" : ""}><span>${escapeHtml((t.attributes?.label as string) || "")}</span></label>`,
        )
        .join("");
      const panelsHtml = (
        await Promise.all(
          tabs.map(
            async (t: any, i: number) =>
              `<div class="docs-tabs__panel" data-index="${i}"${i === 0 ? ' data-active=""' : ""}>${await nodeContentToHtml(t.children || [])}</div>`,
          ),
        )
      ).join("");
      return `<div class="docs-tabs" data-docs-tabs><div class="docs-tabs__labels">${labelsHtml}</div><div class="docs-tabs__panels">${panelsHtml}</div></div>`;
    }

    if (["note", "warning", "tip", "important"].includes(name)) {
      const labelChild = (node.children || []).find((c: any) => c.data?.directiveLabel);
      const title = labelChild
        ? (labelChild.children || []).map((t: any) => t.value || "").join("")
        : DEFAULT_CALLOUT_TITLE[name][locale];
      const contentChildren = (node.children || []).filter((c: any) => !c.data?.directiveLabel);
      const inner = await nodeContentToHtml(contentChildren);
      return `<div class="docs-callout docs-callout--${escapeHtml(name)}"><p class="docs-callout__title">${escapeHtml(title)}</p>${inner}</div>`;
    }

    return "";
  }

  const KNOWN_DIRECTIVES = new Set(["details", "code-tabs", "tab", "note", "warning", "tip", "important"]);

  async function processDirectives(parent: any): Promise<void> {
    const children = parent.children;
    if (!children) return;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === "code" && child.lang === "terminal") {
        children[i] = {
          type: "html",
          value: renderTerminalBlock(locale, child.value, child.meta),
        };
        continue;
      }
      if (child.type === "containerDirective") {
        if (!KNOWN_DIRECTIVES.has(child.name)) continue;
        if (child.name === "tab") continue;
        await processDirectives(child);
        const html = await renderDirective(child);
        children[i] = { type: "html", value: html };
        continue;
      }
      if (child.children) {
        await processDirectives(child);
      }
    }
  }

  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .parse(md);

  await processDirectives(tree);

  const hast = await unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeShiki, { theme: "github-dark" })
    .run(tree);

  const html = unified()
    .use(rehypeStringify, { allowDangerousHtml: true })
    .stringify(hast as any);

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

/**
 * Coerces a frontmatter datetime value to an ISO 8601 UTC string.
 *
 * gray-matter (js-yaml, YAML 1.1) implicitly resolves unquoted timestamps
 * such as `2026-07-29 13:16:13 +8` or `2026-07-29` to `Date` objects, while
 * values YAML cannot recognize (e.g. `2026-07-29 13:16` without seconds, or
 * quoted strings) arrive as strings — both paths must be supported.
 */
function toIsoDatetime(value: unknown, field: string, relPath: string): string {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error(`docs frontmatter ${field} is an invalid date: ${relPath}`);
    }
    return value.toISOString();
  }
  if (typeof value === "string") return normalizeDatetime(value);
  throw new Error(
    `docs frontmatter ${field} must be a datetime (got ${typeof value}): ${relPath}`,
  );
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
  if (fm.created !== undefined)
    meta.created = toIsoDatetime(fm.created, "created", relPath);
  if (fm.updated !== undefined)
    meta.updated = toIsoDatetime(fm.updated, "updated", relPath);

  if (fm.author !== undefined) {
    if (!Array.isArray(fm.author)) {
      throw new Error(`docs frontmatter author must be an array: ${relPath}`);
    }
    const authors: DocAuthor[] = [];
    for (let i = 0; i < fm.author.length; i++) {
      const item = fm.author[i] as Record<string, unknown>;
      if (typeof item.name !== "string" || item.name.length === 0) {
        throw new Error(
          `docs frontmatter author[${i}].name required: ${relPath}`,
        );
      }
      const author: DocAuthor = { name: item.name };
      if (typeof item.email === "string") author.email = item.email;
      if (typeof item.url === "string") author.url = item.url;
      authors.push(author);
    }
    meta.author = authors;
  }

  if (fm.translator !== undefined) {
    const tr = fm.translator as Record<string, unknown>;
    const validTypes = ["machine", "llm", "human", "mix"];
    if (
      typeof tr.type !== "string" ||
      !validTypes.includes(tr.type)
    ) {
      throw new Error(
        `docs frontmatter translator.type must be one of ${validTypes.join(", ")}: ${relPath}`,
      );
    }
    const translator: DocTranslator = {
      type: tr.type as DocTranslator["type"],
    };
    if (typeof tr.model === "string") translator.model = tr.model;
    if (Array.isArray(tr.human)) {
      translator.human = tr.human.filter(
        (h): h is string => typeof h === "string",
      );
    }
    meta.translator = translator;
  }

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

async function buildEntry(
  locale: DocLocale,
  localeRootAbs: string,
  fileAbs: string,
): Promise<DocEntry> {
  const relPath = relative(localeRootAbs, fileAbs).split(sep).join("/");
  const raw = readFileSync(fileAbs, "utf8");
  const { meta, body } = parseFrontmatter(raw, relPath);
  const { html, anchors } = await renderMarkdown(locale, body);
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
  locale: DocLocale,
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
      const e = await buildEntry(locale, localeRootAbs, abs);
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
    children.push(await buildNode(locale, localeRootAbs, abs, seenPaths));
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
  const root = await buildNode(locale, localeRootAbs, localeRootAbs, seenPaths);

  const indexFile = join(localeRootAbs, "index.md");
  let indexDoc: DocEntry | undefined;
  try {
    indexDoc = await buildEntry(locale, localeRootAbs, indexFile);
  } catch {
    if (locale === "zh") throw new Error("docs: zh/index.md required");
  }

  return { root, ...(indexDoc ? { indexDoc } : {}) };
}

function mergeZhTree(target: DocTree, source: DocTree): void {
  const targetDocs = new Set<string>();
  const collectPaths = (node: DocCategoryNode): void => {
    for (const d of node.docs) targetDocs.add(d.path);
    for (const c of node.children) collectPaths(c);
  };
  collectPaths(target.root);

  const mergeNode = (
    targetNode: DocCategoryNode,
    sourceNode: DocCategoryNode,
  ): void => {
    for (const sourceChild of sourceNode.children) {
      const existing = targetNode.children.find(
        (c) => c.name === sourceChild.name,
      );
      if (existing) {
        mergeNode(existing, sourceChild);
      } else {
        targetNode.children.push({ ...sourceChild });
      }
    }

    for (const sourceDoc of sourceNode.docs) {
      if (!targetDocs.has(sourceDoc.path)) {
        targetNode.docs.push(sourceDoc);
      }
    }

    targetNode.children.sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
    );
    targetNode.docs.sort(
      (a, b) =>
        (a.meta.order ?? 0) - (b.meta.order ?? 0) ||
        a.path.localeCompare(b.path),
    );
  };

  mergeNode(target.root, source.root);
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

  for (const loc of LOCALES) {
    if (loc === "zh") continue;
    mergeZhTree(trees[loc], trees.zh);
  }

  const allDocPaths = Object.keys(docsByLocale.zh).sort();
  emit(trees, docsByLocale, allDocPaths);

  console.log(
    `[build-docs] wrote ${allDocPaths.length} docs zh + ${Object.keys(docsByLocale.en).length} en → app/docs/.generated/docs.ts`,
  );
}

main();
