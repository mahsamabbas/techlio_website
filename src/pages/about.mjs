import { site, industries } from '../site.mjs';
import { closing } from '../layout.mjs';
import { blocks, section } from '../components.mjs';

export default {
  slug: 'about',
  title: 'About',
  description: 'Techlio is an AI-ready engineering firm with offices in the USA and Pakistan, partnering with startups and enterprises to design, build and scale AI-driven products.',
  body: `
<section class="page-hero">
  <div class="wrap">
    <h1>An engineering firm first. AI is what we build with it.</h1>
    <p class="lede">Techlio partners with startups and enterprises to design, build and scale AI-driven digital products. We are engineers who learned AI by shipping it into real systems, for clients across the ${site.regions}.</p>
  </div>
</section>

<section class="stats" aria-label="Techlio in numbers">
  <div class="wrap stats-row">
    ${site.stats.map((s) => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('')}
  </div>
</section>

${section({
  title: 'What we are here to do',
  body: blocks([
    { title: 'Mission', text: 'Deliver AI-led innovation and full-cycle engineering that solves real problems for our clients and keeps paying off after launch.' },
    { title: 'Vision', text: 'To be the AI and engineering partner that teams trust with their hardest ideas, and the one they call for the next.' },
  ], 2),
})}

${section({
  tone: 'tint',
  title: 'How we behave on a project',
  body: blocks([
    { title: 'Transparency', text: 'You hear about a slipped estimate or a failed approach from us, the day we know.' },
    { title: 'Quality as the standard', text: 'Tests, evals and senior review are part of the work, not an optional extra on the invoice.' },
    { title: 'Client first', text: 'Decisions are made for the product and the client, including when that means recommending less work.' },
    { title: 'Partnership over transactions', text: 'A 95% retention rate is the number we watch most closely. We plan for the second year, not just the first invoice.' },
    { title: 'Problem solving', text: 'Hard constraints are the interesting part. We would rather be handed the difficult module.' },
    { title: 'Adaptive workflow', text: 'We fit your tools, time zone and release rhythm instead of asking you to adopt ours.' },
  ]),
})}

${section({
  title: 'Where we work',
  intro: `Two offices, with delivery across the ${site.regions}.`,
  body: `<div class="blocks blocks-2">
    ${site.offices.map((o) => `<div class="block"><h3>${o.country}</h3><address>${o.address}</address></div>`).join('')}
  </div>
  <h3 class="case-sub">Platforms</h3>
  <ul class="chips chips-large">${site.platforms.map((x) => `<li>${x}</li>`).join('')}</ul>
  <h3 class="case-sub">Industries</h3>
  <ul class="chips chips-large">${industries.map((x) => `<li>${x}</li>`).join('')}</ul>
  <p class="note">Want to join the team? <a href="${site.legal.careers}">See open roles</a>.</p>`,
})}

${closing('Meet the engineers who would do the work', 'The scoping call is with a senior engineer who stays on your project.')}
`,
};
