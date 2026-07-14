import { Fragment, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Network, Radio, Sparkles } from 'lucide-react';
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

/** Renders a link label, splitting out any `` `inline code` `` segments it contains. */
function renderLinkLabel(label: string): JSX.Element[] {
  const parts = label.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith('`') && part.endsWith('`')
      ? <code key={i} className={styles.inlineCode}>{part.slice(1, -1)}</code>
      : <Fragment key={i}>{part}</Fragment>
  );
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
          {renderLinkLabel(label)}
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
    case 'table':
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.header.map((cell, i) => (
                  <th key={i} className={styles.th}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={styles.td}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Card (used on the index grid)
// ---------------------------------------------------------------------------

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      to={`${ROUTES.blog}/${post.slug}`}
      className={`${styles.card} glow-card`}
    >
      <div className={styles.cardVisual} aria-hidden="true">
        <span className={styles.cardIndex}>{String(index + 2).padStart(2, '0')}</span>
        <Network size={28} />
      </div>
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
          Read post <ArrowRight size={17} />
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

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link to={`${ROUTES.blog}/${post.slug}`} className={styles.featuredCard}>
      <div className={styles.featuredContent}>
        <div className={styles.featuredLabel}>
          <Sparkles size={14} />
          Featured story
        </div>
        <div className={styles.cardMeta}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className={styles.dot}>&middot;</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h2 className={styles.featuredTitle}>{post.title}</h2>
        <p className={styles.featuredExcerpt}>{post.excerpt}</p>
        <div className={styles.tagRow}>
          {post.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
        <div className={styles.featuredFooter}>
          <AuthorBadge
            name={post.author}
            avatarUrl={post.avatarUrl}
            initials={post.avatarInitials}
            size="md"
            role="Graphon engineering"
          />
          <span className={styles.featuredCta}>
            Read the story <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Index (grid)
// ---------------------------------------------------------------------------

function PostIndex() {
  const { ref, visible } = useInView<HTMLDivElement>();
  const featuredPost = POSTS[0];
  const remainingPosts = POSTS.slice(1);

  return (
    <div className={styles.page}>
      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.orbTwo} aria-hidden="true" />
      <div className={styles.inner}>
        <header ref={ref} className={`${styles.hero} ${styles.reveal} ${visible ? styles.inView : ''}`}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              Graphon engineering journal
            </div>
            <h1 className={styles.title}>
              Notes from inside<br />
              <span>the runtime.</span>
            </h1>
            <p className={styles.subtitle}>
              Practical deep dives on eBPF, Kubernetes, and the engineering behind a dependency
              graph that never stops moving.
            </p>
          </div>

          <div className={styles.heroPanel} aria-hidden="true">
            <div className={styles.panelTop}>
              <span><Radio size={15} /> graphon / journal</span>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.panelPulse}><Network size={34} /></div>
              <p>Tracing the systems<br />behind your systems.</p>
            </div>
            <div className={styles.panelFooter}>
              <span><BookOpen size={14} /> {POSTS.length} {POSTS.length === 1 ? 'story' : 'stories'}</span>
              <span><Clock3 size={14} /> Built for engineers</span>
            </div>
          </div>
        </header>

        {POSTS.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No posts yet.</p>
            <p className={styles.emptyBody}>
              Drop a markdown file into <code>src/content/blog/</code> and it shows up here
              automatically.
            </p>
          </div>
        ) : featuredPost && (
          <section className={styles.stories} aria-labelledby="latest-stories">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionEyebrow}>Fresh from the lab</p>
                <h2 id="latest-stories">Latest stories</h2>
              </div>
              <span className={styles.issueCount}>{String(POSTS.length).padStart(2, '0')} published</span>
            </div>
            <FeaturedPost post={featuredPost} />
            {remainingPosts.length > 0 && (
              <div className={styles.cardGrid}>
                {remainingPosts.map((p, index) => <PostCard key={p.slug} post={p} index={index} />)}
              </div>
            )}
          </section>
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

  return (
    <article className={styles.page}>
      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.articleInner}>
        <Link to={ROUTES.blog} className={styles.backLink}><ArrowLeft size={16} /> All stories</Link>

        <header className={styles.articleHeader}>
          <p className={styles.articleEyebrow}>Graphon engineering journal</p>
          <div className={styles.cardMeta}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className={styles.dot}>&middot;</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p className={styles.articleLead}>{post.excerpt}</p>
          <div className={styles.articleHeaderFooter}>
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
          </div>
        </header>

        <div className={styles.articleLayout}>
          <aside className={styles.articleRail}>
            <span>In this field note</span>
            <strong>{post.readingMinutes} minute read</strong>
            <div className={styles.railLine} />
            <span>Published</span>
            <strong>{formatDate(post.date)}</strong>
          </aside>
          <div className={styles.body}>
            {post.body.map((b, i) => <Block key={i} block={b} />)}
          </div>
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
