// llms.txt: a plain-text summary of the company and its key pages for AI assistants. Built from the site content.
import { site, services, offers, cases, insights } from '../lib/content.js';

const url = (p) => new URL(p, site.url).href;
const clean = (s = '') => String(s).replace(/\*/g, '').replace(/\s+/g, ' ').trim();

export function GET() {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${clean(site.tagline)}`,
    '',
    `${site.name} is an AI engineering firm that plans, builds, secures and runs AI agents, n8n and workflow automations, and AI-native SaaS products for clients in the ${site.regions}. Work is delivered by senior engineers, with fixed-scope offers and milestone pricing available.`,
    '',
    '## Company facts',
    '',
    `- Website: ${site.url}`,
    `- Email: ${site.email}`,
    `- Phone: ${site.phone}`,
    ...site.offices.map((o) => `- Office (${o.country}): ${o.address}`),
    ...site.stats.map((s) => `- ${clean(s.label)}: ${s.value}`),
    `- Book a scoping call: ${url('/contact/')}`,
    '',
    '## Services',
    '',
    ...services.map((s) => `- [${clean(s.title)}](${url(`/${s.slug}/`)}): ${clean(s.description)}`),
    '',
    '## Fixed-scope offers',
    '',
    ...offers.map((o) => `- [${clean(o.title)}](${url(`/${o.slug}/`)}): ${clean(o.description)}`),
    '',
    '## Case studies',
    '',
    ...cases.map((c) => `- [${c.name}](${url(`/case-studies/${c.slug}/`)}): ${clean(c.headline)} (${c.industry})`),
    '',
    '## Insights',
    '',
    ...insights.map((a) => `- [${clean(a.title)}](${url(`/insights/${a.slug}/`)}): ${clean(a.description)}`),
    '',
    '## More',
    '',
    `- [How we work](${url('/process/')})`,
    `- [About](${url('/about/')})`,
    `- [Contact](${url('/contact/')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
