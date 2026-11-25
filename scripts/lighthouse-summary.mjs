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
      if (a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual') console.log(`   FAIL ${k}: ${a.id} - ${a.title}`);
    }
  }
}
