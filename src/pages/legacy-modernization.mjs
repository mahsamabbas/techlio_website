import { closing } from '../layout.mjs';
import { pageHero, numbered, blocks, section } from '../components.mjs';

export default {
  slug: 'legacy-modernization',
  title: 'Legacy-to-AI Modernization',
  description: 'Techlio modernizes legacy systems route by route behind a facade, then adds AI capability on clean services. No rewrite, no feature freeze.',
  diagrams: true,
  body: `
${pageHero({
  kicker: 'Fixed first milestone',
  title: 'Make the system you have ready for AI, without a rewrite.',
  intro: 'Your legacy platform still earns the revenue, and it is also why every AI idea stalls. We modernize it one capability at a time behind a routing facade, then attach AI to the parts that are ready.',
  primary: 'Book a modernization diagnostic',
  secondary: { href: 'case-studies.html', label: 'See shipped work' },
  diagramId: 'modernize',
  caption: 'Traffic passes through a routing facade that sends each route to the legacy application or a new service, while a change stream keeps data in sync and feeds AI capability.',
})}
${section({
  title: 'Signs it is time',
  body: `<ul class="pains">
    <li>Every AI proof of concept dies at “we can’t get clean data out of the old system”.</li>
    <li>Releases are rare and tense because nobody is sure what a change will break.</li>
    <li>The engineers who understand the core modules can be counted on one hand.</li>
    <li>A full rewrite has been proposed, estimated and shelved more than once.</li>
  </ul>`,
})}
${section({
  tone: 'tint',
  title: 'How the modernization runs',
  intro: 'Four steps, in order. The first is a fixed-price diagnostic.',
  body: numbered([
    { when: 'Weeks 1 to 2', title: 'Diagnose', text: 'We read the code, map the seams and data flows, and rank capabilities by risk and by how much AI value they unlock.' },
    { when: 'Weeks 3 to 4', title: 'Put the facade in', text: 'A routing layer goes in front of the legacy system. Nothing changes for users, and every route can now be moved independently.' },
    { when: 'Weeks 5 to 8', title: 'Carve out the first service', text: 'One capability is rebuilt with tests and documentation, run in parallel with the old path, then switched over.' },
    { when: 'Ongoing', title: 'Add AI and repeat', text: 'The first AI feature ships on the new service. The next capability follows on a predictable cadence.' },
  ], 'steps-4'),
})}
${section({
  title: 'Why this approach works',
  body: blocks([
    { title: 'No feature freeze', text: 'The old system keeps shipping while it shrinks. Your roadmap does not stop for the migration.' },
    { title: 'Reversible at every step', text: 'Any route can be sent back to the legacy path in seconds, so a bad cutover is an incident, not a crisis.' },
    { title: 'No blame for the past', text: 'Legacy code is code that worked long enough to matter. We document it as it is and move forward.' },
  ]),
})}
${closing('Start with a two-week diagnostic', 'You get a seam map, a ranked migration plan and an honest view of what AI can do on your stack today.')}
`,
};
