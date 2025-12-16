import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

import relativeLinks from 'astro-relative-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [icon(), relativeLinks()],
  vite: {
    css: { transformer: 'lightningcss' },
  },
  devToolbar: {
    enabled: false,
  },
  experimental: {
    preserveScriptOrder: true,
    headingIdCompat: true,
  },
});