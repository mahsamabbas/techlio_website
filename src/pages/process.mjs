import { closing, diagram } from '../layout.mjs';
import { numbered, blocks, section } from '../components.mjs';

const stages = ['Scoping call', 'Discovery and design', 'Choose an engagement', 'Build in weekly releases', 'Launch and improve'];

const paths = [
  { id: 'advisory', name: 'Advisory and architecture', line: 'You build, we guide.', text: 'Senior engineers review your stack, rank the opportunities and design the system. Your team, or any vendor, builds from the result.', fit: 'Teams with engineers but no AI track record', model: 'Fixed price or time and material', href: 'ai-consulting.html', link: 'Advisory in detail' },
  { id: 'cobuild', name: 'Co-build with embedded engineers', line: 'We build alongside your team.', text: 'A senior Techlio pod joins your standups, repositories and release process. You keep direction and ownership; we add capacity and AI depth.', fit: 'Teams with a roadmap and not enough senior hands', model: 'Dedicated team, fixed monthly invoice', href: 'contact.html?interest=Co-build%20with%20embedded%20engineers#book', link: 'Ask about a senior pod' },
  { id: 'delivery', name: 'End-to-end product delivery', line: 'We own it from scope to production.', text: 'Design, engineering, QA, cloud and launch from one accountable team, against a statement of work agreed before any code is written.', fit: 'Founders and business units without an engineering team', model: 'Fixed price against a detailed scope', href: 'product-development.html', link: 'Product engineering in detail' },
];

export default {
  slug: 'process',
  title: 'Process and engagement',
  description: 'How Techlio works: a five-stage process, three engagement paths from advisory to end-to-end delivery, and the release discipline behind every build.',
  diagrams: true,
  body: `
<section class="page-hero">
  <div class="wrap">
    <h1>You always know what happens next, and who owns it.</h1>
    <p class="lede">One process for every engagement, whether we advise, build alongside your team or deliver the whole product.</p>
    <ol class="rail" aria-label="Process stages">
      ${stages.map((s, i) => `<li><span aria-hidden="true">${i + 1}</span>${s}</li>`).join('')}
    </ol>
  </div>
</section>

${section({
  id: 'engagement',
  tone: 'tint',
  title: 'Three ways to work with us',
  intro: 'Each path includes the one before it. Many clients start with advisory and move right as trust builds.',
  body: `<div class="paths">
    ${paths
      .map(
        (p) => `<article class="path" id="${p.id}">
      <h3>${p.name}</h3>
      <p class="path-line">${p.line}</p>
      <p>${p.text}</p>
      <dl class="facts facts-stack">
        <div><dt>Best for</dt><dd>${p.fit}</dd></div>
        <div><dt>Commercial model</dt><dd>${p.model}</dd></div>
      </dl>
      <a class="more" href="${p.href}">${p.link}</a>
    </article>`
      )
      .join('\n    ')}
  </div>
  <p class="note">Day to day we work in the tools you already use, including Slack, Jira, Trello and Asana.</p>`,
})}

${section({
  title: 'Phase A: discovery and design',
  intro: 'Three steps, in order. Nothing is built until you have approved the output of the third.',
  body: numbered([
    { title: 'Specification', text: 'We turn goals into a written scope with users, workflows, constraints and a success measure.', list: ['Stakeholder and operator interviews', 'Review of code, infrastructure and data', 'Risks and open questions listed'] },
    { title: 'Design and prototype', text: 'Architecture and UI/UX are designed together, with a clickable prototype for anything users will touch.' },
    { title: 'Estimate and timeline', text: 'A proposal with scope, milestones, team and price, including the assumptions behind each number.' },
  ], 'steps-3'),
})}

${section({
  tone: 'tint',
  title: 'Phase B: build and run',
  intro: 'Five steps, in order, repeated in weekly cycles until launch.',
  body: numbered([
    { title: 'Prepare the data', text: 'Sources connected, cleaned and permissioned. The eval set is assembled from real cases.' },
    { title: 'Prove the approach', text: 'Models, prompts and retrieval strategies are compared on the eval set before one is chosen.' },
    { title: 'Build and test', text: 'Features ship weekly to staging with automated tests, evals and senior review on every change.' },
    { title: 'Deploy and integrate', text: 'Canary rollout to production, connected to your systems, with rollback ready.' },
    { title: 'Monitor and improve', text: 'Quality, cost and latency are tracked. Production failures become new eval cases.' },
  ], 'steps-5'),
})}

${section({
  id: 'how-we-build',
  title: 'How a change reaches production',
  intro: 'The same pipeline applies to code, prompts and model upgrades. Run both traces to see what happens when a change makes things worse.',
  body: `${diagram('release', { caption: 'A pull request passes automated tests, the eval suite and senior review, then staging and a canary, before full production rollout and monitoring.' })}
  ${blocks([
    { title: 'Evals over guesswork', text: 'Answer quality is a number tracked per release, built from your own cases, not a feeling from a demo.' },
    { title: 'Strict multi-tenant security', text: 'Isolation is enforced in the database and proven by tests that try to break it on every change.' },
    { title: 'Human-in-the-loop guardrails', text: 'High-impact and low-confidence actions wait for a person. Thresholds are set from evidence.' },
    { title: 'Senior-led execution', text: 'A senior engineer scopes, leads and reviews. The person you meet on the first call stays on the work.' },
  ], 4)}`,
})}

${closing('See where your project fits', 'Thirty minutes with a senior engineer is enough to pick a path and outline the first milestone.')}
`,
};
