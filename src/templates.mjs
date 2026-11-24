import { closing } from './layout.mjs';
import { pageHero, numbered, blocks, caseCards, section } from './components.mjs';

/** Service page: hero with diagram, four offerings, two case studies, three reasons, closing CTA. */
export const servicePage = (d) => ({
  slug: d.slug,
  title: d.title,
  description: d.description,
  diagrams: true,
  body: `
${pageHero({
  back: { href: 'index.html#services', label: 'all services' },
  title: d.h1,
  intro: d.intro,
  primary: 'Book a technical scoping call',
  secondary: { href: 'case-studies.html', label: 'See shipped work' },
  diagramId: d.diagram,
  caption: d.caption,
})}
${section({ title: d.offerTitle, intro: d.offerIntro, body: numbered(d.offerings, 'steps-4') })}
${section({ tone: 'tint', title: 'Products we have shipped', body: caseCards(d.cases) })}
${section({ title: d.whyTitle, body: blocks(d.why) })}
${closing(d.closeTitle, d.closeText)}
`,
});
