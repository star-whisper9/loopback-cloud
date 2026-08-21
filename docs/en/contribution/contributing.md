---
title: Contribution Policy
description: A unified contribution process for code, documentation, translations, and issue reports
order: 0
created: 2026-08-17 18:00 +8
author:
  - name: 星语
    email: star@sotis.space
    url: https://github.com/star-whisper9
translator:
  type: llm
  model: gpt-5.6-luna
---

This is the normative guide for all contributors. Read it before submitting code, documentation, translations, assets, or issue reports. For document Frontmatter and Markdown extensions, also see the [documentation format and syntax reference](guide).

## Project Principles

Loopback Cloud is a community project. We value content that is real, reproducible, and reviewable more than submission volume or word count.

Contributions should follow these principles:

- Have a clear use case and target audience.
- Include the verification environment, versions, prerequisites, and expected results whenever possible.
- Do not hide risks or present unverified guesses as established facts.
- Do not submit secrets, private data, restricted third-party material, or content with an unverifiable source.
- Keep the change scope clear and avoid mixing unrelated refactors into one Pull Request.

## What You Can Contribute

The following contributions are welcome:

- Fixes for pages, routes, static assets, and interactions.
- Improvements to accessibility, mobile layouts, and error messages.
- New or improved real-world home-lab documentation.
- Corrections to commands, versions, links, facts, and translations in the docs.
- Tests, build checks, and developer tooling.
- Reproducible issue reports and improvement proposals.

## What We Do Not Accept

The following content will not be merged, or requires sufficient evidence first:

- Unverified full-text reposts, marketing copy, or promotions unrelated to home labs.
- Passwords, tokens, private keys, cookies, personal information, or internal network topology.
- Large blocks of AI-generated content submitted as final copy without human verification.
- Disk, network, firmware, permission, or data-destructive operations without risk warnings.
- Content intended to bypass security controls, infringe on others' rights, or support illegal activity.
- Large formatting changes or unrelated renames made only for personal style.

## Contribution Workflow

### 1. Confirm Before You Start

Small spelling fixes can go directly into a branch. For new features, directory changes, licensing, build configuration, or substantial documentation, create an Issue describing the goal and proposed approach first to avoid duplicated work.

Before submitting, confirm:

- Whether the same issue or article already exists.
- Whether the change is code, documentation, translation, or third-party material.
- Whether you own the copyright or redistribution rights for the content.
- Whether the Chinese baseline, English translation, or tests also need updating.

### 2. Create a Branch

Create a short-lived branch from the latest `main`. The following prefixes are recommended:

| Prefix   | Use                                       |
| -------- | ----------------------------------------- |
| `docs/`  | Documentation, examples, and translations |
| `fix/`   | Bug fixes                                 |
| `feat/`  | New features                              |
| `test/`  | Tests and verification                    |
| `chore/` | Build, dependency, and maintenance work   |

Keep one branch focused on one goal and open a Pull Request soon after the work is ready.

### 3. Make the Changes

Documentation changes should follow these path rules:

- Put the Chinese baseline in `docs/zh/`.
- Put English translations in `docs/en/` using the same article paths as the Chinese tree.
- Use `_category.md` to set category titles and ordering.
- Use lowercase kebab-case for article filenames, such as `network-backup.md`.
- Do not use `index.md` as an article name inside a category; the build script ignores it.
- Every document must have a `title` field; write an explicit timezone for date fields when possible.
- Start the body at `##`, use `:::warning` for dangerous operations, and specify a language for code blocks.

Code changes should follow these rules:

- Fix the actual problem first; do not add unnecessary abstractions for simple logic.
- Keep browser-only APIs in client-side code paths; static builds must not depend on a runtime server.
- When changing routes, base paths, or static assets, check the home page, console, and deep documentation URLs together.
- Do not remove or replace upstream licenses, source notices, or copyright information in the root `components/` directory.
- If you copy or modify a third-party UI component, describe its source, the scope of your changes, and the applicable license in the Pull Request.

### 4. Verify Locally

Run at least the following for documentation or code changes:

```bash
npm ci
npm run build:docs
npm run typecheck
npm test
npm run build
```

Check that:

- The build has no Frontmatter, type-checking, or bundling errors.
- The home page, `/console`, and `/docs/...` can be opened directly.
- The production build has no incorrect root-absolute asset paths.
- Documentation ordering, heading anchors, code highlighting, and language fallback work correctly.
- Dangerous operations include clear warnings, impact descriptions, and recovery advice.

`app/docs/.generated/docs.ts` is generated by `scripts/build-docs.ts`. Do not edit it by hand. After changing documentation, run `npm run build:docs` and check that the generated diff contains only the changes expected from your document edits.

### 5. Open a Pull Request

The Pull Request title should state the purpose directly, for example:

- `[docs] Add a ZFS snapshot backup guide`
- `[fix] Fix deep-link loading for documentation pages`
- `[feat] Add instance status filtering`

Include the following in the description:

- The purpose and main contents of the change.
- The affected pages, documentation paths, or components.
- The systems and software versions used, when applicable.
- The verification commands that were run and their results.
- Known limitations, compatibility concerns, or follow-up work.

### 6. Review and Merge

Reviewers focus on factual accuracy, reproducibility, risk notices, license boundaries, mobile behavior, and build results. Fix issues directly instead of bypassing review by deleting tests, hiding warnings, or weakening validation.

A Pull Request is ready to merge only after checks pass, important review comments are resolved, and the change scope is clear. Delete the temporary branch after merging.

## Translation Rules

Chinese is the factual and structural baseline. An English translation is not required for every article. When translating:

- Keep article paths, commands, configuration keys, versions, and risk levels consistent.
- Do not change technical conclusions or omit limitations for stylistic reasons.
- Use `translator.type` with `machine`, `llm`, `human`, or `mix`.
- AI translations must be manually checked, especially commands, paths, options, error messages, and warnings.
- When an English article is missing, the site displays Chinese fallback content and informs the reader.

## Licensing and Copyright

- First-party project code, excluding upstream UI components in the root `components/` directory, is licensed under GPL-3.0-or-later.
- `README.md`, `docs/`, and original project documentation material are licensed under CC BY-SA 4.0.
- Upstream components in the root `components/` directory, including material from shadcn/ui and Aceternity UI, are not covered by the project's blanket license and must retain the licenses from their respective sources.
- Third-party dependencies, fonts, icons, images, and examples keep their original licenses and do not become project-licensed merely by being submitted here.
- Contributors retain copyright in their original work. Submitting a contribution means that you have the right to submit it and agree to publish it under the license applicable to its content type.

The project does not currently require a separate CLA. If you cannot confirm that you have the right to redistribute a piece of code, text, image, or translation, do not submit it yet; explain its source and authorization in an Issue first.

## Issue Reports

Useful issue reports include reproduction steps, expected and actual results, browser and system versions, relevant URLs, and console errors with sensitive information removed. Do not publish security issues publicly; contact the maintainer privately instead.

Thank you to everyone who makes Loopback Cloud more real, reproducible, and maintainable.
