/// <reference types="vitest" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      // --- Enable later if/when you want installable/offline support ---
      // VitePWA({
      //   registerType: 'autoUpdate',
      //   manifest: {
      //     name: 'Spellbook',
      //     short_name: 'Spellbook',
      //     start_url: '/',
      //     display: 'standalone',
      //     theme_color: '#000000',
      //     background_color: '#ffffff',
      //     icons: [
      //       { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      //       { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      //     ],
      //   },
      // }),
    ],

    base: env.VITE_BASE || '/',

    server: {
      host: true,
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    preview: {
      port: 4173,
      strictPort: true,
    },

    build: {
      target: 'es2022',
      sourcemap: false,
      // outDir: 'dist', // default
    },

    optimizeDeps: {
      include: [
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/notifications',
        '@mantine/modals',
        '@mantine/dates',
        'dayjs',
      ],
    },

    test: {
      globals: true,
      environment: 'happy-dom',
    },
  };
});
