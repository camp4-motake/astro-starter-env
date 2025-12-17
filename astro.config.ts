import alpinejs from '@astrojs/alpinejs';
import icon from 'astro-icon';
import relativeLinks from 'astro-relative-links';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    alpinejs({ entrypoint: '/src/scripts/entrypoint' }),
    icon(),
    relativeLinks(),
    {
      name: 'injectGlobalStyles',
      hooks: {
        'astro:config:setup': ({ injectScript }) => {
          // Force import global styles first
          injectScript('page-ssr', `import '/src/styles/global.css';`);
        },
      },
    },
  ],
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
