/* Interactive pipeline diagrams. Renders each <figure data-diagram="id"> from window.TL_DIAGRAMS.
   - Click or press Enter on a node to inspect it.
   - Pick a scenario and run it to trace a request through the system.
   Lays out horizontally on wide screens and vertically on narrow ones. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var narrow = window.matchMedia('(max-width: 760px)');

  function svg(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(name, attrs, parent, text) {
    var n = document.createElement(name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }

  function computeLayout(cfg, vertical) {
    var pos = {}, labels = [], W, H;
    if (!vertical) {
      W = 1120;
      var nw = 172, nh = 58, gap = 24, top = 46;
      var colW = W / cfg.columns.length;
      var maxN = Math.max.apply(null, cfg.columns.map(function (c) { return c.nodes.length; }));
      var bodyH = maxN * nh + (maxN - 1) * gap;
      H = top + bodyH + 24;
      cfg.columns.forEach(function (col, ci) {
        var cx = colW * ci + colW / 2;
        labels.push({ x: cx, y: 20, text: col.label, anchor: 'middle' });
        var colH = col.nodes.length * nh + (col.nodes.length - 1) * gap;
        var y0 = top + (bodyH - colH) / 2;
        col.nodes.forEach(function (n, ni) {
          pos[n.id] = { x: cx - nw / 2, y: y0 + ni * (nh + gap), w: nw, h: nh };
        });
      });
    } else {
      W = 360;
      var vw = 164, vh = 52, hgap = 16, rowGap = 10, bandGap = 34, y = 6;
      cfg.columns.forEach(function (col) {
        labels.push({ x: 8, y: y + 12, text: col.label, anchor: 'start' });
        y += 20;
        for (var i = 0; i < col.nodes.length; i += 2) {
          var row = col.nodes.slice(i, i + 2);
          var rowW = row.length * vw + (row.length - 1) * hgap;
          var x0 = (W - rowW) / 2;
          row.forEach(function (n, ri) {
            pos[n.id] = { x: x0 + ri * (vw + hgap), y: y, w: vw, h: vh };
          });
          y += vh + rowGap;
        }
        y += bandGap - rowGap;
      });
      H = y - bandGap + 12;
    }
    return { pos: pos, labels: labels, W: W, H: H };
  }

  function edgePath(a, b, vertical) {
    var x1, y1, x2, y2, d;
    var horizontalLink = vertical ? !(b.y >= a.y + a.h || a.y >= b.y + b.h) : (b.x >= a.x + a.w || a.x >= b.x + b.w);
    if (horizontalLink) {
      var fwd = b.x >= a.x;
      x1 = fwd ? a.x + a.w : a.x; y1 = a.y + a.h / 2;
      x2 = fwd ? b.x : b.x + b.w; y2 = b.y + b.h / 2;
      d = (x2 - x1) / 2;
      return 'M' + x1 + ' ' + y1 + ' C' + (x1 + d) + ' ' + y1 + ' ' + (x2 - d) + ' ' + y2 + ' ' + x2 + ' ' + y2;
    }
    var down = b.y >= a.y;
    x1 = a.x + a.w / 2; y1 = down ? a.y + a.h : a.y;
    x2 = b.x + b.w / 2; y2 = down ? b.y : b.y + b.h;
    d = (y2 - y1) / 2;
    return 'M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + (y1 + d) + ' ' + x2 + ' ' + (y2 - d) + ' ' + x2 + ' ' + y2;
  }

  function mount(fig) {
    var id = fig.getAttribute('data-diagram');
    var cfg = (window.TL_DIAGRAMS || {})[id];
    if (!cfg) return;
    var nodeIndex = {};
    cfg.columns.forEach(function (c) { c.nodes.forEach(function (n) { nodeIndex[n.id] = n; }); });

    var compact = fig.hasAttribute('data-compact');
    var state = { scenario: cfg.scenarios[0], selected: null, runId: 0, vertical: compact || narrow.matches };
    var els = { nodes: {}, edges: {} };

    // Chrome
    var head = h('div', { class: 'pipe-head' }, fig);
    h('p', { class: 'pipe-title' }, head, cfg.title);
    var controls = h('div', { class: 'pipe-controls' }, head);
    var tabs = h('div', { class: 'pipe-tabs', role: 'group', 'aria-label': 'Scenario' }, controls);
    cfg.scenarios.forEach(function (s) {
      var b = h('button', { type: 'button', class: 'pipe-tab', 'aria-pressed': String(s === state.scenario) }, tabs, s.label);
      b.addEventListener('click', function () {
        state.scenario = s;
        Array.prototype.forEach.call(tabs.children, function (t) { t.setAttribute('aria-pressed', String(t === b)); });
        run();
      });
    });
    var runBtn = h('button', { type: 'button', class: 'pipe-run' }, controls, 'Run trace');
    runBtn.addEventListener('click', run);

    var stage = h('div', { class: 'pipe-stage' }, fig);
    var panels = h('div', { class: 'pipe-panels' }, fig);
    var inspector = h('div', { class: 'pipe-inspector', 'aria-live': 'polite' }, panels);
    var trace = h('div', { class: 'pipe-trace' }, panels);
    h('p', { class: 'pipe-panel-label' }, trace, 'Trace (illustrative)');
    var log = h('ol', { class: 'pipe-log', 'aria-live': 'polite' }, trace);
    var outcome = h('p', { class: 'pipe-outcome' }, trace);

    function showInspector(nodeId) {
      inspector.textContent = '';
      state.selected = nodeId;
      inspector.classList.toggle('has-detail', Boolean(nodeId));
      Object.keys(els.nodes).forEach(function (k) { els.nodes[k].classList.toggle('is-selected', k === nodeId); });
      if (!nodeId) {
        h('p', { class: 'pipe-panel-label' }, inspector, 'Inspect a stage');
        h('p', { class: 'pipe-hint' }, inspector, 'Select any box in the diagram to see what happens there and how we engineer it.');
        return;
      }
      var d = cfg.details[nodeId];
      h('p', { class: 'pipe-panel-label' }, inspector, 'Stage');
      h('p', { class: 'pipe-detail-title' }, inspector, d.title);
      h('p', { class: 'pipe-detail-body' }, inspector, d.body);
      var ul = h('ul', { class: 'pipe-detail-points' }, inspector);
      d.points.forEach(function (p) { h('li', {}, ul, p); });
    }

    function draw() {
      stage.textContent = '';
      els = { nodes: {}, edges: {} };
      var L = computeLayout(cfg, state.vertical);
      var root = svg('svg', { viewBox: '0 0 ' + L.W + ' ' + L.H, class: 'pipe-svg', role: 'group', 'aria-label': cfg.title }, stage);
      L.labels.forEach(function (l) {
        svg('text', { x: l.x, y: l.y, class: 'pipe-col', 'text-anchor': l.anchor }, root).textContent = l.text;
      });
      var gEdges = svg('g', {}, root);
      cfg.edges.forEach(function (e) {
        var p = svg('path', { d: edgePath(L.pos[e[0]], L.pos[e[1]], state.vertical), class: 'pipe-edge' }, gEdges);
        els.edges[e[0] + '>' + e[1]] = p;
      });
      var dot = svg('circle', { r: 5, class: 'pipe-dot', cx: -20, cy: -20 }, root);
      els.dot = dot;
      Object.keys(L.pos).forEach(function (nid) {
        var p = L.pos[nid], n = nodeIndex[nid];
        var g = svg('g', { class: 'pipe-node', tabindex: 0, role: 'button', 'aria-label': n.label + ' ' + n.sub, transform: 'translate(' + p.x + ' ' + p.y + ')' }, root);
        svg('rect', { width: p.w, height: p.h, rx: 10 }, g);
        svg('rect', { x: 6, y: 10, width: 3, height: p.h - 20, rx: 1.5, class: 'pipe-node-bar' }, g);
        svg('text', { x: 16, y: p.h / 2 - 4, class: 'pipe-node-label' }, g).textContent = n.label;
        svg('text', { x: 16, y: p.h / 2 + 13, class: 'pipe-node-sub' }, g).textContent = n.sub;
        g.addEventListener('click', function () { showInspector(nid); });
        g.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); showInspector(nid); }
        });
        els.nodes[nid] = g;
      });
      showInspector(state.selected);
    }

    function clearStates() {
      Object.keys(els.nodes).forEach(function (k) { els.nodes[k].classList.remove('is-ok', 'is-review', 'is-blocked', 'is-verified'); });
      Object.keys(els.edges).forEach(function (k) { els.edges[k].classList.remove('is-lit'); });
      els.dot.setAttribute('cx', -20); els.dot.setAttribute('cy', -20);
      log.textContent = ''; outcome.textContent = ''; outcome.className = 'pipe-outcome';
    }

    function travel(from, to, myRun) {
      return new Promise(function (resolve) {
        var path = els.edges[from + '>' + to], reverse = false;
        if (!path) { path = els.edges[to + '>' + from]; reverse = true; }
        if (!path) return resolve();
        path.classList.add('is-lit');
        if (reduced.matches) return setTimeout(resolve, 120);
        var len = path.getTotalLength(), start = null, dur = 460;
        function frame(t) {
          if (myRun !== state.runId) return resolve();
          if (start === null) start = t;
          var k = Math.min(1, (t - start) / dur);
          var pt = path.getPointAtLength(reverse ? len * (1 - k) : len * k);
          els.dot.setAttribute('cx', pt.x); els.dot.setAttribute('cy', pt.y);
          if (k < 1) requestAnimationFrame(frame); else resolve();
        }
        requestAnimationFrame(frame);
      });
    }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    async function run() {
      var myRun = ++state.runId;
      clearStates();
      var steps = state.scenario.steps, last = 'ok';
      for (var i = 0; i < steps.length; i++) {
        if (myRun !== state.runId) return;
        var s = steps[i];
        if (i > 0) await travel(steps[i - 1].node, s.node, myRun);
        if (myRun !== state.runId) return;
        last = s.state || 'ok';
        els.nodes[s.node].classList.add('is-' + last);
        var li = h('li', { class: 'is-' + last }, log);
        h('span', { class: 'pipe-log-node' }, li, nodeIndex[s.node].label);
        h('span', { class: 'pipe-log-msg' }, li, s.log);
        log.scrollTop = log.scrollHeight;
        await wait(reduced.matches ? 60 : 240);
      }
      if (myRun !== state.runId) return;
      els.dot.setAttribute('cx', -20); els.dot.setAttribute('cy', -20);
      outcome.textContent = 'Outcome: ' + state.scenario.outcome;
      outcome.className = 'pipe-outcome is-' + last;
    }

    draw();
    narrow.addEventListener('change', function (e) { state.vertical = compact || e.matches; state.runId++; draw(); clearStates(); });

    if (fig.hasAttribute('data-autorun') && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); run(); }
      }, { threshold: 0.35 });
      io.observe(stage);
    }
  }

  document.querySelectorAll('[data-diagram]').forEach(mount);
})();
