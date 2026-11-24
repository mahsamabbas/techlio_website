import { site } from './site.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const mark = `<svg class="mark" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
  <rect x="1" y="1" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M7 9h14M14 9v11" fill="none" stroke="currentColor" stroke-width="2.6"/>
  <rect x="17.5" y="16.5" width="5" height="5" class="mark-dot"/>
</svg>`;

export const ctaButton = (label = site.cta.label, cls = 'btn btn-primary') =>
  `<a class="${cls}" href="${site.cta.href}">${label}</a>`;

/** Closing call-to-action band shared by most pages. */
export const closing = (heading, text) => `
<section class="closing">
  <div class="wrap closing-grid">
    <div>
      <h2>${heading}</h2>
      <p>${text}</p>
    </div>
    <div class="closing-actions">
      ${ctaButton()}
      <p class="fine">We reply within 24 hours. A mutual NDA is available before the first call.</p>
    </div>
  </div>
</section>`;

/** Mount point for an interactive pipeline diagram (see assets/js/pipeline.js). */
export const diagram = (id, { autorun = false, caption = '' } = {}) => `
<figure class="pipe" data-diagram="${id}"${autorun ? ' data-autorun' : ''}>
  <noscript><p class="pipe-noscript">This diagram is interactive and needs JavaScript. ${esc(caption)}</p></noscript>
  ${caption ? `<figcaption class="sr-only">${esc(caption)}</figcaption>` : ''}
</figure>`;

const header = (slug) => `
<a class="skip" href="#main">Skip to content</a>
<div class="utility">
  <div class="wrap utility-row">
    <span>Delivering across the ${site.regions}</span>
    <span class="utility-links">
      <a href="mailto:${site.email}">${site.email}</a>
      <a href="tel:${site.phoneHref}">${site.phone}</a>
      <a href="${site.social.linkedin}" rel="noopener">LinkedIn</a>
      <a href="${site.social.x}" rel="noopener">X</a>
    </span>
  </div>
</div>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="index.html" aria-label="${site.name} home">${mark}<span>${site.name}</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <details class="nav-menu">
        <summary>Services</summary>
        <div class="nav-panel">
          <p class="nav-panel-h">Practices</p>
          ${site.services.map((n) => `<a href="${n.href}"${n.href === slug + '.html' ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n          ')}
          <p class="nav-panel-h">Fixed-scope offers</p>
          ${site.offers.map((n) => `<a href="${n.href}"${n.href === slug + '.html' ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n          ')}
        </div>
      </details>
      ${site.nav
        .map((n) => `<a href="${n.href}"${n.href === slug + '.html' ? ' aria-current="page"' : ''}>${n.label}</a>`)
        .join('\n      ')}
      <a class="btn btn-primary btn-small" href="${site.cta.href}">Book a scoping call</a>
    </nav>
  </div>
</header>`;

const footer = () => `
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <a class="brand" href="index.html" aria-label="${site.name} home">${mark}<span>${site.name}</span></a>
      <p>AI-ready engineering firm. We design, build and run AI agents, automations and SaaS platforms for startups and enterprises.</p>
      ${ctaButton(site.cta.label, 'btn btn-light')}
    </div>
    <div>
      <h2 class="footer-h">Services</h2>
      <ul>
        ${[...site.services.map((n) => ({ href: n.href, label: n.short })), ...site.offers].map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Company</h2>
      <ul>
        ${site.nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
        <li><a href="${site.legal.careers}">Careers</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Contact</h2>
      <ul>
        <li><a href="mailto:${site.email}">${site.email}</a></li>
        <li><a href="tel:${site.phoneHref}">${site.phone}</a></li>
        <li><a href="${site.social.linkedin}" rel="noopener">LinkedIn</a> / <a href="${site.social.x}" rel="noopener">X</a></li>
      </ul>
      ${site.offices
        .map((o) => `<address><strong>${o.country}</strong><br>${o.address}</address>`)
        .join('\n      ')}
    </div>
  </div>
  <div class="wrap footer-legal">
    <span>${site.name} 2026 All Rights Reserved</span>
    <span><a href="${site.legal.terms}">Terms of use</a><a href="${site.legal.privacy}">Privacy Policy</a></span>
  </div>
</footer>`;

export function layout(page) {
  const title = page.slug === 'index' ? page.title : `${page.title} | ${site.name}`;
  const canonical = `${site.url}/${page.slug === 'index' ? '' : page.slug + '.html'}`;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    sameAs: Object.values(site.social),
    address: site.offices.map((o) => ({ '@type': 'PostalAddress', streetAddress: o.address, addressCountry: o.country })),
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta name="theme-color" content="#12161c">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/main.css">
<script type="application/ld+json">${JSON.stringify(org)}</script>
</head>
<body data-page="${page.slug}">
${header(page.slug)}
<main id="main">
${page.body}
</main>
${footer()}
${page.diagrams ? '<script src="assets/js/diagrams.js" defer></script>\n<script src="assets/js/pipeline.js" defer></script>' : ''}
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
}
