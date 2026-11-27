import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://techlio.co',
  trailingSlash: 'always',
  // The stylesheet is written into each page so the first paint does not wait on a second request.
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
});
