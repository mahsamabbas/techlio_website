/* Navigation toggle and scoping form. */
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
  var endpoint = form.getAttribute('data-endpoint');
  var to = form.getAttribute('data-email');

  // Preselect the engagement from ?interest=...
  var interest = new URLSearchParams(location.search).get('interest');
  if (interest && form.elements.interest) {
    Array.prototype.forEach.call(form.elements.interest.options, function (o) {
      if (o.value === interest) form.elements.interest.value = interest;
    });
  }

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status is-' + kind;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus('Fill in your name, work email, project, budget range and how you found us, then request the call again.', 'error');
      return;
    }
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.nda = form.elements.nda.checked ? 'Yes, send a mutual NDA first' : 'Not needed';
    if (data.website) return; // honeypot

    if (endpoint) {
      setStatus('Sending your request…', 'pending');
      fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          form.reset();
          setStatus('Scoping call requested. A senior engineer replies within 24 hours.', 'ok');
        })
        .catch(function () {
          setStatus('The request did not go through. Email ' + to + ' and we will pick it up from there.', 'error');
        });
      return;
    }

    var lines = [
      'Name: ' + data.name,
      'Work email: ' + data.email,
      'Company: ' + (data.company || '-'),
      'Phone: ' + (data.phone ? data.code + ' ' + data.phone : '-'),
      'Start with: ' + data.interest,
      'Budget range: ' + data.budget,
      'Found us via: ' + data.source,
      'NDA: ' + data.nda,
      '',
      'Project:',
      data.project,
    ];
    location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Technical scoping call: ' + (data.company || data.name)) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    setStatus('Your email app opened with the request drafted. Send it and a senior engineer replies within 24 hours. No email app? Write to ' + to + '.', 'ok');
  });
})();
