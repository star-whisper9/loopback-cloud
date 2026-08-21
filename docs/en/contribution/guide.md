---
title: Documentation Contribution Guide
description: Contribution rules, full Frontmatter reference, and Markdown extension syntax
order: 1
created: 2026-07-29
author:
  - name: 星语
    email: star@sotis.space
    url: https://github.com/star-whisper9
translator:
  type: llm
  model: qwen3.8-max-preview
---

Loopback Cloud Docs is a **community-driven** home-lab knowledge base. This page is the complete reference for contributors, covering three parts: contribution rules, the full Frontmatter reference, and all supported Markdown and extension syntax.

Please read this page before writing — the docs build pipeline has strict constraints on Frontmatter and syntax. Content that violates them will either fail the build or be silently ignored.

## Contribution Rules

### Scope

We accept **real, reproducible** home-lab content, such as:

- OS installation and configuration (Windows / Linux / BSD)
- Virtualization (PVE, ESXi, Hyper-V, etc.)
- Network planning, tunneling, and firewalls
- Storage and backups
- Hardware selection, troubleshooting, and maintenance

Not welcome: unverified reposts, promotion unrelated to home labs, large blocks of unlabeled AI-generated content.

### Directories and Files

- One category = one subdirectory under the locale root, containing a `_category.md` that declares its title and order
- Article file names use kebab-case, e.g. `getting-started.md`
- **Do not name an article `index.md`** — an `index.md` inside a subdirectory is ignored by the build
- To hide an article from the sidebar navigation, set `navIgnore: true` (the page remains reachable by URL)

### Writing Conventions

- The page title comes from the `title` frontmatter field; body content starts at level-2 headings (`##`). **Never write a level-1 heading**
- Level-2 / level-3 headings automatically generate anchors and appear in the on-page outline — keep them short and suitable as outline entries
- Code blocks must specify a language, or they get no syntax highlighting
- Operations that can damage software or hardware (formatting disks, flashing firmware, changing network configuration, etc.) must be accompanied by a `:::warning` callout
- Images must carry meaningful alt text: `![alt text](url)`

### Translation Conventions

- The English version (`docs/en/`) is optional; when missing, English readers see the Chinese version with a fallback notice
- The English tree mirrors the Chinese one; the build falls back entry by entry
- Translations must fill in the `translator` field honestly: machine / LLM / human / mix

### Review and Disclaimer

- Contributions receive only a light review; we do not guarantee correctness or freshness
- Loopback Cloud is not responsible for damage readers incur by following the docs — this applies to contributors themselves as well

## Frontmatter Reference

Complete example:

```yaml
---
title: Getting Started           # required, page title
description: Up and running in 5 minutes  # optional, subtitle under the title
order: 1                         # optional, sidebar order, lower first, default 0
created: 2026-07-29 13:16:13 +8  # optional, creation time
author:                          # optional, author list
  - name: 星语                   #   required, truncated beyond 24 chars
    email: star@sotis.space      #   optional, rendered as a mail icon
    url: https://github.com/star-whisper9  # optional, name rendered as a link
translator:                      # optional, translation info, usually on en pages
  type: mix                      #   required, machine | llm | human | mix
  model: step-3.7-flash          #   optional, recommended for llm / mix
  human:                         #   optional, recommended for human / mix
    - 星语
navIgnore: false                 # optional, hide from sidebar when true
---
```

### Field Overview

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | yes | Page title, rendered as h1 |
| `description` | string | no | Subtitle shown under the title |
| `order` | number | no | Sidebar order, lower first, default 0; ties sorted by path |
| `created` | datetime | no | Creation time, see formats below |
| `updated` | datetime | no | Generated from the latest Git commit during the build; no need to write it manually |
| `author` | array | no | Author list, see below |
| `translator` | object | no | Translation info, renders a translator banner |
| `navIgnore` | boolean | no | Hidden from the sidebar when `true` |

### Datetime Formats

`created` accepts the following forms and is normalized to ISO 8601 (UTC) at build time. `updated` is generated from the latest Git commit for this document; when Git history is unavailable during local development, an explicitly supplied value is kept as a fallback.

| Form | Example |
| --- | --- |
| ISO 8601 | `2026-07-29T13:16:13Z`, `2026-07-29T13:16:13+08:00` |
| Datetime + timezone | `2026-07-29 13:16:13 +8` |
| Datetime, no timezone | `2026-07-29 13:16:13` (treated as UTC) |
| Minutes / seconds omitted | `2026-07-29 13:16`, `2026-07-29 13` |
| Date only | `2026-07-29` (treated as UTC midnight) |

Timezones may be written as `+8`, `+08`, `+0800`, `+08:00`, or `Z`; times are rendered in the visitor's local timezone.

:::tip[Recommendation]
Write the timezone explicitly (e.g. `+8`). Unquoted YAML datetime values are parsed as YAML 1.1 timestamps, and values without a timezone are treated as UTC rather than local time — annotate the timezone explicitly if you mean local time.
:::

### Authors and Translators

Author display rules:

- `name` is required and is truncated beyond 24 characters
- When `url` is present the name renders as an external link; when `email` is present a mail icon is shown

The translator `type` determines the banner text at the top of the page:

| type | Meaning | Recommended extras |
| --- | --- | --- |
| `machine` | Machine translation | — |
| `llm` | AI model translation | `model` |
| `human` | Human translation | `human` list |
| `mix` | AI translation + human review | `model` and `human` list |

## Markdown and Extension Syntax

### Basics (CommonMark + GFM)

Standard Markdown plus GitHub Flavored Markdown extensions are supported:

- Text styles: **bold**, *italic*, ~~strikethrough~~, `inline code`
- Links and images: `[text](url)`, `![alt text](url)`
- Ordered / unordered lists, blockquotes, horizontal rules
- Tables (GFM) and task lists (GFM)

Task list example:

- [x] Install the OS
- [ ] Configure the network

:::note
Inline HTML passes through and renders as-is — use it with care, as it bypasses the pipeline's styling and escaping.
:::

### Code Blocks

Fenced code blocks are highlighted by Shiki with the `github-dark` theme and **must specify a language**:

```bash
ssh root@127.0.0.1
```

### Terminal Replay Blocks

Use the `terminal` language to show a dynamic terminal transcript with prompts and command output. It only replays content written in the document; it never executes commands in the browser:

```terminal title="Inspect Docker services" speed="normal"
$ docker compose up -d
[+] Running 3/3
 ✔ Network app_default  Created
 ✔ Container database  Started
 ✔ Container web        Started

$ docker ps
CONTAINER ID   IMAGE     STATUS
a1b2c3         nginx     Up 2 minutes
```

The terminal block supports these optional attributes:

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `title` | Any text | `Terminal demo` | Name shown in the title bar |
| `autoplay` | `visible` / `load` / `manual` | `visible` | Playback trigger; `visible` starts when scrolled into view |
| `speed` | `fast` / `normal` / `slow` | `normal` | Command typing and output playback speed |
| `loop` | `true` / `false` | `false` | Whether to replay after completion |

Authoring rules:

- Lines starting with `$`, `#`, `%`, `>`, or a common shell prompt are treated as commands
- Consecutive lines after a command are treated as output, and blank lines are preserved
- The copy button copies commands only, without prompts or output
- The player provides play / pause, replay, show all, and copy commands controls
- When the user prefers reduced motion, the terminal immediately shows the complete transcript
- Use `autoplay="manual"` for long demos so they do not interrupt reading

### Heading Anchors and Outline

- Level-2 and level-3 headings automatically get `id` anchors and appear in the on-page outline
- Non-ASCII (e.g. Chinese) headings are supported; duplicate heading texts get numeric suffixes

### Callouts

Four types, with default titles that follow the UI language; customize with `[Title]`:

| Directive | Default title | Use for |
| --- | --- | --- |
| `:::note` | Note | Supplementary information |
| `:::warning` | Warning | Operations that can cause damage |
| `:::tip` | Tip | Optional tricks |
| `:::important` | Important | Must-know information |

Syntax and rendered result:

```md
:::warning[Dangerous operation]
This command wipes the disk — double-check before running.
:::
```

:::warning[Dangerous operation]
This command wipes the disk — double-check before running.
:::

### Details (Collapsible Blocks)

```md
:::details[Click to expand the config example]
Collapsed content; any Markdown is allowed.
:::
```

:::details[Click to expand the config example]
Collapsed content; any Markdown is allowed.
:::

### Code Tabs

Four colons on the outside, three on the inside; `label` is the tab title, and **at most 3 tabs** are allowed:

````md
::::code-tabs

:::tab{label="pnpm"}
```bash
pnpm add loopback-cloud
```
:::

:::tab{label="npm"}
```bash
npm i loopback-cloud
```
:::

::::
````

Rendered result:

::::code-tabs

:::tab{label="pnpm"}
```bash
pnpm add loopback-cloud
```
:::

:::tab{label="npm"}
```bash
npm i loopback-cloud
```
:::

::::

### Nesting and Limits

- Callouts and details may contain normal Markdown and other directives (e.g. a callout inside details)
- Code tabs may only contain `:::tab`; tabs cannot nest further directive containers
- Unrecognized directive names render without special styling and do not fail the build — stick to the directives listed on this page
