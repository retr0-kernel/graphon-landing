/**
 * Blog content loader.
 *
 * This module is the *only* place the blog page talks to the filesystem. It:
 *   1. Imports every `.md` file in `src/content/blog/` as a raw string at build time
 *      (Vite's `import.meta.glob` walks the folder eagerly).
 *   2. Splits each file into YAML-ish frontmatter + Markdown body.
 *   3. Converts the body into the typed `Block[]` shape consumed by `pages/blog/index.tsx`.
 *
 * Adding a new post: drop a `.md` file in `src/content/blog/`. No imports, no code edits.
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  author: string;
  /** Path to the author's avatar image, relative to `src/`. */
  avatar: string;
  /** Resolved at parse time — render-ready. */
  avatarUrl: string;
  /** Initials shown when no real avatar ships. */
  avatarInitials: string;
  tags: string[];
  readingMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  body: BlogBlock[];
}

export type BlogBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'code'; language: string; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'table'; header: string[]; rows: string[][] };

// ---------------------------------------------------------------------------
// Raw file import
// ---------------------------------------------------------------------------

import { resolveAvatar } from './avatars';

// `eager: true` => bundle ships the raw strings, no async loader needed.
// `query: '?raw', import: 'default'` => read as a string, not parsed by Vite.
// `import.meta.glob` patterns must be *literal* — duplication is fine.
const RAW_FILES = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// ---------------------------------------------------------------------------
// Frontmatter parsing
// ---------------------------------------------------------------------------

interface Frontmatter {
  title?: string;
  excerpt?: string;
  date?: string;
  author?: string;
  /** Path relative to `src/` (e.g. `assets/images/photo2.jpeg`). */
  avatar?: string;
  tags?: string[];
  draft?: boolean;
}

const DEFAULT_AUTHOR = 'Krish Srivastava';
const DEFAULT_AVATAR = 'assets/images/photo2.jpeg';

function stripWrappingQuotes(value: string): string {
  const s = value.trim();
  if (s.length >= 2 && (s[0] === '"' && s[s.length - 1] === '"' || s[0] === "'" && s[s.length - 1] === "'")) {
    return s.slice(1, -1).trim();
  }
  return s;
}

function splitFrontmatter(raw: string): { fm: Frontmatter; body: string } {
  // Windows-style line endings, just in case.
  const text = raw.replace(/\r\n/g, '\n');
  if (!text.startsWith('---')) {
    return { fm: {}, body: text };
  }
  const closingIdx = text.indexOf('\n---', 3);
  if (closingIdx === -1) {
    return { fm: {}, body: text };
  }
  const fmBlock = text.slice(3, closingIdx).trim();
  const body = text.slice(closingIdx + 4).replace(/^\n/, '');
  return { fm: parseFrontmatter(fmBlock), body };
}

function parseFrontmatter(block: string): Frontmatter {
  const fm: Frontmatter = {};
  const lines = block.split('\n');
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const valueRaw = line.slice(colon + 1).trim();
    switch (key) {
      case 'title':
      case 'excerpt':
      case 'author':
      case 'avatar':
      case 'date':
        fm[key] = stripWrappingQuotes(valueRaw);
        break;
      case 'tags':
        fm.tags = parseInlineList(valueRaw);
        break;
      case 'draft':
        fm.draft = /^(true|yes|1)$/i.test(valueRaw);
        break;
    }
  }
  return fm;
}

/** Parses `["a", "b", "c"]` or `[a, b, c]` (without quotes) into a string[]. */
function parseInlineList(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [];
  const inner = trimmed.slice(1, -1);
  if (!inner.trim()) return [];
  return inner
    .split(',')
    .map(p => stripWrappingQuotes(p))
    .filter(p => p.length > 0);
}

// ---------------------------------------------------------------------------
// Slug + reading-time helpers
// ---------------------------------------------------------------------------

function slugFromPath(path: string): string {
  // `/src/content/blog/foo-bar.md` -> `foo-bar`
  const file = path.split('/').pop() ?? '';
  return file.replace(/\.md$/i, '');
}

function countWords(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length;
}

function readingMinutes(body: string): number {
  // ~225 wpm, round up to next whole minute, floor 1.
  const words = countWords(body);
  return Math.max(1, Math.ceil(words / 225));
}

function firstParagraph(body: string): string {
  // First non-empty, non-heading block — used as default excerpt.
  const blocks = parseMarkdown(body);
  for (const b of blocks) {
    if (b.kind === 'p' && b.text.trim().length > 0) {
      const txt = b.text.trim();
      return txt.length > 220 ? txt.slice(0, 217) + '…' : txt;
    }
  }
  return '';
}

// ---------------------------------------------------------------------------
// Markdown → blocks
// ---------------------------------------------------------------------------

/**
 * Parse a Markdown string into the typed block array the blog page renders.
 *
 * Supported subset:
 *   - ATX headings: `##` and `###` (no `#` — the title is already the H1).
 *   - Fenced code blocks: ``` ```lang ... ``` ``` (closes on the same fence length).
 *   - Blockquotes: `> ...`
 *   - Ordered and unordered lists (`1.`, `-`).
 *   - Paragraphs of plain text, separated by blank lines.
 *
 * Inline formatting (`**bold**`, `*italic*`, `` `code` ``, `[label](url)`) is applied
 * when rendering JSX, not here. This split keeps the body type-safe and the parser small.
 */
export function parseMarkdown(src: string): BlogBlock[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: BlogBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Blank line — skip, used as a block separator.
    if (line.trim() === '') {
      i += 1;
      continue;
    }

    // Fenced code block.
    const fence = line.match(/^```(\S*)\s*$/);
    if (fence) {
      const language = fence[1] || 'text';
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      // skip the closing fence, if present
      if (i < lines.length) i += 1;
      blocks.push({ kind: 'code', language, text: buf.join('\n') });
      continue;
    }

    // Heading.
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      blocks.push({ kind: 'h2', text: h2[1].trim() });
      i += 1;
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      blocks.push({ kind: 'h3', text: h3[1].trim() });
      i += 1;
      continue;
    }

    // Blockquote: collect consecutive `> ...` lines.
    if (line.startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ kind: 'quote', text: buf.join(' ').trim() });
      continue;
    }

    // GFM-style pipe table: a header row immediately followed by a
    // separator row of dashes (optionally with alignment colons), e.g.
    //   | Program | Hook | Purpose |
    //   | --- | --- | --- |
    //   | `tcp_connect.bpf.c` | kprobe | ... |
    const nextLine = lines[i + 1];
    const isTableSeparator = (l: string | undefined) =>
      !!l && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(l);
    if (line.includes('|') && isTableSeparator(nextLine)) {
      const splitRow = (row: string): string[] => {
        let r = row.trim();
        if (r.startsWith('|')) r = r.slice(1);
        if (r.endsWith('|')) r = r.slice(0, -1);
        return r.split('|').map(cell => cell.trim());
      };
      const header = splitRow(line);
      i += 2; // skip header row + separator row
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() !== '' && lines[i].includes('|')) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      blocks.push({ kind: 'table', header, rows });
      continue;
    }

    // Unordered list.
    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ''));
        i += 1;
      }
      blocks.push({ kind: 'list', ordered: false, items });
      continue;
    }

    // Ordered list.
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ kind: 'list', ordered: true, items });
      continue;
    }

    // Paragraph: collect until blank line or block-level construct.
    const buf: string[] = [];
    while (i < lines.length) {
      const cur = lines[i];
      if (cur.trim() === '') break;
      if (/^```/.test(cur)) break;
      if (/^##\s+/.test(cur) || /^###\s+/.test(cur)) break;
      if (cur.startsWith('>')) break;
      if (/^-\s+/.test(cur)) break;
      if (/^\d+\.\s+/.test(cur)) break;
      buf.push(cur);
      i += 1;
    }
    blocks.push({ kind: 'p', text: buf.join(' ').trim() });
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Parsed posts, sorted newest first, drafts filtered out. */
export const POSTS: BlogPost[] = (() => {
  const all: BlogPost[] = [];

  for (const [path, raw] of Object.entries(RAW_FILES)) {
    const slug = slugFromPath(path);
    if (!slug || slug.startsWith('_')) continue; // `_format.md` is hidden
    const { fm, body } = splitFrontmatter(raw);
    if (fm.draft) continue;

    const blocks = parseMarkdown(body);
    const excerpt = (fm.excerpt ?? firstParagraph(body)).trim();
    const title = (fm.title ?? slug).trim();
    const date = fm.date ?? new Date().toISOString().slice(0, 10);
    const author = (fm.author ?? DEFAULT_AUTHOR).trim() || DEFAULT_AUTHOR;
    const avatarPath = (fm.avatar ?? DEFAULT_AVATAR).trim() || DEFAULT_AVATAR;
    const { url: avatarUrl, initials: avatarInitials } = resolveAvatar(avatarPath, author);
    const tags = fm.tags ?? [];

    all.push({
      slug,
      title,
      excerpt,
      date,
      author,
      avatar: avatarPath,
      avatarUrl,
      avatarInitials,
      tags,
      readingMinutes: readingMinutes(body),
      body: blocks,
    });
  }

  all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return all;
})();

/** Lookup table for `PostView`. */
export const POSTS_BY_SLUG: Record<string, BlogPost> = POSTS.reduce<Record<string, BlogPost>>((acc, p) => {
  acc[p.slug] = p;
  return acc;
}, {});
