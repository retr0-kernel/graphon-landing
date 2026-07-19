import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://graphon.co';
const DIST_DIR = new URL('../dist/', import.meta.url);
const BLOG_DIR = new URL('../src/content/blog/', import.meta.url);

const routes = [
  ['/', 'Graphon — eBPF Kubernetes Dependency Mapping', 'Graphon uses eBPF to build a live Kubernetes service dependency graph without code changes or sidecars. Detect drift, analyze blast radius, and understand your infrastructure.', 'SoftwareApplication'],
  ['/features', 'Kubernetes Dependency Mapping & Observability Features | Graphon', 'Explore Graphon features: live eBPF service maps, drift detection, blast-radius analysis, ownership, snapshots, telemetry, cost tracking, SLOs, and reliability scanning.', 'WebPage'],
  ['/architecture', 'How Graphon Works — eBPF Kubernetes Architecture', 'See how Graphon observes Kubernetes network connections with eBPF, enriches runtime events, and builds a real-time service dependency graph in Neo4j.', 'WebPage'],
  ['/pricing', 'Graphon Pricing — Free & Pro Kubernetes Observability', 'Compare Graphon Free, Pro self-hosted, and managed Cloud plans. Start with an Apache 2.0 Kubernetes dependency graph and upgrade when your team needs more.', 'WebPage'],
  ['/docs', 'Graphon Documentation — Install on Kubernetes with Helm', 'Install and configure Graphon on Kubernetes. Learn about its eBPF agent, Helm chart, dependency graph API, observability, authentication, snapshots, and exports.', 'WebPage'],
  ['/blog', 'Graphon Engineering Blog — eBPF, Kubernetes & Observability', 'Technical articles from the Graphon team about eBPF, Kubernetes dependency mapping, observability, reliability, React performance, and production engineering.', 'Blog'],
  ['/contact-us', 'Contact the Graphon Team', 'Contact the Graphon team about Kubernetes dependency mapping, self-hosted Pro licenses, managed Graphon Cloud, support, and technical questions.', 'ContactPage'],
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function frontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1].trim().replace(/^["']|["']$/g, '') ?? '';
}

async function blogRoutes() {
  const files = (await readdir(BLOG_DIR)).filter(file => file.endsWith('.md') && !file.startsWith('_'));
  return Promise.all(files.map(async file => {
    const source = await readFile(new URL(file, BLOG_DIR), 'utf8');
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const slug = file.replace(/\.md$/, '');
    return {
      path: `/blog/${slug}`,
      title: `${frontmatterValue(frontmatter, 'title')} | Graphon`,
      description: frontmatterValue(frontmatter, 'excerpt'),
      date: frontmatterValue(frontmatter, 'date'),
      author: frontmatterValue(frontmatter, 'author'),
    };
  }));
}

function replaceMeta(html, attribute, name, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${name}"[^>]*>`);
  return html.replace(pattern, `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`);
}

function schemaFor(route, title, description, type, article) {
  const url = `${SITE_URL}${route === '/' ? '' : route}`;
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Graphon',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      sameAs: ['https://github.com/retr0-kernel/graphon-helm'],
    },
    {
      '@type': type,
      '@id': `${url}#${article ? 'article' : 'webpage'}`,
      url,
      name: title,
      headline: article ? title.replace(/ \| Graphon$/, '') : undefined,
      description,
      datePublished: article?.date,
      dateModified: article?.date,
      author: article ? { '@type': 'Person', name: article.author } : undefined,
      publisher: { '@id': `${SITE_URL}/#organization` },
      image: `${SITE_URL}/og-image.png`,
      inLanguage: 'en-US',
    },
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
}

function renderRoute(template, route, title, description, type, article) {
  const canonical = `${SITE_URL}${route === '/' ? '' : route}`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(
      /<script type="application\/ld\+json" data-graphon-seo>[\s\S]*?<\/script>/,
      `<script type="application/ld+json" data-graphon-seo>${schemaFor(route, title, description, type, article)}</script>`,
    );

  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:type', article ? 'article' : 'website');
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  return html;
}

const template = await readFile(new URL('index.html', DIST_DIR), 'utf8');
const articles = await blogRoutes();
const allRoutes = [
  ...routes.map(([route, title, description, type]) => ({ path: route, title, description, type })),
  ...articles.map(article => ({ ...article, type: 'BlogPosting', article })),
];

for (const route of allRoutes) {
  const html = renderRoute(
    template,
    route.path,
    route.title,
    route.description,
    route.type,
    route.article,
  );
  const output = route.path === '/'
    ? new URL('index.html', DIST_DIR)
    : new URL(`.${route.path}.html`, DIST_DIR);
  await mkdir(path.dirname(output.pathname), { recursive: true });
  await writeFile(output, html);
}

const sitemapEntries = allRoutes.map(route => {
  const lastmod = route.article?.date ? `\n    <lastmod>${route.article.date}</lastmod>` : '';
  const priority = route.path === '/' ? '1.0' : route.path === '/contact-us' ? '0.5' : '0.8';
  return `  <url>\n    <loc>${SITE_URL}${route.path}</loc>${lastmod}\n    <priority>${priority}</priority>\n  </url>`;
});
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', DIST_DIR), sitemap);

console.log(`Generated SEO HTML for ${allRoutes.length} routes.`);
