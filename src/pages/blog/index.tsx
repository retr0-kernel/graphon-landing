import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { POSTS, POSTS_BY_SLUG, type BlogPost } from './data';
import { useInView } from '../../hooks/useInView';
import { ROUTES } from '../../config/routes';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Block({ block }: { block: BlogPost['body'][number] }) {
  switch (block.kind) {
    case 'p':
      return <p className={styles.p}>{block.text}</p>;
    case 'h2':
      return <h2 className={styles.h2}>{block.text}</h2>;
    case 'h3':
      return <h3 className={styles.h3}>{block.text}</h3>;
    case 'quote':
      return <blockquote className={styles.quote}>{block.text}</blockquote>;
    case 'list':
      return block.ordered
        ? <ol className={styles.list}>{block.items.map((it, i) => <li key={i}>{it}</li>)}</ol>
        : <ul className={styles.list}>{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
    case 'code':
      return (
        <div className={styles.codeWrap}>
          <span className={styles.codeLang}>{block.language}</span>
          <pre className={styles.codeBlock}><code>{block.text}</code></pre>
        </div>
      );
  }
}

function PostCard({ post }: { post: typeof POSTS[number] }) {
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
      <div className={styles.cardCta}>
        <span>Read post</span>
        <span className="material-symbols-outlined">arrow_forward</span>
      </div>
    </Link>
  );
}

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

        <div className={styles.cardGrid}>
          {POSTS.map(p => <PostCard key={p.slug} post={p} />)}
        </div>
      </div>
    </div>
  );
}

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
            We couldn&rsquo;t find that post. <Link to={ROUTES.blog} className={styles.backLink}>Back to all posts &rarr;</Link>
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
            <span className={styles.dot}>&middot;</span>
            <span>{post.author}</span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
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

export default function Blog() {
  const { slug } = useParams<{ slug: string }>();
  return slug ? <PostView /> : <PostIndex />;
}