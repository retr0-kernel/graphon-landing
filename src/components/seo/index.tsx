import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { POSTS_BY_SLUG } from '../../content/blog/loader';
import { FAQS } from '../../pages/pricing/data';

const SITE_URL = 'https://graphon.co';
const SITE_NAME = 'Graphon';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
  'Graphon uses eBPF to build a live Kubernetes service dependency graph without code changes or sidecars. Detect drift, analyze blast radius, and understand your infrastructure.';

interface PageSeo {
  title: string;
  description: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: 'Graphon — eBPF Kubernetes Dependency Mapping',
    description: DEFAULT_DESCRIPTION,
  },
  '/features': {
    title: 'Kubernetes Dependency Mapping & Observability Features | Graphon',
    description:
      'Explore Graphon features: live eBPF service maps, drift detection, blast-radius analysis, ownership, snapshots, telemetry, cost tracking, SLOs, and reliability scanning.',
  },
  '/architecture': {
    title: 'How Graphon Works — eBPF Kubernetes Architecture',
    description:
      'See how Graphon observes Kubernetes network connections with eBPF, enriches runtime events, and builds a real-time service dependency graph in Neo4j.',
  },
  '/pricing': {
    title: 'Graphon Pricing — Free & Pro Kubernetes Observability',
    description:
      'Compare Graphon Free, Pro self-hosted, and managed Cloud plans. Start with an Apache 2.0 Kubernetes dependency graph and upgrade when your team needs more.',
  },
  '/docs': {
    title: 'Graphon Documentation — Install on Kubernetes with Helm',
    description:
      'Install and configure Graphon on Kubernetes. Learn about its eBPF agent, Helm chart, dependency graph API, observability, authentication, snapshots, and exports.',
  },
  '/blog': {
    title: 'Graphon Engineering Blog — eBPF, Kubernetes & Observability',
    description:
      'Technical articles from the Graphon team about eBPF, Kubernetes dependency mapping, observability, reliability, React performance, and production engineering.',
  },
  '/contact-us': {
    title: 'Contact the Graphon Team',
    description:
      'Contact the Graphon team about Kubernetes dependency mapping, self-hosted Pro licenses, managed Graphon Cloud, support, and technical questions.',
  },
  '/404': {
    title: 'Page Not Found | Graphon',
    description: 'The requested page could not be found.',
    noindex: true,
  },
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function setStructuredData(data: object[]) {
  let script = document.head.querySelector<HTMLScriptElement>('script[data-graphon-seo]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.graphonSeo = 'true';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': data });
}

function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    sameAs: ['https://github.com/retr0-kernel/graphon-helm'],
  };
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
    const blogMatch = normalizedPath.match(/^\/blog\/([^/]+)$/);
    const post = blogMatch ? POSTS_BY_SLUG[decodeURIComponent(blogMatch[1])] : undefined;
    const isNotFound = !post && !PAGE_SEO[normalizedPath];
    const page = post
      ? {
          title: `${post.title} | Graphon`,
          description: post.excerpt,
          type: 'article' as const,
        }
      : PAGE_SEO[isNotFound ? '/404' : normalizedPath] ?? PAGE_SEO['/'];

    const canonicalPath = post ? `/blog/${post.slug}` : normalizedPath;
    const canonical = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    const robots = page.noindex || isNotFound
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    document.title = page.title;
    upsertLink('canonical', canonical);
    upsertMeta('meta[name="description"]', { name: 'description', content: page.description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[name="googlebot"]', { name: 'googlebot', content: robots });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: page.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: page.description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: page.type ?? 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_IMAGE });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: 'Graphon Kubernetes dependency mapping' });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_US' });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: page.title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: page.description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: DEFAULT_IMAGE });

    const publishedMeta = document.head.querySelector<HTMLMetaElement>('meta[property="article:published_time"]');
    if (post) {
      upsertMeta('meta[property="article:published_time"]', {
        property: 'article:published_time',
        content: post.date,
      });
    } else {
      publishedMeta?.remove();
    }

    const schemas: object[] = [
      organizationSchema(),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-US',
      },
    ];

    if (normalizedPath === '/') {
      schemas.push({
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#software`,
        name: SITE_NAME,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Kubernetes',
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        softwareHelp: `${SITE_URL}/docs`,
        downloadUrl: 'https://github.com/retr0-kernel/graphon-helm',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      });
    } else if (post) {
      schemas.push({
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        mainEntityOfPage: canonical,
        image: DEFAULT_IMAGE,
        author: { '@type': 'Person', name: post.author },
        publisher: { '@id': `${SITE_URL}/#organization` },
        keywords: post.tags.join(', '),
        inLanguage: 'en-US',
      });
    } else {
      schemas.push({
        '@type': normalizedPath === '/blog' ? 'Blog' : 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'en-US',
      });
    }

    if (normalizedPath === '/pricing') {
      schemas.push({
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      });
    }

    if (normalizedPath !== '/') {
      schemas.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: post?.title ?? page.title.replace(/ \| Graphon$/, ''),
            item: canonical,
          },
        ],
      });
    }

    setStructuredData(schemas);
  }, [pathname]);

  return null;
}
