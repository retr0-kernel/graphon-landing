---
title: "How to write a Graphon blog post"
excerpt: "Author guide — explains the frontmatter fields and the markdown subset the blog renderer supports. Delete this file before publishing."
date: 2026-07-12
author: "Krish Srivastava"
avatar: "assets/images/photo2.jpeg"
tags: ["meta", "guide"]
draft: true
---

This file is a **format reference**. It documents the frontmatter shape and the markdown subset that the blog page renders.

## Frontmatter fields

The block at the top of the file (between two `---` lines) controls the post metadata shown on the index card and the post header. Every field is optional except `title` — but omitting `date` or `author` will look broken on the grid, so treat them as required.

| Field | Type | Default | Used for |
| --- | --- | --- | --- |
| `title` | string | required | Card title + `<h1>` on the post page. |
| `excerpt` | string | first paragraph | Card excerpt on the grid. |
| `date` | `YYYY-MM-DD` | today | Card date + `<time>` on the post page. Newest first. |
| `author` | string | `Krish Srivastava` | Shown on the card footer (right end, with avatar) + post header (with role). |
| `avatar` | asset path | `assets/images/photo2.jpeg` | Path to a registered avatar in `src/content/blog/avatars.ts`. Falls back to a 2-letter initials badge if the path isn't registered. |
| `tags` | YAML list | empty | Tag chips on card + post header. |
| `draft` | `true` | `false` | When `true`, the post is **hidden** from the index. Useful for staging a post before publishing. |

## Filename → slug

The filename **without** the `.md` extension becomes the URL slug. So `ebpf-agent.md` is served at `/blog/ebpf-agent`. Use kebab-case, ASCII-only, no spaces.

## Inline markdown supported

| Syntax | Renders as |
| --- | --- |
| `# Heading 1` | The post title is already the H1, so avoid. |
| `## Heading 2` | Section heading. |
| `### Heading 3` | Sub-section. |
| `> quote` | Blockquote with a left border. |
| ` ```lang `<br>`code line`<br>` ``` ` | Fenced code block with a language label. |
| `- item` | Unordered list. |
| `1. item` | Ordered list. |
| `**bold**`, `*italic*`, `` `code` `` | Inline emphasis. |
| `[label](url)` | Link, opens in the same tab. |
| `[`code label`](url)` | Link with an inline-code label. |
| GFM pipe table (header row + `\| --- \|` separator row) | Rendered as a scrollable table. |

Anything else (images, raw HTML, footnotes) is **not** rendered yet. Add a feature request to the engineering channel if you need it.

### Table example

```text
| Column A | Column B |
| --- | --- |
| value 1 | value 2 |
```

## Where to put new posts

Save the file under [`graphon-landing/src/content/blog/`](graphon-landing/src/content/blog/) — that folder is auto-globbed at build time. No imports, no TypeScript changes, no code edits. Just write the markdown, commit, and the index grid picks it up automatically.

## Voice & byline

This is the Graphon blog — write it as the team. A few rules:

- **First person: `we` / `our` / `us`.** Not `I` / `my`. You're publishing on behalf of Graphon, not as a solo developer diary.
- **Byline: `Krish Srivastava`** unless the post is explicitly by a guest contributor. The `AuthorBadge` shows a small photo (28 px on cards, 38 px on the post header) to the left of the name — no "by", no dots.
- **Signing off.** Closing with `— *The Graphon team*` is fine for now; we'll standardize that after we have a couple of guest authors.
- **Avatar registration.** If you ever want a custom photo, drop the asset into [`graphon-landing/src/assets/images/`](graphon-landing/src/assets/images/) and add a new entry to the `AVATARS` map in [`src/content/blog/avatars.ts`](graphon-landing/src/content/blog/avatars.ts). The key is the path string you set as `avatar:` in the frontmatter.
