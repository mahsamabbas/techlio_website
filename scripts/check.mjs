// Post-build checks on dist/: internal links and anchors resolve, contact facts appear on every page.
import { readdir, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'content/settings/site.json'), 'utf8'));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = (await walk(dist)).filter((f) => !f.includes(`${path.sep}admin${path.sep}`) && !f.endsWith("chat-form.html")); // chat-form.html is a hidden form holder, not a page
const html = Object.fromEntries(await Promise.all(files.map(async (f) => [f, await readFile(f, 'utf8')])));
const ids = (doc) => new Set([...doc.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const errors = [];
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&#38;/g, '&');

for (const [file, doc] of Object.entries(html)) {
  const name = path.relative(dist, file);
  for (const m of doc.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const ref = unescape(m[1]);
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const [raw, hash] = ref.split('#');
    const p = raw.split('?')[0];
    let target = file;
    if (p) {
      if (!p.startsWith('/')) { errors.push(`${name}: relative link ${ref} (use a path starting with /)`); continue; }
      target = path.join(dist, p.endsWith('/') ? p + 'index.html' : p);
    }
    if (target.endsWith('.html')) {
      if (!html[target]) errors.push(`${name}: broken link ${ref}`);
      else if (hash && !ids(html[target]).has(hash)) errors.push(`${name}: missing anchor ${ref}`);
    } else {
      await access(target).catch(() => errors.push(`${name}: missing file ${ref}`));
    }
  }
  const required = [site.email, site.phone, site.linkedin, ...site.offices.map((o) => o.address)];
  for (const fact of required) if (!unescape(doc).includes(fact)) errors.push(`${name}: missing contact detail "${fact}"`);
  if ((doc.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${name}: expected exactly one <h1>`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Checked ${files.length} pages: links, anchors, files and contact details OK`);
