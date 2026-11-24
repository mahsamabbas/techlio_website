import { cases, industries } from '../site.mjs';
import { closing, ctaButton } from '../layout.mjs';

export default {
  slug: 'case-studies',
  title: 'Case studies',
  description: 'Products engineered by Techlio: FundMyDeductible, Convert, Vofspace and Spin Lab, across financial services, e-commerce, wellness and logistics.',
  body: `
<section class="page-hero">
  <div class="wrap">
    <a class="back" href="index.html">Back to home</a>
    <h1>Products we engineered, and what they do now.</h1>
    <p class="lede">Four platforms built with client teams over six to twelve months each.</p>
    <div class="case-index">
      ${cases
        .map(
          (c) => `<a class="case-index-card" href="#${c.id}">
        <span class="case-tag">${c.industry}</span>
        <strong>${c.name}</strong>
        <span>${c.headline}</span>
        <span class="chips-inline">${c.services.join(', ')}</span>
      </a>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

${closing('Building something in the same territory?', 'Tell us about it and we will share how we would approach the architecture.')}

${cases
  .map(
    (c, i) => `<section class="section case${i % 2 ? ' tint' : ''}" id="${c.id}">
  <div class="wrap">
    <a class="back" href="#main">Back to all case studies</a>
    <p class="case-tag">${c.industry}</p>
    <h2>${c.name}</h2>
    <p class="lede">${c.headline}.</p>
    <p class="chips-inline">${c.services.join(', ')}</p>
    <p class="case-headline-metric"><strong>${c.metric.value}</strong> ${c.metric.label}</p>
    <div class="case-body">
      <div class="blocks blocks-3">
        <div class="block"><h3>The product</h3><p>${c.summary}</p></div>
        <div class="block"><h3>The engagement</h3><p>${c.duration} with a dedicated Techlio team of ${c.team.replace(' people', '')}.</p></div>
        <div class="block"><h3>Industry</h3><p>${c.industry}.</p></div>
      </div>
      <h3 class="case-sub">What the platform does</h3>
      <ul class="ticks ticks-grid">${c.capabilities.map((x) => `<li>${x}</li>`).join('')}</ul>
      <p class="actions">${ctaButton('Book a technical scoping call')}</p>
    </div>
  </div>
</section>`
  )
  .join('\n')}

<section class="section">
  <div class="wrap">
    <div class="section-head"><h2>Industries we have shipped in</h2></div>
    <ul class="chips chips-large">${industries.map((x) => `<li>${x}</li>`).join('')}</ul>
  </div>
</section>
`,
};
