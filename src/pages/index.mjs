import { site } from '../site.mjs';
import { ctaButton, diagram } from '../layout.mjs';
import { section, numbered, caseCards, bookingForm, reviews } from '../components.mjs';

const services = [
  { ...site.services[0], lead: 'Take the repetitive work off your team.', text: 'We map the workflows that eat your operators’ hours, then automate them with checks at every step and a person on the exceptions.', tags: ['Document processing', 'Back-office automation', 'System integrations', 'Human approval'] },
  { ...site.services[1], lead: 'Decide what to build before you pay to build it.', text: 'A stack review, a ranked list of AI opportunities and an architecture your team or ours can build from. Starts with a free AI readiness assessment.', tags: ['AI readiness', 'Roadmap', 'Architecture review', 'Feasibility study'] },
  { ...site.services[2], lead: 'Ship the product, not just the prototype.', text: 'Multi-tenant SaaS platforms, web and mobile apps and the design behind them, delivered by senior engineers on a weekly release rhythm.', tags: ['SaaS platforms', 'Web and mobile', 'UI/UX design', 'Cloud and DevOps'] },
  { ...site.services[3], lead: 'Agents that act, with answers you can audit.', text: 'Assistants and agents grounded in your own data, with citations, guardrails and a full trace behind every action they take.', tags: ['RAG', 'Tool-using agents', 'Guardrails', 'Eval pipelines'] },
];

const process = [
  { title: 'Scope', text: 'A free 30-minute call with a senior engineer, followed by a focused discovery of your stack, workflows and goals.' },
  { title: 'Design', text: 'You get a proposal with scope, timeline and approach, and an architecture you can question, before any code is written.' },
  { title: 'Build', text: 'Weekly releases you can use. Every change passes tests and evals and is reviewed by a senior engineer.' },
  { title: 'Run', text: 'We monitor quality, cost and latency in production, improve from real usage, and hand over when your team is ready.' },
];

export default {
  slug: 'index',
  title: 'Techlio | AI agents, automation and SaaS engineering',
  description: 'Techlio is an AI-ready engineering firm. Senior engineers build AI agents, workflow automation and SaaS platforms that hold up in production. Book a technical scoping call.',
  diagrams: true,
  body: `
<section class="hero">
  <div class="wrap">
    <p class="badge">${site.badge}</p>
    <h1>AI that holds up in production, built by senior engineers.</h1>
    <p class="lede">Techlio designs, builds and runs AI agents, workflow automation and SaaS platforms for funded startups and engineering leaders. Every release is tested against evals, guarded by human review and owned by the engineers who scoped it.</p>
    <div class="actions">
      ${ctaButton()}
      <a class="btn btn-ghost" href="case-studies.html">See shipped work</a>
    </div>
    <ul class="proofline">${site.heroProof.map((p) => `<li>${p}</li>`).join('')}</ul>
    ${diagram('agent', { autorun: true, caption: 'A user request passes through tenant scoping, retrieval, orchestration, guardrails and a confidence check before a verified action is written back and logged.' })}
  </div>
</section>

<section class="strip" aria-label="Platforms and capabilities">
  <div class="wrap strip-row">
    <p>What we build on</p>
    <div class="marquee"><ul>${[...site.platforms, ...site.platforms].map((p, i) => `<li${i >= site.platforms.length ? ' aria-hidden="true"' : ''}>${p}</li>`).join('')}</ul></div>
  </div>
</section>

<section class="section" id="services">
  <div class="wrap">
    <div class="section-head">
      <h2>Four practices, one standard of engineering</h2>
      <p>Pick the entry point that matches where you are. The same senior team and the same release discipline sit behind each one.</p>
    </div>
    <ol class="service-grid">
      ${services
        .map(
          (s, i) => `<li class="service-card">
        <span class="step-n" aria-hidden="true">0${i + 1}</span>
        <h3><a href="${s.href}">${s.label}</a></h3>
        <p class="service-lead">${s.lead}</p>
        <p>${s.text}</p>
        <ul class="chips">${s.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
        <a class="more" href="${s.href}">Explore ${s.short.toLowerCase()}</a>
      </li>`
        )
        .join('\n      ')}
    </ol>
    <div class="offer-row">
      <p>Prefer a fixed scope and a fixed date?</p>
      ${site.offers.map((o) => `<a class="btn btn-ghost" href="${o.href}">${o.label}</a>`).join('')}
    </div>
  </div>
</section>

<section class="stats" aria-label="Techlio in numbers">
  <div class="wrap stats-row">
    ${site.stats.map((s) => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('')}
  </div>
</section>

${section({
  id: 'process',
  title: 'From first call to running system',
  intro: 'Four phases, each ending in something you can hold us to.',
  body: `${numbered(process, 'steps-4')}<p class="section-foot"><a class="more" href="process.html">See the full process and engagement options</a></p>`,
})}

${section({
  id: 'work',
  tone: 'tint',
  title: 'Shipped, in production, in use',
  intro: 'Products we engineered for clients in financial services, e-commerce and wellness.',
  body: `${caseCards(['fundmydeductible', 'convert', 'vofspace'])}<p class="section-foot"><a class="more" href="case-studies.html">Browse all case studies</a></p>`,
})}

${bookingForm()}
${reviews()}
`,
};
