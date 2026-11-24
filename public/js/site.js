/* Navigation toggle and booking form. */
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
        setStatus('Scoping call requested. A senior engineer replies within 24 hours.', 'ok');
      })
      .catch(function () { draftEmail(data); })
      .then(function () { button.disabled = false; });
  });
})();
