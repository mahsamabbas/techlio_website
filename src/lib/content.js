// Loads the editable content in /content (JSON, managed through the /admin screen).
import site from '../../content/settings/site.json';
import home from '../../content/pages/home.json';
import processPage from '../../content/pages/process.json';
import about from '../../content/pages/about.json';
import contact from '../../content/pages/contact.json';
import privacy from '../../content/pages/privacy.json';
import terms from '../../content/pages/terms.json';
import careers from '../../content/pages/careers.json';

const list = (mods) =>
  Object.values(mods)
    .map((m) => m.default)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const services = list(import.meta.glob('../../content/services/*.json', { eager: true }));
export const offers = list(import.meta.glob('../../content/offers/*.json', { eager: true }));
export const cases = list(import.meta.glob('../../content/case-studies/*.json', { eager: true }));
export const technologies = list(import.meta.glob('../../content/technologies/*.json', { eager: true }));
export const industries = list(import.meta.glob('../../content/industries/*.json', { eager: true }));
export const insights = Object.values(import.meta.glob('../../content/insights/*.json', { eager: true }))
  .map((m) => m.default)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title));

export const pages = { home, process: processPage, about, contact, privacy, terms, careers };
export { site };

export const cta = { href: '/contact/#book', label: site.ctaLabel };
export const phoneHref = '+' + site.phone.replace(/\D/g, '');
export const nav = [
  { href: '/process/', label: 'Process' },
  { href: '/case-studies/', label: 'Case Studies' },
  { href: '/insights/', label: 'Insights' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

/** Case studies for a list of slugs, skipping any that no longer exist. */
export const pickCases = (slugs = []) => slugs.map((s) => cases.find((c) => c.slug === s)).filter(Boolean);

/** Structured data helpers (schema.org JSON-LD). */
const abs = (path) => new URL(path, site.url).href;
export const faqSchema = (faqs = []) =>
  faqs.length
    ? [{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
      }]
    : [];
export const breadcrumbSchema = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.path) })),
});
export const serviceSchema = (e) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: e.title,
  description: e.description,
  url: abs(`/${e.slug}/`),
  provider: { '@id': `${site.url}/#organization` },
  areaServed: ['US', 'GB', 'Europe'],
});
export const articleSchema = (a) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.description,
  datePublished: a.date,
  dateModified: a.updated || a.date,
  author: /techlio/i.test(a.author)
    ? { '@type': 'Organization', name: a.author, url: site.url }
    : { '@type': 'Person', name: a.author, ...(a.authorRole ? { jobTitle: a.authorRole } : {}), worksFor: { '@id': `${site.url}/#organization` } },
  publisher: { '@id': `${site.url}/#organization` },
  mainEntityOfPage: abs(`/insights/${a.slug}/`),
});
export const longDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  publisher: { '@id': `${site.url}/#organization` },
};

/** Heading formatting: words wrapped in *asterisks* render in the accent colour. */
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const fmt = (s = '') => escapeHtml(s).replace(/\*([^*]+)\*/g, '<span class="accent">$1</span>');
export const plain = (s = '') => String(s).replace(/\*/g, '');
export const initials = (name = '') => name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

/** Links a case study's stack item to its technology page, when one exists. Matches only on what the case study lists. */
const techRules = [
  [/react native/i, 'react-native'],
  [/claude/i, 'claude'],
  [/openai/i, 'openai'],
  [/\bmcp\b/i, 'mcp'],
  [/langchain|langgraph/i, 'langchain'],
  [/n8n/i, 'n8n'],
  [/pgvector|postgres/i, 'postgresql-pgvector'],
  [/django/i, 'django'],
  [/laravel/i, 'laravel'],
  [/python|fastapi/i, 'python-fastapi'],
  [/node\.?js|nestjs|typescript/i, 'nodejs-typescript'],
  [/\breact\b|next\.?js/i, 'react-nextjs'],
  [/\baws\b/i, 'aws'],
  [/pytorch|scikit/i, 'pytorch-scikit-learn'],
  [/hugging ?face/i, 'huggingface'],
  [/qdrant|pinecone/i, 'vector-databases'],
  [/airflow|\bdbt\b/i, 'airflow-dbt'],
  [/snowflake|bigquery/i, 'snowflake-bigquery'],
  [/servicenow/i, 'servicenow'],
  [/guardrails|presidio/i, 'ai-guardrails'],
  [/guardrails|presidio/i, 'ai-guardrails'],
  [/astro\b/i, 'astro'],
];
export const techFor = (item = '') => {
  const rule = techRules.find(([re]) => re.test(item));
  const slug = rule && rule[1];
  return slug && technologies.some((t) => t.slug === slug) ? slug : null;
};
/** Case studies whose listed stack includes the technology, after any chosen by hand. */
export const casesForTech = (t) => {
  const chosen = t.cases || [];
  const found = cases.filter((cs) => !chosen.includes(cs.slug) && (cs.stack || []).some((s) => techFor(s) === t.slug)).map((cs) => cs.slug);
  return [...chosen, ...found];
};

/** A case study's stack grouped by technology page, plus the items with no page. */
export const stackGroups = (cs) => {
  const groups = [], other = [];
  (cs.stack || []).forEach((item) => {
    const slug = techFor(item);
    if (!slug) return other.push(item);
    let g = groups.find((x) => x.tech.slug === slug);
    if (!g) groups.push((g = { tech: technologies.find((t) => t.slug === slug), items: [] }));
    g.items.push(item);
  });
  return { groups, other };
};

/** Industry pages that feature a given case study. */
export const industriesForCase = (c) => industries.filter((i) => (i.cases || []).includes(c.slug));
