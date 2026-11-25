/* Navigation, motion, case study filters and the booking form. */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }


  // Services menu: close on outside click, Escape, or after choosing a link.
  var menu = document.querySelector('.nav-menu');
  if (menu) {
    document.addEventListener('click', function (ev) { if (menu.open && !menu.contains(ev.target)) menu.open = false; });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
  }

  // Header shadow and reading progress bar.
  var header = document.querySelector('.site-header');
  var bar = document.querySelector('.progress');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal: only elements that start below the fold, so nothing flashes on load.
  if (!calm && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section-head, .svc-card, .info-card, .case-row, .case-card, .case-item, .phase, .timeline > li, .path, .badge-card, .review, .form, .booking-copy, .cta-banner, .proof-banner, .pains li, .ticks-grid li, .rail li, .dark-panel, .leader, .faq details, .doc-section');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(targets, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(i, 5) * 70 + 'ms');
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // Count-up for headline numbers.
  if (!calm && 'IntersectionObserver' in window) {
    var counters = document.querySelectorAll('.stat strong, .badge-card strong, .metric strong, .case-hero-metrics strong');
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, text = el.textContent, m = text.match(/^(\D*)([\d,]+)(.*)$/);
        if (!m) return;
        var end = parseInt(m[2].replace(/,/g, ''), 10);
        if (!end || end < 3) return;
        var commas = m[2].indexOf(',') > -1, start = null, dur = 1100;
        el.style.fontVariantNumeric = 'tabular-nums';
        function step(t) {
          if (start === null) start = t;
          var k = Math.min(1, (t - start) / dur), eased = 1 - Math.pow(1 - k, 3), v = Math.round(end * eased);
          el.textContent = m[1] + (commas ? v.toLocaleString('en-US') : v) + m[3];
          if (k < 1) requestAnimationFrame(step); else el.textContent = text;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
  }

  // Case study filters.
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    var items = document.querySelectorAll('.case-item, .filter-item'), empty = document.querySelector('.filter-empty');
    Array.prototype.forEach.call(filters, function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter'), shown = 0;
        Array.prototype.forEach.call(filters, function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        Array.prototype.forEach.call(items, function (it) {
          var match = f === 'all' || it.getAttribute('data-services').split('|').indexOf(f) > -1;
          it.hidden = !match; if (match) { shown++; it.classList.add('is-in'); }
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  // Cookie choice: asked once, for visitors in Europe and the UK, and remembered on this device.
  var consent = document.getElementById('consent');
  if (consent) {
    var choice = null, tz = '';
    try { choice = localStorage.getItem('tl-consent'); } catch (e) {}
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (!choice && /^(Europe|Atlantic\/(Reykjavik|Canary|Madeira|Faroe|Azores))/.test(tz)) consent.hidden = false;
    consent.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-consent]');
      if (!btn) return;
      var yes = btn.getAttribute('data-consent') === 'yes';
      try { localStorage.setItem('tl-consent', yes ? 'yes' : 'no'); } catch (e) {}
      window.dataLayer = window.dataLayer || [];
      (function () { window.dataLayer.push(arguments); })('consent', 'update', { analytics_storage: yes ? 'granted' : 'denied' });
      consent.hidden = true;
    });
  }

  // Booking links: scroll to the form when it is on this page, otherwise open it in a dialog. No page load either way.
  var bookSection = document.getElementById('book');
  var bookDialog = document.getElementById('book-dialog');
  function focusForm(root) {
    var first = root.querySelector('input:not([type="hidden"]):not(.hp)');
    if (first) try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); }
  }
  if (bookDialog && bookDialog.showModal) {
    bookDialog.addEventListener('click', function (ev) {
      if (ev.target === bookDialog || ev.target.closest('[data-close-dialog]')) bookDialog.close();
    });
    bookDialog.addEventListener('close', function () { document.documentElement.classList.remove('dialog-open'); });
  }
  document.addEventListener('click', function (ev) {
    var link = ev.target.closest && ev.target.closest('a[href$="#book"]');
    if (!link || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
    if (bookSection) {
      ev.preventDefault();
      if (nav && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
      bookSection.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      bookSection.classList.remove('is-target');
      setTimeout(function () { bookSection.classList.add('is-target'); focusForm(bookSection); }, calm ? 0 : 650);
    } else if (bookDialog && bookDialog.showModal) {
      ev.preventDefault();
      if (nav && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
      document.documentElement.classList.add('dialog-open');
      bookDialog.showModal();
      bookDialog.scrollTop = 0;
      focusForm(bookDialog);
    }
  });

  var form = document.getElementById('scope-form');
  if (!form) return;
  var status = document.getElementById('scope-status');
  var button = form.querySelector('button[type="submit"]');
  var endpoint = form.getAttribute('data-endpoint');
  var to = form.getAttribute('data-email');

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status is-' + kind;
  }

  // Last resort: open the visitor's mail app with the request drafted.
  function draftEmail(data) {
    var lines = [
      'Name: ' + data.name,
      'Work email: ' + data.email,
      'Company: ' + (data.company || '-'),
      'Phone: ' + (data.phone ? data.code + ' ' + data.phone : '-'),
      'Start with: ' + data.interest,
      'Budget range: ' + data.budget,
      'Found us via: ' + data.source,
      'NDA: ' + (data.nda ? 'Yes, send a mutual NDA first' : 'Not needed'),
      '',
      'Project:',
      data.project,
    ];
    location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Technical scoping call: ' + (data.company || data.name)) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    setStatus('We could not send the form, so your email app opened with the request drafted. Send it and a senior engineer replies within 24 hours. No email app? Write to ' + to + '.', 'error');
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus('Fill in your name, work email, project, budget range and how you found us, then request the call again.', 'error');
      return;
    }
    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) { data[k] = v; });
    if (data.website) return; // honeypot

    setStatus('Sending your request…', 'pending');
    button.disabled = true;
    var request = endpoint
      ? fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
      : fetch('/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd).toString() });

    request
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        form.reset();
        window.dataLayer = window.dataLayer || [];
        (function () { window.dataLayer.push(arguments); })('event', 'generate_lead', { form_name: 'scoping-call', lead_source: data.source || '', lead_interest: data.interest || '' });
        window.dataLayer.push({ event: 'scoping_call_requested', form_name: 'scoping-call', lead_source: data.source || '', lead_interest: data.interest || '' });
        setStatus('Scoping call requested. A senior engineer replies within 24 hours.', 'ok');
      })
      .catch(function () { draftEmail(data); })
      .then(function () { button.disabled = false; });
  });
})();
