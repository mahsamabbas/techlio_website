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
