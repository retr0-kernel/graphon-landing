import styles from './AuthorBadge.module.css';

export interface AuthorBadgeProps {
  /** Author display name, e.g. `Krish Srivastava`. */
  name: string;
  /**
   * Resolved avatar URL by the blog loader. When empty, the badge falls back
   * to an initials-only circle in the same accent color as the brand.
   */
  avatarUrl: string;
  /** Initials shown when no real avatar URL is supplied. */
  initials: string;
  /** Visual size: `sm` for blog cards, `md` for the post header. */
  size?: 'sm' | 'md';
  /** Optional secondary line under the name (e.g. a role). */
  role?: string;
}

/**
 * Renders the author byline — small circular photo (or initials fallback) on
 * the LEFT, the name + optional role stacked on the RIGHT.
 *
 * Used in two places on the blog:
 *   - `PostCard` footer (size="sm", single line, right-end placement)
 *   - `PostView` header (size="md", name + role stacked)
 */
export function AuthorBadge({
  name,
  avatarUrl,
  initials,
  size = 'sm',
  role,
}: AuthorBadgeProps) {
  const sizeClass = size === 'md' ? styles.md : styles.sm;
  return (
    <div className={`${styles.root} ${sizeClass}`} aria-label={`Author: ${name}`}>
      <span className={styles.avatar} aria-hidden="true">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className={styles.avatarImg} loading="lazy" />
        ) : (
          <span className={styles.avatarInitials}>{initials}</span>
        )}
      </span>
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        {role && size === 'md' && <span className={styles.role}>{role}</span>}
      </span>
    </div>
  );
}
