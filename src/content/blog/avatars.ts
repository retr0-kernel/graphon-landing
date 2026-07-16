/**
 * Author avatars.
 *
 * The blog loader parses an `avatar:` field out of each post's frontmatter.
 * The value is a path RELATIVE TO `src/` (e.g. `assets/images/photo2.jpeg`).
 * This module maps those paths to Vite-hashed asset URLs at build time, plus
 * fallback initial-of-name SVGs for posts that don't ship an avatar.
 *
 * Adding a new avatar: drop the image under `src/assets/images/`, then add an
 * entry to `AVATARS` below. The loader picks it up automatically.
 */

import krishAvatar from '../../assets/images/photo2.webp';

export interface AuthorAvatar {
  /** Vite-hashed URL the browser can `src=` directly. */
  url: string;
  /** Short name shown when no avatar image is set. */
  initials: string;
}

/**
 * Known avatar registry, keyed by the same path the post's frontmatter uses.
 * If the post doesn't match, we fall back to a generated initials badge.
 */
const AVATARS: Record<string, AuthorAvatar> = {
  'assets/images/photo2.jpeg': { url: krishAvatar, initials: 'KS' },
  'assets/images/photo1.jpeg': { url: krishAvatar, initials: 'KS' },
};

/**
 * Resolve an avatar for a given post. Returns a real `<img>`-ready URL plus
 * initials for the fallback badge.
 */
export function resolveAvatar(avatarPath: string | undefined, author: string): AuthorAvatar {
  if (avatarPath && AVATARS[avatarPath]) {
    return AVATARS[avatarPath];
  }
  // First-letter-of-each-word initials, uppercase, max 2 letters.
  const initials = author
    .split(/\s+/)
    .map(w => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'G';
  // Empty string `url` signals "fall back to initials" to the renderer.
  return { url: '', initials };
}
