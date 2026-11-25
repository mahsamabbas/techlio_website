/* Website chat assistant: a button in the bottom-right corner that opens a small chat panel.
   The panel is only built when the visitor first opens it, so it costs nothing on page load. */
(function () {
  'use strict';
  var root = document.getElementById('tl-chat');
  if (!root) return;
  var toggle = root.querySelector('.chat-toggle');
  var panel = null, log = null, input = null, form = null, busy = false, history = [];
  var KEY = 'tl-chat-v1';
  try { history = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { history = []; }
  var SUGGESTIONS = ['What does Techlio build?', 'Can you automate a workflow with n8n?', 'How do I start a project?'];

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-30))); } catch (e) {} }

  // Turns the assistant's reply into safe HTML: text is escaped first, then links to this site and bold are allowed.
  function render(text) {
    var esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    esc = esc.replace(/\[([^\]]{1,80})\]\((\/[a-z0-9\-\/#]*|https:\/\/techlio\.co\/[a-z0-9\-\/#]*)\)/gi, '<a href="$2">$1</a>');
    esc = esc.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return esc.split(/\n{2,}/).map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function add(role, text) {
    var m = el('div', 'chat-msg chat-' + role);
    if (role === 'assistant') m.innerHTML = render(text); else m.textContent = text;
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    return m;
  }
  function note(text) { var n = el('p', 'chat-note', text); log.appendChild(n); log.scrollTop = log.scrollHeight; }

  function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    var chips = panel.querySelector('.chat-chips'); if (chips) chips.remove();
    add('user', text); history.push({ role: 'user', content: text }); save();
    input.value = ''; busy = true; form.classList.add('is-busy');
    var wait = el('div', 'chat-msg chat-assistant chat-wait'); wait.innerHTML = '<span></span><span></span><span></span>';
    wait.setAttribute('aria-label', 'The assistant is writing'); log.appendChild(wait); log.scrollTop = log.scrollHeight;
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, data: d }; }); })
      .then(function (res) {
        wait.remove();
        if (res.data && res.data.reply) { add('assistant', res.data.reply); history.push({ role: 'assistant', content: res.data.reply }); save(); }
        else if (res.status === 429) note('That was a lot of messages in a short time. Please wait a minute and try again.');
        else note('The assistant is not available right now. You can book a scoping call or email us instead.');
      })
      .catch(function () { wait.remove(); note('Could not reach the assistant. Check your connection and try again.'); })
      .then(function () { busy = false; form.classList.remove('is-busy'); input.focus(); });
  }

  function build() {
    panel = el('section', 'chat-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Chat with the Techlio assistant');
    var head = el('header', 'chat-head');
    var title = el('div'); title.appendChild(el('strong', null, 'Techlio assistant')); title.appendChild(el('span', null, 'AI answers from this website'));
    var close = el('button', 'chat-close'); close.type = 'button'; close.setAttribute('aria-label', 'Close chat'); close.innerHTML = '&times;';
    head.appendChild(title); head.appendChild(close);
    log = el('div', 'chat-log'); log.setAttribute('aria-live', 'polite');
    form = el('form', 'chat-form');
    input = el('textarea'); input.rows = 1; input.maxLength = 600; input.placeholder = 'Ask about our services or work'; input.setAttribute('aria-label', 'Your message');
    var sendBtn = el('button', null, 'Send'); sendBtn.type = 'submit';
    form.appendChild(input); form.appendChild(sendBtn);
    var foot = el('p', 'chat-foot');
    foot.innerHTML = 'This is an AI assistant and can be wrong. Please do not share sensitive details. <a href="' + (root.getAttribute('data-privacy') || '/privacy/') + '">Privacy</a> · <a href="/contact/#book">Talk to a person</a>';
    panel.appendChild(head); panel.appendChild(log); panel.appendChild(form); panel.appendChild(foot);
    root.appendChild(panel);

    add('assistant', 'Hi. I can answer questions about what Techlio builds, the technologies we use and our client work. What are you looking into?');
    if (history.length) history.forEach(function (m) { add(m.role, m.content); });
    else {
      var chips = el('div', 'chat-chips');
      SUGGESTIONS.forEach(function (s) { var b = el('button', null, s); b.type = 'button'; b.addEventListener('click', function () { send(s); }); chips.appendChild(b); });
      log.appendChild(chips);
    }
    close.addEventListener('click', function () { open(false); });
    form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); } });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
  }

  function open(show) {
    if (show && !panel) build();
    if (!panel) return;
    root.classList.toggle('is-open', show);
    toggle.setAttribute('aria-expanded', String(show));
    if (show) { input.focus(); log.scrollTop = log.scrollHeight; } else toggle.focus();
  }
  toggle.addEventListener('click', function () { open(!root.classList.contains('is-open')); });
})();
