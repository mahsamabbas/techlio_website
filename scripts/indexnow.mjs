// Tells Bing (and other IndexNow search engines) which pages changed, so they are recrawled within minutes.
// Usage: node scripts/indexnow.mjs [all]   (run after a build; reads dist/sitemap-0.xml)
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const HOST = 'techlio.co';
const KEY = '5106ae70e7560fe8abab55291c586cfa';
const all = process.argv[2] === 'all';

const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

let picked = urls;
if (!all) {
  let changed = [];
  try {
    changed = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    changed = [];
  }
  const content = changed.filter((f) => f.startsWith('content/'));
  const code = changed.some((f) => f.startsWith('src/') || f.startsWith('public/'));
  if (code) {
    picked = urls; // layout or template changes touch every page
  } else {
    const slugs = content.map((f) => f.split('/').pop().replace('.json', ''));
    const sections = new Set(content.map((f) => f.split('/')[1]));
    picked = urls.filter((u) => {
      const path = new URL(u).pathname;
      if (path === '/') return true;
      if (slugs.some((s) => path.endsWith('/' + s + '/'))) return true;
      if (sections.has('insights') && path === '/insights/') return true;
      if (sections.has('case-studies') && path === '/case-studies/') return true;
      if (sections.has('technologies') && path === '/technologies/') return true;
      return sections.has('settings') || sections.has('pages');
    });
  }
}

if (picked.length === 0) {
  console.log('IndexNow: nothing to submit');
  process.exit(0);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: picked }),
});
console.log(`IndexNow: submitted ${picked.length} of ${urls.length} URLs, status ${res.status}`);
