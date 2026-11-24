// Zero-dependency static build: src/pages/*.mjs -> dist/*.html, src/assets -> dist/assets
import { rm, mkdir, readdir, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { layout } from './src/layout.mjs';
import { site } from './src/site.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
const pagesDir = path.join(root, 'src', 'pages');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'src', 'assets'), path.join(out, 'assets'), { recursive: true });

const files = (await readdir(pagesDir)).filter((f) => f.endsWith('.mjs')).sort();
const built = [];
for (const file of files) {
  const mod = await import(pathToFileURL(path.join(pagesDir, file)).href);
  const page = mod.default;
  if (!page?.slug || !page?.title || !page?.body) {
    throw new Error(`${file}: page must export { slug, title, description, body }`);
  }
  await writeFile(path.join(out, `${page.slug}.html`), layout(page));
  built.push(page);
}

const urls = built
  .filter((p) => p.slug !== '404')
  .map((p) => `  <url><loc>${site.url}/${p.slug === 'index' ? '' : p.slug + '.html'}</loc></url>`)
  .join('\n');
await writeFile(
  path.join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${built.length} pages -> dist/`);
