import { site, cases } from './site.mjs';
import { esc, ctaButton, diagram } from './layout.mjs';

const pad = (n) => String(n).padStart(2, '0');

/** Inner-page hero: optional back link, title, intro, two CTAs, optional diagram. */
export const pageHero = ({ back, kicker, title, intro, primary = site.cta.label, secondary, diagramId, caption }) => `
<section class="page-hero">
  <div class="wrap">
    ${back ? `<a class="back" href="${back.href}">Back to ${back.label}</a>` : ''}
    ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
    <h1>${title}</h1>
    <p class="lede">${intro}</p>
    <div class="actions">
      ${ctaButton(primary)}
      ${secondary ? `<a class="btn btn-ghost" href="${secondary.href}">${secondary.label}</a>` : ''}
    </div>
    ${diagramId ? diagram(diagramId, { caption }) : ''}
  </div>
</section>`;

/** Numbered cards. Use only where the items are an ordered sequence. */
export const numbered = (items, cls = '') => `
<ol class="steps ${cls}">
  ${items
    .map(
      (it, i) => `<li class="step">
    <span class="step-n" aria-hidden="true">${pad(i + 1)}</span>
    ${it.when ? `<span class="step-when">${it.when}</span>` : ''}
    <h3>${it.title}</h3>
    <p>${it.text}</p>
    ${it.list ? `<ul class="ticks">${it.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
  </li>`
    )
    .join('\n  ')}
</ol>`;

export const blocks = (items, cols = 3) => `
<div class="blocks blocks-${cols}">
  ${items.map((it) => `<div class="block"><h3>${it.title}</h3><p>${it.text}</p></div>`).join('\n  ')}
</div>`;

export const caseCard = (c) => `
<article class="case-card">
  <p class="case-tag">${c.industry}</p>
  <h3><a href="case-studies.html#${c.id}">${c.name}</a></h3>
  <p>${c.headline}.</p>
  <p class="case-metric"><strong>${c.metric.value}</strong> ${c.metric.label}</p>
  <dl class="facts">
    <div><dt>Duration</dt><dd>${c.duration}</dd></div>
    <div><dt>Team</dt><dd>${c.team}</dd></div>
  </dl>
  <a class="more" href="case-studies.html#${c.id}">Read the ${c.name} case study</a>
</article>`;

export const caseCards = (ids) => `
<div class="case-grid case-grid-${ids.length}">
  ${ids.map((id) => caseCard(cases.find((c) => c.id === id))).join('\n  ')}
</div>`;

export const section = ({ id, title, intro, body, tone = '' }) => `
<section class="section ${tone}"${id ? ` id="${id}"` : ''}>
  <div class="wrap">
    <div class="section-head">
      <h2>${title}</h2>
      ${intro ? `<p>${intro}</p>` : ''}
    </div>
    ${body}
  </div>
</section>`;

/** Proof badges, plus real reviews when site.reviews has entries. */
export const reviews = () => `
<section class="section reviews">
  <div class="wrap">
    <div class="section-head">
      <h2>Proof you can check</h2>
      <p>We would rather you verify a number than take our word for it.</p>
    </div>
    <div class="badges">
      <div class="badge-card"><strong>Top Rated Plus</strong><span>Our standing on Upwork, where every contract and review is public</span></div>
      <div class="badge-card"><strong>$700K+</strong><span>Verified client delivery</span></div>
      <div class="badge-card"><strong>95%</strong><span>Client retention across 70+ clients</span></div>
    </div>
    ${
      site.reviews.length
        ? `<div class="review-grid">${site.reviews
            .map(
              (r) => `<figure class="review"><blockquote>${esc(r.quote)}</blockquote><figcaption>${esc(r.name)}, ${esc(r.role)}, ${esc(r.company)}<span>${esc(r.source)}</span></figcaption></figure>`
            )
            .join('')}</div>`
        : ''
    }
  </div>
</section>`;

const codes = ['+1', '+44', '+971', '+92', '+49', '+33', '+31', '+34', '+39', '+46', '+41', '+353', '+61', '+65', '+966', 'Other'];

/** Booking form. Submits to site.formEndpoint when set, otherwise drafts an email. */
export const bookingForm = () => `
<section class="section booking" id="book">
  <div class="wrap booking-grid">
    <div class="booking-copy">
      <h2>Tell us what you are building</h2>
      <p>A senior engineer reads every request and replies within 24 hours with questions, a first read on approach, and times for a 30-minute scoping call.</p>
      <ul class="ticks">
        <li>Reply within 24 hours</li>
        <li>Mutual NDA before the call if you want one</li>
        <li>You talk to an engineer, not a salesperson</li>
        <li>You leave the call with a written scope outline</li>
      </ul>
      <dl class="contact-list">
        <div><dt>Email</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
        <div><dt>Phone</dt><dd><a href="tel:${site.phoneHref}">${site.phone}</a></dd></div>
        ${site.offices.map((o) => `<div><dt>${o.country}</dt><dd>${o.address}</dd></div>`).join('')}
      </dl>
    </div>
    <form class="form" id="scope-form" data-email="${site.email}" data-endpoint="${site.formEndpoint}" novalidate>
      <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-company">Company <span class="opt">optional</span></label><input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field">
        <label for="f-phone">Phone <span class="opt">optional</span></label>
        <div class="phone">
          <select name="code" aria-label="Country code">${codes.map((c) => `<option>${c}</option>`).join('')}</select>
          <input id="f-phone" name="phone" type="tel" autocomplete="tel-national">
        </div>
      </div>
      <div class="field field-wide"><label for="f-project">What are you building, and where is it stuck?</label><textarea id="f-project" name="project" rows="5" required></textarea></div>
      <div class="field">
        <label for="f-interest">Where should we start?</label>
        <select id="f-interest" name="interest">
          <option value="Not sure yet">Not sure yet</option>
          <option value="14-Day AI &amp; Architecture Sprint">14-Day AI &amp; Architecture Sprint</option>
          <option value="Legacy-to-AI Modernization">Legacy-to-AI Modernization</option>
          <option value="Advisory &amp; architecture">Advisory and architecture</option>
          <option value="Co-build with embedded engineers">Co-build with embedded engineers</option>
          <option value="End-to-end product delivery">End-to-end product delivery</option>
        </select>
      </div>
      <div class="field">
        <label for="f-budget">Budget range</label>
        <select id="f-budget" name="budget" required>
          <option value="">Choose a range</option>
          <option>Under $10K</option><option>$10K to $25K</option><option>$25K to $50K</option>
          <option>$50K to $100K</option><option>$100K or more</option><option>Not set yet</option>
        </select>
      </div>
      <div class="field field-wide">
        <label for="f-source">How did you find us?</label>
        <select id="f-source" name="source" required>
          <option value="">Choose one</option>
          <option>Search engine</option><option>AI assistant</option><option>Upwork</option>
          <option>LinkedIn</option><option>Referral</option><option>Other</option>
        </select>
      </div>
      <label class="check field-wide"><input type="checkbox" name="nda"> Send a mutual NDA before we talk</label>
      <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="field-wide form-foot">
        <button class="btn btn-primary" type="submit">Request scoping call</button>
        <p id="scope-status" class="form-status" role="status"></p>
      </div>
    </form>
  </div>
</section>`;
