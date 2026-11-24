// Post-build checks: internal links and anchors resolve, required contact facts appear on every page.
import { readdir, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { site } from '../src/site.mjs';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const pages = (await readdir(dist)).filter((f) => f.endsWith('.html'));
const html = Object.fromEntries(await Promise.all(pages.map(async (f) => [f, await readFile(path.join(dist, f), 'utf8')])));
const errors = [];

const ids = (doc) => new Set([...doc.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

for (const [file, doc] of Object.entries(html)) {
  for (const m of doc.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const [raw, hash] = ref.split('#');
    const p = raw.split('?')[0];
    const target = p === '' ? file : p;
    if (target.endsWith('.html')) {
      if (!html[target]) errors.push(`${file}: broken link ${ref}`);
      else if (hash && !ids(html[target]).has(hash)) errors.push(`${file}: missing anchor ${ref}`);
    } else {
      await access(path.join(dist, target)).catch(() => errors.push(`${file}: missing asset ${ref}`));
    }
  }
  const required = [site.email, site.phone, site.social.linkedin, site.social.x, ...site.offices.map((o) => o.address)];
  for (const fact of required) if (!doc.includes(fact)) errors.push(`${file}: missing required fact "${fact}"`);
  if (!/<title>[^<]+<\/title>/.test(doc)) errors.push(`${file}: missing <title>`);
  if ((doc.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${file}: expected exactly one <h1>`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Checked ${pages.length} pages: links, anchors, assets and contact facts OK`);
