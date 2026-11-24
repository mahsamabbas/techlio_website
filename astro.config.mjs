import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://techlio.co',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
});
