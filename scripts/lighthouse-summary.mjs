// Prints a one-line Lighthouse summary per page, plus the audits that failed, from the reports LHCI just collected.
import { readdirSync, readFileSync } from 'node:fs';
const dir = '.lighthouseci';
// Each page is tested several times; report the run with the median performance score, since single runs are noisy.
const all = readdirSync(dir).filter((x) => x.startsWith('lhr-') && x.endsWith('.json')).map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const byUrl = new Map();
for (const r of all) { const u = r.finalDisplayedUrl || r.finalUrl; byUrl.set(u, [...(byUrl.get(u) || []), r]); }
for (const runs of byUrl.values()) {
  runs.sort((x, y) => (x.categories.performance?.score ?? 0) - (y.categories.performance?.score ?? 0));
  const r = runs[Math.floor(runs.length / 2)];
  console.log(`RUNS ${new URL(r.finalDisplayedUrl || r.finalUrl).pathname} perf scores: ${runs.map((x) => Math.round((x.categories.performance?.score ?? 0) * 100)).join(', ')}`);
  const c = r.categories;
  const pct = (k) => Math.round((c[k]?.score ?? 0) * 100);
  console.log(`LH ${new URL(r.finalDisplayedUrl || r.finalUrl).pathname} perf=${pct('performance')} a11y=${pct('accessibility')} best=${pct('best-practices')} seo=${pct('seo')} LCP=${r.audits['largest-contentful-paint']?.displayValue} CLS=${r.audits['cumulative-layout-shift']?.displayValue} TBT=${r.audits['total-blocking-time']?.displayValue}`);
  for (const k of ['accessibility', 'best-practices', 'seo']) {
    for (const ref of c[k]?.auditRefs || []) {
      const a = r.audits[ref.id];
      if (a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual') {
        console.log(`   FAIL ${k}: ${a.id} - ${a.title}`);
        for (const it of (a.details?.items || []).slice(0, 12)) console.log(`      > ${(it.node?.snippet || '').slice(0, 110)} | ${(it.node?.explanation || '').replace(/\s+/g, ' ').slice(0, 150)}`);
      }
    }
  }
  for (const id of ['largest-contentful-paint-element', 'lcp-breakdown-insight', 'layout-shifts', 'cls-culprits-insight', 'render-blocking-resources', 'render-blocking-insight', 'network-dependency-tree-insight', 'mainthread-work-breakdown', 'bootup-time', 'long-tasks', 'dom-size', 'total-byte-weight']) {
    const a = r.audits[id];
    if (a && a.details && /index\.html$/.test(new URL(r.finalDisplayedUrl || r.finalUrl).pathname) && !/\/(ai-agents|insights|technologies|contact)\//.test(r.finalDisplayedUrl || r.finalUrl)) console.log(`   DIAG ${id}: ${a.displayValue || ''} ${JSON.stringify(a.details).replace(/"(boundingRect|lhId|path|nodeLabel)":("[^"]*"|\{[^}]*\}),?/g, '').replace(/"headings":\[.*?\],"items"/, '"items"').replace(/http:\/\/localhost:\d+/g, '').slice(0, 900)}`);
  }
  const lcp = r.audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node;
  if (lcp) console.log(`   LCP element: ${lcp.snippet?.slice(0, 140)}`);
  for (const it of (r.audits['layout-shifts']?.details?.items || r.audits['layout-shift-elements']?.details?.items || []).slice(0, 4)) console.log(`   SHIFT ${it.score ?? ''}: ${(it.node?.snippet || '').slice(0, 140)}`);
  for (const id of ['render-blocking-resources', 'unused-javascript', 'font-display', 'unsized-images']) {
    const a = r.audits[id];
    if (a && a.score !== null && a.score < 1) console.log(`   PERF ${id}: ${a.displayValue || ''} ${(a.details?.items || []).slice(0, 4).map((i) => i.url || i.node?.snippet || '').join(' , ').slice(0, 260)}`);
  }
}
