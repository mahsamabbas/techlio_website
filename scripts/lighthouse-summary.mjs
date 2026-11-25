// Prints a one-line Lighthouse summary per page, plus the audits that failed, from the reports LHCI just collected.
import { readdirSync, readFileSync } from 'node:fs';
const dir = '.lighthouseci';
for (const f of readdirSync(dir).filter((x) => x.startsWith('lhr-') && x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
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
  const lcp = r.audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node;
  if (lcp) console.log(`   LCP element: ${lcp.snippet?.slice(0, 140)}`);
  for (const it of (r.audits['layout-shifts']?.details?.items || r.audits['layout-shift-elements']?.details?.items || []).slice(0, 4)) console.log(`   SHIFT ${it.score ?? ''}: ${(it.node?.snippet || '').slice(0, 140)}`);
  for (const id of ['render-blocking-resources', 'unused-javascript', 'font-display', 'unsized-images']) {
    const a = r.audits[id];
    if (a && a.score !== null && a.score < 1) console.log(`   PERF ${id}: ${a.displayValue || ''} ${(a.details?.items || []).slice(0, 4).map((i) => i.url || i.node?.snippet || '').join(' , ').slice(0, 260)}`);
  }
}
