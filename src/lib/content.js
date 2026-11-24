// Loads the editable content in /content (JSON, managed through the /admin screen).
import site from '../../content/settings/site.json';
import home from '../../content/pages/home.json';
import processPage from '../../content/pages/process.json';
import about from '../../content/pages/about.json';
import contact from '../../content/pages/contact.json';

const list = (mods) =>
  Object.values(mods)
    .map((m) => m.default)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const services = list(import.meta.glob('../../content/services/*.json', { eager: true }));
export const offers = list(import.meta.glob('../../content/offers/*.json', { eager: true }));
export const cases = list(import.meta.glob('../../content/case-studies/*.json', { eager: true }));

export const pages = { home, process: processPage, about, contact };
export { site };

export const cta = { href: '/contact/#book', label: site.ctaLabel };
export const phoneHref = '+' + site.phone.replace(/\D/g, '');
export const nav = [
  { href: '/process/', label: 'Process' },
  { href: '/case-studies/', label: 'Case Studies' },
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
