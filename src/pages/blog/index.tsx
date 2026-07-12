import { Fragment, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { POSTS, POSTS_BY_SLUG, type BlogPost, type BlogBlock } from '../../content/blog/loader';
import { useInView } from '../../hooks/useInView';
import { ROUTES } from '../../config/routes';
import { AuthorBadge } from './components/AuthorBadge';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Render a single inline-formatting segment as JSX. Used inside Block renderers. */
function renderInline(text: string): JSX.Element[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={i}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith('*') && tok.endsWith('*')) {
      return <em key={i}>{tok.slice(1, -1)}</em>;
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return <code key={i} className={styles.inlineCode}>{tok.slice(1, -1)}</code>;
    }
    const linkMatch = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          key={i}
          href={href}
          className={styles.link}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      );
    }
    return <Fragment key={i}>{tok}</Fragment>;
  });
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.kind) {
    case 'p':
      return <p className={styles.p}>{renderInline(block.text)}</p>;
    case 'h2':
      return <h2 className={styles.h2}>{renderInline(block.text)}</h2>;
    case 'h3':
      return <h3 className={styles.h3}>{renderInline(block.text)}</h3>;
    case 'quote':
      return <blockquote className={styles.quote}>{renderInline(block.text)}</blockquote>;
    case 'list':
      return block.ordered ? (
        <ol className={styles.list}>
          {block.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
        </ol>
      ) : (
        <ul className={styles.list}>
          {block.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
        </ul>
      );
    case 'code':
      return (
        <div className={styles.codeWrap}>
          <span className={styles.codeLang}>{block.language}</span>
          <pre className={styles.codeBlock}><code>{block.text}</code></pre>
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Card (used on the index grid)
// ---------------------------------------------------------------------------

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`${ROUTES.blog}/${post.slug}`} className={`${styles.card} glow-card`}>
      <div className={styles.cardMeta}>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className={styles.dot}>&middot;</span>
        <span>{post.readingMinutes} min read</span>
      </div>

      <h2 className={styles.cardTitle}>{post.title}</h2>
      <p className={styles.cardExcerpt}>{post.excerpt}</p>

      <div className={styles.tagRow}>
        {post.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardCta}>
          Read post <span className="material-symbols-outlined">arrow_forward</span>
        </span>
        <AuthorBadge
          name={post.author}
          avatarUrl={post.avatarUrl}
          initials={post.avatarInitials}
          size="sm"
        />
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Index (grid)
// ---------------------------------------------------------------------------

function PostIndex() {
  const { ref, visible } = useInView<HTMLDivElement>();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div ref={ref} className={`${styles.header} ${styles.reveal} ${visible ? styles.inView : ''}`}>
          <p className={styles.eyebrow}>Engineering Notes</p>
          <h1 className={styles.title}>From inside the agent</h1>
          <p className={styles.subtitle}>
            Deep dives on the kernel, the Kubernetes API, and the unsexy engineering behind a
            live dependency graph. Written by the team building Graphon.
          </p>
        </div>

        {POSTS.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No posts yet.</p>
            <p className={styles.emptyBody}>
              Drop a markdown file into <code>src/content/blog/</code> and it shows up here
              automatically.
            </p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {POSTS.map(p => <PostCard key={p.slug} post={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single post view
// ---------------------------------------------------------------------------

function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const post = useMemo(() => (slug ? POSTS_BY_SLUG[slug] : undefined), [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!post) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>404</p>
          <h1 className={styles.title}>Post not found</h1>
          <p className={styles.subtitle}>
            We couldn&rsquo;t find that post.{' '}
            <Link to={ROUTES.blog} className={styles.backLink}>Back to all posts &rarr;</Link>
          </p>
        </div>
      </div>
    );
  }

  const { ref, visible } = useInView<HTMLDivElement>();

  return (
    <article className={styles.page}>
      <div className={`${styles.articleInner} ${styles.reveal} ${visible ? styles.inView : ''}`} ref={ref}>
        <Link to={ROUTES.blog} className={styles.backLink}>&larr; All posts</Link>

        <header className={styles.articleHeader}>
          <div className={styles.cardMeta}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className={styles.dot}>&middot;</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div className={styles.authorLine}>
            <AuthorBadge
              name={post.author}
              avatarUrl={post.avatarUrl}
              initials={post.avatarInitials}
              size="md"
              role="Author · Graphon team"
            />
          </div>
          <div className={styles.tagRow}>
            {post.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        </header>

        <div className={styles.body}>
          {post.body.map((b, i) => <Block key={i} block={b} />)}
        </div>

        <footer className={styles.articleFooter}>
          <Link to={ROUTES.features} className={styles.footerCta}>
            <span className="material-symbols-outlined">rocket_launch</span>
            See what the agent builds
          </Link>
        </footer>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Router entry
// ---------------------------------------------------------------------------

export default function Blog() {
  const { slug } = useParams<{ slug: string }>();
  return slug ? <PostView /> : <PostIndex />;
}
