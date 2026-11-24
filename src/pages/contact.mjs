import { site } from '../site.mjs';
import { bookingForm, reviews } from '../components.mjs';

const faqs = [
  ['What happens after I send the form?', 'A senior engineer reads it and replies within 24 hours with questions and times for a free 30-minute scoping call. After a focused discovery you receive a proposal with scope, timeline and approach before any code is written.'],
  ['Can we sign an NDA first?', 'Yes. Tick the NDA box and we send a mutual NDA before the call. We are also happy to sign yours.'],
  ['Do you work with early-stage startups or only enterprises?', 'Both. We work with early-stage AI startups and with established enterprises, and the engagement is sized to match.'],
  ['We are not sure we are ready for AI. Is a call still useful?', 'Yes. We offer a free AI readiness assessment that reviews your stack, workflows and goals and tells you plainly where AI would and would not help.'],
  ['Which platforms do you build on?', 'AWS, Azure and Google Cloud, with generative AI, LLM integration and custom application development on top.'],
];

export default {
  slug: 'contact',
  title: 'Contact',
  description: 'Book a technical scoping call with Techlio. Reply within 24 hours, NDA available, offices in the USA and Pakistan.',
  body: `
<section class="page-hero">
  <div class="wrap">
    <h1>Bring the problem. Leave with a plan.</h1>
    <p class="lede">Send a few lines about what you are building. Within 24 hours a senior engineer replies with questions, a first read on approach and times for a call.</p>
    <div class="actions">
      <a class="btn btn-primary" href="#book">Book a technical scoping call</a>
      <a class="btn btn-ghost" href="mailto:${site.email}">${site.email}</a>
      <a class="btn btn-ghost" href="tel:${site.phoneHref}">${site.phone}</a>
    </div>
  </div>
</section>
${bookingForm()}
${reviews()}
<section class="section tint">
  <div class="wrap">
    <div class="section-head"><h2>Before you book</h2></div>
    <div class="faq">
      ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>
`,
};
